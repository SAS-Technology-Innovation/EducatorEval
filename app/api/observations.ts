// Observation API Client - Direct Firestore Operations
// Refactored to use Firestore directly instead of non-existent API endpoints

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { coreApi } from './core';
import type { Observation, Framework, ObservationResponse, CRPStatistics } from '../types';

// Get environment-based collection prefix
const getCollectionPrefix = (): string => {
  const env = import.meta.env.VITE_ENVIRONMENT || 'staging';
  return env === 'production' ? '' : 'staging_';
};

// Get prefixed collection name
const getCollection = (name: string): string => `${getCollectionPrefix()}${name}`;

// Convert Firestore timestamp to Date
const toDate = (timestamp: unknown): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  return undefined;
};

// Observation filters interface
interface ObservationFilters {
  subjectId?: string;
  observerId?: string;
  schoolId?: string;
  divisionId?: string;
  departmentId?: string;
  frameworkId?: string;
  status?: 'draft' | 'completed' | 'submitted' | 'reviewed';
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

// Framework filters interface
interface FrameworkFilters {
  status?: 'active' | 'draft' | 'archived' | 'deprecated';
  type?: string;
  schoolId?: string;
}

export const observationsApi = {
  // Framework management - Direct Firestore operations
  frameworks: {
    list: async (filters?: FrameworkFilters): Promise<Framework[]> => {
      const constraints = [];

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters?.type) {
        constraints.push(where('type', '==', filters.type));
      }
      if (filters?.schoolId) {
        constraints.push(where('schoolId', '==', filters.schoolId));
      }

      constraints.push(orderBy('name'));

      const q = query(collection(db, getCollection('frameworks')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
        lastUsed: toDate(doc.data().lastUsed),
      })) as Framework[];
    },

    getById: async (id: string): Promise<Framework | null> => {
      const docRef = doc(db, getCollection('frameworks'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          lastUsed: toDate(data.lastUsed),
        } as Framework;
      }
      return null;
    },

