import React, { useState } from 'react';
import { 
  Bell,
  Menu,
  X,
  BookOpen,
  BarChart3,
  Database,
  Calendar,
  Eye
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import UserMenu from './UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { hasRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['admin', 'coordinator', 'observer'] },
    { name: 'Observations', href: '/observations', icon: Eye, roles: ['admin', 'coordinator', 'observer', 'teacher'] },
    { name: 'Live Observe', href: '/observe', icon: BookOpen, roles: ['observer', 'coordinator'] },
    { name: 'Frameworks', href: '/framework', icon: Database, roles: ['admin', 'coordinator'] },
    { name: 'Data', href: '/data', icon: Database, roles: ['admin', 'coordinator'] },
    { name: 'Schedule', href: '/schedule', icon: Calendar, roles: ['admin', 'coordinator', 'observer'] },
  ];

  const visibleNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CRP Observation</h1>
                  <p className="text-xs text-gray-500">Leading with Observation</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1 ml-8">
                {visibleNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = window.location.pathname === item.href;
                  
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* User Profile Dropdown */}
              <UserMenu />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="space-y-1">
                {visibleNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = window.location.pathname === item.href;
                  
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
