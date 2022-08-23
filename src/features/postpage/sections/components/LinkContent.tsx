import { Post } from '@prisma/client';
import { ExternalLink } from 'tabler-icons-react';

import { Flex } from '@/features/UI';

type Props = {
  post: Omit<Post, 'publishedAt'> & { publishedAt: string };
};

export const LinkContent = ({ post }: Props) => {
  const linkContent =
    post && post.postType === 'LINK' && JSON.parse(post.content);

  return (
    <div className='bg-[#182e43] hover:bg-[#1E364D] p-3 rounded max-w-full'>
      <a href={linkContent.ogUrl}>
        <div className='flex flex-col gap-6 sm:flex-row'>
          {linkContent.ogImage ? (
            <div className='bg-red-300 rounded'>
              <img
                className='max-h-[200px] w-full md:h-[140px] sm:w-[140px] object-cover rounded'
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
            <p className='text-base my-1 md:text-lg'>
              {linkContent?.ogDescription}
            </p>
            <div className='uppercase text-sm my-3'>{linkContent?.ogTitle}</div>
          </div>
        </div>
      </a>
    </div>
  );
};
