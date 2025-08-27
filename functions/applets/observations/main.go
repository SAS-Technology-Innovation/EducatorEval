package main

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"time"

	firebase "firebase.google.com/go/v4"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/middleware"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/models"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/services"
	"github.com/gin-gonic/gin"
)

var (
	firestoreService *services.FirestoreService
	authService      *services.AuthService
)

func init() {
	functions.HTTP("observationsApplet", handleObservationsAPI)
	functions.Firestore("onObservationCreated", onObservationCreated)
	functions.Firestore("onObservationUpdated", onObservationUpdated)
	
	// Initialize Firebase services
	ctx := context.Background()
	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to create Firebase app: %v", err)
	}
	
	firestoreService, err = services.NewFirestoreService(app)
	if err != nil {
		log.Fatalf("Failed to create Firestore service: %v", err)
	}
	
	authService, err = services.NewAuthService(app)
	if err != nil {
		log.Fatalf("Failed to create Auth service: %v", err)
	}
}

func handleObservationsAPI(w http.ResponseWriter, r *http.Request) {
	gin.SetMode(gin.ReleaseMode)
	router := setupObservationsRouter()
	router.ServeHTTP(w, r)
}

func setupObservationsRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		
		c.Next()
	})

	api := router.Group("/api/v1/applets/observations")
	api.Use(middleware.AuthMiddleware(authService))
	{
		// SCHEDULE-INTEGRATED OBSERVATION ENDPOINTS (CRITICAL FEATURES)
		api.POST("/create-with-schedule", middleware.RequirePermission("applets.observations.write"), createObservationWithSchedule)
		api.POST("/auto-populate", middleware.RequirePermission("applets.observations.read"), autoPopulateObservation)
		
		// Standard observation CRUD
		observations := api.Group("/observations")
		observations.Use(middleware.RequirePermission("applets.observations.read"))
		{
			observations.GET("", listObservations)
			observations.POST("", middleware.RequirePermission("applets.observations.write"), createObservation)
			observations.GET("/:id", getObservation)
			observations.PUT("/:id", middleware.RequirePermission("applets.observations.write"), updateObservation)
			observations.DELETE("/:id", middleware.RequirePermission("applets.observations.delete"), deleteObservation)
			
			// Observation workflow
			observations.PUT("/:id/submit", middleware.RequirePermission("applets.observations.write"), submitObservation)
			observations.PUT("/:id/review", middleware.RequirePermission("applets.observations.review"), reviewObservation)
			observations.PUT("/:id/approve", middleware.RequirePermission("applets.observations.approve"), approveObservation)
			
			// Observation sharing and collaboration
			observations.POST("/:id/share", middleware.RequirePermission("applets.observations.write"), shareObservation)
			observations.GET("/:id/comments", getObservationComments)
			observations.POST("/:id/comments", middleware.RequirePermission("applets.observations.write"), addObservationComment)
		}

		// Framework management
		frameworks := api.Group("/frameworks")
		frameworks.Use(middleware.RequirePermission("applets.observations.frameworks.read"))
		{
			frameworks.GET("", listFrameworks)
			frameworks.POST("", middleware.RequirePermission("applets.observations.frameworks.write"), createFramework)
			frameworks.GET("/:id", getFramework)
			frameworks.PUT("/:id", middleware.RequirePermission("applets.observations.frameworks.write"), updateFramework)
			frameworks.DELETE("/:id", middleware.RequirePermission("applets.observations.frameworks.delete"), deleteFramework)
			
			// Framework queries
			frameworks.GET("/for-class", getFrameworksForClass)
			frameworks.GET("/by-type/:type", getFrameworksByType)
			frameworks.GET("/:id/sections", getFrameworkSections)
			
			// Framework publishing and versioning
			frameworks.PUT("/:id/publish", middleware.RequirePermission("applets.observations.frameworks.publish"), publishFramework)
			frameworks.POST("/:id/version", middleware.RequirePermission("applets.observations.frameworks.write"), createFrameworkVersion)
		}

		// Analytics with schedule insights
		analytics := api.Group("/analytics")
		analytics.Use(middleware.RequirePermission("applets.observations.analytics.read"))
		{
			analytics.GET("/dashboard", getObservationDashboard)
			analytics.POST("/schedule-patterns", getSchedulePatterns)
			analytics.GET("/framework/:frameworkId", getFrameworkAnalytics)
			analytics.GET("/teacher/:teacherId", getTeacherAnalytics)
			analytics.GET("/division/:divisionId", getDivisionAnalytics)
			
			// Report generation
			analytics.POST("/reports/generate", middleware.RequirePermission("applets.observations.reports.generate"), generateReport)
			analytics.GET("/reports/:reportId", getReport)
		}
		
		// Import/Export functionality
		dataOps := api.Group("/data")
		dataOps.Use(middleware.RequirePermission("applets.observations.read"))
		{
			dataOps.GET("/export/observations", exportObservations)
			dataOps.GET("/export/frameworks", exportFrameworks)
			dataOps.POST("/import/observations", middleware.RequirePermission("applets.observations.write"), importObservations)
			dataOps.POST("/import/frameworks", middleware.RequirePermission("applets.observations.frameworks.write"), importFrameworks)
		}
	}

	return router
}

