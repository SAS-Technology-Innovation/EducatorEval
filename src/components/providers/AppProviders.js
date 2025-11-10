import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthWrapper from './AuthWrapper';
export const AppProviders = ({ children, requireAuth = true, requireRoles, requirePermissions }) => {
    // Create a client inside the component to avoid stale references
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    }));
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthWrapper, { requireAuth: requireAuth, requireRoles: requireRoles, requirePermissions: requirePermissions, children: children }) }));
};
export default AppProviders;
