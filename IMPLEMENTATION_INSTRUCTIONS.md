# Educational Employee Experience Platform - Firebase + Astro + Go Instructions

## Platform Overview

**Vision**: Comprehensive employee experience platform for educational institutions, designed as a core system with extensible "applets" for various HR, professional development, and instructional support functions.

**Initial Applet**: CRP in Action observation tool (targeting 5,000 observations by May 2026, 70% CRP evidence)

**Future Applets**: Performance evaluations, professional learning tracking, goal setting, feedback systems, compliance tracking, professional learning communities, mentoring programs, etc.

## Technical Stack (Firebase-Only)

- **Frontend**: Astro with React Islands, TypeScript
- **Backend**: Go with Firebase Admin SDK
- **Database**: Firestore (exclusively)
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Functions**: Firebase Cloud Functions (Go runtime)
- **Hosting**: Firebase Hosting
- **Analytics**: Firebase Analytics
- **Styling**: Tailwind CSS with design system
- **State Management**: React Query (TanStack Query) + Zustand
- **Mobile**: Progressive Web App (PWA) with offline-first design
- **Icons**: Lucide React
- **Data Visualization**: Recharts, D3.js
- **Testing**: Go testing for Firebase functions; Vitest for frontend

## Architecture: Core Platform + Observation Applet System

### Frontend (Astro + React Islands)
```
astro.config.mjs - Main configuration
src/
├── pages/                    # Astro pages (routing)
│   ├── index.astro          # Core platform dashboard
│   ├── admin.astro          # User/org management
│   └── applets/             # Applet-specific pages
│       └── observations/    # Observation Applet pages
│           ├── dashboard.astro    # Observation analytics
│           ├── capture.astro      # Mobile observation form
│           └── frameworks.astro   # Framework management
├── components/
│   ├── core/                # Core platform components
│   │   ├── Auth/            # Authentication components
│   │   ├── Navigation/      # Global navigation
│   │   └── UserManagement/  # User/role management
│   └── applets/             # Applet-specific components
│       └── observations/    # Observation Applet components
│           ├── FrameworkEditor.tsx
│           ├── ObservationForm.tsx
│           └── ObservationDashboard.tsx
├── layouts/                 # Astro layouts
├── stores/                  # Zustand stores
├── lib/                     # Firebase SDK, utilities
└── types/                   # TypeScript definitions
```

### Backend (Go Cloud Functions)
```
functions/
├── core/                    # Core platform functions
│   ├── auth/               # User authentication
│   ├── users/              # User management
│   └── organizations/      # Org/school management
├── applets/
│   └── observations/       # Observation Applet functions
│       ├── frameworks/     # Framework CRUD
│       ├── observations/   # Observation CRUD
│       └── analytics/      # Observation analytics
├── shared/
│   ├── middleware/         # Auth, validation
│   ├── models/            # Shared data models
│   └── utils/             # Firebase utilities
└── firebase.json          # Firebase configuration
```

### Core Platform vs Observation Applet
**Core Platform**:
- User authentication and management
- Organization/school hierarchy  
- Role-based permissions
- Global navigation and settings

**Observation Applet**:
- Framework management (any type: CRP, evaluation, etc.)
- Observation capture and tracking
- Observation analytics and reporting
- Observer scheduling and notifications

## Complete Data Models (Firestore Collections)

### Core User Management
```go
// internal/models/user.go
type User struct {
    // Identity
    ID          string    `firestore:"id" json:"id"`
    Email       string    `firestore:"email" json:"email"`
    FirstName   string    `firestore:"firstName" json:"firstName"`
    LastName    string    `firestore:"lastName" json:"lastName"`
    DisplayName string    `firestore:"displayName" json:"displayName"`
    Avatar      string    `firestore:"avatar,omitempty" json:"avatar,omitempty"`
    
    // Organization
    EmployeeID     string `firestore:"employeeId" json:"employeeId"`
    OrganizationID string `firestore:"organizationId" json:"organizationId"`
    DepartmentID   string `firestore:"departmentId" json:"departmentId"`
    SchoolID       string `firestore:"schoolId,omitempty" json:"schoolId,omitempty"`
    DivisionID     string `firestore:"divisionId,omitempty" json:"divisionId,omitempty"`
    
    // Role & Permissions
    PrimaryRole     UserRole   `firestore:"primaryRole" json:"primaryRole"`
    SecondaryRoles  []UserRole `firestore:"secondaryRoles" json:"secondaryRoles"`
    Permissions     []string   `firestore:"permissions" json:"permissions"`
    
    // Professional Info
    Title           string   `firestore:"title" json:"title"`
    Certifications  []string `firestore:"certifications" json:"certifications"`
    Experience      string   `firestore:"experience" json:"experience"`
    Subjects        []string `firestore:"subjects" json:"subjects"`
    Grades          []string `firestore:"grades" json:"grades"`
    Specializations []string `firestore:"specializations" json:"specializations"`
    
    // Contact & Demographics
    PhoneNumber string   `firestore:"phoneNumber,omitempty" json:"phoneNumber,omitempty"`
    Address     *Address `firestore:"address,omitempty" json:"address,omitempty"`
    Pronouns    string   `firestore:"pronouns,omitempty" json:"pronouns,omitempty"`
    Languages   []string `firestore:"languages" json:"languages"`
    
    // System
    IsActive      bool                   `firestore:"isActive" json:"isActive"`
    AccountStatus string                 `firestore:"accountStatus" json:"accountStatus"`
    LastLogin     *time.Time             `firestore:"lastLogin,omitempty" json:"lastLogin,omitempty"`
    CreatedAt     time.Time              `firestore:"createdAt" json:"createdAt"`
    UpdatedAt     time.Time              `firestore:"updatedAt" json:"updatedAt"`
    Metadata      map[string]interface{} `firestore:"metadata" json:"metadata"`
    
    // Preferences
    Preferences          *UserPreferences      `firestore:"preferences,omitempty" json:"preferences,omitempty"`
    NotificationSettings *NotificationSettings `firestore:"notificationSettings,omitempty" json:"notificationSettings,omitempty"`
}

type UserRole string
const (
    SuperAdmin          UserRole = "super_admin"
    DistrictAdmin       UserRole = "district_admin"
    SchoolAdmin         UserRole = "school_admin"
    Superintendent      UserRole = "superintendent"
    Principal           UserRole = "principal"
    AssistantPrincipal  UserRole = "assistant_principal"
    DepartmentHead      UserRole = "department_head"
    Teacher             UserRole = "teacher"
    SubstituteTeacher   UserRole = "substitute_teacher"
    SpecialistTeacher   UserRole = "specialist_teacher"
    InstructionalCoach  UserRole = "instructional_coach"
    PLCCoach           UserRole = "plc_coach"
    DEISpecialist      UserRole = "dei_specialist"
    CurriculumCoord    UserRole = "curriculum_coordinator"
    Observer           UserRole = "observer"
    ExternalEvaluator  UserRole = "external_evaluator"
    Counselor          UserRole = "counselor"
    Librarian          UserRole = "librarian"
    TechCoordinator    UserRole = "technology_coordinator"
    SupportStaff       UserRole = "support_staff"
)

type Organization struct {
    ID          string            `firestore:"id" json:"id"`
    Name        string            `firestore:"name" json:"name"`
    Type        string            `firestore:"type" json:"type"` // district, school, charter, private
    Address     *Address          `firestore:"address" json:"address"`
    ContactInfo *ContactInfo      `firestore:"contactInfo" json:"contactInfo"`
    Settings    map[string]interface{} `firestore:"settings" json:"settings"`
    Timezone    string            `firestore:"timezone" json:"timezone"`
    AcademicYear *AcademicYear    `firestore:"academicYear" json:"academicYear"`
    CreatedAt   time.Time         `firestore:"createdAt" json:"createdAt"`
    UpdatedAt   time.Time         `firestore:"updatedAt" json:"updatedAt"`
}

type School struct {
    ID             string        `firestore:"id" json:"id"`
    OrganizationID string        `firestore:"organizationId" json:"organizationId"`
    Name           string        `firestore:"name" json:"name"`
    ShortName      string        `firestore:"shortName" json:"shortName"`
    Type           string        `firestore:"type" json:"type"` // elementary, middle, high, k12, specialty
    Grades         []string      `firestore:"grades" json:"grades"`
    Address        *Address      `firestore:"address" json:"address"`
    ContactInfo    *ContactInfo  `firestore:"contactInfo" json:"contactInfo"`
    PrincipalID    string        `firestore:"principalId" json:"principalId"`
    AssistantPrincipalIDs []string `firestore:"assistantPrincipalIds" json:"assistantPrincipalIds"`
    Settings       map[string]interface{} `firestore:"settings" json:"settings"`
    CreatedAt      time.Time     `firestore:"createdAt" json:"createdAt"`
    UpdatedAt      time.Time     `firestore:"updatedAt" json:"updatedAt"`
}

type Department struct {
    ID          string    `firestore:"id" json:"id"`
    SchoolID    string    `firestore:"schoolId" json:"schoolId"`
    Name        string    `firestore:"name" json:"name"`
    Description string    `firestore:"description" json:"description"`
    HeadID      string    `firestore:"headId" json:"headId"`
    Members     []string  `firestore:"members" json:"members"`
    Subjects    []string  `firestore:"subjects" json:"subjects"`
    BudgetCode  string    `firestore:"budgetCode,omitempty" json:"budgetCode,omitempty"`
    CreatedAt   time.Time `firestore:"createdAt" json:"createdAt"`
    UpdatedAt   time.Time `firestore:"updatedAt" json:"updatedAt"`
}
```

## Complete Data Models (Firestore Collections)

