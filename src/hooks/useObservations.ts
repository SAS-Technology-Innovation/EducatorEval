import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationApi } from '../api';
import { CRPObservation } from '../types/crp-observation';
import { useAuthStore } from '../stores/authStore';

export const useObservations = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['observations', user?.id],
    queryFn: () => observationApi.list(),
    enabled: !!user,
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
