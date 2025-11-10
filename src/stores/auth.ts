// Auth Store Selector - chooses between mock and real auth based on environment
// For local development, we use mock auth to bypass Firebase completely

// Simply re-export from mockAuthStore for development
// To use real Firebase auth, set VITE_USE_MOCK_AUTH="false" in .env
// and update this file to export from './authStore' instead

console.log('🔐 Auth mode: MOCK (development) - Firebase bypassed');

export { useAuthStore } from './mockAuthStore';
