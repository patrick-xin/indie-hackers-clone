import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as trpc from '@trpc/server';
import ogs from 'open-graph-scraper';
import slugify from 'slugify';
import z from 'zod';

import { openai } from '@/utils/openai';

import { createRouter } from './context';

export const privatePostRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .query('all', {
    input: z.object({
      query: z.enum(['title', 'creation', 'published']),
    }),
    resolve({ ctx, input: { query } }) {
      const orderBy = () => {
        const order = 'asc' as Prisma.SortOrder;
        if (query === 'title') return { title: order };
        if (query === 'creation') return { createdAt: order };
        if (query === 'published') return { publishedAt: order };
        //if (query === 'comments') return { title: 'asc' };
        return { title: order };
      };

      return ctx.prisma.post.findMany({
        where: {
          authorId: ctx.session?.user.userId,
          AND: {
            status: query === 'published' ? 'PUBLISHED' : undefined,
          },
        },
        orderBy: orderBy(),
        include: { _count: { select: { comments: true } }, author: true },
      });
    },
  })
  .query('by-id', {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input: { id } }) {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id,
        },
      });

      return post;
    },
  })
  .mutation('create', {
    input: z.object({
      title: z.string(),
    }),
    async resolve({ ctx, input: { title } }) {
      const slug = `${slugify(title, {
        lower: true,
        trim: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })}-${faker.random.alphaNumeric(5)}`;
      try {
        const post = await ctx.prisma.post.create({
          data: {
            title,
            slug,
            content: '',
            author: {
              connect: {
                id: ctx.session?.user.userId as string,
              },
            },
            status: 'DRAFT',
          },
        });
        return post.id;
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .mutation('save', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      id: z.string(),
      type: z.string(),
    }),
    async resolve({ ctx, input: { title, content, id, type } }) {
      const slug = `${slugify(title, {
        lower: true,
        trim: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })}-${faker.random.alphaNumeric(5)}`;

      try {
        if (type === 'ARTICLE') {
          const savedPost = await ctx.prisma.post.update({
            where: {
              id,
            },
            data: {
              content,
              title,
              slug,
              postType: type,
            },
          });
          return savedPost;
        }
        if (type === 'LINK') {
          const options = {
            url: content,
          };
          const data = await ogs(options);
          const savedPost = await ctx.prisma.post.update({
            where: {
              id,
            },

            data: {
              content: JSON.stringify(data.result),
              title,
              slug,
              postType: type,
            },
          });
          return savedPost;
        }
      } catch (error) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Invalid URL',
        });
      }
    },
  })
  .mutation('format', {
    input: z.object({
      content: z.string(),
    }),
    async resolve({ ctx, input: { content } }) {
      try {
        const response = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `Correct this to standard English: ${content}`,
          temperature: 0,
          max_tokens: 60,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        });
        const data = response.data.choices[0].text;

        return { data };
      } catch (error) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Invalid URL',
        });
      }
    },
  })
  .mutation('publish', {
    input: z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
    }),
    async resolve({ ctx, input: { id, title, content } }) {
      const savedPost = ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          status: 'PUBLISHED',
        },
      });
      return savedPost;
    },
  })
  .mutation('unpublish', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const savedPost = ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          status: 'DRAFT',
        },
      });
      return savedPost;
    },
  })
  .query('test', {
    input: z.object({
      query: z.object({ page: z.number(), pageCount: z.number() }),
    }),
    async resolve({
      ctx,
      input: {
        query: { page, pageCount },
      },
    }) {
      const totalCount = await ctx.prisma.post.aggregate({
        _count: true,
        where: {
          authorId: ctx.session?.user.userId,
        },
      });
      const posts = await ctx.prisma.post.findMany({
        skip: page * pageCount,
        take: pageCount,
        where: {
          authorId: ctx.session?.user.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: { select: { comments: true, likes: true } },
          author: true,
        },
      });
      return {
        posts,
        hasMore: posts.length !== 0,
        totalCount: totalCount._count,
      };
    },
  })
  .query('draft', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const post = await ctx.prisma.post.findFirstOrThrow({
        where: {
          id,
          AND: { status: 'DRAFT' },
        },
        include: { author: { select: { image: true, username: true } } },
      });
      return post;
    },
  })
  .mutation('upvote', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const updatedPost = await ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          likes: {
            create: {
              user: {
                connect: {
                  username: ctx.session?.user.username,
                },
              },
            },
          },
        },
      });

      return updatedPost;
    },
  })
  .mutation('cancle-upvote', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const like = await ctx.prisma.postLike.findFirst({
        where: { postId: id },
        select: { id: true },
      });

      const updatedPost = await ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          likes: {
            delete: { id: like?.id },
          },
        },
      });

      return updatedPost;
    },
  })
  .mutation('addToBookmark', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const updatedPost = await ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          markedBy: { connect: { username: ctx.session?.user.username } },
        },
      });

      return updatedPost;
    },
  })
  .mutation('removeFromBookmark', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const updatedPost = await ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          markedBy: { disconnect: { username: ctx.session?.user.username } },
        },
      });

      return updatedPost;
    },
  })
  .mutation('report', {
    input: z.object({
      id: z.string(),
      reason: z.string(),
    }),
    async resolve({ ctx, input: { id, reason } }) {
      const post = await ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          report: {
            create: {
              reason,
            },
          },
        },
      });
      return post;
    },
  });
