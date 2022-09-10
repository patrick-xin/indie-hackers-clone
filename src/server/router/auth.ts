import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createRouter } from './context';

export const authRouter = createRouter()
  .query('getSession', {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .query('me', {
    input: z.object({
      postId: z.string().optional(),
    }),
    async resolve({ ctx, input: { postId } }) {
      const username = ctx.session?.user.username;
      const user = (await ctx.prisma.user.findUnique({
        where: { username },
      })) as User;
      const notifications = await ctx.prisma.notification.findMany({
        where: { user: { username: ctx.session?.user.username } },
      });
      if (postId) {
        const post = await ctx.prisma.post.findUnique({
          where: { id: postId },
          include: {
            markedBy: { select: { username: true } },
            likes: { select: { user: { select: { username: true } } } },
          },
        });

        const canBookmark =
          post?.markedBy.map((m) => m.username).indexOf(username as string) ??
          -1;
        const canLike =
          post?.likes.map((m) => m.user.username).indexOf(username as string) ??
          -1;
        return { user, canLike, canBookmark, notifications };
      }

      return { user, notifications, notificationsCounts: notifications.length };
    },
  })
  .mutation('read-notification-by-id', {
    input: z.object({
      notificationId: z.string(),
    }),
    async resolve({ ctx, input: { notificationId } }) {
      await ctx.prisma.notification.delete({ where: { id: notificationId } });
    },
  })
  .mutation('read-notification-all', {
    async resolve({ ctx }) {
      await ctx.prisma.notification.deleteMany({
        where: { user: { id: ctx.session?.user.userId } },
      });
    },
  })
  .mutation('change-username', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ ctx, input: { username } }) {
      const isExisting = await ctx.prisma.user.findUnique({
        where: { username },
      });
      if (isExisting)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `${username} has been taken.`,
        });
      await ctx.prisma.user.update({
        where: { id: ctx.session?.user.userId },
        data: {
          username,
        },
      });
      return { message: `username updated` };
    },
  });
