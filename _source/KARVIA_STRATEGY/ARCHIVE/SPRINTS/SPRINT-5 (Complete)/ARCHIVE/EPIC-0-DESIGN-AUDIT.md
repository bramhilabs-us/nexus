# Sprint 5 Epic 0: Design Audit Report
**Date**: November 25, 2025
**Auditor**: Claude Code
**Status**: ⚠️ ISSUES FOUND - Requires Design Decisions

---

## Executive Summary

Audited the Milestone-Based Planning feature specification against existing codebase. Found **4 critical design conflicts** that need resolution before implementation.

**Verdict**:
- ✅ No new pages created (good!)
- ⚠️ Conflicts with existing planning.html UX
- ⚠️ Duplicate AI generation systems
- ⚠️ API route structure inconsistency
- ⚠️ Unclear relationship with current "Weekly Goals" feature

---

## ✅ Positive Findings

### 1. No New Pages Created
**Status**: ✅ GOOD

- Epic correctly proposes modifying existing `client/pages/planning.html`
- No unnecessary new HTML files
- Follows principle of extending rather than duplicating

### 2. Backward-Compatible Data Model
**Status**: ✅ GOOD

**Current Goal Model**:
```javascript
time_period: {
  enum: ['QUARTERLY', 'WEEKLY', 'MONTHLY']
}
```

**Proposed Enhancement**:
```javascript
time_period: {
  enum: ['QUARTERLY', 'WEEKLY', 'MONTHLY', 'MILESTONE'] // Add MILESTONE
}
```

✅ Backward compatible - existing goals unaffected
✅ New fields (milestone_week, milestone_title, action_items) are optional/conditional
✅ Soft delete pattern maintained

### 3. Service Layer Alignment
**Status**: ✅ GOOD

**Proposed**: `server/services/MilestonePlannerService.js`

**Existing Pattern**:
- `AIObjectivePlanner.js` - AI objective generation
- `aiOKRService.js` - AI OKR generation
- `AIContextService.js` - Context building for AI

✅ Follows established naming convention
✅ Consistent AI service pattern
✅ Proper separation of concerns

---

## ⚠️ Critical Issues Found

### ISSUE 1: API Routes Structure Inconsistency
**Severity**: 🟡 MEDIUM
**Impact**: Code organization, maintainability

**Proposed Design**:
- New file: `server/routes/milestones.js`
- 6 new endpoints under `/api/milestones/*`

**Current Architecture**:
- Existing file: `server/routes/planning.js` (already handles goal hierarchy)
- Existing file: `server/routes/goals.js` (handles goal CRUD)

**The Conflict**:
Milestones are just Goals with `time_period='MILESTONE'`. Creating a separate routes file breaks the pattern.

**Current Planning Routes** (`server/routes/planning.js`):
```javascript
// Already handles:
POST   /api/planning/hierarchy      - Get full goal hierarchy
GET    /api/planning/goals/weekly   - Get weekly goals
POST   /api/planning/generate       - Generate AI plan
```

**Recommendation**:
```
OPTION A (Recommended): Add to existing planning.js
  POST   /api/planning/milestones/generate
  POST   /api/planning/milestones/save
  GET    /api/planning/milestones/:keyResultId
  PUT    /api/planning/milestones/:id
  DELETE /api/planning/milestones/:id

OPTION B: Add to existing goals.js
  GET    /api/goals/milestones/:keyResultId
  POST   /api/goals/milestones
  PUT    /api/goals/milestones/:id

OPTION C: Keep separate milestones.js (as proposed)
  - Only if we anticipate 20+ milestone-specific endpoints
  - Currently: Only 6 endpoints proposed
```

**Decision Needed**: Which option should we use?

---

### ISSUE 2: Frontend UX Conflict with Existing Planning Flow
**Severity**: 🔴 HIGH
**Impact**: User experience, feature overlap, confusion

**Current Planning Page UX** (`client/pages/planning.html`):

