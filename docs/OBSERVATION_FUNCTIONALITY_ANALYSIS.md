# Observation Functionality Analysis - EducatorEval

## Executive Summary

The EducatorEval platform has a foundational CRP (Culturally Responsive Pedagogy) observation system with role-based access control in place. However, **there is NO role-based filtering or display logic currently implemented** for observations. All authenticated users see the same observations list regardless of their role (teacher/educator, observer, manager, etc.).

This document outlines the current architecture and identifies what needs to be built for full teacher and observer support.

---

## Current Observation Features and Components

### 1. Observation Components Structure

**Location:** `/Users/bfawcett/GitHub/EducatorEval/app/components/features/observations/`

Current components:
- **ObservationsPage.tsx** - Main list/dashboard view (19.3KB)
- **ObservationForm.tsx** - Live observation form with 10 integrated look-fors (20.3KB)
- **ObservationsContent.tsx** - Alternative list view with Firestore integration (11.5KB)
- **SimpleObservationsPage.tsx** - Simplified view variant (11.9KB)
- **ObservationScheduler.tsx** - Scheduling functionality (21.3KB)
- **MobileObservationForm.tsx** - Mobile-optimized form (empty file)
- ObservationPageWithNavigation.tsx, ObservationSchedulerWrapper.tsx, ObservationsPageWrapper.tsx - Wrapper variants

### 2. Observation Data Model

**File:** `/Users/bfawcett/GitHub/EducatorEval/app/types/observation.ts`

**Core Observation Interface:**
```typescript
interface Observation {
  // Core Identification
  id: string;
  schoolId: string;
  divisionId: string;
  departmentId?: string;

  // Participants
  subjectId: string;           // Teacher being observed
  subjectName: string;
  observerId: string;          // Observer conducting observation
  observerName: string;

  // Context (Flexible for different observation types)
  context: ObservationContext; // Contains: date, startTime, endTime, duration, className, subject, grade, room, period, etc.

  // Framework & Data
  frameworkId: string;
  frameworkName: string;
  responses: ObservationResponse[];
  overallComments: string;

  // Status Workflow (KEY FIELD FOR FILTERING)
  status: 'draft' | 'completed' | 'submitted' | 'reviewed';
  submittedAt?: Date;
  reviewedAt?: Date;

  // CRP-Specific Analysis
  crpEvidenceCount: number;
  totalLookFors: number;
  crpPercentage: number;

  // System
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
```

**ObservationContext (Contains Date/Time Information):**
```typescript
interface ObservationContext {
  type: string;           // classroom, meeting, evaluation, etc.
  date: Date;            // OBSERVATION DATE
  startTime: Date;       // OBSERVATION START
  endTime?: Date;        // OBSERVATION END
  duration: number;      // minutes
  className?: string;
  subject?: string;
  grade?: string;
  room?: string;
  period?: string;
  studentCount?: number;
}
```

**Key Status Values in Data:**
- `draft` - In progress, not yet submitted
- `completed` - Observation finished
- `submitted` - Sent for review
- `reviewed` - Completed review process

### 3. Observation API & Hooks

**File:** `/Users/bfawcett/GitHub/EducatorEval/app/api/observations.ts`

**Current API Methods:**

```typescript
// Framework Management
frameworks.list(filters?: any)           // Get all frameworks
frameworks.getById(id: string)
frameworks.create(frameworkData: any)
frameworks.update(id: string, updates: any)
frameworks.delete(id: string)

// Observation Management
observations.list(filters?: any)         // CURRENT: Can filter by:
  - educatorId                          // Teacher/educator being observed
  - observerId                          // Observer conducting observation
  - schoolId
  - divisionId
  - frameworkId
  - status                              // draft, completed, submitted, reviewed
  - dateFrom / dateTo                   // Date range
  - limit

observations.getById(id: string)
observations.create(observationData: any)
observations.createWithSchedule(observationData: any)
observations.update(id: string, updates: any)
observations.delete(id: string)

// Workflow Actions
observations.submit(id: string)         // Submit for review
observations.approve(id: string, feedback?: string)

// Analytics
analytics.getDashboardStats(filters?: any)
analytics.getObservationTrends(filters?: any)
analytics.getCRPEvidence(filters?: any)
analytics.exportObservations(format: 'csv' | 'excel' | 'pdf', filters?: any)
```

