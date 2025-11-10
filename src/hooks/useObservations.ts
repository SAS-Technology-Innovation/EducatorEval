import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationApi } from '../api';
import { observationsApi } from '../api/observations';
import type { Observation } from '../types';
import { useAuthStore } from '../stores/auth';

export const useObservations = (schoolId?: string) => {
  const user = useAuthStore(state => state.user);

  // Check if we're in the browser
  const isBrowser = typeof window !== 'undefined';

  return useQuery({
    queryKey: ['observations', schoolId || user?.id],
    queryFn: () => observationsApi.observations.list({ schoolId }),
    enabled: isBrowser && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useObservation = (observationId: string) => {
  return useQuery({
    queryKey: ['observation', observationId],
    queryFn: () => observationApi.getById(observationId),
    enabled: !!observationId,
  });
};

export const useCreateObservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<CRPObservation, 'id' | 'createdAt' | 'updatedAt'>) => 
      observationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    },
  });
};

export const useUpdateObservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CRPObservation> }) => 
      observationApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      queryClient.invalidateQueries({ queryKey: ['observation', id] });
    },
  });
};

export const useDeleteObservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => observationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    },
  });
};

export const useObservationSubscription = (observationId: string, callback: (observation: CRPObservation) => void) => {
  return useQuery({
    queryKey: ['observation-subscription', observationId],
    queryFn: () => {
      const unsubscribe = observationApi.subscribe(observationId, callback);
      return unsubscribe;
    },
    enabled: !!observationId,
  });
};
