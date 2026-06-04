# Epic 25.5 — Behavior Persistence + KR-Level Promotion (full β)

<!-- @GENOME T3-SPR-025-EPIC-5 | DRAFT | 2026-05-05 | parent:T3-SPR-025-MP | auto:- | linked:- -->

**Points**: 3-4 (estimate)
**Priority**: P1 — improvement on S24 γ-lite Behaviors strip; not a Beta blocker
**Source**: S24 audit D-Beta = X (γ-lite in S24, full β in S25)

---

## Goal

Replace S24's frontend-only behavior grouping (which is fragile to title drift) with a server-backed, schema-supported behavior identity system. After this epic, recurring behaviors are first-class entities reliably grouped via `Move.behavior_id` (Path C from S24 audit). Frontend Plan tab gets full β rendering: behaviors promoted to **per-KR rows inside the tree**, not a separate strip.

## Pre-requisites

1. Epic 24.4 (S24) shipped — γ-lite Behaviors strip in production for ≥1 sprint
2. Telemetry/observation indicates which behaviors are most affected by title drift (informs migration backfill)
3. S25 Epic 25.1 (Cascade Phase B) has shipped — write-side cutover stabilized

## Locked Decisions (carried from S24 audit)

- **Path C** chosen over Path A (frontend-only) and Path B (full FK restructure)
- New schema field: `Move.behavior_id` (string hash, NOT a new FK)
- Hash derives from `(normalized_title, discipline, key_result_id)`
- Old Moves backfilled where matching is unambiguous; ambiguous cases stay null
- AI service `aiOKRService.generateMoves()` (S22 #178) updated to set `behavior_id` on recurring Moves
- One-off Moves (`frequency='once'`) leave `behavior_id` null

## Acceptance Criteria

### Schema
- [ ] NEW field `Move.behavior_id: { type: String, default: null }`
- [ ] Indexed for fast grouping queries (`{company_id: 1, behavior_id: 1}`)
- [ ] No FK changes (Move still references `weekly_goal_id`)

### Hash function (shared service)
- [ ] NEW `server/services/BehaviorIdentity.js`
- [ ] `computeBehaviorId({title, discipline, keyResultId})` — pure function returning stable hash string
- [ ] Normalization: lowercase, trim, strip punctuation, collapse whitespace
- [ ] Hash: SHA-256 of normalized triple, take first 16 chars
- [ ] Test cases for stability across cosmetic title variants

### AI service update
- [ ] `aiOKRService.generateMoves()` called from `routes/planning.js generate-weekly-plan` sets `behavior_id` on recurring Moves
- [ ] One-off Moves get `behavior_id: null`
- [ ] Recurring detection: `frequency != 'once'`

### Migration script
- [ ] NEW `scripts/db/backfill-behavior-id.js` — idempotent
- [ ] For each existing recurring Move, compute and set `behavior_id` if currently null
- [ ] Print summary: total Moves processed, behaviors found, ambiguous cases left null
- [ ] Production guard
- [ ] Dry-run mode

### Frontend Plan tab — full β rendering
- [ ] Remove the standalone "Behaviors" strip from S24 γ-lite
- [ ] Within each KR row in the tree: render a "Behaviors" sub-section above the Quarterly Goal sub-section
- [ ] Group by `behavior_id` (server-side data; no fragile title matching)
- [ ] Same sparkline/streak visualization from S24 γ-lite, just relocated
- [ ] One-off Moves stay as siblings of Tasks under WeeklyGoal (unchanged from S24)

### Tests

NEW `scripts/test-behavior-persistence.js`:
- `BehaviorIdentity.computeBehaviorId()` produces stable hash for variant titles ("Update CRM weekly", "  Update CRM Weekly  ", "update crm weekly")
- AI service sets `behavior_id` on recurring Moves
- AI service leaves `behavior_id` null on one-off Moves
- Migration script idempotent
- Frontend: KR row renders Behaviors sub-section grouped by `behavior_id`
- Frontend: behaviors no longer appear in standalone top-of-tab strip
- Frontend: title-drift case (two Moves with slightly different titles but same `behavior_id`) → 1 grouped row (verifies stability)
- Backward compat: Moves with null `behavior_id` (legacy or unprocessed) render as one-off in tree

Target: ~30-40 assertions.

## Implementation Notes

### Files to create
- `server/services/BehaviorIdentity.js`
- `scripts/db/backfill-behavior-id.js`
- `scripts/test-behavior-persistence.js`

### Files to modify
- `server/models/Move.js` — add `behavior_id` field + index
- `server/services/aiOKRService.js` — wire `BehaviorIdentity.computeBehaviorId()` into `generateMoves`
- `server/routes/planning.js` — verify AI-generated bulk-insert path sets `behavior_id`
- `client/pages/scripts/client-workspace.js` — refactor Plan tab to render Behaviors per KR (full β layout)
- `client/css/client-workspace.css` — adjust styles for in-tree Behaviors sub-section

### Surgical reuse
- ✅ S24 γ-lite frontend grouping logic (sparkline rendering, completion aggregation) — port from "top of tab" to "per-KR row"
- ✅ Existing `?include=moves` populate from S24 Epic 24.4 (no new endpoint)
- ✅ AI generation path from S23 #192b (extend, don't fork)
- ✅ `scripts/db/` folder convention from S24 F-5

### What's net new
- 1 schema field + 1 index
- 1 service file
- 1 migration script
- AI service hook
- Frontend layout shift (top-of-tab strip → per-KR sub-section)

### Risk mitigations
- **R1 (migration ambiguity)**: dry-run + summary report before write; ambiguous cases stay null and render as one-off (graceful degradation)
- **R2 (AI prompt drift)**: stable hash function decouples grouping from LLM output exact strings — title drift no longer fractures behaviors

## Dependency on S24

S24 Epic 24.4's γ-lite ships first. This epic builds on top of that learning:
- If consultants love the Behaviors view → full β + KR-level promotion ships fast in S25
- If consultants find it confusing → revisit the design before promoting; may not promote at all
- Either way, `behavior_id` schema is useful for future behavior analytics (DEBT-008 / FEAT-045 telemetry)

---

**Spec status**: Draft. Conditional on S24 γ-lite shipping + 1 sprint of telemetry.
