# Development Guide

## Mock Authentication for Local Development

For local development, the application uses a **mock authentication system** that bypasses Firebase Auth entirely. This allows you to develop and test features without needing to configure Firebase or deal with authentication errors.

### How It Works

The app uses mock authentication by default in development. The auth mode is controlled in [src/stores/auth.ts](src/stores/auth.ts) which determines whether to use the mock or real Firebase authentication store.

### Mock User Details

When mock auth is enabled, you're automatically logged in as:

- **Email**: dev@sas.edu.sg
- **Name**: Developer User
- **Role**: Super Admin (with all permissions)
- **Employee ID**: EMP-DEV001

This mock user has full access to all features:
- `super_admin` role
- All observation permissions
- All user management permissions
- All administrative features

### Switching Between Mock and Real Auth

**Local Development (Mock Auth)** - Current Setup:

The app is currently configured to use mock authentication. This is set in [src/stores/auth.ts](src/stores/auth.ts):
```typescript
export { useAuthStore } from './mockAuthStore';
```

Benefits:
- ✅ No Firebase connection required
- ✅ Instant authentication
- ✅ Full feature access
- ✅ Perfect for development and testing
- ✅ No Firebase import errors

**Production (Real Firebase Auth)**:

To switch to real Firebase authentication:

1. Edit [src/stores/auth.ts](src/stores/auth.ts) and change:
   ```typescript
   // Change FROM:
   export { useAuthStore } from './mockAuthStore';

   // Change TO:
   export { useAuthStore } from './authStore';
   ```

2. Update the console message to indicate production mode

3. Ensure Firebase credentials are properly configured in [.env](.env)

4. Restart your dev server

### Features

The mock auth system implements the same interface as the real Firebase auth, so all your components work identically in both modes:

- ✅ `signIn()` - Always succeeds
- ✅ `signUp()` - Always succeeds
- ✅ `signInWithGoogle()` - Always succeeds
- ✅ `signOut()` - Clears mock user
- ✅ `hasRole()` - Role checking works
- ✅ `hasPermission()` - Permission checking works
- ✅ All auth hooks and components work normally

### File Structure

- [src/stores/mockAuthStore.ts](src/stores/mockAuthStore.ts) - Mock authentication implementation
- [src/stores/authStore.ts](src/stores/authStore.ts) - Real Firebase authentication
- [src/stores/auth.ts](src/stores/auth.ts) - Selector that chooses mock or real auth

### Development Workflow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. The app will automatically:
   - Use mock authentication (no login required)
   - Log you in as the mock super admin user
   - Skip all Firebase Auth calls
   - Display a console message: `🔐 Auth mode: MOCK (development)`

3. Navigate to any protected route - you'll already be authenticated!

### Testing Different User Roles

To test different user roles/permissions, edit [src/stores/mockAuthStore.ts](src/stores/mockAuthStore.ts#L46-L73) and modify the `createMockUser()` function:

```typescript
const createMockUser = (): User => ({
  // ... other fields ...
  primaryRole: 'educator',  // Change this: 'educator', 'observer', 'administrator', etc.
  permissions: ['observations.view'],  // Customize permissions
  // ... other fields ...
});
```

### Troubleshooting

**Still seeing Firebase errors?**
1. Check that [src/stores/auth.ts](src/stores/auth.ts) exports from `./mockAuthStore`
2. Restart your dev server: `npm run dev`
3. Clear your browser cache and reload
4. Check the browser console for: `🔐 Auth mode: MOCK (development) - Firebase bypassed`

**Need to test with real Firebase?**
1. Edit [src/stores/auth.ts](src/stores/auth.ts) to export from `./authStore`
2. Configure Firebase credentials in [.env](.env)
3. Restart dev server

## Running the Development Server

```bash
npm run dev
```

The app will be available at http://localhost:4321 (or the next available port).

## Building for Production

```bash
npm run build
```

**Important**: Always ensure `PUBLIC_USE_MOCK_AUTH="false"` in production environments!
