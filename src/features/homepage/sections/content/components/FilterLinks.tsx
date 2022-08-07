import { format } from 'date-fns';
import React from 'react';

import { ButtonLink, Flex } from '@/features/UI';

export const FilterLinks = ({ path }: { path: string }) => {
  return (
    <Flex className='gap-3'>
      <ButtonLink href='/' variant='blue' isActive={path === ''}>
        today
      </ButtonLink>
      <ButtonLink
        href={`/top/week-of-${format(new Date(), 'yyyy-MM-dd')}`}
        variant='blue'
        isActive={path.startsWith('week')}
      >
        weekly
      </ButtonLink>
      <ButtonLink
        href={`/top/month-of-${format(new Date(), 'yyyy-MM')}`}
        variant='blue'
        isActive={path.startsWith('month')}
      >
        monthly
      </ButtonLink>
      <ButtonLink
        href='/top/all-time'
        variant='blue'
        isActive={path.startsWith('all')}
      >
        all time
      </ButtonLink>
    </Flex>
  );
};
