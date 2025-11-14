import React, { useState, useEffect, useMemo } from 'react';
import { useFramework } from '../../../hooks/useFrameworks';
import DynamicQuestion from './DynamicQuestion';
import type { Observation, ObservationResponse } from '../../../types/observation';
import { Camera, Mic, MapPin, Save, Send, Clock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DynamicObservationFormProps {
  frameworkId: string;
  observation?: Partial<Observation>;
  onSave?: (data: Partial<Observation>) => void;
  onSubmit?: (data: Partial<Observation>) => void;
  onCancel?: () => void;
}

/**
 * Framework-driven observation form
 * Dynamically renders sections and questions based on the selected framework
 */
export default function DynamicObservationForm({
  frameworkId,
  observation,
  onSave,
  onSubmit,
  onCancel
}: DynamicObservationFormProps) {
  const { data: framework, isLoading: frameworkLoading } = useFramework(frameworkId);

  // Form state
  const [responses, setResponses] = useState<Record<string, ObservationResponse>>(
    observation?.responses?.reduce((acc, r) => ({ ...acc, [r.questionId]: r }), {}) || {}
  );
  const [overallComments, setOverallComments] = useState(observation?.overallComments || '');
  const [startTime] = useState(observation?.context?.startTime || new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate duration
  const duration = useMemo(() => {
    return Math.floor((currentTime.getTime() - startTime.getTime()) / 60000);
  }, [currentTime, startTime]);

  // Calculate completion stats
  const completionStats = useMemo(() => {
    if (!framework) return { answered: 0, required: 0, total: 0 };

    const allQuestions = framework.sections.flatMap(s => s.questions);
    const requiredQuestions = allQuestions.filter(q => q.isRequired);
    const answeredQuestions = allQuestions.filter(q => responses[q.id]?.rating);

    return {
      answered: answeredQuestions.length,
      required: requiredQuestions.length,
      total: allQuestions.length,
      requiredAnswered: requiredQuestions.filter(q => responses[q.id]?.rating).length
    };
  }, [framework, responses]);

  // Calculate framework scores
  const calculateScores = (): Observation['frameworkScores'] => {
    if (!framework) return [];

    const scoresByAlignment: Record<string, { total: number; count: number; maxPerQuestion: number }> = {};

    // Initialize alignments
    framework.alignments.forEach(alignment => {
      scoresByAlignment[alignment.id] = { total: 0, count: 0, maxPerQuestion: 4 }; // Assuming 4-point scale
    });

    // Calculate scores
    Object.values(responses).forEach(response => {
      const question = framework.sections
        .flatMap(s => s.questions)
        .find(q => q.id === response.questionId);

      if (!question || response.rating === 'not-observed') return;

      const score = parseFloat(response.rating);
      if (isNaN(score)) return;

      const maxScore = question.scale?.max || 4;

      response.frameworkAlignments.forEach(alignmentId => {
        if (scoresByAlignment[alignmentId]) {
          scoresByAlignment[alignmentId].total += score;
          scoresByAlignment[alignmentId].count += 1;
          scoresByAlignment[alignmentId].maxPerQuestion = maxScore;
        }
      });
    });

    // Convert to framework scores
    return Object.entries(scoresByAlignment).map(([alignmentId, data]) => {
      const alignment = framework.alignments.find(a => a.id === alignmentId);
      const maxScore = data.count * data.maxPerQuestion;
      const percentage = data.count > 0 ? (data.total / maxScore) * 100 : 0;

      return {
        alignmentId,
        alignmentName: alignment?.name || alignmentId,
        score: data.total,
        maxScore,
        percentage,
        evidenceCount: data.count,
        questionCount: data.count
      };
    });
  };

  // Handle response change
  const handleResponseChange = (questionId: string, response: ObservationResponse) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
  };

  // Handle save draft
  const handleSave = () => {
    if (!framework) return;

    const observationData: Partial<Observation> = {
      ...observation,
      frameworkId: framework.id,
      frameworkName: framework.name,
      frameworkVersion: framework.version,
      responses: Object.values(responses),
      overallComments,
      status: 'draft',
      context: {
        ...observation?.context,
        duration,
        startTime,
        endTime: currentTime,
      } as any,
      frameworkScores: calculateScores(),
      evidenceCount: Object.values(responses).filter(r => r.evidence && r.evidence.length > 0).length,
      totalQuestions: framework.totalQuestions,
      evidencePercentage: (Object.values(responses).filter(r => r.evidence && r.evidence.length > 0).length / framework.totalQuestions) * 100,
      updatedAt: new Date(),
    };

    onSave?.(observationData);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!framework) return;

    // Validation
    if (completionStats.requiredAnswered < completionStats.required) {
      alert(`Please answer all required questions (${completionStats.requiredAnswered}/${completionStats.required} completed)`);
      return;
    }

    const observationData: Partial<Observation> = {
      ...observation,
      frameworkId: framework.id,
      frameworkName: framework.name,
      frameworkVersion: framework.version,
      responses: Object.values(responses),
      overallComments,
      status: 'completed',
      context: {
        ...observation?.context,
        duration,
        startTime,
        endTime: currentTime,
      } as any,
      frameworkScores: calculateScores(),
      evidenceCount: Object.values(responses).filter(r => r.evidence && r.evidence.length > 0).length,
      totalQuestions: framework.totalQuestions,
      evidencePercentage: (Object.values(responses).filter(r => r.evidence && r.evidence.length > 0).length / framework.totalQuestions) * 100,
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    onSubmit?.(observationData);
  };

  if (frameworkLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading framework...</p>
        </div>
      </div>
    );
  }

  if (!framework) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Framework not found</p>
          <p className="text-gray-600">The selected framework could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sas-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-sas-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{framework.name}</h2>
              <p className="text-sm text-gray-600">
                {framework.description} • v{framework.version}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{duration} minutes</span>
            </div>
            <p className="text-xs text-gray-500">
              Started: {startTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completionStats.answered}/{completionStats.total} questions
            </span>
            <span className="text-sm text-gray-600">
              Required: {completionStats.requiredAnswered}/{completionStats.required}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                completionStats.requiredAnswered >= completionStats.required
                  ? 'bg-green-500'
                  : 'bg-sas-blue-500'
              }`}
              style={{ width: `${(completionStats.answered / completionStats.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {framework.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Section Header */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center space-x-3">
                  {section.icon && <span className="text-2xl">{section.icon}</span>}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    section.isRequired ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {section.isRequired ? 'Required' : 'Optional'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Weight: {(section.weight * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {section.questions.length} questions
                  </span>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {section.questions
                  .sort((a, b) => a.order - b.order)
                  .map((question) => (
                    <DynamicQuestion
                      key={question.id}
                      question={question}
                      value={responses[question.id]}
                      onChange={(response) => handleResponseChange(question.id, response)}
                      sectionColor={section.color}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* Overall Comments */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Observation Summary
        </label>
        <textarea
          value={overallComments}
          onChange={(e) => setOverallComments(e.target.value)}
          placeholder="Summarize key observations, patterns, or insights from this observation..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500 resize-none"
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 border border-sas-blue-600 text-sas-blue-600 rounded-lg font-medium hover:bg-sas-blue-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={completionStats.requiredAnswered < completionStats.required}
            className="px-6 py-2 bg-sas-blue-600 text-white rounded-lg font-medium hover:bg-sas-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Observation
          </button>
        </div>
      </div>

      {/* Completion Warning */}
      {completionStats.requiredAnswered < completionStats.required && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Required questions remaining</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please answer {completionStats.required - completionStats.requiredAnswered} more required question(s) before submitting.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
