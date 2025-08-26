// Sample observation data for testing
import { observationOperations } from '../firebase/firestore';
import { Observation } from '../types';

const sampleObservations: Omit<Observation, 'id'>[] = [
  {
    teacherId: 'teacher1',
    teacherName: 'Michael Brown',
    observerId: 'observer1',
    observerName: 'Dr. Sarah Johnson',
    frameworkId: 'crp-in-action',
    date: '2025-01-25',
    startTime: new Date('2025-01-25T09:40:00').toISOString(),
    endTime: new Date('2025-01-25T10:25:00').toISOString(),
    duration: 45,
    status: 'completed',
    responses: {
      'q1': { questionId: 'q1', value: 4, timestamp: new Date().toISOString() },
      'q2': { questionId: 'q2', value: 3, timestamp: new Date().toISOString() }
    },
    comments: {
      'q1': 'Great use of questioning strategies',
      'q2': 'Could improve student engagement'
    },
    overallComment: 'Strong lesson with good cultural responsiveness. Students were engaged and the teacher used effective questioning techniques.',
    classInfo: {
      name: 'Pre-Calculus',
      subject: 'Mathematics',
      room: 'B205',
      period: 'Period 3',
      grade: '11th Grade'
    },
    crpEvidenceCount: 7,
    totalLookFors: 12
  },
  {
    teacherId: 'teacher2',
    teacherName: 'Emily Wilson',
    observerId: 'observer1',
    observerName: 'Ms. Davis',
    frameworkId: 'casel-framework',
    date: '2025-01-24',
    startTime: new Date('2025-01-24T10:45:00').toISOString(),
    duration: 0,
    status: 'in-progress',
    responses: {},
    comments: {},
    overallComment: '',
    classInfo: {
      name: 'Language Arts',
      subject: 'English',
      room: 'A108',
      period: 'Period 4',
      grade: '9th Grade'
    }
  },
  {
    teacherId: 'teacher3',
    teacherName: 'Sarah Chen',
    observerId: 'observer2',
    observerName: 'Dr. Martinez',
    frameworkId: 'crp-in-action',
    date: '2025-01-23',
    startTime: new Date('2025-01-23T08:50:00').toISOString(),
    endTime: new Date('2025-01-23T09:35:00').toISOString(),
    duration: 45,
    status: 'completed',
    responses: {
      'q1': { questionId: 'q1', value: 5, timestamp: new Date().toISOString() },
      'q2': { questionId: 'q2', value: 4, timestamp: new Date().toISOString() },
      'q3': { questionId: 'q3', value: 3, timestamp: new Date().toISOString() }
    },
    comments: {
      'q1': 'Excellent cultural connections made',
      'q2': 'Students actively participated',
      'q3': 'Room for improvement in differentiation'
    },
    overallComment: 'Outstanding lesson that incorporated multiple cultural perspectives. Students were highly engaged and the teacher made excellent connections to their lived experiences.',
    classInfo: {
      name: 'Biology',
      subject: 'Science',
      room: 'C302',
      period: 'Period 2',
      grade: '8th Grade'
    },
    crpEvidenceCount: 9,
    totalLookFors: 15
  },
  {
    teacherId: 'teacher4',
    teacherName: 'David Martinez',
    observerId: 'observer1',
    observerName: 'Dr. Sarah Johnson',
    frameworkId: 'tripod-7cs',
    date: '2025-01-26',
    startTime: new Date('2025-01-26T08:00:00').toISOString(),
    duration: 0,
    status: 'draft',
    responses: {},
    comments: {},
    overallComment: '',
    classInfo: {
      name: 'World History',
      subject: 'Social Studies',
      room: 'D101',
      period: 'Period 1',
      grade: '10th Grade'
    }
  }
];

export async function seedObservations() {
  console.log('Starting to seed observations...');
  
  try {
    for (const observation of sampleObservations) {
      const id = await observationOperations.create(observation);
      console.log(`Created observation for ${observation.teacherName} with ID: ${id}`);
    }
    console.log('Successfully seeded all observations!');
  } catch (error) {
    console.error('Error seeding observations:', error);
    throw error;
  }
}

export { sampleObservations };
