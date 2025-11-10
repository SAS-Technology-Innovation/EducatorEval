import React, { useState } from 'react';
import { Check, X, MousePointer } from 'lucide-react';

const InteractivityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  
  const tests = [
    {
      id: 'tab-overview',
      name: 'Overview Tab',
      description: 'Click Overview tab to switch views'
    },
    {
      id: 'tab-users', 
      name: 'Users Tab',
      description: 'Click Users tab to see user management'
    },
    {
      id: 'tab-organizations',
      name: 'Organizations Tab',
      description: 'Click Organizations tab to see schools'
    },
    {
      id: 'tab-system',
      name: 'System Tab',
      description: 'Click System tab for system settings'
    },
    {
      id: 'add-user-quick',
      name: 'Quick Action: Add User',
      description: 'Click "Add User" button in Quick Actions'
    },
    {
      id: 'add-school-quick',
      name: 'Quick Action: Add School', 
      description: 'Click "Add School" button in Quick Actions'
    },
    {
      id: 'export-data',
      name: 'Quick Action: Export Data',
      description: 'Click "Export Data" button'
    },
    {
      id: 'add-user-users',
      name: 'Users: Add User Button',
      description: 'In Users tab, click "Add User" button'
    },
    {
      id: 'search-users',
      name: 'Users: Search Function',
      description: 'Type in the search box to filter users'
    },
    {
      id: 'view-user',
      name: 'Users: View Action',
      description: 'Click the eye icon to view user details'
    },
    {
      id: 'edit-user',
      name: 'Users: Edit Action',
      description: 'Click the edit icon to edit user'
    },
    {
      id: 'delete-user',
      name: 'Users: Delete Action',
      description: 'Click the delete icon (with confirmation)'
    },
    {
      id: 'add-school-org',
      name: 'Organizations: Add School',
      description: 'In Organizations tab, click "Add School"'
    }
  ];

  const markTest = (testId: string, passed: boolean) => {
    setTestResults(prev => ({ ...prev, [testId]: passed }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Admin Dashboard Interactivity Test
          </h1>
          <p className="text-gray-600 mb-6">
            Test all interactive features of the Enhanced Admin Dashboard. 
            <strong> Open the dashboard in another tab:</strong>
            <a 
              href="/dashboard" 
              target="_blank" 
              className="text-blue-600 hover:text-blue-800 font-medium ml-2"
            >
              http://localhost:4321/dashboard →
            </a>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <MousePointer className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-blue-800 font-semibold">Testing Instructions:</h3>
                <p className="text-blue-700 text-sm mt-1">
                  1. Open the dashboard in a new tab<br/>
                  2. Try each interaction listed below<br/>
                  3. Mark whether it works correctly<br/>
                  4. All buttons should be clickable and show responses
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Interaction Tests</h2>
          
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => markTest(test.id, true)}
                    className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                      testResults[test.id] === true
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Works
                  </button>
                  <button
                    onClick={() => markTest(test.id, false)}
                    className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                      testResults[test.id] === false
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Broken
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Test Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter(result => result === true).length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter(result => result === false).length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {tests.length - Object.keys(testResults).length}
                </div>
                <div className="text-sm text-gray-600">Not Tested</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Expected Behaviors:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Tabs should switch content areas</li>
              <li>• Buttons should show modals or alerts</li>
              <li>• Search should filter the user table</li>
              <li>• Delete should show confirmation dialog</li>
              <li>• All actions should provide visual feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractivityTest;