**React Query Hooks:**

File: `/Users/bfawcett/GitHub/EducatorEval/app/hooks/useObservations.ts`

```typescript
useObservations(schoolId?: string)              // List all observations
useObservation(observationId: string)           // Get single observation
useCreateObservation()                          // Create mutation
useUpdateObservation()                          // Update mutation
useDeleteObservation()                          // Delete mutation
useObservationSubscription(observationId: string, callback)  // Real-time updates
```

---

## How Observations Are Currently Filtered/Displayed

### 1. Frontend Filtering (ObservationsPage.tsx)

**Current filters:**
```typescript
const filteredObservations = useMemo(() => {
  if (!observations) return [];
  
  return observations.filter(obs => {
    const matchesSearch = !searchTerm || 
      obs.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.gradeLevel?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;
    
    const matchesFramework = selectedFramework === 'all' || obs.frameworkId === selectedFramework;
    
    return matchesSearch && matchesStatus && matchesFramework;
  });
}, [observations, searchTerm, statusFilter, selectedFramework]);
```

**Available UI Filters:**
- Text search (teacher name, subject, grade)
- Status dropdown (All, Scheduled, In Progress, Completed)
- Framework dropdown (All frameworks)
- Clear filters button

### 2. Statistics Displayed

```typescript
const stats = {
  total: observations.length,
  completed: observations.filter(obs => obs.status === 'completed').length,
  inProgress: observations.filter(obs => obs.status === 'in_progress').length,
  scheduled: observations.filter(obs => obs.status === 'scheduled').length,
  crpEvidence: observations.filter(obs => 
    obs.crpEvidence && Object.values(obs.crpEvidence).some(Boolean)
  ).length,
};
```

### 3. Display List Item Information

Each observation card shows:
- Teacher name
- Status badge (with icon and color coding)
- Subject
- Grade
- Duration
- Scheduled date
- CRP evidence indicators (multi-colored badges)
- Action buttons (View, Edit, Delete)

---

## Role-Based Access Control System

**File:** `/Users/bfawcett/GitHub/EducatorEval/app/stores/mockAuthStore.ts`

### User Roles (6-level hierarchy)

1. **`staff`** - Basic access
2. **`educator`** - Teachers, can view own observations
3. **`observer`** - Can conduct observations and evaluations
4. **`manager`** - Department heads, manage teams
5. **`administrator`** - School admins, full user management
6. **`super_admin`** - System-wide access

### Current Permission System

**User has:**
- `primaryRole` - Main role (e.g., educator)
- `secondaryRoles` - Array of additional roles (e.g., [administrator, observer])
- `permissions` - Flat list of permission strings (e.g., "observations.view", "observations.create")

**Helper Methods:**
```typescript
hasRole(role: UserRole): boolean           // Check if user has specific role
hasPermission(permission: string): boolean // Check if user has permission
isAdmin(): boolean                         // super_admin OR administrator
canObserve(): boolean                      // observer, manager, administrator, or super_admin
canManage(): boolean                       // manager, administrator, or super_admin
getAvailableRoles(): UserRole[]           // Get all roles user can switch between
```

### Current Mock User (for development)

```typescript
{
  id: 'super-admin-001',
  email: 'admin@sas.edu.sg',
  primaryRole: 'super_admin',
  secondaryRoles: ['administrator', 'educator', 'observer'],
  permissions: [
    'observations.view',
    'observations.create',
    'observations.edit',
    'observations.delete',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'profile.edit'
  ]
}
```

