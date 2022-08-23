import { Dialog, RadioGroup } from '@headlessui/react';
import cn from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { X } from 'tabler-icons-react';

import { useModalStore } from '@/lib/store/modal';

import { Button, Input } from '@/features/UI';
import { trpc } from '@/utils/trpc';
const editorTypes = [
  {
    id: 'BLOCK_EDITOR',
    type: 'BLOCK_EDITOR',
    title: 'Block Editor',
    description: 'Use block Editor',
  },
  {
    id: 'MARKDOWN',
    type: 'MARKDOWN',
    title: 'Markdown',
    description: 'Use markdown',
  },
];

const postTypes = [
  {
    id: 'ARTICLE',
    type: 'ARTICLE',
    title: 'Article',
  },
  {
    id: 'LINK',
    type: 'LINK',
    title: 'Link',
  },
];

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export const NewPostModal = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [editorType, setEditorType] = useState(editorTypes[0]);
  const [postType, setPostType] = useState(postTypes[0]);
  const { modalOpen, setOpen, setClose } = useModalStore();
  const { mutate, isLoading } = trpc.useMutation('private-posts.create', {
    onSuccess: (id) => {
      setClose();
      if (postType.type === 'LINK') router.push(`/dashboard/post/link/${id}`);
      if (postType.type === 'ARTICLE')
        router.push(`/dashboard/post/article/${id}`);
    },
  });
  const handleCreatePost = () => {
    mutate({
      title,
    });
  };

  return (
    <div>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={setClose}
        open={modalOpen}
      >
        <div>
          <div className='fixed inset-0 transition-opacity bg-brand-indigo-bg/20 bg-opacity-30 backdrop-blur-lg' />
        </div>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex justify-center min-h-full p-4 text-center sm:items-center sm:p-0'>
            <AnimatePresence>
              {modalOpen && (
                <Dialog.Panel
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.1 } }}
                  exit={{ opacity: 0 }}
                  className='relative px-4 pt-5 pb-4 bg-[#152C41] transform rounded-lg border-[1px] border-gray-100/20 min-h-[40vh] w-[90vw] sm:my-8 sm:w-full sm:p-6 lg:w-[60vw] shadow-lg'
                >
                  <div className='absolute top-0 right-0 pt-4 pr-4'>
                    <button
                      type='button'
                      className='rounded-md hover:text-gray-200 focus:outline-none focus:ring-0 focus:ring-offset-2'
                      onClick={() => setClose()}
                    >
                      <span className='sr-only'>Close</span>
                      <X className='w-6 h-6' aria-hidden='true' />
                    </button>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <h2 className='flex-none p-2 text-2xl font-bold text-white'>
                      Create new post
                    </h2>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('to do!!');
                    }}
                    className='inline-block w-full p-2 overflow-hidden text-left align-bottom transition-all transform sm:align-middle space-y-6'
                  >
                    {/* Title */}

                    <Input
                      label='title'
                      value={title}
                      className='border-[1px] border-[#63809c]/50 focus:bg-transparent focus:border-gray-400 focus:ring-0 p-3'
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <RadioGroup value={postType} onChange={setPostType}>
                      <RadioGroup.Label className='text-white'>
                        Create new article or link
                      </RadioGroup.Label>

                      <div className='grid grid-cols-2 md:grid-cols-1 mt-4 gap-2 md:gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                        {postTypes.map((type) => (
                          <RadioGroup.Option
                            key={type.id}
                            value={type}
                            defaultChecked={type.type === 'ARTICLE'}
                            className={({ checked, active }) =>
                              cn(
                                'relative border-[1px] border-[#63809c]/50 rounded shadow-sm p-2 md:p-4 flex cursor-pointer',
                                {
                                  'bg-brand-blue': checked,
                                  'bg-transparent': !checked,
                                  'border-blue-400': active,
                                }
                              )
                            }
                          >
                            {({ checked }) => (
                              <div
                                className={cn('flex items-center', {
                                  'text-white': checked,
                                })}
                              >
                                <div className='w-8'>
                                  <BiCheckCircle
                                    className={cn('h-5 w-5', {
                                      hidden: !checked,
                                    })}
                                    aria-hidden='true'
                                  />
                                </div>

                                <div>
                                  <span className='flex flex-1'>
                                    <span className='flex flex-col'>
                                      <RadioGroup.Label
                                        as='span'
                                        className='block font-bold'
                                      >
                                        {type.title}
                                      </RadioGroup.Label>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                    {/* Radio group choice */}
                    {postType.type === 'ARTICLE' && (
                      <div className='space-y-4'>
                        <RadioGroup value={editorType} onChange={setEditorType}>
                          <RadioGroup.Label className='text-white'>
                            Which type of editor do you prefer?
                          </RadioGroup.Label>

                          <div className='grid grid-cols-2 md:grid-cols-1 mt-4 gap-2 md:gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                            {editorTypes.map((formType) => (
                              <RadioGroup.Option
                                key={formType.id}
                                value={formType}
                                className={({ checked, active }) =>
                                  cn(
                                    'relative border-[1px] border-[#63809c]/50 rounded shadow-sm p-2 md:p-4 flex cursor-pointer',
                                    {
                                      'bg-brand-blue': checked,
                                      'bg-transparent': !checked,
                                      'border-blue-400': active,
                                    }
                                  )
                                }
                              >
                                {({ checked }) => (
                                  <div
                                    className={cn('flex items-center', {
                                      'text-white': checked,
                                    })}
                                  >
                                    <div className='w-8'>
                                      <BiCheckCircle
                                        className={cn('h-5 w-5', {
                                          hidden: !checked,
                                        })}
                                        aria-hidden='true'
                                      />
                                    </div>

                                    <div>
                                      <span className='flex flex-1'>
                                        <span className='flex flex-col'>
                                          <RadioGroup.Label
                                            as='span'
                                            className='block font-bold'
                                          >
                                            {formType.title}
                                          </RadioGroup.Label>
                                          <RadioGroup.Description
                                            as='span'
                                            className='items-center hidden md:flex mt-1 text-xs whitespace-pre-wrap'
                                          >
                                            {formType.description}
                                          </RadioGroup.Description>
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                        {/* Checkbox for remember choice */}
                        <div className='flex gap-2 items-center'>
                          <input
                            type='checkbox'
                            className='rounded-full bg-transparent'
                          />
                          <label htmlFor='choice'>
                            Remember my choice for editor
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Submit button */}
                    <div className='mt-5 sm:mt-6 flex justify-end'>
                      <Button
                        disabled={title.length < 5}
                        variant='primary'
                        onClick={handleCreatePost}
                        loading={isLoading}
                        loadingText='creating'
                      >
                        create
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
