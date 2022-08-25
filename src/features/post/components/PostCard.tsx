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
  username: string | null;
};

export const PostCard = ({
  title,
  _count,
  publishedAt,
  content,
  slug,
  username,
}: Props) => {
  return (
    <article className='group rounded bg-[#1E364D] p-6 transition-colors ease-linear hover:bg-[#274059]'>
      <Link href={`/@${username}/${slug}`}>
        <a>
          <header className='relative'>
            <div className='flex items-center gap-4'>
              <div>{format(publishedAt, 'MMMM dd, yyyy')}</div>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <BsFillHeartFill className='transition-colors ease-linear group-hover:text-red-500' />
                  <div className='transition-colors ease-linear group-hover:text-gray-200'>
                    {_count.likes}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <BiCommentDetail className='transition-colors ease-linear group-hover:text-brand-blue' />
                  <div className='transition-colors ease-linear group-hover:text-gray-200'>
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
            <h2 className='my-4 text-2xl text-white'>{title}</h2>
            <p className='line-clamp-3'>{content}</p>
          </div>
        </a>
      </Link>
    </article>
  );
};
