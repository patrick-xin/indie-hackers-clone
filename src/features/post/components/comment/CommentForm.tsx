import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';

import { InstructionPopover } from '@/features/post/components/InstructionPopover';
import { Button, Flex } from '@/features/UI';
import { AuthWrapper } from '@/features/UI/AuthWrapper';
import { TextArea } from '@/features/UI/Input';

type Props = {
  onSubmit: (_content: string) => void;
  onCancle?: () => void;
  initialValue: string;
  buttonLabel: string;
  hasCancleButton?: boolean;
  hasScrolled?: boolean;
  username: string;
};

export const CommentForm = ({
  onSubmit,
  onCancle,
  initialValue,
  buttonLabel,
  hasCancleButton = false,
  hasScrolled,
  username,
}: Props) => {
  const [content, setContent] = useState(initialValue);
  const { data: session } = useSession();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
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
          if (!session) return;
          e.preventDefault();
          onSubmit(content);
          setContent('');
        }}
      >
        <div className='space-y-4'>
          <TextArea
            placeholder={`Say something nice to ${username}`}
            ref={inputRef}
            transparent
            className='min-h-[20vh] w-full border-[1px] border-brand-text'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Flex className='items-start justify-between'>
            <Flex>
              <AuthWrapper>
                <Button
                  className='capitalize'
                  variant='gradient'
                  size='small'
                  type='submit'
                  disabled={(session && !content) ?? false}
                >
                  {buttonLabel}
                </Button>
              </AuthWrapper>

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
