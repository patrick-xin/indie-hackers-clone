import React from 'react';

import { Footer, Header } from '../UI';

export const BasicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <main className='p-4 xl:p-12 mx-auto mt-6'>{children}</main>
      <Footer />
    </>
  );
};
