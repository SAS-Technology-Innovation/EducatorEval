import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  FileText,
  X
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'multiselect' | 'single-select' | 'yes-no';
  required: boolean;
  scale?: number;
  weight: number;
  tags: string[];
  helpText: string;
  options?: string[];
  frameworkAlignments: string[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  weight: number;
  questions: Question[];
}

interface Framework {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  lastModified: string;
  tags: string[];
  sections: Section[];
}

export default function FrameworkEditor() {
  const [selectedFramework, setSelectedFramework] = useState('crp-in-action');
  const [editMode, setEditMode] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const [showEditFramework, setShowEditFramework] = useState(false);
  const [editingFramework, setEditingFramework] = useState<Framework | null>(null);
  const [frameworkTagInput, setFrameworkTagInput] = useState('');
  const [showEditSection, setShowEditSection] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [frameworks, setFrameworks] = useState<Record<string, Framework>>({
    'crp-in-action': {
      id: 'crp-in-action',
      name: 'CRP in Action: Integrated Observation Tool',
      description: 'Comprehensive evaluation framework integrating Culturally Responsive Practices',
      version: '1.0',
      status: 'active',
      lastModified: '2025-08-15',
      tags: ['crp', 'culturally-responsive', 'assessment'],
      sections: [
        {
          id: 'integrated-lookfors',
          title: '10 Look-Fors: Integrated Observation',
          description: 'Evidence-based look-fors aligned to multiple frameworks',
          weight: 100,
          questions: [
            {
              id: 'lookfor1',
              text: 'The learning target is clearly communicated and relevant to students.',
              type: 'rating',
              required: true,
              scale: 4,
              weight: 10,
              tags: ['learning-targets', 'clarity'],
              helpText: 'Look for visible learning targets and student understanding',
              frameworkAlignments: ['5-daily-assessment', 'crp-curriculum', 'tripod-clarify']
            },
            {
              id: 'lookfor2', 
              text: 'Teacher fosters an inclusive environment where all students feel belonging.',
              type: 'rating',
              required: true,
              scale: 4,
              weight: 10,
              tags: ['belonging', 'inclusive'],
              helpText: 'Observe inclusive language and cultural affirmation',
              frameworkAlignments: ['crp-general', 'casel-social-awareness', 'panorama', 'tripod-care']
            },
            {
              id: 'lookfor3',
              text: 'Teacher checks for understanding and adjusts instruction.',
              type: 'rating',
              required: true,
              scale: 4,
              weight: 10,
              tags: ['formative-assessment', 'responsive-teaching'],
              helpText: 'Look for checks for understanding and instructional adjustments',
              frameworkAlignments: ['5-daily-assessment', 'tripod-clarify', 'inclusive-practices']
            }
          ]
        }
      ]
    }
  });

  // Framework alignment options
  const frameworkOptions = [
    { id: 'crp-general', label: 'CRP (General)', category: 'Culturally Responsive Practices', color: 'green' },
    { id: 'crp-curriculum', label: 'CRP (Curriculum Relevance)', category: 'Culturally Responsive Practices', color: 'green' },
    { id: 'crp-high-expectations', label: 'CRP (High Expectations)', category: 'Culturally Responsive Practices', color: 'green' },
    { id: 'crp-learning-partnerships', label: 'CRP (Learning Partnerships)', category: 'Culturally Responsive Practices', color: 'green' },
    
    { id: 'casel-self-awareness', label: 'CASEL (Self-Awareness)', category: 'Social-Emotional Learning', color: 'pink' },
    { id: 'casel-social-awareness', label: 'CASEL (Social Awareness)', category: 'Social-Emotional Learning', color: 'pink' },
    { id: 'casel-relationship-skills', label: 'CASEL (Relationship Skills)', category: 'Social-Emotional Learning', color: 'pink' },
    { id: 'casel-self-management', label: 'CASEL (Self-Management)', category: 'Social-Emotional Learning', color: 'pink' },
    { id: 'casel-responsible-decision', label: 'CASEL (Responsible Decision-Making)', category: 'Social-Emotional Learning', color: 'pink' },
    
    { id: 'tripod-care', label: 'Tripod: Care', category: '7Cs of Learning', color: 'blue' },
    { id: 'tripod-challenge', label: 'Tripod: Challenge', category: '7Cs of Learning', color: 'blue' },
    { id: 'tripod-clarify', label: 'Tripod: Clarify', category: '7Cs of Learning', color: 'blue' },
    { id: 'tripod-captivate', label: 'Tripod: Captivate', category: '7Cs of Learning', color: 'blue' },
    { id: 'tripod-confer', label: 'Tripod: Confer', category: '7Cs of Learning', color: 'blue' },
    { id: 'tripod-consolidate', label: 'Tripod: Consolidate', category: '7Cs of Learning', color: 'blue' },
    { id: 'tripod-control', label: 'Tripod: Control', category: '7Cs of Learning', color: 'blue' },
    
    { id: '5-daily-assessment', label: '5 Daily Assessment Practices', category: 'Assessment', color: 'yellow' },
    
    { id: 'panorama', label: 'Panorama (Student Experience)', category: 'Student Experience', color: 'purple' },
    
    { id: 'inclusive-practices', label: 'Inclusive Practices', category: 'Inclusion & Equity', color: 'indigo' }
  ];

  const [newQuestion, setNewQuestion] = useState<Question>({
    id: '',
    text: '',
    type: 'rating',
    required: true,
    scale: 4,
    weight: 10,
    tags: [],
    helpText: '',
    options: [],
    frameworkAlignments: []
  });

  const [tagInput, setTagInput] = useState('');

  const questionTypes = [
    { value: 'rating', label: 'Rating Scale', description: '1-4 rating scale for observation' },
    { value: 'text', label: 'Text Response', description: 'Open-ended text input' },
    { value: 'multiselect', label: 'Multiple Choice', description: 'Select multiple options' },
    { value: 'single-select', label: 'Single Choice', description: 'Select one option' },
    { value: 'yes-no', label: 'Yes/No', description: 'Binary choice question' }
  ];

  const currentFramework = frameworks[selectedFramework];
  const currentSection = currentFramework?.sections?.[selectedSection];

  const startEditQuestion = (question: Question) => {
    setEditingQuestion({
      ...question,
      frameworkAlignments: question.frameworkAlignments || []
    });
    setTagInput('');
    setShowEditQuestion(true);
  };

  const saveEditQuestion = () => {
    if (!editingQuestion?.text.trim() || !currentSection) return;

    const updatedFramework = { ...currentFramework };
    const questionIndex = updatedFramework.sections[selectedSection].questions.findIndex(q => q.id === editingQuestion.id);
    
    if (questionIndex !== -1) {
      updatedFramework.sections[selectedSection].questions[questionIndex] = {
        ...editingQuestion,
        tags: editingQuestion.tags.filter(tag => tag.trim())
      };

      setFrameworks(prev => ({
        ...prev,
        [selectedFramework]: updatedFramework
      }));
    }

    setEditingQuestion(null);
    setTagInput('');
    setShowEditQuestion(false);
  };

  const addFrameworkAlignment = (frameworkId: string) => {
    if (showEditQuestion && editingQuestion) {
      if (!editingQuestion.frameworkAlignments.includes(frameworkId)) {
        setEditingQuestion(prev => prev ? ({
          ...prev,
          frameworkAlignments: [...prev.frameworkAlignments, frameworkId]
        }) : null);
      }
    } else if (showAddQuestion) {
      if (!newQuestion.frameworkAlignments.includes(frameworkId)) {
        setNewQuestion(prev => ({
          ...prev,
          frameworkAlignments: [...prev.frameworkAlignments, frameworkId]
        }));
      }
    }
  };

  const removeFrameworkAlignment = (frameworkId: string) => {
    if (showEditQuestion && editingQuestion) {
      setEditingQuestion(prev => prev ? ({
        ...prev,
        frameworkAlignments: prev.frameworkAlignments.filter(id => id !== frameworkId)
      }) : null);
    } else if (showAddQuestion) {
      setNewQuestion(prev => ({
        ...prev,
        frameworkAlignments: prev.frameworkAlignments.filter(id => id !== frameworkId)
      }));
    }
  };

  const getFrameworkColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800 border-green-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag) {
      if (showEditQuestion && editingQuestion) {
        if (!editingQuestion.tags.includes(trimmedTag)) {
          setEditingQuestion(prev => prev ? ({
            ...prev,
            tags: [...prev.tags, trimmedTag]
          }) : null);
          setTagInput('');
        }
      } else if (showAddQuestion) {
        if (!newQuestion.tags.includes(trimmedTag)) {
          setNewQuestion(prev => ({
            ...prev,
            tags: [...prev.tags, trimmedTag]
          }));
          setTagInput('');
        }
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (showEditQuestion && editingQuestion) {
      setEditingQuestion(prev => prev ? ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }) : null);
    } else if (showAddQuestion) {
      setNewQuestion(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addQuestion = () => {
    if (!newQuestion.text.trim() || !currentSection) return;

    const questionId = `q${Date.now()}`;
    const updatedFramework = { ...currentFramework };
    updatedFramework.sections[selectedSection].questions.push({
      ...newQuestion,
      id: questionId,
      tags: newQuestion.tags.filter(tag => tag.trim())
    });

    setFrameworks(prev => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));

    setNewQuestion({
      id: '',
      text: '',
      type: 'rating',
      required: true,
      scale: 4,
      weight: 10,
      tags: [],
      helpText: '',
      options: [],
      frameworkAlignments: []
    });
    setTagInput('');
    setShowAddQuestion(false);
  };

  const removeQuestion = (questionId: string) => {
    if (!currentSection) return;
    
    const updatedFramework = { ...currentFramework };
    updatedFramework.sections[selectedSection].questions = 
      updatedFramework.sections[selectedSection].questions.filter(q => q.id !== questionId);

    setFrameworks(prev => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    if (!currentSection) return;
    
    const updatedFramework = { ...currentFramework };
    const questions = updatedFramework.sections[selectedSection].questions;
    const index = questions.findIndex(q => q.id === questionId);
    
    if (direction === 'up' && index > 0) {
      [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }

    setFrameworks(prev => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));
  };

  const startEditFramework = () => {
    setEditingFramework({...currentFramework});
    setFrameworkTagInput('');
    setShowEditFramework(true);
  };

  const saveEditFramework = () => {
    if (!editingFramework) return;

    const updatedFramework = {
      ...editingFramework,
      lastModified: new Date().toISOString().split('T')[0], // Update last modified date
      tags: editingFramework.tags.filter(tag => tag.trim())
    };

    setFrameworks(prev => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));

    setEditingFramework(null);
    setFrameworkTagInput('');
    setShowEditFramework(false);
  };

  const addFrameworkTag = () => {
    const trimmedTag = frameworkTagInput.trim().toLowerCase();
    if (trimmedTag && editingFramework && !editingFramework.tags.includes(trimmedTag)) {
      setEditingFramework(prev => prev ? ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }) : null);
      setFrameworkTagInput('');
    }
  };

  const removeFrameworkTag = (tagToRemove: string) => {
    if (editingFramework) {
      setEditingFramework(prev => prev ? ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }) : null);
    }
  };

  const handleFrameworkTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFrameworkTag();
    }
  };

  const startEditSection = () => {
    if (currentSection) {
      setEditingSection({...currentSection});
      setShowEditSection(true);
    }
  };

  const saveEditSection = () => {
    if (!editingSection || !currentFramework) return;

    const updatedFramework = { ...currentFramework };
    updatedFramework.sections[selectedSection] = {
      ...editingSection
    };

    setFrameworks(prev => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));

    setEditingSection(null);
    setShowEditSection(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRP in Action Framework</h1>
              <p className="text-sm text-gray-600 mt-1">Configure the Integrated Observation Tool for culturally responsive practices</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                <Copy className="w-4 h-4 inline mr-2" />
                Duplicate
              </button>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              <button 
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  editMode 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {editMode ? (
                  <>
                    <Save className="w-4 h-4 inline mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 inline mr-2" />
                    Edit Framework
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Overview */}
      <div className="px-6 py-6">
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">CRP in Action Framework Structure</h2>
            <span className="text-sm text-gray-600">
              Goal: 5,000 observations by May 2026 • 70% CRP evidence target
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
              📋 {currentFramework?.name || 'Framework'}
            </span>
            <span className="text-gray-400">contains</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
              📂 {currentFramework?.sections?.length || 0} Section
            </span>
            <span className="text-gray-400">with</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
              ❓ {currentFramework?.sections?.reduce((total, section) => total + section.questions.length, 0) || 0} Look-Fors
            </span>
            <span className="text-gray-400">•</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
              👥 80 Observers
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frameworks</h3>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="crp-in-action">CRP in Action: Integrated Observation Tool</option>
            </select>
          </div>

          {/* Framework Info */}
          <div className="p-6 border-b">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{currentFramework?.name || 'Framework'}</h4>
                  <p className="text-sm text-gray-600">{currentFramework?.description || ''}</p>
                </div>
                {editMode && (
                  <button
                    onClick={startEditFramework}
                    className="ml-2 p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Framework Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentFramework?.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {currentFramework?.status || 'inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Version</span>
                <span className="text-sm text-gray-900">{currentFramework?.version || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Modified</span>
                <span className="text-sm text-gray-900">{currentFramework?.lastModified || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Tags</span>
                {editMode && (
                  <span className="text-xs text-gray-400">Click edit to manage tags</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {currentFramework?.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {tag}
                  </span>
                )) || []}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Framework Sections</h4>
                <span className="text-xs text-gray-500">{currentFramework?.sections?.length || 0} sections</span>
              </div>
              <div className="space-y-2">
                {currentFramework?.sections?.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedSection === index
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          selectedSection === index ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          Section {index + 1}
                        </span>
                        <span className="font-medium text-sm">{section.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{section.questions.length}Q</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{section.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Weight: {section.weight}%</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-green-600">
                          {section.questions.filter(q => q.required).length} required
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-blue-600">
                          {section.questions.filter(q => !q.required).length} optional
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {editMode && (
                <button className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add New Section
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {currentSection ? (
            <>
              {/* Section Header */}
              <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-gray-900">{currentSection.title}</h2>
                    {editMode && (
                      <button
                        onClick={startEditSection}
                        className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Section Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {currentSection.questions.length} look-fors
                    </span>
                    {editMode && (
                      <button 
                        onClick={() => setShowAddQuestion(true)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add Look-For
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600">{currentSection.description}</p>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {currentSection.questions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-500">Look-For #{index + 1}</span>
                            {question.required && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                Required
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                              {question.type}
                            </span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                              Weight: {question.weight}
                            </span>
                          </div>
                          <p className="text-gray-900 font-medium mb-2">{question.text}</p>
                          {question.helpText && (
                            <p className="text-sm text-gray-600 mb-2">{question.helpText}</p>
                          )}
                          
                          {/* Tags */}
                          {question.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {question.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Framework Alignments */}
                          {question.frameworkAlignments.length > 0 && (
                            <div className="mt-3">
                              <span className="text-xs font-medium text-gray-500 block mb-1">Framework Alignments:</span>
                              <div className="flex flex-wrap gap-1">
                                {question.frameworkAlignments.map(alignmentId => {
                                  const framework = frameworkOptions.find(f => f.id === alignmentId);
                                  return framework ? (
                                    <span
                                      key={alignmentId}
                                      className={`text-xs px-2 py-1 rounded border ${getFrameworkColorClasses(framework.color)}`}
                                    >
                                      {framework.label}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {editMode && (
                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => moveQuestion(question.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveQuestion(question.id, 'down')}
                              disabled={index === currentSection.questions.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEditQuestion(question)}
                              className="p-1 text-blue-500 hover:text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="p-1 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Section Selected</h3>
                <p className="text-sm">Select a framework section to view its questions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Look-For</h3>
                <button
                  onClick={() => setShowAddQuestion(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the look-for question..."
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Help Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Help Text
                </label>
                <textarea
                  value={newQuestion.helpText}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, helpText: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional guidance for observers..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
                {newQuestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newQuestion.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded flex items-center">
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newQuestion.required}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Required</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newQuestion.weight}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, weight: parseInt(e.target.value) || 10 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddQuestion(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Add Look-For
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditQuestion && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Look-For</h3>
                <button
                  onClick={() => setShowEditQuestion(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion(prev => prev ? ({ ...prev, text: e.target.value }) : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the look-for question..."
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={editingQuestion.type}
                  onChange={(e) => setEditingQuestion(prev => prev ? ({ ...prev, type: e.target.value as any }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Help Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Help Text
                </label>
                <textarea
                  value={editingQuestion.helpText}
                  onChange={(e) => setEditingQuestion(prev => prev ? ({ ...prev, helpText: e.target.value }) : null)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional guidance for observers..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
                {editingQuestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {editingQuestion.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded flex items-center">
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingQuestion.required}
                      onChange={(e) => setEditingQuestion(prev => prev ? ({ ...prev, required: e.target.checked }) : null)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Required</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingQuestion.weight}
                    onChange={(e) => setEditingQuestion(prev => prev ? ({ ...prev, weight: parseInt(e.target.value) || 10 }) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditQuestion(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEditQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {showEditSection && editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Section Details</h3>
                <button
                  onClick={() => setShowEditSection(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Section Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter section title..."
                />
              </div>

              {/* Section Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editingSection.description}
                  onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter section description..."
                />
              </div>

              {/* Section Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editingSection.weight}
                  onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, weight: parseInt(e.target.value) || 100 }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage weight of this section in the overall framework assessment.
                </p>
              </div>

              {/* Section Stats (Read-only) */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Questions:</span> {editingSection.questions.length}
                  <br />
                  <span className="font-medium">Required:</span> {editingSection.questions.filter(q => q.required).length}
                  <br />
                  <span className="font-medium">Optional:</span> {editingSection.questions.filter(q => !q.required).length}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditSection(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEditSection}
                disabled={!editingSection?.title.trim() || !editingSection?.description.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Framework Modal */}
      {showEditFramework && editingFramework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Framework Details</h3>
                <button
                  onClick={() => setShowEditFramework(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Framework Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Framework Name *
                </label>
                <input
                  type="text"
                  value={editingFramework.name}
                  onChange={(e) => setEditingFramework(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter framework name..."
                />
              </div>

              {/* Framework Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editingFramework.description}
                  onChange={(e) => setEditingFramework(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter framework description..."
                />
              </div>

              {/* Status and Version */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingFramework.status}
                    onChange={(e) => setEditingFramework(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={editingFramework.version}
                    onChange={(e) => setEditingFramework(prev => prev ? ({ ...prev, version: e.target.value }) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1.0, 2.1"
                  />
                </div>
              </div>

              {/* Tags Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={frameworkTagInput}
                    onChange={(e) => setFrameworkTagInput(e.target.value)}
                    onKeyPress={handleFrameworkTagInputKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    onClick={addFrameworkTag}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                {editingFramework.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {editingFramework.tags.map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded flex items-center">
                        {tag}
                        <button
                          onClick={() => removeFrameworkTag(tag)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Tags help categorize and organize frameworks for easier searching and filtering.
                </p>
              </div>

              {/* Last Modified (Read-only info) */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Last Modified:</span> {editingFramework.lastModified}
                  <br />
                  <span className="text-xs text-gray-500">This will be updated automatically when you save changes.</span>
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditFramework(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEditFramework}
                disabled={!editingFramework?.name.trim() || !editingFramework?.description.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Framework
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
