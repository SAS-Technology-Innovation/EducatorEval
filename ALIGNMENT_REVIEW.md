# Project Alignment Review
**Date:** November 7, 2025
**Reviewer:** Claude Code
**Purpose:** Ensure project state aligns with documentation and identify discrepancies

---

## Executive Summary

### Current State
✅ **Mock auth system active** - Working for local development
✅ **Core platform structure in place** - Astro + React + TypeScript
✅ **UI components built** - Dashboard, observations, admin panels
⚠️ **Documentation mismatch** - Build docs reference non-existent Go functions directory
⚠️ **Different scope than docs** - Project is EducatorEval, not "CRP Platform"
❌ **No backend implementation** - Functions directory was removed (legacy)
❌ **Firebase integration incomplete** - Using mock data stores

### Critical Findings

**MAJOR DISCREPANCY**: The build instruction documents (BUILD_INSTRUCTIONS.md, BUILD_OBJECTIVES.md, WEEK_1_QUICK_START.md) describe a **completely different project architecture** than what currently exists:

| Documentation Says | Actual Project State |
|-------------------|---------------------|
| `/frontend` and `/functions` structure | Single Astro monorepo structure |
| Go Cloud Functions for backend | No Go backend (functions dir removed as legacy) |
| "CRP Platform" name | "EducatorEval" name |
| Schedule system missing | No schedule system mentioned in core types |
| Mock auth mentioned as temporary | Mock auth is currently the primary dev mode |

---

## 1. Project Architecture Comparison

### Documentation Architecture (from BUILD_INSTRUCTIONS.md)
```
/crp-platform
├── /frontend              # Astro + React
├── /functions             # Go Cloud Functions ❌ DOESN'T EXIST
├── /docs                  # Documentation
└── /scripts               # Build scripts
```

### Actual Project Architecture
```
/EducatorEval
├── /src
│   ├── /components        # React components
│   ├── /pages            # Astro pages
│   ├── /lib              # Firebase SDK
│   ├── /stores           # Zustand (with mock auth)
│   ├── /types            # TypeScript types
│   └── /styles           # CSS/Tailwind
├── /public               # Static assets
├── /docs                 # Documentation ✅
├── /tests                # Test files ✅
└── [config files]        # Astro, Tailwind, etc. ✅
```

**Analysis:** The build docs assume a monorepo with separate frontend/backend. Actual project is frontend-only with Firebase as BaaS (Backend as a Service).

---

## 2. Technology Stack Alignment

