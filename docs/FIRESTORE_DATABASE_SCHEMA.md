# Firestore Database Schema

## Overview

Complete database schema for the EducatorEval platform, including all collections, subcollections, fields, types, indexes, and security rules.

## Database Structure

```
firestore/
├── users/                          # User accounts and profiles
├── organizations/                  # School districts
├── schools/                        # Individual schools
├── divisions/                      # School divisions (Elementary, Middle, High)
├── departments/                    # Academic departments
├── frameworks/                     # Observation frameworks (CRP, CASEL, etc.)
├── observations/                   # Classroom observations
│   └── {observationId}/
│       └── comments/               # Comments on observations (subcollection)
├── schedules/                      # Master schedules
├── educatorSchedules/              # Individual teacher schedules
├── professionalLearning/           # PL goals and activities
└── notifications/                  # User notifications
```

---

## Collection Schemas

### 1. `users` Collection

**Purpose**: Store all user accounts, profiles, and professional information.

```typescript
{
  // Document ID: Firebase Auth UID or custom ID

  // Identity
  id: string;                       // Same as document ID
  email: string;                    // Unique, indexed
  firstName: string;
  lastName: string;
  displayName: string;              // "First Last"
  avatar?: string;                  // Firebase Storage URL

  // School Structure
  employeeId: string;               // Employee number, indexed
  schoolId: string;                 // Reference to schools/{schoolId}, indexed
  divisionId: string;               // Reference to divisions/{divisionId}, indexed
  primaryDepartmentId?: string;     // Primary department, indexed
  departmentIds: string[];          // All departments, array-contains index

  // Role & Permissions
  primaryRole: 'super_admin' | 'administrator' | 'manager' | 'observer' | 'educator' | 'staff';
  secondaryRoles: string[];         // Additional roles
  permissions: string[];            // Granular permissions

  // Professional Info
  jobTitle: string;                 // JobTitle enum, indexed
  certifications: string[];
  experience: string;
  primarySubject?: string;          // Primary subject, indexed
  subjects: string[];               // All subjects, array-contains index
  grades: string[];                 // Grade levels taught
  specializations: string[];

  // Schedule Information
  scheduleId?: string;              // Reference to educatorSchedules/{scheduleId}
  teachingLoad?: number;            // Percentage or periods per day
  planningPeriods: string[];        // Planning/prep periods

  // Contact & Demographics
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  pronouns?: string;
  languages: string[];

  // System
  isActive: boolean;                // Indexed for active user queries
  accountStatus: string;
  lastLogin?: Timestamp;
  createdAt: Timestamp;             // Auto-generated
  updatedAt: Timestamp;             // Auto-updated
  metadata: Map<string, any>;

  // Preferences
  preferences?: {
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
  };

  notificationSettings?: {
    observations: boolean;
    evaluations: boolean;
    goals: boolean;
    reminders: boolean;
    announcements: boolean;
    reports: boolean;
  };
}
```

**Indexes**:
```
- email (ascending)
- employeeId (ascending)
- schoolId (ascending), isActive (ascending)
- divisionId (ascending), isActive (ascending)
- primaryDepartmentId (ascending), isActive (ascending)
- departmentIds (array-contains)
- primaryRole (ascending), isActive (ascending)
- jobTitle (ascending), isActive (ascending)
- primarySubject (ascending)
- subjects (array-contains)
- Composite: schoolId (asc), primaryRole (asc), isActive (asc)
- Composite: divisionId (asc), primaryRole (asc), isActive (asc)
- Composite: primaryDepartmentId (asc), primaryRole (asc), isActive (asc)
```

---

### 2. `frameworks` Collection

**Purpose**: Store observation frameworks (CRP, CASEL, Tripod, etc.)

