# User Fields for Scheduling and Analytics

## Overview

The User model has been enhanced to support teachers working in multiple departments and teaching multiple subjects, which is essential for accurate scheduling and comprehensive analytics.

## Key User Fields

### School Structure
```typescript
interface User {
  // School Organization
  employeeId: string;
  schoolId: string;
  divisionId: string;
  primaryDepartmentId?: string; // Main department for analytics grouping
  departmentIds: string[];      // All departments (teachers can be in multiple)

  // Professional Info
  jobTitle: JobTitle;
  primarySubject?: string;      // Main subject for analytics grouping
  subjects: string[];           // All subjects taught (multi-subject teachers)
  grades: string[];             // Grade levels taught
}
```

### Why Multiple Departments/Subjects?

**Real-World Scenarios:**
- **PE Teacher**: Primary Department = "PE & Health", Secondary Department = "Athletics"
- **Math Teacher**: Primary Department = "Mathematics", Secondary Department = "STEM Coordinator"
- **Special Ed Teacher**: Primary Department = "Special Education", Secondary Departments = ["English", "Mathematics"] (co-teaching)
- **ESL Teacher**: Primary Department = "ESL/ELL", works across multiple departments supporting students

## Usage Across the System

### 1. **Observation Scheduling** (Finding Teachers)

When scheduling an observation, observers and administrators can filter teachers by:

**By Department:**
```typescript
// Find all teachers in Mathematics department
const mathTeachers = users.filter(user =>
  user.departmentIds.includes('mathematics') &&
  user.primaryRole === 'educator'
);

// Find primary Math department teachers only
const primaryMathTeachers = users.filter(user =>
  user.primaryDepartmentId === 'mathematics' &&
  user.primaryRole === 'educator'
);
```

**By Subject:**
```typescript
// Find all teachers who teach Algebra
const algebraTeachers = users.filter(user =>
  user.subjects.includes('Algebra I') ||
  user.subjects.includes('Algebra II')
);

// Find primary science teachers
const scienceTeachers = users.filter(user =>
  user.primarySubject === 'Science' &&
  user.primaryRole === 'educator'
);
```

**By Grade Level:**
```typescript
// Find all 9th grade teachers
const ninthGradeTeachers = users.filter(user =>
  user.grades.includes('9')
);
```

**Combined Filters:**
```typescript
// Find 9th grade Math teachers
const results = users.filter(user =>
  user.departmentIds.includes('mathematics') &&
  user.grades.includes('9') &&
  user.primaryRole === 'educator'
);
```

### 2. **Analytics - Department Performance**

**Department-Level Analytics:**
```typescript
// Calculate average observation scores by department
const departmentAnalytics = departments.map(dept => {
  // Get all teachers in this department (primary or secondary)
  const deptTeachers = users.filter(u =>
    u.departmentIds.includes(dept.id)
  );

  // Get observations for these teachers
  const deptObservations = observations.filter(obs =>
    deptTeachers.some(t => t.id === obs.subjectId)
  );

  // Calculate average scores
  const avgScore = calculateAverageScore(deptObservations);

  return {
    departmentId: dept.id,
    departmentName: dept.name,
    teacherCount: deptTeachers.length,
    observationCount: deptObservations.length,
    averageScore: avgScore,
    // Primary teachers (those for whom this is their main department)
    primaryTeacherCount: users.filter(u =>
      u.primaryDepartmentId === dept.id
    ).length
  };
});
```

**Subject-Level Analytics:**
```typescript
// Calculate average scores by subject
const subjectAnalytics = allSubjects.map(subject => {
  // Get all teachers who teach this subject
  const subjectTeachers = users.filter(u =>
    u.subjects.includes(subject)
  );

  // Get observations for classes teaching this subject
  const subjectObservations = observations.filter(obs =>
    // Match observations where teacher teaches this subject
    subjectTeachers.some(t => t.id === obs.subjectId) &&
    // And the observation context includes this subject
    obs.context?.subject === subject
  );

  return {
    subject: subject,
    teacherCount: subjectTeachers.length,
    observationCount: subjectObservations.length,
    averageScore: calculateAverageScore(subjectObservations),
    primaryTeacherCount: users.filter(u =>
      u.primarySubject === subject
    ).length
  };
});
```

### 3. **Analytics - Cross-Department Insights**

**Teachers in Multiple Departments:**
```typescript
// Find teachers working across multiple departments
const multiDeptTeachers = users.filter(u =>
  u.departmentIds.length > 1
);

// Analyze performance across departments
const crossDeptAnalysis = multiDeptTeachers.map(teacher => {
  return teacher.departmentIds.map(deptId => {
    // Get observations for this teacher in this department context
    const deptObs = observations.filter(obs =>
      obs.subjectId === teacher.id &&
      obs.context?.department === deptId
    );

    return {
      teacherId: teacher.id,
      teacherName: teacher.displayName,
      departmentId: deptId,
      isPrimaryDepartment: teacher.primaryDepartmentId === deptId,
      observationCount: deptObs.length,
      averageScore: calculateAverageScore(deptObs)
    };
  });
});
```

