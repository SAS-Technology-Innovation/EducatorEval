import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { coreApi } from '../../api';

interface ImportResults {
  total_processed: number;
  valid_entries: number;
  saved_entries: number;
  updated_entries: number;
  validation_errors: string[];
}

const ScheduleImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    
    try {
      const result = await coreApi.schedules.importSchedule(file);
      setResults(result);
    } catch (err: any) {
      setError(err.message || 'Failed to import schedule');
    } finally {
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
    } catch (err: any) {
      setError(err.message || 'Failed to download template');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-sas-gray-900">Schedule Import</h2>
          <p className="text-sas-gray-600 mt-1">Import class schedules from CSV file</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-sas-blue-100 text-sas-blue-700 rounded-lg hover:bg-sas-blue-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Template</span>
        </button>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-sas-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-sas-gray-400 mx-auto mb-4" />
          
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5 text-sas-green-600" />
                <span className="font-medium text-sas-gray-900">{file.name}</span>
              </div>
              <p className="text-sm text-sas-gray-600">
                {(file.size / 1024).toFixed(1)} KB • Ready to import
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-sas-gray-900">
                Choose a CSV file to upload
              </p>
              <p className="text-sas-gray-600">
                Upload your schedule data in the required CSV format
              </p>
            </div>
          )}
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="schedule-file-input"
          />
          <label
            htmlFor="schedule-file-input"
            className="mt-4 inline-block px-6 py-3 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 cursor-pointer transition-colors"
          >
            {file ? 'Choose Different File' : 'Select CSV File'}
          </label>
        </div>
      </div>

      {/* Import Button */}
      {file && (
        <div className="mb-6">
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full px-6 py-3 bg-sas-green-600 text-white rounded-lg hover:bg-sas-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {importing ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Importing Schedule...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Import Schedule</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="bg-sas-green-50 border border-sas-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-sas-green-600" />
              <h3 className="font-medium text-sas-green-900">Import Completed</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-sas-green-700">{results.total_processed}</div>
                <div className="text-sm text-sas-green-600">Total Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sas-green-700">{results.valid_entries}</div>
                <div className="text-sm text-sas-green-600">Valid Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sas-blue-700">{results.saved_entries}</div>
                <div className="text-sm text-sas-blue-600">New Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sas-purple-700">{results.updated_entries}</div>
                <div className="text-sm text-sas-purple-600">Updated Classes</div>
              </div>
            </div>
          </div>

          {/* Validation Errors */}
          {results.validation_errors && results.validation_errors.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-900">Validation Warnings</h3>
              </div>
              
              <div className="max-h-40 overflow-y-auto">
                {results.validation_errors.map((error, index) => (
                  <div key={index} className="text-sm text-yellow-700 py-1 border-b border-yellow-200 last:border-b-0">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-900">Import Failed</h3>
          </div>
          <p className="text-sm text-red-700 mt-2">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-sas-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-sas-gray-900 mb-2">CSV Format Requirements</h3>
        <div className="text-sm text-sas-gray-700 space-y-1">
          <p>• <strong>Required columns:</strong> School Level, CLASS: Class ID, Class, CLASS: Teachers</p>
          <p>• <strong>Date format:</strong> DD/MM/YY or MM/DD/YY (e.g., 13/08/25)</p>
          <p>• <strong>Time format:</strong> HH:MM (24-hour) or H:MM AM/PM</p>
          <p>• <strong>Teachers:</strong> Separate multiple teachers with commas</p>
          <p>• <strong>Day types:</strong> A, B, C, D, etc. for rotating schedules</p>
          <p>• Empty rows will be skipped automatically</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleImport;