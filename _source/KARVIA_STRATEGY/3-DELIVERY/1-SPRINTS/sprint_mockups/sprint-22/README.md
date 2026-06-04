# Sprint 22 Design Specifications

**Sprint**: 22 — Beta_Final
**Created**: April 21, 2026
**Last Updated**: April 28, 2026 (Session #174 — Pre-Sprint Cleanup)
**Status**: ✅ Ready for /coding

---

## Theme & Navigation Rules (READ FIRST)

| Rule | Value |
|------|-------|
| **Color theme** | Sprint 22 Navy/Gold via s22 tokens in `client/css/s13-patterns.css` |
| **Navigation** | **LOCKED** to production component. Every mockup uses `<nav class="bg-white border-b border-gray-100 sticky top-0 z-50"><div id="main-navigation"></div></nav>` + `<script src="/js/navigation.js"></script>`. Implementation must NOT alter that block. |
| **Font** | Inter (Google Fonts) — already standard |
| **CSS authority** | `client/css/s13-patterns.css` — mockups link to it via `<link rel="stylesheet" href="../../../../../client/css/s13-patterns.css">` |
| **No Purple** | All Purple (`#7C3AED`, `#8B5CF6`, etc.) is removed. Verified via grep across all mockups. |

---

## Theme Tokens (added to s13-patterns.css)

```css
--s22-navy:        #1F2937;
--s22-navy-light:  #374151;
--s22-navy-dark:   #111827;
--s22-navy-bg:     #F3F4F6;
--s22-gold:        #F59E0B;
--s22-gold-light:  #FCD34D;
--s22-gold-dark:   #D97706;
--s22-gold-bg:     #FFFBEB;
```

These are **additive** — Epic G adds the alias `--karvia-primary: var(--s22-navy);` during implementation, which flips the 2 `s13-patterns.css` component uses to Navy. No other live page references `--karvia-primary`, so blast radius is bounded.

---

## Mockup Inventory (6 files)

| # | File | Epic | Lines | Maps to Live | Status |
|---|------|------|-------|--------------|--------|
| 1 | [my-clients.html](./my-clients.html) | C (16/21 pts) | 692 | NEW page (no live equivalent) | Cleaned |
| 2 | [add-client-wizard.html](./add-client-wizard.html) | C (5/21 pts) | ~700 | Modal injected into my-clients.html | NEW (2-step AI flow) |
| 3 | [objective-wizard.html](./objective-wizard.html) | E (10 pts) | ~600 | Modifies `client/pages/objective-wizard.html` | NEW (mirrors live) |
| 4 | [planning.html](./planning.html) | H (5 pts, billed in G) | 524 | Modifies `client/pages/planning-v2.html` | Cleaned |
| 5 | [assessment-hub.html](./assessment-hub.html) | D (8 pts) | 681 | Modifies `client/pages/assessment-hub.html` | Cleaned |
| 6 | [dashboard-v3.html](./dashboard-v3.html) | G (5 pts) | 1,266 | Replaces `client/pages/dashboard-v2.html` content | Cleaned (production nav injected) |

**Removed**: `dashboard.html` (legacy 517-line additive variant) — V3 is canonical.

---

## Execution Order (locked)

| # | Item | Epic | Pts | Why this order |
|---|------|------|-----|----------------|
| 1 | My Clients page | C (foundation) | 16 | Consultant entry point — needed before any other consultant flow makes sense |
| 2 | Add Client wizard | C (modal) | 5 | Closes Epic C; unlocks creating clients to test downstream flows |
| 3 | Objective Wizard | E | 10 | Per-client flow; depends on KeyResult model from Epic A |
| 4 | Planning Page | H (billed in G) | 5 | Once objectives exist, planning shows their weeklies |
| 5 | Assessment Hub additions | D | 8 | Additive, low risk; can parallel-track |
| 6 | Dashboard V3 + Moves | G | 5 | Final UI consolidation; theme alias lands here |

**Backend pre-reqs (no UI, run in parallel)**: Epic A (Data Models, 5pts) → Epic B (AIContextService, 10pts) → Epic F (aiOKRService, 10pts).

**Total UI work**: 5+5+10+5+8+5 = 38 pts across 6 surfaces.
**Total backend work**: 5+10+10 = 25 pts across 3 services.
**Sprint 22 grand total**: 61 pts (handoff confirms).

---

## Per-Mockup Boundary Notes

### `my-clients.html` (Epic C, 16/21 pts)

**Greenfield** — no live equivalent. Implementation creates `client/pages/my-clients.html` + `client/pages/scripts/my-clients.js` from scratch. Add nav entry to `/js/navigation.js` (consultants only, role-gated).

### `add-client-wizard.html` (Epic C, 5/21 pts)

**Modal injected into my-clients.html DOM**. No standalone page or route. 2-step flow:
- **Step 1**: Company name + optional website → click `[✨ Search & Auto-Fill]`
- **AI enrichment**: `POST /api/consultant/clients/enrich` (NEW, extends aiOKRService)
- **Step 2**: Review/edit AI-filled fields (industry, size, founded, HQ, revenue, description, signals, SSI focus, suggested template, suggested primary contact) + add stage + send welcome email
- **Submit**: `POST /api/consultant/clients` with merged payload

See [EPIC_C_MY_CLIENTS.md §5–§6](../../SPRINT-22-Beta_Final/epics/EPIC_C_MY_CLIENTS.md) for full spec.

### `objective-wizard.html` (Epic E, 10 pts)

**Mirrors live `client/pages/objective-wizard.html`**. Layout, step indicator, nav, button row preserved verbatim. Per-screen content fields change:
- Screen 1: Title + Category radio + SSI Impact area + Sub-dimension dropdowns
- Screen 2: Behavior/Discipline selector grouped by 4 foundations (9 disciplines from `server/config/disciplines.js`)
- Screen 3: AI KR generation + manual fallback + edit/confirm; saves KRs to NEW `KeyResult` collection (separate model per Epic A)

### `planning.html` (Epic H → G, 5 pts)

**Design delta spec** (not a runnable page) for `client/pages/planning-v2.html`. KEEP nav, page header, Q tabs, objectives row, two-panel layout, all CRUD modals. CHANGE: 4 weeks → 12-13 weeks, monthly grouping (collapsible), AI presets (4/8/12 week generation).

### `assessment-hub.html` (Epic D, 8 pts)

**Design delta spec** for `client/pages/assessment-hub.html` (3,480 live lines). KEEP nav, KPI row, Tabs 1-3 (Assigned/Templates/Sent), all existing flows. ADD: Tab 4 (All Results), Tab 5 (Trends), Tab 6 (Compare). Plus sub-dimension model on `Assessment.ssi_result.sub_dimensions`.

### `dashboard-v3.html` (Epic G, 5 pts)

**Full redesign** — implementation = update `client/pages/dashboard-v2.html` in place to V3 layout (preserves URL + `dashboard-v2.js` binding). Production `<nav>` and `<script src="/js/navigation.js">` are **locked verbatim** — V3 mockup contains both at the top of `<body>` and bottom of `<body>` respectively. Theme alias `--karvia-primary: var(--s22-navy);` lands as part of this epic.

---

## What Stays vs. What Changes (project-wide)

**STAYS UNCHANGED in every Sprint 22 surface**:
- Production navigation component (`/js/navigation.js`)
- Authentication flow (`karvia_auth_token` in localStorage)
- Multi-tenant filter (`req.user.company_id`)
- Soft-delete pattern (`status='cancelled'`)
- All currently-live pages outside the 6 surfaces above

**CHANGES delivered by Sprint 22**:
- 1 new page (my-clients.html)
- 1 new modal (add-client-wizard, lives inside my-clients.html)
- 3 modified pages (dashboard-v2.html, planning-v2.html, assessment-hub.html, objective-wizard.html)
- 4 new backend models (KeyResult, WeeklyGoal, Move, disciplines config)
- 2 service extensions (AIContextService, aiOKRService — extend, do not replace)
- 1 new API endpoint (`POST /api/consultant/clients/enrich`)
- s22 token block added to `s13-patterns.css`
- `--karvia-primary` aliased to `--s22-navy` (one-line change)

---

## Verification

```bash
# Verify no Purple leaks
grep -cE "#7C3AED|#A78BFA|#5B21B6|#F5F3FF|#8B5CF6|#EDE9FE" \
    KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-22/*.html
# Expected: 0 for every file

# Verify production nav present in every mockup
grep -l 'id="main-navigation"' \
    KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-22/*.html
# Expected: my-clients.html, dashboard-v3.html, objective-wizard.html
# (assessment-hub.html and planning.html are delta specs — they document
# the live page nav, not embed it)
```

---

## Next Step

Run `/coding` to begin implementation. Recommended start: Epic A (data models) since it's the dependency for Epic E (Objective Wizard) and Epic C (My Clients KR fields).

```
Order:    Epic A → Epic B → Epic F →
          [Epic C → Epic E → Epic H/G → Epic D → Epic G dashboard]
```

---

**Created by**: Strategy Session #169
**Cleaned by**: Design Session #174 (April 28, 2026)
**Mockup count**: 6 (was 5 + 1 legacy removed + 2 new = 6)
