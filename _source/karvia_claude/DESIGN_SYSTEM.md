# Karvia Design System Reference

<!-- @GENOME T2-DES-001 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/design | linked:/coding -->

**Version**: 1.0.0
**Status**: MANDATORY - Apply to ALL design and frontend work
**Source**: `client/css/s13-patterns.css`

---

## Quick Reference

### Brand Identity

```
LOGO: Karvia
      └── Purple primary (#7C3AED)

TAGLINE: Unlock Your Team's Potential

FONT: Inter (Google Fonts)
      └── Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
```

### Color Systems

Karvia uses **two color systems** depending on context:

1. **Primary System** - Main app (Purple-based)
2. **SSI System** - Assessment reports (Navy/Gold)

---

## Primary Color System

### Brand Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Primary** | `#7C3AED` | `--karvia-primary` | CTAs, active states, links |
| **Primary Light** | `#A78BFA` | `--karvia-primary-light` | Hover states, accents |
| **Primary Dark** | `#5B21B6` | `--karvia-primary-dark` | Pressed states, emphasis |
| **Primary BG** | `#F5F3FF` | `--karvia-primary-bg` | Light purple backgrounds |

### Neutral Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Gray 50** | `#F9FAFB` | `--karvia-gray-50` | Page backgrounds |
| **Gray 100** | `#F3F4F6` | `--karvia-gray-100` | Card backgrounds, dividers |
| **Gray 200** | `#E5E7EB` | `--karvia-gray-200` | Borders, input backgrounds |
| **Gray 300** | `#D1D5DB` | `--karvia-gray-300` | Disabled text, placeholders |
| **Gray 400** | `#9CA3AF` | `--karvia-gray-400` | Muted text |
| **Gray 500** | `#6B7280` | `--karvia-gray-500` | Secondary text |
| **Gray 600** | `#4B5563` | `--karvia-gray-600` | Body text |
| **Gray 700** | `#374151` | `--karvia-gray-700` | Headings |
| **Gray 800** | `#1F2937` | `--karvia-gray-800` | Dark headings |
| **Gray 900** | `#111827` | `--karvia-gray-900` | Emphasis text |

### Status Colors

| Status | Color | Background | Usage |
|--------|-------|------------|-------|
| **Success** | `#10B981` | `#ECFDF5` | Completed, positive |
| **Warning** | `#F59E0B` | `#FFFBEB` | Attention needed |
| **Danger** | `#EF4444` | `#FEF2F2` | Errors, destructive |
| **Info** | `#3B82F6` | `#EFF6FF` | Information |

---

## SSI System (Navy/Gold)

**Use for**: Assessment reports, SSI dashboards, team SSI views

### SSI Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Navy** | `#1e3a5f` | `--ssi-navy` | Headers, primary CTAs |
| **Navy Light** | `#2d5a87` | `--ssi-navy-light` | Gradients, hover |
| **Navy Dark** | `#152a45` | `--ssi-navy-dark` | Emphasis, dark mode |
| **Gold** | `#c9a227` | `--ssi-gold` | Accents, scores, highlights |
| **Gold Light** | `#e6c558` | `--ssi-gold-light` | Hover, decorative |
| **Gold Dark** | `#a68520` | `--ssi-gold-dark` | Pressed states |
| **Navy BG** | `#f0f4f8` | `--ssi-navy-bg` | Card backgrounds |
| **Gold BG** | `#fdf8e8` | `--ssi-gold-bg` | Highlight backgrounds |

### SSI Gradient

```css
background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
```

---

## Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes

| Name | Size | CSS Variable | Usage |
|------|------|--------------|-------|
| XS | `0.75rem` (12px) | `--karvia-font-size-xs` | Captions, badges |
| SM | `0.875rem` (14px) | `--karvia-font-size-sm` | Secondary text |
| Base | `1rem` (16px) | `--karvia-font-size-base` | Body text |
| LG | `1.125rem` (18px) | `--karvia-font-size-lg` | Subheadings |
| XL | `1.25rem` (20px) | `--karvia-font-size-xl` | Section headings |
| 2XL | `1.5rem` (24px) | `--karvia-font-size-2xl` | Page titles |

---

## Spacing

