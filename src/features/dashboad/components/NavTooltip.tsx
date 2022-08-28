import React from 'react';

type Props = {
  label: string;
};
export const NavTooltip = ({ label }: Props) => {
  return (
    <div className='absolute -top-0.5 hidden w-max rounded bg-brand-blue p-1.5 text-sm group-hover:block group-hover:translate-x-[95%] group-hover:animate-fade-in'>
      {label}
      <div className='left-tran absolute top-2.5 -left-1.5' />
    </div>
  );
};
