# Sprint 11 Test Plan — Assessment Pages

**Sprint**: 11 | **Points**: 59 | **Pages**: Assessment Hub, Question Library, Teams
**Epics**: U5, U3, U4, QA, J, Q1, Q2, Quickfix
**Created**: January 27, 2026
**Updated**: January 27, 2026 (Post-Audit)

---

## Test Summary

| Category | Test Cases | Priority |
|----------|-----------|----------|
| Unit Tests | 87 | P0-P2 |
| Integration Tests | 42 | P0-P1 |
| E2E / Playwright | 35 | P0-P1 |
| Edge Cases | 28 | P1-P2 |
| CONSULTANT Role Tests | 5 | P0 |
| Responsive Tests | 3 | P0 |
| Pagination Tests | 4 | P1 |
| **Total** | **204** | |

---

## 1. Epic U5 — Assessment Hub Page (8 pts)

### 1.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U5-U01 | Hub loads with 4 tabs: Templates, Assigned, Sent, Results | 4 tab buttons rendered | P0 |
| U5-U02 | KPI card: Total Templates from `templates.length` | Correct count | P0 |
| U5-U03 | KPI card: Active Assessments from `assessments.filter(a => a.status === 'active').length` | Correct count | P0 |
| U5-U04 | KPI card: Completion Rate from `completed / total * 100` | Percentage computed | P0 |
| U5-U05 | KPI card: Pending Invitations from `invitations.filter(i => i.status === 'pending').length` | Correct count | P0 |
| U5-U06 | Tab switching shows/hides content panels | Only active panel visible | P0 |
| U5-U07 | Template card rendered from API data, not hardcoded | Cards loop over template array | P0 |
| U5-U08 | Template card shows question count badge | `template.questions.length` | P0 |
| U5-U09 | Assigned-to-me list shows user's assessments | Filtered by `user_id` | P0 |
| U5-U10 | Sent-by-me list shows launched assessments | Filtered by `created_by` | P0 |
| U5-U11 | Results tab shows completed assessments with scores | Score data present | P0 |
| U5-U12 | All template text passed through `escapeHtml()` | XSS safe | P0 |
| U5-U13 | Empty tab shows empty state message | "No templates yet" etc | P0 |
| U5-U14 | Tab badge counts update dynamically | Counts from data | P0 |

### 1.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U5-I01 | `GET /api/assessmentTemplates` returns templates | Template list | P0 |
| U5-I02 | `GET /api/invitations?assigned_to=userId` returns user's invitations | User-scoped list | P0 |
| U5-I03 | `GET /api/invitations/sent-by-me` returns sent invitations | Creator-scoped list | P0 |
| U5-I04 | `GET /api/diagnostic/ssi/:companyId` returns results | SSI scores | P0 |
| U5-I05 | `GET /api/analytics/ssi/benchmarks/team/:companyId` returns team results | Team-level SSI | P0 |
| U5-I06 | All Hub endpoints filter by company_id | Multi-tenant isolation | P0 |
| U5-I07 | All Hub endpoints require authentication | 401 without token | P0 |
| U5-I08 | Template endpoint returns populated question data | Questions array filled | P0 |
| U5-I09 | Invitation endpoint returns with user details populated | User name/email present | P0 |

### 1.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| U5-E01 | Assessment Hub loads with 4 tabs | Login → Navigate | All 4 tabs visible | P0 |
| U5-E02 | KPI cards show correct counts | Check cards | Dynamic values, not 0 | P0 |
| U5-E03 | Click Templates tab → template cards shown | Click tab | Template grid visible | P0 |
| U5-E04 | Click Assigned tab → invitation list shown | Click tab | Assigned assessments visible | P0 |
| U5-E05 | Click Sent tab → sent list shown | Click tab | Sent assessments visible | P0 |
| U5-E06 | Click Results tab → results shown | Click tab | Score data visible | P0 |
| U5-E07 | Empty state for tab with no data | New user, no data | Empty state message | P0 |
| U5-E08 | Tab switching preserves scroll position | Switch tabs | Scroll position maintained | P1 |

