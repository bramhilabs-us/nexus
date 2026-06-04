# Sprint 9 Master Plan: Modular Business Health Assessment

**Sprint**: 9
**Created**: December 3, 2025
**Goal**: Build Scalable Modular Assessment System with Industry Variants + Framework Validation
**Total Story Points**: 68 pts (estimated)
**Estimated Duration**: 15-18 days

---

## Executive Summary

Sprint 9 delivers a **Modular Business Health Assessment** system that:
1. Builds on the existing VALUE framework design (Sprint 7)
2. Implements **Core + Role + Function** modular question architecture
3. Supports **Industry Variants** (Wellness, Consulting, Professional Services)
4. Provides **ultra-simple UX** (2 clicks to send assessment)
5. **Maximizes reuse** of existing models, services, and patterns

### Key Insight from Codebase Audit

| Component | Reuse Level | Changes Needed |
|-----------|-------------|----------------|
| SSIScoringService | **100%** | Rename to PillarScoringService (optional) |
| AssessmentTemplate model | **100%** | Already supports N dimensions |
| Assessment model | **100%** | Already dimension-agnostic |
| DimensionConfigSchema | **100%** | Works for any pillar count |
| Routes (templates/assessments) | **100%** | Template-agnostic |
| AssessmentQuestion model | **95%** | Add new enum values + fields |

**Bottom Line**: 95% of backend is ready. Focus is on question content + frontend UX.

---

## Framework Evolution

### From SSI (3 Dimensions) to MECE 12-Block Model

| Version | Structure | Questions | Industry Support | Role Filtering |
|---------|-----------|-----------|------------------|----------------|
| SSI (Current) | 3 dimensions, 19 categories | 60 | None | None |
| **MECE 12-Block (Sprint 9)** | 3 dimensions, 12 blocks (4 per dimension) | ~48-72 | Full variants | Core + Function + Team |

### The 12-Block MECE Framework

**Design Principle**: Mutually Exclusive, Collectively Exhaustive (MECE) subcategories within each SSI dimension.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SSI FRAMEWORK - 12 BLOCKS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚡ SPEED (4 Blocks)                                                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐                │
│  │ EXECUTION │  │ DECISION  │  │ ADAPTATION│  │ RESPONSE  │                │
│  │ How fast  │  │ How quick │  │ How fast  │  │ How fast  │                │
│  │ work gets │  │ decisions │  │ org adapts│  │ to serve  │                │
│  │ done      │  │ are made  │  │ to change │  │ customers │                │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘                │
│                                                                              │
│  🛡️ STRENGTH (4 Blocks)                                                    │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐                │
│  │ FINANCIAL │  │OPERATIONAL│  │  PEOPLE   │  │  QUALITY  │                │
│  │ Cash flow │  │ Process   │  │ Team      │  │ Product/  │                │
│  │ stability │  │ efficiency│  │ stability │  │ service   │                │
│  │ resilience│  │ & systems │  │ wellbeing │  │ standards │                │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘                │
│                                                                              │
│  🧠 INTELLIGENCE (4 Blocks)                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐                │
│  │  MARKET   │  │   DATA    │  │ STRATEGIC │  │ LEARNING  │                │
│  │ Customer  │  │ Analytics │  │ Long-term │  │ Continuous│                │
│  │ & market  │  │ & metrics │  │ planning  │  │ improve-  │                │
│  │ insight   │  │ driven    │  │ foresight │  │ ment      │                │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Block Definitions

| ID | Block | Dimension | Description | What It Measures |
|----|-------|-----------|-------------|------------------|
| `SPD-EXE` | Execution | Speed | How fast work gets completed | Task completion velocity, sprint delivery |
| `SPD-DEC` | Decision | Speed | How quickly decisions are made | Decision latency, approval cycles |
| `SPD-ADP` | Adaptation | Speed | How fast org responds to change | Pivot speed, market responsiveness |
| `SPD-RES` | Response | Speed | Speed of customer service | Response time, resolution speed |
| `STR-FIN` | Financial | Strength | Cash flow, profitability stability | Financial runway, margin consistency |
| `STR-OPS` | Operational | Strength | Operational consistency | Process reliability, uptime |
| `STR-PEO` | People | Strength | Team stability, burnout prevention | Retention, engagement, capacity |
| `STR-QUA` | Quality | Strength | Product/service consistency | Defect rate, customer satisfaction |
| `INT-MKT` | Market | Intelligence | Understanding of market/customers | Customer insights, market awareness |
| `INT-DAT` | Data | Intelligence | Use of analytics in decisions | Data maturity, metric-driven culture |
| `INT-STR` | Strategic | Intelligence | Long-term planning capability | Vision clarity, roadmap quality |
| `INT-LRN` | Learning | Intelligence | Continuous improvement mindset | Knowledge sharing, skill development |

---

## Three-Tier Cascade Architecture (Option C)

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Template Builder UX** | Three-Tier Cascade | Matches natural Core → Function → Team hierarchy |
| **Core Questions** | Mandatory | Ensures all 12 blocks covered for every respondent |
| **Function Detection** | Auto-detect from profile | Reduces friction, uses role/department data |
| **Minimum Questions** | 2 per block (Core) | 24 core questions ensures comprehensive coverage |
| **Industry Variants** | Same structure, different wording | Maintains comparability across industries |

