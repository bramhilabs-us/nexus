# Sprint 7, 8, 9 Epic Summary

**Created**: December 2, 2025
**Purpose**: Overview of all epics across Sprints 7-9

---

## Sprint Overview

| Sprint | Focus | Points | Days | Epics |
|--------|-------|--------|------|-------|
| **Sprint 7** | OKR Redesign, Company Profile, Planning View | 50 | 10-12 | A, B, C + Bug Fixes |
| **Sprint 8** | Dashboard Task Management | 35 | 7 | D |
| **Sprint 9** | Consultant Dashboard, Weekly Calendar | 26 | 7-8 | E, F |
| **Total** | | **111** | **24-27** | **6 Epics + Bug Fixes** |

---

## Complete Epic List

### Sprint 7 (50 pts)

| Epic | Name | Points | Stories | Priority |
|------|------|--------|---------|----------|
| **A** | OKR Generation Redesign | 19 | 7 | P0 |
| **B** | Company Profile Page | 10 | 4 | P1 |
| **C** | Planning Page View | 10 | 5 | P1 |
| **Bugs** | Critical Bug Fixes | 11 | 5 | P0 |

### Sprint 8 (35 pts)

| Epic | Name | Points | Stories | Priority |
|------|------|--------|---------|----------|
| **D** | Dashboard Task Management Redesign | 35 | 8 | P0 |

### Sprint 9 (26 pts)

| Epic | Name | Points | Stories | Priority |
|------|------|--------|---------|----------|
| **E** | Consultant Dashboard | 13 | 5 | P1 |
| **F** | Weekly Goals Calendar | 13 | 5 | P1 |

---

## Epic Details

### Epic A: OKR Generation Redesign (Sprint 7)

**Goal**: Replace dual buttons with unified "Add Objective" dropdown, single-objective AI generation.

| Story | Title | Points |
|-------|-------|--------|
| US-S7-A0 | Fix Owner Dropdown Population | 1 |
| US-S7-A1 | Unified "Add Objective" Dropdown | 3 |
| US-S7-A2 | AI Objective Generation Modal | 5 |
| US-S7-A3 | Category Coverage Widget | 3 |
| US-S7-A4 | Category Balance Validation | 3 |
| US-S7-A5 | Assessment-Driven Recommendations | 2 |
| US-S7-A6 | Data Sources Placeholder UI | 2 |

---

### Epic B: Company Profile Page (Sprint 7)

**Goal**: Dedicated page for company information that powers AI generation.

| Story | Title | Points |
|-------|-------|--------|
| US-S7-B1 | Company Profile Page - Basic | 5 |
| US-S7-B2 | Profile Access Control | 2 |
| US-S7-B3 | Profile Integration with AI | 2 |
| US-S7-B4 | Profile Completeness Indicator | 1 |

---

### Epic C: Planning Page View (Sprint 7)

**Goal**: Display generated plans in read-only tree view.

| Story | Title | Points |
|-------|-------|--------|
| US-S7-C1 | Plan Status on KR Cards | 2 |
| US-S7-C2 | Fetch Plan Hierarchy | 2 |
| US-S7-C3 | Tree View Display - Read Only | 3 |
| US-S7-C4 | Task Status Display | 2 |
| US-S7-C5 | Link to Dashboard | 1 |

---

### Bug Fixes (Sprint 7)

| Story | Title | Points |
|-------|-------|--------|
| US-S7-BUG1 | SSI Diagnostic Report 500 Error | 2 |
| US-S7-BUG2 | Owner Dropdown Empty | 1 |
| US-S7-BUG3 | Remove "Company Owner" from Signup | 1 |
| US-S7-BUG4 | KR Plan Status Not Updating | 2 |
| US-S7-BUG5 | Date Cascade Misalignment in AI Plans | 5 |

---

### Epic D: Dashboard Task Management Redesign (Sprint 8)

**Goal**: Clean, detailed task cards with Why Chain and intuitive actions.

| Story | Title | Points | Base Story |
|-------|-------|--------|------------|
| US-S8-D1 | Task Cards Redesign | 5 | EMP-008 |
| US-S8-D2 | Why Chain Display | 5 | EMP-016 |
| US-S8-D3 | Complete Task Action | 3 | EMP-009 |
| US-S8-D4 | Update Task Progress | 3 | EMP-010 |
| US-S8-D5 | Postpone Task with Date Picker | 5 | NEW |
| US-S8-D6 | Reassign Task (Manager Only) | 5 | NEW |
| US-S8-D7 | Task Grouping by Due Date | 5 | NEW |
| US-S8-D8 | Task Filters & Overdue Indicators | 4 | NEW |

---

### Epic E: Consultant Dashboard (Sprint 9)

**Goal**: Multi-company view for consultants.

| Story | Title | Points |
|-------|-------|--------|
| US-S9-E1 | Consultant Company Switcher | 3 |
| US-S9-E2 | Multi-Company Overview Dashboard | 5 |
| US-S9-E3 | Company Health Indicators | 2 |
| US-S9-E4 | Quick Actions per Company | 2 |
| US-S9-E5 | Company Comparison View | 1 |

---

### Epic F: Weekly Goals Calendar (Sprint 9)

**Goal**: Calendar view for weekly goals timeline.

| Story | Title | Points |
|-------|-------|--------|
| US-S9-F1 | Weekly Goals Calendar View | 5 |
| US-S9-F2 | Goal Duration Bars | 3 |
| US-S9-F3 | Week Navigation | 2 |
| US-S9-F4 | Goal Quick View Popover | 2 |
| US-S9-F5 | Calendar Export | 1 |

---

## User Journey Coverage

