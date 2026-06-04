# Decisions Log — Sprint 22 Pre-Work

<!-- @GENOME T3-SPR-022-PW-DL | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

Every gap, contradiction, and undefined rule from the inventories surfaces here with a proposed resolution. **Sign-off required before Phase 8 (epic patching).**

**Status legend**: 🟡 PROPOSED · 🟢 APPROVED · 🔴 REJECTED · ⚫ DEFERRED

**SIGN-OFF**: All 59 decisions 🟢 APPROVED on 2026-04-29 by stakeholder ("approve all"). Phase 8 patches applied below.

---

## How to use this log

1. Read each row.
2. Reply with: row id + ✅ approve / ✏️ amend (with text) / ⏭ defer to S23 / ❌ reject.
3. Once all rows have a non-PROPOSED status, Phase 8 patches the epics with the resolutions baked in.

---

## Track 2 Gap Categories Coverage

| Category | Decisions in this log |
|----------|----------------------|
| 0.13 Internal contradictions | D-C-1, D-C-15, D-E-5, D-G-2, D-H-6 |
| 0.14 Missing model fields | D-C-3, D-C-4 |
| 0.15 Undeclared deps | D-C-2, D-A-1, D-E-7 |
| 0.16 Missing service methods | D-F-1 |
| 0.17 Endpoint shape mismatch | D-C-13, D-D-2 |
| 0.18 Multi-tenancy holes | D-C-6, D-D-4 |
| 0.19 Undefined business rules | D-C-5, D-D-3, D-D-5, D-D-7, D-G-6, D-H-1, D-H-4, D-H-5 |
| 0.20 Asset ownership conflicts | D-C-9, D-C-10, D-G-1, D-G-5 |
| 0.21 Missing test plans | resolved by `TEST_PLAN_STUBS.md` |
| 0.22 Scope-creep features | D-C-8, D-C-11, D-C-12, D-G-3 |
| 0.23 Stale phase descriptions | D-C-1, D-G-2, D-H-6 |
| 0.24 AC coverage gaps | resolved per-epic during Phase 8 patch |

---

## Epic A — Decisions

### D-A-1 — Embedded `Objective.key_results[]` vs separate KeyResult collection

**Issue**: Epic A says "remove embedded KRs"; Epic E spec keeps embedded `key_results[]`; Objective.js currently has them.

**Proposed**: 🟡 **Dual-write, single-read**.
- Keep `Objective.key_results[]` embedded for backwards compat (existing OKR generation flow at `aiOKRService.generateOKRsFromAssessment` writes there).
- Wizard-created KRs are written to BOTH the embedded array AND the new KeyResult collection until cutover (post-Sprint 22).
- All NEW reads (My Clients aggregations, Planning page, Dashboard) use `KeyResult.find({ objective_id })`.
- Add `Objective.virtual('key_results_v2', { ref: 'KeyResult', localField: '_id', foreignField: 'objective_id' })`.

**Why**: Avoid breaking the existing assessment-driven OKR flow; lets Sprint 22 ship without a data migration.
**Cleanup**: Sprint 23 adds a one-time migration script that copies embedded → collection and drops the embedded field.

### D-A-2 — Goal.js coexistence with WeeklyGoal.js

**Proposed**: 🟡 **Old Goal queries continue to hit Goal.js; new code uses WeeklyGoal.js**.
- `Goal.js` (with `time_period: 'WEEKLY'`) stays untouched.
- `WeeklyGoal.js` is for the new cascade (KeyResult → WeeklyGoal → Move).
- Planning page reads from WeeklyGoal **only** (D-H-2). The "old" weekly-goals page (if any) continues to read Goal.js.
- No data migration in Sprint 22.

### D-A-3 — Task.js coexistence with Move.js

**Proposed**: 🟡 **Same as D-A-2**.
- Task.js untouched.
- Move.js for new cascade.
- Dashboard V3 reads from Move.js. Old dashboard pieces (if any) read Task.js.
- No migration.

### D-A-4 — Source of truth for KeyResult.year vs Objective.target_year

**Proposed**: 🟡 **Objective.target_year wins**.
- KeyResult.year is denormalized for query performance.
- On KeyResult create/update, server enforces `keyResult.year === objective.target_year`.
- Reject KR write with mismatched year (400).

