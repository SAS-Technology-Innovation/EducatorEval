# EducatorEval App Flow Audit
**Date:** November 7, 2025
**Purpose:** Comprehensive assessment of current pages, data flow, and cleanup recommendations

---

## 📊 Current State Analysis

### Total Pages: 18
- **Main Pages:** 9
- **Admin Pages:** 9
- **Redundant/Old Pages:** 5 ❌ (Need deletion)
- **Active Pages:** 13 ✅

---

## 🗺️ Complete Page Inventory

### Main Application Pages (9 total)

| Page | Path | Status | Purpose | Keep/Delete | Notes |
|------|------|--------|---------|-------------|-------|
| **Landing** | `/` | ✅ Active | Public landing page | **KEEP** | Entry point for unauthenticated users |
| **Login** | `/login` | ✅ Active | Authentication | **KEEP** | Firebase Auth integration point |
| **Dashboard** | `/dashboard` | ✅ Active | Main user dashboard | **KEEP** | Role-based home after login |
| **Observations** | `/observations` | ✅ Active | Observation scheduler/form | **KEEP** | Core feature - 10 look-fors |
| **Schedule** | `/schedule` | ✅ Active | Teacher schedules | **KEEP** | Book observations by viewing teacher schedules |
| **Professional Learning** | `/professional-learning` | ✅ Active | Goals & PD tracking | **KEEP** | Connected to observation data |
| **Profile** | `/profile` | ✅ Active | User profile | **KEEP** | View/edit user info |
| **Settings** | `/settings` | ✅ Active | User preferences | **KEEP** | User-level settings |
| **Seed** | `/seed` | ❌ **DELETE** | Test data generation | **DELETE** | Development only, not for production |

### Admin Pages (9 total)

| Page | Path | Status | Purpose | Keep/Delete | Notes |
|------|------|--------|---------|-------------|-------|
| **Admin Index** | `/admin` | ❌ **DELETE** | Admin landing | **DELETE** | Redundant - use `/admin/dashboard` |
| **Admin Dashboard** | `/admin/dashboard` | ✅ Active | Admin overview | **KEEP** | Analytics, stats, system health |
| **Users** | `/admin/users` | ❌ **OLD** | Mock users list | **DELETE** | Replace with users-connected |
| **Users Connected** | `/admin/users-connected` | ✅ Active | Real Firestore users CRUD | **KEEP** | Actual working admin page |
| **Organizations** | `/admin/organizations` | ❌ **OLD** | Mock orgs list | **DELETE** | Replace with organizations-connected |
| **Organizations Connected** | `/admin/organizations-connected` | ✅ Active | Real Firestore orgs CRUD | **KEEP** | Actual working admin page |
| **Frameworks** | `/admin/frameworks` | ✅ Active | Framework management | **KEEP** | Edit 10 look-fors, master control |
| **Settings** | `/admin/settings` | ✅ Active | System-wide settings | **KEEP** | CRP config, system preferences |
| **Test Auth** | `/test-auth` | ❌ **DELETE** | Auth debugging | **DELETE** | Development only |

---

## 🔴 Pages to Delete (5 total)

### 1. `/seed.astro` - Seed Data Page ❌
**Why Delete:**
- Development/testing tool
- Not needed in production
- Large file (12KB) with mock data generation
- Security risk if exposed

**Action:** Delete immediately

---

### 2. `/test-auth.astro` - Auth Test Page ❌
**Why Delete:**
- Empty file (0 bytes)
- Debugging page for auth development
- Not needed in production
- Security risk

**Action:** Delete immediately

---

### 3. `/admin/index.astro` - Admin Landing ❌
**Why Delete:**
- Redundant with `/admin/dashboard`
- Causes confusion (two admin entry points)
- Should redirect to `/admin/dashboard` or be removed

**Action:** Delete and update navigation

---

### 4. `/admin/users.astro` - Old Users Page ❌
**Why Delete:**
- Uses mock data
- Replaced by `/admin/users-connected.astro`
- Non-functional admin controls
- Confusing to have both "users" and "users-connected"

