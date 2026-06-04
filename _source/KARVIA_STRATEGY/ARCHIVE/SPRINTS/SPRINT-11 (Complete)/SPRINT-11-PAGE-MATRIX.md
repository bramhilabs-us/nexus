# Sprint 11 - Epic to Page Matrix

**Created**: January 19, 2026
**Purpose**: Internal review - Categorize epics by page/module for clarity

---

## Page-Based Epic Organization

### Core Application Pages (41 total)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           KARVIA BUSINESS - PAGE MAP                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 1: AUTHENTICATION (3 pages)                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   LOGIN     │  │   SIGNUP    │  │  FORGOT PW  │  │ RESET PW    │            │
│  │  login.html │  │ signup.html │  │forgot-pw.html│ │reset-pw.html│            │
│  │             │  │             │  │             │  │             │            │
│  │  No changes │  │  No changes │  │ QUICKFIX    │  │ QUICKFIX    │            │
│  │             │  │             │  │   (3 pts)   │  │  (incl.)    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 2: DASHBOARD (4 pages)                                    Sprint 13 ⏳  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  DASHBOARD  │  │  MANAGER    │  │  EXECUTIVE  │  │  ANALYTICS  │            │
│  │dashboard.html│ │manager-dash │  │exec-dash.html│ │analytics.html│           │
│  │             │  │             │  │             │  │             │            │
│  │  Sprint 13  │  │  No changes │  │  No changes │  │  No changes │            │
│  │  Epic D     │  │             │  │             │  │             │            │
│  │  (5 pts)    │  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 3: ASSESSMENT (10 pages)                                  Sprint 11 🎯  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ASSESS. HUB  │  │  CREATION   │  │  STEP 2     │  │  REVIEW     │            │
│  │assess-hub   │  │  FLOW       │  │  CUSTOMIZE  │  │  LAUNCH     │            │
│  │             │  │assess-creat │  │assess-step2 │  │assess-review│            │
│  │  Epic J     │  │  Epic J     │  │  Epic J     │  │  Epic J     │            │
│  │  UI Entry   │  │ NEW Step 1  │  │ Step 2      │  │ Step 3      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  QUESTION   │  │   TAKE      │  │   SURVEY    │  │  SURVEY     │            │
│  │  LIBRARY    │  │ ASSESSMENT  │  │   PUBLIC    │  │  CLOSED     │            │
│  │question-lib │  │assess-take  │  │ survey.html │  │survey-closed│            │
│  │             │  │             │  │             │  │             │            │
│  │  Epic J     │  │  No changes │  │  No changes │  │  No changes │            │
│  │  Filters    │  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐                                              │
│  │  RESULTS    │  │INVITATIONS  │                                              │
│  │assess-result│  │assess-invit │                                              │
│  │             │  │             │                                              │
│  │  No changes │  │  No changes │                                              │
│  └─────────────┘  └─────────────┘                                              │
│                                                                                 │
│  EPIC J SCOPE (28 pts):                                                         │
│  • J1-J5: Backend schema + API (18 pts)                                        │
│  • J6: NEW assessment-template-step1.html (6 pts)                              │
│  • J7: NEW assessment-template-step2.html (2 pts)                              │
│  • J8: NEW assessment-template-step3.html (2 pts)                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 4: SSI REPORTS (4 pages)                                  Sprint 12 📋  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  SSI VIEW   │  │ SSI REPORT  │  │  SSI FULL   │  │ SSI PUBLIC  │            │
│  │team-ssi-view│  │ ssi-report  │  │ssi-report-f │  │ssi-report-p │            │
│  │             │  │             │  │             │  │             │            │
│  │  Sprint 12  │  │  Sprint 12  │  │  Sprint 12  │  │  No changes │            │
│  │  Epic N     │  │  Epic N     │  │  Epic N     │  │             │            │
│  │  12-block   │  │  12-block   │  │  Narrative  │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 5: OKR MANAGEMENT (4 pages)                               Sprint 11 🎯  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ OBJECTIVES  │  │ OKR WIZARD  │  │  OKR DASH   │  │  AI REVIEW  │            │
│  │objectives   │  │okr-creation │  │okr-dashboard│  │ai-okr-review│            │
│  │             │  │  -wizard    │  │             │  │             │            │
│  │  Sprint 13  │  │  Sprint 11  │  │  No changes │  │  No changes │            │
│  │  Epic O     │  │  Epic M     │  │             │  │             │            │
│  │  Styling    │  │  Phase 1    │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
│  EPIC M PHASE 1 SCOPE (13 pts):                                                │
│  • M1: OKR Wizard page structure (5 pts)                                       │
│  • M6: Mode selection UI (3 pts)                                               │
│  • M10: Objective model extensions (3 pts)                                     │
│  • M2: Step 1 context review (2 pts)                                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 6: PLANNING (3 pages)                                     Sprint 11 🎯  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                             │
│  │  PLANNING   │  │  QUARTERLY  │  │   GOAL      │                             │
│  │planning.html│  │  GOALS      │  │  DETAILS    │                             │
│  │             │  │quarterly-g  │  │goal-details │                             │
│  │  Sprint 11  │  │             │  │             │                             │
│  │  EPIC L     │  │  No changes │  │  No changes │                             │
│  │  (25 pts)   │  │             │  │             │                             │
│  │  REDESIGN   │  │             │  │             │                             │
│  └─────────────┘  └─────────────┘  └─────────────┘                             │
│                                                                                 │
│  EPIC L SCOPE (25 pts):                                                         │
│  • L1: Week tiles grid (5 pts)                                                 │
│  • L2: KR sidebar selection (3 pts)                                            │
│  • L3: Week expansion panel (5 pts)                                            │
│  • L4: Week status from tasks (3 pts)                                          │
│  • L5: AI context assembly (5 pts)                                             │
│  • L6: AI suggestions UI (4 pts)                                               │
│                                                                                 │
│  ⚠️ OVERLAP: Sprint 13 Epic P also redesigns planning.html (5 pts)             │
│  RECOMMENDATION: Epic L is comprehensive, defer S13 Epic P                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 7: COMPANY & TEAMS (4 pages)                              Sprint 12 📋  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  COMPANY    │  │   CONFIG    │  │   TEAMS     │  │  TEAM PERF  │            │
│  │  PROFILE    │  │configuration│  │ teams.html  │  │team-perf-d  │            │
│  │             │  │             │  │             │  │             │            │
│  │  Sprint 12  │  │  No changes │  │  No changes │  │  No changes │            │
│  │  Epic P     │  │  (S10 done) │  │             │  │             │            │
│  │  Industry   │  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 8: GLOBAL / NAVIGATION                                    Sprint 13 ⏳  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  NAVIGATION.JS - All pages                                                  ││
│  │  Sprint 13: Epic R (Chief AI Rebranding - 3 pts)                           ││
│  │  Sprint 13: Epic T (Philosophy colors - 5 pts)                             ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  MODULE 9: FEEDBACK (2 pages)                                     No Changes    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                                              │
│  │  FEEDBACK   │  │  FEEDBACK   │                                              │
│  │feedback.html│  │ ADMIN       │                                              │
│  │             │  │feedback-adm │                                              │
│  │  No changes │  │  No changes │                                              │
│  └─────────────┘  └─────────────┘                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Sprint 11 Focus Summary

