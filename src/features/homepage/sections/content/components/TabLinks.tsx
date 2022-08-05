import cn from 'clsx';
import Link from 'next/link';
import React from 'react';

export const TabLinks = ({ path }: { path: string }) => {
  return (
    <div className='flex gap-4'>
      <Link href='/'>
        <a
          className={cn(
            'text-base sm:text-lg hover:border-b-3 hover:text-white border-[#385c80]',
            {
              'border-[#4799eb] border-b-3 text-white':
                path === '/' || path.startsWith('/top'),
            }
          )}
        >
          Popular
        </a>
      </Link>
      <Link href='/newest'>
        <a
          className={cn(
            'text-base h-10 sm:text-lg hover:border-b-3 hover:text-white border-[#385c80]',
            { 'border-[#4799eb] border-b-3 text-white': path === '/newest' }
          )}
        >
          Newest
        </a>
      </Link>
      <Link href='/following'>
        <a
          className={cn(
            'text-base h-10 sm:text-lg hover:border-b-3 hover:text-white border-[#385c80]',
            { 'border-[#4799eb] border-b-3 text-white': path === '/following' }
          )}
        >
          Following
        </a>
      </Link>
      <Link href='/groups'>
        <a
          className={cn(
            'text-base h-10 sm:text-lg hover:border-b-3 hover:text-white border-[#385c80]',
            { 'border-[#4799eb] border-b-3 text-white': path === '/groups' }
          )}
        >
          Groups
        </a>
      </Link>
    </div>
  );
};
