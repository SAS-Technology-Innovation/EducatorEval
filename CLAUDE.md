# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EducatorEval is an educational evaluation platform built with **Vite**, **React 19**, **TypeScript**, and **Firebase**. It provides:

- **Framework-driven classroom observations** (CRP, CASEL, Tripod, custom frameworks)
- **Role-based access control** for teachers, observers, managers, and administrators
- **Dynamic analytics and insights** that adapt to any observation framework
- **Professional learning goals** and development tracking

**Architecture**: Pure React SPA with React Router - migrated from Astro to eliminate SSR complications with React Query.

**Key Innovation**: The observation system is **completely framework-driven**. Frameworks are data (stored in Firestore), not code. This means new observation frameworks can be added without touching code.

---

## Development Commands

```bash
# Development
npm run dev                    # Start Vite dev server (auto-assigns port, usually 4321-4322)
npm run dev:emulated          # Run with Firebase emulators

# Building
npm run build                 # Build for production (Vite only)
npm run build:check           # Build with TypeScript type checking
npm run preview               # Preview production build

# Testing
npm run test                  # Run Vitest tests

# Firebase Deployment
npm run deploy                # Deploy everything
npm run deploy:hosting        # Deploy hosting only
npm run deploy:rules          # Deploy Firestore/Storage rules only

# Firebase Emulators
npm run emulators             # Start Firebase emulators
npm run emulators:export      # Export emulator data
npm run emulators:import      # Start with imported data
```

---

## Core Architecture Principles

### 1. **Framework as Single Source of Truth**

The observation framework stored in Firestore drives:
- ✅ Observation form questions and structure
- ✅ Rating scales and response types
- ✅ Analytics and insights calculations
- ✅ Section groupings and weights
- ✅ Framework alignments (CRP, CASEL, Tripod, etc.)

**Key Benefit**: Add new frameworks via Firebase Console/Admin UI without deploying code.

### 2. **Role-Based Views**

Different user roles see completely different interfaces:
- **Teachers (`educator`)**: Past observations only, insights dashboard, comment submission
- **Observers (`observer`)**: Their observations, quick create, drafts first
- **Managers/Administrators**: Full observation management, all users' observations

### 3. **Type-Safe with TypeScript**

Comprehensive type definitions in `app/types/` ensure compile-time safety across the application.

---

## Directory Structure

```
EducatorEval/
├── App.tsx                  # Main routing & auth (in root, not app/)
├── main.tsx                 # React initialization
├── index.html               # HTML entry point
├── app/                     # ALL application code (moved from src/)
│   ├── admin/               # Admin pages
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Organizations.tsx
│   │   └── Frameworks.tsx
│   ├── auth/                # Auth pages
│   │   └── LoginForm.tsx
│   ├── public/              # Public pages
│   │   └── LandingPage.tsx
│   ├── app/                 # App-level pages
│   │   ├── DashboardPage.tsx
│   │   ├── ObservationsPageRoleRouter.tsx  # ← Role-based observation routing
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   ├── components/          # React components
│   │   ├── admin/
│   │   ├── common/          # Reusable UI (Button, Modal, etc.)
│   │   ├── dashboard/
│   │   ├── features/
│   │   │   └── observations/  # ← OBSERVATION SYSTEM (see below)
│   │   ├── layout/          # AppLayout, Sidebar, Header
│   │   ├── providers/       # AppProviders, AuthWrapper
│   │   └── user/
│   ├── hooks/               # React Query hooks
│   │   ├── useObservations.ts
│   │   ├── useFrameworks.ts
│   │   └── useAuth.ts
│   ├── stores/              # Zustand state management
│   │   ├── authStore.ts     # Firebase auth (production)
│   │   ├── mockAuthStore.ts # Mock auth (development)
│   │   └── auth.ts          # Facade (selects which to use)
│   ├── api/                 # Firebase API wrappers
│   │   ├── core.ts
│   │   └── observations.ts
│   ├── types/               # TypeScript definitions
│   │   ├── index.ts         # ← Import from here
│   │   ├── core.ts
│   │   ├── observation.ts
│   │   └── professional-learning.ts
│   ├── lib/                 # Firebase config
│   │   ├── firebase.ts
│   │   └── firestore.ts
│   ├── utils/               # Helper functions
│   │   └── roleMapping.ts
│   └── styles/              # Global CSS
│       └── global.css
├── docs/                    # Technical documentation
├── summaries/               # Historical planning docs (archived)
├── CLAUDE.md                # This file
├── README.md
├── CHANGELOG.md
└── RELEASES.md
```

