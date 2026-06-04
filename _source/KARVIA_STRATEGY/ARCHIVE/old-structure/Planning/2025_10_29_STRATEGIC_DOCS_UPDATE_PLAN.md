# 📋 Strategic Documents Update Plan - Modular "Lego Blocks" Architecture

**Created**: October 23, 2025
**Updated**: October 23, 2025 (Revision 2 - Fixed inconsistencies from review)
**Purpose**: Document exact changes to align all strategic documents with modular block architecture
**Status**: Ready to Execute

---

## 🔧 REVISION 2 FIXES (Based on User Review)

**HIGH Priority Fixes**:
1. ✅ **7 blocks (not 8)**: Removed "Block 8: Admin Control Panel" - admin UI is just a consolidated management layer for the other 7 blocks, not a standalone block. Updated all references from 8→7 blocks.

2. ✅ **Assessment Hub clarification**: Changed "DO NOT ALTER" to "Preserve all existing functionality, refactor internal model for extensibility (backward compatible)". Clarified we're changing internal schema (hardcoded SSI → dynamic dimensions) but all existing UI/features continue working.

3. ✅ **PRD mandatory assessment language**: Added explicit instruction to DELETE lines 12-14 in MVP_PRD.md that say "Every employee, manager, and executive takes assessments... foundation for accurate OKR generation" and replace with optional language.

**MEDIUM Priority Fixes**:
4. ✅ **Feature flag naming convention**: Standardized to `ENABLE_*` (env vars in .env) → `*_BLOCK` (code keys in config/feature-flags.js). Added explicit mapping documentation.

5. ✅ **Week naming consistency**: Changed "Week 6.5-7" to separate **"Week 7"** (5 days - IAM) and **"Week 7.5"** (2.5 days - AI LLM). Updated all references, progress bars, and user story assignments to use consistent naming.

---

## 🎯 EXECUTIVE SUMMARY

### What We're Building:

**KARVIA PRO** = Fully functional OKR platform (7 modular blocks + 6 microservice engines)
**iBRAIN** = Intelligence layer (post-MVP) that enhances Karvia Pro with behavioral nudging, predictive analytics, AI coaching

### The Key Insight:

**Karvia Pro is COMPLETE without iBrain. iBrain makes it EXCEPTIONAL.**

The 7 modular blocks are UI/feature modules that can be enabled/disabled. All 7 blocks communicate with the 6 backend engines (IAM, Assessment, Planner, Scoring, Observer, Tracking). In MVP, these engines process requests with basic logic. Post-MVP, iBrain adds intelligence/nudging to these engines.

**Note**: Admin functionality (feature flags, permission management, iBrain toggle) is not a separate block—it's a consolidated UI layer for managing the other blocks.

---

## 🧩 THE 7 MODULAR BLOCKS

### Block 1: Core Execution (REQUIRED) ✅
**Status**: Weeks 1-6 (mostly complete, Week 6 frontend pending)
**What**: Individual OKR management (Objective → Goal → Task → Progress)
**Works Without**: Companies, teams, assessments, AI, other users
**Preserves**: All existing code from Weeks 1-6

### Block 2: IAM - Company & Teams (OPTIONAL) 🔄
**Status**: Week 5 partial, Week 7 complete
**What**: Multi-user companies with role-based access (5 roles)
**Includes**: All FR1.2.1-1.2.6 requirements (company creation, teams, bulk invitations)
**Feature Flag**: `ENABLE_IAM=true|false`
**Graceful Degradation**: If disabled, users work as solo accounts
**Key Point**: Solo users can skip company creation, but company features are strongly recommended

### Block 3: Assessment System ✅
**Status**: Week 4 complete (Assessment Hub) - **Preserve all existing functionality**
**What**: Strategic questionnaires (SSI, 360, Skills, Custom)
**Enhancement**: Week 7 - Refactor internal model for extensibility (backward compatible)
- Change: Internal schema (hardcoded SSI fields → dynamic dimensions array)
- Preserve: All existing Assessment Hub UI, features, scoring logic work unchanged
- Approach: Additive schema migration (existing assessments continue to work)

### Block 4: AI OKR Engine ✅
**Status**: Week 4 complete (basic), Week 7.5 enhance
**What**: LLM-powered OKR generation from assessment data
**Enhancement**: Add consultant-editable prompts, better OpenAI integration
**Preserves**: Existing template fallback system

### Block 5: Progress Rollup ⚠️
**Status**: Manual updates exist, add automatic rollup
**What**: Task → Goal → Key Result → Objective progress cascade
**Implementation**: Week 8 (post-save hooks)
**Preserves**: Existing manual progress update functionality

### Block 6: Bulk Operations 🆕
**Status**: New feature (Week 7)
**What**: Bulk invitations (company/team/individual modes), bulk assessments
**Uses**: Existing Invitation and Assessment models, just adds batch operations
**Preserves**: Existing individual invitation flow

### Block 7: Permission Rules Engine 🆕
**Status**: New feature (Week 10)
**What**: Admin-configurable permission rules (database-stored, not hardcoded)
**Enhances**: Existing RBAC system, falls back to defaults when disabled
**Preserves**: All existing auth/permissions

**Note on Admin UI**: Admin functionality (feature flags, permission management, iBrain toggle) will be built as a consolidated management layer in Week 11, but is NOT a separate block. It's a UI for managing the 7 blocks above.

---

## 🏗️ THE 6 BACKEND ENGINES

### Current Role (MVP): Process Requests
All engines handle CRUD operations, store data, basic business logic. **No intelligence/nudging in MVP.**

| Engine | Port | MVP Role | Post-MVP + iBrain |
|--------|------|----------|-------------------|
| **IAM** | 8081 | Auth, user/company/team management, invitations | + Engagement tracking, stuck user detection |
| **Assessment** | 8082 | SSI scoring, multi-level aggregation | + Comparative analysis, benchmark nudges |
| **Planner** | 8083 | OKR generation (AI + templates) | + Continuous optimization, pattern-based suggestions |
| **Scoring** | 8084 | Progress calculation, health scoring | + Risk prediction, failure warnings |
| **Observer** | 8085 | Activity logging, audit trails | + Pattern detection, anomaly alerts |
| **Tracking** | 8086 | Time tracking, progress updates | + Velocity analysis, stall detection |

### iBrain Integration (Post-MVP):
```javascript
// Example: Observer Engine checking iBrain status
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
      data
    });
    // iBrain responds with nudges/recommendations (async)
  }
}
```

**Key Point**: The 6 engines are backend infrastructure. In MVP, they're "dumb" processors. Post-MVP, iBrain makes them "smart."

---

## 📊 ARCHITECTURAL PRINCIPLES

### 1. **Preserve All Existing Work** ✅
- Week 1-5 code: **UNTOUCHED**
- Assessment Hub: **DO NOT ALTER** (just enhance extensibility)
- Week 6 backend (Goal model, routes): **UNTOUCHED**
- Only ADD features, never REPLACE

### 2. **Additive Architecture** ✅
- New blocks ADD features, never break existing ones
- Optional fields (team_id, company_id) are truly optional
- Feature flags hide/show UI, don't break code

### 3. **Backward Compatibility** ✅
- Solo users work without company creation
- Goals work without team_id
- Assessments work without bulk operations
- Core Execution works with ZERO other blocks enabled

### 4. **iBrain as Enhancement Layer** ✅
- MVP: Karvia Pro fully functional (8 blocks + 6 engines with basic logic)
- Post-MVP: iBrain toggle adds intelligence to existing engines
- No iBrain code in MVP (just placeholder for toggle in Business model)

### 5. **Lego Philosophy** ✅
- Each block can be enabled/disabled independently
- Solo user vs Company user journeys both supported
- Feature flags control UI rendering and API availability

---

## 🔄 WHAT ARE WE CHANGING AND WHY?

### CHANGE 1: Reframe from "Tier Model" to "Modular Block Model"
**Why**: Current docs describe features as "Tier 1/2/3 always available." This contradicts the Lego philosophy where blocks are optional (except Block 1).

**Impact**:
- MVP_STRATEGY.md: Replace Tier 1/2/3 with Block 1-8 descriptions
- Emphasize Block 1 works standalone, other blocks enhance

### CHANGE 2: Make IAM (Company/Teams) Optionally Skippable
**Why**: Solo users should be able to use Karvia Pro without creating companies. But company features (FR1.2.1-1.2.6) are still fully built and strongly recommended.

**Impact**:
- MVP_STRATEGY.md: Document solo user journey vs company user journey
- MVP_PRD.md: Keep all FR1.2.1-1.2.6 requirements, but add graceful degradation notes
- Signup flow: User chooses "Just Me" vs "Create Company"

### CHANGE 3: Preserve Assessment Hub, Add Extensibility
**Why**: Assessment Hub already works (Week 4 complete). Don't break it. Just refactor to support multiple assessment types (SSI, 360, Skills, Custom) via dynamic dimensions.

**Impact**:
- MVP_PRD.md: Add F1.3 "Modular Assessment Framework" (refactor existing, not rewrite)
- MVP_STRATEGY.md: Add section explaining assessment modularity
- Code: Week 7 refactors Assessment model to use dynamic dimensions array (additive change)

### CHANGE 4: Upgrade to Real LLM Integration
**Why**: Current AI OKR generation is template-based with OpenAI wrapper. Upgrade to true LLM-powered generation with consultant-editable prompts.

**Impact**:
- MVP_PRD.md: Replace F2.1 with detailed LLM integration requirements
- MVP_STRATEGY.md: Document prompt builder, report generator, structured JSON parsing
- Code: Week 7.5 builds OpenAI integration properly (uses existing fallback system)

### CHANGE 5: Add iBrain as Post-MVP Enhancement
**Why**: iBrain is NOT built in MVP. It's a future toggle that adds intelligence to the 6 engines. Docs should clarify this.

**Impact**:
- MVP_STRATEGY.md: Add "Post-MVP: iBrain Integration" section
- Document how iBrain enhances each engine (Observer, Scoring, Planner, etc.)
- Add toggle mechanism in Business model (placeholder for future)

### CHANGE 6: Extend Timeline to 12 Weeks
**Why**: Adding IAM Block (company/teams/bulk ops) and proper LLM integration requires more time.

**Impact**:
- MASTER_DEV_LIST.md: Change from 8 weeks to 12 weeks
- Add **Week 7** (5 days - IAM Block)
- Add **Week 7.5** (2.5 days - AI OKR Engine LLM enhancement)
- Update progress bars to show both Week 7 and Week 7.5 separately

**Naming Convention**: Use "Week 7" and "Week 7.5" consistently throughout all documents, folders, and progress tracking.