### 4. **Admin Dashboard Filters**

**Filter Options in Admin UI:**
```typescript
// Department filter dropdown
<select onChange={(e) => setFilterDepartment(e.target.value)}>
  <option value="all">All Departments</option>
  <option value="primary-only">Primary Department Only</option>
  {departments.map(dept => (
    <option key={dept.id} value={dept.id}>{dept.name}</option>
  ))}
</select>

// Subject filter dropdown
<select onChange={(e) => setFilterSubject(e.target.value)}>
  <option value="all">All Subjects</option>
  {uniqueSubjects.map(subject => (
    <option key={subject} value={subject}>{subject}</option>
  ))}
</select>

// Job Title filter
<select onChange={(e) => setFilterJobTitle(e.target.value)}>
  <option value="all">All Job Titles</option>
  <option value="teacher">Teachers</option>
  <option value="department_head">Department Heads</option>
  <option value="specialist_teacher">Specialist Teachers</option>
  {/* ... other job titles */}
</select>
```

### 5. **Observation Creation - Teacher Selection**

**Observer Quick Observation Component:**
```typescript
// Filter teachers by department for observation
const [selectedDepartment, setSelectedDepartment] = useState('all');
const [selectedSubject, setSelectedSubject] = useState('all');

const filteredTeachers = useMemo(() => {
  let filtered = allTeachers;

  // Filter by department
  if (selectedDepartment !== 'all') {
    filtered = filtered.filter(t =>
      t.departmentIds.includes(selectedDepartment)
    );
  }

  // Filter by subject
  if (selectedSubject !== 'all') {
    filtered = filtered.filter(t =>
      t.subjects.includes(selectedSubject)
    );
  }

  return filtered.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );
}, [allTeachers, selectedDepartment, selectedSubject]);
```

### 6. **Analytics Reports**

**Department Performance Report:**
```typescript
interface DepartmentReport {
  departmentId: string;
  departmentName: string;

  // Teacher counts
  totalTeachers: number;
  primaryTeachers: number;    // Teachers for whom this is primary dept
  secondaryTeachers: number;  // Teachers with this as secondary dept

  // Observation metrics
  totalObservations: number;
  averageScore: number;
  frameworkScores: FrameworkScore[];

  // Trends
  monthlyTrend: { month: string; avgScore: number }[];

  // Strengths and growth areas (from framework)
  strengthAreas: string[];
  growthAreas: string[];
}
```

**Subject Performance Report:**
```typescript
interface SubjectReport {
  subject: string;

  // Teacher counts
  totalTeachers: number;
  primaryTeachers: number;    // Teachers for whom this is primary subject

  // Department distribution
  departmentDistribution: {
    departmentId: string;
    departmentName: string;
    teacherCount: number;
  }[];

  // Observation metrics
  totalObservations: number;
  averageScore: number;
  frameworkScores: FrameworkScore[];

  // Cross-subject comparison
  comparedToSchoolAverage: number; // Percentage difference
}
```

**Individual Teacher Report:**
```typescript
interface TeacherReport {
  teacherId: string;
  teacherName: string;

  // Organizational info
  primaryDepartment: string;
  allDepartments: string[];
  primarySubject: string;
  allSubjects: string[];
  jobTitle: JobTitle;

  // Observation summary
  totalObservations: number;
  averageScore: number;

  // By department breakdown (for multi-dept teachers)
  byDepartment: {
    departmentId: string;
    departmentName: string;
    observationCount: number;
    averageScore: number;
  }[];

  // By subject breakdown (for multi-subject teachers)
  bySubject: {
    subject: string;
    observationCount: number;
    averageScore: number;
  }[];

  // Framework-specific insights
  frameworkScores: FrameworkScore[];
  strengthAreas: string[];
  growthAreas: string[];
}
```

## Implementation Examples

### Example 1: Department Head Dashboard

A department head should see:
- All teachers where `departmentIds` includes their department
- Ability to filter between "Primary" (teachers with `primaryDepartmentId` matching) vs "All" (includes secondary)

```typescript
const DepartmentHeadDashboard = () => {
  const user = useAuthStore(state => state.user);
  const [viewMode, setViewMode] = useState<'primary' | 'all'>('all');

  const departmentTeachers = useMemo(() => {
    if (viewMode === 'primary') {
      return allUsers.filter(u =>
        u.primaryDepartmentId === user.primaryDepartmentId
      );
    } else {
      return allUsers.filter(u =>
        u.departmentIds.includes(user.primaryDepartmentId!)
      );
    }
  }, [allUsers, user, viewMode]);

  // Show analytics for these teachers...
};
```

### Example 2: Admin Analytics by Subject

Administrator wants to see which subjects are performing well:

