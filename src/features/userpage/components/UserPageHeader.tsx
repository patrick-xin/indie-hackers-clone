import { formatDistance } from 'date-fns';
import Image from 'next/future/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Edit } from 'tabler-icons-react';

import { IconButton } from '@/features/UI';
import { trpc } from '@/utils/trpc';

export const UserPageHeader = () => {
  const { query } = useRouter();
  const usernameQuery = query && (query['@username'] as string);
  const username = usernameQuery?.split('@')[1] as string;

  const { data: user } = trpc.useQuery(['user.username', { username }], {
    enabled: Boolean(query) && Boolean(username),
  });

  const { data: session } = useSession();

  const isOwner = session?.user.username === username;
  const { push } = useRouter();

  return (
    <header className='user-header rounded rounded-b-none bg-[#1f364d] px-4 pb-8 md:pt-8 md:pb-28'>
      <div className='mx-auto max-w-5xl items-center gap-6 md:flex md:px-10 lg:items-start lg:gap-8'>
        <div className='flex items-center justify-center'>
          <div className='-mt-8 h-32 w-32 rounded-full bg-[#294057] p-2 lg:-mt-0 lg:h-40 lg:w-40'>
            <Image
              className='rounded-full'
              height={160}
              width={160}
              src={user?.image ?? '/avatar.webp'}
              alt='user-avatar'
            />
          </div>
        </div>
        <div>
          <div className='flex items-center gap-4'>
            <h3 className='py-4 text-center text-2xl text-gray-100 md:text-left md:text-3xl'>
              {username}
              {user?.profile?.fullName && (
                <span className='mx-4 text-brand-text'>
                  {user.profile.fullName}
                </span>
              )}
            </h3>
            {isOwner && (
              <IconButton
                size='medium'
                rounded='large'
                variant='gradient'
                onClick={() => push(`/@${username}/edit`)}
                icon={<Edit />}
              />
            )}
          </div>

          <div className='md:text-lg'>
            {user?.profile?.location && <span>{user.profile.location}</span>}
            <Separator />
            <span>
              joined{' '}
              {user &&
                formatDistance(user.createdAt, new Date(), {
                  addSuffix: true,
                })}
            </span>
          </div>
          {user?.profile?.bio && (
            <div>
              <Separator />
              {user.profile.bio}
            </div>
          )}
          <div className='mx-auto my-8 h-1 w-48 bg-gray-400/20 md:hidden' />
        </div>
      </div>
    </header>
  );
};

const Separator = () => {
  return <span className='mx-1.5'>·</span>;
};
