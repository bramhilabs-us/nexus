# Prompt and Frontend Plan

<!-- @GENOME T2-PRD-013 | ACTIVE | 2026-03-30 | parent:T2-PRD-011 | auto:/coding | linked:- -->

## 1. Objective

Make the product feel like a handoff and ownership system **without** changing the underlying execution model.

This workstream should happen before any meaningful backend expansion.

## 2. Existing Assets To Reuse

### Prompt layer

- `server/prompts/index.js`
- `server/prompts/base-system-prompt.js`
- `server/prompts/guidance-builder.js`
- `server/prompts/endpoint-templates/okr-generation.js`
- `server/prompts/endpoint-templates/single-objective.js`
- `server/prompts/endpoint-templates/weekly-plan.js`
- `server/prompts/endpoint-templates/task-suggestion.js`

### Frontend pages

- `client/pages/objectives.html`
- `client/pages/teams.html`
- `client/pages/planning-v2.html`
- `client/pages/scripts/objectives.js`
- `client/pages/scripts/teams.js`
- `client/pages/scripts/planning-v2.js`

## 3. Prompt-Layer Changes

## P0: Mandatory

### P0-1 Unify beta prompt behavior on all execution paths

Apply the same behavior rules to:

- company OKR generation
- single objective generation
- weekly plan generation
- task generation

Rules:

- language must be contextual, not generic
- guidance block must always be returned
- outputs must reference business context and current objective
- no fabricated baselines
- prompts should prefer `next move`, `handoff step`, `priority move` framing in user-facing text

### P0-2 Shift task-generation semantics

Do not change the JSON contract.

Keep:

- `tasks[]`

Change:

- system prompt intent
- user prompt wording
- `guidance.coach_message`
- `guidance.next_best_action`

Target effect:

Tasks should be generated as the next meaningful moves in the weekly handoff, not as generic to-dos.

### P0-3 Add vertical-specific guidance for Legacy Succession

Prompt sets must explicitly incorporate:

- advisor readiness
- client handoff quality
- founder dependency
- review ownership
- transition conversations
- trust and capacity signals

This is primarily a prompt problem, not a schema problem.

## P1: Recommended

### P1-1 Add quality checks at the prompt contract level

Validate for:

- KR diversity
- baseline usage when available
- weak-SSI targeting when relevant
- category correctness
- next-step specificity

### P1-2 Add prompt-side naming conventions for beta

Examples:

- objective description begins with `Human objective:`
- task description begins with `Why this matters:`
- guidance explains the handoff implication

## 4. Frontend Changes

## Planning page

Keep the page and underlying calls.

Change copy such as:

- `Generate Tasks` -> `Suggest Next Moves`
- `Tasks` -> `Next Moves`
- `Task Status` -> `Move Status`

Preserve the API and data structures.

## Objective page

Keep objective model and rendering logic.

Change display so users see:

- business target first
- human objective in description summary
- why this matters summary if present

## Team page

Keep `Team` as the model.

Use naming and copy conventions for beta:

- team name can represent a pod
- description carries mentor/ritual intent until structured fields are truly required

## 5. Why This Workstream Comes First

Because this workstream changes user perception at low cost.

If this is skipped, the platform will still look like another task system even if backend work is added later.

## 6. Success Criteria

- A stakeholder can use the product and describe it as more than a task tracker.
- Planning outputs feel like guided execution, not task dumping.
- Objective pages show a human objective, not just metric targets.
- No beta-critical AI response is missing `guidance`.

