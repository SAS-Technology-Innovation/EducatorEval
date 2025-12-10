import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Target,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useObservations } from '../../hooks/useObservations';
import { useGoals } from '../../hooks/useGoals';
import { useUsersByDivision } from '../../hooks/useFirestore';

/**
 * Manager Dashboard
 *
 * Dashboard for department heads and managers.
 * Displays:
 * - Team overview and statistics
 * - Observation status for team members
 * - Team goal progress
 * - Upcoming observations to conduct
 */
export default function ManagerDashboard() {
  const user = useAuthStore(state => state.user);

  // Fetch team members in the same division as the manager
  const { data: teamMembers = [], isLoading: isLoadingTeam } = useUsersByDivision(user?.divisionId);

  // Fetch observations - as manager, we'd filter by department/division
  // For now, showing observations where user is the observer
  const { data: observations = [], isLoading: isLoadingObservations } = useObservations({
    observerId: user?.id,
    limit: 10,
  });

  // Fetch team goals where user is supervisor
  const { data: teamGoals = [], isLoading: isLoadingGoals } = useGoals({
    supervisorId: user?.id,
  });

  if (!user) return null;

  // Calculate observation stats
  const completedObservations = observations.filter(o => o.status === 'completed').length;
  const draftObservations = observations.filter(o => o.status === 'draft').length;
  const submittedObservations = observations.filter(o => o.status === 'submitted').length;

  // Calculate goal stats
  const pendingApprovalGoals = teamGoals.filter(g => g.status === 'pending_approval').length;
  const activeGoals = teamGoals.filter(g => g.status === 'active').length;

  // Filter team members (exclude current user and count educators)
  const educators = teamMembers.filter(m =>
    m.id !== user.id &&
    (m.primaryRole === 'educator' || m.secondaryRoles?.includes('educator'))
  );
  const teamMemberCount = educators.length;

  const isLoading = isLoadingObservations || isLoadingGoals || isLoadingTeam;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-sas-navy-700 to-sas-navy-500 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bebas mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-blue-100">
          Your team management dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Team Members"
          value={isLoading ? '...' : String(teamMemberCount)}
          subtext={user.divisionId ? 'In your division' : 'No division assigned'}
          color="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Observations Done"
          value={isLoading ? '...' : String(completedObservations)}
          subtext="This semester"
          color="green"
        />
        <StatCard
          icon={Target}
          label="Team Goals"
          value={isLoading ? '...' : String(activeGoals)}
          subtext={`${pendingApprovalGoals} pending approval`}
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={isLoading ? '...' : String(draftObservations)}
          subtext="Draft observations"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Action Required</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-navy-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovalGoals > 0 && (
                <ActionItem
                  title="Goals Pending Approval"
                  count={pendingApprovalGoals}
                  description="Team members awaiting goal approval"
                  link="/app/professional-learning"
                  color="yellow"
                />
              )}
              {draftObservations > 0 && (
                <ActionItem
                  title="Draft Observations"
                  count={draftObservations}
                  description="Observations to complete"
                  link="/app/observations"
                  color="blue"
                />
              )}
              {submittedObservations > 0 && (
                <ActionItem
                  title="Submitted Observations"
                  count={submittedObservations}
                  description="Ready for review"
                  link="/app/observations"
                  color="green"
                />
              )}
              {pendingApprovalGoals === 0 && draftObservations === 0 && submittedObservations === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>All caught up! No pending actions.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team Observations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sas-navy-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Observations</h2>
            </div>
            <Link
              to="/app/observations"
              className="text-sm text-sas-navy-600 hover:text-sas-navy-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-navy-600" />
            </div>
          ) : observations.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No observations yet</p>
              <Link
                to="/app/observations"
                className="text-sm text-sas-navy-600 hover:text-sas-navy-700 mt-2 inline-block"
              >
                Start an observation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {observations.slice(0, 5).map(obs => (
                <ObservationRow
                  key={obs.id}
                  teacherName={obs.subjectName || 'Unknown Teacher'}
                  date={obs.context?.date ? new Date(obs.context.date).toLocaleDateString() : obs.createdAt ? new Date(obs.createdAt).toLocaleDateString() : 'No date'}
                  status={obs.status}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickAction
            icon={Users}
            title="New Observation"
            link="/app/observations"
          />
          <QuickAction
            icon={Target}
            title="Review Goals"
            link="/app/professional-learning"
          />
          <QuickAction
            icon={BarChart3}
            title="View Reports"
            link="/app/observations"
          />
          <QuickAction
            icon={Calendar}
            title="Schedule"
            link="/app/schedule"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-sas-navy-100 text-sas-navy-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// Action Item Component
function ActionItem({
  title,
  count,
  description,
  link,
  color
}: {
  title: string;
  count: number;
  description: string;
  link: string;
  color: 'yellow' | 'blue' | 'green';
}) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <Link
      to={link}
      className={`block p-4 rounded-lg border ${colorClasses[color]} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{title}</span>
            <span className="px-2 py-0.5 bg-white/50 rounded-full text-sm font-bold">{count}</span>
          </div>
          <p className="text-sm mt-0.5 opacity-80">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5" />
      </div>
    </Link>
  );
}

// Observation Row Component
function ObservationRow({
  teacherName,
  date,
  status
}: {
  teacherName: string;
  date: string;
  status: string;
}) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
    reviewed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Reviewed' },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium text-gray-900">{teacherName}</div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
}

// Quick Action Component
function QuickAction({
  icon: Icon,
  title,
  link
}: {
  icon: React.ElementType;
  title: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-sas-navy-300 hover:bg-sas-navy-50 transition-all group"
    >
      <div className="w-12 h-12 rounded-lg bg-sas-navy-100 flex items-center justify-center group-hover:bg-sas-navy-200 transition-colors">
        <Icon className="w-6 h-6 text-sas-navy-600" />
      </div>
      <span className="text-sm font-medium text-gray-900 mt-2 group-hover:text-sas-navy-600">{title}</span>
    </Link>
  );
}
