import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';

import { BasicLayout } from '@/features/layout/Basic';
import { ButtonLink } from '@/features/UI';
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
    <div className='prose prose-brand mx-auto lg:prose-lg xl:prose-xl 2xl:prose-2xl'>
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
      {post && (
        <>
          <h1>{post.title}</h1>
          <div className='prose prose-brand prose-a:text-brand-blue prose-a:hover:underline xl:prose-xl 2xl:prose-2xl mx-auto prose-img:rounded prose-img:object-cover'>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          <ButtonLink href={`/dashboard/post/${post.id}`}>edit</ButtonLink>
        </>
      )}
    </div>
  );
};

export default UserPostPage;

UserPostPage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
