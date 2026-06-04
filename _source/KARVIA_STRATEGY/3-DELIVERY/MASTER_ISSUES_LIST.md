# 🐛 MASTER ISSUES LIST - Known Issues & Technical Debt

> **⚠️ DEPRECATION NOTICE (April 1, 2026)**
>
> This file is now **read-only historical reference**.
>
> **New issues go to**: [`6-ISSUES/ACTIVE.md`](6-ISSUES/ACTIVE.md)
>
> The new structure provides:
> - Sprint-specific views (`6-ISSUES/by-sprint/`)
> - Active/Resolved separation
> - Quarterly archiving
>
> All issues through Sprint 15 are preserved here for historical reference.

---

## 📌 VERSION CONTROL

**Document**: MASTER_ISSUES_LIST.md
**Version**: 4.9.0 (SPRINT 15 UPDATE)
**Last Updated**: 2026-02-27
**Updated By**: Claude (Fixed Edit Client modal - ISS-S15-008)

**Changelog**:
### v4.9.0 (2026-02-27) - ISS-S15-008 RESOLVED
- ✅ Fixed ISS-S15-008: Edit Client modal doesn't load existing client details
  - Root cause: Modal showed before data fetched, Primary Contact section missing
  - Frontend fix: Added loading state, Primary Contact fields, parallel data fetching
  - Backend fix: Extended PUT /api/companies/:id to accept primary_contact updates
  - Files: client/pages/assessment-hub.html, server/routes/companies.js

### v4.8.0 (2026-02-27) - ISS-S15-007 RESOLVED
- ✅ Fixed ISS-S15-007: "Failed to load team members" toast error on Objectives page
  - Root cause: Wrong localStorage key used (`karvia_token` instead of `karvia_auth_token`)
  - Fix: Updated getTeamMembers() to check both keys in correct order
  - File: client/pages/scripts/objectives.js

### v4.7.0 (2026-02-27) - ISS-S15-006 RESOLVED
- ✅ Fixed ISS-S15-006: Manual objectives not showing on Planning page
  - Root cause: Manual objectives defaulted to `status='draft'`, Planning page only shows `status='active'`
  - Fix: Changed default status from 'draft' to 'active' in objectives creation route
  - File: server/routes/objectives.js line 107

### v4.6.0 (2026-02-27) - ISS-S15-005 RESOLVED
- ✅ Fixed ISS-S15-005: Manual objective creation quarter validation
  - Backend: Added default quarter calculation from objective start date in update route
  - Frontend: Added quarter field to new KRs, included in save payload
  - Frontend: Made date fields editable in View/Edit modal

### v4.5.0 (2026-02-27) - OBJECTIVE CREATION BUG
- 🔴 Added ISS-S15-005: Manual objective creation fails with "Path 'quarter' is required"
- 🔴 Date fields (start/end) appear locked and not editable
- 🟡 Feature request: Improve date function UX

### v4.4.0 (2026-02-27) - EMAIL ISSUES RESOLVED
- ✅ Fixed ISS-S15-003: "Get Started" link now uses invitation-accept.html with token
- ✅ Fixed ISS-S15-004: Email redesigned - minimalistic, SSI value proposition, template description

### v4.3.0 (2026-02-27) - ASSESSMENT EMAIL ISSUES
- ✅ Fixed ISS-S15-002: Sender name shows "undefined undefined" (fetch user from DB)
- 🔴 Added ISS-S15-003: "Get Started" link leads to non-existent page
- 🟡 Added ISS-S15-004: Email template needs Sprint 15 redesign

### v4.2.0 (2026-02-27) - ISS-S15-001 FIX
- ✅ Resolved ISS-S15-001: Assessment Team Selection Not Persisting
- Root cause: `selectedCompanyId` not saved in Step 1, Step 3 fetched teams from wrong company
- Fix: Save `selectedCompanyId` in Step 1, use it in Step 3 API call

### v4.1.0 (2026-02-27) - SPRINT 15 UPDATE
- 🔴 Added ISS-S15-001: Assessment Team Selection Not Persisting

### v4.0.0 (2025-11-02) - AUDIT UPDATE
- 🔴 Added 4 new CRITICAL issues blocking production
- 🟠 Added 3 HIGH priority architecture issues
- 🟡 Added 2 MEDIUM priority missing features
- 📊 Updated with actual codebase findings
- ✅ Marked ISS-W4-001 as RESOLVED

