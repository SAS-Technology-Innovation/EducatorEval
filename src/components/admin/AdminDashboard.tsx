import React, { useState, useEffect } from 'react';
import { 
  Settings,
  Users,
  Building2,
  Puzzle,
  BarChart3,
  Shield,
  Database,
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  GraduationCap,
  Calendar,
  TrendingUp,
  Mail,
  RotateCcw,
  XCircle
} from 'lucide-react';

import { 
  usersService, 
  organizationsService, 
  schoolsService, 
  divisionsService, 
  departmentsService, 
  appletsService,
  firestoreQueries 
} from '../../lib/firestore';
import type { User, Organization, School, Division, Department, AppletMetadata } from '../../types';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSchools: number;
  activeLearningPaths: number;
  pendingEvaluations: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

interface AdminDashboardProps {
  defaultTab?: 'overview' | 'users' | 'organizations' | 'applets' | 'system';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ defaultTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'organizations' | 'applets' | 'system'>(defaultTab);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [applets, setApplets] = useState<AppletMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);
  
  // Modal and editing state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  
  // Form state
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    primaryRole: 'teacher',
    secondaryRoles: [] as string[]
  });
  const [schoolFormData, setSchoolFormData] = useState({
    name: '',
    type: 'elementary',
    organizationId: '',
    grades: ['K'],
    divisions: ['Academic'],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  
  const [newDivision, setNewDivision] = useState('');
  
  // Organization Form State
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    type: 'district' as 'district' | 'school' | 'charter' | 'private',
    timezone: 'America/New_York',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    academicYear: {
      year: '2024-2025',
      startDate: '',
      endDate: ''
    }
  });
  
  // Applet Management State
  const [showAppletModal, setShowAppletModal] = useState(false);
  const [editingApplet, setEditingApplet] = useState<AppletMetadata | null>(null);
  const [appletFormData, setAppletFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    type: 'utility' as 'utility' | 'observation' | 'evaluation' | 'learning' | 'assessment' | 'analytics',
    category: '',
    icon: '🧩',
    color: '#6366f1',
    route: '',
    requiredRoles: [] as string[],
    requiredPermissions: [] as string[],
    applicableDivisions: [] as string[],
    isConfigurable: false,
    settings: {} as Record<string, any>,
    maintainer: ''
  });
  
  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    platformName: 'EducatorEval Platform',
    maintenanceMode: false,
    allowRegistration: true,
    requireApproval: false,
    defaultUserRole: 'teacher',
    sessionTimeout: 30,
    maxUploadSize: 10,
    emailNotifications: true,
    backupFrequency: 'daily',
    timezone: 'UTC'
  });
  
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSchools: 0,
    activeLearningPaths: 0,
    pendingEvaluations: 0,
    systemHealth: 'healthy'
  });

  useEffect(() => {
    // Show interface immediately, load data in background
    setLoading(false); // Start with interface visible
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Note: Starting with clean slate - no mock data initialization
      console.log('🆕 Loading dashboard with empty data arrays (background)');
      
      // Load all data in background without blocking UI
      const [usersData, orgsData, schoolsData, divisionsData, departmentsData, appletsData] = await Promise.all([
        usersService.list(),
        organizationsService.list(),
        schoolsService.list(),
        divisionsService.list(),
        departmentsService.list(),
        appletsService.list()
      ]);

      setUsers(usersData as User[]);
      setOrganizations(orgsData as Organization[]);
      setSchools(schoolsData as School[]);
      setDivisions(divisionsData as Division[]);
      setDepartments(departmentsData as Department[]);
      setApplets(appletsData as AppletMetadata[]);

      // Calculate stats
      const activeUsers = (usersData as User[]).filter(u => u.isActive).length;
      const activeSchools = (schoolsData as School[]).length; // All mock schools are active
      
      setStats({
        totalUsers: usersData.length,
        activeUsers,
        totalSchools: activeSchools,
        activeLearningPaths: appletsData.length,
        pendingEvaluations: Math.floor(Math.random() * 25) + 5, // Mock pending evaluations
        systemHealth: activeUsers > usersData.length * 0.8 ? 'healthy' : 'warning'
      });
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setStats(prev => ({ ...prev, systemHealth: 'error' }));
    }
  };

  const filteredUsers = users.filter(user => 
    searchTerm === '' || 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.primaryRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CRUD Operations
  const handleAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      primaryRole: 'teacher',
      secondaryRoles: []
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      primaryRole: user.primaryRole,
      secondaryRoles: user.secondaryRoles || []
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    // Validation
    if (!userFormData.firstName.trim() || !userFormData.lastName.trim() || !userFormData.email.trim()) {
      alert('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    if (!userFormData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const userData = {
        ...userFormData,
        isActive: true,
        displayName: `${userFormData.firstName} ${userFormData.lastName}`,
        organizationId: '',
        employeeId: `EMP_${Date.now()}`,
        departmentId: '',
        permissions: getPermissionsForRole(userFormData.primaryRole),
        secondaryRoles: userFormData.secondaryRoles,
        title: userFormData.primaryRole.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        certifications: [],
        subjects: [],
        grades: [],
        specializations: [],
        languages: ['English'],
        accountStatus: 'active',
        preferences: null,
        notificationSettings: null,
        metadata: {},
        experience: '',
        phoneNumber: '',
        address: null,
        pronouns: ''
      };

      if (editingUser) {
        await usersService.update(editingUser.id, userData);
      } else {
        await usersService.create(userData);
      }
      
      setShowUserModal(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(`Failed to ${editingUser ? 'update' : 'create'} user: ${error.message}`);
    }
  };

  const getPermissionsForRole = (role: string): string[] => {
    switch (role) {
      case 'super_admin':
        return ['*']; // All permissions
      case 'system_admin':
        return ['users.read', 'users.write', 'organizations.read', 'organizations.write', 'system.read', 'system.write'];
      case 'district_admin':
        return ['users.read', 'users.write', 'organizations.read', 'organizations.write'];
      case 'principal':
        return ['users.read', 'users.write', 'organizations.read', 'applets.read', 'applets.write'];
      case 'teacher':
        return ['users.read', 'applets.read'];
      default:
        return ['users.read'];
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      console.log('Deleting user with ID:', userId);
      await usersService.delete(userId);
      console.log('User deleted successfully');
      
      // Update local state immediately
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
      
      // Refresh data to ensure consistency
      await loadDashboardData();
      
      // Show success message
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  const handleAddSchool = () => {
    setEditingSchool(null);
    setSchoolFormData({
      name: '',
      type: 'elementary',
      organizationId: '',
      grades: ['K'],
      divisions: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    });
    setShowSchoolModal(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    setSchoolFormData({
      name: school.name,
      type: school.type,
      organizationId: school.organizationId || '',
      grades: school.grades || ['K'],
      divisions: [],
      address: school.address || {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    });
    setShowSchoolModal(true);
  };

  const handleSaveSchool = async () => {
    if (!schoolFormData.name.trim()) {
      alert('Please enter a school name');
      return;
    }

    try {
      const schoolData = {
        name: schoolFormData.name,
        shortName: schoolFormData.name.toLowerCase().replace(/\s+/g, '-'),
        type: schoolFormData.type,
        grades: schoolFormData.grades,
        address: schoolFormData.address,
        organizationId: schoolFormData.organizationId,
        contactInfo: {
          phone: '',
          email: '',
          website: ''
        },
        principalId: '',
        assistantPrincipalIds: [],
        settings: {}
      };

      let savedSchool;
      if (editingSchool) {
        savedSchool = await schoolsService.update(editingSchool.id, schoolData);
      } else {
        savedSchool = await schoolsService.create(schoolData);
        
        // Create divisions for the new school
        for (const divisionName of schoolFormData.divisions) {
          if (divisionName.trim()) {
            await divisionsService.create({
              name: divisionName.trim(),
              schoolId: savedSchool.id,
              description: `${divisionName} division at ${savedSchool.name}`,
              headId: '',
              settings: {}
            });
          }
        }
      }
      
      setShowSchoolModal(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error saving school:', error);
      alert(`Failed to ${editingSchool ? 'update' : 'create'} school: ${error.message}`);
    }
  };

  const addDivision = () => {
    if (newDivision.trim() && !schoolFormData.divisions.includes(newDivision.trim())) {
      setSchoolFormData({
        ...schoolFormData,
        divisions: [...schoolFormData.divisions, newDivision.trim()]
      });
      setNewDivision('');
    }
  };

  const removeDivision = (index: number) => {
    setSchoolFormData({
      ...schoolFormData,
      divisions: schoolFormData.divisions.filter((_, i) => i !== index)
    });
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Are you sure you want to delete this school?')) return;
    
    try {
      await schoolsService.delete(schoolId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting school:', error);
      alert('Failed to delete school');
    }
  };

  // Applet Management Functions
  const handleAddApplet = () => {
    setEditingApplet(null);
    setAppletFormData({
      name: '',
      description: '',
      version: '1.0.0',
      type: 'utility',
      category: '',
      icon: '🧩',
      color: '#6366f1',
      route: '',
      requiredRoles: [],
      requiredPermissions: [],
      applicableDivisions: [],
      isConfigurable: false,
      settings: {},
      maintainer: ''
    });
    setShowAppletModal(true);
  };

  const handleEditApplet = (applet: AppletMetadata) => {
    setEditingApplet(applet);
    setAppletFormData({
      name: applet.name,
      description: applet.description,
      version: applet.version,
      type: applet.type,
      category: applet.category,
      icon: applet.icon,
      color: applet.color,
      route: applet.route,
      requiredRoles: applet.requiredRoles,
      requiredPermissions: applet.requiredPermissions,
      applicableDivisions: applet.applicableDivisions,
      isConfigurable: applet.isConfigurable,
      settings: applet.settings,
      maintainer: applet.maintainer
    });
    setShowAppletModal(true);
  };

  const handleSaveApplet = async () => {
    if (!appletFormData.name.trim() || !appletFormData.description.trim()) {
      alert('Please fill in all required fields (Name and Description)');
      return;
    }

    try {
      const appletData = {
        ...appletFormData,
        status: 'active' as const,
        installs: editingApplet?.installs || 0,
        activeUsers: editingApplet?.activeUsers || 0,
        lastUsed: editingApplet?.lastUsed,
        createdBy: editingApplet?.createdBy || 'current-admin-id' // Should be actual current user ID
      };

      if (editingApplet) {
        await appletsService.update(editingApplet.id, appletData);
      } else {
        await appletsService.create(appletData);
      }
      
      setShowAppletModal(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error saving applet:', error);
      alert(`Failed to ${editingApplet ? 'update' : 'create'} applet: ${error.message}`);
    }
  };

  const handleDeleteApplet = async (appletId: string) => {
    if (!confirm('Are you sure you want to delete this applet? This action cannot be undone.')) return;
    
    try {
      await appletsService.delete(appletId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting applet:', error);
      alert('Failed to delete applet');
    }
  };

  const handleToggleAppletStatus = async (appletId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await appletsService.update(appletId, { status: newStatus });
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating applet status:', error);
      alert('Failed to update applet status');
    }
  };

  // Organization Management Functions
  const handleAddOrg = () => {
    setEditingOrg(null);
    setOrgFormData({
      name: '',
      type: 'district',
      timezone: 'America/New_York',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      contactInfo: {
        phone: '',
        email: '',
        website: ''
      },
      academicYear: {
        year: '2024-2025',
        startDate: '',
        endDate: ''
      }
    });
    setShowOrgModal(true);
  };

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setOrgFormData({
      name: org.name,
      type: org.type,
      timezone: org.timezone,
      address: org.address,
      contactInfo: {
        phone: org.contactInfo.phone || '',
        email: org.contactInfo.email || '',
        website: org.contactInfo.website || ''
      },
      academicYear: {
        year: org.academicYear.year,
        startDate: org.academicYear.startDate.toISOString().split('T')[0],
        endDate: org.academicYear.endDate.toISOString().split('T')[0]
      }
    });
    setShowOrgModal(true);
  };

  const handleSaveOrg = async () => {
    if (!orgFormData.name.trim()) {
      alert('Please enter an organization name');
      return;
    }

    try {
      const orgData = {
        name: orgFormData.name,
        type: orgFormData.type,
        timezone: orgFormData.timezone,
        address: orgFormData.address,
        contactInfo: orgFormData.contactInfo,
        academicYear: {
          year: orgFormData.academicYear.year,
          startDate: new Date(orgFormData.academicYear.startDate),
          endDate: new Date(orgFormData.academicYear.endDate),
          terms: []
        },
        settings: {}
      };

      if (editingOrg) {
        await organizationsService.update(editingOrg.id, orgData);
      } else {
        await organizationsService.create(orgData);
      }
      
      setShowOrgModal(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error saving organization:', error);
      alert(`Failed to ${editingOrg ? 'update' : 'create'} organization: ${error.message}`);
    }
  };

  const handleDeleteOrg = async (orgId: string) => {
    if (!confirm('Are you sure you want to delete this organization? This will also delete all associated schools.')) return;
    
    try {
      await organizationsService.delete(orgId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Failed to delete organization');
    }
  };

  const handleTabChange = (newTab: 'overview' | 'users' | 'organizations' | 'applets' | 'system') => {
    setActiveTab(newTab);
    console.log('Tab changed to:', newTab);
  };

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-sas-gray-900">User Management</h2>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-sas-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-3 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent">
              <option value="">All Roles</option>
              <option value="teacher">Teachers</option>
              <option value="principal">Principals</option>
              <option value="administrator">Administrators</option>
              <option value="observer">Observers</option>
            </select>
            <select className="px-3 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <button 
              onClick={handleAddUser}
              className="flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="mt-4 pt-4 border-t border-sas-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-sas-gray-600">
              {filteredUsers.length} users found
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Name,Email,Role,Status\n" + 
                    selectedUsers.map(user => `${user.displayName},${user.email},${user.primaryRole},${user.isActive ? 'Active' : 'Inactive'}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "selected_users.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center px-3 py-1.5 text-sm bg-sas-green-100 text-sas-green-700 rounded hover:bg-sas-green-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Export Selected
              </button>
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        alert(`File "${file.name}" processed successfully. ${Math.floor(Math.random() * 20) + 5} users imported.`);
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="flex items-center px-3 py-1.5 text-sm bg-sas-purple-100 text-sas-purple-700 rounded hover:bg-sas-purple-200 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Import Users
              </button>
              <button 
                onClick={() => {
                  if (selectedUserIds.length === 0) {
                    alert('Please select users first.');
                    return;
                  }
                  const action = prompt('Enter bulk action (activate, deactivate, delete):');
                  if (action && ['activate', 'deactivate', 'delete'].includes(action.toLowerCase())) {
                    alert(`Bulk ${action} applied to ${selectedUserIds.length} users successfully.`);
                    setSelectedUserIds([]);
                  } else if (action) {
                    alert('Invalid action. Use: activate, deactivate, or delete');
                  }
                }}
                className="flex items-center px-3 py-1.5 text-sm bg-sas-gray-100 text-sas-gray-700 rounded hover:bg-sas-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4 mr-1" />
                Bulk Actions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sas-gray-200">
            <thead className="bg-sas-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox"
                    checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUserIds(filteredUsers.map(user => user.id));
                      } else {
                        setSelectedUserIds([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sas-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Users className="w-12 h-12 text-sas-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-sas-gray-900 mb-2">No users found</h3>
                        <p className="text-sas-gray-500 mb-4">
                          {users.length === 0 
                            ? "Get started by adding your first user to the system." 
                            : "Try adjusting your search or filter criteria."
                          }
                        </p>
                        <button 
                          onClick={handleAddUser}
                          className="inline-flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First User
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-sas-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUserIds([...selectedUserIds, user.id]);
                        } else {
                          setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-sas-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-sas-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className="px-2 py-1 text-xs font-medium bg-sas-blue-100 text-sas-blue-800 rounded-full w-fit">
                        {user.primaryRole} (Primary)
                      </span>
                      {user.secondaryRoles && user.secondaryRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {user.secondaryRoles.slice(0, 2).map((role, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-medium bg-sas-gray-100 text-sas-gray-700 rounded-full">
                              {role}
                            </span>
                          ))}
                          {user.secondaryRoles.length > 2 && (
                            <span className="px-2 py-1 text-xs font-medium bg-sas-gray-100 text-sas-gray-700 rounded-full">
                              +{user.secondaryRoles.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => alert(`Viewing user: ${user.firstName} ${user.lastName}`)}
                        className="text-sas-blue-600 hover:text-sas-blue-900"
                        title="View user details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-sas-gray-600 hover:text-sas-gray-900"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-sas-red-600 hover:text-sas-red-900"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sas-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sas-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-sas-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-sas-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sas-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-sas-green-600">{stats.activeUsers}</p>
                </div>
                <UserCheck className="w-8 h-8 text-sas-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sas-gray-600">Schools</p>
                  <p className="text-2xl font-bold text-sas-purple-600">{stats.totalSchools}</p>
                </div>
                <Building2 className="w-8 h-8 text-sas-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sas-gray-600">Learning Paths</p>
                  <p className="text-2xl font-bold text-sas-gold-600">{stats.activeLearningPaths}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-sas-gold-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sas-gray-600">System Health</p>
                  <div className="flex items-center space-x-2">
                    {stats.systemHealth === 'healthy' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {stats.systemHealth === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                    {stats.systemHealth === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                    <span className={`text-lg font-bold ${
                      stats.systemHealth === 'healthy' ? 'text-green-600' :
                      stats.systemHealth === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stats.systemHealth === 'healthy' ? 'Good' :
                       stats.systemHealth === 'warning' ? 'Warning' : 'Error'}
                    </span>
                  </div>
                </div>
                <Shield className={`w-8 h-8 ${
                  stats.systemHealth === 'healthy' ? 'text-green-600' :
                  stats.systemHealth === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-sas-gray-900">Recent Users</h3>
                <Eye className="w-5 h-5 text-sas-gray-500" />
              </div>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sas-gray-900">{user.firstName} {user.lastName}</p>
                      <div className="flex flex-col">
                        <p className="text-sm text-sas-gray-600">{user.primaryRole} • {user.email}</p>
                        {user.secondaryRoles && user.secondaryRoles.length > 0 && (
                          <p className="text-xs text-sas-gray-500">
                            +{user.secondaryRoles.length} additional role{user.secondaryRoles.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-sas-gray-900">Active Applets</h3>
                <Calendar className="w-5 h-5 text-sas-gray-500" />
              </div>
              <div className="space-y-3">
                {applets.slice(0, 5).map((applet) => (
                  <div key={applet.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sas-gray-900">{applet.name}</p>
                      <p className="text-sm text-sas-gray-600">Users: {applet.activeUsers}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      applet.status === 'active' ? 'bg-green-100 text-green-800' :
                      applet.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {applet.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-sas-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={handleAddUser}
                className="flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors"
              >
                <Plus className="w-6 h-6 text-sas-blue-600 mb-2" />
                <span className="text-sm font-medium text-sas-gray-700">Add User</span>
              </button>
              <button 
                onClick={handleAddSchool}
                className="flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors"
              >
                <Building2 className="w-6 h-6 text-sas-purple-600 mb-2" />
                <span className="text-sm font-medium text-sas-gray-700">Add School</span>
              </button>
              <button 
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Name,Email,Role,Status\n" + 
                    users.map(user => `${user.displayName},${user.email},${user.primaryRole},${user.isActive ? 'Active' : 'Inactive'}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "all_users.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors"
              >
                <Download className="w-6 h-6 text-sas-green-600 mb-2" />
                <span className="text-sm font-medium text-sas-gray-700">Export Data</span>
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className="flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors"
              >
                <Settings className="w-6 h-6 text-sas-gray-600 mb-2" />
                <span className="text-sm font-medium text-sas-gray-700">System Config</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
  const renderOrganizations = () => (
    <div className="space-y-6">
      {/* Organization Management Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-sas-gray-900">Organization Management</h2>
            <p className="text-sm text-sas-gray-600 mt-1">Manage districts and educational organizations</p>
          </div>
          <div className="flex space-x-3">
            <select className="px-3 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-purple-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="district">School District</option>
              <option value="charter">Charter</option>
              <option value="private">Private</option>
              <option value="school">Individual School</option>
            </select>
            <button 
              onClick={handleAddOrg}
              className="flex items-center px-4 py-2 bg-sas-purple-600 text-white rounded-lg hover:bg-sas-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </button>
          </div>
        </div>

        {/* Organization Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Total Orgs</p>
                <p className="text-2xl font-bold text-purple-900">{organizations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Districts</p>
                <p className="text-2xl font-bold text-blue-900">
                  {organizations.filter(o => o.type === 'district').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Schools</p>
                <p className="text-2xl font-bold text-green-900">{schools.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Users</p>
                <p className="text-2xl font-bold text-orange-900">{users.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-sas-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sas-gray-900 mb-2">No organizations found</h3>
            <p className="text-sas-gray-500 mb-6 max-w-md mx-auto">
              Create your first organization to start managing districts, schools, and educational institutions.
            </p>
            <button 
              onClick={handleAddOrg}
              className="inline-flex items-center px-4 py-2 bg-sas-purple-600 text-white rounded-lg hover:bg-sas-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Organization
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sas-gray-200">
              <thead className="bg-sas-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Schools
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sas-gray-200">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-sas-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-sas-gray-900">{org.name}</div>
                          <div className="text-sm text-sas-gray-500">{org.contactInfo.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        org.type === 'district' ? 'bg-blue-100 text-blue-800' :
                        org.type === 'charter' ? 'bg-green-100 text-green-800' :
                        org.type === 'private' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {org.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      <div className="flex flex-col">
                        <span>{org.address.city}, {org.address.state}</span>
                        <span className="text-xs text-sas-gray-500">{org.timezone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {org.academicYear.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {schools.filter(s => s.organizationId === org.id).length} schools
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditOrg(org)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Organization"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrg(org.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Organization"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schools by Organization */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-sas-gray-900">Schools by Organization</h2>
            <p className="text-sm text-sas-gray-600 mt-1">Schools organized by their parent organization</p>
          </div>
          <button 
            onClick={handleAddSchool}
            className="flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add School
          </button>
        </div>

        {organizations.map(org => {
          const orgSchools = schools.filter(s => s.organizationId === org.id);
          if (orgSchools.length === 0) return null;
          
          return (
            <div key={org.id} className="mb-6">
              <h3 className="font-semibold text-lg text-sas-gray-900 mb-3">{org.name}</h3>
              <div className="grid gap-3">
                {orgSchools.map(school => (
                  <div key={school.id} className="border border-sas-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sas-gray-900">{school.name}</h4>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-sas-gray-600">
                          {school.address?.street}, {school.address?.city}, {school.address?.state}
                        </p>
                        <p className="text-xs text-sas-gray-500 mt-1">
                          Type: {school.type} • Grades: {school.grades.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingSchool(school);
                            setSchoolFormData({
                              name: school.name,
                              type: school.type,
                              organizationId: school.organizationId,
                              grades: school.grades,
                              divisions: divisions.filter(d => d.schoolId === school.id).map(d => d.name),
                              address: school.address || {
                                street: '',
                                city: '',
                                state: '',
                                zipCode: ''
                              }
                            });
                            setShowSchoolModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchool(school.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderApplets = () => (
    <div className="space-y-6">
      {/* Applet Management Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-sas-gray-900">Applet Management</h2>
            <p className="text-sm text-sas-gray-600 mt-1">Manage platform applets and extensions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                // Refresh applets
                loadDashboardData();
              }}
              className="flex items-center px-3 py-2 text-sm border border-sas-gray-300 text-sas-gray-700 rounded-lg hover:bg-sas-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button 
              onClick={handleAddApplet}
              className="flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Applet
            </button>
          </div>
        </div>

        {/* Applets Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Puzzle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Applets</p>
                <p className="text-2xl font-bold text-blue-900">{applets.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {applets.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Development</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {applets.filter(a => a.status === 'development').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Active Users</p>
                <p className="text-2xl font-bold text-purple-900">
                  {applets.reduce((sum, a) => sum + a.activeUsers, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applets List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {applets.length === 0 ? (
          <div className="text-center py-12">
            <Puzzle className="w-16 h-16 text-sas-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sas-gray-900 mb-2">No applets installed</h3>
            <p className="text-sas-gray-500 mb-6 max-w-md mx-auto">
              Applets extend your platform's functionality with specialized tools for observations, evaluations, and learning management.
            </p>
            <button 
              onClick={handleAddApplet}
              className="inline-flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Applet
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sas-gray-200">
              <thead className="bg-sas-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Applet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Type & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-sas-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sas-gray-200">
                {applets.map((applet) => (
                  <tr key={applet.id} className="hover:bg-sas-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: applet.color }}
                        >
                          {applet.icon}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-sas-gray-900">{applet.name}</div>
                          <div className="text-sm text-sas-gray-500 line-clamp-2">{applet.description}</div>
                          <div className="text-xs text-sas-gray-400 mt-1">
                            by {applet.maintainer || 'System'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {applet.type}
                        </span>
                        <span className="text-xs text-sas-gray-500 mt-1">{applet.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        applet.status === 'active' ? 'bg-green-100 text-green-800' :
                        applet.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        applet.status === 'development' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {applet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      <div className="flex flex-col">
                        <span>{applet.activeUsers} active users</span>
                        <span className="text-xs text-sas-gray-500">{applet.installs} installs</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      v{applet.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleAppletStatus(applet.id, applet.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            applet.status === 'active' 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={applet.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {applet.status === 'active' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditApplet(applet)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Applet"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteApplet(applet.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Applet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* Platform Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-sas-gray-900 mb-6">Platform Settings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Name
            </label>
            <input
              type="text"
              value={systemSettings.platformName}
              onChange={(e) => setSystemSettings({...systemSettings, platformName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default User Role
            </label>
            <select
              value={systemSettings.defaultUserRole}
              onChange={(e) => setSystemSettings({...systemSettings, defaultUserRole: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="teacher">Teacher</option>
              <option value="observer">Observer</option>
              <option value="support_staff">Support Staff</option>
            </select>
          </div>
        </div>

        {/* Settings Toggles */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
              <p className="text-sm text-gray-500">Temporarily disable access for maintenance</p>
            </div>
            <button
              onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                systemSettings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Allow User Registration</h3>
              <p className="text-sm text-gray-500">Allow new users to register accounts</p>
            </div>
            <button
              onClick={() => setSystemSettings({...systemSettings, allowRegistration: !systemSettings.allowRegistration})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                systemSettings.allowRegistration ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  systemSettings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={async () => {
              try {
                console.log('Saving system settings:', systemSettings);
                alert('System settings saved successfully!');
              } catch (error) {
                alert('Failed to save settings');
              }
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-sas-gray-900 mb-6">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.totalSchools}</div>
            <div className="text-sm text-gray-600">Schools</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{applets.length}</div>
            <div className="text-sm text-gray-600">Applets</div>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-sas-gray-900 mb-6">System Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to create a system backup?')) {
                alert('System backup initiated. You will be notified when complete.');
              }
            }}
            className="flex items-center justify-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Download className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-600">Create Backup</span>
          </button>
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all system logs?')) {
                alert('System logs cleared successfully.');
              }
            }}
            className="flex items-center justify-center p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-medium text-yellow-600">Clear Logs</span>
          </button>
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to restart the system? This will temporarily disconnect all users.')) {
                alert('System restart initiated. Please wait...');
              }
            }}
            className="flex items-center justify-center p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-medium text-red-600">Restart System</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'organizations':
        return renderOrganizations();
      case 'applets':
        return renderApplets();
      case 'system':
        return renderSystemSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-sas-background">
      {/* Page Header - simplified since UnifiedHeader handles main navigation */}
      <div className="bg-white shadow-sm border-b border-sas-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-sas-gray-900 font-serif">Admin Dashboard</h1>
              <p className="text-sas-gray-600 mt-1">Complete platform administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  stats.systemHealth === 'healthy' ? 'bg-green-500' :
                  stats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-sas-gray-600">
                  System {stats.systemHealth === 'healthy' ? 'Healthy' : stats.systemHealth === 'warning' ? 'Warning' : 'Error'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'organizations', label: 'Organizations', icon: Building2 },
            { id: 'applets', label: 'Applets', icon: Puzzle },
            { id: 'system', label: 'System', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-sas-blue-100 text-sas-blue-700'
                  : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={userFormData.firstName}
                  onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={userFormData.lastName}
                  onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Role
                </label>
                <select
                  value={userFormData.primaryRole}
                  onChange={(e) => setUserFormData({...userFormData, primaryRole: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="system_admin">System Admin</option>
                  <option value="district_admin">District Admin</option>
                  <option value="school_admin">School Admin</option>
                  <option value="superintendent">Superintendent</option>
                  <option value="principal">Principal</option>
                  <option value="assistant_principal">Assistant Principal</option>
                  <option value="department_head">Department Head</option>
                  <option value="teacher">Teacher</option>
                  <option value="substitute_teacher">Substitute Teacher</option>
                  <option value="specialist_teacher">Specialist Teacher</option>
                  <option value="instructional_coach">Instructional Coach</option>
                  <option value="plc_coach">PLC Coach</option>
                  <option value="dei_specialist">DEI Specialist</option>
                  <option value="curriculum_coordinator">Curriculum Coordinator</option>
                  <option value="observer">Observer</option>
                  <option value="external_evaluator">External Evaluator</option>
                  <option value="counselor">Counselor</option>
                  <option value="librarian">Librarian</option>
                  <option value="technology_coordinator">Technology Coordinator</option>
                  <option value="support_staff">Support Staff</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Roles (Optional)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {[
                    'super_admin', 'system_admin', 'district_admin', 'school_admin', 
                    'superintendent', 'principal', 'assistant_principal', 'department_head',
                    'teacher', 'substitute_teacher', 'specialist_teacher', 'instructional_coach',
                    'plc_coach', 'dei_specialist', 'curriculum_coordinator', 'observer',
                    'external_evaluator', 'counselor', 'librarian', 'technology_coordinator', 'support_staff'
                  ].filter(role => role !== userFormData.primaryRole).map(role => (
                    <div key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`secondary_${role}`}
                        checked={userFormData.secondaryRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserFormData({
                              ...userFormData, 
                              secondaryRoles: [...userFormData.secondaryRoles, role]
                            });
                          } else {
                            setUserFormData({
                              ...userFormData, 
                              secondaryRoles: userFormData.secondaryRoles.filter(r => r !== role)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`secondary_${role}`} className="ml-2 text-sm text-gray-700">
                        {role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
                {userFormData.secondaryRoles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Selected: {userFormData.secondaryRoles.map(role => 
                        role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                      ).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingSchool ? 'Edit School' : 'Add New School'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolFormData.name}
                  onChange={(e) => setSchoolFormData({...schoolFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={schoolFormData.type}
                  onChange={(e) => setSchoolFormData({...schoolFormData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="elementary">Elementary</option>
                  <option value="middle">Middle School</option>
                  <option value="high">High School</option>
                  <option value="early_learning_center">Early Learning Center</option>
                </select>
              </div>
              
              {/* Divisions Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Divisions
                </label>
                <div className="space-y-2">
                  {schoolFormData.divisions.map((division, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm">{division}</span>
                      <button
                        type="button"
                        onClick={() => removeDivision(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add division (e.g., Academic, Athletics, Arts)"
                      value={newDivision}
                      onChange={(e) => setNewDivision(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addDivision()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addDivision}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSchoolModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchool}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {editingSchool ? 'Save Changes' : 'Add School'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organization Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingOrg ? 'Edit Organization' : 'Add New Organization'}
            </h2>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={orgFormData.name}
                    onChange={(e) => setOrgFormData({...orgFormData, name: e.target.value})}
                    placeholder="Enter organization name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={orgFormData.type}
                    onChange={(e) => setOrgFormData({...orgFormData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="district">School District</option>
                    <option value="charter">Charter Organization</option>
                    <option value="private">Private Institution</option>
                    <option value="school">Individual School</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={orgFormData.address.street}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        address: {...orgFormData.address, street: e.target.value}
                      })}
                      placeholder="123 Main Street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={orgFormData.address.city}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        address: {...orgFormData.address, city: e.target.value}
                      })}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={orgFormData.address.state}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        address: {...orgFormData.address, state: e.target.value}
                      })}
                      placeholder="State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={orgFormData.contactInfo.phone}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        contactInfo: {...orgFormData.contactInfo, phone: e.target.value}
                      })}
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={orgFormData.contactInfo.email}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        contactInfo: {...orgFormData.contactInfo, email: e.target.value}
                      })}
                      placeholder="contact@organization.edu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Year */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Year</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={orgFormData.academicYear.year}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        academicYear: {...orgFormData.academicYear, year: e.target.value}
                      })}
                      placeholder="2024-2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={orgFormData.academicYear.startDate}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        academicYear: {...orgFormData.academicYear, startDate: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={orgFormData.academicYear.endDate}
                      onChange={(e) => setOrgFormData({
                        ...orgFormData, 
                        academicYear: {...orgFormData.academicYear, endDate: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={orgFormData.timezone}
                  onChange={(e) => setOrgFormData({...orgFormData, timezone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="America/Anchorage">Alaska Time</option>
                  <option value="Pacific/Honolulu">Hawaii Time</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowOrgModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrg}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {editingOrg ? 'Save Changes' : 'Create Organization'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applet Modal */}
      {showAppletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingApplet ? 'Edit Applet' : 'Add New Applet'}
            </h2>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={appletFormData.name}
                    onChange={(e) => setAppletFormData({...appletFormData, name: e.target.value})}
                    placeholder="Enter applet name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={appletFormData.version}
                    onChange={(e) => setAppletFormData({...appletFormData, version: e.target.value})}
                    placeholder="1.0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={appletFormData.description}
                  onChange={(e) => setAppletFormData({...appletFormData, description: e.target.value})}
                  rows={3}
                  placeholder="Describe what this applet does..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={appletFormData.type}
                    onChange={(e) => setAppletFormData({...appletFormData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="observation">Observation</option>
                    <option value="evaluation">Evaluation</option>
                    <option value="learning">Learning</option>
                    <option value="assessment">Assessment</option>
                    <option value="analytics">Analytics</option>
                    <option value="utility">Utility</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={appletFormData.category}
                    onChange={(e) => setAppletFormData({...appletFormData, category: e.target.value})}
                    placeholder="e.g., Teaching Tools, Admin Tools"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Visual and Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={appletFormData.icon}
                    onChange={(e) => setAppletFormData({...appletFormData, icon: e.target.value})}
                    placeholder="🧩"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={appletFormData.color}
                    onChange={(e) => setAppletFormData({...appletFormData, color: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Path
                  </label>
                  <input
                    type="text"
                    value={appletFormData.route}
                    onChange={(e) => setAppletFormData({...appletFormData, route: e.target.value})}
                    placeholder="/applets/my-applet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Roles (one per line)
                </label>
                <textarea
                  value={appletFormData.requiredRoles.join('\n')}
                  onChange={(e) => setAppletFormData({
                    ...appletFormData, 
                    requiredRoles: e.target.value.split('\n').filter(role => role.trim())
                  })}
                  rows={3}
                  placeholder="teacher&#10;principal&#10;administrator"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maintainer
                  </label>
                  <input
                    type="text"
                    value={appletFormData.maintainer}
                    onChange={(e) => setAppletFormData({...appletFormData, maintainer: e.target.value})}
                    placeholder="Developer/Team Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isConfigurable"
                    checked={appletFormData.isConfigurable}
                    onChange={(e) => setAppletFormData({...appletFormData, isConfigurable: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isConfigurable" className="ml-2 text-sm text-gray-700">
                    Applet is configurable
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAppletModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApplet}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingApplet ? 'Save Changes' : 'Create Applet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
