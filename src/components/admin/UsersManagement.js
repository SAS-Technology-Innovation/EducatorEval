import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import DataTable from '../common/DataTable';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
export default function UsersManagement() {
    // Mock data - will be replaced with real Firebase data
    const [users] = useState([
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
            accessor: (user) => (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Active" }))
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
        // TODO: Implement edit functionality
        console.log('Edit user:', user);
    };
    const handleDelete = (user) => {
        // TODO: Implement delete functionality
        if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
            console.log('Delete user:', user);
        }
    };
    const handleAddUser = () => {
        // TODO: Implement add user functionality
        console.log('Add new user');
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "User Management" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage user accounts and permissions" })] }), _jsxs("button", { onClick: handleAddUser, className: "bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add User" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Educators" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.filter(u => u.primaryRole === 'educator').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Observers" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.filter(u => u.primaryRole === 'observer').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Administrators" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: users.filter(u => ['administrator', 'super_admin'].includes(u.primaryRole)).length })] })] }), _jsx(DataTable, { columns: columns, data: users, searchPlaceholder: "Search users by name or email...", actions: (user) => (_jsxs(_Fragment, { children: [_jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleView(user);
                            }, className: "p-1 text-blue-600 hover:text-blue-800", title: "View", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleEdit(user);
                            }, className: "p-1 text-green-600 hover:text-green-800", title: "Edit", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleDelete(user);
                            }, className: "p-1 text-red-600 hover:text-red-800", title: "Delete", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) })] }));
}
