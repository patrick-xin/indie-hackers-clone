import React from 'react';

import { Footer, Header } from '../UI';

export const UserPageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <Header />
      <main className='p-4 md:p-0 '>{children}</main>
      <Footer />
    </div>
  );
};
