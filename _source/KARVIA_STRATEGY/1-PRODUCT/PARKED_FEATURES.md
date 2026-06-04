# Parked Features — Preserved-But-Quiet Inventory

<!-- @GENOME T2-PRD-PARKED-001 | DRAFT | 2026-05-27 | parent:T1-PRD-002 | auto:- | linked:/strategy -->

**Status**: DRAFT — created 2026-05-27 /strategy session
**Purpose**: Track features that exist in code but are intentionally de-emphasized or hidden, with future-trigger criteria for revival. Per additive principle (no deletion), these features remain in the codebase for measured retirement OR strategic revival.

---

## Why this doc exists

Per user direction 2026-05-27: *"let's not delete anything so that way we are reducing the risk. So we're just introducing a new way of generating objectives... It's not sure the category coverage option featured, so let the category coverage widget be there and... but not evidently show it for now because we are focusing on the consultant. And let's document this somewhere, like, later in future if we want to add it. It should be added."*

This doc is the single source of truth for "features that exist but aren't promoted right now."

---

## Parked features inventory

### 1. Category Coverage Widget

**Surface**: [client/pages/objectives.html:151-216](../../client/pages/objectives.html#L151-L216) — slim 6-tile coverage strip with "0/6 covered" header + amber "fill the gaps" recommendation banner

**Status**: PARKED 2026-05-27 — visually de-emphasized but not removed

**Original intent (Sprint 7 A4 + Sprint A20260512-12)**: nudge BO toward "coverage" across 6 MECE categories (Growth, Customer Success, Operations, People & Culture, Innovation, Financial Health). Assumed mental model: company tracks objectives across all 6 buckets.

**Why parked**: strategic shift 2026-05-27 — focus is "individual objectives created by BO/consultant/manager", not coverage-matrix completion. Coverage widget pushes filler objectives in categories the BO doesn't care about right now.

**De-emphasis approach** (S27 Workstream E item A20260527-05):
- Visually demote: smaller, collapsed-by-default, possibly behind a "Show coverage view" toggle
- Remove the amber gap-recommendation banner (#categoryGapRecommendations) from default render
- Keep the underlying `updateCategoryCoverage()` function intact so revival is one toggle away
- `categoryBalanceWarning` in Manual modal: also de-emphasized (smaller, less prominent styling)

**What stays untouched**:
- `objective.category` field on Objective model (required, used for icons + theming + quarterly review)
- `server/config/categories.js` canonical MECE 6-bucket list
- `CategoryIcons` rendering on objective cards
- `byCategory` aggregation in `outcome-capture.js` (used by quarterly review — analytical, not prescriptive)

**Future revival trigger** (when to bring it back):
- If consultant view shifts toward portfolio-level oversight where coverage IS the right framing
- If post-Beta user research shows BOs want a coverage view (opt-in, not default)
- If a future "Company Health Dashboard" feature is built that uses coverage as one of multiple lenses

**Revival cost**: ~5 min — flip de-emphasis CSS rules + restore default-visible state.

---

### 2. Bulk OKR Generation from Assessment (Door #5)

**Surface**: "Generate OKRs" button on [client/pages/team-ssi-view.html](../../client/pages/team-ssi-view.html) calling [`/api/ai-okr/generate-from-company`](../../server/routes/ai-okr.js#L1316)

**Status**: PARKED 2026-05-27 — visually de-emphasized; canonical NextStep CTA on same page now primary

**Original intent**: post-assessment one-shot generation of full objective set across all weak areas. Worked under "coverage" mental model.

**Why parked**: redundant with the S26 NextStep CTA at [team-ssi-view.js:233-243](../../client/pages/scripts/team-ssi-view.js#L233-L243) which routes BO/EXEC to the canonical wizard (`/pages/objective-wizard.html`). Two competing CTAs on the same page confused users.

**De-emphasis approach** (S27 Workstream E item A20260527-06):
- Make button smaller, less prominent (secondary styling, possibly behind "More options" disclosure)
- Add tooltip distinguishing it from the canonical NextStep CTA
- Leave route, API, prompt logic untouched

**What stays untouched**:
- `/api/ai-okr/generate-from-company` route (functional, just unpromoted)
- `Company.okr_generation.generated` one-time flag (still set when bulk fires; no longer gates per-objective creation via canonical wizard per Q-W3 resolution 2026-05-27)
- `ai-okr.js:1443-1457` Sprint 15-A Epic B2 coverage-gap analysis (only consumed by this endpoint; dies if/when route retired post-Beta)

**Future revival trigger**:
- If enterprise customers request bulk-generation tool for ops efficiency
- If a consultant-facing bulk-generation surface is built (different UI, same engine)
- If user research shows the "guided one-shot" experience generates higher activation than per-objective

**Revival cost**: ~10 min — flip button styling back to primary.

---

### 3. Industry-Template OKR Wizard (Door #4)

**Surface**: [client/pages/okr-creation-wizard.html](../../client/pages/okr-creation-wizard.html) + [okr-creation-wizard.js](../../client/pages/scripts/okr-creation-wizard.js) — 4-step wizard with 12 hardcoded industry templates

**Status**: PARKED 2026-05-27 — orphaned (only entry is nav link at [executive-dashboard.html:91](../../client/pages/executive-dashboard.html#L91))

**Original intent**: pre-AI-era industry-template-driven OKR creation. Predates the canonical objective-wizard.

**Why parked**: hardcoded client-side templates, no backend save path observed, doesn't fit individual-objective model.

**Approach** (no S27 Workstream E action — leave as-is, measure post-Beta):
- Nav link remains in executive-dashboard.html
- Files remain in place
- No promotion, no demotion (already invisible to most users)

**Future revival trigger**:
- If enterprise/franchise customers want industry-templated starter packs
- If product expands to industry verticals with strong template fit

**Retirement trigger**: post-Beta usage measurement — if zero/near-zero clicks over 30 days, archive files.

---

### 4. Inline Single-Objective AI Endpoint (Door #6)

**Surface**: [`/api/ai-okr/generate-single-objective`](../../server/routes/ai-okr.js#L2562) called from [objectives.html:1545](../../client/pages/objectives.html#L1545)

**Status**: PARKED 2026-05-27 — caller chain unclear, redundant with `/api/objective-wizard/*`

**Approach** (no S27 Workstream E action — measure post-Beta):
- Route remains
- UI caller remains

**Future trigger**: post-Beta grep confirms caller chain; retire if redundant.

---

## How to add a parked feature

1. Append a new section to "Parked features inventory" with: Surface, Status, Original intent, Why parked, De-emphasis approach, What stays untouched, Future revival trigger, Revival cost.
2. Update the related sprint plan or audit tracker to reference this doc.
3. Update `MEMORY.md` if the parking decision reflects a recurring pattern.

---

## How to revive a parked feature

1. Confirm trigger condition met (user research, customer request, strategic shift).
2. Locate the de-emphasis change (CSS/styling rule) in the corresponding sprint commit.
3. Revert the de-emphasis surgically; do NOT re-add removed surfaces (this doc tracks what was preserved, not what was removed).
4. Add an entry in the relevant sprint handoff documenting revival.

---

## Sign-off

Created 2026-05-27 to encode the additive-no-deletion principle for the post-Sprint-26 phase. Per user: *"let's let's let's standardize all these at least documentation across so that, you know, we don't get confused in the future."*

**Parent**: T1-PRD-002 (Product roadmap)
**Linked to**: `/strategy` command (future revival decisions surface here)
