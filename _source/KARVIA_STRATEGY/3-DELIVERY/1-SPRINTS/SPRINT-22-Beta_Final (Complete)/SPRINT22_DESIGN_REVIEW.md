# Sprint 22 Design Review

<!-- @GENOME T3-SPR-022-DR | ACTIVE | 2026-04-22 | parent:T3-SPR-022-MP | auto:/coding,/design | linked:/strategy -->

**Created**: April 22, 2026 (Session #173)
**Purpose**: Ensure every Sprint 22 feature uses existing design patterns only — no new fonts, colors, buttons, or navigation structures.
**Authority**: This document overrides individual epic specs where conflicts exist.

---

## The Rule

> Every Sprint 22 UI element must map to an existing pattern in `s13-patterns.css` or the two approved color systems. If it doesn't, it is a design risk that must be resolved before implementation.

---

## 1. Design System Baseline

### 1.1 Approved Color Systems

Sprint 22 uses **two systems only**, determined by page context:

| System | Primary Color | Use When |
|--------|---------------|----------|
| **Primary (Purple)** | `#7C3AED` | All main app pages: Dashboard, My Clients, Objectives, Goals, Planning |
| **SSI (Navy/Gold)** | `#1e3a5f` / `#c9a227` | Assessment reports, SSI results, Team SSI view only |

**Critical**: My Clients, Dashboard, Objective Wizard → **Purple system**.
SSI score display *within* a page → can use SSI colors for that element only.

#### Full Approved Palette

| Token | Hex | Variable |
|-------|-----|----------|
| Primary | `#7C3AED` | `--karvia-primary` |
| Primary Light | `#A78BFA` | `--karvia-primary-light` |
| Primary Dark | `#5B21B6` | `--karvia-primary-dark` |
| Primary BG | `#F5F3FF` | `--karvia-primary-bg` |
| Success | `#10B981` | `--karvia-success` |
| Success BG | `#ECFDF5` | `--karvia-success-bg` |
| Warning | `#F59E0B` | `--karvia-warning` |
| Warning BG | `#FFFBEB` | `--karvia-warning-bg` |
| Danger | `#EF4444` | `--karvia-danger` |
| Danger BG | `#FEF2F2` | `--karvia-danger-bg` |
| Info | `#3B82F6` | `--karvia-info` |
| Info BG | `#EFF6FF` | `--karvia-info-bg` |
| Gray 50–900 | See design system | `--karvia-gray-*` |
| SSI Navy | `#1e3a5f` | `--ssi-navy` *(assessment context only)* |
| SSI Gold | `#c9a227` | `--ssi-gold` *(assessment context only)* |

### 1.2 Typography

```
Font: Inter (Google Fonts) — only approved font
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Sizes: 0.75rem / 0.875rem / 1rem / 1.125rem / 1.25rem / 1.5rem
```

No other font families. No custom font weights beyond 300/400/500/600/700.

### 1.3 Spacing

`4px · 8px · 16px · 24px · 32px` — use CSS variables `--karvia-spacing-*`.

### 1.4 Border Radius

| Usage | Value | Variable |
|-------|-------|----------|
| Buttons, inputs | `0.375rem` | `--karvia-radius-sm` |
| Small cards | `0.5rem` | `--karvia-radius-md` |
| Cards | `0.75rem` | `--karvia-radius-lg` |
| Large cards, modals | `1rem` | `--karvia-radius-xl` |

### 1.5 Approved Component Patterns

| Pattern | Class | Notes |
|---------|-------|-------|
| Card | `k-card` | White bg, border `--karvia-gray-200`, shadow-sm |
| Primary button | `k-btn-primary` | Purple bg, white text |
| Badge | `k-badge k-badge-success/warning/danger` | Status indicators |
| Form input | Existing input styles | Border `--karvia-gray-200`, focus ring Purple |
| Modal | Existing modal overlay | Dark overlay, centered card |
| Sidebar nav | `navigation.css` | 240px, existing items only |

### 1.6 Navigation Structure (Frozen)

```
HEADER: Logo | Nav links | User menu
SIDEBAR (240px):
  - Dashboard
  - My Clients ← NEW (consultant role only, existing pattern)
  - Objectives
  - Planning
  - Teams
  - Assessments
  - Settings
```

No new navigation patterns. "My Clients" uses the same nav-item component as existing items, with role-based visibility (`consultant only`).

---

## 2. What Cannot Be Introduced

| Category | Forbidden |
|----------|-----------|
| **Fonts** | Any font other than Inter |
| **Colors** | Any hex value not in §1.1 table |
| **Color systems** | Any third color system (no Navy/Gold on app pages) |
| **Button styles** | New variants beyond primary / secondary / ghost / danger |
| **Navigation** | New sidebar patterns, top nav items for non-consultant roles |
| **Card shapes** | Non-rectangular cards, unusual radius values |
| **Icon libraries** | No new icon library imports (use inline SVG or existing icons) |
| **Animation** | No keyframe animations; transitions max 300ms ease |
| **Shadows** | Only `--karvia-shadow-sm/md/lg` |

---

## 3. Epic-by-Epic Design Audit

### Epic A — Data Models & Disciplines (5 pts)

**UI Surface**: None — backend only (`KeyResult.js`, `WeeklyGoal.js`, `Move.js`, `disciplines.js`)

**Design Impact**: Discipline names (`Accountability`, `Maturity`, `Growth`, `Discipline`) appear as labels in Epic E and G. No new visual patterns required.

**Status**: ✅ No design risk

---

### Epic B — AIContextService Extension (10 pts)

**UI Surface**: None — backend service extension only

**Design Impact**: None directly. Loading states and error states triggered by this service use existing spinner + error card patterns already in place.

**Status**: ✅ No design risk

---

### Epic C — My Clients Page (21 pts)

**UI Surface**: New page `client/pages/my-clients.html` — largest UI addition in Sprint 22

#### 3.C.1 Page-Level Color System

**⚠️ CONFLICT FOUND — Epic C spec says "Primary Color: Navy `#1e3a5f`"**

**Resolution**: This is incorrect. My Clients is a main app page. It must use the **Purple primary system**. Navy/Gold is reserved for assessment/SSI contexts only.

| Element | Epic C Spec (Incorrect) | Correct |
|---------|------------------------|---------|
| CTA buttons | Navy `#1e3a5f` | Purple `#7C3AED` (`--karvia-primary`) |
| Active nav item | Navy | Purple |
| Focus rings | Navy | Purple |
| SSI score display | SSI Navy/Gold | ✅ SSI colors are OK here (assessment data) |

#### 3.C.2 KPI Header Row

4 KPI cards across the top. Map to existing `k-card` pattern.

| KPI Card | Color Rule |
|----------|------------|
| Total Clients | Gray — `--karvia-gray-800` value, `--karvia-gray-100` bg |
| Need Attention | Warning amber — `--karvia-warning` + `--karvia-warning-bg` |
| Avg SSI | Success/warning/danger by score — existing status colors |
| At Risk | Danger red — `--karvia-danger` + `--karvia-danger-bg` |

**Status**: ✅ Maps cleanly to existing status color system

#### 3.C.3 Journey Stage Badges

**⚠️ CONFLICT FOUND — Epic C spec introduces Pink `#EC4899` for "Prospect" stage**

Pink is not in the design system. The approved status colors are: gray, purple, amber, green, red, blue.

**Resolution**: Map journey stages to approved colors only:

| Stage | Epic C Spec | Corrected Color | Token |
|-------|-------------|-----------------|-------|
| Prospect | Pink `#EC4899` | **Info blue** `#3B82F6` | `--karvia-info` + `--karvia-info-bg` |
| Onboarding | Gray `#9CA3AF` | ✅ Gray | `--karvia-gray-500` + `--karvia-gray-100` |
| Objective Identified | Purple `#8B5CF6` | ✅ Primary purple | `--karvia-primary` + `--karvia-primary-bg` |
| Handed Off | Blue `#3B82F6` | ✅ Info blue | `--karvia-info` + `--karvia-info-bg` |
| In Progress | Amber `#F59E0B` | ✅ Warning amber | `--karvia-warning` + `--karvia-warning-bg` |
| Completed | Green `#10B981` | ✅ Success green | `--karvia-success` + `--karvia-success-bg` |
| Sustained | Dark Green `#059669` | ✅ Success green | `--karvia-success` + `--karvia-success-bg` |

**Note**: Prospect and Handed Off now both use info blue — differentiate with label text and/or border-left accent only, not color uniqueness.

#### 3.C.4 Client Tile Structure

```
Card: k-card pattern — white, border --karvia-gray-200, radius-lg
  ├── Company logo initials: circular avatar, --karvia-gray-100 bg
  ├── SSI donut: SVG inline, uses --ssi-gold/navy for SSI data (exception: SSI data)
  ├── Objectives rectangle: --karvia-gray-50 bg, existing progress bar pattern
  ├── Stage badge: k-badge with approved stage colors (§3.C.3)
  └── Action buttons: border-top divider, three equal ghost buttons
```

**Border-left stage accent**: `3px solid [stage-color]` on card left edge — this is an existing pattern used in team views. ✅ Approved.

#### 3.C.5 Add Client Wizard

3-step modal wizard.

| Step | UI Pattern | Status |
|------|-----------|--------|
| Step 1: Company Info | Existing modal + form inputs | ✅ |
| Step 2: AI Auto-fill | Loading spinner (existing) | ✅ |
| Step 3: Confirm | Existing modal footer buttons | ✅ |

**Wizard progress indicator** (Step 1 / 2 / 3): Use step dots or numeric indicator — keep to gray + primary purple. No new progress bar library.

#### 3.C.6 Action Buttons (Notes, Nudge, Assess)

```
Pattern: Three ghost buttons in a bordered row at tile bottom
Style: border-top: 1px solid --karvia-gray-100, equal flex columns
Hover: --karvia-gray-50 background (existing hover pattern)
Nudge dropdown: Standard dropdown/popover — white bg, shadow-md, radius-md
```

**Status**: ✅ All map to existing patterns

---

### Epic E — Objective Creation Wizard (10 pts)

**UI Surface**: 3-screen modal wizard on `client/pages/objectives.html` (or standalone page)

#### 3.E.1 Screen 1 — Define Objective

| Element | Pattern |
|---------|---------|
| Title input | Existing text input, focus ring `--karvia-primary` |
| Category radio buttons | Existing radio group, selected = purple border + bg |
| SSI Impact dropdowns | Existing `<select>` style or custom dropdown |
| Cancel / Next buttons | Ghost + Primary button pair (existing) |

**Status**: ✅ No new patterns

#### 3.E.2 Screen 2 — Select Behaviors (Disciplines)

| Element | Pattern |
|---------|---------|
| Foundation headers (Discipline, Growth, etc.) | Section label — uppercase, `--karvia-gray-400`, 0.7rem |
| Discipline checkboxes | Existing checkbox pattern, checked = `--karvia-primary` fill |
| Selected count (`2/3 recommended`) | Muted text `--karvia-gray-500` |
| Back / Skip / Next | Three-button footer (ghost, ghost, primary) |

**Behavior group separators**: `border-bottom: 1px solid --karvia-gray-100` between foundation groups. ✅ Existing divider pattern.

**Status**: ✅ No new patterns

#### 3.E.3 Screen 3 — Key Results

| Element | Pattern |
|---------|---------|
| KR list items | Existing list item with edit/delete icons |
| `[+ Add KR]` button | Ghost button with `+` prefix |
| `[✨ Generate with AI]` | Primary button (purple), loading state uses existing spinner |
| KR input rows | Existing inline edit pattern |

**Status**: ✅ No new patterns

#### 3.E.4 Wizard Navigation

Step indicator at top (Screen 1 → 2 → 3):

```
○ Define  →  ○ Behaviors  →  ● Key Results
```

Use filled/unfilled circles in `--karvia-primary` / `--karvia-gray-300`. Connecting line in `--karvia-gray-200`. **No library** — simple flexbox with inline SVG dots.

**Status**: ✅ Simple, no new pattern

---

### Epic F — aiOKRService Extension (10 pts)

**UI Surface**: Minimal — triggers AI generation inside existing wizard (Epic E) and returns results.

| UI Element | Location | Pattern |
|------------|----------|---------|
| Loading state during AI call | Inside modal | Existing spinner, `--karvia-primary` color |
| Generated KR list | Screen 3 of wizard | Existing list item pattern |
| Error state | Modal footer | `--karvia-danger` text + retry button |
| "AI-generated" label on KR | Subtle badge | `--karvia-info-bg` + `--karvia-info` text, `k-badge` pattern |

**Status**: ✅ No new patterns

---

### Epic G — Dashboard V3 (5 pts)

**UI Source**: `sprint_mockups/sprint-22/dashboard-v3.html` (Session #173) — this is the authoritative spec. The older `dashboard.html` spec (Session #169) is superseded.

#### 3.G.1 Color System

**⚠️ CONFLICT — Old Epic G spec (`EPIC_G_DASHBOARD_UI.md`) says replace Purple with Navy**

**Resolution**: Dashboard is a main app page. **Purple primary system is correct.** Dashboard V3 (`dashboard-v3.html`) already uses `--karvia-primary: #7C3AED` correctly. The old epic spec was written before Session #173 redesign. Disregard the color replacement table in `EPIC_G_DASHBOARD_UI.md`.

| Element | dashboard-v3.html (Correct) | Old spec (Superseded) |
|---------|----------------------------|-----------------------|
| Check circles | `--karvia-primary` | Navy |
| Popovers confirm | `--karvia-primary` | Navy |
| Ball name text | `--karvia-primary` | Navy |
| Paused state | `--karvia-warning` (amber) | Same |

#### 3.G.2 New Patterns Introduced (Approved in Session #173)

These are new UI patterns added in dashboard-v3.html. They are approved but must be documented for consistency if reused elsewhere.

**a) Move Card — Causal Chain Grid**

```
Two-column grid: [building behavior] → [moving ball]
Grid: grid-template-columns: minmax(0,1fr) auto minmax(0,1.2fr)
Uses existing: border, radius-lg, shadow-sm, k-card background
```

**b) SVG Icon System**

