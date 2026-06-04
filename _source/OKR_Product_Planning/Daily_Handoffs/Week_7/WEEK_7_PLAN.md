# 📅 WEEK 7 DETAILED PLAN - Goal UI + IAM Block

**Week**: 7 of 12
**Focus**:
- **Day 0-1**: Goal Management UI (Week 6 completion)
- **Day 2-6**: Block 2 - Identity & Access Management (Multi-Company Support)
**Duration**: 7 days (56 hours total)
- Goal UI: 2 days (16 hours)
- IAM: 5 days (40 hours)
**Complexity**: 🔴 **CRITICAL** (Production blocker + Core architecture)
**Status**: ⚠️ **66% UNBLOCKED** - Migration complete, Goal UI remains

---

## 🎯 WEEK 7 OBJECTIVES (REVISED - Oct 26, 2025)

### **Primary Goals**:
1. ✅ Complete Goal Management UI (Week 6 completion)
2. ✅ Implement multi-company data model (`companies` collection + `users.companies[]`)
3. ✅ Build company creation and management system
4. ✅ Implement team CRUD with company isolation
5. ✅ Build consultant multi-company switcher
6. ✅ Comprehensive E2E testing and quality assurance

**Note**: Bulk Invitations and Invitation Acceptance flows moved to Beta phase. Week 7 uses existing individual email invitation system.

### **Success Criteria**:
- Goal UI: 4 user stories fully functional (MGR-025, MGR-026, EMP-013, EMP-014)
- Owner can create company and team in <2 minutes
- Consultant can switch between 3 companies seamlessly
- Solo user can skip company creation (Block 1 only mode)
- All data properly isolated by company_id
- 95%+ test coverage on new IAM features
- Zero critical bugs in Week 7 deliverables

---

## 📚 PREREQUISITE READING

**Must Read Before Starting**:
1. [database_schema.md](../../../KARVIA_STRATEGY/2-TECHNICAL/3-DATA/database_schema.md) - Lines 131-289 (users, companies collections)
2. [MVP_TECHNICAL_ARCHITECTURE_V5.md](../../../KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/MVP_TECHNICAL_ARCHITECTURE_V5.md) - Block 2 IAM section
3. [PERMISSION_MATRIX.md](../../_Migrated_to_KARVIA_STRATEGY/PERMISSION_MATRIX.md) - Role-based access rules
4. [WEEK_6_PLAN.md](../Week_6/WEEK_6_PLAN.md) - Previous week context (Goal management)
5. [MASTER_DEV_LIST_V5.md](../../01_MVP/MASTER_DEV_LIST_V5.md) - Lines 300-418 (Week 7 tasks)

**Key Architectural Changes**:
1. **Multi-Company Model**: Users can belong to multiple companies via `users.companies[]` array
2. **companies Collection**: NEW collection separate from legacy `businesses`
3. **current_company_id**: Active company context for consultants
4. **company_id Fields**: Added to objectives, goals, tasks, teams, invitations
5. **Backward Compatibility**: Legacy `business_id` maintained for existing code

---

## 📋 DOCUMENTATION PREREQUISITES (REVISED - Oct 26, 2025)

**⚠️ CRITICAL**: The following strategic documents must be created **BEFORE** starting Week 7 Day 2-6 work. Without these, developers will need to guess UX flows, risking **6 hours of rework**.

**Reference**: [Week7_Developer_Documentation_Response.md](../../../Karvia_OKR_Product_Planning/Review_Docs/Week7_Developer_Documentation_Response.md)

**Scope Change**: Bulk Invitations (Day 4) and Invitation Acceptance (Day 5) have been **removed from Week 7** and moved to Beta phase. Documentation requirements reduced from 5 to 3 documents.

### **Required Documents** (Must Complete by 2025-10-30)

#### **1. Company Setup Wizard UX Specification** 🔴 **MISSING** (Day 3 Blocker)
- **Location**: `KARVIA_STRATEGY/1-PRODUCT/4-UX-AND-CONTENT/COMPANY_SETUP_WIZARD.md`
- **Owner**: Product Design Lead | **Reviewer**: CTO
- **Target**: 2025-10-28
- **Content Required**:
  - Step-by-step wizard flow (Create Company → Configure Details → Add Teams)
  - Field validation rules and error handling
  - Archetype selection UI pattern (dropdown/modal/search)
  - Strategic focus selection UI (multi-select/cards)
  - Empty states and error states
  - Analytics instrumentation notes
- **Impact if missing**: +3 hours UX design guesswork

#### **2. Multi-Company Context Switching Specification** 🔴 **MISSING** (Day 6 Blocker)
- **Location**: `KARVIA_STRATEGY/1-PRODUCT/4-UX-AND-CONTENT/MULTI_COMPANY_SWITCHER.md`
- **Owner**: Frontend Lead | **Reviewer**: Product Manager
- **Target**: 2025-10-30
- **Content Required**:
  - Switcher UI placement (dropdown in header? modal? sidebar?)
  - Empty state (consultant has no companies)
  - Error state (company load failure)
  - Backend context switch logic:
    1. Update User.current_company_id in database? OR
    2. Issue new JWT token with new company_id? OR
    3. Both?
  - Frontend state reset strategy (localStorage? reload app?)
  - Permission recalculation (user role changes per company)
  - Consultant multi-company view rules (can see multiple at once? or must switch?)
  - Accessibility requirements
- **Impact if missing**: +3 hours UX decisions + potential inconsistent behavior

#### **3. Database Schema Terminology Update** ⚠️ **NEEDS UPDATE** (All Days)
- **Location**: `KARVIA_STRATEGY/2-TECHNICAL/3-DATA/database_schema.md`
- **Owner**: Backend Lead | **Reviewer**: Data Architect
- **Target**: 2025-10-27
- **Changes Required**:
  - Find-replace `business_id` → `company_id` throughout document
  - Note migration strategy (backward compatibility maintained)
  - Update related documentation:
    - Migration scripts: `server/scripts/migrate-business-to-company.js`
    - Routes: `server/routes/companies.js`
- **Impact if missing**: Developer confusion, inconsistent terminology

---

### **Documentation Delivery Timeline (REVISED)**

| Date | Deliverable | Status |
|------|------------|--------|
| 2025-10-27 | Schema terminology update | ⚠️ In Progress |
| 2025-10-28 | Company Setup Wizard UX spec | ❌ Not Started |
| 2025-10-30 | Multi-company switcher spec | ❌ Not Started |

**Removed from Week 7** (Moved to Beta):
- ~~Bulk Invitation system design~~ → Beta phase
- ~~Invitation security spec~~ → Beta phase (existing system sufficient)

**Total Documentation Risk**: 6 hours (reduced from 23 hours)

---

## 🏗️ ARCHITECTURE CONTEXT

### **Current State** (End of Week 6)
- ✅ Week 0-5: All foundational blocks complete
- ✅ Week 6: Goal Management (Backend 100%, Frontend 21%)
- ✅ MongoDB schema updated Oct 24 with companies[] and company_id fields
- ✅ Existing Team model (from Week 5) - needs company_id migration

### **Week 7 Architecture Goals**
```
BEFORE (Legacy):
User → business_id → Single Business

AFTER (Block 2 IAM):
User → companies[] → Multiple Companies
     → current_company_id → Active Company Context
     → company_id on all resources (objectives, goals, tasks, teams)

Special Case - Consultant:
User.companies = [
  { company_id: CompanyA, role: 'CONSULTANT' },
  { company_id: CompanyB, role: 'CONSULTANT' },
  { company_id: CompanyC, role: 'CONSULTANT' }
]
User.current_company_id = CompanyA // Active context
```

### **Feature Flag**
```javascript
// config/feature-flags.js
module.exports = {
  IAM_BLOCK: process.env.ENABLE_IAM_BLOCK === 'true', // Week 7
  // ... other blocks
};
```

### **7 Modular Blocks - Week 7 Status**
```
Block 1: Core Execution (REQUIRED) ✅ Complete (Week 1-6)
Block 2: IAM - Companies & Teams (OPTIONAL) ⚠️ Week 7 IN PROGRESS ← WE ARE HERE
Block 3: Assessment System (OPTIONAL) ✅ Complete (Week 3-4)
Block 4: AI OKR Engine (OPTIONAL) ✅ Complete (Week 2, 4)
Block 5: Progress Rollup (OPTIONAL) ⏳ Week 8
Block 6: Bulk Operations (OPTIONAL) ⏳ Week 7 (bulk invites)
Block 7: Permission Rules Engine (OPTIONAL) ⏳ Week 10
```

---

## 🚨 PRE-WEEK 7 STATUS UPDATE

**Overall Status**: ⚠️ **2 of 3 Complete** (66%)
**Remaining Work**: 5-7 days (Goal Management UI)
**Priority**: P0 (CRITICAL - BLOCKS PRODUCTION)

> ✅ **UPDATE (Oct 25, 2025)**: Company Migration COMPLETE! Blocker 2 & 3 resolved.
> ❌ **REMAINING**: Goal Management UI must be completed before production.

### **Blocker Status Summary**:
- ✅ **BLOCKER 2**: Companies API - COMPLETE (replaced businesses.js)
- ✅ **BLOCKER 3**: Company Migration - COMPLETE (69 files updated)
- ❌ **BLOCKER 1**: Goal Management UI - IN PROGRESS (Week 6.5 / Day 0-1 of Week 7)

---

## 🎯 WEEK 7 REVISED PLAN

**New Approach**: Include Goal UI as Day 0-1 of Week 7
**Total Duration**: 7 days (instead of 5)
**Structure**:
- **Day 0-1**: Goal Management UI (Week 6 cleanup)
- **Day 2-6**: Original Week 7 IAM work

---

### **DAY 0-1: Goal Management UI (Week 6 Completion)** ❌ NOT STARTED

**Context**: Week 6 backend is 100% complete (Goal model + 11 API endpoints), but frontend is 0% complete, making the feature completely unusable.

**Duration**: 3.5 days (28 hours total)
- **Pre-work** (Backend fixes): 4 hours
- **Frontend Development**: 24 hours
- **Testing & Integration**: 6 hours (revised from 4h)

**Priority**: P0 (BLOCKS PRODUCTION)

**Audit Status**: ✅ **AUDITED** (Oct 25, 2025) - [Full Report](./GOAL_UI_AUDIT_REPORT.md)
- Backend: 11/11 endpoints ✅
- Model: Missing hierarchy fields ⚠️
- Frontend: 0/8 files ❌
- Plan Accuracy: 95% ✅

---

## 🚨 PRE-WORK: BACKEND FIXES (7 hours) 🔴 **MUST COMPLETE FIRST**

Before starting frontend work, we must complete **4 critical tasks**:
- **Task 0.1 & 0.2**: Backend gaps from audit (Goal hierarchy + breakdown endpoint)
- **Task 0.3 & 0.4**: Customer-reported bugs from Weeks 1-6 (Assessment 5.0 validation + Email invitation UX)

### **TASK 0.1: Add Goal Hierarchy Fields** (1 hour) 🔴 **P0 BLOCKER**

**Problem**: Goal model lacks fields to distinguish quarterly vs weekly goals and link them.

**Impact**: MGR-026 (breakdown story) is BLOCKED without these fields.

**File**: [server/models/Goal.js](../../../../server/models/Goal.js)

**Changes Required**:
```javascript
// ADD after line 66 (after assigned_to field)

// Time Period - Distinguish quarterly vs weekly goals
time_period: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY'],
  required: true,
  default: 'WEEKLY',
  index: true,
  description: 'Differentiates quarterly goals from weekly breakdown'
},

// Parent/Child Relationships for Goal Breakdown
parent_goal_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal',
  index: true,
  description: 'For weekly goals - links to parent quarterly goal'
},

child_goal_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal',
  description: 'For quarterly goals - links to child weekly goals (12-13 weeks)'
}],
```

**Acceptance Criteria**:
- [ ] `time_period` field added with QUARTERLY/WEEKLY enum
- [ ] `parent_goal_id` indexed for fast queries
- [ ] `child_goal_ids` array supports 13 weekly goals
- [ ] Existing goals default to time_period='QUARTERLY'
- [ ] Model file saved without syntax errors

**Testing**:
```javascript
// Test in MongoDB shell or via Postman
const goal = new Goal({
  name: 'Test Goal',
  company_id: '...',
  objective_id: '...',
  time_period: 'QUARTERLY',
  quarter: 'Q1',
  week: 1,
  due_date: new Date('2025-03-31')
});
await goal.save();
console.log(goal.time_period); // Should print 'QUARTERLY'
```

**Estimated Time**: 1 hour
**Assigned**: Backend Developer

---

### **TASK 0.2: Create Breakdown Endpoint** (3 hours) 🟡 **P1 RECOMMENDED**

**Problem**: No dedicated endpoint to auto-generate 12-13 weekly goals from quarterly goal.

**Current Workaround**: Frontend can loop 13 times calling POST /api/goals (works but inefficient).

**Better Solution**: Single API call that creates all weekly goals atomically.

**File**: [server/routes/goals.js](../../../../server/routes/goals.js)

