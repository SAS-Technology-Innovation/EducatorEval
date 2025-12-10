import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, CheckCircle, AlertCircle, Users, BarChart3, FileText, Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useObservations, useCreateObservation } from '../../hooks/useObservations';
import ObservationForm from '../features/observations/ObservationForm';
import type { Observation, ObservationResponse } from '../../types';

// Observation form data type (matches ObservationForm component)
interface ObservationFormData {
  teacher: string;
  teacherId: string;
  subject: string;
  className: string;
  room: string;
  period: string;
  grade: string;
  duration: number;
  startTime: string;
  responses: Record<string, string>;
  comments: Record<string, string>;
  overallComment: string;
}

/**
 * Observer-focused dashboard
 *
 * Displays:
 * - Observations conducted by this observer
 * - Draft observations to complete
 * - Completed observations summary
 * - Observer statistics
 */
export default function ObserverDashboard() {
  const user = useAuthStore(state => state.user);
  const [showObservationForm, setShowObservationForm] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Fetch observations where user is the observer
  const { data: observations = [], isLoading } = useObservations({
    observerId: user?.id,
    limit: 50,
  });

  // Mutation for creating observations
  const createObservation = useCreateObservation();

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Transform form data to Observation format
  const transformFormDataToObservation = (data: ObservationFormData, status: 'draft' | 'completed'): Partial<Observation> => {
    // Transform responses from Record<string, string> to ObservationResponse[]
    const responses: ObservationResponse[] = Object.entries(data.responses).map(([questionId, rating]) => ({
      questionId,
      questionText: '', // Will be populated by the API if needed
      rating: rating,
      ratingText: rating === '4' ? 'Clearly Observable' :
                 rating === '3' ? 'Possibly Present' :
                 rating === '2' ? 'Unclear/Minimal' :
                 rating === '1' ? 'Not Evident' : 'Not Observed',
      comments: data.comments[questionId] || '',
      evidence: [],
      tags: [],
      frameworkAlignments: [],
      confidence: 'medium' as const,
      timestamp: new Date(),
    }));

    return {
      // Participants
      subjectId: data.teacherId,
      subjectName: data.teacher,
      observerId: user?.id || '',
      observerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),

      // School context
      schoolId: user?.schoolId || '',
      divisionId: user?.divisionId || '',

      // Observation context
      context: {
        type: 'classroom',
        className: data.className,
        subject: data.subject,
        room: data.room,
        period: data.period,
        grade: data.grade,
        date: new Date(data.startTime),
        startTime: new Date(data.startTime),
        duration: data.duration,
      },

      // Framework (using default CRP framework)
      frameworkId: 'crp-10-lookfors',
      frameworkName: 'CRP 10 Look-Fors',
      frameworkVersion: '1.0',

      // Responses and comments
      responses,
      overallComments: data.overallComment,

      // Status
      status,

      // Defaults
      attachments: [],
      followUpRequired: false,
      followUpCompleted: false,
      metadata: {},
    };
  };

  const handleSaveDraft = async (data: ObservationFormData) => {
    try {
      const observationData = transformFormDataToObservation(data, 'draft');
      await createObservation.mutateAsync(observationData);
      showNotification('Draft saved successfully!', 'success');
      setShowObservationForm(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving draft:', error);
      }
      showNotification('Failed to save draft. Please try again.', 'error');
    }
  };

  const handleSubmitObservation = async (data: ObservationFormData) => {
    try {
      const observationData = transformFormDataToObservation(data, 'completed');
      await createObservation.mutateAsync(observationData);
      showNotification('Observation submitted successfully!', 'success');
      setShowObservationForm(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error submitting observation:', error);
      }
      showNotification('Failed to submit observation. Please try again.', 'error');
    }
  };

  const handleCancelObservation = () => {
    // Note: window.confirm is acceptable for destructive action confirmation
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      setShowObservationForm(false);
    }
  };

  if (!user) return null;

  // Calculate stats from real data
  const draftObservations = observations.filter(o => o.status === 'draft');
  const completedObservations = observations.filter(o => o.status === 'completed' || o.status === 'reviewed');

  // Get unique teachers observed
  const uniqueTeachers = new Set(observations.map(o => o.subjectId).filter(Boolean));

  // Calculate average score from completed observations
  const calculateAverageScore = () => {
    if (completedObservations.length === 0) return '--';
    const totalScore = completedObservations.reduce((sum, obs) => {
      const responses = obs.responses || [];
      if (responses.length === 0) return sum;
      // Parse rating as number
      const validResponses = responses.filter(r => r.rating && !isNaN(Number(r.rating)));
      if (validResponses.length === 0) return sum;
      const obsAvg = validResponses.reduce((s, r) => s + Number(r.rating), 0) / validResponses.length;
      return sum + obsAvg;
    }, 0);
    return (totalScore / completedObservations.length).toFixed(1);
  };

  // Get recent observations
  const recentObservations = observations.slice(0, 5);

  // Get observation type distribution (based on context.type if present)
  const formalCount = observations.filter(o => o.context?.type === 'formal').length;
  const walkthroughCount = observations.filter(o => o.context?.type === 'walkthrough').length;
  const peerCount = observations.filter(o => o.context?.type === 'peer').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Welcome Header with Quick Action */}
      <div className="bg-gradient-to-r from-sas-purple-600 to-sas-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bebas mb-2">
              Observer Dashboard
            </h1>
            <p className="text-purple-100">
              Manage your observations and support teacher growth
            </p>
          </div>
          <button
            onClick={() => setShowObservationForm(true)}
            className="bg-white text-sas-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span>Start Observation</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Observations"
          value={isLoading ? '...' : String(observations.length)}
          trend="All time"
          color="purple"
        />
        <StatCard
          icon={FileText}
          label="Drafts"
          value={isLoading ? '...' : String(draftObservations.length)}
          trend={draftObservations.length > 0 ? 'Need completion' : 'All complete'}
          color="yellow"
          urgent={draftObservations.length > 0}
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={isLoading ? '...' : String(completedObservations.length)}
          trend="Finalized"
          color="green"
        />
        <StatCard
          icon={Users}
          label="Teachers Observed"
          value={isLoading ? '...' : String(uniqueTeachers.size)}
          trend="Unique educators"
          color="blue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Draft Observations */}
        <DashboardCard
          title="Draft Observations"
          icon={FileText}
          actionLabel="View All"
          actionLink="/app/observations"
          badge={draftObservations.length > 0 ? `${draftObservations.length} pending` : undefined}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-purple-600 mr-2" />
              <span className="text-gray-600">Loading drafts...</span>
            </div>
          ) : draftObservations.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p>No pending drafts</p>
              <p className="text-sm mt-1">All observations are complete</p>
            </div>
          ) : (
            <div className="space-y-3">
              {draftObservations.slice(0, 3).map(obs => (
                <DraftObservationItem
                  key={obs.id}
                  id={obs.id}
                  teacher={obs.subjectName || 'Unknown Teacher'}
                  date={obs.context?.date ? new Date(obs.context.date).toLocaleDateString() : 'No date'}
                  type={obs.context?.type || 'observation'}
                  createdAt={obs.createdAt ? String(obs.createdAt) : undefined}
                />
              ))}
              {draftObservations.length > 3 && (
                <div className="text-center text-sm text-gray-500">
                  +{draftObservations.length - 3} more drafts
                </div>
              )}
              {draftObservations.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">Reminder:</span>
                    <span>Complete observations within 48 hours</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DashboardCard>

        {/* Recent Observations */}
        <DashboardCard
          title="Recent Observations"
          icon={Calendar}
          actionLabel="View All"
          actionLink="/app/observations"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-purple-600 mr-2" />
              <span className="text-gray-600">Loading observations...</span>
            </div>
          ) : recentObservations.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Eye className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No observations yet</p>
              <button
                onClick={() => setShowObservationForm(true)}
                className="text-sm text-sas-purple-600 hover:text-sas-purple-700 mt-2"
              >
                Start your first observation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentObservations.map(obs => (
                <RecentObservationItem
                  key={obs.id}
                  teacher={obs.subjectName || 'Unknown Teacher'}
                  date={obs.context?.date ? new Date(obs.context.date).toLocaleDateString() : 'No date'}
                  status={obs.status}
                  type={obs.context?.type || 'observation'}
                />
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Observer Statistics */}
        <DashboardCard
          title="My Statistics"
          icon={BarChart3}
          actionLabel="View Reports"
          actionLink="/app/observations"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sas-purple-600 mr-2" />
              <span className="text-gray-600">Loading statistics...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <StatRow label="Total Observations" value={String(observations.length)} />
              <StatRow label="Average Score Given" value={calculateAverageScore()} />
              <StatRow label="Unique Teachers" value={String(uniqueTeachers.size)} />
              <StatRow label="Completion Rate" value={
                observations.length > 0
                  ? `${Math.round((completedObservations.length / observations.length) * 100)}%`
                  : '--'
              } />

              {observations.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Observation Types</div>
                  <div className="space-y-2">
                    <TypeDistribution label="Formal" count={formalCount} total={observations.length} color="purple" />
                    <TypeDistribution label="Walkthrough" count={walkthroughCount} total={observations.length} color="blue" />
                    <TypeDistribution label="Peer" count={peerCount} total={observations.length} color="green" />
                  </div>
                </div>
              )}
            </div>
          )}
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard
          title="Quick Actions"
          icon={Eye}
          actionLabel=""
          actionLink=""
        >
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              icon={Eye}
              label="New Observation"
              onClick={() => setShowObservationForm(true)}
              color="purple"
            />
            <QuickActionButton
              icon={Calendar}
              label="My Schedule"
              link="/app/schedule"
              color="blue"
            />
            <QuickActionButton
              icon={FileText}
              label="All Observations"
              link="/app/observations"
              color="green"
            />
            <QuickActionButton
              icon={Users}
              label="Educators"
              link="/admin/users"
              color="orange"
            />
          </div>
        </DashboardCard>
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
              {/* Form */}
              <ObservationForm
                onSave={handleSaveDraft}
                onSubmit={handleSubmitObservation}
                onCancel={handleCancelObservation}
                isSaving={createObservation.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  urgent?: boolean;
}

