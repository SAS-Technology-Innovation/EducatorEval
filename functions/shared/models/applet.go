package models

import "time"

// Applet represents an applet in the system
type Applet struct {
	ID          string `firestore:"id" json:"id"`
	Name        string `firestore:"name" json:"name"`
	Description string `firestore:"description" json:"description"`
	Version     string `firestore:"version" json:"version"`
	Category    string `firestore:"category" json:"category"`

	// Configuration
	Status              AppletStatus           `firestore:"status" json:"status"`
	Configuration       map[string]interface{} `firestore:"configuration" json:"configuration"`
	DefaultSettings     map[string]interface{} `firestore:"defaultSettings" json:"defaultSettings"`
	ConfigurableSettings map[string]interface{} `firestore:"configurableSettings" json:"configurableSettings"`
	IsActive            bool                   `firestore:"isActive" json:"isActive"`

	// Access Control
	SupportedDivisions  []DivisionType `firestore:"supportedDivisions" json:"supportedDivisions"`
	RequiredRoles       []UserRole     `firestore:"requiredRoles" json:"requiredRoles"`
	RequiredPermissions []string       `firestore:"requiredPermissions" json:"requiredPermissions"`

	// Deployment
	FunctionEndpoint string                 `firestore:"functionEndpoint" json:"functionEndpoint"`
	UIComponents    []AppletUIComponent     `firestore:"uiComponents" json:"uiComponents"`
	Routes          []AppletRoute          `firestore:"routes" json:"routes"`
	Permissions     []string               `firestore:"permissions" json:"permissions"`

	// Integration
	Dependencies     []string               `firestore:"dependencies" json:"dependencies"`
	APIVersion       string                 `firestore:"apiVersion" json:"apiVersion"`
	DataCollections  []string               `firestore:"dataCollections" json:"dataCollections"`
	DataCollected    []string               `firestore:"dataCollected" json:"dataCollected"`
	
	// Features
	SupportsScheduling bool `firestore:"supportsScheduling" json:"supportsScheduling"`
	SupportsMobile     bool `firestore:"supportsMobile" json:"supportsMobile"`

	// Metadata
	Author      string                 `firestore:"author" json:"author"`
	Icon        string                 `firestore:"icon" json:"icon"`
	Tags        []string               `firestore:"tags" json:"tags"`
	Documentation string               `firestore:"documentation,omitempty" json:"documentation,omitempty"`

	// System
	CreatedAt time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `firestore:"updatedAt" json:"updatedAt"`
}

// AppletStatus defines the status of an applet
type AppletStatus string

const (
	AppletStatusDraft      AppletStatus = "draft"
	AppletStatusActive     AppletStatus = "active"
	AppletStatusInactive   AppletStatus = "inactive"
	AppletStatusDeprecated AppletStatus = "deprecated"
	AppletStatusBeta       AppletStatus = "beta"
)

// AppletUIComponent represents a UI component provided by an applet
type AppletUIComponent struct {
	Name        string `firestore:"name" json:"name"`
	Type        string `firestore:"type" json:"type"` // page, component, modal, etc.
	Path        string `firestore:"path" json:"path"`
	Title       string `firestore:"title" json:"title"`
	Description string `firestore:"description,omitempty" json:"description,omitempty"`
	Icon        string `firestore:"icon,omitempty" json:"icon,omitempty"`
	Order       int    `firestore:"order" json:"order"`
}

// AppletRoute represents a route provided by an applet
type AppletRoute struct {
	Path        string   `firestore:"path" json:"path"`
	Method      string   `firestore:"method" json:"method"`
	Handler     string   `firestore:"handler" json:"handler"`
	Permissions []string `firestore:"permissions" json:"permissions"`
	Description string   `firestore:"description,omitempty" json:"description,omitempty"`
}

