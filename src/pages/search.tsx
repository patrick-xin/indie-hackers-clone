import cn from 'clsx';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import { Loader } from 'tabler-icons-react';
import { useDebounce } from 'usehooks-ts';
import z from 'zod';

import {
  GroupsResult,
  PostsResult,
  UsersResult,
} from '@/features/search/components';
import { Input, Logo } from '@/features/UI';
import { XIcon } from '@/features/UI/svg';
import { trpc } from '@/utils/trpc';

const options = ['all', 'discussions', 'groups', 'users'];

const orderSchema = z.enum(['recent', 'popular', 'oldest', 'discussed']);

const orders = [
  { key: 'default', value: 'Best Match' },
  { key: 'popular', value: 'Most Upvotes' },
  { key: 'discussed', value: 'Most Replies' },
  { key: 'recent', value: 'Recent' },
  { key: 'oldest', value: 'Oldest' },
];

const SearchPage = () => {
  const { push } = useRouter();
  const [option, setOption] = useQueryState(
    'f',
    queryTypes.string.withDefault('all')
  );
  const [search, setSearch] = useQueryState('q', queryTypes.string);
  const [page, setPage] = useQueryState('p', queryTypes.integer.withDefault(1));

  const [order, setOrder] = useQueryState('s', orderSchema);

  const displayValue =
    orders.filter((o) => o.key === order)[0]?.value ?? 'Best Match';
  const debouncedSearch = useDebounce<string>(search ?? '', 1500);

  const { data, isLoading } = trpc.useQuery(
    [
      'public-posts.search',
      { query: debouncedSearch, order: order ?? 'recent' },
    ],
    {
      enabled: Boolean(debouncedSearch),
    }
  );
  const { data: posts } = trpc.useQuery(
    [
      'public-posts.search-discussions',
      { page: page ?? 0, query: debouncedSearch, order: order ?? 'recent' },
    ],
    { enabled: Boolean(debouncedSearch) }
  );
  const { data: groups } = trpc.useQuery(
    ['public-posts.search-groups', { page: page ?? 0, query: debouncedSearch }],
    { enabled: Boolean(debouncedSearch) }
  );
  const { data: users } = trpc.useQuery(
    ['public-posts.search-users', { page: page ?? 0, query: debouncedSearch }],
    { enabled: Boolean(debouncedSearch) }
  );

  const handleNextDiscussion = async () => {
    await setPage((p) => p + 1);
    await setOption('discussions');
  };
  const handlePreviousDiscussion = async () => {
    await setPage((p) => p - 1);
    await setOption('discussions');
  };
  const handleNextUsers = async () => {
    await setPage((p) => p + 1);
    await setOption('users');
  };
  const handlePreviousUsers = async () => {
    await setPage((p) => p - 1);
    await setOption('users');
  };
  const handleNextGroups = async () => {
    await setPage((p) => p + 1);
    await setOption('groups');
  };
  const handlePreviousGroups = async () => {
    await setPage((p) => p - 1);
    await setOption('groups');
  };
  const renderContent = () => {
    if (isLoading)
      return (
        <div className='flex justify-center'>
          <Loader className='animate-spin' />
        </div>
      );
    if (option === 'all' && data)
      return (
        <div className='xl:space-y-12'>
          <PostsResult
            posts={data.posts}
            previousButtonDisabled={true}
            nextButtonDisabled={false}
            search={search}
            onNextClick={handleNextDiscussion}
            onPreviousClick={handlePreviousDiscussion}
            page={page}
            postsCount={data.postsCount._count}
            order={order ?? ''}
            setOrder={setOrder}
            displayValue={displayValue}
          />

          <GroupsResult
            groups={data.groups}
            previousButtonDisabled={true}
            nextButtonDisabled={groups && groups.length < 12}
            search={search}
            onNextClick={handleNextGroups}
            onPreviousClick={handlePreviousGroups}
            page={page}
            groupsCount={data.groupsCount._count}
          />
          <UsersResult
            users={data.users}
            previousButtonDisabled={true}
            nextButtonDisabled={false}
            onNextClick={handleNextUsers}
            onPreviousClick={handlePreviousUsers}
            page={page}
            usersCount={data.usersCount._count}
          />
        </div>
      );
    if (option === 'discussions')
      return (
        <PostsResult
          posts={posts}
          previousButtonDisabled={page === 1}
          nextButtonDisabled={posts && posts.length < 10}
          search={search}
          onNextClick={handleNextDiscussion}
          onPreviousClick={handlePreviousDiscussion}
          page={page}
          postsCount={data?.postsCount._count}
          order={order ?? ''}
          setOrder={setOrder}
          displayValue={displayValue}
        />
      );
    if (option === 'groups')
      return (
        <GroupsResult
          groups={groups}
          previousButtonDisabled={page === 1}
          nextButtonDisabled={groups && groups.length < 12}
          search={search}
          onNextClick={handleNextGroups}
          onPreviousClick={handlePreviousGroups}
          page={page}
          groupsCount={data?.groupsCount._count}
        />
      );
    if (option === 'users')
      return (
        <UsersResult
          users={users}
          previousButtonDisabled={page === 1}
          nextButtonDisabled={users && users.length < 6}
          onNextClick={handleNextUsers}
          onPreviousClick={handlePreviousUsers}
          page={page}
          usersCount={data?.usersCount._count}
        />
      );
    return null;
  };

  return (
    <div className='mx-6 my-10 max-w-5xl xl:mx-auto xl:mb-24'>
      <header>
        <div className='flex items-center justify-between py-10'>
          <Logo hasName className='flex-row-reverse font-bold text-white' />
          <div>
            <button
              onClick={() => push('/')}
              className='transition-all ease-linear hover:rotate-90'
            >
              <XIcon className=' h-6 w-6 rotate-45 text-white hover:text-red-500' />
            </button>
          </div>
        </div>
      </header>
      <div className='my-6'>
        <div className='flex gap-3'>
          {options.map((o, index) => (
            <div
              key={index}
              className={cn('flex items-center gap-2 px-1 py-2', {
                'border-b border-brand-blue text-white': option === o,
              })}
            >
              <button
                onClick={async () => {
                  await setPage(1);
                  setOption(o);
                }}
                className='uppercase transition-colors ease-linear hover:text-white'
              >
                {o}
              </button>
            </div>
          ))}
        </div>
        <Input
          placeholder='Type here to search...'
          value={search || ''}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default SearchPage;
