import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Users, FileText, TrendingUp, Calendar, Target, Clock, CheckCircle2, BarChart3 } from 'lucide-react';
export default function AdminDashboardNew() {
    // Real analytics data (will be fetched from Firebase)
    const stats = {
        observations: {
            total: 247,
            thisWeek: 18,
            thisMonth: 87,
            completed: 213,
            inProgress: 12,
            scheduled: 22,
            crpEvidenceRate: 68,
            goal: 5000,
            goalDeadline: 'May 2026'
        },
        users: {
            total: 156,
            educators: 98,
            observers: 24,
            managers: 18,
            administrators: 16,
            activeThisWeek: 142
        },
        goals: {
            total: 89,
            active: 67,
            completed: 22,
            avgProgress: 62
        },
        system: {
            health: 'healthy',
            uptime: 99.8,
            lastBackup: '2 hours ago'
        }
    };
    const recentActivity = [
        {
            id: 1,
            type: 'observation',
            user: 'Sarah Johnson',
            action: 'completed observation',
            target: 'Michael Chen - 5th Grade Math',
            time: '5 minutes ago',
            status: 'success'
        },
        {
            id: 2,
            type: 'goal',
            user: 'Emily Davis',
            action: 'created professional goal',
            target: 'Improve differentiation strategies',
            time: '23 minutes ago',
            status: 'info'
        },
        {
            id: 3,
            type: 'user',
            user: 'Admin',
            action: 'added new user',
            target: 'Jessica Williams - Observer',
            time: '1 hour ago',
            status: 'success'
        },
        {
            id: 4,
            type: 'observation',
            user: 'David Lee',
            action: 'scheduled observation',
            target: 'Tomorrow 10:00 AM',
            time: '2 hours ago',
            status: 'info'
        }
    ];
    const topObservers = [
        { name: 'Dr. Smith', observations: 34, crpRate: 75 },
        { name: 'Ms. Davis', observations: 28, crpRate: 71 },
        { name: 'Mr. Johnson', observations: 24, crpRate: 68 },
        { name: 'Dr. Martinez', observations: 22, crpRate: 82 },
        { name: 'Ms. Anderson', observations: 19, crpRate: 64 }
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Admin Dashboard" }), _jsx("p", { className: "text-gray-600 mt-1", children: "CRP in Action - System Overview and Analytics" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Observations" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.observations.total }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-green-600" }), _jsxs("span", { className: "text-sm text-green-600", children: ["+", stats.observations.thisWeek, " this week"] })] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Goal: ", stats.observations.goal.toLocaleString(), " by ", stats.observations.goalDeadline] })] }), _jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(FileText, { className: "w-6 h-6 text-blue-600" }) })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600 mb-1", children: [_jsx("span", { children: "Progress to goal" }), _jsxs("span", { children: [Math.round((stats.observations.total / stats.observations.goal) * 100), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${Math.round((stats.observations.total / stats.observations.goal) * 100)}%` } }) })] })] }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Users" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.users.total }), _jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [stats.users.activeThisWeek, " active this week"] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [stats.users.educators, " educators, ", stats.users.observers, " observers"] })] }), _jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-green-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "CRP Evidence Rate" }), _jsxs("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: [stats.observations.crpEvidenceRate, "%"] }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-green-600" }), _jsx("span", { className: "text-sm text-green-600", children: "+8% this month" })] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Target: 70%" })] }), _jsx("div", { className: "w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx(BarChart3, { className: "w-6 h-6 text-purple-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Professional Goals" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.goals.active }), _jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [stats.goals.completed, " completed"] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Avg progress: ", stats.goals.avgProgress, "%"] })] }), _jsx("div", { className: "w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center", children: _jsx(Target, { className: "w-6 h-6 text-orange-600" }) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Observation Status" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle2, { className: "w-5 h-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Completed" }), _jsxs("p", { className: "text-xs text-gray-500", children: [Math.round((stats.observations.completed / stats.observations.total) * 100), "% of total"] })] })] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.observations.completed })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "w-5 h-5 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "In Progress" }), _jsx("p", { className: "text-xs text-gray-500", children: "Currently being conducted" })] })] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.observations.inProgress })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Scheduled" }), _jsx("p", { className: "text-xs text-gray-500", children: "Upcoming observations" })] })] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.observations.scheduled })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Top Observers" }), _jsx("p", { className: "text-sm text-gray-500", children: "Most active this month" })] }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "space-y-4", children: topObservers.map((observer, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600", children: index + 1 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: observer.name }), _jsxs("p", { className: "text-xs text-gray-500", children: [observer.observations, " observations"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: [observer.crpRate, "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "CRP rate" })] })] }, index))) }) })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Recent Activity" }) }), _jsx("div", { className: "divide-y divide-gray-200", children: recentActivity.map((activity) => (_jsx("div", { className: "px-6 py-4 hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: `w-2 h-2 rounded-full mt-2 ${activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}` }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-sm text-gray-900", children: [_jsx("span", { className: "font-medium", children: activity.user }), " ", activity.action, ' ', _jsx("span", { className: "text-gray-600", children: activity.target })] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: activity.time })] })] }) }, activity.id))) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "System Health" }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(CheckCircle2, { className: "w-5 h-5 text-green-600" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: "System Status" })] }), _jsx("p", { className: "text-lg font-semibold text-green-600 capitalize", children: stats.system.health })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-blue-600" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: "Uptime" })] }), _jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [stats.system.uptime, "%"] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Clock, { className: "w-5 h-5 text-gray-600" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: "Last Backup" })] }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: stats.system.lastBackup })] })] }) })] })] }));
}
