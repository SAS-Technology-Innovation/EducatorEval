import React, { useState, useEffect } from 'react';
import { Camera, Mic, MapPin, Save, Send, Clock, User, BookOpen } from 'lucide-react';
import { getFrameworkColorClasses } from '../utils';
import { frameworkService } from '../services/frameworkService';
import { useObservations } from '../hooks/useObservations';
import { useAuth } from '../hooks/useAuth';
import { Question as QuestionType, ObservationResponse } from '../types';

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

interface Question {
  id: string;
  text: string;
  type: string;
  scale?: number;
  frameworkAlignments?: string[];
}

interface ObservationData {
  teacher: string;
  teacherId: string;
  subject: string;
  className: string;
  room: string;
  period: string;
  grade: string;
  duration: number;
  responses: Record<string, string>;
  comments: Record<string, string>;
  overallComment: string;
}

const MobileObservationForm: React.FC = () => {
  const { user } = useAuth();
  const { createObservation } = useObservations();
  const [selectedFramework, setSelectedFramework] = useState('crp-in-action');
  const [observationData, setObservationData] = useState<ObservationData>({
    teacher: '',
    teacherId: '',
    subject: '',
    className: '',
    room: '',
    period: '',
    grade: '',
    duration: 30,
    responses: {},
    comments: {},
    overallComment: ''
  });
  const [currentSection, setCurrentSection] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [frameworkOptions, setFrameworkOptions] = useState(frameworkService.getFrameworkOptions());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load questions from framework service
  useEffect(() => {
    const frameworkQuestions = frameworkService.getObservationQuestions(selectedFramework);
    setQuestions(frameworkQuestions.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      scale: q.scale,
      frameworkAlignments: q.frameworkAlignments
    })));
  }, [selectedFramework]);

  // Load observation data from session storage if available
  useEffect(() => {
    const storedData = sessionStorage.getItem('newObservationData');
    console.log('Stored Data:', storedData);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setObservationData(prev => ({
          ...prev,
          teacher: data.teacher,
          teacherId: data.teacherId,
          subject: data.subject,
          className: data.className,
          room: data.room,
          period: data.period,
          grade: data.grade
        }));
        console.log('Parsed Data:', data);
 setSelectedFramework(data.framework || 'crp-in-action');
        
        // Clear the session storage after loading
        sessionStorage.removeItem('newObservationData');
      } catch (error) {
        console.error('Error loading observation data from session storage:', error);
      }
    }
  }, []);

  // Sample teacher schedule data - This data should ideally come from an API/Firebase
  const teachers: Teacher[] = [
    {
      id: 'teacher1',
      name: 'Sarah Johnson',
      currentClass: {
        name: 'Biology - Period 2',
        subject: 'Biology',
        room: 'A108',
        period: 'Period 2',
        grade: '10th Grade'
      }
    },
    {
      id: 'teacher2',
      name: 'David Chen',
      currentClass: {
        name: 'World History - Period 4',
        subject: 'World History',
        room: 'B112',
        period: 'Period 4',
        grade: '9th Grade'
      }
    }
  ];

  const handleResponse = (questionId: string, value: string) => {
    setObservationData(prev => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: value }
    }));
  };

  const handleComment = (questionId: string, comment: string) => {
    setObservationData(prev => ({
      ...prev,
      comments: { ...prev.comments, [questionId]: comment }
    }));
  };

  const handleSaveDraft = async () => {
    if (!user || !observationData.teacherId) return;
    
    setIsSubmitting(true);
    try {
      // Convert to proper observation format
      const responses: Record<string, ObservationResponse> = {};
      Object.entries(observationData.responses).forEach(([key, value]) => {
        responses[key] = {
          questionId: key,
          value: value,
          timestamp: new Date().toISOString()
        };
      });

      const observationToSave = {
        teacherId: observationData.teacherId,
        teacherName: observationData.teacher,
        observerId: user.id,
        observerName: user.name || user.email || 'Unknown Observer',
        frameworkId: selectedFramework,
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(Date.now() + observationData.duration * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        duration: observationData.duration,
        status: 'draft' as const,
        responses,
        comments: observationData.comments,
        overallComment: observationData.overallComment,
        classInfo: {
          subject: observationData.subject,
          name: observationData.className,
          room: observationData.room,
          period: observationData.period,
          grade: observationData.grade
        }
      };

      await createObservation(observationToSave);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !observationData.teacherId) return;
    
    setIsSubmitting(true);
    try {
      // Convert to proper observation format
      const responses: Record<string, ObservationResponse> = {};
      Object.entries(observationData.responses).forEach(([key, value]) => {
        responses[key] = {
          questionId: key,
          value: value,
          timestamp: new Date().toISOString()
        };
      });

      const observationToSubmit = {
        teacherId: observationData.teacherId,
        teacherName: observationData.teacher,
        observerId: user.id,
        observerName: user.name || user.email || 'Unknown Observer',
        frameworkId: selectedFramework,
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(Date.now() + observationData.duration * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        duration: observationData.duration,
        status: 'completed' as const,
        responses,
        comments: observationData.comments,
        overallComment: observationData.overallComment,
        classInfo: {
          subject: observationData.subject,
          name: observationData.className,
          room: observationData.room,
          period: observationData.period,
          grade: observationData.grade
        }
      };

      await createObservation(observationToSubmit);
      alert('Observation submitted successfully!');
      // Navigate to dashboard or data page
      window.location.href = '/data';
    } catch (error) {
      console.error('Error submitting observation:', error);
      alert('Failed to submit observation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const value = observationData.responses[question.id] || '';
    const comment = observationData.comments[question.id] || '';

    switch (question.type) {
      case 'rating':
        const options = ['4', '3', '2', '1', 'not-observed'];
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => handleResponse(question.id, option)}
                  className={`py-2 px-3 text-sm rounded border text-center ${
                    value === option
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {option === 'not-observed' ? 'N/O' : option}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Add evidence/notes..."
              value={comment}
              onChange={(e) => handleComment(question.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm"
              rows={3}
            />
          </div>
        );

      case 'text':
        return (
          <textarea
            placeholder="Enter your response..."
            value={value}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-sm"
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Class/Teacher Info */}
      <div className="bg-white border-b px-4 py-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Teacher</label>
            <select
              value={observationData.teacherId}
              onChange={(e) => {
                const selectedTeacher = teachers.find(t => t.id === e.target.value);
                if (selectedTeacher) {
                  setObservationData(prev => ({
                    ...prev,
                    teacherId: selectedTeacher.id,
                    teacher: selectedTeacher.name,
                    subject: selectedTeacher.currentClass?.subject || '',
                    className: selectedTeacher.currentClass?.name || '',
                    room: selectedTeacher.currentClass?.room || '',
                    period: selectedTeacher.currentClass?.period || '',
                    grade: selectedTeacher.currentClass?.grade || ''
                  }));
                }
              }}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select teacher...</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>

          {observationData.teacherId && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                <div className="text-sm text-gray-900">{observationData.subject}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Room</label>
                <div className="text-sm text-gray-900">{observationData.room}</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Framework</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            >
              {frameworkOptions.map(framework => (
                <option key={framework.id} value={framework.id}>{framework.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="px-4 py-6 space-y-6">
        {questions.map((question, index) => {
          const rating = observationData.responses[question.id] || '';
          
          return (
            <div key={question.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 leading-tight pr-2">
                    {index + 1}. {question.text}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {rating && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rating === '4' ? 'bg-green-100 text-green-800' :
                        rating === '3' ? 'bg-blue-100 text-blue-800' :
                        rating === '2' ? 'bg-yellow-100 text-yellow-800' :
                        rating === '1' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rating === 'not-observed' ? 'N/O' : rating}
                      </span>
                    )}
                  </div>
                </div>
                {question.frameworkAlignments && question.frameworkAlignments.length > 0 && (
                  <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                    <strong className="text-blue-800">Frameworks:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {question.frameworkAlignments.map((alignmentId: string) => {
                        const framework = frameworkOptions.find(f => f.id === alignmentId);
                        if (!framework) return null;
                        return (
                          <span
                            key={alignmentId}
                            className={`px-2 py-1 rounded text-xs ${getFrameworkColorClasses(framework.color)}`}
                          >
                            {framework.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {renderQuestion(question)}

              {/* Show completion status */}
              <div className="mt-3 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  rating ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className="text-xs text-gray-500">
                  {rating ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Overall Comment */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Overall Comments</h3>
          <textarea
            placeholder="Add overall observation notes..."
            value={observationData.overallComment}
            onChange={(e) => setObservationData(prev => ({ ...prev, overallComment: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded text-sm"
            rows={4}
          />
        </div>

        {/* Progress indicator */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Progress</span>
            <span className="text-sm text-gray-600">
              {Object.keys(observationData.responses).length}/{questions.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${questions.length > 0 ? (Object.keys(observationData.responses).length / questions.length) * 100 : 0}%` 
              }}
            ></div>
          </div>

          {observationData.teacherId && Object.keys(observationData.responses).length < questions.length && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                {questions.length - Object.keys(observationData.responses).length} look-fors remaining to complete observation.
              </p>
            </div>
          )}

          <div className="flex space-x-3 mt-4">
            <button
              disabled={!observationData.teacherId || isSubmitting}
              onClick={handleSaveDraft}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Draft'}</span>
            </button>
            <button
              disabled={!observationData.teacherId || Object.keys(observationData.responses).length === 0 || isSubmitting}
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:bg-gray-400"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileObservationForm;
