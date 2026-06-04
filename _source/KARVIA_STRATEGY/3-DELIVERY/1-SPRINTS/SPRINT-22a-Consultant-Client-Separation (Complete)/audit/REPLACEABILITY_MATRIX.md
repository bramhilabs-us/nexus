# Sprint 22a — Replaceability Matrix

<!-- @GENOME T3-SPR-022a-REPL | DRAFT | 2026-04-30 | parent:T3-SPR-022a-AUDIT | auto:- | linked:/audit-architecture -->

**Test**: Can each layer be swapped without changing the others? Each "no" is a modularity finding.

---

## Swap 1 — Replace the Frontend (ship a CLI / mobile / Slack consultant cockpit)

**Question**: If we built a Slack bot or CLI for consultants tomorrow that lets them list their clients, view a client's objectives, and add a new client — could we do it without changing **any** server code?

**Answer (today)**: ⚠️ **Mostly yes, with one gap.**

| What works | What doesn't |
|---|---|
| ✅ `GET /api/consultant/portfolio-summary` returns full portfolio in one call ([consultant.js:88](../../../../server/routes/consultant.js#L88)) | ❌ No `GET /api/consultant/clients/:id/profile` — the new CLI/bot would have to call `PUT /api/auth/switch-company` then `GET /api/companies/:id`. Same JWT-swap leak the web frontend has. |
| ✅ `POST /api/consultant/clients` is consultant-scoped, returns client-creation result ([consultant.js:321](../../../../server/routes/consultant.js#L321)) | ❌ No `GET /api/consultant/clients/:id/objectives` — bot couldn't view client OKRs without becoming the client |
| ✅ RBAC + tenant-scope are server-side; bot doesn't need to know the rules | ❌ Per-client deep reads (objectives, goals, teams, assessments, dashboard-summary) are missing |

**Verdict**: ❌ **NO** — the consultant→per-client deep-read API doesn't exist yet. **#184a closes this gap.** Once #184a ships, the CLI/bot is buildable without touching middleware.

**Finding**: `[FINDING-RP-1] [H] Frontend cannot be swapped because per-client read APIs are missing.` Fixed by #184a.

---

## Swap 2 — Replace the Database (move from MongoDB to Postgres)

**Question**: Could we move from MongoDB+Mongoose to Postgres+Prisma without rewriting frontend or AI orchestrator?

**Answer**: ⚠️ **Mostly yes, two leaks to clean up.**

| What works | What doesn't |
|---|---|
| ✅ Frontend always goes through HTTP/JSON; never touches Mongo directly | ❌ Some virtuals compute user-visible values inside Mongoose schemas: [Company.js:559-674](../../../../server/models/Company.js#L559-L674) — `company_health_score`, `size_description`, `profile_completion`, `concentration_risk`. These would have to be re-implemented in Postgres views or moved to middleware (services). |
| ✅ Tenant scope is enforced via route filters, not DB triggers | ❌ AI Orchestrator's provider layer ([providers/CompanyProvider.js etc.](../../../../server/services/providers/)) imports Mongoose models directly. A Postgres swap means rewriting the providers (acceptable — that's their abstraction job) |
| ✅ Tenant-leading compound indexes are translatable to Postgres directly | |

**Verdict**: ⚠️ **YES with cleanup.** Mongoose virtuals computing display values are a soft layer leak — they're convenient now but the right home is middleware/services. Not Sprint 22a's problem; flagged for backlog.

**Finding**: `[FINDING-RP-2] [M] Mongoose virtuals on Company.js compute user-visible values; should move to a service.` Backlog.

---

## Swap 3 — Replace the LLM (OpenAI → Claude / local model)

**Question**: Could we replace OpenAI with Claude (or a local Llama) by changing only the LLM Gateway?

**Answer**: ❌ **NO — 7 direct OpenAI imports outside the gateway.**

| File | Line | What it does | Gateway-bypassing? |
|---|---|---|---|
| [server/routes/ai-okr.js](../../../../server/routes/ai-okr.js#L1677) | 1677, 2561 | Two route handlers instantiate `OpenAI` directly | ❌ Bypasses gateway |
| [server/routes/planning.js](../../../../server/routes/planning.js#L17) | 17 | Top-level `require('openai')` in route file | ❌ Bypasses gateway |
| [server/routes/objective-wizard.js](../../../../server/routes/objective-wizard.js#L15) | 15 | Top-level `require('openai')` | ❌ Bypasses gateway |
| [server/services/AIObjectivePlanner.js](../../../../server/services/AIObjectivePlanner.js#L26) | 26 | Lazy-loads OpenAI SDK inside service | ❌ Bypasses gateway |
| [server/services/AIEstimator.js](../../../../server/services/AIEstimator.js#L7) | 7 | Top-level `require('openai')` | ❌ Bypasses gateway |
| [server/services/SSINarrativeService.js](../../../../server/services/SSINarrativeService.js#L17) | 17 | Top-level `require('openai')` | ❌ Bypasses gateway |
| [server/services/aiOKRService.js](../../../../server/services/aiOKRService.js#L6) | 6 | Top-level `require('openai')` | ✅ **This is the gateway** — correct |

**What works**: The **cascade ops** (objective-creation, kr-generation, weekly-goal-creation, move-generation) all funnel through `aiOKRService.callOpenAIWithRetry()`. Swapping these 4 ops to Claude is a one-file change.

**What doesn't**: 6 other AI features (planning, ai-okr legacy endpoints, objective wizard, objective planner, estimator, SSI narrative) hold their own SDK clients. Swapping the LLM means editing 6+ files.

**Verdict**: ❌ **NO** — 6 leaks. **Defer to Sprint 23** (not on consultant↔client critical path).

**Finding**: `[FINDING-RP-3] [H] LLM cannot be swapped without editing 6 files outside the gateway.` Tracked for Sprint 23 cleanup.

---

## Swap 4 — Replace a Business Rule ("consultant can edit only managed clients")

**Question**: Could we change the rule "consultant edits only their managed clients" to "consultant edits any client in the same region" without touching frontend or DB?

**Answer**: ✅ **YES.**

| What works | Evidence |
|---|---|
| ✅ Membership check is server-side only — never trusted from frontend | [consultant.js:95](../../../../server/routes/consultant.js#L95), [:240](../../../../server/routes/consultant.js#L240), [:386](../../../../server/routes/consultant.js#L386) all use `user.managed_businesses` |
| ✅ RBAC roles are pure middleware | [roleGuards.js:26-50](../../../../server/middleware/roleGuards.js#L26-L50) `requireRole()` |
| ✅ Frontend role-checks are render-only (showing/hiding UI), not enforcement | 16 sites grep'd — all are `if (role === 'CONSULTANT') showFilter()` style, never `if (role === 'CONSULTANT') allowWrite()` |
| ✅ DB schema doesn't encode the rule — `managed_businesses[]` is a relationship, not a permission | [User.js](../../../../server/models/User.js) |

**Verdict**: ✅ **YES** — change `user.managed_businesses` membership check to a `region`-based check in middleware; frontend and DB unchanged. RBAC layer is clean.

---

## Summary Matrix

| Swap | Result | Blockers | Sprint 22a impact |
|---|---|---|---|
| 1. Replace Frontend | ❌ NO today / ✅ after #184a | Per-client read APIs missing | **Fixed by #184a** |
| 2. Replace Database | ⚠️ YES with cleanup | Mongoose virtuals computing display values | Backlog (low priority) |
| 3. Replace LLM | ❌ NO | 6 direct OpenAI imports outside gateway | **Defer to Sprint 23** |
| 4. Replace a Business Rule | ✅ YES | None | None |

**Sprint 22a delivers Swap 1 readiness.** Swap 3 cleanup is bundled into the post-22a roadmap.

---

## Modularity score

| Layer | Replaceability | Notes |
|---|---|---|
| Frontend | ⚠️ 7/10 | Becomes 9/10 after #184a (per-client APIs unblock CLI/mobile/Slack); becomes 10/10 after #184c (no JWT-swap) |
| Middleware | ✅ 9/10 | RBAC + tenant scope are clean; `switch-company` route is the only soft point but stays alive by design |
| Backend | ⚠️ 8/10 | Tenant indexes solid; Mongoose display virtuals are the one leak |
| AI Orchestrator | ⚠️ 6/10 | Cascade ops are 10/10; 6 legacy AI features bypass gateway → drags overall to 6/10. Becomes 9/10 after Sprint 23 cleanup |

**Average**: 7.5/10 today → 9/10 after Sprint 22a → 9.5/10 after Sprint 23 OpenAI consolidation.
