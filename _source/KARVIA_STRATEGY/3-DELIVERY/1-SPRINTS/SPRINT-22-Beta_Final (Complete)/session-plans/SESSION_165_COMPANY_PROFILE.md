# Session #165: Company Profile & My Clients Page Strategy

<!-- @GENOME T3-SPR-022-S2 | ACTIVE | 2026-04-20 | parent:T3-SPR-022 | auto:/strategy | linked:/design -->

**Session Goal**: Create complete strategy for company onboarding and profile management in "My Clients" tab
**Duration**: 1 strategy session
**Status**: 📋 Planned
**Prerequisites**: Session #164 complete, Assessment Hub UI screenshot reviewed

---

## Session Objectives

### Primary Goal
Design the company profile collection system that provides rich context for LLM-powered KR generation while maintaining consultant workflow simplicity.

### Deliverables
1. ✅ COMPANY_PROFILE_STRATEGY.md (complete strategic doc)
2. ✅ Company onboarding wizard specifications
3. ✅ Business profile field definitions
4. ✅ Collection workflow and timing
5. ✅ Integration with objective creation
6. ✅ My Clients page enhancements

---

## Pre-Session Review

### Documents to Read Before Session
1. [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) - Company Profile LEGO piece requirements
2. [objective_kr_generation_prompt.md](../../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) - What context LLM needs
3. Current Assessment Hub screenshot (provided) - "My Clients" tab current state

### Current State Analysis
- ✅ "My Clients" tab exists with assessment management
- ✅ Company model exists (basic fields: name, etc.)
- ⚠️ No business profile fields yet
- ⚠️ No company onboarding wizard
- ⚠️ Consultants manually add clients (minimal data collected)

---

## Session Agenda

### Part 1: Company Profile Requirements (30 min)

**LLM Context Needs** (from objective_kr_generation_prompt.md):

```javascript
company: {
  name: String,                      // ✅ Already exists
  industry: String,                  // ⚠️ Needs collection
  size: String,                      // ⚠️ Needs collection
  business_model: String,            // ⚠️ Needs collection
  revenue_range: String,             // ⚠️ Needs collection
  business_priorities: [String],     // ⚠️ Needs collection
  current_challenges: [String]       // ⚠️ Needs collection
}
```

**Questions to Answer**:

1. **Industry Classification**:
   - Fixed dropdown or free text?
   - How many industries to support?
   - Start with: Legacy Succession, Professional Services, Real Estate, Construction, Healthcare?
   - "Other" option with text input?

2. **Company Size**:
   - Exact number or ranges?
   - Ranges: <10, 10-50, 50-100, 100-500, 500+?
   - Why it matters: Context for realistic KR targets

3. **Revenue Range**:
   - Exact or ranges?
   - Ranges: <$1M, $1M-$5M, $5M-$20M, $20M-$50M, $50M+?
   - Optional (sensitive data)?
   - Why it matters: Budget context for operational improvements

4. **Business Model**:
   - Free text description (1-2 sentences)?
   - Example: "Multi-location real estate services with legacy succession planning"
   - Why it matters: Specific service delivery model

5. **Business Priorities**:
   - Fixed list or free text?
   - How many to collect? (Recommend 3-5)
   - Examples: "Reduce operational costs", "Improve decision speed", "Retain key employees"
   - Why it matters: Aligns objectives with what business actually cares about

6. **Current Challenges**:
   - Free text (2-3 challenges)?
   - Examples: "Information silos between departments", "High rework costs"
   - Why it matters: Helps LLM understand pain points to address

**Output**: Complete field specification with validation rules

---

### Part 2: Company Onboarding Wizard Design (40 min)

**When Does Onboarding Happen?**

Option A: Immediately after consultant adds new client (modal/wizard)
Option B: Separate step after client added (banner prompts completion)
Option C: Just-in-time (prompted when creating first objective)

**Recommendation**: Option A (immediate) - capture context while fresh

**Wizard Flow Options**:

**Option 1: Single-Screen Wizard** (Fast, all-in-one)
```
┌─────────────────────────────────────────────────────────────────┐
│  NEW CLIENT SETUP - [Client Name]                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Let's understand [Client Name]'s business:                     │
│                                                                  │
│  Industry: [Dropdown]                                           │
│  Number of Employees: [Number input]                            │
│  Annual Revenue Range: [Dropdown]                               │
│                                                                  │
│  Business Model (1-2 sentences):                                │
│  [Text area - 200 chars max]                                    │
│                                                                  │
│  Top 3-5 Business Priorities:                                   │
│  1. [Text input]                                                │
│  2. [Text input]                                                │
│  3. [Text input]                                                │
│  [+ Add another]                                                │
│                                                                  │
│  Current Challenges (2-3):                                      │
│  • [Text input]                                                 │
│  • [Text input]                                                 │
│  [+ Add another]                                                │
│                                                                  │
│  [Skip for Now]  [Save & Continue]                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```
Pros: Fast, all context visible
Cons: May feel overwhelming

