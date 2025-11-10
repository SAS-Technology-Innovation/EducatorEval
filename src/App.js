import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(AppProviders, { requireAuth: false, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedLayout, { children: _jsx(CRPLandingDashboard, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedLayout, { children: _jsx(CRPLandingDashboard, {}) }) }), _jsx(Route, { path: "/observations", element: _jsx(ProtectedLayout, { children: _jsx(CRPLandingDashboard, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(ProtectedLayout, { requireRoles: ['administrator', 'super_admin'], children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/users", element: _jsx(ProtectedLayout, { requireRoles: ['administrator', 'super_admin'], children: _jsx(AdminUsers, {}) }) }), _jsx(Route, { path: "/admin/organizations", element: _jsx(ProtectedLayout, { requireRoles: ['administrator', 'super_admin'], children: _jsx(AdminOrganizations, {}) }) }), _jsx(Route, { path: "/admin/frameworks", element: _jsx(ProtectedLayout, { requireRoles: ['administrator', 'super_admin'], children: _jsx(AdminFrameworks, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedLayout, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedLayout, { children: _jsx(SettingsPage, {}) }) })] }) }));
}
// Login page component
function LoginPage() {
    const user = useAuthStore(state => state.user);
    if (user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsx(LoginForm, {}) }));
}
function ProtectedLayout({ children, requireRoles }) {
    const user = useAuthStore(state => state.user);
    const location = window.location.pathname;
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (requireRoles && !requireRoles.includes(user.primaryRole)) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsx(AppLayout, { currentPath: location, children: children }));
}
export default App;
