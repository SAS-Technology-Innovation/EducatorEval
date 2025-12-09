// Observation React Query Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationsApi } from '../api/observations';
import type { Observation } from '../types';
import { useAuthStore } from '../stores/auth';

// Query keys factory for consistent cache management
export const observationKeys = {
  all: ['observations'] as const,
  lists: () => [...observationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...observationKeys.lists(), filters] as const,
  details: () => [...observationKeys.all, 'detail'] as const,
  detail: (id: string) => [...observationKeys.details(), id] as const,
  drafts: (observerId: string) => [...observationKeys.all, 'drafts', observerId] as const,
  bySubject: (subjectId: string) => [...observationKeys.all, 'subject', subjectId] as const,
  byObserver: (observerId: string) => [...observationKeys.all, 'observer', observerId] as const,
};

// List observations with optional filters
export const useObservations = (filters?: {
  schoolId?: string;
  divisionId?: string;
  observerId?: string;
  subjectId?: string;
  status?: 'draft' | 'completed' | 'submitted' | 'reviewed';
  limit?: number;
}) => {
  const user = useAuthStore(state => state.user);
  const isBrowser = typeof window !== 'undefined';

  return useQuery({
    queryKey: observationKeys.list(filters || {}),
    queryFn: () => observationsApi.observations.list(filters),
    enabled: isBrowser && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single observation by ID
export const useObservation = (observationId: string) => {
  return useQuery({
    queryKey: observationKeys.detail(observationId),
    queryFn: () => observationsApi.observations.getById(observationId),
    enabled: !!observationId,
    staleTime: 1000 * 60 * 5,
  });
};

// Get observations for a specific subject (teacher)
export const useSubjectObservations = (subjectId: string, limit?: number) => {
  return useQuery({
    queryKey: observationKeys.bySubject(subjectId),
    queryFn: () => observationsApi.observations.getBySubject(subjectId, limit),
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5,
  });
};

// Get observations by an observer
export const useObserverObservations = (observerId: string, limit?: number) => {
  return useQuery({
    queryKey: observationKeys.byObserver(observerId),
    queryFn: () => observationsApi.observations.getByObserver(observerId, limit),
    enabled: !!observerId,
    staleTime: 1000 * 60 * 5,
  });
};

// Get draft observations for the current user
export const useDraftObservations = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: observationKeys.drafts(user?.id || ''),
    queryFn: () => observationsApi.observations.getDrafts(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes for drafts
  });
};

// Create a new observation
export const useCreateObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Observation>) =>
      observationsApi.observations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
    },
  });
};

// Create observation with schedule auto-population
export const useCreateObservationWithSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      subjectId: string;
      observerId: string;
      observerName: string;
      frameworkId: string;
      frameworkName: string;
      schoolId: string;
      date?: Date;
    }) => observationsApi.observations.createWithSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
    },
  });
};

// Update an observation
export const useUpdateObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Observation> }) =>
      observationsApi.observations.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
      queryClient.invalidateQueries({ queryKey: observationKeys.detail(id) });
    },
  });
};

// Save observation as draft
export const useSaveDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Observation> }) =>
      observationsApi.observations.saveDraft(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
      queryClient.invalidateQueries({ queryKey: observationKeys.detail(id) });
    },
  });
};

// Complete an observation (mark as completed but not submitted)
export const useCompleteObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: Partial<Observation> }) =>
      observationsApi.observations.complete(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
      queryClient.invalidateQueries({ queryKey: observationKeys.detail(id) });
    },
  });
};

// Submit observation for review
export const useSubmitObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      observationsApi.observations.submit(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
      queryClient.invalidateQueries({ queryKey: observationKeys.detail(id) });
    },
  });
};

// Mark observation as reviewed
export const useReviewObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback?: string }) =>
      observationsApi.observations.review(id, feedback),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
      queryClient.invalidateQueries({ queryKey: observationKeys.detail(id) });
    },
  });
};

// Delete an observation
export const useDeleteObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hardDelete = false }: { id: string; hardDelete?: boolean }) =>
      observationsApi.observations.delete(id, hardDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: observationKeys.all });
    },
  });
};

// Analytics hooks
export const useObservationStats = (filters?: {
  schoolId?: string;
  divisionId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['observation-stats', filters],
    queryFn: () => observationsApi.analytics.getDashboardStats(filters),
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCRPStats = (filters?: {
  schoolId?: string;
  divisionId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['crp-stats', filters],
    queryFn: () => observationsApi.analytics.getCRPStats(filters),
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });
};

export const useObservationTrends = (filters?: {
  schoolId?: string;
  divisionId?: string;
  months?: number;
}) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['observation-trends', filters],
    queryFn: () => observationsApi.analytics.getObservationTrends(filters),
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });
};
