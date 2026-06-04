# KARVIA OKR - MVP TECHNICAL ARCHITECTURE

<!-- @GENOME T2-ARC-010 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding | linked:/strategy -->

**Document Version**: 5.0 (Modular Block Architecture)
**Date**: October 23, 2025
**Launch Target**: January 31, 2026
**Timeline**: 12 Weeks (Post-Week 0)
**Status**: Implementation Ready

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Architectural Philosophy](#architectural-philosophy)
3. [System Overview](#system-overview)
4. [The 7 Modular Blocks](#the-7-modular-blocks)
5. [The 6 Backend Engines](#the-6-backend-engines)
6. [Database Architecture](#database-architecture)
7. [API Architecture](#api-architecture)
8. [Feature Flag System](#feature-flag-system)
9. [Authentication & Authorization](#authentication--authorization)
10. [Data Flow & Integration](#data-flow--integration)
11. [Deployment Architecture](#deployment-architecture)
12. [Security Architecture](#security-architecture)
13. [Performance & Scalability](#performance--scalability)
14. [Technology Stack](#technology-stack)
15. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 EXECUTIVE SUMMARY

Karvia OKR is a **modular OKR platform** built on a "Lego Blocks" architecture where each component can be independently enabled/disabled via feature flags. The platform works standalone for solo users (Block 1 only) and scales to enterprise teams with optional IAM, assessments, AI generation, and predictive analytics.

### **Core Architecture Principles**

1. **Modular Design**: 7 independent blocks, each enhancing the platform without breaking core functionality
2. **Graceful Degradation**: All blocks have fallback behavior when disabled
3. **Microservice Engines**: 6 backend services handle specialized operations
4. **Feature Flag Driven**: Runtime configuration without code changes
5. **Shared Model Package**: Single source of truth for data schemas
6. **API-First Design**: RESTful APIs enable independent block communication

### **What Makes Karvia Unique**

**KARVIA PRO** (MVP - 12 Weeks):
- Fully functional OKR platform (7 modular blocks)
- 6 microservice engines (IAM, Assessment, Planner, Scoring, Observer, Tracking)
- Works standalone for solo users OR scales to enterprise teams
- Assessment-driven OKR generation (LLM-powered with template fallback)
- Complete company/team management (optional)

**iBRAIN** (Post-MVP Enhancement):
- Intelligence layer that enhances existing 6 engines
- Behavioral nudging ("Task overdue - need help?")
- Predictive analytics (78% risk of failure)
- Pattern detection (velocity dropped 20%)
- AI coaching conversations

---

## 🧩 ARCHITECTURAL PHILOSOPHY

### **Modular "Lego Blocks" Design**

**Core Principle**: Block 1 (Core Execution) works with **ZERO** other blocks enabled. Every additional block is optional and can be enabled/disabled via feature flags.

```
┌─────────────────────────────────────────┐
│        BLOCK 1: CORE EXECUTION          │
│     (Individual OKR Management)         │
│         ✅ ALWAYS WORKS                 │
└─────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼────┐  ┌────▼────┐
│BLOCK 2 │  │BLOCK 3  │  │BLOCK 4  │
│  IAM   │  │Assessment│  │AI OKR  │
│Optional│  │Optional │  │Optional │
└────────┘  └─────────┘  └─────────┘
    │             │             │
    └─────────────┼─────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼────┐  ┌────▼────┐
│BLOCK 5 │  │BLOCK 6  │  │BLOCK 7  │
│Progress│  │Bulk Ops │  │Permissions│
│Optional│  │Optional │  │Optional │
└────────┘  └─────────┘  └─────────┘
```

### **Why This Matters**

1. **Solo Users**: Get immediate value without complex setup (Block 1 only)
2. **Companies**: Start simple, add complexity later (progressive enhancement)
3. **External Parties**: Deploy only needed blocks (customizable)
4. **Independent Iteration**: Each block can be improved without affecting others
5. **No Feature Interdependencies**: Faster development and testing

### **Graceful Degradation Pattern**

Every optional block follows this pattern:

```javascript
// Example: AI OKR Generation (Block 4)
if (FEATURE_FLAGS.AI_ENGINE) {
  // Show "Generate OKRs" button
  showAIGenerationButton();
} else {
  // Hide button, show manual OKR creation only
  hideAIGenerationButton();
}
```

When disabled:
- **UI**: Feature controls hidden from navigation
- **API**: Endpoints return 404 with clear message
- **Data**: Optional fields remain null (backward compatible)
- **User Experience**: Platform works normally without the feature

---

## 🏛️ SYSTEM OVERVIEW

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│  (Static HTML, Vanilla JS, CSS - No Framework)         │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Dashboard │ │Objectives│ │Assessment│ │   Team   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└───────┼────────────┼─────────────┼────────────┼─────────┘
        │            │             │            │
        └────────────┴─────────────┴────────────┘
                     │
        ┌────────────▼────────────┐
        │   SERVER LAYER (Node.js) │
        │  ┌─────────────────────┐ │
        │  │ Feature Flags       │ │
        │  │ Authentication      │ │
        │  │ Route Handlers      │ │
        │  └─────────────────────┘ │
        └────────────┬──────────────┘
                     │
        ┌────────────▼────────────┐
        │  6 MICROSERVICE ENGINES  │
        │                          │
        │  ┌─────┐  ┌──────────┐  │
        │  │ IAM │  │Assessment│  │
        │  │8081 │  │   8082   │  │
        │  └─────┘  └──────────┘  │
        │                          │
        │  ┌────────┐  ┌────────┐ │
        │  │Planner │  │Scoring │ │
        │  │ 8083   │  │ 8084   │ │
        │  └────────┘  └────────┘ │
        │                          │
        │  ┌────────┐  ┌────────┐ │
        │  │Observer│  │Tracking│ │
        │  │ 8085   │  │ 8086   │ │
        │  └────────┘  └────────┘ │
        └────────────┬──────────────┘
                     │
        ┌────────────▼────────────┐
        │   DATA LAYER            │
        │  ┌─────────────────────┐│
        │  │  MongoDB (Primary)  ││
        │  └─────────────────────┘│
        │  ┌─────────────────────┐│
        │  │  Redis (Caching)    ││
        │  └─────────────────────┘│
        └──────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │  EXTERNAL SERVICES      │
        │  ┌─────────────────────┐│
        │  │  OpenAI GPT-4       ││
        │  │  (Customer's Key)   ││
        │  └─────────────────────┘│
        │  ┌─────────────────────┐│
        │  │  Email Service      ││
        │  │  (Mailjet/SendGrid) ││
        │  └─────────────────────┘│
        └──────────────────────────┘
```

### **Request Flow Example**

**Scenario**: Manager creates a goal from a key result

```
1. Frontend: POST /api/goals
   ↓
2. Server: Authenticate JWT → Check IAM_BLOCK flag → Validate payload
   ↓
3. Planner Engine (8083): Create Goal record
   ↓
4. Scoring Engine (8084): Calculate parent Key Result progress
   ↓
5. Observer Engine (8085): Log activity
   ↓
6. MongoDB: Persist Goal + Update KeyResult
   ↓
7. Response: 201 Created with Goal object
   ↓
8. Frontend: Update UI, show success message
```

---

## 🎯 THE 7 MODULAR BLOCKS

### **Block 1: Core Execution (REQUIRED)** ✅

**What It Does**: Individual OKR management that works completely standalone.

**Features**:
- Create objectives with key results
- Create goals linked to objectives (optional parent)
- Create tasks linked to goals (optional parent)
- Update progress (manual)
- View personal dashboard
- Basic authentication (email/password)

**Works Without**:
- ❌ No company required
- ❌ No teams required
- ❌ No assessments required
- ❌ No AI required
- ❌ No other users required

**Database Tables**:
- `users` (authentication)
- `objectives` (quarterly goals)
- `key_results` (measurable outcomes)
- `goals` (weekly deliverables)
- `tasks` (daily actions)

**API Endpoints**:
- POST/GET/PUT/DELETE `/api/objectives`
- POST/GET/PUT/DELETE `/api/goals`
- POST/GET/PUT/DELETE `/api/tasks`

**Feature Flag**: `CORE_EXECUTION` (always `true`)

**Status**: Week 1-6 (mostly complete, Week 6 frontend pending)

---

### **Block 2: IAM - Identity & Access Management (OPTIONAL)** 🔐

**What It Does**: Multi-user companies with role-based access control.

**Features**:
- Company creation (name, industry, size, archetype, strategic focus)
- Team structure (multiple teams per company)
- 5 roles: Owner, Manager, Employee, Consultant, Super Admin
- Individual invitation system (email-based, one-at-a-time)
- Team assignment and filtering
- Company-level data isolation
- Multi-company access (consultants)

**Enhancement to Core**:
```javascript
// Additive schema changes (backward compatible)
Objective.team_id = ObjectId; // NEW (optional)
Objective.company_id = ObjectId; // NEW (optional)
Goal.team_id = ObjectId; // NEW (optional)
Goal.company_id = ObjectId; // NEW (optional)
Task.team_id = ObjectId; // NEW (optional)
Task.company_id = ObjectId; // NEW (optional)
User.companies = [{ company_id: ObjectId, role: String }]; // NEW (optional)
```

**Graceful Degradation**:
- If disabled: Team filters hidden from UI
- If disabled: Users work as solo accounts
- If disabled: No company dropdown

**Database Tables**:
- `companies` (new)
- `teams` (enhanced with `company_id`)
- `invitations` (enhanced with `recipient_type`)

**API Endpoints**:
- POST/GET/PUT/DELETE `/api/companies`
- POST/GET/PUT/DELETE `/api/teams`
- POST/GET/PUT/DELETE `/api/invitations`

**Feature Flag**: `IAM_BLOCK` (default: `true`)

**Status**: Week 5 partial (teams exist), Week 7 complete (companies, bulk ops)

---

### **Block 3: Assessment System (OPTIONAL)** 📊

**What It Does**: Strategic questionnaires with dynamic scoring.

**Assessment Types** (Enum):
- **SSI** (Speed/Strength/Intelligence) - default, already built
- 360 Feedback (future)
- Skills Assessment (future)
- Custom (admin-defined dimensions, future)

**Features**:
- Multi-level assessments (individual → team → org)
- Dynamic weighted scoring (consultants adjust weights)
- Question bank with configurable dimensions
- Assessment results dashboard
- Weak area identification
- Feeds AI OKR Engine (Block 4)

**Multi-Level Aggregation** (100% Preserved):
```
Individual Assessments (30-50 questions)
    ↓ (weighted average)
Team-Level Scores (avg of team members)
    ↓ (weighted average)
Organization-Level SSI (avg of all teams)
```

**Database Tables**:
- `assessments` (templates)
- `assessment_results` (individual responses)
- `assessment_templates` (question banks)

**API Endpoints**:
- POST/GET/PUT/DELETE `/api/assessments`
- POST `/api/assessments/:id/submit`
- GET `/api/assessments/:id/results`
- GET `/api/assessments/:id/weak-areas`

**Feature Flag**: `ASSESSMENT_BLOCK` (default: `true`)

**Status**: Week 4 complete (Assessment Hub)

---

### **Block 4: AI OKR Engine (OPTIONAL)** 🤖

**What It Does**: LLM-powered OKR generation from assessment data.

**Features**:
- Report generator (assessment data → structured text report)
- Prompt builder (report + company context + custom instructions → AI prompt)
- Consultant-editable prompts (add focus areas, adjust tone, specify timeline)
- OpenAI GPT-4 integration (structured JSON output)
- Response parser (JSON → Objective/KeyResult models)
- Template fallback (when AI unavailable)

**Architecture**:
```javascript
Assessment Results
    ↓ (Report Generator)
Structured Text Report
    ↓ (Prompt Builder)
AI Prompt (4000 char max)
    ↓ (OpenAI GPT-4)
Structured JSON Output
    ↓ (Response Parser)
Objective + KeyResult Models
    ↓ (Database)
Saved to MongoDB
```

**Fallback Logic**:
```javascript
async function generateOKRs(assessment_id) {
  try {
    // Try OpenAI first (if AI_ENGINE enabled and key exists)
    if (FEATURE_FLAGS.AI_ENGINE && process.env.OPENAI_API_KEY) {
      return await openaiService.generate(assessment_id);
    } else {
      throw new Error('AI_ENGINE disabled or no API key');
    }
  } catch (error) {
    // Fall back to template-based generation
    console.warn('OpenAI failed, using template fallback:', error);
    return await templateGenerator.generate(assessment_id);
  }
}
```

**Graceful Degradation**:
- If disabled: No "Generate OKRs" button
- If OpenAI fails: Uses template-based generation
- If no assessment: Manual OKR creation only

**Dependencies**:
- OpenAI API (customer's key)
- Redis (optional - in-memory fallback)

**API Endpoints**:
- POST `/api/ai-okr/generate` (generates from assessment)
- POST `/api/ai-okr/regenerate` (with custom prompt)

**Feature Flag**: `AI_ENGINE` (default: `true`, but requires OpenAI key)

**Status**: Week 4 basic (template-based), Week 7.5 enhance (real LLM)

---

### **Block 5: Progress Rollup (OPTIONAL)** 📈

**What It Does**: Automated progress aggregation across hierarchy.

**Features**:
- Task progress → Goal progress (auto-calculated)
- Goal progress → Key Result progress (auto-calculated)
- Key Result progress → Objective progress (auto-calculated)
- Team-level rollup (if IAM enabled)
- Org-level rollup (if IAM enabled)

**Progress Calculation**:
```javascript
// Task progress → Goal progress
goal.progress_percentage = (completed_tasks / total_tasks) * 100

// Goal progress → Key Result progress
key_result.progress_percentage = average(goal.progress_percentage for all goals)

// Key Result → Objective progress
objective.progress_percentage = average(key_result.progress_percentage for all KRs)

// Team rollup (if IAM enabled)
team.progress_percentage = average(team_member_objectives.progress_percentage)

// Org rollup (if IAM enabled)
org.progress_percentage = average(all_team_progress)
```

**Implementation**:
```javascript
// Post-save hooks on Task model
TaskSchema.post('save', async function() {
  if (FEATURE_FLAGS.PROGRESS_ROLLUP && this.goal_id) {
    await rollupService.updateGoalProgress(this.goal_id);
  }
});
```

**Graceful Degradation**:
- If disabled: Manual progress updates only
- If disabled: No automatic rollup

**Feature Flag**: `PROGRESS_ROLLUP` (default: `true`)

**Status**: Week 8 (post-save hooks)

---

### **Block 6: Bulk Operations (OPTIONAL)** 📧

**What It Does**: Bulk invitation and assessment distribution.

**Features**:
- Bulk invitation system:
  - Mode 1: Entire Company (invite all existing members)
  - Mode 2: Specific Teams (select teams, invite all members)
  - Mode 3: Individual Emails (CSV upload, existing flow)
- Preview: "27 invitations will be sent"
- Bulk assessment sending (same modes)
- Email domain auto-grouping

**Requirements**:
- Requires Block 2 (IAM) for company/team context

**API Endpoints**:
- POST `/api/invitations/bulk` (bulk invitations)
- POST `/api/assessments/bulk-send` (bulk assessment distribution)

**Feature Flag**: `BULK_OPS` (default: `true`)

**Graceful Degradation**:
- If disabled: Individual invitation only (existing flow)

**Status**: Week 7 (new feature)

---

### **Block 7: Permission Rules Engine (OPTIONAL)** 🔒

**What It Does**: Admin-configurable permission rules stored in database.

**Features**:
- Admin UI to create/edit/delete permission rules
- Dynamic enforcement at runtime (not hardcoded)
- Rule examples:
  - "Only managers can create objectives"
  - "Employees can only view their assigned tasks"
  - "Consultants have read-only access"
- Rule conditions: role-based, resource-based, field-based
- Override system defaults

**PermissionRule Schema**:
```javascript
{
  business_id: ObjectId,
  rule_name: String, // "Manager-only objective creation"
  resource: "objective" | "goal" | "task",
  action: "create" | "read" | "update" | "delete",
  allowed_roles: ["MANAGER", "OWNER"],
  denied_roles: ["EMPLOYEE"],
  conditions: {
    field: "owner_id",
    operator: "equals",
    value: "${current_user_id}"
  },
  override_default: Boolean, // true = override system RBAC
  is_active: Boolean
}
```

**Enforcement Middleware**:
```javascript
async function checkPermissions(req, res, next) {
  if (!FEATURE_FLAGS.PERMISSION_RULES) {
    // Fall back to default RBAC
    return defaultRBAC(req, res, next);
  }

  const rules = await PermissionRule.find({
    business_id: req.user.business_id,
    resource: req.params.resource,
    action: req.method.toLowerCase(),
    is_active: true
  });

  // Evaluate rules in priority order
  const allowed = evaluateRules(rules, req.user);

  if (!allowed) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  next();
}
```

**Feature Flag**: `PERMISSION_RULES` (default: `false`)

**Graceful Degradation**:
- If disabled: Uses default RBAC (hardcoded in middleware)

**Status**: Week 10 (new feature)

---

### **Admin UI Layer** (Not a Separate Block)

Admin functionality (feature flags, permission management, iBrain toggle) will be built as a consolidated management layer in Week 11, but is **NOT** a separate block. It's a UI for managing the 7 blocks above.

**Features**:
- Feature flag toggles (enable/disable blocks)
- Permission rule management (Block 7 UI)
- iBrain toggle (for future)
- User management dashboard
- System health monitoring

**Status**: Week 11 (consolidate existing scattered features)

---

## 🏛️ THE 6 BACKEND ENGINES

### **Architecture Overview**

The 6 microservice engines are the backend infrastructure that **ALL 7 blocks access**. In MVP, engines handle CRUD operations with basic business logic. Post-MVP, iBrain adds intelligence/nudging to these engines.

```
┌─────────────────────────────────────────┐
│         7 Frontend Blocks               │
│    (UI modules, can enable/disable)     │
└──────────────┬──────────────────────────┘
               │ ALL BLOCKS ACCESS
               ▼
┌─────────────────────────────────────────┐
│    6 Backend Engines (MVP: Basic)       │
│  IAM | Assessment | Planner | Scoring   │
│       Observer | Tracking               │
└──────────────┬──────────────────────────┘
               │ POST-MVP
               ▼
┌─────────────────────────────────────────┐
│       iBrain Intelligence Layer         │
│  (Nudges, predictions, coaching)        │
└─────────────────────────────────────────┘
```

### **Engine Breakdown**

| Engine | Port | MVP Role | Post-MVP + iBrain |
|--------|------|----------|-------------------|
| **IAM** | 8081 | Auth, user/company/team management, invitations, bulk invite | + Engagement tracking, stuck user detection, access pattern analysis |
| **Assessment** | 8082 | SSI scoring, multi-level aggregation, weak area calculation | + Comparative analysis, industry benchmarks, improvement nudges |
| **Planner** | 8083 | OKR generation (LLM + templates), goal/task CRUD | + Continuous optimization, pattern-based suggestions, success probability |
| **Scoring** | 8084 | Progress calculation, health scoring, aggregation | + Risk prediction (78% failure risk), early warning nudges |
| **Observer** | 8085 | Activity logging, audit trails, change tracking | + Pattern detection, anomaly alerts, behavior analysis |
| **Tracking** | 8086 | Time tracking, progress updates, task status | + Velocity analysis, stall detection, intervention suggestions |

### **Shared Models Package**

**Critical Architectural Decision**: All engines use `@karvia/shared-models` instead of `../../server/models`.

**Why**:
- **Decouple engines** from server filesystem
- **Enable independent deployment** (external party can deploy engines separately)
- **Prevent schema drift** (single source of truth)
- **Versioning** (semver for model changes)

**Models in Shared Package**:
```
@karvia/shared-models/
├── models/
│   ├── Business.js
│   ├── User.js
│   ├── Company.js (new - Week 7)
│   ├── Team.js (enhanced - Week 7)
│   ├── Objective.js
│   ├── KeyResult.js
│   ├── Goal.js
│   ├── Task.js
│   ├── Invitation.js (enhanced - Week 7)
│   ├── Assessment.js
│   ├── AssessmentTemplate.js
│   ├── AssessmentResult.js
│   ├── PermissionRule.js (new - Week 10)
│   ├── Activity.js
│   └── Update.js
├── package.json
└── README.md
```

**Installation**:
```bash
# In each engine directory
npm install @karvia/shared-models@latest
```

**Usage**:
```javascript
// engines/planner/routes/objectives.js
const { Objective, KeyResult } = require('@karvia/shared-models');

router.post('/objectives', async (req, res) => {
  const objective = new Objective(req.body);
  await objective.save();
  res.status(201).json(objective);
});
```

---

## 💾 DATABASE ARCHITECTURE

### **MongoDB Collections**

**Core Collections** (Block 1):
```javascript
users {
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  name: String,
  role: String, // "EMPLOYEE" | "MANAGER" | "OWNER" | "CONSULTANT" | "SUPER_ADMIN"
  business_id: ObjectId, // Legacy field
  companies: [{ // NEW (Block 2 - optional)
    company_id: ObjectId,
    role: String,
    joined_at: Date
  }],
  created_at: Date,
  updated_at: Date
}

objectives {
  _id: ObjectId,
  user_id: ObjectId,
  business_id: ObjectId, // Legacy
  company_id: ObjectId, // NEW (Block 2 - optional)
  team_id: ObjectId, // NEW (Block 2 - optional)
  title: String,
  description: String,
  quarter: Number, // 1-4
  year: Number,
  status: String, // "draft" | "active" | "completed" | "at_risk" | "failed"
  progress_percentage: Number, // 0-100
  key_results: [ObjectId], // References
  created_at: Date,
  updated_at: Date
}

goals {
  _id: ObjectId,
  user_id: ObjectId,
  objective_id: ObjectId,
  key_result_id: ObjectId,
  company_id: ObjectId, // NEW (Block 2 - optional)
  team_id: ObjectId, // NEW (Block 2 - optional)
  title: String,
  description: String,
  week_number: Number,
  quarter: Number,
  due_date: Date,
  status: String, // "not_started" | "in_progress" | "completed" | "at_risk" | "blocked"
  progress_percentage: Number, // 0-100
  tasks: [ObjectId], // References
  created_at: Date,
  updated_at: Date
}

tasks {
  _id: ObjectId,
  user_id: ObjectId,
  goal_id: ObjectId,
  company_id: ObjectId, // NEW (Block 2 - optional)
  team_id: ObjectId, // NEW (Block 2 - optional)
  title: String,
  description: String,
  assigned_to: ObjectId,
  due_date: Date,
  estimated_hours: Number,
  priority: String, // "low" | "medium" | "high" | "urgent"
  status: String, // "todo" | "in_progress" | "completed" | "blocked"
  completion_notes: String,
  created_at: Date,
  updated_at: Date
}
```

**IAM Collections** (Block 2):
```javascript
companies { // NEW
  _id: ObjectId,
  name: String (unique),
  industry: String,
  size: String, // "1-10" | "11-50" | "51-200" | "201-500" | "500+"
  archetype: String, // One of 16 business archetypes
  strategic_focus: [String], // 3-5 selections from 24 focus areas
  owner_id: ObjectId,
  created_at: Date,
  updated_at: Date
}

teams {
  _id: ObjectId,
  business_id: ObjectId, // Legacy
  company_id: ObjectId, // NEW (required when Block 2 enabled)
  name: String,
  description: String,
  department: String,
  manager_id: ObjectId,
  members: [{
    user_id: ObjectId,
    role: String, // "MANAGER" | "EMPLOYEE"
    joined_at: Date
  }],
  created_at: Date,
  updated_at: Date
}

invitations {
  _id: ObjectId,
  business_id: ObjectId, // Legacy
  company_id: ObjectId, // NEW (Block 2)
  email: String,
  role: String, // "EMPLOYEE" | "MANAGER" | "OWNER" | "CONSULTANT"
  token: String (unique, 32-byte hex),
  status: String, // "pending" | "accepted" | "expired" | "cancelled"
  recipient_type: String, // "individual" | "team" | "company" (Block 6)
  expires_at: Date, // 7 days from creation
  invited_by: ObjectId,
  created_at: Date,
  updated_at: Date
}
```

**Assessment Collections** (Block 3):
```javascript
assessments {
  _id: ObjectId,
  business_id: ObjectId,
  company_id: ObjectId, // NEW (Block 2 - optional)
  template_id: ObjectId,
  name: String,
  assessment_type: String, // "SSI" | "360" | "Skills" | "Custom"
  dimensions: [{ // Dynamic dimensions (not hardcoded SSI)
    name: String, // "Speed" | "Strength" | "Intelligence" | custom
    category: String,
    weight: Number, // 0.0-1.0, consultant-adjustable
    description: String,
    questions: [ObjectId]
  }],
  target_audience: String, // "individual" | "team" | "org" | "role"
  sent_to: [ObjectId], // User IDs
  completion_rate: Number, // 0-100
  created_at: Date,
  updated_at: Date
}

assessment_results {
  _id: ObjectId,
  assessment_id: ObjectId,
  user_id: ObjectId,
  team_id: ObjectId, // For team-level aggregation
  responses: [{
    question_id: ObjectId,
    answer: Number, // 1-10 scale
    dimension: String
  }],
  scores: {
    overall: Number, // 0-100
    dimensions: [{ // Calculated from weighted responses
      name: String,
      score: Number // 0-100
    }]
  },
  weak_areas: [{ // Scores < 60
    dimension: String,
    score: Number,
    recommendations: [String]
  }],
  submitted_at: Date,
  created_at: Date
}
```

**Permission Collections** (Block 7):
```javascript
permission_rules { // NEW
  _id: ObjectId,
  business_id: ObjectId,
  company_id: ObjectId,
  rule_name: String,
  resource: String, // "objective" | "goal" | "task"
  action: String, // "create" | "read" | "update" | "delete"
  allowed_roles: [String], // ["MANAGER", "OWNER"]
  denied_roles: [String], // ["EMPLOYEE"]
  conditions: {
    field: String, // "owner_id"
    operator: String, // "equals" | "not_equals" | "in" | "not_in"
    value: String // "${current_user_id}" | static value
  },
  override_default: Boolean,
  is_active: Boolean,
  priority: Number, // Evaluation order
  created_at: Date,
  updated_at: Date
}
```

### **Database Indexes**

**Critical Indexes for Performance**:
```javascript
// Users
users.createIndex({ email: 1 }, { unique: true });
users.createIndex({ "companies.company_id": 1 }); // Block 2

// Objectives
objectives.createIndex({ user_id: 1, quarter: 1, year: 1 });
objectives.createIndex({ company_id: 1, team_id: 1 }); // Block 2
objectives.createIndex({ status: 1 });

// Goals
goals.createIndex({ user_id: 1, week_number: 1, quarter: 1 });
goals.createIndex({ objective_id: 1 });
goals.createIndex({ key_result_id: 1 });
goals.createIndex({ company_id: 1, team_id: 1 }); // Block 2

// Tasks
tasks.createIndex({ assigned_to: 1, status: 1 });
tasks.createIndex({ goal_id: 1 });
tasks.createIndex({ due_date: 1 });
tasks.createIndex({ company_id: 1, team_id: 1 }); // Block 2

// Companies (Block 2)
companies.createIndex({ name: 1 }, { unique: true });

// Invitations
invitations.createIndex({ token: 1 }, { unique: true });
invitations.createIndex({ email: 1, status: 1 });
invitations.createIndex({ expires_at: 1 }); // TTL index for auto-cleanup

// Assessments
assessments.createIndex({ business_id: 1, assessment_type: 1 });
assessment_results.createIndex({ assessment_id: 1, user_id: 1 });
assessment_results.createIndex({ team_id: 1 }); // Team-level aggregation
```

### **Redis Cache Strategy**

**Cached Data** (5-minute TTL):
```javascript
// Dashboard data
cache.set(`dashboard:${user_id}`, dashboardData, 300);

// Assessment results
cache.set(`assessment_results:${assessment_id}:${user_id}`, results, 300);

// OpenAI generated OKRs (24-hour TTL)
cache.set(`ai_okrs:${assessment_id}`, generatedOKRs, 86400);

// Feature flags (1-hour TTL)
cache.set(`feature_flags:${business_id}`, flags, 3600);
```

---

## 🔌 API ARCHITECTURE

### **API Principles**

- **RESTful Design**: GET, POST, PUT, DELETE
- **JSON Format**: All requests/responses use JSON
- **JWT Authentication**: All protected routes require JWT token
- **Rate Limiting**: 100 requests/minute per user
- **Pagination**: Max 50 items per page
- **Error Responses**: Consistent format

**Error Response Format**:
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details",
  "code": "ERROR_CODE"
}
```

**Success Response Format**:
```json
{
  "success": true,
  "data": { /* payload */ },
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 127
  }
}
```

### **Core API Endpoints**

**Authentication** (IAM Engine - Port 8081):
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
POST   /api/auth/refresh           Refresh JWT token
POST   /api/auth/logout            Logout user
```

**Companies** (IAM Engine - Port 8081 - Block 2):
```
POST   /api/companies              Create company
GET    /api/companies/:id          Get company details
PUT    /api/companies/:id          Update company
DELETE /api/companies/:id          Delete company
GET    /api/companies/:id/teams    Get company teams
```

**Teams** (IAM Engine - Port 8081 - Block 2):
```
POST   /api/teams                     Create team
GET    /api/teams/:id                 Get team details
PUT    /api/teams/:id                 Update team
DELETE /api/teams/:id                 Delete team
POST   /api/teams/:id/members         Add member to team
DELETE /api/teams/:id/members/:userId Remove member from team
```

**Invitations** (IAM Engine - Port 8081):
```
POST   /api/invitations               Create invitation
POST   /api/invitations/bulk          Bulk invitations (Block 6)
GET    /api/invitations               List invitations
PUT    /api/invitations/:id/resend    Resend invitation
PUT    /api/invitations/:id/cancel    Cancel invitation
POST   /api/invitations/:token/accept Accept invitation
```

**Objectives** (Planner Engine - Port 8083):
```
POST   /api/objectives                Create objective
GET    /api/objectives                List objectives (filtered by user/team/company)
GET    /api/objectives/:id            Get objective details
PUT    /api/objectives/:id            Update objective
DELETE /api/objectives/:id            Delete objective
POST   /api/objectives/generate       AI generate objectives (Block 4)
```

**Goals** (Planner Engine - Port 8083):
```
POST   /api/goals                     Create goal
GET    /api/goals                     List goals
GET    /api/goals/quarterly           Quarterly goals view
GET    /api/goals/weekly              Weekly goals view
GET    /api/goals/:id                 Get goal details
PUT    /api/goals/:id                 Update goal
DELETE /api/goals/:id                 Delete goal
```

**Tasks** (Tracking Engine - Port 8086):
```
POST   /api/tasks                     Create task
GET    /api/tasks                     List tasks
GET    /api/tasks/:id                 Get task details
PUT    /api/tasks/:id                 Update task
DELETE /api/tasks/:id                 Delete task
PUT    /api/tasks/:id/complete        Mark task complete
POST   /api/tasks/suggest             AI suggest tasks (Block 4)
```

**Assessments** (Assessment Engine - Port 8082 - Block 3):
```
POST   /api/assessments               Create assessment
GET    /api/assessments               List assessments
GET    /api/assessments/:id           Get assessment details
POST   /api/assessments/:id/submit    Submit assessment responses
GET    /api/assessments/:id/results   Get assessment results
GET    /api/assessments/:id/weak-areas Get weak area analysis
POST   /api/assessments/invite        Invite users to assessment
```

**Feature Flags**:
```
GET    /api/feature-flags             Get enabled feature flags
```

### **API Authentication Flow**

```javascript
// 1. User Login
POST /api/auth/login
{
  "email": "sarah@acme.com",
  "password": "SecurePass123"
}

// 2. Server Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "e3f2a1b4c5d6...",
    "user": {
      "id": "64f1a2b3c4d5e6f7",
      "email": "sarah@acme.com",
      "name": "Sarah Chen",
      "role": "MANAGER",
      "companies": [
        { "company_id": "64f1a2b3c4d5e6f8", "role": "MANAGER" }
      ]
    }
  }
}

// 3. Client stores token in localStorage
localStorage.setItem('auth_token', token);

// 4. All subsequent requests include token
headers: {
  'Authorization': `Bearer ${token}`
}

// 5. JWT Token Structure
{
  "id": "64f1a2b3c4d5e6f7",
  "email": "sarah@acme.com",
  "role": "MANAGER",
  "business_id": "64f1a2b3c4d5e6f8",
  "current_company_id": "64f1a2b3c4d5e6f8", // Block 2
  "exp": 1698765432 // 1 hour expiry
}
```

---

## 🚩 FEATURE FLAG SYSTEM

### **Environment Variables** (`.env` file):
```bash
# Core (always enabled)
ENABLE_CORE_EXECUTION=true

# Optional Blocks
ENABLE_IAM=true                   # Block 2 - Company/Teams
ENABLE_ASSESSMENTS=true           # Block 3 - Assessment System
ENABLE_AI_ENGINE=true             # Block 4 - LLM OKR Generation
ENABLE_PROGRESS_ROLLUP=true       # Block 5 - Automatic aggregation
ENABLE_BULK_OPS=true              # Block 6 - Bulk invitations
ENABLE_PERMISSION_RULES=false     # Block 7 - Admin rules (post-MVP)

# Post-MVP
ENABLE_IBRAIN=false               # Intelligence layer (post-MVP)
```

### **Code Keys** (`config/feature-flags.js`):
```javascript
module.exports = {
  CORE_EXECUTION: true, // always enabled
  IAM_BLOCK: process.env.ENABLE_IAM === 'true',
  ASSESSMENT_BLOCK: process.env.ENABLE_ASSESSMENTS === 'true',
  AI_ENGINE: process.env.ENABLE_AI_ENGINE === 'true',
  PROGRESS_ROLLUP: process.env.ENABLE_PROGRESS_ROLLUP === 'true',
  BULK_OPS: process.env.ENABLE_BULK_OPS === 'true',
  PERMISSION_RULES: process.env.ENABLE_PERMISSION_RULES === 'true',
  IBRAIN: process.env.ENABLE_IBRAIN === 'true'
};
```

### **Frontend Usage**:
```javascript
// Fetch feature flags on app load
const FEATURE_FLAGS = await fetch('/api/feature-flags').then(r => r.json());

// Conditional rendering
if (FEATURE_FLAGS.IAM_BLOCK) {
  showTeamFilter();
  showCompanyDropdown();
}

if (FEATURE_FLAGS.ASSESSMENT_BLOCK) {
  showAssessmentMenuItem();
}

if (FEATURE_FLAGS.AI_ENGINE) {
  showGenerateOKRsButton();
}
```

### **Backend Middleware**:
```javascript
// Protect routes that require specific blocks
function requireFeature(blockName) {
  return (req, res, next) => {
    if (!FEATURE_FLAGS[blockName]) {
      return res.status(404).json({
        success: false,
        message: `Feature '${blockName}' is not enabled`
      });
    }
    next();
  };
}

// Usage
router.post('/api/companies', requireFeature('IAM_BLOCK'), createCompany);
router.post('/api/ai-okr/generate', requireFeature('AI_ENGINE'), generateOKRs);
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### **Authentication Flow**

1. **User Registration** (via invitation token):
   ```javascript
   POST /api/invitations/:token/accept
   {
     "name": "Sarah Chen",
     "password": "SecurePass123"
   }
   ```

2. **JWT Token Generation**:
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign(
     {
       id: user._id,
       email: user.email,
       role: user.role,
       business_id: user.business_id,
       current_company_id: user.companies[0]?.company_id // Block 2
     },
     process.env.JWT_SECRET,
     { expiresIn: '1h' }
   );
   ```

3. **Token Validation Middleware**:
   ```javascript
   async function authenticate(req, res, next) {
     const token = req.headers.authorization?.replace('Bearer ', '');

     if (!token) {
       return res.status(401).json({ error: 'No token provided' });
     }

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       return res.status(401).json({ error: 'Invalid token' });
     }
   }
   ```

### **Authorization (RBAC)**

**Role Hierarchy**:
```
Super Admin (Internal)
    ↓
Company Admin (Owner)
    ↓
Manager
    ↓
Employee

Consultant (Multi-Company Access)
```

**Permission Matrix** (IAM Block Enabled):

| Action | Super Admin | Company Admin | Manager | Employee | Consultant |
|--------|-------------|---------------|---------|----------|------------|
| Take assessment | ✅ | ✅ | ✅ | ✅ | ✅ (for client) |
| View own SSI scores | ✅ | ✅ | ✅ | ✅ | ✅ |
| View team SSI scores | ✅ | ✅ | ✅ (own team) | ❌ | ✅ (all teams) |
| View org SSI scores | ✅ | ✅ | ❌ | ❌ | ✅ |
| Generate OKRs | ✅ | ✅ | ❌ | ❌ | ✅ (for client) |
| Create company | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create teams | ✅ | ✅ | ❌ | ❌ | ❌ |
| Invite users | ✅ | ✅ | ✅ (limited) | ❌ | ❌ |
| Bulk invitations | ✅ | ✅ | ✅ (own team) | ❌ | ✅ |
| Access multiple companies | ✅ | ❌ | ❌ | ❌ | ✅ |

**Authorization Middleware**:
```javascript
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
router.post('/api/companies',
  authenticate,
  authorize(['SUPER_ADMIN', 'OWNER']),
  createCompany
);
```

**Company-Level Data Isolation** (Block 2):
```javascript
async function scopeToCompany(req, res, next) {
  if (!FEATURE_FLAGS.IAM_BLOCK) {
    // Solo user mode, no scoping needed
    return next();
  }

  // Add company_id filter to all queries
  const company_id = req.user.current_company_id;

  req.query.company_id = company_id;

  next();
}

// Usage
router.get('/api/objectives',
  authenticate,
  scopeToCompany,
  async (req, res) => {
    // This query automatically scoped to current company
    const objectives = await Objective.find(req.query);
    res.json(objectives);
  }
);
```

---

## 🔄 DATA FLOW & INTEGRATION

### **Assessment → AI OKR Generation Flow**

```
1. User Completes Assessment (Block 3)
   ↓
   POST /api/assessments/:id/submit
   ↓
2. Assessment Engine (8082) Calculates SSI Scores
   ↓
   - Speed: 6.2/10 (weak)
   - Strength: 7.8/10 (strong)
   - Intelligence: 5.5/10 (critical weakness)
   ↓
3. User Clicks "Generate OKRs" (Block 4)
   ↓
   POST /api/ai-okr/generate { assessment_id }
   ↓
4. Planner Engine (8083) Checks AI_ENGINE Flag
   ↓
   if (FEATURE_FLAGS.AI_ENGINE && OPENAI_API_KEY) {
     ↓
5a. Report Generator Formats Assessment Data
     ↓
     Assessment Report:
     - Intelligence (5.5/10): CRITICAL
       - Weak Questions:
         - "Data-driven decision making": 4/10
         - "Predictive analytics capability": 3/10
         - "Market intelligence gathering": 6/10
     ↓
6a. Prompt Builder Creates AI Prompt
     ↓
     Prompt:
     "Generate 4-6 quarterly objectives for a Startup archetype.
     CRITICAL: Intelligence gap (5.5/10) - prioritize data/analytics.
     Weak areas: data-driven decisions, predictive analytics.
     Strategic focus: Growth, Innovation."
     ↓
7a. OpenAI GPT-4 Generates Structured JSON
     ↓
     {
       "objectives": [
         {
           "title": "Build Data-Driven Decision Culture",
           "rationale": "Addresses critical Intelligence gap (5.5/10)",
           "focusArea": "Intelligence - Data Analytics",
           "keyResults": [
             {
               "description": "Implement analytics dashboard for 10 key metrics",
               "baseline": 0,
               "target": 10,
               "metric": "dashboards"
             },
             ...
           ]
         },
         ...
       ]
     }
     ↓
8a. Response Parser Converts to Models
     ↓
     Objective.create({ title, description, ... })
     KeyResult.create({ description, baseline, target, ... })
     ↓
9a. Return to User
   } else {
     ↓
5b. Fallback: Template Generator
     ↓
     SELECT template WHERE archetype = "Startup"
                       AND weak_dimension = "Intelligence"
     ↓
     Template #12: "Data & Analytics Focus for Startups"
     ↓
9b. Return template-based OKRs to User
   }
   ↓
10. Frontend Displays Generated OKRs
    ↓
    [Edit] [Accept] [Regenerate] buttons
    ↓
11. User Accepts OKRs
    ↓
    POST /api/objectives (creates approved OKRs)
    ↓
12. Objectives Saved to Database
    ↓
    objective.assessment_id = assessment_id (lineage preserved)
```

### **Task Completion → Progress Rollup Flow** (Block 5)

```
1. Employee Marks Task Complete
   ↓
   PUT /api/tasks/:id/complete
   ↓
2. Tracking Engine (8086) Updates Task
   ↓
   task.status = "completed"
   task.save()
   ↓
3. Post-Save Hook Triggers (if PROGRESS_ROLLUP enabled)
   ↓
   TaskSchema.post('save', async function() {
     if (FEATURE_FLAGS.PROGRESS_ROLLUP && this.goal_id) {
       await rollupService.updateGoalProgress(this.goal_id);
     }
   });
   ↓
4. Rollup Service Calculates Goal Progress
   ↓
   const completedTasks = await Task.countDocuments({
     goal_id: goal._id,
     status: "completed"
   });
   const totalTasks = await Task.countDocuments({ goal_id: goal._id });
   goal.progress_percentage = (completedTasks / totalTasks) * 100;
   goal.save(); // Triggers next cascade
   ↓
5. Goal Save Triggers Key Result Rollup
   ↓
   GoalSchema.post('save', async function() {
     if (FEATURE_FLAGS.PROGRESS_ROLLUP && this.key_result_id) {
       await rollupService.updateKeyResultProgress(this.key_result_id);
     }
   });
   ↓
6. Key Result Progress Updated
   ↓
   const goals = await Goal.find({ key_result_id: kr._id });
   const avgProgress = goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length;
   key_result.progress_percentage = avgProgress;
   key_result.save(); // Triggers objective rollup
   ↓
7. Objective Progress Updated
   ↓
   const keyResults = await KeyResult.find({ objective_id: obj._id });
   const avgProgress = keyResults.reduce((sum, kr) => sum + kr.progress_percentage, 0) / keyResults.length;
   objective.progress_percentage = avgProgress;
   objective.save();
   ↓
8. Dashboard Updates Automatically
   ↓
   - Manager sees updated team progress
   - Executive sees updated company progress
   - Employee sees updated objective progress
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

### **Docker Compose Setup**

```yaml
version: '3.8'

services:
  # MongoDB (Primary Database)
  mongodb:
    image: mongo:7.0
    container_name: karvia-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis (Caching)
  redis:
    image: redis:7.2-alpine
    container_name: karvia-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Main Server (Node.js)
  server:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: karvia-server
    ports:
      - "3000:3000"
    volumes:
      - ./server:/app/server
      - ./client:/app/client
      - ./config:/app/config
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=[REDACTED]
      - ENABLE_IAM=${ENABLE_IAM}
      - ENABLE_ASSESSMENTS=${ENABLE_ASSESSMENTS}
      - ENABLE_AI_ENGINE=${ENABLE_AI_ENGINE}
      - ENABLE_PROGRESS_ROLLUP=${ENABLE_PROGRESS_ROLLUP}
      - ENABLE_BULK_OPS=${ENABLE_BULK_OPS}
      - ENABLE_PERMISSION_RULES=${ENABLE_PERMISSION_RULES}
    depends_on:
      - mongodb
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # IAM Engine
  iam-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
    container_name: karvia-iam-engine
    ports:
      - "8081:8081"
    environment:
      - ENGINE_NAME=IAM
      - ENGINE_PORT=8081
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Assessment Engine
  assessment-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
    container_name: karvia-assessment-engine
    ports:
      - "8082:8082"
    environment:
      - ENGINE_NAME=ASSESSMENT
      - ENGINE_PORT=8082
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8082/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Planner Engine
  planner-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
    container_name: karvia-planner-engine
    ports:
      - "8083:8083"
    environment:
      - ENGINE_NAME=PLANNER
      - ENGINE_PORT=8083
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
      - OPENAI_API_KEY=[REDACTED]
    depends_on:
      - mongodb
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8083/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Scoring Engine
  scoring-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
    container_name: karvia-scoring-engine
    ports:
      - "8084:8084"
    environment:
      - ENGINE_NAME=SCORING
      - ENGINE_PORT=8084
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8084/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Observer Engine
  observer-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
    container_name: karvia-observer-engine
    ports:
      - "8085:8085"
    environment:
      - ENGINE_NAME=OBSERVER
      - ENGINE_PORT=8085
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8085/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Tracking Engine
  tracking-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
    container_name: karvia-tracking-engine
    ports:
      - "8086:8086"
    environment:
      - ENGINE_NAME=TRACKING
      - ENGINE_PORT=8086
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8086/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mongodb_data:
  redis_data:
```

### **Deployment Commands**

```bash
# Start all services
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f server

# Stop all services
docker-compose down

# Full reset (delete volumes)
docker-compose down -v
```

---

## 🔒 SECURITY ARCHITECTURE

### **Security Layers**

1. **Authentication**: JWT tokens with 1-hour expiry
2. **Authorization**: Role-based access control (RBAC)
3. **Data Isolation**: Company-level scoping (Block 2)
4. **Input Validation**: All API endpoints validate input
5. **Rate Limiting**: 100 requests/minute per user
6. **HTTPS**: Required for all API calls
7. **CORS**: Configured for allowed origins only
8. **Secrets Management**: All secrets in environment variables

### **Password Security**

```javascript
const bcrypt = require('bcrypt');

// Password hashing (registration)
const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

// Password verification (login)
const isValid = await bcrypt.compare(password, user.password_hash);
```

### **JWT Token Security**

```javascript
// Token generation
const token = jwt.sign(
  payload,
  process.env.JWT_SECRET, // 256-bit secret from environment
  {
    expiresIn: '1h', // 1 hour expiry
    algorithm: 'HS256' // HMAC SHA-256
  }
);

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### **Invitation Token Security**

```javascript
const crypto = require('crypto');

// Generate secure token (32-byte hex)
const token = crypto.randomBytes(32).toString('hex');

// Store hashed token in database (optional - for extra security)
const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
```

### **SQL Injection Prevention**

```javascript
// ✅ SAFE: Mongoose automatically escapes values
const user = await User.findOne({ email: req.body.email });

// ❌ UNSAFE: Never use raw string concatenation
// const user = await User.findOne({ $where: `this.email == '${req.body.email}'` });
```

### **XSS Prevention**

```javascript
// Client-side: Escape user input before rendering
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Use textContent instead of innerHTML
element.textContent = userInput; // Safe
// element.innerHTML = userInput; // Unsafe
```

### **CORS Configuration**

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','), // ['https://karvia.com']
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## ⚡ PERFORMANCE & SCALABILITY

### **Performance Targets**

- **Dashboard Load**: <2 seconds (p90)
- **API Response**: <200ms (p90)
- **Assessment Submission**: <500ms
- **AI OKR Generation**: <30 seconds (p95)
- **Bulk Operations**: 50 invites in <5 seconds

### **Caching Strategy**

```javascript
// Redis caching with 5-minute TTL
const CACHE_TTL = 300; // 5 minutes

async function getCachedData(key, fetchFunction) {
  // Check cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  const data = await fetchFunction();

  // Store in cache
  await redis.setex(key, CACHE_TTL, JSON.stringify(data));

  return data;
}

// Usage
const dashboardData = await getCachedData(
  `dashboard:${user_id}`,
  () => fetchDashboardData(user_id)
);
```

### **Database Query Optimization**

```javascript
// ✅ GOOD: Use indexes, limit fields, pagination
const objectives = await Objective.find({ user_id })
  .select('title description status progress_percentage') // Limit fields
  .limit(50) // Pagination
  .lean(); // Return plain objects (faster)

// ❌ BAD: No indexes, fetch all fields, no limits
const objectives = await Objective.find({ user_id });
```

### **Horizontal Scaling**

```
┌─────────────┐
│ Load Balancer│
│  (Nginx)     │
└──────┬───────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
┌──▼──┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Node1│ │Node2│ │Node3│ │Node4│
│:3000│ │:3000│ │:3000│ │:3000│
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   │       │       │       │
   └───┬───┴───────┴───────┘
       │
   ┌───▼────┐
   │ MongoDB│
   │ Cluster│
   └────────┘
```

### **Monitoring & Alerts**

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    server: 'ok',
    mongodb: await checkMongoDB(),
    redis: await checkRedis(),
    engines: await checkEngines()
  };

  const healthy = Object.values(checks).every(status => status === 'ok');

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    checks
  });
});
```

---

## 💻 TECHNOLOGY STACK

### **Frontend**
- **Core**: Static HTML, Vanilla JavaScript, CSS
- **No Framework**: Lightweight, fast, no build process
- **UI Components**: Reusable components (modals, cards, forms)
- **State Management**: LocalStorage for auth token
- **API Client**: Fetch API
- **Charts**: Chart.js (assessment results, progress visualization)

### **Backend**
- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **CORS**: cors
- **Rate Limiting**: express-rate-limit

### **Database**
- **Primary**: MongoDB 7.0
- **ORM**: Mongoose
- **Caching**: Redis 7.2
- **Indexes**: Compound indexes for performance

### **Microservices**
- **Architecture**: 6 independent engines
- **Communication**: REST APIs (internal)
- **Model Sharing**: @karvia/shared-models npm package

### **External Services**
- **AI**: OpenAI GPT-4 (customer's API key)
- **Email**: Mailjet / SendGrid / AWS SES
- **Monitoring**: Sentry (error tracking)
- **Analytics**: Mixpanel / Amplitude (user events)

### **DevOps**
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: AWS / GCP / Render
- **Monitoring**: Datadog / New Relic

---

## 📅 IMPLEMENTATION ROADMAP

### **Week 0: Prerequisites** (5 days - BLOCKING) ✅
- Shared models migration
- Feature flags implementation
- Docker & security hardening

### **Week 1-2: Goals + Tasks + OpenAI** (10 days) ✅
- OKR cascade (Objective → Goal → Task)
- OpenAI integration (GPT-4 with template fallback)

### **Week 3-4: Assessment System** (10 days) ✅
- Multi-level assessment (individual → team → org)
- SSI scoring, weak area analysis

### **Week 5: Teams + Objectives UI** (5 days) ✅
- Team structure, objectives display

### **Week 6: Goal Management** (5 days) ⚠️ 21% Complete
- Goals system (backend complete, frontend pending)

### **Week 7: IAM Block** (5 days) ⬜ Not Started
- Company creation, team hierarchy, member management
- Bulk invitation system (Block 6)
- Multi-company context switching

### **Week 7.5: AI OKR Engine LLM** (2.5 days) ⬜ Not Started
- GPT-4 integration with structured JSON
- Consultant prompt customization
- Retry logic with template fallback

### **Week 8: Progress Rollup** (5 days) ⬜ Not Started
- Automated cascade aggregation

### **Week 9: Dashboards & Role-Based UI** (5 days) ⬜ Not Started
- Owner, Manager, Employee, Consultant dashboards

### **Week 10: Permission Rules Engine** (5 days) ⬜ Not Started
- Database-stored permission rules

### **Week 11: Admin Panel + Integration Testing** (5 days) ⬜ Not Started
- Admin control panel, end-to-end testing

### **Week 12: Launch Preparation** (5 days) ⬜ Not Started
- Beta onboarding, documentation, monitoring

**Launch Date**: January 31, 2026

---

## 📊 CURRENT STATUS

### **Overall Progress**: 41% Complete (5.5/12 weeks)

**Completed**:
- ✅ Week 0: Prerequisites (100%)
- ✅ Week 1-2: Goals + Tasks + OpenAI (100%)
- ✅ Week 3-4: Assessment System (100%)
- ✅ Week 5: Teams + Objectives UI (100%)

**In Progress**:
- ⚠️ Week 6: Goal Management (21% - backend done, frontend pending)

**Remaining**:
- ⬜ Week 7-12: 141 tasks (planned)

---

## 🔗 RELATED DOCUMENTATION

### **Strategic Documents**:
- [MVP_STRATEGY_V5.md](../../Karvia_OKR_Product_Planning/01_MVP/MVP_STRATEGY_V5.md)
- [MVP_PRD_V3.md](../../Karvia_OKR_Product_Planning/01_MVP/MVP_PRD_V3.md)
- [MVP_USER_STORIES_V3.2.md](../../Karvia_OKR_Product_Planning/01_MVP/MVP_USER_STORIES_V3.2.md)
- [MASTER_DEV_LIST_V5.md](../../Karvia_OKR_Product_Planning/01_MVP/MASTER_DEV_LIST_V5.md)

### **Architecture Documents**:
- [MODULAR_BLOCKS_ARCHITECTURE.md](../../MODULAR_BLOCKS_ARCHITECTURE.md)
- [backend_architecture.md](./backend_architecture.md)
- [api_contracts.md](./api_contracts.md)

---

**Document Owner**: Engineering Team
**Last Updated**: October 23, 2025
**Version**: 5.0
**Status**: Implementation Ready
**Launch Target**: January 31, 2026
