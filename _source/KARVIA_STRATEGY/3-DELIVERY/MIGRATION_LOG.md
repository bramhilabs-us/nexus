# Migration Execution Log

<!-- @GENOME T2-OPS-003 | ACTIVE | 2026-05-11 | parent:T0-GOV-001 | auto:- | linked:/audit -->

**Purpose**: chronological log of every production-side migration script execution and its verification result. One section per execution. Newest at top.

**Format per entry**:
- **Execution**: command, environment (preprod/prod), git SHA, timestamp, stdout
- **Verification**: post-execution mongo queries + expected vs. actual + verdict

**Cross-references**:
- [CLEANUP-REGISTRY.md](CLEANUP-REGISTRY.md) — destructive cleanup targets
- [MIGRATION_ROLLBACK_PLAYBOOK.md](MIGRATION_ROLLBACK_PLAYBOOK.md) — rollback recipes
- Migration scripts live in [scripts/db/](../../scripts/db/)

---

## 2026-05-11 — PX-3.12 + PX-3.13 — Legacy Weekly Migration (pre-prod)

| Field | Value |
|---|---|
| Script | `npm run migrate:legacy-weekly` → `scripts/db/migrate-legacy-weekly-to-new.js` (live mode) |
| Environment | `karvia_business_preprod` (Atlas cluster0.lpzcrvy.mongodb.net) |
| Git SHA at execution | `1209dc3` (Sprint 25 Day 12 #226 — pre-PX-3.12 commit) |
| Operator | Day 12 #227 session |
| Sprint task | PX-3.12 (execution) + PX-3.13 (verification) — combined per Day 12 session plan |

### Execution log (PX-3.12)

```
$ npm run migrate:legacy-weekly

> karvia-business@1.0.0 migrate:legacy-weekly
> node scripts/db/migrate-legacy-weekly-to-new.js

Connecting to MongoDB...
Connected.

=== PX-3.7 Slice 1 — Legacy Weekly → WeeklyGoal (DRY-RUN AUDIT) ===
Database: cluster0.lpzcrvy.mongodb.net
Candidate filter: time_period='WEEKLY', status!='cancelled', _migrated_to NOT exists

No legacy weekly rows found. Migration would be a no-op.

Live mode: nothing to migrate. Exiting.

Exit code: 0
```

**Outcome**: clean no-op exit. Script's own guard at `main()` short-circuited before any write because `candidates.length === 0` (matches the 2026-05-11 pre-prod dry-run finding from PX-3.7 slice 1 / #222).

**Why no-op**: pre-prod was wiped of legacy weekly rows at some point prior to Sprint 25 (likely during disposable-test-data refreshes per `feedback_test_fixture_validation` user direction). The migration script artifact lives in the repo for the eventual production execution, where real legacy data may exist.

### Verification (PX-3.13)

Ran post-execution at `2026-05-12T02:11:56.171Z` via inline node script with mongoose-loaded models:

| ID | Query | Expected | Actual | Verdict |
|---|---|---|---|---|
| V1 | `Goal{time_period:'WEEKLY', status:!='cancelled', _migrated_to:!exists}.count()` (the candidate filter) | 0 | 0 | ✅ no unmigrated candidates remain |
| V2 | `Goal{_migrated_to:exists}.count()` (stamped sources) | 0 | 0 | ✅ no migration writes occurred (consistent with no-op) |
| V3 | `Goal{time_period:'WEEKLY'}.count()` (total legacy weekly) | 0 | 0 | ✅ pre-prod has zero legacy weekly rows |
| V4 | `WeeklyGoal.count()` (total) | 1 (unchanged) | 1 | ✅ no migration-created WG rows |
| V5 | `Move.count()` (total) | 0 (unchanged) | 0 | ✅ no migration-created Move rows |
| V6 | `KeyResult.count()` (sanity) | 11 (existing test data from PX-3.6 macro work) | 11 | ✅ unrelated KR collection untouched |

**Verdict**: ✅ **GREEN** — migration is a no-op on pre-prod. No state changed. PX-3.12 + PX-3.13 sealed.

### What this proves

- The migration script artifact is wired correctly (npm script → js → mongo connect → candidate query → no-op exit).
- The candidate-filter logic correctly returns zero against an empty source (no false positives that would have caused spurious WG/Move inserts).
- The "nothing to migrate" guard short-circuits cleanly before the confirmation prompt or any DB mutation.

### What this does NOT prove

- The live-write code path (`runLive` with WG insert + Task→Move conversion + source stamp) — this remains exercised exclusively by the mongodb-memory-server integration test (`scripts/test-sprint25-PX3.7-slice23-legacy-weekly-live.js`, 76/76 ✓). Production execution will be the first live-write exercise against real data, gated by the Sprint Cleanup pre-flight steps in [MIGRATION_ROLLBACK_PLAYBOOK.md](MIGRATION_ROLLBACK_PLAYBOOK.md).
- The orphan-KR FK guard. Pre-prod had no candidates, so the orphan path didn't activate. Integration test covers it; production execution will re-confirm.

### Implications for Sprint Cleanup (post-S28/S29)

When the cleanup sprint executes the destructive batch on production:
- **PX-3.7 prod execution** is a separate run — this 2026-05-11 pre-prod exercise does NOT count as the production migration.
- Pre-flight steps from rollback playbook MUST run before that prod execution: backup + git SHA capture + observation window scheduling.
- Production candidate count is unknown and may be 0 (if real users post-Sprint-22 never created legacy weekly rows via the not-yet-blocked `/api/goals/weekly/*` endpoints) or non-zero (if some FE path still wrote there). The dry-run is the definitive sizing tool.
