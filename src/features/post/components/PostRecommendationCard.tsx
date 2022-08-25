import Image from 'next/future/image';
import Link from 'next/link';

const PostRecommendationCard = () => {
  return (
    <Link href='/'>
      <a className='group'>
        <div className='p-1'>
          <div>
            <Image
              src='/post-cover.jpg'
              height={200}
              width={300}
              className='rounded'
            />
          </div>
          <div>
            <div className='group-hover:text-brand-blue group-hover:underline group-hover:decoration-brand-blue'>
              Does my homepage suck?
            </div>
            <div>
              <div>
                <Image
                  src='/avatar.webp'
                  height={32}
                  width={32}
                  className='rounded-full'
                />
              </div>
              <div>57 comments</div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default PostRecommendationCard;
