import z from 'zod';

import { createRouter } from './context';

export const publicPostRouter = createRouter()
  .query('all', {
    resolve({ ctx }) {
      return ctx.prisma.post.findMany({
        include: {
          _count: {
            select: {
              comments: true,
            },
          },
          author: {
            select: {
              image: true,
              username: true,
            },
          },
        },
      });
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
  });
