import { TRPCError } from '@trpc/server';
import z from 'zod';

import { Combined } from '@/features/post/types';

import { createRouter } from './context';

export const userRouter = createRouter()
  .query('username', {
    input: z.object({
      username: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      query: z.enum(['all', 'post', 'comment']),
    }),
    async resolve({ input, ctx }) {
      const limit = input.limit ?? 50;
      const { cursor, query } = input;

      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
          include: {
            _count: { select: { comment: true, postLikes: true } },
            comment: {
              take: limit + 1,
              cursor: cursor ? { id: cursor } : undefined,
              orderBy: { createdAt: 'desc' },
              include: {
                post: { select: { slug: true, id: true, title: true } },
              },
            },
            posts: {
              take: limit + 1,
              cursor: cursor ? { id: cursor } : undefined,
              orderBy: { createdAt: 'desc' },
              select: {
                title: true,
                slug: true,
                publishedAt: true,
                content: true,
                id: true,
              },
            },
            followers: true,
            followings: true,

            profile: {
              select: {
                about: true,
              },
            },
          },
        });
        if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
        let nextItem;
        let nextCursor: typeof cursor | null = null;

        if (
          query === 'comment' &&
          user.comment &&
          user.comment.length > limit
        ) {
          nextItem = user.comment.pop();

          nextCursor = nextItem!.id;
          return { user, nextCursor, data: user.comment };
        }
        if (query === 'post' && user.posts && user.posts.length > limit) {
          nextItem = user.posts.pop();
          nextCursor = nextItem!.id;
          return { user, nextCursor, data: user.posts };
        }

        if (query === 'all') {
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
          type PostType = typeof posts[0];
          type CommentType = typeof comments[0];

          type UnionToType<U extends Record<string, unknown>> = {
            [K in U extends unknown ? keyof U : never]: U extends unknown
              ? K extends keyof U
                ? U[K]
                : never
              : never;
          };
          type Combined = UnionToType<PostType | CommentType>;

          const data = [...posts, ...comments].sort(
            (a, b) => Number(b.createdAt) - Number(a.createdAt)
          ) as Combined[];
          if (data.length > limit) nextItem = data.pop();
          nextCursor = nextItem!.id;
          return { nextCursor, data, user };
        }
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
      const user = await ctx.prisma.user.findUnique({
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
              about: true,
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
        const user = await ctx.prisma.user.findUnique({
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
        if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

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
        const user = await ctx.prisma.user.findUnique({
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
                slug:true
              },
            },
            profile: {
              select: {
                about: true,
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
        const user = await ctx.prisma.user.findUnique({
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
          },
        });
        if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
        const userId = ctx.session?.user.userId as string;
        const hasFollowed = user?.followings
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
  })
  .mutation('follow', {
    input: z.object({
      followerId: z.string(),
    }),
    async resolve({ ctx, input: { followerId } }) {
      await ctx.prisma.follows.create({
        data: {
          follower: { connect: { id: ctx.session?.user.userId } },
          following: { connect: { id: followerId } },
          notification: {
            create: {
              notificationType: 'FOLLOWER',
              userId: followerId,
              message: {
                content: `starts following you.`,
                follower: ctx.session?.user.username,
              },
            },
          },
        },
      });
    },
  })
  .mutation('unfollow', {
    input: z.object({
      unfollowerId: z.string(),
    }),
    async resolve({ ctx, input: { unfollowerId } }) {
      const follows = await ctx.prisma.follows.findFirst({
        where: {
          followerId: ctx.session?.user.userId,
          AND: { followingId: unfollowerId },
        },
      });
      await ctx.prisma.follows.delete({
        where: {
          id: follows?.id,
        },
      });
    },
  });
