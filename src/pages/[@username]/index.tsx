import { useRouter } from 'next/router';
import React from 'react';

import { trpc } from '@/utils/trpc';

const UserPage = () => {
  const { query } = useRouter();
  const username = query['@username'] as string;

  const { data: user } = trpc.useQuery(
    ['user.username', { username: username?.split('@')[1] }],
    { enabled: Boolean(username) }
  );

  return (
    <div>
      <div>
        <div>hi</div>
      </div>
    </div>
  );
};

export default UserPage;
