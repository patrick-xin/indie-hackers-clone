import React from 'react';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';

import { IconButton } from '@/features/UI';

type SearchNavigationProps = {
  page: number;
  count: number;
  previousButtonDisabled: boolean;
  onPreviousClick: () => void;
  nextButtonDisabled: boolean;
  onNextClick: () => void;
  baseCount: number;
};
export const SearchNavigation = ({
  page,
  count,
  previousButtonDisabled,
  nextButtonDisabled,
  onNextClick,
  onPreviousClick,
  baseCount,
}: SearchNavigationProps) => {
  return (
    <div className='flex items-center gap-3'>
      <div>
        <span>{page * baseCount - (baseCount - 1)}</span>
        <span>-</span>
        <span>{Math.min(page * baseCount, count)}</span>
      </div>
      <div className='flex items-center gap-1'>
        <IconButton
          disabled={previousButtonDisabled}
          variant='outline'
          icon={
            <ChevronLeft
              className={
                previousButtonDisabled ? 'text-gray-700' : 'text-white'
              }
            />
          }
          onClick={onPreviousClick}
        />
        <IconButton
          disabled={nextButtonDisabled}
          variant='outline'
          icon={
            <ChevronRight
              className={nextButtonDisabled ? 'text-gray-700' : 'text-white'}
            />
          }
          onClick={onNextClick}
        />
      </div>
    </div>
  );
};
