import React, { useState, useEffect } from 'react';
import { Users, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../api/api';

const AdminDashboardTest: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSchools: 0,
    systemHealth: 'loading' as 'healthy' | 'warning' | 'error' | 'loading'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      console.log('Loading admin stats...');
      
      const [users, schools] = await Promise.all([
        api.users.list(),
        api.schools.list()
      ]);

      const activeUsers = users.filter(u => u.isActive).length;

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalSchools: schools.length,
        systemHealth: activeUsers > users.length * 0.8 ? 'healthy' : 'warning'
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, systemHealth: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sas-navy-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Simple Admin Dashboard Test</h1>
              <p className="text-gray-600 mt-1">Testing Priority 2 functionality</p>
            </div>
            <div className="flex items-center space-x-2">
              {stats.systemHealth === 'healthy' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {stats.systemHealth === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
              {stats.systemHealth === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              <span className="text-sm text-gray-600">
                System {stats.systemHealth}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-sas-navy-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Schools</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalSchools}</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Status</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Enhanced API client loaded successfully</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Mock data initialized with {stats.totalUsers} users</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>School data loaded ({stats.totalSchools} schools)</span>
            </div>
            <div className="flex items-center space-x-3">
              {stats.systemHealth === 'healthy' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <span>System health: {stats.systemHealth}</span>
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={loadStats}
              className="bg-sas-navy-600 text-white px-6 py-2 rounded-lg hover:bg-sas-navy-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardTest;