// Observation Models (based on your comprehensive instructions)

type Observation struct {
	// Core Identification
	ID         string `firestore:"id" json:"id"`
	SchoolID   string `firestore:"schoolId" json:"schoolId"`
	DivisionID string `firestore:"divisionId" json:"divisionId"`
	DepartmentID string `firestore:"departmentId,omitempty" json:"departmentId,omitempty"`
	
	// Participants
	SubjectID   string `firestore:"subjectId" json:"subjectId"`     // Teacher being observed
	SubjectName string `firestore:"subjectName" json:"subjectName"`
	ObserverID  string `firestore:"observerId" json:"observerId"`
	ObserverName string `firestore:"observerName" json:"observerName"`
	
	// Schedule Integration (CRITICAL FOR AUTO-POPULATION)
	ScheduledClassID string `firestore:"scheduledClassId,omitempty" json:"scheduledClassId,omitempty"`
	DayType          string `firestore:"dayType" json:"dayType"`                                     
	Period           string `firestore:"period" json:"period"`                                       
	
	// Context (flexible for different observation types)
	Context ObservationContext `firestore:"context" json:"context"`
	
	// Framework & Data
	FrameworkID      string               `firestore:"frameworkId" json:"frameworkId"`
	FrameworkName    string               `firestore:"frameworkName" json:"frameworkName"`
	FrameworkVersion string               `firestore:"frameworkVersion" json:"frameworkVersion"`
	Responses        []ObservationResponse `firestore:"responses" json:"responses"`
	OverallComments  string               `firestore:"overallComments" json:"overallComments"`
	
	// Analysis (calculated based on framework)
	EvidenceCount      int             `firestore:"evidenceCount" json:"evidenceCount"`
	TotalQuestions     int             `firestore:"totalQuestions" json:"totalQuestions"`
	EvidencePercentage float64         `firestore:"evidencePercentage" json:"evidencePercentage"`
	FrameworkScores    []FrameworkScore `firestore:"frameworkScores" json:"frameworkScores"`
	
	// Status & Workflow
	Status      string     `firestore:"status" json:"status"` // draft, completed, submitted, reviewed
	SubmittedAt *time.Time `firestore:"submittedAt,omitempty" json:"submittedAt,omitempty"`
	ReviewedAt  *time.Time `firestore:"reviewedAt,omitempty" json:"reviewedAt,omitempty"`
	
	// System
	CreatedAt time.Time              `firestore:"createdAt" json:"createdAt"`
	UpdatedAt time.Time              `firestore:"updatedAt" json:"updatedAt"`
	Version   int                    `firestore:"version" json:"version"`
	Metadata  map[string]interface{} `firestore:"metadata" json:"metadata"`
}

type ObservationContext struct {
	Type string `firestore:"type" json:"type"` // classroom, meeting, evaluation, etc.
	
	// For classroom observations (AUTO-POPULATED FROM SCHEDULE)
	ClassName    string   `firestore:"className,omitempty" json:"className,omitempty"`
	CourseID     string   `firestore:"courseId,omitempty" json:"courseId,omitempty"`
	CourseName   string   `firestore:"courseName,omitempty" json:"courseName,omitempty"`
	CourseCode   string   `firestore:"courseCode,omitempty" json:"courseCode,omitempty"`
	Subject      string   `firestore:"subject,omitempty" json:"subject,omitempty"`
	Grade        string   `firestore:"grade,omitempty" json:"grade,omitempty"`
	GradeLevel   []string `firestore:"gradeLevel,omitempty" json:"gradeLevel,omitempty"`
	RoomNumber   string   `firestore:"roomNumber,omitempty" json:"roomNumber,omitempty"`
	Building     string   `firestore:"building,omitempty" json:"building,omitempty"`
	Location     string   `firestore:"location,omitempty" json:"location,omitempty"`
	StudentCount int      `firestore:"studentCount,omitempty" json:"studentCount,omitempty"`
	
	// Special Class Designations (AUTO-POPULATED)
	IsHonors    bool `firestore:"isHonors,omitempty" json:"isHonors,omitempty"`
	IsAP        bool `firestore:"isAP,omitempty" json:"isAP,omitempty"`
	IsIB        bool `firestore:"isIB,omitempty" json:"isIB,omitempty"`
	IsSpecialEd bool `firestore:"isSpecialEd,omitempty" json:"isSpecialEd,omitempty"`
	IsESL       bool `firestore:"isESL,omitempty" json:"isESL,omitempty"`
	IsInclusion bool `firestore:"isInclusion,omitempty" json:"isInclusion,omitempty"`
	
	// Co-teaching (AUTO-POPULATED)
	CoTeachers        []string `firestore:"coTeachers,omitempty" json:"coTeachers,omitempty"`
	Paraprofessionals []string `firestore:"paraprofessionals,omitempty" json:"paraprofessionals,omitempty"`
	
	// For evaluations or other observation types
	Position   string `firestore:"position,omitempty" json:"position,omitempty"`
	Division   string `firestore:"division,omitempty" json:"division,omitempty"`
	Department string `firestore:"department,omitempty" json:"department,omitempty"`
	
	// Timing
	Date      time.Time  `firestore:"date" json:"date"`
	StartTime time.Time  `firestore:"startTime" json:"startTime"`
	EndTime   *time.Time `firestore:"endTime,omitempty" json:"endTime,omitempty"`
	Duration  int        `firestore:"duration" json:"duration"` // minutes
	
	// Manual Overrides (for when auto-population needs correction)
	ManualOverrides map[string]interface{} `firestore:"manualOverrides,omitempty" json:"manualOverrides,omitempty"`
}

type ObservationResponse struct {
	QuestionID    string                 `firestore:"questionId" json:"questionId"`
	SectionID     string                 `firestore:"sectionId" json:"sectionId"`
	QuestionText  string                 `firestore:"questionText" json:"questionText"`
	ResponseType  string                 `firestore:"responseType" json:"responseType"` // evidence, rating, text, etc.
	EvidenceFound bool                   `firestore:"evidenceFound" json:"evidenceFound"`
	Rating        int                    `firestore:"rating,omitempty" json:"rating,omitempty"`
	Comments      string                 `firestore:"comments,omitempty" json:"comments,omitempty"`
	Timestamp     time.Time              `firestore:"timestamp" json:"timestamp"`
	Metadata      map[string]interface{} `firestore:"metadata,omitempty" json:"metadata,omitempty"`
}

type FrameworkScore struct {
	SectionID        string  `firestore:"sectionId" json:"sectionId"`
	SectionName      string  `firestore:"sectionName" json:"sectionName"`
	EvidenceFound    int     `firestore:"evidenceFound" json:"evidenceFound"`
	TotalQuestions   int     `firestore:"totalQuestions" json:"totalQuestions"`
	EvidencePercent  float64 `firestore:"evidencePercent" json:"evidencePercent"`
	AverageRating    float64 `firestore:"averageRating,omitempty" json:"averageRating,omitempty"`
	MaxPossibleScore float64 `firestore:"maxPossibleScore,omitempty" json:"maxPossibleScore,omitempty"`
}