### CHANGE 7: Add 8 New User Stories for Week 7 and Week 7.5
**Why**: New features need user stories.

**Impact**:
- MVP_USER_STORIES.md: Add stories for Week 7 (IAM) and Week 7.5 (LLM)
  - Week 7: ADMIN-011, ADMIN-012, MGR-028, CONS-011, CONS-013 (5 stories)
  - Week 7.5: CONS-012, EXEC-019, CONS-014 (3 stories)

---

## 📄 DOCUMENTS TO UPDATE

### 1. MVP_STRATEGY.md
**File**: `/Karvia_OKR_Product_Planning/01_MVP/MVP_STRATEGY.md`
**Current Version**: 4.0
**Target Version**: 5.0
**Changes**: 15 major changes

### 2. MVP_PRD.md
**File**: `/Karvia_OKR_Product_Planning/01_MVP/MVP_PRD.md`
**Current Version**: 2.1
**Target Version**: 3.0
**Changes**: 8 major changes

### 3. MVP_USER_STORIES.md
**File**: `/Karvia_OKR_Product_Planning/01_MVP/MVP_USER_STORIES.md`
**Current Version**: 3.1.0
**Target Version**: 3.2.0
**Changes**: Add 8 new stories for Week 6.5-7

### 4. MASTER_DEV_LIST.md
**File**: `/Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md`
**Current Version**: 4.1.0
**Target Version**: 5.0
**Changes**: Update Week 6 status, add Week 6.5-7, extend to 12 weeks

---

## 📝 DETAILED CHANGES BY DOCUMENT

---

## 1️⃣ MVP_STRATEGY.md Updates (Version 5.0)

### CHANGE 1.1: Update Executive Summary (Lines 10-32)
**Replace entire "What Makes Karvia Different" section**

**New Content**:
```markdown
### **Modular Architecture Philosophy**

**Core Principle**: Block 1 (Core Execution) works with ZERO other blocks enabled. Every additional block is optional and can be enabled/disabled via feature flags.

**KARVIA PRO** (MVP - 12 Weeks):
- Fully functional OKR platform (8 modular blocks)
- 6 microservice engines (IAM, Assessment, Planner, Scoring, Observer, Tracking)
- Works standalone for solo users OR scales to enterprise teams
- Assessment-driven OKR generation (LLM-powered with template fallback)
- Complete company/team management (optional)
- Bulk invitation system
- Admin-configurable permission rules

**iBRAIN** (Post-MVP Enhancement):
- Intelligence layer that enhances existing 6 engines
- Behavioral nudging ("Task overdue - need help?")
- Predictive analytics (78% risk of failure)
- Pattern detection (velocity dropped 20%)
- AI coaching conversations
- Sentiment analysis (burnout detection)
- Automated recommendations

**Toggle Mechanism**: Admin can enable iBrain via Business model config. When enabled, engines send events to iBrain API for analysis and receive nudges/recommendations.
```

**Why**: Current summary describes Tier 1/2/3 model. New version emphasizes modular blocks and clarifies iBrain is post-MVP.

---

### CHANGE 1.2: Replace Product Architecture Section (Lines 61-142)
**Delete "Tier 1/2/3" sections entirely**

**New Content**: "The 8 Modular Blocks"

