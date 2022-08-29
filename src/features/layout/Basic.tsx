import React from 'react';

import { Footer, Header } from '../UI';

export const BasicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <main className='mx-auto xl:px-12'>{children}</main>
      <Footer />
    </>
  );
};
