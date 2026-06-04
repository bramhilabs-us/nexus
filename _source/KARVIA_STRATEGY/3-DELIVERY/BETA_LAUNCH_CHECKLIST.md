# Beta-1 Launch Checklist

<!-- @GENOME T2-GOV-011 | ACTIVE | 2026-05-12 | parent:T1-PRD-009 | auto:/strategy,/deploy | linked:/audit,/coding -->

**Version**: 1.0
**Created**: 2026-05-12 (Sprint 25 PX-5.2)
**Audit ref**: `A20260506-10` — Cross-sprint audit S24-S27, [Group 8a + 8d](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md) (8d folded into 8a)
**Purpose**: Single source of truth for Beta-1 launch readiness. Sprint 27 close = Beta becomes *possible*; this checklist gates the `/deploy` decision that turns possibility into action.

---

## How this works

- Each gate has a **stable code** (e.g. `FUN-1`), **concrete pass criterion**, **owner**, and **verification method** (manual / scripted / monitored).
- A gate is GREEN only when the criterion is **observable today** — not when it's "scoped" or "in progress." Stale GREENs are the failure mode this doc exists to prevent.
- All six categories must be GREEN before `/deploy` runs. No partial launches.
- The checklist is **scoped to Beta-1** (consulting cohort, <50 paying users). Beta-2 (self-serve scale, public marketing) has a separate checklist authored after Beta-1 ships.

---

## Beta-1 Scope (locked)

- **Cohort**: consulting cohort first — consultants invite BOs into managed workspaces. Self-serve cohort dedicated work deferred post-Beta-1 ([Group 3d](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md)).
- **Journey**: full activation + execution — first Objective created (S26) → first Task completed (S27) → KR-aggregation cron observes 100% (S27 dispatcher 5).
- **Personas**: Consultant, BO, Manager, Executive, Employee — all five must complete their slice of the 5-verbs without out-of-band intervention.
- **Size**: <50 active users across <10 client companies. Above that = re-baseline checklist (Beta-2 territory).

---

## Gate Category 1 — Functional Completeness (`FUN-*`)

Sprint-row consolidation of S26 + S27 acceptance. Each sprint's 5-verb test must pass end-to-end, on preprod, with **zero out-of-band intervention**.

| Gate | Source | Pass criterion | Owner | Verification |
|---|---|---|---|---|
| `FUN-1` | S26 Path A (consulting) | `Onboard → Engage → Diagnose → Author → Hand-off` succeeds on a fresh client; Manager email lands; `Objective.lifecycle_stage='kr_breakdown'` for the first Objective. | Eng (S26 owner) | Manual run on preprod; record run-id in `MIGRATION_LOG.md` style ledger |
| `FUN-2` | S26 Path B (self-serve) | Same 5-verbs without a consultant in the loop; BO uses wizard or atomic create. | Eng | Manual run on preprod |
| `FUN-3` | S27 5-verbs | `Plan → Notify → Execute → Complete → Aggregate` succeeds from S26 end-state; KR-aggregation cron flips `lifecycle_stage` to `completion_review` when all KRs hit 100%. | Eng (S27 owner) | Manual run on preprod, including cron tick |
| `FUN-4` | Dispatchers 1-5 | All five S26 Workstream B dispatchers fire on their triggers (auto + manual nudge path); each carries a deep-link conforming to [`EMAIL_DEEP_LINK_CONTRACT.md`](../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md). | Eng | Inbox check + DB assert (`notifyTransition()` audit log) |
| `FUN-5` | Receive-side `<NextStep>` | Every email deep-link, when clicked, lands the recipient on the page with the dispatcher-specific CTA rendered. No "dead emails." | Eng | Click-test on preprod for each dispatcher × persona row |
| `FUN-6` | Zero ball-drop | Every actor's first session post-handoff has a clear next action on the page they land on. No persona lands on an empty surface. | Product | 5 × 5 persona × stage matrix walked manually |

---

## Gate Category 2 — Code Quality (`CQ-*`)

Lifted from S25 invariants + S27's "prompt regression suite GREEN" gate.

