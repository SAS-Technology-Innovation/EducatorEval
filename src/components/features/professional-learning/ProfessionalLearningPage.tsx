import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/auth';
import {
  Target,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Filter,
  Search
} from 'lucide-react';

const ProfessionalLearningPage: React.FC = () => {
  const { user } = useAuthStore();
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </button>
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
                    ? 'border-blue-500 text-blue-600'
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
                    ? 'border-blue-500 text-blue-600'
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-lg font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-lg font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-lg font-bold text-gray-900">0%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Suggested Training</p>
                <p className="text-lg font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'goals' ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
              <p className="text-gray-600 mb-6">Create your first SMART goal to track your professional development.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                Create Your First Goal
              </button>
              <div className="mt-8 text-left max-w-2xl mx-auto">
                <h4 className="font-semibold text-gray-900 mb-3">Goal Types:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900">Professional Development</p>
                    <p className="text-xs text-gray-600 mt-1">Skills and knowledge enhancement</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900">Instructional Practice</p>
                    <p className="text-xs text-gray-600 mt-1">Teaching methods and strategies</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900">Student Outcomes</p>
                    <p className="text-xs text-gray-600 mt-1">Impact on student learning</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900">Leadership</p>
                    <p className="text-xs text-gray-600 mt-1">Leadership and collaboration</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No training suggestions yet</h3>
              <p className="text-gray-600 mb-4">Training suggestions will appear here based on your observations and goals.</p>
              <p className="text-sm text-gray-500">Complete observations to receive personalized training recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLearningPage;
