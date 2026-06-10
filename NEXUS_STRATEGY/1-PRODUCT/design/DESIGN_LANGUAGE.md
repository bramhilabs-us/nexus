---
id: nexus.design-language
title: Nexus Design Language — BRAMHI brand applied
tier: T1
status: active
owner: founder
updated: 2026-06-10
summary: >
  How the BRAMHI Labs brand guide (brand/ assets) becomes Nexus's minimalistic
  UI: palette, typography, component rules, the token-first workflow that
  prevents Karvia's drifting-hex problem, and the extracted token table
  (N1-P2-07). Resolves PQ-3.
parents:
  - NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md
children:
  - client/README.md
  - NEXUS_STRATEGY/1-PRODUCT/design/mockups/README.md
revisit:
  - on: "the BRAMHI brand guide is updated, or page-level design specs are added"
    stage: N3
---

# Nexus Design Language — BRAMHI brand applied

## Purpose

Translate the BRAMHI Labs brand guide ([brand/Brand Guide Bramhi.png](brand/Brand%20Guide%20Bramhi.png), [brand/BRAMHI_LABS_full_logo.svg](brand/BRAMHI_LABS_full_logo.svg)) into rules the Night 3 UI build can execute. This is the design source of truth for Nexus; page behavior stays in [PRODUCT_STRATEGY.md](../PRODUCT_STRATEGY.md).

## TL;DR

