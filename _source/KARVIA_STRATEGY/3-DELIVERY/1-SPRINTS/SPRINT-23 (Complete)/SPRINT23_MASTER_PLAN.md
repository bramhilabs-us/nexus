# Sprint 23 — Master Plan

<!-- @GENOME T3-SPR-023-MP | ACTIVE | 2026-04-30 | parent:T1-PRD-009 | auto:/init,/strategy,/coding | linked:/sprint-review,/design -->

**Sprint Duration**: ~5 working days (target close ≤ Apr 5, 2026)
**Sprint Goal**: Carry forward Sprint 22's deferred consultant-agnostic feature work (Objective Wizard, Planning page, Dashboard V3, Assessment enhancements) to clear the path to Beta launch (Apr 10, 2026).
**Total Story Points**: **38 pts**
**Status**: PLANNED (opened by /sprint-review on 2026-04-30, immediately after Sprint 22a close)

---

## Sprint Lineage

Sprint 23 inherits 4 epics carried over from Sprint 22 by the **#183-close decision** (2026-04-30):

| Origin | Decision | Outcome |
|---|---|---|
| Sprint 22 closed at 66/87 (76%) on 2026-04-30 | Epics E + H + G + (D, originally for old S23) deferred | Bundled here as S23 |
| Sprint 22a (consultant↔client separation) closed at 28/28 (100%) on 2026-04-30 | Two-app boundary structurally enforced | Beta blocker resolved → S23 unblocked |
| Old "Sprint 23" plan (Apr 21, Session #171) | Listed Epic A (5) + D (8) = 13 pts | **A is already shipped** (S22 #176); plan superseded by this document |

---

## Scope

| # | Epic | Pts | Priority | Spec |
|---|---|---|---|---|
| 1 | **D** — Assessment Enhancements (sub-dimensions + Hub tabs) | 8 | P0 | [`epics/EPIC_D_ASSESSMENT.md`](epics/EPIC_D_ASSESSMENT.md) |
| 2 | **E** — Objective Creation Wizard (3 screens, AI KRs) | 10 | P0 | [`epics/EPIC_E_OBJECTIVE_WIZARD.md`](epics/EPIC_E_OBJECTIVE_WIZARD.md) |
| 3 | **H** — Planning Page (12-week monthly grouping + AI presets) | 5 | P1 | [`epics/EPIC_H_PLANNING_PAGE.md`](epics/EPIC_H_PLANNING_PAGE.md) |
| 4 | **G** — Dashboard V3 + Theme Alias + Tasks→Moves rename | 10 | P1 | [`epics/EPIC_G_DASHBOARD_UI.md`](epics/EPIC_G_DASHBOARD_UI.md) |
| **Total** | | **33** | | |

**Why 33 not 38?** The 38-pt headline figure includes ~5 pts of carried-spec / migration / housekeeping work absorbed in #188 prework (re-tagging genomes, sequence verification, mockup re-confirmation). Net new code = **33 pts** — matches Sprint 22a's velocity envelope (28 pts in 5 sessions).

---

## Sequence (locked)

```
#188   Epic D Phase 1 (sub-dimensions schema + scoring + constraint identifier)   5 pts
#189   Epic D Phase 2 (Hub tabs 4/5/6 + trends + compare APIs + Chart.js)         3 pts
#190   Epic E Objective Wizard (3 screens + discipline selector + AI KRs)        10 pts
#191   Epic H Planning page (12-week monthly grouping + AI presets live wiring)   5 pts
#192   Epic G Dashboard V3 + theme alias + Tasks→Moves rename                    10 pts
#193   Sprint 23 close (single squashed commit OR per-session commits — see policy below)
```

**Why D first**: zero deps, lowest risk; validates the carry-over spec stays accurate before the heavier epics land.
**Why G last**: the 1-line theme alias in `s13-patterns.css` flips Navy across the app; running G last means the sprint-wide visual regression check covers everything D/E/H added.

---

## Dependency Map

```
                         ┌─────────────────────────┐
                         │  S22 #176 Epic A        │
                         │  (KeyResult, WeeklyGoal,│  ← already shipped
                         │   Move, Objective KR    │
                         │   virtual)              │
                         └────────────┬────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
┌───────▼────────┐         ┌──────────▼──────────┐         ┌────────▼────────┐
│  S23 #188-189  │         │  S23 #190           │         │   S22 #177-178  │
│  Epic D        │         │  Epic E (Wizard)    │         │   Epic B + F    │
│  (independent) │         │                     │         │   (already      │
│                │         │                     │         │   shipped)      │
└────────────────┘         └──────────┬──────────┘         └─────────────────┘
                                      │
                          ┌───────────┴───────────┐
                          │                       │
                  ┌───────▼────────┐    ┌─────────▼────────┐
                  │  S23 #191      │    │  S23 #192        │
                  │  Epic H        │    │  Epic G          │
                  │  (Planning)    │    │  (Dashboard V3)  │
                  └────────────────┘    └──────────────────┘
```

**All upstream dependencies are met.** Internal sequencing matters only between E → H, E → G.

---

## Hot-Zone Files (S22a hooks must be preserved)

| File | S22a hook | DO NOT remove during S23 work |
|---|---|---|
| `server/routes/objectives.js` | `await StageTransitionService.onFirstObjectiveCreated()` (#184e) | Epic E POST extension must call it AFTER `objective.save()` |
| `server/routes/assessments.js` | `await StageTransitionService.onFirstAssessmentCompleted()` (#184e) | Epic D `/trends` and `/compare` are read-only, but `/submit` extension must preserve the hook |
| `server/models/Objective.js` | `key_results_v2` virtual (#176) | Epic E adds new fields in unrelated regions — verify by grep before commit |
| `server/models/Assessment.js` | (no S22a hook on the model itself; routes only) | Epic D adds `sub_dimensions` + `constraint` sub-docs — verify no overlap with existing scoring service |

---

## Theme-Alias Drift (Epic G #192)

Original D-G-5 spec assumed 2 callers of `var(--karvia-primary)`. Re-grep on 2026-04-30:

```
client/css/s13-patterns.css:9 hits
client/css/objective-wizard.css:18 hits
                              ────────
                              27 total
```

**Sprint 23 decision**: ship the alias unified (consistency choice from /sprint-review on 2026-04-30) — both files flip Navy together. Visual regression check at end of #192 covers dashboard + objective-wizard simultaneously.

Pre-flight grep at start of #192 (mandatory):

```bash
git grep -nE '\bvar\(--karvia-primary\)\b' client/
```

If count > 27 OR a new file appears, audit before applying alias.

---

## Acceptance Criteria (sprint-level)

- [ ] All 4 epics shipped, each with its own test suite (#188 through #192)
- [ ] All S22a stage-transition hooks still fire correctly (regression: re-run `test-sprint22a-184e-stage-transitions.js`)
- [ ] Two-app boundary unchanged: `git grep -nE '\bswitch-company\b' client/` returns only doc-comments (regression: re-run `test-sprint22a-184c-retire-switch-company.js`)
- [ ] LLMGateway remains the sole OpenAI chokepoint (regression: re-run `test-phase2-1-llm-gateway.js`)
- [ ] No purple `#8B5CF6` references on dashboard (`git grep -n '#8B5CF6' client/pages/dashboard-v2.html` clean)
- [ ] Empty-state copy renders gracefully on dashboard when no Moves exist (#192 acceptance)
- [ ] Beta-readiness: 7 consultant endpoints (S22a #184a) + invitation accept (#184d) + new D/E/H/G features all greenlit by `/testing` pass before deploy

---

## Commit Cadence Policy (Sprint 23)

Decided at /sprint-review on 2026-04-30:

- **Default**: per-session commits during S23 (one commit per #188 / #189 / #190 / #191 / #192).
- **Exception**: if an architectural Phase-style cleanup rides along (analogous to S22a Phase 2/3), bundle that Phase into a single squashed commit at sprint close.
- **Rationale**: per-session commits give clean bisect points for feature-level rollback (E vs G); squash is reserved for architectural rewrites where partial states are nonsensical.

---

## Beta Path

```
Apr 30 ─ Sprint 23 opens
Apr 30 ─ #188 Epic D Phase 1
May 01 ─ #189 Epic D Phase 2
May 02 ─ #190 Epic E Wizard
May 03 ─ #191 Epic H Planning
May 04 ─ #192 Epic G Dashboard V3 + theme alias
May 05 ─ #193 Sprint 23 close
May 06–09 ─ /testing pass + /release-audit + Mailjet sandbox dry-run
Apr 10 ─ ⚠ Beta launch (production deploy)
```

> **Note**: Beta-launch target Apr 10 was set before the close decisions of 2026-04-30 reshuffled scope. If S23 sessions slip past May 5, escalate Beta date to Apr 12-15.

---

## Mockups (reused from sprint_mockups/sprint-22/)

| Epic | Mockup |
|---|---|
| D | `assessment-hub.html` |
| E | `objective-wizard.html` |
| H | `planning.html` |
| G | `dashboard-v3.html` |

No new mockups required for Sprint 23.

---

## Out of Scope for Sprint 23

| Item | Disposition |
|---|---|
| F-M-05 Redis cache | Trigger-gated backlog (consultant read RPS > 100) |
| F-L-02 `managed_businesses[]` denorm | Trigger-gated backlog (any consultant > 100 clients) |
| Move-type "Reaction" badge | Descoped (D-G-3) — only Action + Habit render in S23 |
| Old "Sprint 23 Epic A Behavior Model" (5 pts) | Already delivered by S22 #176 — removed from scope |
| `quarterly-goals.html` deletion (D6) | Already bundled in S22a #184c, complete |

---

## Related Documents

- [SPRINT23_HANDOFF_DOCUMENT.md](SPRINT23_HANDOFF_DOCUMENT.md) — daily progress + restart guide
- [README.md](README.md) — quick scope summary
- Sprint 22a final state: [`../SPRINT-22a-Consultant-Client-Separation (Complete)/SPRINT22a_HANDOFF_DOCUMENT.md`](../SPRINT-22a-Consultant-Client-Separation%20(Complete)/SPRINT22a_HANDOFF_DOCUMENT.md)
- Sprint 22 close decision: see entry `183-close` in `.claude/SESSION_LOG.md`

---

**Created**: 2026-04-30 by `/sprint-review` (post Sprint 22a close)
**Status**: Ready for `/coding` session #188 (Epic D Phase 1)
