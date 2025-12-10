import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Building2, MapPin, Loader2, AlertCircle } from 'lucide-react';
import type { Organization } from '../../types';
import { useOrganizations, useDeleteOrganization } from '../../hooks/useFirestore';

export default function OrganizationsManagementConnected() {
  // Fetch organizations from Firestore
  const { data: organizations = [], isLoading, error } = useOrganizations();
  const deleteOrgMutation = useDeleteOrganization();

  const [showModal, setShowModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const columns: Column<Organization>[] = [
    {
      id: 'name',
      header: 'Organization Name',
      accessor: (org) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sas-navy-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sas-navy-600" />
          </div>
          <div>
            <p className="font-medium">{org.name}</p>
            <p className="text-xs text-gray-500 capitalize">{org.type}</p>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'location',
      header: 'Location',
      accessor: (org) => (
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm">{org.address?.city || 'N/A'}</p>
            <p className="text-xs text-gray-500">{org.address?.country || ''}</p>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: (org) => (
        <div>
          <p className="text-sm">{org.contactInfo?.email || 'N/A'}</p>
          <p className="text-xs text-gray-500">{org.contactInfo?.phone || ''}</p>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: () => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      )
    }
  ];

  const handleView = (org: Organization) => {
    setSelectedOrg(org);
    setShowModal(true);
  };

  const handleEdit = (org: Organization) => {
    alert(`Edit functionality coming soon for ${org.name}`);
    console.log('Edit organization:', org);
  };

  const handleDelete = async (org: Organization) => {
    if (confirm(`Are you sure you want to delete ${org.name}? This action cannot be undone.`)) {
      try {
        await deleteOrgMutation.mutateAsync(org.id);
        alert(`Successfully deleted ${org.name}`);
      } catch (error) {
        console.error('Error deleting organization:', error);
        alert(`Failed to delete organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleAddOrganization = () => {
    alert('Add organization functionality coming soon! This will open a modal to create a new organization in Firestore.');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600" />
        <p className="ml-3 text-gray-600">Loading organizations from Firestore...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-900">Error Loading Organizations</h3>
            <p className="text-sm text-red-700 mt-1">
              {error instanceof Error ? error.message : 'Failed to load organizations from Firestore'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600 mt-1">Manage schools and educational institutions • Connected to Firestore</p>
        </div>
        <button
          onClick={handleAddOrganization}
          className="bg-sas-navy-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sas-navy-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Organization</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Organizations</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{organizations.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Schools</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {organizations.filter(o => o.type === 'school').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Districts</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {organizations.filter(o => o.type === 'district').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">-</p>
        </div>
      </div>

      {/* Empty State */}
      {organizations.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-900 font-medium">No organizations found in Firestore</p>
          <p className="text-yellow-700 text-sm mt-1">
            Click "Add Organization" to create your first organization, or check your Firebase connection.
          </p>
        </div>
      )}

      {/* Data Table */}
      {organizations.length > 0 && (
        <DataTable
          columns={columns}
          data={organizations}
          searchPlaceholder="Search organizations..."
          actions={(org) => (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(org);
                }}
                className="p-1 text-sas-navy-600 hover:text-blue-800"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(org);
                }}
                className="p-1 text-green-600 hover:text-green-800"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(org);
                }}
                className="p-1 text-red-600 hover:text-red-800"
                title="Delete"
                disabled={deleteOrgMutation.isPending}
              >
                {deleteOrgMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        />
      )}

      {/* View Organization Modal */}
      {showModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Organization Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">{selectedOrg.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="mt-1 text-gray-900 capitalize">{selectedOrg.type}</p>
              </div>
              {selectedOrg.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-gray-900">
                    {selectedOrg.address.street}<br />
                    {selectedOrg.address.city}, {selectedOrg.address.state} {selectedOrg.address.zipCode}<br />
                    {selectedOrg.address.country}
                  </p>
                </div>
              )}
              {selectedOrg.contactInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Information</label>
                  <div className="mt-1 space-y-1">
                    {selectedOrg.contactInfo.email && (
                      <p className="text-gray-900">Email: {selectedOrg.contactInfo.email}</p>
                    )}
                    {selectedOrg.contactInfo.phone && (
                      <p className="text-gray-900">Phone: {selectedOrg.contactInfo.phone}</p>
                    )}
                    {selectedOrg.contactInfo.website && (
                      <p className="text-gray-900">Website: <a href={selectedOrg.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-sas-navy-600 hover:underline">{selectedOrg.contactInfo.website}</a></p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <p className="mt-1 text-gray-900">{selectedOrg.timezone || 'Not set'}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
