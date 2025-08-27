package main

import (
	"context"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"time"

	firebase "firebase.google.com/go/v4"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/middleware"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/models"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/services"
	"github.com/gin-gonic/gin"
	"cloud.google.com/go/firestore"
)

var (
	firestoreService *services.FirestoreService
	authService      *services.AuthService
	firestoreClient  *firestore.Client
)

func init() {
	functions.HTTP("schedulesAPI", handleSchedulesAPI)
	
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
	
	// Get direct Firestore client for import operations
	firestoreClient = firestoreService.GetClient()
}

func handleSchedulesAPI(w http.ResponseWriter, r *http.Request) {
	gin.SetMode(gin.ReleaseMode)
	router := setupSchedulesRouter()
	router.ServeHTTP(w, r)
}

func setupSchedulesRouter() *gin.Engine {
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

	api := router.Group("/api/v1/schedules")
	api.Use(middleware.AuthMiddleware(authService))
	{
		// Current class lookup for observations (CRITICAL FOR AUTO-POPULATION)
		api.POST("/current-class", middleware.RequirePermission("schedules.read"), getCurrentClass)
		api.POST("/day-schedule", middleware.RequirePermission("schedules.read"), getDaySchedule)
		api.POST("/week-schedule", middleware.RequirePermission("schedules.read"), getWeekSchedule)
		api.POST("/current-day-type", middleware.RequirePermission("schedules.read"), getCurrentDayType)
		api.POST("/available-teachers", middleware.RequirePermission("schedules.read"), getAvailableTeachers)
		
		// Schedule validation and conflicts
		api.POST("/validate-schedule", middleware.RequirePermission("schedules.write"), validateSchedule)
		api.POST("/check-conflicts", middleware.RequirePermission("schedules.write"), checkScheduleConflicts)
		
		// Schedule import endpoints
		api.POST("/import", middleware.RequirePermission("schedules.admin"), importScheduleCSV)
		api.GET("/import-template", getImportTemplate)
		
		// Master schedule management
		masterSchedules := api.Group("/master-schedules")
		masterSchedules.Use(middleware.RequirePermission("schedules.read"))
		{
			masterSchedules.GET("", listMasterSchedules)
			masterSchedules.POST("", middleware.RequirePermission("schedules.write"), createMasterSchedule)
			masterSchedules.GET("/:id", getMasterSchedule)
			masterSchedules.PUT("/:id", middleware.RequirePermission("schedules.write"), updateMasterSchedule)
			masterSchedules.DELETE("/:id", middleware.RequirePermission("schedules.delete"), deleteMasterSchedule)
		}
		
		// Educator schedule management
		educatorSchedules := api.Group("/educator-schedules")
		educatorSchedules.Use(middleware.RequirePermission("schedules.read"))
		{
			educatorSchedules.GET("", listEducatorSchedules)
			educatorSchedules.POST("", middleware.RequirePermission("schedules.write"), createEducatorSchedule)
			educatorSchedules.GET("/:id", getEducatorSchedule)
			educatorSchedules.PUT("/:id", middleware.RequirePermission("schedules.write"), updateEducatorSchedule)
			educatorSchedules.DELETE("/:id", middleware.RequirePermission("schedules.delete"), deleteEducatorSchedule)
			
			// Class assignments
			educatorSchedules.GET("/:id/classes", getEducatorClasses)
			educatorSchedules.POST("/:id/classes", middleware.RequirePermission("schedules.write"), addClassAssignment)
		}
		
		// Class assignment management  
		classes := api.Group("/class-assignments")
		classes.Use(middleware.RequirePermission("schedules.read"))
		{
			classes.GET("", listClassAssignments)
			classes.POST("", middleware.RequirePermission("schedules.write"), createClassAssignment)
			classes.GET("/:id", getClassAssignment)
			classes.PUT("/:id", middleware.RequirePermission("schedules.write"), updateClassAssignment)
			classes.DELETE("/:id", middleware.RequirePermission("schedules.delete"), deleteClassAssignment)
		}
	}

	return router
}

// Models for schedule system (based on your instructions)

