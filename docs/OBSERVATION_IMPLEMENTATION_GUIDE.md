# Observation System - Implementation Guide

This guide provides code snippets and step-by-step instructions for implementing role-based observation features.

---

## Phase 1: Add Role-Based API Filtering

### Step 1: Update observations.ts API

**File:** `/app/api/observations.ts`

The API already supports filtering by `educatorId` and `observerId`. We need to:
1. Make the hook automatically add these filters based on user role
2. Add a helper function to generate appropriate filters based on role

```typescript
// Add this helper function to observations.ts

/**
 * Generate observation list filters based on user role
 * Ensures users only see observations they have permission to see
 */
export const getObservationFiltersForUser = (
  userId: string, 
  userRole: UserRole, 
  schoolId: string
): Record<string, any> => {
  
  if (userRole === 'super_admin' || userRole === 'administrator') {
    // Admins see all observations in their school
    return { schoolId };
  }
  
  if (userRole === 'manager') {
    // Managers see observations of their team members
    // NOTE: This would require a team lookup - for now, return schoolId
    // TODO: Filter by manager's managed educators
    return { schoolId };
  }
  
  if (userRole === 'observer') {
    // Observers see observations they conducted
    return { 
      schoolId,
      observerId: userId 
    };
  }
  
  if (userRole === 'educator' || userRole === 'staff') {
    // Teachers see observations where they are the subject
    // IMPORTANT: Educators should also see observations they conducted
    return { 
      schoolId,
      // Users see observations of them AND observations they conducted
      // Note: Firebase doesn't support OR filters directly
      // Solution: Fetch both sets and merge on client
    };
  }
  
  return { schoolId };
};
```

### Step 2: Create Role-Specific Hooks

**File:** `/app/hooks/useObservations.ts`

Update the existing hook and add new specialized hooks:

```typescript
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationApi } from '../api';
import { observationsApi } from '../api/observations';
import type { Observation } from '../types';
import { useAuthStore } from '../stores/auth';

/**
 * Observations specific to user's role
 * Teachers see: observations of them + observations they conducted
 * Observers see: observations they conducted
 * Managers see: observations of their team
 * Admins see: all observations
 */
export const useObservations = (schoolId?: string) => {
  const user = useAuthStore(state => state.user);
  const isBrowser = typeof window !== 'undefined';

  return useQuery({
    queryKey: ['observations', schoolId || user?.id],
    queryFn: () => observationsApi.observations.list({ schoolId }),
    enabled: isBrowser && !!user,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Observations where the current user is the subject (being observed)
 * Used by teachers to see observations of their teaching
 */
export const useMyObservations = () => {
  const user = useAuthStore(state => state.user);
  const isBrowser = typeof window !== 'undefined';

  return useQuery({
    queryKey: ['my-observations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return observationsApi.observations.list({
        educatorId: user.id  // Where I am the subject
      });
    },
    enabled: isBrowser && !!user,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Observations the current user conducted
 * Used by observers to see observations they performed
 */
export const useObservationsConducted = () => {
  const user = useAuthStore(state => state.user);
  const isBrowser = typeof window !== 'undefined';

  return useQuery({
    queryKey: ['observations-conducted', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return observationsApi.observations.list({
        observerId: user.id  // Where I am the observer
      });
    },
    enabled: isBrowser && !!user && user.primaryRole === 'observer',
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Observations for a specific educator (by subject ID)
 * Used by managers/admins to view observations of specific teachers
 */
export const useEducatorObservations = (educatorId?: string) => {
  const isBrowser = typeof window !== 'undefined';

  return useQuery({
    queryKey: ['educator-observations', educatorId],
    queryFn: async () => {
      if (!educatorId) return [];
      return observationsApi.observations.list({
        educatorId
      });
    },
    enabled: isBrowser && !!educatorId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Observations with status filter
 * Useful for seeing specific status observations
 */
export const useObservationsByStatus = (status: 'draft' | 'completed' | 'submitted' | 'reviewed') => {
  const user = useAuthStore(state => state.user);
  const isBrowser = typeof window !== 'undefined';

  return useQuery({
    queryKey: ['observations-status', user?.id, status],
    queryFn: async () => {
      if (!user?.id) return [];
      return observationsApi.observations.list({
        educatorId: user.id,
        status
      });
    },
    enabled: isBrowser && !!user,
    staleTime: 1000 * 60 * 5,
  });
};

// Keep existing mutations...
export const useCreateObservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>) => 
      observationsApi.observations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      queryClient.invalidateQueries({ queryKey: ['observations-conducted'] });
    },
  });
};

export const useUpdateObservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Observation> }) => 
      observationsApi.observations.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      queryClient.invalidateQueries({ queryKey: ['observations-conducted'] });
      queryClient.invalidateQueries({ queryKey: ['observation', id] });
    },
  });
};

export const useDeleteObservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => observationsApi.observations.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      queryClient.invalidateQueries({ queryKey: ['observations-conducted'] });
    },
  });
};

// Existing subscriptions...
export const useObservationSubscription = (observationId: string, callback: (observation: Observation) => void) => {
  return useQuery({
    queryKey: ['observation-subscription', observationId],
    queryFn: () => {
      const unsubscribe = observationApi.subscribe(observationId, callback);
      return unsubscribe;
    },
    enabled: !!observationId,
  });
};
```

---

## Phase 2: Create Role-Specific Views

### TeacherObservationsView.tsx

**Location:** `/app/components/features/observations/TeacherObservationsView.tsx`

