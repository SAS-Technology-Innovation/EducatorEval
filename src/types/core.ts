// Core Type Definitions for Educational Employee Experience Platform
export type UserRole = 
  // School Leadership
  | 'superintendent'
  | 'principal'
  | 'assistant_principal'
  
  // Division Leadership  
  | 'division_director'
  | 'assistant_director'
  
  // Department Leadership
  | 'department_head'
  | 'grade_chair'
  
  // Teaching Staff
  | 'teacher'
  | 'substitute_teacher'
  | 'specialist_teacher'
  
  // Instructional Support
  | 'instructional_coach'
  | 'plc_coach'
  | 'curriculum_coordinator'
  | 'assessment_coordinator'
  
  // Student Support
  | 'counselor'
  | 'social_worker'
  | 'psychologist'
  | 'special_education_coordinator'
  
  // Specialized Roles
  | 'observer'
  | 'dei_specialist'
  | 'technology_coordinator'
  | 'librarian'
  
  // Support Staff
  | 'secretary'
  | 'paraprofessional'
  | 'support_staff'
  
  // System Administration
  | 'super_admin'
  | 'system_admin';

// User & Organization Models
export interface User {
  // Identity
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  
  // School Structure
  employeeId: string;
  schoolId: string;
  divisionId: string;
  departmentId?: string;
  
  // Role & Permissions
  primaryRole: UserRole;
  secondaryRoles: UserRole[];
  permissions: string[];
  
  // Professional Info
  title: string;
  certifications: string[];
  experience: string;
  subjects: string[];
  grades: string[];
  specializations: string[];
  
  // Schedule Information
  scheduleId?: string;
  teachingLoad?: number; // Percentage or periods per day
  planningPeriods: string[]; // Planning/prep periods
  
  // Contact & Demographics
  phoneNumber?: string;
  address?: Address;
  pronouns?: string;
  languages: string[];
  
  // System
  isActive: boolean;
  accountStatus: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
  
  // Preferences
  preferences?: UserPreferences;
  notificationSettings?: NotificationSettings;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  fax?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    compactMode: boolean;
    showWelcomeMessage: boolean;
  };
}

export interface NotificationSettings {
  observations: boolean;
  evaluations: boolean;
  goals: boolean;
  reminders: boolean;
  announcements: boolean;
  reports: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: 'district' | 'school' | 'charter' | 'private';
  address: Address;
  contactInfo: ContactInfo;
  settings: Record<string, any>;
  timezone: string;
  academicYear: AcademicYear;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcademicYear {
  startDate: Date;
  endDate: Date;
  year: string; // e.g., "2024-2025"
  terms: Term[];
}

export interface Term {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: 'semester' | 'quarter' | 'trimester';
}

export interface School {
  id: string;
  organizationId: string;
  name: string;
  shortName: string;
  type: 'elementary' | 'middle' | 'high' | 'k12' | 'specialty';
  grades: string[];
  address: Address;
  contactInfo: ContactInfo;
  principalId: string;
  assistantPrincipalIds: string[];
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  headId: string;
  members: string[];
  subjects: string[];
  budgetCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Division Types and Structure
export type DivisionType = 'elementary' | 'middle' | 'high' | 'early_learning_center' | 'central_admin';

export const DivisionsAndDepartments: Record<DivisionType, string[]> = {
  elementary: [
    "Kindergarten",
    "1st Grade", 
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "Special Education",
    "ESL/ELL",
    "Arts & Electives",
    "PE & Health",
  ],
  middle: [
    "6th Grade",
    "7th Grade", 
    "8th Grade",
    "English Language Arts",
    "Mathematics",
    "Science",
    "Social Studies",
    "Special Education",
    "ESL/ELL",
    "Arts & Electives",
    "PE & Health",
  ],
  high: [
    "English",
    "Mathematics", 
    "Science",
    "Social Studies",
    "World Languages",
    "Fine Arts",
    "Career & Technical Education",
    "Special Education",
    "ESL/ELL",
    "PE & Health",
    "Guidance & Counseling",
  ],
  early_learning_center: [
    "Pre-K 3",
    "Pre-K 4",
    "Head Start",
    "Early Intervention",
    "Family Services",
  ],
  central_admin: [
    "Curriculum & Instruction",
    "Special Education Services", 
    "Technology",
    "Human Resources",
    "Finance & Operations",
    "Communications",
    "Professional Development",
    "Student Services",
    "Assessment & Accountability",
  ],
};

// Master Schedule System
export type ScheduleType = 'traditional' | 'block' | 'rotating' | 'flexible' | 'hybrid';

export interface MasterSchedule {
  id: string;
  schoolId: string;
  
