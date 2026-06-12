---
id: nexus.scoring-model
title: Scoring Model — the signal store, the calculator registry, and the question engine
tier: T2
status: active
owner: agent
updated: 2026-06-12
summary: >
  The T2 mechanics of the measurement system: the immutable program-scoped
  signal store (all three channels, including nudge events and dev-stack
  telemetry via iBrain), the question schema (questions derive from the
  metric model, C-012), the calculator-plugin contract (pure functions,
  weights-as-config, versioned), BOQ aggregation with provenance
  inheritance, floors and the insufficient-signal rule, anchor packs as
  config with restatement-by-recompute, the causal-edge config (the Bridge
  as data), the triangulation rule (03 F13), and the epistemic engine
  implementation (BOQ §7). This document implements constitution §5 and
  scores/BOQ.md; it covers only the COMPUTED category (Article 13) — learned
  and generated belong to the intelligence layer (TECH_STRATEGY Layer 4).
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
  - NEXUS_STRATEGY/04_RUNTIME_MODEL.md
children: []
revisit:
  - on: "Night 4 engine build begins — freeze v1 collection schemas and calculator signatures from this spec"
    stage: N4
  - on: "first real engagement closes its scoring workshop — test the adjustment-record flow against actual consultant behavior"
    stage: always
---

# Scoring Model — the signal store, the calculator registry, and the question engine

## Purpose

Constitution §5 states the law (*only signals are measured; every score is calculated
and traceable*); `scores/BOQ.md` and the six driver docs state the model (what the
drivers mean, their v1 blends, anchors, floors). This document is the **mechanics
card**: the data shapes and contracts that make the law executable — what a signal
*is* as a record, how questions map to metrics, how calculators plug in, how floors,
provenance, packs, and restatement actually compute. Formulas stay in the driver docs;
calibration constants stay config (Article 5, trade secret). Nothing here invents
model content.

## 1 · Scope — the computed category only

Article 13 splits the epistemic world three ways (*score ≠ prediction ≠ draft* —
the tri-split ratified by C-019, sourced from 04_RUNTIME_MODEL §3):

| Category | Owner | This doc? |
|---|---|---|
| **Computed** — scores, roll-ups, gradients | Nexus business logic (Layer 2) | **yes — this is the spec** |
| **Learned** — predictions, NBM confidence, patterns | iBrain, behind the Layer-4 seam | no (TECH_STRATEGY Layer 4) |
| **Generated** — drafted content | LLM via the orchestrator | no (TECH_STRATEGY Layer 4) |

One consequence stated once: **nothing in this document calls a model.** Every output
is deterministic arithmetic over stored signals — recomputable, auditable, identical
on every run. That property is what the restatement rule, the evidence drill-down,
and the trust story all stand on.

## 2 · The signal store

The primitive of the whole measurement system. One append-only collection
(`signals`), owned by the scoring seam, written by instruments and the telemetry
pipeline, read by calculators.

### 2.1 The record

```ts
interface Signal {
  _id: ObjectId;
  company_id: ObjectId;            // BOQ's referent (C-016.2)
  program_id: ObjectId;            // collection scope — where work happens
  subject: {                       // what the observation is about
    kind: 'company' | 'team' | 'person' | 'objective' | 'task';
    id?: ObjectId;                 // absent for company-level observations
  };
  metric: string;                  // registry key, e.g. 'brq.cadence_adherence'
  value: number | boolean | string; // the raw observation — never normalized here
  unit: string;                    // 'ratio' | 'minutes' | 'count' | 'likert_5' | …
  channel: 'survey' | 'observed' | 'telemetry';   // constitution §5.5
  instrument: string;              // which instrument produced it (see §3)
  evidence_ref?: {                 // tap-through target (Article 6)
    kind: 'deck_response' | 'interview' | 'artifact' | 'event' | 'external';
    id: string;
  };
  observed_at: Date;               // when the fact was true
  recorded_at: Date;               // when we learned it (append time)
  consent: 'org' | 'individual';   // workforce-profile signals need individual consent
  meta: { instrument_version: string; pipeline?: 'nexus' | 'ibrain' };
}
```

Rules:

- **Append-only, retained forever** (Article 1). No update, no delete; corrections
  append a superseding signal with an `evidence_ref` to the correction's
  justification. Raw signals are the ground truth every restatement recomputes from.
- **Program-scoped writes, company-scoped reads** (C-016.2): instruments always write
  with a `program_id`; company-level calculators aggregate across programs.
