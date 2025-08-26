import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  Settings,
  Tag,
  FileText,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { getFrameworkColorClasses, generateId } from '../utils';
import { frameworkService } from '../services/frameworkService';
import { Framework, Question, Section } from '../types';

interface FrameworkOption {
  id: string;
  label: string;
  category: string;
  color: string;
}

const FrameworkConfigurator: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState('crp-in-action');
  const [editMode, setEditMode] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedSection, setSelectedSection] = useState(0);
  
  // Load framework data from service
  const [framework, setFramework] = useState<Framework | undefined>(undefined);
  const [frameworkOptions, setFrameworkOptions] = useState<FrameworkOption[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({});

  useEffect(() => {
    const frameworkData = frameworkService.getFramework(selectedFramework);
    setFramework(frameworkData);
    setFrameworkOptions(frameworkService.getFrameworkOptions());
  }, [selectedFramework]);

  const currentSection = framework?.sections[selectedSection];
  const questions = currentSection?.questions || [];

  const addQuestion = () => {
    if (!framework || !currentSection || !newQuestion.text) return;

    const question: Question = {
      id: generateId(),
      text: newQuestion.text,
      type: newQuestion.type || 'rating',
      required: true,
      scale: newQuestion.scale || 4,
      weight: 10,
      tags: newQuestion.tags || [],
      helpText: newQuestion.helpText || '',
      frameworkAlignments: newQuestion.frameworkAlignments || []
    };

    const updatedQuestions = [...questions, question];
    frameworkService.updateQuestions(selectedFramework, currentSection.id, updatedQuestions);

    // Refresh framework data
    const updatedFramework = frameworkService.getFramework(selectedFramework);
    setFramework(updatedFramework);

    setNewQuestion({});
    setShowAddQuestion(false);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    if (!framework || !currentSection) return;

    const updatedQuestions = questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    frameworkService.updateQuestions(selectedFramework, currentSection.id, updatedQuestions);

    // Refresh framework data
    const updatedFramework = frameworkService.getFramework(selectedFramework);
    setFramework(updatedFramework);

    setEditingQuestion(null);
    setShowEditQuestion(false);
  };

  const deleteQuestion = (questionId: string) => {
    if (!framework || !currentSection) return;

    const updatedQuestions = questions.filter(q => q.id !== questionId);
    frameworkService.updateQuestions(selectedFramework, currentSection.id, updatedQuestions);

    // Refresh framework data
    const updatedFramework = frameworkService.getFramework(selectedFramework);
    setFramework(updatedFramework);
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    if (!framework || !currentSection) return;

    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const updatedQuestions = [...questions];
    [updatedQuestions[currentIndex], updatedQuestions[newIndex]] = 
      [updatedQuestions[newIndex], updatedQuestions[currentIndex]];

    frameworkService.updateQuestions(selectedFramework, currentSection.id, updatedQuestions);

    // Refresh framework data
    const updatedFramework = frameworkService.getFramework(selectedFramework);
    setFramework(updatedFramework);
  };

  const saveQuestion = () => {
    if (!editingQuestion) return;
    updateQuestion(editingQuestion.id, editingQuestion);
  };

  if (!framework) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading framework...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Framework Configuration</h1>
              <p className="text-sm text-gray-600 mt-1">Configure observation frameworks and look-fors</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center space-x-2">
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Framework Info Sidebar */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Framework Details</h2>
                <button onClick={() => setEditMode(!editMode)} className="text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900 mt-1">{framework.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-600 text-sm mt-1">{framework.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Version</label>
                    <p className="text-gray-900 mt-1">{framework.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      {framework.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Last Modified</label>
                  <p className="text-gray-600 text-sm mt-1">{framework.lastModified}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {framework.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="bg-white rounded-lg shadow-sm border mt-6 p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Sections</h3>
              <div className="space-y-2">
                {framework.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedSection === index 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{section.questions.length} questions</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentSection?.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{currentSection?.description}</p>
                  </div>
                  <button
                    onClick={() => setShowAddQuestion(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Look-For</span>
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <div key={question.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">
                            Look-For {index + 1}
                          </div>
                          <div className="flex items-center space-x-1">
                            {question.required && (
                              <span className="text-red-500 text-sm">*</span>
                            )}
                            <span className="text-xs text-gray-500 uppercase tracking-wider">
                              {question.type} • Scale: {question.scale}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-900 mb-3">{question.text}</p>

                        {question.helpText && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-600">{question.helpText}</p>
                          </div>
                        )}

                        {/* Framework Alignments */}
                        {question.frameworkAlignments.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs font-medium text-gray-700 mb-2">Framework Alignments:</div>
                            <div className="flex flex-wrap gap-1">
                              {question.frameworkAlignments.map(alignmentId => {
                                const framework = frameworkOptions.find(f => f.id === alignmentId);
                                if (!framework) return null;
                                return (
                                  <span
                                    key={alignmentId}
                                    className={`px-2 py-1 rounded text-xs ${getFrameworkColorClasses(framework.color)}`}
                                  >
                                    {framework.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {question.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveQuestion(question.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveQuestion(question.id, 'down')}
                          disabled={index === questions.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingQuestion(question);
                            setShowEditQuestion(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {questions.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No look-fors configured for this section.</p>
                    <button
                      onClick={() => setShowAddQuestion(true)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Look-For</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Look-For</h3>
              <button
                onClick={() => {
                  setShowAddQuestion(false);
                  setNewQuestion({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Look-For Text</label>
                <textarea
                  value={newQuestion.text || ''}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20"
                  placeholder="Enter the look-for description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newQuestion.type || 'rating'}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as Question['type'] }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="rating">Rating Scale</option>
                    <option value="text">Text Response</option>
                    <option value="multiselect">Multiple Selection</option>
                    <option value="single-select">Single Selection</option>
                    <option value="yes-no">Yes/No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scale</label>
                  <select
                    value={newQuestion.scale || 4}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value={4}>4-Point Scale</option>
                    <option value={5}>5-Point Scale</option>
                    <option value={3}>3-Point Scale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Help Text</label>
                <textarea
                  value={newQuestion.helpText || ''}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, helpText: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-16"
                  placeholder="Guidance for observers on what to look for..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={(newQuestion.tags || []).join(', ')}
                  onChange={(e) => setNewQuestion(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="engagement, assessment, differentiation (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Framework Alignments</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {frameworkOptions.map(option => (
                    <label key={option.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(newQuestion.frameworkAlignments || []).includes(option.id)}
                        onChange={(e) => {
                          const alignments = newQuestion.frameworkAlignments || [];
                          setNewQuestion(prev => ({
                            ...prev,
                            frameworkAlignments: e.target.checked
                              ? [...alignments, option.id]
                              : alignments.filter(id => id !== option.id)
                          }));
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddQuestion(false);
                  setNewQuestion({});
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addQuestion}
                disabled={!newQuestion.text}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Add Look-For
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditQuestion && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Look-For</h3>
              <button
                onClick={() => {
                  setShowEditQuestion(false);
                  setEditingQuestion(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Look-For Text</label>
                <textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion(prev => ({ ...prev!, text: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion(prev => ({ ...prev!, type: e.target.value as Question['type'] }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="rating">Rating Scale</option>
                    <option value="text">Text Response</option>
                    <option value="multiselect">Multiple Selection</option>
                    <option value="single-select">Single Selection</option>
                    <option value="yes-no">Yes/No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scale</label>
                  <select
                    value={editingQuestion.scale || 4}
                    onChange={(e) => setEditingQuestion(prev => ({ ...prev!, scale: parseInt(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value={4}>4-Point Scale</option>
                    <option value={5}>5-Point Scale</option>
                    <option value={3}>3-Point Scale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Help Text</label>
                <textarea
                  value={editingQuestion.helpText}
                  onChange={(e) => setEditingQuestion(prev => ({ ...prev!, helpText: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={editingQuestion.tags.join(', ')}
                  onChange={(e) => setEditingQuestion(prev => ({ 
                    ...prev!, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Framework Alignments</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {frameworkOptions.map(option => (
                    <label key={option.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingQuestion.frameworkAlignments.includes(option.id)}
                        onChange={(e) => {
                          setEditingQuestion(prev => ({
                            ...prev!,
                            frameworkAlignments: e.target.checked
                              ? [...prev!.frameworkAlignments, option.id]
                              : prev!.frameworkAlignments.filter(id => id !== option.id)
                          }));
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditQuestion(false);
                  setEditingQuestion(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameworkConfigurator;
