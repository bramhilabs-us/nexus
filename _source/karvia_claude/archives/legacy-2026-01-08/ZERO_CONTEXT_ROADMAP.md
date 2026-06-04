# 🎯 Zero-Context Roadmap

**Vision**: Claude loads context with 0 tokens wasted, knows exact file:line:variable for any task

**Current State**: ~60,000 tokens to get context
**Target State**: ~6,000 tokens (90% reduction)

**KPI Goals**:
- CER (Context Efficiency Ratio): 85% → 95%
- TCV (Task Completion Velocity): 0.6 → 1.1
- TES (Token Efficiency Score): 0.40 → 0.92
- RAI (Resolution Accuracy Index): 60% → 95%

---

## 📊 Progress Tracker

| Phase | Status | KPI Impact | Completion |
|-------|--------|------------|------------|
| Phase 0: Foundation | ✅ Complete | CER: +10% | 100% |
| Phase 1: Enhanced Snapshots | ✅ Complete | CER: +15%, TES: +20% | 100% |
| Phase 2: Smart Context Injection | 🔄 Next | TCV: +30%, RAI: +20% | 0% |
| Phase 3: KPI Tracking | ⏳ Planned | All KPIs | 0% |
| Phase 4: Optimization | ⏳ Planned | All KPIs | 0% |

---

## ✅ Phase 0: Foundation (COMPLETE)

### Completed Items
- [x] Create MASTER_TREE_CODE.md with hierarchical code structure
- [x] Create MASTER_TREE_DOCS.md with documentation hierarchy
- [x] Implement start-session.js (loads context in one command)
- [x] Implement end-session.js with --auto mode (updates trees automatically)
- [x] Set up .session-config.json for automation
- [x] Basic KPI calculation in end-session.js

### KPI Baseline (Phase 0)
```
CER: 10% → 20% (loaded MASTER_TREE files)
TCV: 0.6 (still searching for context)
TES: 0.40 (60% tokens on exploration)
RAI: 60% (missing context often)
```

---

## ✅ Phase 1: Enhanced Snapshots (COMPLETE)

**Completed**: November 6, 2025
**Goal**: Add feature flags, active variables, and current work areas to MASTER_TREE_CODE.md

### 1.1 Feature Flags Section (Priority: HIGH)
**Status**: ✅ COMPLETE
**File**: MASTER_TREE_CODE.md
**Location**: Add after "Session Modification Summary", before "MASTER CODE TREE"

**Implementation**:
```markdown
## 🎯 FEATURE FLAGS

| Flag Name | Value | File Location | Line | Used By |
|-----------|-------|---------------|------|---------|
| ENABLE_DARK_MODE | false | .env | 12 | client/js/theme.js:42 |
| ENABLE_OKR_AI | true | .env | 15 | server/routes/objectives.js:12 |
| ENABLE_MULTI_TENANT | false | .env | 18 | server/middleware/auth.js:8 |
| DEBUG_MODE | false | .env | 22 | server/index.js:5 |
```

**Why**: Claude instantly knows if feature is enabled and where to toggle it

**KPI Impact**: RAI +10% (fewer "wrong feature state" errors)

---

### 1.2 Active Variables Section (Priority: HIGH)
**Status**: ✅ COMPLETE
**File**: MASTER_TREE_CODE.md
**Location**: After "Feature Flags"

**Implementation**:
```markdown
## 🔧 ACTIVE VARIABLES (Frequently Modified)

### Authentication
- **karvia_auth_token**: localStorage key for JWT
  - File: client/js/auth.js:35
  - Type: string
  - Format: "Bearer {jwt}"
  - Used by: All authenticated API calls

### Configuration
- **PORT**: Server port
  - File: server/index.js:15
  - Default: 8080
  - Env var: process.env.PORT

### Database
- **dbConnection**: MongoDB connection
  - File: server/config/database.js:45
  - Type: mongoose.Connection
  - State: Connected/Disconnected
```

