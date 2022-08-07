import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Loader } from 'tabler-icons-react';
import z from 'zod';

import { Flex } from '@/features/UI';
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

  return (
    <div>
      <div>
        <h2>My Posts ({posts?.length})</h2>
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

      {isLoading || !posts ? (
        <Flex>
          <Loader />
        </Flex>
      ) : (
        <div>
          <ul>
            {posts?.map((post) => (
              <li key={post.id}>
                <div>
                  <div>
                    <div>
                      <h1>{format(post.createdAt, 'HH:mm, LLLL dd, yyyy')}</h1>

                      {post.status === 'PUBLISHED' ? (
                        <div>
                          <Link href={`/@${post.author.username}/${post.slug}`}>
                            <a>
                              <h1>{post.title}</h1>
                            </a>
                          </Link>

                          <h2>
                            Published at{' '}
                            {format(post.publishedAt, 'LLLL dd, yyyy')}
                          </h2>
                        </div>
                      ) : (
                        <Link href={`/@${post.author.username}/${post.slug}`}>
                          <a>
                            <h1>{post.title}</h1>
                          </a>
                        </Link>
                      )}
                    </div>

                    <Flex>
                      <div>{post.status}</div>
                    </Flex>
                    <div>
                      <div>
                        <Link
                          href={`/dashboard/post/${post.id}/manage`}
                          passHref
                        >
                          <button>Manage</button>
                        </Link>
                        <Link href={`/dashboard/post/${post.id}`} passHref>
                          <button>Edit</button>
                        </Link>

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
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