type Framework struct {
	ID          string `firestore:"id" json:"id"`
	Name        string `firestore:"name" json:"name"`
	Description string `firestore:"description" json:"description"`
	Type        string `firestore:"type" json:"type"` // observation, evaluation, assessment
	Version     string `firestore:"version" json:"version"`
	Status      string `firestore:"status" json:"status"` // active, draft, archived, deprecated
	
	// School & Access
	SchoolID     string     `firestore:"schoolId" json:"schoolId"`
	CreatedBy    string     `firestore:"createdBy" json:"createdBy"`
	ApprovedBy   string     `firestore:"approvedBy,omitempty" json:"approvedBy,omitempty"`
	ApprovedAt   *time.Time `firestore:"approvedAt,omitempty" json:"approvedAt,omitempty"`
	
	// Applicable Divisions (framework can be used across divisions)
	ApplicableDivisions []models.DivisionType `firestore:"applicableDivisions" json:"applicableDivisions"`
	ApplicableSubjects  []string              `firestore:"applicableSubjects" json:"applicableSubjects"`
	ApplicableGrades    []string              `firestore:"applicableGrades" json:"applicableGrades"`
	
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
	UsageCount            int        `firestore:"usageCount" json:"usageCount"`
	LastUsed              *time.Time `firestore:"lastUsed,omitempty" json:"lastUsed,omitempty"`
	AverageCompletionTime int        `firestore:"averageCompletionTime" json:"averageCompletionTime"`
	AverageEvidenceScore  float64    `firestore:"averageEvidenceScore" json:"averageEvidenceScore"`
	
	// System
	CreatedAt time.Time              `firestore:"createdAt" json:"createdAt"`
	UpdatedAt time.Time              `firestore:"updatedAt" json:"updatedAt"`
	Metadata  map[string]interface{} `firestore:"metadata" json:"metadata"`
}

type FrameworkSection struct {
	ID          string              `firestore:"id" json:"id"`
	Name        string              `firestore:"name" json:"name"`
	Description string              `firestore:"description" json:"description"`
	Order       int                 `firestore:"order" json:"order"`
	Questions   []FrameworkQuestion `firestore:"questions" json:"questions"`
	Weight      float64             `firestore:"weight,omitempty" json:"weight,omitempty"`
	IsRequired  bool                `firestore:"isRequired" json:"isRequired"`
}

type FrameworkQuestion struct {
	ID           string                 `firestore:"id" json:"id"`
	Text         string                 `firestore:"text" json:"text"`
	Description  string                 `firestore:"description,omitempty" json:"description,omitempty"`
	Type         string                 `firestore:"type" json:"type"` // evidence, rating, text, multiple_choice
	Order        int                    `firestore:"order" json:"order"`
	IsRequired   bool                   `firestore:"isRequired" json:"isRequired"`
	Options      []string               `firestore:"options,omitempty" json:"options,omitempty"`
	RatingScale  *RatingScale           `firestore:"ratingScale,omitempty" json:"ratingScale,omitempty"`
	Metadata     map[string]interface{} `firestore:"metadata,omitempty" json:"metadata,omitempty"`
}

type RatingScale struct {
	Min         int      `firestore:"min" json:"min"`
	Max         int      `firestore:"max" json:"max"`
	Labels      []string `firestore:"labels" json:"labels"`
	Description string   `firestore:"description,omitempty" json:"description,omitempty"`
}

type FrameworkAlignment struct {
	Type        string `firestore:"type" json:"type"` // standard, competency, domain
	Code        string `firestore:"code" json:"code"`
	Description string `firestore:"description" json:"description"`
	QuestionIDs []string `firestore:"questionIds" json:"questionIds"`
}

// === CRITICAL FUNCTION: createObservationWithSchedule ===

