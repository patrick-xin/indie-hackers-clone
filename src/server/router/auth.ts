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
      const user = await ctx.prisma.user.findUnique({
        where: { username },
      });
      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
        include: {
          markedBy: { select: { username: true } },
          likes: { select: { user: { select: { username: true } } } },
        },
      });
      const canBookmark =
        post?.markedBy.map((m) => m.username).indexOf(username as string) ?? -1;
      const canLike =
        post?.likes.map((m) => m.user.username).indexOf(username as string) ??
        -1;

      return { user, canLike, canBookmark };
    },
  });
