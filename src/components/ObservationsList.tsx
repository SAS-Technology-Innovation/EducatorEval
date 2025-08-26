import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Download, Calendar, User, BookOpen, Clock, MoreVertical, X } from 'lucide-react';
import Layout from './Layout';
import NewObservationModal from './NewObservationModal';
import { useAuth } from '../hooks/useAuth';
import { useObservations } from '../hooks/useObservations';
import { Observation } from '../types';

const ObservationsList: React.FC = () => {
  const { user } = useAuth();
  const { observations, loading, searchObservations, filterObservations } = useObservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'draft' | 'in-progress'>('all');
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewObservationModal, setShowNewObservationModal] = useState(false);

  useEffect(() => {
    // Load observations on component mount
    searchObservations('', { status: selectedFilter === 'all' ? undefined : [selectedFilter] });
  }, [selectedFilter]);

  const handleStartObservation = (observationData: any) => {
    // Store observation data in session storage or context
    sessionStorage.setItem('newObservationData', JSON.stringify(observationData));
    
    // Navigate to observe page
    window.location.href = '/observe';
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchObservations(term, { status: selectedFilter === 'all' ? undefined : [selectedFilter] });
  };

  const getStatusColor = (status: Observation['status']) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'submitted': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Observations</h1>
              <p className="text-gray-600 mt-2">
                {user?.role === 'teacher' 
                  ? 'View your classroom observation records and feedback'
                  : 'Manage and review classroom observations'
                }
              </p>
            </div>
            
            {(user?.role === 'observer' || user?.role === 'coordinator') && (
              <button
                onClick={() => setShowNewObservationModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>New Observation</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by teacher name, framework, or observation details..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Observations List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading observations...</p>
          </div>
        ) : observations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No observations found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms or filters"
                : "Get started by conducting your first observation"
              }
            </p>
            {(user?.role === 'observer' || user?.role === 'coordinator') && (
              <a
                href="/observe"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Start Observing</span>
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {observations.map((observation) => (
              <div key={observation.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {observation.teacherName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`}>
                              {observation.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(observation.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(observation.startTime)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{observation.observerName}</span>
                            </div>
                            <div>
                              <span className="font-medium">{observation.classInfo.subject}</span>
                              <span className="text-gray-400 mx-2">•</span>
                              <span>{observation.classInfo.grade}</span>
                            </div>
                          </div>

                          {/* Class Info */}
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">{observation.classInfo.name}</span>
                            <span className="text-gray-400 mx-2">•</span>
                            <span>Room {observation.classInfo.room}</span>
                            <span className="text-gray-400 mx-2">•</span>
                            <span>{observation.duration} minutes</span>
                          </div>

                          {/* CRP Evidence */}
                          {observation.crpEvidenceCount !== undefined && (
                            <div className="mt-3">
                              <div className="text-sm text-gray-600">
                                CRP Evidence: <span className="font-medium text-green-600">
                                  {observation.crpEvidenceCount}/{observation.totalLookFors || 10}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${((observation.crpEvidenceCount || 0) / (observation.totalLookFors || 10)) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Overall Comment Preview */}
                          {observation.overallComment && (
                            <div className="mt-3 text-sm text-gray-600">
                              <p className="line-clamp-2">{observation.overallComment}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedObservation(observation)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {(user?.role === 'observer' || user?.role === 'coordinator' || observation.observerId === user?.id) && (
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit Observation"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination would go here */}
        <div className="mt-8 flex justify-center">
          <div className="text-sm text-gray-500">
            Showing {observations.length} observations
          </div>
        </div>
      </div>

      {/* Observation Detail Modal */}
      {selectedObservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Observation Details - {selectedObservation.teacherName}
                </h2>
                <button
                  onClick={() => setSelectedObservation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Detailed view of observation would go here */}
              <p className="text-gray-600">Detailed observation view coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {/* New Observation Modal */}
      <NewObservationModal
        isOpen={showNewObservationModal}
        onClose={() => setShowNewObservationModal(false)}
        onStartObservation={handleStartObservation}
      />
    </Layout>
  );
};

export default ObservationsList;
