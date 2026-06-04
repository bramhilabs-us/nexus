# Sprint 28 — Ysela Soft Launch + Factory Seams

<!-- @GENOME T3-SPR-028-MP | DRAFT | 2026-06-02 | parent:T1-PRD-002 | auto:/strategy,/coding | linked:/init,/close -->
<!-- 2026-06-02 — /strategy lean pivot. Cross-repo mirror (L.4 series) + factory seams (L.5) + comprehensive test uplift (per SPRINT28_IMPACT_ANALYSIS.md) all deferred to Sprint 31. S28 scope reduced to brand-chrome + Mailjet sender + domain bind + Render rebind of karvia-business-2 → ysela branch. Sprint Window 17-28h → 4-6h. Footer copy simplified from three-tier to "Powered by BRAMHI Labs" per user direction (memory: project_bramhi_labs_factory_model 2026-06-02 update). -->

**Status**: 🟢 ACTIVE-PLAN — lean-pivoted 2026-06-02 /strategy session
**Sprint Goal**: First user-facing rebrand to Ysela. Existing infra reused (karvia-business-2 Render service repurposed; pre-prod Mongo shared). www.ysela.ai goes live with Ysela logo + page titles + Ysela email sender. No cross-repo work; no new infra. Factory seams + canonical mirror deferred to Sprint 31.
**Sprint Window**: ~1 week calendar / **4–6h focused work** + 24h DNS propagation wait
**Launch Gate**: Sprint 26 closed (✅ 2026-05-30) AND Sprint 27 closed (E.1a/b/c/d shipped + smoke-tested — currently 17/23 firing, 5 user-gated)

---

## Strategic Framing — Why This Sprint Exists

Per [ECOSYSTEM_ARCHITECTURE.md](../../../../ECOSYSTEM_ARCHITECTURE.md), the originally-planned end-state is:

> **KARVIA = invisible OKR engine. Products wrap KARVIA. Users see the product, not the engine.**

Sprint 28 operationalizes that for the first time: **Ysela is the first product wrapper**. User-facing chrome flips to Ysela (logo, page titles, email sender, domain). Engine layer keeps the "powered by Karvia" credit. Future products are additional wrappers — same engine, different brand.

**Software-factory framing** (per user direction 2026-05-28): each launch = fresh GitHub repo (code-only) + brand asset swap + domain bind. Sprint 28 ships the YSELA wrapper AND lays minimum seams (env-driven brand config + 1-page playbook) so launch #2 is mechanical.

**2026-06-02 lean pivot** (per user direction): Sprint 28 trimmed to **user-facing brand chrome only**. No cross-repo mirror, no new MongoDB, no new Render service, no factory seams this sprint. Reasoning: factory infrastructure isn't justified until evidence of product #2 emerges; soft launch goal (Ysela live at www.ysela.ai with Ysela branding + Ysela emails) doesn't require it. All deferred work carries forward to Sprint 31 — see [SPRINT-31-Canonical-Mirror](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md) and [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md) (the impact analysis remains the source of truth for what S31 will execute).

**Explicit NON-goal**: Do NOT build a full "factory framework" upfront. Wait for product #2 to surface what actually varies. Per `feedback_minimal_change_grounding` and `feedback_extend_before_wrap` — seams emerge from evidence, not speculation.

---

## Locked Scope — Lean S28 (2026-06-02 pivot)

| # | Slice | Effort | Owner | Status |
|---|---|---|---|---|
| **L.0** | Create `ysela` branch from `production` (single source of truth for Ysela user-facing chrome) | 5m | Ops | ⏳ |
| **L.1** | Swap logo asset on `ysela` branch — replace visible Karvia/CD logo references in header/nav/login with `client/images/yselalogo.png` (✅ landed 2026-05-28) | 30-45m | FE | ⏳ |
| **L.1a** | Footer partial (reusable component, used by all main pages) — copy: `Powered by BRAMHI Labs` (single-line, locked 2026-06-02 — supersedes three-tier 2026-05-28 attribution per user direction; engine attribution becomes internal-only) | 30-45m | FE | ⏳ |
| **L.1.5** | Page-title sweep on `ysela` branch — bulk replace `<title>` across 33 HTML pages: `Karvia*` / `KARVIA*` variants → `Ysela`. CD + Chief AI titles deferred per L.6. | 45m-1h | FE | ⏳ |
| **L.2** | `MAILJET_FROM_NAME=Ysela` env var on the karvia-business-2 Render service (the one being repurposed). Inbox sender preview flips. Body content unchanged this sprint. | 10m | Ops | ⏳ |
| **L.3a** | **Repoint karvia-business-2 Render service from `pre-prod` branch → new `ysela` branch.** Pre-prod Mongo URI stays as-is (shared, accepted tradeoff). Update env vars: `MAILJET_FROM_NAME=Ysela` (L.2), `APP_URL=https://www.ysela.ai`. | 15m | Ops | ⏳ |
| **L.3b** | Bind `www.ysela.ai` as custom domain on karvia-business-2 (already-repurposed Render service from L.3a). Add 301 redirect `karvia-business-2.onrender.com` → `https://www.ysela.ai` if Render's UI supports it trivially; otherwise leave the onrender.com URL serving Ysela content. | 30-45m + DNS wait | Ops | ⏳ |
| **L.3c** | **Brand-rendering smoke test (slim)** — Jest integration test asserting (a) every HTML page in `client/pages/` has `<title>` containing "Ysela", zero "Karvia" in titles; (b) every page renders footer `Powered by BRAMHI Labs`; (c) `client/images/yselalogo.png` is referenced on at least login + dashboard + objectives pages. Lives at `tests/integration/brand-rendering-smoke.test.js`. | 1-2h | QA | ⏳ |
| **L.3d** | Pre-flip sanity walk — manually load login + dashboard + objectives + planning-v2 + weekly-goals pages from the `ysela` branch deploy BEFORE DNS cutover; confirm no surprise "Karvia" leaks in user-facing chrome. | 30-45m | Ops+FE | ⏳ |

