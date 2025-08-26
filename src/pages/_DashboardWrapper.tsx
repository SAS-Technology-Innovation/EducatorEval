import React from 'react';
import { AdminProvider } from '../context/AdminContext';
import AdminDashboard from './_AdminDashboard';

const DashboardWrapper: React.FC = () => {
  return (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  );
};

export default DashboardWrapper;
