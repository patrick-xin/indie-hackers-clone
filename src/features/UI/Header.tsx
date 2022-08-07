import Image from 'next/future/image';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { IoIosMenu, IoIosSearch } from 'react-icons/io';

import { ProfileMenuDropdown } from '@/features/user/components';

export const Header = () => {
  const session = useSession();
  const renderUserStatus = () => {
    if (session.status === 'loading') {
      return <ImSpinner8 className='animate-spin h-4 w-4' />;
    } else if (session.status === 'authenticated') {
      return <ProfileMenuDropdown session={session.data} />;
    } else {
      return <LoginRegister />;
    }
  };
  return (
    <div className='flex justify-between px-4 h-14 my-1 bg-[#1E364D] items-center lg:px-12'>
      <div className='flex gap-2 items-center'>
        <div className='sm:hidden'>
          <LogoImage />
        </div>
        <div>
          <IoIosMenu className='h-6 w-6' />
        </div>
        <div>
          <IoIosSearch className='h-6 w-6' />
        </div>
      </div>

      <div className='hidden sm:flex gap-2 sm:gap-4 items-center text-white font-black'>
        <LogoImage />
        <Link href='/'>
          <a>INDIE HACKERS</a>
        </Link>
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

const LogoImage = () => {
  return <Image alt='logo' width={24} height={24} src='/logo.svg' />;
};
