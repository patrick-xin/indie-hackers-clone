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

export type PostFeed = Post & {
  comments: Comment[];
  author: User;
  _count: {
    comments: number;
    likes: number;
  };
};

export type UnionToType<U extends Record<string, unknown>> = {
  [K in U extends unknown ? keyof U : never]: U extends unknown
    ? K extends keyof U
      ? U[K]
      : never
    : never;
};

type PostType = {
  type: string;
  id: string;
  slug: string;
  title: string;
  publishedAt: Date;
  content: string;
};

type CommentType = {
  createdAt: Date;
  type: string;
  id: string;
  postId: string;
  content: string;
  userId: string;
  replyId: string | null;
  parentId: string | null;
  post: {
    id: string;
    slug: string;
    title: string;
  };
};

export type Combined = UnionToType<PostType | CommentType>;
