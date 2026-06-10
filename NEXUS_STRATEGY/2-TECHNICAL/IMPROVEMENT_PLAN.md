---
id: nexus.improvement-plan
title: Engineering Principles & Improvement Bar
tier: T2
status: active
owner: agent
updated: 2026-06-04
summary: >
  The quality bar every PR is measured against: 10 named anti-patterns from
  Karvia evidence (AP-1..AP-10), 10 improvements with enforcement (IM-1..IM-10),
  CI quality gates, the parking lot, and the Karvia-baseline vs Nexus-target
  success table.
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md
children:
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
  - NEXUS_STRATEGY/3-DELIVERY/EXECUTION_PLAYBOOK.md
revisit:
  - on: "a Nexus retro reveals a new anti-pattern or an unenforceable improvement"
    stage: always
  - on: "any quality gate is relaxed (requires DECISIONS.md entry)"
    stage: always
---

# Engineering Principles & Improvement Bar

## Purpose

This is the quality bar. Every PR in Nights 2–5 is measured against it. **Nexus is not a copy of Karvia — Nexus is the codebase Karvia should have been.**

Karvia is a working product. It also accumulated specific anti-patterns under shipping pressure. This document names those anti-patterns, declares the improvements Nexus adopts in their place, and defines the gates that enforce the bar.

If anything in this doc conflicts with a tick's local convenience, the doc wins. Localized escape hatches are how the bar erodes.

## TL;DR — the 5 axes Nexus must beat Karvia on

1. **Contract integrity** — modules communicate through published interfaces, not shared schemas
2. **Deploy honesty** — what runs is what's defined; no dead code paths
3. **Type safety end-to-end** — TS at module boundaries, runtime validation at the edge
4. **Test coverage with teeth** — measured, gated in CI, mutation-tested
5. **Operational safety from day 1** — secrets, rollback, observability are foundations, not retrofits

---

## Anti-patterns Nexus explicitly rejects

Each anti-pattern is sourced from a specific Karvia observation (file:line refs in `SYSTEM_ARCHITECTURE.md`). The fix is the *contract* Nexus enforces.

### AP-1. Shared models across module boundaries
**Karvia evidence**: All 10 engines `require('../../server/models/User')` etc. There is no published API between engines — they communicate by mutating shared Mongoose documents (`SYSTEM_ARCHITECTURE.md` D1).
**Nexus fix**: Each module's models are private. Public types only. Cross-module access goes through the module's exported interface.
**Enforcement**: ESLint rule `no-restricted-imports` banning `*/models/*` imports across module boundaries; CI fails on violation.

### AP-2. Code paths that aren't deployed
**Karvia evidence**: 9 of 10 "engines" are local-only. Render runs main + IAM. The other 8 ports exist in code, in docker-compose, in nginx routing — and never run in production. The repo lies about its shape (`SYSTEM_ARCHITECTURE.md` D5).
**Nexus fix**: Every code path that exists is deployed and exercised by at least one test in CI. Dead code is removed, not left "for future use."
**Enforcement**: deploy manifest is the source of truth; CI fails if a service in `package.json` has no health check exercised in CI.

### AP-3. Hardcoded domain logic that should be data
**Karvia evidence**: SSI questions hardcoded in `engines/assessment/index.js:1-600` despite `AssessmentTemplate` and `AssessmentQuestion` schemas existing. The schemas are aspirational.
**Nexus fix**: Data is data. Code reads from configured stores or seeds. Assessment dimensions, question banks, scoring rubrics, and report templates are all data.
**Enforcement**: code review checklist + AP-3 lint check that flags large literal arrays in route handlers.

### AP-4. Dual-write transitions left open-ended
**Karvia evidence**: `KeyResult` exists as both an embedded array on `Objective` AND a standalone collection. Both queried independently. Latent divergence (`SYSTEM_ARCHITECTURE.md` D6).
**Nexus fix**: Every schema migration is atomic with a deadline. Dual-write phases are dated; if not closed by the date, CI fails.
**Enforcement**: migration registry (`migrations/REGISTRY.md`) with end-state assertions; CI runs an "expired migrations" check.

