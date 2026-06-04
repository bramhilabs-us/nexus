# 🚀 KARVIA OKR - MVP STRATEGY

**Version**: 5.0 (Modular Block Architecture)
**Launch Target**: January 31, 2026
**Duration**: 12 Weeks (Post-Week 0)
**Status**: ✅ Locked for Implementation

---

## 📋 EXECUTIVE SUMMARY

Karvia OKR is a modular OKR platform built as independent "Lego Blocks." Each block enhances functionality without blocking core execution. The platform works standalone for solo users and scales to enterprise teams with optional IAM, assessments, AI generation, and predictive analytics.

### **Modular Architecture Philosophy**

**Core Principle**: Block 1 (Core Execution) works with ZERO other blocks enabled. Every additional block is optional and can be enabled/disabled via feature flags.

**Why This Matters**:
- Solo users get immediate value without complex setup
- Companies can start simple, add complexity later
- External parties can deploy only needed blocks
- Each block can be improved independently
- No feature interdependencies = faster iteration

### **What Makes Karvia Different**

**KARVIA PRO** (MVP - 12 Weeks):
- Fully functional OKR platform (7 modular blocks)
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

---

## 🎯 PRODUCT VISION

### **The Problem We Solve**

Most OKR platforms fail because:
1. **Generic OKRs**: One-size-fits-all templates ignore business context
2. **No Strategic Alignment**: OKRs disconnected from actual business needs
3. **Manager Overwhelm**: Planning takes 10+ hours per quarter
4. **Employee Confusion**: Teams don't understand why tasks matter
5. **No Predictive Power**: Can't see failures coming until too late

### **Our Solution**

**Karvia Core** solves problems 1-4:
- **Strategic Assessment** → Generates contextual OKRs based on business archetype and weaknesses
- **AI Generation** → Manager planning time: <20 minutes (vs 10+ hours manually)
- **Clear Cascade** → Objective → Key Results → Goals → Tasks (employees see "why")
- **Template Fallback** → Always works, even without OpenAI

**iBrain** solves problem 5:
- **Predictive Analytics** → Flags at-risk objectives 2 weeks before failure
- **Sentiment Analysis** → Detects team burnout early
- **AI Coaching** → Provides corrective actions proactively

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
- Invitation system (email-based)
- Team assignment and filtering
- Company-level data isolation
- Multi-company access (consultants)
- Bulk invitation system (company/team/individual modes)

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

### **Block 3: Assessment System** 📊

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

### **Block 4: AI OKR Engine** 🤖

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

### **Block 5: Progress Rollup** 📈

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

### **Block 6: Bulk Operations** 📧

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

### **Block 7: Permission Rules Engine** 🔒

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

**Implementation**: Week 0 prerequisite (see [../00_Prerequisites/](../00_Prerequisites/))

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

## 🎨 iBRAIN ADMIN TOGGLE SYSTEM

### **Business Model Schema Extension**

```javascript
// @karvia/shared-models/models/Business.js
const businessSchema = new mongoose.Schema({
  // ... existing fields

  ibrain_config: {
    enabled: { type: Boolean, default: false },
    api_url: { type: String },
    api_key: { type: String },
    subscription_plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free'
    },
    features: {
      predictive: { type: Boolean, default: false },
      sentiment: { type: Boolean, default: false },
      coaching: { type: Boolean, default: false },
      workflows: { type: Boolean, default: false },
      customML: { type: Boolean, default: false },
      advancedDashboards: { type: Boolean, default: false }
    },
    subscription_start_date: { type: Date },
    subscription_end_date: { type: Date }
  }
});
```

### **Admin Panel UI**

