# Objective Creation with Behavior & SSI Strategy

<!-- @GENOME T1-PRD-008 | ACTIVE | 2026-04-20 | parent:T1-PRD-001 | auto:/strategy,/design | linked:/coding -->

**Version**: 2.0 (Behavior-driven, SSI-aligned)
**Created**: April 20, 2026
**Purpose**: Strategic specification for behavior-based objective creation workflow
**Status**: ACTIVE - Beta_Final Scope
**Audience**: Product, Design, Engineering

---

## Executive Summary

The Objective Creation flow is the **core value delivery moment** where consultants translate SSI assessment insights into actionable, behavior-driven objectives with outcome-based Key Results.

**Key Innovation**: Unlike traditional OKR tools that generate generic tasks, YSELA generates KRs that measure **business impact of implementation** (time saved, cost reduced, quality improved) while explicitly tracking which **behaviors are being built** (the 9 Disciplines from BBB).

**User Journey**:
```
Consultant completes SSI Assessment
  ↓
Identifies constraint (e.g., Speed → Decisions: 35/100)
  ↓
Creates Objective to address constraint
  ↓ (3-screen wizard)
Screen 1: Define objective + Select SSI Impact + Select Behaviors
Screen 2: AI generates outcome-based KRs with coaching guidance
Screen 3: Review, edit, confirm
  ↓
Objective created with rich context for future planning
```

---

## Design Principles

### 1. Outcome Over Activity

**Traditional OKR Tools**:
- Objective: "Establish Meeting Structure"
- KR: "Meeting structure document created" ❌
- Problem: Activity-based, doesn't measure business value

**YSELA Approach**:
- Objective: "Establish Meeting Structure"
- KR: "Operational expenses reduced by 15% ($8K/month saved)" ✅
- Why: Measures the OUTCOME of having better meetings (time saved = money saved)

### 2. Behavior as First-Class Citizen

**Traditional OKR Tools**:
- Focus: What needs to be achieved
- Missing: How to change team behavior

**YSELA Approach**:
- Focus: What needs to be achieved + Which behaviors to reinforce
- Explicit: "This objective builds Accountability and Truth behaviors"
- Measurable: Track which behaviors are being practiced

### 3. Context-Driven Intelligence

**Traditional OKR Tools**:
- Generic KR suggestions, no business context
- Same suggestions for all industries

**YSELA Approach**:
- Company profile: Industry, size, priorities, challenges
- SSI scores: Current state, constraint identification
- Vertical insights: Industry-specific benchmarks
- Realistic KRs: Based on small business realities

### 4. Coach, Don't Just Generate

**Traditional AI Tools**:
- Output: List of KRs
- No guidance on execution

**YSELA Approach**:
- Output: KRs + Why these behaviors matter + Expected SSI impact + Success indicators + Coaching tips
- Consultant becomes better coach through AI guidance

---

## 3-Screen Wizard Flow

### Screen 1: Objective Setup & Context

**Purpose**: Capture objective intent, SSI alignment, and behavior selection

**UI Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back     CREATE OBJECTIVE WITH AI            Step 1 of 3     │
│             Team created already                    ● ○ ○       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Current SSI Scores (from latest assessment):                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Speed: ████░░░░░░ 42                                      │  │
│  │   └─ Decisions: 35 (LOWEST - needs focus)                │  │
│  │ Strength: ████████░░ 68                                   │  │
│  │ Intelligence: ██████░░░░ 55                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What is your Objective?                                        │
│  [Large text input - objective title]                           │
│                                                                  │
│  ─────────────────────────────────────────                      │
│                                                                  │
│  What area of business do you want to impact?                   │
│                                                                  │
│  SSI Impact Area: [Dropdown: Speed/Strength/Intelligence]       │
│                                                                  │
│  Be more specific (recommended):                                │
│  [Dropdown: Sub-dimensions based on selected area]              │
│                                                                  │
│  ℹ️  Auto-suggested based on your constraint                    │
│                                                                  │
│  ─────────────────────────────────────────                      │
│                                                                  │
│  Which behaviors do you want to reinforce? (Select 1-3)         │
│                                                                  │
│  [Behavior checklist grouped by foundation]                     │
│  DISCIPLINE                                                     │
│  ☐ Truth                                                        │
│  ☐ Follow-through                                               │
│  ☐ Consistency                                                  │
│                                                                  │
│  GROWTH                                                         │
│  ☐ Formation                                                    │
│  ☐ Foresight                                                    │
│                                                                  │
│  ACCOUNTABILITY                                                 │
│  ☐ Ownership                                                    │
│  ☐ Handoffs                                                     │
│                                                                  │
│  MATURITY                                                       │
│  ☐ Alignment                                                    │
│  ☐ Energy Stewardship                                           │
│                                                                  │
│  ℹ️  2 behaviors selected (recommended: 1-3)                    │
│                                                                  │
│  ─────────────────────────────────────────                      │
│                                                                  │
│  Time Frame: [Quarter/Year/Fiscal Year/Custom radio buttons]    │
│  Owner: [Dropdown: Team members]                                │
│                                                                  │
│  [Cancel]  [Continue →]                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Captured**:
```javascript
{
  title: String,                    // Objective title
  ssi_impact: {
    area: String,                   // speed | strength | intelligence
    sub_dimension: String           // Optional but recommended
  },
  behavior_ids: [ObjectId],         // 1-3 behaviors
  time_period_type: String,         // quarter | calendar_year | fiscal_year
  target_year: Number,
  owner_id: ObjectId
}
```

