package services

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"github.com/SAS-Technology-Innovation/EducatorEval/functions/shared/models"
	"google.golang.org/api/iterator"
)

// FirestoreService provides Firestore operations
type FirestoreService struct {
	client *firestore.Client
	ctx    context.Context
}

// NewFirestoreService creates a new Firestore service
func NewFirestoreService(app *firebase.App) (*FirestoreService, error) {
	ctx := context.Background()
	client, err := app.Firestore(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create Firestore client: %v", err)
	}

	return &FirestoreService{
		client: client,
		ctx:    ctx,
	}, nil
}

// Close closes the Firestore client
func (fs *FirestoreService) Close() error {
	return fs.client.Close()
}

// === USER OPERATIONS ===

// CreateUser creates a new user
func (fs *FirestoreService) CreateUser(user *models.User) error {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	_, err := fs.client.Collection("users").Doc(user.ID).Set(fs.ctx, user)
	return err
}

// GetUser retrieves a user by ID
func (fs *FirestoreService) GetUser(userID string) (*models.User, error) {
	doc, err := fs.client.Collection("users").Doc(userID).Get(fs.ctx)
	if err != nil {
		return nil, err
	}

	var user models.User
	if err := doc.DataTo(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

// UpdateUser updates a user
func (fs *FirestoreService) UpdateUser(userID string, updates map[string]interface{}) error {
	updates["updatedAt"] = time.Now()
	
	// Build update list
	var updateList []firestore.Update
	for key, value := range updates {
		updateList = append(updateList, firestore.Update{Path: key, Value: value})
	}
	
	if len(updateList) > 0 {
		_, err := fs.client.Collection("users").Doc(userID).Update(fs.ctx, updateList)
		return err
	}
	
	return nil
}

// ListUsers lists users with optional filtering
func (fs *FirestoreService) ListUsers(filters map[string]interface{}) ([]*models.User, error) {
	query := fs.client.Collection("users").Query

	// Apply filters
	for field, value := range filters {
		query = query.Where(field, "==", value)
	}

	// Execute query
	iter := query.Documents(fs.ctx)
	defer iter.Stop()

	var users []*models.User
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var user models.User
		if err := doc.DataTo(&user); err != nil {
			continue
		}
		users = append(users, &user)
	}

	return users, nil
}

// GetUsersBySchool retrieves all users for a school
func (fs *FirestoreService) GetUsersBySchool(schoolID string) ([]*models.User, error) {
	return fs.ListUsers(map[string]interface{}{
		"schoolId": schoolID,
		"isActive": true,
	})
}

// GetUsersByRole retrieves users by role
func (fs *FirestoreService) GetUsersByRole(role models.UserRole) ([]*models.User, error) {
	return fs.ListUsers(map[string]interface{}{
		"primaryRole": role,
		"isActive":    true,
	})
}

// === SCHOOL OPERATIONS ===

// CreateSchool creates a new school
func (fs *FirestoreService) CreateSchool(school *models.School) error {
	school.CreatedAt = time.Now()
	school.UpdatedAt = time.Now()

	_, err := fs.client.Collection("schools").Doc(school.ID).Set(fs.ctx, school)
	return err
}

// GetSchool retrieves a school by ID
func (fs *FirestoreService) GetSchool(schoolID string) (*models.School, error) {
	doc, err := fs.client.Collection("schools").Doc(schoolID).Get(fs.ctx)
	if err != nil {
		return nil, err
	}

	var school models.School
	if err := doc.DataTo(&school); err != nil {
		return nil, err
	}

	return &school, nil
}

// UpdateSchool updates a school
func (fs *FirestoreService) UpdateSchool(schoolID string, updates map[string]interface{}) error {
	updates["updatedAt"] = time.Now()
	
	var updateList []firestore.Update
	for key, value := range updates {
		updateList = append(updateList, firestore.Update{Path: key, Value: value})
	}
	
	_, err := fs.client.Collection("schools").Doc(schoolID).Update(fs.ctx, updateList)
	return err
}

// DeleteSchool deletes a school
func (fs *FirestoreService) DeleteSchool(schoolID string) error {
	_, err := fs.client.Collection("schools").Doc(schoolID).Delete(fs.ctx)
	return err
}

// ListSchools lists all schools
func (fs *FirestoreService) ListSchools() ([]*models.School, error) {
	iter := fs.client.Collection("schools").Documents(fs.ctx)
	defer iter.Stop()

	var schools []*models.School
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var school models.School
		if err := doc.DataTo(&school); err != nil {
			continue
		}
		schools = append(schools, &school)
	}

	return schools, nil
}

// === DIVISION OPERATIONS ===

// CreateDivision creates a new division
func (fs *FirestoreService) CreateDivision(division *models.Division) error {
	division.CreatedAt = time.Now()
	division.UpdatedAt = time.Now()

	_, err := fs.client.Collection("divisions").Doc(division.ID).Set(fs.ctx, division)
	return err
}

// GetDivision retrieves a division by ID
func (fs *FirestoreService) GetDivision(divisionID string) (*models.Division, error) {
	doc, err := fs.client.Collection("divisions").Doc(divisionID).Get(fs.ctx)
	if err != nil {
		return nil, err
	}

	var division models.Division
	if err := doc.DataTo(&division); err != nil {
		return nil, err
	}

	return &division, nil
}

// ListDivisionsBySchool lists divisions for a school
func (fs *FirestoreService) ListDivisionsBySchool(schoolID string) ([]*models.Division, error) {
	iter := fs.client.Collection("divisions").Where("schoolId", "==", schoolID).Documents(fs.ctx)
	defer iter.Stop()

	var divisions []*models.Division
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var division models.Division
		if err := doc.DataTo(&division); err != nil {
			continue
		}
		divisions = append(divisions, &division)
	}

	return divisions, nil
}

