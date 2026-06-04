# YSELA Module Architecture (LEGO Model)

<!-- @GENOME T2-PRD-023 | ACTIVE | 2026-03-30 | parent:T2-PRD-011 | auto:/coding | linked:- -->

**Version**: 1.0
**Created**: March 27, 2026
**Purpose**: Define modular architecture for independent, composable feature modules
**Status**: ACTIVE

---

## Core Principle

> **"Treat features like LEGO pieces - independent, composable, fixable without breaking others."**

Each module:
- Has clear boundaries (inputs/outputs)
- Works standalone if needed
- Can be improved internally without breaking others
- Uses existing code/data first ("as-is" principle)

---

## Module Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     YSELA MODULE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    USER INTERFACE LAYER                      │    │
│  │  Dashboard | Teams | Planning | Objectives | Assessment      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│       ┌──────────────────────┼──────────────────────┐               │
│       │                      │                      │               │
│       ▼                      ▼                      ▼               │
│  ┌─────────┐           ┌─────────┐           ┌─────────┐           │
│  │   OKR   │           │ ASSESS  │           │  TEAMS  │           │
│  │  MODULE │           │  MODULE │           │  MODULE │           │
│  │         │           │  (SSI)  │           │         │           │
│  │ Obj/KR  │           │         │           │ Squads  │           │
│  │ Goals   │◀─────────▶│ Survey  │◀─────────▶│ Roles   │           │
│  │ Tasks   │  informs  │ Scores  │  assigns  │ Handoff │           │
│  └────┬────┘           └────┬────┘           └────┬────┘           │
│       │                     │                     │                 │
│       └─────────────────────┼─────────────────────┘                 │
│                             │                                        │
│                             ▼                                        │
│                        ┌─────────┐                                  │
│                        │  GRIT   │                                  │
│                        │  MODULE │ ← Observes all modules           │
│                        │         │                                  │
│                        │ Signals │                                  │
│                        │ Context │                                  │
│                        └────┬────┘                                  │
│                             │                                        │
│                             ▼                                        │
│                        ┌─────────┐                                  │
│                        │   PBL   │                                  │
│                        │  MODULE │                                  │
│                        │         │                                  │
│                        │ Points  │                                  │
│                        │ Badges  │                                  │
│                        │ Boards  │                                  │
│                        └─────────┘                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Module 1: OKR Module

### Identity

| Attribute | Value |
|-----------|-------|
| **Name** | OKR Module |
| **Purpose** | Manage objectives, key results, goals, and tasks |
| **Status** | ✅ EXISTS (fully built) |
| **Beta Work** | Terminology only (Task → "Next Move") |

### Components

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| Objectives | ✅ EXISTS | `objectives.html`, `server/routes/objectives.js` | CRUD complete |
| Key Results | ✅ EXISTS | Part of objectives | Up to 6 per objective |
| Quarterly Goals | ✅ EXISTS | `server/models/Goal.js` | time_period="QUARTERLY" |
| Weekly Goals | ✅ EXISTS | `planning-v2.html` | time_period="WEEKLY" |
| Daily Tasks | ✅ EXISTS | `planning-v2.html` | Linked to weekly goals |
| AI Generation | ✅ EXISTS | `server/routes/ai-okr.js` | OKR from SSI |

### Interfaces

```
INPUTS:
─────────
• SSI gaps (from Assessment Module)
• Team assignments (from Teams Module)
• User context (for AI generation)

OUTPUTS:
────────
• Objectives (to Dashboard, Reports)
• Tasks/Moves (to Dashboard, GRIT)
• Completion events (to GRIT, PBL)
```

### Data Models

```javascript
// Objective
{ title, description, category, key_results[], owner_id, team_id }

// Goal (Weekly Priority)
{ title, objective_id, key_result_id, time_period, owner_id }

// Task (Next Move)
{ title, goal_id, assigned_to, priority, difficulty, status }
```

---

## Module 2: Assessment Module (SSI)

### Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Assessment Module |
| **Purpose** | Diagnose organizational health via SSI framework |
| **Status** | ✅ EXISTS (fully built) |
| **Beta Work** | None - works as-is |

### Components

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| SSI Framework | ✅ EXISTS | 12-block model | Speed/Strength/Intelligence |
| Question Library | ✅ EXISTS | `assessment-question-library.html` | Seeded templates |
| Industry Templates | ✅ EXISTS | Database | Cattle, Retail, etc. |
| Survey Distribution | ✅ EXISTS | `assessment-hub.html` | Email invites |
| Score Calculation | ✅ EXISTS | `server/services/` | Weighted averages |
| Results Visualization | ✅ EXISTS | `team-ssi-view.html` | Charts, narratives |
| OKR Recommendations | ✅ EXISTS | `ai-okr.js` | SSI → suggested objectives |

### Interfaces

```
INPUTS:
─────────
• Team members (from Teams Module)
• Industry context (company profile)
• Survey responses (user input)

OUTPUTS:
────────
• SSI scores (to Dashboard, OKR Module)
• Gap analysis (to OKR recommendations)
• Narratives (to reports)
• Assessment events (to GRIT)
```