### 1.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U5-X01 | Company with 0 templates — empty state shown | "Create your first template" | P0 |
| U5-X02 | User with 0 assigned assessments — empty state | "No assessments assigned" | P0 |
| U5-X03 | 0 completed assessments — Results tab empty | "No results yet" | P0 |
| U5-X04 | Template with 0 questions — badge shows "0" | No crash | P0 |
| U5-X05 | 100+ templates — performance acceptable | Renders within 2 seconds | P1 |
| U5-X06 | Template name with special characters | Escaped via escapeHtml() | P0 |
| U5-X07 | Concurrent tab clicks — no race condition | Last clicked tab shown | P1 |
| U5-X08 | Network error loading tab data — error state shown | "Failed to load" message | P0 |
| U5-X09 | Loading state shown while data fetches | Skeleton or spinner visible | P0 |

---

## 2. Epic U3 — Question Library Page (8 pts)

### 2.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U3-U01 | Dimension tree renders 3 root nodes | Speed, Strength, Intelligence | P0 |
| U3-U02 | Speed dimension has 4 blocks | Delivery, Decisions, Change, Response | P0 |
| U3-U03 | Strength dimension has 4 blocks | Culture, Talent, Structure, Leadership | P0 |
| U3-U04 | Intelligence dimension has 4 blocks | Market, Data, Customer, Innovation | P0 |
| U3-U05 | Module tabs render: Core, Industry, Role | 3 tabs visible | P0 |
| U3-U06 | Wizard state machine: Step 1→2 only when questions selected | Cannot advance with 0 selections | P0 |
| U3-U07 | Wizard state machine: Step 2→3 validates config fields | Required fields enforced | P0 |
| U3-U08 | Wizard Step 3 review shows correct selection summary | Matches selections from steps 1-2 | P0 |
| U3-U09 | Template save payload contains selected question IDs | POST body has `question_ids: [...]` | P0 |
| U3-U10 | Empty state shown when no questions match filter | "No questions found" visible | P0 |
| U3-U11 | All question text passed through `escapeHtml()` | XSS safe | P0 |

### 2.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U3-I01 | `GET /api/assessment-questions/dimensions` returns full hierarchy | Speed/Strength/Intelligence with blocks | P0 |
| U3-I02 | `GET /api/assessment-questions/modules` returns available modules | core, industry, role | P0 |
| U3-I03 | `GET /api/assessment-questions?block=X&module=core` filters correctly | Only matching questions | P0 |
| U3-I04 | `POST /api/assessmentTemplates` creates template with questions | Template saved with question IDs | P0 |
| U3-I05 | `POST /api/assessmentTemplates` with empty questions returns 400 | Validation error | P0 |
| U3-I06 | `GET /api/assessment-questions/dimensions` requires auth | 401 without token | P0 |
| U3-I07 | Questions scoped to company — no cross-tenant leakage | Company isolation enforced | P0 |

### 2.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| U3-E01 | Question Library loads with dimension tree | Login → Navigate | Left sidebar shows 3 dimensions, 12 blocks | P0 |
| U3-E02 | Click dimension expands blocks | Click "Speed" | Shows 4 blocks: Delivery, Decisions, Change, Response | P0 |
| U3-E03 | Click block filters question list | Click "Delivery" | Main panel shows only Delivery questions | P0 |
| U3-E04 | Module tab switch filters questions | Click "Industry" tab | Shows only industry-specific questions | P0 |
| U3-E05 | Select questions and advance wizard | Select 5 questions → Next | Step 2 config form appears | P0 |
| U3-E06 | Complete wizard and save template | Step 1→2→3 → Save | Template created, toast notification | P0 |
| U3-E07 | Cannot advance without selection | Click Next with 0 selected | Validation error shown | P0 |

### 2.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U3-X01 | Industry with 0 questions — tab shows empty state | "No industry questions" message | P0 |
| U3-X02 | Role with 0 questions — tab shows empty state | "No role questions" message | P0 |
| U3-X03 | Select all questions in a block — coverage shows 100% | Correct calculation | P1 |
| U3-X04 | Select questions across multiple blocks — coverage multi-block | Correct count of unique blocks | P1 |
| U3-X05 | Very long question text — no layout break | Text truncated or wrapped | P2 |
| U3-X06 | 200+ questions — performance acceptable | Renders within 2 seconds | P1 |
| U3-X07 | 500+ questions — pagination or virtual scroll | Data accessible without performance degradation | P1 |

---

## 3. Epic U4 — Teams Page Redesign (4 pts)

