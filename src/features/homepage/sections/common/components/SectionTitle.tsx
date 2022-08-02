import React from 'react';

export const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h3 className='text-white capitalize font-bold hover:text-brand-blue'>
      {title}
    </h3>
  );
};
