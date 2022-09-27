import { Check } from 'tabler-icons-react';

import { UserPageLayout } from '@/features/layout/UserPage';
import { useReadAllNotifications } from '@/features/notification/api';
import { NotificationList } from '@/features/notification/components';
import { Button } from '@/features/UI';
import { useMe } from '@/features/user/auth/api';

const UserPage = () => {
  const { data } = useMe({ postId: undefined });
  const { readAllNotifications, isLoading } = useReadAllNotifications();

  return (
    <UserPageLayout>
      <div className='mb-8 flex gap-4'>
        <h3 className='text-3xl text-white'>
          {data?.notificationsCounts === 0
            ? 'No Unread Notifications'
            : `${data?.notificationsCounts} Unread Notifications`}
        </h3>
        {data?.notificationsCounts !== 0 && (
          <Button
            disabled={isLoading}
            variant='outline'
            icon={<Check />}
            onClick={() => readAllNotifications()}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {data && <NotificationList notifications={data.notifications} />}
    </UserPageLayout>
  );
};

export default UserPage;
