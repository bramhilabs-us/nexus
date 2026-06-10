---
id: nexus.customer
title: 4-CUSTOMER — evidence, feedback, and the numbers that matter
tier: T4
status: active
owner: agent
updated: 2026-06-10
summary: >
  The T4 tier: how customer truth enters the repo. Four working templates —
  interviews (AIR sprint instruments), the feedback meta-loop log, the
  engagement evidence index, and the metrics card (north-star, retention,
  completion/sentiment, BOQ L3 signals). Templates fill with real data from
  the first engagement; structure is binding now.
parents:
  - NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md
children:
  - NEXUS_STRATEGY/4-CUSTOMER/INTERVIEW_TEMPLATE.md
  - NEXUS_STRATEGY/4-CUSTOMER/FEEDBACK_LOG.md
  - NEXUS_STRATEGY/4-CUSTOMER/EVIDENCE_INDEX.md
  - NEXUS_STRATEGY/4-CUSTOMER/METRICS.md
revisit:
  - on: "first real engagement begins — templates start filling; structure gaps surface"
    stage: N5
---

# 4-CUSTOMER — evidence, feedback, and the numbers that matter

## Purpose

T0–T3 say what Nexus is and how it's built; **T4 is where reality answers back**. This tier holds customer evidence (interviews, engagement artifacts), the feedback meta-loop's paper trail, and the metric definitions everything is judged against. Until the first engagement, these are templates with binding structure; from Night 5 onward they fill with real data.

## The four files

| File | What it captures | Fed by |
|---|---|---|
| [INTERVIEW_TEMPLATE.md](INTERVIEW_TEMPLATE.md) | One sprint interview/instrument session, evidence-first | AIR two-week sprint (playbook § interview matrix) |
| [FEEDBACK_LOG.md](FEEDBACK_LOG.md) | The meta-loop: tenant ideas/bugs/pulse → Nexus's own backlog, status visible to submitter | `@nexus/knowledge` Feedback surface (PRODUCT_STRATEGY § meta-loop) |
| [EVIDENCE_INDEX.md](EVIDENCE_INDEX.md) | Every engagement artifact: instrument → artifact → where it landed in Nexus | AIR deliverables + day-by-day instruments |
| [METRICS.md](METRICS.md) | The numbers Nexus is judged by: north-star, retention, completion/sentiment, BOQ L3 signals | Product telemetry + assessment module |

## Rules

1. **Evidence is captured in Nexus, indexed here** — this folder holds pointers and templates, never a parallel artifact universe (the playbook's "no slide-deck universe" rule applies to us too).
2. **Match-grade or it didn't happen**: anything captured about people (skills, interests, motivations) lands as tags/enums per the fit thesis — prose is decoration (PRODUCT_STRATEGY § fit thesis).
3. **Every metric traces to a signal** (BOQ L3 rule): a number whose lineage can't be walked back to raw signal data doesn't go in METRICS.md.
