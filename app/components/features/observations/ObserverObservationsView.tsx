import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth';
import { useObservations } from '../../../hooks/useObservations';
import { useFrameworks } from '../../../hooks/useFrameworks';
import ObserverQuickObservation from './ObserverQuickObservation';
import {
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  TrendingUp,
  BarChart3
} from 'lucide-react';

/**
 * Observer-specific view for managing observations
 * Shows observations conducted by this observer with quick create access
 */
const ObserverObservationsView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: observations, isLoading: observationsLoading } = useObservations();
  const { data: frameworks } = useFrameworks();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');

  // Filter: Observations conducted by this observer
  const myObservations = useMemo(() => {
    if (!observations || !user) return [];

    return observations.filter(obs => {
      // Show observations where this user is the observer
      const isMyObservation = obs.observerId === user.id;

      const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;

      const matchesFramework = selectedFramework === 'all' || obs.frameworkId === selectedFramework;

      const matchesSearch = !searchTerm ||
        obs.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.context?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.context?.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.context?.grade?.toLowerCase().includes(searchTerm.toLowerCase());

      return isMyObservation && matchesStatus && matchesFramework && matchesSearch;
    }).sort((a, b) => {
      // Sort: drafts first, then by date (most recent first)
      if (a.status === 'draft' && b.status !== 'draft') return -1;
      if (a.status !== 'draft' && b.status === 'draft') return 1;

      const dateA = new Date(a.context?.date || a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.context?.date || b.updatedAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [observations, user, statusFilter, selectedFramework, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!myObservations) return { total: 0, drafts: 0, completed: 0, submitted: 0, reviewed: 0 };

    return {
      total: myObservations.length,
      drafts: myObservations.filter(obs => obs.status === 'draft').length,
      completed: myObservations.filter(obs => obs.status === 'completed').length,
      submitted: myObservations.filter(obs => obs.status === 'submitted').length,
      reviewed: myObservations.filter(obs => obs.status === 'reviewed').length,
    };
  }, [myObservations]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reviewed':
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      case 'submitted':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewObservation = (observationId: string, status: string) => {
    // If draft or completed, go to edit mode, otherwise view mode
    if (status === 'draft' || status === 'completed') {
      navigate(`/app/observations/${observationId}/edit`);
    } else {
      navigate(`/app/observations/${observationId}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view observations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Observations</h1>
              <p className="text-gray-600">Manage observations you've conducted</p>
            </div>
            <ObserverQuickObservation />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sas-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-sas-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">
                  {observationsLoading ? '...' : stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-lg font-bold text-gray-900">{stats.drafts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-lg font-bold text-gray-900">{stats.submitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-lg font-bold text-gray-900">{stats.reviewed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by teacher or class..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                  <option value="submitted">Submitted</option>
                  <option value="reviewed">Reviewed</option>
                </select>
              </div>

              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                >
                  <option value="all">All Frameworks</option>
                  {frameworks?.map((framework) => (
                    <option key={framework.id} value={framework.id}>
                      {framework.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSelectedFramework('all');
                  }}
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Observations List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Observations ({myObservations.length})
            </h2>
          </div>

          {observationsLoading ? (
            <div className="p-6 text-center text-gray-500">Loading observations...</div>
          ) : myObservations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No observations yet</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || selectedFramework !== 'all'
                  ? 'No observations match your filters.'
                  : 'Get started by creating your first observation.'}
              </p>
              {!searchTerm && statusFilter === 'all' && selectedFramework === 'all' && (
                <ObserverQuickObservation />
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {myObservations.map((observation) => (
                <div key={observation.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          observation.status === 'draft' ? 'bg-yellow-100' :
                          observation.status === 'completed' ? 'bg-green-100' :
                          observation.status === 'submitted' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {getStatusIcon(observation.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {observation.subjectName}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`}>
                              {getStatusIcon(observation.status)}
                              <span className="ml-1 capitalize">{observation.status}</span>
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Class:</span> {observation.context?.className || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Subject:</span> {observation.context?.subject || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Grade:</span> {observation.context?.grade || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {
                                observation.context?.date
                                  ? new Date(observation.context.date).toLocaleDateString()
                                  : new Date(observation.createdAt).toLocaleDateString()
                              }
                            </div>
                          </div>

                          {observation.status === 'draft' && (
                            <div className="mt-3 flex items-center text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Draft - Continue working on this observation
                            </div>
                          )}

                          {observation.crpPercentage !== undefined && observation.status !== 'draft' && (
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 mb-1">CRP Evidence</div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      observation.crpPercentage >= 75 ? 'bg-green-500' :
                                      observation.crpPercentage >= 50 ? 'bg-blue-500' :
                                      observation.crpPercentage >= 25 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${observation.crpPercentage}%` }}
                                  />
                                </div>
                              </div>
                              <div className="ml-4 text-sm font-medium text-gray-700">
                                {observation.crpPercentage.toFixed(0)}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewObservation(observation.id, observation.status)}
                        className="p-2 text-gray-400 hover:text-sas-blue-600 hover:bg-sas-blue-50 rounded-lg"
                        title={observation.status === 'draft' || observation.status === 'completed' ? 'Edit Observation' : 'View Observation'}
                      >
                        {observation.status === 'draft' || observation.status === 'completed' ? (
                          <Edit className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObserverObservationsView;