### 3.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U4-U01 | Stats: Total Teams computed from teams.length | Correct count | P0 |
| U4-U02 | Stats: Total Members computed from sum of team.members.length | Sum of all members | P0 |
| U4-U03 | Stats: Avg Size computed from members / teams | Rounded average | P0 |
| U4-U04 | Stats: Total Assessments computed from teams with assessments | Correct count | P1 |
| U4-U05 | Filter chips derived from unique `team.department` values | No duplicates, dynamic | P0 |
| U4-U06 | Manager avatar uses `getInitials(manager.name)` | "Jane Smith" → "JS" | P0 |
| U4-U07 | Progress bar width from `team.okr_progress` | CSS width matches percentage | P0 |
| U4-U08 | Role-gated: Create button visible for MANAGER+ only | Hidden for EMPLOYEE | P0 |
| U4-U09 | Role-gated: Delete button visible for BUSINESS_OWNER+ only | Hidden for MANAGER | P0 |

### 3.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U4-I01 | `GET /api/teams` returns only company's teams | Multi-tenant isolation | P0 |
| U4-I02 | `GET /api/teams/:id` returns team with members populated | Full team detail | P0 |
| U4-I03 | `POST /api/teams` creates team (MANAGER+ role) | Team created | P0 |
| U4-I04 | `POST /api/teams` as EMPLOYEE returns 403 | Forbidden | P0 |
| U4-I05 | `GET /api/auth/users?role=MANAGER,EXECUTIVE,BUSINESS_OWNER` filters roles | Only eligible managers | P0 |
| U4-I06 | `GET /api/invitations?team_id=X&status=pending` returns pending | Correct filter | P1 |
| U4-I07 | `DELETE /api/teams/:id` soft deletes (status=cancelled) | No hard delete | P0 |
| U4-I08 | Cannot access team from different company | 403 or 404 | P0 |

### 3.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| U4-E01 | Teams page loads with stat cards and team grid | Login → Navigate | 4 stats, team cards visible | P0 |
| U4-E02 | Click team card opens detail panel | Click team card | Side panel with member list | P0 |
| U4-E03 | Filter by department | Click department chip | Only matching teams shown | P0 |
| U4-E04 | Create team via modal (MANAGER user) | Click Create → Fill → Save | New team appears in grid | P0 |
| U4-E05 | EMPLOYEE cannot see Create button | Login as Employee | Button not in DOM | P0 |
| U4-E06 | Team detail panel shows pending invitations | Click team → Check panel | Pending invitations list | P1 |

### 3.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U4-X01 | Company with 0 teams — empty state shown | "Create your first team" message | P0 |
| U4-X02 | Team with 0 members — member count shows 0 | "0 members" displayed | P0 |
| U4-X03 | Team with no manager assigned — graceful handling | "No manager" or placeholder shown | P0 |
| U4-X04 | Department filter with only 1 department — chip still rendered | Single chip shown | P1 |
| U4-X05 | 50+ teams — pagination or scroll performance | Renders within 2 seconds | P1 |
| U4-X06 | Team name with special characters — escaped | XSS safe rendering | P0 |
| U4-X07 | 100+ teams — pagination or virtual scroll | Data accessible without performance degradation | P1 |

---

## 4. Epic QA — Assessment Quality (13 pts)

### 4.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| QA-U01 | Core module returns 24 questions | Filter by `module_type='core'` | P0 |
| QA-U02 | Industry module returns questions for specific industry | Filter by `industry=X` | P0 |
| QA-U03 | Role module returns questions for specific role | Filter by `target_role=X` | P0 |
| QA-U04 | Question weight default is 1 | New question has weight=1 | P0 |
| QA-U05 | Question weight minimum 0.1, maximum 5 | Values outside range rejected | P0 |
| QA-U06 | `module_type` enum validation | Only 'core', 'industry', 'role' accepted | P0 |
| QA-U07 | Industry questions without matching industry return empty | Empty array, not error | P0 |
| QA-U08 | Role questions without matching role return empty | Empty array, not error | P0 |
| QA-U09 | Weight adjustment persists on save | Updated weight saved to DB | P0 |
| QA-U10 | Dimension hierarchy from actual data, not hardcoded | Hierarchy built from question `dimension` fields | P0 |

### 4.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| QA-I01 | `GET /api/assessment-questions/by-module?module=core` returns core questions | 24 questions | P0 |
| QA-I02 | `GET /api/assessment-questions/by-module?module=industry&industry=technology` returns tech questions | Industry-specific set | P0 |
| QA-I03 | `GET /api/assessment-questions/by-module?module=role&role=MANAGER` returns manager questions | Role-specific set | P0 |
| QA-I04 | `GET /api/assessment-questions/dimensions` returns 3 dimensions, 12 blocks | Full MECE hierarchy | P0 |
| QA-I05 | `PUT /api/assessment-questions/:id` updates weight | Weight persisted | P0 |
| QA-I06 | Weight < 0.1 returns 400 validation error | "Weight must be between 0.1 and 5" | P0 |
| QA-I07 | Weight > 5 returns 400 validation error | "Weight must be between 0.1 and 5" | P0 |
| QA-I08 | `module_type` invalid value returns 400 | "Invalid module type" | P0 |

---

## 5. Epic J — Assessment Flow Improvements (28 pts)

### 5.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| J-U01 | Wizard state: initial state is Step 1 | `currentStep === 1` | P0 |
| J-U02 | Wizard: Step 1→2 requires template selection | Cannot advance without template | P0 |
| J-U03 | Wizard: Step 2→3 requires audience configuration | At least 1 recipient or team selected | P0 |
| J-U04 | Wizard: Step 3 review shows correct summary | Template name, audience count, distribution type | P0 |
| J-U05 | Wizard: Back button returns to previous step | State decrements | P0 |
| J-U06 | Template cards rendered from API, not hardcoded | Cards loop over template array | P0 |
| J-U07 | Template preview loads full question list | `GET /api/assessmentTemplates/:id` with questions | P0 |
| J-U08 | Team distribution selects all team members | Audience = team.members | P0 |
| J-U09 | Email distribution validates email format | Invalid emails rejected | P0 |
| J-U10 | Secure link generates unique URL | `is_public_link: true` in payload | P0 |
| J-U11 | Sent-by-me stats computed from invitation data | completed %, pending count, expired count | P0 |
| J-U12 | All invitation text escaped with `escapeHtml()` | XSS safe | P0 |

### 5.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| J-I01 | `GET /api/assessmentTemplates` returns all templates | Template list | P0 |
| J-I02 | `GET /api/assessmentTemplates/:id` returns template with questions | Full template detail | P0 |
| J-I03 | `POST /api/invitations/create` with team distribution | Invitations created for all team members | P0 |
| J-I04 | `POST /api/invitations/create` with email distribution | Invitations sent to specified emails | P0 |
| J-I05 | `POST /api/invitations/create` with `is_public_link: true` | Secure link generated | P0 |
| J-I06 | `POST /api/invitations/create` with no recipients returns 400 | Validation error | P0 |
| J-I07 | `GET /api/invitations/sent-by-me` returns with completion stats | Includes per-invitation status counts | P0 |
| J-I08 | Anonymous survey response without auth succeeds | Public link allows unauthenticated response | P0 |
| J-I09 | Anonymous survey with expired link returns 410 | "Link expired" | P1 |
| J-I10 | Duplicate invitation to same user returns 409 or handles gracefully | No double invitations | P0 |

### 5.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| J-E01 | 3-step wizard loads | Navigate to create assessment | Step 1 visible with template cards | P0 |
| J-E02 | Select template and advance | Click template → Next | Step 2 audience form shown | P0 |
| J-E03 | Configure team audience and advance | Select team → Next | Step 3 review shown with correct summary | P0 |
| J-E04 | Launch assessment from review | Click Launch | Assessment created, redirect to Hub | P0 |
| J-E05 | Back button works through wizard | Step 3 → Back → Step 2 → Back → Step 1 | Correct state at each step | P0 |
| J-E06 | Template preview modal | Click preview on template card | Full question list displayed | P1 |
| J-E07 | Sent-by-me tab shows launched assessment | Launch → Check Sent tab | New entry with 0% completion | P0 |
| J-E08 | Complete assessment journey | Create → Send → Respond → Check stats | Stats update to reflect completion | P0 |

### 5.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| J-X01 | Launch with 0 questions in template | Validation error before launch | P0 |
| J-X02 | Launch to team with 0 members | Warning or block launch | P0 |
| J-X03 | Email with invalid format rejected | Inline validation error | P0 |
| J-X04 | Duplicate emails in email distribution | Deduplicated before send | P1 |
| J-X05 | Secure link accessed after expiry | "Link expired" page | P1 |
| J-X06 | Very long template name — no layout break | Truncated with ellipsis | P2 |
| J-X07 | Network error during launch — rollback | Invitations not partially created | P0 |

---

## 6. Epic Q1 — Auth Token Standardization (2 pts, CRITICAL)

### 6.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q1-U01 | Migration shim reads `karvia_auth_token` first | Priority key checked | P0 |
| Q1-U02 | Migration shim falls back to `karvia_token` | Legacy key used if primary missing | P0 |
| Q1-U03 | Migration shim falls back to `token` | Oldest key used as last resort | P0 |
| Q1-U04 | Migration shim copies legacy to `karvia_auth_token` | Standard key populated | P0 |
| Q1-U05 | `getAuthToken()` in common.js checks `karvia_auth_token` first | Returns standard key value | P0 |
| Q1-U06 | New controllers only reference `karvia_auth_token` | No legacy key usage | P0 |
| Q1-U07 | All 3 keys set — `karvia_auth_token` takes priority | No ambiguity | P0 |
| Q1-U08 | No keys set — returns null gracefully | No error thrown | P0 |

### 6.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q1-I01 | API request with `karvia_auth_token` succeeds | 200 response | P0 |
| Q1-I02 | API request with legacy `karvia_token` still works (migration period) | 200 response | P0 |
| Q1-I03 | API request with no token returns 401 | Unauthorized | P0 |
| Q1-I04 | API request with expired token returns 401 | Token expired message | P0 |
| Q1-I05 | API request with malformed token returns 401 | Invalid token message | P0 |

---

## 7. Epic Q2 — Input Validation Hardening (3 pts, CRITICAL)

### 7.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q2-U01 | Title: empty string rejected | 400 error, "title required" | P0 |
| Q2-U02 | Title: < 3 chars rejected | 400 error, "min 3 characters" | P0 |
| Q2-U03 | Title: > 200 chars rejected | 400 error, "max 200 characters" | P0 |
| Q2-U04 | Title: 3 chars accepted | Passes validation | P0 |
| Q2-U05 | Title: 200 chars accepted | Passes validation | P0 |
| Q2-U06 | Title: HTML tags sanitized | `<script>alert(1)</script>` stripped | P0 |
| Q2-U07 | template_id: invalid ObjectId rejected | 400 error | P0 |
| Q2-U08 | template_id: valid ObjectId accepted | Passes validation | P0 |
| Q2-U09 | template_id: missing returns 400 | Required field error | P0 |
| Q2-U10 | Recipients: empty array rejected | 400 error | P0 |
| Q2-U11 | Recipients: invalid email format rejected | 400 error per invalid | P0 |
| Q2-U12 | SQL injection in title sanitized | No injection executed | P0 |
| Q2-U13 | NoSQL injection in query params blocked | `$gt`, `$ne` patterns rejected | P0 |

### 7.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q2-I01 | POST endpoint with all valid fields succeeds | 201 Created | P0 |
| Q2-I02 | POST endpoint with missing required field returns 400 | Specific field error message | P0 |
| Q2-I03 | POST endpoint with XSS payload sanitized | Clean data stored | P0 |
| Q2-I04 | PUT endpoint with boundary-length fields accepted | 3 and 200 char titles work | P0 |
| Q2-I05 | Validation middleware applied to all CRUD routes | Every route validates | P0 |

---

## 8. Shared Infrastructure Tests

### 8.1 s13-patterns.css

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| CSS-01 | `--s13-max-width` equals 1200px | Variable set correctly | P0 |
| CSS-02 | `--s13-padding` equals 32px | Variable set correctly | P1 |
| CSS-03 | `--s13-radius` equals 12px | Variable set correctly | P1 |
| CSS-04 | `--brand-gradient` defined | Gradient value present | P0 |
| CSS-05 | Philosophy colors defined (4 colors) | Play, Assess, Align, Plan | P1 |
| CSS-06 | Status colors defined (5 colors) | Success, warning, error, info, neutral | P1 |

### 8.2 Standard Page Template

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| TPL-01 | All 3 pages include `s13-patterns.css` | CSS link present | P0 |
| TPL-02 | All 3 pages use `NavigationManager` | Nav component initialized | P0 |
| TPL-03 | Script load order: auth-check → common → navigation → toast → API → controller | Correct order in HTML | P0 |
| TPL-04 | All 3 pages initialize on `auth:ready` event | Event listener registered | P0 |
| TPL-05 | All 3 pages have loading state | `.loading` container visible on init | P0 |
| TPL-06 | All 3 pages have empty state | `.empty-state` shown when no data | P0 |

---

## 9. Sprint 11 Integration Regression Tests

These tests verify that Sprint 11 changes do NOT break existing functionality.

| ID | Test Case | What It Protects | Priority |
|----|-----------|------------------|----------|
| REG-01 | Login flow still works after Q1 token migration | Authentication | P0 |
| REG-02 | Existing assessment templates still load | Sprint 9 features | P0 |
| REG-03 | SSI diagnostic report still generates | Sprint 6/10 features | P0 |
| REG-04 | OKR generation still works | Sprint 3 features | P0 |
| REG-05 | Dashboard loads without errors | Sprint 4-5 features | P0 |
| REG-06 | Objectives page CRUD operations work | Sprint 6 features | P0 |
| REG-07 | Navigation between all pages works | Global nav | P0 |
| REG-08 | Role-based access control unchanged | RBAC middleware | P0 |
| REG-09 | Company profile page loads | Sprint 10 features | P0 |
| REG-10 | Configuration page loads | Sprint 10 features | P0 |
| REG-11 | Existing API clients backward compatible | All API clients | P0 |
| REG-12 | Existing Playwright BST suite passes (50 tests) | All existing features | P0 |

---

### 9.1 CONSULTANT Role Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| CON-01 | CONSULTANT can access all 3 pages (Assessment Hub, Question Library, Teams) | All pages load without 403 | P0 |
| CON-02 | CONSULTANT can create assessment templates | Template created successfully | P0 |
| CON-03 | CONSULTANT can view all teams across company | Full team list returned | P0 |
| CON-04 | CONSULTANT can create/edit/delete teams | CRUD operations succeed | P0 |
| CON-05 | CONSULTANT can view all invitations (sent-by-me equivalent) | Full invitation list returned | P0 |

### 9.2 Responsive Tests (768px)

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| RESP-01 | Assessment Hub at 768px — no horizontal overflow | No horizontal scrollbar | P0 |
| RESP-02 | Question Library at 768px — sidebar collapses or stacks below | Layout adapts without overlap | P0 |
| RESP-03 | Teams page at 768px — card grid becomes single column | Cards stack vertically | P0 |

---

## 10. User Journey Tests

### Journey 1: New Assessment Creation (End-to-End)

```
1. Login as BUSINESS_OWNER
2. Navigate to Assessment Hub
3. Verify KPI cards show correct counts
4. Click "Create Assessment"
5. Wizard Step 1: Select a template from card grid
6. Click template preview → verify questions shown
7. Close preview → click Next
8. Wizard Step 2: Select "Team" distribution → pick a team
9. Click Next
10. Wizard Step 3: Verify summary matches selections
11. Click "Launch"
12. Verify redirect to Assessment Hub
13. Verify "Sent by Me" tab shows new assessment
14. Login as team EMPLOYEE
15. Verify "Assigned to Me" tab shows new assessment
16. Complete the assessment
17. Login as BUSINESS_OWNER
18. Verify "Sent by Me" shows 1 completed
19. Verify "Team Results" shows updated score
```

### Journey 2: Question Library Management

```
1. Login as CONSULTANT
2. Navigate to Question Library
3. Verify dimension tree shows 3 dimensions (Speed/Strength/Intelligence)
4. Expand Speed → verify 4 blocks (Delivery, Decisions, Change, Response)
5. Click "Delivery" block
6. Verify main panel shows only Delivery questions
7. Switch to "Industry" tab
8. Verify industry-specific questions (or empty state)
9. Switch to "Core" tab
10. Select 10 questions across multiple blocks
11. Verify block coverage badge updates
12. Click "Create Template"
13. Wizard Step 2: Configure template name and settings
14. Wizard Step 3: Review → verify 10 questions listed
15. Save template
16. Verify toast notification
17. Navigate to Assessment Hub → Templates tab
18. Verify new template appears
```