**Option 2: Multi-Step Wizard** (3 steps: Basic → Priorities → Challenges)
```
Step 1: Basic Info (Industry, Size, Revenue)
Step 2: Business Priorities (3-5 priorities)
Step 3: Current Challenges (2-3 challenges)
```
Pros: Less overwhelming, progressive disclosure
Cons: More clicks, may abandon

**Option 3: Hybrid** (Core fields required, rest optional "Complete Later")
```
Required Now: Industry, Size
Optional (Complete Later): Revenue, Model, Priorities, Challenges
```
Pros: Fast first-time setup, can enrich later
Cons: Incomplete profiles → lower quality KRs

**Decision Needed**: Which wizard approach?

---

### Part 3: My Clients Page Enhancements (30 min)

**Current "My Clients" Tab** (from screenshot):
- Client cards showing: Name, # Teams, # Responses
- "View Results" button per client
- "Add Client" button

**Enhancements Needed**:

1. **Profile Completion Indicator**:
   ```
   [Client Card]
   Legency Consulting
   1 Team | 1 Response | Profile: 60% ⚠️

   [Complete Profile]  [View Results]
   ```

2. **Quick Profile Edit**:
   - Inline edit from client card?
   - Separate "Edit Profile" page?
   - Modal overlay?

3. **Profile Preview**:
   - Show industry, size on client card?
   - Tooltip with full profile on hover?

4. **Sorting/Filtering**:
   - Filter by industry?
   - Sort by profile completeness?
   - Search by client name?

**Questions**:
- Where should "Complete Profile" action go?
- Should profile completion be required before first objective?
- How to prompt consultants to keep profiles up-to-date?

**Output**: My Clients page enhancement spec

---

### Part 4: Data Model Specification (20 min)

**Company Model Extensions**:

```javascript
// server/models/Company.js

business_profile: {
  // Basic Info
  industry_vertical: {
    type: String,
    enum: [
      'legacy_succession_planning',
      'professional_services',
      'real_estate',
      'construction',
      'healthcare',
      'manufacturing',
      'technology',
      'retail',
      'hospitality',
      'other'
    ],
    required: false  // Optional but recommended
  },

  industry_other: {
    type: String,
    maxlength: 100,
    required: false  // Only if industry_vertical = 'other'
  },

  employee_count: {
    type: Number,
    min: 1,
    max: 100000,
    required: false
  },

  employee_range: {
    type: String,
    enum: ['<10', '10-50', '50-100', '100-500', '500+'],
    required: false
  },

  revenue_range: {
    type: String,
    enum: ['<1M', '1M-5M', '5M-20M', '20M-50M', '50M+', 'prefer_not_to_say'],
    required: false  // Optional (sensitive)
  },

  // Business Context
  business_model: {
    type: String,
    maxlength: 200,
    required: false
    // Example: "Multi-location real estate services specializing in legacy succession"
  },

  business_priorities: [{
    type: String,
    maxlength: 100
  }],
  // Recommended: 3-5 priorities

  current_challenges: [{
    type: String,
    maxlength: 200
  }],
  // Recommended: 2-3 challenges

  // Metadata
  profile_completed: {
    type: Boolean,
    default: false
  },

  profile_completion_date: {
    type: Date
  },

  profile_last_updated: {
    type: Date,
    default: Date.now
  }
},

// Computed field (not stored)
profileCompletionPercentage: {
  // Calculate based on filled fields
  // Example: 7 fields, 5 filled = 71%
}
```

**Validation Rules**:
- Industry: Optional but show warning if missing
- Employee count OR range: At least one recommended
- Business priorities: Min 1, max 5 recommended
- Current challenges: Min 0, max 5

**Output**: Complete schema specification

---

### Part 5: Integration with Objective Creation (20 min)

**How Company Profile Feeds into LLM**:

```javascript
// server/services/ObjectiveKRGenerationService.js

async function generateKeyResults(objectiveData) {
  const company = await Company.findById(objectiveData.company_id);

  // Check profile completeness
  const profileComplete = checkProfileCompleteness(company.business_profile);

  if (!profileComplete) {
    // Log warning for analytics
    logger.warn('Generating KRs with incomplete company profile', {
      company_id: company._id,
      missing_fields: getMissingFields(company.business_profile)
    });
  }

  // Assemble context
  const context = {
    company: {
      name: company.name,
      industry: company.business_profile.industry_vertical || 'unspecified',
      size: company.business_profile.employee_count ||
            company.business_profile.employee_range ||
            'unspecified',
      business_model: company.business_profile.business_model ||
                      'Not provided - KRs will be more generic',
      business_priorities: company.business_profile.business_priorities || [],
      current_challenges: company.business_profile.current_challenges || []
    },
    // ... rest of context (SSI, behaviors, etc.)
  };

  // Call LLM with rich or sparse context
  return await callLLM(context);
}
```

