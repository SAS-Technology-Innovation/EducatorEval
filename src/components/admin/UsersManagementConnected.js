import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import DataTable from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Loader2, AlertCircle } from 'lucide-react';
import { useUsers, useDeleteUser } from '../../hooks/useFirestore';
export default function UsersManagementConnected() {
    // Fetch users from Firestore
    const { data: users = [], isLoading, error } = useUsers();
    const deleteUserMutation = useDeleteUser();
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const getRoleBadgeColor = (role) => {
        const colors = {
            super_admin: 'bg-red-100 text-red-800',
            administrator: 'bg-purple-100 text-purple-800',
            manager: 'bg-blue-100 text-blue-800',
            observer: 'bg-green-100 text-green-800',
            educator: 'bg-yellow-100 text-yellow-800',
            staff: 'bg-gray-100 text-gray-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };
    const columns = [
        {
            id: 'name',
            header: 'Name',
            accessor: (user) => (_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [user.firstName, " ", user.lastName] }), _jsx("p", { className: "text-xs text-gray-500", children: user.email })] })),
            sortable: true
        },
        {
            id: 'role',
            header: 'Primary Role',
            accessor: (user) => (_jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.primaryRole)}`, children: user.primaryRole?.replace('_', ' ').toUpperCase() })),
            sortable: true
        },
        {
            id: 'secondaryRoles',
            header: 'Secondary Roles',
            accessor: (user) => (_jsx("div", { className: "flex flex-wrap gap-1", children: user.secondaryRoles && user.secondaryRoles.length > 0 ? (user.secondaryRoles.map((role, idx) => (_jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getRoleBadgeColor(role)}`, children: role.replace('_', ' ') }, idx)))) : (_jsx("span", { className: "text-xs text-gray-400", children: "None" })) }))
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (user) => (_jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`, children: user.isActive ? 'Active' : 'Inactive' }))
        },
        {
            id: 'lastActive',
            header: 'Last Active',
            accessor: (user) => (_jsx("span", { className: "text-xs text-gray-500", children: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A' })),
            sortable: true
        }
    ];
    const handleView = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };
    const handleEdit = (user) => {
        // TODO: Open edit modal
        console.log('Edit user:', user);
        alert(`Edit functionality coming soon for ${user.displayName}`);
    };
    const handleDelete = async (user) => {
        if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
            try {
                await deleteUserMutation.mutateAsync(user.id);
                alert(`Successfully deleted ${user.displayName}`);
            }
            catch (error) {
                console.error('Error deleting user:', error);
                alert(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };
    const handleAddUser = () => {
        // TODO: Open add user modal
        alert('Add user functionality coming soon! This will open a modal to create a new user in Firestore.');
    };
    // Loading state
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-600" }), _jsx("p", { className: "ml-3 text-gray-600", children: "Loading users from Firestore..." })] }));
    }
    // Error state
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-red-600 mt-0.5" }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-red-900", children: "Error Loading Users" }), _jsx("p", { className: "text-sm text-red-700 mt-1", children: error instanceof Error ? error.message : 'Failed to load users from Firestore' }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-3 text-sm font-medium text-red-600 hover:text-red-800", children: "Retry" })] })] }) }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "User Management" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage user accounts and permissions \u2022 Connected to Firestore" })] }), _jsxs("button", { onClick: handleAddUser, className: "bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add User" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Educators" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.filter(u => u.primaryRole === 'educator').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Observers" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.filter(u => u.primaryRole === 'observer').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Administrators" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.filter(u => ['administrator', 'super_admin'].includes(u.primaryRole)).length })] })] }), users.length === 0 && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center", children: [_jsx("p", { className: "text-yellow-900 font-medium", children: "No users found in Firestore" }), _jsx("p", { className: "text-yellow-700 text-sm mt-1", children: "Click \"Add User\" to create your first user, or check your Firebase connection." })] })), users.length > 0 && (_jsx(DataTable, { columns: columns, data: users, searchPlaceholder: "Search users by name or email...", actions: (user) => (_jsxs(_Fragment, { children: [_jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleView(user);
                            }, className: "p-1 text-blue-600 hover:text-blue-800", title: "View", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleEdit(user);
                            }, className: "p-1 text-green-600 hover:text-green-800", title: "Edit", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleDelete(user);
                            }, className: "p-1 text-red-600 hover:text-red-800", title: "Delete", disabled: deleteUserMutation.isPending, children: deleteUserMutation.isPending ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Trash2, { className: "w-4 h-4" })) })] })) })), showModal && selectedUser && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "User Details" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Name" }), _jsxs("p", { className: "mt-1 text-gray-900", children: [selectedUser.firstName, " ", selectedUser.lastName] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("p", { className: "mt-1 text-gray-900", children: selectedUser.email })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Primary Role" }), _jsx("span", { className: `inline-flex mt-1 items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.primaryRole)}`, children: selectedUser.primaryRole?.replace('_', ' ').toUpperCase() })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Secondary Roles" }), _jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: selectedUser.secondaryRoles && selectedUser.secondaryRoles.length > 0 ? (selectedUser.secondaryRoles.map((role, idx) => (_jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`, children: role.replace('_', ' ').toUpperCase() }, idx)))) : (_jsx("span", { className: "text-gray-500 text-sm", children: "None" })) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Status" }), _jsx("span", { className: `inline-flex mt-1 items-center px-2 py-1 rounded-full text-xs font-medium ${selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`, children: selectedUser.isActive ? 'Active' : 'Inactive' })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Last Updated" }), _jsx("p", { className: "mt-1 text-gray-900", children: selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : 'N/A' })] })] }), _jsx("div", { className: "p-6 border-t border-gray-200 flex justify-end", children: _jsx("button", { onClick: () => setShowModal(false), className: "px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200", children: "Close" }) })] }) }))] }));
}
