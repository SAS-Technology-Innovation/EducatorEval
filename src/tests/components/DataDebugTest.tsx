import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import type { User, School, Division, Department } from '../types';

const DataDebugTest: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🆕 Loading data from clean slate - no mock data initialization');
      
      console.log('📡 Loading data from API...');
      const [usersData, schoolsData, divisionsData, departmentsData] = await Promise.all([
        api.users.list(),
        api.schools.list(),
        api.divisions.list(),
        api.departments.list()
      ]);

      console.log('📊 Data loaded:', {
        users: usersData.length,
        schools: schoolsData.length,
        divisions: divisionsData.length,
        departments: departmentsData.length
      });

      setUsers(usersData);
      setSchools(schoolsData);
      setDivisions(divisionsData);
      setDepartments(departmentsData);
      
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Data Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Structure Debug Test</h1>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-700">Users</h3>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-700">Schools</h3>
              <p className="text-2xl font-bold text-green-600">{schools.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-700">Divisions</h3>
              <p className="text-2xl font-bold text-purple-600">{divisions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-700">Departments</h3>
              <p className="text-2xl font-bold text-orange-600">{departments.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Users Data</h2>
            {users.length > 0 ? (
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={user.id} className="border border-gray-200 rounded p-3">
                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Email: {user.email}</p>
                      <p>Role: {user.primaryRole}</p>
                      <p>School ID: {user.schoolId}</p>
                      <p>Division ID: {user.divisionId}</p>
                      <p>Active: {user.isActive ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>

          {/* Schools */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Schools Data</h2>
            {schools.length > 0 ? (
              <div className="space-y-4">
                {schools.map((school, index) => (
                  <div key={school.id} className="border border-gray-200 rounded p-3">
                    <h3 className="font-medium">{school.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Type: {school.type}</p>
                      <p>Address: {school.address?.street}, {school.address?.city}</p>
                      <p>Grades: {school.grades.join(', ')}</p>
                      <p>Principal ID: {school.principalId}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No schools found</p>
            )}
          </div>

          {/* Divisions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Divisions Data</h2>
            {divisions.length > 0 ? (
              <div className="space-y-4">
                {divisions.map((division, index) => (
                  <div key={division.id} className="border border-gray-200 rounded p-3">
                    <h3 className="font-medium">{division.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>School ID: {division.schoolId}</p>
                      <p>Type: {division.type}</p>
                      <p>Grades: {division.grades.join(', ')}</p>
                      <p>Departments: {division.departments.length}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No divisions found</p>
            )}
          </div>

          {/* Departments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Departments Data</h2>
            {departments.length > 0 ? (
              <div className="space-y-4">
                {departments.map((department, index) => (
                  <div key={department.id} className="border border-gray-200 rounded p-3">
                    <h3 className="font-medium">{department.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>School ID: {department.schoolId}</p>
                      <p>Members: {department.members.length}</p>
                      <p>Subjects: {department.subjects.slice(0,3).join(', ')}...</p>
                      <p>Head ID: {department.headId}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No departments found</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={loadData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Reload Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataDebugTest;
