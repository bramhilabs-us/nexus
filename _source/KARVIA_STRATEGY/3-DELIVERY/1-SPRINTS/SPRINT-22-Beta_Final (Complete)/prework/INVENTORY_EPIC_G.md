# Inventory — Epic G: Dashboard V3 + Theme Alias

<!-- @GENOME T3-SPR-022-PW-IG | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_G_DASHBOARD_UI.md](../epics/EPIC_G_DASHBOARD_UI.md)
**Points**: 5 (combined 10 with Epic H billed under same UI budget)

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| Dashboard page | 🔧 extend | `client/pages/dashboard-v2.html` exists with production nav + script binding | UPDATE in place — replaces v2 content with V3 mockup |
| Dashboard script | 🔧 extend | `client/pages/scripts/dashboard-v2.js` exists | UPDATE for new V3 layout (causal chain cards, group switch, catch-up tiles) |
| Theme alias | 🔧 extend | `client/css/s13-patterns.css` already has `--s22-*` tokens (Session #174) | ADD one-line `--karvia-primary: var(--s22-navy);` |
| Move type badges | 🆕 new | none | ADD CSS in s13-patterns.css OR dashboard.css |
| Tasks → Moves rename | 🔧 extend | dashboard-v2 uses "Tasks" | Surgical S/R per spec list |
| Mockup | ✅ exists | `sprint_mockups/sprint-22/dashboard-v3.html` (cleaned, nav-injected) | REFERENCE |

---

## ⚠️ Spec Inconsistency

Epic G title and master plan say "Dashboard V3" replaces dashboard-v2 content. Current v2 has the older layout from Sprint 12. Spec body section "Dashboard Layout Updates" still shows the **old** Today/Overdue/Tomorrow sections (Sprint 12 design), NOT the V3 causal-chain cards / catch-up tiles / group switch from the V3 mockup. The spec is half-updated.

Action: rewrite "Dashboard Layout Updates" section to match V3 mockup, not legacy v2.

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `client/pages/dashboard-v2.html` | full | Sprint 12 layout with "Tasks" terminology, 15 inline-hex purple hits | REPLACE body content with V3 layout from mockup; preserve `<nav>` block + `/js/navigation.js` script tag verbatim |
| `client/pages/scripts/dashboard-v2.js` | full | Old fetch + render logic | REWRITE for V3 data shape (causal-chain cards, group switch, catch-up tiles) |
| `client/css/s13-patterns.css` | n/a | Has `--s22-*` block | ADD `--karvia-primary: var(--s22-navy);` alias |
| `client/css/dashboard.css` | full | Old purple-flavored styles | UPDATE to navy/gold; add move-type badge classes |

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| G-1 | Nav href: keep `/pages/dashboard-v2.html` (since we're updating in place)? Or rename file to dashboard.html / dashboard-v3.html? | DECISIONS_LOG.md → D-G-1 (links to D-C-10) |
| G-2 | Spec body "Dashboard Layout Updates" shows old Sprint 12 layout, not V3 mockup. Rewrite spec body | DECISIONS_LOG.md → D-G-2 |
| G-3 | Move types in current dashboard backend: `recurring.enabled` boolean exists on Task model — Epic G "Notes" claims "Reaction" type is future. Decide: do we render Reaction badge now (with no backend) or only Action/Habit? | DECISIONS_LOG.md → D-G-3 |
| G-4 | KPI strip / group switch / catch-up tiles — these read from data shapes that don't yet exist (Move model is new in Epic A). Stub data or live? | DECISIONS_LOG.md → D-G-4 |
| G-5 | Theme alias rollout: 2 component classes (`.k-btn-primary`, tab borders) auto-flip; 15 inline-hex hits in dashboard-v2.html require manual sweep — confirm scope and that no other live page uses `var(--karvia-primary)` | DECISIONS_LOG.md → D-G-5 |
| G-6 | Tasks → Moves rename: "task" lowercase replacement is dangerous (may match `taskId`, `taskList`, `dataset.task`). Strict word-boundary? | DECISIONS_LOG.md → D-G-6 |

---

## Acceptance-Criteria Coverage Audit

Current AC (7 items) covers: navy primary, gold accent, rename, badges, sections, no purple, mobile. **Gaps**:
- No AC for V3 layout pieces (causal-chain cards, catch-up tiles, group switch, KPI strip)
- No AC that other live pages remain unaffected by `--karvia-primary` alias
- No AC for SVG icons (icon-building, icon-moving)

Add 4 AC items.

---

## Test-Plan Stub

- Visual regression: dashboard-v2.html screenshot post-change matches V3 mockup
- Visual regression: 4 other live pages (objectives, planning-v2, assessment-hub, teams) unaffected by `--karvia-primary` alias
- Smoke: dashboard loads for CONSULTANT role; KPI strip + group switch render
- Playwright: card postpone popover opens; assign popover groups by client for consultants
- Playwright: catch-up tile expands inline; group collapse/expand persists
- Grep check: zero `bg-purple-` / `text-purple-` / `#8B5CF6` matches post-sweep
