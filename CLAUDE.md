# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EducatorEval is an educational evaluation platform built with **Vite**, **React 19**, **TypeScript**, and **Firebase**. It provides role-based access control for CRP (Culturally Responsive Pedagogy) classroom observations, professional learning goals, and training suggestions.

**Architecture**: Pure React SPA with React Router - migrated from Astro to eliminate SSR complications with React Query.

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

## Architecture

### Vite + React SPA Architecture

The app is a **pure React SPA** using **React Router** for client-side routing. No SSR - all rendering happens client-side.

**Entry Points:**
- `index.html` - HTML entry point
- `src/main.tsx` - React app initialization with BrowserRouter
- `src/App.tsx` - Main app component with routes and authentication

**Routing Structure:**
```typescript
// src/App.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={<ProtectedLayout><CRPLandingDashboard /></ProtectedLayout>} />
  <Route path="/admin/users" element={<ProtectedLayout requireRoles={['administrator']}><AdminUsers /></ProtectedLayout>} />
  ...
</Routes>
```

**Key Rules:**
- All routes defined in `src/App.tsx`
- Protected routes wrapped in `<ProtectedLayout>` component
- Authentication checked client-side before rendering
- AppProviders wraps entire app for React Query context

### Authentication System

**Dual Authentication Mode:**
The app supports two authentication modes controlled by `src/stores/auth.ts`:

1. **Mock Auth (Development)** - Currently active
   - File: `src/stores/mockAuthStore.ts`
   - Auto-authenticates as super admin
   - No Firebase connection required
   - Mock user: dev@sas.edu.sg with full permissions

2. **Firebase Auth (Production)**
   - File: `src/stores/authStore.ts`
   - Full Firebase Authentication integration
   - Uses Firestore for user profiles

**Switching modes:** Edit `src/stores/auth.ts` to export from either `./mockAuthStore` or `./authStore`.

### State Management

**Zustand Stores:**
- `src/stores/authStore.ts` - Firebase authentication (production)
- `src/stores/mockAuthStore.ts` - Mock authentication (development)
- `src/stores/auth.ts` - Selector/facade for auth mode

All stores use Zustand with `subscribeWithSelector` middleware. The auth store interface is identical between mock and real implementations.

### Data Layer

**Three-tier data architecture:**

1. **Firebase Layer** (`src/lib/`)
   - `firebase.ts` - Firebase app initialization
   - `firestore.ts` - Generic FirestoreService class with CRUD operations

2. **API Layer** (`src/api/`)
   - `core.ts` - Typed wrappers around FirestoreService
   - `observations.ts` - Observation-specific API methods
   - Exports typed service instances (e.g., `usersService`, `observationApi`)

3. **React Query Layer** (`src/hooks/`)
   - `useObservations.ts` - React Query hooks for observations
   - `useFrameworks.ts` - React Query hooks for frameworks
   - Must be wrapped in `QueryClientProvider` (see `src/components/providers/AppProviders.tsx`)

### Type System

**Centralized type exports** via `src/types/index.ts`:
- `core.ts` - UserRole, JobTitle, User types
- `observation.ts` - CRP observation types and structures
- `professional-learning.ts` - Professional development and SMART goals

**Import pattern:** Always import from `src/types` (the index), never from individual files:
```typescript
import type { UserRole, JobTitle } from '../types';  // ✅ Correct
import { UserRole, JobTitle } from '../types/core';   // ❌ Causes hydration errors
```

### Role-Based Access Control

**Six role hierarchy** (defined in `src/utils/roleMapping.ts`):
1. `staff` - Basic access
2. `educator` - Teachers, can view own observations
3. `observer` - Can conduct observations
4. `manager` - Department heads, manage teams
5. `administrator` - School admins, full user management
6. `super_admin` - System-wide access

**Permission system:** Each role has specific permissions (e.g., `observations.create`, `users.manage`). Use utility functions from `roleMapping.ts` like `canManageUsers()`, `canObserveOthers()`, `canAccessAdmin()`.

### Component Organization

