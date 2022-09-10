import { Notification, Prisma } from '@prisma/client';
import { format } from 'date-fns';
import Image from 'next/future/image';
import Link from 'next/link';
import { BsCheck } from 'react-icons/bs';
import { Check } from 'tabler-icons-react';

import { UserPageLayout } from '@/features/layout/UserPage';
import { Button, IconButton } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const UserPage = () => {
  const { data } = trpc.useQuery(['auth.me', { postId: undefined }]);
  console.log(data);
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('auth.read-notification-all', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  return (
    <div>
      {data && (
        <UserPageLayout user={data.user}>
          <div className='mb-8 flex gap-4'>
            <h3 className='text-3xl text-white'>
              {data.notificationsCounts === 0
                ? 'No Unread Notifications'
                : `${data.notificationsCounts} Unread Notifications`}
            </h3>
            {data.notificationsCounts !== 0 && (
              <Button
                variant='outline'
                icon={<Check />}
                onClick={() => mutate()}
              >
                Mark All Read
              </Button>
            )}
          </div>
          <NoticicationList notifications={data.notifications} />
        </UserPageLayout>
      )}
    </div>
  );
};

export default UserPage;

type IMessage = {
  follower: { avatar: string; username: string };
  commentedBy: string;
  post: {
    title: string;
    slug: string;
  };
} & Prisma.JsonValue;

type INotification = Notification & {
  message: IMessage;
};

const NoticicationBox = ({ notification }: { notification: INotification }) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('auth.read-notification-by-id', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  switch (notification.notificationType) {
    case 'COMMENT':
      return (
        <div className='space-y-6'>
          <div className='text-lg text-brand-blue'>
            {format(notification.createdAt, 'MMMM dd')}
          </div>
          <div className='notification relative rounded bg-[#172E43] p-4 text-lg'>
            <Link href='/'>
              <a className='text-gray-100 hover:underline hover:decoration-gray-100'>
                {notification?.message?.commentedBy}
              </a>
            </Link>{' '}
            replied to your comment on{' '}
            <Link href='/'>
              <a className='text-brand-blue hover:underline hover:decoration-brand-blue'>
                {notification?.message?.post.title}
              </a>
            </Link>
            <div className='absolute -top-3 -right-3'>
              <IconButton
                onClick={() => mutate({ notificationId: notification.id })}
                icon={<BsCheck className='h-6 w-6' />}
                variant='outline'
                rounded='full'
              />
            </div>
          </div>
        </div>
      );

    case 'FOLLOWER':
      return (
        <div className='space-y-6'>
          <div className='flex items-center gap-3'>
            <div className='text-lg text-brand-blue'>
              {format(notification.createdAt, 'MMMM dd')}
            </div>
            <div>
              <Image
                src={`${notification?.message?.follower.avatar}`}
                height={40}
                width={40}
                className='rounded-full'
              />
            </div>
          </div>
          {/* Follow */}
          <div className='notification relative rounded bg-[#172E43] p-4 text-lg'>
            <Link href={`/@${notification?.message?.follower.username}`}>
              <a className='text-gray-100 hover:underline hover:decoration-gray-100'>
                {notification?.message?.follower.username}
              </a>
            </Link>{' '}
            followed you.
            <div className='absolute -top-3 -right-3'>
              <IconButton
                onClick={() => mutate({ notificationId: notification.id })}
                icon={<BsCheck className='h-6 w-6' />}
                variant='outline'
                rounded='full'
              />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const NoticicationList = ({
  notifications,
}: {
  notifications: INotification[];
}) => {
  return (
    <div className='space-y-6'>
      {notifications.map((notification) => (
        <NoticicationBox key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
