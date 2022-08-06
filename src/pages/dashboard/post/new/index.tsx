import cn from 'clsx';
import dynamic from 'next/dynamic';
import React, { ReactElement, useState } from 'react';
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

const Editor = dynamic(
  () => import('@/features/post/components/editor/editorjs'),
  {
    ssr: false,
  }
);

import { IoMdImage } from 'react-icons/io';
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

const PostCreatePage = () => {
  const [title, setTitle] = useState('');
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

  const [value, setValue] = React.useState('**Hello world!!!**');
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write'
  );
  console.log(selectedTab);

  return (
    <div>
      <div className='max-w-4xl mx-auto'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(value);
          }}
        >
          {/* Title */}
          <div className='my-8'>
            <input
              name='title'
              autoFocus
              type='text'
              className='bg-transparent text-gray-200 text-4xl appearance-none focus:outline-none'
              value={title}
              placeholder='Start with an awesome title'
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='my-8'>
            {/* Button group */}
            <div className='flex justify-between items-center p-2 bg-[#152C41]/60 my-6 shadow'>
              <div className='flex-1'>
                {' '}
                {selectedTab === 'write' && (
                  <div className='flex gap-3'>
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
                  </div>
                )}
              </div>

              <div className='flex gap-4'>
                <button
                  onClick={() => setSelectedTab('write')}
                  type='button'
                  className={cn('p-1 w-20 text-white rounded-sm', {
                    'bg-gradient-to-r from-[#e052a0] to-[#f15c41]':
                      selectedTab === 'write',
                  })}
                >
                  Write
                </button>
                <button
                  className={cn('p-1 w-20 text-white rounded-sm', {
                    'bg-gradient-to-r from-[#e052a0] to-[#f15c41]':
                      selectedTab === 'preview',
                  })}
                  type='button'
                  onClick={() => setSelectedTab('preview')}
                >
                  Preview
                </button>
              </div>
            </div>
            {/* Textarea */}
            {selectedTab === 'write' && (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={ref}
                placeholder='Write content here...'
                className='w-full text-2xl p-2 placeholder:text-gray-500 shadow rounded min-h-[60vh] outline-none appearance-none focus:outline-none focus:border-none bg-[#152C41] text-gray-300'
              />
            )}
            {selectedTab === 'preview' && (
              <div className='p-2 w-full my-6 min-h-[60vh]'>
                <div className='prose prose-brand prose-a:text-brand-blue prose-a:hover:underline xl:prose-xl 2xl:prose-2xl mx-auto prose-img:rounded prose-img:object-cover'>
                  <ReactMarkdown>{value}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          <button type='submit'>save</button>
        </form>
      </div>
    </div>
  );
};

export default PostCreatePage;

PostCreatePage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
