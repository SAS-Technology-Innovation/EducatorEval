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
	functions.HTTP("appletsAPI", handleAppletsAPI)
	
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

func handleAppletsAPI(w http.ResponseWriter, r *http.Request) {
	gin.SetMode(gin.ReleaseMode)
	router := setupAppletsRouter()
	router.ServeHTTP(w, r)
}

func setupAppletsRouter() *gin.Engine {
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

	api := router.Group("/api/v1/applets")
	api.Use(middleware.AuthMiddleware(authService))
	{
		// Registry operations - Global applet registry
		registry := api.Group("/registry")
		registry.Use(middleware.RequirePermission("applets.read"))
		{
			registry.GET("", listAppletRegistry)
			registry.GET("/:id", getAppletFromRegistry)
			registry.GET("/:id/metadata", getAppletMetadata)
		}
		
		// School applet configuration operations
		schools := api.Group("/schools/:schoolId")
		schools.Use(middleware.RequirePermission("applets.read"))
		{
			// View configurations
			schools.GET("/configs", getSchoolAppletConfigs)
			schools.GET("/configs/:appletId", getSchoolAppletConfig)
			schools.GET("/enabled", getEnabledApplets)
			
			// Configure applets (requires higher permissions)
			schools.POST("/configure/:appletId", middleware.RequirePermission("applets.configure"), configureApplet)
			schools.PUT("/configure/:appletId", middleware.RequirePermission("applets.configure"), updateAppletConfig)
			schools.DELETE("/configure/:appletId", middleware.RequirePermission("applets.configure"), disableApplet)
			schools.POST("/enable/:appletId", middleware.RequirePermission("applets.configure"), enableApplet)
			schools.POST("/disable/:appletId", middleware.RequirePermission("applets.configure"), disableApplet)
			
			// Bulk operations
			schools.POST("/configure/bulk", middleware.RequirePermission("applets.configure"), bulkConfigureApplets)
			schools.PUT("/settings/bulk", middleware.RequirePermission("applets.configure"), bulkUpdateAppletSettings)
		}
		
		// User applet access operations
		access := api.Group("/access")
		{
			access.GET("/my-applets", getMyApplets)
			access.GET("/my-applets/:appletId", getMyAppletAccess)
			access.POST("/my-applets/:appletId/launch", launchApplet)
			access.GET("/permissions", getMyAppletPermissions)
		}
		
		// Applet management for admins
		manage := api.Group("/manage")
		manage.Use(middleware.RequirePermission("applets.admin"))
		{
			manage.GET("/usage-stats", getAppletUsageStats)
			manage.GET("/schools/:schoolId/audit", getSchoolAppletAuditLog)
			manage.POST("/schools/:schoolId/reset/:appletId", resetSchoolApplet)
			manage.GET("/system-health", getAppletSystemHealth)
		}
	}

	return router
}

// === REGISTRY OPERATIONS ===

// listAppletRegistry handles GET /api/v1/applets/registry
func listAppletRegistry(c *gin.Context) {
	category := c.Query("category")
	isActive := c.Query("active")
	
	coreApplets := models.GetCoreApplets()
	
	// Filter by category if specified
	if category != "" {
		var filteredApplets []models.Applet
		for _, applet := range coreApplets {
			if applet.Category == category {
				filteredApplets = append(filteredApplets, applet)
			}
		}
		coreApplets = filteredApplets
	}
	
	// Filter by active status if specified
	if isActive == "true" {
		var activeApplets []models.Applet
		for _, applet := range coreApplets {
			if applet.IsActive {
				activeApplets = append(activeApplets, applet)
			}
		}
		coreApplets = activeApplets
	}
	
	// Get categories for response metadata
	categories := make(map[string]int)
	for _, applet := range coreApplets {
		categories[applet.Category]++
	}
	
	c.JSON(http.StatusOK, gin.H{
		"applets":    coreApplets,
		"count":      len(coreApplets),
		"categories": categories,
	})
}

