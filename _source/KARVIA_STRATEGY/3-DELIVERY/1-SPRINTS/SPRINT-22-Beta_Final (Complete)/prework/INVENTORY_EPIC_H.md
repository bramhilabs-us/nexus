# Inventory — Epic H: Planning Page

<!-- @GENOME T3-SPR-022-PW-IH | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_H_PLANNING_PAGE.md](../epics/EPIC_H_PLANNING_PAGE.md)
**Points**: 5 (billed under Epic G's combined UI budget)

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| Planning page | 🔧 extend | `client/pages/planning-v2.html` exists with production nav | UPDATE in place — monthly grouping, full quarter |
| Planning script | 🔧 extend | `client/pages/scripts/planning-v2.js` exists | EXTEND for week-grouping logic, collapse/expand, AI presets UI |
| Quarter tabs | ✅ exists | already in planning-v2 | KEEP unchanged |
| Quarter date math | ✅ exists | `server/services/DateService.js` has `getQuarterForDate`, `getQuarterDates` | REUSE; ADD `getQuarterWeeks` if not present |
| AI weekly goal generation | 🆕 new | none — depends on Epic F `generateWeeklyGoals` | ADD UI + endpoint integration |
| Mockup | ✅ exists | `sprint_mockups/sprint-22/planning.html` (cleaned, nav-locked) | REFERENCE |

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `client/pages/planning-v2.html` | full | 4-week flat list | REPLACE list with monthly groups (12-13 weeks total) |
| `client/pages/scripts/planning-v2.js` | full | Existing fetch + render | EXTEND: getQuarterWeeks, groupWeeksByMonth, toggleMonth, expandCurrentMonth, AI preset bindings |
| `client/css/planning.css` | full | Existing styles | ADD month-group, week-row, progress-fill styles |
| `server/services/DateService.js` | n/a | Quarter calcs exist | VERIFY `getQuarterWeeks(year, quarter)` exists; if not, add |

---

## Net-New Endpoints Used (owned by Epic F)

| Method | Path | Source |
|--------|------|--------|
| POST | `/api/weekly-goals/generate` | F (uses `generateWeeklyGoals`) |

(Epic H consumes these but does not own them.)

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| H-1 | Spec uses ISO weeks vs calendar months — week 1 of April may start in March. Define week→month assignment rule | DECISIONS_LOG.md → D-H-1 |
| H-2 | "Goal count" per week — counts WeeklyGoal docs (Epic A) OR existing Goal docs (where time_period=WEEKLY)? Mixed period | DECISIONS_LOG.md → D-H-2 (linked to D-A-2) |
| H-3 | "AI generation presets visible (functional in Epic F)" — Epic H ships UI only? Or wires the call too? | DECISIONS_LOG.md → D-H-3 |
| H-4 | Auto-expand current month: based on user timezone or server time? | DECISIONS_LOG.md → D-H-4 |
| H-5 | Week dates display "Apr 1-7" — uses Mon-Sun or Sun-Sat boundaries? | DECISIONS_LOG.md → D-H-5 |
| H-6 | Spec budget note: master plan Note line 15 says "Sprint 22 master plan total is 61 pts" — outdated (now 74 + Epic 0 = 87). Update | DECISIONS_LOG.md → D-H-6 |

---

## Acceptance-Criteria Coverage Audit

Current AC (9 items) covers: 12-13 weeks, monthly grouping, collapse, current month expanded, progress bars, AI presets, week click, quarter tabs, mobile. **Gaps**:
- No AC for week→month assignment rule
- No AC for partial weeks at quarter boundaries
- No AC for `goal count` data source (which model?)

Add 3 AC items.

---

## Test-Plan Stub

- Unit: getQuarterWeeks(2026, 2) returns 13 weeks for Q2
- Unit: groupWeeksByMonth correctly assigns boundary weeks
- Unit: expandCurrentMonth toggles correct group
- Playwright: month collapse/expand toggles; quarter tabs change view
- Playwright: AI preset (4/8/12 weeks) buttons render; clicking calls Epic F endpoint (or stubs)
- Smoke: page loads for CONSULTANT, BUSINESS_OWNER, EXECUTIVE roles
