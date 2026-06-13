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
  dark sidebar shell, loop stage colors. Each implements its PRODUCT_STRATEGY
  page contract exactly; all color/type/space via var(--nx-*) from
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
| `shell.css` | Shared shell: **dark sidebar** (brand lockup, nav, account dropdown = 5 secondary surfaces), tiles, cards, stage badges (company + objective lifecycle), score ring, CTA pair, empty state, deck surface | session 1 · C-013 re-skin |
| `my-clients.html` | My Clients (Engagement) — pipeline cards, prospect inline CTA, triage tiles, empty state | session 1 · C-013 re-skin |
| `dashboard.html` | Dashboard (Engagement) — pulse tiles, needs-you-today, objectives ribbons, setup empty state | session 1 · C-013 re-skin |
| `objectives.html` | Objectives (Engagement) — lifecycle board: stage tiles, KR cards + ribbons across all 3 stages, assessment-driven empty state | session 2 · C-013 re-skin |
| `assessments.html` | Assessments (Engagement) — pluggable shell: AIR sprint workspace in block slots, score + deliverables → objectives handoff, gallery empty state | session 2 · C-013 re-skin |
| `assessment-flashcards.html` | **PQ-4 exploration** — taker's deck: why-card, scale/choice/binary cards, dot progress, recurring-delta greeting, completion card; alternatives noted for founder. **The one no-sidebar surface**: the accountless taker gets a slim bar, not app chrome | session 2 · C-013 re-skin |
| `teams.html` | Teams (Engagement) — people fabric: invite CTA, participation tiles, team cards with role tags, "objectives need owners" empty state | session 3 · C-013 re-skin |
| `planning.html` | Planning (Worker home) — "what do I do today": current-milestone tiles, task rows (my tasks first), team view, next-milestone draft, empty state | session 3 · C-013 re-skin |
| `dashboard-builder.html` | Dashboard (**Builder mode**) — the mode flip: no My Clients nav row, srishti add-on in dropdown, product program, Sustained KPI rolling | session 3 · C-013 re-skin |
| `profile.html` | Profile (player card) — match-grade tags only (◆ = assessment-fed), role-per-program, fit-thesis note | session 3 · C-013 re-skin |

**Rules enforced here**: every page = its PRODUCT_STRATEGY contract (one dominant CTA, ≤4 tiles, empty state teaches the purpose); colors/type/space only via `var(--nx-*)` — `grep -rE '#[0-9a-fA-F]{3,6}' mockups/` must return nothing; fonts per DESIGN_LANGUAGE § Token table v2 (**Manrope** UI; **Sora** only in display moments — page titles, empty-state headlines, flashcard questions; never parent-tier fonts in chrome). Stage badges read the constitution §4 names (Prospect · Measuring · Aligning · Transforming · Evolving); objective lifecycle badges (Identified · Handed off · Sustained) are a different state machine and have their own classes. Mode flips edit nav rows, never invent a second shell. Each mockup also shows its empty state below a dashed `mock-note` separator — mockup convention, not a product surface.

**The founder-review iteration (2026-06-13, in-session)** added the system now visible on every surface: the real lockup (`brand/NEXUSLOGO_on-dark.png`; icon + primary variants alongside) heads the sidebar and the lotus icon anchors empty states; outline **nav icons** per page; the **identity block** (name + archetype) at the sidebar bottom — each mockup is one archetype's coherent view (My Clients/Assessments → Sam Rivera · Consultant; Dashboard/Teams → Anika Rao · Business Owner; Objectives → Maya Krishnan · Manager; Planning/Profile → Jonah Mensah · Worker; Builder dashboard → Lena Chen · Manager), with archetype home pages greeting their player by name; information renders as **cards and data visuals, never text stacks** (action cards = the three-things rule; ring-led objective cards; hero tiles with score rings) while Planning's tasks stay a calm row list by component doctrine; Objectives carries the **focus hint** (team-altitude NBM — kicker, why, confidence chip per Article 13).
