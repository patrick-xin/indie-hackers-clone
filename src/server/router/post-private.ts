import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import slugify from 'slugify';
import z from 'zod';

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
        console.log(post);
        return post.id;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation('save', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input: { title, content, id } }) {
      const slug = `${slugify(title)}-${faker.random.alphaNumeric(5)}`;
      const savedPost = await ctx.prisma.post.update({
        where: {
          id,
        },

        data: {
          content,
          title,
          slug,
        },
      });
      return savedPost;
    },
  })
  .mutation('publish', {
    input: z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
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
  });
