import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { coreApi } from '../../api';
const ScheduleImport = () => {
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResults(null);
            setError(null);
        }
    };
    const handleImport = async () => {
        if (!file)
            return;
        setImporting(true);
        setError(null);
        try {
            const result = await coreApi.schedules.importSchedule(file);
            setResults(result);
        }
        catch (err) {
            setError(err.message || 'Failed to import schedule');
        }
        finally {
            setImporting(false);
        }
    };
    const downloadTemplate = async () => {
        try {
            const blob = await coreApi.schedules.getImportTemplate();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'schedule_import_template.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (err) {
            setError(err.message || 'Failed to download template');
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-sas-gray-900", children: "Schedule Import" }), _jsx("p", { className: "text-sas-gray-600 mt-1", children: "Import class schedules from CSV file" })] }), _jsxs("button", { onClick: downloadTemplate, className: "flex items-center space-x-2 px-4 py-2 bg-sas-blue-100 text-sas-blue-700 rounded-lg hover:bg-sas-blue-200 transition-colors", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Download Template" })] })] }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "border-2 border-dashed border-sas-gray-300 rounded-lg p-8 text-center", children: [_jsx(Upload, { className: "w-12 h-12 text-sas-gray-400 mx-auto mb-4" }), file ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(FileText, { className: "w-5 h-5 text-sas-green-600" }), _jsx("span", { className: "font-medium text-sas-gray-900", children: file.name })] }), _jsxs("p", { className: "text-sm text-sas-gray-600", children: [(file.size / 1024).toFixed(1), " KB \u2022 Ready to import"] })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-lg font-medium text-sas-gray-900", children: "Choose a CSV file to upload" }), _jsx("p", { className: "text-sas-gray-600", children: "Upload your schedule data in the required CSV format" })] })), _jsx("input", { type: "file", accept: ".csv", onChange: handleFileSelect, className: "hidden", id: "schedule-file-input" }), _jsx("label", { htmlFor: "schedule-file-input", className: "mt-4 inline-block px-6 py-3 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 cursor-pointer transition-colors", children: file ? 'Choose Different File' : 'Select CSV File' })] }) }), file && (_jsx("div", { className: "mb-6", children: _jsx("button", { onClick: handleImport, disabled: importing, className: "w-full px-6 py-3 bg-sas-green-600 text-white rounded-lg hover:bg-sas-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2", children: importing ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" }), _jsx("span", { children: "Importing Schedule..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Upload, { className: "w-5 h-5" }), _jsx("span", { children: "Import Schedule" })] })) }) })), results && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-sas-green-50 border border-sas-green-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-sas-green-600" }), _jsx("h3", { className: "font-medium text-sas-green-900", children: "Import Completed" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-sas-green-700", children: results.total_processed }), _jsx("div", { className: "text-sm text-sas-green-600", children: "Total Processed" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-sas-green-700", children: results.valid_entries }), _jsx("div", { className: "text-sm text-sas-green-600", children: "Valid Entries" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-sas-blue-700", children: results.saved_entries }), _jsx("div", { className: "text-sm text-sas-blue-600", children: "New Classes" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-sas-purple-700", children: results.updated_entries }), _jsx("div", { className: "text-sm text-sas-purple-600", children: "Updated Classes" })] })] })] }), results.validation_errors && results.validation_errors.length > 0 && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-yellow-600" }), _jsx("h3", { className: "font-medium text-yellow-900", children: "Validation Warnings" })] }), _jsx("div", { className: "max-h-40 overflow-y-auto", children: results.validation_errors.map((error, index) => (_jsx("div", { className: "text-sm text-yellow-700 py-1 border-b border-yellow-200 last:border-b-0", children: error }, index))) })] }))] })), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600" }), _jsx("h3", { className: "font-medium text-red-900", children: "Import Failed" })] }), _jsx("p", { className: "text-sm text-red-700 mt-2", children: error })] })), _jsxs("div", { className: "mt-6 bg-sas-gray-50 rounded-lg p-4", children: [_jsx("h3", { className: "font-medium text-sas-gray-900 mb-2", children: "CSV Format Requirements" }), _jsxs("div", { className: "text-sm text-sas-gray-700 space-y-1", children: [_jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Required columns:" }), " School Level, CLASS: Class ID, Class, CLASS: Teachers"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Date format:" }), " DD/MM/YY or MM/DD/YY (e.g., 13/08/25)"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Time format:" }), " HH:MM (24-hour) or H:MM AM/PM"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Teachers:" }), " Separate multiple teachers with commas"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Day types:" }), " A, B, C, D, etc. for rotating schedules"] }), _jsx("p", { children: "\u2022 Empty rows will be skipped automatically" })] })] })] }));
};
export default ScheduleImport;
