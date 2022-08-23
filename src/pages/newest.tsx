import { createSSGHelpers } from '@trpc/react/ssg';
import React from 'react';
import superjson from 'superjson';

import {
  Container,
  Content,
  Explore,
  Group,
  Onboard,
} from '@/features/homepage/sections/';
import { TabLinks } from '@/features/homepage/sections/content/components/TabLinks';
import { BasicLayout } from '@/features/layout/Basic';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

const Newest = () => {
  const postsQuery = trpc.useInfiniteQuery(
    ['public-posts.infinitePosts-newest', { limit: 20 }],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
    }
  );

  const { data, fetchNextPage, isLoading, isError, hasNextPage } = postsQuery;

  return (
    <>
      <Onboard />
      <Container>
        <Content
          posts={data?.pages.flatMap((p) => p.posts)}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
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

export default Newest;

Newest.getLayout = (page: React.ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);

export async function getServerSideProps() {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  /*
   * Prefetching the `post.byId` query here.
   * `prefetchQuery` does not return the result - if you need that, use `fetchQuery` instead.
   */
  await ssg.prefetchInfiniteQuery('public-posts.infinitePosts-newest', {
    limit: 20,
  });

  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
