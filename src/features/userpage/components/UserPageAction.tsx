import Link from 'next/link';
import { BiBook, BiBookBookmark, BiHistory } from 'react-icons/bi';

export const UserPageAction = () => {
  return (
    <div className='mt-0.5 mb-12 rounded md:-mt-11 lg:-mt-12 lg:w-min lg:text-xl'>
      <div className='flex justify-between gap-4 bg-[#172B40] md:bg-[#1f364d] lg:gap-6'>
        <div className='flex items-center gap-2 border-b border-brand-blue px-1 py-2'>
          <BiBook className='h-6 w-6' />
          <Link href='/'>
            <a className='text-white'>Posts</a>
          </Link>
        </div>
        <div className='flex items-center gap-2 px-1 py-2'>
          <BiHistory className='h-6 w-6' />
          <Link href='/'>
            <a className='text-white'>History</a>
          </Link>
        </div>
        <div className='flex items-center gap-2 px-1 py-2'>
          <BiBookBookmark className='h-6 w-6' />
          <Link href='/'>
            <a className='text-white'>Bookmark</a>
          </Link>
        </div>
      </div>
    </div>
  );
};