// getAppletFromRegistry handles GET /api/v1/applets/registry/:id
func getAppletFromRegistry(c *gin.Context) {
	appletID := c.Param("id")
	
	coreApplets := models.GetCoreApplets()
	
	for _, applet := range coreApplets {
		if applet.ID == appletID {
			c.JSON(http.StatusOK, gin.H{"applet": applet})
			return
		}
	}
	
	c.JSON(http.StatusNotFound, gin.H{"error": "Applet not found in registry"})
}

// getAppletMetadata handles GET /api/v1/applets/registry/:id/metadata
func getAppletMetadata(c *gin.Context) {
	appletID := c.Param("id")
	
	coreApplets := models.GetCoreApplets()
	
	for _, applet := range coreApplets {
		if applet.ID == appletID {
			metadata := gin.H{
				"id":                   applet.ID,
				"name":                 applet.Name,
				"description":          applet.Description,
				"category":             applet.Category,
				"version":              applet.Version,
				"supportedDivisions":   applet.SupportedDivisions,
				"requiredRoles":        applet.RequiredRoles,
				"defaultSettings":      applet.DefaultSettings,
				"configurableSettings": applet.ConfigurableSettings,
				"requiredPermissions":  applet.RequiredPermissions,
				"dataCollected":        applet.DataCollected,
				"isActive":             applet.IsActive,
				"supportsScheduling":   applet.SupportsScheduling,
				"supportsMobile":       applet.SupportsMobile,
			}
			
			c.JSON(http.StatusOK, gin.H{"metadata": metadata})
			return
		}
	}
	
	c.JSON(http.StatusNotFound, gin.H{"error": "Applet not found in registry"})
}

// === SCHOOL APPLET CONFIGURATION ===

// getSchoolAppletConfigs handles GET /api/v1/applets/schools/:schoolId/configs
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
	
	c.JSON(http.StatusOK, gin.H{
		"configs": configs,
		"count":   len(configs),
	})
}

// getSchoolAppletConfig handles GET /api/v1/applets/schools/:schoolId/configs/:appletId
func getSchoolAppletConfig(c *gin.Context) {
	schoolID := c.Param("schoolId")
	appletID := c.Param("appletId")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	configID := schoolID + "_" + appletID
	config, err := firestoreService.GetAppletConfig(configID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Applet configuration not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"config": config})
}

// getEnabledApplets handles GET /api/v1/applets/schools/:schoolId/enabled
func getEnabledApplets(c *gin.Context) {
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
	
	var enabledApplets []models.SchoolAppletConfig
	for _, config := range configs {
		if config.IsEnabled {
			// Check if user has access to this applet based on their role and division
			if canUserAccessApplet(currentUser, config) {
				enabledApplets = append(enabledApplets, *config)
			}
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"applets": enabledApplets,
		"count":   len(enabledApplets),
	})
}

// ConfigureAppletRequest represents the request body for configuring an applet
type ConfigureAppletRequest struct {
	IsEnabled           bool                   `json:"isEnabled"`
	Settings            map[string]interface{} `json:"settings,omitempty"`
	CustomFields        map[string]interface{} `json:"customFields,omitempty"`
	EnabledForDivisions []models.DivisionType  `json:"enabledForDivisions,omitempty"`
	EnabledForRoles     []models.UserRole      `json:"enabledForRoles,omitempty"`
	AppletAdmins        []string               `json:"appletAdmins,omitempty"`
	ScheduleSettings    map[string]interface{} `json:"scheduleSettings,omitempty"`
	NotificationSettings map[string]interface{} `json:"notificationSettings,omitempty"`
}

