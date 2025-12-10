import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { getRoleDisplayName, getJobTitleDisplayName } from '../../utils/roleMapping';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePermissions?: string[];
  requireRoles?: string[];
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  requireAuth = true,
  requirePermissions = [],
  requireRoles = []
}) => {
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    isAuthenticated,
    initialize,
    hasRole,
    hasPermission
  } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase auth listener
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role as any));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sas-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sas-blue-600 mx-auto mb-4" />
          <p className="text-sas-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth not required, show content immediately
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Show content if user is authenticated
  if (isAuthenticated && user) {
    // Check role requirements
    if (requireRoles.length > 0 && !hasAnyRole(requireRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-sas-background">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sas-red-500 to-sas-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-sas-gray-900 mb-4 font-serif">Access Denied</h1>
            <p className="text-sas-gray-600 mb-8">You don't have permission to access this area.</p>
            <button
              onClick={() => navigate('/app/dashboard')}
              className="bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto"
            >
              Return to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      );
    }

    // Check permission requirements
    if (requirePermissions.length > 0 && !hasAllPermissions(requirePermissions)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-sas-background">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sas-red-500 to-sas-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-sas-gray-900 mb-4 font-serif">Insufficient Permissions</h1>
            <p className="text-sas-gray-600 mb-8">You need additional permissions to access this feature.</p>
            <button
              onClick={() => navigate('/app/dashboard')}
              className="bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto"
            >
              Return to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      );
    }

    // User has access, show content
    return <>{children}</>;
  }

  // Show sign-in prompt for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-sas-background">
      <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
        <div className="w-16 h-16 bg-gradient-to-br from-sas-blue-500 to-sas-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-sas-gray-900 mb-4 font-serif">Welcome to EducatorEval</h1>
        <p className="text-sas-gray-600 mb-8">Please sign in to access your dashboard and manage your educational evaluations.</p>
        <Link
          to="/auth/login"
          className="bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl inline-flex items-center mx-auto"
        >
          Sign In
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default AuthWrapper;
