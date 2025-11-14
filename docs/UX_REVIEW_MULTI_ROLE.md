# User Experience Review: Multi-Role Users (Teacher, Observer, Admin)

**Date:** 2025-11-12
**Context:** Users can have one or all three roles simultaneously - Teacher (Educator), Observer, Administrator

---

## Executive Summary

### Critical Gaps Identified
1. **No role-switching UI** - Users with multiple roles cannot easily switch contexts
2. **Navigation doesn't adapt to active role** - Sidebar shows all features regardless of current context
3. **No visual indicator of current role** - Users don't know which "hat" they're wearing
4. **Missing role-specific dashboards** - Single dashboard tries to serve all roles
5. **No contextual help** - No guidance for role-specific workflows

---

## Current Implementation Analysis

### ✅ What Works Well

1. **Role-Based Access Control (RBAC)**
   - Robust 6-tier hierarchy: `staff → educator → observer → manager → administrator → super_admin`
   - Permission system with granular controls
   - `secondaryRoles` array supports multiple roles per user

2. **Security**
   - Routes properly protected with `ProtectedLayout`
   - Admin routes require specific roles
   - Mock auth for development, Firebase for production

3. **Technical Foundation**
   - Clean routing structure: `/`, `/auth/*`, `/app/*`, `/admin/*`
   - Proper separation of concerns in code organization

---

## Detailed UX Gaps by User Type

### 1. EDUCATOR (Teacher) Experience

#### Current State
- Can access: Dashboard, Observations (read-only), Professional Learning, Schedule, Profile
- Primary need: View their own observations, track goals, see schedule

#### Gaps
❌ **No "My Observations" filtered view** - sees all observations they have access to
❌ **No clear goal progress tracking** - professional learning page exists but no dashboard widget
❌ **No upcoming observation alerts** - no proactive notifications
❌ **Missing observation history timeline** - can't see growth over time
❌ **No feedback acknowledgment workflow** - can't respond to observer comments

#### Recommendations
✅ **Educator-Focused Dashboard**
- Widget: Upcoming observations this month
- Widget: Recent observation scores with trend
- Widget: Active SMART goals progress bars
- Widget: Recommended professional development based on observations

✅ **"My Observations" Page**
- Timeline view of all past observations
- Filter by observer, date range, framework area
- Visual trend charts (scores over time)
- Quick action: Request follow-up observation

✅ **Goal Tracking Integration**
- Link observations to specific goals
- Auto-suggest goals based on observation areas needing improvement
- Progress indicators with evidence collection

---

### 2. OBSERVER Experience

#### Current State
- Can access: All educator features PLUS observation creation, assigned observations, team reports
- Primary need: Conduct observations, manage schedule, view their observation history

#### Gaps
❌ **No "Observer Mode" toggle** - if user is also a teacher, sees mixed data
❌ **No observation queue/workflow** - no clear "next up" list
❌ **Missing observation templates** - starts from scratch each time
❌ **No post-observation workflow** - no reminder to follow up or schedule check-in
❌ **Can't see observer calendar** - assigned observations not in calendar view
❌ **No observer dashboard** - same dashboard as educator role

#### Recommendations
✅ **Role Switcher Component**
```typescript
// Top-right corner next to profile
<RoleSwitcher>
  Current Role: Observer 👁️
  Switch to: Teacher 📚 | Admin ⚙️
</RoleSwitcher>
```
When switched:
- Navigation highlights relevant sections
- Dashboard shows role-appropriate widgets
- URLs stay same but data filters by role context

✅ **Observer-Focused Dashboard**
- Widget: Upcoming observations today/this week
- Widget: Observations pending completion (drafts)
- Widget: Follow-ups needed (30-day check-ins)
- Widget: My observation statistics (completed, average scores)

✅ **Observation Workflow Enhancement**
- **Pre-Observation:** Template selector, review past observations of this teacher
- **During:** Mobile-friendly form, voice-to-text notes, timer
- **Post:** Schedule follow-up meeting, set reminder, share immediately or review later
- **Follow-Up:** 30/60/90 day check-in prompts

✅ **Observer Calendar Integration**
- Calendar view showing all assigned observations
- Color-coded: upcoming (blue), completed (green), overdue (red)
- Quick reschedule drag-and-drop
- Sync to Google/Outlook calendar

---

### 3. ADMINISTRATOR Experience