**Validation Rules**:
- Title: Required, 10-200 characters
- SSI Impact Area: Required
- SSI Sub-dimension: Optional but show recommendation
- Behaviors: At least 1, warn if > 3 ("Consider focusing on 1-2 behaviors")
- Time Period: Required
- Owner: Required

**Dependencies**:
- ✅ Latest Assessment exists (to show SSI scores and auto-suggest)
- ✅ Behaviors seeded (9 Disciplines available)
- ✅ User has permission (CONSULTANT, BUSINESS_OWNER, EXECUTIVE roles)

---

### Screen 2: AI Generation & Preview

**Purpose**: LLM generates outcome-based KRs with coaching guidance, consultant sees preview

**UI Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back     CREATE OBJECTIVE WITH AI            Step 2 of 3     │
│             Generating Key Results...               ○ ● ○       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🤖 Analyzing your objective...                                 │
│                                                                  │
│  Objective: "[Title from Screen 1]"                             │
│  Impact: [Area] → [Sub-dimension]                               │
│  Behaviors: [Selected behavior names]                           │
│                                                                  │
│  ─────────────────────────────────────────                      │
│                                                                  │
│  [Progress indicators]                                          │
│  ✓ Understanding business context                               │
│  ✓ Analyzing behavior requirements                              │
│  ✓ Generating measurable key results                            │
│  ⟳ Crafting guidance...                                         │
│                                                                  │
│  ─────────────────────────────────────────                      │
│                                                                  │
│  💡 YSELA COACH INSIGHT:                                        │
│                                                                  │
│  [LLM-generated preview of guidance]                            │
│  - Why these behaviors matter                                   │
│  - Expected SSI impact                                          │
│  - What to watch for                                            │
│                                                                  │
│  ─────────────────────────────────────────                      │
│                                                                  │
│  [Auto-advances to Screen 3 when complete]                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Backend Process**:
1. Fetch Company Profile (industry, size, priorities, challenges)
2. Fetch latest Assessment (SSI scores, constraint)
3. Fetch selected Behaviors (definitions, foundations)
4. Load Vertical Insights (industry patterns, realistic benchmarks)
5. Assemble context into LLM prompt
6. Call OpenAI API (30s timeout)
7. Parse response (KRs + guidance)
8. Advance to Screen 3

**LLM Response Structure**:
```javascript
{
  key_results: [
    {
      metric: String,
      target: String,
      current: String,
      measurement_frequency: String,
      measurement_method: String,
      kr_type: String,
      ssi_connection: String,
      behavior_connection: String,
      why_this_matters: String
    }
  ],

  guidance: {
    implementation_philosophy: String,
    why_these_behaviors: String,
    expected_ssi_impact: String,
    success_indicators: [String],
    measurement_strategy: String,
    coaching_tips: [String],
    common_pitfalls: [String]
  },

  realistic_timeline: {
    week_1_4: String,
    month_2_3: String,
    quarter_end: String
  }
}
```

**Error Handling**:
- LLM timeout (>30s): Show error, allow retry or manual KR entry
- LLM error: Fallback to manual KR entry with apology message
- Invalid response format: Parse what's available, log error, allow editing

**Dependencies**:
- ✅ Company Profile exists with business context
- ✅ Assessment exists with SSI scores
- ✅ LLM Prompt template configured
- ✅ OpenAI API key configured (feature flag: FEATURE_OPENAI_ENABLED)

---

### Screen 3: Review, Edit & Confirm

**Purpose**: Consultant reviews generated KRs and guidance, edits if needed, confirms creation

