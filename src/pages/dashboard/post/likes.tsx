import Link from 'next/link';
import { ReactElement, useState } from 'react';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { Select } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const DashboardPostLikesPage = () => {
  const { data: bookmarks } = trpc.useQuery(['auth.bookmarks']);
  const [selectedPostType, setSelectedPostType] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string>('default');

  return (
    <div className='mx-12'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl text-white'>
          My Saved Posts <span>{12}</span>
        </h1>
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
            options={['default', 'title', 'created by']}
            size='normal'
            label='Order By'
          />
        </div>
      </div>

      <div>
        {bookmarks?.bookmarks.map((bookmark) => (
          <div key={bookmark.id}>
            <Link href={`/@${bookmark.author.username}/${bookmark.slug}`}>
              <a className=''>
                <h2>{bookmark.title}</h2>
              </a>
            </Link>

            <div className='h-min w-fit rounded-xl bg-emerald-600/20 py-1 px-2.5 text-xs font-bold tracking-wider text-emerald-400'>
              {bookmark.postType}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPostLikesPage;

DashboardPostLikesPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
