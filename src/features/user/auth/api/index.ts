import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

const useMe = ({ postId }: { postId?: string | undefined }) => {
  const { data: session } = useSession();
  const { data, isLoading, isError } = trpc.useQuery(['auth.me', { postId }], {
    enabled: Boolean(session),
  });
  return { data, isLoading, isError };
};

const useFollowUser = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation('user.follow', {
    onSuccess: async () => {
      utils.invalidateQueries(['user.username-follows']);
    },
  });
  return {
    follow: mutate,
    isFollowingLoading: isLoading,
    isFollowingError: isError,
  };
};

const useUnFollowUser = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading, isError } = trpc.useMutation('user.unfollow', {
    onSuccess: async () => {
      utils.invalidateQueries(['user.username-follows']);
    },
  });
  return {
    unfollow: mutate,
    isUnfollowingLoading: isLoading,
    isUnollowingError: isError,
  };
};

export { useFollowUser, useMe, useUnFollowUser };
