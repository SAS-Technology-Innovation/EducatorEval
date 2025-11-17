/**
 * Comprehensive Staging Database Seed Script
 *
 * Seeds the educator-evaluations project with staging_ prefixed collections
 * to support the single-project, multi-environment architecture.
 *
 * USAGE:
 * 1. Authenticate with Firebase CLI: firebase login
 * 2. Set project to production: firebase use production
 * 3. Run: npx tsx scripts/seedStagingData.ts
 */

import admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'educator-evaluations',
  });
}

const db = getFirestore();
const auth = getAuth();

// Collection prefix for staging data
const STAGING_PREFIX = 'staging_';

async function seedDatabase() {
  console.log('🌱 Starting comprehensive staging database seed...\n');
  console.log('📦 Using staging_ prefixed collections in educator-evaluations project\n');

  try {
    // ========================================
    // 1. CREATE DEMO USERS
    // ========================================
    console.log('👥 Creating demo users...\n');

    const demoUsers = [
      {
        email: 'bfawcett@sas.edu.sg',
        password: 'TempPassword123!',
        displayName: 'Bryan Fawcett',
        firstName: 'Bryan',
        lastName: 'Fawcett',
        role: 'super_admin',
        jobTitle: 'Technology Director',
        departmentId: 'technology',
        subjects: ['Technology', 'Computer Science'],
      },
      {
        email: 'admin@sas.edu.sg',
        password: 'TestPassword123!',
        displayName: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: 'administrator',
        jobTitle: 'Principal',
        departmentId: 'administration',
        subjects: [],
      },
      {
        email: 'teacher@sas.edu.sg',
        password: 'TestPassword123!',
        displayName: 'Jane Teacher',
        firstName: 'Jane',
        lastName: 'Teacher',
        role: 'educator',
        jobTitle: 'English Teacher',
        departmentId: 'english',
        subjects: ['English 9', 'English 10', 'AP English'],
      },
      {
        email: 'observer@sas.edu.sg',
        password: 'TestPassword123!',
        displayName: 'John Observer',
        firstName: 'John',
        lastName: 'Observer',
        role: 'observer',
        jobTitle: 'Instructional Coach',
        departmentId: 'administration',
        subjects: [],
      },
      {
        email: 'manager@sas.edu.sg',
        password: 'TestPassword123!',
        displayName: 'Sarah Manager',
        firstName: 'Sarah',
        lastName: 'Manager',
        role: 'manager',
        jobTitle: 'Department Head',
        departmentId: 'mathematics',
        subjects: ['Algebra II', 'Pre-Calculus'],
      },
    ];

    const createdUserIds: { [key: string]: string } = {};

    for (const user of demoUsers) {
      let authUser;
      try {
        authUser = await auth.createUser({
          email: user.email,
          password: user.password,
          emailVerified: true,
          displayName: user.displayName,
        });
        console.log(`   ✅ Created auth user: ${user.email} (${authUser.uid})`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          authUser = await auth.getUserByEmail(user.email);
          console.log(`   ℹ️  Auth user exists: ${user.email} (${authUser.uid})`);
        } else {
          throw error;
        }
      }
      createdUserIds[user.email] = authUser.uid;
    }

    // ========================================
    // 2. CREATE ORGANIZATION
    // ========================================
    console.log('\n🏢 Creating organization...\n');

    const orgRef = db.collection(`${STAGING_PREFIX}organizations`).doc('singapore-american-school');
    await orgRef.set({
      id: 'singapore-american-school',
      name: 'Singapore American School',
      shortName: 'SAS',
      type: 'private',
      address: {
        street: '40 Woodlands Street 41',
        city: 'Singapore',
        state: '',
        zipCode: '738547',
        country: 'Singapore'
      },
      contactInfo: {
        email: 'info@sas.edu.sg',
        phone: '+65 6363 3403',
        website: 'https://www.sas.edu.sg'
      },
      settings: {
        allowObservations: true,
        requireObservationApproval: false,
        enableProfessionalLearning: true,
      },
      timezone: 'Asia/Singapore',
      locale: 'en-US',
      currency: 'SGD',
      academicYear: {
        year: '2024-2025',
        startDate: Timestamp.fromDate(new Date('2024-08-15')),
        endDate: Timestamp.fromDate(new Date('2025-06-15')),
        terms: [
          {
            id: 'term-1',
            name: 'Semester 1',
            type: 'semester',
            startDate: Timestamp.fromDate(new Date('2024-08-15')),
            endDate: Timestamp.fromDate(new Date('2024-12-20'))
          },
          {
            id: 'term-2',
            name: 'Semester 2',
            type: 'semester',
            startDate: Timestamp.fromDate(new Date('2025-01-06')),
            endDate: Timestamp.fromDate(new Date('2025-06-15'))
          }
        ]
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('   ✅ Created organization: Singapore American School');

    // ========================================
    // 3. CREATE SCHOOLS
    // ========================================
    console.log('\n🏫 Creating schools...\n');

    const schools = [
      {
        id: 'sas-high-school',
        name: 'SAS High School',
        type: 'high',
        grades: ['9', '10', '11', '12'],
        principalId: createdUserIds['admin@sas.edu.sg'],
      },
      {
        id: 'sas-middle-school',
        name: 'SAS Middle School',
        type: 'middle',
        grades: ['6', '7', '8'],
        principalId: createdUserIds['admin@sas.edu.sg'],
      },
    ];

    for (const school of schools) {
      const schoolRef = db.collection(`${STAGING_PREFIX}schools`).doc(school.id);
      await schoolRef.set({
        id: school.id,
        organizationId: 'singapore-american-school',
        name: school.name,
        shortName: school.name,
        type: school.type,
        grades: school.grades,
        address: {
          street: '40 Woodlands Street 41',
          city: 'Singapore',
          state: '',
          zipCode: '738547',
          country: 'Singapore'
        },
        contactInfo: {
          email: `${school.id}@sas.edu.sg`,
          phone: '+65 6363 3403'
        },
        principalId: school.principalId,
        assistantPrincipalIds: [],
        settings: {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`   ✅ Created school: ${school.name}`);
    }

    // ========================================
    // 4. CREATE DIVISIONS
    // ========================================
    console.log('\n📚 Creating divisions...\n');

    const divisions = [
      {
        id: 'high-school',
        schoolId: 'sas-high-school',
        name: 'High School',
        type: 'high',
        grades: ['9', '10', '11', '12'],
      },
      {
        id: 'middle-school',
        schoolId: 'sas-middle-school',
        name: 'Middle School',
        type: 'middle',
        grades: ['6', '7', '8'],
      },
    ];

    for (const division of divisions) {
      const divisionRef = db.collection(`${STAGING_PREFIX}divisions`).doc(division.id);
      await divisionRef.set({
        id: division.id,
        schoolId: division.schoolId,
        name: division.name,
        type: division.type,
        description: `${division.name} Division`,
        directorId: createdUserIds['admin@sas.edu.sg'],
        assistantDirectorIds: [],
        departments: [],
        grades: division.grades,
        settings: {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`   ✅ Created division: ${division.name}`);
    }

    // ========================================
    // 5. CREATE DEPARTMENTS
    // ========================================
    console.log('\n🏢 Creating departments...\n');

    const departments = [
      {
        id: 'english',
        name: 'English',
        schoolId: 'sas-high-school',
        subjects: ['English 9', 'English 10', 'English 11', 'English 12', 'AP English Literature', 'AP English Language'],
        headId: createdUserIds['manager@sas.edu.sg'],
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        schoolId: 'sas-high-school',
        subjects: ['Algebra I', 'Algebra II', 'Geometry', 'Pre-Calculus', 'Calculus', 'AP Calculus AB', 'AP Calculus BC', 'Statistics'],
        headId: createdUserIds['manager@sas.edu.sg'],
      },
      {
        id: 'science',
        name: 'Science',
        schoolId: 'sas-high-school',
        subjects: ['Biology', 'Chemistry', 'Physics', 'AP Biology', 'AP Chemistry', 'AP Physics', 'Environmental Science'],
        headId: createdUserIds['admin@sas.edu.sg'],
      },
      {
        id: 'social-studies',
        name: 'Social Studies',
        schoolId: 'sas-high-school',
        subjects: ['World History', 'US History', 'Government', 'Economics', 'AP US History', 'AP World History', 'Psychology'],
        headId: createdUserIds['admin@sas.edu.sg'],
      },
      {
        id: 'world-languages',
        name: 'World Languages',
        schoolId: 'sas-high-school',
        subjects: ['Spanish I-IV', 'French I-IV', 'Mandarin I-IV', 'Japanese I-IV', 'AP Spanish', 'AP French'],
        headId: createdUserIds['admin@sas.edu.sg'],
      },
      {
        id: 'technology',
        name: 'Technology',
        schoolId: 'sas-high-school',
        subjects: ['Computer Science', 'AP Computer Science', 'Web Development', 'Game Design', 'Robotics'],
        headId: createdUserIds['bfawcett@sas.edu.sg'],
      },
      {
        id: 'administration',
        name: 'Administration',
        schoolId: 'sas-high-school',
        subjects: [],
        headId: createdUserIds['admin@sas.edu.sg'],
      },
    ];

    for (const dept of departments) {
      const deptRef = db.collection(`${STAGING_PREFIX}departments`).doc(dept.id);
      await deptRef.set({
        id: dept.id,
        schoolId: dept.schoolId,
        divisionId: 'high-school',
        name: dept.name,
        description: `${dept.name} Department`,
        headId: dept.headId,
        members: [dept.headId],
        subjects: dept.subjects,
        budgetCode: dept.id.toUpperCase(),
        settings: {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`   ✅ Created department: ${dept.name}`);
    }

    // ========================================
    // 6. CREATE USER PROFILES
    // ========================================
    console.log('\n👤 Creating user profiles in Firestore...\n');

    for (const user of demoUsers) {
      const uid = createdUserIds[user.email];
      const userRef = db.collection(`${STAGING_PREFIX}users`).doc(uid);

      await userRef.set({
        uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: '',
        employeeId: `EMP${Math.random().toString().substring(2, 7)}`,
        organizationId: 'singapore-american-school',
        schoolId: 'sas-high-school',
        divisionId: 'high-school',
        primaryDepartmentId: user.departmentId,
        departmentIds: [user.departmentId],
        role: user.role,
        jobTitle: user.jobTitle,
        certifications: ['Teaching License'],
        experience: '5 years',
        primarySubject: user.subjects[0] || '',
        subjects: user.subjects,
        grades: ['9', '10', '11', '12'],
        specializations: [],
        scheduleId: '',
        teachingLoad: user.subjects.length > 0 ? 5 : 0,
        planningPeriods: [],
        phoneNumber: `+65 9${Math.random().toString().substring(2, 9)}`,
        pronouns: 'they/them',
        languages: ['English'],
        status: 'active',
        lastLogin: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        metadata: {},
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'Asia/Singapore',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          dashboard: {
            layout: 'grid',
            compactMode: false,
            showWelcomeMessage: true
          }
        },
        notificationSettings: {
          observations: true,
          evaluations: true,
          goals: true,
          reminders: true,
          announcements: true,
          reports: true
        }
      });
      console.log(`   ✅ Created user profile: ${user.displayName} (${user.role})`);
    }

    // ========================================
    // 7. CREATE CRP FRAMEWORK
    // ========================================
    console.log('\n📋 Creating CRP observation framework...\n');

    const frameworkRef = db.collection(`${STAGING_PREFIX}frameworks`).doc('crp-framework-v1');
    await frameworkRef.set({
      id: 'crp-framework-v1',
      name: 'Culturally Responsive Pedagogy Framework',
      shortName: 'CRP Framework',
      description: 'Comprehensive framework for observing and evaluating culturally responsive teaching practices',
      type: 'observation',
      version: '1.0',
      status: 'active',
      organizationId: 'singapore-american-school',
      schoolId: 'sas-high-school',
      createdBy: createdUserIds['bfawcett@sas.edu.sg'],
      applicableDivisions: ['high-school', 'middle-school'],
      applicableDepartments: ['english', 'mathematics', 'science', 'social-studies', 'world-languages', 'technology'],
      sections: [
        {
          id: 'section-1',
          title: 'Cultural Awareness & Responsiveness',
          description: 'Demonstrates understanding and incorporation of students\' cultural backgrounds',
          order: 1,
          color: '#3B82F6',
          weight: 1,
          questions: [
            {
              id: 'q1-1',
              text: 'Teacher acknowledges and incorporates students\' cultural backgrounds into lessons',
              type: 'rating',
              isRequired: true,
              order: 1,
              scale: {
                min: 0,
                max: 4,
                labels: [
                  { value: 0, label: 'Not Observed', description: 'Did not observe this practice during the observation' },
                  { value: 1, label: 'Developing', description: 'Limited evidence of cultural awareness and incorporation' },
                  { value: 2, label: 'Approaching', description: 'Some evidence of cultural awareness in lesson design' },
                  { value: 3, label: 'Proficient', description: 'Consistent evidence of cultural awareness and responsiveness' },
                  { value: 4, label: 'Exemplary', description: 'Outstanding integration of cultural awareness throughout lesson' }
                ]
              },
              frameworkAlignments: ['cultural-awareness'],
              helpText: 'Look for specific examples of cultural acknowledgment, diverse perspectives, and culturally relevant content',
              allowEvidence: true,
              allowFileUpload: true
            },
            {
              id: 'q1-2',
              text: 'Evidence and specific examples observed',
              type: 'text',
              isRequired: false,
              order: 2,
              multiline: true,
              placeholder: 'Describe specific instances where cultural responsiveness was demonstrated...',
              frameworkAlignments: ['cultural-awareness']
            }
          ]
        },
        {
          id: 'section-2',
          title: 'Inclusive Practices',
          description: 'Creates an inclusive learning environment for all students',
          order: 2,
          color: '#10B981',
          weight: 1,
          questions: [
            {
              id: 'q2-1',
              text: 'Teacher uses inclusive language and examples',
              type: 'rating',
              isRequired: true,
              order: 1,
              scale: {
                min: 0,
                max: 4,
                labels: [
                  { value: 0, label: 'Not Observed', description: 'Did not observe this practice' },
                  { value: 1, label: 'Developing', description: 'Limited evidence of inclusive practices' },
                  { value: 2, label: 'Approaching', description: 'Some evidence of inclusive language and examples' },
                  { value: 3, label: 'Proficient', description: 'Consistent evidence of inclusive practices' },
                  { value: 4, label: 'Exemplary', description: 'Outstanding inclusive practices throughout' }
                ]
              },
              frameworkAlignments: ['inclusive-practices'],
              allowEvidence: true,
              allowFileUpload: true
            },
            {
              id: 'q2-2',
              text: 'Teacher ensures all students have voice and opportunity to participate',
              type: 'rating',
              isRequired: true,
              order: 2,
              scale: {
                min: 0,
                max: 4,
                labels: [
                  { value: 0, label: 'Not Observed', description: 'Did not observe this practice' },
                  { value: 1, label: 'Developing', description: 'Limited student voice' },
                  { value: 2, label: 'Approaching', description: 'Some students have voice' },
                  { value: 3, label: 'Proficient', description: 'Most students have opportunities' },
                  { value: 4, label: 'Exemplary', description: 'All students actively have voice' }
                ]
              },
              frameworkAlignments: ['inclusive-practices', 'student-engagement'],
              allowEvidence: true
            },
            {
              id: 'q2-3',
              text: 'Evidence of inclusive practices',
              type: 'text',
              isRequired: false,
              order: 3,
              multiline: true,
              frameworkAlignments: ['inclusive-practices']
            }
          ]
        },
        {
          id: 'section-3',
          title: 'Student Engagement & Participation',
          description: 'Engages all students actively in culturally responsive learning',
          order: 3,
          color: '#F59E0B',
          weight: 1,
          questions: [
            {
              id: 'q3-1',
              text: 'Students are actively engaged in learning activities',
              type: 'rating',
              isRequired: true,
              order: 1,
              scale: {
                min: 0,
                max: 4,
                labels: [
                  { value: 0, label: 'Not Observed', description: 'Did not observe this practice' },
                  { value: 1, label: 'Developing', description: 'Limited student engagement observed' },
                  { value: 2, label: 'Approaching', description: 'Some students engaged in activities' },
                  { value: 3, label: 'Proficient', description: 'Most students actively engaged' },
                  { value: 4, label: 'Exemplary', description: 'All students highly engaged throughout' }
                ]
              },
              frameworkAlignments: ['student-engagement'],
              allowEvidence: true,
              allowFileUpload: true
            },
            {
              id: 'q3-2',
              text: 'Students demonstrate understanding through culturally relevant expressions',
              type: 'rating',
              isRequired: true,
              order: 2,
              scale: {
                min: 0,
                max: 4,
                labels: [
                  { value: 0, label: 'Not Observed', description: 'Did not observe this practice' },
                  { value: 1, label: 'Developing', description: 'Limited culturally relevant expression' },
                  { value: 2, label: 'Approaching', description: 'Some culturally relevant expressions' },
                  { value: 3, label: 'Proficient', description: 'Regular culturally relevant expressions' },
                  { value: 4, label: 'Exemplary', description: 'Rich, diverse cultural expressions' }
                ]
              },
              frameworkAlignments: ['student-engagement', 'cultural-awareness'],
              allowEvidence: true
            },
            {
              id: 'q3-3',
              text: 'Evidence of student engagement and participation',
              type: 'text',
              isRequired: false,
              order: 3,
              multiline: true,
              frameworkAlignments: ['student-engagement']
            }
          ]
        },
        {
          id: 'section-4',
          title: 'Equity & Access',
          description: 'Ensures equitable access to learning for all students',
          order: 4,
          color: '#8B5CF6',
          weight: 1,
          questions: [
            {
              id: 'q4-1',
              text: 'Teacher provides multiple means of representation and expression',
              type: 'rating',
              isRequired: true,
              order: 1,
              scale: {
                min: 0,
                max: 4,
                labels: [
                  { value: 0, label: 'Not Observed', description: 'Did not observe this practice' },
                  { value: 1, label: 'Developing', description: 'Limited variety in instruction' },
                  { value: 2, label: 'Approaching', description: 'Some variety in representation' },
                  { value: 3, label: 'Proficient', description: 'Multiple means of learning provided' },
                  { value: 4, label: 'Exemplary', description: 'Rich variety of representations and expressions' }
                ]
              },
              frameworkAlignments: ['equity-access'],
              allowEvidence: true
            },
            {
              id: 'q4-2',
              text: 'Evidence of equitable practices',
              type: 'text',
              isRequired: false,
              order: 2,
              multiline: true,
              frameworkAlignments: ['equity-access']
            }
          ]
        }
      ],
      alignments: [
        {
          id: 'cultural-awareness',
          name: 'Cultural Awareness',
          description: 'Recognizing and valuing students\' cultural backgrounds',
          weight: 1
        },
        {
          id: 'inclusive-practices',
          name: 'Inclusive Practices',
          description: 'Creating an inclusive learning environment',
          weight: 1
        },
        {
          id: 'student-engagement',
          name: 'Student Engagement',
          description: 'Actively engaging all students in learning',
          weight: 1
        },
        {
          id: 'equity-access',
          name: 'Equity & Access',
          description: 'Ensuring equitable access to learning',
          weight: 1
        }
      ],
      totalQuestions: 9,
      requiredQuestions: 6,
      estimatedDuration: 45,
      tags: ['CRP', 'observation', 'teaching', 'equity', 'inclusion'],
      categories: ['pedagogy', 'cultural-competence', 'equity'],
      usageCount: 0,
      averageCompletionTime: 0,
      metadata: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('   ✅ Created CRP Framework with 9 questions across 4 sections');

    // ========================================
    // 8. CREATE SAMPLE OBSERVATIONS
    // ========================================
    console.log('\n📝 Creating sample observations...\n');

    const observations = [
      {
        teacherId: createdUserIds['teacher@sas.edu.sg'],
        observerId: createdUserIds['observer@sas.edu.sg'],
        status: 'completed',
        scheduledDate: new Date('2024-11-15'),
        completedDate: new Date('2024-11-15'),
      },
      {
        teacherId: createdUserIds['teacher@sas.edu.sg'],
        observerId: createdUserIds['manager@sas.edu.sg'],
        status: 'scheduled',
        scheduledDate: new Date('2024-12-01'),
        completedDate: null,
      },
      {
        teacherId: createdUserIds['manager@sas.edu.sg'],
        observerId: createdUserIds['admin@sas.edu.sg'],
        status: 'completed',
        scheduledDate: new Date('2024-11-10'),
        completedDate: new Date('2024-11-10'),
      },
    ];

    for (const obs of observations) {
      const obsRef = db.collection(`${STAGING_PREFIX}observations`).doc();
      await obsRef.set({
        id: obsRef.id,
        frameworkId: 'crp-framework-v1',
        teacherId: obs.teacherId,
        observerId: obs.observerId,
        organizationId: 'singapore-american-school',
        schoolId: 'sas-high-school',
        divisionId: 'high-school',
        departmentId: 'english',
        subject: 'English 10',
        grade: '10',
        class: 'English 10 - Period 3',
        status: obs.status,
        type: 'formal',
        duration: 45,
        scheduledDate: obs.scheduledDate ? Timestamp.fromDate(obs.scheduledDate) : null,
        completedDate: obs.completedDate ? Timestamp.fromDate(obs.completedDate) : null,
        responses: obs.status === 'completed' ? {
          'q1-1': { value: 3, evidence: 'Teacher incorporated diverse cultural examples' },
          'q1-2': { value: 'Referenced Asian, Western, and African perspectives in literature discussion' },
          'q2-1': { value: 3, evidence: 'Used inclusive language throughout' },
          'q2-2': { value: 4, evidence: 'All students participated in discussion' },
          'q3-1': { value: 4, evidence: 'High engagement throughout lesson' },
          'q3-2': { value: 3, evidence: 'Students shared culturally relevant interpretations' },
          'q4-1': { value: 3, evidence: 'Multiple teaching modalities used' },
        } : {},
        notes: obs.status === 'completed' ? 'Excellent culturally responsive teaching observed. Strong student engagement and inclusive practices throughout.' : '',
        commendations: obs.status === 'completed' ? ['Excellent student engagement', 'Strong cultural awareness', 'Inclusive classroom environment'] : [],
        recommendations: obs.status === 'completed' ? ['Consider incorporating more student choice in assignments'] : [],
        overallScore: obs.status === 'completed' ? 3.4 : null,
        metadata: {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`   ✅ Created observation: ${obs.status} - Teacher ${obs.teacherId.substring(0, 8)}...`);
    }

    // ========================================
    // COMPLETION
    // ========================================
    console.log('\n✅ Comprehensive staging database seeding complete!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 TEST CREDENTIALS:');
    console.log('═══════════════════════════════════════════════════════════\n');

    for (const user of demoUsers) {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌐 STAGING SITE:');
    console.log('   https://educator-evaluations-staging.web.app');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📊 DATA SUMMARY:');
    console.log(`   Organizations: 1`);
    console.log(`   Schools: 2`);
    console.log(`   Divisions: 2`);
    console.log(`   Departments: 7`);
    console.log(`   Users: ${demoUsers.length}`);
    console.log(`   Frameworks: 1 (9 questions, 4 sections)`);
    console.log(`   Observations: ${observations.length}\n`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seed script completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });
