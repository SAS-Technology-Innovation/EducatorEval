# Framework Alignment Tag System

## Overview

The Integrated Observation Framework uses a comprehensive, color-coded tag system to show how each look-for aligns with multiple educational frameworks. This creates a unified system that replaces 6+ separate observation tools.

## Framework Categories & Colors

### 🟢 Culturally Responsive Practices (CRP)
**Color:** `green` | **Tailwind:** `bg-green-100 text-green-800`

- **CRP (General)** - Overall culturally responsive teaching
- **CRP (Curriculum Relevance)** - Content relevance to students' lives
- **CRP (High Expectations)** - High expectations for all students
- **CRP (Learning Partnerships)** - Student-teacher collaboration

### 🩷 Social-Emotional Learning (CASEL)
**Color:** `pink` | **Tailwind:** `bg-pink-100 text-pink-800`

- **CASEL (Self-Awareness)** - Understanding emotions and strengths
- **CASEL (Social Awareness)** - Empathy and perspective-taking
- **CASEL (Relationship Skills)** - Building positive relationships
- **CASEL (Self-Management)** - Managing emotions and behaviors
- **CASEL (Responsible Decision-Making)** - Making constructive choices

### 🔵 7Cs of Learning (Tripod)
**Color:** `blue` | **Tailwind:** `bg-blue-100 text-blue-800`

- **Tripod: Care** - Teacher shows care for students
- **Tripod: Challenge** - Teacher pushes students to think
- **Tripod: Clarify** - Teacher explains things clearly
- **Tripod: Captivate** - Teacher makes learning interesting
- **Tripod: Confer** - Students discuss with teacher and peers
- **Tripod: Consolidate** - Students organize and remember learning
- **Tripod: Control** - Students have voice in their learning

### 🟡 Assessment Practices
**Color:** `yellow` | **Tailwind:** `bg-yellow-100 text-yellow-800`

- **5 Daily Assessment #1** - Clear learning targets
- **5 Daily Assessment #2** - Success criteria and exemplars
- **5 Daily Assessment #3** - Feedback during learning
- **5 Daily Assessment #4** - Student self-assessment
- **5 Daily Assessment #5** - Evidence-based adjustment

### 🟣 Student Experience (Panorama)
**Color:** `purple` | **Tailwind:** `bg-purple-100 text-purple-800`

- **Panorama (Student Experience)** - Overall student perceptions
- **Panorama (Sense of Belonging)** - Feeling connected to school
- **Panorama (Pedagogical Effectiveness)** - Teacher effectiveness measures

### 🟦 Inclusion & Equity
**Color:** `indigo` | **Tailwind:** `bg-indigo-100 text-indigo-800`

- **Inclusive Practices** - Universal Design for Learning (UDL)
- **Equity in Access** - All students can access content
- **Differentiation** - Meeting diverse needs

---

## Current Framework Structure

Each look-for in the framework includes `frameworkAlignments` array:

```typescript
frameworkAlignments: [
  {
    id: 'five_daily_assessment',
    name: '5 Daily Assessment Practices',
    category: 'Assessment',
    subcategory: '#1',
    description: '',
    color: 'yellow',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high']
  },
  {
    id: 'crp_curriculum',
    name: 'CRP (Curriculum Relevance)',
    category: 'Culturally Responsive Practices',
    description: '',
    color: 'green',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high']
  }
  // ... more alignments
]
```

---

## Complete Framework Alignment Mapping

### Look-For 1: Learning Target Communicated
**Alignments:**
- 🟡 5 Daily Assessment #1
- 🟢 CRP (Curriculum Relevance)
- 🔵 Tripod: Clarify

### Look-For 2: Respectful, Inclusive Environment
**Alignments:**
- 🟢 CRP (General)
- 🩷 CASEL (Self-Awareness)
- 🩷 CASEL (Social Awareness)
- 🟣 Panorama (Student Experience)
- 🟦 Inclusive Practices
- 🔵 Tripod: Care

### Look-For 3: Checks for Understanding
**Alignments:**
- 🟡 5 Daily Assessment #2
- 🔵 Tripod: Clarify
- 🟣 Panorama (Pedagogical Effectiveness)

### Look-For 4: Questioning Strategies
**Alignments:**
- 🔵 Tripod: Challenge
- 🟣 Panorama (Pedagogical Effectiveness)

### Look-For 5: Collaborative Learning
**Alignments:**
- 🔵 Tripod: Confer
- 🩷 CASEL (Social Awareness)
- 🩷 CASEL (Relationship Skills)

### Look-For 6: Cultural Competence
**Alignments:**
- 🟢 CRP (Curriculum)
- 🟢 CRP (Instruction)
- 🟦 Inclusive Practices

### Look-For 7: Monitors & Supports
**Alignments:**
- 🟡 5 Daily Assessment #3
- 🔵 Tripod: Care
- 🟣 Panorama (Pedagogical Effectiveness)

### Look-For 8: Reflection & Consolidation
**Alignments:**
- 🟡 5 Daily Assessment #4
- 🩷 CASEL (Self-Awareness)
- 🔵 Tripod: Consolidate

