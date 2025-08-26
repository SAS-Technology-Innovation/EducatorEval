// Firestore Database Operations
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import { 
  Framework, 
  Observation, 
  Teacher, 
  User,
  ObservationResponse
} from '../types';

// Framework Operations
export const frameworkOperations = {
  /**
   * Get all frameworks
   */
  async getAll(): Promise<Framework[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'frameworks'), orderBy('name'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Framework));
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      throw new Error('Failed to fetch frameworks');
    }
  },

  /**
   * Get framework by ID
   */
  async getById(id: string): Promise<Framework | null> {
    try {
      const docSnap = await getDoc(doc(db, 'frameworks', id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Framework;
      }
      return null;
    } catch (error) {
      console.error('Error fetching framework:', error);
      throw new Error('Failed to fetch framework');
    }
  },

  /**
   * Create new framework
   */
  async create(framework: Omit<Framework, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'frameworks'), {
        ...framework,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating framework:', error);
      throw new Error('Failed to create framework');
    }
  },

  /**
   * Update existing framework
   */
  async update(id: string, updates: Partial<Framework>): Promise<void> {
    try {
      await updateDoc(doc(db, 'frameworks', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating framework:', error);
      throw new Error('Failed to update framework');
    }
  },

  /**
   * Delete framework
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'frameworks', id));
    } catch (error) {
      console.error('Error deleting framework:', error);
      throw new Error('Failed to delete framework');
    }
  },

  /**
   * Subscribe to framework changes
   */
  subscribe(callback: (frameworks: Framework[]) => void): Unsubscribe {
    return onSnapshot(
      query(collection(db, 'frameworks'), orderBy('name')),
      (snapshot) => {
        const frameworks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Framework));
        callback(frameworks);
      },
      (error) => {
        console.error('Error in frameworks subscription:', error);
      }
    );
  }
};

// Observation Operations
export const observationOperations = {
  /**
   * Create new observation
   */
  async create(observation: Omit<Observation, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'observations'), {
        ...observation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating observation:', error);
      throw new Error('Failed to create observation');
    }
  },

  /**
   * Update observation
   */
  async update(id: string, updates: Partial<Observation>): Promise<void> {
    try {
      await updateDoc(doc(db, 'observations', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating observation:', error);
      throw new Error('Failed to update observation');
    }
  },

  /**
   * Get observations by observer
   */
  async getByObserver(observerId: string, limitCount = 50): Promise<Observation[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'observations'),
          where('observerId', '==', observerId),
          orderBy('date', 'desc'),
          limit(limitCount)
        )
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Observation));
    } catch (error) {
      console.error('Error fetching observations by observer:', error);
      throw new Error('Failed to fetch observations');
    }
  },

  /**
   * Get observations by teacher
   */
  async getByTeacher(teacherId: string, limitCount = 50): Promise<Observation[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'observations'),
          where('teacherId', '==', teacherId),
          orderBy('date', 'desc'),
          limit(limitCount)
        )
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Observation));
    } catch (error) {
      console.error('Error fetching observations by teacher:', error);
      throw new Error('Failed to fetch observations');
    }
  },

  /**
   * Get recent observations with pagination
   */
  async getRecent(limitCount = 20, lastDoc?: QueryDocumentSnapshot<DocumentData>): Promise<{
    observations: Observation[];
    lastDocument: QueryDocumentSnapshot<DocumentData> | null;
  }> {
    try {
      let q = query(
        collection(db, 'observations'),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      
      return {
        observations: querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Observation)),
        lastDocument: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      };
    } catch (error) {
      console.error('Error fetching recent observations:', error);
      throw new Error('Failed to fetch recent observations');
    }
  },

  /**
   * Get observation statistics
   */
  async getStats(): Promise<{
    total: number;
    thisMonth: number;
    crpEvidenceAverage: number;
  }> {
    try {
      const allObservations = await getDocs(collection(db, 'observations'));
      const observations = allObservations.docs.map(doc => doc.data() as Observation);
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const thisMonthObservations = observations.filter(obs => 
        new Date(obs.date) >= thisMonth
      );
      
      const observationsWithCRP = observations.filter(obs => obs.crpEvidenceCount !== undefined);
      const crpEvidenceAverage = observationsWithCRP.length > 0
        ? observationsWithCRP.reduce((sum, obs) => sum + (obs.crpEvidenceCount || 0), 0) / observationsWithCRP.length
        : 0;
      
      return {
        total: observations.length,
        thisMonth: thisMonthObservations.length,
        crpEvidenceAverage: Math.round(crpEvidenceAverage)
      };
    } catch (error) {
      console.error('Error getting observation stats:', error);
      throw new Error('Failed to get observation statistics');
    }
  }
};

// Teacher Operations
export const teacherOperations = {
  /**
   * Get all teachers
   */
  async getAll(): Promise<Teacher[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'teachers'), orderBy('name'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Teacher));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw new Error('Failed to fetch teachers');
    }
  },

  /**
   * Get teacher by ID
   */
  async getById(id: string): Promise<Teacher | null> {
    try {
      const docSnap = await getDoc(doc(db, 'teachers', id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Teacher;
      }
      return null;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw new Error('Failed to fetch teacher');
    }
  },

  /**
   * Search teachers by name or email
   */
  async search(searchTerm: string): Promise<Teacher[]> {
    try {
      // Note: This is a simplified search. For production, consider using 
      // Algolia or similar search service for better full-text search
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teachers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Teacher));
      
      const term = searchTerm.toLowerCase();
      return teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(term) ||
        teacher.email.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching teachers:', error);
      throw new Error('Failed to search teachers');
    }
  },

  /**
   * Bulk import teachers
   */
  async bulkImport(teachers: Omit<Teacher, 'id'>[]): Promise<{
    successful: number;
    errors: Array<{ teacher: Omit<Teacher, 'id'>; error: string }>;
  }> {
    const batch = writeBatch(db);
    const errors: Array<{ teacher: Omit<Teacher, 'id'>; error: string }> = [];
    let successful = 0;

    for (const teacher of teachers) {
      try {
        const teacherRef = doc(collection(db, 'teachers'));
        batch.set(teacherRef, {
          ...teacher,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        successful++;
      } catch (error) {
        errors.push({
          teacher,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    try {
      await batch.commit();
      return { successful, errors };
    } catch (error) {
      throw new Error('Failed to import teachers');
    }
  }
};

// User Operations
export const userOperations = {
  /**
   * Get all users (admin only)
   */
  async getAll(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'users'), orderBy('name'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  /**
   * Update user profile
   */
  async update(id: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },

  /**
   * Delete user (admin only)
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
};
