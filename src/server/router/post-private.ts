import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
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
          authorId: ctx.session?.user.id,
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
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: ctx.session?.user.username,
        },
        select: {
          posts: {
            where: { id },
          },
        },
      });
      const post = user?.posts[0];
      if (post) {
        return post;
      } else {
        return false;
      }
    },
  })
  .mutation('save', {
    input: z.object({
      title: z.string().optional(),
      content: z.string(),
      id: z.string(),
      slug: z.string(),
      categories: z.array(z.string()),
    }),
    async resolve({ ctx, input: { title, content, id, slug, categories } }) {
      const postTitle =
        title && title?.trim().length !== 0 ? title : 'Untitled';

      const savedPost = await ctx.prisma.post.upsert({
        where: {
          id,
        },
        create: {
          id,
          title: postTitle,
          content,
          author: { connect: { username: ctx.session?.user.username } },
          slug,
          status: 'DRAFT',
          category: {
            connectOrCreate: categories.map((tag) => {
              return {
                where: { name: tag },
                create: { name: tag },
              };
            }),
          },
        },
        update: {
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
