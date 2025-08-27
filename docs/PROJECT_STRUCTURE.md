# EducatorEval Project Structure

## 📁 Root Directory Structure

```text
EducatorEval/
├── docs/                          # 📚 Documentation hub
│   ├── README.md                 # Documentation index
│   ├── PROJECT_STRUCTURE.md      # This file - project organization
│   ├── IMPLEMENTATION_INSTRUCTIONS.md  # Setup and deployment guide  
│   ├── FIREBASE_REVIEW_COMPLETE.md     # Firebase configuration
│   ├── DEV_SERVER_OVERVIEW.md          # Development environment
│   ├── IMG_2631.jpg              # Project structure reference image
│   └── ...                       # Additional documentation files
├── functions/                     # ☁️ Firebase Cloud Functions (Go)
│   ├── core/                     # Core backend services
│   │   ├── applets/              # Applet management functions
│   │   ├── organizations/        # Organization management functions
│   │   └── users/                # User management functions
│   ├── shared/                   # Shared backend utilities
│   │   ├── middleware/           # Authentication and validation
│   │   ├── models/              # Data models
│   │   └── services/            # Common services
│   ├── go.mod                   # Go module dependencies
│   └── go.sum                   # Go dependency checksums
├── public/                       # 🌐 Static assets
│   ├── favicon.svg              # Site favicon
│   └── manifest.json            # Web app manifest
├── src/                          # 💻 Application source code
│   ├── api/                     # API layer and data fetching
│   │   └── enhancedApi.ts       # Enhanced API with full CRUD operations
│   ├── components/              # React components (organized by purpose)
│   │   ├── admin/               # Admin-specific components
│   │   │   ├── AdminDashboard.tsx  # Main admin dashboard
│   │   │   ├── Dashboard.tsx       # Enhanced admin dashboard
│   │   │   ├── DashboardTest.tsx   # Admin dashboard testing
│   │   │   └── index.ts           # Admin component exports
│   │   ├── applets/             # Educational applets
│   │   │   └── CRPObservationsApplet.tsx  # CRP observation tool
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Button.tsx       # Button component
│   │   │   ├── Dropdown.tsx     # Dropdown component
│   │   │   ├── InputField.tsx   # Input field component
│   │   │   ├── Modal.tsx        # Modal component
│   │   │   └── index.ts         # Common component exports
│   │   ├── features/            # Feature-specific components
│   │   │   ├── dashboard/       # Dashboard functionality
│   │   │   │   ├── Dashboard.tsx           # Basic dashboard
│   │   │   │   ├── RoleBasedDashboard.tsx  # Role-aware dashboard
│   │   │   │   ├── SimpleDashboard.tsx     # Simplified dashboard
│   │   │   │   └── index.ts               # Dashboard exports
│   │   │   └── observations/    # Observation functionality
│   │   │       ├── MobileObservationForm.tsx   # Mobile-optimized form
│   │   │       ├── ObservationsPage.tsx        # Main observations page
│   │   │       └── SimpleObservationsPage.tsx  # Simplified observations
│   │   └── navigation/          # Navigation components
│   │       ├── Navbar.tsx       # Navigation bar
│   │       ├── Sidebar.tsx      # Sidebar navigation
│   │       └── index.ts         # Navigation exports
│   ├── constants/               # Application constants
│   │   └── index.ts            # Route definitions, roles, permissions
│   ├── firebase/               # Firebase configuration and services
│   │   ├── auth.ts             # Firebase authentication
│   │   ├── config.ts           # Firebase project configuration
│   │   ├── firestore.ts        # Firestore database service
│   │   └── functions.ts        # Cloud functions client
│   ├── hooks/                  # Custom React hooks
│   │   ├── index.ts            # Hook exports
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useFrameworks.ts    # Framework data hook
│   │   ├── useObservations.ts  # Observations data hook
│   │   └── useTeachers.ts      # Teacher data hook
│   ├── layouts/                # Astro layout components
│   │   └── Layout.astro        # Base page layout
│   ├── lib/                    # Core libraries and services
│   │   ├── api.ts              # Firebase API service layer
│   │   ├── firebase.ts         # Firebase client configuration
│   │   └── queries.ts          # React Query configurations
│   ├── pages/                  # Astro pages (routing)
│   │   ├── applets/            # Applet pages
│   │   │   └── crp-observations.astro  # CRP observations applet page
│   │   ├── admin.astro         # Admin dashboard page
│   │   ├── dashboard.astro     # Main dashboard page
│   │   ├── data.astro          # Data management page
│   │   ├── framework.astro     # Framework configuration page
│   │   ├── index.astro         # Home page
│   │   ├── observations.astro  # Observations page
│   │   ├── observe.astro       # Observation tool page
│   │   ├── profile.astro       # User profile page
│   │   ├── schedule.astro      # Scheduling page
│   │   ├── seed.astro          # Data seeding page
│   │   └── test-firestore.astro # Firestore testing page
│   ├── services/               # Business logic services
│   │   ├── frameworkService.ts # Framework management service
│   │   ├── mockData.ts         # Mock data definitions (empty)
│   │   ├── seedData.ts         # Data seeding utilities
│   │   └── seedObservations.ts # Observation seeding utilities
│   ├── stores/                 # Zustand state management
│   │   └── authStore.ts        # Authentication state store
│   ├── styles/                 # Global styling
│   │   └── global.css          # Global CSS styles
│   ├── tests/                  # Test components and pages
│   │   ├── components/         # Test-specific components
│   │   │   ├── DataDebugTest.tsx      # Data debugging component
│   │   │   ├── DataModelsTest.tsx     # Data model testing component
│   │   │   └── InteractivityTest.tsx  # Interactivity testing component
│   │   └── pages/              # Test pages
│   │       ├── debug-data.astro       # Data debugging page
│   │       ├── test-admin.astro       # Admin functionality testing
│   │       ├── test-interactions.astro # Interaction testing
│   │       ├── test-priority1.astro   # Priority 1 feature testing
│   │       └── test-priority2.astro   # Priority 2 feature testing
│   ├── types/                  # TypeScript type definitions
│   │   ├── applets.ts          # Applet type definitions
│   │   ├── core.ts             # Core system types
│   │   ├── crp-observation.ts  # CRP observation types
│   │   ├── index.ts            # Main type exports
│   │   └── observation.ts      # General observation types
│   └── utils/                  # Utility functions
│       ├── dateUtils.ts        # Date manipulation utilities
│       ├── index.ts            # Utility exports
│       ├── stringUtils.ts      # String manipulation utilities
│       └── validation.ts       # Validation helper functions
├── tests/                        # 🧪 Analytics verification
│   └── analytics-verification.ts # Analytics testing suite
├── dist/                         # 🏗️ Build output (auto-generated)
├── node_modules/                 # 📦 Dependencies (auto-generated)
├── .astro/                       # ⚙️ Astro build cache (auto-generated)
├── .git/                         # 🔄 Git version control
├── astro.config.mjs              # ⚙️ Astro framework configuration
├── firebase.json                 # 🔥 Firebase project configuration
├── firestore.rules              # 🔒 Firestore security rules
├── package.json                  # 📋 Project dependencies and scripts
├── tailwind.config.js           # 🎨 Tailwind CSS configuration
├── tsconfig.json                # 📘 TypeScript configuration
└── README.md                     # 📖 Project overview and getting started
```