- **Brand**: BRAMHI Labs — lotus mark, "nurturing consciousness." Personality keywords: mindful, balanced, wise, transcendent. Nexus's executive surfaces must feel calm and certain — the UI equivalent of "we sell certainty."
- **Palette**: BRAMHI purple/lavender family on warm neutrals. Deep purple for primary actions and emphasis; lavender tints for fills, states, and gradients; near-black ink for text; generous white space.
- **Typography**: serif display for brand/headline moments (Cinzel / Playfair Display per the guide), **Inter for all product UI** (body, tiles, tables, CTAs). Cormorant Garamond italic only for brand taglines — never in app chrome.
- **Minimalism is enforced, not aspired to**: one dominant primary CTA per page, ≤4 analytics tiles, whitespace over borders, no decoration that doesn't change a decision.
- **Tokens before mockups, always** (Karvia lesson #174-3): every color/space/type value is a CSS custom property defined once; no inline hex in pages or mockups.

## Reference visuals — what "classy, minimalistic" means here

Two BRAMHI investor decks are the **feel** references, preserved in [references/](references/) (`bramhi-consciousness-ecosystem-v3.html`, `bramhi-intro-v1.html`). Concrete cues extracted from their CSS — the starting point for the Night-1 token session:

- **Surfaces**: near-white gradient page background (`#f8fafc → #f5f3ff → #f8fafc`), pure-white panels, soft purple-tinted shadows (`rgba(118,75,162,0.06)`), hairline borders (`#e2e8f0`), 8px radius — depth from light, never from heavy borders.
- **Color**: the purple family as accent (`#764ba2`, `#5c3a7e`, indigo `#667eea`), **gold sparingly** (`#bd8e2d` — emphasis, never decoration), teal (`#229d83`) for positive signal.
- **Text**: three-step slate hierarchy (`#2d3748` primary / `#64748b` secondary / `#94a3b8` tertiary) — hierarchy by tone, not by size inflation.
- **Type note**: decks use Comfortaa; the brand guide says Cinzel/Playfair display + Inter body. **Resolved in N1-P2-07** (§ Token table): brand-guide fonts for product UI; the decks govern *spacing, surface, and restraint*, not typeface.

## Token-first workflow

Karvia's mockups referenced `--s22-navy` weeks before the token existed; authors hardcoded fallback hex values and the canonical navy drifted across pages. The Nexus rule:

1. **Step 1 of any visual work**: define/extend tokens in `client/css/tokens.css` — palette (sampled from the brand guide PNG at build time, named semantically: `--nx-primary`, `--nx-primary-soft`, `--nx-ink`, `--nx-surface`, `--nx-accent-gradient`…), type scale, spacing scale, radii.
2. Mockups and pages consume `var(--token)` only. One-off inline hex is a review-blocking violation except in throwaway stakeholder pitches.
3. Exact hex/scale values were extracted from the brand assets in the N1-P2-07 token session (pulled forward from Night 3 per Path B) and recorded in the table below. `client/css/tokens.css` is the executable form; this table is its governed mirror — change them together.

## Token table (extracted 2026-06-09, N1-P2-07)

Source legend: **BG** = Brandguide PNG declared hex (source of truth for brand color), **deck** = reference-deck CSS cue (governs surfaces, shadows, restraint).

| Token | Value | Source | Use |
|---|---|---|---|
| `--nx-primary` | `#6B4BA3` | BG primary | Primary actions, emphasis |
| `--nx-primary-soft` | `#9D8CC6` | BG primary | Secondary emphasis, gradient end |
| `--nx-primary-tint` | `#DCC5E8` | BG accent | Badge/border tints, hover fills |
| `--nx-primary-faint` | `#F3E8FF` | BG accent | Selected states, soft fills |
| `--nx-ink` | `#1A1A1A` | BG neutral | Display headlines only |
| `--nx-text` / `-secondary` / `-tertiary` | `#2D3748` / `#64748B` / `#94A3B8` | deck | Three-step slate text hierarchy |
| `--nx-gray` / `--nx-gray-light` | `#6F6F6F` / `#E6E6E6` | BG neutral | Icons + disabled / dividers |
| `--nx-sand` / `--nx-cream` | `#C9B59A` / `#EDE7DF` | BG accent | Warm accents — illustration, empty states; never text |
| `--nx-gold` | `#BD8E2D` | deck | Emphasis, sparingly — never decoration |
| `--nx-positive` | `#229D83` | deck | Positive signal (decks also use `#19AC86`; this one is canonical) |
| `--nx-surface` / `--nx-border` | `#FFFFFF` / `#E2E8F0` | deck | White panels, hairline borders |
| `--nx-surface-page` | `#F8FAFC → #F5F3FF → #F8FAFC` | deck | Near-white gradient page background |
| `--nx-shadow-card` | `rgba(107,75,163,0.06)` | deck recipe on BG primary | Purple-tinted depth — never heavy borders |
| `--nx-gradient-primary` | `#6B4BA3 → #9D8CC6` | BG gradient | Stage ribbons, primary gradient moments |
| `--nx-gradient-soft` | `#EADBF6 → #F7F3FF` | BG gradient | Soft fills, ribbon backgrounds |
| Type scale | 12 / 14 / 16 / 18 / 22 / 28 / 36 px | — | `--nx-text-xs … 3xl`; weights 400/500/600 |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px | — | `--nx-space-1 … 16`, 4px base |
| Radii | 4 / **8** / 12 / pill | deck (8px) + BG (pill CTA) | `--nx-radius-*`; 8px is the default |

**Type question resolved (Comfortaa vs brand fonts)**: the Brandguide explicitly declares Cinzel (logo), Playfair Display (headings), Inter (body), Cormorant Garamond italic (taglines); Comfortaa appears only in the decks. Product UI is **Inter** (`--nx-font-ui`); **Playfair Display** for rare display moments; **Cinzel** reserved for brand lockups, never app chrome; **Cormorant Garamond italic** for brand taglines only. Comfortaa is not carried into Nexus.

**Extraction notes (asset drift, recorded so nobody re-derives)**: (1) the Brandguide neutral row prints `#1A1A1A` twice — a typo in the asset; the second swatch samples ≈`#767675`, and the labeled `#6F6F6F` is used as the canonical mid-gray. (2) The decks' purple is `#764BA2`, not the Brandguide primary `#6B4BA3`; the Brandguide wins for color, and the deck purple survives only as the shadow-tint recipe recomputed on the brand primary.

## Component set (the lego constraint, visually)

One small set shared by all six pages — adding a component requires updating this doc first:

| Component | Used for | Brand notes |
|---|---|---|
| **Tile** | Analytics strips (≤4/page) | Number-first, label small-caps Inter; tap target = drill-down |
| **Card** | Client cards, objective cards | Soft lavender border-tint or shadow, never both; stage badge top-right |
| **Stage ribbon** | Objective lifecycle, pipeline stages | Gradient progression in the purple family (guide's gradient swatches) |
| **CTA pair** | Primary + secondary per page contract | Primary: filled deep purple, pill (per guide buttons); secondary: quiet outline/text |
| **Empty state** | First-time teaching | Lotus-adjacent calm illustration, one sentence, one CTA |
| **Score ring** | Assessment scores on cards | Dimension color mapping defined by the assessment block, ring style defined here |
| **Flashcard** | Assessment question delivery (never survey forms — PRODUCT_STRATEGY § delivery experience) | One question per card; flip/advance rhythm; calm, single-focus layout; the "why this assessment" intro card opens every deck |

## What this resolves

PQ-3 (PRODUCT_STRATEGY) is resolved: the design source exists in-repo. Page-level specs (per-page mockups) are produced during Night 3 *from* these rules — they do not block earlier sessions.
