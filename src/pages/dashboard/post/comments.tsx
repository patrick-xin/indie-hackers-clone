import React, { ReactElement } from 'react';

import { DashboardLayout } from '@/features/layout/Dashboard';

const DashboardPostCommentsPage = () => {
  return <div>DashboardPostCommentsPage</div>;
};

export default DashboardPostCommentsPage;

DashboardPostCommentsPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
