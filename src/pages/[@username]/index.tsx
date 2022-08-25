import { useRouter } from 'next/router';
import { ReactElement } from 'react';

import { UserPageLayout } from '@/features/layout/UserPage';
import { UserPageSidebar } from '@/features/userpage/components';
import { trpc } from '@/utils/trpc';

const UserPage = () => {
  const { query } = useRouter();
  const username = query['@username'] as string;

  // const { data: user } = trpc.useQuery(
  //   ['user.username', { username: username?.split('@')[1] }],
  //   { enabled: Boolean(username) }
  // );
  const { data, fetchNextPage, isLoading, isError, hasNextPage } =
    trpc.useInfiniteQuery(
      [
        'user.username',
        {
          limit: 4,
          username: username?.split('@')[1],
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
        enabled: Boolean(username),
      }
    );

  return (
    <div className='user-content'>
      {/* <UserPageHeader user={user} />
      <UserPageBody user={user?.user} /> */}
      <UserPageSidebar />
    </div>
  );
};

export default UserPage;

UserPage.getLayout = (page: ReactElement) => (
  <UserPageLayout>{page}</UserPageLayout>
);
