// Utility functions for the CRP Observation System

import { FrameworkAlignment } from '../types';

/**
 * Get CSS classes for framework color styling
 */
export const getFrameworkColorClasses = (color: string): string => {
  const colorMap = {
    green: 'bg-green-100 text-green-800 border-green-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };
  return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Calculate CRP evidence percentage from observation responses
 */
export const calculateCRPEvidence = (responses: Record<string, any>): number => {
  const validResponses = Object.values(responses).filter(response => 
    response && response !== 'not-observed' && !isNaN(Number(response))
  );
  
  if (validResponses.length === 0) return 0;
  
  const evidenceCount = validResponses.filter(response => Number(response) >= 3).length;
  return Math.round((evidenceCount / validResponses.length) * 100);
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate observation duration in minutes
 */
export const calculateDuration = (startTime: string, endTime?: string): number => {
  if (!endTime) return 0;
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
