# Staging Environment Setup Guide

## Overview

This guide sets up separate Firebase projects for **staging** (testing) and **production** environments, allowing you to test database changes, new features, and deployments before going live.

## Architecture

```
Development Flow:
Local Development → Staging → Production

Environments:
1. Local (Emulators) - Development on localhost
2. Staging (Firebase) - Testing before prod
3. Production (Firebase) - Live application
```

---

## Step 1: Create Staging Firebase Project

### 1.1 Create New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Project name: `educatoreval-staging` (or similar)
4. Enable Google Analytics (optional for staging)
5. Click "Create project"

### 1.2 Add Web App to Staging Project

1. In Firebase Console, click "Add app" → Web (</> icon)
2. App nickname: `EducatorEval Staging`
3. Setup Firebase Hosting: YES
4. Click "Register app"
5. **Copy the Firebase config** - you'll need this

### 1.3 Enable Required Services in Staging

Enable the same services as production:

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Add authorized domains: `localhost`, `educatoreval-staging.web.app`

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **production mode**
   - Choose location: `us-central` (or your preferred region)

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in **production mode**
   - Use default bucket

4. **Hosting**:
   - Already enabled when you added the web app

---

## Step 2: Configure Firebase CLI for Multiple Projects

### 2.1 Add Staging Project to Firebase CLI

```bash
# Login to Firebase (if not already)
firebase login

# Add staging project alias
firebase use --add

# Select your staging project from the list
# When prompted for alias, enter: staging

# Add production project alias
firebase use --add

# Select your production project from the list
# When prompted for alias, enter: production

# List all project aliases
firebase projects:list

# Switch between projects
firebase use staging   # Switch to staging
firebase use production # Switch to production
```

### 2.2 Verify Project Configuration

Your `.firebaserc` file should now look like:

```json
{
  "projects": {
    "staging": "educatoreval-staging",
    "production": "educatoreval-prod"
  }
}
```

---

## Step 3: Environment Variables Setup

### 3.1 Create Environment Files

Create separate environment files for each environment:

**`.env.local`** (for local development with emulators):
```env
# Local Development (Emulators)
VITE_FIREBASE_API_KEY=fake-api-key-for-emulators
VITE_FIREBASE_AUTH_DOMAIN=localhost
VITE_FIREBASE_PROJECT_ID=demo-project
VITE_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Use Emulators
VITE_USE_FIREBASE_EMULATORS=true

# Use Mock Auth (optional - for faster development)
VITE_USE_MOCK_AUTH=true
```

**`.env.staging`** (for staging deployment):
```env
# Staging Environment
VITE_FIREBASE_API_KEY=your-staging-api-key
VITE_FIREBASE_AUTH_DOMAIN=educatoreval-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=educatoreval-staging
VITE_FIREBASE_STORAGE_BUCKET=educatoreval-staging.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-staging-sender-id
VITE_FIREBASE_APP_ID=your-staging-app-id

# Use Real Firebase (not emulators)
VITE_USE_FIREBASE_EMULATORS=false

# Use Real Auth (not mock)
VITE_USE_MOCK_AUTH=false

# Environment identifier
VITE_ENVIRONMENT=staging
```

**`.env.production`** (for production deployment):
```env
# Production Environment
VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=educatoreval-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=educatoreval-prod
VITE_FIREBASE_STORAGE_BUCKET=educatoreval-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-production-sender-id
VITE_FIREBASE_APP_ID=your-production-app-id

# Use Real Firebase (not emulators)
VITE_USE_FIREBASE_EMULATORS=false

# Use Real Auth (not mock)
VITE_USE_MOCK_AUTH=false

# Environment identifier
VITE_ENVIRONMENT=production
```

### 3.2 Update `.gitignore`

Ensure environment files are properly ignored:

```gitignore
# Environment files
.env
.env.local
.env.staging
.env.production
.env.*.local

# Firebase
.firebase/
.firebaserc

# Keep example
!.env.example
```

### 3.3 Create `.env.example`

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Development Settings
VITE_USE_FIREBASE_EMULATORS=false
VITE_USE_MOCK_AUTH=false