---

## Routing Structure

**File**: `App.tsx` (in root directory)

```typescript
<Routes>
  {/* Public */}
  <Route path="/" element={<LandingPage />} />

  {/* Auth */}
  <Route path="/auth/login" element={<LoginPage />} />
  <Route path="/auth/signup" element={<LoginPage />} />
  <Route path="/auth/reset" element={<LoginPage />} />

  {/* App (Protected) */}
  <Route path="/app/dashboard" element={
    <ProtectedLayout><DashboardPage /></ProtectedLayout>
  } />
  <Route path="/app/observations" element={
    <ProtectedLayout><ObservationsPageRoleRouter /></ProtectedLayout>  {/* ← Role-based routing */}
  } />
  <Route path="/app/profile" element={
    <ProtectedLayout><ProfilePage /></ProtectedLayout>
  } />
  <Route path="/app/settings" element={
    <ProtectedLayout><SettingsPage /></ProtectedLayout>
  } />

  {/* Admin (Requires administrator/super_admin) */}
  <Route path="/admin" element={
    <ProtectedLayout requireRoles={['administrator', 'super_admin']}>
      <AdminDashboard />
    </ProtectedLayout>
  } />
  <Route path="/admin/users" element={
    <ProtectedLayout requireRoles={['administrator', 'super_admin']}>
      <AdminUsers />
    </ProtectedLayout>
  } />
  <Route path="/admin/organizations" element={
    <ProtectedLayout requireRoles={['administrator', 'super_admin']}>
      <AdminOrganizations />
    </ProtectedLayout>
  } />
  <Route path="/admin/frameworks" element={
    <ProtectedLayout requireRoles={['administrator', 'super_admin']}>
      <AdminFrameworks />
    </ProtectedLayout>
  } />

  {/* Legacy Redirects */}
  <Route path="/login" element={<Navigate to="/auth/login" replace />} />
  <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
  <Route path="/observations" element={<Navigate to="/app/observations" replace />} />
</Routes>
```

---

## Framework-Driven Observation System

### The Big Picture

```
Framework (Firestore) → DynamicObservationForm → Observation (Firestore) → Analytics (Framework-Driven)
```

Everything adapts to the framework definition. Change the framework, everything changes automatically.

### Core Data Types

#### 1. Framework Type (`app/types/observation.ts`)

```typescript
interface Framework {
  // Identity
  id: string;
  name: string;              // "CRP Framework v2.0"
  description: string;
  version: string;           // "2.0"
  status: 'active' | 'draft' | 'archived' | 'deprecated';

  // Structure
  sections: FrameworkSection[];  // Sections with questions
  totalQuestions: number;
  requiredQuestions: number;
  estimatedDuration: number;     // minutes

  // Alignments (cross-cutting themes)
  alignments: FrameworkAlignment[];  // CRP, CASEL, Tripod, etc.
  tags: string[];
  categories: string[];

  // Scope
  schoolId: string;
  applicableDivisions: DivisionType[];  // Elementary, Middle, High, ELC

  // Analytics (auto-updated)
  usageCount: number;
  lastUsed?: Date;
  averageCompletionTime: number;
  averageEvidenceScore: number;

  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy?: string;
  metadata: Record<string, any>;
}

interface FrameworkSection {
  id: string;
  title: string;            // "Cultural Competence"
  description: string;
  order: number;            // Display order
  questions: Question[];
  isRequired: boolean;
  weight: number;           // 0.25 = 25% of total score
  color?: string;           // "blue", "green", "purple"
  icon?: string;            // Emoji or icon name
}

interface Question {
  id: string;
  sectionId: string;
  text: string;             // The actual question
  description?: string;
  helpText: string;
  examples: string[];       // Example answers/evidence

  // Configuration
  type: 'rating' | 'text' | 'multiselect' | 'checkbox' | 'file';
  isRequired: boolean;
  weight: number;
  order: number;

  // Rating Scale (for 'rating' type)
  scale?: RatingScale;

  // Framework Alignments
  frameworkAlignments: FrameworkAlignment[];

  // Categorization
  tags: string[];
  categories: string[];
  difficulty: 'easy' | 'medium' | 'hard';

  // Evidence
  evidenceRequired: boolean;
  evidenceTypes: string[];  // ['photo', 'video', 'document']
  minEvidenceCount?: number;
}

interface RatingScale {
  id: string;
  name: string;
  type: 'numeric' | 'descriptive' | 'custom';
  min: number;                      // 0
  max: number;                      // 4
  labels: RatingLabel[];           // 0=Not Observed, 1=Beginning, etc.
  includeNotObserved: boolean;
  notObservedLabel?: string;
}

interface RatingLabel {
  value: number | string;
  label: string;            // "Proficient"
  description: string;      // "Teacher demonstrates proficient implementation..."
  color?: string;           // "green"
}

interface FrameworkAlignment {
  id: string;
  name: string;             // "CRP (General)"
  category: string;         // "Culturally Responsive Practices"
  subcategory?: string;
  description: string;
  color: string;
  icon?: string;
  weight?: number;
  applicableTypes: string[];       // ['observation', 'evaluation']
  applicableDivisions: DivisionType[];
}
```