  // Schedule Info
  name: string; // "2024-2025 Master Schedule"
  academicYear: string; // "2024-2025"
  scheduleType: ScheduleType;
  
  // Day Structure
  dayTypes: DayType[];
  periods: Period[];
  
  // Schedule Metadata
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  
  // System
  createdAt: Date;
  updatedAt: Date;
}

export interface DayType {
  id: string;
  name: string; // "Day A", "Monday", "Blue Day", etc.
  shortName: string; // "A", "M", "Blue"
  description?: string;
  color?: string; // For UI display
  order: number; // Display order
}

export type PeriodType = 'class' | 'lunch' | 'planning' | 'homeroom' | 'assembly' | 'break' | 'advisory' | 'study' | 'intervention';

export interface Period {
  id: string;
  name: string; // "Period 1", "Block A", "Homeroom"
  shortName: string; // "P1", "A", "HR"
  startTime: string; // "08:00"
  endTime: string; // "08:50"
  duration: number; // Minutes
  order: number;
  type: PeriodType;
  
  // Which days this period applies to
  applicableDays: string[]; // Day type IDs
}

// Educator Schedule & Class Assignments
export interface EducatorSchedule {
  id: string;
  educatorId: string; // User ID
  educatorName: string; // Cached for performance
  schoolId: string;
  divisionId: string;
  masterScheduleId: string;
  
  // Academic Info
  academicYear: string;
  semester?: string; // "Fall", "Spring", "Full Year"
  
  // Class Assignments
  classAssignments: ClassAssignment[];
  
  // Schedule Metadata
  totalPeriods: number;
  teachingPeriods: number;
  planningPeriods: number;
  teachingLoad: number; // Percentage
  
  // Effective Dates
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  
  // System
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassAssignment {
  id: string;
  
  // Class Details
  className: string; // "Algebra I - Period 3"
  courseId?: string; // Links to course catalog
  courseName: string; // "Algebra I"
  courseCode?: string; // "MATH101"
  
  // Academic Details
  subject: string; // "Mathematics"
  grade: string; // "9", "K", "Pre-K"
  gradeLevel: string[]; // ["9", "10"] for multi-grade
  
  // Schedule Details
  dayTypes: string[]; // ["A", "B"] or ["Monday", "Wednesday", "Friday"]
  periods: string[]; // Period IDs from master schedule
  
  // Location
  roomNumber: string; // "201", "Gym", "Library"
  building?: string; // "Main", "Annex"
  location?: string; // Full location description
  
  // Class Info
  studentCount?: number;
  maxCapacity?: number;
  
  // Co-Teaching & Support
  coTeachers: string[]; // Additional teacher IDs
  paraprofessionals: string[]; // Support staff IDs
  
  // Special Designations
  isHonors: boolean;
  isAP: boolean;
  isIB: boolean;
  isSpecialEd: boolean;
  isESL: boolean;
  isInclusion: boolean;
  
  // Additional Metadata
  notes?: string;
  tags: string[];
  
  // System
  isActive: boolean;
}

export interface Division {
  id: string;
  schoolId: string;
  name: string;
  type: DivisionType;
  description?: string;
  directorId?: string;
  assistantDirectorIds: string[];
  departments: string[]; // Department IDs
  grades: string[];
  
  // Settings
  settings: Record<string, any>;
  
  // System
  createdAt: Date;
  updatedAt: Date;
}
