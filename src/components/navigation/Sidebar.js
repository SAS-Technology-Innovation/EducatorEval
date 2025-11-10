import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Home, BarChart3, Users, Building2, Settings, Book, Calendar, Puzzle, Shield } from 'lucide-react';
const Sidebar = ({ currentPath = '/', onNavigate, collapsed = false }) => {
    const sidebarItems = [
        {
            id: 'home',
            label: 'Home',
            icon: _jsx(Home, { className: "w-5 h-5" }),
            href: '/',
            active: currentPath === '/'
        },
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: _jsx(BarChart3, { className: "w-5 h-5" }),
            href: '/dashboard',
            active: currentPath === '/dashboard'
        },
        {
            id: 'observations',
            label: 'Observations',
            icon: _jsx(Book, { className: "w-5 h-5" }),
            href: '/observations',
            active: currentPath === '/observations'
        },
        {
            id: 'schedule',
            label: 'Schedule',
            icon: _jsx(Calendar, { className: "w-5 h-5" }),
            href: '/schedule',
            active: currentPath === '/schedule'
        },
        {
            id: 'admin',
            label: 'Administration',
            icon: _jsx(Shield, { className: "w-5 h-5" }),
            href: '/admin',
            active: currentPath.startsWith('/admin'),
            children: [
                {
                    id: 'users',
                    label: 'User Management',
                    icon: _jsx(Users, { className: "w-4 h-4" }),
                    href: '/admin/users',
                    active: currentPath === '/admin/users'
                },
                {
                    id: 'organizations',
                    label: 'Organizations',
                    icon: _jsx(Building2, { className: "w-4 h-4" }),
                    href: '/admin/organizations',
                    active: currentPath === '/admin/organizations'
                },
                {
                    id: 'applets',
                    label: 'Applets',
                    icon: _jsx(Puzzle, { className: "w-4 h-4" }),
                    href: '/admin/applets',
                    active: currentPath === '/admin/applets'
                }
            ]
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: _jsx(Settings, { className: "w-5 h-5" }),
            href: '/settings',
            active: currentPath === '/settings'
        }
    ];
    return (_jsx("div", { className: `
      bg-white shadow-sm border-r border-sas-gray-200 h-full
      ${collapsed ? 'w-16' : 'w-64'}
      transition-all duration-300
    `, children: _jsxs("div", { className: "p-4", children: [!collapsed && (_jsx("div", { className: "text-xl font-bold text-sas-blue-600 mb-8", children: "EducatorEval" })), _jsx("nav", { className: "space-y-2", children: sidebarItems.map((item) => (_jsxs("div", { children: [_jsxs("button", { onClick: () => onNavigate?.(item.href), className: `
                  w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                  ${item.active
                                    ? 'bg-sas-blue-100 text-sas-blue-700'
                                    : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-50'}
                `.trim(), title: collapsed ? item.label : undefined, children: [item.icon, !collapsed && _jsx("span", { className: "ml-3", children: item.label })] }), !collapsed && item.children && item.active && (_jsx("div", { className: "ml-6 mt-2 space-y-1", children: item.children.map((child) => (_jsxs("button", { onClick: () => onNavigate?.(child.href), className: `
                        w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-left
                        ${child.active
                                        ? 'bg-sas-blue-50 text-sas-blue-600'
                                        : 'text-sas-gray-500 hover:text-sas-gray-700 hover:bg-sas-gray-50'}
                      `.trim(), children: [child.icon, _jsx("span", { className: "ml-2", children: child.label })] }, child.id))) }))] }, item.id))) })] }) }));
};
export default Sidebar;
