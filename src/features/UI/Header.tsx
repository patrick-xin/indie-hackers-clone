import { Popover } from '@headlessui/react';
import Image from 'next/future/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosMenu, IoIosSearch } from 'react-icons/io';
import { usePopper } from 'react-popper';

import { MENU_LINKS, MenuLink } from '@/lib/constants';

export const Header = () => {
  return (
    <div className='flex justify-between px-4 h-14 my-1 bg-[#1E364D] items-center lg:px-12'>
      <div className='flex gap-2 items-center'>
        <div>
          <IoIosMenu className='h-6 w-6' />
        </div>
        <div>
          <IoIosSearch className='h-6 w-6' />
        </div>
      </div>

      <div className='flex gap-4 items-center text-white font-black'>
        <Image alt='logo' width={30} height={30} src='/logo.svg' />
        INDIE HACKERS
      </div>

      <ProfileMenu />
    </div>
  );
};

const ProfileMenu = () => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        <div>
          <Image
            src='/avatar.webp'
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
      >
        <div className='w-56 py-1 rounded mx-2 bg-[#274059]'>
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