```markdown
## 🎯 THE 8 MODULAR BLOCKS

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

**Status**: Weeks 1-6 (mostly complete, Week 6 frontend pending)

**Feature Flag**: `ENABLE_CORE_EXECUTION=true` (always enabled)

---

### **Block 2: IAM - Identity & Access Management (OPTIONAL)** 🔄

**What It Does**: Multi-user companies with role-based access control.

**Features**:
- **FR1.2.1**: Company creation (name, industry, size, archetype, strategic focus)
- **FR1.2.2**: Company-Team hierarchy (Company → Teams → Members)
- **FR1.2.3**: Team management (CRUD operations, manager assignment)
- **FR1.2.4**: Member management (add/remove from teams)
- **FR1.2.5**: Automatic company association (via invitation)
- **FR1.2.6**: Bulk invitation system (company/team/individual modes)
- 5 roles: Owner, Manager, Employee, Consultant, Super Admin
- Consultant multi-company access (company switcher dropdown)

**Enhancement to Core**:
- User can have `companies` array (optional field)
- Goals can have `team_id` (optional field)
- Tasks can have `team_id` (optional field)
- Dashboard shows team filters (if IAM enabled)

**Graceful Degradation**:
- If disabled: Team filters hidden from UI
- If disabled: Users work as solo accounts
- If disabled: No company dropdown

**User Journeys**:
1. **Solo User**: Skips company creation, works alone (Block 1 only)
2. **Company Owner**: Creates company, invites team (Block 1 + 2)
3. **Invited Employee**: Joins via invitation, auto-assigned to company/team (Block 1 + 2)
4. **Consultant**: Multi-company access, company switcher (Block 1 + 2 + multi-tenant)

**Status**: Week 5 partial (teams exist), Week 7 complete (companies, bulk ops)

**Feature Flag**: `ENABLE_IAM=true|false` (default: true)

**Database Changes** (additive only):
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

### **Block 3: Assessment System** ✅

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

**Status**: Week 4 complete (Assessment Hub) - **DO NOT ALTER EXISTING CODE**

**Enhancement**: Week 7 - Refactor for modularity
- Change Assessment model to use dynamic dimensions array (not hardcoded Speed/Strength/Intelligence)
- Add assessment_type enum
- Add dimension weight editor (consultant feature)
- Make scoring service type-agnostic

**Preserves**: All existing Assessment Hub functionality

**Feature Flag**: `ENABLE_ASSESSMENTS=true|false` (default: true)

**Graceful Degradation**:
- If disabled: Assessment menu hidden
- If disabled: OKRs created manually (no assessment-driven generation)

---

### **Block 4: AI OKR Engine** ✅

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

**Preserves**: Existing template fallback system

**Feature Flag**: `ENABLE_AI_ENGINE=true|false` (default: true, but requires OpenAI key)

**Graceful Degradation**:
- If disabled: No "Generate OKRs" button
- If OpenAI fails: Uses template-based generation
- If no assessment: Manual OKR creation only

---

### **Block 5: Progress Rollup** ⚠️

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

**Preserves**: Existing manual progress updates

**Feature Flag**: `ENABLE_PROGRESS_ROLLUP=true|false` (default: true)

**Graceful Degradation**:
- If disabled: Manual progress updates only
- If disabled: No automatic rollup

---

### **Block 6: Bulk Operations** 🆕

**What It Does**: Bulk invitation and assessment distribution.

**Features**:
- **FR1.2.6**: Bulk invitation system:
  - Mode 1: Entire Company (invite all existing members)
  - Mode 2: Specific Teams (select teams, invite all members)
  - Mode 3: Individual Emails (CSV upload, existing flow)
- Preview: "27 invitations will be sent"
- Bulk assessment sending (same modes)
- Email domain auto-grouping

**Requirements**:
- Requires Block 2 (IAM) for company/team context

**Status**: Week 7 (new feature)

**Uses**: Existing Invitation and Assessment models (just adds batch operations)

**Feature Flag**: `ENABLE_BULK_OPS=true|false` (default: true)

**Graceful Degradation**:
- If disabled: Individual invitation only (existing flow)

---

### **Block 7: Permission Rules Engine** 🆕

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

**Preserves**: All existing RBAC (defaults remain)

**Feature Flag**: `ENABLE_PERMISSION_RULES=true|false` (default: false)

**Graceful Degradation**:
- If disabled: Uses default RBAC (hardcoded in middleware)

---

### **Block 8: Admin Control Panel** ⚠️

**What It Does**: Centralized admin UI for feature management.

**Features**:
- Feature flag toggles (enable/disable blocks)
- Permission rule management (Block 7 UI)
- iBrain toggle (for future)
- User management dashboard
- System health monitoring

**Status**: Week 11 (consolidate existing scattered features)

**Uses**: Existing APIs (just creates unified UI)

**Preserves**: All existing admin functionality

---
```

**Why**: Replaces tier model with detailed block descriptions. Each block has clear status, feature flag, graceful degradation, and preserves existing work.

---

### CHANGE 1.3: Add "The 6 Backend Engines" Section
**Insert after Block 8, before Timeline**

**New Content**:
```markdown
## 🏗️ THE 6 BACKEND ENGINES

### **Architecture Overview**

The 6 microservice engines are the backend infrastructure that ALL blocks access. In MVP, engines handle CRUD operations with basic business logic. Post-MVP, iBrain adds intelligence/nudging to these engines.

```
┌─────────────────────────────────────────┐
│         8 Frontend Blocks               │
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

All engines use `@karvia/shared-models` instead of `../../server/models`.

**Models in Shared Package**:
- Business, User, Objective, Goal (new), Task (new), Invitation (enhanced)
- Assessment, AssessmentTemplate, AssessmentResult
- Activity, Update
- Company (new), Team (enhanced), PermissionRule (new)

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
```

**Why**: Clarifies relationship between blocks (frontend), engines (backend), and iBrain (intelligence layer).

---

### CHANGE 1.4: Update Timeline to 12 Weeks
**Replace entire "IMPLEMENTATION TIMELINE" section (Lines ~318-566)**

**New Content**: 12-week timeline with detailed week-by-week breakdown
- Week 0: Prerequisites (unchanged)
- Week 1-2: Core Execution (Block 1)
- Week 3-4: Assessment System (Block 3) - already complete
- Week 5: Teams + Objectives UI - already complete
- Week 6: Goal Management backend - 50% complete, finish frontend
- Week 7: IAM Block (Block 2) - Company/Teams/Bulk Ops
- Week 7.5: AI OKR Engine enhancement (Block 4) - Real LLM integration
- Week 8: Progress Rollup (Block 5)
- Week 9: Dashboards & Testing
- Week 10: Permission Rules (Block 7)
- Week 11: Admin Panel (Block 8) + Integration Testing
- Week 12: Launch Preparation

**Include detailed acceptance criteria for each week**

**Why**: Current timeline is 8 weeks. New features (IAM, LLM, Permissions) require 12 weeks.

---

### CHANGE 1.5: Add "Post-MVP: iBrain Integration" Section
**Insert after Timeline, before Success Metrics**

**New Content**:
```markdown
## 🧠 POST-MVP: iBRAIN INTEGRATION (Week 13+)

### **What is iBrain?**

iBrain is an intelligence layer that enhances Karvia Pro's 6 backend engines with behavioral nudging, predictive analytics, and AI coaching. It does NOT replace any engines—it adds a webhook/event system that engines can optionally send data to for analysis.

### **How iBrain Enhances Each Engine**:

