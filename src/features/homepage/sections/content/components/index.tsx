import { Comment, Post, User } from '@prisma/client';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroller';

import { FeedItemLoaders } from '@/features/homepage/sections/common/components/FeedItemLoader';
import { Alert, FilterLinks } from '@/features/UI';

import { FeedItem } from './FeedItem';

type IPost = Post & {
  comments: Comment[];
  author: User;
  _count: {
    comments: number;
    likes: number;
  };
};

type Props = {
  posts: IPost[] | undefined;
  fetchNextPage: () => void;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
  isError: boolean;
  tablinks: React.ReactNode;
  hasFliter?: boolean;
};

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

export const ContentSection = ({
  posts,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  tablinks,
  hasFliter = false,
}: Props) => {
  return (
    <>
      <section className='space-y-6'>
        <div className='space-y-4'>
          {tablinks}
          {hasFliter && <FilterLinks />}
        </div>

        <div className='grid grid-cols-1 gap-2 min-h-[50vh] lg:min-h-[80vh]'>
          {isLoading || !posts ? (
            <FeedItemLoaders count={6} />
          ) : isError ? (
            <Alert type='error' message='Error occured fetching resource.' />
          ) : posts ? (
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
                {posts.map((post) => (
                  <FeedItem key={post.id} post={post} />
                ))}
              </motion.div>
            </InfiniteScroll>
          ) : null}
        </div>
      </section>
    </>
  );
};
