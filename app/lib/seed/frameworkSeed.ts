// Seed data for the Integrated Observation Framework
// Based on "Integrated Observation Draft Plan.md"
import type { Framework, FrameworkSection, Question, FrameworkAlignment } from '../../types';

// The 10 Integrated Look-Fors
export const integratedLookFors: Question[] = [
  {
    id: 'look-for-1',
    sectionId: 'single-section',
    text: 'The learning target is clearly communicated, standards-based, and relevant to students.',
    description: 'Students can explain what they are learning and why.',
    helpText: 'Look for: Teacher stating the objective verbally/posting it visibly, explaining why learning matters, connecting to prior knowledge or real-life contexts. Students referencing the learning target, explaining task purpose, co-constructing success criteria.',
    examples: [
      'Teacher posts and verbally states the learning objective',
      'Students can explain what they are learning when asked',
      'Learning goal is connected to student experiences or real-world contexts',
      'Students co-construct success criteria with the teacher'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 1,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'five_daily_assessment', name: '5 Daily Assessment Practices', category: 'Assessment', subcategory: '#1', description: '', color: 'yellow', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'crp_curriculum', name: 'CRP (Curriculum Relevance)', category: 'Culturally Responsive Practices', description: '', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_clarify', name: 'Tripod: Clarify', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['learning-target', 'standards', 'relevance'],
    categories: ['Instruction', 'Assessment'],
    difficulty: 'easy',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'student-response'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-2',
    sectionId: 'single-section',
    text: 'Teacher fosters a respectful, inclusive, and identity-affirming environment where all students feel a sense of belonging.',
    description: 'Creating a classroom culture where every student feels valued and safe.',
    helpText: 'Look for: Using inclusive language/names/pronouns, encouraging multiple perspectives, ensuring equity in participation (circles, conversational turn-taking), accessible/welcoming layout. Students participating without fear, supporting each other, expressing comfort in sharing.',
    examples: [
      'Teacher uses students\' correct names and pronouns',
      'Multiple perspectives are encouraged and validated',
      'Participation structures ensure equity (circles, turn-taking)',
      'Students support each other and show comfort sharing ideas'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 2,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'crp_general', name: 'CRP (General)', category: 'Culturally Responsive Practices', description: '', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'casel_self_awareness', name: 'CASEL (Self-Awareness)', category: 'Social-Emotional Learning', description: '', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'casel_social_awareness', name: 'CASEL (Social Awareness)', category: 'Social-Emotional Learning', description: '', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'panorama_student_exp', name: 'Panorama (Student Experience)', category: 'Student Experience', description: '', color: 'purple', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'inclusive_practices', name: 'Inclusive Practices', category: 'Inclusion & Equity', description: '', color: 'indigo', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_care', name: 'Tripod: Care', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['belonging', 'inclusion', 'identity', 'respect'],
    categories: ['Culture', 'SEL', 'Equity'],
    difficulty: 'medium',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'student-interaction'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-3',
    sectionId: 'single-section',
    text: 'Teacher checks for understanding and adjusts instruction in response to student needs.',
    description: 'Formative assessment and responsive teaching.',
    helpText: 'Look for: Using exit tickets, questioning, whiteboards, digital tools; asking clarifying questions and re-teaching; circulating to observe student work. Students responding to checks, goal setting, asking for help, revising work based on feedback.',
    examples: [
      'Teacher uses exit tickets, whiteboards, or digital tools to check understanding',
      'Teacher re-teaches concepts when students show confusion',
      'Teacher circulates and observes student work in real-time',
      'Students ask clarifying questions and revise work based on feedback'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 3,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'five_daily_assessment', name: '5 Daily Assessment Practices', category: 'Assessment', subcategory: '#2', description: '', color: 'yellow', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'inclusive_practices', name: 'Inclusive Practices', category: 'Inclusion & Equity', description: '', color: 'indigo', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_clarify', name: 'Tripod: Clarify', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_control', name: 'Tripod: Control', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['formative-assessment', 'responsive-teaching', 'checking-understanding'],
    categories: ['Assessment', 'Instruction'],
    difficulty: 'medium',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'assessment-data'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-4',
    sectionId: 'single-section',
    text: 'Teacher uses questioning strategies that increase cognitive demand and promote student thinking.',
    description: 'Higher-order thinking and questioning.',
    helpText: 'Look for: Asking open-ended or "why/how" questions for conceptual understanding, prompting students to justify reasoning, building on student responses to deepen thinking. Students engaging in peer dialogue/debate, citing evidence, asking each other questions.',
    examples: [
      'Teacher asks "why" and "how" questions to probe understanding',
      'Teacher prompts students to justify their reasoning',
      'Students engage in peer dialogue and cite evidence',
      'Questions build on each other to deepen thinking'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 4,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'five_daily_assessment', name: '5 Daily Assessment Practices', category: 'Assessment', subcategory: '#3', description: '', color: 'yellow', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'crp_high_expectations', name: 'CRP (High Expectations)', category: 'Culturally Responsive Practices', description: '', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_challenge', name: 'Tripod: Challenge', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['middle', 'high'] }
    ],
    tags: ['questioning', 'cognitive-demand', 'critical-thinking'],
    categories: ['Instruction', 'Rigor'],
    difficulty: 'medium',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'student-discourse'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-5',
    sectionId: 'single-section',
    text: 'Students are engaged in meaningful, collaborative learning experiences with clear roles and expectations.',
    description: 'Purposeful collaboration and student engagement.',
    helpText: 'Look for: Structuring group tasks with assigned roles/rubrics, scaffolding collaboration norms, clarifying expectations/timing. Students working together purposefully, referring to shared resources/roles, holding each other accountable.',
    examples: [
      'Group tasks have clear roles and expectations',
      'Collaboration norms are explicitly taught and reinforced',
      'Students work together with purpose and accountability',
      'Students reference shared resources and hold each other accountable'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 5,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'crp_general', name: 'CRP (General)', category: 'Culturally Responsive Practices', description: '', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'casel_relationship_skills', name: 'CASEL (Relationship Skills)', category: 'Social-Emotional Learning', description: '', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_captivate', name: 'Tripod: Captivate', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_control', name: 'Tripod: Control', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'inclusive_practices', name: 'Inclusive Practices', category: 'Inclusion & Equity', description: '', color: 'indigo', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['collaboration', 'engagement', 'group-work'],
    categories: ['Instruction', 'SEL'],
    difficulty: 'medium',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'student-collaboration'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-6',
    sectionId: 'single-section',
    text: 'Teacher demonstrates cultural competence and integrates students\' backgrounds and experiences into the lesson.',
    description: 'Culturally responsive teaching and learning partnerships.',
    helpText: 'Look for: Designing lessons with diverse texts/perspectives, making space for students to share personal connections, relating content to students\' cultural/linguistic/community backgrounds. Students sharing stories/identities, seeing themselves reflected in materials, demonstrating pride in cultural identity.',
    examples: [
      'Lessons include diverse texts and perspectives',
      'Students share personal and cultural connections to content',
      'Classroom materials reflect student identities and backgrounds',
      'Students demonstrate pride in their cultural identity'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 6,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'crp_learning_partnerships', name: 'CRP (Learning Partnerships)', category: 'Culturally Responsive Practices', description: '', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'panorama_student_exp', name: 'Panorama (Student Experience)', category: 'Student Experience', description: '', color: 'purple', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'casel_social_awareness', name: 'CASEL (Social Awareness)', category: 'Social-Emotional Learning', description: '', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_confer', name: 'Tripod: Confer', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['cultural-competence', 'CRP', 'diversity', 'identity'],
    categories: ['Culture', 'Equity', 'CRP'],
    difficulty: 'hard',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'curriculum-materials'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-7',
    sectionId: 'single-section',
    text: 'Teacher actively monitors and supports students during group and independent work.',
    description: 'Active monitoring and real-time support.',
    helpText: 'Look for: Circulating with purpose and interacting with students, providing just-in-time feedback, redirecting off-task students. Students asking teacher/peers for support, using feedback to revise work, staying focused and engaged.',
    examples: [
      'Teacher circulates purposefully during work time',
      'Teacher provides specific, just-in-time feedback',
      'Teacher redirects off-task behavior promptly',
      'Students seek help and use feedback to improve'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 7,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'five_daily_assessment', name: '5 Daily Assessment Practices', category: 'Assessment', subcategory: '#4', description: '', color: 'yellow', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_control', name: 'Tripod: Control', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'inclusive_practices', name: 'Inclusive Practices', category: 'Inclusion & Equity', description: '', color: 'indigo', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['monitoring', 'feedback', 'support', 'classroom-management'],
    categories: ['Instruction', 'Management'],
    difficulty: 'easy',
    evidenceRequired: true,
    evidenceTypes: ['observation'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-8',
    sectionId: 'single-section',
    text: 'Students have opportunities to reflect on and consolidate their learning during and after the lesson.',
    description: 'Reflection and metacognition.',
    helpText: 'Look for: Providing reflection prompts/journaling time, asking students to summarize learning, leading closure activity/exit routine. Students explaining learning verbally/in writing, connecting to bigger ideas, sharing what they\'re wondering about.',
    examples: [
      'Teacher provides structured reflection time or prompts',
      'Students summarize what they learned',
      'Closure activity helps students consolidate understanding',
      'Students articulate connections and remaining questions'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 8,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'five_daily_assessment', name: '5 Daily Assessment Practices', category: 'Assessment', subcategory: '#5', description: '', color: 'yellow', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'casel_self_management', name: 'CASEL (Self-Management)', category: 'Social-Emotional Learning', description: '', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_consolidate', name: 'Tripod: Consolidate', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['reflection', 'metacognition', 'closure', 'consolidation'],
    categories: ['Assessment', 'SEL'],
    difficulty: 'medium',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'student-work'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-9',
    sectionId: 'single-section',
    text: 'Teacher builds strong, trusting relationships with students through affirming interactions.',
    description: 'Positive relationships and care.',
    helpText: 'Look for: Greeting students by name with warmth, using positive reinforcement/encouragement, checking in on student well-being. Students seeking out teacher for support, showing comfort/humor in interactions, demonstrating mutual respect.',
    examples: [
      'Teacher greets students by name with warmth',
      'Teacher uses positive reinforcement consistently',
      'Teacher checks in on student well-being',
      'Students show comfort seeking teacher support'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 9,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'panorama_student_exp', name: 'Panorama (Student Experience)', category: 'Student Experience', description: '', color: 'purple', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'crp_general', name: 'CRP (General)', category: 'Culturally Responsive Practices', description: '', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'casel_relationship_skills', name: 'CASEL (Relationship Skills)', category: 'Social-Emotional Learning', description: '', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_care', name: 'Tripod: Care', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['relationships', 'care', 'trust', 'student-teacher-interaction'],
    categories: ['Culture', 'SEL'],
    difficulty: 'easy',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'student-interaction'],
    minEvidenceCount: 1
  },
  {
    id: 'look-for-10',
    sectionId: 'single-section',
    text: 'Instruction is differentiated and scaffolds support access for diverse learning needs.',
    description: 'Differentiation and universal design.',
    helpText: 'Look for: Multiple entry points, scaffolded supports, flexible grouping, varied materials/modalities. Students accessing content in different ways, using supports as needed, demonstrating understanding through multiple means.',
    examples: [
      'Tasks have multiple entry points for different learners',
      'Scaffolds and supports are available and utilized',
      'Students access content through varied modalities',
      'Flexible grouping meets diverse needs'
    ],
    type: 'rating',
    isRequired: true,
    weight: 1,
    order: 10,
    scale: {
      id: 'evidence-scale',
      name: 'Evidence Scale',
      type: 'descriptive',
      min: 0,
      max: 1,
      labels: [
        { value: 0, label: 'Not Observed', description: 'Not evident during this observation', color: 'gray' },
        { value: 1, label: 'Observed', description: 'Clear evidence observed', color: 'green' }
      ],
      includeNotObserved: true,
      notObservedLabel: 'Not Observed'
    },
    frameworkAlignments: [
      { id: 'inclusive_practices', name: 'Inclusive Practices', category: 'Inclusion & Equity', description: '', color: 'indigo', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'crp_general', name: 'CRP (General)', category: 'Culturally Responsive Practices', description: '', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'casel_equity_access', name: 'CASEL (Equity & Access)', category: 'Social-Emotional Learning', description: '', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_clarify', name: 'Tripod: Clarify', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
      { id: 'tripod_control', name: 'Tripod: Control', category: '7Cs of Learning', description: '', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
    ],
    tags: ['differentiation', 'UDL', 'scaffolding', 'access'],
    categories: ['Instruction', 'Equity', 'Inclusion'],
    difficulty: 'hard',
    evidenceRequired: true,
    evidenceTypes: ['observation', 'materials'],
    minEvidenceCount: 1
  }
];

// The single section that contains all 10 look-fors
export const integratedSection: FrameworkSection = {
  id: 'single-section',
  title: 'Integrated Observation Look-Fors',
  description: 'Ten integrated look-fors aligned with CRP, 7Cs of Learning, 5 Daily Assessment Practices, CASEL, Panorama, and Inclusive Practices',
  order: 1,
  questions: integratedLookFors,
  isRequired: true,
  weight: 1,
  color: 'blue'
};

// The complete Integrated Observation Framework
export const integratedObservationFramework: Framework = {
  id: 'integrated-observation-framework',
  name: 'Integrated Observation Framework',
  description: 'SAS schoolwide observation framework integrating CRP, 7Cs of Learning, 5 Daily Assessment Practices, CASEL, Panorama, and Inclusive Practices into 10 core look-fors. Designed for 10-15 minute classroom visits to gather evidence of high-quality, culturally responsive instruction.',
  type: 'observation',
  version: '1.0',
  status: 'active',
  schoolId: 'sas-001',
  createdBy: 'system',
  applicableDivisions: ['elementary', 'middle', 'high'],
  sections: [integratedSection],
  totalQuestions: 10,
  requiredQuestions: 10,
  estimatedDuration: 15, // 10-15 minutes
  alignments: [
    // CRP Alignments
    { id: 'crp_general', name: 'CRP (General)', category: 'Culturally Responsive Practices', description: 'General culturally responsive pedagogy practices', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'crp_curriculum', name: 'CRP (Curriculum Relevance)', category: 'Culturally Responsive Practices', description: 'Curriculum relevance and cultural connections', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'crp_high_expectations', name: 'CRP (High Expectations)', category: 'Culturally Responsive Practices', description: 'Maintaining high expectations for all students', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'crp_learning_partnerships', name: 'CRP (Learning Partnerships)', category: 'Culturally Responsive Practices', description: 'Building partnerships and collaborative learning', color: 'green', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },

    // Tripod 7Cs Alignments
    { id: 'tripod_care', name: 'Tripod: Care', category: '7Cs of Learning', description: 'Care and supportive relationships', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'tripod_clarify', name: 'Tripod: Clarify', category: '7Cs of Learning', description: 'Clarity of learning objectives and expectations', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'tripod_captivate', name: 'Tripod: Captivate', category: '7Cs of Learning', description: 'Engaging and captivating instruction', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'tripod_confer', name: 'Tripod: Confer', category: '7Cs of Learning', description: 'Conferring and collaborating with students', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'tripod_consolidate', name: 'Tripod: Consolidate', category: '7Cs of Learning', description: 'Consolidating and synthesizing learning', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'tripod_challenge', name: 'Tripod: Challenge', category: '7Cs of Learning', description: 'Academic challenge and rigor', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['middle', 'high'] },
    { id: 'tripod_control', name: 'Tripod: Control', category: '7Cs of Learning', description: 'Classroom management and student control', color: 'blue', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },

    // 5 Daily Assessment Practices
    { id: 'five_daily_assessment', name: '5 Daily Assessment Practices', category: 'Assessment', description: 'Daily formative assessment strategies', color: 'yellow', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },

    // CASEL
    { id: 'casel_self_awareness', name: 'CASEL (Self-Awareness)', category: 'Social-Emotional Learning', description: 'Self-awareness and emotional intelligence', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'casel_social_awareness', name: 'CASEL (Social Awareness)', category: 'Social-Emotional Learning', description: 'Social awareness and empathy skills', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'casel_relationship_skills', name: 'CASEL (Relationship Skills)', category: 'Social-Emotional Learning', description: 'Relationship building and communication skills', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'casel_self_management', name: 'CASEL (Self-Management)', category: 'Social-Emotional Learning', description: 'Self-management and executive function', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },
    { id: 'casel_equity_access', name: 'CASEL (Equity & Access)', category: 'Social-Emotional Learning', description: 'Equity and access for all learners', color: 'pink', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },

    // Panorama
    { id: 'panorama_student_exp', name: 'Panorama (Student Experience)', category: 'Student Experience', description: 'Student experience and engagement', color: 'purple', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] },

    // Inclusive Practices
    { id: 'inclusive_practices', name: 'Inclusive Practices', category: 'Inclusion & Equity', description: 'Inclusive teaching and equity practices', color: 'indigo', applicableTypes: ['observation'], applicableDivisions: ['elementary', 'middle', 'high'] }
  ],
  tags: ['CRP', 'Tripod', '7Cs', '5-Daily', 'CASEL', 'Panorama', 'Inclusive', 'Integrated'],
  categories: ['Observation', 'Instructional Practice', 'Cultural Responsiveness', 'SEL'],
  usageCount: 0,
  averageCompletionTime: 15,
  averageEvidenceScore: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {
    source: 'Integrated Observation Draft Plan',
    goal: '5000 observations by May 2026, 70% CRP evidence',
    observers: 80,
    observationsPerWeek: 2,
    observationDuration: '10-15 minutes'
  }
};
