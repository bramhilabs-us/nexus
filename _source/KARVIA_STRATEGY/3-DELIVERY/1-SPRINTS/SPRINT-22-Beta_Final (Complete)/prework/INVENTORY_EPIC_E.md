# Inventory — Epic E: Objective Wizard

<!-- @GENOME T3-SPR-022-PW-IE | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_E_OBJECTIVE_WIZARD.md](../epics/EPIC_E_OBJECTIVE_WIZARD.md)
**Points**: 10

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| Wizard HTML scaffold | 🔧 extend | `client/pages/objective-wizard.html` EXISTS in production with 3-screen scaffold + step indicator + nav | UPDATE per-screen content fields only; preserve nav block |
| Wizard JS | 🔧 extend | `client/pages/scripts/objective-wizard.js` EXISTS | EXTEND with discipline selector, SSI dropdowns, AI KR generation, KeyResult writes |
| Objective.behavior_ids | 🆕 new | NOT present in `server/models/Objective.js` | ADD field |
| Objective.ssi_impact | 🆕 new | NOT present | ADD field |
| Objective.ai_guidance | 🆕 new | NOT present | ADD field |
| Objective.key_results embedded | ⚠️ conflict | EXISTS at `server/models/Objective.js:116-171` | DECISION: Epic A says move to separate KeyResult model, but Epic E spec STILL embeds them. Resolve in D-E-1 |
| POST /api/objectives | 🔧 extend | EXISTS at `server/routes/objectives.js:87` with `validateObjectiveLimit` middleware | EXTEND payload to accept behavior_ids, ssi_impact, key_results array; CREATE separate KeyResult docs after Objective save |
| POST /api/objectives/generate-krs | 🆕 new | none | CREATE (delegates to Epic F's `aiOKRService.generateKRs`) |
| Discipline selector grouped by 4 foundations | ⚠️ conflict | Epic A's `disciplines.js` has 9 disciplines with `order` field. Epic E mockup shows "DISCIPLINE / GROWTH / ACCOUNTABILITY / MATURITY" foundation grouping | Add `foundation` key to disciplines config OR map by category (Epic B's variant) |
| AI KR generation orchestration | 🔧 extend | none server-side; `aiOKRService.generateKRs` is NEW (Epic F) | INTEGRATE in route (depends on F) |
| objective-wizard.css | 🆕 new | none | CREATE OR fold into s13-patterns.css |

---

## ⚠️ Critical Spec Contradictions

1. **`objective-wizard.html` "Action: CREATE"** — but the file exists in production. Spec internal contradiction (top says "update in place", "Files to Create/Modify" table says "CREATE")
2. **Embedded `key_results[]` in Objective schema (Epic E line 314-322)** — directly conflicts with Epic A's "remove embedded KRs, use separate KeyResult collection" decision (Session #172)
3. **Disciplines reference**: Epic E mockup uses `value="behavior_id_1"` and `<input type="checkbox" name="behaviors">`. Field name `behaviors` vs `discipline_ids` — pick one. Epic E body uses `discipline_ids` in API call but `behaviors` in HTML

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `server/models/Objective.js` | 12-186+ | Has company_id, owner_id, title, description, category enum, time_period_type, status, key_results[] embedded (116-171) | ADD behavior_ids, ssi_impact, ai_guidance fields. KEEP key_results[] embedded for backwards compat (D-A-1 decision applies) |
| `server/routes/objectives.js` | 87 | POST with `validateObjectiveLimit` | EXTEND to also create KeyResult docs (separate collection) |
| `client/pages/objective-wizard.html` | full | 3-screen production wizard | UPDATE content per screen; preserve nav lock |
| `client/pages/scripts/objective-wizard.js` | full | Existing wizard logic | EXTEND state machine and API calls |

---

## Net-New API Endpoints

| Method | Path | Owner |
|--------|------|-------|
| POST | `/api/objectives/generate-krs` | E (calls F service) |

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| E-1 | Embedded `key_results[]` vs separate KeyResult collection — Epic A says separate, Epic E shows embedded. Resolve | DECISIONS_LOG.md → D-A-1 |
| E-2 | "behaviors" vs "discipline_ids" field naming — pick one and propagate | DECISIONS_LOG.md → D-E-2 |
| E-3 | Foundation grouping (Discipline/Growth/Accountability/Maturity) needs to be defined in disciplines.js or via category mapping | DECISIONS_LOG.md → D-A-5 / D-E-3 |
| E-4 | Spec uses `await orchestrator.context.assembleContext` — orchestrator is gone; should be `AIContextService.assembleContext` | DECISIONS_LOG.md → D-E-4 |
| E-5 | "Files to Create/Modify" table says CREATE for files that exist. Fix | DECISIONS_LOG.md → D-E-5 |
| E-6 | `validateObjectiveLimit` middleware — does it apply to wizard-created objectives? Define limit policy | DECISIONS_LOG.md → D-E-6 |
| E-7 | After Objective is saved with KRs, are KRs created in BOTH places (embedded + collection)? Or only collection? Drives migration story | DECISIONS_LOG.md → D-E-7 |
| E-8 | Screen 1 "SSI Impact (optional)" — but if user has no completed assessment, dropdowns should be empty/disabled. Define UX | DECISIONS_LOG.md → D-E-8 |

---

## Acceptance-Criteria Coverage Audit

Current AC (9 items) covers: 3-screen nav, fields, behavior cap, KR edit/accept/reject, save, back/next/skip. **Gaps**:
- No AC for AI fallback (template KRs when AI fails)
- No AC for KeyResult docs created in collection (vs only embedded)
- No AC for tenant scope on POST /api/objectives
- No AC for SSI auto-suggest when no assessment exists

Add 4 AC items.

---

## Test-Plan Stub

- Unit: validateCurrentStep returns correct boolean per step
- Unit: behavior selection cap (5 max) disables remaining checkboxes
- Integration: POST /api/objectives creates Objective AND N KeyResult docs in separate collection
- Integration: POST /generate-krs calls Epic F service, returns KRs and guidance
- Integration: AI failure → template fallback returned
- Playwright: full happy path (3 screens, AI generate, save)
- Playwright: manual KR entry path
- Tenant: cross-tenant Objective POST rejected