func createObservationWithSchedule(c *gin.Context) {
	var req struct {
		SubjectID       string                 `json:"subjectId" binding:"required"`
		FrameworkID     string                 `json:"frameworkId" binding:"required"`
		Date            time.Time              `json:"date"`
		Period          string                 `json:"period,omitempty"`
		ManualOverrides map[string]interface{} `json:"manualOverrides,omitempty"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Use current time if no date provided
	if req.Date.IsZero() {
		req.Date = time.Now()
	}
	
	// Get current user (observer)
	currentUser := middleware.GetCurrentUser(c)
	
	// Call schedule service to get current class information
	scheduleData, err := callScheduleService(req.SubjectID, req.Date, req.Period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get schedule information: " + err.Error()})
		return
	}
	
	if scheduleData["currentClass"] == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No class found for specified time"})
		return
	}
	
	// Extract class information
	classData := scheduleData["currentClass"].(map[string]interface{})
	dayType := scheduleData["dayType"].(map[string]interface{})
	period := scheduleData["period"].(map[string]interface{})
	educator := scheduleData["educator"].(map[string]interface{})
	
	// Get framework to populate framework name
	framework, err := getFrameworkByID(req.FrameworkID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Framework not found"})
		return
	}
	
	// Generate observation ID
	observationID := generateObservationID()
	
	// Build observation with auto-populated data from schedule
	observation := &Observation{
		ID:         observationID,
		SchoolID:   currentUser.SchoolID,
		DivisionID: currentUser.DivisionID,
		DepartmentID: currentUser.DepartmentID,
		
		// Participants
		SubjectID:   req.SubjectID,
		SubjectName: educator["name"].(string),
		ObserverID:  currentUser.ID,
		ObserverName: currentUser.Email, // Would be better to use display name
		
		// Schedule Integration
		ScheduledClassID: classData["id"].(string),
		DayType:         dayType["shortName"].(string),
		Period:          period["id"].(string),
		
		// Framework
		FrameworkID:      req.FrameworkID,
		FrameworkName:    framework.Name,
		FrameworkVersion: framework.Version,
		
		// Context (auto-populated from schedule)
		Context: ObservationContext{
			Type:        "classroom",
			ClassName:   getStringFromInterface(classData["className"]),
			CourseID:    getStringFromInterface(classData["courseId"]),
			CourseName:  getStringFromInterface(classData["courseName"]),
			CourseCode:  getStringFromInterface(classData["courseCode"]),
			Subject:     getStringFromInterface(classData["subject"]),
			Grade:       getStringFromInterface(classData["grade"]),
			GradeLevel:  getStringSliceFromInterface(classData["gradeLevel"]),
			RoomNumber:  getStringFromInterface(classData["roomNumber"]),
			Building:    getStringFromInterface(classData["building"]),
			Location:    getStringFromInterface(classData["location"]),
			StudentCount: getIntFromInterface(classData["studentCount"]),
			CoTeachers:  getStringSliceFromInterface(classData["coTeachers"]),
			Paraprofessionals: getStringSliceFromInterface(classData["paraprofessionals"]),
			IsHonors:    getBoolFromInterface(classData["isHonors"]),
			IsAP:        getBoolFromInterface(classData["isAP"]),
			IsIB:        getBoolFromInterface(classData["isIB"]),
			IsSpecialEd: getBoolFromInterface(classData["isSpecialEd"]),
			IsESL:       getBoolFromInterface(classData["isESL"]),
			IsInclusion: getBoolFromInterface(classData["isInclusion"]),
			Date:        req.Date,
			StartTime:   req.Date,
			Duration:    0, // Will be set when observation is completed
			ManualOverrides: req.ManualOverrides,
		},
		
		// Initialize empty responses based on framework
		Responses: []ObservationResponse{},
		
		// System fields
		Status:    "draft",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Version:   1,
		Metadata:  make(map[string]interface{}),
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
			"period":  period,
			"class":   classData,
			"educator": educator,
		},
		"message": "Observation created with auto-populated schedule data",
	})
}

// autoPopulateObservation - Get schedule data for observation form
func autoPopulateObservation(c *gin.Context) {
	var req struct {
		TeacherID string    `json:"teacherId" binding:"required"`
		Date      time.Time `json:"date"`
		Period    string    `json:"period,omitempty"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Use current time if no date provided
	if req.Date.IsZero() {
		req.Date = time.Now()
	}
	
	// Call schedule service
	scheduleData, err := callScheduleService(req.TeacherID, req.Date, req.Period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get schedule information"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"scheduleData": scheduleData,
		"message":     "Schedule data retrieved for observation auto-population",
	})
}

// Helper functions for schedule service integration

