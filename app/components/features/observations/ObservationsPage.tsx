import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../../stores/auth';
import { useObservations, useCreateObservation, useDeleteObservation } from '../../../hooks/useObservations';
import { useFrameworks } from '../../../hooks/useFrameworks';
import ObservationForm from './ObservationForm';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

const ObservationsPage: React.FC = () => {
  const { user, hasPermission } = useAuthStore();
  const { data: observations, isLoading: observationsLoading } = useObservations();
  const { data: frameworks } = useFrameworks();
  const createObservationMutation = useCreateObservation();
  const deleteObservationMutation = useDeleteObservation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [showObservationForm, setShowObservationForm] = useState(false);

  // Filter observations based on search and filters
  const filteredObservations = useMemo(() => {
    if (!observations) return [];

    return observations.filter(obs => {
      const matchesSearch = !searchTerm ||
        obs.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.context?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.context?.grade?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;

      const matchesFramework = selectedFramework === 'all' || obs.frameworkId === selectedFramework;

      return matchesSearch && matchesStatus && matchesFramework;
    });
  }, [observations, searchTerm, statusFilter, selectedFramework]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!observations) return { total: 0, completed: 0, draft: 0, submitted: 0, crpEvidence: 0 };

    return {
      total: observations.length,
      completed: observations.filter(obs => obs.status === 'completed').length,
      draft: observations.filter(obs => obs.status === 'draft').length,
      submitted: observations.filter(obs => obs.status === 'submitted').length,
      crpEvidence: observations.filter(obs => obs.crpEvidenceCount > 0).length,
    };
  }, [observations]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'submitted':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'reviewed':
        return <Calendar className="w-4 h-4 text-sas-blue-600" />;
      case 'draft':
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-sas-blue-100 text-blue-800';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveDraft = async (data: any) => {
    try {
      await createObservationMutation.mutateAsync({
        ...data,
        status: 'draft',
        observerId: user?.id,
        observerName: user?.displayName || `${user?.firstName} ${user?.lastName}`,
      });
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(`Failed to save draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitObservation = async (data: any) => {
    try {
      await createObservationMutation.mutateAsync({
        ...data,
        status: 'submitted',
        observerId: user?.id,
        observerName: user?.displayName || `${user?.firstName} ${user?.lastName}`,
        submittedAt: new Date().toISOString(),
      });
      alert('Observation submitted successfully!');
      setShowObservationForm(false);
    } catch (error) {
      console.error('Error submitting observation:', error);
      alert(`Failed to submit observation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteObservation = async (observationId: string) => {
    if (confirm('Are you sure you want to delete this observation? This action cannot be undone.')) {
      try {
        await deleteObservationMutation.mutateAsync({ id: observationId, hardDelete: false });
        alert('Observation deleted successfully!');
      } catch (error) {
        console.error('Error deleting observation:', error);
        alert(`Failed to delete observation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleCancelObservation = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      setShowObservationForm(false);
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
              <h1 className="text-2xl font-bold text-gray-900">CRP Observations</h1>
              <p className="text-gray-600">Culturally Responsive Pedagogy in Action</p>
            </div>
            <div className="flex items-center space-x-3">
              {hasPermission('observations.create') && (
                <button
                  onClick={() => setShowObservationForm(true)}
                  className="bg-sas-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sas-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Observation
                </button>
              )}
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sas-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-sas-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">
                  {observationsLoading ? '...' : stats.total.toLocaleString()}
                </p>
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
                <p className="text-lg font-bold text-gray-900">
                  {observationsLoading ? '...' : stats.completed.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-lg font-bold text-gray-900">
                  {observationsLoading ? '...' : stats.submitted.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">CRP Evidence</p>
                <p className="text-lg font-bold text-gray-900">
                  {observationsLoading ? '...' : `${Math.round((stats.crpEvidence / Math.max(stats.total, 1)) * 100)}%`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                <p className="text-lg font-bold text-gray-900">
                  {observationsLoading ? '...' : `${Math.round((stats.total / 5000) * 100)}%`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search teachers, subjects..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Framework Filter */}
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

              {/* Clear Filters */}
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Observations ({filteredObservations.length})
              </h2>
            </div>
          </div>

          {observationsLoading ? (
            <div className="p-6 text-center text-gray-500">Loading observations...</div>
          ) : filteredObservations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {observations?.length === 0 ? (
                <div>
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No observations yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first CRP observation.</p>
                  {hasPermission('observations.create') && (
                    <button
                      onClick={() => setShowObservationForm(true)}
                      className="bg-sas-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sas-blue-700"
                    >
                      Create First Observation
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No observations found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredObservations.map((observation) => (
                <div key={observation.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-sas-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-sas-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {observation.subjectName || 'Unknown Teacher'}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`}>
                              {getStatusIcon(observation.status)}
                              <span className="ml-1 capitalize">{observation.status.replace('_', ' ')}</span>
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Subject:</span> {observation.context?.subject || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Grade:</span> {observation.context?.grade || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {observation.context?.duration || 0} min
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {
                                observation.context?.date
                                  ? new Date(observation.context.date).toLocaleDateString()
                                  : 'Not scheduled'
                              }
                            </div>
                          </div>

                          {/* CRP Evidence Indicators */}
                          {observation.crpEvidenceCount > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">
                                  CRP Evidence: {observation.crpEvidenceCount}/{observation.totalLookFors} ({observation.crpPercentage?.toFixed(0) || 0}%)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-sas-blue-600 hover:bg-sas-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      {hasPermission('observations.update') && (
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {hasPermission('observations.delete') && (
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          onClick={() => handleDeleteObservation(observation.id)}
                          disabled={deleteObservationMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Observation Form Modal */}
      {showObservationForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCancelObservation}
            />

            {/* Form Container */}
            <div className="relative bg-white rounded-lg max-w-4xl w-full z-10">
              {/* Close Button */}
              <button
                onClick={handleCancelObservation}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Form */}
              <ObservationForm
                onSave={handleSaveDraft}
                onSubmit={handleSubmitObservation}
                onCancel={handleCancelObservation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationsPage;