// configureApplet handles POST /api/v1/applets/schools/:schoolId/configure/:appletId
func configureApplet(c *gin.Context) {
	schoolID := c.Param("schoolId")
	appletID := c.Param("appletId")
	
	var req ConfigureAppletRequest
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
		ID:                   configID,
		SchoolID:             schoolID,
		AppletID:             appletID,
		AppletName:           applet.Name,
		IsEnabled:            req.IsEnabled,
		Settings:             req.Settings,
		CustomFields:         req.CustomFields,
		EnabledForDivisions:  req.EnabledForDivisions,
		EnabledForRoles:      req.EnabledForRoles,
		AppletAdmins:         req.AppletAdmins,
		ScheduleSettings:     req.ScheduleSettings,
		NotificationSettings: req.NotificationSettings,
		ConfiguredBy:         currentUser.ID,
		CreatedAt:            time.Now(),
		UpdatedAt:            time.Now(),
	}
	
	// Initialize empty maps/slices if nil
	if config.Settings == nil {
		config.Settings = make(map[string]interface{})
	}
	if config.AppletAdmins == nil {
		config.AppletAdmins = []string{}
	}
	if config.ScheduleSettings == nil {
		config.ScheduleSettings = make(map[string]interface{})
	}
	if config.NotificationSettings == nil {
		config.NotificationSettings = make(map[string]interface{})
	}
	
	if err := firestoreService.CreateAppletConfig(config); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to configure applet"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{
		"message": "Applet configured successfully",
		"config":  config,
	})
}

// updateAppletConfig handles PUT /api/v1/applets/schools/:schoolId/configure/:appletId
func updateAppletConfig(c *gin.Context) {
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
	
	// Update the updatedAt timestamp
	updates["updatedAt"] = time.Now()
	updates["lastUpdatedBy"] = currentUser.ID
	
	configID := schoolID + "_" + appletID
	
	if err := firestoreService.UpdateAppletConfig(configID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update applet configuration"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Applet configuration updated successfully"})
}

// enableApplet handles POST /api/v1/applets/schools/:schoolId/enable/:appletId
func enableApplet(c *gin.Context) {
	schoolID := c.Param("schoolId")
	appletID := c.Param("appletId")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	if !currentUser.CanConfigureApplets() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to enable applets"})
		return
	}
	
	configID := schoolID + "_" + appletID
	
	updates := map[string]interface{}{
		"isEnabled":     true,
		"updatedAt":     time.Now(),
		"lastUpdatedBy": currentUser.ID,
	}
	
	if err := firestoreService.UpdateAppletConfig(configID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to enable applet"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Applet enabled successfully"})
}

// disableApplet handles POST /api/v1/applets/schools/:schoolId/disable/:appletId
func disableApplet(c *gin.Context) {
	schoolID := c.Param("schoolId")
	appletID := c.Param("appletId")
	currentUser := middleware.GetCurrentUser(c)
	
	if !canAccessSchool(currentUser, schoolID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	
	if !currentUser.CanConfigureApplets() {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to disable applets"})
		return
	}
	
	configID := schoolID + "_" + appletID
	
	updates := map[string]interface{}{
		"isEnabled":     false,
		"updatedAt":     time.Now(),
		"lastUpdatedBy": currentUser.ID,
	}
	
	if err := firestoreService.UpdateAppletConfig(configID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to disable applet"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Applet disabled successfully"})
}

// === USER APPLET ACCESS ===

// getMyApplets handles GET /api/v1/applets/access/my-applets
func getMyApplets(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	if currentUser.SchoolID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not associated with a school"})
		return
	}
	
	configs, err := firestoreService.ListAppletConfigsBySchool(currentUser.SchoolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user's applets"})
		return
	}
	
	var accessibleApplets []gin.H
	for _, config := range configs {
		if config.IsEnabled && canUserAccessApplet(currentUser, config) {
			appletInfo := gin.H{
				"id":          config.AppletID,
				"name":        config.AppletName,
				"description": getAppletDescription(config.AppletID),
				"category":    getAppletCategory(config.AppletID),
				"permissions": getUserAppletPermissions(currentUser, config),
				"isAdmin":     isUserAppletAdmin(currentUser.ID, config.AppletAdmins),
				"lastAccessed": getUserLastAccessed(currentUser.ID, config.AppletID),
			}
			accessibleApplets = append(accessibleApplets, appletInfo)
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"applets": accessibleApplets,
		"count":   len(accessibleApplets),
	})
}