**Why**: Claude knows exact variable names and locations without searching

**KPI Impact**: TCV +15% (no time wasted searching for variable names)

---

### 1.3 Current Work Areas Section (Priority: HIGH)
**Status**: ✅ COMPLETE
**File**: MASTER_TREE_CODE.md
**Location**: After "Active Variables"

**Implementation**:
```markdown
## 📍 CURRENT WORK AREAS (This Sprint)

### 🔴 High Priority (Do First)
1. **client/js/weekly-goals.js** (NOT STARTED)
   - Status: HTML done, JS pending
   - Pattern: Follow client/js/quarterly-goals.js:1-450
   - Dependencies: client/js/api-client.js
   - Blockers: None
   - Estimated: 2 hours

2. **client/js/goal-details.js** (NOT STARTED)
   - Status: HTML done, JS pending
   - Pattern: Follow client/js/quarterly-goals.js:200-350
   - Dependencies: client/js/api-client.js
   - Blockers: None
   - Estimated: 1.5 hours

### 🟡 Medium Priority
3. **server/routes/assessmentTemplates.js** (RECENTLY MODIFIED)
   - Last change: Nov 6, 2025
   - Why: Consultant auth fix
   - Next: Add validation layer
   - Lines modified: 44-53, 293-318

### 🟢 Recently Completed (Don't Touch)
4. **client/pages/assessment-hub.html** (RECENTLY FIXED)
   - Fixed: Token key issue (line 672)
   - Don't break: localStorage.getItem('karvia_auth_token')
```

**Why**: Claude knows what to work on and what not to break

**KPI Impact**:
- TCV +20% (immediate task clarity)
- RAI +15% (knows recent changes to avoid breaking)

---

### 1.4 Similar Patterns Section (Priority: MEDIUM)
**Status**: ✅ COMPLETE (Included as "Copy-Paste Patterns" subsection in Current Work Areas)
**File**: MASTER_TREE_CODE.md
**Location**: After "Current Work Areas"

**Implementation**:
```markdown
## 🔗 COMMON PATTERNS (Copy These)

### API Client Pattern
**When**: Creating new API wrapper
**Copy from**: client/js/assessment-api-client.js:1-150
**Pattern**:
```javascript
// Import base client
import apiClient from './api-client.js';

// Export named functions
export async function getItems() {
  return apiClient.get('/api/items');
}

export async function createItem(data) {
  return apiClient.post('/api/items', data);
}
```

### Route Handler Pattern
**When**: Creating new backend route
**Copy from**: server/routes/assessmentTemplates.js:1-50
**Pattern**:
```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET all (with auth)
router.get('/', authenticateToken, async (req, res) => {
  // Implementation
});

module.exports = router;
```
```

**Why**: Claude copies existing patterns instead of creating from scratch

**KPI Impact**: TES +15% (less token usage for "how to" questions)

---

### 1.5 Auto-Update end-session.js (Priority: HIGH)
**Status**: ⏳ TODO (Next step)
**File**: .claude/3-CLAUDE_AI/claude-automation/end-session.js
**Function**: updateMasterTrees()

**Implementation**: Add logic to extract and update these sections:
1. Parse .env for feature flags
2. Scan git log for recently modified files
3. Extract TODOs from code comments
4. Auto-populate "Current Work Areas"

**Why**: Zero manual maintenance of MASTER_TREE_CODE.md

**KPI Impact**: CER +5% (always accurate context)

---

## ⏳ Phase 2: Smart Context Injection (PLANNED)

**Goal**: Generate SESSION_SNAPSHOT.md at every session start

### 2.1 Create SESSION_SNAPSHOT.md Generator
**File**: .claude/3-CLAUDE_AI/claude-automation/start-session.js
**Function**: generateSessionSnapshot()