// SchoolAppletConfig represents applet configuration for a specific school
type SchoolAppletConfig struct {
	ID         string `firestore:"id" json:"id"`
	SchoolID   string `firestore:"schoolId" json:"schoolId"`
	AppletID   string `firestore:"appletId" json:"appletId"`
	AppletName string `firestore:"appletName" json:"appletName"` // Cached for performance

	// Configuration
	IsEnabled            bool                   `firestore:"isEnabled" json:"isEnabled"`
	Settings             map[string]interface{} `firestore:"settings" json:"settings"`
	CustomFields         map[string]interface{} `firestore:"customFields,omitempty" json:"customFields,omitempty"`
	ScheduleSettings     map[string]interface{} `firestore:"scheduleSettings,omitempty" json:"scheduleSettings,omitempty"`
	NotificationSettings map[string]interface{} `firestore:"notificationSettings,omitempty" json:"notificationSettings,omitempty"`

	// Access Control
	EnabledForDivisions []DivisionType `firestore:"enabledForDivisions" json:"enabledForDivisions"`
	EnabledForRoles     []UserRole     `firestore:"enabledForRoles" json:"enabledForRoles"`
	
	// Administrators
	AppletAdmins []string `firestore:"appletAdmins" json:"appletAdmins"` // User IDs

	// Usage Tracking
	LastUsed    *time.Time `firestore:"lastUsed,omitempty" json:"lastUsed,omitempty"`
	UsageCount  int        `firestore:"usageCount" json:"usageCount"`
	ActiveUsers int        `firestore:"activeUsers" json:"activeUsers"`

	// System
	ConfiguredBy string    `firestore:"configuredBy" json:"configuredBy"`
	CreatedAt    time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time `firestore:"updatedAt" json:"updatedAt"`
}

// AppletRegistry represents the system-wide applet registry
type AppletRegistry struct {
	ID            string              `firestore:"id" json:"id"`
	RegisteredApplets []AppletRegistration `firestore:"registeredApplets" json:"registeredApplets"`
	UpdatedAt     time.Time           `firestore:"updatedAt" json:"updatedAt"`
}

// AppletRegistration represents a registered applet
type AppletRegistration struct {
	AppletID    string       `firestore:"appletId" json:"appletId"`
	Name        string       `firestore:"name" json:"name"`
	Version     string       `firestore:"version" json:"version"`
	Status      AppletStatus `firestore:"status" json:"status"`
	RegisteredAt time.Time    `firestore:"registeredAt" json:"registeredAt"`
}

