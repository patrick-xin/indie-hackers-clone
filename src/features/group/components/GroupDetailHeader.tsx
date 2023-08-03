import Image from 'next/future/image';
import { useRouter } from 'next/router';
import { DoorEnter, DoorExit, Message, Users } from 'tabler-icons-react';

import { Button } from '@/features/UI';
import { trpc } from '@/utils/trpc';

type GroupDetailHeaderProps = {
  name: string;
  description: string;
  image: string;
  isMember: boolean | { username: string };
};

export const GroupDetailHeader = ({
  name,
  description,
  image,
  isMember,
}: GroupDetailHeaderProps) => {
  const { query, push, pathname } = useRouter();

  const slug = query.slug as string;
  const utils = trpc.useContext();
  const { mutate: join, isLoading: isJoining } = trpc.useMutation(
    'group.join',
    {
      onSuccess: async () => {
        utils.invalidateQueries(['group.by-slug']);
      },
    }
  );
  const { mutate: leave, isLoading: isLeaving } = trpc.useMutation(
    'group.leave',
    {
      onSuccess: async () => {
        utils.invalidateQueries(['group.by-slug']);
      },
    }
  );

  return (
    <div>
      <div className='flex items-center gap-6 bg-[#1f364d] p-4 md:gap-10 md:p-10'>
        <div className='max-w-[80px]'>
          <Image
            src={image}
            height={160}
            width={160}
            className='rounded-full'
            style={{ boxShadow: '0 0 0 8px #0e2439' }}
            alt={`group-${name}-${image}`}
          />
        </div>
        <div className='md:space-y-4'>
          <h1 className='text-2xl font-bold text-white md:text-3xl'>{name}</h1>
          <p className='md:text-lg'>{description}</p>
        </div>
      </div>

      <div className='flex-row-reverse items-center justify-between bg-[#152C41] py-4 pb-0 md:flex'>
        <div className='mx-4'>
          {isMember ? (
            <Button
              className='uppercase'
              onClick={() => leave({ slug })}
              fullWidth
              variant='outline'
              icon={<DoorExit className='h-4 w-4' />}
              iconPosition='right'
              loading={isLeaving}
              loadingText='Leaving Group'
            >
              Leave Group
            </Button>
          ) : (
            <Button
              className='uppercase'
              onClick={() => join({ slug })}
              fullWidth
              variant='gradient'
              icon={<DoorEnter className='h-4 w-4' />}
              iconPosition='right'
              loading={isJoining}
              loadingText='Joining Group'
            >
              Join Group
            </Button>
          )}
        </div>
        <div className='flex gap-4 pt-6'>
          <Button
            onClick={() => push(`/groups/${slug}`)}
            size='small'
            variant={pathname.endsWith('[slug]') ? 'underline' : 'transparent'}
            className='uppercase'
            transition
            icon={<Message className='h-5 w-5' />}
          >
            discussions
          </Button>
          <Button
            onClick={() => push(`/groups/${slug}/members`)}
            size='small'
            variant={pathname.endsWith('members') ? 'underline' : 'transparent'}
            className='uppercase'
            transition
            icon={<Users className='h-5 w-5' />}
          >
            members
          </Button>
        </div>
      </div>
    </div>
  );
};