### 🏢 Core Platform Data Models
```go
// Simplified structure: School → Divisions → Departments → Users + Schedules
type User struct {
    // Identity
    ID          string    `firestore:"id" json:"id"`
    Email       string    `firestore:"email" json:"email"`
    FirstName   string    `firestore:"firstName" json:"firstName"`
    LastName    string    `firestore:"lastName" json:"lastName"`
    DisplayName string    `firestore:"displayName" json:"displayName"`
    Avatar      string    `firestore:"avatar,omitempty" json:"avatar,omitempty"`
    
    // School Structure
    EmployeeID   string `firestore:"employeeId" json:"employeeId"`
    SchoolID     string `firestore:"schoolId" json:"schoolId"`
    DivisionID   string `firestore:"divisionId" json:"divisionId"`     // elementary, middle, high, etc.
    DepartmentID string `firestore:"departmentId,omitempty" json:"departmentId,omitempty"`
    
    // Role & Permissions
    PrimaryRole     UserRole   `firestore:"primaryRole" json:"primaryRole"`
    SecondaryRoles  []UserRole `firestore:"secondaryRoles" json:"secondaryRoles"`
    Permissions     []string   `firestore:"permissions" json:"permissions"`
    
    // Professional Info
    Title           string   `firestore:"title" json:"title"`
    Subjects        []string `firestore:"subjects" json:"subjects"`
    Grades          []string `firestore:"grades" json:"grades"`
    
    // 📅 SCHEDULE INFORMATION
    ScheduleID      string   `firestore:"scheduleId,omitempty" json:"scheduleId,omitempty"`        // References master schedule
    TeachingLoad    float64  `firestore:"teachingLoad,omitempty" json:"teachingLoad,omitempty"`    // Percentage or periods per day
    PlanningPeriods []string `firestore:"planningPeriods" json:"planningPeriods"`                 // Planning/prep periods
    
    // System
    IsActive      bool                   `firestore:"isActive" json:"isActive"`
    AccountStatus string                 `firestore:"accountStatus" json:"accountStatus"`
    LastLogin     *time.Time             `firestore:"lastLogin,omitempty" json:"lastLogin,omitempty"`
    CreatedAt     time.Time              `firestore:"createdAt" json:"createdAt"`
    UpdatedAt     time.Time              `firestore:"updatedAt" json:"updatedAt"`
}

// 📅 MASTER SCHEDULE SYSTEM
type MasterSchedule struct {
    ID       string `firestore:"id" json:"id"`
    SchoolID string `firestore:"schoolId" json:"schoolId"`
    
    // Schedule Info
    Name            string        `firestore:"name" json:"name"`                    // "2024-2025 Master Schedule"
    AcademicYear    string        `firestore:"academicYear" json:"academicYear"`   // "2024-2025"
    ScheduleType    ScheduleType  `firestore:"scheduleType" json:"scheduleType"`   // traditional, block, rotating, etc.
    
    // Day Structure
    DayTypes        []DayType     `firestore:"dayTypes" json:"dayTypes"`           // Day A, Day B, etc. or M, T, W, T, F
    Periods         []Period      `firestore:"periods" json:"periods"`            // Period definitions
    
    // Schedule Metadata
    StartDate       time.Time     `firestore:"startDate" json:"startDate"`
    EndDate         time.Time     `firestore:"endDate" json:"endDate"`
    IsActive        bool          `firestore:"isActive" json:"isActive"`
    
    // System
    CreatedAt       time.Time     `firestore:"createdAt" json:"createdAt"`
    UpdatedAt       time.Time     `firestore:"updatedAt" json:"updatedAt"`
}

type ScheduleType string
const (
    Traditional ScheduleType = "traditional"  // Same schedule every day
    Block       ScheduleType = "block"        // Block scheduling (longer periods)
    Rotating    ScheduleType = "rotating"     // Day A, Day B, Day C, Day D rotation
    Flexible    ScheduleType = "flexible"     // Flexible/modular scheduling
    Hybrid      ScheduleType = "hybrid"       // Combination of above
)

type DayType struct {
    ID          string    `firestore:"id" json:"id"`
    Name        string    `firestore:"name" json:"name"`        // "Day A", "Monday", "Blue Day", etc.
    ShortName   string    `firestore:"shortName" json:"shortName"` // "A", "M", "Blue"
    Description string    `firestore:"description,omitempty" json:"description,omitempty"`
    Color       string    `firestore:"color,omitempty" json:"color,omitempty"` // For UI display
    Order       int       `firestore:"order" json:"order"`      // Display order
}

type Period struct {
    ID          string    `firestore:"id" json:"id"`
    Name        string    `firestore:"name" json:"name"`        // "Period 1", "Block A", "Homeroom"
    ShortName   string    `firestore:"shortName" json:"shortName"` // "P1", "A", "HR"
    StartTime   string    `firestore:"startTime" json:"startTime"` // "08:00"
    EndTime     string    `firestore:"endTime" json:"endTime"`     // "08:50"
    Duration    int       `firestore:"duration" json:"duration"`   // Minutes
    Order       int       `firestore:"order" json:"order"`
    Type        PeriodType `firestore:"type" json:"type"`
    
    // Which days this period applies to
    ApplicableDays []string `firestore:"applicableDays" json:"applicableDays"` // Day type IDs
}

type PeriodType string
const (
    ClassPeriod   PeriodType = "class"
    Lunch         PeriodType = "lunch"
    Planning      PeriodType = "planning"
    Homeroom      PeriodType = "homeroom"
    Assembly      PeriodType = "assembly"
    Break         PeriodType = "break"
    Advisory      PeriodType = "advisory"
    Study         PeriodType = "study"
    Intervention  PeriodType = "intervention"
)

// 📚 EDUCATOR SCHEDULE & CLASS ASSIGNMENTS
type EducatorSchedule struct {
    ID              string `firestore:"id" json:"id"`
    EducatorID      string `firestore:"educatorId" json:"educatorId"`      // User ID
    EducatorName    string `firestore:"educatorName" json:"educatorName"`  // Cached for performance
    SchoolID        string `firestore:"schoolId" json:"schoolId"`
    DivisionID      string `firestore:"divisionId" json:"divisionId"`
    MasterScheduleID string `firestore:"masterScheduleId" json:"masterScheduleId"`
    
    // Academic Info
    AcademicYear    string `firestore:"academicYear" json:"academicYear"`
    Semester        string `firestore:"semester,omitempty" json:"semester,omitempty"` // "Fall", "Spring", "Full Year"
    
    // Class Assignments
    ClassAssignments []ClassAssignment `firestore:"classAssignments" json:"classAssignments"`
    
    // Schedule Metadata
    TotalPeriods    int     `firestore:"totalPeriods" json:"totalPeriods"`
    TeachingPeriods int     `firestore:"teachingPeriods" json:"teachingPeriods"`
    PlanningPeriods int     `firestore:"planningPeriods" json:"planningPeriods"`
    TeachingLoad    float64 `firestore:"teachingLoad" json:"teachingLoad"` // Percentage
    
    // Effective Dates
    StartDate       time.Time `firestore:"startDate" json:"startDate"`
    EndDate         time.Time `firestore:"endDate" json:"endDate"`
    IsActive        bool      `firestore:"isActive" json:"isActive"`
    
    // System
    CreatedAt       time.Time `firestore:"createdAt" json:"createdAt"`
    UpdatedAt       time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type ClassAssignment struct {
    ID              string   `firestore:"id" json:"id"`
    
    // Class Details
    ClassName       string   `firestore:"className" json:"className"`        // "Algebra I - Period 3"
    CourseID        string   `firestore:"courseId,omitempty" json:"courseId,omitempty"` // Links to course catalog
    CourseName      string   `firestore:"courseName" json:"courseName"`      // "Algebra I"
    CourseCode      string   `firestore:"courseCode,omitempty" json:"courseCode,omitempty"` // "MATH101"
    
    // Academic Details
    Subject         string   `firestore:"subject" json:"subject"`            // "Mathematics"
    Grade           string   `firestore:"grade" json:"grade"`                // "9", "K", "Pre-K"
    GradeLevel      []string `firestore:"gradeLevel" json:"gradeLevel"`      // ["9", "10"] for multi-grade
    
    // Schedule Details
    DayTypes        []string `firestore:"dayTypes" json:"dayTypes"`          // ["A", "B"] or ["Monday", "Wednesday", "Friday"]
    Periods         []string `firestore:"periods" json:"periods"`           // Period IDs from master schedule
    
    // Location
    RoomNumber      string   `firestore:"roomNumber" json:"roomNumber"`      // "201", "Gym", "Library"
    Building        string   `firestore:"building,omitempty" json:"building,omitempty"` // "Main", "Annex"
    Location        string   `firestore:"location,omitempty" json:"location,omitempty"` // Full location description
    
    // Class Info
    StudentCount    int      `firestore:"studentCount,omitempty" json:"studentCount,omitempty"`
    MaxCapacity     int      `firestore:"maxCapacity,omitempty" json:"maxCapacity,omitempty"`
    
    // Co-Teaching & Support
    CoTeachers      []string `firestore:"coTeachers" json:"coTeachers"`      // Additional teacher IDs
    Paraprofessionals []string `firestore:"paraprofessionals" json:"paraprofessionals"` // Support staff IDs
    
    // Special Designations
    IsHonors        bool     `firestore:"isHonors" json:"isHonors"`
    IsAP            bool     `firestore:"isAP" json:"isAP"`
    IsIB            bool     `firestore:"isIB" json:"isIB"`
    IsSpecialEd     bool     `firestore:"isSpecialEd" json:"isSpecialEd"`
    IsESL           bool     `firestore:"isESL" json:"isESL"`
    IsInclusion     bool     `firestore:"isInclusion" json:"isInclusion"`
    
    // Additional Metadata
    Notes           string   `firestore:"notes,omitempty" json:"notes,omitempty"`
    Tags            []string `firestore:"tags" json:"tags"`
    
    // System
    IsActive        bool     `firestore:"isActive" json:"isActive"`
}

// 📊 SCHEDULE UTILITIES FOR OBSERVATIONS
type ScheduleHelper struct {
    // Current class lookup for observations
    GetCurrentClass(educatorId string, dayType string, currentTime time.Time) (*ClassAssignment, error)
    GetUpcomingClass(educatorId string, dayType string, currentTime time.Time) (*ClassAssignment, error)
    GetDaySchedule(educatorId string, dayType string) ([]ClassAssignment, error)
    GetWeekSchedule(educatorId string) (map[string][]ClassAssignment, error)
    
    // Day type resolution
    GetCurrentDayType(schoolId string, date time.Time) (*DayType, error)
    GetDayTypeRotation(schoolId string, startDate time.Time, endDate time.Time) ([]DayType, error)
    
    // Schedule validation
    ValidateSchedule(schedule *EducatorSchedule) ([]string, error) // Returns validation errors
    CheckConflicts(schedule *EducatorSchedule) ([]ScheduleConflict, error)
}

type ScheduleConflict struct {
    Type        string    `json:"type"`        // "room_conflict", "time_conflict", etc.
    Description string    `json:"description"`
    DayType     string    `json:"dayType"`
    Period      string    `json:"period"`
    Classes     []string  `json:"classes"`     // Conflicting class IDs
}

// 🕐 DAILY SCHEDULE TRACKING
type DailySchedule struct {
    ID          string    `firestore:"id" json:"id"`
    SchoolID    string    `firestore:"schoolId" json:"schoolId"`
    Date        time.Time `firestore:"date" json:"date"`
    DayType     string    `firestore:"dayType" json:"dayType"`    // "A", "Monday", etc.
    
    // Schedule Adjustments for this specific day
    ModifiedPeriods []ModifiedPeriod `firestore:"modifiedPeriods" json:"modifiedPeriods"`
    SpecialEvents   []SpecialEvent   `firestore:"specialEvents" json:"specialEvents"`
    
    // Day Status
    IsRegularDay    bool   `firestore:"isRegularDay" json:"isRegularDay"`
    IsHalfDay       bool   `firestore:"isHalfDay" json:"isHalfDay"`
    IsDelayed       bool   `firestore:"isDelayed" json:"isDelayed"`
    IsCancelled     bool   `firestore:"isCancelled" json:"isCancelled"`
    
    Notes           string `firestore:"notes,omitempty" json:"notes,omitempty"`
    
    CreatedAt       time.Time `firestore:"createdAt" json:"createdAt"`
    UpdatedAt       time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type ModifiedPeriod struct {
    PeriodID    string `firestore:"periodId" json:"periodId"`
    StartTime   string `firestore:"startTime" json:"startTime"`
    EndTime     string `firestore:"endTime" json:"endTime"`
    Reason      string `firestore:"reason" json:"reason"`
    IsCancelled bool   `firestore:"isCancelled" json:"isCancelled"`
}

type SpecialEvent struct {
    ID          string    `firestore:"id" json:"id"`
    Name        string    `firestore:"name" json:"name"`
    StartTime   string    `firestore:"startTime" json:"startTime"`
    EndTime     string    `firestore:"endTime" json:"endTime"`
    Type        EventType `firestore:"type" json:"type"`
    AffectedPeriods []string `firestore:"affectedPeriods" json:"affectedPeriods"`
    Location    string    `firestore:"location,omitempty" json:"location,omitempty"`
}

type EventType string
const (
    Assembly    EventType = "assembly"
    Testing     EventType = "testing"
    Drill       EventType = "drill"
    Field_Trip  EventType = "field_trip"
    Guest       EventType = "guest_speaker"
    Performance EventType = "performance"
    Meeting     EventType = "meeting"
)

// Example Department Structure by Division remains the same...
var ExampleDepartments = map[DivisionType][]string{
    Elementary: {
        "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
        "Special Education", "ESL/ELL", "Art & Music", "PE & Health", "Library/Media",
    },
    Middle: {
        "6th Grade", "7th Grade", "8th Grade", "English Language Arts", "Mathematics",
        "Science", "Social Studies", "Special Education", "ESL/ELL", "Arts & Electives", "PE & Health",
    },
    High: {
        "English", "Mathematics", "Science", "Social Studies", "World Languages", "Fine Arts",
        "Career & Technical Education", "Special Education", "ESL/ELL", "PE & Health", "Guidance & Counseling",
    },
    EarlyLearningCenter: {
        "Pre-K 3", "Pre-K 4", "Head Start", "Early Intervention", "Family Services",
    },
    CentralAdmin: {
        "Curriculum & Instruction", "Special Education Services", "Technology", "Human Resources",
        "Finance & Operations", "Communications", "Professional Development", "Student Services",
        "Assessment & Accountability",
    },
}
```

type School struct {
    ID        string    `firestore:"id" json:"id"`
    Name      string    `firestore:"name" json:"name"`
    ShortName string    `firestore:"shortName" json:"shortName"`
    District  string    `firestore:"district,omitempty" json:"district,omitempty"` // Optional district name
    Address   *Address  `firestore:"address" json:"address"`
    ContactInfo *ContactInfo `firestore:"contactInfo" json:"contactInfo"`
    
    // Leadership
    SuperintendentID string   `firestore:"superintendentId,omitempty" json:"superintendentId,omitempty"`
    PrincipalIDs     []string `firestore:"principalIds" json:"principalIds"` // Can have multiple principals
    
    // Applet Configurations
    EnabledApplets []string `firestore:"enabledApplets" json:"enabledApplets"`
    AppletSettings map[string]interface{} `firestore:"appletSettings" json:"appletSettings"`
    
    // Settings
    Settings    map[string]interface{} `firestore:"settings" json:"settings"`
    Timezone    string            `firestore:"timezone" json:"timezone"`
    AcademicYear *AcademicYear    `firestore:"academicYear" json:"academicYear"`
    
    CreatedAt   time.Time         `firestore:"createdAt" json:"createdAt"`
    UpdatedAt   time.Time         `firestore:"updatedAt" json:"updatedAt"`
}