#### 2. Observation Type

```typescript
interface Observation {
  // Identity
  id: string;
  schoolId: string;
  divisionId: string;
  departmentId?: string;

  // Participants
  subjectId: string;        // Teacher being observed
  subjectName: string;
  observerId: string;       // Observer conducting
  observerName: string;

  // Framework Reference (LOCKED to version for consistency)
  frameworkId: string;
  frameworkName: string;    // Cached for reporting
  frameworkVersion: string; // Ensures historical data integrity

  // Context
  context: {
    type: string;           // "classroom", "evaluation", etc.
    date: Date;            // When observation occurred
    startTime: Date;
    endTime?: Date;
    duration: number;       // minutes
    className?: string;
    subject?: string;
    grade?: string;
    room?: string;
    period?: string;
    studentCount?: number;
  };

  // Responses (linked to framework questions)
  responses: ObservationResponse[];
  overallComments: string;

  // Calculated Scores (auto-generated from responses + framework)
  frameworkScores: FrameworkScore[];
  evidenceCount: number;
  totalQuestions: number;
  evidencePercentage: number;

  // CRP-specific (if using CRP framework)
  crpEvidenceCount: number;
  totalLookFors: number;
  crpPercentage: number;
  strengths: string[];
  growthAreas: string[];

  // Workflow
  status: 'draft' | 'completed' | 'submitted' | 'reviewed';
  submittedAt?: Date;
  reviewedAt?: Date;

  // Follow-up
  followUpRequired: boolean;
  followUpCompleted: boolean;
  followUpNotes?: string;

  // Teacher Feedback
  teacherComment?: string;

  // Media
  attachments: MediaFile[];
  location?: GeoLocation;

  // System
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: Record<string, any>;
}

interface ObservationResponse {
  questionId: string;
  questionText: string;      // Cached for reporting
  rating: string;            // "3", "not-observed", or text content
  ratingText: string;        // "Proficient", "Not Observed", etc.
  comments: string;
  evidence: string[];
  tags: string[];
  frameworkAlignments: string[];
  confidence: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface FrameworkScore {
  alignmentId: string;
  alignmentName: string;
  score: number;             // Total points earned
  maxScore: number;          // Total points possible
  percentage: number;        // (score/maxScore) * 100
  evidenceCount: number;
  questionCount: number;
}
```

### Framework-Driven Components

#### 1. DynamicObservationForm (`app/components/features/observations/DynamicObservationForm.tsx`)

**The main observation form** - completely driven by framework structure.