### The Three-Tier Cascade Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              THREE-TIER CASCADE ASSESSMENT ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   TIER 1: CORE QUESTIONS (Mandatory - Everyone)                             │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │  24 Questions (2 per block × 12 blocks)                               │ │
│   │                                                                        │ │
│   │  SPEED (8Q)           STRENGTH (8Q)         INTELLIGENCE (8Q)         │ │
│   │  • Execution (2)      • Financial (2)       • Market (2)              │ │
│   │  • Decision (2)       • Operational (2)     • Data (2)                │ │
│   │  • Adaptation (2)     • People (2)          • Strategic (2)           │ │
│   │  • Response (2)       • Quality (2)         • Learning (2)            │ │
│   │                                                                        │ │
│   │  ✓ Mandatory for ALL respondents                                      │ │
│   │  ✓ Ensures complete 12-block coverage                                 │ │
│   │  ✓ Industry-specific wording applied automatically                    │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│   TIER 2: FUNCTION QUESTIONS (Auto-detected from profile)                   │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │  6-12 Questions based on role/department                              │ │
│   │                                                                        │ │
│   │  Leadership           Client-Facing         Operations                │ │
│   │  (Owner/Exec/Mgr)     (Sales/Support)       (Ops/Admin)               │ │
│   │  ┌─────────┐          ┌─────────┐           ┌─────────┐               │ │
│   │  │Finance  │          │Customer │           │Process  │               │ │
│   │  │Strategy │          │Response │           │Systems  │               │ │
│   │  │Team Mgmt│          │Service  │           │Efficiency│              │ │
│   │  └─────────┘          └─────────┘           └─────────┘               │ │
│   │                                                                        │ │
│   │  ✓ Auto-detected from user.role + user.department                     │ │
│   │  ✓ Adds depth to relevant blocks                                      │ │
│   │  ✓ ~6 additional questions per function                               │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│   TIER 3: TEAM QUESTIONS (Optional - Collaboration Depth)                   │
│   ┌───────────────────────────────────────────────────────────────────────┐ │
│   │  4-8 Questions about team dynamics                                    │ │
│   │                                                                        │ │
│   │  • Cross-functional collaboration                                     │ │
│   │  • Team communication effectiveness                                   │ │
│   │  • Peer support and knowledge sharing                                 │ │
│   │  • Conflict resolution                                                │ │
│   │                                                                        │ │
│   │  ✓ Optional add-on for team health focus                              │ │
│   │  ✓ Consultant can enable/disable per assessment                       │ │
│   └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│   TOTAL: 24 Core + 6-12 Function + 0-8 Team = 30-44 questions               │
│   DURATION: ~15-22 minutes                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Question Distribution Summary

| Tier | Questions | Who Gets It | Mandatory? |
|------|-----------|-------------|------------|
| **Core** | 24 (2 × 12 blocks) | Everyone | YES |
| **Leadership Function** | 8 | BUSINESS_OWNER, EXECUTIVE, MANAGER | Auto-detect |
| **Client-Facing Function** | 6 | Sales, Support, Account Mgmt | Auto-detect |
| **Operations Function** | 6 | Ops, Admin, Back-office | Auto-detect |
| **Team Questions** | 4-8 | All (if enabled) | Optional |

### Function Auto-Detection Logic

```javascript
// Auto-detect function from user profile
function detectFunctions(user) {
  const functions = [];

  // Leadership detection
  if (['BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER'].includes(user.role)) {
    functions.push('leadership');
  }

  // Client-facing detection
  if (user.department && ['sales', 'support', 'customer_success', 'account_management']
      .includes(user.department.toLowerCase())) {
    functions.push('client_facing');
  }

  // Operations detection
  if (user.department && ['operations', 'admin', 'hr', 'finance', 'it']
      .includes(user.department.toLowerCase())) {
    functions.push('operations');
  }

  return functions;
}
```

### Industry Variants Approach

Same 12-block structure, different wording per industry:

| Block | Base Question | Wellness Variant | Consulting Variant |
|-------|--------------|------------------|-------------------|
| SPD-RES | "How quickly do you respond to client inquiries?" | "How quickly do you respond to booking requests and membership inquiries?" | "How rapidly do you respond to RFPs and prospective client outreach?" |
| STR-PEO | "Team workload is manageable" | "Teaching schedule allows for quality instruction" | "Project staffing allows for work-life balance" |
| INT-MKT | "We understand our customers well" | "We know what our members want from their wellness journey" | "We understand our clients' business challenges deeply" |

### Minimum Questions Per Block

| Category | Min Questions | Rationale |
|----------|---------------|-----------|
| Core (per block) | 2 | Ensures statistical reliability for each block score |
| Function | 6 total | Adds depth without fatigue |
| Team | 4 total | Focused on key collaboration metrics |

---

## Epic Structure

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| **Epic A** | 13 | P0 | Data Model & Question Bank |
| **Epic B** | 18 | P0 | Assessment Flow & Scoring |
| **Epic C** | 16 | P1 | Template Builder UX |
| **Epic D** | 8 | P2 | Industry Configuration |
| **Epic E** | 13 | P1 | SSI Framework Scientific Validation |
| **Total** | **68** | | |

---

## Epic A: Data Model & Question Bank (13 pts)

**Goal**: Extend existing models to support modular questions with industry variants

### Story A1: Extend AssessmentQuestion Model (3 pts)
**As a** developer
**I want** the question model to support pillars, modules, and variants
**So that** questions can be filtered by role, function, and industry

**Acceptance Criteria**:
- [ ] Add `pillar` field with enum: `['velocity', 'resilience', 'insight', 'culture', 'customer', 'financial', 'operations']`
- [ ] Add `module` field with enum: `['core', 'owner', 'manager', 'employee', 'client_facing', 'operations', 'admin']`
- [ ] Add `variants` array: `[{ industry: String, text: String, context_hints: [String] }]`
- [ ] Add `filters` object: `{ industries: [String], roles: [String], functions: [String] }`
- [ ] Add `relevance` object: `{ wellness: Number, consulting: Number, professional: Number, general: Number }`
- [ ] Maintain backward compatibility with existing `dimension` field (maps to legacy SSI)
- [ ] Add compound index: `{ pillar: 1, module: 1, is_active: 1 }`

**Technical Spec**:
```javascript
// server/models/AssessmentQuestion.js - EXTEND existing model

// ADD to schema (non-breaking):
pillar: {
  type: String,
  enum: ['velocity', 'resilience', 'insight', 'culture', 'customer', 'financial', 'operations'],
  index: true
},

module: {
  type: String,
  enum: ['core', 'owner', 'manager', 'employee', 'client_facing', 'operations_func', 'admin'],
  default: 'core'
},

variants: [{
  industry: { type: String, enum: ['wellness', 'consulting', 'professional', 'general'] },
  text: String,
  context_hints: [String]
}],

filters: {
  industries: [String],
  roles: [String],
  functions: [String]
},

relevance: {
  wellness: { type: Number, default: 0.5, min: 0, max: 1 },
  consulting: { type: Number, default: 0.5, min: 0, max: 1 },
  professional: { type: Number, default: 0.5, min: 0, max: 1 },
  general: { type: Number, default: 1.0 }
}
```

