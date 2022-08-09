import React, { ReactElement } from 'react';

import { DashboardLayout } from '@/features/layout/Dashboard';

const DashboardPostNotificationPage = () => {
  return <div>DashboardPostNotificationPage</div>;
};

export default DashboardPostNotificationPage;

DashboardPostNotificationPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