```
┌─────────────────────────────────────────────────────────┐
│  Objective Tabs: [Q1 2025] [Q2 2025] [Q3 2025] [Q4 2025]│
├─────────────────────────────────────────────────────────┤
│  Left Panel (40%)      │  Right Panel (60%)             │
│  ┌─────────────────┐   │  ┌──────────────────────────┐  │
│  │ Key Results     │   │  │ Create Weekly Goals      │  │
│  │                 │   │  │                          │  │
│  │ KR 1.1 [click]  │   │  │ 1. Select KR             │  │
│  │ KR 1.2          │   │  │ 2. Choose start week     │  │
│  │ KR 1.3          │   │  │ 3. Choose timeline       │  │
│  │                 │   │  │ 4. Click "Generate AI"   │  │
│  │                 │   │  │                          │  │
│  │                 │   │  │ [🤖 Generate AI Plan]    │  │
│  └─────────────────┘   │  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Current Flow**:
1. User clicks KR in left panel
2. Right panel shows "Create Weekly Goals" form
3. User selects start week (dropdown: Week 1, Week 2, etc.)
4. User selects timeline (1-12 weeks)
5. User clicks "🤖 Generate AI Plan"
6. AI generates weekly goals
7. Review screen shows generated goals
8. User clicks "✅ Create Goals"

**Proposed Planning Page UX** (from Epic wireframes):

```
┌─────────────────────────────────────────────────────────┐
│  Objective Tabs: [Foster Culture] [Boost Speed] ...     │
├─────────────────────────────────────────────────────────┤
│  Key Results Grid                                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ KR 1.1     │  │ KR 1.2     │  │ KR 1.3     │        │
│  │ [SELECTED] │  │            │  │            │        │
│  └────────────┘  └────────────┘  └────────────┘        │
├─────────────────────────────────────────────────────────┤
│  📍 Milestones for: KR 1.1         [✨ Create Plan]    │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Week 1 Milestone │  │ Week 2 Milestone │            │
│  │ Action items...  │  │ Action items...  │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

**Proposed Flow**:
1. User clicks KR card (gets highlighted)
2. Milestones section appears below
3. User clicks "Create Plan" button
4. Modal opens asking for weeks count
5. AI generates milestone plan
6. Milestones displayed as cards with action items

**THE CONFLICT**:
- ❌ Two completely different layouts for the same page
- ❌ Two different AI generation buttons ("Generate AI Plan" vs "Create Plan")
- ❌ Different navigation patterns (panel-based vs card-based)
- ❌ Different terminology ("Weekly Goals" vs "Milestones")

**Questions That Need Answers**:
1. Are we **replacing** the current planning.html or **adding to it**?
2. If replacing: How do we migrate users from current flow?
3. If adding: How do users choose between "Weekly Goals" and "Milestones"?
4. Are "Weekly Goals" and "Milestones" the same thing with different names?

**Recommendation**:
```
OPTION A (Clean Slate):
  - Replace entire planning.html with new milestone-based design
  - Migrate existing WEEKLY goals to MILESTONE type
  - Single unified planning experience

OPTION B (Tabs):
  - Keep existing UI
  - Add tab: [Weekly Goals] [Milestones]
  - Users choose which planning method to use

OPTION C (Rename):
  - "Weekly Goals" ARE "Milestones"
  - Simply rename the feature
  - Add action_items array to existing weekly goals
  - Enhance existing UI instead of replacing
```

**Decision Needed**: Which option aligns with product vision?

---

### ISSUE 3: Terminology & Feature Overlap
**Severity**: 🟡 MEDIUM
**Impact**: User confusion, documentation clarity

**Current System**:
```
Objective
  └─ Key Results
      └─ Weekly Goals (time_period='WEEKLY')
          └─ Tasks (separate Task model)
```

**Proposed System**:
```
Objective
  └─ Key Results
      └─ Milestones (time_period='MILESTONE')
          └─ Action Items (embedded array)
```

**The Confusion**:
- Are "Weekly Goals" and "Milestones" different features?
- If different, when does user create weekly goals vs milestones?
- If same, why different names?

