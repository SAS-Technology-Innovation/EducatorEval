import React from 'react';
import AdminDashboard from './AdminDashboard';

interface AdminContentProps {
  defaultTab?: 'overview' | 'users' | 'organizations' | 'system';
}

const AdminContent: React.FC<AdminContentProps> = ({ defaultTab = 'overview' }) => {
  // For now, we'll use the existing AdminDashboard but remove its header
  // TODO: Extract the content part of AdminDashboard without the header
  return (
    <div className="py-8">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-sas-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-sas-gray-900 font-serif">Admin Dashboard</h1>
              <p className="text-sas-gray-600 mt-1">Complete platform administration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary: Use existing AdminDashboard - this will need to be refactored */}
      <AdminDashboard defaultTab={defaultTab} />
    </div>
  );
};

export default AdminContent;