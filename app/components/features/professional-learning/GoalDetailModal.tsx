import React, { useState } from 'react';
import {
  X,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  Pause,
  TrendingUp,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BarChart3,
  Flag,
  Users,
  BookOpen,
  Star,
  Heart,
  Briefcase,
  Loader2,
  Save,
  XCircle,
  Send
} from 'lucide-react';
import {
  useGoal,
  useGoalMilestones,
  useGoalMeasurements,
  useGoalReflections,
  useGoalActivity,
  useUpdateGoalProgress,
  useSubmitGoal,
  useCompleteGoal,
  useDeleteGoal,
  useCompleteMilestone,
  useCreateMilestone,
  useCreateReflection
} from '../../../hooks/useGoals';
import type {
  UserGoal,
  GoalType,
  UserGoalMilestone,
  UserGoalMeasurement,
  UserGoalReflection,
  GoalActivity
} from '../../../types';

interface GoalDetailModalProps {
  goal: UserGoal;
  onClose: () => void;
}

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

// Status configurations
const StatusConfig: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: 'Draft' },
  pending_approval: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending Approval' },
  active: { bg: 'bg-green-100', text: 'text-green-700', icon: TrendingUp, label: 'Active' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2, label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Cancelled' },
  on_hold: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Pause, label: 'On Hold' }
};

// Priority configurations
const PriorityConfig: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Medium' },
  high: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'High' },
  critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' }
};

type Tab = 'overview' | 'milestones' | 'measurements' | 'reflections' | 'activity';

