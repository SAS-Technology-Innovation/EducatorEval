# Changelog

All notable changes to the EducatorEval platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2024-12-10

### Added

- **Role-Based Dashboards**: New dashboards for different user roles
  - `ManagerDashboard` - Team member count from real Firestore data
  - `StaffDashboard` - Basic staff dashboard for staff role users
- **Goals System**: Professional learning goals management
  - `CreateGoalModal` - Create new SMART goals
  - `GoalDetailModal` - View and edit goal details
  - `GoalsList` - Display goals with progress tracking
- **Alignments API**: Full CRUD for framework alignments
  - `app/api/alignments.ts` - Alignments API layer
  - `app/hooks/useAlignments.ts` - React Query hooks
  - `AlignmentsManagement` - Admin UI component
- **New Firestore Services**:
  - `goalTemplatesService` - Goal template management
  - `goalsService` - User goals management
  - `alignmentsService` - Framework alignments
- **New React Query Hooks**:
  - `useUsersByDivision` - Fetch users by division
  - `useUsersByDepartment` - Fetch users by department
  - `useEducatorSchedule` - Fetch educator schedule

### Changed

- **ObservationForm**: Connected to `useCreateObservation` mutation
  - Fetches teachers from database via `useTeachers` hook
  - Transforms form data to Observation type
  - Added loading states and toast notifications
- **UserProfile/Settings**: Save to Firestore with proper type transformation
  - Settings now persist to `UserPreferences` in Firestore
  - Added success/error toast notifications
- **SchedulePage**: Connected to `useEducatorSchedule` hook
  - Week navigation with real schedule data
  - Display class assignments in grid format
  - Show schedule overview stats
- **OrganizationsManagement**: Full CRUD operations
  - Create/Edit modal with form validation
  - Connected to mutation hooks
- **DashboardPage**: Routes staff users to StaffDashboard
- **firestore.ts**: Added `getByDivision` and `getByDepartment` query methods

### Fixed

- Removed duplicate `SchedulePageNew.tsx` file
- Removed non-existent `DashboardTest` export from admin/index.ts
- Fixed TypeScript errors in organization type queries
- Fixed `useOrganizations` hook to return properly typed data

## [2.0.0] - 2024-11-12

### Added

- **Major architectural migration from Astro to Vite + React SPA**
- Pure React 19 single-page application with React Router
- Public landing page with full SAS branding
- Enhanced authentication system with multi-modal login (Sign In, Sign Up, Reset Password)
- Singapore American School (SAS) branding throughout application
  - Custom color palette (Navy #1A4190, Red #E51322)
  - Bebas Neue and Poppins fonts
  - Hero sections with SAS imagery
- PostCSS configuration for Tailwind CSS processing
- New routing structure: public pages at `/`, protected pages at `/dashboard`
- Mock authentication mode for development
- Role-based access control with 6-tier hierarchy

### Changed
- Migrated from Astro SSR to Vite client-side rendering
- Updated all components to use SAS brand colors (209 instances)
- Replaced generic blue colors with SAS navy throughout codebase
- Changed routing to use React Router Links instead of anchor tags
- Updated build system to use Vite instead of Astro
- Reorganized authentication redirects to use `/dashboard` as main protected route

### Fixed
- CSS loading issue by adding missing postcss.config.js
- React Router integration using useLocation() instead of window.location
- Tailwind config content paths for Vite
- Build configuration for TypeScript checking

### Removed
- Astro framework and all Astro-specific code
- Astro test pages
- Server-side rendering capabilities

## [1.x.x] - Previous Versions

See `summaries/` directory for historical development documentation and planning notes.
