import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown } from 'lucide-react';
export default function DataTable({ columns, data, onRowClick, loading = false, searchPlaceholder = 'Search...', itemsPerPage = 10, actions }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    // Filter data based on search
    const filteredData = data.filter((row) => {
        if (!searchTerm)
            return true;
        return columns.some((col) => {
            const value = col.accessor(row);
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });
    });
    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn)
            return 0;
        const column = columns.find((col) => col.id === sortColumn);
        if (!column)
            return 0;
        const aValue = column.accessor(a);
        const bValue = column.accessor(b);
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        return 0;
    });
    // Paginate data
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
    const handleSort = (columnId) => {
        const column = columns.find((col) => col.id === columnId);
        if (!column?.sortable)
            return;
        if (sortColumn === columnId) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortColumn(columnId);
            setSortDirection('asc');
        }
    };
    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: searchPlaceholder, value: searchTerm, onChange: (e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }) }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [columns.map((column) => (_jsx("th", { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`, style: { width: column.width }, onClick: () => column.sortable && handleSort(column.id), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { children: column.header }), column.sortable && (_jsx("div", { className: "flex flex-col", children: sortColumn === column.id ? (sortDirection === 'asc' ? (_jsx(ArrowUp, { className: "w-3 h-3" })) : (_jsx(ArrowDown, { className: "w-3 h-3" }))) : (_jsx("div", { className: "w-3 h-3" })) }))] }) }, column.id))), actions && (_jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" }))] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (actions ? 1 : 0), className: "px-6 py-8 text-center text-gray-500", children: _jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }) }) })) : paginatedData.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (actions ? 1 : 0), className: "px-6 py-8 text-center text-gray-500", children: "No data found" }) })) : (paginatedData.map((row) => (_jsxs("tr", { className: `${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`, onClick: () => onRowClick?.(row), children: [columns.map((column) => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: column.accessor(row) }, column.id))), actions && (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsx("div", { className: "flex items-center justify-end space-x-2", children: actions(row) }) }))] }, row.id)))) })] }) }), !loading && paginatedData.length > 0 && (_jsxs("div", { className: "px-6 py-4 border-t border-gray-200 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-700", children: ["Showing ", _jsx("span", { className: "font-medium", children: startIndex + 1 }), " to", ' ', _jsx("span", { className: "font-medium", children: Math.min(startIndex + itemsPerPage, filteredData.length) }), " of", ' ', _jsx("span", { className: "font-medium", children: filteredData.length }), " results"] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => goToPage(1), disabled: currentPage === 1, className: "p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: _jsx(ChevronsLeft, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => goToPage(currentPage - 1), disabled: currentPage === 1, className: "p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx("div", { className: "flex items-center space-x-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    }
                                    else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    }
                                    else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    }
                                    else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (_jsx("button", { onClick: () => goToPage(pageNum), className: `px-3 py-1 rounded-lg text-sm ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'}`, children: pageNum }, i));
                                }) }), _jsx("button", { onClick: () => goToPage(currentPage + 1), disabled: currentPage === totalPages, className: "p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: _jsx(ChevronRight, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => goToPage(totalPages), disabled: currentPage === totalPages, className: "p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: _jsx(ChevronsRight, { className: "w-4 h-4" }) })] })] }))] }));
}
