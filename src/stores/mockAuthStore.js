// Mock Authentication Store for Local Development
// Bypasses Firebase Auth entirely - use only in development!
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
// Mock user for development - MATCHES SEEDED DATA
const createMockUser = () => ({
    id: 'super-admin-001',
    email: 'admin@sas.edu.sg',
    firstName: 'Super',
    lastName: 'Admin',
    displayName: 'Super Admin',
    employeeId: 'EMP-ADMIN001',
    schoolId: 'sas-001',
    divisionId: 'high-school',
    departmentId: 'dept-leadership',
    primaryRole: 'super_admin',
    secondaryRoles: ['administrator', 'educator', 'observer'],
    permissions: [
        'observations.view',
        'observations.create',
        'observations.edit',
        'observations.delete',
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'profile.edit'
    ],
    jobTitle: 'teacher',
    certifications: [],
    experience: 'Development User',
    subjects: ['Computer Science'],
    grades: ['9', '10', '11', '12'],
    specializations: ['Web Development'],
    planningPeriods: [],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
        mockAuth: true,
        environment: 'development'
    }
});
export const useAuthStore = create()(subscribeWithSelector((set, get) => ({
    // Initial state - start with mock user already logged in
    firebaseUser: null,
    user: createMockUser(),
    isLoading: false,
    isAuthenticated: true,
    error: null,
    // Mock sign in - always succeeds
    signIn: async (email, password) => {
        console.log('🔧 [MOCK AUTH] Sign in called with:', email);
        set({ isLoading: true, error: null });
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        set({
            user: createMockUser(),
            isAuthenticated: true,
            isLoading: false
        });
    },
    // Mock sign up - always succeeds
    signUp: async (email, password, displayName) => {
        console.log('🔧 [MOCK AUTH] Sign up called with:', email, displayName);
        set({ isLoading: true, error: null });
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser = createMockUser();
        mockUser.email = email;
        mockUser.displayName = displayName;
        set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false
        });
    },
    // Mock Google sign in - always succeeds
    signInWithGoogle: async () => {
        console.log('🔧 [MOCK AUTH] Google sign in called');
        set({ isLoading: true, error: null });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({
            user: createMockUser(),
            isAuthenticated: true,
            isLoading: false
        });
    },
    // Mock password reset
    sendPasswordReset: async (email) => {
        console.log('🔧 [MOCK AUTH] Password reset called for:', email);
        await new Promise(resolve => setTimeout(resolve, 500));
    },
    // Mock sign out
    signOut: async () => {
        console.log('🔧 [MOCK AUTH] Sign out called');
        set({
            firebaseUser: null,
            user: null,
            isAuthenticated: false,
            error: null
        });
    },
    // Mock initialize - immediately returns with mock user
    initialize: () => {
        console.log('🔧 [MOCK AUTH] Initialize called - using mock authentication');
        set({
            user: createMockUser(),
            isAuthenticated: true,
            isLoading: false
        });
        // Return no-op unsubscribe function
        return () => {
            console.log('🔧 [MOCK AUTH] Unsubscribe called');
        };
    },
    // Clear error
    clearError: () => set({ error: null }),
    // Mock update user
    updateUser: async (updates) => {
        const { user } = get();
        if (!user)
            throw new Error('No user to update');
        console.log('🔧 [MOCK AUTH] Update user called with:', updates);
        await new Promise(resolve => setTimeout(resolve, 200));
        set({ user: { ...user, ...updates } });
    },
    // Helper: Check if user has specific role
    hasRole: (role) => {
        const { user } = get();
        if (!user)
            return false;
        return user.primaryRole === role || user.secondaryRoles.includes(role);
    },
    // Helper: Check if user has specific permission
    hasPermission: (permission) => {
        const { user } = get();
        if (!user)
            return false;
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
})));
