import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/auth';
import { useEducatorSchedule } from '../../../hooks/useFirestore';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Book,
  Loader2
} from 'lucide-react';
import type { ClassAssignment } from '../../../types';

const SchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch the educator's schedule from Firestore
  const { data: schedule, isLoading, error } = useEducatorSchedule(user?.id);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'];

  // Get class for a specific day and period
  const getClassForSlot = (day: string, period: string): ClassAssignment | undefined => {
    if (!schedule?.classAssignments) return undefined;

    return schedule.classAssignments.find(assignment => {
      const dayMatches = assignment.dayTypes?.includes(day) ||
                        assignment.dayTypes?.includes(day.substring(0, 3)); // Mon, Tue, etc.
      const periodMatches = assignment.periods?.includes(period) ||
                           assignment.periods?.includes(period.replace('Period ', ''));
      return dayMatches && periodMatches;
    });
  };

  // Navigate weeks
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  // Get start of week (Monday)
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
              <p className="text-gray-600">View and manage your teaching schedule</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                This Week
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold">
                Week of {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              {schedule && (
                <p className="text-sm text-gray-500">
                  {schedule.academicYear} {schedule.semester ? `• ${schedule.semester}` : ''}
                </p>
              )}
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-sas-blue-600 mr-3" />
            <span className="text-gray-600">Loading schedule...</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-red-500 mb-2">Failed to load schedule</div>
            <p className="text-sm text-gray-500">Please try again later</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Period
                    </th>
                    {daysOfWeek.map((day) => (
                      <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {periods.map((period) => (
                    <tr key={period}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {period}
                      </td>
                      {daysOfWeek.map((day) => {
                        const classAssignment = getClassForSlot(day, period);
                        return (
                          <td key={`${period}-${day}`} className="px-4 py-4 text-sm">
                            {classAssignment ? (
                              <div className="bg-sas-blue-50 border border-sas-blue-200 rounded-lg p-2 text-left min-w-[140px]">
                                <div className="font-medium text-sas-blue-900 text-sm">
                                  {classAssignment.courseName || classAssignment.className}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-sas-blue-700 mt-1">
                                  <Book className="w-3 h-3" />
                                  <span>{classAssignment.subject}</span>
                                </div>
                                {classAssignment.roomNumber && (
                                  <div className="flex items-center gap-1 text-xs text-sas-blue-600 mt-0.5">
                                    <MapPin className="w-3 h-3" />
                                    <span>Room {classAssignment.roomNumber}</span>
                                  </div>
                                )}
                                {classAssignment.gradeLevel && classAssignment.gradeLevel.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-sas-blue-600 mt-0.5">
                                    <Users className="w-3 h-3" />
                                    <span>Grade {classAssignment.gradeLevel.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center text-gray-400">
                                <Clock className="w-6 h-6 mx-auto mb-1 opacity-30" />
                                <p className="text-xs">Free</p>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Box - Show different content based on schedule state */}
        {!schedule && !isLoading && (
          <div className="mt-6 bg-sas-navy-50 border border-sas-navy-200 rounded-lg p-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-sas-navy-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-sas-navy-900">No Schedule Found</h3>
                <p className="text-sm text-sas-navy-700 mt-1">
                  Your teaching schedule hasn't been set up yet. Contact your administrator to import your schedule.
                </p>
                <ul className="mt-2 text-sm text-sas-navy-700 list-disc list-inside space-y-1">
                  <li>Once imported, you'll see your complete teaching schedule</li>
                  <li>Class details will auto-populate in observation forms</li>
                  <li>Observers can see when you're available for observations</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {schedule && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-900">Schedule Overview</h3>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Teaching Load:</span>
                    <div className="font-medium text-green-900">{schedule.teachingLoad || 0}%</div>
                  </div>
                  <div>
                    <span className="text-green-700">Teaching Periods:</span>
                    <div className="font-medium text-green-900">{schedule.teachingPeriods || 0}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Planning Periods:</span>
                    <div className="font-medium text-green-900">{schedule.planningPeriods || 0}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Total Classes:</span>
                    <div className="font-medium text-green-900">{schedule.classAssignments?.length || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
