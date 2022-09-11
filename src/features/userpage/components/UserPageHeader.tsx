import { formatDistance } from 'date-fns';
import Image from 'next/future/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Edit } from 'tabler-icons-react';

import { IconButton } from '@/features/UI';

type Props = {
  image: string;
  username: string;
  createdAt: Date;
  detail: {
    fullName?: string;
    twitter?: string;
    publicEmail?: string;
    bio?: string;
    location?: string;
  };
};

export const UserPageHeader = ({
  image,
  username,
  createdAt,
  detail,
}: Props) => {
  const { data } = useSession();
  const isOwner = data?.user.username === username;
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
              src={image ?? '/avatar.webp'}
              alt='user-avatar'
            />
          </div>
        </div>
        <div>
          <div className='flex items-center gap-4'>
            <h3 className='py-4 text-center text-2xl text-gray-100 md:text-left md:text-3xl'>
              {username}
              {detail?.fullName && (
                <span className='mx-4 text-brand-text'>{detail.fullName}</span>
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
            {detail?.location && <span>{detail.location}</span>}
            <Separator />
            <span>
              joined{' '}
              {formatDistance(createdAt, new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>
          {detail?.bio && (
            <div>
              <Separator />
              {detail.bio}
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
