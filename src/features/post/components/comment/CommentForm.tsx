import React, { useState } from 'react';

import { InstructionPopover } from '@/features/post/components/InstructionPopover';
import { Button, Flex, Input } from '@/features/UI';

type Props = {
  onSubmit: (content: string) => void;
  onCancle?: () => void;
  initialValue: string;
  buttonLabel: string;
  hasCancleButton?: boolean;
};
export const CommentForm = ({
  onSubmit,
  onCancle,
  initialValue,
  buttonLabel,
  hasCancleButton = false,
}: Props) => {
  const [content, setContent] = useState(initialValue);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(content);
          setContent('');
        }}
      >
        <div className='space-y-4'>
          <Input
            transparent
            autoFocus
            className='min-h-[20vh] w-full border-[1px] border-brand-text focus:border-brand-blue'
            textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Flex className='justify-between items-start'>
            <Flex>
              <Button
                className='capitalize'
                variant='gradient'
                size='small'
                type='submit'
                disabled={!content}
              >
                {buttonLabel}
              </Button>
              {hasCancleButton && onCancle && (
                <Button variant='transparent' type='button' onClick={onCancle}>
                  cancle
                </Button>
              )}
            </Flex>

            <InstructionPopover />
          </Flex>
        </div>
      </form>
    </div>
  );
};
