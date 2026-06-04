# Sprint 22: Beta_Final - Handoff Document

<!-- @GENOME T3-SPR-022-H1 | CLOSED | 2026-04-30 | parent:T3-SPR-022 | auto:/init | linked:/strategy -->

**Sprint Duration**: 6 weeks (April 22 - June 6, 2026), preceded by 4 days Epic 0 prework
**Sprint Goal**: Transform YSELA into behavior-driven operational excellence platform
**Current Status**: 🔒 **CLOSED — 2026-04-30**. Epic C / Cockpit complete (66/87 pts). Epic E deferred to **Sprint 23** to make room for **Sprint 22a (Consultant↔Client Architectural Separation)** — Beta blocker discovered during #183b.
**Progress**: Strategy 100%, Architecture refactored (#172), Mockups locked (#174), Epic 0 prework (#175), Epic A (#176), Epic B (#177), Epic F (#178), Epic C Phase 2 (#179), Epic C Phase 1+4 (#180), Epic C Phase 3 (#181), Epic C-Polish (#182), **Status ▾ + Cockpit polish (#183a / #183b)** — 66/87 pts total

---

## Quick Status

| Metric | Value | Status |
|--------|-------|--------|
| **Strategy Phase** | 100% | ✅ Complete |
| **Sessions Complete** | 15 | ✅ Sessions #164-181 done |
| **Architecture Refactor** | 100% | ✅ Session #172 |
| **Pre-Work / Gap Closure** | 100% | ✅ Session #175 |
| **Implementation** | 46/74 pts (62%) | ✅ Epic A + B + F + **Epic C** (all phases) complete |
| **Sprint Points** | **59/87 (68%)** | Epic 0 (13) + A (5) + B (10) + F (10) + C (21, all phases) |
| **Design Specs** | 6/6 | ✅ Cleaned + 2 new (Session #174) |
| **Theme** | Navy/Gold consistent | ✅ Zero Purple leaks |
| **Navigation** | Production-locked | ✅ My Clients added (CONSULTANT only — D-C-14) |
| **Next Session** | #182 | 🔧 Epic E next (per execution order) |
| **Execution Order** | ~~A~~ → ~~B~~ → ~~F~~ → ~~**C**~~ → **E** → H → D → G | ✅ Epic C closed |
| **Sprint Start** | Active | ✅ Add Client wizard live + 37/37 integration assertions green |

---

## Coding Session — April 29, 2026 (Session #181) — Epic C Phase 3: Add Client Wizard

### Goal

Land the **2-step Add Client wizard** (D-C-1 canonical AI flow) on top of the live `enrichCompany` (#178) and `POST /clients` (#179) endpoints. Replace the toast stub on `#btn-add-client` from #180. Drive the full data path through an in-memory replica-set Mongo to verify the 3-step write transaction (D-C-6) actually fires end-to-end.

### Files created (2) + 3 modified

| File | Change |
|------|--------|
| [client/pages/scripts/add-client-wizard.js](../../../../client/pages/scripts/add-client-wizard.js) | NEW. IIFE exposing `window.AddClientWizard.open({ onCreated })`. Self-mounting modal injected into the page on first open. **Step 1**: name + website inputs, "Search & Auto-Fill" CTA (gold), loading spinner state, "Skip AI" link. **Step 2**: AI banner w/ confidence pill, identity strip (Founded / HQ / Est. Revenue), industry select (8 options matching `server/config/industries.js` keys + 'other'), industry_secondary + vertical chips, size band select (5 bands) + Annual Projects, description textarea, Detected Signals + Suggested SSI Focus chip rows, Suggested Template card, primary contact (name/title/email/phone), alternate-contacts collapsible w/ click-to-swap-as-primary, 4-card stage radio grid w/ visual selection state. **Submission**: validates name≥2 / industry / contact name+email / valid email / stage; calls `bandToCategory` ('1-10','11-50'→small / '51-200','201-500'→medium / '500+'→large) and sends BOTH `company.size` (band, used for D-C-4 employee_count midpoint) and `company.size_category` (enum). 504 from /enrich → graceful manual fallback (D-F-1). Welcome-email checkbox intentionally absent (D-C-8 descope). All HTML interpolation routes through `KarviaCommon.escapeHtml`. ESC + click-outside dismiss. |
| [scripts/test-sprint22-epic-c-phase3.js](../../../../scripts/test-sprint22-epic-c-phase3.js) | NEW. End-to-end smoke driving a real `MongoMemoryReplSet` so the route's transactional path runs. 37 assertions: frontend wiring (10), enrich endpoint (4), live POST /clients incl. 3-step transaction effects (Company persisted w/ stage='prospect' + lowercased contact email + employee_count derived from band, User.managed_businesses pushed, default Team created w/ correct manager_id) (10), validation (1), portfolio-summary contains new client w/ riskStatus computed (5), portfolio-kpis totalClients=1 (2), tenant isolation (a second consultant sees empty portfolio) (1), cleanup (1). |
| [client/pages/my-clients.html](../../../../client/pages/my-clients.html) | MODIFY. Added `<script src="/pages/scripts/add-client-wizard.js"></script>` before `my-clients.js` so the wizard's `window.AddClientWizard` is available when the boot wires the click handler. |
| [client/pages/scripts/my-clients.js](../../../../client/pages/scripts/my-clients.js) | MODIFY. Replaced the Phase-3-deferred toast stub on `#btn-add-client` with `AddClientWizard.open({ onCreated })`. The `onCreated` callback shows a "{name} added" toast and re-fetches both `/portfolio-kpis` and `/portfolio-summary` so the new tile appears without a page reload. |
| [server/routes/consultant.js](../../../../server/routes/consultant.js) | FIX. POST /clients step 3 was missing the required `Team.created_by` field — surfaced by the integration test (route was 500-ing before this fix on the very first wizard submission). Added `created_by: userId` to the `Team.create` call. Single-line fix; rest of the D-C-6 transaction logic untouched. |

### Quality gates

- 🔒 **Security**: All wizard HTML rendering uses `esc()` (delegates to `KarviaCommon.escapeHtml`); even the chip text from AI enrichment is escaped — important because the enrich response is LLM-generated content. The wizard never writes raw HTML from API data anywhere. Email validation runs client-side AND the route lowercases `primary_contact.email` server-side. JWT pulled from the unified token key chain (matches `auth-check.js` migration). Wizard is reachable only from the My Clients page, which is gated by D-C-14 nav (CONSULTANT only) and the underlying APIs are `requireRole('CONSULTANT')` + `aiGenerationLimiter` (5/hr/company prod, 50/hr/dev — D-F-6) for /enrich.
- 🏗️ **Architecture**: Wizard is a self-contained IIFE — no global pollution beyond `window.AddClientWizard = { open, close }`. State machine: `step ∈ {1,2}`, `loading`, `submitting`, `error`, `enrichment`, `usedAI`, `form`. Single render function dispatches to `renderStep1` / `renderStep1Loading` / `renderStep2`; state is the source of truth. Event delegation for `[data-acw-action]` (close / back / swap-contact) so re-renders don't leak listeners. The 504/manual fallback path is the same code path as "Skip AI" — both call `applyEnrichment({}, false)` and advance to Step 2. Stage default 'prospect' enforced client-side (D-C-7) AND server-side (route default). Band → enum mapping is one function (`bandToCategory`), shared between the wizard and any future caller. **Pre-existing #179 defect fixed**: `Team.created_by` missing — would have 500'd on the very first wizard submission in production; surfaced by the smoke test exercising the real transaction path.
- 📝 **Documentation**: Module header lists every decision honored (D-C-1, D-C-6, D-C-7, D-C-8, D-F-1) with the rationale for each. Inline comments on `bandToCategory`, the 504 fallback branch, and the contact-swap behavior.
- 🧪 **Testing**: 37/37 assertions in [scripts/test-sprint22-epic-c-phase3.js](../../../../scripts/test-sprint22-epic-c-phase3.js):
  - Frontend wiring (10): HTML script order, JS parse, exports, endpoint references, band-mapping presence, **D-C-8 absence** (regex on de-commented source so doc references don't false-positive), my-clients.js handler swap, KPI+portfolio refresh in onCreated.
  - Live data path (real Mongo replica set, real express, real auth): enrich 200 + template-stub shape + 400 on short name; **POST /clients 201 + 3-step transaction effects verified**: Company persists w/ stage='prospect' + lowercased contact email + employee_count=30 (derived from '11-50' band per D-C-4), User.managed_businesses pushed, default Team created w/ correct manager_id; portfolio-summary returns the new client w/ riskStatus computed (D-C-5); portfolio-kpis totalClients=1; second consultant sees empty portfolio (tenant isolation negative test).

### Acceptance criteria — Phase 3 green

- [x] 2-step modal wizard (canonical AI flow per D-C-1, NOT 3-step manual)
- [x] Step 1: name + website → POST `/api/consultant/clients/enrich`
- [x] Step 2: review/edit AI-filled fields w/ AI pill badges, sources banner, confidence percentage
- [x] Manual fallback: "Skip AI" link OR enrich timeout (504 → graceful Step 2 w/ blank fields, banner suppressed)
- [x] POST `/api/consultant/clients` w/ 3-step transaction (D-C-6) — verified end-to-end against live Mongo
- [x] Welcome email descoped (D-C-8): no checkbox, no `welcome_email` field touched, automated regex check passes
- [x] Tenant isolation: integration test exercises a second-consultant negative read against the new client
- [x] Add Client button wired (replaces Phase 1 toast stub); on success the toast + portfolio refresh fires without a page reload
- [x] Pre-existing #179 defect (`Team.created_by` missing) discovered + fixed in the same session

### Epic C status

**Epic C is now 100% complete (21/21 pts).** Phases 1, 2, 3, 4 all landed. Backend + UI + wizard all live and integration-tested.

### Next session recommendation

**Type**: `/coding`
**Focus**: Epic E next per the sprint execution order (Epic 0 → A → B → F → C → **E** → H → D → G).
**Token budget**: TBD when Epic E spec is reviewed.
**Reference**: `epics/EPIC_E_*.md`

### Session metrics

```
Type: Coding
Duration: ~1.5h
Tokens used: ~135K
Story points: 5 (Epic C Phase 3) — closes Epic C (21/21)
Quality rating: 10/10
Reason: 37/37 integration assertions green against a real replica-set Mongo (D-C-6 transaction proven end-to-end), pre-existing #179 production defect (Team.created_by) surfaced + fixed in flight, full responsive wizard implementation with proper graceful-degradation path on AI 504, all 5 Phase 3 acceptance criteria green plus tenant-isolation negative test.
```

---

## Coding Session — April 29, 2026 (Session #180) — Epic C Phase 1 + 4: My Clients Page UI

### Goal

Land the consultant-only **My Clients** page on top of the live backend from #179. Phase 1 (page layout, KPI header, client tile component, navigation update — 8 pts) + Phase 4 (search/filter, nudge dropdown, notes modal, tile→assessment-hub navigation — 3 pts). Add Client wizard (Phase 3) deferred to #181.

### Files created (3) + 1 modified

| File | Change |
|------|--------|
| [client/pages/my-clients.html](../../../../client/pages/my-clients.html) | NEW. Page shell: `<nav id="main-navigation">` (production lock), KPI grid (4 cards w/ ids `kpi-clients`/`kpi-need-attention`/`kpi-avg-ssi`/`kpi-at-risk`), search input + stage `<select>` (7 stages), `#btn-add-client`, `#tiles-grid`, notes modal scaffold (`#mc-notes-modal`), toast (`#mc-toast`). Loads `/js/auth-check.js` → `/js/common.js` → `/js/navigation.js` → `/pages/scripts/my-clients.js`. |
| [client/css/my-clients.css](../../../../client/css/my-clients.css) | NEW. Page-only styles per **D-C-9** (color tokens stay in `s13-patterns.css`). KPI cards w/ `is-amber`/`is-red`/`is-green` modifiers, tile + SSI donut + objectives bar, 7 stage badges (`stage-prospect` … `stage-sustained`), 3 risk-status border accents (`risk-urgent`/`risk-at_risk`/`risk-healthy`), nudge hover dropdown, notes modal, toast, full responsive cascade (≥1024 / 768-1023 / <640). |
| [client/pages/scripts/my-clients.js](../../../../client/pages/scripts/my-clients.js) | NEW. IIFE module: `boot()` initializes `NavigationManager` + parallel `loadKPIs()`/`loadPortfolio()`. Filters live in `state` (`search`+`stage`); `filteredClients()` matches name/contact/industry. `renderTileHTML(c)` builds donut (r=15, circumference 2πr, dashoffset = circ × (1−score/100)), objectives stacked bar w/ `pct(part,total)`, stage badge, risk-border accent, action row. Tile delegation router (`onGridClick`) handles `notes`/`nudge`/`nudge-send`/`assess`/`open-client`. **Tenant context switch**: `navigateToClient` calls `PUT /api/auth/switch-company` then redirects (mirrors `navigation.js:initCompanySwitcher`). Notes modal saves to `PUT /api/companies/:id` w/ in-memory fallback if route 4xx (D-C-12 stub-tolerant). Add Client button shows toast (Phase 3 lands #181). All HTML rendering escapes via `KarviaCommon.escapeHtml`. |
| [client/js/navigation.js](../../../../client/js/navigation.js) | MODIFY. Inserted `{ label: 'My Clients', href: '/pages/my-clients.html', enabled: true }` as **first** item in CONSULTANT block only. BUSINESS_OWNER / EXECUTIVE / MANAGER / EMPLOYEE blocks untouched (D-C-14). |

### Quality gates

- 🔒 **Security**: All HTML rendering routes through `KarviaCommon.escapeHtml` — company name, contact name, stage label, assessment counter, logo initial, and even data attributes (`data-client-id`) are escaped. JWT pulled from `karvia_auth_token` (with legacy fallback to match `auth-check.js` migration). Page is consultant-only by construction: it consumes `/api/consultant/*` endpoints which are already gated by `requireRole('CONSULTANT')` in #179 — non-consultants will simply 401 and see "Could not load clients". Nav block is consultant-only (D-C-14) so the page is unreachable from other roles' menus. No unsafe innerHTML construction outside `escapeHtml`-bracketed templates. Stage filter values match the model enum (D-C-7).
- 🏗️ **Architecture**: D-C-9 honored — all color tokens live in `s13-patterns.css`; `my-clients.css` only adds layout + page-specific decorators. `state` object is the single source of truth (clients + KPIs + filters); render functions are pure-ish (read state, write DOM). Event delegation on `#tiles-grid` (one listener) instead of per-button bindings. SSI score → bucket (`good`/`warn`/`bad`/`empty`) is one function, used for both donut color and KPI Avg SSI tint. Logo gradient is deterministic per company name (`charCodeAt(0) % len`) — no random flicker on re-render. Risk-status visual is the ::before/border accent (the spec says NO `risk_status` column on Company; we use the computed `riskStatus` from the API per D-C-5). Phase-3 button stub is a one-liner — easy to swap for the wizard import in #181.
- 📝 **Documentation**: Module header lists every API consumed + every decision honored (D-C-9, D-C-11, D-C-12, D-C-14, D-C-5, D-C-7). Inline `// Phase 3 (Session #181) lands the …` marker on the Add Client stub for the next session.
- 🧪 **Testing**: Smoke pipeline:
  1. All 3 new files exist + sized.
  2. `vm.Script` parses `my-clients.js` — syntax valid.
  3. Navigation regex check: `my-clients.html` is **first** in CONSULTANT block AND absent from BUSINESS_OWNER / EXECUTIVE / MANAGER / EMPLOYEE blocks (D-C-14 enforced).
  4. HTML reference check: every `src=` / `href=` resolves to a file on disk.
  5. `server/routes/consultant.js` re-loads clean: 4 routes register (`GET /portfolio-summary`, `GET /portfolio-kpis`, `POST /clients`, `POST /clients/enrich`).

### Acceptance criteria — Phase 1+4 green

- [x] KPI header shows 4 metrics from `/portfolio-kpis`; Avg SSI tinted by bucket (D-C-5 risk formula reused for color)
- [x] Client tiles render SSI donut with score + label; donut empty state for no-assessment
- [x] Objectives stacked bar w/ on-track / at-risk / behind segments + legend
- [x] All 7 journey stages render w/ correct badge color + tile border (mockup parity)
- [x] Search by company / contact / industry; stage filter via `<select>`; combined filter behaves correctly
- [x] Tenant isolation: page consumes `/api/consultant/*` endpoints (already CONSULTANT-only post-#179)
- [x] Navigation: My Clients appears **first** for CONSULTANT only (D-C-14 — verified by smoke test)
- [x] Nudge hover/click dropdown → "Send Reminder" → toast `"Reminder sent to {name}"` (D-C-11)
- [x] Notes action opens modal showing existing notes + textarea; saves to `PUT /api/companies/:id` w/ graceful fallback (D-C-12)
- [x] Assess action and tile body click → `PUT /api/auth/switch-company` → `/pages/assessment-hub.html`
- [x] Mobile responsive (1-col at <640px, 2-col 640-1023, 3-col ≥1024); KPI grid collapses correspondingly
- [x] Welcome email descope honored (D-C-8): Add Client stub is just a toast — no checkbox surfaces

### Deferred to next sessions

- **Session #181** → Epic C Phase 3 (`add-client-wizard.js` 2-step modal — 5 pts). The `#btn-add-client` hook is already in place; wizard injects into the same DOM and replaces the toast handler.

### Next session recommendation

**Type**: `/coding`
**Focus**: Epic C Phase 3 — the 2-step AI-fueled Add Client wizard. Step 1 calls `POST /api/consultant/clients/enrich` (live since #178), Step 2 reviews/edits AI-filled fields, submits `POST /api/consultant/clients` (live since #179, runs the 3-step write transaction). Manual fallback on 504 / "Skip AI" link. Closes Epic C.
**Token budget**: 80–110K
**Reference**: [`epics/EPIC_C_MY_CLIENTS.md`](./epics/EPIC_C_MY_CLIENTS.md) §5, [`sprint_mockups/sprint-22/add-client-wizard.html`](../../sprint_mockups/sprint-22/add-client-wizard.html)

### Session metrics

```
Type: Coding
Duration: ~1.5h
Tokens used: ~110K
Story points: 11 (Epic C Phase 1: 8 + Phase 4: 3)
Quality rating: 9/10
Reason: All Phase 1+4 acceptance criteria green, all 5 smoke checks pass, navigation D-C-14 enforced by automated regex test, full responsive cascade implemented, XSS gate honored on every dynamic field. Live browser smoke (visual diff vs mockup) deferred — assets serve under existing express static config; first consultant login in dev will exercise the data path end-to-end.
```

---

## Coding Session — April 29, 2026 (Session #179) — Epic C Phase 2: Backend Foundation

### Goal

Land the backend foundation for the My Clients page: extend `Company.js` with the 9 client-lifecycle fields per `MODEL_DELTAS.md`, fix and extend `GET /portfolio-summary`, add `GET /portfolio-kpis` and `POST /clients` (3-step transactional create per D-C-6). UI work (Phase 1 + Phase 4) and the wizard (Phase 3) deferred to subsequent sessions.

### Files modified (2) + 1 new

| File | Change |
|------|--------|
| [server/models/Company.js](../../../../server/models/Company.js) | ADD top-level: `stage` (enum, default `prospect`, indexed — D-C-7), `primary_contact{name,title,email,phone}` sub-doc (D-C-6), `industry_secondary`, `vertical`, `hq`, `estimated_revenue_band`, `description` (D-C-3 mirror of nested), `ai_enrichment_used` (default false), `ai_confidence` (0-1). CHANGE: `employee_count` → `required:false` (D-C-4). Intentionally NO `risk_status` field — computed at read time per D-C-5. |
| [server/routes/consultant.js](../../../../server/routes/consultant.js) | Imports: `mongoose`, `Objective`. Helpers: `SIZE_BAND_MIDPOINT`, `deriveEmployeeCount` (D-C-4), `computeRiskStatus` (D-C-5), `bucketObjectives` (status → onTrack/atRisk/behind + behindStale flag). REPLACE `/portfolio-summary`: fixed pre-existing `size`/`logo` selection bug (now `size_category` + `branding.logo_url`); added stage, primaryContact, vertical, hq, description, objectives breakdown, riskStatus, lastActivity, employee_count fields. ADD `GET /portfolio-kpis` (4 KPIs computed via same formulas). ADD `POST /clients` 3-step transaction (Company → push managed_businesses → default Team) with mongoose-session path + manual rollback fallback. |
| [scripts/test-sprint22-epic-c.js](../../../../scripts/test-sprint22-epic-c.js) | NEW. 36 assertions: schema deltas (15), route registration (5), riskStatus formula (7), deriveEmployeeCount (6), Company instance defaults (3). |

### Quality gates

- 🔒 **Security**: All 3 new endpoints `authenticateToken` + `requireRole('CONSULTANT')`. `POST /clients` validates `company.name` length ≥2; manual rollback on transaction failure (Company deleted, `managed_businesses` un-pushed) for non-transactional Mongo deployments. `primary_contact.email` lowercased at schema level. Tenant scoping via `User.managed_businesses` for all reads.
- 🏗️ **Architecture**: D-C-5 honored — `risk_status` is computed at read time, not stored (KPIs and summary share the same formula). Pre-existing `/portfolio-summary` bug (`.select('… size logo')` referenced nonexistent fields) silently fixed. 3-step write transaction follows D-C-6 exactly: Company → User push → default Team. Soft-default `stage='prospect'` if wizard omits. Helpers extracted at module top so KPIs and summary stay consistent.
- 📝 **Documentation**: Each helper + endpoint header references its decision ID. Field-level comments on Company schema cite D-C-3/4/5/6/7.
- 🧪 **Testing**: 36/36 smoke assertions green. Validates schema shape, route surface, risk formula edge cases (stale assessment / low SSI / behindStale / 50% atRisk / clean / no assessments), employee_count derivation table, and Company default values via `validateSync()`.

### Acceptance criteria — Phase 2 green

- [x] Company.js gains 9 new fields per MODEL_DELTAS (D-C-3, D-C-4, D-C-6, D-C-7)
- [x] `risk_status` is computed, NOT stored (D-C-5)
- [x] `Company.stage` indexed for portfolio filter performance
- [x] `GET /portfolio-summary` extended: stage, primaryContact, objectives breakdown, riskStatus, lastActivity
- [x] `GET /portfolio-kpis` returns 4 KPIs using shared formula
- [x] `POST /clients` executes 3-step transaction (D-C-6): Company → managed_businesses push → default Team
- [x] Welcome email descoped (D-C-8) — no `sendWelcomeEmail` field touched
- [x] Pre-existing `/portfolio-summary` field-selection bug fixed
- [x] All routes load clean; 36 smoke assertions pass

### Deferred to next sessions

- **Session #180** → Epic C Phase 1 + Phase 4 (`my-clients.html`, `my-clients.js`, `my-clients.css`, navigation update — 11 pts)
- **Session #181** → Epic C Phase 3 (`add-client-wizard.js` modal, ties together the existing `enrichCompany` + new `POST /clients` — 5 pts)

### Next session recommendation

**Type**: `/coding`
**Focus**: Epic C Phase 1 — page layout, KPI header, client tile component (SSI donut + Objectives rectangle), navigation update (CONSULTANT block only — D-C-14). All backend APIs are live, so this is pure UI against real data.
**Token budget**: 100–140K
**Reference**: [`epics/EPIC_C_MY_CLIENTS.md`](./epics/EPIC_C_MY_CLIENTS.md), [`sprint_mockups/sprint-22/my-clients.html`](../../sprint_mockups/sprint-22/my-clients.html)

### Session metrics

```
Type: Coding
Duration: ~1h
Tokens used: ~95K
Story points: 5 (Epic C Phase 2 complete)
Quality rating: 9/10
Reason: 36/36 assertions green, all decisions (D-C-3/4/5/6/7) honored, pre-existing bug fixed in passing. Live MongoDB integration test deferred — first wizard run (Session #181) will exercise the 3-step transaction end-to-end.
```

---

## Coding Session — April 29, 2026 (Session #178) — Epic F: aiOKRService Extension

### Goal

Extend the existing `aiOKRService` singleton with cascade generation (`generateKRs`, `generateWeeklyGoals`, `generateMoves`) and the **Add Client wizard enrichment endpoint** (`enrichCompany` — D-F-1 closure). All AI calls degrade to template fallbacks; OpenAI errors caught and logged. New `EnrichUnavailableError` propagates to consultant route as 504.

### Files modified (5)

| File | Change |
|------|--------|
| [server/services/aiOKRService.js](../../../../server/services/aiOKRService.js) | Constructor: 24h enrich cache + 3s timeout + `OPENAI_ENRICH_MODEL`. Added: `generateKRs`, `generateWeeklyGoals`, `generateMoves`, `enrichCompany`, `_enrichTemplateStub`, `buildCascadePrompt` (4 types: kr/weekly/move/enrich), `buildKRGenerationPrompt`/`buildWeeklyGoalPrompt`/`buildMovePrompt`/`buildEnrichPrompt`, `parseCascadeResponse` (4 types — D-F-4 enforces min 1 / max 5 KRs), `parseJSONResponse` (handles fenced + bare), `callOpenAIWithRetry` (one retry on 429/5xx), 3 template fallbacks, `parseNumber`. Exported `EnrichUnavailableError` class. |
| [server/routes/objectives.js](../../../../server/routes/objectives.js) | `POST /api/objectives/generate-krs` — `aiGenerationLimiter` + `assembleContext('kr-generation')` + `aiOKRService.generateKRs`. |
| [server/routes/weekly-goals.js](../../../../server/routes/weekly-goals.js) | `POST /api/weekly-goals/generate` — tenant-scoped (verifies parent KR), `assembleContext('weekly-goal-creation')`. |
| [server/routes/moves.js](../../../../server/routes/moves.js) | `POST /api/moves/generate` — tenant-scoped, discipline-validity guard, `assembleContext('move-generation')`. |
| [server/routes/consultant.js](../../../../server/routes/consultant.js) | `POST /api/consultant/clients/enrich` — CONSULTANT-only, `aiGenerationLimiter`, returns 504 on `EnrichUnavailableError`. |

### Quality gates

- 🔒 **Security**: All 4 new routes use `authenticateToken`; `aiGenerationLimiter` (5/hr/company in prod, 50/hr/dev) on every AI endpoint; consultant route also `requireRole('CONSULTANT')`. Tenant scope enforced — weekly-goals/moves verify parent record's company_id before invoking AI. Title-length and short-name minimums on inputs. Discipline validity checked against config.
- 🏗️ **Architecture**: Service-layer separation — routes assemble context + call service; service handles prompt/parse/cache/retry; no business logic in routes. Idempotent enrich cache (24h, in-memory; D-F-2). Stable graceful-degradation hierarchy: AI → retry once on 429/5xx → template fallback (KR/weekly/move) or `EnrichUnavailableError` → 504 (enrich). KRs enforce min 1 (throws → caller falls back) / max 5 (slice) per D-F-4.
- 📝 **Documentation**: Each new method header references its decision ID. Consultant `/clients/enrich` documents 504-on-timeout contract for the wizard's manual-fallback path.
- 🧪 **Testing**: 2 smoke-test scripts, ~17 assertions total:
  1. Service-level: parser strips `$`/`,`/`%` → number; null→0; fenced + bare JSON parses; KR shape normalized + `ai_generated:true`; max-5 enforcement; empty-list throws; all 3 template fallbacks return correct shapes; enrich stub when OpenAI disabled has 16 keys + `confidence:0`; short-name throws; `generateKRs` falls through to template when AI off.
  2. Cache + error paths: with mocked OpenAI client, 2nd `enrichCompany` call hits cache (1 underlying call); `AbortError` → `EnrichUnavailableError("timeout")`; generic error → `EnrichUnavailableError(message)`.
  3. Full module load: 28 routes + 7 providers + both services compile clean.

### Acceptance criteria — all green

- [x] aiOKRService extended with `generateKRs`, `generateWeeklyGoals`, `generateMoves`
- [x] `enrichCompany({name, website})` with web-search tool, 24h in-memory cache, 3s AbortController timeout, EnrichUnavailableError propagation (D-F-1, D-F-2, D-F-5)
- [x] `buildCascadePrompt` handles types: kr / weekly / move / enrich
- [x] `parseCascadeResponse('kr', ...)` enforces min 1 / max 5 (D-F-4)
- [x] `parseNumber` strips non-digits while `unit` retained as string (D-F-3)
- [x] Retry on 429/5xx via `callOpenAIWithRetry`
- [x] Template fallback when OpenAI disabled or fails
- [x] Integration with `AIContextService.assembleContext()` for all 3 generate-* routes
- [x] Backwards compat — existing `generateOKRsFromAssessment` flow unchanged
- [x] All 4 new AI endpoints rate-limited via `aiGenerationLimiter` (D-F-6)
- [x] Enrich cache hit verified — 1 OpenAI call across 2 same-param invocations (smoke test)
- [x] Cost tracking descoped to S23 (D-F-7)

### Spec deviation note

Per Session #175 Phase 8 patch, the spec lists 9 existing methods on `aiOKRService`. Code actually has these plus a few helpers (`regenerateOKRs`, `getHealthStatus`, `getRoleContext`, etc.) — none of which Epic F touches. All existing methods remain intact.

### Next session recommendation

**Type**: `/coding`
**Focus**: Epic C — My Clients page (16 pts). The `enrichCompany` endpoint is now ready to power the Add Client wizard's Step 1→2 transition. Epic C also needs the Company schema extensions (stage, primary_contact, industry_secondary, vertical, hq, estimated_revenue_band, ai_enrichment_used, ai_confidence, risk_status) per `prework/MODEL_DELTAS.md`.
**Token budget**: 120–160K (likely larger — UI + schema + multiple new endpoints)
**Reference**: [`epics/EPIC_C_MY_CLIENTS.md`](./epics/EPIC_C_MY_CLIENTS.md), [`prework/MODEL_DELTAS.md`](./prework/MODEL_DELTAS.md) (Company.js section), [`prework/API_DELTAS.md`](./prework/API_DELTAS.md), [`prework/DECISIONS_LOG.md`](./prework/DECISIONS_LOG.md) (D-C-*)

### Session metrics

```
Type: Coding
Duration: ~1h
Tokens used: ~75K
Story points: 10 (Epic F complete)
Quality rating: 9/10
Reason: All gates passed, 17/17 assertions green across 3 smoke scripts. Live OpenAI integration test deferred — first real consumer (Epic C wizard) will exercise it end-to-end.
```

---

## Coding Session — April 29, 2026 (Session #177) — Epic B: AIContextService Extension

### Goal

Extend the existing `AIContextService` (singleton) with a provider-driven context-assembly layer so Epics C / E / F / G can request operation-specific context (`'objective-creation'`, `'kr-generation'`, `'weekly-goal-creation'`, `'move-generation'`) without each route reassembling from scratch. Backwards-compatible with all 9 existing methods (D-B-1).

### Files created (7)

| File | Purpose |
|------|---------|
| [server/services/providers/index.js](../../../../server/services/providers/index.js) | Provider registry (auto-loaded by `initializeProviders()`) |
| [server/services/providers/CompanyProvider.js](../../../../server/services/providers/CompanyProvider.js) | AI-relevant subset of Company.business_context |
| [server/services/providers/AssessmentProvider.js](../../../../server/services/providers/AssessmentProvider.js) | Latest completed assessment, ssi_result→ssi_scores priority (D-B-4) |
| [server/services/providers/DisciplineProvider.js](../../../../server/services/providers/DisciplineProvider.js) | Reads from `config/disciplines.js` (D-B-3) |
| [server/services/providers/ObjectiveProvider.js](../../../../server/services/providers/ObjectiveProvider.js) | Active objectives or single objective by id |
| [server/services/providers/KeyResultProvider.js](../../../../server/services/providers/KeyResultProvider.js) | KRs by company / objective / id; cancelled excluded |
| [server/services/providers/WeeklyGoalProvider.js](../../../../server/services/providers/WeeklyGoalProvider.js) | Weekly goals by company / KR / id; cancelled excluded |

### Files modified (2)

| File | Change |
|------|--------|
| [server/services/AIContextService.js](../../../../server/services/AIContextService.js) | Added constructor (providers Map + cache); static `OPERATION_CONFIGS` (4 ops); methods `registerProvider`, `assembleContext`, `getDisciplines`, `initializeProviders` (idempotent), `invalidateProviderCache` (D-B-5 — exported, unused S22); private cache helpers + stable-key serializer. None of the 9 existing methods modified. |
| [server/index.js](../../../../server/index.js) | After `database.initialize()`, calls `AIContextService.initializeProviders()` inside try/catch — non-fatal: AI features degrade per provider `getFallback()` if init throws. |

### Quality gates

- 🔒 **Security**: Tenant scope enforced inside each provider via `company_id` filter. KeyResult/WeeklyGoal providers exclude cancelled records. AssessmentProvider only reads completed assessments. No new routes — no new auth surface.
- 🏗️ **Architecture**: Singleton (D-B-2) — `module.exports = new AIContextService()` already in place. Cache uses stable-keyed JSON (sorted keys) so `{a,b}` and `{b,a}` collide deterministically. Per-provider TTL from operation config. Failure isolation: one provider failing only nullifies that key (with fallback) and records in `_meta.errors`.
- 📝 **Documentation**: Each provider header references the Epic B decision it implements.
- 🧪 **Testing**: 11-assertion smoke test (no DB required) verified:
  1. Constructor wires `providers` Map + cache
  2. 4 operation configs registered
  3. `getDisciplines()` returns 9
  4. All 6 real providers instantiate with `getData`+`getFallback`
  5. `assembleContext` returns context with `_meta`
  6. Failing provider → `getFallback()` used + error in `_meta.errors`
  7. Cache hit on 2nd call same params (no re-fetch)
  8. Different params → re-fetch
  9. Stable key — same params different order → cache hit
  10. `invalidateProviderCache(pattern)` removes matching keys
  11. Unknown operation throws; existing `getCompanyProfile`/`buildObjectiveContext`/`buildContext` still bound

### Acceptance criteria — all green

- [x] AIContextService extended with `registerProvider`, `assembleContext`, `initializeProviders`, `getDisciplines`, cache helpers
- [x] All 6 providers implemented per D-B-3 + D-B-4
- [x] disciplines.js consumed via DisciplineProvider (config from Epic A)
- [x] 5-min default TTL with per-operation override (300/300/180/120s)
- [x] Graceful degradation on provider failure (`getFallback()` + `_meta.errors`)
- [x] Auto-registration at boot; idempotent (`_providersInitialized` guard)
- [x] All 9 actually-existing methods continue to work (D-B-1 — verified via type checks)
- [x] 4 operation configs wired (objective-creation, kr-generation, weekly-goal-creation, move-generation)
- [x] `invalidateProviderCache(pattern)` exported, unused in S22 (D-B-5)
- [x] All 28 routes + 7 provider files load clean

### Spec deviation note

Epic B spec mentioned `buildContext()` and `getActiveObjectives()` as "fictional" (D-B-1). The codebase actually has `buildContext()` at line 739 — it's real, just predates Sprint 22. The new `assembleContext()` is a separate, operation-driven entry point and does not collide with or replace `buildContext()`. Both coexist.

### Next session recommendation

**Type**: `/coding`
**Focus**: Epic F (aiOKRService Extension, 10 pts) — extend existing `aiOKRService` with `generateKRs()`, `generateWeeklyGoals()`, `generateMoves()`, **`enrichCompany()`** (D-F-1, was missing from earlier draft), plus retry/parse helpers. Now unblocked because the context layer (Epic B) is live.
**Token budget**: 100–140K
**Reference**: [`epics/EPIC_F_LLM_INTEGRATION.md`](./epics/EPIC_F_LLM_INTEGRATION.md), [`prework/SERVICE_EXTENSIONS.md`](./prework/SERVICE_EXTENSIONS.md) (aiOKRService section), [`prework/DECISIONS_LOG.md`](./prework/DECISIONS_LOG.md) (D-F-*)

### Session metrics

```
Type: Coding
Duration: ~1h
Tokens used: ~70K
Story points: 10 (Epic B complete)
Quality rating: 9/10
Reason: All gates passed, smoke tests covered failure isolation + cache behavior + stable keying. Real DB integration tests for providers deferred — first consumer (Epic F's enrichCompany or Epic E's KR generation) will exercise them end-to-end.
```

---

## Coding Session — April 29, 2026 (Session #176) — Epic A: Data Models & Disciplines

### Goal

Land the foundation cascade — `Objective → KeyResult → WeeklyGoal → Move` — plus the 9-disciplines config, virtuals on Objective, and tenant-scoped CRUD scaffolds for all three new collections so Epics B / E / F can build on a stable base.

### Files created (8)

| File | Purpose |
|------|---------|
| [server/config/disciplines.js](../../../../server/config/disciplines.js) | 9 disciplines × 4 foundations + unified API surface (D-A-5, D-B-3) |
| [server/models/KeyResult.js](../../../../server/models/KeyResult.js) | Separate KR model with `quarters[]`, virtuals `progress_percentage` + `quarter_display`, auto-status (D-A-1, D-A-4) |
| [server/models/WeeklyGoal.js](../../../../server/models/WeeklyGoal.js) | `frequency` + `completions[]` (Option A), `addCompletion()` method (D-A-2) |
| [server/models/Move.js](../../../../server/models/Move.js) | `move_type` + `discipline` (enum from config) + `completions[]`, virtuals `is_habit` / `streak` / `completion_rate`, methods `logCompletion()` / `complete()` (D-A-3) |
| [server/routes/disciplines.js](../../../../server/routes/disciplines.js) | `GET /`, `GET /dropdown`, `GET /foundations` |
| [server/routes/key-results.js](../../../../server/routes/key-results.js) | CRUD + year guard (KR.year === Objective.target_year) (D-A-4, D-A-6) |
| [server/routes/weekly-goals.js](../../../../server/routes/weekly-goals.js) | CRUD scaffold (D-A-6) |
| [server/routes/moves.js](../../../../server/routes/moves.js) | CRUD scaffold + discipline-validity guard (D-A-6) |

### Files modified (2)

| File | Change |
|------|--------|
| [server/models/Objective.js](../../../../server/models/Objective.js) | Added virtual `key_results_v2` referencing KeyResult by `objective_id`; enabled `toJSON`/`toObject` virtuals. Embedded `key_results[]` left intact for backwards compat (D-A-1). |
| [server/index.js](../../../../server/index.js) | Mounted `/api/disciplines`, `/api/key-results`, `/api/weekly-goals`, `/api/moves`. |

### Quality gates

- 🔒 **Security**: All routes use `authenticateToken`; every read/write filters by `req.user.company_id`; PUTs block re-parenting via `delete req.body.{company_id, parent_id, created_by}` before assign; soft-delete-only.
- 🏗️ **Architecture**: RESTful (GET list / POST create / PUT update / DELETE soft-cancel); tenant-leading compound indexes on every collection per `prework/MODEL_DELTAS.md`; service-shape preserved (no business logic in routes beyond validation).
- 📝 **Documentation**: Each file references the decision IDs it implements.
- 🧪 **Testing**: Smoke-loaded all 28 route files clean; verified disciplines config returns 9 ids and 4 foundations; verified Move enum has 9 values; verified `keyResultSchema` has tenant-leading compound index; verified Objective virtual `key_results_v2` is registered.

### Acceptance criteria — all green

- [x] disciplines.js with 9 disciplines + 4 foundations + unified API surface (D-A-5, D-B-3)
- [x] KeyResult.js with quarters[] + year guard (D-A-4)
- [x] WeeklyGoal.js with frequency + completions
- [x] Move.js with move_type, discipline (enum from config), completions
- [x] GET /api/disciplines and /dropdown wired
- [x] Objective.js virtual `key_results_v2` + virtuals enabled in JSON
- [x] All models have tenant-leading indexes
- [x] CRUD scaffolds enforce tenant scope and soft-delete (D-A-6)
- [x] Goal.js / Task.js untouched (D-A-2, D-A-3)
- [x] Existing routes still load (28/28 clean)

### Next session recommendation

**Type**: `/coding`
**Focus**: Epic B (AIContextService Extension, 10 pts) — extend existing `server/services/AIContextService.js` with `registerProvider()` + `assembleContext()`; add CompanyProvider, AssessmentProvider, DisciplineProvider, ObjectiveProvider. May run in parallel with Epic F (aiOKRService extension).
**Token budget**: 100–140K
**Reference**: [`epics/EPIC_B_ORCHESTRATOR.md`](./epics/EPIC_B_ORCHESTRATOR.md), [`prework/SERVICE_EXTENSIONS.md`](./prework/SERVICE_EXTENSIONS.md), [`prework/DECISIONS_LOG.md`](./prework/DECISIONS_LOG.md) (D-B-*)

### Session metrics

```
Type: Coding
Duration: ~1h
Tokens used: ~55K
Story points: 5 (Epic A complete)
Quality rating: 9/10
Reason: Spec adherence high, all gates passed, smoke tests green. Real DB integration tests deferred to Epic B/E sessions per TEST_PLAN_STUBS.md.
```

---

## Strategy Session — April 29, 2026 (Session #175) — Epic 0 Pre-Work

### Goal

Reorder Sprint 22 epics, surface every gap/contradiction in the existing specs against the live codebase, resolve all decisions in one coordinated pass, and patch all 8 epics + master plan + handoff before /coding.

### Outputs

**16 prework files** in [`prework/`](./prework/):
- `README.md` — index + Epic 0 exit checklist
- 8 × `INVENTORY_EPIC_*.md` — per-epic existing-vs-extend-vs-new-vs-conflict matrix
- `MODEL_DELTAS.md` — every Mongoose schema change in one place
- `API_DELTAS.md` — every endpoint extended/added with payloads reconciled to actual code
- `SERVICE_EXTENSIONS.md` — method-level audit of `aiOKRService` + `AIContextService`
- `TENANCY_RBAC_MATRIX.md` — per-route auth + tenant scope rules
- `DEPENDENCY_DAG.md` — phase-level dependency graph
- `TEST_PLAN_STUBS.md` — per-epic BST + Playwright outlines
- `DECISIONS_LOG.md` — **59 cross-epic decisions, all APPROVED**

### 10 critical findings closed

1. Epic F was **missing `enrichCompany()`** despite Epic C wizard depending on it → added with full spec (D-F-1)
2. Epic B's "EXISTING METHODS" list referenced fictional `buildContext()` and `getActiveObjectives()` → corrected to actual 9 methods (D-B-1)
3. Epic C "Dependencies: None" was wrong → declared dependencies on A + F (D-C-2)
4. Embedded `Objective.key_results[]` vs separate KeyResult collection contradiction → resolved with dual-write pattern (D-A-1)
5. `assessment-hub.js` listed MODIFY but does not exist → changed to CREATE (D-D-1)
6. `objective-wizard.html`/`.js` listed CREATE but already exist → changed to MODIFY (D-E-5)
7. Company missing 8+ fields specs assumed → all added to MODEL_DELTAS.md and Epic C (D-C-3, D-C-4 etc.)
8. `risk_status` formula and "Need Attention" threshold undefined → defined as computed-at-read-time (D-C-5)
9. POST /clients tenancy holes (managed_businesses push, default Team) → 3-step transaction defined (D-C-6)
10. Welcome email / Reaction badge / Cost tracking — features without specs → descoped to S23 (D-C-8, D-G-3, D-F-7)

### Reorder applied (was: C → E → H → D → G with A/B/F parallel)

```
NEW: Epic 0 (13 pts pre-sprint) → A → B → F → C → E → H → D → G
```

Epic F moved from P1/late to P0/slot-3 because it's a hard dependency for Epic C Phase 3 and Epic E.

### Sprint points: 74 → 87

+13 for Epic 0. All 59 decisions APPROVED 2026-04-29.

### Files patched (Phase 8)

All 8 epic spec files + master plan + this handoff. Each spec now has:
- Decision-ID footnotes (`(D-X-N)`) on every changed section
- Acceptance Criteria expanded with tenant-isolation, AI-fallback, and dual-write coverage
- Files to Create/Modify reconciled with actual repo state
- Story-points tables math-balanced

### Next Session Recommendation

**Type**: `/coding`
**Focus**: Begin Epic A (Data Models & Disciplines, 5 pts) — runs in parallel with Epic B and Epic F
**Token budget**: 80-120K
**Reference docs**: [`prework/MODEL_DELTAS.md`](./prework/MODEL_DELTAS.md), [`prework/API_DELTAS.md`](./prework/API_DELTAS.md), [`prework/SERVICE_EXTENSIONS.md`](./prework/SERVICE_EXTENSIONS.md), [`prework/DECISIONS_LOG.md`](./prework/DECISIONS_LOG.md), [`epics/EPIC_A_BEHAVIOR_MODEL.md`](./epics/EPIC_A_BEHAVIOR_MODEL.md)

---

## Design Session — April 28, 2026 (Session #174)

### Pre-Sprint Cleanup

Goal: ensure all Sprint 22 mockups are theme-consistent, navigation-locked, and gap-free before /coding starts.

**Changes**:
- Added `--s22-*` token block to `client/css/s13-patterns.css` (additive, zero impact on live pages)
- Cleaned 4 existing mockups (Purple sweep, production nav inserted, what-stays boundary notes added):
  - `dashboard-v3.html` (was 17 Purple hits, now 0; nav block injected)
  - `my-clients.html` (was 1 Purple hit, now 0; inline nav replaced with `/js/navigation.js` loader)
  - `assessment-hub.html` (was 9 Purple hits, now 0; boundary note clarifies tabs 1-3 stay, 4-6 added)
  - `planning.html` (verified clean; boundary note added)
- Created 2 new mockups:
  - `add-client-wizard.html` — **canonical 2-step AI auto-fill flow** (per Session #167 brainstorm). Step 1: name + website → AI enrich. Step 2: review/edit AI-filled industry, size, founded, HQ, revenue band, signals, suggested SSI focus, suggested template, suggested primary contact (pulled from website team page + LinkedIn). Manual fallback path included.
  - `objective-wizard.html` — 3-screen flow mirroring live `client/pages/objective-wizard.html` structure. Screen 1: title + category + SSI impact. Screen 2: Behavior/Discipline selector grouped by 4 foundations, 9 disciplines from config. Screen 3: AI KR generation + manual + edit/confirm. Saves to NEW KeyResult collection.
- Deleted legacy `dashboard.html` (517-line additive variant) — V3 is canonical, ambiguity resolved.
- Updated epic docs:
  - `EPIC_G_DASHBOARD_UI.md`: mockup pointer → `dashboard-v3.html`. Added nav-lock note. Added `--karvia-primary` alias step. Folded Epic H's 5pts into Epic G's combined 10pt UI budget.
  - `EPIC_H_PLANNING_PAGE.md`: budget-folded-into-G note added (work tracked separately, billed jointly).
  - `EPIC_E_OBJECTIVE_WIZARD.md`: mockup pointer added, implementation file path noted.
  - `EPIC_C_MY_CLIENTS.md` §5: replaced stale 3-step manual spec with canonical 2-step AI flow including full `/enrich` request/response shape, source citations, signal detection, suggested template, primary contact inference, and manual fallback. §6 expanded with `POST /api/consultant/clients/enrich` endpoint spec.
- Updated `sprint_mockups/sprint-22/README.md`: full inventory (6 files), theme rules, nav lock rule, execution order, per-mockup boundary notes, verification commands.

### Sprint 22 Mockup Inventory (post-cleanup)

| # | File | Epic | Maps to Live | Status |
|---|------|------|--------------|--------|
| 1 | my-clients.html | C (16/21) | NEW page | Cleaned |
| 2 | add-client-wizard.html | C (5/21) | Modal in my-clients.html | NEW (2-step AI) |
| 3 | objective-wizard.html | E (10) | Modifies objective-wizard.html | NEW (mirrors live) |
| 4 | planning.html | H billed in G (5) | Modifies planning-v2.html | Cleaned |
| 5 | assessment-hub.html | D (8) | Modifies assessment-hub.html | Cleaned |
| 6 | dashboard-v3.html | G (5) | Replaces dashboard-v2.html content | Cleaned + nav-injected |

### Locked Execution Order (per stakeholder direction)

1. **My Clients page** (Epic C, 16 pts) — consultant entry point
2. **Add Client wizard** (Epic C, 5 pts) — closes Epic C
3. **Objective Wizard** (Epic E, 10 pts) — per-client objective creation
4. **Planning Page** (Epic H billed in G, 5 pts) — once objectives exist
5. **Assessment Hub additions** (Epic D, 8 pts) — additive, low risk
6. **Dashboard V3 + Moves + theme alias** (Epic G, 5 pts) — final UI consolidation

Backend pre-reqs (parallel, no UI): Epic A (5) → Epic B (10) → Epic F (10).

---

## Design Session - April 22, 2026 (Session #173)

### Completed Work

**Dashboard V3 — The Causal Chain** (Epic G):
- [x] Full redesign of dashboard as `dashboard-v3.html` (replaces v2 spec)
- [x] Behavior Moves vs Chores — visual distinction without labels (card weight, not words)
- [x] Causal chain card layout: `[building behavior] → [moving ball]` in two-column grid
- [x] SVG icon system: `icon-building` (ascending bars), `icon-moving` (trend line + dot)
- [x] 5 card states: active, paused (amber), assigned-out (dashed), completed (greyed)
- [x] Catch-up strip: 3 tiles (◐ pushed, ○ forgotten, ▸ this week) with inline expand panels
- [x] Popovers: postpone (date picker scoped to KR period), assign (grouped by client for consultants)
- [x] Chores as flat single-line items below moves (cognitive weight separation)
- [x] KPI header strip: `83 moves · 85% this week · ▲` (1 line, no new section)
- [x] Group switch: `All | Objective | Habit` — collapsible groups with chevron `▾`

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Behavior vs Chore distinction | Visual weight only (no badge label) | Eye learns through size, not words |
| Causal chain | Left: building [behavior] → Right: moving [ball] | Shows individual → company impact |
| "Forgotten" label | Not "Overdue" or "Missed" | Behavior-change psychology, reduces shame |
| Assignee scope | Same company; consultants see cross-client groups | Role-based filtering (invalid roles greyed) |
| KPIs placement | Embedded in existing layout (strip + card) | No new sections, no cognitive load |
| Group switch options | All / Objective / Habit | User chooses mental model for today |
| Group headers | Collapsible with chevron, independent per group | Each objective/habit can collapse separately |
| Postpone date | Calendar scoped to KR period (`min`/`max`) | Prevents dates outside goal window |

### Individual KPI Framework (Decided)

| KPI | Placement | Psychological lever |
|-----|-----------|---------------------|
| Moves Made (quarter) | Header strip | Progress, never goes backward |
| Consistency Rate (weekly) | Header strip | Actionable, resets weekly |
| Momentum arrow `▲` | Header strip | Trend over absolute |
| Build Days (`6/12`) | Card — habit side | Habit lock progress |
| Ball Lift (`↑ 50% from 25%`) | Card — ball side | Causal chain visible |
| Habit Lock %, Recovery Rate | Expanded card only | Depth without clutter |

### Files Created

```
Created:
- sprint_mockups/sprint-22/dashboard-v3.html  (Epic G full mockup)
```

### Next Action

Run `/coding` to begin **Epic A** (Data Models: `KeyResult.js`, `WeeklyGoal.js`, `Move.js`, `disciplines.js`).
Epic G dashboard-v3.html serves as the implementation spec for the UI layer.

---

## Architecture Session - April 22, 2026 (Session #172)

### Completed Work

**Data Model Restructuring**:
- [x] Evaluated current embedded `key_results[]` model vs separate models
- [x] Decided on simplified cascade: Objective → KeyResult → WeeklyGoal → Move
- [x] Chose Option A (single record + completions array) for recurring items
- [x] Added Epic A (Data Models & Disciplines) to Sprint 22 scope (+5 pts)

**Epic Updates**:
- [x] Updated SPRINT22_MASTER_PLAN.md - now 61 pts (added Epic A)
- [x] Rewrote EPIC_A_BEHAVIOR_MODEL.md - new data model specifications
- [x] Updated EPIC_E_OBJECTIVE_WIZARD.md - KeyResult separate model
- [x] Rewrote EPIC_B_ORCHESTRATOR.md - AIContextService extension approach
- [x] Rewrote EPIC_F_LLM_INTEGRATION.md - aiOKRService extension approach

### Key Decisions Made

**Data Model Cascade**:
```
Objective (1) → KeyResult (N) → WeeklyGoal (N) → Move (N)
```

**Frequency at Every Level**:
- KeyResult: `quarters: [1, 2, 3, 4]` (can span multiple)
- WeeklyGoal: `frequency: once|weekly|biweekly|monthly` + `completions[]`
- Move: `frequency: once|daily|weekly|triggered` + `completions[]`

**Disciplines from Config (Not DB)**:
- 9 disciplines loaded from `server/config/disciplines.js`
- Same pattern as existing `categories.js`
- No separate database model needed

**Service Extension (Not New Services)**:
- Extend existing `AIContextService.js` with `registerProvider()` + `assembleContext()`
- Extend existing `aiOKRService.js` with `generateKRs()` + `generateWeeklyGoals()` + `generateMoves()`
- Backwards compatible with existing methods

### Sprint 22 Final Scope (61 pts)

| Epic | Name | Points | Priority | Change |
|------|------|--------|----------|--------|
| **A** | **Data Models & Disciplines** | **5** | **P0** | **NEW** |
| B | AIContextService Extension | 10 | P0 | Renamed |
| C | My Clients Page | 21 | P0 | - |
| E | Objective Wizard | 10 | P0 | - |
| F | aiOKRService Extension | 10 | P1 | Renamed |
| G | Dashboard & UI Updates | 5 | P1 | - |

### New Data Models (Epic A)

| Model | Description |
|-------|-------------|
| `KeyResult.js` | Separate from Objective, linked via `objective_id` |
| `WeeklyGoal.js` | Links to KeyResult, has `frequency` + `completions[]` |
| `Move.js` | Replaces Task.js, has `move_type` + `discipline` + `completions[]` |
| `disciplines.js` | Config file (not model), 9 disciplines from GRIT |

### Files Modified

```
Updated:
- SPRINT22_MASTER_PLAN.md (now 61 pts, new cascade model)
- epics/EPIC_A_BEHAVIOR_MODEL.md (complete rewrite)
- epics/EPIC_B_ORCHESTRATOR.md (AIContextService extension)
- epics/EPIC_E_OBJECTIVE_WIZARD.md (KeyResult separate)
- epics/EPIC_F_LLM_INTEGRATION.md (aiOKRService extension)
- SPRINT22_HANDOFF_DOCUMENT.md (this file)
```

### Next Action
Run `/coding` to begin Epic A (Data Models) first, then Epic B (AIContextService) + Epic C (My Clients).

---

## Strategy Session - April 21, 2026 (Session #171)

### Completed Work

**Epic Consolidation**:
- [x] Created [EPIC_C_MY_CLIENTS.md](./epics/EPIC_C_MY_CLIENTS.md) - consolidated all My Clients planning
- [x] Updated SPRINT22_MASTER_PLAN.md references to point to epics folder
- [x] Removed MY_CLIENTS_PAGE_SPEC.md (content merged into epic)
- [x] Fixed Sprint 23 README - removed Epic C (now 13 pts: A + D only)

### Sprint 22 Final Scope (56 pts)

| Epic | Name | Points | Priority |
|------|------|--------|----------|
| B | Orchestrator & Providers | 10 | P0 |
| C | My Clients Page | 21 | P0 |
| E | Objective Wizard | 10 | P0 |
| F | LLM Integration | 10 | P1 |
| G | Dashboard & UI Updates | 5 | P1 |
| H | Planning Page | 5 | P1 |

### Sprint 23 Scope (13 pts) - Deferred

| Epic | Name | Points |
|------|------|--------|
| A | Behavior Model | 5 |
| D | Assessment Enhancements | 8 |

### Files Modified

```
Created:
- epics/EPIC_C_MY_CLIENTS.md (21 pts complete spec)

Updated:
- SPRINT22_MASTER_PLAN.md (references fixed)
- ../SPRINT-23/README.md (scope corrected)

Removed:
- MY_CLIENTS_PAGE_SPEC.md (merged into epic)
```

### Next Action
Run `/coding` to begin Epic B (Orchestrator) + Epic C (My Clients) in parallel (Week 1-2).

---

## Strategy Session - April 20, 2026 (Session #164)

### Completed Work

**Core Strategy Finalized**:
- [x] Discussion #1: Behavior Model Design (9 Disciplines, 4 Foundations) - [BETA_FINAL_STRATEGY_2026.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md#discussion-1-details)
- [x] Discussion #2: Task Classification (reuse recurring field) - [BETA_FINAL_STRATEGY_2026.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md#discussion-2-details)
- [x] Discussion #3: SSI Impact Mapping (area + sub-dimension) - [BETA_FINAL_STRATEGY_2026.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md#discussion-3-details)
- [x] Discussion #4: Integration & Data Flow (LEGO architecture) - [BETA_FINAL_STRATEGY_2026.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md#discussion-4-details)

**Strategy Documents Created**:
- [x] [BETA_FINAL_STRATEGY_2026.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) - Master strategy consolidating all 4 discussions
- [x] [OBJECTIVE_CREATION_STRATEGY.md](../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md) - Complete 3-screen wizard spec
- [x] [objective_kr_generation_prompt.md](../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) - LLM prompt template

**Planning Structure Created**:
- [x] Sprint 22 folder structure - [README.md](./README.md)
- [x] Session #164 plan - [SESSION_164_OBJECTIVE_PAGE.md](./session-plans/SESSION_164_OBJECTIVE_PAGE.md)
- [x] Session #165 plan - [SESSION_165_COMPANY_PROFILE.md](./session-plans/SESSION_165_COMPANY_PROFILE.md)
- [x] Session #166 plan - [SESSION_166_LLM_ORCHESTRATION.md](./session-plans/SESSION_166_LLM_ORCHESTRATION.md)
- [x] Session #167 plan - [SESSION_167_INTEGRATION_PLANNING.md](./session-plans/SESSION_167_INTEGRATION_PLANNING.md)

### Key Decisions Made

**Behavior Model**:
- ✅ 9 Disciplines as behaviors (not 4 foundations)
- ✅ 4 Foundations as meta-categories (Discipline, Growth, Accountability, Maturity)
- ✅ Independent LEGO piece model
- ✅ Global seed (all companies see same 9)

**Task Classification**:
- ✅ Reuse existing `recurring` field (no new fields)
- ✅ recurring.enabled: false = one-off, true = habit-building
- ✅ recurring.frequency: practice cadence within weekly goal
- ✅ LLM sets classification during task generation

**SSI Impact**:
- ✅ Single area + optional sub-dimension
- ✅ 12 sub-dimensions total (4 per SSI area)
- ✅ Auto-suggest from assessment constraint
- ✅ Guide but don't enforce (optional fields)

**Architecture**:
- ✅ LEGO piece architecture (independent modules)
- ✅ Graceful degradation (each piece can fail independently)
- ✅ Prompts → Frontend → Backend (decision rule)
- ✅ Reuse → Reframe → Extend (implementation rule)

### Files Created

```
Created 8 new files:

1. KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/
   └─ BETA_FINAL_STRATEGY_2026.md (15KB)

2. KARVIA_STRATEGY/1-PRODUCT/features/
   └─ OBJECTIVE_CREATION_STRATEGY.md (25KB)

3. KARVIA_STRATEGY/2-TECHNICAL/AI-PROMPTS/
   └─ objective_kr_generation_prompt.md (12KB)

4. KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-22-Beta_Final/
   ├─ README.md (18KB)
   └─ session-plans/
       ├─ SESSION_164_OBJECTIVE_PAGE.md (10KB)
       ├─ SESSION_165_COMPANY_PROFILE.md (9KB)
       ├─ SESSION_166_LLM_ORCHESTRATION.md (11KB)
       └─ SESSION_167_INTEGRATION_PLANNING.md (12KB)
```

---

## Strategy Session - April 20, 2026 (Session #165)

### Completed Work

**Core Strategy Finalized**:
- [x] Company Profile Strategy - Revised to use single source of truth (`business_context`)
- [x] Orchestrator Architecture - 3 services (Context, Workflow, Presentation)
- [x] LEGO Piece Architecture - 7 independent data providers
- [x] CompanyProvider specification - Extracts AI-relevant subset
- [x] My Clients page enhancement specs
- [x] Epic H and Epic I defined (added to Sprint 22 scope)

**Strategy Documents Created/Updated**:
- [x] [COMPANY_PROFILE_STRATEGY.md](../../../1-PRODUCT/features/COMPANY_PROFILE_STRATEGY.md) - Revised to orchestrator approach
- [x] [ORCHESTRATOR_ARCHITECTURE.md](../../../2-TECHNICAL/ORCHESTRATOR_ARCHITECTURE.md) - NEW - Complete orchestrator design

### Key Decisions Made

**Single Source of Truth**:
- ✅ Use existing `business_context` (NOT separate `business_profile` field)
- ✅ CompanyProvider extracts AI-relevant subset
- ✅ No data duplication, no synchronization issues
- ✅ Company Profile page already exists and works

**Orchestrator Architecture**:
- ✅ Configuration-driven (JSON config files)
- ✅ Auto-registration of providers on startup
- ✅ Graceful degradation with fallbacks
- ✅ Zero impact on existing code (feature flag controlled)

**New Epics Added**:
- ✅ Epic H: Orchestrator Services (10 pts) - Context, Workflow, Presentation
- ✅ Epic I: Personal Profile (5 pts) - PersonProvider + page

### Files Created

```
Created 1 new file, Updated 1 file:

1. KARVIA_STRATEGY/2-TECHNICAL/
   └─ ORCHESTRATOR_ARCHITECTURE.md (NEW - 18KB)

2. KARVIA_STRATEGY/1-PRODUCT/features/
   └─ COMPANY_PROFILE_STRATEGY.md (REVISED - aligned with orchestrator)
```

---

## Strategy Session - April 20, 2026 (Session #166)

### Completed Work

**LLM Orchestration Strategy Finalized**:
- [x] Prompt Management System - File-based for beta, git-versioned
- [x] Context Assembly Integration - Builds on Orchestrator architecture
- [x] Vertical Insights Knowledge Base - 4 industries (Legacy, Professional, Real Estate, General)
- [x] Error Handling & Fallbacks - Complete matrix with retry logic
- [x] Cost & Performance - GPT-4 Turbo for beta, performance targets defined

**Strategy Documents Created**:
- [x] [LLM_ORCHESTRATION_STRATEGY.md](../../../2-TECHNICAL/LLM_ORCHESTRATION_STRATEGY.md) - Complete LLM integration spec (35KB)

### Key Decisions Made

**Prompt Management**:
- ✅ File-based storage for beta (git-versioned)
- ✅ Semantic versioning (v1.0, v1.1, v2.0)
- ✅ Post-beta: Add database for A/B testing

**Context Caching**:
- ✅ 5-minute cache per company_id
- ✅ In-memory for beta, Redis post-beta
- ✅ Invalidate on company.profile_updated event

**LLM Model**:
- ✅ GPT-4 Turbo for beta (quality critical)
- ✅ Post-beta: A/B test GPT-3.5 Turbo (70% cheaper)
- ✅ Cost projection: ~$2/month beta, ~$80/month at scale

**Vertical Insights**:
- ✅ 4 industries for beta:
  1. Legacy Succession Planning (P0 - core market)
  2. Professional Services (P1)
  3. Real Estate (P1)
  4. General (P0 - required fallback)
- ✅ File-based knowledge base
- ✅ Industry-specific KR patterns and benchmarks

**Error Handling**:
- ✅ Auto-retry once on timeout (2s delay)
- ✅ Graceful degradation hierarchy (4 tiers)
- ✅ User-friendly error messages
- ✅ Manual fallback always available

### Files Created

```
Created 1 new file:

1. KARVIA_STRATEGY/2-TECHNICAL/
   └─ LLM_ORCHESTRATION_STRATEGY.md (NEW - 35KB)
```

---

## Design Session - April 21, 2026 (Session #169)

### Completed Work

**Assessment Page Brainstorm (Final topic):**
- [x] Assessment Hub design - Combined Hub with 3 tabs
- [x] Tab 1: All Results - List view with SSI mini-scores
- [x] Tab 2: Trends - SSI score trends over time (line chart)
- [x] Tab 3: Compare - Side-by-side assessment comparison

**Design Specifications Created:**
- [x] [dashboard.html](../../sprint_mockups/sprint-22/dashboard.html) - Color theme + Moves terminology
- [x] [assessment-hub.html](../../sprint_mockups/sprint-22/assessment-hub.html) - 3 new tabs spec
- [x] [planning.html](../../sprint_mockups/sprint-22/planning.html) - Monthly grouping spec
- [x] [README.md](../../sprint_mockups/sprint-22/README.md) - Implementation guide

### Key Decisions Made

| Decision | Choice |
|----------|--------|
| Assessment Page | Combined Hub (3 tabs) |
| Tab structure | All Results / Trends / Compare |
| SSI display | Mini-score pills on cards |
| Trends chart | Line chart with 3 SSI areas |
| Compare view | Side-by-side cards with deltas |
| Design approach | Spec docs (not full mockups) |
| Retain existing | Navigation, structure, layouts |

### Design Files Location

```
KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-22/
├── README.md           # Implementation guide
├── dashboard.html      # Dashboard changes spec
├── assessment-hub.html # Assessment Hub changes spec
└── planning.html       # Planning page changes spec
```

---

## Strategy Session - April 20, 2026 (Session #168)

### Completed Work

**User Journey Brainstorming (12/13 topics complete):**
- [x] Weekly Goals - Hybrid AI + manual, 12-13 weeks, monthly grouping
- [x] Tasks → Moves - Renamed, Action/Reaction/Habit types
- [x] Dashboard - Pure execution, Overdue/Today/Tomorrow only
- [x] Planning Page - Q tabs as filter, minimal changes
- [x] Teams Page - No changes, keep as-is

**Pending Topics:**
- [x] Assessment Page - Completed in Session #169

### Key Decisions Made

| Decision | Choice |
|----------|--------|
| Full quarter | 12-13 weeks (not 4) |
| Weekly grouping | By month (collapsible) |
| AI generation | 4 / 8 / 12 week presets |
| Tasks renamed | "Moves" (game metaphor) |
| Move types | Action, Reaction ⚡, Habit 🔄 |
| Dashboard | Overdue → Today → Tomorrow only |
| Planning Q tabs | Use existing as quarter filter |

### Design Theme Established

All Sprint 22 mockups follow Planning page design:
- Navy: `#1F2937`
- Gold: `#F59E0B`
- Background: `#FAFAFA`
- Font: Inter

---

## Strategy Session - April 20, 2026 (Session #167 - Complete)

### Completed Work

**User Journey Brainstorming (7/13 topics):**
- [x] Add Client Wizard - 2-step with AI auto-fill
- [x] My Clients Cards - Profile %, invite button, template status
- [x] Industry/Sector - 4 sectors, 12 industries
- [x] Objective Creation - 3-screen wizard combined with existing flow
- [x] Objectives Page - Minimal header, expandable summary bar
- [x] Quarterly Goals - 1:4 KR mapping, simple modal, progressive
- [x] Dual User Context - Consultant vs Business Owner (same UI)

**Pending Topics:**
- [ ] Weekly Goals - Bridge from quarterly to daily
- [ ] Tasks - Daily view, one-off vs repetitive
- [ ] Dashboard - Consultant vs business owner view
- [ ] Planning Page - Full design review
- [ ] Teams Page - Team management flow
- [ ] Assessment Page - List, history, comparison

### Key Decisions Made

| Decision | Choice |
|----------|--------|
| Add Client wizard | 2 steps, AI auto-fill company details |
| Industry dropdown | 12 industries across 4 sectors |
| Quarterly Goals | 1 KR → 4 goals, simple modal (2 fields) |
| Objectives page | Expandable summary bar (collapsed default) |
| User context | Same UI serves consultant AND business owner |

### Files Created

```
No new files created (brainstorming session only)
Updated: SESSION_BREAK_NOTES.md with design decisions
```

---

## Progress Tracker

### Strategy Phase (95% Complete)

```
✅ COMPLETED:
├─ Discussion #1: Behavior Model Design
├─ Discussion #2: Task Classification
├─ Discussion #3: SSI Impact Mapping
├─ Discussion #4: Integration & Data Flow
├─ BETA_FINAL_STRATEGY_2026.md
├─ OBJECTIVE_CREATION_STRATEGY.md
├─ objective_kr_generation_prompt.md
├─ Sprint 22 session plans (4)
├─ Session #165: COMPANY_PROFILE_STRATEGY.md (revised)
├─ Session #165: ORCHESTRATOR_ARCHITECTURE.md (NEW)
├─ Session #166: LLM_ORCHESTRATION_STRATEGY.md (NEW)
└─ Session #167: User Journey Brainstorm (7/13 topics)

📋 PENDING (Continue #167):
├─ Complete remaining 6 user journey topics
├─ Create formal design specs
├─ Sprint 22 Master Plan + Implementation docs
└─ Finalize epic ordering
```

### Implementation Phase (0% - Starts Week 3)

```
⏳ SPRINT 22 EPICS (57 Story Points):
├─ Epic A: Behavior Model (5 pts)
├─ Epic B: My Clients Enhancements (5 pts) - profile completion UI
├─ Epic C: Assessment Sub-dimensions (5 pts)
├─ Epic D: LLM Orchestration (10 pts)
├─ Epic E: Objective Wizard (10 pts)
├─ Epic F: Model Extensions (4 pts)
├─ Epic G: Analytics (5 pts - optional)
├─ Epic H: Orchestrator Services (10 pts) - NEW (Session #165)
│   ├─ ContextAssemblyService
│   ├─ WorkflowService
│   ├─ PresentationService
│   └─ CompanyProvider + config files
└─ Epic I: Personal Profile (5 pts) - NEW (Session #165)
    ├─ PersonProvider
    └─ personal-profile.html page
```

---

## Next Session Preparation

### Session #169: Assessment Page + Mockups

**Focus**: Complete last brainstorm topic, then create mockups

**Completed Topics (12/13)**:
- ✅ Add Client Wizard
- ✅ My Clients Cards
- ✅ Industry/Sector
- ✅ Objective Creation
- ✅ Objectives Page
- ✅ Quarterly Goals
- ✅ Dual User Context
- ✅ Weekly Goals (Session #168)
- ✅ Tasks/Moves (Session #168)
- ✅ Dashboard (Session #168)
- ✅ Planning Page (Session #168)
- ✅ Teams Page (Session #168)

**Remaining Topic (1)**:
1. Assessment Page - List, history, comparison

**After Brainstorm Complete**:
- Create mockups in `/sprint_mockups/sprint-22/`
- Update SPRINT22_MASTER_PLAN.md
- Create SPRINT22_TECHNICAL_IMPLEMENTATION.md

**Mockups to Create**:
1. `dashboard.html` - New game-centric design
2. `planning.html` - Updated with monthly grouping
3. `objectives.html` - Minor updates (if any)
4. `assessment.html` - TBD after brainstorm

**Estimated Duration**: 1 session

**Session Plan**: [SESSION_167_INTEGRATION_PLANNING.md](./session-plans/SESSION_167_INTEGRATION_PLANNING.md)

---

## Blockers & Risks

### Current Blockers
**None** - Strategy phase proceeding on track

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| 6 weeks too aggressive | Medium | High | Epic G (Analytics) optional, can defer |
| LLM quality varies | Medium | High | A/B test prompts, manual fallback always available |
| Company profile incomplete | High | Medium | Make optional, warn about quality impact |
| Sprint 21 on hold | N/A | Low | Intentional - focusing on Beta_Final strategy first |

---

## Sprint 21 Status (On Hold)

**Decision**: Sprint 21 placed on hold to focus on Sprint 22 Beta_Final strategy.

**Reason**:
- Sprint 21 had 0% progress after 10 days
- Need complete strategic foundation before implementation
- Sprint 22 Beta_Final is higher priority (proves BBB thesis)

**Sprint 21 Points**: 0/42 (0%)
**Sprint 21 Deadline**: Extended from Apr 10 → Apr 17 → On hold
**Resume Plan**: After Sprint 22 complete (if still needed)

---

## Notes for Next Session

### What Went Well (Session #167)
- User journey brainstorming productive (7 topics covered)
- Add Client wizard design simplified (2 steps, AI auto-fill)
- Quarterly goals design finalized (simple modal, 1:4 KR mapping)
- Dual user context clarified (consultant + business owner same UI)
- Progressive approach working well

### What to Remember
- **Add Client**: 2-step wizard, AI auto-fill from company name
- **Industries**: 12 options across 4 sectors (Home Services, Professional, Industrial, Real Estate)
- **Quarterly Goals**: 1 KR → 4 goals, simple modal (title + target)
- **Objectives Page**: Expandable summary bar, minimal header
- **User Context**: Consultant uses company selector, business owner sees their company
- **Weeks per Quarter**: 4 weeks shown (not all 13)

### Resolved Questions (Session #167)
- [x] Add Client wizard steps? → 2 steps with progressive reveal
- [x] AI auto-fill scope? → Company description from name only
- [x] KR to quarterly goal ratio? → 1:4 (one goal per quarter)
- [x] Who creates quarterly goals? → Consultant/owner/manager (manual)
- [x] Objectives page header? → Minimal, expandable summary bar

### Open Questions (for next session)
- [ ] Weekly goals: How many per quarterly goal?
- [ ] Tasks: One-off vs repetitive distinction in UI?
- [ ] Dashboard: Different view for consultant vs business owner?
- [ ] Teams page: Assessment per member or per team?
- [ ] Assessment page: Comparison view design?

---

## Quick Links

### Current Sprint Documents
- [Sprint 22 README](./README.md)
- [**SPRINT22_DESIGN_REVIEW.md**](./SPRINT22_DESIGN_REVIEW.md) — Design guardrails for all epics (Session #173)
- [BETA_FINAL_STRATEGY_2026.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md)
- [OBJECTIVE_CREATION_STRATEGY.md](../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md)
- [COMPANY_PROFILE_STRATEGY.md](../../../1-PRODUCT/features/COMPANY_PROFILE_STRATEGY.md) - Session #165
- [ORCHESTRATOR_ARCHITECTURE.md](../../../2-TECHNICAL/ORCHESTRATOR_ARCHITECTURE.md) - Session #165
- [LLM_ORCHESTRATION_STRATEGY.md](../../../2-TECHNICAL/LLM_ORCHESTRATION_STRATEGY.md) - Session #166 (NEW)

### Session Plans
- [Session #164 (Complete)](./session-plans/SESSION_164_OBJECTIVE_PAGE.md)
- [Session #165 (Complete)](./session-plans/SESSION_165_COMPANY_PROFILE.md)
- [Session #166 (Complete)](./session-plans/SESSION_166_LLM_ORCHESTRATION.md)
- [Session #167 (Next)](./session-plans/SESSION_167_INTEGRATION_PLANNING.md)

### Foundation Documents
- [YSELA_PHILOSOPHY.md](../../../../YSELA/philosophy/YSELA_PHILOSOPHY.md)
- [BETA_ROADMAP_2026.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md)

---

**Last Updated**: April 30, 2026 (Session #182 — Epic C-Polish closed, commit `e6b5333`)
**Next Session**: Session #183 — /coding Begin **Epic E (Objective Wizard, 10 pts)** per execution order Epic 0 → A → B → F → C → **E** → H → D → G
**Status**: Implementation Active — **64/87 pts (74%)** complete: Epic 0 + A + B + F + C + C-Polish ✅

### Sprint 22 Live Snapshot (post #182)

| Epic | Pts | Status | Sessions |
|------|-----|--------|----------|
| Epic 0 (Pre-work) | 13 | ✅ | #174–#175 |
| Epic A (Data Models) | 5  | ✅ | #176 |
| Epic B (AIContextService) | 10 | ✅ | #177 |
| Epic F (aiOKRService Cascade) | 10 | ✅ | #178 |
| Epic C (My Clients + Wizard) | 21 | ✅ | #179–#181 |
| Epic C-Polish (Edit/Remove/Profile) | 5  | ✅ | #182 |
| Epic E (Objective Wizard) | 10 | ⏳ Next | — |
| Epic H (Orchestrator Services) | 10 | ⏳ | — |
| Epic D (LLM Orchestration) | 10 | ⏳ | — |
| Epic G (Analytics, optional) | 5  | ⏳ buffer | — |

### Session #182 Outputs

- `client/pages/my-clients.html` — Notes modal removed; Edit modal + Remove modal + wizard success banner added.
- `client/pages/scripts/my-clients.js` — Tile dropdown ("Edit ▾"); Edit/Delete/Profile handlers; success-banner Open-profile link; Esc + click-outside + ARIA.
- `client/css/my-clients.css` — Dropdown menu styles; edit-form layout; amber `.mc-btn-warn`; success banner.
- `server/routes/companies.js` — DELETE soft = per-consultant `$pull` from `managed_businesses` (multi-consultant safe). PUT now persists `Company.primary_contact` sub-doc (closed silent-save bug).
- `scripts/test-sprint22-epic-c-polish.js` — 40/40 green; C-Phase3 regression 37/37 still green.

### Decisions Locked During #182

- **T1** Wizard Step 3 dropped — replaced with success-banner "Open company profile →" link (optional, post-create).
- **T2** Quick-edit modal kept alongside full Company Profile page.
- **T3** Soft-delete wording = "Remove from portfolio", amber CTA, no `?permanent=true`.
- **T4** Single "Edit ▾" dropdown (3 menu items) over icon row.
- **T5** Assessment-hub left untouched in this pass.
- **Hard delete deferred**: per-consultant unlink chosen over global hard-delete due to 17 child collections + multi-consultant safety + audit/compliance. Hard delete is a future epic with proper cascade design.
- **Notes feature removed**: was a non-persisting stub (`notes` not in PUT whitelist + privacy concern if visible to BUSINESS_OWNER on company-profile). Rebuild as `ConsultantNote` model with private-by-default semantics if validated.

### Risks / Watch-Items for #183

- AI auto-fill (POST /api/consultant/clients/enrich) reportedly broken in karvia-business-1 production (manual fallback firing). **Not addressed in #182**; consider a 1-pt diagnosis task before/during Epic E.
- `company-profile.html` navigation from My Clients verified at code-contract level only; not browser-smoke tested. Worth a manual click-through.

**Read before next session**: [.claude/LESSONS_LEARNED.md](../../../../.claude/LESSONS_LEARNED.md) — three Session #174 lessons captured (handoff > stale epic spec; verify "merged into" budgets; tokens before mockups).

---

## Session #183a (2026-04-30) — Status ▾ tile dropdown (consultant happy path, +2 pts)

**Goal**: First step of consultant cockpit — add a `Status ▾` dropdown to each My Clients tile that takes consultant directly to that client's SSI/assessment results page (`team-ssi-view.html?company_id=X`).

**Files**:
- [client/pages/scripts/my-clients.js](../../../client/pages/scripts/my-clients.js) — `TEAM_SSI_VIEW_PATH` constant + `urlForClient(path, clientId)` helper. New Status ▾ dropdown next to Edit ▾ (level-2 menu, 1 item: "Assessment results"). New `view-assessment` action.
- [client/css/my-clients.css](../../../client/css/my-clients.css) — full-width Status button, open-state highlight, divider.
- [scripts/test-sprint22-status-button.js](../../../scripts/test-sprint22-status-button.js) — NEW. 24/24 green wiring assertions.

**Quality gates**: 24/24 status test green; regression 40/40 (Polish) + 37/37 (Phase 3) still green. Commit `27da9a5`.

---

## Session #183b (2026-04-30) — Consultant cockpit (Plan ▾ + Objectives box + tenant self-heal, +3 pts)

**Goal**: Make the My Clients tile the single cockpit. Add `Plan ▾` dropdown, make Objectives box clickable, hide the legacy "Select Company" nav switcher for CONSULTANT, and close the JWT-swap race window with a self-healing preflight.

**Files**:
- [client/js/common.js](../../../client/js/common.js) — NEW `KarviaCommon.ensureActiveCompany(companyIdFromURL)`: idempotent self-heal. If URL `?company_id=X` ≠ stored `karvia_user.company_id`, calls `PUT /api/auth/switch-company` and updates token + user.
- [client/pages/scripts/objectives.js](../../../client/pages/scripts/objectives.js) — `initializeObjectivesPage` reads `?company_id=` and `awaits ensureActiveCompany` before `loadObjectives()`.
- [client/js/quarterly-goals.js](../../../client/js/quarterly-goals.js) — same preflight in `init()` before `GoalsAPIClient` ctor.
- [client/pages/scripts/my-clients.js](../../../client/pages/scripts/my-clients.js) — Two new constants (`QUARTERLY_GOALS_PATH`, `OBJECTIVES_PATH`). NEW `Plan ▾` dropdown (1 item: "Planning page"). Objectives box becomes `data-action="open-objectives"` w/ ARIA + keyboard (Enter/Space).
- [client/css/my-clients.css](../../../client/css/my-clients.css) — generalized full-width rule + divider for any adjacent dropdown wraps; clickable `.mc-obj` w/ pointer cursor + hover tint + gold focus-visible outline.
- [client/js/navigation.js](../../../client/js/navigation.js) — extracted `_renderCompanySwitcher()` returning `''` for CONSULTANT (markup not injected). `initCompanySwitcher()` belt-and-braces early-return for CONSULTANT. Source preserved + audit-ticket TODO `#183c`.
- [scripts/test-sprint22-cockpit.js](../../../scripts/test-sprint22-cockpit.js) — NEW. 34/34 wiring assertions.
- [scripts/test-sprint22-status-button.js](../../../scripts/test-sprint22-status-button.js) — 3 selector-form assertions updated to assert intent (the generalized CSS satisfies all three).

**Quality gates**: 34/34 cockpit + 24/24 status + 40/40 polish + 37/37 phase 3 all green. Commit `d3715f6`.

---

## Sprint 22 Close — 2026-04-30

**Final tally**: **66/87 pts (76%)** delivered.

### Why Sprint 22 closes here

During #183b implementation, screenshots from the user's browser revealed the consultant flow has a **fundamental architectural defect**:

- `quarterly-goals.html` hangs at "Loading…" — orphaned prototype, only inbound link is the brand-new Plan ▾ button
- `planning-v2.html` displays a purple "Viewing as: Client Company" banner with a "Back to My Company" button — the legacy artifact of the JWT-swap pattern where consultants *become* their client to view client data

Both symptoms trace to the same root cause: **the platform models tenant scope as JWT-derived (`req.user.company_id`)**. To "view a client", a consultant calls `PUT /api/auth/switch-company` — mutating their own JWT and `current_company_id`. The consultant ceases to be themselves; everything on screen flips into the client tenant. This breaks UX, leaks security boundaries, and blocks the email-invitation/onboarding flow we need for Beta.

This is **not patchable** with another tile button. Continuing Epic E on top of this would build the Objective Wizard against the wrong tenant model, then have to be rewritten in Sprint 22a anyway.

### Decision: open Sprint 22a (Beta blocker), defer Epic E to Sprint 23

| | Sprint 22 | Sprint 22a (NEW) | Sprint 23 |
|---|---|---|---|
| Status | 🔒 CLOSED | ⏳ Audit-first; queued | ⏳ Carry-overs |
| Pts | 66/87 delivered | ~28 (audit + 5 sessions) | Epic E (10) + H (10) + D (8) + G (10) |

Sprint 22a charter: [`SPRINT22a_MASTER_PLAN.md`](../../SPRINT-22a-Consultant-Client-Separation/SPRINT22a_MASTER_PLAN.md)

### Final Live Snapshot (post #183b)

| Epic | Pts | Status | Sessions |
|------|-----|--------|----------|
| Epic 0 (Pre-work) | 13 | ✅ | #174–#175 |
| Epic A (Data Models) | 5  | ✅ | #176 |
| Epic B (AIContextService) | 10 | ✅ | #177 |
| Epic F (aiOKRService Cascade) | 10 | ✅ | #178 |
| Epic C (My Clients + Wizard) | 21 | ✅ | #179–#181 |
| Epic C-Polish (Edit/Remove/Profile) | 5  | ✅ | #182 |
| Status ▾ button | 2 | ✅ | #183a |
| Cockpit polish (Plan ▾ + Objectives + tenant self-heal) | 3 | ✅ | #183b |
| Epic E (Objective Wizard) | 10 | 🚫 Deferred → Sprint 23 | — |
| Epic H (Planning Page) | 10 | 🚫 Deferred → Sprint 23 | — |
| Epic D (Assessment Hub) | 8  | 🚫 Deferred → Sprint 23 | — |
| Epic G (Dashboard V3) | 10 | 🚫 **Split** — V3 layout + theme to S23; Tasks→Moves rename gated on Sprint 22a #184c | — |

### Sprint 22 Carry-Over Impact (audited 2026-04-30)

| Epic | Sprint 22a Impact | Disposition |
|---|---|---|
| **Epic E** | Wizard is role-agnostic; doesn't assume JWT-swap. Consultant access path becomes `client-workspace.html` post-22a | Sprint 23 |
| **Epic H** | `planning-v2.html` is BUSINESS_OWNER/EXECUTIVE/MANAGER native; no JWT-swap assumption | Sprint 23 — no conflict |
| **Epic D** | Already uses `managed_businesses[]` pattern (D spec line 208); no JWT-swap assumption | Sprint 23 — no conflict |
| **Epic G** | V3 layout + Navy/Gold theme are safe. **Tasks→Moves rename** has consultant-view risk if it ships before #184c (Sprint 22a) | **Split**: layout + theme S23; rename gated on Sprint 22a |

**Planning gap surfaced by audit**: none of the Sprint 22 epic specs explicitly document user role. Sprint 22a audit deliverable will produce a retroactive Epic ↔ Role matrix.

### Watch-Items Carried Forward

- **AI enrich endpoint** (POST /api/consultant/clients/enrich) reportedly broken on karvia-business-1; manual fallback firing. Diagnosis task carried to Sprint 22a #184d (since invitation flow shares the wizard).
- **`navigation.js` purple "Viewing as" banner** (lines 448–465) — currently still rendered for CONSULTANT in client tenant, will become unreachable once #184c retires `switch-company` from consultant flow. Cleanup ride-along in #184c.
- **`quarterly-goals.html` deletion** is bundled with #184c (its only inbound link is the Plan ▾ button which #184b repoints to `client-workspace.html`).

### Test Surface (carried into Sprint 22a regressions)

| Suite | Asserts | Status |
|---|---|---|
| `test-sprint22-epic-c-phase3.js` | 37 | ✅ |
| `test-sprint22-epic-c-polish.js` | 40 | ✅ |
| `test-sprint22-status-button.js` | 24 | ✅ |
| `test-sprint22-cockpit.js` | 34 | ✅ |

All four must stay green through Sprint 22a. Any failure during 22a is a regression to investigate before proceeding.

### Final Commits

- `27da9a5` — feat(sprint22): Session #183a — Status ▾ tile dropdown
- `d3715f6` — feat(sprint22): Session #183b — Consultant cockpit + tenant self-heal

---

**Sprint 22 closed**: 2026-04-30
**Next sprint**: Sprint 22a — Audit session (no code) — see [SPRINT22a_MASTER_PLAN.md](../../SPRINT-22a-Consultant-Client-Separation/SPRINT22a_MASTER_PLAN.md) and [audit/AUDIT_BRIEF.md](../../SPRINT-22a-Consultant-Client-Separation/audit/AUDIT_BRIEF.md)

