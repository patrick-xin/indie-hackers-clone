import React from 'react';

import { UserProfile } from '@/features/post/types';
import {
  UserPageHeader,
  UserPageSidebar,
} from '@/features/userpage/components';
import { UserPageAction } from '@/features/userpage/components/UserPageAction';

import { Footer, Header } from '../UI';

export const UserPageLayout: React.FC<{
  children: React.ReactNode;
  user: UserProfile;
}> = ({ children, user }) => {
  return (
    <div>
      <Header />
      <main className='p-4 md:p-0'>
        <div className='user-content'>
          <UserPageHeader image={user.image} username={user.username} />
          <div className='user-body z-100 md:mx-6'>
            <UserPageAction username={user.username} />
            {children}
          </div>
          <UserPageSidebar username={user.username} userId={user.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};
