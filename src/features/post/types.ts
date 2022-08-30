import { Comment, Post, Prisma, User } from '@prisma/client';

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

export type UserProfile = Prisma.UserGetPayload<{
  include: {
    _count?: {
      select: {
        comment: true;
        postLikes: true;
        followers: true;
        followings: true;
      };
    };
    posts?: {
      where: { isFeatured: true };
      orderBy: { createdAt: 'desc' };
      select: {
        title: true;
        slug: true;
        _count: true;
        publishedAt: true;
        content: true;
        id: true;
      };
    };
    comment?: {
      include: { post: { select: { title: true; id: true; slug: true } } };
    };
    profile?: {
      select: {
        about: true;
      };
    };
  };
}>;
