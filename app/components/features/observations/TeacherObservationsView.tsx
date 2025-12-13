import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../../stores/auth';
import { useObservations, useUpdateObservation } from '../../../hooks/useObservations';
import { useFrameworks } from '../../../hooks/useFrameworks';
import type { Observation } from '../../../types';
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Calendar,
  BarChart3,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';

// Teacher-specific view: Only past completed observations, with insights and comment features
const TeacherObservationsView: React.FC = () => {
  const { user } = useAuthStore();
  const { data: observations, isLoading: observationsLoading } = useObservations();
  const { data: frameworks } = useFrameworks();
  const updateObservation = useUpdateObservation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'insights'>('list');
  const [selectedObservation, setSelectedObservation] = useState<any>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [teacherComment, setTeacherComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Filter: Only past completed observations for this teacher
  const myObservations = useMemo(() => {
    if (!observations || !user) return [];

    const now = new Date();

    return observations.filter(obs => {
      // Only show observations where this user is the subject (being observed)
      const isMyObservation = obs.subjectId === user.id;

      // Only show completed, submitted, or reviewed observations (not drafts)
      const isCompleted = ['completed', 'submitted', 'reviewed'].includes(obs.status);

      // Only show past observations (observation date is in the past)
      const isPast = obs.context?.date
        ? new Date(obs.context.date) <= now
        : obs.reviewedAt
          ? new Date(obs.reviewedAt) <= now
          : obs.submittedAt
            ? new Date(obs.submittedAt) <= now
            : false;

      const matchesFramework = selectedFramework === 'all' || obs.frameworkId === selectedFramework;

      const matchesSearch = !searchTerm ||
        obs.context?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.observerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.context?.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.context?.className?.toLowerCase().includes(searchTerm.toLowerCase());

      return isMyObservation && isCompleted && isPast && matchesFramework && matchesSearch;
    }).sort((a, b) => {
      // Sort by observation date, most recent first
      const dateA = new Date(a.context?.date || a.reviewedAt || a.submittedAt || 0);
      const dateB = new Date(b.context?.date || b.reviewedAt || b.submittedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [observations, user, selectedFramework, searchTerm]);

  // Calculate insights based on observations (framework-driven)
  const insights = useMemo(() => {
    if (myObservations.length === 0 || !frameworks) return null;

    // Framework usage analysis
    const frameworkCounts: Record<string, number> = {};

    // Section scores across all observations (framework-driven)
    const sectionScores: Record<string, {
      total: number;
      count: number;
      frameworkId: string;
      sectionName: string;
      color?: string;
    }> = {};

    const strengthAreas: string[] = [];
    const growthAreas: string[] = [];

    myObservations.forEach(obs => {
      // Count framework usage
      if (obs.frameworkId) {
        frameworkCounts[obs.frameworkId] = (frameworkCounts[obs.frameworkId] || 0) + 1;
      }

      // Use frameworkScores if available (new observations)
      if (obs.frameworkScores && obs.frameworkScores.length > 0) {
        obs.frameworkScores.forEach(score => {
          const key = `${obs.frameworkId}_${score.alignmentId}`;
          if (!sectionScores[key]) {
            sectionScores[key] = {
              total: 0,
              count: 0,
              frameworkId: obs.frameworkId,
              sectionName: score.alignmentName,
            };
          }
          sectionScores[key].total += score.percentage;
          sectionScores[key].count += 1;
        });
      }
      // Fallback: analyze responses directly
      else if (obs.responses && Array.isArray(obs.responses)) {
        const framework = frameworks.find(f => f.id === obs.frameworkId);
        if (!framework) return;

        framework.sections.forEach(section => {
          const sectionQuestionIds = section.questions.map(q => q.id);
          const sectionResponses = obs.responses.filter((r: any) =>
            sectionQuestionIds.includes(r.questionId)
          );

          if (sectionResponses.length > 0) {
            const key = `${obs.frameworkId}_${section.id}`;
            if (!sectionScores[key]) {
              sectionScores[key] = {
                total: 0,
                count: 0,
                frameworkId: obs.frameworkId,
                sectionName: section.title,
                color: section.color
              };
            }

            sectionResponses.forEach((response: any) => {
              const rating = parseFloat(response.rating);
              if (!isNaN(rating) && response.rating !== 'not-observed') {
                const question = section.questions.find(q => q.id === response.questionId);
                const maxRating = question?.scale?.max || 4;
                const percentage = (rating / maxRating) * 100;
                sectionScores[key].total += percentage;
                sectionScores[key].count += 1;
              }
            });
          }
        });
      }
    });

    // Calculate average scores by section
    const sectionAverages = Object.values(sectionScores)
      .filter(s => s.count > 0)
      .map(section => ({
        sectionName: section.sectionName,
        average: section.total / section.count,
        color: section.color,
        frameworkId: section.frameworkId
      }))
      .sort((a, b) => b.average - a.average);

    // Identify strengths (average >= 75%) and growth areas (average < 60%)
    sectionAverages.forEach(section => {
      if (section.average >= 75) {
        strengthAreas.push(section.sectionName);
      } else if (section.average < 60) {
        growthAreas.push(section.sectionName);
      }
    });

    const overallAverage = sectionAverages.length > 0
      ? sectionAverages.reduce((sum, s) => sum + s.average, 0) / sectionAverages.length
      : 0;

    return {
      totalObservations: myObservations.length,
      frameworkCounts,
      sectionAverages,
      strengthAreas,
      growthAreas,
      overallAverage
    };
  }, [myObservations, frameworks]);


  const handleAddComment = (observation: Observation) => {
    setSelectedObservation(observation);
    setTeacherComment((observation.metadata?.teacherComment as string) || '');
    setShowCommentModal(true);
  };

  const handleSubmitComment = async () => {
    if (!selectedObservation || !teacherComment.trim()) {
      return;
    }

    setIsSubmittingComment(true);

    try {
      // Update observation with teacher comment in metadata
      await updateObservation.mutateAsync({
        id: selectedObservation.id,
        data: {
          metadata: {
            ...selectedObservation.metadata,
            teacherComment: teacherComment.trim(),
            teacherCommentedAt: new Date().toISOString(),
            teacherCommentedBy: user?.id
          }
        }
      });

      setShowCommentModal(false);
      setSelectedObservation(null);
      setTeacherComment('');
    } catch (error) {
      console.error('Error submitting teacher comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your observations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Observations</h1>
              <p className="text-gray-600">View your completed observations and insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  viewMode === 'list'
                    ? 'bg-sas-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                List View
              </button>
              <button
                onClick={() => setViewMode('insights')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  viewMode === 'insights'
                    ? 'bg-sas-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Insights
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'list' ? (
          <>
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-sas-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-sas-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Observations</p>
                    <p className="text-lg font-bold text-gray-900">
                      {observationsLoading ? '...' : myObservations.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Strengths</p>
                    <p className="text-lg font-bold text-gray-900">
                      {insights ? insights.strengthAreas.length : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Growth Areas</p>
                    <p className="text-lg font-bold text-gray-900">
                      {insights ? insights.growthAreas.length : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Overall Score</p>
                    <p className="text-lg font-bold text-gray-900">
                      {insights ? insights.overallAverage.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search observations..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                    >
                      <option value="all">All Frameworks</option>
                      {frameworks?.map((framework) => (
                        <option key={framework.id} value={framework.id}>
                          {framework.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedFramework('all');
                      }}
                      className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Observations List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">
                  Past Observations ({myObservations.length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Note: Future scheduled observations are not shown to teachers
                </p>
              </div>

              {observationsLoading ? (
                <div className="p-6 text-center text-gray-500">Loading observations...</div>
              ) : myObservations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No observations yet</h3>
                  <p className="text-gray-600">Your completed observations will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {myObservations.map((observation) => (
                    <div key={observation.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-sas-blue-100 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-sas-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {observation.context?.subject || observation.frameworkName} - {observation.context?.className || 'Class'}
                                </h3>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  observation.status === 'reviewed' ? 'bg-purple-100 text-purple-800' :
                                  observation.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="ml-1 capitalize">{observation.status}</span>
                                </span>
                              </div>

                              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Observer:</span> {observation.observerName || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span> {
                                    observation.context?.date
                                      ? new Date(observation.context.date).toLocaleDateString()
                                      : observation.reviewedAt
                                        ? new Date(observation.reviewedAt).toLocaleDateString()
                                        : new Date(observation.submittedAt || observation.createdAt).toLocaleDateString()
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span> {observation.context?.duration || 'N/A'} min
                                </div>
                                <div>
                                  <span className="font-medium">Grade:</span> {observation.context?.grade || 'N/A'}
                                </div>
                              </div>

                              {observation.metadata?.teacherComment && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Your Response:</span> {observation.metadata.teacherComment as string}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {/* TODO: View details */}}
                            className="p-2 text-gray-400 hover:text-sas-blue-600 hover:bg-sas-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAddComment(observation)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title={observation.metadata?.teacherComment ? "Edit Response" : "Add Response"}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Insights View */
          <div className="space-y-6">
            {insights ? (
              <>
                {/* Overall Performance */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-sas-blue-600 mr-2" />
                    Overall Performance
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-sas-blue-600 mb-2">
                        {insights.overallAverage.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Overall Performance</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {insights.strengthAreas.length}
                      </div>
                      <p className="text-sm text-gray-600">Strength Areas</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600 mb-2">
                        {insights.growthAreas.length}
                      </div>
                      <p className="text-sm text-gray-600">Growth Opportunities</p>
                    </div>
                  </div>
                </div>

                {/* Section Performance (Framework-Driven) */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-6 h-6 text-sas-blue-600 mr-2" />
                    Performance by Framework Section
                  </h2>
                  <div className="space-y-4">
                    {insights.sectionAverages.map((section, idx) => (
                      <div key={`${section.frameworkId}_${section.sectionName}_${idx}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {section.sectionName}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {section.average.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              section.average >= 75 ? 'bg-green-500' :
                              section.average >= 60 ? 'bg-sas-blue-500' :
                              section.average >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${section.average}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                {insights.strengthAreas.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Award className="w-6 h-6 text-green-600 mr-2" />
                      Your Strengths
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {insights.strengthAreas.map((area, index) => (
                        <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
                          <span className="text-sm font-medium text-gray-900">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Growth Areas */}
                {insights.growthAreas.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Target className="w-6 h-6 text-yellow-600 mr-2" />
                      Growth Opportunities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {insights.growthAreas.map((area, index) => (
                        <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                          <span className="text-sm font-medium text-gray-900">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                <p className="text-gray-600">
                  Complete more observations to see personalized insights and performance trends.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {showCommentModal && selectedObservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowCommentModal(false)}
            />

            <div className="relative bg-white rounded-lg max-w-2xl w-full z-10 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Add Your Response
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Observation: {selectedObservation.context?.subject || selectedObservation.frameworkName} - {new Date(selectedObservation.context?.date || selectedObservation.reviewedAt || selectedObservation.submittedAt).toLocaleDateString()}
              </p>
              <textarea
                value={teacherComment}
                onChange={(e) => setTeacherComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                placeholder="Share your thoughts, reflections, or questions about this observation..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowCommentModal(false)}
                  disabled={isSubmittingComment}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmittingComment || !teacherComment.trim()}
                  className="px-4 py-2 bg-sas-blue-600 text-white rounded-lg font-medium hover:bg-sas-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingComment ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherObservationsView;
