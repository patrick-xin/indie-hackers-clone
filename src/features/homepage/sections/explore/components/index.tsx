import React, { useCallback, useEffect, useState } from 'react';
import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

import { TOPICKS } from '@/_mocks_/data';
import { ButtonLink } from '@/features/UI';

export const ExploreSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [isMouseEntered, setMouseEnter] = useState(false);
  const [isShown, setShow] = useState(true);
  const handleClick = useCallback(() => {
    if (activeIndex === TOPICKS.length - 1) {
      return setActiveIndex(0);
    }
    return setActiveIndex((prev) => prev + 1);
  }, [activeIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (width === 100) return;
      setWidth((prev) => prev + 1);
    }, 250);
    return () => clearTimeout(timer);
  }, [width]);
  useEffect(() => {
    const interval = setInterval(() => {
      handleClick();
    }, 25000);
    setWidth(0);
    return () => clearInterval(interval);
  }, [handleClick]);
  if (!isShown) {
    return (
      <Wrapper>
        <div>
          <div className='flex items-center justify-between border-3 border-gray-100/5 p-2.5'>
            <ButtonLink className='capitalize' variant='ghost' href='/'>
              Explore
            </ButtonLink>
            <div>
              <button
                onClick={() => setShow(true)}
                className='transition-all ease-linear hover:rotate-90'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  className='h-4 w-4 fill-current text-white  hover:text-brand-blue'
                >
                  <path d='M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z' />
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
        <div className='flex w-full items-center justify-between'>
          <div className='group flex items-center gap-2'>
            <div className='space-y-2'>
              <div className='flex items-center gap-4'>
                <ButtonLink className='capitalize' variant='ghost' href='/'>
                  Explore: {TOPICKS[activeIndex].title}
                </ButtonLink>

                <div className='flex gap-2'>
                  <button
                    onClick={handleClick}
                    className='rounded-sm bg-brand-indigo-bg p-1 text-white hover:bg-brand-blue'
                  >
                    <BsCaretLeftFill className='h-3 w-3' />
                  </button>
                  <button
                    onClick={handleClick}
                    className='rounded-sm bg-brand-indigo-bg p-1 text-white hover:bg-brand-blue'
                  >
                    <BsCaretRightFill className='h-3 w-3' />
                  </button>
                </div>
              </div>

              <div className='relative h-[3px] w-48 rounded-lg bg-brand-indigo-bg'>
                <div
                  className='absolute inset-0 w-full rounded-lg bg-brand-blue'
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          </div>
          <div>
            {isMouseEntered && (
              <button onClick={() => setShow(false)}>
                <IoClose className='h-6 w-6' />
              </button>
            )}
          </div>
        </div>
        <div>
          {TOPICKS[activeIndex].posts.map((post) => (
            <div
              key={post.id}
              className='flex items-center justify-between rounded p-1.5 hover:bg-brand-indigo-bg'
            >
              {post.title}
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <section className='left-col'>{children}</section>;
};
