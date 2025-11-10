import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Users, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../api/api';
const AdminDashboardTest = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalSchools: 0,
        systemHealth: 'loading'
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadStats();
    }, []);
    const loadStats = async () => {
        setLoading(true);
        try {
            console.log('Loading admin stats...');
            const [users, schools] = await Promise.all([
                api.users.list(),
                api.schools.list()
            ]);
            const activeUsers = users.filter(u => u.isActive).length;
            setStats({
                totalUsers: users.length,
                activeUsers,
                totalSchools: schools.length,
                systemHealth: activeUsers > users.length * 0.8 ? 'healthy' : 'warning'
            });
        }
        catch (error) {
            console.error('Error loading stats:', error);
            setStats(prev => ({ ...prev, systemHealth: 'error' }));
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-lg", children: "Loading Admin Dashboard..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Simple Admin Dashboard Test" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Testing Priority 2 functionality" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [stats.systemHealth === 'healthy' && _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), stats.systemHealth === 'warning' && _jsx(AlertCircle, { className: "w-5 h-5 text-yellow-500" }), stats.systemHealth === 'error' && _jsx(AlertCircle, { className: "w-5 h-5 text-red-500" }), _jsxs("span", { className: "text-sm text-gray-600", children: ["System ", stats.systemHealth] })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.totalUsers })] }), _jsx(Users, { className: "w-8 h-8 text-blue-600" })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Active Users" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.activeUsers })] }), _jsx(Users, { className: "w-8 h-8 text-green-600" })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Schools" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: stats.totalSchools })] }), _jsx(Building2, { className: "w-8 h-8 text-purple-600" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Dashboard Status" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), _jsx("span", { children: "Enhanced API client loaded successfully" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), _jsxs("span", { children: ["Mock data initialized with ", stats.totalUsers, " users"] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), _jsxs("span", { children: ["School data loaded (", stats.totalSchools, " schools)"] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [stats.systemHealth === 'healthy' ? (_jsx(CheckCircle, { className: "w-5 h-5 text-green-500" })) : (_jsx(AlertCircle, { className: "w-5 h-5 text-yellow-500" })), _jsxs("span", { children: ["System health: ", stats.systemHealth] })] })] }), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: loadStats, className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors", children: "Refresh Data" }) })] })] })] }));
};
export default AdminDashboardTest;
