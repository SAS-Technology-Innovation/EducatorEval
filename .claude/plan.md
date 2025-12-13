# Implementation Plan: Database-Driven Framework & SMART Goals Architecture

## Overview

This plan implements a fully database-driven architecture where:
1. **Frameworks** (observation templates) are configured by admins and stored in Firestore
2. **SMART Goals** follow the same pattern - admin-configurable templates
3. **All UI components** dynamically render based on database configuration
4. **Navigation issues** are fixed (window.location.href → useNavigate)

---

## Phase 1: Fix Critical Navigation Issues

### 1.1 Replace window.location.href with React Router

**Files to update:**
- `app/components/layout/Sidebar.tsx` - Use `useNavigate()` hook
- `app/components/common/UserProfileDropdown.tsx` - Use `useNavigate()` hook
- `app/components/auth/LoginForm.tsx` - Use `useNavigate()` hook
- `app/components/dashboard/FrameworkDashboard.tsx` - Use `useNavigate()` hook
- `app/components/layout/UnifiedHeader.tsx` - Use `useNavigate()` hook
- `app/components/providers/AuthWrapper.tsx` - Use `useNavigate()` hook
- `app/public/LandingPage.tsx` - Use `<Navigate>` component

### 1.2 Add Missing Routes to App.tsx

**Routes to add:**
- `/admin/settings` → AdminSettings component (already exists)
- Remove or stub broken links: `/app/observations/templates`, `/app/observations/my-teachers`

### 1.3 Fix Old Route References

**Updates:**
- `/dashboard` → `/app/dashboard` in LoginForm.tsx, AuthWrapper.tsx
- `/observations/{id}` → `/app/observations/{id}` in FrameworkDashboard.tsx

---

## Phase 2: Database-Driven SMART Goals System

### 2.1 Create Goal Template Types

**New file: `app/types/goal-templates.ts`**
```typescript
interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  type: 'professional' | 'instructional' | 'student_outcome' | 'leadership';
  schoolId: string;
  isActive: boolean;

  // Template structure
  fields: GoalTemplateField[];
  defaultMilestones: DefaultMilestone[];
  suggestedMeasurements: SuggestedMeasurement[];

  // Configuration
  requiresApproval: boolean;
  approverRoles: UserRole[];
  defaultDuration: number; // days

  // Alignment
  frameworkAlignments: string[]; // Links to framework IDs

  createdAt: Date;
  updatedAt: Date;
}

interface GoalTemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'number';
  required: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
  order: number;
}
```

### 2.2 Create Goals API Layer

**New file: `app/api/goals.ts`**
- `goalsApi.templates.list()` - List goal templates
- `goalsApi.templates.getById(id)` - Get template
- `goalsApi.templates.create()` - Admin creates template
- `goalsApi.templates.update()` - Admin updates template
- `goalsApi.goals.list(userId)` - List user's goals
- `goalsApi.goals.create(goalData)` - Create goal from template
- `goalsApi.goals.update(id, updates)` - Update goal progress
- `goalsApi.milestones.update()` - Update milestone status
- `goalsApi.reflections.add()` - Add reflection entry

### 2.3 Create Goals React Query Hooks

**New file: `app/hooks/useGoals.ts`**
- `useGoalTemplates()` - Fetch all templates
- `useGoalTemplate(id)` - Fetch single template
- `useGoals(userId)` - Fetch user's goals
- `useGoal(id)` - Fetch single goal
- `useCreateGoal()` - Mutation
- `useUpdateGoal()` - Mutation
- `useUpdateMilestone()` - Mutation

### 2.4 Create Admin Goal Template Management

**New file: `app/components/admin/GoalTemplateManagement.tsx`**
- List all goal templates
- Create/edit/delete templates
- Configure fields, milestones, measurements
- Link to observation frameworks

### 2.5 Create User Goal Components

**Update: `app/components/features/professional-learning/`**
- `GoalsList.tsx` - Display user's goals from database
- `GoalForm.tsx` - Create goal using template (dynamic fields)
- `GoalDetail.tsx` - View/edit goal with milestones
- `MilestoneTracker.tsx` - Track milestone progress
- `ReflectionJournal.tsx` - Add reflections

### 2.6 Update Dashboards to Use Real Data

**Files to update:**
- `TeacherDashboard.tsx` - Fetch goals from `useGoals(user.id)`
- `ProfessionalLearningPage.tsx` - Connect to goals API

---

## Phase 3: Enhance Framework System

### 3.1 Move Framework Alignments to Database

**Update: `app/types/observation.ts`**
- Remove hardcoded `CRPFrameworkAlignments`
- Add `alignments` collection to Firestore

**New Firestore collection: `alignments/`**
```
{
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  color: string;
  icon: string;
  schoolId: string;
  applicableDivisions: string[];
  isActive: boolean;
}
```

### 3.2 Update Framework Management to Include Alignments

**Update: `app/components/admin/FrameworkManagement.tsx`**
- Add tab for managing alignments
- CRUD for alignment definitions
- Link alignments to frameworks

### 3.3 Consolidate on DynamicObservationForm

**Files to update:**
- Deprecate `ObservationForm.tsx` (hardcoded)
- Update all observation creation to use `DynamicObservationForm.tsx`
- Update `ObserverDashboard.tsx` to use dynamic form

