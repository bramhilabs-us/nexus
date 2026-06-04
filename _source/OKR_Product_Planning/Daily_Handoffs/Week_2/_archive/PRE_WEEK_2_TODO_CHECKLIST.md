# ✅ Pre-Week 2 TODO Checklist

**Date**: October 16, 2025
**Purpose**: Critical tasks that MUST be completed before starting Week 2 production hardening plan
**Status**: ⬜ NOT STARTED
**Estimated Time**: 4-6 hours

---

## 🎯 Overview

Based on comprehensive audit of Week 1 feedback, MASTER_ISSUES_LIST, and review documents, we've identified **3 critical tasks** (plus verification) that must be completed before Week 2 work can begin safely.

**Why This Matters**:
- Week 2 is "Production Hardening" - we can't harden a broken foundation
- Data integrity issues will compound if not fixed now
- Security gaps need immediate attention

---

## 📋 CRITICAL TASKS (MUST COMPLETE)

### ✅ Task 1: Create Question Library Seeding Script

**Priority**: 🔴 P0 (CRITICAL - BLOCKING)
**Estimated Time**: 3-4 hours
**Owner**: Backend Team
**Blocks**: Template creation testing, assessment taking, all Week 2 testing

#### Current Problem
- 146 questions extracted and stored in `server/config/ssi-questions-library.json` (3,505 lines)
- Questions NOT loaded into AssessmentQuestion collection
- Database is empty - can't create meaningful templates or take assessments

#### What Needs to Be Done
- [ ] Create `scripts/seedQuestions.js` script
- [ ] Load questions from `server/config/ssi-questions-library.json`
- [ ] Insert into AssessmentQuestion collection with duplicate detection
- [ ] Log success/failure stats
- [ ] Add to package.json: `"seed:questions": "node scripts/seedQuestions.js"`
- [ ] Update README.md with usage instructions
- [ ] Test on clean database
- [ ] Verify all 146 questions loaded correctly

#### Acceptance Criteria
- [x] Script exists: `scripts/seedQuestions.js`
- [ ] Loads all 146 questions from JSON
- [ ] Duplicate detection works (safe to run multiple times)
- [ ] Dimensions correctly categorized:
  - 48 Speed questions
  - 46 Strength questions
  - 52 Intelligence questions
- [ ] Command documented: `npm run seed:questions`
- [ ] README.md has setup instructions
- [ ] Tested with empty database
- [ ] Tested with existing questions (no duplicates created)

#### Files to Create
```
scripts/seedQuestions.js (~100 lines)
```

#### Files to Modify
```
package.json (add seed script)
README.md (document usage)
```

#### Reference
- **Issue**: ISS-W1-005 (MASTER_ISSUES_LIST.md:203-215)
- **Existing Data**: `server/config/ssi-questions-library.json`
- **Audit Report**: PRE_WEEK_2_AUDIT_REPORT.md:114-150

---

### ✅ Task 2: Add Template Question Validation

**Priority**: 🔴 P0 (CRITICAL - DATA INTEGRITY)
**Estimated Time**: 1-2 hours
**Owner**: Backend Team
**Blocks**: Data integrity, template reliability

#### Current Problem
- POST /api/assessment-templates doesn't validate that question IDs exist
- Can save templates with invalid question IDs
- Assessment taking will fail with "question not found" error
- No way to detect bad data until runtime

#### What Needs to Be Done
- [ ] Modify `server/routes/assessmentTemplates.js` POST handler
- [ ] Add validation before saving template
- [ ] Query AssessmentQuestion collection for all selected_questions
- [ ] Compare found count vs requested count
- [ ] If mismatch, return 400 error with missing question IDs
- [ ] Add unit test for validation
- [ ] Test with valid question IDs (should succeed)
- [ ] Test with invalid question IDs (should fail with list)
- [ ] Test with empty array (should handle gracefully)

#### Acceptance Criteria
- [ ] Valid question IDs → template created successfully
- [ ] Invalid question IDs → 400 error returned
- [ ] Error response includes missing question IDs:
  ```json
  {
    "success": false,
    "message": "Invalid question IDs",
    "missing_questions": ["507f1f77bcf86cd799439011"]
  }
  ```
- [ ] Empty question array handled gracefully
- [ ] Unit test covers all cases
- [ ] Frontend receives clear error message

#### Files to Modify
```
server/routes/assessmentTemplates.js (POST handler, ~20 lines)
```

#### Files to Create
```
tests/unit/templateValidation.test.js (~50 lines)
```

#### Code Example
```javascript
// Add to POST /api/assessment-templates handler (before save)
const questionIds = req.body.selected_questions || [];

if (questionIds.length > 0) {
  const questions = await AssessmentQuestion.find({
    _id: { $in: questionIds }
  });

  if (questions.length !== questionIds.length) {
    const foundIds = questions.map(q => q._id.toString());
    const missingIds = questionIds.filter(
      id => !foundIds.includes(id.toString())
    );

    return res.status(400).json({
      success: false,
      message: 'Invalid question IDs detected',
      missing_questions: missingIds,
      found: questions.length,
      requested: questionIds.length
    });
  }
}
```

#### Reference
- **Issue**: ISS-W1-006 (MASTER_ISSUES_LIST.md:217-231)
- **Audit Report**: PRE_WEEK_2_AUDIT_REPORT.md:152-188

---

### ✅ Task 3: Verify Rate Limiter Configuration

**Priority**: ⚠️ P1 (HIGH - SECURITY)
**Estimated Time**: 1 hour
**Owner**: Security/Backend Team
**Blocks**: Public endpoint security

#### Current Problem
- Week 1 created rate limiting middleware
- Unclear if all public endpoints have limiters applied
- Specifically: invitationValidateLimiter and invitationAcceptLimiter

#### What Needs to Be Done
- [ ] Open `server/middleware/rateLimiting.js`
- [ ] Verify these limiters exist:
  - `invitationValidateLimiter` (20 requests/hour per IP)
  - `invitationAcceptLimiter` (5 requests/hour per IP)
- [ ] If missing, create them (5-10 lines each)
- [ ] Open `server/routes/invitations.js`
- [ ] Verify limiters applied to routes:
  - `GET /validate/:token` → invitationValidateLimiter
  - `POST /accept/:token` → invitationAcceptLimiter
- [ ] Manual test: Hit endpoint 6 times rapidly
- [ ] Verify 6th request returns 429 error
- [ ] Document rate limits in API docs

#### Acceptance Criteria
- [ ] `invitationValidateLimiter` exists (20/hour)
- [ ] `invitationAcceptLimiter` exists (5/hour)
- [ ] Applied to correct endpoints
- [ ] Manual test confirms rate limiting works:
  ```bash
  # Test validation endpoint (should allow 20, then 429)
  for i in {1..21}; do
    curl http://localhost:8080/api/invitations/validate/test-token
  done

  # Test accept endpoint (should allow 5, then 429)
  for i in {1..6}; do
    curl -X POST http://localhost:8080/api/invitations/accept/test-token
  done
  ```
- [ ] 429 error returned when limit exceeded
- [ ] Error message is clear:
  ```json
  {
    "success": false,
    "message": "Too many requests, please try again later",
    "retryAfter": 3600
  }
  ```

#### Files to Check
```
server/middleware/rateLimiting.js (verify limiters exist)
server/routes/invitations.js (verify limiters applied)
```

#### Possibly Modify If Missing
```
server/middleware/rateLimiting.js (add limiters if missing)
server/routes/invitations.js (apply limiters if missing)
```

#### Example Limiter Config (if missing)
```javascript
// In server/middleware/rateLimiting.js
const invitationValidateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour
  message: {
    success: false,
    message: 'Too many invitation validation attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const invitationAcceptLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: {
    success: false,
    message: 'Too many invitation acceptance attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  // ... existing exports
  invitationValidateLimiter,
  invitationAcceptLimiter
};
```

#### Reference
- **Issue**: ISS-027 (MASTER_ISSUES_LIST.md:489-500)
- **Audit Report**: PRE_WEEK_2_AUDIT_REPORT.md:190-227

---

## ⏳ DEFERRED TASKS (Already Scheduled in Week 2)