**Observer Engine Enhancement**:
- MVP: Just logs activities (user_id, action, timestamp)
- + iBrain: Analyzes patterns, detects anomalies, triggers nudges
- Example: "John hasn't updated tasks in 5 days - suggest check-in"

**Planner Engine Enhancement**:
- MVP: Generates OKRs from assessment (one-time)
- + iBrain: Continuously suggests adjustments based on progress patterns
- Example: "Similar companies adjusted objectives at Week 6 - suggest review"

**Scoring Engine Enhancement**:
- MVP: Calculates progress % (simple math)
- + iBrain: Predicts risk of failure, suggests mitigation
- Example: "78% probability this objective will fail - recommend breaking into smaller goals"

**Tracking Engine Enhancement**:
- MVP: Records time/progress updates
- + iBrain: Detects stalled tasks, suggests interventions
- Example: "Task 'Build API' stalled for 5 days - last time this happened, pair programming helped"

**Assessment Engine Enhancement**:
- MVP: Calculates SSI scores (Speed/Strength/Intelligence)
- + iBrain: Compares to industry benchmarks, suggests improvements
- Example: "Your Speed score (42%) is below industry average (58%) - companies improved by X"

**IAM Engine Enhancement**:
- MVP: Auth, permissions, role checks
- + iBrain: Detects stuck users, suggests training, monitors engagement
- Example: "Sarah logged in but didn't complete any actions in 3 sessions - suggest onboarding video"

### **Toggle Mechanism**:

```javascript
// Business model enhancement
const businessSchema = new mongoose.Schema({
  // ... existing fields

  ibrain_enabled: { type: Boolean, default: false }, // MASTER TOGGLE

  ibrain_config: {
    api_url: String, // iBrain service URL
    api_key: String, // Authentication
    webhook_secret: String, // For secure callbacks

    enabled_features: {
      behavioral_nudges: Boolean,
      predictive_analytics: Boolean,
      pattern_detection: Boolean,
      ai_coaching: Boolean,
      sentiment_analysis: Boolean,
      automated_recommendations: Boolean
    },

    subscription_plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    }
  }
});
```

### **Implementation Plan** (4 Weeks Post-MVP):

**Week 13: iBrain API Setup**
- [ ] Build iBrain event ingestion API
- [ ] Build analysis pipeline (patterns, anomalies)
- [ ] Build nudge recommendation engine

**Week 14: Engine Integration**
- [ ] Update 6 engines to check `business.ibrain_enabled`
- [ ] Add event publishing to iBrain API
- [ ] Handle async responses (nudges, recommendations)

**Week 15: Admin UI**
- [ ] Build iBrain toggle in Admin Panel
- [ ] Feature-level toggles (predictive, coaching, etc.)
- [ ] Usage dashboard (events sent, nudges received)

**Week 16: Testing & Beta**
- [ ] Test with iBrain enabled/disabled
- [ ] Validate graceful degradation
- [ ] Beta test with 2-3 companies

---
```

**Why**: Clarifies iBrain is post-MVP and shows how it integrates with existing engines.

---

### CHANGE 1.6: Update Launch Target Date
**Change from November 30, 2025 → March 15, 2026**

**Why**: 12-week timeline requires updated target.

---

## 2️⃣ MVP_PRD.md Updates (Version 3.0)

### CHANGE 2.1: Update Product Overview (Lines 34-60)
**Step 1: Delete mandatory assessment language (Lines 12-14)**

**Current problematic text**:
```markdown
**Multi-Level Assessment System**: Every employee, manager, and executive takes assessments.
Individual scores aggregate to team scores, which aggregate to organizational SSI scores.
This is the foundation for accurate OKR generation at all levels.
```

**Delete entire section above** and replace with:

```markdown
**Assessment-Driven OKR Generation**: While assessments (Block 3) are strongly recommended for
contextual, data-driven OKRs, the platform supports manual OKR creation when the Assessment Block
is disabled. Multi-level assessment aggregation (individual → team → org) is available when both
Block 3 (Assessments) and Block 2 (IAM) are enabled.
```

**Step 2: Replace "Product Tiers" section (Lines 40-60)**

**New Content**:
```markdown
### **Product Architecture**

**Karvia Pro** = 7 modular blocks + 6 backend engines (fully functional standalone)
**iBrain** = Intelligence layer (post-MVP) that enhances engines with nudging

**The 7 Blocks**:
1. Core Execution (REQUIRED)
2. IAM - Company & Teams (OPTIONAL, but strongly recommended)
3. Assessment System (OPTIONAL, but strongly recommended)
4. AI OKR Engine (OPTIONAL, requires OpenAI key)
5. Progress Rollup (OPTIONAL)
6. Bulk Operations (OPTIONAL, requires Block 2)
7. Permission Rules Engine (OPTIONAL)

**Admin UI**: Consolidated management layer for feature flags, permissions, iBrain toggle (not a separate block)

**The 6 Engines** (backend):
- IAM, Assessment, Planner, Scoring, Observer, Tracking
- MVP: Process requests with basic logic
- Post-MVP + iBrain: Add intelligence, nudging, predictions

**Solo User Journey**: Can use Block 1 (+ optional 3, 4, 5) without creating company
**Company User Journey**: Gets all 7 blocks (full feature set)
```

**Why**: Aligns PRD with 7-block architecture and removes mandatory assessment language.

---

### CHANGE 2.2: Update Permission Matrix (Lines 89-112)
**Keep single version (IAM enabled) as requested**

**Add note at top of matrix**:
```markdown
### **Permission Matrix** (IAM Block Enabled)

**Note**: This matrix assumes IAM Block is enabled (companies/teams exist). If IAM disabled:
- Users work as solo accounts
- Company/team columns don't apply
- All users default to EMPLOYEE role with full self-management permissions
```

**Keep existing matrix unchanged**

**Why**: You requested single version (IAM enabled), just add clarifying note.

---

### CHANGE 2.3: Rewrite F1.2 (Lines ~152-223)
**Replace entire F1.2 section**

**New Content**: Use the FR1.2.1-1.2.6 structure from your selection
- FR1.2.1: Company Creation
- FR1.2.2: Company-Team Hierarchy
- FR1.2.3: Team Management
- FR1.2.4: Member Management
- FR1.2.5: Automatic Company Association
- FR1.2.6: Bulk Invitation System

**Include all technical requirements, acceptance criteria from your provided text**

**Add at end**:
```markdown
**Graceful Degradation** (if IAM Block disabled):
- Company creation step skipped in signup
- Users work as solo accounts
- Team filters hidden from UI
- Bulk operations unavailable
- Core Execution (Block 1) still fully functional
```

**Why**: Incorporates all your detailed IAM requirements while preserving Lego philosophy.

---

### CHANGE 2.4: Add F1.3 Modular Assessment Framework
**Insert after F1.2**

**New Content**:
```markdown
---

### **F1.3: Modular Assessment Framework** ⭐ **ENHANCEMENT - Week 7**

**Description**: Refactor existing Assessment Hub to support multiple assessment types via dynamic dimensions (not hardcoded SSI).

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

**FR1.3.1: Assessment Type Enum**
- Add `assessment_type` field to AssessmentTemplate model
- Enum values: "SSI", "360", "Skills", "Custom"
- Default: "SSI" (backward compatible)

**FR1.3.2: Dynamic Dimensions Schema**
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

**FR1.3.3: Dimension Weight Editor** (Consultant Feature)
- UI: Sliders for each dimension
- Constraint: Total must equal 100%
- Save custom weights to template
- Results use custom weights in scoring

**FR1.3.4: Type-Agnostic Scoring**
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
- AC1.3.1: Existing SSI assessments still work (backward compatible)
- AC1.3.2: Can create SSI assessment with custom weights (Speed: 50%, others: 25%)
- AC1.3.3: Scoring service calculates correctly for any dimension set
- AC1.3.4: (Future) Can add 360 Feedback type without code changes

**Priority**: P1 (High - enables future extensibility)

**Implementation**: Week 7 (2 days)

**Preserves**: All existing Assessment Hub functionality (DO NOT BREAK)

---
```

**Why**: Documents the enhancement plan while preserving existing work.

---

### CHANGE 2.5: Rewrite F2.1 AI-Generated OKRs
**Replace entire F2.1 section**

**New Content**: Use the detailed LLM integration requirements:
- FR2.1.1: Report Generation
- FR2.1.2: Dynamic Prompt Building
- FR2.1.3: Consultant Prompt Customization
- FR2.1.4: LLM Integration
- FR2.1.5: Response Parsing
- FR2.1.6: Template Fallback

**Include all technical requirements, acceptance criteria**

**Why**: Upgrades from template-based to real LLM integration.

---

### CHANGE 2.6: Add Feature Flag Section
**Insert after all feature requirements, before API Requirements**

**New Content**:
```markdown
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
| Admin Panel | Feature toggles visible | (N/A - admin always has access) |

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
```

**Why**: Documents how feature flags work and graceful degradation behavior.

---

## 3️⃣ MVP_USER_STORIES.md Updates (Version 3.2.0)

### CHANGE 3.1: Add Week 7 and Week 7.5 Stories Sections
**Insert after Week 6 stories**

**New Content - Week 7: IAM Block** (5 stories):
- ADMIN-011: Create Company Account [Week 7]
- ADMIN-012: Auto-Associate Users to Company [Week 7]
- MGR-028: Create Team in Company [Week 7]
- CONS-011: Send Bulk Invitations [Week 7]
- CONS-013: Switch Between Client Companies [Week 7]

**New Content - Week 7.5: AI OKR Engine + Modular Assessment** (3 stories):
- CONS-012: Adjust Assessment Dimension Weights [Week 7.5]
- EXEC-019: Edit AI Prompt Before Generation [Week 7.5]
- CONS-014: Compare Assessment Scores Across Teams [Week 7.5]

**Total: 8 new user stories**

**Include full acceptance criteria, story points, screens for each**

**Why**: New features need user stories with detailed acceptance criteria, organized by week (7 and 7.5).

---

## 4️⃣ MASTER_DEV_LIST.md Updates (Version 5.0)

### CHANGE 4.1: Update Overall Progress Summary
**Replace progress bars (Lines ~100)**

**New Content**:
```markdown
**Week 0-4**: ████████████████░░░░░░░░░░░░░░ 60% Complete (Setup + Assessment)
**Week 5**: ██████████████████████████████ 100% Complete (Teams + Objectives UI)
**Week 6**: ███████████████░░░░░░░░░░░░░░░ 50% Complete (Goals backend done, frontend missing)
**Week 7**: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% Complete (IAM Block) ⬅️ NEW
**Week 7.5**: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% Complete (AI OKR Engine) ⬅️ NEW
**Week 8-12**: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% Complete (Rollup, Dashboards, Permissions, Testing, Launch)
```

**Why**: Reflects 12-week timeline and new Week 7/7.5.

---

### CHANGE 4.2: Update Week 6 Status
**Replace Week 6 section**

**New Content**:
```markdown
## ⚠️ WEEK 6: GOAL MANAGEMENT (Backend Complete, Frontend Missing)
**Status**: ⚠️ 50% COMPLETE
**Duration**: 5 days
**Completion Date**: [Date when frontend finished]

