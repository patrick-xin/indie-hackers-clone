import { motion } from 'framer-motion';

import { container } from '@/lib/animation';

import { FeedItemLoaders } from '@/features/homepage/sections/';
import { FeedItem } from '@/features/homepage/sections/content/components/FeedItem';
import { NextButton } from '@/features/homepage/sections/content/components/NextButton';
import { TabLinks } from '@/features/homepage/sections/content/components/TabLinks';
import { TopPagePagination } from '@/features/post/components';
import { PostFeed } from '@/features/post/types';
import { Alert } from '@/features/UI';

type DefaultPostProps = {
  isLoading: boolean;
  posts: PostFeed[];
  onNextPage: () => void;
  hideButton: boolean;
  hasPagination?: boolean;
};

export const PostFeeds = ({
  isLoading,
  posts,
  onNextPage,
  hideButton,
  hasPagination = false,
}: DefaultPostProps) => {
  return (
    <section className='space-y-6'>
      <TabLinks />
      {hasPagination && <TopPagePagination />}
      <div className='relative grid min-h-[50vh] grid-cols-1 gap-2 lg:min-h-[80vh]'>
        {isLoading || !posts ? (
          <FeedItemLoaders count={10} key={0} />
        ) : posts.length === 0 ? (
          <Alert
            className='absolute top-0 left-0'
            message='No more posts.'
            type='warning'
          />
        ) : (
          <>
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
            {!hideButton && <NextButton onClick={onNextPage} />}
          </>
        )}
      </div>
    </section>
  );
};
