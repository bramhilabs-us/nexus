# 📅 Week 2 Detailed Plan - Production Hardening & Security

**Week**: 2 of 9 (Nov 30 Release)
**Dates**: October 16-23, 2025 (8 days including Day 0)
**Status**: ⬜ NOT STARTED (Pending Pre-Week 2 Tasks)
**Priority**: P0 - Production Readiness
**Total Tasks**: 27 tasks (6 Day 0 + 17 core + 4 deferred from Week 1)
**Total Effort**: 54 hours (6.75 days)

---

## 🎯 Executive Summary

### Strategic Shift: Production First, Features Second

Week 2 was originally planned for "Advanced Analytics & Insights", but after Week 1 completion, critical production readiness gaps were identified that MUST be addressed before adding more features.

**The Decision**: Shift Week 2 to Production Hardening, move Analytics to Week 3.

**Why This Matters**:
- Week 1 delivered all core assessment features (24 tasks) ✅
- But left critical production gaps: secrets exposed, no structured logging, minimal testing, auth bugs
- Adding analytics on top of broken foundation = compound failures
- Better to harden now than fix production incidents later
- **No impact on Nov 30 deadline** - still 7 weeks remaining

### What This Week Delivers

**Security & Secrets** ✅:
- All exposed secrets removed and rotated
- Strong cryptographically random secrets (128 chars)
- Secrets management service with validation
- Environment-specific configurations

**Logging & Monitoring** ✅:
- Production-grade Winston logger with daily rotation
- Structured JSON logs for parsing
- Health check endpoints for monitoring
- Request tracking with unique IDs

**Testing & Quality** ✅:
- Integration test suite (100% critical flows)
- Unit test coverage > 80%
- Automated CI/CD integration
- Test coverage reports

**Production Readiness** ✅:
- Input validation on all endpoints (Joi)
- Database connection hardening & indexes
- Rate limiting verified & enhanced
- Zero hardcoded values
- Complete API documentation (Swagger)
- Deployment guides and runbooks

**Week 1 Deferred Features** ✅ (Day 5):
- Template editing UI
- Template duplication UI
- Template preview
- Enhanced question filtering

---

## ⚠️ CRITICAL: Pre-Week 2 Tasks (MUST COMPLETE FIRST)

**Before starting Day 1, complete these 3 tasks**: See [PRE_WEEK_2_TODO_CHECKLIST.md](./PRE_WEEK_2_TODO_CHECKLIST.md)

