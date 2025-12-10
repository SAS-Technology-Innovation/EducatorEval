// Framework Alignments API Layer
// Handles CRUD operations for framework alignments stored in Firestore

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
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { FrameworkAlignment, DivisionType } from '../types';

// Get environment-based collection prefix
const getCollectionPrefix = () => {
  const env = import.meta.env.VITE_ENVIRONMENT || 'staging';
  return env === 'production' ? '' : 'staging_';
};

const getCollectionName = () => `${getCollectionPrefix()}framework_alignments`;

// Convert Firestore document to FrameworkAlignment
const docToAlignment = (doc: { id: string; data: () => Record<string, unknown> }): FrameworkAlignment => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name as string,
    category: data.category as string,
    subcategory: data.subcategory as string | undefined,
    description: data.description as string,
    color: data.color as string,
    icon: data.icon as string | undefined,
    weight: data.weight as number | undefined,
    applicableTypes: data.applicableTypes as string[],
    applicableDivisions: data.applicableDivisions as DivisionType[],
  };
};

export const alignmentsApi = {
  // List all alignments with optional filters
  async list(filters?: {
    category?: string;
    applicableType?: string;
    applicableDivision?: DivisionType;
  }): Promise<FrameworkAlignment[]> {
    try {
      const collectionRef = collection(db, getCollectionName());
      let q = query(collectionRef, orderBy('category'), orderBy('name'));

      // Note: Firestore doesn't support array-contains with other filters well,
      // so we filter in memory for complex queries
      const snapshot = await getDocs(q);
      let alignments = snapshot.docs.map(docToAlignment);

      // Apply filters
      if (filters?.category) {
        alignments = alignments.filter(a => a.category === filters.category);
      }
      if (filters?.applicableType) {
        alignments = alignments.filter(a =>
          a.applicableTypes.includes(filters.applicableType!)
        );
      }
      if (filters?.applicableDivision) {
        alignments = alignments.filter(a =>
          a.applicableDivisions.includes(filters.applicableDivision!)
        );
      }

      return alignments;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to list alignments:', error);
      }
      throw error;
    }
  },

  // Get single alignment by ID
  async getById(id: string): Promise<FrameworkAlignment | null> {
    try {
      const docRef = doc(db, getCollectionName(), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docToAlignment({ id: docSnap.id, data: () => docSnap.data() });
      }
      return null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to get alignment:', error);
      }
      throw error;
    }
  },

  // Get alignments by category
  async getByCategory(category: string): Promise<FrameworkAlignment[]> {
    try {
      const collectionRef = collection(db, getCollectionName());
      const q = query(
        collectionRef,
        where('category', '==', category),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docToAlignment);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to get alignments by category:', error);
      }
      throw error;
    }
  },

  // Get unique categories
  async getCategories(): Promise<string[]> {
    try {
      const alignments = await this.list();
      const categories = [...new Set(alignments.map(a => a.category))];
      return categories.sort();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to get categories:', error);
      }
      throw error;
    }
  },

  // Create a new alignment (admin only)
  async create(data: Omit<FrameworkAlignment, 'id'>): Promise<FrameworkAlignment> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, getCollectionName()), docData);
      return {
        id: docRef.id,
        ...data,
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to create alignment:', error);
      }
      throw error;
    }
  },

  // Update an alignment (admin only)
  async update(id: string, data: Partial<FrameworkAlignment>): Promise<FrameworkAlignment> {
    try {
      const docRef = doc(db, getCollectionName(), id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);

      // Fetch and return updated document
      const updated = await this.getById(id);
      if (!updated) {
        throw new Error('Alignment not found after update');
      }
      return updated;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to update alignment:', error);
      }
      throw error;
    }
  },

  // Delete an alignment (admin only)
  async delete(id: string): Promise<{ success: boolean; id: string }> {
    try {
      const docRef = doc(db, getCollectionName(), id);
      await deleteDoc(docRef);
      return { success: true, id };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete alignment:', error);
      }
      throw error;
    }
  },

  // Bulk create alignments (for seeding/migration)
  async bulkCreate(alignments: Omit<FrameworkAlignment, 'id'>[]): Promise<FrameworkAlignment[]> {
    const results: FrameworkAlignment[] = [];
    for (const alignment of alignments) {
      const created = await this.create(alignment);
      results.push(created);
    }
    return results;
  },

  // Seed default alignments if none exist
  async seedDefaults(): Promise<{ seeded: boolean; count: number }> {
    try {
      const existing = await this.list();
      if (existing.length > 0) {
        return { seeded: false, count: existing.length };
      }

      // Import default alignments from observation.ts
      const { CRPFrameworkAlignments } = await import('../types/observation');

      const alignmentsToSeed = Object.values(CRPFrameworkAlignments).map(alignment => ({
        name: alignment.name,
        category: alignment.category,
        subcategory: alignment.subcategory,
        description: alignment.description,
        color: alignment.color,
        icon: alignment.icon,
        weight: alignment.weight,
        applicableTypes: alignment.applicableTypes,
        applicableDivisions: alignment.applicableDivisions,
      }));

      const created = await this.bulkCreate(alignmentsToSeed);
      return { seeded: true, count: created.length };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to seed alignments:', error);
      }
      throw error;
    }
  },
};

export default alignmentsApi;
