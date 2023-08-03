import { Prisma } from '@prisma/client';
import {
  addDays,
  endOfMonth,
  parseISO,
  startOfMonth,
  subMonths,
  subWeeks,
} from 'date-fns';
import z from 'zod';

import { POST_FEED_COUNT } from '@/lib/constants';

import { PostFeed } from '@/features/post/types';

import { createRouter } from './context';

export const publicPostRouter = createRouter()
  .query('all', {
    input: z.object({
      query: z.enum(['newest', 'popular', '']),
    }),
    async resolve({ ctx, input: { query } }) {
      const orderBy = () => {
        const order = 'desc' as Prisma.SortOrder;

        if (query === 'newest') return { publishedAt: order };
        if (query === 'popular') return { likes: { _count: order } };
        return { comments: { _count: order } };
      };
      // TODO select different date range
      const posts = await ctx.prisma.post.findMany({
        select: {
          id: true,
        },
        orderBy: orderBy(),

        // include: {
        //   _count: {
        //     select: {
        //       comments: true,
        //     },
        //   },

        //   author: {
        //     select: {
        //       image: true,
        //       username: true,
        //     },
        //   },
        // },
      });

      return { posts };
    },
  })
  .query('by-slug', {
    input: z.object({ username: z.string(), slug: z.string() }),
    async resolve({ ctx, input: { username, slug } }) {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          username,
        },
        select: {
          posts: {
            where: { slug },
            include: {
              author: { select: { username: true, image: true, id: true } },
              comments: {
                include: { user: { select: { username: true, image: true } } },
              },
              _count: {
                select: { comments: true, likes: true, markedBy: true },
              },
            },
          },
        },
      });
      const post = user.posts[0];

      return post;
    },
  })
  .query('infinitePosts-popular-today', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate());
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      const endDate = new Date(startDate);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { likes: { _count: 'desc' } },
        where: {
          publishedAt: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        include: {
          author: true,
          comments: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
      });

      let nextCursor: typeof cursor | null = null;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    },
  })
  .query('popular-today', {
    input: z.object({
      page: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { page } = input;
      const _page = page ? page - 1 : 1;
      const pageCount = 10;
      let count = 1;
      count += _page * pageCount;
      const startDate = new Date();
      startDate.setDate(startDate.getDate());
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      const endDate = new Date(startDate);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      const allPostsToday = await ctx.prisma.post.aggregate({
        _count: true,
        where: {
          publishedAt: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
      });

      const posts = await ctx.prisma.post.findMany({
        skip: _page * pageCount,
        take: pageCount,
        orderBy: { likes: { _count: 'desc' } },
        where: {
          publishedAt: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        include: {
          author: true,
          comments: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
      });

      return {
        posts,
        hasMore: count < allPostsToday._count,
      };
    },
  })
  .query('infinitePosts-popular', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      query: z.string(),
      type: z.string(),
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 50;
      const { cursor, query, type } = input;
      let posts;
      const startDate = parseISO(query);
      let endDate;
      if (type === 'week') {
        endDate = subWeeks(startDate, 1);
        posts = await ctx.prisma.post.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { comments: { _count: 'desc' } },
          where: {
            publishedAt: {
              gte: endDate.toISOString(),
              lte: startDate.toISOString(),
            },
          },
          include: {
            author: true,
            comments: true,
            _count: {
              select: { likes: true, comments: true },
            },
          },
        });
      } else if (type === 'month') {
        endDate = subMonths(startDate, 1);
        posts = await ctx.prisma.post.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { likes: { _count: 'desc' } },
          where: {
            publishedAt: {
              gte: startOfMonth(startDate).toISOString(),
              lte: endOfMonth(startDate).toISOString(),
            },
          },
          include: {
            author: true,
            comments: true,
            _count: {
              select: { likes: true, comments: true },
            },
          },
        });
      } else {
        posts = await ctx.prisma.post.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { comments: { _count: 'desc' } },
          include: {
            author: true,
            comments: true,
            _count: {
              select: { likes: true, comments: true },
            },
          },
        });
      }
      let nextCursor: typeof cursor | null = null;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }
      return {
        posts,
        nextCursor,
      };
    },
  })
  .query('infinitePosts-newest', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
          comments: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
      });
      let nextCursor: typeof cursor | null = null;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts: items,
        nextCursor,
      };
    },
  })
  .query('newest', {
    input: z.object({
      page: z.number(),
    }),
    async resolve({ ctx, input: { page } }) {
      const _page = page ? page - 1 : 1;
      const pageCount = POST_FEED_COUNT;
      const posts = await ctx.prisma.post.findMany({
        skip: _page * pageCount,
        take: pageCount,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { username: true, image: true } },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      });

      return {
        posts,
      };
    },
  })
  .query('popular', {
    input: z.object({
      page: z.number(),
      query: z.string(),
      type: z.string(),
    }),
    async resolve({ ctx, input: { page, type, query } }) {
      const _page = page ? page - 1 : 1;
      const pageCount = POST_FEED_COUNT;
      let posts: PostFeed[];
      const startDate = addDays(parseISO(query), 1);

      let endDate: Date;
      if (type === 'week') {
        endDate = subWeeks(startDate, 1);

        posts = await ctx.prisma.post.findMany({
          skip: _page * pageCount,
          take: pageCount,
          orderBy: { comments: { _count: 'desc' } },
          where: {
            publishedAt: {
              gte: endDate,
              lte: startDate,
            },
          },
          include: {
            author: true,
            comments: true,
            _count: {
              select: { likes: true, comments: true },
            },
          },
        });
      } else if (type === 'month') {
        endDate = subMonths(startDate, 1);
        posts = await ctx.prisma.post.findMany({
          skip: _page * pageCount,
          take: pageCount,
          orderBy: { likes: { _count: 'desc' } },
          where: {
            publishedAt: {
              gte: startOfMonth(startDate).toISOString(),
              lte: endOfMonth(startDate).toISOString(),
            },
          },
          include: {
            author: true,
            comments: true,
            _count: {
              select: { likes: true, comments: true },
            },
          },
        });
      } else {
        posts = await ctx.prisma.post.findMany({
          skip: _page * pageCount,
          take: pageCount,
          orderBy: { comments: { _count: 'desc' } },
          include: {
            author: true,
            comments: true,
            _count: {
              select: { likes: true, comments: true },
            },
          },
        });
      }

      return {
        posts,
      };
    },
  })
  .query('search', {
    input: z.object({
      query: z.string(),
      order: z.enum(['recent', 'popular', 'oldest', 'discussed']),
    }),
    async resolve({ ctx, input: { query, order } }) {
      const orderBy = () => {
        const _orderDesc = 'desc' as Prisma.SortOrder;
        const _orderAsc = 'asc' as Prisma.SortOrder;
        if (order === 'recent') return { createdAt: _orderDesc };
        if (order === 'oldest') return { createdAt: _orderAsc };
        if (order === 'popular') return { likes: { _count: _orderDesc } };
        if (order === 'discussed')
          return { post: { comments: { _count: _orderDesc } } };
        return { comments: { _count: order } };
      };
      const posts = await ctx.prisma.post.findMany({
        where: {
          content: { contains: query },
          AND: { title: { contains: query } },
        },
        take: 10,
        orderBy: orderBy(),
        include: {
          author: { select: { username: true, image: true } },
          _count: { select: { comments: true, likes: true } },
          comments: {
            where: { content: { contains: query } },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      const postsCount = await ctx.prisma.post.aggregate({
        where: {
          content: { contains: query },
          OR: { title: { contains: query } },
        },
        _count: true,
      });
      const groups = await ctx.prisma.group.findMany({
        where: { name: { contains: query } },
        take: 12,
        include: { _count: { select: { members: true } } },
      });
      const groupsCount = await ctx.prisma.group.aggregate({
        where: { name: { contains: query } },
        _count: true,
      });
      const users = await ctx.prisma.user.findMany({
        where: { username: { contains: query } },
        take: 6,
      });
      const usersCount = await ctx.prisma.user.aggregate({
        where: { username: { contains: query } },
        _count: true,
      });
      return {
        posts,
        postsCount,
        groups,
        groupsCount,
        users,
        usersCount,
      };
    },
  })
  .query('search-discussions', {
    input: z.object({
      page: z.number(),
      query: z.string(),
      order: z.enum(['recent', 'popular', 'oldest', 'discussed']),
    }),
    async resolve({ ctx, input: { page, query, order } }) {
      const orderBy = () => {
        const _orderDesc = 'desc' as Prisma.SortOrder;
        const _orderAsc = 'asc' as Prisma.SortOrder;
        if (order === 'recent') return { createdAt: _orderDesc };
        if (order === 'oldest') return { createdAt: _orderAsc };
        if (order === 'popular') return { likes: { _count: _orderDesc } };
        if (order === 'discussed')
          return { post: { comments: { _count: _orderDesc } } };
        return { comments: { _count: order } };
      };
      const _page = page ? page - 1 : 1;
      const pageCount = 10;
      const posts = await ctx.prisma.post.findMany({
        where: {
          content: { contains: query },
          AND: { title: { contains: query } },
        },
        skip: _page * pageCount,
        take: pageCount,
        orderBy: orderBy(),
        include: {
          author: { select: { username: true, image: true } },
          _count: { select: { comments: true, likes: true } },
          comments: {
            where: { content: { contains: query } },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      return posts;
    },
  })
  .query('search-groups', {
    input: z.object({
      page: z.number(),
      query: z.string(),
    }),
    async resolve({ ctx, input: { page, query } }) {
      const _page = page ? page - 1 : 1;
      const pageCount = 10;
      const groups = await ctx.prisma.group.findMany({
        where: { name: { contains: query } },
        skip: _page * pageCount,
        take: pageCount,
        include: { _count: { select: { members: true } } },
      });
      return groups;
    },
  })
  .query('search-users', {
    input: z.object({
      page: z.number(),
      query: z.string(),
    }),
    async resolve({ ctx, input: { page, query } }) {
      const _page = page ? page - 1 : 1;
      const pageCount = 6;
      const users = await ctx.prisma.user.findMany({
        where: { username: { contains: query } },
        skip: _page * pageCount,
        take: pageCount,
      });
      return users;
    },
  });
