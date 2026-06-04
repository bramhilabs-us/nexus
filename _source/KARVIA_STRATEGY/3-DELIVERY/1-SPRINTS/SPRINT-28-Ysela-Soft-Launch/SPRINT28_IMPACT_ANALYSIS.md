# Sprint 28 — Impact Analysis & Test-Coverage Gap Plan

<!-- @GENOME T3-SPR-028-IA | DRAFT | 2026-06-02 | parent:T3-SPR-028-MP | auto:/strategy,/coding | linked:/audit,/testing -->

**Status**: 🟡 DRAFT — created 2026-06-02 /strategy session
**Companion to**: [SPRINT28_MASTER_PLAN.md](SPRINT28_MASTER_PLAN.md) (locked 2026-05-28)
**Purpose**: Detailed blast-radius analysis of the workshop → mirror sync model AND the test-coverage uplift needed for cross-repo confidence. Does NOT redesign the locked Master Plan — proposes additive slices (L.4f, L.4g, L.4h) and a coverage-target schedule for the execution sessions.

---

## 0. What this document is and isn't

### Is

- A **9-dimension impact map** for the workshop → `bramhilabs-us/YSELA` sync model
- A **gap analysis** between current test coverage (today's 45 files, 50% threshold) and the coverage we need for safe one-way sync into a private customer-facing repo
- A **catalog of new tests** to write — by category, with file paths, with effort estimates
- A **proposed addition** of 3 new slices to the Master Plan (L.4f / L.4g / L.4h)
- A **coverage target schedule** showing baseline → S28 close → post-launch

### Isn't

- A redesign of the Master Plan (already locked 2026-05-28)
- A redesign of the sync strategy (A2 already locked: GitHub Action mirror)
- The implementation itself (deferred to `/coding` sessions per user direction)
- A change to architectural invariants (still per Master Plan §Architectural Invariants verbatim)

---

## 1. Baseline (grounded as of 2026-06-02)

### 1.1 Workshop test infrastructure

| Surface | Count | Location |
|---|---|---|
| Unit tests | 27 files | `tests/unit/` |
| Integration tests | 12 files | `tests/integration/` |
| E2E tests | 4 files | `tests/e2e/` |
| Security tests | 1 file | `tests/security/multi-tenant-isolation.test.js` |
| Models tests | (counted in unit) | `tests/models/` |
| Playwright BSTs | separate suite | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/PLAYWRIGHT/` |
| Regression scripts | 1 aggregator | `scripts/regression/full-suite.js` |
| Per-sprint regression scripts | ~30+ | `scripts/test-sprint*-*.js` |
| **Total Jest tests** | **45 files** | |

### 1.2 Coverage targets in effect

From `tests/jest.config.js`:

```js
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50
  }
}
```

Excluded from coverage: `node_modules/`, `tests/`, `coverage/`, `bramhi/`, `uploads/`, `logs/`, `engines/`.

### 1.3 CI matrix (existing `.github/workflows/test.yml`)

| Job | Trigger | Gates |
|---|---|---|
| unit-tests | every PR | unit suite |
| integration-tests | every PR | integration suite + Mongo service container |
| security-tests | pre-prod + production branches | multi-tenant isolation |
| e2e-tests | pre-prod + production branches | golden-path + consultant-role |
| full-test-suite | production branch | coverage report |
| lint | every PR | `continue-on-error: true` |

**Test secrets in CI today**: `JWT_SECRET=test-jwt-secret-...` (hard-coded test value), `MONGODB_URI=mongodb://localhost:27017/karvia_test`. No real secrets in workshop CI.

### 1.4 Existing sync precedent

`scripts/sync-production.sh` already does an intra-repo branch sync that:
- Excludes `Karvia_OKR_Product_Planning/`, `Karvia_OKR_Mockups/`, `KARVIA_STRATEGY/`
- Auto-resolves planning-doc conflicts to "deleted"
- Treats production branch as code-only
- Commits with `Sync from <branch>: <date>` message format

**The cross-repo sync (L.4a) reuses this exclusion pattern + extends it to** `.claude/`, `YSELA/`, `iBRAIN_Integration/`, `bramhi/`, `docs/bramhi-*`, sprint/handoff/audit docs.

