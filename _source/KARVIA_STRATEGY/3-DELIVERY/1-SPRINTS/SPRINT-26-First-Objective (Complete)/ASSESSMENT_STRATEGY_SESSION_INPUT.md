# Assessment Flow — Strategy Session Input

<!-- @GENOME T3-SPR-026-STRAT-INPUT | ACTIVE | 2026-05-12 | parent:T3-SPR-026-MP | auto:/strategy | linked:/coding -->
<!-- /strategy session resolved 2026-05-12 — Q6-Q13 locked, Workstream E firmed at 4 tasks (slimmed from 5 after minimal-change audit). -->

**Purpose**: Prep doc for the /strategy session that will resolve open assessment-flow questions and finalize S26 amendment scope (Workstream E).
**Status**: ✅ RESOLVED 2026-05-12 — see "Resolutions" section below.
**Triggered by**: /sprint-review extension on 2026-05-12 after live screenshot revealed SSI=5 vs empty mismatch on team-ssi-view.html.
**Canonical reference**: [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) (T2-ARC-023).

---

## ✅ Resolutions (locked 2026-05-12 in /strategy session)

| Q | Resolution | Audit ID |
|---|---|---|
| **Q5** | Latest-per-person → role-weighted average. Role-weighting already at [SSIScoringService.js:478-505](../../../../server/services/SSIScoringService.js#L478-L505); defaults to `config.SCORING.WEIGHTS`. | — |
| **Q6** | **(b) Versioned attempt** — new Assessment row per re-take; latest wins display; history via existing `retake_number` field. No new collection. | folded into E.4 |
| **Q7** | **Visibility matrix**: everyone sees company aggregate (motivational shared goal); per-person detail gated by hierarchy. Employee CANNOT invite. Manager invites anyone (bidirectional); sees own direct reports' detail + company aggregate. BO/Exec see everything in their company. Consultant sees managed clients. **Doc-only change** — current code already enforces. | A20260512-09 |
| **Q8** | **(a) Add `scoring_type` field now** to `AssessmentTemplate`, default `'SSI'`. Light dispatch wrapper in existing `OnboardingProgressService` (today's only type = SSI). | A20260512-08 |
| **Q9** | **Verify on a client with pending invites** in /coding preflight before E.1 work begins. ~15 min. | — |
| **Q10** | **Global-only for Beta-1.** Per-company custom templates → refinement-backlog as feature request (post-Beta-1). | refinement |
| **Q11** | **Drop new `AssessmentScoreLog` collection** — existing `Assessment` records (versioned per Q6) ARE the historical log. Compact projection via query select: `Assessment.find({company_id, status:'completed'}).select('user_id template_id ssi_result.dimensions completed_at')`. Introduce dedicated log post-Beta IF memory pressure shows up. | A20260512-10 (deferred) |
| **Q12** | **Canonical contract locked.** `OnboardingProgressService` is sole writer to `Company.assessment_scores` (existing). Write triggers: (a) Assessment completion, (b) User role change, (c) User deletion. Cascade-correctness proven by E.4 regression test. | A20260512-11 |
| **Q13** | **No hidden gates.** Workstream E (E.1) directly flips **SEC-7** green. FUN-6 + DOC-2 follow normal S26/S27 close + /deploy paths. Why/What/How/When framework applied — see /strategy session log. | — |

---

## Workstream E — FINAL SCOPE (4 firing tasks, ~1.75d)

Slimmed from 5 tasks after minimal-change verification revealed: existing `OnboardingProgressService` IS the rollup writer; `Assessment` versioning IS the history mechanism. No new service, no new collection.

| ID | Task | Audit ID | Est | Files |
|---|---|---|---|---|
| **S26-E.1** | Path A vs B unification: both `/team-breakdown` and `/dashboard-summary` read `Company.assessment_scores` (canonical) | A20260512-01 | 0.5d | `server/routes/assessments.js:692-815`, `server/routes/consultant.js:1408-1514` |
| **S26-E.2** | Fix `OnboardingProgressService` rollup: read `assessment.ssi_result.dimensions.*` instead of legacy `ssi_scores` + one-shot backfill | A20260512-02 | 0.5d | `server/services/OnboardingProgressService.js:51-86`, `scripts/db/backfill-assessment-scores-from-ssi-result.js` (NEW) |
| **S26-E.3** | Add `AssessmentTemplate.scoring_type` (default `'SSI'`) + light dispatch wrapper in rollup | A20260512-08 | 0.5d | `server/models/AssessmentTemplate.js`, `server/services/OnboardingProgressService.js` |
| **S26-E.4** | Cascade-correctness regression test — proves Q12 invariant | A20260512-11 | 0.25d | `scripts/test-sprint26-E.4-cascade-correctness.js` (NEW) |
| _(preflight)_ | Verify Q9 on client with pending invites | — | 0.25d | — (manual) |

**S26 total**: 18 + 4 = **22 firing tasks**.

**Retired from earlier proposals**:
- `CompanyAssessmentRollupService` (NEW) — `OnboardingProgressService` already exists
- `CanonicalRollupService` (NEW) — same
- `AssessmentScoreLog` collection — Assessment versioning suffices
- `A20260512-03` (MANAGER scope restriction) — bidirectional invites confirmed
- `A20260512-04` (re-take policy) — folded into Q6=b semantics + E.4 test

---

---

## What's already settled (no need to re-litigate)

| # | Topic | Resolution | Source |
|---|---|---|---|
| 1 | The 8-step flow is canonical | Locked | [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) |
| 2 | Invitations are bidirectional / role-agnostic | Locked — `routes/invitations.js:479-515` already parallel; no sequential chain | code-verified |
| 3 | No new models; rewire flow only | Locked | user direction 2026-05-12 |
| 4 | Two critical bugs (A20260512-01 + -02) must land in S26 | Locked — Workstream E in [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md) pending strategy session |
| 5 | Re-tire A20260512-03 (MANAGER scope restriction) | Locked — invites are bidirectional by design |
| **Q5** | **Rollup formula** | **latest-per-person → role-weighted average. Role-weighting already exists at [SSIScoringService.js:478-505](../../../../server/services/SSIScoringService.js#L478-L505) (`aggregateTeamScores(scores, roleWeights)`); defaults to `config.SCORING.WEIGHTS`.** Historical scores kept as compact log for memory efficiency (TBD: schema for the log — strategy session input). | user direction + code verified 2026-05-12 |

---

## Open strategy questions (for /strategy session)

### Q6 — Re-take semantics
If a person took SSI 6 months ago and gets re-invited:
- **(a) Overwrite** — one row per person per template, ever; new submit replaces prior.
- **(b) Versioned attempt** — new Assessment row, `retake_number` increments, latest wins display, history retained.
- **(c) Cycle-bound** — introduce `AssessmentCycle` concept (Q1 2026, Q2 2026); each cycle independent.
- **Claude's read**: (b) for S26 (no new models, supports Q5 "latest-per-person"). (c) is Sprint 28+ refinement.
- **Audit ID if landed**: `A20260512-04`.

### Q7 — Per-role visibility on results
Once `Company.assessment_scores` is canonical, who sees what?

| Role | Own results | Direct reports | All team members | Company aggregate SSI |
|---|---|---|---|---|
| EMPLOYEE | ? | n/a | ? | ? |
| MANAGER | ? | ? | ? | ? |
| BO / EXECUTIVE | ? | ? | ? | ? |
| CONSULTANT | n/a | n/a | ? | ? (managed clients) |

- **Claude's read**: everyone sees company aggregate (motivational, shared goal); per-person detail gated by hierarchy.
- **Audit ID if landed**: `A20260512-09`.
- **Also**: can an EMPLOYEE invite another person? Today, code does not gate this. Strategic answer needed.

### Q8 — `AssessmentTemplate.scoring_type` field
Add now or defer?
- **(a)** Add field now, default `'SSI'`, design rollup as dispatch-by-type. 1-field migration. Future-template-ready.
- **(b)** Skip; hardcode SSI; add field when 2nd template exists.
- **Claude's read**: (a) — cheap, aligns with "future, we can add any other assessments" intent. Doesn't change S26 effort materially.
- **Audit ID if landed**: `A20260512-08`.

### Q9 — Verify on a different client
Screenshot client had `ASSESSMENTS=2, 0 pending` (all completed). The bug is the read-path, not data. Should Claude verify behavior on a client with **pending** invitations to confirm there's no second bug?

### Q10 — Template management
- Today: looks like global SSI template seeded via `seed:mece` (one template for all companies). Confirm?
- Future: per-company custom templates? Consultant-authored?
- **Claude's read**: global-only for Beta. Per-company is post-Beta. Confirm?

### Q11 (NEW) — Historical scoring log
User direction Q5: "keep historical score as a log with very limited information for better memory usage."
- What goes in the log: `{user_id, template_id, completed_at, ssi_dimensions:{s,s,i}, overall_score}` (compact, no answers)?
- Where does the log live: separate `AssessmentScoreLog` collection, or `Assessment.history[]` subdoc, or computed-from-Assessment.retake_number chain?
- Retention: forever, or N quarters?
- **Claude's read**: separate collection `AssessmentScoreLog` with TTL index (e.g. 8 quarters); compact docs; written by Step 5 scoring service on every completion; never overwritten.
- **Audit ID if landed**: `A20260512-10` (likely Sprint 27+, but log schema decision is strategic).

### Q12 (NEW) — `Company.assessment_scores` canonical contract
- What fields, exactly, live in `Company.assessment_scores`? Today: `speed_score, strength_score, intelligence_score, overall_readiness`. Plus `last_updated_at`?
- Who writes? Only `CanonicalRollupService`. Fire when? On every `Assessment` completion + on every member-role change (since role-weighting depends on roles).
- This is the "source of truth" contract — must be locked before Workstream E ships.

### Q13 (NEW) — Beta-launch readiness for assessment flow
From `BETA_LAUNCH_CHECKLIST.md` (PX-5.2 #230), what gates touch assessment flow?
- `FUN-2/3` mention 5-verb test including Engage + Diagnose
- `SEC-2` multi-tenant isolation lint
- `COH-2` dry runs
- Confirm: with Workstream E (E.1 + E.2) shipped, do all assessment-touching Beta gates flip green? Or are there hidden ones?

---

## Documents to load for /strategy session

The /strategy skill should auto-load these (or Claude loads them at session open):

### AUTO (read at session start)
| Doc | Path | Why |
|---|---|---|
| **Assessment lifecycle canonical** | [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) | Just locked — the 8-step model |
| **This input doc** | (this file) | Question list + settled items |
| **S26 Master Plan** | [SPRINT26_MASTER_PLAN.md](SPRINT26_MASTER_PLAN.md) | Current sprint scope |
| **S26 Page Matrix** | [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md) | Workstream A/B/C/D + pending E |
| **S25 Retro** | [../SPRINT-25-Plumbing/SPRINT25_RETRO.md](../SPRINT-25-Plumbing/SPRINT25_RETRO.md) | Action items A1-A5 + memory candidates |
| **Beta Launch Checklist** | [../../BETA_LAUNCH_CHECKLIST.md](../../BETA_LAUNCH_CHECKLIST.md) | Q13 — gates that touch assessment |

### LINKED (load on demand)
| Doc | Path | Why |
|---|---|---|
| Persona Stage Ownership Matrix | `KARVIA_STRATEGY/1-PRODUCT/PERSONA_STAGE_OWNERSHIP_MATRIX.md` | Stage-of-development context |
| KR Aggregation + Lifecycle Audit | `KARVIA_STRATEGY/2-TECHNICAL/KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md` | S27 KR-aggregation depends on canonical company score |
| Sprint X Verification | `KARVIA_STRATEGY/2-TECHNICAL/SPRINT_X_VERIFICATION.md` | Phase 1 verification outputs |
| Email Deep Link Contract | `KARVIA_STRATEGY/2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md` | Dispatcher integration points |
| Audit Tracker | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md` | A20260512-* IDs need scoping decisions |
| Ecosystem Architecture | `ECOSYSTEM_ARCHITECTURE.md` | YSELA/KARVIA/iBrain layering |
| YSELA Philosophy | `YSELA/philosophy/YSELA_PHILOSOPHY.md` | "Why measure SSI" foundational framing |

### Stage-of-development context
- **Current stage**: Beta launch prep. Sprint 26 (activation half) + Sprint 27 (execution half) gate Beta-1.
- **What must be true to launch Beta-1**: 39 gates in `BETA_LAUNCH_CHECKLIST.md` (6 categories: Functional/CodeQuality/Perf-Ops/Security/Cohort/Documentation).
- **Cohort size locked**: <50 paying users, <10 client companies, consulting-mode first.
- **Stage gate from now → Beta-1**: complete S26 + S27 at acceptance criterion; flip all 39 checklist gates.

---

## Session agenda (suggested)

1. **Confirm settled items** (Q5 + 5-row table at top) — 5 min
2. **Resolve Q6 (re-take)** — strategic; affects model; ~10 min
3. **Resolve Q7 (visibility matrix)** — strategic; affects UX across all 5 roles; ~15 min
4. **Resolve Q8 (`scoring_type` field)** — architectural future-proofing; ~5 min
5. **Resolve Q10 (template management)** — scoping for Beta; ~5 min
6. **Resolve Q11 (historical log schema)** — design ~10 min
7. **Resolve Q12 (canonical contract)** — lock the contract for Workstream E ~10 min
8. **Resolve Q13 (Beta-launch readiness)** — gate-by-gate confirmation ~10 min
9. **Q9 verification action** — assign to next /coding session ~2 min

**Total**: ~75-90 min session.

---

## Outputs the strategy session should produce

1. Q6-Q13 answers → recorded in this doc or [SPRINT26_HANDOFF_DOCUMENT.md](SPRINT26_HANDOFF_DOCUMENT.md)
2. Updated [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md) — Workstream E firm scope
3. Updated [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) — A20260512-01 description rewrite + new IDs (-04, -08, -09, -10) with scoping decisions
4. Optional: updated [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) — fold in any architectural decisions from Q6/Q8/Q11/Q12
5. /strategy session entry in [SESSION_LOG.md](../../../../.claude/SESSION_LOG.md)

---

## Sign-off

Strategy session input prepared 2026-05-12 in /sprint-review extension. Ready to launch via `/strategy`.