type Division struct {
    ID          string    `firestore:"id" json:"id"`
    SchoolID    string    `firestore:"schoolId" json:"schoolId"`
    Name        string    `firestore:"name" json:"name"`
    Type        DivisionType `firestore:"type" json:"type"`
    Description string    `firestore:"description" json:"description"`
    
    // Leadership
    DirectorID         string   `firestore:"directorId,omitempty" json:"directorId,omitempty"`
    AssistantDirectorIDs []string `firestore:"assistantDirectorIds" json:"assistantDirectorIds"`
    
    // Academic Info
    Grades         []string `firestore:"grades" json:"grades"`
    StudentCount   int      `firestore:"studentCount,omitempty" json:"studentCount,omitempty"`
    
    // Settings
    Settings       map[string]interface{} `firestore:"settings" json:"settings"`
    
    CreatedAt      time.Time `firestore:"createdAt" json:"createdAt"`
    UpdatedAt      time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type DivisionType string
const (
    Elementary          DivisionType = "elementary"
    Middle             DivisionType = "middle" 
    High               DivisionType = "high"
    EarlyLearningCenter DivisionType = "early_learning_center"
    CentralAdmin       DivisionType = "central_admin"
    SpecialPrograms    DivisionType = "special_programs"     // Optional: for special ed, gifted, etc.
    Athletics          DivisionType = "athletics"           // Optional: for athletics department
    FoodService        DivisionType = "food_service"        // Optional: for nutrition services
    Transportation     DivisionType = "transportation"      // Optional: for transportation
    Maintenance        DivisionType = "maintenance"         // Optional: for facilities
)

type Department struct {
    ID          string    `firestore:"id" json:"id"`
    SchoolID    string    `firestore:"schoolId" json:"schoolId"`
    DivisionID  string    `firestore:"divisionId" json:"divisionId"`
    Name        string    `firestore:"name" json:"name"`
    Description string    `firestore:"description" json:"description"`
    
    // Leadership
    HeadID      string    `firestore:"headId" json:"headId"`
    Members     []string  `firestore:"members" json:"members"`
    
    // Academic Info (for academic departments)
    Subjects    []string  `firestore:"subjects" json:"subjects"`
    Grades      []string  `firestore:"grades" json:"grades"`
    
    // Administrative Info (for non-academic departments)
    Function    string    `firestore:"function,omitempty" json:"function,omitempty"`
    
    CreatedAt   time.Time `firestore:"createdAt" json:"createdAt"`
    UpdatedAt   time.Time `firestore:"updatedAt" json:"updatedAt"`
}

// Example Department Structure by Division:
var ExampleDepartments = map[DivisionType][]string{
    Elementary: {
        "Kindergarten",
        "1st Grade",
        "2nd Grade", 
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "Special Education",
        "ESL/ELL",
        "Art & Music",
        "PE & Health",
        "Library/Media",
    },
    Middle: {
        "6th Grade",
        "7th Grade", 
        "8th Grade",
        "English Language Arts",
        "Mathematics",
        "Science",
        "Social Studies",
        "Special Education",
        "ESL/ELL",
        "Arts & Electives",
        "PE & Health",
    },
    High: {
        "English",
        "Mathematics", 
        "Science",
        "Social Studies",
        "World Languages",
        "Fine Arts",
        "Career & Technical Education",
        "Special Education",
        "ESL/ELL",
        "PE & Health",
        "Guidance & Counseling",
    },
    EarlyLearningCenter: {
        "Pre-K 3",
        "Pre-K 4",
        "Head Start",
        "Early Intervention",
        "Family Services",
    },
    CentralAdmin: {
        "Curriculum & Instruction",
        "Special Education Services", 
        "Technology",
        "Human Resources",
        "Finance & Operations",
        "Communications",
        "Professional Development",
        "Student Services",
        "Assessment & Accountability",
    },
}

type UserRole string
const (
    // School Leadership
    Superintendent      UserRole = "superintendent"
    Principal           UserRole = "principal"
    AssistantPrincipal  UserRole = "assistant_principal"
    
    // Division Leadership  
    DivisionDirector    UserRole = "division_director"
    AssistantDirector   UserRole = "assistant_director"
    
    // Department Leadership
    DepartmentHead      UserRole = "department_head"
    GradeChair         UserRole = "grade_chair"
    
    // Teaching Staff
    Teacher             UserRole = "teacher"
    SubstituteTeacher   UserRole = "substitute_teacher"
    SpecialistTeacher   UserRole = "specialist_teacher"
    
    // Instructional Support
    InstructionalCoach  UserRole = "instructional_coach"
    PLCCoach           UserRole = "plc_coach"
    CurriculumCoord    UserRole = "curriculum_coordinator"
    AssessmentCoord    UserRole = "assessment_coordinator"
    
    // Student Support
    Counselor          UserRole = "counselor"
    SocialWorker       UserRole = "social_worker"
    Psychologist       UserRole = "psychologist"
    SpecialEdCoord     UserRole = "special_education_coordinator"
    
    // Specialized Roles
    Observer           UserRole = "observer"
    DEISpecialist      UserRole = "dei_specialist"
    TechCoordinator    UserRole = "technology_coordinator"
    Librarian          UserRole = "librarian"
    
    // Support Staff
    Secretary          UserRole = "secretary"
    Paraprofessional   UserRole = "paraprofessional"
    SupportStaff       UserRole = "support_staff"
    
    // System Administration
    SuperAdmin         UserRole = "super_admin"
    SystemAdmin        UserRole = "system_admin"
)
```
```

### 📋 Observation Applet Data Models
```go
// Generic observation system that works with any framework (CRP, evaluation, etc.)
type Observation struct {
    // Core Identification
    ID        string `firestore:"id" json:"id"`
    SchoolID  string `firestore:"schoolId" json:"schoolId"`
    DivisionID string `firestore:"divisionId" json:"divisionId"`
    DepartmentID string `firestore:"departmentId,omitempty" json:"departmentId,omitempty"`
    
    // Participants
    SubjectID   string `firestore:"subjectId" json:"subjectId"`     // Teacher or person being observed
    SubjectName string `firestore:"subjectName" json:"subjectName"`
    ObserverID  string `firestore:"observerId" json:"observerId"`
    ObserverName string `firestore:"observerName" json:"observerName"`
    
    // Context (flexible for different observation types)
    Context ObservationContext `firestore:"context" json:"context"`
    
    // Framework & Data
    FrameworkID      string               `firestore:"frameworkId" json:"frameworkId"`
    FrameworkName    string               `firestore:"frameworkName" json:"frameworkName"` // Cached for reporting
    FrameworkVersion string               `firestore:"frameworkVersion" json:"frameworkVersion"`
    Responses        []ObservationResponse `firestore:"responses" json:"responses"`
    OverallComments  string               `firestore:"overallComments" json:"overallComments"`
    
    // Analysis (calculated based on framework)
    EvidenceCount    int             `firestore:"evidenceCount" json:"evidenceCount"`
    TotalQuestions   int             `firestore:"totalQuestions" json:"totalQuestions"`
    EvidencePercentage float64       `firestore:"evidencePercentage" json:"evidencePercentage"`
    FrameworkScores  []FrameworkScore `firestore:"frameworkScores" json:"frameworkScores"`
    
    // Media & Evidence (Firebase Storage URLs)
    Attachments []MediaFile   `firestore:"attachments" json:"attachments"`
    Location    *GeoLocation  `firestore:"location,omitempty" json:"location,omitempty"`
    
    // Status & Workflow
    Status        string     `firestore:"status" json:"status"` // draft, completed, submitted, reviewed
    SubmittedAt   *time.Time `firestore:"submittedAt,omitempty" json:"submittedAt,omitempty"`
    ReviewedAt    *time.Time `firestore:"reviewedAt,omitempty" json:"reviewedAt,omitempty"`
    
    // Follow-up
    FollowUpRequired  bool       `firestore:"followUpRequired" json:"followUpRequired"`
    FollowUpCompleted bool       `firestore:"followUpCompleted" json:"followUpCompleted"`
    FollowUpNotes     string     `firestore:"followUpNotes,omitempty" json:"followUpNotes,omitempty"`
    
    // System
    CreatedAt time.Time              `firestore:"createdAt" json:"createdAt"`
    UpdatedAt time.Time              `firestore:"updatedAt" json:"updatedAt"`
    Version   int                    `firestore:"version" json:"version"`
    Metadata  map[string]interface{} `firestore:"metadata" json:"metadata"`
}

// Flexible context that works for classroom observations, evaluations, etc.
type ObservationContext struct {
    Type        string            `firestore:"type" json:"type"` // classroom, meeting, evaluation, etc.
    
    // For classroom observations
    ClassName    string `firestore:"className,omitempty" json:"className,omitempty"`
    Subject      string `firestore:"subject,omitempty" json:"subject,omitempty"`
    Grade        string `firestore:"grade,omitempty" json:"grade,omitempty"`
    Room         string `firestore:"room,omitempty" json:"room,omitempty"`
    Period       string `firestore:"period,omitempty" json:"period,omitempty"`
    StudentCount int    `firestore:"studentCount,omitempty" json:"studentCount,omitempty"`
    LessonPhase  string `firestore:"lessonPhase,omitempty" json:"lessonPhase,omitempty"`
    
    // For evaluations or other observation types
    Position     string `firestore:"position,omitempty" json:"position,omitempty"`
    Division     string `firestore:"division,omitempty" json:"division,omitempty"`
    Department   string `firestore:"department,omitempty" json:"department,omitempty"`
    
    // Timing
    Date        time.Time  `firestore:"date" json:"date"`
    StartTime   time.Time  `firestore:"startTime" json:"startTime"`
    EndTime     *time.Time `firestore:"endTime,omitempty" json:"endTime,omitempty"`
    Duration    int        `firestore:"duration" json:"duration"` // minutes
}

// Generic framework system (works for CRP, evaluation rubrics, etc.)
type Framework struct {
    ID          string `firestore:"id" json:"id"`
    Name        string `firestore:"name" json:"name"`
    Description string `firestore:"description" json:"description"`
    Type        string `firestore:"type" json:"type"` // observation, evaluation, assessment, etc.
    Version     string `firestore:"version" json:"version"`
    Status      string `firestore:"status" json:"status"` // active, draft, archived, deprecated
    
    // School & Access
    SchoolID     string     `firestore:"schoolId" json:"schoolId"`
    CreatedBy    string     `firestore:"createdBy" json:"createdBy"`
    ApprovedBy   string     `firestore:"approvedBy,omitempty" json:"approvedBy,omitempty"`
    ApprovedAt   *time.Time `firestore:"approvedAt,omitempty" json:"approvedAt,omitempty"`
    
    // Applicable Divisions (framework can be used across divisions)
    ApplicableDivisions []DivisionType `firestore:"applicableDivisions" json:"applicableDivisions"`
    
    // Framework Structure
    Sections           []FrameworkSection `firestore:"sections" json:"sections"`
    TotalQuestions     int                `firestore:"totalQuestions" json:"totalQuestions"`
    RequiredQuestions  int                `firestore:"requiredQuestions" json:"requiredQuestions"`
    EstimatedDuration  int                `firestore:"estimatedDuration" json:"estimatedDuration"`
    
    // Alignment Mappings (flexible for any framework type)
    Alignments []FrameworkAlignment `firestore:"alignments" json:"alignments"`
    Tags       []string             `firestore:"tags" json:"tags"`
    Categories []string             `firestore:"categories" json:"categories"`
    
    // Usage & Analytics
    UsageCount           int     `firestore:"usageCount" json:"usageCount"`
    LastUsed             *time.Time `firestore:"lastUsed,omitempty" json:"lastUsed,omitempty"`
    AverageCompletionTime int     `firestore:"averageCompletionTime" json:"averageCompletionTime"`
    AverageEvidenceScore float64 `firestore:"averageEvidenceScore" json:"averageEvidenceScore"`
    
    // System
    CreatedAt time.Time              `firestore:"createdAt" json:"createdAt"`
    UpdatedAt time.Time              `firestore:"updatedAt" json:"updatedAt"`
    Metadata  map[string]interface{} `firestore:"metadata" json:"metadata"`
}

type ObservationResponse struct {
    QuestionID          string    `firestore:"questionId" json:"questionId"`
    QuestionText        string    `firestore:"questionText" json:"questionText"` // Cached for reporting
    Rating              string    `firestore:"rating" json:"rating"` // "1", "2", "3", "4", "not-observed", or custom scale
    RatingText          string    `firestore:"ratingText" json:"ratingText"`
    Comments            string    `firestore:"comments" json:"comments"`
    Evidence            []string  `firestore:"evidence" json:"evidence"`
    Tags                []string  `firestore:"tags" json:"tags"`
    FrameworkAlignments []string  `firestore:"frameworkAlignments" json:"frameworkAlignments"`
    Confidence          string    `firestore:"confidence" json:"confidence"` // low, medium, high
    Timestamp           time.Time `firestore:"timestamp" json:"timestamp"`
}

type Question struct {
    ID          string `firestore:"id" json:"id"`
    SectionID   string `firestore:"sectionId" json:"sectionId"`
    Text        string `firestore:"text" json:"text"`
    Description string `firestore:"description,omitempty" json:"description,omitempty"`
    HelpText    string `firestore:"helpText" json:"helpText"`
    Examples    []string `firestore:"examples" json:"examples"`
    
    // Configuration
    Type       string  `firestore:"type" json:"type"` // rating, text, multiselect, etc.
    IsRequired bool    `firestore:"isRequired" json:"isRequired"`
    Weight     float64 `firestore:"weight" json:"weight"`
    Order      int     `firestore:"order" json:"order"`
    
    // Rating Scale (for rating type)
    Scale *RatingScale `firestore:"scale,omitempty" json:"scale,omitempty"`
    
    // Framework Alignments (flexible for any framework)
    FrameworkAlignments []FrameworkAlignment `firestore:"frameworkAlignments" json:"frameworkAlignments"`
    
    // Categorization
    Tags         []string `firestore:"tags" json:"tags"`
    Categories   []string `firestore:"categories" json:"categories"`
    Difficulty   string   `firestore:"difficulty" json:"difficulty"`
    
    // Evidence Requirements
    EvidenceRequired  bool     `firestore:"evidenceRequired" json:"evidenceRequired"`
    EvidenceTypes     []string `firestore:"evidenceTypes" json:"evidenceTypes"`
    MinEvidenceCount  int      `firestore:"minEvidenceCount,omitempty" json:"minEvidenceCount,omitempty"`
}

// Framework alignments - configurable per school/framework type
type FrameworkAlignment struct {
    ID          string `firestore:"id" json:"id"`
    Name        string `firestore:"name" json:"name"`
    Category    string `firestore:"category" json:"category"`
    Subcategory string `firestore:"subcategory,omitempty" json:"subcategory,omitempty"`
    Description string `firestore:"description" json:"description"`
    Color       string `firestore:"color" json:"color"`
    Icon        string `firestore:"icon,omitempty" json:"icon,omitempty"`
    Weight      float64 `firestore:"weight,omitempty" json:"weight,omitempty"`
    
    // Which framework types this alignment applies to
    ApplicableTypes []string `firestore:"applicableTypes" json:"applicableTypes"`
    
    // Which divisions this alignment is relevant for
    ApplicableDivisions []DivisionType `firestore:"applicableDivisions" json:"applicableDivisions"`
}

// CRP Framework Alignments - Now division-aware
var CRPFrameworkAlignments = map[string]FrameworkAlignment{
    "crp_general": {
        ID: "crp_general", 
        Name: "CRP (General)", 
        Color: "green", 
        Category: "Culturally Responsive Practices",
        ApplicableTypes: []string{"observation", "evaluation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High, EarlyLearningCenter},
    },
    "crp_curriculum": {
        ID: "crp_curriculum", 
        Name: "CRP (Curriculum Relevance)", 
        Color: "green", 
        Category: "Culturally Responsive Practices",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High},
    },
    "crp_high_expectations": {
        ID: "crp_high_expectations", 
        Name: "CRP (High Expectations)", 
        Color: "green", 
        Category: "Culturally Responsive Practices",
        ApplicableTypes: []string{"observation", "evaluation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High, EarlyLearningCenter},
    },
    "crp_learning_partnerships": {
        ID: "crp_learning_partnerships", 
        Name: "CRP (Learning Partnerships)", 
        Color: "green", 
        Category: "Culturally Responsive Practices",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High},
    },
    "casel_self_awareness": {
        ID: "casel_self_awareness", 
        Name: "CASEL (Self-Awareness)", 
        Color: "pink", 
        Category: "Social-Emotional Learning",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High, EarlyLearningCenter},
    },
    "casel_social_awareness": {
        ID: "casel_social_awareness", 
        Name: "CASEL (Social Awareness)", 
        Color: "pink", 
        Category: "Social-Emotional Learning",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High},
    },
    "casel_relationship_skills": {
        ID: "casel_relationship_skills", 
        Name: "CASEL (Relationship Skills)", 
        Color: "pink", 
        Category: "Social-Emotional Learning",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High, EarlyLearningCenter},
    },
    "tripod_care": {
        ID: "tripod_care", 
        Name: "Tripod: Care", 
        Color: "blue", 
        Category: "7Cs of Learning",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High},
    },
    "tripod_challenge": {
        ID: "tripod_challenge", 
        Name: "Tripod: Challenge", 
        Color: "blue", 
        Category: "7Cs of Learning",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Middle, High}, // More relevant for older students
    },
    "five_daily_assessment": {
        ID: "five_daily_assessment", 
        Name: "5 Daily Assessment Practices", 
        Color: "yellow", 
        Category: "Assessment",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High},
    },
    "panorama_student_exp": {
        ID: "panorama_student_exp", 
        Name: "Panorama (Student Experience)", 
        Color: "purple", 
        Category: "Student Experience",
        ApplicableTypes: []string{"observation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High},
    },
    "inclusive_practices": {
        ID: "inclusive_practices", 
        Name: "Inclusive Practices", 
        Color: "indigo", 
        Category: "Inclusion & Equity",
        ApplicableTypes: []string{"observation", "evaluation"},
        ApplicableDivisions: []DivisionType{Elementary, Middle, High, EarlyLearningCenter},
    },
}
```
```
```

### Professional Learning & Evaluation Applets
```go
type ProfessionalLearning struct {
    ID             string `firestore:"id" json:"id"`
    UserID         string `firestore:"userId" json:"userId"`
    OrganizationID string `firestore:"organizationId" json:"organizationId"`
    
    // Learning Details
    Title       string `firestore:"title" json:"title"`
    Description string `firestore:"description" json:"description"`
    Type        string `firestore:"type" json:"type"` // course, workshop, conference, webinar, self_study, mentoring, plc
    Category    string `firestore:"category" json:"category"`
    Subject     string `firestore:"subject,omitempty" json:"subject,omitempty"`
    Provider    string `firestore:"provider" json:"provider"`
    Facilitator string `firestore:"facilitator,omitempty" json:"facilitator,omitempty"`
    
    // Scheduling
    StartDate        time.Time `firestore:"startDate" json:"startDate"`
    EndDate          *time.Time `firestore:"endDate,omitempty" json:"endDate,omitempty"`
    Duration         float64   `firestore:"duration" json:"duration"` // hours
    Location         string    `firestore:"location" json:"location"` // or "virtual"
    MaxParticipants  int       `firestore:"maxParticipants,omitempty" json:"maxParticipants,omitempty"`
    
    // Requirements & Prerequisites
    IsRequired    bool       `firestore:"isRequired" json:"isRequired"`
    RequiredBy    *time.Time `firestore:"requiredBy,omitempty" json:"requiredBy,omitempty"`
    Prerequisites []string   `firestore:"prerequisites" json:"prerequisites"`
    TargetAudience []UserRole `firestore:"targetAudience" json:"targetAudience"`
    
    // Content & Resources
    Objectives []string    `firestore:"objectives" json:"objectives"`
    Outcomes   []string    `firestore:"outcomes" json:"outcomes"`
    Resources  []Resource  `firestore:"resources" json:"resources"`
    Materials  []Material  `firestore:"materials" json:"materials"`
    
    // Progress & Completion
    Status          string     `firestore:"status" json:"status"` // enrolled, in_progress, completed, withdrawn, failed
    Progress        float64    `firestore:"progress" json:"progress"` // percentage
    CompletedModules []string   `firestore:"completedModules" json:"completedModules"`
    TimeSpent       float64    `firestore:"timeSpent" json:"timeSpent"` // hours
    LastAccessed    *time.Time `firestore:"lastAccessed,omitempty" json:"lastAccessed,omitempty"`
    
    // Certification
    CertificateEarned bool       `firestore:"certificateEarned" json:"certificateEarned"`
    CertificateID     string     `firestore:"certificateId,omitempty" json:"certificateId,omitempty"`
    CertificateURL    string     `firestore:"certificateUrl,omitempty" json:"certificateUrl,omitempty"` // Firebase Storage URL
    CEUCredits        float64    `firestore:"ceuCredits" json:"ceuCredits"`
    ExpirationDate    *time.Time `firestore:"expirationDate,omitempty" json:"expirationDate,omitempty"`
    
    // System
    CreatedAt time.Time              `firestore:"createdAt" json:"createdAt"`
    UpdatedAt time.Time              `firestore:"updatedAt" json:"updatedAt"`
    Metadata  map[string]interface{} `firestore:"metadata" json:"metadata"`
}

type PerformanceEvaluation struct {
    ID           string `firestore:"id" json:"id"`
    EmployeeID   string `firestore:"employeeId" json:"employeeId"`
    EvaluatorID  string `firestore:"evaluatorId" json:"evaluatorId"`
    OrganizationID string `firestore:"organizationId" json:"organizationId"`
    
    // Evaluation Context
    EvaluationType string          `firestore:"evaluationType" json:"evaluationType"` // annual, mid_year, probationary, improvement_plan, informal
    EvaluationPeriod *EvaluationPeriod `firestore:"evaluationPeriod" json:"evaluationPeriod"`
    Position       string          `firestore:"position" json:"position"`
    YearsInPosition int            `firestore:"yearsInPosition" json:"yearsInPosition"`
    
    // Framework & Standards
    EvaluationFrameworkID string               `firestore:"evaluationFrameworkId" json:"evaluationFrameworkId"`
    Standards            []EvaluationStandard `firestore:"standards" json:"standards"`
    Domains              []EvaluationDomain   `firestore:"domains" json:"domains"`
    
    // Data Sources
    Observations []string        `firestore:"observations" json:"observations"` // observation IDs
    Artifacts    []Artifact      `firestore:"artifacts" json:"artifacts"`
    StudentData  []StudentDataPoint `firestore:"studentData" json:"studentData"`
    SelfAssessment *SelfAssessment `firestore:"selfAssessment,omitempty" json:"selfAssessment,omitempty"`
    GoalProgress []GoalProgress  `firestore:"goalProgress" json:"goalProgress"`
    
    // Ratings & Scores
    OverallRating  string         `firestore:"overallRating" json:"overallRating"` // ineffective, developing, effective, highly_effective
    DomainRatings  []DomainRating `firestore:"domainRatings" json:"domainRatings"`
    StandardRatings []StandardRating `firestore:"standardRatings" json:"standardRatings"`
    FinalScore     float64        `firestore:"finalScore" json:"finalScore"`
    
    // Narrative & Feedback
    Strengths         []string `firestore:"strengths" json:"strengths"`
    AreasForGrowth    []string `firestore:"areasForGrowth" json:"areasForGrowth"`
    Commendations     string   `firestore:"commendations" json:"commendations"`
    Recommendations   []string `firestore:"recommendations" json:"recommendations"`
    EvaluatorComments string   `firestore:"evaluatorComments" json:"evaluatorComments"`
    EmployeeResponse  string   `firestore:"employeeResponse,omitempty" json:"employeeResponse,omitempty"`
    
    // Goals & Development
    PreviousGoals []Goal           `firestore:"previousGoals" json:"previousGoals"`
    GoalAttainment []GoalAttainment `firestore:"goalAttainment" json:"goalAttainment"`
    NewGoals      []Goal           `firestore:"newGoals" json:"newGoals"`
    ProfessionalDevelopmentPlan *ProfessionalDevelopmentPlan `firestore:"professionalDevelopmentPlan,omitempty" json:"professionalDevelopmentPlan,omitempty"`
    
    // Process & Timeline
    Status        string     `firestore:"status" json:"status"` // draft, in_progress, pending_signature, completed, appealed
    StartDate     time.Time  `firestore:"startDate" json:"startDate"`
    DueDate       time.Time  `firestore:"dueDate" json:"dueDate"`
    CompletedDate *time.Time `firestore:"completedDate,omitempty" json:"completedDate,omitempty"`
    Signatures    []EvaluationSignature `firestore:"signatures" json:"signatures"`
    
    // System & Compliance
    CreatedAt           time.Time              `firestore:"createdAt" json:"createdAt"`
    UpdatedAt           time.Time              `firestore:"updatedAt" json:"updatedAt"`
    RetentionDate       time.Time              `firestore:"retentionDate" json:"retentionDate"`
    ConfidentialityLevel string                `firestore:"confidentialityLevel" json:"confidentialityLevel"` // standard, sensitive, restricted
    Metadata            map[string]interface{} `firestore:"metadata" json:"metadata"`
}

type Goal struct {
    ID     string `firestore:"id" json:"id"`
    UserID string `firestore:"userId" json:"userId"`
    
    // Goal Details
    Title       string `firestore:"title" json:"title"`
    Description string `firestore:"description" json:"description"`
    Type        string `firestore:"type" json:"type"` // professional, student_outcome, personal, school, district
    Category    string `firestore:"category" json:"category"`
    Priority    string `firestore:"priority" json:"priority"` // low, medium, high, critical
    
    // SMART Goal Components
    Specific   string `firestore:"specific" json:"specific"`
    Measurable string `firestore:"measurable" json:"measurable"`
    Achievable string `firestore:"achievable" json:"achievable"`
    Relevant   string `firestore:"relevant" json:"relevant"`
    TimeBound  string `firestore:"timeBound" json:"timeBound"`
    
    // Timeline
    StartDate  time.Time   `firestore:"startDate" json:"startDate"`
    TargetDate time.Time   `firestore:"targetDate" json:"targetDate"`
    Milestones []Milestone `firestore:"milestones" json:"milestones"`
    
    // Progress Tracking
    Status      string     `firestore:"status" json:"status"` // not_started, in_progress, completed, deferred, abandoned
    Progress    float64    `firestore:"progress" json:"progress"` // percentage
    LastUpdated time.Time  `firestore:"lastUpdated" json:"lastUpdated"`
    
    // Resources & Support
    Resources     []Resource `firestore:"resources" json:"resources"`
    SupportNeeded []string   `firestore:"supportNeeded" json:"supportNeeded"`
    MentorID      string     `firestore:"mentorId,omitempty" json:"mentorId,omitempty"`
    Collaborators []string   `firestore:"collaborators" json:"collaborators"`
    
    // System
    CreatedAt time.Time `firestore:"createdAt" json:"createdAt"`
    UpdatedAt time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type Request struct {
    ID           string `firestore:"id" json:"id"`
    RequesterID  string `firestore:"requesterId" json:"requesterId"`
    AssigneeID   string `firestore:"assigneeId,omitempty" json:"assigneeId,omitempty"`
    OrganizationID string `firestore:"organizationId" json:"organizationId"`
    
    // Request Details
    Type        string `firestore:"type" json:"type"` // time_off, professional_development, resource, support, transfer, accommodation, reimbursement
    Title       string `firestore:"title" json:"title"`
    Description string `firestore:"description" json:"description"`
    Reason      string `firestore:"reason" json:"reason"`
    Priority    string `firestore:"priority" json:"priority"` // low, medium, high, urgent
    
    // Approval Workflow
    Status          string        `firestore:"status" json:"status"` // draft, submitted, under_review, approved, denied, cancelled, completed
    ApprovalChain   []ApprovalStep `firestore:"approvalChain" json:"approvalChain"`
    CurrentApprover string        `firestore:"currentApprover,omitempty" json:"currentApprover,omitempty"`
    FinalApprover   string        `firestore:"finalApprover,omitempty" json:"finalApprover,omitempty"`
    
    // Timeline
    RequestedDate time.Time  `firestore:"requestedDate" json:"requestedDate"`
    SubmittedDate *time.Time `firestore:"submittedDate,omitempty" json:"submittedDate,omitempty"`
    NeededByDate  *time.Time `firestore:"neededByDate,omitempty" json:"neededByDate,omitempty"`
    ApprovedDate  *time.Time `firestore:"approvedDate,omitempty" json:"approvedDate,omitempty"`
    CompletedDate *time.Time `firestore:"completedDate,omitempty" json:"completedDate,omitempty"`
    
    // Documentation
    Attachments       []Attachment       `firestore:"attachments" json:"attachments"`
    ApprovalComments  []ApprovalComment  `firestore:"approvalComments" json:"approvalComments"`
    DenialReason      string             `firestore:"denialReason,omitempty" json:"denialReason,omitempty"`
    
    // System
    CreatedAt time.Time              `firestore:"createdAt" json:"createdAt"`
    UpdatedAt time.Time              `firestore:"updatedAt" json:"updatedAt"`
    Metadata  map[string]interface{} `firestore:"metadata" json:"metadata"`
}
```

## Firestore Collections Structure

### 🏢 Core Platform Collections
```
// User and school management
/users/{userId}
/user_profiles/{userId}
/user_preferences/{userId}

// School hierarchy: School → Divisions → Departments
/schools/{schoolId}
/divisions/{divisionId}
/departments/{deptId}

// 📅 SCHEDULE SYSTEM COLLECTIONS
/master_schedules/{scheduleId}
/educator_schedules/{educatorScheduleId}
/daily_schedules/{dailyScheduleId}        // Day-specific overrides and events
/class_assignments/{classAssignmentId}    // Individual class details

// System-wide settings and configurations
/system_settings/{settingId}
/applet_configs/{appletId}
/audit_logs/{logId}
/error_logs/{errorId}

// Global communication
/notifications/{notificationId}
/announcements/{announcementId}
```

### 📋 Observation Applet Collections
```
// Framework management (any type: CRP, evaluation, etc.)
/applets/observations/frameworks/{frameworkId}
/applets/observations/framework_sections/{sectionId}
/applets/observations/questions/{questionId}
/applets/observations/framework_alignments/{alignmentId}

// Observation data (now integrated with schedules)
/applets/observations/observations/{observationId}
/applets/observations/observation_responses/{responseId}

// Analytics specific to observations
/applets/observations/analytics/{analyticsId}
/applets/observations/reports/{reportId}
/applets/observations/metrics/{metricId}

// Import/Export for observation data
/applets/observations/imports/{importId}
/applets/observations/exports/{exportId}
```

### 📅 Schedule Data Examples
```
// Example Master Schedule Document
/master_schedules/2024-2025-main {
  id: "2024-2025-main",
  schoolId: "westfield-high",
  name: "2024-2025 Master Schedule",
  scheduleType: "rotating",
  dayTypes: [
    {id: "day-a", name: "Day A", shortName: "A", color: "blue"},
    {id: "day-b", name: "Day B", shortName: "B", color: "red"},
    {id: "day-c", name: "Day C", shortName: "C", color: "green"},
    {id: "day-d", name: "Day D", shortName: "D", color: "orange"}
  ],
  periods: [
    {id: "period-1", name: "Period 1", startTime: "08:00", endTime: "08:50", type: "class"},
    {id: "homeroom", name: "Homeroom", startTime: "08:55", endTime: "09:10", type: "homeroom"},
    {id: "period-2", name: "Period 2", startTime: "09:15", endTime: "10:05", type: "class"},
    // ... more periods
  ]
}

// Example Educator Schedule Document
/educator_schedules/teacher-smith-2024 {
  id: "teacher-smith-2024",
  educatorId: "user-smith",
  educatorName: "Sarah Smith",
  masterScheduleId: "2024-2025-main",
  classAssignments: [
    {
      id: "algebra1-p1",
      className: "Algebra I - Period 1",
      courseName: "Algebra I",
      subject: "Mathematics",
      grade: "9",
      dayTypes: ["day-a", "day-b", "day-c", "day-d"],
      periods: ["period-1"],
      roomNumber: "201",
      studentCount: 24
    },
    {
      id: "geometry-p3",
      className: "Geometry - Period 3", 
      courseName: "Geometry",
      subject: "Mathematics",
      grade: "10",
      dayTypes: ["day-a", "day-c"],  // Only meets on Day A and Day C
      periods: ["period-3"],
      roomNumber: "201",
      studentCount: 28
    }
    // ... more class assignments
  ]
}

// Example Daily Schedule Document (for schedule overrides)
/daily_schedules/westfield-2024-03-15 {
  id: "westfield-2024-03-15",
  schoolId: "westfield-high", 
  date: "2024-03-15T00:00:00Z",
  dayType: "day-a",
  isHalfDay: true,
  modifiedPeriods: [
    {periodId: "period-1", startTime: "08:00", endTime: "08:30", reason: "Half day schedule"},
    {periodId: "period-2", startTime: "08:35", endTime: "09:05", reason: "Half day schedule"}
  ],
  specialEvents: [
    {
      name: "Fire Drill",
      startTime: "10:15",
      endTime: "10:30", 
      type: "drill",
      affectedPeriods: ["period-4"]
    }
  ]
}
```

### 🔮 Future Applet Collections (Examples)
```
// Professional Learning Applet
/applets/learning/activities/{activityId}
/applets/learning/paths/{pathId}
/applets/learning/progress/{progressId}
/applets/learning/certifications/{certificationId}

// Evaluation Applet
/applets/evaluations/frameworks/{frameworkId}
/applets/evaluations/evaluations/{evaluationId}
/applets/evaluations/improvement_plans/{planId}

// Goal Management Applet
/applets/goals/goals/{goalId}
/applets/goals/milestones/{milestoneId}
/applets/goals/progress_tracking/{trackingId}
```

## Firebase Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function getSchoolId() {
      return request.auth.token.schoolId;
    }
    
    function getDivisionId() {
      return request.auth.token.divisionId;
    }
    
    function isCoreAdmin() {
      return getUserRole() in ['super_admin', 'system_admin', 'superintendent', 'principal'];
    }
    
    function isDivisionLeader() {
      return getUserRole() in ['division_director', 'assistant_director', 'principal', 'assistant_principal'];
    }
    
    function canObserve() {
      return getUserRole() in ['observer', 'principal', 'assistant_principal', 'division_director',
                              'instructional_coach', 'plc_coach', 'dei_specialist', 'department_head'];
    }
    
    function canManageFrameworks() {
      return getUserRole() in ['super_admin', 'superintendent', 'principal', 'division_director',
                              'curriculum_coordinator', 'instructional_coach', 'plc_coach'];
    }
    
    function isInSameSchool(schoolId) {
      return getSchoolId() == schoolId || isCoreAdmin();
    }
    
    function isInSameDivision(divisionId) {
      return getDivisionId() == divisionId || isCoreAdmin() || isDivisionLeader();
    }

    // 🏢 CORE PLATFORM RULES
    
    // User data access
    match /users/{userId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == userId || isCoreAdmin());
      allow write: if isAuthenticated() && 
        (request.auth.uid == userId || isCoreAdmin());
    }
    
    // School data
    match /schools/{schoolId} {
      allow read: if isAuthenticated() && isInSameSchool(schoolId);
      allow write: if isAuthenticated() && 
        (getUserRole() in ['super_admin', 'superintendent', 'principal']);
    }
    
    // Division data
    match /divisions/{divisionId} {
      allow read: if isAuthenticated() && isInSameSchool(resource.data.schoolId);
      allow write: if isAuthenticated() && 
        (isCoreAdmin() || 
         (isDivisionLeader() && isInSameDivision(divisionId)));
    }
    
    // Department data
    match /departments/{deptId} {
      allow read: if isAuthenticated() && isInSameSchool(resource.data.schoolId);
      allow write: if isAuthenticated() && 
        (isCoreAdmin() || 
         isDivisionLeader() || 
         (getUserRole() == 'department_head' && resource.data.headId == request.auth.uid));
    }
    
    // System settings (admin only)
    match /system_settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && getUserRole() == 'super_admin';
    }
    
    match /applet_configs/{appletId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isCoreAdmin();
    }

    // 📋 OBSERVATION APPLET RULES
    
    // Observation frameworks
    match /applets/observations/frameworks/{frameworkId} {
      allow read: if isAuthenticated() && isInSameSchool(resource.data.schoolId);
      allow write: if isAuthenticated() && canManageFrameworks() && 
        isInSameSchool(resource.data.schoolId);
    }
    
    match /applets/observations/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && canManageFrameworks();
    }
    
    // Individual observations
    match /applets/observations/observations/{observationId} {
      allow create: if isAuthenticated() && canObserve();
      allow read: if isAuthenticated() && (
        resource.data.observerId == request.auth.uid ||
        resource.data.subjectId == request.auth.uid ||
        isCoreAdmin() ||
        isInSameSchool(resource.data.schoolId) ||
        (isDivisionLeader() && isInSameDivision(resource.data.divisionId))
      );
      allow update: if isAuthenticated() && (
        resource.data.observerId == request.auth.uid ||
        isCoreAdmin() ||
        (isDivisionLeader() && isInSameDivision(resource.data.divisionId))
      );
      allow delete: if isAuthenticated() && 
        (isCoreAdmin() || 
         (resource.data.observerId == request.auth.uid && resource.data.status == 'draft'));
    }
    
    // Observation analytics (read-only for most users)
    match /applets/observations/analytics/{analyticsId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isCoreAdmin();
    }
    
    // 🔮 FUTURE APPLET RULES (Examples)
    
    // Professional Learning Applet
    match /applets/learning/{document=**} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && (
        request.auth.uid == resource.data.userId ||
        isCoreAdmin()
      );
    }
    
    // Evaluation Applet  
    match /applets/evaluations/evaluations/{evaluationId} {
      allow read: if isAuthenticated() && (
        resource.data.employeeId == request.auth.uid ||
        resource.data.evaluatorId == request.auth.uid ||
        isCoreAdmin() ||
        isInSameSchool(resource.data.schoolId)
      );
      allow write: if isAuthenticated() && (
        resource.data.evaluatorId == request.auth.uid ||
        isCoreAdmin()
      );
    }
    
    // Global notifications
    match /notifications/{notificationId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
    
    // Audit logs (admin read-only)
    match /audit_logs/{logId} {
      allow read: if isAuthenticated() && isCoreAdmin();
      allow write: if false; // Only written by server-side functions
    }
  }
}
```

## Go Cloud Functions with Firebase

### 🏢 Core Platform Functions
```go
// functions/core/schedules/main.go
package main

