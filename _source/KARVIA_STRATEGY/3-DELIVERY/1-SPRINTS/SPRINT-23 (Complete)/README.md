# Sprint 23 — Beta Push (Final Feature Sprint Before Beta)

<!-- @GENOME T3-SPR-023-NAV | ACTIVE | 2026-04-30 | parent:T3-SPR-023-MP | auto:- | linked:/init,/strategy -->

**Status**: 🟢 ACTIVE (opened 2026-04-30 by /sprint-review)
**Goal**: Land the four feature epics carried from Sprint 22 (D, E, H, G); clear the path to Beta.
**Points**: 33 net new (38 incl. carried-spec migration)
**Target Close**: 2026-05-05
**Beta Launch Target**: 2026-04-10

---

## Scope

| Epic | Name | Pts | Priority | Spec |
|---|---|---|---|---|
| D | Assessment Enhancements | 8 | P0 | [`epics/EPIC_D_ASSESSMENT.md`](epics/EPIC_D_ASSESSMENT.md) |
| E | Objective Creation Wizard | 10 | P0 | [`epics/EPIC_E_OBJECTIVE_WIZARD.md`](epics/EPIC_E_OBJECTIVE_WIZARD.md) |
| H | Planning Page (12-week monthly grouping) | 5 | P1 | [`epics/EPIC_H_PLANNING_PAGE.md`](epics/EPIC_H_PLANNING_PAGE.md) |
| G | Dashboard V3 + Theme Alias | 10 | P1 | [`epics/EPIC_G_DASHBOARD_UI.md`](epics/EPIC_G_DASHBOARD_UI.md) |

---

## Sequence (locked)

```
D → E → H → G
```

D first (independent, zero deps). G last (theme alias is sprint-wide visual flip).

---

## Sprint Lineage

- **Old Sprint 23 plan** (Apr 21, S171) listed Epic A (5 pts) + Epic D (8 pts) = 13 pts. Epic A already shipped in S22 #176, so that plan is **superseded** by this one.
- **Sprint 22 close decision** (#183-close, 2026-04-30) deferred E + H + G to S23.
- **Sprint 22a** (consultant↔client separation) completed 28/28 on 2026-04-30, unblocking S23.

---

## Documents in This Folder

| Doc | Purpose |
|---|---|
| [SPRINT23_MASTER_PLAN.md](SPRINT23_MASTER_PLAN.md) | Full scope, sequence rationale, dependency map, hot zones, theme-alias drift note |
| [SPRINT23_HANDOFF_DOCUMENT.md](SPRINT23_HANDOFF_DOCUMENT.md) | Daily progress + restart guide (auto-loaded by /init) |
| [MY_CLIENTS_PAGE_SPEC.md](MY_CLIENTS_PAGE_SPEC.md) | Reference spec from Sprint 22 Epic C work; informational |
| [`epics/`](epics/) | Per-epic specs (D, E, H, G) — all genome-tagged `T3-SPR-023-Ex` |

---

## Mockups

Reused from Sprint 22 (no new mockups needed):

- [`../sprint_mockups/sprint-22/assessment-hub.html`](../sprint_mockups/sprint-22/assessment-hub.html)
- [`../sprint_mockups/sprint-22/objective-wizard.html`](../sprint_mockups/sprint-22/objective-wizard.html)
- [`../sprint_mockups/sprint-22/planning.html`](../sprint_mockups/sprint-22/planning.html)
- [`../sprint_mockups/sprint-22/dashboard-v3.html`](../sprint_mockups/sprint-22/dashboard-v3.html)

---

**Created**: 2026-04-21 (original 13-pt plan)
**Replaced**: 2026-04-30 by `/sprint-review` (post Sprint 22a close)
