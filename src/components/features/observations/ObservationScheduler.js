import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Calendar, X, Search, Plus, Trash2, Loader2 } from 'lucide-react';
import { useTeachers, useObservationsBySchool, useCreateObservation, useDeleteObservation } from '../../../hooks/useFirestore';
import { useAuthStore } from '../../../stores/auth';
export default function ObservationScheduler() {
    const { user } = useAuthStore();
    const [selectedView, setSelectedView] = useState('schedule');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    // Fetch data from Firestore
    const { data: teachers = [], isLoading: teachersLoading } = useTeachers(user?.schoolId);
    const { data: observations = [], isLoading: observationsLoading } = useObservationsBySchool(user?.schoolId);
    const createObservationMutation = useCreateObservation();
    const deleteObservationMutation = useDeleteObservation();
    // Filter scheduled observations for selected date
    const scheduledObservations = observations.filter(obs => {
        if (!obs.context?.date)
            return false;
        const obsDate = new Date(obs.context.date).toISOString().split('T')[0];
        return obsDate === selectedDate;
    });
    const [newObservation, setNewObservation] = useState({
        teacherId: '',
        date: '',
        period: '',
        time: '',
        class: '',
        notes: '',
        framework: 'CRP + All Frameworks',
        duration: 15,
        priority: 'normal'
    });
    const filteredTeachers = teachers.filter(teacher => teacher.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        teacher.grades.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())));
    const getAvailabilityColor = (teacher) => {
        // Calculate based on last observation
        const teacherObs = observations.filter(obs => obs.subjectId === teacher.id);
        if (teacherObs.length === 0)
            return 'bg-green-100 text-green-800';
        const latestObs = teacherObs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const daysSince = Math.floor((Date.now() - new Date(latestObs.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 60)
            return 'bg-red-100 text-red-800'; // Low - overdue
        if (daysSince > 30)
            return 'bg-yellow-100 text-yellow-800'; // Medium
        return 'bg-green-100 text-green-800'; // High - recent
    };
    const getAvailabilityText = (teacher) => {
        const teacherObs = observations.filter(obs => obs.subjectId === teacher.id);
        if (teacherObs.length === 0)
            return 'High - Ready for observation';
        const latestObs = teacherObs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const daysSince = Math.floor((Date.now() - new Date(latestObs.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 60)
            return 'Low - Overdue for observation';
        if (daysSince > 30)
            return 'Medium - Recent observation';
        return 'High - Recently observed';
    };
    const handleScheduleObservation = async () => {
        if (!newObservation.teacherId || !newObservation.date) {
            alert('Please select a teacher and date');
            return;
        }
        const teacher = teachers.find(t => t.id === newObservation.teacherId);
        if (!teacher || !user)
            return;
        try {
            await createObservationMutation.mutateAsync({
                schoolId: user.schoolId,
                divisionId: user.divisionId,
                departmentId: user.departmentId,
                subjectId: newObservation.teacherId,
                subjectName: teacher.displayName,
                observerId: user.id,
                observerName: user.displayName,
                frameworkId: 'crp-framework-001',
                frameworkName: newObservation.framework,
                frameworkVersion: '1.0',
                responses: [],
                overallComments: newObservation.notes,
                evidenceCount: 0,
                totalQuestions: 10,
                evidencePercentage: 0,
                frameworkScores: [],
                status: 'scheduled',
                context: {
                    type: 'classroom',
                    className: newObservation.class || 'TBD',
                    subject: teacher.subjects[0] || 'Unknown',
                    grade: teacher.grades[0] || 'Unknown',
                    gradeLevel: teacher.grades,
                    date: new Date(newObservation.date),
                    startTime: new Date(newObservation.date),
                    duration: newObservation.duration,
                },
                version: 1,
                metadata: { priority: newObservation.priority }
            });
            alert('Observation scheduled successfully!');
            setNewObservation({
                teacherId: '',
                date: '',
                period: '',
                time: '',
                class: '',
                notes: '',
                framework: 'CRP + All Frameworks',
                duration: 15,
                priority: 'normal'
            });
            setSelectedView('schedule');
        }
        catch (error) {
            console.error('Error scheduling observation:', error);
            alert('Failed to schedule observation');
        }
    };
    const cancelObservation = async (observationId) => {
        if (!confirm('Are you sure you want to cancel this observation?'))
            return;
        try {
            await deleteObservationMutation.mutateAsync(observationId);
            alert('Observation cancelled');
        }
        catch (error) {
            console.error('Error cancelling observation:', error);
            alert('Failed to cancel observation');
        }
    };
    const startObservation = (observationId) => {
        // TODO: Navigate to observation form
        alert(`Starting observation ${observationId} - This will open the observation form`);
    };
    if (teachersLoading || observationsLoading) {
        return (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-600" }), _jsx("p", { className: "ml-3 text-gray-600", children: "Loading observation scheduler..." })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Observation Scheduler" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Manage and schedule classroom observations \u2022 Connected to Firestore" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("button", { onClick: () => setSelectedView('schedule'), className: `px-4 py-2 rounded-lg font-medium transition-colors ${selectedView === 'schedule'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Schedule View" }), _jsx("button", { onClick: () => setSelectedView('create'), className: `px-4 py-2 rounded-lg font-medium transition-colors ${selectedView === 'create'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Schedule New" })] })] }), selectedView === 'schedule' && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Filter by Date" }), _jsx("input", { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), className: "border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search Teachers" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search by name, subject, or grade...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Scheduled for ", new Date(selectedDate).toLocaleDateString()] }) }), _jsx("div", { className: "p-6", children: scheduledObservations.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Calendar, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No observations scheduled" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Schedule your first observation for this date" }), _jsxs("button", { onClick: () => setSelectedView('create'), className: "bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 mx-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Schedule Observation" })] })] })) : (_jsx("div", { className: "space-y-4", children: scheduledObservations.map((obs) => (_jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: obs.subjectName }), _jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize", children: obs.status })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Subject:" }), " ", obs.context.subject] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Grade:" }), " ", obs.context.grade] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Duration:" }), " ", obs.context.duration, " min"] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Observer:" }), " ", obs.observerName] })] }), obs.overallComments && (_jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [_jsx("span", { className: "font-medium", children: "Notes:" }), " ", obs.overallComments] }))] }), _jsxs("div", { className: "flex items-center space-x-2 ml-4", children: [_jsx("button", { onClick: () => startObservation(obs.id), className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium", children: "Start Observation" }), _jsx("button", { onClick: () => cancelObservation(obs.id), className: "text-red-600 hover:text-red-900 p-2", title: "Cancel Observation", disabled: deleteObservationMutation.isPending, children: deleteObservationMutation.isPending ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Trash2, { className: "w-4 h-4" })) })] })] }) }, obs.id))) })) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Teacher Availability" }) }), _jsx("div", { className: "p-6", children: filteredTeachers.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: _jsx("p", { children: "No teachers found. Check your Firebase connection or add teachers to the database." }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredTeachers.map((teacher) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: teacher.displayName }), _jsx("p", { className: "text-sm text-gray-600", children: teacher.subjects.join(', ') }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Grades ", teacher.grades.join(', ')] })] }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(teacher)}`, children: "AVAILABLE" })] }), _jsx("p", { className: "text-xs text-gray-600 mb-3", children: getAvailabilityText(teacher) }), _jsx("button", { onClick: () => {
                                                    setNewObservation({ ...newObservation, teacherId: teacher.id });
                                                    setSelectedView('create');
                                                }, className: "w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium", children: "Schedule Observation" })] }, teacher.id))) })) })] })] })), selectedView === 'create' && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Schedule New Observation" }), _jsx("button", { onClick: () => setSelectedView('schedule'), className: "text-gray-600 hover:text-gray-900", children: _jsx(X, { className: "w-5 h-5" }) })] }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Teacher *" }), _jsxs("select", { value: newObservation.teacherId, onChange: (e) => setNewObservation({ ...newObservation, teacherId: e.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Select a teacher..." }), teachers.map(teacher => (_jsxs("option", { value: teacher.id, children: [teacher.displayName, " - ", teacher.subjects.join(', '), " (Grades ", teacher.grades.join(', '), ")"] }, teacher.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date *" }), _jsx("input", { type: "date", value: newObservation.date, onChange: (e) => setNewObservation({ ...newObservation, date: e.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", min: new Date().toISOString().split('T')[0] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Framework Focus" }), _jsxs("select", { value: newObservation.framework, onChange: (e) => setNewObservation({ ...newObservation, framework: e.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "CRP + All Frameworks", children: "CRP + All Frameworks (Standard)" }), _jsx("option", { value: "CRP Focus", children: "CRP Focus Only" }), _jsx("option", { value: "Tripod 7Cs", children: "Tripod 7Cs Focus" }), _jsx("option", { value: "CASEL + SEL", children: "CASEL + SEL Focus" }), _jsx("option", { value: "5 Daily Assessment", children: "5 Daily Assessment Focus" }), _jsx("option", { value: "Inclusive Practices", children: "Inclusive Practices Focus" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Duration (minutes)" }), _jsxs("select", { value: newObservation.duration, onChange: (e) => setNewObservation({ ...newObservation, duration: parseInt(e.target.value) }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: 10, children: "10 minutes (Quick Check)" }), _jsx("option", { value: 15, children: "15 minutes (Standard)" }), _jsx("option", { value: 20, children: "20 minutes (Extended)" }), _jsx("option", { value: 30, children: "30 minutes (Full Period)" })] })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Observation Notes" }), _jsx("textarea", { value: newObservation.notes, onChange: (e) => setNewObservation({ ...newObservation, notes: e.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none", placeholder: "Optional notes about focus areas, special considerations, or goals for this observation..." })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx("button", { onClick: () => setSelectedView('schedule'), className: "px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium", children: "Cancel" }), _jsx("button", { onClick: handleScheduleObservation, disabled: createObservationMutation.isPending, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2 disabled:opacity-50", children: createObservationMutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), _jsx("span", { children: "Scheduling..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: "Schedule Observation" })] })) })] })] })] }))] }));
}
