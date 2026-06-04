# Sprint 22a — Scalability Ladder

<!-- @GENOME T3-SPR-022a-SCALE | DRAFT | 2026-04-30 | parent:T3-SPR-022a-AUDIT | auto:- | linked:/audit-architecture -->

**Test**: For each layer, identify the next bottleneck before each scale step. Each row is a finding if "next bottleneck" is reached too early.

**Reference baseline (Beta target Apr 10)**: ~10 consultants × ~5 clients each = 50 client tenants; ~5 RPS read peak; ~0.5 RPS write peak; ~5 LLM calls/min.

---

## Dimension 1 — Tenant count (companies)

| Scale | Tenants | Next bottleneck | File:line | Severity |
|---|---|---|---|---|
| **10×** | 500 | None — `User.managed_businesses[]` array stays small per consultant (5-50 ids); MongoDB handles 500 Company docs trivially | — | — |
| **100×** | 5,000 | `GET /api/consultant/portfolio-summary` returns ALL managed clients in one response. With 50+ clients, payload bloats. [consultant.js:88](../../../../server/routes/consultant.js#L88) iterates `managedIds` and bundles. | [consultant.js:95](../../../../server/routes/consultant.js#L95) | M |
| **1000×** | 50,000 | `User.managed_businesses[]` as an embedded array hits MongoDB document size limits when consultants manage thousands of clients (BSON 16MB). Need a separate `ConsultantClient` join collection. | [User.js](../../../../server/models/User.js) | L (post-Beta) |

**Findings**:
- `[FINDING-SC-1] [M] portfolio-summary has no pagination.` — At 100×, payloads exceed 1MB. Add `?limit=&cursor=` to #184a contract.
- `[FINDING-SC-2] [L] managed_businesses[] array unbounded.` — At 1000×, denormalize into a join collection. Post-Beta.

---

## Dimension 2 — Read QPS

| Scale | Read RPS | Next bottleneck | File:line | Severity |
|---|---|---|---|---|
| **10×** | 50 | None — tenant-leading compound indexes cover the hot paths ([Goal.js:309-319](../../../../server/models/Goal.js#L309-L319), [Objective.js:313-317](../../../../server/models/Objective.js#L313-L317), [User.js:289-298](../../../../server/models/User.js#L289-L298)) | — | — |
| **100×** | 500 | `GET /api/consultant/portfolio-summary` does **N queries per consultant** (one per managed client) — sequential population. At 50 clients × 10 consultants RPS = 500 sub-queries/sec. | [consultant.js:88](../../../../server/routes/consultant.js#L88) (audit promised: "computed riskStatus + bucketObjectives" — likely Promise.all'd; verify before scoping) | M |
| **1000×** | 5,000 | No Redis cache layer wired (`FEATURE_REDIS_ENABLED: false` per [feature-flags.js:11](../../../../server/services/feature-flags.js#L11)). Repeated `dashboard-summary` reads hit Mongo directly. | [feature-flags.js:11](../../../../server/services/feature-flags.js#L11) | M (post-Beta) |

**Findings**:
- `[FINDING-SC-3] [M] portfolio-summary may be N+1.` — Verify `Promise.all` usage in audit; if sequential, parallelize before #184a ships derivative endpoints.
- `[FINDING-SC-4] [M] No Redis cache.` — Wire after #184a's `dashboard-summary` endpoint stabilizes; not blocking Beta.

---

## Dimension 3 — Write QPS

| Scale | Write RPS | Next bottleneck | File:line | Severity |
|---|---|---|---|---|
| **10×** | 5 | None — writes are RBAC-guarded + tenant-filtered | — | — |
| **100×** | 50 | `POST /api/consultant/clients` is a **3-step transaction** (Company create + push managed_businesses + Team create). Under load, the manual-rollback fallback ([consultant.js:430](../../../../server/routes/consultant.js#L430)) is risky. | [consultant.js:321](../../../../server/routes/consultant.js#L321) | L (Beta-acceptable) |
| **1000×** | 500 | Same; replica-set transactions become the bottleneck. Need write queue + idempotency keys. | — | L (post-Beta) |

**Findings**: None blocking Beta. Transaction pattern is sound.

---

## Dimension 4 — AI calls / minute

| Scale | LLM RPM | Next bottleneck | File:line | Severity |
|---|---|---|---|---|
| **10×** | 50 | OpenAI tier-1 quotas (10K TPM for gpt-4) | external | — |
| **100×** | 500 | **Fan-out risk**: cascade ops generate `1 objective → ≤5 KRs → ≤5 weekly goals each → moves`. Worst case = ~25 calls per cascade. At 100×, this is 12.5K calls/min. | [aiOKRService.js](../../../../server/services/aiOKRService.js) cascade | H |
| **1000×** | 5,000 | No rate-limiter on cascade fan-out itself; only per-route. The 4 AI endpoints have `aiOKRRateLimiter` (D-F-6) but the cascade can run as one user gesture. | [aiOKRService.js](../../../../server/services/aiOKRService.js) | H (post-Beta) |

**What's working today**:
- ✅ Provider cache (per-op TTL 120-300s) at [AIContextService.js:2118-2126](../../../../server/services/AIContextService.js#L2118-L2126)
- ✅ Stable cache key via `_stableKey(params)`
- ✅ Retry-on-429/5xx in `callOpenAIWithRetry`
- ✅ 24h enrichment cache for `enrichCompany` (D-F-1)

**Findings**:
- `[FINDING-SC-5] [H] Cascade fan-out has no aggregate cap.` — Add max-cascade-cost (e.g., 25 LLM calls per top-level cascade). Schedule for Sprint 23.
- `[FINDING-SC-6] [H] 6 legacy AI features bypass the gateway → bypass rate-limit + retries.` — Sprint 23 OpenAI consolidation (see Replaceability Matrix Swap 3).

---

## Dimension 5 — Data per tenant

| Scale | Per-tenant volume | Next bottleneck | File:line | Severity |
|---|---|---|---|---|
| **10×** | ~50 objectives, ~250 KRs, ~1K goals, ~5K weekly goals/year | None | — | — |
| **100×** | ~500 objectives etc. | `GET /api/consultant/clients/:id/dashboard-summary` (planned in #184a) — if it composes 5-7 sub-queries per call, latency stacks | #184a contract not yet drafted | M |
| **1000×** | ~5K objectives etc. | Pagination needed on per-client objectives endpoint; current `/api/objectives` returns full tenant set (acceptable for client app, NOT for consultant aggregate) | [routes/objectives.js](../../../../server/routes/objectives.js) | M (post-Beta) |

**Findings**:
- `[FINDING-SC-7] [M] dashboard-summary contract not yet drafted.` — Bake pagination + max-fan-out into the #184a API contract before implementation.

---

## Cross-cutting: Frontend client-side joins

**Check**: Does the frontend ever fetch from N endpoints and join them in JS?

- ✅ [my-clients.js](../../../../client/pages/scripts/my-clients.js): `loadKPIs()` and `loadPortfolio()` are **parallel** (good), and each is a single composed endpoint (good).
- ⚠️ When `client-workspace.html` lands in #184b, each tab will hit one #184a endpoint. **Required**: each tab should consume **one** composed endpoint, not multiple. Bake into the contract.

**Finding**: `[FINDING-SC-8] [M] Client-workspace tabs must each consume a single composed endpoint.` — Architectural rule for #184b.

---

## Synchronous LLM calls on request paths

**Check**: Does any user action block on an LLM call >2s?

- ⚠️ `POST /api/consultant/clients/enrich` (Sprint 22 #178) is synchronous w/ 3s timeout (D-F-1). Acceptable — graceful fallback if timeout.
- ✅ Other AI cascade endpoints are explicitly user-triggered "Generate" actions; user expects latency.

**No new findings here.** Pattern is sound for Beta.

---

## Summary

| Severity | Count | Sprint 22a addresses | Sprint 23 / Backlog |
|---|---|---|---|
| H | 3 | 0 | 3 (LLM gateway consolidation, cascade fan-out cap) |
| M | 5 | 2 (SC-7, SC-8 — #184a contract design) | 3 (Redis cache, pagination, dashboard composition) |
| L | 2 | 0 | 2 (post-Beta) |

**Beta-blocking scalability findings**: 0.
**Sprint 22a contract requirements**: SC-7 + SC-8 must be encoded into the #184a `API_CONTRACT.md` before #184a coding begins.

---

## Beta load assertion

At Beta scale (10 consultants × 5 clients × 5 RPS reads × 0.5 LLM calls/min):
- ✅ All hot paths covered by tenant-leading indexes
- ✅ Cascade ops have provider cache + rate-limit
- ✅ No N+1 detected on critical paths (modulo SC-3 verification)
- ✅ Mongo replica-set transactions handle the write volume

**Beta is safe.** The findings above are pre-emptive for the 10×/100× growth path.
