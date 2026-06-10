# Nexus — Claude Awareness

**Repository**: bramhilabs-us/nexus
**Owner**: BRAMHI Labs
**Bot identity**: bramhi-bot
**Last Updated**: 2026-06-09

---

## What Nexus is

**Nexus is a Transformation OS.**

A multi-tenant platform that lets any organization — directly, or through a consultant — run a transformation program end to end: assess readiness, govern the program, set objectives and key results, drive weekly execution, capture institutional knowledge, and measure business outcomes. **AI transformation consulting is the GTM beachhead** (C-006): BRAMHI delivers AIR Strategic Assessments and transformation engagements *through* Nexus, then hands Nexus over so the client's product teams keep it as their project-management OS (with srishti as the document/intelligence add-on). The architecture is built so that any future transformation vertical (ESG, digital, ops excellence, M&A integration) plugs in as a new assessment + a new playbook on the same lego blocks. Strategy pack entry point: `NEXUS_STRATEGY/00_NORTH_STAR.md`.

It is a **fork of `karvia_business`** at the code level — Karvia's CRM + OKR engines are the seed — but Nexus is repositioned and re-architected:

### What Nexus inherits from Karvia
- Engine-based microservice architecture
- Multi-role authority hierarchy (org → manager → employee → owner)
- OKR-led delivery cadence — sharpened into **NOF** (Objectives → Key Results → Milestones → Tasks; dynamic, outcome-measured; see `NEXUS_STRATEGY/1-PRODUCT/NOF.md`)
- MongoDB + Render + Docker infra patterns

### How Nexus differs
- **Transformation OS positioning** — not consultant-only; org-direct is a first-class GTM motion
- **Pluggable Assessment** — the interface is the primitive; **AIR (AI Readiness Intelligence Rating) ships v1**; SSI is NOT carried over (Karvia reference only, C-006); any future assessment is a new impl folder
- **Lego-block modules** with published contracts — every capability is composable
- **Two new first-class modules**: `@nexus/governance` (program oversight) and `@nexus/knowledge` (institutional knowledge capture)
- Fresh MongoDB instance, fresh tenant model
- Multi-program-per-tenant from day one (org runs many transformations concurrently)

### The 8 lego blocks
```
@nexus/crm              tenants, organizations, people, roles
@nexus/assessment       pluggable interface — AIR ships v1; future verticals plug in
@nexus/objectives       O of OKR
@nexus/key-results      KR of OKR
@nexus/milestones       ~1-week milestones, objective-relative (NOF)
@nexus/tasks            atomic work units
@nexus/governance       program oversight, accountability, decision rights
@nexus/knowledge        institutional knowledge capture, outcome evidence
```

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
