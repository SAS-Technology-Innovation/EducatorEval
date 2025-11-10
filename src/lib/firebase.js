// Firebase Client Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
// Firebase configuration - using environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Only connect to emulators if explicitly enabled in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true' && typeof window !== 'undefined') {
    try {
        // Connect to emulators (will only connect once per instance)
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log('🔧 Connected to Firebase emulators');
    }
    catch (error) {
        console.log('⚠️ Firebase emulators connection attempted (may already be connected)');
    }
}
// Initialize analytics in browser with measurement ID
let analytics = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    try {
        // Dynamic import to avoid SSR issues
        import('firebase/analytics').then(({ getAnalytics }) => {
            analytics = getAnalytics(app);
            console.log('📊 Firebase Analytics initialized');
        }).catch((error) => {
            console.log('⚠️ Analytics failed to load:', error);
        });
    }
    catch (error) {
        console.log('⚠️ Analytics initialization error:', error);
    }
}
export { analytics };
