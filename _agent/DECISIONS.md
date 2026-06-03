# Architectural Decisions

Dated, append-only. Each decision is final unless explicitly superseded by a later entry.

Format:

```
## YYYY-MM-DD — <short title>
**Context**: why we needed to decide
**Decision**: what we chose
**Alternatives considered**: what we ruled out and why
**Consequences**: what this commits us to
**Supersedes**: <date+title of previous decision, if any>
```

---

## 2026-06-03 — Nexus forks from Karvia at the docs level, not git history

**Context**: We need a clean codebase for Nexus without inheriting Karvia's commit history, secrets, or path-coupled references.

**Decision**: Treat `karvia_business/` as a read-only reference. Build `nexus/` fresh with its own git history. Copy docs (after sanitization) into `_source/` for reference and rewrite into `NEXUS_STRATEGY/`. Copy code Night 2+ via scripted lift.

**Alternatives considered**:
- Fork the Karvia git repo: rejected — drags history, secrets in old commits, large repo size
- Clean-room rewrite: rejected — wastes ~80% reusable code

**Consequences**:
- Karvia commit attribution does not transfer
- No git-level diff between Karvia and Nexus — must maintain explicit `NEXUS_VS_KARVIA_DIFF.md`
- Cleaner blame, smaller repo

---

## 2026-06-03 — Modular lego architecture for Nexus

**Context**: Karvia's engines are coupled to a single product use case (OKR for SMB). Nexus needs to be a platform where the Assessment module is pluggable (SSI today, AI Readiness for Nexus v1, future assessments later).

**Decision**: Refactor into 6 modules with published contracts: `@nexus/crm`, `@nexus/objectives`, `@nexus/key-results`, `@nexus/weekly-goals`, `@nexus/tasks`, `@nexus/assessment` (interface) + `@nexus/assessment-ssi` and `@nexus/assessment-ai-readiness` (implementations).

**Alternatives considered**:
- Keep current engine boundaries: rejected — Assessment can't be cleanly swapped
- Microservice extraction per module: deferred — premature for v1, revisit at scale

**Consequences**:
- Night 2 is a refactor pass with no behavior changes
- Contract tests become first-class
- New assessment types are an additive change

---

## 2026-06-03 — MongoDB Atlas is the database

**Context**: Karvia uses MongoDB. User specified MongoDB for Nexus.

**Decision**: Nexus uses MongoDB Atlas. Fresh cluster, fresh credentials. No data migration from Karvia.

**Alternatives considered**:
- Postgres: rejected — would force rewriting all Karvia data access layers
- Self-hosted Mongo: rejected — Atlas is operationally cheap for v1

**Consequences**:
- Schema lives in Mongoose models (Karvia pattern continues)
- Mongo connection string never appears in committed files — `.env` only