```typescript
import React, { useState, useMemo } from 'react';
import { useMyObservations, useObservationsConducted } from '../../../hooks/useObservations';
import { useAuthStore } from '../../../stores/auth';
import {
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Alert
} from 'lucide-react';

interface TeacherObservationsViewProps {
  onCreateNew?: () => void;
}

export default function TeacherObservationsView({ onCreateNew }: TeacherObservationsViewProps) {
  const user = useAuthStore(state => state.user);
  const { data: myObservations, isLoading: loadingMine } = useMyObservations();
  const { data: conducted, isLoading: loadingConducted } = useObservationsConducted();

  const [activeTab, setActiveTab] = useState<'received' | 'conducted'>('received');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter by search term
  const filteredObservations = useMemo(() => {
    const observations = activeTab === 'received' ? (myObservations || []) : (conducted || []);
    
    return observations.filter(obs => {
      const searchLower = searchTerm.toLowerCase();
      return (
        obs.observerName?.toLowerCase().includes(searchLower) ||
        obs.frameworkName?.toLowerCase().includes(searchLower) ||
        obs.context?.subject?.toLowerCase().includes(searchLower)
      );
    });
  }, [myObservations, conducted, activeTab, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const observations = activeTab === 'received' ? (myObservations || []) : (conducted || []);
    
    return {
      total: observations.length,
      completed: observations.filter(obs => obs.status === 'completed').length,
      submitted: observations.filter(obs => obs.status === 'submitted').length,
      reviewed: observations.filter(obs => obs.status === 'reviewed').length,
      avgScore: observations.length > 0
        ? Math.round(
            observations.reduce((sum, obs) => sum + (obs.crpPercentage || 0), 0) / observations.length
          )
        : 0
    };
  }, [myObservations, conducted, activeTab]);

  const isLoading = activeTab === 'received' ? loadingMine : loadingConducted;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Observations</h1>
              <p className="text-gray-600 mt-1">View feedback and observations of your teaching</p>
            </div>
            <div className="flex items-center space-x-3">
              {user?.secondaryRoles?.includes('observer') && (
                <button
                  onClick={onCreateNew}
                  className="bg-sas-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sas-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Observation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-sas-blue-600 text-sas-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Observations of Me
          </button>
          {user?.secondaryRoles?.includes('observer') && (
            <button
              onClick={() => setActiveTab('conducted')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'conducted'
                  ? 'border-sas-blue-600 text-sas-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Observations I Conducted
            </button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sas-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-sas-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">With Feedback</p>
                <p className="text-lg font-bold text-gray-900">{stats.reviewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sas-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sas-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg CRP Score</p>
                <p className="text-lg font-bold text-gray-900">{stats.avgScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search observations..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-sas-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading observations...</div>
          ) : filteredObservations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Alert className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'received' ? 'No observations yet' : 'You haven\'t conducted any observations'}
              </h3>
              <p className="text-gray-600">
                {activeTab === 'received'
                  ? 'Observers will record their observations of your teaching here'
                  : 'Start conducting observations to build evidence of teaching quality'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredObservations.map((observation) => (
                <div key={observation.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {activeTab === 'received'
                            ? observation.observerName
                            : observation.subjectName}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          observation.status === 'reviewed'
                            ? 'bg-green-100 text-green-800'
                            : observation.status === 'submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {observation.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                        <div>
                          <span className="font-medium">Framework:</span> {observation.frameworkName}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {
                            new Date(observation.context?.date).toLocaleDateString()
                          }
                        </div>
                        <div>
                          <span className="font-medium">CRP Score:</span> {observation.crpPercentage}%
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {observation.context?.duration} min
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <button className="p-2 text-gray-400 hover:text-sas-blue-600 hover:bg-sas-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 3: Update Main ObservationsPage

**File:** `/app/components/features/observations/ObservationsPage.tsx`

Update the main page to dispatch to role-specific views:

```typescript
import React from 'react';
import { useAuthStore } from '../../../stores/auth';
import TeacherObservationsView from './TeacherObservationsView';
import ObserverObservationsView from './ObserverObservationsView';
import ManagerObservationsView from './ManagerObservationsView';
import AdminObservationsView from './AdminObservationsView';

interface ObservationsPageProps {
  onCreateNew?: () => void;
}

export default function ObservationsPage({ onCreateNew }: ObservationsPageProps) {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600">Please sign in to view observations</p>
        </div>
      </div>
    );
  }

  // Route to role-specific view
  if (user.primaryRole === 'super_admin' || user.primaryRole === 'administrator') {
    return <AdminObservationsView onCreateNew={onCreateNew} />;
  }

  if (user.primaryRole === 'manager') {
    return <ManagerObservationsView onCreateNew={onCreateNew} />;
  }

  if (user.primaryRole === 'observer') {
    return <ObserverObservationsView onCreateNew={onCreateNew} />;
  }

  // Default for educator and staff - teacher view
  return <TeacherObservationsView onCreateNew={onCreateNew} />;
}
```

---

## Key Implementation Notes

1. **Query Key Strategy**: Uses user ID in query key to separate caches by user
2. **Stale Time**: 5 minutes - balance between fresh data and performance
3. **Enabled Condition**: Prevents queries from running before user is loaded
4. **Role Dispatch**: Main component routes to appropriate view based on user role
5. **Filtering**: Initially done client-side, but should be enforced server-side for security

---

## Next Steps

1. Create role-specific view components (TeacherObservationsView, ObserverObservationsView, etc.)
2. Update API layer to add server-side filtering for security
3. Add observation creation workflow for observers
4. Implement observation scheduling with consent
5. Add feedback/review forms

---

## Testing Checklist

- [ ] Teacher sees only observations where they are the subject
- [ ] Observer sees only observations they conducted
- [ ] Manager sees observations of their team members
- [ ] Admin sees all observations
- [ ] Statistics calculate correctly for filtered observations
- [ ] Search/filter works within role context
- [ ] No unauthorized access via URL changes

