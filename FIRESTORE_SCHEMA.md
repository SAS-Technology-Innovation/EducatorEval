# Firestore Database Schema

Complete database schema for EducatorEval platform.

## Collections Overview

| Collection | Purpose | Count | Status |
|------------|---------|-------|--------|
| `frameworks` | Observation frameworks (10 integrated look-fors) | 1 | ✅ Seeded |
| `organizations` | Top-level organizations (districts, networks) | 1 | ✅ Seeded |
| `schools` | Individual schools within organizations | 1 | ✅ Seeded |
| `divisions` | School divisions (Elementary, Middle, High) | 3 | ✅ Seeded |
| `departments` | Academic departments | 4 | ✅ Seeded |
| `users` | All platform users (teachers, observers, admins) | 6 | ✅ Seeded |
| `observations` | Classroom observations | 1 | ✅ Seeded |
| `schedules` | Teacher schedules (for auto-population) | 0 | ⏳ Future |
| `professional_learning` | PD goals and progress | 0 | ⏳ Future |

---

## Collection Schemas

### 1. `frameworks` Collection

**Purpose:** Stores observation frameworks that drive all observation forms, analytics, and exports.

**Document ID:** `integrated-observation-framework`

```typescript
{
  id: string;                    // Document ID
  name: string;                  // "Integrated Observation Framework"
  description: string;           // Full description
  version: string;               // "1.0.0"
  status: 'active' | 'archived' | 'draft';
  type: 'observation';
  totalQuestions: number;        // 10
  requiredQuestions: number;     // 10
  estimatedDuration: number;     // 15 minutes

  sections: [{
    id: string;                  // "single-section"
    title: string;               // "Integrated Look-Fors"
    description: string;
    order: number;

    questions: [{
      id: string;                // "look-for-1", "look-for-2", ...
      sectionId: string;
      order: number;             // 1-10
      text: string;              // The look-for statement
      description: string;       // What to look for
      helpText: string;          // Guidance for observers
      examples: string[];        // Specific examples
      type: 'rating';

      scale: {
        id: 'evidence-scale';
        name: 'Evidence Scale';
        type: 'descriptive';
        min: 0;                  // Not Observed
        max: 1;                  // Observed
        labels: [{
          value: 0 | 1;
          label: 'Not Observed' | 'Observed';
          description: string;
          color: 'gray' | 'green';
        }];
        includeNotObserved: true;
        notObservedLabel: 'Not Observed';
      };

      frameworkAlignments: [{
        id: string;              // Framework alignment ID
        name: string;            // Framework name
        category: string;        // Framework category
        subcategory?: string;    // Specific area
        description: string;     // How it aligns
      }];

      required: true;
      isObservable: true;
    }];
  }];

  alignments: [{
    id: string;                  // 'crp', 'tripod', etc.
    name: string;                // Full framework name
    category: string;            // Category
    description: string;         // Framework description
  }];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Key Features:**
- **Master Control**: Drives all observation forms dynamically
- **10 Integrated Look-Fors**: Fixed set combining multiple frameworks
- **Simple Scale**: Observed (1) / Not Observed (0)
- **Multiple Alignments**: CRP, 7Cs, 5 Daily Assessment, CASEL, Panorama, Inclusive Practices

---

### 2. `organizations` Collection

**Purpose:** Top-level organizational units (school districts, networks).

```typescript
{
  id: string;                    // "sas-001"
  name: string;                  // "Singapore American School"
  shortName: string;             // "SAS"
  type: 'school' | 'district' | 'network';
  address: string;
  website: string;

  divisions: [{
    id: string;                  // "elementary", "middle", "high"
    name: string;                // "Elementary School"
    grades: string[];            // ["K", "1", "2", "3", "4", "5"]
  }];

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 3. `schools` Collection

**Purpose:** Individual schools within organizations.

```typescript
{
  id: string;                    // "sas-001"
  name: string;                  // "Singapore American School"
  shortName: string;             // "SAS"
  organizationId: string;        // Link to organization
  type: 'international' | 'public' | 'private' | 'charter';

  address: string;
  phone: string;
  website: string;
  timezone: string;              // "Asia/Singapore"

  academicYear: string;          // "2024-2025"
  currentSemester: string;       // "Semester 2"

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 4. `divisions` Collection

**Purpose:** School divisions (Elementary, Middle, High School).

```typescript
{
  id: string;                    // "elementary", "middle-school", "high-school"
  name: string;                  // "Elementary School"
  schoolId: string;              // "sas-001"

  grades: string[];              // ["K", "1", "2", "3", "4", "5"]

  principal: string | null;      // Principal name
  principalId: string | null;    // Link to users collection

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 5. `departments` Collection

**Purpose:** Academic departments within schools.

```typescript
{
  id: string;                    // "dept-english", "dept-math", etc.
  name: string;                  // "English"
  schoolId: string;              // "sas-001"
  divisionIds: string[];         // ["high-school", "middle-school"]

  headOfDepartment: string | null;
  headOfDepartmentId: string | null;
  faculty: string[];             // Array of user IDs

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 6. `users` Collection

**Purpose:** All platform users (teachers, observers, administrators).

```typescript
{
  id: string;                    // User UID from Firebase Auth
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;

  // Role System
  primaryRole: 'super_admin' | 'administrator' | 'manager' | 'observer' | 'educator' | 'staff';
  secondaryRoles: string[];      // Additional roles

  // Organizational Assignment
  schoolId: string;              // "sas-001"
  divisionId: string;            // "high-school"
  departmentId: string;          // "dept-english"

  // Teaching Assignment (for educators)
  subjects: string[];            // ["English", "Literature"]
  grades: string[];              // ["9", "10", "11", "12"]

  // Permissions
  isActive: boolean;
  canObserve: boolean;           // Can conduct observations
  canBeObserved: boolean;        // Can be observed (teachers)

  // Optional
  scheduleId?: string;           // Link to schedule

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Role Hierarchy:**
1. `staff` - Basic access
2. `educator` - Teachers, can view own observations
3. `observer` - Can conduct observations
4. `manager` - Department heads, manage teams
5. `administrator` - School admins, full user management
6. `super_admin` - System-wide access

---

### 7. `observations` Collection

**Purpose:** Classroom observations using the integrated framework.

```typescript
{
  id: string;                    // Auto-generated

  // Framework
  frameworkId: string;           // "integrated-observation-framework"

  // People
  educatorId: string;            // Teacher being observed
  educatorName: string;          // Display name
  observerId: string;            // Observer conducting
  observerName: string;          // Display name

  // Location
  schoolId: string;
  divisionId: string;
  departmentId: string;
  subjectArea: string;           // "English Literature"
  gradeLevel: string;            // "11"

  // Timing
  observationDate: Timestamp;
  status: 'draft' | 'in_progress' | 'submitted' | 'completed' | 'archived';

  // Class Context
  classContext: {
    className: string;           // "AP English Literature"
    room: string;                // "Room 305"
    enrolledStudents: number;    // 24
    presentStudents: number;     // 22
    period: string;              // "Period 3"
  };

  // Responses (10 look-fors)
  responses: [{
    questionId: string;          // "look-for-1", "look-for-2", ...
    rating: 0 | 1;               // Not Observed (0) or Observed (1)
    evidence: string;            // Observer notes
    observed: boolean;           // true/false
  }];

  // Feedback
  overallComments: string;       // General comments
  commendations: string;         // Strengths observed
  areasForGrowth: string;        // Areas to develop
  followUpActions: string[];     // Next steps

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp;
  completedAt?: Timestamp;
}
```

---

### 8. `schedules` Collection (Future)

**Purpose:** Teacher schedules for auto-populating observation forms.

```typescript
{
  id: string;
  educatorId: string;
  schoolId: string;
  academicYear: string;

  classes: [{
    id: string;
    name: string;
    subject: string;
    gradeLevel: string;
    room: string;
    period: string;
    dayType: string;
    startTime: string;
    endTime: string;
    enrolledStudents: number;
  }];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 9. `professional_learning` Collection (Future)

**Purpose:** Professional development goals and progress tracking.

```typescript
{
  id: string;
  educatorId: string;
  schoolYear: string;

  goals: [{
    id: string;
    title: string;
    description: string;
    category: string;
    targetDate: Timestamp;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;              // 0-100
    relatedObservations: string[]; // Observation IDs
  }];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## Data Relationships

```
organizations (1)
  ↓
schools (1)
  ↓
divisions (3)
  ↓
departments (4)
  ↓
users (6)
  ↓
observations (1)
  ↓
frameworks (1) - MASTER CONTROL
```

### Key Relationships:

1. **Organization → School**: One-to-many (future support for multi-school)
2. **School → Divisions**: One-to-many (Elementary, Middle, High)
3. **Division → Departments**: Many-to-many (departments span divisions)
4. **Department → Users**: One-to-many (faculty members)
5. **Framework → Observations**: One-to-many (all observations use same framework)
6. **Users → Observations**: Many-to-many (observers and educators)

---

## Indexes

**Firestore Composite Indexes** (defined in `firestore.indexes.json`):

```json
{
  "indexes": [
    {
      "collectionGroup": "observations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "educatorId", "order": "ASCENDING" },
        { "fieldPath": "observationDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "observations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "schoolId", "order": "ASCENDING" },
        { "fieldPath": "observationDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "schoolId", "order": "ASCENDING" },
        { "fieldPath": "lastName", "order": "ASCENDING" },
        { "fieldPath": "firstName", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---

## Security Rules

**Current Rules** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    // Simplified rules for development - any authenticated user can read/write
    // TODO: Implement proper role-based security in production
    match /{document=**} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

**Future: Role-Based Security**
- Super Admin: Full access to all collections
- Administrator: Manage users, view all observations in their school
- Observer: Create/read observations, read users
- Educator: Read own observations, read own user profile
- Staff: Read-only access to relevant data

---

## Sample Data

### Current Seeded Data:

**Frameworks:**
- `integrated-observation-framework` - 10 integrated look-fors

**Organizations:**
- `sas-001` - Singapore American School

**Schools:**
- `sas-001` - Singapore American School

**Divisions:**
- `elementary` - Elementary School (K-5)
- `middle-school` - Middle School (6-8)
- `high-school` - High School (9-12)

**Departments:**
- `dept-english` - English (Middle & High)
- `dept-math` - Mathematics (Middle & High)
- `dept-science` - Science (Middle & High)
- `dept-leadership` - Leadership (High School)

**Users:**
- `super-admin-001` - admin@sas.edu.sg (Super Admin)
- `observer-001` - observer@sas.edu.sg (Observer/Manager)
- `teacher-001` - teacher@sas.edu.sg (English Teacher)
- `teacher-002` - sarah.math@sas.edu.sg (Math Teacher)
- `teacher-003` - mike.science@sas.edu.sg (Science Teacher)
- `teacher-004` - lisa.english@sas.edu.sg (Middle School English)

**Observations:**
- `obs-001` - Sample observation of Jane Teacher (all 10 look-fors observed)

---

## Migration & Seeding

### Scripts:

1. **`scripts/migrate.mjs`** - Initial framework, organization, users
2. **`scripts/seed-all-data.mjs`** - Complete data seeding

### Run Migrations:

```bash
# Initial migration (framework + core data)
node scripts/migrate.mjs

# Complete data seed (all collections)
node scripts/seed-all-data.mjs
```

### Reset Database:

To reset and re-seed the database:

1. Delete all collections in [Firestore Console](https://console.firebase.google.com/project/educator-evaluations/firestore)
2. Temporarily set `firestore.rules` to allow all: `allow read, write: if true;`
3. Run: `firebase deploy --only firestore:rules`
4. Run: `node scripts/migrate.mjs && node scripts/seed-all-data.mjs`
5. Restore auth rules: `allow read, write: if isAuthenticated();`
6. Run: `firebase deploy --only firestore:rules`

---

## Verification

Check that all collections are populated:

1. Open [Firestore Console](https://console.firebase.google.com/project/educator-evaluations/firestore)
2. Verify collections exist:
   - ✅ `frameworks` (1 document)
   - ✅ `organizations` (1 document)
   - ✅ `schools` (1 document)
   - ✅ `divisions` (3 documents)
   - ✅ `departments` (4 documents)
   - ✅ `users` (6 documents)
   - ✅ `observations` (1 document)

---

## Next Steps

1. **Build Observation Form** - Dynamically generate from framework
2. **Implement Schedule System** - Auto-populate observation forms
3. **Create Analytics Dashboard** - Framework-driven reports
4. **Add Professional Learning** - PD goal tracking
5. **Enhance Security Rules** - Role-based access control
