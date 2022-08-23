import cn from 'clsx';
import {
  addMonths,
  addWeeks,
  format,
  isToday,
  parseISO,
  subMonths,
  subWeeks,
} from 'date-fns';
import { useRouter } from 'next/router';

import { Button } from './Button';
import { FilterLinks } from './FilterLinks';
import { FliterNav } from './FliterNav';

export const SectionHeaderNav = ({
  type,
  handleOpen,
  page = 'post',
  tablinks,
}: {
  type: string;
  handleOpen: () => void;
  page?: 'post' | 'group' | 'post-group';
  tablinks: React.ReactNode;
}) => {
  const { route, query, push } = useRouter();
  const path = query.slug as string;
  const dateQuery = path && path.split('-').slice(2).join('-');
  const dateQueryToDate = parseISO(dateQuery);
  const istoday = isToday(dateQueryToDate);

  const renderContent = () => {
    if (type === 'week') {
      return (
        <FliterNav
          nextDisabled={istoday}
          onNextClick={() =>
            push(
              `/top/week-of-${format(
                addWeeks(dateQueryToDate, 1),
                'yyyy-MM-dd'
              )}`
            )
          }
          onPrevClick={() =>
            push(
              `/top/week-of-${format(
                subWeeks(dateQueryToDate, 1),
                'yyyy-MM-dd'
              )}`
            )
          }
        >
          <div className='flex-1 flex justify-center w-full gap-3'>
            <div>
              {dateQuery && format(parseISO(dateQuery), 'LLL dd, yyyy')}
            </div>
            <div>-</div>
            <div>
              {dateQuery &&
                format(subWeeks(dateQueryToDate, 1), 'LLL dd, yyyy')}
            </div>
          </div>
        </FliterNav>
      );
    }
    if (type === 'month') {
      return (
        <FliterNav
          onNextClick={() =>
            push(
              `/top/month-of-${format(
                addMonths(dateQueryToDate, 1),
                'yyyy-MM'
              )}`
            )
          }
          onPrevClick={() =>
            push(
              `/top/month-of-${format(
                subMonths(dateQueryToDate, 1),
                'yyyy-MM'
              )}`
            )
          }
        >
          <div className='flex-1 flex justify-center w-full gap-3'>
            <div>{dateQuery && format(parseISO(dateQuery), 'LLL, yyyy')}</div>
          </div>
        </FliterNav>
      );
    }
    return null;
  };

  return (
    <header className='flex flex-col items-start gap-4 sm:gap-0 sm:flex-row sm:justify-between sm:items-center lg:items-start mb-6'>
      <div className='space-y-4 w-full'>
        <div
          className={cn(
            'md:flex flex-row-reverse justify-between items-center',
            { flex: page === 'post-group' }
          )}
        >
          <Button
            size='small'
            variant='gradient'
            onClick={handleOpen}
            transition
          >
            {page === 'group' ? 'New Group' : ' New Post'}
          </Button>
          {tablinks}
        </div>

        {(route === '/' || route.startsWith('/top')) && (
          <div className='space-y-4 w-full'>
            <FilterLinks path={path ?? ''} />
            {route.startsWith('/top') && renderContent()}
          </div>
        )}
      </div>
    </header>
  );
};
