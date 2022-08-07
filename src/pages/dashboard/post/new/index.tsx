import React, { ReactElement, useState } from 'react';
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
  const writingMode = selectedTab === 'write';
  const previewMode = selectedTab === 'preview';

  return (
    <div>
      <div className='max-w-4xl mx-auto'>
        <form
          className='space-y-6'
          onSubmit={(e) => {
            e.preventDefault();
            alert(value);
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
                placeholder='Write content here...'
                textarea
                onChange={(e) => setValue(e.target.value)}
                className='w-full text-2xl p-2 shadow rounded min-h-[60vh]'
              />
            )}
            {previewMode && (
              <div className='w-full min-h-[60vh]'>
                <div className='prose prose-brand prose-a:text-brand-blue prose-a:hover:underline xl:prose-xl 2xl:prose-2xl mx-auto prose-img:rounded prose-img:object-cover'>
                  <ReactMarkdown>{value}</ReactMarkdown>
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

PostCreatePage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
