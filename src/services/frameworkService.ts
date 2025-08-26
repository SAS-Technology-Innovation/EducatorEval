// Shared Framework Service - Single source of truth for look-fors
import { Framework, Question, Section } from '../types';

// Default frameworks - this should ideally come from Firebase
const defaultFrameworks: Record<string, Framework> = {
  'crp-in-action': {
    id: 'crp-in-action',
    name: 'CRP in Action: Integrated Observation Tool',
    description: 'Comprehensive evaluation framework integrating Culturally Responsive Practices',
    version: '1.0',
    status: 'active',
    lastModified: '2025-08-25',
    tags: ['crp', 'culturally-responsive', 'assessment'],
    sections: [
      {
        id: 'integrated-lookfors',
        title: '10 Look-Fors: Integrated Observation',
        description: 'Evidence-based look-fors aligned to multiple frameworks',
        weight: 100,
        questions: [
          {
            id: 'lookfor1',
            text: 'The learning target is clearly communicated, standards-based, and relevant to students. Students can explain what they are learning and why.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['learning-targets', 'clarity', 'standards'],
            helpText: 'Look for visible learning targets and student understanding of purpose',
            frameworkAlignments: ['5-daily-assessment', 'crp-curriculum', 'tripod-clarify']
          },
          {
            id: 'lookfor2',
            text: 'Teacher fosters a respectful, inclusive, and identity-affirming environment where all students feel a sense of belonging.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['belonging', 'inclusive', 'identity-affirming'],
            helpText: 'Observe inclusive language, cultural affirmation, and belonging practices',
            frameworkAlignments: ['crp-general', 'casel-social-awareness', 'panorama', 'tripod-care']
          },
          {
            id: 'lookfor3',
            text: 'Teacher checks for understanding and adjusts instruction in response to student needs.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['formative-assessment', 'responsive-teaching', 'differentiation'],
            helpText: 'Look for checks for understanding and instructional adjustments',
            frameworkAlignments: ['5-daily-assessment', 'tripod-clarify', 'inclusive-practices']
          },
          {
            id: 'lookfor4',
            text: 'Teacher uses questioning strategies that increase cognitive demand and promote student thinking.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['questioning', 'cognitive-demand', 'critical-thinking'],
            helpText: 'Observe higher-order questions and student thinking promotion',
            frameworkAlignments: ['5-daily-assessment', 'crp-high-expectations', 'tripod-challenge']
          },
          {
            id: 'lookfor5',
            text: 'Students are engaged in meaningful, collaborative learning experiences with clear roles and expectations.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['engagement', 'collaboration', 'student-roles'],
            helpText: 'Look for purposeful collaboration with defined student roles',
            frameworkAlignments: ['crp-general', 'casel-relationship-skills', 'tripod-captivate', 'inclusive-practices']
          },
          {
            id: 'lookfor6',
            text: 'Teacher demonstrates cultural competence and integrates students\' backgrounds and experiences into the lesson.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['cultural-competence', 'student-backgrounds', 'culturally-responsive'],
            helpText: 'Observe integration of student cultures and experiences into instruction',
            frameworkAlignments: ['crp-learning-partnerships', 'panorama', 'casel-social-awareness', 'tripod-confer']
          },
          {
            id: 'lookfor7',
            text: 'Teacher actively monitors and supports students during group and independent work.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['monitoring', 'support', 'independent-work'],
            helpText: 'Look for active circulation and targeted student support',
            frameworkAlignments: ['5-daily-assessment', 'tripod-control', 'inclusive-practices']
          },
          {
            id: 'lookfor8',
            text: 'Students have opportunities to reflect on and consolidate their learning during and after the lesson.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['reflection', 'consolidation', 'metacognition'],
            helpText: 'Observe student reflection and learning consolidation opportunities',
            frameworkAlignments: ['5-daily-assessment', 'casel-self-management', 'tripod-consolidate']
          },
          {
            id: 'lookfor9',
            text: 'Teacher builds strong, trusting relationships with students through affirming interactions.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['relationships', 'trust', 'affirming-interactions'],
            helpText: 'Look for positive, affirming teacher-student interactions',
            frameworkAlignments: ['panorama', 'crp-general', 'casel-relationship-skills', 'tripod-care']
          },
          {
            id: 'lookfor10',
            text: 'Instruction is differentiated and scaffolds support access for diverse learning needs.',
            type: 'rating',
            required: true,
            scale: 4,
            weight: 10,
            tags: ['differentiation', 'scaffolding', 'diverse-learners'],
            helpText: 'Observe differentiated instruction and scaffolding for all learners',
            frameworkAlignments: ['inclusive-practices', 'crp-general', 'casel-equity-access', 'tripod-clarify']
          }
        ]
      }
    ]
  }
};

