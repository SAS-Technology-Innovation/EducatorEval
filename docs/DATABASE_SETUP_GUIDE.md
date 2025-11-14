# Firestore Database Setup Guide

## Quick Start

This guide will help you set up the Firestore database for EducatorEval.

## Prerequisites

- Firebase project created
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase Admin SDK credentials

## Step 1: Initialize Firestore

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose **Production mode** for security
4. Select your region (e.g., `us-central`)

## Step 2: Deploy Security Rules

The security rules are defined in `firestore.rules`. Deploy them:

```bash
firebase deploy --only firestore:rules
```

## Step 3: Create Composite Indexes

Firestore requires composite indexes for complex queries. Create indexes for:

### Users Collection
```bash
# Via Firebase Console or firestore.indexes.json

# Index 1: School + Role + Active
Field path: schoolId (Ascending), primaryRole (Ascending), isActive (Ascending)

# Index 2: Division + Role + Active
Field path: divisionId (Ascending), primaryRole (Ascending), isActive (Ascending)

# Index 3: Primary Department + Role + Active
Field path: primaryDepartmentId (Ascending), primaryRole (Ascending), isActive (Ascending)

# Index 4: Department Array Contains
Field path: departmentIds (Array-contains)

# Index 5: Subjects Array Contains
Field path: subjects (Array-contains)
```

### Observations Collection
```bash
# Index 1: School + Framework + Status + Date
Field path: schoolId (Ascending), frameworkId (Ascending), status (Ascending), context.date (Descending)

# Index 2: Subject + Status + Date
Field path: subjectId (Ascending), status (Ascending), context.date (Descending)

# Index 3: Observer + Status + Date
Field path: observerId (Ascending), status (Ascending), context.date (Descending)

# Index 4: Division + Department + Status
Field path: divisionId (Ascending), departmentId (Ascending), status (Ascending)
```

### Frameworks Collection
```bash
# Index 1: School + Status
Field path: schoolId (Ascending), status (Ascending)

# Index 2: Status + Usage
Field path: status (Ascending), usageCount (Descending)
```

## Step 4: Deploy Indexes

