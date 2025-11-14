# Staging Environment Quick Setup Guide

This is a quick reference guide for setting up and using the staging environment. For detailed documentation, see [docs/STAGING_ENVIRONMENT_SETUP.md](docs/STAGING_ENVIRONMENT_SETUP.md).

## Prerequisites

1. **Firebase CLI installed**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Two Firebase Projects Created**
   - Staging project (e.g., `educator-eval-staging`)
   - Production project (e.g., `educator-eval-prod`)

## Initial Setup (One-Time)

### 1. Add Firebase Project Aliases

```bash
# Add staging project
firebase use --add
# Select your staging project from the list
# Enter alias: staging

# Add production project
firebase use --add
# Select your production project from the list
# Enter alias: production
```

### 2. Configure Environment Files

The following files have been created with templates:

- `.env.local` - Local development (uses mock auth, already configured)
- `.env.staging` - Staging environment (needs Firebase credentials)
- `.env.production` - Production environment (needs Firebase credentials)

**Update `.env.staging`** with your staging Firebase project credentials:
1. Go to Firebase Console → Project Settings → General
2. Scroll down to "Your apps" → Web app
3. Copy the config values to `.env.staging`

**Update `.env.production`** with your production Firebase project credentials (same process as staging).

### 3. Set Up Service Account (for seeding)

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely (e.g., `service-account-staging.json`)
4. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-staging.json"
   ```

## Daily Development Workflow

### Local Development

```bash
# Uses .env.local with mock authentication
npm run dev
```

### Building and Testing Locally

```bash
# Test build with type checking
npm run build:check

# Preview the production build locally
npm run preview
```

### Deploy to Staging

```bash
# 1. Switch to staging project
firebase use staging

# 2. Seed the staging database (first time only, or when you need fresh data)
npm run seed:staging

# 3. Deploy to staging
npm run deploy:staging

# Or deploy only hosting (faster)
npm run deploy:staging:hosting
```

### Deploy to Production

**IMPORTANT: Only deploy to production after thorough testing in staging!**

```bash
# 1. Switch to production project
firebase use production

# 2. Deploy to production
npm run deploy:production

# Or deploy only hosting
npm run deploy:production:hosting
```

## Available Scripts

### Build Scripts
- `npm run build` - Standard build
- `npm run build:check` - Build with TypeScript type checking
- `npm run build:staging` - Build for staging environment
- `npm run build:production` - Build for production environment

### Deploy Scripts
- `npm run deploy:staging` - Full deploy to staging (hosting + rules + functions)
- `npm run deploy:staging:hosting` - Deploy only hosting to staging (faster)
- `npm run deploy:production` - Full deploy to production
- `npm run deploy:production:hosting` - Deploy only hosting to production

### Database Scripts
- `npm run seed:staging` - Seed staging database with test data

### Development Scripts
- `npm run dev` - Local development server
- `npm run preview` - Preview production build locally
- `npm run emulators` - Run Firebase emulators

## Staging Test Credentials

After running `npm run seed:staging`, you can log in with:

```
Email: admin@staging.test
Password: TestPassword123!
```

This user has `super_admin` role with full permissions.

## Checking Current Firebase Project

```bash
# See which Firebase project you're currently using
firebase use

# List all project aliases
firebase projects:list
```

## Environment Indicators

The app displays a banner at the top indicating the current environment:

- 🔧 **DEVELOPMENT ENVIRONMENT** (blue) - Local development
- 🧪 **STAGING ENVIRONMENT** (yellow) - Staging deployment
- No banner - Production (only shows in production)

## Testing Checklist

Before deploying to production, test these features in staging:

- [ ] Authentication (login/logout)
- [ ] User management (admin panel)
- [ ] Framework management (create/edit frameworks)
- [ ] Observation creation (using dynamic framework)
- [ ] Observation viewing (teacher and observer views)
- [ ] Analytics (department/subject breakdowns)
- [ ] Profile and settings
- [ ] Responsive design (mobile/tablet/desktop)

## Troubleshooting

### "Permission denied" when deploying
```bash
# Re-authenticate with Firebase
firebase login --reauth
```

### Environment variables not loading
```bash
# Restart dev server after changing .env files
# Press Ctrl+C, then:
npm run dev
```

### Wrong Firebase project
```bash
# Check current project
firebase use

# Switch to correct project
firebase use staging
# or
firebase use production
```

### Seed script fails
```bash
# Make sure service account key is set
echo $GOOGLE_APPLICATION_CREDENTIALS

# Make sure you're on staging project
firebase use staging

# Re-run seed script
npm run seed:staging
```

## Security Notes

- **NEVER commit `.env` files** - They are already in `.gitignore`
- **NEVER commit service account keys** - Store them securely outside the repository
- **Use different Firebase projects** for staging and production
- **Test all changes in staging** before deploying to production
- **Limit production deploy access** to trusted team members only

## Quick Reference

| Environment | Firebase Project | Deploy Command | URL |
|-------------|-----------------|----------------|-----|
| Local | N/A | `npm run dev` | http://localhost:5173 |
| Staging | educator-eval-staging | `npm run deploy:staging` | (Your staging URL) |
| Production | educator-eval-prod | `npm run deploy:production` | (Your production URL) |

## Next Steps

1. ✅ Environment files created (`.env.staging`, `.env.production`)
2. ⏳ **Update environment files with Firebase credentials**
3. ⏳ **Add Firebase project aliases** (`firebase use --add`)
4. ⏳ **Seed staging database** (`npm run seed:staging`)
5. ⏳ **Deploy to staging** (`npm run deploy:staging`)
6. ⏳ **Test thoroughly in staging**
7. ⏳ **Deploy to production** (only after staging tests pass)

---

For detailed documentation, see [docs/STAGING_ENVIRONMENT_SETUP.md](docs/STAGING_ENVIRONMENT_SETUP.md)