**Current Feature Set**:
```javascript
// Current planning.html already has:
- AI-powered weekly goal generation
- Week-by-week breakdown
- Timeline selection (1-12 weeks)
- Owner assignment
```

**Proposed Feature Set**:
```javascript
// Proposed milestone system has:
- AI-powered milestone generation (same as above?)
- Week-by-week breakdown (same as above?)
- Timeline selection (1-12 weeks) (same as above?)
- Action items (NEW - this is the only difference!)
```

**The Real Difference**: Action items embedded in goals!

**Recommendation**:
```
OPTION A (Enhancement):
  - Enhance existing "Weekly Goals" with action_items array
  - Keep name "Weekly Goals" (familiar to users)
  - Add action items UI to existing cards

OPTION B (Rebrand):
  - Rename "Weekly Goals" → "Milestones"
  - Add action items feature
  - Update all UI text

OPTION C (Separate Features):
  - Keep Weekly Goals for simple planning
  - Add Milestones for complex planning with action items
  - User chooses based on complexity needs
```

**Decision Needed**: What's the relationship between these features?

---

### ISSUE 4: Duplicate AI Generation Systems
**Severity**: 🟡 MEDIUM
**Impact**: Code duplication, maintenance overhead

**Current AI Generation** (`client/pages/planning.html`):

```javascript
// Current generatePlan() function
async function generatePlan() {
  const response = await fetch('/api/planning/generate', {
    method: 'POST',
    body: JSON.stringify({
      key_result_id: selectedKRId,
      start_week: startWeek,
      timeline: weeks,
      owner_id: ownerId
    })
  });

  // Returns: Array of weekly goals with AI-generated content
}
```

**Proposed AI Generation** (Epic specification):

```javascript
// Proposed MilestonePlannerService.generateMilestonePlan()
async generateMilestonePlan({ key_result_id, weeks_count, company_id, start_date }) {
  // Build context
  // Call OpenAI with similar prompt
  // Return milestone plan
}
```

**The Overlap**:
- ✅ Both use OpenAI GPT-4o-mini
- ✅ Both generate week-by-week plans
- ✅ Both use company context
- ✅ Both use KR information
- ✅ Both have template fallback

**The Difference**:
- Current: Returns array of simple goals
- Proposed: Returns goals with embedded action_items array

**Code Duplication Risk**:
```javascript
// We'd have TWO similar services:
AIObjectivePlanner.js  // Generates objectives
MilestonePlannerService.js // Generates milestones ← NEW
// Plus existing generatePlan() in planning.html
```

**Recommendation**:
```
OPTION A (Unified Service):
  - Enhance existing AIObjectivePlanner or create shared PlanningAIService
  - Single method: generatePlan(type, params)
  - type: 'weekly' | 'milestone' | 'quarterly'

OPTION B (Specialized Services):
  - Keep separate services for different contexts
  - Share common logic in AIContextService
  - Each service handles its specific prompt engineering

OPTION C (Enhance Existing):
  - Add action_items generation to current generatePlan()
  - No new service needed
  - Simpler architecture
```

**Decision Needed**: Do we need a separate AI service?

---

## 📋 Design Consolidation Recommendations

Based on audit findings, here are three possible implementation paths:

### PATH 1: Enhancement (Recommended - Lowest Risk)
**Description**: Enhance existing Weekly Goals with action items

**Changes Required**:
1. ✅ Data Model: Add action_items array to Goal model ✅ Already proposed
2. ✅ UI: Enhance existing planning.html cards to show action items
3. ✅ Keep existing 2-panel layout (KR list + planning workspace)
4. ✅ Enhance existing AI generation to include action items
5. ✅ Keep "Weekly Goals" terminology (familiar to users)

**Pros**:
- Minimal UI disruption
- Builds on existing foundation
- Users already understand current flow
- Less code to write

**Cons**:
- Doesn't match proposed wireframes exactly
- Less "revolutionary" product change

**Story Points**: ~15-18 (vs 29 proposed)

---

