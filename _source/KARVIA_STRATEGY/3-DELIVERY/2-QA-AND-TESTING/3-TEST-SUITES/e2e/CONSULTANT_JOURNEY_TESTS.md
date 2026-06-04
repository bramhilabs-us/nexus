# Consultant Journey Tests

**Version**: 1.0.0
**Last Updated**: February 16, 2026
**Persona**: CONSULTANT (Primary B2B User)
**Journey Duration**: Full client engagement lifecycle

---

## Overview

The Consultant journey is the most comprehensive flow, spanning from client acquisition through ongoing OKR management. This test suite validates the complete consultant experience.

---

## Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONSULTANT JOURNEY FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ LOGIN & │───▶│ CLIENT  │───▶│ASSESSMENT│───▶│   SSI   │───▶│   OKR   │  │
│  │ SETUP   │    │  MGMT   │    │ WIZARD  │    │ REPORT  │    │  GEN    │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  [Dashboard]   [My Clients]  [Assessment Hub] [Team SSI]  [Objectives]    │
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │PLANNING │◀───│ REVIEW  │◀───│ GOALS   │◀───│ ASSIGN  │◀───│ ONGOING │  │
│  │  PAGE   │    │ MEETING │    │  GEN    │    │ OWNERS  │    │ MONITOR │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Login & Initial Setup

### CJ-P1-001: Consultant Login

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to login page | Login form displays | [ ] |
| 2 | Enter valid consultant credentials | Credentials accepted | [ ] |
| 3 | Click Login | Dashboard loads | [ ] |
| 4 | Verify company switcher visible | Switcher in header | [ ] |
| 5 | Verify managed companies in dropdown | All client companies shown | [ ] |

**Acceptance Criteria**:
- [ ] Token stored in localStorage
- [ ] User role = CONSULTANT
- [ ] Company switcher functional

### CJ-P1-002: Company Context Switch

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click company switcher | Dropdown opens | [ ] |
| 2 | Verify company list | All managed companies shown | [ ] |
| 3 | Select different company | Context switches | [ ] |
| 4 | Verify Dashboard data | New company's data displays | [ ] |
| 5 | Navigate to Objectives | New company's objectives | [ ] |
| 6 | Navigate to Assessments | New company's assessments | [ ] |

**Edge Cases**:
- [ ] Switch with unsaved changes → Warning shown
- [ ] Switch to deactivated company → Company not in list
- [ ] Rapid switching → No data corruption

---

## Phase 2: Client Management

### CJ-P2-001: Add New Client Company

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Assessment Hub | Hub loads with tabs | [ ] |
| 2 | Click "My Clients" tab | Client list displays | [ ] |
| 3 | Click "Add Client" button | Add client modal opens | [ ] |
| 4 | Fill company name | Name validates | [ ] |
| 5 | Fill industry | Industry dropdown works | [ ] |
| 6 | Fill company size | Size selector works | [ ] |
| 7 | Fill primary contact email | Email validates | [ ] |
| 8 | Click "Add Client" | Client created | [ ] |
| 9 | Verify client in list | New client appears | [ ] |
| 10 | Verify NO assessment created | No phantom assessment | [ ] |

**Critical Validation** (BF1 Bug Fix):
- [ ] Only company record created
- [ ] No assessment auto-generated
- [ ] "Sent by Me" shows no new entries

### CJ-P2-002: Edit Client Details

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Find client in My Clients | Client visible | [ ] |
| 2 | Click Edit | Edit modal opens | [ ] |
| 3 | Modify company size | Change accepted | [ ] |
| 4 | Modify industry | Change accepted | [ ] |
| 5 | Save changes | Client updated | [ ] |
| 6 | Verify changes persisted | Refresh shows new data | [ ] |

### CJ-P2-003: Client Company Profile

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Switch to client company | Context switches | [ ] |
| 2 | Navigate to Company Profile | Profile page loads | [ ] |
| 3 | Verify company data | Name, industry, size correct | [ ] |
| 4 | Edit fiscal year setting | Setting saves | [ ] |
| 5 | Verify fiscal year affects Objectives | Quarter calculation correct | [ ] |

---

## Phase 3: Assessment Workflow

