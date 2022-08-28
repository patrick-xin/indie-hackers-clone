import React, { useEffect, useRef, useState } from 'react';

import { InstructionPopover } from '@/features/post/components/InstructionPopover';
import { Button, Flex, Input } from '@/features/UI';

type Props = {
  onSubmit: (_content: string) => void;
  onCancle?: () => void;
  initialValue: string;
  buttonLabel: string;
  hasCancleButton?: boolean;
  hasScrolled?: boolean;
};
export const CommentForm = ({
  onSubmit,
  onCancle,
  initialValue,
  buttonLabel,
  hasCancleButton = false,
  hasScrolled,
}: Props) => {
  const [content, setContent] = useState(initialValue);

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!inputRef.current) return;
    if (hasScrolled) {
      inputRef.current.focus();
    }
  }, [hasScrolled]);
  return (
    <div>
      <form
        id='comment-input'
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(content);
          setContent('');
        }}
      >
        <div className='space-y-4'>
          <Input
            ref={inputRef}
            transparent
            className='min-h-[20vh] w-full border-[1px] border-brand-text focus:border-brand-blue'
            textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Flex className='items-start justify-between'>
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
