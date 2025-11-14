import React from 'react';
import AuthWrapper from './AuthWrapper';
import AdminDashboard from '../admin/AdminDashboard';

interface AuthAdminWrapperProps {
  defaultTab?: 'overview' | 'users' | 'organizations' | 'applets' | 'system';
}

const AuthAdminWrapper: React.FC<AuthAdminWrapperProps> = ({ defaultTab = 'overview' }) => {
  return (
    <AuthWrapper 
      requireAuth={true}
      requireRoles={['super_admin', 'administrator']}
    >
      <AdminDashboard defaultTab={defaultTab} />
    </AuthWrapper>
  );
};

export default AuthAdminWrapper;
