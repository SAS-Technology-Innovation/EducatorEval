import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useFrameworks, useUpdateFramework } from '../../hooks/useFrameworks';
import DataTable, { type Column } from '../common/DataTable';
import type { Framework, FrameworkSection, Question, FrameworkAlignment } from '../../types';

export default function FrameworkManagement() {
  const { data: frameworks = [], isLoading, error } = useFrameworks();
  const updateFramework = useUpdateFramework();

  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Edit modals
  const [isEditingFramework, setIsEditingFramework] = useState(false);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingSection, setEditingSection] = useState<FrameworkSection | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingSectionIdx, setEditingSectionIdx] = useState<number | null>(null);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Save framework metadata changes
  const handleSaveFramework = async (updates: Partial<Framework>) => {
    if (!selectedFramework) return;

    try {
      await updateFramework.mutateAsync({
        id: selectedFramework.id,
        data: updates
      });
      setSelectedFramework({ ...selectedFramework, ...updates });
      setIsEditingFramework(false);
    } catch (err) {
      console.error('Failed to update framework:', err);
      alert('Failed to save framework changes');
    }
  };

  // Save section changes
  const handleSaveSection = async (updatedSection: FrameworkSection) => {
    if (!selectedFramework || editingSectionIdx === null) return;

    const updatedSections = [...selectedFramework.sections];
    updatedSections[editingSectionIdx] = updatedSection;

    try {
      await updateFramework.mutateAsync({
        id: selectedFramework.id,
        data: { sections: updatedSections }
      });
      setSelectedFramework({ ...selectedFramework, sections: updatedSections });
      setIsEditingSection(false);
      setEditingSection(null);
      setEditingSectionIdx(null);
    } catch (err) {
      console.error('Failed to update section:', err);
      alert('Failed to save section changes');
    }
  };

  // Save question changes
  const handleSaveQuestion = async (updatedQuestion: Question) => {
    if (!selectedFramework || editingSectionIdx === null || editingQuestionIdx === null) return;

    const updatedSections = [...selectedFramework.sections];
    const section = { ...updatedSections[editingSectionIdx] };
    const questions = [...(section.questions || [])];
    questions[editingQuestionIdx] = updatedQuestion;
    section.questions = questions;
    updatedSections[editingSectionIdx] = section;

    try {
      await updateFramework.mutateAsync({
        id: selectedFramework.id,
        data: { sections: updatedSections }
      });
      setSelectedFramework({ ...selectedFramework, sections: updatedSections });
      setIsEditingQuestion(false);
      setEditingQuestion(null);
      setEditingQuestionIdx(null);
    } catch (err) {
      console.error('Failed to update question:', err);
      alert('Failed to save question changes');
    }
  };

  // Open edit dialogs
  const openEditFramework = () => {
    setIsEditingFramework(true);
  };

  const openEditSection = (section: FrameworkSection, sectionIdx: number) => {
    setEditingSection(section);
    setEditingSectionIdx(sectionIdx);
    setIsEditingSection(true);
  };

  const openEditQuestion = (question: Question, sectionIdx: number, questionIdx: number) => {
    setEditingQuestion(question);
    setEditingSectionIdx(sectionIdx);
    setEditingQuestionIdx(questionIdx);
    setIsEditingQuestion(true);
  };

  // Color mapping for framework alignments
  const getAlignmentColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800 border-green-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const columns: Column<Framework>[] = [
    {
      id: 'name',
      header: 'Framework Name',
      accessor: (framework) => (
        <div>
          <div className="font-medium text-gray-900">{framework.name}</div>
          <div className="text-sm text-gray-500">{framework.description}</div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'version',
      header: 'Version',
      accessor: (framework) => (
        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
          v{framework.version}
        </span>
      ),
      width: 'w-24'
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (framework) => {
        const statusColors: Record<string, string> = {
          active: 'bg-green-100 text-green-800',
          draft: 'bg-yellow-100 text-yellow-800',
          archived: 'bg-gray-100 text-gray-800',
          deprecated: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[framework.status]}`}>
            {framework.status}
          </span>
        );
      },
      width: 'w-32'
    },
    {
      id: 'questions',
      header: 'Questions',
      accessor: (framework) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{framework.totalQuestions} total</div>
          <div className="text-gray-500">{framework.requiredQuestions} required</div>
        </div>
      ),
      width: 'w-32'
    },
    {
      id: 'usage',
      header: 'Usage',
      accessor: (framework) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{framework.usageCount || 0} observations</div>
          <div className="text-gray-500">~{framework.estimatedDuration} min</div>
        </div>
      ),
      width: 'w-36'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
        <p className="text-gray-600">Loading frameworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Frameworks</h3>
            <p className="text-red-700 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Framework Management</h1>
          <p className="mt-2 text-gray-600">
            View and manage observation frameworks • Connected to Firestore
          </p>
        </div>
      </div>

      {/* Frameworks List */}
      {frameworks.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={frameworks}
            searchPlaceholder="Search frameworks..."
            onRowClick={(framework) => {
              setSelectedFramework(framework);
              setIsEditing(false);
              // Auto-expand first section
              if (framework.sections.length > 0) {
                setExpandedSections(new Set([framework.sections[0].id]));
              }
            }}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">No frameworks found</p>
          <p className="text-gray-500 mt-2">Check Firestore or run the migration script</p>
        </div>
      )}

      {/* Framework Detail Viewer */}
      {selectedFramework && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Framework Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{selectedFramework.name}</h2>
                <button
                  onClick={openEditFramework}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit framework"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-gray-600">{selectedFramework.description}</p>

              {/* Framework Stats */}
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {selectedFramework.totalQuestions} questions
                    ({selectedFramework.requiredQuestions} required)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedFramework.usageCount || 0} observations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">v{selectedFramework.version}</span>
                </div>
              </div>

              {/* Framework Tags */}
              {selectedFramework.tags && selectedFramework.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFramework.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedFramework(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Framework Sections
              <span className="text-sm font-normal text-gray-500">
                ({selectedFramework.sections.length} section{selectedFramework.sections.length !== 1 ? 's' : ''})
              </span>
            </h3>

            {selectedFramework.sections.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No sections defined</p>
                <p className="text-gray-500 text-sm mt-2">This framework doesn't have any sections yet</p>
              </div>
            ) : (
              selectedFramework.sections.map((section, sectionIdx) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-100 transition-colors -m-4 p-4 rounded-l-lg"
                      onClick={() => toggleSection(section.id)}
                    >
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{section.title}</h4>
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            Section {sectionIdx + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">{section.questions?.length || 0} questions</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditSection(section, sectionIdx);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit section"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Content (Questions) */}
                  {expandedSections.has(section.id) && (
                    <div className="p-6 space-y-4 bg-white">
                      {!section.questions || section.questions.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-600 text-sm">No questions in this section</p>
                        </div>
                      ) : (
                        section.questions.map((question, idx) => (
                          <div
                            key={question.id}
                            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors relative"
                          >
                            {/* Edit Button */}
                            <button
                              onClick={() => openEditQuestion(question, sectionIdx, idx)}
                              className="absolute top-4 right-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit question"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Question Number & Text */}
                            <div className="flex items-start gap-3 mb-3 pr-12">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold">
                                {question.order || idx + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-900 font-medium">{question.text}</p>
                                {question.description && (
                                  <p className="text-sm text-gray-600 mt-1">{question.description}</p>
                                )}
                              </div>
                            </div>

                            {/* Help Text */}
                            {question.helpText && (
                              <div className="ml-11 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-sm text-blue-900">
                                  <span className="font-semibold">Look for:</span> {question.helpText}
                                </p>
                              </div>
                            )}

                            {/* Examples */}
                            {question.examples && question.examples.length > 0 && (
                              <div className="ml-11 mb-3">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Examples:</p>
                                <ul className="space-y-1">
                                  {question.examples.map((example, exIdx) => (
                                    <li key={exIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                      <span className="text-blue-600 font-bold">•</span>
                                      <span>{example}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Framework Alignments */}
                            {question.frameworkAlignments && question.frameworkAlignments.length > 0 && (
                              <div className="ml-11">
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                  Framework Alignments ({question.frameworkAlignments.length}):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {question.frameworkAlignments.map((alignment) => (
                                    <span
                                      key={alignment.id}
                                      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getAlignmentColorClasses(
                                        alignment.color
                                      )}`}
                                    >
                                      {alignment.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Question Metadata */}
                            <div className="ml-11 mt-3 flex items-center gap-4 text-xs text-gray-500">
                              {question.isRequired && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  Required
                                </span>
                              )}
                              {question.scale && (
                                <span>
                                  Scale: {question.scale.name} ({question.scale.min}-{question.scale.max})
                                </span>
                              )}
                              {question.weight && <span>Weight: {question.weight}</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Framework Alignments Summary */}
          {selectedFramework.alignments && selectedFramework.alignments.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Framework Alignments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedFramework.alignments.map((alignment) => (
                  <div key={alignment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="font-medium text-gray-900">{alignment.name}</div>
                    <div className="text-sm text-gray-600">{alignment.category}</div>
                    {alignment.description && (
                      <div className="text-xs text-gray-500 mt-1">{alignment.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedFramework && frameworks.length > 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Select a framework to view details</p>
          <p className="text-gray-500 mt-2">Click on a framework above to see sections and questions</p>
        </div>
      )}

      {/* Edit Framework Modal */}
      {isEditingFramework && selectedFramework && (
        <EditFrameworkModal
          framework={selectedFramework}
          onSave={handleSaveFramework}
          onClose={() => setIsEditingFramework(false)}
        />
      )}

      {/* Edit Section Modal */}
      {isEditingSection && editingSection && (
        <EditSectionModal
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => {
            setIsEditingSection(false);
            setEditingSection(null);
            setEditingSectionIdx(null);
          }}
        />
      )}

      {/* Edit Question Modal */}
      {isEditingQuestion && editingQuestion && selectedFramework && (
        <EditQuestionModal
          question={editingQuestion}
          availableAlignments={selectedFramework.alignments || []}
          onSave={handleSaveQuestion}
          onClose={() => {
            setIsEditingQuestion(false);
            setEditingQuestion(null);
            setEditingQuestionIdx(null);
            setEditingSectionIdx(null);
          }}
          getAlignmentColorClasses={getAlignmentColorClasses}
        />
      )}
    </div>
  );
}

// Edit Framework Modal Component
function EditFrameworkModal({
  framework,
  onSave,
  onClose
}: {
  framework: Framework;
  onSave: (updates: Partial<Framework>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(framework.name);
  const [description, setDescription] = useState(framework.description);
  const [version, setVersion] = useState(framework.version);
  const [status, setStatus] = useState(framework.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, version, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Edit Framework</h3>
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
                Framework Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Section Modal Component
function EditSectionModal({
  section,
  onSave,
  onClose
}: {
  section: FrameworkSection;
  onSave: (section: FrameworkSection) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...section, title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Edit Section</h3>
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
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Question Modal Component
function EditQuestionModal({
  question,
  availableAlignments,
  onSave,
  onClose,
  getAlignmentColorClasses
}: {
  question: Question;
  availableAlignments: FrameworkAlignment[];
  onSave: (question: Question) => void;
  onClose: () => void;
  getAlignmentColorClasses: (color: string) => string;
}) {
  const [text, setText] = useState(question.text);
  const [description, setDescription] = useState(question.description || '');
  const [helpText, setHelpText] = useState(question.helpText || '');
  const [examples, setExamples] = useState<string[]>(question.examples || []);
  const [selectedAlignments, setSelectedAlignments] = useState<FrameworkAlignment[]>(
    question.frameworkAlignments || []
  );
  const [isRequired, setIsRequired] = useState(question.isRequired || false);
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
    onSave({
      ...question,
      text,
      description,
      helpText,
      examples,
      frameworkAlignments: selectedAlignments,
      isRequired
    });
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
            <h3 className="text-xl font-bold text-gray-900">Edit Question</h3>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                rows={2}
                placeholder="E.g., Student discussions about personal experiences, cultural connections..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddExample}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Framework Alignments */}
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

            {/* Required Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