### Look-For 9: Strong Relationships
**Alignments:**
- 🔵 Tripod: Care
- 🩷 CASEL (Relationship Skills)
- 🟢 CRP (Climate)
- 🟣 Panorama (Sense of Belonging)

### Look-For 10: Differentiation
**Alignments:**
- 🟡 5 Daily Assessment #5
- 🟦 Inclusive Practices
- 🟣 Panorama (Pedagogical Effectiveness)

---

## Visual Display Components

### 1. Framework Tag Badge
```tsx
interface FrameworkTagProps {
  alignment: FrameworkAlignment;
  size?: 'sm' | 'md' | 'lg';
}

const FrameworkTag: React.FC<FrameworkTagProps> = ({ alignment, size = 'sm' }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium
      ${colorClasses[alignment.color]}
      ${sizeClasses[size]}
    `}>
      {alignment.name}
    </span>
  );
};
```

### 2. Framework Tag Group
```tsx
interface FrameworkTagGroupProps {
  alignments: FrameworkAlignment[];
  maxVisible?: number;
}

const FrameworkTagGroup: React.FC<FrameworkTagGroupProps> = ({
  alignments,
  maxVisible = 5
}) => {
  const visible = alignments.slice(0, maxVisible);
  const remaining = alignments.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map(alignment => (
        <FrameworkTag key={alignment.id} alignment={alignment} />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-500 self-center">
          +{remaining} more
        </span>
      )}
    </div>
  );
};
```

### 3. Framework Category Selector
```tsx
interface FrameworkCategorySelectorProps {
  selectedAlignments: string[];
  onChange: (alignmentIds: string[]) => void;
}

const allAlignments: FrameworkAlignment[] = [
  // CRP - Green
  { id: 'crp_general', name: 'CRP (General)', category: 'Culturally Responsive Practices', color: 'green' },
  { id: 'crp_curriculum', name: 'CRP (Curriculum Relevance)', category: 'Culturally Responsive Practices', color: 'green' },
  { id: 'crp_expectations', name: 'CRP (High Expectations)', category: 'Culturally Responsive Practices', color: 'green' },
  { id: 'crp_partnerships', name: 'CRP (Learning Partnerships)', category: 'Culturally Responsive Practices', color: 'green' },

  // CASEL - Pink
  { id: 'casel_self_awareness', name: 'CASEL (Self-Awareness)', category: 'Social-Emotional Learning', color: 'pink' },
  { id: 'casel_social_awareness', name: 'CASEL (Social Awareness)', category: 'Social-Emotional Learning', color: 'pink' },
  { id: 'casel_relationship', name: 'CASEL (Relationship Skills)', category: 'Social-Emotional Learning', color: 'pink' },
  { id: 'casel_self_management', name: 'CASEL (Self-Management)', category: 'Social-Emotional Learning', color: 'pink' },
  { id: 'casel_decision_making', name: 'CASEL (Responsible Decision-Making)', category: 'Social-Emotional Learning', color: 'pink' },

  // Tripod - Blue
  { id: 'tripod_care', name: 'Tripod: Care', category: '7Cs of Learning', color: 'blue' },
  { id: 'tripod_challenge', name: 'Tripod: Challenge', category: '7Cs of Learning', color: 'blue' },
  { id: 'tripod_clarify', name: 'Tripod: Clarify', category: '7Cs of Learning', color: 'blue' },
  { id: 'tripod_captivate', name: 'Tripod: Captivate', category: '7Cs of Learning', color: 'blue' },
  { id: 'tripod_confer', name: 'Tripod: Confer', category: '7Cs of Learning', color: 'blue' },
  { id: 'tripod_consolidate', name: 'Tripod: Consolidate', category: '7Cs of Learning', color: 'blue' },
  { id: 'tripod_control', name: 'Tripod: Control', category: '7Cs of Learning', color: 'blue' },

  // Assessment - Yellow
  { id: 'five_daily_1', name: '5 Daily Assessment #1', category: 'Assessment', subcategory: 'Clear targets', color: 'yellow' },
  { id: 'five_daily_2', name: '5 Daily Assessment #2', category: 'Assessment', subcategory: 'Success criteria', color: 'yellow' },
  { id: 'five_daily_3', name: '5 Daily Assessment #3', category: 'Assessment', subcategory: 'Feedback', color: 'yellow' },
  { id: 'five_daily_4', name: '5 Daily Assessment #4', category: 'Assessment', subcategory: 'Self-assessment', color: 'yellow' },
  { id: 'five_daily_5', name: '5 Daily Assessment #5', category: 'Assessment', subcategory: 'Adjustment', color: 'yellow' },

  // Panorama - Purple
  { id: 'panorama_experience', name: 'Panorama (Student Experience)', category: 'Student Experience', color: 'purple' },
  { id: 'panorama_belonging', name: 'Panorama (Sense of Belonging)', category: 'Student Experience', color: 'purple' },
  { id: 'panorama_effectiveness', name: 'Panorama (Pedagogical Effectiveness)', category: 'Student Experience', color: 'purple' },

  // Inclusive - Indigo
  { id: 'inclusive_practices', name: 'Inclusive Practices', category: 'Inclusion & Equity', color: 'indigo' },
  { id: 'equity_access', name: 'Equity in Access', category: 'Inclusion & Equity', color: 'indigo' },
  { id: 'differentiation', name: 'Differentiation', category: 'Inclusion & Equity', color: 'indigo' }
];