**Files to Modify**:
- `server/models/AssessmentQuestion.js` (extend schema)

**Reuse**: 100% existing model structure, just adding fields

---

### Story A2: Create Pillar Configuration (2 pts)
**As a** developer
**I want** a centralized pillar configuration
**So that** pillar metadata is not hardcoded in frontend

**Acceptance Criteria**:
- [ ] Create `server/config/pillar-config.js` with all 7 pillars
- [ ] Include: id, label, icon, description, color, tailwind classes
- [ ] Include: default thresholds per pillar
- [ ] Include: pillar-to-OKR-category mapping
- [ ] Expose via API endpoint: `GET /api/config/pillars`

**Technical Spec**:
```javascript
// server/config/pillar-config.js

const PILLARS = {
  velocity: {
    id: 'velocity',
    label: 'Velocity',
    icon: '⚡',
    description: 'Speed, agility, and responsiveness',
    color: 'purple',
    tailwind: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    thresholds: { critical: 5.0, needs_attention: 7.0 },
    okr_categories: ['operations', 'innovation']
  },
  // ... 6 more pillars
};

const MODULES = {
  core: { id: 'core', label: 'Core', roles: ['all'], question_count: 12 },
  owner: { id: 'owner', label: 'Owner/Executive', roles: ['BUSINESS_OWNER', 'EXECUTIVE'], question_count: 12 },
  manager: { id: 'manager', label: 'Manager', roles: ['MANAGER'], question_count: 10 },
  employee: { id: 'employee', label: 'Employee', roles: ['EMPLOYEE'], question_count: 8 },
  client_facing: { id: 'client_facing', label: 'Client-Facing', functions: ['client'], question_count: 6 },
  operations_func: { id: 'operations_func', label: 'Operations', functions: ['operations'], question_count: 6 },
  admin: { id: 'admin', label: 'Admin/Support', functions: ['admin'], question_count: 6 }
};

const INDUSTRIES = {
  wellness: { id: 'wellness', label: 'Wellness & Fitness', icon: '🧘' },
  consulting: { id: 'consulting', label: 'Consulting & Advisory', icon: '💼' },
  professional: { id: 'professional', label: 'Professional Services', icon: '⚖️' },
  general: { id: 'general', label: 'General Services', icon: '🏪' }
};

module.exports = { PILLARS, MODULES, INDUSTRIES, ... };
```

**Files to Create**:
- `server/config/pillar-config.js`
- `server/routes/config.js` (new route for exposing config)

**Reuse**: Pattern from `server/config/categories.js`

---

### Story A3: Seed Core Module Questions (3 pts)
**As a** developer
**I want** the core module questions seeded
**So that** every employee can take the base assessment

**Acceptance Criteria**:
- [ ] Create 12 core questions covering Culture, Team, Communication, Work Environment
- [ ] Each question has base text + 3 industry variants (wellness, consulting, professional)
- [ ] Questions tagged with `module: 'core'`
- [ ] Questions mapped to appropriate pillars (culture, operations)
- [ ] Seed script is idempotent (can run multiple times safely)

**Question Content** (Core Module - 12 Questions):

| ID | Pillar | Question | Wellness Variant |
|----|--------|----------|------------------|
| CORE-CUL-1 | culture | "I feel proud to work here" | "I feel proud to represent this studio to members" |
| CORE-CUL-2 | culture | "Our stated values match actual behavior" | "Our wellness philosophy guides how we treat members" |
| CORE-CUL-3 | culture | "I would recommend this company to a friend" | "I would recommend this studio to someone looking for a yoga community" |
| CORE-TEAM-1 | culture | "My team works well together" | "Instructors support each other with scheduling and coverage" |
| CORE-TEAM-2 | culture | "Conflicts are resolved constructively" | "Disagreements about class formats are handled professionally" |
| CORE-TEAM-3 | culture | "I trust my colleagues" | "I can count on other instructors to cover my classes" |
| CORE-COMM-1 | operations | "Important updates reach me quickly" | "Schedule changes are communicated promptly" |
| CORE-COMM-2 | operations | "I feel heard when I share feedback" | "My suggestions about classes or operations are considered" |
| CORE-COMM-3 | operations | "Leadership communicates clearly" | "Studio management keeps us informed about business direction" |
| CORE-ENV-1 | operations | "I have what I need to do my job" | "I have the equipment and space I need to teach quality classes" |
| CORE-ENV-2 | operations | "My workload is manageable" | "My teaching schedule allows for quality instruction" |
| CORE-ENV-3 | operations | "I feel safe at work" | "The studio environment is clean, safe, and welcoming" |

**Files to Create**:
- `server/scripts/seed-modular-questions-core.js`

**Reuse**: Pattern from `server/scripts/seedAssessmentQuestions.js`

---

### Story A4: Seed Role Module Questions (3 pts)
**As a** developer
**I want** role-specific questions seeded
**So that** owners, managers, and employees get relevant questions

**Acceptance Criteria**:
- [ ] Create 12 Owner questions (Financial, Strategy, Growth)
- [ ] Create 10 Manager questions (Team mgmt, Operations, Clients)
- [ ] Create 8 Employee questions (Daily work, Tools, Development)
- [ ] Each question has industry variants
- [ ] Questions mapped to appropriate pillars

**Question Distribution**:

| Role | Pillars Covered | Questions |
|------|-----------------|-----------|
| Owner | financial (4), insight (4), velocity (4) | 12 |
| Manager | operations (4), customer (3), culture (3) | 10 |
| Employee | operations (3), culture (2), velocity (3) | 8 |

**Files to Create**:
- `server/scripts/seed-modular-questions-roles.js`

---

### Story A5: Seed Function Module Questions (2 pts)
**As a** developer
**I want** function-specific questions seeded
**So that** client-facing, operations, and admin roles get depth questions