```html
<!-- client/pages/admin/ibrain-settings.html -->
<div class="ibrain-settings">
  <h2>iBrain Features</h2>
  <p class="subtitle">Enable or disable proprietary AI enhancements for your organization.</p>

  <!-- Feature Toggle Card -->
  <div class="toggle-card">
    <div class="toggle-header">
      <div>
        <h3>📊 Predictive Analytics</h3>
        <p class="feature-description">Predict at-risk objectives 2 weeks in advance</p>
      </div>
      <label class="switch">
        <input type="checkbox" id="toggle-predictive"
               checked="{{ ibrainFeatures.predictive }}"
               onchange="updateIBrainFeature('predictive', this.checked)">
        <span class="slider"></span>
      </label>
    </div>
    <div class="feature-details" v-if="ibrainFeatures.predictive">
      <ul>
        <li>At-risk objective detection (2-week advance warning)</li>
        <li>Team burnout prediction</li>
        <li>Success probability scoring</li>
      </ul>
      <p class="status active">Status: Active</p>
    </div>
  </div>

  <!-- Repeat for 5 other features -->
  <!-- Sentiment Analysis, AI Coaching, Workflow Automation, Custom ML, Advanced Dashboards -->
</div>
```

### **Backend API**

```javascript
// server/routes/ibrain-settings.js
const express = require('express');
const router = express.Router();
const { Business } = require('@karvia/shared-models');
const { authenticate, authorize } = require('../middleware/auth');

// Get current iBrain configuration
router.get('/config', authenticate, authorize(['super_admin', 'company_admin']), async (req, res) => {
  const business = await Business.findById(req.user.business_id);

  res.json({
    success: true,
    data: business.ibrain_config
  });
});

// Toggle specific iBrain feature
router.put('/toggle-feature', authenticate, authorize(['super_admin', 'company_admin']), async (req, res) => {
  const { feature, enabled } = req.body;

  const validFeatures = ['predictive', 'sentiment', 'coaching', 'workflows', 'customML', 'advancedDashboards'];
  if (!validFeatures.includes(feature)) {
    return res.status(400).json({ success: false, message: 'Invalid feature name' });
  }

  const business = await Business.findById(req.user.business_id);
  business.ibrain_config.features[feature] = enabled;
  await business.save();

  res.json({
    success: true,
    message: `Feature '${feature}' ${enabled ? 'enabled' : 'disabled'}`,
    data: business.ibrain_config.features
  });
});

module.exports = router;
```

### **Graceful Degradation**

When iBrain features are disabled, the platform still works:

| Feature | Enabled | Disabled (Fallback) |
|---------|---------|---------------------|
| **Predictive Analytics** | At-risk flags 2 weeks early | Manual progress tracking only |
| **Sentiment Analysis** | Daily mood tracking, trends | No sentiment data |
| **AI Coaching** | Multi-turn coaching conversations | Static help articles |
| **Workflows** | Automated task creation, escalation | Manual task creation only |
| **Custom ML** | Fine-tuned models per archetype | Generic OpenAI models |
| **Advanced Dashboards** | Predictive, executive, analytics | Basic progress dashboards only |

