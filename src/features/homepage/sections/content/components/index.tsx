import cn from 'clsx';
import Link from 'next/link';
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

import { FeedItem } from './FeedItem';

export const ContentSection = () => {
  return (
    <section className='md:col-span-4 lg:col-start-4 lg:col-span-6'>
      <header className='flex justify-between items-center mb-6'>
        <div className='flex gap-3 h-auto'>
          <Link href='/'>
            <a
              className={cn(
                'py-1.5 px-0.5 h-10 text-lg hover:border-b-3 hover:text-white border-[#385c80]',
                { 'border-[#4799eb] border-b-3 text-white': true }
              )}
            >
              Popular
            </a>
          </Link>
          <Link href='/'>
            <a className='py-1.5 text-lg px-0.5 h-10 hover:border-b-3 hover:text-white border-[#385c80]'>
              Newest
            </a>
          </Link>
          <Link href='/'>
            <a className='py-1.5 px-0.5 text-lg h-10 hover:border-b-3 hover:text-white border-[#385c80]'>
              Following
            </a>
          </Link>
          <Link href='/'>
            <a className='py-1.5 px-0.5 text-lg h-10 hover:border-b-3 hover:text-white border-[#385c80]'>
              Groups
            </a>
          </Link>
        </div>
        <div>
          <button className='px-2.5 py-2 text-sm uppercase bg-gradient-to-r from-[#e052a0] to-[#f15c41] text-white rounded-sm hover:from-cyan-500 hover:to-blue-500'>
            New Post
          </button>
        </div>
      </header>
      <div className='grid grid-cols-1 gap-2'>
        {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).map((i) => (
          <FeedItem key={i} />
        ))}
        <div>
          <button className='w-full inline-flex items-center text-center justify-center gap-4 group text-white border-3 border-gray-100/5 p-2.5 hover:text-[#4799eb]'>
            <span>Next Page</span>
            <span className='group-hover:animate-bounce-front-back'>
              <FaArrowRight />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
