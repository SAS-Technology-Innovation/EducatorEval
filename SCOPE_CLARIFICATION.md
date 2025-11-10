# Project Scope Clarification & Applets Removal Plan

**Date:** November 7, 2025
**Critical Update:** Remove applets architecture - This is an observation tool, not an extensible platform

---

## Scope Definition

### What This Project IS:
✅ **Classroom Observation Tool** - For capturing 5,000 observations by May 2026
✅ **10 Look-Fors Framework** - Integrated observation framework (CRP, Tripod, CASEL, etc.)
✅ **Professional Learning Platform** - SMART goals and training suggestions
✅ **Analytics Dashboard** - Quarterly data analysis for leadership
✅ **Observer Management** - Support for 80+ observers across divisions

### What This Project IS NOT:
❌ **Extensible applets platform** - No pluggable architecture
❌ **Multi-tool suite** - Just observations and professional learning
❌ **Generic educational platform** - Specific to observation workflows

---

## Current State Analysis

### Applets References Found (39 files)

**Core Architecture Files:**
- `src/types/applets.ts` - Applet type definitions
- `src/components/applets/` - Applet components directory
- `src/pages/applets/` - Applet pages
- `src/components/layout/AppletNavigation.tsx` - Applet navigation component
- `src/types/crp-observation.ts` - References applets
- `CLAUDE.md` - Documents applet system

**Impact Assessment:**
- Low risk to remove - applets appear to be an architectural concept, not deeply integrated
- CRP Observations should be **core feature**, not an "applet"
- Navigation and routing need to be simplified

---

## Removal Plan

### Phase 1: Remove Applet Architecture (Immediate)

#### Step 1: Delete Applet-Specific Files
```bash
# Remove applet types
rm src/types/applets.ts

# Remove applet navigation
rm src/components/layout/AppletNavigation.tsx

# Remove applet page directory (we'll move CRP observations to core)
rm -rf src/pages/applets/
```

#### Step 2: Move CRP Observations to Core
```bash
# CRP Observations are core feature, not an applet
# Move from applets to core observations
mv src/components/applets/CRPObservationsApplet.tsx src/components/features/observations/
mv src/components/applets/CRPObservationsWithNavigation.tsx src/components/features/observations/
```

#### Step 3: Create Core Observations Page
```bash
# Replace applet page with core observations page
# Create src/pages/observations/new.astro for creating observations
# Create src/pages/observations/[id].astro for viewing/editing observations
```

#### Step 4: Update Type Exports
```typescript
// src/types/index.ts
// Remove: export * from './applets';
// Keep only: core, observation, crp-observation
```

#### Step 5: Update Navigation
- Remove applet-based navigation
- Add direct "Observations" menu item
- Add "Professional Learning" menu item
- Simplify routing

### Phase 2: Refactor CRP Observation Types

#### Current: `src/types/crp-observation.ts` references applets
```typescript
// Remove applet-specific fields
// Focus on observation data model only
```

#### Updated Structure:
```typescript
// Observation with 10 look-fors integrated framework
export interface Observation {
  id: string;
  observerId: string;
  observerName: string;
  teacherId: string;
  teacherName: string;
  date: Date;
  period: string;

  // Core observation data
  subject: string;
  grade: string;
  roomNumber: string;

  // 10 Look-Fors (from Integrated Observation Draft Plan)
  lookFors: LookForResponse[];

  // Notes and follow-up
  observationNotes: string;
  teacherNote: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'submitted';
}

export interface LookForResponse {
  lookForId: number; // 1-10
  observed: boolean;
  evidence: string;
  frameworks: Framework[]; // CRP, Tripod, CASEL, etc.
}
```

###Phase 3: Update Documentation

#### Files to Update:
1. ✅ **CLAUDE.md** - Remove applet system section
2. ✅ **ALIGNMENT_REVIEW.md** - Note applets removed
3. ⚠️ **BUILD_* docs** - Already outdated, mark for archival
4. ✅ **README.md** - Update project description

#### New Description:
```markdown
# EducatorEval

**Classroom Observation & Professional Learning Platform**

A focused tool for educational leaders to conduct classroom observations using an integrated framework of Culturally Responsive Practices (CRP), Tripod (7Cs), CASEL, and assessment practices. Supports 80+ observers in collecting 5,000+ observations annually to drive data-informed professional learning.

## Core Features
- 📝 **Classroom Observations** - 10 look-fors integrated framework
- 📊 **Analytics Dashboard** - Quarterly trends and insights
- 🎯 **Professional Learning** - SMART goals and training suggestions
- 👥 **Observer Management** - Role-based access for 80+ users
- 📈 **Leadership Reports** - Divisional and school-wide analysis
```

### Phase 4: Simplify Navigation & Routing

#### Current Routes (with applets):
- `/` - Landing
- `/dashboard` - User dashboard
- `/observations` - Observations list
- `/applets/crp-observations` - CRP observation form ❌ Remove
- `/admin/*` - Admin pages

#### New Routes (simplified):
- `/` - Landing
- `/dashboard` - User dashboard
- `/observations` - Observations list
- `/observations/new` - Create new observation ✅ New
- `/observations/[id]` - View/edit observation ✅ New
- `/professional-learning` - SMART goals & training ✅ New
- `/analytics` - Analytics dashboard ✅ New
- `/admin/*` - Admin pages