Two inline SVG symbols defined once at body start:
- `icon-building`: 3 ascending bars (behavior building metaphor)
- `icon-moving`: trend line + dot (ball movement metaphor)

Usage: `<svg class="chain-icon"><use href="#icon-building"/></svg>`

These are self-contained — no icon library import. ✅ Approved pattern.

**c) Group Switch (Segmented Control)**

```css
.group-switch: inline-flex, --karvia-gray-100 bg, 2px padding, radius 6px
.group-btn.is-active: white bg, shadow-sm, --karvia-gray-900 text
.group-btn: transparent bg, --karvia-gray-500 text
```

This is a new component. If used elsewhere, copy this exact CSS — do not invent a new variant.

**d) Catch-up Strip**

3-tile horizontal row with inline expand panels below. Each tile:
- White bg, `--karvia-gray-200` border, `radius-md`
- Glyph (◐ / ○ / ▸) + count + label
- Hover: `translateY(-1px)` — existing hover transform pattern

**e) Progress Bar (Habit Meter)**

```css
Width: 60px, height: 3px, --karvia-gray-200 track, --karvia-gray-600 fill
Paused state: --karvia-warning fill
Complete state: --karvia-gray-400 fill
```

Thin, non-interactive. Different from existing progress bars which are taller — but uses same color tokens.