| Gate | Source | Pass criterion | Owner | Verification |
|---|---|---|---|---|
| `CQ-1` | S25 Phase 3 | Single-write contract: no embedded `Objective.key_results[]` writes anywhere in `server/`; `KeyResult` collection is sole write target. | Eng | `scripts/test-sprint25-PX3.10-single-write-regression.js` 38/38 ✓ |
| `CQ-2` | S25 PX-3.7 + S25 Cleanup | Legacy WEEKLY-in-`goals` retired (or empty); WeeklyGoal collection is the sole WEEKLY surface. | Eng | `npm run audit:cleanup-targets` GREEN + `goals.find({time_period:'WEEKLY'})` count = 0 on prod |
| `CQ-3` | S27 invariant | Prompt regression fixture suite (S25 PX-5.3) GREEN against every prompt in `server/prompts/`. | Eng | `npm run test:prompt-regression` 100% pass |
| `CQ-4` | Cross-sprint audit Group 2a | `notifyTransition()` is the sole transition-email entry point; no event-bus, no listener-registry abstraction. | Eng | Grep for `events.emit` / `EventEmitter` in `server/services/` — zero hits beyond pre-existing infra |
| `CQ-5` | S24 invariant | `LifecycleTransitionService` + `StageTransitionService` are sole stage-state writers. | Eng | Grep + lint allow-list |
| `CQ-6` | Cross-sprint Group 6 (LLMGateway) | `LLMGateway` is sole AI chokepoint; no direct OpenAI client construction outside the gateway. | Eng | Grep `require\(.openai.\)` in `server/` excluding gateway file |
| `CQ-7` | RBAC discipline | `requireRole()` + `requireManagedClient` on every consultant-touching route; no new role-check sites outside the phase3-3 lint allow-list. | Eng | Lint job in CI |

---

## Gate Category 3 — Performance + Operations (`OPS-*`)

| Gate | Source | Pass criterion | Owner | Verification |
|---|---|---|---|---|
| `OPS-1` | Render uptime | App uptime ≥99.5% over the 7 days before launch (preprod proxy for prod). | Ops | Render dashboard |
| `OPS-2` | Mailjet uptime | Mailjet send health ≥99.9% over the 7 days before launch; no batched outage queue in scope for Beta-1 ([Group 5b](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md) — built only if scale demands). | Ops | Mailjet dashboard + sample 10 sends/day from preprod |
| `OPS-3` | `dailyDigestJob` health | Job runs daily without failure for 7 consecutive days on preprod. | Eng | Log inspection |
| `OPS-4` | KR-aggregation cron observability | Logging + alerting on cron failure ([H-T8-1 covered by S27](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md)); no silent failures. | Eng | Forced-failure drill; alert observed |
| `OPS-5` | DB connection health | MongoDB connection pool stable under 50-user simulated load. | Eng | k6 / autocannon smoke test |
| `OPS-6` | Rollback ready | [`MIGRATION_ROLLBACK_PLAYBOOK.md`](MIGRATION_ROLLBACK_PLAYBOOK.md) covers every Sprint Cleanup destructive step (PX-3.8 / 3.14-3.18); pre-execution `mongodump` procedure documented. | Eng | Doc audit — already shipped S25 PX-3.11 |
| `OPS-7` | Render env config | Three environments distinct: `APP_URL` set correctly per env (dev / preprod / prod); no cross-env link bleed. | Ops | `EMAIL_DEEP_LINK_CONTRACT.md` §1 grep against env panels |

---

## Gate Category 4 — Security (`SEC-*`)

| Gate | Source | Pass criterion | Owner | Verification |
|---|---|---|---|---|
| `SEC-1` | CLAUDE.md fail-fast | `JWT_SECRET` is set (not the fallback) on prod; fail-fast check in `server/index.js` is intact. | Ops | Deployment check; intentional misconfig drill on staging |
| `SEC-2` | Multi-tenant isolation | Every consultant-touching route filters by `company_id` or uses `requireManagedClient`. No exception files. | Eng | Lint + audit grep |
| `SEC-3` | XSS discipline | All user-input rendering goes through `escapeHtml()` (or framework equivalent). New code from S26/S27 audited. | Eng | Grep `innerHTML.*\${.*req\.body\|user\..*}` — zero hits |
| `SEC-4` | Auth-token hygiene | Storage-key fragmentation audit (`A20260507-01..04`) regressions GREEN; no legacy storage-key writes. | Eng | `test-sprint24-204-storage-key-cleanup.js` 23/23 ✓ |
| `SEC-5` | Production secrets | No hardcoded secrets in source; `.env` files not committed; Render env panel is the sole source of truth. | Ops | Grep for `sk-`, `pk_live_`, `mongodb+srv://` in committed code |
| `SEC-6` | Cross-env link isolation | Email links from preprod never point at prod (and vice versa); `APP_URL` single source per env. | Eng | Manual click-test: trigger an email on preprod, confirm host = `karvia-business-2` |
| `SEC-7` | Consultant authorization | `A20260512-01` (consultant cannot view client assessments) root-caused and fixed OR explicitly accepted as a Beta-1 known issue with workaround. | Eng | Master tracker entry — flag must be 💻 OR explicit owner-decision recorded |

