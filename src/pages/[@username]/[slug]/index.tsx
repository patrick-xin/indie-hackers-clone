import { useRouter } from 'next/router';
import { ReactElement } from 'react';

import { BasicLayout } from '@/features/layout/Basic';
import { trpc } from '@/utils/trpc';
const UserPostPage = () => {
  const { query } = useRouter();

  const slug = query.slug as string;
  const username = query['@username'] as string;

  const { data: post } = trpc.useQuery(
    ['public-posts.by-slug', { slug, username: username?.split('@')[1] }],
    { enabled: Boolean(slug) && Boolean(username) }
  );

  return <div>{post && <div>hello user</div>}</div>;
};

export default UserPostPage;

UserPostPage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
