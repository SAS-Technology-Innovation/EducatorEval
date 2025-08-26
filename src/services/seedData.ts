// Sample data for testing the EducatorEval system
import { teacherOperations } from '../firebase/firestore';
import { Teacher } from '../types';

const sampleTeachers: Omit<Teacher, 'id'>[] = [
  {
    name: 'Michael Brown',
    email: 'mbrown@school.edu',
    department: 'Mathematics',
    grade: '9-12',
    subjects: ['Pre-Calculus', 'Algebra II'],
    currentClass: {
      name: 'Pre-Calculus',
      subject: 'Mathematics',
      room: 'B205',
      period: 'Period 3',
      grade: '11th Grade'
    }
  },
  {
    name: 'Emily Wilson',
    email: 'ewilson@school.edu',
    department: 'English',
    grade: '9-10',
    subjects: ['Language Arts', 'Creative Writing'],
    currentClass: {
      name: 'Language Arts',
      subject: 'English',
      room: 'A108',
      period: 'Period 4',
      grade: '9th Grade'
    }
  },
  {
    name: 'Sarah Chen',
    email: 'schen@school.edu',
    department: 'Science',
    grade: '6-8',
    subjects: ['Biology', 'Earth Science'],
    currentClass: {
      name: 'Biology',
      subject: 'Science',
      room: 'C302',
      period: 'Period 2',
      grade: '8th Grade'
    }
  },
  {
    name: 'David Martinez',
    email: 'dmartinez@school.edu',
    department: 'History',
    grade: '9-12',
    subjects: ['World History', 'US History'],
    currentClass: {
      name: 'World History',
      subject: 'Social Studies',
      room: 'D101',
      period: 'Period 1',
      grade: '10th Grade'
    }
  },
  {
    name: 'Jennifer Taylor',
    email: 'jtaylor@school.edu',
    department: 'Elementary',
    grade: '3-5',
    subjects: ['General Elementary'],
    currentClass: {
      name: '4th Grade Class',
      subject: 'Elementary',
      room: 'E204',
      period: 'All Day',
      grade: '4th Grade'
    }
  }
];

export async function seedTeachers() {
  console.log('Starting to seed teachers...');
  
  try {
    for (const teacher of sampleTeachers) {
      const id = await teacherOperations.create(teacher);
      console.log(`Created teacher: ${teacher.name} with ID: ${id}`);
    }
    console.log('Successfully seeded all teachers!');
  } catch (error) {
    console.error('Error seeding teachers:', error);
    throw error;
  }
}

export { sampleTeachers };
