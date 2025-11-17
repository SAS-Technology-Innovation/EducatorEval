# Staging Database Seeding Instructions

This guide explains how to seed the staging database with comprehensive test data.

## Prerequisites

The seeding script requires Firebase Admin SDK authentication. You have two options:

### Option 1: Service Account Key (Recommended)

1. **Download Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/project/educator-evaluations/settings/serviceaccounts/adminsdk)
   - Click "Generate new private key"
   - Save the JSON file as `educator-evaluations-service-account.json` in the project root
   - **IMPORTANT:** Add this file to `.gitignore` (already configured)

2. **Set Environment Variable:**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="educator-evaluations-service-account.json"
   ```

3. **Run the seeding script:**
   ```bash
   npx tsx scripts/seedStagingData.ts
   ```

### Option 2: Google Cloud SDK

1. **Install Google Cloud SDK** (if not already installed):
   ```bash
   brew install google-cloud-sdk
   ```

2. **Authenticate:**
   ```bash
   gcloud auth application-default login
   ```

3. **Set project:**
   ```bash
   gcloud config set project educator-evaluations
   ```

4. **Run the seeding script:**
   ```bash
   npx tsx scripts/seedStagingData.ts
   ```

## What Gets Created

The seeding script creates comprehensive staging data including:

### Organizations & Structure
- **1 Organization:** Singapore American School
- **2 Schools:** High School, Middle School
- **2 Divisions:** High School Division, Middle School Division
- **7 Departments:** English, Mathematics, Science, Social Studies, World Languages, Technology, Administration

### Users (5 demo accounts)
All with password: `TempPassword123!`

| Email | Role | Job Title |
|-------|------|-----------|
| bfawcett@sas.edu.sg | super_admin | Technology Director |
| admin@sas.edu.sg | administrator | Principal |
| teacher@sas.edu.sg | educator | English Teacher |
| observer@sas.edu.sg | observer | Instructional Coach |
| manager@sas.edu.sg | manager | Department Head |

### CRP Framework
- **9 questions** across **4 sections:**
  1. Cultural Awareness & Responsiveness (2 questions)
  2. Inclusive Practices (3 questions)
  3. Student Engagement & Participation (3 questions)
  4. Equity & Access (2 questions)

### Sample Observations
- 3 observations with varying statuses (completed, scheduled)
- Realistic data with responses, notes, and scores

## Collections Created

All collections are prefixed with `staging_`:
- `staging_organizations`
- `staging_schools`
- `staging_divisions`
- `staging_departments`
- `staging_users`
- `staging_frameworks`
- `staging_observations`

## After Seeding

Once the script completes successfully:

1. **Test the staging site:**
   - URL: https://educator-evaluations-staging.web.app
   - Login with any of the demo accounts above

2. **Verify data:**
   - Check Firebase Console > Firestore
   - Ensure all `staging_*` collections are populated

3. **Security:**
   - Delete the service account key file if you downloaded one
   - Never commit service account keys to git

## Troubleshooting

### Error: "Could not load the default credentials"
- Ensure you've either set `GOOGLE_APPLICATION_CREDENTIALS` or run `gcloud auth application-default login`
- Verify the service account key file path is correct

### Error: "Permission denied"
- Make sure you have the necessary permissions in the Firebase project
- Your Google account must have "Firebase Admin" or "Owner" role

### Error: "email-already-exists"
- The script handles this gracefully and will update existing users
- This is expected if you run the script multiple times

## Manual Alternative

If you prefer to create data manually:

1. **Create user in Firebase Console:**
   - Go to Authentication > Add User
   - Email: bfawcett@sas.edu.sg
   - Set password

2. **Add user profile to Firestore:**
   - Go to Firestore > Data
   - Create collection: `staging_users`
   - Create document with UID from auth
   - Add fields: `role: "super_admin"`, `email`, `firstName`, `lastName`, etc.

3. **Create framework manually** in `staging_frameworks` collection

The automated script is much faster and creates a complete, realistic dataset!
