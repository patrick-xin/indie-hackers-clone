import Image from 'next/future/image';
import { useSession } from 'next-auth/react';

import { Alert, Button } from '@/features/UI';
import { AuthWrapper } from '@/features/UI/AuthWrapper';
import { Spinner } from '@/features/UI/Spinner';
import { useFollowUser, useUnFollowUser } from '@/features/user/auth/api';
import { AvatarPopover } from '@/features/user/auth/components';
import {
  useGetUserFollows,
  useGetUsernameFromParam,
} from '@/features/user/unauth/api';

export const UserPageSidebar = () => {
  const username = useGetUsernameFromParam();
  const { data } = useGetUserFollows({ username });

  return (
    <div className='user-sidebar pt-0 md:mx-6 md:-mt-24 md:space-y-8 md:p-6'>
      <div className='space-y-6'>
        <FollowsDetail />
        <div className='hidden space-y-4 md:block'>
          <h3 className='space-x-4 font-semibold'>
            <span className='text-2xl text-gray-100'>Following</span>
            <span className='text-2xl'>{data?.user._count.followers}</span>
          </h3>
          <div className='flex flex-wrap gap-3'>
            {data?.user.followers.map((follower) => (
              <AvatarPopover
                key={follower.following.id}
                user={follower.following}
              />
            ))}
          </div>
        </div>
        <div className='hidden space-y-4 md:block'>
          <h3 className='space-x-4 font-semibold'>
            <span className='text-2xl text-gray-100'>Followers</span>
            <span className='text-2xl'>{data?.user._count.followings}</span>
          </h3>
          <div className='flex flex-wrap gap-3'>
            {data?.user.followings.map((following) => (
              <AvatarPopover
                key={following.follower.id}
                user={following.follower}
              />
            ))}
          </div>
        </div>
        <div className='hidden space-y-4 md:block'>
          <h3 className='text-2xl text-gray-100'>Product</h3>
          <div className='space-y-5'>
            <div className='flex items-center gap-4'>
              <div>
                <Image
                  className='rounded-full'
                  height={60}
                  width={60}
                  src='/avatar.webp'
                  alt='user-avatar'
                />
              </div>
              <div className='flex-1'>
                <h4 className='text-lg text-gray-100'>Next Gen</h4>
                <p className='text-sm line-clamp-1'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Similique rem, ab possimus et dignissimos quae. Unde debitis
                  corrupti harum cum?
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div>
                <Image
                  className='rounded-full'
                  height={60}
                  width={60}
                  src='/avatar.webp'
                  alt='user-avatar'
                />
              </div>
              <div className='flex-1'>
                <h4 className='text-lg text-gray-100'>Next Gen</h4>
                <p className='text-sm line-clamp-1'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Similique rem, ab possimus et dignissimos quae. Unde debitis
                  corrupti harum cum?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FollowsDetail = () => {
  const { data: session } = useSession();
  const { follow, isFollowingLoading } = useFollowUser();
  const { unfollow, isUnfollowingLoading } = useUnFollowUser();
  const username = useGetUsernameFromParam();
  const { data, isLoading, isError } = useGetUserFollows({ username });
  return (
    <div className='relative space-y-4 bg-[#1f364d] px-10 md:rounded md:bg-[#274059] md:p-4'>
      {isLoading ? (
        <div className='absolute inset-0'>
          <Spinner />
        </div>
      ) : isError ? (
        <Alert message='Error fetching data' type='error' />
      ) : (
        <>
          <AuthWrapper>
            {data?.hasFollowed ? (
              <Button
                disabled={
                  isUnfollowingLoading || session?.user.username === username
                }
                variant='gradient-inverse'
                fullWidth
                onClick={() => {
                  if (!session) return;
                  unfollow({ unfollowerUsername: username });
                }}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                disabled={
                  isFollowingLoading || session?.user.username === username
                }
                variant='gradient'
                fullWidth
                onClick={() => {
                  if (!session) return;
                  follow({ followerUsername: username });
                }}
              >
                Follow
              </Button>
            )}
          </AuthWrapper>

          <div className='flex justify-around pb-8 text-center md:pb-0'>
            <div className='flex flex-col gap-2 md:flex-row md:items-center'>
              <div className='text-2xl text-white'>
                {data?.user._count.followings}
              </div>
              <div>Followers</div>
            </div>
            <div className='flex flex-col gap-2 md:flex-row md:items-center'>
              <div className='text-2xl text-white'>0</div>
              <div>Points</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