---

## Gate Category 5 — Beta-1 Cohort Setup (`COH-*`)

| Gate | Source | Pass criterion | Owner | Verification |
|---|---|---|---|---|
| `COH-1` | Consultant readiness | Beta-1 consultant cohort identified (3-5 named consultants per [`BETA_FINAL_STRATEGY_2026.md`](../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) line 579). | Product | Named list signed off |
| `COH-2` | Consultant onboarding | Each cohort consultant has completed a dry run of `Onboard → Engage → Diagnose → Author → Plan → Execute → Complete` against a test client on preprod. | Product | Run-log per consultant |
| `COH-3` | Client cohort plan | <10 client companies per consultant; total <50 active users at Beta-1. | Product | Cohort spreadsheet |
| `COH-4` | Support comms | Slack / email channel for cohort support staffed during business hours; SLA documented (response within 4 business hours for Beta-1). | Product | Channel exists; rota published |
| `COH-5` | Opt-out path | Every cohort user has an opt-out path — explicit "leave Beta" or workspace deletion procedure. | Product | Documented in runbook |
| `COH-6` | Feedback channel | In-product feedback CTA or external form linked from at least the consultant workspace + BO dashboard. | Product | Visible link |

---

## Gate Category 6 — Documentation (`DOC-*`)

| Gate | Source | Pass criterion | Owner | Verification |
|---|---|---|---|---|
| `DOC-1` | User-facing onboarding | Cohort consultants have a 1-page "what's in Beta-1, what isn't" sheet (must-have features vs known-deferred). | Product | Doc exists; reviewed |
| `DOC-2` | Support runbook | Common-issue triage doc covering the top 10 expected user errors (assessment stuck, invitation token expired, email not received, etc). | Product/Eng | Doc exists |
| `DOC-3` | Incident response | On-call protocol + escalation path documented; primary + secondary identified. | Ops | Doc exists |
| `DOC-4` | Rollback playbook | [`MIGRATION_ROLLBACK_PLAYBOOK.md`](MIGRATION_ROLLBACK_PLAYBOOK.md) (S25 PX-3.11) + a Beta-launch-specific rollback section (Render env-flip procedure, DB-restore procedure, cohort-comms template). | Eng | Doc exists |
| `DOC-5` | Refinement-backlog clarity | [`REFINEMENT-BACKLOG/`](1-SPRINTS/REFINEMENT-BACKLOG/README.md) classifies every item as must-before-Beta or nice-after-Beta (S25 PX-5.4). | Product | Already shipped — count must-before-Beta = 0 at launch |
| `DOC-6` | Deploy procedure | `/deploy` command runbook exists OR step-by-step deployment doc captures the prod cutover sequence. | Ops | Doc exists |

---

## What "GREEN" looks like — example evidence row

| Gate | Status | Evidence | Date | By |
|---|---|---|---|---|
| `FUN-1` | 🟢 GREEN | preprod run-id `BETA1-DRY-2026-06-XX-01`, log at `MIGRATION_LOG.md` § "Beta-1 dry runs" | 2026-06-XX | <name> |
| `CQ-1` | 🟢 GREEN | `npm run test:px3.10` 38/38 ✓ on commit `<sha>` | 2026-06-XX | CI |
| `SEC-7` | 🟢 GREEN | `A20260512-01` 💻 shipped (commit `<sha>`) + regression test | 2026-06-XX | <name> |
| ... | ... | ... | ... | ... |

