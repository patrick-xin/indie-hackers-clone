import { Prisma } from '@prisma/client';
import {
  endOfMonth,
  parseISO,
  startOfMonth,
  subMonths,
  subWeeks,
} from 'date-fns';
import z from 'zod';

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
        // orderBy: orderBy(),

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
      console.log(posts);

      return { posts };
    },
  })
  .query('by-slug', {
    input: z.object({ username: z.string(), slug: z.string() }),
    async resolve({ ctx, input: { username, slug } }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          posts: {
            where: { slug },
            include: { author: true },
          },
        },
      });
      const post = user?.posts[0];
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
          orderBy: { likes: { _count: 'desc' } },
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
          orderBy: { likes: { _count: 'desc' } },
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
  });
