import React, { ReactElement } from 'react';

import {
  Container,
  Content,
  Explore,
  Group,
  Onboard,
} from '@/features/homepage/sections/';
import { BasicLayout } from '@/features/layout/Basic';
import { trpc } from '@/utils/trpc';

const Home = () => {
  const { data, fetchNextPage, isLoading, isError, hasNextPage } =
    trpc.useInfiniteQuery(
      [
        'public-posts.infinitePosts-popular-today',
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
          isError={isLoading}
          hasNextPage={hasNextPage}
        />

        <Group />
        <Explore />
      </Container>
    </>
  );
};

export default Home;

Home.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>;
