# Sprints — Night 1

**Theme**: Lift docs only. Zero code. Zero impact on karvia_business.
**Window**: 23:00–07:00, ~16 ticks available
**Autonomy**: Level 0 (open PRs only; human merges Day 2 morning)
**Karvia path** (READ-ONLY): `/Users/sagarrs/Desktop/official_dev/karvia_business`

---

## Definition of victory for Night 1

By morning, the human can open `nexus/` and find:

1. A frozen, sanitized copy of every Karvia doc that matters → `_source/`
2. A clean Nexus T0–T4 strategy tree → `NEXUS_STRATEGY/`
3. Architecture maps that visualize Karvia's code (so we can plan Night 2's refactor) → `NEXUS_STRATEGY/2-TECHNICAL/`
4. A test coverage audit documenting what 80% coverage looks like for Nexus → `NEXUS_STRATEGY/3-DELIVERY/QA/`
5. A clear plan for modularization → `NEXUS_STRATEGY/2-TECHNICAL/MODULARIZATION_PLAN.md`
6. A populated BACKLOG ready for Night 2

**Karvia must remain bit-identical.** Hook `guard-karvia.sh` enforces this.

---

## PHASE 1 — Sanitized doc snapshot (1 tick, S)

### N1-P1-01 — Snapshot Karvia docs into `_source/`

- Copy from `karvia_business/`:
  - `KARVIA_STRATEGY/` → `_source/KARVIA_STRATEGY/`
  - `.claude/` (configs + commands, NOT settings.local.json) → `_source/karvia_claude/`
  - `docs/` (excluding generated PDFs, .png larger than 500KB) → `_source/docs/`
  - `Karvia_OKR_Product_Planning/` → `_source/OKR_Product_Planning/`
  - `iBRAIN_Integration/` → `_source/iBRAIN_Integration/`
  - Top-level: `README.md`, `CLAUDE.md`, `CLAUDE_STRATEGY.md`, `ECOSYSTEM_ARCHITECTURE.md`, `DEPLOYMENT_RUNBOOK.md` → `_source/karvia_root/`
- **Exclude**: `.env*`, `node_modules/`, `logs/`, `.snapshots/`, `test-results/`, `playwright-report/`, `.git/`, `YSELA/`, `bramhi/`, `Karvia_OKR_Mockups/`, `*.DS_Store`
- After copy: grep `_source/` for `mongodb+srv://`, `password`, `sk-`, `ghp_`, `AKIA` — if any hits, redact to `[REDACTED]` and journal a security note.
- Commit: `chore(source): freeze Karvia doc snapshot for reference`

---

## PHASE 2 — Reverse-engineer Karvia code into visualization docs (5 ticks, L)

Agent reads Karvia code (READ-ONLY) and produces:

### N1-P2-01 — System architecture map

- File: `NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md`
- Cover: server, client, all 10 engines (iam, assessment, planner, scoring, observer, tracking, insights, collaboration, integrations, whitelabel), Mongo, nginx, Docker, k8s
- Include 2 Mermaid diagrams: high-level (engines + DB + client + nginx) and request lifecycle (login → assessment → objective → KR).
- Note Nexus deltas at the bottom.

### N1-P2-02 — Data models catalogue

- File: `NEXUS_STRATEGY/2-TECHNICAL/DATA_MODELS.md`
- Read every Mongoose schema in `server/` and `engines/*/models/`.
- For each model: name, fields + types, indexes, relationships, which engine owns it.
- One Mermaid ER diagram per cluster (CRM cluster, OKR cluster, Assessment cluster).

### N1-P2-03 — API surface catalogue

- File: `NEXUS_STRATEGY/2-TECHNICAL/API_SURFACE.md`
- Read all routes in `server/routes/` and each engine's `routes/` or equivalent.
- Table per engine: method, path, auth required, request shape, response shape.
- Flag which routes are CRM-shaped, OKR-shaped, Assessment-shaped (this informs Night 2 module boundaries).

### N1-P2-04 — Module dependency graph

- File: `NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md`
- Static analysis: who imports whom across engines and server.
- One Mermaid graph; flag cycles in red.
- This is the input to Night 2's refactor — the cycles are what we need to break.

### N1-P2-05 — User journeys

- File: `NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md`
- Read existing journey docs in Karvia (`_source/`) + infer from code.
- 4 journeys: consultant onboarding client, client team onboarding, running an objective, running an assessment.
- Each as a numbered step list + a Mermaid sequence diagram.

---

## PHASE 3 — T0–T4 strategy structure (3 ticks, M)

### N1-P3-01 — Populate 0-BUSINESS and 1-PRODUCT

- Files in `NEXUS_STRATEGY/0-BUSINESS/`: `POSITIONING.md`, `GTM.md`, `STAKEHOLDERS.md`, `BUSINESS_MODEL.md`
- Files in `NEXUS_STRATEGY/1-PRODUCT/`: `PRODUCT_VISION.md`, `CAPABILITIES.md`, `ROADMAP.md`, `USER_PERSONAS.md`
- Adapt content from Karvia equivalents (in `_source/`), swap the use case framing: consultant SaaS for AI readiness instead of SSI.
- Where Karvia content doesn't translate, mark **TODO Night 2+** and append a clarification.

### N1-P3-02 — Populate 3-DELIVERY skeleton

- `NEXUS_STRATEGY/3-DELIVERY/SPRINT_PROCESS.md` — how the agent loop intersects with sprints
- `NEXUS_STRATEGY/3-DELIVERY/RELEASE_PROCESS.md` — adapted from Karvia DEPLOYMENT_RUNBOOK
- `NEXUS_STRATEGY/3-DELIVERY/CI_CD.md` — what CI looks like for Nexus (GitHub Actions, lint, test, build)

### N1-P3-03 — Populate 4-CUSTOMER skeleton

- Empty templates: `INTERVIEW_TEMPLATE.md`, `FEEDBACK_LOG.md`, `EVIDENCE_INDEX.md`, `METRICS.md`
- This tier is empty until real customers exist; templates ready for Night 5+.

---

## PHASE 4 — Modularization plan (2 ticks, M)

### N1-P4-01 — Modularization plan + contract drafts

- File: `NEXUS_STRATEGY/2-TECHNICAL/MODULARIZATION_PLAN.md`
- Six modules + assessment implementations. For each:
  - Owned responsibilities
  - Public API surface (TS interface signatures, draft)
  - What from Karvia maps in, what's new
  - Contract test outline
- File: `NEXUS_STRATEGY/2-TECHNICAL/MODULE_CONTRACTS_DRAFT.md` — the interfaces in one place

### N1-P4-02 — Nexus vs Karvia diff doc + Assessment interface spec

- File: `NEXUS_STRATEGY/2-TECHNICAL/NEXUS_VS_KARVIA_DIFF.md` — module-by-module, what changes
- File: `NEXUS_STRATEGY/2-TECHNICAL/ASSESSMENT_INTERFACE_SPEC.md` — the pluggable assessment contract (what every assessment impl must satisfy: dimensions, scoring, report shape, lifecycle hooks)

---

## PHASE 5 — Test coverage audit (2 ticks, M) — **the "80% docs" deliverable**

### N1-P5-01 — Test inventory

- File: `NEXUS_STRATEGY/3-DELIVERY/QA/TEST_INVENTORY.md`
- Read every test file in Karvia (`tests/`, `engines/*/tests/`, `server/tests/`).
- Table: test file → category (unit/integration/e2e/security) → modules it covers → assertion count
- Static parse only — do not run tests against Karvia.

### N1-P5-02 — Coverage map + path to 80%

- File: `NEXUS_STRATEGY/3-DELIVERY/QA/COVERAGE_MAP.md` — module × test-type matrix; cells are either "covered (file refs)" or "GAP".
- File: `NEXUS_STRATEGY/3-DELIVERY/QA/COVERAGE_GAPS.md` — every GAP cell with severity (high/med/low) and rationale.
- File: `NEXUS_STRATEGY/3-DELIVERY/QA/PATH_TO_80_PERCENT.md` — a concrete plan: "to reach 80% documented test coverage in Nexus, we need to write N new tests across these modules." Estimate effort in ticks.

---

## PHASE 6 — Reflection + Night 2 prep (1 tick, S)

### N1-P6-01 — Journal + BACKLOG groom + Night 2 sprint draft

- Append Night 1 summary to `_agent/JOURNAL.md`
- Update `_agent/BACKLOG.md`: mark Night 1 items DONE, surface new items discovered
- Append any open questions to `_agent/clarifications.md`
- Draft `_agent/SPRINTS_NIGHT_2.md` proposing the Night 2 lift-and-modularize plan (human ratifies Day 2 morning)

---

## Anti-goals for Night 1 — DO NOT

- Touch any file under `karvia_business/`
- Run tests against Karvia
- Create any code file (`.js`, `.ts`, `.tsx`, `.py`) — docs only
- Open any PR that modifies code
- Resolve clarifications on the agent's own authority
- Skip the security grep on `_source/`
