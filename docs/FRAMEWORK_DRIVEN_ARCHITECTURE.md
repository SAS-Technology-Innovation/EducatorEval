# Framework-Driven Architecture Analysis

## Current State Assessment

### Problems Identified

1. **Hardcoded Questions in ObservationForm**
   - ObservationForm.tsx has 10 hardcoded "look-fors" (lines 84-145)
   - Framework alignments are manually mapped to each question
   - No dynamic loading from Framework data structure
   - **Impact**: Cannot support multiple frameworks or customize questions

2. **Static Framework Options**
   - Framework options hardcoded in form (lines 59-68)
   - Not pulling from actual Framework collection
   - **Impact**: Cannot add new frameworks without code changes

3. **Analytics Not Framework-Aware**
   - TeacherObservationsView has hardcoded category mapping (lines 126-141)
   - Insights calculated from fixed categories, not framework structure
   - **Impact**: Analytics break when framework changes

4. **Observation Type Mismatch**
   - Observation type has proper framework integration:
     - `frameworkId`, `frameworkName`, `frameworkVersion`
     - `responses: ObservationResponse[]` (with questionId references)
     - `frameworkScores: FrameworkScore[]`
   - But components don't utilize this structure properly

### What's Working

1. **Framework Type Definition** ✅
   - Excellent structure with sections, questions, alignments
   - Supports multiple question types (rating, text, multiselect, etc.)
   - Has rating scales with configurable labels
   - Division-aware and status management (active/draft/archived)

2. **Framework API & Hooks** ✅
   - `useFrameworks()` - fetches all frameworks
   - `useActiveFrameworks()` - filters active only
   - `useFramework(id)` - fetch specific framework
   - CRUD operations available

3. **Observation Data Model** ✅
   - Properly references framework via ID and version
   - Stores responses with questionId linkage
   - Has frameworkScores for analytics

## Target Architecture

### Principle: Framework is the Single Source of Truth

```
Framework Definition (Firestore)
    ↓
    ├─→ Observation Form (dynamic rendering)
    ├─→ Observation Display (dynamic layout)
    ├─→ Analytics Calculation (dynamic metrics)
    ├─→ Insights Generation (dynamic categories)
    └─→ Export/Reports (dynamic templates)
```

### Key Design Decisions

1. **Multiple Active Frameworks**
   - Observers choose framework when creating observation
   - Each observation locked to framework version (for consistency)
   - Analytics can filter/group by framework

2. **Dynamic Form Rendering**
   - Form renders sections/questions from framework.sections[]
   - Question types determine input component
   - Rating scales determine options
   - Validation based on isRequired flags

3. **Framework-Driven Analytics**
   - Calculate scores based on framework.alignments[]
   - Group insights by framework.sections[]
   - Use framework.categories[] for filtering
   - Support custom analytics per framework type

4. **Versioning**
   - Observations store framework version
   - Can view historical observations with old framework versions
   - Analytics can compare across versions

## Implementation Plan

### Phase 1: Dynamic Observation Form (Priority: CRITICAL)

**Files to Modify:**
- `app/components/features/observations/ObservationForm.tsx`
- `app/components/features/observations/ObserverQuickObservation.tsx`

**Changes:**
1. Accept `frameworkId` or `framework` prop
2. Load framework with `useFramework(frameworkId)`
3. Render sections dynamically from `framework.sections`
4. Render questions based on `question.type`:
   - `rating` → Radio buttons with scale.labels
   - `text` → Textarea
   - `multiselect` → Checkboxes
   - `checkbox` → Single checkbox
   - `file` → File upload
5. Save responses with proper questionId mapping
6. Calculate scores based on framework.alignments

### Phase 2: Dynamic Analytics (Priority: HIGH)

**Files to Modify:**
- `app/components/features/observations/TeacherObservationsView.tsx`

**Changes:**
1. Load framework for each observation
2. Calculate insights based on framework sections, not hardcoded categories
3. Map responses to framework alignments
4. Display framework-specific strength/growth areas
5. Support multi-framework comparison

