import React, { useState } from 'react';
import type { Question, ObservationResponse } from '../../../types/observation';
import { HelpCircle, FileText, CheckSquare, Upload } from 'lucide-react';

interface DynamicQuestionProps {
  question: Question;
  value?: ObservationResponse;
  onChange: (response: ObservationResponse) => void;
  sectionColor?: string;
}

/**
 * Dynamic question component that renders different input types
 * based on the framework question configuration
 */
const DynamicQuestion: React.FC<DynamicQuestionProps> = ({
  question,
  value,
  onChange,
  sectionColor = 'blue'
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [localComment, setLocalComment] = useState(value?.comments || '');
  const [localEvidence, setLocalEvidence] = useState<string[]>(value?.evidence || []);
  const [newEvidence, setNewEvidence] = useState('');

  // Handle rating change
  const handleRatingChange = (rating: string, ratingText: string) => {
    const response: ObservationResponse = {
      questionId: question.id,
      questionText: question.text,
      rating,
      ratingText,
      comments: localComment,
      evidence: localEvidence,
      tags: question.tags,
      frameworkAlignments: question.frameworkAlignments.map(a => a.id),
      confidence: 'medium',
      timestamp: new Date()
    };
    onChange(response);
  };

  // Handle text change
  const handleTextChange = (text: string) => {
    const response: ObservationResponse = {
      questionId: question.id,
      questionText: question.text,
      rating: text, // For text questions, rating field stores the text
      ratingText: text,
      comments: localComment,
      evidence: localEvidence,
      tags: question.tags,
      frameworkAlignments: question.frameworkAlignments.map(a => a.id),
      confidence: 'medium',
      timestamp: new Date()
    };
    onChange(response);
  };

  // Handle multiselect change
  const handleMultiselectChange = (optionValue: string, checked: boolean) => {
    const currentSelections = value?.rating ? value.rating.split(',') : [];
    const newSelections = checked
      ? [...currentSelections, optionValue]
      : currentSelections.filter(v => v !== optionValue);

    const response: ObservationResponse = {
      questionId: question.id,
      questionText: question.text,
      rating: newSelections.join(','),
      ratingText: newSelections.join(', '),
      comments: localComment,
      evidence: localEvidence,
      tags: question.tags,
      frameworkAlignments: question.frameworkAlignments.map(a => a.id),
      confidence: 'medium',
      timestamp: new Date()
    };
    onChange(response);
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    const response: ObservationResponse = {
      questionId: question.id,
      questionText: question.text,
      rating: checked ? 'checked' : 'unchecked',
      ratingText: checked ? 'Yes' : 'No',
      comments: localComment,
      evidence: localEvidence,
      tags: question.tags,
      frameworkAlignments: question.frameworkAlignments.map(a => a.id),
      confidence: 'medium',
      timestamp: new Date()
    };
    onChange(response);
  };

  // Handle comment change
  const handleCommentChange = (comment: string) => {
    setLocalComment(comment);
    if (value) {
      onChange({ ...value, comments: comment });
    }
  };

  // Add evidence
  const handleAddEvidence = () => {
    if (newEvidence.trim()) {
      const updated = [...localEvidence, newEvidence.trim()];
      setLocalEvidence(updated);
      setNewEvidence('');
      if (value) {
        onChange({ ...value, evidence: updated });
      }
    }
  };

  // Remove evidence
  const handleRemoveEvidence = (index: number) => {
    const updated = localEvidence.filter((_, i) => i !== index);
    setLocalEvidence(updated);
    if (value) {
      onChange({ ...value, evidence: updated });
    }
  };

  const colorClasses = {
    blue: 'border-sas-blue-200 bg-sas-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    red: 'border-red-200 bg-red-50',
    gray: 'border-gray-200 bg-gray-50',
  }[sectionColor] || 'border-gray-200 bg-gray-50';

  return (
    <div className={`border-l-4 ${colorClasses} p-4 rounded-r-lg mb-4`}>
      {/* Question Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">
              {question.text}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </h4>
            {question.helpText && (
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Show help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          {question.description && (
            <p className="text-sm text-gray-600 mt-1">{question.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-4">
          {question.frameworkAlignments.map((alignment, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-gray-300 text-gray-700"
              title={alignment.description}
            >
              {alignment.name}
            </span>
          ))}
        </div>
      </div>

      {/* Help Text Expandable */}
      {showHelp && question.helpText && (
        <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">{question.helpText}</p>
          {question.examples && question.examples.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Examples:</p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                {question.examples.map((example, idx) => (
                  <li key={idx}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Question Input Based on Type */}
      <div className="mb-3">
        {question.type === 'rating' && question.scale && (
          <div className="space-y-2">
            {question.scale.labels.map((label) => (
              <label
                key={label.value}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  value?.rating === String(label.value)
                    ? `border-${sectionColor}-500 bg-${sectionColor}-50`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={label.value}
                  checked={value?.rating === String(label.value)}
                  onChange={() => handleRatingChange(String(label.value), label.label)}
                  className="w-4 h-4 text-sas-blue-600 focus:ring-sas-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{label.label}</span>
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      label.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      label.color === 'green' ? 'bg-green-100 text-green-800' :
                      label.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      label.color === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {label.value}
                    </span>
                  </div>
                  {label.description && (
                    <p className="text-sm text-gray-600 mt-1">{label.description}</p>
                  )}
                </div>
              </label>
            ))}
            {question.scale.includeNotObserved && (
              <label
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  value?.rating === 'not-observed'
                    ? 'border-gray-400 bg-gray-100'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value="not-observed"
                  checked={value?.rating === 'not-observed'}
                  onChange={() => handleRatingChange('not-observed', question.scale?.notObservedLabel || 'Not Observed')}
                  className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                />
                <span className="ml-3 font-medium text-gray-700">
                  {question.scale.notObservedLabel || 'Not Observed'}
                </span>
              </label>
            )}
          </div>
        )}

        {question.type === 'text' && (
          <textarea
            value={value?.rating || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your response..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500 resize-none"
            rows={4}
          />
        )}

        {question.type === 'multiselect' && question.scale && (
          <div className="space-y-2">
            {question.scale.labels.map((label) => (
              <label
                key={label.value}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value?.rating?.split(',').includes(String(label.value)) || false}
                  onChange={(e) => handleMultiselectChange(String(label.value), e.target.checked)}
                  className="w-4 h-4 text-sas-blue-600 focus:ring-sas-blue-500 rounded"
                />
                <div className="ml-3 flex-1">
                  <span className="font-medium text-gray-900">{label.label}</span>
                  {label.description && (
                    <p className="text-sm text-gray-600 mt-1">{label.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && (
          <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={value?.rating === 'checked'}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="w-4 h-4 text-sas-blue-600 focus:ring-sas-blue-500 rounded"
            />
            <span className="ml-3 font-medium text-gray-900">
              {question.text}
            </span>
          </label>
        )}

        {question.type === 'file' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sas-blue-400 cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {question.evidenceTypes?.join(', ') || 'Any file type'}
            </p>
            <input
              type="file"
              className="hidden"
              accept={question.evidenceTypes?.join(',') || '*'}
              multiple
            />
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Comments / Notes
        </label>
        <textarea
          value={localComment}
          onChange={(e) => handleCommentChange(e.target.value)}
          placeholder="Add any observations, notes, or context..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500 resize-none text-sm"
          rows={2}
        />
      </div>

      {/* Evidence Section */}
      {question.evidenceRequired && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CheckSquare className="w-4 h-4 inline mr-1" />
            Evidence {question.minEvidenceCount && `(min ${question.minEvidenceCount})`}
          </label>
          {localEvidence.length > 0 && (
            <div className="space-y-2 mb-2">
              {localEvidence.map((ev, idx) => (
                <div key={idx} className="flex items-center p-2 bg-white rounded border border-gray-200">
                  <p className="flex-1 text-sm text-gray-700">{ev}</p>
                  <button
                    onClick={() => handleRemoveEvidence(idx)}
                    className="ml-2 text-red-600 hover:text-red-800 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newEvidence}
              onChange={(e) => setNewEvidence(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEvidence()}
              placeholder="Add evidence (press Enter)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500 text-sm"
            />
            <button
              onClick={handleAddEvidence}
              className="px-3 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 text-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicQuestion;