### Task 1: Question Library Seeding Script (3-4h) 🔴 P0
- **Why Critical**: Database is empty, can't test templates or assessments
- **What**: Create script to load 146 questions from existing JSON
- **Blocks**: All Week 2 testing, template validation
- **Reference**: [PRE_WEEK_2_TODO_CHECKLIST.md#task-1](./PRE_WEEK_2_TODO_CHECKLIST.md#-task-1-create-question-library-seeding-script)

### Task 2: Template Question Validation (1-2h) 🔴 P0
- **Why Critical**: Can save templates with invalid questions → system breaks
- **What**: Add validation in POST endpoint before saving
- **Blocks**: Data integrity
- **Reference**: [PRE_WEEK_2_TODO_CHECKLIST.md#task-2](./PRE_WEEK_2_TODO_CHECKLIST.md#-task-2-add-template-question-validation)

### Task 3: Rate Limiter Verification (1h) ⚠️ P1
- **Why Critical**: Public endpoints may lack rate limiting → security risk
- **What**: Verify invitation limiters exist and are applied
- **Blocks**: Public endpoint security
- **Reference**: [PRE_WEEK_2_TODO_CHECKLIST.md#task-3](./PRE_WEEK_2_TODO_CHECKLIST.md#-task-3-verify-rate-limiter-configuration)

**Estimated Total**: 4-6 hours
**Go/No-Go**: Cannot start Week 2 until these 3 tasks complete

---

## 📊 Week 2 Progress Tracker

### ✅ REVISED SCOPE (Nov 30 Focus)

**Decision Date**: October 17, 2025
**Reason**: Focus on customer-facing features for Nov 30 deadline

| Day | Tasks | Status | Hours | Priority | Action |
|-----|-------|--------|-------|----------|--------|
| **Day 0** | 6 tasks (Blocker Verification) | ✅✅✅✅✅✅ | 0h (All Resolved!) | P0 | ✅ COMPLETE |
| **Day 1** | 4 tasks (Security & Logging) | ✅✅✅⬜ | 10h | P0 | ✅ 75% COMPLETE (sufficient) |
| **Day 2** | ~~3 tasks (Validation & DB)~~ | ⏭️⏭️⏭️ | ~~8h~~ | ~~P0~~ | ⏭️ DEFERRED TO BETA (IMP-074 to IMP-076) |
| **Day 2.5** | **4 tasks (TDD) - SEQUENTIAL** | ✅✅✅✅ | **6h** | **P0** | ✅ **100% COMPLETE** |
| **Day 3** | ~~3 tasks (Testing)~~ | ⏭️⏭️⏭️ | ~~8h~~ | ~~P0~~ | ⏭️ DEFERRED TO BETA (IMP-077 to IMP-079) |
| **Day 4** | ~~4 tasks (Monitoring & Config)~~ | ⏭️⏭️⏭️⏭️ | ~~8h~~ | ~~P0-P1~~ | ⏭️ DEFERRED TO BETA (IMP-080 to IMP-083) |
| **Day 5** | ~~3 tasks (Code Quality)~~ | ⏭️✅⏭️ | ~~8h~~ | ~~P0-P1~~ | ⏭️ DEFERRED TO BETA (IMP-084 to IMP-085) |
| **Deferred** | ~~4 tasks (Week 1 UI features)~~ | ⏭️⏭️⏭️⏭️ | ~~8-16h~~ | ~~P1-P2~~ | ⏭️ DEFERRED TO BETA (IMP-086 to IMP-089) |

**Original Week 2**: 31 tasks, 60 hours
**Revised Week 2**: 11 tasks, 16 hours (73% reduction)
**Deferred to Beta**: 16 tasks, 44 hours → MASTER_IMPROVEMENTS_LIST.md (IMP-074 to IMP-089)

**Progress**:
- ✅ **Complete**: 15 tasks (Day 0: 6 + Day 1: 3 + Day 2.5: 4 + Day 5 QA Docs: 1 + Sync: 1)
- ⬜ **Remaining**: 0 tasks
- ⏭️ **Deferred to Beta**: 16 tasks (moved to MASTER_IMPROVEMENTS_LIST.md)

**Completion**: Day 0 (100%), Day 1 (75%), Day 2.5 (100%)

**⚠️ IMPORTANT**: Day 2.5 tasks were executed sequentially to avoid concurrency errors. See [WEEK_2_DAY_2.5_SEQUENTIAL_EXECUTION_GUIDE.md](./WEEK_2_DAY_2.5_SEQUENTIAL_EXECUTION_GUIDE.md)

---

## 🔗 Quick Reference Links

### Master Planning Documents
- [MASTER_DEV_LIST.md](../../MASTER_DEV_LIST.md#week-2) - All Week 2 tasks (lines 1211-2233)
- [MASTER_ISSUES_LIST.md](../../MASTER_ISSUES_LIST.md) - Known issues (32 items, 8 relevant to Week 2)
- [MASTER_IMPROVEMENTS_LIST.md](../../MASTER_IMPROVEMENTS_LIST.md) - Future work (73 items)

### Week 1 Context
- [WEEK_1_FINAL_REPORT.md](../WEEK_1_FINAL_REPORT.md) - Complete Week 1 summary (100% complete)
- [WEEK_1_TO_WEEK_2_TRANSITION.md](../WEEK_1_TO_WEEK_2_TRANSITION.md) - Transition notes & strategic shift
- [WEEK_1_SUMMARY.md](../Week_1/WEEK_1_SUMMARY.md) - Detailed Week 1 handoff
- [WEEK_1_DAY_4_FINAL_HANDOFF.md](../Week_1/WEEK_1_DAY_4_FINAL_HANDOFF.md) - Production fixes

### Week 2 Context
- [WEEK_2_PRODUCTION_HARDENING_PLAN.md](../WEEK_2_PRODUCTION_HARDENING_PLAN.md) - Original plan (before audit)
- [WEEK_2_DAY_1_HANDOFF.md](./WEEK_2_DAY_1_HANDOFF.md) - Day 1 completion (security & logging ✅)
- [PRE_WEEK_2_AUDIT_REPORT.md](./PRE_WEEK_2_AUDIT_REPORT.md) - Comprehensive audit findings
- [PRE_WEEK_2_TODO_CHECKLIST.md](./PRE_WEEK_2_TODO_CHECKLIST.md) - 3 critical pre-tasks

### Review Documents
- [Week1_Assessment_Plan_Review.md](../../Review Docs/Week1_Assessment_Plan_Review.md) - Critical Week 1 review
- [nov30_mvp_review.md](../../Review Docs/mvp_release_alignment/nov30_mvp_review.md) - MVP alignment

---

## 🔧 DAY 0: Critical Week 1 Fixes (PREREQUISITE) - ✅ COMPLETE

**Priority**: P0 - MUST complete before other Week 2 tasks
**Status**: ✅✅✅✅✅✅ 6/6 tasks (100%) - **ALL BLOCKERS RESOLVED**
**Verification Date**: October 17, 2025
**Rationale**: Week 1 left critical auth and validation bugs that block production hardening

**✅ VERIFICATION COMPLETE**: All 6 blockers have been verified and are RESOLVED. Week 1 work already fixed these issues.

### DEV-W2-001: Fix Auth Middleware IAM Contract Mismatch ✅ **RESOLVED**

**Priority**: P0 (CRITICAL - BLOCKING)
**Status**: ✅ RESOLVED - No fix needed
**Verification Date**: October 17, 2025

**Original Claim**:
- Auth guard calls wrong IAM endpoint
- Middleware calls `GET /api/auth/verify` (doesn't exist)
- IAM engine only exposes `POST /api/auth/validate`

**Verification Results**:
- ✅ Confirmed: `server/middleware/authGuards.js:36` uses `POST` to `/api/auth/validate`
- ✅ Confirmed: Correct endpoint being called
- ✅ Confirmed: Week 2 Day 1 testing showed auth working correctly

**Conclusion**: This was a **FALSE ALARM**. Auth middleware is correctly implemented. No action required.

**Reference**:
- server/middleware/authGuards.js:36 (verified correct implementation)
- WEEK_2_DAY_1_HANDOFF.md:30-50 (testing confirmed working)

---

### DEV-W2-002: Fix Local JWT Verification Secret Mismatch ✅ **RESOLVED**

**Priority**: P0 (CRITICAL - BLOCKING)
**Status**: ✅ RESOLVED - Fixed by Week 2 Day 1 (DEV-W2-007)
**Resolution Date**: October 16, 2025 (Week 2 Day 1)

**Original Problem**:
- Local JWT verifier uses wrong secret
- `authenticateTokenLocal` uses `karvia-dev-secret-key-2024-change-in-production`
- IAM issues tokens with `karvia-business-secret`
- Secrets don't match, verification fails

**Verification Results**:
- ✅ Confirmed: `.env` has unified `JWT_SECRET` (128 hex chars)
- ✅ Confirmed: SecretsManager service ensures single source of truth
- ✅ Confirmed: All engines synchronized with same secret
- ✅ Confirmed: Week 2 Day 1 work (DEV-W2-007) resolved this issue

**Resolution**: Week 2 Day 1 Security Audit & Secrets Management (DEV-W2-007) fixed this by:
1. Creating SecretsManager service
2. Generating strong 128-char JWT_SECRET
3. Synchronizing across main server, IAM engine, and scoring engine

**Reference**:
- .env:17 (JWT_SECRET = 128 chars)
- WEEK_2_DAY_1_HANDOFF.md:57-289 (DEV-W2-007 completed)
- SECRETS_MANAGEMENT.md (comprehensive guide created)

---

### DEV-W2-003: Fix Consultant Signup Schema Constraints ✅ **RESOLVED**

**Priority**: P0 (CRITICAL - BLOCKING)
**Status**: ✅ RESOLVED - Already implemented in Week 1
**Verification Date**: October 17, 2025

**Original Problem**:
- Consultant signup impossible due to schema constraints
- `business_id` marked as `required: false` but validation still blocks null
- Email uniqueness is global, prevents consultant reuse across businesses

**Verification Results**:
- ✅ Confirmed: `server/models/User.js:14` - `business_id: required: false` ✓
- ✅ Confirmed: Line 249 - Compound index `{business_id: 1, email: 1}` with `unique: true, sparse: true` ✓
- ✅ Confirmed: Line 10 comment documents consultant support ✓
- ✅ Confirmed: Line 43-46 - `managed_businesses` array for consultant role ✓

**Resolution**: Week 1 implementation already included:
1. `business_id` optional for CONSULTANT role
2. Compound index allowing email reuse across businesses
3. `managed_businesses` array for multi-business management
4. Proper documentation in schema comments

**Files Verified**:
- server/models/User.js:14 (`business_id: required: false`)
- server/models/User.js:249 (compound index with sparse)
- server/models/User.js:43-46 (`managed_businesses` array)

**Reference**: server/models/User.js (verified correct implementation)

---

### DEV-W2-004: Fix Invitation Role Mismatch ✅ **RESOLVED**

**Priority**: P1 (HIGH - DATA INTEGRITY)
**Status**: ✅ RESOLVED - Already implemented in Week 1
**Verification Date**: October 17, 2025

**Original Problem**:
- Invitation model emits legacy roles (`team_member`, lowercase)
- User model expects: `['CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE']`
- Auto-account creation will throw validation error

**Verification Results**:
- ✅ Confirmed: `server/models/Invitation.js:41` - `recipient_role` enum matches User model exactly ✓
- ✅ Confirmed: Uses `['CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE']` ✓
- ✅ Confirmed: Default is `'EMPLOYEE'` (matches User model) ✓
- ✅ Confirmed: Line 43 comment documents alignment with User model ✓

**Resolution**: Week 1 implementation already uses correct role enum. No legacy roles present.

**Files Verified**:
- server/models/Invitation.js:39-43 (correct enum matching User model)
- server/models/User.js:35-40 (role enum reference)

**Reference**: server/models/Invitation.js (verified correct implementation)

---

### DEV-W2-005: Fix Business Creation Number Sanitization ✅ **RESOLVED**

**Priority**: P1 (HIGH - DATA INTEGRITY)
**Status**: ✅ RESOLVED - Already implemented in Week 1
**Verification Date**: October 17, 2025

**Original Problem**:
- Business creation mishandles numeric strings
- `parseInt("25")` works but `parseInt("0")` becomes 0, then defaults to 10
- `isNaN("abc")` returns true but `parseInt("abc")` is NaN
- Size categories calculated incorrectly

**Verification Results**:
- ✅ Confirmed: `server/services/BusinessCreationService.js:40` - Uses `parseInt(employee_count, 10)` with proper validation ✓
- ✅ Confirmed: Line 43-45 - `isNaN()` check throws error for invalid input ✓
- ✅ Confirmed: Line 40 - Default value of 10 only applied if `employee_count` is falsy ✓
- ✅ Confirmed: `parseInt("0", 10)` returns 0, not treated as falsy (correct behavior) ✓

**Resolution**: Week 1 implementation already handles edge cases correctly:
1. `parseInt(employee_count, 10)` with radix 10
2. `isNaN()` validation rejects non-numeric strings
3. Throws error for negative numbers
4. Default (10) only applies to null/undefined, not 0

**Files Verified**:
- server/services/BusinessCreationService.js:38-47 (correct parsing logic)

**Reference**: server/services/BusinessCreationService.js (verified correct implementation)

---

### DEV-W2-006: Fix Template Duplicate Question Validation ✅ **RESOLVED**

**Priority**: P1 (HIGH - DATA INTEGRITY)
**Status**: ✅ RESOLVED - Already implemented in Week 1
**Verification Date**: October 17, 2025

**Original Problem**:
- Template validation allows duplicate question IDs
- Template with [Q1, Q2, Q1] counts as 3 questions but only has 2 unique
- `total_questions` inflated, affects scoring

**Verification Results**:
- ✅ Confirmed: `server/models/AssessmentTemplate.js:205-209` - Duplicate detection implemented ✓
- ✅ Confirmed: Uses `Set` to find unique question IDs ✓
- ✅ Confirmed: Throws error with specific duplicate IDs listed ✓
- ✅ Confirmed: Error message: `"Duplicate question IDs found: [id1, id2]"` ✓

**Resolution**: Week 1 implementation already includes duplicate validation in pre-save hook:
1. Collects all question IDs from all dimensions
2. Uses `Set` to find unique IDs
3. Compares Set size to array length
4. Throws descriptive error if duplicates found

**Code Verified** (lines 205-209):
```javascript
const uniqueQuestionIds = new Set(allQuestionIds);
if (uniqueQuestionIds.size !== allQuestionIds.length) {
  const duplicates = allQuestionIds.filter((id, index) =>
    allQuestionIds.indexOf(id) !== index);
  throw new Error(`Duplicate question IDs found: ${[...new Set(duplicates)].join(', ')}`);
}
```

**Files Verified**:
- server/models/AssessmentTemplate.js:205-209 (duplicate validation)

**Reference**: server/models/AssessmentTemplate.js (verified correct implementation)

---

### Day 0 Summary - ✅ ALL BLOCKERS RESOLVED

**Verification Complete**: October 17, 2025

**Results**: All 6 potential blockers have been verified and are **RESOLVED**. Week 1 implementation was more robust than documented.

| Blocker | Status | Resolution |
|---------|--------|------------|
| DEV-W2-001: Auth Middleware | ✅ RESOLVED | Uses correct `POST /api/auth/validate` endpoint |
| DEV-W2-002: JWT Secrets | ✅ RESOLVED | Fixed by Week 2 Day 1 (DEV-W2-007) - unified JWT_SECRET |
| DEV-W2-003: Consultant Signup | ✅ RESOLVED | `business_id` optional, compound index exists |
| DEV-W2-004: Invitation Roles | ✅ RESOLVED | Enum matches User model exactly |
| DEV-W2-005: Number Sanitization | ✅ RESOLVED | Proper `parseInt` with `isNaN` validation |
| DEV-W2-006: Duplicate Questions | ✅ RESOLVED | Pre-save hook validates uniqueness |

**Impact**:
- ✅ No blocker fixes needed - Week 2 can proceed immediately with Day 2 tasks
- ✅ Production foundation is solid
- ✅ TDD infrastructure can be built on stable codebase
- ✅ Saves 6-8 hours originally estimated for fixes

**Next Steps**: Proceed directly to Day 2 (Input Validation & Database Hardening) + TDD Setup

---

## 📅 DAY 1: Security & Secrets Management - 10 hours

**Date**: Thursday, October 17, 2025
**Tasks**: 4 tasks
**Status**: ✅✅⬜⬜ 2/4 complete (50%)
**Priority**: P0 (CRITICAL SECURITY)

**NOTE**: Task numbers shifted +6 due to Day 0 prerequisites
- Old DEV-W2-001 → Now DEV-W2-007
- Old DEV-W2-014 → Now DEV-W2-020

---

### DEV-W2-007: Audit and Secure Environment Variables ✅ **COMPLETE**

**Priority**: P0 (CRITICAL SECURITY)
**Estimated Time**: 4 hours (increased from 2h per review feedback)
**Dependencies**: DEV-W2-001, DEV-W2-002 (auth must work first) - **Verified working**
**Owner**: Engineering Lead
**Status**: ✅ **COMPLETE** (Week 2 Day 1)

**Completed Work** (from WEEK_2_DAY_1_HANDOFF.md:57-289):
- ✅ Created SecretsManager service (`server/services/secretsManager.js`, 212 lines)
- ✅ Generated strong secrets (128 hex chars, cryptographically random)
- ✅ Created environment files (`.env.development`, `.env.production.example`)
- ✅ Updated .gitignore with comprehensive .env protection
- ✅ Rotated JWT_SECRET and SESSION_SECRET
- ✅ Created comprehensive SECRETS_MANAGEMENT.md guide (580 lines)
- ✅ Synchronized secrets across all engines (IAM, Scoring)

**Deliverables**:
- ✅ SecretsManager service with validation and redaction
- ✅ Strong secrets: JWT (128 chars), Session (128 chars)
- ✅ Environment-specific configs (development, production template)
- ✅ Complete documentation

**Files Created**:
- `server/services/secretsManager.js`
- `.env.development` (gitignored)
- `.env.production.example` (committed)
- `engines/iam/.env` (gitignored)
- `SECRETS_MANAGEMENT.md`

**Files Modified**:
- `.gitignore`
- `.env` (gitignored, updated with strong secrets)
- `engines/scoring/.env`

**Reference**:
- MASTER_DEV_LIST.md:1500-1527
- WEEK_2_DAY_1_HANDOFF.md:57-289
- SECRETS_MANAGEMENT.md (created)

---

### DEV-W2-008: Production Logger Service ✅ **COMPLETE**

**Priority**: P0 (BLOCKING)
**Estimated Time**: 3 hours
**Owner**: Backend Team
**Status**: ✅ **COMPLETE** (Week 2 Day 1)

**Completed Work** (from WEEK_2_DAY_1_HANDOFF.md:290-586):
- ✅ Created production Winston logger (`server/services/logger.js`, 296 lines)
- ✅ Implemented daily file rotation with compression
- ✅ Structured JSON logging for production parsing
- ✅ Color-coded console output for development
- ✅ Multiple log levels (error, warn, info, http, debug)
- ✅ Specialized logging methods (security, business, db, api)
- ✅ Request logger middleware with timing
- ✅ Sensitive data sanitization (auto-redacts passwords, tokens, etc.)
- ✅ Integrated into existing middleware system

**Deliverables**:
- ✅ Winston logger with daily rotation (20MB max, 30d retention)
- ✅ JSON logs for production, colored for development
- ✅ Request ID tracking
- ✅ Zero console.log in production code
- ✅ Sensitive data masked in logs

**Files Created**:
- `server/services/logger.js` (296 lines)
- `logs/README.md`

**Files Modified**:
- `server/middleware/logging.js` (reduced from 194 to 118 lines)
- `package.json` (added winston dependencies)

**NPM Packages Installed**:
- `winston@^3.11.0`
- `winston-daily-rotate-file@^5.0.0`

**Reference**:
- MASTER_DEV_LIST.md:1528-1553
- WEEK_2_DAY_1_HANDOFF.md:290-586

---

### DEV-W2-009: Comprehensive Error Handling Middleware ✅ **COMPLETE**

**Priority**: P0 (BLOCKING)
**Estimated Time**: 3 hours
**Owner**: Backend Team
**Status**: ✅ COMPLETE (Week 2 Day 1)
**Completion Date**: October 17, 2025

**Description**: Implement global error handler and custom error classes

**Completed Work** (from WEEK_2_DAY_1_HANDOFF.md):
- ✅ Created custom error class hierarchy (10 error types)
- ✅ Implemented asyncHandler wrapper for async routes
- ✅ Enhanced error middleware with request tracking
- ✅ Added operational vs programming error distinction
- ✅ Implemented global error handlers (unhandled rejections, uncaught exceptions)
- ✅ Environment-aware error responses (stack traces in dev only)

**Deliverables**:
- ✅ Created custom error classes hierarchy:
  - ValidationError (400)
  - AuthenticationError (401)
  - AuthorizationError (403)
  - NotFoundError (404)
  - ConflictError (409)
  - RateLimitError (429)
  - ExternalAPIError (502)
  - DatabaseError (500)
- ✅ `server/utils/errors/AppError.js` - Base error class
- ✅ `server/utils/errors/index.js` - 10 specialized error classes
- ✅ `server/utils/errors/asyncHandler.js` - Async error wrapper
- ✅ `server/middleware/errorHandler.js` - Enhanced error middleware (217 lines)
- ✅ Integrated into `server/index.js`

**Files Created**:
- `server/utils/errors/AppError.js` (50 lines)
- `server/utils/errors/index.js` (150 lines)
- `server/utils/errors/asyncHandler.js` (8 lines)
- `server/middleware/errorHandler.js` (217 lines)

**Files Modified**:
- `server/index.js` (integrated new error handlers)

**Achievement**:
- ✅ All 10 error classes implemented
- ✅ Request ID tracking operational
- ✅ Operational vs programming error distinction working
- ✅ Environment-aware responses (stack in dev only)
- ✅ Global error handlers for unhandled rejections/exceptions
- ✅ Automatic handling of Mongoose, JWT, MongoDB, Multer errors

**Reference**:
- WEEK_2_DAY_1_HANDOFF.md (DEV-W2-003 completion details)
- Commit: c801a24

---

## 📅 DAY 2: Input Validation & Database Hardening - 8 hours

**Date**: Friday, October 18, 2025
**Tasks**: 3 tasks
**Status**: ⬜⬜⬜ 0/3 complete (0%)
**Priority**: P0 (SECURITY & PERFORMANCE)

---

### DEV-W2-010: Input Validation Middleware (Joi) 🔄 **75% COMPLETE**

**Priority**: P0 (SECURITY)
**Estimated Time**: 4 hours (3h done, ~1h remaining)
**Owner**: Backend Team
**Status**: 🔄 IN PROGRESS - Infrastructure complete, route integration pending
**Completion Date**: October 17, 2025 (infrastructure)

**Description**: Add comprehensive input validation to all API endpoints

**Completed Work** (3 hours):
- ✅ Installed Joi validation library
- ✅ Created validation middleware (`server/middleware/validate.js`)
- ✅ Created 4 comprehensive validator schemas:
  - `server/validators/user.validator.js` (signup, login, profile, roles)
  - `server/validators/business.validator.js` (create, update, query)
  - `server/validators/invitation.validator.js` (create, bulk, query, token)
  - `server/validators/template.validator.js` (create, update, duplicate with business logic)
- ✅ Business logic validation (dimension weights, duplicate questions, minimums)
- ✅ Field-level error messages integrated with ValidationError class

**Remaining Work** (~1 hour):
- ⏳ Integrate validators into routes (see VALIDATION_INTEGRATION_TODO.md)
- ⏳ Test validation on critical endpoints

**Tasks**:
- [ ] Install joi validation library: `npm install joi`
- [ ] Create validation schemas for all models:
  - User validation schema (email, password, name, role)
  - Business validation schema (name, industry, employee_count)
  - AssessmentTemplate validation schema (name, dimensions, questions)
  - Invitation validation schema (email, role, template_id)
  - Assessment validation schema (responses array, scores)
  - Question validation schema (text, dimension, scale)
- [ ] Create validation middleware: `server/middleware/validate.js`
  - `validate.body(schema)` - Validates req.body
  - `validate.query(schema)` - Validates req.query
  - `validate.params(schema)` - Validates req.params
- [ ] Add validation to all POST/PUT endpoints
- [ ] Sanitize inputs:
  - Trim whitespace
  - Lowercase emails
  - Remove special characters where appropriate
- [ ] Validate MongoDB ObjectIds (prevent cast errors)
- [ ] Validate enum values against model enums
- [ ] Validate date ranges (start < end)
- [ ] Validate array lengths (min/max)
- [ ] Test validation with invalid inputs

**Acceptance Criteria**:
- [ ] All POST/PUT endpoints have input validation
- [ ] Validation errors return 400 with field-specific details:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Validation failed",
      "details": [
        {
          "field": "email",
          "message": "Invalid email format"
        },
        {
          "field": "password",
          "message": "Password must be at least 8 characters"
        }
      ]
    }
  }
  ```
- [ ] No invalid data reaches database
- [ ] ObjectId validation prevents cast errors
- [ ] Array/string length limits enforced
- [ ] Enum validation prevents invalid values

**Files to Create**:
- `server/middleware/validate.js` (~150 lines)
- `server/validators/user.validator.js` (~100 lines)
- `server/validators/business.validator.js` (~80 lines)
- `server/validators/template.validator.js` (~120 lines)
- `server/validators/invitation.validator.js` (~70 lines)
- `server/validators/assessment.validator.js` (~100 lines)
- `server/validators/question.validator.js` (~60 lines)

**Example Usage**:
```javascript
const { validate } = require('../middleware/validate');
const { createUserSchema } = require('../validators/user.validator');

router.post('/signup',
  validate.body(createUserSchema),
  async (req, res, next) => {
    // req.body is validated and sanitized
  }
);
```

**Customer Impact**: Prevents data corruption and injection attacks

**Reference**: MASTER_DEV_LIST.md:1591-1625

---

### DEV-W2-011: Database Connection Hardening ⬜

**Priority**: P0 (BLOCKING)
**Estimated Time**: 2 hours
**Owner**: Backend Team
**Status**: ⬜ NOT STARTED

**Description**: Implement proper connection pooling, retry logic, timeouts

**Current State**: Basic connection, no error handling, no retries

**Tasks**:
- [ ] Configure connection pool in `server/config/database.js`:
  - Min pool size: 5
  - Max pool size: 50
  - Max idle time: 30 seconds
- [ ] Add connection retry logic:
  - 5 retry attempts
  - Exponential backoff (1s, 2s, 4s, 8s, 16s)
  - Log retry attempts
- [ ] Set query timeouts:
  - Default: 30 seconds
  - Long queries: 60 seconds (configurable)
- [ ] Monitor connection health:
  - Connection event listeners (connected, error, disconnected)
  - Log connection status changes
  - Alert on connection drops
- [ ] Handle connection drops gracefully:
  - Auto-reconnect on disconnection
  - Queue queries during reconnection
  - Reject queries if reconnection fails
- [ ] Create health check endpoint:
  - GET /health/db - Returns DB status
  - Response includes: connected, latency, pool stats
- [ ] Test connection recovery:
  - Stop MongoDB, verify auto-reconnect
  - Test query timeout enforcement
  - Test pool size limits
- [ ] Implement graceful shutdown:
  - Close connections on SIGTERM
  - Wait for pending queries
  - Timeout after 10 seconds

**Acceptance Criteria**:
- [ ] Connection pool working (min 5, max 50)
- [ ] Auto-reconnect on connection loss
- [ ] Query timeout protection (30s default)
- [ ] Health check shows DB status
- [ ] Graceful shutdown on app termination
- [ ] Connection stats logged
- [ ] Retry logic tested and working

**Files to Modify**:
- `server/config/database.js` (complete rewrite, ~200 lines)
- `server/index.js` (startup sequence, graceful shutdown)

**Health Check Response Example**:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "latency": "12ms",
    "pool": {
      "size": 8,
      "available": 5,
      "waiting": 0
    }
  }
}
```

**Customer Impact**: Database reliability and stability

**Reference**: MASTER_DEV_LIST.md:1626-1652

---

### DEV-W2-012: Database Indexes Optimization ⬜

**Priority**: P1 (HIGH)
**Estimated Time**: 2 hours
**Owner**: Backend Team
**Status**: ⬜ NOT STARTED

**Description**: Add indexes for query performance, prevent slow queries at scale

**Current State**: Only default _id indexes, queries will slow as data grows

**Tasks**:
- [ ] Analyze query patterns from Week 1 routes
- [ ] Add indexes to **User** model:
  - `email` (unique)
  - `{ business_id: 1, role: 1 }` (compound - for team queries)
  - `managed_businesses` (array index - for consultant queries)
  - `manager_id` (for manager hierarchy queries)
- [ ] Add indexes to **Invitation** model:
  - `invitation_token` (unique, sparse)
  - `{ business_id: 1, status: 1 }` (compound - for filtering)
  - `{ sent_by: 1, created_at: -1 }` (compound - for sender history)
  - `recipient_email` (for lookup)
  - `expires_at` (TTL index for auto-cleanup after 90 days)
- [ ] Add indexes to **Assessment** model:
  - `{ user_id: 1, completed_at: -1 }` (compound - for user history)
  - `{ template_id: 1, business_id: 1 }` (compound - for template usage)
  - `invitation_id` (for invitation tracking)
  - `{ business_id: 1, completed_at: -1 }` (compound - for team results)
- [ ] Add indexes to **AssessmentTemplate** model:
  - `{ business_id: 1, is_active: 1 }` (compound - for business templates)
  - `{ is_global: 1, is_active: 1 }` (compound - for global templates)
  - `created_by` (for ownership queries)
- [ ] Add indexes to **AssessmentQuestion** model:
  - `{ dimension: 1, category: 1 }` (compound - for filtering)
  - `question_id` (unique - for question lookup)
  - `is_active` (for active questions only)
- [ ] Test query performance with indexes:
  - Use `.explain()` to verify index usage
  - Compare query times before/after indexes
  - Target: All queries < 100ms
- [ ] Document index strategy in README

**Acceptance Criteria**:
- [ ] All frequently queried fields indexed
- [ ] Compound indexes for common filter combinations
- [ ] Query performance improved (< 100ms for most queries)
- [ ] Index usage verified with `.explain()`
- [ ] TTL index on invitations working (auto-cleanup)
- [ ] No duplicate or unnecessary indexes

**Index Creation Examples**:
```javascript
// In server/models/User.js
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ business_id: 1, role: 1 });
userSchema.index({ managed_businesses: 1 });

// In server/models/Invitation.js
invitationSchema.index({ invitation_token: 1 }, { unique: true, sparse: true });
invitationSchema.index({ business_id: 1, status: 1 });
invitationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
```

**Customer Impact**: Fast queries at scale, better user experience

**Reference**: MASTER_DEV_LIST.md:1653-1691

---

## 📅 DAY 2.5: TDD Infrastructure Setup (ADDED) - 6 hours

**Date**: Friday-Saturday, October 18-19, 2025
**Tasks**: 4 new TDD tasks (SEQUENTIAL EXECUTION REQUIRED)
**Status**: ✅✅⬜⬜ 2/4 complete (50%)
**Priority**: P0 (TESTING FOUNDATION)
**Dependencies**: Day 0 blockers resolved ✅

**⚠️ SEQUENTIAL EXECUTION**: Tasks MUST be executed one at a time to avoid API concurrency errors. Complete each task fully before starting the next.

**Rationale**: Establish test-driven development infrastructure for Week 2+ work. Pragmatic approach focusing on minimal viable testing setup.

---

### DEV-W2-TDD-001: Minimal QA Structure & Documentation ✅ **COMPLETE**

**Priority**: P0 (FOUNDATION)
**Estimated Time**: 1 hour
**Owner**: QA Lead + Engineering
**Status**: ✅ COMPLETE (Week 2 Day 2.5)
**Completion Date**: October 17, 2025
**Dependencies**: None

**Description**: Create lightweight, maintainable QA documentation structure

**Completed Work**:
- ✅ Created `Karvia_OKR_Product_Planning/QA/` folder structure
- ✅ Wrote `QA/README.md` - Testing philosophy overview (200+ lines)
- ✅ Created `QA/templates/weekly-test-plan.md` - Reusable template for future weeks
- ✅ Created `scripts/pre-deploy-checklist.md` - Manual deployment checklist

**Folder Structure Created**:
```
QA/
├── README.md                      # Testing strategy & philosophy
└── templates/
    └── weekly-test-plan.md        # TEMPLATE: Clone per week
```

**Deliverables**:
- ✅ QA folder structure with comprehensive README (200+ lines)
- ✅ Reusable weekly test plan template
- ✅ Pre-deployment checklist
- ✅ Test Pyramid strategy documented (80% unit, 15% integration, 5% E2E)
- ✅ Testing best practices and anti-patterns
- ✅ Framework choices documented (Jest, Playwright, Supertest)

**Files Created**:
- `Karvia_OKR_Product_Planning/QA/README.md` (200+ lines)
- `Karvia_OKR_Product_Planning/QA/templates/weekly-test-plan.md`
- `scripts/pre-deploy-checklist.md`

**Reference**: WEEK_2_TDD_INTEGRATION_PLAN.md (Phase 2, TDD-001)

---

### DEV-W2-TDD-002: Jest Minimal Setup ✅ **COMPLETE**

**Priority**: P0 (FOUNDATION)
**Estimated Time**: 1.5 hours
**Owner**: Engineering
**Status**: ✅ COMPLETE (Week 2 Day 2.5)
**Completion Date**: October 17, 2025
**Dependencies**: None

**Description**: Install and configure Jest with single configuration

**Completed Work**:
- ✅ Installed dependencies: `jest`, `@types/jest`, `supertest`
- ✅ Updated `jest.config.js` with test directory configuration
- ✅ Created `tests/setup.js` with global test environment setup
- ✅ Added test scripts to `package.json`:
  - `"test:watch": "jest --watch"`
  - `"test:coverage": "jest --coverage"`
- ✅ Configured 80% coverage threshold (existing in jest.config.js)
- ✅ Created test folder structure: `tests/unit/{services,utils,middleware}/`

**Deliverables**:
- ✅ Jest working with `npm test` (existing script)
- ✅ Coverage reports configured (text, lcov, html)
- ✅ Test watch mode available (`npm run test:watch`)
- ✅ Coverage threshold: 80% lines, 80% functions, 70% branches
- ✅ Global test setup with logger mocking
- ✅ Test environment configured for Node.js

**Files Created**:
- `tests/setup.js` (35 lines) - Global test configuration and mocks
- `tests/unit/services/` - Directory for service tests
- `tests/unit/utils/` - Directory for utility tests
- `tests/unit/middleware/` - Directory for middleware tests

**Files Modified**:
- `jest.config.js` - Added `tests/setup.js` to setupFilesAfterEnv
- `package.json` - Added `test:watch` and `test:coverage` scripts

**NPM Packages Installed**:
- `jest@^29.7.0`
- `@types/jest@^29.5.11`
- `supertest@^6.3.3`

**Configuration Highlights**:
- Logger mocking to prevent console spam during tests
- 10 second global timeout for async operations
- Automatic cleanup with `clearMocks` and `restoreMocks`
- Test match patterns for `.test.js` and `.spec.js` files

**Deferred to Week 3**:
- Separate configs (unit vs integration)
- MongoDB Memory Server
- Advanced mocking infrastructure

**Reference**: WEEK_2_TDD_INTEGRATION_PLAN.md (Phase 2, TDD-002)

---

### DEV-W2-TDD-003: Critical Unit Tests for Day 1 Work ⬜ **NEXT TASK**

**Priority**: P0 (TESTING)
**Estimated Time**: 2.5 hours
**Owner**: Engineering
**Status**: ⬜ NOT STARTED - **EXECUTE THIS TASK NEXT (SEQUENTIAL)**
**Dependencies**: DEV-W2-TDD-002 (Jest setup) ✅ COMPLETE

**⚠️ EXECUTION ORDER**: This is task 3 of 4. Complete ALL subtasks below sequentially (one test file at a time) before moving to TDD-004.

**Description**: Write unit tests ONLY for Week 2 Day 1 completed work (retroactive)

**⚠️ SEQUENTIAL SUBTASK EXECUTION (DO ONE AT A TIME)**:

**Subtask 1 of 4**: **Test SecretsManager Service** (50 lines, 5 tests):
  - Test `get()`, `has()`, `redact()`, `getStatus()`
  - Cover critical paths only
  - File: `tests/unit/services/SecretsManager.test.js`
  - **COMPLETE THIS FULLY before moving to Subtask 2**

**Subtask 2 of 4**: **Test Winston Logger Service** (60 lines, 6 tests):
  - Test log levels work
  - Test sensitive data sanitization
  - Mock filesystem
  - File: `tests/unit/services/logger.test.js`
  - **COMPLETE THIS FULLY before moving to Subtask 3**

**Subtask 3 of 4**: **Test Custom Error Classes** (80 lines, 8 tests):
  - Test AppError base class
  - Test 3 critical error classes (ValidationError, AuthenticationError, NotFoundError)
  - Test `toJSON()` serialization
  - **Defer other 7 error classes to Week 3**
  - File: `tests/unit/utils/errors.test.js`
  - **COMPLETE THIS FULLY before moving to Subtask 4**

**Subtask 4 of 4**: **Test Error Handler Middleware** (100 lines, 10 tests):
  - Test operational vs programming error distinction
  - Test Mongoose ValidationError handling
  - Test JWT error handling
  - Test 404 handler
  - File: `tests/unit/middleware/errorHandler.test.js`
  - **COMPLETE THIS FULLY before moving to TDD-004**

**Target Coverage**: 70-75% for Day 1 work (not 85% yet)

**Deliverables**:
- 290 lines of tests
- 29 unit tests
- Foundation for future test writing

**Files to Create**:
- `tests/unit/services/SecretsManager.test.js` (~50 lines)
- `tests/unit/services/logger.test.js` (~60 lines)
- `tests/unit/utils/errors.test.js` (~80 lines)
- `tests/unit/middleware/errorHandler.test.js` (~100 lines)

**Reference**: WEEK_2_TDD_INTEGRATION_PLAN.md (Phase 2, TDD-003)

---

### DEV-W2-TDD-004: Simple Pre-Deploy Script ⬜ **FINAL TASK**

**Priority**: P0 (AUTOMATION)
**Estimated Time**: 1 hour
**Owner**: DevOps + Engineering
**Status**: ⬜ NOT STARTED - **EXECUTE AFTER TDD-003 COMPLETE**
**Dependencies**: DEV-W2-TDD-003 (tests need to exist) ⬜ PENDING

**⚠️ EXECUTION ORDER**: This is task 4 of 4 (FINAL). Only execute after TDD-003 is 100% complete.

**Description**: Basic automation for deployment safety (manual decision)

**Tasks**:
- [ ] Create `scripts/pre-deploy.sh` (80 lines):
  ```bash
  #!/bin/bash
  # 1. Check uncommitted changes
  # 2. Run tests (npm test)
  # 3. Check coverage (optional warning, not blocking)
  # 4. Scan for exposed secrets (grep for common patterns)
  # 5. Summary
  ```
- [ ] Make executable: `chmod +x scripts/pre-deploy.sh`
- [ ] Test script execution
- [ ] Update README with usage

**Deliverables**:
- Simple script that catches obvious issues
- Manual deployment decision (not blocking)

**Deferred to Week 3**:
- ESLint integration
- Security audit integration
- Coverage gates (enforce 80%)

**Files to Create**:
- `scripts/pre-deploy.sh` (~80 lines)

**Files to Modify**:
- `README.md` (add testing workflow section)

**Reference**: WEEK_2_TDD_INTEGRATION_PLAN.md (Phase 2, TDD-004)

---

## 📅 DAY 3: Testing Infrastructure - 8 hours

**Date**: Saturday, October 19, 2025
**Tasks**: 3 tasks
**Status**: ⬜⬜⬜ 0/3 complete (0%)
**Priority**: P0 (QUALITY ASSURANCE)

---

### DEV-W2-013: Integration Test Suite for Assessment Flow ⬜

**Priority**: P0 (BLOCKING)
**Estimated Time**: 4 hours
**Owner**: QA + Engineering
**Status**: ⬜ NOT STARTED

**Description**: Complete end-to-end integration tests for Week 1 features

**Current State**: 312 test files exist but incomplete coverage

**Tasks**:
- [ ] Set up test database (MongoDB Memory Server):
  - Install: `npm install --save-dev mongodb-memory-server`
  - Create test database setup/teardown
  - Separate test DB from development DB
- [ ] Create test fixtures:
  - Test users (all 5 roles)
  - Test businesses (2-3 businesses)
  - Test templates (SSI template with questions)
  - Test questions (sample 20 questions)
- [ ] Test: **Template Creation Flow**:
  - POST /api/assessment-templates
  - GET /api/assessment-templates (verify created)
  - GET /api/assessment-templates/:id/with-questions
  - Verify questions loaded correctly
- [ ] Test: **Invitation Flow** (CRITICAL - ISS-024):
  - POST /api/invitations/create (batch)
  - GET /api/invitations (list created)
  - GET /api/invitations/validate/:token (public)
  - POST /api/invitations/accept/:token (public)
  - Verify account created after acceptance
  - Verify invitation marked as used
- [ ] Test: **Assessment Taking**:
  - GET /api/assessments/invitation/:token/questions
  - POST /api/assessments/submit
  - Verify scores calculated correctly
  - Verify dimension_scores saved
- [ ] Test: **Assessment Results**:
  - GET /api/assessments/my-assessments
  - GET /api/assessments/:id/results
  - GET /api/assessments/team/:business_id
  - Verify weak areas identified
  - Verify team aggregation works
- [ ] Test: **Email Sending** (mock Mailjet):
  - Mock Mailjet API calls
  - Verify invitation emails sent
  - Verify email template used
  - Verify email contains invitation link
- [ ] Test: **Role-Based Access Control**:
  - Consultant: Can access multiple businesses
  - Business Owner: Can create templates, invitations
  - Manager: Can view direct reports only
  - Employee: Can view own assessments only
  - Executive: Can view all business assessments
- [ ] Test: **Rate Limiting**:
  - Verify limiters enforced (hit limit, get 429)
  - Test: invitationValidateLimiter (20/hour)
  - Test: invitationAcceptLimiter (5/hour)
  - Test: signup limiter (10/15min)
- [ ] Test: **Error Cases**:
  - Invalid data (400 errors)
  - Expired tokens (401 errors)
  - Missing permissions (403 errors)
  - Duplicate email (409 error)
  - Rate limit exceeded (429 error)
- [ ] Test: **Database Transactions**:
  - Verify rollback on errors
  - Verify atomic operations
- [ ] Run tests in CI environment:
  - Add test command to package.json
  - Verify tests pass in clean environment
  - Add to GitHub Actions (optional)

**Acceptance Criteria**:
- [ ] 100% coverage of critical user flows
- [ ] Tests run in < 2 minutes
- [ ] All async operations properly awaited
- [ ] Database cleaned up after each test
- [ ] Tests pass in CI environment
- [ ] No test pollution (tests independent)
- [ ] Clear test output (pass/fail, timing)

**Files to Create**:
- `tests/integration/assessment-flow.test.js` (~400 lines)
- `tests/integration/invitation-flow.test.js` (~300 lines) - **ISS-024**
- `tests/integration/role-access.test.js` (~200 lines)
- `tests/fixtures/users.fixture.js` (~100 lines)
- `tests/fixtures/businesses.fixture.js` (~80 lines)
- `tests/fixtures/templates.fixture.js` (~120 lines)
- `tests/fixtures/questions.fixture.js` (~150 lines)
- `tests/setup.js` (MongoDB Memory Server setup, ~80 lines)

**Customer Impact**: Confidence in production deployment, regression prevention

**Reference**:
- MASTER_DEV_LIST.md:1696-1726
- ISS-024 (MASTER_ISSUES_LIST.md:443-457)
- PRE_WEEK_2_TODO_CHECKLIST.md (Task 4 - deferred to this task)

---

### DEV-W2-014: Unit Tests for Services & Utilities ⬜

**Priority**: P1 (HIGH)
**Estimated Time**: 3 hours
**Owner**: QA + Engineering
**Status**: ⬜ NOT STARTED

**Description**: Unit tests for all service layers and utilities

**Tasks**:
- [ ] Test **SSIScoringService** (all scoring logic):
  - `calculateDimensionScores()` - Weighted averages
  - `calculateCompositeScore()` - Overall score
  - `identifyWeakAreas()` - Scores < 5.0
  - `compareWithPrevious()` - Score changes
  - `aggregateTeamScores()` - Team averages
  - Edge cases: Empty responses, missing data
- [ ] Test **MailjetService** (mock API calls):
  - `sendInvitationEmail()` - Email creation
  - `sendAssessmentCompleteEmail()` - Completion notification
  - Mock Mailjet responses (success, failure)
  - Verify error handling
- [ ] Test **BusinessCreationService**:
  - `createBusiness()` - With defaults
  - Size category calculation (0-50, 51-200, 201-500, 501+)
  - Number sanitization (DEV-W2-005 fixes)
  - Validation errors
- [ ] Test **SecretsManager** (Week 2 Day 1):
  - `get()` - Retrieve secret
  - `has()` - Check existence
  - `redact()` - Mask for logging
  - `getStatus()` - Secrets status
  - `validate()` - Secret strength
- [ ] Test **Logger Service** (Week 2 Day 1):
  - All log levels (error, warn, info, http, debug)
  - Specialized methods (security, business, db, api)
  - Sensitive data sanitization
  - File rotation (mock filesystem)
- [ ] Test **Validators** (email, password, business):
  - Email validator: Valid, invalid, disposable domains
  - Password validator: Strength scoring, requirements
  - Business validator: All field validations
- [ ] Test **Error Classes** (all error types):
  - ValidationError
  - AuthenticationError
  - AuthorizationError
  - NotFoundError
  - ConflictError
  - Each error has correct statusCode and code
- [ ] Test **Auth Middleware**:
  - Valid token → req.user populated
  - Invalid token → 401 error
  - Expired token → 401 error
  - Missing token → 401 error
  - IAM fallback works
- [ ] Test **Role Guards** (all role combinations):
  - requireRole(['CONSULTANT']) - Allow/deny
  - requireBusinessAccess() - Verify business_id
  - requireManagerOrHigher() - Hierarchy check
  - All 5 roles tested
- [ ] Achieve > 80% code coverage

**Acceptance Criteria**:
- [ ] All services have unit tests
- [ ] All edge cases covered
- [ ] Mock external dependencies (Mailjet, database)
- [ ] Tests run in < 30 seconds
- [ ] Code coverage > 80% (overall)
- [ ] Coverage report generated
- [ ] No skipped tests
- [ ] Clear test descriptions

**Files to Create**:
- `tests/unit/services/SSIScoringService.test.js` (~300 lines)
- `tests/unit/services/MailjetService.test.js` (~150 lines)
- `tests/unit/services/BusinessCreationService.test.js` (~200 lines)
- `tests/unit/services/SecretsManager.test.js` (~150 lines)
- `tests/unit/services/logger.test.js` (~100 lines)
- `tests/unit/validators/email.test.js` (~80 lines)
- `tests/unit/validators/password.test.js` (~100 lines)
- `tests/unit/validators/business.test.js` (~80 lines)
- `tests/unit/middleware/authGuards.test.js` (~200 lines)
- `tests/unit/middleware/roleGuards.test.js` (~150 lines)
- `tests/unit/utils/errors.test.js` (~100 lines)

**Customer Impact**: Code quality and maintainability

**Reference**: MASTER_DEV_LIST.md:1727-1754

---

### DEV-W2-015: Test Coverage Reports & CI Integration ⬜

**Priority**: P1 (HIGH)
**Estimated Time**: 1 hour
**Owner**: DevOps
**Status**: ⬜ NOT STARTED

**Description**: Set up test coverage reporting and CI pipeline

**Tasks**:
- [ ] Install nyc (Istanbul) for coverage:
  - `npm install --save-dev nyc`
- [ ] Configure coverage thresholds in `.nycrc`:
  ```json
  {
    "all": true,
    "check-coverage": true,
    "branches": 80,
    "lines": 80,
    "functions": 80,
    "statements": 80,
    "reporter": ["text", "html", "lcov"],
    "exclude": [
      "tests/**",
      "coverage/**",
      "node_modules/**"
    ]
  }
  ```
- [ ] Generate HTML coverage reports:
  - Reports in `coverage/` directory
  - Open `coverage/index.html` in browser
- [ ] Add npm scripts to `package.json`:
  - `"test": "jest"` - Run all tests
  - `"test:unit": "jest tests/unit"` - Unit tests only
  - `"test:integration": "jest tests/integration"` - Integration tests only
  - `"test:coverage": "nyc npm test"` - With coverage
  - `"test:watch": "jest --watch"` - Watch mode
- [ ] Set up GitHub Actions workflow (optional):
  - Create `.github/workflows/test.yml`
  - Run tests on push and PR
  - Upload coverage to Codecov (optional)
- [ ] Configure pre-commit hooks:
  - Install husky: `npm install --save-dev husky`
  - Run tests before commit
  - Prevent commits if tests fail
- [ ] Document testing workflow in README:
  - How to run tests
  - How to view coverage
  - How to add new tests

**Acceptance Criteria**:
- [ ] Coverage reports generated (HTML + terminal)
- [ ] Tests fail if coverage < 80%
- [ ] npm scripts working:
  - `npm test` - All tests
  - `npm run test:unit` - Unit tests
  - `npm run test:integration` - Integration tests
  - `npm run test:coverage` - With coverage report
- [ ] Coverage report shows all files
- [ ] Pre-commit hooks working (optional)
- [ ] GitHub Actions running (optional)
- [ ] README documents testing workflow

**Files to Create**:
- `.nycrc` (~15 lines)
- `.github/workflows/test.yml` (~50 lines, optional)
- `.husky/pre-commit` (optional)

**Files to Modify**:
- `package.json` (add test scripts)
- `README.md` (testing documentation)

**Coverage Report Example**:
```
File                           | % Stmts | % Branch | % Funcs | % Lines |
-------------------------------|---------|----------|---------|---------|
All files                      |   85.2  |   82.1   |   88.3  |   85.0  |
 server/services               |   92.1  |   88.5   |   95.2  |   92.0  |
  SSIScoringService.js         |   94.3  |   90.1   |   96.5  |   94.1  |
  MailjetService.js            |   88.7  |   85.2   |   92.3  |   88.5  |
 server/middleware             |   87.3  |   83.2   |   90.1  |   87.0  |
  authGuards.js                |   90.2  |   86.5   |   93.1  |   90.0  |
  roleGuards.js                |   84.5  |   80.0   |   87.2  |   84.0  |
```

**Customer Impact**: Automated quality gates, confidence in code changes

**Reference**: MASTER_DEV_LIST.md:1755-1779

---

## 📅 DAY 4: Production Configuration & Monitoring - 8 hours

**Date**: Sunday, October 20, 2025
**Tasks**: 4 tasks
**Status**: ⬜⬜⬜⬜ 0/4 complete (0%)
**Priority**: P0-P1 (DEPLOYMENT CRITICAL)

---

### DEV-W2-016: Health Check Endpoints ⬜

**Priority**: P0 (BLOCKING DEPLOYMENT)
**Estimated Time**: 2 hours
**Owner**: Backend Team
**Status**: ⬜ NOT STARTED

**Description**: Implement health check endpoints for monitoring

**Tasks**:
- [ ] Create health check routes: `server/routes/health.js`
- [ ] **GET /health** - Basic health check:
  - Returns 200 OK if app is running
  - Simple response: `{ "status": "healthy" }`
- [ ] **GET /health/liveness** - Liveness probe:
  - Is app process running?
  - Returns 200 if alive, 503 if dead
  - Used by Kubernetes to restart dead containers
- [ ] **GET /health/readiness** - Readiness probe:
  - Can app serve traffic?
  - Checks: Database connected, critical services available
  - Returns 200 if ready, 503 if not ready
  - Used by load balancers to route traffic
- [ ] Check database connection:
  - Ping MongoDB
  - Measure latency
  - Return connection status
- [ ] Check Redis connection (if enabled via feature flags):
  - Only if `FEATURE_REDIS_ENABLED=true`
  - Return status or skip if disabled
- [ ] Check external services:
  - Mailjet reachable (optional, doesn't block readiness)
  - OpenAI reachable (optional)
- [ ] Return detailed status JSON:
  - Overall status
  - Component statuses
  - Latencies
  - Timestamp
- [ ] Add response time metrics:
  - Track health check duration
  - Log slow health checks
- [ ] Document health check endpoints:
  - Add to API docs
  - Add to deployment guide

**Detailed Response Examples**:

**GET /health** (Basic):
```json
{
  "status": "healthy",
  "timestamp": "2025-10-20T15:30:00.000Z",
  "uptime": 86400,
  "version": "1.0.0"
}
```

**GET /health/liveness**:
```json
{
  "status": "alive",
  "timestamp": "2025-10-20T15:30:00.000Z"
}
```

**GET /health/readiness** (Detailed):
```json
{
  "status": "ready",
  "timestamp": "2025-10-20T15:30:00.000Z",
  "components": {
    "database": {
      "status": "healthy",
      "latency": "12ms",
      "connected": true
    },
    "redis": {
      "status": "disabled",
      "enabled": false
    },
    "mailjet": {
      "status": "healthy",
      "reachable": true
    }
  },
  "checks": {
    "passed": 2,
    "failed": 0,
    "total": 2
  }
}
```

**Acceptance Criteria**:
- [ ] /health returns 200 if healthy, 503 if not
- [ ] /health/liveness checks app process (always 200 unless crashed)
- [ ] /health/readiness checks dependencies (DB, Redis if enabled)
- [ ] Response includes component status and latencies
- [ ] Kubernetes-ready health checks (liveness + readiness)
- [ ] Health checks don't timeout (< 5s response)
- [ ] Documented in API docs

**Files to Create**:
- `server/routes/health.js` (~180 lines)

**Customer Impact**: Essential for production monitoring and load balancing

**Reference**: MASTER_DEV_LIST.md:1784-1810

---

### DEV-W2-017: Rate Limiting Verification & Enhancement ⬜

**Priority**: P1 (HIGH SECURITY)
**Estimated Time**: 2 hours
**Owner**: Backend Team
**Status**: ⬜ NOT STARTED

**⚠️ NOTE**: This overlaps with [PRE_WEEK_2_TODO_CHECKLIST.md Task 3](./PRE_WEEK_2_TODO_CHECKLIST.md#-task-3-verify-rate-limiter-configuration).
**Complete Pre-Week 2 Task 3 first, then enhance with additional limiters here.**

**Description**: Verify rate limiting works, add missing endpoint limiters

**Current State**:
- Rate limiting created in Week 1 Day 0 (5 limiters)
- Pre-Week 2 Task 3 verifies invitation limiters
- This task adds additional limiters and testing

**Tasks**:
- [ ] ✅ **Verify existing limiters** (from Pre-Week 2 Task 3):
  - invitationValidateLimiter (20/hour)
  - invitationAcceptLimiter (5/hour)
  - signupLimiter (10/15min)
  - generalLimiter (100/15min)
  - authLimiter (5/15min on login)
- [ ] Test all 5 existing rate limiters:
  - Automated tests (not just manual)
  - Verify IPv4 and IPv6 support
  - Verify rate limit headers in responses
- [ ] **Add rate limiting to missing endpoints**:
  - **Template creation**: 10 per hour per user
    - POST /api/assessment-templates
  - **Question bulk operations**: 5 per hour per user
    - POST /api/assessment-questions/bulk (if exists)
  - **Assessment submission**: 3 per hour per user
    - POST /api/assessments/submit
  - **Team results access**: 20 per hour per user
    - GET /api/assessments/team/:business_id
- [ ] Configure Redis for distributed rate limiting (optional):
  - If Redis enabled via feature flags
  - Use Redis store instead of in-memory
  - Benefits: Rate limits persist across server restarts
  - Benefits: Rate limits shared across multiple instances
- [ ] Add rate limit headers to all responses:
  - `X-RateLimit-Limit` - Max requests allowed
  - `X-RateLimit-Remaining` - Requests remaining
  - `X-RateLimit-Reset` - Time when limit resets
- [ ] Test rate limit enforcement:
  - Automated tests for each limiter
  - Verify 429 errors returned when exceeded
  - Verify retry-after header
- [ ] Document rate limit policies:
  - Add to API documentation
  - Add to DEPLOYMENT.md
  - Add to public API docs

**Acceptance Criteria**:
- [ ] All public endpoints rate limited
- [ ] All authenticated endpoints have appropriate limits
- [ ] Rate limit headers in all responses
- [ ] 429 errors returned when exceeded with retry-after
- [ ] Automated tests verify rate limiting
- [ ] Redis integration optional (works without Redis)
- [ ] Documentation complete

**Files to Modify**:
- `server/middleware/rateLimiting.js` (add new limiters)
- `server/routes/assessmentTemplates.js` (add template limiter)
- `server/routes/assessments.js` (add submission + team limiters)

**Files to Create**:
- `tests/integration/rate-limiting.test.js` (~150 lines)

**Rate Limit Configuration Examples**:
```javascript
// Template creation limiter
const templateCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 templates per hour
  keyGenerator: (req) => req.user.id, // Per user, not IP
  message: {
    success: false,
    message: 'Too many templates created, please try again later',
    retryAfter: '1 hour'
  }
});

// Assessment submission limiter
const assessmentSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 submissions per hour
  keyGenerator: (req) => req.user.id,
  message: {
    success: false,
    message: 'Too many assessment submissions, please try again later',
    retryAfter: '1 hour'
  }
});
```

**Customer Impact**: DDoS protection, abuse prevention, fair usage

**Reference**:
- MASTER_DEV_LIST.md:1811-1839
- PRE_WEEK_2_TODO_CHECKLIST.md#task-3 (verify first)

---

### DEV-W2-018: Configure Production Mailjet ⬜

**Priority**: P0 (BLOCKING)
**Estimated Time**: 1 hour
**Owner**: Engineering Lead
**Status**: ⬜ NOT STARTED

**⚠️ NOTE**: This addresses ISS-028 (Email Notification System Missing) - deferred from Pre-Week 2.

**Description**: Configure real Mailjet API keys, test email sending

**Current State**:
- Mailjet service created in Week 1 (mock mode)
- Invitations create links but don't send emails
- Workaround: Manual link sharing

**Tasks**:
- [ ] Sign up for Mailjet account (if not already done):
  - https://www.mailjet.com/
  - Free tier: 6,000 emails/month
- [ ] Verify sender email address:
  - Add `rsm@karvia.ai` (or configured email)
  - Verify domain ownership (DNS records)
  - Wait for verification approval
- [ ] Get production API key and secret:
  - Mailjet dashboard → API Keys
  - Create new API key pair
  - Copy both key and secret
- [ ] Update `.env` with real credentials:
  - `MAILJET_API_KEY=<your-api-key>`
  - `MAILJET_API_SECRET=<your-api-secret>`
  - `MAILJET_FROM_EMAIL=rsm@karvia.ai`
  - `MAILJET_FROM_NAME=Karvia Business`
- [ ] Test email sending (invitation flow):
  - Create test invitation
  - Verify email sent via Mailjet API
  - Check Mailjet dashboard for delivery status
  - Verify email received in inbox (not spam)
- [ ] Set up email templates in Mailjet dashboard:
  - Invitation template with branding
  - Assessment complete template
  - Welcome email template
  - Use Mailjet's template editor (optional)
- [ ] Configure email tracking:
  - Open tracking (did recipient open email?)
  - Click tracking (did recipient click link?)
  - Unsubscribe tracking
  - Configure in Mailjet dashboard
- [ ] Add error handling for email failures:
  - Update `server/services/mailjetService.js`
  - Catch API errors gracefully
  - Log email failures
  - Don't block invitation creation if email fails
  - Return success even if email fails (best effort)
- [ ] Document email configuration:
  - Add to DEPLOYMENT.md
  - Add to README.md
  - Document environment variables

**Acceptance Criteria**:
- [ ] Real emails sent via Mailjet (not mock)
- [ ] Email delivery confirmed in inbox
- [ ] Tracking working (opens/clicks visible in Mailjet dashboard)
- [ ] Error handling for failures (invitation still created)
- [ ] Email templates use Karvia branding
- [ ] Documentation updated with setup instructions
- [ ] Test with real invitation flow end-to-end

**Files to Modify**:
- `.env` (add real Mailjet credentials)
- `server/services/mailjetService.js` (verify/enhance error handling)
- `DEPLOYMENT.md` (document email setup)
- `README.md` (add email configuration section)

**Email Configuration Example**:
```bash
# .env
MAILJET_API_KEY=[REDACTED]
MAILJET_API_SECRET=[REDACTED]
MAILJET_FROM_EMAIL=rsm@karvia.ai
MAILJET_FROM_NAME=Karvia Business
MAILJET_ENABLED=true
```

**Customer Impact**:
- Real email invitations working (no manual link sharing)
- Professional branded emails
- Email tracking and analytics

**Reference**:
- MASTER_DEV_LIST.md:1840-1868
- ISS-028 (MASTER_ISSUES_LIST.md)
- PRE_WEEK_2_TODO_CHECKLIST.md (Task 5 - deferred to this task)

---

### DEV-W2-019: Environment-Specific Configuration ⬜

**Priority**: P1 (HIGH)
**Estimated Time**: 3 hours
**Owner**: DevOps + Backend
**Status**: ⬜ NOT STARTED

**Description**: Create proper environment configs (dev, staging, production)

**Current State**:
- One `.env` for all environments
- Week 2 Day 1 created `.env.development` and `.env.production.example`
- Need to complete environment strategy

**Tasks**:
- [ ] Create environment files:
  - `.env.development` (local dev) - **✅ Exists from Week 2 Day 1**
  - `.env.staging` (testing environment) - **NEW**
  - `.env.production.example` (template) - **✅ Exists from Week 2 Day 1**
  - Do NOT commit `.env.production` (real secrets)
- [ ] Update config loader to read env-specific files:
  - Modify `server/config/index.js`
  - Auto-load correct env file based on `NODE_ENV`
  - Precedence: `.env.[NODE_ENV].local` > `.env.[NODE_ENV]` > `.env`
- [ ] Add environment validation:
  - Fail if wrong env (e.g., production without all required vars)
  - Fail if secrets are weak in production
  - Warn in development if using production URLs
- [ ] **Configure CORS per environment**:
  - Development: Allow `http://localhost:*`
  - Staging: Allow staging frontend URL
  - Production: Strict origin whitelist only
  - Update `server/index.js` CORS config
- [ ] **Configure logging per environment**:
  - Development: Console + file, debug level
  - Staging: File only, info level
  - Production: File only, warn level, JSON format
  - Update `server/services/logger.js` config
- [ ] **Configure rate limits per environment**:
  - Development: Relaxed (100/min)
  - Staging: Moderate (50/min)
  - Production: Strict (as configured in Week 1)
  - Update `server/middleware/rateLimiting.js`
- [ ] Create deployment scripts per environment:
  - `scripts/deploy-staging.sh`
  - `scripts/deploy-production.sh`
  - Include environment validation
  - Include pre-deployment checks
- [ ] Document environment setup:
  - Update DEPLOYMENT.md
  - Add environment variables table
  - Add setup instructions per environment

**Environment File Examples**:

**`.env.staging`** (NEW):
```bash
NODE_ENV=staging
PORT=8080

# Database
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@staging.mongodb.net/karvia_staging

# JWT Secrets (staging-specific)
JWT_SECRET=<staging-secret-64-chars>
SESSION_SECRET=<staging-secret-64-chars>

# APIs (sandbox/test keys)
OPENAI_API_KEY=[REDACTED]
MAILJET_API_KEY=<test-api-key>
MAILJET_API_SECRET=<test-api-secret>
MAILJET_FROM_EMAIL=staging@karvia.ai

# CORS
CORS_ORIGIN=https://staging.karvia.ai

# Logging
LOG_LEVEL=info
LOG_FILE=true

# Rate Limiting (moderate)
RATE_LIMIT_MAX=50
RATE_LIMIT_WINDOW_MS=60000

# Feature Flags
FEATURE_REDIS_ENABLED=true
FEATURE_IBRAIN_ENABLED=false
```

**Acceptance Criteria**:
- [ ] 3 environment configs working (dev, staging, prod)
- [ ] Automatic env detection based on `NODE_ENV`
- [ ] Production validates all required vars (fails fast if missing)
- [ ] CORS configured per environment
- [ ] Logging configured per environment
- [ ] Rate limits configured per environment
- [ ] Easy to add new environments (just create `.env.newenv`)
- [ ] Documentation complete

**Files to Create**:
- `.env.staging` (~50 lines)
- `scripts/deploy-staging.sh` (~100 lines)
- `scripts/deploy-production.sh` (~150 lines)

**Files to Modify**:
- `server/config/index.js` (~100 lines - complete rewrite)
- `server/index.js` (use config for CORS)
- `server/services/logger.js` (use config for log level)
- `server/middleware/rateLimiting.js` (use config for limits)
- `DEPLOYMENT.md` (document environment setup)

**Customer Impact**: Clean deployment process, environment isolation, easy scaling

**Reference**: MASTER_DEV_LIST.md:1869-1900

---

## 📅 DAY 5: Code Quality & Documentation - 8 hours

**Date**: Monday, October 21, 2025
**Tasks**: 3 tasks
**Status**: ⬜✅⬜ 1/3 complete (33%)
**Priority**: P0-P1 (PRODUCTION READINESS)

---

### DEV-W2-020: Production Sync Script & Workflow ✅ **COMPLETE**

**Priority**: P0 (CRITICAL - Infrastructure)
**Estimated Time**: 1 hour
**Owner**: DevOps + Engineering Lead
**Status**: ✅ **COMPLETE** (Week 2 Day 1)

**Completed Work**:
- ✅ Created `scripts/sync-production.sh` script
- ✅ Safety checks (uncommitted changes, branch validation)
- ✅ Automatic planning doc removal
- ✅ Colored output and progress indicators
- ✅ Made script executable (chmod +x)
- ✅ Updated README with development workflow
- ✅ Documented branch strategy

**Files Created**:
- `scripts/sync-production.sh` (150 lines)
- `Karvia_OKR_Product_Planning/PRODUCTION_BRANCH_GUIDE.md`

**Files Modified**:
- `README.md` (workflow section added)

**Usage**: `./scripts/sync-production.sh`

**Customer Impact**: Clean deployments, no internal docs exposed, one-command deploys

**Reference**: MASTER_DEV_LIST.md:1905-1935

---

### DEV-W2-021: Code Audit & Hardcoding Removal ⬜

**Priority**: P0 (CRITICAL)
**Estimated Time**: 3 hours
**Owner**: Engineering Lead
**Status**: ⬜ NOT STARTED

**Description**: Remove ALL hardcoded values and magic numbers

**Tasks**:
- [ ] **Scan codebase for hardcoded values**:
  - Search for localhost references: `grep -r "localhost" server/ client/`
  - Search for port numbers: `grep -r ":808[0-9]" server/`
  - Search for magic numbers: `grep -r "\b[0-9]\{2,\}" server/ | grep -v node_modules`
  - Search for email addresses: `grep -r "@.*\.com" server/ client/`
  - Search for URLs: `grep -r "http://" server/ client/`
  - Search for hardcoded arrays: Look for inline arrays in code
- [ ] Create constants file: `server/constants/index.js`:
  - `RATE_LIMITS` - All rate limit configs
  - `TIMEOUTS` - All timeout values
  - `PAGINATION` - Default page sizes
  - `EMAIL_CONFIG` - Email templates, subjects
  - `VALIDATION_RULES` - Password requirements, etc.
  - `BUSINESS_SIZES` - Size category thresholds
  - `ASSESSMENT_CONFIG` - Question counts, dimension weights
  - `USER_ROLES` - Role enum (single source of truth)
- [ ] Move all config to environment variables:
  - Replace hardcoded URLs with `process.env.API_URL`
  - Replace hardcoded ports with `process.env.PORT`
  - Replace hardcoded emails with `process.env.FROM_EMAIL`
  - Add all new env vars to `.env.example`
- [ ] Replace hardcoded arrays with database queries:
  - Example: Industry list → query from database
  - Example: Role list → import from constants
- [ ] Document all configuration options:
  - Update README.md with all env vars
  - Document all constants
  - Explain configuration hierarchy
- [ ] Test with different configurations:
  - Change port, verify app works
  - Change CORS origin, verify access control
  - Change email address, verify emails work

**Hardcoding Examples to Fix**:

**BEFORE** (Bad):
```javascript
// server/index.js
const PORT = 8080; // ❌ Hardcoded

// server/routes/invitations.js
if (emailDomain === 'gmail.com') { } // ❌ Hardcoded

// server/services/BusinessCreationService.js
if (employeeCount < 50) { size = 'small'; } // ❌ Magic number

// client/js/api.js
const API_URL = 'http://localhost:8080'; // ❌ Hardcoded
```

**AFTER** (Good):
```javascript
// server/constants/index.js
module.exports = {
  BUSINESS_SIZES: {
    SMALL_THRESHOLD: 50,
    MEDIUM_THRESHOLD: 200,
    LARGE_THRESHOLD: 500
  },
  USER_ROLES: {
    CONSULTANT: 'CONSULTANT',
    BUSINESS_OWNER: 'BUSINESS_OWNER',
    EXECUTIVE: 'EXECUTIVE',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE'
  },
  EMAIL_PROVIDERS: {
    DISPOSABLE: ['tempmail.com', 'guerrillamail.com']
  }
};

// server/index.js
const PORT = process.env.PORT || 8080; // ✅ Configurable

// server/routes/invitations.js
const { EMAIL_PROVIDERS } = require('../constants');
if (EMAIL_PROVIDERS.DISPOSABLE.includes(emailDomain)) { } // ✅ From constants

// server/services/BusinessCreationService.js
const { BUSINESS_SIZES } = require('../constants');
if (employeeCount < BUSINESS_SIZES.SMALL_THRESHOLD) { } // ✅ Named constant

// client/js/api.js
const API_URL = window.location.origin; // ✅ Dynamic
```

**Acceptance Criteria**:
- [ ] Zero hardcoded URLs or ports (all from env or constants)
- [ ] All magic numbers replaced with named constants
- [ ] Configuration documented in README
- [ ] Code passes linter (no hardcoded strings warnings)
- [ ] No hardcoded test data in production code
- [ ] All env vars in `.env.example`
- [ ] Constants file has JSDoc comments

**Files to Create**:
- `server/constants/index.js` (~200 lines)
- `server/constants/roles.js` (~30 lines)
- `server/constants/validation.js` (~50 lines)
- `server/constants/email.js` (~40 lines)

**Files to Modify**:
- Multiple files across server/ and client/ (replace hardcoding)
- `.env.example` (document all new env vars)
- `README.md` (configuration documentation)

**Customer Impact**: Maintainable, configurable system, easy environment setup

**Reference**: MASTER_DEV_LIST.md:1936-1964

---

### DEV-W2-022: API Documentation (OpenAPI/Swagger) ⬜

**Priority**: P1 (HIGH)
**Estimated Time**: 3 hours
**Owner**: Backend Team
**Status**: ⬜ NOT STARTED

**Description**: Generate comprehensive API documentation with Swagger UI

**Tasks**:
- [ ] Install Swagger dependencies:
  - `npm install swagger-jsdoc swagger-ui-express`
- [ ] Create Swagger configuration: `server/swagger.js`
  - Define OpenAPI 3.0 spec
  - Define info (title, description, version)
  - Define servers (development, staging, production)
  - Define security schemes (JWT Bearer)
  - Define tags (Auth, Templates, Invitations, Assessments, etc.)
- [ ] Add JSDoc comments to all API endpoints:
  - Route description
  - Request parameters (path, query, body)
  - Request body schema
  - Response schemas (success + errors)
  - Authentication requirements
  - Rate limits
  - Example requests/responses
- [ ] Define request/response schemas:
  - Use OpenAPI schema format
  - Define all models (User, Business, Template, etc.)
  - Define all error responses
  - Reuse schemas across endpoints
- [ ] Document authentication requirements:
  - Which endpoints require auth
  - Which roles can access
  - How to include JWT token
- [ ] Document rate limits:
  - Per-endpoint rate limits
  - Rate limit headers
  - Rate limit error responses
- [ ] Document error responses:
  - All error codes (400, 401, 403, 404, 409, 429, 500)
  - Error response format
  - Field validation errors
- [ ] Generate OpenAPI 3.0 spec:
  - Auto-generate from JSDoc comments
  - Output to `swagger.json` or `swagger.yaml`
- [ ] Serve Swagger UI at `/api-docs`:
  - Interactive API explorer
  - Try-it-out functionality
  - Authentication via UI
  - Response examples
- [ ] Export OpenAPI spec as JSON:
  - For external tools (Postman, Insomnia)
  - For API client generation
- [ ] Test all documented endpoints:
  - Use Swagger UI to test each endpoint
  - Verify request/response schemas match
  - Verify examples work

**JSDoc Example**:
```javascript
/**
 * @swagger
 * /api/assessment-templates:
 *   post:
 *     summary: Create new assessment template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - template_name
 *               - selected_questions
 *             properties:
 *               template_name:
 *                 type: string
 *                 example: "SSI Pulse - Q4 2025"
 *               description:
 *                 type: string
 *                 example: "Quarterly SSI assessment"
 *               selected_questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011"]
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   speed:
 *                     type: object
 *                     properties:
 *                       weight:
 *                         type: number
 *                         example: 0.35
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/', authenticateToken, validate.body(createTemplateSchema), async (req, res, next) => {
  // Handler code
});
```

**Acceptance Criteria**:
- [ ] All endpoints documented in Swagger UI
- [ ] Request/response examples provided
- [ ] Authentication documented (how to get/use tokens)
- [ ] Error codes documented with examples
- [ ] Swagger UI accessible at `/api-docs`
- [ ] Try-it-out works for all endpoints
- [ ] OpenAPI spec exported as JSON
- [ ] All schemas validated

**Files to Create**:
- `server/swagger.js` (~200 lines - Swagger config)
- `swagger.json` (auto-generated from JSDoc)

**Files to Modify**:
- `server/index.js` (add Swagger UI middleware)
- All route files (add JSDoc comments)

**Swagger UI Features**:
- Interactive API explorer at `/api-docs`
- Authenticate with JWT via UI
- Try endpoints directly from browser
- See request/response examples
- Download OpenAPI spec
- Generate API clients (optional)

**Customer Impact**:
- Easy API integration for frontend/partners
- Self-documenting API
- Reduces support burden

**Reference**: MASTER_DEV_LIST.md:1965-1993

---

## 📅 WEEK 1 DEFERRED FEATURES (Day 5 Optional) - 16 hours

**Priority**: P1-P2 (UX IMPROVEMENTS)
**Status**: ⬜⬜⬜⬜ 0/4 complete (0%)
**Note**: These are optional for Week 2. Can be deferred to Week 3 if time runs short.

---

### DEV-W2-023: Template Editing UI ⬜

**Priority**: P1 (HIGH - UX)
**Estimated Time**: 6 hours
**Owner**: Frontend Team
**Status**: ⬜ NOT STARTED
**Source**: Deferred from Week 1 (ISS-W1-007)

**Description**: Allow users to edit existing assessment templates

**Current State**:
- Backend PUT endpoint exists
- No frontend UI for editing

**Tasks**:
- [ ] Create edit template page or reuse creation pages:
  - Option A: Create `client/pages/assessment-template-edit.html`
  - Option B: Add edit mode to existing creation pages
- [ ] Add "Edit" button to template cards:
  - `client/pages/assessment-hub.html`
  - Show only for templates user created or has permission to edit
- [ ] Load existing template data into form:
  - GET /api/assessment-templates/:id/with-questions
  - Pre-populate all fields (name, description, dimensions, questions)
  - Pre-select questions in question selector
- [ ] Validate changes:
  - Dimension weights sum to 1.0
  - At least 10 questions selected
  - All questions exist (validation from Pre-Week 2 Task 2)
  - No duplicate questions (from DEV-W2-006)
- [ ] Save via PUT endpoint:
  - PUT /api/assessment-templates/:id
  - Send only changed fields (optional optimization)
  - Handle validation errors gracefully
- [ ] Show success/error messages:
  - Success: "Template updated successfully"
  - Error: Show specific validation errors
- [ ] Redirect to template list on success
- [ ] Test with different roles:
  - Creator can edit ✅
  - Admin can edit ✅
  - Other users can't edit ❌
  - Consultant can edit templates they created ✅

**Acceptance Criteria**:
- [ ] Users can edit template name and description
- [ ] Users can modify question selections
- [ ] Users can adjust dimension weights
- [ ] Changes saved to database correctly
- [ ] Only creator or admin can edit templates
- [ ] Validation errors shown clearly
- [ ] Success message on save
- [ ] Redirect to template list after save

**Files to Create/Modify**:
- `client/pages/assessment-template-edit.html` (NEW if separate page, ~300 lines)
- Or modify `client/pages/assessment-create-step2.html` and `step3.html` (add edit mode)
- `client/js/assessment-flow.js` (UPDATE - add edit method, ~50 lines)
- `client/pages/assessment-hub.html` (UPDATE - add Edit button)

**Customer Impact**:
- Users can iterate on templates without recreating
- Reduces frustration
- Improves template management

**Reference**:
- MASTER_DEV_LIST.md:2079-2107
- ISS-W1-007 (MASTER_ISSUES_LIST.md:233-245)
- PRE_WEEK_2_AUDIT_REPORT.md:272-277

---

### DEV-W2-024: Template Duplication UI ⬜

**Priority**: P2 (MEDIUM - UX)
**Estimated Time**: 2 hours
**Owner**: Frontend Team
**Status**: ⬜ NOT STARTED
**Source**: Deferred from Week 1 (ISS-W1-008)

**Description**: Allow users to duplicate templates for customization

**Current State**:
- Model has `duplicate()` method
- No UI trigger

**Tasks**:
- [ ] Add "Duplicate" button to template cards:
  - `client/pages/assessment-hub.html`
  - Show for all templates user can view
  - Icon: Copy/Duplicate icon
- [ ] Create duplicate endpoint (if doesn't exist):
  - POST /api/assessment-templates/:id/duplicate
  - Backend creates copy with "(Copy)" appended to name
  - Returns new template ID
- [ ] Handle duplicate action:
  - Click Duplicate button
  - POST to backend with template ID
  - Wait for response
- [ ] Redirect to edit page for new template:
  - After duplicate created
  - Redirect to edit page with new template ID
  - User can immediately customize
- [ ] Show success message:
  - "Template duplicated successfully. Now editing copy."
- [ ] Test duplication preserves all fields:
  - Name (with " (Copy)" suffix)
  - Description
  - All selected questions
  - Dimension weights
  - Settings
- [ ] Test with different template types:
  - Global templates → business-specific copy
  - Business templates → new business template
  - Consultant templates → consultant can duplicate

**Acceptance Criteria**:
- [ ] Duplicate button visible on all templates
- [ ] New template created with all questions
- [ ] Name includes "(Copy)" suffix automatically
- [ ] User redirected to edit page for new template
- [ ] Works for global and business templates
- [ ] Consultant can duplicate to create new templates
- [ ] Success message shown

**Files to Modify**:
- `server/routes/assessmentTemplates.js` (ADD duplicate endpoint, ~30 lines)
- `client/js/assessment-flow.js` (UPDATE - add duplicate method, ~20 lines)
- `client/pages/assessment-hub.html` (UPDATE - add Duplicate button, ~10 lines)

**Customer Impact**:
- Easy template customization
- Faster template creation (start from existing)
- Encourages template reuse and iteration

**Reference**:
- MASTER_DEV_LIST.md:2108-2134
- ISS-W1-008 (MASTER_ISSUES_LIST.md:246-257)
- PRE_WEEK_2_AUDIT_REPORT.md:278-286

---

### DEV-W2-025: Template Preview Before Publish ⬜

**Priority**: P2 (MEDIUM - UX)
**Estimated Time**: 4 hours
**Owner**: Frontend Team
**Status**: ⬜ NOT STARTED
**Source**: Deferred from Week 1 (nice-to-have)

**Description**: Show template preview before final publish

**Current State**: Users can't see full question list before saving

**Tasks**:
- [ ] Add "Preview" step between question selection and publish:
  - Insert between Step 3 (select questions) and final save
  - Or add preview button on Step 3
- [ ] Display template summary:
  - Template name and description
  - Total question count (e.g., "46 questions selected")
  - Questions grouped by dimension:
    - Speed: 15 questions
    - Strength: 16 questions
    - Intelligence: 15 questions
  - Dimension weights as percentages:
    - Speed: 35%
    - Strength: 35%
    - Intelligence: 30%
  - Estimated duration (e.g., "~20 minutes")
- [ ] Show full question list with text:
  - Group by dimension
  - Show question text (not just IDs)
  - Show category labels
  - Show response scale (0-10)
- [ ] Add navigation buttons:
  - "Back to Edit" → Return to Step 3 (question selection)
  - "Publish Template" → Save template to database
- [ ] Responsive design:
  - Mobile-friendly layout
  - Scrollable question list
  - Touch-friendly buttons
- [ ] Preserve state when going back:
  - If user clicks "Back to Edit"
  - Don't lose selected questions
  - Don't lose dimension weights
  - Don't lose template name/description

**Acceptance Criteria**:
- [ ] Preview shows all selected questions with full text
- [ ] Dimension breakdown visible (count + percentage)
- [ ] Users can go back to edit without losing data
- [ ] Users can publish from preview
- [ ] No data lost when navigating back/forward
- [ ] Mobile responsive design

**Files to Modify**:
- `client/pages/assessment-create-step3.html` (UPDATE - add preview mode, ~100 lines)
- `client/js/assessment-flow.js` (UPDATE - preview logic, ~50 lines)

**Preview Layout Example**:
```
┌─────────────────────────────────────────┐
│ Template Preview                         │
├─────────────────────────────────────────┤
│ SSI Pulse - Q4 2025                     │
│ Quarterly SSI assessment for all staff  │
│                                          │
│ 📊 Summary                              │
│ • 46 questions total                    │
│ • Estimated duration: 20 minutes        │
│                                          │
│ 🎯 Dimensions                           │
│ Speed (35%): 15 questions               │
│ Strength (35%): 16 questions            │
│ Intelligence (30%): 15 questions        │
│                                          │
│ 📝 Questions                            │
│                                          │
│ SPEED (15 questions)                    │
│ 1. How quickly do you complete...      │
│ 2. How fast do you respond...          │
│ ...                                     │
│                                          │
│ STRENGTH (16 questions)                 │
│ 1. How consistent is your...           │
│ 2. How reliable are your...            │
│ ...                                     │
│                                          │
│ [Back to Edit] [Publish Template]      │
└─────────────────────────────────────────┘
```

**Customer Impact**:
- Reduces errors in template creation
- Improves confidence before publishing
- Better user experience

**Reference**: MASTER_DEV_LIST.md:2135-2165

---

### DEV-W2-026: Enhanced Question Filtering ⬜

**Priority**: P2 (MEDIUM - UX)
**Estimated Time**: 4 hours
**Owner**: Frontend + Backend Team
**Status**: ⬜ NOT STARTED
**Source**: Deferred from Week 1 (medium priority)

**Description**: Advanced filtering and search for question library

**Current State**: Only filters by dimension (Speed/Strength/Intelligence)

**Tasks**:
- [ ] **Backend: Add query params** to GET /api/assessment-questions:
  - `?dimension=speed` - Filter by dimension
  - `?category=execution_velocity` - Filter by sub-category
  - `?search=keyword` - Search question text
  - `?tags=tag1,tag2` - Filter by tags (if tags exist)
  - Multiple params work together (AND logic)
- [ ] **Frontend: Add filter UI** in question selection page:
  - Dimension dropdown (existing) - Speed/Strength/Intelligence
  - **NEW**: Sub-dimension/category dropdown:
    - Loads categories based on selected dimension
    - Example: Speed → Execution Velocity, Decision Making, etc.
  - **NEW**: Search input:
    - Debounced (wait 300ms after typing)
    - Searches question text
    - Clear button to reset
  - **NEW**: Tag filter (multi-select):
    - If questions have tags
    - Multi-select dropdown
    - Shows selected count
- [ ] Add "Recently Used" section:
  - Show last 10 questions selected by user
  - Quick re-add to current template
  - Stored in localStorage or user preferences
- [ ] Add "Popular Questions" section:
  - Most used across all templates
  - Calculate usage count in database
  - Show top 10 or top 20
  - Helps users discover good questions
- [ ] Update question display to show usage count:
  - "Used in 12 templates" badge
  - Helps users see which questions are popular
- [ ] Cache filter results for performance:
  - Cache in browser (IndexedDB or localStorage)
  - TTL: 1 hour
  - Refresh on first load each hour

**Acceptance Criteria**:
- [ ] Users can filter by sub-dimension/category
- [ ] Search works across question text (fuzzy search optional)
- [ ] Recently used section shows last 10 selections
- [ ] Popular questions highlighted with usage count
- [ ] Filters work together (AND logic):
  - Example: Speed + Execution Velocity + search "customer"
  - Shows only Speed questions in Execution Velocity containing "customer"
- [ ] Performance good even with 146 questions
- [ ] Clear all filters button resets to default

**Files to Modify**:
- `server/routes/assessmentQuestions.js` (UPDATE - add query params, ~50 lines)
- `client/pages/assessment-create-step2.html` (UPDATE - filter UI, ~100 lines)
- `client/js/assessment-flow.js` (UPDATE - filter logic, ~80 lines)

**Filter UI Example**:
```
┌─────────────────────────────────────────┐
│ Filter Questions                         │
├─────────────────────────────────────────┤
│ Dimension: [Speed ▼]                    │
│ Category:  [Execution Velocity ▼]       │
│ Search:    [_____________________] 🔍   │
│ Tags:      [None selected ▼]            │
│                          [Clear Filters] │
├─────────────────────────────────────────┤
│ ⭐ Recently Used (5)                    │
│ • How quickly do you complete...        │
│ • How fast do you respond...            │
│                                          │
│ 🔥 Popular Questions (10)               │
│ • How consistent... (Used in 24)        │
│ • How reliable... (Used in 21)          │
│                                          │
│ 📝 All Questions (15 matching)          │
│ ☐ How quickly do you complete...       │
│ ☐ How fast do you respond...           │
│ ...                                     │
└─────────────────────────────────────────┘
```

**Customer Impact**:
- Easier question discovery
- Faster template creation
- Better question selection
- Guided by popular questions

**Reference**: MASTER_DEV_LIST.md:2166-2200

---

## 📊 WEEK 2 SUMMARY

### Total Tasks: 27 tasks (6.75 days, 54 hours)

| Category | Tasks | Hours | Status |
|----------|-------|-------|--------|
| **Day 0: Critical Week 1 Fixes** | 6 | 12h | ⬜⬜⬜⬜⬜⬜ (0%) |
| **Day 1: Security & Logging** | 4 | 10h | ✅✅⬜⬜ (50%) |
| **Day 2: Validation & Database** | 3 | 8h | ⬜⬜⬜ (0%) |
| **Day 3: Testing** | 3 | 8h | ⬜⬜⬜ (0%) |
| **Day 4: Monitoring & Config** | 4 | 8h | ⬜⬜⬜⬜ (0%) |
| **Day 5: Code Quality & Docs** | 3 | 8h | ⬜✅⬜ (33%) |
| **Deferred: Week 1 UI Features** | 4 | 16h | ⬜⬜⬜⬜ (0%) |

**Current Progress**: 3/27 tasks complete (11%)

### Deliverables Checklist

**Security** ✅:
- [x] Secure secrets management (SecretsManager service)
- [x] Strong cryptographically random secrets
- [ ] Input validation on all endpoints (Joi)
- [ ] Rate limiting verified & enhanced

**Logging & Monitoring** ✅:
- [x] Production logger (Winston with rotation)
- [x] Structured JSON logs
- [ ] Health check endpoints
- [ ] Request tracking with unique IDs

**Testing** ⬜:
- [ ] Integration test suite (100% critical flows)
- [ ] Unit test coverage > 80%
- [ ] Automated CI/CD integration
- [ ] Test coverage reports

**Production Readiness** ⬜:
- [ ] Comprehensive error handling
- [ ] Database connection hardening
- [ ] Database indexes for performance
- [ ] Zero hardcoded values
- [ ] Complete API documentation (Swagger)
- [ ] Deployment guides and runbooks
- [ ] Environment-specific configurations

**Week 1 Deferred** ⬜ (Optional):
- [ ] Template editing UI
- [ ] Template duplication UI
- [ ] Template preview
- [ ] Enhanced question filtering

### Success Criteria

- [ ] All Week 1 features still working
- [ ] Zero hardcoded values in codebase
- [ ] Test coverage > 80%
- [ ] All secrets properly managed
- [ ] Production-ready deployment
- [ ] Comprehensive documentation
- [ ] Health checks operational
- [ ] Real emails sending (Mailjet)
- [ ] Rate limiting enforced
- [ ] Database optimized with indexes

### Next Week

**Week 3: Advanced Analytics & Insights** (Oct 21-25)
- Original Week 2 plan moved to Week 3
- Historical trend analysis
- Comparative benchmarking
- Drill-down analytics
- Export functionality (PDF, CSV)
- Manager/Executive/Consultant dashboards

**Payment**: $4,500 due Oct 21 (after Week 2 demo)
**Demo**: Friday Oct 25 @ 3:00 PM

---

## 🔗 ALL REFERENCE LINKS

### Week 2 Planning
- [MASTER_DEV_LIST.md](../../MASTER_DEV_LIST.md#week-2) - Lines 1211-2233
- [WEEK_2_PRODUCTION_HARDENING_PLAN.md](../WEEK_2_PRODUCTION_HARDENING_PLAN.md)
- [PRE_WEEK_2_AUDIT_REPORT.md](./PRE_WEEK_2_AUDIT_REPORT.md)
- [PRE_WEEK_2_TODO_CHECKLIST.md](./PRE_WEEK_2_TODO_CHECKLIST.md)

### Week 2 Handoffs
- [WEEK_2_DAY_1_HANDOFF.md](./WEEK_2_DAY_1_HANDOFF.md) - Security & Logging ✅

### Week 1 Context
- [WEEK_1_FINAL_REPORT.md](../WEEK_1_FINAL_REPORT.md)
- [WEEK_1_TO_WEEK_2_TRANSITION.md](../WEEK_1_TO_WEEK_2_TRANSITION.md)
- [WEEK_1_SUMMARY.md](../Week_1/WEEK_1_SUMMARY.md)
- [WEEK_1_DAY_4_FINAL_HANDOFF.md](../Week_1/WEEK_1_DAY_4_FINAL_HANDOFF.md)

### Master Lists
- [MASTER_ISSUES_LIST.md](../../MASTER_ISSUES_LIST.md) - 32 issues, 8 relevant to Week 2
- [MASTER_IMPROVEMENTS_LIST.md](../../MASTER_IMPROVEMENTS_LIST.md) - 73 future items

### Review Documents
- [Week1_Assessment_Plan_Review.md](../../Review Docs/Week1_Assessment_Plan_Review.md)
- [nov30_mvp_review.md](../../Review Docs/mvp_release_alignment/nov30_mvp_review.md)

### Technical Docs (Created Week 2 Day 1)
- [SECRETS_MANAGEMENT.md](../../SECRETS_MANAGEMENT.md) - 580 lines
- [PRODUCTION_BRANCH_GUIDE.md](../../PRODUCTION_BRANCH_GUIDE.md)

---

**Created**: October 16, 2025
**Last Updated**: October 16, 2025
**Status**: Ready to Execute (pending Pre-Week 2 tasks)
**Next Update**: Daily during Week 2

---

**END OF WEEK 2 DETAILED PLAN**
