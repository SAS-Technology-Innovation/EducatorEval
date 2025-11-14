# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within EducatorEval, please send an email to the development team. All security vulnerabilities will be promptly addressed.

**Please do not open public issues for security vulnerabilities.**

## Security Measures

### Authentication
- Firebase Authentication with role-based access control
- 6-tier role hierarchy (staff → educator → observer → manager → administrator → super_admin)
- Email/password authentication with password reset functionality
- Mock authentication mode for development (never use in production)

### Data Protection
- Firestore security rules enforce role-based data access
- All sensitive operations require authentication
- User data is scoped by organization and role permissions

### Environment Variables
- All Firebase credentials stored in `.env` (never commit to git)
- Use `VITE_` prefix for client-side environment variables
- Production environment variables managed through Firebase hosting

### Best Practices
1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use Firebase emulators** for local development
3. **Switch from mock auth to Firebase auth** before production deployment
4. **Review Firestore security rules** before deploying
5. **Enable Firebase App Check** for production (recommended)

## Development Security

### Mock Authentication
- Located in `src/stores/mockAuthStore.ts`
- Auto-authenticates as super admin user
- **MUST be disabled for production** by switching to `authStore.ts`

### Firebase Emulators
- Use emulators for local development to avoid production data exposure
- Run with: `npm run dev:emulated`

## Production Checklist

Before deploying to production:

- [ ] Switch from `mockAuthStore` to `authStore` in `src/stores/auth.ts`
- [ ] Ensure all environment variables are set in Firebase Hosting
- [ ] Review and deploy Firestore security rules
- [ ] Review and deploy Storage security rules
- [ ] Enable Firebase App Check
- [ ] Verify role-based access control is working correctly
- [ ] Test authentication flows (login, logout, password reset)
- [ ] Ensure no development/debug code is enabled

## Third-Party Dependencies

We regularly update dependencies to patch known vulnerabilities. Run `npm outdated` and `npm audit` regularly to identify security updates.

## Contact

For security concerns, contact the EducatorEval development team at Singapore American School.
