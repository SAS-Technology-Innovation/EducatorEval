import React from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Building2, 
  Settings, 
  Book,
  Calendar,
  Puzzle,
  Shield
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  children?: SidebarItem[];
}

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPath = '/', 
  onNavigate,
  collapsed = false 
}) => {
  const sidebarItems: SidebarItem[] = [
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
      label: 'Administration',
      icon: <Shield className="w-5 h-5" />,
      href: '/admin',
      active: currentPath.startsWith('/admin'),
      children: [
        {
          id: 'users',
          label: 'User Management',
          icon: <Users className="w-4 h-4" />,
          href: '/admin/users',
          active: currentPath === '/admin/users'
        },
        {
          id: 'organizations',
          label: 'Organizations',
          icon: <Building2 className="w-4 h-4" />,
          href: '/admin/organizations',
          active: currentPath === '/admin/organizations'
        },
        {
          id: 'applets',
          label: 'Applets',
          icon: <Puzzle className="w-4 h-4" />,
          href: '/admin/applets',
          active: currentPath === '/admin/applets'
        }
      ]
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
    <div className={`
      bg-white shadow-sm border-r border-sas-gray-200 h-full
      ${collapsed ? 'w-16' : 'w-64'}
      transition-all duration-300
    `}>
      <div className="p-4">
        {/* Logo */}
        {!collapsed && (
          <div className="text-xl font-bold text-sas-blue-600 mb-8">
            EducatorEval
          </div>
        )}
        
        {/* Navigation Items */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => onNavigate?.(item.href)}
                className={`
                  w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                  ${item.active 
                    ? 'bg-sas-blue-100 text-sas-blue-700' 
                    : 'text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-50'
                  }
                `.trim()}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
              
              {/* Submenu items */}
              {!collapsed && item.children && item.active && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => onNavigate?.(child.href)}
                      className={`
                        w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-left
                        ${child.active 
                          ? 'bg-sas-blue-50 text-sas-blue-600' 
                          : 'text-sas-gray-500 hover:text-sas-gray-700 hover:bg-sas-gray-50'
                        }
                      `.trim()}
                    >
                      {child.icon}
                      <span className="ml-2">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
