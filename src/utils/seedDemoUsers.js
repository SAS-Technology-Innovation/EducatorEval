// @ts-nocheck
// Seed Demo Users for Testing
import { usersService } from '../lib/firestore.js';

const demoUsers = [
  {
    id: 'superadmin-demo',
    email: 'superadmin@sas.edu.sg',
    firstName: 'Super',
    lastName: 'Admin',
    displayName: 'Super Admin',
    employeeId: 'SUPER001',
    schoolId: 'sas-main',
    divisionId: 'administration',
    departmentId: 'leadership',
    primaryRole: 'super_admin',
    secondaryRoles: [],
    permissions: ['*'],
    jobTitle: 'superintendent',
    certifications: [],
    experience: '10+ years',
    subjects: [],
    grades: [],
    specializations: ['administration', 'leadership'],
    planningPeriods: [],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
  },
  {
    id: 'admin-demo',
    email: 'admin@sas.edu.sg',
    firstName: 'System',
    lastName: 'Administrator',
    displayName: 'System Administrator',
    employeeId: 'ADMIN001',
    schoolId: 'sas-main',
    divisionId: 'administration',
    departmentId: 'it',
    primaryRole: 'administrator',
    secondaryRoles: [],
    permissions: ['users.manage', 'observations.manage', 'frameworks.manage', 'reports.view'],
    jobTitle: 'principal',
    certifications: [],
    experience: '8+ years',
    subjects: [],
    grades: [],
    specializations: ['administration', 'technology'],
    planningPeriods: [],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
  },
  {
    id: 'manager-demo',
    email: 'manager@sas.edu.sg',
    firstName: 'Department',
    lastName: 'Manager',
    displayName: 'Department Manager',
    employeeId: 'MGR001',
    schoolId: 'sas-main',
    divisionId: 'academic',
    departmentId: 'mathematics',
    primaryRole: 'manager',
    secondaryRoles: ['educator'],
    permissions: ['observations.manage', 'reports.view', 'users.view'],
    jobTitle: 'department_head',
    certifications: [],
    experience: '6+ years',
    subjects: ['Mathematics'],
    grades: ['9', '10', '11', '12'],
    specializations: ['curriculum', 'assessment'],
    planningPeriods: ['Period 3'],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
  },
  {
    id: 'observer-demo',
    email: 'observer@sas.edu.sg',
    firstName: 'Classroom',
    lastName: 'Observer',
    displayName: 'Classroom Observer',
    employeeId: 'OBS001',
    schoolId: 'sas-main',
    divisionId: 'academic',
    departmentId: 'curriculum',
    primaryRole: 'observer',
    secondaryRoles: ['educator'],
    permissions: ['observations.create', 'observations.view', 'reports.view'],
    jobTitle: 'instructional_coach',
    certifications: [],
    experience: '5+ years',
    subjects: [],
    grades: [],
    specializations: ['observation', 'coaching'],
    planningPeriods: [],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
  },
  {
    id: 'teacher-demo',
    email: 'teacher@sas.edu.sg',
    firstName: 'Demo',
    lastName: 'Teacher',
    displayName: 'Demo Teacher',
    employeeId: 'TEACH001',
    schoolId: 'sas-main',
    divisionId: 'academic',
    departmentId: 'english',
    primaryRole: 'educator',
    secondaryRoles: [],
    permissions: ['observations.view', 'profile.edit'],
    jobTitle: 'teacher',
    certifications: [],
    experience: '3+ years',
    subjects: ['English Language Arts'],
    grades: ['9', '10'],
    specializations: ['literature', 'writing'],
    planningPeriods: ['Period 5'],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
  },
  {
    id: 'staff-demo',
    email: 'staff@sas.edu.sg',
    firstName: 'Support',
    lastName: 'Staff',
    displayName: 'Support Staff',
    employeeId: 'STAFF001',
    schoolId: 'sas-main',
    divisionId: 'support',
    departmentId: 'office',
    primaryRole: 'staff',
    secondaryRoles: [],
    permissions: ['profile.view'],
    jobTitle: 'secretary',
    certifications: [],
    experience: '2+ years',
    subjects: [],
    grades: [],
    specializations: ['administration'],
    planningPeriods: [],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
  }
];

async function seedDemoUsers() {
  console.log('🌱 Seeding demo users...');
  
  for (const user of demoUsers) {
    try {
      // Check if user already exists
      const existingUser = await usersService.getById(user.id);
      if (existingUser) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`);
        continue;
      }
      
      // Create user in Firestore
      await usersService.create(user);
      console.log(`✅ Created user: ${user.email} (${user.displayName})`);
    } catch (error) {
      console.error(`❌ Failed to create user ${user.email}:`, error);
    }
  }
  
  console.log('🎉 Demo user seeding complete!');
}

// Run the seeding
seedDemoUsers().catch(console.error);
