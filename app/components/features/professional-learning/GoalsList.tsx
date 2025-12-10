import React, { useState } from 'react';
import {
  Target,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Calendar,
  TrendingUp,
  Loader2,
  Users,
  BookOpen,
  Star,
  Heart,
  Briefcase
} from 'lucide-react';
import { useMyGoals, useActiveGoalTemplates } from '../../../hooks/useGoals';
import type { UserGoal, GoalType } from '../../../types';
import CreateGoalModal from './CreateGoalModal';
import GoalDetailModal from './GoalDetailModal';

// Icon mapping for goal types
const GoalTypeIcons: Record<GoalType, React.ElementType> = {
  professional: Briefcase,
  instructional: BookOpen,
  student_outcome: Users,
  leadership: Star,
  personal: Heart
};

// Color mapping for goal types
const GoalTypeColors: Record<GoalType, { bg: string; text: string; border: string }> = {
  professional: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  instructional: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  student_outcome: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  leadership: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  personal: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' }
};

// Status colors
const StatusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock },
  pending_approval: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  active: { bg: 'bg-green-100', text: 'text-green-700', icon: TrendingUp },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2 },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  on_hold: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Pause }
};

export default function GoalsList() {
  const { data: goals = [], isLoading, error } = useMyGoals();
  const { data: templates = [] } = useActiveGoalTemplates();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<GoalType | null>(null);

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    if (filterStatus && goal.status !== filterStatus) return false;
    if (filterType && goal.type !== filterType) return false;
    return true;
  });

  // Calculate stats
  const stats = {
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    pending: goals.filter(g => g.status === 'pending_approval').length,
    avgProgress: goals.length > 0
      ? Math.round(goals.filter(g => g.status === 'active').reduce((sum, g) => sum + g.progress, 0) /
        Math.max(1, goals.filter(g => g.status === 'active').length))
      : 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600 mr-3" />
        <p className="text-gray-600">Loading your goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Goals</h3>
            <p className="text-red-700 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Active Goals"
          value={stats.active}
          color="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Progress"
          value={`${stats.avgProgress}%`}
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="Pending Approval"
          value={stats.pending}
          color="yellow"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>

          <select
            value={filterType || ''}
            onChange={(e) => setFilterType(e.target.value as GoalType || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="professional">Professional</option>
            <option value="instructional">Instructional</option>
            <option value="student_outcome">Student Outcome</option>
            <option value="leadership">Leadership</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Goal
        </button>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <EmptyGoalsState
          hasGoals={goals.length > 0}
          hasTemplates={templates.length > 0}
          onCreateGoal={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onClick={() => setSelectedGoal(goal)}
            />
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      {isCreateModalOpen && (
        <CreateGoalModal
          templates={templates}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <GoalDetailModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-sas-navy-100 text-sas-navy-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Goal Card Component
function GoalCard({
  goal,
  onClick
}: {
  goal: UserGoal;
  onClick: () => void;
}) {
  const TypeIcon = GoalTypeIcons[goal.type];
  const typeColors = GoalTypeColors[goal.type];
  const statusConfig = StatusColors[goal.status];

  // Calculate days remaining
  const today = new Date();
  const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
  const daysRemaining = targetDate
    ? Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:border-sas-navy-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Type Icon */}
          <div className={`p-3 rounded-xl ${typeColors.bg}`}>
            <TypeIcon className={`w-6 h-6 ${typeColors.text}`} />
          </div>

          {/* Goal Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{goal.title}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                {goal.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p>

            {/* Meta info */}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors.bg} ${typeColors.text} ${typeColors.border}`}>
                {goal.type.replace('_', ' ')}
              </span>
              {goal.templateName && (
                <span className="text-gray-400">• Template: {goal.templateName}</span>
              )}
              {targetDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {daysRemaining !== null && daysRemaining > 0
                    ? `${daysRemaining} days left`
                    : daysRemaining === 0
                      ? 'Due today'
                      : 'Overdue'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="ml-4 flex flex-col items-end">
          <div className="text-right mb-2">
            <span className="text-2xl font-bold text-gray-900">{goal.progress}%</span>
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                goal.progress >= 100 ? 'bg-green-500' :
                goal.progress >= 75 ? 'bg-blue-500' :
                goal.progress >= 50 ? 'bg-yellow-500' :
                'bg-gray-400'
              }`}
              style={{ width: `${Math.min(100, goal.progress)}%` }}
            />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyGoalsState({
  hasGoals,
  hasTemplates,
  onCreateGoal
}: {
  hasGoals: boolean;
  hasTemplates: boolean;
  onCreateGoal: () => void;
}) {
  if (hasGoals) {
    // Filtered to empty
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching goals</h3>
        <p className="text-gray-600">Try adjusting your filters to see more goals.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasTemplates
          ? 'Create your first SMART goal to track your professional development progress.'
          : 'No goal templates available. Please contact your administrator to set up goal templates.'}
      </p>
      {hasTemplates && (
        <button
          onClick={onCreateGoal}
          className="bg-sas-navy-600 text-white px-6 py-2 rounded-lg hover:bg-sas-navy-700 text-sm font-medium inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Your First Goal
        </button>
      )}

      {/* Goal Types Info */}
      <div className="mt-8 text-left max-w-2xl mx-auto">
        <h4 className="font-semibold text-gray-900 mb-3 text-center">Goal Types:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { type: 'professional', label: 'Professional Development', desc: 'Skills and knowledge enhancement' },
            { type: 'instructional', label: 'Instructional Practice', desc: 'Teaching methods and strategies' },
            { type: 'student_outcome', label: 'Student Outcomes', desc: 'Impact on student learning' },
            { type: 'leadership', label: 'Leadership', desc: 'Leadership and collaboration' }
          ].map(({ type, label, desc }) => {
            const Icon = GoalTypeIcons[type as GoalType];
            const colors = GoalTypeColors[type as GoalType];
            return (
              <div key={type} className="border border-gray-200 rounded-lg p-3 flex items-start gap-3 bg-white">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
