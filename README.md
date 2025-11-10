# EducatorEval

A comprehensive educational evaluation platform built with Astro, React, TypeScript, and Firebase.

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

- **Frontend**: Astro 5.13.3, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth)
- **State Management**: Zustand
- **Build Tool**: Vite

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

Comprehensive documentation is available in the `docs/` directory:

- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed project organization
- [Implementation Instructions](docs/IMPLEMENTATION_INSTRUCTIONS.md) - Setup and deployment guide
- [Firebase Setup](docs/FIREBASE_REVIEW_COMPLETE.md) - Firebase configuration
- [Development Server](docs/DEV_SERVER_OVERVIEW.md) - Development environment setup
- [Testing Guide](docs/FUNCTIONALITY_TEST.md) - Testing procedures

## 🔧 Development

The project follows modern development practices:

- **Component Architecture**: Feature-based organization with reusable common components
- **Type Safety**: Comprehensive TypeScript coverage
- **State Management**: Centralized with Zustand
- **Clean Architecture**: Clear separation between UI, business logic, and data layers
- **Testing**: Isolated test environment with dedicated test components

## 🚀 Deployment

The application is configured for Firebase Hosting with automatic builds and deployments.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📞 Support

For questions, issues, or support requests, please contact the SAS Technology Innovation team.
