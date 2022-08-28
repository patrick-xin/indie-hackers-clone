import { Comment, Post, User } from '@prisma/client';
import {
  addMonths,
  addWeeks,
  format,
  isToday,
  parseISO,
  subMonths,
  subWeeks,
} from 'date-fns';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';

import { container } from '@/lib/animation';

import { FeedItemLoaders } from '@/features/homepage/sections/common/components/FeedItemLoader';
import { Alert, FliterNav } from '@/features/UI';

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
};

export const ContentSection = ({
  posts,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  tablinks,
}: Props) => {
  const { route, query, push } = useRouter();

  const path = query.slug as string;
  const dateQuery = path && path.split('-').slice(2).join('-');
  const dateQueryToDate = parseISO(dateQuery);
  const istoday = isToday(dateQueryToDate);
  const renderContent = () => {
    if (path?.startsWith('week')) {
      return (
        <FliterNav
          nextDisabled={istoday}
          onNextClick={() =>
            push(
              `/top/week-of-${format(
                addWeeks(dateQueryToDate, 1),
                'yyyy-MM-dd'
              )}`
            )
          }
          onPrevClick={() =>
            push(
              `/top/week-of-${format(
                subWeeks(dateQueryToDate, 1),
                'yyyy-MM-dd'
              )}`
            )
          }
        >
          <div className='flex w-full flex-1 justify-center gap-3'>
            <div>
              {dateQuery && format(parseISO(dateQuery), 'LLL dd, yyyy')}
            </div>
            <div>-</div>
            <div>
              {dateQuery &&
                format(subWeeks(dateQueryToDate, 1), 'LLL dd, yyyy')}
            </div>
          </div>
        </FliterNav>
      );
    }
    if (path?.startsWith('month')) {
      return (
        <FliterNav
          onNextClick={() =>
            push(
              `/top/month-of-${format(
                addMonths(dateQueryToDate, 1),
                'yyyy-MM'
              )}`
            )
          }
          onPrevClick={() =>
            push(
              `/top/month-of-${format(
                subMonths(dateQueryToDate, 1),
                'yyyy-MM'
              )}`
            )
          }
        >
          <div className='flex w-full flex-1 justify-center gap-3'>
            <div>{dateQuery && format(parseISO(dateQuery), 'LLL, yyyy')}</div>
          </div>
        </FliterNav>
      );
    }
    return null;
  };

  return (
    <>
      <section className='space-y-6'>
        <div className='space-y-4'>
          {tablinks}
          {route.startsWith('/top') && <>{renderContent()}</>}
        </div>

        <div className='grid min-h-[50vh] grid-cols-1 gap-2 lg:min-h-[80vh]'>
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
