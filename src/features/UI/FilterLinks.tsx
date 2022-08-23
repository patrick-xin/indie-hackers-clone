import { format } from 'date-fns';
import { useRouter } from 'next/router';

import { ButtonLink, Flex } from '@/features/UI';

export const FilterLinks = () => {
  const { pathname, asPath } = useRouter();

  return (
    <Flex className='gap-3'>
      <ButtonLink href='/' variant='blue' isActive={pathname === '/'}>
        today
      </ButtonLink>
      <ButtonLink
        href={`/top/week-of-${format(new Date(), 'yyyy-MM-dd')}`}
        variant='blue'
        isActive={asPath.includes('week')}
      >
        weekly
      </ButtonLink>
      <ButtonLink
        href={`/top/month-of-${format(new Date(), 'yyyy-MM')}`}
        variant='blue'
        isActive={asPath.includes('month')}
      >
        monthly
      </ButtonLink>
      <ButtonLink
        href='/top/all-time'
        variant='blue'
        isActive={asPath.includes('all')}
      >
        all time
      </ButtonLink>
    </Flex>
  );
};
