import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Calendar, Edit, Eye, Clock, Users, BarChart3, Target, FileText, Settings, Search, Play, CheckCircle, Brain } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useObservations } from '../../hooks/useObservations';
export default function CRPLandingDashboard() {
    const user = useAuthStore(state => state.user);
    const { data: observations = [], isLoading, error } = useObservations(user?.schoolId);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    // Determine user role
    const userRole = user?.primaryRole || 'educator';
    const isAdmin = userRole === 'super_admin' || userRole === 'administrator';
    const isObserver = userRole === 'observer' || isAdmin;
    const isCoordinator = userRole === 'manager' || isAdmin;
    const isTeacher = userRole === 'educator';
    // Mock stats data - will be replaced with real Firestore queries
    const stats = {
        totalObservations: observations.length,
        thisWeek: observations.filter(obs => {
            const date = new Date(obs.observationDate);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
        }).length,
        crpEvidenceRate: 68.4, // TODO: Calculate from real data
        myObservations: observations.filter(obs => obs.observerId === user?.id).length,
        drafts: observations.filter(obs => obs.status === 'draft' && obs.observerId === user?.id).length,
        scheduled: observations.filter(obs => obs.status === 'scheduled' && obs.observerId === user?.id).length,
        targetProgress: 24.9 // Progress toward 5,000 goal
    };
    const getStatusBadge = (status) => {
        const styles = {
            'completed': 'bg-green-100 text-green-800',
            'draft': 'bg-yellow-100 text-yellow-800',
            'scheduled': 'bg-blue-100 text-blue-800',
            'in_progress': 'bg-purple-100 text-purple-800'
        };
        const labels = {
            'completed': 'Completed',
            'draft': 'Draft',
            'scheduled': 'Scheduled',
            'in_progress': 'In Progress'
        };
        return (_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`, children: labels[status] || status }));
    };
    const getRoleSpecificActions = () => {
        const baseActions = [
            {
                icon: Plus,
                label: 'New Observation',
                action: 'create',
                description: 'Start a new 10-15 minute classroom observation',
                color: 'bg-blue-500 hover:bg-blue-600 text-white',
                href: '/observations/create'
            },
            {
                icon: Calendar,
                label: 'Schedule Observation',
                action: 'schedule',
                description: 'Plan upcoming classroom visits',
                color: 'bg-green-500 hover:bg-green-600 text-white',
                href: '/observations/schedule'
            }
        ];
        if (isAdmin) {
            return [
                ...baseActions,
                {
                    icon: BarChart3,
                    label: 'Analytics Dashboard',
                    action: 'analytics',
                    description: 'View AI-powered insights and trends',
                    color: 'bg-purple-500 hover:bg-purple-600 text-white',
                    href: '/analytics'
                },
                {
                    icon: Settings,
                    label: 'System Management',
                    action: 'settings',
                    description: 'Manage users, frameworks, and configurations',
                    color: 'bg-gray-500 hover:bg-gray-600 text-white',
                    href: '/admin'
                }
            ];
        }
        if (isCoordinator) {
            return [
                ...baseActions,
                {
                    icon: Users,
                    label: 'Team Overview',
                    action: 'team',
                    description: 'Monitor division observation progress',
                    color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
                    href: '/team'
                }
            ];
        }
        if (isTeacher) {
            return [
                {
                    icon: Eye,
                    label: 'My Observations',
                    action: 'my-observations',
                    description: 'View feedback from recent classroom visits',
                    color: 'bg-blue-500 hover:bg-blue-600 text-white',
                    href: '/observations/my'
                }
            ];
        }
        return baseActions;
    };
    const filteredObservations = observations
        .filter(obs => {
        if (isTeacher) {
            return obs.educatorId === user?.id; // Teachers see their own observations
        }
        if (isObserver && !isAdmin) {
            return obs.observerId === user?.id; // Observers see their own observations
        }
        return true; // Admins see all
    })
        .filter(obs => {
        if (filterStatus !== 'all' && obs.status !== filterStatus)
            return false;
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            // TODO: Add teacher name search when we have user data
            return obs.subjectArea?.toLowerCase().includes(searchLower);
        }
        return true;
    })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const handleQuickAction = (href) => {
        window.location.href = href;
    };
    const continueObservation = (observationId) => {
        window.location.href = `/observations/${observationId}/edit`;
    };
    const viewObservation = (observationId) => {
        window.location.href = `/observations/${observationId}`;
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading dashboard..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "px-6 py-4", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "CRP in Action Dashboard" }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["Welcome back, ", user?.displayName, " \u2022 ", user?.jobTitle, " \u2022 ", user?.divisionId] })] }) }) }) }), _jsxs("div", { className: "px-6 py-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: isAdmin ? 'Total Observations' : 'My Observations' }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: isAdmin ? stats.totalObservations : stats.myObservations }), _jsx("p", { className: "text-sm text-blue-600 mt-1", children: isAdmin ? `${stats.targetProgress}% to 5,000 goal` : 'This quarter' })] }), _jsx("div", { className: "p-3 rounded-lg bg-blue-100", children: _jsx(FileText, { className: "w-6 h-6 text-blue-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "CRP Evidence Rate" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: [stats.crpEvidenceRate, "%"] }), _jsx("p", { className: "text-sm text-green-600 mt-1", children: "1.6% from 70% target" })] }), _jsx("div", { className: "p-3 rounded-lg bg-green-100", children: _jsx(Target, { className: "w-6 h-6 text-green-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Draft Observations" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: stats.drafts }), _jsx("p", { className: "text-sm text-yellow-600 mt-1", children: "Ready to complete" })] }), _jsx("div", { className: "p-3 rounded-lg bg-yellow-100", children: _jsx(Edit, { className: "w-6 h-6 text-yellow-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-lg p-6 shadow-sm border", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "This Week" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: stats.thisWeek }), _jsx("p", { className: "text-sm text-purple-600 mt-1", children: "Observations completed" })] }), _jsx("div", { className: "p-3 rounded-lg bg-purple-100", children: _jsx(Calendar, { className: "w-6 h-6 text-purple-600" }) })] }) })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Actions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: getRoleSpecificActions().map((action, index) => {
                                    const Icon = action.icon;
                                    return (_jsxs("button", { onClick: () => handleQuickAction(action.href), className: `p-6 rounded-lg text-left transition-all transform hover:scale-105 ${action.color}`, children: [_jsx(Icon, { className: "w-8 h-8 mb-3" }), _jsx("h3", { className: "font-semibold mb-2", children: action.label }), _jsx("p", { className: "text-sm opacity-90", children: action.description })] }, index));
                                }) })] }), stats.drafts > 0 && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "w-5 h-5 text-yellow-600" }), _jsx("h2", { className: "text-lg font-semibold text-yellow-900", children: "Continue Where You Left Off" })] }), _jsxs("span", { className: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium", children: [stats.drafts, " Draft", stats.drafts !== 1 ? 's' : ''] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: observations
                                    .filter(obs => obs.status === 'draft' && obs.observerId === user?.id)
                                    .map((obs) => (_jsxs("div", { className: "bg-white rounded-lg p-4 border border-yellow-200", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: obs.educatorId }), _jsxs("p", { className: "text-sm text-gray-600", children: [obs.subjectArea, " \u2022 ", obs.gradeLevel] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Period ", obs.period] })] }), getStatusBadge(obs.status)] }), _jsxs("p", { className: "text-xs text-gray-500 mb-3", children: ["Last modified: ", new Date(obs.updatedAt).toLocaleDateString()] }), _jsxs("button", { onClick: () => continueObservation(obs.id), className: "w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center justify-center space-x-2", children: [_jsx(Play, { className: "w-4 h-4" }), _jsx("span", { children: "Continue Observation" })] })] }, obs.id))) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: isTeacher ? 'My Recent Observations' : 'Recent Observations' }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search observations...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "completed", children: "Completed" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "scheduled", children: "Scheduled" })] })] })] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: isTeacher ? 'Observer' : 'Teacher' }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Subject" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date & Time" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "CRP Evidence" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredObservations.slice(0, 10).map((obs) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: obs.educatorId }), _jsxs("div", { className: "text-sm text-gray-500", children: [obs.gradeLevel, " \u2022 Period ", obs.period] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: obs.subjectArea }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm text-gray-900", children: new Date(obs.observationDate).toLocaleDateString() }), _jsx("div", { className: "text-sm text-gray-500", children: obs.period })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatusBadge(obs.status) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: obs.status === 'completed' ? (_jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-green-600", children: "8/10" }), _jsx("div", { className: "text-xs text-gray-500", children: "80% evidence" })] })) : (_jsx("span", { className: "text-sm text-gray-400", children: obs.status === 'scheduled' ? 'Pending' : 'In Progress' })) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => viewObservation(obs.id), className: "text-blue-600 hover:text-blue-900", title: "View Observation", children: _jsx(Eye, { className: "w-4 h-4" }) }), (obs.status === 'draft' || (obs.observerId === user?.id && !isTeacher)) && (_jsx("button", { onClick: () => continueObservation(obs.id), className: "text-gray-600 hover:text-gray-900", title: obs.status === 'draft' ? 'Continue Observation' : 'Edit Observation', children: obs.status === 'draft' ? _jsx(Play, { className: "w-4 h-4" }) : _jsx(Edit, { className: "w-4 h-4" }) }))] }) })] }, obs.id))) })] }) }), filteredObservations.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No observations found" }), _jsx("p", { className: "text-gray-500 mb-4", children: searchTerm || filterStatus !== 'all'
                                            ? 'Try adjusting your search or filter criteria'
                                            : 'Get started by creating your first observation' }), (!searchTerm && filterStatus === 'all') && (_jsxs("button", { onClick: () => handleQuickAction('/observations/create'), className: "bg-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-600 mx-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Create First Observation" })] }))] }))] }), isAdmin && (_jsxs("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "AI Insights Preview" }), _jsx(Brain, { className: "w-5 h-5 text-blue-500" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-blue-50 border-l-4 border-blue-500 p-3 rounded", children: [_jsx("p", { className: "text-sm font-medium text-blue-900", children: "Latest Gemini Analysis" }), _jsx("p", { className: "text-sm text-blue-800 mt-1", children: "CRP evidence rate approaching 70% target. Focus on look-for #8 (student reflection) for maximum impact." })] }), _jsx("button", { onClick: () => handleQuickAction('/analytics'), className: "w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium", children: "View Full Analytics Dashboard" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "System Status" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Active Observers" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: "72/80" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Gemini AI Status" }), _jsxs("span", { className: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium", children: [_jsx(CheckCircle, { className: "w-3 h-3 inline mr-1" }), "Operational"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Goal Progress" }), _jsxs("span", { className: "text-sm font-medium text-gray-900", children: [stats.targetProgress, "%"] })] })] })] })] }))] })] }));
}
