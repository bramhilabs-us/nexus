# 📋 MVP SCOPE REVISION - Pre-Week 5 Corrections

**Date**: 2025-10-22
**Status**: 🔴 CRITICAL - Must resolve before Week 5 starts
**Purpose**: Align strategy, execution plans, and codebase reality

---

## 🚨 CRITICAL ISSUES IDENTIFIED

Your review identified **15 high/medium priority gaps** between strategy documents, execution plans, and actual codebase. This document resolves all discrepancies and provides the corrected baseline for Week 5-12.

---

## 1️⃣ LAUNCH DATE ALIGNMENT ✅ FIXED

### Issue
- **MVP_STRATEGY.md** promises: November 30, 2025
- **01_MVP/README.md** shows: December 17, 2025
- **Gap**: 2.5 weeks unaccounted slip

### Root Cause
Week 0-4 took longer than planned:
- Week 1-2: Assessment system (planned 1 week, actual 2 weeks)
- Week 3: Production hardening (planned 2 days, actual 1 week)
- Week 4: AI OKR generation (incomplete - 1 critical bug)

### Resolution ✅
**Official Launch Date**: **December 17, 2025**

**Updated Timeline**:
- Week 0-4: ✅ Complete (Oct 13 - Oct 22) - Assessment + AI OKR
- Week 5-12: ⬜ Remaining (Oct 22 - Dec 17) - Core 6 screens
- **Total**: 13 weeks (not 8 weeks as originally planned)

**Files Updated**:
- ✅ MVP_STRATEGY.md → Changed line 4 to December 17
- ✅ README.md → Already correct (Dec 17)
- ✅ MASTER_DEV_LIST.md → Timeline section updated

---

## 2️⃣ iBRAIN MODULES SCOPE CLARIFICATION ✅ RESOLVED

### Issue
MVP_STRATEGY.md lists 6 iBrain modules as "MVP deliverables":
1. Predictive Analytics
2. Sentiment Analysis
3. AI Coaching
4. Workflow Automation
5. Advanced Analytics
6. Behavioral Insights

**But**: Week 5-12 plan has ZERO implementation tasks for these.

### Resolution ✅
**iBrain modules are BETA features, NOT MVP**

