import React, { ReactElement } from 'react';

import { BasicLayout } from '@/features/layout/Basic';
import { trpc } from '@/utils/trpc';

const AdminPage = () => {
  const { data: users } = trpc.useQuery(['admin.users']);
  const { data: posts } = trpc.useQuery(['admin.posts']);
  const { mutate } = trpc.useMutation(['admin.generate-posts']);
  return (
    <div>
      <button onClick={() => mutate()}>Generate</button>
      <div>
        <h1>Users</h1>
        <ul>
          {users?.map((user) => (
            <li key={user.id}>
              <div className='flex gap-2'>
                <div>{user.email}</div>
                <div>{user.username}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Posts</h1>
        <ul>
          {posts?.map((post) => (
            <li key={post.id}>
              <div className='flex gap-2'>
                <div>{post._count.likes}</div>
                <div>{post.title}</div>
                <div>{post.author.username}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;

AdminPage.getLayout = (page: ReactElement) => <BasicLayout>{page}</BasicLayout>;
