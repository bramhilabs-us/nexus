# Sprint 30 + 31 — Strategic Input

<!-- @GENOME T3-SPR-030-INPUT | ACTIVE | 2026-06-01 | parent:T0-GOV-001 | auto:/strategy | linked:- -->

**Status**: 📝 STRATEGY INPUT — synthesis from /strategy session 2026-06-01. Awaiting full master plan mint at next /strategy session.
**Source session**: /strategy 2026-06-01 (synthesis only; no implementation work)
**Sibling sprint**: Sprint 31 (Settings dials) — coupled pair, plan together
**Predecessor**: Sprint 27 F.2/F.3/F.4 (reminders_sent infrastructure sealed 2026-05-31)
**Canon anchors**: [CLAUDE.md §Building Principles](../../../../CLAUDE.md#building-principles) + [CLAUDE.md §The Circular Economy](../../../../CLAUDE.md#the-circular-economy)

---

## What this document is

Background research and locked strategic decisions for Sprint 30 + Sprint 31. Per the session-bifurcation principle adopted at the end of the synthesis pass, this doc serves as the auto-load input for the next `/strategy` session that mints `SPRINT-30-MASTER-PLAN.md` and `SPRINT-31-MASTER-PLAN.md`.

**Do not implement from this doc.** It captures strategic intent + verified ground, not technical specification. The spec-mint happens in the next bifurcated session.

---

## One-line vision

The Feedback page becomes the metronome of the circular economy — every task moving to done reduces the nudges needed for the next, and that ratio (`tasks done ÷ nudges sent`) is adoption. A periodic reflection cron pulls every player back to one surface; the consultant reads cohort signal there and renews the deck by adding the next client.

---

## Sprint 30 — Feedback redesign + reflection cron

| Layer | Change |
|---|---|
| Page | Redesign `feedback.html` content behind existing Admin Dashboard toggle. Role-aware lens. Three sections: **OKRs / Tasks / Voice**. Quant + qual side-by-side. |
| Nav | Unchanged — user dropdown, second-level reveal |
| Action | **Add Client** CTA, consultant-only, reuses My Clients' modal + endpoint |
| Cron | One new path in `dailyDigestJob.js` — periodic reflection nudge (cadence configurable in S31; S30 ships placeholder defaults) |
| Email | One new template: *"Time to reflect on your OKRs and your Tasks"*. **Role-aware always, zero hardcoding** — copy registry / template-var pattern |
| Schema | **Zero changes** |
| Routes | **Zero new** |

**Preservation rule**: existing Weekly Pulse + Feature thumbs submission surface is preserved exactly as-is for every role. The redesign affects only the read-view rendered behind the Admin Dashboard toggle.

**Out of scope for v1**: BO read view (deferred to v2); inline behavioral snapshot in reflection email (v1 = simple invite, v2 = inline snapshot once we know users click).

---

## Sprint 31 — Settings dials

| Layer | Change |
|---|---|
| Schema | Extend `Company.settings` ([server/models/Company.js:392-421](../../../../server/models/Company.js#L392-L421)) with sub-fields for cron-cadence + reminder-day thresholds + reflection-cadence + any other "rules of the game" dials |
| Page | Extend `configuration.html` ([client/pages/configuration.html](../../../../client/pages/configuration.html)) with a Settings section. Currently binds to `Company.ssi_config`; same surface pattern extends. |
| Defaults | S30's placeholder defaults become S31's seed values (lazy migration, no backfill) |
| Schema | Sub-fields on existing doc. **No new model.** |
| Routes | Zero new (extend existing config endpoints) |

**Per-tenant**. Each tenant owns its own dials. Consultant configures their consultancy's settings; for client tenants they edit via consultant-scoped APIs (same pattern already used). **No "consultancy → client default propagation" logic in v1** — per state-parsimony, fresh-from-platform-defaults is simpler.

---

## Verified ground (Wave 1 — Explore agent, 2026-06-01)

### G — Consultant→client tenant association
**EXISTS** as `User.managed_businesses[]` ([server/models/User.js:88-92](../../../../server/models/User.js#L88-L92), indexed at line 313). Populated by [server/routes/consultant.routes.js:549](../../../../server/routes/consultant.routes.js#L549) on `POST /api/consultant/clients`. One-way (no `Company.consultant_id` back-ref).

**Inference query for "my cohort"**:
```js
const clients = await Company.find({ _id: { $in: req.user.managed_businesses } });
```

Out-of-band: reverse lookups ("who is consultant for this client?") would require User scan today — fine for S30/S31 scope; iBrain-era may want a back-ref then.

### O — Consultant-own Objectives
**EXISTS** fully — verified by user post-Explore. The consultant's own tenant (their consultancy) is just another Company. They use [objectives.html](../../../../client/pages/objectives.html) the same way a BO uses it. `POST /api/objectives` has no role guard and uses `req.user.company_id` directly ([server/routes/objectives.js:97, 169](../../../../server/routes/objectives.js#L97)).

**The "game within a game"**: same OKR engine runs at every tenant scope. Client tenants run business OKRs. Consultant tenants run meta-OKRs about clients (e.g. "5 clients to Active by EoQ"). Same engine, same models, same routes, same UI — engine doesn't know one tenant from another. Fully recursive — no special-case code anywhere.

### Q3 — S31 settings substrate
**EXISTS** at [server/models/Company.js:392-421](../../../../server/models/Company.js#L392-L421). Sub-doc holds fiscal_year_start, currency, timezone, business_hours. S31 extends this same sub-doc with cron-cadence + reminder-day fields. No new model needed.

[configuration.html](../../../../client/pages/configuration.html) exists and currently binds to `Company.ssi_config`. S31 extends the same UI surface with the new settings section.

---

## Locked decisions (in order resolved during synthesis)

| ID | Decision |
|---|---|
| A | Headline metric = `Σ tasks_completed ÷ Σ nudges_sent`, trended, per-scope |
| B | iBrain is post-Beta. S30/S31 ship deterministic KARVIA-only computation. |
| C | Consultant vs client tenant — infer from role + ownership graph. No discriminator field. |
| D | Building Principles appended to CLAUDE.md (5 principles) |
| E | Consultant's daily dashboard = existing Task surface (reuse-max, "consultant is just another player") |
| F | No separate admin role. Consultant has full privileges in own tenant. Cross-tenant control = iBrain era. |
| G | Inference via `User.managed_businesses` — verified |
| I | Feedback page stays at user dropdown, second-level reveal — no nav change |
| L | One redesigned page, zero new routes |
| M | Quant + qual side-by-side, two cards on one canvas |
| N | BO read view deferred to v2 |
| O | Consultant uses objectives.html same as BO — verified ("game within a game") |
| P | Submission surface (Pulse + Feature thumbs) untouched |
| Q | Supporting metrics: time-to-Active per cohort + Weekly Pulse trend + Feature thumbs net-positive |
| R | Cron cadence configurable via S31 Settings. S30 ships placeholder defaults; concrete values deferred. |
| S | Add Client on Feedback = same modal + endpoint as My Clients |
| T | Every role reflects at access scope. Only consultant has outbound CTA. |
| U | Email body role-aware always, zero hardcoding (copy registry pattern) |
| V | Reflection tagline: *"Time to reflect on your OKRs and your Tasks"* |

---

## Open items for the next /strategy session (spec-mint pass)

These were intentionally deferred from synthesis — they are the spec-mint pass's work:

1. **Default cadence values** — when does the reflection cron actually fire? Day of week, time of day, timezone handling. Likely weekly, end of week, user-timezone aware. Pick concrete values for v1 ship.
2. **Copy registry mechanism** — where does the role-aware email body live? New DB collection? JSON config? Sub-doc on Company.settings? Pick the smallest substrate that satisfies "zero hardcoding" without adding a heavy new model.
3. **Quant card composition** — exact widgets in the OKRs / Tasks layers. Funnel by stage? Ratio trendline? Cohort sparklines? Pick the minimum set that lets the consultant see "is the deck falling".
4. **Qual card composition** — exact widgets in Voice layer. Pulse trendline? Feature thumbs aggregate? Recent submission stream?
5. **S31 Settings sub-fields** — exact field names + types for cron-cadence + reminder-day dials. Validate they fit cleanly under `Company.settings`.
6. **Reflection cron observability** — how do we know users actually reflected? (Email click-through? Visit count? Submission count?) State-parsimony: probably rely on existing visit telemetry, no new metric doc.
7. **Coupling vs sibling planning** — mint S30 + S31 as a coupled pair in one /strategy session, or two separate sessions? Coupling is real (S30's defaults are S31's seeds). Recommendation: one /strategy session, two master plans.

---

## Process notes

**Session bifurcation locked as process going forward** (CLAUDE.md memory: `feedback_session_bifurcation.md`). This input doc is the bridge from synthesis → next /strategy. The next session opens with this doc auto-loaded, mints master plans, and exits.

**State Parsimony recurses into the doc layer too**: this is the only new doc S30 spawns. No NEW master-plan / technical-implementation / user-stories docs until the spec-mint session.

---

**Last updated**: 2026-06-01 (Sprint 30 /strategy synthesis session)
