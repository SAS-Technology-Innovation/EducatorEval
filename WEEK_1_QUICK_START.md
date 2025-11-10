# Week 1 Quick Start Guide - CRP in Action Platform

## 🚀 Your Mission This Week

Transform your disconnected components and documentation into a working foundation with the critical schedule system implemented.

**Week 1 Goals:**
1. ✅ Clean, organized project structure
2. ✅ Schedule system backend working
3. ✅ Schedule system frontend connected
4. ✅ First integration test passing

---

## 📅 Day-by-Day Breakdown

### Day 1: Foundation Setup (Friday)
**Time:** 4-6 hours
**Goal:** Get organized and set up proper development environment

#### Morning Session (2-3 hours):

**1. Create Project Structure (30 min)**
```bash
# Navigate to your project directory
cd ~/projects/crp-platform

# Create frontend structure
mkdir -p frontend/src/pages
mkdir -p frontend/src/components/core/{Auth,Navigation,UserManagement,Schedules}
mkdir -p frontend/src/components/applets/observations
mkdir -p frontend/src/lib/{api,hooks}
mkdir -p frontend/src/stores
mkdir -p frontend/src/types

# Create backend structure
mkdir -p functions/core/{auth,users,organizations,schedules}
mkdir -p functions/applets/observations/{frameworks,observations,analytics}
mkdir -p functions/shared/{middleware,models,utils}

# Create documentation
mkdir -p docs
mkdir -p scripts

# Move existing files
# Move your existing components to the right folders
# Move your existing docs to /docs
```

**2. Initialize Git (15 min)**
```bash
# Initialize Git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
.astro/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Firebase
.firebase/
firebase-debug.log

# Logs
*.log
npm-debug.log*
EOF

# Initial commit
git add .
git commit -m "Initial project structure"
```

**3. Environment Setup (30 min)**
```bash
# Create .env.example
cat > frontend/.env.example << 'EOF'
# Firebase Configuration
PUBLIC_FIREBASE_API_KEY=your_api_key_here
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI
GOOGLE_AI_API_KEY=your_gemini_api_key

# Environment
NODE_ENV=development
EOF

# Copy to .env and fill in real values
cp frontend/.env.example frontend/.env
# Edit .env with your actual Firebase credentials
```

**4. Lock Dependencies (30 min)**
```bash
# Frontend
cd frontend
npm install
npm install --save-exact

# Backend
cd ../functions
go mod init crp-platform/functions
go mod tidy
```

#### Afternoon Session (2-3 hours):

**5. Create README (30 min)**
```markdown
# CRP in Action Platform

Educational Employee Experience Platform with observation tools.

## Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- Firebase CLI

### Installation
\`\`\`bash
# Clone and install
git clone <your-repo>
cd crp-platform/frontend
npm install

cd ../functions
go mod download
\`\`\`

### Development
\`\`\`bash
# Frontend
cd frontend
npm run dev

# Backend (when implemented)
cd functions
go run main.go
\`\`\`

### Deployment
\`\`\`bash
npm run deploy
\`\`\`

## Documentation
See `/docs` folder for detailed documentation.
```

**6. Set Up Firebase Project (1-2 hours)**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in your project
cd ~/projects/crp-platform
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting
# - Storage

# For Functions:
# - Choose Go as the language
# - Set functions directory to './functions'

# For Hosting:
# - Set public directory to 'frontend/dist'
# - Configure as single-page app: Yes
```

**7. Quick Firebase Test (30 min)**

Create a simple test to verify Firebase works:

```javascript
// frontend/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('✅ Firebase initialized:', app.name);
```

**End of Day 1 Checklist:**
- [ ] Project folders created and organized
- [ ] Git initialized with .gitignore
- [ ] .env configured with Firebase credentials
- [ ] Dependencies locked
- [ ] README created
- [ ] Firebase project initialized
- [ ] Firebase test passing

---

### Day 2: Schedule Data Models
**Time:** 6-8 hours
**Goal:** Define all schedule data structures

#### Morning Session (3-4 hours):

**1. Go Schedule Models (2 hours)**

Create `functions/shared/models/schedule.go`:

```go
package models

import "time"

type ScheduleType string