**Add New Endpoint**:
```javascript
// ADD after line 414 (after DELETE route)

/**
 * POST /api/goals/:id/breakdown
 * Break quarterly goal into 12-13 weekly goals
 * Access: MANAGER+ only
 */
router.post('/:id/breakdown',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { weeks = 13 } = req.body; // Allow custom week count (default 13)

      // 1. Fetch quarterly goal
      const quarterlyGoal = await Goal.findById(id);
      if (!quarterlyGoal) {
        return res.status(404).json({
          success: false,
          message: 'Quarterly goal not found'
        });
      }

      // 2. Validate it's a quarterly goal
      if (quarterlyGoal.time_period !== 'QUARTERLY') {
        return res.status(400).json({
          success: false,
          message: 'Can only breakdown quarterly goals'
        });
      }

      // 3. Check if already broken down
      if (quarterlyGoal.child_goal_ids && quarterlyGoal.child_goal_ids.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Goal already broken down into weekly goals',
          existing_weekly_goals: quarterlyGoal.child_goal_ids.length
        });
      }

      // 4. Calculate week start dates
      const quarterStart = quarterlyGoal.start_date;
      const weeklyGoals = [];

      for (let week = 1; week <= weeks; week++) {
        const weekStartDate = new Date(quarterStart);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);

        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);

        weeklyGoals.push({
          company_id: quarterlyGoal.company_id,
          objective_id: quarterlyGoal.objective_id,
          key_result_id: quarterlyGoal.key_result_id,
          name: `${quarterlyGoal.name} - Week ${week}`,
          description: quarterlyGoal.description,
          owner_id: quarterlyGoal.owner_id,
          assigned_to: quarterlyGoal.assigned_to, // Copy assignees
          time_period: 'WEEKLY',
          quarter: quarterlyGoal.quarter,
          week: week,
          start_date: weekStartDate,
          due_date: weekEndDate,
          status: 'not_started',
          progress: 0,
          metric_type: quarterlyGoal.metric_type,
          target_value: Math.round(quarterlyGoal.target_value / weeks),
          current_value: 0,
          unit: quarterlyGoal.unit,
          priority: quarterlyGoal.priority,
          team_id: quarterlyGoal.team_id,
          department_id: quarterlyGoal.department_id,
          parent_goal_id: quarterlyGoal._id,
          created_by: req.user._id,
          visibility: quarterlyGoal.visibility
        });
      }

      // 5. Insert all weekly goals (atomic operation)
      const createdGoals = await Goal.insertMany(weeklyGoals);

      // 6. Update quarterly goal with child references
      quarterlyGoal.child_goal_ids = createdGoals.map(g => g._id);
      await quarterlyGoal.save();

      // 7. Return success
      res.status(201).json({
        success: true,
        message: `Quarterly goal broken down into ${weeks} weekly goals`,
        quarterly_goal: {
          _id: quarterlyGoal._id,
          name: quarterlyGoal.name,
          child_goal_ids: quarterlyGoal.child_goal_ids
        },
        weekly_goals: createdGoals.map(g => ({
          _id: g._id,
          name: g.name,
          week: g.week,
          start_date: g.start_date,
          due_date: g.due_date,
          parent_goal_id: g.parent_goal_id
        })),
        count: createdGoals.length
      });

    } catch (error) {
      console.error('Error breaking down goal:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to breakdown goal',
        error: error.message
      });
    }
  }
);
```

**Acceptance Criteria**:
- [ ] Endpoint creates 13 weekly goals from 1 quarterly goal
- [ ] Weekly goals evenly distribute target_value (e.g., 100 → 7.69 per week)
- [ ] Weekly goals span consecutive 7-day periods
- [ ] Parent goal's `child_goal_ids` array updated
- [ ] Child goals' `parent_goal_id` points to parent
- [ ] Prevents double-breakdown (returns error if already broken down)
- [ ] MANAGER+ role required
- [ ] All operations atomic (rollback on error)

**Testing**:
```bash
# 1. Create quarterly goal first
curl -X POST http://localhost:3000/api/goals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Increase MRR by $50K",
    "company_id": "...",
    "objective_id": "...",
    "time_period": "QUARTERLY",
    "quarter": "Q1",
    "week": 1,
    "start_date": "2025-01-01",
    "due_date": "2025-03-31",
    "target_value": 50000,
    "metric_type": "currency",
    "unit": "USD"
  }'

# 2. Breakdown into weekly goals
curl -X POST http://localhost:3000/api/goals/<goal_id>/breakdown \
  -H "Authorization: Bearer <token>" \
  -d '{"weeks": 13}'

# Expected: 13 weekly goals created
```

**Estimated Time**: 3 hours
**Assigned**: Backend Developer

---

### **TASK 0.3: Fix Assessment 5.0 Score Validation Bug** (1 hour) 🔴 **P0 CRITICAL - CUSTOMER BLOCKER**

**Problem**: Assessment submissions fail when responses contain 5.0 scores. Users cannot give perfect/highest scores.

**Impact**: BLOCKS assessment completion. Critical customer-reported bug from Weeks 1-6 feedback.

**File**: `server/routes/assessments.js` or `server/services/SSIScoringService.js`

**Root Cause** (Most likely):
```javascript
// BAD: Treats 5.0 as falsy or uses wrong logic
if (!response.score || response.score === 5.0) {
  errors.push('Invalid score');
}

// Or this pattern:
responses.forEach(response => {
  if (!response.score) { // 5.0 might be treated as truthy but logic is wrong
    errors.push(`Question ${response.question_id} not answered`);
  }
});
```

**Fix Required**:
```javascript
// GOOD: Explicit null/undefined check
responses.forEach(response => {
  if (response.score === null || response.score === undefined) {
    errors.push(`Question ${response.question_id} not answered`);
  }

  // Validate range (1.0 to 5.0 inclusive)
  if (response.score < 1.0 || response.score > 5.0) {
    errors.push(`Question ${response.question_id} score must be between 1.0 and 5.0`);
  }
});
```

**Testing**:
```bash
# Test with all 5.0 scores
POST /api/assessments/submit
{
  "invitation_token": "abc123",
  "responses": [
    { "question_id": "Q1", "score": 5.0 },
    { "question_id": "Q2", "score": 5.0 },
    { "question_id": "Q3", "score": 5.0 }
  ]
}

# Expected: 200 OK, assessment submitted successfully
# Actual (current): 400 Bad Request, validation error
```

**Acceptance Criteria**:
- [ ] Assessment accepts 5.0 as valid score (highest rating)
- [ ] Validation still rejects null/undefined scores
- [ ] Validation still rejects scores < 1.0 or > 5.0
- [ ] Unit tests added for 1.0, 3.0, 5.0 edge cases
- [ ] Deployed as hotfix

**Estimated Time**: 1 hour
**Assigned**: Backend Developer
**Priority**: **IMMEDIATE HOTFIX** (before Week 7 Day 0)

---

### **TASK 0.4: Fix Email Invitation UI/UX** (2 hours) 🟠 **P0 HIGH - CUSTOMER FRICTION**

**Problem**: Email invitation page has confusing UI and unreliable email delivery. Users must manually copy links.

**Impact**: Blocks consultant workflow. Critical customer-reported issue from Weeks 1-6 feedback.

**Files**:
- Backend: `server/routes/invitations.js`
- Frontend: `client/pages/send-invitation.html` (or equivalent)

**Issues Identified**:
1. **Unclear UI** - Buttons/actions not obvious
2. **Email delivery failure** - Silent failures, no retry
3. **No confirmation** - User doesn't know if email sent

**Fix Required**:

**Backend (invitations.js)**:
```javascript
// Add graceful email fallback
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const invitation = new Invitation({ /* data */ });
    await invitation.save();

    // Try to send email
    try {
      await sendEmail({
        to: invitation.invitee_email,
        subject: 'Assessment Invitation',
        html: /* template */
      });

      invitation.email_sent = true;
      invitation.email_sent_at = new Date();
      await invitation.save();

      res.json({
        success: true,
        message: `Email sent to ${invitation.invitee_email}`,
        invitation_link: `${BASE_URL}/invite/${invitation.token}` // Backup link
      });

    } catch (emailError) {
      // Email failed but invitation exists - graceful degradation
      res.json({
        success: true,
        email_sent: false,
        message: `Invitation created, but email failed. Please copy the link below.`,
        invitation_link: `${BASE_URL}/invite/${invitation.token}`,
        error: emailError.message
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**Frontend (send-invitation.html)**:
```html
<!-- AFTER: Clear, action-oriented UI -->
<div class="invitation-form">
  <h2>Send Assessment Invitation</h2>

  <div class="form-group">
    <label>To: <strong id="invitee-email">john@example.com</strong></label>
  </div>

  <div class="form-group">
    <label>Template: <strong id="template-name">SSI Financial Services</strong></label>
  </div>

  <button class="btn btn-primary btn-lg" onclick="sendEmailInvitation()">
    📧 Send Email Invitation
  </button>

  <div class="divider">Or manually share:</div>

  <div class="link-copy-section">
    <input type="text" id="invitation-link" readonly />
    <button class="btn btn-secondary" onclick="copyLink()">
      📋 Copy Link
    </button>
  </div>

  <!-- Success message -->
  <div id="success-message" style="display:none;">
    ✅ Email sent to <span id="sent-to"></span>
    <br>They'll receive it within 5 minutes.
  </div>

  <!-- Fallback message -->
  <div id="fallback-message" style="display:none;">
    ⚠️ Email could not be sent. Please copy the link above and send manually.
  </div>
</div>
```

**Acceptance Criteria**:
- [ ] Clear "Send Email Invitation" primary button
- [ ] "Copy Link" secondary option always visible
- [ ] Email success: Show confirmation with recipient email
- [ ] Email failure: Show fallback message + link to copy
- [ ] No silent failures (always show result)
- [ ] Mobile-responsive design

**Estimated Time**: 2 hours (1h backend, 1h frontend)
**Assigned**: Backend + Frontend Developer
**Priority**: **High** (complete during Week 7 Day 0)

---

---

## 📱 FRONTEND DEVELOPMENT (24 hours)

### **Hour 1-3: API Client Layer** ✅ **VERIFIED ENDPOINTS**

**File**: `client/js/goals-api-client.js` (~250 lines)

**Audit Note**: ✅ All 11 endpoints confirmed working in [server/routes/goals.js](../../../../server/routes/goals.js)

**Endpoints to Wrap** (11 total + 1 new):
```javascript
class GoalsAPIClient {
  constructor() {
    this.baseURL = '/api/goals';
    this.token = localStorage.getItem('authToken');
    this.company_id = localStorage.getItem('company_id');
  }

  // CORE CRUD (5 endpoints) ✅ CONFIRMED
  async getGoals(filters = {}) {
    // GET /api/goals (line 15 in goals.js)
    // Supports: objective_id, owner_id, assigned_to, status, quarter, week, priority, health
    const params = new URLSearchParams({
      ...filters,
      company_id: this.company_id
    });
    return this.request(`${this.baseURL}?${params}`, 'GET');
  }

  async getGoalById(goalId) {
    // GET /api/goals/:id (line 179)
    // Returns goal with populated owner_id, objective_id, assigned_to
    return this.request(`${this.baseURL}/${goalId}`, 'GET');
  }

  async createGoal(goalData) {
    // POST /api/goals (line 84)
    // Required: name, objective_id, quarter, week, due_date
    // Optional: time_period (QUARTERLY/WEEKLY), description, assigned_to, etc.
    return this.request(this.baseURL, 'POST', {
      ...goalData,
      company_id: this.company_id
    });
  }

  async updateGoal(goalId, updates) {
    // PUT /api/goals/:id (line 234)
    // Can update any field except company_id, created_by
    return this.request(`${this.baseURL}/${goalId}`, 'PUT', updates);
  }

  async deleteGoal(goalId) {
    // DELETE /api/goals/:id (line 414)
    // Soft delete (sets status='cancelled')
    return this.request(`${this.baseURL}/${goalId}`, 'DELETE');
  }

  // GOAL BREAKDOWN (1 endpoint) 🆕 NEW IN PRE-WORK
  async breakdownGoal(goalId, weeks = 13) {
    // POST /api/goals/:id/breakdown (NEW - added in Task 0.2)
    // Creates 13 weekly goals from quarterly parent
    return this.request(`${this.baseURL}/${goalId}/breakdown`, 'POST', { weeks });
  }

  // ASSIGNMENT & PROGRESS (2 endpoints) ✅ CONFIRMED
  async assignGoal(goalId, assignees) {
    // PUT /api/goals/:id/assign (line 370)
    // Body: { user_ids: [id1, id2], role: 'lead'|'contributor'|'reviewer' }
    return this.request(`${this.baseURL}/${goalId}/assign`, 'PUT', {
      user_ids: assignees.map(a => a.user_id || a),
      role: assignees[0]?.role || 'contributor'
    });
  }

  async updateProgress(goalId, progressData) {
    // PUT /api/goals/:id/progress (line 308)
    // Body: { progress: 0-100, current_value: number }
    return this.request(`${this.baseURL}/${goalId}/progress`, 'PUT', progressData);
  }

  // QUERY HELPERS (3 endpoints) ✅ BONUS FEATURES
  async getGoalsByQuarter(quarter) {
    // GET /api/goals/quarter/:quarter (line 450)
    // quarter: 'Q1', 'Q2', 'Q3', 'Q4'
    return this.request(`${this.baseURL}/quarter/${quarter}`, 'GET');
  }

  async getMyGoals() {
    // GET /api/goals/my/goals (line 486)
    // Returns goals assigned to current user
    return this.request(`${this.baseURL}/my/goals`, 'GET');
  }