### D-A-5 — Disciplines `category` / `foundation` field shape

**Issue**: Epic A's `disciplines.js` has no `category`. Epic B's variant adds `category` (foundation/execution/strategy/wellbeing/collaboration/leadership). Epic E mockup groups by "Discipline / Growth / Accountability / Maturity".

**Proposed**: 🟡 **Single `foundation` field on each discipline; 4 foundations**.
- Add `foundation: 'discipline' | 'growth' | 'accountability' | 'maturity'` to each of the 9 records.
- Drop the 6-category Epic B variant (was speculative).
- Mapping (proposed):
  - `discipline` → truth, ownership, follow_through
  - `growth` → foresight, alignment
  - `accountability` → consistency, handoffs
  - `maturity` → energy_stewardship, formation
- Helpers: `getDisciplinesByFoundation(foundation)`, `getFoundations()`.

### D-A-6 — CRUD route ownership

**Issue**: API_DELTAS lists CRUD routes for KeyResult/WeeklyGoal/Move but ownership is split inconsistently across master plan ("Epic E owns key-results.js", "Epic G owns moves.js", etc.).

**Proposed**: 🟡 **All CRUD lives in Epic A scaffolds; consumer epics extend**.
- Epic A creates `routes/key-results.js`, `routes/weekly-goals.js`, `routes/moves.js` as basic CRUD scaffolds (auth + tenant + soft-delete).
- Epic E adds `/objectives/generate-krs` separately.
- Epic F adds `/weekly-goals/generate` and `/moves/generate` (the AI-generation endpoints).
- This keeps Epic A the single source of model-route truth.

---

## Epic B — Decisions

### D-B-1 — AIContextService "EXISTING METHODS" claims are fictional

**Proposed**: 🟡 **Rewrite Epic B's "Backwards Compatibility" section against real code**.
- Real existing methods: `buildObjectiveContext`, `getCompanyProfile`, `getLatestSSIScores`, `getFullSSIScores`, `extractBusinessContext`, `identifyRiskIndicators`, `getIndustryLabel`, `getCompanyProfileSSIFallback`.
- Fictional methods Epic B mentions: `buildContext`, `getActiveObjectives` — remove from spec.

### D-B-2 — Singleton vs class export

**Proposed**: 🟡 **Verify by reading exports during Phase 8 patch**.
- If singleton (`module.exports = new AIContextService()`): `initializeProviders()` is called once on the singleton; routes use the same instance.
- If class: convert to singleton or pass instance everywhere. Recommend singleton.
- Phase 8 includes a 1-line verification step.

### D-B-3 — Discipline config API surface

**Proposed**: 🟡 **Use `getAll()`, `getById(id)`, `getIds()`, `isValid(id)`, `getDisciplinesByFoundation(foundation)`, `getFoundations()`** — single config module exporting these.
- Epic A's spec uses `getDisciplineIds()`, `getDisciplineById()`, `getDisciplinesForDropdown()` — rename to align with above.
- All consumers (Move model enum, Epic B provider, Epic E UI) use the unified API.

### D-B-4 — AssessmentProvider score path

**Proposed**: 🟡 **Prefer `ssi_result.overall.score` and `ssi_result.dimensions.<d>.score`**.
- Fall back to `ssi_scores.<d>.score` only when `ssi_result` block is absent (older docs).
- Use `_getDimensionScore` helper that already exists at line 623 — extracted into provider.

### D-B-5 — Cache invalidation

**Proposed**: 🟡 **Default TTL only; no manual invalidation in Sprint 22**.
- 5-min default TTL is sufficient for current operations.
- `invalidateProviderCache(pattern)` exists for future use (e.g. on Company write) — not wired in Sprint 22.
- Decision: `invalidateProviderCache` is exported but unused. Document as future-only.

---

## Epic C — Decisions

### D-C-1 — Internal contradictions (21pts vs 3-step wizard vs 2-step AI flow)

