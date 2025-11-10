import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Shield, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
const AuthWrapper = ({ children, requireAuth = true, requirePermissions = [], requireRoles = [] }) => {
    const { user, isLoading, isAuthenticated, initialize, hasRole, hasPermission } = useAuthStore();
    useEffect(() => {
        // Initialize Firebase auth listener
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);
    const hasAnyRole = (roles) => {
        return roles.some(role => hasRole(role));
    };
    const hasAllPermissions = (permissions) => {
        return permissions.every(permission => hasPermission(permission));
    };
    // Show loading spinner while auth is initializing
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "w-12 h-12 animate-spin text-sas-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-sas-gray-600", children: "Loading..." })] }) }));
    }
    // If auth not required, show content immediately
    if (!requireAuth) {
        return _jsx(_Fragment, { children: children });
    }
    // Show content if user is authenticated
    if (isAuthenticated && user) {
        // Check role requirements
        if (requireRoles.length > 0 && !hasAnyRole(requireRoles)) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsxs("div", { className: "text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-sas-red-500 to-sas-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6", children: _jsx(Shield, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-sas-gray-900 mb-4 font-serif", children: "Access Denied" }), _jsx("p", { className: "text-sas-gray-600 mb-8", children: "You don't have permission to access this area." }), _jsxs("button", { onClick: () => window.location.href = '/dashboard', className: "bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto", children: ["Return to Dashboard", _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }) }));
        }
        // Check permission requirements
        if (requirePermissions.length > 0 && !hasAllPermissions(requirePermissions)) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsxs("div", { className: "text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-sas-red-500 to-sas-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6", children: _jsx(Shield, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-sas-gray-900 mb-4 font-serif", children: "Insufficient Permissions" }), _jsx("p", { className: "text-sas-gray-600 mb-8", children: "You need additional permissions to access this feature." }), _jsxs("button", { onClick: () => window.location.href = '/dashboard', className: "bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto", children: ["Return to Dashboard", _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }) }));
        }
        // User has access, show content
        return _jsx(_Fragment, { children: children });
    }
    // Show sign-in prompt for unauthenticated users
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsxs("div", { className: "text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-sas-blue-500 to-sas-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6", children: _jsx(BookOpen, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-sas-gray-900 mb-4 font-serif", children: "Welcome to EducatorEval" }), _jsx("p", { className: "text-sas-gray-600 mb-8", children: "Please sign in to access your dashboard and manage your educational evaluations." }), _jsxs("a", { href: "/login", className: "bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto", children: ["Sign In", _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }) }));
};
export default AuthWrapper;
