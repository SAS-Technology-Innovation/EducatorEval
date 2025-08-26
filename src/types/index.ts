// Common types used across the CRP Observation System

// User role enumeration
export type UserRole = 'admin' | 'coordinator' | 'observer' | 'teacher';

export interface Framework {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  lastModified: string;
  tags: string[];
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  weight: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'multiselect' | 'single-select' | 'yes-no';
  required: boolean;
  scale?: number;
  weight: number;
  tags: string[];
  helpText: string;
  options?: string[];
  frameworkAlignments: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  grade?: string;
  subjects: string[];
  currentClass?: ClassInfo;
}

export interface ClassInfo {
  name: string;
  subject: string;
  room: string;
  period: string;
  grade: string;
}

export interface Observer {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  frameworks: string[];
}

export interface Observation {
  id: string;
  teacherId: string;
  teacherName: string;
  observerId: string;
  observerName: string;
  frameworkId: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: 'draft' | 'in-progress' | 'completed' | 'submitted';
  responses: Record<string, ObservationResponse>;
  comments: Record<string, string>;
  overallComment: string;
  classInfo: ClassInfo;
  mediaAttachments?: MediaAttachment[];
  crpEvidenceCount?: number;      // Auto-calculated from responses
  totalLookFors?: number;         // Auto-calculated
  metadata?: {                    // Enhanced tracking
    location?: string;
    syncStatus?: 'synced' | 'pending' | 'offline';
  };
}

export interface ObservationResponse {
  questionId: string;
  value: string | string[] | number;
  timestamp: string;
}

export interface MediaAttachment {
  id: string;
  type: 'photo' | 'audio' | 'video';
  url: string;
  timestamp: string;
  description?: string;
}

export interface FrameworkAlignment {
  id: string;
  label: string;
  category: string;
  color: 'green' | 'pink' | 'blue' | 'yellow' | 'purple' | 'indigo';
}

export interface DashboardStats {
  totalObservations: number;
  activeObservers: number;
  crpEvidenceRate: number;
  weeklyObservations: number;
  goalProgress: {
    current: number;
    target: number;
    percentage: number;
  };
}

export interface ProcessingJob {
  id: string;
  type: 'CSV Import' | 'API Import' | 'BigQuery Sync' | 'Data Export';
  filename?: string;
  source?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  records: number;
  errors: number;
  startTime: string;
  endTime?: string;
}

export interface ApiConnection {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'error' | 'disconnected';
  lastSync: string;
  endpoint: string;
  recordCount: number;
  configuration: Record<string, any>;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User and authentication types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  permissions: string[];
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

// Scheduled observation types
export interface ScheduledObservation {
  id: string;
  teacherId: string;
  observerId: string;
  frameworkId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  remindersSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// Observation filters and search
export interface ObservationFilters {
  status?: ('draft' | 'in-progress' | 'completed' | 'scheduled')[];
  dateRange?: {
    start: string;
    end: string;
  };
  teacherId?: string;
  observerId?: string;
  frameworkId?: string;
  department?: string;
}

export interface ObservationSearchParams {
  query?: string;
  filters?: ObservationFilters;
  sortBy?: 'date' | 'teacher' | 'observer' | 'framework' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
