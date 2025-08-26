// src/api/dashboardApi.ts
// Handles external API calls for dashboard data

import { DashboardStats, Observation } from '../types';

export async function fetchDashboardData(): Promise<{
  stats: DashboardStats;
  recentObservations: Observation[];
}> {
  // Mock data that matches your types - replace with real API endpoint
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  return {
    stats: {
      totalObservations: 247,
      activeObservers: 68,
      crpEvidenceRate: 0.68,
      weeklyObservations: 18,
      goalProgress: {
        current: 247,
        target: 5000,
        percentage: 4.94
      }
    },
    recentObservations: [
      {
        id: '1',
        teacherId: 'teacher-1',
        teacherName: 'Sarah Johnson',
        observerId: 'observer-1',
        observerName: 'Dr. Emily Wilson',
        frameworkId: 'crp-in-action',
        date: '2025-08-19',
        startTime: '09:00',
        endTime: '09:45',
        duration: 45,
        status: 'completed',
        responses: {},
        comments: {},
        overallComment: 'Strong evidence of culturally responsive practices throughout the lesson.',
        classInfo: {
          name: 'Advanced Mathematics',
          subject: 'Mathematics',
          room: '204',
          period: '2nd',
          grade: '5th Grade'
        }
      },
      {
        id: '2',
        teacherId: 'teacher-2',
        teacherName: 'Michael Brown',
        observerId: 'observer-2',
        observerName: 'Dr. David Chen',
        frameworkId: 'crp-in-action',
        date: '2025-08-19',
        startTime: '10:30',
        endTime: '11:15',
        duration: 45,
        status: 'completed',
        responses: {},
        comments: {},
        overallComment: 'Good integration of student cultural backgrounds in science concepts.',
        classInfo: {
          name: 'Earth Science',
          subject: 'Science',
          room: '108',
          period: '3rd',
          grade: '3rd Grade'
        }
      }
    ]
  };
}
