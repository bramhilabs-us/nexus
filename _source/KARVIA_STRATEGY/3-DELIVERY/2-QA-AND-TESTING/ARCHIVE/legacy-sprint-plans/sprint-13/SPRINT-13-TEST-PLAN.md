# Sprint 13 Test Plan — Strategy Pages + Branding

**Sprint**: 13 | **Points**: 58 | **Pages**: Objectives, SSI Report
**Epics**: U2, V, N, O, R, T
**Created**: January 27, 2026
**Updated**: January 27, 2026 (Post-Audit)

---

## Test Summary

| Category | Test Cases | Priority |
|----------|-----------|----------|
| Unit Tests | 82 | P0-P2 |
| Integration Tests | 40 | P0-P1 |
| E2E / Playwright | 34 | P0-P1 |
| Edge Cases | 30 | P1-P2 |
| CONSULTANT Role Tests | 5 | P0 |
| Share Link Security | 2 | P0 |
| Pagination Tests | 2 | P1 |
| **Total** | **195** | |

---

## 1. Epic U2 — Objectives Page Redesign (5 pts)

### 1.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U2-U01 | KPI: Active count = `objectives.filter(o => o.status === 'active').length` | Correct count | P0 |
| U2-U02 | KPI: Overall progress = average of all `objective.progress` | Rounded average | P0 |
| U2-U03 | KPI: KR count = sum of `objective.key_results.length` | Total KR count | P0 |
| U2-U04 | KPI: At Risk count from `status === 'at_risk'` | Correct count | P0 |
| U2-U05 | Category pills computed from unique `objective.category` values | No hardcoded pills | P0 |
| U2-U06 | Category pill count = objectives with that category | Per-category count | P0 |
| U2-U07 | Quarter selector derived from objective date ranges | Dynamic, not hardcoded | P0 |
| U2-U08 | Category Coverage widget: `CategoryIcons.getAllCategories()` returns 6 | 6 MECE categories | P0 |
| U2-U09 | Coverage: "X of 6 covered" computed from objectives with distinct categories | Dynamic count | P0 |
| U2-U10 | Coverage item class: `has-objectives` vs `no-objectives` | Correct class applied | P0 |
| U2-U11 | Objective card label: "Obj 1", "Obj 2" from array index | `Obj ${index + 1}` | P0 |
| U2-U12 | Objective card category badge via `CategoryIcons.getBadge()` | Correct icon + label | P0 |
| U2-U13 | Status badge: 6-state logic | See status mapping below | P0 |
| U2-U14 | Status: `completed` → class `completed`, label "Completed" | Correct mapping | P0 |
| U2-U15 | Status: `not_started` → class `not-started`, label "Not Started" | Correct mapping | P0 |
| U2-U16 | Status: gap > 25 → class `at-risk`, label "At Risk" | Dynamic computation | P0 |
| U2-U17 | Status: gap > 10 → class `needs-attention`, label "Needs Attention" | Dynamic computation | P0 |
| U2-U18 | Status: progress > 0 → class `in-progress`, label "In Progress" | Default active state | P0 |
| U2-U19 | AI badge shown only when `objective.ai_generated === true` | Conditional render | P0 |
| U2-U20 | Objective title rendered with `escapeHtml()` | XSS safe | P0 |
| U2-U21 | Progress ring via `renderScoreRing()` | SVG from Sprint 11 | P0 |
| U2-U22 | Owner avatar via `getInitials()` | Initials displayed | P0 |
| U2-U23 | KR item color: ≥100 → green, ≥70 → blue, ≥40 → amber, >0 → red, 0 → gray | 5 thresholds | P0 |
| U2-U24 | KR item ID label: `O${objIndex+1}-KR${krIndex+1}` | Dynamic label | P0 |
| U2-U25 | KR item meta: `kr.current_value` / `kr.target_value` | Both values shown | P0 |
| U2-U26 | `expectedProgress` computed from time elapsed in period | Dynamic calculation | P0 |

