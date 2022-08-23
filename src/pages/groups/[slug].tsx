import { createSSGHelpers } from '@trpc/react/ssg';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/future/image';
import React from 'react';
import { FaDraftingCompass, FaUserFriends } from 'react-icons/fa';
import superjson from 'superjson';
import { Check, Message, Users } from 'tabler-icons-react';

import { GroupTabLinks } from '@/features/group/components';
import { GROUPS } from '@/features/group/constants/data';
import { Content } from '@/features/homepage/sections/';
import { BasicLayout } from '@/features/layout/Basic';
import { Button } from '@/features/UI';
import { appRouter } from '@/server/router';
import { createContext } from '@/server/router/context';
import { trpc } from '@/utils/trpc';

const GroupDetailPage = () => {
  const groupDetail = GROUPS[0];
  const postsQuery = trpc.useInfiniteQuery(
    ['public-posts.infinitePosts-newest', { limit: 20 }],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
    }
  );

  const { data, fetchNextPage, isLoading, isError, hasNextPage } = postsQuery;
  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <GroupDetailHeader {...groupDetail} />
      <div className='md:grid grid-cols-8 gap-10'>
        <div className='col-span-5'>
          <Content
            posts={data?.pages.flatMap((p) => p.posts)}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
            isError={isError}
            hasNextPage={hasNextPage}
            tablinks={<GroupTabLinks />}
          />
        </div>
        <div className='hidden md:block col-start-6 col-span-full'>
          <h3 className='text-xl font-semibold mt-2 mb-6 uppercase'>About</h3>
          <p className='bg-[#182e43] p-4 text-lg rounded'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore
            nostrum, harum provident maiores ipsam temporibus veniam impedit
            voluptates vel sint?
          </p>
          <div className='bg-[#182e43] p-4 mt-1 rounded space-y-2'>
            <div className='flex items-center gap-2'>
              <div>
                <FaUserFriends />
              </div>
              <div>503 members</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <FaDraftingCompass />
              </div>
              <div>
                moderated by <span>patrick</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  await ssg.prefetchInfiniteQuery('public-posts.infinitePosts-newest', {
    limit: 20,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

GroupDetailPage.getLayout = (page: React.ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);

type GroupDetailHeaderProps = {
  name: string;
  description: string;
  logo: string;
};

const GroupDetailHeader = ({
  name,
  description,
  logo,
}: GroupDetailHeaderProps) => {
  return (
    <div>
      <div className='flex items-center bg-[#1f364d] p-4 gap-6 md:p-10 md:gap-10'>
        <div className='max-w-[80px]'>
          <Image
            src={logo}
            height={160}
            width={160}
            className='rounded-full'
            style={{ boxShadow: '0 0 0 8px #0e2439' }}
          />
        </div>
        <div className='md:space-y-4'>
          <h1 className='text-white text-2xl font-bold md:text-3xl'>{name}</h1>
          <p className='md:text-lg'>{description}</p>
        </div>
      </div>

      <div className='bg-[#152C41] py-4 pb-0 md:flex items-center flex-row-reverse justify-between'>
        <div className='mx-4'>
          <Button
            fullWidth
            variant='outline'
            icon={<Check className='w-4 h-4' />}
          >
            Member
          </Button>
        </div>
        <div className='pt-6 flex gap-4'>
          <Button
            size='small'
            variant='underline'
            className='uppercase'
            transition
            icon={<Message className='w-5 h-5' />}
          >
            discussions
          </Button>
          <Button
            size='small'
            variant='underline'
            className='uppercase'
            transition
            icon={<Users className='w-5 h-5' />}
          >
            members
          </Button>
        </div>
      </div>
    </div>
  );
};
