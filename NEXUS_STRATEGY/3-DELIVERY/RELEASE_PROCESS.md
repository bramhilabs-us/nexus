---
id: nexus.release-process
title: Release Process — from green PRs to production
tier: T3
status: active
owner: agent
updated: 2026-06-10
summary: >
  How merged work reaches users: two environments (staging auto-deploys from
  main, production gated), release audit, reversible migrations, feature
  flags, tagged releases, and the <5-minute documented rollback (IM-6).
  Adapts Karvia's 3-branch Render flow to the consolidated single app (C-003).
parents:
  - NEXUS_STRATEGY/3-DELIVERY/EXECUTION_PLAYBOOK.md
children: []
revisit:
  - on: "first real deploy (Night 5) — replace placeholders with live URLs/IDs"
    stage: N5
  - on: "autonomy reaches Level 2 (auto-deploy staging) or 3 (prod)"
    stage: always
---

# Release Process — from green PRs to production

## Purpose

Define how merged work becomes a release: environments, promotion gates, migrations, flags, tagging, and rollback. Written Night 1 so Night 2 wires CI/CD against a ratified shape instead of improvising one at deploy time (Karvia's deploy machinery was reverse-engineered into a runbook a year in).

## Environments (the C-003 simplification)

Karvia ran three Render services off three long-lived branches (`development` → `pre-prod` → `production`). Nexus consolidates (C-003: one Express app) and drops the redundant tier — PR-gated `main` does what Karvia's `development` branch did:

| Environment | Render service | Deploys when | Data |
|---|---|---|---|
| **Staging** | `nexus-staging` (placeholder until N5) | Auto on every merge to `main` | Fresh Mongo instance, seeded demo tenant; mirrors prod shape (IM-6) |
| **Production** | `nexus` (placeholder until N5) | Promotion of a staging-validated release tag | Live tenants |

No long-lived branches besides `main`. Tick branches merge into `main` and die (hard rule 6).

## The release train

1. **Accumulate** — green PRs merge to `main` (Level 0: human merges; Level 1+: auto-merge on green). Staging redeploys on each merge.
2. **Release audit** — before any prod promotion, `/audit` runs in release mode (absorbs Karvia's `/release-audit`): full E2E suite against staging (the four USER_JOURNEYS are the suite), doc-graph green, IM-5 gates green on every included PR, migrations rehearsed forward **and back** on staging data.
3. **Tag** — `vN.<night>.<seq>` (e.g., `v0.5.2` = Night 5, 2nd cut). The tag's notes list included PRs + any migration/flag steps — generated, not hand-written.
4. **Promote** — deploy the tag to production. Level ≤2 keeps this human-gated; even Level 1's auto-merge never touches prod (AUTONOMY.md is authoritative).
5. **Verify** — health endpoint + smoke pass of journey J1 steps 1–2; observability dashboards (IM-4) watched for one cycle.

## Migration & flag rules (IM-6, restated as gates)

- Every schema migration ships **forward + back scripts, both tested on staging** before the release tag is cut. A migration that can't reverse blocks the train.
- Any non-trivial new behavior lands behind a **feature flag** (config data, AP-3 — flags live in Configuration, not code). Big-bang launches are a gate violation, not a style choice.
- Mixed releases (code + migration) deploy in the order: migrate → deploy → verify → (if bad) roll back code → roll back migration.

## Rollback (< 5 minutes, rehearsed)

Karvia's bar was "via Render dashboard, manual." The Nexus bar:

1. `render rollback <service> <previous-deploy-id>` (or dashboard one-click) — restores the prior image.
2. If a migration shipped: run its back script (already tested by the audit).
3. Flip any release-introduced flags off (config change, no deploy).
4. Journal the rollback as an incident entry; `@nexus/knowledge` captures the postmortem (IM-9).

The full command sequence with real service IDs lands in the Night 5 runbook revision (revisit trigger); the *shape* is binding now.

## Reflection record (IM-11 — lifted from Karvia DEPLOYMENT_RUNBOOK + /deploy + /release-audit)

| Question | Answer |
|---|---|
| **Why** | Karvia's deploy flow worked but carried 3 branches/services for a team of one agent + one human, and rollback was undocumented muscle memory |
| **What** | 2 environments, PR-gated main, audited tagged promotion, rehearsed rollback |
| **How** | Drop the `development` tier (PR gates replace it); fold /release-audit into /audit release mode; make IM-6's migration/flag/rollback rules blocking gates |
| **When** | Now on paper (N1-P3-02); wired N2 (CI), live N5 (first deploy) |
| **Relevant?** | Core — Night 5's exit criteria cite this doc |
| **Improving?** | Yes: one fewer env to drift, rollback becomes a tested path not a dashboard hunt |
| **Complexity added?** | Net negative — fewer branches, fewer services |
| **Redundancy?** | None — CI_CD.md owns the pipeline mechanics; this doc owns the promotion policy |
