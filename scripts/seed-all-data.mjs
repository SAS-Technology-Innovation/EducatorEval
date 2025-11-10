#!/usr/bin/env node

/**
 * Complete Firestore Data Seed Script
 * Populates ALL collections with sample data for development
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch, serverTimestamp, collection } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDl_QC5yPXvBd8J6TxhUqKcxNyOWYwJ0lE',
  authDomain: 'educator-evaluations.firebaseapp.com',
  projectId: 'educator-evaluations',
  storageBucket: 'educator-evaluations.firebasestorage.app',
  messagingSenderId: '1034698034931',
  appId: '1:1034698034931:web:c7f6daac01b88f0cfb18a7',
  measurementId: 'G-YL6KLRXDVM'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🎯 COMPLETE FIRESTORE DATA SEED');
console.log('=====================================\n');

// DEPARTMENTS DATA
const departments = [
  {
    id: 'dept-english',
    name: 'English',
    schoolId: 'sas-001',
    divisionIds: ['high-school', 'middle-school'],
    headOfDepartment: 'John Observer',
    headOfDepartmentId: 'observer-001',
    faculty: [],
    isActive: true
  },
  {
    id: 'dept-math',
    name: 'Mathematics',
    schoolId: 'sas-001',
    divisionIds: ['high-school', 'middle-school'],
    headOfDepartment: null,
    headOfDepartmentId: null,
    faculty: [],
    isActive: true
  },
  {
    id: 'dept-science',
    name: 'Science',
    schoolId: 'sas-001',
    divisionIds: ['high-school', 'middle-school'],
    headOfDepartment: null,
    headOfDepartmentId: null,
    faculty: [],
    isActive: true
  },
  {
    id: 'dept-leadership',
    name: 'Leadership',
    schoolId: 'sas-001',
    divisionIds: ['high-school'],
    headOfDepartment: 'Super Admin',
    headOfDepartmentId: 'super-admin-001',
    faculty: [],
    isActive: true
  }
];

// DIVISIONS DATA
const divisions = [
  {
    id: 'elementary',
    name: 'Elementary School',
    schoolId: 'sas-001',
    grades: ['K', '1', '2', '3', '4', '5'],
    principal: null,
    principalId: null,
    isActive: true
  },
  {
    id: 'middle-school',
    name: 'Middle School',
    schoolId: 'sas-001',
    grades: ['6', '7', '8'],
    principal: null,
    principalId: null,
    isActive: true
  },
  {
    id: 'high-school',
    name: 'High School',
    schoolId: 'sas-001',
    grades: ['9', '10', '11', '12'],
    principal: 'Super Admin',
    principalId: 'super-admin-001',
    isActive: true
  }
];

// SCHOOLS DATA
const schools = [
  {
    id: 'sas-001',
    name: 'Singapore American School',
    shortName: 'SAS',
    organizationId: 'sas-001',
    type: 'international',
    address: '40 Woodlands Street 41, Singapore 738547',
    phone: '+65 6363 3403',
    website: 'https://www.sas.edu.sg',
    timezone: 'Asia/Singapore',
    academicYear: '2024-2025',
    currentSemester: 'Semester 2',
    isActive: true
  }
];

// ADDITIONAL USERS
const additionalUsers = [
  {
    id: 'teacher-002',
    email: 'sarah.math@sas.edu.sg',
    displayName: 'Sarah Mathematics',
    firstName: 'Sarah',
    lastName: 'Mathematics',
    primaryRole: 'educator',
    secondaryRoles: [],
    schoolId: 'sas-001',
    divisionId: 'high-school',
    departmentId: 'dept-math',
    subjects: ['Algebra', 'Calculus'],
    grades: ['9', '10', '11', '12'],
    isActive: true,
    canObserve: false,
    canBeObserved: true
  },
  {
    id: 'teacher-003',
    email: 'mike.science@sas.edu.sg',
    displayName: 'Mike Science',
    firstName: 'Mike',
    lastName: 'Science',
    primaryRole: 'educator',
    secondaryRoles: [],
    schoolId: 'sas-001',
    divisionId: 'high-school',
    departmentId: 'dept-science',
    subjects: ['Biology', 'Chemistry'],
    grades: ['9', '10', '11'],
    isActive: true,
    canObserve: false,
    canBeObserved: true
  },
  {
    id: 'teacher-004',
    email: 'lisa.english@sas.edu.sg',
    displayName: 'Lisa English',
    firstName: 'Lisa',
    lastName: 'English',
    primaryRole: 'educator',
    secondaryRoles: [],
    schoolId: 'sas-001',
    divisionId: 'middle-school',
    departmentId: 'dept-english',
    subjects: ['English', 'Writing'],
    grades: ['6', '7', '8'],
    isActive: true,
    canObserve: false,
    canBeObserved: true
  }
];

// SAMPLE OBSERVATIONS
const sampleObservations = [
  {
    id: 'obs-001',
    frameworkId: 'integrated-observation-framework',
    educatorId: 'teacher-001',
    educatorName: 'Jane Teacher',
    observerId: 'observer-001',
    observerName: 'John Observer',
    schoolId: 'sas-001',
    divisionId: 'high-school',
    departmentId: 'dept-english',
    subjectArea: 'English Literature',
    gradeLevel: '11',
    observationDate: new Date('2025-01-15'),
    status: 'completed',
    classContext: {
      className: 'AP English Literature',
      room: 'Room 305',
      enrolledStudents: 24,
      presentStudents: 22,
      period: 'Period 3'
    },
    responses: [
      {
        questionId: 'look-for-1',
        rating: 1,
        evidence: 'Teacher clearly posted learning objective on board: "Analyze symbolism in The Great Gatsby." Students could articulate what they were learning when asked.',
        observed: true
      },
      {
        questionId: 'look-for-2',
        rating: 1,
        evidence: 'Classroom displays included diverse authors. Teacher used inclusive language and affirmed student perspectives from different cultural backgrounds.',
        observed: true
      },
      {
        questionId: 'look-for-3',
        rating: 1,
        evidence: 'Teacher used exit tickets and adjusted discussion based on student responses. Re-taught key concept when confusion was evident.',
        observed: true
      },
      {
        questionId: 'look-for-4',
        rating: 1,
        evidence: 'Teacher asked "Why do you think Fitzgerald chose this symbol?" and provided 5-second wait time. Students were asked to justify interpretations.',
        observed: true
      },
      {
        questionId: 'look-for-5',
        rating: 1,
        evidence: 'Students worked in pairs to analyze passages. Clear discussion protocols were in place. Students built on each other\'s ideas.',
        observed: true
      },
      {
        questionId: 'look-for-6',
        rating: 1,
        evidence: 'Teacher connected themes to students\' lived experiences and invited personal connections to the text.',
        observed: true
      },
      {
        questionId: 'look-for-7',
        rating: 1,
        evidence: 'Teacher circulated to all groups, providing targeted feedback on analysis quality. Addressed misconceptions immediately.',
        observed: true
      },
      {
        questionId: 'look-for-8',
        rating: 1,
        evidence: 'Students completed exit ticket reflecting on their understanding of symbolism. Teacher facilitated closing discussion.',
        observed: true
      },
      {
        questionId: 'look-for-9',
        rating: 1,
        evidence: 'Teacher greeted students warmly by name. Positive, encouraging tone throughout. Students comfortable asking questions.',
        observed: true
      },
      {
        questionId: 'look-for-10',
        rating: 1,
        evidence: 'Sentence frames provided for struggling writers. Extension questions available for advanced students. Graphic organizer offered as scaffold.',
        observed: true
      }
    ],
    overallComments: 'Excellent lesson demonstrating all 10 integrated look-fors. Teacher created an inclusive, culturally responsive environment while maintaining high cognitive demand.',
    commendations: 'Outstanding use of questioning strategies and differentiation. Strong relationships with students were evident.',
    areasForGrowth: 'Continue building on these strengths. Consider incorporating more student-led discussions.',
    followUpActions: []
  }
];

// Migration functions
async function seedDepartments() {
  console.log('🚀 Seeding departments...');
  const batch = writeBatch(db);

  departments.forEach(dept => {
    const deptRef = doc(db, 'departments', dept.id);
    batch.set(deptRef, {
      ...dept,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`✅ Seeded ${departments.length} departments`);
}

async function seedDivisions() {
  console.log('🚀 Seeding divisions...');
  const batch = writeBatch(db);

  divisions.forEach(division => {
    const divisionRef = doc(db, 'divisions', division.id);
    batch.set(divisionRef, {
      ...division,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`✅ Seeded ${divisions.length} divisions`);
}

async function seedSchools() {
  console.log('🚀 Seeding schools...');
  const batch = writeBatch(db);

  schools.forEach(school => {
    const schoolRef = doc(db, 'schools', school.id);
    batch.set(schoolRef, {
      ...school,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`✅ Seeded ${schools.length} schools`);
}

async function seedAdditionalUsers() {
  console.log('🚀 Seeding additional users...');
  const batch = writeBatch(db);

  additionalUsers.forEach(user => {
    const userRef = doc(db, 'users', user.id);
    batch.set(userRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`✅ Seeded ${additionalUsers.length} additional users`);
}

async function seedObservations() {
  console.log('🚀 Seeding sample observations...');

  for (const obs of sampleObservations) {
    const obsRef = doc(db, 'observations', obs.id);
    await setDoc(obsRef, {
      ...obs,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submittedAt: serverTimestamp(),
      completedAt: serverTimestamp()
    });
  }

  console.log(`✅ Seeded ${sampleObservations.length} sample observations`);
}

// Main seed function
async function seedAllData() {
  try {
    console.log('Starting complete data seed...\n');

    // Seed in order (dependencies first)
    await seedSchools();
    await seedDivisions();
    await seedDepartments();
    await seedAdditionalUsers();
    await seedObservations();

    console.log('\n=====================================');
    console.log('✅ ALL DATA SEEDED SUCCESSFULLY!');
    console.log('\nCollections populated:');
    console.log('  • schools: 1 school (SAS)');
    console.log('  • divisions: 3 divisions (Elementary, Middle, High)');
    console.log('  • departments: 4 departments (English, Math, Science, Leadership)');
    console.log('  • users: +4 additional teachers (7 total)');
    console.log('  • observations: 1 sample observation');
    console.log('\nPreviously seeded (from migration):');
    console.log('  • frameworks: 1 framework (10 integrated look-fors)');
    console.log('  • organizations: 1 organization (SAS)');
    console.log('  • users: 3 core users (admin, observer, teacher)');
    console.log('\nVerify at: https://console.firebase.google.com/project/educator-evaluations/firestore');

    process.exit(0);
  } catch (error) {
    console.error('❌ SEED FAILED:', error);
    process.exit(1);
  }
}

seedAllData();
