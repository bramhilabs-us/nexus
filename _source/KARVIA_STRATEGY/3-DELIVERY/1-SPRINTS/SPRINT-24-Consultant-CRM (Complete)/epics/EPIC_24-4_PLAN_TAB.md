# Epic 24.4 — Plan Tab Read-Only Tree + Behaviors Strip + KPI Strip

<!-- @GENOME T3-SPR-024-EPIC-4 | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 5-6
**Priority**: P0

---

## Goal

Surface a client's plan in three layered sections so the consultant can answer "what's the state of the plan?", "what behaviors are happening?", and "what specific work is being done this week?" — all on one tab. Read-only. Adopts the onion philosophy locked in D-Onion.

## Locked Decisions

### Onion philosophy (D-Onion-1, D-Onion-2)
- KPI strip on top — answers "should I be worried? what needs attention?"
- Below: details (Behaviors strip + tree)
- Uses shared `client/css/components/tab-header.css` from Epic 24.9 (TabHeader component)

### Read-only tree
- Hierarchy: KR → Quarterly Goal → Weekly Goal → **Tasks only** (recurring Moves promoted to Behaviors strip)
- One-off Moves (`frequency='once'`) stay in tree as siblings of Tasks (badged as 🎯)
- Auto-expand current week, collapse history (mirror S23 #191 `autoExpandCurrentMonth` pattern)
- No filter strip in v1
- No editing affordances anywhere

### γ-lite Behaviors strip (D-Beta = X)
- **NEW** section between KPI strip and tree
- Shows recurring Moves (`frequency != 'once'`) grouped by `(title, discipline)` — case-insensitive trim
- Frontend grouping only — no schema change in S24
- Streak indicator: filled-circle sparkline across last 6 weeks (D-Moves-3 default)
- One row per behavior: emoji + title + discipline chip + sparkline + "X/Y weeks" + "last done"
- Read-only (D-Moves-4) — no click action; pure display
- Foundation chip rendered inline per row (D-Moves-2 (a))
- **Explicitly labeled v1** — known fragility to title drift; full Path C (`behavior_id` schema) lands in S25 Epic 25.5

### F-7 — Inline `?include=tasks,moves`
- Reuse the same query param (locked F-7)
- No new endpoint
- Frontend partitions Moves into recurring (Behaviors strip) vs one-off (tree) on receive

### Cascade reality
- S24 reads from messy state via UNION endpoint from S23 #191
- Phase B (write cutover) deferred to S25 Epic 25.1
- This epic does NOT touch write paths

### Item #12 — Driver-aware empty states
- "No quarterly goals yet — Manager creates the plan."
- "No weekly plan yet — Manager builds week-by-week."
- "No tasks/moves logged this week."
- "No recurring behaviors yet."

## Acceptance Criteria

### KPI strip (uses Epic 24.9 TabHeader component)
- [ ] 4 cards rendered via `renderKPIStrip()` helper from Epic 24.9
- [ ] **Card 1 — THIS WEEK**: `8 weekly goals planned · 2 KRs uncovered`
- [ ] **Card 2 — TODAY**: `5 moves due today · 2 done · 3 pending`
- [ ] **Card 3 — CATCH-UP**: `3 pushed · 7 forgotten` (reuses S23 #192b dashboard buckets)
- [ ] **Card 4 — FRESHNESS**: `Last edit: 3 days ago · Plan to: May 22`
- [ ] All counts computed from existing endpoints; no new aggregation route

### Behaviors strip (γ-lite)
- [ ] Section heading "BEHAVIORS  (recurring; last 6 weeks)" with subtitle indicating v1 status
- [ ] Renders only Moves where `frequency != 'once'`
- [ ] Groups by normalized `(title, discipline)` tuple (case-insensitive, trimmed)
- [ ] Each row shows: 🎯 emoji + title + discipline chip + sparkline (▰▱) + completion ratio + last-completed date
- [ ] Sparkline = 6-cell visualization, one cell per ISO week, filled if any matching Move was completed that week
- [ ] Sort: by `(completion_ratio DESC, last_completed_at DESC)`
- [ ] Empty state: "No recurring behaviors yet for this client"
- [ ] Read-only — no click handlers

### Tree (Tasks-only after Behaviors promotion)
- [ ] 4 levels: KR → Quarterly Goal → Weekly Goal → (Tasks + one-off Moves)
- [ ] Recurring Moves (`frequency != 'once'`) excluded from tree
- [ ] One-off Moves (`frequency='once'`) appear as siblings of Tasks, badged distinctly (`🎯` for Move, `📋` for Task)
- [ ] Each level collapsible
- [ ] Auto-expand: current ISO week's WG; everything else collapsed
- [ ] Empty states with driver-aware copy at each level
- [ ] Status pills reuse `.status-pill` styles from S22a #184b
- [ ] Move/Task badges use `DisplayLabels.MOVE_TYPE_LABEL` (from Epic 24.3)
- [ ] Completion icons (✓ / ⏸ / ○) based on `status` / `completed` field
- [ ] No edit/delete/create affordances anywhere

### Backend (`?include=tasks,moves` extension)
- [ ] `GET /api/consultant/clients/:id/goals/quarterly` accepts `?include=tasks,moves`
- [ ] `GET /api/consultant/clients/:id/goals/weekly` accepts `?include=tasks,moves`
- [ ] When `include=tasks`: populates `tasks[]` for legacy `Goal{WEEKLY}` (Tasks reference `goal_id`)
- [ ] When `include=moves`: populates `moves[]` for new `WeeklyGoal` (Moves reference `weekly_goal_id`)
- [ ] When both: populates per source type
- [ ] Default behavior unchanged (backward compat)
- [ ] Tenant scope preserved via `requireManagedClient`
- [ ] `?include` value validated; reject anything not in whitelist `['tasks', 'moves']` with 400
- [ ] No new routes, no new middleware

### Tab integration
- [ ] Plan tab in `client-workspace.js` lazy-loads on first activation
- [ ] Loading skeleton during fetch
- [ ] Error state with retry button

## Tests

NEW `scripts/test-sprint24-244-plan-tab.js`:
- Backend: `?include=tasks,moves` populates correctly for both legacy and new sources
- Backend: `?include=tasks` populates only tasks; `?include=moves` populates only moves
- Backend: invalid `?include=passwords` returns 400
- Backend: missing `?include` returns default shape
- Backend: cross-tenant rejected via `requireManagedClient`
- Frontend: KPI strip renders 4 cards via `renderKPIStrip()`
- Frontend: Behaviors strip groups recurring Moves correctly:
  - 6 separate Move docs with title "Update CRM weekly" + same discipline → 1 grouped row
  - 2 Move docs with titles "Update CRM weekly" vs "Update CRM" → 2 rows (title-drift fragility — explicitly tested + acknowledged)
  - Move with `frequency='once'` → NOT in Behaviors strip; in tree
- Frontend: tree renders 4 levels; recurring Moves absent from tree
- Frontend: tree shows one-off Moves and Tasks both as leaves
- Frontend: current week auto-expands
- Frontend: empty states with driver-aware copy
- Frontend: no edit/delete/create affordances
- Frontend: sparkline renders 6 cells with correct fill pattern from completions[]
- Lazy-load: tab fetches only on first activation; second activation uses cache

Target: ~40-50 assertions.

## Implementation Notes

### Files to modify
- `server/routes/consultant.js` — add `?include` populate handling on quarterly + weekly endpoints
- `client/pages/client-workspace.html` — Plan tab content area (3 sections: KPI, Behaviors, Tree)
- `client/pages/scripts/client-workspace.js` — Plan tab renderer + Behaviors grouping + tree component + auto-expand logic
- `client/css/client-workspace.css` — `.behaviors-strip`, `.behavior-row`, `.behavior-sparkline`, `.plan-tree`, `.plan-tree-node`, etc.

### Surgical reuse
- ✅ `GET /api/consultant/clients/:id/goals/{quarterly,weekly}` from S22a #184a
- ✅ ISO week helpers from S23 #191
- ✅ Status pill styles from S22a #184b
- ✅ `DisplayLabels` module from Epic 24.3 (consumed here)
- ✅ `requireManagedClient` from S22a #184a
- ✅ Existing UNION READ logic from S23 #191
- ✅ S22a #192b dashboard catch-up bucket logic for KPI Card 3 reuse
- ✅ TabHeader / KPI strip from Epic 24.9 (`renderKPIStrip()` helper)

### What's net new
- 1 query param branch on 2 existing endpoints (~15 LOC each)
- Frontend Behaviors strip (grouping logic + rendering)
- Sparkline visualization (vanilla SVG or styled flex divs)
- Plan tree component (vanilla JS)
- New CSS for behaviors strip + tree

### Risk mitigations
- **R4 (latency)**: deep populate could be expensive on large clients
  - Use `.lean()` on Mongoose queries to reduce hydration
  - Consider upper bound: response > N items → return collapsed message
- **Title-drift fragility**: explicitly labeled v1; documented in spec; full Path C in S25 Epic 25.5
- Lazy-load: tab fetches only on first activation

## Out of Scope (deferred to S25)

- **Full β behavior promotion to KR-level** — moves Behaviors strip from "top of tab" to "per-KR row inside tree" (S25 Epic 25.5)
- **`Move.behavior_id` schema field** for stable grouping (Path C; S25 Epic 25.5)
- **AI prompt update** to set `behavior_id` on recurring Move generation (S25 Epic 25.5)
- **Cascade cleanup** (Phase B) → S25 Epic 25.1
- Filter strip ("Behind only / Empty weeks only / Current week only") → add only if consultants request
