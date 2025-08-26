import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { formatDate } from '../utils';
import { FileText, Users, TrendingUp, Calendar } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { dashboardData, loading, error } = useAdmin();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Loading dashboard...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600">Error loading dashboard: {error.message}</div>
    </div>
  );

  if (!dashboardData) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">No dashboard data available</div>
    </div>
  );

  const { stats, recentObservations } = dashboardData;

  const statItems = [
    { title: 'Total Observations', value: stats.totalObservations.toString(), change: '+12%', target: `${stats.goalProgress.target} goal`, icon: FileText, color: 'blue' },
    { title: 'Active Observers', value: stats.activeObservers.toString(), change: '+5%', target: '80 target', icon: Users, color: 'green' },
    { title: 'CRP Evidence', value: `${Math.round(stats.crpEvidenceRate * 100)}%`, change: '+8%', target: '70% goal', icon: TrendingUp, color: 'purple' },
    { title: 'This Week', value: stats.weeklyObservations.toString(), change: '+25%', target: '~32 weekly target', icon: Calendar, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRP in Action Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Leading with Observation: Culturally Responsive Practices across all learning spaces</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                New Observation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statItems.map((stat, index) => {
            const colorClasses = {
              blue: 'bg-blue-500',
              green: 'bg-green-500',
              purple: 'bg-purple-500',
              orange: 'bg-orange-500'
            };

            const Icon = stat.icon;

            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last period</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.target}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Observations */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Observations</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentObservations.map((observation) => (
                  <tr key={observation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Teacher {observation.teacherId}</div>
                        <div className="text-sm text-gray-500">{observation.classInfo.grade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {observation.classInfo.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(observation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {observation.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        observation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        observation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {observation.status === 'in-progress' ? 'In Progress' : 
                         observation.status.charAt(0).toUpperCase() + observation.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