**UI Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back     CREATE OBJECTIVE WITH AI            Step 3 of 3     │
│             Review & Confirm                        ○ ○ ●       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📋 OBJECTIVE SUMMARY                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Title: [Objective title]                                  │  │
│  │ Impact: [SSI Area] → [Sub-dimension] (Current: XX/100)   │  │
│  │ Behaviors: [Behavior names]                               │  │
│  │ Period: [Time period]                                     │  │
│  │ Owner: [Owner name]                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  🎯 KEY RESULTS                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ KR 1: [Metric name]                                       │  │
│  │ Current: [Current] → Target: [Target]                     │  │
│  │ Measured: [Frequency]                                     │  │
│  │ [Edit] [Delete]                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Additional KR cards...]                                       │
│                                                                  │
│  [+ Add Key Result Manually]                                    │
│                                                                  │
│  ─────────────────────────────────────────────                      │
│                                                                  │
│  💡 YSELA COACH GUIDANCE                          [Show Less ▲] │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Why [Behavior names]?                                     │  │
│  │ [why_these_behaviors text]                                │  │
│  │                                                           │  │
│  │ Expected Impact:                                          │  │
│  │ [expected_ssi_impact text]                                │  │
│  │                                                           │  │
│  │ Success Indicators:                                       │  │
│  │ • [Indicator 1]                                           │  │
│  │ • [Indicator 2]                                           │  │
│  │                                                           │  │
│  │ Coaching Tips:                                            │  │
│  │ • [Tip 1]                                                 │  │
│  │ • [Tip 2]                                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back to Edit]  [Create Objective]                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Interactions**:
- **Edit KR**: Inline editing of metric, target, current, frequency
- **Delete KR**: Remove KR (min 1 KR required)
- **Add Manual KR**: Simple form to add KR without AI
- **Edit Objective Details**: Go back to Screen 1
- **Show/Hide Guidance**: Collapsible guidance section
- **Create Objective**: Validate and save

**Final Payload** (POST /api/objectives):
```javascript
{
  company_id: ObjectId,
  title: String,
  description: String,              // Optional
  category: String,                 // Derived from sub_dimension
  owner_id: ObjectId,
  time_period_type: String,
  target_year: Number,
  start_date: Date,
  end_date: Date,
  status: "active",

  // NEW FIELDS (Beta_Final)
  ssi_impact: {
    area: String,
    sub_dimension: String
  },

  behavior_ids: [ObjectId],

  key_results: [
    {
      metric: String,
      target: String,
      current: String,
      measurement_frequency: String,
      status: "not_started"
    }
  ],

  ai_guidance: {                     // Stored for consultant reference
    why_these_behaviors: String,
    expected_ssi_impact: String,
    success_indicators: [String],
    coaching_tips: [String],
    realistic_timeline: Object
  }
}
```

