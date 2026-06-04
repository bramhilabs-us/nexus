# Week 2 Day 2.5 - Sequential Execution Guide

**Date**: October 17, 2025
**Status**: 🔄 IN PROGRESS (2/4 tasks complete - 50%)
**Purpose**: Avoid API 400 errors from tool use concurrency issues

---

## ⚠️ CRITICAL: Sequential Execution Required

**Problem**: Running multiple tasks in parallel causes:
```
API Error: 400 due to tool use concurrency issues
```

**Solution**: Execute ALL tasks and subtasks **ONE AT A TIME** in the exact order below.

---

## 📋 Task Execution Order

### ✅ COMPLETED TASKS (2/4)

1. **DEV-W2-TDD-001: Minimal QA Structure** ✅ COMPLETE
   - Status: Done on October 17, 2025
   - Deliverables: QA folder, README, templates created

2. **DEV-W2-TDD-002: Jest Minimal Setup** ✅ COMPLETE
   - Status: Done on October 17, 2025
   - Deliverables: Jest configured, test scripts added, folder structure created

---

### ⬜ REMAINING TASKS (2/4) - EXECUTE SEQUENTIALLY

### **NEXT: Task 3 of 4 - DEV-W2-TDD-003**

**Task**: Critical Unit Tests for Day 1 Work
**Estimated Time**: 2.5 hours
**Status**: ⬜ NOT STARTED
**Dependencies**: TDD-002 ✅ COMPLETE

#### **⚠️ SUBTASK EXECUTION ORDER (ONE FILE AT A TIME)**

**DO NOT PROCEED TO NEXT SUBTASK UNTIL CURRENT IS 100% COMPLETE**

#### Subtask 3.1: SecretsManager Tests
- **File**: `tests/unit/services/SecretsManager.test.js`
- **Lines**: ~50 lines
- **Tests**: 5 tests
- **What to Test**:
  - `get()` method
  - `has()` method
  - `redact()` method
  - `getStatus()` method
  - Edge cases (missing keys, etc.)
- **⚠️ Complete writing file → Run tests → Verify passing → THEN move to 3.2**

#### Subtask 3.2: Logger Tests
- **File**: `tests/unit/services/logger.test.js`
- **Lines**: ~60 lines
- **Tests**: 6 tests
- **What to Test**:
  - Log levels work (error, warn, info, debug)
  - Sensitive data sanitization
  - Mock filesystem
  - Log formatting
- **⚠️ Complete writing file → Run tests → Verify passing → THEN move to 3.3**

#### Subtask 3.3: Error Classes Tests
- **File**: `tests/unit/utils/errors.test.js`
- **Lines**: ~80 lines
- **Tests**: 8 tests
- **What to Test**:
  - AppError base class
  - ValidationError (400)
  - AuthenticationError (401)
  - NotFoundError (404)
  - `toJSON()` serialization
  - Error inheritance
- **Note**: Defer other 7 error classes to Week 3
- **⚠️ Complete writing file → Run tests → Verify passing → THEN move to 3.4**

#### Subtask 3.4: Error Handler Middleware Tests
- **File**: `tests/unit/middleware/errorHandler.test.js`
- **Lines**: ~100 lines
- **Tests**: 10 tests
- **What to Test**:
  - Operational vs programming error distinction
  - Mongoose ValidationError handling
  - JWT error handling
  - 404 handler
  - Stack trace in dev only
  - Request ID tracking
- **⚠️ Complete writing file → Run tests → Verify passing → THEN move to Task 4**

---

### **FINAL: Task 4 of 4 - DEV-W2-TDD-004**

**Task**: Simple Pre-Deploy Script
**Estimated Time**: 1 hour
**Status**: ⬜ NOT STARTED
**Dependencies**: TDD-003 ⬜ PENDING (ALL 4 subtasks must be complete)

#### **⚠️ ONLY EXECUTE AFTER TDD-003 IS 100% COMPLETE**

**Steps**:
1. Create `scripts/pre-deploy.sh` (80 lines):
   - Check uncommitted changes
   - Run tests (npm test)
   - Check coverage (warning only)
   - Scan for exposed secrets
   - Print summary
2. Make executable: `chmod +x scripts/pre-deploy.sh`
3. Test script execution
4. Update README with usage

---

## 🎯 Success Criteria

### Task Completion Checklist

**TDD-003 Complete When**:
- [ ] All 4 test files created
- [ ] All 29 tests written (5 + 6 + 8 + 10)
- [ ] `npm test` runs successfully
- [ ] All tests passing (green)
- [ ] Coverage: 70-75% for Day 1 work
- [ ] No skipped tests

**TDD-004 Complete When**:
- [ ] `scripts/pre-deploy.sh` created
- [ ] Script is executable
- [ ] Script runs without errors
- [ ] README updated with testing workflow
- [ ] All checks in script work (git, tests, coverage, secrets)

---

## 🚫 What NOT to Do

**DO NOT**:
- ❌ Run multiple subtasks in parallel
- ❌ Skip to TDD-004 before TDD-003 is complete
- ❌ Write all 4 test files at once
- ❌ Commit before tests are passing
- ❌ Use multiple tool calls in parallel
- ❌ Batch multiple file writes together

**DO**:
- ✅ Complete one subtask fully before starting next
- ✅ Run tests after each file is created
- ✅ Verify tests pass before moving on
- ✅ Execute tasks in exact order: 3.1 → 3.2 → 3.3 → 3.4 → Task 4
- ✅ Use single tool calls, wait for completion
- ✅ Commit after each major milestone

---

## 📊 Progress Tracking

| Task | Subtask | Status | Time | Completion |
|------|---------|--------|------|------------|
| TDD-001 | - | ✅ COMPLETE | 1h | 100% |
| TDD-002 | - | ✅ COMPLETE | 1.5h | 100% |
| **TDD-003** | **SecretsManager** | ⬜ **NEXT** | **0.5h** | **0%** |
| TDD-003 | Logger | ⬜ PENDING | 0.5h | 0% |
| TDD-003 | Errors | ⬜ PENDING | 0.75h | 0% |
| TDD-003 | ErrorHandler | ⬜ PENDING | 0.75h | 0% |
| TDD-004 | Pre-Deploy Script | ⬜ PENDING | 1h | 0% |

**Current Progress**: 2/4 tasks (50%)
**Remaining Time**: 3.5 hours (2.5h TDD-003 + 1h TDD-004)

---

## 🔗 Reference Documents

- [WEEK_2_DETAILED_PLAN.md](./WEEK_2_DETAILED_PLAN.md) - Full Week 2 plan with sequential execution notes
- [WEEK_2_TDD_INTEGRATION_PLAN.md](./WEEK_2_TDD_INTEGRATION_PLAN.md) - TDD integration strategy
- [WEEK_2_DAY_1_HANDOFF.md](./WEEK_2_DAY_1_HANDOFF.md) - Day 1 work that needs testing

---

## ✅ Next Action

**Execute this command to start Subtask 3.1**:
```
Start writing tests/unit/services/SecretsManager.test.js
```

**After Subtask 3.1 is complete, run**:
```bash
npm test -- tests/unit/services/SecretsManager.test.js
```

**Only proceed to Subtask 3.2 if all tests pass.**

---

**END OF SEQUENTIAL EXECUTION GUIDE**
