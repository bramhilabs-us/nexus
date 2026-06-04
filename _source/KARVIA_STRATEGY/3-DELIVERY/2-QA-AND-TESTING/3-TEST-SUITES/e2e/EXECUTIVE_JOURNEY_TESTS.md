# Executive Journey Tests

**Version**: 1.0.0
**Last Updated**: February 16, 2026
**Persona**: EXECUTIVE (Strategic Leader)
**Journey Duration**: Quarterly strategic planning workflow

---

## Overview

The Executive journey focuses on strategic OKR creation, department oversight, and organizational alignment. This test suite validates the executive experience from SSI analysis through OKR management.

---

## Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EXECUTIVE JOURNEY FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  LOGIN  │───▶│   SSI   │───▶│   OKR   │───▶│ CREATE  │───▶│ REVIEW  │  │
│  │         │    │ REPORT  │    │ WIZARD  │    │ MANUAL  │    │ APPROVE │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │              │        │
│       ▼              ▼              ▼              ▼              ▼        │
│  [Dashboard]   [12-Block     [AI-Gen        [Form          [Approve/      │
│               Analysis]      OKRs]          Entry]         Reject]        │
│                                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                 │
│  │ ASSIGN  │───▶│OBJECTIVES│───▶│ MONITOR │───▶│ REPORT  │                 │
│  │ OWNERS  │    │   PAGE  │    │ PROGRESS│    │ RESULTS │                 │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Login & Strategic Overview

### EXJ-P1-001: Executive Login

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to login page | Login form displays | [ ] |
| 2 | Enter executive credentials | Credentials accepted | [ ] |
| 3 | Click Login | Dashboard loads | [ ] |
| 4 | Verify executive features | Full menu access | [ ] |
| 5 | Verify "Create Objective" enabled | Button visible | [ ] |

**Executive Capabilities Verified**:
- [ ] Can create objectives
- [ ] Can delete objectives
- [ ] Can view all departments
- [ ] Can assign to any team member
- [ ] Can access OKR wizard

### EXJ-P1-002: Company Dashboard Overview

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View Dashboard | Dashboard loads | [ ] |
| 2 | See company-wide metrics | All objectives visible | [ ] |
| 3 | See department breakdown | By department | [ ] |
| 4 | See overall progress | Company % | [ ] |
| 5 | Identify strategic gaps | At-risk objectives | [ ] |

---

## Phase 2: SSI Analysis

### EXJ-P2-001: View SSI Report

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Team SSI View | SSI page loads | [ ] |
| 2 | See 3 dimension scores | Speed, Strength, Intelligence | [ ] |
| 3 | See 12-block breakdown | All blocks visible | [ ] |
| 4 | View radar chart | Visual comparison | [ ] |
| 5 | View industry benchmarks | Benchmark lines | [ ] |
| 6 | Read LLM narratives | AI insights | [ ] |
| 7 | Identify weak areas | < 60% highlighted | [ ] |
| 8 | Identify strong areas | > 80% highlighted | [ ] |

### EXJ-P2-002: SSI Analytics Deep Dive

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View department SSI | Department breakdown | [ ] |
| 2 | Compare departments | Comparison chart | [ ] |
| 3 | View individual vs team | Comparison view | [ ] |
| 4 | Export PDF report | PDF downloads | [ ] |
| 5 | Share report link | Link generated | [ ] |

---

## Phase 3: OKR Generation

### EXJ-P3-001: Launch OKR Wizard

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | From Objectives page | Page loads | [ ] |
| 2 | Click "OKR Wizard" button | Wizard Step 1 | [ ] |
| 3 | See portfolio analysis | Current coverage | [ ] |
| 4 | See category gaps | Uncovered categories | [ ] |
| 5 | See SSI weak areas | Linked to categories | [ ] |

### EXJ-P3-002: Configure OKR Generation

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select category "Growth" | Category selected | [ ] |
| 2 | Select category "Innovation" | Multi-select works | [ ] |
| 3 | Set count = 2 per category | Count configured | [ ] |
| 4 | Set period = FY 2026 | Period selected | [ ] |
| 5 | Click Generate | Step 2: Loading | [ ] |

