import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { X } from 'tabler-icons-react';

type ConfirmModalProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
};

export const ConfirmModal = ({
  children,
  onClose,
  open,
}: ConfirmModalProps) => {
  return (
    <div>
      <Dialog as='div' className='relative z-100' onClose={onClose} open={open}>
        <div>
          <div className='bg-brand-indigo-bg/20 fixed inset-0 backdrop-blur-lg transition-opacity' />
        </div>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full justify-center p-4 sm:items-center sm:p-0'>
            <AnimatePresence>
              {open && (
                <Dialog.Panel
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.1 } }}
                  exit={{ opacity: 0 }}
                  className='relative min-h-[40vh] w-[80vw] rounded-lg border-[1px] border-gray-100/20 bg-[#152C41] shadow-lg sm:my-8 sm:w-full sm:p-6 lg:w-[50vw]'
                >
                  <div className='absolute top-4 right-4'>
                    <button
                      type='button'
                      className='rounded-md hover:text-gray-200 focus:outline-none focus:ring-0 focus:ring-offset-2'
                      onClick={onClose}
                    >
                      <span className='sr-only'>Close</span>
                      <X className='h-6 w-6' aria-hidden='true' />
                    </button>
                  </div>
                  <div className='p-8'>{children}</div>
                </Dialog.Panel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