| Name | Size | CSS Variable |
|------|------|--------------|
| XS | `0.25rem` (4px) | `--karvia-spacing-xs` |
| SM | `0.5rem` (8px) | `--karvia-spacing-sm` |
| MD | `1rem` (16px) | `--karvia-spacing-md` |
| LG | `1.5rem` (24px) | `--karvia-spacing-lg` |
| XL | `2rem` (32px) | `--karvia-spacing-xl` |

---

## Border Radius

| Name | Size | CSS Variable | Usage |
|------|------|--------------|-------|
| SM | `0.375rem` (6px) | `--karvia-radius-sm` | Buttons, inputs |
| MD | `0.5rem` (8px) | `--karvia-radius-md` | Small cards |
| LG | `0.75rem` (12px) | `--karvia-radius-lg` | Cards |
| XL | `1rem` (16px) | `--karvia-radius-xl` | Large cards, modals |

---

## Shadows

| Name | CSS Variable | Usage |
|------|--------------|-------|
| SM | `--karvia-shadow-sm` | Subtle elevation |
| MD | `--karvia-shadow-md` | Cards, dropdowns |
| LG | `--karvia-shadow-lg` | Modals, popovers |

```css
--karvia-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--karvia-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--karvia-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
```

---

## Component Patterns

### Card (k-card)

```html
<div class="k-card">
  <div class="k-card-header">
    <h3 class="k-card-title">Title</h3>
    <span class="k-badge k-badge-success">Active</span>
  </div>
  <div class="k-card-body">
    Content here
  </div>
</div>
```

### Button Primary

```css
.k-btn-primary {
  background: var(--karvia-primary);
  color: white;
  padding: var(--karvia-spacing-sm) var(--karvia-spacing-md);
  border-radius: var(--karvia-radius-sm);
  font-weight: 600;
  transition: background var(--karvia-transition-fast);
}

.k-btn-primary:hover {
  background: var(--karvia-primary-dark);
}
```

### SSI Report Header

```html
<div class="ssi-report-header">
  <h2>SSI Assessment Report</h2>
  <span class="report-date">March 6, 2026</span>
</div>
```

```css
.ssi-report-header {
  background: linear-gradient(135deg, var(--ssi-navy) 0%, var(--ssi-navy-light) 100%);
  color: white;
  padding: var(--karvia-spacing-lg) var(--karvia-spacing-xl);
}
```

---

## Component CSS

Reusable per-component stylesheets live in `client/css/components/`. Each
component pairs a CSS file with a small render-helper module under
`client/js/`. This convention keeps tab-/page-level CSS files (e.g.
`client-workspace.css`) free of cross-tab styles and lets future epics
consume the component without touching the host page's stylesheet.

**Folder convention**:

```
client/css/components/
  ├─ tab-header.css        ← KPI strip on every workspace tab
  └─ ...                   (future shared components go here)

client/js/
  ├─ tab-header.js         ← window.KarviaTabHeader.renderKPIStrip(cards, container)
  └─ ...
```

### TabHeader / KPI strip (`tab-header.css` + `tab-header.js`)

Implements the **Onion philosophy** locked in S24 (D-Onion-1/2): every
consultant-workspace tab opens with a dense KPI strip on top, details below.

**Helper signature**:

```js
window.KarviaTabHeader.renderKPIStrip(cards, container);
// cards: Array<{
//   label:    string,
//   value:    string|number,                          // required (or valueHTML)
//   valueHTML:string,                                  // optional — trusted HTML
//   trend:    'up'|'down'|'flat',                      // optional — ▲ / ▼ / →
//   accent:   'on_track'|'at_risk'|'urgent'|'neutral', // optional — left-border
//   sublines: string[]                                 // optional — each escaped
// }>
// container: HTMLElement (mutated in place; idempotent re-renders)
```

**Visual language**:

- Strip: CSS grid, `auto-fit minmax(180px, 1fr)`, 16px gap.
- Cards: navy/gold theme; left-border 4px conveys semantic accent
  (`on_track` green / `at_risk` amber / `urgent` red / `neutral` slate).
- Mobile breakpoint: 720px → cards stack to single column.
- Namespace: `.kts-*` (Karvia Tab Strip); does not collide with
  `.cw-summary-*` or `.cw-list` rules in `client-workspace.css`.

**Consumers** (in S24):

- Summary tab → 5 cards (SSI, Risk, Objectives w/ ball-state distribution,
  Teams, Assessments). Last Activity tile lives below the strip.
- Teams tab → 4 cards (TEAMS, ASSESSMENT COMPLETION, COVERAGE,
  AVG SSI BY TEAM). Existing team list stays as-is below the strip.
- Objectives tab (Epic 24.3 P2 / Session F) and Plan tab (Epic 24.4 /
  Session G) consume the same helper for their per-tab KPI sets.

**Reuse rule**: when adding a new shared component, drop it in
`client/css/components/` (CSS) + `client/js/` (helper) and document it in
this section. Do not add cross-tab rules to per-page CSS files.

---

## CSS Variables (Copy to HTML)

```html
<style>
:root {
  /* Brand Colors */
  --karvia-primary: #7C3AED;
  --karvia-primary-light: #A78BFA;
  --karvia-primary-dark: #5B21B6;
  --karvia-primary-bg: #F5F3FF;

  /* Neutral Colors */
  --karvia-gray-50: #F9FAFB;
  --karvia-gray-100: #F3F4F6;
  --karvia-gray-200: #E5E7EB;
  --karvia-gray-300: #D1D5DB;
  --karvia-gray-400: #9CA3AF;
  --karvia-gray-500: #6B7280;
  --karvia-gray-600: #4B5563;
  --karvia-gray-700: #374151;
  --karvia-gray-800: #1F2937;
  --karvia-gray-900: #111827;

  /* Status Colors */
  --karvia-success: #10B981;
  --karvia-success-bg: #ECFDF5;
  --karvia-warning: #F59E0B;
  --karvia-warning-bg: #FFFBEB;
  --karvia-danger: #EF4444;
  --karvia-danger-bg: #FEF2F2;
  --karvia-info: #3B82F6;
  --karvia-info-bg: #EFF6FF;

  /* SSI Theme (Navy/Gold) */
  --ssi-navy: #1e3a5f;
  --ssi-navy-light: #2d5a87;
  --ssi-navy-dark: #152a45;
  --ssi-gold: #c9a227;
  --ssi-gold-light: #e6c558;
  --ssi-gold-dark: #a68520;
  --ssi-navy-bg: #f0f4f8;
  --ssi-gold-bg: #fdf8e8;

  /* Typography */
  --karvia-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Border Radius */
  --karvia-radius-sm: 0.375rem;
  --karvia-radius-md: 0.5rem;
  --karvia-radius-lg: 0.75rem;
  --karvia-radius-xl: 1rem;
}
</style>
```

---

## Page Layout Structure (S13+)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: Karvia | Dashboard | User Menu                         │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│  SIDEBAR │                   MAIN CONTENT                       │
│  (240px) │                                                      │
│          │                                                      │
│  - Nav   │   ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  - Items │   │ k-card  │  │ k-card  │  │ k-card  │            │
│          │   └─────────┘  └─────────┘  └─────────┘            │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

---

## Checklist Before Submitting Design

```
[ ] Using Inter font?
[ ] Colors from design system (no hardcoded hex)?
[ ] Using CSS variables?
[ ] Correct system: Primary vs SSI?
[ ] k-card pattern for cards?
[ ] Mobile responsive?
[ ] Hover states defined?
[ ] Consistent spacing (xs/sm/md/lg/xl)?
[ ] Consistent border radius?
```

---

## When to Use Each System

| Context | Color System | Primary Colors |
|---------|--------------|----------------|
| Main app pages | Primary | Purple (#7C3AED) |
| Dashboard | Primary | Purple |
| Goals/Tasks | Primary | Purple |
| OKR views | Primary | Purple |
| **SSI Reports** | **SSI** | **Navy (#1e3a5f)** |
| **Assessment Results** | **SSI** | **Navy/Gold** |
| **Team SSI View** | **SSI** | **Navy/Gold** |

---

## Source Files

| File | Location | Description |
|------|----------|-------------|
| S13 Patterns | `client/css/s13-patterns.css` | Main design tokens |
| Main CSS | `client/css/main.css` | Legacy styles |
| Navigation | `client/css/navigation.css` | Sidebar styles |

---

**IMPORTANT**: This reference must be consulted for ALL frontend and design work in Karvia sessions.
