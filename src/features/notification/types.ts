import { Notification } from '@prisma/client';

export interface IMessage {
  follower: { avatar: string; username: string };
  commentedBy: string;
  post: {
    title: string;
    slug: string;
    author: string;
  };
}

export type INotification = Notification & {
  message: IMessage;
};