---

## 2. Impact analysis — 9 dimensions

### 2.1 Code-surface impact

**Files touched by Sprint 28 in the workshop:**

| Surface | Change | Files touched |
|---|---|---|
| Logo asset references | Swap path | Likely 3–8 HTML/CSS files (header, nav, login, splash, email templates if any) |
| Page `<title>` sweep | Bulk rename | 33 HTML files per L.1.5 |
| Footer partial | Add reusable component + apply | NEW: `client/partials/footer.html` (or equivalent) + ~33 page includes |
| Brand config | NEW file | `client/js/brand-config.js` (env-driven) |
| Sync script | NEW file | `.github/workflows/sync-to-ysela.yml` |
| Sync allowlist | NEW file | `.sync/allowlist.txt` + `.sync/denylist.txt` |
| README on mirror | NEW file | `bramhilabs-us/YSELA:README.md` (product-surface) |
| BRANDING.md | NEW file | Root (or `docs/`) — 5-step rebrand playbook |

**Files NOT touched** (per architectural invariant #1): server-side code, MongoDB collection names, package.json `name`, internal module names. Engine stays `karvia`.

**Net production-code diff for the launch**: ~30–50 file modifications + 4–6 net-new files. Modest.

### 2.2 Test-surface impact

This is where the bulk of the new work lives. See §3 (gap analysis) for the full breakdown. Headline numbers:

- **New tests needed**: ~12–18 test files across 7 categories
- **Coverage uplift on touched surfaces**: brand-config (NEW, 100% from day 1), footer partial (NEW, render test), sync script (smoke test)
- **Existing test re-runs in new env**: full Jest + Playwright suites must run green on `bramhilabs-us/YSELA` CI before first prod deploy

### 2.3 Infrastructure impact

| Resource | Quantity | Notes |
|---|---|---|
| New MongoDB Atlas databases | 3 | dev (M0 free) + staging (M10 ~$60/mo) + prod (M10+ ~$60/mo or higher tier) |
| New Render services | 3 | dev (free or starter $7/mo) + staging (starter $7/mo) + prod (standard $25/mo) |
| New DNS records | 1+ | `www.ysela.ai` → Render prod; optional `staging.ysela.ai` + `dev.ysela.ai` |
| New Mailjet sender | 1 | "Ysela" name (no domain change this sprint per Master Plan deferrals) |
| **Estimated monthly run-rate add** | | **~$130–250/mo** depending on tier choices |

### 2.4 Operational impact

- **Two production surfaces to monitor.** karvia-business.onrender.com (workshop) AND ysela.onrender.com (mirror, via www.ysela.ai). Two error dashboards, two backup schedules, two on-call surfaces. **Mitigated by**: L.4d blue-green pattern, plus the workshop-prod may be retired post-soft-launch if no separate use case remains (decision deferred — not Sprint 28 scope).
- **One-way sync discipline rule.** No commits land directly on `bramhilabs-us/YSELA`. All changes originate in workshop, sync forward. Enforced by: branch protection on mirror main + CODEOWNERS pointing to a "see workshop" reviewer + a README banner on the mirror that says "do not commit directly".
- **Hotfix flow.** Even urgent fixes for live YSELA customers go: workshop fix → sync → mirror CI → promote. Worst-case sync-to-prod time = CI duration + Render deploy time = ~10–15 min if CI is fast. Acceptable for soft-launch SLAs.
- **Drift detection.** Weekly cron (workshop): compare workshop allowlist payload SHA vs latest mirror sync commit SHA. Mismatch → email/Slack alert. Cheap to implement (~30 LOC).

### 2.5 CI/CD impact

- **Workshop CI**: unchanged. Fast inner loop (unit + integration + lint) on every PR.
- **Mirror CI**: full regression on every sync push (lint + unit + integration + security + e2e + gitleaks + npm audit + brand-rendering + sync-integrity). Slower, deeper gate.
- **GitHub Actions minutes**: roughly doubles. Workshop currently runs ~6 jobs per PR; mirror adds another ~6–8 jobs per sync. GitHub free tier = 2,000 min/mo per org; at typical sprint cadence (~30 syncs/month × ~15 min each = 450 min/sync surface) we stay within free tier for now, but worth monitoring. **Action**: add a min-tracker check to the monthly review.
- **CI secret surface**: mirror needs its own secret set (`MONGODB_URI` for test DB in CI, `JWT_SECRET`, possibly `OPENAI_API_KEY` for E2E that exercises AI features). These must be in `bramhilabs-us/YSELA` repo secrets, separate from workshop secrets. **Rotation policy**: rotate when an engineer leaves; rotate after any suspected leak.

### 2.6 Process impact

| Process | Before | After Sprint 28 |
|---|---|---|
| Where do I commit a feature? | Workshop `development` branch | Same — workshop `development` |
| Where do I commit a hotfix for live customers? | Workshop → push to `production` | Workshop → sync → mirror → promote to `main` |
| How does the customer get a bug fix? | Push to `production` branch of workshop, Render deploys | Push to `development` of workshop, sync mirror, mirror CI green, mirror promote to `main`, Render deploys mirror |
| What does "shipping" mean? | One step (push to prod branch) | Two steps (workshop merge + mirror promote) — the second is gated by mirror CI |
| Who can merge to mirror `main`? | N/A | Branch protection: required CI + 1 review (you, until handover) |
| Drift detection | N/A | Weekly cron (workshop side) |

The biggest process delta: **a second gate exists between merging to workshop `development` and customers seeing a change**. This is good — it's the regression gate. It's also a friction tax — fast hotfixes are no longer instant. The mirror CI duration is the floor on customer-facing fix latency.

### 2.7 Cost impact

| Category | Estimated cost / mo | Notes |
|---|---|---|
| MongoDB Atlas (3 tiers) | ~$60–120 | dev free M0; staging + prod paid |
| Render (3 services) | ~$40–60 | depending on tier |
| Mailjet | $0 additional | Existing plan covers sender name change |
| DNS | $0 additional | ysela.ai already owned |
| GitHub Actions minutes | $0 within free tier | Monitor — may need paid bump at higher cadence |
| Backup storage | ~$10–30 | Atlas backup retention |
| **Estimated total run-rate add** | **~$110–210 / mo** | First year ≈ **$1,300–2,500** |

### 2.8 Risk impact (delta beyond Master Plan §Risk Register)

The Master Plan covers 8 risks. Two ADDITIONAL test-coverage-specific risks worth surfacing:

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Existing 50% coverage threshold is too low for customer-facing repo** | High (it IS too low) | Medium (silent regressions reach customers) | New L.4f slice lifts threshold to 60% in S28, with a roadmap to 70% in S29 — proposed below |
| **Brand-rendering regression has zero test coverage today** | Certain (no tests exist) | High (a Karvia logo or "Karvia" title leaking to live YSELA = brand integrity break) | New L.4g slice ships a brand-rendering test suite |
| **No test asserts that synced payload contains NO denylisted files** | Certain (sync doesn't exist yet) | Critical (one bad allowlist commit = R&D leak to private customer-facing repo) | New L.4h slice ships a sync-integrity test that runs in workshop CI before any sync executes |

### 2.9 Test-coverage impact (the central concern)

Today's state: 50% Jest coverage, 0% brand-rendering, 0% sync-integrity. After Sprint 28: 60% Jest (target), 100% brand-rendering on touched surfaces, 100% sync-integrity gate.

See §3 + §5 for the gap analysis and target schedule.

---

## 3. Test-coverage gap analysis — 7 categories

Each category names what's missing, what to add, where it lives, and rough effort.

### 3.1 Category A — Sync-mechanism tests (NEW — none exist today)

The sync GitHub Action is the most safety-critical new code in S28. If it ships wrong, R&D leaks to the customer repo. Tests must exist BEFORE the first real sync runs.

| Test | File | Asserts | Effort |
|---|---|---|---|
| Allowlist completeness | `tests/sync/allowlist-completeness.test.js` | Every file in workshop tree appears in EITHER `allowlist.txt` OR `denylist.txt`. Uncategorised file → fail. | 1h |
| Denylist enforcement | `tests/sync/denylist-enforcement.test.js` | Synced payload contains zero files matching denylist patterns (`.claude/`, `KARVIA_STRATEGY/`, `YSELA/`, `iBRAIN_Integration/`, `bramhi/`, `docs/bramhi-*`, sprint docs, audit docs). | 1h |
| Secret-shape scan | `tests/sync/secret-scan.test.js` | Synced payload contains no strings matching known secret patterns (API key shapes, JWT shapes, AWS key shapes). Gitleaks delegated for deep scan; this test is the fast fail. | 1.5h |
| Brand-swap correctness | `tests/sync/brand-swap.test.js` | After brand-swap pass, public-facing files contain "Ysela" not "Karvia"; engine identifiers remain `karvia`. | 1.5h |
| Sync-commit message format | `tests/sync/commit-message.test.js` | Synthetic commits match `Sync from karvia_business@<sha>` format with file manifest. | 30m |

**Category A total: ~5.5h**

### 3.2 Category B — Brand-rendering regression (NEW — none exist today)

Per Master Plan acceptance criterion #1 (Ysela logo + page titles + footer render on www.ysela.ai). No existing test asserts this; today it's a visual-QA gate. We need automation.

| Test | File | Asserts | Effort |
|---|---|---|---|
| Page-title sweep | `tests/integration/brand-title-sweep.test.js` | Every HTML page in `client/pages/` has `<title>` containing "Ysela", no occurrence of "Karvia" in title. | 1h |
| Footer presence | `tests/integration/brand-footer.test.js` | Every page renders the footer partial with copy `Powered by KARVIA Ecosystem · A BRAMHI LABS product`. | 1h |
| Logo asset presence | `tests/integration/brand-logo.test.js` | `client/images/yselalogo.png` exists; no surviving references to `karvialogo*` or `CD_Logo_*` on user-facing pages (these are per Master Plan deferrals but the regression must not silently re-introduce them). | 45m |
| brand-config.js env-driven | `tests/unit/brand-config.test.js` | Reading `process.env.APP_NAME` returns the configured brand string; default falls back to "Ysela". | 30m |
| Playwright visual smoke | `KARVIA_STRATEGY/.../bst/brand-rendering.spec.js` | Headless browser loads login + dashboard + objectives pages; screenshots logo + footer; diff against baseline. (Visual regression, optional — defer to S29 if visual-diff infra not ready.) | 2h (optional) |

**Category B total: ~3.25h (5.25h with optional Playwright)**

### 3.3 Category C — Domain / URL invariants (PARTIAL — `APP_URL` invariant exists, untested)

Master Plan invariant #3 says "Single env-var for base URL — `APP_URL` remains sole source per `EMAIL_DEEP_LINK_CONTRACT`. No hardcoded URLs." This is undocumented in tests today.

| Test | File | Asserts | Effort |
|---|---|---|---|
| No hardcoded workshop domain | `tests/integration/no-hardcoded-urls.test.js` | Grep across `client/` + `server/` for `karvia-business.onrender.com`, `karvia.com`, etc. → must be zero outside test fixtures + comments. | 1h |
| APP_URL drives email deep links | `tests/integration/email-deeplink-uses-app-url.test.js` | Setting `APP_URL=https://example.com` causes all generated email URLs to begin with `https://example.com`. | 1h |
| APP_URL drives FE redirects | `tests/integration/fe-redirect-uses-app-url.test.js` | Same assertion for any FE redirect helpers. | 45m |

**Category C total: ~2.75h**

### 3.4 Category D — Mirror-CI gates (PARTIAL — workshop CI exists, mirror CI is greenfield)

L.4b + L.4c in Master Plan already commit to lint + unit + integration + build verify + gitleaks + npm audit + Dependabot + eslint-plugin-security + .env block-staging check on the mirror. These are CI YAML changes, not test code. Effort already in plan (3–5h + 3–5h).

**Additional gates that should ship with mirror CI** (additive proposal):

| Gate | Asserts | Effort |
|---|---|---|
| Brand-rendering job | Run category B tests in mirror CI | +30m on top of L.4b |
| Sync-integrity job | Run category A tests in workshop CI, mirror CI re-runs as belt-and-suspenders | +30m on top of L.4b |
| URL-invariant job | Run category C tests in mirror CI | +30m on top of L.4b |
| Coverage threshold lift | Mirror's `jest.config.js` enforces 60% (was 50% on workshop) | +30m |

**Category D additive total: ~2h**

### 3.5 Category E — End-to-end mirror integrity (NEW)

| Test | File | Asserts | Effort |
|---|---|---|---|
| Post-sync commit shape | `scripts/test-mirror-sync-integrity.js` | After a real sync run (in CI staging env), the mirror repo's latest commit message matches `Sync from karvia_business@<sha>` AND the file set on mirror equals allowlist ∩ workshop tree. | 2h |
| Drift detector cron | `scripts/cron-detect-mirror-drift.js` | Weekly: SHA on workshop's `development` branch vs SHA referenced by latest mirror sync. If diverged > 7 days → alert. | 2h |

**Category E total: ~4h**

### 3.6 Category F — Coverage uplift on existing touched surfaces

| Surface | Current coverage (estimated) | Target | Effort |
|---|---|---|---|
| `client/js/brand-config.js` | 0% (file doesn't exist yet) | 100% on creation | (in L.5) |
| Footer partial (NEW component) | 0% | Render test (Category B) | (in L.5) |
| `client/js/common.js` (touched by brand sweep) | unknown | maintain or improve | 1h audit |
| `client/js/navigation.js` (touched if footer is in nav) | unknown | maintain or improve | 1h audit |

**Category F total: ~2h audit + uplift inline with implementation**

### 3.7 Category G — Multi-environment smoke tests (NEW)

After mirror deploys to 3 envs (dev/staging/prod), need automated smoke that each env is alive.

| Test | File | Asserts | Effort |
|---|---|---|---|
| Health endpoint per env | `scripts/smoke-mirror-envs.js` | `GET /api/health` returns 200 with expected env name + version SHA from each of 3 mirror envs. | 1.5h |
| DB connection per env | (inline in health endpoint) | Health check verifies Mongo connectivity. **Note**: server already has `/api/health` (per existing infra) — verify it surfaces env name + Mongo state. If not, add. | 1h |

**Category G total: ~2.5h**

### 3.8 Summary — new test work

| Category | Effort | Required for S28 close? |
|---|---|---|
| A — Sync mechanism | 5.5h | YES (blocks first sync) |
| B — Brand rendering | 3.25h (+2h optional) | YES (blocks acceptance #1) |
| C — URL invariants | 2.75h | YES (blocks acceptance #3) |
| D — Mirror CI gates (additive) | 2h | YES (extension of L.4b/c) |
| E — Mirror integrity | 4h | YES (blocks acceptance #4–5) |
| F — Coverage uplift | 2h | YES (inline with L.5) |
| G — Multi-env smoke | 2.5h | YES (blocks acceptance #6) |
| **Total new test effort** | **~22h** | |

**This is ~22h of test work on top of the Master Plan's existing 17–28h. Sprint 28 grows from 17–28h → 40–50h focused work = ~6–8 working days.**

That's a meaningful expansion. Worth being honest about it. The 22h is not optional — without it, the "comprehensive regression" the user asked for doesn't exist.

---

## 4. Proposed additive slices for Master Plan

These are PROPOSED additions to `SPRINT28_MASTER_PLAN.md §Locked Scope`. Do not edit Master Plan until user greenlight.

| # | Slice | Effort | Owner | Notes |
|---|---|---|---|---|
| **L.4f** | **Sync-integrity test suite** (Category A above): allowlist completeness + denylist enforcement + secret-shape scan + brand-swap correctness + commit-message format. Runs in workshop CI as a pre-flight gate; mirror CI re-runs as belt-and-suspenders. | 5.5h | QA | Blocks first sync execution |
| **L.4g** | **Brand-rendering regression suite** (Category B above): page-title sweep + footer presence + logo asset presence + brand-config env-driven test. Optional Playwright visual smoke deferred to S29. | 3.25h | QA | Blocks acceptance criterion #1 |
| **L.4h** | **URL-invariant + mirror-integrity tests** (Categories C + E above): no-hardcoded-URL grep + APP_URL drives email/FE redirects + post-sync commit shape + drift detector cron. | 6.75h | QA + Ops | Blocks acceptance criteria #3, #4, #5 |

Plus implicit additions baked into existing slices:

- **L.4b extended** (+2h): mirror CI YAML adds brand-rendering job + sync-integrity job + URL-invariant job + coverage-threshold-lift step
- **L.5 extended** (+2h): brand-config.js + footer partial ship with co-located unit tests (Category F)
- **NEW slice L.4i** (multi-env smoke): `scripts/smoke-mirror-envs.js` + health-endpoint augmentation if needed. 2.5h.

**Cumulative effort delta**: +20h to Master Plan's 17–28h = **37–48h total** for Sprint 28. Calendar window grows to ~2.5 weeks.

---

## 5. Coverage target schedule

| Snapshot | Jest global coverage | Brand-rendering coverage | Sync-integrity coverage |
|---|---|---|---|
| **Today (baseline)** | 50% threshold | 0% | 0% |
| **S28 close (target)** | 60% threshold | 100% on touched surfaces | 100% gate in CI |
| **S29 close (target)** | 65% threshold | 100% + visual regression | maintained |
| **Pre-Beta (target)** | 70% threshold | 100% + visual regression | maintained + drift detector cron live |

Threshold lift comes from: (a) brand-config + footer + sync-script themselves being NEW code at 100% coverage from day 1, dragging global up; (b) the touched-surface audit in Category F catching gaps in existing files.

**Note**: lifting global threshold to 60% may surface existing low-coverage files that need attention before CI goes green. This is healthy debt-paying. If a specific surface is below threshold and out of scope to fix this sprint, exclude it from `coveragePathIgnorePatterns` with a clear comment and a deferred-cleanup ID per `feedback_cleanup_boundary_pattern`.

---

## 6. Execution sequence (recommended for `/coding` sessions)

Per `feedback_session_bifurcation`, split the work into focused sessions:

### Session 1 — Sync mechanism + integrity tests (Category A + L.4a)
- Write the GitHub Action `sync-to-ysela.yml`
- Write the sync script (allowlist + denylist + brand-swap pass)
- Write Category A test suite
- Dry-run sync to a throwaway test repo (NOT bramhilabs-us/YSELA yet)
- Effort: ~8–10h

### Session 2 — Mirror repo bootstrap (L.4 + L.4d + L.4e)
- Initial code-only push to `bramhilabs-us/YSELA` (real first sync)
- Set up mirror CI (L.4b + L.4c + L.4g + L.4h additions)
- Set up Mongo Atlas + Render services for 3 envs
- Branch protections + CODEOWNERS
- Effort: ~10–12h

### Session 3 — Brand chrome + tests (L.1 + L.1a + L.1.5 + L.5 + Category B)
- Logo swap + title sweep + footer partial + brand-config
- Co-located brand-rendering tests
- Effort: ~6–8h

### Session 4 — Email + domain (L.2 + L.3 + Category C)
- Mailjet sender name flip
- DNS bind for www.ysela.ai
- URL-invariant tests
- Effort: ~4–6h

### Session 5 — Multi-env smoke + acceptance (Category G + acceptance walk)
- `scripts/smoke-mirror-envs.js` against dev + staging + prod
- Full acceptance criterion walk per Master Plan §Acceptance Criteria
- Drift detector cron live
- Effort: ~5–6h

**Total: 5 focused sessions, ~33–42h work** (less than the cumulative estimate because some tests ship co-located with implementation).

---

## 7. Risk-vs-reward summary

### What this work BUYS

1. **A regression gate between workshop changes and YSELA customers.** Without category A + B + C, every workshop change risks leaking R&D, broken branding, or wrong domains to live customers.
2. **A safety net for the "spanning to multiple products" future.** The sync-integrity tests are the contract that lets future product mirrors reuse the same machinery without redesigning the safety story.
3. **A documented test coverage baseline that grows.** Today's 50% threshold has no roadmap. This plan lifts it to 60% in S28, 65% in S29, 70% pre-Beta — concrete, measured, enforceable in CI.
4. **Drift detection.** Without category E's weekly cron, the mirror can silently fall behind workshop changes for weeks before anyone notices.

### What this work COSTS

1. **~20h additional sprint effort.** Sprint 28 grows from 17–28h to 37–48h. Calendar slips from 1.5–2 weeks to 2.5–3 weeks.
2. **~$110–210/mo new infra run-rate.** Real ongoing cost.
3. **Process friction.** Hotfixes for live YSELA customers go through one extra CI gate (~10–15 min latency floor).
4. **CI minutes pressure.** Roughly doubles. Stay within GitHub free tier at current cadence; budget for paid tier if cadence increases significantly.

### What this work DOESN'T solve

1. **Multi-product extraction.** Per Master Plan §Out-of-Scope, "do not build a full factory framework upfront." Deferred until product #2 surfaces actual variation. This impact analysis honors that.
2. **Visual regression infra.** Category B's Playwright visual smoke is optional, deferred to S29 if pixel-diff infra isn't ready.
3. **Customer data migration.** User has confirmed: fresh start, no data migration. This plan does not budget for it.
4. **Reverse-sync flow.** No automated mechanism for hotfixes that originate on the mirror. Discipline rule + branch protection. If this becomes a real pain point post-launch, revisit in S29+.

---

## 8. Open questions to resolve at S28 kickoff

These extend the 5 Open Questions in [SPRINT28_HANDOFF_DOCUMENT.md](SPRINT28_HANDOFF_DOCUMENT.md):

6. **Coverage threshold lift** — 50% → 60% in S28 close? Lower if too aggressive? Higher if appetite is there?
7. **Visual regression** — defer Playwright visual smoke to S29, or include in S28 (adds ~2h + baseline-image management)?
8. **Mirror CI cost cap** — set a hard cap on GitHub Actions minutes per sync, fail fast if a runaway test loop burns through?
9. **Drift detector destination** — email, Slack, GitHub issue auto-open? Pick one channel.
10. **Smoke test cadence** — run multi-env smoke on every sync, or daily, or on-demand?

---

## 9. Decision asks (for the user)

Before execution begins, three explicit greenlight decisions:

1. **Approve the 3 new slices L.4f / L.4g / L.4h** (and the +2h additions to L.4b + L.5)? If yes, I'll propose the exact diff to Master Plan for your review before editing.
2. **Approve the coverage target schedule** (50% → 60% in S28 close)? Or pick a different target.
3. **Approve the 5-session execution sequence**? Or restructure (e.g., combine sessions to reduce context-switching cost).

Until these three are answered, the impact analysis is the deliverable; no Master Plan edits, no code, no infra spend.

---

## References

- [SPRINT28_MASTER_PLAN.md](SPRINT28_MASTER_PLAN.md) — locked scope, invariants, deferrals (DO NOT REDESIGN)
- [SPRINT28_HANDOFF_DOCUMENT.md](SPRINT28_HANDOFF_DOCUMENT.md) — pre-launch status, open questions
- [.github/workflows/test.yml](../../../../.github/workflows/test.yml) — existing workshop CI matrix
- [scripts/sync-production.sh](../../../../scripts/sync-production.sh) — existing intra-repo sync precedent
- [tests/jest.config.js](../../../../tests/jest.config.js) — current 50% threshold + exclusions
- [EMAIL_DEEP_LINK_CONTRACT.md](../../../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) — `APP_URL` invariant source
- Memory rule: `feedback_minimal_change_grounding` — additive only, no Master Plan redesign
- Memory rule: `feedback_canonical_engine_grounding` — every category grounded in existing 45-file baseline before scoping new
- Memory rule: `feedback_no_destructive_without_greenlight` — propose, surface, ask before editing Master Plan
- Memory rule: `feedback_state_parsimony` — drift detector chosen over persistent mirror-state tracking
- Memory rule: `feedback_session_bifurcation` — 5-session execution split with explicit context handoff
