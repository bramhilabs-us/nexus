---
id: nexus.design-language
title: Nexus Design Language — BRAMHI brand applied
tier: T1
status: active
owner: founder
updated: 2026-06-09
summary: >
  How the BRAMHI Labs brand guide (brand/ assets) becomes Nexus's minimalistic
  UI: palette, typography, component rules, and the token-first workflow that
  prevents Karvia's drifting-hex problem. Resolves PQ-3.
parents:
  - NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md
children:
  - client/README.md
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

## Token-first workflow

Karvia's mockups referenced `--s22-navy` weeks before the token existed; authors hardcoded fallback hex values and the canonical navy drifted across pages. The Nexus rule:

1. **Step 1 of any visual work**: define/extend tokens in `client/css/tokens.css` — palette (sampled from the brand guide PNG at build time, named semantically: `--nx-primary`, `--nx-primary-soft`, `--nx-ink`, `--nx-surface`, `--nx-accent-gradient`…), type scale, spacing scale, radii.
2. Mockups and pages consume `var(--token)` only. One-off inline hex is a review-blocking violation except in throwaway stakeholder pitches.
3. Exact hex/scale values are extracted from the brand assets during the Night 3 token session and recorded here in a table — until then this doc governs *how* values are introduced, which is the part that prevents drift.

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

## What this resolves

PQ-3 (PRODUCT_STRATEGY) is resolved: the design source exists in-repo. Page-level specs (per-page mockups) are produced during Night 3 *from* these rules — they do not block earlier sessions.
