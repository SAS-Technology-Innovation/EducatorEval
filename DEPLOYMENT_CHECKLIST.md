# Deployment Checklist

Use this checklist to ensure proper deployment to staging and production environments.

## Pre-Deployment Checklist

### Local Testing
- [ ] Code builds successfully: `npm run build:check`
- [ ] No TypeScript errors
- [ ] Preview works locally: `npm run preview`
- [ ] All features tested in local dev: `npm run dev`
- [ ] Environment banner displays correctly

### Code Review
- [ ] All code changes reviewed
- [ ] No hardcoded credentials or secrets
- [ ] Environment variables properly used (`VITE_` prefix)
- [ ] No `.env` files committed to git
- [ ] All documentation updated

## Staging Deployment Checklist

### One-Time Setup (First Deploy Only)
- [ ] Firebase staging project created
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Firebase CLI authenticated: `firebase login`
- [ ] Staging project alias added: `firebase use --add` → staging
- [ ] `.env.staging` configured with Firebase credentials
- [ ] Firestore enabled in Firebase Console (staging)
- [ ] Authentication enabled (Email/Password provider)
- [ ] Storage enabled in Firebase Console
- [ ] Service account key downloaded for seeding
- [ ] `GOOGLE_APPLICATION_CREDENTIALS` environment variable set

### Every Staging Deploy
- [ ] Latest code pulled from main branch
- [ ] Dependencies installed: `npm install`
- [ ] Build test passes: `npm run build:check`
- [ ] Firebase project set to staging: `firebase use staging`
- [ ] Database seeded (if needed): `npm run seed:staging`
- [ ] Deploy to staging: `npm run deploy:staging`
- [ ] Deployment succeeds without errors
- [ ] Staging URL accessible

### Staging Testing
- [ ] **Authentication**
  - [ ] Login with test credentials (admin@staging.test)
  - [ ] Logout works correctly
  - [ ] Environment banner shows "STAGING ENVIRONMENT" (yellow)

- [ ] **Admin Features**
  - [ ] Access admin dashboard
  - [ ] View users list
  - [ ] Create new user
  - [ ] Edit user (change role, department, subjects)
  - [ ] View departments and organizations

- [ ] **Framework Management**
  - [ ] View existing framework (CRP)
  - [ ] Edit framework (add/edit section)
  - [ ] Add new question to section
  - [ ] Preview question types (rating, text, multiselect)
  - [ ] Delete question (verify confirmation)

- [ ] **Observation Features**
  - [ ] Create new observation (observer role)
  - [ ] Select framework dynamically
  - [ ] Fill out observation form
  - [ ] Add evidence/comments
  - [ ] Submit observation
  - [ ] View observation (teacher role)
  - [ ] View only past observations (not future)
  - [ ] Submit teacher comment/feedback

- [ ] **Analytics**
  - [ ] Department performance view
  - [ ] Subject breakdown
  - [ ] Individual teacher insights
  - [ ] Framework-driven analytics (no hardcoded categories)
  - [ ] Charts render correctly

- [ ] **Responsive Design**
  - [ ] Desktop view (1920x1080)
  - [ ] Tablet view (768x1024)
  - [ ] Mobile view (375x667)
  - [ ] Navigation works on all screen sizes

- [ ] **Performance**
  - [ ] Page load time acceptable (<3 seconds)
  - [ ] No console errors
  - [ ] Firebase queries efficient (check Network tab)

### Staging Sign-Off
- [ ] All critical features tested and working
- [ ] No blocker bugs identified
- [ ] Product owner approval (if applicable)
- [ ] Ready for production deployment

## Production Deployment Checklist

### One-Time Setup (First Deploy Only)
- [ ] Firebase production project created
- [ ] Production project alias added: `firebase use --add` → production
- [ ] `.env.production` configured with Firebase credentials
- [ ] Firestore enabled in Firebase Console (production)
- [ ] Authentication enabled (Email/Password provider)
- [ ] Storage enabled in Firebase Console
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate verified
- [ ] Production admin user created manually (secure password)