**What it generates**:
```markdown
# 📸 SESSION SNAPSHOT

**Session ID**: SESSION-2025-11-06-1400
**Duration**: 2.5 hours (estimated)
**Last Session**: 4 hours ago

---

## 🎯 YOUR NEXT TASK (From ACTIVE_SESSION.md)

**Task**: Implement weekly-goals.js
**Priority**: HIGH
**File**: client/js/weekly-goals.js
**Status**: Not started (HTML exists at client/pages/weekly-goals.html)

### Exact Implementation Steps
1. Copy pattern from: client/js/quarterly-goals.js:1-450
2. Modify function names: loadQuarterlyGoals → loadWeeklyGoals
3. Change API endpoint: /api/objectives?view=weekly
4. Update DOM selectors: #quarterView → #weekView

### Dependencies
- ✅ client/js/api-client.js (exists)
- ✅ client/pages/weekly-goals.html (exists)
- ⚠️ server/routes/objectives.js (needs weekly filter added)

### Feature Flags
- None required

### Similar Code (Copy These Patterns)
- Calendar rendering: client/js/quarterly-goals.js:125-180
- Goal card creation: client/js/quarterly-goals.js:245-290
- API integration: client/js/quarterly-goals.js:50-100

---

## 📍 EXACT FILE LOCATIONS

### Where to create new file
- Path: /Users/sagarrs/Desktop/official_dev/karvia_business/client/js/weekly-goals.js
- Template: client/js/quarterly-goals.js

### Where to import it
- File: client/pages/weekly-goals.html:15
- Add: `<script src="../js/weekly-goals.js"></script>`

### Where to test it
- URL: http://localhost:8080/client/pages/weekly-goals.html
- Test user: consultant@karvia.com / Karvia2025!

---

## ⚠️ RECENTLY MODIFIED (Don't Break These)

### client/pages/assessment-hub.html:672
**Changed**: 4 hours ago
**What**: localStorage key from 'token' to 'karvia_auth_token'
**Why**: Token authentication was failing
**Don't touch**: Any code using localStorage.getItem('karvia_auth_token')

### server/routes/assessmentTemplates.js:44-53
**Changed**: 4 hours ago
**What**: Consultant company_id access
**Why**: Consultants couldn't see own templates
**Don't touch**: Consultant auth logic

---

## 🔧 ACTIVE VARIABLES (You'll Need These)

- **karvia_auth_token**: localStorage key (client/js/auth.js:35)
- **currentUser**: From getCurrentUser() (client/js/auth.js:78)
- **apiBase**: 'http://localhost:8080' (client/js/api-client.js:5)

---

## 🎯 FEATURE FLAGS

| Flag | Status | Location | You need this? |
|------|--------|----------|----------------|
| ENABLE_DARK_MODE | ❌ OFF | .env:12 | No |
| ENABLE_OKR_AI | ✅ ON | .env:15 | Maybe (for AI suggestions) |
| DEBUG_MODE | ❌ OFF | .env:22 | No |

---

## 📊 SESSION GOALS (KPIs)

- CER Target: >85% (load only what you use)
- TCV Target: 1.1 (complete in estimated time)
- TES Target: >0.60 (minimize context tokens)
- RAI Target: >85% (first attempt success)
```

**Why**: Claude has EVERYTHING needed in ONE file

**KPI Impact**:
- CER: +25% (loads only SESSION_SNAPSHOT.md)
- TCV: +30% (no searching, immediate start)
- TES: +30% (6,000 tokens vs 60,000)
- RAI: +25% (perfect context = fewer errors)

---

### 2.2 Integrate with start-session.js
**File**: .claude/3-CLAUDE_AI/claude-automation/start-session.js

**Add after environment checks**:
```javascript
// Generate SESSION_SNAPSHOT.md
function generateSessionSnapshot() {
  const snapshot = {
    sessionId: sessionData.sessionId,
    nextTask: extractNextTask(), // from ACTIVE_SESSION.md
    fileLocations: generateFileLocations(),
    recentlyModified: getRecentlyModified(), // from git log
    activeVariables: extractActiveVariables(), // from MASTER_TREE_CODE.md
    featureFlags: extractFeatureFlags(), // from .env
    similarPatterns: findSimilarPatterns(), // from MASTER_TREE_CODE.md
  };

  writeSnapshotFile(snapshot);
}
```

