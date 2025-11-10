import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, Settings, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useFrameworks, useUpdateFramework } from '../../hooks/useFrameworks';
import DataTable from '../common/DataTable';
export default function FrameworkManagement() {
    const { data: frameworks = [], isLoading, error } = useFrameworks();
    const updateFramework = useUpdateFramework();
    const [selectedFramework, setSelectedFramework] = useState(null);
    const [expandedSections, setExpandedSections] = useState(new Set());
    // Edit modals
    const [isEditingFramework, setIsEditingFramework] = useState(false);
    const [isEditingSection, setIsEditingSection] = useState(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editingSectionIdx, setEditingSectionIdx] = useState(null);
    const [editingQuestionIdx, setEditingQuestionIdx] = useState(null);
    const toggleSection = (sectionId) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        }
        else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };
    // Save framework metadata changes
    const handleSaveFramework = async (updates) => {
        if (!selectedFramework)
            return;
        try {
            await updateFramework.mutateAsync({
                id: selectedFramework.id,
                data: updates
            });
            setSelectedFramework({ ...selectedFramework, ...updates });
            setIsEditingFramework(false);
        }
        catch (err) {
            console.error('Failed to update framework:', err);
            alert('Failed to save framework changes');
        }
    };
    // Save section changes
    const handleSaveSection = async (updatedSection) => {
        if (!selectedFramework || editingSectionIdx === null)
            return;
        const updatedSections = [...selectedFramework.sections];
        updatedSections[editingSectionIdx] = updatedSection;
        try {
            await updateFramework.mutateAsync({
                id: selectedFramework.id,
                data: { sections: updatedSections }
            });
            setSelectedFramework({ ...selectedFramework, sections: updatedSections });
            setIsEditingSection(false);
            setEditingSection(null);
            setEditingSectionIdx(null);
        }
        catch (err) {
            console.error('Failed to update section:', err);
            alert('Failed to save section changes');
        }
    };
    // Save question changes
    const handleSaveQuestion = async (updatedQuestion) => {
        if (!selectedFramework || editingSectionIdx === null || editingQuestionIdx === null)
            return;
        const updatedSections = [...selectedFramework.sections];
        const section = { ...updatedSections[editingSectionIdx] };
        const questions = [...(section.questions || [])];
        questions[editingQuestionIdx] = updatedQuestion;
        section.questions = questions;
        updatedSections[editingSectionIdx] = section;
        try {
            await updateFramework.mutateAsync({
                id: selectedFramework.id,
                data: { sections: updatedSections }
            });
            setSelectedFramework({ ...selectedFramework, sections: updatedSections });
            setIsEditingQuestion(false);
            setEditingQuestion(null);
            setEditingQuestionIdx(null);
        }
        catch (err) {
            console.error('Failed to update question:', err);
            alert('Failed to save question changes');
        }
    };
    // Open edit dialogs
    const openEditFramework = () => {
        setIsEditingFramework(true);
    };
    const openEditSection = (section, sectionIdx) => {
        setEditingSection(section);
        setEditingSectionIdx(sectionIdx);
        setIsEditingSection(true);
    };
    const openEditQuestion = (question, sectionIdx, questionIdx) => {
        setEditingQuestion(question);
        setEditingSectionIdx(sectionIdx);
        setEditingQuestionIdx(questionIdx);
        setIsEditingQuestion(true);
    };
    // Color mapping for framework alignments
    const getAlignmentColorClasses = (color) => {
        const colorMap = {
            green: 'bg-green-100 text-green-800 border-green-200',
            pink: 'bg-pink-100 text-pink-800 border-pink-200',
            blue: 'bg-blue-100 text-blue-800 border-blue-200',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            purple: 'bg-purple-100 text-purple-800 border-purple-200',
            indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
        return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
    };
    const columns = [
        {
            id: 'name',
            header: 'Framework Name',
            accessor: (framework) => (_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: framework.name }), _jsx("div", { className: "text-sm text-gray-500", children: framework.description })] })),
            sortable: true
        },
        {
            id: 'version',
            header: 'Version',
            accessor: (framework) => (_jsxs("span", { className: "px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full", children: ["v", framework.version] })),
            width: 'w-24'
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (framework) => {
                const statusColors = {
                    active: 'bg-green-100 text-green-800',
                    draft: 'bg-yellow-100 text-yellow-800',
                    archived: 'bg-gray-100 text-gray-800',
                    deprecated: 'bg-red-100 text-red-800'
                };
                return (_jsx("span", { className: `px-3 py-1 text-sm font-medium rounded-full ${statusColors[framework.status]}`, children: framework.status }));
            },
            width: 'w-32'
        },
        {
            id: 'questions',
            header: 'Questions',
            accessor: (framework) => (_jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "font-medium text-gray-900", children: [framework.totalQuestions, " total"] }), _jsxs("div", { className: "text-gray-500", children: [framework.requiredQuestions, " required"] })] })),
            width: 'w-32'
        },
        {
            id: 'usage',
            header: 'Usage',
            accessor: (framework) => (_jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "font-medium text-gray-900", children: [framework.usageCount || 0, " observations"] }), _jsxs("div", { className: "text-gray-500", children: ["~", framework.estimatedDuration, " min"] })] })),
            width: 'w-36'
        }
    ];
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-600 mr-3" }), _jsx("p", { className: "text-gray-600", children: "Loading frameworks..." })] }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-red-900", children: "Error Loading Frameworks" }), _jsx("p", { className: "text-red-700 mt-1", children: error.message })] })] }) }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Framework Management" }), _jsx("p", { className: "mt-2 text-gray-600", children: "View and manage observation frameworks \u2022 Connected to Firestore" })] }) }), frameworks.length > 0 ? (_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: _jsx(DataTable, { columns: columns, data: frameworks, searchPlaceholder: "Search frameworks...", onRowClick: (framework) => {
                        setSelectedFramework(framework);
                        setIsEditing(false);
                        // Auto-expand first section
                        if (framework.sections.length > 0) {
                            setExpandedSections(new Set([framework.sections[0].id]));
                        }
                    } }) })) : (_jsxs("div", { className: "text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300", children: [_jsx(BookOpen, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 font-medium text-lg", children: "No frameworks found" }), _jsx("p", { className: "text-gray-500 mt-2", children: "Check Firestore or run the migration script" })] })), selectedFramework && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-8", children: [_jsxs("div", { className: "flex items-start justify-between mb-8 pb-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: selectedFramework.name }), _jsx("button", { onClick: openEditFramework, className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "Edit framework", children: _jsx(Edit, { className: "w-5 h-5" }) })] }), _jsx("p", { className: "mt-2 text-gray-600", children: selectedFramework.description }), _jsxs("div", { className: "mt-6 flex items-center gap-6 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BookOpen, { className: "w-4 h-4 text-gray-400" }), _jsxs("span", { className: "text-gray-600", children: [selectedFramework.totalQuestions, " questions (", selectedFramework.requiredQuestions, " required)"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-gray-400" }), _jsxs("span", { className: "text-gray-600", children: [selectedFramework.usageCount || 0, " observations"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Settings, { className: "w-4 h-4 text-gray-400" }), _jsxs("span", { className: "text-gray-600", children: ["v", selectedFramework.version] })] })] }), selectedFramework.tags && selectedFramework.tags.length > 0 && (_jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: selectedFramework.tags.map((tag) => (_jsx("span", { className: "px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full", children: tag }, tag))) }))] }), _jsx("button", { onClick: () => setSelectedFramework(null), className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 flex items-center gap-2", children: ["Framework Sections", _jsxs("span", { className: "text-sm font-normal text-gray-500", children: ["(", selectedFramework.sections.length, " section", selectedFramework.sections.length !== 1 ? 's' : '', ")"] })] }), selectedFramework.sections.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300", children: [_jsx(BookOpen, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 font-medium", children: "No sections defined" }), _jsx("p", { className: "text-gray-500 text-sm mt-2", children: "This framework doesn't have any sections yet" })] })) : (selectedFramework.sections.map((section, sectionIdx) => (_jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-100 transition-colors -m-4 p-4 rounded-l-lg", onClick: () => toggleSection(section.id), children: [expandedSections.has(section.id) ? (_jsx(ChevronDown, { className: "w-5 h-5 text-gray-600 flex-shrink-0" })) : (_jsx(ChevronRight, { className: "w-5 h-5 text-gray-600 flex-shrink-0" })), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: section.title }), _jsxs("span", { className: "px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded", children: ["Section ", sectionIdx + 1] })] }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: section.description })] })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600", children: [_jsxs("span", { className: "font-medium", children: [section.questions?.length || 0, " questions"] }), _jsx("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            openEditSection(section, sectionIdx);
                                                        }, className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "Edit section", children: _jsx(Edit, { className: "w-4 h-4" }) })] })] }), expandedSections.has(section.id) && (_jsx("div", { className: "p-6 space-y-4 bg-white", children: !section.questions || section.questions.length === 0 ? (_jsx("div", { className: "text-center py-8 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-gray-600 text-sm", children: "No questions in this section" }) })) : (section.questions.map((question, idx) => (_jsxs("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors relative", children: [_jsx("button", { onClick: () => openEditQuestion(question, sectionIdx, idx), className: "absolute top-4 right-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "Edit question", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex items-start gap-3 mb-3 pr-12", children: [_jsx("span", { className: "flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold", children: question.order || idx + 1 }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-gray-900 font-medium", children: question.text }), question.description && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: question.description }))] })] }), question.helpText && (_jsx("div", { className: "ml-11 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-900", children: [_jsx("span", { className: "font-semibold", children: "Look for:" }), " ", question.helpText] }) })), question.examples && question.examples.length > 0 && (_jsxs("div", { className: "ml-11 mb-3", children: [_jsx("p", { className: "text-xs font-semibold text-gray-700 mb-2", children: "Examples:" }), _jsx("ul", { className: "space-y-1", children: question.examples.map((example, exIdx) => (_jsxs("li", { className: "text-sm text-gray-600 flex items-start gap-2", children: [_jsx("span", { className: "text-blue-600 font-bold", children: "\u2022" }), _jsx("span", { children: example })] }, exIdx))) })] })), question.frameworkAlignments && question.frameworkAlignments.length > 0 && (_jsxs("div", { className: "ml-11", children: [_jsxs("p", { className: "text-xs font-semibold text-gray-700 mb-2", children: ["Framework Alignments (", question.frameworkAlignments.length, "):"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: question.frameworkAlignments.map((alignment) => (_jsx("span", { className: `inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getAlignmentColorClasses(alignment.color)}`, children: alignment.name }, alignment.id))) })] })), _jsxs("div", { className: "ml-11 mt-3 flex items-center gap-4 text-xs text-gray-500", children: [question.isRequired && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(CheckCircle, { className: "w-3 h-3 text-green-600" }), "Required"] })), question.scale && (_jsxs("span", { children: ["Scale: ", question.scale.name, " (", question.scale.min, "-", question.scale.max, ")"] })), question.weight && _jsxs("span", { children: ["Weight: ", question.weight] })] })] }, question.id)))) }))] }, section.id))))] }), selectedFramework.alignments && selectedFramework.alignments.length > 0 && (_jsxs("div", { className: "mt-8 pt-8 border-t border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "All Framework Alignments" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: selectedFramework.alignments.map((alignment) => (_jsxs("div", { className: "p-3 bg-gray-50 rounded-lg border border-gray-200", children: [_jsx("div", { className: "font-medium text-gray-900", children: alignment.name }), _jsx("div", { className: "text-sm text-gray-600", children: alignment.category }), alignment.description && (_jsx("div", { className: "text-xs text-gray-500 mt-1", children: alignment.description }))] }, alignment.id))) })] }))] })), !selectedFramework && frameworks.length > 0 && (_jsxs("div", { className: "text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300", children: [_jsx(BookOpen, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 font-medium text-lg", children: "Select a framework to view details" }), _jsx("p", { className: "text-gray-500 mt-2", children: "Click on a framework above to see sections and questions" })] })), isEditingFramework && selectedFramework && (_jsx(EditFrameworkModal, { framework: selectedFramework, onSave: handleSaveFramework, onClose: () => setIsEditingFramework(false) })), isEditingSection && editingSection && (_jsx(EditSectionModal, { section: editingSection, onSave: handleSaveSection, onClose: () => {
                    setIsEditingSection(false);
                    setEditingSection(null);
                    setEditingSectionIdx(null);
                } })), isEditingQuestion && editingQuestion && selectedFramework && (_jsx(EditQuestionModal, { question: editingQuestion, availableAlignments: selectedFramework.alignments || [], onSave: handleSaveQuestion, onClose: () => {
                    setIsEditingQuestion(false);
                    setEditingQuestion(null);
                    setEditingQuestionIdx(null);
                    setEditingSectionIdx(null);
                }, getAlignmentColorClasses: getAlignmentColorClasses }))] }));
}
// Edit Framework Modal Component
function EditFrameworkModal({ framework, onSave, onClose }) {
    const [name, setName] = useState(framework.name);
    const [description, setDescription] = useState(framework.description);
    const [version, setVersion] = useState(framework.version);
    const [status, setStatus] = useState(framework.status);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description, version, status });
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Edit Framework" }), _jsx("button", { type: "button", onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Framework Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 4, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Version" }), _jsx("input", { type: "text", value: version, onChange: (e) => setVersion(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "archived", children: "Archived" }), _jsx("option", { value: "deprecated", children: "Deprecated" })] })] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsxs("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), "Save Changes"] })] })] }) }) }));
}
// Edit Section Modal Component
function EditSectionModal({ section, onSave, onClose }) {
    const [title, setTitle] = useState(section.title);
    const [description, setDescription] = useState(section.description || '');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...section, title, description });
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Edit Section" }), _jsx("button", { type: "button", onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Section Title" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsxs("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), "Save Changes"] })] })] }) }) }));
}
// Edit Question Modal Component
function EditQuestionModal({ question, availableAlignments, onSave, onClose, getAlignmentColorClasses }) {
    const [text, setText] = useState(question.text);
    const [description, setDescription] = useState(question.description || '');
    const [helpText, setHelpText] = useState(question.helpText || '');
    const [examples, setExamples] = useState(question.examples || []);
    const [selectedAlignments, setSelectedAlignments] = useState(question.frameworkAlignments || []);
    const [isRequired, setIsRequired] = useState(question.isRequired || false);
    const [newExample, setNewExample] = useState('');
    const handleAddExample = () => {
        if (newExample.trim()) {
            setExamples([...examples, newExample.trim()]);
            setNewExample('');
        }
    };
    const handleRemoveExample = (index) => {
        setExamples(examples.filter((_, i) => i !== index));
    };
    const toggleAlignment = (alignment) => {
        const isSelected = selectedAlignments.some(a => a.id === alignment.id);
        if (isSelected) {
            setSelectedAlignments(selectedAlignments.filter(a => a.id !== alignment.id));
        }
        else {
            setSelectedAlignments([...selectedAlignments, alignment]);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...question,
            text,
            description,
            helpText,
            examples,
            frameworkAlignments: selectedAlignments,
            isRequired
        });
    };
    // Group alignments by category
    const alignmentsByCategory = availableAlignments.reduce((acc, alignment) => {
        const category = alignment.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(alignment);
        return acc;
    }, {});
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx("div", { className: "bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Edit Question" }), _jsx("button", { type: "button", onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Question Text *" }), _jsx("input", { type: "text", value: text, onChange: (e) => setText(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 2, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Help Text (What to look for)" }), _jsx("textarea", { value: helpText, onChange: (e) => setHelpText(e.target.value), rows: 2, placeholder: "E.g., Student discussions about personal experiences, cultural connections...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Examples" }), _jsxs("div", { className: "space-y-2", children: [examples.map((example, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm", children: example }), _jsx("button", { type: "button", onClick: () => handleRemoveExample(index), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, index))), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: newExample, onChange: (e) => setNewExample(e.target.value), onKeyDown: (e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddExample();
                                                            }
                                                        }, placeholder: "Add an example...", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), _jsxs("button", { type: "button", onClick: handleAddExample, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add"] })] })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: ["Framework Alignments (", selectedAlignments.length, " selected)"] }), _jsx("div", { className: "space-y-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200", children: Object.entries(alignmentsByCategory).map(([category, alignments]) => (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-2", children: category }), _jsx("div", { className: "flex flex-wrap gap-2", children: alignments.map((alignment) => {
                                                        const isSelected = selectedAlignments.some(a => a.id === alignment.id);
                                                        return (_jsxs("button", { type: "button", onClick: () => toggleAlignment(alignment), className: `inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${isSelected
                                                                ? getAlignmentColorClasses(alignment.color)
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, children: [isSelected && _jsx(CheckCircle, { className: "w-3 h-3 mr-1" }), alignment.name] }, alignment.id));
                                                    }) })] }, category))) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "isRequired", checked: isRequired, onChange: (e) => setIsRequired(e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("label", { htmlFor: "isRequired", className: "text-sm font-medium text-gray-700", children: "This question is required" })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsxs("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), "Save Changes"] })] })] }) }) }));
}