### CJ-P3-001: Create Assessment Template

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Assessment Hub | Hub loads | [ ] |
| 2 | Click "Create New Assessment" | Wizard Step 1 opens | [ ] |
| 3 | Enter template name | Name validates | [ ] |
| 4 | Enter template description | Description saves | [ ] |
| 5 | Click Next | Step 2: Configure Weights | [ ] |
| 6 | Set Speed weight = 40% | Value accepted | [ ] |
| 7 | Set Strength weight = 30% | Value accepted | [ ] |
| 8 | Set Intelligence weight = 30% | Value accepted | [ ] |
| 9 | Verify sum = 100% | Validation passes | [ ] |
| 10 | Click Next | Step 3: Select Questions | [ ] |
| 11 | Select 15 Speed questions | Questions selected | [ ] |
| 12 | Select 15 Strength questions | Questions selected | [ ] |
| 13 | Select 15 Intelligence questions | Questions selected | [ ] |
| 14 | Verify 45 total selected | Counter shows 45 | [ ] |
| 15 | Click Next | Step 4: Review | [ ] |
| 16 | Review summary | All selections visible | [ ] |
| 17 | Click Save Template | Template saved | [ ] |
| 18 | Verify in My Templates tab | Template appears | [ ] |

**Edge Cases**:
- [ ] Weights != 100% → Validation error
- [ ] < 10 questions → Validation error
- [ ] Same question twice → Prevented

### CJ-P3-002: Send Assessment to Client

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select template | Template loads | [ ] |
| 2 | Choose "Email" variant | Email mode selected | [ ] |
| 3 | Add recipient email 1 | Email validates | [ ] |
| 4 | Add recipient email 2 | Email validates | [ ] |
| 5 | Add recipient email 3 | Email validates | [ ] |
| 6 | Set deadline (7 days) | Date picker works | [ ] |
| 7 | Click Send | Invitations sent | [ ] |
| 8 | Verify "Sent by Me" tab | 3 pending assessments | [ ] |
| 9 | Check email delivery | Emails received | [ ] |

### CJ-P3-003: Monitor Assessment Progress

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to "Sent by Me" | Assessment batch visible | [ ] |
| 2 | View batch details | 3 invitations, 0 completed | [ ] |
| 3 | Wait for 1 submission | Status updates | [ ] |
| 4 | Refresh page | 1 completed, 2 pending | [ ] |
| 5 | All 3 submitted | Batch shows "Complete" | [ ] |
| 6 | View aggregate SSI | Company SSI calculated | [ ] |

---

## Phase 4: SSI Analysis

### CJ-P4-001: View SSI Report

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Team SSI View | SSI page loads | [ ] |
| 2 | Verify 3 dimension scores | Speed, Strength, Intelligence | [ ] |
| 3 | Verify 12 block breakdown | All 12 blocks visible | [ ] |
| 4 | View radar chart | Chart renders correctly | [ ] |
| 5 | View industry benchmarks | Benchmarks displayed | [ ] |
| 6 | View LLM narratives | AI insights visible | [ ] |
| 7 | Identify weak areas | < 60% blocks highlighted | [ ] |

### CJ-P4-002: Share SSI Report

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click "Share Report" | Share modal opens | [ ] |
| 2 | Generate share link | Link created | [ ] |
| 3 | Copy link | Link copied | [ ] |
| 4 | Open in incognito | Public view loads | [ ] |
| 5 | Verify limited data | No narratives in public | [ ] |
| 6 | Wait 7 days | Link expires | [ ] |

---

## Phase 5: OKR Generation

### CJ-P5-001: Generate OKRs from SSI

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | From SSI page, click "Generate OKRs" | Config modal opens | [ ] |
| 2 | Select period (FY 2026) | Period selected | [ ] |
| 3 | Configure count (4-6 objectives) | Count set | [ ] |
| 4 | Click Generate | Loading indicator | [ ] |
| 5 | Wait for AI response | 4-6 objectives appear | [ ] |
| 6 | Verify SSI context used | Objectives address weak blocks | [ ] |
| 7 | View AI reasoning | Reasoning visible (X9) | [ ] |

### CJ-P5-002: Review and Approve OKRs

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Review first objective | Title, category, KRs visible | [ ] |
| 2 | Edit objective title | Inline edit works | [ ] |
| 3 | Approve objective 1 | Status = approved | [ ] |
| 4 | Reject objective 2 | Rejection reason picker | [ ] |
| 5 | Select "too_generic" | Reason saved | [ ] |
| 6 | Approve remaining | 4 approved, 1 rejected | [ ] |
| 7 | Click "Save Approved" | Objectives created | [ ] |
| 8 | Navigate to Objectives | 4 new objectives visible | [ ] |

