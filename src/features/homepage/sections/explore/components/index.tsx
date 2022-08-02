import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

import { TOPICKS } from '@/_mocks_/data';
import { SectionTitle } from '@/features/homepage/sections';

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
        <div className='lg:px-4 lg:py-1'>
          <div className='flex justify-between items-center border-3 border-gray-100/5 p-2.5'>
            <Link href='/'>
              <SectionTitle title='Explore' />
            </Link>

            <div>
              <button
                onClick={() => setShow(true)}
                className='hover:rotate-90 transition-all ease-linear'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  className='text-white fill-current w-4 h-4  hover:text-brand-blue'
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
        className='space-y-6 lg:px-4 lg:py-1'
        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)}
      >
        <div className='flex justify-between items-center'>
          <div className='group flex gap-2 items-center'>
            <div className='space-y-2'>
              <div className='flex gap-4 items-center'>
                <SectionTitle
                  title={`Explore: ${TOPICKS[activeIndex].title}`}
                />

                <div className='flex gap-2'>
                  <button
                    onClick={handleClick}
                    className='p-1 rounded-sm text-white bg-brand-indigo-bg hover:bg-brand-blue'
                  >
                    <BsCaretLeftFill className='h-3 w-3' />
                  </button>
                  <button
                    onClick={handleClick}
                    className='p-1 rounded-sm text-white bg-brand-indigo-bg hover:bg-brand-blue'
                  >
                    <BsCaretRightFill className='h-3 w-3' />
                  </button>
                </div>
              </div>

              <div className='bg-brand-indigo-bg h-[3px] rounded-lg w-48 relative'>
                <div
                  className='absolute inset-0 bg-brand-blue rounded-lg w-full'
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
              className='flex justify-between items-center p-1.5 rounded hover:bg-brand-indigo-bg'
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
  return (
    <section className='md:col-start-5 lg:col-start-1 lg:col-span-3 lg:row-start-1'>
      {children}
    </section>
  );
};