#### 3.G.3 Card States

| State | Visual Treatment | Tokens Used |
|-------|-----------------|-------------|
| Active | Default white card | `--karvia-gray-200` border |
| Paused | Amber tint | `#FEFCE8` bg, `#FDE68A` border ← derived from `--karvia-warning` |
| Assigned-out | Dashed border | `border-style: dashed`, same `--karvia-gray-200` |
| Completed | Greyed | `opacity: 0.78`, `--karvia-gray-50` bg |

**Note**: `#FEFCE8` and `#FDE68A` are Tailwind `yellow-50` and `yellow-200` — close derivatives of `--karvia-warning-bg`. Accept these as warning-family colors. Do not introduce paused state colors outside of move cards.

#### 3.G.4 KPI Strip

```
1 line: "83 moves · 85% this week · ▲"
Font: 0.7rem, --karvia-gray-400 / --karvia-success for ▲
Position: Right side of moves-header row
```

No new pattern — label + colored span. ✅

**Status**: ✅ Epic G approved with resolutions above

---

## 4. Conflict Resolution Summary

| # | Conflict | Affected Epic | Resolution |
|---|----------|---------------|------------|
| 1 | My Clients uses Navy as primary | Epic C | **Use Purple** — Navy only for SSI data elements within the page |
| 2 | "Prospect" stage uses Pink `#EC4899` | Epic C | **Replace with Info blue** `--karvia-info` |
| 3 | Old Dashboard spec replaces Purple with Navy | Epic G | **Old spec superseded** — dashboard-v3.html (Session #173) is authoritative |
| 4 | Epic G spec says `#8B5CF6` (purple-light) | Epic G | **Use `#7C3AED`** (`--karvia-primary`) — correct token |
| 5 | Paused card colors `#FEFCE8`/`#FDE68A` not in variables | Epic G | **Accepted** as warning-family; scoped to move cards only |

---

## 5. Navigation Change

Only one navigation change in Sprint 22:

```
Add: "My Clients" nav item in sidebar
Visible to: CONSULTANT role only
Pattern: Exact same <li> structure as existing nav items
Icon: Briefcase or users icon (inline SVG, same size as existing nav icons)
Active state: --karvia-primary bg, white text (existing pattern)
```

No new navigation components. No restructuring of existing nav order — "My Clients" inserts after "Dashboard".

---

## 6. Page-to-Color-System Map

| Page | System | Primary |
|------|--------|---------|
| `dashboard-v2.html` (updated) | Primary | Purple |
| `my-clients.html` (new) | Primary | Purple |
| `objectives.html` (wizard) | Primary | Purple |
| `assessment-hub.html` | SSI | Navy/Gold |
| `team-ssi-view.html` | SSI | Navy/Gold |
| SSI score elements inside any page | SSI (element only) | Navy/Gold |

---

## 7. Implementation Checklist

Before submitting any Sprint 22 PR, verify:

```
COLORS
[ ] No hex values hardcoded (use CSS variables)
[ ] No Navy/Gold on non-assessment pages
[ ] No Pink, Teal, or other unapproved colors
[ ] Paused state colors scoped to move cards only

TYPOGRAPHY
[ ] Inter font only
[ ] No new font-weight values

COMPONENTS
[ ] Cards use k-card base pattern (white, radius-lg, shadow-sm)
[ ] Buttons use existing primary/ghost/danger variants only
[ ] Badges use k-badge with approved status colors
[ ] Inputs use existing focus ring (--karvia-primary)
[ ] Modals use existing overlay + centered card pattern

NAVIGATION
[ ] No new nav patterns
[ ] My Clients item uses same structure as existing nav items
[ ] Role visibility (CONSULTANT only) via JS, not separate HTML

EPIC C SPECIFIC
[ ] Prospect badge = Info blue (not Pink)
[ ] All journey stage colors map to §3.C.3 table
[ ] CTA buttons = Purple (not Navy)

EPIC G SPECIFIC
[ ] Dashboard uses Purple primary (not Navy)
[ ] Group switch component matches dashboard-v3.html exactly
[ ] SVG icons use <use href="#icon-*"> pattern

NEW PATTERNS (if reusing in other epics)
[ ] Group switch: copy exact CSS from dashboard-v3.html
[ ] Chain grid: copy exact grid definition
[ ] SVG symbols: define in <defs> block at body start
```

---

## 8. Design Escalation

If an implementation decision requires a color, component, or pattern not covered by this document:

1. Do NOT invent it — stop and flag it
2. Check if an existing design system token is close enough
3. If genuinely new pattern is needed, document it here first
4. Get approval before implementing

---

**Created**: April 22, 2026 (Session #173)
**Status**: ACTIVE — applies to all Sprint 22 implementation sessions
**Next Review**: After Epic C implementation (verify stage badge colors in code)