**Action:** Delete, rename `users-connected.astro` to `users.astro`

---

### 5. `/admin/organizations.astro` - Old Organizations Page ❌
**Why Delete:**
- Uses mock data
- Replaced by `/admin/organizations-connected.astro`
- Non-functional admin controls
- Confusing to have both versions

**Action:** Delete, rename `organizations-connected.astro` to `organizations.astro`

---

## ✅ Pages to Keep (13 total)

### Core User Pages (7)
1. `/` - Landing page
2. `/login` - Authentication
3. `/dashboard` - Main dashboard
4. `/observations` - **PRIMARY FEATURE** - 10 integrated look-fors
5. `/schedule` - Teacher schedule viewer
6. `/professional-learning` - PD goals
7. `/profile` - User profile

### User Settings (1)
8. `/settings` - User preferences

### Admin Pages (5)
9. `/admin/dashboard` - Admin analytics
10. `/admin/users-connected` → **Rename to** `/admin/users`
11. `/admin/organizations-connected` → **Rename to** `/admin/organizations`
12. `/admin/frameworks` - **CRITICAL** - Master framework control
13. `/admin/settings` - System settings

---

## 🚀 Recommended App Flow (Post-Cleanup)

### Unauthenticated Flow
```
┌─────────────┐
│   Landing   │ → User lands on site
│      /      │
└──────┬──────┘
       │
       v
┌─────────────┐
│    Login    │ → Firebase Auth
│   /login    │
└──────┬──────┘
       │
       v
    [Auth'd]
```

### Authenticated Flow (Role-Based)

#### Observer/Educator Flow
```
┌──────────────┐
│   Dashboard  │ ← Home after login
│  /dashboard  │ ← View stats, recent observations
└──────┬───────┘
       │
       ├─────────────────────────────┐
       │                             │
       v                             v
┌──────────────┐            ┌────────────────┐
│ Observations │            │    Schedule    │
│/observations │            │   /schedule    │
│              │            │                │
│ • View List  │            │ • View teacher │
│ • New (10    │            │   schedules    │
│   look-fors) │            │ • Book obs     │
│ • Schedule   │            │   times        │
└──────────────┘            └────────────────┘
       │                             │
       └─────────────┬───────────────┘
                     │
                     v
            ┌────────────────────┐
            │ Professional Learn │
            │ /prof-learning     │
            │                    │
            │ • View goals       │
            │ • Track progress   │
            │ • PD suggestions   │
            └────────────────────┘
```

#### Admin Flow
```
┌─────────────────┐
│ Admin Dashboard │ ← Admin home
│ /admin/dashboard│ ← System stats, health
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┬──────────────────┐
         │                  │                  │                  │
         v                  v                  v                  v
┌───────────────┐  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐
│ Users         │  │ Organizations   │  │ Frameworks   │  │ Settings      │
│ /admin/users  │  │ /admin/orgs     │  │ /admin/      │  │ /admin/       │
│               │  │                 │  │ frameworks   │  │ settings      │
│ • DataTable   │  │ • DataTable     │  │              │  │               │
│ • CRUD ops    │  │ • CRUD ops      │  │ • Edit 10    │  │ • CRP config  │
│ • Roles       │  │ • Schools       │  │   look-fors  │  │ • System      │
│ • Firestore   │  │ • Firestore     │  │ • Master     │  │   settings    │
└───────────────┘  └─────────────────┘  │   control    │  └───────────────┘
                                        └──────────────┘
                                        ⬆️ CRITICAL - Drives everything
```

### All User Shared Pages
```
┌─────────┐     ┌──────────┐
│ Profile │     │ Settings │
│/profile │     │/settings │
│         │     │          │
│ • Info  │     │ • Prefs  │
│ • Edit  │     │ • Theme  │
└─────────┘     └──────────┘
```

---

## 📋 Data Flow Analysis

