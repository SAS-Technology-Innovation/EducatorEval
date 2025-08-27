package models

import "time"

// School represents a private or international school (top-level organization)
type School struct {
	ID        string `firestore:"id" json:"id"`
	Name      string `firestore:"name" json:"name"`
	ShortName string `firestore:"shortName" json:"shortName"`
	Type      SchoolType `firestore:"type" json:"type"` // private, international, etc.
	Address   *Address `firestore:"address" json:"address"`
	ContactInfo *ContactInfo `firestore:"contactInfo" json:"contactInfo"`

	// Leadership
	HeadOfSchoolID   string   `firestore:"headOfSchoolId,omitempty" json:"headOfSchoolId,omitempty"`
	PrincipalIDs     []string `firestore:"principalIds" json:"principalIds"`
	AssistantPrincipalIDs []string `firestore:"assistantPrincipalIds" json:"assistantPrincipalIds"`

	// School Identity
	Mission     string   `firestore:"mission,omitempty" json:"mission,omitempty"`
	Vision      string   `firestore:"vision,omitempty" json:"vision,omitempty"`
	Values      []string `firestore:"values,omitempty" json:"values,omitempty"`
	Languages   []string `firestore:"languages" json:"languages"` // For international schools
	Curriculum  []string `firestore:"curriculum" json:"curriculum"` // IB, Cambridge, AP, etc.

	// Applet Configuration
	EnabledApplets []string               `firestore:"enabledApplets" json:"enabledApplets"`
	AppletSettings map[string]interface{} `firestore:"appletSettings" json:"appletSettings"`

	// Settings
	Settings     map[string]interface{} `firestore:"settings" json:"settings"`
	Timezone     string                 `firestore:"timezone" json:"timezone"`
	AcademicYear *AcademicYear         `firestore:"academicYear" json:"academicYear"`

	CreatedAt time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `firestore:"updatedAt" json:"updatedAt"`
}

// SchoolType defines the type of school
type SchoolType string

const (
	PrivateSchool      SchoolType = "private"
	InternationalSchool SchoolType = "international" 
	BilingualSchool    SchoolType = "bilingual"
	ReligiousSchool    SchoolType = "religious"
	SpecialtySchool    SchoolType = "specialty"
)

// Division represents a school division (Elementary, Middle, High, etc.)
type Division struct {
	ID          string      `firestore:"id" json:"id"`
	SchoolID    string      `firestore:"schoolId" json:"schoolId"`
	Name        string      `firestore:"name" json:"name"`
	Type        DivisionType `firestore:"type" json:"type"`
	Description string      `firestore:"description" json:"description"`

	// Leadership
	DirectorID           string   `firestore:"directorId,omitempty" json:"directorId,omitempty"`
	AssistantDirectorIDs []string `firestore:"assistantDirectorIds" json:"assistantDirectorIds"`

	// Academic Info
	Grades       []string `firestore:"grades" json:"grades"`
	StudentCount int      `firestore:"studentCount,omitempty" json:"studentCount,omitempty"`

	// Settings
	Settings map[string]interface{} `firestore:"settings" json:"settings"`

	CreatedAt time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `firestore:"updatedAt" json:"updatedAt"`
}

// DivisionType defines the types of school divisions
type DivisionType string

const (
	Elementary          DivisionType = "elementary"
	Middle             DivisionType = "middle"
	High               DivisionType = "high"
	EarlyLearningCenter DivisionType = "early_learning_center"
	CentralAdmin       DivisionType = "central_admin"
	SpecialPrograms    DivisionType = "special_programs"
	Athletics          DivisionType = "athletics"
	FoodService        DivisionType = "food_service"
	Transportation     DivisionType = "transportation"
	Maintenance        DivisionType = "maintenance"
)

// Department represents a department within a division
type Department struct {
	ID          string `firestore:"id" json:"id"`
	SchoolID    string `firestore:"schoolId" json:"schoolId"`
	DivisionID  string `firestore:"divisionId" json:"divisionId"`
	Name        string `firestore:"name" json:"name"`
	Description string `firestore:"description" json:"description"`

	// Leadership
	HeadID  string   `firestore:"headId" json:"headId"`
	Members []string `firestore:"members" json:"members"`

	// Academic Info (for academic departments)
	Subjects []string `firestore:"subjects" json:"subjects"`
	Grades   []string `firestore:"grades" json:"grades"`

	// Administrative Info (for non-academic departments)
	Function string `firestore:"function,omitempty" json:"function,omitempty"`

	CreatedAt time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `firestore:"updatedAt" json:"updatedAt"`
}

// ContactInfo represents contact information
type ContactInfo struct {
	Phone     string `firestore:"phone" json:"phone"`
	Email     string `firestore:"email" json:"email"`
	Website   string `firestore:"website,omitempty" json:"website,omitempty"`
	Fax       string `firestore:"fax,omitempty" json:"fax,omitempty"`
	Extension string `firestore:"extension,omitempty" json:"extension,omitempty"`
}

// AcademicYear represents an academic year
type AcademicYear struct {
	Name      string    `firestore:"name" json:"name"`
	StartDate time.Time `firestore:"startDate" json:"startDate"`
	EndDate   time.Time `firestore:"endDate" json:"endDate"`
	Terms     []Term    `firestore:"terms" json:"terms"`
}

// Term represents a term within an academic year
type Term struct {
	Name      string    `firestore:"name" json:"name"`
	StartDate time.Time `firestore:"startDate" json:"startDate"`
	EndDate   time.Time `firestore:"endDate" json:"endDate"`
	IsActive  bool      `firestore:"isActive" json:"isActive"`
}

// GetExampleDepartments returns example departments for a division type
func GetExampleDepartments(divType DivisionType) []string {
	switch divType {
	case Elementary:
		return []string{
			"Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
			"Special Education", "ESL/ELL", "Art & Music", "PE & Health", "Library/Media",
		}
	case Middle:
		return []string{
			"6th Grade", "7th Grade", "8th Grade", "English Language Arts", "Mathematics",
			"Science", "Social Studies", "Special Education", "ESL/ELL", "Arts & Electives", "PE & Health",
		}
	case High:
		return []string{
			"English", "Mathematics", "Science", "Social Studies", "World Languages", "Fine Arts",
			"Career & Technical Education", "Special Education", "ESL/ELL", "PE & Health", "Guidance & Counseling",
		}
	case EarlyLearningCenter:
		return []string{
			"Pre-K 3", "Pre-K 4", "Head Start", "Early Intervention", "Family Services",
		}
	case CentralAdmin:
		return []string{
			"Curriculum & Instruction", "Special Education Services", "Technology", "Human Resources",
			"Finance & Operations", "Communications", "Professional Development", "Student Services",
			"Assessment & Accountability",
		}
	default:
		return []string{"General Department"}
	}
}

// IsAcademicDivision checks if a division type is academic
func IsAcademicDivision(divType DivisionType) bool {
	academicDivisions := []DivisionType{Elementary, Middle, High, EarlyLearningCenter}
	for _, d := range academicDivisions {
		if divType == d {
			return true
		}
	}
	return false
}

// GetDivisionGrades returns typical grades for a division type
func GetDivisionGrades(divType DivisionType) []string {
	switch divType {
	case EarlyLearningCenter:
		return []string{"Pre-K 3", "Pre-K 4"}
	case Elementary:
		return []string{"K", "1", "2", "3", "4", "5"}
	case Middle:
		return []string{"6", "7", "8"}
	case High:
		return []string{"9", "10", "11", "12"}
	default:
		return []string{}
	}
}