**Usage**:
```typescript
<DynamicObservationForm
  frameworkId="crp-v2"
  observation={existingObservation}  // Optional for editing
  onSave={handleSaveDraft}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

**How it works**:
1. Loads framework with `useFramework(frameworkId)`
2. Renders `framework.sections` in order
3. For each section, renders questions based on `question.type`
4. Tracks progress (answered vs required)
5. Calculates scores from `framework.alignments`
6. Validates required questions before submit

**Features**:
- ✅ Real-time progress tracking
- ✅ Live timer (duration calculation)
- ✅ Auto-save draft functionality
- ✅ Validation (prevents submit until required answered)
- ✅ Section colors/icons from framework
- ✅ Responsive design

#### 2. DynamicQuestion (`app/components/features/observations/DynamicQuestion.tsx`)

**Renders individual questions** based on `question.type`:

- `rating` → Radio buttons with scale.labels
- `text` → Textarea
- `multiselect` → Checkboxes
- `checkbox` → Single checkbox
- `file` → File upload

**Features**:
- ✅ Help text with examples (expandable)
- ✅ Framework alignment badges
- ✅ Comments section per question
- ✅ Evidence collection (with min requirements)
- ✅ Confidence tracking

---

## Role-Based Observation Views

### ObservationsPageRoleRouter (`app/app/ObservationsPageRoleRouter.tsx`)

**Role-based dispatcher** - routes users to appropriate view:

```typescript
export default function ObservationsPageRoleRouter() {
  const user = useAuthStore(state => state.user);

  if (!user) return null;

  // Teachers: restricted view
  if (user.primaryRole === 'educator') {
    return <TeacherObservationsView />;
  }

  // Observers: their observations + quick create
  if (user.primaryRole === 'observer') {
    return <ObserverObservationsView />;
  }

  // Managers/Admins: full management
  return <ObservationsPage />;
}
```

### 1. TeacherObservationsView

**File**: `app/components/features/observations/TeacherObservationsView.tsx`

**What Teachers See**:
- ✅ **Only past completed observations** where `obs.subjectId === user.id`
- ✅ **No future observations** (filtered by `obs.context.date <= now`)
- ✅ Only status: `completed`, `submitted`, or `reviewed` (not `draft`)
- ✅ **Two view modes**: List and Insights
- ✅ **Framework-driven analytics**
- ✅ **Comment submission** on observations

**Key Features**:

**List Mode**:
- Search by subject/observer/class/grade
- Filter by framework
- Observation cards with status badges
- Teacher comment display/edit
- Sorted by most recent first

**Insights Mode** (Framework-Driven Analytics):
- **Overall Performance**: Average percentage across all framework sections
- **Strength Areas**: Sections with ≥75% average
- **Growth Opportunities**: Sections with <60% average
- **Performance by Framework Section**: Dynamic chart based on framework structure
- **Section Breakdown**: Color-coded progress bars

**Analytics Calculation** (Framework-Aware):
```typescript
// OLD WAY (Hardcoded):
const categoryMap = { 'lookfor1': 'instructional-clarity', ... };

