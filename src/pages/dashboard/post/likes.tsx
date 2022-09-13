import { Listbox, Transition } from '@headlessui/react';
import cn from 'clsx';
import Link from 'next/link';
import { Fragment, ReactElement, useState } from 'react';
import { BsChevronBarExpand } from 'react-icons/bs';

import { DashboardLayout } from '@/features/layout/Dashboard';
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
          <BookmarkSelect
            selectedItem={selectedPostType}
            setSelectedItem={setSelectedPostType}
            options={['all', 'link', 'article']}
            label='Post Type'
          />
          <BookmarkSelect
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

interface SelectProps {
  options: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  size?: 'small' | 'normal';
  label: string;
}

const BookmarkSelect = ({
  selectedItem,
  setSelectedItem,
  options,
  size = 'small',
  label,
}: SelectProps) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='text-lg text-white'>{label}</div>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <div
          className={cn('relative mt-1', {
            'w-24': size === 'small',
            'w-32': size === 'normal',
          })}
        >
          <Listbox.Button className='form-input text-left'>
            <span className='block truncate'>{selectedItem}</span>
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
                'absolute z-100 mt-0.5 flex max-h-60 flex-col overflow-auto rounded py-1 shadow-lg focus:outline-none',
                {
                  'w-24': size === 'small',
                  'w-32': size === 'normal',
                }
              )}
            >
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `combobox-option ${
                      active ? 'bg-brand-blue text-white' : ''
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected
                            ? 'font-medium text-brand-blue hover:text-white'
                            : 'font-normal'
                        }`}
                      >
                        {option}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
