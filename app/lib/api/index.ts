// Centralized API Layer - Re-exports from all API modules
// This provides a single entry point for all Firestore operations

// Re-export Firestore services and helpers
export {
  FirestoreService,
  usersService,
  organizationsService,
  schoolsService,
  divisionsService,
  departmentsService,
  observationsService,
  firestoreQueries,
  schedulesService,
  firestoreApi
} from './firestore';

// Re-export from the main API modules
export { coreApi } from '../../api/core';
export { observationsApi } from '../../api/observations';