const (
    Traditional ScheduleType = "traditional"
    Rotating    ScheduleType = "rotating"
    Block       ScheduleType = "block"
)

type MasterSchedule struct {
    ID           string       `firestore:"id" json:"id"`
    SchoolID     string       `firestore:"schoolId" json:"schoolId"`
    Name         string       `firestore:"name" json:"name"`
    ScheduleType ScheduleType `firestore:"scheduleType" json:"scheduleType"`
    DayTypes     []DayType    `firestore:"dayTypes" json:"dayTypes"`
    Periods      []Period     `firestore:"periods" json:"periods"`
    StartDate    time.Time    `firestore:"startDate" json:"startDate"`
    EndDate      time.Time    `firestore:"endDate" json:"endDate"`
    IsActive     bool         `firestore:"isActive" json:"isActive"`
    CreatedAt    time.Time    `firestore:"createdAt" json:"createdAt"`
    UpdatedAt    time.Time    `firestore:"updatedAt" json:"updatedAt"`
}

type DayType struct {
    ID          string `firestore:"id" json:"id"`
    Name        string `firestore:"name" json:"name"`
    ShortName   string `firestore:"shortName" json:"shortName"`
    Description string `firestore:"description,omitempty" json:"description,omitempty"`
    Color       string `firestore:"color,omitempty" json:"color,omitempty"`
    Order       int    `firestore:"order" json:"order"`
}

type Period struct {
    ID             string     `firestore:"id" json:"id"`
    Name           string     `firestore:"name" json:"name"`
    ShortName      string     `firestore:"shortName" json:"shortName"`
    StartTime      string     `firestore:"startTime" json:"startTime"`
    EndTime        string     `firestore:"endTime" json:"endTime"`
    Duration       int        `firestore:"duration" json:"duration"`
    Order          int        `firestore:"order" json:"order"`
    Type           PeriodType `firestore:"type" json:"type"`
    ApplicableDays []string   `firestore:"applicableDays" json:"applicableDays"`
}

type PeriodType string

const (
    ClassPeriod  PeriodType = "class"
    Lunch        PeriodType = "lunch"
    Planning     PeriodType = "planning"
    Homeroom     PeriodType = "homeroom"
)

type EducatorSchedule struct {
    ID               string            `firestore:"id" json:"id"`
    EducatorID       string            `firestore:"educatorId" json:"educatorId"`
    EducatorName     string            `firestore:"educatorName" json:"educatorName"`
    MasterScheduleID string            `firestore:"masterScheduleId" json:"masterScheduleId"`
    SchoolID         string            `firestore:"schoolId" json:"schoolId"`
    ClassAssignments []ClassAssignment `firestore:"classAssignments" json:"classAssignments"`
    CreatedAt        time.Time         `firestore:"createdAt" json:"createdAt"`
    UpdatedAt        time.Time         `firestore:"updatedAt" json:"updatedAt"`
}

type ClassAssignment struct {
    ID          string   `firestore:"id" json:"id"`
    ClassName   string   `firestore:"className" json:"className"`
    CourseID    string   `firestore:"courseId" json:"courseId"`
    CourseName  string   `firestore:"courseName" json:"courseName"`
    CourseCode  string   `firestore:"courseCode" json:"courseCode"`
    Subject     string   `firestore:"subject" json:"subject"`
    Grade       string   `firestore:"grade" json:"grade"`
    GradeLevel  string   `firestore:"gradeLevel" json:"gradeLevel"`
    DayTypes    []string `firestore:"dayTypes" json:"dayTypes"`
    Periods     []string `firestore:"periods" json:"periods"`
    RoomNumber  string   `firestore:"roomNumber" json:"roomNumber"`
    Building    string   `firestore:"building" json:"building"`
    StudentCount int     `firestore:"studentCount" json:"studentCount"`
}

type CurrentClassRequest struct {
    TeacherID string     `json:"teacherId"`
    DateTime  *time.Time `json:"dateTime,omitempty"`
    Period    string     `json:"period,omitempty"`
}

