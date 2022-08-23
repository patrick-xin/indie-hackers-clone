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
    <div className='flex justify-between items-center w-full p-2 bg-[#152C41]'>
      <button
        className='disabled:opacity-20'
        onClick={onPrevClick}
        disabled={prevDisabled}
      >
        <BiChevronLeft className='h-6 w-6' />
      </button>

      <div className='flex-1 flex justify-center w-full gap-3'>{children}</div>
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
