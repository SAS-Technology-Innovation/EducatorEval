// Firestore API Layer - Re-exports from centralized firestore service
// This provides typed wrappers around the base FirestoreService for React Query hooks

import type {
  User,
  Organization,
  EducatorSchedule,
  Observation
} from '../../types';

// Re-export the base service and instances from the central location
export {
  FirestoreService,
  usersService,
  organizationsService,
  schoolsService,
  divisionsService,
  departmentsService,
  observationsService,
  schedulesService,
  frameworksService,
  firestoreQueries
} from '../firestore';

// Import for type-safe wrappers
import {
  usersService as baseUsersService,
  organizationsService as baseOrganizationsService,
  observationsService as baseObservationsService,
  schedulesService as baseSchedulesService,
} from '../firestore';

// Specialized queries for common use cases (typed)
export const firestoreApi = {
  // Users
  users: {
    getByEmail: async (email: string): Promise<User | null> => {
      const results = await baseUsersService.list({
        where: [['email', '==', email]]
      });
      return results.length > 0 ? results[0] as User : null;
    },

    getByRole: async (role: string): Promise<User[]> => {
      const results = await baseUsersService.list({
        where: [
          ['primaryRole', '==', role],
          ['isActive', '==', true]
        ]
      });
      return results as User[];
    },

    getBySchool: async (schoolId: string): Promise<User[]> => {
      const results = await baseUsersService.list({
        where: [
          ['schoolId', '==', schoolId],
          ['isActive', '==', true]
        ]
      });
      return results as User[];
    },

    getTeachers: async (schoolId?: string): Promise<User[]> => {
      const filters: [string, any, any][] = [
        ['isActive', '==', true]
      ];

      if (schoolId) {
        filters.push(['schoolId', '==', schoolId]);
      }

      const allUsers = await baseUsersService.list({ where: filters });

      // Filter for educator roles (teachers)
      return (allUsers as User[]).filter(user =>
        user.primaryRole === 'educator' ||
        user.secondaryRoles?.includes('educator')
      );
    },

    getByDivision: async (divisionId: string): Promise<User[]> => {
      const results = await baseUsersService.list({
        where: [
          ['divisionId', '==', divisionId],
          ['isActive', '==', true]
        ]
      });
      return results as User[];
    },

    getByDepartment: async (departmentId: string): Promise<User[]> => {
      const results = await baseUsersService.list({
        where: [
          ['primaryDepartmentId', '==', departmentId],
          ['isActive', '==', true]
        ]
      });
      return results as User[];
    }
  },

  // Organizations
  organizations: {
    getByType: async (type: 'district' | 'school' | 'charter' | 'private'): Promise<Organization[]> => {
      const results = await baseOrganizationsService.list({
        where: [['type', '==', type]]
      });
      return results as Organization[];
    }
  },

  // Schedules
  schedules: {
    getByEducator: async (educatorId: string): Promise<EducatorSchedule | null> => {
      const results = await baseSchedulesService.list({
        where: [['educatorId', '==', educatorId]],
        limit: 1
      });
      return results.length > 0 ? results[0] as EducatorSchedule : null;
    },

    getBySchool: async (schoolId: string): Promise<EducatorSchedule[]> => {
      const results = await baseSchedulesService.list({
        where: [['schoolId', '==', schoolId]]
      });
      return results as EducatorSchedule[];
    },

    getAll: async (): Promise<EducatorSchedule[]> => {
      const results = await baseSchedulesService.list();
      return results as EducatorSchedule[];
    }
  },

  // Observations
  observations: {
    getBySubject: async (subjectId: string): Promise<Observation[]> => {
      const results = await baseObservationsService.list({
        where: [['subjectId', '==', subjectId]],
        orderBy: ['createdAt', 'desc']
      });
      return results as Observation[];
    },

    getByObserver: async (observerId: string): Promise<Observation[]> => {
      const results = await baseObservationsService.list({
        where: [['observerId', '==', observerId]],
        orderBy: ['createdAt', 'desc']
      });
      return results as Observation[];
    },

    getBySchool: async (schoolId: string): Promise<Observation[]> => {
      const results = await baseObservationsService.list({
        where: [['schoolId', '==', schoolId]],
        orderBy: ['createdAt', 'desc']
      });
      return results as Observation[];
    },

    getRecent: async (limitCount: number = 10): Promise<Observation[]> => {
      const results = await baseObservationsService.list({
        orderBy: ['createdAt', 'desc'],
        limit: limitCount
      });
      return results as Observation[];
    }
  }
};

export default firestoreApi;
