import Link from 'next/link';

import { SearchNavigation } from '@/features/search/components/SearchNavigation';
import { AvatarPopover } from '@/features/user/auth/components';

type UsersResultProps = {
  page;
  usersCount;
  users;
  previousButtonDisabled;
  nextButtonDisabled;
  onPreviousClick;
  onNextClick;
};

export const UsersResult = ({
  page,
  usersCount,
  users,
  previousButtonDisabled,
  nextButtonDisabled,
  onPreviousClick,
  onNextClick,
}: UsersResultProps) => {
  return (
    <div>
      <div className='my-4 flex items-center justify-between border-b-4 border-[#1f364d] py-3'>
        <h4 className='text-xl text-white'>{usersCount} Users</h4>
        <SearchNavigation
          page={page}
          count={usersCount}
          baseCount={6}
          nextButtonDisabled={nextButtonDisabled}
          previousButtonDisabled={previousButtonDisabled}
          onNextClick={onNextClick}
          onPreviousClick={onPreviousClick}
        />
      </div>
      <div className='flex flex-wrap gap-4'>
        {users?.map((user) => (
          <div key={user.id} className='flex flex-col items-center gap-3'>
            <div className='p-2 pr-1'>
              <AvatarPopover user={user} size='large' />
            </div>

            <Link href={`/@${user.username}`}>
              <a className=''>
                <div className='flex flex-col gap-3 text-center text-[#4f7092]'>
                  <div>{user.name}</div>
                  <div>@{user.username}</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
