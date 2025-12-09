/**
 * @deprecated This component is not currently used in routing.
 * The active observation pages are:
 * - ObservationsPage (for managers/admins - full management)
 * - TeacherObservationsView (for educators - view only)
 * - ObserverObservationsView (for observers - their observations)
 * See app/app/ObservationsPageRoleRouter.tsx for routing logic.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { observationsService } from '../../../lib/firestore';
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
  AlertCircle
} from 'lucide-react';

const SimpleObservationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [observations, setObservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load observations from Firestore
  useEffect(() => {
    const loadObservations = async () => {
      try {
        setLoading(true);
        const data = await observationsService.list({
          orderBy: ['createdAt', 'desc'],
          limit: 50
        });
        
        setObservations(data);
      } catch (error) {
        console.error('Failed to load observations:', error);
        setObservations([]);
      } finally {
        setLoading(false);
      }
    };

    loadObservations();
  }, []);

  // Filter observations
  const filteredObservations = useMemo(() => {
    return observations.filter(obs => {
      const matchesSearch = !searchTerm || 
        obs.educatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.subjectArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      crpEvidence: observations.filter(obs => obs.crpPercentage > 0).length,
    };
  }, [observations]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-sas-blue-600" />;
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
        return 'bg-sas-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-sas-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sas-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-sas-gray-900 font-serif">Observations</h1>
              <p className="text-sas-gray-600 mt-1">Teacher observation management and frameworks</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-sas-blue-600 to-sas-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-sas-blue-700 hover:to-sas-green-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Observation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
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
                <p className="text-2xl font-bold text-sas-blue-600">{stats.scheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-sas-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sas-gray-600">With Evidence</p>
                <p className="text-2xl font-bold text-sas-purple-600">{stats.crpEvidence}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-sas-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Score %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sas-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sas-gray-200">
                {filteredObservations.map((observation) => (
                  <tr key={observation.id} className="hover:bg-sas-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sas-gray-900">
                      {observation.educatorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {observation.subjectArea}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {observation.gradeLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sas-gray-900">
                      {new Date(observation.observationDate).toLocaleDateString()}
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
                        <button className="text-sas-blue-600 hover:text-sas-blue-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-sas-green-600 hover:text-sas-green-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
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
    </div>
  );
};

export default SimpleObservationsPage;
