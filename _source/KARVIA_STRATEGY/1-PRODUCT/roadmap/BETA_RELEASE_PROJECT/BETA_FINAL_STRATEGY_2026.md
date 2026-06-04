# YSELA Beta_Final Complete Strategy

<!-- @GENOME T1-PRD-009 | ACTIVE | 2026-04-20 | parent:T1-PRD-001 | auto:/strategy,/sprint-planning | linked:/design,/coding -->

**Version**: 1.0
**Created**: April 20, 2026
**Purpose**: Complete strategic specification for Beta_Final release
**Status**: ACTIVE - Sprint 22 Foundation
**Audience**: Full team (Product, Engineering, Design, Consultants)

---

## Executive Summary

**Beta_Final** transforms YSELA from a generic OKR tool into a **behavior-driven operational excellence platform** that proves the BBB (Behavior Based Business) thesis:

> **"Change behavior, change outcomes."**

### What Changes

**Before (Generic OKR Tool)**:
- Create objectives → Generate tasks → Hope for results
- No behavior tracking
- No SSI alignment
- No business outcome focus
- Generic AI suggestions

**After (Beta_Final)**:
- Assess SSI → Identify constraint → Create behavior-driven objective → Generate outcome-based KRs → Track habit-building tasks → Measure SSI improvement
- Explicit behavior reinforcement (9 Disciplines)
- SSI-aligned objectives with sub-dimension precision
- KRs measure business impact (time/cost/quality)
- Context-aware AI with vertical insights

### Core Innovation

**The 4 Behavior LEGO Pieces**:

1. **Behavior Model** - 9 Disciplines, 4 Foundations (Truth, Ownership, etc.)
2. **SSI Impact Tracking** - Which dimension improves (Speed/Strength/Intelligence + sub-dimensions)
3. **Task Classification** - Habit-building (repetitive) vs One-off (setup)
4. **Outcome-Based KRs** - Measure business value, not just completion

**Philosophy**: Reuse existing models (Objective, Task), extend with behavior context, use prompts to deliver intelligence.

---

## The Four Strategic Discussions

This strategy consolidates 4 focused discussions:

### Discussion #1: Behavior Model Design ✅

**Decision**: Use 9 Disciplines (BBB framework) grouped by 4 Foundations

**Structure**:
```
4 FOUNDATIONS (Character Traits - Why):
├─ Discipline (Truth, Follow-through, Consistency)
├─ Growth (Formation, Foresight)
├─ Accountability (Ownership, Handoffs)
└─ Maturity (Alignment, Energy Stewardship)

9 BEHAVIORS (Actions - What):
Independent LEGO piece, seeded globally, status: active/archived
```

**Model Spec**:
```javascript
Behavior {
  name: String (enum of 9),
  description: String,
  foundation: String (enum: discipline/growth/accountability/maturity),
  display_order: Number,
  status: String (active/archived),
  is_global: Boolean (true for beta)
}
```

**UI Integration**:
- Objective creation: Multi-select checkboxes (1-3 behaviors recommended)
- Grouped by foundation for clarity
- Shows behavior count and warning if >3 selected

**See**: [Behavior Model Design - Discussion #1](#discussion-1-details) (below)

---

### Discussion #2: Task Classification System ✅

**Decision**: Reuse existing `recurring` field, no new `action_type` field

**Philosophy**:
- **One-off tasks**: Setup work (recurring.enabled: false)
- **Repetitive tasks**: Habit-building practice (recurring.enabled: true)
- **Frequency**: Practice cadence within weekly goal (daily/weekly)
- **Auto-regeneration**: Within weekly goal only (not cross-week)

**LLM Responsibility**:
- Analyze each task during weekly goal generation
- Set recurring.enabled and recurring.frequency
- Provide reasoning ("Builds [Behavior] through daily practice")

**UI Display**:
```
SETUP TASKS (Complete once)
☐ Create checklist (2h)
☐ Get approval (0.5h)

DAILY HABITS (Practice to build behavior)
Complete checklist: Mon ☑ | Tue ☑ | Wed ☐ | Thu ☐ | Fri ☐
💡 Builds: Handoffs
```

**See**: [Task Classification - Discussion #2](#discussion-2-details) (below)

---

### Discussion #3: SSI Impact Mapping ✅

**Decision**: Single impact area + optional sub-dimension, guide but don't enforce

**Structure**:
```javascript
Objective.ssi_impact: {
  area: String (speed/strength/intelligence/employee_return),
  sub_dimension: String (12 sub-dimensions, optional but recommended)
}
```

**Sub-Dimensions**:
- **Speed**: delivery, decisions, change, response
- **Strength**: operations, financial, people, market
- **Intelligence**: data, learning, innovation, connection
- **Employee Return**: engagement, retention, productivity, satisfaction

**Workflow**:
1. Assessment identifies constraint (e.g., Speed → Decisions: 35/100)
2. Objective creation auto-suggests SSI impact based on constraint
3. Consultant can override
4. System shows warning if constraint area has 0 objectives

**Analytics** (Simple for Beta):
- SSI Coverage: How many objectives address each area
- Behavior Focus: Which foundations are being built
- Gap Warnings: Unaddressed constraint areas

**See**: [SSI Impact Mapping - Discussion #3](#discussion-3-details) (below)

---

### Discussion #4: Integration & Data Flow ✅

**Decision**: Modular LEGO architecture with clear boundaries

**Module Dependencies**:
```
Objective Creation
├─ Behavior Model (LEGO - independent)
├─ Company Profile (LEGO - separate strategy doc needed)
├─ Assessment Module (LEGO - sub-dimension enhancement needed)
├─ LLM Orchestration (Service - separate strategy doc needed)
└─ Analytics (Future LEGO - inline for beta)
```

**Data Flow**:
```
1. Consultant completes SSI Assessment
   → Stores: SSI scores + sub-dimensions + constraint

2. Consultant creates Objective
   → Screen 1: Select SSI impact + Behaviors
   → Screen 2: LLM generates outcome-based KRs
   → Screen 3: Review, edit, confirm

3. LLM Context Assembly (auto)
   → Company profile + SSI scores + Behaviors + Vertical insights
   → Generates: KRs + Coaching guidance

4. Weekly Goal Creation
   → LLM generates tasks (one-off + repetitive)
   → Sets recurring.enabled and frequency

5. Analytics View (simple)
   → SSI coverage, Behavior focus, Task breakdown
```

**See**: [Integration & Data Flow - Discussion #4](#discussion-4-details) (below)

---

## Complete Feature Specifications

### 1. Objective Creation with AI (3-Screen Wizard)

**Strategic Doc**: [OBJECTIVE_CREATION_STRATEGY.md](../features/OBJECTIVE_CREATION_STRATEGY.md)

**Summary**:
- **Screen 1**: Objective setup, SSI impact selection, Behavior selection
- **Screen 2**: AI generation with progress indicator and coach insights
- **Screen 3**: Review KRs, edit, add manual KRs, confirm

**Key Innovation**: Context-aware KR generation using company profile, SSI scores, behavior requirements, and vertical insights.

**Dependencies**:
- ✅ Behavior Model seeded
- ⚠️ Company Profile filled (separate strategy doc)
- ⚠️ Assessment with sub-dimensions (enhancement needed)
- ⚠️ LLM Orchestration (separate strategy doc)

---

### 2. Company Profile Management

**Strategic Doc**: ⚠️ `COMPANY_PROFILE_STRATEGY.md` **(TO BE CREATED)**

**Scope**:
- Company onboarding wizard (in "My Clients" tab)
- Business profile fields: industry, size, revenue, priorities, challenges
- When collected: One-time during client setup, editable later
- Integration: Feeds into LLM context for objective creation

**Priority**: **HIGH** - Blocker for intelligent KR generation

---

### 3. LLM Orchestration & Prompt Management

**Strategic Doc**: ⚠️ `LLM_ORCHESTRATION_STRATEGY.md` **(TO BE CREATED)**

**Scope**:
- Prompt template system (versioned, auditable)
- Context assembly service (Company + SSI + Behaviors + Vertical insights)
- Vertical insights knowledge base (industry patterns, realistic benchmarks)
- Error handling, fallbacks, cost optimization
- A/B testing framework for prompt tuning

**Priority**: **HIGH** - Core value delivery mechanism

---

### 4. Assessment Sub-Dimension Enhancement

**Strategic Doc**: ⚠️ `ASSESSMENT_ENHANCEMENT_STRATEGY.md` **(TO BE CREATED)**

**Scope**:
- Map existing questions to 12 sub-dimensions
- Calculate sub-scores (not just overall Speed/Strength/Intelligence)
- Auto-identify constraint (lowest sub-dimension)
- Store historical trends
- Display in objective creation wizard

**Priority**: **MEDIUM** - Can launch beta with overall scores, enhance later

---

### 5. Analytics Dashboard (Simple for Beta)

**Scope**: Inline analytics (not separate microservice yet)

**Endpoints**:
```
GET /api/analytics/ssi-coverage/:companyId
  → Returns: Count of objectives per SSI area + warnings

GET /api/analytics/behavior-focus/:companyId
  → Returns: % distribution across 4 foundations

GET /api/analytics/task-breakdown/:companyId
  → Returns: One-off vs repetitive task counts
```

**UI**: Simple dashboard showing coverage gaps and recommendations

**Future**: Migrate to separate Analytics LEGO piece (Insights Engine :8087)

---

## Data Model Changes

### New Models

**Behavior** (NEW):
```javascript
{
  name: String (9 Disciplines),
  description: String,
  foundation: String (4 Foundations),
  display_order: Number,
  status: String,
  is_global: Boolean
}
```

### Extended Models

**Objective** (EXTENDED):
```javascript
{
  // ... existing fields ...

  // NEW
  ssi_impact: {
    area: String,
    sub_dimension: String
  },

  behavior_ids: [ObjectId],

  ai_guidance: {
    why_these_behaviors: String,
    expected_ssi_impact: String,
    success_indicators: [String],
    coaching_tips: [String],
    realistic_timeline: Object
  }
}
```

**Company** (EXTENDED):
```javascript
{
  // ... existing fields ...

  // NEW
  business_profile: {
    industry_vertical: String,
    employee_count: Number,
    revenue_range: String,
    business_model: String,
    business_priorities: [String],
    current_challenges: [String],
    onboarding_completed: Boolean
  }
}
```

**Assessment** (EXTENDED):
```javascript
{
  // ... existing fields ...

  // NEW
  scores: {
    speed: {
      overall: Number,
      delivery: Number,      // NEW
      decisions: Number,     // NEW
      change: Number,        // NEW
      response: Number       // NEW
    },
    // Same for strength, intelligence
  },

  constraint: {             // NEW (auto-calculated)
    area: String,
    score: Number,
    sub_dimension: String,
    sub_score: Number
  }
}
```

**Task** (NO CHANGES - reuse existing):
```javascript
{
  // ... existing fields ...

  recurring: {
    enabled: Boolean,        // NEW INTERPRETATION: false = one-off, true = habit
    frequency: String,       // NEW INTERPRETATION: practice cadence this week
    next_occurrence: Date,
    last_occurrence: Date
  }
}
```

---

## Technical Architecture

### LEGO Piece Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                    BEHAVIOR LEGO PIECE                           │
│  • Independent model, seeded globally                            │
│  • No dependencies on other models                               │
│  • Referenced by Objectives (behavior_ids array)                 │
│  • Can be disabled without breaking core OKR                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    COMPANY PROFILE LEGO PIECE                    │
│  • Business context stored in Company model                      │
│  • Managed separately in "My Clients" section                    │
│  • Feeds into LLM context, doesn't block creation                │
│  • Can be incomplete (graceful degradation)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ASSESSMENT LEGO PIECE                         │
│  • Separate module for SSI scoring                               │
│  • Sub-dimension tracking added                                  │
│  • Constraint auto-identification                                │
│  • Guides objective creation, doesn't enforce                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    LLM ORCHESTRATION SERVICE                     │
│  • Context assembly from multiple LEGO pieces                    │
│  • Prompt template management                                    │
│  • Vertical insights knowledge base                              │
│  • Error handling and fallbacks                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS LEGO PIECE (Future)                 │
│  • Beta: Simple inline aggregations                              │
│  • Post-Beta: Separate Insights Engine (:8087)                   │
│  • Read-only from other models                                   │
│  • Computes patterns, recommendations                            │
└─────────────────────────────────────────────────────────────────┘
```

### Graceful Degradation

**If Behavior Model unavailable**:
- Objective creation works (behavior_ids = [])
- No behavior tracking
- Generic KR generation

**If Company Profile incomplete**:
- Objective creation works
- KRs are less context-specific
- Warning shown to consultant

**If Assessment missing**:
- Objective creation works
- No auto-suggestion of SSI impact
- Manual selection required

**If LLM service fails**:
- Fallback to manual KR entry
- Apology message + retry option
- Consultant creates KRs manually

---

## Implementation Principles

### 1. Reuse First, Reframe Second, Extend Third

From [00_MASTER_IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md):

**Reused** (No changes):
- Task.recurring field → Interpreted as one-off vs habit-building
- Objective → KR → Goal → Task cascade
- Multi-tenant architecture
- RBAC system

**Reframed** (UI/UX changes only):
- Tasks displayed as "Setup" vs "Daily Habits"
- Coach language throughout
- Guidance instead of just data

**Extended** (New fields added):
- Objective.ssi_impact
- Objective.behavior_ids
- Company.business_profile
- Assessment sub-dimensions

**Not Built**:
- No new `Works` model
- No new microservice (yet)
- No broad schema redesign

### 2. Prompts First, Frontend Second, Backend Third

**Decision Rule**:
1. Can this be solved in prompts? → Try there first
2. Can this be solved in frontend labels/copy? → Try there next
3. Can this be solved through consultant workflow? → Try there next
4. Is this blocked without persistence? → Only then add backend

**Example**:
- "This task builds Handoffs behavior" → Prompt generates text
- "Setup Tasks" vs "Daily Habits" → Frontend grouping
- Tracking which behaviors work best → Analytics (post-beta)

### 3. LEGO Pieces Can Fail Independently

**Each module has**:
- Clear boundaries (inputs/outputs)
- Standalone capability (can be disabled)
- No two-way dependencies
- Graceful degradation when missing

**Example**:
- Disable Behavior tracking → OKRs still work (generic mode)
- LLM service down → Manual KR entry still works
- Analytics unavailable → Objective creation still works

---

## Success Criteria

### Beta Launch Criteria

**Must Have**:
- ✅ Behavior model seeded (9 Disciplines)
- ✅ Objective creation wizard (3 screens)
- ✅ LLM generates outcome-based KRs
- ✅ Behaviors displayed and selectable
- ✅ SSI impact tracking (area + sub-dimension)
- ✅ Simple analytics (SSI coverage, behavior focus)

**Nice to Have** (Can defer):
- ⚠️ Company profile complete (can launch with partial)
- ⚠️ Assessment sub-dimensions (can use overall scores)
- ⚠️ Vertical insights rich (can start with 2-3 industries)
- ⚠️ Advanced analytics (can use simple counts)

### Success Metrics (3-Month Beta)

**Adoption**:
- 80% of objectives created with behaviors selected
- 60% of consultants use AI KR generation
- 50% read AI guidance (expand section)

**Quality**:
- Avg 3-5 KRs per objective
- 40-60% of AI KRs edited before save (healthy engagement)
- Consultant satisfaction: >4/5 on KR quality

**Impact**:
- SSI scores improve avg +10-15 points in targeted dimension
- 70% of teams show behavior indicators in weekly execution
- Repeat assessment shows correlation between behavior focus and SSI improvement

---

## Rollout Plan

### Sprint 22.1: Foundation (2 weeks)

**Week 1**:
- Create Behavior model + seed script
- Extend Objective model (ssi_impact, behavior_ids, ai_guidance)
- Extend Company model (business_profile fields)
- Migration scripts for existing data

**Week 2**:
- Build LLM orchestration service
- Create prompt template system
- Build vertical insights knowledge base (2-3 industries)
- Test KR generation quality

### Sprint 22.2: Objective Wizard (2 weeks)

**Week 3**:
- Build Screen 1 (objective setup + behavior selection)
- Build Screen 2 (LLM loading + preview)
- Integrate LLM API
- Error handling + fallbacks

**Week 4**:
- Build Screen 3 (review + edit + confirm)
- Manual KR entry flow
- Validation + save logic
- Internal testing + bug fixes

### Sprint 22.3: Polish & Analytics (1 week)

**Week 5**:
- Simple analytics endpoints
- Analytics dashboard UI
- Consultant training materials
- Beta launch to 3-5 consultants

### Sprint 22.4: Feedback & Iterate (1 week)

**Week 6**:
- Monitor adoption metrics
- Collect consultant feedback
- Tune LLM prompts
- Bug fixes + UX improvements

**Total Duration**: 6 weeks (April 21 - June 2, 2026)

---

## Open Questions & Next Steps

### Strategic Documents Needed

1. ⚠️ **COMPANY_PROFILE_STRATEGY.md** (HIGH PRIORITY)
   - Company onboarding wizard design
   - Business profile field specifications
   - Collection workflow ("My Clients" tab)

2. ⚠️ **LLM_ORCHESTRATION_STRATEGY.md** (HIGH PRIORITY)
   - Prompt management system
   - Context assembly architecture
   - Vertical insights knowledge base structure
   - Cost optimization strategy

3. ⚠️ **ASSESSMENT_ENHANCEMENT_STRATEGY.md** (MEDIUM PRIORITY)
   - Sub-dimension question mapping
   - Scoring algorithm updates
   - Constraint auto-identification logic
   - Can defer if needed (use overall scores for beta)

### Decisions Needed

**Product**:
- [ ] Confirm 6-week timeline is acceptable
- [ ] Prioritize: Company Profile vs Assessment sub-dimensions (if forced to choose)
- [ ] Approve vertical insights starting with which 3 industries?

**Design**:
- [ ] Review 3-screen wizard UX flow
- [ ] Behavior selection UI: Checkboxes or chip selector?
- [ ] Mobile experience: Full wizard or desktop-only for beta?

**Engineering**:
- [ ] LLM timeout strategy: 15s, 30s, or 60s?
- [ ] Context caching: How long to cache assembled prompts?
- [ ] Prompt versioning: Track in database or config files?

---

## Related Documents

**Foundation**:
- [YSELA_PHILOSOPHY.md](../../YSELA/philosophy/YSELA_PHILOSOPHY.md) - BBB framework, 9 Disciplines, LEGO principle
- [BETA_ROADMAP_2026.md](BETA_ROADMAP_2026.md) - Original beta vision
- [00_MASTER_IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md) - Implementation principles

**Feature Specs**:
- [OBJECTIVE_CREATION_STRATEGY.md](../features/OBJECTIVE_CREATION_STRATEGY.md) - Complete 3-screen wizard spec

**Technical**:
- [objective_kr_generation_prompt.md](../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) - LLM prompt template

**To Be Created**:
- `COMPANY_PROFILE_STRATEGY.md`
- `LLM_ORCHESTRATION_STRATEGY.md`
- `ASSESSMENT_ENHANCEMENT_STRATEGY.md`

---

## Appendix: Discussion Details

### Discussion #1 Details: Behavior Model Design

**MECE Category Structure**:
- 4 Foundations (Discipline, Growth, Accountability, Maturity) are meta-categories
- 9 Disciplines (Truth, Ownership, etc.) are the actual behaviors
- Mapping: Each discipline belongs to exactly one foundation
- LEGO piece: Independent, can be disabled without breaking core OKR

**Schema**:
```javascript
Behavior {
  name: String (enum of 9 Disciplines),
  description: String (200-500 chars),
  foundation: String (enum of 4 Foundations),
  display_order: Number (1-9),
  status: String (active/archived),
  is_global: Boolean (true for beta)
}
```

**Seed Data**:
- All 9 Disciplines seeded on deployment
- Global (visible to all companies)
- Future: Company-specific behaviors (custom)

---

### Discussion #2 Details: Task Classification

**No Schema Changes**:
- Reuse `Task.recurring.enabled` (false = one-off, true = habit)
- Reuse `Task.recurring.frequency` (practice cadence within weekly goal)
- Auto-regeneration: Within weekly goal only (not cross-week)

**LLM Sets Classification**:
- Analyzes task during weekly goal generation
- Determines: Is this setup work or habit-building?
- Sets: recurring.enabled, recurring.frequency
- Explains: "Builds [Behavior] through [frequency] practice"

**UI Grouping**:
- Setup Tasks (complete once)
- Daily Habits (practice Mon-Fri with checkboxes)
- Visual: 🔁 icon for repetitive tasks

---

### Discussion #3 Details: SSI Impact Mapping

**Single Impact + Sub-Dimension**:
- One primary SSI area per objective (focus)
- Optional sub-dimension for precision
- Auto-suggested from assessment constraint
- Consultant can override

**12 Sub-Dimensions**:
- Speed: delivery, decisions, change, response
- Strength: operations, financial, people, market
- Intelligence: data, learning, innovation, connection
- (Employee Return not in original SSI framework - TBD if needed)

**Analytics** (Simple for Beta):
- SSI Coverage chart
- Gap warnings ("Intelligence has 0 objectives")
- Behavior distribution pie chart

---

### Discussion #4 Details: Integration & Data Flow

**Module Architecture**:
- Behavior Model (LEGO - independent)
- Company Profile (LEGO - separate strategy doc)
- Assessment Module (LEGO - sub-dimension enhancement)
- LLM Orchestration (Service - separate strategy doc)
- Analytics (Future LEGO - inline for beta)

**Data Flow**:
1. Assessment → Identifies constraint
2. Objective Creation → Selects SSI + Behaviors
3. LLM → Generates KRs using all context
4. Weekly Goal → Generates tasks (one-off + repetitive)
5. Analytics → Shows coverage and gaps

**Dependencies**:
- Must exist: Behaviors seeded
- Should exist: Company profile, Assessment
- Can be missing: Graceful degradation

---

**Document Owner**: Product Team
**Created**: April 20, 2026
**Status**: Active - Foundation for Sprint 22 Planning

