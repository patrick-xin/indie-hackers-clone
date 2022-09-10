import { Popover } from '@headlessui/react';
import { User } from '@prisma/client';
import Image from 'next/future/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { IoLogOut } from 'react-icons/io5';
import { usePopper } from 'react-popper';

import { MENU_LINKS, MenuLink } from '@/lib/constants';

export const ProfileMenuDropdown = ({ user }: { user: User }) => {
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
        className='rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-[#b6cce2]'
      >
        <div className='flex items-center gap-2'>
          <div>{user.username}</div>
          <Image
            src={user.image}
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
          className='triangle top-2 h-3 w-3'
        />
        <div className='relative mx-2 my-4 w-56 rounded bg-[#274059] py-1'>
          {/* <div className='h-3 w-3 absolute transform rotate-45 bg-[#274059] -top-1.5 left-2/3' /> */}
          {MENU_LINKS.map((link) => (
            <ProfileMenuLink {...link} key={link.title} />
          ))}
          <div className='group py-2 px-3 hover:bg-[#2B4763]'>
            <button onClick={() => signOut()}>
              <div className='flex items-center gap-4'>
                <div className='group-hover:text-brand-blue'>
                  <IoLogOut className='h-6 w-6' />
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
  const { data: session } = useSession();
  return (
    <div className='group py-2 px-3 hover:bg-[#2B4763]'>
      <Link href={`/@${session?.user.username}/${href}`}>
        <a className='inline-block w-full'>
          <div className='flex items-center gap-4'>
            <div className='group-hover:text-brand-blue'>{icon}</div>
            <div>{title}</div>
          </div>
        </a>
      </Link>
    </div>
  );
};
