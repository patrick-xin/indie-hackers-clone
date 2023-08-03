import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createRouter } from './context';

export const groupRouter = createRouter()
  .query('by-slug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { slug } = input;

      try {
        const groupInfo = await ctx.prisma.group.findUnique({
          where: { slug },
          include: {
            _count: { select: { members: true } },
            createdBy: { select: { username: true } },
            members: { select: { username: true } },
          },
        });
        if (!groupInfo) throw new TRPCError({ code: 'NOT_FOUND' });
        const isMember =
          groupInfo.members.find(
            (m) => m.username === ctx.session?.user.username
          ) ?? false;

        return {
          groupInfo,
          isMember,
        };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('by-slug-feeds', {
    input: z.object({
      slug: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const { slug, cursor } = input;

      const limit = input.limit ?? 50;

      try {
        const data = await ctx.prisma.group.findUnique({
          where: { slug },
          include: {
            post: {
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
            },
          },
        });

        let nextCursor: typeof cursor | null = null;
        if (data && data.post.length > limit) {
          const nextItem = data.post.pop();
          nextCursor = nextItem!.id;
        }
        return {
          posts: data?.post,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('by-slug-members', {
    input: z.object({
      slug: z.string(),
      page: z.number(),
      pageCount: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { slug, page, pageCount } = input;

      try {
        const data = await ctx.prisma.group.findUnique({
          where: { slug },
          select: {
            members: {
              skip: page * pageCount,
              take: pageCount,
              select: { username: true, id: true, image: true, profile: true },
            },
          },
        });
        if (!data) throw new TRPCError({ code: 'NOT_FOUND' });

        return data.members;
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
  .mutation('join', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input: { slug } }) {
      return await ctx.prisma.group.update({
        where: {
          slug,
        },
        data: {
          members: { connect: { username: ctx.session?.user.username } },
        },
      });
    },
  })
  .mutation('leave', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input: { slug } }) {
      return await ctx.prisma.group.update({
        where: {
          slug,
        },
        data: {
          members: { disconnect: { username: ctx.session?.user.username } },
        },
      });
    },
  });
