import { Popover } from '@headlessui/react';
import Image from 'next/future/image';
import React, { useState } from 'react';
import { BiChevronUp } from 'react-icons/bi';
import { usePopper } from 'react-popper';

export const FeedItem = () => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  return (
    <div className='py-2 px-4 shadow-sm bg-[#152C41] flex gap-4 rounded-sm items-center'>
      <div>
        <Popover>
          <Popover.Button ref={setReferenceElement}>
            <div>
              <Image
                src='/avatar.webp'
                className='rounded-full'
                width={48}
                height={48}
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
              <header className='bg-[#2F4D6A] p-4'>
                <div className='flex gap-6 items-center'>
                  <Image
                    src='/avatar.webp'
                    className='rounded-full'
                    width={60}
                    height={60}
                    alt='user-avatar'
                  />
                  <div>Username</div>
                </div>
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
                      <span className='inline-block text-white text-lg'>
                        112
                      </span>
                    </div>

                    <div>
                      <div className='flex flex-col'>
                        <span className='inline-block text-sm'>Points:</span>
                        <span className='inline-block text-white text-lg'>
                          220
                        </span>
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
      </div>

      <div className='flex flex-col gap-4 -mt-2 items-center text-gray-400 group cursor-pointer'>
        <BiChevronUp className='h-8 w-8 group-hover:text-red-500' />

        <div className='text-sm group-hover:text-white -mt-6'>12</div>
      </div>
      <div className='flex flex-col gap-2'>
        <h2 className='hover:bg-[#1E364D] px-2 py-1 rounded text-["#b6cce2"] hover:text-white'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
          consectetur fugit ipsum.
        </h2>
        <div className='flex gap-4'>
          <div className='hover:bg-[#1E364D] p-1 hover:text-white rounded'>
            link
          </div>
          <div className='hover:bg-[#1E364D] p-1 text-[#63809c] hover:text-gray-400 rounded'>
            · 12 comments
          </div>
        </div>
      </div>
    </div>
  );
};
