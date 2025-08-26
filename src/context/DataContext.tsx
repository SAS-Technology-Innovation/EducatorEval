// src/context/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchData } from '../api/dataApi';
import { ProcessingJob, ApiConnection } from '../types';

interface DataContextType {
  data: {
    processingJobs: ProcessingJob[];
    apiConnections: ApiConnection[];
  } | null;
  loading: boolean;
  error: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<DataContextType['data']>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .then(() => setLoading(false));
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
