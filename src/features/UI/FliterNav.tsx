import React from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

type Props = {
  onPrevClick: () => void;
  onNextClick: () => void;
  children: React.ReactNode;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

export const FliterNav = ({
  onPrevClick,
  onNextClick,
  children,
  prevDisabled,
  nextDisabled,
}: Props) => {
  return (
    <div className='flex w-full items-center justify-between bg-[#152C41] p-2'>
      <button
        className='disabled:opacity-20'
        onClick={onPrevClick}
        disabled={prevDisabled}
      >
        <BiChevronLeft className='h-6 w-6' />
      </button>

      <div className='flex w-full flex-1 justify-center gap-3'>{children}</div>
      <button
        onClick={onNextClick}
        disabled={nextDisabled}
        className='disabled:opacity-20'
      >
        <BiChevronRight className='h-6 w-6' />
      </button>
    </div>
  );
};
