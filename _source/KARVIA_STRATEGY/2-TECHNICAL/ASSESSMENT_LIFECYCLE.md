# Assessment Lifecycle — Canonical Reference

<!-- @GENOME T2-ARC-023 | ACTIVE | 2026-05-13 | parent:T2-ARC-001 | auto:- | linked:/strategy,/coding -->
<!-- 2026-05-13 — /strategy: added "Plug-in seams (multi-template forward-compat)" section after "Architectural posture"; amended Q8 entry to reflect as-shipped reuse of `Assessment.assessment_type` (E.3 / A20260512-08) instead of adding `AssessmentTemplate.scoring_type`. No new abstractions introduced — section is descriptive (enumerates seams already in code with file:line refs) so future template families plug in via documented seams rather than paving over them. Beta scope locked single-template (SSI); multi-template UI decisions deferred until 2nd family actually scoped. -->

**Status**: ACTIVE — locked 2026-05-12 in /sprint-review extension as canonical model for Karvia's assessment flow.
**Companion to**: `EMAIL_DEEP_LINK_CONTRACT.md` (T2-ARC-022), `PERSONA_STAGE_OWNERSHIP_MATRIX.md`.

---

## Concept layering — don't conflate

### Layer 1 — Assessments (the diagnostic)
- **`AssessmentTemplate`** = "a bunch of questions." SSI today; any framework tomorrow. Pluggable.
- **`Invitation`** = role-agnostic ticket. *Any sender with permission* invites *any recipient role* to take *any template*. Bidirectional.
- **`Assessment`** = one person's one attempt at one template. Has answers + status (`in_progress` → `completed`).

### Layer 2 — Results (the measurement)
- **ScoringService** reads completed Assessment.answers → computes per-Assessment result. SSI dimensions today (Speed / Strength / Intelligence); any formula tomorrow via `scoring_type` dispatch.
- **CompanyAssessmentRollupService** reads all completed Assessments for `company_id` → updates `Company.assessment_scores`. **Single canonical company score.**

### The why-chain (load-bearing)
> Measure Company SSI → identify gaps → author **Objectives** → break to **Key Results** → plan **Moves/Tasks** → execute → re-measure SSI → loop.

Assessment is the thermometer. Objectives + KRs + Plan is the medicine. SSI is just today's particular thermometer reading.

---

## The 8-step flow

```
1. Pick a template      → anyone with invite permission picks an AssessmentTemplate
                          (today: 1 template = SSI; tomorrow: N templates)

2. Pick recipients      → any roles, any count, in the same Company
                          (Manager can invite BO, BO can invite Employees,
                           Manager can invite Employees directly, etc.)
                          → BIDIRECTIONAL; no sequential gate.

3. Send invitations     → Invitation row per (sender, recipient, template, expires_at)
                          → email fires (Workstream B-2 reminder cron exists)

4. Recipient takes      → opens link → Assessment row {status: in_progress}
                          → submits → Assessment {status: completed, ssi_result}

5. Score the attempt    → ScoringService (SSI today) reads Assessment.answers
                          → writes Assessment.ssi_result
                          → dispatch by template.scoring_type when N templates exist

6. Roll up the company  → CanonicalRollupService reads all completed Assessments
                          for company_id (latest per person) → role-weighted average
                          → updates Company.assessment_scores
                          (role-weighting already supported via
                           SSIScoringService.aggregateTeamScores roleWeights param;
                           defaults to config.SCORING.WEIGHTS)

7. Display              → ALL surfaces (workspace tile, team-ssi-view, my-clients,
                          ssi-report) read from Company.assessment_scores
                          (one canonical source — no per-surface independent compute)

8. Act on it            → Sprint 26: Consultant/BO authors Objective in response to SSI
                          → Sprint 27: KRs broken to tasks, executed, SSI re-measured
```

---

## Role-invite semantics — BIDIRECTIONAL

Any role with invite permission can invite any other role to take any template, subject to `company_id` scoping (no cross-tenant invites). The "sequential chain" framing (BO → Manager → Employee) is **not** the model. Examples of valid invites:
- Manager → BO ✅
- BO → Manager ✅
- Manager → Employee ✅
- BO → Employee ✅
- Consultant → anyone in managed client ✅
- Employee → anyone: **TBD** (strategy-session question Q7)

Code reference: `routes/invitations.js:479-515` — single `POST /api/invitations/create` accepts `recipient_emails[]` + `recipient_roles[]`. All invitations created in a loop, no dependency chain.

---

## Architectural posture — "We have what we need"

**No new models.** `AssessmentTemplate` + `Invitation` + `Assessment` + scoring services + `Company.assessment_scores` already exist. Fixes amend the flow, not the architecture.

**SSI-specifics kept out of the generic plumbing.** Future templates plug in via `AssessmentTemplate.scoring_type` (proposed Q8); rollup service is dispatch-by-type; surface code doesn't change.

