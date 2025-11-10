// React Query hooks for Firestore data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, organizationsService, schedulesService, observationsService, firestoreApi } from '../lib/api/firestore';
// Query Keys
export const queryKeys = {
    users: {
        all: ['users'],
        byId: (id) => ['users', id],
        byRole: (role) => ['users', 'role', role],
        bySchool: (schoolId) => ['users', 'school', schoolId],
        teachers: (schoolId) => ['users', 'teachers', schoolId],
    },
    organizations: {
        all: ['organizations'],
        byId: (id) => ['organizations', id],
        byType: (type) => ['organizations', 'type', type],
    },
    schedules: {
        all: ['schedules'],
        byId: (id) => ['schedules', id],
        byEducator: (educatorId) => ['schedules', 'educator', educatorId],
        bySchool: (schoolId) => ['schedules', 'school', schoolId],
    },
    observations: {
        all: ['observations'],
        byId: (id) => ['observations', id],
        bySubject: (subjectId) => ['observations', 'subject', subjectId],
        byObserver: (observerId) => ['observations', 'observer', observerId],
        bySchool: (schoolId) => ['observations', 'school', schoolId],
        recent: (limit) => ['observations', 'recent', limit],
    },
};
// ============================================================================
// USER HOOKS
// ============================================================================
export function useUsers() {
    return useQuery({
        queryKey: queryKeys.users.all,
        queryFn: () => usersService.getAll(),
    });
}
export function useUser(id) {
    return useQuery({
        queryKey: queryKeys.users.byId(id || ''),
        queryFn: () => (id ? usersService.getById(id) : null),
        enabled: !!id,
    });
}
export function useTeachers(schoolId) {
    return useQuery({
        queryKey: queryKeys.users.teachers(schoolId),
        queryFn: () => firestoreApi.users.getTeachers(schoolId),
    });
}
export function useUsersBySchool(schoolId) {
    return useQuery({
        queryKey: queryKeys.users.bySchool(schoolId),
        queryFn: () => firestoreApi.users.getBySchool(schoolId),
        enabled: !!schoolId,
    });
}
export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user) => usersService.create(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        },
    });
}
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => usersService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(variables.id) });
        },
    });
}
export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => usersService.delete(id),
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
        queryFn: () => organizationsService.getAll(),
    });
}
export function useOrganization(id) {
    return useQuery({
        queryKey: queryKeys.organizations.byId(id || ''),
        queryFn: () => (id ? organizationsService.getById(id) : null),
        enabled: !!id,
    });
}
export function useCreateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (org) => organizationsService.create(org),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
        },
    });
}
export function useUpdateOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => organizationsService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.byId(variables.id) });
        },
    });
}
export function useDeleteOrganization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => organizationsService.delete(id),
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
        queryFn: () => schedulesService.getAll(),
    });
}
export function useSchedule(id) {
    return useQuery({
        queryKey: queryKeys.schedules.byId(id || ''),
        queryFn: () => (id ? schedulesService.getById(id) : null),
        enabled: !!id,
    });
}
export function useEducatorSchedule(educatorId) {
    return useQuery({
        queryKey: queryKeys.schedules.byEducator(educatorId || ''),
        queryFn: () => (educatorId ? firestoreApi.schedules.getByEducator(educatorId) : null),
        enabled: !!educatorId,
    });
}
export function useCreateSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (schedule) => schedulesService.create(schedule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
        },
    });
}
export function useUpdateSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => schedulesService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.schedules.byId(variables.id) });
        },
    });
}
// ============================================================================
// OBSERVATION HOOKS
// ============================================================================
export function useObservationsBySchool(schoolId) {
    return useQuery({
        queryKey: queryKeys.observations.bySchool(schoolId || ''),
        queryFn: () => (schoolId ? firestoreApi.observations.getBySchool(schoolId) : []),
        enabled: !!schoolId,
    });
}
export function useObservationsBySubject(subjectId) {
    return useQuery({
        queryKey: queryKeys.observations.bySubject(subjectId || ''),
        queryFn: () => (subjectId ? firestoreApi.observations.getBySubject(subjectId) : []),
        enabled: !!subjectId,
    });
}
export function useObservationsByObserver(observerId) {
    return useQuery({
        queryKey: queryKeys.observations.byObserver(observerId || ''),
        queryFn: () => (observerId ? firestoreApi.observations.getByObserver(observerId) : []),
        enabled: !!observerId,
    });
}
export function useRecentObservations(limit = 10) {
    return useQuery({
        queryKey: queryKeys.observations.recent(limit),
        queryFn: () => firestoreApi.observations.getRecent(limit),
    });
}
export function useCreateObservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (observation) => observationsService.create(observation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.observations.all });
        },
    });
}
export function useUpdateObservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => observationsService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.observations.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.observations.byId(variables.id) });
        },
    });
}
export function useDeleteObservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => observationsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.observations.all });
        },
    });
}
