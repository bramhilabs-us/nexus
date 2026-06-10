---
id: nexus.mockups
title: Page mockups — the Night 3 build spec
tier: T1
status: draft
owner: agent
updated: 2026-06-10
summary: >
  Static token-first HTML mockups of the six pages (+ shell, player card,
  assessment flashcard deck). Each implements its PRODUCT_STRATEGY page
  contract exactly; all color/type/space via var(--nx-*) from
  client/css/tokens.css — zero inline hex. Founder review checkpoint;
  feedback feeds N1-P4-01 contracts and becomes the Night 3 build spec.
parents:
  - NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md
children: []
revisit:
  - on: "founder review feedback lands, or a page contract changes"
    stage: N3
---

# Page mockups — the Night 3 build spec

Open any `.html` file directly in a browser (tokens load via relative path to `client/css/tokens.css`; fonts from Google Fonts).

| File | Page (mode) | Status |
|---|---|---|
| `shell.css` | Shared shell: topbar, nav, account dropdown (5 secondary surfaces), tiles, cards, stage badge/ribbon, score ring, CTA pair, empty state | session 1 |
| `my-clients.html` | My Clients (Engagement) — pipeline cards, prospect inline CTA, triage tiles, empty state | session 1 |
| `dashboard.html` | Dashboard (Engagement) — pulse tiles, needs-you-today, objectives ribbons, setup empty state | session 1 |
| *objectives, assessments (+ flashcard deck, PQ-4), teams, planning, Builder variants, Profile player card* | — | sessions 2–3 |

**Rules enforced here**: every page = its PRODUCT_STRATEGY contract (one dominant CTA, ≤4 tiles, empty state teaches the purpose); colors/type/space only via `var(--nx-*)` — `grep -rE '#[0-9a-fA-F]{3,6}' mockups/` must return nothing; fonts per DESIGN_LANGUAGE § Token table (Inter UI; Playfair Display only in the empty-state display moment; never Cinzel/Cormorant in chrome). Each mockup also shows its empty state below a dashed `mock-note` separator — mockup convention, not a product surface.
