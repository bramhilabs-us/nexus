# 📋 KARVIA OKR - MVP PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Version**: 3.0 (Modular Block Architecture)
**Date**: October 23, 2025
**Launch Target**: January 31, 2026
**Duration**: 12 Weeks (Post-Week 0)
**Status**: Implementation Ready

---

## ⚠️ CRITICAL UPDATE (v3.0)

**Assessment System (Block 3) is an OPTIONAL module** that provides data-driven OKR recommendations. While assessments are strongly recommended for contextual, data-driven OKRs, the platform supports manual OKR creation when the Assessment Block is disabled. Multi-level assessment aggregation (individual → team → org) is available when both Block 3 (Assessments) and Block 2 (IAM) are enabled.

**Key Architecture Change**: Platform now built as 7 modular "Lego Blocks" that can be independently enabled/disabled. Block 1 (Core Execution) works standalone. All other blocks are optional enhancements.

---

## 📋 TABLE OF CONTENTS

1. [Product Overview](#product-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [The 7 Modular Blocks](#the-7-modular-blocks)
4. [The 6 Backend Engines](#the-6-backend-engines)
5. [Feature Requirements](#feature-requirements)
   - [Block 1: Core Execution](#block-1-core-execution-required)
   - [Block 2: IAM - Identity & Access Management](#block-2-iam---identity--access-management-optional)
   - [Block 3: Assessment System](#block-3-assessment-system-optional)
   - [Block 4: AI OKR Engine](#block-4-ai-okr-engine-optional)
   - [Block 5: Progress Rollup](#block-5-progress-rollup-optional)
   - [Block 6: Bulk Operations](#block-6-bulk-operations-optional)
   - [Block 7: Permission Rules Engine](#block-7-permission-rules-engine-optional)
6. [Feature Flags & Graceful Degradation](#feature-flags--graceful-degradation)
7. [15 Core Screens](#15-core-screens)
8. [API Requirements](#api-requirements)
9. [Non-Functional Requirements](#non-functional-requirements)
10. [Acceptance Criteria](#acceptance-criteria)

---

## 🎯 PRODUCT OVERVIEW

### **What is Karvia OKR?**

Karvia OKR is a modular OKR platform built as independent "Lego Blocks." Each block enhances functionality without blocking core execution. The platform works standalone for solo users and scales to enterprise teams with optional IAM, assessments, AI generation, and predictive analytics.

### **Product Architecture**

**Karvia PRO** = 7 modular blocks + 6 backend engines (fully functional standalone)
**iBrain** = Intelligence layer (post-MVP) that enhances engines with nudging

**The 7 Blocks**:
1. **Core Execution** (REQUIRED) - Individual OKR management
2. **IAM - Company & Teams** (OPTIONAL, strongly recommended) - Multi-user organizations
3. **Assessment System** (OPTIONAL, strongly recommended) - Strategic questionnaires with SSI scoring
4. **AI OKR Engine** (OPTIONAL, requires OpenAI key) - LLM-powered OKR generation
5. **Progress Rollup** (OPTIONAL) - Automated progress aggregation
6. **Bulk Operations** (OPTIONAL, requires Block 2) - Bulk invitations and assessments
7. **Permission Rules Engine** (OPTIONAL) - Admin-configurable permission rules

**Admin UI**: Consolidated management layer for feature flags, permissions, iBrain toggle (NOT a separate block)

**The 6 Engines** (backend infrastructure):
- **IAM**, **Assessment**, **Planner**, **Scoring**, **Observer**, **Tracking**
- MVP: Process requests with basic logic
- Post-MVP + iBrain: Add intelligence, nudging, predictions

**Solo User Journey**: Can use Block 1 (+ optional 3, 4, 5) without creating company
**Company User Journey**: Gets all 7 blocks (full feature set)

### **Modular Architecture Philosophy**

**Core Principle**: Block 1 (Core Execution) works with ZERO other blocks enabled. Every additional block is optional and can be enabled/disabled via feature flags.

**Why This Matters**:
- Solo users get immediate value without complex setup
- Companies can start simple, add complexity later
- External parties can deploy only needed blocks
- Each block can be improved independently
- No feature interdependencies = faster iteration

---

## 👥 USER ROLES & PERMISSIONS

### **Role Hierarchy**

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

### **Role Definitions**

| Role | Description | Count per Business | Key Permissions |
|------|-------------|-------------------|-----------------|
| **Super Admin** | Internal Karvia platform admin | N/A (internal) | All actions, multi-business, iBrain toggle management |
| **Company Admin** | Business owner/CEO | 1-2 | All business data, invite users, assessment, generate OKRs, iBrain toggle (own business) |
| **Manager** | Department head, team lead | 3-10 | View team data, assign goals/tasks, view reports |
| **Employee** | Individual contributor | 10-1000 | View assigned tasks/goals, update progress |
| **Consultant** | External advisor | 1-5 per company | Read-only access to multiple businesses, generate OKRs for clients |

### **Permission Matrix** (IAM Block Enabled)

**Note**: This matrix assumes IAM Block is enabled (companies/teams exist). If IAM disabled:
- Users work as solo accounts
- Company/team columns don't apply
- All users default to EMPLOYEE role with full self-management permissions

| Action | Super Admin | Company Admin | Manager | Employee | Consultant |
|--------|-------------|---------------|---------|----------|------------|
| **Take assessment** | ✅ | ✅ | ✅ | ✅ | ✅ (for client) |
| **View own SSI scores** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View team SSI scores** | ✅ | ✅ | ✅ (own team) | ❌ | ✅ (all teams) |
| **View org SSI scores** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Edit assessment template** | ✅ | ✅ (own business) | ❌ | ❌ | ✅ (for clients) |
| **Modify question weights** | ✅ | ✅ (own business) | ❌ | ❌ | ✅ (for clients) |
| **Create custom templates** | ✅ | ✅ | ❌ | ❌ | ✅ (reusable) |
| **Invite users to assessments** | ✅ | ✅ | ✅ (own team) | ❌ | ✅ (all) |
| **View question-level scores** | ✅ | ✅ | ✅ (own + team) | ✅ (own only) | ✅ (all) |
| Generate OKRs | ✅ | ✅ | ❌ | ❌ | ✅ (for client) |
| Approve objectives | ✅ | ✅ | ❌ | ❌ | ✅ (advisory) |
| Create goals | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign tasks | ✅ | ✅ | ✅ | ❌ | ❌ |
| View all company data | ✅ | ✅ | ❌ | ❌ | ✅ (read-only) |
| View team data | ✅ | ✅ | ✅ (own team) | ❌ | ✅ (read-only) |
| Update own tasks | ✅ | ✅ | ✅ | ✅ | ❌ |
| Invite users | ✅ | ✅ | ✅ (limited) | ❌ | ❌ |
| Manage business profile | ✅ | ✅ | ❌ | ❌ | ❌ |
| Toggle iBrain features | ✅ (all businesses) | ✅ (own business) | ❌ | ❌ | ❌ |
| Access multiple companies | ✅ | ❌ | ❌ | ❌ | ✅ |
| Create company | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create teams | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bulk invitations | ✅ | ✅ | ✅ (own team) | ❌ | ✅ |

---

## 🧩 THE 7 MODULAR BLOCKS

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
- No company required
- No teams required
- No assessments required
- No AI required
- No other users required

**User Journey**:
1. Solo user signs up
2. Creates objective: "Launch Product Beta"
3. Adds key result: "100 users signed up"
4. Creates goal: "Build landing page"
5. Creates task: "Write homepage copy"
6. Updates progress manually
7. ✅ Complete standalone workflow

**Status**: Weeks 1-6 (mostly complete, Week 6 frontend pending)

**Feature Flag**: `ENABLE_CORE_EXECUTION=true` (always enabled)

**Dependencies**: MongoDB only

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

**Note**: Bulk invitation system (company/team/individual modes) is provided by Block 6 (Bulk Operations), which requires Block 2 (IAM) to be enabled. When Block 6 is disabled, only individual invitations are available (one email at a time).

**Enhancement to Core**:
- Objectives can have `team_id` (optional field)
- Goals can have `team_id` (optional field)
- Tasks can have `team_id` (optional field)
- User can have `companies: [{ company_id, role }]` array
- Filters appear in UI: "Show My Team's Goals"

**Graceful Degradation**:
- If disabled: Team filters hidden from UI
- If disabled: Users work as solo accounts
- If disabled: No company dropdown

**User Journey (IAM Enabled)**:
1. Owner creates company: "Acme Corp"
2. Creates team: "Engineering"
3. Invites manager: sarah@acme.com
4. Sarah registers, joins team
5. Sarah sees team filter in dashboard
6. ✅ Multi-user workflow

**Status**: Week 5 partial (teams exist), Week 7 complete (companies, bulk ops)

**Feature Flag**: `ENABLE_IAM=true|false` (default: true)

**Database Changes** (additive only, backward compatible):
```javascript
// User model
User.companies = [{ company_id: ObjectId, role: String }]; // NEW (optional)

// Goal model
Goal.team_id = ObjectId; // NEW (optional)
Goal.company_id = ObjectId; // NEW (optional)

// Task model
Task.team_id = ObjectId; // NEW (optional)
Task.company_id = ObjectId; // NEW (optional)
```

---

### **Block 3: Assessment System (OPTIONAL)** 📊

**What It Does**: Strategic questionnaires with dynamic scoring.

**Assessment Types** (Enum):
- SSI (Speed/Strength/Intelligence) - default, already built
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
Individual Assessments
    ↓ (aggregation)
Team-Level Scores
    ↓ (aggregation)
Organization-Level SSI
```

**Use Cases Supported**:
- Company-wide culture assessment (send to all employees)
- Team-specific skills assessment (send to Sales team only)
- Combined evaluation (correlate multiple assessments → SSI)

**Status**: Week 4 complete (Assessment Hub) - **Preserve all existing functionality**

**Enhancement**: Week 7 - Refactor internal model for extensibility
- Change: Internal schema (hardcoded SSI fields → dynamic dimensions array)
- Preserve: All existing Assessment Hub UI, features, scoring logic work unchanged
- Approach: Additive schema migration (existing assessments continue to work)

**Feature Flag**: `ENABLE_ASSESSMENTS=true|false` (default: true)

**Graceful Degradation**:
- If disabled: Assessment menu hidden
- If disabled: OKRs created manually (no assessment-driven generation)

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

**Requirements**:
- Customer provides OpenAI API key
- Requires Block 3 (Assessments) for data input
- Falls back to templates if OpenAI fails

**Status**: Week 4 basic (template-based), Week 7.5 enhance (real LLM)

**Enhancement**: Week 7.5
- Build proper report generator (formats assessment as text)
- Build prompt builder (dynamic from assessment + company profile)
- Add consultant prompt editor UI
- Integrate OpenAI SDK with structured output
- Parse JSON response correctly

**Feature Flag**: `ENABLE_AI_ENGINE=true|false` (default: true, but requires OpenAI key)

**Graceful Degradation**:
- If disabled: No "Generate OKRs" button
- If OpenAI fails: Uses template-based generation
- If no assessment: Manual OKR creation only

**Dependencies**:
- OpenAI API (customer's key)
- Redis (optional - in-memory fallback)

---

### **Block 5: Progress Rollup (OPTIONAL)** 📈

**What It Does**: Automated progress aggregation across hierarchy.

**Features**:
- Task progress → Goal progress (auto-calculated)
- Goal progress → Key Result progress (auto-calculated)
- Key Result progress → Objective progress (auto-calculated)
- Team-level rollup (if IAM enabled)
- Org-level rollup (if IAM enabled)

**Enhancement to Core**:
- Post-save hooks calculate parent progress
- Dashboard shows aggregated team progress (if IAM enabled)

**Status**: Week 8 (post-save hooks)

**Feature Flag**: `ENABLE_PROGRESS_ROLLUP=true|false` (default: true)

**Graceful Degradation**:
- If disabled: Manual progress updates only
- If disabled: No automatic rollup

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

**Status**: Week 7 (new feature)

**Feature Flag**: `ENABLE_BULK_OPS=true|false` (default: true)

**Graceful Degradation**:
- If disabled: Individual invitation only (existing flow)

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

**Enhancement to Core**:
- Middleware checks `PermissionRule` collection before action
- Falls back to default RBAC if no rules found

**Status**: Week 10 (new feature)

**Feature Flag**: `ENABLE_PERMISSION_RULES=true|false` (default: false)

**Graceful Degradation**:
- If disabled: Uses default RBAC (hardcoded in middleware)

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

---

### **Admin UI Layer** (Not a Separate Block)

Admin functionality (feature flags, permission management, iBrain toggle) will be built as a consolidated management layer in Week 11, but is NOT a separate block. It's a UI for managing the 7 blocks above.

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

The 6 microservice engines are the backend infrastructure that ALL 7 blocks access. In MVP, engines handle CRUD operations with basic business logic. Post-MVP, iBrain adds intelligence/nudging to these engines.

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

### **Why 6 Engines?**

**Decision**: Keep existing 6-engine architecture (90% already built).

**Rationale**:
- Independent scaling (IAM handles 10x auth load vs Assessment)
- Clear service boundaries (decoupling)
- Team can work in parallel on different engines
- Easier testing (isolate engine-specific logic)
- External party can deploy/maintain engines independently

---

### **Engine Breakdown**

| Engine | Port | MVP Role | Post-MVP + iBrain |
|--------|------|----------|-------------------|
| **IAM** | 8081 | Auth, user/company/team management, invitations, bulk invite | + Engagement tracking, stuck user detection, access pattern analysis |
| **Assessment** | 8082 | SSI scoring, multi-level aggregation, weak area calculation | + Comparative analysis, industry benchmarks, improvement nudges |
| **Planner** | 8083 | OKR generation (LLM + templates), goal/task CRUD | + Continuous optimization, pattern-based suggestions, success probability |
| **Scoring** | 8084 | Progress calculation, health scoring, aggregation | + Risk prediction (78% failure risk), early warning nudges |
| **Observer** | 8085 | Activity logging, audit trails, change tracking | + Pattern detection, anomaly alerts, behavior analysis |
| **Tracking** | 8086 | Time tracking, progress updates, task status | + Velocity analysis, stall detection, intervention suggestions |

**Key Dependencies** (All Engines):
- MongoDB (primary database)
- @karvia/shared-models (model package)
- JWT (authentication - IAM engine)
- OpenAI API (optional - Planner engine)
- Redis (optional - Planner engine caching)

---

### **Shared Models Package**

**Critical Architectural Decision**: All engines use `@karvia/shared-models` instead of `../../server/models`.

**Why**:
- **Decouple engines** from server filesystem
- **Enable independent deployment** (external party can deploy engines separately)
- **Prevent schema drift** (single source of truth)
- **Versioning** (semver for model changes)

**Models in Shared Package**:
- Business, User, Objective, Goal, Task
- Company (new - Week 7), Team (enhanced - Week 7)
- Invitation (enhanced - Week 7 with bulk support)
- Assessment, AssessmentTemplate, AssessmentResult
- PermissionRule (new - Week 10)
- Activity, Update

**Implementation**: Week 0 prerequisite

---

### **iBrain Integration (Post-MVP)**

Example: Observer Engine checking iBrain status

```javascript
async function logActivity(user_id, action, data) {
  // MVP: Just store the activity
  await Activity.create({ user_id, action, data, timestamp: new Date() });

  // Check if iBrain enabled for this business
  const business = await Business.findById(user.business_id);

  if (business.ibrain_enabled) {
    // POST-MVP: Send event to iBrain for analysis
    await axios.post(business.ibrain_config.api_url + '/events', {
      event_type: 'activity',
      user_id,
      action,
      data,
      timestamp: new Date()
    }, {
      headers: { 'Authorization': `Bearer ${business.ibrain_config.api_key}` }
    });

    // iBrain responds with nudges/recommendations (async)
  }
}
```

**Key Point**: In MVP, engines are "dumb" processors. Post-MVP, iBrain makes them "smart."

---

## 🏗️ FEATURE REQUIREMENTS

---

## BLOCK 1: CORE EXECUTION (REQUIRED)

### **F1.1: Authentication & Authorization**

**Description**: Secure user authentication and role-based access control.

**Functional Requirements**:
- FR1.1.1: Users can register via invitation token
- FR1.1.2: Users can login with email + password
- FR1.1.3: JWT tokens expire after 1 hour (configurable)
- FR1.1.4: Refresh tokens valid for 7 days
- FR1.1.5: Password must be at least 8 characters with 1 uppercase, 1 number
- FR1.1.6: Role-based authorization middleware on all protected routes
- FR1.1.7: Users can only access data for their business_id (if IAM enabled)
- FR1.1.8: Consultants can switch between authorized businesses (if IAM enabled)

**Technical Requirements**:
- IAM Engine (port 8081) handles all auth
- JWT secrets from environment variables (no hard-coded secrets)
- Bcrypt password hashing (salt rounds: 10)
- Token includes: `{ id, email, role, business_id }`

**Acceptance Criteria**:
- AC1.1.1: User cannot access another business's data (if IAM enabled)
- AC1.1.2: Expired tokens return 401 Unauthorized
- AC1.1.3: Invalid credentials return appropriate error messages
- AC1.1.4: Consultant can switch companies via dropdown (if IAM enabled)

**Priority**: P0 (Blocking)

---

### **F1.2: Objectives & Key Results Management**

**Description**: Core OKR creation and tracking functionality.

**Functional Requirements**:
- FR1.2.1: Users can create objectives (quarterly, 4-6 per user)
- FR1.2.2: Each objective has: title, description, quarter, year, status
- FR1.2.3: Users can add 3-4 key results per objective
- FR1.2.4: Key results have: description, metric, baseline, target, current
- FR1.2.5: Users can update progress manually
- FR1.2.6: Objectives can be marked: draft, active, completed, at_risk, failed
- FR1.2.7: Users can view all their objectives in dashboard

**Technical Requirements**:
- Objective model in `@karvia/shared-models/models/Objective.js`
- Planner Engine (port 8083) handles CRUD operations
- Progress calculated as: `(current - baseline) / (target - baseline) * 100`

**Acceptance Criteria**:
- AC1.2.1: User can create objective in <30 seconds
- AC1.2.2: Objectives display with progress bars
- AC1.2.3: Key results track progress accurately
- AC1.2.4: Can filter objectives by quarter/status

**Priority**: P0 (Blocking)

---

### **F1.3: Goals & Tasks Cascade**

**Description**: Complete OKR cascade from Objective → Key Results → Goals → Tasks.

**Hierarchy**:
```
Objective (Quarterly, 4-6 per user)
  ↓
Key Result (3-4 per objective, measurable outcomes)
  ↓
Goal (Weekly, assigned to individual, 5-10 per key result)
  ↓
Task (Daily, specific actions, 3-7 per goal)
```

**Functional Requirements**:

**Goals (FR1.3.1 - FR1.3.7)**:
- FR1.3.1: User selects a Key Result and creates weekly goals
- FR1.3.2: Each goal has: title, description, assigned_to, week_number, quarter, due_date
- FR1.3.3: Goals can be marked: not_started, in_progress, completed, at_risk, blocked
- FR1.3.4: Progress percentage auto-calculated from completed tasks (if Block 5 enabled)
- FR1.3.5: User can reassign goals to different team members (if IAM enabled)
- FR1.3.6: User sees all goals assigned to them
- FR1.3.7: Goal detail shows: tasks (count), progress (%), status, due date

**Tasks (FR1.3.8 - FR1.3.14)**:
- FR1.3.8: User creates tasks under a goal
- FR1.3.9: Each task has: title, description, assigned_to, due_date, estimated_hours, priority
- FR1.3.10: Tasks can be marked: todo, in_progress, completed, blocked
- FR1.3.11: User can update task status and add completion notes
- FR1.3.12: User can see all their tasks in one view
- FR1.3.13: Task priority: low, medium, high, urgent (color-coded)
- FR1.3.14: User dashboard shows "Top 3 tasks today" (due today, high priority)

**Progress Calculation** (if Block 5 enabled):
```javascript
// Goal progress = % of tasks completed
goal.progress_percentage = (completed_tasks / total_tasks) * 100

// Key Result progress = average of goal progress
key_result.progress_percentage = average(goal.progress_percentage for all goals)

// Objective progress = average of key result progress
objective.progress_percentage = average(key_result.progress_percentage for all KRs)
```

**Technical Requirements**:
- Goal model in `@karvia/shared-models/models/Goal.js`
- Task model in `@karvia/shared-models/models/Task.js`
- Scoring Engine (port 8084) handles progress calculation (if Block 5 enabled)
- Tracking Engine (port 8086) handles task updates
- Server routes: `/api/goals`, `/api/tasks`

**Acceptance Criteria**:
- AC1.3.1: User can create goals from key results
- AC1.3.2: User can create tasks from goals
- AC1.3.3: User can update task status
- AC1.3.4: Progress auto-updates when task completed (if Block 5 enabled)
- AC1.3.5: User dashboard shows correct "Top 3 tasks today"
- AC1.3.6: Cascade visible: Objective → KR → Goal → Task

**Priority**: P0 (Blocking)

---

### **F1.4: Personal Dashboard**

**Description**: Individual user dashboard with task/goal/objective overview.

**Functional Requirements**:
- FR1.4.1: Dashboard shows user's objectives with progress
- FR1.4.2: Shows "Top 3 tasks today" (due today, high priority)
- FR1.4.3: Shows this week's goals
- FR1.4.4: Shows recent activity/updates
- FR1.4.5: Quick actions: Create objective, Create task, Update progress

**Technical Requirements**:
- Dashboard data loaded via API: `/api/dashboard`
- Dashboard caching (Redis or in-memory, 5-minute TTL)
- Lazy loading for large datasets (pagination)

**Acceptance Criteria**:
- AC1.4.1: Dashboard loads in <2 seconds
- AC1.4.2: Data accurate (matches database)
- AC1.4.3: Quick actions work correctly

**Priority**: P0 (Blocking)

---

## BLOCK 2: IAM - IDENTITY & ACCESS MANAGEMENT (OPTIONAL)

### **F2.1: Company Creation & Management**

**Description**: Multi-company infrastructure with company profiles.

**Functional Requirements**:
- FR2.1.1: Owner can create company during signup (or skip for solo use)
- FR2.1.2: Company has: name, industry, size, archetype, strategic_focus
- FR2.1.3: Owner selects 1 of 16 business archetypes
- FR2.1.4: Owner selects 3-5 strategic priorities from 24 focus areas
- FR2.1.5: Company name must be unique
- FR2.1.6: First user automatically becomes Company Owner
- FR2.1.7: Owner can update company profile after creation

**16 Business Archetypes**:
1. Explorer (Innovation-driven)
2. Consolidator (Efficiency-focused)
3. Expander (Growth-focused)
4. Defender (Stability-focused)
5. Reactor (Adaptive, fast-moving)
6. Analyzer (Data-driven)
7. Prospector (Market-seeking)
8. Cooperator (Partnership-driven)
9. Renovator (Transformation-focused)
10. Optimizer (Process improvement)
11. Disruptor (Market challenger)
12. Specialist (Niche expert)
13. Integrator (M&A, consolidation)
14. Harvester (Mature market, profit extraction)
15. Turnaround (Recovery mode)
16. Sustainer (Maintain status quo)

**24 Strategic Focus Areas** (grouped by SSI dimension):

**Speed (Business Agility)**:
- Accelerate time-to-market
- Improve decision-making speed
- Enhance operational agility
- Increase execution velocity
- Streamline processes
- Boost innovation speed
- Improve customer response time
- Accelerate learning cycles

**Strength (Operational Stability)**:
- Build organizational resilience
- Improve financial stability
- Strengthen supply chain
- Enhance risk management
- Improve quality & reliability
- Build sustainable processes
- Strengthen competitive moat
- Improve operational efficiency

**Intelligence (Data-Driven Insights)**:
- Enhance data analytics
- Improve forecasting accuracy
- Build predictive capabilities
- Strengthen customer insights
- Improve market intelligence
- Build strategic foresight
- Enhance learning culture
- Improve decision quality

**Technical Requirements**:
- Company model in `@karvia/shared-models/models/Company.js`
- Company CRUD endpoints in IAM Engine
- Archetype validation (must be one of 16)
- Strategic focus validation (3-5 selections required)

**Acceptance Criteria**:
- AC2.1.1: Owner can create company in <2 minutes
- AC2.1.2: Solo user can skip company creation
- AC2.1.3: Company name uniqueness enforced
- AC2.1.4: First user gets Owner role automatically
- AC2.1.5: Company profile can be updated

**Priority**: P0 (Blocking for multi-user scenarios)

---

### **F2.2: Company-Team Hierarchy**

**Description**: Hierarchical team structure within companies.

**Functional Requirements**:
- FR2.2.1: Company can have multiple teams
- FR2.2.2: Team has: name, description, manager_id, company_id
- FR2.2.3: Users can be members of multiple teams
- FR2.2.4: Team membership includes role
- FR2.2.5: Goals/tasks can be assigned to teams
- FR2.2.6: Team-level filters in UI

**Technical Requirements**:
- Enhanced Team model (add company_id)
- User.companies array: `[{ company_id, role }]`
- Goal.team_id, Goal.company_id (optional fields)
- Task.team_id, Task.company_id (optional fields)

**Acceptance Criteria**:
- AC2.2.1: Company can create teams
- AC2.2.2: Users can be assigned to teams
- AC2.2.3: Team filters work in goal/task views
- AC2.2.4: Team data isolated by company

**Priority**: P0 (Blocking for multi-user scenarios)

---

### **F2.3: Team Management**

**Description**: CRUD operations for team management.

**Functional Requirements**:
- FR2.3.1: Owner/Manager can create team
- FR2.3.2: Owner/Manager can update team details
- FR2.3.3: Owner/Manager can delete team (if no active goals)
- FR2.3.4: Owner/Manager can assign team manager
- FR2.3.5: Team list shows: name, member count, manager, active goals

**Technical Requirements**:
- Team CRUD endpoints in IAM Engine
- Validation: Cannot delete team with active goals
- Manager assignment validation (user must be in company)

**Acceptance Criteria**:
- AC2.3.1: Owner can create team in <1 minute
- AC2.3.2: Cannot delete team with active goals
- AC2.3.3: Manager can be reassigned
- AC2.3.4: Team list accurate and up-to-date

**Priority**: P0 (Blocking for multi-user scenarios)

---

### **F2.4: Member Management**

**Description**: Add/remove members from teams.

**Functional Requirements**:
- FR2.4.1: Owner/Manager can add members to team
- FR2.4.2: Owner/Manager can remove members from team
- FR2.4.3: Removing member reassigns their goals (prompt user)
- FR2.4.4: Member list shows: name, email, role, join date
- FR2.4.5: Member can be in multiple teams

**Technical Requirements**:
- Member management endpoints in IAM Engine
- Reassignment workflow for removed members
- Team membership tracking

**Acceptance Criteria**:
- AC2.4.1: Can add member to team
- AC2.4.2: Can remove member from team
- AC2.4.3: Goals reassigned on member removal
- AC2.4.4: Member list accurate

**Priority**: P0 (Blocking for multi-user scenarios)

---

### **F2.5: Automatic Company Association**

**Description**: Users automatically join company when accepting invitation.

**Functional Requirements**:
- FR2.5.1: Invitation includes company_id and role
- FR2.5.2: User accepting invitation auto-joins company
- FR2.5.3: User's companies array updated
- FR2.5.4: User gets default role from invitation
- FR2.5.5: User can access company data immediately

**Technical Requirements**:
- Enhanced Invitation model (company_id field)
- Auto-association logic in registration endpoint
- User.companies array management

**Acceptance Criteria**:
- AC2.5.1: Invited user joins company on registration
- AC2.5.2: User gets correct role from invitation
- AC2.5.3: User can access company data immediately
- AC2.5.4: Consultant can accept invitations from multiple companies

**Priority**: P0 (Blocking for multi-user scenarios)

---

### **F2.6: Individual Invitation System**

**Description**: Email-based invitation system (one-at-a-time).

**Functional Requirements**:
- FR2.6.1: Owner/Manager can invite user via email
- FR2.6.2: Invitation includes: email, role, company_id, expiration (7 days)
- FR2.6.3: System generates secure token (32-byte hex)
- FR2.6.4: Invitation email sent with registration link + token
- FR2.6.5: Invitee clicks link, lands on registration page (pre-filled email)
- FR2.6.6: Invitee enters name + password, account created with assigned role
- FR2.6.7: Invitation marked "accepted" and cannot be reused
- FR2.6.8: Expired invitations cannot be used (returns error)
- FR2.6.9: Owner can resend or cancel invitations

**Invitation States**:
- `pending`: Sent, not yet accepted
- `accepted`: User registered successfully
- `expired`: Past expiration date
- `cancelled`: Manually cancelled by admin

**Email Template**:
```
Subject: You've been invited to join {Company Name} on Karvia OKR

Hi,

{Inviter Name} has invited you to join {Company Name} as a {Role}.

Karvia OKR helps teams align around strategic objectives and track progress.

Click here to accept your invitation:
{APP_URL}/register?token={TOKEN}

This invitation expires in 7 days.

If you have questions, contact {Inviter Email}.

- The Karvia Team
```

**Technical Requirements**:
- Invitation model in `@karvia/shared-models/models/Invitation.js`
- IAM Engine handles: create, validate, accept invitations
- Email service integration (SendGrid, AWS SES, or similar)
- Token validation middleware

**Acceptance Criteria**:
- AC2.6.1: Invitation email delivered within 1 minute
- AC2.6.2: Registration link pre-fills email field
- AC2.6.3: Valid token creates account with correct role
- AC2.6.4: Expired token shows error message
- AC2.6.5: Accepted invitation cannot be reused
- AC2.6.6: Invitations listed in admin panel with status

**Note**: Bulk invitation functionality (company/team modes) is in Block 6.

**Priority**: P0 (Blocking for multi-user scenarios)

---

### **F2.7: Multi-Company Context Switching**

**Description**: Consultants can switch between client companies.

**Functional Requirements**:
- FR2.7.1: Consultant sees company switcher dropdown in navigation
- FR2.7.2: Dropdown shows all companies consultant has access to
- FR2.7.3: Switching company updates all data views
- FR2.7.4: Current company persisted in session
- FR2.7.5: All API calls scoped to current company

**Technical Requirements**:
- Company switcher UI component
- Session management for current company
- Query filters scoped to company_id

**Acceptance Criteria**:
- AC2.7.1: Consultant can switch companies via dropdown
- AC2.7.2: Data updates when switching companies
- AC2.7.3: Current company persisted across page reloads
- AC2.7.4: Cannot access other companies' data

**Priority**: P1 (High - critical for consultants)

---

## BLOCK 3: ASSESSMENT SYSTEM (OPTIONAL)

### **F3.1: Multi-Level Assessment System**

**Description**: Strategic questionnaires with individual → team → org aggregation.

**Assessment Type Hierarchy**:

```
┌─────────────────────────────────────────────────────────┐
│ ORGANIZATIONAL SSI (Company-Wide)                       │
│ Aggregated from all assessments below                   │
│ Weighted: 40% Individual + 30% Team + 20% Role + 10% Org│
└─────────────────────────────────────────────────────────┘
                         ↑
           ┌─────────────┼─────────────┐
           │             │             │
┌──────────────────┐ ┌─────────────┐ ┌──────────────────┐
│ INDIVIDUAL SSI   │ │ TEAM SSI    │ │ ROLE SSI         │
│ Every employee   │ │ By dept     │ │ By job function  │
│ (avg of all)     │ │ (avg of     │ │ (avg by role)    │
│                  │ │  members)   │ │                  │
└──────────────────┘ └─────────────┘ └──────────────────┘
```

**Assessment Types & Purpose**:

| Type | Who Takes It | Frequency | Questions Focus | SSI Contribution |
|------|--------------|-----------|-----------------|------------------|
| **Individual** | All employees | Quarterly | Personal speed, learning, decision quality | Individual SSI (40% of org) |
| **Team** | All team members | Quarterly | Team collaboration, shared goals | Team SSI (30% of org) |
| **Role-Specific** | Members of specific role | Quarterly | Role-specific capabilities | Role SSI (20% of org) |
| **Manager** | Managers + Executives | Quarterly | Leadership effectiveness | Manager SSI (feeds into org) |
| **Organizational** | All employees (weighted) | Annually | Company culture, strategic alignment | Organizational SSI (10% of org) |

**Functional Requirements**:
- FR3.1.1: Support SSI assessment type (Speed/Strength/Intelligence)
- FR3.1.2: Each assessment has 30-50 questions
- FR3.1.3: Questions weighted dynamically (consultant-adjustable)
- FR3.1.4: Individual scores calculated on submission
- FR3.1.5: Team scores aggregate when ≥80% of team completes
- FR3.1.6: Org scores aggregate when ≥70% of employees complete
- FR3.1.7: Results show dimension breakdown + weak areas
- FR3.1.8: Question-level scores visible (for detailed analysis)

**Technical Requirements**:
- Assessment model with dynamic dimensions
- AssessmentTemplate model (question bank)
- AssessmentResult model (individual responses)
- Scoring service (weighted calculation)
- Multi-level aggregation service
- Assessment Engine (port 8082) handles all operations

**Acceptance Criteria**:
- AC3.1.1: User can complete assessment in <15 minutes
- AC3.1.2: Individual SSI score calculated immediately
- AC3.1.3: Team SSI aggregates correctly
- AC3.1.4: Org SSI aggregates correctly
- AC3.1.5: Weak areas identified accurately
- AC3.1.6: Results feed into OKR generation (if Block 4 enabled)

**Priority**: P0 (Blocking for assessment-driven OKRs)

---

### **F3.2: Dynamic Assessment Framework**

**Description**: Refactor existing Assessment Hub to support multiple assessment types via dynamic dimensions.

**Current State** (Week 4 - DO NOT BREAK):
- Assessment Hub works with hardcoded Speed/Strength/Intelligence
- SSI scoring functional
- Multi-level aggregation (individual → team → org)
- Results dashboard complete

**Enhancement Goal**:
- Support multiple assessment types (SSI, 360, Skills, Custom)
- Dynamic dimensions (not hardcoded fields)
- Consultant-adjustable dimension weights
- Type-agnostic scoring service

**Functional Requirements**:

**FR3.2.1: Assessment Type Enum**
- Add `assessment_type` field to AssessmentTemplate model
- Enum values: "SSI", "360", "Skills", "Custom"
- Default: "SSI" (backward compatible)

**FR3.2.2: Dynamic Dimensions Schema**
- Replace hardcoded Speed/Strength/Intelligence fields
- Use flexible dimensions array:
  ```javascript
  dimensions: [{
    name: String,        // "Speed" or "Leadership"
    category: String,    // Assessment type grouping
    weight: Number,      // 0.0-1.0, consultant-adjustable
    description: String,
    questions: [ObjectId] // Questions mapped to this dimension
  }]
  ```

**FR3.2.3: Dimension Weight Editor** (Consultant Feature)
- UI: Sliders for each dimension
- Constraint: Total must equal 100%
- Save custom weights to template
- Results use custom weights in scoring

**FR3.2.4: Type-Agnostic Scoring**
- Scoring service calculates overall score for ANY dimension set
- Weighted average: `overall_score = Σ(dimension.score × dimension.weight)`
- Weak areas: dimensions with score < 60
- Strengths: dimensions with score > 75

**Technical Requirements**:
- Migrate existing Assessment model (additive changes only)
- Create AssessmentTypeEnum
- Refactor scoringService.js (remove hardcoded SSI logic)
- Add weight editor UI component

**Acceptance Criteria**:
- AC3.2.1: Existing SSI assessments still work (backward compatible)
- AC3.2.2: Can create SSI assessment with custom weights (Speed: 50%, others: 25%)
- AC3.2.3: Scoring service calculates correctly for any dimension set
- AC3.2.4: (Future) Can add 360 Feedback type without code changes

**Priority**: P1 (High - enables future extensibility)

**Implementation**: Week 7 (2 days)

**Preserves**: All existing Assessment Hub functionality (DO NOT BREAK)

---

### **F3.3: Assessment Invitation & Distribution**

**Description**: Invite users to complete assessments with tracking.

**Functional Requirements**:
- FR3.3.1: Admin/Consultant creates assessment and selects target audience
- FR3.3.2: Target audience: specific users, teams, roles, or entire company
- FR3.3.3: System sends email invitations with deadline
- FR3.3.4: Users receive notification to complete assessment
- FR3.3.5: System tracks completion status (pending, started, completed, expired)
- FR3.3.6: Reminder emails sent 2 days before deadline
- FR3.3.7: Dashboard shows completion rate (X/Y completed, Z%)

**Technical Requirements**:
- AssessmentInvitation model
- Invitation service (send emails, track status)
- Background job for reminder emails
- Completion tracking dashboard

**Acceptance Criteria**:
- AC3.3.1: Can invite users to assessment
- AC3.3.2: Invitees receive email notification
- AC3.3.3: Completion status tracked accurately
- AC3.3.4: Reminder emails sent on schedule
- AC3.3.5: Dashboard shows accurate completion rate

**Priority**: P0 (Blocking for assessment distribution)

---

### **F3.4: Assessment Results & Weak Area Analysis**

**Description**: Display assessment results with actionable insights.

**Functional Requirements**:
- FR3.4.1: Results show dimension scores (radar chart)
- FR3.4.2: Results show overall score (0-100)
- FR3.4.3: Results identify weak areas (score <70)
- FR3.4.4: Results identify critical areas (score <50)
- FR3.4.5: Question-level breakdown shows specific weaknesses
- FR3.4.6: Results include recommendations for improvement
- FR3.4.7: "Generate OKRs" button appears (if Block 4 enabled)

**Technical Requirements**:
- Results visualization (radar chart, progress bars)
- Weak area calculation algorithm
- Question-level scoring display
- Integration with AI OKR Engine (if enabled)

**Acceptance Criteria**:
- AC3.4.1: Results display within 5 seconds of completion
- AC3.4.2: Weak areas accurately identified
- AC3.4.3: Question-level breakdown helpful
- AC3.4.4: "Generate OKRs" button works (if Block 4 enabled)

**Priority**: P0 (Blocking for assessment value)

---

## BLOCK 4: AI OKR ENGINE (OPTIONAL)

### **F4.1: Assessment Report Generator**

**Description**: Convert assessment data into structured text report for LLM.

**Functional Requirements**:
- FR4.1.1: Generate text report from assessment results
- FR4.1.2: Report includes: dimension scores, weak areas, question-level insights
- FR4.1.3: Report formatted for LLM consumption (clear, structured)
- FR4.1.4: Report includes business context (archetype, industry, size)
- FR4.1.5: Report highlights top 5 weakest questions (for OKR focus)

**Report Structure**:
```
BUSINESS CONTEXT:
- Archetype: {archetype}
- Industry: {industry}
- Size: {employee_count} employees

ASSESSMENT RESULTS:
- Speed (Business Agility): {speed_score}/100 {weak_flag}
- Strength (Operational Stability): {strength_score}/100 {weak_flag}
- Intelligence (Data-Driven Insights): {intelligence_score}/100 {weak_flag}
- Overall: {overall_score}/100

CRITICAL WEAKNESSES (Top 5 Questions - Lowest Scores, High Impact):
1. 🔴 {question_text}: {score}/10 (Weight: {weight}, Dimension: {dimension})
   Impact: {impact_description}
2. ...

STRATEGIC PRIORITIES:
Primary: {primary_focus_areas}
Secondary: {secondary_focus_areas}
```

**Technical Requirements**:
- Report generator service: `engines/planner/services/report-generator.js`
- Text formatting utilities
- Assessment data fetching

**Acceptance Criteria**:
- AC4.1.1: Report generated in <1 second
- AC4.1.2: Report includes all required sections
- AC4.1.3: Report formatted correctly for LLM
- AC4.1.4: Top 5 weakest questions identified accurately

**Priority**: P0 (Blocking for AI OKR generation)

---

### **F4.2: Dynamic Prompt Builder**

**Description**: Build LLM prompt dynamically from report + company profile.

**Functional Requirements**:
- FR4.2.1: Prompt includes assessment report
- FR4.2.2: Prompt includes company context (archetype, priorities)
- FR4.2.3: Prompt includes custom instructions (if provided)
- FR4.2.4: Prompt includes output format specification (JSON schema)
- FR4.2.5: Prompt validation (max 4000 characters)
- FR4.2.6: Prompt preview available for review

**Prompt Template**:
```
{BUSINESS_CONTEXT}

{ASSESSMENT_REPORT}

{CUSTOM_INSTRUCTIONS}

TASK:
Generate 4-6 quarterly objectives (Q{current_quarter}) that:
1. Address weakest assessment areas (scores <70 get highest priority)
2. Align with primary strategic priorities (80% weight)
3. Are appropriate for {archetype} businesses
4. Follow OKR best practices (specific, measurable, time-bound, achievable)

For each objective:
- title: Inspiring, outcome-focused
- rationale: Why this matters based on scores
- focusArea: Which strategic priority it addresses
- difficulty: easy|medium|hard
- estimatedEffort: Percentage of team capacity (15-25%)
- keyResults: 3-4 measurable outcomes with baseline/target

Return JSON format:
{JSON_SCHEMA}
```

**Technical Requirements**:
- Prompt builder service: `engines/planner/services/prompt-builder.js`
- Template system (Handlebars or similar)
- Validation (character count, required fields)

**Acceptance Criteria**:
- AC4.2.1: Prompt built correctly from inputs
- AC4.2.2: Prompt under 4000 characters
- AC4.2.3: Prompt preview accurate
- AC4.2.4: Validation catches errors

**Priority**: P0 (Blocking for AI OKR generation)

---

### **F4.3: Consultant Prompt Customization**

**Description**: Allow consultants to edit prompt before generation.

**Functional Requirements**:
- FR4.3.1: Prompt preview modal shows full prompt
- FR4.3.2: Editable textarea for consultant customization
- FR4.3.3: Focus area input ("Focus on cost reduction")
- FR4.3.4: Tone selector ("Aggressive" vs "Conservative")
- FR4.3.5: Timeline selector ("Next quarter" vs "Next year")
- FR4.3.6: Character counter (4000 max)
- FR4.3.7: Save custom prompt for reuse
- FR4.3.8: Reset to default prompt button

**Technical Requirements**:
- Prompt editor UI component
- Character counter
- Prompt save/load functionality

**Acceptance Criteria**:
- AC4.3.1: Consultant can edit prompt
- AC4.3.2: Character counter works
- AC4.3.3: Custom prompts save correctly
- AC4.3.4: Reset button restores default
- AC4.3.5: Edited prompt used in generation

**Priority**: P1 (High - consultant feature)

---

### **F4.4: OpenAI LLM Integration**

**Description**: Real LLM-powered OKR generation using OpenAI GPT-4.

**Functional Requirements**:
- FR4.4.1: Integrate OpenAI SDK (openai npm package)
- FR4.4.2: Use GPT-4 model (fallback to gpt-3.5-turbo if quota exceeded)
- FR4.4.3: Structured output mode (JSON schema enforcement)
- FR4.4.4: Response parsing (JSON → Objective/KeyResult models)
- FR4.4.5: Retry logic (2 retries on failure)
- FR4.4.6: Timeout handling (30 seconds max)
- FR4.4.7: Error handling (rate limits, invalid API key, network errors)
- FR4.4.8: Fallback to templates if all retries fail

**Technical Requirements**:
- OpenAI service: `engines/planner/services/openai-service.js`
- Model: `gpt-4`
- Temperature: 0.7 (balance creativity and consistency)
- Max tokens: 2500
- Response format: JSON mode
- Redis caching (24-hour TTL)
- Customer provides API key (env variable)

**Acceptance Criteria**:
- AC4.4.1: OKRs generated in <30 seconds (p95)
- AC4.4.2: 4-6 objectives returned (validated)
- AC4.4.3: Each objective has 3-4 key results
- AC4.4.4: Objectives align with weak areas (scores <70)
- AC4.4.5: Fallback to templates if OpenAI fails
- AC4.4.6: Cached results returned in <1 second
- AC4.4.7: Regenerate button creates new OKRs

**Priority**: P0 (Blocking for AI value proposition)

---

### **F4.5: Response Parser & Validation**

**Description**: Parse OpenAI JSON response into database models.

**Functional Requirements**:
- FR4.5.1: Parse JSON response from OpenAI
- FR4.5.2: Validate response structure (required fields)
- FR4.5.3: Create Objective models from parsed data
- FR4.5.4: Create KeyResult models from parsed data
- FR4.5.5: Link KeyResults to Objectives
- FR4.5.6: Set lineage (assessment_id → objectives)
- FR4.5.7: Handle parsing errors gracefully

**Technical Requirements**:
- Response parser service
- JSON schema validation
- Model creation logic
- Error handling

**Acceptance Criteria**:
- AC4.5.1: Valid responses parsed correctly
- AC4.5.2: Invalid responses caught with clear error
- AC4.5.3: Objectives created with all fields
- AC4.5.4: KeyResults linked correctly
- AC4.5.5: Lineage preserved

**Priority**: P0 (Blocking for AI OKR generation)

---

### **F4.6: Template Fallback System**

**Description**: Pre-built OKR templates when OpenAI unavailable.

**Functional Requirements**:
- FR4.6.1: System has 20+ pre-built OKR templates
- FR4.6.2: Templates categorized by: archetype, focus area, weak dimension
- FR4.6.3: Template selector uses: business archetype + assessment weak areas
- FR4.6.4: Each template has 4-6 objectives with 3-4 key results each
- FR4.6.5: Templates include placeholders (e.g., `{company_name}`, `{industry}`)
- FR4.6.6: Placeholders auto-filled from business profile
- FR4.6.7: User can edit templates before accepting

**Template Categories** (20+ templates):
- Innovation Speed (Explorer, Reactor, Disruptor)
- Operational Efficiency (Consolidator, Optimizer)
- Growth & Expansion (Expander, Prospector)
- Stability & Risk (Defender, Sustainer)
- Transformation (Renovator, Turnaround)
- Data & Analytics (Analyzer)
- Partnerships (Cooperator, Integrator)
- Niche Excellence (Specialist)
- Profit Optimization (Harvester)

**Technical Requirements**:
- Template service: `engines/planner/services/template-service.js`
- Templates stored in: `engines/planner/data/templates/` (JSON files)
- Fallback automatically triggered when OpenAI fails

**Acceptance Criteria**:
- AC4.6.1: Template OKRs generated in <2 seconds
- AC4.6.2: Templates appropriate for business archetype
- AC4.6.3: Weak areas (score <70) prioritized in template selection
- AC4.6.4: All placeholders replaced with actual business data
- AC4.6.5: User can edit generated OKRs before accepting

**Priority**: P0 (Blocking - ensures platform always works)

---

## BLOCK 5: PROGRESS ROLLUP (OPTIONAL)

### **F5.1: Automated Progress Aggregation**

**Description**: Automated progress rollup across Task → Goal → KR → Objective hierarchy.

**Functional Requirements**:
- FR5.1.1: Task completion auto-updates goal progress
- FR5.1.2: Goal progress auto-updates key result progress
- FR5.1.3: Key result progress auto-updates objective progress
- FR5.1.4: Team-level rollup (if IAM enabled)
- FR5.1.5: Org-level rollup (if IAM enabled)
- FR5.1.6: Manual override still allowed

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

**Technical Requirements**:
- Post-save hooks on Task model
- Post-save hooks on Goal model
- Post-save hooks on KeyResult model
- Rollup service: `engines/scoring/services/rollup-service.js`

**Acceptance Criteria**:
- AC5.1.1: Task completion triggers goal update
- AC5.1.2: Goal update triggers key result update
- AC5.1.3: Key result update triggers objective update
- AC5.1.4: Team/org rollups work when IAM enabled
- AC5.1.5: Manual override preserves custom values
- AC5.1.6: Rollup completes in <500ms

**Priority**: P1 (High - automation value)

---

## BLOCK 6: BULK OPERATIONS (OPTIONAL)

### **F6.1: Bulk Invitation System**

**Description**: Invite multiple users at once (company/team/individual modes).

**Functional Requirements**:
- FR6.1.1: Admin/Manager can select invitation mode
- FR6.1.2: Mode 1: Entire Company (all existing company members)
- FR6.1.3: Mode 2: Specific Teams (select teams, invite all members)
- FR6.1.4: Mode 3: Individual Emails (CSV upload)
- FR6.1.5: Preview shows count: "27 invitations will be sent"
- FR6.1.6: Bulk send processes all invitations
- FR6.1.7: Progress bar during sending
- FR6.1.8: Success/failure report after completion

**Technical Requirements**:
- Enhanced Invitation model (recipient_type enum: company/team/individual)
- Bulk invite API endpoint
- CSV parser
- Email domain grouping
- Batch processing (50 emails at a time)

**Acceptance Criteria**:
- AC6.1.1: Can select invitation mode
- AC6.1.2: Preview shows accurate count
- AC6.1.3: Bulk send completes in <5 seconds for 50 invites
- AC6.1.4: Success/failure report accurate
- AC6.1.5: Email domain grouping works

**Priority**: P1 (High - scalability feature)

**Requires**: Block 2 (IAM) enabled

---

### **F6.2: Bulk Assessment Distribution**

**Description**: Send assessments to multiple users at once.

**Functional Requirements**:
- FR6.2.1: Admin/Consultant can select assessment distribution mode
- FR6.2.2: Mode 1: Entire Company
- FR6.2.3: Mode 2: Specific Teams
- FR6.2.4: Mode 3: Specific Roles
- FR6.2.5: Mode 4: Individual Users
- FR6.2.6: Preview shows recipient count
- FR6.2.7: Set deadline for completion
- FR6.2.8: Track completion status

**Technical Requirements**:
- Bulk assessment distribution API
- Recipient selection logic
- Batch email sending
- Completion tracking

**Acceptance Criteria**:
- AC6.2.1: Can select distribution mode
- AC6.2.2: Preview shows accurate recipient count
- AC6.2.3: Bulk send completes quickly
- AC6.2.4: Completion tracking works
- AC6.2.5: Deadline enforced

**Priority**: P1 (High - assessment scalability)

**Requires**: Block 2 (IAM) and Block 3 (Assessments) enabled

---

## BLOCK 7: PERMISSION RULES ENGINE (OPTIONAL)

### **F7.1: Admin Permission Rule Management**

**Description**: Create/edit/delete permission rules via admin UI.

**Functional Requirements**:
- FR7.1.1: Admin can create permission rule
- FR7.1.2: Rule specifies: resource, action, allowed/denied roles
- FR7.1.3: Rule can include conditions (field-based)
- FR7.1.4: Rule can override system defaults
- FR7.1.5: Admin can edit existing rules
- FR7.1.6: Admin can delete rules
- FR7.1.7: Admin can activate/deactivate rules
- FR7.1.8: Admin can test rule (simulate permission check)

**Technical Requirements**:
- PermissionRule model
- Permission rule CRUD API
- Rule editor UI
- Rule testing interface

**Acceptance Criteria**:
- AC7.1.1: Can create permission rule
- AC7.1.2: Can edit permission rule
- AC7.1.3: Can delete permission rule
- AC7.1.4: Can test rule before activating
- AC7.1.5: Rules listed in admin panel

**Priority**: P2 (Medium - advanced feature)

---

### **F7.2: Dynamic Rule Enforcement**

**Description**: Enforce permission rules at runtime from database.

**Functional Requirements**:
- FR7.2.1: Middleware checks PermissionRule collection before action
- FR7.2.2: Rules evaluated in priority order
- FR7.2.3: First matching rule applied
- FR7.2.4: Falls back to default RBAC if no rules match
- FR7.2.5: Rule evaluation logged (audit trail)
- FR7.2.6: Override system defaults when specified
- FR7.2.7: Conflict detection (warn admin)

**Technical Requirements**:
- Rule enforcement middleware
- Rule evaluation engine
- Default RBAC fallback
- Audit logging

**Acceptance Criteria**:
- AC7.2.1: Rules enforced correctly at runtime
- AC7.2.2: Falls back to defaults when needed
- AC7.2.3: Audit logs capture rule evaluations
- AC7.2.4: Conflicts detected and reported
- AC7.2.5: Performance impact minimal (<10ms)

**Priority**: P2 (Medium - advanced feature)

---

## 🏁 FEATURE FLAGS & GRACEFUL DEGRADATION

### **Feature Flag Configuration**

All optional blocks can be enabled/disabled via environment variables mapped to standardized keys.

**Convention**:
- Environment variables use `ENABLE_*` naming (in .env file)
- Code references use `*_BLOCK` keys (via config/feature-flags.js mapping)

**.env Configuration** (environment variables):
```bash
# Core (always enabled)
ENABLE_CORE_EXECUTION=true

# Optional Blocks (env var names)
ENABLE_IAM=true                   # Company/Teams → IAM_BLOCK
ENABLE_ASSESSMENTS=true           # Assessment System → ASSESSMENT_BLOCK
ENABLE_AI_ENGINE=true             # LLM OKR Generation → AI_ENGINE
ENABLE_PROGRESS_ROLLUP=true       # Automatic aggregation → PROGRESS_ROLLUP
ENABLE_BULK_OPS=true              # Bulk invitations → BULK_OPS
ENABLE_PERMISSION_RULES=false     # Admin-configurable rules → PERMISSION_RULES

# Post-MVP
ENABLE_IBRAIN=false               # Intelligence layer → IBRAIN
```

**config/feature-flags.js** (mapping to code keys):
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

### **Graceful Degradation Matrix**

| Block | Enabled | Disabled (Fallback) |
|-------|---------|---------------------|
| Core Execution | Always on | N/A |
| IAM | Company/team features visible | Solo user mode, hide team filters |
| Assessments | Assessment menu visible | Hide assessment menu, manual OKRs only |
| AI Engine | "Generate OKRs" button visible | Hide button, manual OKRs only |
| Progress Rollup | Auto-aggregation | Manual progress updates only |
| Bulk Ops | Bulk invite modes available | Individual invite only |
| Permission Rules | Dynamic rules from database | Default RBAC hardcoded |

### **UI Conditional Rendering**

```javascript
// Frontend checks feature flags
const FEATURE_FLAGS = await fetch('/api/feature-flags').then(r => r.json());

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

### **Backend Middleware**

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
```

---

## 📱 15 CORE SCREENS

### **Owner Screens (5)**

**S1: Signup & Business Profile**
- Business name, industry, size
- Select archetype (16 options)
- Select strategic priorities (3-5 from 24)
- Create account (email, password)
- Optional: Create company or skip (solo user)

**S2: Take Assessment**
- SSI assessment (30-50 questions)
- Progress indicator
- Help text tooltips
- Save and resume later
- Submit for scoring

**S3: Assessment Results + Generate OKRs**
- Radar chart (Speed/Strength/Intelligence)
- Dimension scores with weak areas
- Question-level breakdown
- "Generate OKRs" button (if Block 4 enabled)
- Link to historical assessments

**S4: Review Generated OKRs**
- List of 4-6 objectives
- Edit objective details
- Edit key results
- Approve or regenerate
- Save to dashboard

**S5: Invite Team**
- Individual invitation form (if Block 6 disabled)
- Bulk invitation modes (if Block 6 enabled)
  - Entire company
  - Specific teams
  - CSV upload
- Preview invitation count
- Send invitations

### **Manager Screens (4)**

**S6: Manager Dashboard**
- Team progress summary
- Team members with task completion rates
- Tasks needing attention (overdue, blocked)
- Team capacity view
- Quick actions

**S7: Manager Planning**
- View company objectives
- Select OKRs to assign to team
- Create goals from key results
- Assign goals to team members
- Set weekly timelines

**S8: Team Management**
- Team member list
- Add/remove members (if IAM enabled)
- Reassign team manager
- View member workloads
- Capacity planning

**S9: Task Assignment**
- Create tasks from goals
- AI suggest tasks button (if Block 4 enabled)
- Assign tasks to team members
- Set priorities and due dates
- Estimated hours

### **Employee Screens (3)**

**S10: Employee Dashboard**
- Top 3 tasks today (due today, high priority)
- My objectives (progress, contribution)
- This week's goals
- Recent updates
- Quick task update

**S11: My Objectives**
- List of assigned objectives
- Progress visualization
- Key results tracking
- Contribution to company goals
- Historical performance

**S12: Task Detail**
- Task information
- Complete button
- Defer button
- Add completion notes
- Time tracking (if enabled)
- Comments/discussion

### **Consultant Screens (2)**

**S13: Consultant Client List**
- All companies with access
- Health scores (overall assessment)
- Recent activity
- Company switcher
- Quick actions per client

**S14: Consultant Company View**
- Same as owner dashboard (read-only)
- Generate OKRs for client
- Assessment comparison across clients
- Multi-company analytics

### **Shared Screens (1)**

**S15: Registration via Invite**
- Pre-filled email from token
- Enter name
- Enter password
- Accept invitation
- Auto-join company/team (if IAM enabled)

---

## 🔌 API REQUIREMENTS

### **API Principles**

- RESTful design (GET, POST, PUT, DELETE)
- JSON request/response format
- JWT authentication on all protected routes
- Rate limiting (100 requests/minute per user)
- Pagination (max 50 items per page)
- Error responses: `{ success: false, message: "...", error: "..." }`
- Success responses: `{ success: true, data: {...} }`

### **Core API Endpoints**

**Authentication** (IAM Engine - Port 8081):
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh JWT token
- POST `/api/auth/logout` - Logout user

**Companies** (IAM Engine - Port 8081):
- POST `/api/companies` - Create company
- GET `/api/companies/:id` - Get company details
- PUT `/api/companies/:id` - Update company
- DELETE `/api/companies/:id` - Delete company
- GET `/api/companies/:id/teams` - Get company teams

**Teams** (IAM Engine - Port 8081):
- POST `/api/teams` - Create team
- GET `/api/teams/:id` - Get team details
- PUT `/api/teams/:id` - Update team
- DELETE `/api/teams/:id` - Delete team
- POST `/api/teams/:id/members` - Add member to team
- DELETE `/api/teams/:id/members/:userId` - Remove member from team

**Invitations** (IAM Engine - Port 8081):
- POST `/api/invitations` - Create invitation
- POST `/api/invitations/bulk` - Bulk invitations (if Block 6 enabled)
- GET `/api/invitations` - List invitations
- PUT `/api/invitations/:id/resend` - Resend invitation
- PUT `/api/invitations/:id/cancel` - Cancel invitation
- POST `/api/invitations/:token/accept` - Accept invitation

**Objectives** (Planner Engine - Port 8083):
- POST `/api/objectives` - Create objective
- GET `/api/objectives` - List objectives (filtered by user/team/company)
- GET `/api/objectives/:id` - Get objective details
- PUT `/api/objectives/:id` - Update objective
- DELETE `/api/objectives/:id` - Delete objective
- POST `/api/objectives/generate` - AI generate objectives (if Block 4 enabled)

**Goals** (Planner Engine - Port 8083):
- POST `/api/goals` - Create goal
- GET `/api/goals` - List goals
- GET `/api/goals/quarterly` - Quarterly goals view
- GET `/api/goals/weekly` - Weekly goals view
- GET `/api/goals/:id` - Get goal details
- PUT `/api/goals/:id` - Update goal
- DELETE `/api/goals/:id` - Delete goal

**Tasks** (Tracking Engine - Port 8086):
- POST `/api/tasks` - Create task
- GET `/api/tasks` - List tasks
- GET `/api/tasks/:id` - Get task details
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- PUT `/api/tasks/:id/complete` - Mark task complete
- POST `/api/tasks/suggest` - AI suggest tasks (if Block 4 enabled)

**Assessments** (Assessment Engine - Port 8082):
- POST `/api/assessments` - Create assessment
- GET `/api/assessments` - List assessments
- GET `/api/assessments/:id` - Get assessment details
- POST `/api/assessments/:id/submit` - Submit assessment responses
- GET `/api/assessments/:id/results` - Get assessment results
- GET `/api/assessments/:id/weak-areas` - Get weak area analysis
- POST `/api/assessments/invite` - Invite users to assessment

**Assessment Templates** (Assessment Engine - Port 8082):
- POST `/api/assessment-templates` - Create template
- GET `/api/assessment-templates` - List templates
- GET `/api/assessment-templates/:id` - Get template details
- PUT `/api/assessment-templates/:id` - Update template
- DELETE `/api/assessment-templates/:id` - Delete template

**Permission Rules** (IAM Engine - Port 8081):
- POST `/api/permission-rules` - Create rule (if Block 7 enabled)
- GET `/api/permission-rules` - List rules (if Block 7 enabled)
- PUT `/api/permission-rules/:id` - Update rule (if Block 7 enabled)
- DELETE `/api/permission-rules/:id` - Delete rule (if Block 7 enabled)

**Feature Flags**:
- GET `/api/feature-flags` - Get enabled feature flags

---

## ⚙️ NON-FUNCTIONAL REQUIREMENTS

### **Performance**

- NFR1: Dashboard loads in <2 seconds (p90)
- NFR2: API response time <200ms (p90)
- NFR3: Assessment submission processes in <500ms
- NFR4: AI OKR generation completes in <30 seconds (p95)
- NFR5: Bulk operations (50 invites) complete in <5 seconds
- NFR6: Database queries optimized with proper indexes
- NFR7: Redis caching for frequently accessed data (5-minute TTL)

### **Scalability**

- NFR8: Support 1000+ concurrent users
- NFR9: Handle 10,000+ objectives per company
- NFR10: Database sharding ready (company-based partitioning)
- NFR11: Horizontal scaling for all 6 engines
- NFR12: CDN for static assets

### **Security**

- NFR13: All passwords hashed with bcrypt (salt rounds: 10)
- NFR14: JWT tokens expire after 1 hour
- NFR15: HTTPS required for all API calls
- NFR16: CORS configured for allowed origins only
- NFR17: Input validation on all endpoints (SQL injection, XSS prevention)
- NFR18: Rate limiting (100 requests/minute per user)
- NFR19: Audit logs for all sensitive operations
- NFR20: Data encrypted at rest (database level)

### **Reliability**

- NFR21: 99% uptime (max 7.2 hours downtime per month)
- NFR22: Automated health checks every 5 minutes
- NFR23: Graceful degradation when services unavailable
- NFR24: Data backup every 24 hours (7-day retention)
- NFR25: Disaster recovery plan (4-hour RTO, 1-hour RPO)

### **Usability**

- NFR26: Mobile-responsive design (works on phones/tablets)
- NFR27: Keyboard navigation support
- NFR28: Loading states for all async operations
- NFR29: Clear error messages with actionable suggestions
- NFR30: Consistent UI/UX across all screens

### **Maintainability**

- NFR31: Code coverage ≥70% (unit + integration tests)
- NFR32: API documentation (OpenAPI/Swagger)
- NFR33: Shared models package versioned (semver)
- NFR34: No hard-coded secrets (env variables only)
- NFR35: Logging (Winston or similar, structured JSON logs)
- NFR36: Monitoring (Sentry for errors, Datadog for metrics)

---

## ✅ ACCEPTANCE CRITERIA

### **Overall Platform**

- AC-P1: Solo user can use platform without creating company (Block 1 only)
- AC-P2: Company user gets full feature set (all 7 blocks if enabled)
- AC-P3: Feature flags work correctly (enable/disable blocks)
- AC-P4: Graceful degradation when blocks disabled
- AC-P5: No critical bugs or data loss
- AC-P6: All 15 screens functional
- AC-P7: All API endpoints operational
- AC-P8: Performance metrics met (NFR1-NFR7)
- AC-P9: Security requirements met (NFR13-NFR20)
- AC-P10: Platform accessible at production URL

### **Block 1: Core Execution**

- AC-B1-1: User can create objective in <30 seconds
- AC-B1-2: User can create goals from key results
- AC-B1-3: User can create tasks from goals
- AC-B1-4: User can update task status
- AC-B1-5: Dashboard shows correct "Top 3 tasks today"
- AC-B1-6: Cascade visible: Objective → KR → Goal → Task

### **Block 2: IAM**

- AC-B2-1: Owner can create company and team in <2 minutes
- AC-B2-2: Individual invitation works correctly
- AC-B2-3: User auto-joins company on invitation acceptance
- AC-B2-4: Consultant can switch between companies
- AC-B2-5: Solo user can skip company creation
- AC-B2-6: Team data isolated by company

### **Block 3: Assessments**

- AC-B3-1: User can complete assessment in <15 minutes
- AC-B3-2: Individual SSI score calculated immediately
- AC-B3-3: Team SSI aggregates correctly (≥80% completion)
- AC-B3-4: Org SSI aggregates correctly (≥70% completion)
- AC-B3-5: Weak areas identified accurately
- AC-B3-6: Existing Assessment Hub functionality preserved

### **Block 4: AI OKR Engine**

- AC-B4-1: Assessment report generated in <1 second
- AC-B4-2: OpenAI generates 4-6 objectives in <30 seconds
- AC-B4-3: Objectives address assessment weak areas
- AC-B4-4: Consultant can edit prompt
- AC-B4-5: Template fallback works when OpenAI fails
- AC-B4-6: Cached results returned in <1 second

### **Block 5: Progress Rollup**

- AC-B5-1: Task completion auto-updates goal progress
- AC-B5-2: Goal progress auto-updates key result
- AC-B5-3: Key result updates objective
- AC-B5-4: Team/org rollups work when IAM enabled
- AC-B5-5: Manual override preserves custom values
- AC-B5-6: Rollup completes in <500ms

### **Block 6: Bulk Operations**

- AC-B6-1: Bulk invite 50 people completes in <5 seconds
- AC-B6-2: Preview shows accurate count
- AC-B6-3: Success/failure report accurate
- AC-B6-4: Bulk assessment distribution works
- AC-B6-5: Completion tracking accurate

### **Block 7: Permission Rules**

- AC-B7-1: Admin can create permission rule
- AC-B7-2: Rule enforced correctly at runtime
- AC-B7-3: Falls back to defaults when disabled
- AC-B7-4: Conflicts detected and reported
- AC-B7-5: Performance impact minimal (<10ms)

### **Beta Launch**

- AC-L1: 5 beta companies onboarded
- AC-L2: 50+ active users (mix of roles)
- AC-L3: 25+ assessments completed
- AC-L4: 100+ OKRs generated via OpenAI
- AC-L5: 2+ consultants managing multiple companies
- AC-L6: Zero critical data loss incidents
- AC-L7: <5% user-reported bugs
- AC-L8: 99% uptime during beta period

---

## 🚀 LAUNCH READINESS CHECKLIST

### **Technical Readiness**

- [ ] All 7 blocks functional with feature flags
- [ ] 6 engines operational with shared models
- [ ] OpenAI generates 4-6 objectives in <5 seconds
- [ ] Goals & Tasks APIs 100% operational
- [ ] 5 roles with correct permissions
- [ ] Docker Compose deployment works (one command)
- [ ] All 15 screens render without errors
- [ ] Performance metrics met (NFR1-NFR7)
- [ ] Security audit passed (NFR13-NFR20)

### **Documentation**

- [ ] User guides (one per role: Owner, Manager, Employee, Consultant)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Deployment guide (production setup)
- [ ] Admin guide (managing users, troubleshooting)
- [ ] Feature flag documentation

### **Infrastructure**

- [ ] Production environment set up (AWS/GCP/Render)
- [ ] Domain + SSL certificate configured
- [ ] Monitoring configured (Sentry, Datadog)
- [ ] Analytics configured (user events, feature usage)
- [ ] Backup and disaster recovery set up
- [ ] Load testing passed (100 concurrent users)

### **Beta Users**

- [ ] 5 beta companies recruited
- [ ] 2 consultants with multi-company access recruited
- [ ] Onboarding sessions scheduled (demo + training)
- [ ] Feedback collection mechanism ready
- [ ] Support channel established (email/Slack)

---

**Document Owner**: Product & Engineering Team
**Last Updated**: October 23, 2025
**Version**: 3.0
**Status**: Implementation Ready
**Launch Target**: January 31, 2026