### Data Models

```javascript
// Assessment
{ company_id, template_id, type, status, participants[] }

// AssessmentResponse
{ assessment_id, user_id, question_id, value, qualitative_text }

// SSIScore
{ company_id, speed, strength, intelligence, blocks[], calculated_at }
```

---

## Module 3: Teams Module

### Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Teams Module |
| **Purpose** | Form squads, assign roles, manage handoffs |
| **Status** | ✅ EXISTS (partial enhancement needed) |
| **Beta Work** | Link teams to objectives, add position concept |

### Components

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| Team Creation | ✅ EXISTS | `teams.html` | Basic CRUD |
| Member Invitation | ✅ EXISTS | Invitation flow | Email-based |
| Role Assignment | ✅ EXISTS | User model | CONSULTANT, MANAGER, etc. |
| Company Switching | ✅ EXISTS | `navigation.js` | Consultant portfolio |
| Squad Formation | ⚠️ ENHANCE | Link to objective | Team per objective |
| Position Assignment | 🆕 NEW | Football positions | Goalkeeper, Defense, etc. |
| Handoff Tracking | 🆕 NEW | Task transitions | Who passed to whom |

### Interfaces

```
INPUTS:
─────────
• Users (from auth)
• Objectives (from OKR Module)
• Company context

OUTPUTS:
────────
• Team assignments (to OKR Module)
• Position data (to PBL, Dashboard)
• Handoff events (to GRIT)
```

### Data Models

```javascript
// Team
{ name, company_id, objective_id, members[] }

// TeamMember
{ user_id, team_id, position, role }

// Position enum
["GOALKEEPER", "DEFENSE", "MIDFIELD", "ATTACK", "COACH", "ASSISTANT_COACH"]
```

---

## Module 4: GRIT Module (Orchestrator)

### Identity

| Attribute | Value |
|-----------|-------|
| **Name** | GRIT Module |
| **Purpose** | Collect signals, build context, orchestrate intelligence |
| **Status** | ⚠️ PARTIAL (signals to be formalized) |
| **Beta Work** | Define signals, connect to existing events |

### Components

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| Signal Collection | ⚠️ PARTIAL | Events exist | Need formalization |
| G: Growth Tracking | 🆕 NEW | Progress signals | Completions, learning |
| R: Reinforce Tracking | 🆕 NEW | Recognition signals | Wins, feedback |
| I: Invest Tracking | 🆕 NEW | Engagement signals | Time, depth |
| T: Trigger Detection | 🆕 NEW | Readiness signals | Entry points, blocks |
| LLM Context Building | ✅ EXISTS | `AIContextService.js` | Token-optimized |

### Interfaces

```
INPUTS:
─────────
• User actions (from all modules)
• Move completions (from OKR)
• Assessment events (from Assessment)
• Team events (from Teams)

OUTPUTS:
────────
• Context for LLM (to AI services)
• Signals for PBL (to PBL Module)
• Insights (to Dashboard)
• Trigger events (to notifications)
```

### Signal Taxonomy

```javascript
// GRIT Signal Categories
{
  G: [ // Growth
    "move.completed",
    "objective.completed",
    "skill.improved",
    "reflection.submitted"
  ],
  R: [ // Reinforce
    "move.smooth",
    "help.provided",
    "recognition.given",
    "feedback.positive"
  ],
  I: [ // Invest
    "session.started",
    "session.duration",
    "assessment.qualitative",
    "reflection.depth"
  ],
  T: [ // Trigger
    "user.onboarded",
    "team.formed",
    "move.blocked",
    "streak.at_risk"
  ]
}
```

---

## Module 5: PBL Module

### Identity

| Attribute | Value |
|-----------|-------|
| **Name** | PBL Module (Points, Badges, Leaderboards) |
| **Purpose** | Motivate engagement through gamification |
| **Status** | 🆕 NEW (specification complete) |
| **Beta Work** | Build from scratch |

### Components

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| Points System | 🆕 NEW | To build | Variable by P/D/Q |
| Point Calculation | 🆕 NEW | To build | Formula-based |
| Badges (Individual) | 🆕 NEW | To build | 20+ badges |
| Badges (Team) | 🆕 NEW | To build | Squad achievements |
| Leaderboard (Company) | 🆕 NEW | To build | Internal ranking |
| Leaderboard (Cross-Co) | 🆕 NEW | To build | Anonymized |
| Visibility Rules | 🆕 NEW | To build | Role-based access |

### Interfaces

```
INPUTS:
─────────
• GRIT signals (from GRIT Module)
• Move completions (from OKR Module)
• Quality ratings (from managers)
• Feedback (from users)

OUTPUTS:
────────
• Point totals (to Dashboard)
• Badge awards (to notifications)
• Leaderboard rankings (to Dashboard)
• Engagement metrics (to Analytics)
```

### See Also
- [PBL_GAMIFICATION_SPEC.md](./PBL_GAMIFICATION_SPEC.md) for full specification

---

## Module Dependencies

### Dependency Matrix

| Module | Depends On | Provides To |
|--------|------------|-------------|
| **OKR** | Teams, Assessment | Dashboard, GRIT, PBL |
| **Assessment** | Teams | OKR, Dashboard, GRIT |
| **Teams** | Auth | OKR, Assessment, PBL |
| **GRIT** | All modules | PBL, LLM Services |
| **PBL** | GRIT, OKR, Teams | Dashboard |

### Dependency Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DEPENDENCY FLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  FOUNDATION LAYER (No dependencies)                                 │
│  ─────────────────────────────────────                               │
│  ┌─────────┐                                                        │
│  │  AUTH   │ ← Users, roles, companies                              │
│  └────┬────┘                                                        │
│       │                                                              │
│  CORE LAYER (Depends on Auth only)                                  │
│  ─────────────────────────────────────                               │
│       │                                                              │
│  ┌────┴────┐                                                        │
│  │  TEAMS  │ ← Uses auth for users                                  │
│  └────┬────┘                                                        │
│       │                                                              │
│  FEATURE LAYER (Depends on Teams)                                   │
│  ─────────────────────────────────────                               │
│       │                                                              │
│  ┌────┴────┬────────────┐                                           │
│  │         │            │                                           │
│  ▼         ▼            ▼                                           │
│  ┌───────┐ ┌──────────┐                                             │
│  │  OKR  │ │ ASSESS   │ ← Both use Teams                            │
│  └───┬───┘ └────┬─────┘                                             │
│      │          │                                                    │
│      └────┬─────┘                                                    │
│           │                                                          │
│  INTELLIGENCE LAYER (Observes Feature Layer)                        │
│  ─────────────────────────────────────────────                       │
│           │                                                          │
│      ┌────┴────┐                                                    │
│      │  GRIT   │ ← Collects signals from OKR, Assessment, Teams     │
│      └────┬────┘                                                    │
│           │                                                          │
│  ENGAGEMENT LAYER (Uses Intelligence)                               │
│  ─────────────────────────────────────────                           │
│           │                                                          │
│      ┌────┴────┐                                                    │
│      │   PBL   │ ← Uses GRIT signals                                │
│      └─────────┘                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Module Boundaries

### What Each Module OWNS

| Module | Owns | Does NOT Own |
|--------|------|--------------|
| **OKR** | Objectives, KRs, Goals, Tasks | Users, Teams, Points |
| **Assessment** | Templates, Questions, Scores | Users, OKRs, Points |
| **Teams** | Team structure, Positions | Users (just references) |
| **GRIT** | Signals, Context | Actions (just observes) |
| **PBL** | Points, Badges, Leaderboards | Task completion (just rewards) |

### API Contracts Between Modules

```javascript
// OKR → GRIT
emitSignal("move.completed", {
  user_id,
  move_id,
  priority,
  difficulty,
  completion_time
});

// GRIT → PBL
triggerPointCalculation({
  signal: "move.completed",
  user_id,
  context: { priority, difficulty }
});

// Assessment → OKR
recommendObjectives({
  company_id,
  ssi_scores: { speed, strength, intelligence },
  gaps: ["decisions", "change"]
});

// Teams → OKR
assignOwnership({
  objective_id,
  team_id,
  owner_id,
  members: [{ user_id, position }]
});
```

---

## Failure Isolation

### What Happens If a Module Fails?

| Module Down | Impact | Graceful Degradation |
|-------------|--------|---------------------|
| **OKR** | Can't create objectives | Dashboard shows "no data" |
| **Assessment** | Can't run SSI | OKR works with manual objectives |
| **Teams** | Can't form squads | Objectives work without teams |
| **GRIT** | No intelligence | System works, just no AI suggestions |
| **PBL** | No gamification | Tasks complete, just no points |

### Independence Test

> "Can I disable this module without breaking others?"

| Module | Disable-Safe? | Notes |
|--------|--------------|-------|
| OKR | ❌ No | Core to the product |
| Assessment | ✅ Yes | OKR can work with manual input |
| Teams | ⚠️ Partial | Basic mode without team formation |
| GRIT | ✅ Yes | Features work, just less intelligent |
| PBL | ✅ Yes | Features work, just no gamification |

---

## Implementation Order (Respecting Dependencies)

### Phase 1: Foundation (Exists)
1. Auth ✅
2. Teams ✅

### Phase 2: Core Features (Exists)
3. Assessment (SSI) ✅
4. OKR ✅

### Phase 3: Intelligence (Beta)
5. GRIT (formalize signals)
6. PBL (build from spec)

### Phase 4: Enhancement (Post-Beta)
7. Teams (positions, handoffs)
8. Cross-module integrations

---

## Module Health Checklist

For each module, verify:

- [ ] **Clear inputs/outputs** defined
- [ ] **Data models** documented
- [ ] **API contracts** specified
- [ ] **Failure mode** identified
- [ ] **Disable-safe** tested
- [ ] **Dependencies** minimized
- [ ] **"As-is" first** principle followed

---

**Architecture Owner**: Product Team
**Created**: March 27, 2026
**Status**: Active - Living Document
