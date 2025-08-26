// src/context/AdminContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi';
import { DashboardStats, Observation } from '../types';

interface AdminContextType {
  dashboardData: {
    stats: DashboardStats;
    recentObservations: Observation[];
  } | null;
  loading: boolean;
  error: any;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<AdminContextType['dashboardData']>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData()
      .then(data => setDashboardData(data))
      .catch(setError)
      .then(() => setLoading(false));
  }, []);

  return (
    <AdminContext.Provider value={{ dashboardData, loading, error }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