Create `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "schoolId", "order": "ASCENDING" },
        { "fieldPath": "primaryRole", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "divisionId", "order": "ASCENDING" },
        { "fieldPath": "primaryRole", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "primaryDepartmentId", "order": "ASCENDING" },
        { "fieldPath": "primaryRole", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "observations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "schoolId", "order": "ASCENDING" },
        { "fieldPath": "frameworkId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "context.date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "observations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "subjectId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "context.date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "observations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "observerId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "context.date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "observations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "divisionId", "order": "ASCENDING" },
        { "fieldPath": "departmentId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "frameworks",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "schoolId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "frameworks",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "usageCount", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "isRead", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "professionalLearning",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

## Step 5: Seed Initial Data

### Option A: Via Firebase Console

1. Go to Firestore Database
2. Manually create collections and documents

### Option B: Via Seed Script

Create `scripts/seedDatabase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  // Your config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  console.log('Starting database seed...');

  // 1. Create Organization
  const orgRef = await addDoc(collection(db, 'organizations'), {
    name: 'Singapore American School',
    type: 'school',
    address: {
      street: '40 Woodlands Street 41',
      city: 'Singapore',
      state: '',
      zipCode: '738547',
      country: 'Singapore'
    },
    contactInfo: {
      phone: '+65 6363 3403',
      email: 'admissions@sas.edu.sg',
      website: 'https://www.sas.edu.sg'
    },
    settings: {},
    timezone: 'Asia/Singapore',
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

  console.log('Created organization:', orgRef.id);

  // 2. Create School
  const schoolRef = await addDoc(collection(db, 'schools'), {
    organizationId: orgRef.id,
    name: 'Singapore American School',
    shortName: 'SAS',
    type: 'k12',
    grades: ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    address: {
      street: '40 Woodlands Street 41',
      city: 'Singapore',
      state: '',
      zipCode: '738547'
    },
    contactInfo: {
      phone: '+65 6363 3403',
      email: 'admissions@sas.edu.sg',
      website: 'https://www.sas.edu.sg'
    },
    principalId: '',
    assistantPrincipalIds: [],
    settings: {},
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  console.log('Created school:', schoolRef.id);

  // 3. Create Divisions
  const divisions = [
    {
      name: 'Elementary School',
      type: 'elementary',
      grades: ['Pre-K', 'K', '1', '2', '3', '4', '5']
    },
    {
      name: 'Middle School',
      type: 'middle',
      grades: ['6', '7', '8']
    },
    {
      name: 'High School',
      type: 'high',
      grades: ['9', '10', '11', '12']
    }
  ];

  const divisionIds: Record<string, string> = {};

  for (const div of divisions) {
    const divRef = await addDoc(collection(db, 'divisions'), {
      schoolId: schoolRef.id,
      name: div.name,
      type: div.type,
      description: `${div.name} serving grades ${div.grades.join(', ')}`,
      directorId: '',
      assistantDirectorIds: [],
      departments: [],
      grades: div.grades,
      settings: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    divisionIds[div.type] = divRef.id;
    console.log(`Created division: ${div.name} (${divRef.id})`);
  }

  // 4. Create Departments (High School example)
  const departments = [
    { name: 'English', subjects: ['English 9', 'English 10', 'English 11', 'English 12', 'AP Literature'] },
    { name: 'Mathematics', subjects: ['Algebra I', 'Geometry', 'Algebra II', 'Pre-Calculus', 'AP Calculus'] },
    { name: 'Science', subjects: ['Biology', 'Chemistry', 'Physics', 'AP Biology', 'AP Chemistry'] },
    { name: 'Social Studies', subjects: ['World History', 'US History', 'Government', 'Economics'] },
    { name: 'World Languages', subjects: ['Spanish I', 'Spanish II', 'French I', 'Mandarin I'] },
    { name: 'Fine Arts', subjects: ['Art', 'Music', 'Drama', 'Band', 'Choir'] },
    { name: 'PE & Health', subjects: ['Physical Education', 'Health'] }
  ];

  const departmentIds: Record<string, string> = {};

  for (const dept of departments) {
    const deptRef = await addDoc(collection(db, 'departments'), {
      schoolId: schoolRef.id,
      name: dept.name,
      description: `${dept.name} department`,
      headId: '',
      members: [],
      subjects: dept.subjects,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    departmentIds[dept.name] = deptRef.id;
    console.log(`Created department: ${dept.name} (${deptRef.id})`);
  }

  // 5. Create Sample Framework
  const frameworkRef = await addDoc(collection(db, 'frameworks'), {
    name: 'CRP Framework v1.0',
    description: 'Culturally Responsive Pedagogy observation framework',
    type: 'observation',
    version: '1.0',
    status: 'active',
    schoolId: schoolRef.id,
    createdBy: '',
    applicableDivisions: ['elementary', 'middle', 'high'],
    sections: [
      {
        id: 'section-environment',
        title: 'Classroom Environment',
        description: 'Creating an inclusive and culturally responsive environment',
        order: 1,
        questions: [
          {
            id: 'q-env-1',
            sectionId: 'section-environment',
            text: 'Teacher fosters a respectful, inclusive, and identity-affirming environment where all students feel a sense of belonging.',
            description: 'Look for evidence of cultural representation and inclusion',
            helpText: 'Student discussions about personal experiences, cultural connections, classroom decorations reflecting diversity',
            examples: [
              'Classroom displays showing diverse cultures and perspectives',
              'Students comfortable sharing personal cultural experiences',
              'Teacher using culturally relevant examples'
            ],
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
                {
                  value: 4,
                  label: 'Highly Effective',
                  description: 'Consistently demonstrates exemplary practice',
                  color: 'green'
                },
                {
                  value: 3,
                  label: 'Effective',
                  description: 'Demonstrates strong practice',
                  color: 'blue'
                },
                {
                  value: 2,
                  label: 'Developing',
                  description: 'Demonstrates emerging practice',
                  color: 'yellow'
                },
                {
                  value: 1,
                  label: 'Needs Improvement',
                  description: 'Requires significant development',
                  color: 'red'
                }
              ],
              includeNotObserved: true,
              notObservedLabel: 'Not Observed'
            },
            frameworkAlignments: [
              {
                id: 'crp-general',
                name: 'CRP General',
                category: 'CRP',
                description: 'General culturally responsive practices',
                color: 'blue',
                weight: 1,
                applicableTypes: ['observation'],
                applicableDivisions: ['elementary', 'middle', 'high']
              }
            ],
            tags: ['environment', 'inclusion', 'crp'],
            categories: ['classroom-environment'],
            difficulty: 'medium',
            evidenceRequired: false,
            evidenceTypes: ['photo', 'note'],
            minEvidenceCount: 0
          }
        ],
        isRequired: true,
        weight: 0.3,
        color: 'blue',
        icon: '🏫'
      }
    ],
    totalQuestions: 1,
    requiredQuestions: 1,
    estimatedDuration: 45,
    alignments: [
      {
        id: 'crp-general',
        name: 'CRP General',
        category: 'CRP',
        description: 'General culturally responsive practices',
        color: 'blue',
        weight: 1,
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high']
      }
    ],
    tags: ['crp', 'cultural-responsiveness', 'observation'],
    categories: ['classroom-observation'],
    usageCount: 0,
    averageCompletionTime: 0,
    averageEvidenceScore: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {}
  });

  console.log('Created framework:', frameworkRef.id);

  console.log('\n✅ Database seeding complete!');
  console.log('\nCreated:');
  console.log(`- Organization: ${orgRef.id}`);
  console.log(`- School: ${schoolRef.id}`);
  console.log(`- Divisions: ${Object.keys(divisionIds).length}`);
  console.log(`- Departments: ${Object.keys(departmentIds).length}`);
  console.log(`- Framework: ${frameworkRef.id}`);
  console.log('\nNext steps:');
  console.log('1. Create admin user via Firebase Authentication');
  console.log('2. Update user document with proper schoolId, divisionId, etc.');
  console.log('3. Log in and start creating observations!');
}

// Run seed
seedDatabase().catch(console.error);
```

Run the seed script:
```bash
npm run seed:database
```

## Step 6: Create Admin User

1. **Via Firebase Console**:
   - Go to Authentication → Add user
   - Email: `admin@yourschool.edu`
   - Password: (set secure password)
   - Copy the UID

2. **Create User Document**:
```typescript
// In Firestore, create document at users/{UID}
{
  id: "{UID}",
  email: "admin@yourschool.edu",
  firstName: "Admin",
  lastName: "User",
  displayName: "Admin User",
  employeeId: "ADMIN001",
  schoolId: "{YOUR_SCHOOL_ID}",
  divisionId: "{YOUR_DIVISION_ID}",
  primaryDepartmentId: null,
  departmentIds: [],
  primaryRole: "super_admin",
  secondaryRoles: [],
  permissions: [],
  jobTitle: "superintendent",
  certifications: [],
  experience: "",
  primarySubject: null,
  subjects: [],
  grades: [],
  specializations: [],
  planningPeriods: [],
  languages: ["English"],
  isActive: true,
  accountStatus: "active",
  createdAt: {timestamp},
  updatedAt: {timestamp},
  metadata: {}
}
```

## Step 7: Test Database Access

Create a test script `scripts/testDatabase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testDatabase() {
  // Test 1: Read frameworks
  const frameworksSnap = await getDocs(collection(db, 'frameworks'));
  console.log(`✅ Frameworks: ${frameworksSnap.size} found`);

  // Test 2: Read schools
  const schoolsSnap = await getDocs(collection(db, 'schools'));
  console.log(`✅ Schools: ${schoolsSnap.size} found`);

  // Test 3: Read users
  const usersSnap = await getDocs(collection(db, 'users'));
  console.log(`✅ Users: ${usersSnap.size} found`);

  console.log('\n✅ Database connection successful!');
}

testDatabase().catch(console.error);
```

## Database Maintenance

### Regular Tasks

1. **Backup Database** (weekly):
```bash
firebase firestore:backup gs://your-backup-bucket
```

2. **Monitor Usage**:
   - Go to Firebase Console → Firestore → Usage
   - Check reads/writes/deletes
   - Monitor storage size

3. **Clean up old data** (as needed):
```typescript
// Delete notifications older than 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const oldNotifications = await getDocs(
  query(
    collection(db, 'notifications'),
    where('createdAt', '<', Timestamp.fromDate(thirtyDaysAgo))
  )
);

for (const doc of oldNotifications.docs) {
  await deleteDoc(doc.ref);
}
```

## Troubleshooting

### Issue: Permission Denied
**Solution**: Check security rules and ensure user has proper role

### Issue: Index Required
**Solution**: Click the link in the error message to auto-create the index, or add to `firestore.indexes.json`

### Issue: Slow Queries
**Solution**:
- Add appropriate indexes
- Limit query results with `.limit()`
- Use pagination with `startAfter()`

## Next Steps

After database setup:
1. ✅ Deploy security rules
2. ✅ Create indexes
3. ✅ Seed initial data
4. ✅ Create admin user
5. ✅ Test database access
6. 🔄 Log in to app and create first framework
7. 🔄 Create first observation
8. 🔄 Test analytics

## Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Reference](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Indexing Best Practices](https://firebase.google.com/docs/firestore/query-data/indexing)
