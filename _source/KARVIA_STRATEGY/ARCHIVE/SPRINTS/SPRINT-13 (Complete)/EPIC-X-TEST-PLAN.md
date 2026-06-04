# Epic X: Unified LLM Context Service - Test Plan

**Sprint**: 13
**Epic**: X - Unified LLM Context Service
**Date**: February 20, 2026
**Status**: Testing Phase

---

## Automated Validation Results

### Syntax Validation ✅ ALL PASSED

| File | Status |
|------|--------|
| `server/services/AIContextService.js` | ✅ Valid |
| `server/models/AIInteractionLog.js` | ✅ Valid |
| `server/routes/planning.js` | ✅ Valid |
| `server/routes/ai-okr.js` | ✅ Valid |
| `server/routes/goals.js` | ✅ Valid |
| `server/models/Company.js` | ✅ Valid |
| `server/models/AIOKRSuggestion.js` | ✅ Valid |
| `client/pages/scripts/planning-v2.js` | ✅ Valid |
| `client/js/ai-okr-api-client.js` | ✅ Valid |

### AIContextService Methods ✅ ALL EXIST

| Method | Purpose | Status |
|--------|---------|--------|
| `getFullSSIScores()` | X1: 12-block SSI data | ✅ |
| `buildContext()` | X2: Unified context builder | ✅ |
| `getContextDelta()` | X3: Delta detection | ✅ |
| `logInteraction()` | X5: Interaction logging | ✅ |
| `getRejectionHistory()` | X6: Rejection tracking | ✅ |
| `getTaskHistory()` | X7: Task history | ✅ |
| `getTaskHistorySummary()` | X7: Condensed history | ✅ |
| `getBlockDimension()` | X1: Block dimension helper | ✅ |
| `getBlockOKRFocus()` | X1: Block OKR focus helper | ✅ |

### AIInteractionLog Model ✅ ALL VALID

| Component | Status |
|-----------|--------|
| Schema fields (company_id, user_id, etc.) | ✅ |
| Nested fields (context_snapshot, prompt, response, outcome) | ✅ |
| Static methods (logInteraction, getCompanyHistory, etc.) | ✅ |
| TTL index (1 year retention) | ✅ |

### Planning.js Endpoint ✅ FOUND

| Endpoint | Location | Status |
|----------|----------|--------|
| `POST /api/planning/generate-tasks` | Line 1461 | ✅ |

### Frontend Functions ✅ ALL EXPORTED

| Function | Purpose | Status |
|----------|---------|--------|
| `showAssignmentDropdown()` | X10: Open dropdown | ✅ |
| `closeAssignmentDropdown()` | X10: Close dropdown | ✅ |
| `assignWeeklyGoal()` | X10: Assign goal | ✅ |

---

## Manual Test Plan

### Pre-requisites
1. Server running (`npm run dev`)
2. User logged in with MANAGER+ role
3. At least one company with SSI assessment data
4. At least one objective with key results

---

### X1: 12-Block SSI in AIContextService

**Test Steps**:
1. Open browser DevTools console
2. Navigate to AI OKR Generation page
3. Verify network request includes 12-block SSI data

**Expected**:
- SSI data includes `blocks` object with 12 blocks
- `priorityBlocks` array sorted by gap
- `weakAreas` and `strongAreas` populated

**Verification**:
```javascript
// In server logs, look for:
[AIContextService] SSI context built: {...}
```

---

### X2: Unified buildContext() Method

**Test Steps**:
1. Trigger AI task generation
2. Check server logs for context building

**Expected**:
- Log shows `[AIContextService] Building context for scope: task`
- Context includes layers: company, ssi, business, okrs, planning
- Token count logged: `tokensUsed: XXXX`

**Verification**:
```javascript
// Context should include:
{
  company: {...},
  ssi: { dimensions, blocks, weakAreas, ... },
  okrs: {...},
  planning: {...},
  metadata: { scope, tokensUsed, ... }
}
```

---

### X3: Context Delta Detection

**Test Steps**:
1. Create a new objective
2. Generate AI tasks
3. Check if delta includes the new objective

**Expected**:
- Delta includes `objective_created` change
- Change shows objective ID and title

**Verification**:
```javascript
// Delta in context:
{
  delta: {
    since: 'ISO date',
    changes: [{ type: 'objective_created', id: '...', title: '...' }]
  }
}
```