```typescript
{
  // Document ID: Auto-generated or custom (e.g., 'crp-v1', 'casel-v2')

  id: string;
  name: string;                     // "CRP Framework", "CASEL Framework"
  description: string;
  type: string;                     // "observation", "evaluation", "assessment"
  version: string;                  // "1.0", "2.1"
  status: 'active' | 'draft' | 'archived' | 'deprecated'; // Indexed

  // School & Access
  schoolId: string;                 // Indexed
  createdBy: string;                // User ID
  approvedBy?: string;              // User ID
  approvedAt?: Timestamp;

  // Applicable Divisions
  applicableDivisions: string[];    // ["elementary", "middle", "high"]

  // Framework Structure
  sections: FrameworkSection[];     // Array of sections
  totalQuestions: number;           // Calculated
  requiredQuestions: number;        // Calculated
  estimatedDuration: number;        // Minutes

  // Alignment Mappings
  alignments: FrameworkAlignment[]; // Array of alignments
  tags: string[];
  categories: string[];

  // Usage & Analytics
  usageCount: number;               // Number of observations using this
  lastUsed?: Timestamp;
  averageCompletionTime: number;    // Minutes
  averageEvidenceScore: number;     // Percentage

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata: Map<string, any>;
}

// Nested Types (stored as maps within framework document)

interface FrameworkSection {
  id: string;
  title: string;
  description: string;
  order: number;
  questions: Question[];
  isRequired: boolean;
  weight: number;                   // 0-1 for scoring
  color?: string;                   // UI color
  icon?: string;                    // Emoji or icon name
}

interface Question {
  id: string;
  sectionId: string;
  text: string;                     // Question text
  description?: string;
  helpText: string;                 // "Look for" guidance
  examples: string[];               // Example indicators

  // Configuration
  type: 'rating' | 'text' | 'multiselect' | 'checkbox' | 'file';
  isRequired: boolean;
  weight: number;
  order: number;

  // Rating Scale (for rating type)
  scale?: RatingScale;

  // Framework Alignments
  frameworkAlignments: FrameworkAlignment[];

  // Categorization
  tags: string[];
  categories: string[];
  difficulty: 'easy' | 'medium' | 'hard';

  // Evidence Requirements
  evidenceRequired: boolean;
  evidenceTypes: string[];          // ["photo", "video", "document"]
  minEvidenceCount?: number;
}

interface RatingScale {
  id: string;
  name: string;                     // "4-Point Scale", "Danielson Scale"
  type: 'numeric' | 'descriptive' | 'custom';
  min: number;
  max: number;
  labels: RatingLabel[];
  includeNotObserved: boolean;
  notObservedLabel?: string;
}

interface RatingLabel {
  value: number | string;
  label: string;                    // "Highly Effective"
  description: string;              // Full descriptor
  color?: string;                   // UI color
}

interface FrameworkAlignment {
  id: string;
  name: string;                     // "Culturally Responsive Teaching"
  category: string;                 // "CRP", "CASEL", "Tripod"
  subcategory?: string;
  description: string;
  color: string;
  icon?: string;
  weight?: number;

  // Applicability
  applicableTypes: string[];        // ["observation", "evaluation"]
  applicableDivisions: string[];    // ["elementary", "middle", "high"]
}
```

**Indexes**:
```
- schoolId (ascending), status (ascending)
- status (ascending), usageCount (descending)
- type (ascending), status (ascending)
```

---

### 3. `observations` Collection

**Purpose**: Store classroom observations

