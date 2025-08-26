# Firebase Setup Guide for CRP Observation Tool

This guide will help you set up Firebase for the CRP (Culturally Responsive Practices) Observation Tool.

## Prerequisites

- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Google account

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `crp-observation-tool` (or your preferred name)
4. Enable Google Analytics (recommended)
5. Select or create a Google Analytics account
6. Click "Create project"

## Step 2: Set up Authentication

1. In the Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optional: Enable **Google** sign-in for easier access
4. In **Settings** > **Authorized domains**, add your domain when deploying to production

## Step 3: Set up Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (we'll configure security rules later)
3. Select your preferred location (choose closest to your users)
4. Click **Done**

### Create Firestore Collections

The application expects these collections:

```
/users/{userId}
/frameworks/{frameworkId}
/observations/{observationId}
/teachers/{teacherId}
/schools/{schoolId}      (future use)
/departments/{deptId}    (future use)
```

### Security Rules

Replace the default Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read all users
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Framework access control
    match /frameworks/{frameworkId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'coordinator']);
    }
    
    // Observation access control
    match /observations/{observationId} {
      allow read: if request.auth != null && (
        resource.data.observerId == request.auth.uid ||
        resource.data.teacherId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'coordinator']
      );
      allow write: if request.auth != null && 
        resource.data.observerId == request.auth.uid;
    }
    
    // Teachers can be read by authenticated users, written by admins/coordinators
    match /teachers/{teacherId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'coordinator'];
    }
  }
}
```

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. In the **General** tab, scroll to **Your apps**
3. Click **Web app** icon (</>) to create a web app
4. Enter app nickname: `crp-observation-web`
5. Check "Also set up Firebase Hosting" if you plan to use Firebase Hosting
6. Copy the configuration object

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your Firebase configuration:

```env
PUBLIC_FIREBASE_API_KEY=your-api-key-here
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 6: Initialize Firebase in Your Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init

# Select these services:
# - Firestore
# - Functions (optional, for server-side logic)
# - Hosting (if you want to deploy with Firebase)
# - Storage (for file uploads)

# Choose existing project and select your created project
# Accept defaults for most options
```

## Step 7: Set up Cloud Functions (Optional)

If you want server-side processing:

```bash
# Initialize Functions
firebase init functions

# Choose TypeScript
# Install dependencies now
```

Move the functions from `src/firebase/functions.ts` to `functions/src/index.ts` and modify for Cloud Functions syntax.

## Step 8: Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy all Firebase services
firebase deploy
```

## Step 9: Create Initial Admin User

Since user creation requires admin permissions, you'll need to create the first admin user manually:

1. Go to **Authentication** in Firebase Console
2. Click **Add user**
3. Enter email and password for admin user
4. Go to **Firestore Database**
5. Create a document in the `users` collection with the admin user's UID:

```json
{
  "name": "Admin User",
  "email": "admin@yourschool.edu",
  "role": "admin",
  "department": "Administration",
  "permissions": [
    "frameworks.read",
    "frameworks.write",
    "observations.read",
    "observations.write",
    "users.read",
    "users.write",
    "analytics.read",
    "data.import",
    "data.export"
  ],
  "lastLogin": "2025-08-25T00:00:00.000Z"
}
```

## Step 10: Test the Setup

1. Start your development server: `npm run dev`
2. Try logging in with the admin credentials
3. Test creating frameworks and users
4. Verify data is saving to Firestore

## Production Considerations

### Security
- Review and test all Firestore security rules
- Enable App Check for additional security
- Set up monitoring and alerting

### Performance
- Create composite indexes for complex queries
- Set up Cloud Functions for heavy processing
- Consider using Firebase Performance Monitoring

### Backup & Recovery
- Enable automated backups
- Test restore procedures
- Document your backup strategy

### Analytics
- Set up Google Analytics integration
- Configure custom events for tracking usage
- Set up BigQuery export for advanced analytics

## Monitoring & Maintenance

### Firestore Usage
- Monitor read/write operations
- Watch for quota limits
- Optimize queries to reduce costs

### Authentication
- Monitor authentication metrics
- Set up user activity alerts
- Regular security audits

### Performance
- Use Firebase Performance SDK
- Monitor app startup time
- Track user engagement metrics

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check API keys and domain configuration
2. **Permission denied**: Verify Firestore security rules
3. **Quota exceeded**: Monitor usage and upgrade plan if needed
4. **Slow queries**: Add indexes and optimize query structure

### Getting Help

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag questions with `firebase`

## Next Steps

Once Firebase is set up:

1. Test all authentication flows
2. Import initial framework data
3. Create teacher accounts
4. Train users on the system
5. Set up monitoring and alerts
6. Plan for scaling and backup procedures
