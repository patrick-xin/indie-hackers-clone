import { ChevronDown } from 'tabler-icons-react';

import { Button } from '@/features/UI';

import { GroupList } from './GroupList';

type GroupSectionProps = {
  title: string;
  description: string;
  updatedAt: string;
};
export const GroupSection = ({
  title,
  description,
  updatedAt,
}: GroupSectionProps) => {
  return (
    <div className='border-[3px] border-spacing-2 border-[#1f364d] first-of-type:border-t-0 space-y-4 p-2 rounded first-of-type:rounded-t-none md:first-of-type:border md:first-of-type:rounded-t'>
      <header className='bg-[#182e43] p-3 rounded space-y-3 '>
        <h2 className='text-2xl text-white'>{title}</h2>
        <p className='text-[#9cb3c9]'>{description}</p>
        <p className='text-sm italic text-[#63809c]'>{updatedAt}</p>
      </header>
      <GroupList />
      <div className='w-full'>
        <Button
          iconPosition='right'
          variant='outline'
          className='w-full'
          icon={<ChevronDown className='h-4 w-4' />}
        >
          More
        </Button>
      </div>
    </div>
  );
};