```typescript
{
  // Document ID: Auto-generated

  // Core Identification
  id: string;
  schoolId: string;                 // Indexed
  divisionId: string;               // Indexed
  departmentId?: string;            // Indexed

  // Participants
  subjectId: string;                // Teacher being observed, indexed
  subjectName: string;              // Cached
  observerId: string;               // Observer, indexed
  observerName: string;             // Cached

  // Context
  context: {
    type: string;                   // "classroom", "meeting", "evaluation"

    // For classroom observations
    className?: string;
    subject?: string;               // Indexed for subject analytics
    grade?: string;
    room?: string;
    period?: string;
    studentCount?: number;
    lessonPhase?: string;

    // For evaluations
    position?: string;
    division?: string;
    department?: string;            // Can differ from main departmentId

    // Timing
    date: Timestamp;                // Indexed
    startTime: Timestamp;
    endTime?: Timestamp;
    duration: number;               // Minutes
  };

  // Framework & Data
  frameworkId: string;              // Reference to frameworks/{id}, indexed
  frameworkName: string;            // Cached
  frameworkVersion: string;
  responses: ObservationResponse[]; // Array of responses
  overallComments: string;

  // Analysis (calculated based on framework)
  evidenceCount: number;
  totalQuestions: number;
  evidencePercentage: number;
  frameworkScores: FrameworkScore[];

  // CRP-specific analysis fields (legacy, can be deprecated)
  crpEvidenceCount: number;
  totalLookFors: number;
  crpPercentage: number;
  strengths: string[];
  growthAreas: string[];

  // Media & Evidence
  attachments: MediaFile[];
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: Timestamp;
  };

  // Status & Workflow
  status: 'draft' | 'completed' | 'submitted' | 'reviewed'; // Indexed
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;

  // Follow-up
  followUpRequired: boolean;
  followUpCompleted: boolean;
  followUpNotes?: string;

  // Teacher Feedback
  teacherComment?: string;          // Teacher's response/reflection

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
  metadata: Map<string, any>;
}

// Nested Types

interface ObservationResponse {
  questionId: string;
  questionText: string;             // Cached
  rating: string;                   // "1", "2", "3", "4", "not-observed"
  ratingText: string;               // "Highly Effective"
  comments: string;
  evidence: string[];               // Text evidence
  tags: string[];
  frameworkAlignments: string[];    // Alignment IDs
  confidence: 'low' | 'medium' | 'high';
  timestamp: Timestamp;
}

interface FrameworkScore {
  alignmentId: string;
  alignmentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  evidenceCount: number;
  questionCount: number;
}

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;                      // Firebase Storage URL
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
}
```

**Indexes**:
```
- schoolId (ascending), status (ascending), context.date (descending)
- subjectId (ascending), status (ascending), context.date (descending)
- observerId (ascending), status (ascending), context.date (descending)
- frameworkId (ascending), status (ascending)
- divisionId (ascending), status (ascending), context.date (descending)
- departmentId (ascending), status (ascending), context.date (descending)
- context.subject (ascending), status (ascending)
- Composite: schoolId (asc), frameworkId (asc), status (asc), context.date (desc)
- Composite: subjectId (asc), status (asc), context.date (desc)
- Composite: divisionId (asc), departmentId (asc), status (asc)
```

---

### 4. `observations/{observationId}/comments` Subcollection

**Purpose**: Store comments on observations (observers, administrators, teachers)

```typescript
{
  // Document ID: Auto-generated

  id: string;
  observationId: string;

  // Author
  authorId: string;
  authorName: string;
  authorRole: string;

  // Content
  comment: string;
  type: 'observer' | 'administrator' | 'teacher' | 'followup';

  // Visibility
  isPrivate: boolean;               // Only visible to author and admins
  visibleTo: string[];              // User IDs

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Editing
  editedAt?: Timestamp;
  editedBy?: string;
}
```

**Indexes**:
```
- observationId (ascending), createdAt (descending)
- authorId (ascending), createdAt (descending)
```

---

### 5. `departments` Collection

**Purpose**: Store academic departments

