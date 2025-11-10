import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { api } from '../../api/api';
const DataDebugTest = () => {
    const [users, setUsers] = useState([]);
    const [schools, setSchools] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            console.error('❌ Error loading data:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-lg font-medium text-gray-900", children: "Loading data..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-red-600 mb-4", children: _jsx("svg", { className: "w-12 h-12 mx-auto", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "Data Loading Error" }), _jsx("p", { className: "text-gray-600 mb-4", children: error }), _jsx("button", { onClick: loadData, className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700", children: "Retry" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Data Structure Debug Test" }), _jsxs("div", { className: "grid grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Users" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: users.length })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Schools" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: schools.length })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Divisions" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: divisions.length })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "Departments" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: departments.length })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Users Data" }), users.length > 0 ? (_jsx("div", { className: "space-y-4", children: users.map((user, index) => (_jsxs("div", { className: "border border-gray-200 rounded p-3", children: [_jsxs("h3", { className: "font-medium", children: [user.firstName, " ", user.lastName] }), _jsxs("div", { className: "text-sm text-gray-600 mt-1", children: [_jsxs("p", { children: ["Email: ", user.email] }), _jsxs("p", { children: ["Role: ", user.primaryRole] }), _jsxs("p", { children: ["School ID: ", user.schoolId] }), _jsxs("p", { children: ["Division ID: ", user.divisionId] }), _jsxs("p", { children: ["Active: ", user.isActive ? 'Yes' : 'No'] })] })] }, user.id))) })) : (_jsx("p", { className: "text-gray-500", children: "No users found" }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Schools Data" }), schools.length > 0 ? (_jsx("div", { className: "space-y-4", children: schools.map((school, index) => (_jsxs("div", { className: "border border-gray-200 rounded p-3", children: [_jsx("h3", { className: "font-medium", children: school.name }), _jsxs("div", { className: "text-sm text-gray-600 mt-1", children: [_jsxs("p", { children: ["Type: ", school.type] }), _jsxs("p", { children: ["Address: ", school.address?.street, ", ", school.address?.city] }), _jsxs("p", { children: ["Grades: ", school.grades.join(', ')] }), _jsxs("p", { children: ["Principal ID: ", school.principalId] })] })] }, school.id))) })) : (_jsx("p", { className: "text-gray-500", children: "No schools found" }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Divisions Data" }), divisions.length > 0 ? (_jsx("div", { className: "space-y-4", children: divisions.map((division, index) => (_jsxs("div", { className: "border border-gray-200 rounded p-3", children: [_jsx("h3", { className: "font-medium", children: division.name }), _jsxs("div", { className: "text-sm text-gray-600 mt-1", children: [_jsxs("p", { children: ["School ID: ", division.schoolId] }), _jsxs("p", { children: ["Type: ", division.type] }), _jsxs("p", { children: ["Grades: ", division.grades.join(', ')] }), _jsxs("p", { children: ["Departments: ", division.departments.length] })] })] }, division.id))) })) : (_jsx("p", { className: "text-gray-500", children: "No divisions found" }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Departments Data" }), departments.length > 0 ? (_jsx("div", { className: "space-y-4", children: departments.map((department, index) => (_jsxs("div", { className: "border border-gray-200 rounded p-3", children: [_jsx("h3", { className: "font-medium", children: department.name }), _jsxs("div", { className: "text-sm text-gray-600 mt-1", children: [_jsxs("p", { children: ["School ID: ", department.schoolId] }), _jsxs("p", { children: ["Members: ", department.members.length] }), _jsxs("p", { children: ["Subjects: ", department.subjects.slice(0, 3).join(', '), "..."] }), _jsxs("p", { children: ["Head ID: ", department.headId] })] })] }, department.id))) })) : (_jsx("p", { className: "text-gray-500", children: "No departments found" }))] })] }), _jsx("div", { className: "mt-8", children: _jsx("button", { onClick: loadData, className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700", children: "Reload Data" }) })] }) }));
};
export default DataDebugTest;
