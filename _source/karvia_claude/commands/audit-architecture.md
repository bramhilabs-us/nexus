# /audit-architecture - 4-Layer Modularity & Scalability Audit

<!-- @GENOME T2-CMD-016 | ACTIVE | 2026-04-30 | parent:T0-GOV-001 | auto:/audit-architecture | linked:/audit,/strategy -->

**Aliases**: `/arch-audit`, `/audit-arch`
**Version**: 1.0.0
**Last Updated**: April 30, 2026
**Session Type**: AUDIT
**Token Budget**: ~1,200 AUTO
**Purpose**: Audit any feature, page, or subsystem against the 4-layer Lego-block architecture (Frontend / Middleware / Backend / AI Orchestrator) for **modularity** and **scalability**.

---

## Core Philosophy (Non-negotiable lens for this audit)

> Build software like Lego blocks. Each layer is independently replaceable, so we can change user flows, business rules, prompts, or data models without breaking the whole system.

- **Frontend** — *experience layer*. Renders. Triggers. Asks: *"What should I show, and what action should I trigger?"* No business logic. No DB knowledge. No prompt strings.
- **Middleware / Application Layer** — *brain*. Decides what data to fetch, what rules to apply, what to compute, whether AI is needed. Owns RBAC, tenant scope, validation, orchestration.
- **Backend / Data Model** — *truth*. Stores structured information. Does not care how the frontend looks.
- **AI Orchestrator** — *intelligence*. Extends (does not replace) middleware. Owns Context Builder, Prompt Builder, Policy Layer, LLM Gateway, Response Parser, Memory Writer.

**The Development Rule** — every feature must answer:

| Question | Layer |
|---|---|
| What does the user see? | Frontend |
| What action does the user take? | Frontend |
| What rule decides the result? | Middleware |
| What data is needed? | Data Service (Middleware) |
| What data is stored? | Database |
| Is intelligence needed? | AI Orchestrator |
| What prompt/context is needed? | AI Orchestrator |

If two layers know about the same concern, that's a leak. If one layer can't be swapped without the others changing, that's a coupling bug. Both are findings.

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Architecture Reviewer | Layer separation, coupling | Lego-block compliance |
| Modularity Analyst | Replaceability of components | Swap-test results |
| Scalability Reviewer | Growth boundaries (data, traffic, AI calls) | Bottleneck flags |
| Domain Reviewer | Business rule placement | Misplaced-logic findings |

---

## Document Context

### AUTO (Read at session start) — ~1,200 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~400 | Architecture, multi-tenancy, RBAC |
| Target spec / sprint plan | varies | ~400 | Feature under audit |
| Existing architectural notes | varies | ~400 | Prior decisions (if any) |

### LINKED

| Doc | ID | Path |
|-----|-----|------|
| Sprint master plan | T3-SPR-xxx | Current sprint folder |
| API contracts | varies | `audit/API_CONTRACT.md` if present |
| Data flow diagrams | varies | `audit/DATA_FLOW.md` if present |

---

## Inputs

The user supplies (or you infer from context) **one** of:
- A feature name (e.g., "AI Roadmap Generation")
- A page / route (e.g., `client-workspace.html`, `POST /api/consultant/clients`)
- A subsystem (e.g., "OKR Wizard", "Assessment Hub")
- A whole sprint scope (audit each epic against the 4 layers)

---

## Audit Procedure

### Step 1 — Map the feature onto the 4 layers

Produce a table for the target. Cite file paths and line numbers.

| Layer | What lives here today | File / Module | Should it live here? |
|---|---|---|---|
| Frontend | … | `client/pages/...` | ✅ / ❌ + reason |
| Middleware | … | `server/routes/...`, `server/services/...` | ✅ / ❌ + reason |
| Backend (Data) | … | `server/models/...` | ✅ / ❌ + reason |
| AI Orchestrator | … | `server/services/AIContextService`, `server/services/aiOKRService`, `server/services/providers/*` | ✅ / ❌ + reason |

