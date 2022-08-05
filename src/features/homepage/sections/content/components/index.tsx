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
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { FeedItemLoaders } from '@/features/homepage/sections/common/components/FeedItemLoader';
import { FilterLinks } from '@/features/homepage/sections/content/components/FilterLinks';
import { FliterNav } from '@/features/homepage/sections/content/components/FliterNav';
import { NewPostButton } from '@/features/homepage/sections/content/components/NewPostButton';
import { TabLinks } from '@/features/homepage/sections/content/components/TabLinks';
import { Alert } from '@/features/UI';

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
  type: string;
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
  type,
}: Props) => {
  return (
    <section className='main-col'>
      <Header type={type} />
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
  );
};

const Header = ({ type }: { type: string }) => {
  const { route, query, push } = useRouter();
  const path = query.slug as string;
  const dateQuery = path && path.split('-').slice(2).join('-');
  const dateQueryToDate = parseISO(dateQuery);
  const istoday = isToday(dateQueryToDate);

  const renderContent = () => {
    if (type === 'week') {
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
          <div className='flex-1 flex justify-center w-full gap-3'>
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
    if (type === 'month') {
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
          <div className='flex-1 flex justify-center w-full gap-3'>
            <div>{dateQuery && format(parseISO(dateQuery), 'LLL, yyyy')}</div>
          </div>
        </FliterNav>
      );
    }
    return null;
  };

  return (
    <header className='flex flex-col items-start gap-4 sm:gap-0 sm:flex-row sm:justify-between sm:items-center lg:items-start mb-6'>
      <div className='space-y-4 w-full'>
        <div className='flex justify-between items-center'>
          <TabLinks path={route} />
          <NewPostButton />
        </div>

        {(route === '/' || route.startsWith('/top')) && (
          <div className='space-y-4 w-full'>
            <FilterLinks path={path ?? ''} />
            {route.startsWith('/top') && renderContent()}
          </div>
        )}
      </div>
    </header>
  );
};
