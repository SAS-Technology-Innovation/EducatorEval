// Observation Applet API Client
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
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { coreApi } from './core';

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export const observationsApi = {
  // Framework management
  frameworks: {
    list: async (filters?: any) => {
      let q = query(collection(db, 'observation_frameworks'), orderBy('name'));
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'observation_frameworks', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Framework not found');
    },

    create: async (frameworkData: any) => {
      const newFramework = {
        ...frameworkData,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0
      };
      
      const docRef = await addDoc(collection(db, 'observation_frameworks'), newFramework);
      return await observationsApi.frameworks.getById(docRef.id);
    },

    update: async (id: string, updates: any) => {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'observation_frameworks', id), updateData);
      return await observationsApi.frameworks.getById(id);
    },

    delete: async (id: string) => {
      await deleteDoc(doc(db, 'observation_frameworks', id));
      return { success: true };
    }
  },

  // Observation management
  observations: {
    list: async (filters?: any) => {
      let q = query(collection(db, 'observations'), orderBy('observationDate', 'desc'));
      
      if (filters?.educatorId) {
        q = query(q, where('educatorId', '==', filters.educatorId));
      }
      if (filters?.observerId) {
        q = query(q, where('observerId', '==', filters.observerId));
      }
      if (filters?.schoolId) {
        q = query(q, where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        q = query(q, where('divisionId', '==', filters.divisionId));
      }
      if (filters?.frameworkId) {
        q = query(q, where('frameworkId', '==', filters.frameworkId));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.dateFrom && filters?.dateTo) {
        q = query(q, 
          where('observationDate', '>=', Timestamp.fromDate(filters.dateFrom)),
          where('observationDate', '<=', Timestamp.fromDate(filters.dateTo))
        );
      }
      if (filters?.limit) {
        q = query(q, firestoreLimit(filters.limit));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'observations', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Observation not found');
    },

    create: async (observationData: any) => {
      const token = await getAuthToken();
      const response = await fetch('/api/applets/observations/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(observationData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create observation');
      }
      
      return response.json();
    },

    // CRITICAL: Create observation with schedule auto-population
    createWithSchedule: async (observationData: any) => {
      const token = await getAuthToken();
      const response = await fetch('/api/applets/observations/create-with-schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(observationData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create observation with schedule data');
      }
      
      return response.json();
    },

    // Auto-populate observation form from current schedule
    autoPopulateFromSchedule: async (educatorId: string, date?: Date) => {
      try {
        // Get current class information from schedule system
        const currentClass = await coreApi.schedules.getCurrentClass(educatorId, date);
        
        if (!currentClass.class) {
          throw new Error('No current class found for auto-population');
        }

        // Build pre-populated observation data
        return {
          educatorId,
          schoolId: currentClass.class.schoolId,
          divisionId: currentClass.class.divisionId,
          departmentId: currentClass.class.departmentId,
          subjectArea: currentClass.class.subject,
          gradeLevel: currentClass.class.gradeLevel,
          period: currentClass.class.period,
          dayType: currentClass.dayType,
          observationDate: date || new Date(),
          classContext: {
            className: currentClass.class.name,
            room: currentClass.class.room,
            enrolledStudents: currentClass.class.enrolledStudents,
            presentStudents: null, // To be filled by observer
            scheduledStartTime: currentClass.class.startTime,
            scheduledEndTime: currentClass.class.endTime,
            actualStartTime: null, // To be filled by observer
            actualEndTime: null // To be filled by observer
          },
          scheduleData: currentClass
        };
      } catch (error) {
        throw new Error(`Failed to auto-populate from schedule: ${error.message}`);
      }
    },

    update: async (id: string, updates: any) => {
      const token = await getAuthToken();
      const response = await fetch(`/api/applets/observations/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update observation');
      }
      
      return response.json();
    },

    delete: async (id: string) => {
      await deleteDoc(doc(db, 'observations', id));
      return { success: true };
    },

    // Submit observation for review
    submit: async (id: string) => {
      const token = await getAuthToken();
      const response = await fetch(`/api/applets/observations/${id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit observation');
      }
      
      return response.json();
    },

    // Approve observation
    approve: async (id: string, feedback?: string) => {
      const token = await getAuthToken();
      const response = await fetch(`/api/applets/observations/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve observation');
      }
      
      return response.json();
    }
  },

  // Analytics and reporting
  analytics: {
    getDashboardStats: async (filters?: any) => {
      const token = await getAuthToken();
      const response = await fetch('/api/applets/observations/dashboard-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters || {})
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get dashboard stats');
      }
      
      return response.json();
    },

    getObservationTrends: async (filters?: any) => {
      const token = await getAuthToken();
      const response = await fetch('/api/applets/observations/trends', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters || {})
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get observation trends');
      }
      
      return response.json();
    },

    getCRPEvidence: async (filters?: any) => {
      const token = await getAuthToken();
      const response = await fetch('/api/applets/observations/crp-evidence', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters || {})
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get CRP evidence data');
      }
      
      return response.json();
    },

    exportObservations: async (format: 'csv' | 'excel' | 'pdf', filters?: any) => {
      const token = await getAuthToken();
      const response = await fetch('/api/applets/observations/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ format, ...filters })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to export observations');
      }
      
      // Return blob for file download
      const blob = await response.blob();
      return blob;
    }
  }
};