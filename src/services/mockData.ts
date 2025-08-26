// Mock data for development - provides sample data when Firebase isn't available
import { User, Observation, Framework, ObservationResponse } from '../types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: 'observer1',
    name: 'Sarah Johnson',
    email: 'observer@school.edu',
    role: 'observer',
    department: 'Instructional Support',
    permissions: ['observe', 'view_observations']
  },
  {
    id: 'teacher1',
    name: 'Michael Brown',
    email: 'teacher@school.edu',
    role: 'teacher',
    department: 'Science',
    permissions: ['view_own_observations']
  },
  {
    id: 'coordinator1',
    name: 'Emily Wilson',
    email: 'coordinator@school.edu',
    role: 'coordinator',
    department: 'Administration',
    permissions: ['observe', 'manage_frameworks', 'view_all_observations', 'manage_users']
  }
];

// Helper to create observation responses
const createResponse = (value: string): ObservationResponse => ({
  questionId: '',
  value: value,
  timestamp: new Date().toISOString()
});

// Mock observation data
export const mockObservations: Observation[] = [
  {
    id: 'obs1',
    teacherId: 'teacher1',
    teacherName: 'Michael Brown',
    observerId: 'observer1',
    observerName: 'Sarah Johnson',
    frameworkId: 'crp-in-action',
    date: '2025-08-24',
    startTime: '09:15',
    endTime: '10:05',
    duration: 50,
    status: 'completed',
    responses: {
      'lookfor1': createResponse('4'),
      'lookfor2': createResponse('3'),
      'lookfor3': createResponse('4'),
      'lookfor4': createResponse('2'),
      'lookfor5': createResponse('3'),
      'lookfor6': createResponse('3'),
      'lookfor7': createResponse('4'),
      'lookfor8': createResponse('2'),
      'lookfor9': createResponse('4'),
      'lookfor10': createResponse('3')
    },
    comments: {
      'lookfor1': 'Clear learning targets posted on board. Students could articulate what they were learning about cellular respiration.',
      'lookfor2': 'Welcoming classroom environment with student work displayed. Teacher used affirming language.',
      'lookfor3': 'Used exit tickets and frequent check-ins during lab work.',
      'lookfor4': 'Mostly lower-level recall questions. Could incorporate more analysis.',
      'lookfor5': 'Students worked well in lab groups with defined roles.',
      'lookfor6': 'Connected respiration to students\' experiences with exercise.',
      'lookfor7': 'Circulated constantly, provided targeted support.',
      'lookfor8': 'Limited reflection time - students rushed to pack up.',
      'lookfor9': 'Positive interactions, knows all student names.',
      'lookfor10': 'Provided different complexity levels for lab analysis.'
    },
    overallComment: 'Strong lesson with clear objectives and good relationship building. Opportunities to increase cognitive demand and provide more reflection time.',
    classInfo: {
      subject: 'Biology',
      name: 'Biology - Period 2',
      room: 'A108',
      period: 'Period 2',
      grade: '10th Grade'
    },
    crpEvidenceCount: 8,
    totalLookFors: 10
  },
  {
    id: 'obs2',
    teacherId: 'teacher2',
    teacherName: 'David Chen',
    observerId: 'observer1',
    observerName: 'Sarah Johnson',
    frameworkId: 'crp-in-action',
    date: '2025-08-23',
    startTime: '13:20',
    endTime: '14:10',
    duration: 50,
    status: 'in-progress',
    responses: {
      'lookfor1': createResponse('4'),
      'lookfor2': createResponse('4'),
      'lookfor3': createResponse('3'),
      'lookfor4': createResponse('3')
    },
    comments: {
      'lookfor1': 'Posted essential question and learning objectives. Students referenced them during discussion.',
      'lookfor2': 'Inclusive classroom with diverse perspectives welcomed. Cultural artifacts displayed.',
      'lookfor3': 'Used thumbs up/down checks and think-pair-share.',
      'lookfor4': 'Asked some analysis questions about historical causes.'
    },
    overallComment: '',
    classInfo: {
      subject: 'World History',
      name: 'World History - Period 4',
      room: 'B112',
      period: 'Period 4',
      grade: '9th Grade'
    },
    crpEvidenceCount: 4,
    totalLookFors: 10
  },
  {
    id: 'obs3',
    teacherId: 'teacher3',
    teacherName: 'Maria Rodriguez',
    observerId: 'coordinator1',
    observerName: 'Emily Wilson',
    frameworkId: 'crp-in-action',
    date: '2025-08-22',
    startTime: '14:15',
    endTime: '15:05',
    duration: 50,
    status: 'completed',
    responses: {
      'lookfor1': createResponse('4'),
      'lookfor2': createResponse('4'),
      'lookfor3': createResponse('4'),
      'lookfor4': createResponse('4'),
      'lookfor5': createResponse('4'),
      'lookfor6': createResponse('4'),
      'lookfor7': createResponse('3'),
      'lookfor8': createResponse('3'),
      'lookfor9': createResponse('4'),
      'lookfor10': createResponse('4')
    },
    comments: {
      'lookfor1': 'Can-do statements clearly posted in Spanish and English.',
      'lookfor2': 'Celebrated Latino heritage month, inclusive of all cultures.',
      'lookfor3': 'Constant comprehension checks in target language.',
      'lookfor4': 'Higher-order questions about cultural comparisons.',
      'lookfor5': 'Authentic communication tasks with peer collaboration.',
      'lookfor6': 'Connected lesson to students\' family traditions.',
      'lookfor7': 'Monitored pair work effectively.',
      'lookfor8': 'Reflection in target language about cultural learning.',
      'lookfor9': 'Warm, encouraging interactions with all students.',
      'lookfor10': 'Multiple entry points for different proficiency levels.'
    },
    overallComment: 'Exemplary lesson demonstrating culturally responsive practices and authentic language use. Strong model for department.',
    classInfo: {
      subject: 'Spanish II',
      name: 'Spanish II - Period 5',
      room: 'D201',
      period: 'Period 5',
      grade: '10th Grade'
    },
    crpEvidenceCount: 10,
    totalLookFors: 10
  }
];

// Mock current user - can be changed for testing different roles
export let mockCurrentUser: User | null = mockUsers[0]; // Default to observer

export const setMockCurrentUser = (user: User | null) => {
  mockCurrentUser = user;
};

// Mock authentication functions
export const mockAuth = {
  getCurrentUser: () => mockCurrentUser,
  signIn: async (email: string, password: string) => {
    // Simple mock - find user by email
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      mockCurrentUser = user;
      return user;
    }
    throw new Error('Invalid credentials');
  },
  signOut: async () => {
    mockCurrentUser = null;
  },
  isAuthenticated: () => mockCurrentUser !== null
};

// Mock observations functions
export const mockObservationOperations = {
  getAll: async (): Promise<Observation[]> => {
    return [...mockObservations];
  },
  getByObserver: async (observerId: string): Promise<Observation[]> => {
    return mockObservations.filter(obs => obs.observerId === observerId);
  },
  getByTeacher: async (teacherId: string): Promise<Observation[]> => {
    return mockObservations.filter(obs => obs.teacherId === teacherId);
  },
  create: async (observation: Omit<Observation, 'id'>): Promise<string> => {
    const newId = `obs${mockObservations.length + 1}`;
    const newObservation: Observation = {
      ...observation,
      id: newId
    };
    mockObservations.push(newObservation);
    return newId;
  },
  update: async (id: string, updates: Partial<Observation>): Promise<void> => {
    const index = mockObservations.findIndex(obs => obs.id === id);
    if (index !== -1) {
      mockObservations[index] = {
        ...mockObservations[index],
        ...updates
      };
    }
  },
  delete: async (id: string): Promise<void> => {
    const index = mockObservations.findIndex(obs => obs.id === id);
    if (index !== -1) {
      mockObservations.splice(index, 1);
    }
  },
  search: async (query: string, filters?: any): Promise<Observation[]> => {
    let results = [...mockObservations];
    
    if (query) {
      results = results.filter(obs => 
        obs.teacherName.toLowerCase().includes(query.toLowerCase()) ||
        obs.classInfo.subject.toLowerCase().includes(query.toLowerCase()) ||
        obs.classInfo.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filters?.status && filters.status.length > 0) {
      results = results.filter(obs => filters.status.includes(obs.status));
    }
    
    return results;
  },
  getStats: async () => {
    const total = mockObservations.length;
    const thisMonth = mockObservations.filter(obs => 
      new Date(obs.date).getMonth() === new Date().getMonth()
    ).length;
    
    const completedObs = mockObservations.filter(obs => obs.status === 'completed');
    const crpEvidenceAverage = completedObs.length > 0 
      ? completedObs.reduce((sum, obs) => sum + (obs.crpEvidenceCount || 0), 0) / completedObs.length
      : 0;
    
    return { total, thisMonth, crpEvidenceAverage };
  },
  
  getRecent: async (limit: number = 20) => {
    const sorted = [...mockObservations]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
    return { observations: sorted };
  }
};

// Check if we should use mock data
export const shouldUseMockData = () => {
  // Use mock data if Firebase isn't configured or in development
  return process.env.NODE_ENV === 'development' || !process.env.PUBLIC_FIREBASE_API_KEY;
};