export default function GoalDetailModal({ goal: initialGoal, onClose }: GoalDetailModalProps) {
  // Fetch fresh goal data - use initialGoal as fallback
  const { data: fetchedGoal, isLoading: isLoadingGoal } = useGoal(initialGoal.id);
  const goal = fetchedGoal ?? initialGoal;
  const { data: milestones = [], isLoading: isLoadingMilestones } = useGoalMilestones(initialGoal.id);
  const { data: measurements = [], isLoading: isLoadingMeasurements } = useGoalMeasurements(initialGoal.id);
  const { data: reflections = [], isLoading: isLoadingReflections } = useGoalReflections(initialGoal.id);
  const { data: activity = [], isLoading: isLoadingActivity } = useGoalActivity(initialGoal.id);

  // Mutations
  const updateProgressMutation = useUpdateGoalProgress();
  const submitGoalMutation = useSubmitGoal();
  const completeGoalMutation = useCompleteGoal();
  const deleteGoalMutation = useDeleteGoal();
  const completeMilestoneMutation = useCompleteMilestone();
  const createMilestoneMutation = useCreateMilestone();
  const createReflectionMutation = useCreateReflection();

  // UI State
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(goal.progress);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [isAddingReflection, setIsAddingReflection] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', targetDate: '' });
  const [newReflection, setNewReflection] = useState({ prompt: '', response: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const TypeIcon = GoalTypeIcons[goal.type];
  const typeColors = GoalTypeColors[goal.type];
  const statusConfig = StatusConfig[goal.status];
  const priorityConfig = PriorityConfig[goal.priority];

  // Calculate days remaining
  const today = new Date();
  const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
  const daysRemaining = targetDate
    ? Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate milestone stats
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;

  const handleProgressSave = async () => {
    try {
      await updateProgressMutation.mutateAsync({
        goalId: goal.id,
        progress: progressValue
      });
      setIsEditingProgress(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to update progress:', error);
      }
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      await submitGoalMutation.mutateAsync(goal.id);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to submit goal:', error);
      }
    }
  };

  const handleCompleteGoal = async () => {
    try {
      await completeGoalMutation.mutateAsync(goal.id);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to complete goal:', error);
      }
    }
  };

  const handleDeleteGoal = async () => {
    try {
      await deleteGoalMutation.mutateAsync(goal.id);
      onClose();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await completeMilestoneMutation.mutateAsync({
        goalId: goal.id,
        milestoneId
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to complete milestone:', error);
      }
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title || !newMilestone.targetDate) return;

    try {
      await createMilestoneMutation.mutateAsync({
        goalId: goal.id,
        data: {
          title: newMilestone.title,
          description: newMilestone.description,
          targetDate: new Date(newMilestone.targetDate),
          status: 'pending',
          evidence: [],
          notes: '',
          order: milestones.length
        }
      });
      setNewMilestone({ title: '', description: '', targetDate: '' });
      setIsAddingMilestone(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to create milestone:', error);
      }
    }
  };

  const handleAddReflection = async () => {
    if (!newReflection.response) return;

    try {
      await createReflectionMutation.mutateAsync({
        goalId: goal.id,
        data: {
          prompt: newReflection.prompt || 'Free reflection',
          response: newReflection.response,
          date: new Date()
        }
      });
      setNewReflection({ prompt: '', response: '' });
      setIsAddingReflection(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to create reflection:', error);
      }
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  const isLoading = isLoadingGoal || isLoadingMilestones || isLoadingMeasurements || isLoadingReflections || isLoadingActivity;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-3 rounded-xl ${typeColors.bg}`}>
              <TypeIcon className={`w-6 h-6 ${typeColors.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-gray-900 truncate">{goal.title}</h2>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                  {priorityConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-600">{goal.templateName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-4">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'milestones', label: `Milestones (${totalMilestones})`, icon: Flag },
            { id: 'measurements', label: `Measurements (${measurements.length})`, icon: BarChart3 },
            { id: 'reflections', label: `Reflections (${reflections.length})`, icon: MessageSquare },
            { id: 'activity', label: 'Activity', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-sas-navy-600 text-sas-navy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600" />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Progress Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Progress</h3>
                      {goal.status === 'active' && !isEditingProgress && (
                        <button
                          onClick={() => setIsEditingProgress(true)}
                          className="text-sm text-sas-navy-600 hover:text-sas-navy-700 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Update
                        </button>
                      )}
                    </div>
                    {isEditingProgress ? (
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressValue}
                          onChange={(e) => setProgressValue(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-lg font-bold text-gray-900 w-16 text-right">{progressValue}%</span>
                        <button
                          onClick={handleProgressSave}
                          disabled={updateProgressMutation.isPending}
                          className="p-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 disabled:opacity-50"
                        >
                          {updateProgressMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setProgressValue(goal.progress);
                            setIsEditingProgress(false);
                          }}
                          className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl font-bold text-gray-900">{goal.progress}%</span>
                          <span className="text-sm text-gray-500">
                            {completedMilestones}/{totalMilestones} milestones
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
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
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Start Date:</span>
                          <span className="text-gray-900">{formatDate(goal.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Target Date:</span>
                          <span className="text-gray-900">{formatDate(goal.targetDate)}</span>
                        </div>
                        {daysRemaining !== null && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Time Remaining:</span>
                            <span className={`font-medium ${
                              daysRemaining < 0 ? 'text-red-600' :
                              daysRemaining < 7 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
                               daysRemaining === 0 ? 'Due today' :
                               `${daysRemaining} days left`}
                            </span>
                          </div>
                        )}
                        {goal.completionDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Completed:</span>
                            <span className="text-green-600 font-medium">{formatDate(goal.completionDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                            {goal.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span className="text-gray-900">{formatDate(goal.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Updated:</span>
                          <span className="text-gray-900">{formatRelativeTime(goal.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{goal.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {goal.status === 'draft' && (
                      <button
                        onClick={handleSubmitForApproval}
                        disabled={submitGoalMutation.isPending}
                        className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {submitGoalMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Submit for Approval
                      </button>
                    )}
                    {goal.status === 'active' && goal.progress >= 100 && (
                      <button
                        onClick={handleCompleteGoal}
                        disabled={completeGoalMutation.isPending}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {completeGoalMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Mark as Complete
                      </button>
                    )}
                    {['draft', 'active', 'on_hold'].includes(goal.status) && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Goal
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Milestones Tab */}
              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      Milestones ({completedMilestones}/{totalMilestones} completed)
                    </h3>
                    {goal.status === 'active' && (
                      <button
                        onClick={() => setIsAddingMilestone(true)}
                        className="text-sm text-sas-navy-600 hover:text-sas-navy-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Milestone
                      </button>
                    )}
                  </div>

                  {isAddingMilestone && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-3">New Milestone</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newMilestone.title}
                          onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Milestone title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500"
                        />
                        <textarea
                          value={newMilestone.description}
                          onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 min-h-[60px]"
                        />
                        <input
                          type="date"
                          value={newMilestone.targetDate}
                          onChange={(e) => setNewMilestone(prev => ({ ...prev, targetDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddMilestone}
                            disabled={createMilestoneMutation.isPending || !newMilestone.title || !newMilestone.targetDate}
                            className="px-3 py-1.5 bg-sas-navy-600 text-white rounded-lg text-sm hover:bg-sas-navy-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {createMilestoneMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingMilestone(false);
                              setNewMilestone({ title: '', description: '', targetDate: '' });
                            }}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {milestones.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Flag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No milestones yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {milestones
                        .sort((a, b) => a.order - b.order)
                        .map((milestone, index) => (
                          <MilestoneCard
                            key={milestone.id}
                            milestone={milestone}
                            index={index}
                            onComplete={() => handleCompleteMilestone(milestone.id)}
                            isCompleting={completeMilestoneMutation.isPending}
                            canComplete={goal.status === 'active' && milestone.status !== 'completed'}
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Measurements Tab */}
              {activeTab === 'measurements' && (
                <div className="space-y-4">
                  {measurements.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No measurements tracked yet</p>
                      <p className="text-sm text-gray-500 mt-1">Measurements help track quantifiable progress toward your goal</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {measurements.map(measurement => (
                        <MeasurementCard key={measurement.id} measurement={measurement} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reflections Tab */}
              {activeTab === 'reflections' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Reflections</h3>
                    <button
                      onClick={() => setIsAddingReflection(true)}
                      className="text-sm text-sas-navy-600 hover:text-sas-navy-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Reflection
                    </button>
                  </div>

                  {isAddingReflection && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-3">New Reflection</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newReflection.prompt}
                          onChange={(e) => setNewReflection(prev => ({ ...prev, prompt: e.target.value }))}
                          placeholder="Reflection prompt (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500"
                        />
                        <textarea
                          value={newReflection.response}
                          onChange={(e) => setNewReflection(prev => ({ ...prev, response: e.target.value }))}
                          placeholder="Share your thoughts, progress, challenges, or insights..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddReflection}
                            disabled={createReflectionMutation.isPending || !newReflection.response}
                            className="px-3 py-1.5 bg-sas-navy-600 text-white rounded-lg text-sm hover:bg-sas-navy-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {createReflectionMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            Save Reflection
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingReflection(false);
                              setNewReflection({ prompt: '', response: '' });
                            }}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {reflections.length === 0 && !isAddingReflection ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No reflections yet</p>
                      <p className="text-sm text-gray-500 mt-1">Regular reflection helps deepen your learning</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reflections
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(reflection => (
                          <ReflectionCard key={reflection.id} reflection={reflection} />
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {activity.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No activity recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activity.map(item => (
                        <ActivityItem key={item.id} activity={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Goal?</h3>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. All milestones, measurements, and reflections will also be deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteGoal}
                  disabled={deleteGoalMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteGoalMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Milestone Card Component
function MilestoneCard({
  milestone,
  index,
  onComplete,
  isCompleting,
  canComplete
}: {
  milestone: UserGoalMilestone;
  index: number;
  onComplete: () => void;
  isCompleting: boolean;
  canComplete: boolean;
}) {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    skipped: 'bg-gray-100 text-gray-500'
  };

  return (
    <div className={`border rounded-lg p-4 ${milestone.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
          milestone.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}>
          {milestone.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium ${milestone.status === 'completed' ? 'text-green-900' : 'text-gray-900'}`}>
              {milestone.title}
            </h4>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[milestone.status]}`}>
              {milestone.status.replace('_', ' ')}
            </span>
          </div>
          {milestone.description && (
            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Target: {new Date(milestone.targetDate).toLocaleDateString()}
            </span>
            {milestone.completionDate && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Completed: {new Date(milestone.completionDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {canComplete && (
          <button
            onClick={onComplete}
            disabled={isCompleting}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
          >
            {isCompleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            Complete
          </button>
        )}
      </div>
    </div>
  );
}

// Measurement Card Component
function MeasurementCard({ measurement }: { measurement: UserGoalMeasurement }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const latestValue = measurement.currentValue ?? measurement.baseline;
  const progress = typeof latestValue === 'number' && typeof measurement.target === 'number'
    ? Math.min(100, Math.round((latestValue / measurement.target) * 100))
    : null;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{measurement.metric}</h4>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>Baseline: {measurement.baseline} {measurement.unit}</span>
            <span>Target: {measurement.target} {measurement.unit}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{latestValue}</span>
          <span className="text-sm text-gray-500 ml-1">{measurement.unit}</span>
        </div>
      </div>
      {progress !== null && (
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% of target</p>
        </div>
      )}
      {measurement.entries && measurement.entries.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-sas-navy-600 hover:text-sas-navy-700 flex items-center gap-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {measurement.entries.length} entries
          </button>
          {isExpanded && (
            <div className="mt-2 space-y-1">
              {measurement.entries.slice(-5).map(entry => (
                <div key={entry.id} className="flex items-center justify-between text-sm py-1 border-t border-gray-100">
                  <span className="text-gray-600">{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="font-medium text-gray-900">{entry.value} {measurement.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Reflection Card Component
function ReflectionCard({ reflection }: { reflection: UserGoalReflection }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500">
          {new Date(reflection.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        {reflection.mood && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
            {reflection.mood}
          </span>
        )}
      </div>
      {reflection.prompt && (
        <p className="text-sm font-medium text-gray-700 mb-2">"{reflection.prompt}"</p>
      )}
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{reflection.response}</p>
      {(reflection.insights?.length || reflection.challenges?.length || reflection.nextSteps?.length) && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {reflection.insights && reflection.insights.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500">Insights:</span>
              <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                {reflection.insights.map((insight, i) => <li key={i}>{insight}</li>)}
              </ul>
            </div>
          )}
          {reflection.challenges && reflection.challenges.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500">Challenges:</span>
              <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                {reflection.challenges.map((challenge, i) => <li key={i}>{challenge}</li>)}
              </ul>
            </div>
          )}
          {reflection.nextSteps && reflection.nextSteps.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500">Next Steps:</span>
              <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                {reflection.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: GoalActivity }) {
  const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
    created: { icon: Plus, color: 'text-green-600' },
    submitted: { icon: Send, color: 'text-blue-600' },
    approved: { icon: CheckCircle2, color: 'text-green-600' },
    rejected: { icon: XCircle, color: 'text-red-600' },
    updated: { icon: Edit2, color: 'text-gray-600' },
    status_changed: { icon: TrendingUp, color: 'text-purple-600' },
    milestone_completed: { icon: Flag, color: 'text-green-600' },
    measurement_added: { icon: BarChart3, color: 'text-blue-600' },
    reflection_added: { icon: MessageSquare, color: 'text-indigo-600' },
    comment_added: { icon: MessageSquare, color: 'text-gray-600' },
    collaborator_added: { icon: Users, color: 'text-green-600' },
    collaborator_removed: { icon: Users, color: 'text-red-600' }
  };

  const config = typeConfig[activity.type] || { icon: Clock, color: 'text-gray-600' };
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-2">
      <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ${config.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
