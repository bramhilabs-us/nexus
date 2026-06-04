# YSELA Terminology Mapping

<!-- @GENOME T2-ARC-007 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding,/design | linked:/strategy -->

**Version**: 1.0
**Created**: March 24, 2026
**Status**: ACTIVE
**Purpose**: Ensure consistent terminology across frontend while preserving backend stability

---

## Executive Summary

YSELA Beta uses **new terminology in the frontend** while keeping **backend models unchanged**. This mapping ensures consistency across all UI, prompts, and documentation.

**Core Principle**: Zero backend changes. All terminology transformation happens at the display layer.

---

## 1. Product Naming

| Context | Value |
|---------|-------|
| **Product Name** | YSELA |
| **Beta Label** | YSELA Beta |
| **Repository** | `karvia_business` (unchanged) |
| **Internal Reference** | YSELA (formerly Karvia) |

### Usage Examples

```javascript
// Frontend display
const PRODUCT_NAME = 'YSELA';
const PRODUCT_TAGLINE = 'Behavior-based team performance';

// Backend unchanged
// Collection: karvia_users (not renamed)
// Model: User.js (not renamed)
```

---

## 2. Core Terminology Mapping

### 2.1 Execution Model

| Backend Model | Frontend Display | UI Label | Plural |
|---------------|------------------|----------|--------|
| `Task` | Next Move | "Next Move" | "Next Moves" |
| `Goal` (weekly) | Priority | "This Week's Priority" | "Priorities" |
| `Goal` (quarterly) | Quarterly Focus | "Q Focus" | "Quarterly Focuses" |
| `Objective` | Priority (Annual) | "Priority" | "Priorities" |
| `KeyResult` | Outcome | "Expected Outcome" | "Outcomes" |

### 2.2 Assessment & Methodology

| Backend/Old Term | Frontend Display | Context |
|------------------|------------------|---------|
| Assessment | SSI Assessment | Speed-Strength-Intelligence |
| SSI Score | Performance Profile | User-facing name |
| OKR | YSELA Methodology | Framework reference |
| Goal Cascade | Team Alignment | Hierarchy description |

### 2.3 User Actions

| Backend Action | Frontend Label | Button Text |
|----------------|----------------|-------------|
| `createTask` | Add Next Move | "Add Next Move" |
| `completeTask` | Mark Complete | "Done" / "Complete" |
| `createGoal` | Set Priority | "Set This Week's Priority" |
| `updateProgress` | Update Progress | "Update" |

### 2.4 Workflow Concepts

| Old Term | YSELA Term | Usage Context |
|----------|------------|---------------|
| Task tracking | Behavior execution | Philosophy docs |
| Goal management | Priority alignment | Strategy docs |
| OKR platform | Team performance platform | Marketing/GTM |
| Task list | Next Moves queue | Daily view |
| Weekly goals | Weekly priorities | Weekly planning |
| Progress update | Check-in | Daily ritual |

---

## 3. Implementation Guide

### 3.1 Frontend Constants File

Create/update `client/js/constants/terminology.js`:

```javascript
// YSELA Terminology Constants
// Backend models remain unchanged - this is display-only

export const TERMINOLOGY = {
  // Product
  PRODUCT_NAME: 'YSELA',
  PRODUCT_TAGLINE: 'Behavior-based team performance',

  // Execution units
  TASK: {
    singular: 'Next Move',
    plural: 'Next Moves',
    action_create: 'Add Next Move',
    action_complete: 'Complete',
    action_update: 'Update Move'
  },

  // Goals
  GOAL_WEEKLY: {
    singular: 'Priority',
    plural: 'Priorities',
    label: "This Week's Priority",
    action_create: 'Set Priority'
  },

  GOAL_QUARTERLY: {
    singular: 'Quarterly Focus',
    plural: 'Quarterly Focuses',
    label: 'Q Focus',
    action_create: 'Set Q Focus'
  },

  // Objectives
  OBJECTIVE: {
    singular: 'Priority',
    plural: 'Priorities',
    label: 'Annual Priority',
    action_create: 'Set Priority'
  },

  // Key Results
  KEY_RESULT: {
    singular: 'Outcome',
    plural: 'Outcomes',
    label: 'Expected Outcome',
    action_create: 'Define Outcome'
  },

  // Assessment
  ASSESSMENT: {
    name: 'SSI Assessment',
    score_label: 'Performance Profile',
    dimensions: {
      speed: 'Speed',
      strength: 'Strength',
      intelligence: 'Intelligence'
    }
  },

  // Actions
  ACTIONS: {
    complete: 'Done',
    update: 'Update',
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit'
  }
};

// Helper function
export function getLabel(modelName, property = 'singular') {
  const mapping = TERMINOLOGY[modelName.toUpperCase()];
  return mapping ? mapping[property] : modelName;
}
```