**Acceptance Criteria**:
- [ ] Create 6 Client-Facing questions (customer pillar focus)
- [ ] Create 6 Operations questions (operations pillar focus)
- [ ] Create 6 Admin questions (operations + velocity focus)
- [ ] Each question has industry variants

**Files to Create**:
- `server/scripts/seed-modular-questions-functions.js`

---

## Epic B: Assessment Flow & Scoring (18 pts)

**Goal**: Build backend logic for modular assessment delivery and scoring

### Story B1: Dynamic Question Selection API (5 pts)
**As a** consultant
**I want** the system to automatically select questions based on recipient role
**So that** each person gets relevant questions without manual configuration

**Acceptance Criteria**:
- [ ] New endpoint: `GET /api/assessments/questions-for-user`
- [ ] Accepts: `{ user_id, industry, template_type }`
- [ ] Returns questions filtered by: Core + Role module + Function module (if tagged)
- [ ] Applies industry variant text if available
- [ ] Returns question count and estimated duration

**Technical Spec**:
```javascript
// server/routes/assessments.js - ADD endpoint

router.get('/questions-for-user',
  authenticateToken,
  async (req, res) => {
    const { user_id, industry = 'general', include_functions = true } = req.query;

    // Get user's role
    const user = await User.findById(user_id);
    const role = user.role; // BUSINESS_OWNER, MANAGER, EMPLOYEE

    // Determine which modules to include
    const modules = ['core']; // Always include core

    if (['BUSINESS_OWNER', 'EXECUTIVE'].includes(role)) {
      modules.push('owner');
    } else if (role === 'MANAGER') {
      modules.push('manager');
    } else {
      modules.push('employee');
    }

    // Add function modules if user has function tags
    if (include_functions && user.function_tags) {
      if (user.function_tags.includes('client_facing')) modules.push('client_facing');
      if (user.function_tags.includes('operations')) modules.push('operations_func');
      if (user.function_tags.includes('admin')) modules.push('admin');
    }

    // Fetch questions for these modules
    const questions = await AssessmentQuestion.find({
      module: { $in: modules },
      is_active: true
    }).sort({ pillar: 1, module: 1 });

    // Apply industry variants
    const localizedQuestions = questions.map(q => ({
      ...q.toObject(),
      text: getVariantText(q, industry) // Returns variant text or base text
    }));

    res.json({
      success: true,
      modules_included: modules,
      question_count: localizedQuestions.length,
      estimated_minutes: Math.ceil(localizedQuestions.length * 0.5),
      questions: localizedQuestions
    });
  }
);
```

**Files to Modify**:
- `server/routes/assessments.js` (add endpoint)

**Reuse**: Existing `AssessmentQuestion.find()` patterns, `authenticateToken` middleware

---

### Story B2: Pillar-Based Scoring Service (4 pts)
**As a** developer
**I want** the scoring service to calculate scores per pillar
**So that** assessment results show 7-pillar breakdown

**Acceptance Criteria**:
- [ ] Extend SSIScoringService (or create PillarScoringService that wraps it)
- [ ] Calculate scores for all 7 pillars
- [ ] Support templates with 3 pillars (SSI) OR 7 pillars (modular)
- [ ] Weighted scoring by pillar
- [ ] Maintain backward compatibility with existing SSI templates

**Technical Spec**:
```javascript
// server/services/PillarScoringService.js
// EXTENDS SSIScoringService - all methods already dimension-agnostic!

const SSIScoringService = require('./SSIScoringService');

class PillarScoringService extends SSIScoringService {

  // Map old SSI dimensions to new pillars for backward compatibility
  static mapLegacyDimension(dimension) {
    const mapping = {
      'speed': 'velocity',
      'strength': 'resilience',
      'intelligence': 'insight'
    };
    return mapping[dimension] || dimension;
  }

  // Get pillar scores from responses
  static calculatePillarScores(template, responses, questions) {
    // Use parent method - it's already dimension-agnostic!
    const scores = super.calculateScores(template, responses, questions);

    // Add pillar metadata
    const { PILLARS } = require('../config/pillar-config');
    Object.keys(scores.dimension_scores).forEach(pillar => {
      if (PILLARS[pillar]) {
        scores.dimension_scores[pillar].label = PILLARS[pillar].label;
        scores.dimension_scores[pillar].icon = PILLARS[pillar].icon;
      }
    });

    return scores;
  }
}

module.exports = PillarScoringService;
```

**Files to Create**:
- `server/services/PillarScoringService.js` (thin wrapper)

**Reuse**: **100% of SSIScoringService** - all methods already loop through dimensions dynamically

---

### Story B3: Smart Template Generation (5 pts)
**As a** consultant
**I want** to generate optimal templates with one API call
**So that** I can send assessments without manual question selection

**Acceptance Criteria**:
- [ ] New endpoint: `POST /api/assessment-templates/generate`
- [ ] Accepts: `{ industry, depth, name }`
- [ ] Depth options: `quick` (21Q), `standard` (35Q), `deep` (50Q)
- [ ] Auto-selects best questions per pillar based on industry relevance
- [ ] Creates and saves template
- [ ] Returns template ready for sending

**Technical Spec**:
```javascript
// server/routes/assessmentTemplates.js - ADD endpoint

router.post('/generate',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER'),
  async (req, res) => {
    const { industry = 'general', depth = 'standard', name } = req.body;

    const depthConfig = {
      quick: { perPillar: 3, total: 21 },
      standard: { perPillar: 5, total: 35 },
      deep: { perPillar: 7, total: 49 }
    };

    const { perPillar } = depthConfig[depth];
    const { PILLARS } = require('../config/pillar-config');

    // Build template dimensions
    const dimensions = {};
    const pillarCount = Object.keys(PILLARS).length;
    const weight = 1 / pillarCount; // Equal weight

    for (const pillarId of Object.keys(PILLARS)) {
      // Get top questions for this pillar, sorted by relevance to industry
      const questions = await AssessmentQuestion.find({
        pillar: pillarId,
        is_active: true
      })
      .sort({ [`relevance.${industry}`]: -1 })
      .limit(perPillar);

      dimensions[pillarId] = {
        weight: Math.round(weight * 100) / 100,
        thresholds: PILLARS[pillarId].thresholds,
        selected_questions: questions.map(q => q.question_id)
      };
    }

    // Create template
    const template = new AssessmentTemplate({
      name: name || `${industry} ${depth} Assessment`,
      description: `Auto-generated ${depth} assessment for ${industry}`,
      template_type: 'modular',
      industry,
      dimensions,
      is_global: false,
      company_id: req.user.company_id,
      created_by: req.user.user_id
    });

    await template.save();

    res.json({
      success: true,
      template,
      stats: {
        total_questions: Object.values(dimensions).reduce((sum, d) => sum + d.selected_questions.length, 0),
        pillars: Object.keys(dimensions).length,
        estimated_minutes: Math.ceil(template.total_questions * 0.5)
      }
    });
  }
);
```

