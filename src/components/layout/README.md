# Unified Navigation System

## Overview

The unified navigation system provides a consistent, intuitive navigation experience across the entire EducatorEval platform. It consolidates multiple navigation components into a single cohesive interface that delivers:

- **Unified Experience**: Single navigation interface for all users
- **Platform Navigation**: Core features (Dashboard, Observations, Schedule, etc.)
- **Admin Controls**: Administrative features for privileged users only
- **Context-Aware Breadcrumbs**: Dynamic navigation trails
- **Responsive Design**: Seamless experience across all devices

## Components

### 1. `UnifiedHeader`
The main navigation header that appears across all platform pages.

**Features:**
- Logo and branding
- Direct navigation to core platform features
- Admin dropdown menu (for privileged users only)
- Global search functionality  
- Notifications
- User profile dropdown
- Mobile-responsive design

```tsx
import { UnifiedHeader } from '../layout';

<UnifiedHeader
  currentPath="/observations"
  onNavigate={(path) => navigate(path)}
  showBreadcrumb={true}
  breadcrumbItems={[
    { label: 'Platform', href: '/dashboard' },
    { label: 'Observations' }
  ]}
/>
```

### 2. `AppletNavigation`
Secondary navigation bar for applet contexts.

**Features:**
- Back to platform navigation
- Applet branding and description
- Fullscreen toggle
- Applet-specific breadcrumbs

```tsx
import { AppletNavigation } from '../layout';

<AppletNavigation
  appletName="CRP Observations"
  appletDescription="Culturally Responsive Pedagogy Assessment Tool"
  onNavigateBack={() => navigate('/observations')}
  onNavigateHome={() => navigate('/dashboard')}
  onFullscreen={() => setFullscreen(!fullscreen)}
  isFullscreen={fullscreen}
/>
```

### 3. `PlatformLayout`
Complete layout wrapper that combines unified header and content area.

**Features:**
- Consistent navigation across all pages
- Responsive content container
- Breadcrumb support
- Flexible width options

```tsx
import { PlatformLayout } from '../layout';

// Standard Page
<PlatformLayout
  currentPath="/observations" 
  onNavigate={navigate}
  showBreadcrumb={true}
  breadcrumbItems={breadcrumbItems}
>
  <ObservationsPage />
</PlatformLayout>

// Full Width Page
<PlatformLayout
  currentPath="/dashboard"
  onNavigate={navigate}
  fullWidth={true}
>
  <DashboardPage />
</PlatformLayout>
```

## Navigation Structure

### Core Platform Areas
- **Home** (`/`) - Welcome and getting started
- **Dashboard** (`/dashboard`) - Analytics and overview
- **Observations** (`/observations`) - Teacher observation management and frameworks
- **Schedule** (`/schedule`) - Class schedules and calendar

### Admin Areas (Admin Users Only)
- **User Management** (`/admin/users`) - Manage users and permissions
- **Organizations** (`/admin/organizations`) - Manage schools and divisions  
- **Applet Management** (`/admin/applets`) - Install and configure specialized tools

## User Experience Features

### Context-Aware Navigation
The system automatically adapts navigation based on user permissions and current location:

- **Standard Users**: Access to core platform features (Dashboard, Observations, Schedule)
- **Admin Users**: Additional admin dropdown with management features
- **Responsive Layout**: Mobile-optimized navigation that collapses appropriately

### Mobile Responsiveness
- Collapsible hamburger menu on mobile devices
- Touch-friendly navigation elements
- Optimized layouts for different screen sizes

### Visual Hierarchy
- **Platform Features**: Consistent blue color scheme for core functionality
- **Admin Features**: Distinct styling with shield icons for administrative functions
- **Active States**: Clear visual feedback for current page and navigation state

## Migration from Legacy Components

### Deprecated Components
The following components should be replaced with the unified system:

- ~~`Header.tsx`~~ → Use `UnifiedHeader`
- ~~`Navbar.tsx`~~ → Use `UnifiedHeader`
- ~~`Sidebar.tsx`~~ → Use `UnifiedHeader` dropdown menus
- ~~`HeaderSimple.tsx`~~ → Use `PlatformLayout`

### Migration Examples

**Before:**
```tsx
import Header from './Header';
import Sidebar from './Sidebar';

function PageLayout() {
  return (
    <div>
      <Header onNavigate={navigate} />
      <div className="flex">
        <Sidebar currentPath={path} />
        <main>
          <PageContent />
        </main>
      </div>
    </div>
  );
}
```

**After:**
```tsx
import { PlatformLayout } from '../layout';

function PageLayout() {
  return (
    <PlatformLayout currentPath={path} onNavigate={navigate}>
      <PageContent />
    </PlatformLayout>
  );
}
```

## Best Practices

1. **Use PlatformLayout**: Always wrap page content in PlatformLayout for consistency
2. **Set Current Path**: Always provide the current path for proper active state highlighting  
3. **Implement Navigation Handler**: Provide a navigation handler that works with your routing system
4. **Use Breadcrumbs**: Add breadcrumbs for complex navigation hierarchies
5. **Applet Context**: Set `isApplet={true}` for specialized tools and applications

## Future Enhancements

- **Keyboard Navigation**: Full keyboard accessibility support
- **Search Integration**: Enhanced global search with results preview
- **Notification System**: Real-time notification management
- **Customization**: User-customizable navigation preferences
- **Analytics**: Navigation usage tracking and optimization