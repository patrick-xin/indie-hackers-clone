import Link from 'next/link';
import { ImBookmark } from 'react-icons/im';

export const BookmarkCard = ({ bookmark }) => {
  const { title, author, slug, content } = bookmark;
  return (
    <Link href={`/@${author.username}/${slug}`}>
      <a className='group relative inline-block w-full'>
        <div className='space-y-4 rounded bg-[#1E364D] px-4 py-6 transition-colors ease-linear group-hover:bg-[#274059]'>
          <h3 className='text-2xl text-white'>{title}</h3>
          <p className='text-[#68839D] line-clamp-3'>{content}</p>
        </div>
        <div className='absolute top-0 right-4'>
          <ImBookmark className='h-6 w-6 text-red-500 transition-colors ease-linear group-hover:text-blue-500 ' />
        </div>
      </a>
    </Link>
  );
};
