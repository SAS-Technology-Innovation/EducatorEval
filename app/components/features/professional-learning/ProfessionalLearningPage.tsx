import React, { useState } from 'react';
import {
  Target,
  BookOpen,
} from 'lucide-react';
import GoalsList from './GoalsList';

const ProfessionalLearningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'training'>('goals');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professional Learning</h1>
              <p className="text-gray-600">SMART Goals and Training Suggestions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'goals'
                    ? 'border-sas-navy-500 text-sas-navy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  My Goals
                </div>
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'training'
                    ? 'border-sas-navy-500 text-sas-navy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Training Suggestions
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'goals' ? (
          <GoalsList />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No training suggestions yet</h3>
              <p className="text-gray-600 mb-4">Training suggestions will appear here based on your observations and goals.</p>
              <p className="text-sm text-gray-500">Complete observations to receive personalized training recommendations.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalLearningPage;
