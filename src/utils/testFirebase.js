// @ts-nocheck
// Test Firebase Connection
import { auth, db } from '../lib/firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { usersService } from '../lib/firestore.js';

console.log('🔧 Testing Firebase connection...');
console.log('Auth:', auth);
console.log('DB:', db);

// Test auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('🔐 User is signed in:', user.email, user.uid);
  } else {
    console.log('🔓 No user signed in');
  }
});

// Test Firestore connection by listing users
async function testFirestore() {
  try {
    console.log('📊 Testing Firestore connection...');
    const users = await usersService.list({ limit: 5 });
    console.log('📋 Found users:', users.length);
    users.forEach(user => {
      console.log('👤 User:', user.email, user.displayName, user.id);
    });
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
  }
}

testFirestore();