A live evidence log goes adjacent to this doc when launch prep begins — `BETA_LAUNCH_EVIDENCE_LOG.md`, one row per gate, owner-signed.

---

## Out of scope for Beta-1 (deferred to Beta-2)

These are NOT gating Beta-1 and explicitly removed from this checklist:

- Self-serve cohort dedicated work ([Group 3d](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md))
- Executive read-only Objectives view ([Group 4b](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md))
- Mailjet outage queue/retry ([Group 5b](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md))
- Sprint Cleanup destructive deletes (PX-3.8 / 3.14-3.18) — these run *after* Beta-1 with 50-100 real-user validation, per [CLEANUP-REGISTRY.md](CLEANUP-REGISTRY.md)
- AI tone consistency / `LLM_TONE_GUIDE.md` (refinement track)
- All `nice-after-Beta` items in [`REFINEMENT-BACKLOG/`](1-SPRINTS/REFINEMENT-BACKLOG/README.md)

If any of these surface as Beta-1-blocking during dry runs, add a row to the appropriate gate category — don't skip the checklist.

---

## Sprint-row consolidation (S26 + S27 acceptance → Beta-1 gate)

For audit traceability, every S26 + S27 acceptance criterion maps to a gate above:

| Sprint criterion | Maps to | Notes |
|---|---|---|
| S26 — both paths complete with zero out-of-band intervention | `FUN-1`, `FUN-2`, `FUN-6` | Verb-by-verb manual run |
| S26 — Manager has the next ball | `FUN-1` (last verb), `FUN-4` (dispatcher 4) | Email landed + page renders CTA |
| S27 — full activation + execution journey works | `FUN-3` | 5-verb manual run |
| S27 — KR-aggregation cron functional | `FUN-3` (Aggregate verb), `OPS-4` | Forced-tick check |
| S27 invariant — prompt regression suite GREEN | `CQ-3` | Suite from S25 PX-5.3 |
| S26 + S27 invariant — `notifyTransition()` sole entry point | `CQ-4` | Audit-blocking |
| S26 + S27 invariant — deep-links conform to `EMAIL_DEEP_LINK_CONTRACT.md` | `FUN-4`, `SEC-6`, `OPS-7` | Cross-env + grammar |

No S26 / S27 acceptance criterion exists outside this gate set. If one is added during sprint execution, it must be backfilled here.

---

## Sign-off

Beta-1 launches only when **all six categories are 🟢 GREEN** with evidence recorded.

| Owner | Signs off on |
|---|---|
| Engineering lead | `FUN-*`, `CQ-*`, `OPS-*`, `SEC-*` |
| Product | `COH-*`, `DOC-*` (`DOC-1`, `DOC-2`, `DOC-5`) |
| Ops | `OPS-*`, `SEC-1`, `SEC-5`, `DOC-3`, `DOC-6` |

Final go/no-go is the `/deploy` session that consumes this doc as input. Sprint 27 close does NOT auto-trigger Beta launch — that's a separate decision (per S27 master plan line 151).

---

## Bibliography

- [`AUDIT_S24_S27_FINDINGS.md`](1-SPRINTS/AUDIT_S24_S27_FINDINGS.md) — Group 8 source; audit IDs `A20260506-10` / `-11` / `-12`
- [`SPRINT26_MASTER_PLAN.md`](1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md) — S26 acceptance (5 verbs × 2 paths)
- [`SPRINT27_MASTER_PLAN.md`](1-SPRINTS/SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md) — S27 acceptance + Beta-launch connection (line 145)
- [`EMAIL_DEEP_LINK_CONTRACT.md`](../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) — `FUN-4`, `SEC-6`, `OPS-7` source
- [`MIGRATION_ROLLBACK_PLAYBOOK.md`](MIGRATION_ROLLBACK_PLAYBOOK.md) — `OPS-6`, `DOC-4`
- [`CLEANUP-REGISTRY.md`](CLEANUP-REGISTRY.md) — out-of-scope destructive ops
- [`REFINEMENT-BACKLOG/README.md`](1-SPRINTS/REFINEMENT-BACKLOG/README.md) — `DOC-5` (must / nice classification)
- [`BETA_FINAL_STRATEGY_2026.md`](../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) — `COH-1` cohort size guidance