**UI Behavior**: Disabled features are hidden from navigation (users don't see incomplete features).

---

## 🗓️ IMPLEMENTATION TIMELINE

### **WEEK 0: PREREQUISITES (5 Days - BLOCKING)**

**CRITICAL**: MVP Week 1 cannot start until Week 0 is complete.

**Day 1-2: Shared Models Migration**
- [ ] Setup npm workspaces
- [ ] Create `packages/shared-models/` package
- [ ] Move Business, User, Objective models to shared package
- [ ] Create Goal, Task, Invitation models
- [ ] Test shared package (`npm test --workspace=@karvia/shared-models`)

**Day 3-4: Feature Flags & Standalone Mode**
- [ ] Create `server/services/feature-flags.js`
- [ ] Implement OpenAI config with template fallback
- [ ] Implement Redis config with in-memory fallback
- [ ] Implement iBrain config with webhook bypass
- [ ] Create `.env.standalone` template

**Day 5: Docker & Security**
- [ ] Fix `Dockerfile.engines` (shared-models copy)
- [ ] Fix `docker-compose.yml` (healthchecks, remove invalid volumes)
- [ ] Create `scripts/generate-secrets.sh`
- [ ] Remove all hard-coded secrets
- [ ] Test full deployment: `docker-compose up`

**Acceptance Criteria**:
- ✅ All engines use `@karvia/shared-models`
- ✅ No `require('../../server/models')` in codebase
- ✅ `docker-compose up` starts all services successfully
- ✅ No hard-coded secrets in codebase

**See**: [../00_Prerequisites/README.md](../00_Prerequisites/README.md)

---

### **WEEK 1-2 (Sprint 1): GOALS + TASKS + OPENAI**

**Focus**: Complete OKR cascade (Objective → Goals → Tasks) and OpenAI integration.

**Backend**:
- [ ] Implement Goal model in shared-models
- [ ] Implement Task model in shared-models
- [ ] Complete `server/routes/goals.js` (all CRUD endpoints)
- [ ] Complete `server/routes/tasks.js` (all CRUD endpoints)
- [ ] Update Tracking Engine to use shared models
- [ ] Create `engines/planner/services/openai-service.js`
- [ ] Implement OKR generation endpoint (GPT-4 with caching)
- [ ] Implement AI task suggestions endpoint
- [ ] Add fallback to template-based OKRs

**Frontend**:
- [ ] Goals management UI
- [ ] Tasks management UI
- [ ] AI OKR generation button (loading states)
- [ ] AI task suggestion button

**Testing**:
- [ ] Test cascade: Objective → Key Result → Goal → Task
- [ ] Test OpenAI generation (various archetypes)
- [ ] Test template fallback (when OpenAI fails)
- [ ] Test caching (Redis)

**Acceptance Criteria**:
- ✅ Manager can create goals from key results
- ✅ Manager can create tasks from goals
- ✅ Employee can view assigned tasks
- ✅ OpenAI generates 4-6 quality objectives in <5s
- ✅ Fallback works when OpenAI unavailable

**Output**: Complete Objective → Goal → Task cascade with AI generation

---

### **WEEK 3-4 (Sprint 2): BUSINESS + INVITATIONS**

**Focus**: Business archetype configuration and team invitation system.

**Backend**:
- [ ] Expand Business model: 16 archetypes enum
- [ ] Add strategic_preferences field (24 focus areas)
- [ ] Add preference_priority field (primary/secondary)
- [ ] Create Invitation model in shared-models
- [ ] Implement invitation-service in IAM engine
- [ ] Add invitation endpoints (create, validate, accept)
- [ ] Update signup flow to capture archetype + preferences

**Frontend**:
- [ ] Owner signup: Archetype selector
- [ ] Owner signup: Strategic preferences checkboxes
- [ ] Owner invite: Team member invitation form
- [ ] Registration: Token-based signup flow
- [ ] Email template for invitations

**Testing**:
- [ ] Test OKR generation with different archetypes
- [ ] Test invitation flow end-to-end
- [ ] Test token expiration
- [ ] Test duplicate invitation handling

**Acceptance Criteria**:
- ✅ Owner selects archetype and preferences during signup
- ✅ OpenAI uses archetype + preferences for OKR generation
- ✅ Owner can invite team members via email
- ✅ Invitee receives email with registration link
- ✅ Token-based registration creates user account

**Output**: Complete onboarding flow with team invitations

---

### **WEEK 5-6 (Sprint 3): DASHBOARDS + ROLES**

**Focus**: Role-based UI and 15 core screens.

**Backend**:
- [ ] Implement role-based authorization middleware
- [ ] Update IAM engine with permission matrix
- [ ] Test permissions (users can only access authorized data)
- [ ] Implement consultant multi-company logic

**Frontend (15 Core Screens)**:

**Owner (5 screens)**:
- [ ] Signup & Business Profile
- [ ] Take Assessment
- [ ] Assessment Results + Generate OKRs button
- [ ] Review Generated OKRs (edit, approve)
- [ ] Invite Team

**Manager (4 screens)**:
- [ ] Manager Dashboard (team progress, tasks)
- [ ] Manager Planning (select OKRs, assign goals)
- [ ] Team Management (team members, capacity)
- [ ] Task Assignment (AI suggest tasks)

**Employee (3 screens)**:
- [ ] Employee Dashboard (my 3 tasks today)
- [ ] My Objectives (progress, contribution)
- [ ] Task Detail (complete, defer, comment)

**Consultant (2 screens)**:
- [ ] Consultant Client List (all companies, health scores)
- [ ] Consultant Company View (same as owner dashboard)

**Shared (1 screen)**:
- [ ] Registration via Invite (token-based)

**Testing**:
- [ ] Test all 15 screens render without errors
- [ ] Test role-based navigation
- [ ] Test data isolation (companies can't see each other's data)
- [ ] Test consultant company switcher

**Acceptance Criteria**:
- ✅ All 15 screens functional and data-bound
- ✅ Role-based navigation (employees don't see admin features)
- ✅ Consultant can switch companies (dropdown)
- ✅ Manager can assign goals and tasks to team
- ✅ Employee sees personalized task view

**Output**: Complete role-based user experience

---

### **WEEK 7 (Sprint 4 - Part 1): TESTING**

**Focus**: Integration testing, performance optimization, security audit.

**End-to-End Flows**:
- [ ] Owner flow: Signup → Assessment → Generate OKRs → Invite team
- [ ] Manager flow: Register → Select OKRs → Assign goals → Create tasks (AI suggested)
- [ ] Employee flow: Register → View tasks → Complete tasks
- [ ] Consultant flow: Add company → Generate OKRs for client
- [ ] Multi-company flow: Consultant switches between companies

**Bug Fixes & Edge Cases**:
- [ ] Test with missing data (empty assessments, no objectives)
- [ ] Test with large data (1000 objectives, 10000 tasks)
- [ ] Test concurrent access (multiple managers editing same goal)
- [ ] Test OpenAI failures (fallback to templates)
- [ ] Test invitation expiry and reuse

**Performance Optimization**:
- [ ] Database query optimization (add indexes)
- [ ] API response time testing (<200ms p90)
- [ ] Frontend load time testing (<2s dashboard load)
- [ ] OpenAI rate limiting (prevent abuse)

**Security Audit**:
- [ ] Test authorization (users can't access other companies' data)
- [ ] Test input validation (SQL injection, XSS)
- [ ] Test JWT token expiry and refresh
- [ ] Test invitation token security

**Acceptance Criteria**:
- ✅ All user flows work end-to-end
- ✅ No critical bugs or data loss
- ✅ Performance meets targets (<2s dashboard, <200ms API)
- ✅ Security audit passes (no unauthorized access)

**Output**: Stable, tested MVP ready for beta users

---

### **WEEK 8 (Sprint 4 - Part 2): LAUNCH PREPARATION**

**Focus**: Documentation, beta onboarding, production deployment.

**Documentation**:
- [ ] User guides (one per role: Owner, Manager, Employee, Consultant)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Deployment guide (production setup)
- [ ] Admin guide (managing users, troubleshooting)

**Beta User Onboarding**:
- [ ] Recruit 5 beta companies
- [ ] Recruit 2 consultants with multi-company access
- [ ] Onboarding sessions (demo + training)
- [ ] Feedback collection mechanism

**Production Deployment**:
- [ ] Set up production environment (AWS/GCP/Render)
- [ ] Configure domain + SSL certificate
- [ ] Set up monitoring (Sentry, Datadog, or similar)
- [ ] Set up analytics (user events, feature usage)
- [ ] Set up backup and disaster recovery
- [ ] Load testing (simulate 100 concurrent users)

**Launch Checklist**:
- [ ] All services deployed and healthy
- [ ] Domain resolves correctly
- [ ] SSL certificate valid
- [ ] Email delivery working
- [ ] OpenAI integration working (with API key quotas)
- [ ] Monitoring alerts configured
- [ ] Beta users can access platform
- [ ] Support channel established (email/Slack)

**Acceptance Criteria**:
- ✅ Platform accessible at production URL
- ✅ 5 beta companies onboarded
- ✅ 50+ users registered (owners, managers, employees)
- ✅ 25+ assessments completed
- ✅ 100+ OKRs generated via OpenAI
- ✅ Zero data loss or downtime during launch week

**Output**: 🚀 Live MVP with beta users, Nov 30, 2025

---

## 📊 SUCCESS METRICS

### **Technical Metrics**
- ✅ All 15 core screens functional
- ✅ OpenAI generates 4-6 objectives in <5 seconds
- ✅ Goals & Tasks APIs 100% operational
- ✅ 5 roles with correct permissions
- ✅ Docker Compose deployment works (one command)
- ✅ 99% uptime during beta period
- ✅ <2s dashboard load time (p90)
- ✅ <200ms API response time (p90)

### **User Experience Metrics**
- ✅ Owner onboarding: <30 minutes (signup → generate OKRs)
- ✅ Assessment completion rate: >80%
- ✅ Manager planning time: <20 minutes (assign goals + tasks)
- ✅ Employee clarity: 4.5/5 (understand why tasks matter)

### **Business Metrics**
- ✅ 5 beta companies onboarded
- ✅ 50+ active users (mix of roles)
- ✅ 25+ assessments completed
- ✅ 100+ OKRs generated via OpenAI
- ✅ 2+ consultants managing multiple companies
- ✅ Zero critical data loss incidents
- ✅ <5% user-reported bugs

---

## ❌ OUT OF SCOPE (DEFERRED TO BETA)

These features are planned for Beta release (Q1 2026):

**Assessment Enhancements**:
- ❌ 5 additional assessment templates
- ❌ Custom template builder
- ❌ Custom formula editor
- ❌ Template marketplace

**iBrain Features** (all 6 features deferred to Beta):
- ❌ Predictive analytics
- ❌ Sentiment & reflection system
- ❌ AI coaching assistant
- ❌ Workflow automation
- ❌ Custom ML models
- ❌ Advanced dashboards

**Collaboration**:
- ❌ Task comments & discussions
- ❌ Real-time collaboration (WebSocket)
- ❌ Slack/Teams integrations
- ❌ Mobile apps (iOS/Android)

**Advanced Admin**:
- ❌ Granular permissions (custom roles)
- ❌ Sub-teams and hierarchies
- ❌ Advanced consultant tools
- ❌ Custom domain + white-label

**Analytics**:
- ❌ Gantt charts
- ❌ Time tracking
- ❌ Advanced analytics dashboards

**See**: [../02_Beta/](../02_Beta/) for full Beta roadmap

---

## 🎯 CRITICAL SUCCESS FACTORS

### **1. Week 0 Must Complete**
Infrastructure fixes are prerequisite. Feature work does NOT start until deployment works.

### **2. Shared Models Architecture**
This is the foundation. All engines must use `@karvia/shared-models` before any new features.

### **3. OpenAI as Differentiator**
This is what makes Karvia unique. Must work reliably with fallback to templates.

### **4. Security Non-Negotiable**
No hard-coded secrets, all envs validated at startup, fail-fast if misconfigured.

### **5. 15 Screens, Not More**
Stay focused. Every additional screen is scope creep.

### **6. iBrain Separation**
Admin toggle system must work. External party gets Karvia Core, iBrain stays proprietary.

### **7. Beta Feedback Loop**
Beta users must provide weekly feedback. Adjust based on real usage.

---

## 🔗 PRODUCT POSITIONING

### **For External Party (Receiving Karvia Core)**

**What They Get**:
- Complete OKR platform (not a skeleton or proof-of-concept)
- 6 microservice engines (production-ready)
- AI-powered OKR generation (customer provides OpenAI key)
- Template fallback (works without AI)
- Team management (5 roles, invitations)
- Production deployment (Docker Compose)
- Full source code

**Value Proposition**:
"A **really good** OKR platform with AI capabilities. Competitive with established players like Weekdone, Profit.co, Perdoo."

**What They Don't Get** (Proprietary iBrain):
- Predictive analytics
- Sentiment analysis
- AI coaching
- Workflow automation
- Custom ML models
- Advanced dashboards

---

### **For Customers (Buying Karvia + iBrain)**

**Karvia Core (Really Good)**:
"Assessment-driven OKR platform that reduces manager planning time from 10+ hours to <20 minutes."

**+ iBrain (Exceptional)**:
"Predictive AI that flags at-risk objectives 2 weeks before failure, with sentiment analysis and automated coaching."

**Pricing Tiers** (example - to be finalized):
- **Free**: Karvia Core (self-hosted, customer provides OpenAI key)
- **Starter** ($500/month): Karvia Core + Hosted + Support
- **Professional** ($2000/month): + iBrain (Predictive Analytics, Sentiment Analysis)
- **Enterprise** ($5000/month): + All iBrain Features (Custom ML, Advanced Dashboards)

---

## 📝 OPEN QUESTIONS

### **1. Frontend Stack**
**Question**: MVP uses static HTML. Is React/Vite build planned post-MVP?
**Decision Needed By**: Week 7 (before Beta planning)

### **2. iBrain Deployment**
**Question**: Will iBrain features run as separate service or extend existing engines?
**Decision Needed By**: Week 0 (affects architecture)

### **3. Email Service**
**Question**: Use SendGrid, AWS SES, Mailgun, or similar for invitation emails?
**Decision Needed By**: Week 0 (configure in `.env`)

### **4. Production Hosting**
**Question**: AWS, GCP, or Render for MVP production deployment?
**Decision Needed By**: Week 6 (time for Week 8 deployment planning)

### **5. iBrain Admin Panel Access**
**Question**: Can Super Admin toggle iBrain for any business, or only Company Admin for their own?
**Decision Needed By**: Week 3 (before dashboard implementation)

---

## 🔗 RELATED DOCUMENTS

**Implementation Guides**:
- [MVP_PRD.md](./MVP_PRD.md) - Detailed product requirements
- [MVP_USER_STORIES.md](./MVP_USER_STORIES.md) - 65 user stories across 5 personas
- [MVP_TECHNICAL_ARCHITECTURE.md](./MVP_TECHNICAL_ARCHITECTURE.md) - System design
- [MVP_API_SPECIFICATION.md](./MVP_API_SPECIFICATION.md) - API contracts

**Sprint Plans**:
- [MVP_SPRINT_1.md](./MVP_SPRINT_1.md) - Week 1-2: Goals + Tasks + OpenAI
- [MVP_SPRINT_2.md](./MVP_SPRINT_2.md) - Week 3-4: Business + Invitations
- [MVP_SPRINT_3.md](./MVP_SPRINT_3.md) - Week 5-6: Dashboards + Roles
- [MVP_SPRINT_4.md](./MVP_SPRINT_4.md) - Week 7-8: Testing + Launch

**Prerequisites**:
- [../00_Prerequisites/README.md](../00_Prerequisites/README.md) - Week 0 setup

**Beta Planning**:
- [../02_Beta/](../02_Beta/) - Post-MVP features (Q1 2026)

---

**Document Owner**: Product & Engineering Team
**Last Updated**: October 1, 2025
**Status**: ✅ LOCKED FOR IMPLEMENTATION
**Launch Target**: 🚀 November 30, 2025
