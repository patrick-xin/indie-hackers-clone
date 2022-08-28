import { Post } from '@prisma/client';
import { ExternalLink } from 'tabler-icons-react';

import { Flex } from '@/features/UI';

type Props = {
  post: Pick<Post, 'content' | 'postType'>;
};

export const LinkContent = ({ post }: Props) => {
  const linkContent =
    post && post.postType === 'LINK' && JSON.parse(post.content);

  return (
    <div className='max-w-full rounded bg-[#182e43] p-3 hover:bg-[#1E364D]'>
      <a href={linkContent.ogUrl}>
        <div className='flex flex-col gap-6 sm:flex-row'>
          {linkContent.ogImage ? (
            <div className='flex items-center justify-center rounded'>
              <img
                className='h-full max-h-[200px] w-full rounded sm:w-[140px] md:h-[140px]'
                src={linkContent.ogImage?.url}
              />
            </div>
          ) : (
            <Flex className='justify-end'>
              <ExternalLink />
            </Flex>
          )}

          <div className='flex-1'>
            <h3 className='text-white md:text-xl'>{linkContent?.ogTitle}</h3>
            <p className='my-1 text-base md:text-lg'>
              {linkContent?.ogDescription}
            </p>
            <div className='my-3 text-sm uppercase'>{linkContent?.ogUrl}</div>
          </div>
        </div>
      </a>
    </div>
  );
};
