// Authentication Hook
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  signInUser, 
  signOutUser, 
  resetPassword, 
  createUser,
  getCurrentUserProfile,
  SignInCredentials,
  SignUpData 
} from '../firebase/auth';
import { User, AuthState } from '../types';
import { shouldUseMockData, mockCurrentUser, mockAuth } from '../services/mockData';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: shouldUseMockData() ? mockCurrentUser : null,
    isAuthenticated: shouldUseMockData() ? mockCurrentUser !== null : false,
    isLoading: !shouldUseMockData()
  });
  
  const [error, setError] = useState<string | null>(null);

  // If using mock data, return mock auth immediately
  if (shouldUseMockData()) {
    return {
      user: mockCurrentUser,
      isAuthenticated: mockCurrentUser !== null,
      isLoading: false,
      error,
      signIn: async (credentials: SignInCredentials) => {
        try {
          const user = await mockAuth.signIn(credentials.email, credentials.password);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          return { user, error: null };
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
          setError(errorMessage);
          return { user: null, error: errorMessage };
        }
      },
      signOut: async () => {
        await mockAuth.signOut();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      },
      signUp: async (data: SignUpData) => {
        // Mock signup - in real implementation this would create a new user
        setError('Signup not implemented in mock mode');
        return { user: null, error: 'Signup not implemented in mock mode' };
      },
      resetPassword: async (email: string) => {
        setError('Password reset not implemented in mock mode');
        return { success: false, error: 'Password reset not implemented in mock mode' };
      },
      updateProfile: async (updates: Partial<User>) => {
        if (mockCurrentUser) {
          Object.assign(mockCurrentUser, updates);
          setAuthState({
            user: mockCurrentUser,
            isAuthenticated: true,
            isLoading: false
          });
          return { success: true, error: null };
        }
        return { success: false, error: 'No user logged in' };
      },
      switchRole: async (newRole: User['role']) => {
        if (mockCurrentUser) {
          mockCurrentUser.role = newRole;
          setAuthState({
            user: mockCurrentUser,
            isAuthenticated: true,
            isLoading: false
          });
          return { success: true, error: null };
        }
        return { success: false, error: 'No user logged in' };
      },
      clearError: () => setError(null)
    };
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userProfile = await getCurrentUserProfile(firebaseUser);
          if (userProfile) {
            setAuthState({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
              token: await firebaseUser.getIdToken()
            });
          } else {
            // User exists in Firebase Auth but not in Firestore
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (credentials: SignInCredentials): Promise<boolean> => {
    try {
      setError(null);
      const user = await signInUser(credentials);
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError(errorMessage);
      return false;
    }
  };

  // Sign up function (admin only)
  const signUp = async (userData: SignUpData): Promise<boolean> => {
    try {
      setError(null);
      const user = await createUser(userData);
      // Note: After creating a user, the admin should sign back in
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Account creation failed';
      setError(errorMessage);
      return false;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await signOutUser();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setError(errorMessage);
    }
  };

  // Password reset function
  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setError(null);
      await resetPassword(email);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setError(errorMessage);
      return false;
    }
  };

  // Permission check function
  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions?.includes(permission) || false;
  };

  // Role check function
  const hasRole = (role: string): boolean => {
    return authState.user?.role === role;
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'department'>>) => {
    try {
      setError(null);
      if (!authState.user) throw new Error('No authenticated user');
      
      // Update user profile in Firebase
      const updatedUser = { ...authState.user, ...updates };
      
      // TODO: Implement actual Firebase update
      // await updateUserProfile(authState.user.id, updates);
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
      return false;
    }
  };

  const switchRole = async (newRole: User['role']) => {
    try {
      setError(null);
      if (!authState.user) throw new Error('No authenticated user');
      
      // Check if user has permission for this role
      const hasPermission = authState.user.permissions.includes(`role.${newRole}`);
      if (!hasPermission) {
        throw new Error('You do not have permission to switch to this role');
      }
      
      // Update user role
      const updatedUser = { ...authState.user, role: newRole };
      
      // TODO: Implement actual Firebase role switch
      // await switchUserRole(authState.user.id, newRole);
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch role';
      setError(errorMessage);
      return false;
    }
  };

  return {
    ...authState,
    error,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    hasPermission,
    hasRole,
    updateProfile,
    switchRole,
    clearError: () => setError(null)
  };
};
