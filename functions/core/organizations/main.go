package main

import (
	"context"
	"log"
	"net/http"
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
	functions.HTTP("organizationsAPI", handleOrganizationsAPI)
	
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

func handleOrganizationsAPI(w http.ResponseWriter, r *http.Request) {
	gin.SetMode(gin.ReleaseMode)
	router := setupOrganizationsRouter()
	router.ServeHTTP(w, r)
}

func setupOrganizationsRouter() *gin.Engine {
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

	api := router.Group("/api/v1/organizations")
	api.Use(middleware.AuthMiddleware(authService))
	{
		// School operations
		schools := api.Group("/schools")
		{
			schools.GET("", middleware.RequirePermission("schools.read"), listSchools)
			schools.POST("", middleware.RequirePermission("schools.write"), createSchool)
			schools.GET("/:id", middleware.RequirePermission("schools.read"), getSchool)
			schools.PUT("/:id", middleware.RequirePermission("schools.write"), updateSchool)
			schools.DELETE("/:id", middleware.RequirePermission("schools.delete"), deleteSchool)
			
			// School-specific operations
			schools.GET("/:id/divisions", middleware.RequirePermission("divisions.read"), getSchoolDivisions)
			schools.GET("/:id/users", middleware.RequirePermission("users.read"), getSchoolUsers)
			schools.GET("/:id/applets", middleware.RequirePermission("applets.read"), getSchoolApplets)
		}
		
		// Division operations
		divisions := api.Group("/divisions")
		{
			divisions.GET("", middleware.RequirePermission("divisions.read"), listDivisions)
			divisions.POST("", middleware.RequirePermission("divisions.write"), createDivision)
			divisions.GET("/:id", middleware.RequirePermission("divisions.read"), getDivision)
			divisions.PUT("/:id", middleware.RequirePermission("divisions.write"), updateDivision)
			divisions.DELETE("/:id", middleware.RequirePermission("divisions.delete"), deleteDivision)
			
			// Division-specific operations
			divisions.GET("/:id/departments", middleware.RequirePermission("departments.read"), getDivisionDepartments)
			divisions.GET("/:id/users", middleware.RequirePermission("users.read"), getDivisionUsers)
			divisions.POST("/:id/setup-departments", middleware.RequirePermission("departments.write"), setupDivisionDepartments)
		}
		
		// Department operations
		departments := api.Group("/departments")
		{
			departments.GET("", middleware.RequirePermission("departments.read"), listDepartments)
			departments.POST("", middleware.RequirePermission("departments.write"), createDepartment)
			departments.GET("/:id", middleware.RequirePermission("departments.read"), getDepartment)
			departments.PUT("/:id", middleware.RequirePermission("departments.write"), updateDepartment)
			departments.DELETE("/:id", middleware.RequirePermission("departments.delete"), deleteDepartment)
			
			// Department-specific operations
			departments.GET("/:id/users", middleware.RequirePermission("users.read"), getDepartmentUsers)
			departments.PUT("/:id/members", middleware.RequirePermission("departments.write"), updateDepartmentMembers)
		}

		// Applet configuration operations
		applets := api.Group("/applets")
		{
			applets.GET("/registry", middleware.RequirePermission("applets.read"), getAppletRegistry)
			applets.GET("/school/:schoolId", middleware.RequirePermission("applets.read"), getSchoolAppletConfigs)
			applets.POST("/school/:schoolId/:appletId", middleware.RequirePermission("applets.configure"), configureSchoolApplet)
			applets.PUT("/school/:schoolId/:appletId", middleware.RequirePermission("applets.configure"), updateSchoolAppletConfig)
			applets.DELETE("/school/:schoolId/:appletId", middleware.RequirePermission("applets.configure"), disableSchoolApplet)
		}
	}

	return router
}

// === SCHOOL OPERATIONS ===

// CreateSchoolRequest represents the request body for creating a school
type CreateSchoolRequest struct {
	Name         string                 `json:"name" validate:"required"`
	ShortName    string                 `json:"shortName" validate:"required"`
	District     string                 `json:"district,omitempty"`
	Address      *models.Address        `json:"address" validate:"required"`
	ContactInfo  *models.ContactInfo    `json:"contactInfo" validate:"required"`
	Timezone     string                 `json:"timezone" validate:"required"`
	AcademicYear *models.AcademicYear   `json:"academicYear,omitempty"`
	Settings     map[string]interface{} `json:"settings,omitempty"`
}

// listSchools handles GET /api/v1/organizations/schools
func listSchools(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	schools, err := firestoreService.ListSchools()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list schools"})
		return
	}
	
	// Filter schools based on user permissions
	var filteredSchools []*models.School
	for _, school := range schools {
		if canAccessSchool(currentUser, school.ID) {
			filteredSchools = append(filteredSchools, school)
		}
	}
	
	c.JSON(http.StatusOK, gin.H{"schools": filteredSchools})
}

