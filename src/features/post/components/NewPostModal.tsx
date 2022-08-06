import { Dialog, RadioGroup } from '@headlessui/react';
import cn from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { X } from 'tabler-icons-react';

import { NewPostButton } from '@/features/homepage/sections/content/components/NewPostButton';
const editorTypes = [
  {
    type: 'BLOCK_EDITOR',
    title: 'Block Editor',
    description: 'Use block Editor',
  },
  {
    id: 'MARKDOWN',
    title: 'Markdown',
    description: 'Use markdown',
  },
];

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export const NewPostModal = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [editorType, setEditorType] = useState(editorTypes[0]);
  return (
    <div>
      <Dialog as='div' className='relative z-10' onClose={setOpen} open={open}>
        <div>
          <div className='fixed inset-0 transition-opacity bg-brand-indigo-bg/20 bg-opacity-30 backdrop-blur-lg' />
        </div>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0'>
            <AnimatePresence>
              {open && (
                <Dialog.Panel
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.1 } }}
                  exit={{ opacity: 0 }}
                  className='relative px-4 pt-5 pb-4 text-left transition-all bg-[#152C41] transform rounded-lg border-[1px] border-gray-100/20 sm:my-8 sm:max-w-lg sm:w-full sm:p-6 lg:w-[60vw] shadow-lg'
                >
                  <div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
                    <button
                      type='button'
                      className='rounded-md hover:text-gray-200 focus:outline-none focus:ring-0 focus:ring-offset-2'
                      onClick={() => setOpen(false)}
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
                    <div>
                      <label htmlFor='title' className='text-white'>
                        Title
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          name='title'
                          className='w-full border-[1px] border-[#63809c]/50 text-4xl bg-[#1E364D] p-3 mb-6 rounded sm:text-sm focus:bg-transparent focus:border-gray-400 focus:ring-0 appearance-none focus:outline-none'
                          placeholder='Awesome post...'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {/* Radio group choice */}
                    <RadioGroup value={editorType} onChange={setEditorType}>
                      <RadioGroup.Label className='text-white'>
                        Which type of editor do you prefer?
                      </RadioGroup.Label>

                      <div className='grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                        {editorTypes.map((formType) => (
                          <RadioGroup.Option
                            key={formType.id}
                            value={formType}
                            className={({ checked, active }) =>
                              cn(
                                'relative border-[1px] border-[#63809c]/50 rounded shadow-sm p-4 flex cursor-pointer',
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
                                        className='flex items-center mt-1 text-xs whitespace-pre-wrap'
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
                      <label htmlFor='choice'>Remember my choice</label>
                    </div>
                    {/* Submit button */}
                    <div className='mt-5 sm:mt-6 flex justify-end'>
                      <NewPostButton onClick={() => {}} />
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