**Files to Modify**:
- `server/routes/assessmentTemplates.js` (add endpoint)

**Reuse**: Existing `AssessmentTemplate` model, `requireRole` middleware

---

### Story B4: Assessment Results with Pillar Breakdown (4 pts)
**As a** user
**I want** to see my results broken down by 7 pillars
**So that** I understand all aspects of my business health

**Acceptance Criteria**:
- [ ] Modify existing results endpoint to support 7 pillars
- [ ] Return pillar metadata (icon, label, description)
- [ ] Return pillar-specific recommendations
- [ ] Backward compatible with 3-pillar SSI results

**Files to Modify**:
- `server/routes/assessments.js` (modify `/:id/results`)

**Reuse**: Existing endpoint structure, just extend response

---

## Epic C: Template Builder UX - Three-Tier Cascade (16 pts)

**Goal**: Create ultra-simple template builder using the Three-Tier Cascade design

**Design Philosophy**: Match the visual hierarchy to the question hierarchy (Core → Function → Team)

### Story C1: Assessment Hub Integration (3 pts)
**As a** consultant
**I want** to access the 12-block SSI assessment from the hub
**So that** I have one place to manage all assessments

**Acceptance Criteria**:
- [ ] Add "Business Health Assessment" link in My Templates section
- [ ] Link goes to `/pages/assessment-builder.html`
- [ ] Distinguish from legacy SSI template option
- [ ] Show badge: "12-Block MECE Framework"

**Files to Modify**:
- `client/pages/assessment-hub.html` (lines 68-71)

**Code Change**:
```html
<div class="flex items-center justify-between mb-4">
    <p class="text-sm text-gray-600">Select a template to send to your team or take yourself</p>
    <div class="flex items-center gap-4">
        <a href="/pages/assessment-builder.html"
           class="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
            <span>🎯</span> Business Health (12-Block) →
        </a>
        <span class="text-gray-300">|</span>
        <a href="/pages/assessment-question-library.html"
           class="text-sm text-purple-600 font-medium hover:underline">
            Legacy SSI →
        </a>
    </div>
</div>
```

---

### Story C2: Three-Tier Cascade Template Builder (8 pts)
**As a** consultant
**I want** to build assessments following the Core → Function → Team hierarchy
**So that** I understand exactly what each respondent will answer

**Acceptance Criteria**:
- [ ] Create `/pages/assessment-builder.html`
- [ ] Three-tier visual layout matching question hierarchy
- [ ] Tier 1 (Core): Show 12 blocks with 2 questions each - ALWAYS enabled
- [ ] Tier 2 (Function): Auto-detect options with toggle override
- [ ] Tier 3 (Team): Optional toggle
- [ ] Industry selector affects question wording preview
- [ ] Live preview shows question counts by tier
- [ ] Single CTA: "Create Assessment"

**Page Design** (Three-Tier Cascade):
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Hub                                                               │
│                                                                              │
│  🎯 Business Health Assessment Builder                                      │
│  Build a comprehensive assessment using our 12-block framework.             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  INDUSTRY (affects question wording)                                        │
│  [🧘 Wellness]  [💼 Consulting ✓]  [⚖️ Professional]  [🏪 General]          │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  TIER 1: CORE QUESTIONS                                    24 questions     │
│  ───────────────────────────────────────────────────────── ✓ Required       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ⚡ SPEED                    🛡️ STRENGTH                🧠 INTEL    │    │
│  │  ┌────────┐ ┌────────┐      ┌────────┐ ┌────────┐      ┌────────┐ │    │
│  │  │Execution│ │Decision│      │Financial│ │Operational   │Market  │ │    │
│  │  │   2Q   │ │   2Q   │      │   2Q   │ │   2Q   │      │  2Q    │ │    │
│  │  └────────┘ └────────┘      └────────┘ └────────┘      └────────┘ │    │
│  │  ┌────────┐ ┌────────┐      ┌────────┐ ┌────────┐      ┌────────┐ │    │
│  │  │Adaptation│Response│      │ People │ │Quality │      │ Data   │ │    │
│  │  │   2Q   │ │   2Q   │      │   2Q   │ │   2Q   │      │  2Q    │ │    │
│  │  └────────┘ └────────┘      └────────┘ └────────┘      └────────┘ │    │
│  │                                                         ┌────────┐ │    │
│  │                                                         │Strategic│ │   │
│  │                                                         │  2Q    │ │    │
│  │                                                         └────────┘ │    │
│  │                                                         ┌────────┐ │    │
│  │                                                         │Learning│ │    │
│  │                                                         │  2Q    │ │    │
│  │                                                         └────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│          ▼ Click any block to preview questions                             │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  TIER 2: FUNCTION QUESTIONS                                6-12 questions   │
│  ───────────────────────────────────────────────────────── Auto-detected    │
│                                                                              │
│  Function modules add depth for specific roles:                             │
│                                                                              │
│  [✓] Leadership (8Q)        For: Owners, Executives, Managers              │
│  [ ] Client-Facing (6Q)     For: Sales, Support, Account Mgmt              │
│  [ ] Operations (6Q)        For: Ops, Admin, Back-office                   │
│                                                                              │
│  ℹ️ Auto-detected from recipient profiles. Override manually if needed.     │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  TIER 3: TEAM QUESTIONS                                    4-8 questions    │
│  ───────────────────────────────────────────────────────── Optional         │
│                                                                              │
│  [ ] Include Team Collaboration Questions                                   │
│      Measures: Cross-functional collaboration, peer support,               │
│      communication effectiveness, conflict resolution                       │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  SUMMARY                                                                     │
│  ─────────────────────────────────────────────────────────                  │
│  Core:     24 questions (mandatory)                                         │
│  Function: 8 questions (Leadership auto-detected)                           │
│  Team:     0 questions (disabled)                                           │
│  ─────────────────────────────────────────────────────────                  │
│  Total:    32 questions • ~16 minutes                                       │
│                                                                              │
│                      [Create Assessment →]                                   │
│                      [Save as Template] (secondary)                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Block Click Behavior**: Clicking any of the 12 blocks shows a preview modal with:
- Block name and description
- 2 core questions for that block (with industry wording applied)
- Related function questions (if applicable)

