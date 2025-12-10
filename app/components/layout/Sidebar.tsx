import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import {
  BarChart3,
  Book,
  Target,
  Calendar,
  Users,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
  badge?: string;
}

interface SidebarProps {
  currentPath?: string;
}

const Sidebar = ({ currentPath = '/' }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, hasRole, signOut, activeRole } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // Get current active role for filtering navigation
  const currentRole = activeRole || user?.primaryRole;

  // Define navigation items with role-specific labels and visibility
  const getMainNavItems = (): NavItem[] => {
    const baseItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <BarChart3 className="w-5 h-5" />,
        href: '/app/dashboard'
      }
    ];

    // Teacher-specific navigation
    if (currentRole === 'educator' || currentRole === 'staff') {
      return [
        ...baseItems,
        {
          id: 'observations',
          label: 'My Observations',
          icon: <Book className="w-5 h-5" />,
          href: '/app/observations'
        },
        {
          id: 'goals',
          label: 'My Goals',
          icon: <Target className="w-5 h-5" />,
          href: '/app/professional-learning'
        },
        {
          id: 'schedule',
          label: 'My Schedule',
          icon: <Calendar className="w-5 h-5" />,
          href: '/app/schedule'
        }
      ];
    }

    // Observer-specific navigation
    if (currentRole === 'observer' || currentRole === 'manager') {
      return [
        ...baseItems,
        {
          id: 'observations',
          label: 'Observation Queue',
          icon: <Book className="w-5 h-5" />,
          href: '/app/observations'
        },
        {
          id: 'schedule',
          label: 'Observation Calendar',
          icon: <Calendar className="w-5 h-5" />,
          href: '/app/schedule'
        },
        {
          id: 'goals',
          label: 'Professional Learning',
          icon: <Target className="w-5 h-5" />,
          href: '/app/professional-learning'
        }
      ];
    }

    // Admin navigation - minimal app navigation, focus on admin section
    if (currentRole === 'administrator' || currentRole === 'super_admin') {
      return [
        ...baseItems,
        {
          id: 'observations',
          label: 'Observations',
          icon: <Book className="w-5 h-5" />,
          href: '/app/observations'
        }
      ];
    }

    // Default navigation
    return baseItems;
  };

  const mainNavItems = getMainNavItems();

  const adminNavItems: NavItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Analytics',
      icon: <Shield className="w-5 h-5" />,
      href: '/admin',
      roles: ['administrator', 'super_admin']
    },
    {
      id: 'admin-users',
      label: 'Users & Teams',
      icon: <Users className="w-5 h-5" />,
      href: '/admin/users',
      roles: ['administrator', 'super_admin']
    },
    {
      id: 'admin-orgs',
      label: 'Organizations',
      icon: <Building2 className="w-5 h-5" />,
      href: '/admin/organizations',
      roles: ['administrator', 'super_admin']
    },
    {
      id: 'admin-frameworks',
      label: 'Frameworks',
      icon: <Book className="w-5 h-5" />,
      href: '/admin/frameworks',
      roles: ['administrator', 'super_admin']
    },
    {
      id: 'admin-settings',
      label: 'System Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/admin/settings',
      roles: ['administrator', 'super_admin']
    }
  ];

  const isActive = (href: string) => {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath?.startsWith(href)) return true;
    return false;
  };

  const canAccessItem = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.some(role => hasRole(role));
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Sign out failed:', error);
      }
    }
  };

  const visibleAdminItems = adminNavItems.filter(canAccessItem);
  const showAdminSection = visibleAdminItems.length > 0;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sas-navy-600 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sas-navy-500">
        {!collapsed ? (
          <div>
            <h1 className="text-xl font-bebas tracking-wider">EducatorEval</h1>
            <p className="text-xs text-sas-blue-200 mt-1">Singapore American School</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-sas-red-500 rounded flex items-center justify-center font-bebas text-lg">
              E
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Main Navigation */}
        <div className="px-3 mb-6">
          {!collapsed && (
            <h2 className="px-3 text-xs font-semibold text-sas-blue-200 uppercase tracking-wider mb-2">
              {currentRole === 'educator' || currentRole === 'staff' ? 'My Teaching' :
               currentRole === 'observer' || currentRole === 'manager' ? 'Observations' :
               currentRole === 'administrator' || currentRole === 'super_admin' ? 'Quick Access' :
               'Main'}
            </h2>
          )}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-sas-navy-500 text-white'
                    : 'text-sas-blue-100 hover:bg-sas-navy-500/50 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        {showAdminSection && (
          <div className="px-3 mb-6">
            {!collapsed && (
              <h2 className="px-3 text-xs font-semibold text-sas-orange-200 uppercase tracking-wider mb-2">
                Administration
              </h2>
            )}
            <div className="space-y-1">
              {visibleAdminItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-sas-red-500 text-white'
                      : 'text-sas-orange-100 hover:bg-sas-red-500/50 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto bg-sas-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sas-navy-500 p-3">
        {/* User Info */}
        {user && (
          <div className={`mb-3 ${collapsed ? 'px-0' : 'px-3'}`}>
            {!collapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sas-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-sas-blue-200 truncate capitalize">
                    {currentRole?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-sas-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-sas-blue-100 hover:bg-sas-navy-500 hover:text-white transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-sas-blue-200 hover:bg-sas-navy-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