export class FrameworkService {
  private static instance: FrameworkService;
  private frameworks: Record<string, Framework> = defaultFrameworks;

  private constructor() {}

  public static getInstance(): FrameworkService {
    if (!FrameworkService.instance) {
      FrameworkService.instance = new FrameworkService();
    }
    return FrameworkService.instance;
  }

  // Get framework by ID
  getFramework(frameworkId: string): Framework | undefined {
    return this.frameworks[frameworkId];
  }

  // Get all frameworks
  getAllFrameworks(): Framework[] {
    return Object.values(this.frameworks);
  }

  // Get active frameworks
  getActiveFrameworks(): Framework[] {
    return this.getAllFrameworks().filter(f => f.status === 'active');
  }

  // Get questions from a specific framework and section
  getQuestions(frameworkId: string, sectionId?: string): Question[] {
    const framework = this.getFramework(frameworkId);
    if (!framework) return [];

    if (sectionId) {
      const section = framework.sections.find(s => s.id === sectionId);
      return section ? section.questions : [];
    }

    // Return all questions from all sections
    return framework.sections.flatMap(section => section.questions);
  }

  // Get the main observation questions (10 look-fors)
  getObservationQuestions(frameworkId: string = 'crp-in-action'): Question[] {
    return this.getQuestions(frameworkId, 'integrated-lookfors');
  }

  // Get sections for a framework
  getSections(frameworkId: string): Section[] {
    const framework = this.getFramework(frameworkId);
    return framework ? framework.sections : [];
  }

  // Update framework (in-memory for now, will sync with Firebase later)
  updateFramework(frameworkId: string, updates: Partial<Framework>): boolean {
    if (!this.frameworks[frameworkId]) return false;
    
    this.frameworks[frameworkId] = {
      ...this.frameworks[frameworkId],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    return true;
  }

  // Update specific questions
  updateQuestions(frameworkId: string, sectionId: string, questions: Question[]): boolean {
    const framework = this.frameworks[frameworkId];
    if (!framework) return false;

    const sectionIndex = framework.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return false;

    framework.sections[sectionIndex].questions = questions;
    framework.lastModified = new Date().toISOString().split('T')[0];
    
    return true;
  }

  // Add new framework
  addFramework(framework: Framework): boolean {
    if (this.frameworks[framework.id]) return false;
    
    this.frameworks[framework.id] = framework;
    return true;
  }

  // Framework alignment options
  getFrameworkOptions() {
    return [
      { id: 'crp-general', label: 'CRP (General)', category: 'Culturally Responsive', color: 'green' },
      { id: 'crp-curriculum', label: 'CRP (Curriculum Relevance)', category: 'Culturally Responsive', color: 'green' },
      { id: 'crp-high-expectations', label: 'CRP (High Expectations)', category: 'Culturally Responsive', color: 'green' },
      { id: 'crp-learning-partnerships', label: 'CRP (Learning Partnerships)', category: 'Culturally Responsive', color: 'green' },
      { id: 'casel-social-awareness', label: 'CASEL (Social Awareness)', category: 'Social-Emotional', color: 'pink' },
      { id: 'casel-relationship-skills', label: 'CASEL (Relationship Skills)', category: 'Social-Emotional', color: 'pink' },
      { id: 'casel-self-management', label: 'CASEL (Self-Management)', category: 'Social-Emotional', color: 'pink' },
      { id: 'casel-equity-access', label: 'CASEL (Equity & Access)', category: 'Social-Emotional', color: 'pink' },
      { id: 'tripod-care', label: 'Tripod: Care', category: '7Cs of Learning', color: 'blue' },
      { id: 'tripod-clarify', label: 'Tripod: Clarify', category: '7Cs of Learning', color: 'blue' },
      { id: 'tripod-challenge', label: 'Tripod: Challenge', category: '7Cs of Learning', color: 'blue' },
      { id: 'tripod-captivate', label: 'Tripod: Captivate', category: '7Cs of Learning', color: 'blue' },
      { id: 'tripod-confer', label: 'Tripod: Confer', category: '7Cs of Learning', color: 'blue' },
      { id: 'tripod-consolidate', label: 'Tripod: Consolidate', category: '7Cs of Learning', color: 'blue' },
      { id: 'tripod-control', label: 'Tripod: Control', category: '7Cs of Learning', color: 'blue' },
      { id: '5-daily-assessment', label: '5 Daily Assessment Practices', category: 'Assessment', color: 'yellow' },
      { id: 'panorama', label: 'Panorama (Student Experience)', category: 'Student Experience', color: 'purple' },
      { id: 'inclusive-practices', label: 'Inclusive Practices', category: 'Inclusion & Equity', color: 'indigo' }
    ];
  }
}

// Export singleton instance
export const frameworkService = FrameworkService.getInstance();