import (
    "context"
    "log"
    "net/http"
    "time"

    firebase "firebase.google.com/go/v4"
    "github.com/GoogleCloudPlatform/functions-framework-go/functions"
    "github.com/gin-gonic/gin"
)

func init() {
    functions.HTTP("scheduleAPI", handleScheduleAPI)
}

func handleScheduleAPI(w http.ResponseWriter, r *http.Request) {
    gin.SetMode(gin.ReleaseMode)
    router := setupScheduleRouter()
    router.ServeHTTP(w, r)
}

func setupScheduleRouter() *gin.Engine {
    router := gin.New()
    
    api := router.Group("/api/v1/schedules")
    api.Use(authMiddleware())
    {
        // Current class lookup for observations
        api.POST("/current-class", getCurrentClass)
        api.POST("/day-schedule", getDaySchedule)
        api.POST("/week-schedule", getWeekSchedule)
        api.POST("/current-day-type", getCurrentDayType)
        api.POST("/available-teachers", getAvailableTeachers)
        
        // Schedule validation and conflicts
        api.POST("/validate-schedule", validateSchedule)
        api.POST("/check-conflicts", checkScheduleConflicts)
        
        // Schedule management
        api.GET("/master-schedules", listMasterSchedules)
        api.POST("/master-schedules", createMasterSchedule)
        api.GET("/educator-schedules", listEducatorSchedules)
        api.POST("/educator-schedules", createEducatorSchedule)
    }
    
    return router
}

