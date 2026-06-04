# BETA RELEASE PROJECT ROADMAP

<!-- @GENOME T1-PRD-006 | ACTIVE | 2026-03-30 | parent:T1-PRD-002 | auto:/strategy | linked:/coding -->

**Version**: 1.0
**Created**: March 22, 2026
**Status**: ACTIVE
**Target Launch**: Q2 2026

---

## Executive Summary

This roadmap transitions YSELA from a task-tracking application to a **behavior transformation operating system**. The beta release proves the core thesis: employees engage because they *want to*, not because they *have to*.

### Philosophy Stack

| Layer | Name | Purpose |
|-------|------|---------|
| Philosophy | **BBB** (Behavior Based Business) | Why behavior change drives business outcomes |
| Engine | **GRIT** (Growth-Reinforcement-Investment-Trigger) | How behavior loops sustain engagement |
| Operating System | **YSELA** | Where BBB + GRIT execute inside companies |

### Core Insight (Garmin Analogy)

> "People use Garmin because they WANT to see their steps, not because their boss told them to."

YSELA must create the same pull. The beta proves this through:
- **Assessment** drives intent (employees see their profile)
- **Team formation** creates belonging (complementary strengths)
- **Micro-actions** feel achievable (one priority, not task lists)
- **Reflection** captures growth ("What changed?")

---

## Table of Contents

