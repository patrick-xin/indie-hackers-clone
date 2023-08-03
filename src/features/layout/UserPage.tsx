import React from 'react';

import {
  UserPageHeader,
  UserPageSidebar,
} from '@/features/userpage/components';
import { UserPageAction } from '@/features/userpage/components/UserPageAction';

import { Footer, Header } from '../UI';

export const UserPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className='p-4 md:p-0'>
        <div className='user-content'>
          <UserPageHeader />
          <div className='user-body z-100 md:mx-6'>
            <UserPageAction />
            {children}
          </div>
          <UserPageSidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
};
