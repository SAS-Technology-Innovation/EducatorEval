package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// ValidationMiddleware provides request validation
var validate *validator.Validate

func init() {
	validate = validator.New()
}

// ValidateJSON validates JSON request body
func ValidateJSON(obj interface{}) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if err := c.ShouldBindJSON(obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid JSON",
				"details": err.Error(),
			})
			c.Abort()
			return
		}

		if err := validate.Struct(obj); err != nil {
			var errors []ValidationError
			for _, err := range err.(validator.ValidationErrors) {
				errors = append(errors, ValidationError{
					Field:   err.Field(),
					Tag:     err.Tag(),
					Value:   err.Value(),
					Message: getValidationMessage(err),
				})
			}

			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Validation failed",
				"details": errors,
			})
			c.Abort()
			return
		}

		c.Next()
	})
}

// ValidationError represents a validation error
type ValidationError struct {
	Field   string      `json:"field"`
	Tag     string      `json:"tag"`
	Value   interface{} `json:"value"`
	Message string      `json:"message"`
}

// getValidationMessage returns a human-readable validation message
func getValidationMessage(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email format"
	case "min":
		return "Value is too short"
	case "max":
		return "Value is too long"
	case "uuid":
		return "Invalid UUID format"
	case "oneof":
		return "Value must be one of the allowed options"
	default:
		return fe.Error()
	}
}

// ValidateQueryParams validates query parameters
func ValidateQueryParams(validParams map[string]string) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		query := c.Request.URL.Query()
		
		var errors []string
		for param, value := range query {
			if len(value) == 0 {
				continue
			}
			
			paramValue := value[0]
			if expectedType, exists := validParams[param]; exists {
				if !validateParamType(paramValue, expectedType) {
					errors = append(errors, "Invalid type for parameter '"+param+"', expected "+expectedType)
				}
			}
		}
		
		if len(errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid query parameters",
				"details": errors,
			})
			c.Abort()
			return
		}
		
		c.Next()
	})
}

// validateParamType validates parameter type
func validateParamType(value, expectedType string) bool {
	switch expectedType {
	case "string":
		return true // Any string is valid
	case "int":
		return value != "" && isValidInt(value)
	case "bool":
		return value == "true" || value == "false"
	case "uuid":
		return validate.Var(value, "uuid") == nil
	default:
		return true
	}
}

// isValidInt checks if string is a valid integer
func isValidInt(s string) bool {
	return validate.Var(s, "numeric") == nil
}

// RequiredFields validates that required fields are present
func RequiredFields(fields ...string) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		var json map[string]interface{}
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid JSON",
			})
			c.Abort()
			return
		}

		var missingFields []string
		for _, field := range fields {
			if value, exists := json[field]; !exists || value == nil || value == "" {
				missingFields = append(missingFields, field)
			}
		}

		if len(missingFields) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":          "Missing required fields",
				"missing_fields": missingFields,
			})
			c.Abort()
			return
		}

		// Put the parsed JSON back in context for next handler
		c.Set("json", json)
		c.Next()
	})
}

// ContentType validates content type
func ContentType(contentType string) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		ct := c.GetHeader("Content-Type")
		if ct != contentType {
			c.JSON(http.StatusUnsupportedMediaType, gin.H{
				"error":           "Unsupported content type",
				"expected":        contentType,
				"received":        ct,
			})
			c.Abort()
			return
		}
		c.Next()
	})
}

// MaxFileSize validates maximum file size for uploads
func MaxFileSize(maxSize int64) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxSize)
		c.Next()
	})
}
