// Direct Firestore Database Operations
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
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

// Type for Firestore where clause
type WhereClause = [string, WhereFilterOp, unknown];

// Get environment-based collection prefix
const getCollectionPrefix = () => {
  const env = import.meta.env.VITE_ENVIRONMENT || 'staging';
  return env === 'production' ? '' : 'staging_';
};

// Generic CRUD operations for Firestore collections
export class FirestoreService {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = `${getCollectionPrefix()}${collectionName}`;
  }

  // List documents with optional query constraints
  async list(options?: {
    where?: WhereClause[];
    orderBy?: [string, 'asc' | 'desc'];
    limit?: number;
  }) {
    try {
      const collectionRef = collection(db, this.collectionName);

      // Build all query constraints
      const constraints: QueryConstraint[] = [];

      if (options?.where) {
        for (const [field, operator, value] of options.where) {
          constraints.push(where(field, operator, value));
        }
      }

      if (options?.orderBy) {
        constraints.push(orderBy(options.orderBy[0], options.orderBy[1]));
      }

      if (options?.limit) {
        constraints.push(limit(options.limit));
      }

      // Create query with all constraints at once
      const q = constraints.length > 0
        ? query(collectionRef, ...constraints)
        : collectionRef;

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings for consistency
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      }));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to list ${this.collectionName}:`, error);
      }
      throw error;
    }
  }

  // Get single document by ID
  async getById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        };
      }
      return null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to get ${this.collectionName} by ID:`, error);
      }
      throw error;
    }
  }

  // Create new document
  async create(data: Record<string, unknown>) {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, this.collectionName), docData);
      return {
        id: docRef.id,
        ...docData,
        createdAt: docData.createdAt.toDate().toISOString(),
        updatedAt: docData.updatedAt.toDate().toISOString(),
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to create ${this.collectionName}:`, error);
      }
      throw error;
    }
  }

  // Update existing document
  async update(id: string, data: Record<string, unknown>) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);

      // Return updated document
      return this.getById(id);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to update ${this.collectionName}:`, error);
      }
      throw error;
    }
  }

  // Delete document
  async delete(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true, id };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to delete ${this.collectionName}:`, error);
      }
      throw error;
    }
  }
}

// Create service instances for different collections
export const usersService = new FirestoreService('users');
export const organizationsService = new FirestoreService('organizations');
export const schoolsService = new FirestoreService('schools');
export const divisionsService = new FirestoreService('divisions');
export const departmentsService = new FirestoreService('departments');
export const observationsService = new FirestoreService('observations');
export const schedulesService = new FirestoreService('schedules');
export const frameworksService = new FirestoreService('frameworks');

// Specialized query functions
export const firestoreQueries = {
  // Get user's observations
  async getUserObservations(teacherId: string, limitCount = 50) {
    return observationsService.list({
      where: [['teacherId', '==', teacherId]],
      orderBy: ['createdAt', 'desc'],
      limit: limitCount,
    });
  },

  // Get schools by organization
  async getSchoolsByOrganization(organizationId: string) {
    return schoolsService.list({
      where: [['organizationId', '==', organizationId]],
      orderBy: ['name', 'asc'],
    });
  },

  // Get divisions by school
  async getDivisionsBySchool(schoolId: string) {
    return divisionsService.list({
      where: [['schoolId', '==', schoolId]],
      orderBy: ['name', 'asc'],
    });
  },

  // Get departments by division
  async getDepartmentsByDivision(divisionId: string) {
    return departmentsService.list({
      where: [['divisionId', '==', divisionId]],
      orderBy: ['name', 'asc'],
    });
  },

  // Get active users
  async getActiveUsers() {
    return usersService.list({
      where: [['status', '==', 'active']],
      orderBy: ['lastName', 'asc'],
    });
  },
};