# Environment
VITE_ENVIRONMENT=development
```

---

## Step 4: Update `package.json` Scripts

Add scripts for building and deploying to different environments:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:emulated": "VITE_USE_FIREBASE_EMULATORS=true vite",

    "build": "tsc && vite build",
    "build:staging": "cp .env.staging .env && npm run build",
    "build:production": "cp .env.production .env && npm run build",
    "build:check": "tsc && vite build",

    "preview": "vite preview",

    "test": "vitest",

    "emulators": "firebase emulators:start",
    "emulators:export": "firebase emulators:export ./firebase-data",
    "emulators:import": "firebase emulators:start --import=./firebase-data",

    "deploy:staging": "npm run build:staging && firebase use staging && firebase deploy",
    "deploy:staging:hosting": "npm run build:staging && firebase use staging && firebase deploy --only hosting",
    "deploy:staging:rules": "firebase use staging && firebase deploy --only firestore:rules,storage:rules",

    "deploy:production": "npm run build:production && firebase use production && firebase deploy",
    "deploy:production:hosting": "npm run build:production && firebase use production && firebase deploy --only hosting",
    "deploy:production:rules": "firebase use production && firebase deploy --only firestore:rules,storage:rules",

    "seed:staging": "firebase use staging && ts-node scripts/seedDatabase.ts",
    "seed:production": "firebase use production && ts-node scripts/seedDatabase.ts"
  }
}
```

---

## Step 5: Update Firebase Configuration

### 5.1 Update `firebase.json`

Add hosting configuration for multiple sites:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

---

## Step 6: Create Seed Script for Staging

Create `scripts/seedStaging.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Staging Firebase config (load from .env.staging)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedStaging() {
  console.log('🌱 Seeding STAGING database...');
  console.log(`Project: ${firebaseConfig.projectId}`);

  // 1. Create test admin user
  console.log('\n📧 Creating test admin user...');
  let adminUid = '';
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@staging.test',
      'TestPassword123!'
    );
    adminUid = userCredential.user.uid;
    console.log(`✅ Admin user created: ${adminUid}`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  Admin user already exists');
      // You'll need to manually get the UID from Firebase Console
      adminUid = 'EXISTING_ADMIN_UID'; // Replace with actual UID
    } else {
      console.error('❌ Failed to create admin user:', error);
      throw error;
    }
  }

  // 2. Create organization
  console.log('\n🏢 Creating organization...');
  const orgRef = await addDoc(collection(db, 'organizations'), {
    name: 'Test School (Staging)',
    type: 'school',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country'
    },
    contactInfo: {
      phone: '+1-555-0100',
      email: 'info@staging.test',
      website: 'https://staging.test'
    },
    settings: {},
    timezone: 'America/Los_Angeles',
    academicYear: {
      startDate: Timestamp.fromDate(new Date('2024-08-15')),
      endDate: Timestamp.fromDate(new Date('2025-06-15')),
      year: '2024-2025',
      terms: [
        {
          id: 'semester-1',
          name: 'Semester 1',
          startDate: Timestamp.fromDate(new Date('2024-08-15')),
          endDate: Timestamp.fromDate(new Date('2024-12-20')),
          type: 'semester'
        },
        {
          id: 'semester-2',
          name: 'Semester 2',
          startDate: Timestamp.fromDate(new Date('2025-01-06')),
          endDate: Timestamp.fromDate(new Date('2025-06-15')),
          type: 'semester'
        }
      ]
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  console.log(`✅ Organization created: ${orgRef.id}`);

  // 3. Create school
  console.log('\n🏫 Creating school...');
  const schoolRef = await addDoc(collection(db, 'schools'), {
    organizationId: orgRef.id,
    name: 'Test School (Staging)',
    shortName: 'TS',
    type: 'k12',
    grades: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345'
    },
    contactInfo: {
      phone: '+1-555-0100',
      email: 'info@staging.test'
    },
    principalId: adminUid,
    assistantPrincipalIds: [],
    settings: {},
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  console.log(`✅ School created: ${schoolRef.id}`);

  // 4. Create divisions
  console.log('\n📚 Creating divisions...');
  const divisions = [
    { name: 'High School', type: 'high', grades: ['9', '10', '11', '12'] }
  ];

  let divisionId = '';
  for (const div of divisions) {
    const divRef = await addDoc(collection(db, 'divisions'), {
      schoolId: schoolRef.id,
      name: div.name,
      type: div.type,
      description: `${div.name} serving grades ${div.grades.join(', ')}`,
      directorId: adminUid,
      assistantDirectorIds: [],
      departments: [],
      grades: div.grades,
      settings: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    divisionId = divRef.id;
    console.log(`✅ Division created: ${div.name} (${divRef.id})`);
  }

  // 5. Create departments
  console.log('\n🎓 Creating departments...');
  const departments = [
    { name: 'Mathematics', subjects: ['Algebra I', 'Geometry', 'Algebra II'] },
    { name: 'English', subjects: ['English 9', 'English 10', 'English 11'] },
  ];

  let mathDeptId = '';
  for (const dept of departments) {
    const deptRef = await addDoc(collection(db, 'departments'), {
      schoolId: schoolRef.id,
      name: dept.name,
      description: `${dept.name} department`,
      headId: adminUid,
      members: [adminUid],
      subjects: dept.subjects,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    if (dept.name === 'Mathematics') mathDeptId = deptRef.id;
    console.log(`✅ Department created: ${dept.name} (${deptRef.id})`);
  }

  // 6. Create admin user document
  console.log('\n👤 Creating admin user document...');
  await addDoc(collection(db, 'users').doc(adminUid), {
    id: adminUid,
    email: 'admin@staging.test',
    firstName: 'Test',
    lastName: 'Admin',
    displayName: 'Test Admin',
    employeeId: 'ADMIN001',
    schoolId: schoolRef.id,
    divisionId: divisionId,
    primaryDepartmentId: mathDeptId,
    departmentIds: [mathDeptId],
    primaryRole: 'super_admin',
    secondaryRoles: [],
    permissions: [],
    jobTitle: 'superintendent',
    certifications: [],
    experience: 'Testing',
    primarySubject: 'Mathematics',
    subjects: ['Mathematics'],
    grades: [],
    specializations: [],
    planningPeriods: [],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {}
  });
  console.log(`✅ Admin user document created`);

  // 7. Create test framework
  console.log('\n📋 Creating test framework...');
  const frameworkRef = await addDoc(collection(db, 'frameworks'), {
    name: 'Test CRP Framework',
    description: 'Test framework for staging environment',
    type: 'observation',
    version: '1.0',
    status: 'active',
    schoolId: schoolRef.id,
    createdBy: adminUid,
    applicableDivisions: ['high'],
    sections: [
      {
        id: 'section-test-1',
        title: 'Test Section',
        description: 'Test section for staging',
        order: 1,
        questions: [
          {
            id: 'q-test-1',
            sectionId: 'section-test-1',
            text: 'Test question for staging environment',
            description: 'This is a test question',
            helpText: 'Look for test indicators',
            examples: ['Test example 1', 'Test example 2'],
            type: 'rating',
            isRequired: true,
            weight: 1,
            order: 1,
            scale: {
              id: 'default-4-point',
              name: '4-Point Scale',
              type: 'numeric',
              min: 1,
              max: 4,
              labels: [
                { value: 4, label: 'Excellent', description: 'Excellent performance', color: 'green' },
                { value: 3, label: 'Good', description: 'Good performance', color: 'blue' },
                { value: 2, label: 'Fair', description: 'Fair performance', color: 'yellow' },
                { value: 1, label: 'Needs Improvement', description: 'Needs improvement', color: 'red' }
              ],
              includeNotObserved: true,
              notObservedLabel: 'Not Observed'
            },
            frameworkAlignments: [],
            tags: ['test'],
            categories: ['test'],
            difficulty: 'medium',
            evidenceRequired: false,
            evidenceTypes: [],
            minEvidenceCount: 0
          }
        ],
        isRequired: true,
        weight: 1,
        color: 'blue'
      }
    ],
    totalQuestions: 1,
    requiredQuestions: 1,
    estimatedDuration: 30,
    alignments: [],
    tags: ['test', 'staging'],
    categories: ['test'],
    usageCount: 0,
    averageCompletionTime: 0,
    averageEvidenceScore: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {}
  });
  console.log(`✅ Framework created: ${frameworkRef.id}`);

  console.log('\n✅ STAGING database seeding complete!');
  console.log('\n📝 Summary:');
  console.log(`- Organization: ${orgRef.id}`);
  console.log(`- School: ${schoolRef.id}`);
  console.log(`- Admin User: admin@staging.test / TestPassword123!`);
  console.log(`- Framework: ${frameworkRef.id}`);
  console.log('\n🚀 Next steps:');
  console.log('1. Deploy to staging: npm run deploy:staging');
  console.log('2. Visit: https://educatoreval-staging.web.app');
  console.log('3. Login with: admin@staging.test / TestPassword123!');
}

// Run seed
seedStaging().catch(console.error).finally(() => process.exit(0));
```

---

## Step 7: Testing Workflow

### 7.1 Build and Test Locally

```bash
# 1. Test build
npm run build:check

# Expected output: ✓ build complete

# 2. Run dev server locally
npm run dev

# Expected: Server running on http://localhost:5173
```

### 7.2 Deploy to Staging

```bash
# 1. Switch to staging
firebase use staging

# 2. Deploy Firestore rules and indexes first
firebase deploy --only firestore:rules,firestore:indexes

# 3. Seed staging database
npm run seed:staging

# 4. Build and deploy hosting
npm run deploy:staging:hosting

# Expected output:
# ✓ Deploy complete!
# Hosting URL: https://educatoreval-staging.web.app
```

### 7.3 Test Staging Environment

1. **Visit staging URL**: `https://educatoreval-staging.web.app`
2. **Login**: `admin@staging.test` / `TestPassword123!`
3. **Test key features**:
   - ✅ Login works
   - ✅ Dashboard loads
   - ✅ Navigate to Admin → Frameworks
   - ✅ View test framework
   - ✅ Create new framework
   - ✅ Add section
   - ✅ Add question
   - ✅ Navigate to Observations
   - ✅ Create test observation
   - ✅ Submit observation
   - ✅ View analytics

### 7.4 Check for Issues

```bash
# Check Firebase logs
firebase hosting:logs --only hosting

# Check Firestore usage
firebase firestore:usage

# Monitor real-time
# Visit Firebase Console → Hosting → Dashboard
```

---

## Step 8: Deploy to Production (After Staging Tests Pass)

```bash
# 1. Switch to production
firebase use production

# 2. Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# 3. Seed production database (ONE TIME ONLY)
npm run seed:production

# 4. Build and deploy hosting
npm run deploy:production:hosting

# Expected output:
# ✓ Deploy complete!
# Hosting URL: https://educatoreval-prod.web.app
```

---

## Step 9: Environment Indicator in UI

Add environment indicator to help distinguish staging from production:

Create `app/components/common/EnvironmentBanner.tsx`:

```typescript
import React from 'react';

export default function EnvironmentBanner() {
  const environment = import.meta.env.VITE_ENVIRONMENT;

  if (environment === 'production') {
    return null; // Don't show banner in production
  }

  const colors = {
    staging: 'bg-yellow-500',
    development: 'bg-blue-500',
  };

  const bgColor = colors[environment as keyof typeof colors] || 'bg-gray-500';

  return (
    <div className={`${bgColor} text-white text-center py-1 text-sm font-medium`}>
      🧪 {environment.toUpperCase()} ENVIRONMENT - Test data only
    </div>
  );
}
```

Add to `App.tsx`:

```typescript
import EnvironmentBanner from './app/components/common/EnvironmentBanner';

function App() {
  return (
    <AppProviders requireAuth={false}>
      <EnvironmentBanner />
      <Routes>
        {/* ... routes */}
      </Routes>
    </AppProviders>
  );
}
```

---

## Troubleshooting

### Issue: Build fails with environment variables
**Solution**: Ensure `.env.staging` or `.env.production` exists and is copied to `.env` before build

### Issue: Wrong Firebase project
**Solution**: Check `firebase use` output, switch with `firebase use staging` or `firebase use production`

### Issue: Permission denied in Firestore
**Solution**: Ensure security rules are deployed: `firebase deploy --only firestore:rules`

### Issue: Can't login to staging
**Solution**: Check Firebase Console → Authentication → Authorized domains includes your staging URL

---

## Summary

You now have:

✅ **Staging environment** for safe testing
✅ **Production environment** for live app
✅ **Separate databases** to avoid data corruption
✅ **Environment-specific configs** (.env files)
✅ **Deploy scripts** for each environment
✅ **Seed scripts** for test data
✅ **Visual indicators** to distinguish environments

**Workflow:**
1. Develop locally with emulators or mock data
2. Deploy to **staging** for testing
3. Test thoroughly in staging
4. Deploy to **production** when confident

**Safety:** Changes to staging never affect production!
