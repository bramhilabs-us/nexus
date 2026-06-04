# Block Dependencies & Data Flow

**Document**: BLOCK_DEPENDENCIES.md
**Version**: 1.0.0
**Created**: 2026-01-10
**Purpose**: Document how data flows between feature flag blocks in the Karvia system

---

## Overview

Karvia uses a **Feature Flag Block Architecture** where each block can be enabled/disabled independently. This document shows how blocks depend on each other and how data flows between them.

---

## Block Architecture Summary

```
BLOCK 1: Core Execution ──────────────────────────────────────────────────────
          │ (REQUIRED - Always On)
          │ • Manual OKRs, Progress Tracking, Basic Dashboard
          │
          ├─── BLOCK 2: IAM - Company & Teams ────────────────────────────────
          │    (OPTIONAL - Feature Flag: IAM_BLOCK)
          │    • Multi-user, Roles, Permissions, Team Structure
          │
          ├─── BLOCK 3: Assessment System ────────────────────────────────────
          │    (OPTIONAL - Feature Flag: ASSESSMENT_BLOCK)
          │    • SSI Scoring, Templates, Maturity Analysis
          │    │
          │    └─── BLOCK 4: AI OKR Engine ────────────────────────────────────
          │         (OPTIONAL - Requires Block 3)
          │         • GPT-4 OKR Generation, Smart Suggestions
          │
          ├─── BLOCK 5: Progress Rollup ──────────────────────────────────────
          │    (OPTIONAL - Feature Flag: PROGRESS_ROLLUP)
          │    • Automated Calculations, Alerts, Reports
          │
          ├─── BLOCK 6: Bulk Operations ──────────────────────────────────────
          │    (OPTIONAL - Feature Flag: BULK_OPS)
          │    • Mass Updates, Import/Export, Batch Processing
          │
          └─── BLOCK 7: Permission Rules Engine ──────────────────────────────
               (OPTIONAL - Feature Flag: PERMISSION_RULES)
               • Advanced RBAC, Custom Rules, Approval Workflows
```

---

## Data Flow Between Blocks

### Flow 1: Assessment → OKR Generation

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   BLOCK 3           │    │   BLOCK 4           │    │   BLOCK 1           │
│   Assessment        │───▶│   AI OKR Engine     │───▶│   Core Execution    │
│                     │    │                     │    │                     │
│ • Take Assessment   │    │ • Analyze SSI       │    │ • Store Objectives  │
│ • Calculate SSI     │    │ • Generate OKRs     │    │ • Create KRs        │
│ • Store Results     │    │ • Suggest Goals     │    │ • Track Progress    │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘

DATA PASSED:
  Assessment Results:
    - speed_score: 7.2/10
    - strength_score: 6.8/10
    - intelligence_score: 7.5/10
    - dimension_breakdown: { ... }
    - company_context: { industry, size, priorities }

  AI Engine Output:
    - objectives: [{ title, category, key_results: [...] }]
    - recommendations: [{ area, suggestion }]
    - confidence_score: 0.85
```

### Flow 2: Company Context → AI Personalization

```
┌─────────────────────┐
│   Company Profile   │
│   (Block 2: IAM)    │
│                     │
│ • industry          │
│ • business_subtype  │────┐
│ • business_metrics  │    │
│ • strategic_priorities│   │
│ • employee_count    │    │
└─────────────────────┘    │
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LLM CONTEXT ENGINE                            │
│   Combines company context with assessment results                 │
│                                                                   │
│   PROMPT CONSTRUCTION:                                            │
│   - "This is a {industry} company with {employee_count} employees"│
│   - "Their SSI scores show Speed: {speed}, Strength: {strength}"  │
│   - "Strategic priorities: {priorities}"                          │
│   - "Generate OKRs that address these specific gaps..."           │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────┐    ┌─────────────────────┐
│   Block 4           │    │   Block 1           │
│   AI OKR Engine     │───▶│   Personalized OKRs │
│                     │    │                     │
│ Generated OKRs      │    │ Stored & Tracked    │
│ tailored to company │    │                     │
└─────────────────────┘    └─────────────────────┘
```

### Flow 3: OKR Cascade (Top-Down)

```
┌─────────────────────┐
│   BLOCK 1: Core     │
│   Company Objectives│
│   (Yearly)          │
└─────────┬───────────┘
          │
          │ CASCADE
          ▼