// NEW WAY (Framework-Driven):
framework.sections.forEach(section => {
  // Calculate section score from responses
  const sectionResponses = responses.filter(r =>
    section.questions.some(q => q.id === r.questionId)
  );

  sectionResponses.forEach(response => {
    const question = section.questions.find(q => q.id === response.questionId);
    const maxRating = question.scale.max || 4;
    const percentage = (parseFloat(response.rating) / maxRating) * 100;
    // Aggregate by section...
  });
});
```

**Benefits**:
- Adapts to ANY framework structure
- Works with CRP, CASEL, Tripod, or custom frameworks
- Section colors carry through to insights
- Historical data preserved even if framework changes

### 2. ObserverObservationsView

**File**: `app/components/features/observations/ObserverObservationsView.tsx`

**What Observers See**:
- ✅ **Only observations they conducted** (`obs.observerId === user.id`)
- ✅ All statuses (drafts, completed, submitted, reviewed)
- ✅ **Drafts prioritized** at top (continue incomplete work)
- ✅ **Quick create button** (ObserverQuickObservation)
- ✅ Statistics dashboard
- ✅ Framework filtering

**Key Features**:

**Statistics**:
- Total observations
- Drafts
- Completed
- Submitted
- Reviewed

**Observation List**:
- Edit button for drafts/completed
- View button for submitted/reviewed
- Framework badge on each observation
- Visual status indicators
- CRP evidence progress bars
- Search and filter

**Sorting**:
- Drafts always at top
- Then by date (most recent first)

### 3. ObserverQuickObservation

**File**: `app/components/features/observations/ObserverQuickObservation.tsx`

**Immediate observation creation** via modal:

**Features**:
- Framework selector (loads with `useActiveFrameworks()`)
- Minimal required fields:
  - Framework selection *
  - Teacher name *
  - Optional: Teacher email, class name, subject, grade, duration
- Creates draft observation
- Navigates to `DynamicObservationForm`

**Flow**:
1. Observer clicks "New Observation"
2. Modal appears with framework dropdown
3. Observer selects framework, enters teacher info
4. Clicks "Create & Start"
5. Redirects to full `DynamicObservationForm` for that framework

---

## Authentication & Roles

### Dual Auth Mode

**Selector**: `app/stores/auth.ts`

1. **Mock Auth (Development)** - `app/stores/mockAuthStore.ts`
   - Auto-authenticates as super admin
   - No Firebase needed
   - User: `dev@sas.edu.sg`

2. **Firebase Auth (Production)** - `app/stores/authStore.ts`
   - Full Firebase Authentication
   - Firestore user profiles

**To switch**: Edit `app/stores/auth.ts` and change the export.

### Role Hierarchy

**File**: `app/utils/roleMapping.ts`

Six role levels:

1. **staff** - Basic access
2. **educator** - Teachers, view own observations
3. **observer** - Conduct observations
4. **manager** - Department heads, team management
5. **administrator** - School admins, user management
6. **super_admin** - System-wide access

**Permission Functions**:
- `canManageUsers(role)` - Can manage user accounts
- `canObserveOthers(role)` - Can conduct observations
- `canAccessAdmin(role)` - Can access admin panel
- `canManageFrameworks(role)` - Can create/edit frameworks

---

## State Management

### Zustand Stores

```
app/stores/
├── authStore.ts        # Firebase auth (production)
├── mockAuthStore.ts    # Mock auth (development)
└── auth.ts             # Facade (selects one)
```

All use Zustand with `subscribeWithSelector` middleware.

**Auth Store Interface**:
```typescript
interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}
```

---

## Data Layer Architecture

### Three-Tier System

```
Firebase Layer (app/lib/)
    ↓
API Layer (app/api/)
    ↓
React Query Layer (app/hooks/)
    ↓
Components
```

#### 1. Firebase Layer (`app/lib/`)

- `firebase.ts` - Firebase initialization
- `firestore.ts` - Generic `FirestoreService<T>` class

#### 2. API Layer (`app/api/`)

- `core.ts` - Typed wrappers (usersService, orgsService, etc.)
- `observations.ts` - Observation-specific methods

**Example**:
```typescript
export const usersService = new FirestoreService<User>('users');
export const observationsService = new FirestoreService<Observation>('observations');
```

#### 3. React Query Layer (`app/hooks/`)

- `useObservations.ts` - Observation queries/mutations
- `useFrameworks.ts` - Framework queries/mutations
- `useAuth.ts` - Authentication state

**Example**:
```typescript
export const useObservations = () => {
  return useQuery({
    queryKey: ['observations'],
    queryFn: () => observationsApi.observations.list()
  });
};

export const useUpdateObservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => observationsApi.observations.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    }
  });
};
```

---

## Type System

### Import Pattern (CRITICAL)

**Always import from `app/types/index.ts`**, never from individual files:

```typescript
// ✅ CORRECT
import type { UserRole, Observation, Framework } from '../types';

// ❌ WRONG - causes errors
import { UserRole } from '../types/core';
import { Observation } from '../types/observation';
```

### Type Files

```
app/types/
├── index.ts            # Re-exports all (import from here)
├── core.ts             # User, Role, Organization, Division
├── observation.ts      # Framework, Observation, ObservationResponse
└── professional-learning.ts  # SMART goals, training
```

---

## Provider Components

### When to Use Which

**1. AppProviders** (`app/components/providers/AppProviders.tsx`)

Use when component needs React Query:

```typescript
<AppProviders requireAuth={true}>
  <YourComponent />
