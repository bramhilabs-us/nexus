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
- `revisit.on` is the propagation trigger in plain language; `revisit.stage` says when in the 90-step plan it bites (so `/init` can surface "docs due for revisit this night").
- Exempt from the genome: `_agent/` state files (JOURNAL, BACKLOG, etc. — they are the loop's memory, not graph nodes), `_source/` (frozen), `.claude/` config, diagram sources, brand assets.

## The registry — tree with dependency overlay

```text
NEXUS DOCUMENT GRAPH                                  (tier | one-line role)
|
00_NORTH_STAR.md ............................. T0 | the play, the 90-step thesis — ROOT
|
|-- 0-BUSINESS/AI_CONSULTING_PLAYBOOK.md ..... T0 | AIR framework, sprint, pricing
|       `--> feeds: PRODUCT_STRATEGY (what pages must encode)
|
|-- 1-PRODUCT/PRODUCT_STRATEGY.md ............ T1 | 6 page contracts, 2 modes, journeys
|       |--> feeds: TECH_STRATEGY (page contracts as code)
|       |-- 2-TECHNICAL/USER_JOURNEYS.md ..... T2 | 4 archetype journeys + seq diagrams
|       |       (parents: + TECH_STRATEGY)
|       |-- 4-CUSTOMER/README.md ............. T4 | evidence, feedback, metrics tier
|       |       |-- 4-CUSTOMER/INTERVIEW_TEMPLATE.md  T4 | sprint capture form
|       |       |-- 4-CUSTOMER/FEEDBACK_LOG.md  T4 | meta-loop paper trail
|       |       |-- 4-CUSTOMER/EVIDENCE_INDEX.md  T4 | artifact traceability
|       |       `-- 4-CUSTOMER/METRICS.md .... T4 | the numbers Nexus is judged by
|       `-- 1-PRODUCT/design/DESIGN_LANGUAGE.md  T1 | BRAMHI brand → Nexus UI rules
|               |-- design/brand/* (assets, exempt)
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
|-- 2-TECHNICAL/TECH_STRATEGY.md ............. T2 | 3 layers, 8 blocks, AssessmentProvider
|       |   (parents: NORTH_STAR, PLAYBOOK, PRODUCT_STRATEGY,
|       |    SYSTEM_ARCHITECTURE, IMPROVEMENT_PLAN)
|       `-- src/README.md .................... T2 | module anatomy in the codebase
|               |-- src/modules/<8 blocks>/README.md  (crm, assessment, objectives,
|               |        key-results, weekly-goals, tasks, governance, knowledge)
|               |-- client/README.md ......... T2 | UI shell (parents: + DESIGN_LANGUAGE)
|               `-- tests/README.md .......... T3 | test strategy per module
|
|-- 3-DELIVERY/EXECUTION_PLAYBOOK.md ......... T3 | session types, 90-step budgets
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