// Get current class for a teacher (critical for observation auto-population)
func getCurrentClass(c *gin.Context) {
    var req struct {
        EducatorID string    `json:"educatorId"`
        Date       time.Time `json:"date"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Get educator's schedule
    schedule, err := scheduleService.GetEducatorSchedule(req.EducatorID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
        return
    }
    
    // Determine current day type
    dayType, err := scheduleService.GetDayTypeForDate(schedule.SchoolID, req.Date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not determine day type"})
        return
    }
    
    // Find current period
    currentTime := req.Date.Format("15:04")
    currentPeriod, err := scheduleService.GetCurrentPeriod(schedule.SchoolID, currentTime)
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "message": "No current period",
            "dayType": dayType.Name,
            "currentTime": currentTime
        })
        return
    }
    
    // Find class assignment for current period and day type
    var currentClass *ClassAssignment
    for _, assignment := range schedule.ClassAssignments {
        if contains(assignment.DayTypes, dayType.ID) && contains(assignment.Periods, currentPeriod.ID) {
            currentClass = &assignment
            break
        }
    }
    
    if currentClass == nil {
        c.JSON(http.StatusOK, gin.H{
            "message": "No class scheduled",
            "dayType": dayType.Name,
            "period": currentPeriod.Name,
            "currentTime": currentTime
        })
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "currentClass": currentClass,
        "dayType": dayType,
        "period": currentPeriod,
        "currentTime": currentTime,
        "educator": gin.H{
            "id": schedule.EducatorID,
            "name": schedule.EducatorName
        }
    })
}

// Get full day schedule for a teacher
func getDaySchedule(c *gin.Context) {
    var req struct {
        EducatorID string    `json:"educatorId"`
        Date       time.Time `json:"date"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    schedule, err := scheduleService.GetEducatorSchedule(req.EducatorID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
        return
    }
    
    dayType, err := scheduleService.GetDayTypeForDate(schedule.SchoolID, req.Date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not determine day type"})
        return
    }
    
    // Get all periods for the day
    periods, err := scheduleService.GetPeriodsForDay(schedule.SchoolID, dayType.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get periods"})
        return
    }
    
    // Build day schedule
    var daySchedule []gin.H
    for _, period := range periods {
        entry := gin.H{
            "period": period,
            "class": nil,
            "type": period.Type,
        }
        
        // Find class assignment for this period
        for _, assignment := range schedule.ClassAssignments {
            if contains(assignment.DayTypes, dayType.ID) && contains(assignment.Periods, period.ID) {
                entry["class"] = assignment
                break
            }
        }
        
        daySchedule = append(daySchedule, entry)
    }
    
    c.JSON(http.StatusOK, gin.H{
        "daySchedule": daySchedule,
        "dayType": dayType,
        "date": req.Date.Format("2006-01-02"),
        "educator": gin.H{
            "id": schedule.EducatorID,
            "name": schedule.EducatorName
        }
    })
}

// Get available teachers at a specific time (for observation scheduling)
func getAvailableTeachers(c *gin.Context) {
    var req struct {
        SchoolID string    `json:"schoolId"`
        Date     time.Time `json:"date"`
        Period   string    `json:"period,omitempty"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Get all teachers in the school
    teachers, err := userService.GetTeachersBySchool(req.SchoolID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get teachers"})
        return
    }
    
    dayType, err := scheduleService.GetDayTypeForDate(req.SchoolID, req.Date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not determine day type"})
        return
    }
    
    var availableTeachers []gin.H
    
    for _, teacher := range teachers {
        schedule, err := scheduleService.GetEducatorSchedule(teacher.ID)
        if err != nil {
            continue // Skip teachers without schedules
        }
        
        // Check if teacher has a class during specified period
        var hasClass bool
        var currentClass *ClassAssignment
        
        for _, assignment := range schedule.ClassAssignments {
            if contains(assignment.DayTypes, dayType.ID) {
                if req.Period == "" {
                    // If no period specified, include all teachers with any classes
                    hasClass = true
                    currentClass = &assignment
                    break
                } else if contains(assignment.Periods, req.Period) {
                    hasClass = true
                    currentClass = &assignment
                    break
                }
            }
        }
        
        if hasClass && currentClass != nil {
            availableTeachers = append(availableTeachers, gin.H{
                "teacher": gin.H{
                    "id": teacher.ID,
                    "name": teacher.DisplayName,
                    "divisionId": teacher.DivisionID,
                    "departmentId": teacher.DepartmentID,
                },
                "currentClass": currentClass,
                "canObserve": true,
            })
        }
    }
    
    c.JSON(http.StatusOK, gin.H{
        "availableTeachers": availableTeachers,
        "dayType": dayType,
        "period": req.Period,
        "date": req.Date.Format("2006-01-02"),
    })
}

// Helper function to check if slice contains string
func contains(slice []string, item string) bool {
    for _, s := range slice {
        if s == item {
            return true
        }
    }
    return false
}
```

### 📋 Observation Applet Functions (Enhanced with Schedule Integration)
```go
// functions/applets/observations/main.go
package main

import (
    "context"
    "log"
    "net/http"
    "time"

    firebase "firebase.google.com/go/v4"
    "github.com/GoogleCloudPlatform/functions-framework-go/functions"
    "github.com/gin-gonic/gin"
)

func init() {
    functions.HTTP("observationsApplet", handleObservationsAPI)
    functions.Firestore("onObservationCreated", onObservationCreated)
    functions.Firestore("onObservationUpdated", onObservationUpdated)
}

func setupObservationsRouter() *gin.Engine {
    router := gin.New()
    
    api := router.Group("/api/v1/applets/observations")
    api.Use(authMiddleware())
    {
        // 📅 SCHEDULE-INTEGRATED OBSERVATION ENDPOINTS
        api.POST("/create-with-schedule", createObservationWithSchedule)
        api.POST("/auto-populate", autoPopulateObservation)
        
        // Standard observation endpoints
        observations := api.Group("/observations")
        observations.GET("", listObservations)
        observations.POST("", createObservation)
        observations.GET("/:id", getObservation)
        observations.PUT("/:id", updateObservation)
        
        // Framework management
        frameworks := api.Group("/frameworks")
        frameworks.GET("", listFrameworks)
        frameworks.POST("", createFramework)
        frameworks.GET("/:id", getFramework)
        frameworks.PUT("/:id", updateFramework)
        frameworks.GET("/for-class", getFrameworksForClass)
        
        // Analytics with schedule insights
        analytics := api.Group("/analytics")
        analytics.GET("/dashboard", getObservationDashboard)
        analytics.POST("/schedule-patterns", getSchedulePatterns)
        analytics.GET("/framework/:frameworkId", getFrameworkAnalytics)
    }
    
    return router
}

// Create observation with automatic schedule population
func createObservationWithSchedule(c *gin.Context) {
    var req struct {
        SubjectID       string                 `json:"subjectId"`
        FrameworkID     string                 `json:"frameworkId"`
        Date            time.Time              `json:"date"`
        Period          string                 `json:"period,omitempty"`
        ManualOverrides map[string]interface{} `json:"manualOverrides,omitempty"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Get current user (observer)
    user := getCurrentUser(c)
    
    // Get teacher's schedule and current class
    schedule, err := scheduleService.GetEducatorSchedule(req.SubjectID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Teacher schedule not found"})
        return
    }
    
    // Determine day type and period
    dayType, err := scheduleService.GetDayTypeForDate(schedule.SchoolID, req.Date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not determine day type"})
        return
    }
    
    // Find the appropriate class
    var targetClass *ClassAssignment
    if req.Period != "" {
        // Specific period requested
        for _, assignment := range schedule.ClassAssignments {
            if contains(assignment.DayTypes, dayType.ID) && contains(assignment.Periods, req.Period) {
                targetClass = &assignment
                break
            }
        }
    } else {
        // Use current class
        currentTime := req.Date.Format("15:04")
        currentPeriod, err := scheduleService.GetCurrentPeriod(schedule.SchoolID, currentTime)
        if err == nil {
            for _, assignment := range schedule.ClassAssignments {
                if contains(assignment.DayTypes, dayType.ID) && contains(assignment.Periods, currentPeriod.ID) {
                    targetClass = &assignment
                    req.Period = currentPeriod.ID
                    break
                }
            }
        }
    }
    
    if targetClass == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No class found for specified time"})
        return
    }
    
    // Get teacher info
    teacher, err := userService.GetUser(req.SubjectID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Teacher not found"})
        return
    }
    
    // Build observation with auto-populated data
    observation := &Observation{
        ID:           generateID(),
        SchoolID:     schedule.SchoolID,
        DivisionID:   teacher.DivisionID,
        DepartmentID: teacher.DepartmentID,
        
        // Participants
        SubjectID:    req.SubjectID,
        SubjectName:  teacher.DisplayName,
        ObserverID:   user.ID,
        ObserverName: user.DisplayName,
        
        // Schedule Integration
        ScheduledClassID: targetClass.ID,
        DayType:          dayType.ShortName,
        Period:           req.Period,
        
        // Framework
        FrameworkID: req.FrameworkID,
        
        // Context (auto-populated from schedule)
        Context: ObservationContext{
            Type:            "classroom",
            ClassName:       targetClass.ClassName,
            CourseID:        targetClass.CourseID,
            CourseName:      targetClass.CourseName,
            CourseCode:      targetClass.CourseCode,
            Subject:         targetClass.Subject,
            Grade:           targetClass.Grade,
            GradeLevel:      targetClass.GradeLevel,
            RoomNumber:      targetClass.RoomNumber,
            Building:        targetClass.Building,
            Location:        fmt.Sprintf("%s, %s", targetClass.RoomNumber, targetClass.Building),
            StudentCount:    targetClass.StudentCount,
            CoTeachers:      getTeacherNames(targetClass.CoTeachers),
            Paraprofessionals: getStaffNames(targetClass.Paraprofessionals),
            IsHonors:        targetClass.IsHonors,
            IsAP:            targetClass.IsAP,
            IsIB:            targetClass.IsIB,
            IsSpecialEd:     targetClass.IsSpecialEd,
            IsESL:           targetClass.IsESL,
            IsInclusion:     targetClass.IsInclusion,
            Date:            req.Date,
            StartTime:       req.Date,
            Duration:        0, // Will be set when observation is completed
            ManualOverrides: req.ManualOverrides,
        },
        
        // System fields
        Status:    "draft",
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
        Version:   1,
    }
    
    // Save to Firestore
    err = firestoreService.CreateObservation(observation)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create observation"})
        return
    }
    
    c.JSON(http.StatusCreated, gin.H{
        "observation": observation,
        "autoPopulated": gin.H{
            "dayType": dayType,
            "class": targetClass,
            "teacher": gin.H{
                "id": teacher.ID,
                "name": teacher.DisplayName,
            },
        },
    })
}

