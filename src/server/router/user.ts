import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createRouter } from './context';

export const userRouter = createRouter()
  .query('username', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input: { username }, ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          _count: { select: { comment: true, postLikes: true } },
          posts: {
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
      return user;
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
