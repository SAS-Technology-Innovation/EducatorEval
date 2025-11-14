import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, CheckCircle, Clock, AlertCircle, Users, BarChart3, FileText, Plus } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import ObservationForm from '../features/observations/ObservationForm';

/**
 * Observer-focused dashboard
 *
 * Displays:
 * - Upcoming observations today/this week
 * - Observations pending completion (drafts)
 * - Follow-ups needed (30-day check-ins)
 * - Observer statistics (completed, average scores)
 */
export default function ObserverDashboard() {
  const user = useAuthStore(state => state.user);
  const [showObservationForm, setShowObservationForm] = useState(false);

  const handleSaveDraft = (data: any) => {
    console.log('Saving draft:', data);
    alert('Draft saved! (Firebase integration pending)');
    setShowObservationForm(false);
  };

  const handleSubmitObservation = (data: any) => {
    console.log('Submitting observation:', data);
    alert('Observation submitted! (Firebase integration pending)');
    setShowObservationForm(false);
  };

  const handleCancelObservation = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      setShowObservationForm(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
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
          label="This Week"
          value="5"
          trend="2 today"
          color="purple"
          urgent={true}
        />
        <StatCard
          icon={FileText}
          label="Pending Completion"
          value="3"
          trend="Drafts to finalize"
          color="yellow"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed This Month"
          value="12"
          trend="+4 from last month"
          color="green"
        />
        <StatCard
          icon={Users}
          label="Teachers Observed"
          value="18"
          trend="8 need follow-up"
          color="blue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Observations */}
        <DashboardCard
          title="Today's Observations"
          icon={Calendar}
          actionLabel="View Calendar"
          actionLink="/app/schedule"
          badge="2 scheduled"
        >
          <div className="space-y-3">
            <ObservationQueueItem
              time="10:00 AM"
              teacher="Ms. Jennifer Martinez"
              subject="English 10"
              room="B-204"
              type="Formal"
              status="upcoming"
            />
            <ObservationQueueItem
              time="2:30 PM"
              teacher="Mr. David Kim"
              subject="AP Physics"
              room="C-301"
              type="Walkthrough"
              status="upcoming"
            />
          </div>
        </DashboardCard>

        {/* This Week's Schedule */}
        <DashboardCard
          title="This Week"
          icon={Calendar}
          actionLabel="Full Schedule"
          actionLink="/app/schedule"
          badge="5 total"
        >
          <div className="space-y-3">
            <WeekObservationItem
              day="Wed"
              date="Nov 13"
              count={1}
              teachers={['Sarah Johnson']}
            />
            <WeekObservationItem
              day="Thu"
              date="Nov 14"
              count={2}
              teachers={['Robert Chen', 'Emily Davis']}
            />
            <div className="pt-2 text-center text-sm text-gray-500">
              No observations Friday
            </div>
          </div>
        </DashboardCard>

        {/* Pending Completion */}
        <DashboardCard
          title="Pending Completion"
          icon={FileText}
          actionLabel="View All Drafts"
          actionLink="/app/observations"
          badge="3 drafts"
        >
          <div className="space-y-3">
            <PendingObservationItem
              teacher="Ms. Jennifer Martinez"
              date="Nov 8, 2025"
              type="Formal Observation"
              daysOverdue={4}
            />
            <PendingObservationItem
              teacher="Dr. Michael Thompson"
              date="Nov 5, 2025"
              type="Walkthrough"
              daysOverdue={7}
            />
            <PendingObservationItem
              teacher="Ms. Lisa Wang"
              date="Nov 10, 2025"
              type="Formal Observation"
              daysOverdue={2}
            />
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold">Action needed:</span>
              <span>Complete observations within 48 hours</span>
            </div>
          </div>
        </DashboardCard>

        {/* Follow-Ups Needed */}
        <DashboardCard
          title="Follow-Ups Needed"
          icon={Clock}
          actionLabel="View All"
          actionLink="/app/observations"
          badge="8 pending"
        >
          <div className="space-y-3">
            <FollowUpItem
              teacher="Mr. Robert Chen"
              originalDate="Oct 12, 2025"
              followUpType="30-day check-in"
              daysUntilDue={3}
              status="upcoming"
            />
            <FollowUpItem
              teacher="Ms. Sarah Johnson"
              originalDate="Oct 8, 2025"
              followUpType="30-day check-in"
              daysUntilDue={-2}
              status="overdue"
            />
            <FollowUpItem
              teacher="Dr. Emily Davis"
              originalDate="Sep 15, 2025"
              followUpType="60-day check-in"
              daysUntilDue={7}
              status="upcoming"
            />
          </div>
        </DashboardCard>

        {/* My Statistics */}
        <DashboardCard
          title="My Observer Statistics"
          icon={BarChart3}
          actionLabel="Detailed Report"
          actionLink="/app/observations"
        >
          <div className="space-y-4">
            <StatRow label="Total Observations (This Year)" value="42" />
            <StatRow label="Average Observation Score" value="4.1" />
            <StatRow label="Observations Per Month (Avg)" value="3.5" />
            <StatRow label="Follow-Up Completion Rate" value="92%" />

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Observation Types</div>
              <div className="space-y-2">
                <TypeDistribution label="Formal Observations" count={28} total={42} color="purple" />
                <TypeDistribution label="Walkthroughs" count={10} total={42} color="blue" />
                <TypeDistribution label="Peer Observations" count={4} total={42} color="green" />
              </div>
            </div>
          </div>
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
              link="/app/observations/create"
              color="purple"
            />
            <QuickActionButton
              icon={Calendar}
              label="My Calendar"
              link="/app/schedule"
              color="blue"
            />
            <QuickActionButton
              icon={FileText}
              label="Templates"
              link="/app/observations/templates"
              color="green"
            />
            <QuickActionButton
              icon={Users}
              label="My Teachers"
              link="/app/observations/my-teachers"
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
    <div className={`bg-white rounded-lg shadow p-4 ${urgent ? 'ring-2 ring-purple-300' : ''}`}>
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
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
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

// Observation Queue Item
interface ObservationQueueItemProps {
  time: string;
  teacher: string;
  subject: string;
  room: string;
  type: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

function ObservationQueueItem({ time, teacher, subject, room, type, status }: ObservationQueueItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-purple-200 bg-purple-50 hover:border-purple-300 transition-colors">
      <div className="flex-shrink-0 w-20 text-center">
        <div className="text-sm font-bold text-purple-900">{time}</div>
        <div className="text-xs text-purple-600">{room}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{teacher}</div>
        <div className="text-xs text-gray-600">{subject}</div>
      </div>
      <div className="flex-shrink-0">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-600 text-white">
          {type}
        </span>
      </div>
    </div>
  );
}

// Week Observation Item
interface WeekObservationItemProps {
  day: string;
  date: string;
  count: number;
  teachers: string[];
}

function WeekObservationItem({ day, date, count, teachers }: WeekObservationItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-12 text-center">
        <div className="text-xs font-semibold text-gray-500 uppercase">{day}</div>
        <div className="text-sm font-bold text-gray-900">{date.split(' ')[1]}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{count} observation{count !== 1 ? 's' : ''}</div>
        <div className="text-xs text-gray-600 truncate">{teachers.join(', ')}</div>
      </div>
    </div>
  );
}

// Pending Observation Item
interface PendingObservationItemProps {
  teacher: string;
  date: string;
  type: string;
  daysOverdue: number;
}

function PendingObservationItem({ teacher, date, type, daysOverdue }: PendingObservationItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-300 bg-yellow-50">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{teacher}</div>
        <div className="text-xs text-gray-600">{type} • {date}</div>
      </div>
      <div className="flex-shrink-0">
        <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-200 text-yellow-800">
          {daysOverdue}d overdue
        </span>
      </div>
    </div>
  );
}

