import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/auth';
import type { User, EducatorSchedule, ClassAssignment, Period, DayType } from '../../../types';
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Book,
  Eye,
  Plus,
  Filter,
  X
} from 'lucide-react';

// Mock data - will be replaced with Firebase queries
const mockMasterSchedule = {
  id: 'ms1',
  schoolId: 'school1',
  name: '2024-2025 Master Schedule',
  academicYear: '2024-2025',
  scheduleType: 'traditional' as const,
  dayTypes: [
    { id: 'monday', name: 'Monday', shortName: 'Mon', order: 1, color: '#3B82F6' },
    { id: 'tuesday', name: 'Tuesday', shortName: 'Tue', order: 2, color: '#10B981' },
    { id: 'wednesday', name: 'Wednesday', shortName: 'Wed', order: 3, color: '#F59E0B' },
    { id: 'thursday', name: 'Thursday', shortName: 'Thu', order: 4, color: '#EF4444' },
    { id: 'friday', name: 'Friday', shortName: 'Fri', order: 5, color: '#8B5CF6' }
  ] as DayType[],
  periods: [
    { id: 'p1', name: 'Period 1', shortName: 'P1', startTime: '08:00', endTime: '08:50', duration: 50, order: 1, type: 'class' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'p2', name: 'Period 2', shortName: 'P2', startTime: '09:00', endTime: '09:50', duration: 50, order: 2, type: 'class' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'p3', name: 'Period 3', shortName: 'P3', startTime: '10:00', endTime: '10:50', duration: 50, order: 3, type: 'class' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'lunch', name: 'Lunch', shortName: 'L', startTime: '11:00', endTime: '11:45', duration: 45, order: 4, type: 'lunch' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'p4', name: 'Period 4', shortName: 'P4', startTime: '11:50', endTime: '12:40', duration: 50, order: 5, type: 'class' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'p5', name: 'Period 5', shortName: 'P5', startTime: '12:50', endTime: '13:40', duration: 50, order: 6, type: 'class' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'p6', name: 'Period 6', shortName: 'P6', startTime: '13:50', endTime: '14:40', duration: 50, order: 7, type: 'class' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    { id: 'p7', name: 'Period 7', shortName: 'P7', startTime: '14:50', endTime: '15:40', duration: 50, order: 8, type: 'class' as const, applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
  ] as Period[],
  startDate: new Date('2024-08-01'),
  endDate: new Date('2025-05-31'),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockTeachers: User[] = [
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

const mockSchedules: Record<string, EducatorSchedule> = {
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

interface SchedulePageNewProps {}

const SchedulePageNew: React.FC<SchedulePageNewProps> = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassAssignment | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [viewMode, setViewMode] = useState<'search' | 'schedule'>('search');
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));

  // Check if user is an observer
  const isObserver = user?.primaryRole === 'observer' || user?.secondaryRoles.includes('observer');

  // Filter teachers based on search
  const filteredTeachers = mockTeachers.filter(teacher =>
    teacher.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    teacher.departmentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  function formatWeekRange(startDate: Date): string {
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

  function handleViewSchedule(teacher: User) {
    setSelectedTeacher(teacher);
    setViewMode('schedule');
  }

  function handleBookObservation(classAssignment: ClassAssignment) {
    setSelectedClass(classAssignment);
    setShowBookingModal(true);
  }

  function getClassForPeriodAndDay(schedule: EducatorSchedule, periodId: string, dayTypeId: string): ClassAssignment | null {
    return schedule.classAssignments.find(
      c => c.periods.includes(periodId) && c.dayTypes.includes(dayTypeId) && c.isActive
    ) || null;
  }

  function renderScheduleGrid() {
    if (!selectedTeacher) return null;

    const schedule = mockSchedules[selectedTeacher.scheduleId || ''];
    if (!schedule) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No schedule found for this teacher</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Period / Time
                </th>
                {mockMasterSchedule.dayTypes.map((dayType) => (
                  <th key={dayType.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div>
                      <div className="font-semibold">{dayType.shortName}</div>
                      <div className="text-gray-400 font-normal">{dayType.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMasterSchedule.periods.map((period) => (
                <tr key={period.id} className={period.type === 'lunch' ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{period.name}</div>
                    <div className="text-xs text-gray-500">{period.startTime} - {period.endTime}</div>
                  </td>
                  {mockMasterSchedule.dayTypes.map((dayType) => {
                    const classItem = getClassForPeriodAndDay(schedule, period.id, dayType.id);

                    if (period.type === 'lunch') {
                      return (
                        <td key={`${period.id}-${dayType.id}`} className="px-4 py-4 text-center text-sm text-gray-400">
                          Lunch Break
                        </td>
                      );
                    }

                    if (!classItem) {
                      return (
                        <td key={`${period.id}-${dayType.id}`} className="px-4 py-4 text-center">
                          <div className="text-gray-400 text-xs">Free Period</div>
                        </td>
                      );
                    }

                    return (
                      <td key={`${period.id}-${dayType.id}`} className="px-4 py-4">
                        <div className="bg-sas-navy-50 border border-sas-navy-200 rounded-lg p-3 hover:bg-sas-navy-100 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900 mb-1">
                                {classItem.courseName}
                              </div>
                              {classItem.isAP && (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded mr-1">
                                  AP
                                </span>
                              )}
                              {classItem.isHonors && (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                  Honors
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {classItem.roomNumber}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {classItem.studentCount} students
                            </div>
                            <div className="flex items-center">
                              <Book className="w-3 h-3 mr-1" />
                              Grade {classItem.grade}
                            </div>
                          </div>
                          {isObserver && (
                            <button
                              onClick={() => handleBookObservation(classItem)}
                              className="mt-3 w-full bg-sas-navy-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-sas-navy-700 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Book Observation
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {viewMode === 'search' ? 'Teacher Schedules' : `${selectedTeacher?.displayName}'s Schedule`}
          </h1>
          <p className="text-gray-600 mt-1">
            {isObserver
              ? 'View teacher schedules and book observations'
              : 'View teaching schedules and class information'}
          </p>
        </div>
        {viewMode === 'schedule' && (
          <button
            onClick={() => setViewMode('search')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Back to Search</span>
          </button>
        )}
      </div>

      {viewMode === 'search' ? (
        <>
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by teacher name, subject, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>

          {/* Teachers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => {
              const schedule = mockSchedules[teacher.scheduleId || ''];
              return (
                <div key={teacher.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-sas-navy-100 rounded-full flex items-center justify-center">
                        <span className="text-sas-navy-600 font-semibold text-lg">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{teacher.displayName}</h3>
                        <p className="text-sm text-gray-500 capitalize">{teacher.departmentId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm">
                      <Book className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-gray-600">Subjects</p>
                        <p className="text-gray-900">{teacher.subjects.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-start text-sm">
                      <Users className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-gray-600">Grades</p>
                        <p className="text-gray-900">{teacher.grades.join(', ')}</p>
                      </div>
                    </div>
                    {schedule && (
                      <div className="flex items-start text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Teaching Load</p>
                          <p className="text-gray-900">
                            {schedule.teachingPeriods} periods ({Math.round(schedule.teachingLoad * 100)}%)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleViewSchedule(teacher)}
                    className="w-full bg-sas-navy-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sas-navy-700 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Schedule</span>
                  </button>
                </div>
              );
            })}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No teachers found matching your search</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Week Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={previousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">
                Week of {formatWeekRange(currentWeekStart)}
              </h2>
              <button
                onClick={nextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Teacher Info Card */}
          {selectedTeacher && (
            <div className="bg-sas-navy-50 border border-sas-navy-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-sas-navy-200 rounded-full flex items-center justify-center">
                    <span className="text-sas-navy-700 font-bold text-xl">
                      {selectedTeacher.firstName[0]}{selectedTeacher.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedTeacher.displayName}</h2>
                    <p className="text-gray-600 capitalize">{selectedTeacher.departmentId} Department</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>📚 {selectedTeacher.subjects.join(', ')}</span>
                      <span>•</span>
                      <span>👥 Grades {selectedTeacher.grades.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Grid */}
          {renderScheduleGrid()}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedClass && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Book Observation</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Teacher Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedTeacher.displayName}</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedTeacher.departmentId} Department</p>
                </div>
              </div>

              {/* Class Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Details</label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium text-gray-900">{selectedClass.courseName} ({selectedClass.courseCode})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium text-gray-900">{selectedClass.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium text-gray-900">Grade {selectedClass.grade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium text-gray-900">{selectedClass.roomNumber}, {selectedClass.building}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium text-gray-900">{selectedClass.studentCount} students</span>
                  </div>
                  {(selectedClass.isAP || selectedClass.isHonors) && (
                    <div className="flex items-center space-x-2 pt-2">
                      {selectedClass.isAP && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">AP</span>
                      )}
                      {selectedClass.isHonors && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Honors</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observation Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent">
                  <option>Formal Observation</option>
                  <option>Informal Walk-through</option>
                  <option>CRP Observation</option>
                  <option>Peer Observation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                  placeholder="Add any notes about this observation..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement observation booking
                  alert('Observation booked! (This will be connected to Firebase)');
                  setShowBookingModal(false);
                }}
                className="px-6 py-2 bg-sas-navy-600 text-white rounded-lg font-medium hover:bg-sas-navy-700"
              >
                Book Observation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePageNew;
