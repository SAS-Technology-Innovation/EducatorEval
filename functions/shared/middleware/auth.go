package middleware

import (
	"net/http"
	"strings"

	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/models"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/services"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware provides authentication middleware
func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Extract the token
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		idToken := tokenParts[1]

		// Verify the token
		token, err := authService.VerifyIDToken(idToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Store user information in context
		c.Set("user_id", token.UID)
		c.Set("user_email", token.Claims["email"])
		
		// Store role and permissions from custom claims
		if role, exists := token.Claims["role"]; exists {
			c.Set("user_role", role)
		}
		if schoolId, exists := token.Claims["schoolId"]; exists {
			c.Set("school_id", schoolId)
		}
		if divisionId, exists := token.Claims["divisionId"]; exists {
			c.Set("division_id", divisionId)
		}
		if departmentId, exists := token.Claims["departmentId"]; exists {
			c.Set("department_id", departmentId)
		}
		if permissions, exists := token.Claims["permissions"]; exists {
			c.Set("permissions", permissions)
		}

		c.Next()
	}
}

// RequireRole middleware checks if user has required role
func RequireRole(requiredRoles ...models.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{"error": "Invalid user role format"})
			c.Abort()
			return
		}

		// Check if user has any of the required roles
		userRoleEnum := models.UserRole(roleStr)
		for _, requiredRole := range requiredRoles {
			if userRoleEnum == requiredRole {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
		c.Abort()
	}
}

// RequirePermission middleware checks if user has required permission
func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		permissions, exists := c.Get("permissions")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User permissions not found"})
			c.Abort()
			return
		}

		permList, ok := permissions.([]interface{})
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{"error": "Invalid permissions format"})
			c.Abort()
			return
		}

		// Check for wildcard permission (super admin)
		for _, perm := range permList {
			if permStr, ok := perm.(string); ok && permStr == "*" {
				c.Next()
				return
			}
		}

		// Check for specific permission
		for _, perm := range permList {
			if permStr, ok := perm.(string); ok && permStr == permission {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
		c.Abort()
	}
}

// RequireSchoolAccess middleware checks if user has access to specified school
func RequireSchoolAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		userSchoolId, exists := c.Get("school_id")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User school not found"})
			c.Abort()
			return
		}

		// Get school ID from request (could be in params, query, or body)
		requestSchoolId := c.Param("schoolId")
		if requestSchoolId == "" {
			requestSchoolId = c.Query("schoolId")
		}
		
		// If no school ID in request, allow (will be filtered by user's school)
		if requestSchoolId == "" {
			c.Next()
			return
		}

		// Check if user belongs to the requested school
		if userSchoolId != requestSchoolId {
			// Check if user is super admin or system admin
			userRole, roleExists := c.Get("user_role")
			if roleExists {
				roleStr := userRole.(string)
				if roleStr == string(models.SuperAdmin) || roleStr == string(models.SystemAdmin) {
					c.Next()
					return
				}
			}

			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied to this school"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireDivisionAccess middleware checks if user has access to specified division
func RequireDivisionAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		userDivisionId, exists := c.Get("division_id")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User division not found"})
			c.Abort()
			return
		}

		// Get division ID from request
		requestDivisionId := c.Param("divisionId")
		if requestDivisionId == "" {
			requestDivisionId = c.Query("divisionId")
		}

		// If no division ID in request, allow (will be filtered by user's division)
		if requestDivisionId == "" {
			c.Next()
			return
		}

		// Check if user belongs to the requested division
		if userDivisionId != requestDivisionId {
			// Check if user is admin level
			userRole, roleExists := c.Get("user_role")
			if roleExists {
				roleStr := userRole.(string)
				adminRoles := []string{
					string(models.SuperAdmin),
					string(models.SystemAdmin),
					string(models.Superintendent),
					string(models.Principal),
					string(models.AssistantPrincipal),
				}
				
				for _, adminRole := range adminRoles {
					if roleStr == adminRole {
						c.Next()
						return
					}
				}
			}

			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied to this division"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// GetCurrentUser gets current user information from context
func GetCurrentUser(c *gin.Context) *CurrentUser {
	user := &CurrentUser{}
	
	if userId, exists := c.Get("user_id"); exists {
		user.ID = userId.(string)
	}
	if email, exists := c.Get("user_email"); exists {
		user.Email = email.(string)
	}
	if role, exists := c.Get("user_role"); exists {
		user.Role = models.UserRole(role.(string))
	}
	if schoolId, exists := c.Get("school_id"); exists {
		user.SchoolID = schoolId.(string)
	}
	if divisionId, exists := c.Get("division_id"); exists {
		user.DivisionID = divisionId.(string)
	}
	if departmentId, exists := c.Get("department_id"); exists {
		user.DepartmentID = departmentId.(string)
	}
	if permissions, exists := c.Get("permissions"); exists {
		if permList, ok := permissions.([]interface{}); ok {
			for _, perm := range permList {
				if permStr, ok := perm.(string); ok {
					user.Permissions = append(user.Permissions, permStr)
				}
			}
		}
	}
	
	return user
}

// CurrentUser represents the current authenticated user
type CurrentUser struct {
	ID           string               `json:"id"`
	Email        string               `json:"email"`
	Role         models.UserRole      `json:"role"`
	SchoolID     string               `json:"schoolId"`
	DivisionID   string               `json:"divisionId"`
	DivisionType models.DivisionType  `json:"divisionType"`
	DepartmentID string               `json:"departmentId"`
	Permissions  []string             `json:"permissions"`
}

// HasPermission checks if current user has a specific permission
func (u *CurrentUser) HasPermission(permission string) bool {
	// Check for wildcard permission
	for _, perm := range u.Permissions {
		if perm == "*" {
			return true
		}
	}
	
	// Check for specific permission
	for _, perm := range u.Permissions {
		if perm == permission {
			return true
		}
	}
	
	return false
}

// CanManageUsers checks if current user can manage other users
func (u *CurrentUser) CanManageUsers() bool {
	return models.CanManageUsers(u.Role)
}

// CanConfigureApplets checks if current user can configure applets
func (u *CurrentUser) CanConfigureApplets() bool {
	return models.CanConfigureApplets(u.Role)
}

// IsEducationalRole checks if current user has an educational role
func (u *CurrentUser) IsEducationalRole() bool {
	return models.IsEducationalRole(u.Role)
}
