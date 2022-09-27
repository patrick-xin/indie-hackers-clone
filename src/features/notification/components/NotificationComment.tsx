import { format } from 'date-fns';
import Link from 'next/link';
import { BsCheck } from 'react-icons/bs';

import { useReadNotification } from '@/features/notification/api';
import { INotification } from '@/features/notification/types';
import { IconButton } from '@/features/UI';

export const NotificationComment = ({
  notification,
}: {
  notification: INotification;
}) => {
  const { readNotification } = useReadNotification();
  return (
    <div className='space-y-6'>
      <div className='text-lg text-brand-blue'>
        {format(notification.createdAt, 'MMMM dd')}
      </div>
      <div className='notification relative rounded bg-[#172E43] p-4 text-lg'>
        <Link href={`/@${notification.message.commentedBy}`}>
          <a className='text-gray-100 hover:underline hover:decoration-gray-100'>
            {notification.message.commentedBy}
          </a>
        </Link>{' '}
        replied to your post on{' '}
        <Link
          href={`/@${notification.message.post.author}/${notification.message.post.slug}`}
        >
          <a className='text-brand-blue hover:underline hover:decoration-brand-blue'>
            {notification?.message?.post.title}
          </a>
        </Link>
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
