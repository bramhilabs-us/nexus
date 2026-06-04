# Sprint 31 — Canonical Mirror + Factory Seams + Test Coverage Uplift

<!-- @GENOME T3-SPR-031-MP | DRAFT | 2026-06-02 | parent:T1-PRD-002 | auto:/strategy,/coding | linked:/init,/close -->
<!-- 2026-06-02 — Folder + plan created at S28 lean pivot to carry deferred work. All slices originate from SPRINT28_MASTER_PLAN.md (locked 2026-05-28) + SPRINT28_IMPACT_ANALYSIS.md (drafted 2026-06-02). Genome parent T1-PRD-002 (product roadmap). -->

**Status**: 🟡 DRAFT — created 2026-06-02 at S28 lean pivot. Plan-only until S29 + S30 close AND evidence justifies factory work (product #2 starting, client demanding code handover, or compliance requiring data isolation).
**Sprint Goal**: Build the canonical-mirror surface (`bramhilabs-us/YSELA`) + factory seams + comprehensive regression coverage. Make Ysela the FIRST shippable product wrapper; lay seams so product #2 is mechanical.
**Sprint Window**: ~3 weeks calendar / 45–55h focused work
**Launch Gate**: Sprint 28 (lean) closed AND product #2 evidence emerges OR explicit user direction to lock factory infra.

---

## Why this sprint exists

Sprint 28 was originally scoped (2026-05-28) to ship the cross-repo mirror + factory seams + comprehensive test uplift TOGETHER with the brand chrome. On 2026-06-02 the user split this:

> *"or we can reuse karvia-business-2. We are anyways hardly using it."* — followed by lean S28 confirmation.

The lean S28 ships brand chrome only on a repurposed Render service. The factory infrastructure work — cross-repo mirror, new Mongo, new Render, sync mechanism, ~22h of test coverage uplift — moves here.

**Per memory `feedback_state_parsimony`**: don't pay the cost of new repo + new Mongo + new Render + sync discipline until there's evidence justifying it. Real triggers:
- (a) Product #2 starts and needs the factory pattern proven
- (b) A buyer wants to acquire just the YSELA codebase
- (c) Compliance requires data isolation between Karvia engine work and customer-facing Ysela
- (d) Real customer count on Ysela soft launch crosses ~10–20, justifying separate prod infra

Until one of those is true, Sprint 31 sits in DRAFT.

---

## Scope (inherits from S28 deferrals + S28 impact analysis)

All scope inherits verbatim from:
- [SPRINT-28-Ysela-Soft-Launch/SPRINT28_MASTER_PLAN.md §Deferred to Sprint 31](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_MASTER_PLAN.md#deferred-to-sprint-31-carry-forward--see-sprint-31-canonical-mirror)
- [SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md) — full source of truth for impact + test gap analysis

### Workstream M — Canonical Mirror (cross-repo)

| # | Slice | Effort | Source |
|---|---|---|---|
| **M.1** | Draft `.sync/allowlist.txt` + `.sync/denylist.txt` in workshop. Walk the tree, red-line with user, lock the lists. | 1h | S28 IA §3.1 |
| **L.4** | Initial code-only push → `bramhilabs-us/YSELA` (private). Brand-swap pass (logo asset + `package.json "name"` rename). Minimal product-surface README. | 2-3h | S28 MP §Locked Scope (deferred) |
| **L.4a** | Sync mechanism (A2) — GitHub Action mirrors code-only subset on push to `development`/`pre-prod`/`production`. ~50 LoC. | 2-4h | S28 MP §Locked Scope (deferred) |
| **L.4b** | GitHub Actions CI on `bramhilabs-us/YSELA`: lint + unit + integration + Mongo service container + build verify on PR. **Extended** (+2h per S28 IA §3.4): adds brand-rendering + sync-integrity + URL-invariant jobs + 60% coverage threshold lift. | 5-7h | S28 MP + IA §3.4 |
| **L.4c** | Security/privacy CI gates: gitleaks + `npm audit --audit-level=high` + Dependabot + `eslint-plugin-security` + `.env*` block-staging check. | 3-5h | S28 MP §Locked Scope (deferred) |
| **L.4d** | Render rebind: spin up YSELA-mirror-specific Render services (new Mongo + new Render) per the originally-scoped blue-green pattern. Decommission lean-S28 karvia-business-2 repurpose OR keep it as legacy fallback. | 2-3h + decision | S28 MP §Locked Scope (deferred) |
| **L.4e** | Branch protection on `bramhilabs-us/YSELA`: required CI checks, no force-push, PR review required, CODEOWNERS = "see workshop". | 30-60m | S28 MP §Locked Scope (deferred) |

### Workstream T — Test Coverage Uplift (per SPRINT28_IMPACT_ANALYSIS.md §3)

| # | Slice | Effort | Source |
|---|---|---|---|
| **L.4f** | Sync-integrity test suite (Category A): allowlist completeness + denylist enforcement + secret-shape scan + brand-swap correctness + commit-message format. Runs in workshop CI pre-flight + mirror CI re-runs. | 5.5h | IA §3.1 |
| **L.4g** | Brand-rendering regression suite (Category B): page-title sweep + footer presence + logo asset presence + brand-config env-driven test. Optional Playwright visual smoke deferred to S32+ if pixel-diff infra not ready. | 3.25h | IA §3.2 |
| **L.4h** | URL-invariant + mirror-integrity tests (Categories C + E): no-hardcoded-URL grep + APP_URL drives email/FE redirects + post-sync commit shape + drift detector cron. | 6.75h | IA §3.3 + §3.5 |
| **L.4i** | Multi-env smoke (Category G): `scripts/smoke-mirror-envs.js` + health-endpoint augmentation. | 2.5h | IA §3.7 |

### Workstream F — Factory Seams (the original S28 §L.5)

| # | Slice | Effort | Source |
|---|---|---|---|
| **L.5** | Extract 4–6 brand strings to `client/js/brand-config.js` (env-driven: `APP_NAME`, `APP_TAGLINE`, `BRAND_PRIMARY_COLOR`, `BRAND_ACCENT_COLOR`); add 1-page `BRANDING.md` with the 5-step rebrand playbook. **Extended** (+2h per S28 IA §3.6): co-located unit tests for brand-config (100% from day 1) + footer-partial render test. | 3-4h | S28 MP + IA §3.6 |

---

## Total effort estimate

| Workstream | Slices | Effort |
|---|---|---|
| M — Canonical Mirror | M.1 + L.4 + L.4a + L.4b + L.4c + L.4d + L.4e | 15.5–22.5h |
| T — Test Coverage Uplift | L.4f + L.4g + L.4h + L.4i | 18h |
| F — Factory Seams | L.5 | 3–4h |
| Buffer for scope creep between S28 and S31 (new code added in S29/S30 needs allowlist + tests) | | 5–8h |
| **Total** | | **~41.5–52.5h ≈ 45–55h** (~3 weeks) |

---

## Acceptance criteria

Sprint 31 is **done** when ALL of the following pass:

1. ✅ `bramhilabs-us/YSELA` (private) contains the code-only snapshot synced from workshop `development`
2. ✅ Sync GitHub Action runs green on every workshop push to deployment branches
3. ✅ CI on `bramhilabs-us/YSELA` runs green: lint + unit + integration + e2e + security + gitleaks + npm audit + brand-rendering + sync-integrity + URL-invariant
4. ✅ Coverage threshold on mirror = 60% (workshop coverage uplift target)
5. ✅ Render deploys from `bramhilabs-us/YSELA` (separate Mongo + Render for the mirror surface)
6. ✅ Branch protection enforced on `bramhilabs-us/YSELA main`
7. ✅ `client/js/brand-config.js` env-driven + `BRANDING.md` 5-step playbook shipped
8. ✅ Multi-env smoke test passes against dev + staging + prod mirror envs
9. ✅ Drift-detector cron live and configured (channel TBD at sprint kickoff)
10. ✅ Decision logged: is karvia-business-2 lean repurpose decommissioned, kept as legacy fallback, or revived as pre-prod staging?

---

## Architectural invariants (carried from S28)

1. **Engine identifier stays `karvia`** — package.json name, internal modules, MongoDB collections, server constants.
2. **`Powered by BRAMHI Labs` footer** (locked 2026-06-02; supersedes 2026-05-28 three-tier).
3. **Single env-var for base URL** — `APP_URL` per `EMAIL_DEEP_LINK_CONTRACT`.
4. **No history rewrite** — initial mirror push is a clean snapshot from workshop `development` HEAD, not a history copy.
5. **No secret in CI logs** — secrets via GitHub Actions secrets, never echoed.
6. **Mirror is downstream-only** — no direct commits on `bramhilabs-us/YSELA`. All changes originate in workshop, sync forward. Branch protection + CODEOWNERS enforce.

---

## Open questions (resolve at S31 kickoff)

Carries forward from [SPRINT28_HANDOFF_DOCUMENT.md §Open Questions](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_HANDOFF_DOCUMENT.md) + [SPRINT28_IMPACT_ANALYSIS.md §8](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md):

1. Mailjet sender name "Ysela" — already verified at S28? If yes, no re-work needed.
2. Render blue-green pattern — Preview Environments or fully separate prod-tier service?
3. Mirror Action trigger — push to `development` only, OR all 3 deployment branches?
4. `BRANDING.md` placement — root of mirror repo OR `docs/` subfolder?
5. CI integration test secrets — Mongo connection string in GH Actions secrets, or service container with seeded fixture?
6. Coverage threshold lift — 50% → 60% in S31 close (lock from IA §5)?
7. Visual regression — defer Playwright visual smoke to S32, or include in S31 (+2h + baseline-image mgmt)?
8. Mirror CI cost cap — set a hard cap on GitHub Actions minutes per sync, fail fast on runaway test loops?
9. Drift detector destination — email, Slack, GitHub issue auto-open?
10. Smoke test cadence — run multi-env smoke on every sync, daily, or on-demand?
11. karvia-business-2 lean repurpose disposition — decommission, keep as fallback, or revive as pre-prod?
12. Data migration from shared pre-prod Mongo to new YSELA Mongo — manual copy (<10 users), scripted migration (more), or fresh start with notify-and-resignup?

---

## Prerequisites (must be true before Sprint 31 starts)

- [ ] Sprint 28 (lean) closed — Ysela live on www.ysela.ai
- [ ] Sprint 29 closed (TBD scope)
- [ ] Sprint 30 closed (TBD scope — currently exists as folder `SPRINT-30-Circular-Economy`)
- [ ] One of the triggers (a/b/c/d in §Why) materially in motion

---

## Risk register (carried + extended)

See [SPRINT28_IMPACT_ANALYSIS.md §2.8](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md) for the full risk delta. Headline:

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Existing 50% coverage threshold is too low for customer-facing repo | High | Medium | L.4f + L.4g + L.4h lift to 60% with explicit roadmap to 70% pre-Beta |
| Brand-rendering regression has zero test coverage today (still true if S28 lean ships) | Certain | High | L.4g brand-rendering test suite is gate |
| No test asserts synced payload contains NO denylisted files | Certain | Critical | L.4f sync-integrity gate runs in workshop CI before any sync executes |
| Scope creep: code added between S28 and S31 needs allowlist + tests | Certain | Low-Medium | 5–8h buffer in §Total effort estimate |
| Data migration from shared pre-prod Mongo to new YSELA Mongo | Depends on user count | Medium-High | Decision deferred to §Open Questions Q12 — strategy depends on user count |
| karvia-business-2 lean repurpose interferes with full S31 rebind | Medium | Medium | §Open Questions Q11 disposition decision drives migration path |

---

## References

- [SPRINT-28-Ysela-Soft-Launch/SPRINT28_MASTER_PLAN.md](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_MASTER_PLAN.md) — lean S28 scope; what shipped before S31
- [SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md) — full impact + test gap analysis (source of truth)
- [ECOSYSTEM_ARCHITECTURE.md](../../../../ECOSYSTEM_ARCHITECTURE.md)
- [EMAIL_DEEP_LINK_CONTRACT.md](../../../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md)
- [.github/workflows/test.yml](../../../../.github/workflows/test.yml) — workshop CI baseline (mirror CI extends this)
- [tests/jest.config.js](../../../../tests/jest.config.js) — current 50% threshold; S31 lifts to 60%
- Memory rule: `project_bramhi_labs_factory_model` (2026-06-02 footer simplification)
- Memory rule: `feedback_state_parsimony` (defer infra until justified)
- Memory rule: `feedback_session_bifurcation` (5-session execution split per IA §6)
- Memory rule: `feedback_canonical_engine_grounding` (re-inventory existing engine surface before scoping new — S29/S30 may have added code that affects S31 allowlist)
