import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Target, BookOpen, Clock, Award } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';

/**
 * Teacher-focused dashboard
 *
 * Displays:
 * - Upcoming observations this month
 * - Recent observation scores with trend
 * - Active SMART goals progress
 * - Recommended professional development
 */
export default function TeacherDashboard() {
  const user = useAuthStore(state => state.user);

  if (!user) return null;

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
          label="Observations This Year"
          value="8"
          trend="+2 from last year"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value="4.2"
          trend="+0.3 this quarter"
          color="green"
        />
        <StatCard
          icon={Target}
          label="Active Goals"
          value="3"
          trend="2 in progress"
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="PD Hours"
          value="24"
          trend="6 hours remaining"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Observations */}
        <DashboardCard
          title="Upcoming Observations"
          icon={Calendar}
          actionLabel="View All"
          actionLink="/app/observations"
        >
          <div className="space-y-3">
            <ObservationItem
              date="Nov 18, 2025"
              observer="Dr. Sarah Johnson"
              type="Formal Observation"
              status="scheduled"
            />
            <ObservationItem
              date="Dec 3, 2025"
              observer="Mr. Robert Chen"
              type="Walkthrough"
              status="scheduled"
            />
            <div className="pt-2 text-center text-sm text-gray-500">
              No more observations scheduled this month
            </div>
          </div>
        </DashboardCard>

        {/* Recent Observations & Trends */}
        <DashboardCard
          title="Observation History"
          icon={TrendingUp}
          actionLabel="View Timeline"
          actionLink="/app/observations"
        >
          <div className="space-y-3">
            <ObservationHistoryItem
              date="Oct 15, 2025"
              observer="Dr. Sarah Johnson"
              score={4.5}
              framework="CRP Framework"
            />
            <ObservationHistoryItem
              date="Sep 22, 2025"
              observer="Ms. Jennifer Lee"
              score={4.0}
              framework="CRP Framework"
            />
            <ObservationHistoryItem
              date="Aug 10, 2025"
              observer="Dr. Sarah Johnson"
              score={3.8}
              framework="CRP Framework"
            />
          </div>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">Trending Up!</span>
              <span>+0.7 improvement over 3 months</span>
            </div>
          </div>
        </DashboardCard>

        {/* SMART Goals Progress */}
        <DashboardCard
          title="My Goals"
          icon={Target}
          actionLabel="Manage Goals"
          actionLink="/app/professional-learning"
        >
          <div className="space-y-4">
            <GoalProgressItem
              title="Improve student engagement through culturally responsive teaching"
              progress={65}
              deadline="Dec 31, 2025"
              status="on-track"
            />
            <GoalProgressItem
              title="Integrate technology to support diverse learners"
              progress={40}
              deadline="Feb 28, 2026"
              status="on-track"
            />
            <GoalProgressItem
              title="Develop assessment strategies for multilingual students"
              progress={25}
              deadline="May 15, 2026"
              status="needs-attention"
            />
          </div>
        </DashboardCard>

        {/* Recommended Professional Development */}
        <DashboardCard
          title="Recommended Professional Learning"
          icon={BookOpen}
          actionLabel="Browse All"
          actionLink="/app/professional-learning"
        >
          <div className="space-y-3">
            <PDRecommendation
              title="Culturally Responsive Classroom Management"
              reason="Based on recent observation feedback"
              duration="2 hours"
              type="Workshop"
            />
            <PDRecommendation
              title="Differentiation Strategies for Diverse Learners"
              reason="Aligns with your active goals"
              duration="4 hours"
              type="Course"
            />
            <PDRecommendation
              title="Assessment in CRP Classrooms"
              reason="Trending topic in your department"
              duration="1 hour"
              type="Webinar"
            />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
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

// Observation Item Component
interface ObservationItemProps {
  date: string;
  observer: string;
  type: string;
  status: 'scheduled' | 'completed';
}

function ObservationItem({ date, observer, type, status }: ObservationItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-sas-blue-300 hover:bg-blue-50 transition-colors">
      <div className="flex-shrink-0 w-16 text-center">
        <div className="text-sm font-semibold text-gray-900">{date.split(' ')[1]}</div>
        <div className="text-xs text-gray-500">{date.split(' ')[0]}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{type}</div>
        <div className="text-xs text-gray-600">with {observer}</div>
      </div>
      <div className="flex-shrink-0">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          {status}
        </span>
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
        <Award className={`w-4 h-4 ${score >= 4 ? 'text-green-500' : 'text-yellow-500'}`} />
        <span className="text-lg font-bold text-gray-900">{score.toFixed(1)}</span>
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
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// PD Recommendation
interface PDRecommendationProps {
  title: string;
  reason: string;
  duration: string;
  type: string;
}

function PDRecommendation({ title, reason, duration, type }: PDRecommendationProps) {
  return (
    <div className="p-3 rounded-lg border border-gray-200 hover:border-sas-purple-300 hover:bg-purple-50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700 whitespace-nowrap">
          {type}
        </span>
      </div>
      <div className="text-xs text-gray-600 mb-2">{reason}</div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{duration}</span>
      </div>
    </div>
  );
}