### Documentation Claims
- ✅ Frontend: Astro 5, React 18, TypeScript
- ✅ Styling: Tailwind CSS
- ❌ Backend: Go Cloud Functions (doesn't exist)
- ✅ Database: Firebase Firestore
- ✅ State: Zustand
- ⚠️ Auth: Firebase Auth (exists but mock auth is active)

### Actual Stack (from package.json)
```json
{
  "dependencies": {
    "astro": "^5.13.3",              ✅
    "react": "^19.1.1",              ✅ (v19, not v18)
    "firebase": "^10.0.0",           ✅
    "zustand": "^4.5.0",             ✅
    "@tanstack/react-query": "^5.0.0" ✅ (not mentioned in docs)
  }
}
```

**Key Differences:**
1. React 19 (not 18)
2. React Query is critical dependency (not in build docs)
3. No Go backend exists
4. Mock auth is the active development mode

---

## 3. Core Features Comparison

### From Integrated Observation Draft Plan
**Goal:** 5,000 observations by May 2026, 80+ observers, 70% CRP evidence rate

**Features Required:**
1. ✅ Observation capture form with 10 look-fors
2. ✅ Observer dashboard with analytics
3. ✅ Data collection and storage
4. ⚠️ Integration of CRP, 7Cs, 5 Daily Assessment Practices, CASEL
5. ❌ Schedule system (missing - but docs say it's critical)
6. ⚠️ Quarterly data analysis tools
7. ⚠️ Weekly updates to leadership
8. ❌ Teacher notification system

### What Currently Exists

**Implemented:**
- Landing page ([index.astro](src/pages/index.astro))
- Dashboard with mock user ([dashboard.astro](src/pages/dashboard.astro))
- Observations page ([observations.astro](src/pages/observations.astro))
- Admin pages (users, roles, schools, etc.)
- Mock authentication system
- Type definitions for core entities
- Firestore integration setup (but using mock data)

**Not Implemented:**
- Schedule system (docs say this is CRITICAL PRIORITY #1)
- Real Firebase backend connection
- Go Cloud Functions
- Gemini AI analytics integration
- Teacher notification system
- Quarterly reporting
- Bulk data import/export

---

## 4. Authentication System Status

### Current State: **Mock Auth Active**

Location: [src/stores/auth.ts](src/stores/auth.ts)
```typescript
console.log('🔐 Auth mode: MOCK (development) - Firebase bypassed');
export { useAuthStore } from './mockAuthStore';
```

**Mock User:**
- Email: dev@sas.edu.sg
- Role: super_admin
- All permissions granted
- No Firebase connection required

### Documentation Says:
- "Mock auth is temporary for development"
- "Switch to Firebase auth for production"
- BUILD_OBJECTIVES.md lists Firebase auth integration as Objective 3

**Reality:** Mock auth is working perfectly for local dev. Firebase auth integration would be Objective 3 if following build plan.

---

## 5. Type System Alignment

### Actual Types (from src/types/)
```
src/types/
├── index.ts           # Exports all types
├── core.ts            # User, Role, Organization types
├── observation.ts     # Observation types
├── crp-observation.ts # CRP-specific observation types
└── applets.ts         # Applet configuration types
```

### Missing from Types (per BUILD docs):
- ❌ Schedule types (MasterSchedule, EducatorSchedule, etc.)
- ❌ Period types
- ❌ DayType types
- ❌ ClassAssignment types

**Analysis:** The schedule system that BUILD_OBJECTIVES.md calls "CRITICAL PRIORITY" has no type definitions in the codebase.

---

## 6. Observation Framework Alignment

### From Integrated Observation Draft Plan

**10 Look-Fors Integrated Tool:**
1. Learning target clearly communicated
2. Respectful, inclusive environment
3. Check for understanding
4. Questioning strategies
5. Collaborative learning
6. Cultural competence
7. Active monitoring during work
8. Student reflection opportunities
9. Trust-building relationships
10. Classroom environment supports learning

**Aligned Frameworks:**
- 🌍 CRP (Culturally Responsive Practices)
- 🎯 5 Daily Assessment Practices
- 🔍 Tripod (7Cs: Care, Confer, Captivate, Clarify, Consolidate, Challenge, Control)
- ❤️ CASEL (Social-Emotional Learning)
- 🤝 Panorama
- 🧩 Inclusive Practices

### Current Implementation Status
Looking at [src/types/crp-observation.ts](src/types/crp-observation.ts) and observation types:

⚠️ **Need to verify if 10 look-fors are implemented** - Would need to read the actual observation form component to confirm alignment with Integrated Observation Draft Plan.

---

## 7. File and Directory Discrepancies

### Removed:
- ❌ `/functions` directory - Was removed as "legacy" per user request
- ❌ All Go Cloud Functions code
- ❌ `deploy:functions` npm script (removed from package.json per CLAUDE.md update)

### Added (not in BUILD docs):
- ✅ [CLAUDE.md](CLAUDE.md) - Documentation for Claude instances
- ✅ [DEVELOPMENT.md](DEVELOPMENT.md) - Mock auth guide
- ✅ Mock auth system ([src/stores/mockAuthStore.ts](src/stores/mockAuthStore.ts))
- ✅ AppProviders component ([src/components/providers/AppProviders.tsx](src/components/providers/AppProviders.tsx))
- ✅ DashboardContent component ([src/components/dashboard/DashboardContent.tsx](src/components/dashboard/DashboardContent.tsx))

### Present in both:
- ✅ `/docs` directory with project documentation
- ✅ `/public` for static assets
- ✅ Firebase configuration files

---

## 8. Documentation Conflicts

### Conflicting Documents

**BUILD_INSTRUCTIONS.md says:**
- Project name: "CRP in Action Platform"
- Structure: `/frontend` + `/functions` monorepo
- Backend: Go Cloud Functions
- Priority 1: Build schedule system
- Week 1 goal: Schedule backend working

**CLAUDE.md says:**
- Project name: "EducatorEval"
- Structure: Astro monorepo (no frontend subdirectory)
- Backend: Firebase (BaaS model)
- No mention of schedule system
- No Go functions

**Integrated Observation Draft Plan says:**
- Project name: "CRP in Action: Leading with Observation"
- Focus: 5,000 observations, 10 look-fors
- No mention of technical architecture
- Schedule system not mentioned as a requirement

### Which is Authoritative?

**Recommendation:** The actual codebase (EducatorEval) is the source of truth. BUILD_* documents appear to be from a different project or an earlier architectural decision that was abandoned.

---

## 9. Gaps and Missing Components

### From BUILD_OBJECTIVES.md Objective 2 (Schedule System - CRITICAL)

**Backend (Go) - Status: ❌ Not Started (No Go backend exists)**
- [ ] Schedule data models
- [ ] Schedule service
- [ ] 9 API endpoints for schedule operations
- [ ] Unit tests
- [ ] Integration tests

**Frontend - Status: ❌ Not Started**
- [ ] Schedule API client
- [ ] React Query hooks for schedules
- [ ] Schedule components (ScheduleManager, ScheduleViewer, etc.)
- [ ] TypeScript types

**Database - Status: ❌ Not Started**
- [ ] Firestore collections for schedules
- [ ] Security rules
- [ ] Indexes

**Integration - Status: ❌ Not Started**
- [ ] Observation form auto-population
- [ ] Schedule-aware observation scheduler
- [ ] Dashboard schedule context
- [ ] Analytics with schedule patterns

### From Integrated Observation Draft Plan

**Data Collection - Status: ⚠️ Partially Implemented**
- ✅ Online form concept (observations page exists)
- ❌ 10 look-fors mapping to frameworks (need to verify in observation form)
- ❌ Brief notes to teacher
- ❌ Automated dashboard linking

**Data Management - Status: ❌ Not Implemented**
- [ ] Centralized dashboard for all observations
- [ ] Tracking by observer, educator, and data points
- [ ] Aggregate and detailed analysis views
- [ ] Weekly 5-minute leadership review prompts

**Data Analysis - Status: ❌ Not Implemented**
- [ ] Quarterly divisional data analysis
- [ ] Trend identification
- [ ] Action plans generation
- [ ] Faculty meeting integration

---

## 10. Recommendations

### Immediate Actions

1. **Clarify Project Scope**
   - Decide if schedule system is actually required
   - If yes, add schedule types to `src/types/`
   - If no, remove from BUILD_* docs

2. **Update BUILD_* Documents**
   - Rename "CRP Platform" to "EducatorEval" throughout
   - Remove all references to `/functions` directory
   - Remove Go Cloud Functions references
   - Update architecture diagrams to match actual Astro structure
   - Note that mock auth is the active development mode

3. **Align Observation Framework**
   - Verify observation form implements all 10 look-fors from Integrated plan
   - Ensure framework mapping (CRP, Tripod, CASEL, etc.) is correctly implemented
   - Check that observation types match the Integrated Observation Draft Plan

4. **Document Actual Architecture**
   - Create accurate architecture diagram in CLAUDE.md
   - Document Firebase as BaaS (not Go functions)
   - List actual dependencies (including React Query)
   - Clarify that backend will be Firestore + Firebase Functions (if needed), not Go

### Strategic Decisions Needed

**Question 1: Is a schedule system actually required?**
- BUILD docs say it's "CRITICAL PRIORITY #1"
- Integrated Observation Draft Plan doesn't mention it
- No schedule types exist in codebase
- **Decision needed:** Build it, or remove from BUILD docs?

**Question 2: What is the backend strategy?**
- Options:
  a) Pure Firebase (Firestore + client-side SDK) ← **Currently implemented**
  b) Firebase Functions (TypeScript/JavaScript) ← **Not Go**
  c) External API server
