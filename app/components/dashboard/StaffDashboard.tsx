import { Link } from 'react-router-dom';
import {
  User,
  Calendar,
  Settings,
  ChevronRight,
  Building2,
  Mail,
  Phone
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth';

/**
 * Staff Dashboard
 *
 * Minimal dashboard for staff members (non-teaching roles).
 * Displays profile information and quick links.
 *
 * Note: Announcements and resources functionality will be added
 * when those database collections are implemented.
 */
export default function StaffDashboard() {
  const user = useAuthStore(state => state.user);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-sas-navy-600 to-sas-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bebas mb-2">
          Welcome, {user.firstName}!
        </h1>
        <p className="text-blue-100">
          Your staff portal at Singapore American School
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-sas-navy-100 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-sas-navy-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user.displayName}</h2>
            <p className="text-gray-600 capitalize">{user.jobTitle?.replace('_', ' ') || 'Staff Member'}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.primaryDepartmentId && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{user.primaryDepartmentId}</span>
                </div>
              )}
              {user.divisionId && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{user.divisionId}</span>
                </div>
              )}
            </div>
          </div>
          <Link
            to="/app/profile"
            className="px-4 py-2 text-sm font-medium text-sas-navy-600 hover:text-sas-navy-700 border border-sas-navy-300 rounded-lg hover:bg-sas-navy-50"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLinkCard
          icon={User}
          title="My Profile"
          description="View and update your profile information"
          link="/app/profile"
        />
        <QuickLinkCard
          icon={Settings}
          title="Settings"
          description="Manage your account preferences"
          link="/app/settings"
        />
        <QuickLinkCard
          icon={Calendar}
          title="Schedule"
          description="View school calendar and events"
          link="/app/schedule"
        />
      </div>

      {/* Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Your Role</h4>
            <p className="text-gray-600 capitalize">{user.primaryRole?.replace('_', ' ') || 'Staff'}</p>
          </div>
          {user.primaryDepartmentId && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Department</h4>
              <p className="text-gray-600">{user.primaryDepartmentId}</p>
            </div>
          )}
          {user.divisionId && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Division</h4>
              <p className="text-gray-600">{user.divisionId}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Account Status</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600 text-sm mb-4">
          Contact the IT Help Desk for technical support or HR for account-related questions.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:helpdesk@sas.edu.sg"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Mail className="w-4 h-4" />
            IT Help Desk
          </a>
          <a
            href="mailto:hr@sas.edu.sg"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Phone className="w-4 h-4" />
            Human Resources
          </a>
        </div>
      </div>
    </div>
  );
}

// Quick Link Card Component
function QuickLinkCard({
  icon: Icon,
  title,
  description,
  link
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:border-sas-navy-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-sas-navy-100 flex items-center justify-center group-hover:bg-sas-navy-200 transition-colors">
          <Icon className="w-6 h-6 text-sas-navy-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-sas-navy-600 transition-colors flex items-center gap-2">
            {title}
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
