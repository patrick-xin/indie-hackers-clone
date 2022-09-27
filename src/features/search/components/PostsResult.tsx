import { Listbox, Transition } from '@headlessui/react';
import cn from 'clsx';
import Link from 'next/link';
import { Fragment } from 'react';
import { BsChevronBarExpand } from 'react-icons/bs';

import { SearchNavigation } from '@/features/search/components/SearchNavigation';
import DynamicHighlighter from '@/features/UI/ReactHighlighter';
import { AvatarPopover } from '@/features/user/auth/components';

type PostsResultProps = {
  page;
  postsCount;
  posts;
  search;
  previousButtonDisabled;
  nextButtonDisabled;
  onPreviousClick;
  onNextClick;
  displayValue;
  setOrder;
  order;
};

export const PostsResult = ({
  page,
  postsCount,
  posts,
  search,
  previousButtonDisabled,
  nextButtonDisabled,
  onPreviousClick,
  onNextClick,
  displayValue,
  setOrder,
  order,
}: PostsResultProps) => {
  return (
    <div>
      <div className='my-4 flex items-center justify-between border-b-4 border-[#1f364d] py-3'>
        <h4 className='text-xl text-white'>{postsCount} Discussions</h4>
        <div className='flex items-center gap-3'>
          <SearchNavigation
            page={page}
            count={postsCount}
            baseCount={10}
            nextButtonDisabled={nextButtonDisabled}
            previousButtonDisabled={previousButtonDisabled}
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
          />

          <PostsOrderSelect
            displayValue={displayValue}
            setOrder={setOrder}
            order={order}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {posts?.map((post) => (
          <div key={post.id} className='flex gap-3'>
            <div className='p-2 pr-1'>
              <AvatarPopover user={post.author} />
            </div>
            <Link href={`/@${post.author.username}/${post.slug}`}>
              <a className='flex-1 space-y-2 rounded p-2 hover:bg-[#1E364D]'>
                <DynamicHighlighter
                  className='text-xl text-white'
                  highlightClassName='text-brand-blue bg-transparent'
                  searchWords={[search]}
                  autoEscape={true}
                  textToHighlight={post.title}
                />
                <div>
                  <DynamicHighlighter
                    //className='line-clamp-3'
                    highlightClassName='text-brand-blue bg-transparent'
                    searchWords={[search]}
                    autoEscape={true}
                    textToHighlight={post.content}
                  />
                </div>

                <div className='flex gap-3 text-[#4f7092]'>
                  <div>{post._count.likes} upvotes</div>
                  <div>{post._count.comments} replies</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const orders = [
  { key: 'default', value: 'Best Match' },
  { key: 'popular', value: 'Most Upvotes' },
  { key: 'discussed', value: 'Most Replies' },
  { key: 'recent', value: 'Recent' },
  { key: 'oldest', value: 'Oldest' },
];

export const PostsOrderSelect = ({ setOrder, order, displayValue }) => {
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