**Graceful Degradation**:
- Missing industry → Use generic industry patterns
- Missing priorities → Focus on SSI scores only
- Missing challenges → Generic improvement language
- Completely empty profile → Warn consultant, allow creation, generic KRs

**Output**: Integration architecture diagram

---

## Session Deliverables

### Must Create in Session

1. **COMPANY_PROFILE_STRATEGY.md**
   - Complete strategic document
   - All sections filled
   - Ready for design handoff

2. **Company Onboarding Wizard Spec**
   - Flow decision made (single vs multi-step)
   - All fields specified
   - Validation rules documented
   - Skip/defer logic defined

3. **Company Model Schema**
   - business_profile fields finalized
   - Validation rules clear
   - Migration strategy for existing companies

4. **My Clients Page Enhancements**
   - Profile completion indicator design
   - Edit flow specified
   - Integration with existing UI

5. **Integration Architecture**
   - How profile feeds into LLM
   - Graceful degradation rules
   - Warning/prompt logic

---

## Key Decisions Needed in Session

### Decision 1: Required vs Optional Fields

**Question**: What's the minimum viable profile?

**Options**:
- A: All optional (allow empty profile, warn)
- B: Industry + Size required (block if missing)
- C: Nothing required, but gate objective creation with warning

**Recommendation**: Option A (all optional) - don't block consultant workflow

---

### Decision 2: When to Collect

**Question**: Immediate onboarding or just-in-time?

**Options**:
- A: Immediately after "Add Client" (modal wizard)
- B: Banner prompt "Complete profile for better KRs"
- C: Prompt when creating first objective

**Recommendation**: Option A (immediate) - capture context while fresh

---

### Decision 3: Exact vs Range Values

**Question**: Employee count - exact number or range?

**Options**:
- A: Exact number only (more precise)
- B: Range only (less sensitive)
- C: Both (user chooses which to provide)

**Recommendation**: Option C (both) - flexibility for consultant preference

---

### Decision 4: Industry List

**Question**: How many industries to support?

**Options**:
- A: 5-7 core industries + Other
- B: 15-20 comprehensive list
- C: Free text only (no dropdown)

**Recommendation**: Option A (5-7 + Other) - enough for vertical insights, not overwhelming

**Initial List**:
1. Legacy Succession Planning
2. Professional Services (law, accounting, consulting)
3. Real Estate
4. Construction
5. Healthcare
6. Manufacturing
7. Technology/Software
8. Other (with text input)

---

## Post-Session Actions

### For Product Team
- [ ] Review COMPANY_PROFILE_STRATEGY.md
- [ ] Approve field list and wizard flow
- [ ] Share with consultants for feedback

### For Design Team
- [ ] Design company onboarding wizard
- [ ] Design My Clients page enhancements
- [ ] Design profile completion indicator
- [ ] Create prototype for user testing

### For Engineering Team
- [ ] Review schema extensions
- [ ] Plan migration for existing companies
- [ ] Estimate API changes
- [ ] Integration with LLM service

---

## Success Criteria

**Session is successful if**:
- ✅ COMPANY_PROFILE_STRATEGY.md is complete
- ✅ All field decisions made (required vs optional)
- ✅ Wizard flow decided (single vs multi-step)
- ✅ Schema finalized with validation rules
- ✅ Integration with LLM context assembly clear
- ✅ Graceful degradation rules documented

**Ready for next phase when**:
- Design can start onboarding wizard mockups
- Engineering has clear schema requirements
- Product team has validated with consultants

---

## Related Documents

**Input Documents**:
- [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md)
- [objective_kr_generation_prompt.md](../../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md)

**Output Document** (to be created in session):
- `COMPANY_PROFILE_STRATEGY.md` → Location: `KARVIA_STRATEGY/1-PRODUCT/features/`

**Previous Session**:
- [SESSION_164_OBJECTIVE_PAGE.md](./SESSION_164_OBJECTIVE_PAGE.md)

**Next Session**:
- [SESSION_166_LLM_ORCHESTRATION.md](./SESSION_166_LLM_ORCHESTRATION.md)

---

**Session Owner**: Product Team
**Created**: April 20, 2026
**Status**: Planned - Ready to Execute

