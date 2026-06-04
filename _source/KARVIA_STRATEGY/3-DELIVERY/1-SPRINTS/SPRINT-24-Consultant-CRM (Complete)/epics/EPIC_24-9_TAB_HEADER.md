# Epic 24.9 — Shared TabHeader / KPI Strip Component + Teams Tab KPIs

<!-- @GENOME T3-SPR-024-EPIC-9 | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 2-3
**Priority**: P0 (consumed by Epics 24.3, 24.4, and the Teams tab piece)

---

## Goal

Create a shared frontend component for the **KPI strip** that appears at the top of every workspace tab. Adopts the "onion philosophy" locked in D-Onion: every layer of the consultant surface starts with KPIs that condense the question for that layer, then reveals details below.

Also: ship the Teams-tab KPI strip (D-Teams = (a) — KPI strip only; existing team list stays as-is).

## Locked Decisions (D-Onion + D-Teams)

### D-Onion-1 — Adopt the layered philosophy across all tabs (yes)
### D-Onion-2 — Build a shared TabHeader/KPI strip component (yes)
### D-Onion-3 — Teams tab gets KPI strip only via shared component (yes)
### D-Onion-4 — My Clients tile gets ball-state distribution micro-line (yes — handled in Epic 24.1)
### D-Onion-5 — Summary tab stays as today (no activity-feed details section in S24)
### D-Onion-6 — Per-tab KPI sets (proposals confirmed; refined at implementation)

## Acceptance Criteria

### Shared component
- [ ] NEW `client/css/components/tab-header.css` — base styles for KPI strip + KPI card
- [ ] NEW small render helper exposed somewhere (pattern TBD: `window.KarviaCommon.renderKPIStrip` OR a new tiny module `client/js/tab-header.js`)
- [ ] Helper signature: `renderKPIStrip(cards, container)` where `cards = [{label, value, trend?, accent?, sublines?}]`
- [ ] CSS responsive (single mobile breakpoint at 720px; cards stack vertically on mobile)
- [ ] Visual treatment matches navy/gold theme alias from S22 #192a
- [ ] Cards support optional accent color (semantic: green/amber/red) via `accent: 'on_track' | 'at_risk' | 'urgent' | 'neutral'`
- [ ] Cards support optional trend indicator (▲ / ▼ / →) via `trend: 'up' | 'down' | 'flat'`
- [ ] Cards support multiple sublines for compound KPIs (e.g., "5 on track / 2 behind / 1 sustained")

### Consumers (these epics will call into this component)

#### Epic 24.3 (Objectives tab) — 4 cards
- [ ] **HEALTH**: counts of objectives in each ball-state (`5 on track · 2 behind · 1 sustained`)
- [ ] **CONSTRAINT**: latest assessment's constraint (`STRENGTH > Trust`)
- [ ] **DRIVERS**: owner role distribution (`5 BO-owned · 1 Manager · 0 unassigned`)
- [ ] **VELOCITY**: moves done last week + trend (`12 moves done · ▲`)

#### Epic 24.4 (Plan tab) — 4 cards
- [ ] **THIS WEEK**: weekly goal coverage (`8 weekly goals · 2 KRs uncovered`)
- [ ] **TODAY**: today's moves status (`5 due · 2 done · 3 pending`)
- [ ] **CATCH-UP**: pushed/forgotten counts (`3 pushed · 7 forgotten`)
- [ ] **FRESHNESS**: plan recency (`Last edit: 3 days ago · Plan to: May 22`)

#### Teams tab — 4 cards (NEW in this epic)
- [ ] **TEAMS**: count + members (`3 teams · 12 members`)
- [ ] **ASSESSMENT COMPLETION**: ratio + percentage (`8/12 (67%)`)
- [ ] **COVERAGE**: gaps (`4 unassigned employees · 0 mgrs without team`)
- [ ] **AVG SSI BY TEAM**: per-team scores (`Ops: 7.2 · Sales: 5.5 · Eng: 6.8`)

#### Summary tab — already exists from S22a #184b
- [ ] Existing 5 KPI cards (SSI / Risk / Objectives / Teams / Assessments) refactored to use the shared component
- [ ] **Adjustment**: Objectives card now shows ball-state distribution (`6 total · 🎯2 🤝3 📊1`) — reuses Epic 24.1 micro-line pattern

#### Assessments tab (Epic 24.5)
- [ ] Existing `team-ssi-view.html` cards stay as-is (page-reuse; we don't refactor that page in S24)
- [ ] Future S25/S26: optionally migrate `team-ssi-view.html` to the shared component for consistency (NOT in S24)

### Documentation
- [ ] Pattern documented in `.claude/DESIGN_SYSTEM.md` under a new "Component CSS" section
- [ ] Note about `client/css/components/` folder convention (also referenced from Epic 24.3 F-6 lock)

## Tests

NEW `scripts/test-sprint24-249-tab-header.js`:
- `renderKPIStrip()` produces correct DOM structure (4-card flex row)
- Cards render label, value, optional sublines, optional trend, optional accent
- Empty cards array renders nothing (graceful)
- Responsive CSS: cards stack on viewport < 720px
- Each consumer (Objectives / Plan / Teams / Summary) integration test:
  - Objectives KPI strip renders 4 cards with correct values from objective data
  - Plan KPI strip renders 4 cards
  - Teams KPI strip renders 4 cards
  - Summary KPI strip refactored to use shared component (regression: same data, same visual outcome)
- phase3-3 lint regression: no new role-check sites

Target: ~25-35 assertions.

## Implementation Notes

### Files to create
- `client/css/components/tab-header.css`
- `client/js/tab-header.js` (or extend `KarviaCommon` — TBD at implementation)
- `scripts/test-sprint24-249-tab-header.js`

### Files to modify
- `client/pages/client-workspace.html` — Teams tab content area gets KPI strip placeholder
- `client/pages/scripts/client-workspace.js` — Teams tab handler (adds `renderKPIStrip` call); Summary tab refactor to use shared component
- `.claude/DESIGN_SYSTEM.md` — document the pattern

### Surgical reuse
- ✅ Navy/gold theme aliases from S22 #192a
- ✅ Existing card styling patterns from S22a #184b (Summary tab) — port into the new component CSS
- ✅ Existing `KarviaCommon.escapeHtml` for safe interpolation

### What's net new
- 1 component CSS file + 1 helper module
- Teams tab KPI strip rendering (new content area in `client-workspace.html`)
- Documentation note in DESIGN_SYSTEM.md

### Risk mitigations
- **R3 (CSS coupling)**: shared component lives in `client/css/components/`; namespaced; doesn't conflict with existing tab-specific CSS
- **Refactor risk on Summary tab**: existing visual must be preserved exactly — visual diff verified in test
- **Performance**: KPI strip rendering is O(N) over 4 cards; no concerns

## Sequencing

This epic ships **early** in S24 (alongside Epic 24.6 migration, before Epic 24.3 frontend session) so subsequent epics consume the component:
- Session order: Epic 24.7 (discovery) → Epic 24.6 (migration) → **Epic 24.9 (TabHeader)** → Epic 24.3 → Epic 24.4 → Epic 24.5 → Epic 24.1 → Epic 24.2 → Epic 24.8

## Out of Scope (deferred elsewhere)

- Activity-feed details section on Summary tab (D-Onion-5 = no)
- Full Teams tab redesign (D-Teams = (a); only KPI strip)
- Migration of `team-ssi-view.html` to shared component (S25/S26 polish)
- Custom dashboard builder, configurable KPIs — far future