  async getOverdueGoals() {
    // GET /api/goals/status/overdue (line 521)
    // Returns goals past due_date with status != completed
    return this.request(`${this.baseURL}/status/overdue`, 'GET');
  }

  async getGoalStats() {
    // GET /api/goals/stats/summary (line 553)
    // Returns aggregate statistics (total, completed, in_progress, avg_progress)
    return this.request(`${this.baseURL}/stats/summary`, 'GET');
  }

  // HELPER: Generic request handler
  async request(url, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;

    } catch (error) {
      console.error(`API Error [${method} ${url}]:`, error);
      throw error;
    }
  }

  // HELPER: Loading states
  setLoading(key, isLoading) {
    const event = new CustomEvent('goals-loading', {
      detail: { key, isLoading }
    });
    window.dispatchEvent(event);
  }
}

// Export singleton instance
window.goalsAPIClient = new GoalsAPIClient();
```

**Acceptance Criteria**:
- [ ] All 12 endpoints wrapped (11 existing + 1 new breakdown)
- [ ] JWT token automatically included in Authorization header
- [ ] company_id automatically injected from localStorage
- [ ] Loading states via custom events (goals-loading)
- [ ] Consistent error format: `{ success: false, message: '...', error: '...' }`
- [ ] Request helper handles 4xx/5xx errors gracefully
- [ ] Singleton instance exported as `window.goalsAPIClient`

**Testing**:
```javascript
// Test in browser console after auth
const client = window.goalsAPIClient;

// 1. Get all quarterly goals for Q1
const q1Goals = await client.getGoals({ quarter: 'Q1', time_period: 'QUARTERLY' });
console.log('Q1 Goals:', q1Goals);

// 2. Create test quarterly goal
const newGoal = await client.createGoal({
  name: 'Test Quarterly Goal',
  objective_id: '<existing_objective_id>',
  time_period: 'QUARTERLY',
  quarter: 'Q1',
  week: 1,
  start_date: '2025-01-01',
  due_date: '2025-03-31',
  target_value: 100,
  metric_type: 'percentage'
});
console.log('Created:', newGoal);

// 3. Breakdown into weekly goals
const breakdown = await client.breakdownGoal(newGoal.goal._id, 13);
console.log('Weekly goals:', breakdown.weekly_goals);

// 4. Update progress
await client.updateProgress(breakdown.weekly_goals[0]._id, { progress: 50 });
```

**Estimated Time**: 3 hours
**Assigned**: Frontend Developer

---

### **Hour 4-8: Quarterly Goals Page (Day 1 AM)** 🎯 **MGR-025, MGR-026**

**User Stories Enabled**:
- ✅ **MGR-025**: Manager creates quarterly goals from objectives
- ✅ **MGR-026**: Manager breaks quarterly goals into weekly goals

**Files**:
- `client/pages/quarterly-goals.html` (~400 lines)
- `client/pages/scripts/quarterly-goals.js` (~350 lines)

- **UI Components**:
  ```html
  <!-- quarterly-goals.html -->
  <div class="quarterly-goals-container">
    <!-- Filter Bar -->
    <div class="filter-section">
      <select id="quarter-filter">Q1 2025, Q2 2025...</select>
      <select id="objective-filter">All Objectives, Obj1...</select>
      <select id="status-filter">All, Not Started, In Progress...</select>
      <button id="create-goal-btn">+ Create Quarterly Goal</button>
    </div>

    <!-- Goals Grid -->
    <div class="goals-grid">
      <!-- Goal Card Template -->
      <div class="goal-card" data-goal-id="...">
        <h3>Goal Title</h3>
        <div class="goal-meta">
          <span>Q1 2025</span>
          <span>Linked to: Objective Title</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 45%"></div>
        </div>
        <div class="goal-stats">
          <span>3/7 Weekly Goals</span>
          <span>45% Complete</span>
        </div>
        <div class="goal-actions">
          <button class="breakdown-btn">Break Down</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
  ```

- **Controller Logic** (`quarterly-goals.js`):
  ```javascript
  class QuarterlyGoalsController {
    async init() {
      this.company_id = localStorage.getItem('company_id');
      await this.loadObjectives();  // For dropdown
      await this.loadQuarterlyGoals();
      this.attachEventListeners();
    }

    async loadQuarterlyGoals() {
      const filters = {
        company_id: this.company_id,
        time_period: 'QUARTERLY',
        quarter: this.selectedQuarter,
        objective_id: this.selectedObjective,
        status: this.selectedStatus
      };

      const goals = await goalsApiClient.getGoals(filters);
      this.renderGoalsGrid(goals);
    }

    async handleCreateGoal() {
      // Open goal-details.html in modal mode
      const modal = new GoalDetailsModal({ mode: 'create' });
      const result = await modal.show();
      if (result.saved) {
        await this.loadQuarterlyGoals();
      }
    }

    async handleBreakdown(goalId) {
      // Generate 12-13 weekly goals for quarter
      const weeklyGoals = this.generateWeeklyGoalsFromQuarter(goalId);
      await goalsApiClient.breakdownGoal(goalId, weeklyGoals);
      this.showSuccess('Quarterly goal broken into weekly goals');
    }
  }
  ```

- **Acceptance Criteria**:
  - [ ] Manager can filter by quarter, objective, status
  - [ ] Manager can create new quarterly goal
  - [ ] Manager can break quarterly goal into weekly goals
  - [ ] Progress bars show aggregate weekly progress
  - [ ] Card actions (edit, delete, breakdown) functional

---

### **Hour 9-12: Goal Details Modal (Day 1 PM)** 🎯 **MGR-025**

**User Story Enabled**:
- ✅ **MGR-025**: Manager creates quarterly goals from objectives (create/edit form)

**Files**:
- `client/pages/goal-details.html` (~300 lines)
- `client/pages/scripts/goal-details.js` (~400 lines)

- **Form Fields**:
  ```html
  <!-- goal-details.html -->
  <div class="modal goal-details-modal">
    <form id="goal-form">
      <input type="text" id="goal-title" required placeholder="Goal Title">
      <textarea id="goal-description" placeholder="Description"></textarea>

      <select id="time-period" required>
        <option value="QUARTERLY">Quarterly</option>
        <option value="WEEKLY">Weekly</option>
      </select>

      <select id="quarter" v-if="timePeriod === 'QUARTERLY'">
        <option value="Q1-2025">Q1 2025</option>
        <option value="Q2-2025">Q2 2025</option>
        <!-- ... -->
      </select>

      <input type="date" id="start-date" required>
      <input type="date" id="end-date" required>

      <select id="objective-id">
        <option value="">No Objective Linkage</option>
        <!-- Loaded from objectives API -->
      </select>

      <div class="assignee-section">
        <label>Assign To</label>
        <button type="button" id="assign-btn">+ Add Assignee</button>
        <div id="assignees-list"></div>
      </div>

      <div class="metrics-section">
        <input type="number" id="target-value" placeholder="Target">
        <select id="metric-unit">
          <option value="units">Units</option>
          <option value="percentage">Percentage</option>
          <option value="currency">Currency</option>
        </select>
      </div>

      <div class="modal-actions">
        <button type="submit" class="btn-primary">Save Goal</button>
        <button type="button" class="btn-cancel">Cancel</button>
      </div>
    </form>
  </div>
  ```

- **Acceptance Criteria**:
  - [ ] Form validates all required fields
  - [ ] Objective dropdown populated from API
  - [ ] Assignee modal integration working
  - [ ] Date validation (end_date > start_date)
  - [ ] Metrics properly saved
  - [ ] Edit mode pre-fills existing data

---

### **Hour 13-16: Weekly Goals Page (Day 2 AM)** 🎯 **EMP-013, EMP-014**

**User Stories Enabled**:
- ✅ **EMP-013**: Employee views assigned weekly goals
- ✅ **EMP-014**: Employee updates goal progress

**Files**:
- `client/pages/weekly-goals.html` (~300 lines)
- `client/pages/scripts/weekly-goals.js` (~300 lines)

**Key Features**:
- Calendar view showing current week
- List of weekly goals for selected week
- Quick progress update (drag slider)
- Parent quarterly goal breadcrumb
- Completion checkbox per goal

**API Integration**:
```javascript
// Load current week's goals
async loadWeeklyGoals() {
  const currentWeek = this.getCurrentWeekNumber(); // 1-13 within quarter
  const currentQuarter = this.getCurrentQuarter(); // Q1, Q2, Q3, Q4

  const goals = await goalsAPIClient.getGoals({
    time_period: 'WEEKLY',
    quarter: currentQuarter,
    week: currentWeek,
    assigned_to: this.currentUserId  // EMP-013: Only show assigned goals
  });

  this.renderWeeklyGoals(goals.goals);
}

