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
  const { _ref, commandController } = useTextAreaMarkdownEditor({
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
      <div className='mx-auto max-w-4xl'>
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
                  variant={writingMode ? 'primary' : 'transparent'}
                  onClick={() => setSelectedTab('write')}
                >
                  Write
                </Button>
                <Button
                  variant={!writingMode ? 'primary' : 'transparent'}
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
                className='min-h-[60vh] w-full rounded p-2 text-2xl shadow'
              />
            )}
            {previewMode && (
              <div className='min-h-[60vh] w-full'>
                <div className='prose prose-brand mx-auto prose-a:text-brand-blue prose-a:hover:underline prose-img:rounded prose-img:object-cover xl:prose-xl 2xl:prose-2xl'>
                  <ReactMarkdown>{value}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          <Flex className='justify-end gap-4'>
            <Button type='submit' variant='gradient-inverse'>
              Save draft
            </Button>
            <Button type='submit' variant='gradient'>
              Publish
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default PostCreatePage;

PostCreatePage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
