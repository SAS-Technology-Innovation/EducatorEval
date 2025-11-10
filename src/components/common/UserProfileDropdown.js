import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Bell, Moon, Sun, HelpCircle, ChevronDown, Shield, Calendar } from 'lucide-react';
const UserProfileDropdown = ({ user, onSignOut, onNavigate, notificationCount = 0, darkMode = false, onToggleDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const getInitials = () => {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };
    const getRoleDisplayName = (role) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };
    const handleMenuClick = (action) => {
        setIsOpen(false);
        switch (action) {
            case 'profile':
                onNavigate?.('/profile');
                break;
            case 'settings':
                onNavigate?.('/settings');
                break;
            case 'notifications':
                onNavigate?.('/notifications');
                break;
            case 'schedule':
                onNavigate?.('/schedule');
                break;
            case 'help':
                onNavigate?.('/help');
                break;
            case 'admin':
                onNavigate?.('/admin');
                break;
            case 'signout':
                onSignOut();
                break;
            case 'darkmode':
                onToggleDarkMode?.();
                break;
            default:
                break;
        }
    };
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center space-x-2 p-2 rounded-lg hover:bg-sas-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sas-blue-500", children: [_jsxs("div", { className: "relative", children: [user.avatar ? (_jsx("img", { src: user.avatar, alt: `${user.firstName} ${user.lastName}`, className: "w-8 h-8 rounded-full object-cover" })) : (_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-sm font-semibold text-white", children: getInitials() }) })), notificationCount > 0 && (_jsx("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-xs text-white font-bold", children: notificationCount > 9 ? '9+' : notificationCount }) }))] }), _jsxs("div", { className: "hidden md:block text-left", children: [_jsxs("div", { className: "text-sm font-medium text-sas-gray-900 font-poppins", children: [user.firstName, " ", user.lastName] }), _jsx("div", { className: "text-xs text-sas-gray-500 font-poppins", children: getRoleDisplayName(user.primaryRole) })] }), _jsx(ChevronDown, { className: `w-4 h-4 text-sas-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}` })] }), isOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-sas-gray-200 z-50", children: [_jsx("div", { className: "px-4 py-3 border-b border-sas-gray-200", children: _jsxs("div", { className: "flex items-center space-x-3", children: [user.avatar ? (_jsx("img", { src: user.avatar, alt: `${user.firstName} ${user.lastName}`, className: "w-12 h-12 rounded-full object-cover" })) : (_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-lg font-semibold text-white", children: getInitials() }) })), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "font-semibold text-sas-gray-900 font-poppins", children: [user.firstName, " ", user.lastName] }), _jsx("div", { className: "text-sm text-sas-gray-600 font-poppins", children: user.email }), _jsxs("div", { className: "text-xs text-sas-gray-500 mt-1 font-poppins", children: [user.title || getRoleDisplayName(user.primaryRole), user.schoolName && (_jsxs("span", { children: [" \u2022 ", user.schoolName] }))] }), user.divisionNames && user.divisionNames.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: user.divisionNames.map((division, index) => (_jsx("span", { className: "px-2 py-0.5 text-xs bg-sas-blue-100 text-sas-blue-700 rounded-full", children: division }, index))) }))] })] }) }), _jsxs("div", { className: "py-2", children: [_jsxs("button", { onClick: () => handleMenuClick('profile'), className: "flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors", children: [_jsx(User, { className: "w-4 h-4 mr-3" }), "My Profile"] }), _jsxs("button", { onClick: () => handleMenuClick('schedule'), className: "flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors", children: [_jsx(Calendar, { className: "w-4 h-4 mr-3" }), "My Schedule"] }), _jsxs("button", { onClick: () => handleMenuClick('notifications'), className: "flex items-center justify-between w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Bell, { className: "w-4 h-4 mr-3" }), "Notifications"] }), notificationCount > 0 && (_jsx("span", { className: "px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full", children: notificationCount }))] }), _jsx("div", { className: "border-t border-sas-gray-200 my-2" }), _jsxs("button", { onClick: () => handleMenuClick('settings'), className: "flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors", children: [_jsx(Settings, { className: "w-4 h-4 mr-3" }), "Settings"] }), onToggleDarkMode && (_jsxs("button", { onClick: () => handleMenuClick('darkmode'), className: "flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors", children: [darkMode ? (_jsx(Sun, { className: "w-4 h-4 mr-3" })) : (_jsx(Moon, { className: "w-4 h-4 mr-3" })), darkMode ? 'Light Mode' : 'Dark Mode'] })), ['head_of_school', 'principal', 'assistant_principal', 'system_admin'].includes(user.primaryRole) && (_jsxs("button", { onClick: () => handleMenuClick('admin'), className: "flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors", children: [_jsx(Shield, { className: "w-4 h-4 mr-3" }), "Admin Dashboard"] })), _jsx("div", { className: "border-t border-sas-gray-200 my-2" }), _jsxs("button", { onClick: () => handleMenuClick('help'), className: "flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors", children: [_jsx(HelpCircle, { className: "w-4 h-4 mr-3" }), "Help & Support"] }), _jsxs("button", { onClick: () => handleMenuClick('signout'), className: "flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors", children: [_jsx(LogOut, { className: "w-4 h-4 mr-3" }), "Sign Out"] })] }), _jsx("div", { className: "px-4 py-3 bg-sas-gray-50 border-t border-sas-gray-200 text-xs text-sas-gray-500", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "EducatorEval Platform" }), _jsx("span", { children: "v2.0.0" })] }) })] }))] }));
};
export default UserProfileDropdown;
