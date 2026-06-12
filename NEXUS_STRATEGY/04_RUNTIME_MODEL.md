---
id: nexus.runtime-model
title: The Runtime Model — how the game actually runs (founder capture, 2026-06-12)
tier: T0
status: active
owner: founder
updated: 2026-06-12
summary: >
  Founder brainstorm captured whole (precedent: 02_NBM_MODEL): the four-layer
  × eight-block matrix modularization (UI / business logic / data / the
  intelligence layer with its context-assembling orchestrator), the three
  epistemic categories (computed scores · learned predictions · generated
  content — a proposed Article 13 extension), the trigger map and the
  self-retiring nudge doctrine (nudge events are BRQ telemetry), the
  three-things-today dashboard rule, the card zoom grammar, and the two
  playthroughs (best-case and hostile) that derive the trigger map. Ratified
  whole (C-019, 2026-06-12): the Article 13 generated-content extension is
  amended into the constitution; both propagation halves landed — product via
  N1-P3-07, technical via N1-P3-06 (TECH_STRATEGY Layer 4 + the stage machine
  + SCORING_MODEL, after the iBrain API read; orchestrator home decided
  Nexus-side, C-020).
parents:
  - NEXUS_STRATEGY/01_NEXUS_MODEL.md
  - NEXUS_STRATEGY/03_NEXUS_GAME.md
children:
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
  - NEXUS_STRATEGY/2-TECHNICAL/SCORING_MODEL.md
  - NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md
---

# The Runtime Model — how the game actually runs

> Captured from the founder's sketch and walkthrough of 2026-06-12, kept whole on the
> 02_NBM_MODEL precedent: the sketch is the source; the consequence queue (§7) routes
> each piece to the document that operationalizes it. The constitution and the Game
> remain canon where they overlap; this paper adds the *runtime* view — what actually
> happens, layer by layer and trigger by trigger, when the game is being played.

## 1 · The matrix — four layers × eight blocks

The founder's diagram: **Frontend → Business Logic → Backend**, with a fourth path
running beside them — **Orchestrator → LLM**. TECH_STRATEGY already binds three of
these (UI renders page contracts · business logic owns lifecycles and roll-ups · data
is private to its module). The capture adds the fourth as a peer, not an afterthought:

| Layer | Owns | One rule |
|---|---|---|
| **UI** | the six pages, CTAs, card grammar | renders page contracts; never computes |
| **Business logic** | lifecycles, roll-ups, the stage machine, score arithmetic | owns every number Nexus *computes* (Article 13) |
| **Data** | module-private models, the signal store | program-scoped; raw signals retained forever (restatement rule) |
| **Intelligence** | iBrain consumption + LLM content generation, fronted by **the orchestrator** | never computes scores; supplies predictions and content, each labeled per §3 |

Modularization is therefore **two-dimensional**: the eight lego blocks slice vertically
(crm, assessment, objectives, key-results, milestones, tasks, governance, knowledge);
the four layers slice horizontally *through every block*. A capability is located by
its (block, layer) coordinate, and contracts exist at both cuts.

## 2 · The orchestrator — the context assembler

The fourth layer's defining component. Its responsibility, in the founder's words:
**"to have the ability to build the context at every point when it has to go fetch
content from an LLM."** At any fetch moment it must know the game state — company,
program, stage, the player asking, the page they stand on, the relevant signals — and
brief the model with exactly that.

What is settled and what is not:

- **Settled (C-010)**: intelligence is iBrain's territory; Nexus delegates through
  published interfaces and never rebuilds it. External LLMs supply *content* (drafts,
  narratives, market-informed context); iBrain supplies *gamification, insights, NBM*.
  Every AI feature keeps a non-AI fallback and a cost ceiling (TECH_STRATEGY parking
  lot rule).
- **Decided (C-020, N1-P3-06)**: the orchestrator lives **Nexus-side**, a Layer-4
  seam component. The iBrain API read settled it: iBrain's surface is app-agnostic
  IQaaS (event ingestion, Observer rules → webhooks, caller-briefed Planner) with
  no context-assembly surface — the game state lives behind Nexus module contracts,
  and the policy obligations (data covenant, no-PII, cost ceilings, the compliance
  veto) must execute before anything leaves Nexus. Design: TECH_STRATEGY Layer 4.

## 3 · The three epistemic categories (proposed Article 13 extension)

Article 13 today splits two ways. The runtime view forces a third:

| Category | Produced by | Nature | Display obligation |
|---|---|---|---|
| **Computed** | Nexus business logic | auditable arithmetic, traceable to signals | number + band + provenance + pack + evidence (Article 6) |
| **Learned** | iBrain | probabilistic models | always a recommendation with a confidence and a why — never a fact (Article 13) |
| **Generated** | LLM via the orchestrator | drafted content (onboarding processes, KR drafts, narratives) | **proposed rule**: always labeled AI-drafted; becomes program canon only after a human accepts it; non-AI fallback always exists |

