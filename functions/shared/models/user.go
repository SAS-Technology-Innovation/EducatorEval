package models

import "time"

// User represents a user in the platform
type User struct {
	// Identity
	ID          string `firestore:"id" json:"id"`
	Email       string `firestore:"email" json:"email"`
	FirstName   string `firestore:"firstName" json:"firstName"`
	LastName    string `firestore:"lastName" json:"lastName"`
	DisplayName string `firestore:"displayName" json:"displayName"`
	Avatar      string `firestore:"avatar,omitempty" json:"avatar,omitempty"`

	// School Structure - Users can belong to multiple divisions/departments
	EmployeeID    string   `firestore:"employeeId" json:"employeeId"`
	SchoolID      string   `firestore:"schoolId" json:"schoolId"`
	DivisionIDs   []string `firestore:"divisionIds" json:"divisionIds"`         // Can belong to multiple divisions
	DepartmentIDs []string `firestore:"departmentIds" json:"departmentIds"`     // Can belong to multiple departments

	// Role & Permissions
	PrimaryRole    UserRole   `firestore:"primaryRole" json:"primaryRole"`
	SecondaryRoles []UserRole `firestore:"secondaryRoles" json:"secondaryRoles"`
	Permissions    []string   `firestore:"permissions" json:"permissions"`

	// Professional Info
	Title     string   `firestore:"title" json:"title"`
	Subjects  []string `firestore:"subjects" json:"subjects"`
	Grades    []string `firestore:"grades" json:"grades"`

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

// UserRole defines the role types in the system
type UserRole string

const (
	// School Leadership
	HeadOfSchool       UserRole = "head_of_school"      // Replaces Superintendent for private schools
	Principal          UserRole = "principal"
	AssistantPrincipal UserRole = "assistant_principal"

	// Division Leadership
	DivisionDirector  UserRole = "division_director"
	AssistantDirector UserRole = "assistant_director"

	// Department Leadership
	DepartmentHead UserRole = "department_head"
	GradeChair     UserRole = "grade_chair"

	// Teaching Staff
	Teacher           UserRole = "teacher"
	SubstituteTeacher UserRole = "substitute_teacher"
	SpecialistTeacher UserRole = "specialist_teacher"

	// Instructional Support
	InstructionalCoach UserRole = "instructional_coach"
	PLCCoach           UserRole = "plc_coach"
	CurriculumCoord    UserRole = "curriculum_coordinator"
	AssessmentCoord    UserRole = "assessment_coordinator"

	// Student Support
	Counselor      UserRole = "counselor"
	SocialWorker   UserRole = "social_worker"
	Psychologist   UserRole = "psychologist"
	SpecialEdCoord UserRole = "special_education_coordinator"

	// Specialized Roles
	Observer        UserRole = "observer"
	DEISpecialist   UserRole = "dei_specialist"
	TechCoordinator UserRole = "technology_coordinator"
	Librarian       UserRole = "librarian"

	// Support Staff
	Secretary        UserRole = "secretary"
	Paraprofessional UserRole = "paraprofessional"
	SupportStaff     UserRole = "support_staff"

	// System Administration
	SuperAdmin  UserRole = "super_admin"
	SystemAdmin UserRole = "system_admin"
)

// Address represents a physical address
type Address struct {
	Street1    string `firestore:"street1" json:"street1"`
	Street2    string `firestore:"street2,omitempty" json:"street2,omitempty"`
	City       string `firestore:"city" json:"city"`
	State      string `firestore:"state" json:"state"`
	PostalCode string `firestore:"postalCode" json:"postalCode"`
	Country    string `firestore:"country" json:"country"`
}

// UserPreferences stores user-specific settings
type UserPreferences struct {
	Theme            string `firestore:"theme" json:"theme"`
	Language         string `firestore:"language" json:"language"`
	Timezone         string `firestore:"timezone" json:"timezone"`
	DateFormat       string `firestore:"dateFormat" json:"dateFormat"`
	TimeFormat       string `firestore:"timeFormat" json:"timeFormat"`
	DefaultDashboard string `firestore:"defaultDashboard" json:"defaultDashboard"`
}

// NotificationSettings controls how users receive notifications
type NotificationSettings struct {
	EmailNotifications    bool `firestore:"emailNotifications" json:"emailNotifications"`
	PushNotifications     bool `firestore:"pushNotifications" json:"pushNotifications"`
	SMSNotifications      bool `firestore:"smsNotifications" json:"smsNotifications"`
	ObservationReminders  bool `firestore:"observationReminders" json:"observationReminders"`
	EvaluationReminders   bool `firestore:"evaluationReminders" json:"evaluationReminders"`
	SystemAnnouncements   bool `firestore:"systemAnnouncements" json:"systemAnnouncements"`
	WeeklyReports         bool `firestore:"weeklyReports" json:"weeklyReports"`
	MonthlyReports        bool `firestore:"monthlyReports" json:"monthlyReports"`
}

// GetRolePermissions returns the default permissions for a given role
func GetRolePermissions(role UserRole) []string {
	switch role {
	case SuperAdmin, SystemAdmin:
		return []string{"*"} // All permissions

	case Superintendent:
		return []string{
			"users.read", "users.write", "users.delete",
			"schools.read", "schools.write", "schools.delete",
			"divisions.read", "divisions.write", "divisions.delete",
			"departments.read", "departments.write", "departments.delete",
			"applets.read", "applets.write", "applets.configure",
			"analytics.read", "analytics.write",
			"system.configure",
		}

	case Principal:
		return []string{
			"users.read", "users.write",
			"schools.read", "schools.write",
			"divisions.read", "divisions.write",
			"departments.read", "departments.write",
			"applets.read", "applets.write", "applets.configure",
			"analytics.read",
		}

	case AssistantPrincipal:
		return []string{
			"users.read", "users.write",
			"divisions.read", "divisions.write",
			"departments.read", "departments.write",
			"applets.read", "applets.write",
			"analytics.read",
		}

	case DivisionDirector:
		return []string{
			"users.read", "users.write",
			"divisions.read", "divisions.write",
			"departments.read", "departments.write",
			"applets.read", "applets.write",
			"analytics.read",
		}

	case AssistantDirector:
		return []string{
			"users.read", "users.write",
			"departments.read", "departments.write",
			"applets.read", "applets.write",
			"analytics.read",
		}

	case DepartmentHead:
		return []string{
			"users.read", "users.write",
			"departments.read", "departments.write",
			"applets.read", "applets.write",
			"analytics.read",
		}

	case Teacher, SpecialistTeacher:
		return []string{
			"users.read",
			"applets.read", "applets.write",
			"profile.read", "profile.write",
		}

	case InstructionalCoach, PLCCoach:
		return []string{
			"users.read", "users.write",
			"applets.read", "applets.write",
			"analytics.read",
		}

	case Observer:
		return []string{
			"users.read",
			"applets.read", "applets.write",
			"analytics.read",
		}

	default:
		return []string{
			"users.read",
			"applets.read",
			"profile.read", "profile.write",
		}
	}
}

// CanManageUsers checks if a role can manage other users
func CanManageUsers(role UserRole) bool {
	managementRoles := []UserRole{
		SuperAdmin, SystemAdmin, Superintendent, Principal, AssistantPrincipal,
		DivisionDirector, AssistantDirector, DepartmentHead,
	}
	
	for _, r := range managementRoles {
		if role == r {
			return true
		}
	}
	return false
}

// CanConfigureApplets checks if a role can configure applets
func CanConfigureApplets(role UserRole) bool {
	configRoles := []UserRole{
		SuperAdmin, SystemAdmin, Superintendent, Principal,
	}
	
	for _, r := range configRoles {
		if role == r {
			return true
		}
	}
	return false
}

// IsEducationalRole checks if this is an educational staff role
func IsEducationalRole(role UserRole) bool {
	educationalRoles := []UserRole{
		Teacher, SpecialistTeacher, SubstituteTeacher,
		InstructionalCoach, PLCCoach, CurriculumCoord, AssessmentCoord,
		Counselor, SocialWorker, Psychologist, SpecialEdCoord,
		DEISpecialist, Librarian,
	}
	
	for _, r := range educationalRoles {
		if role == r {
			return true
		}
	}
	return false
}
