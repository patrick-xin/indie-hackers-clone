import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';

import { POST_FEED_COUNT } from '@/lib/constants';

import {
  Container,
  Explore,
  Group,
  Onboard,
} from '@/features/homepage/sections/';
import { BasicLayout } from '@/features/layout/Basic';
import { PostFeeds } from '@/features/layout/PostFeeds';
import { trpc } from '@/utils/trpc';

const TopPage = () => {
  const { query, push } = useRouter();
  const path = query.slug as string;
  const dateQuery = path && path.split('-').slice(2).join('-');

  const type = path && path.split('-')[0];
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query.page) {
      setPage(parseInt(query.page as string));
    } else {
      setPage(1);
    }
  }, [query.slug, query.page]);

  const { data, isLoading } = trpc.useQuery(
    ['public-posts.popular', { page, query: dateQuery, type }],
    {
      enabled: Boolean(path) && Boolean(dateQuery),
    }
  );

  return (
    <>
      <Onboard />
      <Container>
        {data && (
          <PostFeeds
            posts={data.posts}
            isLoading={isLoading}
            onNextPage={() => {
              setPage(page + 1);
              push(`/top/${query.slug}/?page=${page + 1}`);
            }}
            hideButton={data.posts.length <= POST_FEED_COUNT}
            hasPagination
          />
        )}

        <Group />
        <Explore />
      </Container>
    </>
  );
};

export default TopPage;

TopPage.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>;
