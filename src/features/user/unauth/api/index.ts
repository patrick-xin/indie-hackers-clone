import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

const useGetUsernameFromParam = () => {
  const { query } = useRouter();
  const usernameQuery = query['@username'] as string;
  const username = usernameQuery?.split('@')[1];
  return username;
};

const useGetUserFollows = ({ username }: { username: string }) => {
  const { data, isLoading, isError } = trpc.useQuery([
    'user.username-follows',
    { username },
  ]);

  return { data, isLoading, isError };
};

const useGetUserBookmarks = ({ username }: { username: string }) => {
  const { data, isLoading, isError } = trpc.useQuery([
    'user.username-bookmark',
    { username },
  ]);

  return { data, isLoading, isError };
};

const useGetUserFeatured = ({ username }: { username: string }) => {
  const { data, isError, isLoading } = trpc.useQuery([
    'user.username-featured',
    { username },
  ]);

  return { data, isLoading, isError };
};

const useGetUserInfo = () => {
  const { query } = useRouter();
  const usernameQuery = query && (query['@username'] as string);
  const username = usernameQuery?.split('@')[1] as string;
  const { data, isLoading, isError } = trpc.useQuery(
    ['user.username', { username }],
    {
      enabled: Boolean(query) && Boolean(username),
    }
  );
  const { data: session } = useSession();
  const isOwner = session?.user.username === username;

  return { data, isLoading, isError, isOwner };
};

export {
  useGetUserBookmarks,
  useGetUserFeatured,
  useGetUserFollows,
  useGetUserInfo,
  useGetUsernameFromParam,
};
