# CRP in Action Platform - Build Organization & Implementation Guide

## 🎯 Project Overview
Educational Employee Experience Platform with extensible applets architecture, starting with CRP in Action observation tool as flagship module.

**Target:** 5,000 observations by May 2026 | 70% CRP evidence rate | 80+ observers

---

## 📊 Current Build Status

### ✅ COMPLETE - Production Ready
- **FrameworkEditor Component** - Full framework configuration UI
- **ObservationForm Component** - Mobile observation capture
- **ObservationDashboard Component** - Analytics and insights display
- **Core Data Models** - TypeScript/Go type definitions
- **Firebase Architecture** - Database schema and collections designed
- **Firestore Security Rules** - Role-based access controls
- **AI Analytics Integration** - Gemini AI setup for insights

### ⚠️ IN PROGRESS - Needs Backend Integration
- **Frontend Components** → Need Firebase API connections
- **Go Cloud Functions** → Need deployment setup
- **Authentication Flow** → Firebase Auth integration incomplete
- **State Management** → React Query + Zustand setup needed

### 🚨 MISSING - Critical Gap
- **Educator Schedule System** ⚠️ **HIGHEST PRIORITY**
  - Auto-populate observation forms with teacher schedules
  - Support traditional weekday AND rotating day schedules (A/B/C/D)
  - Current class lookup by teacher/date/period
  - Schedule conflict detection
  - Day type determination

### 🔮 PLANNED - Future Expansion
- Additional applets (evaluations, professional learning, etc.)
- Google Workspace deeper integration
- Advanced reporting and exports
- Mobile offline capabilities (PWA)

---

## 🏗️ Build Organization Strategy

### Phase 1: Foundation Cleanup (Week 1)
**Goal:** Establish clean project structure and working development environment

#### Tasks:
1. **Project Structure Setup**
   ```
   /crp-platform
   ├── /frontend              # Astro + React
   │   ├── /src
   │   │   ├── /pages
   │   │   ├── /components
   │   │   │   ├── /core          # Platform components
   │   │   │   └── /applets       # Applet components
   │   │   ├── /lib               # Firebase SDK, utilities
   │   │   ├── /stores            # Zustand state management
   │   │   └── /types             # TypeScript definitions
   │   ├── astro.config.mjs
   │   └── package.json
   │
   ├── /functions             # Go Cloud Functions
   │   ├── /core
   │   │   ├── /auth
   │   │   ├── /users
   │   │   ├── /organizations
   │   │   └── /schedules     # ⚠️ NEW - Critical missing piece
   │   ├── /applets
   │   │   └── /observations
   │   ├── /shared
   │   │   ├── /middleware
   │   │   ├── /models
   │   │   └── /utils
   │   ├── go.mod
   │   └── firebase.json
   │
   ├── /docs                  # Documentation
   │   ├── API.md
   │   ├── ARCHITECTURE.md
   │   └── DEPLOYMENT.md
   │
   ├── /scripts               # Build and deployment scripts
   ├── .env.example
   └── README.md
   ```

2. **Environment Configuration**
   - Set up `.env` files for Firebase credentials
   - Configure Google Cloud Project settings
   - Set up Gemini AI API keys
   - Configure development vs production environments

3. **Dependency Management**
   - Frontend: Lock package.json versions
   - Backend: Lock go.mod versions
   - Document all dependencies with purpose