---

### X4: Planning Context Consolidation

**Test Steps**:
1. Navigate to Planning page
2. Click "Generate Weekly Plan" or "Generate Tasks"
3. Check server logs

**Expected**:
- No duplicate SSI fetching (removed old inline code)
- Uses `aiContextService.buildContext()`
- 12-block data included in prompts

---

### X5: AIInteractionLog Model

**Test Steps**:
1. Trigger any AI generation
2. Check MongoDB `aiinteractionlogs` collection

**Expected**:
- New document created with:
  - `interaction_type`: 'task_generation' or similar
  - `context_snapshot`: summarized context
  - `prompt`: system and user prompts
  - `response`: AI response with latency_ms
  - `outcome`: status and item counts

**MongoDB Query**:
```javascript
db.aiinteractionlogs.find().sort({created_at: -1}).limit(1)
```

---

### X6: Rejection Reason Tracking

**Test Steps**:
1. Navigate to AI OKR Review page
2. Click "Dismiss" on a suggestion
3. Select a reason category (e.g., "Too Generic")
4. Confirm dismissal

**Expected**:
- Modal shows reason picker
- API call includes `reasonCategory`
- AIOKRSuggestion document updated with:
  - `dismissed_reason`: user text
  - `dismissed_reason_category`: selected category

---

### X7: 1-Year Task History

**Test Steps**:
1. Trigger AI task generation
2. Check server logs for task history

**Expected**:
- Log shows `[AIContextService] Task history: X tasks, Y% completion rate`
- Context includes `history.taskPatterns`:
  - `totalTasks`, `completionRate`
  - `topPatterns`: ["Research *", "Review *", ...]
  - `guidance`: text based on completion rate

---

### X8: AI-Powered Task Generation Endpoint

**Test Steps**:
1. Navigate to Planning page
2. Select a weekly goal
3. Click "Add Tasks" button (if no tasks exist)

**Expected**:
- POST `/api/planning/generate-tasks` called
- Response includes:
  - `tasks`: array of 4 tasks
  - `reasoning`: AI explanation
  - `context_used`: summary of context

**Network Response**:
```json
{
  "success": true,
  "tasks": [
    { "name": "...", "description": "...", "priority": "high", "estimated_hours": 2, "suggested_day": "monday" }
  ],
  "reasoning": "Based on your SSI weak areas...",
  "context_used": { "goal": "...", "has_ssi": true, ... }
}
```

---

### X9: Frontend Generate with AI Reasoning

**Test Steps**:
1. Navigate to Planning page
2. Click "Add Tasks" on a week with no tasks
3. Observe loading states
4. Check for AI reasoning section

**Expected**:
- Loading messages rotate: "Analyzing your organization...", etc.
- After completion, collapsible "AI Reasoning" section appears
- Badges show: "SSI-aware", "Based on history", etc.
- Clicking expands to show reasoning text

---

### X10: Weekly Goal Assignment UI

**Test Steps**:
1. Navigate to Planning page (as MANAGER+)
2. Click on "Unassigned" label on a week card
3. Select a team member from dropdown

**Expected**:
- Dropdown shows team members with:
  - Avatar and name
  - Role
  - Workload indicator (green/amber/red)
- Clicking member assigns goal
- UI updates immediately
- Toast shows "Goal assigned to [name]"

**RBAC Test**:
- As EMPLOYEE: Unassigned label should NOT be clickable

---

## Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| X1: 12-Block SSI | ⬜ Pending | |
| X2: buildContext() | ⬜ Pending | |
| X3: Delta Detection | ⬜ Pending | |
| X4: Planning Consolidation | ⬜ Pending | |
| X5: AIInteractionLog | ⬜ Pending | |
| X6: Rejection Tracking | ⬜ Pending | |
| X7: Task History | ⬜ Pending | |
| X8: Task Generation API | ⬜ Pending | |
| X9: Frontend AI Reasoning | ⬜ Pending | |
| X10: Assignment UI | ⬜ Pending | |

---

## Known Issues

None identified during automated validation.

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | Claude Code | Feb 20, 2026 | ✅ Code Complete |
| QA | | | ⬜ Pending |
| Product | | | ⬜ Pending |

---

**Last Updated**: February 20, 2026
**Created By**: Claude Code
