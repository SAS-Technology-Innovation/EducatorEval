// Core Platform API Client
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
async function getAuthToken() {
    const user = auth.currentUser;
    if (!user)
        return null;
    return await user.getIdToken();
}
export const coreApi = {
    // User management
    users: {
        list: async (filters) => {
            let q = query(collection(db, 'users'), orderBy('lastName'), orderBy('firstName'));
            if (filters?.schoolId) {
                q = query(q, where('schoolId', '==', filters.schoolId));
            }
            if (filters?.divisionId) {
                q = query(q, where('divisionIds', 'array-contains', filters.divisionId));
            }
            if (filters?.departmentId) {
                q = query(q, where('departmentIds', 'array-contains', filters.departmentId));
            }
            if (filters?.role) {
                q = query(q, where('primaryRole', '==', filters.role));
            }
            if (filters?.isActive !== undefined) {
                q = query(q, where('isActive', '==', filters.isActive));
            }
            if (filters?.limit) {
                q = query(q, firestoreLimit(filters.limit));
            }
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const docRef = doc(db, 'users', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            throw new Error('User not found');
        },
        create: async (userData) => {
            const token = await getAuthToken();
            const response = await fetch('/api/v1/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create user');
            }
            return response.json();
        },
        update: async (id, updates) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update user');
            }
            return response.json();
        },
        delete: async (id) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete user');
            }
            return response.json();
        },
        getTeachers: async (filters) => {
            let q = collection(db, 'users');
            q = query(q, where('primaryRole', 'in', ['teacher', 'specialist_teacher', 'substitute_teacher']));
            if (filters?.schoolId) {
                q = query(q, where('schoolId', '==', filters.schoolId));
            }
            if (filters?.divisionId) {
                q = query(q, where('divisionIds', 'array-contains', filters.divisionId));
            }
            if (filters?.isActive !== undefined) {
                q = query(q, where('isActive', '==', filters.isActive));
            }
            q = query(q, orderBy('lastName'), orderBy('firstName'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        updateRole: async (id, roleData) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roleData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update user role');
            }
            return response.json();
        }
    },
    // Organization management
    organizations: {
        list: async (filters) => {
            let q = query(collection(db, 'organizations'), orderBy('name'));
            if (filters?.type) {
                q = query(q, where('type', '==', filters.type));
            }
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const docRef = doc(db, 'organizations', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...doc.data() };
            }
            throw new Error('Organization not found');
        },
        create: async (orgData) => {
            const newOrg = {
                ...orgData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const docRef = await addDoc(collection(db, 'organizations'), newOrg);
            return await coreApi.organizations.getById(docRef.id);
        },
        update: async (id, updates) => {
            const updateData = {
                ...updates,
                updatedAt: new Date()
            };
            await updateDoc(doc(db, 'organizations', id), updateData);
            return await coreApi.organizations.getById(id);
        },
        delete: async (id) => {
            await deleteDoc(doc(db, 'organizations', id));
            return { success: true };
        }
    },
    // School management
    schools: {
        list: async (filters) => {
            let q = query(collection(db, 'schools'), orderBy('name'));
            if (filters?.organizationId) {
                q = query(q, where('organizationId', '==', filters.organizationId));
            }
            if (filters?.type) {
                q = query(q, where('type', '==', filters.type));
            }
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const docRef = doc(db, 'schools', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            throw new Error('School not found');
        },
        create: async (schoolData) => {
            const newSchool = {
                ...schoolData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const docRef = await addDoc(collection(db, 'schools'), newSchool);
            return await coreApi.schools.getById(docRef.id);
        },
        update: async (id, updates) => {
            const updateData = {
                ...updates,
                updatedAt: new Date()
            };
            await updateDoc(doc(db, 'schools', id), updateData);
            return await coreApi.schools.getById(id);
        },
        delete: async (id) => {
            await deleteDoc(doc(db, 'schools', id));
            return { success: true };
        }
    },
    // Division management
    divisions: {
        list: async (filters) => {
            let q = query(collection(db, 'divisions'), orderBy('name'));
            if (filters?.schoolId) {
                q = query(q, where('schoolId', '==', filters.schoolId));
            }
            if (filters?.type) {
                q = query(q, where('type', '==', filters.type));
            }
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const docRef = doc(db, 'divisions', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            throw new Error('Division not found');
        },
        create: async (divisionData) => {
            const newDivision = {
                ...divisionData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const docRef = await addDoc(collection(db, 'divisions'), newDivision);
            return await coreApi.divisions.getById(docRef.id);
        },
        update: async (id, updates) => {
            const updateData = {
                ...updates,
                updatedAt: new Date()
            };
            await updateDoc(doc(db, 'divisions', id), updateData);
            return await coreApi.divisions.getById(id);
        },
        delete: async (id) => {
            await deleteDoc(doc(db, 'divisions', id));
            return { success: true };
        }
    },
    // Department management
    departments: {
        list: async (filters) => {
            let q = query(collection(db, 'departments'), orderBy('name'));
            if (filters?.schoolId) {
                q = query(q, where('schoolId', '==', filters.schoolId));
            }
            if (filters?.divisionId) {
                q = query(q, where('divisionIds', 'array-contains', filters.divisionId));
            }
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const docRef = doc(db, 'departments', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            throw new Error('Department not found');
        },
        create: async (deptData) => {
            const newDept = {
                ...deptData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const docRef = await addDoc(collection(db, 'departments'), newDept);
            return await coreApi.departments.getById(docRef.id);
        },
        update: async (id, updates) => {
            const updateData = {
                ...updates,
                updatedAt: new Date()
            };
            await updateDoc(doc(db, 'departments', id), updateData);
            return await coreApi.departments.getById(id);
        },
        delete: async (id) => {
            await deleteDoc(doc(db, 'departments', id));
            return { success: true };
        }
    },
    // SCHEDULE MANAGEMENT APIs (CRITICAL FOR AUTO-POPULATION)
    schedules: {
        getCurrentClass: async (educatorId, date) => {
            const token = await getAuthToken();
            const currentDate = date || new Date();
            const response = await fetch(`/api/v1/schedules/current-class`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    educatorId,
                    date: currentDate.toISOString()
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get current class');
            }
            return response.json();
        },
        getDaySchedule: async (educatorId, date) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/schedules/day-schedule`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    educatorId,
                    date: date.toISOString()
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get day schedule');
            }
            return response.json();
        },
        getWeekSchedule: async (educatorId, startDate) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/schedules/week-schedule`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    educatorId,
                    startDate: startDate.toISOString()
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get week schedule');
            }
            return response.json();
        },
        getAvailableTeachers: async (schoolId, date, period) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/schedules/available-teachers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    schoolId,
                    date: date.toISOString(),
                    period
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get available teachers');
            }
            return response.json();
        },
        getCurrentDayType: async (schoolId, date) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/schedules/current-day-type`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    schoolId,
                    date: date.toISOString()
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get current day type');
            }
            return response.json();
        },
        validateSchedule: async (scheduleData) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/schedules/validate-schedule`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scheduleData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to validate schedule');
            }
            return response.json();
        },
        checkConflicts: async (scheduleData) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/v1/schedules/check-conflicts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scheduleData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to check schedule conflicts');
            }
            return response.json();
        },
        // Schedule import functions
        importSchedule: async (file) => {
            const token = await getAuthToken();
            const formData = new FormData();
            formData.append('schedule_file', file);
            const response = await fetch('/api/v1/schedules/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to import schedule');
            }
            return response.json();
        },
        getImportTemplate: async () => {
            const response = await fetch('/api/v1/schedules/import-template');
            if (!response.ok) {
                throw new Error('Failed to download import template');
            }
            // Return blob for file download
            const blob = await response.blob();
            return blob;
        }
    }
};
