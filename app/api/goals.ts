// Goals API - Firestore Operations for Goal Templates and User Goals
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
  writeBatch,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type {
  GoalTemplate,
  GoalType,
  UserGoal,
  UserGoalMilestone,
  UserGoalMeasurement,
  UserGoalReflection,
  GoalActivity,
  GoalActivityType
} from '../types';

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

// Template filters interface
interface TemplateFilters {
  schoolId?: string;
  type?: GoalType;
  status?: 'active' | 'draft' | 'archived';
  applicableDivision?: string;
  limit?: number;
}

// User goal filters interface
interface UserGoalFilters {
  userId?: string;
  schoolId?: string;
  templateId?: string;
  type?: GoalType;
  status?: string;
  mentorId?: string;
  supervisorId?: string;
  limit?: number;
}

export const goalsApi = {
  // ==================== Goal Templates (Admin) ====================
  templates: {
    list: async (filters?: TemplateFilters): Promise<GoalTemplate[]> => {
      const constraints: QueryConstraint[] = [];

      if (filters?.schoolId) {
        constraints.push(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.type) {
        constraints.push(where('type', '==', filters.type));
      }
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters?.applicableDivision) {
        constraints.push(where('applicableDivisions', 'array-contains', filters.applicableDivision));
      }

      constraints.push(orderBy('name'));

      if (filters?.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, getCollection('goal_templates')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
        lastUsed: toDate(doc.data().lastUsed),
      })) as GoalTemplate[];
    },

    getById: async (id: string): Promise<GoalTemplate | null> => {
      const docRef = doc(db, getCollection('goal_templates'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          lastUsed: toDate(data.lastUsed),
        } as GoalTemplate;
      }
      return null;
    },

    create: async (templateData: Partial<GoalTemplate>): Promise<GoalTemplate> => {
      const now = Timestamp.now();
      const newTemplate = {
        ...templateData,
        status: templateData.status || 'draft',
        usageCount: 0,
        averageCompletionRate: 0,
        version: 1,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollection('goal_templates')), newTemplate);
      const created = await goalsApi.templates.getById(docRef.id);
      if (!created) throw new Error('Failed to create goal template');
      return created;
    },

    update: async (id: string, updates: Partial<GoalTemplate>): Promise<GoalTemplate> => {
      const docRef = doc(db, getCollection('goal_templates'), id);

      // Get current version for increment
      const current = await goalsApi.templates.getById(id);
      if (!current) throw new Error('Template not found');

      const updateData = {
        ...updates,
        version: (current.version || 0) + 1,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
      const updated = await goalsApi.templates.getById(id);
      if (!updated) throw new Error('Template not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      const docRef = doc(db, getCollection('goal_templates'), id);
      await deleteDoc(docRef);
      return { success: true };
    },

    // Archive instead of delete (soft delete)
    archive: async (id: string): Promise<GoalTemplate> => {
      return goalsApi.templates.update(id, { status: 'archived' });
    },

    // Duplicate a template
    duplicate: async (id: string, newName?: string): Promise<GoalTemplate> => {
      const original = await goalsApi.templates.getById(id);
      if (!original) throw new Error('Template not found');

      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, usageCount, lastUsed, ...templateData } = original;

      return goalsApi.templates.create({
        ...templateData,
        name: newName || `${original.name} (Copy)`,
        status: 'draft',
      });
    },
  },

  // ==================== User Goals ====================
  goals: {
    list: async (filters?: UserGoalFilters): Promise<UserGoal[]> => {
      const constraints: QueryConstraint[] = [];

      if (filters?.userId) {
        constraints.push(where('userId', '==', filters.userId));
      }
      if (filters?.schoolId) {
        constraints.push(where('schoolId', '==', filters.schoolId));
      }
      if (filters?.templateId) {
        constraints.push(where('templateId', '==', filters.templateId));
      }
      if (filters?.type) {
        constraints.push(where('type', '==', filters.type));
      }
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters?.mentorId) {
        constraints.push(where('mentorId', '==', filters.mentorId));
      }
      if (filters?.supervisorId) {
        constraints.push(where('supervisorId', '==', filters.supervisorId));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters?.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, getCollection('goals')), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: toDate(doc.data().startDate),
        targetDate: toDate(doc.data().targetDate),
        completionDate: toDate(doc.data().completionDate),
        submittedAt: toDate(doc.data().submittedAt),
        approvedAt: toDate(doc.data().approvedAt),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as UserGoal[];
    },

    getById: async (id: string): Promise<UserGoal | null> => {
      const docRef = doc(db, getCollection('goals'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          startDate: toDate(data.startDate),
          targetDate: toDate(data.targetDate),
          completionDate: toDate(data.completionDate),
          submittedAt: toDate(data.submittedAt),
          approvedAt: toDate(data.approvedAt),
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        } as UserGoal;
      }
      return null;
    },

    // Create goal from template
    createFromTemplate: async (
      templateId: string,
      userId: string,
      goalData: Partial<UserGoal>
    ): Promise<UserGoal> => {
      const template = await goalsApi.templates.getById(templateId);
      if (!template) throw new Error('Template not found');

      const now = Timestamp.now();
      const startDate = goalData.startDate || new Date();
      const targetDate = goalData.targetDate ||
        new Date(startDate.getTime() + (template.defaultDuration * 24 * 60 * 60 * 1000));

      const newGoal: Partial<UserGoal> = {
        templateId,
        templateName: template.name,
        userId,
        schoolId: template.schoolId,
        type: template.type,
        status: template.requiresApproval ? 'draft' : 'active',
        progress: 0,
        priority: 'medium',
        collaboratorIds: [],
        frameworkAlignments: template.frameworkAlignments || [],
        relatedObservationIds: [],
        fieldValues: {},
        version: 1,
        ...goalData,
        startDate,
        targetDate,
      };

      const docRef = await addDoc(collection(db, getCollection('goals')), {
        ...newGoal,
        startDate: Timestamp.fromDate(startDate),
        targetDate: Timestamp.fromDate(targetDate as Date),
        createdAt: now,
        updatedAt: now,
      });

      // Update template usage count
      await goalsApi.templates.update(templateId, {
        usageCount: (template.usageCount || 0) + 1,
        lastUsed: new Date(),
      } as Partial<GoalTemplate>);

      // Create default milestones from template
      if (template.defaultMilestones && template.defaultMilestones.length > 0) {
        for (const defaultMilestone of template.defaultMilestones) {
          const milestoneTargetDate = new Date(startDate.getTime() + (defaultMilestone.offsetDays * 24 * 60 * 60 * 1000));
          await goalsApi.milestones.create(docRef.id, {
            templateMilestoneId: defaultMilestone.id,
            title: defaultMilestone.title,
            description: defaultMilestone.description,
            targetDate: milestoneTargetDate,
            status: 'pending',
            evidence: [],
            notes: '',
            order: defaultMilestone.order,
          });
        }
      }

      // Log activity
      await goalsApi.activity.log(docRef.id, userId, 'created', 'Goal created from template');

      const created = await goalsApi.goals.getById(docRef.id);
      if (!created) throw new Error('Failed to create goal');
      return created;
    },

    update: async (id: string, updates: Partial<UserGoal>): Promise<UserGoal> => {
      const docRef = doc(db, getCollection('goals'), id);

      const current = await goalsApi.goals.getById(id);
      if (!current) throw new Error('Goal not found');

      const updateData: Record<string, unknown> = {
        ...updates,
        version: (current.version || 0) + 1,
        updatedAt: Timestamp.now(),
      };

      // Convert dates to Timestamps
      if (updates.startDate) updateData.startDate = Timestamp.fromDate(updates.startDate);
      if (updates.targetDate) updateData.targetDate = Timestamp.fromDate(updates.targetDate);
      if (updates.completionDate) updateData.completionDate = Timestamp.fromDate(updates.completionDate);

      await updateDoc(docRef, updateData);
      const updated = await goalsApi.goals.getById(id);
      if (!updated) throw new Error('Goal not found after update');
      return updated;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      // Delete all related subcollections first
      const batch = writeBatch(db);

      // Delete milestones
      const milestonesSnapshot = await getDocs(
        collection(db, getCollection('goals'), id, 'milestones')
      );
      milestonesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Delete measurements
      const measurementsSnapshot = await getDocs(
        collection(db, getCollection('goals'), id, 'measurements')
      );
      measurementsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Delete reflections
      const reflectionsSnapshot = await getDocs(
        collection(db, getCollection('goals'), id, 'reflections')
      );
      reflectionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Delete activity log
      const activitySnapshot = await getDocs(
        collection(db, getCollection('goals'), id, 'activity')
      );
      activitySnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Delete the goal itself
      batch.delete(doc(db, getCollection('goals'), id));

      await batch.commit();
      return { success: true };
    },

    // Submit goal for approval
    submit: async (id: string, userId: string): Promise<UserGoal> => {
      const goal = await goalsApi.goals.update(id, {
        status: 'pending_approval',
        submittedAt: new Date(),
      });
      await goalsApi.activity.log(id, userId, 'submitted', 'Goal submitted for approval');
      return goal;
    },

    // Approve goal
    approve: async (id: string, approverId: string): Promise<UserGoal> => {
      const goal = await goalsApi.goals.update(id, {
        status: 'active',
        approvedBy: approverId,
        approvedAt: new Date(),
      });
      await goalsApi.activity.log(id, approverId, 'approved', 'Goal approved');
      return goal;
    },

    // Reject goal
    reject: async (id: string, approverId: string, reason: string): Promise<UserGoal> => {
      const goal = await goalsApi.goals.update(id, {
        status: 'draft',
        rejectionReason: reason,
      });
      await goalsApi.activity.log(id, approverId, 'rejected', `Goal rejected: ${reason}`);
      return goal;
    },

    // Complete goal
    complete: async (id: string, userId: string): Promise<UserGoal> => {
      const goal = await goalsApi.goals.update(id, {
        status: 'completed',
        progress: 100,
        completionDate: new Date(),
      });
      await goalsApi.activity.log(id, userId, 'status_changed', 'Goal marked as completed');
      return goal;
    },

    // Update progress
    updateProgress: async (id: string, progress: number, userId: string): Promise<UserGoal> => {
      const goal = await goalsApi.goals.update(id, { progress: Math.min(100, Math.max(0, progress)) });
      await goalsApi.activity.log(id, userId, 'updated', `Progress updated to ${progress}%`);
      return goal;
    },
  },

  // ==================== Milestones ====================
  milestones: {
    list: async (goalId: string): Promise<UserGoalMilestone[]> => {
      const q = query(
        collection(db, getCollection('goals'), goalId, 'milestones'),
        orderBy('order')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        goalId,
        ...doc.data(),
        targetDate: toDate(doc.data().targetDate),
        completionDate: toDate(doc.data().completionDate),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as UserGoalMilestone[];
    },

    getById: async (goalId: string, milestoneId: string): Promise<UserGoalMilestone | null> => {
      const docRef = doc(db, getCollection('goals'), goalId, 'milestones', milestoneId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          goalId,
          ...data,
          targetDate: toDate(data.targetDate),
          completionDate: toDate(data.completionDate),
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        } as UserGoalMilestone;
      }
      return null;
    },

    create: async (goalId: string, milestoneData: Partial<UserGoalMilestone>): Promise<UserGoalMilestone> => {
      const now = Timestamp.now();
      const newMilestone = {
        ...milestoneData,
        status: milestoneData.status || 'pending',
        evidence: milestoneData.evidence || [],
        createdAt: now,
        updatedAt: now,
      };

      if (milestoneData.targetDate) {
        (newMilestone as Record<string, unknown>).targetDate = Timestamp.fromDate(milestoneData.targetDate);
      }

      const docRef = await addDoc(
        collection(db, getCollection('goals'), goalId, 'milestones'),
        newMilestone
      );

      const created = await goalsApi.milestones.getById(goalId, docRef.id);
      if (!created) throw new Error('Failed to create milestone');
      return created;
    },

    update: async (
      goalId: string,
      milestoneId: string,
      updates: Partial<UserGoalMilestone>
    ): Promise<UserGoalMilestone> => {
      const docRef = doc(db, getCollection('goals'), goalId, 'milestones', milestoneId);

      const updateData: Record<string, unknown> = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.targetDate) updateData.targetDate = Timestamp.fromDate(updates.targetDate);
      if (updates.completionDate) updateData.completionDate = Timestamp.fromDate(updates.completionDate);

      await updateDoc(docRef, updateData);
      const updated = await goalsApi.milestones.getById(goalId, milestoneId);
      if (!updated) throw new Error('Milestone not found after update');
      return updated;
    },

    delete: async (goalId: string, milestoneId: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('goals'), goalId, 'milestones', milestoneId));
      return { success: true };
    },

    // Complete a milestone
    complete: async (goalId: string, milestoneId: string, userId: string): Promise<UserGoalMilestone> => {
      const milestone = await goalsApi.milestones.update(goalId, milestoneId, {
        status: 'completed',
        completionDate: new Date(),
      });
      await goalsApi.activity.log(goalId, userId, 'milestone_completed', `Milestone completed: ${milestone.title}`);

      // Recalculate goal progress based on completed milestones
      const allMilestones = await goalsApi.milestones.list(goalId);
      const completedCount = allMilestones.filter(m => m.status === 'completed').length;
      const progress = Math.round((completedCount / allMilestones.length) * 100);
      await goalsApi.goals.update(goalId, { progress });

      return milestone;
    },
  },

  // ==================== Measurements ====================
  measurements: {
    list: async (goalId: string): Promise<UserGoalMeasurement[]> => {
      const q = query(
        collection(db, getCollection('goals'), goalId, 'measurements'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        goalId,
        ...doc.data(),
        lastMeasuredAt: toDate(doc.data().lastMeasuredAt),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as UserGoalMeasurement[];
    },

    create: async (goalId: string, measurementData: Partial<UserGoalMeasurement>): Promise<UserGoalMeasurement> => {
      const now = Timestamp.now();
      const newMeasurement = {
        ...measurementData,
        entries: measurementData.entries || [],
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(
        collection(db, getCollection('goals'), goalId, 'measurements'),
        newMeasurement
      );

      return {
        id: docRef.id,
        goalId,
        ...newMeasurement,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      } as UserGoalMeasurement;
    },

    // Add measurement entry
    addEntry: async (
      goalId: string,
      measurementId: string,
      entry: { value: string | number; source: string; notes?: string },
      userId: string
    ): Promise<UserGoalMeasurement> => {
      const docRef = doc(db, getCollection('goals'), goalId, 'measurements', measurementId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) throw new Error('Measurement not found');

      const data = docSnap.data();
      const entries = data.entries || [];
      const newEntry = {
        id: `entry_${Date.now()}`,
        ...entry,
        date: new Date(),
        addedBy: userId,
      };

      entries.push(newEntry);

      await updateDoc(docRef, {
        entries,
        currentValue: entry.value,
        lastMeasuredAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await goalsApi.activity.log(goalId, userId, 'measurement_added', `Measurement recorded: ${entry.value}`);

      const updated = await goalsApi.measurements.list(goalId);
      return updated.find(m => m.id === measurementId) as UserGoalMeasurement;
    },
  },

  // ==================== Reflections ====================
  reflections: {
    list: async (goalId: string): Promise<UserGoalReflection[]> => {
      const q = query(
        collection(db, getCollection('goals'), goalId, 'reflections'),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        goalId,
        ...doc.data(),
        date: toDate(doc.data().date),
        createdAt: toDate(doc.data().createdAt),
        updatedAt: toDate(doc.data().updatedAt),
      })) as UserGoalReflection[];
    },

    create: async (
      goalId: string,
      reflectionData: Partial<UserGoalReflection>,
      userId: string
    ): Promise<UserGoalReflection> => {
      const now = Timestamp.now();
      const newReflection = {
        ...reflectionData,
        date: Timestamp.fromDate(reflectionData.date || new Date()),
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(
        collection(db, getCollection('goals'), goalId, 'reflections'),
        newReflection
      );

      await goalsApi.activity.log(goalId, userId, 'reflection_added', 'New reflection added');

      return {
        id: docRef.id,
        goalId,
        ...reflectionData,
        date: reflectionData.date || new Date(),
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      } as UserGoalReflection;
    },

    update: async (
      goalId: string,
      reflectionId: string,
      updates: Partial<UserGoalReflection>
    ): Promise<UserGoalReflection> => {
      const docRef = doc(db, getCollection('goals'), goalId, 'reflections', reflectionId);

      const updateData: Record<string, unknown> = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.date) updateData.date = Timestamp.fromDate(updates.date);

      await updateDoc(docRef, updateData);

      const docSnap = await getDoc(docRef);
      return {
        id: docSnap.id,
        goalId,
        ...docSnap.data(),
        date: toDate(docSnap.data()?.date),
        createdAt: toDate(docSnap.data()?.createdAt),
        updatedAt: toDate(docSnap.data()?.updatedAt),
      } as UserGoalReflection;
    },

    delete: async (goalId: string, reflectionId: string): Promise<{ success: boolean }> => {
      await deleteDoc(doc(db, getCollection('goals'), goalId, 'reflections', reflectionId));
      return { success: true };
    },
  },

  // ==================== Activity Log ====================
  activity: {
    list: async (goalId: string, limitCount = 50): Promise<GoalActivity[]> => {
      const q = query(
        collection(db, getCollection('goals'), goalId, 'activity'),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limitCount)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        goalId,
        ...doc.data(),
        timestamp: toDate(doc.data().timestamp),
      })) as GoalActivity[];
    },

    log: async (
      goalId: string,
      userId: string,
      type: GoalActivityType,
      description: string,
      previousValue?: unknown,
      newValue?: unknown
    ): Promise<void> => {
      await addDoc(
        collection(db, getCollection('goals'), goalId, 'activity'),
        {
          goalId,
          userId,
          type,
          description,
          previousValue,
          newValue,
          timestamp: Timestamp.now(),
        }
      );
    },
  },
};
