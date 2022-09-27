import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import cn from 'clsx';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import superjson from 'superjson';
import { Checkbox, EyeOff } from 'tabler-icons-react';

import { FeedItemLoaders } from '@/features/homepage/sections';
import { UserPageLayout } from '@/features/layout/UserPage';
import { Combined } from '@/features/post/types';
import { Button } from '@/features/UI';
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

const UserHistoryPage = ({ username }: { username: string }) => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = trpc.useQuery(
    [
      'user.username-history',
      {
        page: page,
        pageCount: 2,
        username,
      },
    ],
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,

      onSuccess: (data) => {
        setFeed((prev) => {
          if (prev) return [...prev, ...data.result].flatMap((f) => f);
          return data.result;
        });
      },
    }
  );

  const [feed, setFeed] = useState<Combined[] | undefined>(data?.result);
  const [selectedComments, setSelectedComments] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState(true);
  const posts = feed?.filter((f) => f.type === 'post');
  const comments = feed?.filter((f) => f.type === 'comment');

  const content = useMemo(() => {
    if (!selectedComments && !selectedPosts)
      return (
        <div className='text-lg'>
          <p>You&apos;ve unchecked all the filters!</p>
          <p>
            Try re-enabling some to see more of {data?.user?.username}
            &apos;s history.
          </p>
        </div>
      );
    if (selectedComments && !selectedPosts)
      return (
        <>
          {isLoading || !comments ? (
            <FeedItemLoaders count={6} />
          ) : (
            <motion.div
              variants={container}
              initial='hidden'
              animate='show'
              className='space-y-4'
            >
              {comments.map((c) => (
                <UserFeedComment
                  commentId={c.id}
                  key={c.id}
                  content={c.content}
                  createdAt={c.createdAt}
                  slug={c.post.slug}
                  username={c.post.author.username}
                  title={c.post.title}
                />
              ))}
            </motion.div>
          )}
        </>
      );
    if (selectedPosts && !selectedComments)
      return (
        <>
          {isLoading || !posts ? (
            <FeedItemLoaders count={6} />
          ) : (
            <AnimatePresence>
              <motion.div
                variants={container}
                initial='hidden'
                animate='show'
                className='space-y-4'
              >
                {posts.map((p) => (
                  <UserFeedPost
                    key={p.id}
                    {...p}
                    username={data?.user.username}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      );
    if (selectedComments && selectedPosts)
      return (
        <>
          {isLoading || !feed ? (
            <FeedItemLoaders count={6} />
          ) : (
            feed.map((f) => {
              if (f.type === 'post')
                return (
                  <UserFeedPost
                    key={f.id}
                    {...f}
                    username={data?.user.username}
                  />
                );
              if (f.type === 'comment')
                return (
                  <UserFeedComment
                    commentId={f.id}
                    key={f.id}
                    content={f.content}
                    createdAt={f.createdAt}
                    slug={f.post.slug}
                    username={f.post.author.username}
                    title={f.post.title}
                  />
                );
            })
          )}
        </>
      );
  }, [
    selectedComments,
    selectedPosts,
    comments,
    posts,
    data?.user.username,
    feed,
    isLoading,
  ]);

  return (
    <UserPageLayout>
      {feed?.length === 0 ? (
        <div>No activities yet</div>
      ) : (
        <>
          <div className='mb-6 flex gap-0.5'>
            <button
              onClick={() => {
                setSelectedPosts(!selectedPosts);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded  px-3 py-2 hover:bg-[#274059]',
                {
                  'bg-[#274059]': !selectedPosts,
                  'bg-[#172E43]': selectedPosts,
                }
              )}
            >
              <span>
                {selectedPosts ? (
                  <Checkbox className='h-5 w-5 text-brand-blue' />
                ) : (
                  <EyeOff className='h-5 w-5' />
                )}
              </span>
              <span className={cn({ 'text-white': selectedPosts })}>Posts</span>
            </button>
            <button
              onClick={() => {
                setSelectedComments(!selectedComments);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded  px-3 py-2 hover:bg-[#274059]',
                {
                  'bg-[#274059]': !selectedComments,
                  'bg-[#172E43]': selectedComments,
                }
              )}
            >
              <span>
                {selectedComments ? (
                  <Checkbox className='h-5 w-5 text-brand-blue' />
                ) : (
                  <EyeOff className='h-5 w-5' />
                )}
              </span>
              <span className={cn({ 'text-white': selectedComments })}>
                Comments
              </span>
            </button>
          </div>
          <div className='space-y-4'>{content}</div>
          <Button
            className='my-6'
            onClick={() => {
              setPage((p) => p + 1);
            }}
            variant='gradient'
          >
            load more
          </Button>
        </>
      )}
    </UserPageLayout>
  );
};

const UserFeedComment = ({
  title,
  content,
  createdAt,
  username,
  slug,
  commentId,
}: {
  title: string;
  content: string;
  createdAt: Date;
  username: string;
  slug: string;
  commentId: string;
}) => {
  return (
    <div>
      <header className='flex gap-2'>
        <Link href='/'>
          <a className='uppercase text-brand-blue hover:underline hover:decoration-brand-blue'>
            {format(createdAt, 'MMM dd yyyy')}
          </a>
        </Link>

        <span>
          replied to a
          <span className='text-white decoration-2 underline-offset-4 hover:underline hover:decoration-brand-blue'>
            <Link href={`/@${username}/${slug}#${commentId}`}>
              <a> comment</a>
            </Link>
          </span>
          <span> in </span>
          <span className='text-white decoration-2 underline-offset-4 hover:underline hover:decoration-brand-blue'>
            <Link href={`/@${username}/${slug}`}>
              <a>{title}</a>
            </Link>
          </span>
        </span>
      </header>

      <div className='user-feed relative mt-6 bg-[#172E43] p-4'>
        <p className='w-full text-lg'>{content}</p>
      </div>
    </div>
  );
};

const UserFeedPost = ({ title, content, createdAt, username, slug }) => {
  return (
    <div className=''>
      <header className='flex gap-2'>
        <Link href='/'>
          <a className='uppercase text-brand-blue hover:underline hover:decoration-brand-blue'>
            {format(createdAt, 'MMM dd yyyy')}
          </a>
        </Link>

        <Link href={`/@${username}/${slug}`}>
          <a className='decoration-2 underline-offset-4 hover:underline hover:decoration-brand-text'>
            created a post
          </a>
        </Link>
      </header>

      <div className='user-feed relative z-10 mt-6 space-y-4 bg-[#172E43] p-4'>
        <h3 className='text-2xl text-gray-100'>
          <Link href={`/@${username}/${slug}`}>
            <a className='hover:underline hover:decoration-gray-100'>{title}</a>
          </Link>
        </h3>
        <p className='w-full text-lg'>{content}</p>
      </div>
    </div>
  );
};

export default UserHistoryPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const usernameParam = context.params?.['@username'] as string;
  const username = usernameParam.split('@')[1];

  try {
    await ssg.fetchQuery('user.username-history', {
      username,
      page: 0,
      pageCount: 2,
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        return {
          redirect: {
            destination: '/404',
            permanent: false,
          },
        };
      }
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}
