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
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { usersService, firestoreQueries } from '../../../lib/firestore';

const UserDashboardSimple: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalObservations: 0,
    recentObservations: 0,
    crpEvidenceCount: 0,
    upcomingScheduled: 0
  });
  const [observations, setObservations] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile data from Firestore
          let userProfile = await usersService.getById(firebaseUser.uid);
          
          if (!userProfile) {
            // Create basic user profile from Firebase auth data
            userProfile = {
              id: firebaseUser.uid,
              firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              email: firebaseUser.email,
              primaryRole: 'teacher',
              schoolName: 'School'
            };
          }
          setUser(userProfile);

          // Get user's observations from Firestore
          const userObservations = await firestoreQueries.getUserObservations(firebaseUser.uid, 50);
          setObservations(userObservations);

          // Calculate real statistics
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const recentObs = userObservations.filter(obs => 
            obs.createdAt && new Date(obs.createdAt) >= oneWeekAgo
          );
          
          const completedObs = userObservations.filter(obs => obs.status === 'completed');
          const evidenceObs = completedObs.filter(obs => obs.crpPercentage && obs.crpPercentage > 0);
          const scheduledObs = userObservations.filter(obs => obs.status === 'scheduled');

          setStats({
            totalObservations: userObservations.length,
            recentObservations: recentObs.length,
            crpEvidenceCount: evidenceObs.length,
            upcomingScheduled: scheduledObs.length
          });

        } catch (error) {
          console.error('Failed to load user data:', error);
          // Fallback to basic Firebase user data
          setUser({
            id: firebaseUser.uid,
            firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            email: firebaseUser.email,
            primaryRole: 'teacher',
            schoolName: 'School'
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const crpEvidenceRate = stats.totalObservations > 0 
    ? Math.round((stats.crpEvidenceCount / stats.totalObservations) * 100) 
    : 0;

  // Available applets for the user - calculated dynamically
  const availableApplets = [
    {
      id: 'crp-observations',
      name: 'CRP Observations',
      description: 'Culturally Responsive Pedagogy classroom observation tool',
      icon: <Eye className="w-6 h-6" />,
      route: '/observations',
      status: 'available',
      usage: stats.totalObservations > 0 ? Math.min(100, Math.round((stats.totalObservations / 10) * 100)) : 0
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

  return (
    <div className="min-h-screen bg-sas-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-sas-blue-600 to-sas-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 font-serif">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-xl text-sas-blue-100 mb-6">
                Your educational excellence dashboard
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Observation
              </button>
              <button className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                View Schedule
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
                <p className="text-2xl font-bold text-sas-gray-900">{crpEvidenceRate}%</p>
              </div>
            </div>
          </div>

          {/* Active Teachers */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-sas-purple-500 to-sas-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sas-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-sas-gray-900">{stats.upcomingScheduled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Applets */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-sas-gray-900 font-serif">Available Tools</h2>
              <p className="text-sas-gray-600 mt-1">Explore the educational applets available to you</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableApplets.map((applet) => (
              <div
                key={applet.id}
                className="bg-white rounded-2xl shadow-lg border border-sas-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-xl flex items-center justify-center text-white">
                        {applet.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-sas-gray-900">{applet.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          applet.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : applet.status === 'coming-soon'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {applet.status === 'available' ? 'Available' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sas-gray-600 text-sm mb-4 line-clamp-2">{applet.description}</p>
                  
                  {applet.status === 'available' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-sas-gray-600 mb-1">
                        <span>Usage Rate</span>
                        <span>{applet.usage}%</span>
                      </div>
                      <div className="w-full bg-sas-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-sas-blue-500 to-sas-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${applet.usage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {applet.status === 'available' ? (
                      <a
                        href={applet.route}
                        className="flex-1 bg-gradient-to-r from-sas-blue-600 to-sas-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-sas-blue-700 hover:to-sas-purple-700 transition-all duration-200 text-center"
                      >
                        Launch
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-sas-gray-200 text-sas-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed text-center"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100">
          <h2 className="text-xl font-bold text-sas-gray-900 mb-4 font-serif">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/observations"
              className="flex items-center p-4 bg-sas-blue-50 rounded-xl hover:bg-sas-blue-100 transition-colors"
            >
              <Eye className="w-8 h-8 text-sas-blue-600 mr-3" />
              <div>
                <div className="font-semibold text-sas-blue-900">New Observation</div>
                <div className="text-sm text-sas-blue-700">Start a classroom observation</div>
              </div>
            </a>
            
            <a
              href="/schedule"
              className="flex items-center p-4 bg-sas-green-50 rounded-xl hover:bg-sas-green-100 transition-colors"
            >
              <Calendar className="w-8 h-8 text-sas-green-600 mr-3" />
              <div>
                <div className="font-semibold text-sas-green-900">View Schedule</div>
                <div className="text-sm text-sas-green-700">Check your observation schedule</div>
              </div>
            </a>
            
            <a
              href="/reports"
              className="flex items-center p-4 bg-sas-purple-50 rounded-xl hover:bg-sas-purple-100 transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-sas-purple-600 mr-3" />
              <div>
                <div className="font-semibold text-sas-purple-900">View Reports</div>
                <div className="text-sm text-sas-purple-700">Analyze your progress</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardSimple;