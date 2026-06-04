# Sprint 20 Prompt Evaluation

## Objective

Create a prompt system for Sprint 20 that makes objective creation feel guided, fast, and meaningful instead of blank, generic, or disconnected.

## Product context recovered from existing docs

### Sprint 20 intent

Sprint 20 defines a 3-screen wizard:
1. Select area and urgency.
2. Describe intent in plain language.
3. Review refined objective and generate 4 Key Results.

The strategy already assumes four AI actions:
- hidden pre-prompt
- refine objective
- generate KRs
- regenerate a KR with feedback

### Sprint 17 constraints

Sprint 17 already established the correct AI architecture:
- shared Karvia Coach system layer
- stage-aware prompt selection
- guidance block conventions
- separation of context data from prompt policy

This means Sprint 20 should add a new prompt family, not another route-level prompt silo.

### Sprint 18 constraints

Sprint 18 made the company profile more AI-ready and visible to the user. Sprint 20 should consume that maturity, not re-ask for information that already exists in profile or SSI context.

### Cross-page context model

The system is meant to learn from:
- company profile
- SSI results
- historical objective outcomes
- rejection history
- execution/task patterns

Sprint 20 should use that context to make the first recommendation feel personal on the first visible AI response.

## Current-state findings

### 1. The live wizard is not the Sprint 20 wizard

Current `client/pages/okr-creation-wizard.html` and `client/pages/scripts/okr-creation-wizard.js` are a separate older experience:
- 4-step flow, not 3-step
- industry-template driven
- static objective suggestions
- not based on session-based prompt orchestration

Result: Sprint 20 prompt planning cannot assume the current wizard logic is reusable as-is.

### 2. Sprint 20 strategy category alignment ✅ FIXED

The Sprint 20 strategy doc now uses the correct categories from `server/config/categories.js`:
- `growth`
- `customer_success`
- `operations`
- `people_culture`
- `innovation`
- `financial_health`

Result: Prompts and UI now align with the actual Objective model enum. (Fixed Mar 18, 2026 - AH-12)

### 3. The best prompt system is multi-stage but not multi-persona

The repo already has a usable foundation:
- one base Karvia Coach persona
- per-endpoint overlays
- maturity-aware context rules

Sprint 20 should preserve one voice across all steps. The user should feel like one coach is helping them clarify an idea, not four different models speaking differently.

### 4. Prompt quality is not enough on its own

The validation doc for the consulting prompt pack shows the pattern clearly:
- leaner prompts improved results
- explicit diversity rules improved KRs
- baseline discipline improved realism

Result: Sprint 20 needs prompt rules plus deterministic validation between stages.

## Design principles for a meaningful objective creation experience

1. The first visible response must acknowledge the selected area, urgency, and company context.
2. The refine step should improve the user's idea, not overwrite it.
3. KR generation should attack the same objective from different angles, not repeat one metric four times.
4. If a baseline is missing, the model must say so and use target-only wording.
5. Regeneration must preserve the objective and the diversity of the KR set.
6. The flow should ask for one missing input only when it materially improves quality.

## Prompt risks to avoid

1. Overlong hidden pre-prompts that spend tokens without changing the output.
2. Refine prompts that create polished but generic strategy language.
3. KR prompts that produce four versions of the same metric.
4. Regeneration prompts that rewrite the whole set instead of one KR.
5. Prompt files that duplicate rules already defined in the base system prompt.

## Recommended response architecture

Use four prompt modules only:
1. `pre-prompt`
2. `refine-objective`
3. `generate-krs`
4. `regenerate-kr`

Use deterministic validators after each visible step:
- objective validator after refine
- KR set validator after generate
- KR uniqueness validator after regenerate

## Release gate before prompt finalization

Do not finalize prompts until they pass all three gates:
1. Structure gate: JSON is valid and schema-complete.
2. Quality gate: output passes rubric in `SPRINT20_PROMPT_TEST_PLAN.md`.
3. Experience gate: the sequence feels like one coherent conversation.
