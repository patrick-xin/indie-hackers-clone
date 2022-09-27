import { Comment, Post, Prisma, Profile, User } from '@prisma/client';

export type CommentOnUser = Comment & {
  user: Pick<User, 'username' | 'image'>;
};

export type PostOnUser = Post & {
  author: Pick<User, 'username' | 'image'>;
  _count: {
    comments: number;
    likes: number;
    markedBy: number;
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

type ValueOf<T> = T[keyof T];
type PickByValue<T, V extends T[keyof T]> = {
  [K in Exclude<
    keyof T,
    ValueOf<{ [P in keyof T]: T[P] extends V ? never : P }>
  >]: T[K];
};
type KeyOfValue<T, V extends T[keyof T]> = keyof PickByValue<T, V>;
type PickValueByKey<T, K> = K extends keyof T ? T[K] : never;

interface ModelMap {
  Post: Post;
  User: User;
  Profile: Profile;
}
interface SelectMap {
  Post: Prisma.PostSelect;
  User: Prisma.UserSelect;
  Profile: Prisma.ProfileSelect;
}
interface PayloadMap<S extends string | number | symbol> {
  Post: Prisma.PostGetPayload<{ select: { [K in S]: true } }>;
  User: Prisma.UserGetPayload<{ select: { [K in S]: true } }>;
  Profile: Prisma.ProfileGetPayload<{ select: { [K in S]: true } }>;
}
type FullModelType<
  M extends ValueOf<ModelMap>,
  N = KeyOfValue<ModelMap, M>,
  S = Required<PickValueByKey<SelectMap, N>>
> = PickValueByKey<PayloadMap<keyof S>, N>;

type PostType = {
  type: string;
  id: string;
  slug: string;
  title: string;
  publishedAt: Date;
  content: string;
  author: { username: string; id: string };
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
    author: { username: string; id: string };
  };
};

export type Combined = UnionToType<PostType | CommentType>;

export type UserProfile = User & { profile: Profile };
