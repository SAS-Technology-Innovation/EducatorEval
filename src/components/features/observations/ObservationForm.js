import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Camera, Mic, MapPin, Save, Send, Clock, BookOpen } from 'lucide-react';
export default function ObservationForm({ onSave, onSubmit, onCancel }) {
    const [observationData, setObservationData] = useState({
        teacher: '',
        teacherId: '',
        subject: '',
        className: '',
        room: '',
        period: '',
        grade: '',
        duration: 30,
        responses: {},
        comments: {},
        overallComment: ''
    });
    // Sample teacher schedule data (will be replaced with real API)
    const teachers = [
        {
            id: 'teacher1',
            name: 'Sarah Johnson',
            currentClass: { name: 'Algebra I - Period 3', subject: 'Mathematics', room: 'B205', period: 'Period 3', grade: '9th Grade' }
        },
        {
            id: 'teacher2',
            name: 'Michael Brown',
            currentClass: { name: 'Biology - Period 2', subject: 'Science', room: 'A108', period: 'Period 2', grade: '10th Grade' }
        },
        {
            id: 'teacher3',
            name: 'Emily Wilson',
            currentClass: { name: 'English Literature - Period 1', subject: 'English', room: 'C301', period: 'Period 1', grade: '11th Grade' }
        },
        {
            id: 'teacher4',
            name: 'David Chen',
            currentClass: { name: 'World History - Period 4', subject: 'Social Studies', room: 'B112', period: 'Period 4', grade: '9th Grade' }
        }
    ];
    // Framework alignment options
    const frameworkOptions = [
        { id: 'crp-general', label: 'CRP (General)', color: 'green' },
        { id: 'crp-curriculum', label: 'CRP (Curriculum Relevance)', color: 'green' },
        { id: 'casel-social-awareness', label: 'CASEL (Social Awareness)', color: 'pink' },
        { id: 'tripod-care', label: 'Tripod: Care', color: 'blue' },
        { id: 'tripod-clarify', label: 'Tripod: Clarify', color: 'blue' },
        { id: '5-daily-assessment', label: '5 Daily Assessment Practices', color: 'yellow' },
        { id: 'panorama', label: 'Panorama (Student Experience)', color: 'purple' },
        { id: 'inclusive-practices', label: 'Inclusive Practices', color: 'indigo' }
    ];
    const getFrameworkColorClasses = (color) => {
        const colorMap = {
            green: 'bg-green-100 text-green-800',
            pink: 'bg-pink-100 text-pink-800',
            blue: 'bg-blue-100 text-blue-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            purple: 'bg-purple-100 text-purple-800',
            indigo: 'bg-indigo-100 text-indigo-800'
        };
        return colorMap[color] || 'bg-gray-100 text-gray-800';
    };
    // 10 integrated look-fors from CRP in Action
    const questions = [
        {
            id: 'lookfor1',
            text: 'The learning target is clearly communicated, standards-based, and relevant to students. Students can explain what they are learning and why.',
            frameworkAlignments: ['5-daily-assessment', 'crp-curriculum', 'tripod-clarify']
        },
        {
            id: 'lookfor2',
            text: 'Teacher fosters a respectful, inclusive, and identity-affirming environment where all students feel a sense of belonging.',
            frameworkAlignments: ['crp-general', 'casel-social-awareness', 'panorama', 'tripod-care']
        },
        {
            id: 'lookfor3',
            text: 'Teacher checks for understanding and adjusts instruction in response to student needs.',
            frameworkAlignments: ['5-daily-assessment', 'tripod-clarify', 'inclusive-practices']
        },
        {
            id: 'lookfor4',
            text: 'Teacher uses questioning strategies that increase cognitive demand and promote student thinking.',
            frameworkAlignments: ['5-daily-assessment', 'crp-general']
        },
        {
            id: 'lookfor5',
            text: 'Students are engaged in meaningful, collaborative learning experiences with clear roles and expectations.',
            frameworkAlignments: ['crp-general', 'casel-social-awareness', 'inclusive-practices']
        },
        {
            id: 'lookfor6',
            text: 'Teacher demonstrates cultural competence and integrates students\' backgrounds and experiences into the lesson.',
            frameworkAlignments: ['crp-general', 'crp-curriculum', 'panorama', 'casel-social-awareness']
        },
        {
            id: 'lookfor7',
            text: 'Teacher actively monitors and supports students during group and independent work.',
            frameworkAlignments: ['5-daily-assessment', 'inclusive-practices']
        },
        {
            id: 'lookfor8',
            text: 'Students have opportunities to reflect on and consolidate their learning during and after the lesson.',
            frameworkAlignments: ['5-daily-assessment', 'casel-social-awareness']
        },
        {
            id: 'lookfor9',
            text: 'Teacher builds strong, trusting relationships with students through affirming interactions.',
            frameworkAlignments: ['panorama', 'crp-general', 'casel-social-awareness', 'tripod-care']
        },
        {
            id: 'lookfor10',
            text: 'Instruction is differentiated and scaffolds support access for diverse learning needs.',
            frameworkAlignments: ['inclusive-practices', 'crp-general', 'casel-social-awareness']
        }
    ];
    const handleResponseChange = (questionId, value) => {
        setObservationData(prev => ({
            ...prev,
            responses: { ...prev.responses, [questionId]: value }
        }));
    };
    const handleCommentChange = (questionId, comment) => {
        setObservationData(prev => ({
            ...prev,
            comments: { ...prev.comments, [questionId]: comment }
        }));
    };
    const handleSave = () => {
        if (onSave) {
            onSave(observationData);
        }
    };
    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(observationData);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b sticky top-0 z-10", children: _jsx("div", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(BookOpen, { className: "w-6 h-6 text-blue-500" }), _jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "New Observation" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "text-sm text-gray-600", children: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] })] }) }) }), _jsx("div", { className: "bg-white border-b px-4 py-3", children: _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "Teacher" }), _jsxs("select", { value: observationData.teacherId, onChange: (e) => {
                                        const selectedTeacher = teachers.find(t => t.id === e.target.value);
                                        if (selectedTeacher) {
                                            setObservationData(prev => ({
                                                ...prev,
                                                teacherId: selectedTeacher.id,
                                                teacher: selectedTeacher.name,
                                                subject: selectedTeacher.currentClass?.subject || '',
                                                className: selectedTeacher.currentClass?.name || '',
                                                room: selectedTeacher.currentClass?.room || '',
                                                period: selectedTeacher.currentClass?.period || '',
                                                grade: selectedTeacher.currentClass?.grade || ''
                                            }));
                                        }
                                    }, className: "w-full text-sm border border-gray-300 rounded px-2 py-1", children: [_jsx("option", { value: "", children: "Select teacher..." }), teachers.map(teacher => (_jsxs("option", { value: teacher.id, children: [teacher.name, " - ", teacher.currentClass?.name, " (", teacher.currentClass?.period, ")"] }, teacher.id)))] })] }), observationData.teacherId && (_jsx("div", { className: "bg-blue-50 rounded-lg p-3 border border-blue-200", children: _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Class:" }), _jsx("div", { className: "text-gray-900", children: observationData.className })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Subject:" }), _jsx("div", { className: "text-gray-900", children: observationData.subject })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Room:" }), _jsx("div", { className: "text-gray-900", children: observationData.room })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Period:" }), _jsx("div", { className: "text-gray-900", children: observationData.period })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Grade:" }), _jsx("div", { className: "text-gray-900", children: observationData.grade })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Duration:" }), _jsxs("div", { className: "text-gray-900", children: [observationData.duration, " min"] })] })] }) }))] }) }), _jsx("div", { className: "flex-1 px-4 py-4", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "10 Look-Fors: CRP in Action" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Brief 10-15 minute classroom observation" }), _jsxs("div", { className: "mt-3 bg-gray-100 rounded-lg p-3", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Progress" }), _jsxs("span", { className: "text-sm text-gray-600", children: [Object.keys(observationData.responses).length, " of ", questions.length, " completed"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all duration-300", style: {
                                                    width: `${(Object.keys(observationData.responses).length / questions.length) * 100}%`
                                                } }) })] })] }), questions.map((question, index) => {
                            const rating = observationData.responses[question.id];
                            const comment = observationData.comments[question.id];
                            return (_jsxs("div", { className: "bg-white rounded-lg p-4 shadow-sm border", children: [_jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "flex items-start justify-between mb-3", children: _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsxs("h3", { className: "text-sm font-medium text-gray-900 leading-relaxed", children: [index + 1, ". ", question.text] }), rating && (_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${rating === '4' ? 'bg-green-100 text-green-800' :
                                                                    rating === '3' ? 'bg-blue-100 text-blue-800' :
                                                                        rating === '2' ? 'bg-yellow-100 text-yellow-800' :
                                                                            rating === '1' ? 'bg-red-100 text-red-800' :
                                                                                'bg-gray-100 text-gray-800'}`, children: rating === 'not-observed' ? 'N/O' : rating }))] }) }) }), question.frameworkAlignments && (_jsxs("div", { className: "mb-3 p-2 bg-blue-50 rounded text-xs", children: [_jsx("strong", { className: "text-blue-800", children: "Aligned Frameworks:" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: question.frameworkAlignments.map(alignmentId => {
                                                            const framework = frameworkOptions.find(f => f.id === alignmentId);
                                                            if (!framework)
                                                                return null;
                                                            return (_jsx("span", { className: `px-2 py-1 rounded text-xs ${getFrameworkColorClasses(framework.color)}`, children: framework.label }, alignmentId));
                                                        }) })] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Rating" }), _jsxs("select", { value: rating || '', onChange: (e) => handleResponseChange(question.id, e.target.value), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Select rating..." }), _jsx("option", { value: "4", children: "4 - Clearly Observable" }), _jsx("option", { value: "3", children: "3 - Possibly Present" }), _jsx("option", { value: "2", children: "2 - Unclear/Minimal" }), _jsx("option", { value: "1", children: "1 - Not Evident in This Moment" }), _jsx("option", { value: "not-observed", children: "Not Observed" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Comments & Evidence" }), _jsx("textarea", { value: comment || '', onChange: (e) => handleCommentChange(question.id, e.target.value), className: "w-full p-3 border border-gray-300 rounded-lg resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Describe what you observed for this look-for..." })] })] }), _jsxs("div", { className: "mt-3 flex items-center space-x-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${rating ? 'bg-green-500' : 'bg-gray-300'}` }), _jsxs("span", { className: "text-xs text-gray-500", children: [rating ? 'Completed' : 'Not rated', comment && ' • Has comments'] })] })] }, question.id));
                        })] }) }), _jsx("div", { className: "bg-white border-t px-4 py-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Overall Observation Comments" }), _jsx("textarea", { value: observationData.overallComment, onChange: (e) => setObservationData(prev => ({ ...prev, overallComment: e.target.value })), className: "w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "General observations, key strengths, areas for growth, or additional context for this observation..." })] }) }), _jsx("div", { className: "bg-white border-t px-4 py-3", children: _jsxs("div", { className: "flex justify-center space-x-6", children: [_jsxs("button", { className: "flex flex-col items-center space-y-1 p-2", children: [_jsx(Camera, { className: "w-6 h-6 text-gray-600" }), _jsx("span", { className: "text-xs text-gray-600", children: "Photo" })] }), _jsxs("button", { className: "flex flex-col items-center space-y-1 p-2", children: [_jsx(Mic, { className: "w-6 h-6 text-gray-600" }), _jsx("span", { className: "text-xs text-gray-600", children: "Audio" })] }), _jsxs("button", { className: "flex flex-col items-center space-y-1 p-2", children: [_jsx(MapPin, { className: "w-6 h-6 text-gray-600" }), _jsx("span", { className: "text-xs text-gray-600", children: "Location" })] })] }) }), _jsx("div", { className: "bg-white border-t px-4 py-4 sticky bottom-0", children: _jsxs("div", { className: "space-y-3", children: [!observationData.teacherId && (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3", children: _jsx("p", { className: "text-sm text-yellow-800", children: "Please select a teacher and class to begin observation." }) })), observationData.teacherId && Object.keys(observationData.responses).length < questions.length && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: _jsxs("p", { className: "text-sm text-blue-800", children: [questions.length - Object.keys(observationData.responses).length, " look-fors remaining to complete observation."] }) })), _jsxs("div", { className: "flex space-x-3", children: [onCancel && (_jsx("button", { onClick: onCancel, className: "px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium", children: "Cancel" })), _jsxs("button", { onClick: handleSave, disabled: !observationData.teacherId, className: "flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Save Draft" })] }), _jsxs("button", { onClick: handleSubmit, disabled: !observationData.teacherId || Object.keys(observationData.responses).length === 0, className: "flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:bg-gray-400", children: [_jsx(Send, { className: "w-4 h-4" }), _jsx("span", { children: "Submit" })] })] })] }) })] }));
}
