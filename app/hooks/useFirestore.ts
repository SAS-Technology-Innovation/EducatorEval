// React Query hooks for Firestore data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  usersService,
  organizationsService,
  schedulesService,
  observationsService,
  firestoreApi
} from '../lib/api/firestore';
import type { User, Organization, EducatorSchedule, Observation } from '../types';

// Query Keys
export const queryKeys = {
  users: {
    all: ['users'] as const,
    byId: (id: string) => ['users', id] as const,
    byRole: (role: string) => ['users', 'role', role] as const,
    bySchool: (schoolId: string) => ['users', 'school', schoolId] as const,
    teachers: (schoolId?: string) => ['users', 'teachers', schoolId] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    byId: (id: string) => ['organizations', id] as const,
    byType: (type: string) => ['organizations', 'type', type] as const,
  },
  schedules: {
    all: ['schedules'] as const,
    byId: (id: string) => ['schedules', id] as const,
    byEducator: (educatorId: string) => ['schedules', 'educator', educatorId] as const,
    bySchool: (schoolId: string) => ['schedules', 'school', schoolId] as const,
  },
  observations: {
    all: ['observations'] as const,
    byId: (id: string) => ['observations', id] as const,
    bySubject: (subjectId: string) => ['observations', 'subject', subjectId] as const,
    byObserver: (observerId: string) => ['observations', 'observer', observerId] as const,
    bySchool: (schoolId: string) => ['observations', 'school', schoolId] as const,
    recent: (limit: number) => ['observations', 'recent', limit] as const,
  },
};

// ============================================================================
// USER HOOKS
// ============================================================================

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => usersService.list(),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.byId(id || ''),
    queryFn: () => (id ? usersService.getById(id) : null),
    enabled: !!id,
  });
}

export function useTeachers(schoolId?: string) {
  return useQuery({
    queryKey: queryKeys.users.teachers(schoolId),
    queryFn: () => firestoreApi.users.getTeachers(schoolId),
  });
}

export function useUsersBySchool(schoolId: string) {
  return useQuery({
    queryKey: queryKeys.users.bySchool(schoolId),
    queryFn: () => firestoreApi.users.getBySchool(schoolId),
    enabled: !!schoolId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
      usersService.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

// ============================================================================
// ORGANIZATION HOOKS
// ============================================================================

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => organizationsService.list(),
  });
}

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.organizations.byId(id || ''),
    queryFn: () => (id ? organizationsService.getById(id) : null),
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>) =>
      organizationsService.create(org),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organization> }) =>
      organizationsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.byId(variables.id) });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}

// ============================================================================
// SCHEDULE HOOKS
// ============================================================================

export function useSchedules() {
  return useQuery({
    queryKey: queryKeys.schedules.all,
    queryFn: () => schedulesService.list(),
  });
}

export function useSchedule(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.schedules.byId(id || ''),
    queryFn: () => (id ? schedulesService.getById(id) : null),
    enabled: !!id,
  });
}

export function useEducatorSchedule(educatorId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.schedules.byEducator(educatorId || ''),
    queryFn: () => (educatorId ? firestoreApi.schedules.getByEducator(educatorId) : null),
    enabled: !!educatorId,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: Omit<EducatorSchedule, 'id' | 'createdAt' | 'updatedAt'>) =>
      schedulesService.create(schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EducatorSchedule> }) =>
      schedulesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.byId(variables.id) });
    },
  });
}

// ============================================================================
// OBSERVATION HOOKS
// ============================================================================

export function useObservationsBySchool(schoolId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.observations.bySchool(schoolId || ''),
    queryFn: () => (schoolId ? firestoreApi.observations.getBySchool(schoolId) : []),
    enabled: !!schoolId,
  });
}

export function useObservationsBySubject(subjectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.observations.bySubject(subjectId || ''),
    queryFn: () => (subjectId ? firestoreApi.observations.getBySubject(subjectId) : []),
    enabled: !!subjectId,
  });
}

export function useObservationsByObserver(observerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.observations.byObserver(observerId || ''),
    queryFn: () => (observerId ? firestoreApi.observations.getByObserver(observerId) : []),
    enabled: !!observerId,
  });
}

export function useRecentObservations(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.observations.recent(limit),
    queryFn: () => firestoreApi.observations.getRecent(limit),
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (observation: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>) =>
      observationsService.create(observation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.observations.all });
    },
  });
}

export function useUpdateObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Observation> }) =>
      observationsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.observations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.observations.byId(variables.id) });
    },
  });
}

export function useDeleteObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => observationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.observations.all });
    },
  });
}
