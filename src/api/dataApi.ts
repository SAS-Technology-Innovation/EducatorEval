// src/api/dataApi.ts
// Handles external API calls for data management

import { ProcessingJob, ApiConnection } from '../types';

export async function fetchData(): Promise<{
  processingJobs: ProcessingJob[];
  apiConnections: ApiConnection[];
}> {
  // Mock data that matches your types - replace with real API endpoint
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  return {
    processingJobs: [
      {
        id: '1',
        type: 'CSV Import',
        filename: 'teachers_data.csv',
        status: 'completed',
        progress: 100,
        records: 150,
        errors: 0,
        startTime: '2025-08-20 14:30',
        endTime: '2025-08-20 14:32'
      },
      {
        id: '2',
        type: 'BigQuery Sync',
        source: 'Student Analytics',
        status: 'processing',
        progress: 65,
        records: 2847,
        errors: 3,
        startTime: '2025-08-20 15:00'
      },
      {
        id: '3',
        type: 'API Import',
        source: 'SIS Integration',
        status: 'failed',
        progress: 45,
        records: 0,
        errors: 15,
        startTime: '2025-08-20 13:15',
        endTime: '2025-08-20 13:20'
      }
    ],
    apiConnections: [
      {
        id: '1',
        name: 'Student Information System',
        type: 'SIS',
        status: 'connected',
        lastSync: '2025-08-20 12:00',
        endpoint: 'https://sis.school.edu/api',
        recordCount: 2450,
        configuration: { syncInterval: 'daily' }
      },
      {
        id: '2',
        name: 'Google Classroom',
        type: 'LMS',
        status: 'connected',
        lastSync: '2025-08-20 11:15',
        endpoint: 'https://classroom.googleapis.com/v1',
        recordCount: 5680,
        configuration: { permissions: 'read-only' }
      }
    ]
  };
}
