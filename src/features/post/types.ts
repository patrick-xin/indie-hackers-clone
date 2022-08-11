import { Comment, User } from '@prisma/client';

export type CommentOnUser = Comment & {
  user: User;
};
