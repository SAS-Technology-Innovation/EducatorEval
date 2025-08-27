import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { frameworkApi } from '../api';
import { CRPFramework } from '../types/crp-observation';
import { useAuthStore } from '../stores/authStore';

export const useFrameworks = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['frameworks', user?.id],
    queryFn: () => frameworkApi.list(),
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes - frameworks change less frequently
  });
};

export const useFramework = (frameworkId: string) => {
  return useQuery({
    queryKey: ['framework', frameworkId],
    queryFn: () => frameworkApi.getById(frameworkId),
    enabled: !!frameworkId,
  });
};

export const useCreateFramework = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<CRPFramework, 'id' | 'createdAt' | 'updatedAt'>) => 
      frameworkApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] });
    },
  });
};

export const useUpdateFramework = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CRPFramework> }) => 
      frameworkApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] });
      queryClient.invalidateQueries({ queryKey: ['framework', id] });
    },
  });
};

export const useDeleteFramework = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => frameworkApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] });
    },
  });
};

// Get active frameworks only
export const useActiveFrameworks = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['active-frameworks', user?.id],
    queryFn: async () => {
      const frameworks = await frameworkApi.list();
      return frameworks.filter(f => f.status === 'active');
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });
};