### Task 4: Integration Tests for Invitation Flow
**Status**: ✅ DEFERRED TO WEEK 2 DAY 3
**Scheduled**: DEV-W2-007 (Integration Test Suite)
**Estimated Time**: 2-3 hours
**Decision**: Already properly scheduled, no need to do before Week 2

#### Reference
- **Issue**: ISS-024 (MASTER_ISSUES_LIST.md:443-457)
- **Scheduled Task**: MASTER_DEV_LIST.md:1696-1726
- **Audit Report**: PRE_WEEK_2_AUDIT_REPORT.md:235-244

---

### Task 5: Real Mailjet Configuration & Email Sending
**Status**: ✅ DEFERRED TO WEEK 2 DAY 4
**Scheduled**: DEV-W2-012 (Configure Production Mailjet)
**Estimated Time**: 4-6 hours
**Decision**: Current workaround (manual link sharing) is acceptable

#### Current Workaround
- Invitations created successfully
- Links displayed in UI
- Users can copy/paste invitation links manually
- Email sending NOT required for Week 2 start

#### Reference
- **Issue**: ISS-028 (MASTER_ISSUES_LIST.md:501+)
- **Scheduled Task**: MASTER_DEV_LIST.md:1840-1868
- **Audit Report**: PRE_WEEK_2_AUDIT_REPORT.md:246-268

---

### Task 6-7: Template Editing & Duplication UI
**Status**: ✅ DEFERRED TO WEEK 2 DAY 5
**Scheduled**: DEV-W2-018, DEV-W2-019
**Estimated Time**: 6-8 hours total
**Decision**: UX improvements, not blocking production hardening

#### Reference
- **Issues**: ISS-W1-007, ISS-W1-008
- **Scheduled Tasks**: MASTER_DEV_LIST.md:2079-2166
- **Audit Report**: PRE_WEEK_2_AUDIT_REPORT.md:272-286

---

## ✅ FALSE ALARM ISSUES (No Action Needed)

### ❌ Auth Middleware "Broken"
**Status**: ✅ VERIFIED WORKING
**Audit Finding**: Week 2 plan claimed auth calls "non-existent IAM endpoint"
**Reality**: `/api/auth/validate` exists at `engines/iam/index.js:574`
**Verification**: Week 2 Day 1 handoff tested and confirmed working
**Action**: None needed

#### Evidence
- **Week 2 Plan Claim** (INCORRECT):
  > "The new `authenticateToken` middleware still calls a non-existent IAM endpoint"

- **Audit Finding** (CORRECT):
  - Endpoint exists: `POST /api/auth/validate` at line 574
  - Auth middleware calls correct endpoint at line 36
  - Week 2 Day 1 testing confirmed both IAM and local paths work

- **Reference**: PRE_WEEK_2_AUDIT_REPORT.md:13-65

---

### ✅ SSI Scoring Service - Already Complete
**Status**: ✅ RESOLVED (Week 1 Day 5)
**File**: `server/services/SSIScoringService.js` (390 lines)
**Linked Task**: DEV-W1-015 (completed)

---

### ✅ Assessment Model Fields - Already Complete
**Status**: ✅ RESOLVED (Week 1 Day 2)
**File**: `server/models/Assessment.js` (updated with all required fields)
**Linked Task**: DEV-W1-007 (completed)

---

## 🚦 GO/NO-GO DECISION CRITERIA

### ✅ Ready to Start Week 2 When:
- [ ] Task 1 complete: Question seeding script working (3-4h)
- [ ] Task 2 complete: Template validation added (1-2h)
- [ ] Task 3 complete: Rate limiters verified (1h)
- [ ] All tests passing
- [ ] No regressions in existing features
- [ ] All code committed and pushed

**Estimated Total Time**: 4-6 hours
**Recommended Timeline**: Complete today (Oct 16), start Week 2 tomorrow (Oct 17)

---

## 📊 TASK SUMMARY

| Task | Priority | Time | Status | Blocks |
|------|----------|------|--------|--------|
| 1. Question Seeding | P0 | 3-4h | ⬜ NOT STARTED | Testing, Templates |
| 2. Template Validation | P0 | 1-2h | ⬜ NOT STARTED | Data Integrity |
| 3. Rate Limiter Verify | P1 | 1h | ⬜ NOT STARTED | Security |
| **TOTAL** | **P0-P1** | **4-6h** | **0/3** | **Critical** |