---

## Impact on Components

### Components to Refactor

1. **Unified Header** ([src/components/layout/UnifiedHeader.tsx](src/components/layout/UnifiedHeader.tsx))
   - Remove applet navigation references
   - Add direct "Observations" and "Professional Learning" links

2. **Sidebar** ([src/components/navigation/Sidebar.tsx](src/components/navigation/Sidebar.tsx))
   - Remove applet-based navigation
   - Simplify to core features

3. **Dashboard** ([src/components/dashboard/DashboardContent.tsx](src/components/dashboard/DashboardContent.tsx))
   - Remove applet cards
   - Add direct observation and professional learning cards

4. **Admin Dashboard** ([src/components/admin/AdminDashboard.tsx](src/components/admin/AdminDashboard.tsx))
   - Remove applet management
   - Focus on user, observer, and school management

### Components to Delete

1. `src/components/layout/AppletNavigation.tsx` ❌
2. `src/components/applets/` (after moving CRP content) ❌
3. `src/pages/applets/` ❌

---

## New Feature: Professional Learning

### Based on Project Scope
The project should include professional learning features:

1. **SMART Goals Module**
   - Teachers set professional learning goals
   - Link goals to observation data
   - Track progress quarterly

2. **Training Suggestions**
   - AI-powered training recommendations based on observation patterns
   - Curated learning resources
   - Professional development planning

3. **Data-Driven PD Planning**
   - Use observation data to identify school-wide trends
   - Generate suggested PD topics
   - Track implementation

### Implementation Plan
```
/src/pages/professional-learning.astro
/src/components/features/professional-learning/
  ├── SMARTGoals.tsx
  ├── TrainingSuggestions.tsx
  ├── PDPlanning.tsx
  └── GoalTracking.tsx
```

---

## Timeline

### Immediate (Today/This Week)
- [x] Document scope clarification
- [ ] Remove applet types (`src/types/applets.ts`)
- [ ] Update CLAUDE.md to remove applet sections
- [ ] Move CRP observation components to core features
- [ ] Delete `src/pages/applets/` directory

### Short-Term (This Sprint)
- [ ] Create new observation routes (`/observations/new`, `/observations/[id]`)
- [ ] Refactor navigation to remove applet references
- [ ] Update CRP observation types to remove applet concepts
- [ ] Simplify dashboard to core features only

### Medium-Term (Next Sprint)
- [ ] Build professional learning features
- [ ] Implement SMART goals module
- [ ] Add training suggestions based on observation data
- [ ] Create analytics dashboard for quarterly reviews

---

## Updated Project Focus

### Core Workflows

**Observer Workflow:**
1. Log in → Dashboard
2. Navigate to "New Observation"
3. Fill out 10 look-fors form
4. Add observation notes
5. Submit (sends note to teacher)
6. View observation history

**Teacher Workflow:**
1. Log in → Dashboard
2. View received observations
3. Review feedback and look-fors data
4. Set SMART goals for professional learning
5. Access suggested training resources
6. Track goal progress

**Leadership Workflow:**
1. Log in → Dashboard
2. View school/division observation analytics
3. Identify trends (weekly 5-min review)
4. Plan quarterly data analysis
5. Design PD based on observation data
6. Track observer participation

**Admin Workflow:**
1. Manage 80+ observer accounts
2. Configure schools, divisions, departments
3. Set up observation periods
4. Generate reports
5. Export data for analysis

---

## Success Metrics (Unchanged)

- ✅ 5,000 observations by May 2026
- ✅ 80+ active observers
- ✅ 70% CRP evidence rate
- ✅ Quarterly leadership reviews
- ✅ Weekly observation check-ins
- ✅ Data-driven PD planning

---

## Architecture Changes

### Before (Applets Model):
```
Platform
├── Core (auth, users, orgs)
└── Applets
    ├── CRP Observations (pluggable)
    ├── Other Applets (future)
    └── Extensibility Layer
```

### After (Focused Model):
```
EducatorEval
├── Core (auth, users, orgs)
├── Observations (CRP 10 look-fors)
├── Professional Learning (SMART goals, training)
└── Analytics (dashboards, reports)
```

**Benefits:**
- Simpler architecture
- Clearer purpose
- Faster development
- Easier maintenance
- Better alignment with actual needs

---

## Updated CLAUDE.md Summary

Remove these sections:
- "Applet System"
- "Adding a new applet"
- References to pluggable architecture
- Applet component organization

Add these sections:
- "Observation Workflows"
- "Professional Learning Features"
- "10 Look-Fors Framework"
- "Analytics & Reporting"

---

## Conclusion

**Action Required:** Remove all applet architecture references and refocus project as a **dedicated classroom observation and professional learning tool**.

**Rationale:** The project scope is clear - this is not an extensible platform, it's a focused tool for observation-driven professional development.

**Next Steps:**
1. Execute Phase 1 removal plan
2. Update CLAUDE.md
3. Refactor navigation and routing
4. Plan professional learning features
5. Archive or delete BUILD_* documents (they describe wrong architecture)

---

**Status:** Ready for implementation
**Priority:** HIGH - Scope clarification is critical for project direction
**Estimated Effort:** 4-8 hours for complete removal and refactor
