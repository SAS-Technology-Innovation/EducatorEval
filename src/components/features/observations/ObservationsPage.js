import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useAuthStore } from '../../../stores/auth';
import { useObservations } from '../../../hooks/useObservations';
import { useFrameworks } from '../../../hooks/useFrameworks';
import ObservationForm from './ObservationForm';
import { Plus, Search, Filter, Calendar, Users, TrendingUp, Eye, Edit, Trash2, Download, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
const ObservationsPage = () => {
    const { user, hasPermission } = useAuthStore();
    const { data: observations, isLoading: observationsLoading } = useObservations();
    const { data: frameworks } = useFrameworks();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedFramework, setSelectedFramework] = useState('all');
    const [showObservationForm, setShowObservationForm] = useState(false);
    // Filter observations based on search and filters
    const filteredObservations = useMemo(() => {
        if (!observations)
            return [];
        return observations.filter(obs => {
            const matchesSearch = !searchTerm ||
                obs.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obs.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obs.gradeLevel?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;
            const matchesFramework = selectedFramework === 'all' || obs.frameworkId === selectedFramework;
            return matchesSearch && matchesStatus && matchesFramework;
        });
    }, [observations, searchTerm, statusFilter, selectedFramework]);
    // Calculate statistics
    const stats = useMemo(() => {
        if (!observations)
            return { total: 0, completed: 0, inProgress: 0, scheduled: 0, crpEvidence: 0 };
        return {
            total: observations.length,
            completed: observations.filter(obs => obs.status === 'completed').length,
            inProgress: observations.filter(obs => obs.status === 'in_progress').length,
            scheduled: observations.filter(obs => obs.status === 'scheduled').length,
            crpEvidence: observations.filter(obs => obs.crpEvidence && Object.values(obs.crpEvidence).some(Boolean)).length,
        };
    }, [observations]);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return _jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" });
            case 'in_progress':
                return _jsx(Clock, { className: "w-4 h-4 text-yellow-600" });
            case 'scheduled':
                return _jsx(Calendar, { className: "w-4 h-4 text-blue-600" });
            default:
                return _jsx(AlertCircle, { className: "w-4 h-4 text-gray-600" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const handleSaveDraft = (data) => {
        console.log('Saving draft:', data);
        // TODO: Implement save draft functionality
        alert('Draft saved! (Firebase integration pending)');
    };
    const handleSubmitObservation = (data) => {
        console.log('Submitting observation:', data);
        // TODO: Implement submit observation functionality
        alert('Observation submitted! (Firebase integration pending)');
        setShowObservationForm(false);
    };
    const handleCancelObservation = () => {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            setShowObservationForm(false);
        }
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Access Required" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Please sign in to view observations" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "CRP Observations" }), _jsx("p", { className: "text-gray-600", children: "Culturally Responsive Pedagogy in Action" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [hasPermission('observations', 'create') && (_jsxs("button", { onClick: () => setShowObservationForm(true), className: "bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "New Observation"] })), _jsxs("button", { className: "border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center", children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Export"] })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-4 h-4 text-blue-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: observationsLoading ? '...' : stats.total.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Completed" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: observationsLoading ? '...' : stats.completed.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "w-4 h-4 text-yellow-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "In Progress" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: observationsLoading ? '...' : stats.inProgress.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "w-4 h-4 text-purple-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "CRP Evidence" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: observationsLoading ? '...' : `${Math.round((stats.crpEvidence / Math.max(stats.total, 1)) * 100)}%` })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "w-4 h-4 text-indigo-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Goal Progress" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: observationsLoading ? '...' : `${Math.round((stats.total / 5000) * 100)}%` })] })] }) })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm mb-6", children: _jsx("div", { className: "p-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-4 w-4 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search teachers, subjects...", className: "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsx("div", { children: _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "scheduled", children: "Scheduled" }), _jsx("option", { value: "in_progress", children: "In Progress" }), _jsx("option", { value: "completed", children: "Completed" })] }) }), _jsx("div", { children: _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", value: selectedFramework, onChange: (e) => setSelectedFramework(e.target.value), children: [_jsx("option", { value: "all", children: "All Frameworks" }), frameworks?.map((framework) => (_jsx("option", { value: framework.id, children: framework.name }, framework.id)))] }) }), _jsx("div", { children: _jsxs("button", { onClick: () => {
                                                setSearchTerm('');
                                                setStatusFilter('all');
                                                setSelectedFramework('all');
                                            }, className: "w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center", children: [_jsx(Filter, { className: "w-4 h-4 mr-2" }), "Clear Filters"] }) })] }) }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm", children: [_jsx("div", { className: "px-6 py-4 border-b", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("h2", { className: "text-lg font-medium text-gray-900", children: ["Observations (", filteredObservations.length, ")"] }) }) }), observationsLoading ? (_jsx("div", { className: "p-6 text-center text-gray-500", children: "Loading observations..." })) : filteredObservations.length === 0 ? (_jsx("div", { className: "p-6 text-center text-gray-500", children: observations?.length === 0 ? (_jsxs("div", { children: [_jsx(Users, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No observations yet" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Get started by creating your first CRP observation." }), hasPermission('observations', 'create') && (_jsx("button", { onClick: () => setShowObservationForm(true), className: "bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700", children: "Create First Observation" }))] })) : (_jsxs("div", { children: [_jsx(Search, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No observations found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search criteria or filters." })] })) })) : (_jsx("div", { className: "divide-y divide-gray-200", children: filteredObservations.map((observation) => (_jsx("div", { className: "p-6 hover:bg-gray-50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx(Users, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: observation.teacherName || 'Unknown Teacher' }), _jsxs("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`, children: [getStatusIcon(observation.status), _jsx("span", { className: "ml-1 capitalize", children: observation.status.replace('_', ' ') })] })] }), _jsxs("div", { className: "mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Subject:" }), " ", observation.subject] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Grade:" }), " ", observation.gradeLevel] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Duration:" }), " ", observation.duration, " min"] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Scheduled:" }), " ", observation.scheduledDate
                                                                                    ? new Date(observation.scheduledDate).toLocaleDateString()
                                                                                    : 'Not scheduled'] })] }), observation.crpEvidence && (_jsx("div", { className: "mt-3", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "CRP Evidence:" }), _jsx("div", { className: "flex space-x-2", children: Object.entries(observation.crpEvidence).map(([domain, hasEvidence]) => (hasEvidence && (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800", children: domain.replace('_', ' ').toUpperCase() }, domain)))) })] }) }))] })] }) }), _jsxs("div", { className: "flex items-center space-x-2 ml-4", children: [_jsx("button", { className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg", children: _jsx(Eye, { className: "w-4 h-4" }) }), hasPermission('observations', 'update') && (_jsx("button", { className: "p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg", children: _jsx(Edit, { className: "w-4 h-4" }) })), hasPermission('observations', 'delete') && (_jsx("button", { className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg", children: _jsx(Trash2, { className: "w-4 h-4" }) }))] })] }) }, observation.id))) }))] })] }), showObservationForm && (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex items-start justify-center min-h-screen pt-4 px-4 pb-20", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: handleCancelObservation }), _jsxs("div", { className: "relative bg-white rounded-lg max-w-4xl w-full z-10", children: [_jsx("button", { onClick: handleCancelObservation, className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20", children: _jsx(X, { className: "w-6 h-6" }) }), _jsx(ObservationForm, { onSave: handleSaveDraft, onSubmit: handleSubmitObservation, onCancel: handleCancelObservation })] })] }) }))] }));
};
export default ObservationsPage;
