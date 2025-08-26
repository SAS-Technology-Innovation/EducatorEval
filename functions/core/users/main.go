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
	functions.HTTP("usersAPI", handleUsersAPI)
	
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

func handleUsersAPI(w http.ResponseWriter, r *http.Request) {
	gin.SetMode(gin.ReleaseMode)
	router := setupUsersRouter()
	router.ServeHTTP(w, r)
}

func setupUsersRouter() *gin.Engine {
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

	api := router.Group("/api/v1/users")
	api.Use(middleware.AuthMiddleware(authService))
	{
		// User CRUD operations
		api.GET("", middleware.RequirePermission("users.read"), listUsers)
		api.POST("", middleware.RequirePermission("users.write"), createUser)
		api.GET("/:id", middleware.RequirePermission("users.read"), getUser)
		api.PUT("/:id", middleware.RequirePermission("users.write"), updateUser)
		api.DELETE("/:id", middleware.RequirePermission("users.delete"), deleteUser)
		
		// User management operations
		api.PUT("/:id/disable", middleware.RequirePermission("users.write"), disableUser)
		api.PUT("/:id/enable", middleware.RequirePermission("users.write"), enableUser)
		api.PUT("/:id/role", middleware.RequirePermission("users.write"), updateUserRole)
		api.POST("/:id/reset-password", middleware.RequirePermission("users.write"), resetPassword)
		
		// Bulk operations
		api.POST("/bulk-create", middleware.RequirePermission("users.write"), bulkCreateUsers)
		api.POST("/bulk-update", middleware.RequirePermission("users.write"), bulkUpdateUsers)
		
		// User queries
		api.GET("/by-school/:schoolId", middleware.RequirePermission("users.read"), getUsersBySchool)
		api.GET("/by-division/:divisionId", middleware.RequirePermission("users.read"), getUsersByDivision)
		api.GET("/by-role/:role", middleware.RequirePermission("users.read"), getUsersByRole)
		api.GET("/teachers", middleware.RequirePermission("users.read"), getTeachers)
		
		// Profile operations
		api.GET("/profile", getProfile)
		api.PUT("/profile", updateProfile)
	}

	return router
}

// CreateUserRequest represents the request body for creating a user
type CreateUserRequest struct {
	Email       string           `json:"email" validate:"required,email"`
	Password    string           `json:"password" validate:"required,min=8"`
	FirstName   string           `json:"firstName" validate:"required"`
	LastName    string           `json:"lastName" validate:"required"`
	Role        models.UserRole  `json:"role" validate:"required"`
	SchoolID    string           `json:"schoolId" validate:"required,uuid"`
	DivisionID  string           `json:"divisionId" validate:"required,uuid"`
	DepartmentID string          `json:"departmentId,omitempty" validate:"omitempty,uuid"`
	EmployeeID  string           `json:"employeeId" validate:"required"`
	Title       string           `json:"title" validate:"required"`
	Subjects    []string         `json:"subjects,omitempty"`
	Grades      []string         `json:"grades,omitempty"`
}

