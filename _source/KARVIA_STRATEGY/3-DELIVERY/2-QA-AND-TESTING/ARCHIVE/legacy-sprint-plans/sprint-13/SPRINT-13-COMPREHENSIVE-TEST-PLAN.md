# Sprint 13 Comprehensive Test Plan

**Sprint**: 13 - Objectives + SSI Report + Branding + Unified LLM Context
**Version**: 1.0.0
**Created**: February 16, 2026
**Total Points**: 96 pts
**Duration**: 3 weeks
**Status**: PLANNED

---

## Test Coverage Summary

> **Updated**: February 17, 2026 - Added 23 tests per Execution Audit

| Epic | Points | Test Cases | Priority |
|------|--------|------------|----------|
| X (Unified LLM Context) | 42 | 92 (+7 X9 tests) | P0 |
| U2 (Objectives Redesign) | 5 | 24 | P0 |
| V (SSI Report Redesign) | 6 | 28 | P0 |
| N (Advanced OKR) | 21 | 42 | P1 |
| O (SSI Intelligence) | 12 | 32 | P1 |
| R (Chief AI Branding) | 3 | 12 | P2 |
| T (Design System) | 5 | 18 | P2 |
| BF (Bug Fix) | 2 | 8 | P1 |
| Boundary Cases | — | 24 (+16 new) | P0-P2 |
| **Total** | **96** | **280** | |

---

## Epic X: Unified LLM Context Service (42 pts)

### X1: 12-Block SSI in AIContextService (5 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X1-001 | `getFullSSIScores()` returns 12-block data | Unit | P0 | Yes |
| X1-002 | Response includes all 12 blocks | Unit | P0 | Yes |
| X1-003 | `priorityBlocks` sorted by gap | Unit | P0 | Yes |
| X1-004 | `weakAreas` identifies scores < 6 | Unit | P0 | Yes |
| X1-005 | `strongAreas` identifies scores > 8 | Unit | P1 | Yes |
| X1-006 | Fallback to 3D if no 12-block data | Unit | P0 | Yes |
| X1-007 | `has12BlockData` flag correct | Unit | P1 | Yes |
| X1-008 | ai-okr.js uses new service method | Integration | P0 | Yes |
| X1-009 | No duplicate `fetchSSIDataForCompany` code | Code Review | P0 | Manual |

#### Edge Cases

| ID | Test Case | Expected |
|----|-----------|----------|
| X1-E01 | No SSI data for company | Fallback with empty scores |
| X1-E02 | Partial SSI (3D only) | `has12BlockData: false` |
| X1-E03 | Missing blocks in data | Default to 0, flag incomplete |
| X1-E04 | Very old assessment | Still returns data |

---

### X2: Unified buildContext() Method (5 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X2-001 | `buildContext(companyId, {scope: 'okr'})` returns foundation + OKR | Integration | P0 | Yes |
| X2-002 | `buildContext(companyId, {scope: 'weekly'})` includes planning | Integration | P0 | Yes |
| X2-003 | `buildContext(companyId, {scope: 'task'})` includes tasks | Integration | P0 | Yes |
| X2-004 | `buildContext(companyId, {scope: 'full'})` returns everything | Integration | P0 | Yes |
| X2-005 | Context includes company profile | Integration | P0 | Yes |
| X2-006 | Context includes SSI 12-block | Integration | P0 | Yes |
| X2-007 | Context includes existing objectives | Integration | P0 | Yes |
| X2-008 | Context includes team info | Integration | P1 | Yes |
| X2-009 | `includeHistory: true` adds rejection history | Integration | P1 | Yes |
| X2-010 | Focus context includes specific item | Integration | P1 | Yes |

#### Edge Cases

| ID | Test Case | Expected |
|----|-----------|----------|
| X2-E01 | Invalid companyId | Throws error |
| X2-E02 | No objectives exist | `objectives.total: 0` |
| X2-E03 | No team members | `team.count: 0` |
| X2-E04 | Missing company profile | Partial context with warnings |

---

### X3: Context Delta Detection (3 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X3-001 | Delta tracks `last_llm_interaction` | Integration | P1 | Yes |
| X3-002 | New objectives appear in delta | Integration | P1 | Yes |
| X3-003 | KR progress changes (>10%) in delta | Integration | P1 | Yes |
| X3-004 | Tasks completed in delta | Integration | P1 | Yes |
| X3-005 | SSI score updates in delta | Integration | P2 | Yes |
| X3-006 | `since` timestamp correct | Unit | P1 | Yes |

#### Edge Cases

