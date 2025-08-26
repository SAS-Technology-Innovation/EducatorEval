// Test Firebase connection and operations
import { db } from '../firebase/config';
import { teacherOperations, observationOperations } from '../firebase/firestore';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export async function testFirestoreConnection() {
  console.log('🔥 Testing Firestore connection...');
  
  try {
    // Test 1: Basic connectivity - try to read from a simple collection
    console.log('1. Testing basic connectivity...');
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firestore connection successful');

    // Test 2: Try to write a test document
    console.log('2. Testing write operations...');
    await setDoc(doc(db, 'test', 'connection-test'), {
      timestamp: new Date().toISOString(),
      message: 'Connection test from EducatorEval app'
    });
    console.log('✅ Write operation successful');

    // Test 3: Test teacher operations
    console.log('3. Testing teacher operations...');
    const teachers = await teacherOperations.getAll();
    console.log(`✅ Retrieved ${teachers.length} teachers from Firestore`);
    
    if (teachers.length === 0) {
      console.log('⚠️  No teachers found - database might be empty');
    } else {
      console.log('📚 Teachers found:', teachers.map(t => t.name).join(', '));
    }

    // Test 4: Test observation operations
    console.log('4. Testing observation operations...');
    const observationsResult = await observationOperations.getRecent(10);
    const observations = observationsResult.observations;
    console.log(`✅ Retrieved ${observations.length} observations from Firestore`);
    
    if (observations.length === 0) {
      console.log('⚠️  No observations found - database might be empty');
    } else {
      console.log('📊 Observations found:', observations.map((o: any) => `${o.teacherName} - ${o.status}`).join(', '));
    }

    return {
      connected: true,
      teachersCount: teachers.length,
      observationsCount: observations.length
    };

  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    throw error;
  }
}

// Test function for seeding data
export async function testSeedTeacher() {
  console.log('🌱 Testing teacher creation...');
  
  try {
    const testTeacher = {
      name: 'Test Teacher',
      email: 'test@school.edu',
      department: 'Test Department',
      grade: '9-12',
      subjects: ['Test Subject'],
      currentClass: {
        name: 'Test Class',
        subject: 'Test Subject',
        room: 'T101',
        period: 'Period 1',
        grade: '9th Grade'
      }
    };

    const teacherId = await teacherOperations.create(testTeacher);
    console.log('✅ Test teacher created with ID:', teacherId);
    
    // Try to retrieve it
    const retrievedTeacher = await teacherOperations.getById(teacherId);
    console.log('✅ Test teacher retrieved:', retrievedTeacher?.name);
    
    return teacherId;
  } catch (error) {
    console.error('❌ Failed to create test teacher:', error);
    throw error;
  }
}