// Auto-populate observation form data from schedule
func autoPopulateObservation(c *gin.Context) {
    var req struct {
        TeacherID string    `json:"teacherId"`
        Date      time.Time `json:"date"`
        Period    string    `json:"period,omitempty"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Get teacher's schedule and current class
    schedule, err := scheduleService.GetEducatorSchedule(req.TeacherID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Teacher schedule not found"})
        return
    }
    
    // Get teacher info
    teacher, err := userService.GetUser(req.TeacherID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Teacher not found"})
        return
    }
    
    // Determine day type
    dayType, err := scheduleService.GetDayTypeForDate(schedule.SchoolID, req.Date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not determine day type"})
        return
    }
    
    // Find appropriate class
    var targetClass *ClassAssignment
    var availableClasses []ClassAssignment
    
    for _, assignment := range schedule.ClassAssignments {
        if contains(assignment.DayTypes, dayType.ID) {
            availableClasses = append(availableClasses, assignment)
            if req.Period != "" && contains(assignment.Periods, req.Period) {
                targetClass = &assignment
            }
        }
    }
    
    // If no specific period, try to get current class
    if targetClass == nil && req.Period == "" {
        currentTime := req.Date.Format("15:04")
        currentPeriod, err := scheduleService.GetCurrentPeriod(schedule.SchoolID, currentTime)
        if err == nil {
            for _, assignment := range availableClasses {
                if contains(assignment.Periods, currentPeriod.ID) {
                    targetClass = &assignment
                    req.Period = currentPeriod.ID
                    break
                }
            }
        }
    }
    
    // Get applicable frameworks for the class/subject
    var applicableFrameworks []Framework
    if targetClass != nil {
        frameworks, err := frameworkService.GetFrameworksForClass(
            schedule.SchoolID, 
            targetClass.Subject, 
            targetClass.Grade, 
            teacher.DivisionID,
        )
        if err == nil {
            applicableFrameworks = frameworks
        }
    }
    
    response := gin.H{
        "teacher": gin.H{
            "id": teacher.ID,
            "name": teacher.DisplayName,
            "divisionId": teacher.DivisionID,
            "departmentId": teacher.DepartmentID,
        },
        "dayType": dayType,
        "availableClasses": availableClasses,
        "applicableFrameworks": applicableFrameworks,
    }
    
    if targetClass != nil {
        response["currentClass"] = targetClass
        response["autoPopulatedContext"] = gin.H{
            "className":       targetClass.ClassName,
            "courseName":      targetClass.CourseName,
            "subject":         targetClass.Subject,
            "grade":           targetClass.Grade,
            "roomNumber":      targetClass.RoomNumber,
            "building":        targetClass.Building,
            "studentCount":    targetClass.StudentCount,
            "isHonors":        targetClass.IsHonors,
            "isAP":            targetClass.IsAP,
            "isSpecialEd":     targetClass.IsSpecialEd,
            "isESL":           targetClass.IsESL,
        }
    }
    
    c.JSON(http.StatusOK, response)
}

// Get frameworks applicable to a specific class
func getFrameworksForClass(c *gin.Context) {
    schoolID := c.Query("schoolId")
    subject := c.Query("subject")
    grade := c.Query("grade")
    divisionType := c.Query("divisionType")
    
    if schoolID == "" || subject == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "schoolId and subject are required"})
        return
    }
    
    frameworks, err := frameworkService.GetFrameworksForClass(schoolID, subject, grade, divisionType)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get frameworks"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"frameworks": frameworks})
}

// Get observation patterns by schedule (analytics)
func getSchedulePatterns(c *gin.Context) {
    var req struct {
        SchoolID  string    `json:"schoolId"`
        StartDate time.Time `json:"startDate"`
        EndDate   time.Time `json:"endDate"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    patterns, err := analyticsService.GetSchedulePatterns(req.SchoolID, req.StartDate, req.EndDate)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get schedule patterns"})
        return
    }
    
    c.JSON(http.StatusOK, patterns)
}

