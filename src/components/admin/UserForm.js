import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import TagSelector from '../common/TagSelector';
import { coreApi } from '../../api';
const UserForm = ({ user, isOpen, onClose, onSave, loading = false }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        primaryRole: 'teacher',
        secondaryRoles: [],
        title: '',
        phoneNumber: '',
        languages: [],
        subjects: [],
        grades: [],
        divisionIds: [],
        departmentIds: []
    });
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [availableDivisionTags, setAvailableDivisionTags] = useState([]);
    const [availableDepartmentTags, setAvailableDepartmentTags] = useState([]);
    const [selectedDivisionTags, setSelectedDivisionTags] = useState([]);
    const [selectedDepartmentTags, setSelectedDepartmentTags] = useState([]);
    // Color palettes for different tag types
    const DIVISION_COLORS = [
        'bg-blue-100 text-blue-800 border-blue-200',
        'bg-green-100 text-green-800 border-green-200',
        'bg-purple-100 text-purple-800 border-purple-200',
        'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    const DEPARTMENT_COLORS = [
        'bg-orange-100 text-orange-800 border-orange-200',
        'bg-pink-100 text-pink-800 border-pink-200',
        'bg-teal-100 text-teal-800 border-teal-200',
        'bg-yellow-100 text-yellow-800 border-yellow-200',
    ];
    const USER_ROLES = [
        { value: 'head_of_school', label: 'Head of School' },
        { value: 'principal', label: 'Principal' },
        { value: 'assistant_principal', label: 'Assistant Principal' },
        { value: 'division_director', label: 'Division Director' },
        { value: 'assistant_director', label: 'Assistant Director' },
        { value: 'department_head', label: 'Department Head' },
        { value: 'grade_chair', label: 'Grade Chair' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'substitute_teacher', label: 'Substitute Teacher' },
        { value: 'specialist_teacher', label: 'Specialist Teacher' },
        { value: 'instructional_coach', label: 'Instructional Coach' },
        { value: 'plc_coach', label: 'PLC Coach' },
        { value: 'curriculum_coordinator', label: 'Curriculum Coordinator' },
        { value: 'assessment_coordinator', label: 'Assessment Coordinator' },
        { value: 'counselor', label: 'Counselor' },
        { value: 'social_worker', label: 'Social Worker' },
        { value: 'psychologist', label: 'Psychologist' },
        { value: 'nurse', label: 'Nurse' },
        { value: 'librarian', label: 'Librarian' },
        { value: 'technology_coordinator', label: 'Technology Coordinator' },
        { value: 'admin_assistant', label: 'Administrative Assistant' },
        { value: 'observer', label: 'Observer' }
    ];
    useEffect(() => {
        if (isOpen) {
            loadDivisionsAndDepartments();
            if (user) {
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    employeeId: user.employeeId || '',
                    primaryRole: user.primaryRole || 'teacher',
                    secondaryRoles: user.secondaryRoles || [],
                    title: user.title || '',
                    phoneNumber: user.phoneNumber || '',
                    languages: user.languages || [],
                    subjects: user.subjects || [],
                    grades: user.grades || [],
                    divisionIds: user.divisionIds || [],
                    departmentIds: user.departmentIds || []
                });
            }
            else {
                // Reset form for new user
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    employeeId: '',
                    primaryRole: 'teacher',
                    secondaryRoles: [],
                    title: '',
                    phoneNumber: '',
                    languages: [],
                    subjects: [],
                    grades: [],
                    divisionIds: [],
                    departmentIds: []
                });
            }
        }
    }, [isOpen, user]);
    const loadDivisionsAndDepartments = async () => {
        try {
            const [divisionsData, departmentsData] = await Promise.all([
                coreApi.divisions.list(),
                coreApi.departments.list()
            ]);
            setDivisions(divisionsData);
            setDepartments(departmentsData);
            // Convert to tag format
            const divisionTags = divisionsData.map((division, index) => ({
                id: division.id,
                label: division.name,
                color: DIVISION_COLORS[index % DIVISION_COLORS.length]
            }));
            const departmentTags = departmentsData.map((department, index) => ({
                id: department.id,
                label: department.name,
                color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]
            }));
            setAvailableDivisionTags(divisionTags);
            setAvailableDepartmentTags(departmentTags);
            // Set selected tags based on user data
            if (user) {
                const selectedDivs = divisionTags.filter(tag => user.divisionIds?.includes(tag.id));
                const selectedDepts = departmentTags.filter(tag => user.departmentIds?.includes(tag.id));
                setSelectedDivisionTags(selectedDivs);
                setSelectedDepartmentTags(selectedDepts);
            }
        }
        catch (error) {
            console.error('Failed to load divisions and departments:', error);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleDivisionTagsChange = (tags) => {
        setSelectedDivisionTags(tags);
        setFormData(prev => ({
            ...prev,
            divisionIds: tags.map(tag => tag.id)
        }));
    };
    const handleDepartmentTagsChange = (tags) => {
        setSelectedDepartmentTags(tags);
        setFormData(prev => ({
            ...prev,
            departmentIds: tags.map(tag => tag.id)
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75", onClick: onClose }), _jsxs("div", { className: "inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(User, { className: "w-6 h-6 text-sas-blue-600" }), _jsx("h3", { className: "text-lg font-semibold text-sas-gray-900", children: user ? 'Edit User' : 'Create New User' })] }), _jsx("button", { onClick: onClose, className: "text-sas-gray-400 hover:text-sas-gray-600 transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "First Name *" }), _jsx("input", { type: "text", required: true, value: formData.firstName, onChange: (e) => handleInputChange('firstName', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Last Name *" }), _jsx("input", { type: "text", required: true, value: formData.lastName, onChange: (e) => handleInputChange('lastName', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Email *" }), _jsx("input", { type: "email", required: true, value: formData.email, onChange: (e) => handleInputChange('email', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Employee ID" }), _jsx("input", { type: "text", value: formData.employeeId, onChange: (e) => handleInputChange('employeeId', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Primary Role *" }), _jsx("select", { value: formData.primaryRole, onChange: (e) => handleInputChange('primaryRole', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: USER_ROLES.map(role => (_jsx("option", { value: role.value, children: role.label }, role.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Job Title" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => handleInputChange('title', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", placeholder: "e.g., Math Teacher, Grade 5 Coordinator" })] })] }), _jsx(TagSelector, { label: "Divisions", availableTags: availableDivisionTags, selectedTags: selectedDivisionTags, onTagsChange: handleDivisionTagsChange, placeholder: "Search divisions...", allowCustomTags: false }), _jsx(TagSelector, { label: "Departments", availableTags: availableDepartmentTags, selectedTags: selectedDepartmentTags, onTagsChange: handleDepartmentTagsChange, placeholder: "Search departments...", allowCustomTags: false }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Phone Number" }), _jsx("input", { type: "tel", value: formData.phoneNumber, onChange: (e) => handleInputChange('phoneNumber', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-6 border-t border-sas-gray-200", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-sas-gray-700 border border-sas-gray-300 rounded-md hover:bg-sas-gray-50 transition-colors", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: loading, className: "flex items-center space-x-2 px-6 py-2 bg-sas-blue-600 text-white rounded-md hover:bg-sas-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: [loading ? (_jsx("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" })) : (_jsx(Save, { className: "w-4 h-4" })), _jsx("span", { children: user ? 'Update User' : 'Create User' })] })] })] })] })] }) }));
};
export default UserForm;