```
src/components/
├── admin/              # Admin dashboard components
├── auth/               # Login forms, auth UI
├── common/             # Reusable UI components (buttons, modals, etc.)
├── dashboard/          # Main dashboard components
├── features/           # Feature-specific components (CRP observations, professional learning)
├── layout/             # Layout components (UnifiedHeader, PlatformLayout)
├── providers/          # Context providers (AuthWrapper, AppProviders, QueryProvider)
└── user/               # User profile and settings components
```

### Provider Components

**Critical provider components** in `src/components/providers/`:

1. **AuthWrapper.tsx** - Authentication boundary
   - Checks if user is authenticated
   - Optionally checks roles/permissions
   - Redirects to login if not authenticated
   - Shows loading state during auth initialization
   - Use this for pages that don't need React Query

2. **AppProviders.tsx** - Combined QueryClient + AuthWrapper
   - Provides React Query client context
   - Wraps content in AuthWrapper for auth checking
   - Use this for pages that use React Query hooks (e.g., observations)
   - Includes default query options (5min staleTime, no refetch on focus)

3. **QueryProvider.tsx** - Standalone QueryClient provider
   - Just provides React Query context without auth
   - Rarely used directly (prefer AppProviders)

**When to use which:**
- Page uses React Query → Use `AppProviders`
- Page only needs auth → Use `AuthWrapper`
- Page is public → Use neither, just wrap in `Layout`

### Core Features

**CRP Observations Framework:**
The platform centers around Culturally Responsive Pedagogy (CRP) observations as the primary evaluation tool:
- Structured observation forms with CRP-specific criteria
- Real-time observation data capture and storage
- Historical observation tracking and analysis
- Observer and observee role management

**Professional Learning Integration:**
- SMART goals tied to observation outcomes
- Training suggestions based on observation data
- Professional development tracking
- Goal progress monitoring and updates

### Page Routing

Astro file-based routing:
- `src/pages/index.astro` - Landing page
- `src/pages/login.astro` - Login (shows "already authenticated" in dev mode)
- `src/pages/dashboard.astro` - Main dashboard
- `src/pages/observations.astro` - CRP Observations list and management (uses `AppProviders` for React Query)
- `src/pages/admin/*.astro` - Admin pages (require admin roles)

**All protected pages must wrap content in `AuthWrapper`** with appropriate `requireAuth` and `requireRoles` props.

## Common Patterns

### Adding a New Route

All routes are defined in `src/App.tsx`. To add a new route:

```typescript
// 1. Create your page component in src/pages/
// src/pages/YourPage.tsx
import React from 'react';
import YourComponent from '../components/YourComponent';

export default function YourPage() {
  return <YourComponent />;
}

// 2. Add route to src/App.tsx
import YourPage from './pages/YourPage';

// Inside <Routes>:
<Route path="/your-path" element={<ProtectedLayout><YourPage /></ProtectedLayout>} />

// For admin-only routes:
<Route path="/admin/your-path" element={
  <ProtectedLayout requireRoles={['administrator', 'super_admin']}>
    <YourPage />
  </ProtectedLayout>
} />
```

### Using React Query

All components have access to React Query because `AppProviders` wraps the entire app. Just import and use hooks directly:

```typescript
import { useObservations } from '../hooks/useObservations';

export default function MyComponent() {
  const { data, isLoading } = useObservations();
  // ... use data
}
```

### Adding a New Firestore Collection

1. Define types in `src/types/`
2. Create API service in `src/api/`:
   ```typescript
   export const yourService = new FirestoreService('your-collection');
   ```
3. Create React Query hooks in `src/hooks/` if needed
4. Use in components via the hooks

## Styling System

**SAS Brand Colors** - Singapore American School official branding:
- **Primary**: Navy (#1A4190) and Red (#E51322)
- **Fonts**: Bebas Neue (headings), Poppins (body)

**Tailwind Configuration** (`tailwind.config.js`):
- Extended color palette: `sas-navy`, `sas-red`, `sas-blue`, `sas-green`, `sas-purple`, `sas-gray`
- Each color has 50-900 shades (e.g., `sas-navy-600` is the primary navy)
- Custom backgrounds: `sas-background`, `sas-background-alt`
- Gradient utilities: `bg-sas-gradient`

**Global Styles** (`src/styles/global.css`):
- CSS variables for colors (e.g., `--sas-navy`, `--sas-red`)
- Custom component classes:
  - `.sas-card` - Card component styling
  - `.sas-button-primary` - Primary button with gradient
  - `.sas-button-secondary` - Secondary outline button
  - `.sas-input` - Form input styling
  - `.sas-eagle-gradient` - Navy to red gradient
  - `.sas-hero-banner` - Hero section with SAS image

**Usage example:**
```tsx
<button className="sas-button-primary">Click Me</button>
<div className="bg-sas-navy-600 text-white p-4">SAS Navy Box</div>
```

## Layout System

**Main Layout** (`src/layouts/Layout.astro`):
- Base HTML template with SAS branding
- Includes global CSS and font imports (Poppins, Bebas Neue)
- Provides `<slot />` for page content
- Sets up viewport, meta tags, and favicon
- Accepts `title` prop for page titles

**Usage:**
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Your Page Title">
  <!-- Your content here -->
</Layout>
```

## Important Constraints

- **Pure client-side SPA** - No SSR, all rendering happens in the browser
- **Firebase is pre-bundled** via Vite `optimizeDeps` config
- **Type imports must use `type` keyword** for proper tree-shaking
- **Mock auth is currently active** - check `src/stores/auth.ts` export before deploying
- **Environment variables must use VITE_ prefix** for Vite to expose them to the client

## Firebase Configuration

Environment variables in `.env` (use `VITE_` prefix for Vite):
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Development Settings
VITE_USE_MOCK_AUTH="true"  # Set to "false" for production
VITE_USE_FIREBASE_EMULATORS="true"  # Set to "true" to use Firebase emulators
```

**IMPORTANT**: After updating `.env`, restart the dev server for changes to take effect.

## Common Issues and Troubleshooting

### Firebase Invalid API Key Error

**Problem:** `Firebase: Error (auth/invalid-api-key)` on app load
**Cause:** Environment variables not loaded or using wrong prefix
**Solution:**
1. Ensure `.env` file exists (copy from `.env.example`)
2. All Firebase env vars must use `VITE_` prefix
3. Restart dev server after changing `.env`
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
npm run dev
```

### Type Import Errors

**Problem:** "The requested module does not provide an export named..."
**Cause:** Importing directly from individual type files instead of index
**Solution:**
```typescript
// ❌ Wrong
import { UserRole } from '../types/core';

// ✅ Correct
import type { UserRole } from '../types';
```

### React Router Navigation Not Working

**Problem:** Links don't navigate or page refreshes
**Cause:** Using `<a>` tags instead of React Router's `Link`
**Solution:**
```typescript
// ❌ Wrong
<a href="/dashboard">Dashboard</a>

// ✅ Correct
import { Link } from 'react-router-dom';
<Link to="/dashboard">Dashboard</Link>
```

### Environment Variables Not Available

**Problem:** `import.meta.env.VITE_*` returns undefined
**Cause:** Env vars must use `VITE_` prefix and server must be restarted
**Solution:**
1. Ensure variable names start with `VITE_` in `.env`
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Access with `import.meta.env.VITE_YOUR_VAR`

### Pages Redirecting to Login

**Problem:** Authenticated users get redirected to login
**Cause:** Mock auth not active or auth store not initialized
**Solution:**
- Verify `src/stores/auth.ts` exports from `./mockAuthStore`
- Check browser console for auth initialization messages
- Mock auth auto-creates a super admin user on load

## Documentation

- `DEVELOPMENT.md` - Mock auth system and development workflow
- `docs/PROJECT_STRUCTURE.md` - Detailed component/file organization
- `docs/IMPLEMENTATION_INSTRUCTIONS.md` - Setup and deployment guide
- `docs/FIREBASE_REVIEW_COMPLETE.md` - Firebase configuration details
