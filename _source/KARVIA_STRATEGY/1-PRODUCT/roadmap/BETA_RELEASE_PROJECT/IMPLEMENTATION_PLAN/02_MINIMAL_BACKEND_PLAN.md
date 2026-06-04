# Minimal Backend Plan

<!-- @GENOME T2-PRD-014 | ACTIVE | 2026-03-30 | parent:T2-PRD-011 | auto:/coding | linked:- -->

## 1. Backend Rule

No backend change is approved unless prompt, frontend, and consultant workflow options have already been exhausted.

## 2. Existing Backend To Keep

Keep and reuse:

- `server/routes/ai-okr.js`
- `server/routes/planning.js`
- `server/models/Objective.js`
- `server/models/Task.js`
- `server/models/Team.js`
- `server/services/AIContextService.js`
- `server/services/ContextMaturityService.js`

## 3. Backend Changes Required For Beta

## P0: No schema rewrite

Do **not** introduce:

- a new `Works` model
- a new `Handoff` model
- a new execution microservice

## P1: Minimal consultant reporting extension

Extend `server/routes/consultant.js` or add closely related beta endpoints to provide:

- client objective summary
- blocked task counts
- deferred task counts
- weekly-goal completion summary
- recent review/evidence summary

### Why

Consultants need a weekly control surface.

### Dependency

Current consultant portfolio model.

## P1: Weekly evidence capture

Add the smallest possible operational evidence mechanism.

Preferred options in order:

1. Reuse existing review/outcome infrastructure if weekly cadence can be supported cleanly.
2. Add one narrowly scoped model such as `BetaWeeklyReview`.

This mechanism should store:

- company
- objective
- week
- what moved
- what got blocked
- what bounced back
- consultant intervention
- next recommendation

### Why

Without this, the beta cannot generate reliable learning.

## P1: Benchmark source cleanup

Reduce benchmark drift across:

- `server/config/industries.js`
- `server/services/SSINarrativeService.js`
- any analytics placeholder benchmark logic

### Why

One company should not get different truths from different surfaces.

## 4. Backend Changes That Are Optional

These should only be added if beta reporting proves they are necessary.

### Optional objective metadata

- `human_objective`
- `behavior_markers`
- `evidence_markers`

### Optional team metadata

- `mentor_id`
- `organizer_id`
- `ritual_cadence`

### Why these are optional

They are useful for reporting, but beta can start with naming conventions and descriptions first.

## 5. Backend Changes That Are Not Required Before Beta

- renaming task states
- replacing tasks with another persistence object
- replacing goals with another planning object
- introducing a behavior engine service
- heavy model migrations

## 6. Success Criteria

- Consultants can view enough data to run weekly beta reviews.
- Weekly evidence can be captured consistently.
- No new execution model is introduced.
- Benchmark-driven outputs are not contradictory across major surfaces.

