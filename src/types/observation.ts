// Observation & Framework Type Definitions
import { DivisionType } from './core';

// Generic observation system that works with any framework (CRP, evaluation, etc.)
export interface Observation {
  // Core Identification
  id: string;
  schoolId: string;
  divisionId: string;
  departmentId?: string;
  
  // Participants
  subjectId: string; // Teacher or person being observed
  subjectName: string;
  observerId: string;
  observerName: string;
  
  // Context (flexible for different observation types)
  context: ObservationContext;
  
  // Framework & Data
  frameworkId: string;
  frameworkName: string; // Cached for reporting
  frameworkVersion: string;
  responses: ObservationResponse[];
  overallComments: string;
  
  // Analysis (calculated based on framework)
  evidenceCount: number;
  totalQuestions: number;
  evidencePercentage: number;
  frameworkScores: FrameworkScore[];
  
  // Media & Evidence (Firebase Storage URLs)
  attachments: MediaFile[];
  location?: GeoLocation;
  
  // Status & Workflow
  status: 'draft' | 'completed' | 'submitted' | 'reviewed';
  submittedAt?: Date;
  reviewedAt?: Date;
  
  // Follow-up
  followUpRequired: boolean;
  followUpCompleted: boolean;
  followUpNotes?: string;
  
  // System
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: Record<string, any>;
}

// Flexible context that works for classroom observations, evaluations, etc.
export interface ObservationContext {
  type: string; // classroom, meeting, evaluation, etc.
  
  // For classroom observations
  className?: string;
  subject?: string;
  grade?: string;
  room?: string;
  period?: string;
  studentCount?: number;
  lessonPhase?: string;
  
  // For evaluations or other observation types
  position?: string;
  division?: string;
  department?: string;
  
  // Timing
  date: Date;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
}

// Generic framework system (works for CRP, evaluation rubrics, etc.)
export interface Framework {
  id: string;
  name: string;
  description: string;
  type: string; // observation, evaluation, assessment, etc.
  version: string;
  status: 'active' | 'draft' | 'archived' | 'deprecated';
  
  // School & Access
  schoolId: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  
  // Applicable Divisions (framework can be used across divisions)
  applicableDivisions: DivisionType[];
  
  // Framework Structure
  sections: FrameworkSection[];
  totalQuestions: number;
  requiredQuestions: number;
  estimatedDuration: number;
  
  // Alignment Mappings (flexible for any framework type)
  alignments: FrameworkAlignment[];
  tags: string[];
  categories: string[];
  
  // Usage & Analytics
  usageCount: number;
  lastUsed?: Date;
  averageCompletionTime: number;
  averageEvidenceScore: number;
  
  // System
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export interface FrameworkSection {
  id: string;
  title: string;
  description: string;
  order: number;
  questions: Question[];
  isRequired: boolean;
  weight: number;
  color?: string;
  icon?: string;
}

export interface Question {
  id: string;
  sectionId: string;
  text: string;
  description?: string;
  helpText: string;
  examples: string[];
  
  // Configuration
  type: 'rating' | 'text' | 'multiselect' | 'checkbox' | 'file';
  isRequired: boolean;
  weight: number;
  order: number;
  
  // Rating Scale (for rating type)
  scale?: RatingScale;
  
  // Framework Alignments (flexible for any framework)
  frameworkAlignments: FrameworkAlignment[];
  
  // Categorization
  tags: string[];
  categories: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Evidence Requirements
  evidenceRequired: boolean;
  evidenceTypes: string[];
  minEvidenceCount?: number;
}

export interface RatingScale {
  id: string;
  name: string;
  type: 'numeric' | 'descriptive' | 'custom';
  min: number;
  max: number;
  labels: RatingLabel[];
  includeNotObserved: boolean;
  notObservedLabel?: string;
}

export interface RatingLabel {
  value: number | string;
  label: string;
  description: string;
  color?: string;
}

export interface ObservationResponse {
  questionId: string;
  questionText: string; // Cached for reporting
  rating: string; // "1", "2", "3", "4", "not-observed", or custom scale
  ratingText: string;
  comments: string;
  evidence: string[];
  tags: string[];
  frameworkAlignments: string[];
  confidence: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface FrameworkScore {
  alignmentId: string;
  alignmentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  evidenceCount: number;
  questionCount: number;
}

// Framework alignments - configurable per school/framework type
export interface FrameworkAlignment {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  color: string;
  icon?: string;
  weight?: number;
  