### EXJ-P3-003: Review AI Suggestions

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Wait for AI response | 4 objectives appear | [ ] |
| 2 | See objective titles | Clear, specific | [ ] |
| 3 | See AI reasoning | Why this objective | [ ] |
| 4 | See linked SSI blocks | Which blocks addressed | [ ] |
| 5 | See suggested KRs | 3 KRs per objective | [ ] |
| 6 | Edit objective title | Inline edit | [ ] |
| 7 | Edit KR target | Target updates | [ ] |

### EXJ-P3-004: Approve/Reject Flow

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Approve first objective | Status = approved | [ ] |
| 2 | Approve second objective | Status = approved | [ ] |
| 3 | Reject third objective | Reason picker | [ ] |
| 4 | Select "not_strategic" | Reason saved | [ ] |
| 5 | Reject fourth with "too_ambitious" | Reason saved | [ ] |
| 6 | Click "Save Approved" | 2 objectives created | [ ] |
| 7 | Verify in Objectives page | 2 new objectives | [ ] |

### EXJ-P3-005: Regeneration with Learning

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Return to OKR Wizard | Wizard opens | [ ] |
| 2 | Same categories | Growth, Innovation | [ ] |
| 3 | Generate again | AI processing | [ ] |
| 4 | Verify different suggestions | Not same as rejected | [ ] |
| 5 | Verify AI learned | More strategic, realistic | [ ] |

---

## Phase 4: Manual Objective Creation

### EXJ-P4-001: Create Objective Manually

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Objectives | Page loads | [ ] |
| 2 | Click "Create Objective" | Creation form | [ ] |
| 3 | Enter title | Title validates | [ ] |
| 4 | Select category "Operations" | Category selected | [ ] |
| 5 | Set period = Q1 2026 | Period selected | [ ] |
| 6 | Enter description | Description saves | [ ] |
| 7 | Click Save | Objective created | [ ] |

### EXJ-P4-002: Add Key Results

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select new objective | Details expand | [ ] |
| 2 | Click "Add Key Result" | KR form | [ ] |
| 3 | Enter KR title | Title validates | [ ] |
| 4 | Set target = 100 | Value accepted | [ ] |
| 5 | Set unit = "%" | Unit selected | [ ] |
| 6 | Set deadline = end of Q1 | Date within objective | [ ] |
| 7 | Save KR | KR appears | [ ] |
| 8 | Add 2 more KRs | 3 KRs total | [ ] |

---

## Phase 5: Owner Assignment

### EXJ-P5-001: Assign Objective Owners

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select objective | Details visible | [ ] |
| 2 | Click "Assign Owner" | User dropdown | [ ] |
| 3 | See all employees | Full company list | [ ] |
| 4 | Select Manager A | Owner assigned | [ ] |
| 5 | Verify owner badge | Avatar shows | [ ] |
| 6 | Assign different objective to Manager B | Owner varies | [ ] |

### EXJ-P5-002: Assign KR Owners

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select KR | KR details | [ ] |
| 2 | Click "Assign" | User dropdown | [ ] |
| 3 | Select team member | Owner assigned | [ ] |
| 4 | Verify inheritance | Can differ from objective | [ ] |

---

## Phase 6: Objectives Management

### EXJ-P6-001: Objectives Page S13

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Objectives | S13 design loads | [ ] |
| 2 | See KPIs bar | Active count, progress, at-risk | [ ] |
| 3 | See category pills | 6 categories | [ ] |
| 4 | See quarter selector | Q1-Q4 buttons | [ ] |
| 5 | Use category filter | Filter works | [ ] |
| 6 | Use quarter filter | Filter works | [ ] |
| 7 | Use search | Search works | [ ] |

### EXJ-P6-002: Objective Cards

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View objective card | Card layout | [ ] |
| 2 | See progress ring | Percentage | [ ] |
| 3 | See status badge | 6-state status | [ ] |
| 4 | See owner avatar | Initials | [ ] |
| 5 | See AI badge | If AI-generated | [ ] |
| 6 | See inline KRs | KR list | [ ] |
| 7 | See KR colors | Progress-based | [ ] |

