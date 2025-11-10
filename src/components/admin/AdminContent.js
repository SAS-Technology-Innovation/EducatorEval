import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AdminDashboard from './AdminDashboard';
const AdminContent = ({ defaultTab = 'overview' }) => {
    // For now, we'll use the existing AdminDashboard but remove its header
    // TODO: Extract the content part of AdminDashboard without the header
    return (_jsxs("div", { className: "py-8", children: [_jsx("div", { className: "bg-white shadow-sm border-b border-sas-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 mb-8", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex justify-between items-center py-6", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-sas-gray-900 font-serif", children: "Admin Dashboard" }), _jsx("p", { className: "text-sas-gray-600 mt-1", children: "Complete platform administration" })] }) }) }) }), _jsx(AdminDashboard, { defaultTab: defaultTab })] }));
};
export default AdminContent;
