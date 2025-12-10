import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppProviders from './app/components/providers/AppProviders';
import AppLayout from './app/components/layout/AppLayout';
import CRPLandingDashboard from './app/components/dashboard/CRPLandingDashboard';
import EnvironmentBanner from './app/components/common/EnvironmentBanner';
import { useAuthStore } from './app/stores/auth';

// Public pages
import LandingPage from './app/public/LandingPage';
import LoginForm from './app/components/auth/LoginForm';

// Admin pages
import AdminDashboard from './app/admin/Dashboard';
import AdminUsers from './app/admin/Users';
import AdminOrganizations from './app/admin/Organizations';
import AdminFrameworks from './app/admin/Frameworks';

// App pages (protected)
import DashboardPage from './app/app/DashboardPage';
import ObservationsPageRoleRouter from './app/app/ObservationsPageRoleRouter';
import SchedulePage from './app/app/SchedulePage';
import ProfessionalLearningPage from './app/app/ProfessionalLearningPage';
import ProfilePage from './app/app/ProfilePage';
import SettingsPage from './app/app/SettingsPage';

function App() {
  return (
    <AppProviders requireAuth={false}>
      <EnvironmentBanner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<LoginPage />} />
        <Route path="/auth/reset" element={<LoginPage />} />

        {/* Redirect old /login to /auth/login */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />

        {/* App routes (protected) */}
        <Route path="/app/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/app/observations" element={<ProtectedLayout><ObservationsPageRoleRouter /></ProtectedLayout>} />
        <Route path="/app/schedule" element={<ProtectedLayout><SchedulePage /></ProtectedLayout>} />
        <Route path="/app/professional-learning" element={<ProtectedLayout><ProfessionalLearningPage /></ProtectedLayout>} />
        <Route path="/app/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
        <Route path="/app/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />

        {/* Redirect old routes to new app/* paths */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/observations" element={<Navigate to="/app/observations" replace />} />
        <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminDashboard /></ProtectedLayout>} />
        <Route path="/admin/users" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminUsers /></ProtectedLayout>} />
        <Route path="/admin/organizations" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminOrganizations /></ProtectedLayout>} />
        <Route path="/admin/frameworks" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminFrameworks /></ProtectedLayout>} />
      </Routes>
    </AppProviders>
  );
}

// Login page component
function LoginPage() {
  const user = useAuthStore(state => state.user);

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-sas-background flex items-center justify-center">
      <LoginForm />
    </div>
  );
}

// Protected layout wrapper
interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireRoles?: string[];
}

function ProtectedLayout({ children, requireRoles }: ProtectedLayoutProps) {
  const user = useAuthStore(state => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requireRoles && !requireRoles.includes(user.primaryRole)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <AppLayout currentPath={location.pathname}>
      {children}
    </AppLayout>
  );
}

export default App;
