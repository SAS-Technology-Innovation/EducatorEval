import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth';
import { useFrameworks } from '../../../hooks/useFrameworks';
import { useCreateObservation } from '../../../hooks/useObservations';
import { Plus, X, Calendar, Users, BookOpen, Clock } from 'lucide-react';
import type { Observation } from '../../../types';

/**
 * Quick observation creation component for observers
 * Allows observers to immediately start an observation with minimal setup
 */
const ObserverQuickObservation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: frameworks } = useFrameworks();
  const createObservation = useCreateObservation();

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [selectedFramework, setSelectedFramework] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [duration, setDuration] = useState('45');

  const resetForm = () => {
    setSelectedFramework('');
    setSubjectId('');
    setSubjectName('');
    setClassName('');
    setSubject('');
    setGrade('');
    setDuration('45');
  };

  const handleCreateObservation = async () => {
    if (!user || !selectedFramework || !subjectName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);

    try {
      const framework = frameworks?.find(f => f.id === selectedFramework);

      const newObservation: Partial<Observation> = {
        // Participants
        subjectId: subjectId || `temp_${Date.now()}`, // Temporary ID if not provided
        subjectName: subjectName.trim(),
        observerId: user.id,
        observerName: user.displayName || user.email || 'Observer',

        // Framework
        frameworkId: selectedFramework,
        frameworkName: framework?.name || 'CRP Framework',
        frameworkVersion: framework?.version || '1.0',

        // Context
        context: {
          type: 'classroom',
          className: className.trim() || 'Class',
          subject: subject.trim() || 'General',
          grade: grade.trim() || 'N/A',
          date: new Date(),
          startTime: new Date(),
          duration: parseInt(duration) || 45,
        },

        // Status
        status: 'draft',

        // Initial values
        responses: [],
        overallComments: '',
        evidenceCount: 0,
        totalQuestions: framework?.totalQuestions || 0,
        evidencePercentage: 0,
        frameworkScores: [],
        crpEvidenceCount: 0,
        totalLookFors: framework?.totalQuestions || 10,
        crpPercentage: 0,
        strengths: [],
        growthAreas: [],
        attachments: [],
        followUpRequired: false,
        followUpCompleted: false,
        metadata: {
          createdViaQuickObservation: true,
          createdAt: new Date().toISOString()
        },

        // School/Division info (use user's or default)
        schoolId: user.schoolId || 'default-school',
        divisionId: user.divisionId || 'default-division',
      };

      const created = await createObservation.mutateAsync(newObservation as any);

      // Navigate to the observation form to fill it out
      navigate(`/app/observations/${created.id}`);

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating observation:', error);
      alert('Failed to create observation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const activeFrameworks = frameworks?.filter(f => f.status === 'active') || [];

  return (
    <>
      {/* Quick Create Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center px-4 py-2 bg-sas-blue-600 text-white rounded-lg font-medium hover:bg-sas-blue-700 shadow-sm"
      >
        <Plus className="w-5 h-5 mr-2" />
        New Observation
      </button>

      {/* Quick Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => !isCreating && setShowModal(false)}
            />

            <div className="relative bg-white rounded-lg max-w-2xl w-full z-10 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Observation</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Start a new classroom observation
                  </p>
                </div>
                <button
                  onClick={() => !isCreating && setShowModal(false)}
                  disabled={isCreating}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                {/* Framework Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Framework *
                  </label>
                  <select
                    value={selectedFramework}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                    disabled={isCreating}
                  >
                    <option value="">Select a framework...</option>
                    {activeFrameworks.map((framework) => (
                      <option key={framework.id} value={framework.id}>
                        {framework.name} {framework.version && `(v${framework.version})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teacher/Subject Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Teacher Name *
                    </label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="Enter teacher name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher Email (optional)
                    </label>
                    <input
                      type="email"
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      placeholder="teacher@sas.edu.sg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                {/* Class Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="e.g., Math 101"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g., Grade 5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="5"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This will create a draft observation that you can immediately start filling out.
                    The observation will be timestamped with the current date and time.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => !isCreating && setShowModal(false)}
                  disabled={isCreating}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateObservation}
                  disabled={isCreating || !selectedFramework || !subjectName.trim()}
                  className="px-4 py-2 bg-sas-blue-600 text-white rounded-lg font-medium hover:bg-sas-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isCreating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create & Start
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ObserverQuickObservation;