    create: async (frameworkData: Partial<Framework>): Promise<Framework> => {
      const now = Timestamp.now();
      const newFramework = {
        ...frameworkData,
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('frameworks')), newFramework);
      const created = await observationsApi.frameworks.getById(docRef.id);
      if (!created) throw new Error('Failed to create framework');
      return created;
    },

    update: async (id: string, updates: Partial<Framework>): Promise<Framework> => {
      const docRef = doc(db, getCollection('frameworks'), id);
      await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
      const updated = await observationsApi.frameworks.getById(id);
      if (!updated) throw new Error('Framework not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('frameworks'), id));
      return { success: true };
    },

    // Increment usage count when a framework is used
    incrementUsage: async (id: string): Promise<void> => {
      const docRef = doc(db, getCollection('frameworks'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().usageCount || 0;
        await updateDoc(docRef, {
          usageCount: currentCount + 1,
          lastUsed: Timestamp.now(),
        });
      }
    },
  },

  // Observation management - Direct Firestore operations
  observations: {
    list: async (filters?: ObservationFilters): Promise<Observation[]> => {
      const constraints = [];

      if (filters?.subjectId) {
        constraints.push(where('subjectId', '==', filters.subjectId));
      }
      if (filters?.observerId) {
        constraints.push(where('observerId', '==', filters.observerId));
      }
      if (filters?.schoolId) {
        constraints.push(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.divisionId) {
        constraints.push(where('divisionId', '==', filters.divisionId));
      }
      if (filters?.departmentId) {
        constraints.push(where('departmentId', '==', filters.departmentId));
      }
      if (filters?.frameworkId) {
        constraints.push(where('frameworkId', '==', filters.frameworkId));
      }
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      // Date range filtering
      if (filters?.dateFrom) {
        constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
      }
      if (filters?.dateTo) {
        constraints.push(where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters?.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, getCollection('observations')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
        submittedAt: toDate(doc.data().submittedAt),
        reviewedAt: toDate(doc.data().reviewedAt),
      })) as Observation[];
    },

    getById: async (id: string): Promise<Observation | null> => {
      const docRef = doc(db, getCollection('observations'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          submittedAt: toDate(data.submittedAt),
          reviewedAt: toDate(data.reviewedAt),
        } as Observation;
      }
      return null;
    },

    // Create a new observation (draft by default)
    create: async (observationData: Partial<Observation>): Promise<Observation> => {
      const now = Timestamp.now();

      // Calculate evidence metrics
      const responses = observationData.responses || [];
      const evidenceCount = responses.filter(r =>
        r.rating && r.rating !== '0' && r.rating !== 'not-observed'
      ).length;
      const totalQuestions = responses.length;
      const evidencePercentage = totalQuestions > 0 ? (evidenceCount / totalQuestions) * 100 : 0;

      const newObservation: Partial<Observation> = {
        ...observationData,
        status: observationData.status || 'draft',
        evidenceCount,
        totalQuestions,
        evidencePercentage,
        version: 1,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };

      const docRef = await addDoc(collection(db, getCollection('observations')), {
        ...newObservation,
        createdAt: now,
        updatedAt: now,
      });

      // Increment framework usage if framework is specified
      if (observationData.frameworkId) {
        await observationsApi.frameworks.incrementUsage(observationData.frameworkId);
      }

      return {
        ...newObservation,
        id: docRef.id,
      } as Observation;
    },

    // Create observation with schedule auto-population
    createWithSchedule: async (observationData: {
      subjectId: string;
      observerId: string;
      observerName: string;
      frameworkId: string;
      frameworkName: string;
      schoolId: string;
      date?: Date;
    }): Promise<Observation> => {
      // Get current class info from schedule
      const scheduleInfo = await coreApi.schedules.getCurrentClass(
        observationData.subjectId,
        observationData.date
      );

      // Get subject (teacher) info
      const subject = await coreApi.users.getById(observationData.subjectId);
      if (!subject) throw new Error('Subject (teacher) not found');

      const now = observationData.date || new Date();

      const observationWithSchedule: Partial<Observation> = {
        ...observationData,
        subjectName: `${subject.firstName} ${subject.lastName}`,
        divisionId: subject.divisionId,
        departmentId: subject.primaryDepartmentId,
        context: {
          type: 'classroom',
          className: scheduleInfo.class?.className,
          subject: scheduleInfo.class?.subject,
          grade: scheduleInfo.class?.grade,
          room: scheduleInfo.class?.roomNumber,
          period: scheduleInfo.class?.periods?.[0],
          date: now,
          startTime: now,
          duration: 0,
        },
        frameworkVersion: '1.0',
        responses: [],
        overallComments: '',
        status: 'draft',
      };

      return observationsApi.observations.create(observationWithSchedule);
    },

    // Update an observation
    update: async (id: string, updates: Partial<Observation>): Promise<Observation> => {
      const docRef = doc(db, getCollection('observations'), id);
      const existing = await getDoc(docRef);

      if (!existing.exists()) {
        throw new Error('Observation not found');
      }

      // Recalculate evidence metrics if responses changed
      let evidenceUpdates = {};
      if (updates.responses) {
        const evidenceCount = updates.responses.filter(r =>
          r.rating && r.rating !== '0' && r.rating !== 'not-observed'
        ).length;
        const totalQuestions = updates.responses.length;
        const evidencePercentage = totalQuestions > 0 ? (evidenceCount / totalQuestions) * 100 : 0;

        evidenceUpdates = {
          evidenceCount,
          totalQuestions,
          evidencePercentage,
        };
      }

      const updateData = {
        ...updates,
        ...evidenceUpdates,
        updatedAt: Timestamp.now(),
        version: (existing.data().version || 0) + 1,
      };

      await updateDoc(docRef, updateData);
      const updated = await observationsApi.observations.getById(id);
      if (!updated) throw new Error('Observation not found after update');
      return updated;
    },

    // Save as draft
    saveDraft: async (id: string, updates: Partial<Observation>): Promise<Observation> => {
      return observationsApi.observations.update(id, {
        ...updates,
        status: 'draft',
      });
    },

    // Complete observation (mark as completed)
    complete: async (id: string, updates?: Partial<Observation>): Promise<Observation> => {
      return observationsApi.observations.update(id, {
        ...updates,
        status: 'completed',
      });
    },

    // Submit observation for review
    submit: async (id: string): Promise<Observation> => {
      const observation = await observationsApi.observations.getById(id);
      if (!observation) throw new Error('Observation not found');

      // Validate observation has required data before submitting
      if (!observation.responses || observation.responses.length === 0) {
        throw new Error('Cannot submit observation without responses');
      }

      return observationsApi.observations.update(id, {
        status: 'submitted',
        submittedAt: new Date(),
      });
    },

    // Mark observation as reviewed
    review: async (id: string, feedback?: string): Promise<Observation> => {
      return observationsApi.observations.update(id, {
        status: 'reviewed',
        reviewedAt: new Date(),
        followUpNotes: feedback,
      });
    },

    // Delete observation (soft delete by setting status, or hard delete)
    delete: async (id: string, hardDelete: boolean = false): Promise<{ success: boolean }> => {
      if (hardDelete) {
        await deleteDoc(doc(db, getCollection('observations'), id));
      } else {
        // Soft delete - just mark as archived
        await updateDoc(doc(db, getCollection('observations'), id), {
          status: 'archived',
          updatedAt: Timestamp.now(),
        });
      }
      return { success: true };
    },

    // Get observations for a specific teacher
    getBySubject: async (subjectId: string, limit?: number): Promise<Observation[]> => {
      return observationsApi.observations.list({
        subjectId,
        limit,
      });
    },

    // Get observations by an observer
    getByObserver: async (observerId: string, limit?: number): Promise<Observation[]> => {
      return observationsApi.observations.list({
        observerId,
        limit,
      });
    },

    // Get draft observations for an observer
    getDrafts: async (observerId: string): Promise<Observation[]> => {
      return observationsApi.observations.list({
        observerId,
        status: 'draft',
      });
    },
  },

  // Analytics - Calculated from Firestore data (no external API needed)
  analytics: {
    // Get dashboard statistics
    getDashboardStats: async (filters?: {
      schoolId?: string;
      divisionId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }): Promise<{
      totalObservations: number;
      completedObservations: number;
      draftObservations: number;
      averageEvidenceRate: number;
      observationsByStatus: Record<string, number>;
    }> => {
      const observations = await observationsApi.observations.list({
        schoolId: filters?.schoolId,
        divisionId: filters?.divisionId,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
      });

      const totalObservations = observations.length;
      const completedObservations = observations.filter(o => o.status === 'completed' || o.status === 'reviewed').length;
      const draftObservations = observations.filter(o => o.status === 'draft').length;

      const totalEvidence = observations.reduce((sum, o) => sum + (o.evidencePercentage || 0), 0);
      const averageEvidenceRate = totalObservations > 0 ? totalEvidence / totalObservations : 0;

      const observationsByStatus = observations.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalObservations,
        completedObservations,
        draftObservations,
        averageEvidenceRate,
        observationsByStatus,
      };
    },

    // Get CRP-specific statistics
    getCRPStats: async (filters?: {
      schoolId?: string;
      divisionId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }): Promise<CRPStatistics> => {
      const observations = await observationsApi.observations.list({
        schoolId: filters?.schoolId,
        divisionId: filters?.divisionId,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
      });

      const totalObservations = observations.length;

      // Calculate CRP metrics from observations
      const totalCRPScore = observations.reduce((sum, o) => sum + (o.crpPercentage || 0), 0);
      const averageCRPScore = totalObservations > 0 ? totalCRPScore / totalObservations : 0;

      const totalEvidence = observations.reduce((sum, o) => sum + (o.crpEvidenceCount || 0), 0);
      const totalLookFors = observations.reduce((sum, o) => sum + (o.totalLookFors || 0), 0);
      const evidenceRate = totalLookFors > 0 ? (totalEvidence / totalLookFors) * 100 : 0;

      // Aggregate strengths and growth areas
      const strengthsMap = new Map<string, number>();
      const growthAreasMap = new Map<string, number>();

      observations.forEach(o => {
        o.strengths?.forEach(s => {
          strengthsMap.set(s, (strengthsMap.get(s) || 0) + 1);
        });
        o.growthAreas?.forEach(g => {
          growthAreasMap.set(g, (growthAreasMap.get(g) || 0) + 1);
        });
      });

      const topStrengths = Array.from(strengthsMap.entries())
        .map(([practice, count]) => ({ practice, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const growthAreas = Array.from(growthAreasMap.entries())
        .map(([practice, count]) => ({ practice, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Generate trend data (last 12 months)
      const trendData: { date: string; score: number }[] = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthObservations = observations.filter(o => {
          const obsDate = o.createdAt;
          return obsDate &&
            obsDate.getMonth() === monthDate.getMonth() &&
            obsDate.getFullYear() === monthDate.getFullYear();
        });

        const monthScore = monthObservations.length > 0
          ? monthObservations.reduce((sum, o) => sum + (o.crpPercentage || 0), 0) / monthObservations.length
          : 0;

        trendData.push({
          date: monthDate.toISOString().slice(0, 7), // "YYYY-MM"
          score: monthScore,
        });
      }

      return {
        totalObservations,
        averageCRPScore,
        evidenceRate,
        topStrengths,
        growthAreas,
        trendData,
        bySection: [], // Would need framework section data to populate
      };
    },

    // Get observation trends over time
    getObservationTrends: async (filters?: {
      schoolId?: string;
      divisionId?: string;
      months?: number;
    }): Promise<{ date: string; count: number; averageScore: number }[]> => {
      const monthsBack = filters?.months || 12;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - monthsBack);

      const observations = await observationsApi.observations.list({
        schoolId: filters?.schoolId,
        divisionId: filters?.divisionId,
        dateFrom: startDate,
      });

      // Group by month
      const monthlyData = new Map<string, { count: number; totalScore: number }>();

      observations.forEach(o => {
        if (o.createdAt) {
          const monthKey = o.createdAt.toISOString().slice(0, 7);
          const existing = monthlyData.get(monthKey) || { count: 0, totalScore: 0 };
          monthlyData.set(monthKey, {
            count: existing.count + 1,
            totalScore: existing.totalScore + (o.evidencePercentage || 0),
          });
        }
      });

      return Array.from(monthlyData.entries())
        .map(([date, data]) => ({
          date,
          count: data.count,
          averageScore: data.count > 0 ? data.totalScore / data.count : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
  },
};
