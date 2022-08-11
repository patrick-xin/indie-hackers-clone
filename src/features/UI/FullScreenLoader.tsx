import React from 'react';
import { Loader } from 'tabler-icons-react';

import { Flex } from '@/features/UI/Flex';

export const FullScreenLoader = () => {
  return (
    <Flex className='justify-center absolute inset-0 h-screen items-center overflow-hidden'>
      <Loader className='animate-spin ' />
    </Flex>
  );
};
