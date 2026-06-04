# Cascade Migration State — Canonical vs Legacy + Open Architectural Questions

<!-- @GENOME T2-ARC-CASCADE-001 | ACTIVE | 2026-05-28 | parent:T0-GOV-001 | auto:- | linked:/strategy,/coding -->

**Status**: DRAFT — created 2026-05-27 /strategy session
**Purpose**: Single source of truth for the OKR cascade architecture during the Sprint 22 → Sprint 27 transition state. Locks 4-level canonical for new objectives; preserves 5-level legacy; documents UNION-READ migration state; parks open architectural questions for post-Beta spike.

**Authoritative for**: model layer, route layer, UI terminology, doc layer cascade naming.

---

## TL;DR (1 paragraph)

Going forward, new objectives use a **4-level cascade**: Objective → Key Result → Weekly Goal → Daily Task. The Quarterly Goal layer is dropped from canonical per user direction 2026-05-27. Legacy 5-level objectives (with Quarterly Goals) remain in production — preserved, not migrated. The new `WeeklyGoal` collection (Sprint 22 Epic A) is canonical; the legacy `Goal{time_period:'WEEKLY'}` records continue via UNION-READ (Sprint 23 #191). Full collection consolidation is parked as a post-Beta spike. A future 5th "Move" layer (behavior-based, AI-generated from Tasks) is planned but out of S26/S27 scope.

---

## Canonical cascade (new objectives, post 2026-05-27)

```
Objective
  │  • BO sets duration: 3-12 months
  │  • fiscal-year-aware (April / July / October starts supported)
  │  • lifecycle_stage: identified → kr_breakdown → in_execution → completion_review → sustained
  ↓
Key Result (KeyResult.js collection, canonical)
  │  • 3-5 per Objective
  │  • Inherits Objective duration window (KR.duration ≤ Objective.duration)
  │  • Has owner_id (Manager assigned by BO during creation)
  │  • Also dual-written into embedded `Objective.key_results[]` (S25 PX-3.6)
  ↓
Weekly Goal (WeeklyGoal.js collection, canonical)
  │  • 1 per calendar week within KR span (ceil((KR.end - KR.start) / 7d))
  │  • Parent pointer: key_result_id (skips Quarterly Goal layer)
  │  • frequency='once' uses target_week + status; recurring uses completions[]
  ↓
Daily Task (Task.js collection)
  │  • References goal_id (works against WeeklyGoal._id)
  │  • status: todo / in_progress / completed / etc.
  ↓
(FUTURE — out of S26/S27 scope)
Move (behavior-based, AI-generated from Tasks)
  │  • Behavior persistence layer
  │  • API will call to generate Moves from Tasks
  │  • Surfaced in dashboard
  │  • Planned post-Beta
```

---

## Legacy cascade (pre-2026-05-27 objectives in production)

```
Objective
  ↓
Key Result
  ↓
Quarterly Goal (Goal{time_period:'QUARTERLY'})    ← LEGACY LAYER — preserved, not promoted
  │  • parent_goal_id links Weekly → Quarterly
  ↓
Weekly Goal (Goal{time_period:'WEEKLY'})          ← LEGACY collection — UNION-READ with WeeklyGoal
  ↓
Daily Task
```

**Preservation policy**: legacy 5-level objectives are NOT migrated to 4-level. They continue working as-is. New objectives created via the canonical wizard (`/api/objective-wizard/finalize`) use the 4-level cascade exclusively.

---

## Migration state matrix

| Layer | Canonical model | Legacy model | State | Migration cutover plan |
|---|---|---|---|---|
| Objective | `Objective.js` | (none) | Single model | N/A |
| Key Result | `KeyResult.js` (collection) | `Objective.key_results[]` (embedded) | **Dual-write** (S25 PX-3.6 sweep complete) | Embedded preserved for backward-compat readers; full cutover post-Beta |
| Quarterly Goal | (dropped from canonical) | `Goal{time_period:'QUARTERLY'}` | Legacy-only — no new writes from canonical wizard | Post-Beta usage-measured retirement |
| Weekly Goal | `WeeklyGoal.js` (collection) | `Goal{time_period:'WEEKLY'}` | **UNION-READ** (S23 #191) — new writes go to WeeklyGoal | Cutover parked as post-Beta spike |
| Daily Task | `Task.js` | (none) | Single model; `goal_id` polymorphic across WeeklyGoal._id and legacy Goal._id | N/A — works against both |
| Move | (none — future) | (none) | Not implemented | Post-Beta |

---

## Route layer state

| Endpoint family | Status | Notes |
|---|---|---|
| `POST /api/objectives` | Canonical | Used by Manual modal (door #2). Backend `owner_id` enforcement landing in S26 burndown A20260527-01. |
| `POST /api/objective-wizard/finalize` | Canonical | Used by canonical wizard (door #1/#3) + Individual Objective wizard (door #7 NEW, A20260527-04). |
| `POST /api/key-results` | Canonical | Adds KR to existing objective (supports "Add later" flow). |
| `POST /api/objective-wizard/generate-krs` | Canonical | Session-scoped today; A20260527-08 extends to accept existing `objective_id` for deferred-KR mode. |
| `GET/POST /api/goals/quarterly/*` | Legacy | Continues to serve legacy 5-level objectives. No new writes from canonical wizard for new objectives. |
| `GET/POST /api/goals/weekly/*` | Legacy | UNION-READ. |
| `GET/POST /api/weekly-goals/*` | Canonical | New WeeklyGoal collection routes. |
| `GET/POST /api/tasks/*` | Canonical | `goal_id` polymorphic — works against both. |
| `POST /api/ai-okr/generate-from-company` | Parked (door #5) | De-emphasized in S27 A20260527-06; route preserved. |
| `POST /api/ai-okr/generate-single-objective` | Parked (door #6) | Caller chain unclear; measure post-Beta. |

---

## UI terminology lock

Per `/strategy` 2026-05-27, the following names are authoritative across all UI surfaces (sprint plans, mockups, frontend code, error messages, emails):

| ✅ USE | ❌ DO NOT USE |
|---|---|
| **Objective** | "goal" (when meaning Objective), "business outcome" |
| **Key Result** (or **KR**) | "metric", "outcome metric" |
| **Weekly Goal** | "weekly milestone", "weekly focus", "weekly objective" |
| **Daily Task** (or **Task**) | "todo", "action item", "move" (Move is FUTURE behavioral layer) |
| **Move** (only when discussing future behavioral layer) | use of "Move" for current Tasks |

**Drift cleanup in S26 burndown A20260527-03** (doc-only):
- [planning.html](../../client/pages/planning.html) — 5 instances of "weekly milestones" → "weekly goals"
- [planning-v2.html](../../client/pages/planning-v2.html) — 1 instance of "weekly milestones" → "weekly goals"
- [WeeklyGoal.js:5](../../server/models/WeeklyGoal.js#L5) docstring updated 2026-05-27

---

## Open architectural questions (parked for post-Beta spike)

### Q-A: Should the Quarterly Goal layer be fully retired?

**Today**: legacy 5-level objectives still have Quarterly Goals. The Goal{time_period:'QUARTERLY'} records continue to be referenced by legacy planning.html.

**Future spike scope**:
- Measure: how many legacy objectives still have non-cancelled Quarterly Goals?
- Decide: full retirement (data migration to lift Weekly Goals to KR-direct) OR perpetual coexistence?
- If retirement: design backfill script + dispatch invariants update.

**Trigger**: post-Beta + 90-day usage data.

---

### Q-B: Single Goal{discriminator} vs separate WeeklyGoal collection?

**Today**: UNION-READ across both. Writes go to WeeklyGoal. Legacy Weekly Goals (Goal{time_period:'WEEKLY'}) still exist and are read alongside.

**Future spike scope**:
- Migrate legacy Goal{time_period:'WEEKLY'} records into WeeklyGoal collection
- Retire UNION-READ scaffolding (S23 #191)
- Decide fate of Goal{time_period:'QUARTERLY'} (tied to Q-A)

**Trigger**: post-Q-A resolution.

---

### Q-C: When does the Move layer materialize?

**Today**: not implemented. Tasks are direct children of Weekly Goals.

**Future spike scope** (post-Beta, behavior-based business framework):
- Design Move schema (likely references parent Task or Weekly Goal)
- AI generation: API takes Tasks + behavioral context → returns Moves
- Dashboard surface for Moves
- Coexistence with Tasks (Moves don't replace; they overlay behaviorally)

**Trigger**: behavior-based business framework rolls out per YSELA roadmap.

---

## Two-week-concept distinction (LOCKED 2026-05-28)

The codebase carries **two different "week" concepts**. Both are intentional, serve different concerns, and must not be conflated. Documented here to prevent future confusion.

| Concept | Source helper | Storage | Used for | Example |
|---|---|---|---|---|
| **Objective-relative week** | `ObjectiveCalculator.calculateWeekProgress(start, end)` (FE pure) | NOT stored — derived per render from `objective.start_date` + `Date.now()` | Card display: "Week N/M" label on objective cards (objectives.html, planning-v2.html); progress-bar timeline math; `calculateExpectedProgress` ratio | An objective starting 2026-05-28 reads as "Week 3/13" on 2026-06-11 (~14 days elapsed / 91 days total) — independent of calendar week numbering |
| **ISO calendar week** | Standard ISO 8601 week-of-year (1-53) | `WeeklyGoal.completions[].week` + `.year`; `WeeklyGoal.target_week` + `.target_year`; `WeeklyGoal.start_week` + `.end_week` | WeeklyGoal scheduling: "do this in week 22 of 2026"; planning-v2 calendar grid; cross-objective "what's scheduled this week" queries | Week 22 of 2026 = 2026-05-25 to 2026-05-31 (Monday-Sunday ISO) — same regardless of which objective owns the WeeklyGoal |

**Independence invariant**: each objective has its OWN `start_date / end_date` → objective-relative week is per-objective. ISO calendar week is global. The two never need to align — an objective starting mid-week, mid-year is fine: its Week 1 starts on its `start_date` regardless of which ISO week that falls in.

**Per /strategy-mini 2026-05-28 date audit**: confirmed all tracking math (`calculateExpectedProgress`, `calculateWeekProgress`, `calculateKRRiskStatus`, `getKRRowColorTokens`) reads each objective's own `start_date/end_date` — fully independent per objective per user direction *"objective is the highest, each objective tracks itself"*. The "Tomorrow I create another objective" scenario ✅ works: each new objective gets its own Week 1 starting on its own `start_date`, no shared "company quarter" anchor.

**The only date-system leak** (A20260528-02, 📝 PLAN): manual modal at `objectives.html:1657-1670` sends `time_period_type:'calendar_year'+target_year` → `DateService.calculateCalendarYear` backfills `start_date=Jan 1 of target_year` regardless of creation date. Closed naturally by S27 E.1a wizard timeline picker passing `time_period_type:'custom'+start_date=today+duration_months`.

---

## Decision log

| Date | Decision | Source | Effect |
|---|---|---|---|
| 2026-05-06 | KR migration to separate collection + dual-write | S25 PX-3.6 sweep | KeyResult.js becomes canonical; embedded preserved |
| 2026-05-06 | UNION-READ for Weekly Goals | S23 #191 | Allows incremental migration without breaking legacy |
| **2026-05-27** | **Drop Quarterly Goal from canonical (new objectives)** | **/strategy 2026-05-27 user direction** | **4-level cascade lock; legacy preserved** |
| **2026-05-27** | **Lock UI terminology (Weekly Goal / Daily Task / Move-as-future)** | **/strategy 2026-05-27 RP3** | **Drift cleanup item A20260527-03** |
| **2026-05-27** | **Park full collection consolidation as post-Beta spike** | **/strategy 2026-05-27 Q-S3** | **No S26/S27 migration work** |
| **2026-05-28** | **Two-week-concept distinction locked** | **/strategy-mini 2026-05-28 date audit** | **Objective-relative ("Week N/M") + ISO calendar ("week 22 of 2026") coexist by design; don't conflate** |
| **2026-05-28** | **Manual-modal `time_period_type='calendar_year'` default deprecated** | **/strategy-mini 2026-05-28 audit (A20260528-02 mint)** | **S27 E.1a wizard timeline picker uses `custom + today` default; manual modal kept as additive fallback** |

---

## How to update this doc

- Add new rows to "Decision log" with date, decision, source, effect.
- When a parked question (Q-A / Q-B / Q-C) is resolved, append a "Resolution" section and update the relevant matrix rows.
- If a new layer is added to the cascade, update both the canonical diagram and the migration state matrix.

---

## Sign-off

Created 2026-05-27 to encode the 4-level canonical cascade decision and document the migration state explicitly per user direction: *"let's let's let's standardize all these at least documentation across so that, you know, we don't get confused in the future."*

**Parent**: T0-GOV-001 (CLAUDE.md — referenced from cascade section)
**Linked to**: `/strategy` (architectural decisions) + `/coding` (developers verify against this doc before model/route changes)
