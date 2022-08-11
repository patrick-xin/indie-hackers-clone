import React, { ReactElement } from 'react';

import { DashboardLayout } from '@/features/layout/Dashboard';

const DashboardPage = () => {
  return <div>DashboardPage</div>;
};

export default DashboardPage;

DashboardPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
