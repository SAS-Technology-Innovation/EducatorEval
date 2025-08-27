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
import { usersService } from '../lib/firestore';
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
  initialize: () => () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  
  // Helper methods
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  canObserve: () => boolean;
  canManage: () => boolean;
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
            console.log('🔍 Checking for existing user:', firebaseUser.email, 'UID:', firebaseUser.uid);
            
            // STEP 1: Try to load user profile data from Firestore by UID first
            let userData: User | null = null;
            try {
              userData = await usersService.getById(firebaseUser.uid) as User | null;
              if (userData) {
                console.log('✅ Found existing user by UID:', userData.email);
                // Update last login
                await usersService.update(firebaseUser.uid, { 
                  lastLogin: new Date(),
                  updatedAt: new Date()
                });
              }
            } catch (uidError: any) {
              console.log('UID lookup failed (user may not exist):', uidError.message);
            }
            
            // STEP 2: If not found by UID, search by email to find existing records
            if (!userData && firebaseUser.email) {
              console.log('🔍 Searching for existing user by email...');
              try {
                // Query all users to find by email (since we can't query Firestore by email field directly)
                const allUsers = await usersService.list();
                const existingUserByEmail = allUsers.find((user: any) => user.email === firebaseUser.email) as User | undefined;
                
                if (existingUserByEmail) {
                  console.log('⚠️ Found existing user with different UID! Email:', existingUserByEmail.email, 'Existing UID:', existingUserByEmail.id);
                  console.log('🔧 This indicates a duplicate/orphaned record that should be cleaned up');
                  
                  // Option A: Use the existing record and update its UID to match Firebase Auth
                  // Option B: Delete the old record and create new one
                  // For now, we'll log it and not create a duplicate
                  userData = existingUserByEmail;
                }
              } catch (emailSearchError: any) {
                console.log('Email search failed:', emailSearchError.message);
              }
            }
            
            // STEP 3: Only create new user if NO existing record found AND user is authorized
            if (!userData && firebaseUser.email) {
              console.log('❓ No existing user record found for:', firebaseUser.email);
              
              // TODO: Add authorization check here
              // For now, we'll prevent auto-creation to stop duplicates
              console.log('⚠️ Auto-creation disabled to prevent duplicates');
              console.log('📧 Email:', firebaseUser.email);
              console.log('🆔 UID:', firebaseUser.uid);
              console.log('👤 Display Name:', firebaseUser.displayName);
              console.log('');
              console.log('🚫 User not found in authorized users database.');
              console.log('Please contact an administrator to create your user profile.');
              
              // Create minimal user object for session but don't save to database
              userData = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                employeeId: '',
                schoolId: '',
                divisionId: '',
                departmentId: '',
                primaryRole: 'staff',
                secondaryRoles: [],
                permissions: [],
                jobTitle: 'secretary',
                certifications: [],
                experience: '',
                subjects: [],
                grades: [],
                specializations: [],
                planningPeriods: [],
                languages: ['English'],
                isActive: false,
                accountStatus: 'unauthorized',
                lastLogin: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: { 
                  authOnly: true, 
                  needsAuthorization: true 
                }
              };
            }
            
            set({ 
              firebaseUser, 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } catch (error) {
            console.error('Failed to load user data:', error);
            
            // Create a minimal user object from Firebase Auth data
            const minimalUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              employeeId: `EMP-${firebaseUser.uid.slice(-6).toUpperCase()}`,
              schoolId: 'default-school',
              divisionId: 'general',
              departmentId: 'general',
              primaryRole: 'educator',
              secondaryRoles: [],
              permissions: ['view_own_profile'],
              jobTitle: 'teacher',
              certifications: [],
              experience: '',
              subjects: [],
              grades: [],
              specializations: [],
              planningPeriods: [],
              languages: ['English'],
              isActive: true,
              accountStatus: 'active',
              lastLogin: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              metadata: {}
            };
            
            set({ 
              firebaseUser,
              user: minimalUser,
              isAuthenticated: true,
              isLoading: false,
              error: null // Clear error since we have fallback data
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
        await usersService.update(user.id, updates);
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
      return hasRole('super_admin') || hasRole('administrator');
    },

    // Helper: Check if user can observe
    canObserve: () => {
      const { hasRole } = get();
      return hasRole('observer') || hasRole('manager') || hasRole('administrator') || hasRole('super_admin');
    },

    // Helper: Check if user can manage others
    canManage: () => {
      const { hasRole } = get();
      return hasRole('manager') || hasRole('administrator') || hasRole('super_admin');
    }
  }))
);
