import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/auth';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Book
} from 'lucide-react';

const SchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'];

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
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">
              Week of {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
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
                    {daysOfWeek.map((day) => (
                      <td key={`${period}-${day}`} className="px-4 py-4 text-sm text-gray-500">
                        <div className="text-center text-gray-400">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">No class</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-sas-navy-50 border border-sas-navy-200 rounded-lg p-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-sas-navy-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-sas-navy-900">Schedule System Coming Soon</h3>
              <p className="text-sm text-sas-navy-700 mt-1">
                The schedule system is currently being developed. Once complete, you'll be able to:
              </p>
              <ul className="mt-2 text-sm text-sas-navy-700 list-disc list-inside space-y-1">
                <li>View your complete teaching schedule</li>
                <li>Auto-populate observation forms with class details</li>
                <li>Schedule observations based on teacher availability</li>
                <li>Sync with school calendar systems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