### Pages Being Modified in Sprint 11

| Module | Page | Epic | Points | Change Type |
|--------|------|------|--------|-------------|
| **Assessment** | NEW: assessment-template-step1.html | J | 6 | New page |
| **Assessment** | NEW: assessment-template-step2.html | J | 2 | New page |
| **Assessment** | NEW: assessment-template-step3.html | J | 2 | New page |
| **Assessment** | assessment-question-library.html | J | - | Filters (done Jan 19) |
| **Assessment** | assessment-hub.html | J | - | Entry link |
| **Planning** | planning.html | L | 25 | Major redesign |
| **OKR** | okr-creation-wizard.html | M | 8 | Structure + modes |
| **Auth** | forgot-password.html | QF | 2 | New flow |
| **Auth** | reset-password.html | QF | 1 | Token handling |

### Backend Changes in Sprint 11

| Model/Service | Epic | Change |
|---------------|------|--------|
| AssessmentQuestion.js | J | +5 fields (module_type, question_subtype, etc.) |
| Objective.js | M | +4 fields (level, parent_objective_id, team_id, cascade_metadata) |
| assessments.js routes | J | Module-filtered questions API |
| planning-ai-context.js | L | NEW: Context assembly service |

---

## Cross-Sprint Page Impact Analysis

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     PAGE MODIFICATION TIMELINE                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  SPRINT 11 (69 pts)          SPRINT 12 (74 pts)          SPRINT 13 (21 pts)    │
│  ═════════════════           ═════════════════           ═════════════════     │
│                                                                                 │
│  assessment-template-*       Assessment.js               navigation.js         │
│  ├── step1 (6 pts)           └── detailed_block_scores   ├── Logo (3 pts)      │
│  ├── step2 (2 pts)                                       └── Colors (5 pts)    │
│  └── step3 (2 pts)           team-ssi-view.html                                │
│                              └── 12-block view           dashboard.html        │
│  planning.html                                           └── Redesign (5 pts)  │
│  └── Week tiles (25 pts)     ssi-report.html                                   │
│                              └── Narrative (5 pts)       objectives.html       │
│  okr-creation-wizard.html                                └── Styling (3 pts)   │
│  └── Wizard (8 pts)          company-profile.html                              │
│                              └── Industry (3 pts)        ⚠️ planning.html      │
│  forgot-password.html                                    └── 5 pts OVERLAP     │
│  └── Flow (3 pts)            ai-okr.js                                         │
│                              └── Auth fix (2 pts)                              │
│                                                                                 │
│  Backend Focus:              Backend Focus:              Frontend Only:         │
│  • AssessmentQuestion        • Assessment.js             • CSS/HTML changes    │
│  • Objective.js              • TargetCalculator          • No backend          │
│  • Questions API             • AIContextService                                │
│                              • Prompt enrichment                                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Recommended Sprint 11 Implementation Order