A generated artifact never silently becomes a score input; if accepted content later
produces signals (e.g., an adopted onboarding process changes cadence), the signals are
measured normally — the content itself stays in the *generated* category forever.

**Status**: **ratified** (C-019, 2026-06-12, Article 12 process) — Article 13 now reads
*score ≠ prediction ≠ draft*; this table is its source.

## 4 · The trigger map and the self-retiring nudge doctrine

The game advances on observable transitions (the constitution's entry moments). The
runtime question is: **what fires at each transition, and what catches it when it
stalls?** The canonical first trigger: consultant clicks Add Client → mail to the
business owner → **take the assessment or delegate it** (the delegate path is new —
the Sponsor bridge gains it) → the game begins.

The trigger map — to be derived per §6's hostile playthrough, owned by the playbook
(engagement level) and PRODUCT_STRATEGY (page level):

```
transition → designed trigger → fallback chain (system nudge → human nudge) → owner
```

Four fences, all existing canon, that the nudge engine must respect:

1. **Structure before nudges.** The game motivates by design first — the quest line,
   gauges lighting, the subtraction rule. A game that needs a nudge at every step is
   failing its design test. Nudges are the fallback layer, never the mechanism.
2. **The nudge engine is self-retiring.** BRQ measures *nudge-independence* (the % of
   cadence events unprompted — the dance). Therefore **every nudge is a logged
   telemetry event**, and the engine's success metric is its own declining send rate.
3. **PvE.** No nudge may carry a colleague-vs-colleague comparison; the bedside-manner
   rules govern tone; hard truths route per Article 6's no-verdict-without-a-path.
4. **Article 9.** Every fallback chain must terminate without a consultant in it —
   org-direct companies get system → Steward-grade automation, never a dead end.

## 5 · The page runtime — three-things-today and the card grammar

Two UX doctrines the page contract gains:

- **Three-things-today.** The Dashboard's job, restated per player: *any* archetype
  arriving on Dashboard sees the (~3) actions that keep the ball rolling today —
  drawn from the game structure (an assessment to take, a review due, a milestone at
  risk), stage-aware, person-altitude. This is the NBM made daily, and it is the
  Manager's relief valve (03 F9): the roll-up chases status so they don't.
- **The card zoom grammar.** Every entity card declares its zoom levels with fixed
  fields per level — e.g. Objective: **full** (owner, status, objective, KRs) ·
  **compact** (headline, owner, status) · **line** (headline, status). A page chooses
  a zoom level; it never invents a field mix. Same grammar web and mobile-responsive
  (native apps stay deferred, IMPROVEMENT_PLAN). Cards teach the game: the page
  contract gains a **rules surface** — where the page states the game rule it embodies
  (the Information element in the founder's sketch).

## 6 · The two playthroughs

The Game's §5 walked Meridian cooperatively. The runtime model requires both ends:

- **Best case** — every trigger fires, no human stalls: Add Client → mail → assessment
  taken → roadmap → objectives → daily play → gauges light → BOQ. This is the *design
  target*: the product must make this path physically possible with zero consultant
  touches (Article 9). It is never the planning assumption.
- **Hostile case** — friction after every step: the client who doesn't respond to the
  first mail, the sponsor who stalls the matrix, the team that stops logging
  mid-Transform (F11), the manager who lets reviews slip. Walking this path transition
  by transition *derives the trigger map* (§4): each stall names its catch. The
  hostile playthrough is written into USER_JOURNEYS alongside the four archetype
  journeys once the trigger map exists.

## 7 · The consequence queue

| # | Piece | Lands in | When |
|---|---|---|---|
| 1 | Stage-responsive page contract + rules surface + three-things-today + card zoom grammar | PRODUCT_STRATEGY | N1-P3-07 (this night) |
| 2 | UX principles (CTA placement, friction reduction, zoom grammar detail) | DESIGN_LANGUAGE | N1-P3-07 |
| 3 | Sponsor bridge delegate path + engagement-level nudge chain | AI_CONSULTING_PLAYBOOK | N1-P3-07 |
| 4 | The three epistemic categories | 01_NEXUS_MODEL Article 13 (amendment) | **landed** — ratified C-019, Article 13 amended |
| 5 | Layer-4 architecture + the orchestrator's home + the stage machine | TECH_STRATEGY | **landed** — N1-P3-06, after the iBrain read (C-020) |
| 6 | Nudge events as BRQ telemetry (logged sends; declining-send-rate metric) | scores/BRQ.md instruments | **landed** — N1-P3-06 (SCORING_MODEL §2.2) |
| 7 | Best-case + hostile playthroughs with the trigger map | 2-TECHNICAL/USER_JOURNEYS.md | **landed** — N1-P3-08 (T0–T10 map, both playthroughs, J5; §4's four fences verified in every chain) |

One line, the founder's thesis: **we have the power to visualize the entire game before
building it — so every situation, from the hostile case to the frictionless case, is
walked on paper first, and the architecture documents inherit a game that has already
been played.**
