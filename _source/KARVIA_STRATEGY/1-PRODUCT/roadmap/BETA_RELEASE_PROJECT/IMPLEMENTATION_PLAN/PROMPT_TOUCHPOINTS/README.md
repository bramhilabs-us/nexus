# Prompt Touchpoints

<!-- @GENOME T2-NAV-003 | ACTIVE | 2026-03-31 | parent:T2-NAV-002 | auto:/coding | linked:/strategy -->

**Purpose**: Central prompt package for beta-critical AI behavior.

This folder does two things:

1. identifies every current prompt-construction touchpoint that matters to beta
2. provides a canonical beta prompt set to migrate toward

## Files

| File | Purpose |
|------|---------|
| [00_TOUCHPOINT_INVENTORY.md](./00_TOUCHPOINT_INVENTORY.md) | Full inventory of prompt-construction touchpoints in the current codebase |
| [01_BETA_PROMPT_GOVERNANCE.md](./01_BETA_PROMPT_GOVERNANCE.md) | Common rules, response contracts, and language requirements |
| [10_YSELA_COACH_PERSONA.md](./10_YSELA_COACH_PERSONA.md) | Canonical personification and core system-prompt identity for YSELA Coach |
| [11_REFERENCE_LIBRARY.md](./11_REFERENCE_LIBRARY.md) | Strategy, management, and operating references that should shape prompt reasoning |
| [02_COMPANY_OKR_GENERATION.md](./02_COMPANY_OKR_GENERATION.md) | Prompt spec for company-level objective generation |
| [03_SINGLE_OBJECTIVE_AND_WIZARD.md](./03_SINGLE_OBJECTIVE_AND_WIZARD.md) | Prompt spec for single-objective generation and wizard refinement |
| [04_WEEKLY_PLAN_GENERATION.md](./04_WEEKLY_PLAN_GENERATION.md) | Prompt spec for weekly plan generation |
| [05_TASK_TO_NEXT_MOVE_GENERATION.md](./05_TASK_TO_NEXT_MOVE_GENERATION.md) | Prompt spec for converting tasks into beta-style next moves |
| [06_PLAN_EXTENSION.md](./06_PLAN_EXTENSION.md) | Prompt spec for extending an existing plan |
| [07_SSI_NARRATIVE.md](./07_SSI_NARRATIVE.md) | Prompt spec for SSI narrative and executive interpretation |
| [08_CONSULTANT_WEEKLY_REVIEW.md](./08_CONSULTANT_WEEKLY_REVIEW.md) | Prompt spec for consultant weekly review synthesis |
| [09_PROMPT_MIGRATION_MAP.md](./09_PROMPT_MIGRATION_MAP.md) | Exact migration map from current code touchpoints to target beta prompts |

## Guiding Rule

Keep the current backend models and routes whenever possible.

Use this prompt package to change:

- semantics
- framing
- explanation quality
- consultant usefulness
- beta differentiation

before changing schemas or business logic.
