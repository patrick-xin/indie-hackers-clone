import { format } from 'date-fns';
import { useRouter } from 'next/router';

import { ButtonLink, Flex } from '@/features/UI';

export const FilterLinks = () => {
  const { pathname, asPath } = useRouter();

  return (
    <Flex className='absolute top-0 left-0 z-10 flex-col divide-y-[1px] divide-[#152C41] rounded-lg text-sm uppercase'>
      <ButtonLink href='/' variant='primary' isActive={pathname === '/'}>
        today
      </ButtonLink>
      <ButtonLink
        href={`/top/week-of-${format(new Date(), 'yyyy-MM-dd')}`}
        variant='primary'
        isActive={asPath.includes('week')}
      >
        weekly
      </ButtonLink>
      <ButtonLink
        href={`/top/month-of-${format(new Date(), 'yyyy-MM')}`}
        variant='primary'
        isActive={asPath.includes('month')}
      >
        monthly
      </ButtonLink>
      <ButtonLink
        href='/top/all-time'
        variant='primary'
        isActive={asPath.includes('all')}
      >
        all time
      </ButtonLink>
    </Flex>
  );
};
