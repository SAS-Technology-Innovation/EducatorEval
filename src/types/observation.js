// Pre-defined CRP Framework Structure (Culturally Responsive Pedagogy)
export const CRPFrameworkSections = [
    {
        id: 'academic-success',
        title: 'Academic Success',
        description: 'Practices that support academic achievement for all students',
        color: 'blue',
        weight: 0.25
    },
    {
        id: 'cultural-competence',
        title: 'Cultural Competence',
        description: 'Practices that acknowledge and incorporate student cultural references',
        color: 'green',
        weight: 0.25
    },
    {
        id: 'critical-consciousness',
        title: 'Critical Consciousness',
        description: 'Practices that help students critique social norms and inequities',
        color: 'purple',
        weight: 0.25
    },
    {
        id: 'community-connections',
        title: 'Community Connections',
        description: 'Practices that connect learning to community contexts and experiences',
        color: 'orange',
        weight: 0.25
    }
];
// Pre-defined rating scale for CRP observations
export const CRPRatingScale = {
    id: 'crp-4-point',
    name: 'CRP 4-Point Evidence Scale',
    type: 'descriptive',
    min: 0,
    max: 4,
    includeNotObserved: true,
    notObservedLabel: 'Not Observed',
    labels: [
        {
            value: 0,
            label: 'Not Observed',
            description: 'This practice was not observed during the lesson',
            color: 'gray'
        },
        {
            value: 1,
            label: 'Beginning',
            description: 'Teacher demonstrates limited implementation of this practice',
            color: 'red'
        },
        {
            value: 2,
            label: 'Developing',
            description: 'Teacher demonstrates developing implementation of this practice',
            color: 'yellow'
        },
        {
            value: 3,
            label: 'Proficient',
            description: 'Teacher demonstrates proficient implementation of this practice',
            color: 'green'
        },
        {
            value: 4,
            label: 'Advanced',
            description: 'Teacher demonstrates advanced implementation of this practice',
            color: 'blue'
        }
    ]
};
// CRP Framework Alignments - Now division-aware
export const CRPFrameworkAlignments = {
    crp_general: {
        id: 'crp_general',
        name: 'CRP (General)',
        color: 'green',
        category: 'Culturally Responsive Practices',
        description: 'General culturally responsive pedagogy practices',
        applicableTypes: ['observation', 'evaluation'],
        applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
    },
    crp_curriculum: {
        id: 'crp_curriculum',
        name: 'CRP (Curriculum Relevance)',
        color: 'green',
        category: 'Culturally Responsive Practices',
        description: 'Curriculum relevance and cultural connections',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high'],
    },
    crp_high_expectations: {
        id: 'crp_high_expectations',
        name: 'CRP (High Expectations)',
        color: 'green',
        category: 'Culturally Responsive Practices',
        description: 'Maintaining high expectations for all students',
        applicableTypes: ['observation', 'evaluation'],
        applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
    },
    crp_learning_partnerships: {
        id: 'crp_learning_partnerships',
        name: 'CRP (Learning Partnerships)',
        color: 'green',
        category: 'Culturally Responsive Practices',
        description: 'Building partnerships and collaborative learning',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high'],
    },
    casel_self_awareness: {
        id: 'casel_self_awareness',
        name: 'CASEL (Self-Awareness)',
        color: 'pink',
        category: 'Social-Emotional Learning',
        description: 'Self-awareness and emotional intelligence',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
    },
    casel_social_awareness: {
        id: 'casel_social_awareness',
        name: 'CASEL (Social Awareness)',
        color: 'pink',
        category: 'Social-Emotional Learning',
        description: 'Social awareness and empathy skills',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high'],
    },
    casel_relationship_skills: {
        id: 'casel_relationship_skills',
        name: 'CASEL (Relationship Skills)',
        color: 'pink',
        category: 'Social-Emotional Learning',
        description: 'Relationship building and communication skills',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
    },
    tripod_care: {
        id: 'tripod_care',
        name: 'Tripod: Care',
        color: 'blue',
        category: '7Cs of Learning',
        description: 'Care and supportive relationships',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high'],
    },
    tripod_challenge: {
        id: 'tripod_challenge',
        name: 'Tripod: Challenge',
        color: 'blue',
        category: '7Cs of Learning',
        description: 'Academic challenge and rigor',
        applicableTypes: ['observation'],
        applicableDivisions: ['middle', 'high'], // More relevant for older students
    },
    five_daily_assessment: {
        id: 'five_daily_assessment',
        name: '5 Daily Assessment Practices',
        color: 'yellow',
        category: 'Assessment',
        description: 'Daily formative assessment strategies',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high'],
    },
    panorama_student_exp: {
        id: 'panorama_student_exp',
        name: 'Panorama (Student Experience)',
        color: 'purple',
        category: 'Student Experience',
        description: 'Student experience and engagement',
        applicableTypes: ['observation'],
        applicableDivisions: ['elementary', 'middle', 'high'],
    },
    inclusive_practices: {
        id: 'inclusive_practices',
        name: 'Inclusive Practices',
        color: 'indigo',
        category: 'Inclusion & Equity',
        description: 'Inclusive teaching and equity practices',
        applicableTypes: ['observation', 'evaluation'],
        applicableDivisions: ['elementary', 'middle', 'high', 'early_learning_center'],
    },
};