**What Was Built** (Week 6 - Backend):
- ✅ Goal model (542 lines) - excellent quality, 6 compound indexes, 4 virtuals, 6 instance methods
- ✅ Goal routes (576 lines) - 11 API endpoints (CRUD + quarterly/weekly views)
- ✅ Scoring Engine integration - health calculation, overdue detection

**What's Missing** (Week 6 - Frontend):
- ❌ goals-api.js (Goals API client, ~200 lines)
- ❌ goals-controller.js (Frontend controller, ~350 lines)
- ❌ quarterly_goals.html (Quarterly goals page, ~400 lines)
- ❌ goal_details.html (Goal detail modal, ~300 lines)
- ❌ weekly_goals.html (Weekly view, ~300 lines)
- ❌ assignment_modal.html (Task assignment, ~200 lines)
- ❌ goal_rollup_widget.js (Dashboard widget, ~150 lines)
- ❌ CSS updates (goal cards, filters, ~150 lines)

**Detailed Audit**: [WEEK_6_AUDIT_REPORT.md](../WEEK_6_AUDIT_REPORT.md)
**Implementation TODOs**: [WEEK_6_IMPLEMENTATION_TODOS.md](../WEEK_6_IMPLEMENTATION_TODOS.md)

**Next Steps**: Complete all 8 frontend files (estimated 5 days / 40 hours)

**User Stories**: MGR-019 through MGR-027
```

**Why**: Accurately reflects current status (50% complete).

---

### CHANGE 4.3: Add Week 7 (IAM Block)
**Insert after Week 6**

**New Content**:
```markdown
---

## 🆕 WEEK 7: IAM BLOCK - COMPANY & TEAMS
**Status**: ⬜ NOT STARTED
**Duration**: 5 days
**Focus**: Multi-company, multi-team infrastructure with bulk operations

**Why This Week**: Foundation for scalable organization management. Enables consultants to manage multiple companies, owners to manage teams, bulk invitations at scale.

**Deliverables**:

**Day 1: Company Model & Creation Flow** (8 hours)
- [ ] Company model (name, industry, size, archetype, strategic_focus)
- [ ] Company CRUD endpoints
- [ ] Company creation UI flow (signup enhancement)
- [ ] First user → Company Owner (automatic role assignment)
- [ ] Company name uniqueness validation

**Day 2: Company-Team Hierarchy** (8 hours)
- [ ] Enhanced Team model (add company_id, enhance existing Week 5 team code)
- [ ] User.companies array (multi-company support)
- [ ] Goal.team_id, Goal.company_id (optional fields)
- [ ] Task.team_id, Task.company_id (optional fields)
- [ ] Team creation UI (company context)

**Day 3: Member Management** (8 hours)
- [ ] Add members to team API
- [ ] Remove members from team API
- [ ] Reassign team manager API
- [ ] Member management UI
- [ ] Team member list with role badges

**Day 4: Bulk Invitation System** (8 hours)
- [ ] Invitation model enhancement (recipient_type enum: company/team/individual)
- [ ] Bulk invite API (3 modes: company, teams, individual)
- [ ] Bulk invite UI (mode selector, preview)
- [ ] CSV upload processor
- [ ] Email domain grouping

**Day 5: Multi-Company Context** (8 hours)
- [ ] Automatic company association (invitation → user → company)
- [ ] Consultant company switcher dropdown
- [ ] Context filter (all queries scoped to current company)
- [ ] Company dropdown in navigation bar
- [ ] Testing & bug fixes

**User Stories**: ADMIN-011, ADMIN-012, MGR-028, CONS-011, CONS-013 (5 stories)

**Detailed Plan**: [Daily_Handoffs/Week_7/WEEK_7_PLAN.md](./Daily_Handoffs/Week_7/WEEK_7_PLAN.md) (to be created)

**Priority**: P0 (Blocking - required for Week 8+)

**Acceptance Criteria**:
- ✅ Owner can create company and first team in <2 minutes
- ✅ Bulk invite 50 people completes in <5 seconds
- ✅ Consultant can switch between 3 companies via dropdown
- ✅ Solo user can skip company creation and use Block 1 only

---
```

**Why**: Documents new Week 7 with detailed day-by-day plan.

---

### CHANGE 4.4: Add Week 7.5 (AI OKR Engine Enhancement)
**Insert after Week 7**

**New Content**:
```markdown
---

## 🆕 WEEK 7.5: AI OKR ENGINE - LLM INTEGRATION
**Status**: ⬜ NOT STARTED
**Duration**: 2.5 days
**Focus**: Real LLM-powered OKR generation (upgrade from template-based)

**Why This Week**: Current AI OKR generation is template-based with OpenAI wrapper. Upgrade to true LLM integration with consultant-editable prompts and structured output parsing.

**Deliverables**:

**Day 1: Report Generator & Prompt Builder** (8 hours)
- [ ] Report generator service (assessment data → structured text report)
- [ ] Prompt builder service (report + company profile + custom instructions → AI prompt)
- [ ] Default prompt template (includes company, assessment, instructions)
- [ ] Prompt validation (max 4000 chars, required fields)

