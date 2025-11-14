/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number (US format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validates that a string is not empty
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Validates maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Validates that a value is a valid number
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

/**
 * Validates that a number is within a range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates a URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates employee ID format (letters and numbers only)
 */
export const isValidEmployeeId = (id: string): boolean => {
  const employeeIdRegex = /^[A-Za-z0-9]+$/;
  return employeeIdRegex.test(id);
};

/**
 * Form validation helper
 */
export interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (!rule.validator(value)) {
      return rule.message;
    }
  }
  return null;
};

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validator: (value: string) => isRequired(value),
    message
  }),
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validator: (value: string) => isValidEmail(value),
    message
  }),
  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validator: (value: string) => isValidPhone(value),
    message
  }),
  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: string) => minLength(value, min),
    message: message || `Must be at least ${min} characters long`
  }),
  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: string) => maxLength(value, max),
    message: message || `Must be no more than ${max} characters long`
  })
};