**Lean S28 total: 4–6h focused work + 24h DNS propagation**

---

## Deferred to Sprint 31 (carry-forward — see [SPRINT-31-Canonical-Mirror](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md))

| # | Slice | Effort | Why deferred 2026-06-02 |
|---|---|---|---|
| **L.4** | Initial code-only push → `bramhilabs-us/YSELA` (private) | 2-3h | Cross-repo mirror not justified until product #2 evidence emerges; soft launch goal met without it. |
| **L.4a** | Sync mechanism (GitHub Action mirror) | 2-4h | Same. |
| **L.4b** | GitHub Actions CI on bramhilabs-us/YSELA | 3-5h | Same — workshop CI continues to gate. |
| **L.4c** | Security/privacy CI gates on mirror | 3-5h | Same. |
| **L.4d** | Render rebind to bramhilabs-us/YSELA | 2-3h | karvia-business-2 lean repurpose (L.3a) replaces this for S28; full rebind in S31. |
| **L.4e** | Branch protection on bramhilabs-us/YSELA | 30-60m | Same — mirror doesn't exist yet in lean S28. |
| **L.5** | Factory seams (`client/js/brand-config.js` + `BRANDING.md`) | 1-2h | No second product yet; env-driven brand config justified only when product #2 starts. |
| **L.4f / L.4g / L.4h / L.4i** | Test coverage uplift (~22h across 7 categories) | 22h | Per [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md) — comprehensive regression needed for cross-repo confidence; not needed for lean repurpose. |

**Deferred total: ~37–48h → Sprint 31**

---

## Deferred (out of Sprint 28 — captured in REFINEMENT-BACKLOG)

| Deferred Item | Why Deferred | When To Revisit |
|---|---|---|
| **L.6** Kill or fold Cultural Discipline + Chief AI brands (3 assessment pages + dashboard-v2 + `CD_Logo_*.png` + `ChiefAI_Logo.svg`) | User explicitly deferred 2026-05-28 | Post-launch sprint when measurable user-friction surfaces from competing brand names |
| Brand palette migration (Ysela blue+orange → replace Karvia navy+gold across CSS tokens) | Out of lean-launch scope; ~8-12h work; logo-only swap is acceptable for soft launch | Sprint 29+ if/when user direction confirms palette migration |
| Email body content sweep (~2,080 LoC across `mailjetService.js` + `emailTemplates.js`) | Sender name flip (L.2) covers inbox preview; body content "powered by Karvia" framing acceptable for soft launch | Measured against user feedback post-launch |
| JS/CSS comment + console.log "Karvia" mentions (~830 occurrences) | Non-user-facing; pure cosmetic | Never (per "extend before wrap" — code identifiers stay `karvia` as engine layer) |
| Logo SVG conversion + size optimization (`yselalogo.png` is 796KB; <100KB target for per-page asset) | Acceptable for soft launch; not blocking | Sprint 29+ polish — convert to SVG OR WebP, lazy-load if kept as raster |
| Email body sender domain change (`MAILJET_FROM_EMAIL`) | Requires SPF/DKIM verification on ysela.ai mail domain (24-48h propagation, additional Mailjet config) | Sprint 29 — separately tracked launch readiness item |
| Sprint 27 E.1a/b/c/d wizard restructure carry | Sprint 27 close blocker — NOT a Sprint 28 item | Sprint 27 must close before Sprint 28 starts |

---