### 1.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U2-I01 | `GET /api/objectives` returns objectives with KRs populated | KR array included | P0 |
| U2-I02 | `GET /api/objectives` returns objectives with owner populated | Owner name included | P0 |
| U2-I03 | Objectives filtered by company_id | Multi-tenant isolation | P0 |
| U2-I04 | Objectives filtered by status when query param provided | Status filter works | P0 |
| U2-I05 | `CategoryIcons.getAllCategories()` returns 6 categories | growth, customer_success, operations, people_culture, innovation, financial_health | P0 |

### 1.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| U2-E01 | Objectives page loads with KPI cards | Login → Navigate | 4 KPIs with dynamic values | P0 |
| U2-E02 | Category pills filter objectives | Click a category pill | Only matching objectives shown | P0 |
| U2-E03 | Category Coverage widget shows X of 6 | Check widget | Dynamic coverage count | P0 |
| U2-E04 | Objective cards display with progress rings | Check cards | SVG rings, status badges | P0 |
| U2-E05 | KR items show progress colors | Check KR list | Color matches percentage | P0 |
| U2-E06 | Quarter selector filters by quarter | Click Q2 | Only Q2 objectives shown | P0 |
| U2-E07 | Empty state when no objectives | New company, no objectives | "Create your first objective" | P0 |
| U2-E08 | Status badges reflect computed state | Check at-risk objective | "At Risk" badge with correct class | P0 |

### 1.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U2-X01 | 0 objectives — all KPIs show 0 | No NaN, no crash | P0 |
| U2-X02 | Objective with 0 KRs — card renders without KR section | No crash | P0 |
| U2-X03 | KR with 0% progress — gray bar, gray label | Not-started styling | P0 |
| U2-X04 | KR with 150% progress (over-achievement) — capped at full bar | Green, ≥100 color | P1 |
| U2-X05 | All 6 categories covered — "6 of 6 covered" | Full coverage | P1 |
| U2-X06 | 0 categories covered — "0 of 6 covered" | All items `no-objectives` class | P0 |
| U2-X07 | Objective with null owner — graceful handling | "Unassigned" placeholder | P0 |
| U2-X08 | 50+ objectives — performance and scroll | Renders within 2 seconds | P1 |
| U2-X09 | expectedProgress at period start = 0%, at period end = 100% | Boundary values correct | P0 |
| U2-X10 | 100+ objectives — pagination or virtual scroll | Page loads without performance degradation | P1 |

---

## 2. Epic V — SSI Report Page Redesign (6 pts)

### 2.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| V-U01 | SSI score rendering from `response.dimensions.speed` | Dynamic value | P0 |
| V-U02 | SSI score rendering from `response.dimensions.strength` | Dynamic value | P0 |
| V-U03 | SSI score rendering from `response.dimensions.intelligence` | Dynamic value | P0 |
| V-U04 | 12-block scores from `response.blocks[].score` | All 12 blocks dynamic | P0 |
| V-U05 | Score colors computed from thresholds, not hardcoded | Dynamic color mapping | P0 |
| V-U06 | Benchmark values from API, not hardcoded | Industry averages dynamic | P0 |
| V-U07 | Narrative text from API with fallback | LLM text or fallback template | P0 |
| V-U08 | Historical data rendered from API array | Chart data dynamic | P0 |
| V-U09 | Share link from `POST /api/diagnostic/ssi/:reportId/share` | Generated URL | P1 |

