// Simplified Enhanced API Client for Priority 1 Implementation
import { 
  User, 
  School, 
  Division, 
  Department, 
  MasterSchedule, 
  EducatorSchedule,
  AppletMetadata
} from '../types';

// Mock data for development - will be replaced with real Firebase calls
const mockUsers: User[] = [];
const mockSchools: School[] = [];
const mockDivisions: Division[] = [];
const mockDepartments: Department[] = [];

// Enhanced Core API with complete data models
export const enhancedApi = {
  // 👥 USER MANAGEMENT (Enhanced with complete data model)
  users: {
    list: async (filters?: {
      schoolId?: string;
      divisionId?: string;
      departmentId?: string;
      primaryRole?: string;
      isActive?: boolean;
      limit?: number;
    }): Promise<User[]> => {
      // TODO: Replace with real Firebase query
      console.log('Fetching users with filters:', filters);
      return mockUsers;
    },

    getById: async (id: string): Promise<User> => {
      console.log('Fetching user:', id);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    },

    getTeachers: async (filters?: {
      schoolId?: string;
      divisionId?: string;
      isActive?: boolean;
    }): Promise<User[]> => {
      console.log('Fetching teachers with filters:', filters);
      return mockUsers.filter(u => ['teacher', 'specialist_teacher'].includes(u.primaryRole));
    },

    create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      console.log('Creating user:', userData);
      const newUser: User = {
        ...userData,
        id: 'user_' + Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: userData.isActive !== undefined ? userData.isActive : true
      };
      mockUsers.push(newUser);
      return newUser;
    },

    update: async (id: string, updates: Partial<User>): Promise<User> => {
      console.log('Updating user:', id, updates);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
        updatedAt: new Date()
      };
      return mockUsers[userIndex];
    },

    delete: async (id: string): Promise<void> => {
      console.log('Deleting user:', id);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }
    },

    // Role management
    updateRoles: async (id: string, primaryRole: string, secondaryRoles: string[]): Promise<void> => {
      console.log('Updating roles for user:', id, { primaryRole, secondaryRoles });
      await enhancedApi.users.update(id, { primaryRole: primaryRole as any, secondaryRoles: secondaryRoles as any });
    },

    updatePermissions: async (id: string, permissions: string[]): Promise<void> => {
      console.log('Updating permissions for user:', id, permissions);
      await enhancedApi.users.update(id, { permissions });
    }
  },

  // 🏢 ORGANIZATION MANAGEMENT (Enhanced with full hierarchy)
  schools: {
    list: async (): Promise<School[]> => {
      console.log('Fetching schools');
      return mockSchools;
    },

    getById: async (id: string): Promise<School> => {
      console.log('Fetching school:', id);
      const school = mockSchools.find(s => s.id === id);
      if (!school) throw new Error('School not found');
      return school;
    },

    create: async (schoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<School> => {
      console.log('Creating school:', schoolData);
      const newSchool: School = {
        ...schoolData,
        id: 'school_' + Date.now(),
        settings: schoolData.settings || {},
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockSchools.push(newSchool);
      return newSchool;
    },

    update: async (id: string, updates: Partial<School>): Promise<School> => {
      console.log('Updating school:', id, updates);
      const schoolIndex = mockSchools.findIndex(s => s.id === id);
      if (schoolIndex === -1) throw new Error('School not found');
      
      mockSchools[schoolIndex] = {
        ...mockSchools[schoolIndex],
        ...updates,
        updatedAt: new Date()
      };
      return mockSchools[schoolIndex];
    }
  },

  divisions: {
    list: async (schoolId?: string): Promise<Division[]> => {
      console.log('Fetching divisions for school:', schoolId);
      return schoolId 
        ? mockDivisions.filter(d => d.schoolId === schoolId)
        : mockDivisions;
    },

    getById: async (id: string): Promise<Division> => {
      console.log('Fetching division:', id);
      const division = mockDivisions.find(d => d.id === id);
      if (!division) throw new Error('Division not found');
      return division;
    },

    create: async (divisionData: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>): Promise<Division> => {
      console.log('Creating division:', divisionData);
      const newDivision: Division = {
        ...divisionData,
        id: 'division_' + Date.now(),
        settings: divisionData.settings || {},
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockDivisions.push(newDivision);
      return newDivision;
    }
  },

  departments: {
    list: async (schoolId?: string): Promise<Department[]> => {
      console.log('Fetching departments for school:', schoolId);
      return schoolId 
        ? mockDepartments.filter(d => d.schoolId === schoolId)
        : mockDepartments;
    },

    getById: async (id: string): Promise<Department> => {
      console.log('Fetching department:', id);
      const department = mockDepartments.find(d => d.id === id);
      if (!department) throw new Error('Department not found');
      return department;
    },

    create: async (deptData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
      console.log('Creating department:', deptData);
      const newDepartment: Department = {
        ...deptData,
        id: 'department_' + Date.now(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockDepartments.push(newDepartment);
      return newDepartment;
    }
  },

  // 📅 SCHEDULE MANAGEMENT (Placeholder for future implementation)
  schedules: {
    getMasterSchedule: async (schoolId: string, academicYear?: string): Promise<MasterSchedule | null> => {
      console.log('Fetching master schedule for school:', schoolId, academicYear);
      // TODO: Implement with Firebase
      return null;
    },

    getEducatorSchedule: async (educatorId: string, academicYear?: string): Promise<EducatorSchedule | null> => {
      console.log('Fetching educator schedule for:', educatorId, academicYear);
      // TODO: Implement with Firebase
      return null;
    }
  },

  // 🔧 APPLET MANAGEMENT
  applets: {
    list: async (): Promise<AppletMetadata[]> => {
      console.log('Fetching applets');
      // Return default applets for now
      return [
        {
          id: 'crp-observations',
          name: 'CRP Observations',
          description: 'Culturally Responsive Pedagogy observation tool for classroom assessments',
          version: '2.1.0',
          status: 'active',
          category: 'Assessment',
          type: 'observation',
          icon: '👁️',
          color: 'blue',
          route: '/applets/crp-observations',
          requiredRoles: ['teacher', 'principal', 'observer'],
          requiredPermissions: ['observations.create'],
          applicableDivisions: ['elementary', 'middle', 'high'],
          installs: 127,
          activeUsers: 89,
          isConfigurable: true,
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          maintainer: 'SAS Technology Innovation'
        }
      ];
    },

    getById: async (id: string): Promise<AppletMetadata> => {
      console.log('Fetching applet:', id);
      const applets = await enhancedApi.applets.list();
      const applet = applets.find(a => a.id === id);
      if (!applet) throw new Error('Applet not found');
      return applet;
    },

    getBySchool: async (schoolId: string): Promise<AppletMetadata[]> => {
      console.log('Fetching applets for school:', schoolId);
      // For now, return all applets
      return await enhancedApi.applets.list();
    }
  }
};

// Initialize some mock data for testing
export const initializeMockData = () => {
  // Clear existing data first
  mockUsers.length = 0;
  mockSchools.length = 0;
  mockDivisions.length = 0;
  mockDepartments.length = 0;

  console.log('🔄 Initializing mock data...');

  // Add sample users
  mockUsers.push({
    id: 'user_1',
    email: 'john.teacher@school.edu',
    firstName: 'John',
    lastName: 'Teacher',
    displayName: 'John Teacher',
    employeeId: 'EMP001',
    schoolId: 'school_1',
    divisionId: 'division_1',
    departmentId: 'dept_math',
    primaryRole: 'teacher',
    secondaryRoles: [],
    permissions: ['observations.create', 'observations.view'],
    title: 'Mathematics Teacher',
    certifications: ['M.Ed. Mathematics', 'State Teaching Certificate'],
    experience: '5 years',
    subjects: ['Algebra I', 'Geometry', 'Statistics'],
    grades: ['9', '10', '11'],
    specializations: ['STEM Education', 'Data Analysis'],
    planningPeriods: ['Period 4', 'Period 7'],
    languages: ['English', 'Spanish'],
    isActive: true,
    accountStatus: 'active',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {}
  });

  // Add more sample users
  mockUsers.push({
    id: 'user_2',
    email: 'sarah.principal@school.edu',
    firstName: 'Sarah',
    lastName: 'Johnson',
    displayName: 'Sarah Johnson',
    employeeId: 'EMP002',
    schoolId: 'school_1',
    divisionId: 'division_1',
    departmentId: undefined,
    primaryRole: 'principal',
    secondaryRoles: [],
    permissions: ['all'],
    title: 'Principal',
    certifications: ['Ed.D. Educational Leadership', 'Principal License'],
    experience: '15 years',
    subjects: [],
    grades: ['9', '10', '11', '12'],
    specializations: ['Educational Leadership', 'School Management'],
    planningPeriods: [],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {}
  });

  mockUsers.push({
    id: 'user_3',
    email: 'mike.science@school.edu',
    firstName: 'Mike',
    lastName: 'Wilson',
    displayName: 'Mike Wilson',
    employeeId: 'EMP003',
    schoolId: 'school_1',
    divisionId: 'division_1',
    departmentId: 'dept_science',
    primaryRole: 'teacher',
    secondaryRoles: [],
    permissions: ['observations.create', 'observations.view'],
    title: 'Science Teacher',
    certifications: ['B.S. Chemistry', 'State Teaching Certificate'],
    experience: '8 years',
    subjects: ['Chemistry', 'Physics', 'Environmental Science'],
    grades: ['9', '10', '11', '12'],
    specializations: ['Lab Safety', 'STEM Integration'],
    planningPeriods: ['Period 3'],
    languages: ['English'],
    isActive: true,
    accountStatus: 'active',
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {}
  });

  // Add sample school
  mockSchools.push({
    id: 'school_1',
    organizationId: 'org_1',
    name: 'Lincoln High School',
    shortName: 'Lincoln HS',
    type: 'high',
    grades: ['9', '10', '11', '12'],
    address: {
      street: '123 Education Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'info@lincolnhs.edu'
    },
    principalId: 'user_principal',
    assistantPrincipalIds: ['user_ap1', 'user_ap2'],
    settings: {
      enabledApplets: ['crp-observations'],
      timezone: 'America/Chicago'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Add another school
  mockSchools.push({
    id: 'school_2',
    organizationId: 'org_1',
    name: 'Washington Elementary School',
    shortName: 'Washington Elem',
    type: 'elementary',
    grades: ['K', '1', '2', '3', '4', '5'],
    address: {
      street: '456 Learning Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    contactInfo: {
      phone: '(555) 987-6543',
      email: 'info@washingtonelem.edu'
    },
    principalId: 'user_elem_principal',
    assistantPrincipalIds: [],
    settings: {
      enabledApplets: ['crp-observations'],
      timezone: 'America/Chicago'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Add sample divisions
  mockDivisions.push({
    id: 'division_1',
    schoolId: 'school_1',
    name: 'High School Division',
    type: 'high',
    description: 'Grades 9-12 academic programs',
    directorId: 'user_principal',
    assistantDirectorIds: ['user_ap1'],
    departments: ['dept_math', 'dept_english', 'dept_science'],
    grades: ['9', '10', '11', '12'],
    settings: {},
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Add sample departments
  mockDepartments.push({
    id: 'dept_math',
    schoolId: 'school_1',
    name: 'Mathematics Department',
    description: 'Mathematics and Statistics instruction',
    headId: 'user_math_head',
    members: ['user_1', 'user_math_2'],
    subjects: ['Algebra I', 'Algebra II', 'Geometry', 'Pre-Calculus', 'Calculus', 'Statistics'],
    budgetCode: 'MATH-2024',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Add more departments
  mockDepartments.push({
    id: 'dept_science',
    schoolId: 'school_1',
    name: 'Science Department',
    description: 'Physics, Chemistry, Biology, and Environmental Science',
    headId: 'user_science_head',
    members: ['user_3', 'user_science_2'],
    subjects: ['Biology', 'Chemistry', 'Physics', 'Environmental Science', 'Anatomy'],
    budgetCode: 'SCI-2024',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  mockDepartments.push({
    id: 'dept_english',
    schoolId: 'school_1',
    name: 'English Department',
    description: 'Language Arts and Literature instruction',
    headId: 'user_english_head',
    members: ['user_english_1', 'user_english_2'],
    subjects: ['English I', 'English II', 'English III', 'English IV', 'Creative Writing', 'Literature'],
    budgetCode: 'ENG-2024',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('Mock data initialized successfully!');
  console.log('📊 Final counts:', {
    users: mockUsers.length,
    schools: mockSchools.length,
    divisions: mockDivisions.length,
    departments: mockDepartments.length
  });
};
