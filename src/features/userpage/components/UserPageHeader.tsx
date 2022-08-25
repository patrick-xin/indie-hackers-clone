import { User } from '@prisma/client';
import Image from 'next/future/image';

type Props = {
  user: Pick<User, 'image' | 'username'>;
};

export const UserPageHeader = ({ user }: Props) => {
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
          <h3 className='py-4 text-center text-2xl text-gray-100 md:text-left md:text-3xl'>
            {user?.username}
          </h3>
          <button>report</button>
          <p className='md:text-lg'>
            joined 4 years ago · Non-technical founder, aspiring maker, local
            business advocate, husband, writer, musician, and armchair
            archaeologist
          </p>
          <div className='mx-auto my-8 h-1 w-48 bg-gray-400/20 md:hidden' />
        </div>
      </div>
    </header>
  );
};
