import React from 'react';
import { useAuthStore } from '../../stores/auth';
import { BookOpen, Users, Settings, LogOut, CheckCircle } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-sas-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sas-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bebas text-sas-navy-600 tracking-wider">EducatorEval Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-sas-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-sas-red-500 text-white px-4 py-2 rounded-lg hover:bg-sas-red-600 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Authentication Status */}
          <div className="bg-sas-green-50 border border-sas-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-sas-green-600 mr-3" />
              <p className="text-sm text-sas-green-800">
                ✅ Authentication Working! User {user?.email} successfully logged in.
              </p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bebas text-sas-navy-600 tracking-wide mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-sas-gray-600">Name</p>
                <p className="text-lg font-semibold text-sas-gray-900">{user?.displayName}</p>
              </div>
              <div>
                <p className="text-sm text-sas-gray-600">Email</p>
                <p className="text-lg font-semibold text-sas-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-sas-gray-600">Role</p>
                <p className="text-lg font-semibold text-sas-gray-900 capitalize">{user?.primaryRole.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-sas-gray-600">Employee ID</p>
                <p className="text-lg font-semibold text-sas-gray-900">{user?.employeeId}</p>
              </div>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <a href="/observations" className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-sas-blue-500 mb-3">
                      <BookOpen className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-bebas text-sas-gray-900 tracking-wide">Observations</p>
                    <p className="text-sm text-sas-gray-600">Create and view observations</p>
                  </div>
                </div>
              </div>
            </a>

            <a href="/profile" className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-sas-green-500 mb-3">
                      <Users className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-bebas text-sas-gray-900 tracking-wide">Profile</p>
                    <p className="text-sm text-sas-gray-600">Manage your profile</p>
                  </div>
                </div>
              </div>
            </a>

            <a href="/settings" className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-sas-purple-500 mb-3">
                      <Settings className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-bebas text-sas-gray-900 tracking-wide">Settings</p>
                    <p className="text-sm text-sas-gray-600">Configure preferences</p>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow-lg overflow-hidden rounded-xl">
            <div className="px-6 py-6">
              <h3 className="text-lg font-bebas text-sas-gray-900 tracking-wide mb-4">
                Recent Activity
              </h3>
              <p className="text-sas-gray-600">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardContent;
