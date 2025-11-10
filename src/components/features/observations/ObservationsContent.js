import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { observationsService } from '../../../lib/firestore';
import { Plus, Search, Calendar, Users, TrendingUp, Eye, Edit, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
const ObservationsContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [observations, setObservations] = useState([]);
    const [loading, setLoading] = useState(true);
    // Load observations from Firestore
    useEffect(() => {
        const loadObservations = async () => {
            try {
                setLoading(true);
                const data = await observationsService.list({
                    orderBy: ['createdAt', 'desc'],
                    limit: 50
                });
                setObservations(data);
            }
            catch (error) {
                console.error('Failed to load observations:', error);
                setObservations([]);
            }
            finally {
                setLoading(false);
            }
        };
        loadObservations();
    }, []);
    // Filter observations
    const filteredObservations = useMemo(() => {
        return observations.filter(obs => {
            const matchesSearch = !searchTerm ||
                obs.educatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obs.subjectArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obs.gradeLevel?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [observations, searchTerm, statusFilter]);
    // Calculate statistics
    const stats = useMemo(() => {
        return {
            total: observations.length,
            completed: observations.filter(obs => obs.status === 'completed').length,
            inProgress: observations.filter(obs => obs.status === 'in_progress').length,
            scheduled: observations.filter(obs => obs.status === 'scheduled').length,
            crpEvidence: observations.filter(obs => obs.crpPercentage > 0).length,
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
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white shadow-sm border-b border-sas-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 mb-8", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-sas-gray-900 font-serif", children: "Observations" }), _jsx("p", { className: "text-sas-gray-600 mt-1", children: "Teacher observation management and frameworks" })] }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("button", { className: "bg-gradient-to-r from-sas-blue-600 to-sas-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-sas-blue-700 hover:to-sas-green-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "New Observation"] }) })] }) }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Total" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: stats.total })] }), _jsx(Users, { className: "w-8 h-8 text-sas-blue-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Completed" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.completed })] }), _jsx(CheckCircle2, { className: "w-8 h-8 text-green-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "In Progress" }), _jsx("p", { className: "text-2xl font-bold text-yellow-600", children: stats.inProgress })] }), _jsx(Clock, { className: "w-8 h-8 text-yellow-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Scheduled" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: stats.scheduled })] }), _jsx(Calendar, { className: "w-8 h-8 text-blue-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "With Evidence" }), _jsx("p", { className: "text-2xl font-bold text-sas-purple-600", children: stats.crpEvidence })] }), _jsx(TrendingUp, { className: "w-8 h-8 text-sas-purple-600" })] }) })] }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6 mb-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-sas-gray-400" }), _jsx("input", { type: "text", placeholder: "Search by teacher, subject, or grade level...", className: "w-full pl-10 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsx("div", { className: "flex space-x-4", children: _jsxs("select", { className: "px-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "completed", children: "Completed" }), _jsx("option", { value: "in_progress", children: "In Progress" }), _jsx("option", { value: "scheduled", children: "Scheduled" })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-sas-gray-200", children: [_jsx("thead", { className: "bg-sas-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Teacher" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Subject" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Grade" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Score %" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-sas-gray-200", children: filteredObservations.map((observation) => (_jsxs("tr", { className: "hover:bg-sas-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-sas-gray-900", children: observation.educatorName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900", children: observation.subjectArea }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900", children: observation.gradeLevel }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900", children: new Date(observation.observationDate).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`, children: [getStatusIcon(observation.status), _jsx("span", { className: "ml-1 capitalize", children: observation.status.replace('_', ' ') })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-16 bg-sas-gray-200 rounded-full h-2 mr-2", children: _jsx("div", { className: "bg-sas-green-600 h-2 rounded-full", style: { width: `${observation.crpPercentage}%` } }) }), _jsxs("span", { className: "text-sm font-medium", children: [observation.crpPercentage, "%"] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { className: "text-sas-blue-600 hover:text-sas-blue-700", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-sas-green-600 hover:text-sas-green-700", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-red-600 hover:text-red-700", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, observation.id))) })] }) }) })] }));
};
export default ObservationsContent;
