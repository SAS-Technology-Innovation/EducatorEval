# Single-Project Architecture Migration - Complete ✅

## Overview

Successfully migrated from a **two-project architecture** to a **single-project, multi-site architecture** for the EducatorEval platform.

## Architecture Changes

### Before
```
educatoreval-staging (Firebase Project)
  └── Staging hosting site

educator-evaluations (Firebase Project)
  └── Production hosting site
```

### After
```
educator-evaluations (Firebase Project)
  ├── educator-evaluations-staging (Hosting Site)
  │   └── URL: https://educator-evaluations-staging.web.app
  │   └── Collections: staging_* prefixed
  │
  └── educator-evaluations (Hosting Site)
      └── URL: https://educator-evaluations.web.app
      └── Collections: unprefixed (users, observations, etc.)
```

## Key Benefits

1. **Simplified Infrastructure**
   - Single Firebase project to manage
   - Shared authentication users
   - One set of security rules
   - Same Firestore database with prefixed collections

2. **Cost Efficiency**
   - Single project billing
   - Shared quotas and resources
   - No duplicate infrastructure

3. **Easier Management**
   - One Firebase Console to monitor
   - Simpler deployment process
   - Easier to keep environments in sync

4. **Automatic Data Separation**
   - Staging uses `staging_*` collections
   - Production uses unprefixed collections
   - Controlled via `VITE_ENVIRONMENT` variable

## Files Modified

### Configuration Files
- **firebase.json** - Multi-site hosting configuration
- **.firebaserc** - Both aliases point to `educator-evaluations`
- **.env** - Updated with staging site credentials
- **.env.staging** - Staging site config
- **.env.production** - Production site config (unchanged)
- **vite.config.ts** - Manual .env file parsing to prevent shell override
- **package.json** - Updated deployment scripts for hosting targets

### Code Changes
- **app/lib/firestore.ts** - Environment-based collection prefixes
  ```typescript
  const getCollectionPrefix = () => {
    const env = import.meta.env.VITE_ENVIRONMENT || 'staging';
    return env === 'production' ? '' : 'staging_';
  };
  ```

## Deployment Commands

### Staging
```bash
npm run deploy:staging
# Deploys to: https://educator-evaluations-staging.web.app
```

### Production
```bash
npm run deploy:production
# Deploys to: https://educator-evaluations.web.app
```

## Staging Data Seeding

### Quick Start
```bash
# 1. Authenticate
gcloud auth application-default login
gcloud config set project educator-evaluations

# 2. Run seeding script
npx tsx scripts/seedStagingData.ts
```

### What Gets Seeded
- **1 Organization:** Singapore American School
- **2 Schools:** High School, Middle School
- **7 Departments:** English, Math, Science, Social Studies, Languages, Technology, Administration
- **5 Demo Users:** Super admin, administrator, teacher, observer, manager
- **1 CRP Framework:** 9 questions across 4 sections
- **3 Sample Observations:** Various statuses and data

### Demo Accounts
All passwords: `TempPassword123!`

| Email | Role | Access Level |
|-------|------|--------------|
| bfawcett@sas.edu.sg | super_admin | Full system access |
| admin@sas.edu.sg | administrator | School admin |
| teacher@sas.edu.sg | educator | Teacher access |
| observer@sas.edu.sg | observer | Observation access |
| manager@sas.edu.sg | manager | Department management |

## Environment Variables

### Staging Site
```bash
VITE_ENVIRONMENT="staging"
VITE_FIREBASE_PROJECT_ID="educator-evaluations"
VITE_FIREBASE_APP_ID="1:586497717614:web:ce506fe74ff9c17e73fd7f"
VITE_FIREBASE_MEASUREMENT_ID="G-VZ43E5JE2N"
```

### Production Site
```bash
VITE_ENVIRONMENT="production"
VITE_FIREBASE_PROJECT_ID="educator-evaluations"
VITE_FIREBASE_APP_ID="1:586497717614:web:2a5b0c565b67675b73fd7f"
VITE_FIREBASE_MEASUREMENT_ID="G-HWXFM2W3E7"
```

## Firestore Collections

### Staging Collections (Prefixed)
- `staging_organizations`
- `staging_schools`
- `staging_divisions`
- `staging_departments`
- `staging_users`
- `staging_frameworks`
- `staging_observations`
- `staging_professional_learning`
- `staging_goals`

### Production Collections (No Prefix)
- `organizations`
- `schools`
- `divisions`
- `departments`
- `users`
- `frameworks`
- `observations`
- `professional_learning`
- `goals`

## Testing Checklist

- [x] Staging site deployed successfully
- [x] Firebase config correctly embedded in build
- [x] Multi-site hosting configured
- [x] Collection prefixing working
- [ ] Seeding script executed (requires auth)
- [ ] Login working with demo accounts
- [ ] Data visible in staging collections
- [ ] Create observation flow working
- [ ] View observations working
- [ ] User management working

## Next Steps

1. **Seed Staging Database:**
   - Follow instructions in `docs/STAGING_SEED_INSTRUCTIONS.md`
   - Run `npx tsx scripts/seedStagingData.ts`

2. **Test Staging Site:**
   - Visit https://educator-evaluations-staging.web.app
   - Login with `bfawcett@sas.edu.sg` / `TempPassword123!`
   - Verify all features work

3. **Production Deployment** (when ready):
   - Review and update production data
   - Run `npm run deploy:production`
   - Test production site thoroughly

4. **Decommission Old Project** (optional):
   - Export any data from `educatoreval-staging` if needed
   - Archive the old project
   - Update documentation to remove references

## Documentation

- **Seeding Instructions:** `docs/STAGING_SEED_INSTRUCTIONS.md`
- **Project README:** `README.md`
- **Claude Instructions:** `CLAUDE.md` (already updated)

## Troubleshooting

### Staging site not loading
- Check browser console for errors
- Verify Firebase config in browser DevTools
- Check deployment succeeded: `npx firebase hosting:sites:list`

### Wrong Firebase config loaded
- Clear browser cache and localStorage
- Verify build output shows correct API key
- Check `vite.config.ts` environment loading

### Collections not found
- Verify environment variable: `import.meta.env.VITE_ENVIRONMENT`
- Check Firestore rules are deployed
- Ensure user is authenticated

### Seeding script fails
- Authenticate with: `gcloud auth application-default login`
- Or download service account key from Firebase Console
- Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable

## Success Metrics

✅ **Deployment:** Staging site live at https://educator-evaluations-staging.web.app
✅ **Configuration:** Correct Firebase app ID and measurement ID embedded
✅ **Architecture:** Multi-site hosting configured correctly
✅ **Code:** Environment-based collection prefixing implemented
✅ **Documentation:** Complete seeding script and instructions created

## Migration Complete! 🎉

The platform is now running on a streamlined single-project architecture with proper environment separation through collection prefixes and hosting targets.