### Framework → Everything Else
```
┌─────────────────────────────────────┐
│    Framework Management             │
│    /admin/frameworks                │
│                                     │
│  • 10 Integrated Look-Fors         │
│  • Multiple framework alignments   │
│  • Rating scales                   │
│  • Observable behaviors            │
└──────────────┬──────────────────────┘
               │
               │ (Framework drives all forms/analytics)
               │
       ┌───────┴───────┬───────────────┬────────────────┐
       │               │               │                │
       v               v               v                v
┌─────────────┐ ┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Observation │ │  Analytics  │ │  Dashboard   │ │    Export   │
│    Form     │ │             │ │              │ │             │
│             │ │ • Evidence  │ │ • Framework  │ │ • Reports   │
│ Dynamically │ │   rates     │ │   scores     │ │ • CSV/PDF   │
│ generated   │ │ • Trends    │ │ • Charts     │ │ • Aligned   │
│ from        │ │ • By look-  │ │ • Progress   │ │   to        │
│ framework   │ │   for       │ │   tracking   │ │   framework │
└─────────────┘ └─────────────┘ └──────────────┘ └─────────────┘
```

### Authentication Flow
```
┌─────────────┐
│  Firebase   │
│    Auth     │
└──────┬──────┘
       │
       v
┌──────────────────┐
│   Auth Store     │ ← Zustand (currently mock)
│   /stores/auth   │
└──────┬───────────┘
       │
       ├──────────────────┬──────────────────┐
       │                  │                  │
       v                  v                  v
┌──────────────┐   ┌─────────────┐   ┌─────────────┐
│ AuthWrapper  │   │ AppProviders│   │  Protected  │
│  Component   │   │  Component  │   │   Routes    │
│              │   │             │   │             │
│ • Checks     │   │ • Auth +    │   │ • Role      │
│   auth       │   │   Query     │   │   checks    │
│ • Redirects  │   │   Client    │   │ • Access    │
│              │   │             │   │   control   │
└──────────────┘   └─────────────┘   └─────────────┘
```

### Observation Creation Flow (CRITICAL PATH)
```
1. Observer Login
   └─> Dashboard

2. Click "Observations" in sidebar
   └─> /observations (ObservationScheduler)

3. View Schedule OR Create New
   ├─> "Schedule View": See teacher availability
   │   └─> Filter by date
   │       └─> Select teacher from cards
   │           └─> Click "Observe" → Create form
   │
   └─> "Create New": Direct to form
       └─> Auto-populate from schedule (if available)

4. Observation Form (Framework-Driven)
   ├─> Context fields (teacher, class, date, etc.)
   ├─> 10 Look-Fors (from framework)
   │   └─> For each look-for:
   │       ├─> Observed / Not Observed
   │       ├─> Comments
   │       └─> Evidence (photos/notes)
   └─> Submit

5. Save to Firestore
   └─> /observations collection
       └─> Auto-calculate:
           ├─> Evidence percentage
           ├─> Framework alignment scores
           ├─> CRP evidence rate
           └─> Strengths/growth areas

6. Update Analytics
   └─> Real-time dashboard updates
       └─> Observer sees confirmation
           └─> Data available for reports
```

---

## 🔧 Immediate Action Items

### Step 1: Delete Old Pages (5 files)
```bash
rm src/pages/seed.astro
rm src/pages/test-auth.astro
rm src/pages/admin/index.astro
rm src/pages/admin/users.astro
rm src/pages/admin/organizations.astro
```

### Step 2: Rename Connected Pages
```bash
mv src/pages/admin/users-connected.astro src/pages/admin/users.astro
mv src/pages/admin/organizations-connected.astro src/pages/admin/organizations.astro
```

### Step 3: Update Sidebar Navigation
- Remove references to deleted pages
- Update admin links to point to renamed pages
- Already done in previous work ✅

### Step 4: Update Documentation
- Update PROJECT_STATUS.md with current page count
- Update CLAUDE.md with correct page structure
- Update BUILD_INSTRUCTIONS.md with accurate flow

