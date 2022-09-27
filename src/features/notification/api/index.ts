import { trpc } from '@/utils/trpc';

const useReadNotification = () => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation('auth.read-notification-by-id', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  return { readNotification: mutate };
};

const useReadAllNotifications = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation('auth.read-notification-all', {
    onSuccess: () => {
      utils.invalidateQueries('auth.me');
    },
  });
  return {
    readAllNotifications: mutate,
    isLoading,
  };
};

export { useReadAllNotifications, useReadNotification };