// GetCoreApplets returns the list of core applets
func GetCoreApplets() []Applet {
	return []Applet{
		{
			ID:          "observations",
			Name:        "Observation System",
			Description: "Classroom observation and evaluation system with framework support",
			Version:     "1.0.0",
			Category:    "evaluation",
			Status:      AppletStatusActive,
			FunctionEndpoint: "/api/v1/applets/observations",
			UIComponents: []AppletUIComponent{
				{
					Name:  "observation-dashboard",
					Type:  "page",
					Path:  "/observations",
					Title: "Observations",
					Icon:  "eye",
					Order: 1,
				},
				{
					Name:  "observation-form",
					Type:  "page",
					Path:  "/observe",
					Title: "New Observation",
					Icon:  "plus-circle",
					Order: 2,
				},
				{
					Name:  "frameworks",
					Type:  "page",
					Path:  "/frameworks",
					Title: "Frameworks",
					Icon:  "layers",
					Order: 3,
				},
			},
			Routes: []AppletRoute{
				{
					Path:        "/api/v1/applets/observations/observations",
					Method:      "GET",
					Handler:     "listObservations",
					Permissions: []string{"applets.observations.read"},
				},
				{
					Path:        "/api/v1/applets/observations/observations",
					Method:      "POST",
					Handler:     "createObservation",
					Permissions: []string{"applets.observations.write"},
				},
				{
					Path:        "/api/v1/applets/observations/frameworks",
					Method:      "GET",
					Handler:     "listFrameworks",
					Permissions: []string{"applets.observations.frameworks.read"},
				},
			},
			Permissions: []string{
				"applets.observations.read",
				"applets.observations.write",
				"applets.observations.delete",
				"applets.observations.frameworks.read",
				"applets.observations.frameworks.write",
				"applets.observations.analytics.read",
			},
			DataCollections: []string{
				"applets/observations/observations",
				"applets/observations/frameworks",
				"applets/observations/analytics",
			},
			Author: "SAS Technology Innovation",
			Icon:   "eye",
			Tags:   []string{"evaluation", "observation", "crp", "assessment"},
		},
		{
			ID:          "evaluations",
			Name:        "Performance Evaluations",
			Description: "Employee performance evaluation and review system",
			Version:     "1.0.0",
			Category:    "hr",
			Status:      AppletStatusBeta,
			FunctionEndpoint: "/api/v1/applets/evaluations",
			UIComponents: []AppletUIComponent{
				{
					Name:  "evaluation-dashboard",
					Type:  "page",
					Path:  "/evaluations",
					Title: "Evaluations",
					Icon:  "star",
					Order: 1,
				},
			},
			Routes: []AppletRoute{
				{
					Path:        "/api/v1/applets/evaluations/evaluations",
					Method:      "GET",
					Handler:     "listEvaluations",
					Permissions: []string{"applets.evaluations.read"},
				},
			},
			Permissions: []string{
				"applets.evaluations.read",
				"applets.evaluations.write",
			},
			DataCollections: []string{
				"applets/evaluations/evaluations",
			},
			Author: "SAS Technology Innovation",
			Icon:   "star",
			Tags:   []string{"hr", "evaluation", "performance"},
		},
		{
			ID:          "professional-learning",
			Name:        "Professional Learning",
			Description: "Professional development and learning management system",
			Version:     "1.0.0",
			Category:    "development",
			Status:      AppletStatusDraft,
			FunctionEndpoint: "/api/v1/applets/learning",
			UIComponents: []AppletUIComponent{
				{
					Name:  "learning-dashboard",
					Type:  "page",
					Path:  "/learning",
					Title: "Professional Learning",
					Icon:  "book",
					Order: 1,
				},
			},
			Routes: []AppletRoute{
				{
					Path:        "/api/v1/applets/learning/activities",
					Method:      "GET",
					Handler:     "listActivities",
					Permissions: []string{"applets.learning.read"},
				},
			},
			Permissions: []string{
				"applets.learning.read",
				"applets.learning.write",
			},
			DataCollections: []string{
				"applets/learning/activities",
			},
			Author: "SAS Technology Innovation",
			Icon:   "book",
			Tags:   []string{"development", "learning", "certification"},
		},
	}
}

// GetAppletForUser returns applets accessible to a user based on their role and school config
func GetAppletForUser(user *User, schoolConfigs []SchoolAppletConfig) []Applet {
	var userApplets []Applet
	coreApplets := GetCoreApplets()
	
	for _, applet := range coreApplets {
		// Find school config for this applet
		var config *SchoolAppletConfig
		for _, sc := range schoolConfigs {
			if sc.AppletID == applet.ID && sc.SchoolID == user.SchoolID {
				config = &sc
				break
			}
		}
		
		// Skip if not enabled for school
		if config == nil || !config.IsEnabled {
			continue
		}
		
		// Check if enabled for user's division
		divisionEnabled := len(config.EnabledForDivisions) == 0 // Empty means all divisions
		for _, divType := range config.EnabledForDivisions {
			// This would need division lookup in real implementation
			_ = divType
			divisionEnabled = true // Simplified for now
			break
		}
		if !divisionEnabled {
			continue
		}
		
		// Check if enabled for user's role
		roleEnabled := len(config.EnabledForRoles) == 0 // Empty means all roles
		for _, role := range config.EnabledForRoles {
			if role == user.PrimaryRole {
				roleEnabled = true
				break
			}
		}
		for _, role := range config.EnabledForRoles {
			for _, userRole := range user.SecondaryRoles {
				if role == userRole {
					roleEnabled = true
					break
				}
			}
		}
		if !roleEnabled {
			continue
		}
		
		userApplets = append(userApplets, applet)
	}
	
	return userApplets
}
