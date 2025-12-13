import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Target, BookOpen, Clock, Award, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useObservations } from '../../hooks/useObservations';
import { useMyGoals } from '../../hooks/useGoals';

/**
 * Teacher-focused dashboard
 *
 * Displays:
 * - Observation statistics from real data
 * - Recent observation scores with trend
 * - Active SMART goals progress
 * - Recommended professional development
 */
export default function TeacherDashboard() {
  const user = useAuthStore(state => state.user);

  // Fetch observations where user is the subject (being observed)
  const { data: observations = [], isLoading: isLoadingObservations } = useObservations({
    subjectId: user?.id,
    limit: 20,
  });

  // Fetch user's goals
  const { data: goals = [], isLoading: isLoadingGoals } = useMyGoals();

  if (!user) return null;

  const isLoading = isLoadingObservations || isLoadingGoals;

  // Calculate observation stats from real data
  const completedObservations = observations.filter(o => o.status === 'completed' || o.status === 'reviewed');
  const observationCount = completedObservations.length;

  // Calculate average score from completed observations
  const averageScore = completedObservations.length > 0
    ? (completedObservations.reduce((sum, obs) => {
        // Calculate average from responses if available
        const responses = obs.responses || [];
        if (responses.length === 0) return sum;
        // Parse rating as number
        const validResponses = responses.filter(r => r.rating && !isNaN(Number(r.rating)));
        if (validResponses.length === 0) return sum;
        const obsAvg = validResponses.reduce((s, r) => s + Number(r.rating), 0) / validResponses.length;
        return sum + obsAvg;
      }, 0) / completedObservations.length).toFixed(1)
    : '--';

  // Calculate goal stats
  const activeGoals = goals.filter(g => g.status === 'active');
  const activeGoalsCount = activeGoals.length;
  const inProgressGoals = activeGoals.filter(g => g.progress > 0 && g.progress < 100).length;

  // Get recent observations for history
  const recentObservations = completedObservations.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-sas-blue-600 to-sas-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bebas mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-blue-100">
          Here's your teaching journey at a glance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Observations"
          value={isLoading ? '...' : String(observationCount)}
          trend="This year"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value={isLoading ? '...' : averageScore}
          trend="From completed observations"
          color="green"
        />
        <StatCard
          icon={Target}
          label="Active Goals"
          value={isLoading ? '...' : String(activeGoalsCount)}
          trend={inProgressGoals > 0 ? `${inProgressGoals} in progress` : 'No goals in progress'}
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={isLoading ? '...' : String(observations.filter(o => o.status === 'submitted').length)}
          trend="Awaiting review"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Observations */}
        <DashboardCard
          title="Recent Observations"
          icon={Calendar}
          actionLabel="View All"
          actionLink="/app/observations"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-blue-600 mr-2" />
              <span className="text-gray-600">Loading observations...</span>
            </div>
          ) : recentObservations.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No observations yet</p>
              <p className="text-sm mt-1">Your observation history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentObservations.map(obs => (
                <ObservationHistoryItem
                  key={obs.id}
                  date={obs.context?.date ? new Date(obs.context.date).toLocaleDateString() : 'No date'}
                  observer={obs.observerName || 'Unknown Observer'}
                  score={calculateObservationScore(obs)}
                  framework={obs.frameworkName || 'CRP Framework'}
                />
              ))}
            </div>
          )}
        </DashboardCard>

        {/* SMART Goals Progress */}
        <DashboardCard
          title="My Goals"
          icon={Target}
          actionLabel="Manage Goals"
          actionLink="/app/professional-learning"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-purple-600 mr-2" />
              <span className="text-gray-600">Loading goals...</span>
            </div>
          ) : activeGoals.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No active goals</p>
              <Link
                to="/app/professional-learning"
                className="text-sm text-sas-purple-600 hover:text-sas-purple-700 mt-2 inline-block"
              >
                Create your first goal
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map(goal => (
                <GoalProgressItem
                  key={goal.id}
                  title={goal.title}
                  progress={goal.progress}
                  deadline={goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No deadline'}
                  status={getGoalStatus(goal)}
                />
              ))}
              {activeGoals.length > 3 && (
                <div className="text-center text-sm text-gray-500">
                  +{activeGoals.length - 3} more goals
                </div>
              )}
            </div>
          )}
        </DashboardCard>

        {/* Observation Trend */}
        <DashboardCard
          title="Observation Trend"
          icon={TrendingUp}
          actionLabel="View Timeline"
          actionLink="/app/observations"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-green-600 mr-2" />
              <span className="text-gray-600">Loading trend...</span>
            </div>
          ) : completedObservations.length < 2 ? (
            <div className="text-center py-6 text-gray-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Not enough data for trends</p>
              <p className="text-sm mt-1">Complete more observations to see trends</p>
            </div>
          ) : (
            <div>
              <div className="space-y-3">
                {completedObservations.slice(0, 3).map(obs => (
                  <div key={obs.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {obs.context?.date ? new Date(obs.context.date).toLocaleDateString() : 'No date'}
                      </div>
                      <div className="text-gray-500">{obs.observerName || 'Unknown'}</div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {calculateObservationScore(obs).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
              {calculateTrend(completedObservations) !== 0 && (
                <div className={`mt-4 p-3 rounded-lg ${
                  calculateTrend(completedObservations) > 0
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className={`flex items-center gap-2 text-sm ${
                    calculateTrend(completedObservations) > 0 ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">
                      {calculateTrend(completedObservations) > 0 ? 'Trending Up!' : 'Room for Growth'}
                    </span>
                    <span>
                      {calculateTrend(completedObservations) > 0 ? '+' : ''}
                      {calculateTrend(completedObservations).toFixed(1)} over recent observations
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DashboardCard>

        {/* Recommended Professional Development */}
        <DashboardCard
          title="Professional Learning"
          icon={BookOpen}
          actionLabel="Browse All"
          actionLink="/app/professional-learning"
        >
          <div className="text-center py-6 text-gray-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Training suggestions coming soon</p>
            <p className="text-sm mt-1">Recommendations will be based on your observations and goals</p>
            <Link
              to="/app/professional-learning"
              className="mt-4 inline-block px-4 py-2 bg-sas-purple-100 text-sas-purple-700 rounded-lg text-sm font-medium hover:bg-sas-purple-200"
            >
              View Professional Learning
            </Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

// Helper function to calculate observation score
function calculateObservationScore(obs: { responses?: Array<{ rating?: string }> }): number {
  const responses = obs.responses || [];
  if (responses.length === 0) return 0;
  const validResponses = responses.filter(r => r.rating && !isNaN(Number(r.rating)));
  if (validResponses.length === 0) return 0;
  return validResponses.reduce((sum, r) => sum + Number(r.rating), 0) / validResponses.length;
}

// Helper function to calculate trend
function calculateTrend(observations: Array<{ responses?: Array<{ rating?: string }> }>): number {
  if (observations.length < 2) return 0;
  const recent = observations.slice(0, Math.min(3, observations.length));
  const older = observations.slice(Math.min(3, observations.length));
  if (older.length === 0) return 0;

  const recentAvg = recent.reduce((sum, obs) => sum + calculateObservationScore(obs), 0) / recent.length;
  const olderAvg = older.reduce((sum, obs) => sum + calculateObservationScore(obs), 0) / older.length;

  return recentAvg - olderAvg;
}

// Helper function to determine goal status
function getGoalStatus(goal: { progress: number; targetDate?: Date | string }): 'on-track' | 'needs-attention' | 'completed' {
  if (goal.progress >= 100) return 'completed';
  if (!goal.targetDate) return 'on-track';

  const today = new Date();
  const target = goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate);
  const daysRemaining = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const expectedProgress = Math.max(0, 100 - (daysRemaining / 30 * 10)); // Rough expected progress

  if (goal.progress < expectedProgress - 20) return 'needs-attention';
  return 'on-track';
}

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-xs text-gray-500 mt-1">{trend}</div>
    </div>
  );
}

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  icon: React.ElementType;
  actionLabel: string;
  actionLink: string;
  children: React.ReactNode;
}

function DashboardCard({ title, icon: Icon, actionLabel, actionLink, children }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-sas-navy-600" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <Link
          to={actionLink}
          className="text-sm font-medium text-sas-navy-600 hover:text-sas-navy-700"
        >
          {actionLabel} →
        </Link>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Observation History Item
interface ObservationHistoryItemProps {
  date: string;
  observer: string;
  score: number;
  framework: string;
}

function ObservationHistoryItem({ date, observer, score, framework }: ObservationHistoryItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{date}</div>
        <div className="text-xs text-gray-600">{observer} • {framework}</div>
      </div>
      <div className="flex items-center gap-2">
        <Award className={`w-4 h-4 ${score >= 4 ? 'text-green-500' : score >= 3 ? 'text-yellow-500' : 'text-gray-400'}`} />
        <span className="text-lg font-bold text-gray-900">{score > 0 ? score.toFixed(1) : '--'}</span>
      </div>
    </div>
  );
}

// Goal Progress Item
interface GoalProgressItemProps {
  title: string;
  progress: number;
  deadline: string;
  status: 'on-track' | 'needs-attention' | 'completed';
}

function GoalProgressItem({ title, progress, deadline, status }: GoalProgressItemProps) {
  const statusColors = {
    'on-track': 'bg-green-100 text-green-700',
    'needs-attention': 'bg-yellow-100 text-yellow-700',
    'completed': 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 leading-tight">{title}</div>
          <div className="text-xs text-gray-500 mt-1">Due: {deadline}</div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColors[status]}`}>
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            status === 'on-track' ? 'bg-green-500' :
            status === 'needs-attention' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
