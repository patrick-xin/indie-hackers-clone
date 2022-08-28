import { Loader } from 'tabler-icons-react';

import { Flex } from '@/features/UI/Flex';

export const FullScreenLoader = () => {
  return (
    <Flex className='absolute inset-0 h-screen items-center justify-center overflow-hidden'>
      <Loader className='animate-spin ' />
    </Flex>
  );
};