```typescript
{
  // Document ID: Auto-generated or custom

  id: string;
  schoolId: string;                 // Indexed
  name: string;
  description: string;
  headId: string;                   // Department head user ID
  members: string[];                // User IDs, array-contains index
  subjects: string[];               // Subjects taught in this department
  budgetCode?: string;

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes**:
```
- schoolId (ascending)
- members (array-contains)
- headId (ascending)
```

---

### 6. `divisions` Collection

**Purpose**: Store school divisions (Elementary, Middle, High School)

```typescript
{
  // Document ID: Auto-generated or custom

  id: string;
  schoolId: string;                 // Indexed
  name: string;
  type: 'elementary' | 'middle' | 'high' | 'early_learning_center' | 'central_admin';
  description?: string;
  directorId?: string;              // Division director user ID
  assistantDirectorIds: string[];
  departments: string[];            // Department IDs
  grades: string[];

  // Settings
  settings: Map<string, any>;

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes**:
```
- schoolId (ascending)
- type (ascending)
- directorId (ascending)
```

---

### 7. `schools` Collection

**Purpose**: Store individual schools

```typescript
{
  // Document ID: Auto-generated or custom

  id: string;
  organizationId: string;           // Parent organization, indexed
  name: string;
  shortName: string;
  type: 'elementary' | 'middle' | 'high' | 'k12' | 'specialty';
  grades: string[];

  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };

  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
    fax?: string;
  };

  principalId: string;
  assistantPrincipalIds: string[];

  settings: Map<string, any>;

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes**:
```
- organizationId (ascending)
- type (ascending)
- principalId (ascending)
```

---

### 8. `organizations` Collection

**Purpose**: Store school districts/organizations

```typescript
{
  // Document ID: Auto-generated or custom

  id: string;
  name: string;
  type: 'district' | 'school' | 'charter' | 'private';

  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };

  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
    fax?: string;
  };

  settings: Map<string, any>;
  timezone: string;

  academicYear: {
    startDate: Timestamp;
    endDate: Timestamp;
    year: string;                   // "2024-2025"
    terms: Term[];
  };

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Term {
  id: string;
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  type: 'semester' | 'quarter' | 'trimester';
}
```

**Indexes**:
```
- type (ascending)
```

---

### 9. `schedules` Collection

**Purpose**: Store master schedules

```typescript
{
  // Document ID: Auto-generated

  id: string;
  schoolId: string;                 // Indexed

  // Schedule Info
  name: string;                     // "2024-2025 Master Schedule"
  academicYear: string;             // "2024-2025"
  scheduleType: 'traditional' | 'block' | 'rotating' | 'flexible' | 'hybrid';

  // Day Structure
  dayTypes: DayType[];
  periods: Period[];

  // Schedule Metadata
  startDate: Timestamp;
  endDate: Timestamp;
  isActive: boolean;

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface DayType {
  id: string;
  name: string;                     // "Day A", "Monday"
  shortName: string;                // "A", "M"
  description?: string;
  color?: string;
  order: number;
}

interface Period {
  id: string;
  name: string;                     // "Period 1", "Block A"
  shortName: string;                // "P1", "A"
  startTime: string;                // "08:00"
  endTime: string;                  // "08:50"
  duration: number;                 // Minutes
  order: number;
  type: 'class' | 'lunch' | 'planning' | 'homeroom' | 'assembly' | 'break';
  applicableDays: string[];         // Day type IDs
}
```

**Indexes**:
```
- schoolId (ascending), isActive (ascending)
- schoolId (ascending), academicYear (ascending)
```

---

### 10. `educatorSchedules` Collection

**Purpose**: Store individual teacher schedules and class assignments

```typescript
{
  // Document ID: Auto-generated

  id: string;
  educatorId: string;               // User ID, indexed
  educatorName: string;             // Cached
  schoolId: string;                 // Indexed
  divisionId: string;
  masterScheduleId: string;         // Reference to schedules/{id}

  // Academic Info
  academicYear: string;
  semester?: string;                // "Fall", "Spring", "Full Year"

  // Class Assignments
  classAssignments: ClassAssignment[];

  // Schedule Metadata
  totalPeriods: number;
  teachingPeriods: number;
  planningPeriods: number;
  teachingLoad: number;             // Percentage

  // Effective Dates
  startDate: Timestamp;
  endDate: Timestamp;
  isActive: boolean;

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ClassAssignment {
  id: string;

  // Class Details
  className: string;                // "Algebra I - Period 3"
  courseId?: string;
  courseName: string;               // "Algebra I"
  courseCode?: string;              // "MATH101"

  // Academic Details
  subject: string;                  // "Mathematics"
  grade: string;                    // "9"
  gradeLevel: string[];             // ["9", "10"] for multi-grade

  // Schedule Details
  dayTypes: string[];               // ["A", "B"]
  periods: string[];                // Period IDs

  // Location
  roomNumber: string;
  building?: string;
  location?: string;

  // Class Info
  studentCount?: number;
  maxCapacity?: number;

  // Co-Teaching & Support
  coTeachers: string[];             // User IDs
  paraprofessionals: string[];      // User IDs

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

  isActive: boolean;
}
```

**Indexes**:
```
- educatorId (ascending), isActive (ascending)
- schoolId (ascending), academicYear (ascending)
- masterScheduleId (ascending)
```

---

### 11. `professionalLearning` Collection

**Purpose**: Store professional learning goals and activities

```typescript
{
  // Document ID: Auto-generated

  id: string;
  userId: string;                   // Indexed
  userName: string;                 // Cached
  schoolId: string;                 // Indexed

  // Goal Info
  title: string;
  description: string;
  type: 'individual' | 'department' | 'school' | 'district';
  category: string;                 // "Instruction", "Technology", "Leadership"

  // SMART Goal Components
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;

  // Timeline
  startDate: Timestamp;
  targetDate: Timestamp;
  completedDate?: Timestamp;

  // Progress
  status: 'planning' | 'in_progress' | 'completed' | 'abandoned';
  progressPercentage: number;       // 0-100

  // Connection to Observations
  relatedObservations: string[];    // Observation IDs
  growthAreas: string[];            // From observation insights

  // Activities
  activities: Activity[];

  // Support & Resources
  supportNeeded: string[];
  resources: string[];
  mentor?: string;                  // User ID

  // System
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata: Map<string, any>;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'course' | 'observation' | 'reading' | 'project' | 'other';
  date?: Timestamp;
  completed: boolean;
  completedDate?: Timestamp;
  notes?: string;
  evidence?: string[];              // URLs or file paths
}
```

**Indexes**:
```
- userId (ascending), status (ascending)
- schoolId (ascending), status (ascending)
- status (ascending), targetDate (ascending)
```

---

### 12. `notifications` Collection

**Purpose**: Store user notifications

```typescript
{
  // Document ID: Auto-generated

  id: string;
  userId: string;                   // Indexed

  // Content
  title: string;
  message: string;
  type: 'observation' | 'evaluation' | 'goal' | 'reminder' | 'announcement' | 'report';

  // Action
  actionUrl?: string;
  actionText?: string;

  // Related Data
  relatedId?: string;               // ID of related observation, goal, etc.
  relatedType?: string;             // "observation", "goal", etc.

  // Status
  isRead: boolean;                  // Indexed
  readAt?: Timestamp;

  // Delivery
  deliveryMethod: string[];         // ["in_app", "email", "push"]
  sentAt?: Timestamp;

  // System
  createdAt: Timestamp;
  expiresAt?: Timestamp;            // Auto-delete after this date
}
```

**Indexes**:
```
- userId (ascending), isRead (ascending), createdAt (descending)
- userId (ascending), type (ascending), createdAt (descending)
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isSuperAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.primaryRole == 'super_admin';
    }

    function isAdministrator() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.primaryRole in ['administrator', 'super_admin'];
    }

    function isManager() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.primaryRole in ['manager', 'administrator', 'super_admin'];
    }

    function isObserver() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.primaryRole in ['observer', 'manager', 'administrator', 'super_admin'];
    }

    function isSameSchool(schoolId) {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.schoolId == schoolId;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users Collection
    match /users/{userId} {
      allow read: if isAuthenticated() && isSameSchool(resource.data.schoolId);
      allow create: if isAdministrator();
      allow update: if isOwner(userId) || isAdministrator();
      allow delete: if isAdministrator();
    }

    // Frameworks Collection
    match /frameworks/{frameworkId} {
      allow read: if isAuthenticated() && isSameSchool(resource.data.schoolId);
      allow create: if isAdministrator();
      allow update: if isAdministrator();
      allow delete: if isAdministrator();
    }

    // Observations Collection
    match /observations/{observationId} {
      allow read: if isAuthenticated() && (
        isSameSchool(resource.data.schoolId) ||
        isOwner(resource.data.subjectId) ||
        isOwner(resource.data.observerId)
      );
      allow create: if isObserver();
      allow update: if isObserver() ||
                      isOwner(resource.data.subjectId) ||
                      isManager();
      allow delete: if isAdministrator();

      // Subcollection: Comments
      match /comments/{commentId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
        allow update: if isOwner(resource.data.authorId) || isAdministrator();
        allow delete: if isOwner(resource.data.authorId) || isAdministrator();
      }
    }

    // Departments Collection
    match /departments/{departmentId} {
      allow read: if isAuthenticated() && isSameSchool(resource.data.schoolId);
      allow create: if isAdministrator();
      allow update: if isManager();
      allow delete: if isAdministrator();
    }

    // Divisions Collection
    match /divisions/{divisionId} {
      allow read: if isAuthenticated() && isSameSchool(resource.data.schoolId);
      allow create: if isAdministrator();
      allow update: if isAdministrator();
      allow delete: if isAdministrator();
    }

    // Schools Collection
    match /schools/{schoolId} {
      allow read: if isAuthenticated();
      allow create: if isSuperAdmin();
      allow update: if isAdministrator();
      allow delete: if isSuperAdmin();
    }

    // Organizations Collection
    match /organizations/{organizationId} {
      allow read: if isAuthenticated();
      allow create: if isSuperAdmin();
      allow update: if isSuperAdmin();
      allow delete: if isSuperAdmin();
    }

    // Schedules Collection
    match /schedules/{scheduleId} {
      allow read: if isAuthenticated() && isSameSchool(resource.data.schoolId);
      allow create: if isAdministrator();
      allow update: if isAdministrator();
      allow delete: if isAdministrator();
    }

    // Educator Schedules Collection
    match /educatorSchedules/{scheduleId} {
      allow read: if isAuthenticated() && (
        isOwner(resource.data.educatorId) ||
        isSameSchool(resource.data.schoolId)
      );
      allow create: if isAdministrator();
      allow update: if isAdministrator();
      allow delete: if isAdministrator();
    }

    // Professional Learning Collection
    match /professionalLearning/{goalId} {
      allow read: if isAuthenticated() && (
        isOwner(resource.data.userId) ||
        isManager()
      );
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isManager();
      allow delete: if isOwner(resource.data.userId) || isAdministrator();
    }

    // Notifications Collection
    match /notifications/{notificationId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }
  }
}
```

---

## Data Migration Script

For migrating existing data to new schema (especially for `departmentId` → `departmentIds`):

```typescript
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

