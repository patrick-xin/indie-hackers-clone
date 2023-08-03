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

import { prisma } from '@/lib/prisma';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { Flex, Input } from '@/features/UI';
import { Button } from '@/features/UI/Button';
import { TextArea } from '@/features/UI/Input';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { trpc } from '@/utils/trpc';

const PostCreatePage = () => {
  const { query, push } = useRouter();
  const id = query.id as string;
  const type = query.type as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkContent, setLinkContent] = useState('');
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const writingMode = selectedTab === 'write';
  const previewMode = selectedTab === 'preview';
  const { data: post } = trpc.useQuery(['private-posts.by-id', { id }], {
    enabled: Boolean(id),
  });
  const { mutate: savePost, error } = trpc.useMutation('private-posts.save', {
    onSuccess: () => {
      push('/dashboard/post');
    },
  });
  const { mutate: formatPost } = trpc.useMutation('private-posts.format', {});

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
      <div className='mx-auto max-w-4xl'>
        {error && <div>{error.message}</div>}
        {/* Title */}
        <form
          className='space-y-6'
          onSubmit={(e) => {
            e.preventDefault();
            if (type === 'article') {
              savePost({
                title,
                content,
                id,
                type: 'ARTICLE',
              });
            } else {
              savePost({
                title,
                content: linkContent,
                id,
                type: 'LINK',
              });
            }
          }}
        >
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
          {type === 'article' && (
            <>
              <div className='my-8'>
                {/* Button group */}
                <Flex className='my-6 bg-[#152C41]/60 p-2 shadow'>
                  <Flex className='flex-1'>
                    {writingMode && (
                      <Flex className='flex gap-4'>
                        <button
                          type='button'
                          className='group rounded p-1 transition-colors ease-linear hover:bg-brand-blue'
                          onClick={async () => {
                            await commandController.executeCommand('header');
                          }}
                        >
                          <Heading className='h-5 w-5 transition-colors ease-linear group-hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand('bold');
                          }}
                        >
                          <Bold className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand('italic');
                          }}
                        >
                          <Italic className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand('code');
                          }}
                        >
                          <Code className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand('link');
                          }}
                        >
                          <Link className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand('image');
                          }}
                        >
                          <IoMdImage className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand('quote');
                          }}
                        >
                          <Quote className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand(
                              'orderedListCommand'
                            );
                          }}
                        >
                          <ListNumbers className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand(
                              'unorderedListCommand'
                            );
                          }}
                        >
                          <List className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
                        </button>
                        <button
                          type='button'
                          onClick={async () => {
                            await commandController.executeCommand(
                              'checkedListCommand'
                            );
                          }}
                        >
                          <ListCheck className='h-5 w-5 transition-colors ease-linear hover:text-gray-200' />
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
                  <TextArea
                    ref={ref}
                    placeholder='Write content here...'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className='min-h-[60vh] w-full rounded p-2 text-3xl shadow'
                  />
                )}
                {previewMode && (
                  <div className='min-h-[60vh] w-full'>
                    <div className='prose prose-brand mx-auto prose-a:text-brand-blue prose-a:hover:underline prose-img:rounded prose-img:object-cover xl:prose-xl 2xl:prose-2xl'>
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex gap-4'>
                <Button type='submit'>save</Button>
                <Button
                  type='button'
                  onClick={() => {
                    formatPost({ content });
                  }}
                >
                  correct
                </Button>
              </div>
            </>
          )}
          {type === 'link' && (
            <div>
              <Input
                name='link'
                autoFocus
                type='text'
                transparent
                className='text-4xl'
                value={linkContent}
                placeholder='Link URL'
                onChange={(e) => setLinkContent(e.target.value)}
              />
              <Button type='submit'>save</Button>
            </div>
          )}
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
  const post = await prisma.post.findFirst({ where: { id } });
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
  <DashboardLayout>{page}</DashboardLayout>
);
