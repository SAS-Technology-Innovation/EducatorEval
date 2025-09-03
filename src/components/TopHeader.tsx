import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ title = "Dashboard", subtitle }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search observations, teachers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm text-gray-900">New observation scheduled</p>
                    <p className="text-xs text-gray-500 mt-1">Math class with Sarah Chen - Tomorrow 10:30 AM</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm text-gray-900">Framework updated</p>
                    <p className="text-xs text-gray-500 mt-1">CRP in Action framework has been modified</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-4 py-2">
                  <a href="/notifications" className="text-xs text-blue-600 hover:text-blue-700">View all notifications</a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'Observer'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role || 'Coordinator'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Observer'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'observer@school.edu'}</p>
                </div>
                
                <a
                  href="/profile"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>View Profile</span>
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
                
                {user?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </a>
                )}
                
                <hr className="my-2" />
                
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
