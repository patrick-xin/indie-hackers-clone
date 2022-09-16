import { TRPCError } from '@trpc/server';
import z from 'zod';

import { Combined } from '@/features/post/types';

import { createRouter } from './context';

export const userRouter = createRouter()
  .query('username', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input, ctx }) {
      try {
        const user = await ctx.prisma.user.findUniqueOrThrow({
          where: {
            username: input.username,
          },
          include: {
            _count: { select: { comment: true, postLikes: true } },

            followers: true,
            followings: true,

            profile: {
              select: {
                bio: true,
                fullName: true,
                location: true,
                publicEmail: true,
                twitter: true,
                birthday: true,
              },
            },
          },
        });

        return user;
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('username-featured', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          username: input.username,
        },
        include: {
          _count: {
            select: {
              comment: true,
              postLikes: true,
              followers: true,
              followings: true,
            },
          },
          posts: {
            where: { isFeatured: true },
            orderBy: { createdAt: 'desc' },
            select: {
              title: true,
              slug: true,
              _count: true,
              publishedAt: true,
              content: true,
              id: true,
            },
          },
          profile: {
            select: {
              bio: true,
              fullName: true,
              location: true,
              publicEmail: true,
              twitter: true,
              birthday: true,
            },
          },
        },
      });

      return user;
    },
  })
  .query('username-history', {
    input: z.object({
      username: z.string(),
      page: z.number(),
      pageCount: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { page, pageCount, username } = input;

      try {
        const user = await ctx.prisma.user.findUniqueOrThrow({
          where: {
            username,
          },
          include: {
            comment: {
              skip: page * pageCount,
              take: pageCount,
              orderBy: { createdAt: 'desc' },
              include: {
                post: { select: { slug: true, id: true, title: true } },
              },
            },
            posts: {
              skip: page * pageCount,
              take: pageCount,
              orderBy: { createdAt: 'desc' },
              select: {
                title: true,
                slug: true,
                publishedAt: true,
                content: true,
                id: true,
              },
            },
          },
        });

        const posts = [...user.posts].map((p) => ({
          ...p,
          createdAt: p.publishedAt,
          type: 'post',
        }));
        const comments = [...user.comment].map((p) => ({
          ...p,
          createdAt: p.createdAt,
          type: 'comment',
        }));

        const result = [...posts, ...comments].sort(
          (a, b) => Number(b.createdAt) - Number(a.createdAt)
        ) as Combined[];

        return { result, user };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('username-bookmark', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { username } = input;

      try {
        const user = await ctx.prisma.user.findUniqueOrThrow({
          where: {
            username,
          },
          include: {
            _count: {
              select: {
                comment: true,
                postLikes: true,
                followers: true,
                followings: true,
              },
            },
            bookmarks: {
              select: {
                author: { select: { username: true } },
                title: true,
                content: true,
                id: true,
                slug: true,
              },
            },
            profile: {
              select: {
                bio: true,
                fullName: true,
                location: true,
                publicEmail: true,
                twitter: true,
                birthday: true,
              },
            },
          },
        });
        return user;
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('username-follows', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { username } = input;

      try {
        const user = await ctx.prisma.user.findUniqueOrThrow({
          where: {
            username,
          },
          include: {
            _count: {
              select: {
                followers: true,
                followings: true,
              },
            },
            followings: {
              select: {
                follower: { select: { username: true, image: true, id: true } },
              },
            },
            followers: {
              select: {
                following: {
                  select: { username: true, image: true, id: true },
                },
              },
            },
            profile: true,
          },
        });

        const userId = ctx.session?.user.userId as string;
        const hasFollowed = user.followings
          .map((following) => following.follower.id)
          .includes(userId);

        return { hasFollowed, user };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .mutation('edit-username', {
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
  })
  .mutation('follow', {
    input: z.object({
      followerUsername: z.string(),
    }),
    async resolve({ ctx, input: { followerUsername } }) {
      await ctx.prisma.follows.create({
        data: {
          follower: { connect: { username: ctx.session?.user.username } },
          following: { connect: { username: followerUsername } },
          notification: {
            create: {
              notificationType: 'FOLLOWER',
              user: { connect: { username: followerUsername } },
              message: {
                content: `starts following you.`,
                follower: {
                  username: ctx.session?.user.username,
                  avatar: ctx.session?.user.image,
                },
              },
            },
          },
        },
      });
    },
  })
  .mutation('unfollow', {
    input: z.object({
      unfollowerUsername: z.string(),
    }),
    async resolve({ ctx, input: { unfollowerUsername } }) {
      const follows = await ctx.prisma.follows.findFirst({
        where: {
          followerId: ctx.session?.user.userId,
          AND: {
            following: { username: unfollowerUsername },
          },
        },
      });
      await ctx.prisma.follows.delete({
        where: {
          id: follows?.id,
        },
      });
    },
  });
