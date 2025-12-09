import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Mail, Shield } from 'lucide-react';
import type { User } from '../../types';

/**
 * @deprecated Use UsersManagementConnected instead.
 * This static version uses mock data. The connected version uses real Firestore data.
 */
export default function UsersManagement() {
  // Mock data - will be replaced with real Firebase data
  const [users] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@sas.edu.sg',
      primaryRole: 'super_admin',
      secondaryRoles: [],
      schoolIds: ['school1'],
      organizationId: 'org1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@sas.edu.sg',
      primaryRole: 'educator',
      secondaryRoles: ['observer'],
      schoolIds: ['school1'],
      organizationId: 'org1',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2025-01-05')
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@sas.edu.sg',
      primaryRole: 'observer',
      secondaryRoles: [],
      schoolIds: ['school1'],
      organizationId: 'org1',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-12-28')
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@sas.edu.sg',
      primaryRole: 'manager',
      secondaryRoles: ['educator'],
      schoolIds: ['school1'],
      organizationId: 'org1',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2025-01-02')
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Martinez',
      email: 'david.martinez@sas.edu.sg',
      primaryRole: 'administrator',
      secondaryRoles: [],
      schoolIds: ['school1', 'school2'],
      organizationId: 'org1',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-12-30')
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-red-100 text-red-800',
      administrator: 'bg-purple-100 text-purple-800',
      manager: 'bg-sas-navy-100 text-blue-800',
      observer: 'bg-green-100 text-green-800',
      educator: 'bg-yellow-100 text-yellow-800',
      staff: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const columns: Column<User>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: (user) => (
        <div>
          <p className="font-medium">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      ),
      sortable: true
    },
    {
      id: 'role',
      header: 'Primary Role',
      accessor: (user) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.primaryRole)}`}>
          {user.primaryRole?.replace('_', ' ').toUpperCase()}
        </span>
      ),
      sortable: true
    },
    {
      id: 'secondaryRoles',
      header: 'Secondary Roles',
      accessor: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.secondaryRoles && user.secondaryRoles.length > 0 ? (
            user.secondaryRoles.map((role, idx) => (
              <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getRoleBadgeColor(role)}`}>
                {role.replace('_', ' ')}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">None</span>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (user) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      )
    },
    {
      id: 'lastActive',
      header: 'Last Active',
      accessor: (user) => (
        <span className="text-xs text-gray-500">
          {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
      sortable: true
    }
  ];

  const handleView = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', user);
  };

  const handleDelete = (user: User) => {
    // TODO: Implement delete functionality
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      console.log('Delete user:', user);
    }
  };

  const handleAddUser = () => {
    // TODO: Implement add user functionality
    console.log('Add new user');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-sas-navy-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sas-navy-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Educators</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {users.filter(u => u.primaryRole === 'educator').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Observers</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {users.filter(u => u.primaryRole === 'observer').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Administrators</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {users.filter(u => ['administrator', 'super_admin'].includes(u.primaryRole)).length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name or email..."
        actions={(user) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView(user);
              }}
              className="p-1 text-sas-navy-600 hover:text-blue-800"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(user);
              }}
              className="p-1 text-green-600 hover:text-green-800"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(user);
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