**Day 2: OpenAI Integration** (8 hours)
- [ ] OpenAI SDK integration (openai npm package)
- [ ] Structured output mode (JSON schema enforcement)
- [ ] Response parser (JSON → Objective/KeyResult models)
- [ ] Retry logic (2 retries on failure)
- [ ] Fallback to templates (if all retries fail)
- [ ] Caching (Redis, assessment results as cache key)

**Day 3 (Half): Consultant Prompt Editor** (4 hours)
- [ ] Prompt preview modal (shows full prompt before generation)
- [ ] Editable textarea (consultant can customize prompt)
- [ ] Focus area input ("Focus on cost reduction")
- [ ] Tone selector ("Aggressive" vs "Conservative")
- [ ] Timeline selector ("Next quarter" vs "Next year")
- [ ] Character counter (4000 max)

**User Stories**: EXEC-019, CONS-012 (2 stories)

**Detailed Plan**: [Daily_Handoffs/Week_7.5/WEEK_7.5_PLAN.md](./Daily_Handoffs/Week_7.5/WEEK_7.5_PLAN.md) (to be created)

**Priority**: P0 (Critical - core value proposition)

**Preserves**: Existing template fallback system (Week 4 code)

**Acceptance Criteria**:
- ✅ Generated OKRs address assessment weak areas
- ✅ Consultant can edit prompt and see changes in output
- ✅ System falls back to templates if OpenAI fails
- ✅ OKRs include lineage link to source assessment
- ✅ Full generation completes in <30 seconds

---
```

**Why**: Documents LLM enhancement work.

---

### CHANGE 4.5: Update Week 8-12 Summary
**Replace remaining week sections to match 12-week timeline**

**New Content**:
- Week 8: Progress Rollup (Block 5)
- Week 9: Dashboards & Role-Based UI
- Week 10: Permission Rules Engine (Block 7)
- Week 11: Admin Panel (Block 8) + Integration Testing
- Week 12: Launch Preparation

**Include brief summaries for each week**

**Why**: Completes 12-week timeline.

---

## ✅ EXECUTION CHECKLIST

### Phase 1: Document Updates (3-4 hours)
- [ ] 1.1: Update STRATEGIC_DOCS_UPDATE_PLAN.md (this document) ✅ IN PROGRESS
- [ ] 1.2: Update MVP_STRATEGY.md (Version 5.0) - 6 major changes
- [ ] 1.3: Update MVP_PRD.md (Version 3.0) - 6 major changes
- [ ] 1.4: Update MVP_USER_STORIES.md (Version 3.2.0) - Add 8 stories
- [ ] 1.5: Update MASTER_DEV_LIST.md (Version 5.0) - Add Week 7/7.5, update progress

### Phase 2: Validation (30 min)
- [ ] 2.1: Review all docs for consistency
- [ ] 2.2: Check cross-references work
- [ ] 2.3: Verify version numbers updated
- [ ] 2.4: Check all links valid

### Phase 3: Implementation Prep (1 hour)
- [ ] 3.1: Create Week_7 folder structure
- [ ] 3.2: Create WEEK_7_PLAN.md (detailed day-by-day)
- [ ] 3.3: Create Week_7.5 folder structure
- [ ] 3.4: Create WEEK_7.5_PLAN.md (detailed day-by-day)

---

## 📌 KEY ARCHITECTURAL DECISIONS (LOCKED)

### ✅ Confirmed Decisions:
1. **Grouping**: Company name-based (not email domain)
2. **Assessment Types**: Enum-based (SSI, 360, Skills, Custom) - not plugin system yet
3. **LLM Prompts**: Hybrid (good default + consultant editing)
4. **Minimal Code Changes**: Build on existing Weeks 1-6 work (DO NOT BREAK)
5. **Assessment Hub**: Keep as is, just add extensibility (DO NOT ALTER EXISTING)
6. **Timeline**: 12 weeks (extended from 8 to accommodate IAM + LLM)
7. **IAM Block**: Optional but strongly recommended (solo users can skip)
8. **iBrain**: Post-MVP enhancement layer (not built in MVP, just placeholder toggle)
9. **6 Engines**: Backend infrastructure accessed by all blocks
10. **Modular Blocks**: 8 frontend feature modules (can enable/disable independently)

### 🚫 What We're NOT Changing:
- ✅ Existing Week 1-5 code (all working, leave untouched)
- ✅ Assessment Hub (Week 4 complete, just enhance for modularity)
- ✅ Week 6 backend (Goal model + routes excellent quality)
- ✅ Overall 6-engine microservice architecture
- ✅ Shared models package approach
- ✅ Docker Compose deployment

### 🆕 What We're Adding:
- Company creation workflow (FR1.2.1-1.2.6)
- Bulk invitation modes (company/team/individual)
- Modular assessment framework (refactor existing for extensibility)
- Real LLM integration (upgrade from template-based)
- Consultant prompt editing
- Multi-company context switching
- Permission rules engine (admin-configurable)
- Admin control panel (consolidated UI)
- iBrain toggle mechanism (placeholder for post-MVP)

---

**Document Owner**: Product & Engineering Team
**Last Updated**: October 23, 2025
**Status**: ✅ Ready to Execute
**Next Step**: Start updating MVP_STRATEGY.md (Change 1.1-1.6)
