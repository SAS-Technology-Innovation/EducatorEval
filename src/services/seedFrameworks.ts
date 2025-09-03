// Seed frameworks from the framework service into Firestore
import { frameworkOperations } from '../firebase/firestore';
import { frameworkService } from './frameworkService';
import { Framework } from '../types';

export async function seedFrameworks() {
  console.log('🔧 Starting to seed frameworks from FrameworkService to Firestore...');
  
  try {
    // Get all frameworks from the framework service
    const frameworks = frameworkService.getAllFrameworks();
    console.log(`📋 Found ${frameworks.length} frameworks in FrameworkService:`, frameworks.map(f => f.name));
    
    for (const framework of frameworks) {
      try {
        // Check if framework already exists
        const existing = await frameworkOperations.getById(framework.id);
        
        if (existing) {
          console.log(`⚠️  Framework "${framework.name}" already exists, updating...`);
          await frameworkOperations.update(framework.id, framework);
          console.log(`✅ Updated framework: ${framework.name}`);
        } else {
          console.log(`➕ Creating new framework: ${framework.name}`);
          const id = await frameworkOperations.create(framework);
          console.log(`✅ Created framework: ${framework.name} with ID: ${id}`);
        }
      } catch (error) {
        console.error(`❌ Error processing framework ${framework.name}:`, error);
      }
    }
    
    console.log('🎉 Successfully seeded all frameworks to Firestore!');
    
    // Verify by fetching all frameworks
    const firestoreFrameworks = await frameworkOperations.getAll();
    console.log(`✅ Verification: Found ${firestoreFrameworks.length} frameworks in Firestore`);
    
    return {
      success: true,
      seeded: frameworks.length,
      verified: firestoreFrameworks.length
    };
    
  } catch (error) {
    console.error('💥 Error seeding frameworks:', error);
    throw error;
  }
}

// Export frameworks for use in other components
export const getAvailableFrameworks = async (): Promise<Framework[]> => {
  try {
    // Try to get from Firestore first
    const firestoreFrameworks = await frameworkOperations.getAll();
    
    if (firestoreFrameworks.length > 0) {
      console.log(`📖 Loaded ${firestoreFrameworks.length} frameworks from Firestore`);
      return firestoreFrameworks;
    }
    
    // Fallback to framework service
    console.log('📚 Fallback: Using frameworks from FrameworkService');
    return frameworkService.getAllFrameworks();
    
  } catch (error) {
    console.error('⚠️  Error loading frameworks, using FrameworkService fallback:', error);
    return frameworkService.getAllFrameworks();
  }
};
