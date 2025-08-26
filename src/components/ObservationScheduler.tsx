import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  User,
  BookOpen,
  MapPin,
  Save,
  Send,
  X,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { teacherOperations, scheduledObservationOperations } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { Teacher, Observation } from '../types';

interface TeacherData {
  id: string;
  name: string;
  subject: string;
  grade: string;
  room: string;
  email: string;
  schedule: {
    [period: string]: { time: string; class: string };
  };
  availability: 'high' | 'medium' | 'low' | string;
  lastObservation: string;
}

interface ScheduledObservationData {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  time: string;
  period: string;
  class: string;
  room: string;
  observer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  framework: string;
  duration?: number;
  priority?: 'normal' | 'high' | 'urgent' | string;
}

const ObservationScheduler: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState('schedule'); // schedule, create, edit
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [scheduledObservations, setScheduledObservations] = useState<ScheduledObservationData[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        console.log('🔥 ObservationScheduler: Starting to fetch teachers from Firestore...');
        const teachersList = await teacherOperations.getAll();
        console.log('🔥 ObservationScheduler: Fetched teachers from Firestore:', teachersList);
        
        // Transform Teacher to TeacherData format if needed
        const transformedTeachers = teachersList.map((teacher): TeacherData => ({
          id: teacher.id,
          name: teacher.name,
          subject: teacher.subjects.join(', '), // Join array of subjects
          grade: teacher.grade || 'N/A',
          room: teacher.currentClass?.room || 'N/A',
          email: teacher.email,
          schedule: {
            'Period 1': { time: '8:00-8:45', class: teacher.currentClass?.name || 'Class' },
            'Period 2': { time: '8:50-9:35', class: teacher.currentClass?.name || 'Class' },
            'Period 3': { time: '9:40-10:25', class: teacher.currentClass?.name || 'Class' },
            'Period 4': { time: '10:45-11:30', class: teacher.currentClass?.name || 'Class' },
            'Period 5': { time: '11:35-12:20', class: teacher.currentClass?.name || 'Class' },
            'Period 6': { time: '1:05-1:50', class: teacher.currentClass?.name || 'Class' },
            'Period 7': { time: '1:55-2:40', class: teacher.currentClass?.name || 'Class' },
          },
          availability: 'medium', // Default availability
          lastObservation: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        }));
        
        setTeachers(transformedTeachers);
        console.log('🔥 ObservationScheduler: Successfully set teachers:', transformedTeachers);
      } catch (error) {
        console.error('❌ ObservationScheduler: Error fetching teachers:', error);
        alert('Failed to load teachers. Check console for details.');
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchScheduledObservations = async () => {
      try {
        console.log('🔥 ObservationScheduler: Fetching scheduled observations from Firestore...');
        const observations = await scheduledObservationOperations.getAll();
        console.log('🔥 ObservationScheduler: Fetched scheduled observations:', observations);
        
        // Transform Observation to ScheduledObservationData format
        const transformedObservations = observations.map((obs): ScheduledObservationData => ({
          id: obs.id,
          teacherId: obs.teacherId,
          teacherName: obs.teacherName,
          date: obs.date,
          time: new Date(obs.startTime).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: false 
          }).replace(':', '') + '-' + new Date(new Date(obs.startTime).getTime() + 45 * 60000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: false 
          }).replace(':', ''),
          period: obs.classInfo.period || 'Period',
          class: obs.classInfo.name,
          room: obs.classInfo.room,
          observer: obs.observerName,
          status: obs.status as 'scheduled' | 'completed' | 'cancelled',
          notes: obs.overallComment || '',
          framework: obs.frameworkId,
          duration: obs.duration,
          priority: 'normal'
        }));
        
        setScheduledObservations(transformedObservations);
        console.log('🔥 ObservationScheduler: Successfully set scheduled observations:', transformedObservations);
      } catch (error) {
        console.error('❌ ObservationScheduler: Error fetching scheduled observations:', error);
      }
    };

    fetchScheduledObservations();
  }, []);

  const [newObservation, setNewObservation] = useState({
    teacherId: '',
    date: '',
    period: '',
    time: '', // This might be derived from period in a real app
    class: '', // This might be derived from period in a real app
    notes: '',
    framework: 'CRP + All Frameworks',
    duration: 15,
    priority: 'normal'
  });

  const filteredTeachers = teachers.filter((teacher: TeacherData) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'high': return 'High - Ready for observation';
      case 'medium': return 'Medium - Recent observation';
      case 'low': return 'Low - Overdue for observation';
      default: return 'Unknown';
    }
  };

  // Function to handle scheduling with Firebase
  const handleScheduleObservation = async () => {
    if (!newObservation.teacherId || !newObservation.date || !newObservation.period) {
      alert('Please fill in all required fields');
      return;
    }

    const teacher = teachers.find((t: TeacherData) => t.id === newObservation.teacherId);
    const scheduleData = teacher?.schedule[newObservation.period];

    if (!teacher || !scheduleData) {
        alert('Selected teacher or period not found.');
        return;
    }

    try {
      // Create observation for Firebase
      const observationData: Omit<Observation, 'id'> = {
        teacherId: newObservation.teacherId,
        teacherName: teacher.name,
        observerId: user?.id || 'test-observer',
        observerName: user?.name || user?.email || 'Test Observer',
        frameworkId: newObservation.framework.toLowerCase().replace(/\s+/g, '-'),
        date: newObservation.date,
        startTime: new Date(`${newObservation.date} ${scheduleData.time.split('-')[0]}`).toISOString(),
        status: 'scheduled',
        duration: newObservation.duration || 15,
        responses: {},
        comments: {},
        overallComment: newObservation.notes,
        classInfo: {
          name: scheduleData.class,
          subject: teacher.subject,
          room: teacher.room,
          period: newObservation.period,
          grade: teacher.grade
        }
      };

      console.log('🔥 ObservationScheduler: Creating observation in Firestore...', observationData);
      const observationId = await scheduledObservationOperations.create(observationData);
      console.log('🔥 ObservationScheduler: Successfully created observation with ID:', observationId);
      
      // Create a local observation object for display
      const localObservation: ScheduledObservationData = {
        id: observationId,
        teacherId: newObservation.teacherId,
        teacherName: teacher.name,
        date: newObservation.date,
        time: scheduleData.time,
        period: newObservation.period,
        class: scheduleData.class,
        room: teacher.room,
        observer: user?.name || user?.email || 'Test Observer',
        status: 'scheduled',
        notes: newObservation.notes,
        framework: newObservation.framework,
        duration: newObservation.duration,
        priority: newObservation.priority,
      };

      setScheduledObservations([...scheduledObservations, localObservation]);

      console.log('🔥 ObservationScheduler: Added observation to local state');

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
      alert('Observation Scheduled Successfully in Firestore!');
    } catch (error) {
      console.error('❌ ObservationScheduler: Error scheduling observation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error scheduling observation: ${errorMessage}. Check console for details.`);
    }
  };

  // Function to cancel observation with Firebase
  const cancelObservation = async (observationId: string) => {
    try {
      await scheduledObservationOperations.cancel(observationId);
      setScheduledObservations(scheduledObservations.filter((obs: ScheduledObservationData) => obs.id !== observationId));
      alert('Observation cancelled successfully');
    } catch (error) {
      console.error('Error cancelling observation:', error);
      alert('Error cancelling observation');
    }
  };

  // Function to start observation - will navigate to live form
  const startObservation = (observation: ScheduledObservationData) => {
    console.log('Starting observation:', observation.id);
    sessionStorage.setItem('currentObservationData', JSON.stringify(observation));
    window.location.href = `/observe`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Observation Scheduler</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and schedule classroom observations</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedView('schedule')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedView === 'schedule'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Schedule View
              </button>
              <button
                onClick={() => setSelectedView('create')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedView === 'create'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Schedule New
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Schedule View */}
        {selectedView === 'schedule' && (
          <div className="space-y-6">
            {/* Date Filter */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
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
                {scheduledObservations.filter(obs => obs.date === selectedDate).length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No observations scheduled</h3>
                    <p className="text-gray-500 mb-4">Schedule your first observation for this date</p>
                    <button
                      onClick={() => setSelectedView('create')}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-600 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Schedule Observation</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scheduledObservations
                      .filter(obs => obs.date === selectedDate)
                      .map((obs) => (
                        <div key={obs.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{obs.teacherName}</h3>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {obs.period}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Time:</span> {obs.time}
                                </div>
                                <div>
                                  <span className="font-medium">Class:</span> {obs.class}
                                </div>
                                <div>
                                  <span className="font-medium">Room:</span> {obs.room}
                                </div>
                                <div>
                                  <span className="font-medium">Observer:</span> {obs.observer}
                                </div>
                              </div>
                              {obs.notes && (
                                <p className="text-sm text-gray-600 mt-2">
                                  <span className="font-medium">Notes:</span> {obs.notes}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Framework Focus:</span> {obs.framework}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => startObservation(obs)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
                              >
                                Start Observation
                              </button>
                              <button
                                onClick={() => setSelectedView('edit')}
                                className="text-gray-600 hover:text-gray-900 p-2"
                                title="Edit Observation"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => cancelObservation(obs.id)}
                                className="text-red-600 hover:text-red-900 p-2"
                                title="Cancel Observation"
                              >
                                <Trash2 className="w-4 h-4" />
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
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  Teacher Availability
                  {loadingTeachers && (
                     <span className="ml-3 text-sm text-gray-600 flex items-center">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                       Loading...
                     </span>
                  )}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                          <p className="text-sm text-gray-600">{teacher.subject} • {teacher.grade}</p>
                          <p className="text-sm text-gray-500">Room {teacher.room}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(teacher.availability)}`}>
                          {teacher.availability.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        Last observed: {new Date(teacher.lastObservation).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        {getAvailabilityText(teacher.availability)}
                      </p>
                      <button
                        onClick={() => {
                          setNewObservation({...newObservation, teacherId: teacher.id});
                          setSelectedView('create');
                        }}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                      >
                        Schedule Observation
                      </button>
                    </div>
                  ))}
                </div>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a teacher...</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subject} ({teacher.grade})
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Period Selection */}
                {newObservation.teacherId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Period *</label>
                    <select
                      value={newObservation.period}
                      onChange={(e) => setNewObservation({...newObservation, period: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a period...</option>
                      {Object.entries(teachers.find(t => t.id === newObservation.teacherId)?.schedule || {}).map(([period, info]) => (
                        <option key={period} value={period}>
                          {period} ({info.time}) - {info.class}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Framework Focus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Framework Focus</label>
                  <select
                    value={newObservation.framework}
                    onChange={(e) => setNewObservation({...newObservation, framework: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10 minutes (Quick Check)</option>
                    <option value={15}>15 minutes (Standard)</option>
                    <option value={20}>20 minutes (Extended)</option>
                    <option value={30}>30 minutes (Full Period)</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <select
                    value={newObservation.priority}
                    onChange={(e) => setNewObservation({...newObservation, priority: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High (Overdue for observation)</option>
                    <option value="urgent">Urgent (Support needed)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observation Notes</label>
                <textarea
                  value={newObservation.notes}
                  onChange={(e) => setNewObservation({...newObservation, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Optional notes about focus areas, special considerations, or goals for this observation..."
                />
              </div>

              {/* Observation Preview */}
              {newObservation.teacherId && newObservation.period && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Observation Preview</h3>
                  <div className="text-sm text-blue-800">
                    {/* Use optional chaining (?) and nullish coalescing (??) for safer access */}
                    <p><strong>Teacher:</strong> {teachers.find(t => t.id === newObservation.teacherId)?.name ?? 'N/A'}</p>
                    <p><strong>Class:</strong> {teachers.find(t => t.id === newObservation.teacherId)?.schedule[newObservation.period]?.class ?? 'N/A'}</p>
                    <p><strong>Time:</strong> {teachers.find(t => t.id === newObservation.teacherId)?.schedule[newObservation.period]?.time ?? 'N/A'}</p>
                    <p><strong>Room:</strong> {teachers.find(t => t.id === newObservation.teacherId)?.room ?? 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(newObservation.date).toLocaleDateString()}</p>
                    <p><strong>Duration:</strong> {newObservation.duration} minutes</p>
                    {newObservation.notes && (
                       <p><strong>Notes:</strong> {newObservation.notes}</p>
                    )}
                     <p><strong>Framework Focus:</strong> {newObservation.framework}</p>
                    <p><strong>Priority:</strong> {newObservation.priority}</p>
                  </div>
                </div>
              )}

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
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Observation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationScheduler;