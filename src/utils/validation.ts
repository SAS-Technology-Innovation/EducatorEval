// Data validation utilities
import { Framework, Observation, Teacher, User, Question, Section } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate Framework data
 */
export const validateFramework = (framework: Partial<Framework>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!framework.name || framework.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Framework name is required' });
  } else if (framework.name.length > 100) {
    errors.push({ field: 'name', message: 'Framework name must be less than 100 characters' });
  }

  if (!framework.description || framework.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Framework description is required' });
  } else if (framework.description.length > 500) {
    errors.push({ field: 'description', message: 'Framework description must be less than 500 characters' });
  }

  if (!framework.version || framework.version.trim().length === 0) {
    errors.push({ field: 'version', message: 'Framework version is required' });
  }

  // Status validation
  if (framework.status && !['active', 'inactive', 'draft'].includes(framework.status)) {
    errors.push({ field: 'status', message: 'Invalid framework status' });
  }

  // Sections validation
  if (framework.sections && framework.sections.length > 0) {
    let totalWeight = 0;
    framework.sections.forEach((section, index) => {
      const sectionErrors = validateSection(section);
      sectionErrors.errors.forEach(error => {
        errors.push({
          field: `sections[${index}].${error.field}`,
          message: error.message
        });
      });
      totalWeight += section.weight || 0;
    });

    // Check if total weight equals 100%
    if (Math.abs(totalWeight - 100) > 0.01) {
      errors.push({ field: 'sections', message: 'Total section weights must equal 100%' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate Section data
 */
export const validateSection = (section: Partial<Section>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!section.title || section.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Section title is required' });
  } else if (section.title.length > 100) {
    errors.push({ field: 'title', message: 'Section title must be less than 100 characters' });
  }

  if (!section.description || section.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Section description is required' });
  }

  if (section.weight === undefined || section.weight < 0 || section.weight > 100) {
    errors.push({ field: 'weight', message: 'Section weight must be between 0 and 100' });
  }

  // Questions validation
  if (section.questions && section.questions.length > 0) {
    section.questions.forEach((question, index) => {
      const questionErrors = validateQuestion(question);
      questionErrors.errors.forEach(error => {
        errors.push({
          field: `questions[${index}].${error.field}`,
          message: error.message
        });
      });
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate Question data
 */
export const validateQuestion = (question: Partial<Question>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!question.text || question.text.trim().length === 0) {
    errors.push({ field: 'text', message: 'Question text is required' });
  } else if (question.text.length > 500) {
    errors.push({ field: 'text', message: 'Question text must be less than 500 characters' });
  }

  // Type validation
  const validTypes = ['rating', 'text', 'multiselect', 'single-select', 'yes-no'];
  if (!question.type || !validTypes.includes(question.type)) {
    errors.push({ field: 'type', message: 'Invalid question type' });
  }

  // Scale validation for rating questions
  if (question.type === 'rating') {
    if (!question.scale || question.scale < 2 || question.scale > 10) {
      errors.push({ field: 'scale', message: 'Rating scale must be between 2 and 10' });
    }
  }

  // Weight validation
  if (question.weight === undefined || question.weight < 0 || question.weight > 100) {
    errors.push({ field: 'weight', message: 'Question weight must be between 0 and 100' });
  }

  // Options validation for select questions
  if (['multiselect', 'single-select'].includes(question.type || '')) {
    if (!question.options || question.options.length < 2) {
      errors.push({ field: 'options', message: 'Select questions must have at least 2 options' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate Observation data
 */
export const validateObservation = (observation: Partial<Observation>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!observation.teacherId || observation.teacherId.trim().length === 0) {
    errors.push({ field: 'teacherId', message: 'Teacher selection is required' });
  }

  if (!observation.observerId || observation.observerId.trim().length === 0) {
    errors.push({ field: 'observerId', message: 'Observer ID is required' });
  }

  if (!observation.frameworkId || observation.frameworkId.trim().length === 0) {
    errors.push({ field: 'frameworkId', message: 'Framework selection is required' });
  }

  if (!observation.date || observation.date.trim().length === 0) {
    errors.push({ field: 'date', message: 'Observation date is required' });
  }

  // Duration validation
  if (observation.duration !== undefined && (observation.duration < 5 || observation.duration > 180)) {
    errors.push({ field: 'duration', message: 'Observation duration must be between 5 and 180 minutes' });
  }

  // Status validation
  const validStatuses = ['draft', 'in-progress', 'completed', 'submitted'];
  if (observation.status && !validStatuses.includes(observation.status)) {
    errors.push({ field: 'status', message: 'Invalid observation status' });
  }

  // Validate that completed observations have responses
  if (observation.status === 'completed' || observation.status === 'submitted') {
    if (!observation.responses || Object.keys(observation.responses).length === 0) {
      errors.push({ field: 'responses', message: 'Completed observations must have responses' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate Teacher data
 */
export const validateTeacher = (teacher: Partial<Teacher>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!teacher.name || teacher.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Teacher name is required' });
  } else if (teacher.name.length > 100) {
    errors.push({ field: 'name', message: 'Teacher name must be less than 100 characters' });
  }

  if (!teacher.email || teacher.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Teacher email is required' });
  } else if (!isValidEmail(teacher.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!teacher.department || teacher.department.trim().length === 0) {
    errors.push({ field: 'department', message: 'Department is required' });
  }

  // Subjects validation
  if (!teacher.subjects || teacher.subjects.length === 0) {
    errors.push({ field: 'subjects', message: 'At least one subject is required' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate User data
 */
export const validateUser = (user: Partial<User>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!user.name || user.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (user.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  if (!user.email || user.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(user.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Role validation
  const validRoles = ['admin', 'coordinator', 'observer', 'teacher'];
  if (!user.role || !validRoles.includes(user.role)) {
    errors.push({ field: 'role', message: 'Valid role is required' });
  }

  if (!user.department || user.department.trim().length === 0) {
    errors.push({ field: 'department', message: 'Department is required' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Email validation helper
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate CSV file headers for bulk import
 */
export const validateCSVHeaders = (
  headers: string[],
  requiredHeaders: string[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

  requiredHeaders.forEach(required => {
    if (!normalizedHeaders.includes(required.toLowerCase())) {
      errors.push({
        field: 'headers',
        message: `Missing required column: ${required}`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, ''); // Remove angle brackets
};

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: File,
  allowedTypes: string[],
  maxSizeBytes: number
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: 'file',
      message: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    });
  }

  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    errors.push({
      field: 'file',
      message: `File size must be less than ${maxSizeMB}MB`
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
