import Image from 'next/future/image';
import Link from 'next/link';

import { Button } from '@/features/UI';
import { trpc } from '@/utils/trpc';

export const UserPageSidebar = ({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) => {
  const utils = trpc.useContext();

  const { data, isLoading } = trpc.useQuery([
    'user.username-follows',
    { username },
  ]);

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

  if (!data || isLoading) return <div>loading</div>;

  return (
    <div className='user-sidebar pt-0 md:mx-6 md:-mt-24 md:space-y-8 md:p-6'>
      <div className='space-y-4 bg-[#1f364d] px-10 md:rounded md:bg-[#274059] md:p-4'>
        {data.hasFollowed ? (
          <Button
            disabled={isUnfollowingLoading}
            variant='gradient-inverse'
            fullWidth
            onClick={() => {
              unfollow({ unfollowerId: userId });
            }}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            disabled={isFollowingLoading}
            variant='gradient'
            fullWidth
            onClick={() => {
              follow({ followerId: userId });
            }}
          >
            Follow
          </Button>
        )}

        <StatsCard followersCount={data.user._count.followings} />
      </div>

      <div className='hidden space-y-4 md:block'>
        <h3 className='space-x-4 font-semibold'>
          <span className='text-2xl text-gray-100'>Following</span>
          <span className='text-2xl'>{data.user._count.followers}</span>
        </h3>
        <div className='flex flex-wrap gap-3'>
          {data.user.followers.map((follower) => (
            <div key={follower.following.id}>
              <Link href={`/@${follower.following.username}`}>
                <a>
                  <Image
                    className='rounded-full'
                    height={40}
                    width={40}
                    src={follower.following.image}
                    alt='user-avatar'
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className='hidden space-y-4 md:block'>
        <h3 className='space-x-4 font-semibold'>
          <span className='text-2xl text-gray-100'>Followers</span>
          <span className='text-2xl'>{data.user._count.followings}</span>
        </h3>
        <div className='flex flex-wrap gap-3'>
          {data.user.followings.map((following) => (
            <div key={following.follower.id}>
              <Link href={`/@${following.follower.username}`}>
                <a>
                  <Image
                    className='rounded-full'
                    height={40}
                    width={40}
                    src={following.follower.image}
                    alt='user-avatar'
                  />
                </a>
              </Link>
            </div>
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
  );
};

const StatsCard = ({ followersCount }: { followersCount: number }) => {
  return (
    <div className='flex justify-around pb-8 text-center md:pb-0'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center'>
        <div className='text-2xl text-white'>{followersCount}</div>
        <div>Followers</div>
      </div>
      <div className='flex flex-col gap-2 md:flex-row md:items-center'>
        <div className='text-2xl text-white'>32</div>
        <div>Points</div>
      </div>
    </div>
  );
};
