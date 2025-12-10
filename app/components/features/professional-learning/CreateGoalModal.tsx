import React, { useState, useMemo } from 'react';
import {
  X,
  Target,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Calendar,
  BookOpen,
  Users,
  Star,
  Heart,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { useCreateGoalFromTemplate, useGoalTemplate } from '../../../hooks/useGoals';
import { useAuthStore } from '../../../stores/auth';
import type { GoalTemplate, GoalType, GoalTemplateField, FieldType } from '../../../types';

interface CreateGoalModalProps {
  templates: GoalTemplate[];
  onClose: () => void;
  preselectedTemplateId?: string;
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

type Step = 'select-template' | 'fill-details' | 'review';

export default function CreateGoalModal({ templates, onClose, preselectedTemplateId }: CreateGoalModalProps) {
  const user = useAuthStore(state => state.user);
  const createGoalMutation = useCreateGoalFromTemplate();

  const [step, setStep] = useState<Step>(preselectedTemplateId ? 'fill-details' : 'select-template');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(preselectedTemplateId || null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get selected template details
  const { data: selectedTemplate, isLoading: isLoadingTemplate } = useGoalTemplate(selectedTemplateId || '');

  // Group templates by type
  const templatesByType = useMemo(() => {
    const grouped: Record<GoalType, GoalTemplate[]> = {
      professional: [],
      instructional: [],
      student_outcome: [],
      leadership: [],
      personal: []
    };
    templates.forEach(template => {
      if (grouped[template.type]) {
        grouped[template.type].push(template);
      }
    });
    return grouped;
  }, [templates]);

  // Calculate default dates based on template
  const defaultStartDate = new Date().toISOString().split('T')[0];
  const defaultTargetDate = useMemo(() => {
    if (selectedTemplate?.defaultDuration) {
      const target = new Date();
      target.setDate(target.getDate() + selectedTemplate.defaultDuration);
      return target.toISOString().split('T')[0];
    }
    // Default to 90 days
    const target = new Date();
    target.setDate(target.getDate() + 90);
    return target.toISOString().split('T')[0];
  }, [selectedTemplate]);

  // Initialize form with default values when template is selected
  React.useEffect(() => {
    if (selectedTemplate) {
      const defaults: Record<string, unknown> = {
        title: '',
        description: '',
        priority: 'medium',
        startDate: defaultStartDate,
        targetDate: defaultTargetDate,
      };
      // Add field defaults
      selectedTemplate.fields?.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaults[field.name] = field.defaultValue;
        }
      });
      setFormValues(prev => ({ ...defaults, ...prev }));
    }
  }, [selectedTemplate, defaultStartDate, defaultTargetDate]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setStep('fill-details');
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required core fields
    if (!formValues.title || (formValues.title as string).trim() === '') {
      newErrors.title = 'Goal title is required';
    }
    if (!formValues.description || (formValues.description as string).trim() === '') {
      newErrors.description = 'Goal description is required';
    }
    if (!formValues.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formValues.targetDate) {
      newErrors.targetDate = 'Target date is required';
    }
    if (formValues.startDate && formValues.targetDate && new Date(formValues.targetDate as string) <= new Date(formValues.startDate as string)) {
      newErrors.targetDate = 'Target date must be after start date';
    }

    // Validate template-specific required fields
    selectedTemplate?.fields?.forEach(field => {
      if (field.required && !formValues[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      // Additional validations based on field type
      if (formValues[field.name]) {
        if (field.minLength && (formValues[field.name] as string).length < field.minLength) {
          newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
        }
        if (field.maxLength && (formValues[field.name] as string).length > field.maxLength) {
          newErrors[field.name] = `${field.label} must be less than ${field.maxLength} characters`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'fill-details') {
      if (validateForm()) {
        setStep('review');
      }
    }
  };

  const handleBack = () => {
    if (step === 'fill-details') {
      setStep('select-template');
    } else if (step === 'review') {
      setStep('fill-details');
    }
  };

  const handleSubmit = async () => {
    if (!selectedTemplateId || !selectedTemplate) return;

    const goalData = {
      title: formValues.title as string,
      description: formValues.description as string,
      type: selectedTemplate.type,
      priority: (formValues.priority as 'low' | 'medium' | 'high' | 'critical') || 'medium',
      startDate: new Date(formValues.startDate as string),
      targetDate: new Date(formValues.targetDate as string),
      schoolId: user?.schoolId || '',
      fieldValues: { ...formValues },
      status: selectedTemplate.requiresApproval ? 'draft' as const : 'active' as const,
      progress: 0,
      collaboratorIds: [],
      frameworkAlignments: selectedTemplate.frameworkAlignments || [],
      relatedObservationIds: [],
    };

    try {
      await createGoalMutation.mutateAsync({
        templateId: selectedTemplateId,
        goalData,
      });
      onClose();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to create goal:', error);
      }
    }
  };

  const renderField = (field: GoalTemplateField) => {
    const value = formValues[field.name] ?? '';
    const error = errors[field.name];

    const baseInputClasses = `w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent ${
      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

    switch (field.type as FieldType) {
      case 'text':
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            maxLength={field.maxLength}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${baseInputClasses} min-h-[100px]`}
            maxLength={field.maxLength}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => handleFieldChange(field.name, Number(e.target.value))}
            placeholder={field.placeholder}
            className={baseInputClasses}
            min={field.min}
            max={field.max}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select {field.label}...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(value as string[] || []).includes(option.value)}
                  onChange={(e) => {
                    const current = (value as string[]) || [];
                    if (e.target.checked) {
                      handleFieldChange(field.name, [...current, option.value]);
                    } else {
                      handleFieldChange(field.name, current.filter(v => v !== option.value));
                    }
                  }}
                  className="rounded border-gray-300 text-sas-navy-600 focus:ring-sas-navy-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="rounded border-gray-300 text-sas-navy-600 focus:ring-sas-navy-500"
            />
            <span className="text-sm text-gray-700">{field.description || field.label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleFieldChange(field.name, option.value)}
                  className="border-gray-300 text-sas-navy-600 focus:ring-sas-navy-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sas-navy-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-sas-navy-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create New Goal</h2>
              <p className="text-sm text-gray-600">
                {step === 'select-template' && 'Choose a goal template to get started'}
                {step === 'fill-details' && 'Fill in your goal details'}
                {step === 'review' && 'Review and create your goal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2">
            {['select-template', 'fill-details', 'review'].map((s, index) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${step === s ? 'text-sas-navy-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step === s ? 'bg-sas-navy-600 text-white' :
                    ['fill-details', 'review'].indexOf(step) > ['select-template', 'fill-details', 'review'].indexOf(s as Step)
                      ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {['fill-details', 'review'].indexOf(step) > ['select-template', 'fill-details', 'review'].indexOf(s as Step) ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : index + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    {s === 'select-template' && 'Select Template'}
                    {s === 'fill-details' && 'Fill Details'}
                    {s === 'review' && 'Review'}
                  </span>
                </div>
                {index < 2 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Step 1: Select Template */}
          {step === 'select-template' && (
            <div className="space-y-6">
              {templates.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Goal Templates Available</h3>
                  <p className="text-gray-600">Contact your administrator to create goal templates.</p>
                </div>
              ) : (
                Object.entries(templatesByType).map(([type, typeTemplates]) => {
                  if (typeTemplates.length === 0) return null;
                  const TypeIcon = GoalTypeIcons[type as GoalType];
                  const typeColors = GoalTypeColors[type as GoalType];

                  return (
                    <div key={type} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${typeColors.bg}`}>
                          <TypeIcon className={`w-4 h-4 ${typeColors.text}`} />
                        </div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {type.replace('_', ' ')} Goals
                        </h3>
                        <span className="text-xs text-gray-500">({typeTemplates.length})</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {typeTemplates.map(template => (
                          <button
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className={`text-left p-4 border rounded-lg hover:border-sas-navy-300 hover:shadow-md transition-all ${
                              selectedTemplateId === template.id ? 'border-sas-navy-500 bg-sas-navy-50' : 'border-gray-200'
                            }`}
                          >
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {template.defaultDuration} days
                              </span>
                              {template.requiresApproval && (
                                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                  Requires Approval
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Step 2: Fill Details */}
          {step === 'fill-details' && (
            <div className="space-y-6">
              {isLoadingTemplate ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600" />
                </div>
              ) : selectedTemplate ? (
                <>
                  {/* Core fields */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Goal Information</h3>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goal Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formValues.title as string || ''}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        placeholder="Enter a clear, specific goal title"
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent ${
                          errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.title && (
                        <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formValues.description as string || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Describe your goal in detail - make it Specific, Measurable, Achievable, Relevant, and Time-bound"
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent min-h-[100px] ${
                          errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                      )}
                    </div>

                    {/* Priority & Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={formValues.priority as string || 'medium'}
                          onChange={(e) => handleFieldChange('priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formValues.startDate as string || ''}
                          onChange={(e) => handleFieldChange('startDate', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent ${
                            errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {errors.startDate && (
                          <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formValues.targetDate as string || ''}
                          onChange={(e) => handleFieldChange('targetDate', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent ${
                            errors.targetDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {errors.targetDate && (
                          <p className="mt-1 text-xs text-red-600">{errors.targetDate}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Template-specific fields */}
                  {selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="font-medium text-gray-900">Additional Details</h3>
                      {selectedTemplate.sections?.length > 0 ? (
                        // Render fields by section
                        selectedTemplate.sections
                          .sort((a, b) => a.order - b.order)
                          .map(section => {
                            const sectionFields = selectedTemplate.fields?.filter(f => f.sectionId === section.id) || [];
                            if (sectionFields.length === 0) return null;

                            return (
                              <div key={section.id} className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-700">{section.title}</h4>
                                {section.description && (
                                  <p className="text-xs text-gray-500">{section.description}</p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {sectionFields
                                    .sort((a, b) => a.order - b.order)
                                    .map(field => (
                                      <div key={field.id} className={field.width === 'full' ? 'md:col-span-2' : ''}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          {field.label}
                                          {field.required && <span className="text-red-500 ml-0.5">*</span>}
                                        </label>
                                        {field.helpText && (
                                          <p className="text-xs text-gray-500 mb-1">{field.helpText}</p>
                                        )}
                                        {renderField(field)}
                                        {errors[field.name] && (
                                          <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        // Render fields without sections
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedTemplate.fields
                            ?.sort((a, b) => a.order - b.order)
                            .map(field => (
                              <div key={field.id} className={field.width === 'full' ? 'md:col-span-2' : ''}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {field.label}
                                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                                </label>
                                {field.helpText && (
                                  <p className="text-xs text-gray-500 mb-1">{field.helpText}</p>
                                )}
                                {renderField(field)}
                                {errors[field.name] && (
                                  <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Template Not Found</h3>
                  <p className="text-gray-600">Please go back and select a template.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && selectedTemplate && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4">Goal Summary</h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Template:</span>
                    <span className="text-sm text-gray-900">{selectedTemplate.name}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Type:</span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${GoalTypeColors[selectedTemplate.type].bg} ${GoalTypeColors[selectedTemplate.type].text}`}>
                      {selectedTemplate.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Title:</span>
                    <span className="text-sm text-gray-900 font-medium">{formValues.title as string}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Description:</span>
                    <span className="text-sm text-gray-900">{formValues.description as string}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Priority:</span>
                    <span className="text-sm text-gray-900 capitalize">{formValues.priority as string}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Timeline:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(formValues.startDate as string).toLocaleDateString()} - {new Date(formValues.targetDate as string).toLocaleDateString()}
                    </span>
                  </div>

                  {selectedTemplate.requiresApproval && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Approval Required</p>
                          <p className="text-xs text-yellow-700 mt-0.5">
                            This goal will be saved as a draft. You can submit it for approval after creation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Default milestones preview */}
              {selectedTemplate.defaultMilestones && selectedTemplate.defaultMilestones.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Milestones ({selectedTemplate.defaultMilestones.length})</h3>
                  <ul className="space-y-2">
                    {selectedTemplate.defaultMilestones.map((milestone, index) => (
                      <li key={milestone.id} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-sas-navy-100 text-sas-navy-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-gray-900">{milestone.title}</span>
                          <span className="text-gray-500 ml-2">(+{milestone.offsetDays} days)</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={step === 'select-template' ? onClose : handleBack}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            {step === 'select-template' ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Back
              </>
            )}
          </button>

          {step !== 'select-template' && (
            <button
              onClick={step === 'review' ? handleSubmit : handleNext}
              disabled={createGoalMutation.isPending}
              className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createGoalMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : step === 'review' ? (
                <>
                  <Target className="w-4 h-4" />
                  Create Goal
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
