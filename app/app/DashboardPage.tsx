import { useAuthStore } from '../stores/auth';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import ObserverDashboard from '../components/dashboard/ObserverDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import StaffDashboard from '../components/dashboard/StaffDashboard';
import AdminDashboard from '../admin/Dashboard';

/**
 * Smart Dashboard Router
 *
 * Routes to the appropriate dashboard based on the user's active role:
 * - Administrator/Super Admin → AdminDashboard
 * - Manager → ManagerDashboard
 * - Observer → ObserverDashboard
 * - Educator → TeacherDashboard
 * - Staff → StaffDashboard
 */
export default function DashboardPage() {
  const activeRole = useAuthStore(state => state.activeRole);
  const user = useAuthStore(state => state.user);

  // If no active role set, default to primary role
  const currentRole = activeRole || user?.primaryRole;

  // Route to appropriate dashboard based on active role
  if (currentRole === 'administrator' || currentRole === 'super_admin') {
    return <AdminDashboard />;
  }

  if (currentRole === 'manager') {
    return <ManagerDashboard />;
  }

  if (currentRole === 'observer') {
    return <ObserverDashboard />;
  }

  if (currentRole === 'educator') {
    return <TeacherDashboard />;
  }

  // Default to staff dashboard for staff role or unknown roles
  return <StaffDashboard />;
}
