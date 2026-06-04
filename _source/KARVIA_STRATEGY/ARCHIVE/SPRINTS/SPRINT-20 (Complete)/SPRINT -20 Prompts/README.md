# Sprint 20 Prompt Workspace

This folder is the working space for Sprint 20 prompt construction for the Intelligent Objective Creation Wizard.

It is based on these existing sources:
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-20 (Planned)/SPRINT20_MASTER_STRATEGY.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-17 (Complete)/SPRINT17_HANDOFF_DOCUMENT.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-18 (Planned)/SPRINT18_HANDOFF_DOCUMENT.md`
- `KARVIA_STRATEGY/1-PRODUCT/user-journeys/CROSS_PAGE_AI_CONTEXT_FLOW.md`
- `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_08_OPENAI_PERSONAL_GUIDANCE_PROMPT_PACK.md`
- `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/PROMPT_IMPROVEMENT_VALIDATION.md`
- `server/prompts/`
- `server/services/AIContextService.js`
- `client/pages/okr-creation-wizard.html`
- `client/pages/scripts/okr-creation-wizard.js`

## What this workspace contains

- `SPRINT20_PROMPT_EVALUATION.md`
  Current-state evaluation, key constraints, and integration risks.
- `SPRINT20_PROMPT_ARCHITECTURE_PLAN.md`
  Shared prompt chain, output contracts, and orchestration rules.
- `SPRINT20_PROMPT_TEST_PLAN.md`
  Test-first validation plan for prompt quality and user experience.
- `drafts/`
  Working prompt drafts for each wizard stage.
- `fixtures/`
  Example JSON outputs to validate structure before live model testing.

## Main conclusions from the evaluation

1. Sprint 20 should extend the Sprint 17 prompt stack, not introduce a separate prompt style.
2. The live `okr-creation-wizard` is still an older 4-step template flow and is not the Sprint 20 target experience.
3. Prompt quality depends on a shared context envelope and deterministic validators between stages.
4. The Sprint 20 plan must use the real Objective model categories:
   - `growth`
   - `customer_success`
   - `operations`
   - `people_culture`
   - `innovation`
   - `financial_health`
5. The best user experience comes from one coherent conversation:
   - hidden session warmup
   - visible objective refinement
   - visible KR generation
   - focused KR regeneration with feedback

## Recommended implementation order

1. Lock shared JSON contracts.
2. Implement hidden pre-prompt plus refine prompt.
3. Validate refine output on 5-10 sample contexts.
4. Implement KR generation prompt and validator.
5. Implement KR regeneration prompt and preserve diversity rules.
6. Only then move prompt files into `server/prompts/objective-wizard/`.