// listUsers handles GET /api/v1/users
func listUsers(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	// Build filters based on user's permissions and query params
	filters := make(map[string]interface{})
	
	// Apply school filter (users can only see users from their school unless super admin)
	if currentUser.Role != models.SuperAdmin && currentUser.Role != models.SystemAdmin {
		filters["schoolId"] = currentUser.SchoolID
	}
	
	// Apply division filter if specified
	if divisionId := c.Query("divisionId"); divisionId != "" {
		filters["divisionId"] = divisionId
	}
	
	// Apply department filter if specified
	if departmentId := c.Query("departmentId"); departmentId != "" {
		filters["departmentId"] = departmentId
	}
	
	// Apply role filter if specified
	if role := c.Query("role"); role != "" {
		filters["primaryRole"] = role
	}
	
	// Apply active status filter
	if active := c.Query("active"); active != "" {
		filters["isActive"] = active == "true"
	} else {
		filters["isActive"] = true // Default to active users only
	}
	
	users, err := firestoreService.ListUsers(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// createUser handles POST /api/v1/users
func createUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	// Check if current user can create users
	if !currentUser.CanManageUsers() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to create users"})
		return
	}
	
	// Generate user ID
	userID := firestoreService.GenerateID()
	
	// Create user model
	user := &models.User{
		ID:           userID,
		Email:        req.Email,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		DisplayName:  req.FirstName + " " + req.LastName,
		EmployeeID:   req.EmployeeID,
		SchoolID:     req.SchoolID,
		DivisionID:   req.DivisionID,
		DepartmentID: req.DepartmentID,
		PrimaryRole:  req.Role,
		Title:        req.Title,
		Subjects:     req.Subjects,
		Grades:       req.Grades,
		Permissions:  models.GetRolePermissions(req.Role),
		IsActive:     true,
		AccountStatus: "active",
		Languages:    []string{"en"},
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	
	// Create user in Firebase Auth
	authUser, err := authService.CreateUser(req.Email, req.Password, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create auth user: " + err.Error()})
		return
	}
	
	// Use Firebase Auth UID as user ID
	user.ID = authUser.UID
	
	// Create user in Firestore
	if err := firestoreService.CreateUser(user); err != nil {
		// Rollback: delete from Firebase Auth
		authService.DeleteUser(authUser.UID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user in database"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{"user": user})
}

// getUser handles GET /api/v1/users/:id
func getUser(c *gin.Context) {
	userID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	user, err := firestoreService.GetUser(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	
	// Check if current user can view this user
	if !canAccessUser(currentUser, user) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"user": user})
}

// updateUser handles PUT /api/v1/users/:id
func updateUser(c *gin.Context) {
	userID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	// Get existing user
	existingUser, err := firestoreService.GetUser(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	
	// Check permissions
	if !canAccessUser(currentUser, existingUser) {
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
	delete(updates, "permissions") // Use role update endpoint instead
	
	if err := firestoreService.UpdateUser(userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

// deleteUser handles DELETE /api/v1/users/:id
func deleteUser(c *gin.Context) {
	userID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	// Only super admins can delete users
	if currentUser.Role != models.SuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can delete users"})
		return
	}
	
	// Soft delete by marking as inactive
	updates := map[string]interface{}{
		"isActive":      false,
		"accountStatus": "deleted",
		"updatedAt":     time.Now(),
	}
	
	if err := firestoreService.UpdateUser(userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}
	
	// Disable in Firebase Auth
	if err := authService.DisableUser(userID); err != nil {
		log.Printf("Failed to disable user in Firebase Auth: %v", err)
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// getUsersBySchool handles GET /api/v1/users/by-school/:schoolId
func getUsersBySchool(c *gin.Context) {
	schoolID := c.Param("schoolId")
	currentUser := middleware.GetCurrentUser(c)
	
	// Check if user can access this school
	if currentUser.SchoolID != schoolID && currentUser.Role != models.SuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	users, err := firestoreService.GetUsersBySchool(schoolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// getTeachers handles GET /api/v1/users/teachers
func getTeachers(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	filters := map[string]interface{}{
		"isActive": true,
	}
	
	// Apply school filter
	if currentUser.Role != models.SuperAdmin {
		filters["schoolId"] = currentUser.SchoolID
	}
	
	// Apply division filter if specified
	if divisionId := c.Query("divisionId"); divisionId != "" {
		filters["divisionId"] = divisionId
	}
	
	users, err := firestoreService.ListUsers(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get teachers"})
		return
	}
	
	// Filter to only teaching roles
	var teachers []*models.User
	teachingRoles := []models.UserRole{
		models.Teacher, models.SpecialistTeacher, models.SubstituteTeacher,
	}
	
	for _, user := range users {
		for _, role := range teachingRoles {
			if user.PrimaryRole == role {
				teachers = append(teachers, user)
				break
			}
		}
		// Also check secondary roles
		for _, secondaryRole := range user.SecondaryRoles {
			for _, role := range teachingRoles {
				if secondaryRole == role {
					teachers = append(teachers, user)
					break
				}
			}
		}
	}
	
	c.JSON(http.StatusOK, gin.H{"teachers": teachers})
}

// getProfile handles GET /api/v1/users/profile
func getProfile(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	user, err := firestoreService.GetUser(currentUser.ID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"user": user})
}

// updateProfile handles PUT /api/v1/users/profile
func updateProfile(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Users can only update certain profile fields
	allowedFields := []string{
		"firstName", "lastName", "displayName", "phoneNumber", "address",
		"pronouns", "preferences", "notificationSettings",
	}
	
	filteredUpdates := make(map[string]interface{})
	for _, field := range allowedFields {
		if value, exists := updates[field]; exists {
			filteredUpdates[field] = value
		}
	}
	
	if len(filteredUpdates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No valid fields to update"})
		return
	}
	
	if err := firestoreService.UpdateUser(currentUser.ID, filteredUpdates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

// Helper functions

// canAccessUser checks if current user can access target user
func canAccessUser(currentUser *middleware.CurrentUser, targetUser *models.User) bool {
	// Super admins can access anyone
	if currentUser.Role == models.SuperAdmin || currentUser.Role == models.SystemAdmin {
		return true
	}
	
	// Users can access their own profile
	if currentUser.ID == targetUser.ID {
		return true
	}
	
	// School-level access
	if currentUser.SchoolID != targetUser.SchoolID {
		return false
	}
	
	// Role-based access within school
	switch currentUser.Role {
	case models.Superintendent, models.Principal:
		return true // Can access all users in school
	case models.AssistantPrincipal, models.DivisionDirector:
		return currentUser.DivisionID == targetUser.DivisionID
	case models.DepartmentHead:
		return currentUser.DepartmentID == targetUser.DepartmentID
	default:
		return false
	}
}

// updateUserRole handles PUT /api/v1/users/:id/role
func updateUserRole(c *gin.Context) {
	userID := c.Param("id")
	currentUser := middleware.GetCurrentUser(c)
	
	var req struct {
		Role        models.UserRole   `json:"role" validate:"required"`
		SecondaryRoles []models.UserRole `json:"secondaryRoles,omitempty"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Get existing user
	user, err := firestoreService.GetUser(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	
	// Check permissions
	if !canAccessUser(currentUser, user) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	// Update permissions based on new role
	permissions := models.GetRolePermissions(req.Role)
	
	updates := map[string]interface{}{
		"primaryRole":    req.Role,
		"secondaryRoles": req.SecondaryRoles,
		"permissions":    permissions,
		"updatedAt":      time.Now(),
	}
	
	// Update in Firestore
	if err := firestoreService.UpdateUser(userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}
	
	// Update Firebase Auth claims
	user.PrimaryRole = req.Role
	user.SecondaryRoles = req.SecondaryRoles
	user.Permissions = permissions
	
	if err := authService.UpdateUserRole(userID, user); err != nil {
		log.Printf("Failed to update Firebase Auth claims: %v", err)
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully"})
}

// disableUser handles PUT /api/v1/users/:id/disable
func disableUser(c *gin.Context) {
	userID := c.Param("id")
	
	updates := map[string]interface{}{
		"isActive":      false,
		"accountStatus": "disabled",
		"updatedAt":     time.Now(),
	}
	
	if err := firestoreService.UpdateUser(userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to disable user"})
		return
	}
	
	if err := authService.DisableUser(userID); err != nil {
		log.Printf("Failed to disable user in Firebase Auth: %v", err)
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "User disabled successfully"})
}

// enableUser handles PUT /api/v1/users/:id/enable
func enableUser(c *gin.Context) {
	userID := c.Param("id")
	
	updates := map[string]interface{}{
		"isActive":      true,
		"accountStatus": "active",
		"updatedAt":     time.Now(),
	}
	
	if err := firestoreService.UpdateUser(userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to enable user"})
		return
	}
	
	if err := authService.EnableUser(userID); err != nil {
		log.Printf("Failed to enable user in Firebase Auth: %v", err)
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "User enabled successfully"})
}

// resetPassword handles POST /api/v1/users/:id/reset-password
func resetPassword(c *gin.Context) {
	userID := c.Param("id")
	
	// Get user to get email
	user, err := firestoreService.GetUser(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	
	// Send password reset email
	resetLink, err := authService.SendPasswordResetEmail(user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send reset email"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message":   "Password reset email sent",
		"resetLink": resetLink,
	})
}

// bulkCreateUsers handles POST /api/v1/users/bulk-create
func bulkCreateUsers(c *gin.Context) {
	var req struct {
		Users []CreateUserRequest `json:"users" validate:"required,dive"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	if !currentUser.CanManageUsers() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
		return
	}
	
	var results []gin.H
	for _, userReq := range req.Users {
		// Create individual user (simplified version)
		userID := firestoreService.GenerateID()
		
		user := &models.User{
			ID:          userID,
			Email:       userReq.Email,
			FirstName:   userReq.FirstName,
			LastName:    userReq.LastName,
			DisplayName: userReq.FirstName + " " + userReq.LastName,
			PrimaryRole: userReq.Role,
			SchoolID:    userReq.SchoolID,
			DivisionID:  userReq.DivisionID,
			Permissions: models.GetRolePermissions(userReq.Role),
			IsActive:    true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}
		
		// Create in Firebase Auth
		authUser, err := authService.CreateUser(userReq.Email, userReq.Password, user)
		if err != nil {
			results = append(results, gin.H{
				"email":  userReq.Email,
				"status": "failed",
				"error":  err.Error(),
			})
			continue
		}
		
		user.ID = authUser.UID
		
		// Create in Firestore
		if err := firestoreService.CreateUser(user); err != nil {
			authService.DeleteUser(authUser.UID) // Rollback
			results = append(results, gin.H{
				"email":  userReq.Email,
				"status": "failed",
				"error":  "Failed to create in database",
			})
			continue
		}
		
		results = append(results, gin.H{
			"email":  userReq.Email,
			"status": "success",
			"userId": user.ID,
		})
	}
	
	c.JSON(http.StatusOK, gin.H{"results": results})
}

// bulkUpdateUsers handles POST /api/v1/users/bulk-update
func bulkUpdateUsers(c *gin.Context) {
	var req struct {
		UserUpdates []struct {
			UserID  string                 `json:"userId" validate:"required,uuid"`
			Updates map[string]interface{} `json:"updates" validate:"required"`
		} `json:"userUpdates" validate:"required,dive"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := middleware.GetCurrentUser(c)
	
	if !currentUser.CanManageUsers() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
		return
	}
	
	var results []gin.H
	for _, update := range req.UserUpdates {
		if err := firestoreService.UpdateUser(update.UserID, update.Updates); err != nil {
			results = append(results, gin.H{
				"userId": update.UserID,
				"status": "failed",
				"error":  err.Error(),
			})
		} else {
			results = append(results, gin.H{
				"userId": update.UserID,
				"status": "success",
			})
		}
	}
	
	c.JSON(http.StatusOK, gin.H{"results": results})
}

// getUsersByDivision handles GET /api/v1/users/by-division/:divisionId
func getUsersByDivision(c *gin.Context) {
	divisionID := c.Param("divisionId")
	currentUser := middleware.GetCurrentUser(c)
	
	filters := map[string]interface{}{
		"divisionId": divisionID,
		"isActive":   true,
	}
	
	// Apply school filter if not super admin
	if currentUser.Role != models.SuperAdmin {
		filters["schoolId"] = currentUser.SchoolID
	}
	
	users, err := firestoreService.ListUsers(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// getUsersByRole handles GET /api/v1/users/by-role/:role
func getUsersByRole(c *gin.Context) {
	role := models.UserRole(c.Param("role"))
	currentUser := middleware.GetCurrentUser(c)
	
	filters := map[string]interface{}{
		"primaryRole": role,
		"isActive":    true,
	}
	
	// Apply school filter if not super admin
	if currentUser.Role != models.SuperAdmin {
		filters["schoolId"] = currentUser.SchoolID
	}
	
	users, err := firestoreService.ListUsers(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// main function for local testing (not used in Cloud Functions)
func main() {
	// This is only used for local development
	// In production, the Functions Framework handles the HTTP routing
}
