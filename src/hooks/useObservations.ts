// Observations Management Hook
import { useState, useEffect, useCallback } from 'react';
import { observationOperations } from '../firebase/firestore';
import { Observation } from '../types';
import { calculateCRPEvidence } from '../utils';
import { shouldUseMockData, mockObservationOperations } from '../services/mockData';

export const useObservations = (observerId?: string) => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    crpEvidenceAverage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Choose between mock and real operations
  const operations = shouldUseMockData() ? mockObservationOperations : observationOperations;

  // Load observations
  const loadObservations = useCallback(async () => {
    if (!observerId) return;
 console.log('Observer ID:', observerId);
    
    try {
      setLoading(true);
      setError(null);
      const data = await operations.getByObserver(observerId);
      setObservations(data);
    } catch (err) {
 console.error('Error loading observations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load observations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [observerId, operations]);

  // Load statistics
  const loadStats = useCallback(async () => {
    try {
      const statsData = await operations.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, [operations]);

  // Load data on mount
  useEffect(() => {
    loadObservations();
    loadStats();
  }, [loadObservations, loadStats]);

  // Create new observation
  const createObservation = async (observation: Omit<Observation, 'id'>): Promise<string | null> => {
    try {
      setError(null);
      
      // Calculate CRP evidence before saving
      const crpEvidenceCount = calculateCRPEvidence(observation.responses);
      const totalLookFors = Object.keys(observation.responses).length;
      
      const observationWithMetrics = {
        ...observation,
        crpEvidenceCount,
        totalLookFors
      };
      
      const id = await operations.create(observationWithMetrics);
      
      // Refresh data
      await loadObservations();
      await loadStats();
      
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create observation';
      setError(errorMessage);
      return null;
    }
  };

  // Update observation
  const updateObservation = async (id: string, updates: Partial<Observation>): Promise<boolean> => {
    try {
      setError(null);
      
      // Recalculate CRP evidence if responses changed
      let updatesWithMetrics = { ...updates };
      if (updates.responses) {
        const crpEvidenceCount = calculateCRPEvidence(updates.responses);
        const totalLookFors = Object.keys(updates.responses).length;
        updatesWithMetrics = {
          ...updates,
          crpEvidenceCount,
          totalLookFors
        };
      }
      
      await operations.update(id, updatesWithMetrics);
      
      // Update local state
      setObservations(prev => prev.map(obs => 
        obs.id === id ? { ...obs, ...updatesWithMetrics } : obs
      ));
      
      // Refresh stats
      await loadStats();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update observation';
      setError(errorMessage);
      return false;
    }
  };

  // Get observation by ID
  const getObservationById = (id: string): Observation | undefined => {
    return observations.find(obs => obs.id === id);
  };

  // Get observations by status
  const getObservationsByStatus = (status: Observation['status']): Observation[] => {
    return observations.filter(obs => obs.status === status);
  };

  // Get observations by date range
  const getObservationsByDateRange = (startDate: Date, endDate: Date): Observation[] => {
    return observations.filter(obs => {
      const obsDate = new Date(obs.date);
      return obsDate >= startDate && obsDate <= endDate;
    });
  };

  // Get observations by teacher
  const getObservationsByTeacher = async (teacherId: string): Promise<Observation[]> => {
    try {
      setError(null);
      return await operations.getByTeacher(teacherId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load teacher observations';
      setError(errorMessage);
      return [];
    }
  };

  // Get recent observations with pagination
  const getRecentObservations = async (limit = 20) => {
    try {
      setError(null);
      const result = await operations.getRecent(limit);
      return result.observations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recent observations';
      setError(errorMessage);
      return [];
    }
  };

  // Calculate progress toward goal
  const getProgress = () => {
    const goal = 5000; // Goal from requirements
    const percentage = Math.min((stats.total / goal) * 100, 100);
    return {
      current: stats.total,
      goal,
      percentage: Math.round(percentage * 10) / 10
    };
  };

  // Search observations
  const searchObservations = useCallback(async (query: string, filters?: { status?: string[] }) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with actual Firebase query
      let filtered = [...observations];
      
      if (query.trim()) {
        filtered = filtered.filter(obs => 
          obs.teacherName.toLowerCase().includes(query.toLowerCase()) ||
          obs.observerName.toLowerCase().includes(query.toLowerCase()) ||
          obs.overallComment.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter(obs => filters.status!.includes(obs.status));
      }
      
      setObservations(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search observations');
    } finally {
      setLoading(false);
    }
  }, [observations]);

  // Filter observations
  const filterObservations = useCallback(async (filters: { status?: string[], dateRange?: { start: string, end: string } }) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with actual Firebase query
      let filtered = [...observations];
      
      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(obs => filters.status!.includes(obs.status));
      }
      
      if (filters.dateRange) {
        filtered = filtered.filter(obs => {
          const obsDate = new Date(obs.date);
          const startDate = new Date(filters.dateRange!.start);
          const endDate = new Date(filters.dateRange!.end);
          return obsDate >= startDate && obsDate <= endDate;
        });
      }
      
      setObservations(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter observations');
    } finally {
      setLoading(false);
    }
  }, [observations]);

  return {
    observations,
    stats,
    loading,
    error,
    createObservation,
    updateObservation,
    getObservationById,
    getObservationsByStatus,
    getObservationsByDateRange,
    getObservationsByTeacher,
    getRecentObservations,
    getProgress,
    loadObservations,
    loadStats,
    searchObservations,
    filterObservations,
    clearError: () => setError(null)
  };
};