**Files to Create**:
- `client/pages/assessment-builder.html`
- `client/pages/scripts/assessment-builder.js`

**Reuse**: Layout patterns from `assessment-hub.html`, card styles from existing pages

---

### Story C3: Block Preview Modal (2 pts)
**As a** consultant
**I want** to preview questions in each block before creating assessment
**So that** I can verify the content is appropriate

**Acceptance Criteria**:
- [ ] Click any of the 12 blocks to open preview modal
- [ ] Show block name, dimension, and description
- [ ] Display core questions with industry-specific wording
- [ ] Show related function questions (greyed if not selected)
- [ ] Close button returns to builder

---

### Story C4: Recipient Selection Flow (3 pts)
**As a** consultant
**I want** to select recipients after creating assessment
**So that** the right questions go to the right people

**Acceptance Criteria**:
- [ ] After "Create Assessment", show recipient selection modal
- [ ] List team members grouped by role
- [ ] Show per-person question count: "32Q (Core 24 + Leadership 8)"
- [ ] "Send to All" option with total question breakdown
- [ ] Function auto-detection indicators per recipient
- [ ] Confirmation before sending

**Files to Modify**:
- `client/pages/assessment-builder.html` (add modal)

**Reuse**: Modal structure from `assessment-hub.html` lines 247-324

---

## Epic D: Industry Configuration (8 pts)

**Goal**: Make industry variants easy to manage and extend

### Story D1: Industry Admin API (3 pts)
**As a** developer
**I want** industries to be manageable via API
**So that** new industries can be added without code changes

**Acceptance Criteria**:
- [ ] `GET /api/config/industries` - list all industries
- [ ] `POST /api/config/industries` - add new industry (CONSULTANT only)
- [ ] Industries stored in config file initially (can migrate to DB later)

---

### Story D2: Question Variant Management (3 pts)
**As a** developer
**I want** to easily add variants to existing questions
**So that** new industries can be supported quickly

**Acceptance Criteria**:
- [ ] Script to add variant to existing question
- [ ] Validation that variant industry exists
- [ ] Report showing questions without variants for an industry

---

### Story D3: Industry Analytics (2 pts)
**As a** consultant
**I want** to see which industries are using assessments
**So that** I know where to focus variant development

**Acceptance Criteria**:
- [ ] Track industry selection in assessment metadata
- [ ] Simple report: assessments by industry

---

## Epic E: SSI Framework Scientific Validation (13 pts)

**Goal**: Validate the scientific foundation of the 12-block MECE framework

**Context**: We've consolidated from 19 overlapping categories to 12 MECE blocks (4 per SSI dimension). This epic validates that consolidation and ensures scientific rigor.

### Story E1: MECE 12-Block Validation (5 pts)
**As a** product owner
**I want** to validate that our 12 blocks are truly MECE
**So that** we're measuring distinct, comprehensive aspects of business health

**Acceptance Criteria**:
- [ ] Document each of the 12 blocks with precise definitions and boundaries
- [ ] Validate mutual exclusivity: No two blocks measure the same construct
- [ ] Validate collective exhaustiveness: All critical business health dimensions covered
- [ ] Research academic literature for validation (McKinsey OHI, Gallup Q12, Culture Amp)
- [ ] Create validation report with citations

**Consolidation Mapping** (from 19 categories to 12 blocks):

| Old Category | New Block | Rationale |
|--------------|-----------|-----------|
| execution_velocity | SPD-EXE | Retained |
| decision_speed | SPD-DEC | Retained |
| adaptability | SPD-ADP | Retained |
| time_to_market | SPD-ADP | Merged (both measure change speed) |
| client_responsiveness | SPD-RES | Retained |
| financial_operational_resilience_pulse | STR-FIN | Split to Financial |
| process_efficiency | STR-OPS | Retained |
| resilience_workload | STR-OPS | Merged (both measure operational capacity) |
| people_sustainability | STR-PEO | Retained |
| quality_reliability | STR-QUA | Retained |
| risk_compliance | STR-QUA | Merged (both measure consistency/safety) |
| customer_insights | INT-MKT | Retained |
| data_driven_decisions | INT-DAT | Retained |
| analytical_capability | INT-DAT | Merged (both measure data maturity) |
| strategic_foresight | INT-STR | Retained |
| information_flow_strategic_intelligence_pulse | INT-STR | Merged (strategy-related) |
| learning_culture | INT-LRN | Retained |
| knowledge_sharing | INT-LRN | Merged (both measure learning) |
| change_strategic_alignment_pulse | SPD-ADP | Merged (change-related) |

**Research Questions**:
1. Does the 4×3 structure (4 blocks per dimension) maintain balanced coverage?
2. Are SPD-EXE (Execution) and SPD-DEC (Decision) sufficiently distinct?
3. Does STR-OPS (Operational) overlap with STR-QUA (Quality)?
4. Is INT-MKT (Market) distinct from INT-DAT (Data)?

**Deliverable**: `KARVIA_STRATEGY/2-RESEARCH/SSI_12_BLOCK_MECE_VALIDATION.md`

---

### Story E2: Block Correlation Matrix (3 pts)
**As a** product owner
**I want** to understand correlations between the 12 blocks
**So that** we can identify redundant blocks and leading indicators

