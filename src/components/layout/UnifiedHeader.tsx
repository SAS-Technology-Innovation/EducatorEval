import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  Home,
  BarChart3,
  Book,
  Calendar,
  Users,
  Settings,
  Puzzle,
  ChevronDown,
  ArrowLeft,
  Target,
  UserCircle
} from 'lucide-react';
import UserProfileDropdown from '../common/UserProfileDropdown';
import { useAuthStore } from '../../stores/auth';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  description?: string;
}

interface UnifiedHeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  currentPath = '/', 
  onNavigate,
  showBreadcrumb = false,
  breadcrumbItems = []
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Navigation items
  const platformItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      href: '/',
      description: 'Main dashboard and overview'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      href: '/dashboard',
      description: 'Analytics and insights'
    },
    {
      id: 'observations',
      label: 'Observations',
      icon: <Book className="w-4 h-4" />,
      href: '/observations',
      description: 'CRP observations and professional learning'
    },
    {
      id: 'professional-learning',
      label: 'Goals',
      icon: <Target className="w-4 h-4" />,
      href: '/professional-learning',
      description: 'Professional learning and SMART goals'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar className="w-4 h-4" />,
      href: '/schedule',
      description: 'Class schedules and calendar'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserCircle className="w-4 h-4" />,
      href: '/profile',
      description: 'Your profile and settings'
    }
  ];

  const adminItems: NavItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Admin Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      href: '/admin/dashboard',
      description: 'CRP in Action admin overview'
    },
    {
      id: 'admin-users',
      label: 'User Management',
      icon: <Users className="w-4 h-4" />,
      href: '/admin/users',
      description: 'Manage users and permissions'
    },
    {
      id: 'admin-orgs',
      label: 'Organizations',
      icon: <Users className="w-4 h-4" />,
      href: '/admin/organizations',
      description: 'Manage schools and divisions'
    },
    {
      id: 'admin-settings',
      label: 'System Settings',
      icon: <Settings className="w-4 h-4" />,
      href: '/admin/settings',
      description: 'Configure system settings'
    }
  ];

  // Get auth state from store
  const { user, isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth listener
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setUserProfile({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.photoURL,
        primaryRole: user.primaryRole,
        divisionNames: [],
        departmentNames: []
      });
    } else {
      setCurrentUser(null);
      setUserProfile(null);
    }
    setLoading(isLoading);
  }, [user, isLoading]);

  // Get signOut from auth store
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      handleNavigation('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleNavigation(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowSearch(false);
    }
  };

  const handleNavigation = (href: string) => {
    // Use both the provided handler and browser navigation
    if (onNavigate) {
      onNavigate(href);
    } else {
      // Fallback to direct navigation if no handler provided
      window.location.href = href;
    }
    setShowPlatformMenu(false);
    setShowMobileMenu(false);
    setShowSearch(false);
  };

  const getCurrentSection = () => {
    if (currentPath?.startsWith('/admin/')) return 'admin';
    return 'platform';
  };
  
  // Check if user is admin (for applet management visibility)
  const isAdmin = () => {
    return userProfile && ['super_admin', 'administrator'].includes(userProfile.primaryRole);
  };

  const isActive = (href: string) => {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath?.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-sas-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {/* SAS Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://resources.finalsite.net/images/v1736450683/sas/q9u7ppfdasutt8sglmzh/school-logo.svg"
                alt="Singapore American School"
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bebas text-sas-navy-600 tracking-wider">EducatorEval</h1>
                <p className="text-xs text-sas-gray-500 font-poppins font-medium -mt-1">Singapore American School</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Main Navigation Items */}
              {platformItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium font-poppins transition-colors ${
                    isActive(item.href) ? 'bg-sas-navy-100 text-sas-navy-700' : 'text-sas-gray-600 hover:text-sas-navy-600 hover:bg-sas-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </button>
              ))}
              
              {/* Admin Menu (only for admin users) */}
              {isAdmin() && (
                <div className="relative">
                  <button
                    onClick={() => setShowPlatformMenu(!showPlatformMenu)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      getCurrentSection() === 'admin' ? 'bg-sas-gray-100 text-sas-gray-700' : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-50'
                    }`}
                  >
                    Admin
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  
                  {showPlatformMenu && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-sas-gray-200 py-2">
                      {adminItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.href)}
                          className={`w-full flex items-start px-4 py-3 text-left hover:bg-sas-gray-50 transition-colors ${
                            isActive(item.href) ? 'bg-sas-blue-50 text-sas-blue-700' : 'text-sas-gray-700'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                          <div className="ml-3">
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs text-sas-gray-500">{item.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Right Section - Search, Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 rounded-lg transition-colors"
              title="Search"
            >
              <Search className="w-6 h-6" />
            </button>
            {/* Notifications */}
            <button
              onClick={() => handleNavigation('/notifications')}
              className="relative p-2 text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            {loading ? (
              <div className="w-8 h-8 bg-sas-gray-200 rounded-full animate-pulse"></div>
            ) : currentUser && userProfile ? (
              <UserProfileDropdown
                user={userProfile}
                onSignOut={handleSignOut}
                onNavigate={handleNavigation}
                notificationCount={notificationCount}
              />
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <div className="border-t border-sas-gray-200 px-4 py-2">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-sas-gray-400">/</span>}
                  {item.href ? (
                    <button
                      onClick={() => onNavigate?.(item.href!)}
                      className="text-sas-blue-600 hover:text-sas-blue-700"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-sas-gray-900 font-medium">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-sas-gray-200">
          <div className="px-4 py-4 space-y-2">
            {platformItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive(item.href) ? 'bg-sas-blue-100 text-sas-blue-700' : 'text-sas-gray-600 hover:bg-sas-gray-50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
            
            {/* Admin Menu (Mobile) */}
            {isAdmin() && (
              <>
                <div className="text-sm font-semibold text-sas-gray-900 mb-2 mt-4">Admin</div>
                {adminItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive(item.href) ? 'bg-sas-blue-100 text-sas-blue-700' : 'text-sas-gray-600 hover:bg-sas-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Expandable Search Banner */}
      {showSearch && (
        <div className="bg-white border-t border-sas-gray-200 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-sas-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users, observations, schools, frameworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-sas-gray-400 hover:text-sas-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              
              {/* Quick Search Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-sas-gray-500">Quick searches:</span>
                <button 
                  onClick={() => handleNavigation('/observations')}
                  className="text-xs px-3 py-1 bg-sas-gray-100 text-sas-gray-700 rounded-full hover:bg-sas-gray-200 transition-colors"
                >
                  Recent Observations
                </button>
                <button 
                  onClick={() => handleNavigation('/admin/users')}
                  className="text-xs px-3 py-1 bg-sas-gray-100 text-sas-gray-700 rounded-full hover:bg-sas-gray-200 transition-colors"
                >
                  Users
                </button>
                <button 
                  onClick={() => handleNavigation('/dashboard')}
                  className="text-xs px-3 py-1 bg-sas-gray-100 text-sas-gray-700 rounded-full hover:bg-sas-gray-200 transition-colors"
                >
                  Dashboard Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {showPlatformMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowPlatformMenu(false);
          }}
        />
      )}
      
      {/* Backdrop for search (close on click outside) */}
      {showSearch && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowSearch(false)}
        />
      )}
    </header>
  );
};

export default UnifiedHeader;