- **No PII in the value** — IDs and structured observations only. Person-subject
  signals carry the consent flag; surfaces that show them honor it (the data
  covenant, 03 F12).
- **Raw, never normalized.** Tier placement (position between anchors) happens in
  calculators at read time, under whichever anchor pack the view requests. Storing
  normalized values would freeze a pack edition into the data — the exact bug the
  restatement rule exists to prevent.

### 2.2 The three channels, concretely

| Channel | Writers | Examples |
|---|---|---|
| **survey** | flashcard deck submissions (assessment module) | likert responses, choice answers — each response writes the signals its question's `maps_to` declares (§3) |
| **observed** | consultant instruments: interviews, workshops, tool inventory, floor observation | decision-latency estimates, tool counts, workshop canvas outputs |
| **telemetry** | Nexus domain events + the iBrain ingestion pipeline | milestone closes, review events, **nudge events**, re-dating frequency; dev-stack: git/CI/AI-usage metrics |

**Nudge events are telemetry signals** (04 §4): every nudge the system sends, and
every cadence event that happens *without* one, is logged — `nudge.sent`,
`nudge.acted`, `nudge.expired`, and the unprompted cadence event itself. BRQ's
nudge-independence signal is computed from exactly these records, and the nudge
engine's success metric (its own declining send rate) is a query over them. A nudge
that isn't logged didn't happen.

**Dev-stack telemetry arrives through iBrain** (C-010, constitution §5.5): the
client's git/CI/incident/AI-billing events ingest via iBrain's Universal Adapter
pipeline and land here as `channel: 'telemetry', meta.pipeline: 'ibrain'` signals.
The signal store does not care about the transport; it cares that the record is
shaped, attributed, and append-only. The Eight Metrics (constitution Appendix C) are
metric-registry entries fed by this path.

## 3 · The question schema

Questions are **born from the metric model, never invented per assessment**
(C-012.3, Article 5). The bank is data; an assessment package selects from it.

```ts
interface Question {
  id: string;
  text: string;                       // the card face — one question per flashcard
  why: string;                        // the always-on "why we ask" line (PRODUCT_STRATEGY)
  audience: 'founder' | 'manager' | 'member';
  moment: 'first_time' | 'recurring' | 'pulse';
  section: string;                    // deck section, e.g. 'rhythm' | 'leadership'
  answer_type: 'likert_5' | 'choice' | 'binary' | 'scale_0_10' | 'number';
  choices?: string[];
  maps_to: Array<{
    metric: string;                   // signal-store metric key
    weight: number;                   // contribution weight — config, versioned
    transform?: string;               // registry key: answer → raw value mapping
  }>;
  version: string;                    // bank edition; responses cite it
}
```

- One submitted answer fans out to one signal per `maps_to` entry — the response is
  the `evidence_ref`, so every survey-fed score drills back to the exact card the
  taker saw.
- A question with no `maps_to` cannot exist (the bank validator rejects it). The
  Karvia counter-example — a hardcoded question bank disconnected from scoring — is
  the thing this schema makes unrepresentable.
- The bank, its weights, and its transforms are **seed data + config** (AP-3),
  versioned like anchor packs. Editing weights is a calibration act and lands in the
  affected driver's calibration log.

## 4 · The calculator registry

Drivers are **plugins over the signal store** — the "score calculators as lego
blocks" seam TECH_STRATEGY reserved, now specified:

```ts
interface DriverCalculator {
  id: 'ars' | 'bpi' | 'cfs' | 'brq' | 'fls' | 'crs';   // registry key
  metrics: string[];                  // signal metrics it consumes — declared, auditable
  floors: FloorSpec[];                // volume / recency / size (per driver doc)
  // Pure function. No I/O, no clock, no randomness: everything it needs arrives
  // as arguments. Same inputs, same score, forever — this is what makes
  // restatement and the evidence drill-down mechanical.
  compute(
    signals: Signal[],                // pre-fetched, already scoped
    pack: AnchorPack,                 // the ruler (versioned)
    config: DriverConfig              // weights + constants (versioned, Article 5)
  ): DriverResult;
}

interface DriverResult {
  score?: number;                     // 0–100 tier placement; ABSENT below floors
  band?: Band;                        // Reactive … AI-Native (shared bands)
  provenance: 'proxy' | 'partially_measured' | 'measured';
  floor_state: 'met' | { failed: string; display: string };  // "accruing — n weeks…"
  trace: SignalContribution[];        // every input signal + its contribution
  pack_id: string;                    // the ruler used (Article 6)
  config_version: string;
}
```