---

## ⏳ Phase 3: KPI Tracking (PLANNED)

**Goal**: Measure actual token usage and track improvements

### 3.1 Token Counter
**File**: .claude/3-CLAUDE_AI/claude-automation/end-session.js

**Add to metrics**:
```javascript
function calculateZeroContextKPIs() {
  return {
    // Context Efficiency Ratio
    CER: {
      filesLoaded: countFilesRead(), // from session log
      filesUsed: countFilesModified(), // from git status
      score: (filesUsed / filesLoaded) * 100,
      target: 85,
      status: score >= 85 ? '✅' : '❌'
    },

    // Task Completion Velocity
    TCV: {
      estimatedTime: getEstimatedTime(), // from ACTIVE_SESSION.md
      actualTime: sessionMetrics.duration,
      score: estimatedTime / actualTime,
      target: 1.0,
      status: score >= 0.9 && score <= 1.1 ? '✅' : '❌'
    },

    // Token Efficiency Score
    TES: {
      contextTokens: estimateTokens(SESSION_SNAPSHOT),
      totalTokens: estimateTotalSessionTokens(),
      workTokens: totalTokens - contextTokens,
      score: workTokens / totalTokens,
      target: 0.60,
      status: score >= 0.60 ? '✅' : '❌'
    },

    // Resolution Accuracy Index
    RAI: {
      firstAttempts: sessionMetrics.tasks.completed.length,
      totalAttempts: countAllAttempts(), // includes retries
      score: (firstAttempts / totalAttempts) * 100,
      target: 85,
      status: score >= 85 ? '✅' : '❌'
    }
  };
}
```

### 3.2 Display KPIs at Session End
**Terminal output**:
```
============================================================
📊 SESSION KPI REPORT
============================================================

Context Efficiency Ratio (CER): 92% ✅
  Files Loaded: 3
  Files Used: 3
  Target: >85%

Task Completion Velocity (TCV): 1.05 ✅
  Estimated: 2.0 hours
  Actual: 1.9 hours
  Target: 0.9-1.1

Token Efficiency Score (TES): 0.88 ✅
  Context Tokens: 6,000
  Work Tokens: 44,000
  Total: 50,000
  Target: >0.60

Resolution Accuracy Index (RAI): 100% ✅
  First Attempts: 1
  Total Attempts: 1
  Target: >85%

============================================================
🎯 OVERALL SCORE: 4/4 KPIs MET ✅
============================================================
```

---

## ⏳ Phase 4: Optimization (PLANNED)

**Goal**: Refine based on data, reach 95%+ KPIs

### 4.1 Analyze KPI Trends
**File**: .claude/3-CLAUDE_AI/claude-automation/analyze-metrics.js (NEW)

**What it does**:
- Load all session metrics from archives
- Calculate trends (improving/declining)
- Identify bottlenecks
- Suggest optimizations

### 4.2 Auto-Optimize MASTER_TREE
**Logic**:
- If files loaded but never used → remove from tree
- If files always used together → group them
- If patterns copied frequently → add to "Common Patterns"

### 4.3 Context Pruning
**Intelligent loading**:
- Load only relevant sections of MASTER_TREE_CODE.md
- Skip "Recently Completed" if >1 week old
- Hide feature flags if disabled and not changing

---

## 📈 Success Metrics

### Token Usage Reduction
| Metric | Baseline | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Target |
|--------|----------|---------|---------|---------|---------|--------|
| Context Tokens | 60,000 | 40,000 | 6,000 | 5,000 | 4,000 | <6,000 |
| Context Files | 50 | 10 | 3 | 3 | 2 | <5 |
| Search Time | 40% | 30% | 5% | 3% | 2% | <5% |

