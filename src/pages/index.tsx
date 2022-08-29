import { createSSGHelpers } from '@trpc/react/ssg';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import superjson from 'superjson';

import { POST_PAGE_LIMIT } from '@/lib/constants';

import {
  Container,
  Explore,
  Group,
  Onboard,
} from '@/features/homepage/sections/';
import { BasicLayout } from '@/features/layout/Basic';
import { PostFeeds } from '@/features/layout/PostFeeds';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

const Home = ({ page }: { page: number }) => {
  const router = useRouter();

  const { data, isLoading } = trpc.useQuery([
    'public-posts.popular-today',
    { page },
  ]);

  return (
    <>
      <Onboard />
      <Container>
        {data && (
          <PostFeeds
            posts={data.posts}
            isLoading={isLoading}
            onNextPage={() => {
              router.push(`/?page=${page + 1}`);
            }}
            hideButton={data.hasMore}
          />
        )}

        <Group />
        <Explore />
      </Container>
    </>
  );
};

export default Home;

Home.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  const q = (query.page as string) ?? '';
  const page = q ? parseInt(q, 10) : 1;
  await ssg.prefetchQuery('public-posts.popular-today', {
    page,
  });

  if (isNaN(page)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (page > POST_PAGE_LIMIT) {
    return {
      redirect: {
        destination: `/?page=${POST_PAGE_LIMIT}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      page: page >= POST_PAGE_LIMIT ? POST_PAGE_LIMIT : page,
    },
  };
};