### AP-5. Secrets in committed files
**Karvia evidence**: Live OpenAI service account key, Mailjet API key+secret, JWT_SECRET, SESSION_SECRET committed in plaintext across 26 markdown files (`_agent/clarifications.md` C-002).
**Nexus fix**: Secrets exist only in environment-managed vaults. Four enforcement layers:
1. **Pre-commit**: `redact-secrets.py` for any `_source/`-derived content
2. **Pre-push**: gitleaks scan via local hook
3. **GitHub push protection** (already enabled at org level — caught what our scan missed)
4. **Periodic audit**: `/audit` slash command runs weekly across the repo

### AP-6. Configuration that contradicts itself
**Karvia evidence**: Port 8089 claimed by both `insights` and `integrations` engines.
**Nexus fix**: Configuration is single-source and validated at boot. Conflicting values fail fast.
**Enforcement**: zod-validated config object loaded at startup; service-port uniqueness asserted; startup self-check halts the process on conflict.

### AP-7. Eventual consistency by accident
**Karvia evidence**: Objective lifecycle transitions run in `res.on('finish')` hooks. State changes after the response is sent. Clients get stale data on next fetch.
**Nexus fix**: State transitions are explicit. Either synchronous (inside the request, before response), or async via a real job queue with observable state. No hidden hooks.
**Enforcement**: design-doc required for any new background work; code review checklist asks "is this transition visible to the client immediately?"

### AP-8. "Optional" dependencies with no declared mode
**Karvia evidence**: OpenAI is optional (graceful degradation), Redis is optional, IAM engine is optional (local JWT-verify fallback). It's unclear what minimum setup actually works.
**Nexus fix**: Every dependency is either REQUIRED (build fails without it) or OPTIONAL with declared fallback behavior tested in CI.
**Enforcement**: `DEPENDENCIES.md` registry; CI runs once with each optional dep disabled to verify fallback paths.

### AP-9. Test code that exists but doesn't gate merges
**Karvia evidence**: 58 test files but no documented coverage threshold and unclear CI enforcement history.
**Nexus fix**: Every merge to main passes the full quality gate. No "merge despite red" exceptions.
**Enforcement**: GitHub Actions required checks + branch protection. The bot identity (`bramhi-bot`) cannot bypass these.

### AP-10. Strategy docs that drift from code
**Karvia evidence**: `KARVIA_STRATEGY/` contains 5+ "ARCHIVE" folders, repeated mass migrations, "Superseded 2026-06-03" naming patterns. Strategy decays under change.
**Nexus fix**: Docs-as-code. Every PR that changes behavior updates the matching doc in the same PR. Stale docs are caught.
**Enforcement**: `doc-freshness` check — every code file in `server/`, `engines/`, `client/` references a doc in `NEXUS_STRATEGY/`; if the code's mtime is newer than the referenced doc by > 14 days, CI warns.

---

## Improvements Nexus adopts (specific, measurable)