### Step 2 — Layer-Leak Findings

For every misplaced concern, file a finding. Severity:

- **C (Critical)** — frontend writes business rules, frontend talks to DB directly, prompt strings in frontend, middleware bypassed.
- **H (High)** — DB shape leaking into frontend (frontend renders raw DB doc), middleware reaching into LLM directly without going through orchestrator, AI policy decisions made in route handler.
- **M (Medium)** — duplicated validation across layers, frontend doing client-side computation that middleware should own.
- **L (Low)** — naming/file-placement issues that hint at a future leak.

Format:
```
[FINDING-A-NN] [Severity] Title
Layer leak: <X> doing work that belongs in <Y>
Evidence: <file:line>
Impact: <which layer can't be swapped, what scales badly>
Fix: <move to layer Y; suggested module>
```

### Step 3 — Replaceability Test (Modularity)

For each layer, answer **yes/no** with evidence:

1. **Swap the frontend** — could we ship a CLI / mobile / Slack bot version of this feature without changing middleware? If no → frontend is doing business logic. List the offending file:line.
2. **Swap the database** — could we move from MongoDB to Postgres without rewriting frontend or AI orchestrator? If no → schema is leaking through layers.
3. **Swap the LLM** — could we replace OpenAI with Claude (or a local model) by changing only the LLM Gateway? If no → prompts/parsing/policy are scattered.
4. **Swap a business rule** — could we change "consultant can edit only managed clients" without touching frontend or DB? If no → RBAC is duplicated or in the wrong layer.

Each "no" is a modularity finding.

### Step 4 — Scalability Test

For each layer, identify **the next bottleneck** before each of: 10×, 100×, 1000× current load.

| Dimension | 10× | 100× | 1000× |
|---|---|---|---|
| Tenant count (companies) | … | … | … |
| Read QPS | … | … | … |
| Write QPS | … | … | … |
| AI calls / minute | … | … | … |
| Data per tenant | … | … | … |

Look specifically for:
- N+1 queries (middleware fetching per-row)
- Missing tenant-leading indexes
- Unbounded fan-out in AI Orchestrator (one user action → many LLM calls)
- Per-request prompt rebuilds with no cache (Context Builder cache hit rate)
- Frontend doing client-side joins on large lists
- Synchronous LLM calls on a request path that should be async

Each bottleneck is a scalability finding.

### Step 5a — Two-App Separation Check (Karvia-specific, mandatory)

Karvia is **two applications sharing one backend**: the **Consultant App** (e.g., RSM Consulting) and the **Client App** (business owner / executive / employee). The consultant app is a **hand-holding cockpit** — it must fetch real client data via consultant-scoped APIs and render it inside the consultant theme. It must **never** become the client by swapping JWTs.

For the target feature, answer:

| Question | Required answer | Found |
|---|---|---|
| Does the feature belong to Consultant App, Client App, or both? | One explicit answer | … |
| If consultant-facing: does it call `GET /api/consultant/clients/:id/*` (read APIs)? | Yes — never `switch-company` | ✅ / ❌ |
| If consultant-facing: does the top nav stay "RSM Consulting" throughout? | Yes — no role/theme flip | ✅ / ❌ |
| If consultant-facing: is tenant scope enforced via `req.user.managed_businesses` membership server-side? | Yes — never trust frontend tenant claim | ✅ / ❌ |
| If client-facing: is the consultant app barred from this surface? | Yes — RBAC + route-level role check | ✅ / ❌ |
| Are frontend assets shared only where role-agnostic (e.g., chart components), and split where role-specific (e.g., nav, dashboards)? | Yes — explicit separation | ✅ / ❌ |
| Does the Middleware expose role-scoped surfaces (consultant endpoints vs tenant-native endpoints), not a single endpoint that branches on role? | Yes — separation at the API contract | ✅ / ❌ |

