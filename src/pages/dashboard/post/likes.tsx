import { format } from 'date-fns';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { z } from 'zod';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { useRemovePostFromBookmark } from '@/features/postpage/api';
import { Button, Flex, Select } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const DashboardPostLikesPage = () => {
  const orderOptions = z.enum(['title', 'creation', 'default']);
  type OrderOptions = z.infer<typeof orderOptions>;
  const [selectedPostType, setSelectedPostType] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderOptions>(
    orderOptions.Enum.title
  );
  const { data: bookmarks } = trpc.useQuery([
    'auth.bookmarks',
    { order: selectedOrder },
  ]);

  const filtered =
    selectedPostType === 'all'
      ? bookmarks
      : bookmarks?.filter((b) => b.postType === selectedPostType.toUpperCase());
  const noBookmarks = bookmarks?.length === 0;
  return (
    <div className='mx-12'>
      <div className='flex items-center justify-between'>
        {noBookmarks ? (
          <h1 className='text-3xl text-white'>
            You havn&#39;t saved any posts.
          </h1>
        ) : (
          <h1 className='text-3xl text-white'>
            My Saved Posts <span>({bookmarks?.length})</span>
          </h1>
        )}

        {noBookmarks ? null : (
          <div className='flex items-center gap-4'>
            <Select
              selectedItem={selectedPostType}
              setSelectedItem={setSelectedPostType}
              options={['all', 'link', 'article']}
              label='Post Type'
            />
            <Select
              selectedItem={selectedOrder}
              setSelectedItem={setSelectedOrder}
              options={['title', 'creation', 'default']}
              size='normal'
              label='Order By'
            />
          </div>
        )}
      </div>

      <div className='my-8'>
        {filtered && <DashboardPostCardList posts={filtered} />}
      </div>
    </div>
  );
};

export default DashboardPostLikesPage;

DashboardPostLikesPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const DashboardPostCardList = ({ posts }) => {
  const { removePostFromBookmark } = useRemovePostFromBookmark();
  return (
    <ul className='space-y-4'>
      {posts.map((post) => (
        <li key={post.id} className='rounded-md bg-indigo-300/10 px-4 py-3'>
          <Flex className='items-center justify-between'>
            <div className='space-y-4 py-3'>
              <div className='flex items-center gap-4'>
                <div className='mb-1 text-sm italic'>
                  marked on{' '}
                  <span className='text-white'>
                    {format(post.markedCreatedAt, 'LLLL dd, yyyy')}
                  </span>
                </div>
                <div className='h-min rounded-xl bg-emerald-600/20 py-1 px-2.5 text-xs font-bold tracking-wider text-emerald-400'>
                  {post.postType}
                </div>
              </div>
              <div>
                <Link href={`/@${post.author.username}/${post.slug}`}>
                  <a>
                    <h2 className='text-2xl text-white'>{post.title}</h2>
                  </a>
                </Link>
              </div>
            </div>

            <Flex className='gap-4'>
              <Button
                variant='outline'
                onClick={() => {
                  removePostFromBookmark({ id: post.id });
                }}
              >
                unsave
              </Button>
            </Flex>
          </Flex>
        </li>
      ))}
    </ul>
  );
};