// Update progress - EMP-014
async handleProgressUpdate(goalId, newProgress) {
  await goalsAPIClient.updateProgress(goalId, {
    progress: newProgress,
    current_value: Math.round((goal.target_value * newProgress) / 100)
  });

  // Refresh to show updated health_status
  await this.loadWeeklyGoals();
}
```

**Acceptance Criteria**:
- [ ] Employee can view weekly goals for current week (EMP-013)
- [ ] Employee can update progress 0-100% (EMP-014)
- [ ] Employee can mark goal complete (100% progress)
- [ ] Manager can view team's weekly goals (filters)
- [ ] Breadcrumb links to parent quarterly goal
- [ ] Progress slider updates in real-time
- [ ] Health indicator shows: excellent (green), on_track (blue), at_risk (yellow), critical (red)
- [ ] Overdue goals highlighted

**Hour 17-18: Assign Goal Modal Component**
- **File**: `client/components/assign-goal-modal.html` (~200 lines)

- **Features**:
  ```html
  <div class="modal assign-goal-modal">
    <div class="team-members-list">
      <!-- Search bar -->
      <input type="text" id="member-search" placeholder="Search team members">

      <!-- Team members with checkboxes -->
      <div class="member-item">
        <input type="checkbox" id="member-123">
        <label>
          <img src="avatar.jpg" class="avatar">
          <span>John Doe</span>
          <span class="role">Manager</span>
        </label>
      </div>
    </div>

    <div class="selected-assignees">
      <h4>Assigned To (3)</h4>
      <div class="assignee-chips">
        <span class="chip">John Doe <button>×</button></span>
      </div>
    </div>

    <button id="save-assignments">Assign Goal</button>
  </div>
  ```

- **Acceptance Criteria**:
  - [ ] Manager can search team members
  - [ ] Manager can select multiple assignees
  - [ ] Manager can remove assignees
  - [ ] API call updates goal.assigned_to array

**Hour 19-20: CSS Styling & Polish**
- **Tasks**:
  - Add goal card styles (shadows, hover states)
  - Style progress bars with gradient
  - Add filter dropdown animations
  - Mobile responsive layout
  - Loading skeletons

---

### **Hour 21-26: Testing & Integration (Day 2 PM + Buffer)** 🧪 **REVISED: 6 hours**

**E2E User Story Validation** (4 critical stories):

#### **Test 1: MGR-025 - Create Quarterly Goal from Objective** (1.5 hours)

**Scenario**: Manager creates a new quarterly goal linked to an existing objective

**Steps**:
1. Login as Manager role
2. Navigate to quarterly-goals.html
3. Click "Create Quarterly Goal"
4. Fill form in goal-details modal:
   - Name: "Increase MRR by $50K"
   - Objective: Select from dropdown (populated from /api/objectives)
   - Time Period: QUARTERLY
   - Quarter: Q1
   - Start Date: 2025-01-01
   - End Date: 2025-03-31
   - Target Value: 50000
   - Metric Type: currency
   - Unit: USD
5. Click "Save Goal"

**Expected**:
- ✅ POST /api/goals called with time_period='QUARTERLY'
- ✅ Goal appears in quarterly goals grid
- ✅ Goal card shows: name, Q1 2025, linked objective, 0% progress
- ✅ Success message displayed
- ✅ No console errors

**Verification**:
```javascript
const goal = await goalsAPIClient.getGoals({ time_period: 'QUARTERLY', quarter: 'Q1' });
console.assert(goal.goals.length > 0, 'Goal created');
console.assert(goal.goals[0].time_period === 'QUARTERLY', 'Type is quarterly');
```

---

#### **Test 2: MGR-026 - Break Down Quarterly Goal** (2 hours)

**Scenario**: Manager breaks quarterly goal into 13 weekly goals

**Steps**:
1. From quarterly goals grid, click "Break Down" on goal from Test 1
2. Confirm breakdown (13 weeks)
3. Wait for API call to complete

**Expected**:
- ✅ POST /api/goals/:id/breakdown called
- ✅ Response shows 13 weekly goals created
- ✅ Quarterly goal card updates: "13/13 Weekly Goals"
- ✅ Child goals visible in weekly-goals.html
- ✅ Each weekly goal:
  - Has time_period='WEEKLY'
  - Week number 1-13
  - Parent_goal_id = quarterly goal ID
  - Target value = 50000/13 = ~3846 per week
  - Consecutive 7-day periods

**Verification**:
```javascript
const breakdown = await goalsAPIClient.getGoals({
  time_period: 'WEEKLY',
  parent_goal_id: '<quarterly_goal_id>'
});
console.assert(breakdown.goals.length === 13, '13 weekly goals created');
console.assert(breakdown.goals[0].week === 1, 'Week numbering correct');
console.assert(breakdown.goals[0].parent_goal_id === '<quarterly_goal_id>', 'Parent link');
```

---

#### **Test 3: EMP-013 - View Assigned Weekly Goals** (1 hour)

**Scenario**: Employee views goals assigned to them for current week

**Steps**:
1. Assign 3 weekly goals to test employee (use assign modal)
2. Login as Employee role
3. Navigate to weekly-goals.html

**Expected**:
- ✅ GET /api/goals/my/goals called
- ✅ Only assigned goals shown (3 goals)
- ✅ Current week highlighted in calendar
- ✅ Goals show: name, week number, parent quarterly goal breadcrumb
- ✅ Progress sliders visible
- ✅ Health indicators (all should be "on_track" initially)

**Verification**:
```javascript
const myGoals = await goalsAPIClient.getMyGoals();
console.assert(myGoals.goals.length === 3, 'Only assigned goals shown');
console.assert(myGoals.goals.every(g => g.assigned_to.some(a => a.user_id === currentUserId)), 'All goals assigned to user');
```

---

#### **Test 4: EMP-014 - Update Goal Progress** (1.5 hours)

**Scenario**: Employee updates weekly goal progress to 75%

**Steps**:
1. From weekly-goals page, drag progress slider to 75%
2. Verify API call
3. Refresh page

**Expected**:
- ✅ PUT /api/goals/:id/progress called with { progress: 75 }
- ✅ Goal progress updates immediately
- ✅ Current value calculated: 75% of target
- ✅ Health status updates (should show "on_track" or "excellent")
- ✅ Progress persists after refresh
- ✅ Parent quarterly goal progress recalculates (aggregate of all weekly)

**Verification**:
```javascript
const updated = await goalsAPIClient.getGoalById('<goal_id>');
console.assert(updated.goal.progress === 75, 'Progress updated');
console.assert(updated.goal.status === 'in_progress', 'Status auto-updated');
console.assert(updated.goal.current_value === Math.round(updated.goal.target_value * 0.75), 'Current value calculated');
```

---

#### **Additional Test Coverage**:

**API Endpoint Coverage** (12 endpoints):
- [ ] GET /api/goals (with filters)
- [ ] POST /api/goals
- [ ] GET /api/goals/:id
- [ ] PUT /api/goals/:id
- [ ] DELETE /api/goals/:id
- [ ] POST /api/goals/:id/breakdown ✅ NEW
- [ ] PUT /api/goals/:id/assign
- [ ] PUT /api/goals/:id/progress
- [ ] GET /api/goals/quarter/:quarter
- [ ] GET /api/goals/my/goals
- [ ] GET /api/goals/status/overdue
- [ ] GET /api/goals/stats/summary

**Error Handling**:
- [ ] Network failures (offline mode)
- [ ] 401 Unauthorized (expired token)
- [ ] 404 Not Found (deleted goal)
- [ ] 400 Bad Request (validation errors)
- [ ] 500 Server Error (backend crash)

**UI/UX**:
- [ ] Loading states display (spinner/skeleton)
- [ ] Success toast messages
- [ ] Error toast messages
- [ ] Empty states (no goals)
- [ ] Filter combinations work
- [ ] Sort by priority/date/status
- [ ] Mobile responsive (breakpoints: 768px, 1024px)

**Cross-Browser**:
- [ ] Chrome 120+
- [ ] Firefox 120+
- [ ] Safari 17+
- [ ] Edge 120+

---

#### **Final Success Criteria**:

**User Stories** (4 of 4 complete):
- [x] **MGR-025**: Manager can create quarterly goals from objectives ✅
- [x] **MGR-026**: Manager can break quarterly goals into 13 weekly goals ✅
- [x] **EMP-013**: Employee can view assigned weekly goals ✅
- [x] **EMP-014**: Employee can update goal progress (0-100%) ✅

**Technical**:
- [ ] All 12 API endpoints functional via UI (11 existing + 1 breakdown)
- [ ] company_id properly filtered on all requests
- [ ] No console errors
- [ ] All filters functional (quarter, objective, status, time_period)
- [ ] Progress rollup works (weekly → quarterly → objective)
- [ ] Health indicators accurate
- [ ] Assignment workflow complete
- [ ] Breakdown workflow complete

**Documentation**:
- [ ] API client documented (inline JSDoc)
- [ ] User manual updated (how to create/breakdown goals)
- [ ] Known issues logged (if any)

**Total Estimated Time**: **3.5 days (28 hours)**
- Pre-work (Backend): 4 hours
- Frontend Development: 18 hours
- Testing & Integration: 6 hours

**Assigned**: Frontend + Backend Teams
**Status**: ❌ NOT STARTED (Waiting for pre-work completion)

---

### **BLOCKER 2: Companies API Route** ✅ COMPLETE

**Status**: ✅ **COMPLETE** (Oct 25, 2025)
**Resolution**: Created [companies.js](../../../../server/routes/companies.js) with full CRUD + stats

#### **Completed Work**:

**File Created**: `server/routes/companies.js` (591 lines)

**8 Endpoints Implemented**:

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/companies` | GET | List companies (role-based filtering) | ✅ Complete |
| `/api/companies/:id` | GET | Get single company | ✅ Complete |
| `/api/companies/:id/stats` | GET | Company statistics (users, teams, objectives, goals) | ✅ Complete |
| `/api/companies` | POST | Create company (CONSULTANT only) | ✅ Complete |
| `/api/companies/:id` | PUT | Update company details | ✅ Complete |
| `/api/companies/:id/assessment-scores` | PUT | Update assessment scores | ✅ Complete |
| `/api/companies/:id/onboarding` | PUT | Update onboarding progress | ✅ Complete |
| `/api/companies/:id` | DELETE | Delete/deactivate company | ✅ Complete |

**Key Features**:
- ✅ Role-based authorization (CONSULTANT sees managed companies, others see their own)
- ✅ Uses `company_id` exclusively (NO backward compatibility)
- ✅ Clean query patterns (no `$or` queries)
- ✅ Comprehensive error handling
- ✅ Input validation with Joi
- ✅ Statistics aggregation across all resources

**Replaced**: `server/routes/businesses.js` (deleted)
**Registered**: Route added to `server/index.js` as `/api/companies`

**Documentation**: [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)

---

### **BLOCKER 3: Business → Company Migration** ✅ COMPLETE

**Status**: ✅ **COMPLETE** (Oct 25, 2025)
**Strategy**: Complete one-time migration (NO backward compatibility)
**Files Changed**: 69 files, ~6,900 lines

#### **✅ COMPLETED WORK**:

**Backend Models** (11 files):
- ✅ Created [Company.js](../../../../server/models/Company.js) (247 lines) - replaces Business.js
- ✅ Updated [User.js](../../../../server/models/User.js) - removed business_id, added multi-company support
- ✅ Updated 9 resource models (Team, Goal, Task, Objective, Assessment, etc.) - removed business_id, using company_id only

**Backend Routes** (10 files):
- ✅ Created [companies.js](../../../../server/routes/companies.js) (8 endpoints, 591 lines)
- ✅ Updated [auth.js](../../../../server/routes/auth.js) - auto-creates Company on signup
- ✅ Updated 8 resource routes (goals, objectives, tasks, teams, assessments, invitations, ai-okr, analytics)
- ✅ Deleted businesses.js route
- ✅ Updated server/index.js - registered /api/companies route

**Frontend** (46 files):
- ✅ Updated 21 JavaScript files (business_id → company_id, API endpoints)
- ✅ Updated 25 HTML files (UI text, variable names)
- ✅ Updated localStorage keys

**Data Migration**:
- ✅ Created [migrate-business-to-company.js](../../../../server/scripts/migrate-business-to-company.js) (365 lines)
- ✅ Idempotent script (safe to run multiple times)
- ✅ Preserves Business._id when creating Company documents
- ✅ Updates all User and resource documents
- ✅ Comprehensive verification and statistics

**Key Changes**:
- ❌ Removed ALL `business_id` references (NO backward compatibility)
- ❌ Removed dual-field sync logic
- ❌ Removed `$or` query patterns
- ✅ Clean, single source of truth (`company_id` everywhere)
- ✅ User.companies[] array for multi-company support
- ✅ User.managed_companies[] for consultants
- ✅ JWT tokens include company_id

**Migration Checklist**:
- ✅ Company.js model created with full IAM schema
- ✅ All models use company_id only (business_id removed)
- ✅ /api/companies route operational (8 endpoints)
- ✅ All resource routes use company_id queries
- ✅ Frontend uses "Company" terminology
- ✅ Migration script created and ready
- ✅ Documentation updated

**Documentation**:
- ✅ [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) - Complete technical summary
- ✅ [COMPANY_MIGRATION_COMPLETE_SUMMARY.md](./COMPANY_MIGRATION_COMPLETE_SUMMARY.md) - Detailed changes
- ✅ [MIGRATION_QUICK_START.md](./MIGRATION_QUICK_START.md) - Developer reference

**Deployment Status**: ⏳ **Ready to Deploy**
- Migration script needs to run: `node server/scripts/migrate-business-to-company.js`
- Users will need to re-login after deployment

---

## 🗓️ DAY-BY-DAY BREAKDOWN (Days 2-6)

**NOTE**: Day 0-1 handles Goal UI completion. The following Week 7 IAM tasks run Day 2-6.

**Prerequisites for Day 2 Start**:
- ✅ Blocker 2 (Companies API) - COMPLETE
- ✅ Blocker 3 (Migration) - COMPLETE
- ❌ Blocker 1 (Goal UI) - Must complete Day 0-1 first
- ⏳ Migration script deployed to production
- ⏳ All users re-logged in with company_id tokens

---

### **DAY 2 (8 hours): Company Model & CRUD**

#### **Morning (4 hours): Company Schema & Model**

**Task 1.1**: Create Company Model
**File**: `server/models/Company.js`
**Time**: 2 hours
**Priority**: P0 (CRITICAL)

**Schema** (based on database_schema.md:213-274):
```javascript
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  // Company Information
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    trim: true
  },
  industry: {
    type: String,
    maxlength: 100
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  employee_count: {
    type: Number,
    min: 1
  },
  website: String,

  // Business Architecture
  archetype: String, // One of 16 business archetypes
  strategic_focus: [String], // 3-5 selections from 24 focus areas

  // Ownership
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Subscription & Features
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'professional', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'trial', 'suspended', 'cancelled'],
      default: 'trial'
    },
    trial_ends_at: Date,
    current_period_end: Date
  },

  // Feature Flags (Block-level enablement)
  feature_flags: {
    iam_block: { type: Boolean, default: true },
    assessment_block: { type: Boolean, default: true },
    ai_engine: { type: Boolean, default: false },
    progress_rollup: { type: Boolean, default: true },
    bulk_ops: { type: Boolean, default: true },
    permission_rules: { type: Boolean, default: false },
    ibrain_enabled: { type: Boolean, default: false }
  },

  // Company Settings
  settings: {
    default_timezone: { type: String, default: 'America/New_York' },
    fiscal_year_start: { type: Number, min: 1, max: 12, default: 1 },
    okr_cycle: { type: String, enum: ['quarterly', 'yearly'], default: 'quarterly' },
    week_start_day: { type: Number, min: 0, max: 6, default: 1 }
  },

  // Assessment Scores (company-level aggregation)
  assessment_scores: {
    speed_score: { type: Number, min: 0, max: 100, default: 0 },
    strength_score: { type: Number, min: 0, max: 100, default: 0 },
    intelligence_score: { type: Number, min: 0, max: 100, default: 0 },
    overall_score: { type: Number, min: 0, max: 100, default: 0 }
  },

  // Metadata
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes (from database_schema.md:276-281)
CompanySchema.index({ name: 1 }, { unique: true });
CompanySchema.index({ owner_id: 1 });
CompanySchema.index({ created_at: -1 });
CompanySchema.index({ 'subscription.status': 1 });
CompanySchema.index({ status: 1 });

// Instance Methods
CompanySchema.methods.isFeatureEnabled = function(featureName) {
  return this.feature_flags[featureName] === true;
};

CompanySchema.methods.updateAssessmentScores = function(scores) {
  this.assessment_scores = { ...this.assessment_scores, ...scores };
  return this.save();
};

// Static Methods
CompanySchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner_id: ownerId, status: 'active' });
};

CompanySchema.statics.findActiveCompanies = function() {
  return this.find({ status: 'active', 'subscription.status': 'active' });
};

module.exports = mongoose.model('Company', CompanySchema);
```

**Acceptance Criteria**:
- ✅ Company model matches database_schema.md:213-289
- ✅ All indexes created correctly
- ✅ Feature flags default to correct values
- ✅ Model exports successfully

---

**Task 1.2**: Update User Model with companies[] Array
**File**: `server/models/User.js`
**Time**: 1.5 hours
**Priority**: P0 (CRITICAL)
**Dependencies**: database_schema.md:142-149

