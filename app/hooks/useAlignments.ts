// Framework Alignments React Query Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alignmentsApi } from '../api/alignments';
import type { FrameworkAlignment, DivisionType } from '../types';
import { useAuthStore } from '../stores/auth';

// Query keys factory
export const alignmentKeys = {
  all: ['alignments'] as const,
  lists: () => [...alignmentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...alignmentKeys.lists(), filters] as const,
  details: () => [...alignmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...alignmentKeys.details(), id] as const,
  categories: () => [...alignmentKeys.all, 'categories'] as const,
  byCategory: (category: string) => [...alignmentKeys.all, 'category', category] as const,
};

// List all alignments with optional filters
export const useAlignments = (filters?: {
  category?: string;
  applicableType?: string;
  applicableDivision?: DivisionType;
}) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: alignmentKeys.list(filters || {}),
    queryFn: () => alignmentsApi.list(filters),
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes - alignments rarely change
  });
};

// Get single alignment by ID
export const useAlignment = (alignmentId: string) => {
  return useQuery({
    queryKey: alignmentKeys.detail(alignmentId),
    queryFn: () => alignmentsApi.getById(alignmentId),
    enabled: !!alignmentId,
    staleTime: 1000 * 60 * 10,
  });
};

// Get alignments by category
export const useAlignmentsByCategory = (category: string) => {
  return useQuery({
    queryKey: alignmentKeys.byCategory(category),
    queryFn: () => alignmentsApi.getByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 10,
  });
};

// Get unique categories
export const useAlignmentCategories = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: alignmentKeys.categories(),
    queryFn: () => alignmentsApi.getCategories(),
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });
};

// Create a new alignment (admin only)
export const useCreateAlignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<FrameworkAlignment, 'id'>) =>
      alignmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alignmentKeys.all });
    },
  });
};

// Update an alignment (admin only)
export const useUpdateAlignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FrameworkAlignment> }) =>
      alignmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: alignmentKeys.all });
      queryClient.invalidateQueries({ queryKey: alignmentKeys.detail(id) });
    },
  });
};

// Delete an alignment (admin only)
export const useDeleteAlignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alignmentKeys.all });
    },
  });
};

// Seed default alignments (admin only)
export const useSeedAlignments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alignmentsApi.seedDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alignmentKeys.all });
    },
  });
};

// Hook to get alignments with fallback to hardcoded values
export const useAlignmentsWithFallback = (filters?: {
  category?: string;
  applicableType?: string;
  applicableDivision?: DivisionType;
}) => {
  const { data: dbAlignments = [], isLoading, error } = useAlignments(filters);

  // If database has alignments, use them
  if (dbAlignments.length > 0) {
    return { data: dbAlignments, isLoading, error, source: 'database' as const };
  }

  // Fallback to hardcoded values during loading or if DB is empty
  // This ensures the app still works even before seeding
  const { CRPFrameworkAlignments } = require('../types/observation');
  let fallbackAlignments = Object.values(CRPFrameworkAlignments) as FrameworkAlignment[];

  // Apply filters to fallback data
  if (filters?.category) {
    fallbackAlignments = fallbackAlignments.filter(a => a.category === filters.category);
  }
  if (filters?.applicableType) {
    fallbackAlignments = fallbackAlignments.filter(a =>
      a.applicableTypes.includes(filters.applicableType!)
    );
  }
  if (filters?.applicableDivision) {
    fallbackAlignments = fallbackAlignments.filter(a =>
      a.applicableDivisions.includes(filters.applicableDivision!)
    );
  }

  return {
    data: fallbackAlignments,
    isLoading,
    error,
    source: 'fallback' as const
  };
};