// createSchool handles POST /api/v1/organizations/schools
func createSchool(c *gin.Context) {
	var req CreateSchoolRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	// Only super admins can create schools
	if currentUser.Role != models.SuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can create schools"})
		return
	}
	
	schoolID := firestoreService.GenerateID()
	
	school := &models.School{
		ID:             schoolID,
		Name:           req.Name,
		ShortName:      req.ShortName,
		District:       req.District,
		Address:        req.Address,
		ContactInfo:    req.ContactInfo,
		Timezone:       req.Timezone,
		AcademicYear:   req.AcademicYear,
		EnabledApplets: []string{"observations"}, // Default applets
		AppletSettings: make(map[string]interface{}),
		Settings:       req.Settings,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}
	
	if school.Settings == nil {
		school.Settings = make(map[string]interface{})
	}
	
	if err := firestoreService.CreateSchool(school); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create school"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"school": school})
}

// getSchool handles GET /api/v1/organizations/schools/:id
func getSchool(c *gin.Context) {
	schoolID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	school, err := firestoreService.GetSchool(schoolID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "School not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"school": school})
}

// updateSchool handles PUT /api/v1/organizations/schools/:id
func updateSchool(c *gin.Context) {
	schoolID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Remove fields that shouldn't be updated directly
	delete(updates, "id")
	delete(updates, "createdAt")
	
	if err := firestoreService.UpdateSchool(schoolID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update school"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "School updated successfully"})
}

// deleteSchool handles DELETE /api/v1/organizations/schools/:id
func deleteSchool(c *gin.Context) {
	schoolID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	// Only super admins can delete schools
	if currentUser.Role != models.SuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can delete schools"})
		return
	}
	
	if err := firestoreService.DeleteSchool(schoolID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete school"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "School deleted successfully"})
}

// getSchoolDivisions handles GET /api/v1/organizations/schools/:id/divisions
func getSchoolDivisions(c *gin.Context) {
	schoolID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	divisions, err := firestoreService.ListDivisionsBySchool(schoolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get divisions"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"divisions": divisions})
}

// getSchoolUsers handles GET /api/v1/organizations/schools/:id/users
func getSchoolUsers(c *gin.Context) {
	schoolID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	filters := map[string]interface{}{
		"schoolId": schoolID,
		"isActive": true,
	}
	
	users, err := firestoreService.ListUsers(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// getSchoolApplets handles GET /api/v1/organizations/schools/:id/applets
func getSchoolApplets(c *gin.Context) {
	schoolID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	configs, err := firestoreService.ListAppletConfigsBySchool(schoolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get applet configs"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"configs": configs})
}

// === DIVISION OPERATIONS ===

// CreateDivisionRequest represents the request body for creating a division
type CreateDivisionRequest struct {
	SchoolID             string                 `json:"schoolId" validate:"required,uuid"`
	Name                 string                 `json:"name" validate:"required"`
	Type                 models.DivisionType    `json:"type" validate:"required"`
	Description          string                 `json:"description,omitempty"`
	DirectorID           string                 `json:"directorId,omitempty" validate:"omitempty,uuid"`
	AssistantDirectorIDs []string               `json:"assistantDirectorIds,omitempty"`
	Grades               []string               `json:"grades,omitempty"`
	StudentCount         int                    `json:"studentCount,omitempty"`
	Settings             map[string]interface{} `json:"settings,omitempty"`
}

// createDivision handles POST /api/v1/organizations/divisions
func createDivision(c *gin.Context) {
	var req CreateDivisionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, req.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	divisionID := firestoreService.GenerateID()
	
	// Set default grades if not specified
	grades := req.Grades
	if len(grades) == 0 {
		grades = models.GetDivisionGrades(req.Type)
	}
	
	division := &models.Division{
		ID:                   divisionID,
		SchoolID:             req.SchoolID,
		Name:                 req.Name,
		Type:                 req.Type,
		Description:          req.Description,
		DirectorID:           req.DirectorID,
		AssistantDirectorIDs: req.AssistantDirectorIDs,
		Grades:               grades,
		StudentCount:         req.StudentCount,
		Settings:             req.Settings,
		CreatedAt:            time.Now(),
		UpdatedAt:            time.Now(),
	}
	
	if division.Settings == nil {
		division.Settings = make(map[string]interface{})
	}
	
	if err := firestoreService.CreateDivision(division); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create division"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"division": division})
}

// getDivision handles GET /api/v1/organizations/divisions/:id
func getDivision(c *gin.Context) {
	divisionID := c.Param("id")
	
	division, err := firestoreService.GetDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Division not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, division.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"division": division})
}

// updateDivision handles PUT /api/v1/organizations/divisions/:id
func updateDivision(c *gin.Context) {
	divisionID := c.Param("id")
	
	division, err := firestoreService.GetDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Division not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, division.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Remove fields that shouldn't be updated directly
	delete(updates, "id")
	delete(updates, "schoolId")
	delete(updates, "createdAt")
	updates["updatedAt"] = time.Now()
	
	if err := firestoreService.UpdateDivision(divisionID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update division"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Division updated successfully"})
}

// deleteDivision handles DELETE /api/v1/organizations/divisions/:id
func deleteDivision(c *gin.Context) {
	divisionID := c.Param("id")
	
	division, err := firestoreService.GetDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Division not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, division.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	if err := firestoreService.DeleteDivision(divisionID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete division"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Division deleted successfully"})
}

// getDivisionDepartments handles GET /api/v1/organizations/divisions/:id/departments
func getDivisionDepartments(c *gin.Context) {
	divisionID := c.Param("id")
	
	division, err := firestoreService.GetDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Division not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, division.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	departments, err := firestoreService.ListDepartmentsByDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get departments"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"departments": departments})
}

// getDivisionUsers handles GET /api/v1/organizations/divisions/:id/users
func getDivisionUsers(c *gin.Context) {
	divisionID := c.Param("id")
	
	division, err := firestoreService.GetDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Division not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, division.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	filters := map[string]interface{}{
		"divisionId": divisionID,
		"isActive":   true,
	}
	
	users, err := firestoreService.ListUsers(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// setupDivisionDepartments handles POST /api/v1/organizations/divisions/:id/setup-departments
func setupDivisionDepartments(c *gin.Context) {
	divisionID := c.Param("id")
	
	division, err := firestoreService.GetDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Division not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, division.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	// Get example departments for this division type
	exampleDepartments := models.GetExampleDepartments(division.Type)
	
	var createdDepartments []*models.Department
	
	for _, deptName := range exampleDepartments {
		departmentID := firestoreService.GenerateID()
		
		department := &models.Department{
			ID:          departmentID,
			SchoolID:    division.SchoolID,
			DivisionID:  division.ID,
			Name:        deptName,
			Description: "Auto-created department for " + division.Name,
			Members:     []string{},
			Subjects:    []string{},
			Grades:      division.Grades,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}
		
		if err := firestoreService.CreateDepartment(department); err != nil {
			log.Printf("Failed to create department %s: %v", deptName, err)
			continue
		}
		
		createdDepartments = append(createdDepartments, department)
	}
	
	c.JSON(http.StatusCreated, gin.H{
		"message":     "Departments created successfully",
		"departments": createdDepartments,
	})
}

// === DEPARTMENT OPERATIONS ===

// CreateDepartmentRequest represents the request body for creating a department
type CreateDepartmentRequest struct {
	SchoolID    string   `json:"schoolId" validate:"required,uuid"`
	DivisionID  string   `json:"divisionId" validate:"required,uuid"`
	Name        string   `json:"name" validate:"required"`
	Description string   `json:"description,omitempty"`
	HeadID      string   `json:"headId,omitempty" validate:"omitempty,uuid"`
	Members     []string `json:"members,omitempty"`
	Subjects    []string `json:"subjects,omitempty"`
	Grades      []string `json:"grades,omitempty"`
	Function    string   `json:"function,omitempty"`
}

// createDepartment handles POST /api/v1/organizations/departments
func createDepartment(c *gin.Context) {
	var req CreateDepartmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, req.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	departmentID := firestoreService.GenerateID()
	
	department := &models.Department{
		ID:          departmentID,
		SchoolID:    req.SchoolID,
		DivisionID:  req.DivisionID,
		Name:        req.Name,
		Description: req.Description,
		HeadID:      req.HeadID,
		Members:     req.Members,
		Subjects:    req.Subjects,
		Grades:      req.Grades,
		Function:    req.Function,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	
	if department.Members == nil {
		department.Members = []string{}
	}
	if department.Subjects == nil {
		department.Subjects = []string{}
	}
	if department.Grades == nil {
		department.Grades = []string{}
	}
	
	if err := firestoreService.CreateDepartment(department); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create department"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"department": department})
}

// getDepartment handles GET /api/v1/organizations/departments/:id
func getDepartment(c *gin.Context) {
	departmentID := c.Param("id")
	
	department, err := firestoreService.GetDepartment(departmentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, department.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"department": department})
}

// updateDepartment handles PUT /api/v1/organizations/departments/:id
func updateDepartment(c *gin.Context) {
	departmentID := c.Param("id")
	
	department, err := firestoreService.GetDepartment(departmentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, department.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Remove fields that shouldn't be updated directly
	delete(updates, "id")
	delete(updates, "schoolId")
	delete(updates, "divisionId")
	delete(updates, "createdAt")
	updates["updatedAt"] = time.Now()
	
	if err := firestoreService.UpdateDepartment(departmentID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update department"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Department updated successfully"})
}

// deleteDepartment handles DELETE /api/v1/organizations/departments/:id
func deleteDepartment(c *gin.Context) {
	departmentID := c.Param("id")
	
	department, err := firestoreService.GetDepartment(departmentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, department.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	if err := firestoreService.DeleteDepartment(departmentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete department"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Department deleted successfully"})
}

// getDepartmentUsers handles GET /api/v1/organizations/departments/:id/users
func getDepartmentUsers(c *gin.Context) {
	departmentID := c.Param("id")
	
	department, err := firestoreService.GetDepartment(departmentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, department.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	filters := map[string]interface{}{
		"departmentId": departmentID,
		"isActive":     true,
	}
	
	users, err := firestoreService.ListUsers(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// updateDepartmentMembers handles PUT /api/v1/organizations/departments/:id/members
func updateDepartmentMembers(c *gin.Context) {
	departmentID := c.Param("id")
	
	department, err := firestoreService.GetDepartment(departmentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	if !canAccessSchool(currentUser, department.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	var req struct {
		Members []string `json:"members"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	updates := map[string]interface{}{
		"members":   req.Members,
		"updatedAt": time.Now(),
	}
	
	if err := firestoreService.UpdateDepartment(departmentID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update department members"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Department members updated successfully"})
}

// === APPLET CONFIGURATION OPERATIONS ===

// getAppletRegistry handles GET /api/v1/organizations/applets/registry
func getAppletRegistry(c *gin.Context) {
	coreApplets := models.GetCoreApplets()
	
	c.JSON(http.StatusOK, gin.H{
		"applets": coreApplets,
		"count":   len(coreApplets),
	})
}

// ConfigureSchoolAppletRequest represents the request body for configuring an applet
type ConfigureSchoolAppletRequest struct {
	IsEnabled           bool                   `json:"isEnabled"`
	Settings            map[string]interface{} `json:"settings,omitempty"`
	CustomFields        map[string]interface{} `json:"customFields,omitempty"`
	EnabledForDivisions []models.DivisionType  `json:"enabledForDivisions,omitempty"`
	EnabledForRoles     []models.UserRole      `json:"enabledForRoles,omitempty"`
	AppletAdmins        []string               `json:"appletAdmins,omitempty"`
}

// configureSchoolApplet handles POST /api/v1/organizations/applets/school/:schoolId/:appletId
func configureSchoolApplet(c *gin.Context) {
	schoolID := c.Param("schoolId")
	appletID := c.Param("appletId")
	
	var req ConfigureSchoolAppletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	if !currentUser.CanConfigureApplets() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to configure applets"})
		return
	}
	
	// Verify applet exists in registry
	coreApplets := models.GetCoreApplets()
	var applet *models.Applet
	for _, a := range coreApplets {
		if a.ID == appletID {
			applet = &a
			break
		}
	}
	
	if applet == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Applet not found in registry"})
		return
	}
	
	configID := schoolID + "_" + appletID
	
	config := &models.SchoolAppletConfig{
		ID:                  configID,
		SchoolID:            schoolID,
		AppletID:            appletID,
		AppletName:          applet.Name,
		IsEnabled:           req.IsEnabled,
		Settings:            req.Settings,
		CustomFields:        req.CustomFields,
		EnabledForDivisions: req.EnabledForDivisions,
		EnabledForRoles:     req.EnabledForRoles,
		AppletAdmins:        req.AppletAdmins,
		ConfiguredBy:        currentUser.ID,
		CreatedAt:           time.Now(),
		UpdatedAt:           time.Now(),
	}
	
	if config.Settings == nil {
		config.Settings = make(map[string]interface{})
	}
	if config.AppletAdmins == nil {
		config.AppletAdmins = []string{}
	}
	
	if err := firestoreService.CreateAppletConfig(config); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to configure applet"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"config": config})
}

// updateSchoolAppletConfig handles PUT /api/v1/organizations/applets/school/:schoolId/:appletId
func updateSchoolAppletConfig(c *gin.Context) {
	schoolID := c.Param("schoolId")
	appletID := c.Param("appletId")
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	if !currentUser.CanConfigureApplets() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to configure applets"})
		return
	}
	
	// Remove fields that shouldn't be updated directly
	delete(updates, "id")
	delete(updates, "schoolId")
	delete(updates, "appletId")
	delete(updates, "createdAt")
	updates["updatedAt"] = time.Now()
	
	configID := schoolID + "_" + appletID
	
	if err := firestoreService.UpdateAppletConfig(configID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update applet configuration"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Applet configuration updated successfully"})
}

// disableSchoolApplet handles DELETE /api/v1/organizations/applets/school/:schoolId/:appletId
func disableSchoolApplet(c *gin.Context) {
	schoolID := c.Param("schoolId")
	appletID := c.Param("appletId")
	
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	if !currentUser.CanConfigureApplets() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to configure applets"})
		return
	}
	
	configID := schoolID + "_" + appletID
	
	updates := map[string]interface{}{
		"isEnabled": false,
		"updatedAt": time.Now(),
	}
	
	if err := firestoreService.UpdateAppletConfig(configID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to disable applet"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Applet disabled successfully"})
}

// Additional handler implementations would continue here...

// main function for local testing (not used in Cloud Functions)
func main() {
	// This is only used for local development
	// In production, the Functions Framework handles the HTTP routing
}

// getSchoolAppletConfigs handles GET /api/v1/organizations/applets/school/:schoolId
func getSchoolAppletConfigs(c *gin.Context) {
	schoolID := c.Param("schoolId")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	configs, err := firestoreService.ListAppletConfigsBySchool(schoolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get applet configs"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"configs": configs})
}

// === HELPER FUNCTIONS ===

// canAccessSchool checks if current user can access a school
func canAccessSchool(currentUser *middleware.CurrentUser, schoolID string) bool {
	// Super admins can access any school
	if currentUser.Role == models.SuperAdmin || currentUser.Role == models.SystemAdmin {
		return true
	}
	
	// Users can only access their own school
	return currentUser.SchoolID == schoolID
}

// listDivisions handles GET /api/v1/organizations/divisions
func listDivisions(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	schoolID := c.Query("schoolId")
	
	// If no school ID specified, use current user's school
	if schoolID == "" {
		schoolID = currentUser.SchoolID
	}
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	divisions, err := firestoreService.ListDivisionsBySchool(schoolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list divisions"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"divisions": divisions})
}

// listDepartments handles GET /api/v1/organizations/departments
func listDepartments(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	divisionID := c.Query("divisionId")
	
	if divisionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "divisionId parameter is required"})
		return
	}
	
	// Get division to check school access
	division, err := firestoreService.GetDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Division not found"})
		return
	}
	
	if !canAccessSchool(currentUser, division.SchoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	departments, err := firestoreService.ListDepartmentsByDivision(divisionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list departments"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"departments": departments})
}

// Additional handler implementations would continue here...
// For brevity, I'm including the key ones. The remaining handlers follow similar patterns.