| ID | Test Case | Expected |
|----|-----------|----------|
| X3-E01 | First interaction (no previous) | Empty delta, current as baseline |
| X3-E02 | No changes since last | `changes: []` |
| X3-E03 | Many changes (100+) | Truncated to most recent 50 |

---

### X4: Consolidate Planning Context (3 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X4-001 | planning.js SSI fetching removed | Code Review | P0 | Manual |
| X4-002 | planning.js uses `AIContextService.buildContext()` | Integration | P0 | Yes |
| X4-003 | Weekly goal generation includes 12-block | Integration | P0 | Yes |
| X4-004 | Generated goals reference weak areas | Integration | P1 | No |

#### Regression Tests

| ID | Test Case | Expected |
|----|-----------|----------|
| X4-R01 | Generate weekly goals still works | Goals created |
| X4-R02 | Goal titles still relevant | Context-aware |
| X4-R03 | No duplicate SSI fetching in logs | Single call |

---

### X5: AIInteractionLog Model (5 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X5-001 | Model schema validates | Unit | P0 | Yes |
| X5-002 | Log created on OKR generation | Integration | P0 | Yes |
| X5-003 | Log created on weekly plan gen | Integration | P0 | Yes |
| X5-004 | Log created on task generation | Integration | P0 | Yes |
| X5-005 | Context snapshot stored | Integration | P0 | Yes |
| X5-006 | Prompt and response stored | Integration | P0 | Yes |
| X5-007 | Outcome tracked (success/error) | Integration | P0 | Yes |
| X5-008 | Items generated/approved counted | Integration | P1 | Yes |
| X5-009 | TTL index cleans old logs | Integration | P2 | Yes |

#### Data Validation

| ID | Test Case | Expected |
|----|-----------|----------|
| X5-D01 | `interaction_type` enum valid | Rejects invalid types |
| X5-D02 | `company_id` required | Validation error if missing |
| X5-D03 | `created_at` auto-set | Timestamp generated |

---

### X6: Track Rejection Reasons (3 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X6-001 | Dismiss modal shows reason picker | E2E | P0 | No |
| X6-002 | Reason categories available | E2E | P0 | No |
| X6-003 | Reason stored on dismissal | Integration | P0 | Yes |
| X6-004 | Rejection appears in interaction log | Integration | P0 | Yes |
| X6-005 | `getRejectionHistory()` returns history | Unit | P0 | Yes |
| X6-006 | Future prompts include rejection history | Integration | P0 | Yes |

#### Reason Categories

| ID | Reason | UI Label |
|----|--------|----------|
| REJ-001 | `too_generic` | "Too generic" |
| REJ-002 | `not_relevant` | "Not relevant to business" |
| REJ-003 | `already_exists` | "We already have this" |
| REJ-004 | `wrong_scope` | "Wrong scope (too big/small)" |
| REJ-005 | `unrealistic` | "Not achievable" |
| REJ-006 | `other` | "Other (specify)" |

---

### X7: 1-Year Task History (5 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X7-001 | `getTaskHistory()` returns 12-month data | Unit | P0 | Yes |
| X7-002 | Completion rate calculated correctly | Unit | P0 | Yes |
| X7-003 | Common task patterns identified | Unit | P1 | Yes |
| X7-004 | Velocity trend calculated | Unit | P1 | Yes |
| X7-005 | Category breakdown included | Unit | P1 | Yes |
| X7-006 | History included in task context | Integration | P0 | Yes |

#### Edge Cases

| ID | Test Case | Expected |
|----|-----------|----------|
| X7-E01 | No tasks in history | `totalTasks: 0`, valid response |
| X7-E02 | Tasks < 12 months | Returns available data |
| X7-E03 | 10,000+ tasks | Performance < 2s |

---

### X8: AI Task Generation Endpoint (5 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X8-001 | `POST /api/planning/generate-tasks` exists | Integration | P0 | Yes |
| X8-002 | Requires goal_id parameter | Integration | P0 | Yes |
| X8-003 | Returns task array | Integration | P0 | Yes |
| X8-004 | Tasks include name, description, priority | Integration | P0 | Yes |
| X8-005 | Context includes SSI weak areas | Integration | P0 | Yes |
| X8-006 | Context includes existing tasks (no duplication) | Integration | P1 | Yes |
| X8-007 | Context includes task history | Integration | P1 | Yes |
| X8-008 | Reasoning returned in response | Integration | P1 | Yes |
| X8-009 | Fallback if AI disabled | Integration | P0 | Yes |

#### Edge Cases

