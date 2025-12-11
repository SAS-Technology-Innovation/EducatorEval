// Core Platform API Client - Direct Firestore Operations
// Refactored to use Firestore directly instead of non-existent API endpoints

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  writeBatch,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User, UserRole, Organization, School, Division, Department, EducatorSchedule, ClassAssignment } from '../types';

// Get environment-based collection prefix
const getCollectionPrefix = (): string => {
  const env = import.meta.env.VITE_ENVIRONMENT || 'staging';
  return env === 'production' ? '' : 'staging_';
};

// Get prefixed collection name
const getCollection = (name: string): string => `${getCollectionPrefix()}${name}`;

// Convert Firestore timestamp to Date
const toDate = (timestamp: unknown): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  return undefined;
};

// User filters interface
interface UserFilters {
  schoolId?: string;
  divisionId?: string;
  departmentId?: string;
  role?: UserRole;
  isActive?: boolean;
  limit?: number;
  email?: string;
}

// Schedule filters interface
interface ScheduleFilters {
  educatorId?: string;
  schoolId?: string;
  academicYear?: string;
  isActive?: boolean;
}

export const coreApi = {
  // User management - Direct Firestore operations
  users: {
    list: async (filters?: UserFilters): Promise<User[]> => {
      const constraints: QueryConstraint[] = [];

      if (filters?.schoolId) {
        constraints.push(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        constraints.push(where('divisionId', '==', filters.divisionId));
      }
      if (filters?.departmentId) {
        constraints.push(where('departmentIds', 'array-contains', filters.departmentId));
      }
      if (filters?.role) {
        constraints.push(where('primaryRole', '==', filters.role));
      }
      if (filters?.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }

      // Add ordering
      constraints.push(orderBy('lastName'));
      constraints.push(orderBy('firstName'));

      if (filters?.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, getCollection('users')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
        lastLogin: toDate(doc.data().lastLogin),
      })) as User[];
    },

    getById: async (id: string): Promise<User | null> => {
      const docRef = doc(db, getCollection('users'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          lastLogin: toDate(data.lastLogin),
        } as User;
      }
      return null;
    },

    getByEmail: async (email: string): Promise<User | null> => {
      const q = query(
        collection(db, getCollection('users')),
        where('email', '==', email.toLowerCase()),
        firestoreLimit(1)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          lastLogin: toDate(data.lastLogin),
        } as User;
      }
      return null;
    },

    create: async (userData: Partial<User>): Promise<User> => {
      const now = Timestamp.now();
      const newUser = {
        ...userData,
        email: userData.email?.toLowerCase(),
        isActive: userData.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('users')), newUser);
      const created = await coreApi.users.getById(docRef.id);
      if (!created) throw new Error('Failed to create user');
      return created;
    },

    update: async (id: string, updates: Partial<User>): Promise<User> => {
      const docRef = doc(db, getCollection('users'), id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(docRef, updateData);
      const updated = await coreApi.users.getById(id);
      if (!updated) throw new Error('User not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      const docRef = doc(db, getCollection('users'), id);
      await deleteDoc(docRef);
      return { success: true };
    },

    getTeachers: async (filters?: { schoolId?: string; divisionId?: string; isActive?: boolean }): Promise<User[]> => {
      const constraints: QueryConstraint[] = [
        where('primaryRole', 'in', ['educator', 'observer']),
      ];

      if (filters?.schoolId) {
        constraints.push(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        constraints.push(where('divisionId', '==', filters.divisionId));
      }
      if (filters?.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }

      constraints.push(orderBy('lastName'));
      constraints.push(orderBy('firstName'));

      const q = query(collection(db, getCollection('users')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as User[];
    },

    updateRole: async (id: string, roleData: { role: UserRole; secondaryRoles?: UserRole[] }): Promise<User> => {
      return coreApi.users.update(id, {
        primaryRole: roleData.role,
        secondaryRoles: roleData.secondaryRoles || [],
      });
    },

    // Batch update multiple users
    batchUpdate: async (updates: { id: string; data: Partial<User> }[]): Promise<void> => {
      const batch = writeBatch(db);
      const now = Timestamp.now();

      updates.forEach(({ id, data }) => {
        const docRef = doc(db, getCollection('users'), id);
        batch.update(docRef, { ...data, updatedAt: now });
      });

      await batch.commit();
    },
  },

  // Organization management
  organizations: {
    list: async (filters?: { type?: string }): Promise<Organization[]> => {
      const constraints: QueryConstraint[] = [orderBy('name')];

      if (filters?.type) {
        constraints.unshift(where('type', '==', filters.type));
      }

      const q = query(collection(db, getCollection('organizations')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as Organization[];
    },

    getById: async (id: string): Promise<Organization | null> => {
      const docRef = doc(db, getCollection('organizations'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: toDate(docSnap.data().createdAt),
          updatedAt: toDate(docSnap.data().updatedAt),
        } as Organization;
      }
      return null;
    },

    create: async (orgData: Partial<Organization>): Promise<Organization> => {
      const now = Timestamp.now();
      const newOrg = {
        ...orgData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('organizations')), newOrg);
      const created = await coreApi.organizations.getById(docRef.id);
      if (!created) throw new Error('Failed to create organization');
      return created;
    },

    update: async (id: string, updates: Partial<Organization>): Promise<Organization> => {
      const docRef = doc(db, getCollection('organizations'), id);
      await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
      const updated = await coreApi.organizations.getById(id);
      if (!updated) throw new Error('Organization not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('organizations'), id));
      return { success: true };
    },
  },

  // School management
  schools: {
    list: async (filters?: { organizationId?: string; type?: string }): Promise<School[]> => {
      const constraints: QueryConstraint[] = [orderBy('name')];

      if (filters?.organizationId) {
        constraints.unshift(where('organizationId', '==', filters.organizationId));
      }
      if (filters?.type) {
        constraints.unshift(where('type', '==', filters.type));
      }

      const q = query(collection(db, getCollection('schools')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as School[];
    },

    getById: async (id: string): Promise<School | null> => {
      const docRef = doc(db, getCollection('schools'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: toDate(docSnap.data().createdAt),
          updatedAt: toDate(docSnap.data().updatedAt),
        } as School;
      }
      return null;
    },

    create: async (schoolData: Partial<School>): Promise<School> => {
      const now = Timestamp.now();
      const newSchool = {
        ...schoolData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('schools')), newSchool);
      const created = await coreApi.schools.getById(docRef.id);
      if (!created) throw new Error('Failed to create school');
      return created;
    },

    update: async (id: string, updates: Partial<School>): Promise<School> => {
      const docRef = doc(db, getCollection('schools'), id);
      await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
      const updated = await coreApi.schools.getById(id);
      if (!updated) throw new Error('School not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('schools'), id));
      return { success: true };
    },
  },

  // Division management
  divisions: {
    list: async (filters?: { schoolId?: string; type?: string }): Promise<Division[]> => {
      const constraints: QueryConstraint[] = [orderBy('name')];

      if (filters?.schoolId) {
        constraints.unshift(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.type) {
        constraints.unshift(where('type', '==', filters.type));
      }

      const q = query(collection(db, getCollection('divisions')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as Division[];
    },

    getById: async (id: string): Promise<Division | null> => {
      const docRef = doc(db, getCollection('divisions'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: toDate(docSnap.data().createdAt),
          updatedAt: toDate(docSnap.data().updatedAt),
        } as Division;
      }
      return null;
    },

    create: async (divisionData: Partial<Division>): Promise<Division> => {
      const now = Timestamp.now();
      const newDivision = {
        ...divisionData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('divisions')), newDivision);
      const created = await coreApi.divisions.getById(docRef.id);
      if (!created) throw new Error('Failed to create division');
      return created;
    },

    update: async (id: string, updates: Partial<Division>): Promise<Division> => {
      const docRef = doc(db, getCollection('divisions'), id);
      await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
      const updated = await coreApi.divisions.getById(id);
      if (!updated) throw new Error('Division not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('divisions'), id));
      return { success: true };
    },
  },

  // Department management
  departments: {
    list: async (filters?: { schoolId?: string; divisionId?: string }): Promise<Department[]> => {
      const constraints: QueryConstraint[] = [orderBy('name')];

      if (filters?.schoolId) {
        constraints.unshift(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        constraints.unshift(where('divisionId', '==', filters.divisionId));
      }

      const q = query(collection(db, getCollection('departments')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as Department[];
    },

    getById: async (id: string): Promise<Department | null> => {
      const docRef = doc(db, getCollection('departments'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: toDate(docSnap.data().createdAt),
          updatedAt: toDate(docSnap.data().updatedAt),
        } as Department;
      }
      return null;
    },

    create: async (deptData: Partial<Department>): Promise<Department> => {
      const now = Timestamp.now();
      const newDept = {
        ...deptData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('departments')), newDept);
      const created = await coreApi.departments.getById(docRef.id);
      if (!created) throw new Error('Failed to create department');
      return created;
    },

    update: async (id: string, updates: Partial<Department>): Promise<Department> => {
      const docRef = doc(db, getCollection('departments'), id);
      await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
      const updated = await coreApi.departments.getById(id);
      if (!updated) throw new Error('Department not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('departments'), id));
      return { success: true };
    },
  },

  // Schedule management - Direct Firestore operations (replacing non-existent API endpoints)
  schedules: {
    // Get educator's schedule
    getByEducatorId: async (educatorId: string, filters?: { academicYear?: string; isActive?: boolean }): Promise<EducatorSchedule | null> => {
      const constraints: QueryConstraint[] = [where('educatorId', '==', educatorId)];

      if (filters?.academicYear) {
        constraints.push(where('academicYear', '==', filters.academicYear));
      }
      if (filters?.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }

      constraints.push(firestoreLimit(1));

      const q = query(collection(db, getCollection('schedules')), ...constraints);
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: toDate(doc.data().createdAt),
          updatedAt: toDate(doc.data().updatedAt),
        } as EducatorSchedule;
      }
      return null;
    },

    // Get current class for an educator based on time
    getCurrentClass: async (educatorId: string, date?: Date): Promise<{ class: ClassAssignment | null; dayType: string | null }> => {
      const currentDate = date || new Date();
      const schedule = await coreApi.schedules.getByEducatorId(educatorId, { isActive: true });

      if (!schedule || !schedule.classAssignments) {
        return { class: null, dayType: null };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _currentTime = currentDate.toTimeString().slice(0, 5); // "HH:MM"
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      // Find current class based on time
      // This is a simplified version - a full implementation would need master schedule lookup
      const currentClass = schedule.classAssignments.find(ca => {
        if (!ca.isActive) return false;
        // Check if this class is scheduled for today (simplified check)
        return ca.dayTypes.some(dt =>
          dt.toLowerCase() === dayOfWeek.toLowerCase() ||
          dt === dayOfWeek.charAt(0)
        );
      });

      return {
        class: currentClass || null,
        dayType: dayOfWeek,
      };
    },

    // Get day schedule for an educator
    getDaySchedule: async (educatorId: string, date: Date): Promise<ClassAssignment[]> => {
      const schedule = await coreApi.schedules.getByEducatorId(educatorId, { isActive: true });

      if (!schedule || !schedule.classAssignments) {
        return [];
      }

      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Filter classes for the given day
      return schedule.classAssignments.filter(ca => {
        if (!ca.isActive) return false;
        return ca.dayTypes.some(dt =>
          dt.toLowerCase() === dayOfWeek.toLowerCase() ||
          dt === dayOfWeek.charAt(0)
        );
      });
    },

    // Get available teachers for a given time
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAvailableTeachers: async (schoolId: string, _date: Date, _period?: string): Promise<User[]> => {
      // Get all teachers in the school
      const teachers = await coreApi.users.getTeachers({ schoolId, isActive: true });

      // In a full implementation, you would filter out teachers who have classes during this period
      // For now, return all teachers (this can be enhanced when schedule data is populated)
      return teachers;
    },

    // List all schedules with filters
    list: async (filters?: ScheduleFilters): Promise<EducatorSchedule[]> => {
      const constraints: QueryConstraint[] = [];

      if (filters?.schoolId) {
        constraints.push(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.academicYear) {
        constraints.push(where('academicYear', '==', filters.academicYear));
      }
      if (filters?.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }

      constraints.push(orderBy('educatorName'));

      const q = query(collection(db, getCollection('schedules')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as EducatorSchedule[];
    },

    // Create a new schedule
    create: async (scheduleData: Partial<EducatorSchedule>): Promise<EducatorSchedule> => {
      const now = Timestamp.now();
      const newSchedule = {
        ...scheduleData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('schedules')), newSchedule);

      return {
        id: docRef.id,
        ...scheduleData,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      } as EducatorSchedule;
    },

    // Update a schedule
    update: async (id: string, updates: Partial<EducatorSchedule>): Promise<EducatorSchedule> => {
      const docRef = doc(db, getCollection('schedules'), id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Schedule not found after update');

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: toDate(docSnap.data().createdAt),
        updatedAt: toDate(docSnap.data().updatedAt),
      } as EducatorSchedule;
    },

    // Delete a schedule
    delete: async (id: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('schedules'), id));
      return { success: true };
    },
  },
};
