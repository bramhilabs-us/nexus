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

---

## 2026-06-03 — Nexus is a Transformation OS, not just a consultant SaaS (C-001 answered)

**Context**: Two positioning framings were on the table — narrow (SaaS for consultants running AI readiness engagements) and broad (multi-tenant Transformation OS for organizations to run any transformation program). Required answer before writing 0-BUSINESS and 1-PRODUCT docs.

**Decision**: **Broad — Nexus is a Transformation OS.** The platform supports any organization (direct buyer) or consultant (intermediary buyer) running any transformation program. AI Readiness is the first vertical assessment available; the architecture treats it as one pluggable lego block among many.

**Implications for the lego-block architecture**: the broad scope is the *reason* for the modularization, not just a side effect. Every capability — Assessment, Objectives, Key Results, Weekly Goals, Tasks, CRM, Governance, Knowledge Capture, Outcome Measurement — is a composable block. Different transformation programs (AI readiness, ESG, digital, ops excellence, M&A integration) become different compositions of the same blocks plus a vertical assessment.

**Alternatives considered**:
- Narrow consultant SaaS: rejected — too small for the platform investment; the lego-block work is overkill if the only use case is consultant-led AI readiness.

**Consequences**:
- Positioning docs lead with "Transformation OS" + "AI Readiness as the launch vertical"
- The Assessment module's pluggable interface is the *first-class* primitive, not just a Nexus-vs-Karvia delta
- Two additional modules become first-class: `@nexus/governance` (transformation program oversight) and `@nexus/knowledge` (institutional knowledge capture) — both mentioned in the GitHub repo description
- GTM positioning: consultant-led is one motion; direct-to-organization is another; same product
- Pricing model becomes per-tenant + per-active-program, not per-consultant

**Supersedes**: implicit narrow framing in earlier conversation

---

## 2026-06-03 — Karvia git history will NOT be purged; credentials rotated only (C-002 answered)

**Context**: Karvia's committed docs contain live production credentials (OpenAI, Mailjet, JWT, Session, Mongo). Three options were on the table — rotate only, rotate + purge history, or do nothing.

**Decision**: **Rotate credentials only.** Karvia git history stays intact.

**Owner**: human (rotation), not the agent.

**Consequences**:
- The strings in Karvia's history become inert once credentials are rotated.
- If Karvia ever becomes public-facing or shared externally, this decision needs revisiting.
- Nexus's `_source/` keeps the `[REDACTED]` versions — that decision stands regardless.
- For Nexus itself: secret scanning + push protection are enabled at the bramhilabs-us repo level; the agent must also run `redact-secrets.py` as a pre-commit step on every tick that touches files originating from `_source/`.

