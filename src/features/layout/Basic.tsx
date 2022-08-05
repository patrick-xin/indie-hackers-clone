import React from 'react';

import { Footer, Header } from '../UI';

export const BasicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <main className='px-4 xl:px-12 2xl:px-36 mx-auto'>{children}</main>
      <Footer />
    </>
  );
};
