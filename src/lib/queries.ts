// React Query Configuration and Hooks
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { observationApi, frameworkApi, analyticsApi } from '../lib/api';
import type { CRPObservation, CRPFramework } from '../types';

// Create React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3
    }
  }
});

// Query Provider Component
interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// CRP Observation Hooks
export function useObservations(filters?: {
  organizationId?: string;
  teacherId?: string;
  observerId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['observations', filters],
    queryFn: () => observationApi.list(filters),
    enabled: !!filters?.organizationId
  });
}

export function useObservation(id: string) {
  return useQuery({
    queryKey: ['observation', id],
    queryFn: () => observationApi.getById(id),
    enabled: !!id
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (observation: Partial<CRPObservation>) => 
      observationApi.create(observation),
    onSuccess: () => {
      // Invalidate and refetch observations
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    }
  });
}

export function useUpdateObservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CRPObservation> }) =>
      observationApi.update(id, updates),
    onSuccess: (_, { id }) => {
      // Invalidate specific observation and list
      queryClient.invalidateQueries({ queryKey: ['observation', id] });
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    }
  });
}

export function useDeleteObservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => observationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    }
  });
}

// Framework Hooks
export function useFrameworks() {
  return useQuery({
    queryKey: ['frameworks'],
    queryFn: () => frameworkApi.list()
  });
}

export function useFramework(id: string) {
  return useQuery({
    queryKey: ['framework', id],
    queryFn: () => frameworkApi.getById(id),
    enabled: !!id
  });
}

export function useCreateFramework() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (framework: Partial<CRPFramework>) => 
      frameworkApi.create(framework),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] });
    }
  });
}

export function useUpdateFramework() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CRPFramework> }) =>
      frameworkApi.update(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['framework', id] });
      queryClient.invalidateQueries({ queryKey: ['frameworks'] });
    }
  });
}

// Analytics Hooks
export function useDashboardData(orgId: string) {
  return useQuery({
    queryKey: ['dashboard', orgId],
    queryFn: () => analyticsApi.getDashboardData(orgId),
    enabled: !!orgId,
    refetchInterval: 1000 * 60 * 5 // Refetch every 5 minutes
  });
}

export function useCRPMetrics(orgId: string) {
  return useQuery({
    queryKey: ['crp-metrics', orgId],
    queryFn: () => analyticsApi.getCRPMetrics(orgId),
    enabled: !!orgId,
    refetchInterval: 1000 * 60 * 10 // Refetch every 10 minutes
  });
}
