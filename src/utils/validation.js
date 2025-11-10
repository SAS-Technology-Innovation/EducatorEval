/**
 * Validates an email address
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Validates a phone number (US format)
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
};
/**
 * Validates that a string is not empty
 */
export const isRequired = (value) => {
    return value.trim().length > 0;
};
/**
 * Validates minimum length
 */
export const minLength = (value, min) => {
    return value.length >= min;
};
/**
 * Validates maximum length
 */
export const maxLength = (value, max) => {
    return value.length <= max;
};
/**
 * Validates that a value is a valid number
 */
export const isValidNumber = (value) => {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};
/**
 * Validates that a number is within a range
 */
export const isInRange = (value, min, max) => {
    return value >= min && value <= max;
};
/**
 * Validates a URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
/**
 * Validates employee ID format (letters and numbers only)
 */
export const isValidEmployeeId = (id) => {
    const employeeIdRegex = /^[A-Za-z0-9]+$/;
    return employeeIdRegex.test(id);
};
export const validateField = (value, rules) => {
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
    required: (message = 'This field is required') => ({
        validator: (value) => isRequired(value),
        message
    }),
    email: (message = 'Please enter a valid email address') => ({
        validator: (value) => isValidEmail(value),
        message
    }),
    phone: (message = 'Please enter a valid phone number') => ({
        validator: (value) => isValidPhone(value),
        message
    }),
    minLength: (min, message) => ({
        validator: (value) => minLength(value, min),
        message: message || `Must be at least ${min} characters long`
    }),
    maxLength: (max, message) => ({
        validator: (value) => maxLength(value, max),
        message: message || `Must be no more than ${max} characters long`
    })
};
