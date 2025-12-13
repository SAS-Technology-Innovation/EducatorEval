import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import TagSelector from '../common/TagSelector';
import { coreApi } from '../../api';
import type { User as UserType } from '../../types';

interface Tag {
  id: string;
  label: string;
  color: string;
}

interface Division {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  primaryRole: string;
  secondaryRoles: string[];
  title: string;
  phoneNumber: string;
  languages: string[];
  subjects: string[];
  grades: string[];
  divisionIds: string[];
  departmentIds: string[];
}

interface UserFormProps {
  user?: Partial<UserType>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserFormData>({
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_divisions, setDivisions] = useState<Division[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_departments, setDepartments] = useState<Department[]>([]);
  const [availableDivisionTags, setAvailableDivisionTags] = useState<Tag[]>([]);
  const [availableDepartmentTags, setAvailableDepartmentTags] = useState<Tag[]>([]);
  const [selectedDivisionTags, setSelectedDivisionTags] = useState<Tag[]>([]);
  const [selectedDepartmentTags, setSelectedDepartmentTags] = useState<Tag[]>([]);

  // Color palettes for different tag types
  const DIVISION_COLORS = [
    'bg-sas-navy-100 text-blue-800 border-sas-navy-200',
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
          title: user.jobTitle || '',
          phoneNumber: user.phoneNumber || '',
          languages: user.languages || [],
          subjects: user.subjects || [],
          grades: user.grades || [],
          divisionIds: user.divisionId ? [user.divisionId] : [],
          departmentIds: user.departmentIds || []
        });
      } else {
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
      const divisionTags: Tag[] = divisionsData.map((division, index) => ({
        id: division.id,
        label: division.name,
        color: DIVISION_COLORS[index % DIVISION_COLORS.length]
      }));

      const departmentTags: Tag[] = departmentsData.map((department, index) => ({
        id: department.id,
        label: department.name,
        color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]
      }));

      setAvailableDivisionTags(divisionTags);
      setAvailableDepartmentTags(departmentTags);

      // Set selected tags based on user data
      if (user) {
        const selectedDivs = divisionTags.filter(tag =>
          user.divisionId === tag.id
        );
        const selectedDepts = departmentTags.filter(tag =>
          user.departmentIds?.includes(tag.id)
        );

        setSelectedDivisionTags(selectedDivs);
        setSelectedDepartmentTags(selectedDepts);
      }
    } catch (error) {
      console.error('Failed to load divisions and departments:', error);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDivisionTagsChange = (tags: Tag[]) => {
    setSelectedDivisionTags(tags);
    setFormData(prev => ({
      ...prev,
      divisionIds: tags.map(tag => tag.id)
    }));
  };

  const handleDepartmentTagsChange = (tags: Tag[]) => {
    setSelectedDepartmentTags(tags);
    setFormData(prev => ({
      ...prev,
      departmentIds: tags.map(tag => tag.id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-sas-blue-600" />
              <h3 className="text-lg font-semibold text-sas-gray-900">
                {user ? 'Edit User' : 'Create New User'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-sas-gray-400 hover:text-sas-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                  Primary Role *
                </label>
                <select
                  value={formData.primaryRole}
                  onChange={(e) => handleInputChange('primaryRole', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                >
                  {USER_ROLES.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                  placeholder="e.g., Math Teacher, Grade 5 Coordinator"
                />
              </div>
            </div>

            {/* Divisions - Tag Selector */}
            <TagSelector
              label="Divisions"
              availableTags={availableDivisionTags}
              selectedTags={selectedDivisionTags}
              onTagsChange={handleDivisionTagsChange}
              placeholder="Search divisions..."
              allowCustomTags={false}
            />

            {/* Departments - Tag Selector */}
            <TagSelector
              label="Departments"
              availableTags={availableDepartmentTags}
              selectedTags={selectedDepartmentTags}
              onTagsChange={handleDepartmentTagsChange}
              placeholder="Search departments..."
              allowCustomTags={false}
            />

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-sas-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sas-gray-700 border border-sas-gray-300 rounded-md hover:bg-sas-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-sas-blue-600 text-white rounded-md hover:bg-sas-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{user ? 'Update User' : 'Create User'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;