### Current Role-Based Logic in Components

**In ObservationsPage.tsx:**
```typescript
const { user, hasPermission } = useAuthStore();

// Show "New Observation" button only if user has permission
{hasPermission('observations', 'create') && (
  <button onClick={() => setShowObservationForm(true)}>
    <Plus className="w-4 h-4 mr-2" />
    New Observation
  </button>
)}

// Show Edit button only if user has permission
{hasPermission('observations', 'update') && (
  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
    <Edit className="w-4 h-4" />
  </button>
)}

// Show Delete button only if user has permission
{hasPermission('observations', 'delete') && (
  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
    <Trash2 className="w-4 h-4" />
  </button>
)}
```

**Key Issue:** Permissions are checked at component level, but there is **NO filtering of the observation list itself** based on the user's role or who they are observing.

---

## Existing Observation Features

### 1. Observation Lifecycle

- **Draft** - Started but not completed
- **Completed** - All questions answered
- **Submitted** - Sent for review
- **Reviewed** - Feedback provided

### 2. Integration with Schedule System

The observation API has auto-population from schedule:
```typescript
observations.autoPopulateFromSchedule(educatorId, date?)
observations.createWithSchedule(observationData)
```

This pre-fills observation forms with:
- Current class information
- Room number
- Period
- Scheduled start/end times
- Enrolled student count

### 3. CRP Framework Structure

**10 Integrated Look-Fors** from `ObservationForm.tsx`:

1. Learning target clearly communicated and relevant
2. Respectful, inclusive, identity-affirming environment
3. Checks for understanding and adjusts instruction
4. Questioning strategies that increase cognitive demand
5. Meaningful, collaborative learning experiences
6. Cultural competence and student background integration
7. Active monitoring and support during work
8. Student reflection opportunities
9. Strong, trusting relationships with students
10. Differentiated instruction with scaffolds

Each aligned with multiple frameworks:
- CRP (Culturally Responsive Pedagogy)
- CASEL (Social-Emotional Learning)
- Tripod 7Cs
- 5 Daily Assessment Practices
- Panorama Student Experience
- Inclusive Practices

### 4. Framework System

**Pre-built framework alignments:**
- CRP (General, Curriculum Relevance, High Expectations, Learning Partnerships)
- CASEL (Self-Awareness, Social Awareness, Relationship Skills)
- Tripod (Care, Challenge)
- 5 Daily Assessment Practices
- Panorama (Student Experience)
- Inclusive Practices

### 5. Response Capture

```typescript
interface ObservationResponse {
  questionId: string;
  questionText: string;
  rating: string;              // "1", "2", "3", "4", "not-observed"
  ratingText: string;
  comments: string;
  evidence: string[];
  tags: string[];
  frameworkAlignments: string[];
  confidence: 'low' | 'medium' | 'high';
  timestamp: Date;
}
```

### 6. Media & Evidence Support

- Photo capture
- Audio recording
- GPS location tagging
- File attachments

### 7. Analytics & Reporting

- Dashboard statistics
- CRP evidence tracking
- Trend analysis
- Export to CSV/Excel/PDF

---

## What's MISSING for Teacher and Observer Requirements

### 1. Role-Based Observation Filtering

**Currently MISSING:**
- Teachers (educators) cannot see only their own observations
- Observers cannot filter by observations they conducted
- No filtering by observed educator (subjectId)
- No "My Observations" vs "Observations of Me" distinction

**What needs to be added:**
- Filter observations where user.id === observation.subjectId (observations of this teacher)
- Filter observations where user.id === observation.observerId (observations I conducted)
- Separate views based on user role

### 2. Teacher-Specific Features (Not Present)

**Missing:**
- View observations where I am the subject (being observed)
- View feedback/reviews from my observations
- Professional learning goals linked to observations
- Self-reflection prompts
- Progress tracking on identified growth areas
- Peer review/360 feedback mechanisms