type MasterSchedule struct {
	ID           string    `firestore:"id" json:"id"`
	SchoolID     string    `firestore:"schoolId" json:"schoolId"`
	Name         string    `firestore:"name" json:"name"`
	AcademicYear string    `firestore:"academicYear" json:"academicYear"`
	ScheduleType string    `firestore:"scheduleType" json:"scheduleType"` // traditional, block, rotating, etc.
	DayTypes     []DayType `firestore:"dayTypes" json:"dayTypes"`
	Periods      []Period  `firestore:"periods" json:"periods"`
	StartDate    time.Time `firestore:"startDate" json:"startDate"`
	EndDate      time.Time `firestore:"endDate" json:"endDate"`
	IsActive     bool      `firestore:"isActive" json:"isActive"`
	CreatedAt    time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type DayType struct {
	ID          string `firestore:"id" json:"id"`
	Name        string `firestore:"name" json:"name"`        // "Day A", "Monday", "Blue Day"
	ShortName   string `firestore:"shortName" json:"shortName"` // "A", "M", "Blue"  
	Description string `firestore:"description,omitempty" json:"description,omitempty"`
	Color       string `firestore:"color,omitempty" json:"color,omitempty"`
	Order       int    `firestore:"order" json:"order"`
}

type Period struct {
	ID             string   `firestore:"id" json:"id"`
	Name           string   `firestore:"name" json:"name"`
	ShortName      string   `firestore:"shortName" json:"shortName"`
	StartTime      string   `firestore:"startTime" json:"startTime"` // "08:00"
	EndTime        string   `firestore:"endTime" json:"endTime"`     // "08:50"
	Duration       int      `firestore:"duration" json:"duration"`   // Minutes
	Order          int      `firestore:"order" json:"order"`
	Type           string   `firestore:"type" json:"type"` // class, lunch, planning, etc.
	ApplicableDays []string `firestore:"applicableDays" json:"applicableDays"` // Day type IDs
}

type EducatorSchedule struct {
	ID               string            `firestore:"id" json:"id"`
	EducatorID       string            `firestore:"educatorId" json:"educatorId"`
	EducatorName     string            `firestore:"educatorName" json:"educatorName"`
	SchoolID         string            `firestore:"schoolId" json:"schoolId"`
	DivisionID       string            `firestore:"divisionId" json:"divisionId"`
	MasterScheduleID string            `firestore:"masterScheduleId" json:"masterScheduleId"`
	AcademicYear     string            `firestore:"academicYear" json:"academicYear"`
	Semester         string            `firestore:"semester,omitempty" json:"semester,omitempty"`
	ClassAssignments []ClassAssignment `firestore:"classAssignments" json:"classAssignments"`
	TotalPeriods     int               `firestore:"totalPeriods" json:"totalPeriods"`
	TeachingPeriods  int               `firestore:"teachingPeriods" json:"teachingPeriods"`
	PlanningPeriods  int               `firestore:"planningPeriods" json:"planningPeriods"`
	TeachingLoad     float64           `firestore:"teachingLoad" json:"teachingLoad"`
	StartDate        time.Time         `firestore:"startDate" json:"startDate"`
	EndDate          time.Time         `firestore:"endDate" json:"endDate"`
	IsActive         bool              `firestore:"isActive" json:"isActive"`
	CreatedAt        time.Time         `firestore:"createdAt" json:"createdAt"`
	UpdatedAt        time.Time         `firestore:"updatedAt" json:"updatedAt"`
}

type ClassAssignment struct {
	ID                string   `firestore:"id" json:"id"`
	ClassName         string   `firestore:"className" json:"className"`
	CourseID          string   `firestore:"courseId,omitempty" json:"courseId,omitempty"`
	CourseName        string   `firestore:"courseName" json:"courseName"`
	CourseCode        string   `firestore:"courseCode,omitempty" json:"courseCode,omitempty"`
	Subject           string   `firestore:"subject" json:"subject"`
	Grade             string   `firestore:"grade" json:"grade"`
	GradeLevel        []string `firestore:"gradeLevel" json:"gradeLevel"`
	DayTypes          []string `firestore:"dayTypes" json:"dayTypes"`          // ["A", "B"] or ["Monday", "Wednesday"]
	Periods           []string `firestore:"periods" json:"periods"`           // Period IDs
	RoomNumber        string   `firestore:"roomNumber" json:"roomNumber"`
	Building          string   `firestore:"building,omitempty" json:"building,omitempty"`
	Location          string   `firestore:"location,omitempty" json:"location,omitempty"`
	StudentCount      int      `firestore:"studentCount,omitempty" json:"studentCount,omitempty"`
	MaxCapacity       int      `firestore:"maxCapacity,omitempty" json:"maxCapacity,omitempty"`
	CoTeachers        []string `firestore:"coTeachers" json:"coTeachers"`
	Paraprofessionals []string `firestore:"paraprofessionals" json:"paraprofessionals"`
	IsHonors          bool     `firestore:"isHonors" json:"isHonors"`
	IsAP              bool     `firestore:"isAP" json:"isAP"`
	IsIB              bool     `firestore:"isIB" json:"isIB"`
	IsSpecialEd       bool     `firestore:"isSpecialEd" json:"isSpecialEd"`
	IsESL             bool     `firestore:"isESL" json:"isESL"`
	IsInclusion       bool     `firestore:"isInclusion" json:"isInclusion"`
	Notes             string   `firestore:"notes,omitempty" json:"notes,omitempty"`
	Tags              []string `firestore:"tags" json:"tags"`
	IsActive          bool     `firestore:"isActive" json:"isActive"`
}

// === CRITICAL FUNCTION: getCurrentClass (for observation auto-population) ===

func getCurrentClass(c *gin.Context) {
	var req struct {
		EducatorID string    `json:"educatorId" binding:"required"`
		Date       time.Time `json:"date"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Use current time if no date provided
	if req.Date.IsZero() {
		req.Date = time.Now()
	}
	
	// Get educator's schedule
	schedule, err := getEducatorScheduleByEducatorID(req.EducatorID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found for educator"})
		return
	}
	
	// Get master schedule to determine day type and current period
	masterSchedule, err := getMasterScheduleByID(schedule.MasterScheduleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Master schedule not found"})
		return
	}
	
	// Determine current day type (simplified - you'd implement actual rotation logic)
	dayType := determineDayType(masterSchedule, req.Date)
	if dayType == nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "No school day or unrecognized day type",
			"date":    req.Date.Format("2006-01-02"),
		})
		return
	}
	
	// Find current period
	currentTime := req.Date.Format("15:04")
	currentPeriod := findCurrentPeriod(masterSchedule, currentTime, dayType.ID)
	if currentPeriod == nil {
		c.JSON(http.StatusOK, gin.H{
			"message":     "No current period",
			"dayType":     dayType,
			"currentTime": currentTime,
			"date":        req.Date.Format("2006-01-02"),
		})
		return
	}
	
	// Find class assignment for current period and day type
	var currentClass *ClassAssignment
	for i, assignment := range schedule.ClassAssignments {
		if contains(assignment.DayTypes, dayType.ID) && contains(assignment.Periods, currentPeriod.ID) {
			currentClass = &schedule.ClassAssignments[i]
			break
		}
	}
	
	if currentClass == nil {
		c.JSON(http.StatusOK, gin.H{
			"message":     "No class scheduled",
			"dayType":     dayType,
			"period":      currentPeriod,
			"currentTime": currentTime,
			"date":        req.Date.Format("2006-01-02"),
		})
		return
	}
	
	// Return current class with all context needed for observation auto-population
	c.JSON(http.StatusOK, gin.H{
		"currentClass": currentClass,
		"dayType":      dayType,
		"period":       currentPeriod,
		"currentTime":  currentTime,
		"date":         req.Date.Format("2006-01-02"),
		"educator": gin.H{
			"id":   schedule.EducatorID,
			"name": schedule.EducatorName,
		},
		"schedule": gin.H{
			"id":       schedule.ID,
			"schoolId": schedule.SchoolID,
			"divisionId": schedule.DivisionID,
		},
	})
}

// getAvailableTeachers - Critical for observation scheduling
func getAvailableTeachers(c *gin.Context) {
	var req struct {
		SchoolID string    `json:"schoolId" binding:"required"`
		Date     time.Time `json:"date" binding:"required"`
		Period   string    `json:"period,omitempty"` // Optional - if empty, returns all teachers with any classes
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	// Get all active teachers in the school
	teachers, err := firestoreService.ListUsers(map[string]interface{}{
		"schoolId": req.SchoolID,
		"isActive": true,
		"primaryRole": "teacher", // Could expand to include other teaching roles
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get teachers"})
		return
	}
	
	// Get master schedule for the school
	masterSchedules, err := firestoreService.ListMasterSchedules(map[string]interface{}{
		"schoolId": req.SchoolID,
		"isActive": true,
	})
	if err != nil || len(masterSchedules) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No active master schedule found"})
		return
	}
	
	masterSchedule := masterSchedules[0] // Use the active master schedule
	
	// Determine day type for the requested date
	dayType := determineDayType(masterSchedule, req.Date)
	if dayType == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date or no school day"})
		return
	}
	
	var availableTeachers []gin.H
	
	for _, teacher := range teachers {
		// Get teacher's schedule
		schedule, err := getEducatorScheduleByEducatorID(teacher.ID)
		if err != nil {
			continue // Skip teachers without schedules
		}
		
		// Check access permissions
		if currentUser.SchoolID != teacher.SchoolID && currentUser.Role != models.SuperAdmin {
			continue
		}
		
		// Find classes for this teacher on the specified day/period
		var teacherClasses []ClassAssignment
		for _, assignment := range schedule.ClassAssignments {
			if contains(assignment.DayTypes, dayType.ID) {
				if req.Period == "" || contains(assignment.Periods, req.Period) {
					teacherClasses = append(teacherClasses, assignment)
				}
			}
		}
		
		if len(teacherClasses) > 0 {
			teacherInfo := gin.H{
				"teacher": gin.H{
					"id":           teacher.ID,
					"name":         teacher.DisplayName,
					"firstName":    teacher.FirstName,
					"lastName":     teacher.LastName,
					"email":        teacher.Email,
					"divisionId":   teacher.DivisionID,
					"departmentId": teacher.DepartmentID,
					"subjects":     teacher.Subjects,
					"grades":       teacher.Grades,
				},
				"classes":    teacherClasses,
				"canObserve": true,
			}
			
			// If specific period requested, include only that period's class
			if req.Period != "" && len(teacherClasses) > 0 {
				teacherInfo["currentClass"] = teacherClasses[0]
			}
			
			availableTeachers = append(availableTeachers, teacherInfo)
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"availableTeachers": availableTeachers,
		"dayType":           dayType,
		"period":            req.Period,
		"date":              req.Date.Format("2006-01-02"),
		"totalTeachers":     len(availableTeachers),
	})
}

// Helper functions

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func determineDayType(masterSchedule *MasterSchedule, date time.Time) *DayType {
	// Simplified implementation - in reality, you'd implement proper rotation logic
	// For now, use weekday-based logic
	weekday := date.Weekday()
	
	// Skip weekends
	if weekday == time.Saturday || weekday == time.Sunday {
		return nil
	}
	
	// Find appropriate day type based on schedule type
	switch masterSchedule.ScheduleType {
	case "traditional":
		// Every day is the same
		if len(masterSchedule.DayTypes) > 0 {
			return &masterSchedule.DayTypes[0]
		}
	case "rotating":
		// Implement rotation logic (simplified)
		dayIndex := int(weekday-1) % len(masterSchedule.DayTypes) // Monday = 0
		if dayIndex < len(masterSchedule.DayTypes) {
			return &masterSchedule.DayTypes[dayIndex]
		}
	default:
		// Default to first day type
		if len(masterSchedule.DayTypes) > 0 {
			return &masterSchedule.DayTypes[0]
		}
	}
	
	return nil
}

func findCurrentPeriod(masterSchedule *MasterSchedule, currentTime, dayTypeID string) *Period {
	for _, period := range masterSchedule.Periods {
		// Check if period applies to this day type
		if !contains(period.ApplicableDays, dayTypeID) {
			continue
		}
		
		// Parse times and check if current time falls within period
		if currentTime >= period.StartTime && currentTime <= period.EndTime {
			return &period
		}
	}
	return nil
}

// Database helper functions (you'd implement these with your Firestore service)

func getEducatorScheduleByEducatorID(educatorID string) (*EducatorSchedule, error) {
	// Implementation would query Firestore for educator's schedule
	// For now, return a mock structure
	return &EducatorSchedule{
		ID:               "schedule_" + educatorID,
		EducatorID:       educatorID,
		EducatorName:     "Sample Teacher",
		SchoolID:         "school_123",
		DivisionID:       "division_456", 
		MasterScheduleID: "master_schedule_789",
		AcademicYear:     "2024-2025",
		ClassAssignments: []ClassAssignment{
			{
				ID:         "class_1",
				ClassName:  "Algebra I - Period 1",
				CourseName: "Algebra I",
				Subject:    "Mathematics",
				Grade:      "9",
				DayTypes:   []string{"A", "B"},
				Periods:    []string{"period_1"},
				RoomNumber: "201",
			},
		},
		IsActive: true,
	}, nil
}

func getMasterScheduleByID(scheduleID string) (*MasterSchedule, error) {
	// Implementation would query Firestore
	return &MasterSchedule{
		ID:           scheduleID,
		SchoolID:     "school_123",
		Name:         "2024-2025 Master Schedule",
		AcademicYear: "2024-2025",
		ScheduleType: "rotating",
		DayTypes: []DayType{
			{ID: "A", Name: "Day A", ShortName: "A", Order: 1},
			{ID: "B", Name: "Day B", ShortName: "B", Order: 2},
		},
		Periods: []Period{
			{
				ID:             "period_1",
				Name:           "Period 1",
				ShortName:      "P1",
				StartTime:      "08:00",
				EndTime:        "08:50",
				Duration:       50,
				Order:          1,
				Type:           "class",
				ApplicableDays: []string{"A", "B"},
			},
		},
		IsActive: true,
	}, nil
}

// Additional endpoint implementations (simplified for brevity)

func getDaySchedule(c *gin.Context) {
	// Implementation for getting full day schedule
	c.JSON(http.StatusOK, gin.H{"message": "Day schedule endpoint"})
}

func getWeekSchedule(c *gin.Context) {
	// Implementation for getting week schedule
	c.JSON(http.StatusOK, gin.H{"message": "Week schedule endpoint"})
}

func getCurrentDayType(c *gin.Context) {
	// Implementation for getting current day type
	c.JSON(http.StatusOK, gin.H{"message": "Current day type endpoint"})
}

func validateSchedule(c *gin.Context) {
	// Implementation for validating schedule
	c.JSON(http.StatusOK, gin.H{"message": "Schedule validation endpoint"})
}

func checkScheduleConflicts(c *gin.Context) {
	// Implementation for checking conflicts
	c.JSON(http.StatusOK, gin.H{"message": "Conflict check endpoint"})
}

// Master Schedule CRUD operations
func listMasterSchedules(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List master schedules"})
}

func createMasterSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Create master schedule"})
}

func getMasterSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get master schedule"})
}

func updateMasterSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update master schedule"})
}

func deleteMasterSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Delete master schedule"})
}

// Educator Schedule CRUD operations  
func listEducatorSchedules(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List educator schedules"})
}

func createEducatorSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Create educator schedule"})
}

func getEducatorSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get educator schedule"})
}

func updateEducatorSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update educator schedule"})
}

func deleteEducatorSchedule(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Delete educator schedule"})
}

func getEducatorClasses(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get educator classes"})
}

func addClassAssignment(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Add class assignment"})
}

// Class Assignment CRUD operations
func listClassAssignments(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List class assignments"})
}

func createClassAssignment(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Create class assignment"})
}

func getClassAssignment(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get class assignment"})
}

func updateClassAssignment(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update class assignment"})
}

func deleteClassAssignment(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Delete class assignment"})
}

func main() {
	// This is only used for local development
	// In production, the Functions Framework handles the HTTP routing
}