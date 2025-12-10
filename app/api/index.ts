// Firebase API Service Layer - Re-exports from modular API files
// This file provides backwards compatibility and centralized exports

// Re-export from modular API files
export { coreApi } from './core';
export { observationsApi } from './observations';

// Legacy compatibility exports (deprecated - use coreApi and observationsApi instead)
import { coreApi } from './core';
import { observationsApi } from './observations';

// Legacy observation API (maps to new structure)
export const observationApi = {
  list: observationsApi.observations.list,
  getById: observationsApi.observations.getById,
  create: observationsApi.observations.create,
  update: observationsApi.observations.update,
  delete: (id: string) => observationsApi.observations.delete(id, true),
};

// Legacy framework API
export const frameworkApi = {
  list: () => observationsApi.frameworks.list({ status: 'active' }),
  getById: observationsApi.frameworks.getById,
  create: observationsApi.frameworks.create,
  update: observationsApi.frameworks.update,
  delete: observationsApi.frameworks.delete,
};

// Legacy user API
export const userApi = {
  getById: coreApi.users.getById,
  update: coreApi.users.update,
  list: (organizationId: string) => coreApi.users.list({ schoolId: organizationId }),
};

// Analytics API - now calculated from Firestore data directly
export const analyticsApi = {
  getDashboardData: observationsApi.analytics.getDashboardStats,
  getCRPMetrics: observationsApi.analytics.getCRPStats,
};