func callScheduleService(educatorID string, date time.Time, period string) (map[string]interface{}, error) {
	// In a real implementation, this would make an HTTP call to the schedule service
	// For now, return mock data that matches the expected structure
	return map[string]interface{}{
		"currentClass": map[string]interface{}{
			"id":         "class_123",
			"className":  "Algebra I - Period 3",
			"courseId":   "course_456",
			"courseName": "Algebra I",
			"courseCode": "ALG1",
			"subject":    "Mathematics",
			"grade":      "9",
			"gradeLevel": []string{"9"},
			"roomNumber": "201",
			"building":   "Main",
			"location":   "Main Building, Room 201",
			"studentCount": 28,
			"coTeachers": []string{},
			"paraprofessionals": []string{},
			"isHonors":   false,
			"isAP":       false,
			"isIB":       false,
			"isSpecialEd": false,
			"isESL":      false,
			"isInclusion": true,
		},
		"dayType": map[string]interface{}{
			"id":        "A",
			"name":      "Day A",
			"shortName": "A",
		},
		"period": map[string]interface{}{
			"id":        "period_3",
			"name":      "Period 3",
			"shortName": "P3",
			"startTime": "10:15",
			"endTime":   "11:05",
		},
		"educator": map[string]interface{}{
			"id":   educatorID,
			"name": "Sample Teacher",
		},
		"currentTime": time.Now().Format("15:04"),
		"date":        date.Format("2006-01-02"),
	}, nil
}

func getFrameworkByID(frameworkID string) (*Framework, error) {
	// Mock implementation - would query Firestore in reality
	return &Framework{
		ID:          frameworkID,
		Name:        "CRP in Action Framework",
		Description: "Culturally Responsive Practices observation framework",
		Type:        "observation",
		Version:     "1.0",
		Status:      "active",
	}, nil
}

func generateObservationID() string {
	// Generate a unique ID for the observation
	return "obs_" + strconv.FormatInt(time.Now().UnixNano(), 36)
}

// Helper functions for type conversion
func getStringFromInterface(value interface{}) string {
	if value == nil {
		return ""
	}
	if str, ok := value.(string); ok {
		return str
	}
	return ""
}

func getStringSliceFromInterface(value interface{}) []string {
	if value == nil {
		return []string{}
	}
	if slice, ok := value.([]interface{}); ok {
		result := make([]string, len(slice))
		for i, v := range slice {
			if str, ok := v.(string); ok {
				result[i] = str
			}
		}
		return result
	}
	if slice, ok := value.([]string); ok {
		return slice
	}
	return []string{}
}

func getIntFromInterface(value interface{}) int {
	if value == nil {
		return 0
	}
	if num, ok := value.(int); ok {
		return num
	}
	if num, ok := value.(float64); ok {
		return int(num)
	}
	return 0
}

func getBoolFromInterface(value interface{}) bool {
	if value == nil {
		return false
	}
	if b, ok := value.(bool); ok {
		return b
	}
	return false
}

// Standard CRUD operations (simplified implementations)

func listObservations(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	// Build filters based on permissions and query params
	filters := make(map[string]interface{})
	
	// Apply school filter for non-super admins
	if currentUser.Role != models.SuperAdmin {
		filters["schoolId"] = currentUser.SchoolID
	}
	
	// Apply additional filters from query params
	if divisionId := c.Query("divisionId"); divisionId != "" {
		filters["divisionId"] = divisionId
	}
	if subjectId := c.Query("subjectId"); subjectId != "" {
		filters["subjectId"] = subjectId
	}
	if observerId := c.Query("observerId"); observerId != "" {
		filters["observerId"] = observerId
	}
	if status := c.Query("status"); status != "" {
		filters["status"] = status
	}
	if frameworkId := c.Query("frameworkId"); frameworkId != "" {
		filters["frameworkId"] = frameworkId
	}
	
	// Parse pagination
	limit := 50 // default
	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}
	
	// Query observations (mock implementation)
	c.JSON(http.StatusOK, gin.H{
		"observations": []gin.H{},
		"total":        0,
		"filters":      filters,
		"limit":        limit,
	})
}