// UpdateDivision updates a division
func (fs *FirestoreService) UpdateDivision(divisionID string, updates map[string]interface{}) error {
	var updateList []firestore.Update
	for key, value := range updates {
		updateList = append(updateList, firestore.Update{Path: key, Value: value})
	}
	
	_, err := fs.client.Collection("divisions").Doc(divisionID).Update(fs.ctx, updateList)
	return err
}

// DeleteDivision deletes a division
func (fs *FirestoreService) DeleteDivision(divisionID string) error {
	_, err := fs.client.Collection("divisions").Doc(divisionID).Delete(fs.ctx)
	return err
}

// === DEPARTMENT OPERATIONS ===

// CreateDepartment creates a new department
func (fs *FirestoreService) CreateDepartment(department *models.Department) error {
	department.CreatedAt = time.Now()
	department.UpdatedAt = time.Now()

	_, err := fs.client.Collection("departments").Doc(department.ID).Set(fs.ctx, department)
	return err
}

// GetDepartment retrieves a department by ID
func (fs *FirestoreService) GetDepartment(departmentID string) (*models.Department, error) {
	doc, err := fs.client.Collection("departments").Doc(departmentID).Get(fs.ctx)
	if err != nil {
		return nil, err
	}

	var department models.Department
	if err := doc.DataTo(&department); err != nil {
		return nil, err
	}

	return &department, nil
}

// ListDepartmentsByDivision lists departments for a division
func (fs *FirestoreService) ListDepartmentsByDivision(divisionID string) ([]*models.Department, error) {
	iter := fs.client.Collection("departments").Where("divisionId", "==", divisionID).Documents(fs.ctx)
	defer iter.Stop()

	var departments []*models.Department
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var department models.Department
		if err := doc.DataTo(&department); err != nil {
			continue
		}
		departments = append(departments, &department)
	}

	return departments, nil
}

// UpdateDepartment updates a department
func (fs *FirestoreService) UpdateDepartment(departmentID string, updates map[string]interface{}) error {
	var updateList []firestore.Update
	for key, value := range updates {
		updateList = append(updateList, firestore.Update{Path: key, Value: value})
	}
	
	_, err := fs.client.Collection("departments").Doc(departmentID).Update(fs.ctx, updateList)
	return err
}

// DeleteDepartment deletes a department
func (fs *FirestoreService) DeleteDepartment(departmentID string) error {
	_, err := fs.client.Collection("departments").Doc(departmentID).Delete(fs.ctx)
	return err
}

// === APPLET OPERATIONS ===

// CreateAppletConfig creates applet configuration for a school
func (fs *FirestoreService) CreateAppletConfig(config *models.SchoolAppletConfig) error {
	config.CreatedAt = time.Now()
	config.UpdatedAt = time.Now()

	_, err := fs.client.Collection("applet_configs").Doc(config.ID).Set(fs.ctx, config)
	return err
}

// GetAppletConfig retrieves applet configuration
func (fs *FirestoreService) GetAppletConfig(configID string) (*models.SchoolAppletConfig, error) {
	doc, err := fs.client.Collection("applet_configs").Doc(configID).Get(fs.ctx)
	if err != nil {
		return nil, err
	}

	var config models.SchoolAppletConfig
	if err := doc.DataTo(&config); err != nil {
		return nil, err
	}

	return &config, nil
}

// ListAppletConfigsBySchool lists applet configurations for a school
func (fs *FirestoreService) ListAppletConfigsBySchool(schoolID string) ([]*models.SchoolAppletConfig, error) {
	iter := fs.client.Collection("applet_configs").Where("schoolId", "==", schoolID).Documents(fs.ctx)
	defer iter.Stop()

	var configs []*models.SchoolAppletConfig
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var config models.SchoolAppletConfig
		if err := doc.DataTo(&config); err != nil {
			continue
		}
		configs = append(configs, &config)
	}

	return configs, nil
}

// UpdateAppletConfig updates applet configuration
func (fs *FirestoreService) UpdateAppletConfig(configID string, updates map[string]interface{}) error {
	updates["updatedAt"] = time.Now()
	
	var updateList []firestore.Update
	for key, value := range updates {
		updateList = append(updateList, firestore.Update{Path: key, Value: value})
	}
	
	_, err := fs.client.Collection("applet_configs").Doc(configID).Update(fs.ctx, updateList)
	return err
}

// === UTILITY METHODS ===

// BatchWrite performs a batch write operation
func (fs *FirestoreService) BatchWrite(operations []BatchOperation) error {
	batch := fs.client.Batch()
	
	for _, op := range operations {
		switch op.Type {
		case "create":
			batch.Set(op.Ref, op.Data)
		case "update":
			var updates []firestore.Update
			for key, value := range op.Data.(map[string]interface{}) {
				updates = append(updates, firestore.Update{Path: key, Value: value})
			}
			batch.Update(op.Ref, updates)
		case "delete":
			batch.Delete(op.Ref)
		}
	}
	
	_, err := batch.Commit(fs.ctx)
	return err
}

// RecordAppletLaunch records an applet launch event
func (fs *FirestoreService) RecordAppletLaunch(record map[string]interface{}) error {
	_, _, err := fs.client.Collection("applet_launches").Add(fs.ctx, record)
	return err
}

// BatchOperation represents a batch operation
type BatchOperation struct {
	Type string
	Ref  *firestore.DocumentRef
	Data interface{}
}

// GenerateID generates a new document ID
func (fs *FirestoreService) GenerateID() string {
	return fs.client.Collection("temp").NewDoc().ID
}
