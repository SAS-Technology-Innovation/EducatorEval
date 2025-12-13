import AuthWrapper from './AuthWrapper';
import AdminDashboard from '../admin/AdminDashboard';

interface AuthAdminWrapperProps {
  defaultTab?: 'overview' | 'users' | 'organizations' | 'applets' | 'system';
}

// Note: defaultTab prop accepted for API compatibility but AdminDashboard doesn't use it yet
const AuthAdminWrapper: React.FC<AuthAdminWrapperProps> = ({ defaultTab: _defaultTab = 'overview' }) => {
  return (
    <AuthWrapper
      requireAuth={true}
      requireRoles={['super_admin', 'administrator']}
    >
      <AdminDashboard />
    </AuthWrapper>
  );
};

export default AuthAdminWrapper;
