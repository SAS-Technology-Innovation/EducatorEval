import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import DataTable from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Building2, MapPin } from 'lucide-react';
export default function OrganizationsManagement() {
    // Mock data - will be replaced with real Firebase data
    const [organizations] = useState([
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
    const [selectedOrg, setSelectedOrg] = useState(null);
    const columns = [
        {
            id: 'name',
            header: 'Organization Name',
            accessor: (org) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Building2, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: org.name }), _jsx("p", { className: "text-xs text-gray-500", children: org.type })] })] })),
            sortable: true
        },
        {
            id: 'location',
            header: 'Location',
            accessor: (org) => (_jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm", children: org.address?.city || 'N/A' }), _jsx("p", { className: "text-xs text-gray-500", children: org.address?.country || '' })] })] }))
        },
        {
            id: 'contact',
            header: 'Contact',
            accessor: (org) => (_jsxs("div", { children: [_jsx("p", { className: "text-sm", children: org.contactEmail }), _jsx("p", { className: "text-xs text-gray-500", children: org.contactPhone })] }))
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (org) => (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Active" }))
        }
    ];
    const handleView = (org) => {
        setSelectedOrg(org);
        setShowModal(true);
    };
    const handleEdit = (org) => {
        console.log('Edit organization:', org);
    };
    const handleDelete = (org) => {
        if (confirm(`Are you sure you want to delete ${org.name}?`)) {
            console.log('Delete organization:', org);
        }
    };
    const handleAddOrganization = () => {
        console.log('Add new organization');
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Organizations" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage schools and educational institutions" })] }), _jsxs("button", { onClick: handleAddOrganization, className: "bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Organization" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Organizations" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: organizations.length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Schools" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: organizations.filter(o => o.type === 'school').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Districts" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: organizations.filter(o => o.type === 'district').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Active Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: "156" })] })] }), _jsx(DataTable, { columns: columns, data: organizations, searchPlaceholder: "Search organizations...", actions: (org) => (_jsxs(_Fragment, { children: [_jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleView(org);
                            }, className: "p-1 text-blue-600 hover:text-blue-800", title: "View", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleEdit(org);
                            }, className: "p-1 text-green-600 hover:text-green-800", title: "Edit", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleDelete(org);
                            }, className: "p-1 text-red-600 hover:text-red-800", title: "Delete", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) })] }));
}
