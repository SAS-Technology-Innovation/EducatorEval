// Goal Template Type Definitions
// Admin-configurable templates for SMART goals - similar architecture to Framework

import type { UserRole, DivisionType } from './core';

// Goal Template - Admin-configured structure that defines how goals are created
export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  type: GoalType;
  schoolId: string;
  status: 'active' | 'draft' | 'archived';

  // Template Structure
  sections: GoalTemplateSection[];
  fields: GoalTemplateField[];

  // Default Configuration
  defaultMilestones: DefaultMilestone[];
  suggestedMeasurements: SuggestedMeasurement[];
  reflectionPrompts: ReflectionPrompt[];

  // Workflow Configuration
  requiresApproval: boolean;
  approverRoles: UserRole[];
  defaultDuration: number; // days from start to target date

  // Access Control
  applicableDivisions: DivisionType[];
  applicableRoles: UserRole[];
  createdBy: string;

  // Framework Alignment
  frameworkAlignments: string[]; // Links to framework IDs for goal alignment

  // Usage Analytics
  usageCount: number;
  lastUsed?: Date;
  averageCompletionRate: number;

  // System
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: Record<string, unknown>;
}

export type GoalType = 'professional' | 'instructional' | 'student_outcome' | 'leadership' | 'personal';

// Section within a goal template
export interface GoalTemplateSection {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  isCollapsible: boolean;
  fields: string[]; // Field IDs belonging to this section
  icon?: string;
  color?: string;
}

// Field definition for goal templates - defines what data is collected
export interface GoalTemplateField {
  id: string;
  sectionId?: string;
  name: string; // Internal field name
  label: string; // Display label
  type: FieldType;
  description?: string;
  helpText?: string;
  placeholder?: string;

  // Validation
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  validationMessage?: string;

  // For select/multiselect types
  options?: FieldOption[];

  // For conditional fields
  conditionalOn?: {
    fieldId: string;
    value: string | string[] | boolean;
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
  };

  // Display
  order: number;
  width?: 'full' | 'half' | 'third';
  defaultValue?: string | number | boolean | string[];
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'user_select' // For selecting users (mentors, collaborators)
  | 'framework_select' // For selecting related frameworks
  | 'observation_select' // For linking observations
  | 'file_upload';

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
}

// Default milestones that are created when a goal is instantiated
export interface DefaultMilestone {
  id: string;
  title: string;
  description: string;
  offsetDays: number; // Days from goal start date
  isRequired: boolean;
  suggestedEvidence: string[];
  order: number;
}

// Suggested measurements for tracking goal progress
export interface SuggestedMeasurement {
  id: string;
  metric: string;
  description: string;
  unit: string;
  measurementType: 'quantitative' | 'qualitative' | 'binary';
  suggestedBaseline?: string;
  suggestedTarget?: string;
  dataSource?: string; // Where to get the data (e.g., "observation scores", "student assessments")
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'end_of_goal';
}

// Reflection prompts for goal journal
export interface ReflectionPrompt {
  id: string;
  prompt: string;
  description?: string;
  frequency: 'milestone' | 'weekly' | 'monthly' | 'custom';
  isRequired: boolean;
  order: number;
}

// User's Goal Instance - created from a template
export interface UserGoal {
  id: string;
  templateId: string;
  templateName: string; // Cached for display
  userId: string;
  schoolId: string;

  // Goal Details (from user input based on template fields)
  title: string;
  description: string;
  type: GoalType;
  priority: 'low' | 'medium' | 'high' | 'critical';

  // Custom field values (based on template fields)
  fieldValues: Record<string, unknown>;

  // Timeline
  startDate: Date;
  targetDate: Date;
  completionDate?: Date;

  // Status & Progress
  status: 'draft' | 'pending_approval' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  progress: number; // 0-100 percentage

  // Workflow
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;

  // Collaboration
  mentorId?: string;
  supervisorId?: string;
  collaboratorIds: string[];

  // Framework Alignments
  frameworkAlignments: string[];
  relatedObservationIds: string[];

  // System
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: Record<string, unknown>;
}

// Milestone instance for a user's goal
export interface UserGoalMilestone {
  id: string;
  goalId: string;
  templateMilestoneId?: string; // Reference to default milestone if created from template

