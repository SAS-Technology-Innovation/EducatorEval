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
   * Get a specific teacher by ID
   */
  async getById(id: string): Promise<Teacher | null> {
    try {
      const docSnapshot = await getDoc(doc(db, 'teachers', id));
      if (docSnapshot.exists()) {
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        } as Teacher;
      }
      return null;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw new Error('Failed to fetch teacher');
    }
  },

  /**
   * Create a new teacher
   */
  async create(teacher: Omit<Teacher, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'teachers'), teacher);
      return docRef.id;
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw new Error('Failed to create teacher');
    }
  }
};

// Scheduled Observation Operations  
export const scheduledObservationOperations = {
  /**
   * Get all scheduled observations
   */
  async getAll(): Promise<Observation[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'observations'), 
          where('status', '==', 'scheduled'),
          orderBy('date'),
          orderBy('startTime')
        )
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Observation));
    } catch (error) {
      console.error('Error fetching scheduled observations:', error);
      throw new Error('Failed to fetch scheduled observations');
    }
  },

  /**
   * Get scheduled observations by date
   */
  async getByDate(date: string): Promise<Observation[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'observations'),
          where('status', '==', 'scheduled'),
          where('date', '==', date),
          orderBy('startTime')
        )
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Observation));
    } catch (error) {
      console.error('Error fetching observations by date:', error);
      throw new Error('Failed to fetch observations by date');
    }
  },

  /**
   * Create a scheduled observation
   */
  async create(observation: Omit<Observation, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'observations'), {
        ...observation,
        status: 'scheduled',
        responses: {},
        comments: {},
        overallComment: '',
        duration: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating scheduled observation:', error);
      throw new Error('Failed to create scheduled observation');
    }
  },

  /**
   * Cancel a scheduled observation
   */
  async cancel(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'observations', id), {
        status: 'cancelled'
      });
    } catch (error) {
      console.error('Error cancelling observation:', error);
      throw new Error('Failed to cancel observation');
    }
  },

  /**
   * Update a scheduled observation
   */
  async update(id: string, updates: Partial<Observation>): Promise<void> {
    try {
      await updateDoc(doc(db, 'observations', id), updates);
    } catch (error) {
      console.error('Error updating scheduled observation:', error);
      throw new Error('Failed to update scheduled observation');
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
