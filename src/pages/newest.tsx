import { createSSGHelpers } from '@trpc/react/ssg';
import cn from 'clsx';
import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import superjson from 'superjson';

import {
  Container,
  Explore,
  FeedItemLoaders,
  Group,
  Onboard,
} from '@/features/homepage/sections/';
import { FeedItem } from '@/features/homepage/sections/content/components/FeedItem';
import { TabLinks } from '@/features/homepage/sections/content/components/TabLinks';
import { BasicLayout } from '@/features/layout/Basic';
import { Alert, Button } from '@/features/UI';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      ease: 'easeIn',
    },
  },
};

const Newest = ({ p }) => {
  const router = useRouter();
  const query = (router.query.page as string) || '';

  const [page, setPage] = useState(p);
  useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(query, 10));
    } else {
      setPage(1);
    }
  }, [query, router.query.page]);

  const { data, isLoading } = trpc.useQuery(['public-posts.newest', { page }]);

  return (
    <>
      <Onboard />
      <Container>
        <section className='space-y-6'>
          <TabLinks />

          <div className='grid min-h-[50vh] grid-cols-1 gap-2 lg:min-h-[80vh]'>
            {isLoading || !data ? (
              <FeedItemLoaders count={10} key={0} />
            ) : data.posts.length === 0 ? (
              <Alert message='No more posts' type='warning' />
            ) : (
              <>
                <motion.div
                  variants={container}
                  initial='hidden'
                  animate='show'
                  className='space-y-4'
                >
                  {data.posts.map((post) => (
                    <FeedItem key={post.id} post={post} />
                  ))}
                </motion.div>
                <Button
                  className={cn('h-min', {
                    hidden: data.posts.length === 0,
                  })}
                  variant='outline'
                  onClick={() => {
                    setPage(page + 1);
                    router.push(`/newest/?page=${page + 1}`);
                  }}
                >
                  Next Page
                </Button>
              </>
            )}
          </div>
        </section>
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  const q = (query.page as string) ?? '';
  const page = q ? parseInt(q, 10) : 1;
  if (isNaN(page)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  if (page > 100) {
    return {
      redirect: {
        destination: '/newest?page=100',
        permanent: false,
      },
    };
  }
  await ssg.prefetchQuery('public-posts.newest', { page });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      p: page >= 100 ? 100 : page,
    },
  };
};
