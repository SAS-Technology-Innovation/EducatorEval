# EducatorEval Project Structure

This document outlines the clean, organized structure of the EducatorEval project.

## Root Structure
```
EducatorEval/
├── .astro/                    # Astro build artifacts
├── .git/                      # Git repository data
├── dist/                      # Build output
├── functions/                 # Firebase Cloud Functions (Go)
├── node_modules/             # Dependencies
├── src/                      # Source code (main directory)
├── tests/                    # Analytics verification tests
├── astro.config.mjs          # Astro configuration
├── firebase.json             # Firebase configuration
├── firestore.rules           # Firestore security rules
├── package.json              # NPM dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Source Directory Structure
```
src/
├── api/                      # API layer and data fetching
│   ├── dashboardApi.ts       # Dashboard data API
│   ├── dataApi.ts           # General data API
│   └── enhancedApi.ts       # Enhanced API with full CRUD
├── components/              # React components (organized by purpose)
│   ├── admin/               # Admin dashboard components
│   │   ├── Dashboard.tsx    # Main admin dashboard (formerly EnhancedAdminDashboard)
│   │   ├── AdminDashboard.tsx # Secondary admin dashboard
│   │   ├── DashboardTest.tsx # Admin dashboard tests
│   │   └── index.ts         # Admin exports
│   ├── applets/             # Applet components
│   │   └── CRPObservationsApplet.tsx # CRP observations applet
│   ├── common/              # Reusable UI components
│   │   ├── Button.tsx       # Standardized button component
│   │   ├── Dropdown.tsx     # Dropdown/select component
│   │   ├── InputField.tsx   # Form input component
│   │   ├── Modal.tsx        # Modal/dialog component
│   │   └── index.ts         # Common component exports
│   ├── features/            # Feature-specific components
│   │   ├── dashboard/       # Dashboard feature components
│   │   │   ├── Dashboard.tsx # Main dashboard
│   │   │   ├── RoleBasedDashboard.tsx # Role-based dashboard
│   │   │   ├── SimpleDashboard.tsx # Simplified dashboard
│   │   │   └── index.ts     # Dashboard exports
│   │   └── observations/    # Observation feature components
│   │       ├── MobileObservationForm.tsx # Mobile observation form
│   │       ├── ObservationsPage.tsx # Main observations page
│   │       └── SimpleObservationsPage.tsx # Simplified observations
│   ├── navigation/          # Navigation components
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── Sidebar.tsx      # Side navigation panel
│   │   └── index.ts         # Navigation exports
│   └── FrameworkConfigurator.tsx # Framework configuration component
├── constants/               # Application constants
│   └── index.ts            # Routes, roles, permissions, etc.
├── context/                # React context providers
│   └── AdminContext.tsx    # Admin state management
├── firebase/               # Firebase configuration and utilities
│   ├── config.ts          # Firebase app configuration
│   └── firestore.ts       # Firestore database utilities
├── hooks/                  # Custom React hooks
│   ├── useAnalytics.ts    # Analytics hook
│   ├── useAuth.ts         # Authentication hook
│   ├── useFrameworks.ts   # Framework management hook
│   └── useObservations.ts # Observations hook
├── layouts/               # Astro layout components
│   └── Layout.astro       # Base page layout
├── lib/                   # Library utilities
│   ├── api.ts            # API utilities
│   ├── firebase.ts       # Firebase utilities
│   └── queries.ts        # Query utilities
├── pages/                 # Astro pages (routes)
│   ├── applets/          # Applet pages
│   │   └── crp-observations.astro # CRP observations applet page
│   ├── admin.astro       # Admin dashboard page
│   ├── dashboard.astro   # Main dashboard page
│   ├── index.astro       # Home page
│   ├── observations.astro # Observations page
│   ├── seed.astro        # Data seeding page
│   ├── _AdminDashboard.tsx # Admin dashboard wrapper
│   └── _DashboardWrapper.tsx # Dashboard wrapper
├── services/             # Business logic and data services
│   ├── dataManagement.ts # Data management utilities
│   └── seedData.ts       # Data seeding utilities
├── stores/               # State management
│   └── authStore.ts      # Authentication store
├── styles/               # Global styles
│   └── global.css        # Global CSS styles
├── tests/                # Test components and pages
│   ├── components/       # Component tests
│   │   ├── DataDebugTest.tsx # Data debugging component
│   │   ├── DataModelsTest.tsx # Data models testing
│   │   └── InteractivityTest.tsx # Interactivity testing
│   ├── pages/           # Test pages
│   │   ├── debug-data.astro # Data debugging page
│   │   ├── test-admin.astro # Admin testing page
│   │   ├── test-interactions.astro # Interaction testing
│   │   ├── test-priority1.astro # Priority 1 tests
│   │   └── test-priority2.astro # Priority 2 tests
│   └── utils/           # Test utilities (empty)
├── types/               # TypeScript type definitions
│   ├── applets.ts       # Applet types
│   ├── core.ts          # Core application types
│   ├── crp-observation.ts # CRP observation types
│   ├── crp-observation-new.ts # Updated CRP types
│   ├── index.ts         # Type exports
│   └── observation.ts   # General observation types
└── utils/               # Utility functions
    ├── dateUtils.ts     # Date manipulation utilities
    ├── index.ts         # Utility exports
    ├── stringUtils.ts   # String manipulation utilities
    └── validation.ts    # Form and data validation
```

## Design Principles

### 1. Feature-Based Organization
- Components are organized by feature (dashboard, observations, admin)
- Related functionality is grouped together
- Clear separation between features

### 2. Common Components
- Reusable UI components in `components/common/`
- Standardized design system
- Consistent props interfaces

### 3. Test Isolation
- All test-related files in dedicated `tests/` directory
- Test components and pages clearly separated from production code
- Easy to exclude from production builds

### 4. Type Safety
- Comprehensive TypeScript types in dedicated `types/` directory
- Well-defined interfaces for all data structures
- Strong typing throughout the application

### 5. Utility Organization
- Common utilities in `utils/` directory
- Specific utilities (date, string, validation) in separate files
- Easy to import and reuse

### 6. Clean API Layer
- All API calls centralized in `api/` directory
- Clear separation between different API concerns
- Enhanced API with full CRUD operations

This structure follows modern React/Astro best practices and provides:
- Easy navigation and file discovery
- Clear separation of concerns
- Scalable architecture
- Maintainable codebase
- Type safety throughout
