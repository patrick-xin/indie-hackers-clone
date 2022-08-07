import Image from 'next/future/image';
import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import { ButtonLink } from '@/features/UI';

export const GroupSection = () => {
  const [isMouseEntered, setMouseEnter] = useState(false);
  const [isShown, setShow] = useState(true);
  if (!isShown) {
    return (
      <Wrapper>
        <div>
          <div className='flex justify-between items-center border-3 border-gray-100/5 p-2.5'>
            <ButtonLink className='capitalize' variant='ghost' href='/'>
              Trending groups
            </ButtonLink>

            <div>
              <button
                onClick={() => setShow(true)}
                className='hover:rotate-90 transition-all ease-linear'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  className='text-white fill-current w-4 h-4  hover:text-[#4799eb]'
                >
                  <path d='M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z'></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div
        className='space-y-6'
        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)}
      >
        <div className='flex justify-between items-center'>
          <ButtonLink
            className='capitalize'
            variant='ghost'
            href='/'
            icon={
              <FaArrowRight className='group-hover:animate-bounce-front-back ml-2' />
            }
          >
            Trending groups
          </ButtonLink>

          {isMouseEntered && (
            <button onClick={() => setShow(false)}>
              <IoClose className='h-6 w-6' />
            </button>
          )}
        </div>
        <div>
          {Array.from([1, 2, 3, 4, 5, 6]).map((i) => (
            <div
              key={i}
              className='flex justify-between items-center p-1.5 rounded hover:bg-[#1E364D]'
            >
              <div className='flex gap-4 items-center'>
                <div>
                  <Image
                    src='/avatar.webp'
                    className='rounded-full'
                    width={24}
                    height={24}
                    alt='user-avatar'
                  />
                </div>
                <div>name</div>
              </div>
              <div>
                <button className='bg-[#182E43] hover:bg-[#4799eb] px-2 py-1 rounded-lg text-white text-sm capitalize font-bold par'>
                  join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <section className='right-col'>{children}</section>;
};