## 🏗️ Architecture Overview

### Component Organization Strategy

The project follows a **feature-based organization pattern** with clear separation of concerns:

1. **`components/admin/`** - Administrative functionality components
2. **`components/common/`** - Reusable UI building blocks
3. **`components/features/`** - Domain-specific feature components
4. **`components/navigation/`** - Navigation and layout components

### Service Layer Architecture

- **`api/`** - Data fetching and API integration layer
- **`lib/`** - Core libraries and Firebase services
- **`services/`** - Business logic and data processing
- **`stores/`** - Application state management with Zustand

### Type System

- **`types/`** - Comprehensive TypeScript definitions for type safety
- **Domain-specific types** - Organized by feature area (observations, applets, core)
- **Shared interfaces** - Common types used across the application

## 🧪 Testing Strategy

### Test Organization
- **`src/tests/`** - Development and debugging components
- **`tests/`** - Production analytics verification
- **Test pages** - Dedicated Astro pages for testing specific functionality

### Quality Assurance
- **Component testing** - Individual component validation
- **Integration testing** - Feature-level functionality verification
- **Analytics verification** - Performance and usage tracking validation

## 📚 Documentation Structure

All documentation has been consolidated in the **`docs/`** directory:

- **Setup guides** - Installation and configuration
- **Architecture docs** - System design and structure
- **Implementation status** - Current development state
- **Testing guides** - Quality assurance procedures

## 🔧 Development Workflow

### File Organization Principles
1. **Feature-first** - Group related functionality together
2. **Separation of concerns** - Clear boundaries between UI, logic, and data
3. **Reusability** - Common components for consistent UI/UX
4. **Type safety** - Comprehensive TypeScript coverage
5. **Testing isolation** - Dedicated test environment separate from production

### Import/Export Strategy
- **Barrel exports** - Index files for clean imports
- **Explicit dependencies** - Clear import paths
- **Type-first development** - Types defined before implementation

This structure ensures maintainability, scalability, and developer productivity while following modern React/Astro best practices.