Any ❌ → finding. **Critical** severity if the feature lets a consultant become the client (JWT swap, frontend reaching into a tenant the user is not currently in, prompt context mixing two tenants).

### Step 5b — AI-Orchestrator Compliance (special check)

Because this layer is the newest, audit it against its 6 sub-services:

| Sub-service | Required behavior | Found? |
|---|---|---|
| Context Builder | Centralized data assembly w/ stable cache key | ✅ / ❌ |
| Prompt Builder | Versioned, testable, no business logic embedded | ✅ / ❌ |
| Policy Layer | Decides allowed ops per role/tenant before LLM call | ✅ / ❌ |
| LLM Gateway | Single chokepoint for model calls; retries/timeouts/rate-limits | ✅ / ❌ |
| Response Parser | Schema-validated; min/max bounds; safe fallbacks | ✅ / ❌ |
| Memory Writer | Persists useful outputs back to DB w/ provenance | ✅ / ❌ |

Any ❌ → finding with severity proportional to user-visible risk.

### Step 6 — The Development Rule Checklist

For the target feature, fill the table. Every blank or wrong-layer cell is a finding.

| Question | Answer | Lives in (file) | Layer | Correct? |
|---|---|---|---|---|
| What does the user see? | … | … | FE | ✅ / ❌ |
| What action does the user take? | … | … | FE | ✅ / ❌ |
| What rule decides the result? | … | … | MW | ✅ / ❌ |
| What data is needed? | … | … | MW (Data Service) | ✅ / ❌ |
| What data is stored? | … | … | DB | ✅ / ❌ |
| Is intelligence needed? | … | … | AI-O | ✅ / ❌ |
| What prompt/context is needed? | … | … | AI-O | ✅ / ❌ |

### Step 7 — Output Deliverables

Always produce these files in the sprint's `audit/` folder (or the path the user specifies):

1. **`ARCH_AUDIT_REPORT.md`** — full findings, grouped by severity, with file:line evidence
2. **`LAYER_MAP.md`** — the Step 1 table, frozen as the as-is map
3. **`REPLACEABILITY_MATRIX.md`** — the Step 3 yes/no grid w/ evidence
4. **`SCALABILITY_LADDER.md`** — the Step 4 10×/100×/1000× table w/ bottlenecks
5. **`REMEDIATION_PLAN.md`** — prioritized fixes mapped to sessions/epics, with the layer each fix lands in

### Step 8 — Severity → Action mapping

| Severity | Action |
|---|---|
| C | Block release; fix before merge |
| H | Schedule in next sprint; tracked in `AUDIT_TRACKER.md` |
| M | Backlog; bundle with adjacent work |
| L | Note in sprint retro; revisit if it grows |

---

## Exit Criteria

- [ ] Every layer has a populated as-is map with file:line evidence
- [ ] Every layer leak has a severity + a fix + a destination layer
- [ ] Replaceability matrix complete (4 swaps tested)
- [ ] Scalability ladder complete (5 dimensions × 3 scales)
- [ ] AI Orchestrator 6-sub-service grid complete (if AI is in scope)
- [ ] Remediation plan written with epic/session bindings
- [ ] User signs off on REMEDIATION_PLAN.md before any code session begins

---

## Anti-patterns this command exists to catch

- Frontend that calls multiple endpoints and joins them client-side → middleware should expose a composed endpoint
- Mongoose models with virtuals computing user-visible labels → that's middleware's job
- Route handlers that build prompts inline → belongs in Prompt Builder
- LLM calls scattered across services → must funnel through LLM Gateway
- "I'll just add a flag to the User model" → schema as feature toggle = layer leak
- Frontend hard-coding role lists ("if role === CONSULTANT") for anything beyond rendering → RBAC belongs in middleware

---

## Bidirectional validation

```bash
grep "auto:.*audit-architecture" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare with AUTO list above.

---

**After completing this command, run `/close` to update SESSION_LOG.md and the sprint handoff with audit findings.**