4. **Git Organization**
   - Create `.gitignore` for build artifacts
   - Set up branch strategy (main, develop, feature/*)
   - Tag current state before major changes

---

### Phase 2: Schedule System Implementation (Week 1-2)
**Goal:** Build the missing educator schedule system - CRITICAL for observations

#### Core Schedule Components:

**Backend - Go Cloud Functions:**
```go
/functions/core/schedules/
├── main.go                    # HTTP handler setup
├── handlers.go                # API endpoint handlers
├── models.go                  # Schedule data models
├── services.go                # Business logic
└── validation.go              # Schedule validation logic
```

**API Endpoints to Implement:**
- `POST /api/v1/schedules/current-class` - Get teacher's current class
- `POST /api/v1/schedules/day-schedule` - Get full day schedule
- `POST /api/v1/schedules/current-day-type` - Get current day type (A/B/C/D or Mon/Tue/etc)
- `POST /api/v1/schedules/available-teachers` - Find available teachers by time
- `POST /api/v1/schedules/validate-schedule` - Validate schedule data
- `GET /api/v1/schedules/master-schedules` - List master schedules
- `POST /api/v1/schedules/master-schedules` - Create master schedule
- `GET /api/v1/schedules/educator-schedules` - List educator schedules
- `POST /api/v1/schedules/educator-schedules` - Create educator schedule

**Frontend - React Components:**
```typescript
/src/components/core/Schedules/
├── ScheduleManager.tsx        # Admin schedule management
├── ScheduleViewer.tsx         # View schedules
├── DayTypeSelector.tsx        # Select day type (A/B/C/D)
├── CurrentClassDisplay.tsx    # Show current class info
└── TeacherSchedule.tsx        # Individual teacher schedule view
```

**Frontend - API Client:**
```typescript
/src/lib/api/schedules.ts
- getCurrentClass()
- getDaySchedule()
- getCurrentDayType()
- getAvailableTeachers()
- validateSchedule()
```

**Frontend - React Query Hooks:**
```typescript
/src/lib/hooks/useSchedules.ts
- useCurrentClass()
- useDaySchedule()
- useCurrentDayType()
- useAvailableTeachers()
- useEducatorSchedule()
```

#### Database Collections:
```
/master_schedules/{scheduleId}
/educator_schedules/{educatorScheduleId}
/daily_schedules/{dailyScheduleId}
/class_assignments/{classAssignmentId}
```

#### Integration Points:
1. **Observation Form** - Auto-populate with schedule data
2. **Observation Scheduler** - Show available times/teachers
3. **Dashboard** - Display schedule context in observations
4. **Analytics** - Filter by schedule patterns

---

### Phase 3: Firebase Backend Integration (Week 2-3)
**Goal:** Connect existing frontend components to Firebase backend

#### Connection Points:

**1. Authentication System**
```typescript
/src/lib/auth.ts
- setupFirebaseAuth()
- handleLogin()
- handleLogout()
- getUserProfile()
- updateUserProfile()
```

**2. Observation API Integration**
```typescript
/src/lib/api/observations.ts
✅ Models defined - Need implementations:
- observations.list()
- observations.create()
- observations.createWithSchedule() ⚠️ Needs schedule system
- observations.update()
- observations.submit()
- observations.delete()
- observations.autoPopulateFromSchedule() ⚠️ Needs schedule system
```

**3. Framework API Integration**
```typescript
/src/lib/api/frameworks.ts
✅ Models defined - Need implementations:
- frameworks.list()
- frameworks.getById()
- frameworks.getForClass() ⚠️ Needs schedule integration
- frameworks.create()
- frameworks.update()
- frameworks.delete()
```

**4. Analytics API Integration**
```typescript
/src/lib/api/analytics.ts
- getDashboardData()
- getObservationMetrics()
- getFrameworkAnalytics()
- getTrends()
- exportData()
```

**5. User/Organization API**
```typescript
/src/lib/api/core.ts
✅ Structure defined - Need implementations:
- users.list()
- users.getById()
- users.getTeachers()
- schools.list()
- divisions.list()
- departments.list()
```

#### Tasks:
1. Implement API client functions with Firebase SDK
2. Set up React Query for data fetching/caching
3. Configure Zustand stores for global state
4. Add loading states and error handling
5. Test authentication flow end-to-end
6. Test CRUD operations for all entities

---

### Phase 4: Component Integration & Testing (Week 3-4)
**Goal:** Wire up all components with real data and test workflows

#### Integration Checklist:

**Landing Dashboard:**
- [x] Component built
- [ ] Connect to Firebase Auth
- [ ] Load user profile and permissions
- [ ] Display real observation counts
- [ ] Show real framework status
- [ ] Link to real schedule data

**Framework Configuration:**
- [x] Component built (FrameworkEditor)
- [ ] Connect to frameworks API
- [ ] Enable CRUD operations
- [ ] Test framework alignments
- [ ] Validate question ordering
- [ ] Test tag system

**Mobile Observation Capture:**
- [x] Component built
- [ ] Connect to observations API
- [ ] Implement auto-population from schedule ⚠️
- [ ] Test offline capabilities (PWA)
- [ ] Validate all form fields
- [ ] Test photo attachments
- [ ] Test submission flow

**Observation Scheduler:**
- [x] Component built
- [ ] Connect to schedules API ⚠️
- [ ] Show available teachers
- [ ] Display day types correctly
- [ ] Enable observation scheduling
- [ ] Test conflict detection

**Analytics Dashboard:**
- [x] Component built
- [ ] Connect to analytics API
- [ ] Display real metrics
- [ ] Test filters and date ranges
- [ ] Integrate Gemini AI insights
- [ ] Test data exports

**Data Management:**
- [x] Component built
- [ ] Connect to bulk operations API
- [ ] Test CSV imports
- [ ] Test data exports
- [ ] Validate data transformations
- [ ] Test error handling

**Admin Dashboard:**
- [x] Component built
- [ ] Connect to users API
- [ ] Enable user management
- [ ] Test role assignments
- [ ] Enable school/division/dept management
- [ ] Test permissions system

---

### Phase 5: Deployment & Production Setup (Week 4)
**Goal:** Deploy to Firebase and configure production environment

#### Deployment Steps:

**1. Firebase Project Setup**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Select services:
✓ Firestore
✓ Functions
✓ Hosting
✓ Storage

# Configure firebase.json
```

**2. Build Configuration**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {"source": "/api/**", "function": "api"},
      {"source": "**", "destination": "/index.html"}
    ]
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "runtime": "go121"
    }
  ]
}
```

**3. Environment Variables**
- Set Firebase project credentials
- Configure Gemini AI API key
- Set up email service credentials
- Configure CORS settings

**4. Security Rules**
- Deploy Firestore security rules
- Deploy Storage security rules
- Test role-based access controls
- Test data isolation between schools

**5. Deployment Scripts**
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

**6. Testing & Validation**
- Test all user flows in production
- Validate performance and loading times
- Test mobile PWA installation
- Verify offline capabilities
- Check analytics tracking
- Test email notifications

---

## 🎯 Implementation Priorities

### Priority 1: CRITICAL (Must Have for MVP)
1. ⚠️ **Schedule System** - Without this, observations can't auto-populate
2. Firebase Authentication integration
3. Observation CRUD with schedule integration
4. Framework management
5. Basic user management
6. Mobile observation form with real data

### Priority 2: HIGH (Needed for Launch)
7. Analytics dashboard with real data
8. Observation scheduler
9. Data import/export
10. Role-based permissions
11. Email notifications
12. Basic reporting

### Priority 3: MEDIUM (Post-Launch)
13. Gemini AI insights integration
14. Advanced analytics
15. Bulk operations
16. Admin dashboard enhancements
17. PWA offline mode
18. Advanced exports

### Priority 4: LOW (Future Enhancement)
19. Additional applets
20. Advanced scheduling features
21. Integration with other systems
22. Mobile app (native)
23. Advanced AI features

---

## 📝 Implementation Guidelines

### Code Organization:
1. **Keep concerns separated:**
   - Core platform features in `/core`
   - Applet-specific features in `/applets/[applet-name]`
   - Shared utilities in `/shared`

2. **Follow naming conventions:**
   - Components: PascalCase (`ObservationForm.tsx`)
   - Utilities: camelCase (`formatDate.ts`)
   - Constants: UPPER_SNAKE_CASE (`MAX_OBSERVATIONS`)

3. **Type everything:**
   - Define TypeScript interfaces for all data models
   - Mirror Go structs in TypeScript
   - Use strict type checking

4. **Error handling:**
   - Use try/catch blocks consistently
   - Log errors with context
   - Show user-friendly error messages
   - Track errors in Firebase Analytics

### Testing Strategy:
1. **Unit tests** for utilities and services
2. **Integration tests** for API endpoints
3. **E2E tests** for critical user flows
4. **Manual testing** for UI/UX

### Documentation:
1. Document all API endpoints
2. Add JSDoc comments to complex functions
3. Create user guides for each role
4. Maintain deployment runbook

---

## 📋 Immediate Next Steps

### Week 1 Action Items:
1. **Day 1-2:** Project structure cleanup
   - [ ] Create folder structure
   - [ ] Set up environment files
   - [ ] Initialize Git repository
   - [ ] Lock dependencies

2. **Day 3-4:** Schedule system backend
   - [ ] Implement schedule models in Go
   - [ ] Create schedule API endpoints
   - [ ] Write schedule business logic
   - [ ] Test schedule functions

3. **Day 5:** Schedule system frontend
   - [ ] Create schedule API client
   - [ ] Build React Query hooks
   - [ ] Create schedule components
   - [ ] Test schedule integration

### Week 2 Action Items:
1. **Continue schedule system** (if needed)
2. **Firebase integration** for existing components
3. **Authentication flow** implementation
4. **Testing** of core workflows

---

## 🚀 Success Metrics

### Technical Metrics:
- All components connected to real data
- Zero critical bugs in production
- Page load time < 2 seconds
- API response time < 500ms
- Test coverage > 70%

### User Metrics:
- 80+ observers onboarded
- 5,000 observations by May 2026
- 70% CRP evidence rate achieved
- < 5 min average observation time
- > 90% mobile usage

### Business Metrics:
- Platform deployed by target date
- All schools using system
- Data driving professional learning decisions
- Positive user feedback
- Cost within budget

---

## 📞 Support & Resources

### Documentation:
- Firebase Docs: https://firebase.google.com/docs
- Astro Docs: https://docs.astro.build
- React Query: https://tanstack.com/query
- Go Docs: https://go.dev/doc

### Key Files:
- `CRP_in_Action_Application_-_Development_Instructions.md` - Detailed technical specs
- `Gemini_AI_Setup_Guide_for_CRP_Analytics.md` - AI integration guide
- `firebase.json` - Firebase configuration
- `astro.config.mjs` - Frontend configuration

### Team Communication:
- Regular check-ins on progress
- Document blockers immediately
- Share wins and learnings
- Ask for help when stuck

---

## ✅ Definition of Done

A feature is "done" when:
1. ✅ Code written and reviewed
2. ✅ Tests passing
3. ✅ Documentation updated
4. ✅ Deployed to staging
5. ✅ User acceptance testing completed
6. ✅ Deployed to production
7. ✅ Monitoring in place

---

**Last Updated:** November 7, 2025
**Version:** 1.0
**Owner:** Bryan
