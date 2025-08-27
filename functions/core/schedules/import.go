package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// ScheduleImportRow represents a single row from the schedule CSV import
type ScheduleImportRow struct {
	SchoolLevel     string `csv:"School Level"`
	ClassID         string `csv:"CLASS: Class ID"`
	SchoolYear      string `csv:"School Year"`
	Class           string `csv:"Class"`
	Teachers        string `csv:"CLASS: Teachers"`
	StartDate       string `csv:"CLASS: Start Date"`
	EndDate         string `csv:"CLASS: End Date"`
	CourseID        string `csv:"CLASS: Course ID"`
	GradingPeriod   string `csv:"CLASS: Grading Period"`
	Day             string `csv:"Day"`
	Block           string `csv:"Block"`
	BlockStart      string `csv:"Block Start"`
	BlockEnd        string `csv:"Block End"`
	StartOverride   string `csv:"Start Time (Override)"`
	EndOverride     string `csv:"End Time (Override)"`
	Room            string `csv:"Room (Override)"`
}

// ParsedScheduleEntry represents the processed schedule data
type ParsedScheduleEntry struct {
	ClassID         string    `firestore:"classId"`
	SchoolLevel     string    `firestore:"schoolLevel"`
	SchoolYear      string    `firestore:"schoolYear"`
	ClassName       string    `firestore:"className"`
	Teachers        []string  `firestore:"teachers"`
	CourseID        string    `firestore:"courseId"`
	Subject         string    `firestore:"subject"`
	GradingPeriod   string    `firestore:"gradingPeriod"`
	StartDate       time.Time `firestore:"startDate"`
	EndDate         time.Time `firestore:"endDate"`
	DayType         string    `firestore:"dayType"`
	Block           string    `firestore:"block"`
	Period          string    `firestore:"period"`
	StartTime       string    `firestore:"startTime"`
	EndTime         string    `firestore:"endTime"`
	Room            string    `firestore:"room"`
	CreatedAt       time.Time `firestore:"createdAt"`
	UpdatedAt       time.Time `firestore:"updatedAt"`
}

