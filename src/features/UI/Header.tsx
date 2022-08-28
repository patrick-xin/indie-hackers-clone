import { signIn, useSession } from 'next-auth/react';
import { ImSpinner8 } from 'react-icons/im';
import { IoIosMenu, IoIosSearch } from 'react-icons/io';

import { Logo } from '@/features/UI/Logo';
import { ProfileMenuDropdown } from '@/features/user/components';

export const Header = () => {
  const session = useSession();
  const renderUserStatus = () => {
    if (session.status === 'loading') {
      return <ImSpinner8 className='h-4 w-4 animate-spin' />;
    } else if (session.status === 'authenticated') {
      return <ProfileMenuDropdown session={session.data} />;
    } else {
      return <LoginRegister />;
    }
  };
  return (
    <div className='mt-1 flex h-14 items-center justify-between bg-[#1E364D] px-4 lg:px-12'>
      <div className='flex items-center gap-2'>
        <div className='sm:hidden'>
          <Logo hasName={false} />
        </div>
        <div>
          <IoIosMenu className='h-6 w-6' />
        </div>
        <div>
          <IoIosSearch className='h-6 w-6' />
        </div>
      </div>

      <div className='hidden items-center gap-2 font-black text-white sm:flex sm:gap-4'>
        <Logo />
      </div>

      {renderUserStatus()}
    </div>
  );
};

const LoginRegister = () => {
  return (
    <div>
      <button className='hover:text-white' onClick={() => signIn()}>
        login
      </button>
    </div>
  );
};