### EXJ-P6-003: Edit Objective

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click objective | Details expand | [ ] |
| 2 | Click Edit | Edit modal | [ ] |
| 3 | Change title | Title updates | [ ] |
| 4 | Change category | Category updates | [ ] |
| 5 | Save changes | Objective saved | [ ] |

### EXJ-P6-004: Archive Objective

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select completed objective | Details visible | [ ] |
| 2 | Click "Archive" | Confirmation modal | [ ] |
| 3 | Confirm archive | Status = archived | [ ] |
| 4 | Verify removed from active | Not in active list | [ ] |
| 5 | Toggle "Show Archived" | Archived visible | [ ] |

---

## Phase 7: Progress Monitoring

### EXJ-P7-001: Track Company Progress

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View Dashboard | Company metrics | [ ] |
| 2 | See overall progress | Aggregate % | [ ] |
| 3 | Identify at-risk objectives | Status badges | [ ] |
| 4 | Drill into at-risk | See KR details | [ ] |
| 5 | Identify blockers | Overdue tasks | [ ] |

### EXJ-P7-002: Department Comparison

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View by department | Department breakdown | [ ] |
| 2 | Compare progress | Visual comparison | [ ] |
| 3 | Identify lagging dept | Lowest % | [ ] |
| 4 | Drill into dept | Department details | [ ] |

---

## Phase 8: Edge Cases

### EXJ-P8-001: Permission Verification

| Action | Expected | Status |
|--------|----------|--------|
| Create objective | Allowed | [ ] |
| Delete objective | Allowed with confirmation | [ ] |
| Archive objective | Allowed | [ ] |
| View all departments | Full access | [ ] |
| Assign to any user | Full company list | [ ] |
| Run OKR Wizard | Allowed | [ ] |

### EXJ-P8-002: OKR Generation Edge Cases

| Scenario | Expected | Status |
|----------|----------|--------|
| No SSI data | AI uses company profile only | [ ] |
| All categories covered | AI suggests improvements | [ ] |
| Generate 10 objectives | Max limit enforced | [ ] |
| Same objective exists | AI avoids duplicates | [ ] |

### EXJ-P8-003: Validation Edge Cases

| Scenario | Expected | Status |
|----------|----------|--------|
| KR date outside objective | Validation error | [ ] |
| Objective no category | Required field error | [ ] |
| Delete objective with KRs | Cascade delete warning | [ ] |
| Archive with active KRs | Warning shown | [ ] |

---

## Full Journey Test Execution

### Quarterly Planning Session (~1 hour)

| # | Test Case | Duration | Status |
|---|-----------|----------|--------|
| 1 | Login as Executive | 2 min | [ ] |
| 2 | Review SSI Report | 10 min | [ ] |
| 3 | Run OKR Wizard | 15 min | [ ] |
| 4 | Approve/reject suggestions | 10 min | [ ] |
| 5 | Create 1 manual objective | 10 min | [ ] |
| 6 | Assign owners | 8 min | [ ] |
| 7 | Verify in Objectives page | 5 min | [ ] |

### Full Journey Test (~2 hours)

| Phase | Test IDs | Duration | Status |
|-------|----------|----------|--------|
| P1: Login & Overview | EXJ-P1-001, EXJ-P1-002 | 10 min | [ ] |
| P2: SSI Analysis | EXJ-P2-001, EXJ-P2-002 | 15 min | [ ] |
| P3: OKR Generation | EXJ-P3-001 to EXJ-P3-005 | 30 min | [ ] |
| P4: Manual Creation | EXJ-P4-001, EXJ-P4-002 | 15 min | [ ] |
| P5: Owner Assignment | EXJ-P5-001, EXJ-P5-002 | 10 min | [ ] |
| P6: Objectives Mgmt | EXJ-P6-001 to EXJ-P6-004 | 20 min | [ ] |
| P7: Progress Monitor | EXJ-P7-001, EXJ-P7-002 | 10 min | [ ] |
| P8: Edge Cases | EXJ-P8-001 to EXJ-P8-003 | 15 min | [ ] |

**Total Duration**: ~125 minutes

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |

---

**Document Version**: 1.0.0
**Review Cycle**: Each sprint
