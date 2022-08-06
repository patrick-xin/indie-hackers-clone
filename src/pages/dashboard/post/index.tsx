import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  List,
  Loader,
  Paper,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Dots } from 'tabler-icons-react';
import z from 'zod';

import { POST_ORDER } from '@/lib/constants';

import Flex from '@/components/common/Flex';
import { DashboardLayout } from '@/components/layout/dashboard';

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
    <DashboardLayout>
      <Stack mb={12}>
        <Title mb={32}>My Posts ({posts?.length})</Title>
        <Group position='right'>
          <Select
            placeholder='Recently Created'
            value={order}
            onChange={(val) => {
              setOrder(val);
              router.push({ query: `sort=${val}` });
            }}
            data={POST_ORDER}
          />
        </Group>
      </Stack>

      {isLoading || !posts ? (
        <Flex height={500}>
          <Loader size='sm' />
        </Flex>
      ) : (
        <Box>
          <List listStyleType='none' spacing='lg'>
            {posts?.map((post) => (
              <List.Item key={post.id}>
                <Paper p='lg'>
                  <SimpleGrid
                    breakpoints={[
                      { maxWidth: 980, cols: 3, spacing: 'md' },
                      { maxWidth: 755, cols: 2, spacing: 'sm' },
                      { maxWidth: 600, cols: 1, spacing: 'sm' },
                    ]}
                    cols={3}
                    style={{ alignItems: 'center' }}
                  >
                    <div>
                      <Text color='dimmed' size='xs'>
                        {format(post.createdAt, 'HH:mm, LLLL dd, yyyy')}
                      </Text>

                      {post.status === 'PUBLISHED' ? (
                        <Group direction='column'>
                          <Anchor
                            component={Link}
                            href={`/@${post.author.username}/${post.slug}`}
                          >
                            <Title style={{ cursor: 'pointer' }} order={3}>
                              {post.title}
                            </Title>
                          </Anchor>
                          <Text color='dimmed' size='xs'>
                            Published at{' '}
                            {format(post.publishedAt, 'LLLL dd, yyyy')}
                          </Text>
                        </Group>
                      ) : (
                        <Title order={3}>{post.title}</Title>
                      )}
                    </div>

                    <Flex>
                      <Badge
                        color={
                          post.status === 'DRAFT'
                            ? 'yellow'
                            : post.status === 'PUBLISHED'
                            ? 'green'
                            : 'blue'
                        }
                      >
                        {post.status}
                      </Badge>
                    </Flex>
                    <div>
                      <Group position='right'>
                        <Link
                          href={`/dashboard/post/${post.id}/manage`}
                          passHref
                        >
                          <Button variant='subtle'>Manage</Button>
                        </Link>
                        <Link href={`/dashboard/post/${post.id}/edit`} passHref>
                          <Button variant='subtle'>Edit</Button>
                        </Link>

                        <Popover
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
                        </Popover>
                      </Group>
                    </div>
                  </SimpleGrid>
                </Paper>
              </List.Item>
            ))}
          </List>
        </Box>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
