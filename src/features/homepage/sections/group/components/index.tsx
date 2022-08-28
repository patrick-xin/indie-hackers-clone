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
          <div className='flex items-center justify-between border-3 border-gray-100/5 p-2.5'>
            <ButtonLink className='capitalize' variant='ghost' href='/'>
              Trending groups
            </ButtonLink>

            <div>
              <button
                onClick={() => setShow(true)}
                className='transition-all ease-linear hover:rotate-90'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  className='h-4 w-4 fill-current text-white  hover:text-[#4799eb]'
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
        <div className='flex items-center justify-between'>
          <ButtonLink
            className='capitalize'
            variant='ghost'
            href='/'
            icon={
              <FaArrowRight className='ml-2 group-hover:animate-bounce-front-back' />
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
              className='flex items-center justify-between rounded p-1.5 hover:bg-[#1E364D]'
            >
              <div className='flex items-center gap-4'>
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
                <button className='rounded-lg bg-[#182E43] px-2 py-1 text-sm font-bold capitalize text-white hover:bg-[#4799eb]'>
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
