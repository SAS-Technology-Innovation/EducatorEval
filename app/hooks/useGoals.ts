// Goals React Query Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import type {
  GoalTemplate,
  GoalType,
  UserGoal,
  UserGoalMilestone,
  UserGoalMeasurement,
  UserGoalReflection,
  GoalActivity
} from '../types';
import { useAuthStore } from '../stores/auth';

// ==================== Query Keys ====================

// Goal Template query keys
export const goalTemplateKeys = {
  all: ['goal-templates'] as const,
  lists: () => [...goalTemplateKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...goalTemplateKeys.lists(), filters] as const,
  details: () => [...goalTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalTemplateKeys.details(), id] as const,
};

// User Goal query keys
export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...goalKeys.lists(), filters] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  byUser: (userId: string) => [...goalKeys.all, 'user', userId] as const,
  byMentor: (mentorId: string) => [...goalKeys.all, 'mentor', mentorId] as const,
  bySupervisor: (supervisorId: string) => [...goalKeys.all, 'supervisor', supervisorId] as const,
  milestones: (goalId: string) => [...goalKeys.all, goalId, 'milestones'] as const,
  measurements: (goalId: string) => [...goalKeys.all, goalId, 'measurements'] as const,
  reflections: (goalId: string) => [...goalKeys.all, goalId, 'reflections'] as const,
  activity: (goalId: string) => [...goalKeys.all, goalId, 'activity'] as const,
};

// ==================== Goal Template Hooks ====================

// List goal templates with optional filters
export const useGoalTemplates = (filters?: {
  schoolId?: string;
  type?: GoalType;
  status?: 'active' | 'draft' | 'archived';
  applicableDivision?: string;
  limit?: number;
}) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: goalTemplateKeys.list(filters || {}),
    queryFn: () => goalsApi.templates.list(filters),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get active goal templates for the current user's context
export const useActiveGoalTemplates = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: goalTemplateKeys.list({ status: 'active', schoolId: user?.schoolId }),
    queryFn: () => goalsApi.templates.list({
      status: 'active',
      schoolId: user?.schoolId,
    }),
    enabled: !!user?.schoolId,
    staleTime: 1000 * 60 * 5,
  });
};

// Get single goal template by ID
export const useGoalTemplate = (templateId: string) => {
  return useQuery({
    queryKey: goalTemplateKeys.detail(templateId),
    queryFn: () => goalsApi.templates.getById(templateId),
    enabled: !!templateId,
    staleTime: 1000 * 60 * 5,
  });
};

// Create a new goal template (admin only)
export const useCreateGoalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<GoalTemplate>) => goalsApi.templates.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalTemplateKeys.all });
    },
  });
};

// Update a goal template (admin only)
export const useUpdateGoalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GoalTemplate> }) =>
      goalsApi.templates.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: goalTemplateKeys.all });
      queryClient.invalidateQueries({ queryKey: goalTemplateKeys.detail(id) });
    },
  });
};

// Delete a goal template (admin only)
export const useDeleteGoalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.templates.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalTemplateKeys.all });
    },
  });
};

// Archive a goal template (admin only)
export const useArchiveGoalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.templates.archive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: goalTemplateKeys.all });
      queryClient.invalidateQueries({ queryKey: goalTemplateKeys.detail(id) });
    },
  });
};

// Duplicate a goal template (admin only)
export const useDuplicateGoalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName?: string }) =>
      goalsApi.templates.duplicate(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalTemplateKeys.all });
    },
  });
};

// ==================== User Goal Hooks ====================

// List user goals with optional filters
export const useGoals = (filters?: {
  userId?: string;
  schoolId?: string;
  templateId?: string;
  type?: GoalType;
  status?: string;
  mentorId?: string;
  supervisorId?: string;
  limit?: number;
}) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: goalKeys.list(filters || {}),
    queryFn: () => goalsApi.goals.list(filters),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

// Get current user's goals
export const useMyGoals = (filters?: {
  type?: GoalType;
  status?: string;
  limit?: number;
}) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: goalKeys.byUser(user?.id || ''),
    queryFn: () => goalsApi.goals.list({
      userId: user?.id,
      ...filters,
    }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

// Get goals where current user is a mentor
export const useMenteeGoals = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: goalKeys.byMentor(user?.id || ''),
    queryFn: () => goalsApi.goals.list({ mentorId: user?.id }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
};

// Get goals where current user is a supervisor (for approval)
export const useSuperviseeGoals = (status?: string) => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: goalKeys.bySupervisor(user?.id || ''),
    queryFn: () => goalsApi.goals.list({
      supervisorId: user?.id,
      status,
    }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
};

// Get single goal by ID
export const useGoal = (goalId: string) => {
  return useQuery({
    queryKey: goalKeys.detail(goalId),
    queryFn: () => goalsApi.goals.getById(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 5,
  });
};

// Create a new goal from template
export const useCreateGoalFromTemplate = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ templateId, goalData }: { templateId: string; goalData: Partial<UserGoal> }) =>
      goalsApi.goals.createFromTemplate(templateId, user?.id || '', goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

// Update a goal
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserGoal> }) =>
      goalsApi.goals.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) });
    },
  });
};