**Validation**:
- At least 1 KR required
- Each KR must have metric, target, measurement_frequency
- Title must be unique within company (warn, don't block)

**Post-Creation**:
- Redirect to Objective detail page
- Show success message
- Analytics: Track objective created with behavior count, SSI area

---

## Data Model Specifications

### Objective Model (Extensions)

**File**: `server/models/Objective.js`

**New Fields**:
```javascript
// SSI Impact (which dimension improves)
ssi_impact: {
  area: {
    type: String,
    enum: ['speed', 'strength', 'intelligence', 'employee_return'],
    required: false,
    index: true
  },
  sub_dimension: {
    type: String,
    enum: [
      // Speed sub-dimensions
      'delivery', 'decisions', 'change', 'response',
      // Strength sub-dimensions
      'operations', 'financial', 'people', 'market',
      // Intelligence sub-dimensions
      'data', 'learning', 'innovation', 'connection',
      // Employee Return sub-dimensions
      'engagement', 'retention', 'productivity', 'satisfaction'
    ],
    required: false
  }
},

// Behaviors being reinforced (1-3 typical)
behavior_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Behavior',
  index: true
}],

// AI-generated guidance (for consultant reference)
ai_guidance: {
  why_these_behaviors: { type: String },
  expected_ssi_impact: { type: String },
  success_indicators: [{ type: String }],
  coaching_tips: [{ type: String }],
  common_pitfalls: [{ type: String }],
  realistic_timeline: {
    week_1_4: { type: String },
    month_2_3: { type: String },
    quarter_end: { type: String }
  }
}
```

**Indexes**:
```javascript
// For analytics queries
objectiveSchema.index({ 'ssi_impact.area': 1, status: 1 });
objectiveSchema.index({ behavior_ids: 1, status: 1 });
objectiveSchema.index({ company_id: 1, 'ssi_impact.area': 1 });
```

**Population Pattern**:
```javascript
const objective = await Objective.findById(id)
  .populate('behavior_ids', 'name description foundation')
  .populate('owner_id', 'name email role');
```

---

## Design Decisions

### Decision 1: SSI Sub-Dimension Collection

**Decision**: **Optional but recommended**

**Rationale**:
- Sub-dimension provides richer context for LLM (better KRs)
- Auto-suggest from assessment constraint makes it easy
- But don't block if consultant skips it (progressive enhancement)

**Implementation**:
- Show sub-dimension dropdown when area selected
- Auto-populate from assessment constraint
- Show info icon: "ℹ️ Be more specific for better KR suggestions"
- Allow null value (optional field)

---

### Decision 2: Behavior Selection Limit

**Decision**: **Soft limit 1-3, allow up to 9**

**Rationale**:
- Focus is critical for behavior change (1-2 is ideal)
- But don't artificially block if consultant wants more
- Progressive disclosure: warn when >3 selected

**Implementation**:
- No hard limit in validation
- Show warning when 4+ selected: "⚠️ Consider focusing on 1-2 behaviors for maximum impact"
- UI shows count: "4 behaviors selected (recommended: 1-3)"

---

### Decision 3: AI Guidance Storage

**Decision**: **Store in Objective model**

**Rationale**:
- Consultants reference guidance during quarterly reviews
- Shows "what AI predicted" vs "what actually happened" (learning loop)
- Minimal storage cost (~2KB per objective)

**Implementation**:
- Optional field (null if manual objective creation)
- Displayed in objective detail page under "Coach Insights" section
- Not editable after creation (historical record)

---

### Decision 4: LLM Loading State

**Decision**: **Show loading screen with progress**

**Rationale**:
- LLM takes 5-15 seconds (feels slow without feedback)
- Educational opportunity: explain what's happening
- Builds anticipation and value perception

**Implementation**:
- Screen 2 shows progress indicators
- Preview insight while waiting (engagement)
- Timeout at 30 seconds with retry option

---

### Decision 5: KR Editing Post-Generation

**Decision**: **Full editing allowed**

**Rationale**:
- AI is assistant, consultant is expert
- KRs must fit specific business context
- Allow adding manual KRs for completeness

**Implementation**:
- Inline editing on Screen 3
- Add/delete KRs
- No regeneration (manual edits replace AI)
- Track: Store flag `ai_generated: true` per KR for analytics

---

## Dependencies & Prerequisites

### Module Dependencies

```
Objective Creation
├─ DEPENDS ON: Behavior Model (LEGO)
│  └─ 9 Disciplines seeded and available
│
├─ DEPENDS ON: Assessment Module (LEGO)
│  └─ Latest assessment with SSI scores exists
│
├─ DEPENDS ON: Company Profile (LEGO)
│  └─ Industry, size, priorities, challenges filled
│     └─ ⚠️ SEPARATE STRATEGY DOC NEEDED
│
├─ DEPENDS ON: LLM Orchestration (Service)
│  └─ Prompt template, context assembly, API integration
│     └─ ⚠️ SEPARATE STRATEGY DOC NEEDED
│
└─ DEPENDS ON: User/RBAC (Existing)
   └─ Consultant, Business Owner, Executive roles
```

### Data Prerequisites

**Must Exist Before Objective Creation**:
1. ✅ Company record (existing)
2. ✅ User with owner role (existing)
3. ⚠️ **Company Profile filled** (NEW - design needed)
   - Industry vertical
   - Employee count
   - Business priorities
   - Current challenges
4. ⚠️ **Latest Assessment completed** (existing, may need enhancement)
   - SSI scores
   - Sub-dimension scores
   - Constraint identification
5. ✅ **Behaviors seeded** (NEW - simple seed script)
   - 9 Disciplines
   - Foundations mapped

**If Prerequisites Missing**:
- **No Company Profile**: Show warning, allow creation but KRs will be generic
- **No Assessment**: Show warning, can't auto-suggest SSI impact
- **No Behaviors**: Block creation, must seed first (one-time setup)

---

## Out of Scope (For This Document)

The following are **separate strategic documents** to be created:

### 1. Company Profile Strategy
**File**: `COMPANY_PROFILE_STRATEGY.md` (to be created)
- Company onboarding wizard (in "My Clients" tab)
- Business profile fields
- When/how collected
- Update workflow

### 2. LLM Orchestration Strategy
**File**: `LLM_ORCHESTRATION_STRATEGY.md` (to be created)
- Prompt management system
- Context assembly logic
- Vertical insights knowledge base
- Error handling and fallbacks
- Cost optimization

### 3. Assessment Sub-Dimension Enhancement
**File**: `ASSESSMENT_ENHANCEMENT_STRATEGY.md` (to be created)
- Sub-dimension question mapping
- Scoring algorithm
- Constraint auto-identification
- Trend tracking

---

## Success Metrics

### Product Metrics
- **Adoption**: % of objectives created with behaviors selected
- **Engagement**: % of consultants using AI vs manual KR creation
- **Quality**: Avg # of KRs per objective (target: 3-5)
- **Behavior Coverage**: % of objectives covering each foundation
- **SSI Alignment**: % of objectives addressing identified constraint

### UX Metrics
- **Completion Rate**: % who start wizard and finish (target: >85%)
- **Time to Complete**: Median time for 3-screen flow (target: <5 min)
- **Edit Rate**: % of AI KRs edited before save (baseline: expect 40-60%)
- **Guidance Engagement**: % who expand/read AI guidance (target: >70%)

### Business Impact Metrics
- **SSI Score Improvement**: Avg improvement in targeted dimension (target: +10-15 points)
- **Behavior Adoption**: % of teams showing behavior indicators (tracked in weekly goals)
- **Consultant Satisfaction**: Survey rating on KR quality (target: >4/5)

---

## Technical Constraints

### Performance
- Screen 1→2 transition: <500ms (data fetch + validation)
- LLM generation: <15s median, <30s p95 (timeout)
- Screen 2→3 transition: <200ms (UI rendering)
- Total wizard time: <5 min median

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Mobile responsive (tablet friendly, phone discouraged for consultant workflows)

### API Limits
- OpenAI API: Max 4 concurrent requests per company
- Rate limiting: 10 objective creations per hour per consultant

---

## Migration & Rollout

### Phase 1: Backend (Week 1)
- Add fields to Objective model (ssi_impact, behavior_ids, ai_guidance)
- Run migration: Set nulls for existing objectives
- Seed Behavior collection (9 Disciplines)
- Deploy with feature flag: `FEATURE_BEHAVIOR_OBJECTIVES=false`

### Phase 2: LLM Integration (Week 2)
- Build LLM orchestration service
- Test prompt quality with sample data
- Enable for internal testing only
- Tune prompts based on KR quality

### Phase 3: Frontend (Week 3)
- Build 3-screen wizard
- Feature flag: `FEATURE_BEHAVIOR_OBJECTIVES=true` for beta consultants
- A/B test: Old flow vs new flow
- Collect feedback on UX

### Phase 4: Rollout (Week 4)
- Enable for all consultants
- Monitor metrics (completion rate, edit rate, satisfaction)
- Iterate based on feedback
- Sunset old objective creation flow

---

## Open Questions & Decisions Needed

### For Product Team
1. ❓ Should we allow objectives WITHOUT behaviors? (recommendation: Yes, warn but don't block)
2. ❓ How to handle objectives created before behavior tracking? (recommendation: Leave as-is, optional retroactive tagging)
3. ❓ Should AI guidance be editable? (recommendation: No, it's historical record of what AI suggested)

### For Design Team
1. ❓ Mobile experience: Full wizard or redirect to desktop? (recommendation: Responsive tablet, discourage phone)
2. ❓ Behavior selection: Checkboxes or chip selector? (recommendation: Checkboxes grouped by foundation)
3. ❓ Guidance display: Collapsible or always visible? (recommendation: Collapsible, default expanded)

### For Engineering Team
1. ❓ LLM timeout retry UX: Auto-retry or manual? (recommendation: Manual with "Retry" button)
2. ❓ Context caching: Cache assembled prompt context? (recommendation: Yes, cache for 5 min per company)
3. ❓ Prompt versioning: How to track prompt changes over time? (recommendation: Version field in ai_guidance)

---

## Related Documents

**Must Read Before Implementation**:
1. [YSELA_PHILOSOPHY.md](../../YSELA/philosophy/YSELA_PHILOSOPHY.md) - BBB framework, 9 Disciplines
2. [BETA_ROADMAP_2026.md](../roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md) - Beta scope and constraints
3. [00_MASTER_IMPLEMENTATION_PLAN.md](../roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md) - Reuse first principle

**To Be Created**:
1. `COMPANY_PROFILE_STRATEGY.md` - Company onboarding and profile management
2. `LLM_ORCHESTRATION_STRATEGY.md` - Prompt management and AI integration
3. `ASSESSMENT_ENHANCEMENT_STRATEGY.md` - Sub-dimension tracking

**Technical Reference**:
1. [objective_kr_generation_prompt.md](../../KARVIA_STRATEGY/2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) - LLM prompt template

---

**Document Owner**: Product Team
**Created**: April 20, 2026
**Last Updated**: April 20, 2026
**Status**: Active - Ready for Design & Engineering Review

