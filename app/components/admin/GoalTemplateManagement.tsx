import { useState } from 'react';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Loader2,
  AlertCircle,
  Copy,
  Archive,
  Calendar,
  Users,
  BookOpen,
  Star,
  Heart,
  Briefcase,
  FileText
} from 'lucide-react';
import {
  useGoalTemplates,
  useCreateGoalTemplate,
  useUpdateGoalTemplate,
  useDeleteGoalTemplate,
  useArchiveGoalTemplate,
  useDuplicateGoalTemplate
} from '../../hooks/useGoals';
import { useAuthStore } from '../../stores/auth';
import DataTable, { type Column } from '../common/DataTable';
import type {
  GoalTemplate,
  GoalType,
  GoalTemplateField,
  DefaultMilestone,
  SuggestedMeasurement,
  ReflectionPrompt,
  FieldType
} from '../../types';

// Icon mapping for goal types
const GoalTypeIcons: Record<GoalType, React.ElementType> = {
  professional: Briefcase,
  instructional: BookOpen,
  student_outcome: Users,
  leadership: Star,
  personal: Heart
};

// Color mapping for goal types
const GoalTypeColors: Record<GoalType, string> = {
  professional: 'bg-blue-100 text-blue-800 border-blue-200',
  instructional: 'bg-green-100 text-green-800 border-green-200',
  student_outcome: 'bg-purple-100 text-purple-800 border-purple-200',
  leadership: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  personal: 'bg-pink-100 text-pink-800 border-pink-200'
};

