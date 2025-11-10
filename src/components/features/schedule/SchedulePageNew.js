import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '../../../stores/auth';
import { Calendar, Search, ChevronLeft, ChevronRight, MapPin, Users, Book, Eye, Plus, Filter, X } from 'lucide-react';
// Mock data - will be replaced with Firebase queries
const mockMasterSchedule = {
    id: 'ms1',
    schoolId: 'school1',
    name: '2024-2025 Master Schedule',
    academicYear: '2024-2025',
    scheduleType: 'traditional',
    dayTypes: [
        { id: 'monday', name: 'Monday', shortName: 'Mon', order: 1, color: '#3B82F6' },
        { id: 'tuesday', name: 'Tuesday', shortName: 'Tue', order: 2, color: '#10B981' },
        { id: 'wednesday', name: 'Wednesday', shortName: 'Wed', order: 3, color: '#F59E0B' },
        { id: 'thursday', name: 'Thursday', shortName: 'Thu', order: 4, color: '#EF4444' },
        { id: 'friday', name: 'Friday', shortName: 'Fri', order: 5, color: '#8B5CF6' }
    ],
    periods: [
        { id: 'p1', name: 'Period 1', shortName: 'P1', startTime: '08:00', endTime: '08:50', duration: 50, order: 1, type: 'class', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        { id: 'p2', name: 'Period 2', shortName: 'P2', startTime: '09:00', endTime: '09:50', duration: 50, order: 2, type: 'class', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        { id: 'p3', name: 'Period 3', shortName: 'P3', startTime: '10:00', endTime: '10:50', duration: 50, order: 3, type: 'class', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        { id: 'lunch', name: 'Lunch', shortName: 'L', startTime: '11:00', endTime: '11:45', duration: 45, order: 4, type: 'lunch', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        { id: 'p4', name: 'Period 4', shortName: 'P4', startTime: '11:50', endTime: '12:40', duration: 50, order: 5, type: 'class', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        { id: 'p5', name: 'Period 5', shortName: 'P5', startTime: '12:50', endTime: '13:40', duration: 50, order: 6, type: 'class', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        { id: 'p6', name: 'Period 6', shortName: 'P6', startTime: '13:50', endTime: '14:40', duration: 50, order: 7, type: 'class', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        { id: 'p7', name: 'Period 7', shortName: 'P7', startTime: '14:50', endTime: '15:40', duration: 50, order: 8, type: 'class', applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
    ],
    startDate: new Date('2024-08-01'),
    endDate: new Date('2025-05-31'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
};
const mockTeachers = [
    {
        id: '1',
        email: 'sarah.johnson@sas.edu.sg',
        firstName: 'Sarah',
        lastName: 'Johnson',
        displayName: 'Sarah Johnson',
        employeeId: 'EMP001',
        schoolId: 'school1',
        divisionId: 'high',
        departmentId: 'mathematics',
        primaryRole: 'educator',
        secondaryRoles: [],
        permissions: [],
        jobTitle: 'teacher',
        certifications: [],
        experience: '8 years',
        subjects: ['Mathematics', 'Algebra', 'Geometry'],
        grades: ['9', '10', '11'],
        specializations: ['AP Calculus'],
        scheduleId: 'sched1',
        planningPeriods: ['p2'],
        languages: ['English'],
        isActive: true,
        accountStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {}
    },
    {
        id: '2',
        email: 'michael.chen@sas.edu.sg',
        firstName: 'Michael',
        lastName: 'Chen',
        displayName: 'Michael Chen',
        employeeId: 'EMP002',
        schoolId: 'school1',
        divisionId: 'high',
        departmentId: 'science',
        primaryRole: 'educator',
        secondaryRoles: [],
        permissions: [],
        jobTitle: 'teacher',
        certifications: [],
        experience: '12 years',
        subjects: ['Biology', 'Chemistry'],
        grades: ['10', '11', '12'],
        specializations: ['AP Biology'],
        scheduleId: 'sched2',
        planningPeriods: ['p4'],
        languages: ['English', 'Mandarin'],
        isActive: true,
        accountStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {}
    }
];
const mockSchedules = {
    'sched1': {
        id: 'sched1',
        educatorId: '1',
        educatorName: 'Sarah Johnson',
        schoolId: 'school1',
        divisionId: 'high',
        masterScheduleId: 'ms1',
        academicYear: '2024-2025',
        classAssignments: [
            {
                id: 'class1',
                className: 'Algebra II - Period 1',
                courseName: 'Algebra II',
                courseCode: 'MATH201',
                subject: 'Mathematics',
                grade: '10',
                gradeLevel: ['10'],
                dayTypes: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                periods: ['p1'],
                roomNumber: '201',
                building: 'Main Building',
                studentCount: 24,
                maxCapacity: 28,
                coTeachers: [],
                paraprofessionals: [],
                isHonors: true,
                isAP: false,
                isIB: false,
                isSpecialEd: false,
                isESL: false,
                isInclusion: false,
                tags: ['honors', 'core'],
                isActive: true
            },
            {
                id: 'class2',
                className: 'Geometry - Period 3',
                courseName: 'Geometry',
                courseCode: 'MATH301',
                subject: 'Mathematics',
                grade: '9',
                gradeLevel: ['9'],
                dayTypes: ['monday', 'wednesday', 'friday'],
                periods: ['p3'],
                roomNumber: '201',
                building: 'Main Building',
                studentCount: 22,
                maxCapacity: 28,
                coTeachers: [],
                paraprofessionals: [],
                isHonors: false,
                isAP: false,
                isIB: false,
                isSpecialEd: false,
                isESL: false,
                isInclusion: false,
                tags: ['core'],
                isActive: true
            },
            {
                id: 'class3',
                className: 'AP Calculus AB - Period 5',
                courseName: 'AP Calculus AB',
                courseCode: 'MATH501',
                subject: 'Mathematics',
                grade: '11',
                gradeLevel: ['11', '12'],
                dayTypes: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                periods: ['p5'],
                roomNumber: '201',
                building: 'Main Building',
                studentCount: 18,
                maxCapacity: 28,
                coTeachers: [],
                paraprofessionals: [],
                isHonors: false,
                isAP: true,
                isIB: false,
                isSpecialEd: false,
                isESL: false,
                isInclusion: false,
                tags: ['ap', 'advanced'],
                isActive: true
            },
            {
                id: 'class4',
                className: 'Algebra I - Period 6',
                courseName: 'Algebra I',
                courseCode: 'MATH101',
                subject: 'Mathematics',
                grade: '9',
                gradeLevel: ['9'],
                dayTypes: ['tuesday', 'thursday'],
                periods: ['p6'],
                roomNumber: '201',
                building: 'Main Building',
                studentCount: 26,
                maxCapacity: 28,
                coTeachers: [],
                paraprofessionals: [],
                isHonors: false,
                isAP: false,
                isIB: false,
                isSpecialEd: false,
                isESL: false,
                isInclusion: false,
                tags: ['core'],
                isActive: true
            }
        ],
        totalPeriods: 8,
        teachingPeriods: 5,
        planningPeriods: 1,
        teachingLoad: 0.75,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2025-05-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    'sched2': {
        id: 'sched2',
        educatorId: '2',
        educatorName: 'Michael Chen',
        schoolId: 'school1',
        divisionId: 'high',
        masterScheduleId: 'ms1',
        academicYear: '2024-2025',
        classAssignments: [
            {
                id: 'class5',
                className: 'Biology I - Period 1',
                courseName: 'Biology I',
                courseCode: 'SCI201',
                subject: 'Science',
                grade: '9',
                gradeLevel: ['9'],
                dayTypes: ['monday', 'wednesday', 'friday'],
                periods: ['p1'],
                roomNumber: 'Lab 101',
                building: 'Science Wing',
                studentCount: 20,
                maxCapacity: 24,
                coTeachers: [],
                paraprofessionals: [],
                isHonors: false,
                isAP: false,
                isIB: false,
                isSpecialEd: false,
                isESL: false,
                isInclusion: false,
                tags: ['core', 'lab'],
                isActive: true
            },
            {
                id: 'class6',
                className: 'AP Biology - Period 3',
                courseName: 'AP Biology',
                courseCode: 'SCI501',
                subject: 'Science',
                grade: '11',
                gradeLevel: ['11', '12'],
                dayTypes: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                periods: ['p3'],
                roomNumber: 'Lab 102',
                building: 'Science Wing',
                studentCount: 16,
                maxCapacity: 20,
                coTeachers: [],
                paraprofessionals: [],
                isHonors: false,
                isAP: true,
                isIB: false,
                isSpecialEd: false,
                isESL: false,
                isInclusion: false,
                tags: ['ap', 'advanced', 'lab'],
                isActive: true
            },
            {
                id: 'class7',
                className: 'Chemistry - Period 6',
                courseName: 'Chemistry',
                courseCode: 'SCI301',
                subject: 'Science',
                grade: '10',
                gradeLevel: ['10'],
                dayTypes: ['tuesday', 'thursday'],
                periods: ['p6'],
                roomNumber: 'Lab 103',
                building: 'Science Wing',
                studentCount: 22,
                maxCapacity: 24,
                coTeachers: [],
                paraprofessionals: [],
                isHonors: false,
                isAP: false,
                isIB: false,
                isSpecialEd: false,
                isESL: false,
                isInclusion: false,
                tags: ['core', 'lab'],
                isActive: true
            }
        ],
        totalPeriods: 8,
        teachingPeriods: 5,
        planningPeriods: 1,
        teachingLoad: 0.75,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2025-05-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
};
const SchedulePageNew = () => {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [viewMode, setViewMode] = useState('search');
    const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
    // Check if user is an observer
    const isObserver = user?.primaryRole === 'observer' || user?.secondaryRoles.includes('observer');
    // Filter teachers based on search
    const filteredTeachers = mockTeachers.filter(teacher => teacher.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        teacher.departmentId?.toLowerCase().includes(searchTerm.toLowerCase()));
    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    }
    function formatWeekRange(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 4); // Friday
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    function nextWeek() {
        const nextStart = new Date(currentWeekStart);
        nextStart.setDate(nextStart.getDate() + 7);
        setCurrentWeekStart(nextStart);
    }
    function previousWeek() {
        const prevStart = new Date(currentWeekStart);
        prevStart.setDate(prevStart.getDate() - 7);
        setCurrentWeekStart(prevStart);
    }
    function handleViewSchedule(teacher) {
        setSelectedTeacher(teacher);
        setViewMode('schedule');
    }
    function handleBookObservation(classAssignment) {
        setSelectedClass(classAssignment);
        setShowBookingModal(true);
    }
    function getClassForPeriodAndDay(schedule, periodId, dayTypeId) {
        return schedule.classAssignments.find(c => c.periods.includes(periodId) && c.dayTypes.includes(dayTypeId) && c.isActive) || null;
    }
    function renderScheduleGrid() {
        if (!selectedTeacher)
            return null;
        const schedule = mockSchedules[selectedTeacher.scheduleId || ''];
        if (!schedule) {
            return (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx(Calendar, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No schedule found for this teacher" })] }));
        }
        return (_jsx("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40", children: "Period / Time" }), mockMasterSchedule.dayTypes.map((dayType) => (_jsx("th", { className: "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: dayType.shortName }), _jsx("div", { className: "text-gray-400 font-normal", children: dayType.name })] }) }, dayType.id)))] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: mockMasterSchedule.periods.map((period) => (_jsxs("tr", { className: period.type === 'lunch' ? 'bg-gray-50' : '', children: [_jsxs("td", { className: "px-4 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: period.name }), _jsxs("div", { className: "text-xs text-gray-500", children: [period.startTime, " - ", period.endTime] })] }), mockMasterSchedule.dayTypes.map((dayType) => {
                                        const classItem = getClassForPeriodAndDay(schedule, period.id, dayType.id);
                                        if (period.type === 'lunch') {
                                            return (_jsx("td", { className: "px-4 py-4 text-center text-sm text-gray-400", children: "Lunch Break" }, `${period.id}-${dayType.id}`));
                                        }
                                        if (!classItem) {
                                            return (_jsx("td", { className: "px-4 py-4 text-center", children: _jsx("div", { className: "text-gray-400 text-xs", children: "Free Period" }) }, `${period.id}-${dayType.id}`));
                                        }
                                        return (_jsx("td", { className: "px-4 py-4", children: _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors", children: [_jsx("div", { className: "flex items-start justify-between mb-2", children: _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sm text-gray-900 mb-1", children: classItem.courseName }), classItem.isAP && (_jsx("span", { className: "inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded mr-1", children: "AP" })), classItem.isHonors && (_jsx("span", { className: "inline-block px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded", children: "Honors" }))] }) }), _jsxs("div", { className: "space-y-1 text-xs text-gray-600", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "w-3 h-3 mr-1" }), classItem.roomNumber] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "w-3 h-3 mr-1" }), classItem.studentCount, " students"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Book, { className: "w-3 h-3 mr-1" }), "Grade ", classItem.grade] })] }), isObserver && (_jsxs("button", { onClick: () => handleBookObservation(classItem), className: "mt-3 w-full bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 flex items-center justify-center", children: [_jsx(Plus, { className: "w-3 h-3 mr-1" }), "Book Observation"] }))] }) }, `${period.id}-${dayType.id}`));
                                    })] }, period.id))) })] }) }) }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: viewMode === 'search' ? 'Teacher Schedules' : `${selectedTeacher?.displayName}'s Schedule` }), _jsx("p", { className: "text-gray-600 mt-1", children: isObserver
                                    ? 'View teacher schedules and book observations'
                                    : 'View teaching schedules and class information' })] }), viewMode === 'schedule' && (_jsxs("button", { onClick: () => setViewMode('search'), className: "bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center space-x-2", children: [_jsx(X, { className: "w-4 h-4" }), _jsx("span", { children: "Back to Search" })] }))] }), viewMode === 'search' ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search by teacher name, subject, or department...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("button", { className: "flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50", children: [_jsx(Filter, { className: "w-4 h-4" }), _jsx("span", { className: "font-medium", children: "Filters" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredTeachers.map((teacher) => {
                            const schedule = mockSchedules[teacher.scheduleId || ''];
                            return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: _jsxs("span", { className: "text-blue-600 font-semibold text-lg", children: [teacher.firstName[0], teacher.lastName[0]] }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: teacher.displayName }), _jsx("p", { className: "text-sm text-gray-500 capitalize", children: teacher.departmentId })] })] }) }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-start text-sm", children: [_jsx(Book, { className: "w-4 h-4 text-gray-400 mr-2 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Subjects" }), _jsx("p", { className: "text-gray-900", children: teacher.subjects.join(', ') })] })] }), _jsxs("div", { className: "flex items-start text-sm", children: [_jsx(Users, { className: "w-4 h-4 text-gray-400 mr-2 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Grades" }), _jsx("p", { className: "text-gray-900", children: teacher.grades.join(', ') })] })] }), schedule && (_jsxs("div", { className: "flex items-start text-sm", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-400 mr-2 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Teaching Load" }), _jsxs("p", { className: "text-gray-900", children: [schedule.teachingPeriods, " periods (", Math.round(schedule.teachingLoad * 100), "%)"] })] })] }))] }), _jsxs("button", { onClick: () => handleViewSchedule(teacher), className: "w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2", children: [_jsx(Eye, { className: "w-4 h-4" }), _jsx("span", { children: "View Schedule" })] })] }, teacher.id));
                        }) }), filteredTeachers.length === 0 && (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx(Search, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No teachers found matching your search" })] }))] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("button", { onClick: previousWeek, className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsxs("h2", { className: "text-lg font-semibold", children: ["Week of ", formatWeekRange(currentWeekStart)] }), _jsx("button", { onClick: nextWeek, className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(ChevronRight, { className: "w-5 h-5" }) })] }) }), selectedTeacher && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center", children: _jsxs("span", { className: "text-blue-700 font-bold text-xl", children: [selectedTeacher.firstName[0], selectedTeacher.lastName[0]] }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: selectedTeacher.displayName }), _jsxs("p", { className: "text-gray-600 capitalize", children: [selectedTeacher.departmentId, " Department"] }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-sm text-gray-600", children: [_jsxs("span", { children: ["\uD83D\uDCDA ", selectedTeacher.subjects.join(', ')] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["\uD83D\uDC65 Grades ", selectedTeacher.grades.join(', ')] })] })] })] }) }) })), renderScheduleGrid()] })), showBookingModal && selectedClass && selectedTeacher && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Book Observation" }), _jsx("button", { onClick: () => setShowBookingModal(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-6 h-6" }) })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Teacher" }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsx("p", { className: "font-medium text-gray-900", children: selectedTeacher.displayName }), _jsxs("p", { className: "text-sm text-gray-600 capitalize", children: [selectedTeacher.departmentId, " Department"] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Class Details" }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Course:" }), _jsxs("span", { className: "font-medium text-gray-900", children: [selectedClass.courseName, " (", selectedClass.courseCode, ")"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Subject:" }), _jsx("span", { className: "font-medium text-gray-900", children: selectedClass.subject })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Grade:" }), _jsxs("span", { className: "font-medium text-gray-900", children: ["Grade ", selectedClass.grade] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Room:" }), _jsxs("span", { className: "font-medium text-gray-900", children: [selectedClass.roomNumber, ", ", selectedClass.building] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Students:" }), _jsxs("span", { className: "font-medium text-gray-900", children: [selectedClass.studentCount, " students"] })] }), (selectedClass.isAP || selectedClass.isHonors) && (_jsxs("div", { className: "flex items-center space-x-2 pt-2", children: [selectedClass.isAP && (_jsx("span", { className: "px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded", children: "AP" })), selectedClass.isHonors && (_jsx("span", { className: "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded", children: "Honors" }))] }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Date" }), _jsx("input", { type: "date", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Observation Type" }), _jsxs("select", { className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { children: "Formal Observation" }), _jsx("option", { children: "Informal Walk-through" }), _jsx("option", { children: "CRP Observation" }), _jsx("option", { children: "Peer Observation" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notes (Optional)" }), _jsx("textarea", { rows: 3, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Add any notes about this observation..." })] })] }), _jsxs("div", { className: "p-6 border-t border-gray-200 flex items-center justify-end space-x-3", children: [_jsx("button", { onClick: () => setShowBookingModal(false), className: "px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsx("button", { onClick: () => {
                                        // TODO: Implement observation booking
                                        alert('Observation booked! (This will be connected to Firebase)');
                                        setShowBookingModal(false);
                                    }, className: "px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700", children: "Book Observation" })] })] }) }))] }));
};
export default SchedulePageNew;
