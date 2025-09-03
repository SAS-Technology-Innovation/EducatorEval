// Authentication Hook
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { User, UserRole } from '../types';
import { shouldUseMockData } from '../services/mockData';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shouldUseMockData()) {
      // Mock user for development
      setUser({
        id: 'mock-user',
        name: 'Demo User',
        email: 'demo@educatoreval.com',
        role: 'observer',
        isActive: true
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const { userOperations } = await import('../firebase/firestore');
          const userData = await userOperations.getById(firebaseUser.uid);
          
          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role as UserRole,
              isActive: true
            });
          } else {
            // Create user profile if it doesn't exist
            const newUser = {
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'observer' as const,
              department: 'General',
              permissions: ['observation.view', 'observation.create']
            };
            
            await userOperations.create(newUser);
            setUser({
              id: firebaseUser.uid,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              isActive: true
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      if (!shouldUseMockData()) {
        await signOut(auth);
      }
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    
    // Admin can access everything
    if (user.role === 'admin') return true;
    
    // Check specific role
    return user.role === role;
  };

  return { user, loading, logout, hasRole };
};


