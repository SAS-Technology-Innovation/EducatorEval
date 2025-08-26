import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Edit3, 
  Eye, 
  Filter,
  Search,
  MoreVertical,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  PenTool
} from 'lucide-react';
import { formatDate, formatDateTime } from '../utils';
import { useAuth } from '../hooks/useAuth';
import { useObservations } from '../hooks/useObservations';
import { frameworkService } from '../services/frameworkService';
import NewObservationModal from './NewObservationModal';
import { Observation } from '../types';

interface ObservationDashboardProps {}

const ObservationDashboard: React.FC<ObservationDashboardProps> = () => {
  const { user } = useAuth();
  const { observations, loading, stats, createObservation, updateObservation } = useObservations(user?.id);
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewObservationModal, setShowNewObservationModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Filter observations based on active tab and search query
  useEffect(() => {
    let filtered = observations;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter((obs: Observation) => obs.status === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((obs: Observation) => 
        obs.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obs.classInfo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obs.classInfo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredObservations(filtered);
  }, [observations, activeTab, searchQuery]);

  const handleStartObservation = (observationData: any) => {
    // Store observation data in session storage
    sessionStorage.setItem('newObservationData', JSON.stringify(observationData));
    // Navigate to observe page
    window.location.href = '/observe';
  };

  const handleEditObservation = (observation: Observation) => {
    // Store observation data for editing
    sessionStorage.setItem('editObservationData', JSON.stringify(observation));
    // Navigate to observe page
    window.location.href = '/observe';
  };

  const handleViewObservation = (observation: Observation) => {
    // Store observation data for viewing
    sessionStorage.setItem('viewObservationData', JSON.stringify(observation));
    // Navigate to a view-only version or open modal
    window.location.href = `/observe?view=${observation.id}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'draft':
        return <Edit3 className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getFrameworkName = (frameworkId: string) => {
    const framework = frameworkService.getFrameworkOptions().find(f => f.id === frameworkId);
    return framework ? framework.label : frameworkId;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Observations', count: observations.length },
    { id: 'completed', label: 'Completed', count: observations.filter((o: Observation) => o.status === 'completed').length },
    { id: 'in-progress', label: 'In Progress', count: observations.filter((o: Observation) => o.status === 'in-progress').length },
    { id: 'draft', label: 'Drafts', count: observations.filter((o: Observation) => o.status === 'draft').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Observation Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage classroom observations and frameworks</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/schedule'}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Observation
              </button>
              <button
                onClick={() => {
                  // Reset scheduled date and time when opening instant observation modal
                  setScheduledDate('');
                  setScheduledTime('');
                  setShowCreateModal(true);
                }}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Instant Observation
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading observations...</span>
          </div>
        )}

        {/* Main Content - only show when not loading */}
        {!loading && (
          <>
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Completed This Week</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {observations.filter((o: Observation) => o.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {observations.filter((o: Observation) => o.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Edit3 className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Drafts</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {observations.filter((o: Observation) => o.status === 'draft').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Scheduled</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by teacher or framework..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </nav>
              </div>

              {/* Observations Table */}
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher & Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Framework
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observer
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredObservations.map((observation) => (
                      <tr key={observation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {observation.teacherName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {observation.classInfo.name} - Room {observation.classInfo.room}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{getFrameworkName(observation.frameworkId)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(observation.date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(observation.startTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                            {observation.duration > 0 && (
                              <span className="ml-1">({observation.duration}min)</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(observation.status)}
                            <span className={`ml-2 ${getStatusBadge(observation.status)}`}>
                              {observation.status.charAt(0).toUpperCase() + observation.status.slice(1).replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {observation.observerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {observation.status === 'draft' && (
                              <button 
                                onClick={() => handleEditObservation(observation)}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            )}
                            {observation.status === 'in-progress' && (
                              <button 
                                onClick={() => handleEditObservation(observation)}
                                className="text-green-600 hover:text-green-900 flex items-center"
                              >
                                <PenTool className="w-4 h-4 mr-1" />
                                Continue
                              </button>
                            )}
                            {observation.status === 'completed' && (
                              <button 
                                onClick={() => handleViewObservation(observation)}
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredObservations.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No observations found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating your first observation.'}
                    </p>
                    {!searchQuery && (
                      <div className="mt-6">
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Start First Observation
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* New Observation Modal */}
      {showCreateModal && (
        <NewObservationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onStartObservation={handleStartObservation}
        />
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Observation</h3>
            <p className="text-gray-600 mb-4">Schedule an observation for a future date and time.</p>
            {/* Date and Time Inputs */}
            <div className="mb-4">
              <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                id="schedule-date"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                id="schedule-time" 
                className="w-full p-2 border border-gray-300 rounded-lg" 
              />
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={async () => {
                  if (!user || !scheduledDate || !scheduledTime) {
                    alert('Please select both date and time.');
                    return;
                  }
                  // Create a simple scheduled observation object
                  const scheduledObservation = {
                    teacherId: 'scheduled-placeholder', // Placeholder - ideally select teacher in modal
                    teacherName: 'Scheduled Teacher', // Placeholder
                    observerId: user.id,
                    observerName: user.name || user.email || 'Unknown Observer',
                    frameworkId: 'crp-in-action', // Default framework - ideally select in modal
                    date: scheduledDate,
                    startTime: scheduledTime,
                    status: 'scheduled' as const,
                    duration: 0, // Duration might be set later
                    responses: {},
                    comments: {},
                    overallComment: '',
                    classInfo: { name: 'Scheduled Class', subject: '', room: '', period: '', grade: '' }, // Placeholder
                  };
                  await createObservation(scheduledObservation);
                  setShowScheduleModal(false);
                  setScheduledDate('');
                  setScheduledTime('');
                }}
                disabled={!user || !scheduledDate || !scheduledTime} // Disable if no user or date/time
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule
              </button>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationDashboard;