Rules:

- **Weights are config, never code.** `DriverConfig` documents are versioned and
  append-only-amended; the v1 blends in the driver docs are the seed editions.
  Changing one requires evidence + a calibration-log entry (calibrate-never-invent
  applies to the model, BOQ §7.3) — the config store enforces the citation field.
- **No score below floors.** A failed floor yields no number — the result carries
  the display string instead ("insufficient signal", "accruing — n weeks of rhythm
  history"). Defaulting to 50 or carrying the last value forward are both
  constitutional violations (§5.4), and the type makes them unrepresentable:
  `score` is optional, `floor_state` is not.
- **The trace is not optional.** Every result enumerates its input signals and
  their contributions — the "where did this 74 come from?" walk is a stored
  artifact, not a re-derivation.

### 4.1 The BOQ aggregator

One more pure function, over driver results rather than signals:

```
BOQ = geometric_mean( clamp(driver_i, 1, 100) for the six drivers )
```

- Computes only when **all six drivers have scores** — any absent driver (floors)
  means BOQ displays its own absence honestly, listing which gauges are still dark.
- **Provenance inheritance**: BOQ's label is the weakest among its drivers
  (proxy < partially_measured < measured).
- The aggregator also emits the **gradient**: drivers ranked by marginal BOQ gain
  per point of improvement (the geometric mean makes this the weakest-driver
  ordering). This ranking is computed, auditable arithmetic — it feeds the
  Opportunity Register mechanically (C-012.5) and is handed to the intelligence
  layer as raw material for NBM (see §6).

### 4.2 Recompute and storage

Scores are **recomputed on the write path and stored denormalized with the event
that caused them** (same discipline as the roll-up engine): a signal append triggers
recompute of the calculators whose `metrics` it touches; the read path is a lookup.
Historical results are kept — but they are a cache, never the truth: any view may
recompute any period from raw signals under any pack, which is what trend
restatement does.

## 5 · Anchor packs and restatement

An **anchor pack** is config: `{ pack_id: 'saas-product v2026.1', segment, edition,
anchors: { metric → { newbie, top } }, ratified: C-xxx }`. Tier placement reads the
pack at compute time:

```
position(raw, anchor) = 100 × normalized position of raw between newbie and top
```

- Every `DriverResult` carries its `pack_id`; every displayed score shows it
  (Article 6).
- **Trend views restate** (C-016.7): year-over-year comparisons recompute history
  from stored signals under the *current* pack — never two rulers compared
  silently. Restatement is a pure recompute, guaranteed possible because §2.1
  stores raw values forever.
- Pack editions are ratified in DECISIONS like amendments; the registry of packs
  and the demand-triggered roadmap live in `0-BUSINESS/ICP.md`.

## 6 · The causal-edge config — the Bridge as data

C-015.7 binds NBM to causal correctness: the weakest-driver gradient must be read
*through* the Bridge's edges, because drivers are coupled (ARS enables BRQ; BRQ
enables the engine four) and a weak gauge's cause can sit upstream.

The Bridge is therefore **config, not prose**:

```ts
interface CausalEdge {
  from: DriverId;                     // e.g. 'brq'
  to: DriverId;                       // e.g. 'bpi'
  rationale: string;                  // the consultant's stated mechanism
  status: 'prior' | 'cohort-supported';  // epistemic rung (BOQ §7.1) — v1 ships all 'prior'
}
```

- Nexus computes, per company: the gradient ranking (§4.1) **plus** the upstream
  closure — for each weak driver, the chain of edges pointing into it. Both are
  auditable arithmetic; both are computed-category outputs.
- The intelligence layer (iBrain, behind Layer 4) consumes that bundle to produce
  the NBM **recommendation with confidence and why** — the learned category. The
  seam is exact: *Nexus says "BPI is weakest and BRQ sits upstream of it"; iBrain
  says "rhythm-first is your move, confidence medium, here's why."*
- Edges start as the consultant's informed prior, labeled as such; cohort evidence
  upgrades their status through the calibration log. The edge set is versioned
  with the same discipline as weights.

## 7 · The triangulation rule (03 F13)

**No stakes-bearing driver is scored from a single channel.** Entry assessments can
be gamed in both directions; proxy-stage scores carry human motives.