- **Decision needed:** Document the chosen approach

**Question 3: Which documents are authoritative?**
- **Recommendation:**
  - CLAUDE.md + actual codebase = source of truth
  - Integrated Observation Draft Plan = requirements doc
  - BUILD_* docs = outdated, need major revision or archival

### Short-Term Priorities (if continuing current architecture)

1. ✅ **Mock auth working** - No action needed
2. **Connect observations to real Firestore** - Replace mock data with Firebase SDK calls
3. **Verify observation form** - Ensure 10 look-fors are implemented correctly
4. **Analytics dashboard** - Connect to real observation data
5. **User management** - Admin pages for managing 80+ observers

### Medium-Term (if schedule system is required)

1. Add schedule types to `src/types/schedule.ts`
2. Create schedule UI components
3. Implement Firestore collections for schedules
4. Build schedule integration with observation form
5. **DO NOT** use Go - use TypeScript throughout for consistency

---

## 11. Conclusion

### Key Findings

1. **Documentation Mismatch:** BUILD_* documents describe a different project architecture (Go functions, monorepo structure) than what exists
2. **Legacy References:** Functions directory was correctly removed but BUILD docs still reference it heavily
3. **Mock Auth Success:** Mock authentication system is working well for development
4. **Missing Schedule System:** Docs say it's critical, but it doesn't exist in codebase and isn't mentioned in observation requirements
5. **Name Confusion:** Project called "EducatorEval" in code, "CRP Platform" in BUILD docs, "CRP in Action" in observation plan

