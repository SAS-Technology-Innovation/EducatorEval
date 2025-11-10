import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '../../stores/auth';
import { Home, BarChart3, Book, Target, Calendar, Users, Building2, Settings, ChevronLeft, ChevronRight, LogOut, Shield } from 'lucide-react';
const Sidebar = ({ currentPath = '/' }) => {
    const { user, hasRole, signOut } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const mainNavItems = [
        {
            id: 'home',
            label: 'Home',
            icon: _jsx(Home, { className: "w-5 h-5" }),
            href: '/'
        },
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: _jsx(BarChart3, { className: "w-5 h-5" }),
            href: '/dashboard'
        },
        {
            id: 'observations',
            label: 'Observations',
            icon: _jsx(Book, { className: "w-5 h-5" }),
            href: '/observations'
        },
        {
            id: 'goals',
            label: 'Professional Learning',
            icon: _jsx(Target, { className: "w-5 h-5" }),
            href: '/professional-learning'
        },
        {
            id: 'schedule',
            label: 'Schedule',
            icon: _jsx(Calendar, { className: "w-5 h-5" }),
            href: '/schedule'
        }
    ];
    const adminNavItems = [
        {
            id: 'admin-dashboard',
            label: 'Admin Dashboard',
            icon: _jsx(Shield, { className: "w-5 h-5" }),
            href: '/admin/dashboard',
            roles: ['administrator', 'super_admin']
        },
        {
            id: 'admin-users',
            label: 'Users',
            icon: _jsx(Users, { className: "w-5 h-5" }),
            href: '/admin/users',
            roles: ['administrator', 'super_admin']
        },
        {
            id: 'admin-orgs',
            label: 'Organizations',
            icon: _jsx(Building2, { className: "w-5 h-5" }),
            href: '/admin/organizations',
            roles: ['administrator', 'super_admin']
        },
        {
            id: 'admin-frameworks',
            label: 'Frameworks',
            icon: _jsx(Book, { className: "w-5 h-5" }),
            href: '/admin/frameworks',
            roles: ['administrator', 'super_admin']
        },
        {
            id: 'admin-settings',
            label: 'System Settings',
            icon: _jsx(Settings, { className: "w-5 h-5" }),
            href: '/admin/settings',
            roles: ['administrator', 'super_admin']
        }
    ];
    const isActive = (href) => {
        if (href === '/' && currentPath === '/')
            return true;
        if (href !== '/' && currentPath?.startsWith(href))
            return true;
        return false;
    };
    const canAccessItem = (item) => {
        if (!item.roles)
            return true;
        return item.roles.some(role => hasRole(role));
    };
    const handleNavigation = (href) => {
        window.location.href = href;
    };
    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = '/login';
        }
        catch (error) {
            console.error('Sign out failed:', error);
        }
    };
    const visibleAdminItems = adminNavItems.filter(canAccessItem);
    const showAdminSection = visibleAdminItems.length > 0;
    return (_jsxs("aside", { className: `fixed left-0 top-0 h-screen bg-sas-navy-600 text-white transition-all duration-300 z-40 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`, children: [_jsx("div", { className: "p-4 border-b border-sas-navy-500", children: !collapsed ? (_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bebas tracking-wider", children: "EducatorEval" }), _jsx("p", { className: "text-xs text-sas-blue-200 mt-1", children: "Singapore American School" })] })) : (_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "w-8 h-8 bg-sas-red-500 rounded flex items-center justify-center font-bebas text-lg", children: "E" }) })) }), _jsxs("nav", { className: "flex-1 overflow-y-auto py-4", children: [_jsxs("div", { className: "px-3 mb-6", children: [!collapsed && (_jsx("h2", { className: "px-3 text-xs font-semibold text-sas-blue-200 uppercase tracking-wider mb-2", children: "Main" })), _jsx("div", { className: "space-y-1", children: mainNavItems.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: `w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                        ? 'bg-sas-navy-500 text-white'
                                        : 'text-sas-blue-100 hover:bg-sas-navy-500/50 hover:text-white'}`, title: collapsed ? item.label : undefined, children: [_jsx("span", { className: "flex-shrink-0", children: item.icon }), !collapsed && _jsx("span", { className: "ml-3", children: item.label })] }, item.id))) })] }), showAdminSection && (_jsxs("div", { className: "px-3 mb-6", children: [!collapsed && (_jsx("h2", { className: "px-3 text-xs font-semibold text-sas-orange-200 uppercase tracking-wider mb-2", children: "Administration" })), _jsx("div", { className: "space-y-1", children: visibleAdminItems.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: `w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                        ? 'bg-sas-red-500 text-white'
                                        : 'text-sas-orange-100 hover:bg-sas-red-500/50 hover:text-white'}`, title: collapsed ? item.label : undefined, children: [_jsx("span", { className: "flex-shrink-0", children: item.icon }), !collapsed && _jsx("span", { className: "ml-3", children: item.label }), !collapsed && item.badge && (_jsx("span", { className: "ml-auto bg-sas-red-500 text-white text-xs px-2 py-0.5 rounded-full", children: item.badge }))] }, item.id))) })] }))] }), _jsxs("div", { className: "border-t border-sas-navy-500 p-3", children: [user && (_jsx("div", { className: `mb-3 ${collapsed ? 'px-0' : 'px-3'}`, children: !collapsed ? (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "w-8 h-8 bg-sas-blue-400 rounded-full flex items-center justify-center text-sm font-semibold", children: [user.firstName?.[0], user.lastName?.[0]] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "text-sm font-medium text-white truncate", children: [user.firstName, " ", user.lastName] }), _jsx("p", { className: "text-xs text-sas-blue-200 truncate", children: user.primaryRole?.replace('_', ' ') })] })] })) : (_jsx("div", { className: "flex justify-center", children: _jsxs("div", { className: "w-8 h-8 bg-sas-blue-400 rounded-full flex items-center justify-center text-sm font-semibold", children: [user.firstName?.[0], user.lastName?.[0]] }) })) })), _jsxs("button", { onClick: handleSignOut, className: `w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-sas-blue-100 hover:bg-sas-navy-500 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`, title: collapsed ? 'Sign Out' : undefined, children: [_jsx(LogOut, { className: "w-5 h-5" }), !collapsed && _jsx("span", { className: "ml-3", children: "Sign Out" })] }), _jsx("button", { onClick: () => setCollapsed(!collapsed), className: "w-full mt-2 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-sas-blue-200 hover:bg-sas-navy-500 hover:text-white transition-colors", children: collapsed ? _jsx(ChevronRight, { className: "w-5 h-5" }) : _jsx(ChevronLeft, { className: "w-5 h-5" }) })] })] }));
};
export default Sidebar;