### 2.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| V-I01 | `GET /api/diagnostic/ssi/:companyId` returns SSI scores **(ALREADY EXISTS)** | 3 dimensions + 12 blocks | P0 |
| V-I02 | `GET /api/diagnostic/ssi/:companyId/benchmark` returns benchmarks **(ALREADY EXISTS)** | Industry comparison data | P0 |
| V-I03 | `GET /api/diagnostic/ssi/:companyId/history` returns historical **(ALREADY EXISTS)** | Time-series data | P0 |
| V-I04 | `POST /api/diagnostic/ssi/:reportId/share` generates share link **(ALREADY EXISTS)** | Unique URL returned | P1 |
| V-I05 | SSI endpoints filter by company_id **(ALREADY EXISTS)** | Multi-tenant isolation | P0 |
| V-I06 | SSI endpoints require authentication **(ALREADY EXISTS)** | 401 without token | P0 |

### 2.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| V-E01 | SSI Report loads with 3 dimension scores | Login → Navigate | Speed/Strength/Intelligence visible | P0 |
| V-E02 | 12-block breakdown displays | Check report | All 12 blocks with scores | P0 |
| V-E03 | Benchmark comparison visible | Check benchmark section | Industry averages shown | P1 |
| V-E04 | Narrative sections show text | Check narrative areas | LLM-generated or fallback text | P0 |
| V-E05 | No assessment data — appropriate empty state | New company | "Complete an assessment first" | P0 |

### 2.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| V-X01 | Company with 0 assessments — no SSI data | Empty state, not error | P0 |
| V-X02 | Only 1 assessment completed — SSI calculates from it | Valid scores | P0 |
| V-X03 | Block with 0 questions answered — score is 0 or N/A | Graceful display | P0 |
| V-X04 | LLM narrative missing — fallback text shown | Non-empty fallback | P0 |
| V-X05 | Historical data with 1 point — no chart line | Single point marker | P1 |
| V-X06 | Benchmark data unavailable — section hidden or message | "Benchmarks unavailable" | P1 |
| V-X07 | Share link expires after 7 days — returns 410 Gone | Expired link returns 410, not 404 | P0 |
| V-X08 | Share link public view excludes narratives — limited data only | Only scores and blocks visible, no LLM narratives | P0 |

---

## 3. Epic N — Advanced OKR Features (21 pts)

### 3.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| N-U01 | Objective creation wizard: Step 1 → title + category | Required fields | P0 |
| N-U02 | Objective creation: category from `CategoryIcons.getAllCategories()` | 6 options | P0 |
| N-U03 | KR creation: POST to `/api/goals/quarterly` | KR saved | P0 |
| N-U04 | KR editing: PUT updates title, target, current value | Fields persist | P0 |
| N-U05 | KR deletion: soft delete (status=cancelled) | Not hard deleted | P0 |
| N-U06 | Owner assignment: PUT with `owner_id` | Owner updated | P0 |
| N-U07 | Auto-status: all KRs ≥100% → objective `completed` | Status auto-set | P0 |
| N-U08 | Auto-status: any KR gap >25 → objective `at_risk` | Status auto-set | P0 |
| N-U09 | Archive: PUT with `status=archived` | Objective archived | P0 |
| N-U10 | Archive removes from active list | Not in active filter | P0 |
| N-U11 | Category validation: only 6 MECE categories accepted | Invalid category rejected | P0 |
| N-U12 | AI-assisted creation checks `FEATURE_OPENAI_ENABLED` | Disabled when flag off | P0 |

### 3.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| N-I01 | `POST /api/objectives` creates objective | 201 Created | P0 |
| N-I02 | `POST /api/objectives` with missing title returns 400 | Validation error | P0 |
| N-I03 | `POST /api/objectives` with invalid category returns 400 | "Invalid category" | P0 |
| N-I04 | `POST /api/goals/quarterly` creates KR | 201 Created | P0 |
| N-I05 | `PUT /api/objectives/:id` updates owner | Owner field updated | P0 |
| N-I06 | `PUT /api/objectives/:id` with `status=archived` archives | Status persisted | P0 |
| N-I07 | Auto-status trigger on KR update | Objective status recomputed | P0 |
| N-I08 | EMPLOYEE cannot create objectives | 403 Forbidden | P0 |
| N-I09 | Only company members appear in owner dropdown | `GET /api/auth/users` company-scoped | P0 |

