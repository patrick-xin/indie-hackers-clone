import { Check } from 'tabler-icons-react';

import { UserPageLayout } from '@/features/layout/UserPage';
import { NotificationList } from '@/features/notification/components';
import { Button } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const UserPage = () => {
  const { data } = trpc.useQuery(['auth.me', { postId: undefined }]);

  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('auth.read-notification-all', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  return (
    <UserPageLayout>
      <div className='mb-8 flex gap-4'>
        <h3 className='text-3xl text-white'>
          {data?.notificationsCounts === 0
            ? 'No Unread Notifications'
            : `${data?.notificationsCounts} Unread Notifications`}
        </h3>
        {data?.notificationsCounts !== 0 && (
          <Button variant='outline' icon={<Check />} onClick={() => mutate()}>
            Mark All Read
          </Button>
        )}
      </div>

      {data && <NotificationList notifications={data.notifications} />}
    </UserPageLayout>
  );
};

export default UserPage;
