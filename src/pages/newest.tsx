import React from 'react';

import {
  Container,
  Content,
  Explore,
  Group,
  Onboard,
} from '@/features/homepage/sections/';
import { BasicLayout } from '@/features/layout/Basic';
import { trpc } from '@/utils/trpc';

const Newest = () => {
  const { data, fetchNextPage, isLoading, isError, hasNextPage } =
    trpc.useInfiniteQuery(
      [
        'public-posts.infinitePosts-newest',
        {
          limit: 20,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
      }
    );

  return (
    <>
      <Onboard />
      <Container>
        <Content
          type='/'
          posts={data?.pages.flatMap((p) => p.posts)}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={hasNextPage}
        />
        <Group />
        <Explore />
      </Container>
    </>
  );
};

export default Newest;

Newest.getLayout = (page: React.ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