### 3.4 Connect Observations to Database Frameworks

**Update flow:**
1. Observer clicks "Start Observation"
2. Modal shows list of active frameworks (from database)
3. Observer selects framework and teacher
4. DynamicObservationForm loads framework sections/questions from database
5. Form renders dynamically based on framework structure
6. Submission saves observation with framework reference

---

## Phase 4: Role-Specific Dashboard Improvements

### 4.1 Fix Staff Dashboard

**Update: `app/app/DashboardPage.tsx`**
- Staff should NOT see TeacherDashboard
- Create minimal `StaffDashboard.tsx` or redirect to profile

### 4.2 Create Manager Dashboard

**New file: `app/components/dashboard/ManagerDashboard.tsx`**
- Team member list with observation status
- Department metrics
- Team goal progress
- Assign observations to team

### 4.3 Update Dashboard Data Sources

**TeacherDashboard.tsx:**
- Replace hardcoded observations with `useObservations({ subjectId: user.id })`
- Replace hardcoded goals with `useGoals(user.id)`

**ObserverDashboard.tsx:**
- Replace hardcoded data with `useObservations({ observerId: user.id })`
- Fix broken quick action links

**AdminDashboard.tsx:**
- Already using real data ✓
- Fix CRP Evidence Rate calculation (currently placeholder)

---

## Phase 5: Add Admin Route and Cleanup

### 5.1 Add Admin Settings Route

**Update: `App.tsx`**
- Import AdminSettings
- Add route: `/admin/settings`

### 5.2 Remove/Fix Broken Links

**ObserverDashboard.tsx:**
- Remove or implement `/app/observations/templates`
- Remove or implement `/app/observations/my-teachers`

**UserProfileDropdown.tsx:**
- Remove `/app/notifications` and `/app/help` links (or stub pages)

---

## File Changes Summary

### New Files (8)
1. `app/types/goal-templates.ts` - Goal template types
2. `app/api/goals.ts` - Goals API layer
3. `app/hooks/useGoals.ts` - Goals React Query hooks
4. `app/components/admin/GoalTemplateManagement.tsx` - Admin goal config
5. `app/components/features/professional-learning/GoalForm.tsx` - Dynamic goal form
6. `app/components/features/professional-learning/GoalDetail.tsx` - Goal view/edit
7. `app/components/dashboard/ManagerDashboard.tsx` - Manager-specific dashboard
8. `app/components/dashboard/StaffDashboard.tsx` - Staff-specific dashboard

### Modified Files (15+)
1. `App.tsx` - Add routes
2. `app/components/layout/Sidebar.tsx` - Fix navigation
3. `app/components/common/UserProfileDropdown.tsx` - Fix navigation
4. `app/components/auth/LoginForm.tsx` - Fix navigation
5. `app/components/dashboard/FrameworkDashboard.tsx` - Fix navigation
6. `app/components/layout/UnifiedHeader.tsx` - Fix navigation
7. `app/components/providers/AuthWrapper.tsx` - Fix navigation
8. `app/public/LandingPage.tsx` - Fix navigation
9. `app/app/DashboardPage.tsx` - Add staff/manager routing
10. `app/components/dashboard/TeacherDashboard.tsx` - Use real data
11. `app/components/dashboard/ObserverDashboard.tsx` - Use real data, fix links
12. `app/components/admin/FrameworkManagement.tsx` - Add alignments tab
13. `app/components/features/professional-learning/ProfessionalLearningPage.tsx` - Connect to API
14. `app/types/observation.ts` - Remove hardcoded constants
15. `app/lib/firestore.ts` - Add goals service

---

## Firestore Collections

### Existing (enhanced)
- `frameworks/` - Framework definitions with sections/questions
- `observations/` - Observation records
- `users/` - User profiles

### New Collections
- `alignments/` - Framework alignment definitions (moved from code)
- `goal_templates/` - Admin-configured goal templates
- `goals/` - User goals (from templates)
- `goals/{id}/milestones/` - Goal milestones
- `goals/{id}/reflections/` - Goal reflections

---

## Implementation Order

1. **Phase 1** (Critical fixes) - 2-3 hours
   - Fix all navigation issues
   - Add missing routes

2. **Phase 2** (Goals system) - 4-6 hours
   - Create types, API, hooks
   - Build admin template management
   - Build user goal components
   - Connect dashboards

3. **Phase 3** (Framework enhancement) - 2-3 hours
   - Move alignments to database
   - Consolidate on DynamicObservationForm
   - Update admin management

4. **Phase 4** (Dashboard improvements) - 2-3 hours
   - Create Staff/Manager dashboards
   - Connect all dashboards to real data

5. **Phase 5** (Cleanup) - 1 hour
   - Remove broken links
   - Final testing

---

## Key Architecture Principles

1. **Database-First**: All configuration stored in Firestore, UI renders dynamically
2. **Template Pattern**: Admins create templates, users create instances from templates
3. **Framework Linkage**: Goals can be linked to framework areas for alignment
4. **Role-Based Views**: Each role sees appropriate dashboard and data
5. **Real-Time Updates**: React Query handles caching and refetching