### Alignment Status

| Area | Aligned? | Notes |
|------|----------|-------|
| Tech Stack | ⚠️ Partial | React version different, React Query not documented |
| Project Structure | ❌ No | BUILD docs show monorepo, actual is single Astro project |
| Backend | ❌ No | BUILD docs assume Go functions, none exist |
| Auth System | ✅ Yes | Mock auth documented in CLAUDE.md and working |
| Observation Features | ⚠️ Unknown | Need to verify 10 look-fors implementation |
| Schedule System | ❌ No | Docs say critical, doesn't exist in code |
| Documentation | ❌ No | Multiple conflicting docs |

### Next Steps

1. **Review this alignment analysis** with stakeholders
2. **Make strategic decisions** on the questions above
3. **Update or archive BUILD_* documents** based on decisions
4. **Create accurate requirements doc** from Integrated Observation Draft Plan
5. **Verify observation form** implements all required frameworks
6. **Decide on schedule system** - build it or remove from scope

---

## Appendix: Document Inventory

### Current Documentation Files
1. ✅ **CLAUDE.md** - Accurate, recently updated, reflects current state
2. ✅ **DEVELOPMENT.md** - Accurate for mock auth setup
3. ✅ **README.md** - Updated to remove functions references
4. ⚠️ **BUILD_INSTRUCTIONS.md** - Outdated, references non-existent Go functions
5. ⚠️ **BUILD_OBJECTIVES.md** - Outdated, assumes different architecture
6. ⚠️ **WEEK_1_QUICK_START.md** - Outdated, references Go backend development
7. ⚠️ **START_HERE.md** - References outdated BUILD docs
8. ⚠️ **INDEX.md** - Navigation for outdated BUILD docs
9. ✅ **Integrated Observation Draft Plan.md** - Requirements doc, architecture-agnostic
10. 📂 **docs/** - Various technical docs (need review for accuracy)

### Recommendation
- Keep: CLAUDE.md, DEVELOPMENT.md, README.md, Integrated Observation Draft Plan.md
- Archive: BUILD_INSTRUCTIONS.md, BUILD_OBJECTIVES.md, WEEK_1_QUICK_START.md, START_HERE.md, INDEX.md
- Review: All files in docs/ directory for accuracy

---

**Generated:** November 7, 2025
**Status:** Ready for review
**Action Required:** Strategic decisions on scope and architecture
