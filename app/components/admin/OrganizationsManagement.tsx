import { useState } from 'react';
import DataTable, { Column } from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Building2, MapPin, Loader2, AlertCircle, X, Save } from 'lucide-react';
import type { Organization } from '../../types';
import { useOrganizations, useDeleteOrganization, useCreateOrganization, useUpdateOrganization } from '../../hooks/useFirestore';

// Form data for creating/editing organizations
interface OrganizationFormData {
  name: string;
  type: 'district' | 'school' | 'charter' | 'private';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
  timezone: string;
}

const defaultFormData: OrganizationFormData = {
  name: '',
  type: 'school',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Singapore',
  },
  contactInfo: {
    email: '',
    phone: '',
    website: '',
  },
  timezone: 'Asia/Singapore',
};

export default function OrganizationsManagementConnected() {
  // Fetch organizations from Firestore
  const { data: organizations = [], isLoading, error } = useOrganizations();
  const deleteOrgMutation = useDeleteOrganization();
  const createOrgMutation = useCreateOrganization();
  const updateOrgMutation = useUpdateOrganization();

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);

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
    setShowViewModal(true);
  };

  const handleEdit = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name || '',
      type: org.type || 'school',
      address: {
        street: org.address?.street || '',
        city: org.address?.city || '',
        state: org.address?.state || '',
        zipCode: org.address?.zipCode || '',
        country: org.address?.country || 'Singapore',
      },
      contactInfo: {
        email: org.contactInfo?.email || '',
        phone: org.contactInfo?.phone || '',
        website: org.contactInfo?.website || '',
      },
      timezone: org.timezone || 'Asia/Singapore',
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleDelete = async (org: Organization) => {
    if (window.confirm(`Are you sure you want to delete ${org.name}? This action cannot be undone.`)) {
      try {
        await deleteOrgMutation.mutateAsync(org.id);
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };

  const handleAddOrganization = () => {
    setSelectedOrg(null);
    setFormData(defaultFormData);
    setIsEditing(false);
    setShowEditModal(true);
  };

  const handleSaveOrganization = async () => {
    try {
      if (isEditing && selectedOrg) {
        await updateOrgMutation.mutateAsync({
          id: selectedOrg.id,
          data: formData as Partial<Organization>,
        });
      } else {
        await createOrgMutation.mutateAsync(formData as Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>);
      }
      setShowEditModal(false);
      setFormData(defaultFormData);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Error saving organization:', error);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof OrganizationFormData] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
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
      {showViewModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Organization Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
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
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedOrg);
                }}
                className="px-6 py-2 bg-sas-navy-600 text-white rounded-lg font-medium hover:bg-sas-navy-700"
              >
                Edit
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Organization Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Organization' : 'Add Organization'}
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                  placeholder="e.g., Singapore American School"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                >
                  <option value="school">School</option>
                  <option value="district">District</option>
                  <option value="charter">Charter</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Address */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Street</label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => handleFormChange('address.street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => handleFormChange('address.city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => handleFormChange('address.state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        onChange={(e) => handleFormChange('address.zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => handleFormChange('address.country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleFormChange('contactInfo.email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleFormChange('contactInfo.phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.contactInfo.website}
                      onChange={(e) => handleFormChange('contactInfo.website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>

              {/* Timezone */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleFormChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                >
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrganization}
                disabled={!formData.name || createOrgMutation.isPending || updateOrgMutation.isPending}
                className="px-6 py-2 bg-sas-navy-600 text-white rounded-lg font-medium hover:bg-sas-navy-700 disabled:opacity-50 flex items-center gap-2"
              >
                {(createOrgMutation.isPending || updateOrgMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isEditing ? 'Save Changes' : 'Create Organization'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