```typescript
const SubjectPerformanceView = () => {
  // Get all unique subjects from all users
  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    allUsers.forEach(u => {
      u.subjects.forEach(s => subjects.add(s));
    });
    return Array.from(subjects).sort();
  }, [allUsers]);

  // Calculate performance for each subject
  const subjectPerformance = allSubjects.map(subject => {
    const teachers = allUsers.filter(u => u.subjects.includes(subject));
    const obs = observations.filter(o =>
      teachers.some(t => t.id === o.subjectId) &&
      o.context?.subject === subject
    );

    return {
      subject,
      teacherCount: teachers.length,
      observationCount: obs.length,
      averageScore: calculateAverage(obs.map(o => o.frameworkScores))
    };
  });

  // Display ranked by performance...
};
```

### Example 3: Finding Teachers for Observation

Observer wants to schedule an observation:

```typescript
const TeacherSelectionModal = () => {
  const [filters, setFilters] = useState({
    department: 'all',
    subject: 'all',
    grade: 'all',
    jobTitle: 'all'
  });

  const availableTeachers = useMemo(() => {
    return allUsers.filter(user => {
      // Must be an educator
      if (user.primaryRole !== 'educator') return false;

      // Department filter
      if (filters.department !== 'all' &&
          !user.departmentIds.includes(filters.department)) {
        return false;
      }

      // Subject filter
      if (filters.subject !== 'all' &&
          !user.subjects.includes(filters.subject)) {
        return false;
      }

      // Grade filter
      if (filters.grade !== 'all' &&
          !user.grades.includes(filters.grade)) {
        return false;
      }

      // Job title filter
      if (filters.jobTitle !== 'all' &&
          user.jobTitle !== filters.jobTitle) {
        return false;
      }

      return true;
    }).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allUsers, filters]);

  // Render teacher selection list...
};
```

## Database Queries (Firestore)

### Query teachers in a specific department:
```typescript
// Get all teachers in Mathematics (primary or secondary)
const mathTeachers = await usersRef
  .where('departmentIds', 'array-contains', 'mathematics')
  .where('primaryRole', '==', 'educator')
  .get();

// Get only PRIMARY Mathematics teachers
const primaryMathTeachers = await usersRef
  .where('primaryDepartmentId', '==', 'mathematics')
  .where('primaryRole', '==', 'educator')
  .get();
```

### Query teachers by subject:
```typescript
// Get all teachers who teach Physics
const physicsTeachers = await usersRef
  .where('subjects', 'array-contains', 'Physics')
  .get();
```

### Query for analytics:
```typescript
// Get all observations for teachers in a specific department
const deptTeacherIds = teachers
  .filter(t => t.departmentIds.includes(departmentId))
  .map(t => t.id);

// Note: Firestore 'in' query limited to 10 items, so chunk if needed
const observations = await observationsRef
  .where('subjectId', 'in', deptTeacherIds.slice(0, 10))
  .get();
```

## Migration Notes

If you have existing users with the old `departmentId` field:

```typescript
// Migration script to convert existing data
const migrateUserDepartments = async () => {
  const users = await usersRef.get();

  for (const doc of users.docs) {
    const user = doc.data();

    // Convert single departmentId to arrays
    if (user.departmentId) {
      await doc.ref.update({
        primaryDepartmentId: user.departmentId,
        departmentIds: [user.departmentId],
        // Remove old field
        departmentId: firebase.firestore.FieldValue.delete()
      });
    } else {
      // No department set, initialize as empty arrays
      await doc.ref.update({
        primaryDepartmentId: null,
        departmentIds: []
      });
    }
  }
};
```

## Best Practices

1. **Always set primaryDepartmentId**: Even if a teacher only has one department, set it as primary for consistent queries
2. **Always include primary in departmentIds**: `departmentIds` should always include `primaryDepartmentId`
3. **Use primary for default grouping**: When showing "Department Performance" use `primaryDepartmentId` to avoid double-counting
4. **Use departmentIds for teacher discovery**: When finding teachers for observation, search `departmentIds` to include all teachers
5. **Subject naming consistency**: Maintain a standardized list of subject names (avoid "Math" vs "Mathematics")
6. **Job title maps to department**: Certain job titles imply departments (e.g., "department_head" should have `primaryDepartmentId` set)

## Summary

The enhanced User model now supports:
- ✅ **Multiple departments** via `departmentIds: string[]`
- ✅ **Primary department** via `primaryDepartmentId?: string`
- ✅ **Multiple subjects** via `subjects: string[]`
- ✅ **Primary subject** via `primarySubject?: string`
- ✅ **Job title** via `jobTitle: JobTitle`
- ✅ **Grade levels** via `grades: string[]`

This enables:
1. **Accurate teacher discovery** when scheduling observations
2. **Comprehensive analytics** by department, subject, grade, and job title
3. **Cross-department insights** for teachers working in multiple areas
4. **Flexible filtering** in admin dashboards and reports
5. **Proper attribution** in analytics without double-counting
