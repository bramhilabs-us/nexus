# Epic 24.6 — Migration: Company Stages + Objective Lifecycle Seeding

<!-- @GENOME T3-SPR-024-EPIC-6 | ACTIVE | 2026-05-06 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 1-2
**Priority**: P0 (must run before Epic 24.3 + Epic 24.1 code goes live in dev)
**Audit IDs**: none owned directly. Spec amendments below are in-session grounding-check findings (#198) not covered by the cross-sprint audit; partial down-payment on `A20260506-13` Group 7 (Lifecycle writer pattern) via the lifecycle_stage schema add.
**Status**: ✅ SHIPPED #198 (2026-05-06)

---

## Goal

One-shot migration script that runs against dev/pre-prod databases (NOT production — clean launch post-May 15) to:
1. Collapse the 7-stage `Company.stage` enum to **6** canonical stages (`prospect/onboarding/active/paused/churned/completed`) [amended #198 — 6 stages, see Spec Amendments below]
2. Seed `Objective.lifecycle_stage` (the canonical 6-stage enum from F-1) for existing objectives
3. Add `Objective.lifecycle_stage` + `lifecycle_history[]` schema (sequencing fix #198 — schema must exist before seed)
4. Print pre-migration audit summary

**Production**: NOT migrated. Per A9 — clean launch post-May 15.

## Spec Amendments (#198, 2026-05-06)

Three amendments locked at start of #198 implementation after grounding-check against actual code/data:

### Amendment 1 — 6-stage canonical (was 5)
User decision (#198): add `completed` as 6th stage so successfully-delivered engagements are distinguishable from `churned`. Future stage additions are easy via `server/constants/companyStages.js` (single source of truth).

### Amendment 2 — Mapping table corrected against actual `Company.stage` enum
Spec mapping table (lines 44-52, original) referenced `active`/`at_risk`/`inactive` as "old" values — these were **never in the enum** ([Company.js:83](../../../../../server/models/Company.js#L83) actual: `prospect/onboarding/objective_identified/handed_off/in_progress/completed/sustained`). Mapping replaced with `LEGACY_TO_CANONICAL` constant in `server/constants/companyStages.js`. Audit (preprod, 76/83 rows had `null` stage) confirmed the migration is mostly a backfill of `null → prospect`.

Final mapping (canonical 6 + null backfill):

| Current value | Canonical | Why |
|---|---|---|
| `null` / unset | `prospect` | Backfill default per Company.js:84 |
| `prospect` | `prospect` | unchanged |
| `onboarding` | `onboarding` | unchanged |
| `objective_identified` | `active` | Master plan line 66 — rename trigger lands in 24.1 |
| `handed_off` | `active` | Engagement in flight |
| `in_progress` | `active` | Engagement in flight |
| `sustained` | `completed` | Was speculative "successfully delivered" |
| `completed` | `completed` | unchanged |

### Amendment 3 — Sequencing: 24.6 adds the schema (option a)
Original spec said "seed lifecycle_stage" but `Objective.lifecycle_stage` field didn't exist — Epic 24.3 introduces it, but master plan line 162 says 24.3 depends on 24.6. Resolution: Epic 24.6 adds the schema (`lifecycle_stage` enum + `lifecycle_history[]`). Epic 24.3 still owns the writer service + transition triggers + UI.

### Amendment 4 — Transitional enum during 24.6 → 24.1 window
Until Epic 24.1 renames `StageTransitionService.js:130` (`'objective_identified'` → `'active'`) and drops legacy enum values, `Company.stage` accepts both canonical and legacy values via `ALL_STAGES_TRANSITIONAL` (10 values). After 24.1 ships, switch enum to `STAGES` (6 canonical) — one-line change.

### Amendment 5 — Corrected file paths (3 moves, not 2)
Original spec named `seed-assessments.js` + `validate-assessments.js` at root. Reality: chained 2-file seed + standalone validate at different paths. Corrected:
- `server/seeds/seedAssessmentQuestions.js` → `scripts/db/seed-assessment-questions.js`
- `server/seeds/seedDefaultTemplates.js` → `scripts/db/seed-default-templates.js`
- `scripts/validateSeededData.js` → `scripts/db/validate-seeded-data.js`

`package.json` `seed:assessments` retains chain syntax (`&&`); `seed:questions`, `seed:templates`, `validate:assessments` updated. Hygiene: 2 error-message references in `server/scripts/seedAnalyticsData.js` + `seedIndustryTemplates.js` updated to use npm-script names (no path coupling). Doc reference in `KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/backend_architecture.md:123` updated.

## Locked Decisions

### F-5 — Path: `scripts/db/`
- Migration script lives at `scripts/db/migrate-stages-and-lifecycle.js`
- Behavior-based naming (no sprint number, no date)
- Existing seed/validate scripts ALSO move into `scripts/db/`:
  - `scripts/db/seed-assessments.js`
  - `scripts/db/validate-assessments.js`
- `package.json` paths updated for `seed:assessments` and `validate:assessments` npm scripts
- Verify both npm scripts work post-move

### F-1 alignment — seed `lifecycle_stage` not `ball_state`
- Objective field is `lifecycle_stage` (6-stage enum: `identified / kr_breakdown / in_execution / completion_review / completed / sustained_mode`)
- Migration seeds initial value based on existing data (rules below)

### Idempotency + auditability
- Idempotent (safe to re-run)
- Writes to `Company.stage_history[]` and `Objective.lifecycle_history[]` with `triggered_by_kind='migration_2026_05'`
- Pre-migration audit: lists currently-`at_risk` companies + their computed `health` value side-by-side (Risk R5 mitigation)
- Production guard: aborts if `NODE_ENV='production'`
- Connection-string check against known prod patterns

## Migration Mappings

### Company stage (legacy → canonical 6) — superseded by Spec Amendment 2 above
See `server/constants/companyStages.js` for the live `LEGACY_TO_CANONICAL` table. Original 7→5 table moved to amendment block.

### Objective lifecycle_stage seeding (NEW field)
For each existing Objective:
- If `Objective.status === 'completed'` → `lifecycle_stage = 'sustained_mode'`
- Else if `Objective.owner_id` is set AND owner.role !== 'CONSULTANT' AND ≥1 KR exists AND ≥1 WG/Move exists → `lifecycle_stage = 'in_execution'`
- Else if ≥1 KR exists → `lifecycle_stage = 'kr_breakdown'`
- Else → `lifecycle_stage = 'identified'`

Each migrated Objective writes one entry to `lifecycle_history[]` with `triggered_by_kind='migration_2026_05'`.

## Acceptance Criteria

### Folder reorganization (F-5)
- [ ] NEW folder `scripts/db/` exists
- [ ] NEW file `scripts/db/migrate-stages-and-lifecycle.js`
- [ ] MOVE `seed-assessments.js` → `scripts/db/seed-assessments.js`
- [ ] MOVE `validate-assessments.js` → `scripts/db/validate-assessments.js`
- [ ] `package.json` `seed:assessments` and `validate:assessments` paths updated
- [ ] Verify both npm scripts work after move

### Migration script behavior
- [ ] Idempotent — re-running after first success is no-op (detect via existing `migration_2026_05` history entries)
- [ ] Pre-migration audit prints company counts per old stage, objective counts per (status × seeded-lifecycle), `at_risk` companies + computed health
- [ ] User must press Enter (or pass `--yes`) to proceed past audit
- [ ] Aborts if `NODE_ENV='production'`
- [ ] Override flag: `--force-prod` allowed but prints scary warning + 5-second sleep
- [ ] Final summary: "Migrated X companies, Y objectives in Zms"
- [ ] Errors collected per-document; printed at end with each error's `_id`

### Stage migration
- [ ] All 7 old stages map correctly to 5 new ones (exact mapping table)
- [ ] Each migrated company writes one entry to `stage_history[]` with `triggered_by_kind='migration_2026_05'`

### Lifecycle seeding
- [ ] All Objectives get `lifecycle_stage` set per the 4 rules
- [ ] Each migrated Objective writes one entry to `lifecycle_history[]`

## Tests

NEW `scripts/test-sprint24-246-migration.js`:
- Runs against in-memory MongoDB seeded with 7-stage companies + varied objectives
- All 7 stage values map correctly to 5
- `at_risk` companies report with health computation in audit output
- Objective lifecycle seeding obeys 4 rules:
  - completed → sustained_mode
  - owner+KRs+WG → in_execution
  - KRs only → kr_breakdown
  - else → identified
- `stage_history[]` and `lifecycle_history[]` written with correct `triggered_by_kind`
- Re-run is idempotent
- Production env-var triggers abort
- `--force-prod` requires confirmation pause
- Final summary counts match seeded counts

Target: ~25-30 assertions.

## Implementation Notes (#198 final)

### Files created
- `server/constants/companyStages.js` (NEW — single source of truth: `STAGES`, `LEGACY_STAGES`, `ALL_STAGES_TRANSITIONAL`, `LEGACY_TO_CANONICAL`, `TRANSITIONS`, `META`)
- `server/constants/objectiveLifecycle.js` (NEW — `STAGES`, `TRANSITIONS`, `CONSULTANT_BALL_VIEW`, `META`)
- `scripts/db/migrate-stages-and-lifecycle.js` (NEW — idempotent, dry-run, prod-guard, --force-prod escape hatch)
- `scripts/db/audit-stage-distribution.js` (NEW — read-only pre-migration audit; `npm run audit:stage-distribution`)
- `scripts/test-sprint24-246-migration.js` (NEW — 45 in-memory mongo assertions)

### Files moved (3)
- `server/seeds/seedAssessmentQuestions.js` → `scripts/db/seed-assessment-questions.js`
- `server/seeds/seedDefaultTemplates.js` → `scripts/db/seed-default-templates.js`
- `scripts/validateSeededData.js` → `scripts/db/validate-seeded-data.js`

### Files modified
- `server/models/Company.js` — `stage.enum` sourced from `ALL_STAGES_TRANSITIONAL`; comment-block trigger doc updated (`onboarding → active`)
- `server/models/Objective.js` — added `lifecycle_stage` (indexed, default `'identified'`) + `lifecycle_history[]` mirroring `Company.stage_history[]`
- `package.json` — 3 npm seed paths + new `migrate:stages-and-lifecycle` + `audit:stage-distribution`
- `server/scripts/seedAnalyticsData.js`, `server/scripts/seedIndustryTemplates.js` — error-message hygiene
- `KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/backend_architecture.md` — doc tree path updated

### Run instruction (in script header)
```bash
# Dev
NODE_ENV=development MONGODB_URI=mongodb://localhost:27017/karvia_dev \
  node scripts/db/migrate-stages-and-lifecycle.js

# Pre-prod (after first verifying connection)
NODE_ENV=preprod MONGODB_URI=$PREPROD_MONGODB_URI \
  node scripts/db/migrate-stages-and-lifecycle.js

# Production (DO NOT RUN per A9 — clean launch post-May 15)
```

### Surgical reuse
- ✅ `Company.stage_history[]` schema (S22a #184e)
- ✅ Mongoose connection patterns from existing scripts

### What's net new
- 1 script
- 1 mapping rule set for stages
- 1 mapping rule set for lifecycle seeding
- Folder reorganization

## Out of Scope

- Production data migration (A9 — clean launch instead)
- Deletion of legacy fields/collections (Phase C work — S25 Epic 25.2)
- Any cascade-related migration (Phase B — S25 Epic 25.1)
