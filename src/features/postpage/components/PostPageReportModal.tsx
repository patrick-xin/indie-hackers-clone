import { RadioGroup } from '@headlessui/react';
import React, { useState } from 'react';

import { useReportPost } from '@/features/postpage/api';
import { Alert, Button, ConfirmModal, Input } from '@/features/UI';

const PostReportOptions = [
  {
    value: 'inappropriate',
    label: 'Inappropriate',
  },
  {
    value: 'spam',
    label: 'Spam',
  },
  {
    value: 'lowQuality',
    label: 'Low Quality',
  },
];

type PostPageReportModalProps = {
  openModal: boolean;
  postId: string;
  setOpenModal: () => void;
};

export const PostPageReportModal = ({
  postId,
  openModal,
  setOpenModal,
}: PostPageReportModalProps) => {
  const { reportPost } = useReportPost();
  const [selected, setSelected] = useState(PostReportOptions[0]);

  return (
    <ConfirmModal open={openModal} onClose={() => setOpenModal(false)}>
      <Alert message={<p>Report post</p>} type='warning' />
      <form
        className='space-y-8'
        onSubmit={(e) => {
          e.preventDefault();
          reportPost({ id: postId, reason: selected.value });
        }}
      >
        <Input
          //ref={ref}
          label='Enter other reason'
          //value={inputUsername}
          //onChange={(e) => setInputUsername(e.target.value)}
        />
        <RadioGroup value={selected} onChange={setSelected}>
          <RadioGroup.Label className='sr-only'>Server size</RadioGroup.Label>
          <div className='space-y-2'>
            {PostReportOptions.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                      : ''
                  }
                  ${
                    checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='text-sm'>
                          <RadioGroup.Label
                            as='p'
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {option.label}
                          </RadioGroup.Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Cancle
          </Button>
          <Button type='submit' variant='gradient'>
            Confirm
          </Button>
        </div>
      </form>
    </ConfirmModal>
  );
};