const FrameworkCategorySelector: React.FC<FrameworkCategorySelectorProps> = ({
  selectedAlignments,
  onChange
}) => {
  const categories = [
    { name: 'Culturally Responsive Practices', icon: '🟢', color: 'green' },
    { name: 'Social-Emotional Learning', icon: '🩷', color: 'pink' },
    { name: '7Cs of Learning', icon: '🔵', color: 'blue' },
    { name: 'Assessment', icon: '🟡', color: 'yellow' },
    { name: 'Student Experience', icon: '🟣', color: 'purple' },
    { name: 'Inclusion & Equity', icon: '🟦', color: 'indigo' }
  ];

  const toggleAlignment = (alignmentId: string) => {
    const newSelection = selectedAlignments.includes(alignmentId)
      ? selectedAlignments.filter(id => id !== alignmentId)
      : [...selectedAlignments, alignmentId];
    onChange(newSelection);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Framework Alignments</h3>

      {categories.map(category => {
        const categoryAlignments = allAlignments.filter(
          a => a.category === category.name
        );

        return (
          <div key={category.name} className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
              {categoryAlignments.map(alignment => (
                <label
                  key={alignment.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlignments.includes(alignment.id)}
                    onChange={() => toggleAlignment(alignment.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <FrameworkTag alignment={alignment} size="sm" />
                </label>
              ))}
            </div>
          </div>
        );
      })}

      {/* Selected Count */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{selectedAlignments.length}</span> framework
          alignment{selectedAlignments.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  );
};
```

---

## Usage Examples

### 1. In Observation Form
Display framework tags for each look-for to help observers understand what they're looking for:

```tsx
<div className="look-for-item">
  <h3>Look-For 1: Learning Target Communicated</h3>

  {/* Framework Alignments */}
  <div className="mb-4">
    <p className="text-sm text-gray-600 mb-2">Framework Alignments:</p>
    <FrameworkTagGroup
      alignments={lookFor1.frameworkAlignments}
      maxVisible={3}
    />
  </div>

  {/* Observation fields */}
  <div className="observation-fields">
    {/* Radio buttons, evidence, etc. */}
  </div>
</div>
```

### 2. In Framework Editor
Allow admins to select framework alignments when editing questions:

```tsx
<div className="question-editor">
  <h3>Edit Question</h3>

  {/* Question text, description, etc. */}

  <FrameworkCategorySelector
    selectedAlignments={question.frameworkAlignments.map(a => a.id)}
    onChange={(alignmentIds) => updateQuestion({
      frameworkAlignments: alignmentIds.map(id =>
        allAlignments.find(a => a.id === id)
      )
    })}
  />
</div>
```

### 3. In Analytics Dashboard
Filter and group observations by framework alignment:

```tsx
<div className="analytics-filters">
  <h3>Filter by Framework</h3>

  {/* Quick filters by category */}
  <div className="flex flex-wrap gap-2">
    <button className="filter-btn bg-green-100 text-green-800">
      🟢 CRP
    </button>
    <button className="filter-btn bg-pink-100 text-pink-800">
      🩷 CASEL
    </button>
    <button className="filter-btn bg-blue-100 text-blue-800">
      🔵 Tripod
    </button>
    {/* More filters */}
  </div>

  {/* Detailed breakdown */}
  <div className="framework-breakdown">
    <h4>CRP Evidence: 67% (Target: 70%)</h4>
    <ProgressBar value={67} target={70} color="green" />
  </div>
</div>
```

---

## Benefits of This System

### 1. **Visual Clarity**
Color-coding makes it instantly obvious which frameworks are being observed.

### 2. **Consistency**
Standardized tags prevent typos and ensure consistent reporting across all observations.

### 3. **Comprehensive Coverage**
One observation tool covers 6+ frameworks, reducing observation burden on teachers.

### 4. **Easy Filtering & Analysis**
- Filter observations by framework type
- Track CRP evidence percentage (goal: 70%)
- Compare framework implementation across divisions/departments
- Generate framework-specific reports

### 5. **Mobile-Friendly**
Tags display well on mobile devices during observations.

### 6. **Future-Proof**
Easy to add new frameworks or alignments without changing the core structure.

---

## Next Steps

1. ✅ Framework data structure is complete
2. ⏳ Create `FrameworkTag` component
3. ⏳ Create `FrameworkCategorySelector` component
4. ⏳ Integrate into ObservationForm
5. ⏳ Add framework filtering to analytics
6. ⏳ Create CRP evidence tracking dashboard (70% goal)
