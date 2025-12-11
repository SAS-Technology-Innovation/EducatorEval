import { useState, useEffect } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import UserProfileDropdown from '../common/UserProfileDropdown';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenu?: boolean;
  onNavigate?: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, showMenu = false, onNavigate }) => {
  const [currentUser, setCurrentUser] = useState<unknown>(null);
  const [userProfile, setUserProfile] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const notificationCount = 3;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fallback to basic Firebase user data for now
          setCurrentUser(firebaseUser);
          setUserProfile({
            id: firebaseUser.uid,
            firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL,
            primaryRole: 'teacher', // Default fallback
            divisionNames: [],
            departmentNames: []
          });
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigate?.(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-sas-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center space-x-4">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-md text-sas-gray-600 hover:text-sas-gray-900 hover:bg-sas-gray-100 transition-colors"
              >
                {showMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sas-blue-600 to-sas-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-sas-gray-900">EducatorEval</h1>
                <p className="text-xs text-sas-gray-500 -mt-1">Excellence in Education</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-sas-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users, observations, schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm"
              />
            </form>
          </div>

          {/* Right Section - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={() => onNavigate?.('/notifications')}
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
                notificationCount={notificationCount}
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

export default Header;