// getMyAppletAccess handles GET /api/v1/applets/access/my-applets/:appletId
func getMyAppletAccess(c *gin.Context) {
	appletID := c.Param("appletId")
	currentUser := middleware.GetCurrentUser(c)
	
	if currentUser.SchoolID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not associated with a school"})
		return
	}
	
	configID := currentUser.SchoolID + "_" + appletID
	config, err := firestoreService.GetAppletConfig(configID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Applet not found"})
		return
	}
	
	if !config.IsEnabled {
		c.JSON(http.StatusForbidden, gin.H{"error": "Applet is not enabled"})
		return
	}
	
	if !canUserAccessApplet(currentUser, config) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied to this applet"})
		return
	}
	
	access := gin.H{
		"appletId":     config.AppletID,
		"appletName":   config.AppletName,
		"hasAccess":    true,
		"permissions":  getUserAppletPermissions(currentUser, config),
		"isAdmin":      isUserAppletAdmin(currentUser.ID, config.AppletAdmins),
		"settings":     filterUserVisibleSettings(config.Settings),
		"customFields": config.CustomFields,
	}
	
	c.JSON(http.StatusOK, gin.H{"access": access})
}

// launchApplet handles POST /api/v1/applets/access/my-applets/:appletId/launch
func launchApplet(c *gin.Context) {
	appletID := c.Param("appletId")
	currentUser := middleware.GetCurrentUser(c)
	
	if currentUser.SchoolID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not associated with a school"})
		return
	}
	
	configID := currentUser.SchoolID + "_" + appletID
	config, err := firestoreService.GetAppletConfig(configID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Applet not found"})
		return
	}
	
	if !config.IsEnabled {
		c.JSON(http.StatusForbidden, gin.H{"error": "Applet is not enabled"})
		return
	}
	
	if !canUserAccessApplet(currentUser, config) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied to this applet"})
		return
	}
	
	// Record applet launch
	launchRecord := map[string]interface{}{
		"userId":     currentUser.ID,
		"appletId":   appletID,
		"schoolId":   currentUser.SchoolID,
		"timestamp":  time.Now(),
		"ipAddress":  c.ClientIP(),
		"userAgent":  c.GetHeader("User-Agent"),
	}
	
	if err := firestoreService.RecordAppletLaunch(launchRecord); err != nil {
		log.Printf("Failed to record applet launch: %v", err)
		// Don't fail the request, just log the error
	}
	
	// Generate launch context
	launchContext := gin.H{
		"appletId":      config.AppletID,
		"appletName":    config.AppletName,
		"userId":        currentUser.ID,
		"schoolId":      currentUser.SchoolID,
		"divisionId":    currentUser.DivisionID,
		"departmentId":  currentUser.DepartmentID,
		"userRole":      string(currentUser.Role),
		"permissions":   getUserAppletPermissions(currentUser, config),
		"settings":      filterUserVisibleSettings(config.Settings),
		"customFields":  config.CustomFields,
		"launchedAt":    time.Now(),
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Applet launched successfully",
		"context": launchContext,
	})
}

// getMyAppletPermissions handles GET /api/v1/applets/access/permissions
func getMyAppletPermissions(c *gin.Context) {
	currentUser := middleware.GetCurrentUser(c)
	
	if currentUser.SchoolID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not associated with a school"})
		return
	}
	
	configs, err := firestoreService.ListAppletConfigsBySchool(currentUser.SchoolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get applet permissions"})
		return
	}
	
	permissions := make(map[string]interface{})
	
	for _, config := range configs {
		if config.IsEnabled && canUserAccessApplet(currentUser, config) {
			permissions[config.AppletID] = gin.H{
				"hasAccess":   true,
				"permissions": getUserAppletPermissions(currentUser, config),
				"isAdmin":     isUserAppletAdmin(currentUser.ID, config.AppletAdmins),
			}
		}
	}
	
	c.JSON(http.StatusOK, gin.H{"permissions": permissions})
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

// canUserAccessApplet checks if a user can access a specific applet
func canUserAccessApplet(currentUser *middleware.CurrentUser, config *models.SchoolAppletConfig) bool {
	// Check if enabled for user's role
	if len(config.EnabledForRoles) > 0 {
		roleAllowed := false
		for _, role := range config.EnabledForRoles {
			if currentUser.Role == role {
				roleAllowed = true
				break
			}
		}
		if !roleAllowed {
			return false
		}
	}
	
	// Check if enabled for user's division
	if len(config.EnabledForDivisions) > 0 && currentUser.DivisionType != "" {
		divisionAllowed := false
		for _, divType := range config.EnabledForDivisions {
			if currentUser.DivisionType == divType {
				divisionAllowed = true
				break
			}
		}
		if !divisionAllowed {
			return false
		}
	}
	
	return true
}

// getUserAppletPermissions gets the permissions for a user within an applet
func getUserAppletPermissions(currentUser *middleware.CurrentUser, config *models.SchoolAppletConfig) []string {
	var permissions []string
	
	// Base permissions based on role
	switch currentUser.Role {
	case models.Teacher:
		permissions = append(permissions, "read", "create")
	case models.DepartmentHead, models.AssistantPrincipal, models.Principal:
		permissions = append(permissions, "read", "create", "update", "view_reports")
	case models.SuperAdmin:
		permissions = append(permissions, "read", "create", "update", "delete", "view_reports", "manage")
	}
	
	// Additional permissions for applet admins
	if isUserAppletAdmin(currentUser.ID, config.AppletAdmins) {
		permissions = append(permissions, "admin", "configure", "view_analytics")
	}
	
	return permissions
}

// isUserAppletAdmin checks if user is an admin for this applet
func isUserAppletAdmin(userID string, appletAdmins []string) bool {
	for _, adminID := range appletAdmins {
		if adminID == userID {
			return true
		}
	}
	return false
}

// getAppletDescription gets description from registry
func getAppletDescription(appletID string) string {
	coreApplets := models.GetCoreApplets()
	for _, applet := range coreApplets {
		if applet.ID == appletID {
			return applet.Description
		}
	}
	return ""
}

// getAppletCategory gets category from registry
func getAppletCategory(appletID string) string {
	coreApplets := models.GetCoreApplets()
	for _, applet := range coreApplets {
		if applet.ID == appletID {
			return applet.Category
		}
	}
	return ""
}

// filterUserVisibleSettings filters settings that users should see
func filterUserVisibleSettings(settings map[string]interface{}) map[string]interface{} {
	if settings == nil {
		return make(map[string]interface{})
	}
	
	filtered := make(map[string]interface{})
	
	// Copy settings that are user-visible (exclude sensitive admin settings)
	for key, value := range settings {
		if !isAdminOnlySetting(key) {
			filtered[key] = value
		}
	}
	
	return filtered
}

// isAdminOnlySetting checks if a setting should be hidden from regular users
func isAdminOnlySetting(key string) bool {
	adminOnlyKeys := []string{
		"adminPassword",
		"apiKey",
		"secret",
		"internalConfig",
		"debugMode",
	}
	
	for _, adminKey := range adminOnlyKeys {
		if key == adminKey {
			return true
		}
	}
	
	return false
}

// getUserLastAccessed gets when user last accessed the applet (placeholder)
func getUserLastAccessed(userID, appletID string) *time.Time {
	// This would be implemented to query launch records
	// For now, return nil
	return nil
}

// Additional implementations for bulk operations, usage stats, etc. would continue here...

// Placeholder functions for missing handlers
func bulkConfigureApplets(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Bulk configure applets not implemented yet"})
}

func bulkUpdateAppletSettings(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Bulk update applet settings not implemented yet"})
}

func getAppletUsageStats(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Applet usage stats not implemented yet"})
}

func getSchoolAppletAuditLog(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "School applet audit log not implemented yet"})
}

func resetSchoolApplet(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Reset school applet not implemented yet"})
}

func getAppletSystemHealth(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Applet system health not implemented yet"})
}

// main function for local testing (not used in Cloud Functions)
func main() {
	// This is only used for local development
	// In production, the Functions Framework handles the HTTP routing
}
