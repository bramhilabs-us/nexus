---
id: nexus.feedback-log
title: Feedback log — the meta-loop's paper trail
tier: T4
status: active
owner: agent
updated: 2026-06-10
summary: >
  The log mirroring the in-product Feedback surface: every tenant idea, bug,
  and pulse signal with its triage state and the visible-to-submitter status
  ("you said → we did"). Until the Feedback surface ships (N4), founder/agent
  dogfood entries log here directly (IM-9).
parents:
  - NEXUS_STRATEGY/4-CUSTOMER/README.md
children: []
revisit:
  - on: "@nexus/knowledge Feedback surface ships (N4) — this log becomes its export, not its source"
    stage: N4
---

# Feedback log — the meta-loop's paper trail

> The meta-loop (PRODUCT_STRATEGY § secondary surfaces): every tenant is a product-development sensor. Feedback flows into Nexus's own backlog, gets triaged, and **the submitter sees the status** — "you said → we did" is the trust mechanic. Until the in-product surface ships (Night 4), entries land here; after, this file is the periodic export.

## Triage states

`new` → `triaged (accepted | duplicate | declined-with-reason)` → `in-backlog (item ID)` → `shipped (release tag)` → `submitter-notified`

Rules: nothing sits in `new` past one groom cycle; a `declined` always carries the reason shown to the submitter; `shipped` links the release tag so the announcement writes itself.

## Log

| ID | Date | Tenant / submitter | Type | What they said (verbatim core) | State | Backlog ref | Visible status to submitter |
|---|---|---|---|---|---|---|---|
| FB-001 | — | *(template row)* | idea / bug / pulse | | new | | |

## Pulse snapshots

*(the Feedback surface's lightweight sentiment pulse — append one row per pulse run)*

| Date | Tenant | Pulse question | Score / trend | n |
|---|---|---|---|---|
| — | | | | |
