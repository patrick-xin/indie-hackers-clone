import cn from 'clsx';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

export const FilterLinks = ({ path }: { path: string }) => {
  return (
    <div className='flex gap-3'>
      <Link href='/'>
        <a
          className={cn(
            'bg-[#1E364D] p-1.5 text-white rounded-sm text-xs inline-flex justify-center items-center lg:text-base',
            {
              'bg-brand-blue': path === '',
            }
          )}
        >
          today
        </a>
      </Link>
      <Link href={`/top/week-of-${format(new Date(), 'yyyy-MM-dd')}`}>
        <a
          className={cn(
            'bg-[#1E364D] p-1.5 text-white rounded-sm text-xs inline-flex justify-center items-center lg:text-base',
            {
              'bg-brand-blue': path.startsWith('week'),
            }
          )}
        >
          weekly
        </a>
      </Link>
      <Link href={`/top/month-of-${format(new Date(), 'yyyy-MM')}`}>
        <a
          className={cn(
            'bg-[#1E364D] p-1.5 text-white rounded-sm text-xs inline-flex justify-center items-center lg:text-base',
            {
              'bg-brand-blue': path.startsWith('month'),
            }
          )}
        >
          monthly
        </a>
      </Link>
      <Link href='/top/all-time'>
        <a
          className={cn(
            'bg-[#1E364D] p-1.5 text-white rounded-sm text-xs inline-flex justify-center items-center lg:text-base',
            {
              'bg-brand-blue': path.startsWith('all'),
            }
          )}
        >
          all time
        </a>
      </Link>
    </div>
  );
};
