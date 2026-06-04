# Epic G: Dashboard V3 + Theme Alias

<!-- @GENOME T3-SPR-023-EG | ACTIVE | 2026-04-30 | parent:T3-SPR-023-MP | auto:/coding | linked:/design -->

**Sprint**: 23 (carried from Sprint 22 by #183-close decision)
**Epic**: G - Dashboard V3 + Theme Alias + Tasks→Moves rename
**Points**: 10 (now billed standalone — Sprint 22's combined-UI-budget arrangement is unwound; Epic H carries its own 5 pts in S23)
**Priority**: P1 — **runs LAST in Sprint 23** (final consolidator; theme alias is sprint-wide visual flip, so the visual regression check naturally covers everything D/E/H added)
**Dependencies**: ✅ S22 #176 Epic A (Move + WeeklyGoal models), ⏳ S23 Epic E (objectives with KRs — must ship before G for live causal-chain data). D-G-4 fallback empty-state still required.

---

## ⚠️ Sprint 23 Theme-Alias Drift Warning (supersedes D-G-5)

The original spec said "only 2 components use `var(--karvia-primary)`". Re-grep on 2026-04-30 returned **27 sites** (9 in `s13-patterns.css`, 18 in `objective-wizard.css`).

**Sprint 23 decision** (per /sprint-review consistency choice): apply the alias as a unified Navy/Gold flip across `s13-patterns.css` AND `objective-wizard.css` — Sprint 22's unified-theme intent extends to objective-wizard since its 18 hits all post-date the original spec.

**Pre-flight at the start of the Epic G session, BEFORE alias is applied**:
```bash
git grep -nE '\bvar\(--karvia-primary\)\b' client/
```
Compare against the 27 sites known on 2026-04-30. If new files appear, audit individually — do not blindly extend.

---

## Overview

Replace `client/pages/dashboard-v2.html` content with the V3 causal-chain layout (Moves vs Chores, KPI strip, group switch, catch-up tiles), apply Navy/Gold theme, and rename "Tasks" to "Moves" throughout the application.

**Mockup**: [dashboard-v3.html](../../sprint_mockups/sprint-22/dashboard-v3.html)

**Implementation file**: `client/pages/dashboard-v2.html` (update in place — preserves URL and existing `dashboard-v2.js` script binding).

**Navigation lock (CRITICAL)**: The production `<nav>` block and `<script src="/js/navigation.js">` include in dashboard-v2.html must be preserved verbatim. The mockup contains both verbatim — do not modify them during implementation.

**Theme alias step**: Inside `client/css/s13-patterns.css`, alias `--karvia-primary: var(--s22-navy);` (one-line change). The 2 component uses (`.k-btn-primary`, tab borders) auto-flip Navy. No other live page uses `var(--karvia-primary)`, so blast radius is bounded to the 2 component classes plus dashboard-v2.html's 15 inline-hex hits which must be swept manually.

**Sprint 22 also folds Planning page changes (Epic H, 5 pts) into this Epic G's combined 10pt UI budget.** See [EPIC_H_PLANNING_PAGE.md](./EPIC_H_PLANNING_PAGE.md) for the planning-page delta and [planning.html](../../sprint_mockups/sprint-22/planning.html) mockup.

---

## Changes Summary

| Change | Current | New |
|--------|---------|-----|
| Primary Color | Purple `#8B5CF6` | Navy `#1F2937` (s22-navy) |
| Accent Color | Purple variants | Gold `#F59E0B` |
| Task Terminology | "Tasks" | "Moves" |
| Move Types | None | Action, Reaction, Habit |

---

## Color Theme Update

### CSS Variables

**File**: `client/css/s13-patterns.css`

```css
:root {
  /* Existing SSI colors (keep) */
  --ssi-navy: #1e3a5f;
  --ssi-navy-light: #2d5a87;

  /* Sprint 22 Theme */
  --s22-primary: #1e3a5f;
  --s22-primary-light: #2d5a87;
  --s22-accent: #F59E0B;
  --s22-accent-light: #FCD34D;
  --s22-accent-bg: #FFFBEB;

  /* Replace purple references */
  --dashboard-primary: var(--s22-primary);
  --dashboard-accent: var(--s22-accent);
}
```

### Files to Update

| File | Changes |
|------|---------|
| `client/pages/dashboard-v2.html` | Replace purple classes |
| `client/css/dashboard.css` | Update color variables |
| `client/pages/scripts/dashboard-v2.js` | Update any inline colors |

### Color Replacement Map

| Old | New |
|-----|-----|
| `#8B5CF6` | `#1e3a5f` |
| `bg-purple-*` | `bg-navy-*` (custom) or inline `bg-[#1e3a5f]` |
| `text-purple-*` | `text-navy-*` (custom) or inline |
| `border-purple-*` | `border-navy-*` (custom) or inline |
| `ring-purple-*` | `ring-[#1e3a5f]` |

---

## Tasks → Moves Rename

### Terminology

| Old Term | New Term |
|----------|----------|
| Task | Move |
| Tasks | Moves |
| task_id | move_id (if new code) |
| Add Task | Add Move |
| Task Details | Move Details |

### Move Types

```javascript
const MOVE_TYPES = {
  ACTION: {
    name: 'Action',
    icon: 'target',
    color: 'blue',
    description: 'One-time task to complete'
  },
  REACTION: {
    name: 'Reaction',
    icon: 'zap',
    color: 'amber',
    description: 'Responsive action to an event'
  },
  HABIT: {
    name: 'Habit',
    icon: 'repeat',
    color: 'green',
    description: 'Recurring behavior to build'
  }
};
```

### UI Badge

```html
<!-- Move type badge -->
<span class="move-type move-type-action">
  <svg><!-- Target icon --></svg>
  Action
</span>

<span class="move-type move-type-reaction">
  <svg><!-- Zap icon --></svg>
  Reaction
</span>

<span class="move-type move-type-habit">
  <svg><!-- Repeat icon --></svg>
  Habit
</span>
```

### CSS for Move Types

```css
.move-type {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
}

.move-type svg {
  width: 12px;
  height: 12px;
}

.move-type-action {
  background: #DBEAFE;
  color: #1D4ED8;
}

.move-type-reaction {
  background: #FEF3C7;
  color: #D97706;
}

.move-type-habit {
  background: #D1FAE5;
  color: #059669;
}
```

---

## Dashboard V3 Layout (D-G-2 — rewritten to match canonical mockup)

The previous spec body showed the old Sprint 12 Today/Overdue/Tomorrow layout. The canonical V3 layout (Session #173 mockup `dashboard-v3.html`) replaces that with:

### Page elements (top-to-bottom)

1. **KPI strip** — single line above content. Format: `83 moves · 85% this week · ▲`. Shows Moves Made (quarter), Consistency Rate (weekly), Momentum arrow.
2. **Group switch** — `All | Objective | Habit` chips; active chip toggles which grouping the user sees.
3. **Catch-up tiles** — 3 tiles in a horizontal strip:
   - `◐ pushed (N)` — postponed moves
   - `○ forgotten (N)` — missed but not yet abandoned (psychology-friendly term, not "overdue")
   - `▸ this week (N)` — pending in current week
   - Each tile expands inline with the relevant moves list when clicked.
4. **Causal-chain cards** — one per Move/objective. Two-column layout:
   - **Left column** — building behavior: `icon-building` (ascending bars SVG), discipline label, build-days `6/12`, optional habit-lock %.
   - **Right column** — moving ball: `icon-moving` (trend line + dot SVG), KR target, ball lift `↑ 50% from 25%`, optional recovery rate.
   - 5 visual states: `active`, `paused` (amber tint), `assigned-out` (dashed border), `completed` (greyed), `forgotten` (subtle red dot).
   - **No "Action" / "Habit" badge text** — distinction is by card weight (size + density), not labels.
5. **Chores list** — flat single-line items below moves; visually lighter weight (cognitive separation: chores ≠ moves).
6. **Group headers** — collapsible (chevron `▾`) per objective or per habit when grouping is active.

### Popovers

- **Postpone**: opens a date picker scoped to the parent KR's `min`/`max` (prevents dates outside goal window).
- **Assign**: list scoped to same company; for CONSULTANT, grouped by client. Invalid roles for the move type are greyed out.

### What Sprint 22 ships

- Move-type "Reaction" badge is **descoped** for S22 (D-G-3) — only Action and Habit render. CSS for Reaction stays defined but unused.
- Live data when Epic A + E + H are in place. Otherwise empty state with copy: "No moves this week. Create an objective to get started." (D-G-4)

(Snippets, SVG icon definitions, and full HTML/CSS scaffolding are in the canonical mockup `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-22/dashboard-v3.html` — reference during implementation.)

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `client/pages/dashboard-v2.html` | MODIFY | Color classes, terminology |
| `client/css/dashboard.css` | MODIFY | Color variables, move types |
| `client/pages/scripts/dashboard-v2.js` | MODIFY | Terminology in JS |
| `client/css/s13-patterns.css` | MODIFY | Add S22 theme variables |

---

## Search & Replace List

### Global Terminology

```bash
# In dashboard files
"Tasks" → "Moves"
"tasks" → "moves"
"Task" → "Move"
"task" → "move" (careful with variable names)
"Add Task" → "Add Move"
"New Task" → "New Move"
```

### Color Updates

```bash
# Purple to Navy
"#8B5CF6" → "#1e3a5f"
"bg-purple-500" → "bg-[#1e3a5f]"
"bg-purple-600" → "bg-[#1e3a5f]"
"text-purple-600" → "text-[#1e3a5f]"
"border-purple-500" → "border-[#1e3a5f]"

# Add gold accents for highlights
"hover:bg-purple-700" → "hover:bg-[#2d5a87]"
```

### Theme alias (D-G-5) — pre-flight verification

Add to `client/css/s13-patterns.css` (one-line):
```css
:root { --karvia-primary: var(--s22-navy); }
```

**Pre-flight grep before applying** (must return only the 2 components Epic G's spec lists):
```bash
git grep -nE '\bvar\(--karvia-primary\)\b' client/
```
If unrelated callers found, audit individually before alias rollout.

### Tasks → Moves rename safety (D-G-6)

Use word-boundary, case-aware sed, scoped to dashboard files only. Skip JS identifiers like `taskId`, `taskList`.

```bash
sed -i '' -E 's/\bTasks\b/Moves/g; s/\bTask\b/Move/g; s/\btasks\b/moves/g' \
  client/pages/dashboard-v2.html
# JS file: review changes manually before applying — many identifiers contain "task"
```
Manual review post-sed before commit.

---

## Acceptance Criteria

- [ ] Dashboard uses Navy `#1e3a5f` as primary color; Gold `#F59E0B` for accents
- [ ] V3 layout pieces render: KPI strip, group switch, catch-up tiles, causal-chain cards (left building / right moving), chores list, collapsible group headers (D-G-2)
- [ ] SVG icons (`icon-building`, `icon-moving`) defined and used
- [ ] "Tasks" renamed to "Moves" throughout dashboard (word-boundary safe — D-G-6)
- [ ] Move-type rendering: Action and Habit only; Reaction descoped (D-G-3)
- [ ] Theme alias `--karvia-primary: var(--s22-navy)` applied to `s13-patterns.css`; pre-flight grep clean (D-G-5)
- [ ] Other live pages (objectives, planning-v2, assessment-hub, teams) unaffected by alias (visual regression check)
- [ ] No purple colors remain on dashboard (`git grep` clean)
- [ ] Empty-state copy renders gracefully when no moves/objectives exist (D-G-4)
- [ ] Mobile responsive maintained
- [ ] Nav href stays `/pages/dashboard-v2.html` — file updated in place (D-C-10 / D-G-1)

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| Color theme CSS variables | 1 |
| Dashboard color replacement | 1 |
| Tasks → Moves rename | 1 |
| Move type badges | 1 |
| Testing & polish | 1 |
| **Total** | **5** |

---

## Notes

- New `Move` model lives alongside legacy `Task` model (D-A-3 coexistence)
- Frontend reads from `Move` collection; legacy Task code paths unaffected
- Move types: Action and Habit render in S22; Reaction descoped (D-G-3)
- Theme alias is a 1-line additive change with bounded blast radius (verified by D-G-5 pre-flight grep)

---

**Created**: April 21, 2026 (Session #171)
**Status**: Ready for implementation
