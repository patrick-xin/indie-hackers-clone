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

  return (
    <div>
      {/* {post && (
        <Blocks
          data={post.content}
          config={{
            code: {
              className: 'language-js',
            },
            delimiter: {
              className: 'border border-2 w-16 mx-auto',
            },
            embed: {
              className: 'border-0',
            },
            header: {
              className: 'font-bold',
            },
            image: {
              className: 'w-full max-w-screen-md',
              actionsClassNames: {
                stretched: 'w-full h-80 object-cover',
                withBorder: 'border border-2',
                withBackground: 'p-2',
              },
            },
            list: {
              className: 'list-inside list-disc',
            },
            paragraph: {
              className: 'text-base text-opacity-75 py-2 lg:py-4 lg:text-lg ',
              actionsClassNames: {
                alignment: 'text-{alignment}', // This is a substitution placeholder: left or center.
              },
            },
            quote: {
              className: 'py-3 px-5 italic font-serif',
            },
            table: {
              className: 'table-auto',
            },
          }}
        />
      )} */}
    </div>
  );
};

export default UserPostPage;

UserPostPage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
