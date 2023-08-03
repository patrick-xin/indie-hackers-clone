import React from 'react';

import { BasicLayout } from '@/features/layout/Basic';

const NewGroupPage = () => {
  return <div>NewGroupPage</div>;
};

export default NewGroupPage;

NewGroupPage.getLayout = (page: React.ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
