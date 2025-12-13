import { useState } from 'react';
import {
  Calendar,
  X,
  Search,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import { useTeachers, useObservationsBySchool, useCreateObservation, useDeleteObservation } from '../../../hooks/useFirestore';
import { useAuthStore } from '../../../stores/auth';
import type { User as Teacher } from '../../../types';

export default function ObservationScheduler() {
  const { user } = useAuthStore();
  const [selectedView, setSelectedView] = useState<'schedule' | 'create' | 'edit'>('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedTeacher, _setSelectedTeacher] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from Firestore
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers(user?.schoolId);
  const { data: observations = [], isLoading: observationsLoading } = useObservationsBySchool(user?.schoolId);
  const createObservationMutation = useCreateObservation();
  const deleteObservationMutation = useDeleteObservation();

  // Filter scheduled observations for selected date
  const scheduledObservations = observations.filter(obs => {
    if (!obs.context?.date) return false;
    const obsDate = new Date(obs.context.date).toISOString().split('T')[0];
    return obsDate === selectedDate;
  });

  const [newObservation, setNewObservation] = useState({
    teacherId: '',
    date: '',
    period: '',
    time: '',
    class: '',
    notes: '',
    framework: 'CRP + All Frameworks',
    duration: 15,
    priority: 'normal'
  });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    teacher.grades.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAvailabilityColor = (teacher: Teacher) => {
    // Calculate based on last observation
    const teacherObs = observations.filter(obs => obs.subjectId === teacher.id);
    if (teacherObs.length === 0) return 'bg-green-100 text-green-800';

    const latestObs = teacherObs.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const daysSince = Math.floor((Date.now() - new Date(latestObs.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince > 60) return 'bg-red-100 text-red-800'; // Low - overdue
    if (daysSince > 30) return 'bg-yellow-100 text-yellow-800'; // Medium
    return 'bg-green-100 text-green-800'; // High - recent
  };

  const getAvailabilityText = (teacher: Teacher) => {
    const teacherObs = observations.filter(obs => obs.subjectId === teacher.id);
    if (teacherObs.length === 0) return 'High - Ready for observation';

    const latestObs = teacherObs.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const daysSince = Math.floor((Date.now() - new Date(latestObs.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince > 60) return 'Low - Overdue for observation';
    if (daysSince > 30) return 'Medium - Recent observation';
    return 'High - Recently observed';
  };

  const handleScheduleObservation = async () => {
    if (!newObservation.teacherId || !newObservation.date) {
      alert('Please select a teacher and date');
      return;
    }

    const teacher = teachers.find(t => t.id === newObservation.teacherId);
    if (!teacher || !user) return;

    try {
      await createObservationMutation.mutateAsync({
        schoolId: user.schoolId,
        divisionId: user.divisionId,
        departmentId: user.departmentIds?.[0],
        subjectId: newObservation.teacherId,
        subjectName: teacher.displayName,
        observerId: user.id,
        observerName: user.displayName,
        frameworkId: 'crp-framework-001',
        frameworkName: newObservation.framework,
        frameworkVersion: '1.0',
        responses: [],
        overallComments: newObservation.notes,
        evidenceCount: 0,
        totalQuestions: 10,
        evidencePercentage: 0,
        frameworkScores: [],
        // CRP-specific fields
        crpEvidenceCount: 0,
        totalLookFors: 0,
        crpPercentage: 0,
        strengths: [],
        growthAreas: [],
        // Media and evidence
        attachments: [],
        // Follow-up
        followUpRequired: false,
        followUpCompleted: false,
        status: 'draft', // Start as draft, will be marked as scheduled via metadata
        context: {
          type: 'classroom',
          className: newObservation.class || 'TBD',
          subject: teacher.subjects[0] || 'Unknown',
          grade: teacher.grades[0] || 'Unknown',
          date: new Date(newObservation.date),
          startTime: new Date(newObservation.date),
          duration: newObservation.duration,
        },
        version: 1,
        metadata: { priority: newObservation.priority, scheduled: true }
      });

      alert('Observation scheduled successfully!');
      setNewObservation({
        teacherId: '',
        date: '',
        period: '',
        time: '',
        class: '',
        notes: '',
        framework: 'CRP + All Frameworks',
        duration: 15,
        priority: 'normal'
      });
      setSelectedView('schedule');
    } catch (error) {
      console.error('Error scheduling observation:', error);
      alert('Failed to schedule observation');
    }
  };

  const cancelObservation = async (observationId: string) => {
    if (!confirm('Are you sure you want to cancel this observation?')) return;

    try {
      await deleteObservationMutation.mutateAsync(observationId);
      alert('Observation cancelled');
    } catch (error) {
      console.error('Error cancelling observation:', error);
      alert('Failed to cancel observation');
    }
  };

  const startObservation = (observationId: string) => {
    // TODO: Navigate to observation form
    alert(`Starting observation ${observationId} - This will open the observation form`);
  };

  if (teachersLoading || observationsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sas-blue-600" />
        <p className="ml-3 text-gray-600">Loading observation scheduler...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Observation Scheduler</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and schedule classroom observations • Connected to Firestore</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedView('schedule')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === 'schedule'
                ? 'bg-sas-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Schedule View
          </button>
          <button
            onClick={() => setSelectedView('create')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === 'create'
                ? 'bg-sas-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Schedule New
          </button>
        </div>
      </div>

      {/* Schedule View */}
      {selectedView === 'schedule' && (
        <div className="space-y-6">
          {/* Date Filter */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Teachers</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, subject, or grade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled Observations for Selected Date */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Scheduled for {new Date(selectedDate).toLocaleDateString()}
              </h2>
            </div>
            <div className="p-6">
              {scheduledObservations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No observations scheduled</h3>
                  <p className="text-gray-500 mb-4">Schedule your first observation for this date</p>
                  <button
                    onClick={() => setSelectedView('create')}
                    className="bg-sas-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-sas-blue-700 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Observation</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduledObservations.map((obs) => (
                    <div key={obs.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{obs.subjectName}</h3>
                            <span className="px-2 py-1 bg-sas-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                              {obs.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Subject:</span> {obs.context.subject}
                            </div>
                            <div>
                              <span className="font-medium">Grade:</span> {obs.context.grade}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {obs.context.duration} min
                            </div>
                            <div>
                              <span className="font-medium">Observer:</span> {obs.observerName}
                            </div>
                          </div>
                          {obs.overallComments && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Notes:</span> {obs.overallComments}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => startObservation(obs.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                          >
                            Start Observation
                          </button>
                          <button
                            onClick={() => cancelObservation(obs.id)}
                            className="text-red-600 hover:text-red-900 p-2"
                            title="Cancel Observation"
                            disabled={deleteObservationMutation.isPending}
                          >
                            {deleteObservationMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Teacher Availability Overview */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Teacher Availability</h2>
            </div>
            <div className="p-6">
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No teachers found. Check your Firebase connection or add teachers to the database.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{teacher.displayName}</h3>
                          <p className="text-sm text-gray-600">{teacher.subjects.join(', ')}</p>
                          <p className="text-sm text-gray-500">Grades {teacher.grades.join(', ')}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(teacher)}`}>
                          AVAILABLE
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        {getAvailabilityText(teacher)}
                      </p>
                      <button
                        onClick={() => {
                          setNewObservation({...newObservation, teacherId: teacher.id});
                          setSelectedView('create');
                        }}
                        className="w-full bg-sas-blue-600 text-white px-4 py-2 rounded-lg hover:bg-sas-blue-700 text-sm font-medium"
                      >
                        Schedule Observation
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create New Observation */}
      {selectedView === 'create' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Schedule New Observation</h2>
              <button
                onClick={() => setSelectedView('schedule')}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teacher Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher *</label>
                <select
                  value={newObservation.teacherId}
                  onChange={(e) => setNewObservation({...newObservation, teacherId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                >
                  <option value="">Select a teacher...</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.displayName} - {teacher.subjects.join(', ')} (Grades {teacher.grades.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={newObservation.date}
                  onChange={(e) => setNewObservation({...newObservation, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Framework Focus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Framework Focus</label>
                <select
                  value={newObservation.framework}
                  onChange={(e) => setNewObservation({...newObservation, framework: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                >
                  <option value="CRP + All Frameworks">CRP + All Frameworks (Standard)</option>
                  <option value="CRP Focus">CRP Focus Only</option>
                  <option value="Tripod 7Cs">Tripod 7Cs Focus</option>
                  <option value="CASEL + SEL">CASEL + SEL Focus</option>
                  <option value="5 Daily Assessment">5 Daily Assessment Focus</option>
                  <option value="Inclusive Practices">Inclusive Practices Focus</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select
                  value={newObservation.duration}
                  onChange={(e) => setNewObservation({...newObservation, duration: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                >
                  <option value={10}>10 minutes (Quick Check)</option>
                  <option value={15}>15 minutes (Standard)</option>
                  <option value={20}>20 minutes (Extended)</option>
                  <option value={30}>30 minutes (Full Period)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Observation Notes</label>
              <textarea
                value={newObservation.notes}
                onChange={(e) => setNewObservation({...newObservation, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent h-24 resize-none"
                placeholder="Optional notes about focus areas, special considerations, or goals for this observation..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedView('schedule')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleObservation}
                disabled={createObservationMutation.isPending}
                className="px-6 py-2 bg-sas-blue-600 text-white rounded-lg hover:bg-sas-blue-700 font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                {createObservationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Observation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