### IM-1. TypeScript end-to-end at module boundaries
- `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- All module public APIs export TS types — never raw objects
- Runtime validation at the edge via `zod`
- Implication for **C-004**: this principle effectively requires TypeScript — recommend ratifying C-004 as **YES, TypeScript**

### IM-2. Contract tests at every module boundary
- Each `@nexus/<module>/tests/contract/` directory
- Tests verify: input shape, output shape, error shape, idempotency, tenant isolation
- Goal: 100% of the public API surface covered by contract tests
- Contract test failures block merge

### IM-3. Schema-validated APIs
- API request/response shapes defined as `zod` schemas
- TS types derived from schemas (single source of truth)
- OpenAPI spec generated from schemas (`zod-to-openapi`)
- Request validation at the edge; structured 400 on malformed input

### IM-4. Observability from day 1
- Every request: trace ID (`x-request-id` propagated), structured JSON log, latency histogram
- Errors auto-reported with redacted PII (Sentry or self-hosted GlitchTip)
- Dashboards committed alongside code (e.g., Grafana JSON in `ops/dashboards/`)
- Karvia uses Pino in some engines; Nexus standardizes on Pino + OpenTelemetry across all

### IM-5. CI quality gates (the per-PR contract)

| Check | Threshold | Gate |
|---|---|---|
| ESLint + Prettier | 0 errors | Required |
| TypeScript | 0 errors | Required (once TS lands) |
| Unit tests | 100% pass | Required |
| Integration tests | 100% pass | Required |
| Statement coverage (changed files) | ≥ 80% per file | Required |
| Mutation testing | weekly job; alert if score drops > 5% | Informational |
| Secret scan (gitleaks) | 0 findings | Required |
| Push protection (GitHub) | 0 findings | Required |
| Dependency vulnerabilities (npm audit + Snyk) | 0 high/critical | Required |
| Doc freshness | no stale doc > 14 days | Warning |

### IM-6. Deployment safety
- Every schema migration is **reversible** (forward + back scripts, both tested)
- Every deploy has a **documented rollback** (Render dashboard + gh action)
- Feature flags for any non-trivial new behavior (no big-bang launches)
- Staging environment that mirrors prod shape; full E2E suite runs against staging before prod
- Karvia bar: rollback "via Render dashboard, manual." Nexus bar: < 5 minutes, documented runbook

### IM-7. Bootstrap-in-one-command DX
- `pnpm bootstrap` does everything: install deps, copy `.env.example` → `.env`, run migrations, seed demo data
- Target: new contributor running the full system in **< 10 minutes**
- Karvia bar: ~3 hours of stumbling through scattered docs (per `Karvia_OKR_Product_Planning/CLAUDE_ONBOARDING_GUIDE.md`)

### IM-8. Decision log as a first-class artifact
- Every architectural choice → `DECISIONS.md` entry with date, rationale, alternatives ruled out
- Code review checklist asks: "is there a DECISIONS.md entry for this?"
- Quarterly review: which decisions held up, which proved wrong, what to update

### IM-9. Knowledge capture dogfooding (`@nexus/knowledge`)
- Nexus uses its own knowledge-capture module internally
- Architecture decisions, incident postmortems, runbooks all live in the module
- Eats own dog food: every UX papercut surfaces a real customer issue
- Implication: the `@nexus/knowledge` module is a Night 4 priority, not a "nice to have"

### IM-10. The agent loop itself improves over time
- `TICK_PROTOCOL.md` is versioned (v1 today; future v2, v3...)
- Failed ticks → root cause → protocol improvement → JOURNAL retro entry
- The two dry-run ticks already surfaced: stash-pop hazard, auth-flip recovery, linter races. These are protocol bugs, not user errors. Fix them, version the protocol.

### IM-11. Karvia Reflection Gate (C-009) — why/what/how/when + relevancy
- Every element copied or inspired from Karvia carries a **reflection record** before it lands: **Why** are we doing this · **What** are we doing · **How** · **When** is the right time · **Relevant** for Nexus? · **Improving** anything? · **Complexity** added? · **Redundancy** created?
- Lightweight form: a disposition column in catalogue docs (see `DATA_MODELS.md`). Full form: the 8-question table in the lifting PR (worked example: `1-PRODUCT/NOF.md` § Reflection record).
- **Improvement sessions** (session type, see EXECUTION_PLAYBOOK) periodically re-run the reflection on already-lifted elements: can it be done better *within Nexus*? Verdict: keep / improve / replace, journaled.
- Enforcement: PR checklist line below; reviewer rejects a Karvia lift without a reflection record.

---

## Implications for the 3 open clarifications

This doc has direct implications:

- **C-003 (consolidate vs deploy engines)** → **AP-2 (deploy honesty)** strongly favors **consolidate**. Anything not deployed must be removed. Keeping 9 dead engines violates the principle.
- **C-004 (TS vs JS)** → **IM-1 (TypeScript end-to-end)** directly requires TS. Recommend ratifying C-004 as **YES**.
- **C-005 (`Program` entity)** → **AP-1 (no shared models)** and **AP-3 (data not code)** both push toward making `Program` a first-class entity. Without it, "Transformation OS" remains a tagline, not an architecture.

These remain human decisions, but the doc moves the burden of justification onto the "no" side for each.

---

## Quality gates every tick PR must pass

The agent's PR checklist (in `.github/PULL_REQUEST_TEMPLATE.md`, to be added Night 2):

```
[ ] Lint + format clean
[ ] Typecheck clean (once TS lands)
[ ] All affected tests pass
[ ] New code ≥ 80% covered (per file)
[ ] Secret scan clean
[ ] If schemas changed: migration is reversible + tested
[ ] If module boundary changed: contract tests updated
[ ] If behavior changed: matching doc updated in the same PR
[ ] DECISIONS.md entry exists for any non-trivial architectural choice
[ ] No new `// TODO` without a BACKLOG ID linked
[ ] No new module dependency without a note in DEPENDENCIES.md
[ ] If lifted/inspired from Karvia: reflection record included (IM-11 — why/what/how/when + relevancy/complexity/redundancy)
```

A PR failing any required item is not merged. The agent's tick protocol marks it BLOCKED and journals why.

---

## Out of scope (explicitly — the parking lot)

Things Nexus will **not** do in Nights 1–5, and why. Each rejected item has a reason; revisit only with explicit clarification.

| Rejected | Why |
|---|---|
| Microservices for v1 | Module boundaries via TS contracts achieve 80% of the value at 10% of the cost. Karvia's "engines" already showed the failure mode. |
| GraphQL | REST + typed clients (generated from OpenAPI) is enough. GraphQL adds an unavoidable maintenance layer. |
| Event sourcing | Overkill for v1. Mongo + explicit state transitions is sufficient. |
| Multi-region / multi-cloud | Premature. Render single-region for launch. |
| Custom UI framework | Vanilla JS (Karvia's pattern), or a thin layer (htmx / alpine / React without Redux). Defer the framework debate. |
| Rebuild auth from scratch | Lift Karvia's JWT+IAM pattern, harden it (rotate keys, add 2FA later, audit logs). Don't reinvent. |
| Rewrite the OKR domain beyond NOF | NOF (C-008) is the ratified, measured redesign: Objective → KR → Milestone → Task, dynamic + outcome-measured. No further domain redesign in v1. |
| AI-everywhere | Every AI feature has a non-AI fallback and an explicit cost ceiling. No AI-required code paths. |
| Real-time collaboration | Socket.IO exists in Karvia but lightly used; Nexus defers real-time to post-v1. |
| Mobile apps | Web-first, mobile-responsive. Native apps deferred. |

A tick that proposes one of these is rejected with reference to this section.

---

## How we'll know it worked

By end of Night 5, Nexus should beat Karvia on these measurable dimensions:

| Dimension | Karvia (baseline) | Nexus (target by Night 5) |
|---|---|---|
| Bootstrap time (clone → running) | ~3 hours, scattered docs | < 10 min, one command |
| Engines deployed vs declared | 2 of 10 deployed (8 dead) | 100% of declared = deployed |
| Cross-module model imports | Pervasive | 0 (lint-enforced) |
| Test coverage (statement) | unclear (no gate) | ≥ 80% gated per file |
| Secrets in commit history | 26 files with live creds | 0 (4 scan layers) |
| Config conflicts at boot | Port 8089 collision | 0 (validated config) |
| Time to ship a new assessment vertical | hardcoded — high | hours (new impl of pluggable interface) |
| Mean time to rollback a bad deploy | unclear, manual | < 5 min, documented runbook |
| Strategy docs aligned with code | 5+ ARCHIVE folders, stale | doc-freshness CI check |
| Architectural decisions traceable | scattered across CLAUDE.md, sprint docs | single `DECISIONS.md`, dated, linked |

Hit half → Nexus is materially better. Hit all → the lego-block architecture has earned its name.

---

## Implications for Nights 2–5

This doc adds constraints to every downstream tick. Specifically:

| Night | What this doc requires |
|---|---|
| **N2** (refactor + modularize) | TS toolchain setup (IM-1), CI gates wired (IM-5), AP-1 lint rule, AP-4 migration registry, KeyResult dual-write closed atomically |
| **N3** (AI Readiness assessment) | 100% data-driven (AP-3), question bank as seed data, scoring rubric as config |
| **N4** (SaaS plumbing + DB) | Secret-handling 4-layer (AP-5), `Program` entity if C-005=YES, `@nexus/knowledge` v1 (IM-9), feature flags scaffolded |
| **N5** (deploy + tighten loop) | Deploy honesty (AP-2) — no engine ships that isn't tested, rollback runbook (IM-6), observability live (IM-4), TICK_PROTOCOL v2 informed by N1–N4 retros |

---

## How this doc itself evolves

This is a living document. Update rules:

1. **Add an anti-pattern** when a Karvia review or Nexus retro reveals a new one. Cite evidence.
2. **Add an improvement** when an anti-pattern's fix has a concrete enforcement mechanism. Don't list "good ideas" without enforcement.
3. **Remove a parking-lot entry** only with an explicit clarification answer and a `DECISIONS.md` entry.
4. **Never relax a quality gate** without writing why in `DECISIONS.md`. Gates ratchet up, not down.
