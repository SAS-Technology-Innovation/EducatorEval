# Changelog

All notable changes to the EducatorEval platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-12

### Added
- **Major architectural migration from Astro to Vite + React SPA**
- Pure React 19 single-page application with React Router
- Public landing page with full SAS branding
- Enhanced authentication system with multi-modal login (Sign In, Sign Up, Reset Password)
- Singapore American School (SAS) branding throughout application
  - Custom color palette (Navy #1A4190, Red #E51322)
  - Bebas Neue and Poppins fonts
  - Hero sections with SAS imagery
- PostCSS configuration for Tailwind CSS processing
- New routing structure: public pages at `/`, protected pages at `/dashboard`
- Mock authentication mode for development
- Role-based access control with 6-tier hierarchy

### Changed
- Migrated from Astro SSR to Vite client-side rendering
- Updated all components to use SAS brand colors (209 instances)
- Replaced generic blue colors with SAS navy throughout codebase
- Changed routing to use React Router Links instead of anchor tags
- Updated build system to use Vite instead of Astro
- Reorganized authentication redirects to use `/dashboard` as main protected route

### Fixed
- CSS loading issue by adding missing postcss.config.js
- React Router integration using useLocation() instead of window.location
- Tailwind config content paths for Vite
- Build configuration for TypeScript checking

### Removed
- Astro framework and all Astro-specific code
- Astro test pages
- Server-side rendering capabilities

## [1.x.x] - Previous Versions

See `summaries/` directory for historical development documentation and planning notes.
