import { Popover } from '@headlessui/react';
import { User } from '@prisma/client';
import Image from 'next/future/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { usePopper } from 'react-popper';

type Props = {
  user: Pick<User, 'image' | 'username'>;
};

export const AvatarPopover = ({ user }: Props) => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );
  const [arrowElement, setArrowElement] = useState<null | HTMLDivElement>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: 'flip', options: { fallbackPlacements: ['top', 'right'] } },
    ],
  });
  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        <div>
          <Image
            src={user.image ?? '/avatat.webp'}
            className='rounded-full'
            width={40}
            height={40}
            alt='user-avatar'
          />
        </div>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className='min-h-56 w-72 mx-6 bg-[#274059] space-y-4 rounded-sm'>
          <div ref={setArrowElement} style={styles.arrow} />
          <header className='bg-[#2F4D6A] p-4'>
            <Link href={`/@${user.username}`}>
              <a>
                <div className='flex gap-6 items-center'>
                  <Image
                    src={user.image ?? '/avatat.webp'}
                    className='rounded-full'
                    width={60}
                    height={60}
                    alt='user-avatar'
                  />
                  <div>{user.username}</div>
                </div>
              </a>
            </Link>
          </header>

          <div className='space-y-4 px-6'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
              reprehenderit, maiores adipisci mollitia fuga laboriosam culpa
              excepturi dolore debitis, officia doloribus.
            </p>
            <div className='space-y-2'>
              <div className='flex flex-col'>
                <span className='inline-block text-sm'>Location:</span>
                <span className='inline-block text-white text-lg'>
                  Victoria
                </span>
              </div>
              <div className='flex gap-8'>
                <div className='flex flex-col'>
                  <span className='inline-block text-sm'>Followers:</span>
                  <span className='inline-block text-white text-lg'>112</span>
                </div>

                <div>
                  <div className='flex flex-col'>
                    <span className='inline-block text-sm'>Points:</span>
                    <span className='inline-block text-white text-lg'>220</span>
                  </div>
                </div>
              </div>
              <div>Joined:2022</div>
            </div>
          </div>
          <footer className='bg-[#213348] p-4'>
            <button className='py-2 px-3 bg-gradient-to-r w-full rounded text-white text-center from-cyan-500 to-blue-500'>
              Follow
            </button>
          </footer>
        </div>
      </Popover.Panel>
    </Popover>
  );
};