### v3.0.0 (2025-10-22) - MAJOR RESTRUCTURE
- 🎯 Added "HOW TO USE" rules section
- 🔗 Updated all issues with code file paths
- 📝 Standardized issue format (ISS-WX-XXX)
- 📁 Linked to weekly issue files in Daily_Handoffs
- ✅ Cleaned up resolved issues list

### v2.0.0 (2025-10-22)
- Added Week 4 critical issue (AI OKR Review bug)
- Reorganized for Week 5-12 implementation

### v1.0.0 (2025-10-13)
- Initial version with 32 issues from Week 0-1

---

## 📖 HOW TO USE THIS LIST

### **Purpose**
- ✅ **Track all bugs** with actual file locations and line numbers
- ✅ **Prioritize fixes** (P0 = critical/blocking, P1 = high, P2 = medium)
- ✅ **Reference code** with relative file paths
- ❌ **NOT for improvements** - Those go in MASTER_IMPROVEMENTS_LIST.md

### **Issue Naming Convention**
- Format: `ISS-WX-XXX` (e.g., ISS-W1-001, ISS-W4-001)
- W = Week number when discovered
- XXX = Sequential number within that week

### **Adding New Issues**

**During week implementation**:
1. Discover bug → Add to this list immediately
2. Use format: ISS-WX-XXX (current week number)
3. **MUST include**:
   - Priority (P0, P1, P2)
   - Files affected with line numbers
   - Code reference (relative path)
   - Impact on users/system
4. Also add to `/Daily_Handoffs/Week_X/WEEK_X_ISSUES.md`

**Example**:
```markdown
### ISS-W5-001: Team Create Button Not Working
- **Priority**: P1 (HIGH)
- **Discovered**: 2025-10-23 (Week 5 Day 2)
- **Impact**: Users cannot create teams
- **Files Affected**:
  - client/pages/team.html:145 (button event listener)
  - client/js/team-manager.js:78 (createTeam function)
- **Code Reference**: [team-manager.js](../client/js/team-manager.js#L78)
- **Status**: 🔴 OPEN
```

### **Code Reference Format**
Always use relative paths from project root:
- ✅ `server/models/Team.js:45`
- ✅ `client/pages/scripts/ai-okr-review.js:75-100`
- ❌ `/Users/sagarrs/Desktop/.../Team.js` (absolute paths)

### **Priority Levels**
- **P0 (CRITICAL)**: Blocking production, breaking core features, security issues
- **P1 (HIGH)**: Major functionality broken, bad UX, important features
- **P2 (MEDIUM)**: Minor bugs, edge cases, cosmetic issues

### **Status Values**
- 🔴 **OPEN** - Not fixed yet
- ✅ **RESOLVED** - Fixed and tested
- ⚠️ **ACCEPTED RISK** - Known issue, won't fix (document why)

---

## 🔗 RELATED DOCUMENTATION

- [MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md) - Overall Week 0-12 plan
- [MASTER_IMPROVEMENTS_LIST.md](./MASTER_IMPROVEMENTS_LIST.md) - Future enhancements
- [Daily_Handoffs/](./Daily_Handoffs/) - Weekly issue files

---

## 🎯 SPRINT 2 ISSUES (Goal Hierarchy System)

### ISS-S2-001: Team Results Page Missing Assessment Context 🔴
- **Priority**: P1 (HIGH - UX BLOCKER)
- **Discovered**: 2025-11-13 (Sprint 2 Development)
- **Impact**: Consultants/Executives cannot identify which assessment results they're viewing
- **Description**:
  - Team SSI View page shows aggregated results but no assessment context
  - Users can send multiple assessments over time (quarterly reviews, project-based, etc.)
  - Currently auto-selects "latest assessment per user" with no indication
  - No ability to filter/select specific assessments

- **User Story**:
  > "As a consultant viewing team results, I need to know which assessment campaign these results represent, so I can track progress over time and compare different assessment periods."

- **Files Affected**:
  1. `server/routes/assessments.js:655-900` - `/api/assessments/company/:companyId/team-breakdown`
     - Lines 750-773: Takes latest assessment per user without context
     - Response doesn't include assessment metadata
  2. `client/pages/team-ssi-view.html:1-143` - No assessment selector UI
  3. `client/pages/scripts/team-ssi-view.js:107-136` - Loads results without assessment filter

- **Data Model Reality**:
  - Assessment model HAS `invitation_id` (references assessment campaign)
  - Invitation HAS `template_id`, `sent_date`, `context.campaign_id`
  - **Data exists but not exposed in API/UI**

