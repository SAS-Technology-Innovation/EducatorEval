// Modal components for creating frameworks, sections, and questions
import { useState } from 'react';
import { Plus, Save, X, Trash2, CheckCircle } from 'lucide-react';
import type { Framework, FrameworkSection, Question, FrameworkAlignment, RatingScale } from '../../types';
import type { User } from '../../types';

// Create Framework Modal Component
export function CreateFrameworkModal({
  user,
  onSave,
  onClose
}: {
  user: User;
  onSave: (framework: Omit<Framework, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.0');
  const [type, setType] = useState('observation');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived' | 'deprecated'>('draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFramework: Omit<Framework, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      description,
      type,
      version,
      status,
      schoolId: user.schoolId,
      createdBy: user.id,
      applicableDivisions: [],
      sections: [],
      totalQuestions: 0,
      requiredQuestions: 0,
      estimatedDuration: 0,
      alignments: [],
      tags: [],
      categories: [],
      usageCount: 0,
      averageCompletionTime: 0,
      averageEvidenceScore: 0,
      metadata: {}
    };

    onSave(newFramework);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Create New Framework</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Framework Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., CRP Framework, CASEL Framework"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this framework..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                >
                  <option value="observation">Observation</option>
                  <option value="evaluation">Evaluation</option>
                  <option value="assessment">Assessment</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> After creating the framework, you'll be able to add sections, questions, and alignments.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Create Framework
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create Section Modal Component
export function CreateSectionModal({
  onSave,
  onClose
}: {
  onSave: (section: Omit<FrameworkSection, 'id'>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);
  const [isRequired, setIsRequired] = useState(false);
  const [weight, setWeight] = useState(1);
  const [color, setColor] = useState('blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSection: Omit<FrameworkSection, 'id'> = {
      title,
      description,
      order,
      questions: [],
      isRequired,
      weight,
      color
    };

    onSave(newSection);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Create New Section</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Classroom Environment, Instructional Strategies"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this section focuses on..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="yellow">Yellow</option>
                  <option value="red">Red</option>
                  <option value="gray">Gray</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sectionIsRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 text-sas-navy-600 border-gray-300 rounded focus:ring-sas-navy-500"
              />
              <label htmlFor="sectionIsRequired" className="text-sm font-medium text-gray-700">
                This section is required
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> After creating the section, you can add questions to it.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Create Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create Question Modal Component
export function CreateQuestionModal({
  sectionIdx,
  availableAlignments,
  onSave,
  onClose,
  getAlignmentColorClasses
}: {
  sectionIdx: number;
  availableAlignments: FrameworkAlignment[];
  onSave: (question: Omit<Question, 'id'>, sectionIdx: number) => void;
  onClose: () => void;
  getAlignmentColorClasses: (color: string) => string;
}) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [helpText, setHelpText] = useState('');
  const [examples, setExamples] = useState<string[]>([]);
  const [type, setType] = useState<'rating' | 'text' | 'multiselect' | 'checkbox' | 'file'>('rating');
  const [selectedAlignments, setSelectedAlignments] = useState<FrameworkAlignment[]>([]);
  const [isRequired, setIsRequired] = useState(false);
  const [weight, setWeight] = useState(1);
  const [order, setOrder] = useState(1);
  const [newExample, setNewExample] = useState('');

  const handleAddExample = () => {
    if (newExample.trim()) {
      setExamples([...examples, newExample.trim()]);
      setNewExample('');
    }
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const toggleAlignment = (alignment: FrameworkAlignment) => {
    const isSelected = selectedAlignments.some(a => a.id === alignment.id);
    if (isSelected) {
      setSelectedAlignments(selectedAlignments.filter(a => a.id !== alignment.id));
    } else {
      setSelectedAlignments([...selectedAlignments, alignment]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create default rating scale for rating type
    const defaultScale: RatingScale = {
      id: 'default-4-point',
      name: '4-Point Scale',
      type: 'numeric',
      min: 1,
      max: 4,
      labels: [
        { value: 4, label: 'Highly Effective', description: 'Consistently demonstrates exemplary practice', color: 'green' },
        { value: 3, label: 'Effective', description: 'Demonstrates strong practice', color: 'blue' },
        { value: 2, label: 'Developing', description: 'Demonstrates emerging practice', color: 'yellow' },
        { value: 1, label: 'Needs Improvement', description: 'Requires significant development', color: 'red' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    };

    const newQuestion: Omit<Question, 'id'> = {
      sectionId: `section-${sectionIdx}`,
      text,
      description,
      helpText,
      examples,
      type,
      isRequired,
      weight,
      order,
      scale: type === 'rating' ? defaultScale : undefined,
      frameworkAlignments: selectedAlignments,
      tags: [],
      categories: [],
      difficulty: 'medium',
      evidenceRequired: false,
      evidenceTypes: [],
      minEvidenceCount: 0
    };

    onSave(newQuestion, sectionIdx);
  };

  // Group alignments by category
  const alignmentsByCategory = availableAlignments.reduce((acc, alignment) => {
    const category = alignment.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(alignment);
    return acc;
  }, {} as Record<string, FrameworkAlignment[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Create New Question</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Teacher fosters a respectful and inclusive environment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              >
                <option value="rating">Rating Scale</option>
                <option value="text">Text Response</option>
                <option value="multiselect">Multiple Select</option>
                <option value="checkbox">Checkbox</option>
                <option value="file">File Upload</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional context or clarification..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              />
            </div>

            {/* Help Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Help Text (What to look for)
              </label>
              <textarea
                value={helpText}
                onChange={(e) => setHelpText(e.target.value)}
                placeholder="E.g., Student discussions about personal experiences, cultural connections..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              />
            </div>

            {/* Examples */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examples
              </label>
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                      {example}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExample(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExample();
                      }
                    }}
                    placeholder="Add an example..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddExample}
                    className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Framework Alignments */}
            {availableAlignments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Framework Alignments ({selectedAlignments.length} selected)
                </label>
                <div className="space-y-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {Object.entries(alignmentsByCategory).map(([category, alignments]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {alignments.map((alignment) => {
                          const isSelected = selectedAlignments.some(a => a.id === alignment.id);
                          return (
                            <button
                              key={alignment.id}
                              type="button"
                              onClick={() => toggleAlignment(alignment)}
                              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                                isSelected
                                  ? getAlignmentColorClasses(alignment.color)
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {isSelected && <CheckCircle className="w-3 h-3 mr-1" />}
                              {alignment.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  min={0}
                  step={0.1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Required Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="questionIsRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 text-sas-navy-600 border-gray-300 rounded focus:ring-sas-navy-500"
              />
              <label htmlFor="questionIsRequired" className="text-sm font-medium text-gray-700">
                This question is required
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Create Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
