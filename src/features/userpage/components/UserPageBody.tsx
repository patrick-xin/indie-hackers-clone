import { PostCard } from '@/features/post/components';

import { UserPageAction } from './UserPageAction';

export const UserPageBody = ({ user }) => {
  return (
    <div className='user-body z-100 md:mx-6'>
      <UserPageAction />
      <div>
        <ul className='space-y-6'>
          {user?.posts.map((post) => (
            <PostCard {...post} key={post.id} username={user.username} />
          ))}
        </ul>
      </div>
    </div>
  );
};
