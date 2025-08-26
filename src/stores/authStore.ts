// Authentication Store using Zustand + Firebase Auth
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userApi } from '../lib/api';
import type { User, UserRole } from '../types';

interface AuthState {
  // State
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  
  // Helper methods
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  canObserve: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    firebaseUser: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,

    // Sign in with email and password
    signIn: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });
        await signInWithEmailAndPassword(auth, email, password);
        // User data will be loaded by the auth state listener
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Sign in failed',
          isLoading: false 
        });
        throw error;
      }
    },

    // Sign out
    signOut: async () => {
      try {
        await signOut(auth);
        set({ 
          firebaseUser: null, 
          user: null, 
          isAuthenticated: false,
          error: null
        });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Sign out failed' });
        throw error;
      }
    },

    // Initialize auth listener
    initialize: () => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        set({ isLoading: true, error: null });
        
        if (firebaseUser) {
          try {
            // Load user profile data from Firestore
            const userData = await userApi.getById(firebaseUser.uid);
            set({ 
              firebaseUser, 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } catch (error) {
            console.error('Failed to load user data:', error);
            set({ 
              firebaseUser,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Failed to load user profile'
            });
          }
        } else {
          set({ 
            firebaseUser: null, 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      });

      // Return unsubscribe function for cleanup
      return unsubscribe;
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Update user profile
    updateUser: async (updates: Partial<User>) => {
      const { user } = get();
      if (!user) throw new Error('No user to update');
      
      try {
        await userApi.update(user.id, updates);
        set({ user: { ...user, ...updates } });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Update failed' });
        throw error;
      }
    },

    // Helper: Check if user has specific role
    hasRole: (role: UserRole) => {
      const { user } = get();
      if (!user) return false;
      return user.primaryRole === role || user.secondaryRoles.includes(role);
    },

    // Helper: Check if user has specific permission
    hasPermission: (permission: string) => {
      const { user } = get();
      if (!user) return false;
      return user.permissions.includes(permission);
    },

    // Helper: Check if user is an admin
    isAdmin: () => {
      const { hasRole } = get();
      return hasRole('super_admin') || 
             hasRole('district_admin') || 
             hasRole('school_admin') ||
             hasRole('principal');
    },

    // Helper: Check if user can observe
    canObserve: () => {
      const { hasRole } = get();
      return hasRole('observer') || 
             hasRole('principal') || 
             hasRole('assistant_principal') ||
             hasRole('instructional_coach') || 
             hasRole('plc_coach') || 
             hasRole('dei_specialist');
    }
  }))
);
