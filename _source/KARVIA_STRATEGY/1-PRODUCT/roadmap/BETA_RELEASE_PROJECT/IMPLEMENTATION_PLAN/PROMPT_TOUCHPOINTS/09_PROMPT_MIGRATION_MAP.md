# Prompt Migration Map

<!-- @GENOME T2-PRD-035 | ACTIVE | 2026-03-30 | parent:T2-PRD-026 | auto:/coding | linked:- -->

## 1. Migration Principle

Do not create new prompt systems.

Move remaining beta-critical prompt logic toward the existing `server/prompts/*` structure and align all touched endpoints to the prompt specs in this folder.

## 2. Exact Touchpoint Map

| Current Location | Current State | Target Prompt File | Action |
|------------------|--------------|--------------------|--------|
| `server/routes/ai-okr.js` company generation | Inline prompt-heavy | `02_COMPANY_OKR_GENERATION.md` | Refactor to canonical beta prompt behavior |
| `server/routes/ai-okr.js` single objective | Inline | `03_SINGLE_OBJECTIVE_AND_WIZARD.md` | Refactor |
| `server/routes/objective-wizard.js` refine objective | Template + inline mix | `03_SINGLE_OBJECTIVE_AND_WIZARD.md` | Align |
| `server/routes/objective-wizard.js` generate KRs | Inline | `03_SINGLE_OBJECTIVE_AND_WIZARD.md` | Align |
| `server/routes/objective-wizard.js` regenerate KR | Template-based | `03_SINGLE_OBJECTIVE_AND_WIZARD.md` | Align |
| `server/routes/planning.js` weekly plan | Inline | `04_WEEKLY_PLAN_GENERATION.md` | Refactor |
| `server/routes/planning.js` task generation | Inline | `05_TASK_TO_NEXT_MOVE_GENERATION.md` | Refactor |
| `server/routes/planning.js` plan extension | Inline | `06_PLAN_EXTENSION.md` | Refactor |
| `server/services/SSINarrativeService.js` | Inline/system-specific | `07_SSI_NARRATIVE.md` | Refactor |

## 3. Secondary Surfaces

| Current Location | Action |
|------------------|--------|
| `server/services/AIObjectivePlanner.js` | Align language and system behavior if still used in beta path |
| `server/services/aiOKRService.js` | Do not invest heavily; align or retire from beta path |
| `server/services/AIEstimator.js` | Out of primary beta path |

## 4. Recommended Implementation Sequence

1. task generation
2. weekly plan generation
3. company OKR generation
4. single objective generation
5. SSI narrative
6. objective wizard
7. plan extension

## 5. Done Criteria

- no beta-critical prompt behavior lives only in an orphan inline string
- prompt behavior is consistent across beta-critical flows
- outputs clearly support the minimal-change beta operating model