  title: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'skipped';

  // Evidence
  evidence: MilestoneEvidence[];

  // Notes
  notes: string;

  // System
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface MilestoneEvidence {
  id: string;
  type: 'text' | 'link' | 'file' | 'observation';
  content: string;
  url?: string;
  observationId?: string;
  addedAt: Date;
  addedBy: string;
}

// Measurement instance for tracking progress
export interface UserGoalMeasurement {
  id: string;
  goalId: string;
  templateMeasurementId?: string;

  metric: string;
  unit: string;
  baseline: string | number;
  target: string | number;

  // Measurement entries over time
  entries: MeasurementEntry[];

  // Current value (latest entry)
  currentValue?: string | number;
  lastMeasuredAt?: Date;

  // System
  createdAt: Date;
  updatedAt: Date;
}

export interface MeasurementEntry {
  id: string;
  value: string | number;
  date: Date;
  source: string;
  notes?: string;
  addedBy: string;
}

// Reflection entry for a goal
export interface UserGoalReflection {
  id: string;
  goalId: string;
  promptId?: string; // Reference to template prompt if using one

  prompt: string;
  response: string;
  date: Date;

  // Optional structured fields
  insights?: string[];
  nextSteps?: string[];
  challenges?: string[];
  mood?: 'frustrated' | 'challenged' | 'neutral' | 'optimistic' | 'excited';

  // System
  createdAt: Date;
  updatedAt: Date;
}

// Goal Activity Log - for tracking changes and updates
export interface GoalActivity {
  id: string;
  goalId: string;
  userId: string;
  type: GoalActivityType;
  description: string;
  previousValue?: unknown;
  newValue?: unknown;
  timestamp: Date;
}

export type GoalActivityType =
  | 'created'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'updated'
  | 'status_changed'
  | 'milestone_completed'
  | 'measurement_added'
  | 'reflection_added'
  | 'comment_added'
  | 'collaborator_added'
  | 'collaborator_removed';

// Pre-defined Goal Types with descriptions
export const GoalTypeDefinitions: Record<GoalType, { label: string; description: string; icon: string; color: string }> = {
  professional: {
    label: 'Professional Development',
    description: 'Goals related to your professional growth and skills development',
    icon: 'briefcase',
    color: 'blue'
  },
  instructional: {
    label: 'Instructional Practice',
    description: 'Goals focused on improving teaching methods and classroom practices',
    icon: 'book-open',
    color: 'green'
  },
  student_outcome: {
    label: 'Student Outcomes',
    description: 'Goals targeting measurable improvements in student learning',
    icon: 'users',
    color: 'purple'
  },
  leadership: {
    label: 'Leadership Development',
    description: 'Goals for developing leadership skills and responsibilities',
    icon: 'star',
    color: 'yellow'
  },
  personal: {
    label: 'Personal Growth',
    description: 'Goals for personal well-being and work-life balance',
    icon: 'heart',
    color: 'pink'
  }
};

// Priority definitions
export const GoalPriorityDefinitions: Record<string, { label: string; color: string; description: string }> = {
  low: {
    label: 'Low',
    color: 'gray',
    description: 'Nice to achieve, but not urgent'
  },
  medium: {
    label: 'Medium',
    color: 'blue',
    description: 'Important goal to work on'
  },
  high: {
    label: 'High',
    color: 'yellow',
    description: 'Critical goal requiring focused attention'
  },
  critical: {
    label: 'Critical',
    color: 'red',
    description: 'Must be achieved - highest priority'
  }
};

// Status definitions
export const GoalStatusDefinitions: Record<string, { label: string; color: string; description: string }> = {
  draft: {
    label: 'Draft',
    color: 'gray',
    description: 'Goal is being drafted'
  },
  pending_approval: {
    label: 'Pending Approval',
    color: 'yellow',
    description: 'Awaiting supervisor approval'
  },
  active: {
    label: 'Active',
    color: 'green',
    description: 'Goal is active and being worked on'
  },
  completed: {
    label: 'Completed',
    color: 'blue',
    description: 'Goal has been achieved'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
    description: 'Goal has been cancelled'
  },
  on_hold: {
    label: 'On Hold',
    color: 'orange',
    description: 'Goal is temporarily paused'
  }
};