**Deferred Tasks**: 4 tasks (12-17 hours) - Scheduled for Week 2 Days 3-5

---

## 🔗 REFERENCE LINKS

### Master Planning Documents
- [MASTER_DEV_LIST.md](../../MASTER_DEV_LIST.md) - All Week 2 tasks (27 tasks, 54 hours)
- [MASTER_ISSUES_LIST.md](../../MASTER_ISSUES_LIST.md) - Known issues (32 items)
- [MASTER_IMPROVEMENTS_LIST.md](../../MASTER_IMPROVEMENTS_LIST.md) - Future work (73 items)

### Week 1 Completion
- [WEEK_1_FINAL_REPORT.md](../WEEK_1_FINAL_REPORT.md) - Complete Week 1 summary
- [WEEK_1_TO_WEEK_2_TRANSITION.md](../WEEK_1_TO_WEEK_2_TRANSITION.md) - Transition notes
- [WEEK_1_SUMMARY.md](../Week_1/WEEK_1_SUMMARY.md) - Detailed Week 1 handoff

### Week 2 Planning
- [WEEK_2_PRODUCTION_HARDENING_PLAN.md](../WEEK_2_PRODUCTION_HARDENING_PLAN.md) - Original plan
- [WEEK_2_DAY_1_HANDOFF.md](./WEEK_2_DAY_1_HANDOFF.md) - Day 1 completion (security & logging)
- [PRE_WEEK_2_AUDIT_REPORT.md](./PRE_WEEK_2_AUDIT_REPORT.md) - Comprehensive audit

### Review Documents
- [Week1_Assessment_Plan_Review.md](../../Review Docs/Week1_Assessment_Plan_Review.md) - Critical review
- [nov30_mvp_review.md](../../Review Docs/mvp_release_alignment/nov30_mvp_review.md) - MVP alignment

---

## 📝 NEXT STEPS

### Immediate (Today - Oct 16)
1. **START HERE**: Task 1 - Question Seeding Script (3-4h)
2. Task 2 - Template Validation (1-2h)
3. Task 3 - Rate Limiter Verification (1h)
4. Test all changes
5. Commit and push

### Tomorrow (Oct 17 - Week 2 Day 2)
1. Continue Week 2 plan from Day 2:
   - DEV-W2-004: Joi Input Validation (4h)
   - DEV-W2-005: Database Connection Hardening (2h)
   - DEV-W2-006: Database Indexes (2h)

### Week 2 Day 3-5
1. Day 3: Integration tests (includes Task 4)
2. Day 4: Mailjet config (includes Task 5), Health checks
3. Day 5: Template UI (includes Tasks 6-7), Documentation

---

## 🎯 SUCCESS METRICS

**Pre-Week 2 Complete When**:
- ✅ All 3 critical tasks done (4-6 hours)
- ✅ 146 questions in database
- ✅ Template validation prevents bad data
- ✅ Rate limiters verified working
- ✅ All tests passing
- ✅ No blockers for Week 2 work

**Week 2 Can Start Safely**:
- Solid data foundation (questions seeded, validation working)
- Security verified (rate limiting confirmed)
- Ready for production hardening work
- No technical debt blocking progress

---

## 📞 QUESTIONS OR BLOCKERS?

If you encounter any issues while completing these tasks:

1. **Check References**: Each task has links to related issues and docs
2. **Review Audit Report**: [PRE_WEEK_2_AUDIT_REPORT.md](./PRE_WEEK_2_AUDIT_REPORT.md)
3. **Check Week 2 Plan**: [WEEK_2_DETAILED_PLAN.md](./WEEK_2_DETAILED_PLAN.md) (to be created)
4. **Document Blockers**: Add to MASTER_ISSUES_LIST.md with ISS-W2-XXX format

---

**Created**: October 16, 2025
**Last Updated**: October 16, 2025
**Status**: Ready to Execute
**Next Review**: After all 3 tasks complete

---

**END OF PRE-WEEK 2 TODO CHECKLIST**