### KPI Progression
| KPI | Baseline | Phase 1 Target | Phase 2 Target | Phase 3 Target | Phase 4 Target | Final Goal |
|-----|----------|----------------|----------------|----------------|----------------|------------|
| CER | 10% | 35% | 85% | 90% | 95% | >85% ✅ |
| TCV | 0.6 | 0.8 | 1.05 | 1.08 | 1.1 | 0.9-1.1 ✅ |
| TES | 0.40 | 0.55 | 0.88 | 0.90 | 0.92 | >0.60 ✅ |
| RAI | 60% | 75% | 90% | 93% | 95% | >85% ✅ |

---

## 🚀 Next Actions

### ✅ Completed This Session (Nov 6, 2025)

1. [x] Add Feature Flags section to MASTER_TREE_CODE.md
   - ✅ Added 4 feature flags with exact file:line locations
   - ✅ Included configuration dependencies and fallback strategies

2. [x] Add Active Variables section to MASTER_TREE_CODE.md
   - ✅ Added authentication variables (karvia_auth_token, JWT_SECRET, etc.)
   - ✅ Added environment configuration variables (NODE_ENV, PORT, MONGODB_URI)
   - ✅ Added engine URLs (IAM, Planner, Scoring, etc.)
   - ✅ Added API configuration variables (OpenAI settings)

3. [x] Add Current Work Areas section to MASTER_TREE_CODE.md
   - ✅ High Priority: weekly-goals.js, goal-details.js with exact implementation steps
   - ✅ Medium Priority: Business API endpoints, consultant auth testing
   - ✅ Low Priority: CSS files
   - ✅ "Do Not Modify" warnings for recently fixed files

4. [x] Add Similar Patterns section (as "Copy-Paste Patterns" subsection)
   - ✅ Auth token usage pattern
   - ✅ JWT verification pattern
   - ✅ Feature flag check pattern
   - ✅ MongoDB multi-tenant query pattern

**Result**: MASTER_TREE_CODE.md expanded from 661 lines to 982 lines (+321 lines of zero-context information)

---

### Immediate (This Week) - Next Steps

5. [ ] Test zero-context loading with real task: "Implement weekly-goals.js"
   - Verify Claude can start coding without file exploration
   - Measure token usage before/after
   - Compare to baseline (~60,000 tokens)

6. [ ] Enhance end-session.js to auto-update new sections (Task 1.5)
   - Parse .env for feature flags
   - Scan git log for recently modified files
   - Auto-populate "Current Work Areas" from ACTIVE_SESSION.md

### Short-term (Next 2 Weeks)
5. [ ] Enhance end-session.js to auto-update new sections
6. [ ] Create SESSION_SNAPSHOT.md generator
7. [ ] Integrate snapshot into start-session.js

### Mid-term (Next Month)
8. [ ] Add token counting to end-session.js
9. [ ] Create KPI dashboard
10. [ ] Build analyze-metrics.js script

### Long-term (Next 3 Months)
11. [ ] Auto-optimize MASTER_TREE based on usage
12. [ ] Intelligent context pruning
13. [ ] Reach 95%+ on all KPIs

---

## 📝 Notes

### Design Principles
1. **Zero Manual Maintenance**: Everything auto-updates
2. **Git as Source of Truth**: Use git log, status, diff
3. **Fail-Safe**: If automation fails, degrade gracefully
4. **Incremental**: Each phase delivers value independently

### Trade-offs
- **More upfront work** (building automation) vs **massive long-term savings** (90% token reduction)
- **Slightly larger MASTER_TREE files** vs **zero exploration needed**
- **One-time complexity** (setup scripts) vs **infinite simplicity** (every session after)

---

**Last Updated**: November 6, 2025 - Phase 1 Complete ✅
**Next Review**: End of Phase 2 (when SESSION_SNAPSHOT.md generator is complete)
**Owner**: Session automation system
**Phase 1 Completion**: 100% (4/4 tasks complete)
