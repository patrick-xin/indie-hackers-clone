import { TRPCError } from '@trpc/server';
import z from 'zod';

import { INotification } from '@/features/notification/types';

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
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { username },
        include: {
          profile: {
            select: {
              bio: true,
              fullName: true,
              location: true,
              twitter: true,
              publicEmail: true,
              birthday: true,
            },
          },
        },
      });

      const notifications = (await ctx.prisma.notification.findMany({
        where: { user: { username: ctx.session?.user.username } },
        orderBy: { createdAt: 'desc' },
      })) as INotification[];

      if (postId) {
        const post = await ctx.prisma.post.findUniqueOrThrow({
          where: { id: postId },
          include: {
            markedBy: { select: { username: true } },
            likes: { select: { user: { select: { username: true } } } },
          },
        });

        const canBookmark =
          post.markedBy.map((m) => m.username).indexOf(username as string) ??
          -1;
        const canLike =
          post.likes.map((m) => m.user.username).indexOf(username as string) ??
          -1;
        return {
          user,
          canLike,
          canBookmark,
          notifications,
          isFeaturedPost: post.isFeatured,
        };
      }

      return { user, notifications, notificationsCounts: notifications.length };
    },
  })
  .query('bookmarks', {
    // input: z.object({}),
    async resolve({ ctx }) {
      const username = ctx.session?.user.username;
      const bookmarks = await ctx.prisma.user.findUniqueOrThrow({
        where: { username },
        select: {
          bookmarks: {
            select: {
              title: true,
              slug: true,
              postType: true,
              id: true,
              author: { select: { username: true } },
            },
          },
        },
      });

      return bookmarks;
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
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session?.user.userId },
        data: {
          username,
          usernameUpdatedAt: new Date(),
        },
      });

      return { message: `username updated`, user };
    },
  })
  .mutation('edit-bio', {
    input: z.object({
      fullName: z.string().optional(),
      twitter: z.string().url().optional(),
      publicEmail: z.string().email().optional(),
      bio: z.string().optional(),
      location: z.string().optional(),
      birthday: z.string().optional(),
    }),
    async resolve({
      ctx,
      input: { fullName, twitter, publicEmail, bio, location, birthday },
    }) {
      try {
        await ctx.prisma.user.update({
          where: {
            id: ctx.session?.user.userId,
          },
          data: {
            profile: {
              upsert: {
                create: {
                  fullName,
                  location,
                  twitter,
                  publicEmail,
                  bio,
                  birthday,
                },
                update: {
                  fullName,
                  location,
                  twitter,
                  publicEmail,
                  bio,
                  birthday,
                },
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .mutation('pin-featured-post', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ ctx, input: { postId } }) {
      try {
        await ctx.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            isFeatured: true,
          },
        });
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .mutation('unpin-featured-post', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ ctx, input: { postId } }) {
      try {
        await ctx.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            isFeatured: false,
          },
        });
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  });
