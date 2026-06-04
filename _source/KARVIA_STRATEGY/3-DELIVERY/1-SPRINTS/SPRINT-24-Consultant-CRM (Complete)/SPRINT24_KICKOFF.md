# Sprint 24 — Kickoff Prompt

<!-- @GENOME T3-SPR-024-KICKOFF | ACTIVE | 2026-05-04 | parent:T3-SPR-024-MP | auto:- | linked:/coding -->

**Use**: paste this into a new `/coding` session to begin Sprint 24 Session A.

---

## Sprint Context

Sprint 24 — Consultant CRM. Goal: turn the My Clients page into the consultant's operating surface so they can retire their tracking spreadsheet. 23-29 pts across 7 epics, ~5-7 sessions.

Read these documents for full context:
- [SPRINT24_MASTER_PLAN.md](./SPRINT24_MASTER_PLAN.md) — sprint goal, 5-verb acceptance test, epic breakdown
- [SPRINT24_DAILY_EXECUTION_PLAN.md](./SPRINT24_DAILY_EXECUTION_PLAN.md) — session sequence + dependencies
- [SPRINT24_DEPENDENCIES_RISKS.md](./SPRINT24_DEPENDENCIES_RISKS.md) — risks + mitigations

---

## Session A — Discovery + Migration

**Epics**: 24.7 (Bug Sweep) + 24.6 (Migration script)
**Pts**: 2 + 1 = 3
**Sequence rationale**: discovery first; migration enables Sessions B-G to work on the new schema.

### Epic 24.7 — Bug Sweep

Read [EPIC_24-7_BUG_SWEEP.md](./epics/EPIC_24-7_BUG_SWEEP.md).

**Tasks**:
1. Audit the KR creation flow end-to-end on dev:
   - Verify `POST /api/key-results` works for BUSINESS_OWNER and (if writable) for CONSULTANT
   - Verify `POST /api/objectives` dual-write of standalone `KeyResult` docs (S23 #190)
   - Verify `Objective.virtual('key_results_v2')` returns dual-written KRs
   - If broken: scope fix, ship it, regression test
   - If clean: write a 1-paragraph "no-issue-found" note in the handoff
2. Diagnose the enrich endpoint (`POST /api/consultant/clients/enrich`):
   - Reproduce the failure (S22 watch-item flagged this on karvia-business-1)
   - Inspect logs for actual failure mode
   - If our code: fix + regression test
   - If upstream/config: document graceful-fallback as expected behavior

**Output**: `scripts/test-sprint24-247-bug-sweep.js` (~15-25 assertions).

### Epic 24.6 — Migration

Read [EPIC_24-6_MIGRATION.md](./epics/EPIC_24-6_MIGRATION.md).

**Tasks**:
1. Write `server/scripts/migrate-stages-and-ball-states.js`:
   - Idempotent
   - Audit pass before mutation (lists `at_risk` companies + computed health)
   - Production guard (`NODE_ENV` check)
   - Stage mapping (7 → 4) + Objective ball_state seeding (3 rules)
   - Writes to history with `triggered_by='migration_2026_05'`
2. Write tests: `scripts/test-sprint24-246-migration.js` (~25-30 assertions).
3. Run script against dev DB after tests pass; verify post-state.

### Session A Exit Criteria

- ✅ KR creation works end-to-end on dev (or bug fixed and verified)
- ✅ Enrich finding documented (clean / fixed / graceful-fallback)
- ✅ Dev DB has all companies on 5-stage enum (`prospect`, `onboarding`, `active`, `paused`, `churned`)
- ✅ Dev DB has all objectives with seeded `ball_state`
- ✅ S22a + S23 regression: 184a (55) + 184e (36) + phase3-3 (9) + 188 (39) + 190 (76) all green

After Session A, run `/close` to update handoff + log, then begin Session B (Tile + Stage).

---

## Architectural Invariants (must hold every session)

- ✅ Zero executable `switch-company` callers in `client/pages/scripts/`
- ✅ LLMGateway sole executable OpenAI chokepoint
- ✅ All consultant data access goes through `requireManagedClient` middleware
- ✅ StageTransitionService sole writer of `Company.stage`
- ✅ BallStateService sole writer of `Objective.ball_state` (introduced Session D)
- ✅ `Objective.consultant_notes` excluded from owner-facing GET routes (Risk R7)
- ✅ No new role-check sites in `client/` outside the 22 sites locked by phase3-3 lint

---

## After Session A: Recommended next session

**Session B — Tile + Stage** (Epic 24.1, 3-4 pts).

Open `EPIC_24-1_TILE_AND_STAGE.md` and proceed.

---

## Hand-off pattern

Each session follows: read context → implement per epic spec → test → re-run rolling regression → update handoff → `/close`.

Sprint closes at Session G with `/sprint-review` + folder rename to `SPRINT-24-Consultant-CRM (Complete)`.