Mechanics:

- Each driver's `DriverConfig` declares `stakes_bearing: boolean` (v1: all six are —
  they price the engagement and seed the roadmap).
- For a stakes-bearing driver, the calculator's floor set includes a **channel
  floor**: signals from ≥2 channels among survey/observed/telemetry, or the result
  is `provenance: 'proxy'` with `floor_state.display` naming the missing channel —
  the scoring workshop UI surfaces it as a mandatory cross-check item (Article 4's
  evidence requirement doing double duty).
- At the scoring workshop, a survey-claim vs observation mismatch is resolved by a
  **calibration adjustment** (§8) — never by silently preferring either channel.
- From Transform onward, telemetry quietly re-scores the baseline's honesty: the
  same metrics measured live are compared against their proxy-era values, and a
  systematic gap is itself a signal (`baseline.divergence`), visible in the
  Calibration Review.

## 8 · Calibration mechanics — calibrate, never invent

Human judgment may adjust; it may not create (constitution §5.4). The adjustment is
a record:

```ts
interface Adjustment {
  driver: DriverId;
  computed: number;                   // what the arithmetic said
  adjusted: number;                   // what the workshop concluded
  evidence_ref: string;               // REQUIRED — the citation that justifies it
  author: ObjectId;                   // a person, never the system
  workshop_ref: string;               // which scoring workshop
  created_at: Date;                   // append-only, like everything else
}
```

- An adjustment without an `evidence_ref` cannot be saved — the rule is a schema
  constraint, not a guideline.
- Displayed scores that include an adjustment show it in the drill-down: computed
  value, adjustment, citation. The walk down to facts (constitution §5.1) includes
  the human step.
- Adjustments never edit signals or results; they layer. Restatement recomputes
  the arithmetic and re-applies (or retires) adjustments explicitly.
- Model-level changes (weights, edges, anchors, question mappings) follow the same
  evidence-cited, append-only discipline via the driver docs' calibration logs
  (BOQ §7.3).

## 9 · The epistemic engine, implemented (BOQ §7)

How §7's prior ladder and two faces of humility land in these mechanics:

| BOQ §7 concept | Mechanical home |
|---|---|
| Measured rung | `provenance: 'measured'` — telemetry-fed signals above floors |
| Informed-prior rung | pack anchors, v1 weights, causal edges — all config with `status: 'prior'`, all labeled in the trace |
| Fifty-fifty floor | not Nexus's notation: Nexus *measurement* below floors says **"insufficient signal"** (no number); the fifty-fifty prior belongs to iBrain's prediction side of the seam |
| The learning wheel | Nexus stores the tuples — `(state, move, outcome record)` accrue from NOF objective closes and the signal store; iBrain learns from them (Layer 4); recalibration lands back here as config changes with calibration-log entries |

The two faces stay distinct in code because they live on opposite sides of the
Layer-4 seam: a missing score renders as absence with a reason; a low-confidence
prediction renders as a recommendation with its confidence. Neither ever borrows
the other's notation (the duality design law).

## 10 · Module placement

Where these pieces live in the 8-block anatomy (TECH_STRATEGY):

| Piece | Home |
|---|---|
| Signal store + metric registry | the scoring seam — a Layer-2/3 service owned alongside the roll-up engine (one calculation home, same discipline) |
| Question bank + decks + evidence capture | `@nexus/assessment` (instruments write signals through the store's contract) |
| Driver calculators + BOQ aggregator + gradient | the calculator registry inside the scoring seam — pure functions, contract-tested without Mongo |
| Anchor packs, weights, edges, question bank versions | config collections, seeded + versioned (AP-3); Article 5 keeps constants out of the repo's public surface |
| Nudge event log | domain events (Layer 2) persisted as telemetry signals — the nudge engine reads its own send rate from the store |
| Stage machine coupling | provenance is stage-correlated, never stage-caused: stages gate which *instruments run* (decks, telemetry connection), and provenance follows from which signals exist — the stage machine (TECH_STRATEGY Layer 2) emits the events that schedule instruments |
| Adjustments + workshop flow | `@nexus/assessment` (scoring workshop instrument) writing through the store's adjustment contract |

Engine build lands Night 4 (the seam is binding now; collection names and exact
TS signatures freeze then — see revisit). The acceptance test mirrors the
assessment block's: **registering a seventh driver touches only a new calculator
plugin + its config** — no schema change, no handler edit, no new endpoint.