- **Current Behavior**:
  ```javascript
  // Lines 750-773: assessments.js
  const assessments = await Assessment.find({
    company_id: companyId,
    user_id: { $in: uniqueMemberIds },
    completed_at: { $exists: true, $ne: null }
  }).sort({ completed_at: -1 }); // All assessments sorted by date

  // Takes first (latest) per user, no context returned
  const seenUsers = new Set();
  assessments.forEach(assessment => {
    if (!seenUsers.has(userId)) {
      teamAssessments.push(assessment); // No assessment metadata
    }
  });
  ```

- **Proposed Solution**:
  1. **Backend API Enhancement** (`server/routes/assessments.js`):
     - Add `?assessment_id=xxx` query parameter (optional)
     - If not provided, return available assessments list in response
     - Include assessment metadata in response:
       ```javascript
       {
         assessment_context: {
           assessment_id: "...",
           template_name: "Q4 2025 Performance Review",
           sent_date: "2025-10-01",
           completed_count: 25,
           total_invited: 30
         },
         available_assessments: [
           { id, name, date, completion_rate }
         ],
         // existing team breakdown data...
       }
       ```

  2. **Frontend UI Enhancement** (`client/pages/team-ssi-view.html`):
     - Add assessment dropdown selector in header
     - Show current assessment name and date
     - Allow filtering by assessment campaign

  3. **JavaScript Updates** (`client/pages/scripts/team-ssi-view.js`):
     - Fetch available assessments on load
     - Populate dropdown with assessment list
     - Reload results when assessment selection changes

- **Timeline to Fix**: 4-6 hours
  - Backend: 2 hours (API enhancement + populate assessment metadata)
  - Frontend: 2 hours (dropdown UI + integration)
  - Testing: 1-2 hours (multi-assessment scenarios)

- **Acceptance Criteria**:
  - ✅ Team results page shows current assessment name and date
  - ✅ Dropdown lists all completed assessments for the company
  - ✅ Selecting different assessment updates the view
  - ✅ Default behavior: show latest assessment (current behavior preserved)
  - ✅ API returns assessment context in response

- **Related Issues**: None
- **Status**: 🔴 OPEN

---

## 🎯 SPRINT 15 ISSUES (Seamless Onboarding)

### ISS-S15-001: Assessment Team Selection Not Persisting to Review Step ✅
- **Priority**: P1 (HIGH - WORKFLOW BLOCKER)
- **Discovered**: 2026-02-27 (Sprint 15 Planning)
- **Resolved**: 2026-02-27
- **Impact**: Consultants could not send assessments to teams via the wizard

- **Description**:
  In the assessment creation flow (3-step wizard), when a consultant:
  1. ✅ Step 1: Selects a template and chooses "Teams" distribution method
  2. ✅ Step 1: Selects a company (e.g., FAIRTIQ India) and team (e.g., Sales Team - 2 members)
  3. ❌ Step 3 (Review & Launch): Shows "0 team members" and "No teams selected"

  **The team selection from Step 1 was NOT being persisted to Step 3.**