### Pre-Production Verification
- [ ] All staging tests passed
- [ ] No known critical bugs
- [ ] Backup of production database (if updating existing deployment)
- [ ] Rollback plan documented
- [ ] Team notified of deployment window
- [ ] Maintenance window scheduled (if needed)

### Production Deploy
- [ ] Latest code from main branch (tagged release recommended)
- [ ] Dependencies up to date: `npm install`
- [ ] Build test passes: `npm run build:check`
- [ ] Firebase project set to production: `firebase use production`
- [ ] **DOUBLE CHECK**: `firebase use` shows "production"
- [ ] Deploy to production: `npm run deploy:production`
- [ ] Deployment succeeds without errors
- [ ] Production URL accessible

### Post-Deployment Testing (Production)
- [ ] **Critical Path Testing**
  - [ ] Login with production credentials
  - [ ] Create observation (smoke test)
  - [ ] View observation
  - [ ] Admin dashboard loads
  - [ ] No environment banner visible (production)

- [ ] **Monitor for Issues**
  - [ ] Check Firebase Console → Firestore for activity
  - [ ] Check Firebase Console → Authentication for logins
  - [ ] Monitor for errors in browser console
  - [ ] Check application logs (if available)

- [ ] **Performance Check**
  - [ ] Page load time acceptable
  - [ ] No significant performance degradation
  - [ ] Database queries performing well

### Post-Deployment Tasks
- [ ] Tag release in git: `git tag -a v2.x.x -m "Release notes"`
- [ ] Push tags: `git push origin --tags`
- [ ] Update [CHANGELOG.md](CHANGELOG.md) with changes
- [ ] Update [RELEASES.md](RELEASES.md) with release notes
- [ ] Notify team of successful deployment
- [ ] Document any deployment issues encountered
- [ ] Schedule next deployment review

## Rollback Procedure

If critical issues are discovered after production deployment:

1. **Immediate Rollback**
   ```bash
   firebase use production
   firebase hosting:rollback
   ```

2. **Restore Database** (if needed)
   - Use Firebase Console → Firestore → Import/Export
   - Restore from backup taken before deployment

3. **Notify Team**
   - Alert team of rollback
   - Document issues encountered
   - Create hotfix branch if needed

4. **Post-Rollback**
   - Investigate root cause
   - Fix in staging environment
   - Re-test thoroughly
   - Re-deploy when stable

## Quick Command Reference

### Switch Firebase Projects
```bash
# Check current project
firebase use

# Switch to staging
firebase use staging

# Switch to production
firebase use production
```

### Build Commands
```bash
# Local build test
npm run build:check

# Build for staging
npm run build:staging

# Build for production
npm run build:production
```

### Deploy Commands
```bash
# Deploy to staging (full)
npm run deploy:staging

# Deploy to staging (hosting only - faster)
npm run deploy:staging:hosting

# Deploy to production (full)
npm run deploy:production

# Deploy to production (hosting only - faster)
npm run deploy:production:hosting
```

### Database Commands
```bash
# Seed staging database
npm run seed:staging
```

## Environment URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| Local | http://localhost:5173 | Development |
| Preview | http://localhost:4173 | Local production build test |
| Staging | (Your staging URL) | Pre-production testing |
| Production | (Your production URL) | Live application |

## Support Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| Tech Lead | (Add contact) | Deployment approval |
| DevOps | (Add contact) | Infrastructure issues |
| Product Owner | (Add contact) | Feature sign-off |
| Support Team | (Add contact) | User-facing issues |

## Deployment Windows

| Environment | Preferred Time | Restrictions |
|-------------|---------------|--------------|
| Staging | Anytime | None |
| Production | (Add window) | (Add restrictions) |

Example:
- Production: Tuesdays/Thursdays 8-9 PM SGT (off-peak)
- Avoid: Monday mornings, Friday afternoons, during school events

---

**Last Updated:** November 14, 2025
**Document Owner:** Development Team
**Review Frequency:** After each major release