### PATH 2: Parallel Features (Medium Risk)
**Description**: Add Milestones as separate feature alongside Weekly Goals

**Changes Required**:
1. Add tab switcher: [Weekly Goals] [Milestones]
2. Create new milestone UI (as proposed in wireframes)
3. Create MilestonePlannerService
4. Users choose which planning type to use

**Pros**:
- Both features available
- Users can choose complexity level
- Gradual migration possible

**Cons**:
- More complex UI
- User confusion (when to use which?)
- Duplicate code paths
- Higher maintenance

**Story Points**: ~29 (as proposed)

---

### PATH 3: Complete Replacement (Highest Risk)
**Description**: Replace Weekly Goals with new Milestone system

**Changes Required**:
1. Completely redesign planning.html (as proposed in wireframes)
2. Migrate existing WEEKLY goals to MILESTONE type
3. Update all documentation
4. Train users on new flow

**Pros**:
- Clean implementation of new vision
- Single planning paradigm
- Matches proposed design exactly

**Cons**:
- Breaking change for existing users
- Migration complexity
- Higher development cost
- Retraining required

**Story Points**: ~35-40 (more than proposed due to migration)

---

## 🎯 Recommended Action Plan

### Immediate Actions:

1. **Clarify Product Vision** (Before any coding)
   - [ ] Are we enhancing or replacing Weekly Goals?
   - [ ] What's the terminology: "Weekly Goals" or "Milestones"?
   - [ ] Single planning system or parallel features?

2. **UI/UX Decision** (Critical for story points)
   - [ ] Keep existing 2-panel layout or switch to card grid?
   - [ ] How does this fit with current navigation?
   - [ ] Wireframe review with stakeholders

3. **API Architecture Decision**
   - [ ] Add to planning.js or separate milestones.js?
   - [ ] New AI service or enhance existing?
   - [ ] Endpoint naming convention

4. **Update Sprint 5 Spec** (After decisions made)
   - [ ] Revise wireframes if needed
   - [ ] Adjust story points based on chosen path
   - [ ] Update technical implementation plan
   - [ ] Clarify migration strategy

---

## 📊 Story Point Impact Analysis

**Original Estimate**: 29 story points

**Revised Estimates by Path**:
- Path 1 (Enhancement): **15-18 points** (41% reduction)
- Path 2 (Parallel): **29-32 points** (matches original)
- Path 3 (Replacement): **35-40 points** (38% increase)

---

## ✅ What We Got Right (No Changes Needed)

1. ✅ **Data model enhancement** - Perfect, backward compatible
2. ✅ **No new pages** - Correct approach
3. ✅ **Service layer pattern** - Follows conventions
4. ✅ **RBAC enforcement** - Properly considered
5. ✅ **Multi-tenant isolation** - Correctly handled
6. ✅ **Soft delete pattern** - Maintained
7. ✅ **Date validation** - Properly integrated
8. ✅ **AI graceful degradation** - Template fallback included

---

## 🚨 Decision Required Before Implementation

**BLOCKER**: Cannot start Sprint 5 Epic 0 implementation until these decisions are made:

1. **UX Direction**: Enhancement, Parallel, or Replacement?
2. **Terminology**: Weekly Goals or Milestones?
3. **API Structure**: planning.js, goals.js, or milestones.js?
4. **AI Service**: New service or enhance existing?

**Recommended Next Step**:
Schedule 30-minute design review session to resolve these 4 decisions, then update Epic spec accordingly.

---

## 📝 Summary

**Audit Status**: ⚠️ DESIGN CONFLICTS FOUND

**Critical Findings**:
- 0 new pages (good!)
- 4 design conflicts with existing system
- Unclear feature relationship (Weekly Goals vs Milestones)
- Two different UI paradigms proposed

**Recommendation**:
Choose **Path 1 (Enhancement)** for lowest risk and fastest delivery. This gives 90% of the value with 50% of the complexity.

**Next Action**:
Product owner decision on the 4 blocker questions above.

---

**Audit Complete**: November 25, 2025
**Ready for**: Design review and decision-making
