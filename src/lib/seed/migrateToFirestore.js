// Firestore Migration Script
// Purpose: Migrate the Integrated Observation Framework (10 look-fors) to Firestore
// This creates the foundation for all observation data
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import { integratedObservationFramework } from './frameworkSeed';
// Firebase config from .env
const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
/**
 * Migrate the Integrated Observation Framework to Firestore
 * Creates the `frameworks` collection with the 10 integrated look-fors
 */
export async function migrateFramework() {
    console.log('🚀 Starting framework migration...');
    try {
        const frameworkRef = doc(db, 'frameworks', integratedObservationFramework.id);
        // Convert the framework to a Firestore-compatible format
        const frameworkData = {
            ...integratedObservationFramework,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await setDoc(frameworkRef, frameworkData);
        console.log('✅ Framework migrated successfully!');
        console.log(`   Framework ID: ${integratedObservationFramework.id}`);
        console.log(`   Name: ${integratedObservationFramework.name}`);
        console.log(`   Total Questions: ${integratedObservationFramework.totalQuestions}`);
        console.log(`   Sections: ${integratedObservationFramework.sections.length}`);
        return {
            success: true,
            frameworkId: integratedObservationFramework.id
        };
    }
    catch (error) {
        console.error('❌ Framework migration failed:', error);
        throw error;
    }
}
/**
 * Migrate sample users for testing
 */
export async function migrateSampleUsers() {
    console.log('🚀 Starting sample users migration...');
    const batch = writeBatch(db);
    const sampleUsers = [
        {
            id: 'super-admin-001',
            email: 'admin@sas.edu.sg',
            displayName: 'Super Admin',
            firstName: 'Super',
            lastName: 'Admin',
            primaryRole: 'super_admin',
            secondaryRoles: [],
            schoolId: 'sas-001',
            divisionId: 'high-school',
            departmentId: 'leadership',
            subjects: [],
            grades: [],
            isActive: true,
            canObserve: true,
            canBeObserved: false,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'observer-001',
            email: 'observer@sas.edu.sg',
            displayName: 'John Observer',
            firstName: 'John',
            lastName: 'Observer',
            primaryRole: 'observer',
            secondaryRoles: ['manager'],
            schoolId: 'sas-001',
            divisionId: 'high-school',
            departmentId: 'leadership',
            subjects: [],
            grades: [],
            isActive: true,
            canObserve: true,
            canBeObserved: false,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'teacher-001',
            email: 'teacher@sas.edu.sg',
            displayName: 'Jane Teacher',
            firstName: 'Jane',
            lastName: 'Teacher',
            primaryRole: 'educator',
            secondaryRoles: [],
            schoolId: 'sas-001',
            divisionId: 'high-school',
            departmentId: 'english',
            subjects: ['English', 'Literature'],
            grades: ['9', '10', '11', '12'],
            isActive: true,
            canObserve: false,
            canBeObserved: true,
            scheduleId: 'schedule-teacher-001',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    sampleUsers.forEach(user => {
        const userRef = doc(db, 'users', user.id);
        batch.set(userRef, user);
    });
    await batch.commit();
    console.log(`✅ Migrated ${sampleUsers.length} sample users`);
}
/**
 * Migrate sample organization
 */
export async function migrateSampleOrganization() {
    console.log('🚀 Starting organization migration...');
    const organization = {
        id: 'sas-001',
        name: 'Singapore American School',
        shortName: 'SAS',
        type: 'school',
        address: '40 Woodlands Street 41, Singapore 738547',
        website: 'https://www.sas.edu.sg',
        divisions: [
            {
                id: 'elementary',
                name: 'Elementary School',
                grades: ['K', '1', '2', '3', '4', '5']
            },
            {
                id: 'middle',
                name: 'Middle School',
                grades: ['6', '7', '8']
            },
            {
                id: 'high',
                name: 'High School',
                grades: ['9', '10', '11', '12']
            }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const orgRef = doc(db, 'organizations', organization.id);
    await setDoc(orgRef, organization);
    console.log(`✅ Migrated organization: ${organization.name}`);
}
/**
 * Master migration function - runs all migrations in order
 */
export async function runMigrations() {
    console.log('🎯 STARTING FIRESTORE MIGRATIONS');
    console.log('=====================================\n');
    try {
        // 1. Framework (CRITICAL - Foundation for everything)
        await migrateFramework();
        console.log('');
        // 2. Organization
        await migrateSampleOrganization();
        console.log('');
        // 3. Sample Users
        await migrateSampleUsers();
        console.log('');
        console.log('=====================================');
        console.log('✅ ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Check Firestore Console: https://console.firebase.google.com/project/educator-evaluations/firestore');
        console.log('2. Verify the "frameworks" collection has the integrated-observation-framework');
        console.log('3. Verify the "users" collection has 3 sample users');
        console.log('4. Verify the "organizations" collection has SAS');
        return {
            success: true,
            message: 'All migrations completed'
        };
    }
    catch (error) {
        console.error('❌ MIGRATION FAILED:', error);
        throw error;
    }
}
// Export for use in standalone script
export default runMigrations;
