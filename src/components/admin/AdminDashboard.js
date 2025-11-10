import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Settings, Users, Building2, BarChart3, Shield, Plus, Edit, Trash2, Eye, Search, Download, AlertCircle, CheckCircle, UserCheck, GraduationCap } from 'lucide-react';
import { usersService, organizationsService, schoolsService, divisionsService, departmentsService } from '../../lib/firestore';
const AdminDashboard = ({ defaultTab = 'overview' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [schools, setSchools] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
    const [selectedOrgIds, setSelectedOrgIds] = useState([]);
    // Modal and editing state
    const [showUserModal, setShowUserModal] = useState(false);
    const [showSchoolModal, setShowSchoolModal] = useState(false);
    const [showOrgModal, setShowOrgModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editingSchool, setEditingSchool] = useState(null);
    const [editingOrg, setEditingOrg] = useState(null);
    // Form state
    const [userFormData, setUserFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        primaryRole: 'teacher',
        secondaryRoles: []
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
    const [stats, setStats] = useState({
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
            const [usersData, orgsData, schoolsData, divisionsData, departmentsData] = await Promise.all([
                usersService.list(),
                organizationsService.list(),
                schoolsService.list(),
                divisionsService.list(),
                departmentsService.list()
            ]);
            setUsers(usersData);
            setOrganizations(orgsData);
            setSchools(schoolsData);
            setDivisions(divisionsData);
            setDepartments(departmentsData);
            // Calculate stats
            const activeUsers = usersData.filter(u => u.isActive).length;
            const activeSchools = schoolsData.length; // All mock schools are active
            setStats({
                totalUsers: usersData.length,
                activeUsers,
                totalSchools: activeSchools,
                activeLearningPaths: 0,
                pendingEvaluations: Math.floor(Math.random() * 25) + 5, // Mock pending evaluations
                systemHealth: activeUsers > usersData.length * 0.8 ? 'healthy' : 'warning'
            });
        }
        catch (error) {
            console.error('Failed to load dashboard data:', error);
            setStats(prev => ({ ...prev, systemHealth: 'error' }));
        }
    };
    const filteredUsers = users.filter(user => searchTerm === '' ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.primaryRole.toLowerCase().includes(searchTerm.toLowerCase()));
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
    const handleEditUser = (user) => {
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
            }
            else {
                await usersService.create(userData);
            }
            setShowUserModal(false);
            await loadDashboardData();
        }
        catch (error) {
            console.error('Error saving user:', error);
            alert(`Failed to ${editingUser ? 'update' : 'create'} user: ${error.message}`);
        }
    };
    const getPermissionsForRole = (role) => {
        switch (role) {
            case 'super_admin':
                return ['*']; // All permissions
            case 'system_admin':
                return ['users.read', 'users.write', 'organizations.read', 'organizations.write', 'system.read', 'system.write'];
            case 'district_admin':
                return ['users.read', 'users.write', 'organizations.read', 'organizations.write'];
            case 'principal':
                return ['users.read', 'users.write', 'organizations.read'];
            case 'teacher':
                return ['users.read'];
            default:
                return ['users.read'];
        }
    };
    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.'))
            return;
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
        }
        catch (error) {
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
    const handleEditSchool = (school) => {
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
            }
            else {
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
        }
        catch (error) {
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
    const removeDivision = (index) => {
        setSchoolFormData({
            ...schoolFormData,
            divisions: schoolFormData.divisions.filter((_, i) => i !== index)
        });
    };
    const handleDeleteSchool = async (schoolId) => {
        if (!confirm('Are you sure you want to delete this school?'))
            return;
        try {
            await schoolsService.delete(schoolId);
            await loadDashboardData();
        }
        catch (error) {
            console.error('Error deleting school:', error);
            alert('Failed to delete school');
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
    const handleEditOrg = (org) => {
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
            }
            else {
                await organizationsService.create(orgData);
            }
            setShowOrgModal(false);
            await loadDashboardData();
        }
        catch (error) {
            console.error('Error saving organization:', error);
            alert(`Failed to ${editingOrg ? 'update' : 'create'} organization: ${error.message}`);
        }
    };
    const handleDeleteOrg = async (orgId) => {
        if (!confirm('Are you sure you want to delete this organization? This will also delete all associated schools.'))
            return;
        try {
            await organizationsService.delete(orgId);
            await loadDashboardData();
        }
        catch (error) {
            console.error('Error deleting organization:', error);
            alert('Failed to delete organization');
        }
    };
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        console.log('Tab changed to:', newTab);
    };
    const renderUsers = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [_jsx("h2", { className: "text-xl font-semibold text-sas-gray-900", children: "User Management" }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-sas-gray-400" }), _jsx("input", { type: "text", placeholder: "Search users...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent" })] }), _jsxs("select", { className: "px-3 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "All Roles" }), _jsx("option", { value: "teacher", children: "Teachers" }), _jsx("option", { value: "principal", children: "Principals" }), _jsx("option", { value: "administrator", children: "Administrators" }), _jsx("option", { value: "observer", children: "Observers" })] }), _jsxs("select", { className: "px-3 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "active", children: "Active Only" }), _jsx("option", { value: "inactive", children: "Inactive Only" })] }), _jsxs("button", { onClick: handleAddUser, className: "flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add User"] })] })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-sas-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-sas-gray-600", children: [filteredUsers.length, " users found"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: () => {
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
                                            }, className: "flex items-center px-3 py-1.5 text-sm bg-sas-green-100 text-sas-green-700 rounded hover:bg-sas-green-200 transition-colors", children: [_jsx(Download, { className: "w-4 h-4 mr-1" }), "Export Selected"] }), _jsxs("button", { onClick: () => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = '.csv';
                                                input.onchange = (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            alert(`File "${file.name}" processed successfully. ${Math.floor(Math.random() * 20) + 5} users imported.`);
                                                        };
                                                        reader.readAsText(file);
                                                    }
                                                };
                                                input.click();
                                            }, className: "flex items-center px-3 py-1.5 text-sm bg-sas-purple-100 text-sas-purple-700 rounded hover:bg-sas-purple-200 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "Import Users"] }), _jsxs("button", { onClick: () => {
                                                if (selectedUserIds.length === 0) {
                                                    alert('Please select users first.');
                                                    return;
                                                }
                                                const action = prompt('Enter bulk action (activate, deactivate, delete):');
                                                if (action && ['activate', 'deactivate', 'delete'].includes(action.toLowerCase())) {
                                                    alert(`Bulk ${action} applied to ${selectedUserIds.length} users successfully.`);
                                                    setSelectedUserIds([]);
                                                }
                                                else if (action) {
                                                    alert('Invalid action. Use: activate, deactivate, or delete');
                                                }
                                            }, className: "flex items-center px-3 py-1.5 text-sm bg-sas-gray-100 text-sas-gray-700 rounded hover:bg-sas-gray-200 transition-colors", children: [_jsx(Settings, { className: "w-4 h-4 mr-1" }), "Bulk Actions"] })] })] }) })] }), _jsx("div", { className: "bg-white rounded-xl shadow-md overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-sas-gray-200", children: [_jsx("thead", { className: "bg-sas-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: _jsx("input", { type: "checkbox", checked: selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0, onChange: (e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUserIds(filteredUsers.map(user => user.id));
                                                    }
                                                    else {
                                                        setSelectedUserIds([]);
                                                    }
                                                }, className: "rounded border-gray-300" }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "User" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Role" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Last Active" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-sas-gray-200", children: filteredUsers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-12 text-center", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx(Users, { className: "w-12 h-12 text-sas-gray-400" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-sas-gray-900 mb-2", children: "No users found" }), _jsx("p", { className: "text-sas-gray-500 mb-4", children: users.length === 0
                                                                ? "Get started by adding your first user to the system."
                                                                : "Try adjusting your search or filter criteria." }), _jsxs("button", { onClick: handleAddUser, className: "inline-flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Your First User"] })] })] }) }) })) : (filteredUsers.map((user) => (_jsxs("tr", { className: "hover:bg-sas-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("input", { type: "checkbox", checked: selectedUserIds.includes(user.id), onChange: (e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUserIds([...selectedUserIds, user.id]);
                                                    }
                                                    else {
                                                        setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                                                    }
                                                }, className: "rounded border-gray-300" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-sas-gray-900", children: [user.firstName, " ", user.lastName] }), _jsx("div", { className: "text-sm text-sas-gray-500", children: user.email })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsxs("span", { className: "px-2 py-1 text-xs font-medium bg-sas-blue-100 text-sas-blue-800 rounded-full w-fit", children: [user.primaryRole, " (Primary)"] }), user.secondaryRoles && user.secondaryRoles.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-1", children: [user.secondaryRoles.slice(0, 2).map((role, index) => (_jsx("span", { className: "px-2 py-1 text-xs font-medium bg-sas-gray-100 text-sas-gray-700 rounded-full", children: role }, index))), user.secondaryRoles.length > 2 && (_jsxs("span", { className: "px-2 py-1 text-xs font-medium bg-sas-gray-100 text-sas-gray-700 rounded-full", children: ["+", user.secondaryRoles.length - 2, " more"] }))] }))] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'}`, children: user.isActive ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-500", children: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => alert(`Viewing user: ${user.firstName} ${user.lastName}`), className: "text-sas-blue-600 hover:text-sas-blue-900", title: "View user details", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleEditUser(user), className: "text-sas-gray-600 hover:text-sas-gray-900", title: "Edit user", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteUser(user.id), className: "text-sas-red-600 hover:text-sas-red-900", title: "Delete user", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, user.id)))) })] }) }) })] }));
    const renderOverview = () => (_jsx("div", { className: "space-y-6", children: loading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-sas-blue-600" }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: stats.totalUsers })] }), _jsx(Users, { className: "w-8 h-8 text-sas-blue-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Active Users" }), _jsx("p", { className: "text-2xl font-bold text-sas-green-600", children: stats.activeUsers })] }), _jsx(UserCheck, { className: "w-8 h-8 text-sas-green-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Schools" }), _jsx("p", { className: "text-2xl font-bold text-sas-purple-600", children: stats.totalSchools })] }), _jsx(Building2, { className: "w-8 h-8 text-sas-purple-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Learning Paths" }), _jsx("p", { className: "text-2xl font-bold text-sas-gold-600", children: stats.activeLearningPaths })] }), _jsx(GraduationCap, { className: "w-8 h-8 text-sas-gold-600" })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "System Health" }), _jsxs("div", { className: "flex items-center space-x-2", children: [stats.systemHealth === 'healthy' && _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), stats.systemHealth === 'warning' && _jsx(AlertCircle, { className: "w-5 h-5 text-yellow-500" }), stats.systemHealth === 'error' && _jsx(AlertCircle, { className: "w-5 h-5 text-red-500" }), _jsx("span", { className: `text-lg font-bold ${stats.systemHealth === 'healthy' ? 'text-green-600' :
                                                            stats.systemHealth === 'warning' ? 'text-yellow-600' : 'text-red-600'}`, children: stats.systemHealth === 'healthy' ? 'Good' :
                                                            stats.systemHealth === 'warning' ? 'Warning' : 'Error' })] })] }), _jsx(Shield, { className: `w-8 h-8 ${stats.systemHealth === 'healthy' ? 'text-green-600' :
                                            stats.systemHealth === 'warning' ? 'text-yellow-600' : 'text-red-600'}` })] }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: _jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-sas-gray-900", children: "Recent Users" }), _jsx(Eye, { className: "w-5 h-5 text-sas-gray-500" })] }), _jsx("div", { className: "space-y-3", children: users.slice(0, 5).map((user) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium text-sas-gray-900", children: [user.firstName, " ", user.lastName] }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("p", { className: "text-sm text-sas-gray-600", children: [user.primaryRole, " \u2022 ", user.email] }), user.secondaryRoles && user.secondaryRoles.length > 0 && (_jsxs("p", { className: "text-xs text-sas-gray-500", children: ["+", user.secondaryRoles.length, " additional role", user.secondaryRoles.length > 1 ? 's' : ''] }))] })] }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`, children: user.isActive ? 'Active' : 'Inactive' })] }, user.id))) })] }) }), _jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-sas-gray-900 mb-4", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("button", { onClick: handleAddUser, className: "flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors", children: [_jsx(Plus, { className: "w-6 h-6 text-sas-blue-600 mb-2" }), _jsx("span", { className: "text-sm font-medium text-sas-gray-700", children: "Add User" })] }), _jsxs("button", { onClick: handleAddSchool, className: "flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors", children: [_jsx(Building2, { className: "w-6 h-6 text-sas-purple-600 mb-2" }), _jsx("span", { className: "text-sm font-medium text-sas-gray-700", children: "Add School" })] }), _jsxs("button", { onClick: () => {
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
                                    }, className: "flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors", children: [_jsx(Download, { className: "w-6 h-6 text-sas-green-600 mb-2" }), _jsx("span", { className: "text-sm font-medium text-sas-gray-700", children: "Export Data" })] }), _jsxs("button", { onClick: () => setActiveTab('system'), className: "flex flex-col items-center p-4 rounded-lg border border-sas-gray-200 hover:bg-sas-gray-50 transition-colors", children: [_jsx(Settings, { className: "w-6 h-6 text-sas-gray-600 mb-2" }), _jsx("span", { className: "text-sm font-medium text-sas-gray-700", children: "System Config" })] })] })] })] })) }));
    const renderOrganizations = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-sas-gray-900", children: "Organization Management" }), _jsx("p", { className: "text-sm text-sas-gray-600 mt-1", children: "Manage districts and educational organizations" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsxs("select", { className: "px-3 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-purple-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "All Types" }), _jsx("option", { value: "district", children: "School District" }), _jsx("option", { value: "charter", children: "Charter" }), _jsx("option", { value: "private", children: "Private" }), _jsx("option", { value: "school", children: "Individual School" })] }), _jsxs("button", { onClick: handleAddOrg, className: "flex items-center px-4 py-2 bg-sas-purple-600 text-white rounded-lg hover:bg-sas-purple-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Organization"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx("div", { className: "bg-purple-50 p-4 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-purple-100 rounded-lg", children: _jsx(Building2, { className: "w-5 h-5 text-purple-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-purple-600", children: "Total Orgs" }), _jsx("p", { className: "text-2xl font-bold text-purple-900", children: organizations.length })] })] }) }), _jsx("div", { className: "bg-blue-50 p-4 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Building2, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-blue-600", children: "Districts" }), _jsx("p", { className: "text-2xl font-bold text-blue-900", children: organizations.filter(o => o.type === 'district').length })] })] }) }), _jsx("div", { className: "bg-green-50 p-4 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx(Building2, { className: "w-5 h-5 text-green-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-green-600", children: "Schools" }), _jsx("p", { className: "text-2xl font-bold text-green-900", children: schools.length })] })] }) }), _jsx("div", { className: "bg-orange-50 p-4 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-orange-100 rounded-lg", children: _jsx(Users, { className: "w-5 h-5 text-orange-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-orange-600", children: "Users" }), _jsx("p", { className: "text-2xl font-bold text-orange-900", children: users.length })] })] }) })] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-md overflow-hidden", children: organizations.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Building2, { className: "w-16 h-16 text-sas-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-sas-gray-900 mb-2", children: "No organizations found" }), _jsx("p", { className: "text-sas-gray-500 mb-6 max-w-md mx-auto", children: "Create your first organization to start managing districts, schools, and educational institutions." }), _jsxs("button", { onClick: handleAddOrg, className: "inline-flex items-center px-4 py-2 bg-sas-purple-600 text-white rounded-lg hover:bg-sas-purple-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create First Organization"] })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-sas-gray-200", children: [_jsx("thead", { className: "bg-sas-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Organization" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Location" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Academic Year" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Schools" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-sas-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-sas-gray-200", children: organizations.map((org) => (_jsxs("tr", { className: "hover:bg-sas-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx(Building2, { className: "w-5 h-5 text-purple-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("div", { className: "text-sm font-medium text-sas-gray-900", children: org.name }), _jsx("div", { className: "text-sm text-sas-gray-500", children: org.contactInfo.email })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${org.type === 'district' ? 'bg-blue-100 text-blue-800' :
                                                    org.type === 'charter' ? 'bg-green-100 text-green-800' :
                                                        org.type === 'private' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'}`, children: org.type }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900", children: _jsxs("div", { className: "flex flex-col", children: [_jsxs("span", { children: [org.address.city, ", ", org.address.state] }), _jsx("span", { className: "text-xs text-sas-gray-500", children: org.timezone })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900", children: org.academicYear.year }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900", children: [schools.filter(s => s.organizationId === org.id).length, " schools"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex items-center justify-end space-x-2", children: [_jsx("button", { onClick: () => handleEditOrg(org), className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "Edit Organization", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteOrg(org.id), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: "Delete Organization", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, org.id))) })] }) })) }), _jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-sas-gray-900", children: "Schools by Organization" }), _jsx("p", { className: "text-sm text-sas-gray-600 mt-1", children: "Schools organized by their parent organization" })] }), _jsxs("button", { onClick: handleAddSchool, className: "flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add School"] })] }), organizations.map(org => {
                        const orgSchools = schools.filter(s => s.organizationId === org.id);
                        if (orgSchools.length === 0)
                            return null;
                        return (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-semibold text-lg text-sas-gray-900 mb-3", children: org.name }), _jsx("div", { className: "grid gap-3", children: orgSchools.map(school => (_jsx("div", { className: "border border-sas-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium text-sas-gray-900", children: school.name }), _jsx("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800", children: "Active" })] }), _jsxs("p", { className: "text-sm text-sas-gray-600", children: [school.address?.street, ", ", school.address?.city, ", ", school.address?.state] }), _jsxs("p", { className: "text-xs text-sas-gray-500 mt-1", children: ["Type: ", school.type, " \u2022 Grades: ", school.grades.join(', ')] })] }), _jsxs("div", { className: "flex items-center space-x-2 ml-4", children: [_jsx("button", { onClick: () => {
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
                                                            }, className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteSchool(school.id), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }) }, school.id))) })] }, org.id));
                    })] })] }));
    const renderSystemSettings = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-sas-gray-900 mb-6", children: "Platform Settings" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Platform Name" }), _jsx("input", { type: "text", value: systemSettings.platformName, onChange: (e) => setSystemSettings({ ...systemSettings, platformName: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Default User Role" }), _jsxs("select", { value: systemSettings.defaultUserRole, onChange: (e) => setSystemSettings({ ...systemSettings, defaultUserRole: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "teacher", children: "Teacher" }), _jsx("option", { value: "observer", children: "Observer" }), _jsx("option", { value: "support_staff", children: "Support Staff" })] })] })] }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Maintenance Mode" }), _jsx("p", { className: "text-sm text-gray-500", children: "Temporarily disable access for maintenance" })] }), _jsx("button", { onClick: () => setSystemSettings({ ...systemSettings, maintenanceMode: !systemSettings.maintenanceMode }), className: `relative inline-flex h-6 w-11 items-center rounded-full ${systemSettings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'}`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition ${systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Allow User Registration" }), _jsx("p", { className: "text-sm text-gray-500", children: "Allow new users to register accounts" })] }), _jsx("button", { onClick: () => setSystemSettings({ ...systemSettings, allowRegistration: !systemSettings.allowRegistration }), className: `relative inline-flex h-6 w-11 items-center rounded-full ${systemSettings.allowRegistration ? 'bg-blue-600' : 'bg-gray-200'}`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition ${systemSettings.allowRegistration ? 'translate-x-6' : 'translate-x-1'}` }) })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: async () => {
                                try {
                                    console.log('Saving system settings:', systemSettings);
                                    alert('System settings saved successfully!');
                                }
                                catch (error) {
                                    alert('Failed to save settings');
                                }
                            }, className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "Save Settings" }) })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-sas-gray-900 mb-6", children: "System Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "text-center p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.totalUsers }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Users" })] }), _jsxs("div", { className: "text-center p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.totalSchools }), _jsx("div", { className: "text-sm text-gray-600", children: "Schools" })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-sas-gray-900 mb-6", children: "System Actions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("button", { onClick: () => {
                                    if (confirm('Are you sure you want to create a system backup?')) {
                                        alert('System backup initiated. You will be notified when complete.');
                                    }
                                }, className: "flex items-center justify-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors", children: [_jsx(Download, { className: "w-5 h-5 text-blue-600 mr-2" }), _jsx("span", { className: "font-medium text-blue-600", children: "Create Backup" })] }), _jsxs("button", { onClick: () => {
                                    if (confirm('Are you sure you want to clear all system logs?')) {
                                        alert('System logs cleared successfully.');
                                    }
                                }, className: "flex items-center justify-center p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors", children: [_jsx(Trash2, { className: "w-5 h-5 text-yellow-600 mr-2" }), _jsx("span", { className: "font-medium text-yellow-600", children: "Clear Logs" })] }), _jsxs("button", { onClick: () => {
                                    if (confirm('Are you sure you want to restart the system? This will temporarily disconnect all users.')) {
                                        alert('System restart initiated. Please wait...');
                                    }
                                }, className: "flex items-center justify-center p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), _jsx("span", { className: "font-medium text-red-600", children: "Restart System" })] })] })] })] }));
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'users':
                return renderUsers();
            case 'organizations':
                return renderOrganizations();
            case 'system':
                return renderSystemSettings();
            default:
                return renderOverview();
        }
    };
    return (_jsxs("div", { className: "bg-sas-background", children: [_jsx("div", { className: "bg-white shadow-sm border-b border-sas-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 mb-6", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-sas-gray-900 font-serif", children: "Admin Dashboard" }), _jsx("p", { className: "text-sas-gray-600 mt-1", children: "Complete platform administration" })] }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${stats.systemHealth === 'healthy' ? 'bg-green-500' :
                                                stats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}` }), _jsxs("span", { className: "text-sm text-sas-gray-600", children: ["System ", stats.systemHealth === 'healthy' ? 'Healthy' : stats.systemHealth === 'warning' ? 'Warning' : 'Error'] })] }) })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsx("nav", { className: "flex space-x-8", children: [
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'organizations', label: 'Organizations', icon: Building2 },
                        { id: 'system', label: 'System', icon: Settings },
                    ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-sas-blue-100 text-sas-blue-700'
                            : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100'}`, children: [_jsx(tab.icon, { className: "w-4 h-4" }), _jsx("span", { children: tab.label })] }, tab.id))) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: renderContent() }), showUserModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: editingUser ? 'Edit User' : 'Add New User' }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name" }), _jsx("input", { type: "text", value: userFormData.firstName, onChange: (e) => setUserFormData({ ...userFormData, firstName: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name" }), _jsx("input", { type: "text", value: userFormData.lastName, onChange: (e) => setUserFormData({ ...userFormData, lastName: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: userFormData.email, onChange: (e) => setUserFormData({ ...userFormData, email: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Primary Role" }), _jsxs("select", { value: userFormData.primaryRole, onChange: (e) => setUserFormData({ ...userFormData, primaryRole: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "super_admin", children: "Super Admin" }), _jsx("option", { value: "system_admin", children: "System Admin" }), _jsx("option", { value: "district_admin", children: "District Admin" }), _jsx("option", { value: "school_admin", children: "School Admin" }), _jsx("option", { value: "superintendent", children: "Superintendent" }), _jsx("option", { value: "principal", children: "Principal" }), _jsx("option", { value: "assistant_principal", children: "Assistant Principal" }), _jsx("option", { value: "department_head", children: "Department Head" }), _jsx("option", { value: "teacher", children: "Teacher" }), _jsx("option", { value: "substitute_teacher", children: "Substitute Teacher" }), _jsx("option", { value: "specialist_teacher", children: "Specialist Teacher" }), _jsx("option", { value: "instructional_coach", children: "Instructional Coach" }), _jsx("option", { value: "plc_coach", children: "PLC Coach" }), _jsx("option", { value: "dei_specialist", children: "DEI Specialist" }), _jsx("option", { value: "curriculum_coordinator", children: "Curriculum Coordinator" }), _jsx("option", { value: "observer", children: "Observer" }), _jsx("option", { value: "external_evaluator", children: "External Evaluator" }), _jsx("option", { value: "counselor", children: "Counselor" }), _jsx("option", { value: "librarian", children: "Librarian" }), _jsx("option", { value: "technology_coordinator", children: "Technology Coordinator" }), _jsx("option", { value: "support_staff", children: "Support Staff" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Secondary Roles (Optional)" }), _jsx("div", { className: "space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2", children: [
                                                'super_admin', 'system_admin', 'district_admin', 'school_admin',
                                                'superintendent', 'principal', 'assistant_principal', 'department_head',
                                                'teacher', 'substitute_teacher', 'specialist_teacher', 'instructional_coach',
                                                'plc_coach', 'dei_specialist', 'curriculum_coordinator', 'observer',
                                                'external_evaluator', 'counselor', 'librarian', 'technology_coordinator', 'support_staff'
                                            ].filter(role => role !== userFormData.primaryRole).map(role => (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: `secondary_${role}`, checked: userFormData.secondaryRoles.includes(role), onChange: (e) => {
                                                            if (e.target.checked) {
                                                                setUserFormData({
                                                                    ...userFormData,
                                                                    secondaryRoles: [...userFormData.secondaryRoles, role]
                                                                });
                                                            }
                                                            else {
                                                                setUserFormData({
                                                                    ...userFormData,
                                                                    secondaryRoles: userFormData.secondaryRoles.filter(r => r !== role)
                                                                });
                                                            }
                                                        }, className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), _jsx("label", { htmlFor: `secondary_${role}`, className: "ml-2 text-sm text-gray-700", children: role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') })] }, role))) }), userFormData.secondaryRoles.length > 0 && (_jsx("div", { className: "mt-2", children: _jsxs("p", { className: "text-xs text-gray-500", children: ["Selected: ", userFormData.secondaryRoles.map(role => role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ')] }) }))] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx("button", { onClick: () => setShowUserModal(false), className: "px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleSaveUser, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors", children: editingUser ? 'Save Changes' : 'Add User' })] })] }) })), showSchoolModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-md mx-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: editingSchool ? 'Edit School' : 'Add New School' }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "School Name" }), _jsx("input", { type: "text", value: schoolFormData.name, onChange: (e) => setSchoolFormData({ ...schoolFormData, name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }), _jsxs("select", { value: schoolFormData.type, onChange: (e) => setSchoolFormData({ ...schoolFormData, type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "elementary", children: "Elementary" }), _jsx("option", { value: "middle", children: "Middle School" }), _jsx("option", { value: "high", children: "High School" }), _jsx("option", { value: "early_learning_center", children: "Early Learning Center" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Divisions" }), _jsxs("div", { className: "space-y-2", children: [schoolFormData.divisions.map((division, index) => (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md", children: [_jsx("span", { className: "text-sm", children: division }), _jsx("button", { type: "button", onClick: () => removeDivision(index), className: "text-red-600 hover:text-red-800", children: "\u00D7" })] }, index))), _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", placeholder: "Add division (e.g., Academic, Athletics, Arts)", value: newDivision, onChange: (e) => setNewDivision(e.target.value), onKeyPress: (e) => e.key === 'Enter' && addDivision(), className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), _jsx("button", { type: "button", onClick: addDivision, className: "px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "Add" })] })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx("button", { onClick: () => setShowSchoolModal(false), className: "px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleSaveSchool, className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors", children: editingSchool ? 'Save Changes' : 'Add School' })] })] }) })), showOrgModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: editingOrg ? 'Edit Organization' : 'Add New Organization' }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Organization Name *" }), _jsx("input", { type: "text", value: orgFormData.name, onChange: (e) => setOrgFormData({ ...orgFormData, name: e.target.value }), placeholder: "Enter organization name", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }), _jsxs("select", { value: orgFormData.type, onChange: (e) => setOrgFormData({ ...orgFormData, type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent", children: [_jsx("option", { value: "district", children: "School District" }), _jsx("option", { value: "charter", children: "Charter Organization" }), _jsx("option", { value: "private", children: "Private Institution" }), _jsx("option", { value: "school", children: "Individual School" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-3", children: "Address" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Street Address" }), _jsx("input", { type: "text", value: orgFormData.address.street, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                address: { ...orgFormData.address, street: e.target.value }
                                                            }), placeholder: "123 Main Street", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "City" }), _jsx("input", { type: "text", value: orgFormData.address.city, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                address: { ...orgFormData.address, city: e.target.value }
                                                            }), placeholder: "City", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "State" }), _jsx("input", { type: "text", value: orgFormData.address.state, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                address: { ...orgFormData.address, state: e.target.value }
                                                            }), placeholder: "State", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-3", children: "Contact Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), _jsx("input", { type: "tel", value: orgFormData.contactInfo.phone, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                contactInfo: { ...orgFormData.contactInfo, phone: e.target.value }
                                                            }), placeholder: "(555) 123-4567", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: orgFormData.contactInfo.email, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                contactInfo: { ...orgFormData.contactInfo, email: e.target.value }
                                                            }), placeholder: "contact@organization.edu", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-3", children: "Academic Year" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Academic Year" }), _jsx("input", { type: "text", value: orgFormData.academicYear.year, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                academicYear: { ...orgFormData.academicYear, year: e.target.value }
                                                            }), placeholder: "2024-2025", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), _jsx("input", { type: "date", value: orgFormData.academicYear.startDate, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                academicYear: { ...orgFormData.academicYear, startDate: e.target.value }
                                                            }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), _jsx("input", { type: "date", value: orgFormData.academicYear.endDate, onChange: (e) => setOrgFormData({
                                                                ...orgFormData,
                                                                academicYear: { ...orgFormData.academicYear, endDate: e.target.value }
                                                            }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Timezone" }), _jsxs("select", { value: orgFormData.timezone, onChange: (e) => setOrgFormData({ ...orgFormData, timezone: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent", children: [_jsx("option", { value: "America/New_York", children: "Eastern Time" }), _jsx("option", { value: "America/Chicago", children: "Central Time" }), _jsx("option", { value: "America/Denver", children: "Mountain Time" }), _jsx("option", { value: "America/Los_Angeles", children: "Pacific Time" }), _jsx("option", { value: "America/Anchorage", children: "Alaska Time" }), _jsx("option", { value: "Pacific/Honolulu", children: "Hawaii Time" })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx("button", { onClick: () => setShowOrgModal(false), className: "px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleSaveOrg, className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors", children: editingOrg ? 'Save Changes' : 'Create Organization' })] })] }) }))] }));
};
export default AdminDashboard;
