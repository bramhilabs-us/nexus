# Nexus — Claude Awareness

**Repository**: bramhilabs-us/nexus
**Owner**: BRAMHI Labs
**Bot identity**: bramhi-bot
**Last Updated**: 2026-06-03

---

## What Nexus is

**Nexus** is a SaaS platform for consultants running **AI Readiness & Transformation** engagements with their clients.

It is a **fork of `karvia_business`** with one substantive change: the **Assessment** module is swapped from SSI (business assessment) to **AI Readiness**. Everything else — CRM, Objectives, Key Results, Weekly Goals, Tasks — is preserved but refactored into clean **lego-piece modules**.

### Same as Karvia
- Consultant-driven engagement model (consultant → client → manager → employee → owner)
- OKR-led delivery cadence
- Multi-role authority hierarchy
- Engine-based microservice architecture

### Different from Karvia
- Assessment surface: **AI Readiness** instead of SSI
- Modular pluggable assessment interface (multiple assessment types possible)
- Fresh MongoDB instance, fresh tenant model
- Clean module boundaries: `@nexus/crm`, `@nexus/objectives`, `@nexus/key-results`, `@nexus/weekly-goals`, `@nexus/tasks`, `@nexus/assessment`

---

## Source-of-Truth References

| What | Where |
|---|---|
| Karvia codebase (read-only reference) | `/Users/sagarrs/Desktop/official_dev/karvia_business/` |
| Karvia docs snapshot (frozen reference) | `_source/` |
| Nexus strategy docs (T0–T4) | `NEXUS_STRATEGY/` |
| Agent loop state | `_agent/` |
| Sprint definitions | `_agent/SPRINTS_NIGHT_N.md` |

---

## Hard Rules for the Agent

1. **`karvia_business/` is READ-ONLY.** Never write, edit, delete, or move anything under that path. Reads only.
2. **No secrets in commits.** Never include `.env`, API keys, DB connection strings, tokens. Verify before every commit.
3. **Tests as ground truth.** A task is not done until tests are green and CI passes.
4. **Journal every tick.** Append to `_agent/JOURNAL.md` on every loop iteration — what was attempted, outcome, files touched.
5. **Ask, don't guess.** When the sprint is ambiguous, append to `_agent/clarifications.md` and pick the next clearer task. Do not invent product decisions.
6. **One tick = one PR-sized unit.** Branch → work → PR → exit. No long-running branches across ticks.
7. **Modular contracts first, code second.** When building a module, write the interface + contract test first, then the implementation.

---

## Doc Hierarchy (T0–T4)

| Tier | Folder | Purpose |
|---|---|---|
| **T0** | `0-BUSINESS/` | Positioning, GTM, stakeholders, business model |
| **T1** | `1-PRODUCT/` | Vision, capabilities, roadmap, user journeys |
| **T2** | `2-TECHNICAL/` | Architecture, API specs, data models, contracts |
| **T3** | `3-DELIVERY/` | Sprints, QA, releases, runbooks |
| **T4** | `4-CUSTOMER/` | Interviews, feedback, evidence, metrics |

---

## Available Commands

| Command | Purpose |
|---|---|
| `/init` | Load context, restore from JOURNAL + BACKLOG |
| `/nexus-tick` | One iteration of the autonomous loop |
| `/close` | Journal, commit, push, exit cleanly |
| `/sprint-load` | Read SPRINTS_NIGHT_N.md, populate BACKLOG |
| `/audit` | Read-only audit pass against the codebase |