// importScheduleCSV handles the CSV upload and processing
func importScheduleCSV(c *gin.Context) {
	// Get the uploaded file
	file, header, err := c.Request.FormFile("schedule_file")
	if err != nil {
		c.JSON(400, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	// Validate file type
	if !strings.HasSuffix(strings.ToLower(header.Filename), ".csv") {
		c.JSON(400, gin.H{"error": "File must be a CSV"})
		return
	}

	// Parse CSV
	entries, err := parseScheduleCSV(file)
	if err != nil {
		c.JSON(400, gin.H{"error": fmt.Sprintf("Failed to parse CSV: %v", err)})
		return
	}

	// Validate and process entries
	validEntries, errors := validateScheduleEntries(entries)
	if len(validEntries) == 0 {
		c.JSON(400, gin.H{
			"error": "No valid schedule entries found",
			"validation_errors": errors,
		})
		return
	}

	// Save to Firestore
	importResults, err := saveScheduleEntries(c.Request.Context(), validEntries)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to save schedule entries: %v", err)})
		return
	}

	c.JSON(200, gin.H{
		"message": "Schedule import completed",
		"total_processed": len(entries),
		"valid_entries": len(validEntries),
		"saved_entries": importResults.Created,
		"updated_entries": importResults.Updated,
		"validation_errors": errors,
	})
}

// parseScheduleCSV parses the uploaded CSV file
func parseScheduleCSV(file multipart.File) ([]ScheduleImportRow, error) {
	reader := csv.NewReader(file)
	
	// Read header row
	headers, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("failed to read CSV headers: %v", err)
	}

	// Create column mapping
	columnMap := make(map[string]int)
	for i, header := range headers {
		columnMap[strings.TrimSpace(header)] = i
	}

	var entries []ScheduleImportRow
	
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("failed to read CSV row: %v", err)
		}

		// Skip empty rows
		if len(strings.Join(record, "")) == 0 {
			continue
		}

		entry := ScheduleImportRow{}
		
		// Map CSV columns to struct fields using column positions
		if idx, ok := columnMap["School Level"]; ok && idx < len(record) {
			entry.SchoolLevel = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["CLASS: Class ID"]; ok && idx < len(record) {
			entry.ClassID = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["School Year"]; ok && idx < len(record) {
			entry.SchoolYear = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["Class"]; ok && idx < len(record) {
			entry.Class = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["CLASS: Teachers"]; ok && idx < len(record) {
			entry.Teachers = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["CLASS: Start Date"]; ok && idx < len(record) {
			entry.StartDate = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["CLASS: End Date"]; ok && idx < len(record) {
			entry.EndDate = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["CLASS: Course ID"]; ok && idx < len(record) {
			entry.CourseID = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["CLASS: Grading Period"]; ok && idx < len(record) {
			entry.GradingPeriod = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["Day"]; ok && idx < len(record) {
			entry.Day = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["Block"]; ok && idx < len(record) {
			entry.Block = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["Block Start"]; ok && idx < len(record) {
			entry.BlockStart = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["Block End"]; ok && idx < len(record) {
			entry.BlockEnd = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["Start Time (Override)"]; ok && idx < len(record) {
			entry.StartOverride = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["End Time (Override)"]; ok && idx < len(record) {
			entry.EndOverride = strings.TrimSpace(record[idx])
		}
		if idx, ok := columnMap["Room (Override)"]; ok && idx < len(record) {
			entry.Room = strings.TrimSpace(record[idx])
		}

		entries = append(entries, entry)
	}

	return entries, nil
}

// validateScheduleEntries validates and converts raw CSV entries to structured data
func validateScheduleEntries(rawEntries []ScheduleImportRow) ([]ParsedScheduleEntry, []string) {
	var validEntries []ParsedScheduleEntry
	var errors []string

	for i, raw := range rawEntries {
		rowNum := i + 2 // Account for header row
		
		// Skip rows with missing essential data
		if raw.ClassID == "" || raw.Class == "" || raw.Teachers == "" {
			if raw.ClassID != "" || raw.Class != "" || raw.Teachers != "" {
				errors = append(errors, fmt.Sprintf("Row %d: Missing required fields (Class ID, Class, or Teachers)", rowNum))
			}
			continue
		}

		entry := ParsedScheduleEntry{
			ClassID:       raw.ClassID,
			SchoolLevel:   raw.SchoolLevel,
			SchoolYear:    raw.SchoolYear,
			ClassName:     raw.Class,
			CourseID:      raw.CourseID,
			GradingPeriod: raw.GradingPeriod,
			DayType:       raw.Day,
			Block:         raw.Block,
			Room:          raw.Room,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		// Parse teachers (comma-separated)
		if raw.Teachers != "" {
			teachers := strings.Split(raw.Teachers, ",")
			for i, teacher := range teachers {
				teachers[i] = strings.TrimSpace(teacher)
			}
			entry.Teachers = teachers
		}

		// Extract subject from class name
		if strings.Contains(raw.Class, ":") {
			parts := strings.SplitN(raw.Class, ":", 2)
			if len(parts) > 1 {
				entry.Subject = strings.TrimSpace(parts[1])
			}
		} else {
			entry.Subject = raw.Class
		}

		// Parse dates
		if raw.StartDate != "" {
			if startDate, err := parseDate(raw.StartDate); err == nil {
				entry.StartDate = startDate
			} else {
				errors = append(errors, fmt.Sprintf("Row %d: Invalid start date format: %s", rowNum, raw.StartDate))
			}
		}

		if raw.EndDate != "" {
			if endDate, err := parseDate(raw.EndDate); err == nil {
				entry.EndDate = endDate
			} else {
				errors = append(errors, fmt.Sprintf("Row %d: Invalid end date format: %s", rowNum, raw.EndDate))
			}
		}

		// Parse times (use override times if available, otherwise block times)
		startTime := raw.StartOverride
		if startTime == "" {
			startTime = raw.BlockStart
		}
		endTime := raw.EndOverride
		if endTime == "" {
			endTime = raw.BlockEnd
		}

		if startTime != "" {
			if normalizedTime, err := normalizeTime(startTime); err == nil {
				entry.StartTime = normalizedTime
			} else {
				errors = append(errors, fmt.Sprintf("Row %d: Invalid start time format: %s", rowNum, startTime))
			}
		}

		if endTime != "" {
			if normalizedTime, err := normalizeTime(endTime); err == nil {
				entry.EndTime = normalizedTime
			} else {
				errors = append(errors, fmt.Sprintf("Row %d: Invalid end time format: %s", rowNum, endTime))
			}
		}

		// Extract period from block (e.g., "A3" -> period "3", "C1" -> period "1")
		if raw.Block != "" {
			if len(raw.Block) > 1 {
				period := raw.Block[1:]
				entry.Period = period
			}
		}

		validEntries = append(validEntries, entry)
	}

	return validEntries, errors
}

// parseDate parses various date formats commonly used in school systems
func parseDate(dateStr string) (time.Time, error) {
	// Try common date formats
	formats := []string{
		"02/01/06",   // DD/MM/YY
		"01/02/06",   // MM/DD/YY
		"2006-01-02", // YYYY-MM-DD
		"02/01/2006", // DD/MM/YYYY
		"01/02/2006", // MM/DD/YYYY
	}

	for _, format := range formats {
		if t, err := time.Parse(format, dateStr); err == nil {
			return t, nil
		}
	}

	return time.Time{}, fmt.Errorf("unable to parse date: %s", dateStr)
}

// normalizeTime converts various time formats to HH:MM format
func normalizeTime(timeStr string) (string, error) {
	// Remove any extra spaces
	timeStr = strings.TrimSpace(timeStr)
	
	// If already in HH:MM format, validate and return
	if matched, _ := regexp.MatchString(`^\d{1,2}:\d{2}$`, timeStr); matched {
		parts := strings.Split(timeStr, ":")
		if len(parts) == 2 {
			hour, err1 := strconv.Atoi(parts[0])
			minute, err2 := strconv.Atoi(parts[1])
			if err1 == nil && err2 == nil && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 {
				return fmt.Sprintf("%02d:%02d", hour, minute), nil
			}
		}
	}

	// Try parsing as time with various formats
	formats := []string{
		"15:04",    // 24-hour
		"3:04 PM",  // 12-hour with PM
		"3:04 AM",  // 12-hour with AM
		"3:04PM",   // 12-hour without space
		"3:04AM",   // 12-hour without space
		"15:04:05", // 24-hour with seconds
	}

	for _, format := range formats {
		if t, err := time.Parse(format, timeStr); err == nil {
			return t.Format("15:04"), nil
		}
	}

	return "", fmt.Errorf("unable to parse time: %s", timeStr)
}

// ImportResults tracks the results of a schedule import operation
type ImportResults struct {
	Created int `json:"created"`
	Updated int `json:"updated"`
	Errors  int `json:"errors"`
}

// saveScheduleEntries saves the validated entries to Firestore
func saveScheduleEntries(ctx context.Context, entries []ParsedScheduleEntry) (*ImportResults, error) {
	results := &ImportResults{}
	
	// Group entries by class ID to handle multiple schedule entries per class
	classGroups := make(map[string][]ParsedScheduleEntry)
	for _, entry := range entries {
		classGroups[entry.ClassID] = append(classGroups[entry.ClassID], entry)
	}

	// Process each class
	for classID, classEntries := range classGroups {
		// Create or update the main class document
		classDoc := map[string]interface{}{
			"classId":       classID,
			"className":     classEntries[0].ClassName,
			"schoolLevel":   classEntries[0].SchoolLevel,
			"schoolYear":    classEntries[0].SchoolYear,
			"teachers":      classEntries[0].Teachers,
			"courseId":      classEntries[0].CourseID,
			"subject":       classEntries[0].Subject,
			"gradingPeriod": classEntries[0].GradingPeriod,
			"startDate":     classEntries[0].StartDate,
			"endDate":       classEntries[0].EndDate,
			"room":          classEntries[0].Room,
			"updatedAt":     time.Now(),
		}

		// Check if class already exists
		classRef := firestoreClient.Collection("classes").Doc(classID)
		_, err := classRef.Get(ctx)
		
		if status.Code(err) == codes.NotFound {
			// Create new class
			classDoc["createdAt"] = time.Now()
			_, err = classRef.Set(ctx, classDoc)
			if err != nil {
				results.Errors++
				continue
			}
			results.Created++
		} else if err == nil {
			// Update existing class
			_, err = classRef.Set(ctx, classDoc, firestore.MergeAll)
			if err != nil {
				results.Errors++
				continue
			}
			results.Updated++
		} else {
			results.Errors++
			continue
		}

		// Create schedule entries for this class
		for _, entry := range classEntries {
			scheduleID := fmt.Sprintf("%s_%s_%s", classID, entry.DayType, entry.Block)
			scheduleDoc := map[string]interface{}{
				"classId":   classID,
				"dayType":   entry.DayType,
				"block":     entry.Block,
				"period":    entry.Period,
				"startTime": entry.StartTime,
				"endTime":   entry.EndTime,
				"room":      entry.Room,
				"createdAt": time.Now(),
				"updatedAt": time.Now(),
			}

			scheduleRef := firestoreClient.Collection("class_schedules").Doc(scheduleID)
			_, err = scheduleRef.Set(ctx, scheduleDoc, firestore.MergeAll)
			if err != nil {
				results.Errors++
			}
		}
	}

	return results, nil
}

// getImportTemplate returns a CSV template for schedule imports
func getImportTemplate(c *gin.Context) {
	template := `School Level,CLASS: Class ID,School Year,Class,CLASS: Teachers,CLASS: Start Date,CLASS: End Date,CLASS: Course ID,CLASS: Grading Period,Day,Block,Block Start,Block End,Start Time (Override),End Time (Override),Room (Override)
High School,APChineseLgCulture-1,25-26,APChineseLgCulture-1: AP Chinese Language/Culture,"Chen, Yan",13/08/25,05/06/26,45025,AP Chinese Language/Culture,HS Semester 1,A,A3,12:10,13:30,,H405
High School,APChineseLgCulture-1,25-26,APChineseLgCulture-1: AP Chinese Language/Culture,"Chen, Yan",13/08/25,05/06/26,45025,AP Chinese Language/Culture,HS Semester 1,C,C1,8:00,9:20,,H405`

	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=schedule_import_template.csv")
	c.String(200, template)
}