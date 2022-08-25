import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createRouter } from './context';

export const userRouter = createRouter()
  .query('username', {
    input: z.object({
      username: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          _count: { select: { comment: true, postLikes: true } },
          posts: {
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            select: {
              title: true,
              slug: true,
              _count: true,
              publishedAt: true,
              content: true,
              id: true,
            },
          },
          followers: true,
          following: true,
          profile: {
            select: {
              about: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | null = null;
      if (user && user.posts && user.posts.length > limit) {
        const nextItem = user.posts.pop();
        nextCursor = nextItem!.id;
      }
      return { user, nextCursor };
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .mutation('edit-bio', {
    input: z.object({
      username: z.string().min(3),
    }),
    async resolve({ ctx, input: { username } }) {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.session?.user.userId,
        },
        data: {
          username,
        },
      });
    },
  });
