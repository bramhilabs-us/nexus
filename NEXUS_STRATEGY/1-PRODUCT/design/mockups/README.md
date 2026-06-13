---
id: nexus.mockups
title: Page mockups — the Night 3 build spec
tier: T1
status: draft
owner: agent
updated: 2026-06-13
summary: >
  Static token-first HTML mockups of the six pages (+ shell, player card,
  assessment flashcard deck), on the NEXUS product brand (C-013): Sora/Manrope,
  dark sidebar shell, loop stage colors. The external-audit v3 refinement adds
  hierarchy-led pulse, decision, journey, task-focus, and fit-summary
  compositions while preserving each PRODUCT_STRATEGY page contract.
parents:
  - NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md
  - NEXUS_STRATEGY/1-PRODUCT/design/EXTERNAL_DESIGN_AUDIT_2026-06-13.md
children: []
revisit:
  - on: "founder review feedback lands, or a page contract changes"
    stage: N3
---

# Page mockups — the Night 3 build spec

The implemented premium-refinement rationale and page-by-page change record is
in [../EXTERNAL_DESIGN_AUDIT_2026-06-13.md](../EXTERNAL_DESIGN_AUDIT_2026-06-13.md).

Open any `.html` file directly in a browser (tokens load via relative path to `client/css/tokens.css`; fonts from Google Fonts).

| File | Page (mode) | Status |
|---|---|---|
| `shell.css` | Shared shell plus v3 hierarchy system: quiet/raised/spotlight surfaces, pulse, loop rail, decisions, journey, task focus, fit summary, responsive and reduced-motion rules | external audit · v3 |
| `my-clients.html` | My Clients — portfolio pulse and executive client dossiers ordered by next meaningful move | external audit · v3 |
| `dashboard.html` | Dashboard — dominant program pulse, ranked decisions, objectives as supporting evidence | external audit · v3 |
| `objectives.html` | Objectives — Next Best Move spotlight, quiet lifecycle context, reduced header-action competition | external audit · v3 |
| `assessments.html` | Assessments — AIR pulse, guided sprint journey, distinct scored-result handoff | external audit · v3 |
| `assessment-flashcards.html` | Taker deck — ambient stage, stronger question hierarchy, branded answer feedback and completion signature | external audit · v3 |
| `teams.html` | Teams — participation pulse, human presence, visible ownership gaps | external audit · v3 |
| `planning.html` | Planning — next best task before milestone reporting, compact context strip, calm task rows | external audit · v3 |
| `dashboard-builder.html` | Builder dashboard — same refined hierarchy after handover; product program owns the loop | external audit · v3 |
| `profile.html` | Profile — transparent fit interpretation plus grouped, provenance-marked signals | external audit · v3 |

**Rules enforced here**: every page = its PRODUCT_STRATEGY contract (one dominant CTA, ≤4 tiles, empty state teaches the purpose); colors/type/space only via `var(--nx-*)` — `grep -rE '#[0-9a-fA-F]{3,6}' mockups/` must return nothing; fonts per DESIGN_LANGUAGE § Token table v2 (**Manrope** UI; **Sora** only in display moments — page titles, empty-state headlines, flashcard questions; never parent-tier fonts in chrome). Stage badges read the constitution §4 names (Prospect · Measuring · Aligning · Transforming · Evolving); objective lifecycle badges (Identified · Handed off · Sustained) are a different state machine and have their own classes. Mode flips edit nav rows, never invent a second shell. Each mockup also shows its empty state below a dashed `mock-note` separator — mockup convention, not a product surface.

**Stage-weather scan (2026-06-13, founder-directed quick scan)**: the page set was walked against the full stage matrix (PRODUCT_STRATEGY § the stage dimension) — **the structure holds at all 5 stages for all 4 archetypes**; stage transitions are data/state changes inside existing slots (per-card stage on My Clients; empty states as pre-stage weather; deck variants on Assessments). Structural debts found and logged: rules-surface slot + instrumentation quest line (BACKLOG N1-P3-10), stage-keyed CTA/section declarations + Teams' matrix-import empty state (folded into N1-P4-01's DoD).

**The founder-review iteration (2026-06-13, in-session)** added the system now visible on every surface: the real lockup (`brand/NEXUSLOGO_on-dark.png`; icon + primary variants alongside) heads the sidebar and the lotus icon anchors empty states; outline **nav icons** per page; the **identity block** (name + archetype) at the sidebar bottom — each mockup is one archetype's coherent view (My Clients/Assessments → Sam Rivera · Consultant; Dashboard/Teams → Anika Rao · Business Owner; Objectives → Maya Krishnan · Manager; Planning/Profile → Jonah Mensah · Worker; Builder dashboard → Lena Chen · Manager), with archetype home pages greeting their player by name; information renders as **cards and data visuals, never text stacks** (action cards = the three-things rule; ring-led objective cards; hero tiles with score rings) while Planning's tasks stay a calm row list by component doctrine; Objectives carries the **focus hint** (team-altitude NBM — kicker, why, confidence chip per Article 13).
