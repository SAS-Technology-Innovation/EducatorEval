import React from 'react';
import { useAuthStore } from '../stores/auth';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import ObserverDashboard from '../components/dashboard/ObserverDashboard';
import AdminDashboard from '../admin/Dashboard';

/**
 * Smart Dashboard Router
 *
 * Routes to the appropriate dashboard based on the user's active role:
 * - Administrator/Super Admin → AdminDashboard
 * - Observer → ObserverDashboard
 * - Educator/Staff/Manager → TeacherDashboard (default)
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

  if (currentRole === 'observer' || currentRole === 'manager') {
    return <ObserverDashboard />;
  }

  // Default to teacher dashboard for educator and staff
  return <TeacherDashboard />;
}