export default function GoalTemplateManagement() {
  const user = useAuthStore(state => state.user);
  const { data: templates = [], isLoading, error } = useGoalTemplates({
    schoolId: user?.schoolId
  });
  const createTemplate = useCreateGoalTemplate();
  const updateTemplate = useUpdateGoalTemplate();
  const deleteTemplate = useDeleteGoalTemplate();
  const archiveTemplate = useArchiveGoalTemplate();
  const duplicateTemplate = useDuplicateGoalTemplate();

  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['fields', 'milestones']));

  // Modal states
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [isAddingField, setIsAddingField] = useState(false);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);

  const [editingField, setEditingField] = useState<GoalTemplateField | null>(null);
  const [editingFieldIdx, setEditingFieldIdx] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_editingMilestone, _setEditingMilestone] = useState<DefaultMilestone | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_editingMilestoneIdx, _setEditingMilestoneIdx] = useState<number | null>(null);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Handle template creation
  const handleCreateTemplate = async (templateData: Partial<GoalTemplate>) => {
    try {
      const created = await createTemplate.mutateAsync({
        ...templateData,
        schoolId: user?.schoolId,
        createdBy: user?.id,
        fields: [],
        sections: [],
        defaultMilestones: [],
        suggestedMeasurements: [],
        reflectionPrompts: [],
        frameworkAlignments: [],
        applicableDivisions: [],
        applicableRoles: [],
        requiresApproval: false,
        approverRoles: [],
        defaultDuration: 90,
      });
      setSelectedTemplate(created);
      setIsCreatingTemplate(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to create template:', err);
      }
      alert('Failed to create template');
    }
  };

  // Handle template update
  const handleUpdateTemplate = async (updates: Partial<GoalTemplate>) => {
    if (!selectedTemplate) return;

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: updates
      });
      setSelectedTemplate({ ...selectedTemplate, ...updates });
      setIsEditingTemplate(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to update template:', err);
      }
      alert('Failed to save template changes');
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTemplate.mutateAsync(id);
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete template:', err);
      }
      alert('Failed to delete template');
    }
  };

  // Handle template archive
  const handleArchiveTemplate = async (id: string) => {
    try {
      await archiveTemplate.mutateAsync(id);
      if (selectedTemplate?.id === id) {
        setSelectedTemplate({ ...selectedTemplate, status: 'archived' });
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to archive template:', err);
      }
      alert('Failed to archive template');
    }
  };

  // Handle template duplication
  const handleDuplicateTemplate = async (id: string, name: string) => {
    try {
      const duplicated = await duplicateTemplate.mutateAsync({
        id,
        newName: `${name} (Copy)`
      });
      setSelectedTemplate(duplicated);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to duplicate template:', err);
      }
      alert('Failed to duplicate template');
    }
  };

  // Handle adding a field
  const handleAddField = async (field: Omit<GoalTemplateField, 'id'>) => {
    if (!selectedTemplate) return;

    const fieldWithId: GoalTemplateField = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedFields = [...(selectedTemplate.fields || []), fieldWithId];

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { fields: updatedFields }
      });
      setSelectedTemplate({ ...selectedTemplate, fields: updatedFields });
      setIsAddingField(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to add field:', err);
      }
      alert('Failed to add field');
    }
  };

  // Handle updating a field
  const handleUpdateField = async (updatedField: GoalTemplateField, idx: number) => {
    if (!selectedTemplate) return;

    const updatedFields = [...selectedTemplate.fields];
    updatedFields[idx] = updatedField;

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { fields: updatedFields }
      });
      setSelectedTemplate({ ...selectedTemplate, fields: updatedFields });
      setEditingField(null);
      setEditingFieldIdx(null);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to update field:', err);
      }
      alert('Failed to update field');
    }
  };

  // Handle deleting a field
  const handleDeleteField = async (idx: number) => {
    if (!selectedTemplate) return;

    const field = selectedTemplate.fields[idx];
    if (!confirm(`Delete field "${field.label}"?`)) return;

    const updatedFields = selectedTemplate.fields.filter((_, i) => i !== idx);

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { fields: updatedFields }
      });
      setSelectedTemplate({ ...selectedTemplate, fields: updatedFields });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete field:', err);
      }
      alert('Failed to delete field');
    }
  };

  // Handle adding a milestone
  const handleAddMilestone = async (milestone: Omit<DefaultMilestone, 'id'>) => {
    if (!selectedTemplate) return;

    const milestoneWithId: DefaultMilestone = {
      ...milestone,
      id: `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedMilestones = [...(selectedTemplate.defaultMilestones || []), milestoneWithId];

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { defaultMilestones: updatedMilestones }
      });
      setSelectedTemplate({ ...selectedTemplate, defaultMilestones: updatedMilestones });
      setIsAddingMilestone(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to add milestone:', err);
      }
      alert('Failed to add milestone');
    }
  };

  // Handle deleting a milestone
  const handleDeleteMilestone = async (idx: number) => {
    if (!selectedTemplate) return;

    const milestone = selectedTemplate.defaultMilestones[idx];
    if (!confirm(`Delete milestone "${milestone.title}"?`)) return;

    const updatedMilestones = selectedTemplate.defaultMilestones.filter((_, i) => i !== idx);

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { defaultMilestones: updatedMilestones }
      });
      setSelectedTemplate({ ...selectedTemplate, defaultMilestones: updatedMilestones });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete milestone:', err);
      }
      alert('Failed to delete milestone');
    }
  };

  // Handle adding a measurement
  const handleAddMeasurement = async (measurement: Omit<SuggestedMeasurement, 'id'>) => {
    if (!selectedTemplate) return;

    const measurementWithId: SuggestedMeasurement = {
      ...measurement,
      id: `measurement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedMeasurements = [...(selectedTemplate.suggestedMeasurements || []), measurementWithId];

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { suggestedMeasurements: updatedMeasurements }
      });
      setSelectedTemplate({ ...selectedTemplate, suggestedMeasurements: updatedMeasurements });
      setIsAddingMeasurement(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to add measurement:', err);
      }
      alert('Failed to add measurement');
    }
  };

  // Handle deleting a measurement
  const handleDeleteMeasurement = async (idx: number) => {
    if (!selectedTemplate) return;

    const measurement = selectedTemplate.suggestedMeasurements[idx];
    if (!confirm(`Delete measurement "${measurement.metric}"?`)) return;

    const updatedMeasurements = selectedTemplate.suggestedMeasurements.filter((_, i) => i !== idx);

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { suggestedMeasurements: updatedMeasurements }
      });
      setSelectedTemplate({ ...selectedTemplate, suggestedMeasurements: updatedMeasurements });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete measurement:', err);
      }
      alert('Failed to delete measurement');
    }
  };

  // Handle adding a reflection prompt
  const handleAddPrompt = async (prompt: Omit<ReflectionPrompt, 'id'>) => {
    if (!selectedTemplate) return;

    const promptWithId: ReflectionPrompt = {
      ...prompt,
      id: `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedPrompts = [...(selectedTemplate.reflectionPrompts || []), promptWithId];

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { reflectionPrompts: updatedPrompts }
      });
      setSelectedTemplate({ ...selectedTemplate, reflectionPrompts: updatedPrompts });
      setIsAddingPrompt(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to add prompt:', err);
      }
      alert('Failed to add prompt');
    }
  };

  // Handle deleting a prompt
  const handleDeletePrompt = async (idx: number) => {
    if (!selectedTemplate) return;

    if (!confirm(`Delete prompt?`)) return;

    const updatedPrompts = selectedTemplate.reflectionPrompts.filter((_, i) => i !== idx);

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        data: { reflectionPrompts: updatedPrompts }
      });
      setSelectedTemplate({ ...selectedTemplate, reflectionPrompts: updatedPrompts });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete prompt:', err);
      }
      alert('Failed to delete prompt');
    }
  };

  // Table columns
  const columns: Column<GoalTemplate>[] = [
    {
      id: 'name',
      header: 'Template Name',
      accessor: (template) => {
        const Icon = GoalTypeIcons[template.type];
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${GoalTypeColors[template.type].split(' ')[0]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{template.name}</div>
              <div className="text-sm text-gray-500">{template.description}</div>
            </div>
          </div>
        );
      },
      sortable: true
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (template) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${GoalTypeColors[template.type]}`}>
          {template.type.replace('_', ' ')}
        </span>
      ),
      width: 'w-36'
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (template) => {
        const statusColors: Record<string, string> = {
          active: 'bg-green-100 text-green-800',
          draft: 'bg-yellow-100 text-yellow-800',
          archived: 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[template.status]}`}>
            {template.status}
          </span>
        );
      },
      width: 'w-28'
    },
    {
      id: 'fields',
      header: 'Fields',
      accessor: (template) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{template.fields?.length || 0} fields</div>
          <div className="text-gray-500">{template.defaultMilestones?.length || 0} milestones</div>
        </div>
      ),
      width: 'w-28'
    },
    {
      id: 'usage',
      header: 'Usage',
      accessor: (template) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{template.usageCount || 0} goals</div>
          <div className="text-gray-500">{template.defaultDuration} days</div>
        </div>
      ),
      width: 'w-28'
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (template) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicateTemplate(template.id, template.name);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleArchiveTemplate(template.id);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTemplate(template.id, template.name);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      width: 'w-32'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600 mr-3" />
        <p className="text-gray-600">Loading goal templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Templates</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Goal Template Management</h1>
          <p className="mt-2 text-gray-600">
            Create and manage SMART goal templates for your organization
          </p>
        </div>
        <button
          onClick={() => setIsCreatingTemplate(true)}
          className="px-6 py-3 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Templates List */}
      {templates.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={templates}
            searchPlaceholder="Search templates..."
            onRowClick={(template) => {
              setSelectedTemplate(template);
              setExpandedSections(new Set(['fields', 'milestones']));
            }}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">No goal templates found</p>
          <p className="text-gray-500 mt-2">Create your first goal template to get started</p>
          <button
            onClick={() => setIsCreatingTemplate(true)}
            className="mt-4 px-6 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>
      )}

      {/* Template Detail View */}
      {selectedTemplate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Template Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = GoalTypeIcons[selectedTemplate.type];
                  return (
                    <div className={`p-3 rounded-xl ${GoalTypeColors[selectedTemplate.type].split(' ')[0]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="mt-1 text-gray-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setIsEditingTemplate(true)}
                  className="p-2 text-sas-navy-600 hover:bg-sas-navy-50 rounded-lg transition-colors ml-2"
                  title="Edit template"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {/* Template Stats */}
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedTemplate.fields?.length || 0} fields</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedTemplate.defaultMilestones?.length || 0} milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedTemplate.defaultDuration} day duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedTemplate.usageCount || 0} goals created</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTemplate(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fields Section */}
          <CollapsibleSection
            title="Form Fields"
            subtitle={`${selectedTemplate.fields?.length || 0} field${selectedTemplate.fields?.length !== 1 ? 's' : ''}`}
            isExpanded={expandedSections.has('fields')}
            onToggle={() => toggleSection('fields')}
            onAdd={() => setIsAddingField(true)}
            addLabel="Add Field"
          >
            {!selectedTemplate.fields || selectedTemplate.fields.length === 0 ? (
              <EmptyState message="No fields defined" hint="Add fields to customize what information is collected" />
            ) : (
              <div className="space-y-3">
                {selectedTemplate.fields.map((field, idx) => (
                  <div key={field.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{field.label}</span>
                          {field.required && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Required</span>
                          )}
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">{field.type}</span>
                        </div>
                        {field.description && (
                          <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                        )}
                        {field.helpText && (
                          <p className="text-xs text-gray-500 mt-1">Help: {field.helpText}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingField(field);
                            setEditingFieldIdx(idx);
                          }}
                          className="p-2 text-sas-navy-600 hover:bg-sas-navy-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteField(idx)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Milestones Section */}
          <CollapsibleSection
            title="Default Milestones"
            subtitle={`${selectedTemplate.defaultMilestones?.length || 0} milestone${selectedTemplate.defaultMilestones?.length !== 1 ? 's' : ''}`}
            isExpanded={expandedSections.has('milestones')}
            onToggle={() => toggleSection('milestones')}
            onAdd={() => setIsAddingMilestone(true)}
            addLabel="Add Milestone"
          >
            {!selectedTemplate.defaultMilestones || selectedTemplate.defaultMilestones.length === 0 ? (
              <EmptyState message="No default milestones" hint="Add milestones that will be created automatically with each goal" />
            ) : (
              <div className="space-y-3">
                {selectedTemplate.defaultMilestones.map((milestone, idx) => (
                  <div key={milestone.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 flex items-center justify-center bg-sas-navy-600 text-white rounded-full text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-gray-900">{milestone.title}</span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                            Day {milestone.offsetDays}
                          </span>
                          {milestone.isRequired && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Required</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 ml-8">{milestone.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMilestone(idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Measurements Section */}
          <CollapsibleSection
            title="Suggested Measurements"
            subtitle={`${selectedTemplate.suggestedMeasurements?.length || 0} measurement${selectedTemplate.suggestedMeasurements?.length !== 1 ? 's' : ''}`}
            isExpanded={expandedSections.has('measurements')}
            onToggle={() => toggleSection('measurements')}
            onAdd={() => setIsAddingMeasurement(true)}
            addLabel="Add Measurement"
          >
            {!selectedTemplate.suggestedMeasurements || selectedTemplate.suggestedMeasurements.length === 0 ? (
              <EmptyState message="No suggested measurements" hint="Add measurements to help track goal progress" />
            ) : (
              <div className="space-y-3">
                {selectedTemplate.suggestedMeasurements.map((measurement, idx) => (
                  <div key={measurement.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{measurement.metric}</span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                            {measurement.measurementType}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                            {measurement.frequency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{measurement.description}</p>
                        {measurement.unit && (
                          <p className="text-xs text-gray-500 mt-1">Unit: {measurement.unit}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteMeasurement(idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Reflection Prompts Section */}
          <CollapsibleSection
            title="Reflection Prompts"
            subtitle={`${selectedTemplate.reflectionPrompts?.length || 0} prompt${selectedTemplate.reflectionPrompts?.length !== 1 ? 's' : ''}`}
            isExpanded={expandedSections.has('prompts')}
            onToggle={() => toggleSection('prompts')}
            onAdd={() => setIsAddingPrompt(true)}
            addLabel="Add Prompt"
          >
            {!selectedTemplate.reflectionPrompts || selectedTemplate.reflectionPrompts.length === 0 ? (
              <EmptyState message="No reflection prompts" hint="Add prompts to guide user reflections throughout the goal" />
            ) : (
              <div className="space-y-3">
                {selectedTemplate.reflectionPrompts.map((prompt, idx) => (
                  <div key={prompt.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                            {prompt.frequency}
                          </span>
                          {prompt.isRequired && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Required</span>
                          )}
                        </div>
                        <p className="text-gray-900">{prompt.prompt}</p>
                        {prompt.description && (
                          <p className="text-sm text-gray-500 mt-1">{prompt.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeletePrompt(idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Configuration Section */}
          <CollapsibleSection
            title="Workflow Configuration"
            subtitle="Approval and access settings"
            isExpanded={expandedSections.has('config')}
            onToggle={() => toggleSection('config')}
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Requires Approval</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedTemplate.requiresApproval
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedTemplate.requiresApproval ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 block mb-2">Default Duration</span>
                  <span className="text-2xl font-bold text-gray-900">{selectedTemplate.defaultDuration} days</span>
                </div>
              </div>
              <div className="space-y-4">
                {selectedTemplate.applicableDivisions && selectedTemplate.applicableDivisions.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 block mb-2">Applicable Divisions</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.applicableDivisions.map((div) => (
                        <span key={div} className="px-2 py-1 text-xs font-medium bg-white border border-gray-200 rounded">
                          {div}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTemplate.frameworkAlignments && selectedTemplate.frameworkAlignments.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 block mb-2">Framework Alignments</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.frameworkAlignments.map((fw) => (
                        <span key={fw} className="px-2 py-1 text-xs font-medium bg-sas-navy-100 text-blue-800 rounded">
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Empty State */}
      {!selectedTemplate && templates.length > 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Select a template to view details</p>
          <p className="text-gray-500 mt-2">Click on a template above to see and edit its configuration</p>
        </div>
      )}

      {/* Create Template Modal */}
      {isCreatingTemplate && (
        <CreateTemplateModal
          onSave={handleCreateTemplate}
          onClose={() => setIsCreatingTemplate(false)}
        />
      )}

      {/* Edit Template Modal */}
      {isEditingTemplate && selectedTemplate && (
        <EditTemplateModal
          template={selectedTemplate}
          onSave={handleUpdateTemplate}
          onClose={() => setIsEditingTemplate(false)}
        />
      )}

      {/* Add Field Modal */}
      {isAddingField && (
        <AddFieldModal
          onSave={handleAddField}
          onClose={() => setIsAddingField(false)}
        />
      )}

      {/* Edit Field Modal */}
      {editingField && editingFieldIdx !== null && (
        <EditFieldModal
          field={editingField}
          onSave={(field) => handleUpdateField(field, editingFieldIdx)}
          onClose={() => {
            setEditingField(null);
            setEditingFieldIdx(null);
          }}
        />
      )}

      {/* Add Milestone Modal */}
      {isAddingMilestone && (
        <AddMilestoneModal
          onSave={handleAddMilestone}
          onClose={() => setIsAddingMilestone(false)}
        />
      )}

      {/* Add Measurement Modal */}
      {isAddingMeasurement && (
        <AddMeasurementModal
          onSave={handleAddMeasurement}
          onClose={() => setIsAddingMeasurement(false)}
        />
      )}

      {/* Add Prompt Modal */}
      {isAddingPrompt && (
        <AddPromptModal
          onSave={handleAddPrompt}
          onClose={() => setIsAddingPrompt(false)}
        />
      )}
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  subtitle,
  isExpanded,
  onToggle,
  onAdd,
  addLabel,
  children
}: {
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {onAdd && addLabel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="p-6 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

// Empty State Component
function EmptyState({ message, hint }: { message: string; hint: string }) {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-gray-500 text-sm mt-1">{hint}</p>
    </div>
  );
}

// Create Template Modal
function CreateTemplateModal({
  onSave,
  onClose
}: {
  onSave: (data: Partial<GoalTemplate>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('professional');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, type, status: 'draft' });
  };

  return (
    <Modal title="Create Goal Template" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as GoalType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            >
              <option value="professional">Professional Development</option>
              <option value="instructional">Instructional Practice</option>
              <option value="student_outcome">Student Outcomes</option>
              <option value="leadership">Leadership Development</option>
              <option value="personal">Personal Growth</option>
            </select>
          </div>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Create Template" />
      </form>
    </Modal>
  );
}

// Edit Template Modal
function EditTemplateModal({
  template,
  onSave,
  onClose
}: {
  template: GoalTemplate;
  onSave: (data: Partial<GoalTemplate>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description);
  const [type, setType] = useState<GoalType>(template.type);
  const [status, setStatus] = useState(template.status);
  const [defaultDuration, setDefaultDuration] = useState(template.defaultDuration);
  const [requiresApproval, setRequiresApproval] = useState(template.requiresApproval);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, type, status, defaultDuration, requiresApproval });
  };

  return (
    <Modal title="Edit Goal Template" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GoalType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              >
                <option value="professional">Professional Development</option>
                <option value="instructional">Instructional Practice</option>
                <option value="student_outcome">Student Outcomes</option>
                <option value="leadership">Leadership Development</option>
                <option value="personal">Personal Growth</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'draft' | 'archived')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Duration (days)</label>
            <input
              type="number"
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 90)}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiresApproval"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
              className="w-4 h-4 text-sas-navy-600 border-gray-300 rounded focus:ring-sas-navy-500"
            />
            <label htmlFor="requiresApproval" className="text-sm font-medium text-gray-700">
              Requires supervisor approval
            </label>
          </div>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Changes" />
      </form>
    </Modal>
  );
}

// Add Field Modal
function AddFieldModal({
  onSave,
  onClose
}: {
  onSave: (field: Omit<GoalTemplateField, 'id'>) => void;
  onClose: () => void;
}) {
  const [name] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(false);
  const [order] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: name || label.toLowerCase().replace(/\s+/g, '_'), label, type, description, required, order });
  };

  return (
    <Modal title="Add Field" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label *</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Target Outcome"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FieldType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            >
              <option value="text">Text (Single line)</option>
              <option value="textarea">Text Area (Multi-line)</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Dropdown Select</option>
              <option value="multiselect">Multi-Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="user_select">User Select</option>
              <option value="framework_select">Framework Select</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description / Help Text</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="w-4 h-4 text-sas-navy-600 border-gray-300 rounded focus:ring-sas-navy-500"
            />
            <label htmlFor="required" className="text-sm font-medium text-gray-700">Required field</label>
          </div>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Add Field" />
      </form>
    </Modal>
  );
}

// Edit Field Modal (simplified - same as Add but with existing values)
function EditFieldModal({
  field,
  onSave,
  onClose
}: {
  field: GoalTemplateField;
  onSave: (field: GoalTemplateField) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(field.label);
  const [type, setType] = useState<FieldType>(field.type);
  const [description, setDescription] = useState(field.description || '');
  const [required, setRequired] = useState(field.required);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...field, label, type, description, required });
  };

  return (
    <Modal title="Edit Field" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label *</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FieldType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            >
              <option value="text">Text (Single line)</option>
              <option value="textarea">Text Area (Multi-line)</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Dropdown Select</option>
              <option value="multiselect">Multi-Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="user_select">User Select</option>
              <option value="framework_select">Framework Select</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="w-4 h-4 text-sas-navy-600 border-gray-300 rounded focus:ring-sas-navy-500"
            />
            <label htmlFor="required" className="text-sm font-medium text-gray-700">Required field</label>
          </div>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Save Field" />
      </form>
    </Modal>
  );
}

// Add Milestone Modal
function AddMilestoneModal({
  onSave,
  onClose
}: {
  onSave: (milestone: Omit<DefaultMilestone, 'id'>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offsetDays, setOffsetDays] = useState(30);
  const [isRequired, setIsRequired] = useState(false);
  const [order] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, offsetDays, isRequired, suggestedEvidence: [], order });
  };

  return (
    <Modal title="Add Default Milestone" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete initial research"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Days from Start</label>
            <input
              type="number"
              value={offsetDays}
              onChange={(e) => setOffsetDays(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Target date will be this many days after the goal start date</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 text-sas-navy-600 border-gray-300 rounded focus:ring-sas-navy-500"
            />
            <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">Required milestone</label>
          </div>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Add Milestone" />
      </form>
    </Modal>
  );
}

// Add Measurement Modal
function AddMeasurementModal({
  onSave,
  onClose
}: {
  onSave: (measurement: Omit<SuggestedMeasurement, 'id'>) => void;
  onClose: () => void;
}) {
  const [metric, setMetric] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [measurementType, setMeasurementType] = useState<'quantitative' | 'qualitative' | 'binary'>('quantitative');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'end_of_goal'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ metric, description, unit, measurementType, frequency });
  };

  return (
    <Modal title="Add Suggested Measurement" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metric Name *</label>
            <input
              type="text"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="e.g., Student engagement score"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Type</label>
              <select
                value={measurementType}
                onChange={(e) => setMeasurementType(e.target.value as typeof measurementType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              >
                <option value="quantitative">Quantitative (Number)</option>
                <option value="qualitative">Qualitative (Text)</option>
                <option value="binary">Binary (Yes/No)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="end_of_goal">End of Goal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit (optional)</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., percentage, count, rating"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Add Measurement" />
      </form>
    </Modal>
  );
}

// Add Prompt Modal
function AddPromptModal({
  onSave,
  onClose
}: {
  onSave: (prompt: Omit<ReflectionPrompt, 'id'>) => void;
  onClose: () => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'milestone' | 'weekly' | 'monthly' | 'custom'>('monthly');
  const [isRequired, setIsRequired] = useState(false);
  const [order] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prompt, description, frequency, isRequired, order });
  };

  return (
    <Modal title="Add Reflection Prompt" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt *</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g., What progress have you made toward your goal this month?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as typeof frequency)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
            >
              <option value="milestone">At each milestone</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 text-sas-navy-600 border-gray-300 rounded focus:ring-sas-navy-500"
            />
            <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">Required reflection</label>
          </div>
        </div>
        <ModalFooter onClose={onClose} submitLabel="Add Prompt" />
      </form>
    </Modal>
  );
}

// Generic Modal Component
function Modal({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Modal Footer Component
function ModalFooter({
  onClose,
  submitLabel
}: {
  onClose: () => void;
  submitLabel: string;
}) {
  return (
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
        {submitLabel}
      </button>
    </div>
  );
}
