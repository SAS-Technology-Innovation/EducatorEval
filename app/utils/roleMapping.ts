// Role Mapping and Utilities for EducatorEval Platform

import type { UserRole, JobTitle } from '../types';

// Role Hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'staff': 1,
  'educator': 2,
  'observer': 3,
  'manager': 4,
  'administrator': 5,
  'super_admin': 6,
};

// Role Descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  'staff': 'Support staff with limited access to basic platform features',
  'educator': 'Teachers and instructional staff who can be observed and access their data',
  'observer': 'Can conduct observations and evaluations of educators',
  'manager': 'Department heads and team leads who can observe and manage their teams',
  'administrator': 'School/district administrators who can manage users and platform settings',
  'super_admin': 'System administrators with full platform access',
};

// Default Job Title to Role Mapping (suggestions for new users)
export const JOB_TITLE_TO_ROLE_MAP: Record<JobTitle, UserRole> = {
  // Leadership -> Administrator or Manager
  'superintendent': 'administrator',
  'principal': 'administrator',
  'assistant_principal': 'administrator',
  'division_director': 'administrator',
  'assistant_director': 'manager',
  
  // Department Leadership -> Manager
  'department_head': 'manager',
  'grade_chair': 'manager',
  'curriculum_coordinator': 'manager',
  'assessment_coordinator': 'manager',
  
  // Teaching Staff -> Educator
  'teacher': 'educator',
  'substitute_teacher': 'educator',
  'specialist_teacher': 'educator',
  'instructional_coach': 'observer', // Can observe others
  'plc_coach': 'observer',
  
  // Student Support -> Educator or Observer
  'counselor': 'educator',
  'social_worker': 'educator',
  'psychologist': 'educator',
  'special_education_coordinator': 'manager',
  
  // Specialized Roles
  'dei_specialist': 'observer',
  'technology_coordinator': 'manager',
  'librarian': 'educator',
  'media_specialist': 'educator',
  
  // Support Staff -> Staff
  'secretary': 'staff',
  'administrative_assistant': 'staff',
  'paraprofessional': 'staff',
  'aide': 'staff',
  'custodian': 'staff',
  'security': 'staff',
  'nurse': 'educator', // Often involved in student support
  'other': 'staff',
};

// Permission Sets by Role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'staff': [
    'profile.read',
    'profile.update',
  ],
  'educator': [
    'profile.read',
    'profile.update',
    'observations.read_own',
    'schedule.read_own',
    'reports.read_own',
  ],
  'observer': [
    'profile.read',
    'profile.update',
    'observations.read_own',
    'observations.create',
    'observations.read_assigned',
    'schedule.read_own',
    'reports.read_own',
    'reports.read_assigned',
  ],
  'manager': [
    'profile.read',
    'profile.update',
    'observations.read_own',
    'observations.create',
    'observations.read_team',
    'observations.manage_team',
    'users.read_team',
    'schedule.read_team',
    'reports.read_team',
    'reports.create_team',
  ],
  'administrator': [
    'profile.read',
    'profile.update',
    'observations.read',
    'observations.create',
    'observations.manage',
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'organizations.read',
    'organizations.update',
    'schedule.read',
    'schedule.manage',
    'reports.read',
    'reports.create',
    'reports.manage',
    'applets.configure',
  ],
  'super_admin': [
    '*', // All permissions
  ],
};

// Utility Functions
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.includes('*') || permissions.includes(permission);
};

export const canAccessRole = (currentRole: UserRole, targetRole: UserRole): boolean => {
  return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[targetRole];
};

export const suggestRoleForJobTitle = (jobTitle: JobTitle): UserRole => {
  return JOB_TITLE_TO_ROLE_MAP[jobTitle] || 'staff';
};

export const getRoleDisplayName = (role: UserRole): string => {
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const getJobTitleDisplayName = (jobTitle: JobTitle): string => {
  return jobTitle.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Role-based UI helpers
export const canManageUsers = (role: UserRole): boolean => {
  return ['administrator', 'super_admin'].includes(role);
};

export const canObserveOthers = (role: UserRole): boolean => {
  return ['observer', 'manager', 'administrator', 'super_admin'].includes(role);
};

export const canAccessAdmin = (role: UserRole): boolean => {
  return ['administrator', 'super_admin'].includes(role);
};