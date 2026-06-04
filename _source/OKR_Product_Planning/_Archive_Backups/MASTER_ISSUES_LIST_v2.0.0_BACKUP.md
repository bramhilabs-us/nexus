## 📌 VERSION CONTROL

**Document**: MASTER_ISSUES_LIST.md
**Version**: 2.0.0
**Last Updated**: 2025-10-22 10:30:00
**Updated By**: Claude (Session: Week 5-12 Planning & Reorganization)

**Changelog**:
### v2.0.0 (2025-10-22)
- Added semantic versioning system
- Added Week 4 critical issue (AI OKR Review display bug)
- Reorganized for Week 5-12 implementation phase

### v1.1.0 (2025-10-14)
- Added Week 1 issues (ISS-W1-001 through ISS-W1-008)

### v1.0.0 (2025-10-13)
- Initial version with 32 issues from Week 0-1

---

# 🐛 MASTER ISSUES LIST - Known Issues & Technical Debt

**Status**: 🔴 Active Tracking
**Last Updated**: 2025-10-22 10:30:00
**Total Issues**: 33 items (1 new from Week 4)
**Priority Distribution**: P0: 4 | P1: 18 | P2: 11

---

## 🔗 RELATED LISTS

- **[Master Dev List](./MASTER_DEV_LIST.md)** - Active Nov 30 development (40 tasks)
- **[Master Improvements List](./MASTER_IMPROVEMENTS_LIST.md)** - Future enhancements (67 items)

**Sync Status**: ✅ Lists synchronized at 2025-10-13 18:28:15

---

## 🚨 CRITICAL BLOCKERS (P0)

### ISS-001: Documentation vs Reality Mismatch
- **Priority**: P0 (CRITICAL)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: Stakeholder expectations misaligned
- **Description**: Docs claim "100% Complete, Production Ready" but audit shows 45-50% completion
- **Evidence**:
  - PRODUCTION_READY.md says "✅ 100% COMPLETE"
  - Actual status: 4 models missing, 2 API routes are placeholders
  - Week 0 prerequisites not started
- **Resolution**:
  - ✅ Created IMPLEMENTATION_STATUS_REPORT.md (accurate status)
  - ✅ Updated MASTER_DEV_LIST with real progress
  - ✅ Updated 01_MVP/README.md with current state
- **Status**: ✅ RESOLVED (2025-10-13)
- **Source**: Implementation Status Report

### ISS-002: Hard-Coded Secrets in Codebase
- **Priority**: P0 (SECURITY)
- **Discovered**: Week 0 planning
- **Impact**: Security risk, blocks production deployment
- **Description**: JWT secrets, API keys hard-coded in files
- **Files Affected**: Multiple (need scan)
- **Resolution Plan**:
  - [ ] Scan codebase for hard-coded secrets (grep JWT_SECRET, API_KEY, etc.)
  - [ ] Move all to environment variables
  - [ ] Create scripts/generate-secrets.sh (generates random secrets)
  - [ ] Create .env.example template
  - [ ] Test with invalid config (should fail fast)
- **Owner**: Engineering Lead
- **Target**: Week 0, Day 5
- **Status**: 🔴 OPEN - Blocks production
- **Source**: MASTER_DEV_LIST_FINAL.md, nov30_mvp_review.md

### ISS-003: Goal Model Missing (BLOCKING Week 4+)
- **Priority**: P0 (BLOCKING)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: Week 4-7 deliverables blocked
- **Description**: server/models/Goal.js does not exist
- **Evidence**: File not found in server/models/
- **Resolution**: DEV-001 (Create Goal Model) - Week 0, Day 1
- **Status**: ✅ **RESOLVED** (2025-10-14, Week 0 complete)
- **File Created**: server/models/Goal.js (541 lines)

### ISS-004: Task Model Missing (BLOCKING Week 5+)
- **Priority**: P0 (BLOCKING)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: Week 5-8 deliverables blocked
- **Description**: server/models/Task.js does not exist
- **Evidence**: File not found in server/models/
- **Resolution**: DEV-002 (Create Task Model) - Week 0, Day 1
- **Status**: ✅ **RESOLVED** (2025-10-14, Week 0 complete)
- **File Created**: server/models/Task.js (675 lines)

