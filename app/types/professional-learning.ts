// Professional Learning & Goal Management Type Definitions

export interface ProfessionalLearning {
  id: string;
  userId: string;
  schoolId: string;

  // Learning Details
  title: string;
  description: string;
  type: 'course' | 'workshop' | 'conference' | 'webinar' | 'self_study' | 'mentoring' | 'plc';
  category: string;
  subject?: string;
  provider: string;
  facilitator?: string;

  // Scheduling
  startDate: Date;
  endDate?: Date;
  duration: number; // hours
  location?: string;
  isVirtual: boolean;

  // Requirements
  isRequired: boolean;
  prerequisites: string[];
  targetAudience: string[];
  maxParticipants?: number;

  // Progress & Completion
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  progress: number; // percentage
  completionDate?: Date;
  certificateUrl?: string;

  // Credits & Certification
  creditHours: number;
  creditType: 'continuing_education' | 'professional_development' | 'graduate' | 'certification';
  issuingOrganization?: string;
  certificateNumber?: string;
  expirationDate?: Date;

  // Evaluation
  rating?: number;
  feedback?: string;
  learningObjectives: string[];
  learningOutcomes?: string[];

  // System
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export interface Goal {
  id: string;
  userId: string;
  schoolId: string;

  // Goal Details
  title: string;
  description: string;
  type: 'professional' | 'instructional' | 'student_outcome' | 'personal' | 'leadership';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';

  // Timeline
  startDate: Date;
  targetDate: Date;
  completionDate?: Date;

  // Progress Tracking
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  progress: number; // percentage
  milestones: GoalMilestone[];

  // Success Metrics
  successCriteria: string[];
  measurements: GoalMeasurement[];

  // Collaboration
  collaborators: string[]; // User IDs
  mentorId?: string;
  supervisorId?: string;

  // Resources & Support
  resources: string[];
  supportNeeded: string[];
  barriers: string[];

  // Reflection & Notes
  notes: string[];
  reflections: GoalReflection[];

  // Alignment
  schoolGoalAlignment?: string[];
  standardsAlignment?: string[];

  // Connected to observations
  relatedObservations: string[]; // Observation IDs

  // Training suggestions
  suggestedTraining: TrainingSuggestion[];

  // System
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  evidence: string[];
  notes?: string;
}

export interface GoalMeasurement {
  id: string;
  metric: string;
  baseline: number | string;
  target: number | string;
  current?: number | string;
  unit: string;
  measurementDate: Date;
  source: string;
  notes?: string;
}

export interface GoalReflection {
  id: string;
  date: Date;
  prompt: string;
  response: string;
  insights: string[];
  nextSteps: string[];
  mood?: 'frustrated' | 'challenged' | 'neutral' | 'optimistic' | 'excited';
}

export interface TrainingSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'course' | 'mentoring' | 'reading' | 'practice';
  priority: 'recommended' | 'suggested' | 'optional';
  reason: string; // Why this training is suggested based on observations
  relatedGoalAreas: string[]; // Which growth areas this addresses
  estimatedDuration: number; // hours
  provider?: string;
  url?: string;
  status: 'suggested' | 'planned' | 'in_progress' | 'completed' | 'dismissed';
  createdAt: Date;
}

// Performance Evaluation Types
export interface PerformanceEvaluation {
  id: string;
  evalueeId: string; // Person being evaluated
  evaluatorId: string; // Person conducting evaluation
  schoolId: string;

  // Evaluation Details
  title: string;
  type: 'annual' | 'mid_year' | 'quarterly' | 'probationary' | 'special';
  evaluationPeriod: {
    startDate: Date;
    endDate: Date;
  };

  // Framework & Standards
  frameworkId: string;
  frameworkName: string;
  standards: EvaluationStandard[];

  // Ratings & Scores
  overallRating: string;
  overallScore: number;
  maxScore: number;
  ratings: EvaluationRating[];

  // Goals & Growth
  priorGoals: string[]; // References to previous goals
  goalProgress: GoalProgress[];
  newGoals: string[]; // References to new goals

  // Observations & Evidence
  observationIds: string[]; // Related observations
  evidenceSources: EvidenceSource[];

  // Comments & Feedback
  evaluatorComments: string;
  evalueeComments?: string;
  strengthsNoted: string[];
  areasForGrowth: string[];

  // Professional Development
  recommendedProfessionalLearning: string[];
  supportProvided: string[];

  // Workflow & Approval
  status: 'draft' | 'pending_review' | 'under_review' | 'completed' | 'appealed';
  reviewDate?: Date;
  approvalDate?: Date;
  approverId?: string;

  // System
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: Record<string, any>;
}

export interface EvaluationStandard {
  id: string;
  title: string;
  description: string;
  weight: number;
  indicators: string[];
  evidenceExpected: string[];
}

export interface EvaluationRating {
  standardId: string;
  standardTitle: string;
  rating: string;
  score: number;
  maxScore: number;
  comments: string;
  evidence: string[];
  justification: string;
}

export interface GoalProgress {
  goalId: string;
  goalTitle: string;
  status: 'exceeded' | 'met' | 'progressing' | 'not_met' | 'not_applicable';
  evidence: string[];
  comments: string;
}

export interface EvidenceSource {
  type: 'observation' | 'artifact' | 'student_data' | 'self_reflection' | 'peer_feedback' | 'parent_feedback';
  source: string;
  description: string;
  url?: string;
  date: Date;
}