**Changes to User Model**:
```javascript
// Add to existing UserSchema

// Company Association (Block 2 - Modular IAM)
companies: [{
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  role: {
    type: String,
    enum: ['OWNER', 'MANAGER', 'EMPLOYEE', 'CONSULTANT']
  },
  joined_at: {
    type: Date,
    default: Date.now
  },
  is_primary: {
    type: Boolean,
    default: false
  }
}],
current_company_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',
  default: null
},

// Add new indexes
UserSchema.index({ 'companies.company_id': 1 });
UserSchema.index({ current_company_id: 1 });

// Add new instance methods
UserSchema.methods.addCompany = function(companyId, role, isPrimary = false) {
  // Remove is_primary from all if this is primary
  if (isPrimary) {
    this.companies.forEach(c => c.is_primary = false);
  }

  this.companies.push({
    company_id: companyId,
    role: role,
    joined_at: new Date(),
    is_primary: isPrimary
  });

  // Set current_company_id if first company or primary
  if (this.companies.length === 1 || isPrimary) {
    this.current_company_id = companyId;
  }

  return this.save();
};

UserSchema.methods.switchCompany = function(companyId) {
  const company = this.companies.find(c => c.company_id.equals(companyId));
  if (!company) {
    throw new Error('User not member of this company');
  }
  this.current_company_id = companyId;
  return this.save();
};

UserSchema.methods.removeCompany = function(companyId) {
  this.companies = this.companies.filter(c => !c.company_id.equals(companyId));

  // Reset current_company_id if removed company was active
  if (this.current_company_id && this.current_company_id.equals(companyId)) {
    this.current_company_id = this.companies.length > 0 ? this.companies[0].company_id : null;
  }

  return this.save();
};

UserSchema.methods.getPrimaryCompany = function() {
  return this.companies.find(c => c.is_primary) || this.companies[0];
};

UserSchema.methods.getCurrentCompanyRole = function() {
  if (!this.current_company_id) return null;
  const company = this.companies.find(c => c.company_id.equals(this.current_company_id));
  return company ? company.role : null;
};
```

**Acceptance Criteria**:
- ✅ companies[] array added to User model
- ✅ current_company_id field added
- ✅ All helper methods work correctly
- ✅ Backward compatibility maintained (business_id still exists)

---

**Task 1.3**: Migrate Existing Team Model
**File**: `server/models/Team.js` (existing from Week 5)
**Time**: 0.5 hours
**Priority**: P0

**Changes**:
```javascript
// Add company_id field to existing TeamSchema
company_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',
  required: function() {
    // Required if IAM block is enabled
    const config = require('../config/feature-flags');
    return config.IAM_BLOCK;
  },
  index: true
},

// Add index
TeamSchema.index({ company_id: 1, name: 1 }, { unique: true, sparse: true });

// Update existing findByBusiness method
TeamSchema.statics.findByCompany = function(companyId) {
  return this.find({ company_id: companyId, is_active: true });
};
```

**Acceptance Criteria**:
- ✅ company_id added to Team model
- ✅ Existing teams still work (business_id backward compatible)
- ✅ New teams require company_id when IAM_BLOCK enabled

---

#### **Afternoon (4 hours): Company API Endpoints**

**Task 1.4**: Company CRUD Routes
**File**: `server/routes/companies.js` (NEW)
**Time**: 3 hours
**Priority**: P0

```javascript
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { IAM_BLOCK } = require('../config/feature-flags');

// Middleware: Check if IAM block is enabled
router.use((req, res, next) => {
  if (!IAM_BLOCK) {
    return res.status(403).json({
      success: false,
      message: 'IAM Block not enabled. Enable ENABLE_IAM_BLOCK in environment.'
    });
  }
  next();
});

// POST /api/companies - Create new company
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, industry, size, employee_count, website } = req.body;

    // Create company
    const company = new Company({
      name,
      industry,
      size,
      employee_count,
      website,
      owner_id: req.user._id,
      created_by: req.user._id
    });

    await company.save();

    // Add company to user's companies array with OWNER role
    await req.user.addCompany(company._id, 'OWNER', true);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create company'
    });
  }
});

// GET /api/companies - Get user's companies
router.get('/', authenticate, async (req, res) => {
  try {
    const companyIds = req.user.companies.map(c => c.company_id);

    const companies = await Company.find({
      _id: { $in: companyIds },
      status: 'active'
    }).populate('owner_id', 'first_name last_name email');

    // Add role info from user.companies
    const companiesWithRoles = companies.map(company => {
      const userCompany = req.user.companies.find(
        c => c.company_id.equals(company._id)
      );

      return {
        ...company.toObject(),
        user_role: userCompany ? userCompany.role : null,
        is_primary: userCompany ? userCompany.is_primary : false
      };
    });

    res.json({
      success: true,
      data: companiesWithRoles,
      current_company_id: req.user.current_company_id
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies'
    });
  }
});

// GET /api/companies/:id - Get single company
router.get('/:id', authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner_id', 'first_name last_name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check user has access to this company
    const hasAccess = req.user.companies.some(
      c => c.company_id.equals(company._id)
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this company'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company'
    });
  }
});

// PUT /api/companies/:id - Update company
router.put('/:id', authenticate, authorize(['OWNER', 'MANAGER']), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Only owner can update
    if (!company.owner_id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only company owner can update company'
      });
    }

    const allowedUpdates = ['name', 'industry', 'size', 'employee_count', 'website', 'settings'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        company[key] = req.body[key];
      }
    });

    await company.save();

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update company'
    });
  }
});

// POST /api/companies/:id/switch - Switch active company (for consultants)
router.post('/:id/switch', authenticate, async (req, res) => {
  try {
    await req.user.switchCompany(req.params.id);

    res.json({
      success: true,
      message: 'Company switched successfully',
      current_company_id: req.user.current_company_id
    });
  } catch (error) {
    console.error('Switch company error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to switch company'
    });
  }
});

// DELETE /api/companies/:id - Soft delete company
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Only owner can delete
    if (!company.owner_id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only company owner can delete company'
      });
    }

    company.status = 'inactive';
    await company.save();

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company'
    });
  }
});

module.exports = router;
```

**Register Route in server/index.js**:
```javascript
app.use('/api/companies', require('./routes/companies'));
```

**Acceptance Criteria**:
- ✅ POST /api/companies creates company and adds to user.companies[]
- ✅ GET /api/companies returns user's companies with roles
- ✅ GET /api/companies/:id returns single company with access check
- ✅ PUT /api/companies/:id updates company (owner only)
- ✅ POST /api/companies/:id/switch changes current_company_id
- ✅ DELETE /api/companies/:id soft deletes company

---

**Task 1.5**: Update auth middleware for company context
**File**: `server/middleware/auth.js`
**Time**: 1 hour
**Priority**: P0

```javascript
// Add to existing auth middleware

const injectCompanyContext = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  // Get current company ID (from user or query param)
  const companyId = req.query.company_id || req.user.current_company_id;

  if (companyId) {
    req.companyContext = {
      company_id: companyId,
      role: req.user.getCurrentCompanyRole()
    };
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  injectCompanyContext // NEW - add company context to requests
};
```

**Acceptance Criteria**:
- ✅ req.companyContext available after authentication
- ✅ Contains company_id and user's role in that company
- ✅ Handles missing current_company_id gracefully

---

### **DAY 3 (8 hours): Team Management with Company Isolation**

#### **Morning (4 hours): Update Team Routes**

**Task 2.1**: Migrate Team Routes to Company-Scoped
**File**: `server/routes/teams.js` (existing from Week 5, update)
**Time**: 2 hours
**Priority**: P0

**Changes to existing routes**:
```javascript
// Add company context middleware
const { injectCompanyContext } = require('../middleware/auth');
router.use(injectCompanyContext);

// Update POST /api/teams - add company_id
router.post('/', authenticate, authorize(['OWNER', 'MANAGER']), async (req, res) => {
  try {
    const { name, description, department, function: teamFunction, manager_id } = req.body;

    // Get company_id from context
    const company_id = req.companyContext?.company_id || req.user.business_id;

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: 'Company context required. Create or select a company first.'
      });
    }

    const team = new Team({
      company_id, // NEW - company isolation
      business_id: req.user.business_id, // LEGACY - backward compatibility
      name,
      description,
      department,
      function: teamFunction,
      manager_id,
      created_by: req.user._id
    });

    await team.save();

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create team'
    });
  }
});

// Update GET /api/teams - filter by company
router.get('/', authenticate, async (req, res) => {
  try {
    const company_id = req.companyContext?.company_id || req.user.business_id;

    const query = {
      $or: [
        { company_id }, // NEW - company-scoped
        { business_id: req.user.business_id } // LEGACY - backward compatibility
      ],
      is_active: true
    };

    const teams = await Team.find(query)
      .populate('manager_id', 'first_name last_name email')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: teams,
      company_id
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams'
    });
  }
});

// Similar updates for GET /:id, PUT /:id, DELETE /:id, etc.
// All queries must check company_id for data isolation
```

**Acceptance Criteria**:
- ✅ Teams scoped to company_id when IAM Block enabled
- ✅ Backward compatible with business_id for existing teams
- ✅ Company context injected from req.companyContext
- ✅ Multi-company consultants see correct teams per company

---

**Task 2.2**: Team Members with Company Roles
**File**: `server/routes/teams.js`
**Time**: 2 hours
**Priority**: P0

```javascript
// POST /api/teams/:id/members - Add member to team
router.post('/:id/members', authenticate, authorize(['OWNER', 'MANAGER']), async (req, res) => {
  try {
    const { user_id, role } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check company access
    const company_id = req.companyContext?.company_id;
    if (company_id && !team.company_id.equals(company_id)) {
      return res.status(403).json({
        success: false,
        message: 'Team not in current company context'
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user to team
    const memberData = {
      user_id,
      user_name: `${user.first_name} ${user.last_name}`,
      user_email: user.email,
      role,
      status: 'active'
    };

    await team.addMember(memberData);

    res.json({
      success: true,
      message: 'Member added to team successfully',
      data: team
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add team member'
    });
  }
});

// DELETE /api/teams/:id/members/:userId - Remove member from team
router.delete('/:id/members/:userId', authenticate, authorize(['OWNER', 'MANAGER']), async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check company access
    const company_id = req.companyContext?.company_id;
    if (company_id && !team.company_id.equals(company_id)) {
      return res.status(403).json({
        success: false,
        message: 'Team not in current company context'
      });
    }

    await team.removeMember(req.params.userId);

    res.json({
      success: true,
      message: 'Member removed from team successfully',
      data: team
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to remove team member'
    });
  }
});
```

**Acceptance Criteria**:
- ✅ Team members added/removed with company context check
- ✅ Only managers/owners of the company can modify team
- ✅ Member list respects company isolation

---

#### **Afternoon (4 hours): Company Creation Frontend**

**Task 2.3**: Company Creation Form
**File**: `client/pages/company-setup.html` (NEW)
**Time**: 2 hours
**Priority**: P0

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Setup - KARVIA Pro</title>
  <link rel="stylesheet" href="../styles/main.css">
</head>
<body>
  <div class="container">
    <div class="company-setup-card">
      <h1>Create Your Company</h1>
      <p class="subtitle">Set up your organization to get started with KARVIA Pro</p>

      <form id="company-setup-form">
        <!-- Company Name -->
        <div class="form-group">
          <label for="company-name">Company Name *</label>
          <input
            type="text"
            id="company-name"
            name="name"
            required
            maxlength="255"
            placeholder="Acme Corporation">
        </div>

        <!-- Industry -->
        <div class="form-group">
          <label for="industry">Industry</label>
          <input
            type="text"
            id="industry"
            name="industry"
            maxlength="100"
            placeholder="Technology, Healthcare, Finance, etc.">
        </div>

        <!-- Company Size -->
        <div class="form-group">
          <label for="size">Company Size *</label>
          <select id="size" name="size" required>
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>

        <!-- Employee Count -->
        <div class="form-group">
          <label for="employee-count">Employee Count</label>
          <input
            type="number"
            id="employee-count"
            name="employee_count"
            min="1"
            placeholder="25">
        </div>

        <!-- Website -->
        <div class="form-group">
          <label for="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            placeholder="https://www.acme.com">
        </div>

        <!-- Submit Buttons -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            Create Company
          </button>
          <button type="button" class="btn btn-secondary" onclick="skipCompanySetup()">
            Skip (Solo Mode)
          </button>
        </div>
      </form>

      <div id="error-message" class="alert alert-danger" style="display: none;"></div>
    </div>
  </div>

  <script src="../js/api-client.js"></script>
  <script src="./scripts/company-setup.js"></script>
</body>
</html>
```

**Task 2.4**: Company Setup JavaScript
**File**: `client/pages/scripts/company-setup.js` (NEW)
**Time**: 2 hours
**Priority**: P0

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('company-setup-form');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', handleCompanySetup);
});

async function handleCompanySetup(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const companyData = {
    name: formData.get('name'),
    industry: formData.get('industry'),
    size: formData.get('size'),
    employee_count: parseInt(formData.get('employee_count')) || null,
    website: formData.get('website')
  };

  try {
    showLoading(true);

    const response = await fetch('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(companyData)
    });

    const result = await response.json();

    if (result.success) {
      // Company created successfully
      showSuccess('Company created successfully!');

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } else {
      showError(result.message || 'Failed to create company');
    }
  } catch (error) {
    console.error('Company setup error:', error);
    showError('An error occurred. Please try again.');
  } finally {
    showLoading(false);
  }
}

function skipCompanySetup() {
  // Solo user mode - skip company creation (Block 1 only)
  if (confirm('Continue in Solo Mode? You can create a company later from Settings.')) {
    window.location.href = '/dashboard.html';
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function showSuccess(message) {
  // Show success toast or message
  alert(message); // Replace with better toast UI
}

function showLoading(show) {
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.disabled = show;
  submitBtn.textContent = show ? 'Creating...' : 'Create Company';
}
```

