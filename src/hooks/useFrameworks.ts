// Framework Management Hook
import { useState, useEffect, useCallback } from 'react';
import { frameworkOperations } from '../firebase/firestore';
import { Framework } from '../types';

export const useFrameworks = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load frameworks
  const loadFrameworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await frameworkOperations.getAll();
      setFrameworks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load frameworks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = frameworkOperations.subscribe((data) => {
      setFrameworks(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Create new framework
  const createFramework = async (framework: Omit<Framework, 'id'>): Promise<string | null> => {
    try {
      setError(null);
      const id = await frameworkOperations.create(framework);
      // Frameworks will update via subscription
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create framework';
      setError(errorMessage);
      return null;
    }
  };

  // Update framework
  const updateFramework = async (id: string, updates: Partial<Framework>): Promise<boolean> => {
    try {
      setError(null);
      await frameworkOperations.update(id, updates);
      // Frameworks will update via subscription
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update framework';
      setError(errorMessage);
      return false;
    }
  };

  // Delete framework
  const deleteFramework = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await frameworkOperations.delete(id);
      // Frameworks will update via subscription
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete framework';
      setError(errorMessage);
      return false;
    }
  };

  // Get framework by ID
  const getFrameworkById = (id: string): Framework | undefined => {
    return frameworks.find(framework => framework.id === id);
  };

  // Get active frameworks
  const getActiveFrameworks = (): Framework[] => {
    return frameworks.filter(framework => framework.status === 'active');
  };

  // Search frameworks
  const searchFrameworks = (searchTerm: string): Framework[] => {
    const term = searchTerm.toLowerCase();
    return frameworks.filter(framework =>
      framework.name.toLowerCase().includes(term) ||
      framework.description.toLowerCase().includes(term) ||
      framework.tags.some(tag => tag.toLowerCase().includes(term))
    );
  };

  return {
    frameworks,
    loading,
    error,
    loadFrameworks,
    createFramework,
    updateFramework,
    deleteFramework,
    getFrameworkById,
    getActiveFrameworks,
    searchFrameworks,
    clearError: () => setError(null)
  };
};
