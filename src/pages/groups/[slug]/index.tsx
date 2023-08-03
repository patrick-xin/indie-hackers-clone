import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';

import { container } from '@/lib/animation';

import { FeedItemLoaders } from '@/features/homepage/sections';
import { FeedItem } from '@/features/homepage/sections/content/components/FeedItem';
import { GroupPageLayout } from '@/features/layout/GroupPage';
import { Alert } from '@/features/UI';
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
      <div className='grid min-h-[50vh] grid-cols-1 gap-2 lg:min-h-[80vh]'>
        {isLoading || !data ? (
          <FeedItemLoaders count={6} />
        ) : isError ? (
          <Alert type='error' message='Error occured fetching resource.' />
        ) : data ? (
          <InfiniteScroll
            pageStart={0}
            loadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            loader={<FeedItemLoaders count={5} key={0} />}
          >
            <motion.div
              variants={container}
              initial='hidden'
              animate='show'
              className='space-y-4'
            >
              {data.pages.flatMap((p) =>
                p.posts?.map((post) => <FeedItem key={post.id} post={post} />)
              )}
            </motion.div>
          </InfiniteScroll>
        ) : null}
      </div>
    </GroupPageLayout>
  );
};

export default GroupDetailPage;
