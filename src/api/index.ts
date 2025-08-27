// Firebase API Service Layer with React Query Integration
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
  onSnapshot,
  increment
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { CRPObservation, CRPFramework, User, CRPMetrics } from '../types';

// Get authenticated user's ID token for Cloud Function calls
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

// CRP Observation API
export const observationApi = {
  // List observations with optional filters
  list: async (filters?: {
    organizationId?: string;
    teacherId?: string;
    observerId?: string;
    status?: string;
    limit?: number;
  }) => {
    let q = collection(db, 'crp_observations');
    
    if (filters?.organizationId) {
      q = query(q, where('organizationId', '==', filters.organizationId));
    }
    if (filters?.teacherId) {
      q = query(q, where('teacherId', '==', filters.teacherId));
    }
    if (filters?.observerId) {
      q = query(q, where('observerId', '==', filters.observerId));
    }
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      date: doc.data().date?.toDate(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as CRPObservation[];
  },

  // Get single observation
  getById: async (id: string): Promise<CRPObservation> => {
    const docRef = doc(db, 'crp_observations', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        date: data.date?.toDate(),
        startTime: data.startTime?.toDate(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as CRPObservation;
    }
    throw new Error('Observation not found');
  },

  // Create observation
  create: async (observation: Partial<CRPObservation>): Promise<CRPObservation> => {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'crp_observations'), {
      ...observation,
      createdAt: now,
      updatedAt: now,
      version: 1,
      status: observation.status || 'draft'
    });
    
    return { 
      id: docRef.id, 
      ...observation,
      createdAt: now,
      updatedAt: now,
      version: 1,
      status: observation.status || 'draft'
    } as CRPObservation;
  },

  // Update observation
  update: async (id: string, updates: Partial<CRPObservation>): Promise<void> => {
    const docRef = doc(db, 'crp_observations', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
      version: increment(1)
    });
  },

  // Delete observation
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, 'crp_observations', id);
    await deleteDoc(docRef);
  },

  // Real-time subscription
  subscribe: (id: string, callback: (data: CRPObservation | null) => void) => {
    const docRef = doc(db, 'crp_observations', id);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({ 
          id: doc.id, 
          ...data,
          date: data.date?.toDate(),
          startTime: data.startTime?.toDate(),
          endTime: data.endTime?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as CRPObservation);
      } else {
        callback(null);
      }
    });
  }
};

// Framework API
export const frameworkApi = {
  list: async (): Promise<CRPFramework[]> => {
    const q = query(
      collection(db, 'crp_frameworks'),
      where('status', '==', 'active'),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      approvedAt: doc.data().approvedAt?.toDate(),
      lastUsed: doc.data().lastUsed?.toDate()
    })) as CRPFramework[];
  },

  getById: async (id: string): Promise<CRPFramework> => {
    const docRef = doc(db, 'crp_frameworks', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        approvedAt: data.approvedAt?.toDate(),
        lastUsed: data.lastUsed?.toDate()
      } as CRPFramework;
    }
    throw new Error('Framework not found');
  },

  create: async (framework: Partial<CRPFramework>): Promise<CRPFramework> => {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'crp_frameworks'), {
      ...framework,
      createdAt: now,
      updatedAt: now,
      status: framework.status || 'draft',
      usageCount: 0,
      averageCompletionTime: 0,
      averageCRPEvidence: 0,
      versionHistory: []
    });
    
    return { 
      id: docRef.id, 
      ...framework,
      createdAt: now,
      updatedAt: now,
      status: framework.status || 'draft',
      usageCount: 0,
      averageCompletionTime: 0,
      averageCRPEvidence: 0,
      versionHistory: []
    } as CRPFramework;
  },

  update: async (id: string, updates: Partial<CRPFramework>): Promise<void> => {
    const docRef = doc(db, 'crp_frameworks', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, 'crp_frameworks', id);
    await deleteDoc(docRef);
  }
};

// User API
export const userApi = {
  getById: async (id: string): Promise<User> => {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        lastLogin: data.lastLogin?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as User;
    }
    throw new Error('User not found');
  },

  update: async (id: string, updates: Partial<User>): Promise<void> => {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  list: async (organizationId: string): Promise<User[]> => {
    const q = query(
      collection(db, 'users'),
      where('organizationId', '==', organizationId),
      where('isActive', '==', true),
      orderBy('lastName')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      lastLogin: doc.data().lastLogin?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as User[];
  }
};

// Analytics API (calls Firebase Cloud Functions)
export const analyticsApi = {
  getDashboardData: async (orgId: string) => {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`/api/v1/analytics/dashboard?orgId=${orgId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    return response.json();
  },

  getCRPMetrics: async (orgId: string): Promise<CRPMetrics> => {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`/api/v1/analytics/crp-metrics?orgId=${orgId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch CRP metrics');
    }
    
    return response.json();
  }
};

// Re-exports for compatibility
export const observationsApi = { observations: observationApi };
export const coreApi = {
  users: userApi,
  divisions: { 
    list: async () => [], 
    getById: async (id: string) => ({ id, name: 'Division' }) 
  },
  departments: { 
    list: async () => [], 
    getById: async (id: string) => ({ id, name: 'Department' }) 
  },
  schools: { 
    getById: async (id: string) => ({ id, name: 'School' }) 
  }
};