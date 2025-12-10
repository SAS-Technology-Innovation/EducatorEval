# EducatorEval

A comprehensive educational evaluation platform built with Vite, React 19, TypeScript, and Firebase.

## 🚀 Project Overview

EducatorEval is a modern web application designed for educational institutions to manage observations, evaluations, and educator development. The platform provides:

- **Framework-driven classroom observations** (CRP, CASEL, Tripod, custom frameworks)
- **Role-based access control** for teachers, observers, managers, and administrators
- **Dynamic analytics and insights** that adapt to any observation framework
- **Professional learning goals** and development tracking
- **Educator schedules** with class assignments

## 📁 Project Structure

```text
EducatorEval/
├── App.tsx                      # Main routing & authentication
├── main.tsx                     # React initialization
├── index.html                   # HTML entry point
├── app/                         # ALL application code
│   ├── admin/                   # Admin page wrappers
│   ├── app/                     # App-level pages (Dashboard, Profile, etc.)
│   ├── api/                     # API layer (core, observations, alignments)
│   ├── components/              # React components
│   │   ├── admin/              # Admin components (Users, Orgs, Frameworks)
│   │   ├── common/             # Reusable UI (DataTable, Modal, etc.)
│   │   ├── dashboard/          # Role-based dashboards
│   │   ├── features/           # Feature components (observations, schedule, goals)
│   │   ├── layout/             # Layout components (Sidebar, Header)
│   │   ├── providers/          # Context providers (Auth, Query)
│   │   └── user/               # User profile & settings
│   ├── hooks/                   # React Query hooks
│   ├── lib/                     # Firebase & Firestore services
│   ├── stores/                  # Zustand state management
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Helper functions
├── docs/                        # Technical documentation
└── public/                      # Static assets
```

## 🛠️ Technology Stack

- **Frontend**: Vite, React 19, TypeScript
- **Styling**: Tailwind CSS with SAS brand colors
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Architecture**: Pure React SPA (Single Page Application)

## 🏗️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Firebase CLI

### Installation

1. Clone the repository

```bash
git clone https://github.com/SAS-Technology-Innovation/EducatorEval.git
cd EducatorEval
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

4. Start the development server

```bash
npm run dev
```

## 📚 Documentation

Comprehensive documentation is available:

### Quick Start Guides

- [CLAUDE.md](CLAUDE.md) - Development guide for working with this codebase
- [STAGING_SETUP.md](STAGING_SETUP.md) - Quick reference for staging environment setup
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Complete deployment checklist

### Detailed Documentation (`docs/` directory)
- [Framework-Driven Architecture](docs/FRAMEWORK_DRIVEN_ARCHITECTURE.md) - Core architecture overview
- [Firestore Database Schema](docs/FIRESTORE_DATABASE_SCHEMA.md) - Complete database schema
- [Database Setup Guide](docs/DATABASE_SETUP_GUIDE.md) - Step-by-step database setup
- [Roles and Permissions](docs/ROLES_AND_PERMISSIONS.md) - Role hierarchy reference
- [User Fields and Analytics](docs/USER_FIELDS_AND_ANALYTICS.md) - Multi-department/subject support

## 🔧 Development

The project follows modern development practices:

- **Framework-Driven Architecture**: All forms, observations, and analytics driven by framework definitions stored in Firestore
- **Role-Based Views**: Different dashboards for Teacher, Observer, Manager, Staff, and Admin roles
- **Real Data Integration**: All UI components connected to Firestore (no hardcoded data)
- **Type Safety**: Comprehensive TypeScript coverage
- **State Management**: Zustand for auth, React Query for data fetching
- **Clean Architecture**: Clear separation between UI, business logic, and data layers

### Development Commands

```bash
# Local development (mock auth)
npm run dev

# Development with Firebase emulators
npm run dev:emulated

# Build and type check
npm run build:check

# Preview production build
npm run preview

# Run tests
npm run test
```

### Key Features

| Feature | Description |
|---------|-------------|
| Observations | Framework-driven observation forms with real-time saving |
| Dashboards | Role-specific dashboards with real Firestore data |
| Schedules | Educator schedule management with class assignments |
| Goals | Professional learning goals with SMART goal tracking |
| Organizations | Full CRUD for schools and districts |
| User Management | Admin user management with role assignment |

## 🚀 Deployment

The application uses a multi-environment deployment strategy:

### Environments
- **Local**: Development with mock authentication (`npm run dev`)
- **Staging**: Pre-production testing environment (`npm run deploy:staging`)
- **Production**: Live application (`npm run deploy:production`)

### Deployment Workflow
1. Test locally: `npm run build:check`
2. Deploy to staging: `npm run deploy:staging`
3. Test in staging environment
4. Deploy to production: `npm run deploy:production`

See [STAGING_SETUP.md](STAGING_SETUP.md) and [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete deployment instructions.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📞 Support

For questions, issues, or support requests, please contact the SAS Technology Innovation team.
