# EducatorEval Role System

## Overview

The EducatorEval platform uses a simplified role-based access control (RBAC) system that separates **platform roles** (which determine permissions) from **job titles** (which are for display and organizational purposes).

## Platform Roles

Platform roles determine what users can do in the system. There are 6 main roles:

### 1. **Super Admin** (`super_admin`)
- **Purpose**: System administrators with full platform access
- **Permissions**: All permissions (`*`)
- **Can**: Manage everything, configure system settings, manage all users
- **Typical Users**: IT administrators, platform maintainers

### 2. **Administrator** (`administrator`) 
- **Purpose**: School/district administrators who manage the platform
- **Permissions**: User management, organization settings, observation management
- **Can**: Manage users, configure schools, view all data, manage observations
- **Typical Users**: Principals, superintendents, district administrators

### 3. **Manager** (`manager`)
- **Purpose**: Department heads and team leads who manage their teams
- **Permissions**: Team observation, team reports, limited user management
- **Can**: Observe their team members, view team reports, manage team schedules
- **Typical Users**: Department heads, grade chairs, curriculum coordinators

### 4. **Observer** (`observer`)
- **Purpose**: Staff who can conduct observations and evaluations
- **Permissions**: Create observations, view assigned observations, generate reports
- **Can**: Conduct observations, access observation tools, view assigned data
- **Typical Users**: Instructional coaches, evaluation specialists

### 5. **Educator** (`educator`)
- **Purpose**: Teachers and instructional staff who are observed
- **Permissions**: View their own data, update profile, access professional development
- **Can**: View their observations, access their reports, manage their profile
- **Typical Users**: Teachers, counselors, librarians

### 6. **Staff** (`staff`)
- **Purpose**: Support staff with limited platform access
- **Permissions**: Basic profile access
- **Can**: Update their profile, view basic information
- **Typical Users**: Administrative assistants, paraprofessionals, support staff

## Job Titles

Job titles are separate from platform roles and are used for:
- Display purposes (showing someone's actual position)
- Organizational structure
- Reporting and analytics
- Professional identification

### Examples of Job Titles:
- `teacher`, `principal`, `superintendent`
- `department_head`, `grade_chair`, `curriculum_coordinator`
- `counselor`, `librarian`, `instructional_coach`
- `secretary`, `administrative_assistant`, `paraprofessional`

## Role Assignment Logic

When creating users, the system suggests platform roles based on job titles:

| Job Title | Suggested Role | Reasoning |
|-----------|---------------|-----------|
| Superintendent, Principal | Administrator | Need to manage school operations |
| Department Head, Grade Chair | Manager | Manage their department/grade team |
| Instructional Coach | Observer | Conduct observations and coaching |
| Teacher, Counselor | Educator | Primary focus is education/student support |
| Secretary, Aide | Staff | Support roles with basic access needs |

## Permission System

Each role has specific permissions:

### Staff Permissions:
- `profile.read`, `profile.update`

### Educator Permissions:
- Profile management
- `observations.read_own` (view their observations)
- `schedule.read_own`, `reports.read_own`

### Observer Permissions:
- All Educator permissions, plus:
- `observations.create` (conduct new observations)
- `observations.read_assigned` (view assigned observations)

### Manager Permissions:
- All Observer permissions, plus:
- `observations.read_team`, `observations.manage_team`
- `users.read_team`, `schedule.read_team`
- `reports.read_team`, `reports.create_team`

### Administrator Permissions:
- `observations.*` (all observation permissions)
- `users.*` (all user management)
- `organizations.*` (manage schools/districts)
- `reports.*`, `schedule.*`, `applets.configure`

### Super Admin Permissions:
- `*` (all permissions)

## Migration from Old System

The old system mixed job titles with platform roles (e.g., `principal`, `teacher`, `counselor` as roles). The new system:

1. **Preserves job titles** as a separate field for organizational purposes
2. **Simplifies roles** to 6 clear permission levels
3. **Maintains backwards compatibility** through role mapping utilities

### Migration Path:
- Old role `principal` → New role `administrator`, job title `principal`
- Old role `teacher` → New role `educator`, job title `teacher`
- Old role `instructional_coach` → New role `observer`, job title `instructional_coach`

## Benefits of New System

1. **Clearer Permissions**: Easy to understand what each role can do
2. **Flexible Assignment**: Job titles don't dictate permissions
3. **Easier Management**: Fewer roles to manage and configure
4. **Better Security**: Clear hierarchy and permission boundaries
5. **Organizational Clarity**: Job titles preserved for org charts and reporting

## Implementation

The role system is implemented in:
- `src/types/core.ts` - Type definitions
- `src/utils/roleMapping.ts` - Utilities and mappings
- `src/stores/authStore.ts` - Authentication logic
- `src/components/providers/AuthWrapper.tsx` - Access control

## Usage Examples

```typescript
// Check if user can manage others
const canManage = useAuthStore(state => state.canManage());

// Check specific permission
const canCreateObservations = hasPermission(user.primaryRole, 'observations.create');

// Display user's role and job title
const roleDisplay = getRoleDisplayName(user.primaryRole); // "Super Admin"
const jobDisplay = getJobTitleDisplayName(user.jobTitle); // "Principal"
```