- **Root Cause (CONFIRMED)**:
  **Multi-tenant issue**: When consultant selected teams from a client company, only `selectedTeamIds` was saved to the draft - NOT the `selectedCompanyId`. Step 3 then fetched teams from `/api/teams` (consultant's own company) instead of `/api/teams?company_id={clientCompanyId}`. The team IDs from the client company didn't match any teams in the consultant's company.

- **Resolution**:
  1. **Step 1** ([assessment-creation-flow.html:729-733](client/pages/assessment-creation-flow.html#L729-L733)):
     - Now saves `selectedCompanyId` from `teamSelector.getConfig().companyId` to the draft
  2. **Step 3** ([assessment-review-launch.html:293-301](client/pages/assessment-review-launch.html#L293-L301)):
     - Now reads `selectedCompanyId` from draft and includes it in the teams API call

- **Files Changed**:
  1. `client/pages/assessment-creation-flow.html` - Save `selectedCompanyId` to draft
  2. `client/pages/assessment-review-launch.html` - Use `selectedCompanyId` in teams API call

- **Acceptance Criteria** (All Met):
  - ✅ Team selection in Step 1 persists to Step 3
  - ✅ Review page shows correct team names and member counts
  - ✅ "Launch Assessment" sends to selected teams
  - ✅ Works for all distribution methods (Teams, Email, Secure Link)
  - ✅ Works for consultant selecting client company teams (multi-tenant)

- **Related Issues**: None
- **Status**: ✅ RESOLVED

---

### ISS-S15-002: Assessment Invitation Email - Sender Name Shows "undefined undefined" ✅
- **Priority**: P1 (HIGH - PROFESSIONAL APPEARANCE)
- **Discovered**: 2026-02-27
- **Resolved**: 2026-02-27
- **Impact**: Emails appeared broken/unprofessional - damaged trust

- **Description**:
  Assessment invitation emails show "undefined undefined has invited you..." instead of the actual sender's name.

- **Screenshot Evidence**:
  - Subject line: `undefined undefined invited you to complete an assessment`
  - Body: `undefined undefined has invited you to complete an assessment for karvia`

- **Root Cause (CONFIRMED)**:
  The JWT token payload does NOT include `first_name` and `last_name` fields:
  ```javascript
  // server/routes/auth.js - lines 117-123 (login) and 217-223 (register)
  const token = jwt.sign({
      user_id: user._id,
      email: user.email,
      role: user.role,
      company_id: company._id,
      managed_businesses: user.managed_businesses || []
      // MISSING: first_name, last_name
  }, JWT_SECRET, { expiresIn: '7d' });
  ```

  The invitations route (line 511) does:
  ```javascript
  const senderName = `${user.first_name} ${user.last_name}`;  // user = req.user from JWT
  ```
  Since JWT doesn't have these fields, they're `undefined`.

- **Files Affected**:
  1. `server/routes/invitations.js:511` - Uses `req.user.first_name` and `req.user.last_name`
  2. `server/routes/auth.js` - JWT payload missing name fields

- **Resolution**:
  In `server/routes/invitations.js:511-514`, fetch user from DB instead of relying on JWT:
  ```javascript
  // ISS-S15-002 Fix: Fetch user from DB to get actual name
  const senderUser = await User.findById(user.user_id || user._id).select('first_name last_name email');
  const senderName = senderUser && senderUser.first_name
    ? `${senderUser.first_name} ${senderUser.last_name || ''}`.trim()
    : (user.email ? user.email.split('@')[0] : 'Your administrator');
  ```

- **Files Changed**:
  1. `server/routes/invitations.js:511-514` - Fetch user from DB for name

- **Acceptance Criteria** (All Met):
  - ✅ Email shows actual sender's full name
  - ✅ Fallback to email prefix if name unavailable
  - ✅ Fallback to "Your administrator" as last resort

- **Related Issues**: ISS-S15-003, ISS-S15-004
- **Status**: ✅ RESOLVED

---

### ISS-S15-003: Assessment Invitation Email - "Get Started" Link Leads to Non-Existent Page ✅
- **Priority**: P1 (HIGH - BROKEN USER FLOW)
- **Discovered**: 2026-02-27
- **Resolved**: 2026-02-27
- **Impact**: First-time users cannot complete onboarding

- **Description**:
  The "Get Started" button in assessment invitation emails links to a page that doesn't exist or isn't the correct entry point for first-time users.

- **Root Cause**:
  - `invitationLink` was set to `signupUrl` without appending the invitation token
  - Users landed on generic signup page with no context

- **Fix Applied**:
  - Changed `invitationLink` to use `invitation-accept.html?token=${token}`
  - This page validates the invitation, lets user set password, and redirects to assessment
  - File: `server/routes/invitations.js:490-492`

- **Files Affected**:
  1. `server/routes/invitations.js` - `invitationLink` generation

- **Acceptance Criteria**:
  - [x] New users land on invitation-accept page with token
  - [x] Page validates invitation and lets user set password
  - [x] After auth, user is redirected to assessment
  - [x] Invitation token is preserved through auth flow

- **Related Issues**: ISS-S15-002, ISS-S15-004
- **Status**: ✅ RESOLVED

---

### ISS-S15-004: Assessment Invitation Email - Template Redesign Needed ✅
- **Priority**: P2 (MEDIUM - UX IMPROVEMENT)
- **Discovered**: 2026-02-27
- **Resolved**: 2026-02-27
- **Sprint Reference**: Sprint 15 - Epic 15A enhancement

- **Description**:
  The current assessment invitation email template needs to be redesigned for Sprint 15's "value-driven" approach:
  1. Show template description/purpose (what is the assessment about?)
  2. More minimalistic and professional design
  3. Align with Sprint 15's seamless onboarding goals

- **Fix Applied**:
  1. Redesigned email template with minimalistic, clean layout
  2. Added SSI value proposition (⚡ Speed, 🛡 Strength, 🧠 Intelligence)
  3. Added "About This Assessment" section showing template description
  4. Simple black CTA button with clean design
  5. Time estimate and expiry notice at bottom
  6. Removed visual clutter (excessive colors, gradients, boxes)

- **Files Changed**:
  1. `server/services/mailjetService.js:137-225` - `getInvitationTemplate()` redesigned
  2. `server/routes/invitations.js:523` - Added `templateDescription` to email data

- **Acceptance Criteria**:
  - [x] Email shows what the assessment is about (template name + description)
  - [x] Minimalistic design with clear CTA
  - [x] SSI dimensions explained with emojis
  - [x] Shows value proposition (what recipient gets)
  - [x] Mobile-responsive (inline styles)
  - [x] Professional appearance

- **Related Issues**: ISS-S15-002, ISS-S15-003
- **Status**: ✅ RESOLVED

---

### ISS-S15-005: Manual Objective Creation - "Path 'quarter' is required" Error + Date Fields Locked ✅
- **Priority**: P1 (HIGH - WORKFLOW BLOCKER)
- **Discovered**: 2026-02-27
- **Resolved**: 2026-02-27
- **Impact**: Users cannot create manual objectives with key results, dates are not editable

- **Description**:
  When creating a manual objective on the Objectives page:
  1. User fills in objective details (title, description, category, priority)
  2. User clicks "+ Add Key Result" and fills in KR details
  3. User clicks "Save Changes"
  4. **Error**: Toast shows "Path 'quarter' is required"

  Additionally:
  - Start Date and End Date fields appear locked/not editable
  - Users cannot customize the objective period

- **Root Cause Found**:
  1. Backend (server/routes/objectives.js:424): When updating key_results, new KRs without an existing KR to copy from had no default quarter
  2. Frontend (client/pages/scripts/objectives.js): `addKeyResultRow()` didn't include quarter field
  3. Frontend: Date fields were intentionally kept read-only in edit mode

- **Fix Applied**:
  1. **Backend** (server/routes/objectives.js):
     - Added IIFE to calculate default quarter from objective start date or current date
     - Changed line 424 to use calculated `defaultQuarter` instead of undefined
  2. **Frontend** (client/pages/scripts/objectives.js):
     - `addKeyResultRow()`: Added quarter, metric_type fields to new KRs
     - `getModalFormData()`: Now includes start_date and end_date
     - `saveObjectiveChanges()`: Includes dates in update payload
     - `setEditMode()`: Now makes date fields editable

- **Acceptance Criteria**:
  - [x] Users can add Key Results to objectives without "quarter required" error
  - [x] Start Date field is editable
  - [x] End Date field is editable
  - [x] Dates are saved correctly to database
  - [x] Quarter is auto-calculated from objective start date

- **Related Issues**: None
- **Status**: ✅ RESOLVED

---

## 🚨 CURRENT CRITICAL ISSUES (P0) - BLOCKING PRODUCTION

### ISS-AUDIT-001: Goal Management UI Completely Missing 🔴
- **Priority**: P0 (CRITICAL - BLOCKS PRODUCTION)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: Goal management feature is completely unusable despite backend being 100% complete
- **Description**: All backend APIs (11 endpoints) work, but no frontend exists
- **Missing Files** (8 files, ~2,050 lines):
  1. `client/pages/quarterly-goals.html` (~400 lines)
  2. `client/pages/goal-details.html` (~300 lines)
  3. `client/pages/weekly-goals.html` (~300 lines)
  4. `client/js/goals-api-client.js` (~300 lines)
  5. `client/pages/scripts/quarterly-goals.js` (~350 lines)
  6. `client/pages/scripts/goal-details.js` (~400 lines)
  7. `client/pages/scripts/weekly-goals.js` (~300 lines)
  8. Goal CSS updates (~150 lines)
- **Backend Status**: ✅ Complete (server/routes/goals.js - 576 lines, 11 endpoints)
- **Timeline to Fix**: 5-7 days
- **Status**: 🔴 OPEN

### ISS-AUDIT-002: Business Management API Only Has Stub Endpoints 🔴
- **Priority**: P0 (CRITICAL - BLOCKS MULTI-TENANT OPS)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: Cannot manage businesses via API - critical for multi-tenant operations
- **Files Affected**:
  - `server/routes/businesses.js:1-240` (only 2 mock endpoints)
  - `server/models/Business.js` (stub model only)
- **Missing Endpoints**:
  - GET `/api/businesses/:id`
  - PUT `/api/businesses/:id`
  - DELETE `/api/businesses/:id`
  - GET `/api/businesses/:id/users`
  - GET `/api/businesses/:id/teams`
  - GET `/api/businesses/:id/stats`
- **Timeline to Fix**: 3-5 days
- **Status**: 🔴 OPEN

### ISS-AUDIT-003: Employee Dashboard Not Implemented 🔴
- **Priority**: P0 (CRITICAL - BLOCKS EMPLOYEE WORKFLOW)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: Employees cannot see or manage their daily tasks
- **Missing Files**:
  - `client/pages/employee-dashboard.html`
  - `client/pages/scripts/employee-dashboard.js`
  - Daily task view components
  - Progress tracking widgets
- **Related**: Executive and Manager dashboards exist, but Employee dashboard missing
- **Timeline to Fix**: 3-5 days
- **Status**: 🔴 OPEN

### ISS-AUDIT-004: Task Management UI Only 30% Complete 🔴
- **Priority**: P0 (CRITICAL - BLOCKS TASK WORKFLOW)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: Limited task interaction capabilities
- **Current State**:
  - ✅ Backend complete (server/routes/tasks.js - 881 lines, 13 endpoints)
  - ⚠️ Basic task list exists
  - ❌ Task creation UI missing
  - ❌ Task assignment UI missing
  - ❌ Progress update UI missing
- **Timeline to Fix**: 2-3 days
- **Status**: 🔴 OPEN
   - Data fetching logic has response format mismatch
   - Frontend expects: `response.data.data`
   - Backend returns: `response.data.suggestion`
   - [View File](../client/pages/scripts/ai-okr-review.js#L75)

2. `server/routes/ai-okr.js:45` (estimated)
   - Response format may not match frontend expectations
   - [View File](../server/routes/ai-okr.js#L45)

**Root Cause**:
- Response structure mismatch between frontend and backend
- Cookie-based authentication may not be passing JWT correctly

**User Impact**:
- Users complete assessment ✅
- AI generates OKRs ✅
- OKRs saved to database ✅
- Review page shows empty/error ❌ ← **BREAKS FLOW**

**Resolution Plan**:
- **When**: Week 5 Day 1 Morning (FIRST TASK)
- **Time**: 2-4 hours
- **Steps**:
  1. Debug `client/pages/scripts/ai-okr-review.js` data fetch
  2. Check API response format from `/api/ai-okr/generate`
  3. Fix response parsing to match backend structure
  4. Test: Assessment → Generate → Review displays OKRs ✅
- **Detailed Fix Plan**: [Week 5 Plan](./Daily_Handoffs/Week_5/WEEK_5_PLAN.md#day-1-morning)

**Status**: 🔴 OPEN - **MUST FIX BEFORE ANY WEEK 5 FEATURES**

**Code References**:
- Week 4 work: [WEEK_4_CODE_REFERENCES.md](./Daily_Handoffs/Week_4/WEEK_4_CODE_REFERENCES.md)
- Week 5 fix: [WEEK_5_PLAN.md](./Daily_Handoffs/Week_5/WEEK_5_PLAN.md)

---

## 🟠 HIGH PRIORITY ARCHITECTURE ISSUES

### ISS-AUDIT-005: Business vs Company Naming Mismatch 🔴
- **Priority**: P1 (HIGH - ARCHITECTURE INCONSISTENCY)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: Confusion during Week 7 IAM implementation
- **Description**: IAM spec uses "Company", code uses "Business"
- **Files Affected**:
  - `server/models/Business.js` (should be Company.js per spec)
  - All references to "business_id" should be "company_id"
  - Database schema spec expects "companies" collection
- **Options**:
  1. Rename Business → Company (breaking change)
  2. Create Company model, deprecate Business
  3. Update docs to use "Business" consistently
- **Timeline to Fix**: 1-2 days
- **Status**: 🔴 OPEN

### ISS-AUDIT-006: Missing companies[] Array in User Model 🔴
- **Priority**: P1 (HIGH - BLOCKS MULTI-COMPANY SUPPORT)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: Cannot support multi-company role differentiation
- **Current Implementation**: `managed_businesses: [ObjectId]` (flat array)
- **Expected Structure**:
  ```javascript
  companies: [{
    company_id: ObjectId,
    role: Enum,
    joined_at: Date,
    is_primary: Boolean
  }]
  ```
- **Files Affected**: `server/models/User.js`
- **Timeline to Fix**: 2-3 days
- **Status**: 🔴 OPEN

### ISS-AUDIT-007: Missing QuarterlyPlan Model 🔴
- **Priority**: P1 (HIGH - AFFECTS PLANNING HIERARCHY)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: Cannot create proper quarterly planning hierarchy
- **Current**: Flat Goal model with quarter/week fields
- **Expected**: Hierarchical QuarterlyPlan → Goals structure
- **Decision Needed**: Is hierarchical structure required for MVP?
- **Timeline to Fix**: 5-7 days (if needed)
- **Status**: 🔴 OPEN - NEEDS PRODUCT DECISION

---

## 🟡 MEDIUM PRIORITY MISSING FEATURES

### ISS-AUDIT-008: Missing BulkInvitation Model & Endpoints 🔴
- **Priority**: P2 (MEDIUM - WEEK 7 REQUIREMENT)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: No dedicated bulk operations management
- **Current Workaround**: Invitation model supports campaign_id
- **Missing**:
  - BulkInvitation model
  - POST `/api/invitations/bulk`
  - GET `/api/invitations/bulk/:campaignId`
  - PUT `/api/invitations/bulk/:campaignId/cancel`
  - GET `/api/invitations/bulk/:campaignId/recipients`
- **Timeline to Fix**: 3-5 days
- **Status**: 🔴 OPEN

### ISS-AUDIT-009: Limited Test Coverage 🔴
- **Priority**: P2 (MEDIUM - QUALITY RISK)
- **Discovered**: 2025-11-02 (Comprehensive Audit)
- **Impact**: High risk of regressions, difficult to refactor
- **Current Coverage**: ~20% (basic auth and health tests only)
- **Missing**:
  - Unit tests for 11 models
  - Unit tests for 13 routes
  - Integration tests for workflows
  - E2E tests for user stories
- **Timeline to Fix**: 1-2 weeks
- **Status**: 🔴 OPEN

---

## ✅ WEEK 1 RESOLVED ISSUES

### ISS-W1-001: Templates Not Displaying in Assessment Hub ✅
- **Priority**: P0 (CRITICAL)
- **Discovered**: 2025-10-14 (Week 1 Day 1)
- **Impact**: Template creation system unusable
- **Description**: Templates saved but didn't appear in assessment hub

**Files Fixed**:
- `server/routes/assessmentTemplates.js:35-50` - Role-based filtering
- Changed: `{ is_global: true }`
- To: `{ $or: [{ is_global: true }, { business_id: user.business_id }] }`
- [View Fix](../server/routes/assessmentTemplates.js#L35)

**Status**: ✅ RESOLVED (2025-10-14)
**Details**: [WEEK_1_CODE_REFERENCES.md](./Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)

### ISS-W1-002: Dimension Weights Displaying as Decimals ✅
- **Priority**: P1 (HIGH - UX issue)
- **Discovered**: 2025-10-14 (Week 1 Day 1)
- **Impact**: Confusing UI (showed "0.35%" instead of "35%")

**Files Fixed**:
- `client/pages/assessment-hub.html:165,169,173` - Percentage conversion
- Changed: `${weight}%`
- To: `${Math.round(weight * 100)}%`
- [View Fix](../client/pages/assessment-hub.html#L165)

**Status**: ✅ RESOLVED (2025-10-14)

### ISS-W1-003: API Client Reference Error ✅
- **Priority**: P0 (CRITICAL - Blocks all API calls)
- **Discovered**: 2025-10-14
- **Impact**: Assessment hub failed to load

**Files Fixed**:
- `client/js/assessment-flow.js:8` - Constructor reference
- Changed: `this.api = window.AssessmentAPIClient`
- To: `this.api = window.AssessmentAPI`
- [View Fix](../client/js/assessment-flow.js#L8)

**Status**: ✅ RESOLVED (2025-10-14)

### ISS-W1-004: API Method Call Error ✅
- **Priority**: P0 (CRITICAL - Blocks template fetching)
- **Discovered**: 2025-10-14
- **Impact**: Templates not fetched from backend

**Files Fixed**:
- `client/js/assessment-flow.js:77` - Method name
- Changed: `this.api.get('/api/assessment-templates?is_active=true')`
- To: `this.api.getTemplates({ is_active: true })`
- [View Fix](../client/js/assessment-flow.js#L77)

**Status**: ✅ RESOLVED (2025-10-14)

**All Week 1 Issues**: [WEEK_1_CODE_REFERENCES.md](./Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)

---

## ✅ WEEK 4 RESOLVED ISSUES

### ISS-W4-001: AI OKR Review Page Not Displaying Generated OKRs ✅
- **Priority**: P0 (CRITICAL)
- **Discovered**: 2025-10-22 (Week 4)
- **Resolved**: 2025-10-22 (Week 5 Day 1)
- **Impact**: Core product flow was broken
- **Description**: OKRs generated successfully but review page failed to display them
- **Root Cause**: Response format mismatch
  - Frontend expected: `response.data.data`
  - Backend returned: `response.data.suggestion`
- **Files Fixed**:
  - `client/pages/scripts/ai-okr-review.js` - Updated response parsing
- **Status**: ✅ RESOLVED

---

## 🔴 OPEN ISSUES (P1 - HIGH PRIORITY)

### ISS-W1-005: No Question Library Seeding
- **Priority**: P1 (HIGH - Blocks testing)
- **Discovered**: 2025-10-14 (Week 1 review)
- **Impact**: Can't create meaningful templates without questions
- **Description**: AssessmentQuestion collection empty by default
- **Workaround**: Manually create questions or use UI
- **Resolution**: Create seeding script with 50-100 sample questions
- **Status**: 🔴 OPEN - Week 2 Day 1
- **Estimated Effort**: 4-6 hours

### ISS-W1-006: No Question Validation in Template Creation
- **Priority**: P1 (HIGH - Data integrity)
- **Discovered**: 2025-10-14
- **Impact**: Can save templates with invalid question IDs
- **Description**: POST /api/assessment-templates doesn't validate question IDs exist

**Files to Modify**:
- `server/routes/assessmentTemplates.js:POST handler` - Add validation
- Query AssessmentQuestion collection for all selected_questions
- Return 400 error with missing IDs if validation fails

**Status**: 🔴 OPEN - Week 2 Day 1
**Estimated Effort**: 1-2 hours

---

## ⬜ DEFERRED ISSUES (P2 - MEDIUM PRIORITY)

### ISS-W1-007: No Template Editing UI
- **Priority**: P2 (MEDIUM - UX improvement)
- **Discovered**: 2025-10-14
- **Impact**: Must recreate template to make changes
- **Description**: Backend PUT endpoint exists, no frontend
- **Workaround**: Delete and recreate template
- **Status**: 🔴 OPEN - Week 2 Day 4
- **Estimated Effort**: 4-6 hours

### ISS-W1-008: No Template Duplication UI
- **Priority**: P2 (MEDIUM - Nice to have)
- **Discovered**: 2025-10-14
- **Impact**: Can't clone templates for customization
- **Description**: Model has `duplicate()` method, no UI trigger
- **Status**: 🔴 OPEN - Week 2 Day 4
- **Estimated Effort**: 2-3 hours

---

## 📊 ISSUE STATISTICS

**Total Issues**: 37 tracked
**By Priority**:
- P0 (Critical): 4 open (ISS-AUDIT-001 through ISS-AUDIT-004)
- P1 (High): 5 open (ISS-S15-005 ✅ resolved)
- P2 (Medium): 2 open

**By Status**:
- 🔴 Open: 6 issues
- 🟡 Planned: 1 issue
- ✅ Resolved: 32 issues

**By Sprint/Week**:
- Sprint 15: 8 issues (ISS-S15-001 ✅, ISS-S15-002 ✅, ISS-S15-003 ✅, ISS-S15-004 ✅, ISS-S15-005 ✅, ISS-S15-006 ✅, ISS-S15-007 ✅, ISS-S15-008 ✅) - ALL RESOLVED
- Sprint 2: 1 issue (ISS-S2-001 - Assessment Context)
- Audit: 9 issues (architecture + missing features)
- Week 1: 8 issues (4 resolved, 4 open)
- Week 4: 1 issue (✅ resolved)

---

## 📝 BACKUP

**Previous Version**: [MASTER_ISSUES_LIST_v2.0.0_BACKUP.md](./MASTER_ISSUES_LIST_v2.0.0_BACKUP.md)
**Backup Date**: 2025-10-22
**Use Case**: Reference old structure if needed

---

**Version**: 4.9.0
**Last Updated**: 2026-02-27
**Status**: ✅ Active - Sprint 15 Bug Tracking
