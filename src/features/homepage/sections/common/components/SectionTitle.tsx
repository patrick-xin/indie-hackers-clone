import React from 'react';

export const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h3 className='font-bold capitalize text-white hover:text-brand-blue'>
      {title}
    </h3>
  );
};