**Acceptance Criteria**:
- [ ] Design correlation analysis methodology for 12 blocks
- [ ] Create sample question set (24 core questions, 2 per block)
- [ ] Plan data collection strategy (pilot with 50+ respondents)
- [ ] Define acceptable correlation thresholds (r < 0.7 for distinct blocks)
- [ ] Document expected correlation patterns

**Expected Correlation Matrix** (12×12):
```
         EXE   DEC   ADP   RES   FIN   OPS   PEO   QUA   MKT   DAT   STR   LRN
EXE     1.00  0.55  0.40  0.35  0.25  0.60  0.30  0.50  0.20  0.35  0.30  0.35
DEC     0.55  1.00  0.50  0.30  0.30  0.45  0.25  0.40  0.25  0.40  0.45  0.40
ADP     0.40  0.50  1.00  0.35  0.20  0.35  0.35  0.30  0.45  0.35  0.50  0.55
RES     0.35  0.30  0.35  1.00  0.40  0.45  0.25  0.55  0.50  0.30  0.35  0.25
FIN     0.25  0.30  0.20  0.40  1.00  0.50  0.35  0.45  0.30  0.40  0.55  0.25
OPS     0.60  0.45  0.35  0.45  0.50  1.00  0.40  0.65  0.25  0.45  0.35  0.30
PEO     0.30  0.25  0.35  0.25  0.35  0.40  1.00  0.35  0.30  0.25  0.25  0.50
QUA     0.50  0.40  0.30  0.55  0.45  0.65  0.35  1.00  0.35  0.40  0.30  0.30
MKT     0.20  0.25  0.45  0.50  0.30  0.25  0.30  0.35  1.00  0.50  0.55  0.40
DAT     0.35  0.40  0.35  0.30  0.40  0.45  0.25  0.40  0.50  1.00  0.45  0.45
STR     0.30  0.45  0.50  0.35  0.55  0.35  0.25  0.30  0.55  0.45  1.00  0.50
LRN     0.35  0.40  0.55  0.25  0.25  0.30  0.50  0.30  0.40  0.45  0.50  1.00
```

**Red Flags to Watch**: OPS-QUA correlation (expected ~0.65) - may need question differentiation

**Deliverable**: `KARVIA_STRATEGY/2-RESEARCH/SSI_BLOCK_CORRELATION_MATRIX.md`

---

### Story E3: Causal Model for 12 Blocks (3 pts)
**As a** product owner
**I want** to map causal relationships between blocks
**So that** we can identify intervention priorities

**Acceptance Criteria**:
- [ ] Create hypothesized causal DAG for 12 blocks
- [ ] Categorize blocks as leading (cause) vs lagging (effect)
- [ ] Map intervention points for consultants
- [ ] Design validation approach for causal claims

**Hypothesized Causal Model**:
```
┌─────────────────────────────────────────────────────────────────┐
│                   CAUSAL FLOW HYPOTHESIS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LEADING INDICATORS (Upstream)                                  │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                     │
│  │ PEOPLE  │    │LEARNING │    │ CULTURE │                     │
│  │(STR-PEO)│    │(INT-LRN)│    │ (team)  │                     │
│  └────┬────┘    └────┬────┘    └────┬────┘                     │
│       │              │              │                           │
│       └──────────────┼──────────────┘                           │
│                      ▼                                          │
│  PROCESS INDICATORS (Midstream)                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │DECISION │    │EXECUTION│    │OPERATION│    │  DATA   │      │
│  │(SPD-DEC)│    │(SPD-EXE)│    │(STR-OPS)│    │(INT-DAT)│      │
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘      │
│       │              │              │              │            │
│       └──────────────┴──────────────┴──────────────┘            │
│                            ▼                                    │
│  LAGGING INDICATORS (Downstream)                                │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │RESPONSE │    │ QUALITY │    │FINANCIAL│    │STRATEGIC│      │
│  │(SPD-RES)│    │(STR-QUA)│    │(STR-FIN)│    │(INT-STR)│      │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│                                                                  │
│  ADAPTATION & MARKET (Cross-cutting)                            │
│  ┌─────────┐    ┌─────────┐                                     │
│  │ADAPTATION│   │ MARKET  │  ◄── Influenced by all levels      │
│  │(SPD-ADP)│    │(INT-MKT)│                                     │
│  └─────────┘    └─────────┘                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Intervention Priority Matrix**:
| Block | Type | Intervention Priority |
|-------|------|----------------------|
| STR-PEO (People) | Leading | HIGH - Invest first |
| INT-LRN (Learning) | Leading | HIGH - Build capability |
| SPD-DEC (Decision) | Process | MEDIUM - Enable flow |
| STR-OPS (Operational) | Process | MEDIUM - Optimize systems |
| STR-FIN (Financial) | Lagging | LOW - Result of above |
| STR-QUA (Quality) | Lagging | LOW - Result of process |

**Deliverable**: `KARVIA_STRATEGY/2-RESEARCH/SSI_12_BLOCK_CAUSAL_MODEL.md`

---

### Story E4: Block Weighting Algorithm (2 pts)
**As a** product owner
**I want** evidence-based block weights
**So that** dimension and overall scores accurately reflect business health

**Acceptance Criteria**:
- [ ] Research weighting methodologies (equal, regression, expert)
- [ ] Propose equal weighting as default (1/12 per block)
- [ ] Define industry-specific weight adjustments
- [ ] Document weight rationale and configuration options

**Default Weighting** (Equal weights):
```
Each block = 8.33% of total score (1/12)
Each dimension = 33.33% of total (4 blocks × 8.33%)

SPEED (33.33%):
  Execution: 8.33%
  Decision: 8.33%
  Adaptation: 8.33%
  Response: 8.33%

STRENGTH (33.33%):
  Financial: 8.33%
  Operational: 8.33%
  People: 8.33%
  Quality: 8.33%

INTELLIGENCE (33.33%):
  Market: 8.33%
  Data: 8.33%
  Strategic: 8.33%
  Learning: 8.33%