### CJ-P5-003: Regeneration with Rejection Learning

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Return to SSI page | Page loads | [ ] |
| 2 | Click "Generate More OKRs" | Modal opens | [ ] |
| 3 | Generate | New suggestions | [ ] |
| 4 | Verify rejection context | AI avoided "too_generic" | [ ] |
| 5 | Verify different suggestions | Not same as rejected | [ ] |

---

## Phase 6: Objective Management

### CJ-P6-001: Manage Objectives

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Objectives | All objectives listed | [ ] |
| 2 | Use quarter filter | Filter works | [ ] |
| 3 | Use category filter | Filter works | [ ] |
| 4 | View objective details | KRs inline | [ ] |
| 5 | Assign owner | Owner dropdown | [ ] |
| 6 | Save assignment | Owner saved | [ ] |

### CJ-P6-002: Add Key Results

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select objective | Details expand | [ ] |
| 2 | Click "Add Key Result" | KR form opens | [ ] |
| 3 | Enter KR title | Title validates | [ ] |
| 4 | Set target value | Value accepts | [ ] |
| 5 | Set target date | Date within objective | [ ] |
| 6 | Save KR | KR appears in list | [ ] |
| 7 | Verify 3 KRs per objective | Count correct | [ ] |

---

## Phase 7: Planning Support

### CJ-P7-001: Generate Weekly Goals

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Planning | Two-panel layout | [ ] |
| 2 | Select objective | KRs appear | [ ] |
| 3 | Select KR | Weekly goals section | [ ] |
| 4 | Click "Generate Weekly Goals" | Modal opens | [ ] |
| 5 | Select week range | Date picker works | [ ] |
| 6 | Click Generate | AI generates goals | [ ] |
| 7 | Review AI suggestions | 4 weekly goals | [ ] |
| 8 | Approve selected | Goals created | [ ] |

### CJ-P7-002: Generate Tasks

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select weekly goal | Goal details expand | [ ] |
| 2 | Click "Generate Tasks" | AI generates tasks | [ ] |
| 3 | Verify context includes SSI | Tasks address weaknesses | [ ] |
| 4 | Verify context includes history | Patterns from 1-year | [ ] |
| 5 | Approve tasks | Tasks created | [ ] |
| 6 | Assign tasks to employees | Assignment works | [ ] |

---

## Phase 8: Ongoing Monitoring

### CJ-P8-001: Progress Monitoring

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View Dashboard | Tasks, goals visible | [ ] |
| 2 | Check progress cascade | Task → Goal → KR → Objective | [ ] |
| 3 | View company-wide progress | Aggregate metrics | [ ] |
| 4 | Identify at-risk objectives | Status badges correct | [ ] |

### CJ-P8-002: Client Handoff

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Export SSI Report PDF | PDF downloads | [ ] |
| 2 | Export Objectives summary | Summary downloads | [ ] |
| 3 | Share links with client | Links work | [ ] |

---

## Full Journey Test Execution

### Execution Checklist

| Phase | Test IDs | Duration | Status |
|-------|----------|----------|--------|
| P1: Login & Setup | CJ-P1-001, CJ-P1-002 | 10 min | [ ] |
| P2: Client Management | CJ-P2-001, CJ-P2-002, CJ-P2-003 | 15 min | [ ] |
| P3: Assessment | CJ-P3-001, CJ-P3-002, CJ-P3-003 | 30 min | [ ] |
| P4: SSI Analysis | CJ-P4-001, CJ-P4-002 | 15 min | [ ] |
| P5: OKR Generation | CJ-P5-001, CJ-P5-002, CJ-P5-003 | 20 min | [ ] |
| P6: Objective Management | CJ-P6-001, CJ-P6-002 | 15 min | [ ] |
| P7: Planning Support | CJ-P7-001, CJ-P7-002 | 20 min | [ ] |
| P8: Ongoing Monitoring | CJ-P8-001, CJ-P8-002 | 10 min | [ ] |

**Total Duration**: ~2.5 hours

### Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |

---

**Document Version**: 1.0.0
**Review Cycle**: Each sprint