function StatCard({ icon: Icon, label, value, trend, color, urgent }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${urgent ? 'ring-2 ring-yellow-300' : ''}`}>
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
  badge?: string;
  children: React.ReactNode;
}

function DashboardCard({ title, icon: Icon, actionLabel, actionLink, badge, children }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-sas-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
              {badge}
            </span>
          )}
        </div>
        {actionLabel && (
          <Link
            to={actionLink}
            className="text-sm font-medium text-sas-purple-600 hover:text-sas-purple-700"
          >
            {actionLabel} →
          </Link>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Draft Observation Item
interface DraftObservationItemProps {
  id: string;
  teacher: string;
  date: string;
  type: string;
  createdAt?: string;
}

function DraftObservationItem({ id, teacher, date, type, createdAt }: DraftObservationItemProps) {
  const daysOld = createdAt
    ? Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Link
      to={`/app/observations/${id}`}
      className="flex items-start gap-3 p-3 rounded-lg border border-yellow-300 bg-yellow-50 hover:border-yellow-400 transition-colors"
    >
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{teacher}</div>
        <div className="text-xs text-gray-600 capitalize">{type} • {date}</div>
      </div>
      {daysOld > 0 && (
        <div className="flex-shrink-0">
          <span className={`px-2 py-1 text-xs font-bold rounded ${
            daysOld > 2 ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
          }`}>
            {daysOld}d old
          </span>
        </div>
      )}
    </Link>
  );
}

// Recent Observation Item
interface RecentObservationItemProps {
  teacher: string;
  date: string;
  status: string;
  type: string;
}

function RecentObservationItem({ teacher, date, status, type }: RecentObservationItemProps) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
    reviewed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Reviewed' },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{teacher}</div>
        <div className="text-xs text-gray-600 capitalize">{type} • {date}</div>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
}

// Stat Row
interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}

// Type Distribution
interface TypeDistributionProps {
  label: string;
  count: number;
  total: number;
  color: 'purple' | 'blue' | 'green';
}

function TypeDistribution({ label, count, total, color }: TypeDistributionProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  };

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Quick Action Button
interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  link?: string;
  onClick?: () => void;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

function QuickActionButton({ icon: Icon, label, link, onClick, color }: QuickActionButtonProps) {
  const colorClasses = {
    purple: 'bg-purple-600 hover:bg-purple-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  };

  const className = `flex flex-col items-center justify-center p-4 rounded-lg text-white transition-colors ${colorClasses[color]}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        <Icon className="w-6 h-6 mb-2" />
        <span className="text-sm font-medium text-center">{label}</span>
      </button>
    );
  }

  return (
    <Link to={link || '#'} className={className}>
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-sm font-medium text-center">{label}</span>
    </Link>
  );
}
