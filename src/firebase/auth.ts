// Firebase Authentication Functions
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User, UserRole } from '../types';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  department: string;
}

/**
 * Sign in user with email and password
 */
export const signInUser = async ({ email, password }: SignInCredentials): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const userData = userDoc.data();
    
    // Update last login
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      lastLogin: new Date().toISOString()
    }, { merge: true });
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      permissions: userData.permissions || [],
      lastLogin: new Date().toISOString()
    };
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
};

/**
 * Create new user account (admin only)
 */
export const createUser = async (userData: SignUpData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const firebaseUser = userCredential.user;
    
    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: userData.name
    });
    
    // Create user profile in Firestore
    const userProfile: Omit<User, 'id'> = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      permissions: getDefaultPermissions(userData.role),
      lastLogin: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
    
    return {
      id: firebaseUser.uid,
      ...userProfile
    };
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
};

/**
 * Get current user profile from Firestore
 */
export const getCurrentUserProfile = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      permissions: userData.permissions || [],
      lastLogin: userData.lastLogin
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
};

/**
 * Get default permissions for user role
 */
const getDefaultPermissions = (role: UserRole): string[] => {
  switch (role) {
    case 'admin':
      return [
        'frameworks.read',
        'frameworks.write',
        'observations.read',
        'observations.write',
        'users.read',
        'users.write',
        'analytics.read',
        'data.import',
        'data.export'
      ];
    case 'coordinator':
      return [
        'frameworks.read',
        'frameworks.write',
        'observations.read',
        'analytics.read',
        'data.export'
      ];
    case 'observer':
      return [
        'frameworks.read',
        'observations.write',
        'observations.read.own',
        'teachers.read'
      ];
    case 'teacher':
      return [
        'observations.read.own'
      ];
    default:
      return [];
  }
};

/**
 * Get user-friendly error messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    default:
      return 'An authentication error occurred. Please try again.';
  }
};
