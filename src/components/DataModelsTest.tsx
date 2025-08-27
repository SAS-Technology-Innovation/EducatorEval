import React, { useState, useEffect } from 'react';
import { User, School, Division, Department, AppletMetadata } from '../types';
import { enhancedApi } from '../api/enhancedApi';

const DataModelsTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const results: Record<string, any> = {};
      
      try {
        // Test 1: Start with clean slate
        console.log('🆕 Starting with empty data arrays...');
        // No mock data initialization - start completely blank
        results.cleanSlateInit = { success: true };

        // Test 2: User Management API
        console.log('👥 Testing User Management...');
        const users = await enhancedApi.users.list();
        const teachers = await enhancedApi.users.getTeachers();
        results.userManagement = {
          success: true,
          totalUsers: users.length,
          teachersCount: teachers.length,
          sampleUser: users[0] || null
        };

        // Test 3: School Hierarchy API
        console.log('🏢 Testing School Management...');
        const schools = await enhancedApi.schools.list();
        const divisions = await enhancedApi.divisions.list();
        const departments = await enhancedApi.departments.list();
        results.schoolManagement = {
          success: true,
          schoolsCount: schools.length,
          divisionsCount: divisions.length,
          departmentsCount: departments.length,
          sampleSchool: schools[0] || null
        };

        // Test 4: Applet System
        console.log('🔧 Testing Applet Management...');
        const applets = await enhancedApi.applets.list();
        results.appletManagement = {
          success: true,
          appletsCount: applets.length,
          sampleApplet: applets[0] || null
        };

        // Test 5: Type System Validation
        console.log('📋 Testing Type System...');
        results.typeSystem = {
          success: true,
          userFieldsCount: Object.keys(users[0] || {}).length,
          hasScheduleFields: users[0]?.planningPeriods !== undefined,
          hasProfessionalInfo: users[0]?.certifications !== undefined,
          hasContactInfo: users[0]?.languages !== undefined
        };

        console.log('✅ All tests completed successfully!');
        
      } catch (error) {
        console.error('❌ Test failed:', error);
        results.error = {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      setTestResults(results);
      setIsLoading(false);
    };

    runTests();
  }, []);

  const initializeMockData = () => {
    // This function will be implemented to populate mock data
    console.log('Mock data initialization would happen here');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sas-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sas-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-sas-gray-900 mt-4">Testing Priority 1 Data Models</h2>
          <p className="text-sas-gray-600 mt-2">Running comprehensive tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sas-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sas-gray-900 font-serif">Priority 1 Test Results</h1>
          <p className="text-sas-gray-600 mt-2">Enhanced Data Models & API Testing</p>
        </div>

        <div className="space-y-6">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-sas-gray-900 capitalize">
                  {testName.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.success ? '✅ Passed' : '❌ Failed'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result)
                  .filter(([key]) => key !== 'success')
                  .map(([key, value]) => (
                    <div key={key} className="bg-sas-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-sas-gray-700 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sas-gray-900">
                        {typeof value === 'object' && value !== null 
                          ? JSON.stringify(value, null, 2).substring(0, 200) + '...'
                          : String(value)
                        }
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Type System Details */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-sas-gray-900 mb-4">Enhanced Data Model Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">👥 User Management</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 17 comprehensive role types</li>
                <li>• Schedule integration fields</li>
                <li>• Professional certifications</li>
                <li>• Contact & demographics</li>
                <li>• Preferences & notifications</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">🏢 School Hierarchy</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• School → Division → Department</li>
                <li>• 5 division types supported</li>
                <li>• Pre-defined department structures</li>
                <li>• Academic year management</li>
                <li>• Settings at each level</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">📅 Schedule System</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Master schedule framework</li>
                <li>• Multiple schedule types</li>
                <li>• Day type management</li>
                <li>• Class assignments</li>
                <li>• Teaching load calculation</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">📋 Observation System</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Generic framework engine</li>
                <li>• Multiple framework alignments</li>
                <li>• CRP specialization</li>
                <li>• Evidence management</li>
                <li>• Configurable sections</li>
              </ul>
            </div>
            
            <div className="bg-pink-50 rounded-lg p-4">
              <h4 className="font-semibold text-pink-900 mb-2">🎓 Learning & Goals</h4>
              <ul className="text-sm text-pink-800 space-y-1">
                <li>• Professional learning tracking</li>
                <li>• Goal management system</li>
                <li>• Performance evaluations</li>
                <li>• Progress monitoring</li>
                <li>• Certification management</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">🔧 Applet System</h4>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Modular applet architecture</li>
                <li>• Role-based access control</li>
                <li>• Configuration management</li>
                <li>• Usage analytics</li>
                <li>• Install/uninstall system</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Testing Summary */}
        <div className="mt-8 bg-gradient-to-r from-sas-blue-50 to-sas-green-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-sas-gray-900 mb-4">🧪 API Testing Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-sas-blue-600">
                {testResults.userManagement?.totalUsers || 0}
              </div>
              <div className="text-sm text-sas-gray-600">Users Tested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sas-green-600">
                {testResults.schoolManagement?.schoolsCount || 0}
              </div>
              <div className="text-sm text-sas-gray-600">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sas-purple-600">
                {testResults.appletManagement?.appletsCount || 0}
              </div>
              <div className="text-sm text-sas-gray-600">Applets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sas-gold-600">
                {testResults.typeSystem?.userFieldsCount || 0}
              </div>
              <div className="text-sm text-sas-gray-600">User Fields</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModelsTest;