### Week 1: Assessment Module (Epic J Backend)

```
Day 1-3: Schema + Seed Data (18 pts)
├── J1: AssessmentQuestion schema (5 pts)
├── J2: Core questions seed (3 pts)
├── J3: Financial Services questions (3 pts)
├── J4: Role questions (2 pts)
└── J5: Module-filtered API (5 pts)
```

### Week 2: Assessment UI + Planning Start

```
Day 4-5: Assessment Template Wizard (10 pts)
├── J6: Step 1 - Select Questions (6 pts)
├── J7: Step 2 - Configure Template (2 pts)
└── J8: Step 3 - Review & Save (2 pts)

Day 6-7: Planning Module Start (8 pts)
├── L1: Week tiles grid (5 pts)
└── L2: KR sidebar selection (3 pts)
```

### Week 2.5: Planning Complete + OKR + Quickfix

```
Day 8-10: Planning Completion (17 pts)
├── L3: Week expansion panel (5 pts)
├── L4: Week status from tasks (3 pts)
├── L5: AI context assembly (5 pts)
└── L6: AI suggestions UI (4 pts)

Day 11-12: OKR Wizard Foundation (8 pts)
├── M1: Wizard page structure (5 pts)
└── M6: Mode selection UI (3 pts)

Day 13: Model + Quickfix (6 pts)
├── M10: Objective model extensions (3 pts)
└── Quickfix: Forgot password (3 pts)
```

---

## Conflicts & Resolutions

### Issue 1: Planning Page Overlap (Epic L vs Sprint 13 Epic P)

**Analysis**:
- Epic L (S11): 25 pts - Week tiles grid, AI context assembly, comprehensive redesign
- Epic P (S13): 5 pts - Two-panel with collapsible cards, owner assignment

**Resolution**: **Do Epic L in Sprint 11, REMOVE Epic P from Sprint 13**
- Epic L is more comprehensive and includes AI context
- Sprint 13 Epic P becomes redundant after Epic L
- Sprint 13 scope reduces: 21 → 16 pts

### Issue 2: Dependency D1/D2/D4 Doesn't Exist

**Analysis**: Sprint 11 claims dependency on "Sprint 10 D1, D2, D4" but Sprint 10 completed with Epics S, R, K (no D).

**Resolution**:
- L4 "Week status from tasks" depends on existing `/api/tasks` endpoint (exists)
- M2 depends on Epic K company profile (S10 ✅ Complete)
- **Remove false dependency references** from Sprint 11 plan

### Issue 3: Epic Naming Collision (Sprint 12 Epic P vs Sprint 13 Epic P)

**Resolution**: Rename Sprint 13 Epic P → **Epic U** (UI Planning Redesign)
- But since we're removing it (see Issue 1), this is moot

---

## Updated Sprint 11 Plan

| Epic | Points | Pages Affected | Status |
|------|--------|----------------|--------|
| **Epic J** | 28 | 3 new + 2 existing | ✅ Ready |
| **Epic L** | 25 | planning.html | ✅ Ready |
| **Epic M Phase 1** | 13 | okr-creation-wizard.html | ✅ Ready |
| **Quickfix** | 3 | forgot-password.html | ✅ Ready |
| **Total** | **69** | | |

---

## Updated Sprint 13 Plan (Post-Resolution)

| Epic | Points | Change |
|------|--------|--------|
| Epic R (Rebranding) | 3 | Unchanged |
| Epic T (Navigation) | 5 | Unchanged |
| Epic D (Dashboard) | 5 | Unchanged |
| Epic O (Objectives styling) | 3 | Unchanged |
| ~~Epic P (Planning)~~ | ~~5~~ | **REMOVED** (covered by S11 Epic L) |
| **Total** | **16** | Reduced from 21 |

---

**Document Status**: Ready for review
**Next Action**: Approve changes, update master plans
