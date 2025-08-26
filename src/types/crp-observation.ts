// CRP Observation Applet Types
import { 
  Observation, 
  ObservationResponse, 
  FrameworkScore, 
  FrameworkAlignment, 
  FrameworkSection, 
  MediaFile, 
  GeoLocation, 
  RatingScale 
} from './observation';

// CRP-specific extension of the base Observation type
export interface CRPObservation extends Observation {
  // CRP-specific analysis fields
  crpEvidenceCount: number;
  totalLookFors: number;
  crpPercentage: number;
  strengths: string[];
  growthAreas: string[];
  lessonPhase: string; // beginning, middle, end, transition
}

// CRP-specific question types
export interface CRPQuestion {
  id: string;
  sectionId: string;
  questionNumber: string; // "1.1", "2.3", etc.
  lookFor: string;
  description: string;
  examples: string[];
  crpAlignment: string[];
  weight: number;
  isCore: boolean; // Core vs. supplemental questions
}

// Pre-defined CRP Framework Structure
export const CRPFrameworkSections = [
  {
    id: 'academic-success',
    title: 'Academic Success',
    description: 'Practices that support academic achievement for all students',
    color: 'blue',
    weight: 0.25
  },
  {
    id: 'cultural-competence',
    title: 'Cultural Competence',
    description: 'Practices that acknowledge and incorporate student cultural references',
    color: 'green', 
    weight: 0.25
  },
  {
    id: 'critical-consciousness',
    title: 'Critical Consciousness',
    description: 'Practices that help students critique social norms and inequities',
    color: 'purple',
    weight: 0.25
  },
  {
    id: 'community-connections',
    title: 'Community Connections',
    description: 'Practices that connect learning to community contexts and experiences',
    color: 'orange',
    weight: 0.25
  }
];

// Pre-defined rating scale for CRP observations
export const CRPRatingScale = {
  id: 'crp-4-point',
  name: 'CRP 4-Point Evidence Scale',
  type: 'descriptive' as const,
  min: 0,
  max: 4,
  includeNotObserved: true,
  notObservedLabel: 'Not Observed',
  labels: [
    {
      value: 0,
      label: 'Not Observed',
      description: 'This practice was not observed during the lesson',
      color: 'gray'
    },
    {
      value: 1,
      label: 'Beginning',
      description: 'Teacher demonstrates limited implementation of this practice',
      color: 'red'
    },
    {
      value: 2,
      label: 'Developing',
      description: 'Teacher demonstrates developing implementation of this practice',
      color: 'yellow'
    },
    {
      value: 3,
      label: 'Proficient',
      description: 'Teacher demonstrates proficient implementation of this practice',
      color: 'green'
    },
    {
      value: 4,
      label: 'Advanced',
      description: 'Teacher demonstrates advanced implementation of this practice',
      color: 'blue'
    }
  ]
};

// CRP Dashboard Statistics
export interface CRPStatistics {
  totalObservations: number;
  averageCRPScore: number;
  evidenceRate: number;
  topStrengths: { practice: string; count: number }[];
  growthAreas: { practice: string; count: number }[];
  trendData: { date: string; score: number }[];
  bySection: {
    sectionId: string;
    sectionName: string;
    averageScore: number;
    evidenceCount: number;
    totalQuestions: number;
  }[];
}

// Export re-used types from observation module for convenience
export type { 
  Observation, 
  ObservationResponse, 
  FrameworkScore, 
  FrameworkAlignment, 
  FrameworkSection, 
  MediaFile, 
  GeoLocation, 
  RatingScale 
};
