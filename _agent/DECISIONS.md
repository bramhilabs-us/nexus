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

---

## 2026-06-04 — Consolidate engines into the main server (C-003 answered)

**Context**: Karvia declares 10 engines (ports 8081–8089) but Render only runs the main server + IAM sidecar. The other 8 engines are dead code paths in production. We had to choose between (a) consolidate into one process, (b) genuinely deploy each as its own Render service, or (c) hybrid.

**Decision**: **Consolidate.** Nexus is a single Express app with module boundaries enforced by TypeScript contracts, not process boundaries.

**Alternatives considered**:
- (b) Genuinely deploy each engine: rejected — premature for current load, multiplies ops cost, no isolation benefit at v1 scale.
- (c) Hybrid: rejected — has the ops complexity of (b) for the parts split out and the discipline problem of (a) for the parts kept together. Picks the worst of both.

**Consequences**:
- All "engines" become modules under `src/modules/<name>/` in the main server, not separate Node processes.
- The 10-engine port mapping in Karvia is discarded. Port conflict (8089) becomes moot.
- Module isolation is enforced by TS interfaces + ESLint `no-restricted-imports`, not process boundaries.
- Render deploy is one service per environment; no multi-service orchestration to design.
- Aligns with `IMPROVEMENT_PLAN.md` AP-2 (deploy honesty — what runs is what's defined).
- If/when a module needs genuine isolation (compute-heavy, different SLA), it can be extracted later. Decision is reversible per-module.

---

## 2026-06-04 — TypeScript end-to-end on the server (C-004 answered)

**Context**: Module contracts are the heart of the lego-block architecture. TS interfaces enforce them at compile time; JS + JSDoc enforces by convention only.

**Decision**: **TypeScript** for all server-side code in Nexus. `tsconfig.json` will run in strict mode (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`). Public APIs export only TS types — never raw objects.

**Alternatives considered**:
- JS + strict JSDoc: rejected — autonomous agent commits will silently introduce type errors a human reviewer would catch. The compiler is a free reviewer.
- Gradual (TS for new modules only): rejected — produces a JS/TS boundary that becomes its own friction point. Better to migrate the lift in Night 2 once than to maintain a dual-language codebase.

**Consequences**:
- Night 2 includes a one-time TS toolchain setup (tsconfig, eslint, prettier, ts-node, jest with ts-jest or vitest).
- Lifted Karvia JS files are converted to TS as part of the modularization pass. Mostly mechanical (add types, fix obvious issues that JS hid).
- Runtime validation at the edge via `zod` — types describe shape, zod enforces it at the boundary.
- Client (`client/`) stays vanilla JS for v1 — TS migration there is deferred (see `IMPROVEMENT_PLAN.md` parking lot, "custom UI framework").

**Implementation note**: package manager is `pnpm` for workspaces (cleaner module-per-folder support than npm).

---

## 2026-06-04 — Program as a first-class top-level tenant entity (C-005 answered)

**Context**: Karvia's tenancy is flat — `Company → Users → Objectives`. The Transformation OS positioning (C-001) requires that one Company can run multiple concurrent transformation programs (e.g., "AI Readiness 2026," "Digital Transformation Phase 2," "Customer Success Internal") — each with its own assessment, OKR tree, members, timeline, and outcome.

**Decision**: **Yes — introduce `Program` as a first-class top-level entity.** Tenancy becomes `Company → Program → Objective`.

**Schema**:
```
Program {
  _id, company_id, name, vertical, start_date, end_date,
  status (active | completed | paused),
  members[], assigned_consultants[], owner_user_id,
  assessment_id, outcome { score, narrative, evidence_refs[] }
}
```

Every domain model gains a required `program_id`: `Objective`, `KeyResult`, `Goal`, `WeeklyGoal`, `Task`, `Move`, `Assessment`, `Comment`. Users get a `program_memberships[]` array (same person can hold different roles in different programs).

**Alternatives considered**:
- Defer (implicit single program per company, retrofit later): rejected — the retrofit means adding a required field to every doc, backfilling every existing record, and rewriting every query. We pay 3–4 days now or 3–4 weeks in 6 months. Fresh DB is the cheapest time this decision will ever cost.
- Tag (`program: string` field, no entity): rejected — looks like the feature but isn't. Can't model program members, program-scoped assessments, or program lifecycle. Brittle.

**Consequences**:
- All tenancy queries change from `{ company_id: X }` to `{ company_id: X, program_id: Y }`. Mechanical but pervasive.
- Permissions model gets one dimension wider: a user can be a Manager in Program A and an Employee in Program B.
- UI needs a program switcher in the global nav.
- Sharing across programs (people directory, company branding) is explicit — those entities stay at the Company level; everything else is Program-scoped.
- Enables the AI Readiness module to model a real engagement: program starts → assessment runs → objectives generated from score → execution happens → program ends with outcome record.
- Enables clean consultant access scoping: a consultant sees only the programs they're assigned to, even within the same Company.
- Enables outcome measurement per program (the whole point of the Transformation OS positioning).
- Implication for `N1-P3-01` (positioning docs): GTM model is "per active program," not "per company." Pricing follows.

**Supersedes**: Karvia's implicit single-OKR-tree-per-company tenancy model.


---

## 2026-06-09 — AI transformation consulting is the beachhead; AIR replaces SSI (C-006)

**Context**: C-001 ratified the broad Transformation OS scope. The founder sharpened the go-to-market in the 2026-06-09 interactive session: BRAMHI runs AI transformation consulting for product-development companies as the wedge, with Nexus as both the delivery instrument and the handed-over product (the client's product teams keep Nexus as their project-management OS, with srishti as the document/intelligence add-on).

**Decision**:
1. **AI transformation consulting is the explicit GTM beachhead.** The engagement: onboard client → AIR Strategic Assessment (two-week discovery sprint) → deliverables (AIR Score, Opportunity Register, Risk Register, 90-day plan, 12-month roadmap, BRAMHI baseline) → transformation engagement executed as OKRs in Nexus → handover.
2. **AIR (AI Readiness Intelligence Rating) is the v1 assessment** — five dimensions (Leadership, Workforce, Process, Data, Execution), evidence-based (the company's operating journey is the input; AIR is the output).
3. **SSI is dropped from Nexus.** Not lifted, not shipped — it remains a Karvia reference example in `_source/` only. The assessment block is fully generic (`AssessmentProvider`: instruments, evidence, scoring, deliverables); any future assessment is a new impl folder.
4. **Handover is a first-class program lifecycle transition** (engagement mode → builder mode); **srishti integrates behind a published contract** owned by `@nexus/knowledge`, declared OPTIONAL with tested fallback.
5. **New minimalistic design language** — Nexus does not inherit Karvia's visual design. Founder's design docs to land in `1-PRODUCT/design/`; UI build sessions blocked on them (PQ-3).

**Alternatives considered**:
- Keep "AI Readiness" generic without the consulting methodology: rejected — the two-week sprint, deliverables, and pricing ARE the business; the product must encode them or the consulting runs in slide decks.
- Lift SSI as a second impl to prove pluggability: rejected — it carries Karvia's hardcoded-bank legacy for no revenue; pluggability is proven cheaper by the Night 3 second-provider drill.

**Consequences**:
- New pack card: `NEXUS_STRATEGY/0-BUSINESS/AI_CONSULTING_PLAYBOOK.md` (AIR framework, sprint, deliverables, pricing, collateral). North Star, Product, Tech, Execution cards adapted.
- `AssessmentProvider` contract generalizes from question/score to instruments/evidence/score/deliverables.
- Client pipeline stages become Prospect → Assessing → Engaged → Handed over.
- N1-P4-02's ASSESSMENT_INTERFACE_SPEC targets the generalized contract; AIR is the worked example.
- `.claude/CLAUDE.md` positioning updated (SSI references removed).

**Refines**: C-001 (scope stands; GTM sharpened). **Supersedes**: all SSI-as-Nexus-impl references in prior docs.
