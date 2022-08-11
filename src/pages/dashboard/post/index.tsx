import cn from 'clsx';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import z from 'zod';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { ButtonLink, Flex, FullScreenLoader } from '@/features/UI';
import { trpc } from '@/utils/trpc';

const DashboardPage = () => {
  const [opened, setOpened] = useState<null | string>(null);
  const [order, setOrder] = useState<null | string>('Recently Created');
  const router = useRouter();
  const sort = z.enum(['title', 'creation', 'published']);
  const query = router.query.sort as z.infer<typeof sort>;
  const { data: posts, isLoading } = trpc.useQuery([
    'private-posts.all',
    { query: query ?? 'creation' },
  ]);

  if (isLoading || !posts) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <div>
        <h1 className='text-3xl text-white mb-12'>My Posts {posts.length}</h1>
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

      <div>
        <ul className='space-y-4'>
          {posts?.map((post) => (
            <li key={post.id} className='bg-indigo-300/10 rounded-md px-4 py-3'>
              <Flex className='justify-between items-center'>
                <div>
                  <div className='text-sm mb-1 italic'>
                    {format(post.createdAt, 'HH:mm, LLLL dd, yyyy')}
                  </div>

                  {post.status === 'DRAFT' ? (
                    <div>
                      <Link href={`/@${post.author.username}/${post.slug}`}>
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
                    href={`/dashboard/post/${post.id}/manage`}
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
  );
};

export default DashboardPage;

DashboardPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
