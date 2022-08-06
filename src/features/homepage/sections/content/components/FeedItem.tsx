import { Popover } from '@headlessui/react';
import { Post } from '@prisma/client';
import { format, formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/future/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiChevronUp, BiComment } from 'react-icons/bi';
import { usePopper } from 'react-popper';

type Props = {
  post: Post & {
    author: {
      image: string | null;
      username: string | null;
    };
    _count: {
      comments: number;
      likes: number;
    };
  };
};

const listItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const FeedItem = ({ post }: Props) => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  return (
    <motion.div
      variants={listItem}
      className='px-2 py-1 sm:py-2 sm:px-4 shadow-sm bg-[#152C41] flex flex-col sm:gap-4 rounded-sm sm:items-center sm:flex-row'
    >
      <div className='hidden sm:block'>
        <Popover>
          <Popover.Button ref={setReferenceElement}>
            <div>
              <Image
                src={post.author.image ?? '/avatat.webp'}
                className='rounded-full'
                width={48}
                height={48}
                alt='user-avatar'
              />
            </div>
          </Popover.Button>

          <Popover.Panel
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className='min-h-56 w-72 mx-6 bg-[#274059] space-y-4 rounded-sm'>
              <header className='bg-[#2F4D6A] p-4'>
                <Link href={`/@${post.author.username}`}>
                  <a>
                    <div className='flex gap-6 items-center'>
                      <Image
                        src={post.author.image ?? '/avatat.webp'}
                        className='rounded-full'
                        width={60}
                        height={60}
                        alt='user-avatar'
                      />
                      <div>{post.author.username}</div>
                    </div>
                  </a>
                </Link>
              </header>

              <div className='space-y-4 px-6'>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                  reprehenderit, maiores adipisci mollitia fuga laboriosam culpa
                  excepturi dolore debitis, officia doloribus.
                </p>
                <div className='space-y-2'>
                  <div className='flex flex-col'>
                    <span className='inline-block text-sm'>Location:</span>
                    <span className='inline-block text-white text-lg'>
                      Victoria
                    </span>
                  </div>
                  <div className='flex gap-8'>
                    <div className='flex flex-col'>
                      <span className='inline-block text-sm'>Followers:</span>
                      <span className='inline-block text-white text-lg'>
                        112
                      </span>
                    </div>

                    <div>
                      <div className='flex flex-col'>
                        <span className='inline-block text-sm'>Points:</span>
                        <span className='inline-block text-white text-lg'>
                          220
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>Joined:2022</div>
                </div>
              </div>
              <footer className='bg-[#213348] p-4'>
                <button className='py-2 px-3 bg-gradient-to-r w-full rounded text-white text-center from-cyan-500 to-blue-500'>
                  Follow
                </button>
              </footer>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
      <div className='hidden sm:block'>
        <Upvote count={post._count.likes} />
      </div>
      <div className='flex flex-col flex-1'>
        <Title title={post.title} />
        <div className='items-center hidden p-1 sm:flex'>
          <Comments count={post._count.comments} />
          <Group />
          <span className='mx-1'>·</span>
          <div className='text-sm text-[#63809c] rounded'>
            {format(post.publishedAt, 'yyyy-MM-dd')}
          </div>
          <span className='mx-1'>·</span>
          <div className='text-sm text-[#63809c] rounded'>
            {formatDistance(post.publishedAt, new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>

      <div className='flex gap-4 items-center justify-start w-full mt-1 sm:hidden'>
        <Upvote count={post._count.likes} />
        <MobileComments count={post._count.comments} />
        <Group />
      </div>
    </motion.div>
  );
};

const Upvote = ({ count }: { count: number }) => {
  return (
    <div className='flex items-center sm:flex-col sm:gap-4 sm:-mt-2  text-[#63809c] group cursor-pointer'>
      <BiChevronUp className='h-8 w-8 group-hover:text-red-500' />
      <div className='text-sm group-hover:text-white sm:-mt-6'>{count}</div>
    </div>
  );
};

const MobileComments = ({ count }: { count: number }) => {
  return (
    <div className='flex gap-4'>
      <div className='hover:bg-[#1E364D] p-1 hover:text-white rounded hidden'>
        link
      </div>
      <span className='hidden'>·</span>
      <div className='hover:bg-[#1E364D] p-1 flex gap-2 items-center text-[#63809c] hover:text-gray-400 rounded'>
        <BiComment />
        <div className='text-sm group-hover:text-white sm:-mt-6'>{count}</div>
      </div>
    </div>
  );
};

const Comments = ({ count }: { count: number }) => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='hover:bg-[#1E364D] sm:p-1 hover:text-white rounded'>
        link
      </div>
      <div className='hover:bg-[#1E364D] sm:p-1 text-[#63809c] hover:text-gray-400 rounded'>
        <div className='text-sm group-hover:text-white'>· {count} comments</div>
      </div>
    </div>
  );
};

const Title = ({ title }: { title: string }) => {
  return (
    <h2 className='hover:bg-[#1E364D] px-2 py-1 rounded text-white sm:text-lg md:text-["#b6cce2"] hover:text-white'>
      {title}
    </h2>
  );
};

const Group = () => {
  return (
    <div className='flex gap-2 items-center p-1'>
      <div className='hover:bg-[#1E364D] hover:text-white rounded'>
        <Image
          src='/avatar.webp'
          width={32}
          height={32}
          className='rounded-full'
          alt='group-image'
        />
      </div>
      <div className='hover:bg-[#1E364D] text-sm text-[#63809c] hover:text-gray-400 rounded'>
        group name
      </div>
    </div>
  );
};
