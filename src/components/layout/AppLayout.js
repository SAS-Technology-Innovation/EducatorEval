import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';
const AppLayout = ({ children, currentPath }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Sidebar, { currentPath: currentPath }), _jsxs("div", { className: `transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`, children: [_jsx("header", { className: "bg-white border-b border-gray-200 sticky top-0 z-30", children: _jsxs("div", { className: "px-6 py-3 flex items-center justify-between", children: [_jsx("div", { className: "flex-1 max-w-lg", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search observations, users, goals...", className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }) }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("button", { className: "relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(Bell, { className: "w-5 h-5" }), _jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" })] }) })] }) }), _jsx("main", { className: "p-6", children: children })] })] }));
};
export default AppLayout;