### 3.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| N-E01 | Create objective via wizard | Click Create → fill → save | New objective card appears | P0 |
| N-E02 | Add KR to objective | Click objective → Add KR → fill → save | KR appears in list | P0 |
| N-E03 | Edit KR target value | Click KR → edit → save | Updated value shown | P0 |
| N-E04 | Assign owner to objective | Click Assign → select user → save | Owner avatar shown | P0 |
| N-E05 | Archive objective | Click archive → confirm | Removed from active view | P0 |
| N-E06 | Auto-status updates on KR completion | Complete all KRs | Objective status = "Completed" | P0 |
| N-E07 | AI-assisted creation (if enabled) | Click AI generate → review → save | AI-generated title and category | P1 |

### 3.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| N-X01 | Create objective with 0 KRs — valid | Objective created, 0% progress | P0 |
| N-X02 | Delete last KR — objective progress = 0% | No division by zero | P0 |
| N-X03 | Archive objective with active tasks — warning | "Has active tasks" warning | P0 |
| N-X04 | Duplicate objective title — allowed (not unique constraint) | Both created | P1 |
| N-X05 | Reassign owner to self — accepted | No error | P1 |
| N-X06 | Auto-status when KRs have mixed states | Worst-case status applied | P0 |
| N-X07 | Objective with 20+ KRs — scrollable list | KR list scrollable, no layout overflow | P1 |

---

## 4. Epic O — SSI Intelligence Enhancements (18 pts)

### 4.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| O-U01 | Team SSI = average of member SSI scores | Correct aggregation | P0 |
| O-U02 | Company SSI = average of all individual scores | Correct aggregation | P0 |
| O-U03 | Comparison: individual vs team vs company | 3-level data structure | P0 |
| O-U04 | PDF generation includes 12-block data | All blocks in PDF | P0 |
| O-U05 | Team with 0 members — SSI = N/A | Not 0, not NaN | P0 |
| O-U06 | Company with 0 assessments — SSI = N/A | Graceful empty state | P0 |

### 4.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| O-I01 | `GET /api/analytics/ssi/benchmarks/team/:companyId` returns aggregated SSI **(ALREADY EXISTS)** | Team-level scores | P0 |
| O-I02 | `GET /api/analytics/ssi/comparison/:assessmentId` returns 3-level data **(ALREADY EXISTS)** | Individual + team + company | P0 |
| O-I03 | `GET /api/analytics/ssi/export/pdf/:assessmentId` returns PDF buffer **(ALREADY EXISTS)** | Valid PDF content-type | P0 |
| O-I04 | Team SSI endpoint scoped to company | Multi-tenant isolation | P0 |
| O-I05 | PDF endpoint requires authentication | 401 without token | P0 |
| O-I06 | Comparison endpoint returns consistent structure | Same shape regardless of data | P0 |

### 4.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| O-E01 | Team SSI dashboard shows aggregated scores | Navigate to team SSI | Team averages displayed | P0 |
| O-E02 | Company SSI shows department breakdown | Navigate to company SSI | Department-level scores | P0 |
| O-E03 | Comparison view shows 3 levels | Select comparison view | Individual / Team / Company | P0 |
| O-E04 | PDF export downloads file | Click Export PDF | PDF file downloads | P0 |

### 4.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| O-X01 | Team with 1 member — team SSI = individual SSI | Identical scores | P0 |
| O-X02 | Team with member who has no assessment — excluded from average | Only assessed members counted | P0 |
| O-X03 | PDF with very long narratives — no truncation | Full content in PDF | P1 |
| O-X04 | Comparison with only 1 level of data — partial view | Available levels shown | P0 |
| O-X05 | PDF generation timeout — error message | "PDF generation timed out" | P1 |

---

## 5. Epic R — Chief AI Branding (3 pts)