// Follow-Up Item
interface FollowUpItemProps {
  teacher: string;
  originalDate: string;
  followUpType: string;
  daysUntilDue: number;
  status: 'upcoming' | 'overdue';
}

function FollowUpItem({ teacher, originalDate, followUpType, daysUntilDue, status }: FollowUpItemProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${
      status === 'overdue' ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
      <Clock className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
        status === 'overdue' ? 'text-red-600' : 'text-gray-400'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{teacher}</div>
        <div className="text-xs text-gray-600">{followUpType} • Original: {originalDate}</div>
      </div>
      <div className="flex-shrink-0">
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          status === 'overdue'
            ? 'bg-red-200 text-red-800'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {status === 'overdue' ? `${Math.abs(daysUntilDue)}d overdue` : `in ${daysUntilDue}d`}
        </span>
      </div>
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
  const percentage = (count / total) * 100;
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
  link: string;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

function QuickActionButton({ icon: Icon, label, link, color }: QuickActionButtonProps) {
  const colorClasses = {
    purple: 'bg-purple-600 hover:bg-purple-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  };

  return (
    <Link
      to={link}
      className={`flex flex-col items-center justify-center p-4 rounded-lg text-white transition-colors ${colorClasses[color]}`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-sm font-medium text-center">{label}</span>
    </Link>
  );
}
