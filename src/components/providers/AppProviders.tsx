import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthWrapper from './AuthWrapper';

interface AppProvidersProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: string[];
}

export const AppProviders: React.FC<AppProvidersProps> = ({
  children,
  requireAuth = true,
  requireRoles,
  requirePermissions
}) => {
  // Create a client inside the component to avoid stale references
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper
        requireAuth={requireAuth}
        requireRoles={requireRoles}
        requirePermissions={requirePermissions}
      >
        {children}
      </AuthWrapper>
    </QueryClientProvider>
  );
};

export default AppProviders;
