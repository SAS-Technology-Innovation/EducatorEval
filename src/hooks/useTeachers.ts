// Teachers Management Hook
import { useState, useEffect, useCallback } from 'react';
import { teacherOperations } from '../firebase/firestore';
import { Teacher } from '../types';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all teachers
  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherOperations.getAll();
      setTeachers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load teachers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load teachers on mount
  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  // Search teachers
  const searchTeachers = async (searchTerm: string): Promise<Teacher[]> => {
    try {
      setError(null);
      return await teacherOperations.search(searchTerm);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search teachers';
      setError(errorMessage);
      return [];
    }
  };

  // Get teacher by ID
  const getTeacherById = async (id: string): Promise<Teacher | null> => {
    try {
      setError(null);
      return await teacherOperations.getById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get teacher';
      setError(errorMessage);
      return null;
    }
  };

  // Get teachers by department
  const getTeachersByDepartment = (department: string): Teacher[] => {
    return teachers.filter(teacher => teacher.department === department);
  };

  // Get teachers by grade
  const getTeachersByGrade = (grade: string): Teacher[] => {
    return teachers.filter(teacher => teacher.grade === grade);
  };

  // Get teachers by subject
  const getTeachersBySubject = (subject: string): Teacher[] => {
    return teachers.filter(teacher => teacher.subjects.includes(subject));
  };

  // Bulk import teachers
  const importTeachers = async (teacherData: Omit<Teacher, 'id'>[]): Promise<{
    successful: number;
    errors: Array<{ teacher: Omit<Teacher, 'id'>; error: string }>;
  } | null> => {
    try {
      setError(null);
      const result = await teacherOperations.bulkImport(teacherData);
      
      // Refresh teachers list after import
      await loadTeachers();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import teachers';
      setError(errorMessage);
      return null;
    }
  };

  // Get unique departments
  const getDepartments = (): string[] => {
    const departments = teachers.map(teacher => teacher.department);
    return Array.from(new Set(departments)).sort();
  };

  // Get unique grades
  const getGrades = (): string[] => {
    const grades = teachers
      .map(teacher => teacher.grade)
      .filter(grade => grade !== undefined) as string[];
    return Array.from(new Set(grades)).sort();
  };

  // Get unique subjects
  const getSubjects = (): string[] => {
    const subjects = teachers.flatMap(teacher => teacher.subjects);
    return Array.from(new Set(subjects)).sort();
  };

  // Get teacher statistics
  const getTeacherStats = () => {
    return {
      total: teachers.length,
      departments: getDepartments().length,
      grades: getGrades().length,
      subjects: getSubjects().length
    };
  };

  return {
    teachers,
    loading,
    error,
    searchTeachers,
    getTeacherById,
    getTeachersByDepartment,
    getTeachersByGrade,
    getTeachersBySubject,
    importTeachers,
    getDepartments,
    getGrades,
    getSubjects,
    getTeacherStats,
    loadTeachers,
    clearError: () => setError(null)
  };
};
