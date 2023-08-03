import Image from 'next/future/image';
import Link from 'next/link';

type PostRecommendationCardProps = {
  image: string;
  title: string;
  avatar: string;
  username: string;
};

export const PostRecommendationCard = ({
  image,
  title,
  avatar,
  username,
}: PostRecommendationCardProps) => {
  return (
    <Link href='/'>
      <a className='group'>
        <div className='p-1'>
          <div>
            <Image
              src={image}
              height={200}
              width={300}
              className='rounded'
              alt={`${title}-image`}
            />
          </div>
          <div>
            <div className='group-hover:text-brand-blue group-hover:underline group-hover:decoration-brand-blue'>
              Does my homepage suck?
            </div>
            <div>
              <div>
                <Image
                  src={avatar}
                  height={32}
                  width={32}
                  className='rounded-full'
                  alt={`${username}-avatar`}
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
