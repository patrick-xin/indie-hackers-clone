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

import { FliterNav } from '@/features/UI';

export const TopPagePagination = () => {
  const { query, push } = useRouter();
  const path = query.slug as string;
  const dateQuery = path && path.split('-').slice(2).join('-');

  const dateQueryToDate = parseISO(dateQuery);
  const istoday = isToday(dateQueryToDate);
  if (path?.startsWith('week')) {
    return (
      <FliterNav
        nextDisabled={istoday}
        onNextClick={() =>
          push(
            `/top/week-of-${format(addWeeks(dateQueryToDate, 1), 'yyyy-MM-dd')}`
          )
        }
        onPrevClick={() =>
          push(
            `/top/week-of-${format(subWeeks(dateQueryToDate, 1), 'yyyy-MM-dd')}`
          )
        }
      >
        <div className='flex w-full flex-1 justify-center gap-3'>
          <div>{dateQuery && format(parseISO(dateQuery), 'LLL dd, yyyy')}</div>
          <div>-</div>
          <div>
            {dateQuery && format(subWeeks(dateQueryToDate, 1), 'LLL dd, yyyy')}
          </div>
        </div>
      </FliterNav>
    );
  }
  if (path?.startsWith('month')) {
    return (
      <FliterNav
        onNextClick={() =>
          push(
            `/top/month-of-${format(addMonths(dateQueryToDate, 1), 'yyyy-MM')}`
          )
        }
        onPrevClick={() =>
          push(
            `/top/month-of-${format(subMonths(dateQueryToDate, 1), 'yyyy-MM')}`
          )
        }
      >
        <div className='flex w-full flex-1 justify-center gap-3'>
          <div>{dateQuery && format(parseISO(dateQuery), 'LLL, yyyy')}</div>
        </div>
      </FliterNav>
    );
  }
  return null;
};