async function migrateUserDepartments() {
  const db = getFirestore();
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);

  let count = 0;

  for (const userDoc of snapshot.docs) {
    const userData = userDoc.data();

    // Skip if already migrated
    if (userData.departmentIds !== undefined) {
      continue;
    }

    const updates: any = {};

    // Migrate departmentId to new structure
    if (userData.departmentId) {
      updates.primaryDepartmentId = userData.departmentId;
      updates.departmentIds = [userData.departmentId];
    } else {
      updates.primaryDepartmentId = null;
      updates.departmentIds = [];
    }

    // Add primarySubject if subjects exist
    if (userData.subjects && userData.subjects.length > 0) {
      updates.primarySubject = userData.subjects[0];
    }

    await updateDoc(doc(db, 'users', userDoc.id), updates);
    count++;

    console.log(`Migrated user: ${userDoc.id}`);
  }

  console.log(`Migration complete. Updated ${count} users.`);
}

// Run migration
migrateUserDepartments().catch(console.error);
```

---

## Summary

This schema provides:

✅ **Complete user profiles** with multi-department/subject support
✅ **Framework-driven observations** with dynamic questions and scoring
✅ **Comprehensive organizational structure** (organizations, schools, divisions, departments)
✅ **Scheduling system** (master schedules, educator schedules, class assignments)
✅ **Professional learning** goals tied to observation insights
✅ **Security rules** enforcing role-based access control
✅ **Optimized indexes** for common query patterns
✅ **Subcollections** for scalability (comments)
✅ **Migration scripts** for existing data

All collections support the framework-driven architecture where frameworks are the single source of truth for observations, analytics, and insights.