**Acceptance Criteria**:
- ✅ Company setup form renders correctly
- ✅ Form validation works (name, size required)
- ✅ POST /api/companies called on submit
- ✅ Success redirects to dashboard
- ✅ "Skip" button allows solo mode (Block 1 only)
- ✅ Error messages displayed clearly

---

### **DAY 4 (8 hours): Extended Testing - Backend & API Validation** ✅ **NEW FOCUS**

**Scope Change**: Bulk Invitations feature moved to Beta phase. Day 4 now dedicated to comprehensive testing of Days 0-3 deliverables.

**Priority**: P0 (Quality Assurance - CRITICAL)

---

#### **Morning (4 hours): Backend Testing & Validation**

**Task 4.1**: Goal Management API Testing (From Day 0-1)
**Time**: 2 hours
**Priority**: P0

**Test Coverage**:
1. **Goal CRUD Operations** (11 endpoints):
   ```bash
   # Test all Goal API endpoints
   npm test -- --grep "Goal API"

   # Manual testing with Postman collection
   # Test cases:
   # - POST /api/goals (create quarterly goal)
   # - POST /api/goals/:id/breakdown (create 13 weekly goals)
   # - GET /api/goals?time_period=QUARTERLY
   # - GET /api/goals?time_period=WEEKLY
   # - PUT /api/goals/:id/progress
   # - PUT /api/goals/:id/assign
   # - DELETE /api/goals/:id
   ```

2. **Goal Hierarchy Validation**:
   ```javascript
   // Test parent-child relationships
   // Test quarterly goal → 13 weekly goals breakdown
   // Test cascade operations (update parent affects children)
   // Test orphan handling (delete parent, what happens to children?)
   ```

3. **Company Isolation Testing**:
   ```javascript
   // Create goals in Company A
   // Verify Company B cannot see Company A's goals
   // Test company_id filtering on all GET endpoints
   ```

**Acceptance Criteria**:
- ✅ All 11 Goal API endpoints return correct status codes
- ✅ Hierarchy fields (time_period, parent_goal_id, child_goal_ids) work correctly
- ✅ Company isolation verified (no cross-company data leaks)
- ✅ Breakdown endpoint creates exactly 13 weekly goals
- ✅ Progress calculation accurate across hierarchy

---

**Task 4.2**: Company & Team API Testing (From Day 2-3)
**Time**: 2 hours
**Priority**: P0

**Test Coverage**:
1. **Company CRUD**:
   ```bash
   # Test Company API endpoints
   POST /api/companies (create company)
   GET /api/companies (list companies)
   GET /api/companies/:id (get company details)
   PUT /api/companies/:id (update company)
   DELETE /api/companies/:id (soft delete)
   ```

2. **Team Management**:
   ```bash
   # Test Team API with company isolation
   POST /api/teams (create team)
   POST /api/teams/:id/members (add member)
   DELETE /api/teams/:id/members/:userId (remove member)
   GET /api/teams?company_id=X (filter by company)
   ```

3. **Multi-Company User Flow**:
   ```javascript
   // Test consultant with 3 companies
   // - User.companies[] array populated correctly
   // - User.current_company_id switches contexts
   // - JWT token contains correct company_id after switch
   ```

**Acceptance Criteria**:
- ✅ Company CRUD operations work correctly
- ✅ Team creation isolated by company_id
- ✅ Team members cannot see other companies' teams
- ✅ Multi-company users can access all their companies
- ✅ Archetype and strategic_focus fields save correctly

---

#### **Afternoon (4 hours): Integration Testing & Data Validation**

**Task 4.3**: End-to-End User Flows
**Time**: 2 hours
**Priority**: P0

**Test Scenarios**:

**Scenario 1: Owner Creates Company & Team** (MGR-025 variant)
```
1. Owner registers account
2. Owner creates company (Startup archetype, Growth focus)
3. Owner creates team (Engineering, 5 members)
4. Owner creates quarterly goal for team
5. Manager breaks goal into 13 weekly goals
6. VERIFY:
   - Company record exists with archetype + strategic_focus
   - Team record has company_id
   - Goals have company_id and team_id
   - Hierarchy: 1 quarterly → 13 weekly goals
```

**Scenario 2: Consultant Multi-Company Access**
```
1. Consultant account with 3 companies
2. Consultant switches to Company A
3. Create goal in Company A
4. Switch to Company B
5. Create goal in Company B
6. Switch back to Company A
7. VERIFY:
   - Goals in Company A have company_id = A
   - Goals in Company B have company_id = B
   - Consultant can see both when switching
   - Employee in Company A cannot see Company B goals
```

**Scenario 3: Solo User (Block 1 Only Mode)**
```
1. Employee registers without company
2. Create personal objective
3. Create personal goal
4. VERIFY:
   - company_id = null (allowed)
   - User can work independently
   - No company features shown in UI
```

**Acceptance Criteria**:
- ✅ All 3 scenarios complete without errors
- ✅ Data isolation verified
- ✅ Multi-company context switching works
- ✅ Solo user mode functional

---

**Task 4.4**: Database Integrity & Migration Validation
**Time**: 2 hours
**Priority**: P0

**Validation Checklist**:

1. **Schema Consistency**:
   ```bash
   # Verify all collections have correct indexes
   mongo --eval "db.companies.getIndexes()"
   mongo --eval "db.teams.getIndexes()"
   mongo --eval "db.goals.getIndexes()"
   mongo --eval "db.users.getIndexes()"

   # Expected indexes:
   # - companies: { name: 1 }, { owner_id: 1 }
   # - teams: { company_id: 1, name: 1 }
   # - goals: { company_id: 1, objective_id: 1 }, { time_period: 1 }, { parent_goal_id: 1 }
   # - users: { 'companies.company_id': 1 }, { current_company_id: 1 }
   ```

2. **Migration Verification**:
   ```javascript
   // Verify migration from business_id → company_id
   // Check backward compatibility
   const legacyRecords = await Goal.find({ business_id: { $exists: true }, company_id: { $exists: false } });
   console.log(`Legacy records without company_id: ${legacyRecords.length}`); // Should be 0
   ```

3. **Data Quality Checks**:
   ```javascript
   // Check for orphaned records
   const orphanedGoals = await Goal.find({ objective_id: { $exists: false } });
   const goalsWithoutCompany = await Goal.find({ company_id: null, business_id: null });
   const teamsWithoutCompany = await Team.find({ company_id: null });

   console.log('Orphaned goals:', orphanedGoals.length); // Should be 0
   console.log('Goals without company (solo users):', goalsWithoutCompany.length); // OK if > 0
   console.log('Teams without company:', teamsWithoutCompany.length); // Should be 0
   ```

**Acceptance Criteria**:
- ✅ All indexes exist and optimized
- ✅ No orphaned records (except solo users)
- ✅ Migration complete (100% records have company_id)
- ✅ Database schema matches database_schema.md

---

**Day 4 Summary**:
- ✅ Goal API (11 endpoints) fully tested
- ✅ Company & Team APIs validated
- ✅ 3 E2E user flows completed
- ✅ Database integrity verified
- ✅ Zero critical bugs found

---

### **DAY 5 (8 hours): Extended Testing - Frontend & UX Validation** ✅ **NEW FOCUS**

**Scope Change**: Invitation Acceptance feature moved to Beta phase. Day 5 now dedicated to frontend testing and UX polish.

**Priority**: P0 (Quality Assurance - CRITICAL)

---

#### **Morning (4 hours): Frontend Testing & Cross-Browser Validation**

**Task 5.1**: Goal Management UI Testing (8 pages from Day 0-1)
**Time**: 2 hours
**Priority**: P0

**Test Pages**:
1. **goals-quarterly.html** - Quarterly goals view
   ```
   Manual Test Cases:
   - [ ] Page loads without errors
   - [ ] Quarterly goals list renders (with objectives)
   - [ ] "Create Goal from Objective" button works
   - [ ] Form validation (name, description, due_date required)
   - [ ] Goal created successfully (POST /api/goals)
   - [ ] Goal appears in list after creation
   - [ ] "Breakdown to Weekly Goals" button appears
   - [ ] Breakdown creates 13 weekly goals (POST /api/goals/:id/breakdown)
   ```

2. **goals-weekly.html** - Weekly goals view
   ```
   Manual Test Cases:
   - [ ] Weekly goals grouped by week number (1-13)
   - [ ] Filter by status works (Not Started, In Progress, Completed)
   - [ ] Progress bar shows correct percentage
   - [ ] "Add Task" button links to task creation
   - [ ] Progress update form works (PUT /api/goals/:id/progress)
   ```

3. **goal-detail.html** - Goal detail view
   ```
   Manual Test Cases:
   - [ ] Goal details render correctly
   - [ ] Parent goal link works (if weekly goal)
   - [ ] Child goals list shown (if quarterly goal)
   - [ ] Task list displays linked tasks
   - [ ] Progress chart renders
   - [ ] Edit form works (PUT /api/goals/:id)
   - [ ] Delete button shows confirmation modal
   ```

4. **goal-assign.html** - Goal assignment
   ```
   Manual Test Cases:
   - [ ] Team member dropdown populated
   - [ ] Assign goal to employee (PUT /api/goals/:id/assign)
   - [ ] Notification sent to assignee
   - [ ] Goal appears in employee's "My Goals" view
   ```

**Cross-Browser Testing**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Acceptance Criteria**:
- ✅ All 8 Goal UI pages load without errors
- ✅ All forms submit correctly
- ✅ All CRUD operations functional
- ✅ Cross-browser compatibility verified
- ✅ No JavaScript console errors

---

**Task 5.2**: Company & Team UI Testing (From Day 2-3)
**Time**: 2 hours
**Priority**: P0

**Test Pages**:
1. **company-setup.html** - Company creation wizard
   ```
   Manual Test Cases:
   - [ ] Step 1: Basic Info (name, industry, size) validates correctly
   - [ ] Step 2: Archetype selection (16 options) renders
   - [ ] Step 3: Strategic focus (24 options, multi-select 3-5) works
   - [ ] Step 4: Confirmation shows summary
   - [ ] Submit creates company (POST /api/companies)
   - [ ] Redirects to team creation after success
   ```

2. **teams.html** - Team management
   ```
   Manual Test Cases:
   - [ ] Teams list filters by company_id
   - [ ] Create team form works (POST /api/teams)
   - [ ] Add member form shows company users only
   - [ ] Remove member confirmation works
   - [ ] Team details page shows members + goals
   ```

3. **company-switcher** (component in header)
   ```
   Manual Test Cases:
   - [ ] Dropdown shows all user's companies
   - [ ] Current company highlighted
   - [ ] Click company switches context
   - [ ] Page reloads with new company_id
   - [ ] All data filtered by new company
   ```

**Responsive Design Testing**:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

**Acceptance Criteria**:
- ✅ Company setup wizard completes successfully
- ✅ Team management fully functional
- ✅ Company switcher works seamlessly
- ✅ Responsive design verified on 4 screen sizes
- ✅ No layout breaks or overlaps

---

#### **Afternoon (4 hours): UX Polish & Performance Optimization**

**Task 5.3**: UX Polish & Accessibility
**Time**: 2 hours
**Priority**: P1

**Polish Tasks**:
1. **Loading States**:
   ```javascript
   // Add loading spinners to all async operations
   // - Goal creation/update/delete
   // - Company creation
   // - Team member addition
   // - Context switching
   ```

2. **Error Handling**:
   ```javascript
   // User-friendly error messages
   // - Network errors: "Connection lost. Please try again."
   // - Validation errors: "Goal name is required"
   // - Permission errors: "You don't have permission to perform this action"
   // - 404 errors: "Goal not found. It may have been deleted."
   ```

3. **Empty States**:
   ```html
   <!-- No goals yet -->
   <div class="empty-state">
     <p>You don't have any goals yet.</p>
     <button>Create Your First Goal</button>
   </div>
   ```

4. **Accessibility (WCAG 2.1 Level AA)**:
   ```
   - [ ] All images have alt text
   - [ ] Form labels associated with inputs
   - [ ] Keyboard navigation works (Tab, Enter, Escape)
   - [ ] Focus indicators visible
   - [ ] Color contrast ratios pass (4.5:1 minimum)
   - [ ] ARIA labels on interactive elements
   ```

**Acceptance Criteria**:
- ✅ All loading states implemented
- ✅ Error messages user-friendly
- ✅ Empty states designed
- ✅ Basic accessibility requirements met
- ✅ Keyboard navigation functional

---

**Task 5.4**: Performance Optimization & Code Review
**Time**: 2 hours
**Priority**: P1

**Performance Checklist**:
1. **API Response Times**:
   ```
   Measure with browser DevTools Network tab:
   - GET /api/goals: < 200ms
   - GET /api/companies: < 100ms
   - POST /api/goals: < 300ms
   - POST /api/goals/:id/breakdown: < 500ms (creates 13 records)
   ```

2. **Frontend Optimization**:
   ```javascript
   // Lazy load large lists (pagination)
   // Cache API responses (5-minute TTL)
   // Debounce search inputs (300ms delay)
   // Minify JS/CSS for production
   ```

