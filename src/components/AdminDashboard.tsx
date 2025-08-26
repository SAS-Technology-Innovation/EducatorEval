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
  Calendar
} from 'lucide-react';

import { enhancedApi } from '../api/enhancedApi';
import type { User, School, Division, Department, ProfessionalLearning } from '../types';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSchools: number;
  activeLearningPaths: number;
  pendingEvaluations: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'organizations' | 'applets' | 'system'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [learningPaths, setLearningPaths] = useState<ProfessionalLearning[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSchools: 0,
    activeLearningPaths: 0,
    pendingEvaluations: 0,
    systemHealth: 'healthy'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Initialize mock data
      await enhancedApi.initializeMockData();
      
      // Load all data
      const [usersData, schoolsData, divisionsData, departmentsData, learningData] = await Promise.all([
        enhancedApi.users.list(),
        enhancedApi.schools.list(),
        enhancedApi.divisions.list(),
        enhancedApi.departments.list(),
        enhancedApi.applets.getProfessionalLearning()
      ]);

      setUsers(usersData);
      setSchools(schoolsData);
      setDivisions(divisionsData);
      setDepartments(departmentsData);
      setLearningPaths(learningData);

      // Calculate stats
      const activeUsers = usersData.filter(u => u.isActive).length;
      const activeSchools = schoolsData.filter(s => s.isActive).length;
      
      setStats({
        totalUsers: usersData.length,
        activeUsers,
        totalSchools: activeSchools,
        activeLearningPaths: learningData.length,
        pendingEvaluations: Math.floor(Math.random() * 25) + 5, // Mock pending evaluations
        systemHealth: activeUsers > usersData.length * 0.8 ? 'healthy' : 'warning'
      });
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setStats(prev => ({ ...prev, systemHealth: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'development':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                    <span className={`text-2xl font-bold ${
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
                      <p className="text-sm text-sas-gray-600">{user.primaryRole} • {user.currentSchoolId}</p>
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
                <h3 className="text-lg font-semibold text-sas-gray-900">Learning Progress</h3>
                <Calendar className="w-5 h-5 text-sas-gray-500" />
              </div>
              <div className="space-y-3">
                {learningPaths.slice(0, 5).map((path) => (
                  <div key={path.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sas-gray-900">{path.title}</p>
                      <p className="text-sm text-sas-gray-600">Progress: {path.progressPercentage}%</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-sas-blue-600 h-2 rounded-full"
                        style={{ width: `${path.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-sas-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-sas-gray-300 rounded-lg hover:border-sas-blue-500 hover:bg-sas-blue-50 transition-colors">
            <Plus className="w-6 h-6 text-sas-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-sas-gray-600">Add User</span>
          </button>
          <button className="p-4 border-2 border-dashed border-sas-gray-300 rounded-lg hover:border-sas-green-500 hover:bg-sas-green-50 transition-colors">
            <Building2 className="w-6 h-6 text-sas-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-sas-gray-600">Add School</span>
          </button>
          <button className="p-4 border-2 border-dashed border-sas-gray-300 rounded-lg hover:border-sas-purple-500 hover:bg-sas-purple-50 transition-colors">
            <Puzzle className="w-6 h-6 text-sas-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-sas-gray-600">Install Applet</span>
          </button>
          <button className="p-4 border-2 border-dashed border-sas-gray-300 rounded-lg hover:border-sas-gold-500 hover:bg-sas-gold-50 transition-colors">
            <BarChart3 className="w-6 h-6 text-sas-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-sas-gray-600">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderApplets = () => (
    <div className="space-y-6">
      {/* Applet Management Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-sas-gray-900">Applet Registry</h2>
          <p className="text-sas-gray-600 mt-1">Manage educational applets and their configurations</p>
        </div>
        <button className="bg-gradient-to-r from-sas-blue-600 to-sas-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-sas-blue-700 hover:to-sas-green-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Install New Applet
        </button>
      </div>

      {/* Applets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applets.map((applet) => (
          <div key={applet.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-sas-gray-100 rounded-lg flex items-center justify-center text-2xl">
                  {applet.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sas-gray-900">{applet.name}</h3>
                  <p className="text-sm text-sas-gray-600">{applet.category}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applet.status)}`}>
                {applet.status}
              </span>
            </div>

            <p className="text-sm text-sas-gray-600 mb-4">{applet.description}</p>

            <div className="flex items-center justify-between text-sm text-sas-gray-600 mb-4">
              <span>Version {applet.version}</span>
              <span>{applet.installs} installs</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-sas-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sas-blue-700 transition-colors flex items-center justify-center">
                <ExternalLink className="w-4 h-4 mr-1" />
                Launch
              </button>
              <button className="bg-sas-gray-100 text-sas-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-sas-gray-200 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="bg-sas-gray-100 text-sas-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-sas-gray-200 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'applets':
        return renderApplets();
      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-sas-gray-600">User management functionality will be implemented here.</p>
          </div>
        );
      case 'organizations':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Organization Management</h2>
            <p className="text-sas-gray-600">School and organization management functionality will be implemented here.</p>
          </div>
        );
      case 'system':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-sas-gray-600">System configuration and settings will be implemented here.</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-sas-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sas-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-sas-gray-900 font-serif">Admin Dashboard</h1>
              <p className="text-sas-gray-600 mt-1">Platform administration and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-sas-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-sas-red-700 shadow-lg transition-all duration-200 hover:shadow-xl">
                Emergency Stop
              </button>
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
    </div>
  );
};

export default AdminDashboard;
