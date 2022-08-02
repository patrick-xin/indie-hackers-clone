import { useRouter } from 'next/router';
import { useState } from 'react';

import { trpc } from '@/utils/trpc';

const WelcomePage = () => {
  const router = useRouter();
  const { data } = trpc.useQuery(['auth.getSession']);
  const mutation = trpc.useMutation(['user.edit-bio'], {
    onSuccess: () => {
      router.push('/');
    },
  });

  const [username, setUsername] = useState('');
  return (
    <div>
      <div>
        Welcome <span>{data?.user?.name}</span>
      </div>

      <div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='username'
          required
        />

        <button
          onClick={() => {
            if (data) {
              const userId = data.user.id as string;
              mutation.mutate({ username, userId });
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