// Firestore triggers enhanced with schedule context
func onObservationCreated(ctx context.Context, e firestore.DocumentSnapshot) error {
    var obs Observation
    if err := e.DataTo(&obs); err != nil {
        log.Printf("Failed to parse observation: %v", err)
        return err
    }
    
    // Send follow-up email if observation is completed
    if obs.Status == "completed" {
        go sendFollowUpEmail(&obs)
    }
    
    // Update schedule-based analytics
    go updateScheduleAnalytics(obs.SchoolID, obs.DayType, obs.Period)
    
    // Update framework usage statistics
    go updateFrameworkUsageStats(obs.FrameworkID)
    
    return nil
}
```
```

### 🔄 Background Worker Functions
```go
// functions/workers/scheduled_jobs.go
package main

import (
    "context"
    "log"

    "github.com/GoogleCloudPlatform/functions-framework-go/functions"
)

func init() {
    functions.HTTP("dailyAnalytics", calculateDailyAnalytics)
    functions.HTTP("weeklyReports", generateWeeklyReports)
    functions.HTTP("cleanupOldData", cleanupOldData)
}

func calculateDailyAnalytics(w http.ResponseWriter, r *http.Request) {
    ctx := context.Background()
    
    log.Println("Starting daily analytics calculation...")
    
    // Calculate metrics for all applets
    if err := calculateObservationMetrics(ctx); err != nil {
        log.Printf("Failed to calculate observation metrics: %v", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    
    // Add other applet analytics here as they're added
    
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Analytics calculated successfully"))
}

func generateWeeklyReports(w http.ResponseWriter, r *http.Request) {
    log.Println("Generating weekly observation reports...")
    
    // Generate reports for each organization
    orgs, err := getCoreService().ListOrganizations()
    if err != nil {
        log.Printf("Failed to get organizations: %v", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    
    for _, org := range orgs {
        go generateObservationReport(org.ID, "weekly")
    }
    
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Weekly reports generated successfully"))
}

func cleanupOldData(w http.ResponseWriter, r *http.Request) {
    log.Println("Cleaning up old data...")
    
    // Clean up draft observations older than 30 days
    cutoffDate := time.Now().AddDate(0, 0, -30)
    
    if err := cleanupOldObservations(cutoffDate); err != nil {
        log.Printf("Failed to cleanup observations: %v", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Cleanup completed successfully"))
}

func calculateObservationMetrics(ctx context.Context) error {
    // Calculate metrics for observation applet
    // This would include framework usage, evidence percentages, etc.
    return nil
}
```

### 🔧 Shared Services
```go
// functions/shared/services/firestore_service.go
package services

import (
    "context"
    "time"

    "cloud.google.com/go/firestore"
    firebase "firebase.google.com/go/v4"
)

type FirestoreService struct {
    client *firestore.Client
    ctx    context.Context
}

func NewFirestoreService(app *firebase.App) (*FirestoreService, error) {
    ctx := context.Background()
    client, err := app.Firestore(ctx)
    if err != nil {
        return nil, err
    }
    
    return &FirestoreService{
        client: client,
        ctx:    ctx,
    }, nil
}

// 🏢 Core Platform Operations

func (fs *FirestoreService) CreateUser(user *User) error {
    user.CreatedAt = time.Now()
    user.UpdatedAt = time.Now()
    
    _, err := fs.client.Collection("users").Doc(user.ID).Set(fs.ctx, user)
    return err
}

func (fs *FirestoreService) GetUser(userID string) (*User, error) {
    doc, err := fs.client.Collection("users").Doc(userID).Get(fs.ctx)
    if err != nil {
        return nil, err
    }
    
    var user User
    if err := doc.DataTo(&user); err != nil {
        return nil, err
    }
    
    return &user, nil
}

// 📋 Observation Applet Operations

func (fs *FirestoreService) CreateObservation(obs *Observation) error {
    obs.CreatedAt = time.Now()
    obs.UpdatedAt = time.Now()
    
    _, err := fs.client.Collection("applets").Doc("observations").
        Collection("observations").Doc(obs.ID).Set(fs.ctx, obs)
    
    return err
}

func (fs *FirestoreService) ListObservations(filters map[string]interface{}) ([]*Observation, error) {
    query := fs.client.Collection("applets").Doc("observations").Collection("observations")
    
    for field, value := range filters {
        query = query.Where(field, "==", value)
    }
    
    docs, err := query.Documents(fs.ctx).GetAll()
    if err != nil {
        return nil, err
    }
    
    var observations []*Observation
    for _, doc := range docs {
        var obs Observation
        if err := doc.DataTo(&obs); err != nil {
            continue
        }
        observations = append(observations, &obs)
    }
    
    return observations, nil
}

func (fs *FirestoreService) ListFrameworks(filters map[string]interface{}) ([]*Framework, error) {
    query := fs.client.Collection("applets").Doc("observations").Collection("frameworks")
    
    for field, value := range filters {
        query = query.Where(field, "==", value)
    }
    
    docs, err := query.Documents(fs.ctx).GetAll()
    if err != nil {
        return nil, err
    }
    
    var frameworks []*Framework
    for _, doc := range docs {
        var framework Framework
        if err := doc.DataTo(&framework); err != nil {
            continue
        }
        frameworks = append(frameworks, &framework)
    }
    
    return frameworks, nil
}

// Analytics operations specific to observations
func (fs *FirestoreService) GetObservationMetrics(orgID string, frameworkType string) (*ObservationMetrics, error) {
    observations, err := fs.ListObservations(map[string]interface{}{
        "organizationId": orgID,
        "status":        "completed",
        "context.type":  frameworkType,
    })
    if err != nil {
        return nil, err
    }
    
    var totalObservations int
    var totalEvidence int
    var evidencePercentages []float64
    
    for _, obs := range observations {
        totalObservations++
        totalEvidence += obs.EvidenceCount
        evidencePercentages = append(evidencePercentages, obs.EvidencePercentage)
    }
    
    var averageEvidencePercentage float64
    if len(evidencePercentages) > 0 {
        sum := 0.0
        for _, pct := range evidencePercentages {
            sum += pct
        }
        averageEvidencePercentage = sum / float64(len(evidencePercentages))
    }
    
    return &ObservationMetrics{
        TotalObservations:        totalObservations,
        TotalEvidence:           totalEvidence,
        AverageEvidencePercentage: averageEvidencePercentage,
        LastUpdated:             time.Now(),
    }, nil
}
```

## Astro + React Configuration

### Astro Setup
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  build: {
    assets: '_astro'
  },
  vite: {
    define: {
      __FIREBASE_CONFIG__: JSON.stringify({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      }),
    },
  },
});
```

### Firebase Client Configuration
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = __FIREBASE_CONFIG__;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Only initialize analytics in browser
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
```

