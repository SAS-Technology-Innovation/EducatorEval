import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Building2, MapPin } from 'lucide-react';
import type { Organization } from '../../types';

export default function OrganizationsManagement() {
  // Mock data - will be replaced with real Firebase data
  const [organizations] = useState<Organization[]>([
    {
      id: 'org1',
      name: 'Singapore American School',
      type: 'school',
      address: {
        street: '40 Woodlands Street 41',
        city: 'Singapore',
        state: '',
        zipCode: '738547',
        country: 'Singapore'
      },
      contactEmail: 'info@sas.edu.sg',
      contactPhone: '+65 6363 3403',
      website: 'https://www.sas.edu.sg',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2025-01-01')
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const columns: Column<Organization>[] = [
    {
      id: 'name',
      header: 'Organization Name',
      accessor: (org) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{org.name}</p>
            <p className="text-xs text-gray-500">{org.type}</p>
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
          <p className="text-sm">{org.contactEmail}</p>
          <p className="text-xs text-gray-500">{org.contactPhone}</p>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (org) => (
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
    console.log('Edit organization:', org);
  };

  const handleDelete = (org: Organization) => {
    if (confirm(`Are you sure you want to delete ${org.name}?`)) {
      console.log('Delete organization:', org);
    }
  };

  const handleAddOrganization = () => {
    console.log('Add new organization');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600 mt-1">Manage schools and educational institutions</p>
        </div>
        <button
          onClick={handleAddOrganization}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2 transition-colors"
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
          <p className="text-sm font-medium text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">156</p>
        </div>
      </div>

      {/* Data Table */}
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
              className="p-1 text-blue-600 hover:text-blue-800"
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
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />
    </div>
  );
}
