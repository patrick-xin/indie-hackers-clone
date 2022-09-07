import { useRouter } from 'next/router';
import React from 'react';

import { GroupTabLinks } from '@/features/group/components';
import { Content } from '@/features/homepage/sections';
import { GroupPageLayout } from '@/features/layout/GroupPage';
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
    ['group.by-slug-feeds', { limit: 10, slug }],
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
