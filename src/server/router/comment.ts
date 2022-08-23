import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createRouter } from './context';

export const commentRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .query('by-post-slug', {
    input: z.object({ slug: z.string() }),
    async resolve({ ctx, input: { slug } }) {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          post: { slug },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: { user: true },
      });
      return comments;
    },
  })
  .mutation('create', {
    input: z.object({
      content: z.string(),
      postId: z.string(),
      parentId: z.string().optional(),
    }),
    async resolve({ ctx, input: { content, postId, parentId } }) {
      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            content,
            parentId,
            postId,
            userId: ctx.session?.user.userId as string,
          },
        });

        return comment;
      } catch (error) {
        console.error(error);
      }
    },
  });