### 3. Observer-Specific Features (Not Present)

**Missing:**
- List of assigned educators to observe
- Schedule observations with consent from teacher
- Draft observations (in progress)
- Submit observations for principal review
- Track observation completion rates
- Evidence/photo library per observation
- Real-time observation form with live note-taking

### 4. Status Workflow Enhancements Needed

**Current states:** draft, completed, submitted, reviewed

**What's missing for full workflow:**
- scheduled → assigned observation (needs observer + teacher agreement)
- draft → in_progress (observation currently happening)
- Additional permissions checks per status
- Transition rules (who can move observation to next state)

### 5. Consent & Notification System (Not Present)

**Missing:**
- Teachers must consent to scheduled observations
- Automatic notifications when observation scheduled
- Notification when feedback provided
- Feedback visibility based on review status

### 6. Data Access Control (Not Enforced)

**Currently MISSING:**
- No backend filtering based on user role
- API returns all observations regardless of who's asking
- No security boundary between users
- A teacher could see another teacher's observations if they know the URL

---

## Summary: What Needs to Be Built

### Phase 1: Core Role-Based Filtering

1. **Add role checks to API layer** (observations.ts)
   - Filter list() results based on user role and ID
   - Enforce permission checks before returning observations

2. **Update useObservations hook** to pass user context
   - Include userId and role in query key
   - Auto-filter based on user role

3. **Create role-specific components**
   - TeacherObservationsView (observations of me + my submitted observations)
   - ObserverObservationsView (observations I conducted)
   - ManagerObservationsView (observations of my team)
   - AdminObservationsView (all observations with admin controls)

4. **Update observations page** to show role-appropriate view

### Phase 2: Teacher-Specific UX

1. Create feedback/review display component
2. Add professional learning goal linking
3. Implement self-reflection form
4. Add growth area tracking dashboard

### Phase 3: Observer-Specific UX

1. Create "Observations to Conduct" view (scheduled observations)
2. Add real-time observation form with better mobile support
3. Create submission workflow with status tracking
4. Add evidence management (photos, recordings, notes)

### Phase 4: Full Workflow & Permissions

1. Implement observation scheduling with consent
2. Add notifications system
3. Add approval workflow (observer submits → principal reviews)
4. Create feedback form for reviewers
5. Implement status transition rules with permissions

---

## File Locations Reference

**Core Observation Files:**
- Types: `/Users/bfawcett/GitHub/EducatorEval/app/types/observation.ts`
- API: `/Users/bfawcett/GitHub/EducatorEval/app/api/observations.ts`
- Hooks: `/Users/bfawcett/GitHub/EducatorEval/app/hooks/useObservations.ts`
- Components: `/Users/bfawcett/GitHub/EducatorEval/app/components/features/observations/`
- Pages: `/Users/bfawcett/GitHub/EducatorEval/app/app/ObservationsPage.tsx`

**Auth/Permissions:**
- Auth Store: `/Users/bfawcett/GitHub/EducatorEval/app/stores/mockAuthStore.ts`
- Auth Selector: `/Users/bfawcett/GitHub/EducatorEval/app/stores/auth.ts`
- Types: `/Users/bfawcett/GitHub/EducatorEval/app/types/core.ts`

**Routing:**
- Main App: `/Users/bfawcett/GitHub/EducatorEval/App.tsx` (lines 42-43 for observations route)

---

## Key Observations

1. **The infrastructure exists** - role system, permissions, hooks, API filtering options are all in place
2. **Implementation is incomplete** - the UI doesn't filter based on user roles
3. **API layer needs security** - no server-side enforcement of permissions currently
4. **Status field is ready** - observation.status supports draft/completed/submitted/reviewed
5. **Date information is there** - context.date captures observation date/time
6. **Participant tracking exists** - subjectId and observerId are captured but not used for filtering

The platform is ready for role-based features - it just needs the filtering logic implemented in the React components and enforced at the API level.