### Phase 3: Framework Selector (Priority: HIGH)

**Files to Modify:**
- `app/components/features/observations/ObserverQuickObservation.tsx`
- `app/components/features/observations/ObserverObservationsView.tsx`

**Changes:**
1. Load active frameworks with `useActiveFrameworks()`
2. Show framework selector in create modal
3. Filter by framework in observations list
4. Display framework badge on each observation

### Phase 4: Framework Management UI (Priority: MEDIUM)

**Files to Create:**
- `app/admin/FrameworkEditor.tsx`
- `app/admin/FrameworkBuilder.tsx`

**Changes:**
1. CRUD interface for frameworks
2. Section builder with drag-drop ordering
3. Question builder with type selection
4. Alignment mapper
5. Preview mode

## Benefits of Framework-Driven Architecture

1. **Flexibility**: Add new frameworks without code changes
2. **Customization**: Schools can create custom observation frameworks
3. **Consistency**: One framework definition drives entire system
4. **Analytics**: Automatically adapt to framework changes
5. **Versioning**: Historical data preserved across framework updates
6. **Scalability**: Support unlimited frameworks per school

## Migration Strategy

### For Existing Data

If observations already exist with hardcoded structure:

1. Create "CRP v1.0" framework matching current hardcoded structure
2. Backfill existing observations with `frameworkId: 'crp-v1'`
3. Map existing responses to framework question IDs
4. Deploy new framework-driven components
5. Deprecate hardcoded form

### For New Deployments

1. Seed initial frameworks (CRP, CASEL, Tripod, etc.)
2. Deploy framework-driven components from start
3. Train administrators on framework management

## Code Examples

### Dynamic Form Rendering

```typescript
// ObservationForm.tsx
const { data: framework } = useFramework(frameworkId);

return (
  <form>
    {framework?.sections.map(section => (
      <Section key={section.id}>
        <h3>{section.title}</h3>
        <p>{section.description}</p>
        {section.questions.map(question => (
          <Question
            key={question.id}
            question={question}
            value={responses[question.id]}
            onChange={(value) => handleResponse(question.id, value)}
          />
        ))}
      </Section>
    ))}
  </form>
);
```

### Dynamic Analytics

```typescript
// TeacherObservationsView.tsx
const calculateInsights = (observations: Observation[]) => {
  const bySections: Record<string, { scores: number[], framework: Framework }> = {};

  observations.forEach(obs => {
    const framework = frameworks.find(f => f.id === obs.frameworkId);
    if (!framework) return;

    framework.sections.forEach(section => {
      const sectionQuestions = section.questions;
      const sectionResponses = obs.responses.filter(r =>
        sectionQuestions.some(q => q.id === r.questionId)
      );

      // Calculate section score
      const scores = sectionResponses.map(r => parseFloat(r.rating));

      if (!bySections[section.id]) {
        bySections[section.id] = { scores: [], framework };
      }
      bySections[section.id].scores.push(...scores);
    });
  });

  // Return insights grouped by section
  return Object.entries(bySections).map(([sectionId, data]) => ({
    sectionName: data.framework.sections.find(s => s.id === sectionId)?.title,
    averageScore: average(data.scores),
    color: data.framework.sections.find(s => s.id === sectionId)?.color
  }));
};
```

## Success Metrics

- ✅ Observation form renders without hardcoded questions
- ✅ Multiple frameworks selectable during observation creation
- ✅ Analytics adapt to framework structure automatically
- ✅ Administrators can create/edit frameworks via UI
- ✅ Historical observations render correctly with old framework versions
- ✅ Performance: Form loads in <500ms even with 50+ questions

## Timeline Estimate

- **Phase 1** (Dynamic Form): 3-4 days
- **Phase 2** (Analytics): 2-3 days
- **Phase 3** (Framework Selector): 1-2 days
- **Phase 4** (Admin UI): 5-7 days

**Total**: 11-16 days for complete framework-driven architecture
