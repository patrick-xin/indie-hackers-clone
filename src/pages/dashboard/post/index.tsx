import { Listbox } from '@headlessui/react';
import cn from 'clsx';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import { Selector } from 'tabler-icons-react';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { Button, ButtonLink, Flex, FullScreenLoader } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const SELECT_PAGE_COUNT = [4, 6, 8];

const DashboardPage = () => {
  const [selectedPageCount, setSelectedPageCount] = useState(
    SELECT_PAGE_COUNT[0]
  );

  //const router = useRouter();
  //const sort = z.enum(['title', 'creation', 'published']);
  const [page, setPage] = useState(0);
  //const query = router.query.sort as z.infer<typeof sort>;
  // const { data: posts, isLoading } = trpc.useQuery([
  //   'private-posts.all',
  //   { query: query ?? 'creation' },
  // ]);
  const {
    data: posts,
    isPreviousData,
    isError,
    isLoading,
  } = trpc.useQuery([
    'private-posts.test',
    { query: { page: page, pageCount: selectedPageCount } },
  ]);

  if (isLoading || !posts) {
    return <FullScreenLoader />;
  }

  return (
    <div className='relative mx-auto max-w-4xl'>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error</div>
        ) : (
          <div className='h-screen'>
            <h1 className='mb-12 text-3xl text-white'>
              My Posts {posts.totalCount}
            </h1>
            <div className='overflow-auto pb-12'>
              <ul className='space-y-4'>
                {posts.posts.map((post) => (
                  <li
                    key={post.id}
                    className='rounded-md bg-indigo-300/10 px-4 py-3'
                  >
                    <Flex className='items-center justify-between'>
                      <div>
                        <div className='mb-1 text-sm italic'>
                          {format(post.createdAt, 'HH:mm, LLLL dd, yyyy')}
                        </div>

                        {post.status === 'DRAFT' ? (
                          <div>
                            <Link
                              href={`/@${post.author.username}/${post.slug}`}
                            >
                              <a>
                                <h3 className='text-2xl text-white hover:underline'>
                                  {post.title}
                                </h3>
                              </a>
                            </Link>
                          </div>
                        ) : (
                          <h3 className='text-2xl text-white'>{post.title}</h3>
                        )}
                      </div>

                      <div
                        className={cn(
                          'bg-emerald-600/20 h-min text-xs tracking-wider font-bold text-emerald-400 py-1 px-2.5 rounded-xl'
                        )}
                      >
                        {post.status}
                      </div>

                      <Flex className='gap-4'>
                        <ButtonLink
                          variant='outline'
                          href={`/dashboard/post/${post.id}/manage`}
                        >
                          Manage
                        </ButtonLink>
                        <ButtonLink
                          variant='outline'
                          href={`/dashboard/post/${post.postType.toLowerCase()}/${
                            post.id
                          }`}
                        >
                          Edit
                        </ButtonLink>

                        {/* <Popover
                          opened={opened === post.id}
                          onClose={() => setOpened(null)}
                          position='bottom'
                          placement='end'
                          withCloseButton
                          title='Actions'
                          transition='pop-top-right'
                          target={
                            <ActionIcon
                              color='blue'
                              // variant={theme.colorScheme === 'dark' ? 'hover' : 'light'}
                              onClick={() => setOpened(post.id)}
                            >
                              <Dots size={16} />
                            </ActionIcon>
                          }
                        >
                          <Stack sx={{ width: '200px' }}>
                            <Link href='/hello' passHref>
                              <Button component='a'>Stats</Button>
                            </Link>

                            <div>Archive</div>
                          </Stack>
                        </Popover> */}
                      </Flex>
                    </Flex>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* <Group position='right'>
          <Select
            placeholder='Recently Created'
            value={order}
            onChange={(val) => {
              setOrder(val);
              router.push({ query: `sort=${val}` });
            }}
            data={POST_ORDER}
          />
        </Group> */}
      </div>
      <div className='sticky bottom-0 w-full bg-indigo-300/10'>
        <div className='flex items-center justify-between'>
          <div>{posts.totalCount}</div>
          <Flex className='items-center gap-4'>
            <div>
              <Button
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={page === 0}
              >
                Previous Page
              </Button>
            </div>
            <div>
              page <span>{page + 1}</span> of{' '}
              <span>{Math.ceil(posts.totalCount / selectedPageCount)}</span>
            </div>

            <div>
              <Button
                onClick={() => {
                  if (!isPreviousData && posts?.hasMore) {
                    setPage((old) => old + 1);
                  }
                }}
                // Disable the Next Page button until we know a next page is available
                disabled={
                  isPreviousData ||
                  !posts?.hasMore ||
                  page + 1 === Math.ceil(posts.totalCount / 4)
                }
              >
                Next Page
              </Button>
            </div>
          </Flex>
          <div>
            <Listbox
              value={selectedPageCount}
              onChange={(count) => {
                setPage(0);
                setSelectedPageCount(count);
              }}
            >
              <div className='relative mt-1'>
                <Listbox.Button className='relative w-full cursor-default rounded-lg bg-brand-blue py-2 pl-3 pr-10 text-left text-gray-100 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
                  <span className='block truncate'>{selectedPageCount}</span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <Selector className='h-5 w-5' aria-hidden='true' />
                  </span>
                </Listbox.Button>
                <div>
                  <Listbox.Options className='absolute -top-2 my-1 max-h-60 w-full -translate-y-full overflow-auto rounded-md bg-brand-blue py-1 text-base text-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                    {SELECT_PAGE_COUNT.map((count, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-4 ${
                            active ? 'bg-red-600/10' : ''
                          }`
                        }
                        value={count}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {count}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </div>
            </Listbox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

DashboardPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
