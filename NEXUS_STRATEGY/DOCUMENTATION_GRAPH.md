---
id: nexus.doc-graph
title: Documentation Graph — genome spec, registry, propagation
tier: T0
status: active
owner: founder
updated: 2026-06-09
summary: >
  Defines the document genome (frontmatter every Nexus doc carries), the full
  document tree with dependency edges, and the propagation rules that fire when
  any document changes. The validator (.claude/hooks/doc-graph-check.py)
  enforces: no orphans, bidirectional edges, staleness warnings.
parents:
  - NEXUS_STRATEGY/00_NORTH_STAR.md
children: []
revisit:
  - on: "a new document is added anywhere in NEXUS_STRATEGY, src, client, or tests"
    stage: always
  - on: "a tier or folder is added to the hierarchy"
    stage: always
---

# Documentation Graph — genome spec, registry, propagation

## Purpose

Every document around the Nexus codebase is a node in one connected graph. This document defines the **genome** (the metadata every doc carries), the **registry** (the tree + dependency edges), and the **propagation rules** (what must react when a node changes). The goal, in the founder's words: *no orphan documents, and any change in the tree triggers changes in all the other places.* Adapted from srishti's metadata-genome model (`srishti DOCUMENTATION_GRAPH.md`), simplified to what an autonomous loop can actually enforce.

## TL;DR

- Every doc opens with a **YAML genome**: what's in it (`summary`), where it sits (`parents`/`children`), and when it must be re-reviewed (`revisit: on/stage`).
- Edges are **bidirectional**: if A lists B as child, B must list A as parent. The validator fails otherwise.
- **No orphans**: every doc must be reachable from `00_NORTH_STAR.md` by walking `children`. Unreachable docs fail the check.
- **Propagation is notification-first**: a parent changing flags its children for review (staleness warning); it never silently rewrites them. T0/T1 changes require human review of descendants; T2/T3 the agent may patch and note in the PR.
- The validator runs in `/close`, `/audit`, and CI. A red graph blocks the session seal.

## The genome

Every markdown document in `NEXUS_STRATEGY/`, `src/`, `client/`, and `tests/` opens with this frontmatter (replaces the old `**Status**:` header block):

```yaml
---
id: nexus.<short-slug>            # stable identity, survives file moves
title: <human title>
tier: T0 | T1 | T2 | T3 | T4
status: draft | active | archived
owner: founder | agent | <module>
updated: YYYY-MM-DD
summary: >                        # 1–3 lines: what is IN this document
  ...
parents:                          # docs whose change forces review of this one
  - <repo-relative path>
children:                         # docs this one governs (must list me as parent)
  - <repo-relative path>
revisit:                          # when must this doc be re-opened
  - on: "<the trigger event, human-readable>"
    stage: N2 | N3 | N4 | N5 | always
---
```

Field rules:

- `summary` is the orphan-rescue field: a reader (or the agent) must know what the doc contains without opening the body.
- `parents` means *upstream*: "if that changes, I may be stale." `children` means *downstream*: "if I change, those need review." One root: `00_NORTH_STAR.md` (`parents: []`).
- `revisit.on` is the propagation trigger in plain language; `revisit.stage` says when in the 105-step plan it bites (so `/init` can surface "docs due for revisit this night").
- Exempt from the genome: `_agent/` state files (JOURNAL, BACKLOG, etc. — they are the loop's memory, not graph nodes), `_source/` (frozen), `.claude/` config, diagram sources, brand assets.

## The registry — tree with dependency overlay

```text
NEXUS DOCUMENT GRAPH                                  (tier | one-line role)
|
00_NORTH_STAR.md ............................. T0 | the play, the 105-step thesis — ROOT
|
|-- README.md ................................ T0 | folder index: the strategy pack
|-- 0-BUSINESS/README.md ..................... T0 | folder index: the business tier
|-- 1-PRODUCT/README.md ...................... T1 | folder index: the product tier
|-- 2-TECHNICAL/README.md .................... T2 | folder index: the technical tier
|-- 3-DELIVERY/README.md ..................... T3 | folder index: the delivery tier
|
|-- 01_NEXUS_MODEL.md ........................ T0 | the constitution: thesis · ladder · measurement · articles
|       |-- 02_NBM_MODEL.md .................. T0 | the Staircase, BOQ ⇄ NBM, the core USP (ratified C-015)
|       |-- 03_NEXUS_GAME.md ................. T0 | the game whitepaper: stage-responsive pages, friction audit, value bridge (parents: + PRODUCT_STRATEGY; ratified C-017)
|       |       |-- 0-BUSINESS/COMPANY_JOURNEY.md  T0 | the ladder client-facing: Sponsor bridge, proxy valley, gauges-lighting, the equality (parents: + 01_NEXUS_MODEL)
|       |       `-- 04_RUNTIME_MODEL.md ...... T0 | founder capture: 4-layer matrix, orchestrator (Nexus-side, C-020), epistemic tri-split, trigger map, nudge doctrine (parents: + 01_NEXUS_MODEL; ratified C-019)
|       |               `--> feeds: TECH_STRATEGY (Layer 4 + stage machine) + 2-TECHNICAL/SCORING_MODEL.md + 2-TECHNICAL/USER_JOURNEYS.md (trigger map + playthroughs, N1-P3-08)
|       |-- 0-BUSINESS/ICP.md ................ T0 | v1 profile + qualification gate + segment registry + anchor-pack roadmap (parents: + scores/BOQ.md)
|       `--> feeds: scores/BOQ.md (the score family it binds)
|
|-- 0-BUSINESS/AI_CONSULTING_PLAYBOOK.md ..... T0 | AIR framework, sprint, pricing
|       |-- 0-BUSINESS/scores/BOQ.md ......... T0 | the core measurement model + epistemic engine (parents: + NORTH_STAR, 01_NEXUS_MODEL; absorbs BOQ_FRAMEWORK, C-016.1)
|       |       |-- scores/ARS.md ............ T0 | AI Readiness Score
|       |       |-- scores/BPI.md ............ T0 | Productivity Index (the Eight Metrics)
|       |       |-- scores/CFS.md ............ T0 | Coordination Friction Score
|       |       |-- scores/BRQ.md ............ T0 | Business Rhythm Quotient
|       |       |-- scores/FLS.md ............ T0 | Founder Leverage Score
|       |       |-- scores/CRS.md ............ T0 | Consolidation Readiness Score
|       |       `-- scores/README.md ......... T0 | folder index: the measurement library
|       `--> feeds: PRODUCT_STRATEGY (what pages must encode)
|
|-- 0-BUSINESS/POSITIONING.md ................ T0 | category, one-liners, message house
|       |-- 0-BUSINESS/GTM.md ................ T0 | two motions, the flywheel
|       |-- 0-BUSINESS/STAKEHOLDERS.md ....... T0 | personas, adoption order
|       `-- 0-BUSINESS/BUSINESS_MODEL.md ..... T0 | 4 revenue streams, moat economics
|
|-- 1-PRODUCT/PRODUCT_STRATEGY.md ............ T1 | 6 page contracts, 2 modes, journeys
|       |--> feeds: TECH_STRATEGY (page contracts as code)
|       |-- 1-PRODUCT/CAPABILITIES.md ........ T1 | 8 blocks as user capabilities; task×person match v1 canon home (C-022.4)
|       |-- 1-PRODUCT/ROADMAP.md ............. T1 | what ships when, re-baselined nights
|       |       (parents: + EXECUTION_PLAYBOOK)
|       |-- 2-TECHNICAL/USER_JOURNEYS.md ..... T2 | 5 journeys (J5 org-direct) + best/hostile playthroughs + the trigger map T0–T10
|       |       (parents: + TECH_STRATEGY, 04_RUNTIME_MODEL)
|       |-- 4-CUSTOMER/README.md ............. T4 | evidence, feedback, metrics tier
|       |       |-- 4-CUSTOMER/INTERVIEW_TEMPLATE.md  T4 | sprint capture form
|       |       |-- 4-CUSTOMER/FEEDBACK_LOG.md  T4 | meta-loop paper trail
|       |       |-- 4-CUSTOMER/EVIDENCE_INDEX.md  T4 | artifact traceability
|       |       `-- 4-CUSTOMER/METRICS.md .... T4 | the numbers Nexus is judged by
|       `-- 1-PRODUCT/design/DESIGN_LANGUAGE.md  T1 | two-tier brand → Nexus UI rules
|               |-- design/brand/* (assets, exempt)
|               |-- design/README.md .......... T1 | folder index: the design subtree
|               `-- design/mockups/README.md . T1 | token-first page mockups (N3 spec)
|
|-- 2-TECHNICAL/SYSTEM_ARCHITECTURE.md ....... T2 | Karvia as-is map (reference)
|       |-- 2-TECHNICAL/IMPROVEMENT_PLAN.md .. T2 | quality bar: 10 APs, 10 IMs, gates
|       |-- 2-TECHNICAL/DATA_MODELS.md ....... T2 | 19 schemas + Nexus dispositions
|       |       (parents: + TECH_STRATEGY)
|       |-- 2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md  T2 | who touches what; shadow-schema cycles
|       |       (parents: + DATA_MODELS)
|       `-- 2-TECHNICAL/API_SURFACE.md ....... T2 | 410 routes shape-tagged + dispositions
|               (parents: + MODULE_DEPENDENCY_GRAPH)
|
|-- 2-TECHNICAL/TECH_STRATEGY.md ............. T2 | 4 layers, 8 blocks, AssessmentProvider, stage machine, Layer-4/iBrain seam
|       |   (parents: NORTH_STAR, PLAYBOOK, PRODUCT_STRATEGY,
|       |    SYSTEM_ARCHITECTURE, IMPROVEMENT_PLAN, 04_RUNTIME_MODEL)
|       |-- 2-TECHNICAL/SCORING_MODEL.md ..... T2 | signal store, question schema, calculator registry, packs, triangulation
|       |       (parents: + scores/BOQ.md, 04_RUNTIME_MODEL)
|       |-- 2-TECHNICAL/MODULARIZATION_PLAN.md  T2 | Karvia surface → 8 blocks/2 shells/death; AIR folder; mail owner; build order
|       |       (parents: + MODULE_DEPENDENCY_GRAPH, API_SURFACE)
|       `-- src/README.md .................... T2 | module anatomy in the codebase
|               |-- src/modules/<8 blocks>/README.md  (crm, assessment, objectives,
|               |        key-results, milestones, tasks, governance, knowledge)
|               |-- client/README.md ......... T2 | UI shell (parents: + DESIGN_LANGUAGE)
|               `-- tests/README.md .......... T3 | test strategy per module
|
|-- 3-DELIVERY/EXECUTION_PLAYBOOK.md ......... T3 | session types, 105-step budgets
|       |   (parents: NORTH_STAR, IMPROVEMENT_PLAN)
|       |-- 3-DELIVERY/SPRINT_PROCESS.md ..... T3 | the per-night cycle, DoD, card chain
|       |-- 3-DELIVERY/RELEASE_PROCESS.md .... T3 | 2 envs, release train, <5min rollback
|       `-- 3-DELIVERY/CI_CD.md .............. T3 | IM-5 gates as pipeline + deploy legs
|
`-- DOCUMENTATION_GRAPH.md ................... T0 | this file
```

Tree = containment + reachability. The dependency overlay is in each node's `parents` list (a node can have parents across branches — e.g., `TECH_STRATEGY` is fed by five docs). Night 1's remaining catalogues (API_SURFACE, USER_JOURNEYS, QA docs) join as children of `SYSTEM_ARCHITECTURE` / `TECH_STRATEGY` / `EXECUTION_PLAYBOOK` as they're written — **a doc PR that doesn't wire the new doc into this graph fails review**.

## Propagation rules

A doc change is a graph event, not a file write:

```text
doc changed (in a PR)
|-- validator: genome present? edges bidirectional? reachable from root?
|-- list children (direct blast radius) in the PR body
|-- per child, classify by the CHANGED doc's tier:
|     T0/T1 changed  -> children flagged MANDATORY REVIEW (human); agent may draft updates in the same PR but must call them out
|     T2 changed     -> agent patches children in the same PR (docs-as-code, AP-10) and notes each
|     T3/T4 changed  -> auto-note; no review needed unless a contract changed
`-- staleness backstop: child not updated within 14 days of a parent change -> /audit + CI warning
```

Two standing invariants (from srishti, kept verbatim because they are the whole point):

1. **Notification-first.** The graph flags and routes; it never silently mutates a higher-tier doc. Higher-tier truth changes only by explicit (human-reviewed) edit.
2. **Code change ⇒ doc change in the same PR** (AP-10). The genome makes "which doc?" computable: it's the code file's governing README, then that README's parents as needed.

## Validation

`.claude/hooks/doc-graph-check.py` — stdlib-only, runs in seconds:

| Check | Severity |
|---|---|
| Genome frontmatter missing on a governed doc | ERROR |
| Required field missing (`id`, `tier`, `summary`, `parents`, `children`) | ERROR |
| Parent/child path does not exist | ERROR |
| Edge not bidirectional | ERROR |
| Orphan (unreachable from root) | ERROR |
| Duplicate `id` | ERROR |
| Child older than a changed parent by > 14 days (git commit time) | WARN |

Run it: `python3 .claude/hooks/doc-graph-check.py` (repo root). Wired into `/close` (blocks the seal on ERROR), `/audit` (report section), and CI (Night 2, required check).

## Open questions

None. New doc types (e.g., per-module contract specs in Night 2) inherit this spec as-is; if a new field is needed, add it here first, then use it.