func createObservation(c *gin.Context) {
	var observation Observation
	if err := c.ShouldBindJSON(&observation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	// Set observer information
	observation.ObserverID = currentUser.ID
	observation.ObserverName = currentUser.Email
	observation.ID = generateObservationID()
	observation.CreatedAt = time.Now()
	observation.UpdatedAt = time.Now()
	observation.Status = "draft"
	observation.Version = 1
	
	// Validate permissions
	if observation.SchoolID != currentUser.SchoolID && currentUser.Role != models.SuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot create observation for different school"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"observation": observation})
}

func getObservation(c *gin.Context) {
	observationId := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	// Mock implementation - would query Firestore
	observation := &Observation{
		ID:         observationId,
		SchoolID:   currentUser.SchoolID,
		ObserverID: currentUser.ID,
		Status:     "draft",
	}
	
	c.JSON(http.StatusOK, gin.H{"observation": observation})
}

func updateObservation(c *gin.Context) {
	observationId := c.Param("id")
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	updates["updatedAt"] = time.Now()
	
	c.JSON(http.StatusOK, gin.H{
		"message":       "Observation updated successfully",
		"observationId": observationId,
		"updates":       updates,
	})
}

func deleteObservation(c *gin.Context) {
	observationId := c.Param("id")
	
	c.JSON(http.StatusOK, gin.H{
		"message":       "Observation deleted successfully",
		"observationId": observationId,
	})
}

func submitObservation(c *gin.Context) {
	observationId := c.Param("id")
	
	updates := map[string]interface{}{
		"status":      "submitted",
		"submittedAt": time.Now(),
		"updatedAt":   time.Now(),
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message":       "Observation submitted successfully",
		"observationId": observationId,
		"updates":       updates,
	})
}

func reviewObservation(c *gin.Context) {
	observationId := c.Param("id")
	
	var req struct {
		ReviewComments string `json:"reviewComments"`
		Status         string `json:"status"` // reviewed, needs_revision
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	updates := map[string]interface{}{
		"status":         req.Status,
		"reviewedAt":     time.Now(),
		"reviewedBy":     currentUser.ID,
		"reviewComments": req.ReviewComments,
		"updatedAt":      time.Now(),
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message":       "Observation reviewed successfully",
		"observationId": observationId,
		"updates":       updates,
	})
}

func approveObservation(c *gin.Context) {
	observationId := c.Param("id")
	
	c.JSON(http.StatusOK, gin.H{
		"message":       "Observation approved successfully",
		"observationId": observationId,
	})
}

// Framework management functions (simplified)
func listFrameworks(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"frameworks": []gin.H{}})
}

func createFramework(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Framework created"})
}

func getFramework(c *gin.Context) {
	frameworkId := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"frameworkId": frameworkId})
}

func updateFramework(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Framework updated"})
}

func deleteFramework(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Framework deleted"})
}

func getFrameworksForClass(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"frameworks": []gin.H{}})
}

func getFrameworksByType(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"frameworks": []gin.H{}})
}

func getFrameworkSections(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"sections": []gin.H{}})
}

func publishFramework(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Framework published"})
}

func createFrameworkVersion(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Framework version created"})
}

// Analytics functions (simplified)
func getObservationDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"dashboard": "data"})
}

func getSchedulePatterns(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"patterns": []gin.H{}})
}

func getFrameworkAnalytics(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"analytics": "data"})
}

func getTeacherAnalytics(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"analytics": "data"})
}

func getDivisionAnalytics(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"analytics": "data"})
}

func generateReport(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"reportId": "report_123"})
}

func getReport(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"report": "data"})
}

// Data operations (simplified)
func exportObservations(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Export initiated"})
}

func exportFrameworks(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Export initiated"})
}

func importObservations(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Import initiated"})
}

func importFrameworks(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Import initiated"})
}

// Sharing and collaboration
func shareObservation(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Observation shared"})
}

func getObservationComments(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"comments": []gin.H{}})
}

func addObservationComment(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Comment added"})
}

// Firestore triggers for observation events
func onObservationCreated(ctx context.Context, e FirestoreEvent) error {
	log.Printf("Observation created: %v", e.Value.Fields)
	// Implement notification logic, analytics updates, etc.
	return nil
}

func onObservationUpdated(ctx context.Context, e FirestoreEvent) error {
	log.Printf("Observation updated: %v", e.Value.Fields)
	// Implement notification logic, analytics updates, etc.
	return nil
}

// FirestoreEvent represents a Firestore document event
type FirestoreEvent struct {
	Value    FirestoreValue `json:"value"`
	OldValue FirestoreValue `json:"oldValue"`
}

type FirestoreValue struct {
	Fields map[string]interface{} `json:"fields"`
}

func main() {
	// This is only used for local development
	// In production, the Functions Framework handles the HTTP routing
}