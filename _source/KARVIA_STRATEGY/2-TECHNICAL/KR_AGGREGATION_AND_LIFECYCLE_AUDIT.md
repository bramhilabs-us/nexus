# KR Aggregation + Lifecycle Writers — Audit

<!-- @GENOME T2-ARC-S25-KR-AUDIT | ACTIVE | 2026-05-09 | parent:T3-SPR-025-MP | auto:- | linked:/coding -->

**Status**: 🟢 ACTIVE — produced 2026-05-09 (Session #209) as Sprint 25 PX-1.7 deliverable.
**Purpose**: Single reference for (a) how Objective progress is aggregated from KRs today, (b) every site that writes `Objective.lifecycle_stage`, (c) gaps that drive Sprint 27 scope.
**Audience**: Sprint 27 Workstream C (KR-aggregation cron design); cross-sprint refinement track.

---

## Part 1 — KR → Objective progress aggregation

### Storage model (today)

| Field | Where it lives | Stored or derived? |
|---|---|---|
| `KeyResult.current_value` | `KeyResult` standalone collection ([`server/models/KeyResult.js`](../../server/models/KeyResult.js)) | Stored (write on update) |
| `KeyResult.baseline_value` | `KeyResult` | Stored (set at create) |
| `KeyResult.target_value` | `KeyResult` | Stored (set at create) |
| `KeyResult.progress_percentage` | virtual on `KeyResult` model | Derived at read time |
| `KeyResult.status` | `KeyResult` | Stored; auto-flipped to `completed` on save when `progress_percentage >= 100` |
| `Objective.progress` | computed via `Objective.calculateProgress()` | Derived at read time (no stored field) |

### Formula

**KeyResult progress** ([`server/models/KeyResult.js:104-109`](../../server/models/KeyResult.js#L104-L109)):

```
progress_percentage = ((current_value - baseline_value) / (target_value - baseline_value)) * 100
```

Clamped to `[0, 100]`. Status auto-advances to `completed` on `pre('save')` when ≥100 ([`KeyResult.js:117-128`](../../server/models/KeyResult.js#L117-L128)).

**Objective progress** ([`server/models/Objective.js:491-510`](../../server/models/Objective.js#L491-L510) `calculateProgress()`):

```
progress = average of all KR progress_percentages on this Objective
         = sum(KR.progress_percentage) / count(KRs)
```

Returns `0` when KR set is empty.

### Write trigger

There is **NO scheduler / cron / hook** that aggregates KR progress to a stored Objective progress field today.

Aggregation fires only when:
1. A consumer calls `Objective.calculateProgress()` directly (read-time), or
2. `Objective.updateKeyResultProgress()` ([`Objective.js:465-488`](../../server/models/Objective.js#L465-L488)) is invoked — but that updates the **embedded** `key_results[]` subdoc, not the standalone collection. (Per PX-1.11, this path is one of the not-migrated consumers.)

### Search confirmation

```bash
grep -rn "aggregat\|cron\|schedule\|interval" server/services/ --include="*.js"
# → no KR-aggregation worker found
```

### Implications for Sprint 27

- If real-time Objective progress is wanted on dashboards, S27 must either:
  1. Compute on read (current behavior; cheap, fine at small scale), OR
  2. Add a write-side hook on `KeyResult.post-save` that recomputes + stores `Objective.progress`, OR
  3. Add a scheduled aggregation cron.
- Recommend option (2) for S27 — matches single-writer house style; trivial Mongoose hook.
- Embedded-vs-standalone confusion in `updateKeyResultProgress()` should be resolved as part of PX-1.11 migrations (PX-3.6a-h).

---

## Part 2 — `Objective.lifecycle_stage` writers

### Single canonical writer ✅

**ALL writes go through [`server/services/LifecycleTransitionService.js`](../../server/services/LifecycleTransitionService.js).** Confirmed via:

```bash
grep -rn "lifecycle_stage\s*=\|lifecycle_stage:" server/ --include="*.js"
# → all hits are inside LifecycleTransitionService.js or constants files
```

### Five entry points

All entry points end up calling the private `_record()` / `findOneAndUpdate` write at lines 88-122 with idempotent `fromStage` filter.

| Method | Purpose | When called |
|---|---|---|
| `transitionTo(toStage, reason)` | System-triggered transition (catalog-validated) | Called by `evaluateAndTransitionAfterWrite()` and explicit triggers |
| `manualTransition(toStage, reason, actorUserId)` | User-driven transition (catalog-validated) | Consultant manual edits |
| `manualOverride(toStage, reason, actorUserId)` | Unchecked override (skips catalog) | Edge cases / data fixes |
| `appendHistoryOnly(reason)` | Append history entry without flipping stage | Used for `assessment_completed` (Company stage doesn't flip but event is logged) |
| `evaluateAndTransitionAfterWrite()` | Predicate-driven evaluator (lines 261-367) | Auto-triggered post-response by route handlers |

### Auto-transition predicates (Objective)

Lifecycle transitions for `Objective.lifecycle_stage` ([`LifecycleTransitionService.js:276-367`](../../server/services/LifecycleTransitionService.js#L276-L367)):

| From | To | Predicate |
|---|---|---|
| `identified` | `kr_breakdown` | At least one KR exists (embedded OR standalone) |
| `kr_breakdown` | `in_execution` | Owner is client-side role (BUSINESS_OWNER/EXECUTIVE/MANAGER/EMPLOYEE) AND ≥1 WeeklyGoal exists |
| `in_execution` | `completion_review` | All KRs have status='completed' |
| `completion_review` | `sustained_mode` | Manual via `markSustained()` ([`LifecycleTransitionService.js:379-402`](../../server/services/LifecycleTransitionService.js#L379-L402)); guarded by `Objective.sustained_eligible` virtual ([`Objective.js:449-453`](../../server/models/Objective.js#L449-L453)) |

### After-write evaluator wiring

`fireAfterWriteEvaluator()` ([`LifecycleTransitionService.js:423-437`](../../server/services/LifecycleTransitionService.js#L423-L437)) is an Express `res.on('finish')` hook fired by:

- [`routes/objectives.js:281`](../../server/routes/objectives.js#L281) (POST/PUT/PATCH)
- [`routes/key-results.js:95`](../../server/routes/key-results.js#L95) and [`:152`](../../server/routes/key-results.js#L152)
- [`routes/weekly-goals.js:318`](../../server/routes/weekly-goals.js#L318)
- [`routes/moves.js:304`](../../server/routes/moves.js#L304)

This is the closest pattern to a `notifyTransition()` helper — but it's per-route, not per-transition. **PX-2.2 will add a per-transition inline helper inside `_record()`** so transitions notify regardless of which route triggered them.

### Telemetry emission

Every successful flip emits `lifecycle.transition` via `TelemetryService.emit()` ([`LifecycleTransitionService.js:104-116`](../../server/services/LifecycleTransitionService.js#L104-L116)). Best-effort, non-blocking.

---

## Part 3 — `Company.stage` writers

Mirrors the lifecycle pattern but lives in [`server/services/StageTransitionService.js`](../../server/services/StageTransitionService.js), which delegates to `LifecycleTransitionService.companyStageInstance` (the same factory).

Entry points already documented in [`SPRINT_X_VERIFICATION.md`](SPRINT_X_VERIFICATION.md) PX-1.5 — see that section.

---

## Gaps + recommendations

| # | Gap | Recommendation | Owner |
|---|---|---|---|
| G1 | No KR aggregation cron | S27 add `KeyResult.post-save` hook to recompute/store `Objective.progress` | Sprint 27 |
| G2 | `updateKeyResultProgress()` writes embedded subdoc, not standalone | Replace with standalone `KeyResult.findByIdAndUpdate` as part of PX-3.6a | Sprint 25 PX-3.6a |
| G3 | After-write evaluator is per-route — easy to forget on a new route | Move evaluator invocation into model post-save hook OR enforce via lint rule | Sprint 25 (consider for PX-2.2 scope) |
| G4 | No `notifyTransition()` helper today | PX-2.2 will add it inside `_record()` | Sprint 25 PX-2.2 |
| G5 | Telemetry `lifecycle.transition` event has no subscriber yet | Sprint 26 wires email subscribers via `notifyTransition()` helper (NOT via telemetry pub-sub — Group 2a invariant) | Sprint 26 |

---

## Sign-off

This audit answers PX-1.7 and provides Sprint 27 the formula + writer-set inputs for KR-aggregation cron design.

Cross-references:
- [SPRINT_X_VERIFICATION.md](SPRINT_X_VERIFICATION.md) — Phase 1 master report
- [CONSOLIDATION_PLAN.md](CONSOLIDATION_PLAN.md) — cascade Phase B/C plan