| ID | Test Case | Expected |
|----|-----------|----------|
| X8-E01 | Invalid goal_id | 400 error |
| X8-E02 | AI timeout | Fallback to template |
| X8-E03 | All weeks have tasks | Generates unique tasks |

---

### X9: Frontend Generate Buttons + AI Reasoning UI (5 pts)

> **Updated**: Per Execution Audit - expanded to include AI reasoning UI tests

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X9-001 | Generate Weekly Goals calls unified context | E2E | P0 | No |
| X9-002 | Generate Tasks calls new endpoint | E2E | P0 | No |
| X9-003 | Loading state with context message | E2E | P1 | No |
| X9-004 | AI reasoning collapsible shown | E2E | P1 | No |
| X9-005 | Error handling graceful | E2E | P0 | No |

#### AI Reasoning UI Tests (Added per Audit)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X9-006 | "Why?" button visible on AI-generated items | E2E | P1 | No |
| X9-007 | Reasoning panel expands on click | E2E | P1 | No |
| X9-008 | Reasoning panel collapses on second click | E2E | P2 | No |
| X9-009 | Reasoning text populated from API response | E2E | P1 | No |
| X9-010 | Empty reasoning handled gracefully | E2E | P1 | No |
| X9-011 | Multiple items have individual reasoning | E2E | P2 | No |
| X9-012 | Reasoning persists after page scroll | E2E | P2 | No |

**Test Steps for X9-006 to X9-009**:
```
1. Navigate to Planning page
2. Select a KR without weekly goals
3. Click "Generate Weekly Goals"
4. Wait for AI response
5. VERIFY: Each goal card has "Why?" button (X9-006)
6. Click "Why?" on first goal
7. VERIFY: Reasoning panel expands with text (X9-007, X9-009)
8. Click "Why?" again
9. VERIFY: Panel collapses (X9-008)
10. Approve goals with reasoning shown
11. VERIFY: Goals created successfully
```

---

### X10: Weekly Goal Assignment UI (5 pts)

#### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| X10-001 | "Unassigned" label clickable | E2E | P0 | No |
| X10-002 | Team member dropdown appears | E2E | P0 | No |
| X10-003 | Members show name, role, workload | E2E | P1 | No |
| X10-004 | Select assigns goal | E2E | P0 | No |
| X10-005 | UI updates with assignee avatar | E2E | P1 | No |
| X10-006 | Task assignment same pattern | E2E | P1 | No |
| X10-007 | RBAC: Only MANAGER+ can reassign | E2E | P0 | No |

---

## Epic U2: Objectives Page Redesign (5 pts)

### Visual Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| U2-001 | S13 patterns applied | Visual | P0 | No |
| U2-002 | Navy/gold branding correct | Visual | P0 | No |
| U2-003 | Progress rings render | Visual | P1 | No |
| U2-004 | Category pills display | Visual | P1 | No |

### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| U2-010 | Objectives list loads | E2E | P0 | Yes |
| U2-011 | KRs display inline | E2E | P0 | No |
| U2-012 | 6-state status system works | E2E | P1 | No |
| U2-013 | KR color coding correct | E2E | P1 | No |
| U2-014 | Quarter selector filters | E2E | P1 | No |
| U2-015 | AI badge shows when `ai_generated` | E2E | P2 | No |
| U2-016 | Owner avatar displays | E2E | P2 | No |

### KR Progress Color Tests

| Percentage | Expected Class | Color |
|------------|----------------|-------|
| 100% | `kr-complete` | Green |
| 70-99% | `kr-70plus` | Blue |
| 40-69% | `kr-40plus` | Amber |
| 1-39% | `kr-below-40` | Red |
| 0% | `kr-not-started` | Gray |

---

## Epic V: SSI Report Redesign (6 pts)

### Functional Tests

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| V-001 | SSI Report page loads | E2E | P0 | Yes |
| V-002 | SSI scores from API | Integration | P0 | Yes |
| V-003 | 12-block breakdown displays | E2E | P0 | No |
| V-004 | Industry benchmarks from API | Integration | P1 | Yes |
| V-005 | LLM narratives display | E2E | P1 | No |
| V-006 | Share link generation | E2E | P1 | No |
| V-007 | 7-day expiry on share link | Integration | P1 | Yes |
| V-008 | PDF export works | E2E | P2 | No |

---

## Epic N: Advanced OKR Features (21 pts)

### N1: Objective Creation Wizard (5 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| N1-001 | Wizard opens from button | E2E | P0 | No |
| N1-002 | AI-assisted creation available | E2E | P1 | No |
| N1-003 | Manual creation path works | E2E | P0 | No |
| N1-004 | Category selection required | E2E | P0 | No |
| N1-005 | Owner assignment works | E2E | P1 | No |