┌─────────────────────┐
│   Key Results       │
│   (Quarterly)       │
└─────────┬───────────┘
          │
          │ CASCADE
          ▼
┌─────────────────────┐
│   Quarterly Goals   │
│   (Team Level)      │
│   Block 2: Teams    │
└─────────┬───────────┘
          │
          │ CASCADE
          ▼
┌─────────────────────┐
│   Weekly Goals      │
│   (Individual)      │
└─────────┬───────────┘
          │
          │ CASCADE
          ▼
┌─────────────────────┐
│   Daily Tasks       │
│   (Assignee)        │
└─────────────────────┘

LINEAGE CHAIN (Bottom-Up View):
  Task → Weekly Goal → Quarterly Goal → Key Result → Objective → Company Vision
  (This is the "Why Chain" - EMP-016)
```

### Flow 4: Progress Rollup (Bottom-Up)

```
┌─────────────────────┐
│   BLOCK 5           │
│   Progress Rollup   │
│   Engine            │
└─────────────────────┘
          │
          │ CALCULATES
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│   Tasks (100 completed / 150 total) → 66.7% complete             │
│      ↑ rolls up to                                                │
│   Weekly Goal → 66.7% progress                                    │
│      ↑ rolls up to                                                │
│   Quarterly Goal (3 weekly goals) → avg(66.7, 80, 45) = 63.9%    │
│      ↑ rolls up to                                                │
│   Key Result → 63.9% progress                                     │
│      ↑ rolls up to                                                │
│   Objective (3 KRs) → avg progress                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 5: Intervention Alerts

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   BLOCK 5           │    │   BLOCK 2           │    │   Manager           │
│   Progress Rollup   │───▶│   IAM / Teams       │───▶│   Notification      │
│                     │    │                     │    │                     │
│ Monitors daily:     │    │ Identifies:         │    │ Receives alert:     │
│ • Task completion   │    │ • Team membership   │    │ • In-app badge      │
│ • Goal progress     │    │ • Manager relations │    │ • Email (optional)  │
│ • Deadline proximity│    │ • Escalation path   │    │ • Dashboard widget  │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘

TRIGGER CONDITIONS:
  • >50% tasks overdue by 3+ days
  • No tasks completed in 7+ days
  • Goal progress <30% with <30 days remaining
```

---

## Block Dependency Matrix

| Block | Depends On | Provides Data To | Feature Flag |
|-------|-----------|------------------|--------------|
| **1. Core** | None | All blocks | Always On |
| **2. IAM** | Block 1 | Block 3, 4, 5, 7 | `IAM_BLOCK` |
| **3. Assessment** | Block 1, (Block 2 optional) | Block 4 | `ASSESSMENT_BLOCK` |
| **4. AI OKR** | Block 1, Block 3 (required) | Block 1 | `AI_ENGINE` |
| **5. Progress** | Block 1, (Block 2 optional) | Block 2, Notifications | `PROGRESS_ROLLUP` |
| **6. Bulk Ops** | Block 1, Block 2 | Block 2, 3 | `BULK_OPS` |
| **7. Permissions** | Block 1, Block 2 | All blocks | `PERMISSION_RULES` |

---

## Graceful Degradation Scenarios

### Scenario 1: Assessment Block Disabled

```
ASSESSMENT_BLOCK = false

Impact:
  ✗ No SSI scoring
  ✗ No assessment templates
  ✗ No AI OKR generation (Block 4 also disabled)

  ✓ Manual OKR creation still works (Block 1)
  ✓ All other blocks function normally
```

### Scenario 2: IAM Block Disabled (Solo User Mode)

```
IAM_BLOCK = false