3. **Database Query Optimization**:
   ```javascript
   // Verify indexes used (use .explain())
   db.goals.find({ company_id: X }).explain("executionStats");
   // Should use index: { company_id: 1, objective_id: 1 }

   // Avoid N+1 queries (use populate)
   Goal.find().populate('objective_id').populate('assigned_to');
   ```

4. **Code Review**:
   ```
   - [ ] Remove console.log() statements
   - [ ] Remove commented-out code
   - [ ] Add JSDoc comments to functions
   - [ ] Fix ESLint warnings
   - [ ] Verify error handling in all try-catch blocks
   ```

**Acceptance Criteria**:
- ✅ All API endpoints < 500ms response time
- ✅ Frontend optimizations applied
- ✅ Database queries use indexes
- ✅ Code review checklist complete
- ✅ No performance bottlenecks identified

---

**Day 5 Summary**:
- ✅ All Goal UI pages tested (8 pages)
- ✅ Company & Team UIs validated
- ✅ Cross-browser compatibility verified
- ✅ UX polish completed (loading, errors, empty states)
- ✅ Performance optimized
- ✅ Code review complete

---
### **DAY 6 (8 hours): Multi-Company Context & Final Integration** ✅ **REVISED**

**Scope Change**: With Days 4-5 now focused on Extended Testing, Day 6 becomes the final integration day combining Multi-Company Switcher implementation with comprehensive final testing and polish.

**Priority**: P0 (CRITICAL - Final Week 7 deliverable)

---

#### **Morning (4 hours): Multi-Company Context Implementation**

**Task 5.1**: Update Auth Middleware for Company Auto-Association
**File**: `server/middleware/auth.js`
**Time**: 2 hours
**Priority**: P0

**Add company context injection**:
```javascript
const injectCompanyContext = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  // Refresh user to get latest companies array
  const user = await User.findById(req.user._id);
  if (!user) {
    return next();
  }

  // Get current company ID (from query, header, or user's current_company_id)
  let companyId = req.query.company_id ||
                  req.headers['x-company-id'] ||
                  user.current_company_id;

  // If user has companies but no current_company_id set, set to primary
  if (!companyId && user.companies.length > 0) {
    const primaryCompany = user.getPrimaryCompany();
    if (primaryCompany) {
      companyId = primaryCompany.company_id;
      user.current_company_id = companyId;
      await user.save();
    }
  }

  if (companyId) {
    // Get user's role in this company
    const companyMembership = user.companies.find(
      c => c.company_id.equals(companyId)
    );

    req.companyContext = {
      company_id: companyId,
      role: companyMembership ? companyMembership.role : null,
      is_primary: companyMembership ? companyMembership.is_primary : false
    };

    // Also attach to req.user for convenience
    req.user.current_company = req.companyContext;
  }

  next();
};
```

**Acceptance Criteria**:
- ✅ Company context injected for all authenticated requests
- ✅ Automatically sets current_company_id if not set
- ✅ Supports query param, header, and user's current_company_id
- ✅ req.companyContext available in all routes

---

**Task 5.2**: Update Objectives/Goals/Tasks Routes with Company Filter
**File**: `server/routes/objectives.js`, `goals.js`, `tasks.js`
**Time**: 2 hours
**Priority**: P0

**Update query filters to use company context**:

**Example for objectives.js**:
```javascript
// GET /api/objectives
router.get('/', authenticate, injectCompanyContext, async (req, res) => {
  try {
    const query = {
      is_active: true
    };

    // Add company context if available
    if (req.companyContext?.company_id) {
      query.company_id = req.companyContext.company_id;
    } else {
      // Fallback to business_id for backward compatibility
      query.business_id = req.user.business_id;
    }

    const objectives = await Objective.find(query)
      .populate('owner_id', 'first_name last_name email')
      .populate('team_id', 'name')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: objectives,
      company_context: req.companyContext
    });
  } catch (error) {
    console.error('Get objectives error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch objectives'
    });
  }
});
```

**Apply similar updates to**:
- `server/routes/goals.js`
- `server/routes/tasks.js`
- `server/routes/key-results.js` (if exists)

**Acceptance Criteria**:
- ✅ All resource queries filtered by company_id
- ✅ Backward compatible with business_id
- ✅ Company context returned in responses

---

#### **Afternoon (4 hours): Frontend Polish & Testing**

**Task 5.3**: Company Dropdown in Navigation
**File**: `client/components/navbar.html`
**Time**: 1 hour
**Priority**: P0

**Add company indicator to navbar**:
```html
<div class="navbar-company-indicator">
  <span class="company-badge" id="active-company-badge">
    <!-- Dynamically populated -->
  </span>
</div>

<script>
async function loadActiveCompany() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.current_company_id) {
      const response = await fetch(`/api/companies/${user.current_company_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        document.getElementById('active-company-badge').textContent = result.data.name;
      }
    }
  } catch (error) {
    console.error('Load active company error:', error);
  }
}

loadActiveCompany();
</script>
```

**Acceptance Criteria**:
- ✅ Active company name shown in navbar
- ✅ Updates after company switch
- ✅ Hidden for solo users (no company)

---

**Task 5.4**: Integration Testing
**File**: Manual E2E testing
**Time**: 2 hours
**Priority**: P0

**Test Scenarios**:

1. **Solo User Flow**:
   - ✅ Register new user
   - ✅ Skip company creation
   - ✅ Create objectives in Block 1 mode (business_id)
   - ✅ Data accessible

2. **Company Owner Flow**:
   - ✅ Register new user
   - ✅ Create company (CompanyA)
   - ✅ Create team in CompanyA
   - ✅ Create objectives with company_id
   - ✅ Bulk invite 5 people
   - ✅ Verify invitations sent

3. **Consultant Flow**:
   - ✅ Consultant invited to CompanyA (role: CONSULTANT)
   - ✅ Accept invitation → added to companies[]
   - ✅ Consultant invited to CompanyB (role: CONSULTANT)
   - ✅ Accept invitation → now in 2 companies
   - ✅ Switch between CompanyA and CompanyB
   - ✅ Verify data isolation (only see CompanyA data when in CompanyA)

4. **Employee Flow**:
   - ✅ Employee invited to CompanyA (role: EMPLOYEE)
   - ✅ Register via invitation token
   - ✅ Automatically added to CompanyA
   - ✅ See team objectives/goals
   - ✅ Can create tasks

**Acceptance Criteria**:
- ✅ All 4 flows work end-to-end
- ✅ No errors in browser console
- ✅ No cross-company data leakage
- ✅ Company switcher works for consultants

---

**Task 5.5**: Documentation & Handoff
**File**: `WEEK_7_CODE_REFERENCES.md`, `WEEK_7_COMPLETION_SUMMARY.md`
**Time**: 1 hour
**Priority**: P0

**Create Week 7 Code References**:
```markdown
# Week 7 Code References

## New Files Created (REVISED - Oct 26, 2025)

**Day 0-1: Goal UI**
- client/pages/goals-quarterly.html (120 lines)
- client/pages/goals-weekly.html (130 lines)
- client/pages/goal-detail.html (110 lines)
- client/pages/goal-assign.html (80 lines)
- client/pages/goal-create.html (100 lines)
- client/pages/goal-breakdown.html (90 lines)
- client/pages/scripts/goals-quarterly.js (150 lines)
- client/pages/scripts/goals-weekly.js (140 lines)

**Day 2-3: Company & Teams**
- server/models/Company.js (340 lines)
- server/routes/companies.js (280 lines)
- client/pages/company-setup.html (120 lines)
- client/pages/scripts/company-setup.js (90 lines)

**Day 6: Multi-Company Switcher**
- client/components/company-switcher.html (180 lines)
- client/components/scripts/company-switcher.js (100 lines)

**Removed from Week 7** (Moved to Beta):
- ~~server/models/BulkInvitation.js~~ → Beta
- ~~server/routes/bulk-invitations.js~~ → Beta
- ~~server/services/bulk-invitation-service.js~~ → Beta
- ~~client/pages/team-invite.html~~ → Beta
- ~~client/pages/scripts/team-invite.js~~ → Beta
- ~~client/pages/register-invite.html~~ → Beta (uses existing system)
- ~~client/pages/scripts/register-invite.js~~ → Beta (uses existing system)

## Modified Files (REVISED - Oct 26, 2025)
- server/models/Goal.js (added time_period, parent_goal_id, child_goal_ids)
- server/routes/goals.js (added POST /goals/:id/breakdown endpoint)
- server/models/User.js (added companies[], current_company_id)
- server/models/Team.js (added company_id)
- server/middleware/auth.js (added injectCompanyContext)
- server/routes/teams.js (updated with company context)
- server/routes/objectives.js (updated with company filter)
- server/routes/goals.js (updated with company filter)
- server/routes/tasks.js (updated with company filter)
- client/components/navbar.html (added company switcher)

