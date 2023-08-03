import { format } from 'date-fns';
import Image from 'next/future/image';
import Link from 'next/link';

import { SearchNavigation } from '@/features/search/components/SearchNavigation';
import DynamicHighlighter from '@/features/UI/ReactHighlighter';

export const GroupsResult = ({
  page,
  groupsCount,
  groups,
  search,
  previousButtonDisabled,
  nextButtonDisabled,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <div>
      <div className='my-4 flex items-center justify-between border-b-4 border-[#1f364d] py-3'>
        <h4 className='text-xl text-white'>{groupsCount} Groups</h4>
        <SearchNavigation
          page={page}
          count={groupsCount}
          baseCount={10}
          nextButtonDisabled={nextButtonDisabled}
          previousButtonDisabled={previousButtonDisabled}
          onNextClick={onNextClick}
          onPreviousClick={onPreviousClick}
        />
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {groups?.map((group) => (
          <div key={group.id} className='flex gap-3'>
            <div className='p-2 pr-1'>
              <Image
                src={group.image}
                height={60}
                width={60}
                alt={group.name}
              />
            </div>
            <Link href={`/groups/${group.slug}`}>
              <a className='flex-1 space-y-2 rounded p-2 hover:bg-[#1E364D]'>
                <DynamicHighlighter
                  highlightClassName='text-brand-blue bg-transparent'
                  className='text-xl text-white'
                  searchWords={[search]}
                  autoEscape={true}
                  textToHighlight={group.name}
                />
                <div className='flex gap-3 text-[#4f7092]'>
                  <div>{group._count.members} memebers</div>
                  <div>{format(group.createdAt, 'LLL dd')}</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