  // Which framework types this alignment applies to
  applicableTypes: string[];
  
  // Which divisions this alignment is relevant for
  applicableDivisions: DivisionType[];
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

// CRP Framework Alignments - Now division-aware
export const CRPFrameworkAlignments: Record<string, FrameworkAlignment> = {
  crp_general: {
    id: 'crp_general',
    name: 'CRP (General)',
    color: 'green',
    category: 'Culturally Responsive Practices',
    description: 'General culturally responsive pedagogy practices',
    applicableTypes: ['observation', 'evaluation'],
    applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
  },
  crp_curriculum: {
    id: 'crp_curriculum',
    name: 'CRP (Curriculum Relevance)',
    color: 'green',
    category: 'Culturally Responsive Practices',
    description: 'Curriculum relevance and cultural connections',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high'],
  },
  crp_high_expectations: {
    id: 'crp_high_expectations',
    name: 'CRP (High Expectations)',
    color: 'green',
    category: 'Culturally Responsive Practices',
    description: 'Maintaining high expectations for all students',
    applicableTypes: ['observation', 'evaluation'],
    applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
  },
  crp_learning_partnerships: {
    id: 'crp_learning_partnerships',
    name: 'CRP (Learning Partnerships)',
    color: 'green',
    category: 'Culturally Responsive Practices',
    description: 'Building partnerships and collaborative learning',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high'],
  },
  casel_self_awareness: {
    id: 'casel_self_awareness',
    name: 'CASEL (Self-Awareness)',
    color: 'pink',
    category: 'Social-Emotional Learning',
    description: 'Self-awareness and emotional intelligence',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
  },
  casel_social_awareness: {
    id: 'casel_social_awareness',
    name: 'CASEL (Social Awareness)',
    color: 'pink',
    category: 'Social-Emotional Learning',
    description: 'Social awareness and empathy skills',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high'],
  },
  casel_relationship_skills: {
    id: 'casel_relationship_skills',
    name: 'CASEL (Relationship Skills)',
    color: 'pink',
    category: 'Social-Emotional Learning',
    description: 'Relationship building and communication skills',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
  },
  tripod_care: {
    id: 'tripod_care',
    name: 'Tripod: Care',
    color: 'blue',
    category: '7Cs of Learning',
    description: 'Care and supportive relationships',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high'],
  },
  tripod_challenge: {
    id: 'tripod_challenge',
    name: 'Tripod: Challenge',
    color: 'blue',
    category: '7Cs of Learning',
    description: 'Academic challenge and rigor',
    applicableTypes: ['observation'],
    applicableDivisions: ['middle', 'high'], // More relevant for older students
  },
  five_daily_assessment: {
    id: 'five_daily_assessment',
    name: '5 Daily Assessment Practices',
    color: 'yellow',
    category: 'Assessment',
    description: 'Daily formative assessment strategies',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high'],
  },
  panorama_student_exp: {
    id: 'panorama_student_exp',
    name: 'Panorama (Student Experience)',
    color: 'purple',
    category: 'Student Experience',
    description: 'Student experience and engagement',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high'],
  },
  inclusive_practices: {
    id: 'inclusive_practices',
    name: 'Inclusive Practices',
    color: 'indigo',
    category: 'Inclusion & Equity',
    description: 'Inclusive teaching and equity practices',
    applicableTypes: ['observation', 'evaluation'],
    applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
  },
};
