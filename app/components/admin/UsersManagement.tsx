import React, { useState } from 'react';
import DataTable, { Column } from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Loader2, AlertCircle } from 'lucide-react';
import type { User } from '../../types';
import { useUsers, useDeleteUser, useCreateUser, useUpdateUser } from '../../hooks/useFirestore';
import UserForm from './UserForm';

export default function UsersManagementConnected() {
  // Fetch users from Firestore
  const { data: users = [], isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
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
    setShowViewModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        alert(`Successfully deleted ${user.displayName}`);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingUser(null);
  };

  const handleFormSave = async (userData: any) => {
    try {
      if (editingUser) {
        // Update existing user
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          data: {
            ...userData,
            displayName: `${userData.firstName} ${userData.lastName}`,
            isActive: true,
          }
        });
      } else {
        // Create new user
        await createUserMutation.mutateAsync({
          ...userData,
          displayName: `${userData.firstName} ${userData.lastName}`,
          isActive: true,
          status: 'active',
        } as any);
      }
      handleFormClose();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(`Failed to save user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600" />
        <p className="ml-3 text-gray-600">Loading users from Firestore...</p>
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
            <h3 className="text-sm font-medium text-red-900">Error Loading Users</h3>
            <p className="text-sm text-red-700 mt-1">
              {error instanceof Error ? error.message : 'Failed to load users from Firestore'}
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions • Connected to Firestore</p>
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

      {/* Empty State */}
      {users.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-900 font-medium">No users found in Firestore</p>
          <p className="text-yellow-700 text-sm mt-1">
            Click "Add User" to create your first user, or check your Firebase connection.
          </p>
        </div>
      )}

      {/* Data Table */}
      {users.length > 0 && (
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
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        />
      )}

      {/* User Form Modal */}
      <UserForm
        user={editingUser}
        isOpen={showFormModal}
        onClose={handleFormClose}
        onSave={handleFormSave}
        loading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Role</label>
                <span className={`inline-flex mt-1 items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.primaryRole)}`}>
                  {selectedUser.primaryRole?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Secondary Roles</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedUser.secondaryRoles && selectedUser.secondaryRoles.length > 0 ? (
                    selectedUser.secondaryRoles.map((role, idx) => (
                      <span key={idx} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}>
                        {role.replace('_', ' ').toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex mt-1 items-center px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
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
    </div>
  );
}