type CurrentClassResponse struct {
    Found           bool             `json:"found"`
    Class           *ClassAssignment `json:"class,omitempty"`
    DayType         string           `json:"dayType"`
    Period          string           `json:"period"`
    CurrentPeriod   *Period          `json:"currentPeriod,omitempty"`
}
```

**2. TypeScript Schedule Models (1 hour)**

Create `frontend/src/types/schedule.ts`:

```typescript
export type ScheduleType = 'traditional' | 'rotating' | 'block' | 'flexible' | 'hybrid';
export type PeriodType = 'class' | 'lunch' | 'planning' | 'homeroom' | 'assembly' | 'break';

export interface MasterSchedule {
  id: string;
  schoolId: string;
  name: string;
  scheduleType: ScheduleType;
  dayTypes: DayType[];
  periods: Period[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DayType {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  color?: string;
  order: number;
}

export interface Period {
  id: string;
  name: string;
  shortName: string;
  startTime: string;
  endTime: string;
  duration: number;
  order: number;
  type: PeriodType;
  applicableDays: string[];
}

export interface EducatorSchedule {
  id: string;
  educatorId: string;
  educatorName: string;
  masterScheduleId: string;
  schoolId: string;
  classAssignments: ClassAssignment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassAssignment {
  id: string;
  className: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  subject: string;
  grade: string;
  gradeLevel: string;
  dayTypes: string[];
  periods: string[];
  roomNumber: string;
  building: string;
  studentCount: number;
}

export interface CurrentClassRequest {
  teacherId: string;
  dateTime?: Date;
  period?: string;
}

export interface CurrentClassResponse {
  found: boolean;
  class?: ClassAssignment;
  dayType: string;
  period: string;
  currentPeriod?: Period;
}
```

**3. Test Data Creation (1 hour)**

Create test data file `docs/test-schedule-data.json`:

```json
{
  "masterSchedule": {
    "id": "test-schedule-2024",
    "schoolId": "westfield-high",
    "name": "2024-2025 Rotating Schedule",
    "scheduleType": "rotating",
    "dayTypes": [
      {"id": "day-a", "name": "Day A", "shortName": "A", "color": "blue", "order": 1},
      {"id": "day-b", "name": "Day B", "shortName": "B", "color": "red", "order": 2},
      {"id": "day-c", "name": "Day C", "shortName": "C", "color": "green", "order": 3},
      {"id": "day-d", "name": "Day D", "shortName": "D", "color": "orange", "order": 4}
    ],
    "periods": [
      {"id": "p1", "name": "Period 1", "shortName": "P1", "startTime": "08:00", "endTime": "08:50", "duration": 50, "type": "class", "order": 1},
      {"id": "p2", "name": "Period 2", "shortName": "P2", "startTime": "09:00", "endTime": "09:50", "duration": 50, "type": "class", "order": 2},
      {"id": "p3", "name": "Period 3", "shortName": "P3", "startTime": "10:00", "endTime": "10:50", "duration": 50, "type": "class", "order": 3},
      {"id": "lunch", "name": "Lunch", "shortName": "L", "startTime": "11:00", "endTime": "11:30", "duration": 30, "type": "lunch", "order": 4}
    ]
  },
  "teacherSchedule": {
    "id": "smith-schedule",
    "educatorId": "teacher-smith",
    "educatorName": "Sarah Smith",
    "masterScheduleId": "test-schedule-2024",
    "classAssignments": [
      {
        "id": "algebra-p1",
        "className": "Algebra I - Period 1",
        "courseName": "Algebra I",
        "subject": "Mathematics",
        "grade": "9",
        "dayTypes": ["day-a", "day-b", "day-c", "day-d"],
        "periods": ["p1"],
        "roomNumber": "201",
        "studentCount": 24
      },
      {
        "id": "geometry-p2",
        "className": "Geometry - Period 2",
        "courseName": "Geometry",
        "subject": "Mathematics",
        "grade": "10",
        "dayTypes": ["day-a", "day-c"],
        "periods": ["p2"],
        "roomNumber": "201",
        "studentCount": 28
      }
    ]
  }
}
```

#### Afternoon Session (3-4 hours):

**4. Create Firestore Collections (1 hour)**

Create `scripts/init-firestore.js`:

```javascript
// Script to initialize Firestore with test data
const admin = require('firebase-admin');
const testData = require('../docs/test-schedule-data.json');

admin.initializeApp();
const db = admin.firestore();

async function initializeSchedules() {
  try {
    // Create master schedule
    await db.collection('master_schedules')
      .doc(testData.masterSchedule.id)
      .set(testData.masterSchedule);
    console.log('✅ Master schedule created');

    // Create educator schedule
    await db.collection('educator_schedules')
      .doc(testData.teacherSchedule.id)
      .set(testData.teacherSchedule);
    console.log('✅ Educator schedule created');

    console.log('🎉 Firestore initialized successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

initializeSchedules();
```

**5. Document Schedule System (1 hour)**

Create `docs/SCHEDULE_SYSTEM.md` documenting:
- Schedule types and when to use each
- Data model relationships
- How day type rotation works
- How to query for current class
- Examples and edge cases

**6. Plan API Endpoints (1 hour)**

Create `docs/SCHEDULE_API.md`:

```markdown
# Schedule API Endpoints

## POST /api/v1/schedules/current-class
Get current class for a teacher

**Request:**
\`\`\`json
{
  "teacherId": "teacher-smith",
  "dateTime": "2024-11-07T09:15:00Z",
  "period": "p2"
}
\`\`\`

**Response:**
\`\`\`json
{
  "found": true,
  "class": {
    "id": "geometry-p2",
    "className": "Geometry - Period 2",
    "subject": "Mathematics",
    ...
  },
  "dayType": "Day A",
  "period": "p2"
}
\`\`\`

## [Document other endpoints similarly]
```

**End of Day 2 Checklist:**
- [ ] Go schedule models created
- [ ] TypeScript schedule models created
- [ ] Test data JSON created
- [ ] Firestore init script created
- [ ] Schedule system documented
- [ ] API endpoints planned
- [ ] Models match exactly between Go and TypeScript

---

### Day 3-4: Schedule Backend Implementation
**Time:** 12-16 hours (spread over 2 days)
**Goal:** Working schedule API in Go

See `BUILD_OBJECTIVES.md` Objective 2 for detailed backend checklist.

**Key deliverables:**
- `functions/core/schedules/main.go` - HTTP handler
- `functions/core/schedules/handlers.go` - API endpoints
- `functions/core/schedules/services.go` - Business logic
- All 8 API endpoints working
- Unit tests passing

**Testing approach:**
```bash
# Test with curl
curl -X POST http://localhost:8080/api/v1/schedules/current-class \
  -H "Content-Type: application/json" \
  -d '{"teacherId": "teacher-smith", "period": "p2"}'
```

---

### Day 5: Schedule Frontend Implementation
**Time:** 6-8 hours
**Goal:** Frontend can query schedules

See `BUILD_OBJECTIVES.md` Objective 2 for detailed frontend checklist.

**Key deliverables:**
- `frontend/src/lib/api/schedules.ts` - API client
- `frontend/src/lib/hooks/useSchedules.ts` - React Query hooks
- `frontend/src/components/core/Schedules/CurrentClassDisplay.tsx` - UI component
- Integration test showing current class

**Testing approach:**
```typescript
// Test in browser console
import { getCurrentClass } from './api/schedules';
const result = await getCurrentClass('teacher-smith', new Date(), 'p2');
console.log(result);
```

---

## 🎯 Week 1 Success Criteria

By end of week, you should be able to:

1. ✅ **Show off your organized project structure**
   - Clean folders
   - Git commits
   - Documentation

2. ✅ **Query current class via API**
   ```bash
   curl http://localhost:8080/api/v1/schedules/current-class \
     -d '{"teacherId": "teacher-smith"}'
   # Returns: Current class details
   ```

3. ✅ **Display current class in UI**
   - Component shows teacher's current class
   - Updates in real-time
   - Shows period, subject, room, etc.

4. ✅ **Have test data in Firestore**
   - Master schedule exists
   - 2-3 teacher schedules exist
   - Can query them successfully

---

## 🚨 Common Pitfalls to Avoid

1. **Don't skip the structure setup**
   - It's tempting to jump into coding
   - Clean structure saves time later

2. **Don't hardcode test data in code**
   - Use JSON files
   - Makes testing easier
   - Easier to share with team

3. **Don't skip documentation**
   - Future you will thank you
   - Helps with onboarding

4. **Don't over-engineer**
   - Start simple
   - Add complexity as needed
   - MVP first, then iterate

5. **Don't forget to commit often**
   - Commit after each completed task
   - Makes it easy to roll back
   - Shows progress

---

## 💡 Pro Tips

1. **Use AI Tools Effectively**
   - GitHub Copilot for boilerplate
   - Ask Claude to review code
   - Generate test data with AI

2. **Test as You Build**
   - Don't wait until the end
   - Write test, then code
   - Saves debugging time

3. **Take Breaks**
   - Pomodoro technique (25 min work, 5 min break)
   - Fresh eyes catch bugs
   - Prevents burnout

4. **Ask for Help**
   - Stuck for >30 min? Ask!
   - Post in Slack/Discord
   - Rubber duck debugging

5. **Celebrate Wins**
   - First API call working? Celebrate!
   - Structure complete? Celebrate!
   - Tests passing? Celebrate!

---

## 🛠️ Tools You'll Need

### Required:
- VS Code or similar
- Node.js 18+
- Go 1.21+
- Firebase CLI
- Git
- Postman or curl

### Recommended:
- GitHub Copilot
- Firestore Emulator
- Go extension for VS Code
- TypeScript extension
- Prettier for formatting
- ESLint for linting

---

## 📞 Getting Unstuck

### If you're stuck on:

**Project Structure:**
- Review BUILD_INSTRUCTIONS.md
- Look at similar Astro projects
- Ask: "Is this the simplest structure?"

**Firebase Setup:**
- Check Firebase docs
- Try Firebase emulator first
- Verify .env variables

**Go Models:**
- Copy from documentation exactly
- Test with unit tests
- Use Postman to test endpoints

**TypeScript Types:**
- Mirror Go structs exactly
- Use `unknown` if unsure, then refine
- Test with sample data

**Schedule Logic:**
- Start with simplest case
- Add complexity incrementally
- Draw out the flow on paper

**Anything Else:**
- Take a 10 min break
- Explain the problem out loud
- Check the documentation
- Ask Claude or team

---

## ✅ End of Week 1 Checklist

Before you close your laptop Friday evening, make sure:

### Structure:
- [ ] Folders organized as per BUILD_INSTRUCTIONS.md
- [ ] Git repository initialized
- [ ] .env files configured
- [ ] Dependencies locked
- [ ] README created

### Schedule System:
- [ ] Go models defined
- [ ] TypeScript models defined
- [ ] Test data created
- [ ] Backend API working
- [ ] Frontend API client working
- [ ] At least one component using schedule data
- [ ] Tests passing

### Documentation:
- [ ] SCHEDULE_SYSTEM.md written
- [ ] SCHEDULE_API.md written
- [ ] Test data documented
- [ ] API endpoints documented

### Git:
- [ ] Multiple commits throughout week
- [ ] Clear commit messages
- [ ] .gitignore working
- [ ] No sensitive data committed

### Firebase:
- [ ] Project initialized
- [ ] Test data in Firestore
- [ ] Can query from frontend
- [ ] Functions deployable

### Testing:
- [ ] Can query current class via API
- [ ] Can display current class in UI
- [ ] Unit tests passing
- [ ] Integration test working

---

## 🎉 You Did It!

If you've completed Week 1, you now have:

1. ✅ A clean, organized codebase
2. ✅ A working schedule system
3. ✅ Your first integration between frontend and backend
4. ✅ Test data to work with
5. ✅ Confidence that your architecture works!

**Week 2 Preview:**
- Complete schedule system integration
- Connect observation form to schedules
- Auto-population working!
- Connect more components to Firebase

---

## 📝 Week 1 Retrospective

At the end of the week, reflect:

### What Went Well?
- 
-
-

### What Was Challenging?
-
-
-

### What Will You Do Differently Next Week?
-
-
-

### Key Learnings:
-
-
-

---

**You've got this! 💪 One step at a time, one day at a time.**

Remember: Progress over perfection. A working system is better than a perfect plan.

---

**Last Updated:** November 7, 2025
**For:** Week 1 (Days 1-5)
**Next:** See Week 2 guide for continued progress
