---
id: nexus.ci-cd
title: CI/CD — the IM-5 gates as pipeline
tier: T3
status: active
owner: agent
updated: 2026-06-10
summary: >
  The per-PR pipeline (GitHub Actions) implementing IMPROVEMENT_PLAN's IM-5
  gate table verbatim, plus the doc-graph check as a required check, the
  weekly mutation job, and the deploy legs (main→staging auto, tag→prod
  gated). Wired in Night 2; this doc is the spec the workflow files implement.
parents:
  - NEXUS_STRATEGY/3-DELIVERY/EXECUTION_PLAYBOOK.md
children: []
revisit:
  - on: "Night 2 wires the workflows — keep this doc and the YAML 1:1 (AP-10)"
    stage: N2
  - on: "IM-5 thresholds change in IMPROVEMENT_PLAN (that doc wins; update here)"
    stage: always
---

# CI/CD — the IM-5 gates as pipeline

## Purpose

Turn IMPROVEMENT_PLAN's IM-5 table into a concrete pipeline spec so Night 2 writes workflow files against a ratified design. Rule of authority: **IM-5 owns the thresholds; this doc owns the mechanics**. If they disagree, IMPROVEMENT_PLAN wins and this doc gets patched (its revisit trigger).

## Per-PR pipeline (`.github/workflows/pr.yml`, lands N2)

Single workflow, jobs in dependency order; every "Required" job is a branch-protection required check on `main`.

| # | Job | Implements | Threshold (IM-5) | Gate |
|---|---|---|---|---|
| 1 | `lint` | ESLint + Prettier (+ AP-1 module-boundary lint once modules exist) | 0 errors | Required |
| 2 | `typecheck` | `tsc --noEmit`, strict (C-004) | 0 errors | Required |
| 3 | `unit` | `pnpm test:unit` per touched workspace | 100% pass | Required |
| 4 | `integration` | `pnpm test:integration` (Mongo service container) | 100% pass | Required |
| 5 | `coverage` | statement coverage on changed files | ≥ 80% per file | Required |
| 6 | `contract` | contract tests of any module whose `contract.ts` changed (hard rule 7) | 100% pass | Required |
| 7 | `secrets` | gitleaks scan (+ GitHub push protection upstream) | 0 findings | Required |
| 8 | `deps` | `npm audit` + Snyk | 0 high/critical | Required |
| 9 | `doc-graph` | `python3 .claude/hooks/doc-graph-check.py` | 0 errors | Required |
| 10 | `doc-freshness` | doc-graph staleness output (>14-day stale child) | warn only | Informational |

Notes:
- Jobs 3–6 are no-ops until Night 2 lands code — the workflow ships with them green-on-empty so the gate shape is live from day one of coding, never retrofitted (AP-9's failure mode).
- Job 9 runs **today's** validator unchanged; CI just makes the `/close` gate unskippable.
- PR template carries the IMPROVEMENT_PLAN checklist (incl. IM-8 "DECISIONS entry?" and IM-11 reflection record for Karvia lifts) — human-checked at Level 0, lint-assisted later.

## Scheduled jobs

| Job | Cadence | Action |
|---|---|---|
| `mutation` | weekly | Stryker run; alert if score drops >5% vs last run (informational, IM-5) |
| `doc-staleness` | nightly | doc-graph staleness sweep → `/audit` warning list |
| `dep-refresh` | weekly | Renovate/dependabot PRs (they ride the same gates) |

## Deploy legs (mechanics for RELEASE_PROCESS's policy)

| Trigger | Leg | Gate |
|---|---|---|
| Merge to `main` | Render auto-deploy → **staging**; post-deploy smoke (health + J1 steps 1–2) | green PR pipeline (already enforced by branch protection) |
| Release tag `v*` | Staging E2E (the four USER_JOURNEYS) → human approval environment → Render deploy → **production** | RELEASE_PROCESS release audit; prod approval stays human at every autonomy level ≤2 |

Autonomy interplay (AUTONOMY.md is authoritative): Level 0 — human merges, so CI gates advise the human. Level 1 — auto-merge on green makes jobs 1–9 the *only* merge authority; this is why the gates land Night 2, before any autonomy bump. Level 2 — staging promotion automates; prod stays gated.

## Reflection record (IM-11 — Karvia baseline)

| Question | Answer |
|---|---|
| **Why** | Karvia had test code that didn't gate merges (AP-9) and deploy steps living in a command doc + muscle memory |
| **What** | One PR workflow implementing IM-5 verbatim + two deploy legs |
| **How** | GitHub Actions + branch protection; doc-graph validator promoted to required check; gates ship green-on-empty before code exists |
| **When** | Spec now (N1-P3-02); workflows land N2 ("CI gates wired" is in Night 2's exit criteria) |
| **Relevant?** | Core — Level 1 autonomy is unsafe without it |
| **Improving?** | Yes: closes AP-9; makes the doc graph machine-enforced on every PR, not just at /close |
| **Complexity added?** | One workflow file + branch protection — minimal for what it gates |
| **Redundancy?** | None — thresholds live once (IM-5); this doc only adds mechanics |
