import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Mail, Phone, Edit, Save, X, Camera, GraduationCap, Building2, Users, Shield, BookOpen } from 'lucide-react';
import TagSelector from '../common/TagSelector';
import { coreApi } from '../../api';
const UserProfile = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        title: '',
        pronouns: '',
        languages: [],
        subjects: [],
        grades: [],
        divisionIds: [],
        departmentIds: [],
        bio: '',
        preferences: {}
    });
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [availableDivisionTags, setAvailableDivisionTags] = useState([]);
    const [availableDepartmentTags, setAvailableDepartmentTags] = useState([]);
    const [selectedDivisionTags, setSelectedDivisionTags] = useState([]);
    const [selectedDepartmentTags, setSelectedDepartmentTags] = useState([]);
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
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                title: user.title || '',
                pronouns: user.pronouns || '',
                languages: user.languages || [],
                subjects: user.subjects || [],
                grades: user.grades || [],
                divisionIds: user.divisionIds || [],
                departmentIds: user.departmentIds || [],
                bio: user.bio || '',
                preferences: user.preferences || {}
            });
            loadDivisionsAndDepartments();
        }
    }, [user]);
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
    const getInitials = () => {
        if (!user)
            return 'U';
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
    };
    const getRoleDisplayName = (role) => {
        return role?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || '';
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
    const handleAvatarUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedUser = await coreApi.users.update(user.id, formData);
            onUpdate?.(updatedUser);
            setIsEditing(false);
        }
        catch (error) {
            console.error('Failed to update profile:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        setAvatarPreview(null);
        // Reset form data
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            title: user.title || '',
            pronouns: user.pronouns || '',
            languages: user.languages || [],
            subjects: user.subjects || [],
            grades: user.grades || [],
            divisionIds: user.divisionIds || [],
            departmentIds: user.departmentIds || [],
            bio: user.bio || '',
            preferences: user.preferences || {}
        });
    };
    if (!user)
        return null;
    return (_jsx("div", { className: "min-h-screen bg-sas-background", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-md overflow-hidden mb-8", children: [_jsx("div", { className: "h-32 bg-gradient-to-r from-sas-blue-500 to-sas-purple-600" }), _jsxs("div", { className: "relative px-6 pb-6", children: [_jsx("div", { className: "absolute -top-16 left-6", children: _jsxs("div", { className: "relative", children: [avatarPreview || user.avatar ? (_jsx("img", { src: avatarPreview || user.avatar, alt: `${user.firstName} ${user.lastName}`, className: "w-32 h-32 rounded-full border-4 border-white object-cover bg-white" })) : (_jsx("div", { className: "w-32 h-32 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-full border-4 border-white flex items-center justify-center", children: _jsx("span", { className: "text-3xl font-bold text-white", children: getInitials() }) })), isEditing && (_jsxs("label", { className: "absolute bottom-0 right-0 w-10 h-10 bg-sas-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-sas-blue-700 transition-colors", children: [_jsx(Camera, { className: "w-5 h-5 text-white" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleAvatarUpload, className: "hidden" })] }))] }) }), _jsx("div", { className: "flex justify-end pt-4", children: isEditing ? (_jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: handleCancel, className: "px-4 py-2 text-sas-gray-700 border border-sas-gray-300 rounded-lg hover:bg-sas-gray-50 transition-colors flex items-center space-x-2", children: [_jsx(X, { className: "w-4 h-4" }), _jsx("span", { children: "Cancel" })] }), _jsxs("button", { onClick: handleSave, disabled: loading, className: "px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2", children: [loading ? (_jsx("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" })) : (_jsx(Save, { className: "w-4 h-4" })), _jsx("span", { children: "Save Changes" })] })] })) : (_jsxs("button", { onClick: () => setIsEditing(true), className: "px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors flex items-center space-x-2", children: [_jsx(Edit, { className: "w-4 h-4" }), _jsx("span", { children: "Edit Profile" })] })) }), _jsx("div", { className: "mt-6 ml-40", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [isEditing ? (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("input", { type: "text", value: formData.firstName, onChange: (e) => handleInputChange('firstName', e.target.value), className: "text-2xl font-bold text-sas-gray-900 bg-transparent border-b-2 border-sas-gray-300 focus:border-sas-blue-500 focus:outline-none", placeholder: "First Name" }), _jsx("input", { type: "text", value: formData.lastName, onChange: (e) => handleInputChange('lastName', e.target.value), className: "text-2xl font-bold text-sas-gray-900 bg-transparent border-b-2 border-sas-gray-300 focus:border-sas-blue-500 focus:outline-none", placeholder: "Last Name" })] })) : (_jsxs("h1", { className: "text-2xl font-bold text-sas-gray-900", children: [user.firstName, " ", user.lastName, user.pronouns && (_jsxs("span", { className: "text-base font-normal text-sas-gray-600 ml-2", children: ["(", user.pronouns, ")"] }))] })), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx(Shield, { className: "w-4 h-4 text-sas-gray-500" }), _jsx("span", { className: "text-sas-gray-600", children: getRoleDisplayName(user.primaryRole) })] }), user.title && (_jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx(GraduationCap, { className: "w-4 h-4 text-sas-gray-500" }), _jsx("span", { className: "text-sas-gray-600", children: user.title })] })), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx(Mail, { className: "w-4 h-4 text-sas-gray-500" }), _jsx("span", { className: "text-sas-gray-600", children: user.email })] }), user.phoneNumber && (_jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx(Phone, { className: "w-4 h-4 text-sas-gray-500" }), _jsx("span", { className: "text-sas-gray-600", children: user.phoneNumber })] }))] }), _jsxs("div", { children: [user.schoolName && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Building2, { className: "w-4 h-4 text-sas-gray-500" }), _jsx("span", { className: "text-sas-gray-600", children: user.schoolName })] })), selectedDivisionTags.length > 0 && (_jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Users, { className: "w-4 h-4 text-sas-gray-500" }), _jsx("span", { className: "text-sm font-medium text-sas-gray-700", children: "Divisions" })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: selectedDivisionTags.map((tag) => (_jsx("span", { className: `px-2 py-1 text-xs rounded-full ${tag.color}`, children: tag.label }, tag.id))) })] })), selectedDepartmentTags.length > 0 && (_jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(BookOpen, { className: "w-4 h-4 text-sas-gray-500" }), _jsx("span", { className: "text-sm font-medium text-sas-gray-700", children: "Departments" })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: selectedDepartmentTags.map((tag) => (_jsx("span", { className: `px-2 py-1 text-xs rounded-full ${tag.color}`, children: tag.label }, tag.id))) })] }))] })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-bold text-sas-gray-900 mb-6", children: "Profile Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-sas-gray-900 mb-4", children: "Contact Information" }), isEditing ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Email Address" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => handleInputChange('email', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Phone Number" }), _jsx("input", { type: "tel", value: formData.phoneNumber, onChange: (e) => handleInputChange('phoneNumber', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Job Title" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => handleInputChange('title', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-1", children: "Pronouns" }), _jsx("input", { type: "text", value: formData.pronouns, onChange: (e) => handleInputChange('pronouns', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", placeholder: "e.g., she/her, he/him, they/them" })] })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Mail, { className: "w-5 h-5 text-sas-gray-400" }), _jsx("span", { className: "text-sas-gray-700", children: user.email })] }), user.phoneNumber && (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Phone, { className: "w-5 h-5 text-sas-gray-400" }), _jsx("span", { className: "text-sas-gray-700", children: user.phoneNumber })] })), user.title && (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(GraduationCap, { className: "w-5 h-5 text-sas-gray-400" }), _jsx("span", { className: "text-sas-gray-700", children: user.title })] }))] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-sas-gray-900 mb-4", children: "Professional Information" }), isEditing ? (_jsxs("div", { className: "space-y-4", children: [_jsx(TagSelector, { label: "Divisions", availableTags: availableDivisionTags, selectedTags: selectedDivisionTags, onTagsChange: handleDivisionTagsChange, placeholder: "Search divisions...", allowCustomTags: false }), _jsx(TagSelector, { label: "Departments", availableTags: availableDepartmentTags, selectedTags: selectedDepartmentTags, onTagsChange: handleDepartmentTagsChange, placeholder: "Search departments...", allowCustomTags: false })] })) : (_jsxs("div", { className: "space-y-4", children: [selectedDivisionTags.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-sas-gray-700 mb-2", children: "Divisions" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedDivisionTags.map((tag) => (_jsx("span", { className: `px-3 py-1 text-sm rounded-full ${tag.color}`, children: tag.label }, tag.id))) })] })), selectedDepartmentTags.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-sas-gray-700 mb-2", children: "Departments" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedDepartmentTags.map((tag) => (_jsx("span", { className: `px-3 py-1 text-sm rounded-full ${tag.color}`, children: tag.label }, tag.id))) })] })), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Shield, { className: "w-5 h-5 text-sas-gray-400" }), _jsx("span", { className: "text-sas-gray-700", children: getRoleDisplayName(user.primaryRole) })] })] }))] })] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-sas-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-sas-gray-900 mb-4", children: "Account Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sas-gray-500", children: "Employee ID:" }), _jsx("div", { className: "font-medium text-sas-gray-900", children: user.employeeId || 'Not set' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sas-gray-500", children: "Last Login:" }), _jsx("div", { className: "font-medium text-sas-gray-900", children: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sas-gray-500", children: "Account Status:" }), _jsx("div", { className: "font-medium", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${user.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}`, children: user.isActive ? 'Active' : 'Inactive' }) })] })] })] })] })] }) }));
};
export default UserProfile;
