import React from 'react';
import { AdminProvider } from '../context/AdminContext';
import { DataProvider } from '../context/DataContext';
import DataManagement from './_DataManagement';
import PageWrapper from '../components/PageWrapper';

const DataWrapper: React.FC = () => {
  return (
    <AdminProvider>
      <DataProvider>
        <PageWrapper 
          title="Data Management" 
          subtitle="Export and analyze observation data"
        >
          <DataManagement />
        </PageWrapper>
      </DataProvider>
    </AdminProvider>
  );
};

export default DataWrapper;
