import React from 'react';

export const Container: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className='grid-container min-h-[100vh] md:px-4 py-2 lg:px-6 lg:py-4'>
      {children}
    </div>
  );
};