### N2: Key Result Management (5 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| N2-001 | Create KR under objective | E2E | P0 | No |
| N2-002 | KR metrics configurable | E2E | P1 | No |
| N2-003 | Edit KR | E2E | P1 | No |
| N2-004 | Delete KR (cascade check) | E2E | P1 | No |

### N3: Objective Owner Assignment (3 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| N3-001 | Assign owner from dropdown | E2E | P0 | No |
| N3-002 | Owner avatar displays on card | E2E | P1 | No |
| N3-003 | Reassign to different owner | E2E | P1 | No |
| N3-004 | Owner receives notification | Integration | P2 | Yes |

#### N3 Edge Cases (Added per Audit)

| ID | Test Case | Expected | Priority |
|----|-----------|----------|----------|
| N3-E01 | Reassign to deactivated user | User not in dropdown | P1 |
| N3-E02 | Reassign during concurrent edit | Last write wins or conflict warning | P2 |
| N3-E03 | Owner tries to assign to self | Allowed (no change) | P2 |
| N3-E04 | Check KR owner after objective owner change | KR owners unchanged | P1 |

### N4: Status Automation (4 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| N4-001 | Status auto-computes from KR progress | Unit | P0 | Yes |
| N4-002 | "At Risk" when 25% behind | Unit | P0 | Yes |
| N4-003 | "Needs Attention" when 10% behind | Unit | P1 | Yes |
| N4-004 | "Completed" when 100% | Unit | P0 | Yes |

---

## Epic O: SSI Intelligence (12 pts)

### O1: Team-Level SSI (3 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| O1-001 | Team SSI aggregation displays | E2E | P1 | No |
| O1-002 | Team trends visible | E2E | P2 | No |
| O1-003 | Uses existing endpoint | Integration | P0 | Yes |

### O2: Company-Level Dashboard (4 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| O2-001 | Department breakdown shows | E2E | P1 | No |
| O2-002 | Org benchmarks displayed | E2E | P1 | No |

### O3: Cross-Level Comparison (3 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| O3-001 | Individual vs Team vs Org chart | E2E | P1 | No |
| O3-002 | Comparison data from API | Integration | P0 | Yes |

### O4: PDF Export (2 pts)

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| O4-001 | PDF export button works | E2E | P1 | No |
| O4-002 | PDF includes all SSI data | E2E | P2 | No |

---

## Epic BF: Bug Fix (2 pts)

### BF1: Phantom Assessment on Client Add

| ID | Test Case | Type | Priority | Auto |
|----|-----------|------|----------|------|
| BF1-001 | Add client does NOT create assessment | Integration | P0 | Yes |
| BF1-002 | "Sent by Me" empty after add client | E2E | P0 | No |
| BF1-003 | Assessment only via explicit wizard | E2E | P0 | No |

---

## Cross-Page Journey Tests

### Journey: Full AI Context Flow

| Step | Action | Verify | Priority |
|------|--------|--------|----------|
| 1 | Login as Executive | Dashboard loads | P0 |
| 2 | View Team SSI | 12-block scores visible | P0 |
| 3 | Generate OKRs | Context includes SSI | P0 |
| 4 | Review suggestions | AI reasoning visible | P1 |
| 5 | Reject one with reason | Reason picker shown | P0 |
| 6 | Approve others | Objectives created | P0 |
| 7 | Check AIInteractionLog | Record exists | P0 |
| 8 | Open Planning page | Objectives visible | P0 |
| 9 | Generate weekly goals | Context includes OKRs | P0 |
| 10 | Check context | SSI + OKRs in context | P0 |
| 11 | Generate tasks | Context includes history | P1 |
| 12 | Verify rejection in context | Rejection visible | P0 |
| 13 | Regenerate | Avoids rejected pattern | P1 |

---

## Boundary & Corner Cases

> **Updated**: Per Execution Audit - added token limit and concurrent operation tests

### Context Token Limits (Added per Audit)

| ID | Test | Expected | Priority |
|----|------|----------|----------|
| BC-001 | Context < 4000 tokens | Full context passed | P0 |
| BC-002 | Context 4000-8000 tokens | Context passed, warning logged | P1 |
| BC-003 | Context > 8000 tokens | Prioritized truncation applied | P0 |
| BC-004 | Truncation preserves SSI 12-block | SSI always in context | P0 |
| BC-005 | Truncation preserves recent objectives | Last 10 objectives kept | P1 |
| BC-006 | Truncation removes old task history | History truncated first | P1 |
| BC-007 | Token count logged in AIInteractionLog | `prompt.tokens_estimated` populated | P1 |