**One canonical company score.** `Company.assessment_scores` is the single read source. Per-surface independent aggregation is the bug we're fixing (A20260512-01).

---

## Plug-in seams (multi-template forward-compat)

**Locked 2026-05-13 /strategy.** Beta ships single-template (SSI). Future template families (AI Readiness, Culture Health, Role Clarity, ...) plug in via the seams below — no new collections, no new abstractions, no FE rename until a second family is actually scoped. The seams ARE the architectural commitment.

Adding a new assessment family is a 5-seam exercise; the 6th seam is a deferred decision, not work.

| # | Seam | File:line | What changes per new family | What stays |
|---|---|---|---|---|
| 1 | **Template definition** | [`server/models/AssessmentTemplate.js`](../../server/models/AssessmentTemplate.js) — `dimension_configs` schema (already polymorphic per-template weights/thresholds/questions) | New `AssessmentTemplate` row seeded for the new family. Dimensions, weights, thresholds defined declaratively. | Schema unchanged. Seed script pattern shared. |
| 2 | **Scoring framework** | [`server/services/UnifiedSSIScoringService.js:739`](../../server/services/UnifiedSSIScoringService.js#L739) (`toCanonicalShape` pattern) | New `<Family>ScoringService.js` exporting `calculate()` + `toCanonicalShape()` matching the locked 0-10-uniform contract (`{overall, dimensions, categories, framework, as_of}`) — see A20260512-17. | Canonical-shape contract unchanged across families. FE consumes one shape. |
| 3 | **Rollup dispatch** | [`server/services/OnboardingProgressService.js:103`](../../server/services/OnboardingProgressService.js#L103) — `SCORING_DISPATCH` map keyed by `Assessment.assessment_type` | Register one handler: `SCORING_DISPATCH[<family>] = rollup<Family>`. Handler returns flat `$set` payload for company rollup. | Dispatch wrapper, `onAssessmentCompleted()` orchestration, write-trigger logic. |
| 4 | **Delivery engine** | [`server/routes/invitations.js`](../../server/routes/invitations.js) → [`client/pages/assessment-take.html`](../../client/pages/assessment-take.html) → [`server/routes/assessments.js:223`](../../server/routes/assessments.js#L223) (POST `/submit`) | Nothing. Template-agnostic — `template_id` flows through invitation → take → submit untouched. | Entire delivery flow. |
| 5 | **Per-respondent results read** | [`server/routes/assessments.js:349-358`](../../server/routes/assessments.js#L349-L358) (`/detailed-results` returns `canonical` shape) | Nothing for the read; only the scoring service that produced `ssi_result` differs (per seam 2). | Read shape, FE consumer pattern. |
| 6 | **Company rollup target** ⚠️ | [`server/models/Company.js:317`](../../server/models/Company.js#L317) — `assessment_scores` sub-document is SSI-shaped (`speed_score`, `strength_score`, `intelligence_score`, `overall_score`) | **Deferred decision.** When the 2nd family lands, choose: (a) generalize `assessment_scores` to `assessment_scores_by_family.<family>.{...}`, OR (b) per-family fields (`ai_readiness_scores`, `culture_scores`), OR (c) drop `Company.assessment_scores` and read latest per-family on demand from `Assessment`. Beta is unaffected — SSI continues to use today's shape. | Single-writer invariant (only `OnboardingProgressService` writes). |
| 7 | **FE results view** ⚠️ | [`client/pages/team-ssi-view.html`](../../client/pages/team-ssi-view.html) — canonical results page per A20260512-16(a) | **Deferred decision.** When 2nd family lands, choose: (a) rename to `team-results-view.html` with `?family=` router, (b) sibling pages (`team-airead-view.html`), (c) family-renderer components inside one page. For Beta, name is correct: it IS the canonical view (SSI is the only family). | Tab structure, role-aware tab matrix, redirect-shim pattern from `assessment-results.html`. |

**Anti-overreach guard rails** (per `feedback_minimal_change_grounding` + `feedback_extend_before_wrap`):
- ❌ Do NOT add `AssessmentCohort` collection until repeated sends of same template-to-same-company become a Beta-2+ requirement.
- ❌ Do NOT add `cohort_id` field until same-as-above triggers it.
- ❌ Do NOT rename `team-ssi-view.html` until a 2nd template family is concretely scoped (rename cost is small; doing it speculatively breaks A20260512-16(a)'s shipped redirect-shim contract).
- ❌ Do NOT generalize `Company.assessment_scores` until a 2nd family writes to it.
- ✅ DO honor the locked canonical-shape contract (seam 2) when scoring services are added — single FE consumer shape.
- ✅ DO register new families in `SCORING_DISPATCH` (seam 3) — extend the map, don't wrap it (this is the `feedback_extend_before_wrap` lesson made durable).

**Reuse-max already proven**: A20260512-08 (E.3) chose `Assessment.assessment_type` (existing required+indexed enum) as the dispatch key instead of adding `AssessmentTemplate.scoring_type` — exactly the pattern future families should follow.

---

## Known breaks (S26 Workstream E — 4 tasks, ~1.75d)

| ID | Step | Break | Fix |
|---|---|---|---|
| `A20260512-01` | Step 7 | `/team-breakdown` returns empty if `teams.length === 0`, even with completed Assessments. `/dashboard-summary` reads independently. Two divergent display paths. | **E.1**: Both surfaces read `Company.assessment_scores` (canonical). Modify routes, no new service. |
| `A20260512-02` | Step 6 | `OnboardingProgressService` reads legacy `assessment.ssi_scores`; Assessment writes modern `assessment.ssi_result`. Rollup drifts as weights evolve. | **E.2**: Fix service to read `ssi_result.dimensions.*`; one-shot backfill script. |
| `A20260512-08` | Step 1/5 | `AssessmentTemplate` has no `scoring_type` field — future templates can't be added without code branching | **E.3**: Add `scoring_type` (default `'SSI'`); dispatch-by-type wrapper in existing rollup. |
| `A20260512-11` | Step 6 | No regression test proves cascade-correctness (Assessment completion → re-take → role change → user delete all correctly update `Company.assessment_scores`) | **E.4**: New regression test. |

---

## Locked design decisions (2026-05-12 /strategy session)

### Rollup formula (Q5)
**Latest-per-person → role-weighted average.** Role-weighting already supported via [SSIScoringService.aggregateTeamScores(scores, roleWeights)](../../server/services/SSIScoringService.js#L478) — defaults to `config.SCORING.WEIGHTS`. One canonical score per company.

### Re-take semantics (Q6)
**Versioned attempt.** New `Assessment` row per re-take; `retake_number` increments; latest by `completed_at` wins display. No new collection.

### Per-role visibility (Q7)
| Role | Own | Direct reports | All team | Company aggregate |
|---|---|---|---|---|
| EMPLOYEE | ✅ | n/a | ❌ | ✅ (motivational) |
| MANAGER | ✅ | ✅ | ❌ | ✅ |
| BO / EXECUTIVE | ✅ | ✅ | ✅ | ✅ |
| CONSULTANT | n/a | n/a | ✅ (managed clients) | ✅ (managed clients) |

Everyone sees company aggregate. Per-person detail gated by hierarchy. EMPLOYEE cannot invite (only takes). MANAGER can invite anyone (bidirectional) but sees only direct reports' detail.

### `scoring_type` extensibility (Q8)
**As shipped (E.3 / A20260512-08):** spec amended at code time per `feedback_reuse_max` — instead of adding a new `AssessmentTemplate.scoring_type` field, reused existing `Assessment.assessment_type` (required + indexed enum: `'ssi' | 'custom' | '360_review' | 'self_assessment' | 'peer_review' | 'customer_feedback'`). `OnboardingProgressService.SCORING_DISPATCH` dispatches by this field. Future families register a handler under their `assessment_type` key (extend the map; see seam 3 above). No schema change; no surface code change.

### Template management (Q10)
**Global-only for Beta-1.** One shared template seeded via `seed:mece`. Per-company custom templates → refinement-backlog (post-Beta-1 feature).

### Historical scoring log (Q11)
**No new collection for Beta-1.** Existing `Assessment` records are versioned (Q6); they ARE the historical log. Compact reads via `Assessment.find({...}).select(...)`. Dedicated `AssessmentScoreLog` collection deferred to refinement backlog — introduce only if memory pressure shows up post-Beta.

### Canonical rollup contract (Q12)
- **Sole writer to `Company.assessment_scores`**: `OnboardingProgressService` (existing — light refactor in E.2/E.3, not a replacement)
- **Fields**: `speed_score, strength_score, intelligence_score, overall_score, last_assessed, readiness_profile` (existing schema)
- **Write triggers**: (a) Assessment completion, (b) User role change, (c) User deletion
- **Cascade invariant**: every child score change correctly propagates to `Company.assessment_scores`. Proven by E.4 regression test.

---

## Future extensions (refinement track or Sprint 28+)

- **AssessmentScoreLog** — dedicated compact log if memory becomes a concern post-Beta (`A20260512-10` deferred)
- **AssessmentCycle** — Q1 2026 / Q2 2026 wave concept for cyclical reporting
- **Per-company custom templates** — consultant-authored, scoped to client (Q10 refinement)
- **Multiple `scoring_type` values** — future frameworks beyond SSI (GRIT, BBB, PBL)

---

## Sign-off

Canonical model locked 2026-05-12 in /sprint-review extension; design decisions locked in same-day /strategy session. Companion strategy session reference: [ASSESSMENT_STRATEGY_SESSION_INPUT.md](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/ASSESSMENT_STRATEGY_SESSION_INPUT.md).
