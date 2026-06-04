# Sprint 24 — Session Execution Plan

<!-- @GENOME T3-SPR-024-DEP | ACTIVE | 2026-05-04 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Companion to**: [SPRINT24_MASTER_PLAN.md](SPRINT24_MASTER_PLAN.md)
**Cadence**: task-driven (no fixed dates per D-1); estimated 5-7 sessions

---

## Session Sequence (recommended)

### Session A — Discovery + Migration (Epic 24.7 + Epic 24.6)
**Pts**: 2 + 1 = 3
**Why first**: Epic 24.7 (KR audit) is a prerequisite for Epic 24.3 (ball-state needs KR creation working). Epic 24.6 (migration) sets up the schema + seeded ball states for the rest of the sprint.

**Deliverables**:
- `scripts/test-sprint24-247-bug-sweep.js` — KR creation audit + enrich diagnosis
- `server/scripts/migrate-stages-and-ball-states.js` — one-shot migration script (NOT yet run on prod)
- `scripts/test-sprint24-246-migration.js` — migration unit tests
- KR-creation finding documented in handoff (clean or bug-fix-shipped)
- Enrich finding documented (clean / fixed / known-graceful-fallback)
- Run migration on dev DB (manually, post-test)

**Exit criteria**:
- ✅ KR creation works end-to-end on dev (or bug fixed and verified)
- ✅ Enrich diagnosed (state recorded)
- ✅ Dev DB has all companies on 4-stage enum, all objectives with seeded ball-state

---

### Session B — Tile + Stage (Epic 24.1)
**Pts**: 3-4
**Why second**: Visual surface change. Establishes the 4-stage company-lifecycle pattern in code (model + service rename) that Epic 24.2 builds on.

**Deliverables**:
- `Company.stage` enum narrowed to 5 values (`prospect`, `onboarding`, `active`, `paused`, `churned`)
- `StageTransitionService.onFirstObjectiveCreated` retargeted to `active`
- `client/pages/my-clients.html` + `my-clients.css` + `my-clients.js` — tile cleanup, pencil icon, danger-zone-in-Edit-modal
- `client-workspace.html#tab=profile` — stage pill row + history accordion (UI only, write-back wired in Epic 24.2)
- `scripts/test-sprint24-241-tile-and-stage.js` — ~30-40 assertions

**Exit criteria**:
- ✅ Tile shows pencil icon, no Plan/Status buttons
- ✅ Click on tile body navigates to `client-workspace.html#tab=summary`
- ✅ Edit modal contains "Remove from portfolio" Danger zone
- ✅ Profile tab renders 5-stage pill row + collapsible history accordion (read-only for now; write-back in Session C)

---

### Session C — Profile Tab Page-Reuse (Epic 24.2)
**Pts**: 4-5
**Why third**: Activates page-reuse pattern (`?client=:id`). Wires consultant write surface for company profile + email-on-prefill. Stage-pill click also writes here.

**Deliverables**:
- `PUT /api/companies/:id` middleware extended for CONSULTANT dual-auth
- `Company.profile_prefilled_at` field added
- `mailjetService.sendProfilePrefilledEmail` (new template)
- `client/pages/company-profile.html` + script — `?client=:id` detection + banner + adaptive load/save target
- Workspace Profile tab navigates to `company-profile.html?client=:id&from=workspace`
- Stage pill row click writes via `StageTransitionService.manualTransition()` (already exists)
- `scripts/test-sprint24-242-profile-tab.js` — ~35-45 assertions

**Exit criteria**:
- ✅ Consultant can edit a managed client's profile end-to-end
- ✅ Owner gets exactly one email on first save
- ✅ Stage transitions fire from Profile tab pill click + write to history
- ✅ R6 audit findings recorded (any unexpected role-coupling on the page surfaced + handled)

---

### Session D — Ball State Model + Service (Epic 24.3, Part 1 of 2)
**Pts**: 3-4 (split from 6-8 total)
**Why fourth**: Backend foundation — schema, service, hooks, predicate. No UI yet. Pure model-layer work that subsequent sessions consume.

**Deliverables**:
- `Objective` schema extensions: `ball_state`, `consultant_notes`, `ball_state_history[]`, `sustained_eligible`
- `BallStateService.js` (transitionTo, evaluateAndTransitionAfterWrite, markSustained, markSustainedEligible, manualOverride)
- `res.on('finish')` hooks wired into `routes/objectives.js`, `routes/weekly-goals.js`, `routes/moves.js`, KR write paths
- 3 new consultant endpoints: `PATCH .../objectives/:oid/notes`, `POST .../mark-sustained`, `POST .../override-state`
- Owner-side GET projections updated to exclude `consultant_notes` (R7 mitigation)
- `scripts/test-sprint24-243-ball-state-and-objectives.js` — backend portion (~40-50 assertions)

**Exit criteria**:
- ✅ Predicate evaluates correctly for all combinations
- ✅ Hooks fire post-response (zero added latency proven via timing test)
- ✅ Owner GET on objective with non-empty `consultant_notes` returns object without that field (privacy test passes)
- ✅ S22a / S23 regression: 184a + 184e + phase3-3 + 188 + 190 still green

