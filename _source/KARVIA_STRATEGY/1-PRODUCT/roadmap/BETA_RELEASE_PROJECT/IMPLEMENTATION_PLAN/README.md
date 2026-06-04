# Beta Implementation Plan

<!-- @GENOME T2-NAV-002 | ACTIVE | 2026-03-31 | parent:T1-NAV-001 | auto:/coding | linked:/strategy -->

**Purpose**: Concrete implementation package for the YSELA beta, based on the minimal-change architecture decision.

## Contents

| File | Purpose |
|------|---------|
| [00_MASTER_IMPLEMENTATION_PLAN.md](./00_MASTER_IMPLEMENTATION_PLAN.md) | Master delivery plan, sequencing, and decision rules |
| [01_PROMPT_AND_FRONTEND_PLAN.md](./01_PROMPT_AND_FRONTEND_PLAN.md) | Prompt-layer and UI changes that should happen before backend expansion |
| [02_MINIMAL_BACKEND_PLAN.md](./02_MINIMAL_BACKEND_PLAN.md) | Only the backend changes required for beta |
| [03_CONSULTANT_BETA_OPERATIONS.md](./03_CONSULTANT_BETA_OPERATIONS.md) | Consultant-led beta operating model and weekly cadence |
| [04_GATES_DEPENDENCIES_AND_RISKS.md](./04_GATES_DEPENDENCIES_AND_RISKS.md) | Delivery gates, dependencies, risks, and go/no-go checks |
| [05_DELIVERY_BACKLOG.md](./05_DELIVERY_BACKLOG.md) | Ordered execution backlog by workstream and priority |
| [PROMPT_TOUCHPOINTS/README.md](./PROMPT_TOUCHPOINTS/README.md) | Prompt inventory, canonical beta prompts, and migration map |

## Planning Rule

This package assumes:

- keep `Objective -> Key Result -> Goal -> Task`
- keep the current planning cascade
- keep tasks as the persistence layer
- shift meaning through prompts, guidance, frontend framing, and consultant workflow first
- add backend only where beta operations or evidence capture are blocked without it

## Source Inputs

This package is derived from:

- [BETA_ROADMAP_2026.md](../BETA_ROADMAP_2026.md)
- [2026_03_22_BETA_MINIMAL_CHANGE_AUDIT.md](/Users/sagarrs/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_22_BETA_MINIMAL_CHANGE_AUDIT.md)
