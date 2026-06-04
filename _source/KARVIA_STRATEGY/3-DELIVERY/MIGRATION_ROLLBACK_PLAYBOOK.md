# Migration Rollback Playbook

<!-- @GENOME T2-OPS-002 | ACTIVE | 2026-05-11 | parent:T0-GOV-001 | auto:- | linked:/audit,/strategy -->

**Purpose**: step-by-step rollback recipes for every migration / destructive cleanup tracked in Sprint 25 PX-3 work.
**Companion doc**: [CLEANUP-REGISTRY.md](CLEANUP-REGISTRY.md) — *what* gets deleted; this doc covers *how to undo* when things go wrong.
**Created**: Sprint 25 PX-3.11 (Day 12 #226).
**Refresh cadence**: each time a new migration or destructive task is added to CLEANUP-REGISTRY, add a corresponding entry here.

---

## Decision tree — when to invoke rollback

```
Migration completed → observe production for 30 min
     │
     ├─► Any error in app logs referencing migrated entities? ────► YES → ROLLBACK
     │
     ├─► User-visible regression in planning page / weekly view? ─► YES → ROLLBACK
     │
     ├─► Data integrity check fails (counts, FK orphans)? ────────► YES → ROLLBACK
     │
     └─► All green for 30 min ─────────────────────────────────────► HOLD

ROLLBACK criteria — invoke immediately when any apply:
  • Mongo error logs spike with `key_results` / `WeeklyGoal` / `Move` references
  • Stagewise drift between collection vs. pre-migration expectation
  • Frontend planning page renders empty / 500s for any tenant
  • Any user-reported "my weekly plan disappeared"
```

Don't try to "patch forward" mid-incident. Roll back, then triage offline.

---

## Pre-flight — ALWAYS before any destructive operation

```bash
# 1. Capture timestamp + git SHA at the moment of the operation
date -u +%Y%m%dT%H%M%SZ > .migration-checkpoint-timestamp
git rev-parse HEAD > .migration-checkpoint-sha

# 2. Backup affected collections
TIMESTAMP=$(cat .migration-checkpoint-timestamp)
mongodump \
  --uri="$MONGODB_URI" \
  --collection=goals \
  --collection=objectives \
  --collection=weeklygoals \
  --collection=moves \
  --collection=tasks \
  --collection=keyresults \
  --out="./backups/${TIMESTAMP}-pre-migration"

# 3. Verify backup integrity (file count + record count sanity)
ls -la "./backups/${TIMESTAMP}-pre-migration/$(basename $MONGODB_URI | cut -d? -f1)/"
```

If `mongodump` returns non-zero, **STOP**. Don't proceed without a verified backup.

---

## Rollback Recipe 1 — PX-3.7 Legacy Weekly Migration

### What it did

`scripts/db/migrate-legacy-weekly-to-new.js` (live mode) does the following per source `Goal{time_period:'WEEKLY', _migrated_to:!exists}` row, inside a `session.withTransaction()`:

1. Insert `WeeklyGoal` with upfront-generated `_id`
2. Insert one `Move` per non-cancelled child `Task`
3. `$set` `_migrated_to: <new WG _id>` + `_migrated_at: <now>` on the source `Goal`

### Rollback (post-execution, no backup needed)

The `_migrated_to` stamp is the rollback key — it points from source Goal → new WeeklyGoal. Walk that link backwards:

```js
// scripts/db/rollback-PX-3.7.js (write this when needed; template here)
// Per session.withTransaction(), one source ↔ one WG ↔ N Moves is atomic.
// Rollback reverses the transaction order: delete Moves → delete WG → unstamp source.

const Goal = require('../../server/models/Goal');
const WeeklyGoal = require('../../server/models/WeeklyGoal');
const Move = require('../../server/models/Move');

const stamped = await Goal.find({ _migrated_to: { $exists: true } }).lean();

for (const src of stamped) {
  const wgId = src._migrated_to;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Move.deleteMany({ weekly_goal_id: wgId }, { session });
      await WeeklyGoal.deleteOne({ _id: wgId }, { session });
      await Goal.updateOne(
        { _id: src._id },
        { $unset: { _migrated_to: '', _migrated_at: '' } },
        { session, strict: false }
      );
    });
  } finally {
    session.endSession();
  }
}
```

**Caveats**:
- If a `WeeklyGoal` row was manually edited post-migration (user added completions, changed status), the rollback discards those edits. Surface this risk to the user before rollback.
- If `_migrated_to` was manually altered (impossible via app code; only possible via direct mongo write), the rollback may delete the wrong WG. Verify a sample of `Goal{_migrated_to}` → `WeeklyGoal{_id}` matches before bulk delete.

### Rollback (with backup, full restore)

If transactional rollback is risky or the migration script crashed mid-batch:

```bash
TIMESTAMP=$(cat .migration-checkpoint-timestamp)
mongorestore \
  --uri="$MONGODB_URI" \
  --drop \
  --nsInclude="*.goals" \
  --nsInclude="*.weeklygoals" \
  --nsInclude="*.moves" \
  --nsInclude="*.tasks" \
  "./backups/${TIMESTAMP}-pre-migration"
```

`--drop` ensures any new WG/Move/source-stamp rows are removed before restore. **Application read traffic should be paused or routed elsewhere during restore** — restoring under live writes produces undefined state.

---

## Rollback Recipe 2 — PX-3.8 (`410 Gone` on legacy weekly write endpoints)

### What it does

Replaces the handler bodies at `server/routes/goals.js` POST/PUT/DELETE `/weekly/*` with `res.status(410).json({ ... })`.

### Rollback

```bash
git revert <commit-sha-of-PX-3.8>
git push origin development
```

Pure code revert — no data change. Render redeploys the previous handler logic. Affected window is bounded by the FE caller's request retry behavior. Risk: callers that already returned `410` to the user during the rollback window may need refresh prompts.

**Forward-fix preference**: if `410` is fielding hits from a known FE path that wasn't audited, prefer to update the FE caller and keep `410` in place over reverting. The whole point of `410` is to catch the missed caller; reverting hides the bug.

---

## Rollback Recipe 3 — PX-3.14 / PX-3.16 / PX-3.17 (code deletions)

### What they do

Delete code blocks (route handlers, helpers, projection logic).

### Rollback

```bash
git revert <commit-sha>
```

No data implications. The reverted commit restores the deleted code verbatim. Safe as long as no commits between the deletion and the revert depend on the deleted symbols — verify via `git log <commit-sha>..HEAD -- <affected-files>`.

---

## Rollback Recipe 4 — PX-3.15 (`deleteMany` legacy weekly rows)

### What it does

```js
db.goals.deleteMany({ time_period: 'WEEKLY', _migrated_to: { $exists: true } })
```

### Rollback

Pure data deletion — only rolled back from backup. The deleted rows have no in-app representation post-PX-3.14 (route block deleted) and post-PX-3.17 (projection helper deleted), so there is NO transactional or schema-aware way to reconstruct them in-process.

```bash
TIMESTAMP=<from pre-flight>
mongorestore \
  --uri="$MONGODB_URI" \
  --nsInclude="*.goals" \
  --writeConcern='{w:"majority"}' \
  "./backups/${TIMESTAMP}-pre-migration/<db-name>/goals.bson"
```

**DO NOT use `--drop` here** — the `goals` collection still has live `QUARTERLY` data; `--drop` would wipe those too. Restore appends only the missing `WEEKLY` rows (mongorestore is _upsert by default on _id_; existing `QUARTERLY` rows match by _id and stay intact).

Verify post-restore:

```js
db.goals.countDocuments({ time_period: 'WEEKLY', _migrated_to: { $exists: true } })
// Expected: same count as the pre-PX-3.15 dry-run audit
```

---

## Rollback Recipe 5 — PX-3.18 (schema field drop)

**HIGHEST-RISK rollback in registry.** This is a schema-validation change that propagates to every code path that reads `objective.key_results`.

### What it does

Removes the `key_results: [{...}]` subdoc schema field from `server/models/Objective.js`. After this commit, Mongoose strict mode silently strips any incoming `objective.key_results` on write, and reads return `undefined`.

### Rollback — code (immediate)

```bash
git revert <commit-sha-of-PX-3.18>
git push origin development
```

But code revert alone restores the schema field. Any data that was written DURING the PX-3.18 window (e.g., a new Objective created after the drop) has an empty `key_results` array on disk. The standalone `KeyResult` collection is the canonical source — code revert + the existing `ObjectiveKeyResultsView` helper will serve correct KRs from the collection automatically. No data restore is required for new Objectives.

### Rollback — data (only if pre-Sprint-22 legacy data was touched)

Pre-Sprint-22 Objectives have embedded `key_results` that have NOT been backfilled to the standalone collection (PX-3.7 covers `Goal{WEEKLY}` migration, not embedded-KR backfill). If a write touched such an Objective post-PX-3.18 and Mongoose stripped its embedded KRs:

```bash
TIMESTAMP=<from pre-flight>
mongorestore \
  --uri="$MONGODB_URI" \
  --nsInclude="*.objectives" \
  "./backups/${TIMESTAMP}-pre-migration/<db-name>/objectives.bson"
```

Same caveat as Recipe 4 — do NOT use `--drop`. mongorestore is upsert-by-_id; any post-PX-3.18 writes to Objective fields OTHER than `key_results` will be reverted to pre-PX-3.18 values. Surface this risk to the user.

### Pre-execution gate (mandatory)

Before PX-3.18 runs, all 9 fallback-reader sites in CLEANUP-REGISTRY entry PX-3.18 must be migrated to collection-only reads (mirror of the PX-3.6 macro slice pattern). Each site needs a drift-lock test. **If even one site still reads embedded as a fallback, PX-3.18 ABORTS** — the schema drop would silently break that path.

```bash
# Pre-flight grep
grep -rn "objective.key_results" server/ scripts/ \
  --include="*.js" \
  | grep -v "^[^:]*:[0-9]*:\s*//" \
  | grep -v "^[^:]*:[0-9]*:\s*\*"
# Expected output: ZERO lines outside of test/migration fixtures
```

If this returns anything in `server/routes/` or `server/services/`, **STOP** and migrate that reader first.

---

## Operational guardrails

### Observation window

Per CLEANUP-REGISTRY: each destructive step ships behind a real-user pilot observation window of **at minimum 1 calendar week** with 50-100 active users. The window's purpose is to surface any caller / FE / engine path that the audit missed. Shortened windows void the rollback recipes above (you may not have time to roll back before more users are affected).

### Kill switches

Each CLEANUP-REGISTRY entry carries a "Kill switch" line — the single check to run *before* executing that step. If the check returns non-zero state where it should return zero, the step does not run.

Re-confirm kill switches at:
- Cleanup-sprint kickoff (full sweep)
- Just-before-execution (per-step)
- 30 min post-execution (post-flight; verifies the deletion didn't reintroduce upstream state)

### Communication

Whoever runs a destructive cleanup operation:
- Posts in `#engineering` 15 min before execution with the step name + expected runtime + rollback recipe link
- Posts in `#engineering` immediately after with execution result + any observations
- Tags `@oncall` if rollback is invoked

---

## Future migrations — adding a new rollback recipe

When a new migration or destructive cleanup is added to CLEANUP-REGISTRY:

1. Add a numbered Recipe section above (mirror the structure: What it does → Rollback (transactional/script) → Rollback (with backup) → Caveats).
2. Cross-link from CLEANUP-REGISTRY entry's "Rollback" line back to this doc.
3. Update the decision tree at the top if the new step has unique kill-switch criteria.
4. If the new step is data-modifying and not transactional, REQUIRE a backup in the pre-flight section.

---

## Cross-references

- [CLEANUP-REGISTRY.md](CLEANUP-REGISTRY.md) — what to delete, in execution order
- [scripts/db/migrate-legacy-weekly-to-new.js](../../scripts/db/migrate-legacy-weekly-to-new.js) — PX-3.7 migration script
- [scripts/audit-cleanup-targets.js](../../scripts/audit-cleanup-targets.js) — verifies registry ↔ inline-marker sync
- [SPRINT-25-Plumbing/SPRINT25_MASTER_PLAN.md](1-SPRINTS/SPRINT-25-Plumbing/SPRINT25_MASTER_PLAN.md) — Sprint 25 source-of-truth task list