### 5.1 Visual Regression Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| R-V01 | Brand gradient on all 6 pages = `#1e3a5f → #2d5a87` | Navy gradient, not purple | P0 |
| R-V02 | Logo SVG = Chief AI star + wordmark | Not Karvia logo | P0 |
| R-V03 | No remaining `#667eea` or `#764ba2` in any CSS | All purple removed | P0 |
| R-V04 | Accent color = `#d4a853` (gold) | Gold accent throughout | P0 |
| R-V05 | Navigation logo matches Chief AI | Star logo in nav | P0 |
| R-V06 | `--brand-gradient` CSS variable updated in s13-patterns.css | Variable = navy gradient | P0 |
| R-V07 | `--brand-accent` CSS variable = `#d4a853` | Gold accent | P0 |
| R-V08 | `--brand-primary` CSS variable = `#1e3a5f` | Navy primary | P0 |

### 5.2 Automated Branding Checks

| ID | Test Case | Method | Priority |
|----|-----------|--------|----------|
| R-A01 | Grep all CSS files for `#667eea` — 0 matches | `grep -r '#667eea' client/` | P0 |
| R-A02 | Grep all CSS files for `#764ba2` — 0 matches | `grep -r '#764ba2' client/` | P0 |
| R-A03 | Grep all JS files for `karvia` logo reference — 0 matches | Check logo SVG references | P0 |
| R-A04 | Verify `s13-patterns.css` has correct brand variables | File content assertion | P0 |

---

## 6. Epic T — Design System Finalization (5 pts)

### 6.1 Cross-Page Consistency Tests (All 6 Pages)

| ID | Test Case | Verification | Priority |
|----|-----------|-------------|----------|
| T-C01 | All 6 pages import `s13-patterns.css` | HTML link tag check | P0 |
| T-C02 | All 6 pages use `--brand-gradient` (not hardcoded hex) | CSS inspection | P0 |
| T-C03 | All 6 pages use `NavigationManager` | Script initialization check | P0 |
| T-C04 | All 6 pages use philosophy color underlines | Nav link styling | P0 |
| T-C05 | All status badges use same 6-state system | Class/label consistency | P0 |
| T-C06 | All progress rings use `renderScoreRing()` | Function call check | P0 |
| T-C07 | All avatars use `getInitials()` from `common.js` | Function call check | P0 |
| T-C08 | All dates use `formatDate()` from `common.js` | Function call check | P0 |
| T-C09 | All user text escaped with `escapeHtml()` | Function call check | P0 |
| T-C10 | All pages responsive at 768px breakpoint | Viewport resize test | P0 |

### 6.2 Responsive Tests (Per Page)

| ID | Test Case | Viewport | Expected Result | Priority |
|----|-----------|----------|-----------------|----------|
| T-R01 | Assessment Hub at 768px | 768px wide | Single column, no overflow | P0 |
| T-R02 | Question Library at 768px | 768px wide | Sidebar collapses or stacks | P0 |
| T-R03 | Teams at 768px | 768px wide | Grid → single column | P0 |
| T-R04 | Dashboard at 768px | 768px wide | Task columns stack | P0 |
| T-R05 | Planning at 768px | 768px wide | Two-panel → stacked | P0 |
| T-R06 | Objectives at 768px | 768px wide | Grid → single column | P0 |

### Note: Chat Button Deferred

The mockup includes a chat button in the bottom-right corner. This is deferred to a future sprint — no chat feature or endpoint exists. Do NOT test for chat functionality.

---

## 7. Sprint 13 Integration Regression Tests

