/**
 * Staging Database Seed Script
 *
 * This script seeds the staging Firebase project with realistic test data.
 *
 * USAGE:
 * 1. Make sure you're using the staging Firebase project:
 *    firebase use staging
 *
 * 2. Set GOOGLE_APPLICATION_CREDENTIALS to your service account key:
 *    export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
 *
 * 3. Run the script:
 *    npx tsx scripts/seedStaging.ts
 */

import admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = getFirestore();
const auth = getAuth();

async function seedDatabase() {
  console.log('🌱 Starting staging database seed...\n');

  try {
    // 1. Create test admin user
    console.log('👤 Creating test admin user...');
    const adminEmail = 'admin@staging.test';
    const adminPassword = 'TestPassword123!';

    let adminAuthUser;
    try {
      adminAuthUser = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        emailVerified: true,
        displayName: 'Admin User (Staging)',
      });
      console.log(`   ✅ Created auth user: ${adminAuthUser.uid}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        adminAuthUser = await auth.getUserByEmail(adminEmail);
        console.log(`   ℹ️  Auth user already exists: ${adminAuthUser.uid}`);
      } else {
        throw error;
      }
    }

    // 2. Create Organization
    console.log('\n🏢 Creating organization...');
    const orgRef = db.collection('organizations').doc('singapore-american-school');
    await orgRef.set({
      id: 'singapore-american-school',
      name: 'Singapore American School',
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
      settings: {},
      timezone: 'Asia/Singapore',
      academicYear: {
        year: '2024-2025',
        startDate: Timestamp.fromDate(new Date('2024-08-15')),
        endDate: Timestamp.fromDate(new Date('2025-06-15')),
        terms: [
          {
            id: 'term-1',
            name: 'Term 1',
            type: 'semester',
            startDate: Timestamp.fromDate(new Date('2024-08-15')),
            endDate: Timestamp.fromDate(new Date('2024-12-20'))
          },
          {
            id: 'term-2',
            name: 'Term 2',
            type: 'semester',
            startDate: Timestamp.fromDate(new Date('2025-01-06')),
            endDate: Timestamp.fromDate(new Date('2025-06-15'))
          }
        ]
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('   ✅ Created organization: singapore-american-school');

    // 3. Create School
    console.log('\n🏫 Creating school...');
    const schoolRef = db.collection('schools').doc('sas-high-school');
    await schoolRef.set({
      id: 'sas-high-school',
      organizationId: 'singapore-american-school',
      name: 'Singapore American School - High School',
      shortName: 'SAS HS',
      type: 'high',
      grades: ['9', '10', '11', '12'],
      address: {
        street: '40 Woodlands Street 41',
        city: 'Singapore',
        state: '',
        zipCode: '738547',
        country: 'Singapore'
      },
      contactInfo: {
        email: 'hs@sas.edu.sg',
        phone: '+65 6363 3403'
      },
      principalId: adminAuthUser.uid,
      assistantPrincipalIds: [],
      settings: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('   ✅ Created school: sas-high-school');

    // 4. Create Division
    console.log('\n📚 Creating division...');
    const divisionRef = db.collection('divisions').doc('high-school-division');
    await divisionRef.set({
      id: 'high-school-division',
      schoolId: 'sas-high-school',
      name: 'High School',
      type: 'high',
      description: 'High School Division (Grades 9-12)',
      directorId: adminAuthUser.uid,
      assistantDirectorIds: [],
      departments: [],
      grades: ['9', '10', '11', '12'],
      settings: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('   ✅ Created division: high-school-division');

    // 5. Create Departments
    console.log('\n🏢 Creating departments...');
    const departments = [
      { id: 'english', name: 'English', subjects: ['English 9', 'English 10', 'English 11', 'English 12', 'AP English'] },
      { id: 'mathematics', name: 'Mathematics', subjects: ['Algebra I', 'Algebra II', 'Geometry', 'Pre-Calculus', 'Calculus', 'AP Calculus'] },
      { id: 'science', name: 'Science', subjects: ['Biology', 'Chemistry', 'Physics', 'AP Biology', 'AP Chemistry', 'AP Physics'] },
      { id: 'social-studies', name: 'Social Studies', subjects: ['World History', 'US History', 'Government', 'Economics', 'AP US History'] },
      { id: 'world-languages', name: 'World Languages', subjects: ['Spanish', 'French', 'Mandarin', 'Japanese'] },
    ];

    const departmentIds: string[] = [];
    for (const dept of departments) {
      const deptRef = db.collection('departments').doc(dept.id);
      await deptRef.set({
        id: dept.id,
        schoolId: 'sas-high-school',
        name: dept.name,
        description: `${dept.name} Department`,
        headId: adminAuthUser.uid,
        members: [adminAuthUser.uid],
        subjects: dept.subjects,
        budgetCode: dept.id.toUpperCase(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      departmentIds.push(dept.id);
      console.log(`   ✅ Created department: ${dept.name}`);
    }

    // 6. Create Admin User Profile in Firestore
    console.log('\n👤 Creating admin user profile...');
    const userRef = db.collection('users').doc(adminAuthUser.uid);
    await userRef.set({
      id: adminAuthUser.uid,
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User (Staging)',
      avatar: '',
      employeeId: 'ADMIN001',
      schoolId: 'sas-high-school',
      divisionId: 'high-school-division',
      primaryDepartmentId: 'english',
      departmentIds: departmentIds,
      primaryRole: 'super_admin',
      secondaryRoles: ['administrator', 'manager', 'observer'],
      permissions: ['*'],
      jobTitle: 'principal',
      certifications: ['Teaching License', 'Administrator License'],
      experience: '15 years',
      primarySubject: 'English',
      subjects: ['English 9', 'English 10', 'AP English'],
      grades: ['9', '10', '11', '12'],
      specializations: ['Educational Leadership', 'Curriculum Development'],
      scheduleId: '',
      teachingLoad: 0,
      planningPeriods: [],
      phoneNumber: '+65 9123 4567',
      pronouns: 'they/them',
      languages: ['English'],
      isActive: true,
      accountStatus: 'active',
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
    console.log('   ✅ Created admin user profile');

    // 7. Create CRP Framework
    console.log('\n📋 Creating CRP Framework...');
    const frameworkRef = db.collection('frameworks').doc('crp-framework-v1');
    await frameworkRef.set({
      id: 'crp-framework-v1',
      name: 'Culturally Responsive Pedagogy Framework',
      description: 'Framework for observing and evaluating culturally responsive teaching practices',
      type: 'observation',
      version: '1.0',
      status: 'active',
      schoolId: 'sas-high-school',
      createdBy: adminAuthUser.uid,
      applicableDivisions: ['high-school-division'],
      sections: [
        {
          id: 'section-1',
          title: 'Cultural Awareness',
          description: 'Demonstrates understanding and incorporation of students\' cultural backgrounds',
          order: 1,
          color: '#3B82F6',
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
                  { value: 0, label: 'Not Observed', description: 'Did not observe this practice' },
                  { value: 1, label: 'Developing', description: 'Limited evidence of cultural awareness' },
                  { value: 2, label: 'Approaching', description: 'Some evidence of cultural awareness' },
                  { value: 3, label: 'Proficient', description: 'Consistent evidence of cultural awareness' },
                  { value: 4, label: 'Exemplary', description: 'Outstanding integration of cultural awareness' }
                ]
              },
              frameworkAlignments: ['cultural-awareness'],
              helpText: 'Look for specific examples of cultural acknowledgment',
              allowEvidence: true,
              allowFileUpload: true
            },
            {
              id: 'q1-2',
              text: 'Evidence and examples observed',
              type: 'text',
              isRequired: false,
              order: 2,
              multiline: true,
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
                  { value: 2, label: 'Approaching', description: 'Some evidence of inclusive practices' },
                  { value: 3, label: 'Proficient', description: 'Consistent evidence of inclusive practices' },
                  { value: 4, label: 'Exemplary', description: 'Outstanding inclusive practices' }
                ]
              },
              frameworkAlignments: ['inclusive-practices'],
              allowEvidence: true,
              allowFileUpload: true
            }
          ]
        },
        {
          id: 'section-3',
          title: 'Student Engagement',
          description: 'Engages all students actively in learning',
          order: 3,
          color: '#F59E0B',
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
                  { value: 1, label: 'Developing', description: 'Limited student engagement' },
                  { value: 2, label: 'Approaching', description: 'Some students engaged' },
                  { value: 3, label: 'Proficient', description: 'Most students engaged' },
                  { value: 4, label: 'Exemplary', description: 'All students highly engaged' }
                ]
              },
              frameworkAlignments: ['student-engagement'],
              allowEvidence: true,
              allowFileUpload: true
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
        }
      ],
      totalQuestions: 4,
      requiredQuestions: 3,
      estimatedDuration: 45,
      tags: ['CRP', 'observation', 'teaching'],
      categories: ['pedagogy', 'cultural-competence'],
      usageCount: 0,
      averageCompletionTime: 0,
      averageEvidenceScore: 0,
      metadata: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('   ✅ Created CRP Framework');

    console.log('\n✅ Staging database seeding complete!\n');
    console.log('📋 Test Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n🌐 You can now deploy to staging and test with these credentials.\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });
