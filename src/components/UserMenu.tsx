import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Shield, 
  ChevronDown,
  Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const UserMenu: React.FC = () => {
  const { user, signOut, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock available roles - this would come from user permissions
  const availableRoles: UserRole[] = user?.role === 'admin' 
    ? ['admin', 'coordinator', 'observer', 'teacher']
    : user?.role === 'coordinator'
    ? ['coordinator', 'observer', 'teacher'] 
    : ['teacher', 'observer'];

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

  const handleRoleSwitch = async (newRole: UserRole) => {
    try {
      await switchRole(newRole);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      coordinator: 'bg-purple-100 text-purple-800', 
      observer: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleDescription = (role: UserRole) => {
    const descriptions = {
      admin: 'Full system access and user management',
      coordinator: 'Manage observations and generate reports',
      observer: 'Conduct classroom observations', 
      teacher: 'View your observation results and feedback'
    };
    return descriptions[role];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-sm font-semibold text-white">
            {getInitials(user.name)}
          </span>
        </div>
        
        {/* User Info - Hidden on mobile */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 truncate max-w-32">
            {user.name}
          </div>
          <div className="flex items-center space-x-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-lg font-semibold text-white">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                <div className="text-sm text-gray-600 truncate">{user.email}</div>
                <div className="text-xs text-gray-500 mt-1">{user.department}</div>
              </div>
            </div>
            
            {/* Current Role Badge */}
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                <Shield className="w-3 h-3 mr-1" />
                Current: {user.role}
              </span>
            </div>
          </div>

          {/* Role Switcher */}
          {availableRoles.length > 1 && (
            <div className="p-4 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Switch Role
              </div>
              <div className="space-y-2">
                {availableRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`w-full flex items-start space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      user.role === role
                        ? 'bg-blue-50 text-blue-700 cursor-default'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    disabled={user.role === role}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      user.role === role ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium capitalize">{role}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {getRoleDescription(role)}
                      </div>
                    </div>
                    {user.role === role && (
                      <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="p-2">
            <a
              href="/profile"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Profile Settings</span>
            </a>
            
            <a
              href="/preferences"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Preferences</span>
            </a>
            
            <div className="border-t border-gray-100 my-2" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors group text-red-600"
            >
              <LogOut className="w-4 h-4 group-hover:text-red-700" />
              <span className="text-sm group-hover:text-red-700">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
