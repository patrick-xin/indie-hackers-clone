import {
  NotificationComment,
  NotificationFollower,
} from '@/features/notification/components';
import { INotification } from '@/features/notification/types';

export const NotificationList = ({
  notifications,
}: {
  notifications: INotification[];
}) => {
  return (
    <div className='space-y-6'>
      {notifications.map((notification) => (
        <NotifiationBox key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

const NotifiationBox = ({ notification }: { notification: INotification }) => {
  switch (notification.notificationType) {
    case 'COMMENT':
      return <NotificationComment notification={notification} />;
    case 'FOLLOWER':
      return <NotificationFollower notification={notification} />;
    default:
      return null;
  }
};
