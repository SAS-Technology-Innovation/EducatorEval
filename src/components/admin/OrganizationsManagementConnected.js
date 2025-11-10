import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import DataTable from '../common/DataTable';
import { Plus, Edit, Trash2, Eye, Building2, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useOrganizations, useDeleteOrganization } from '../../hooks/useFirestore';
export default function OrganizationsManagementConnected() {
    // Fetch organizations from Firestore
    const { data: organizations = [], isLoading, error } = useOrganizations();
    const deleteOrgMutation = useDeleteOrganization();
    const [showModal, setShowModal] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const columns = [
        {
            id: 'name',
            header: 'Organization Name',
            accessor: (org) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Building2, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: org.name }), _jsx("p", { className: "text-xs text-gray-500 capitalize", children: org.type })] })] })),
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
            accessor: (org) => (_jsxs("div", { children: [_jsx("p", { className: "text-sm", children: org.contactInfo?.email || 'N/A' }), _jsx("p", { className: "text-xs text-gray-500", children: org.contactInfo?.phone || '' })] }))
        },
        {
            id: 'status',
            header: 'Status',
            accessor: () => (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Active" }))
        }
    ];
    const handleView = (org) => {
        setSelectedOrg(org);
        setShowModal(true);
    };
    const handleEdit = (org) => {
        alert(`Edit functionality coming soon for ${org.name}`);
        console.log('Edit organization:', org);
    };
    const handleDelete = async (org) => {
        if (confirm(`Are you sure you want to delete ${org.name}? This action cannot be undone.`)) {
            try {
                await deleteOrgMutation.mutateAsync(org.id);
                alert(`Successfully deleted ${org.name}`);
            }
            catch (error) {
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
        return (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-600" }), _jsx("p", { className: "ml-3 text-gray-600", children: "Loading organizations from Firestore..." })] }));
    }
    // Error state
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-red-600 mt-0.5" }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-red-900", children: "Error Loading Organizations" }), _jsx("p", { className: "text-sm text-red-700 mt-1", children: error instanceof Error ? error.message : 'Failed to load organizations from Firestore' }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-3 text-sm font-medium text-red-600 hover:text-red-800", children: "Retry" })] })] }) }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Organizations" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage schools and educational institutions \u2022 Connected to Firestore" })] }), _jsxs("button", { onClick: handleAddOrganization, className: "bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Organization" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Organizations" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: organizations.length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Schools" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: organizations.filter(o => o.type === 'school').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Districts" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: organizations.filter(o => o.type === 'district').length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-2", children: "-" })] })] }), organizations.length === 0 && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center", children: [_jsx("p", { className: "text-yellow-900 font-medium", children: "No organizations found in Firestore" }), _jsx("p", { className: "text-yellow-700 text-sm mt-1", children: "Click \"Add Organization\" to create your first organization, or check your Firebase connection." })] })), organizations.length > 0 && (_jsx(DataTable, { columns: columns, data: organizations, searchPlaceholder: "Search organizations...", actions: (org) => (_jsxs(_Fragment, { children: [_jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleView(org);
                            }, className: "p-1 text-blue-600 hover:text-blue-800", title: "View", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleEdit(org);
                            }, className: "p-1 text-green-600 hover:text-green-800", title: "Edit", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleDelete(org);
                            }, className: "p-1 text-red-600 hover:text-red-800", title: "Delete", disabled: deleteOrgMutation.isPending, children: deleteOrgMutation.isPending ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Trash2, { className: "w-4 h-4" })) })] })) })), showModal && selectedOrg && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Organization Details" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Name" }), _jsx("p", { className: "mt-1 text-gray-900", children: selectedOrg.name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Type" }), _jsx("p", { className: "mt-1 text-gray-900 capitalize", children: selectedOrg.type })] }), selectedOrg.address && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Address" }), _jsxs("p", { className: "mt-1 text-gray-900", children: [selectedOrg.address.street, _jsx("br", {}), selectedOrg.address.city, ", ", selectedOrg.address.state, " ", selectedOrg.address.zipCode, _jsx("br", {}), selectedOrg.address.country] })] })), selectedOrg.contactInfo && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Contact Information" }), _jsxs("div", { className: "mt-1 space-y-1", children: [selectedOrg.contactInfo.email && (_jsxs("p", { className: "text-gray-900", children: ["Email: ", selectedOrg.contactInfo.email] })), selectedOrg.contactInfo.phone && (_jsxs("p", { className: "text-gray-900", children: ["Phone: ", selectedOrg.contactInfo.phone] })), selectedOrg.contactInfo.website && (_jsxs("p", { className: "text-gray-900", children: ["Website: ", _jsx("a", { href: selectedOrg.contactInfo.website, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:underline", children: selectedOrg.contactInfo.website })] }))] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Timezone" }), _jsx("p", { className: "mt-1 text-gray-900", children: selectedOrg.timezone || 'Not set' })] })] }), _jsx("div", { className: "p-6 border-t border-gray-200 flex justify-end", children: _jsx("button", { onClick: () => setShowModal(false), className: "px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200", children: "Close" }) })] }) }))] }));
}
