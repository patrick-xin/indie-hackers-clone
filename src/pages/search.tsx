import { Listbox, Transition } from '@headlessui/react';
import cn from 'clsx';
import { format } from 'date-fns';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import React, { Fragment } from 'react';
import { BsChevronBarExpand } from 'react-icons/bs';
import { ChevronLeft, ChevronRight, X } from 'tabler-icons-react';
import { useDebounce } from 'usehooks-ts';
import z from 'zod';

import { IconButton, Input, Logo } from '@/features/UI';
import DynamicHighlighter from '@/features/UI/ReactHighlighter';
import { AvatarPopover } from '@/features/user/components';
import { trpc } from '@/utils/trpc';

const options = ['all', 'discussions', 'groups', 'users'];

const orderSchema = z.enum(['recent', 'popular', 'oldest', 'discussed']);

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
  const { data } = trpc.useQuery(
    ['public-posts.search', { query: debouncedSearch }],
    {
      enabled: Boolean(debouncedSearch),
    }
  );
  const { data: comments } = trpc.useQuery(
    [
      'public-posts.search-discussions',
      { page: page ?? 0, query: debouncedSearch, order: order ?? 'recent' },
    ],
    { enabled: Boolean(debouncedSearch) && Boolean(order) }
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
    if (option === 'all' && data)
      return (
        <div className='xl:space-y-12'>
          <CommentsResult
            comments={data?.comments}
            previousButtonDisabled={true}
            nextButtonDisabled={false}
            search={search}
            onNextClick={handleNextDiscussion}
            onPreviousClick={handlePreviousDiscussion}
            page={page}
            commentsCount={data?.commentsCount._count}
            order={order ?? ''}
            setOrder={setOrder}
            displayValue={displayValue}
          />

          <GroupsResult
            groups={data?.groups}
            previousButtonDisabled={true}
            nextButtonDisabled={groups && groups.length < 12}
            search={search}
            onNextClick={handleNextGroups}
            onPreviousClick={handlePreviousGroups}
            page={page}
            groupsCount={data?.groupsCount._count}
          />
          <UsersResult
            users={data?.users}
            previousButtonDisabled={true}
            nextButtonDisabled={false}
            onNextClick={handleNextUsers}
            onPreviousClick={handlePreviousUsers}
            page={page}
            usersCount={data?.usersCount._count}
          />
        </div>
      );
    if (option === 'discussions')
      return (
        <CommentsResult
          comments={comments}
          previousButtonDisabled={page === 1}
          nextButtonDisabled={comments && comments.length < 10}
          search={search}
          onNextClick={handleNextDiscussion}
          onPreviousClick={handlePreviousDiscussion}
          page={page}
          commentsCount={data?.commentsCount._count}
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
            <X onClick={() => push('/')} />
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

const orders = [
  { key: 'default', value: 'Best Match' },
  { key: 'popular', value: 'Most Upvotes' },
  { key: 'discussed', value: 'Most Replies' },
  { key: 'recent', value: 'Recent' },
  { key: 'oldest', value: 'Oldest' },
];

export const Select = ({ setOrder, order, displayValue }) => {
  return (
    <div className='flex items-center gap-3'>
      <Listbox
        value={order}
        onChange={(order) => {
          switch (order) {
            case 'Best Match':
              setOrder(null);
              break;
            case 'Most Upvotes':
              setOrder('popular');
              break;
            case 'Most Replies':
              setOrder('discussed');
              break;
            case 'Recent':
              setOrder('recent');
              break;
            case 'Oldest':
              setOrder('oldest');
              break;
            default:
              setOrder(null);
              break;
          }
        }}
      >
        <div className={cn('relative mt-1 w-40')}>
          <Listbox.Button className='form-input text-left'>
            <span className='block truncate'>{displayValue}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronBarExpand
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options
              className={cn(
                'absolute z-100 mt-0.5 flex max-h-60 flex-col overflow-auto rounded py-1 shadow-lg focus:outline-none w-40'
              )}
            >
              {orders.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `combobox-option ${
                      active ? 'bg-brand-blue text-white' : ''
                    }`
                  }
                  value={option.value}
                >
                  <span
                    className={`block truncate ${
                      displayValue === option.value
                        ? 'font-medium text-brand-blue hover:text-white'
                        : 'font-normal'
                    }`}
                  >
                    {option.value}
                  </span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

// const SerachResultContainer = ({
//   title,
//   onNextClick,
//   onPreviousClick,
//   children,
//   hasSelect = false,
//   setOrder,
//   order,
//   displayValue,
//   pageNav,
//   nextButtonDisabled,
//   previousButtonDisabled,
// }: {
//   title: React.ReactNode;
//   onNextClick?: () => void;
//   onPreviousClick?: () => void;
//   children: React.ReactNode;
//   hasSelect?: boolean;
//   setOrder?: (value: string) => string | null;
//   order?: string;
//   displayValue?: string;
//   pageNav: React.ReactNode;
//   nextButtonDisabled: boolean;
//   previousButtonDisabled: boolean;
// }) => {
//   return (
//     <div>
//       <div className='my-4 flex items-center justify-between border-b-4 border-[#1f364d] py-3'>
//         <h4 className='text-xl text-white'>{title}</h4>
//         <div className='flex items-center gap-3'>
//           {pageNav}
//           <div className='flex items-center gap-1'>
//             <IconButton
//               disabled={previousButtonDisabled}
//               variant='outline'
//               icon={
//                 <ChevronLeft
//                   className={
//                     previousButtonDisabled ? 'text-gray-700' : 'text-white'
//                   }
//                 />
//               }
//               onClick={onPreviousClick}
//             />
//             <IconButton
//               disabled={nextButtonDisabled}
//               variant='outline'
//               icon={
//                 <ChevronRight
//                   className={
//                     nextButtonDisabled ? 'text-gray-700' : 'text-white'
//                   }
//                 />
//               }
//               onClick={onNextClick}
//             />
//           </div>
//           {hasSelect && (
//             <Select
//               displayValue={displayValue}
//               setOrder={setOrder}
//               order={order}
//             />
//           )}
//         </div>
//       </div>
//       <>{children}</>
//     </div>
//   );
// };

const CommentsResult = ({
  page,
  commentsCount,
  comments,
  search,
  previousButtonDisabled,
  nextButtonDisabled,
  onPreviousClick,
  onNextClick,
  displayValue,
  setOrder,
  order,
}) => {
  return (
    <div>
      <div className='my-4 flex items-center justify-between border-b-4 border-[#1f364d] py-3'>
        <h4 className='text-xl text-white'>{commentsCount} Discussions</h4>
        <div className='flex items-center gap-3'>
          <div>
            <span>{page * 10 - 9}</span>
            <span>-</span>
            <span>{Math.min(page * 10, commentsCount)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <IconButton
              disabled={previousButtonDisabled}
              variant='outline'
              icon={
                <ChevronLeft
                  className={
                    previousButtonDisabled ? 'text-gray-700' : 'text-white'
                  }
                />
              }
              onClick={onPreviousClick}
            />
            <IconButton
              disabled={nextButtonDisabled}
              variant='outline'
              icon={
                <ChevronRight
                  className={
                    nextButtonDisabled ? 'text-gray-700' : 'text-white'
                  }
                />
              }
              onClick={onNextClick}
            />
          </div>

          <Select
            displayValue={displayValue}
            setOrder={setOrder}
            order={order}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {comments?.map((comment) => (
          <div key={comment.id} className='flex gap-3'>
            <div className='p-2 pr-1'>
              <AvatarPopover user={comment.user} />
            </div>
            <Link
              href={`/@${comment.post.author.username}/${comment.post.slug}`}
            >
              <a className='flex-1 space-y-2 rounded p-2 hover:bg-[#1E364D]'>
                <div className='text-xl text-white'>{comment.post.title}</div>
                <DynamicHighlighter
                  className='line-clamp-3'
                  highlightClassName='text-brand-blue bg-transparent'
                  searchWords={[search]}
                  autoEscape={true}
                  textToHighlight={comment.content}
                />
                <div className='flex gap-3 text-[#4f7092]'>
                  <div>{comment.post._count.likes} upvotes</div>
                  <div>{comment.post._count.comments} replies</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const GroupsResult = ({
  page,
  groupsCount,
  groups,
  search,
  previousButtonDisabled,
  nextButtonDisabled,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <div>
      <div className='my-4 flex items-center justify-between border-b-4 border-[#1f364d] py-3'>
        <h4 className='text-xl text-white'>{groupsCount} Groups</h4>
        <div className='flex items-center gap-3'>
          <div>
            <span>{page === 1 ? 1 : page + 12}</span>
            <span>-</span>
            <span>{Math.min(page * 10, groupsCount ?? 0)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <IconButton
              disabled={previousButtonDisabled}
              variant='outline'
              icon={
                <ChevronLeft
                  className={
                    previousButtonDisabled ? 'text-gray-700' : 'text-white'
                  }
                />
              }
              onClick={onPreviousClick}
            />
            <IconButton
              disabled={nextButtonDisabled}
              variant='outline'
              icon={
                <ChevronRight
                  className={
                    nextButtonDisabled ? 'text-gray-700' : 'text-white'
                  }
                />
              }
              onClick={onNextClick}
            />
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {groups?.map((group) => (
          <div key={group.id} className='flex gap-3'>
            <div className='p-2 pr-1'>
              <Image src={group.image} height={60} width={60} />
            </div>
            <Link href={`/groups/${group.slug}`}>
              <a className='flex-1 space-y-2 rounded p-2 hover:bg-[#1E364D]'>
                <DynamicHighlighter
                  highlightClassName='text-brand-blue bg-transparent'
                  className='text-xl text-white'
                  searchWords={[search]}
                  autoEscape={true}
                  textToHighlight={group.name}
                />
                <div className='flex gap-3 text-[#4f7092]'>
                  <div>{group._count.members} memebers</div>
                  <div>{format(group.createdAt, 'LLL dd')}</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersResult = ({
  page,
  usersCount,
  users,
  previousButtonDisabled,
  nextButtonDisabled,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <div>
      <div className='my-4 flex items-center justify-between border-b-4 border-[#1f364d] py-3'>
        <h4 className='text-xl text-white'>{usersCount} Users</h4>
        <div className='flex items-center gap-3'>
          <div>
            <span>{page * 6 - 5}</span>
            <span>-</span>
            <span>{Math.min(page * 6, usersCount ?? 0)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <IconButton
              disabled={previousButtonDisabled}
              variant='outline'
              icon={
                <ChevronLeft
                  className={
                    previousButtonDisabled ? 'text-gray-700' : 'text-white'
                  }
                />
              }
              onClick={onPreviousClick}
            />
            <IconButton
              disabled={nextButtonDisabled}
              variant='outline'
              icon={
                <ChevronRight
                  className={
                    nextButtonDisabled ? 'text-gray-700' : 'text-white'
                  }
                />
              }
              onClick={onNextClick}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4'>
        {users?.map((user) => (
          <div key={user.id} className='flex flex-col items-center gap-3'>
            <div className='p-2 pr-1'>
              <AvatarPopover user={user} size='large' />
            </div>

            <Link href={`/@${user.username}`}>
              <a className=''>
                <div className='flex flex-col gap-3 text-center text-[#4f7092]'>
                  <div>{user.name}</div>
                  <div>@{user.username}</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
