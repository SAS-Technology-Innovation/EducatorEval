# EducatorEval

A comprehensive educational evaluation platform built with Vite, React 19, TypeScript, and Firebase.

## 🚀 Project Overview

EducatorEval is a modern web application designed for educational institutions to manage observations, evaluations, and educator development. The platform provides role-based access control, comprehensive dashboard functionality, and flexible observation scheduling.

## 📁 Project Structure

```text
EducatorEval/
├── docs/                          # Documentation
├── public/                       # Static assets
├── src/
│   ├── components/               # React components
│   │   ├── admin/               # Admin-specific components
│   │   ├── common/              # Reusable UI components
│   │   ├── features/            # Feature-specific components
│   │   └── navigation/          # Navigation components
│   ├── lib/                     # Firebase and API services
│   ├── pages/                   # Astro pages
│   ├── stores/                  # Zustand state management
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
└── tests/                       # Analytics verification tests
```

## 🛠️ Technology Stack

- **Frontend**: Vite, React 19, TypeScript
- **Styling**: Tailwind CSS
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

3. Set up Firebase configuration

```bash
# Follow the setup guide in docs/
```

4. Start the development server

```bash
npm run dev
```

## 📚 Documentation

Comprehensive documentation is available:

### Quick Start Guides
- [STAGING_SETUP.md](STAGING_SETUP.md) - Quick reference for staging environment setup
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Complete deployment checklist
- [CLAUDE.md](CLAUDE.md) - Development guide for working with this codebase

### Detailed Documentation (`docs/` directory)
- [Framework-Driven Architecture](docs/FRAMEWORK_DRIVEN_ARCHITECTURE.md) - Core architecture overview
- [Firestore Database Schema](docs/FIRESTORE_DATABASE_SCHEMA.md) - Complete database schema
- [Database Setup Guide](docs/DATABASE_SETUP_GUIDE.md) - Step-by-step database setup
- [Staging Environment Setup](docs/STAGING_ENVIRONMENT_SETUP.md) - Detailed staging environment guide
- [User Fields and Analytics](docs/USER_FIELDS_AND_ANALYTICS.md) - Multi-department/subject support

## 🔧 Development

The project follows modern development practices:

- **Framework-Driven Architecture**: All forms, observations, and analytics driven by framework definitions
- **Component Architecture**: Feature-based organization with reusable common components
- **Type Safety**: Comprehensive TypeScript coverage
- **State Management**: Zustand for auth, React Query for data fetching
- **Clean Architecture**: Clear separation between UI, business logic, and data layers
- **Multi-Environment Support**: Development, staging, and production environments

### Development Commands

```bash
# Local development (mock auth)
npm run dev

# Build and type check
npm run build:check

# Preview production build
npm run preview

# Run tests
npm run test
```

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
