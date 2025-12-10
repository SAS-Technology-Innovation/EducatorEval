import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  Camera,
  GraduationCap,
  Building2,
  Users,
  Shield,
  Globe,
  BookOpen
} from 'lucide-react';
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

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  title: string;
  pronouns: string;
  languages: string[];
  subjects: string[];
  grades: string[];
  divisionIds: string[];
  departmentIds: string[];
  bio: string;
  preferences: Record<string, unknown>;
}

interface UserProfileProps {
  user: Partial<UserType> & { id: string };
  onUpdate?: (userData: Partial<UserType>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
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

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [availableDivisionTags, setAvailableDivisionTags] = useState<Tag[]>([]);
  const [availableDepartmentTags, setAvailableDepartmentTags] = useState<Tag[]>([]);
  const [selectedDivisionTags, setSelectedDivisionTags] = useState<Tag[]>([]);
  const [selectedDepartmentTags, setSelectedDepartmentTags] = useState<Tag[]>([]);

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
          user.divisionIds?.includes(tag.id)
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

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    return role?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string | string[] | Record<string, unknown>) => {
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

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
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
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-sas-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-sas-blue-500 to-sas-purple-600"></div>
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                {avatarPreview || user.avatar ? (
                  <img
                    src={avatarPreview || user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {getInitials()}
                    </span>
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-sas-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-sas-blue-700 transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex justify-end pt-4">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sas-gray-700 border border-sas-gray-300 rounded-lg hover:bg-sas-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="mt-6 ml-40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="text-2xl font-bold text-sas-gray-900 bg-transparent border-b-2 border-sas-gray-300 focus:border-sas-blue-500 focus:outline-none"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="text-2xl font-bold text-sas-gray-900 bg-transparent border-b-2 border-sas-gray-300 focus:border-sas-blue-500 focus:outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold text-sas-gray-900">
                      {user.firstName} {user.lastName}
                      {user.pronouns && (
                        <span className="text-base font-normal text-sas-gray-600 ml-2">
                          ({user.pronouns})
                        </span>
                      )}
                    </h1>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <Shield className="w-4 h-4 text-sas-gray-500" />
                    <span className="text-sas-gray-600">{getRoleDisplayName(user.primaryRole)}</span>
                  </div>
                  
                  {user.title && (
                    <div className="flex items-center space-x-2 mt-1">
                      <GraduationCap className="w-4 h-4 text-sas-gray-500" />
                      <span className="text-sas-gray-600">{user.title}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-sas-gray-500" />
                    <span className="text-sas-gray-600">{user.email}</span>
                  </div>

                  {user.phoneNumber && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="w-4 h-4 text-sas-gray-500" />
                      <span className="text-sas-gray-600">{user.phoneNumber}</span>
                    </div>
                  )}
                </div>

                <div>
                  {user.schoolName && (
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-sas-gray-500" />
                      <span className="text-sas-gray-600">{user.schoolName}</span>
                    </div>
                  )}

                  {selectedDivisionTags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-sas-gray-500" />
                        <span className="text-sm font-medium text-sas-gray-700">Divisions</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedDivisionTags.map((tag) => (
                          <span
                            key={tag.id}
                            className={`px-2 py-1 text-xs rounded-full ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDepartmentTags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-4 h-4 text-sas-gray-500" />
                        <span className="text-sm font-medium text-sas-gray-700">Departments</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedDepartmentTags.map((tag) => (
                          <span
                            key={tag.id}
                            className={`px-2 py-1 text-xs rounded-full ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-sas-gray-900 mb-6">Profile Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-sas-gray-900 mb-4">Contact Information</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                    />
                  </div>
                  
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

                  <div>
                    <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sas-gray-700 mb-1">
                      Pronouns
                    </label>
                    <input
                      type="text"
                      value={formData.pronouns}
                      onChange={(e) => handleInputChange('pronouns', e.target.value)}
                      className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                      placeholder="e.g., she/her, he/him, they/them"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-sas-gray-400" />
                    <span className="text-sas-gray-700">{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-sas-gray-400" />
                      <span className="text-sas-gray-700">{user.phoneNumber}</span>
                    </div>
                  )}
                  {user.title && (
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-sas-gray-400" />
                      <span className="text-sas-gray-700">{user.title}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-sas-gray-900 mb-4">Professional Information</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <TagSelector
                    label="Divisions"
                    availableTags={availableDivisionTags}
                    selectedTags={selectedDivisionTags}
                    onTagsChange={handleDivisionTagsChange}
                    placeholder="Search divisions..."
                    allowCustomTags={false}
                  />

                  <TagSelector
                    label="Departments"
                    availableTags={availableDepartmentTags}
                    selectedTags={selectedDepartmentTags}
                    onTagsChange={handleDepartmentTagsChange}
                    placeholder="Search departments..."
                    allowCustomTags={false}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDivisionTags.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-sas-gray-700 mb-2">Divisions</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDivisionTags.map((tag) => (
                          <span
                            key={tag.id}
                            className={`px-3 py-1 text-sm rounded-full ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDepartmentTags.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-sas-gray-700 mb-2">Departments</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDepartmentTags.map((tag) => (
                          <span
                            key={tag.id}
                            className={`px-3 py-1 text-sm rounded-full ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-sas-gray-400" />
                    <span className="text-sas-gray-700">{getRoleDisplayName(user.primaryRole)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-8 pt-6 border-t border-sas-gray-200">
            <h3 className="text-lg font-semibold text-sas-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-sas-gray-500">Employee ID:</span>
                <div className="font-medium text-sas-gray-900">{user.employeeId || 'Not set'}</div>
              </div>
              <div>
                <span className="text-sas-gray-500">Last Login:</span>
                <div className="font-medium text-sas-gray-900">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </div>
              </div>
              <div>
                <span className="text-sas-gray-500">Account Status:</span>
                <div className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;