---

### Session E — Objectives Tab UI (Epic 24.3, Part 2 of 2)
**Pts**: 3-4
**Why fifth**: Frontend tile redesign. Constraint banner. Consumes the model + service from Session D.

**Deliverables**:
- `client-workspace.html#tab=objectives` tile design
- `client-workspace.css` `.objective-tile--consultant` (namespaced — R3 mitigation)
- `client-workspace.js` Objectives tab renderer + handlers (notes save, mark-sustained, manual-override menu)
- Constraint banner sourced from latest assessment's `ssi_result.constraint`
- Sort: handed_off first, then identified, then sustained
- `scripts/test-sprint24-243-ball-state-and-objectives.js` — frontend portion (~40-50 assertions appended)

**Exit criteria**:
- ✅ Objectives tab renders one tile per objective with all 8 fields
- ✅ Inline notes save with debounce
- ✅ Mark Sustained button only appears on `sustained_eligible=true` tiles
- ✅ Manual override menu functional
- ✅ Constraint banner shows correct value or empty state
- ✅ phase3-3 lint green (no new role-check sites)

---

### Session F — Plan Tab (Epic 24.4)
**Pts**: 4-5
**Why sixth**: Read-only tree. Independent of ball-state work. Could run in parallel with Session E in theory; sequencing keeps focus.

**Deliverables**:
- `consultant.js` quarterly + weekly endpoints extended with `?include=tasks,moves`
- `client-workspace.html#tab=plan` tree component
- `client-workspace.js` Plan tab renderer with auto-expand current week, lazy load
- `client-workspace.css` plan-tree styles
- `scripts/test-sprint24-244-plan-tab.js` — ~30-40 assertions

**Exit criteria**:
- ✅ Tree renders 4 levels (KR → QG → WG → Tasks/Moves)
- ✅ Current week auto-expanded
- ✅ Tasks and Moves both shown with distinct badges
- ✅ Lazy-load: tab fetches on first activation only

---

### Session G — Assessments Tab (Epic 24.5) + Sprint Close
**Pts**: 3-4 + close overhead
**Why last**: Smallest feature epic. Pairs with sprint close: full regression sweep + handoff finalization + Beta-launch readiness check.

**Deliverables**:
- `team-ssi-view.html` `?client=:id` detection + banner + "Back to workspace" link
- Assessment route tenant gates extended for consultant + managed client
- Workspace Assessments tab full-page navigation
- `scripts/test-sprint24-245-assessments-tab.js` — ~30-40 assertions
- **Sprint close**: full regression (S22a + S23 + S24 suites), handoff doc updated to final state, folder rename to `SPRINT-24-Consultant-CRM (Complete)`, SESSION_LOG entry

**Exit criteria**:
- ✅ Consultant can view consolidated assessment results for managed client
- ✅ All 4 internal tabs (Overview/Teams/Surveys/Diagnostic) work in consultant mode
- ✅ Cross-tenant access rejected (403)
- ✅ **5-verb acceptance test passes** with one client end-to-end
- ✅ Full regression: S22a + S23 + S24 suites all green

---

## Pacing & Token Budget

| Session | Pts | Estimated context | Estimated time |
|---|---|---|---|
| A — Discovery + Migration | 3 | ~70K | 1-1.5h |
| B — Tile + Stage | 3-4 | ~60K | 1-1.5h |
| C — Profile Tab | 4-5 | ~80K | 1.5-2h |
| D — Ball State backend | 3-4 | ~90K | 1.5-2h |
| E — Objectives UI | 3-4 | ~80K | 1.5-2h |
| F — Plan Tab | 4-5 | ~70K | 1-1.5h |
| G — Assessments + Close | 3-4 + close | ~80K | 1.5-2h |
| **Total** | **~25 pts** | — | **~10-13h** |

A focused 1-week sprint at S23 velocity (~2h/session × 6-7 sessions).

---

## Inter-Session Dependencies

```
Session A (Discovery + Migration)
    │
    ├──► Session B (Tile + Stage) — depends on migration applied
    │       │
    │       └──► Session C (Profile Tab) — depends on stage pill row from B
    │
    ├──► Session D (Ball State Backend) — depends on KR audit clean
    │       │
    │       └──► Session E (Objectives UI) — depends on D
    │
    ├──► Session F (Plan Tab) — independent, requires only S22a #184a endpoints
    │
    └──► Session G (Assessments + Close) — depends on all above for regression
```

Sessions C and D could in theory run in parallel (different files), but sequencing avoids context overlap.

---

## Per-Session Quality Gates (mirrors S23 invariants)

Every session ends with:
- [ ] All new tests green
- [ ] Most-recent prior-session test still green (rolling regression)
- [ ] phase3-3 lint green (no new role-check sites)
- [ ] Zero executable `switch-company` callers in consultant page scripts
- [ ] LLMGateway sole executable OpenAI chokepoint
- [ ] Update `SPRINT24_HANDOFF_DOCUMENT.md` Progress table
- [ ] Update `.claude/SESSION_LOG.md` with one-line entry