</AppProviders>
```

**2. AuthWrapper** (`app/components/providers/AuthWrapper.tsx`)

Use when only auth checking needed:

```typescript
<AuthWrapper requireRoles={['administrator']}>
  <YourComponent />
</AuthWrapper>
```

**3. ProtectedLayout** (in `App.tsx`)

Use in routing:

```typescript
<Route path="/app/page" element={
  <ProtectedLayout requireRoles={['educator']}>
    <YourPage />
  </ProtectedLayout>
} />
```

Automatically wraps in:
- Authentication check
- Role verification
- AppLayout (sidebar, header)

---

## Styling System

### SAS Brand Colors

**Primary**: Navy (#1A4190), Red (#E51322)
**Fonts**: Bebas Neue (headings), Poppins (body)

### Tailwind Classes

```typescript
// Navy shades
bg-sas-navy-50 to bg-sas-navy-900

// Primary navy
bg-sas-navy-600

// Red accent
bg-sas-red-600

// Other colors
bg-sas-blue-600
bg-sas-green-600
bg-sas-purple-600

// Gradients
bg-sas-gradient
bg-sas-eagle-gradient
```

### Custom CSS Classes (`app/styles/global.css`)

```css
.sas-card             /* Card styling */
.sas-button-primary   /* Primary button with gradient */
.sas-button-secondary /* Secondary outline button */
.sas-input            /* Form input styling */
.sas-hero-banner      /* Hero section with SAS image */
```

---

## Common Patterns

### Adding a New Framework

**Via Firebase Console** (no code changes needed):

1. Go to Firestore → `observation_frameworks` collection
2. Add new document with structure matching `Framework` type
3. Set `status: 'active'`
4. Define `sections` array with questions
5. Framework immediately available in dropdown

**Example Framework Document**:
```json
{
  "id": "tripod-v1",
  "name": "Tripod 7Cs Framework",
  "description": "Student perception survey framework",
  "version": "1.0",
  "status": "active",
  "schoolId": "sas",
  "applicableDivisions": ["middle", "high"],
  "sections": [
    {
      "id": "care",
      "title": "Care",
      "description": "Students feel cared for",
      "order": 1,
      "weight": 0.14,
      "color": "blue",
      "isRequired": true,
      "questions": [
        {
          "id": "care-1",
          "text": "Teacher shows care for students",
          "type": "rating",
          "isRequired": true,
          "order": 1,
          "weight": 1.0,
          "helpText": "Look for signs of caring relationships",
          "examples": ["Knows student names", "Asks about wellbeing"],
          "frameworkAlignments": [
            { "id": "tripod-care", "name": "Tripod: Care" }
          ],
          "scale": {
            "id": "4-point",
            "type": "numeric",
            "min": 0,
            "max": 4,
            "includeNotObserved": true,
            "labels": [
              { "value": 0, "label": "Not Observed" },
              { "value": 1, "label": "Beginning" },
              { "value": 2, "label": "Developing" },
              { "value": 3, "label": "Proficient" },
              { "value": 4, "label": "Advanced" }
            ]
          }
        }
      ]
    }
  ],
  "alignments": [
    {
      "id": "tripod-care",
      "name": "Tripod: Care",
      "category": "7Cs of Learning",
      "color": "blue"
    }
  ],
  "totalQuestions": 1,
  "requiredQuestions": 1,
  "usageCount": 0
}
```

### Using Framework-Driven Analytics

**In any component**:

```typescript
import { useFrameworks } from './hooks/useFrameworks';
import { useObservations } from './hooks/useObservations';

