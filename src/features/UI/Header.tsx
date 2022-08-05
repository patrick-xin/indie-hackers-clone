import { Popover } from '@headlessui/react';
import Image from 'next/future/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { IoIosMenu, IoIosSearch } from 'react-icons/io';
import { usePopper } from 'react-popper';

import { MENU_LINKS, MenuLink } from '@/lib/constants';

export const Header = () => {
  const session = useSession();
  const renderUserStatus = () => {
    if (session.status === 'loading') {
      return <ImSpinner8 className='animate-spin h-4 w-4' />;
    } else if (session.status === 'authenticated') {
      return <ProfileMenu session={session.data} />;
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
        INDIE HACKERS
      </div>

      {renderUserStatus()}
    </div>
  );
};

const ProfileMenu = ({ session }: { session: Session }) => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  return (
    <Popover>
      <Popover.Button
        ref={setReferenceElement}
        className='focus:outline-none focus:ring-1 p-1 rounded-lg focus:ring-[#b6cce2]'
      >
        <div className='flex gap-2 items-center'>
          <div>{session.user.username}</div>
          <Image
            src={session.user.image}
            className='rounded-full'
            width={32}
            height={32}
            alt='user-avatar'
          />
        </div>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className='z-100'
      >
        <div className='w-56 py-1 rounded mx-2 bg-[#274059] relative my-4'>
          <div className='h-3 w-3 absolute transform rotate-45 bg-[#274059] -top-1.5 left-2/3' />
          {MENU_LINKS.map((link) => (
            <ProfileMenuLink {...link} key={link.title} />
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

const ProfileMenuLink = ({ icon, href, title }: MenuLink) => {
  return (
    <div className='py-2 px-3 hover:bg-[#2B4763] group'>
      <Link href={href}>
        <a className='w-full inline-block'>
          <div className='flex gap-4 items-center'>
            <div className='group-hover:text-brand-blue'>{icon}</div>
            <div>{title}</div>
          </div>
        </a>
      </Link>
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