**Proposed**: 🟡 **Canonical = 2-step AI flow (per Session #167 brainstorm)**.
- Phase 3 description rewritten to "2-step AI auto-fill wizard with manual fallback".
- Acceptance Criteria updated to enforce AI auto-fill happy path + manual fallback.
- Story points stay 21 (Phase 3's 5 pts intact, scope unchanged).

### D-C-2 — Undeclared dependencies

**Proposed**: 🟡 **Update Epic C "Dependencies" line**:
- "Depends on Epic A (Company field additions for stage, primary_contact, etc.)"
- "Depends on Epic F (`enrichCompany()` for AI auto-fill in Phase 3)"
- Phase 1 + Phase 4 can start before A/F land; Phases 2 + 3 require them.

### D-C-3 — `description` field placement

**Proposed**: 🟡 **Lift `description` to top-level on Company**.
- Add `Company.description: String(1000)` at top level.
- Existing `Company.business_context.profile.description` stays (legacy).
- New code reads/writes top-level `description`.
- One-time backfill (next Sprint): copy nested → top-level if top-level absent.
- Reason: AI enrich produces a clean 2-4 sentence description; embedding it in `business_context.profile` violates "AI auto-fill" simplicity.

### D-C-4 — `employee_count` requirement vs `size` band

**Proposed**: 🟡 **Make `employee_count` optional; derive from `size` band**.
- Change Company schema: `employee_count: { type: Number, min: 1, max: 500, required: false }`.
- On client create, server derives `employee_count = midpoint(size)` if not provided.
- Mapping: `1-10 → 5, 11-50 → 30, 51-200 → 125, 201-500 → 350`.
- Existing companies unaffected (already populated).

### D-C-5 — `risk_status` formula

**Proposed**: 🟡 **Computed at read time; not stored**.
- Formula:
  - `urgent`: any of (no completed assessment in 90d) OR (avgSSI < 50) OR (any objective `behind` for 30+ days)
  - `at_risk`: any of (avgSSI 50-65) OR (objectives `at_risk` ≥ 50% of total)
  - `healthy`: otherwise
- Computed in `/portfolio-summary` aggregation pipeline.
- "Need Attention" KPI = count where `risk_status !== 'healthy'`.
- "At Risk" KPI = count where `risk_status === 'urgent'`.
- No DB index needed (computed).
- Drop the `risk_status` field from MODEL_DELTAS.md (revert that addition).

### D-C-6 — POST /clients tenancy + side effects

**Proposed**: 🟡 **3-step transaction**:
1. Create Company doc (no parent company_id)
2. `User.findByIdAndUpdate(req.user._id, { $push: { managed_businesses: company._id } })`
3. Create default Team `{ name: 'Default', company_id: company._id, owner_id: req.user._id }` so subsequent UI flows have a team to attach to.
- Wrapped in mongoose session/transaction if available; otherwise sequential with rollback on failure.
- `primary_contact` stored as sub-doc on Company (not as a User account in Sprint 22; user accounts come later).

### D-C-7 — Stage transitions

**Proposed**: 🟡 **No transition state machine in Sprint 22**.
- Default `stage = 'prospect'` on create.
- Any role with write access can change stage to any value (free-form).
- No audit log of stage changes (descope to S23).
- AC: stage filter on My Clients works; stage badge displays correctly.

### D-C-8 — Welcome email

**Proposed**: 🟡 **Descope to Sprint 23**.
- Remove `sendWelcomeEmail` checkbox from Step 2 of wizard.
- POST /clients does not send email in Sprint 22.
- Reason: no template, no Mailjet wiring spec, low value vs cost.

### D-C-9 — CSS file ownership

**Proposed**: 🟡 **One file per page, but tokens stay in s13-patterns.css**.
- Create `client/css/my-clients.css` for page-specific layout (tile, KPI cards).
- Token defs (`--s22-*`, `--karvia-primary`) stay in `s13-patterns.css` (already there).
- `my-clients.html` includes both: `<link s13-patterns.css>` then `<link my-clients.css>`.

### D-C-10 — Dashboard nav href

**Proposed**: 🟡 **Keep `/pages/dashboard-v2.html`**.
- Epic G updates dashboard-v2.html in place (per Epic G's "Implementation file" line).
- Nav stays pointing at v2; no nav update in Epic G.
- Reason: rename creates redirect/cache issues; in-place update is cleanest.

### D-C-11 — Nudge "Send Reminder" implementation

**Proposed**: 🟡 **Stub-only in Sprint 22**.
- Dropdown opens; "Send Reminder" button shows toast "Reminder sent" (no backend).
- Add TODO comment pointing to S23 ticket.
- AC updated to enforce stub behavior, not real email.

### D-C-12 — Notes action implementation

**Proposed**: 🟡 **Stub-only in Sprint 22**.
- Click opens a modal with read-only display of Company `notes` field (already exists in Company schema? verify) and a textarea.
- Save updates `Company.notes` via existing `PUT /api/companies/:id` (verify endpoint).
- If endpoint doesn't exist, descope to button-only stub.

### D-C-13 — Extended `/portfolio-summary` aggregation

**Proposed**: 🟡 **Phase-2 work, blocks on Epic A**.
- New aggregation queries: Objective + KeyResult collections (KeyResult is new in A).
- For consultants whose clients have no Objectives yet (typical for `prospect` stage): return `objectives: { total: 0, onTrack: 0, atRisk: 0, behind: 0 }`.
- onTrack/atRisk/behind formula: based on Objective.status enum + progress vs time elapsed (formula to define during Phase 2 of Epic C — placeholder: `behind = progress < 0.5 * timeElapsed; at_risk = progress < 0.75 * timeElapsed; on_track = otherwise`).

### D-C-14 — Nav visibility

**Proposed**: 🟡 **CONSULTANT only**.
- Modify only `client/js/navigation.js:12-18` (CONSULTANT block).
- BUSINESS_OWNER, EXECUTIVE, MANAGER, EMPLOYEE blocks unchanged.

### D-C-15 — Story-points table stale entry

**Proposed**: 🟡 **Rewrite story-points table**:
- "Add Client Wizard (3 steps) | 5" → "Add Client Wizard (2-step AI auto-fill) | 5"
- Keep total at 21.

---

## Epic D — Decisions

### D-D-1 — `assessment-hub.js` does not exist

**Proposed**: 🟡 **Change spec from MODIFY to CREATE**.
- New file at `client/pages/scripts/assessment-hub.js`.
- Move any inline `<script>` block from assessment-hub.html into this file as a starting point.

### D-D-2 — `ssi_result` vs `ssi_scores` source

**Proposed**: 🟡 **Sub-dimensions live under `ssi_result.sub_dimensions`** (per spec).
- Existing scoring writes to both `ssi_scores` AND `ssi_result` today (per model). Sub-dim addition extends `ssi_result` only.
- Read-side fallback: if `ssi_result.sub_dimensions` absent, return null and UI displays "—".

### D-D-3 — Constraint tie-breaking

**Proposed**: 🟡 **Deterministic ordering**.
- On equal scores, prefer (a) lower dimension order: `speed < strength < intelligence`, then (b) alpha sub-dim order.
- Example: Speed.decision_making (40) and Strength.team_capability (40) → Speed.decision_making wins.

### D-D-4 — Compare endpoint tenant scope

**Proposed**: 🟡 **Enforce tenant scope on both ids**.
- Reject 403 if `assessment1.company_id` or `assessment2.company_id` not in user scope.
- For consultants: both must be in `managed_businesses[]`.

### D-D-5 — Trends partial-month behavior

**Proposed**: 🟡 **Include partial current month**.
- groupByMonth uses YYYY-MM key.
- Current incomplete month included with `count` reflecting actual assessments in that month.
- UI shows current month with dotted line or note "(MTD)".

### D-D-6 — Chart.js loading

**Proposed**: 🟡 **CDN via `<script src>` in assessment-hub.html**.
- Use existing pattern (other live pages already use Chart.js if present — verify).
- Pinned version in `<script>` tag.
- Vendor it in S23 if CDN reliability is an issue.

### D-D-7 — Sub-dimension scoring pipeline

**Proposed**: 🟡 **Score at submission time; back-fill via NULL for old data**.
- On `POST /assessments/:id/submit-responses`, compute sub_dimensions from question→sub-dim mapping (mapping defined in seeds).
- Existing assessments: sub_dimensions absent (sparse).
- Add a follow-up Sprint 23 ticket for back-fill if reporting requires it.

---

## Epic E — Decisions

### D-E-2 — `behaviors` vs `discipline_ids` field name

**Proposed**: 🟡 **Use `discipline_ids` everywhere** (matches model field "discipline" enum).
- Frontend HTML input: `name="discipline_ids"` (rename from "behaviors").
- Backend payload key: `discipline_ids: [String]`.
- Objective.js field: `discipline_ids: [String]` (NOT `behavior_ids` — rename in MODEL_DELTAS).

### D-E-3 — Foundation grouping

**Proposed**: 🟡 **Use D-A-5 resolution** (4 foundations).

### D-E-4 — `orchestrator.context.assembleContext` reference

**Proposed**: 🟡 **Replace with `AIContextService.assembleContext`**.
- Spec rewritten to reference the actual service singleton.

### D-E-5 — Files to Create that exist

**Proposed**: 🟡 **Spec table updated**:
- `objective-wizard.html`: MODIFY (not CREATE)
- `objective-wizard.js`: MODIFY (not CREATE)
- `objective-wizard.css`: CREATE OR fold into s13-patterns.css (D-C-9 pattern)

### D-E-6 — `validateObjectiveLimit` middleware

**Proposed**: 🟡 **Keep middleware, raise/remove limit policy via env var**.
- Wizard creates objectives like any other create — same limit applies.
- If limit becomes blocker, set `OBJECTIVE_LIMIT=10000` in env (or a per-tenant override). No Sprint 22 code change.

### D-E-7 — Dual-write of KRs

**Proposed**: 🟡 **Per D-A-1**: write to BOTH embedded + collection on objective create.
- POST /objectives:
  1. Save Objective with `key_results[]` embedded as before.
  2. After save, iterate the array and create KeyResult docs with `objective_id = objective._id`, copy fields.
  3. Return the Objective with both representations.

### D-E-8 — SSI auto-suggest when no assessment

**Proposed**: 🟡 **Show empty dropdowns; no warning**.
- If `assessment.constraint` is null/undefined, dropdowns render empty (placeholder "Select...").
- User can manually pick.
- No "complete an assessment first" nag.

---

## Epic F — Decisions

### D-F-1 — Add `enrichCompany()` to spec

**Proposed**: 🟡 **Adopt the SERVICE_EXTENSIONS.md spec** for `enrichCompany`.
- Add full method block to Epic F (signature, prompt, web-search tool config, 3s timeout, cache, error contract).
- Test plan as in TEST_PLAN_STUBS.md.

### D-F-2 — enrich cache storage

**Proposed**: 🟡 **In-memory `Map` with 24h TTL**.
- Lost on restart — acceptable.
- Optional Redis upgrade flagged for S23 if cache hit rate matters.

### D-F-3 — `parseNumber` and currency

**Proposed**: 🟡 **Strip non-digits for KR target/baseline**; for unit, persist string ('USD', 'days') separately.
- KR.target_value is always Number; KR.unit holds the string ('USD', 'days', '%', etc.).
- parseNumber regex ok.

### D-F-4 — KR count min/max

**Proposed**: 🟡 **Enforce min 1, max 5 in `parseCascadeResponse`**.
- Add `if (krs.length < 1) throw new Error('AI returned no KRs')` so caller can fall back.
- Existing `.slice(0, 5)` enforces max.

### D-F-5 — OpenAI model for enrich

**Proposed**: 🟡 **Use `gpt-4-turbo` (or `gpt-4.1`) with web-search tool for enrichCompany; existing model for KR/WG/Move generation**.
- Configurable via env: `OPENAI_ENRICH_MODEL=gpt-4-turbo`.
- Fallback if web-search tool not supported in environment: return template stub with `confidence: 0`, `sources: []`, `detected_signals: []`.

### D-F-6 — Rate limiting on new endpoints

**Proposed**: 🟡 **Apply existing `aiGenerationLimiter` to all 4 new AI endpoints**:
- `POST /api/objectives/generate-krs`
- `POST /api/weekly-goals/generate`
- `POST /api/moves/generate`
- `POST /api/consultant/clients/enrich` (separate, lower limit — e.g. 20/hr/user since it hits external web search)

### D-F-7 — Cost tracking

**Proposed**: 🟡 **Descope to Sprint 23**.
- No per-tenant AI quota in Sprint 22.
- Existing rate limiting is sufficient bounding.

---

## Epic G — Decisions

### D-G-1 — Nav href for Dashboard

**Proposed**: 🟡 **Keep `/pages/dashboard-v2.html`** (per D-C-10).

### D-G-2 — Spec body shows old layout, not V3

**Proposed**: 🟡 **Rewrite spec "Dashboard Layout Updates" section to reference V3 mockup**.
- Replace HTML examples with snippets from `dashboard-v3.html`.
- Add sections: KPI strip, group switch, causal-chain cards, catch-up tiles, expanded-card popovers.

### D-G-3 — Reaction badge with no backend

**Proposed**: 🟡 **Render Action and Habit badges only in Sprint 22**.
- Reaction badge defined in CSS but not used until Move.move_type=`reaction` is written by some flow (S23+).
- Avoids confusing UI with empty category.

### D-G-4 — Stub data vs live for V3 elements

**Proposed**: 🟡 **Live data wherever Move + WeeklyGoal collections exist; stub otherwise**.
- After Epic A + E + H land, Dashboard reads real Move + WeeklyGoal data.
- Until then, dashboard renders empty states with helpful copy ("No moves this week. Create an objective to get started.").

### D-G-5 — Theme alias scope

**Proposed**: 🟡 **Pre-flight grep + apply alias**.
- Confirm `git grep '\bvar(--karvia-primary)\b' client/css client/pages` returns only the 2 component classes Epic G's spec lists.
- If others found, audit before alias rollout.
- Keep alias as a 1-line additive change.

### D-G-6 — Tasks → Moves rename safety

**Proposed**: 🟡 **Word-boundary, case-aware sed**:
```bash
# Only in dashboard files; preserve identifiers
sed -i '' -E 's/\bTasks\b/Moves/g; s/\bTask\b/Move/g; s/\btasks\b/moves/g' client/pages/dashboard-v2.html
```
- Skip JS variable names (`taskId`, `taskList`) — keep as-is.
- Manual review post-sed before commit.

---

## Epic H — Decisions

### D-H-1 — Week→month assignment

**Proposed**: 🟡 **Week assigned to the month containing its Monday (start)**.
- Week starting Mar 30 (Mon) → March group, even if it spans into April.
- Week starting Apr 6 (Mon) → April group.

### D-H-2 — `goal count` data source

**Proposed**: 🟡 **WeeklyGoal collection only**.
- Old Goal.js (time_period=WEEKLY) is not surfaced on the new Planning page.
- This is consistent with D-A-2 (no migration; new flows own new model).

### D-H-3 — AI presets ship UI only or live

**Proposed**: 🟡 **UI-only in Sprint 22; wire to F endpoint when F is ready**.
- If F lands before H finishes: wire it.
- If F is late: presets render but click shows toast "Coming soon" (with feature flag).

### D-H-4 — Auto-expand current month timezone

**Proposed**: 🟡 **User local timezone (browser `Date`)**.
- `expandCurrentMonth()` runs on page load using client `new Date()`.
- Server data already returns full quarter; client decides which group to expand.

### D-H-5 — Week boundaries

**Proposed**: 🟡 **Mon–Sun (ISO 8601)**.
- Consistent with most existing date code; verify DateService default.

### D-H-6 — Stale 61-pts note in Epic H

**Proposed**: 🟡 **Update note**:
- "Sprint 22 master plan total is 87 pts (Epic 0: 13 + A: 5 + B: 10 + C: 21 + D: 8 + E: 10 + F: 10 + G+H: 10)."

---

## Decisions Awaiting Sign-Off (summary)

| # | ID | Title | Type |
|---|----|-------|------|
| 1 | D-A-1 | Embedded vs separate KR collection (dual-write) | architecture |
| 2 | D-A-2 | Goal/WeeklyGoal coexistence | architecture |
| 3 | D-A-3 | Task/Move coexistence | architecture |
| 4 | D-A-4 | KR.year vs Objective.target_year | data integrity |
| 5 | D-A-5 | Disciplines `foundation` field shape | config |
| 6 | D-A-6 | CRUD route ownership | scope |
| 7 | D-B-1 | AIContextService spec falsification | spec correction |
| 8 | D-B-2 | Singleton vs class export | implementation |
| 9 | D-B-3 | Discipline config API surface | config |
| 10 | D-B-4 | Assessment score path priority | data |
| 11 | D-B-5 | Cache invalidation policy | scope |
| 12 | D-C-1 | Wizard 2-step canonical | spec correction |
| 13 | D-C-2 | Epic C dependencies declared | spec correction |
| 14 | D-C-3 | Company.description placement | model |
| 15 | D-C-4 | employee_count optional + derive | model |
| 16 | D-C-5 | risk_status formula (computed) | business rule |
| 17 | D-C-6 | POST /clients side effects | tenancy |
| 18 | D-C-7 | Stage default + transitions | business rule |
| 19 | D-C-8 | Welcome email descope | scope |
| 20 | D-C-9 | CSS file ownership | asset ownership |
| 21 | D-C-10 | Dashboard nav href stays | asset ownership |
| 22 | D-C-11 | Nudge stub-only | scope |
| 23 | D-C-12 | Notes stub | scope |
| 24 | D-C-13 | portfolio-summary aggregation deps | dependency |
| 25 | D-C-14 | Nav CONSULTANT-only | RBAC |
| 26 | D-C-15 | Story points table fix | spec correction |
| 27 | D-D-1 | assessment-hub.js create not modify | spec correction |
| 28 | D-D-2 | ssi_result vs ssi_scores | data |
| 29 | D-D-3 | Constraint tie-break | business rule |
| 30 | D-D-4 | Compare endpoint tenant scope | tenancy |
| 31 | D-D-5 | Trends partial month | business rule |
| 32 | D-D-6 | Chart.js loading | asset |
| 33 | D-D-7 | Sub-dim scoring pipeline | data migration |
| 34 | D-E-2 | discipline_ids field name | spec correction |
| 35 | D-E-3 | Foundation grouping (uses D-A-5) | UI |
| 36 | D-E-4 | AIContextService.assembleContext ref | spec correction |
| 37 | D-E-5 | objective-wizard MODIFY not CREATE | spec correction |
| 38 | D-E-6 | validateObjectiveLimit policy | config |
| 39 | D-E-7 | KR dual-write (uses D-A-1) | architecture |
| 40 | D-E-8 | SSI auto-suggest empty state | UX |
| 41 | D-F-1 | Add enrichCompany to Epic F | spec correction |
| 42 | D-F-2 | enrich cache in-memory | implementation |
| 43 | D-F-3 | parseNumber + currency unit split | implementation |
| 44 | D-F-4 | KR count min/max | validation |
| 45 | D-F-5 | OpenAI model for enrich | implementation |
| 46 | D-F-6 | Rate limiting on AI endpoints | infra |
| 47 | D-F-7 | Cost tracking descope | scope |
| 48 | D-G-1 | Dashboard nav href stays (uses D-C-10) | asset ownership |
| 49 | D-G-2 | Rewrite Epic G layout section to V3 | spec correction |
| 50 | D-G-3 | Reaction badge descope | scope |
| 51 | D-G-4 | Stub vs live dashboard data | implementation |
| 52 | D-G-5 | Theme alias scope verification | implementation |
| 53 | D-G-6 | Tasks→Moves sed safety | implementation |
| 54 | D-H-1 | Week→month rule | business rule |
| 55 | D-H-2 | WeeklyGoal-only goal count (uses D-A-2) | architecture |
| 56 | D-H-3 | AI presets UI only | scope |
| 57 | D-H-4 | Current month timezone | UX |
| 58 | D-H-5 | ISO Mon-Sun weeks | business rule |
| 59 | D-H-6 | Update Epic H 61-pts note | spec correction |

**Sign-off format**: reply with row IDs, e.g.
- "D-A-1 ✅, D-C-3 ✏️ keep description nested at `business_context.profile.description`, D-C-8 ✅, ..."
- Or "approve all" if all proposals look correct.

Once approved, Phase 8 patches all 8 epics + master plan + handoff in a single coordinated pass.
