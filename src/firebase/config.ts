// Firebase Configuration
// Replace these values with your actual Firebase project configuration
// To get this configuration, go to Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
 apiKey: "AIzaSyC96VQ0JAYK2rwVGzikSWO_0RtLztR5BcI",
 authDomain: "educator-evaluations.firebaseapp.com",
 projectId: "educator-evaluations",
 storageBucket: "educator-evaluations.firebasestorage.app",
 messagingSenderId: "586497717614",
 appId: "1:586497717614:web:2a5b0c565b67675b73fd7f",
 measurementId: "G-HWXFM2W3E7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Export the app instance
export default app;
