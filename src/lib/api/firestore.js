// Firestore API Layer - Core CRUD operations for all collections
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
// Generic Firestore service for CRUD operations
export class FirestoreService {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }
    // Create a new document
    async create(data) {
        const docData = {
            ...data,
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date()
        };
        const docRef = await addDoc(collection(db, this.collectionName), this.convertDatesToTimestamps(docData));
        const newDoc = await getDoc(docRef);
        return { id: docRef.id, ...this.convertTimestampsToDates(newDoc.data()) };
    }
    // Create with specific ID
    async createWithId(id, data) {
        const docData = {
            ...data,
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date()
        };
        const docRef = doc(db, this.collectionName, id);
        await setDoc(docRef, this.convertDatesToTimestamps(docData));
        return { id, ...docData };
    }
    // Read a single document by ID
    async getById(id) {
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return { id: docSnap.id, ...this.convertTimestampsToDates(docSnap.data()) };
    }
    // Read all documents
    async getAll() {
        const querySnapshot = await getDocs(collection(db, this.collectionName));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...this.convertTimestampsToDates(doc.data())
        }));
    }
    // Query with filters
    async query(filters) {
        const constraints = filters.map(f => where(f.field, f.operator, f.value));
        const q = query(collection(db, this.collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...this.convertTimestampsToDates(doc.data())
        }));
    }
    // Query with filters and ordering
    async queryWithOrder(filters, orderByField, orderDirection = 'asc', limitCount) {
        const constraints = [
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
        }));
    }
    // Update a document
    async update(id, data) {
        const docRef = doc(db, this.collectionName, id);
        const updateData = {
            ...data,
            updatedAt: new Date()
        };
        await updateDoc(docRef, this.convertDatesToTimestamps(updateData));
    }
    // Delete a document
    async delete(id) {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
    }
    // Helper: Convert Date objects to Firestore Timestamps
    convertDatesToTimestamps(data) {
        if (!data)
            return data;
        if (data instanceof Date) {
            return Timestamp.fromDate(data);
        }
        if (Array.isArray(data)) {
            return data.map(item => this.convertDatesToTimestamps(item));
        }
        if (typeof data === 'object') {
            const converted = {};
            for (const [key, value] of Object.entries(data)) {
                converted[key] = this.convertDatesToTimestamps(value);
            }
            return converted;
        }
        return data;
    }
    // Helper: Convert Firestore Timestamps to Date objects
    convertTimestampsToDates(data) {
        if (!data)
            return data;
        if (data instanceof Timestamp) {
            return data.toDate();
        }
        if (Array.isArray(data)) {
            return data.map(item => this.convertTimestampsToDates(item));
        }
        if (typeof data === 'object' && data !== null) {
            const converted = {};
            for (const [key, value] of Object.entries(data)) {
                converted[key] = this.convertTimestampsToDates(value);
            }
            return converted;
        }
        return data;
    }
}
// Create service instances for each collection
export const usersService = new FirestoreService('users');
export const organizationsService = new FirestoreService('organizations');
export const schedulesService = new FirestoreService('educator_schedules');
export const masterSchedulesService = new FirestoreService('master_schedules');
export const observationsService = new FirestoreService('observations');
// Specialized queries for common use cases
export const firestoreApi = {
    // Users
    users: {
        getByEmail: async (email) => {
            const results = await usersService.query([
                { field: 'email', operator: '==', value: email }
            ]);
            return results.length > 0 ? results[0] : null;
        },
        getByRole: async (role) => {
            return usersService.query([
                { field: 'primaryRole', operator: '==', value: role },
                { field: 'isActive', operator: '==', value: true }
            ]);
        },
        getBySchool: async (schoolId) => {
            return usersService.query([
                { field: 'schoolId', operator: '==', value: schoolId },
                { field: 'isActive', operator: '==', value: true }
            ]);
        },
        getTeachers: async (schoolId) => {
            const filters = [
                { field: 'isActive', operator: '==', value: true }
            ];
            if (schoolId) {
                filters.push({ field: 'schoolId', operator: '==', value: schoolId });
            }
            const allUsers = await usersService.query(filters);
            // Filter for educator roles (teachers)
            return allUsers.filter(user => user.primaryRole === 'educator' ||
                user.secondaryRoles.includes('educator'));
        }
    },
    // Organizations
    organizations: {
        getByType: async (type) => {
            return organizationsService.query([
                { field: 'type', operator: '==', value: type }
            ]);
        }
    },
    // Schedules
    schedules: {
        getByEducator: async (educatorId) => {
            const results = await schedulesService.query([
                { field: 'educatorId', operator: '==', value: educatorId },
                { field: 'isActive', operator: '==', value: true }
            ]);
            return results.length > 0 ? results[0] : null;
        },
        getBySchool: async (schoolId) => {
            return schedulesService.query([
                { field: 'schoolId', operator: '==', value: schoolId },
                { field: 'isActive', operator: '==', value: true }
            ]);
        }
    },
    // Master Schedules
    masterSchedules: {
        getActiveBySchool: async (schoolId) => {
            const results = await masterSchedulesService.query([
                { field: 'schoolId', operator: '==', value: schoolId },
                { field: 'isActive', operator: '==', value: true }
            ]);
            return results.length > 0 ? results[0] : null;
        }
    },
    // Observations
    observations: {
        getBySubject: async (subjectId) => {
            return observationsService.queryWithOrder([{ field: 'subjectId', operator: '==', value: subjectId }], 'createdAt', 'desc');
        },
        getByObserver: async (observerId) => {
            return observationsService.queryWithOrder([{ field: 'observerId', operator: '==', value: observerId }], 'createdAt', 'desc');
        },
        getBySchool: async (schoolId) => {
            return observationsService.queryWithOrder([{ field: 'schoolId', operator: '==', value: schoolId }], 'createdAt', 'desc');
        },
        getRecent: async (limitCount = 10) => {
            return observationsService.queryWithOrder([], 'createdAt', 'desc', limitCount);
        }
    }
};
export default firestoreApi;