1. [Beta Goals](#1-beta-goals)
2. [Success Metrics](#2-success-metrics)
3. [Architecture Decision](#3-architecture-decision)
4. [Story Map](#4-story-map)
5. [Sprint Structure](#5-sprint-structure)
6. [iBrain Event Types](#6-ibrain-event-types)
7. [Team Formation Mockups](#7-team-formation-mockups)
8. [Go/No-Go Gates](#8-gono-go-gates)
9. [Risk Register](#9-risk-register)
10. [**GRIT-UX Principles**](#10-grit-ux-principles) *(NEW)*
11. [Document Index](#11-document-index)

---

## 1. Beta Goals

### Primary Goals

| # | Goal | Evidence of Success |
|---|------|---------------------|
| G1 | Prove behavior change thesis | ≥70% daily engagement rate |
| G2 | Validate consultant-led model | 2 consultants run full cycles |
| G3 | Capture real behavior patterns | 500+ signal events logged |
| G4 | Inform GRIT engine design | Pattern analysis document produced |
| G5 | Achieve 3 pilot company completions | End-to-end SSI → OKR → Reflection |

### Non-Goals (Explicitly Deferred)

- Employee-level SSI assessment (use company SSI + naming conventions)
- Real-time iBrain API calls (scaffold event types only)
- Gamification features (M5/M6 in iBrain)
- Advanced analytics dashboards

---

## 2. Success Metrics

### Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Users | ≥70% of enrolled | Login + action |
| Micro-action completion | ≥80% | Completed vs created |
| Weekly reflection submission | ≥90% | Reflections / active weeks |
| Streak maintenance (7+ days) | ≥50% | Users with 7-day streak |

### Behavior Evidence Metrics

| Metric | Target | Source |
|--------|--------|--------|
| Signal events logged | ≥500 | Task model transitions |
| Blocked → Unblocked patterns | ≥50 | blocked_by.reason analysis |
| Completion time variance | Documented | completed_at timestamps |
| Reflection sentiment | Categorized | Weekly modal responses |

### Consultant Metrics

| Metric | Target |
|--------|--------|
| Full cycle completions | ≥3 companies |
| Weekly review sessions | 100% adherence |
| Evidence capture rate | ≥95% of interactions |

---

## 3. Architecture Decision

### Minimal-Change Principle

**Keep**:
- `Objective → Key Result → Goal → Task` hierarchy
- Current planning cascade
- Tasks as persistence layer
- Existing API endpoints

**Change Through**:
- Prompts (reframe language)
- UI copy (behavior-focused)
- Frontend flow (single priority view)
- Consultant workflow (weekly evidence capture)

### Backend Changes (ONLY where blocked)

| Change | Justification | Scope |
|--------|---------------|-------|
| Weekly reflection modal | No existing capture mechanism | 3 fields: mood, highlight, blocker |
| Streak counter cache | localStorage insufficient for persistence | Simple timestamp array |
| Evidence log endpoint | Consultant needs structured capture | POST /api/evidence |

---

## 4. Story Map

### Existing Stories to KEEP (Behavior-Compatible)

| ID | Story | Points | Sprint |
|----|-------|--------|--------|
| US-031 | View personal SSI score | 5 | 21 |
| US-035 | Complete SSI assessment | 8 | 21 |
| US-037 | See team composition | 5 | 21 |
| US-040 | View key results | 3 | 22 |
| US-041 | Track goal progress | 5 | 22 |
| US-043 | Complete task | 2 | 23 |
| US-044 | Mark task blocked | 3 | 23 |
| US-050 | Create personal tasks | 5 | 23 |
| US-070 | Monitor client progress | 8 | 24 |
| US-072 | Export assessment reports | 5 | 24 |
| US-075 | Configure company settings | 3 | 24 |
| US-065 | Receive notifications | 5 | 25 |

**Subtotal: 57 points**

### Existing Stories to ADAPT (Reframe Language)

| ID | Original Title | Reframed Title | Points | Sprint |
|----|----------------|----------------|--------|--------|
| US-045 | View daily tasks | View today's focus | 3 | 23 |
| US-047 | Update task status | Update micro-action status | 2 | 23 |
| US-052 | Receive overdue alerts | Receive momentum nudges | 3 | 25 |

**Subtotal: 8 points**

### NEW Beta Stories

| ID | Story | Points | Sprint | Acceptance Criteria |
|----|-------|--------|--------|---------------------|
| BETA-001 | As a consultant, I can run team formation based on complementary SSI profiles | 8 | 21 | Given SSI results, when consultant clicks "Form Teams", then system suggests optimal groupings |
| BETA-002 | As an employee, I see one "Today's Priority" instead of task list | 5 | 22 | Given multiple tasks, when viewing dashboard, then single focus item highlighted |
| BETA-003 | As an employee, I complete weekly reflection (3 questions) | 5 | 23 | Given Friday end-of-week, when prompted, then capture mood/highlight/blocker |
| BETA-004 | As an employee, I see my current streak and momentum | 3 | 23 | Given completed actions, when viewing profile, then streak count displayed |
| BETA-005 | As a consultant, I capture session evidence in structured format | 5 | 24 | Given weekly review, when entering notes, then evidence logged with tags |
| BETA-006 | As a consultant, I view weekly behavior digest per company | 5 | 24 | Given company, when viewing digest, then see completion rate, blockers, reflections |
| BETA-007 | As a system, I emit iBrain-compatible event stubs | 3 | 25 | Given significant action, when triggered, then event type logged locally |
| BETA-008 | As a consultant, I run dry-run pilot with test company | 8 | 25 | Given pilot checklist, when all items green, then pilot approved |

**Subtotal: 42 points**

### Total Beta Scope

| Category | Points |
|----------|--------|
| Keep | 57 |
| Adapt | 8 |
| New | 42 |
| **Total** | **107** |

---

## 5. Sprint Structure

### Overview (2-Week Sprints)

| Sprint | Name | Focus | Points | Dates |
|--------|------|-------|--------|-------|
| 21 | Philosophy + Governance | Prompts, SSI, Team Formation | 21 | Apr 1-14 |
| 22 | Single Priority View | Dashboard reframe, OKR prompts | 19 | Apr 15-28 |
| 23 | Evidence Capture | Reflection, Streaks, Micro-actions | 23 | Apr 29 - May 12 |
| 24 | Consultant Workflow | Evidence log, Weekly digest | 23 | May 13-26 |
| 25 | Integration + Dry Run | iBrain stubs, Pilot checklist | 21 | May 27 - Jun 9 |

### Sprint 21: Philosophy + Governance (21 pts)

**Theme**: Establish behavior-first foundation

| Story | Points | Owner |
|-------|--------|-------|
| US-031: View personal SSI score | 5 | Frontend |
| US-035: Complete SSI assessment | 8 | Full-stack |
| BETA-001: Team formation by SSI | 8 | Full-stack |

**Deliverables**:
- Prompt governance document
- Team formation mockups → implementation
- YSELA Coach persona active

**Exit Criteria**:
- SSI assessment flow complete
- Team formation produces valid groupings
- All prompts use YSELA Coach voice

### Sprint 22: Single Priority View (19 pts)

**Theme**: Replace task lists with focus

| Story | Points | Owner |
|-------|--------|-------|
| US-040: View key results | 3 | Frontend |
| US-041: Track goal progress | 5 | Full-stack |
| US-037: See team composition | 5 | Frontend |
| BETA-002: Today's Priority view | 5 | Frontend |
| US-045 (adapted): View today's focus | 1 | Frontend |

**Deliverables**:
- Dashboard V3 with single priority
- Archived task list view (accessible but not default)
- OKR prompts migrated to GRIT language

**Exit Criteria**:
- Default view is single priority
- Employee can still access full list
- All OKR generation uses reframed prompts

### Sprint 23: Evidence Capture (23 pts)

**Theme**: Capture behavior signals

| Story | Points | Owner |
|-------|--------|-------|
| US-043: Complete task | 2 | Frontend |
| US-044: Mark task blocked | 3 | Full-stack |
| US-050: Create personal tasks | 5 | Full-stack |
| BETA-003: Weekly reflection modal | 5 | Full-stack |
| BETA-004: Streak display | 3 | Frontend |
| US-047 (adapted): Update micro-action | 2 | Frontend |
| US-045 (adapted remainder): Focus state | 3 | Frontend |

**Deliverables**:
- Weekly reflection modal (Friday trigger)
- Streak counter (localStorage + optional backend)
- Blocked reason categorization

**Exit Criteria**:
- Reflection captures mood, highlight, blocker
- Streak displays on profile
- Blocked tasks require reason selection

### Sprint 24: Consultant Workflow (23 pts)

**Theme**: Structured evidence capture

| Story | Points | Owner |
|-------|--------|-------|
| US-070: Monitor client progress | 8 | Full-stack |
| US-072: Export assessment reports | 5 | Full-stack |
| US-075: Configure company settings | 3 | Backend |
| BETA-005: Session evidence capture | 5 | Full-stack |
| BETA-006: Weekly behavior digest | 5 | Full-stack |

**Deliverables**:
- Consultant evidence log endpoint
- Weekly digest aggregation
- Export with behavior signals

**Exit Criteria**:
- Evidence logged with standardized tags
- Digest shows completion rate, blockers, reflections
- Export includes behavior metrics

### Sprint 25: Integration + Dry Run (21 pts)

**Theme**: Prepare for pilot

| Story | Points | Owner |
|-------|--------|-------|
| US-065: Receive notifications | 5 | Full-stack |
| US-052 (adapted): Momentum nudges | 3 | Full-stack |
| BETA-007: iBrain event stubs | 3 | Backend |
| BETA-008: Dry-run pilot | 8 | QA + Consultant |
| Buffer | 2 | - |

**Deliverables**:
- iBrain event type definitions
- Local event logging (no API calls)
- Pilot checklist completion

**Exit Criteria**:
- All event types defined
- Events logged to local store
- One full dry-run with test company
- All pilot checklist items green

---

## 6. iBrain Event Types

### Event Type Definitions (Reference Only)

These event types will be logged locally during beta. No actual iBrain API calls.

```typescript
enum BetaEventType {
  // Assessment Events
  SSI_ASSESSMENT_STARTED = 'ssi.assessment.started',
  SSI_ASSESSMENT_COMPLETED = 'ssi.assessment.completed',
  SSI_SCORE_VIEWED = 'ssi.score.viewed',

  // Team Events
  TEAM_FORMED = 'team.formed',
  TEAM_OBJECTIVE_SET = 'team.objective.set',

  // Action Events
  MICRO_ACTION_CREATED = 'action.micro.created',
  MICRO_ACTION_COMPLETED = 'action.micro.completed',
  MICRO_ACTION_BLOCKED = 'action.micro.blocked',
  MICRO_ACTION_UNBLOCKED = 'action.micro.unblocked',

  // Engagement Events
  DAILY_CHECK_IN = 'engagement.daily.checkin',
  WEEKLY_REFLECTION_SUBMITTED = 'engagement.weekly.reflection',
  STREAK_ACHIEVED = 'engagement.streak.achieved',
  STREAK_BROKEN = 'engagement.streak.broken',

  // Consultant Events
  CONSULTANT_SESSION_STARTED = 'consultant.session.started',
  CONSULTANT_EVIDENCE_LOGGED = 'consultant.evidence.logged',
  CONSULTANT_DIGEST_VIEWED = 'consultant.digest.viewed'
}
```

### Event Payload Structure

```typescript
interface BetaEvent {
  event_type: BetaEventType;
  timestamp: ISO8601;
  company_id: ObjectId;
  user_id: ObjectId;
  session_id?: string;
  payload: {
    // Event-specific data
  };
  metadata: {
    source: 'ysela_beta';
    version: '1.0';
  };
}
```

### Storage During Beta

Events stored in:
- `localStorage['ysela_beta_events']` for frontend events
- MongoDB collection `beta_events` for backend events

Post-beta: Migrate to iBrain when IAM integration complete.

---

## 7. Team Formation Mockups

### Mockup Requirements (Sprint 21 Pre-work)

Before implementing BETA-001, create mockups for:

#### 7.1 Team Formation Input Screen

**Elements**:
- Company SSI profile summary
- Employee list with role/department
- "Suggest Teams" button
- Manual override capability

#### 7.2 Team Suggestion Output

**Elements**:
- Suggested team groupings (3-5 per team)
- Complementary strength indicators
- "Why this grouping" explanation
- Confirm/Edit/Reject actions

#### 7.3 Team View Card

**Elements**:
- Team name and objective
- Member avatars with SSI badges
- Team aggregate strengths
- Current progress indicator

### Mockup Approval Gate

- [ ] Mockups reviewed by product owner
- [ ] Consultant feedback incorporated
- [ ] Implementation ticket created

---

## 8. Go/No-Go Gates

### Gate 1: Sprint 21 Exit (Philosophy Ready)

| Criterion | Required | Status |
|-----------|----------|--------|
| Prompt governance doc approved | Yes | Pending |
| YSELA Coach persona in all prompts | Yes | Pending |
| Team formation mockups approved | Yes | Pending |
| SSI flow functional | Yes | Pending |

### Gate 2: Sprint 23 Exit (Evidence Capture Ready)

| Criterion | Required | Status |
|-----------|----------|--------|
| Weekly reflection captures data | Yes | Pending |
| Streak tracking functional | Yes | Pending |
| Blocked reasons categorized | Yes | Pending |
| Frontend events logging | Yes | Pending |

### Gate 3: Sprint 25 Exit (Pilot Ready)

| Criterion | Required | Status |
|-----------|----------|--------|
| All event types defined | Yes | Pending |
| Consultant evidence log works | Yes | Pending |
| Dry-run complete with test company | Yes | Pending |
| All pilot checklist items green | Yes | Pending |

### Pilot Launch Checklist

- [ ] 2 consultants trained on workflow
- [ ] 3 pilot companies identified
- [ ] Test data cleared from production
- [ ] Rollback procedure documented
- [ ] Evidence capture verified
- [ ] Weekly review cadence scheduled

---

## 9. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | Prompt changes alter behavior unexpectedly | Medium | High | A/B test with subset before rollout |
| R2 | Consultants resist new workflow | Low | High | Co-design workflow with consultants |
| R3 | Employee engagement drops during transition | Medium | Medium | Gradual rollout, keep fallback views |
| R4 | Reflection fatigue (users skip Friday modal) | Medium | Medium | Optional reminder, never block access |
| R5 | Team formation suggestions feel wrong | Low | Medium | Always allow manual override |
| R6 | Streak pressure causes anxiety | Low | Low | Frame as "momentum" not "streak" |

---

## 10. GRIT-UX Principles

### Intuitive Adoption Framework

YSELA applies GRIT principles to the interface itself, enabling intuitive adoption without training.

```
GRIT-UX Framework
┌───────────────┬───────────────┬───────────────┬─────────────────┐
│    TRIGGER    │    GROWTH     │  REINFORCE    │   INVESTMENT    │
│   (Entry)     │  (Learning)   │  (Feedback)   │   (Ownership)   │
├───────────────┼───────────────┼───────────────┼─────────────────┤
│ • FTUE Flow   │ • Progressive │ • Toast Msgs  │ • Preferences   │
│ • Empty State │   Disclosure  │ • Celebration │ • History       │
│ • Single CTA  │ • Hints       │ • Momentum    │ • Identity      │
│ • Defaults    │ • Coach Nudge │ • Coach Voice │ • Evidence      │
└───────────────┴───────────────┴───────────────┴─────────────────┘
```

### Core Principle

> "If a user needs training to use YSELA, we've failed. The UX itself must be the teacher."

### UX Stories Added (20 pts)

| Sprint | Stories | Points |
|--------|---------|--------|
| 21 | UX-001: FTUE Welcome Flow, UX-002: Empty States | 5 |
| 22 | UX-003: Feature Unlock, UX-004: Contextual Hints | 5 |
| 23 | UX-005: Toast System, UX-006: Celebration Hierarchy | 4 |
| 24 | UX-007: Personalization, UX-008: History View | 3 |
| 25 | UX-009: Empty State Library, UX-010: UX Audit | 3 |

**Full Details**: See `IMPLEMENTATION_PLAN/06_YSELA_UX_PRINCIPLES.md`

---

## 11. Document Index

### This Folder Structure

```
BETA_RELEASE_PROJECT/
├── 00_BETA_RELEASE_PROJECT_ROADMAP.md    ← You are here
├── BETA_ROADMAP_2026.md                   ← Detailed workstream plan
└── IMPLEMENTATION_PLAN/
    ├── 00_MASTER_IMPLEMENTATION_PLAN.md
    ├── 01_PROMPT_AND_FRONTEND_PLAN.md
    ├── 02_MINIMAL_BACKEND_PLAN.md
    ├── 03_CONSULTANT_BETA_OPERATIONS.md
    ├── 04_GATES_DEPENDENCIES_AND_RISKS.md
    ├── 05_DELIVERY_BACKLOG.md
    ├── 06_YSELA_UX_PRINCIPLES.md          ← NEW: Intuitive adoption principles
    └── PROMPT_TOUCHPOINTS/
        ├── 00_TOUCHPOINT_INVENTORY.md
        ├── 01_BETA_PROMPT_GOVERNANCE.md
        ├── 02_COMPANY_OKR_GENERATION.md
        ├── ... (10 more prompt docs)
        └── README.md
```

### Related Documents

| Document | Location | Purpose |
|----------|----------|---------|
| **YSELA UX Principles** | `IMPLEMENTATION_PLAN/06_YSELA_UX_PRINCIPLES.md` | Intuitive adoption framework |
| User Stories Master | `1-PRODUCT/user-stories/USER_STORIES_MASTER.md` | All 105 user stories |
| Sprint State | `iBrain/.claude/SPRINT_STATE.md` | iBrain current state |
| iBrain Integration | `iBrain/External_App_Integration/MASTER_INTEGRATION_STRATEGY.md` | Future integration spec |

---

## Progress Tracker

### Overall Status

| Phase | Status | Progress |
|-------|--------|----------|
| Planning | Complete | 100% |
| Sprint 21 | Not Started | 0% |
| Sprint 22 | Not Started | 0% |
| Sprint 23 | Not Started | 0% |
| Sprint 24 | Not Started | 0% |
| Sprint 25 | Not Started | 0% |
| **Beta Release** | **Planned** | **0%** |

### Points Burned

| Sprint | Base | UX | Total | Completed | Remaining |
|--------|------|----|----|-----------|-----------|
| 21 | 21 | 5 | 26 | 0 | 26 |
| 22 | 19 | 5 | 24 | 0 | 24 |
| 23 | 23 | 4 | 27 | 0 | 27 |
| 24 | 23 | 3 | 26 | 0 | 26 |
| 25 | 21 | 3 | 24 | 0 | 24 |
| **Total** | **107** | **20** | **127** | **0** | **127** |

**UX Stories Added** (see `06_YSELA_UX_PRINCIPLES.md`):
- UX-001 to UX-010: GRIT-UX framework implementation
- Covers: FTUE, empty states, feature unlock, hints, celebration, personalization

---

## Appendix: BBB + GRIT + YSELA Synthesis

### The Three Layers Explained

**BBB (Behavior Based Business)**
- Philosophy: Business outcomes are driven by sustained behavior change
- Principle: Employees who *want to* outperform employees who *have to*
- Measure: Engagement precedes productivity

**GRIT (Growth-Reinforcement-Investment-Trigger)**
- Loop: Trigger → Action → Reward → Investment → Repeat
- Beta Focus: Capture evidence of what triggers action, what rewards sustain it
- Post-Beta: Build predictive engine from captured patterns

**YSELA (Your Simple Everyday Learning Assistant)**
- Operating System: Where BBB philosophy executes through GRIT mechanics
- Role: Not task tracker, but behavior transformation platform
- Consultant: Diagnoses, forms teams, captures evidence, celebrates wins

### The 6-Step Beta Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. ASSESS          Company SSI + Team Profiles            │
│  ↓                                                          │
│  2. FORM            Teams by complementary strengths        │
│  ↓                                                          │
│  3. SET             Collective objective (one per team)     │
│  ↓                                                          │
│  4. STEP            Daily micro-action (single focus)       │
│  ↓                                                          │
│  5. REINFORCE       Mentors celebrate, organizers unblock   │
│  ↓                                                          │
│  6. REFLECT         "What changed?" (weekly)                │
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│  CONSULTANT: Observes all steps, captures evidence,         │
│              feeds learnings back to GRIT engine design     │
└─────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: March 24, 2026
**Next Review**: Sprint 21 Kickoff (April 10, 2026)
**Owner**: Product Team
**Recent Addition**: GRIT-UX Framework for intuitive adoption (+20 story points)
