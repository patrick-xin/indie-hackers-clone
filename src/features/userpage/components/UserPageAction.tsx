import cn from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { BiBook, BiBookBookmark, BiHistory } from 'react-icons/bi';

export const UserPageAction = ({ username }: { username: string }) => {
  const { pathname, asPath } = useRouter();
  const { data: session } = useSession();
  return (
    <div className='mt-0.5 mb-12 rounded md:-mt-11 lg:-mt-12 lg:w-min lg:text-lg'>
      <div className='flex justify-between gap-4 bg-[#172B40] md:bg-[#1f364d] lg:gap-6'>
        <div
          className={cn('flex items-center gap-2 px-1 py-2', {
            'border-b border-brand-blue text-white': asPath.endsWith(
              `@${username}`
            ),
          })}
        >
          <BiBook className='h-6 w-6 lg:hidden' />
          <Link href={`/@${username}`}>
            <a className='transition-colors ease-linear hover:text-white'>
              Posts
            </a>
          </Link>
        </div>
        <div
          className={cn('flex items-center gap-2 px-1 py-2', {
            'border-b border-brand-blue text-white':
              pathname.endsWith('history'),
          })}
        >
          <BiHistory className='h-6 w-6 lg:hidden' />
          <Link href={`/@${username}/history`}>
            <a className='transition-colors ease-linear hover:text-white'>
              History
            </a>
          </Link>
        </div>
        <div
          className={cn('flex items-center gap-2 px-1 py-2', {
            'border-b border-brand-blue text-white':
              pathname.endsWith('bookmark'),
          })}
        >
          <BiBookBookmark className='h-6 w-6 lg:hidden' />
          <Link href={`/@${username}/bookmark`}>
            <a className='transition-colors ease-linear hover:text-white'>
              Bookmark
            </a>
          </Link>
        </div>
        {session && session.user.username === username && (
          <>
            {' '}
            <div
              className={cn('flex items-center gap-2 px-1 py-2', {
                'border-b border-brand-blue text-white':
                  pathname.endsWith('notifications'),
              })}
            >
              <BiBookBookmark className='h-6 w-6 lg:hidden' />
              <Link href={`/@${username}/notifications`}>
                <a className='transition-colors ease-linear hover:text-white'>
                  Notifications
                </a>
              </Link>
            </div>
            <div
              className={cn('flex items-center gap-2 px-1 py-2', {
                'border-b border-brand-blue text-white':
                  pathname.endsWith('settings'),
              })}
            >
              <BiBookBookmark className='h-6 w-6 lg:hidden' />
              <Link href={`/@${username}/settings`}>
                <a className='transition-colors ease-linear hover:text-white'>
                  Settings
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
