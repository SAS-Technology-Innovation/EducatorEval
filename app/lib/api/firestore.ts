// Firestore API Layer - Core CRUD operations for all collections
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
  limit,
  Timestamp,
  WhereFilterOp,
  DocumentData,
  QueryConstraint,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  User,
  Organization,
  EducatorSchedule,
  MasterSchedule,
  Observation
} from '../../types';

// Generic Firestore service for CRUD operations
export class FirestoreService<T extends { id: string }> {
  constructor(private collectionName: string) {}

  // Create a new document
  async create(data: Omit<T, 'id'> & { createdAt?: Date; updatedAt?: Date }): Promise<T> {
    const docData = {
      ...data,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    };

    const docRef = await addDoc(collection(db, this.collectionName), this.convertDatesToTimestamps(docData));
    const newDoc = await getDoc(docRef);

    return { id: docRef.id, ...this.convertTimestampsToDates(newDoc.data() as DocumentData) } as T;
  }

  // Create with specific ID
  async createWithId(id: string, data: Omit<T, 'id'> & { createdAt?: Date; updatedAt?: Date }): Promise<T> {
    const docData = {
      ...data,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    };

    const docRef = doc(db, this.collectionName, id);
    await setDoc(docRef, this.convertDatesToTimestamps(docData));

    return { id, ...docData } as T;
  }

  // Read a single document by ID
  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...this.convertTimestampsToDates(docSnap.data()) } as T;
  }

  // Read all documents
  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestampsToDates(doc.data())
    } as T));
  }

  // Query with filters
  async query(filters: { field: string; operator: WhereFilterOp; value: any }[]): Promise<T[]> {
    const constraints: QueryConstraint[] = filters.map(f =>
      where(f.field, f.operator, f.value)
    );

    const q = query(collection(db, this.collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestampsToDates(doc.data())
    } as T));
  }

  // Query with filters and ordering
  async queryWithOrder(
    filters: { field: string; operator: WhereFilterOp; value: any }[],
    orderByField: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    limitCount?: number
  ): Promise<T[]> {
    const constraints: QueryConstraint[] = [
      ...filters.map(f => where(f.field, f.operator, f.value)),
      orderBy(orderByField, orderDirection)
    ];

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(collection(db, this.collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...this.convertTimestampsToDates(doc.data())
    } as T));
  }

  // Update a document
  async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    await updateDoc(docRef, this.convertDatesToTimestamps(updateData));
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // Helper: Convert Date objects to Firestore Timestamps
  private convertDatesToTimestamps(data: any): any {
    if (!data) return data;

    if (data instanceof Date) {
      return Timestamp.fromDate(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.convertDatesToTimestamps(item));
    }

    if (typeof data === 'object') {
      const converted: any = {};
      for (const [key, value] of Object.entries(data)) {
        converted[key] = this.convertDatesToTimestamps(value);
      }
      return converted;
    }

    return data;
  }

  // Helper: Convert Firestore Timestamps to Date objects
  private convertTimestampsToDates(data: any): any {
    if (!data) return data;

    if (data instanceof Timestamp) {
      return data.toDate();
    }

    if (Array.isArray(data)) {
      return data.map(item => this.convertTimestampsToDates(item));
    }

    if (typeof data === 'object' && data !== null) {
      const converted: any = {};
      for (const [key, value] of Object.entries(data)) {
        converted[key] = this.convertTimestampsToDates(value);
      }
      return converted;
    }

    return data;
  }
}

// Create service instances for each collection
export const usersService = new FirestoreService<User>('users');
export const organizationsService = new FirestoreService<Organization>('organizations');
export const schedulesService = new FirestoreService<EducatorSchedule>('educator_schedules');
export const masterSchedulesService = new FirestoreService<MasterSchedule>('master_schedules');
export const observationsService = new FirestoreService<Observation>('observations');

// Specialized queries for common use cases
export const firestoreApi = {
  // Users
  users: {
    getByEmail: async (email: string): Promise<User | null> => {
      const results = await usersService.query([
        { field: 'email', operator: '==', value: email }
      ]);
      return results.length > 0 ? results[0] : null;
    },

    getByRole: async (role: string): Promise<User[]> => {
      return usersService.query([
        { field: 'primaryRole', operator: '==', value: role },
        { field: 'isActive', operator: '==', value: true }
      ]);
    },

    getBySchool: async (schoolId: string): Promise<User[]> => {
      return usersService.query([
        { field: 'schoolId', operator: '==', value: schoolId },
        { field: 'isActive', operator: '==', value: true }
      ]);
    },

    getTeachers: async (schoolId?: string): Promise<User[]> => {
      const filters: { field: string; operator: WhereFilterOp; value: any }[] = [
        { field: 'isActive', operator: '==', value: true }
      ];

      if (schoolId) {
        filters.push({ field: 'schoolId', operator: '==', value: schoolId });
      }

      const allUsers = await usersService.query(filters);

      // Filter for educator roles (teachers)
      return allUsers.filter(user =>
        user.primaryRole === 'educator' ||
        user.secondaryRoles.includes('educator')
      );
    }
  },

  // Organizations
  organizations: {
    getByType: async (type: 'district' | 'school' | 'charter' | 'private'): Promise<Organization[]> => {
      return organizationsService.query([
        { field: 'type', operator: '==', value: type }
      ]);
    }
  },

  // Schedules
  schedules: {
    getByEducator: async (educatorId: string): Promise<EducatorSchedule | null> => {
      const results = await schedulesService.query([
        { field: 'educatorId', operator: '==', value: educatorId },
        { field: 'isActive', operator: '==', value: true }
      ]);
      return results.length > 0 ? results[0] : null;
    },

    getBySchool: async (schoolId: string): Promise<EducatorSchedule[]> => {
      return schedulesService.query([
        { field: 'schoolId', operator: '==', value: schoolId },
        { field: 'isActive', operator: '==', value: true }
      ]);
    }
  },

  // Master Schedules
  masterSchedules: {
    getActiveBySchool: async (schoolId: string): Promise<MasterSchedule | null> => {
      const results = await masterSchedulesService.query([
        { field: 'schoolId', operator: '==', value: schoolId },
        { field: 'isActive', operator: '==', value: true }
      ]);
      return results.length > 0 ? results[0] : null;
    }
  },

  // Observations
  observations: {
    getBySubject: async (subjectId: string): Promise<Observation[]> => {
      return observationsService.queryWithOrder(
        [{ field: 'subjectId', operator: '==', value: subjectId }],
        'createdAt',
        'desc'
      );
    },

    getByObserver: async (observerId: string): Promise<Observation[]> => {
      return observationsService.queryWithOrder(
        [{ field: 'observerId', operator: '==', value: observerId }],
        'createdAt',
        'desc'
      );
    },

    getBySchool: async (schoolId: string): Promise<Observation[]> => {
      return observationsService.queryWithOrder(
        [{ field: 'schoolId', operator: '==', value: schoolId }],
        'createdAt',
        'desc'
      );
    },

    getRecent: async (limitCount: number = 10): Promise<Observation[]> => {
      return observationsService.queryWithOrder(
        [],
        'createdAt',
        'desc',
        limitCount
      );
    }
  }
};

export default firestoreApi;
