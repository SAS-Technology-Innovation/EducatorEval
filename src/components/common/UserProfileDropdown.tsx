import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Moon, 
  Sun, 
  HelpCircle, 
  ChevronDown,
  Shield,
  BookOpen,
  Calendar,
  Mail
} from 'lucide-react';

interface UserProfileDropdownProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    primaryRole: string;
    title?: string;
    schoolName?: string;
    divisionNames?: string[];
    departmentNames?: string[];
  };
  onSignOut: () => void;
  onNavigate?: (path: string) => void;
  notificationCount?: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  onSignOut,
  onNavigate,
  notificationCount = 0,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleMenuClick = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case 'profile':
        onNavigate?.('/profile');
        break;
      case 'settings':
        onNavigate?.('/settings');
        break;
      case 'notifications':
        onNavigate?.('/notifications');
        break;
      case 'schedule':
        onNavigate?.('/schedule');
        break;
      case 'help':
        onNavigate?.('/help');
        break;
      case 'admin':
        onNavigate?.('/admin');
        break;
      case 'signout':
        onSignOut();
        break;
      case 'darkmode':
        onToggleDarkMode?.();
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-sas-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sas-blue-500"
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {getInitials()}
              </span>
            </div>
          )}
          
          {/* Notification Badge */}
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            </div>
          )}
        </div>

        {/* User Info (hidden on mobile) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-sas-gray-900 font-poppins">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-sas-gray-500 font-poppins">
            {getRoleDisplayName(user.primaryRole)}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-sas-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-sas-gray-200 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-sas-gray-200">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {getInitials()}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="font-semibold text-sas-gray-900 font-poppins">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-sas-gray-600 font-poppins">{user.email}</div>
                <div className="text-xs text-sas-gray-500 mt-1 font-poppins">
                  {user.title || getRoleDisplayName(user.primaryRole)}
                  {user.schoolName && (
                    <span> • {user.schoolName}</span>
                  )}
                </div>
                {user.divisionNames && user.divisionNames.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.divisionNames.map((division, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 text-xs bg-sas-blue-100 text-sas-blue-700 rounded-full"
                      >
                        {division}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleMenuClick('profile')}
              className="flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              My Profile
            </button>

            <button
              onClick={() => handleMenuClick('schedule')}
              className="flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-3" />
              My Schedule
            </button>

            <button
              onClick={() => handleMenuClick('notifications')}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </div>
              {notificationCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            <div className="border-t border-sas-gray-200 my-2"></div>

            <button
              onClick={() => handleMenuClick('settings')}
              className="flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>

            {onToggleDarkMode && (
              <button
                onClick={() => handleMenuClick('darkmode')}
                className="flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 mr-3" />
                ) : (
                  <Moon className="w-4 h-4 mr-3" />
                )}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            )}

            {/* Admin link for admin users */}
            {['head_of_school', 'principal', 'assistant_principal', 'system_admin'].includes(user.primaryRole) && (
              <button
                onClick={() => handleMenuClick('admin')}
                className="flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors"
              >
                <Shield className="w-4 h-4 mr-3" />
                Admin Dashboard
              </button>
            )}

            <div className="border-t border-sas-gray-200 my-2"></div>

            <button
              onClick={() => handleMenuClick('help')}
              className="flex items-center w-full px-4 py-2 text-sm text-sas-gray-700 hover:bg-sas-gray-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </button>

            <button
              onClick={() => handleMenuClick('signout')}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-sas-gray-50 border-t border-sas-gray-200 text-xs text-sas-gray-500">
            <div className="flex items-center justify-between">
              <span>EducatorEval Platform</span>
              <span>v2.0.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;