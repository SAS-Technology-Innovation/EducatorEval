/**
 * @deprecated This component is not currently used.
 * The active dashboards are:
 * - CRPLandingDashboard (main landing page)
 * - TeacherDashboard (for educators)
 * - ObserverDashboard (for observers)
 * - AdminDashboardNew (for admins)
 * See app/app/DashboardPage.tsx for routing logic.
 */
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  Calendar,
  BookOpen,
  BarChart3,
  Plus,
  Filter,
  ArrowRight,
  Eye,
  Target,
  GraduationCap
} from 'lucide-react';
import { observationsApi, coreApi } from '../../../lib/api';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [observationsLoading, setObservationsLoading] = useState(false);
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [frameworksLoading, setFrameworksLoading] = useState(false);
  const [totalObservations, setTotalObservations] = useState(0);
  const [stats, setStats] = useState({
    totalObservations: 0,
    recentObservations: 0,
    crpEvidenceCount: 0,
    upcomingScheduled: 0
  });

  // Helper function to check user permissions
  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || user?.permissions?.includes('*') || false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await coreApi.users.getById(firebaseUser.uid);
          setUser(profile);
          
          // Load user's observations
          const userObservations = await observationsApi.observations.list({
            teacherId: firebaseUser.uid,
            limit: 50
          });
          setObservations(userObservations);
          
          // Calculate stats
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          const recentObs = userObservations.filter(obs => 
            new Date(obs.context.date) >= oneWeekAgo
          );
          
          const crpEvidence = userObservations.filter(obs => 
            obs.crpPercentage && obs.crpPercentage > 0
          );
          
          const upcoming = userObservations.filter(obs => 
            obs.status === 'draft' && new Date(obs.context.date) > new Date()
          );
          
          setStats({
            totalObservations: userObservations.length,
            recentObservations: recentObs.length,
            crpEvidenceCount: crpEvidence.length,
            upcomingScheduled: upcoming.length
          });
          
          setTotalObservations(userObservations.length);
          
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
          setUser(firebaseUser);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sas-background">
        <div className="animate-spin w-8 h-8 border-4 border-sas-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sas-background">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sas-blue-500 to-sas-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-sas-gray-900 mb-4 font-serif">Welcome to EducatorEval</h1>
          <p className="text-sas-gray-600 mb-8">Please sign in to access your dashboard and manage your educational evaluations.</p>
          <a href="/login" className="bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto">
            Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    );
  }

  // Available applets for the user
  const availableApplets = [
    {
      id: 'crp-observations',
      name: 'CRP Observations',
      description: 'Culturally Responsive Pedagogy classroom observation tool',
      icon: <Eye className="w-6 h-6" />,
      route: '/observations',
      status: 'available',
      usage: 89
    },
    {
      id: 'professional-learning',
      name: 'Professional Learning',
      description: 'Track your professional development journey',
      icon: <GraduationCap className="w-6 h-6" />,
      route: '/learning',
      status: 'coming-soon',
      usage: 0
    },
    {
      id: 'goal-tracking',
      name: 'Goal Tracking',
      description: 'Set and monitor your professional growth goals',
      icon: <Target className="w-6 h-6" />,
      route: '/goals',
      status: 'coming-soon',
      usage: 0
    }
  ];

  const crpEvidenceRate = stats.totalObservations > 0 
    ? Math.round((stats.crpEvidenceCount / stats.totalObservations) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-sas-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sas-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-sas-gray-900 font-serif">Dashboard</h1>
              <p className="text-sas-gray-600 mt-1">Welcome back, {user.displayName || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              {hasPermission('create_observation') && (
                <button className="bg-gradient-to-r from-sas-blue-600 to-sas-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-sas-blue-700 hover:to-sas-green-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Observation
                </button>
              )}
              <button className="border border-sas-gray-300 text-sas-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-sas-gray-50 shadow-sm hover:shadow-md transition-all duration-200 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Observations */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-sas-blue-500 to-sas-blue-600 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sas-gray-600">Total Observations</p>
                <p className="text-2xl font-bold text-sas-gray-900">
                  {stats.totalObservations.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Observations */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-sas-green-500 to-sas-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sas-gray-600">This Week</p>
                <p className="text-2xl font-bold text-sas-gray-900">
                  {stats.recentObservations.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* CRP Evidence Rate */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-sas-gold-500 to-sas-gold-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sas-gray-600">CRP Evidence Rate</p>
                <p className="text-2xl font-bold text-sas-gray-900">
                  {observationsLoading ? '...' : `${crpEvidenceRate}%`}
                </p>
              </div>
            </div>
          </div>

          {/* Active Frameworks */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-sas-purple-500 to-sas-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sas-gray-600">Active Frameworks</p>
                <p className="text-2xl font-bold text-sas-gray-900">
                  {frameworksLoading ? '...' : frameworks?.filter(f => f.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Observations List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-sas-gray-100">
              <div className="px-6 py-5 border-b border-sas-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-sas-gray-900 font-serif">Recent Observations</h2>
                  <a href="/observations" className="text-sas-blue-600 text-sm font-medium hover:text-sas-blue-700 flex items-center">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
              <div className="divide-y divide-sas-gray-100">
                {observationsLoading ? (
                  <div className="p-8 text-center text-sas-gray-500 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-sas-blue-200 border-t-sas-blue-600 mb-4"></div>
                    Loading observations...
                  </div>
                ) : !observations || observations.length === 0 ? (
                  <div className="p-8 text-center text-sas-gray-500 flex flex-col items-center">
                    <div className="w-12 h-12 bg-sas-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <ClipboardCheck className="w-6 h-6 text-sas-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-sas-gray-900 mb-2">No observations yet</p>
                    <p className="text-sas-gray-500">Create your first observation to get started.</p>
                  </div>
                ) : (
                  observations.slice(0, 5).map((observation) => (
                    <div key={observation.id} className="p-6 hover:bg-sas-gray-25 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-sas-blue-100 to-sas-green-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-sas-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-sas-gray-900">
                                {observation.teacherName || 'Unknown Teacher'}
                              </p>
                              <p className="text-sm text-sas-gray-600">
                                {observation.subject} • {observation.grade}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-sas-gray-900">
                              {observation.date 
                                ? new Date(observation.date).toLocaleDateString()
                                : 'Not scheduled'
                              }
                            </p>
                            <div className="flex items-center mt-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                observation.status === 'completed'
                                  ? 'bg-sas-green-100 text-sas-green-800'
                                  : observation.status === 'submitted'
                                  ? 'bg-sas-blue-100 text-sas-blue-800'
                                  : observation.status === 'reviewed'
                                  ? 'bg-sas-gold-100 text-sas-gold-800'
                                  : 'bg-sas-gray-100 text-sas-gray-800'
                              }`}>
                                {observation.status === 'completed' ? 'Completed' :
                                 observation.status === 'submitted' ? 'Submitted' : 
                                 observation.status === 'reviewed' ? 'Reviewed' : 'Draft'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-sas-gray-100">
              <div className="px-6 py-5 border-b border-sas-gray-200">
                <h2 className="text-xl font-semibold text-sas-gray-900 font-serif">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                {hasPermission('create_observation') && (
                  <button className="w-full bg-gradient-to-r from-sas-blue-50 to-sas-blue-100 text-sas-blue-700 p-5 rounded-xl hover:from-sas-blue-100 hover:to-sas-blue-200 text-left transition-all duration-200 border border-sas-blue-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sas-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sas-gray-900">New Observation</p>
                        <p className="text-sm text-sas-blue-600 mt-1">Schedule or start an observation</p>
                      </div>
                    </div>
                  </button>
                )}
                <button className="w-full bg-gradient-to-r from-sas-green-50 to-sas-green-100 text-sas-green-700 p-5 rounded-xl hover:from-sas-green-100 hover:to-sas-green-200 text-left transition-all duration-200 border border-sas-green-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-sas-green-600 rounded-xl flex items-center justify-center mr-4">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sas-gray-900">View Analytics</p>
                      <p className="text-sm text-sas-green-600 mt-1">Check progress and trends</p>
                    </div>
                  </div>
                </button>
                <button className="w-full bg-gradient-to-r from-sas-gold-50 to-sas-gold-100 text-sas-gold-700 p-5 rounded-xl hover:from-sas-gold-100 hover:to-sas-gold-200 text-left transition-all duration-200 border border-sas-gold-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-sas-gold-600 rounded-xl flex items-center justify-center mr-4">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sas-gray-900">Frameworks</p>
                      <p className="text-sm text-sas-gold-600 mt-1">Manage observation frameworks</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* CRP Progress */}
            <div className="bg-white rounded-2xl shadow-lg border border-sas-gray-100">
              <div className="px-6 py-5 border-b border-sas-gray-200">
                <h2 className="text-xl font-semibold text-sas-gray-900 font-serif">CRP Progress</h2>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-sas-blue-600 to-sas-green-600 bg-clip-text text-transparent">
                    {totalObservations.toLocaleString()}
                  </div>
                  <div className="text-sm text-sas-gray-500 mt-1">of 5,000 observations</div>
                </div>
                <div className="w-full bg-sas-gray-200 rounded-full h-4 mb-6">
                  <div 
                    className="bg-gradient-to-r from-sas-blue-500 to-sas-green-500 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((totalObservations / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4 bg-sas-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-sas-gray-900">{crpEvidenceRate}%</div>
                    <div className="text-sm text-sas-gray-600 mt-1">CRP Evidence</div>
                  </div>
                  <div className="p-4 bg-sas-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-sas-gray-900">70%</div>
                    <div className="text-sm text-sas-gray-600 mt-1">Target Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