## Sync Strategy Decision — DEFERRED TO SPRINT 31

**Original decision (2026-05-28)**: A2 sync mechanism — GitHub Action mirrors code-only subset to `bramhilabs-us/YSELA` on push.

**2026-06-02 status**: Decision preserved for Sprint 31 execution. Lean S28 does NOT ship the mirror; karvia-business-2 lean repurpose (L.3a) replaces the cross-repo deployment for the soft launch. See [SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md) for the carry-forward.

**Reasoning preserved for S31**:
- A2 ships fastest once justified (product #2 emerges OR client demands code handover)
- Docs (`KARVIA_STRATEGY/`, `.claude/`, sprint handoffs) stay where they live; no cross-repo coordination friction
- CI/CD runs in `bramhilabs-us/YSELA` once mirror exists
- Mirror script = ~50 LoC GitHub Action; failure mode is visible (Action fails red)

**Trade-off accepted (S31)**: Mirror Action could drift silently if it fails AND we don't notice. Mitigation: Action failure sends email/Slack notification + visible badge in this repo's README + weekly drift-detector cron.

---

## Acceptance Criteria — Lean S28

Sprint 28 (lean) is **done** when ALL of the following pass:

1. ✅ `https://www.ysela.ai` loads the running app with Ysela logo + page titles + `Powered by BRAMHI Labs` footer
2. ✅ Signup flow triggers email with sender displayed as "Ysela" in recipient inbox
3. ✅ Email deep-links contain `ysela.ai` domain (not `karvia-business-2.onrender.com`)
4. ✅ Brand-rendering smoke test (L.3c) passes in workshop CI: zero "Karvia" in `<title>`; footer present on all main pages; logo rendered
5. ✅ Pre-flip sanity walk (L.3d) confirms no surprise "Karvia" leaks across login + dashboard + objectives + planning-v2 + weekly-goals
6. ✅ karvia-business-2 Render service deploys from `ysela` branch + shows correct `APP_URL` env var
7. ✅ Full manual smoke: signup → email lands as Ysela → click-through to ysela.ai → app works end-to-end (engine-level functionality unchanged from karvia-business prod)

**Deferred acceptance criteria** (carried to Sprint 31):
- Cross-repo mirror `bramhilabs-us/YSELA` populated + CI green
- Branch protection on mirror main
- `client/js/brand-config.js` env-driven + `BRANDING.md` shipped
- Comprehensive regression suite per [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md)

---

## Architectural Invariants (do not violate)

1. **Engine identifier stays `karvia`** — package.json name, internal module names, server constants, MongoDB collection names. Per `ECOSYSTEM_ARCHITECTURE`, KARVIA is the invisible engine layer.
2. **Single-line BRAMHI Labs attribution** (locked 2026-06-02, supersedes 2026-05-28 three-tier) — every product wrapper renders the footer: `Powered by BRAMHI Labs`. KARVIA Ecosystem reference becomes internal-only (code identifiers, internal docs). BRAMHI Labs accumulates customer-facing trust directly across N product launches. **Strategic implication accepted**: cleaner customer chrome at the cost of visible engine-attribution accumulation.
3. **Single env-var for base URL** — `APP_URL` remains sole source per `EMAIL_DEEP_LINK_CONTRACT`. No hardcoded URLs.
4. **No history rewrite on the new repo** — `git log` verified clean (`.env` never committed across 903 commits). Initial push is clean snapshot from `development` head; full history NOT copied (cleaner start).
5. **No secret in CI logs** — secrets injected via GitHub Actions secrets, never echoed.
6. **Blue-green Render rebind** — production must NOT have downtime > 1 minute during cutover. **Lean S28 nuance**: karvia-business-2 is being repurposed (not the main `karvia-business` prod service); switching it from `pre-prod` branch → `ysela` branch has minimal blast radius since pre-prod is hardly used. Main prod (karvia-business.onrender.com) is unaffected.
7. **Shared pre-prod Mongo accepted for lean S28** — karvia-business-2 (now Ysela soft-launch) and any leftover pre-prod QA workflows share one database. Acceptable for soft launch with <10 real users + internal QA. **S31 carries**: separate YSELA Mongo when cross-repo mirror launches OR when real-customer count justifies isolation.

---

## Prerequisites (must be true before Lean S28 starts)

- [x] **Sprint 26 closed** ✅ 2026-05-30 — 5-verb continuation acceptance test passes end-to-end
- [ ] **Sprint 27 closed** — E.1a/b/c/d wizard restructure shipped + smoked + E.9 regression suite green (currently 17/23 firing, 5 user-gated on wizard fresh-review)
- [x] Ysela logo asset saved at `client/images/yselalogo.png` (1448×1086 PNG, verified 2026-06-02). SVG not yet provided — PNG acceptable for soft launch; SVG conversion + size optimization listed as Sprint 31+ polish
- [x] DNS access to ysela.ai registrar — confirmed 2026-05-28
- [x] `bramhilabs-us` GitHub org created with repo `YSELA` (private) — confirmed 2026-06-02. **Note**: not needed for lean S28; carries to S31.
- [ ] Mailjet account confirms `Ysela` as approved sender name (`MAILJET_FROM_NAME` flip)
- [x] karvia-business-2 Render service access confirmed (existing pre-prod service to be repurposed)

---

## Risk Register — Lean S28

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| karvia-business-2 rebind affects in-flight QA work | Low (pre-prod hardly used per user) | Low | Confirm no active QA fixtures expected on karvia-business-2 before rebind |
| DNS propagation delays launch by 24-48h | Medium | Low | Start L.3b early in sprint; treat as parallel async work |
| Mailjet SPF/DKIM not configured for ysela.ai mail | Low (sender NAME only, not domain) | Low this sprint | Email body domain change deferred — only sender NAME changes |
| Competing brands (CD, Chief AI) visible at launch | High | Low (acceptable for soft launch) | Documented in deferral; revisit post-launch |
| Logo blue palette clashes with Karvia navy/gold UI chrome | Low (palettes are close) | Low (cosmetic) | Visual QA during L.1; full palette migration is separate deferred sprint |
| "Karvia" string leaks through to user-facing chrome (e.g., in some HTML title) | Medium (no automated regression today) | Medium (brand integrity break) | L.3c brand-rendering smoke test + L.3d pre-flip sanity walk both gate the launch |
| Sprint 27 E.1 carry slips, blocking Sprint 28 start | Medium | Medium (calendar slip) | Sprint 27 closes BEFORE Sprint 28 starts — no parallel work |
| Shared pre-prod Mongo data sharing surprises an internal QA workflow | Low | Low (revert env vars if needed) | Internal comms before rebind; pre-prod QA workflows pause for the sprint |
| Loss of pre-prod staging environment | Certain (it's being repurposed) | Low (per user: hardly used) | If staging becomes needed later, create a new Render service from `pre-prod` branch — no conflict since lean S28 uses dedicated `ysela` branch |

**Risks deferred to Sprint 31** (carry forward — see [SPRINT-31-Canonical-Mirror](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md)):
- Mirror Action drift, blue-green rebind to mirror repo, secret exposure in cross-repo sync, comprehensive regression coverage. All covered in [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md) §2.8.

---

## Out-of-Scope Reminders — Lean S28

This sprint does NOT:
- Rebrand internal code identifiers (engine stays `karvia`)
- Migrate the brand color palette (logo-only swap)
- Sweep email body content (sender name only — body retains "Karvia" mentions per 2026-06-02 user direction)
- Touch Cultural Discipline / Chief AI brand pages (deferred)
- Build a "factory framework" or brand-config seams (deferred to S31)
- Change domain for outbound email sender (`MAILJET_FROM_EMAIL` stays — needs SPF/DKIM work, S31+)
- Set up `bramhilabs-us/YSELA` cross-repo mirror (deferred to S31)
- Spin up new MongoDB or Render service (lean repurposes karvia-business-2 + shares pre-prod Mongo)
- Comprehensive regression coverage uplift (deferred to S31 per [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md))

---

## References

- [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md) — full impact analysis + test coverage gap analysis (drafted 2026-06-02; source of truth for S31 scope)
- [SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md) — carries forward all 2026-06-02 deferred work
- [ECOSYSTEM_ARCHITECTURE.md](../../../../ECOSYSTEM_ARCHITECTURE.md) — KARVIA + product-wrapper model
- [EMAIL_DEEP_LINK_CONTRACT.md](../../../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) — APP_URL invariant
- [SPRINT-27-First-Task/SPRINT27_HANDOFF_DOCUMENT.md](../SPRINT-27-First-Task/SPRINT27_HANDOFF_DOCUMENT.md) — prerequisite sprint (Sprint 27 must close before Sprint 28 starts)
- [.gitignore](../../../../.gitignore) — verified `.env*` exclusion
- Memory rule: `project_bramhi_labs_factory_model` — 2026-06-02 footer simplification to `Powered by BRAMHI Labs`
- Memory rule: `feedback_minimal_change_grounding` — 2026-06-02 lean pivot is the minimal amendment, not a redesign
- Memory rule: `feedback_state_parsimony` — defer infra (new Mongo / Render / repo) until justified by evidence
- Memory rule: `feedback_extend_before_wrap` — extend env-var pattern, don't wrap a BrandService
- Memory rule: `feedback_no_destructive_without_greenlight` — all five clarifications locked with user before edits
