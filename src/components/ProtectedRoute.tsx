import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { shouldUseMockData } from '../services/mockData';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [bypassAuth, setBypassAuth] = useState(false);

  useEffect(() => {
    // Check if we came from demo login
    const urlParams = new URLSearchParams(window.location.search);
    const isDemoLogin = urlParams.get('demo') === 'true' || 
                       sessionStorage.getItem('demoLogin') === 'true';
    
    if (isDemoLogin || shouldUseMockData()) {
      setBypassAuth(true);
      // Set demo login flag in session storage
      sessionStorage.setItem('demoLogin', 'true');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Allow access if user is authenticated OR if using demo/mock mode
  if (!user && !bypassAuth) {
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
