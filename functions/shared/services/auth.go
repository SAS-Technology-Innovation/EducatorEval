package services

import (
	"context"
	"fmt"

	"firebase.google.com/go/v4/auth"
	firebase "firebase.google.com/go/v4"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/models"
)

// AuthService provides Firebase Auth operations
type AuthService struct {
	client *auth.Client
	ctx    context.Context
}

// NewAuthService creates a new Auth service
func NewAuthService(app *firebase.App) (*AuthService, error) {
	ctx := context.Background()
	client, err := app.Auth(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create Auth client: %v", err)
	}

	return &AuthService{
		client: client,
		ctx:    ctx,
	}, nil
}

// CreateUser creates a new user in Firebase Auth
func (as *AuthService) CreateUser(email, password string, user *models.User) (*auth.UserRecord, error) {
	params := (&auth.UserToCreate{}).
		Email(email).
		Password(password).
		DisplayName(user.DisplayName).
		Disabled(false)

	record, err := as.client.CreateUser(as.ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %v", err)
	}

	// Set custom claims for role-based access
	claims := map[string]interface{}{
		"role":         string(user.PrimaryRole),
		"schoolId":     user.SchoolID,
		"divisionId":   user.DivisionID,
		"departmentId": user.DepartmentID,
		"permissions":  user.Permissions,
	}

	if err := as.client.SetCustomUserClaims(as.ctx, record.UID, claims); err != nil {
		return nil, fmt.Errorf("failed to set custom claims: %v", err)
	}

	return record, nil
}

// GetUser retrieves a user from Firebase Auth
func (as *AuthService) GetUser(uid string) (*auth.UserRecord, error) {
	return as.client.GetUser(as.ctx, uid)
}

// GetUserByEmail retrieves a user by email
func (as *AuthService) GetUserByEmail(email string) (*auth.UserRecord, error) {
	return as.client.GetUserByEmail(as.ctx, email)
}

// UpdateUser updates a user in Firebase Auth
func (as *AuthService) UpdateUser(uid string, params *auth.UserToUpdate) (*auth.UserRecord, error) {
	return as.client.UpdateUser(as.ctx, uid, params)
}

// DeleteUser deletes a user from Firebase Auth
func (as *AuthService) DeleteUser(uid string) error {
	return as.client.DeleteUser(as.ctx, uid)
}

// SetCustomClaims sets custom claims for a user
func (as *AuthService) SetCustomClaims(uid string, claims map[string]interface{}) error {
	return as.client.SetCustomUserClaims(as.ctx, uid, claims)
}

// UpdateUserRole updates a user's role and permissions
func (as *AuthService) UpdateUserRole(uid string, user *models.User) error {
	claims := map[string]interface{}{
		"role":         string(user.PrimaryRole),
		"schoolId":     user.SchoolID,
		"divisionId":   user.DivisionID,
		"departmentId": user.DepartmentID,
		"permissions":  user.Permissions,
	}

	return as.client.SetCustomUserClaims(as.ctx, uid, claims)
}

// VerifyIDToken verifies a Firebase ID token
func (as *AuthService) VerifyIDToken(idToken string) (*auth.Token, error) {
	return as.client.VerifyIDToken(as.ctx, idToken)
}

// CreateCustomToken creates a custom token for a user
func (as *AuthService) CreateCustomToken(uid string, claims map[string]interface{}) (string, error) {
	return as.client.CustomToken(as.ctx, uid)
}

// ListUsers lists users with pagination
func (as *AuthService) ListUsers(maxResults int, pageToken string) ([]*auth.ExportedUserRecord, string, error) {
	pager := &auth.ExportedUserRecord{}
	iter := as.client.Users(as.ctx, pageToken)
	
	var users []*auth.ExportedUserRecord
	count := 0
	nextPageToken := ""
	
	for count < maxResults {
		user, err := iter.Next()
		if err != nil {
			if err.Error() == "iterator done" {
				break
			}
			return nil, "", err
		}
		users = append(users, user)
		count++
		pager = user
	}
	
	// Get next page token if there are more users
	if count == maxResults {
		nextPageToken = pager.UID
	}
	
	return users, nextPageToken, nil
}

// BulkCreateUsers creates multiple users at once
func (as *AuthService) BulkCreateUsers(users []auth.UserToCreate) ([]*auth.UserRecord, error) {
	var records []*auth.UserRecord
	
	for _, userToCreate := range users {
		record, err := as.client.CreateUser(as.ctx, &userToCreate)
		if err != nil {
			return nil, fmt.Errorf("failed to create user %s: %v", userToCreate.Email, err)
		}
		records = append(records, record)
	}
	
	return records, nil
}

// DisableUser disables a user account
func (as *AuthService) DisableUser(uid string) error {
	params := (&auth.UserToUpdate{}).Disabled(true)
	_, err := as.client.UpdateUser(as.ctx, uid, params)
	return err
}

// EnableUser enables a user account
func (as *AuthService) EnableUser(uid string) error {
	params := (&auth.UserToUpdate{}).Disabled(false)
	_, err := as.client.UpdateUser(as.ctx, uid, params)
	return err
}

// SendPasswordResetEmail sends a password reset email
func (as *AuthService) SendPasswordResetEmail(email string) (string, error) {
	return as.client.PasswordResetLink(as.ctx, email)
}

// SendEmailVerificationLink sends an email verification link
func (as *AuthService) SendEmailVerificationLink(email string) (string, error) {
	return as.client.EmailVerificationLink(as.ctx, email)
}