**Token Limit Handling Strategy**:
```
Priority Order (highest to lowest):
1. Company profile (always keep)
2. SSI 12-block scores (always keep)
3. Active objectives (keep up to 10)
4. Current focus item (always keep)
5. Rejection history (keep last 20)
6. Weekly goals (keep current quarter)
7. Task history (truncate to fit)

Max target: 8000 tokens
```

### Context Size Performance

| ID | Test | Expected | Priority |
|----|------|----------|----------|
| BC-010 | 1000+ tasks in history | Query < 2s | P1 |
| BC-011 | 50+ objectives | Context builds < 1s | P1 |
| BC-012 | 100+ team members | Context builds < 1s | P2 |

### AI Service Failures

| ID | Test | Expected | Priority |
|----|------|----------|----------|
| BC-020 | OpenAI timeout (30s) | Error message + retry button | P0 |
| BC-021 | OpenAI rate limit (429) | Queue message + auto-retry | P1 |
| BC-022 | OpenAI invalid response | Fallback to template | P0 |
| BC-023 | OpenAI partial response | Parse what's available | P2 |

### Concurrent Operations (Added per Audit)

| ID | Test | Expected | Priority |
|----|------|----------|----------|
| BC-030 | Two users generate OKRs simultaneously | Both get results | P1 |
| BC-031 | Same user double-clicks generate | Second click blocked | P0 |
| BC-032 | Context changes during generation | Uses snapshot from start | P1 |
| BC-033 | Objective created during task gen | New objective in next context | P2 |

### Data Edge Cases

| ID | Test | Expected | Priority |
|----|------|----------|----------|
| BC-040 | No SSI data | Graceful degradation, company-only context | P0 |
| BC-041 | No objectives yet | Context builds with empty objectives | P0 |
| BC-042 | Brand new company | Minimal context works | P0 |
| BC-043 | Company with only 3D SSI (no 12-block) | `has12BlockData: false`, uses 3D | P1 |
| BC-044 | Team without department field | O2 shows "Unassigned" | P1 |

---

## Test Execution Schedule

### Week 1: Epic X Foundation

| Day | Focus | Tests |
|-----|-------|-------|
| 1 | X1 (12-Block SSI) | X1-001 to X1-009 |
| 2 | X2 (buildContext) | X2-001 to X2-010 |
| 3 | X3, X4 (Delta, Planning) | X3-001 to X4-004 |
| 4 | X5 (AIInteractionLog) | X5-001 to X5-009 |
| 5 | X6, X7 (Rejections, History) | X6-001 to X7-006 |

### Week 2: Epic X + Objectives

| Day | Focus | Tests |
|-----|-------|-------|
| 6 | X8 (Task Endpoint) | X8-001 to X8-009 |
| 7 | X9, X10 (Frontend) | X9-001 to X10-007 |
| 8 | U2 (Objectives) | U2-001 to U2-016 |
| 9 | N1, N2 (OKR Creation) | N1-001 to N2-004 |
| 10 | N3-N6 (OKR Features) | Full N epic |

### Week 3: SSI + Branding

| Day | Focus | Tests |
|-----|-------|-------|
| 11 | V (SSI Report) | V-001 to V-008 |
| 12 | O1, O2 (SSI Intel) | O1-001 to O2-002 |
| 13 | O3, O4 (Comparison, PDF) | O3-001 to O4-002 |
| 14 | R, BF (Branding, Bug Fix) | All R, BF tests |
| 15 | T (Design Audit) | Full page audit |

---

## Sign-Off

### Test Completion Summary

| Category | Total | Pass | Fail | Skip |
|----------|-------|------|------|------|
| Unit Tests | 48 | | | |
| Integration | 89 | | | |
| E2E | 105 | | | |
| Visual | 12 | | | |
| Journey | 13 | | | |
| Boundary Cases | 24 | | | |
| **Total** | **291** | | | |

### Pre-Sprint Checklist (Per Audit)

- [ ] Team.department field verified (DONE - exists at line 36)
- [ ] AI context test fixtures created
- [ ] OpenAI mock service configured
- [ ] Schedule rebalanced (DONE - see Master Plan)
- [ ] Token counting utility implemented

### Approvals

| Role | Name | Date | Sign |
|------|------|------|------|
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |

---

**Document Created**: February 16, 2026
**Updated**: February 17, 2026 (Per Execution Audit)
**Author**: Claude Code
**Review**: Sprint 13 Day 1
