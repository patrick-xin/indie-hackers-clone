import { Popover } from '@headlessui/react';
import Image from 'next/future/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { IoLogOut } from 'react-icons/io5';
import { usePopper } from 'react-popper';

import { MENU_LINKS, MenuLink } from '@/lib/constants';

export const ProfileMenuDropdown = ({ session }: { session: Session }) => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );
  const [arrowElement, setArrowElement] = useState<null | HTMLDivElement>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'arrow',
        options: { element: arrowElement, padding: { bottom: 20 } },
      },
    ],
  });
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
        <div
          ref={setArrowElement}
          style={styles.arrow}
          className='h-3 w-3 triangle top-2'
        />
        <div className='w-56 py-1 rounded mx-2 bg-[#274059] relative my-4'>
          {/* <div className='h-3 w-3 absolute transform rotate-45 bg-[#274059] -top-1.5 left-2/3' /> */}
          {MENU_LINKS.map((link) => (
            <ProfileMenuLink {...link} key={link.title} />
          ))}
          <div className='py-2 px-3 hover:bg-[#2B4763] group'>
            <button onClick={() => signOut()}>
              <div className='flex gap-4 items-center'>
                <div className='group-hover:text-brand-blue'>
                  <IoLogOut className='w-6 h-6' />
                </div>
                <div>Sign out</div>
              </div>
            </button>
          </div>
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
