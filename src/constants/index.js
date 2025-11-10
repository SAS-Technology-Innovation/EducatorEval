// Application Routes
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    OBSERVATIONS: '/observations',
    SCHEDULE: '/schedule',
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_ORGANIZATIONS: '/admin/organizations',
    SETTINGS: '/settings'
};
// User Roles
export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    PRINCIPAL: 'principal',
    ASSISTANT_PRINCIPAL: 'assistant_principal',
    TEACHER: 'teacher',
    SPECIALIST_TEACHER: 'specialist_teacher',
    OBSERVER: 'observer',
    COACH: 'coach'
};
// Permissions
export const PERMISSIONS = {
    USERS_CREATE: 'users.create',
    USERS_READ: 'users.read',
    USERS_UPDATE: 'users.update',
    USERS_DELETE: 'users.delete',
    ORGANIZATIONS_CREATE: 'organizations.create',
    ORGANIZATIONS_READ: 'organizations.read',
    ORGANIZATIONS_UPDATE: 'organizations.update',
    ORGANIZATIONS_DELETE: 'organizations.delete',
    OBSERVATIONS_CREATE: 'observations.create',
    OBSERVATIONS_READ: 'observations.read',
    OBSERVATIONS_UPDATE: 'observations.update',
    OBSERVATIONS_DELETE: 'observations.delete',
    SYSTEM_ADMIN: 'system.admin'
};
// School Types
export const SCHOOL_TYPES = {
    EARLY_LEARNING_CENTER: 'early_learning_center',
    ELEMENTARY: 'elementary',
    MIDDLE: 'middle',
    HIGH: 'high',
    K12: 'k12'
};
// Grade Levels
export const GRADE_LEVELS = [
    'PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];
// Status Options
export const STATUS_OPTIONS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
};
// Observation Status
export const OBSERVATION_STATUS = {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};
// API Endpoints
export const API_ENDPOINTS = {
    USERS: '/api/users',
    SCHOOLS: '/api/schools',
    DIVISIONS: '/api/divisions',
    DEPARTMENTS: '/api/departments',
    OBSERVATIONS: '/api/observations'
};