#### Current State
- Can access: All app features PLUS /admin/* routes
- Admin routes: Dashboard, Users, Organizations, Frameworks, Settings
- Primary need: Manage users, view school-wide analytics, configure system

#### Gaps
❌ **Admin navigation mixed with app navigation** - no clear separation
❌ **No admin-only mode** - if also a teacher, sees teacher nav always
❌ **Missing analytics/reporting** - no school-wide observation data
❌ **No bulk operations** - can't assign multiple observations at once
❌ **No user onboarding workflow** - admins manually create users
❌ **Missing compliance reports** - no "all teachers observed this quarter" report

#### Recommendations
✅ **Admin-Focused Layout**
When in Admin role:
- Different layout with admin-specific sidebar
- Top nav shows: Admin Dashboard | Users | Analytics | Settings
- Quick stats bar: Total users, Active observations, Completion rate

✅ **Admin Dashboard**
- Widget: Observation completion rate by division/department
- Widget: Recent user activity
- Widget: System health (Firebase quotas, storage)
- Widget: Upcoming compliance deadlines

✅ **Analytics & Reporting**
- **School-Wide Reports:**
  - Observation completion by department
  - Average scores across frameworks
  - Goal attainment rates
  - Observer workload distribution
- **Export Options:** PDF, Excel, CSV
- **Scheduled Reports:** Auto-email monthly summaries

✅ **Bulk Operations**
- Assign observations: Select multiple teachers → assign to observer → set dates
- Import users: CSV upload with role assignment
- Bulk messaging: Send announcements to role groups

---

## Critical UX Improvements Needed

### Priority 1: Role Switching System

**Problem:** User is both Teacher AND Observer - which view should they see?

**Solution:** Role Context Switcher

**Location:** Top-right header, next to profile dropdown

**Component Design:**
```tsx
interface RoleSwitcherProps {
  user: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

// Shows only roles user actually has
// Teacher sees: [Teacher] [Observer] (if has both)
// Teacher+Admin sees: [Teacher] [Observer] [Admin]
```

**Behavior:**
1. Click to see dropdown of available roles
2. Select role → dashboard and nav adapt
3. Badge shows active role color-coded:
   - Teacher: Blue 📚
   - Observer: Purple 👁️
   - Admin: Red ⚙️
4. Persists choice in localStorage
5. Some pages force a role (e.g., /admin/* = Admin mode)

---

### Priority 2: Role-Adaptive Navigation

**Problem:** Sidebar shows all links even if not relevant to current role

**Solution:** Dynamic Navigation Based on Active Role

**Teacher Mode:**
```
Dashboard (teacher dashboard)
├─ My Observations
├─ My Goals
└─ My Schedule
Professional Learning
Profile & Settings
```

**Observer Mode:**
```
Dashboard (observer dashboard)
├─ Assigned Observations
├─ Observation Queue
└─ My Statistics
Schedule (my observation calendar)
Professional Learning
Profile & Settings
```

**Admin Mode:**
```
Admin Dashboard
├─ Analytics
├─ Reports
Users & Teams
Organizations
Frameworks
System Settings
---
[Quick Switch to Teacher/Observer Mode]
```

---

### Priority 3: Context-Aware Dashboards

**Problem:** Single CRPLandingDashboard serves all roles poorly

**Solution:** Three Dashboard Views

**File Structure:**
```
app/app/
├── DashboardPage.tsx (router decides which to show based on active role)
├── TeacherDashboard.tsx
├── ObserverDashboard.tsx
└── AdminDashboard.tsx (already exists at app/admin/Dashboard.tsx)
```

**Implementation:**
```tsx
// DashboardPage.tsx
const DashboardPage = () => {
  const { user, activeRole } = useAuthStore();

  // Determine which dashboard to show
  if (activeRole === 'administrator' || activeRole === 'super_admin') {
    return <AdminDashboard />;
  }

  if (activeRole === 'observer') {
    return <ObserverDashboard />;
  }

  // Default to educator view
  return <TeacherDashboard />;
};
```

---

### Priority 4: Notifications & Alerts System

**Problem:** No proactive notifications for time-sensitive actions

**Solution:** Role-Specific Notification Center

**Bell Icon → Notification Dropdown:**

**Teacher Notifications:**
- 🔔 Observation scheduled for [Date] with [Observer]
- ✅ New observation feedback available
- 🎯 Goal deadline approaching (30 days)
- 📅 Professional development session tomorrow

**Observer Notifications:**
- 📝 Observation due today: [Teacher Name]
- ⏰ Follow-up needed: 30-day check-in with [Teacher]
- 📊 Monthly observation summary ready
- ❗ Overdue observation: [Teacher Name]

**Admin Notifications:**
- 👥 New user signup pending approval
- 📊 Weekly observation completion: 78% (below target)
- ⚠️ System alert: Firebase quota at 80%
- 📋 Compliance report due next week

---

### Priority 5: Mobile Responsiveness

**Problem:** Observation forms difficult on mobile (observers in classrooms)

**Solution:** Mobile-First Observation Experience

**Features:**
- **Touch-optimized:** Large tap targets, swipe gestures
- **Offline-capable:** Save draft locally, sync when online
- **Voice input:** Speak notes, auto-transcribe
- **Camera integration:** Take photos of student work, teacher materials
- **Quick rubric:** Tap to rate, swipe to next item
- **Timer:** Built-in observation timer (15/30/45 min presets)

---

## Recommended Implementation Phases

### Phase 1: Foundation (Week 1-2)
✅ Add `activeRole` to auth store
✅ Create RoleSwitcher component
✅ Update navigation to be role-aware
✅ Create TeacherDashboard component
✅ Create ObserverDashboard component

### Phase 2: Role-Specific Features (Week 3-4)
✅ Teacher: "My Observations" filtered view
✅ Observer: Observation queue/workflow
✅ Admin: Analytics dashboard
✅ Notification system infrastructure

### Phase 3: Enhanced Workflows (Week 5-6)
✅ Observation templates
✅ Goal tracking integration
✅ Calendar integration
✅ Bulk operations for admins

### Phase 4: Polish & Mobile (Week 7-8)
✅ Mobile-optimized observation form
✅ Offline support
✅ Voice input
✅ Comprehensive testing

---

## Quick Wins (Can Implement Immediately)

### 1. Add Role Badge to Header
```tsx
// app/components/layout/AppLayout.tsx
<div className="flex items-center gap-2">
  <span className="px-3 py-1 bg-sas-navy-100 text-sas-navy-600 rounded-full text-xs font-medium">
    {user.primaryRole === 'educator' && '📚 Teacher'}
    {user.primaryRole === 'observer' && '👁️ Observer'}
    {user.primaryRole === 'administrator' && '⚙️ Admin'}
  </span>
  <UserProfileDropdown />
</div>
```

### 2. Update Sidebar Hrefs to Use `/app/*`
Currently uses `/dashboard`, should be `/app/dashboard` for consistency

### 3. Add "View As" Dropdown for Multi-Role Users
```tsx
{user.secondaryRoles.length > 0 && (
  <div className="border-t border-gray-200 pt-2 mt-2">
    <span className="text-xs text-gray-500">View As:</span>
    <select onChange={handleRoleChange}>
      <option value={user.primaryRole}>{user.primaryRole}</option>
      {user.secondaryRoles.map(role => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  </div>
)}
```

---

## User Stories to Validate

### Teacher User Story
> "As a teacher who is also sometimes an observer, I want to easily switch between viewing my own observations and conducting observations of others, without getting confused about which view I'm in."

**Acceptance Criteria:**
- [ ] Clear visual indicator of current role
- [ ] One-click role switching
- [ ] Navigation updates to show relevant links
- [ ] Dashboard shows role-appropriate widgets
- [ ] URLs stay consistent (filtering happens via role context)

### Observer User Story
> "As an instructional coach who observes 20 teachers, I want to see my observation schedule, quickly access templates, and be reminded of follow-ups, so I can manage my workload efficiently."

**Acceptance Criteria:**
- [ ] Observer dashboard shows upcoming observations
- [ ] Calendar view of all assigned observations
- [ ] Template library for common observation types
- [ ] Automated follow-up reminders (30/60/90 days)
- [ ] Mobile-friendly observation form

### Admin User Story
> "As a principal who is also a teacher, I need to check school-wide observation completion rates and assign observations to instructional coaches, while also being able to view my own teaching observations separately."

**Acceptance Criteria:**
- [ ] Separate admin interface with analytics
- [ ] Bulk assignment of observations
- [ ] Compliance reports (% teachers observed)
- [ ] Ability to switch to Teacher view to see own data
- [ ] User management tools

---

## Conclusion

The platform has a solid technical foundation with proper RBAC and security. However, the UX needs significant enhancement to support users who hold multiple roles simultaneously.

**Top 3 Priorities:**
1. **Role Switcher** - Let users choose their context
2. **Adaptive Navigation** - Show relevant features per role
3. **Role-Specific Dashboards** - Tailored information per role

Implementing these changes will transform the platform from "one-size-fits-all" to "context-aware" and significantly improve daily usability for your diverse user base.
