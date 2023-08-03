import Link from 'next/link';
import React, { ReactElement } from 'react';
import { MdGroupWork } from 'react-icons/md';
import { RiBearSmileFill, RiBearSmileLine } from 'react-icons/ri';
import { Book, Heart, Message } from 'tabler-icons-react';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { useMe } from '@/features/user/auth/api';

const DashboardPage = () => {
  const { data } = useMe({ postId: undefined });

  return (
    <div className='flex justify-center'>
      {data && (
        <div className='flex w-full flex-wrap justify-evenly gap-4 px-12'>
          <DetailCard
            label='Posts'
            count={data.user._count.posts}
            icon={<Book className='h-6 w-6 text-yellow-400' />}
            href='/dashboard/post'
          />
          <DetailCard
            label='Comments'
            count={data.user._count.comment}
            icon={<Message className='h-6 w-6 text-purple-400' />}
            href='/dashborad/post'
          />
          <DetailCard
            label='Bookmarks'
            count={data.user._count.bookmarks}
            icon={<Heart className='h-6 w-6 text-red-400' />}
            href='/dashborad/post'
          />
          <DetailCard
            label='Groups'
            count={data.user._count.groups}
            icon={<MdGroupWork className='h-6 w-6 text-red-400' />}
            href='/dashborad/groups'
          />
          <DetailCard
            label='Followers'
            icon={<RiBearSmileFill className='h-6 w-6 text-red-400' />}
            count={data.user._count.followers}
            href='/dashborad/post'
          />
          <DetailCard
            label='Followings'
            icon={<RiBearSmileLine className='h-6 w-6 text-red-400' />}
            count={data.user._count.followings}
            href='/dashborad/post'
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

const DetailCard = ({
  label,
  count,
  icon,
  href,
}: {
  label: string;
  count: number;
  icon?: React.ReactNode;
  href: string;
}) => {
  return (
    <div className='flex min-w-[14rem] items-center gap-6 rounded bg-[#1E364D] p-4 text-center'>
      <div>{icon}</div>
      <Link href={href}>
        <a>
          <h4 className='text-lg text-white'>{label}</h4>
        </a>
      </Link>

      <div className='text-xl'>{count}</div>
    </div>
  );
};

DashboardPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