### React Query + Firebase Integration
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// 🏢 Core Platform API Client
// src/lib/api/core.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../firebase';

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export const coreApi = {
  // User management
  users: {
    list: async (filters?: any) => {
      let q = collection(db, 'users');
      
      if (filters?.schoolId) {
        q = query(q, where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        q = query(q, where('divisionId', '==', filters.divisionId));
      }
      if (filters?.departmentId) {
        q = query(q, where('departmentId', '==', filters.departmentId));
      }
      if (filters?.role) {
        q = query(q, where('primaryRole', '==', filters.role));
      }
      if (filters?.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('User not found');
    },

    // Get teachers only (for observation subject selection)
    getTeachers: async (filters?: any) => {
      let q = collection(db, 'users');
      q = query(q, where('primaryRole', 'in', ['teacher', 'specialist_teacher']));
      
      if (filters?.schoolId) {
        q = query(q, where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        q = query(q, where('divisionId', '==', filters.divisionId));
      }
      if (filters?.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      
      q = query(q, orderBy('lastName'), orderBy('firstName'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    create: async (user: Partial<User>) => {
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
      return { id: docRef.id, ...user };
    },

    update: async (id: string, updates: Partial<User>) => {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      return { id, ...updates };
    }
  },

  // School management (top level)
  schools: {
    list: async () => {
      const q = query(collection(db, 'schools'), orderBy('name'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'schools', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('School not found');
    },

    create: async (school: Partial<School>) => {
      const docRef = await addDoc(collection(db, 'schools'), {
        ...school,
        enabledApplets: ['observations'], // Default applets
        settings: school.settings || {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...school };
    }
  },

  // 📅 SCHEDULE MANAGEMENT APIs
  schedules: {
    // Master Schedule Management
    getMasterSchedule: async (schoolId: string, academicYear?: string) => {
      let q = collection(db, 'master_schedules');
      q = query(q, where('schoolId', '==', schoolId));
      
      if (academicYear) {
        q = query(q, where('academicYear', '==', academicYear));
      }
      
      q = query(q, where('isActive', '==', true));
      
      const snapshot = await getDocs(q);
      const schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return schedules.length > 0 ? schedules[0] : null;
    },

    // Educator Schedule Management
    getEducatorSchedule: async (educatorId: string, academicYear?: string) => {
      let q = collection(db, 'educator_schedules');
      q = query(q, where('educatorId', '==', educatorId));
      
      if (academicYear) {
        q = query(q, where('academicYear', '==', academicYear));
      }
      
      q = query(q, where('isActive', '==', true));
      
      const snapshot = await getDocs(q);
      const schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return schedules.length > 0 ? schedules[0] : null;
    },

    // Get current class for a teacher (for observation auto-population)
    getCurrentClass: async (educatorId: string, date?: Date) => {
      const token = await getAuthToken();
      const currentDate = date || new Date();
      
      const response = await fetch(`/api/v1/schedules/current-class`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          educatorId,
          date: currentDate.toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get current class');
      }
      
      return response.json();
    },

    // Get full day schedule for a teacher
    getDaySchedule: async (educatorId: string, date: Date) => {
      const token = await getAuthToken();
      
      const response = await fetch(`/api/v1/schedules/day-schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          educatorId,
          date: date.toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get day schedule');
      }
      
      return response.json();
    },

    // Get teacher's weekly schedule
    getWeekSchedule: async (educatorId: string, startDate: Date) => {
      const token = await getAuthToken();
      
      const response = await fetch(`/api/v1/schedules/week-schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          educatorId,
          startDate: startDate.toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get week schedule');
      }
      
      return response.json();
    },

    // Get current day type (Day A, Day B, etc.)
    getCurrentDayType: async (schoolId: string, date?: Date) => {
      const token = await getAuthToken();
      const currentDate = date || new Date();
      
      const response = await fetch(`/api/v1/schedules/current-day-type`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolId,
          date: currentDate.toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get current day type');
      }
      
      return response.json();
    },

    // Get available teachers for observation at a specific time
    getAvailableTeachers: async (schoolId: string, date: Date, period?: string) => {
      const token = await getAuthToken();
      
      const response = await fetch(`/api/v1/schedules/available-teachers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolId,
          date: date.toISOString(),
          period
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get available teachers');
      }
      
      return response.json();
    }
  },

  // Division management (under schools)
  divisions: {
    list: async (filters?: any) => {
      let q = collection(db, 'divisions');
      
      if (filters?.schoolId) {
        q = query(q, where('schoolId', '==', filters.schoolId));
      }
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      
      q = query(q, orderBy('name'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'divisions', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Division not found');
    }
  },

  // Department management (under divisions)
  departments: {
    list: async (filters?: any) => {
      let q = collection(db, 'departments');
      
      if (filters?.schoolId) {
        q = query(q, where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        q = query(q, where('divisionId', '==', filters.divisionId));
      }
      
      q = query(q, orderBy('name'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'departments', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Department not found');
    }
  }
};

// 📋 Observation Applet API Client (Enhanced with Schedule Integration)
// src/lib/api/observations.ts
export const observationsApi = {
  // Generic observation operations (works with any framework type)
  observations: {
    list: async (filters?: any) => {
      let q = collection(db, 'applets', 'observations', 'observations');
      
      if (filters?.schoolId) {
        q = query(q, where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        q = query(q, where('divisionId', '==', filters.divisionId));
      }
      if (filters?.departmentId) {
        q = query(q, where('departmentId', '==', filters.departmentId));
      }
      if (filters?.subjectId) {
        q = query(q, where('subjectId', '==', filters.subjectId));
      }
      if (filters?.observerId) {
        q = query(q, where('observerId', '==', filters.observerId));
      }
      if (filters?.frameworkId) {
        q = query(q, where('frameworkId', '==', filters.frameworkId));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.contextType) {
        q = query(q, where('context.type', '==', filters.contextType));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // 📅 CREATE OBSERVATION WITH SCHEDULE INTEGRATION
    createWithSchedule: async (observation: {
      subjectId: string;
      frameworkId: string; 
      date?: Date;
      period?: string;
      manualOverrides?: any;
    }) => {
      const token = await getAuthToken();
      
      const response = await fetch(`/api/v1/applets/observations/create-with-schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...observation,
          date: observation.date?.toISOString() || new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create observation with schedule');
      }
      
      return response.json();
    },

    // Auto-populate observation form with current class details
    autoPopulateFromSchedule: async (teacherId: string, date?: Date, period?: string) => {
      const token = await getAuthToken();
      
      const response = await fetch(`/api/v1/applets/observations/auto-populate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId,
          date: date?.toISOString() || new Date().toISOString(),
          period
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to auto-populate observation');
      }
      
      return response.json();
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'applets', 'observations', 'observations', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Observation not found');
    },

    update: async (id: string, updates: Partial<Observation>) => {
      const docRef = doc(db, 'applets', 'observations', 'observations', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      return { id, ...updates };
    },

    // Submit observation (change status to completed and calculate metrics)
    submit: async (id: string) => {
      const docRef = doc(db, 'applets', 'observations', 'observations', id);
      const observation = await getDoc(docRef);
      
      if (!observation.exists()) {
        throw new Error('Observation not found');
      }
      
      const data = observation.data();
      
      // Calculate evidence metrics
      const evidenceCount = data.responses?.filter((r: any) => 
        r.rating && r.rating !== 'not-observed'
      ).length || 0;
      
      const totalQuestions = data.responses?.length || 0;
      const evidencePercentage = totalQuestions > 0 ? 
        (evidenceCount / totalQuestions) * 100 : 0;
      
      await updateDoc(docRef, {
        status: 'completed',
        submittedAt: new Date(),
        updatedAt: new Date(),
        evidenceCount,
        evidencePercentage
      });
      
      return { id, status: 'completed', evidenceCount, evidencePercentage };
    }
  },

  // Framework management (generic for any type)
  frameworks: {
    list: async (filters?: any) => {
      let q = collection(db, 'applets', 'observations', 'frameworks');
      
      if (filters?.schoolId) {
        q = query(q, where('schoolId', '==', filters.schoolId));
      }
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      } else {
        q = query(q, where('status', '==', 'active'));
      }
      if (filters?.applicableDivisions) {
        q = query(q, where('applicableDivisions', 'array-contains-any', filters.applicableDivisions));
      }
      if (filters?.applicableSubjects) {
        q = query(q, where('applicableSubjects', 'array-contains-any', filters.applicableSubjects));
      }
      
      q = query(q, orderBy('name'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get frameworks applicable to a specific class
    getForClass: async (schoolId: string, subject: string, grade: string, divisionType: string) => {
      let q = collection(db, 'applets', 'observations', 'frameworks');
      q = query(q, where('schoolId', '==', schoolId));
      q = query(q, where('status', '==', 'active'));
      q = query(q, where('applicableDivisions', 'array-contains', divisionType));
      
      // Check if framework applies to this subject
      q = query(q, where('applicableSubjects', 'array-contains', subject));
      
      const snapshot = await getDocs(q);
      const frameworks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter by grade if specified in framework
      return frameworks.filter(fw => 
        fw.applicableGrades.length === 0 || fw.applicableGrades.includes(grade)
      );
    },

    getById: async (id: string) => {
      const docRef = doc(db, 'applets', 'observations', 'frameworks', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Framework not found');
    }
  },

  // Analytics specific to observations (enhanced with schedule data)
  analytics: {
    getDashboardData: async (schoolId: string, divisionId?: string, frameworkType?: string) => {
      const token = await getAuthToken();
      
      // Call Firebase Function for complex analytics
      const params = new URLSearchParams({
        schoolId: schoolId,
        ...(divisionId && { divisionId }),
        ...(frameworkType && { frameworkType })
      });
      
      const response = await fetch(`/api/v1/applets/observations/analytics/dashboard?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      return response.json();
    },

    // Get observation patterns by schedule (e.g., which periods have most observations)
    getSchedulePatterns: async (schoolId: string, dateRange: { start: Date; end: Date }) => {
      const token = await getAuthToken();
      
      const response = await fetch(`/api/v1/applets/observations/analytics/schedule-patterns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolId,
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString()
        })
      });
      
      return response.json();
    }
  }
};

// 🔧 React Hooks for Schedule Management
// src/hooks/useSchedule.ts  
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coreApi } from '../lib/api/core';

export const useEducatorSchedule = (educatorId: string, academicYear?: string) => {
  return useQuery({
    queryKey: ['educator-schedule', educatorId, academicYear],
    queryFn: () => coreApi.schedules.getEducatorSchedule(educatorId, academicYear),
    enabled: !!educatorId
  });
};

export const useCurrentClass = (educatorId: string, date?: Date) => {
  return useQuery({
    queryKey: ['current-class', educatorId, date?.toISOString()],
    queryFn: () => coreApi.schedules.getCurrentClass(educatorId, date),
    enabled: !!educatorId,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};

export const useDaySchedule = (educatorId: string, date: Date) => {
  return useQuery({
    queryKey: ['day-schedule', educatorId, date.toDateString()],
    queryFn: () => coreApi.schedules.getDaySchedule(educatorId, date),
    enabled: !!educatorId
  });
};

export const useCurrentDayType = (schoolId: string, date?: Date) => {
  return useQuery({
    queryKey: ['current-day-type', schoolId, date?.toDateString()],
    queryFn: () => coreApi.schedules.getCurrentDayType(schoolId, date),
    enabled: !!schoolId
  });
};

export const useAvailableTeachers = (schoolId: string, date: Date, period?: string) => {
  return useQuery({
    queryKey: ['available-teachers', schoolId, date.toISOString(), period],
    queryFn: () => coreApi.schedules.getAvailableTeachers(schoolId, date, period),
    enabled: !!schoolId
  });
};

// Enhanced observation hooks with schedule integration
export const useCreateObservationWithSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: observationsApi.observations.createWithSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    }
  });
};

export const useAutoPopulateObservation = () => {
  return useMutation({
    mutationFn: ({ teacherId, date, period }: { teacherId: string; date?: Date; period?: string }) =>
      observationsApi.observations.autoPopulateFromSchedule(teacherId, date, period)
  });
};
```

## Firebase Deployment

### Firebase Configuration
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "runtime": "go121"
    }
  ],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Deployment Scripts
```json
{
  "scripts": {
    "build": "astro build",
    "deploy": "npm run build && firebase deploy",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:hosting": "firebase deploy --only hosting",
    "deploy:rules": "firebase deploy --only firestore:rules,storage:rules"
  }
}
```

This instruction file is now exclusively focused on Firebase services with your preferred Astro + Go architecture. All components use Firebase Auth, Firestore, Storage, and Cloud Functions while maintaining the extensible applet system for your educational employee experience platform.