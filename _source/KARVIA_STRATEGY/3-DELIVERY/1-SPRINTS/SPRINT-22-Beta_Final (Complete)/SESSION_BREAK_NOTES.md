# Session Break Notes - Sprint 22 Strategy

<!-- @GENOME T3-SPR-022-B1 | ACTIVE | 2026-04-20 | parent:T3-SPR-022 | auto:/init | linked:/strategy -->

**Session Date**: April 21, 2026 (Session #169)
**Session Type**: Design (Specification Creation)
**Token Usage**: ~40K
**Status**: Strategy Phase COMPLETE - Ready for Implementation

---

## What Was Completed (Session #168)

### Design Theme Established

All Sprint 22 mockups must follow the Planning page design:

| Element | Value |
|---------|-------|
| Primary Navy | `#1F2937` |
| Gold/Amber | `#F59E0B` |
| Background | `#FAFAFA` |
| Card Background | `#FFFFFF` |
| Font | Inter |

### Topics Finalized (5 new + 7 previous = 12 total)

**1. Weekly Goals** (NEW - Session #168)
- Hierarchy: KR → Quarterly Tiles → Weekly Goals (monthly groups)
- 12-13 weeks per quarter (full quarter)
- Monthly grouping: April / May / June (collapsible)
- AI generation: 4 / 8 / 12 week presets
- Gaps allowed (vacation, holidays)
- Hybrid approach: AI suggests, consultant edits, can add manually

**2. Tasks → Moves** (NEW - Session #168)
- Renamed to "Moves" for game metaphor
- Types: Action (planned), Reaction ⚡ (urgent), Habit 🔄 (recurring)
- [⚡Generate Tasks] button per week (on-demand)
- Subtle 🔄 icon for recurring
- SSI/Behavior shown only in expanded view
- Surgical changes to existing UI

**3. Dashboard** (NEW - Session #168)
- Purpose: Pure execution ("play the game")
- Sections: Overdue → Today → Tomorrow (only 3)
- Clean list: checkbox, title, time, assignee
- Move types: Action, Reaction ⚡, Habit 🔄
- Context only in expanded view
- Buttons: [+ Add Action] [⚡ Add Reaction]
- NOT shown: Charts, stats, objectives, KRs, progress widgets

**4. Planning Page** (NEW - Session #168)
- Q tabs at top = quarter filter (existing, no change)
- Quarterly Goal: One-line header below KR title
- Weekly Goals: Monthly grouping (collapsible)
- 12-13 weeks per quarter
- Left sidebar: No change
- Tasks/Moves NOT shown (live on Dashboard)

**5. Teams Page** (NEW - Session #168)
- No changes. Keep as-is.

### Completed (Session #169)

**6. Assessment Page** - Combined Hub with 3 tabs (All Results, Trends, Compare)

---

## Key Design Decisions (Session #168)

| Decision | Choice |
|----------|--------|
| Quarter = 12-13 weeks | Full quarter, not 4 weeks |
| Weekly goal grouping | By month (April/May/June) |
| AI generation options | 4 / 8 / 12 week presets |
| Task renamed to | "Moves" |
| Move types | Action, Reaction ⚡, Habit 🔄 |
| Dashboard focus | Overdue → Today → Tomorrow only |
| Planning page Q tabs | Use existing as quarter filter |
| Teams page | No changes |

---

## Mockup Plan

**Location**: `/KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-22/`

**Mockups to create** (after brainstorm complete):
1. `dashboard.html` - New game-centric design
2. `planning.html` - Updated with monthly grouping
3. `objectives.html` - Minor updates (if any)
4. `assessment.html` - TBD after brainstorm

---

## Restart Point

### EXACT NEXT STEP

**Begin Sprint 22 Implementation**

**Command to run**:
```
/coding
```

**What to do**:
1. Start with Dashboard changes (lowest complexity)
2. Apply Navy/Gold color theme
3. Rename "Tasks" to "Moves"
4. Add Move type badges

---

## Context for Restart

### Dashboard = Game Board (Key Insight)

The Dashboard is where users "play the game":
- NOT a stats/charts page
- Pure execution: Manage today's moves
- Actions (planned) vs Reactions (urgent) vs Habits (recurring)
- Planning page is for strategy, Dashboard is for doing

### Planning Page Simplified

Instead of adding quarterly goal tiles, we use:
- Existing Q tabs at top as quarter filter
- One-line quarterly goal header
- Monthly grouped weekly goals inside
- Minimal changes to existing layout

### Moves Not Tasks

Reframing for behavior change:
- "Tasks" feel like chores
- "Moves" feel like progress in a game
- Each move shapes behavior toward goals

---

## Session Metrics

```
Topics Completed: 13/13 (ALL COMPLETE)
Topics Remaining: 0
Design Specs Created: 3 (Dashboard, Assessment Hub, Planning)
Quality Rating: 9/10
```

---

## Quick Recovery Checklist

If resuming this session:

```
[x] Strategy phase complete (13/13 topics)
[x] Design specs created (3 files)
[ ] Next: Start /coding session
[ ] Focus: Dashboard changes first
[ ] Reference: sprint_mockups/sprint-22/README.md
```

**Estimated time to restart**: <2 minutes with these notes

---

**Created**: April 20, 2026
**Updated**: April 21, 2026 (Session #169)
**Next Action**: /coding - Begin implementation
**Status**: Strategy 100% complete, Implementation ready

