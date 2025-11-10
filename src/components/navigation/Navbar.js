import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Home, BarChart3, Users, Settings, Book, Calendar } from 'lucide-react';
const Navbar = ({ currentPath = '/', onNavigate }) => {
    const navItems = [
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
            label: 'Admin',
            icon: _jsx(Users, { className: "w-5 h-5" }),
            href: '/admin',
            active: currentPath === '/admin'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: _jsx(Settings, { className: "w-5 h-5" }),
            href: '/settings',
            active: currentPath === '/settings'
        }
    ];
    return (_jsx("nav", { className: "bg-white shadow-sm border-b border-sas-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex items-center", children: _jsx("div", { className: "text-xl font-bold text-sas-blue-600", children: "EducatorEval" }) }) }), _jsx("div", { className: "hidden md:block", children: _jsx("div", { className: "ml-10 flex items-baseline space-x-4", children: navItems.map((item) => (_jsxs("button", { onClick: () => onNavigate?.(item.href), className: `
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${item.active
                                    ? 'bg-sas-blue-100 text-sas-blue-700'
                                    : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-50'}
                  `.trim(), children: [item.icon, _jsx("span", { className: "ml-2", children: item.label })] }, item.id))) }) }), _jsx("div", { className: "md:hidden", children: _jsx("button", { className: "text-sas-gray-500 hover:text-sas-gray-900", children: _jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) }) })] }) }) }));
};
export default Navbar;
