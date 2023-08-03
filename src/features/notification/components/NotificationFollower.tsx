import { format } from 'date-fns';
import Image from 'next/future/image';
import Link from 'next/link';
import { BsCheck } from 'react-icons/bs';

import { useReadNotification } from '@/features/notification/api';
import { INotification } from '@/features/notification/types';
import { IconButton } from '@/features/UI';

export const NotificationFollower = ({
  notification,
}: {
  notification: INotification;
}) => {
  const { readNotification } = useReadNotification();
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='text-lg text-brand-blue'>
          {format(notification.createdAt, 'MMMM dd')}
        </div>
        <div>
          <Image
            src={`${notification.message.follower.avatar}`}
            height={40}
            width={40}
            className='rounded-full'
            alt='user-avatar'
          />
        </div>
      </div>
      {/* Follow */}
      <div className='notification relative rounded bg-[#172E43] p-4 text-lg'>
        <Link href={`/@${notification.message.follower.username}`}>
          <a className='text-gray-100 hover:underline hover:decoration-gray-100'>
            {notification.message.follower.username}
          </a>
        </Link>{' '}
        followed you.
        <div className='absolute -top-3 -right-3'>
          <IconButton
            onClick={() =>
              readNotification({ notificationId: notification.id })
            }
            icon={<BsCheck className='h-6 w-6' />}
            variant='outline'
            rounded='full'
          />
        </div>
      </div>
    </div>
  );
};
