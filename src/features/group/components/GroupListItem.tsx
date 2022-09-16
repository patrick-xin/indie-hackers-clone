import Image from 'next/future/image';
import Link from 'next/link';

type GroupListItemProps = {
  name: string;
  description: string;
  ratio: number;
  logo: string;
  slug: string;
};
export const GroupListItem = ({
  name,
  description,
  ratio,
  logo,
  slug,
}: GroupListItemProps) => {
  return (
    <Link href={`/groups/${slug}`}>
      <a className='inline-block'>
        <div className='group flex items-center justify-between rounded p-2 transition-colors ease-linear hover:bg-[#1E364D]'>
          <div className='flex items-center gap-3'>
            <div>
              <Image
                src={logo}
                width={75}
                height={75}
                className='rounded-full'
                alt={`group-${name}-image`}
              />
            </div>
            <div>
              <h4 className='text-white'>{name}</h4>
              <p className='line-clamp-1'>{description}</p>
            </div>
          </div>

          <div className='rounded-2xl bg-[#4799eb] bg-opacity-10 px-1.5 py-1 text-[#4799eb] group-hover:invisible'>
            +{ratio}%
          </div>
        </div>
      </a>
    </Link>
  );
};
