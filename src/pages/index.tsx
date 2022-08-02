import React from 'react';

import {
  Container,
  Content,
  Explore,
  Group,
  Onboard,
} from '@/features/homepage/sections/';
import { BasicLayout } from '@/features/layout/Basic';

const Hello = () => {
  return (
    <BasicLayout>
      <Onboard />
      <Container>
        <Content />
        <Group />
        <Explore />
      </Container>
    </BasicLayout>
  );
};

export default Hello;
