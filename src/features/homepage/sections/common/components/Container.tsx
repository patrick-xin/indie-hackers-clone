import React from 'react';

export const Container: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-6 md:grid-rows-[300px_minmax(900px,_1fr)] lg:grid-cols-12'>
      {children}
    </div>
  );
};
