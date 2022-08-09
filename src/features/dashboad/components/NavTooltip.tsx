import React from 'react';

type Props = {
  label: string;
};
export const NavTooltip = ({ label }: Props) => {
  return (
    <div className='absolute bg-brand-blue hidden group-hover:block group-hover:animate-fade-in group-hover:translate-x-[95%] -top-0.5 p-1.5 rounded w-max text-sm'>
      {label}
      <div className='left-tran absolute top-2.5 -left-1.5' />
    </div>
  );
};
