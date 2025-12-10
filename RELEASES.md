# Releases

## Version 2.1.0 - Real Data Integration (2024-12-10)

### Overview

This release connects all UI components to real Firestore data, eliminating hardcoded mock data throughout the application. Adds role-based dashboards and a professional learning goals system.

### Key Features

- **Real Data Everywhere** - All UI components now fetch from Firestore
- **Role-Based Dashboards** - Dedicated dashboards for Manager and Staff roles
- **Goals System** - Professional learning goals with SMART goal tracking
- **Alignments API** - Full CRUD for framework alignments
- **Schedule Integration** - Educator schedules with class assignments

### New Components

| Component | Description |
|-----------|-------------|
| ManagerDashboard | Team member stats from real data |
| StaffDashboard | Basic dashboard for staff role |
| CreateGoalModal | Create SMART goals |
| GoalDetailModal | View/edit goal details |
| GoalsList | Display goals with progress |
| AlignmentsManagement | Admin UI for alignments |

### API Additions

- `goalTemplatesService` - Goal template CRUD
- `goalsService` - User goals CRUD
- `alignmentsService` - Framework alignments CRUD
- `useUsersByDivision` / `useUsersByDepartment` hooks
- `useEducatorSchedule` hook

### Deployment Notes

- No breaking changes from 2.0.0
- New Firestore collections: `goal_templates`, `goals`, `framework_alignments`
- Run `npm run build:check` to verify TypeScript compilation

---

## Version 2.0.0 - Vite Migration Release (2024-11-12)

### Overview

Major architectural overhaul migrating from Astro SSR to pure React SPA with Vite. This release establishes a modern, maintainable foundation for the EducatorEval platform.

### Key Features

- **Pure React 19 SPA** with Vite bundler for optimal performance
- **Full SAS Branding** - Singapore American School visual identity throughout
- **Enhanced Authentication** - Multi-modal login with role-based access control
- **Modern Routing** - React Router v6 with clear separation of public/protected routes
- **Developer Experience** - Fast HMR, TypeScript support, mock auth for development

### Deployment Notes

- Ensure environment variables are migrated to VITE_ prefix
- Switch from mock authentication to Firebase auth before production deployment
- Review Firestore security rules
- Update hosting configuration for client-side routing

### Breaking Changes

- Complete removal of Astro framework
- New routing structure: `/` (landing), `/auth/*` (authentication), `/app/*` (protected), `/admin/*` (admin)
- Environment variables now require VITE_ prefix for client access
- SSR functionality removed (pure client-side rendering)

### Migration Path from 1.x

1. Update environment variables with VITE_ prefix
2. Clear node_modules and reinstall dependencies
3. Update Firebase hosting configuration for SPA routing
4. Deploy Firestore security rules
5. Test authentication flows thoroughly

---

## Version 1.x - Astro-based Platform (Legacy)

Previous versions built on Astro framework. See summaries/ directory for historical documentation.
