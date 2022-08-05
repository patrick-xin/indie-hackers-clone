import { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import Image from 'next/future/image';
import Link from 'next/link';
import React from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { BsFillHeartFill } from 'react-icons/bs';

type Props = {
  title: string;
  publishedAt: Date;
  _count: Prisma.PostCountOutputType;
  slug: string;
  content: string;
};

export const PostCard = ({
  title,
  _count,
  publishedAt,
  content,
  slug,
}: Props) => {
  return (
    <article className='p-6 bg-[#1E364D] rounded hover:bg-[#274059] group transition-colors ease-linear'>
      <Link href={`/post/${slug}`}>
        <a>
          <header className='relative'>
            <div className='flex gap-4 items-center'>
              <div>{format(publishedAt, 'MMMM dd, yyyy')}</div>
              <div className='flex items-center gap-4'>
                <div className='flex gap-2 items-center'>
                  <BsFillHeartFill className='group-hover:text-red-500 transition-colors ease-linear' />
                  <div className='group-hover:text-gray-200 transition-colors ease-linear'>
                    {_count.likes}
                  </div>
                </div>
                <div className='flex gap-2 items-center'>
                  <BiCommentDetail className='group-hover:text-brand-blue transition-colors ease-linear' />
                  <div className='group-hover:text-gray-200 transition-colors ease-linear'>
                    {_count.comments}
                  </div>
                </div>
              </div>
            </div>
            <div className='absolute -left-10 top-0'>
              <Image
                style={{ boxShadow: '0 0 0 5px #0e2439' }}
                className='rounded-full'
                height={32}
                width={32}
                src='/avatar.webp'
                alt='user-avatar'
              />
            </div>
          </header>

          <div>
            <h2 className='text-2xl text-white my-4'>{title}</h2>
            <p>{content}</p>
          </div>
        </a>
      </Link>
    </article>
  );
};