| ID | Test Case | What It Protects | Priority |
|----|-----------|------------------|----------|
| REG-01 | Assessment Hub loads with all 4 tabs | Sprint 11 | P0 |
| REG-02 | Question Library dimension tree works | Sprint 11 | P0 |
| REG-03 | Teams page renders with stats | Sprint 11 | P0 |
| REG-04 | Assessment creation wizard completes | Sprint 11 | P0 |
| REG-05 | Dashboard task columns load | Sprint 12 | P0 |
| REG-06 | Planning two-panel layout works | Sprint 12 | P0 |
| REG-07 | AI generation (if enabled) works | Sprint 12 | P0 |
| REG-08 | Task complete → progress cascade | Sprint 12 | P0 |
| REG-09 | Auth token migration shim works | Sprint 11 | P0 |
| REG-10 | Input validation enforced | Sprint 11 | P0 |
| REG-11 | SSI diagnostic report generates | Sprint 6/10 | P0 |
| REG-12 | OKR generation works | Sprint 3 | P0 |
| REG-13 | Company profile page loads | Sprint 10 | P0 |
| REG-14 | Configuration page loads | Sprint 10 | P0 |
| REG-15 | Navigation between all pages works | Global | P0 |
| REG-16 | Existing BST suite passes (50 tests) | All existing | P0 |

---

## 7.1 CONSULTANT Role Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| CON-01 | CONSULTANT can access Objectives and SSI Report pages | Both pages load without 403 | P0 |
| CON-02 | CONSULTANT can create/edit/archive objectives | Full CRUD operations succeed | P0 |
| CON-03 | CONSULTANT can view SSI reports for any company | Cross-company SSI access granted | P0 |
| CON-04 | CONSULTANT can export PDF and generate share links | PDF downloads, share URL returned | P0 |
| CON-05 | CONSULTANT can view team-level and company-level SSI | Both aggregation levels accessible | P0 |

---

## 8. User Journey Tests

### Journey 1: Objective Creation & KR Management

```
1. Login as EXECUTIVE
2. Navigate to Objectives page
3. Verify KPI cards show correct counts
4. Click "Create Objective"
5. Fill title, select category (e.g., "Growth")
6. Optionally use AI assist (if enabled)
7. Save objective
8. Verify new objective card appears
9. Verify category coverage widget updates ("X of 6" increments)
10. Click the new objective card
11. Add 3 Key Results with titles and targets
12. Verify KR items appear under the objective
13. Set KR progress to 50% on one KR
14. Verify objective progress ring updates
15. Verify status badge logic (e.g., "In Progress")
16. Assign an owner to the objective
17. Verify owner avatar appears on card
18. Set all KRs to 100%
19. Verify objective status auto-updates to "Completed"
20. Archive the objective
21. Verify it disappears from active view
```

### Journey 2: SSI Report Full Flow

```
1. Login as BUSINESS_OWNER
2. Navigate to SSI Report page
3. Verify 3 dimension scores (Speed/Strength/Intelligence)
4. Verify 12-block breakdown with scores
5. Verify industry benchmarks display (if available)
6. Verify narrative sections show text
7. Navigate to Team SSI view
8. Verify team-level aggregated scores
9. Navigate to Company SSI view
10. Verify department breakdown
11. Open Comparison view
12. Verify individual vs team vs company data
13. Click "Export PDF"
14. Verify PDF downloads with correct content
15. Click "Share" → generate link
16. Open share link in incognito → verify read-only report
```

### Journey 3: Cross-Page Branding Consistency

```
1. Login as any user
2. Navigate to each of the 6 pages in sequence:
   a. Assessment Hub
   b. Question Library
   c. Teams
   d. Dashboard
   e. Planning
   f. Objectives
3. On each page verify:
   - Logo = Chief AI (star + wordmark)
   - Nav gradient = navy (#1e3a5f)
   - No purple (#667eea) visible
   - Philosophy color underlines present
   - Status badges consistent
   - Progress rings consistent
   - Date format consistent
   - Avatar style consistent
```

---

## 9. Automated Test File Structure