Impact:
  ✗ No multi-user support
  ✗ No team structure
  ✗ No role-based permissions
  ✗ No manager → employee cascading

  ✓ Single user can create/manage their own OKRs
  ✓ Assessment works (individual only)
  ✓ AI OKR generation works (for solo user)
```

### Scenario 3: AI Engine Disabled (Manual Mode)

```
AI_ENGINE = false

Impact:
  ✗ No GPT-4 OKR generation
  ✗ No smart suggestions
  ✗ No auto-cascade

  ✓ Manual OKR creation fully functional
  ✓ Assessment scores displayed (no AI analysis)
  ✓ Template-based OKR suggestions (fallback)
```

---

## API Endpoints by Block

### Block 1: Core Execution
```
GET/POST/PUT/DELETE  /api/objectives
GET/POST/PUT/DELETE  /api/key-results
GET/POST/PUT/DELETE  /api/goals/quarterly
GET/POST/PUT/DELETE  /api/goals/weekly
GET/POST/PUT/DELETE  /api/tasks
```

### Block 2: IAM
```
GET/POST/PUT/DELETE  /api/companies
GET/POST/PUT/DELETE  /api/teams
GET/POST/PUT/DELETE  /api/users
POST                 /api/invitations
```

### Block 3: Assessment
```
GET/POST             /api/assessment-templates
POST                 /api/assessments/send
GET                  /api/assessments/:id/results
POST                 /api/assessments/:id/submit
GET                  /api/assessments/team-heatmap
```

### Block 4: AI OKR Engine
```
POST                 /api/ai-okr/generate
GET                  /api/ai-okr/review
POST                 /api/ai-okr/accept
POST                 /api/ai-okr/regenerate
```

### Block 5: Progress Rollup
```
GET                  /api/progress/objective/:id
GET                  /api/progress/team/:id
GET                  /api/manager/alerts
POST                 /api/manager/alerts/:id/action
```

### Block 6: Bulk Operations
```
POST                 /api/bulk/users/import
POST                 /api/bulk/invitations
POST                 /api/bulk/goals/update
```

### Block 7: Permission Rules
```
GET/POST/PUT/DELETE  /api/permissions/rules
GET                  /api/permissions/check
POST                 /api/approvals/:id/approve
```

---

## Data Model Relationships

```
Company (Block 2)
  │
  ├── business_metrics    ──────────────────┐
  ├── strategic_priorities                   │
  ├── industry                               │ → CONTEXT for LLM
  ├── business_subtype                       │
  │                                          ▼
  ├── Assessment (Block 3) ──────────────▶ AI OKR Engine (Block 4)
  │     │                                        │
  │     ├── speed_score                          │
  │     ├── strength_score                       ▼
  │     └── intelligence_score            Objective (Block 1)
  │                                              │
  ├── Teams (Block 2)                            ├── Key Results
  │     │                                        │     │
  │     ├── manager_id ────────────────────────▶│     └── Quarterly Goals
  │     └── members[]                            │           │
  │           │                                  │           └── Weekly Goals
  │           └─────────────────────────────────▶│                 │
  │                                              │                 └── Tasks
  │                                              │
  └── Users (Block 2)                            │
        │                                        │
        └── role ──────────▶ Permissions ───────▶│ (who can see/edit what)
                             (Block 7)
```

---

## Implementation Notes

### When Adding a New Block

1. **Define Feature Flag**: Add to `config/feature-flags.js`
2. **Document Dependencies**: Update this file
3. **Create API Routes**: Follow RESTful conventions
4. **Add Graceful Degradation**: Ensure core functionality works without block
5. **Update User Stories**: Tag stories with block reference

### When Modifying Data Flow

1. **Update This Document**: Keep diagrams current
2. **Check Downstream Impacts**: Review dependent blocks
3. **Test Degradation**: Verify behavior when blocks disabled
4. **Update API Documentation**: Reflect changes in endpoints

---

**Last Updated**: 2026-01-10
**Maintained By**: Strategy Team
**Review Cycle**: Each sprint retrospective
