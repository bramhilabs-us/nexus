# Scalability Ladder — 10× / 100× / 1000×

<!-- @GENOME T3-SPR-026-AUDIT-SCALE | ACTIVE | 2026-05-15 | parent:T3-SPR-026-AUDIT-ARCH | auto:- | linked:/audit-architecture -->

For each dimension, what breaks first at each scale tier? Each entry that flips to a Red breakpoint is a scalability finding (cross-referenced into [ARCH_AUDIT_REPORT.md](ARCH_AUDIT_REPORT.md)).

**Baseline today** (Beta-1 cohort, consultant-guided):
- ~5 consulting tenants × ~5-20 users each = ~50-100 users
- ~10-20 objectives/tenant
- Single-digit AI calls per consultant-session
- ~1-2k MongoDB documents per tenant on the OKR cascade

---

## Dimension 1 — Tenant count (companies)

| Scale | Breaking point | Source |
|---|---|---|
| **10×** (~50 tenants) | 🟢 Fine | Compound indexes are tenant-leading; cohort detection scoped via `managed_businesses` |
| **100×** (~500 tenants) | 🟡 Watch | Cohort virtual inconsistency (`ARCH-DB-005`) starts surfacing as console-side debug confusion (cohort attached at route but undefined on `.toJSON()`); not a perf issue |
| **1000×** (~5k tenants) | 🟠 Red | Cross-tenant cache key collision (`ARCH-AI-001`) becomes statistically likely with shared `params` hashes. Multi-tenant cache MUST tenant-key by Beta-2. |

**Finding cross-ref**: `ARCH-AI-001` (Critical), `ARCH-DB-005` (Medium).

---

## Dimension 2 — Read QPS (page loads + API)

| Scale | Breaking point | Source |
|---|---|---|
| **10×** | 🟢 Fine | |
| **100×** | 🟡 Watch | FE chains `/objectives` → `/weekly-goals/:krId` → `/tasks?goal_id` on every planning-page render — that's 3 round-trips. At 100× load (~500 concurrent planning-page views) backend handles ~1500 RPS just for planning |
| **1000×** | 🟠 Red | `ARCH-FE-006` client-side join becomes a real bottleneck. Composed BE endpoint needed: `GET /api/planning/objective/:id?include=krs,goals,tasks` returning one document. |

Additional 100× breakpoints:
- **Project-mode goal queries** (`ARCH-DB-002`) — goals with `quarter: null` force collection scans. At 100× goal count (~50-100k goals), the planning page latency spikes.
- **Task model missing `{company_id, objective_id, status}` index** (`ARCH-DB-006`) — cascade lookups on objective deletion go N+1.

**Finding cross-ref**: `ARCH-FE-006` (Medium), `ARCH-DB-002` (High), `ARCH-DB-006` (Medium).

---

## Dimension 3 — Write QPS (objective + KR + goal + task creates/updates)

| Scale | Breaking point | Source |
|---|---|---|
| **10×** | 🟢 Fine | |
| **100×** | 🟡 Watch | Pre-save business hooks (`Goal.pre('save')` overdue flip, `Task.pre('save')` subtask progress — `ARCH-DB-003`) race under concurrent updates. No idempotency guard. Likely manifests as occasional status flicker, not data corruption. |
| **1000×** | 🟠 Red | Dual-write hazard (`ARCH-DB-001`) — Embedded `Objective.key_results[]` reads drift from collection. Reads in legacy paths return stale data. Bigger issue at scale where consumer count grows. |

**Finding cross-ref**: `ARCH-DB-001` (Critical), `ARCH-DB-003` (High).

---

## Dimension 4 — AI calls / minute

| Scale | Breaking point | Source |
|---|---|---|
| **10×** | 🟢 Fine | LLMGateway cascade cap + retry logic + timeout handles small bursts |
| **100×** | 🟡 Watch | No per-user / per-tenant rate-limit on LLM ops. A user rapid-firing `/regenerate-kr` 5×/sec is unbounded. Telemetry exists (`callsByTag` at [LLMGateway.js:73,161](../../../server/services/LLMGateway.js#L73)) but no active throttle. |
| **1000×** | 🟠 Red | Same — needs token-bucket per `{tenant, user}` before Beta-2 if AI usage scales. Cost-runaway risk. |

Additional cross-cutting concern:
- **Policy Layer (`ARCH-AI-002`) — dormant**. At any scale, an EMPLOYEE with a leaked session ID can trigger LLM calls today. Cost + correctness risk independent of scale tier.

**Finding cross-ref**: `ARCH-AI-002` (Critical).

---

## Dimension 5 — Data per tenant (cascade documents)

| Scale | Breaking point | Source |
|---|---|---|
| **10×** (~10-20k docs/tenant) | 🟢 Fine | Within MongoDB single-collection comfort zone |
| **100×** (~100k-200k docs/tenant) | 🟡 Watch | Project-mode goal queries (`ARCH-DB-002`) need the new compound index. Cross-year objective records spread across multiple `target_year` values (`ARCH-DB-004`) — `{company_id, target_year}` index becomes lopsided for tenants with long-running objectives |
| **1000×** (~1M+ docs/tenant) | 🟠 Red | If `WeeklyGoal` and `Goal(time_period=WEEKLY)` both persist (duplicate models — `ARCH-DB-008`-related), every WEEKLY write is doubling storage. Decision needed pre-Beta-2: deprecate one. |

**Finding cross-ref**: `ARCH-DB-002` (High), `ARCH-DB-004` (Medium).

---

## Summary Table

| Dimension | 10× | 100× | 1000× | Top breaker |
|---|---|---|---|---|
| Tenant count | 🟢 | 🟡 | 🟠 | `ARCH-AI-001` cache tenant-key |
| Read QPS | 🟢 | 🟡 | 🟠 | `ARCH-FE-006` client-side join + `ARCH-DB-002` index gap |
| Write QPS | 🟢 | 🟡 | 🟠 | `ARCH-DB-001` dual-write hazard |
| AI calls/min | 🟢 | 🟡 | 🟠 | `ARCH-AI-002` policy dormant + no rate-limit |
| Data per tenant | 🟢 | 🟡 | 🟠 | `ARCH-DB-002` project-mode index + `WeeklyGoal` vs Goal dedupe |

**Critical-path scalability concerns** (must address before Beta-2 promotion):
1. `ARCH-AI-001` cross-tenant cache key
2. `ARCH-AI-002` policy enforcement on wizard routes
3. `ARCH-DB-001` dual-write cleanup (or freeze of embedded consumers)

**High-path** (next sprint):
4. `ARCH-DB-002` project-mode index — bundles cleanly with B3c which already plans `{objective_id, time_period, start_date}` per canon Revision 2
5. `ARCH-FE-006` composed planning endpoint

**Beta-2 horizon** is the right cutoff for the Critical-path tier. Everything else can ride refinement-track epics.
