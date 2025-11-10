import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppProviders from './components/providers/AppProviders';
import AppLayout from './components/layout/AppLayout';
import CRPLandingDashboard from './components/dashboard/CRPLandingDashboard';
import LoginForm from './components/auth/LoginForm';
import { useAuthStore } from './stores/auth';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrganizations from './pages/admin/Organizations';
import AdminFrameworks from './pages/admin/Frameworks';

// User pages
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProviders requireAuth={false}>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedLayout><CRPLandingDashboard /></ProtectedLayout>} />
        <Route path="/dashboard" element={<ProtectedLayout><CRPLandingDashboard /></ProtectedLayout>} />
        <Route path="/observations" element={<ProtectedLayout><CRPLandingDashboard /></ProtectedLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminDashboard /></ProtectedLayout>} />
        <Route path="/admin/users" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminUsers /></ProtectedLayout>} />
        <Route path="/admin/organizations" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminOrganizations /></ProtectedLayout>} />
        <Route path="/admin/frameworks" element={<ProtectedLayout requireRoles={['administrator', 'super_admin']}><AdminFrameworks /></ProtectedLayout>} />

        {/* User routes */}
        <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
      </Routes>
    </AppProviders>
  );
}

// Login page component
function LoginPage() {
  const user = useAuthStore(state => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
  const location = window.location.pathname;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRoles && !requireRoles.includes(user.primaryRole)) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout currentPath={location}>
      {children}
    </AppLayout>
  );
}

export default App;
