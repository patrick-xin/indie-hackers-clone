import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import React, { ReactElement, useEffect, useState } from 'react';
import { IoMdImage } from 'react-icons/io';
import ReactMarkdown from 'react-markdown';
import {
  bold,
  checkedListCommand,
  code,
  header,
  image,
  italic,
  link,
  orderedListCommand,
  quote,
  strikethrough,
  unorderedListCommand,
  useTextAreaMarkdownEditor,
} from 'react-mde';
import {
  Bold,
  Code,
  Heading,
  Italic,
  Link,
  List,
  ListCheck,
  ListNumbers,
  Quote,
} from 'tabler-icons-react';

import { BasicLayout } from '@/features/layout/Basic';
import { Flex, Input } from '@/features/UI';
import { Button } from '@/features/UI/Button';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { trpc } from '@/utils/trpc';

const PostCreatePage = () => {
  const { query, push } = useRouter();
  const id = query.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = React.useState('**Hello world!!!**');
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write'
  );
  const writingMode = selectedTab === 'write';
  const previewMode = selectedTab === 'preview';
  const { data: post } = trpc.useQuery(['private-posts.by-id', { id }], {
    enabled: Boolean(id),
  });
  const { mutate: savePost } = trpc.useMutation('private-posts.save', {
    onSuccess: () => {
      push('/dashboard/post');
    },
  });
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);
  const { ref, commandController } = useTextAreaMarkdownEditor({
    commandMap: {
      bold: bold,
      italic: italic,
      code: code,
      quote: quote,
      link,
      image,
      strikethrough,
      header,
      orderedListCommand,
      unorderedListCommand,
      checkedListCommand,
    },
  });

  return (
    <div>
      <div className='max-w-4xl mx-auto'>
        <form
          className='space-y-6'
          onSubmit={(e) => {
            e.preventDefault();
            savePost({
              title,
              content,
              id,
            });
          }}
        >
          {/* Title */}

          <Input
            name='title'
            autoFocus
            type='text'
            transparent
            className='text-4xl'
            value={title}
            placeholder='Start with an awesome title'
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className='my-8'>
            {/* Button group */}
            <Flex className='p-2 bg-[#152C41]/60 my-6 shadow'>
              <Flex className='flex-1'>
                {writingMode && (
                  <Flex className='flex gap-4'>
                    <button
                      type='button'
                      className='p-1 hover:bg-brand-blue rounded group transition-colors ease-linear'
                      onClick={async () => {
                        await commandController.executeCommand('header');
                      }}
                    >
                      <Heading className='w-5 h-5 group-hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand('bold');
                      }}
                    >
                      <Bold className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand('italic');
                      }}
                    >
                      <Italic className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand('code');
                      }}
                    >
                      <Code className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand('link');
                      }}
                    >
                      <Link className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand('image');
                      }}
                    >
                      <IoMdImage className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand('quote');
                      }}
                    >
                      <Quote className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand(
                          'orderedListCommand'
                        );
                      }}
                    >
                      <ListNumbers className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand(
                          'unorderedListCommand'
                        );
                      }}
                    >
                      <List className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                    <button
                      type='button'
                      onClick={async () => {
                        await commandController.executeCommand(
                          'checkedListCommand'
                        );
                      }}
                    >
                      <ListCheck className='w-5 h-5 hover:text-gray-200 transition-colors ease-linear' />
                    </button>
                  </Flex>
                )}
              </Flex>

              <Flex>
                <Button
                  color={writingMode ? 'gradient' : 'transparent'}
                  onClick={() => setSelectedTab('write')}
                >
                  Write
                </Button>
                <Button
                  color={!writingMode ? 'gradient' : 'transparent'}
                  onClick={() => setSelectedTab('preview')}
                >
                  Preview
                </Button>
              </Flex>
            </Flex>
            {/* Textarea */}
            {writingMode && (
              <Input
                ref={ref}
                placeholder='Write content here...'
                textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='w-full text-2xl p-2 shadow rounded min-h-[60vh]'
              />
            )}
            {previewMode && (
              <div className='w-full min-h-[60vh]'>
                <div className='prose prose-brand prose-a:text-brand-blue prose-a:hover:underline xl:prose-xl 2xl:prose-2xl mx-auto prose-img:rounded prose-img:object-cover'>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          <Button type='submit'>save</Button>
        </form>
      </div>
    </div>
  );
};

export default PostCreatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const id = context.query.id as string;
  const post = await prisma?.post.findFirst({ where: { id } });
  const isOwner = session.user.userId === post?.authorId;
  if (!isOwner) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

PostCreatePage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
