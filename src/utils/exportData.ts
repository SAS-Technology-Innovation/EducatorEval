// Data export utilities
import { Framework, Observation, Teacher, User } from '../types';
import { formatDate, formatDateTime } from './index';

/**
 * Convert data to CSV format
 */
export const exportToCSV = <T>(data: T[], headers: { key: keyof T; label: string }[]): string => {
  if (data.length === 0) {
    return '';
  }

  // Create CSV headers
  const csvHeaders = headers.map(h => `"${h.label}"`).join(',');
  
  // Create CSV rows
  const csvRows = data.map(item => {
    return headers.map(header => {
      const value = item[header.key];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '""';
      }
      
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      }
      
      if (typeof value === 'object') {
        return `"${JSON.stringify(value)}"`;
      }
      
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Export observations data to CSV
 */
export const exportObservationsToCSV = (observations: Observation[]): string => {
  const headers = [
    { key: 'id' as keyof Observation, label: 'Observation ID' },
    { key: 'date' as keyof Observation, label: 'Date' },
    { key: 'teacherName' as keyof Observation, label: 'Teacher Name' },
    { key: 'observerName' as keyof Observation, label: 'Observer Name' },
    { key: 'duration' as keyof Observation, label: 'Duration (minutes)' },
    { key: 'status' as keyof Observation, label: 'Status' },
    { key: 'crpEvidenceCount' as keyof Observation, label: 'CRP Evidence Count' },
    { key: 'totalLookFors' as keyof Observation, label: 'Total Look-Fors' },
    { key: 'overallComment' as keyof Observation, label: 'Overall Comments' }
  ];

  // Transform observations for better CSV output
  const transformedData = observations.map(obs => ({
    ...obs,
    date: formatDate(obs.date),
    crpEvidenceCount: obs.crpEvidenceCount ?? 0,
    totalLookFors: obs.totalLookFors ?? 0
  }));

  return exportToCSV(transformedData, headers);
};

/**
 * Export detailed observations data with responses to CSV
 */
export const exportDetailedObservationsToCSV = (observations: Observation[]): string => {
  const detailedData = observations.flatMap(obs => {
    const responses = Object.entries(obs.responses || {});
    
    if (responses.length === 0) {
      return [{
        observationId: obs.id,
        date: formatDate(obs.date),
        teacherName: obs.teacherName,
        observerName: obs.observerName,
        questionId: '',
        questionResponse: '',
        comments: obs.overallComment || ''
      }];
    }
    
    return responses.map(([questionId, response]) => ({
      observationId: obs.id,
      date: formatDate(obs.date),
      teacherName: obs.teacherName,
      observerName: obs.observerName,
      questionId,
      questionResponse: typeof response.value === 'object' 
        ? JSON.stringify(response.value) 
        : String(response.value),
      comments: obs.comments?.[questionId] || ''
    }));
  });

  const headers = [
    { key: 'observationId' as const, label: 'Observation ID' },
    { key: 'date' as const, label: 'Date' },
    { key: 'teacherName' as const, label: 'Teacher Name' },
    { key: 'observerName' as const, label: 'Observer Name' },
    { key: 'questionId' as const, label: 'Question ID' },
    { key: 'questionResponse' as const, label: 'Response' },
    { key: 'comments' as const, label: 'Comments' }
  ];

  return exportToCSV(detailedData, headers);
};

/**
 * Export teachers data to CSV
 */
export const exportTeachersToCSV = (teachers: Teacher[]): string => {
  const headers = [
    { key: 'id' as keyof Teacher, label: 'Teacher ID' },
    { key: 'name' as keyof Teacher, label: 'Name' },
    { key: 'email' as keyof Teacher, label: 'Email' },
    { key: 'department' as keyof Teacher, label: 'Department' },
    { key: 'grade' as keyof Teacher, label: 'Grade' },
    { key: 'subjects' as keyof Teacher, label: 'Subjects' }
  ];

  return exportToCSV(teachers, headers);
};

/**
 * Export frameworks data to CSV
 */
export const exportFrameworksToCSV = (frameworks: Framework[]): string => {
  const headers = [
    { key: 'id' as keyof Framework, label: 'Framework ID' },
    { key: 'name' as keyof Framework, label: 'Name' },
    { key: 'description' as keyof Framework, label: 'Description' },
    { key: 'version' as keyof Framework, label: 'Version' },
    { key: 'status' as keyof Framework, label: 'Status' },
    { key: 'lastModified' as keyof Framework, label: 'Last Modified' },
    { key: 'tags' as keyof Framework, label: 'Tags' }
  ];

  // Transform frameworks for better CSV output
  const transformedData = frameworks.map(framework => ({
    ...framework,
    lastModified: formatDate(framework.lastModified)
  }));

  return exportToCSV(transformedData, headers);
};

/**
 * Export users data to CSV (admin only)
 */
export const exportUsersToCSV = (users: User[]): string => {
  const headers = [
    { key: 'id' as keyof User, label: 'User ID' },
    { key: 'name' as keyof User, label: 'Name' },
    { key: 'email' as keyof User, label: 'Email' },
    { key: 'role' as keyof User, label: 'Role' },
    { key: 'department' as keyof User, label: 'Department' },
    { key: 'permissions' as keyof User, label: 'Permissions' },
    { key: 'lastLogin' as keyof User, label: 'Last Login' }
  ];

  // Transform users for better CSV output
  const transformedData = users.map(user => ({
    ...user,
    lastLogin: user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'
  }));

  return exportToCSV(transformedData, headers);
};

/**
 * Generate analytics report CSV
 */
export const exportAnalyticsToCSV = (observations: Observation[]): string => {
  // Calculate analytics by teacher
  const teacherAnalytics = observations.reduce((acc, obs) => {
    const teacherId = obs.teacherId;
    
    if (!acc[teacherId]) {
      acc[teacherId] = {
        teacherId,
        teacherName: obs.teacherName,
        totalObservations: 0,
        averageCRPEvidence: 0,
        completedObservations: 0,
        totalDuration: 0
      };
    }
    
    acc[teacherId].totalObservations++;
    acc[teacherId].totalDuration += obs.duration;
    
    if (obs.status === 'completed' || obs.status === 'submitted') {
      acc[teacherId].completedObservations++;
    }
    
    if (obs.crpEvidenceCount !== undefined) {
      // Calculate running average
      const currentAvg = acc[teacherId].averageCRPEvidence;
      const count = acc[teacherId].completedObservations;
      acc[teacherId].averageCRPEvidence = 
        (currentAvg * (count - 1) + obs.crpEvidenceCount) / count;
    }
    
    return acc;
  }, {} as Record<string, {
    teacherId: string;
    teacherName: string;
    totalObservations: number;
    averageCRPEvidence: number;
    completedObservations: number;
    totalDuration: number;
  }>);

  const analyticsData = Object.values(teacherAnalytics).map(data => ({
    ...data,
    averageCRPEvidence: Math.round(data.averageCRPEvidence * 10) / 10,
    averageDuration: Math.round(data.totalDuration / data.totalObservations)
  }));

  const headers = [
    { key: 'teacherId' as const, label: 'Teacher ID' },
    { key: 'teacherName' as const, label: 'Teacher Name' },
    { key: 'totalObservations' as const, label: 'Total Observations' },
    { key: 'completedObservations' as const, label: 'Completed Observations' },
    { key: 'averageCRPEvidence' as const, label: 'Average CRP Evidence' },
    { key: 'averageDuration' as const, label: 'Average Duration (min)' }
  ];

  return exportToCSV(analyticsData, headers);
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export data to JSON format
 */
export const exportToJSON = <T>(data: T[], filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Parse CSV content to array of objects
 */
export const parseCSV = (csvContent: string): Array<Record<string, string>> => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
    const obj: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    data.push(obj);
  }

  return data;
};

/**
 * Generate bulk operations template CSV
 */
export const generateTemplateCSV = (type: 'teachers' | 'frameworks'): string => {
  if (type === 'teachers') {
    const headers = [
      { key: 'name' as const, label: 'Name' },
      { key: 'email' as const, label: 'Email' },
      { key: 'department' as const, label: 'Department' },
      { key: 'grade' as const, label: 'Grade' },
      { key: 'subjects' as const, label: 'Subjects (separated by semicolons)' }
    ];
    
    const sampleData = [
      {
        name: 'John Smith',
        email: 'john.smith@school.edu',
        department: 'Mathematics',
        grade: '9-10',
        subjects: 'Algebra; Geometry; Statistics'
      },
      {
        name: 'Jane Doe',
        email: 'jane.doe@school.edu',
        department: 'English',
        grade: '11-12',
        subjects: 'Literature; Writing; Speech'
      }
    ];
    
    return exportToCSV(sampleData, headers);
  }
  
  return '';
};
