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
        const post = await ctx.prisma.post.findUniqueOrThrow({
          where: { id: postId },
          include: { author: { select: { id: true, username: true } } },
        });
        if (post.author.id === ctx.session?.user.userId) {
          const comment = await ctx.prisma.comment.create({
            data: {
              content,
              parentId,
              postId,
              userId: ctx.session?.user.userId as string,
            },
          });

          return comment;
        }
        const comment = await ctx.prisma.comment.create({
          data: {
            content,
            parentId,
            postId,
            userId: ctx.session?.user.userId as string,
            notification: {
              create: {
                notificationType: 'COMMENT',
                message: {
                  commentedBy: ctx.session?.user.username,
                  post: {
                    slug: post.slug,
                    title: post.title,
                    author: post.author.username,
                  },
                },
                user: { connect: { id: post.author.id } },
              },
            },
          },
        });

        return comment;
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .mutation('update', {
    input: z.object({
      commentId: z.string(),
      content: z.string(),
    }),
    async resolve({ ctx, input: { commentId, content } }) {
      try {
        const comment = await ctx.prisma.comment.update({
          where: { id: commentId },
          data: {
            content,
          },
        });

        return comment;
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .mutation('delete', {
    input: z.object({
      commentId: z.string(),
    }),
    async resolve({ ctx, input: { commentId } }) {
      try {
        const comment = await ctx.prisma.comment.delete({
          where: { id: commentId },
        });

        return comment;
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  });
