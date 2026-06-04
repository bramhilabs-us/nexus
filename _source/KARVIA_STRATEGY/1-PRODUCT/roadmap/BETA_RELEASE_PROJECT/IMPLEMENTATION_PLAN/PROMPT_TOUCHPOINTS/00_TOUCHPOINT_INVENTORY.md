# Prompt Touchpoint Inventory

<!-- @GENOME T2-PRD-026 | ACTIVE | 2026-03-30 | parent:T2-PRD-011 | auto:/coding | linked:- -->

## 1. Beta-Critical Prompt Touchpoints

These are the prompt-construction touchpoints that directly shape the beta experience.

| Touchpoint | Code Location | Current Role | Beta Critical | Recommendation |
|------------|---------------|--------------|---------------|----------------|
| Company OKR generation | `server/routes/ai-okr.js` | Generate company-wide objectives from profile + SSI + metrics | Yes | Migrate fully to canonical beta prompt |
| Single objective generation | `server/routes/ai-okr.js` | Generate one objective for a selected category | Yes | Migrate to canonical beta prompt |
| Weekly plan generation | `server/routes/planning.js` | Break KR into weekly goals and tasks | Yes | Reframe as weekly handoff plan while keeping same data contract |
| Task generation | `server/routes/planning.js` | Generate tasks for a weekly goal | Yes | Reframe tasks as next moves without changing persistence |
| SSI narrative | `server/services/SSINarrativeService.js` | Create executive narrative from SSI results | Yes | Reframe toward ownership and action, not just diagnostic commentary |
| Objective wizard refine | `server/routes/objective-wizard.js` | Refine rough objective into clearer statement | Yes | Align with human objective framing |
| Objective wizard KR generation | `server/routes/objective-wizard.js` | Generate KRs for objective | Yes | Ensure KRs support human objective, not generic metrics |
| Objective wizard KR regeneration | `server/routes/objective-wizard.js` | Regenerate one KR | Yes | Same rules as KR generation |

## 2. Supporting Prompt Touchpoints

These are real prompt-construction paths but are secondary for beta.

| Touchpoint | Code Location | Current Role | Beta Critical | Recommendation |
|------------|---------------|--------------|---------------|----------------|
| Plan extension | `server/routes/planning.js` | Extend existing weekly plan | Medium | Use canonical beta extension prompt if endpoint remains active in beta |
| AIObjectivePlanner | `server/services/AIObjectivePlanner.js` | Generate planning guidance | Medium | Keep but align language if still invoked |
| aiOKRService | `server/services/aiOKRService.js` | Legacy OKR generation service | Medium | Avoid new investment; route traffic to canonical prompt path |
| AIEstimator | `server/services/AIEstimator.js` | Estimation helper | Low | Out of primary beta scope |

## 3. Current Prompt Fragmentation Risks

Current risks in code:

- inline system prompts still exist in `ai-okr.js`
- inline system prompts still exist in `planning.js`
- wizard prompt behavior partly uses prompt templates, partly uses inline strings
- SSI narrative still uses its own independent system prompt
- legacy services still contain separate prompt personalities

## 4. Beta Prompt Priority Order

Implement prompt changes in this order:

1. company OKR generation
2. task generation
3. weekly plan generation
4. single objective generation
5. SSI narrative
6. objective wizard
7. plan extension
8. legacy prompt surfaces

## 5. Core Principle

The highest-value beta touchpoints are not the most numerous ones.

The most important ones are the ones that make the product either:

- feel like another task tool

or

- feel like a guided system for ownership and next moves

