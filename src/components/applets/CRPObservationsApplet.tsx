import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  FileText,
  BarChart3
} from 'lucide-react';

interface CRPObservation {
  id: string;
  teacherName: string;
  subject: string;
  gradeLevel: string;
  date: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  crpPercentage: number;
  crpEvidence: {
    culturalResponsive: boolean;
    studentEngagement: boolean;
    equitableAccess: boolean;
    familyCommunity: boolean;
    criticalThinking: boolean;
  };
  notes: string;
  observer: string;
}

const CRPObservationsApplet: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedObservation, setSelectedObservation] = useState<CRPObservation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewForm, setShowNewForm] = useState(false);

  // Start with empty observations - user will add their own data
  const observations: CRPObservation[] = [];

  // Filter observations
  const filteredObservations = useMemo(() => {
    return observations.filter(obs => {
      const matchesSearch = !searchTerm || 
        obs.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.gradeLevel?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [observations, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: observations.length,
      completed: observations.filter(obs => obs.status === 'completed').length,
      inProgress: observations.filter(obs => obs.status === 'in_progress').length,
      scheduled: observations.filter(obs => obs.status === 'scheduled').length,
      avgCrpScore: Math.round(observations.filter(obs => obs.crpPercentage > 0).reduce((acc, obs) => acc + obs.crpPercentage, 0) / observations.filter(obs => obs.crpPercentage > 0).length) || 0,
    };
  }, [observations]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewObservation = (observation: CRPObservation) => {
    setSelectedObservation(observation);
    setCurrentView('detail');
  };

  const handleEditObservation = (observation: CRPObservation) => {
    setSelectedObservation(observation);
    setCurrentView('form');
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleNewObservation = () => {
    setSelectedObservation(null);
    setCurrentView('form');
  };

  // Header removed - now handled by UnifiedHeader in PlatformLayout

  const renderListView = () => (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">Total</p>
                <p className="text-2xl font-bold text-sas-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-sas-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">Avg CRP Score</p>
                <p className="text-2xl font-bold text-sas-purple-600">{stats.avgCrpScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-sas-purple-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-sas-gray-400" />
              <input
                type="text"
                placeholder="Search by teacher, subject, or grade level..."
                className="w-full pl-10 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                className="px-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
              </select>
              
              <button
                onClick={handleNewObservation}
                className="bg-gradient-to-r from-sas-blue-600 to-sas-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-sas-blue-700 hover:to-sas-green-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Observation
              </button>
            </div>
          </div>
        </div>

        {/* Observations Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sas-gray-200">
              <thead className="bg-sas-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">CRP Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sas-gray-200">
                {filteredObservations.map((observation) => (
                  <tr key={observation.id} className="hover:bg-sas-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sas-gray-900">
                      {observation.teacherName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {observation.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {observation.gradeLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {new Date(observation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`}>
                        {getStatusIcon(observation.status)}
                        <span className="ml-1 capitalize">{observation.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-sas-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-sas-green-600 h-2 rounded-full" 
                            style={{ width: `${observation.crpPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{observation.crpPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewObservation(observation)}
                          className="text-sas-blue-600 hover:text-sas-blue-700 p-1 rounded hover:bg-sas-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditObservation(observation)}
                          className="text-sas-green-600 hover:text-sas-green-700 p-1 rounded hover:bg-sas-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderDetailView = () => {
    if (!selectedObservation) return null;

    const crpItems = [
      { key: 'culturalResponsive', label: 'Culturally Responsive Teaching', value: selectedObservation.crpEvidence.culturalResponsive },
      { key: 'studentEngagement', label: 'Student Engagement Strategies', value: selectedObservation.crpEvidence.studentEngagement },
      { key: 'equitableAccess', label: 'Equitable Access to Learning', value: selectedObservation.crpEvidence.equitableAccess },
      { key: 'familyCommunity', label: 'Family & Community Connections', value: selectedObservation.crpEvidence.familyCommunity },
      { key: 'criticalThinking', label: 'Critical Thinking & Problem Solving', value: selectedObservation.crpEvidence.criticalThinking }
    ];

    return (
      <>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentView('list')}
                className="flex items-center space-x-2 text-sas-gray-600 hover:text-sas-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to List</span>
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditObservation(selectedObservation)}
                  className="bg-sas-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sas-blue-700 transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
              </div>
            </div>

            {/* Observation Header */}
            <div className="border-b border-sas-gray-200 pb-6 mb-6">
              <h1 className="text-2xl font-bold text-sas-gray-900 mb-2">
                {selectedObservation.teacherName} - {selectedObservation.subject}
              </h1>
              <div className="flex items-center space-x-6 text-sm text-sas-gray-600">
                <span>{selectedObservation.gradeLevel}</span>
                <span>{new Date(selectedObservation.date).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedObservation.status)}`}>
                  {selectedObservation.status.replace('_', ' ')}
                </span>
                <span className="font-semibold">CRP Score: {selectedObservation.crpPercentage}%</span>
              </div>
            </div>

            {/* CRP Evidence */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-sas-gray-900 mb-4">CRP Evidence Checklist</h2>
              <div className="grid grid-cols-1 gap-4">
                {crpItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-sas-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-sas-gray-900">{item.label}</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.value ? 'Observed' : 'Not Observed'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="text-lg font-semibold text-sas-gray-900 mb-4">Observation Notes</h2>
              <div className="bg-sas-gray-50 rounded-lg p-4">
                <p className="text-sm text-sas-gray-700">
                  {selectedObservation.notes || 'No notes provided for this observation.'}
                </p>
              </div>
              <p className="text-xs text-sas-gray-500 mt-2">
                Observed by: {selectedObservation.observer}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderFormView = () => (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentView('list')}
              className="flex items-center space-x-2 text-sas-gray-600 hover:text-sas-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to List</span>
            </button>
          </div>

          <h1 className="text-2xl font-bold text-sas-gray-900 mb-6">
            {selectedObservation ? 'Edit Observation' : 'New CRP Observation'}
          </h1>

          <div className="text-center py-12 text-sas-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-sas-gray-300" />
            <h3 className="text-lg font-medium mb-2">Observation Form</h3>
            <p className="text-sm mb-4">The detailed observation form would be implemented here with:</p>
            <ul className="text-sm text-left max-w-md mx-auto space-y-1">
              <li>• Teacher and class information</li>
              <li>• CRP evidence checkboxes</li>
              <li>• Detailed observation notes</li>
              <li>• Scoring rubrics</li>
              <li>• Save and submit functionality</li>
            </ul>
            <button 
              onClick={() => setCurrentView('list')}
              className="mt-6 bg-sas-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-sas-blue-700 transition-colors"
            >
              Back to List for Now
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Main render logic
  switch (currentView) {
    case 'detail':
      return renderDetailView();
    case 'form':
      return renderFormView();
    default:
      return renderListView();
  }
};

export default CRPObservationsApplet;
