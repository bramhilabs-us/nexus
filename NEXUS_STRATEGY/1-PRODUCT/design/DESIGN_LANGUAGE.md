---
id: nexus.design-language
title: Nexus Design Language — the two-tier brand applied
tier: T1
status: active
owner: founder
updated: 2026-06-13
summary: >
  How the two-tier brand (C-013) becomes Nexus's minimalistic UI: BRAMHI Labs
  is the parent tier (collateral only); NEXUS is the product tier — Sora +
  Manrope, Intelligence Blue on calm surfaces, the dark sidebar shell. Palette,
  typography, component rules, the token-first workflow that prevents Karvia's
  drifting-hex problem, and the v2 token table re-extracted from the NEXUS
  brand guide (N1-P3-09). Resolves PQ-3.
parents:
  - NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md
children:
  - client/README.md
  - NEXUS_STRATEGY/1-PRODUCT/design/mockups/README.md
  - NEXUS_STRATEGY/1-PRODUCT/design/README.md
  - NEXUS_STRATEGY/1-PRODUCT/design/EXTERNAL_DESIGN_AUDIT_2026-06-13.md
revisit:
  - on: "either brand guide is updated, or page-level design specs are added"
    stage: N3
---

# Nexus Design Language — the two-tier brand applied

## Purpose

Translate the NEXUS product brand guide ([brand/NEXUS_BRANDGUIDE.png](brand/NEXUS_BRANDGUIDE.png), [brand/NEXUS_LoopwithBrandGAuide.png](brand/NEXUS_LoopwithBrandGAuide.png)) into rules the Night 3 UI build can execute. This is the design source of truth for Nexus; page behavior stays in [PRODUCT_STRATEGY.md](../PRODUCT_STRATEGY.md).

## The two-tier brand (C-013)

| Tier | Brand | Voice & assets | Where it appears |
|---|---|---|---|
| **Parent** | **BRAMHI Labs** — lotus mark, "nurturing consciousness" | Cinzel (logo) / Playfair Display (headings) / Inter (body), purple-lavender family ([brand/BRAMHI_V1_BRANDGUIDE.png](brand/BRAMHI_V1_BRANDGUIDE.png), [brand/BRAMHI_LABS_full_logo.svg](brand/BRAMHI_LABS_full_logo.svg)) | Consulting collateral, whitepapers, investor decks — never product surfaces |
| **Product** | **NEXUS by BRAMHI** — lotus-derived logo system, "Measure. Align. Transform. Evolve." | Sora (display) / Manrope (UI) / Cormorant Garamond italic (taglines), Intelligence Blue + the loop palette | ALL product surfaces: every page, mockup, email, and in-app moment |

**The hard rule**: parent-tier fonts or colors in product chrome are a review-blocking violation, exactly like inline hex. The parent tier deliberately has no tokens in `client/css/tokens.css` — if you need Cinzel or BRAMHI purple-lavender in a product surface, the answer is no (Consciousness Purple `--nx-purple` is the one sanctioned bridge: gradient start and brand moments, by token only).

## TL;DR

- **Personality** (NEXUS guide): intelligent, calm, certain — "the AI Transformation Operating System." Executive surfaces must feel like "we sell certainty"; taker surfaces must feel light (PQ-4 flashcards, not forms).
- **Palette**: Intelligence Blue `#7287F2` is the product primary; Deep Text `#2C3446` anchors text and the sidebar; Surface `#F7F7FB` keeps pages calm; Growth Green and Human Warmth are signal accents — the loop's verb colors, never decoration.
- **Typography**: **Sora** for display/headline moments, **Manrope** for all product UI, **Cormorant Garamond italic** only for brand signature moments — never in app chrome.
- **Layout**: the **dark sidebar shell** (guide § application examples) on every product surface — logo top, icon+label nav, primary-pill active state, account at the bottom; content on the Surface page background.
- **Minimalism is enforced, not aspired to**: one dominant primary CTA per page, ≤4 analytics tiles, whitespace over borders, no decoration that doesn't change a decision.
- **Tokens before mockups, always** (Karvia lesson #174-3): every color/space/type value is a CSS custom property defined once; no inline hex in pages or mockups.

## External-audit refinement — hierarchy makes the product feel premium

The June 13, 2026 external design audit found that the brand direction was
coherent but the application grammar gave too many white rectangles equal
visual weight. The implemented v3 mockups preserve all C-013 rules and add a
binding three-level hierarchy:

1. **Orientation** — one dominant pulse, recommendation, result, or task that
   tells the player where they are.
2. **Decision** — the single next action, ranked when several candidates exist.
3. **Evidence** — metrics, cards, rows, and provenance that support the decision
   without competing with it.

The operating loop is now an application signature: a restrained stage rail and
rare gradient moments tied to Measure, Align, Transform, and Evolve. It is never
used as ambient decoration across ordinary cards. Full rationale and the
page-by-page implementation record:
[EXTERNAL_DESIGN_AUDIT_2026-06-13.md](EXTERNAL_DESIGN_AUDIT_2026-06-13.md).

## Structural grammar adopted from the audit — we own the content

The audit's value is **structure**, and structure is what Nexus adopts as canon.
**Copy is not.** The dividing line, stated once and binding:

> **Adopt the slot; write the words ourselves.** A composition's structure —
> what occupies orientation/decision/evidence, how it collapses, how it moves —
> is binding for the Night 3 build. The *words inside it* are a product decision,
> owned by PRODUCT_STRATEGY, the constitution, and the page contracts (rules
> surface, NBM grammar, stage names per §4), never by the auditor.

The auditor's example copy — taglines (*"Measure honestly. Transform
deliberately."*), the *"How Nexus sees your fit"* framing, pulse headlines, and
recommendation wording in the v3 mockups — is **illustrative placeholder**. It
demonstrates the slot; it is not approved product copy. Treat any string in the
mockups as a lorem-stand-in unless it traces to a governed source.

### The structural rules now canon (beyond the three levels above)

1. **One focal composition per page.** Every executive/workflow page leads with a
   single memorable composition; everything else is subordinate evidence. The
   focal map (binding — a page changing its focal slot updates this row first):

   | Page | Focal composition |
   |---|---|
   | Dashboard / Builder dashboard | Program pulse (the highest-leverage decision is the only dominant action) |
   | My Clients | Portfolio AIR pulse → client dossiers ordered by next meaningful move |
   | Objectives | Next Best Move (the focus hint, Article-13 grammar) |
   | Assessments | Sprint pulse + the guided journey; scored result is a distinct handoff |
   | Teams | Participation pulse + the explicit alignment gap |
   | Planning | Next Best Task (before any reporting metric) |
   | Profile | Fit interpretation (transparent, provenance kept) |
   | Flashcards | The question itself |

2. **Surface hierarchy — three tiers + the teaching empty state.** Not every white
   rectangle is equal (the audit's core finding): **quiet panel** (hairline, no
   elevation — supporting evidence), **interactive card** (restrained elevation —
   things you act on), **spotlight** (stronger composition + depth — the one focal
   moment), and the **dashed teaching surface** for empty states (never another
   elevated card). This supersedes the older "hairline *or* soft shadow" card note
   as the page-level rule: elevation now signals *role*, not taste.

3. **Motion doctrine.** Three tiers — `120ms` (feedback), `180ms` (selection/
   state), `240ms` (depth/spotlight). Motion is allowed only for feedback,
   selection, and depth — never ambient drift. `prefers-reduced-motion` is
   honored. (This corrects the earlier "responsive/motion lands N3" deferral —
   the grammar is decided now; only the production-component build is N3.)

4. **Responsive doctrine.** Breakpoints at large-tablet / compact-tablet / mobile;
   the sidebar collapses to a compact horizontal nav (same rows, same active
   grammar — never a second shell); grids, decision rows, task metadata,
   flashcards, and context strips collapse **deliberately**, not by accidental
   wrap.

### Token-promotion path (the one debt this leaves)

The audit kept its derived interaction tones, raised/spotlight shadows, and motion
timings **local to `mockups/shell.css`** because its scope was the design folder
only — the production `client/css/tokens.css` was intentionally untouched. So the
N3 component build's **step 1** is to graduate the `--nx-audit-*` set into
governed `--nx-*` tokens (they are already `color-mix()` on declared tokens, so
this is a rename + a row in the Token table v2, not a re-derivation). The
no-local-derivation rule (token-first workflow below) applies to the production
build; the mockups' local block is the sanctioned exception while they remain
mockups.

## Token-first workflow

Karvia's mockups referenced `--s22-navy` weeks before the token existed; authors hardcoded fallback hex values and the canonical navy drifted across pages. The Nexus rule:

1. **Step 1 of any visual work**: define/extend tokens in `client/css/tokens.css` — palette (the guide's declared hex, named semantically), type scale, spacing scale, radii.
2. Mockups and pages consume `var(--token)` only. One-off inline hex is a review-blocking violation except in throwaway stakeholder pitches.
3. `client/css/tokens.css` is the executable form; the table below is its governed mirror — **change them together**.

## Token table v2 (re-extracted 2026-06-13, N1-P3-09 / C-013)

Source legend: **NG** = NEXUS guide declared hex (source of truth), **loop** = the operating-loop poster, **derived** = recorded derivation on a declared color, **v1** = carried from the v1 extraction (the guide doesn't redeclare it).

| Token | Value | Source | Use |
|---|---|---|---|
| `--nx-primary` | `#7287F2` | NG (Intelligence Blue) | Primary actions, emphasis, active states |
| `--nx-purple` | `#5E4DB2` | NG (Consciousness Purple) | Parent-brand accent: gradient start, brand moments only |
| `--nx-positive` | `#A8D5C2` | NG (Growth Green) | Success fills, on-track rings |
| `--nx-gold` | `#C98B62` | NG (Human Warmth) | Warm accent — emphasis, never decoration |
| `--nx-ink` | `#2C3446` | NG (Deep Text) | Headlines, primary text anchor |
| `--nx-primary-soft` / `-tint` / `-faint` | `#9CABF6` / `#C7CFFA` / `#EEF1FD` | derived (30/60/88% white-mix on primary) | Secondary emphasis / badge tints, hovers / selected states, soft fills |
| `--nx-text` / `-secondary` / `-tertiary` | `#2C3446` / `#5A6275` / `#8C93A6` | NG + derived (25/50% white-mix on Deep Text) | Three-step text hierarchy — tone, not size inflation |
| `--nx-gray` / `--nx-gray-light` | `#6F7689` / `#E4E6F0` | derived (Deep Text family) | Icons + disabled / dividers |
| `--nx-cream` | `#F7EDE7` | derived (85% white-mix on Human Warmth) | Risk fills, warm empty states |
| `--nx-positive-deep` / `--nx-gold-deep` | `#3E8E72` / `#A96F47` | derived (legibility) | Positive / warm text and icons on light surfaces |
| `--nx-stage-*` | prospect `#8C93A6` · measure `#7287F2` · align `#5E4DB2` · transform `#A8D5C2` · evolve `#C98B62` | loop (verb colors) + derived neutral | Stage badges and ribbons (constitution §4 names) |
| `--nx-surface` / `--nx-surface-page` / `--nx-border` | `#FFFFFF` / `#F7F7FB` / `#E4E6F0` | NG (Surface) + derived | White panels on the calm flat page; hairline borders |
| `--nx-shadow-card` | `rgba(114,135,242,0.07)` recipe | derived (v1 recipe recomputed on NEXUS primary) | Depth from light — never heavy borders |
| `--nx-gradient-primary` / `-loop` / `-soft` | `#5E4DB2→#7287F2` / `#7287F2→#A8D5C2` / faint | NG (visual-language chips) | Brand moments / loop progression / soft fills |
| `--nx-sidebar-*` | bg `#2C3446` · active pill `#7287F2` · white text alphas · width 232px | NG (application examples) | The sidebar shell, below |
| Type | Sora display · Manrope UI · Cormorant Garamond italic taglines | NG §02 | Weights 400/500/600/700; scale 12–36px (v1) |
| Spacing / radii | 4px base scale · 4/**8**/12/pill | v1 | 8px default radius; pill CTAs |

**Extraction notes v2 (recorded so nobody re-derives)**: (1) The guide PNG is a compressed render — sampled swatch pixels drift from the printed labels; **the declared hex wins** (same precedent as the v1 BRAMHI extraction). Declared set: `#5E4DB2 #7287F2 #A8D5C2 #C98B62 #F7F7FB #2C3446`. (2) C-013's prose says "teal + gold accents"; the guide's declared accents are **Growth Green** (sage, the "teal") and **Human Warmth** (copper, the "gold") — the decision's prose named them loosely, the guide governs. `--nx-gold` keeps its v1 name but now points at Human Warmth; the v1 deck gold `#BD8E2D` is retired. (3) Type scale, spacing, and radii carry from v1 — the guide doesn't redeclare them and the deck-derived restraint cues (the two investor decks preserved in [references/](references/)) still govern spacing, surfaces, and restraint — never typeface or color. (4) The v1 BRAMHI palette (`#6B4BA3` family) is not deleted from history — it moves to the parent tier and lives only in collateral, outside this token file.

## The sidebar shell (guide § application examples)

Every product surface renders inside the same shell — the brand guide's own application example, adopted across all 10 mockups (C-013):

- **Sidebar** (`--nx-sidebar-width`, fixed left): `--nx-sidebar-bg` (Deep Text navy). Top: the NEXUS lockup (white). Middle: icon + label nav, one row per primary surface; the active row is a `--nx-sidebar-active-bg` pill with white text; hover is a soft white-alpha fill. Bottom: the account block (avatar + dropdown: Profile, Company Profile, Configuration, Settings, Feedback).
- **Content area**: `--nx-surface-page` background; the page head (title + the page's one primary CTA) replaces the old topbar; white cards and tiles carry the content.
- **Mode flips stay in the shell**: Builder mode and org-direct remove/replace nav rows (e.g. no My Clients) — they never invent a second shell.
- Mobile: the sidebar collapses to a compact horizontal nav — same rows, same active grammar (the v3 mockups now carry this; see § Responsive doctrine — only the production component build is N3, not the grammar).

## Component set (the lego constraint, visually)

One small set shared by all pages — adding a component requires updating this doc first:

| Component | Used for | Brand notes |
|---|---|---|
| **Sidebar shell** | Global navigation, all surfaces | Dark Deep-Text navy; active = primary pill; the only dark surface in the product |
| **Tile** | Analytics strips (≤4/page) | Number-first, label small-caps Manrope; tap target = drill-down |
| **Card** | Client cards, objective cards | Hairline border-tint or soft shadow, never both; stage badge top-right |
| **Stage ribbon** | Objective lifecycle, pipeline stages | The loop's verb colors via `--nx-stage-*`; badges read **Prospect · Measuring · Aligning · Transforming · Evolving** (constitution §4 — never the dead C-006 names) |
| **CTA pair** | Primary + secondary per page contract | Primary: filled Intelligence Blue, pill; secondary: quiet outline/text |
| **Empty state** | First-time teaching | Calm lotus-adjacent illustration, one sentence, one CTA; Sora for the one display line |
| **Score ring** | Assessment scores on cards | Dimension color mapping defined by the assessment block, ring style defined here |
| **Focus hint** | The team-altitude NBM on Objectives (03 F9) | Gradient-soft banner: kicker + one-sentence why + confidence chip — Article 13 display grammar (recommendation, never a fact) |
| **Flashcard** | Assessment question delivery (never survey forms — PRODUCT_STRATEGY § delivery experience) | One question per card; flip/advance rhythm; calm, single-focus layout; the "why this assessment" intro card opens every deck |
| **Deck progress** | Position within a flashcard deck | Dots, not "Q7/24" counters — progress felt, not dreaded; current dot in primary, done dots in primary-soft |
| **Answer input** | The per-card response control (scale / choice / binary) | Large tap targets, one input family per card; selected state = primary-faint fill + primary border; never radio/checkbox form controls |
| **Tag chip** | Match-grade profile signals (skills, motivations, interests — fit thesis) | Small pill, primary-faint fill; assessment-fed chips carry a source mark; chips are data, never decoration — free-prose never gets a chip |
| **Task row** | Planning task lists ("what do I do today") | Status circle (todo/doing/done) + title + hours est/logged + owner; done = struck title, positive circle; calm list, never a Gantt |
| **Executive pulse** | Dashboard, Clients, Assessments, Teams | One dominant orientation signal plus three quiet supporting metrics; replaces equal-weight analytics-card strips |
| **Decision rail** | Ranked "needs you" actions | Highest downstream-impact move first; one dominant action, quieter alternatives |
| **Loop rail** | Current Measure/Align/Transform/Evolve context | Signature stage context only; active state may use the brand gradient. **Per-program only** — never on a cross-portfolio view (My Clients): one "active" stage is meaningless when the consultant's clients sit in every stage at once. On portfolio pages, stage lives only as the per-client badge (the audit's v3 My Clients loop rail was removed for this reason, founder call 2026-06-13). |
| **Journey** | Assessment sprint progression | Completed, active, and upcoming work in a vertical evidence path |
| **Task focus** | Worker home | The next best task appears before reporting metrics and task inventory |
| **Fit summary** | Profile | Transparent interpretation of routing signals; never hides provenance or replaces editable tags |
| **Dossier head** | Client / team identity | Score or org mark · sponsor · stage · primary signal — the scannable identity row on My Clients/Teams; Prospect shows no empty score ring |
| **Result spotlight** | Scored assessment handoff | The completed AIR result as a distinct composition, visually wired to its "Create objectives" CTA (the deliverable→objectives seam, J1) |
| **Context strip** | Quiet supporting metrics | Lifecycle counts / milestone metrics demoted out of the focal slot into one calm strip — evidence, not orientation |
| **Signal grid** | Profile signals | Grouped, two-column responsive signal layout; assessment-fed groups carry the source mark (replaces the v1 tag-wall) |

## Card grammar — zoom levels (04_RUNTIME_MODEL §5)

Every entity card declares its **zoom levels**, each with fixed fields; a page chooses a
zoom level, never a field mix. A card is never an information dump: anyone glancing at
any zoom level gets that level's complete answer. Same grammar on every viewport —
web-first, mobile-responsive (native apps stay deferred, IMPROVEMENT_PLAN).

| Entity | **Full** (the card's home page) | **Compact** (cross-page reference) | **Line** (lists, roll-ups) |
|---|---|---|---|
| **Objective** | owner · status · objective statement · KRs · lifecycle ribbon | headline · owner · status | headline · status |
| **Client** | company + contact · score rings · objectives summary · pipeline badge · sponsor | company · score ring · pipeline badge | company · badge |
| **Milestone** | title · objective link · tasks done/planned · hours · streak | title · status · due | title · status |

New entities entering the UI add a row here first (the lego constraint applies to
grammar, not just components). Zoom levels are the *information* rule; the Tile/Card
components above are the *visual* rule.

## UX doctrine — friction is the enemy (04_RUNTIME_MODEL)

The founder's runtime principles, binding for every page spec and mockup:

1. **CTA placement is strategy.** One primary CTA visually dominant per page (existing
   rule), placed where the player's eye lands at that stage — the stage-responsive
   contract (PRODUCT_STRATEGY § stage dimension) decides *which* CTA that is per stage.
2. **Reduce friction structurally, then visually.** Pre-seeded content beats empty
   forms (zero-setup first sessions); guided imports beat uploads (the Sponsor's
   matrix); defaults beat configuration. Visual calm is the last 10%, not the fix.
3. **Pages teach the game in place.** The rules surface (page contract field) renders
   the one game rule the page embodies — quiet, dismissible, never a tour or a manual.
4. **Consistency is cross-page trust.** The same entity at the same zoom level renders
   identically everywhere (card grammar above); a player who learns a card once has
   learned it on all six pages.

## Display doctrine — how gauges speak (owners indexed, not forked)

The rules for what a number is allowed to look like are owned elsewhere and bind every
visual spec here: **Article 6 all-five** (number + band + provenance + anchor-pack id +
evidence drill-down) and its extensions, the floors ("insufficient signal" / "running on
old data" — never a confident number), and **the bedside-manner rules** (03_NEXUS_GAME
§6.5: no verdict without a path; the implicated see it first; trend before position;
evidence is dignity; the Steward valve). See PRODUCT_STRATEGY § display doctrine for the
binding list. Visually that means: negative gauges get the same calm surfaces as
positive ones — no red-alert theatrics; `--nx-gold` warmth marks attention, the paired
NBM marks the path.

## What this resolves

PQ-3 (PRODUCT_STRATEGY) is resolved: the design source exists in-repo. C-013 is executed: the two-tier brand is the rule set above, tokens.css v2 is live, and the 10 mockups carry the NEXUS brand + sidebar shell. Page-level specs (per-page mockups) are produced during Night 3 *from* these rules — they do not block earlier sessions.
