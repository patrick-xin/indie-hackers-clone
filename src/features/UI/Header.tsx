import cn from 'clsx';
import { signIn, useSession } from 'next-auth/react';
import { ImSpinner8 } from 'react-icons/im';
import { IoIosMenu, IoIosSearch } from 'react-icons/io';

import { Logo } from '@/features/UI/Logo';
import { ProfileMenuDropdown } from '@/features/user/components';
import { trpc } from '@/utils/trpc';

type Props = {
  isTransparent?: boolean;
};

export const Header = ({ isTransparent = false }: Props) => {
  const session = useSession();
  const { data } = trpc.useQuery(['auth.me', { postId: undefined }], {
    enabled: Boolean(session),
  });
  const renderUserStatus = () => {
    if (session.status === 'loading') {
      return <ImSpinner8 className='h-4 w-4 animate-spin' />;
    } else if (session.status === 'authenticated' && data && data.user) {
      return <ProfileMenuDropdown user={data.user} />;
    } else {
      return <LoginRegister />;
    }
  };
  return (
    <div
      className={cn(
        'mt-1 flex h-14 items-center justify-between px-4 lg:px-12',
        {
          'bg-transparent': isTransparent,
          'bg-[#1E364D]': !isTransparent,
        }
      )}
    >
      <div className='flex items-center gap-2'>
        <div className='sm:hidden'>
          <Logo hasName={false} />
        </div>
        <div>
          <IoIosMenu className='h-6 w-6' />
        </div>
        <div>
          <IoIosSearch className='h-6 w-6' />
        </div>
      </div>

      <div className='hidden items-center gap-2 font-black text-white sm:flex sm:gap-4'>
        <Logo />
      </div>

      {renderUserStatus()}
    </div>
  );
};

const LoginRegister = () => {
  return (
    <div>
      <button className='hover:text-white' onClick={() => signIn()}>
        login
      </button>
    </div>
  );
};
