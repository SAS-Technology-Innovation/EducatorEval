import React from 'react';
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  Calendar,
  BookOpen,
  BarChart3,
  Plus,
  Filter,
  ArrowRight,
  ExternalLink,
  Eye,
  GraduationCap,
  Target
} from 'lucide-react';

interface Applet {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  route: string;
  status: 'available' | 'installed' | 'coming-soon';
  usage: number;
}

const CoreDashboard: React.FC = () => {
  // Mock user data
  const mockUser = {
    displayName: 'Demo User',
    email: 'demo@sas.com',
    role: 'teacher'
  };

  // Available applets in the platform
  const availableApplets: Applet[] = [
    {
      id: 'crp-observations',
      name: 'CRP Observations',
      description: 'Culturally Responsive Pedagogy classroom observation tool. Track and analyze teaching practices that support diverse learners.',
      category: 'Assessment',
      icon: <Eye className="w-6 h-6" />,
      route: '/applets/crp-observations',
      status: 'available',
      usage: 89
    },
    {
      id: 'professional-learning',
      name: 'Professional Learning',
      description: 'Course management and certification tracking system. Manage your professional development journey.',
      category: 'Training',
      icon: <GraduationCap className="w-6 h-6" />,
      route: '/applets/professional-learning',
      status: 'coming-soon',
      usage: 0
    },
    {
      id: 'performance-goals',
      name: 'Performance Goals',
      description: 'Set, track, and evaluate employee performance goals. Align individual goals with organizational objectives.',
      category: 'Performance',
      icon: <Target className="w-6 h-6" />,
      route: '/applets/performance-goals',
      status: 'coming-soon',
      usage: 0
    }
  ];

  const mockStats = {
    totalApplets: 3,
    activeApplets: 1,
    totalUsage: 89,
    thisWeekActivity: 12
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'installed':
        return 'bg-blue-100 text-blue-800';
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLaunchApplet = (applet: Applet) => {
    if (applet.status === 'available') {
      // This would navigate to the applet
      window.location.href = applet.route;
    }
  };

  return (
    <div className="min-h-screen bg-sas-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sas-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-sas-gray-900 font-serif">Dashboard</h1>
              <p className="text-sas-gray-600 mt-1">Welcome back, {mockUser.displayName || mockUser.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-sas-blue-600 to-sas-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-sas-blue-700 hover:to-sas-green-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Install Applet
              </button>
              {mockUser.role === 'admin' && (
                <button 
                  onClick={() => window.location.href = '/admin'}
                  className="border border-sas-gray-300 text-sas-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-sas-gray-50 shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">Available Applets</p>
                <p className="text-3xl font-bold text-sas-gray-900">{mockStats.totalApplets}</p>
              </div>
              <div className="w-12 h-12 bg-sas-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-sas-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">Active Applets</p>
                <p className="text-3xl font-bold text-sas-gray-900">{mockStats.activeApplets}</p>
              </div>
              <div className="w-12 h-12 bg-sas-green-100 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-sas-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">Total Usage</p>
                <p className="text-3xl font-bold text-sas-gray-900">{mockStats.totalUsage}</p>
              </div>
              <div className="w-12 h-12 bg-sas-gold-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-sas-gold-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">This Week</p>
                <p className="text-3xl font-bold text-sas-gray-900">{mockStats.thisWeekActivity}</p>
              </div>
              <div className="w-12 h-12 bg-sas-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sas-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Available Applets Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-sas-gray-900">Available Applets</h2>
            <button className="text-sas-blue-600 hover:text-sas-blue-700 font-medium text-sm flex items-center">
              Browse All
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableApplets.map((applet) => (
              <div key={applet.id} className="border border-sas-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sas-blue-100 rounded-lg flex items-center justify-center text-sas-blue-600">
                      {applet.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sas-gray-900">{applet.name}</h3>
                      <p className="text-sm text-sas-gray-600">{applet.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applet.status)}`}>
                    {applet.status.replace('-', ' ')}
                  </span>
                </div>

                <p className="text-sm text-sas-gray-600 mb-4">{applet.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-sas-gray-500">
                    {applet.usage > 0 ? `${applet.usage} uses this week` : 'Not yet used'}
                  </span>
                  <button
                    onClick={() => handleLaunchApplet(applet)}
                    disabled={applet.status === 'coming-soon'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                      applet.status === 'available'
                        ? 'bg-sas-blue-600 text-white hover:bg-sas-blue-700'
                        : 'bg-sas-gray-200 text-sas-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{applet.status === 'coming-soon' ? 'Coming Soon' : 'Launch'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-sas-gray-900">Recent Activity</h2>
            <button className="text-sas-blue-600 hover:text-sas-blue-700 font-medium text-sm flex items-center">
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-sas-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sas-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-sas-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sas-gray-900">CRP Observations applet launched</p>
                  <p className="text-sm text-sas-gray-600">Completed observation for Math class</p>
                </div>
              </div>
              <div className="text-sm text-sas-gray-500">2 hours ago</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-sas-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sas-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-sas-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sas-gray-900">Platform updated</p>
                  <p className="text-sm text-sas-gray-600">New applets available in registry</p>
                </div>
              </div>
              <div className="text-sm text-sas-gray-500">Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreDashboard;
