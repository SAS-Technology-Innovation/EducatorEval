import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Edit,
  Eye,
  Clock,
  Users,
  BookOpen,
  BarChart3,
  Target,
  FileText,
  Settings,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useObservations } from '../../hooks/useObservations';

export default function FrameworkDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { data: observations = [], isLoading, error } = useObservations(user?.schoolId);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Determine user role
  const userRole = user?.primaryRole || 'educator';
  const isAdmin = userRole === 'super_admin' || userRole === 'administrator';
  const isObserver = userRole === 'observer' || isAdmin;
  const isCoordinator = userRole === 'manager' || isAdmin;
  const isTeacher = userRole === 'educator';

  // Mock stats data - will be replaced with real Firestore queries
  const stats = {
    totalObservations: observations.length,
    thisWeek: observations.filter(obs => {
      const date = new Date(obs.observationDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length,
    crpEvidenceRate: 68.4, // TODO: Calculate from real data
    myObservations: observations.filter(obs => obs.observerId === user?.id).length,
    drafts: observations.filter(obs => obs.status === 'draft' && obs.observerId === user?.id).length,
    scheduled: observations.filter(obs => obs.status === 'scheduled' && obs.observerId === user?.id).length,
    targetProgress: 24.9 // Progress toward 5,000 goal
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'completed': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800'
    };

    const labels = {
      'completed': 'Completed',
      'draft': 'Draft',
      'scheduled': 'Scheduled',
      'in_progress': 'In Progress'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getRoleSpecificActions = () => {
    const baseActions = [
      {
        icon: Plus,
        label: 'New Observation',
        action: 'create',
        description: 'Start a new 10-15 minute classroom observation',
        color: 'bg-blue-500 hover:bg-blue-600 text-white',
        href: '/observations/create'
      },
      {
        icon: Calendar,
        label: 'Schedule Observation',
        action: 'schedule',
        description: 'Plan upcoming classroom visits',
        color: 'bg-green-500 hover:bg-green-600 text-white',
        href: '/observations/schedule'
      }
    ];

    if (isAdmin) {
      return [
        ...baseActions,
        {
          icon: BarChart3,
          label: 'Analytics Dashboard',
          action: 'analytics',
          description: 'View AI-powered insights and trends',
          color: 'bg-purple-500 hover:bg-purple-600 text-white',
          href: '/analytics'
        },
        {
          icon: Settings,
          label: 'System Management',
          action: 'settings',
          description: 'Manage users, frameworks, and configurations',
          color: 'bg-gray-500 hover:bg-gray-600 text-white',
          href: '/admin'
        }
      ];
    }

    if (isCoordinator) {
      return [
        ...baseActions,
        {
          icon: Users,
          label: 'Team Overview',
          action: 'team',
          description: 'Monitor division observation progress',
          color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
          href: '/team'
        }
      ];
    }

    if (isTeacher) {
      return [
        {
          icon: Eye,
          label: 'My Observations',
          action: 'my-observations',
          description: 'View feedback from recent classroom visits',
          color: 'bg-blue-500 hover:bg-blue-600 text-white',
          href: '/observations/my'
        }
      ];
    }

    return baseActions;
  };

  const filteredObservations = observations
    .filter(obs => {
      if (isTeacher) {
        return obs.educatorId === user?.id; // Teachers see their own observations
      }
      if (isObserver && !isAdmin) {
        return obs.observerId === user?.id; // Observers see their own observations
      }
      return true; // Admins see all
    })
    .filter(obs => {
      if (filterStatus !== 'all' && obs.status !== filterStatus) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        // TODO: Add teacher name search when we have user data
        return obs.subjectArea?.toLowerCase().includes(searchLower);
      }
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleQuickAction = (href: string) => {
    navigate(href);
  };

  const continueObservation = (observationId: string) => {
    navigate(`/app/observations/${observationId}/edit`);
  };

  const viewObservation = (observationId: string) => {
    navigate(`/app/observations/${observationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRP in Action Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.displayName} • {user?.jobTitle} • {user?.divisionId}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isAdmin ? 'Total Observations' : 'My Observations'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {isAdmin ? stats.totalObservations : stats.myObservations}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {isAdmin ? `${stats.targetProgress}% to 5,000 goal` : 'This quarter'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CRP Evidence Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.crpEvidenceRate}%</p>
                <p className="text-sm text-green-600 mt-1">1.6% from 70% target</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Observations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.drafts}</p>
                <p className="text-sm text-yellow-600 mt-1">Ready to complete</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.thisWeek}</p>
                <p className="text-sm text-purple-600 mt-1">Observations completed</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getRoleSpecificActions().map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.href)}
                  className={`p-6 rounded-lg text-left transition-all transform hover:scale-105 ${action.color}`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">{action.label}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue Where You Left Off */}
        {stats.drafts > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-yellow-900">Continue Where You Left Off</h2>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                {stats.drafts} Draft{stats.drafts !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {observations
                .filter(obs => obs.status === 'draft' && obs.observerId === user?.id)
                .map((obs) => (
                  <div key={obs.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{obs.educatorId}</h3>
                        <p className="text-sm text-gray-600">{obs.subjectArea} • {obs.gradeLevel}</p>
                        <p className="text-sm text-gray-500">Period {obs.period}</p>
                      </div>
                      {getStatusBadge(obs.status)}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Last modified: {new Date(obs.updatedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => continueObservation(obs.id)}
                      className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Continue Observation</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Observations */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isTeacher ? 'My Recent Observations' : 'Recent Observations'}
              </h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search observations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isTeacher ? 'Observer' : 'Teacher'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRP Evidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredObservations.slice(0, 10).map((obs) => (
                  <tr key={obs.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {obs.educatorId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {obs.gradeLevel} • Period {obs.period}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {obs.subjectArea}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(obs.observationDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{obs.period}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(obs.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {obs.status === 'completed' ? (
                        <div>
                          <span className="text-sm font-medium text-green-600">
                            8/10
                          </span>
                          <div className="text-xs text-gray-500">
                            80% evidence
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          {obs.status === 'scheduled' ? 'Pending' : 'In Progress'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewObservation(obs.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Observation"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(obs.status === 'draft' || (obs.observerId === user?.id && !isTeacher)) && (
                          <button
                            onClick={() => continueObservation(obs.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title={obs.status === 'draft' ? 'Continue Observation' : 'Edit Observation'}
                          >
                            {obs.status === 'draft' ? <Play className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredObservations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No observations found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first observation'}
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <button
                  onClick={() => handleQuickAction('/observations/create')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-600 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Observation</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Role-specific additional content */}
        {isAdmin && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">AI Insights Preview</h3>
                <Brain className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-sm font-medium text-blue-900">Latest Gemini Analysis</p>
                  <p className="text-sm text-blue-800 mt-1">
                    CRP evidence rate approaching 70% target. Focus on look-for #8 (student reflection) for maximum impact.
                  </p>
                </div>
                <button
                  onClick={() => handleQuickAction('/analytics')}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                >
                  View Full Analytics Dashboard
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Observers</span>
                  <span className="text-sm font-medium text-gray-900">72/80</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gemini AI Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Goal Progress</span>
                  <span className="text-sm font-medium text-gray-900">{stats.targetProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