```

**Industry Adjustments** (Optional):
| Industry | Weight Adjustments |
|----------|-------------------|
| Wellness | People +3%, Financial -3% |
| Consulting | Strategic +3%, Operational -3% |
| Professional | Quality +3%, Adaptation -3% |

**Deliverable**: `KARVIA_STRATEGY/2-RESEARCH/SSI_BLOCK_WEIGHTING_ALGORITHM.md`

---

## Dependencies

| Epic | Depends On | Status |
|------|-----------|--------|
| Epic A | None | Ready |
| Epic B | Epic A (questions) | Blocked by A |
| Epic C | Epic B (APIs) | Blocked by B |
| Epic D | Epic A (model) | Blocked by A |
| Epic E | None (research) | Ready - Can run in parallel |

---

## Implementation Order

```
Week 1: Epic A (Data Model & Questions) + Epic E Start
├── A1: Model extension (Day 1)
├── A2: Pillar config (Day 1)
├── A3: Core questions seed (Day 2)
├── A4: Role questions seed (Day 2-3)
├── A5: Function questions seed (Day 3)
└── E1: MECE research kickoff (parallel)

Week 2: Epic B (Assessment Flow) + Epic E Continue
├── B1: Question selection API (Day 4-5)
├── B2: Pillar scoring service (Day 5)
├── B3: Smart template generation (Day 6-7)
├── B4: Results with pillars (Day 7)
└── E2: Correlation analysis (parallel, data-dependent)

Week 3: Epic C (Frontend UX) + Epic E Continue
├── C1: Hub integration (Day 8)
├── C2: Builder page (Day 8-10)
├── C3: Recipient flow (Day 10-11)
└── E3: Causal model development (parallel)

Week 4: Epic D + Epic E + Testing
├── D1: Industry API (Day 11)
├── D2: Variant management (Day 12)
├── D3: Analytics (Day 12)
├── E4: Weighting algorithm research (Day 12-13)
└── Testing & polish (Day 13-15)
```

**Note**: Epic E (Research) runs in parallel with development epics. Research findings may inform future sprints but won't block Sprint 9 delivery.

---

## Technical Decisions

### 1. Single Question Collection vs Separate
**Decision**: Single `AssessmentQuestion` collection with `pillar` and `module` fields
**Rationale**:
- Reuses existing model (95% code reuse)
- Simpler queries
- Backward compatible with SSI questions

### 2. Scoring Service Extension
**Decision**: Create `PillarScoringService` that extends `SSIScoringService`
**Rationale**:
- SSIScoringService is already dimension-agnostic
- Just need to add pillar metadata
- Backward compatible

### 3. Template Type Discrimination
**Decision**: Add `template_type: 'ssi' | 'modular'` to AssessmentTemplate
**Rationale**:
- Allows both template types in same collection
- Frontend can render appropriate UI based on type

### 4. Industry Variants Storage
**Decision**: Store variants in question document, not separate collection
**Rationale**:
- Simpler queries
- Atomic updates
- No join needed

---

## Reuse Summary

| New Code | Lines | Reused From |
|----------|-------|-------------|
| AssessmentQuestion schema extension | ~50 | Existing model structure |
| PillarScoringService | ~30 | SSIScoringService (100% reuse) |
| pillar-config.js | ~150 | Pattern from categories.js |
| Seed scripts | ~400 | Pattern from seedAssessmentQuestions.js |
| assessment-modular.html | ~500 | Patterns from assessment-hub.html |
| API routes | ~200 | Existing route patterns |
| **Total New Code** | **~1,330 lines** | |

**Estimated 70%+ is patterns/structure reused from existing code.**

---

## Success Criteria

**Development (Epics A-D)**:
- [ ] Consultant can create assessment in <30 seconds (2 clicks)
- [ ] Recipients get role-appropriate questions automatically
- [ ] 7-pillar scores display correctly in results
- [ ] Industry variants work for Wellness, Consulting, Professional
- [ ] Backward compatible with existing SSI assessments
- [ ] All existing tests continue to pass

**Research (Epic E)**:
- [ ] MECE validation report completed with academic citations
- [ ] Correlation matrix generated from sample data
- [ ] Causal hypothesis model documented
- [ ] Weighting algorithm recommendation documented
- [ ] Research deliverables in KARVIA_STRATEGY/2-RESEARCH/

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Model changes break existing data | Add fields only, don't modify existing |
| Scoring differences SSI vs Pillar | Test extensively, same algorithms |
| UX too complex | User testing with 3 consultants |
| Question quality | Review by domain experts |

---

## Decisions Made (December 4, 2025)

| Question | Decision | Rationale |
|----------|----------|-----------|
| **Framework structure** | 12-block MECE (4 per SSI dimension) | Consolidated from 19 overlapping categories |
| **Template builder UX** | Option C: Three-Tier Cascade | Matches Core → Function → Team hierarchy |
| **Core questions** | Mandatory (24Q = 2 per block) | Ensures complete 12-block coverage for all |
| **Function detection** | Auto-detect from user profile | Reduces friction, uses role/department data |
| **Minimum questions** | 2 per block (Core), 6 total (Function) | Statistical reliability + depth without fatigue |
| **Industry variants** | Same structure, different wording | Maintains comparability across industries |
| **Industry selector** | Always ask (not auto-detect) | Company profile may not be reliable |
| **Variant fallback** | Show base question if no variant | Never skip questions |

## Resolved Open Questions

1. ~~**Default industry**: Should we auto-detect from company profile or always ask?~~
   - **Decision**: Always ask. Company profile industry may be outdated or missing.

2. ~~**Function tagging**: How do users tag themselves (self-select vs admin assigns)?~~
   - **Decision**: Auto-detect from `user.role` and `user.department`. Manual override available.

3. ~~**Variant fallback**: If no variant exists, show base question or skip?~~
   - **Decision**: Show base question. Never skip - maintains block coverage.

## Remaining Open Questions

1. **Team questions toggle**: Should Team tier be opt-in per assessment or company-wide setting?
2. **Block preview depth**: How many sample questions to show in block preview modal?
3. **Results visualization**: 12-block radar chart vs 3-dimension with drill-down?

---

*Created: December 3, 2025*
*Updated: December 4, 2025*
*Status: Planning Complete - Key Decisions Made - Ready for Sprint 9*
