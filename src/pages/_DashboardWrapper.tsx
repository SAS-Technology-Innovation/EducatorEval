import React from 'react';
import { AdminProvider } from '../context/AdminContext';
import AdminDashboard from './_AdminDashboard';
import PageWrapper from '../components/PageWrapper';

const DashboardWrapper: React.FC = () => {
  return (
    <AdminProvider>
      <PageWrapper 
        title="Dashboard" 
        subtitle="Overview of observation activities and progress"
      >
        <AdminDashboard />
      </PageWrapper>
    </AdminProvider>
  );
};

export default DashboardWrapper;
