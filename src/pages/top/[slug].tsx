import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import {
  Container,
  Content,
  Explore,
  Group,
  Onboard,
} from '@/features/homepage/sections';
import { TabLinks } from '@/features/homepage/sections/content/components/TabLinks';
import { BasicLayout } from '@/features/layout/Basic';
import { trpc } from '@/utils/trpc';

const TopPage = () => {
  const { query } = useRouter();
  const path = query.slug as string;
  const dateQuery = path && path.split('-').slice(2).join('-');
  const type = path && path.split('-')[0];

  const { data, fetchNextPage, isLoading, isError, hasNextPage } =
    trpc.useInfiniteQuery(
      [
        'public-posts.infinitePosts-popular',
        {
          limit: 20,
          query: dateQuery,
          type,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
        enabled: Boolean(path),
      }
    );

  return (
    <>
      <Onboard />
      <Container>
        <Content
          posts={data?.pages.flatMap((p) => p.posts)}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading || !data}
          isError={isError}
          hasNextPage={hasNextPage}
          tablinks={<TabLinks />}
        />

        <Group />
        <Explore />
      </Container>
    </>
  );
};

export default TopPage;

TopPage.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>;
