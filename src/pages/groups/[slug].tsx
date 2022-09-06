import { createSSGHelpers } from '@trpc/react/ssg';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import superjson from 'superjson';

import { GroupTabLinks } from '@/features/group/components';
import { Content } from '@/features/homepage/sections';
import { BasicLayout } from '@/features/layout/Basic';
import { GroupPageLayout } from '@/features/layout/GroupPage';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

const GroupDetailPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data: group, isLoading: loadingGroup } = trpc.useQuery(
    [
      'group.by-slug',
      {
        slug,
      },
    ],
    { enabled: Boolean(query) }
  );
  const postsQuery = trpc.useInfiniteQuery(
    ['group.by-slug-feed', { limit: 10, slug }],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
      enabled: Boolean(query),
    }
  );

  const { data, fetchNextPage, isLoading, isError, hasNextPage } = postsQuery;

  return (
    <GroupPageLayout loadingGroup={loadingGroup} group={group}>
      <Content
        posts={data?.pages.flatMap((p) => p.posts)}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        tablinks={<GroupTabLinks />}
      />
    </GroupPageLayout>
  );
};

export default GroupDetailPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  await ssg.prefetchInfiniteQuery('public-posts.infinitePosts-newest', {
    limit: 20,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

GroupDetailPage.getLayout = (page: React.ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
