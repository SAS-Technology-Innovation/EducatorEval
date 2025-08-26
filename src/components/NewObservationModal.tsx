import React, { useState } from 'react';
import { X, Calendar, Clock, User, BookOpen, MapPin } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  currentClass: {
    name: string;
    subject: string;
    room: string;
    period: string;
    grade: string;
  };
}

interface NewObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartObservation: (data: {
    teacherId: string;
    teacher: string;
    subject: string;
    className: string;
    room: string;
    period: string;
    grade: string;
    framework: string;
  }) => void;
}

const NewObservationModal: React.FC<NewObservationModalProps> = ({ isOpen, onClose, onStartObservation }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [framework, setFramework] = useState('crp-in-action');
  const [customClass, setCustomClass] = useState(false);
  const [classDetails, setClassDetails] = useState({
    name: '',
    subject: '',
    room: '',
    period: '',
    grade: ''
  });

  // Sample teacher data - should come from API/Firebase in production
  const teachers: Teacher[] = [
    {
      id: 'teacher1',
      name: 'Sarah Johnson',
      currentClass: { 
        name: 'Algebra I - Period 3', 
        subject: 'Mathematics', 
        room: 'B205', 
        period: 'Period 3', 
        grade: '9th Grade' 
      }
    },
    {
      id: 'teacher2',
      name: 'Michael Brown',
      currentClass: { 
        name: 'Biology - Period 2', 
        subject: 'Science', 
        room: 'A108', 
        period: 'Period 2', 
        grade: '10th Grade' 
      }
    },
    {
      id: 'teacher3',
      name: 'Emily Wilson',
      currentClass: { 
        name: 'English Literature - Period 1', 
        subject: 'English', 
        room: 'C301', 
        period: 'Period 1', 
        grade: '11th Grade' 
      }
    },
    {
      id: 'teacher4',
      name: 'David Chen',
      currentClass: { 
        name: 'World History - Period 4', 
        subject: 'Social Studies', 
        room: 'B112', 
        period: 'Period 4', 
        grade: '9th Grade' 
      }
    },
    {
      id: 'teacher5',
      name: 'Maria Rodriguez',
      currentClass: { 
        name: 'Spanish II - Period 5', 
        subject: 'World Languages', 
        room: 'D201', 
        period: 'Period 5', 
        grade: '10th Grade' 
      }
    },
    {
      id: 'teacher6',
      name: 'James Thompson',
      currentClass: { 
        name: 'Physics - Period 6', 
        subject: 'Science', 
        room: 'A203', 
        period: 'Period 6', 
        grade: '12th Grade' 
      }
    }
  ];

  const handleStartObservation = () => {
    if (!selectedTeacher && !customClass) return;

    const observationData = customClass ? {
      teacherId: 'custom',
      teacher: 'Custom Teacher',
      subject: classDetails.subject,
      className: classDetails.name,
      room: classDetails.room,
      period: classDetails.period,
      grade: classDetails.grade,
      framework
    } : {
      teacherId: selectedTeacher!.id,
      teacher: selectedTeacher!.name,
      subject: selectedTeacher!.currentClass.subject,
      className: selectedTeacher!.currentClass.name,
      room: selectedTeacher!.currentClass.room,
      period: selectedTeacher!.currentClass.period,
      grade: selectedTeacher!.currentClass.grade,
      framework
    };

    onStartObservation(observationData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Start New Observation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Framework Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observation Framework</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="crp-in-action">CRP in Action: Integrated Observation Tool</option>
            </select>
          </div>

          {/* Teacher/Class Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Select Teacher & Class</label>
              <button
                onClick={() => setCustomClass(!customClass)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {customClass ? 'Select from schedule' : 'Enter custom details'}
              </button>
            </div>

            {customClass ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Class Name</label>
                    <input
                      type="text"
                      value={classDetails.name}
                      onChange={(e) => setClassDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="e.g., Algebra I - Period 3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                    <input
                      type="text"
                      value={classDetails.subject}
                      onChange={(e) => setClassDetails(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Room</label>
                    <input
                      type="text"
                      value={classDetails.room}
                      onChange={(e) => setClassDetails(prev => ({ ...prev, room: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="e.g., B205"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Period</label>
                    <input
                      type="text"
                      value={classDetails.period}
                      onChange={(e) => setClassDetails(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="e.g., Period 3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Grade</label>
                    <input
                      type="text"
                      value={classDetails.grade}
                      onChange={(e) => setClassDetails(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="e.g., 9th Grade"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTeacher?.id === teacher.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{teacher.name}</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-3 h-3" />
                            <span>{teacher.currentClass.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{teacher.currentClass.room}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{teacher.currentClass.period}</span>
                            </div>
                            <span>• {teacher.currentClass.grade}</span>
                          </div>
                        </div>
                      </div>
                      {selectedTeacher?.id === teacher.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Time Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStartObservation}
            disabled={!selectedTeacher && !customClass}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Observation
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewObservationModal;