### 3.2 Usage in Components

```javascript
import { TERMINOLOGY, getLabel } from './constants/terminology.js';

// In a component
const taskLabel = TERMINOLOGY.TASK.singular; // "Next Move"
const createButtonText = TERMINOLOGY.TASK.action_create; // "Add Next Move"

// In templates
`<h2>${TERMINOLOGY.GOAL_WEEKLY.label}</h2>` // "This Week's Priority"
```

### 3.3 API Response Transformation

```javascript
// Transform API response for display
function transformTaskForDisplay(apiTask) {
  return {
    ...apiTask,
    _displayType: 'Next Move',
    _displayLabel: TERMINOLOGY.TASK.singular
  };
}
```

---

## 4. Prompt & AI Response Mapping

### 4.1 AI Prompts Must Use

| Instead of | Use |
|------------|-----|
| "Create a task for..." | "Create a Next Move for..." |
| "Set weekly goals" | "Set your priorities for this week" |
| "Track your OKRs" | "Align your team's priorities" |
| "Complete this task" | "Complete this Next Move" |

### 4.2 YSELA Coach Voice

AI responses should use YSELA terminology:

```
// Old style
"You have 3 tasks remaining for this week."

// YSELA style
"You have 3 Next Moves to complete this week. Let's focus on what matters most."
```

---

## 5. Documentation Mapping

### 5.1 Strategic Documents

| Document Type | Old Language | YSELA Language |
|---------------|--------------|----------------|
| Vision | "OKR management platform" | "Behavior-based team performance platform" |
| Strategy | "Task and goal tracking" | "Next Moves and priority alignment" |
| GTM | "SMB OKR tool" | "Consultant-led team transformation" |

### 5.2 User-Facing Copy

| Screen/Context | Old Copy | YSELA Copy |
|----------------|----------|------------|
| Dashboard title | "My Tasks" | "My Next Moves" |
| Weekly view | "Weekly Goals" | "This Week's Priorities" |
| Empty state | "No tasks yet" | "No Next Moves yet" |
| Success toast | "Task completed!" | "Next Move complete!" |

---

## 6. Migration Checklist

### Frontend Files to Update

```
[ ] client/pages/dashboard.html - Labels and headings
[ ] client/pages/tasks.html - Rename to next-moves.html (optional)
[ ] client/pages/goals.html - Update labels
[ ] client/js/common.js - Add terminology constants
[ ] client/js/*.js - Use TERMINOLOGY constants
[ ] client/pages/scripts/*.js - Update display strings
```

### Prompt Files to Update

```
[ ] IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/*.md - Use YSELA terms
[ ] AI prompt templates - Replace task → Next Move
```

### Documentation to Update (Gradual)

```
[ ] 00_MASTER_STRATEGY.md - Header first, body gradual
[ ] PRODUCT_VISION.md - Header first, body gradual
[ ] PRODUCT_STRATEGY_MASTER.md - Header first, body gradual
[ ] GO_TO_MARKET.md - Marketing copy
```

---

## 7. What NOT to Change

### Backend (Zero Changes)

```
DO NOT CHANGE:
- Model names (Task.js, Goal.js, Objective.js)
- Collection names (tasks, goals, objectives)
- API endpoints (/api/tasks, /api/goals)
- Database schema
- Variable names in server code
- Test file names
```

### Internal Code References

```
// Keep internal references as-is
const task = await Task.findById(id); // OK - internal
const displayName = TERMINOLOGY.TASK.singular; // Use for display
```

---

## 8. Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                YSELA TERMINOLOGY QUICK REF              │
├─────────────────────────────────────────────────────────┤
│  Backend Model  │  Frontend Display   │  UI Button      │
├─────────────────┼─────────────────────┼─────────────────┤
│  Task           │  Next Move          │  Add Next Move  │
│  Goal (weekly)  │  Priority           │  Set Priority   │
│  Goal (qtr)     │  Q Focus            │  Set Q Focus    │
│  Objective      │  Priority (Annual)  │  Set Priority   │
│  KeyResult      │  Outcome            │  Define Outcome │
│  Assessment     │  SSI Assessment     │  Take SSI       │
├─────────────────┴─────────────────────┴─────────────────┤
│  Product: YSELA    Methodology: BBB + GRIT              │
│  Philosophy: Behavior-based team performance            │
└─────────────────────────────────────────────────────────┘
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Mar 24, 2026 | Claude | Initial terminology mapping |

---

**Document Owner**: Product Team
**Last Updated**: March 24, 2026
**Parent**: DOC-T1-PRD-001 (MASTER_STRATEGY)