### Journey 3: Team Management

```
1. Login as MANAGER
2. Navigate to Teams page
3. Verify stat cards show correct totals
4. Click "Create Team"
5. Fill modal: name, department, select manager
6. Add 3 members via checkboxes
7. Save team
8. Verify new team card appears in grid
9. Click the new team card
10. Verify detail panel shows 3 members + manager
11. Filter by department
12. Verify only matching teams shown
13. Clear filter → verify all teams shown
14. Login as EMPLOYEE
15. Navigate to Teams
16. Verify Create button is NOT visible
```

---

## 11. Automated Test File Structure

```
QA/sprints/sprint-11/
├── SPRINT-11-TEST-PLAN.md              (this file)
├── unit/
│   ├── assessment-hub.test.js          (U5-U01 to U5-U14)
│   ├── question-library.test.js        (U3-U01 to U3-U11)
│   ├── teams-page.test.js              (U4-U01 to U4-U09)
│   ├── assessment-quality.test.js      (QA-U01 to QA-U10)
│   ├── assessment-wizard.test.js       (J-U01 to J-U12)
│   ├── auth-token-migration.test.js    (Q1-U01 to Q1-U08)
│   └── input-validation.test.js        (Q2-U01 to Q2-U13)
├── integration/
│   ├── assessment-api.test.js          (U5-I01 to U5-I09)
│   ├── question-api.test.js            (U3-I01 to U3-I07, QA-I01 to QA-I08)
│   ├── team-api.test.js                (U4-I01 to U4-I08)
│   ├── invitation-api.test.js          (J-I01 to J-I10)
│   ├── auth-api.test.js                (Q1-I01 to Q1-I05)
│   └── validation-api.test.js          (Q2-I01 to Q2-I05)
├── e2e/
│   ├── assessment-hub.spec.ts          (U5-E01 to U5-E08)
│   ├── question-library.spec.ts        (U3-E01 to U3-E07)
│   ├── teams.spec.ts                   (U4-E01 to U4-E06)
│   ├── assessment-wizard.spec.ts       (J-E01 to J-E08)
│   ├── consultant-role.spec.ts         (CON-01 to CON-05)
│   ├── responsive.spec.ts             (RESP-01 to RESP-03)
│   └── regression.spec.ts             (REG-01 to REG-12)
├── journeys/
│   ├── assessment-creation.spec.ts     (Journey 1)
│   ├── question-library-mgmt.spec.ts   (Journey 2)
│   └── team-management.spec.ts         (Journey 3)
└── edge-cases/
    ├── assessment-hub-edge.test.js     (U5-X01 to U5-X09)
    ├── question-library-edge.test.js   (U3-X01 to U3-X07)
    ├── teams-edge.test.js              (U4-X01 to U4-X07)
    └── assessment-wizard-edge.test.js  (J-X01 to J-X07)
```

---

## 12. Test Execution Order

```
Phase 1: Unit Tests (run first, fast feedback)
  npm test -- tests/unit/sprint-11/

Phase 2: Integration Tests (requires DB)
  npm test -- tests/integration/sprint-11/

Phase 3: E2E Tests (requires running server)
  npx playwright test QA/sprints/sprint-11/e2e/

Phase 4: Journey Tests (full user flows)
  npx playwright test QA/sprints/sprint-11/journeys/

Phase 5: Regression Tests (existing features unbroken)
  npx playwright test QA/sprints/sprint-11/e2e/regression.spec.ts
  npm run test:bst  (existing 50 BST tests)
```

---

## 13. Pass Criteria

| Gate | Requirement |
|------|-------------|
| Unit Tests | 100% pass rate |
| Integration Tests | 100% pass rate |
| E2E Tests | 100% pass rate |
| Journey Tests | 95% pass rate |
| Edge Cases | 90% pass rate |
| Regression (BST) | 100% pass rate |
| Code Coverage | ≥ 80% lines for new code |
| Security | All XSS/injection tests pass |
| Multi-tenancy | All isolation tests pass |
| Performance | All pages render < 2 seconds |

---

*Sprint 11 Test Plan — 204 total test cases*
*Last Updated: January 27, 2026*
