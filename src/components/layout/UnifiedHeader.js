import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, Home, BarChart3, Book, Calendar, Users, Settings, ChevronDown, Target, UserCircle } from 'lucide-react';
import UserProfileDropdown from '../common/UserProfileDropdown';
import { useAuthStore } from '../../stores/auth';
const UnifiedHeader = ({ currentPath = '/', onNavigate, showBreadcrumb = false, breadcrumbItems = [] }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notificationCount, setNotificationCount] = useState(3);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showPlatformMenu, setShowPlatformMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    // Navigation items
    const platformItems = [
        {
            id: 'home',
            label: 'Home',
            icon: _jsx(Home, { className: "w-4 h-4" }),
            href: '/',
            description: 'Main dashboard and overview'
        },
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: _jsx(BarChart3, { className: "w-4 h-4" }),
            href: '/dashboard',
            description: 'Analytics and insights'
        },
        {
            id: 'observations',
            label: 'Observations',
            icon: _jsx(Book, { className: "w-4 h-4" }),
            href: '/observations',
            description: 'CRP observations and professional learning'
        },
        {
            id: 'professional-learning',
            label: 'Goals',
            icon: _jsx(Target, { className: "w-4 h-4" }),
            href: '/professional-learning',
            description: 'Professional learning and SMART goals'
        },
        {
            id: 'schedule',
            label: 'Schedule',
            icon: _jsx(Calendar, { className: "w-4 h-4" }),
            href: '/schedule',
            description: 'Class schedules and calendar'
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: _jsx(UserCircle, { className: "w-4 h-4" }),
            href: '/profile',
            description: 'Your profile and settings'
        }
    ];
    const adminItems = [
        {
            id: 'admin-dashboard',
            label: 'Admin Dashboard',
            icon: _jsx(BarChart3, { className: "w-4 h-4" }),
            href: '/admin/dashboard',
            description: 'CRP in Action admin overview'
        },
        {
            id: 'admin-users',
            label: 'User Management',
            icon: _jsx(Users, { className: "w-4 h-4" }),
            href: '/admin/users',
            description: 'Manage users and permissions'
        },
        {
            id: 'admin-orgs',
            label: 'Organizations',
            icon: _jsx(Users, { className: "w-4 h-4" }),
            href: '/admin/organizations',
            description: 'Manage schools and divisions'
        },
        {
            id: 'admin-settings',
            label: 'System Settings',
            icon: _jsx(Settings, { className: "w-4 h-4" }),
            href: '/admin/settings',
            description: 'Configure system settings'
        }
    ];
    // Get auth state from store
    const { user, isAuthenticated, isLoading, initialize } = useAuthStore();
    useEffect(() => {
        // Initialize auth listener
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);
    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            setUserProfile({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.photoURL,
                primaryRole: user.primaryRole,
                divisionNames: [],
                departmentNames: []
            });
        }
        else {
            setCurrentUser(null);
            setUserProfile(null);
        }
        setLoading(isLoading);
    }, [user, isLoading]);
    // Get signOut from auth store
    const { signOut } = useAuthStore();
    const handleSignOut = async () => {
        try {
            await signOut();
            handleNavigation('/');
        }
        catch (error) {
            console.error('Sign out failed:', error);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            handleNavigation(`/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
            setShowSearch(false);
        }
    };
    const handleNavigation = (href) => {
        // Use both the provided handler and browser navigation
        if (onNavigate) {
            onNavigate(href);
        }
        else {
            // Fallback to direct navigation if no handler provided
            window.location.href = href;
        }
        setShowPlatformMenu(false);
        setShowMobileMenu(false);
        setShowSearch(false);
    };
    const getCurrentSection = () => {
        if (currentPath?.startsWith('/admin/'))
            return 'admin';
        return 'platform';
    };
    // Check if user is admin (for applet management visibility)
    const isAdmin = () => {
        return userProfile && ['super_admin', 'administrator'].includes(userProfile.primaryRole);
    };
    const isActive = (href) => {
        if (href === '/' && currentPath === '/')
            return true;
        if (href !== '/' && currentPath?.startsWith(href))
            return true;
        return false;
    };
    return (_jsxs("header", { className: "bg-white shadow-sm border-b border-sas-gray-200 sticky top-0 z-50", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => setShowMobileMenu(!showMobileMenu), className: "lg:hidden p-2 rounded-md text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 transition-colors", children: showMobileMenu ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("img", { src: "https://resources.finalsite.net/images/v1736450683/sas/q9u7ppfdasutt8sglmzh/school-logo.svg", alt: "Singapore American School", className: "h-10 w-auto" }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("h1", { className: "text-xl font-bebas text-sas-navy-600 tracking-wider", children: "EducatorEval" }), _jsx("p", { className: "text-xs text-sas-gray-500 font-poppins font-medium -mt-1", children: "Singapore American School" })] })] }), _jsxs("nav", { className: "hidden lg:flex items-center space-x-1", children: [platformItems.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: `flex items-center px-3 py-2 rounded-lg text-sm font-medium font-poppins transition-colors ${isActive(item.href) ? 'bg-sas-navy-100 text-sas-navy-700' : 'text-sas-gray-600 hover:text-sas-navy-600 hover:bg-sas-gray-50'}`, children: [item.icon, _jsx("span", { className: "ml-2", children: item.label })] }, item.id))), isAdmin() && (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowPlatformMenu(!showPlatformMenu), className: `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${getCurrentSection() === 'admin' ? 'bg-sas-gray-100 text-sas-gray-700' : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-50'}`, children: ["Admin", _jsx(ChevronDown, { className: "w-4 h-4 ml-1" })] }), showPlatformMenu && (_jsx("div", { className: "absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-sas-gray-200 py-2", children: adminItems.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: `w-full flex items-start px-4 py-3 text-left hover:bg-sas-gray-50 transition-colors ${isActive(item.href) ? 'bg-sas-blue-50 text-sas-blue-700' : 'text-sas-gray-700'}`, children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: item.icon }), _jsxs("div", { className: "ml-3", children: [_jsx("div", { className: "font-medium text-sm", children: item.label }), _jsx("div", { className: "text-xs text-sas-gray-500", children: item.description })] })] }, item.id))) }))] }))] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => setShowSearch(!showSearch), className: "p-2 text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 rounded-lg transition-colors", title: "Search", children: _jsx(Search, { className: "w-6 h-6" }) }), _jsxs("button", { onClick: () => handleNavigation('/notifications'), className: "relative p-2 text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 rounded-lg transition-colors", children: [_jsx(Bell, { className: "w-6 h-6" }), notificationCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold", children: notificationCount > 9 ? '9+' : notificationCount }))] }), loading ? (_jsx("div", { className: "w-8 h-8 bg-sas-gray-200 rounded-full animate-pulse" })) : currentUser && userProfile ? (_jsx(UserProfileDropdown, { user: userProfile, onSignOut: handleSignOut, onNavigate: handleNavigation, notificationCount: notificationCount })) : (_jsx("button", { onClick: () => handleNavigation('/login'), className: "px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors text-sm font-medium", children: "Sign In" }))] })] }), showBreadcrumb && breadcrumbItems.length > 0 && (_jsx("div", { className: "border-t border-sas-gray-200 px-4 py-2", children: _jsx("nav", { className: "flex items-center space-x-2 text-sm", children: breadcrumbItems.map((item, index) => (_jsxs(React.Fragment, { children: [index > 0 && _jsx("span", { className: "text-sas-gray-400", children: "/" }), item.href ? (_jsx("button", { onClick: () => onNavigate?.(item.href), className: "text-sas-blue-600 hover:text-sas-blue-700", children: item.label })) : (_jsx("span", { className: "text-sas-gray-900 font-medium", children: item.label }))] }, index))) }) }))] }), showMobileMenu && (_jsx("div", { className: "lg:hidden bg-white border-t border-sas-gray-200", children: _jsxs("div", { className: "px-4 py-4 space-y-2", children: [platformItems.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: `w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${isActive(item.href) ? 'bg-sas-blue-100 text-sas-blue-700' : 'text-sas-gray-600 hover:bg-sas-gray-50'}`, children: [item.icon, _jsx("span", { className: "ml-3", children: item.label })] }, item.id))), isAdmin() && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-sm font-semibold text-sas-gray-900 mb-2 mt-4", children: "Admin" }), adminItems.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: `w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${isActive(item.href) ? 'bg-sas-blue-100 text-sas-blue-700' : 'text-sas-gray-600 hover:bg-sas-gray-50'}`, children: [item.icon, _jsx("span", { className: "ml-3", children: item.label })] }, item.id)))] }))] }) })), showSearch && (_jsx("div", { className: "bg-white border-t border-sas-gray-200 shadow-md", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "py-4", children: [_jsxs("form", { onSubmit: handleSearch, className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Search, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search users, observations, schools, frameworks...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-12 pr-12 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm", autoFocus: true }), _jsx("button", { type: "button", onClick: () => setShowSearch(false), className: "absolute inset-y-0 right-0 pr-4 flex items-center text-sas-gray-400 hover:text-sas-gray-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [_jsx("span", { className: "text-xs text-sas-gray-500", children: "Quick searches:" }), _jsx("button", { onClick: () => handleNavigation('/observations'), className: "text-xs px-3 py-1 bg-sas-gray-100 text-sas-gray-700 rounded-full hover:bg-sas-gray-200 transition-colors", children: "Recent Observations" }), _jsx("button", { onClick: () => handleNavigation('/admin/users'), className: "text-xs px-3 py-1 bg-sas-gray-100 text-sas-gray-700 rounded-full hover:bg-sas-gray-200 transition-colors", children: "Users" }), _jsx("button", { onClick: () => handleNavigation('/dashboard'), className: "text-xs px-3 py-1 bg-sas-gray-100 text-sas-gray-700 rounded-full hover:bg-sas-gray-200 transition-colors", children: "Dashboard Analytics" })] })] }) }) })), showPlatformMenu && (_jsx("div", { className: "fixed inset-0 z-40", onClick: () => {
                    setShowPlatformMenu(false);
                } })), showSearch && (_jsx("div", { className: "fixed inset-0 z-30", onClick: () => setShowSearch(false) }))] }));
};
export default UnifiedHeader;