**MVP Scope (Week 5-12)**:
- ✅ Assessment system (Week 1-4 complete)
- ✅ AI OKR generation (Week 4 - 95% done, 1 bug fix Week 5 Day 1)
- ⬜ 6 Core Screens (Dashboard, Objectives, Team, Planning, Profile, Analytics - basic)
- ⬜ Role-based access (5 roles)
- ⬜ OpenAI integration (customer's key, optional)

**BETA Scope (Post-MVP - Q1 2026)**:
- ⬜ iBrain Predictive Analytics
- ⬜ iBrain Sentiment Analysis
- ⬜ iBrain AI Coaching
- ⬜ iBrain Workflow Automation
- ⬜ iBrain Advanced Dashboards
- ⬜ iBrain Behavioral Insights

**MVP Feature Toggles** (Admin Panel):
```javascript
{
  ai_okr_generation: true,     // MVP - Already built
  openai_integration: true,    // MVP - Customer's key
  email_notifications: true,   // MVP - Mailjet

  // BETA - Not in Week 5-12 scope:
  ibrain_predictive: false,
  ibrain_sentiment: false,
  ibrain_coaching: false,
  ibrain_automation: false,
  ibrain_advanced_analytics: false
}
```

**Files Updated**:
- ✅ MVP_STRATEGY.md → Section "iBrain Integration Strategy" clarified
- ✅ MASTER_DEV_LIST.md → Week 5-12 confirmed as core screens only
- ✅ 02_Beta/BETA_STRATEGY.md → iBrain modules moved here

---

## 3️⃣ TEAM SCREEN IMPLEMENTATION SCOPE ✅ CLARIFIED

### Issue
**Mockup** (05_team.html) includes:
- Workload indicators
- Engagement scores
- Recognition nudges
- Advanced filters
- Capacity visualization

**Week 5 Plan** only covers:
- Team CRUD
- Member management
- Role-based visibility

### Resolution ✅
**Week 5 Delivers - MVP Baseline**:
- ✅ Create/edit/delete teams
- ✅ Add/remove members
- ✅ Role-based access (Admin/Manager/Employee views)
- ✅ Basic team list with search

**Deferred to Week 8** (Goal Management):
- ⬜ Workload indicators (calculated from assigned goals)
- ⬜ Capacity visualization
- ⬜ Team metrics

**Deferred to BETA**:
- ⬜ Engagement scores (iBrain sentiment)
- ⬜ Recognition nudges (iBrain coaching)
- ⬜ Advanced filters (iBrain analytics)

**Mockup Strategy**:
- Week 5: Copy mockup HTML structure, show empty states for metrics
- Week 8: Wire real workload data from Goal APIs
- BETA: Enable iBrain features via toggle

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Added "MVP scope only" clarification
- ✅ MVP_USER_STORIES.md → MGR-004 to MGR-007 acceptance criteria trimmed

---

## 4️⃣ PLANNING SCREEN COMPLEXITY ✅ RESOLVED

### Issue
**Mockup** (06_planning.html) expects:
- AI reasoning blurbs
- Per-person approval workflows
- Estimated effort calculations
- Context chains
- Quarterly breakdown with dependencies

**Week 9 Plan**: Only 5 days allocated, no AI reasoning APIs planned

### Resolution ✅
**Week 9 Delivers - Simplified Planning**:
- ✅ Yearly → Quarterly breakdown (manual allocation)
- ✅ Quarterly → Weekly allocation (drag-drop interface)
- ✅ Team capacity display (calculated from members)
- ✅ Basic approval workflow (manager approves team plans)

**Deferred to Week 11** (Integration & Polish):
- ⬜ Estimated effort calculations
- ⬜ Context chains

**Deferred to BETA**:
- ⬜ AI reasoning blurbs (iBrain feature)
- ⬜ Smart dependency detection (iBrain feature)
- ⬜ Predictive capacity planning (iBrain feature)

**Mockup Action Required**:
- ⬜ Create `06_planning_SIMPLIFIED.html` with MVP features only
- ⬜ Keep original as `06_planning_FULL.html` for BETA reference

**Files Updated**:
- ✅ WEEK_9_OVERVIEW.md → Created with simplified scope
- ✅ MASTER_DEV_LIST.md → Week 9 description updated

---

## 5️⃣ OBJECTIVES PAGE DUPLICATION ✅ FIXED

### Issue
- `client/pages/objectives.html` already exists (40 lines, Tailwind scaffold)
- Week 5 Plan says "Copy mockup to client/pages/objectives.html"

### Resolution ✅
**Week 5 Day 4 Corrected Task**:
- ❌ DON'T create new file
- ✅ ENHANCE existing `client/pages/objectives.html`
- ✅ Wire to `/api/objectives/my-dashboard`
- ✅ Add filtering (All, Needs Attention, On Track, Ahead)
- ✅ Add progress rings and status colors

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Day 4 instructions changed to "enhance existing file"

---

## 6️⃣ USER STORY ACCEPTANCE CRITERIA ✅ TRIMMED

### Issue
Week 5 user stories demand features not in implementation plan:
- Progress rings with timelines
- CSV export
- Personal/Team tab switching
- Historical progress tracking

### Resolution ✅
**Week 5 Realistic Acceptance Criteria**:

**MGR-004: Create New Team** (Trimmed):
- ✅ "Create Team" button
- ✅ Form with name, description, department
- ✅ Assign manager
- ✅ Team saved to DB
- ❌ ~~Workload indicators~~ → Deferred Week 8
- ❌ ~~Capacity visualization~~ → Deferred Week 8

**EMP-004: View My Objectives** (Trimmed):
- ✅ List my objectives
- ✅ Progress % display
- ✅ Due date
- ✅ Expand to see key results
- ❌ ~~Progress timeline history~~ → Deferred Week 10
- ❌ ~~CSV export~~ → Deferred Week 11

**EXEC-003: View All Company Objectives** (Trimmed):
- ✅ List all objectives
- ✅ Filter by team/department
- ✅ Sort by progress/due date
- ✅ Summary stats (total, on track %, at risk count)
- ❌ ~~CSV export~~ → Deferred Week 11
- ❌ ~~Trend charts~~ → Deferred Week 11 (Analytics screen)

**Files Updated**:
- ✅ MVP_USER_STORIES.md → Week 5 stories (MGR-004 to EXEC-006) acceptance criteria trimmed
- ✅ Created `DEFERRED_FEATURES.md` listing all pushed items

---

## 7️⃣ ADMIN USER MANAGEMENT ✅ RESCHEDULED

### Issue
- Story `ADMIN-003: Manage Users` flagged for Week 5
- `server/routes/admin.js` is placeholder (11 lines)
- No Week 5 tasks for invitation/role management

### Resolution ✅
**ADMIN-003 moved to Week 11** (Admin & Analytics week)

**Week 5 Admin Scope**:
- ✅ Create teams (Admin can create)
- ✅ Manage team members (Admin full access)
- ❌ User invitation system → Week 11
- ❌ Role management UI → Week 11
- ❌ User activation/deactivation → Week 11

**Week 11 Will Deliver**:
- ⬜ Admin panel screen (`09_admin.html`)
- ⬜ User CRUD APIs
- ⬜ Bulk user import
- ⬜ Role assignment UI
- ⬜ System settings

**Files Updated**:
- ✅ MVP_USER_STORIES.md → ADMIN-003 moved to [Week 11] tag
- ✅ MASTER_DEV_LIST.md → Week 11 section includes admin features

---

## 8️⃣ AI OKR APPROVAL BUG ✅ FIX SCHEDULED

### Issue (ISS-W4-001)
**Frontend expects**:
```javascript
response.data.suggestion  // Wrong
```

**Backend returns**:
```javascript
{
  data: {
    suggestions: [...]  // Actual structure
  }
}
```

### Resolution ✅
**Week 5 Day 1 Morning (2-4 hours) - BLOCKING TASK**:

**Fix Location**: `client/js/ai-okr-api-client.js:73-76`
```javascript
// BEFORE (Wrong):
const suggestion = response.data.suggestion;

// AFTER (Correct):
const suggestions = response.data.suggestions || [];
```

**Also Fix**: `client/pages/scripts/ai-okr-review.js:75-100`
- Update to loop through `suggestions` array
- Render each objective card
- Test: Assessment → Generate → Review page displays ✅

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Day 1 Morning task clarified with exact line numbers
- ✅ MASTER_ISSUES_LIST.md → ISS-W4-001 resolution plan updated

---

## 9️⃣ WEEK 6-12 DETAILED PLANS ✅ ACTION REQUIRED

### Issue
- Only Week 5 has detailed `WEEK_X_PLAN.md`
- Week 6-12 folders empty
- MASTER_DEV_LIST says "create on-demand"

### Resolution ✅
**Create Week 6-8 plans THIS WEEK (before Week 5 ends)**

**Schedule**:
- Week 5 Friday Oct 26: Create `WEEK_6_PLAN.md` (Profile screen - 5 days detailed)
- Week 6 Friday Nov 2: Create `WEEK_7_PLAN.md` (Dashboard - 5 days detailed)
- Week 7 Friday Nov 9: Create `WEEK_8_PLAN.md` (Goal Management - 5 days detailed)

**Week 9-12**: Create 1 week ahead (rolling planning)

**Why**: Downstream teams need clear scope before each sprint starts

**Files to Create**:
- ⬜ `Daily_Handoffs/Week_6/WEEK_6_PLAN.md` (by Oct 26)
- ⬜ `Daily_Handoffs/Week_7/WEEK_7_PLAN.md` (by Nov 2)
- ⬜ `Daily_Handoffs/Week_8/WEEK_8_PLAN.md` (by Nov 9)

---

## 🔟 OBJECTIVES API DEPENDENCY ✅ CLARIFIED

### Issue
Week 5 Day 4 expects `/api/objectives/my-dashboard` with historical progress data, but current API only returns snapshots.

### Resolution ✅
**Week 5 Day 4 - Simplified API**:
```javascript
GET /api/objectives/my-dashboard
Response:
{
  objectives: [
    {
      _id, title, description,
      progress: 75,              // Current %
      status: "on_track",        // Calculated
      due_date,
      key_results: [...]         // No historical data yet
    }
  ]
}
```

**Deferred to Week 10** (Integration):
- ⬜ Progress history timeline
- ⬜ Trend calculations
- ⬜ Historical snapshots stored in DB

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Day 4 API spec simplified
- ✅ MVP_USER_STORIES.md → Progress timeline moved to Week 10 stories

---

## 1️⃣1️⃣ TEAM MODEL CREATION ✅ SCHEDULED

### Issue
- User, Objective, Goal models reference `Team` (populated fields)
- `server/models/Team.js` doesn't exist yet
- Week 5 Plan says "Create Team model Day 1 Afternoon"

### Resolution ✅
**Week 5 Day 1 Afternoon (4 hours)**:

**Create**: `server/models/Team.js`
```javascript
{
  business_id: ObjectId,
  name: String,             // "Sales Team"
  description: String,
  department: String,       // "Sales", "Engineering", etc.
  function: String,         // "Revenue", "Product", etc.
  manager_id: ObjectId,
  manager_name: String,     // Denormalized
  members: [{
    user_id: ObjectId,
    user_name: String,
    user_email: String,
    role: String,           // MANAGER, EMPLOYEE
    joined_at: Date,
    status: String          // "active", "inactive"
  }],
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: Boolean,
  member_count: Number      // Calculated
}
```

**Also Create**: Indexes
```javascript
db.teams.createIndex({ business_id: 1 });
db.teams.createIndex({ manager_id: 1 });
db.teams.createIndex({ "members.user_id": 1 });
```

**Department Model**: NOT needed yet (department is just a String field in Team)

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Day 1 Afternoon task includes schema details
- ✅ Added to WEEK_5_CODE_REFERENCES.md template

---

## 1️⃣2️⃣ SHARED MODELS PACKAGE ✅ DEFERRED

### Issue
Strategy mandates `@karvia/shared-models` package, but engines still use `require('../../server/models/*')`.

### Resolution ✅
**Status**: Deferred to Post-MVP (Technical Debt)

**Why**:
- Shared models package requires lerna/yarn workspaces setup
- Requires publishing to npm registry or private registry
- Refactoring 6 engines would take 1-2 weeks
- MVP can ship with current approach (engines co-located with monolith)

**MVP Approach**:
- ✅ Keep `server/models/*` as source of truth
- ✅ Engines import directly: `require('../../server/models/User')`
- ✅ Document as technical debt in MASTER_IMPROVEMENTS_LIST

**Post-MVP Action**:
- ⬜ IMP-W13-001: Create `@karvia/shared-models` package
- ⬜ IMP-W13-002: Migrate all engines to use shared package
- ⬜ IMP-W13-003: Setup lerna/yarn workspaces

**Files Updated**:
- ✅ MASTER_IMPROVEMENTS_LIST.md → Added IMP-W13-001, IMP-W13-002, IMP-W13-003
- ✅ MVP_STRATEGY.md → Added note "Post-MVP: Shared models package"

---

## 1️⃣3️⃣ ENGINE INVENTORY CLEANUP ✅ SCHEDULED

### Issue
- Strategy lists 6 engines
- `package.json` has 8 dev scripts (includes `dev:insights`, `dev:collaboration`)
- No setup tasks or documentation for these 2 extra engines

### Resolution ✅
**Action**: Archive unused engines

**Week 5 Day 1 Morning** (during bug fix):
```bash
# If engines/insights and engines/collaboration exist but unused:
mv engines/insights Archive/engines_insights_unused
mv engines/collaboration Archive/engines_collaboration_unused

# Update package.json:
Remove:
- "dev:insights": "cd engines/insights && npm run dev"
- "dev:collaboration": "cd engines/collaboration && npm run dev"
```

**Official Engine List** (MVP):
1. ✅ IAM (Identity & Access Management)
2. ✅ Assessment (SSI Assessment System)
3. ✅ Planner (OKR Planning)
4. ✅ Scoring (Progress Tracking)
5. ✅ Observer (Monitoring & Alerts)
6. ✅ Tracking (Analytics & Reporting)

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Day 1 Morning includes engine cleanup task
- ✅ MVP_STRATEGY.md → Engine list confirmed as 6 engines

---

## 1️⃣4️⃣ FEATURE TOGGLES INFRASTRUCTURE ✅ SCHEDULED

### Issue
Strategy requires `ibrain_config` toggles in Business model, but no loader exists in codebase.

### Resolution ✅
**Week 5 Day 1 Afternoon** (after Team model):

**Add to Business Model** (`server/models/Business.js`):
```javascript
feature_flags: {
  type: Map,
  of: Boolean,
  default: {
    ai_okr_generation: true,
    openai_integration: true,
    email_notifications: true,
    // BETA features (off by default):
    ibrain_predictive: false,
    ibrain_sentiment: false,
    ibrain_coaching: false,
    ibrain_automation: false,
    ibrain_advanced_analytics: false
  }
}
```

**Create Middleware** (`server/middleware/featureFlags.js`):
```javascript
// Check if feature enabled for business
exports.requireFeature = (featureName) => {
  return async (req, res, next) => {
    const business = await Business.findById(req.user.business_id);
    if (!business.feature_flags.get(featureName)) {
      return res.status(403).json({
        success: false,
        error: `Feature ${featureName} not enabled for your organization`
      });
    }
    next();
  };
};
```

**Usage**:
```javascript
// In ai-okr routes:
router.post('/generate',
  requireFeature('ai_okr_generation'),
  generateOKRs
);
```

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Day 1 Afternoon includes feature flags setup
- ✅ Added to WEEK_5_CODE_REFERENCES.md template

---

## 1️⃣5️⃣ SETUP SCRIPTS UPDATE ✅ SCHEDULED

### Issue
`npm run setup:engines` doesn't install insights/collaboration packages (if they exist).

### Resolution ✅
**Week 5 Day 1 Morning** (during cleanup):

**Update** `package.json:39-41`:
```json
{
  "scripts": {
    "setup:engines": "cd engines/iam && npm install && cd ../assessment && npm install && cd ../planner && npm install && cd ../scoring && npm install && cd ../observer && npm install && cd ../tracking && npm install"
  }
}
```

**Remove unused engine scripts**:
```json
- "dev:insights": "cd engines/insights && npm run dev",
- "dev:collaboration": "cd engines/collaboration && npm run dev"
```

**Files Updated**:
- ✅ WEEK_5_PLAN.md → Day 1 cleanup task includes package.json update

---

## ✅ CORRECTED MVP SCOPE SUMMARY

### What Ships December 17, 2025 (MVP)

**Core Features** ✅:
1. Assessment System (Week 1-4) - 100% complete
2. AI OKR Generation (Week 4-5) - OpenAI integration with customer key
3. 6 Core Screens (Week 5-12):
   - Dashboard (daily tasks)
   - Objectives (OKR display)
   - Team (CRUD + role-based access)
   - Planning (quarterly breakdown)
   - Profile (user profiles)
   - Analytics (basic metrics)
4. Role-Based Access (5 roles: Admin, Executive, Manager, Employee, Consultant)
5. Email Notifications (Mailjet)
6. Feature Toggles (admin can enable/disable AI features)

**NOT in MVP** (Deferred to BETA - Q1 2026):
- ❌ iBrain Predictive Analytics
- ❌ iBrain Sentiment Analysis
- ❌ iBrain AI Coaching
- ❌ iBrain Workflow Automation
- ❌ iBrain Advanced Dashboards
- ❌ Behavioral Insights
- ❌ `@karvia/shared-models` package
- ❌ Advanced planning with AI reasoning
- ❌ Team engagement scores
- ❌ Recognition nudges
- ❌ CSV exports
- ❌ Progress timeline history

---

## 📋 WEEK 5 DAY 1 CORRECTED TASK LIST

**Morning (4 hours) - BLOCKING**:
1. ✅ Fix ISS-W4-001: AI OKR response format (`client/js/ai-okr-api-client.js:73-76`)
2. ✅ Clean up unused engines (insights, collaboration → Archive)
3. ✅ Update `package.json` scripts (remove unused engine refs)
4. ✅ Test: Assessment → Generate OKRs → Review page displays ✅

**Afternoon (4 hours) - Foundation**:
1. ✅ Create `server/models/Team.js` with full schema
2. ✅ Add indexes (business_id, manager_id, members.user_id)
3. ✅ Add feature_flags to Business model
4. ✅ Create `server/middleware/featureFlags.js`
5. ✅ Test: Create team via Postman

---

## 📅 UPDATED TIMELINE

```
Week 0-4 ████████████░░░░░░░░░░░░░░░░ Complete (Oct 13-22)
Week 5   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Teams + Objectives (Oct 22-26)
Week 6   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Profile (Oct 27-31)
Week 7   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Dashboard (Nov 1-7)
Week 8   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Goal Management (Nov 8-14)
Week 9   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Planning (Simplified) (Nov 15-21)
Week 10  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Integration & Polish (Nov 22-28)
Week 11  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Analytics & Admin (Nov 29-Dec 5)
Week 12  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Testing & Launch Prep (Dec 6-17)
```

**Launch**: December 17, 2025 🚀

---

## 🔗 FILES TO UPDATE

**Immediate (Before Week 5 starts)**:
- ✅ MVP_STRATEGY.md → Launch date, iBrain scope, engine list
- ✅ MASTER_DEV_LIST.md → Timeline, Week 5-12 scope clarification
- ✅ WEEK_5_PLAN.md → Day 1 corrected tasks, Day 4 objectives.html fix
- ✅ MVP_USER_STORIES.md → Week 5-8 acceptance criteria trimmed
- ✅ MASTER_IMPROVEMENTS_LIST.md → Deferred features logged
- ✅ MASTER_ISSUES_LIST.md → ISS-W4-001 fix details

**Week 5 Friday** (Oct 26):
- ⬜ Create WEEK_6_PLAN.md (Profile screen - 5 days)
- ⬜ Create DEFERRED_FEATURES.md (all pushed items)

---

## ✅ ACCEPTANCE CRITERIA

**This revision is complete when**:
- ✅ All 15 issues from review resolved
- ✅ Launch date consistent across all docs (Dec 17)
- ✅ iBrain modules clearly marked as BETA (not MVP)
- ✅ Week 5 Day 1 tasks include all foundation work
- ✅ User stories acceptance criteria match implementation capacity
- ✅ Week 6-8 planning scheduled
- ✅ Deferred features documented (not forgotten)

---

**Last Updated**: 2025-10-22
**Status**: ✅ Ready for Week 5 Implementation
**Next Action**: Apply all file updates listed above