```
QA/sprints/sprint-13/
├── SPRINT-13-TEST-PLAN.md              (this file)
├── unit/
│   ├── objectives-page.test.js         (U2-U01 to U2-U26)
│   ├── ssi-report.test.js             (V-U01 to V-U09)
│   ├── advanced-okr.test.js           (N-U01 to N-U12)
│   ├── ssi-intelligence.test.js       (O-U01 to O-U06)
│   └── category-coverage.test.js      (U2-U08 to U2-U10)
├── integration/
│   ├── objectives-api.test.js          (U2-I01 to U2-I05, N-I01 to N-I09)
│   ├── ssi-report-api.test.js          (V-I01 to V-I06)
│   ├── ssi-intelligence-api.test.js    (O-I01 to O-I06)
│   └── branding-check.test.js          (R-A01 to R-A04)
├── e2e/
│   ├── objectives.spec.ts             (U2-E01 to U2-E08)
│   ├── ssi-report.spec.ts             (V-E01 to V-E05)
│   ├── advanced-okr.spec.ts           (N-E01 to N-E07)
│   ├── ssi-intelligence.spec.ts       (O-E01 to O-E04)
│   ├── branding.spec.ts               (R-V01 to R-V08)
│   ├── design-system.spec.ts          (T-C01 to T-C10, T-R01 to T-R06)
│   ├── consultant-role.spec.ts        (CON-01 to CON-05)
│   └── regression.spec.ts             (REG-01 to REG-16)
├── journeys/
│   ├── objective-kr-management.spec.ts (Journey 1)
│   ├── ssi-report-flow.spec.ts        (Journey 2)
│   └── branding-consistency.spec.ts   (Journey 3)
└── edge-cases/
    ├── objectives-edge.test.js         (U2-X01 to U2-X10)
    ├── ssi-report-edge.test.js         (V-X01 to V-X08)
    ├── advanced-okr-edge.test.js       (N-X01 to N-X07)
    └── ssi-intelligence-edge.test.js   (O-X01 to O-X05)
```

---

## 10. Test Execution Order

```
Phase 1: Unit Tests
  npm test -- tests/unit/sprint-13/

Phase 2: Integration Tests (requires DB)
  npm test -- tests/integration/sprint-13/

Phase 3: Branding Checks (static analysis)
  npm test -- tests/integration/sprint-13/branding-check.test.js

Phase 4: E2E Tests (requires running server)
  npx playwright test QA/sprints/sprint-13/e2e/

Phase 5: Design System Audit
  npx playwright test QA/sprints/sprint-13/e2e/design-system.spec.ts

Phase 6: CONSULTANT Role Tests
  npx playwright test QA/sprints/sprint-13/e2e/consultant-role.spec.ts

Phase 7: Journey Tests
  npx playwright test QA/sprints/sprint-13/journeys/

Phase 8: Regression (Sprint 11 + 12 + all prior)
  npx playwright test QA/sprints/sprint-13/e2e/regression.spec.ts
  npx playwright test QA/sprints/sprint-12/e2e/  (Sprint 12 re-run)
  npx playwright test QA/sprints/sprint-11/e2e/  (Sprint 11 re-run)
  npm run test:bst  (existing 50 BST tests)
```

---

## 11. Pass Criteria

| Gate | Requirement |
|------|-------------|
| Unit Tests | 100% pass rate |
| Integration Tests | 100% pass rate |
| E2E Tests | 100% pass rate |
| CONSULTANT Role Tests | 100% pass rate |
| Journey Tests | 95% pass rate |
| Edge Cases | 90% pass rate |
| Branding | 100% — zero purple remnants |
| Design System | 100% — all 10 consistency checks pass on all 6 pages |
| Responsive | All 6 pages pass at 768px |
| Regression (Sprint 11 + 12 + BST) | 100% pass rate |
| Code Coverage | ≥ 80% lines for new code |
| Security | All XSS/injection tests pass |
| Multi-tenancy | All isolation tests pass |
| PDF Export | Valid PDF generated with correct data |
| Performance | All pages render < 2 seconds |

---

*Sprint 13 Test Plan — 195 total test cases (186 original + 9 post-audit additions)*
*Last Updated: January 27, 2026 (Post-Audit)*
