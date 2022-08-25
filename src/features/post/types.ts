import { Comment, Post, User } from '@prisma/client';

export type CommentOnUser = Comment & {
  user: Pick<User, 'username' | 'image'>;
};

export type PostOnUser = Post & {
  author: Pick<User, 'username' | 'image'>;
  _count: {
    comments: number;
    likes: number;
  };
};
