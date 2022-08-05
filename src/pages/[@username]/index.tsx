import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { BiBook, BiBookBookmark, BiHistory } from 'react-icons/bi';

import { BasicLayout } from '@/features/layout/Basic';
import { PostCard } from '@/features/post/components';
import { trpc } from '@/utils/trpc';
const UserPage = () => {
  const { query } = useRouter();
  const username = query['@username'] as string;

  const { data: user } = trpc.useQuery(
    ['user.username', { username: username?.split('@')[1] }],
    { enabled: Boolean(username) }
  );
  console.log(user);

  return (
    <div className='mt-16 space-y-6 max-w-3xl mx-auto'>
      <section className='bg-[#1E364D] px-4 pb-8'>
        <div className='flex justify-center items-center'>
          <div className='p-2 rounded-full bg-[#294057] h-32 w-32 -mt-8'>
            <Image
              className='rounded-full'
              height={120}
              width={120}
              src={user?.image ?? '/avatar.webp'}
              alt='user-avatar'
            />
          </div>
        </div>

        <h3 className='text-2xl text-center py-4'>{user?.username}</h3>
        <button>report</button>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis et
          incidunt blanditiis voluptatibus, aperiam hic corrupti unde ipsum
          perferendis explicabo eveniet excepturi doloribus, sapiente maiores
          quae iure. Cumque molestiae id odio aliquam assumenda fugit vitae
          accusantium, qui aliquid eius rerum.
        </p>
        <div className='h-1 bg-gray-400/20 mx-auto w-48 my-8' />
        <StatsCard />
        <button className='px-2.5 py-4 w-full text-sm uppercase bg-gradient-to-r from-[#e052a0] to-[#f15c41] text-white rounded-sm hover:from-cyan-500 hover:to-blue-500'>
          Follow
        </button>
      </section>
      <UserAction />
      <section>
        <ul className='space-y-6'>
          {user?.posts.map((post) => (
            <PostCard {...post} key={post.id} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default UserPage;

UserPage.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>;

const StatsCard = () => {
  return (
    <div className='flex justify-around text-center pb-8'>
      <div>
        <div className='text-white text-2xl'>22</div>
        <div>Followers</div>
      </div>
      <div>
        <div className='text-white text-2xl'>32</div>
        <div>Points</div>
      </div>
    </div>
  );
};
const UserAction = () => {
  return (
    <div className='rounded'>
      <div className='flex gap-4 justify-between bg-[#172B40]'>
        <div className='flex gap-2 items-center border-b border-brand-blue p-3'>
          <BiBook className='w-6 h-6' />
          <Link href='/'>
            <a className='text-white'>Posts</a>
          </Link>
        </div>
        <div className='flex gap-2 items-center p-3'>
          <BiHistory className='w-6 h-6' />
          <Link href='/'>
            <a className='text-white'>History</a>
          </Link>
        </div>
        <div className='flex gap-2 items-center p-3'>
          <BiBookBookmark className='w-6 h-6' />
          <Link href='/'>
            <a className='text-white'>Bookmark</a>
          </Link>
        </div>
      </div>
    </div>
  );
};
