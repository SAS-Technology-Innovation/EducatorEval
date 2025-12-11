import { Search, Bell } from 'lucide-react';
import UserProfileDropdown from '../common/UserProfileDropdown';

interface HeaderSimpleProps {
  user?: unknown;
  onNavigate?: (path: string) => void;
}

const HeaderSimple: React.FC<HeaderSimpleProps> = ({ user, onNavigate }) => {
  return (
    <header className="bg-white shadow-sm border-b border-sas-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sas-blue-600 to-sas-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-sas-gray-900">EducatorEval</h1>
              <p className="text-xs text-sas-gray-500 -mt-1">Excellence in Education</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-sas-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* User Menu */}
            {user ? (
              <UserProfileDropdown
                notificationCount={3}
              />
            ) : (
              <button
                onClick={() => onNavigate?.('/login')}
                className="px-4 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 transition-colors text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSimple;