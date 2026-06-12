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

---

## 2026-06-09 — Document genome, session chain, 5-command process (C-007)

**Context**: Karvia's ~280 sessions paid repeatedly for document drift (215 "regression" / 120 "drift" / 50 "stale" mentions in SESSION_LOG): stale epics contradicting handoffs, mockups built from superseded specs, 16 slash commands whose bookkeeping itself drifted. srishti's DOCUMENTATION_GRAPH defines the cure (metadata genome + dependency graph + propagation); Karvia's inline `@GENOME` comment tags were the failed version (unreadable, unenforced — Nexus initially rejected them outright in MASTER_GUIDE).

**Decision**:
1. **Document genome adopted** — every governed doc (`NEXUS_STRATEGY/`, `src/`, `client/`, `tests/`) opens with YAML frontmatter: `id, tier, status, owner, summary, parents, children, revisit(on/stage)`. Spec + registry + propagation rules in `NEXUS_STRATEGY/DOCUMENTATION_GRAPH.md`.
2. **Machine enforcement** — `.claude/hooks/doc-graph-check.py`: no orphans (all docs reachable from 00_NORTH_STAR), bidirectional edges, unique ids, staleness warnings (child not updated within 14 days of a parent change). Red graph blocks `/close`. Propagation is notification-first: T0/T1 changes flag children for human review; T2 changes the agent patches in the same PR.
3. **Session chain** — `_agent/NEXT_SESSION.md` is the card every session ends by writing and every session starts by reading. `/init` is the only command a human needs; session *types* (strategy/contract/coding/test/audit/sprint-planning/general) are data on the card, each with its own scan list. "general" sessions are free-form and do not consume the card.
4. **5 commands, not 16** — init, close, nexus-tick, sprint-load, audit. Karvia's per-session-type commands are replaced by the typed card.
5. **Session practices codified** — `.claude/SESSION_PRACTICES.md` distills Karvia's lessons (pre-scan is the work; newer decision beats older spec; re-sum tables; tokens before mockups; grep before trusting; quality self-score per session).

**Alternatives considered**:
- srishti's full genome (doc_id/schema_version/surface/lifecycle_node/content_contract/edges.kind/propagation thresholds): rejected for v1 — more metadata than a 2-person + agent team will maintain; fields can be added later per DOCUMENTATION_GRAPH's evolution rule.
- No enforcement (genome as convention): rejected — Karvia proved conventions decay; the validator is the difference.

**Consequences**:
- Code skeleton exists now (`src/modules/<8>/README.md`, `client/`, `tests/`) so every future code file has a governed parent from day one.
- BRAMHI brand guide moved to `1-PRODUCT/design/brand/`; `DESIGN_LANGUAGE.md` translates it (PQ-3 resolved; token-first rule prevents Karvia's drifting-hex bug).
- CI gains the doc-graph check as a required gate in Night 2.
- Supersedes MASTER_GUIDE's "no genome tags" stance (the objection was to Karvia's *implementation*, not the idea).

---

## 2026-06-09 — NOF: the Nexus Objective Framework (C-008 answered)

**Context**: The data models catalogue (N1-P2-02) surfaced that Karvia's code-truth hierarchy is `Objective → KR → Goal(quarterly, self-nesting) → WeeklyGoal(ISO weeks) → Move`, with Task requiring `goal_id` — while the Nexus strategy docs described a compressed chain. The founder resolved it by defining the framework outright.

**Decision**: **NOF** — `Objective → Key Results → Milestones (~1 week each) → Tasks`. Specified in `NEXUS_STRATEGY/1-PRODUCT/NOF.md`. Core properties:
1. **Goal and Move dropped.** Four levels, no more.
2. **Fully dynamic**: objectives start/end on any day; milestones/KRs/tasks align to the objective's own window; no ISO weeks, no quarters[]. 6–7 self-rolling objectives per org.
3. **Outcome-measured**: KRs measure progress; an outcome record at objective close (descended from Karvia's OKROutcome) measures what actually changed; Sustained stage tracks it year-over-year; program-level aggregation feeds @nexus/knowledge.
4. **Self-evolving**: the assessment module periodically runs an NOF-effectiveness check (designed N4) — the framework that assesses the org also assesses itself.

**Alternatives considered**: (b) lift all 6 levels — rejected, carries calendar ritual and layers the 6-page UI never surfaces; (a) plain fold — superseded by NOF, which also fixes the progress-vs-outcome flaw.

**Consequences**: `@nexus/weekly-goals` module renamed `@nexus/milestones`; WeeklyGoal reshaped to Milestone (ordered, objective-relative dates); Task re-parents to milestone_id; KR loses quarters[]/year; DATA_MODELS dispositions updated; N1-P4-01 OKR-chain contracts unblocked.

---

## 2026-06-09 — Karvia Reflection Gate: why/what/how/when + relevancy (C-009)

**Context**: Founder directive — everything copied or inspired from Karvia must pass a self-reflection before it lands in Nexus. Improvement sessions evaluate whether each incorporated element can be done better.

**Decision**: Every Karvia lift carries a **reflection record**: **Why** are we doing this · **What** are we doing · **How** · **When** is the right time · **Relevant?** for Nexus · **Improving?** anything · **Complexity added?** · **Redundancy created?** Enforced as IM-11 in IMPROVEMENT_PLAN (PR checklist line) and SESSION_PRACTICES rule 10. A new **improvement** session type re-evaluates already-lifted elements ("can it be better within Nexus?").

**Consequences**: DATA_MODELS-style disposition tables are the lightweight form (disposition column = the reflection verdict); module-level lifts in N2 carry the full 8-question record in their PR; NOF.md § "Reflection record" is the worked example.

---

## 2026-06-10 — iBrain delegation: local-first behind iBrain-shaped contracts (C-010)

**Context**: Session-19 repositioned the ecosystem: BRAMHI = the parent company; Nexus = the delivery system (the front-end where the work happens); **iBrain = ALL intelligence/engine capability** (IQaaS — seven engines: Universal Adapter, Tracking, Observer, Scoring, Planner, Assessment, IAM). The lineage insight: Karvia's "dead engines" are iBrain's ancestors — extracted into a platform, not killed. Ratified session-20; recorded here.

**Decision**:
1. **Nexus never rebuilds intelligence.** It consumes iBrain through published contracts using the **Hybrid Intelligence Pattern** (iBrain recommendation + local business logic + tested fallback).
2. **v1 ships local-first**: each scoring/matching/nudge capability is implemented locally as the fallback leg, shaped like iBrain's interfaces — swapping to live iBrain is configuration, not refactor.
3. **Event emission starts early** (domain events shaped for the Universal Adapter); live Planner/Scoring calls target N4.
4. **C-003 (consolidate) survives**: it governs the Nexus app. iBrain is a separate BRAMHI platform service, never a Nexus engine.

**Consequences**: TECH_STRATEGY gains the iBrain consumption architecture (queued); API_SURFACE's `objectives/ibrain/*` disposition flips from "✄ not carried" to "seam ancestor — revisit"; the shadow-schema problem dissolves behind iBrain's API; the client's dev-stack telemetry (git, CI, AI usage/billing) ingests through iBrain's event pipeline (constitution §5.5).

**Refines**: C-003.

---

## 2026-06-10 — The scoring model: six drivers → BOQ (C-011)

**Context**: The BOQ whitepaper and BOQ_FRAMEWORK.md disagreed on the score family. Session-20 reconciled them via question batches; the constitution (§5, Appendices B–D) is the canonical statement. Recorded here.

**Decision**:
1. **Six drivers**: ARS · BPI · CFS · **BRQ** (rhythm name settled — Business Rhythm Quotient, over RAQ) · FLS · **CRS** (KRP renamed — Consolidation Readiness Score; "Karvia Replacement Probability" was self-referential). Knowledge Intelligence demotes to a BPI pillar (weight 0.25); CRT demotes to a signal feeding CRS — both traceable one layer down.
2. **BOQ = geometric mean** of the six, each clamped [1, 100] (the floor guard); BOQ measures balance. **BOQ expands to "Business Operating Quotient"** (brand guide + founder 2026-06-10).
3. **Five bands** for every 0–100 score: Reactive 0–30 · Operational 31–50 · Structured 51–70 · AI-Ready 71–85 · AI-Native 86–100.
4. **ARS ≡ AIR Score** — one number, two contexts.
5. **Tier-placement normalization**: every score is a 0–100 position between published newbie and top-0.1% anchors; raw values are evidence, never scores. **Provenance labels** (Proxy / Partially Measured / Measured) always displayed; BOQ inherits the weakest among its drivers.
6. **Two stacks + two visuals** kept as views of one model: the disclosure stack and the measurement stack; the **Organizational Map** (executive 2-axis: rhythm × efficiency) and the **Bridge** (the compounding-engine explainer).
7. **BPI formula v1** (whitepaper): `100 × Velocity^0.30 × Quality^0.15 × Knowledge^0.25 × CapitalEfficiency^0.30`, fed by the Eight Metrics; calibration constants are trade-secret configuration (Article 5).

**Supersedes**: BOQ_FRAMEWORK.md's score family (Knowledge Intelligence / CRT / KRP as top-level) and the "BRAMHI Organizational Quotient" expansion everywhere it appears.

---

## 2026-06-10 — Assessment conduct: packages, question derivation, calibration (C-012)

**Context**: Session-20 ratified how assessments are conducted, scored, and interpreted. Recorded here.

**Decision**:
1. **Three instrument classes, one engine**: survey (flashcard decks, audience-split founder/manager/member), observed (interviews, workshops, floor observation), telemetry (live signals — both Nexus usage AND the client's engineering stack).
2. **An assessment = a package**: instruments × audiences × moments (first_time / recurring / pulse). AIR is the first package; "BOQ Discovery" (the whitepaper's week-1 lite) is a candidate cheap second package — proof of the lego claim.
3. **Questions derive from the metric model, never invented per assessment** (Article 5). Question schema: `{audience, moment, section, answer_type, maps_to:[metric, weight]}` — the bank is data, the weights are config, neither is ever hardcoded.
4. **Calibrate, never invent** (the Day-10 workshop rule, Article 4): every human adjustment annotates its justifying evidence.
5. **Interpretation drives the Opportunity Register mechanically**: weakest drivers → ranked opportunity categories; every displayed score carries band + provenance + evidence drill-down (Article 6).

**Consequences**: SCORING_MODEL.md (new T2 doc, queued) owns the schema and calculator contracts; AI_CONSULTING_PLAYBOOK maps AIR's 5 dimensions ↔ the 6 question sections.

---

## 2026-06-10 — Brand & layout: two-tier brand, sidebar shell (C-013)

**Context**: The NEXUS product brand guide landed 2026-06-10 (`design/brand/NEXUS1BRANDGUIDE.png`); ExternalCom's BRAMHI BRAND_GUIDELINES v2 validated the parent tier. Ratified session-20; recorded here.

**Decision**:
1. **Two-tier brand architecture**: **BRAMHI Labs** (parent — lotus, Cinzel/Playfair/Inter, purple-lavender) for consulting collateral and whitepapers; **NEXUS** (product — Sora display + Manrope body + Cormorant taglines, teal + gold accents, own lotus-derived logo system) for ALL product surfaces.
2. **Sidebar navigation shell** (the brand guide's application example) adopted across all 10 mockup surfaces.
3. Work queued: tokens.css v2 re-extraction from the NEXUS guide → DESIGN_LANGUAGE two-tier rework → mockup re-skin → hex/token/contract verification gates re-run.

**Supersedes**: the single-tier (BRAMHI-only) brand assumption in DESIGN_LANGUAGE. **Absorbs**: N1-P2-08's NEEDS-FOUNDER-REVIEW status (the review verdict is this rework).

---

## 2026-06-10 — The constitution and the 4+1 ladder (C-014)

**Context**: Session-20 wrote `NEXUS_STRATEGY/01_NEXUS_MODEL.md` as the constitutional document for Nexus. Ratified in-session; recorded here.

**Decision**:
1. **01_NEXUS_MODEL.md is the constitution**: where any document disagrees with it, the constitution wins and the other gets revised. Amendments only by founder ratification + a dated DECISIONS entry (Article 12).
2. **The 4+1 ladder**: **Prospect → Measure → Align → Transform → Evolve** — the brand-tagline verbs are the stage names; the journey is the loop's first lap. Pipeline badges read Prospect · Measuring · Aligning · Transforming · Evolving.
3. **Catalyst = the commitment moment**, the doorway into Align (the trinity rule, Article 8, governs all eight brand components: practice + place + gauge).
4. **Target market v1**: companies that build software — digital products and services; all v1 metrics, playbooks, and benchmarks calibrated for them.
5. **Dev-stack telemetry ingestion is load-bearing**: the Eight Metrics live in the client's engineering infrastructure, not inside Nexus; Nexus must ingest that data (via iBrain) or the most saleable gauges stay consultant-collected snapshots.
6. **States are statements of measurability, not badges**; authority flows down the ladder, conviction flows up; "BOQ becomes the industry standard" is BRAMHI's journey, never a client stage.

**Supersedes**: the C-006-era pipeline names (Prospect → Assessing → Engaged → Handed over / Builder / North Star) everywhere they appear — BOQ_FRAMEWORK § maturity journey, PRODUCT_STRATEGY badges, DATA_MODELS / TECH_STRATEGY stage references (revisions queued).

---

## 2026-06-11 — The NBM model: the Staircase, the equality, score ≠ prediction (C-015)

**Context**: The 2026-06-10 founder brainstorm (captured as `NEXUS_STRATEGY/02_NBM_MODEL.md`, status draft) was finalized this session after a devil's-advocate simulation (Works24 walked end-to-end through the staircase + a 15-archetype portfolio run).

**Decision**:
1. **The Staircase is ratified** as the constitution's signature diagram: each stage *enters on the previous stage's deliverable, raises one focus score head-on, and hands over a deliverable that is the next stage's floor*; it terminates in the **BOQ ⇄ NBM equality** — a number and a sentence, the same truth in two notations. The ladder table remains as its per-state detail.
2. **The structure/theory split is binding**: the staircase's shape is constitutional; *which* score sits in *which* brick (ARS→Measure, BRQ→Align, the engine four→Transform) is v1 theory, calibrated by real engagements. The v1 theory is itself the first NBM the system ever gives — the consultant's prior, sharpened per segment by the cohort.
3. **Deliverable names**: Measure → **the Roadmap** · Align → **the Cadence** (a team moving in rhythm on the roadmap) · Transform → **the Measured Engine** (live gauges + outcome records) · Evolve → the equality itself. *(Proposed this session — founder confirms at constitution read-through.)*
4. **"Ensure" is internal shorthand only** — the founder-sketch word for the apex guarantee; never client-facing (Evolve is the brand verb). *(Proposed — founder confirms at read-through.)*
5. **"Discover" = Measure**: the brainstorm's bottom-brick name canonizes as **Measure** (the tagline's verb); Discover survives as a glossary synonym.
6. **Article 13 — score ≠ prediction**: scores are auditable arithmetic, traceable to signals (Nexus computes); predictions are learned models (iBrain predicts); an NBM is always displayed as a recommendation with a confidence and a why — never as a fact.
7. **The causal-correctness requirement**: company-altitude NBM = the weakest-driver gradient of the geometric mean **informed by the Bridge's causal edges** — drivers are coupled (ARS enables BRQ enables the engine), so the gradient alone can point at a symptom whose cause sits upstream.
8. **NBM at three altitudes** (company / team / person) ratified; the BOQ ↔ NBM correlation is a stated **hypothesis** until the measured cohort exists (constitution honest limits).

**Refines**: C-011 (the equality gives BOQ its commercial role: *NBM is the product; BOQ is the trust certificate*).

---

## 2026-06-11 — The measurement library and the scope decisions (C-016)

**Context**: The devil's-advocate simulation stress-tested the staircase against Works24 (software-enabled services, 29 people, ~5 engineers) and 15 company archetypes. **The structure held in all 16 runs; every failure was theory-layer** (metric scope, anchors, floors, segments, altitudes). Eight decisions close the exposed gaps; founder ratified all eight this session.

**Decision**:
1. **One document per score** — new `NEXUS_STRATEGY/0-BUSINESS/scores/`: **BOQ.md is the core model** (aggregation, provenance inheritance, bands, anchor packs, reserved-seats registry) + ARS / BPI / CFS / BRQ / FLS / CRS.md on one shared template (identity · Bridge position · signals · instruments · floors **+ size conditioning** · versioned anchors · provenance path · staircase position · gaming exposure · known misfits · calibration log). **BOQ_FRAMEWORK.md is absorbed into scores/BOQ.md** (its 4-layer stack collapses into signals→drivers; the Bridge survives as the causal view; the old family's demotion mapping is recorded).
2. **BOQ's referent = the company**: signals are collected program-scoped (work happens there); drivers compute company-level (BPI/CFS/BRQ aggregate across programs; FLS/ARS/CRS are inherently company-wide); program-level views are **program gauges** — diagnostics, never called a BOQ. Two genuinely unlike businesses in one legal entity = two companies in Nexus (tenancy edge, noted not designed for).
3. **Scope honesty**: BOQ measures the **operating engine, not market direction** — a company can run a flawless engine and build the wrong product. The NBM claim is scoped to *operating* moves. A **market/customer-signal driver** and the founder's **Culture Score** are *reserved seats* in BOQ.md — registered candidates, not v1 drivers.
4. **The appraisal posture stays deliberately open** (no binding anti-gaming article): Nexus is dynamic — it grows with each company, each company's rhythm differs; learn, adapt fast. Gaming-exposure sections in every score doc are standing watch-items. Revisit trigger: first client surveillance/appraisal concern, or first deal in a works-council jurisdiction.
5. **ICP v1**: software *product* companies, ~20–500 people, **≥10 engineers**, modern delivery pipeline, measurement-permissive jurisdiction. Every other archetype (agencies, embedded, services-enabled, internal IT, studios) = a future **anchor pack**, not a v1 customer. New doc queued: `0-BUSINESS/ICP.md`.
6. **Paid-only initially**: no self-serve/free assessment tier until Nexus matures. **Known trade, chosen deliberately**: slower cohort growth → the gold-standard calendar moves out; maturity over data speed.
7. **The restatement rule** (anchor versioning): anchors live in **versioned anchor packs** (segment × edition; annual + out-of-cycle on material frontier shifts); every displayed score carries its pack id (Article 6 extension); trend views always **restate** history against the current pack by recomputing from stored signals (guaranteed free by Article 1); pack changes are ratified in DECISIONS.
8. **Top band = direct-to-Evolve**: a company arriving at AI-Ready/AI-Native enters the ladder at the rung its provenance supports (Measure → Evolve directly); its product is the Evolve subscription ("readiness never saturates"). **Certification/badge parked** — badge value derives from the standard's authority, which requires the cohort. Revisit trigger: first inbound certification request, or a meaningful cohort threshold.

**Consequences**: constitution amendments this session (staircase, deliverables column, Articles 6+13, ICP, scope clause, gauge-lag, restatement rule, BOQ referent, honest-limits additions, reserved seats); scores library + ICP.md + COMPANY_JOURNEY.md + SCORING_MODEL.md queued next; AI_CONSULTING_PLAYBOOK gains the ICP qualification gate, segment TLO variants, and the **proxy-valley narrative** (fees peak when provenance is weakest — the engagement script owns it; "gauges lit n/9" is the honest mid-journey progress proof); PRODUCT_STRATEGY gains valley UX + score display rule.

**Refines**: C-005 (program tenancy: programs are signal-collection scopes under a company-level BOQ), C-006 (GTM: paid-only sharpens the wedge), C-015.

---

## 2026-06-12 — Constitution + Game ratified: draft → active (C-017)

**Context**: Founder read-through per the session-21 NEXT_SESSION card. Both papers approved **as-is, no amendments**.

**Decision**:
1. **`01_NEXUS_MODEL.md` (the constitution) is `active`.** The flagged confirm items are ratified with it: the deliverable names (Measure → the Roadmap · Align → the Cadence · Transform → the Measured Engine · Evolve → the equality), "Ensure" = internal-only, Discover → Measure canonization, the §2 ICP wording, the §8 appraisal-posture wording. C-015 items 3–4 lose their "proposed" qualifier.
2. **`03_NEXUS_GAME.md` (the Game whitepaper) is `active`.** Ratified with the paper (§9 item 12 + flagged models): the **four candidate constitutional rules** — cohort floor (F10), freshness floor (F11), no-verdict-without-a-path (§6.5 rule 1), PvE principle (§3) — plus the **Steward model** and the **data covenant** (F12).
3. The four rules are ratified **as canon**; writing them into the constitution's articles is consequence work, riding the 03 §9 queue (N1-P3-07) per Article 12's amendment process.

**Refines**: C-015 (confirms its proposed items), C-016.

---

## 2026-06-12 — The orchestrator lives Nexus-side (C-020)

**Context**: 04_RUNTIME_MODEL §2 left the context assembler's home deliberately open — Nexus-side seam component vs part of iBrain's consumption surface — pending the iBrain API read (two sessions enforced the gate). Session-23 (N1-P3-06) performed the read: `iBrain/External_App_Integration/04_API_REFERENCE.md` + the full `karvia_business/iBRAIN_Integration/` contract set (API_CONTRACT, TELEMETRY_SPEC, SYNC_PROTOCOL, ML_REQUIREMENTS, SHARED_GLOSSARY, INTEGRATION_OVERVIEW) + Karvia's shipped `server/services/iBrainService.js`.

**What the read established**:
1. iBrain's surface is **app-agnostic IQaaS**: app registration (`X-App-Id`), event ingestion (Universal Adapter `/ingest/native|batch`), Observer rules → webhook actions, and request/response engines (Planner, Scoring). It has **no context-assembly surface**; the Planner expects the *caller* to brief it (`userInput` is caller-composed).
2. Karvia's planned integration put the consumption seam on the app side (telemetry out / signed nudge webhook in / KARVIA-owns-business-data / graceful degradation) — and was **never implemented**: the shipped `iBrainService.js` is a local in-process heuristic under the iBrain name. Accidentally, that is the local-first fallback leg C-010 formalizes.

**Decision**: **The orchestrator (04 §2's context assembler) is a Nexus-side Layer-4 seam component.** Rationale: (a) the game state it assembles — company, program, stage, player, page, signals — lives behind Nexus module contracts; assembling it inside iBrain would export the domain model and invert the data-ownership rule; (b) the policy obligations (data covenant, no-PII, program scoping, cost ceilings, the compliance veto) must execute before anything leaves Nexus; (c) C-010's swap-by-config promise requires the seam component to be Nexus's to point at either implementation. The three consumption seams (events out / webhooks in / request-response N4), the compliance veto, and the epistemic labeling duty are specified in TECH_STRATEGY Layer 4.

**Consequences**: TECH_STRATEGY reframed three layers → **four layers** (04 §1 propagated); the stage machine recorded as a first-class Layer-2 engine (03 §8); SCORING_MODEL.md lands as the computed-category spec; 04 §2 updated from "deliberately open" to decided; SYSTEM_ARCHITECTURE/API_SURFACE annotated (Karvia engines ≈ iBrain ancestors; `/ibrain/*` routes = seam ancestors).

**Refines**: C-010 (gives its consumption pattern a designed home).

---

## 2026-06-12 — The segment registry is canon by name (C-018)

**Context**: C-016's devil's-advocate simulation ran 15 company archetypes, but the full numbered roster was session state and never persisted — only 7 slot numbers survive as score-doc citations, plus two named-but-unnumbered segments. `0-BUSINESS/ICP.md` §3 canonized the registry by name. Founder answered clarification C-018 in session-23.

**Decision**: **Registry-by-name is canon.** The registry's job is the qualification gate + the anchor-pack roadmap, not simulation archaeology: slots append as engagements meet new archetypes; the simulation's unrecovered rows are not reconstructed. The 7 surviving slot numbers stay fixed solely to keep the score docs' citations valid.

**Consequences**: ICP.md §3 provenance note updated; its C-018 revisit trigger resolved.

**Refines**: C-016.5.

---

## 2026-06-12 — The Runtime Model ratified; Article 13 gains the generated category (C-019)

**Context**: 04_RUNTIME_MODEL (the founder's 2026-06-12 runtime capture) carried two pieces of constitutional weight pending ratification: the three epistemic categories (computed / learned / generated — a proposed Article 13 extension) and the paper's own draft status. Both propagation halves had already landed (product N1-P3-07, technical N1-P3-06 incl. C-020). Founder answered clarification C-019 in session-23: **ratify both**.

**Decision**:
1. **Article 13 is amended** (Article 12 process): *score ≠ prediction ≠ draft*. Generated content — anything drafted by an LLM via the orchestrator — is always labeled AI-drafted, becomes program canon only after a human accepts it, always has a non-AI fallback, and never silently becomes a score input (signals produced by adopted content are measured normally; the content stays generated forever).
2. **`04_RUNTIME_MODEL.md` is `active`.** Its remaining open piece, the trigger map, rides N1-P3-08 (now unblocked).

**Consequences**: constitution §7 amended (Article 13 + provenance line); 04 flipped active with §3 marked ratified and queue rows closed; TECH_STRATEGY/SCORING_MODEL "pending C-019" annotations resolved; N1-P3-08 unblocked.

**Refines**: C-015.6 (extends the two-way split it ratified), C-017, C-020.

---

## 2026-06-12 — Repo structure & doc-simplification posture (C-021)

**Context**: The first full reflection audit (`_agent/AUDIT_2026-06-12.md`) prompted two founder questions: should the implementation live under a dedicated `nexus-implementation/` folder, and can the 60-doc set be simplified without losing meaning? Founder ratified both recommendations in-session.

**Decision**:
1. **The implementation stays at repo root** — `src/` + `client/` + `tests/`, the Node/pnpm convention every tool assumes. The root `README.md` names them "the implementation"; no `nexus-implementation/` wrapper folder. The Night-2 pnpm workspace formalizes the boundary.
2. **Every folder carries a thin README index** (8 added this session: root + 7 governed). READMEs are navigation only — content lives in the documents, so an index can never become a second source of truth.
3. **No doc merging now** — every governed doc has exactly one job; the doc count is dominated by indexes, frozen as-is maps, and the per-driver calibration logs that *require* separation. Simplification happens via the **absorption pattern** (the BOQ_FRAMEWORK precedent): once a capture paper's content has fully propagated into canon, it is absorbed and deleted, references rewired. 02/03/04 become absorption candidates after the product-docs stage.
4. **The absorption review is a standing N1-P6-01 groom agenda item**, alongside the phase-budget re-baseline (audit finding 7).

**Refines**: C-014 (the constitution remains the conflict-winner the indexes point at).

## 2026-06-12 — Night-1 close: budget re-baseline + absorption verdicts (C-022)

**Context**: The N1-P6-01 groom. The >25% budget trigger fired (audit 2026-06-12 finding 7: N1 at 28 steps vs 18 budgeted at audit time; 29 at close including the groom itself). The groom card authorizes the re-baseline as the agent's professional re-plan, founder veto in PR review. The absorption review is the standing C-021.4 agenda item.

**Decision**:
1. **The step budget is re-baselined 90 → 105** (EXECUTION_PLAYBOOK § the re-baseline record). N1 closed at 29 actual — cause named: the founder-driven strategy expansion of sessions 19–23 (constitution, NBM, the Game, the Runtime Model, scores library, ICP/COMPANY_JOURNEY, SCORING_MODEL, reflection audit + fix-pass), none of it in the original N1 scope, all of it Karvia-grade discovery bought at ~11 steps. A new **Night 1b — Product & technical docs (10)** carries N1's re-phased doc scope + the C-013 rework. Build nights re-cut against the richer spec: N2 24→22, N3 18→14 (tokens + 10 mockups pre-paid via Path B), N4 16→15, N5 10, buffer 4→5. Re-summed: 29+10+22+14+15+10+5 = 105.
2. **EQ-1 closed**: every journal entry counts, including the 3 pre-North-Star entries. One session = one step, no exemptions — the raw count is what every audit and card reported in practice; redefining the counter to flatter the overrun is exactly the arithmetic drift SESSION_PRACTICES rule 2 exists to block.
3. **Night numbering preserved; the new phase is "1b"** — sprint file `_agent/SPRINTS_NIGHT_1B.md`, deviating from the groom card's "SPRINTS_NIGHT_2.md" name. Reason: ~40 references across 20 docs use "Night 2" to mean Foundation (and N3/N4/N5 likewise); renumbering would stale all of them — the Karvia failure mode the card itself warns about. The card's *content* (the docs stage as sprints-with-goals) is delivered unchanged.
4. **Absorption review verdicts** (C-021.4; no deletions executed — C-021.3 gates them after the product-docs stage, founder sign-off required):
   - **02_NBM_MODEL — strongest candidate, parked.** The Staircase (§1) and the BOQ⇄NBM equality (§2) are absorbed into the constitution; the §3 claims are ratified (C-015) with altitudes/team-NBM propagated to PRODUCT_STRATEGY. Unpropagated residue: the task×person match v1 mechanics and the evidence index (§4). Absorb-and-delete becomes executable once Night 1b's CAPABILITIES work gives the match mechanics a canon home.
   - **03_NEXUS_GAME — keep; not a candidate.** It is an owner doc, not capture residue: 11+ incoming citations (all six score docs, COMPANY_JOURNEY, PRODUCT_STRATEGY) point INTO it for the quest lines, the 14-friction audit, and the SaaS value bridge. Absorption would orphan the citation network for no simplification gain.
   - **04_RUNTIME_MODEL — candidate-in-waiting.** §7 propagation rows 1–6 landed; row 7 (trigger map + playthroughs → USER_JOURNEYS) waits on N1-P3-08. It still solely owns the nudge doctrine and card-zoom grammar as cited sources. Re-review at the Night-1b close groom after P3-08 lands.

**Consequences**: EXECUTION_PLAYBOOK re-baselined (table + record + EQ-1); the 105 propagated to NORTH_STAR, DOCUMENTATION_GRAPH, both READMEs, BUSINESS_MODEL, SPRINT_PROCESS; SPRINTS_NIGHT_1B.md drafted; BACKLOG swept and re-phased.
**Refines**: C-021 (absorption pattern), EXECUTION_PLAYBOOK genome (the >25% revisit trigger — answered).

**RATIFIED by founder, 2026-06-12 (session-25, in-session)**: "C-022 — agree on it, let's rebase it to 105." The veto window is closed; the 105 re-baseline, Night 1b, and the night cuts stand as canon ahead of the PR #27 merge. Ratification sweep in the same session: SPRINTS_NIGHT_1B flipped DRAFT → ACTIVE; the three live stale "vs 90" references fixed (4-CUSTOMER/METRICS.md § build-quality, `.claude/commands/init.md` ×2, `.claude/commands/close.md`); historical records (JOURNAL, DONE backlog entries) untouched.
