import React from 'react';
import { useAuthStore } from '../stores/auth';
import ObservationsPage from '../components/features/observations/ObservationsPage';
import TeacherObservationsView from '../components/features/observations/TeacherObservationsView';
import ObserverObservationsView from '../components/features/observations/ObserverObservationsView';

/**
 * Role-based routing for observations page
 *
 * - Teachers (educator): See only past completed observations, can add comments, view insights
 * - Observers: See observations they've conducted with quick create capability
 * - Managers/Admins: See all observations with full management capabilities
 */
export default function ObservationsPageRoleRouter() {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return null;
  }

  // Teachers get the restricted view (past observations only, no scheduling)
  if (user.primaryRole === 'educator') {
    return <TeacherObservationsView />;
  }

  // Observers get their own observations view with quick create
  if (user.primaryRole === 'observer') {
    return <ObserverObservationsView />;
  }

  // Managers and administrators get full observation management
  return <ObservationsPage />;
}