## Total Lines of Code (REVISED - Oct 26, 2025)
- New: ~1,830 lines (reduced from 1,780)
- Modified: ~400 lines (reduced from 450)
- **Total: ~2,230 lines → ~1,830 lines** (18% reduction due to scope change)
```

**Create Week 7 Completion Summary** (detailed report of what was accomplished, blockers, next steps)

**Acceptance Criteria**:
- ✅ All new files documented with line counts
- ✅ All modified files documented
- ✅ Completion summary created
- ✅ Ready for Week 7.5 handoff

---

## 📊 WEEK 7 ACCEPTANCE CRITERIA (REVISED - Oct 26, 2025)

### **Functional Requirements**
- ✅ Goal Management UI: 4 user stories fully functional (MGR-025, MGR-026, EMP-013, EMP-014)
- ✅ Owner can create company and team in <2 minutes
- ✅ Consultant can switch between 3 companies seamlessly
- ✅ Solo user can skip company creation (Block 1 only mode works)
- ✅ All data properly isolated by company_id
- ⚠️ ~~Bulk invite 50 people completes in <5 seconds~~ → **MOVED TO BETA** (uses existing single invitation system)

### **Technical Requirements**
- ✅ Goal model has hierarchy fields (time_period, parent_goal_id, child_goal_ids)
- ✅ Goal breakdown endpoint creates 13 weekly goals (POST /api/goals/:id/breakdown)
- ✅ companies collection created and indexed
- ✅ users.companies[] array functional
- ✅ current_company_id tracking works
- ✅ Company context middleware operational
- ✅ Company switcher dropdown functional
- ⚠️ ~~Bulk invitation system processes 100 recipients~~ → **MOVED TO BETA**
- ⚠️ ~~Invitation token flow works end-to-end~~ → **USES EXISTING SYSTEM**

### **Testing & Quality** ✅ **NEW FOCUS**
- ✅ All 11 Goal API endpoints tested (95%+ coverage)
- ✅ Company & Team APIs validated
- ✅ 3 E2E user scenarios completed
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design verified (4 screen sizes)
- ✅ Database integrity verified (no orphaned records)
- ✅ Performance optimized (API < 500ms, DB queries use indexes)
- ✅ Code review complete (no console.log, ESLint warnings fixed)

### **Code Quality**
- ✅ All models match database_schema.md
- ✅ All routes have error handling
- ✅ All indexes created correctly
- ✅ Backward compatibility maintained
- ✅ Loading states, error messages, empty states implemented
- ✅ Basic accessibility requirements met (WCAG 2.1 Level AA)

### **Documentation**
- ✅ WEEK_7_CODE_REFERENCES.md created
- ✅ WEEK_7_COMPLETION_SUMMARY.md created
- ✅ All new files documented
- ✅ Migration notes for existing files
- ✅ Test results documented

---

## 🔗 DEPENDENCIES & BLOCKERS

### **Prerequisites** (Must be complete before Week 7)
- ✅ Week 6 Goal Management backend complete
- ✅ Database schema updated (Oct 24) with companies/company_id
- ✅ Feature flags configured (IAM_BLOCK, BULK_OPS)

### **External Dependencies**
- Email service (for invitation emails) - Can be stubbed for Week 7

### **Known Blockers**
- None identified

---

## 🚀 WEEK 7 SUCCESS METRICS (REVISED - Oct 26, 2025)

| Metric | Target | Tracking | Status |
|--------|--------|----------|--------|
| **Goal UI Completion** | 4 user stories functional | Day 0-1 | ⬜ Pending |
| **Company Creation Time** | <2 minutes | Day 2 | ⬜ Pending |
| **Company Switcher Latency** | <1 second | Day 6 | ⬜ Pending |
| **Data Isolation** | 100% (no leakage) | Days 4-5 | ⬜ Pending |
| **API Response Time** | <500ms (p90) | Day 4-5 | ⬜ Pending |
| **Test Coverage** | 95%+ (E2E manual) | Days 4-5 | ⬜ Pending |
| **Cross-Browser Compatibility** | 4 browsers | Day 5 | ⬜ Pending |
| **Lines of Code** | ~1,800 lines | ✅ Reduced from 2,200 | Estimated |
| **Critical Bugs** | 0 bugs | Days 4-6 | ⬜ Pending |

**Scope Reduction**: Bulk Invitations (~400 lines) and Invitation Acceptance flow removed → Moved to Beta

---

## 📋 HANDOFF TO WEEK 7.5 (REVISED - Oct 26, 2025)

**Completed**:
- ✅ Goal Management UI (8 pages, 4 user stories)
- ✅ Multi-company data model implemented
- ✅ Company/team CRUD operations
- ⚠️ ~~Bulk invitation system~~ → **MOVED TO BETA**
- ✅ Consultant company switcher
- ✅ Data isolation verified
- ✅ Comprehensive testing completed (Days 4-5)
- ✅ Code quality validated (performance + accessibility)

**Moved to Beta**:
- ⏳ Bulk Invitation System (company/team/CSV modes)
- ⏳ Enhanced Invitation Acceptance Flow (token security + multi-step)

**Next (Week 7.5 - 2.5 days)**:
- AI OKR Engine - LLM Integration
- Real GPT-4 powered OKR generation
- Prompt customization for consultants
- Template fallback system

**Handoff Files**:
1. [WEEK_7_COMPLETION_SUMMARY.md](./WEEK_7_COMPLETION_SUMMARY.md)
2. [WEEK_7_CODE_REFERENCES.md](./WEEK_7_CODE_REFERENCES.md)
3. [WEEK_7_TEST_RESULTS.md](./WEEK_7_TEST_RESULTS.md) - **NEW** (Days 4-5 testing results)
4. [WEEK_7_ISSUES.md](./WEEK_7_ISSUES.md) (if any issues found)

---

---

## 📊 ADDITIONAL ITEMS FROM AUDIT (Post-Week 7)

These items from the comprehensive audit are **NOT BLOCKERS** for Week 7 but should be addressed in subsequent weeks:

### **Medium Priority Items (Week 8-9)**

#### 1. **QuarterlyPlan Model Evaluation**
**Status**: ⚠️ DECISION NEEDED
**Priority**: P2 (MEDIUM)
**Effort**: 5-7 days (if decided to implement)

**Context**: Current Goal model uses flat structure (quarter + week fields). Week 6 plan originally specified hierarchical structure.

**Options**:
- **Keep Flat**: Current Goal model with quarter/week fields (simpler, working)
- **Go Hierarchical**: Create QuarterlyPlan model with Goal.quarterly_plan_id reference (more structured)

**Recommendation**: Defer decision to Week 8 after seeing how current Goal model performs in production use.

---

#### 2. **Comprehensive Test Suite**
**Status**: ❌ NOT STARTED
**Priority**: P2 (MEDIUM)
**Effort**: 1-2 weeks

**Missing Tests**:
- Unit tests for 11 models
- Unit tests for 13+ routes
- Integration tests for complex workflows
- E2E tests for 15 critical user stories

**Target Coverage**: 80%+ for models and routes

**Timeline**: Week 9-10 (after core features stable)

---

#### 3. **API Documentation**
**Status**: ❌ NOT STARTED
**Priority**: P2 (MEDIUM)
**Effort**: 3-5 days

**Requirements**:
- Swagger/OpenAPI 3.0 definitions for all endpoints (100+ endpoints)
- Auto-generated API documentation site
- Code examples for each endpoint
- Authentication documentation

**Timeline**: Week 10 (before external beta)

---

#### 4. **Migration Scripts**
**Status**: ❌ NOT STARTED
**Priority**: P2 (MEDIUM)
**Effort**: 2-3 days

**Required Migrations**:
1. **User Model Migration**: Add companies[] array to existing users
2. **Team Model Migration**: Add company_id to existing teams
3. **Invitation Model Migration**: Add company_id, recipient_type, bulk_invitation_id
4. **Business → Company Migration**: If Option A or B chosen for naming

**Timeline**: Week 7.5 (immediately after Week 7 if needed for production data)

---

#### 5. **Performance Optimization**
**Status**: ❌ NOT STARTED
**Priority**: P2 (MEDIUM)
**Effort**: 1 week

**Optimizations Needed**:
- Redis caching for frequently accessed data
- Database query optimization (add missing indexes)
- API response pagination improvements
- Frontend bundle optimization

**Timeline**: Week 11 (before production launch)

---

### **Low Priority Items (Post-MVP)**

#### 6. **Admin Dashboard**
**Status**: ❌ NOT STARTED
**Priority**: P3 (LOW)
**Effort**: 1-2 weeks

**Features**:
- System-wide analytics
- User management (super admin)
- Company management (super admin)
- Feature flag management
- System health monitoring

**Timeline**: Week 12 or Post-MVP

---

#### 7. **Advanced Search & Filtering**
**Status**: ❌ NOT STARTED
**Priority**: P3 (LOW)
**Effort**: 1 week

**Features**:
- Full-text search across objectives/goals/tasks
- Advanced filter UI with saved filters
- Bulk operations UI
- Export to CSV/Excel

**Timeline**: Post-MVP

---

## 🎯 COMPLETE TASK SUMMARY

### **Pre-Week 7 Blockers (Week 6.5)** - ⚠️ 2 of 3 COMPLETE

- [ ] **Blocker 1**: Complete Goal Management UI (8 files, 2 days) ❌ NOT STARTED
  - [ ] goals-api-client.js (200 lines, 3h)
  - [ ] quarterly-goals.html + .js (750 lines, 5h)
  - [ ] goal-details.html + .js (700 lines, 4h)
  - [ ] weekly-goals.html + .js (600 lines, 4h)
  - [ ] assign-goal-modal.html (200 lines, 2h)
  - [ ] CSS updates (150 lines, 2h)
  - [ ] E2E tests (4h)
  - **Status**: ⏳ INTEGRATED INTO WEEK 7 AS DAY 0-1

- [x] **Blocker 2**: Companies API Route ✅ COMPLETE (Oct 25, 2025)
  - [x] GET /api/companies
  - [x] GET /api/companies/:id
  - [x] GET /api/companies/:id/stats
  - [x] POST /api/companies
  - [x] PUT /api/companies/:id
  - [x] PUT /api/companies/:id/assessment-scores
  - [x] PUT /api/companies/:id/onboarding
  - [x] DELETE /api/companies/:id
  - **File**: server/routes/companies.js (591 lines)

- [x] **Blocker 3**: Business → Company Migration ✅ COMPLETE (Oct 25, 2025)
  - [x] M-001: Created Company.js (247 lines)
  - [x] M-002: Updated User model (multi-company support)
  - [x] M-003: Updated 9 resource models (company_id only)
  - [x] M-004: Created /api/companies route (8 endpoints)
  - [x] M-005: Updated auth.js signup (auto-creates Company)
  - [x] M-006: Updated 9 resource routes (sed batch)
  - [x] M-007: Updated frontend API calls (21 JS files)
  - [x] M-008: Updated frontend UI text (25 HTML files)
  - [x] M-009: Updated KARVIA_STRATEGY docs
  - [x] M-010: Updated planning docs
  - [x] M-011: Created migration script (365 lines)
  - **Total**: 69 files changed, ~6,900 lines
  - **Strategy**: Complete migration (NO backward compatibility)

**Total Pre-Week 7 Status**:
- ✅ Completed: 2 blockers (Blocker 2 & 3)
- ❌ Remaining: 1 blocker (Blocker 1 - Goal UI, 2 days)
- 📊 Progress: 66% complete

---

### **Week 7 Main Tasks** - P0 CRITICAL (30 tasks across 7 days)

**Day 0-1**: Goal Management UI (8 files) ❌ NOT STARTED
- [ ] W7-D0-001: Create goals-api-client.js (200 lines, 3h)
- [ ] W7-D0-002: Create quarterly-goals.html + .js (750 lines, 5h)
- [ ] W7-D0-003: Create goal-details.html + .js (700 lines, 4h)
- [ ] W7-D0-004: Create weekly-goals.html + .js (600 lines, 4h)
- [ ] W7-D0-005: Create assign-goal-modal.html (200 lines, 2h)
- [ ] W7-D0-006: Add CSS styling (150 lines, 2h)
- [ ] W7-D0-007: Write E2E tests for 4 user stories (4h)
- [ ] W7-D0-008: Integration testing and bug fixes (2h)

**Day 2**: Company Model & CRUD (4 tasks) ⏳ MOSTLY COMPLETE
- [x] W7-D2-001: Create Company model ✅ DONE
- [x] W7-D2-002: Update User model with companies[] array ✅ DONE
- [x] W7-D2-003: Migrate Team model (add company_id) ✅ DONE
- [x] W7-D2-004: Company CRUD routes + auth middleware ✅ DONE

**Day 3**: Team Management with Company Isolation (4 tasks)
- [ ] W7-D3-001: Update Team routes with company context
- [ ] W7-D3-002: Team members with company roles
- [ ] W7-D3-003: Company creation frontend (company-setup.html)
- [ ] W7-D3-004: Company setup JavaScript

**Day 4**: Bulk Invitation System (5 tasks)
- [ ] W7-D4-001: Create BulkInvitation model
- [ ] W7-D4-002: Update Invitation model
- [ ] W7-D4-003: Bulk invitation service
- [ ] W7-D4-004: Bulk invitation API routes
- [ ] W7-D4-005: Bulk invite UI

**Day 5**: Invitation Acceptance & User Association (5 tasks)
- [ ] W7-D5-001: Invitation token validation routes
- [ ] W7-D5-002: Registration via invitation flow
- [ ] W7-D5-003: User-company association on acceptance
- [ ] W7-D5-004: Register invite frontend
- [ ] W7-D5-005: Invitation acceptance JavaScript

**Day 6**: Multi-Company Context & Polish (4 tasks)
- [ ] W7-D6-001: Company switcher component
- [ ] W7-D6-002: Update objectives/goals/tasks routes with company filter
- [ ] W7-D6-003: Integration testing (4 flows)
- [ ] W7-D6-004: Documentation & handoff

**Total Week 7 Effort**: 7 days (56 hours)
- Day 0-1: Goal UI (16h)
- Day 2-6: IAM work (40h)

---

### **Post-Week 7 Tasks** - P2-P3 (7 items)
- [ ] **Item 1**: Evaluate QuarterlyPlan model need (5-7 days, Week 8)
- [ ] **Item 2**: Comprehensive test suite (1-2 weeks, Week 9-10)
- [ ] **Item 3**: API documentation (3-5 days, Week 10)
- [ ] **Item 4**: Migration scripts (2-3 days, Week 7.5)
- [ ] **Item 5**: Performance optimization (1 week, Week 11)
- [ ] **Item 6**: Admin dashboard (1-2 weeks, Week 12/Post-MVP)
- [ ] **Item 7**: Advanced search/filtering (1 week, Post-MVP)

**Total Post-Week 7 Effort**: 5-8 weeks

---

## 🚀 REVISED EXECUTION ORDER

### **✅ Phase 1: Migration Complete (Oct 25, 2025)**
1. ✅ **Blocker 2**: Companies API created (591 lines, 8 endpoints)
2. ✅ **Blocker 3**: Business → Company migration (69 files, ~6,900 lines)
   - ✅ Backend models updated
   - ✅ Backend routes updated
   - ✅ Frontend updated
   - ✅ Migration script created
   - ⏳ **PENDING**: Deploy migration script to production

### **⏳ Phase 2: Week 7 Execution (7 days)**

**Day 0-1** (16 hours): Goal Management UI ❌ NOT STARTED
- Complete 8 missing frontend files
- 4 user stories: MGR-025, MGR-026, EMP-013, EMP-014
- **BLOCKS**: Production release of Week 6 work

**Day 2** (8 hours): Company Frontend ⏳ PARTIALLY COMPLETE
- Company setup wizard (company-setup.html)
- Already have backend (Company model + API)

**Day 3-6** (32 hours): IAM Features ⏳ PENDING
- Day 3: Team management with company isolation
- Day 4: Bulk invitation system
- Day 5: Invitation acceptance flow
- Day 6: Multi-company switcher + testing

### **Phase 3: Immediate Post-Week 7 (2-3 days)**
- **Week 7.5** (Days 1-3): AI LLM Enhancement + Additional testing

### **Phase 4: Subsequent Weeks (3-4 weeks)**
- **Week 8**: Progress Rollup + QuarterlyPlan decision
- **Week 9-10**: Dashboards, UI, Permission Rules + Testing
- **Week 11**: Admin Panel, Performance optimization
- **Week 12**: Launch prep + API documentation

---

## 📊 CURRENT STATUS SUMMARY

**Migration Progress**: ✅ 66% Complete (2 of 3 blockers done)

**Completed** (Oct 25, 2025):
- ✅ Backend models (11 files) - company_id only
- ✅ Backend routes (10 files) - company_id queries
- ✅ Frontend (46 files) - UI text and API calls
- ✅ Migration script (365 lines)
- ✅ Companies API (8 endpoints)

**Remaining Before Week 7 Start**:
- ❌ Goal Management UI (8 files, 2 days) - **CRITICAL BLOCKER**
- ⏳ Deploy migration script to production
- ⏳ Users re-login with company_id tokens

**Recommended Next Steps**:
1. **IMMEDIATE**: Complete Goal UI (Day 0-1, 16 hours)
2. Deploy migration script to production
3. Test signup flow (auto-creates Company)
4. Begin Day 2 (Company frontend setup)

---

**Prepared By**: Technical Team + Audit Analysis
**Last Updated**: October 25, 2025
**Audit Report**: [WEEKS_1-6_COMPREHENSIVE_AUDIT.md](../../WEEKS_1-6_COMPREHENSIVE_AUDIT.md)
**Migration Documentation**: [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)
**Status**: ⚠️ **66% UNBLOCKED** - Goal UI remains (2 days)
**Next Review**: After Goal UI completion (Day 0-1)
**Estimated Week 7 Start**: Day 0-1 completion + migration deployment = ~3-4 days from now
