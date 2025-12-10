// Authentication Store using Zustand + Firebase Auth
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
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
  activeRole: UserRole | null; // Current role context the user is acting in
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  setActiveRole: (role: UserRole) => void; // Switch active role context

  // Helper methods
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  canObserve: () => boolean;
  canManage: () => boolean;
  getAvailableRoles: () => UserRole[]; // Get all roles user can switch between
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    firebaseUser: null,
    user: null,
    activeRole: null,
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

    // Sign up with email and password
    signUp: async (email: string, password: string, displayName: string) => {
      try {
        set({ isLoading: true, error: null });
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user profile in Firestore
        await usersService.create({
          id: userCredential.user.uid,
          email: email,
          displayName: displayName,
          role: 'educator', // Default role
          status: 'active',
          permissions: ['observations.view'],
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // User data will be loaded by the auth state listener
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Sign up failed',
          isLoading: false 
        });
        throw error;
      }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
      try {
        set({ isLoading: true, error: null });
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Check if user exists in Firestore, if not create profile
        let existingUser: any = null;
        try {
          existingUser = await usersService.getById(result.user.uid);
        } catch (error) {
          // User doesn't exist, create new profile
        }
        
        if (!existingUser) {
          await usersService.create({
            id: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
            role: 'educator', // Default role
            status: 'active',
            permissions: ['observations.view'],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        // User data will be loaded by the auth state listener
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Google sign in failed',
          isLoading: false 
        });
        throw error;
      }
    },

    // Send password reset email
    sendPasswordReset: async (email: string) => {
      try {
        set({ error: null });
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
        set({ error: errorMessage });
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
          activeRole: null,
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
            if (import.meta.env.DEV) console.log('🔍 Checking for existing user:', firebaseUser.email, 'UID:', firebaseUser.uid);
            
            // STEP 1: Try to load user profile data from Firestore by UID first
            let userData: User | null = null;
            try {
              userData = await usersService.getById(firebaseUser.uid) as User | null;
              if (userData) {
                if (import.meta.env.DEV) console.log('✅ Found existing user by UID:', userData.email);
                // Update last login
                await usersService.update(firebaseUser.uid, { 
                  lastLogin: new Date(),
                  updatedAt: new Date()
                });
              }
            } catch (uidError: unknown) {
              if (import.meta.env.DEV) console.log('UID lookup failed (user may not exist):', uidError instanceof Error ? uidError.message : 'Unknown error');
            }
            
            // STEP 2: If not found by UID, search by email to find existing records
            if (!userData && firebaseUser.email) {
              if (import.meta.env.DEV) console.log('🔍 Searching for existing user by email...');
              try {
                // Query all users to find by email (since we can't query Firestore by email field directly)
                const allUsers = await usersService.list();
                const existingUserByEmail = allUsers.find((u: Record<string, unknown>) => u.email === firebaseUser.email) as User | undefined;

                if (existingUserByEmail) {
                  if (import.meta.env.DEV) {
                    console.log('⚠️ Found existing user with different UID! Email:', existingUserByEmail.email, 'Existing UID:', existingUserByEmail.id);
                    console.log('🔧 This indicates a duplicate/orphaned record that should be cleaned up');
                  }

                  // Option A: Use the existing record and update its UID to match Firebase Auth
                  // Option B: Delete the old record and create new one
                  // For now, we'll log it and not create a duplicate
                  userData = existingUserByEmail;
                }
              } catch (emailSearchError: unknown) {
                if (import.meta.env.DEV) console.log('Email search failed:', emailSearchError instanceof Error ? emailSearchError.message : 'Unknown error');
              }
            }
            
            // STEP 3: Create new user if NO existing record found
            if (!userData && firebaseUser.email) {
              if (import.meta.env.DEV) console.log('➕ Creating new user profile for:', firebaseUser.email);
              
              // Auto-create user profile for development
              try {
                const newUserData = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                  lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                  displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  employeeId: `EMP-${firebaseUser.uid.slice(-6).toUpperCase()}`,
                  schoolId: 'sas-main',
                  divisionId: 'general',
                  departmentId: 'general',
                  primaryRole: 'educator' as const,
                  secondaryRoles: [],
                  permissions: ['observations.view', 'profile.edit'],
                  jobTitle: 'teacher' as const,
                  certifications: [],
                  experience: '',
                  subjects: [],
                  grades: [],
                  specializations: [],
                  planningPeriods: [],
                  languages: ['English'],
                  isActive: true,
                  accountStatus: 'active' as const,
                  lastLogin: new Date(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  metadata: { 
                    autoCreated: true,
                    source: 'firebase_auth'
                  }
                };
                
                userData = await usersService.create(newUserData) as User;
                if (import.meta.env.DEV) console.log('✅ Auto-created user profile:', userData?.email);

              } catch (createError) {
                if (import.meta.env.DEV) console.error('❌ Failed to auto-create user profile:', createError);
                
                // Fallback to minimal user object if Firestore creation fails
                userData = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                  lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                  displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  employeeId: `EMP-${firebaseUser.uid.slice(-6).toUpperCase()}`,
                  schoolId: 'sas-main',
                  divisionId: 'general',
                  departmentId: 'general',
                  primaryRole: 'educator',
                  secondaryRoles: [],
                  permissions: ['observations.view'],
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
                  metadata: { 
                    authOnly: true,
                    firestoreFailed: true
                  }
                };
              }
            }
            
            set({
              firebaseUser,
              user: userData,
              activeRole: userData?.primaryRole || null,
              isAuthenticated: true,
              isLoading: false
            });
          } catch (error) {
            if (import.meta.env.DEV) console.error('Failed to load user data:', error);
            
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
              activeRole: minimalUser.primaryRole,
              isAuthenticated: true,
              isLoading: false,
              error: null // Clear error since we have fallback data
            });
          }
        } else {
          set({
            firebaseUser: null,
            user: null,
            activeRole: null,
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
    },

    // Set active role context
    setActiveRole: (role: UserRole) => {
      const { user } = get();
      if (!user) return;

      // Verify user has this role
      const availableRoles = [user.primaryRole, ...user.secondaryRoles];
      if (availableRoles.includes(role)) {
        set({ activeRole: role });
      }
    },

    // Get all roles user can switch between
    getAvailableRoles: () => {
      const { user } = get();
      if (!user) return [];
      return [user.primaryRole, ...user.secondaryRoles];
    }
  }))
);
