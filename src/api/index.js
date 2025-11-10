// Firebase API Service Layer with React Query Integration
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, increment } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
// Get authenticated user's ID token for Cloud Function calls
async function getAuthToken() {
    const user = auth.currentUser;
    if (!user)
        return null;
    return await user.getIdToken();
}
// CRP Observation API
export const observationApi = {
    // List observations with optional filters
    list: async (filters) => {
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
        }));
    },
    // Get single observation
    getById: async (id) => {
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
            };
        }
        throw new Error('Observation not found');
    },
    // Create observation
    create: async (observation) => {
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
        };
    },
    // Update observation
    update: async (id, updates) => {
        const docRef = doc(db, 'crp_observations', id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: new Date(),
            version: increment(1)
        });
    },
    // Delete observation
    delete: async (id) => {
        const docRef = doc(db, 'crp_observations', id);
        await deleteDoc(docRef);
    },
    // Real-time subscription
    subscribe: (id, callback) => {
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
                });
            }
            else {
                callback(null);
            }
        });
    }
};
// Framework API
export const frameworkApi = {
    list: async () => {
        const q = query(collection(db, 'frameworks'), orderBy('name'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            approvedAt: doc.data().approvedAt?.toDate(),
            lastUsed: doc.data().lastUsed?.toDate()
        }));
    },
    getById: async (id) => {
        const docRef = doc(db, 'frameworks', id);
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
            };
        }
        throw new Error('Framework not found');
    },
    create: async (framework) => {
        const now = new Date();
        const docRef = await addDoc(collection(db, 'frameworks'), {
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
        };
    },
    update: async (id, updates) => {
        const docRef = doc(db, 'frameworks', id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: new Date()
        });
    },
    delete: async (id) => {
        const docRef = doc(db, 'frameworks', id);
        await deleteDoc(docRef);
    }
};
// User API
export const userApi = {
    getById: async (id) => {
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
            };
        }
        throw new Error('User not found');
    },
    update: async (id, updates) => {
        const docRef = doc(db, 'users', id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: new Date()
        });
    },
    list: async (organizationId) => {
        const q = query(collection(db, 'users'), where('organizationId', '==', organizationId), where('isActive', '==', true), orderBy('lastName'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            lastLogin: doc.data().lastLogin?.toDate(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
        }));
    }
};
// Analytics API (calls Firebase Cloud Functions)
export const analyticsApi = {
    getDashboardData: async (orgId) => {
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
    getCRPMetrics: async (orgId) => {
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
        getById: async (id) => ({ id, name: 'Division' })
    },
    departments: {
        list: async () => [],
        getById: async (id) => ({ id, name: 'Department' })
    },
    schools: {
        getById: async (id) => ({ id, name: 'School' })
    }
};
