import { Popover } from '@headlessui/react';
import { User } from '@prisma/client';
import { format } from 'date-fns';
import Image from 'next/future/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';

import { Button } from '@/features/UI';
import { AuthWrapper } from '@/features/UI/AuthWrapper';
import { trpc } from '@/utils/trpc';

type Props = {
  user: Pick<User, 'image' | 'username'>;
  size?: 'normal' | 'large';
};

export const AvatarPopover = ({ user, size = 'normal' }: Props) => {
  const utils = trpc.useContext();
  const { data } = trpc.useQuery([
    'user.username-follows',
    { username: user.username },
  ]);
  const { data: session } = useSession();
  const { mutate: follow, isLoading: isFollowingLoading } = trpc.useMutation(
    'user.follow',
    {
      onSuccess: async () => {
        utils.invalidateQueries(['user.username-follows']);
      },
    }
  );
  const { mutate: unfollow, isLoading: isUnfollowingLoading } =
    trpc.useMutation('user.unfollow', {
      onSuccess: async () => {
        utils.invalidateQueries(['user.username-follows']);
      },
    });
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: 'flip', options: { fallbackPlacements: ['top', 'right'] } },
    ],
  });
  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        <div>
          <Image
            src={user.image ?? '/avatat.webp'}
            className='rounded-full'
            width={size === 'normal' ? 40 : 120}
            height={size === 'normal' ? 40 : 120}
            alt='user-avatar'
            priority
          />
        </div>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className='mx-6 min-h-[14rem] w-72 space-y-4 rounded bg-[#274059]'>
          <header className='bg-[#2F4D6A] p-4'>
            <Link href={`/@${user.username}`}>
              <a>
                <div className='flex items-center gap-6'>
                  <Image
                    priority
                    src={user.image ?? '/avatat.webp'}
                    className='rounded-full'
                    width={60}
                    height={60}
                    alt='user-avatar'
                  />
                  <div>{user.username}</div>
                </div>
              </a>
            </Link>
          </header>

          <div className='space-y-4 px-6'>
            {data?.user.profile?.bio && <p>{data.user.profile.bio}</p>}
            <div className='space-y-2'>
              {data?.user.profile?.location && (
                <div className='flex flex-col'>
                  <span className='inline-block text-sm'>Location:</span>
                  <span className='inline-block text-lg text-white'>
                    {data.user.profile.location}
                  </span>
                </div>
              )}

              <div className='flex gap-8'>
                <div className='flex flex-col'>
                  <span className='inline-block text-sm'>Followers:</span>
                  <span className='inline-block text-lg text-white'>
                    {data?.user.followings.length}
                  </span>
                </div>

                <div>
                  <div className='flex flex-col'>
                    <span className='inline-block text-sm'>Points:</span>
                    <span className='inline-block text-lg text-white'>0</span>
                  </div>
                </div>
              </div>
              <div>Joined: {data && format(data.user.createdAt, 'YYY')}</div>
            </div>
          </div>
          <footer className='bg-[#213348] p-4'>
            <AuthWrapper>
              {data?.hasFollowed ? (
                <Button
                  disabled={
                    isUnfollowingLoading ||
                    session?.user.username === user.username
                  }
                  variant='gradient-inverse'
                  fullWidth
                  onClick={() => {
                    if (!session) return;
                    unfollow({ unfollowerUsername: user.username });
                  }}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  disabled={
                    isFollowingLoading ||
                    session?.user.username === user.username
                  }
                  variant='gradient'
                  fullWidth
                  onClick={() => {
                    if (!session) return;
                    follow({ followerUsername: user.username });
                  }}
                >
                  Follow
                </Button>
              )}
            </AuthWrapper>
          </footer>
        </div>
      </Popover.Panel>
    </Popover>
  );
};