### Complete OKR Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE OKR WORKFLOW                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Phase 1: SSI Assessment                                                │
│  ├── Complete assessment                                                │
│  └── View results with category breakdown                               │
│                                                                         │
│  Phase 2: Objective Generation (Sprint 7 - Epic A)                      │
│  ├── Click "Add Objective" → Choose AI or Manual                        │
│  ├── Configure category, period, context                                │
│  ├── AI generates objective with KRs                                    │
│  └── Review and save objective                                          │
│                                                                         │
│  Phase 3: Plan Generation (Sprint 7 - Epic C)                           │
│  ├── View KRs in Planning page                                          │
│  ├── Click "Create Plan" for each KR                                    │
│  ├── AI generates Quarterly → Weekly → Tasks                            │
│  └── View plan hierarchy in tree view                                   │
│                                                                         │
│  Phase 4: Assignment (Sprint 7/8)                                       │
│  ├── Assign goals to managers                                           │
│  ├── Assign tasks to employees                                          │
│  └── Notify assignees                                                   │
│                                                                         │
│  Phase 5: Execution (Sprint 8 - Epic D)                                 │
│  ├── Employees see tasks in Dashboard                                   │
│  ├── Complete, postpone, or update progress                             │
│  ├── Managers can reassign tasks                                        │
│  └── Why Chain shows task context                                       │
│                                                                         │
│  Phase 6: Tracking (Sprint 9 - Epic F)                                  │
│  ├── Calendar view of weekly goals                                      │
│  ├── Progress bars on goal duration                                     │
│  └── Identify bottlenecks and overlaps                                  │
│                                                                         │
│  Phase 7: Achievement                                                   │
│  ├── All tasks completed → Weekly goal 100%                             │
│  ├── All weekly goals → Quarterly goal 100%                             │
│  ├── All quarterly goals → KR 100%                                      │
│  └── All KRs → Objective 100% = WIN                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Impact Summary

### Sprint 7

| New Files | Modified Files |
|-----------|----------------|
| `client/pages/company-profile.html` | `client/pages/objectives.html` |
| `client/pages/scripts/company-profile.js` | `client/pages/scripts/objectives.js` |
| `server/services/OKRValidationService.js` | `server/routes/ai-okr.js` |
| | `server/routes/planning.js` |
| | `server/models/Company.js` |
| | `client/pages/planning.html` |

### Sprint 8

| New Files | Modified Files |
|-----------|----------------|
| None | `client/pages/dashboard.html` |
| | `client/pages/scripts/dashboard.js` |
| | `client/css/dashboard.css` |
| | `server/routes/tasks.js` |

### Sprint 9

| New Files | Modified Files |
|-----------|----------------|
| `client/pages/consultant-dashboard.html` | `server/routes/companies.js` |
| `client/pages/scripts/consultant-dashboard.js` | `server/routes/goals.js` |
| `client/css/consultant-dashboard.css` | `client/js/navigation.js` |
| `client/pages/weekly-calendar.html` | |
| `client/pages/scripts/weekly-calendar.js` | |
| `client/css/weekly-calendar.css` | |
| `server/routes/consultant.js` | |

---

## Sprint Dependencies

```
Sprint 7 ──────────────────────────────────────────────────────┐
│                                                              │
├── Epic A (OKR Redesign)                                      │
├── Epic B (Company Profile)                                   │
├── Epic C (Planning View)                                     │
└── Bug Fixes (Date Cascade, etc.)                            │
                                                               │
                              ▼                                │
Sprint 8 ──────────────────────────────────────────────────────┤
│                                                              │
├── Epic D (Dashboard Task Management)                         │
│   └── Depends on: Sprint 7 Bug Fixes (BUG5 Date Cascade)    │
                                                               │
                              ▼                                │
Sprint 9 ──────────────────────────────────────────────────────┘
│
├── Epic E (Consultant Dashboard)
│   └── Depends on: Sprint 7 Company APIs
│
└── Epic F (Weekly Calendar)
    └── Depends on: Sprint 7 DateService, Sprint 8 patterns
```

---

## Key Documentation

| Document | Location |
|----------|----------|
| Sprint 7 Handoff | [SPRINT7_HANDOFF_DOCUMENT.md](./SPRINT-7/SPRINT7_HANDOFF_DOCUMENT.md) |
| Sprint 7 User Stories | [SPRINT-7-USER-STORIES.md](../1-PRODUCT/user-stories/SPRINT-7-USER-STORIES.md) |
| Sprint 8 Handoff | [SPRINT8_HANDOFF_DOCUMENT.md](./SPRINT-8/SPRINT8_HANDOFF_DOCUMENT.md) |
| Sprint 8 User Stories | [SPRINT-8-USER-STORIES.md](../1-PRODUCT/user-stories/SPRINT-8-USER-STORIES.md) |
| Sprint 9 Handoff | [SPRINT9_HANDOFF_DOCUMENT.md](./SPRINT-9/SPRINT9_HANDOFF_DOCUMENT.md) |
| Sprint 9 User Stories | [SPRINT-9-USER-STORIES.md](../1-PRODUCT/user-stories/SPRINT-9-USER-STORIES.md) |
| Comprehensive Test Plan | [OKR_WORKFLOW_COMPREHENSIVE_TEST_PLAN.md](../2-QA-AND-TESTING/OKR_WORKFLOW_COMPREHENSIVE_TEST_PLAN.md) |
| Scenarios & Edge Cases | [OKR_SCENARIOS_AND_EDGE_CASES.md](../2-QA-AND-TESTING/OKR_SCENARIOS_AND_EDGE_CASES.md) |

---

*Created: December 2, 2025*
*Status: Complete*