// Delete a goal
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.goals.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

// Submit goal for approval
export const useSubmitGoal = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (goalId: string) =>
      goalsApi.goals.submit(goalId, user?.id || ''),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// Approve a goal
export const useApproveGoal = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (goalId: string) =>
      goalsApi.goals.approve(goalId, user?.id || ''),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// Reject a goal
export const useRejectGoal = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ goalId, reason }: { goalId: string; reason: string }) =>
      goalsApi.goals.reject(goalId, user?.id || '', reason),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// Complete a goal
export const useCompleteGoal = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (goalId: string) =>
      goalsApi.goals.complete(goalId, user?.id || ''),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// Update goal progress
export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ goalId, progress }: { goalId: string; progress: number }) =>
      goalsApi.goals.updateProgress(goalId, progress, user?.id || ''),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// ==================== Milestone Hooks ====================

// List milestones for a goal
export const useGoalMilestones = (goalId: string) => {
  return useQuery({
    queryKey: goalKeys.milestones(goalId),
    queryFn: () => goalsApi.milestones.list(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 3,
  });
};

// Create a milestone
export const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: Partial<UserGoalMilestone> }) =>
      goalsApi.milestones.create(goalId, data),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.milestones(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// Update a milestone
export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      milestoneId,
      data
    }: {
      goalId: string;
      milestoneId: string;
      data: Partial<UserGoalMilestone>
    }) => goalsApi.milestones.update(goalId, milestoneId, data),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.milestones(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// Complete a milestone
export const useCompleteMilestone = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ goalId, milestoneId }: { goalId: string; milestoneId: string }) =>
      goalsApi.milestones.complete(goalId, milestoneId, user?.id || ''),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.milestones(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.activity(goalId) });
    },
  });
};

// Delete a milestone
export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, milestoneId }: { goalId: string; milestoneId: string }) =>
      goalsApi.milestones.delete(goalId, milestoneId),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.milestones(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
    },
  });
};

// ==================== Measurement Hooks ====================

// List measurements for a goal
export const useGoalMeasurements = (goalId: string) => {
  return useQuery({
    queryKey: goalKeys.measurements(goalId),
    queryFn: () => goalsApi.measurements.list(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 3,
  });
};

// Create a measurement
export const useCreateMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: Partial<UserGoalMeasurement> }) =>
      goalsApi.measurements.create(goalId, data),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.measurements(goalId) });
    },
  });
};

// Add a measurement entry
export const useAddMeasurementEntry = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({
      goalId,
      measurementId,
      entry
    }: {
      goalId: string;
      measurementId: string;
      entry: { value: string | number; source: string; notes?: string }
    }) => goalsApi.measurements.addEntry(goalId, measurementId, entry, user?.id || ''),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.measurements(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.activity(goalId) });
    },
  });
};

// ==================== Reflection Hooks ====================

// List reflections for a goal
export const useGoalReflections = (goalId: string) => {
  return useQuery({
    queryKey: goalKeys.reflections(goalId),
    queryFn: () => goalsApi.reflections.list(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 3,
  });
};

// Create a reflection
export const useCreateReflection = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: Partial<UserGoalReflection> }) =>
      goalsApi.reflections.create(goalId, data, user?.id || ''),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.reflections(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.activity(goalId) });
    },
  });
};

// Update a reflection
export const useUpdateReflection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      reflectionId,
      data
    }: {
      goalId: string;
      reflectionId: string;
      data: Partial<UserGoalReflection>
    }) => goalsApi.reflections.update(goalId, reflectionId, data),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.reflections(goalId) });
    },
  });
};

// Delete a reflection
export const useDeleteReflection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, reflectionId }: { goalId: string; reflectionId: string }) =>
      goalsApi.reflections.delete(goalId, reflectionId),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.reflections(goalId) });
    },
  });
};

// ==================== Activity Hooks ====================

// List activity for a goal
export const useGoalActivity = (goalId: string, limit = 50) => {
  return useQuery({
    queryKey: goalKeys.activity(goalId),
    queryFn: () => goalsApi.activity.list(goalId, limit),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 2,
  });
};