---

## 📊 Final Page Structure (13 pages)

### Main App (8 pages)
```
/                       Landing page
/login                  Authentication
/dashboard              Main dashboard
/observations           10 look-fors observation tool
/schedule               Teacher schedule viewer
/professional-learning  PD goals and tracking
/profile                User profile
/settings               User preferences
```

### Admin (5 pages)
```
/admin/dashboard        Admin home & analytics
/admin/users            User management (Firestore-connected)
/admin/organizations    Org management (Firestore-connected)
/admin/frameworks       Framework editor (MASTER CONTROL)
/admin/settings         System-wide configuration
```

---

## 🎯 Critical Success Factors

### 1. Framework is Master
- **Everything** is driven by the framework
- Forms, analytics, exports all dynamically generated
- Single source of truth for observation structure
- Editing framework updates entire system

### 2. Firestore is Source of Truth
- No more mock data pages
- All admin pages use real Firestore connections
- React Query for data fetching
- Optimistic updates for better UX

### 3. Clean, Logical Navigation
- 13 focused pages (down from 18)
- Clear user vs admin separation
- No duplicate or confusing pages
- Role-based access control

### 4. Mobile-First Observation
- Observers primarily use mobile devices
- 10-15 minute quick observations
- Auto-population from schedules (when ready)
- Offline support (future)

---

## 📈 Impact of Cleanup

### Before Cleanup
- 18 pages (5 redundant/broken)
- Confusing "connected" vs non-connected admin pages
- Mock data mixed with real data
- Development pages in production
- Unclear app flow

### After Cleanup
- 13 focused, working pages
- Clear purpose for each page
- All admin pages use Firestore
- No development artifacts
- Crystal clear app flow

### Result
- ✅ Easier to understand
- ✅ Easier to maintain
- ✅ Faster development
- ✅ Better user experience
- ✅ Production-ready structure

---

## 🔄 Next Steps (Priority Order)

1. **Execute Cleanup** (30 minutes)
   - Delete 5 old pages
   - Rename 2 connected pages
   - Test all navigation links

2. **Load Framework Seed Data** (15 minutes)
   - Import 10 integrated look-fors
   - Verify framework displays correctly
   - Test framework editing

3. **Update Documentation** (1 hour)
   - Update PROJECT_STATUS.md
   - Update CLAUDE.md
   - Create user flow diagrams

4. **Test Complete Flow** (2 hours)
   - Test all 13 pages
   - Verify navigation
   - Check role-based access
   - Mobile responsiveness

5. **Deploy Clean Version** (30 minutes)
   - Build and test
   - Deploy to staging
   - Verify production readiness

---

## 📝 Documentation Updates Needed

### Files to Update:
1. **PROJECT_STATUS.md**
   - Update page count: 18 → 13
   - Remove schedule system from "critical blocker"
   - Add framework management as completed
   - Update architecture diagram

2. **CLAUDE.md**
   - Update page structure section
   - Remove references to applet pages (already done)
   - Add framework management instructions
   - Update common issues

3. **BUILD_OBJECTIVES.md**
   - Mark Objective 1 as partially complete
   - Update page inventory
   - Add framework as completed deliverable

4. **BUILD_INSTRUCTIONS.md**
   - Update page count and structure
   - Add framework management section
   - Update deployment checklist

---

## ✅ Success Criteria

This audit is complete when:
- [x] All 18 pages identified and categorized
- [x] 5 pages marked for deletion with justification
- [x] 13 pages marked as keep with purpose
- [x] Complete app flow documented
- [x] Data flow mapped
- [x] Action plan created
- [ ] Cleanup executed
- [ ] Documentation updated
- [ ] All pages tested

---

**Status:** Audit Complete ✅
**Next Action:** Execute cleanup (Step 1-2)
**Time to Complete:** ~2 hours for full cleanup + testing

---

**Prepared By:** Claude + Bryan
**Date:** November 7, 2025
**Purpose:** App cleanup and flow optimization
