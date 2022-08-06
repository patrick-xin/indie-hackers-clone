import {
  Button,
  Group,
  Loader,
  Overlay,
  Stack,
  TextInput,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useRef } from 'react';
import { Check, X } from 'tabler-icons-react';

import RichTextEditor from '@/components/common/RichTextEditor';
import { DashboardLayout } from '@/components/layout/dashboard';

import { trpc } from '@/utils/trpc';
const PostEditPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: post, isLoading } = trpc.useQuery(
    ['private-posts.by-id', { id }],
    {
      enabled: Boolean(id),
    }
  );
  const { mutate } = trpc.useMutation(['private-posts.publish'], {
    onSuccess: () => {
      showNotification({
        message: 'Place created!',
        color: 'green',
        icon: <Check />,
      });
    },
    onError: () => {
      showNotification({
        message: 'Place created falied, please try again later.',
        color: 'red',
        icon: <X />,
      });
    },
  });
  const [content, setContent] = useInputState('');
  const [title, setTitle] = useInputState('');
  const titleRef = useRef<null | HTMLInputElement>(null);
  useEffect(() => {
    if (post) {
      setContent(post.content);
      if (post.title) {
        setTitle(post.title);
      } else {
        setTitle('Untitled');
      }
    }

    if (titleRef) {
      titleRef.current?.focus();
    }
  }, [post, id]);

  const handlePublish = () => {
    if (post)
      mutate({
        content,
        title,
        id: post.id,
      });
  };

  return (
    <div style={{ position: 'relative' }}>
      {isLoading ? (
        <Overlay color='black'>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'yellow',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader />
          </div>
        </Overlay>
      ) : post ? (
        <Stack spacing='md'>
          <TextInput
            ref={titleRef}
            value={title}
            onChange={setTitle}
            variant='unstyled'
            size='xl'
            placeholder='New post title here'
            mb={12}
          />
          <RichTextEditor
            sx={(theme) => ({ minHeight: theme.breakpoints.xs })}
            controls={[
              ['bold', 'italic', 'underline', 'link', 'image', 'code'],
              ['unorderedList', 'h1', 'h2', 'h3'],
              ['sup', 'sub'],
              ['alignLeft', 'alignCenter', 'alignRight'],
            ]}
            value={post.content ?? content}
            defaultValue={content}
            onChange={setContent}
          />
          <Group position='right'>
            {post.status === 'DRAFT' ? (
              <Button onClick={handlePublish}>Publish</Button>
            ) : post.status === 'PUBLISHED' ? (
              <Button onClick={handlePublish} color='yellow'>
                Unublish
              </Button>
            ) : (
              <Button onClick={handlePublish} color='red'>
                Delete
              </Button>
            )}
          </Group>
        </Stack>
      ) : null}
    </div>
  );
};

export default PostEditPage;

PostEditPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