export default function MyAnalytics() {
  const { data: frameworks } = useFrameworks();
  const { data: observations } = useObservations();

  // Calculate insights dynamically
  const insights = useMemo(() => {
    const sectionScores = {};

    observations?.forEach(obs => {
      const framework = frameworks?.find(f => f.id === obs.frameworkId);
      if (!framework) return;

      framework.sections.forEach(section => {
        const sectionResponses = obs.responses.filter(r =>
          section.questions.some(q => q.id === r.questionId)
        );

        sectionResponses.forEach(response => {
          const question = section.questions.find(q => q.id === response.questionId);
          const maxRating = question?.scale?.max || 4;
          const percentage = (parseFloat(response.rating) / maxRating) * 100;

          if (!sectionScores[section.id]) {
            sectionScores[section.id] = { total: 0, count: 0, name: section.title };
          }
          sectionScores[section.id].total += percentage;
          sectionScores[section.id].count += 1;
        });
      });
    });

    // Return section averages
    return Object.values(sectionScores).map(section => ({
      name: section.name,
      average: section.total / section.count
    }));
  }, [observations, frameworks]);

  return <div>{/* Render insights */}</div>;
}
```

### Adding a New Role-Based View

```typescript
// 1. Create component in app/components/features/
export function MyRoleView() {
  const { user } = useAuthStore();
  const { data } = useObservations();

  // Filter data for this role
  const myData = data?.filter(item => item.userId === user.id);

  return <div>My view</div>;
}

// 2. Update ObservationsPageRoleRouter
export default function ObservationsPageRoleRouter() {
  const user = useAuthStore(state => state.user);

  if (user.primaryRole === 'my-role') {
    return <MyRoleView />;
  }

  // ... other roles
}
```

---

## Environment Variables

Create `.env` (copy from `.env.example`):

```bash
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Development
VITE_USE_MOCK_AUTH="true"           # false for production
VITE_USE_FIREBASE_EMULATORS="true"  # true for local dev
```

**IMPORTANT**: Restart dev server after changing `.env`.

---

## Troubleshooting

### Type Import Errors

**Problem**: "The requested module does not provide an export named..."

**Solution**: Import from index
```typescript
// ✅ Correct
import type { UserRole } from '../types';

// ❌ Wrong
import { UserRole } from '../types/core';
```

### Environment Variables Not Working

**Problem**: `import.meta.env.VITE_*` is undefined

**Solution**:
1. Variable must start with `VITE_`
2. Restart dev server
3. Check `.env` file exists

### Firebase Invalid API Key

**Problem**: `Firebase: Error (auth/invalid-api-key)`

**Solution**:
1. Copy `.env.example` to `.env`
2. Add Firebase credentials
3. All variables must have `VITE_` prefix
4. Restart dev server

### Pages Redirect to Login

**Problem**: Authenticated users redirected to login

**Solution**:
- Check `app/stores/auth.ts` exports correct store
- For development, should export from `./mockAuthStore`
- Check browser console for auth errors

---

## Documentation

### Active Docs

- **CLAUDE.md** (this file) - Main development guide
- **docs/FRAMEWORK_DRIVEN_ARCHITECTURE.md** - Framework system design & implementation
- **docs/ROLES_AND_PERMISSIONS.md** - Role system reference
- **docs/PROJECT_STRUCTURE.md** - Detailed file organization
- **docs/FIREBASE_REVIEW_COMPLETE.md** - Firebase configuration

### Archived Docs

- **summaries/** - Historical planning documents (kept for reference)

---

## Next Steps

### Immediate TODO

1. ✅ Role-based observations (COMPLETE)
2. ✅ Framework-driven forms (COMPLETE)
3. ✅ Framework-driven analytics (COMPLETE)
4. ⏳ Framework seed data (Firestore)
5. ⏳ Framework Management UI (Admin panel)

### Future Enhancements

1. **Question Bank** - Reusable questions across frameworks
2. **Framework Templates** - Pre-built CRP/CASEL/Tripod templates
3. **Multi-Framework Comparison** - Compare teacher across frameworks
4. **Collaborative Observations** - Multiple observers
5. **Real-time Observations** - Live updates during observation
6. **Framework Analytics** - Which frameworks most effective?
7. **Version History** - View observations with old framework versions

---

## Success Metrics

- ✅ Observation form renders without hardcoded questions
- ✅ Multiple frameworks selectable
- ✅ Analytics adapt to framework structure
- ✅ Teachers see only past observations
- ✅ Observers can create immediately
- ✅ Role-based views working
- ⏳ Admin framework builder (pending)
- ⏳ Performance: <500ms load with 50+ questions (pending)

---

**Last Updated**: November 14, 2024
**Version**: 2.0 (Framework-Driven Architecture)
