import React from 'react';
import { Home, BarChart3, Users, Settings, Book, Calendar } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      active: currentPath === '/'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      href: '/dashboard',
      active: currentPath === '/dashboard'
    },
    {
      id: 'observations',
      label: 'Observations',
      icon: <Book className="w-5 h-5" />,
      href: '/observations',
      active: currentPath === '/observations'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar className="w-5 h-5" />,
      href: '/schedule',
      active: currentPath === '/schedule'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <Users className="w-5 h-5" />,
      href: '/admin',
      active: currentPath === '/admin'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings',
      active: currentPath === '/settings'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-sas-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="text-xl font-bold text-sas-blue-600">EducatorEval</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.href)}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${item.active 
                      ? 'bg-sas-blue-100 text-sas-blue-700' 
                      : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-50'
                    }
                  `.trim()}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-sas-gray-500 hover:text-sas-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
