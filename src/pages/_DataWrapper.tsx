import React from 'react';
import { AdminProvider } from '../context/AdminContext';
import { DataProvider } from '../context/DataContext';
import DataManagement from './_DataManagement';

const DataWrapper: React.FC = () => {
  return (
    <AdminProvider>
      <DataProvider>
        <DataManagement />
      </DataProvider>
    </AdminProvider>
  );
};

export default DataWrapper;