### ISS-005: Placeholder API Routes (Goals & Tasks)
- **Priority**: P0 (BLOCKING)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: API integration impossible, frontend blocked
- **Description**: routes/goals.js and routes/tasks.js are 11-line placeholders
- **Resolution**: DEV-006 (Goals API) + DEV-007 (Tasks API) - Week 0
- **Status**: ✅ **RESOLVED** (2025-10-14, Week 0 complete)
- **Files Created**:
  - server/routes/goals.js (575 lines, 13 routes)
  - server/routes/tasks.js (880 lines, 23 routes)

---

## 🔥 HIGH PRIORITY (P1)

### ISS-006: Frontend Architecture Mismatch
- **Priority**: P1 (HIGH)
- **Discovered**: Architecture review
- **Impact**: Timeline underestimated, frontend not scalable
- **Description**: Docs say "React app", reality is static HTML prototypes
- **Evidence**:
  - README.md: "React.js frontend application"
  - Reality: client/pages/*.html with vanilla JS
  - No package.json in client/, no build system
- **Resolution**:
  - ✅ Documented in IMPLEMENTATION_STATUS_REPORT.md
  - Decision: Keep HTML for MVP, React in Beta (IMP-013)
- **Status**: ⚠️ ACCEPTED RISK - Deferred to Beta
- **Source**: Architecture_High_Level.md:18

### ISS-007: Shared-Models Package Doesn't Exist
- **Priority**: P1 (HIGH)
- **Discovered**: Architecture review
- **Impact**: Engines can't be deployed independently
- **Description**: packages/shared-models/ directory doesn't exist, all engines use `../../server/models`
- **Evidence**: grep -r "require('../../server/models" engines/ returns many matches
- **Resolution**: IMP-001 (Shared-Models Migration) - Deferred to Beta
- **Status**: ⚠️ ACCEPTED RISK - Deferred to Beta
- **Source**: Architecture_High_Level.md:14, nov30_mvp_review.md:4

### ISS-008: Feature Flags System Missing
- **Priority**: P1 (HIGH)
- **Discovered**: Architecture review
- **Impact**: Can't run in standalone mode, hard dependencies
- **Description**: server/services/feature-flags.js doesn't exist
- **Current State**: Hard dependencies on OpenAI, Redis, iBrain
- **Resolution**: DEV-009 (Create Feature Flags Service) - Week 0, Day 5
- **Status**: 🔴 OPEN - Week 0 task
- **Source**: Architecture_High_Level.md:15, nov30_mvp_review.md:16

### ISS-009: Redis Hard Dependency
- **Priority**: P1 (HIGH)
- **Discovered**: Architecture review
- **Impact**: Can't run without Redis (blocks standalone mode)
- **Description**: Engines crash without Redis, no in-memory fallback
- **Files Affected**: Engines (Observer, Tracking) use Redis directly
- **Resolution**:
  - DEV-009 creates feature flag FEATURE_REDIS_ENABLED
  - Add in-memory cache fallback in cache-service.js
- **Status**: 🔴 OPEN - Week 0 task
- **Source**: nov30_mvp_review.md:16

---

## 🆕 WEEK 4 ISSUES (NEW - Oct 22)

### ISS-W4-001: AI OKR Review Page Not Displaying Generated OKRs (CRITICAL)
- **Priority**: P0 (CRITICAL - BLOCKING Week 5)
- **Discovered**: 2025-10-22 (Week 4 testing)
- **Impact**: AI-generated OKRs are created but not visible to users
- **Description**: After assessment completion and OKR generation, the AI OKR Review page (`client/pages/ai-okr-review.html`) fails to display generated objectives
- **Root Cause**: Data fetching logic in `client/pages/scripts/ai-okr-review.js` has response format mismatch
  - Frontend expects: `data.data` structure
  - Backend returns: `data.suggestion` structure
  - Additionally: Cookie-based authentication may not be passing JWT correctly
- **Evidence**:
  - OKRs successfully saved to database (verified via MongoDB)
  - Page loads but shows empty state or error
  - Browser console shows data fetch errors
- **User Impact**: Users complete assessment but cannot see their AI-generated OKRs, breaking core product flow
- **Resolution Plan**:
  - [ ] Debug `client/pages/scripts/ai-okr-review.js` data fetching (lines 50-100 estimated)
  - [ ] Verify API response format from `/api/ai-okr/generate` or `/api/objectives`
  - [ ] Fix response parsing to match actual backend format
  - [ ] Test authentication header vs cookie-based auth
  - [ ] Clear browser cache and test end-to-end flow
- **Status**: 🔴 OPEN - Week 5, Day 1 (HIGHEST PRIORITY)
- **Estimated Effort**: 2-4 hours
- **Blocks**: Objectives screen implementation (Week 5, Day 4)
- **Owner**: Frontend + Backend Team
- **Files to Review**:
  - `client/pages/ai-okr-review.html`
  - `client/pages/scripts/ai-okr-review.js`
  - `server/routes/ai-okr.js`
  - `server/routes/objectives.js`
- **Source**: Week 4 testing session, WEEK_5_DETAILED_PLAN.md

---

## 🆕 WEEK 1 ISSUES (NEW - Oct 13-14)

### ISS-W1-001: Templates Not Displaying in Assessment Hub (CRITICAL)
- **Priority**: P0 (CRITICAL)
- **Discovered**: 2025-10-14 (Week 1, Day 1)
- **Impact**: Template creation system unusable
- **Description**: Templates saved successfully but don't appear in assessment hub
- **Root Cause**: Role-based filtering prevented MANAGERS from seeing business-specific templates
- **Evidence**:
  - Template exists in MongoDB with `is_global: false`, `business_id: 68ee9892511e4510a260ad1e`
  - User role: MANAGER with matching `business_id`
  - Query was: `{ is_active: true, is_global: true }` (excluded business templates)
- **Resolution**: Fixed role-based access control in assessmentTemplates.js
  - Changed MANAGER permissions from "global only" to "global OR own business"
  - Updated query to: `{ $or: [{ is_global: true }, { business_id: user.business_id }] }`
  - Applied fix to 4 endpoints (GET list, GET by ID, GET questions, business_id filter)
- **Status**: ✅ **RESOLVED** (2025-10-14)
- **Files Fixed**:
  - server/routes/assessmentTemplates.js (lines 35-50, 117-140, 173-187, 52-78)
- **Source**: WEEK_1_SUMMARY.md, debugging session

### ISS-W1-002: Dimension Weights Displaying as Decimals
- **Priority**: P1 (HIGH - UX issue)
- **Discovered**: 2025-10-14 (Week 1, Day 1)
- **Impact**: Confusing UI (shows "0.35%" instead of "35%")
- **Description**: Template cards show dimension weights as decimals, not percentages
- **Root Cause**: Database stores as decimal (0.35), frontend doesn't convert to percentage
- **Resolution**: Convert decimal to percentage in template literals
  - Changed: `${template.dimensions?.speed?.weight || 0}%`
  - To: `${Math.round((template.dimensions?.speed?.weight || 0) * 100)}%`
- **Status**: ✅ **RESOLVED** (2025-10-14)
- **Files Fixed**:
  - client/pages/assessment-hub.html (lines 165, 169, 173)
- **Technical Debt**: Should create utility function for percentage conversion (used in 3+ places)

### ISS-W1-003: API Client Reference Error
- **Priority**: P0 (CRITICAL - Blocks all API calls)
- **Discovered**: 2025-10-14 (Week 1, Day 1)
- **Impact**: Assessment hub fails to load, JavaScript error
- **Description**: "Cannot read properties of undefined (reading 'get')"
- **Root Cause**: Constructor referenced `window.AssessmentAPIClient` (doesn't exist)
  - Correct object is `window.AssessmentAPI`
- **Resolution**: Fixed API client reference in AssessmentFlowManager constructor
  - Changed: `this.api = window.AssessmentAPIClient;`
  - To: `this.api = window.AssessmentAPI;`
- **Status**: ✅ **RESOLVED** (2025-10-14)
- **Files Fixed**:
  - client/js/assessment-flow.js (line 8)
- **Source**: Browser console error, debugging session

### ISS-W1-004: API Method Call Error
- **Priority**: P0 (CRITICAL - Blocks template fetching)
- **Discovered**: 2025-10-14 (Week 1, Day 1)
- **Impact**: Templates not fetched from backend
- **Description**: "this.api.get is not a function"
- **Root Cause**: AssessmentAPI doesn't have generic `get()` method
  - Has specific methods: `getTemplates()`, `getQuestions()`, etc.
- **Resolution**: Changed generic API call to specific method
  - Changed: `this.api.get('/api/assessment-templates?is_active=true')`
  - To: `this.api.getTemplates({ is_active: true })`
- **Status**: ✅ **RESOLVED** (2025-10-14)
- **Files Fixed**:
  - client/js/assessment-flow.js (line 77)
- **Source**: Browser console error, debugging session

### ISS-W1-005: No Question Library Seeding
- **Priority**: P1 (HIGH - Blocks testing)
- **Discovered**: 2025-10-14 (Week 1 review)
- **Impact**: Can't create meaningful templates without questions
- **Description**: AssessmentQuestion collection is empty by default
- **Root Cause**: No seeding script created during Week 1
- **Workaround**: Manually create questions or use question creation UI
- **Resolution Plan**: Create seeding script with 50-100 sample questions
- **Status**: 🔴 OPEN - Week 2, Day 1
- **Estimated Effort**: 4-6 hours
- **Owner**: Backend Team
- **Blocks**: Meaningful template creation, assessment taking testing
- **Source**: WEEK_1_SUMMARY.md

### ISS-W1-006: No Question Validation in Template Creation
- **Priority**: P1 (HIGH - Data integrity)
- **Discovered**: 2025-10-14 (Week 1 review)
- **Impact**: Can save templates with invalid question IDs
- **Description**: POST /api/assessment-templates doesn't validate question IDs exist
- **Root Cause**: No backend validation that selected_questions exist in AssessmentQuestion collection
- **Consequence**: Template saves but assessment taking will fail with "question not found"
- **Resolution Plan**: Add validation in POST endpoint
  - Query AssessmentQuestion collection for all selected_questions
  - Return 400 error with missing question IDs if validation fails
- **Status**: 🔴 OPEN - Week 2, Day 1
- **Estimated Effort**: 1-2 hours
- **Owner**: Backend Team
- **Files to Change**: server/routes/assessmentTemplates.js (POST handler)
- **Source**: WEEK_1_SUMMARY.md

### ISS-W1-007: No Template Editing UI
- **Priority**: P2 (MEDIUM - UX improvement)
- **Discovered**: 2025-10-14 (Week 1 review)
- **Impact**: Must recreate template to make changes
- **Description**: Can create templates but can't edit them via UI
- **Root Cause**: Backend PUT endpoint exists, but no frontend implementation
- **Workaround**: Delete and recreate template
- **Resolution Plan**: Add "Edit Template" button, reuse Step 2 & 3 pages with pre-populated data
- **Status**: 🔴 OPEN - Week 2, Day 4
- **Estimated Effort**: 4-6 hours
- **Owner**: Frontend Team
- **Source**: WEEK_1_SUMMARY.md

### ISS-W1-008: No Template Duplication UI
- **Priority**: P2 (MEDIUM - Nice to have)
- **Discovered**: 2025-10-14 (Week 1 review)
- **Impact**: Can't clone templates for customization
- **Description**: Template model has `duplicate()` method but no UI trigger
- **Use Case**: Clone global template and customize for specific business
- **Resolution Plan**: Add "Duplicate Template" button on template cards
- **Status**: 🔴 OPEN - Week 2, Day 4
- **Estimated Effort**: 2-3 hours
- **Owner**: Frontend Team
- **Source**: WEEK_1_SUMMARY.md

---

### ISS-010: Email Service Missing Fallback
- **Priority**: P1 (HIGH)
- **Discovered**: nov30_mvp_review.md
- **Impact**: Invitation system can't work without email service
- **Description**: No manual provisioning alternative for invitations
- **Resolution**:
  - DEV-003 creates Invitation model with token system
  - DEV-032 adds email sending (Week 9)
  - Week 4: Manual link sharing (no email)
  - Week 9: Email invitations added
- **Status**: ⚠️ WORKAROUND PLANNED - Manual invites Week 4, email Week 9
- **Source**: nov30_mvp_review.md:17

### ISS-011: OpenAI Disconnected from OKR Flow
- **Priority**: P1 (HIGH)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: AI OKR generation doesn't work
- **Description**: OpenAI integration exists in Insights engine (port 8089) but not connected to Planner engine (port 8083)
- **Current State**: Planner uses templates only
- **Resolution**: DEV-008 (Move OpenAI to Planner) - Week 0, Day 5
- **Status**: 🔴 OPEN - Week 0 task
- **Source**: IMPLEMENTATION_STATUS_REPORT.md

### ISS-012: Tracking Engine Direct Model Imports
- **Priority**: P1 (HIGH)
- **Discovered**: nov30_mvp_review.md
- **Impact**: Tight coupling, can't deploy independently
- **Description**: engines/tracking/services/AgentIntegrationService.js:19 uses direct model imports
- **Resolution**: IMP-001 (Shared-Models Migration) - Deferred to Beta
- **Status**: ⚠️ ACCEPTED RISK - Deferred to Beta
- **Source**: nov30_mvp_review.md:18

### ISS-013: iBrain Features in MVP Mockups
- **Priority**: P1 (HIGH)
- **Discovered**: nov30_mvp_review.md
- **Impact**: False customer expectations
- **Description**: Mockups show sentiment, AI chat, performance confidence not in MVP
- **Mockups Affected**:
  - manager/dashboard.html (lines 150-400)
  - manager/planning.html (lines 200-392)
  - employee/dashboard.html (lines 150-315)
- **Resolution**: DEV-016 (Hide/stub Beta features in mockups) - Week 4
- **Status**: 🔴 OPEN - Week 4 task
- **Source**: nov30_mvp_review.md:9-12

### ISS-014: Beta Features in Sprint 1
- **Priority**: P1 (HIGH)
- **Discovered**: nov30_mvp_review.md
- **Impact**: Scope creep, timeline at risk
- **Description**: MASTER_KARVIA_BUSINESS_DEV_LIST.md Sprint 1 includes template builders, formula editors deferred to Beta
- **Resolution**:
  - ✅ Moved to IMP-022, IMP-023, IMP-024 (Improvements List)
  - ✅ Removed from MASTER_DEV_LIST
- **Status**: ✅ RESOLVED (2025-10-13)
- **Source**: nov30_mvp_review.md:5

### ISS-015: No "Karvia without iBrain" Toggle
- **Priority**: P1 (HIGH)
- **Discovered**: nov30_mvp_review.md
- **Impact**: Can't disable iBrain features (requirement for external party)
- **Description**: No admin toggle to disable iBrain webhooks/connections
- **Resolution**: DEV-010 (Admin toggle for iBrain) - Week 0, Day 5
- **Status**: 🔴 OPEN - Week 0 task
- **Source**: nov30_mvp_review.md:7

### ISS-016: Service-to-Service Auth Missing
- **Priority**: P1 (HIGH)
- **Discovered**: Architecture_High_Level.md
- **Impact**: Security risk, engines can call each other without auth
- **Description**: No auth between microservices, only user auth exists
- **Resolution**: IMP-003 (Service-to-Service Auth) - Deferred to Beta
- **Status**: ⚠️ ACCEPTED RISK - Deferred to Beta
- **Source**: Architecture_High_Level.md:16

---

## ⚠️ MEDIUM PRIORITY (P2)

### ISS-017: Docker Compose Invalid Volumes
- **Priority**: P2 (MEDIUM)
- **Discovered**: MASTER_DEV_LIST_FINAL.md
- **Impact**: docker-compose up fails with volume errors
- **Description**: docker-compose.yml has invalid volume mounts
- **Resolution**: Fix in Week 0, Day 5 (part of Docker cleanup)
- **Status**: 🔴 OPEN - Week 0 task

### ISS-018: Missing Healthchecks (Docker)
- **Priority**: P2 (MEDIUM)
- **Discovered**: MASTER_DEV_LIST_FINAL.md
- **Impact**: Can't detect service failures
- **Description**: Some services in docker-compose.yml missing healthchecks
- **Resolution**: Fix in Week 0, Day 5 (part of Docker cleanup)
- **Status**: 🔴 OPEN - Week 0 task

### ISS-019: Invitation Model Missing
- **Priority**: P2 (MEDIUM)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: Can't track invitations (Week 6 feature)
- **Description**: server/models/Invitation.js doesn't exist
- **Resolution**: DEV-003 (Create Invitation Model) - Week 0, Day 2
- **Status**: 🔴 OPEN - Week 0 task

### ISS-020: Assessment History Not Persisted
- **Priority**: P2 (MEDIUM)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: Can't show assessment trends over time
- **Description**: Assessment engine calculates scores but doesn't store history (no Assessment model for history)
- **Current State**: Business.assessment_scores stores current, no historical tracking
- **Resolution**: DEV-004 (Create Assessment History Model) - Week 0, Day 2
- **Status**: 🔴 OPEN - Week 0 task

### ISS-021: Timeline Expectations Unrealistic
- **Priority**: P2 (MEDIUM)
- **Discovered**: Product_Strategy.md review
- **Impact**: Stakeholder misalignment
- **Description**: Strategy assumes Week 0 complete and 8 weeks remaining, but Week 0 not started
- **Resolution**:
  - ✅ Updated timeline in MASTER_DEV_LIST (Oct 13 start, Nov 30 end)
  - ✅ Created CUSTOMER_EMAIL_SIMPLE.md (realistic timeline)
- **Status**: ✅ RESOLVED (2025-10-13)
- **Source**: Product_Strategy.md:9

### ISS-022: Customer Segment Undefined
- **Priority**: P2 (MEDIUM)
- **Discovered**: Product_Strategy.md review
- **Impact**: Feature prioritization unclear
- **Description**: Docs oscillate between 20-200 vs 50-500 employee companies
- **Resolution**: Define primary segment (50-250 service businesses)
- **Status**: ⚠️ NEEDS PRODUCT DECISION
- **Source**: Product_Strategy.md:11

### ISS-023: No CI/CD Pipeline
- **Priority**: P2 (MEDIUM)
- **Discovered**: 2025-01-13 (Codebase audit)
- **Impact**: Manual testing, no automated deployment
- **Description**: No .github/workflows/ directory, no automated tests
- **Resolution**: IMP-066 (CI/CD Pipeline) - Planned for Beta
- **Status**: ⚠️ DEFERRED TO BETA

---

## 📊 ISSUE SUMMARY BY CATEGORY

### By Category:
- **Models Missing**: 4 issues (ISS-003, ISS-004, ISS-019, ISS-020)
- **API Incomplete**: 1 issue (ISS-005)
- **Architecture**: 5 issues (ISS-006, ISS-007, ISS-008, ISS-012, ISS-016)
- **Dependencies**: 3 issues (ISS-009, ISS-010, ISS-011)
- **Security**: 2 issues (ISS-002, ISS-016)
- **Documentation**: 2 issues (ISS-001, ISS-021)
- **Scope Management**: 2 issues (ISS-013, ISS-014)
- **Configuration**: 3 issues (ISS-015, ISS-017, ISS-018)
- **Product Strategy**: 2 issues (ISS-022, ISS-023)

### By Status:
- ✅ **Resolved**: 3 issues
- 🔴 **Open (Active)**: 13 issues
- ⚠️ **Accepted Risk/Deferred**: 7 issues

### By Week 0 Tasks:
- **Day 1**: ISS-003, ISS-004 (models)
- **Day 2**: ISS-019, ISS-020 (models)
- **Day 3**: ISS-005 (Goals API)
- **Day 4**: ISS-005 (Tasks API)
- **Day 5**: ISS-002, ISS-008, ISS-009, ISS-010, ISS-011, ISS-015, ISS-017, ISS-018

---

## 🔄 SYNC METADATA

**Last Manual Update**: 2025-10-13 08:30:00
**Auto-Sync Script**: `scripts/sync-master-lists.js`
**Sync Frequency**: On file save (git hook)

### Cross-References:
- **To MASTER_DEV_LIST**: 13 issues have associated DEV tasks
- **To MASTER_IMPROVEMENTS_LIST**: 7 issues deferred to improvements
- **From Review Docs**: 15 issues extracted from review comments

---

## 🆕 WEEK 1 CRITICAL GAPS (Days 3-4)

### ISS-024: Integration Tests Missing for Invitation Flow
- **Priority**: P1 (HIGH)
- **Discovered**: 2025-10-17 (Day 4)
- **Impact**: Cannot verify end-to-end invitation acceptance flow
- **Description**: DEV-W1-013 missing integration tests for invitation-flow.test.js
- **Resolution Plan**:
  - [ ] Create `tests/integration/invitation-flow.test.js` (200 lines)
  - [ ] Test: validate → accept → account created
  - [ ] Test: expired token rejection
  - [ ] Test: already used token rejection
  - [ ] Test: duplicate email rejection
- **Owner**: QA/Engineering
- **Target**: Day 4 completion
- **Linked Task**: DEV-W1-013

### ISS-025: SSI Scoring Service Not Implemented
- **Priority**: P0 (BLOCKING)
- **Discovered**: 2025-10-17 (Day 4)
- **Impact**: Cannot calculate assessment scores (DEV-W1-014 blocked)
- **Description**: Assessment submission requires SSIScoringService for dimension scoring
- **Resolution Plan**:
  - [ ] Create `server/services/SSIScoringService.js`
  - [ ] Implement dimension score calculation (weighted averages)
  - [ ] Implement composite score calculation
  - [ ] Implement status determination (needs_attention, critical thresholds)
  - [ ] Add unit tests
- **Owner**: Engineering Lead
- **Target**: Day 4, before DEV-W1-014
- **Linked Task**: DEV-W1-014

### ISS-026: Assessment Model Missing Key Fields
- **Priority**: P0 (BLOCKING)
- **Discovered**: 2025-10-17 (Day 4)
- **Impact**: Cannot store assessment submissions
- **Description**: Assessment model needs responses array, dimension_scores, composite_score fields
- **Files**: `server/models/Assessment.js`
- **Resolution Plan**:
  - [ ] Add responses array: `[{ question_id, dimension, category, response_value, question_weight, weighted_score }]`
  - [ ] Add dimension_scores: `{ speed: {...}, strength: {...}, intelligence: {...} }`
  - [ ] Add composite_score field
  - [ ] Add invitation_id reference
  - [ ] Add is_retake, retake_number fields
- **Owner**: Engineering
- **Target**: Day 4, before DEV-W1-014
- **Linked Task**: DEV-W1-014

### ISS-027: Rate Limiter Missing for Public Endpoints
- **Priority**: P1 (HIGH)
- **Discovered**: 2025-10-17 (Day 4)
- **Impact**: Public endpoints vulnerable to abuse
- **Description**: invitationValidateLimiter and invitationAcceptLimiter referenced but may not exist
- **Files**: `server/middleware/rateLimiting.js`
- **Resolution Plan**:
  - [ ] Verify invitationValidateLimiter exists (20/hour per IP)
  - [ ] Verify invitationAcceptLimiter exists (5/hour per IP)
  - [ ] If missing, add limiters to Day 0 middleware
  - [ ] Test rate limiting enforcement
- **Owner**: Engineering
- **Target**: Day 4
- **Linked Task**: DEV-W1-013

### ISS-028: Email Sending Not Implemented
- **Priority**: P2 (MEDIUM)
- **Discovered**: 2025-10-17 (Day 4)
- **Impact**: Invitations created but not sent via email
- **Description**: POST /api/invitations/create generates links but doesn't send emails
- **Resolution Plan**:
  - [ ] Add email service (SendGrid, AWS SES, or similar)
  - [ ] Create email templates for invitations
  - [ ] Send email after invitation creation
  - [ ] Track email delivery status in invitation.email_delivery
  - [ ] Optional: Add email queue for reliability
- **Owner**: Engineering Lead
- **Target**: Day 5 or Week 2
- **Linked Task**: DEV-W1-012

---

**Next Triage**: Daily during Week 1 (issues discovered during implementation)**
