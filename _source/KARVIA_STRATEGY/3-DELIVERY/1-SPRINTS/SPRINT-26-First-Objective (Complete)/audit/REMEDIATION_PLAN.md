# Remediation Plan — OKR Creation Flow Audit

<!-- @GENOME T3-SPR-026-AUDIT-REMEDIATION | ACTIVE | 2026-05-15 | parent:T3-SPR-026-AUDIT-ARCH | auto:- | linked:/audit-architecture,/coding -->

**Status**: 🟢 ACTIVE — user signed off 2026-05-15 with pragmatic cut (not maximalist tier). Plan locked.

**Prerequisite**: read [ARCH_AUDIT_REPORT.md](ARCH_AUDIT_REPORT.md) first. 25 findings (3 Critical + 8 High + 10 Medium + 4 Low). After sign-off cut: **3 findings actionable in defined sessions** (`ARCH-AI-001` + `ARCH-AI-002` + `ARCH-DB-002`); **1 finding rides Sprint 27 cleanup-target** (`ARCH-DB-001` via PX-3.18); **21 findings deferred to refinement-track** (revisit only if customer telemetry surfaces them).

---

## 🟢 SIGNED OFF 2026-05-15 — Final Plan

Per user direction "lets go with your picks" honoring `feedback_minimal_change_grounding` over architectural maximalism:

| Decision | Pick | Rationale |
|---|---|---|
| **Tier 1 — Critical before Beta-2** | `ARCH-AI-002` + `ARCH-AI-001` only (~1h single session). `ARCH-DB-001` rides Sprint 27 PX-3.18 cleanup-target. | AI policy + cache-key are real correctness gaps; dual-write hazard already has a Sprint 27 plan via cleanup-target marker — no need to duplicate. |
| **Tier 2 — 8 High** | Only `ARCH-DB-002` rides B3c (already in canon Revision 2). Other 7 → refinement-track. | Don't ship architectural perfection; ship Beta correctly. Bundle the one finding that costs zero new scope. |
| **Tier 3 — 10 Medium** | Pure backlog. No bundling commit. | Tackle if a future slice happens to touch them. |
| **Tier 4 — 4 Low** | Note only. | Acceptable trade-offs / test-asserted parity already mitigates. |
| **Umbrella audit ID** | Mint `A20260515-03` for this audit checkpoint. | Clean traceability — future grep finds "when was this audit, what was the verdict". |

---

---

## Priority tiers

### Tier 1 — Pre-Beta-2 must-fix (3 Critical, ~1 sprint)

These three findings can leak data, allow privilege escalation, or accumulate dual-storage drift. Address before Beta-2 promotion.

| Finding | Fix | Effort | Audit-ID at coding |
|---|---|---|---|
| `ARCH-AI-001` Cross-tenant cache key collision | Add `companyId` to `_stableKey()` composition in [AIContextService.js:2208](../../../server/services/AIContextService.js#L2208). One-line. Regression test: vm-sandbox cache-key matrix with same params × different companyIds → distinct keys. | ~30 min | `A20260516-01` (or next date) |
| `ARCH-AI-002` LLM Policy dormant | Add `requireRole('CONSULTANT','BUSINESS_OWNER','EXECUTIVE')` middleware (OR `policy.check()` calls) on the 3 wizard LLM routes. Regression: integration test that EMPLOYEE token → 403 on `/refine-objective`. | ~1h | `A20260516-02` |
| `ARCH-DB-001` Dual-write hazard | Two-stage: (a) audit registry of every embedded-array consumer; (b) drop embedded schema in PX-3.18 single-purpose commit. Sprint 27 candidate per cleanup-target marker. | ~1 day | `A20260516-03` (or routes to refinement-track) |

**Greenlight gate**: User confirms Tier 1 must ship before Beta-2 (sign-off below).

---

### Tier 2 — Next sprint (8 High, ~1-2 sprints)

| Finding | Fix | Effort | Bundle with |
|---|---|---|---|
| `ARCH-FE-001` Period preset business rules in FE | Extract `GET /api/objective-wizard/period-presets` endpoint returning `[{key, label, durationMonths}]`. Both wizards fetch + render. | ~3-4h | Bundle with `ARCH-FE-002` (same shape) |
| `ARCH-FE-002` Cohort variant picker in FE | Middleware returns variant key in `/api/companies/:id` cohort payload (e.g., `cohort.variant_for_viewer`) computed from `(viewer.role, cohort.mode)`. FE renders only. | ~3-4h | Same slice as `ARCH-FE-001` |
| `ARCH-FE-003` Period date-math triplicated | Promote `isPeriodWithinBounds` + `deriveDurationMonths` to a shared `client/js/objective-period.js` OR receive bounds from MW endpoint (preferred — same slice as `ARCH-FE-001`) | ~1h | Same slice |
| `ARCH-MW-001` Inline RBAC in ai-okr.js | Replace `if (!['CONSULTANT','BUSINESS_OWNER'].includes(userRole))` at line 3400 with `requireRole()` middleware on the route declaration. | ~15 min | Bundle with `ARCH-AI-002` Tier 1 fix |
| `ARCH-MW-002` `validateGoalDateHierarchy` in route file | Promote to `ValidationService.validateGoalDateHierarchy(candidateGoal, company_id)`. 4 route imports updated. | ~1h | Standalone |
| `ARCH-DB-002` Project-mode index gap | Land `{objective_id:1, time_period:1, start_date:1}` per B3c canon (Revision 2). This rides B3c — already planned. | ~30 min (alongside B3c validator) | **B3c session** — already canonized |
| `ARCH-DB-003` Business logic in pre-save hooks | Extract `GoalStatusService.assessHealth(goal)` + `TaskProgressService.recompute(task)`; reduce hooks to thin "call service" or remove. Concurrency test with race fixture. | ~4h | Standalone — refinement-track candidate |
| `ARCH-AI-003` Response parser no schema validation | Wrap `parseAIResponse()` with Joi/Zod schema; fall back to existing static-template path on validation failure. Bundle with `ARCH-AI-004` (silent truncation) since the schema check makes truncation a logged error. | ~2-3h | Bundle with `ARCH-AI-004` |

**Sprint 27 candidates**: `ARCH-FE-001/-002/-003` (one slice), `ARCH-MW-002`, `ARCH-DB-003`, `ARCH-AI-003+004`.

---

### Tier 3 — Backlog / bundle with adjacent work (10 Medium)

Don't schedule independently; ride existing slices.

| Finding | Adjacency |
|---|---|
| `ARCH-FE-004` FE role enum hardcoded | Bundle with `ARCH-FE-002` cohort-variant-from-MW slice |
| `ARCH-FE-005` DB shape leak (`_source`, `week_number`) | Bundle with `ARCH-FE-006` composed planning endpoint |
| `ARCH-FE-006` Client-side planning join | Standalone if planning page gets attention; bundle with `ARCH-DB-002` index fix at B3c |
| `ARCH-FE-007` Hardcoded role strings in FE | Bundle with FE refactor wave |
| `ARCH-MW-003` ai-okr.js tenant guard | Add `requireTenantMatch(paramKey)` middleware; apply across all routes in one sweep |
| `ARCH-MW-004` Date math duplicated | Promote to DateService alongside `ARCH-FE-003` shared-module work |
| `ARCH-DB-004` Cross-year semantic not enforced at schema | Pre-save validator; bundle with `ARCH-DB-003` hook refactor |
| `ARCH-DB-005` Company.cohort virtual inconsistency | Bundle with `ARCH-FE-002` cohort-from-MW refactor |
| `ARCH-DB-006` Task tenant-leading index missing | Standalone; tiny |
| `ARCH-AI-004` Silent KR truncation | Subsumed by `ARCH-AI-003` schema validation |
| `ARCH-AI-005` PX-5.3 prompt regression invariants runtime | Wrap in `LLMGateway.complete()` pre-send; small |

---

### Tier 4 — Note in retro (4 Low)

No action needed; revisit if symptoms grow.

| Finding | Note |
|---|---|
| `ARCH-FE-008` SSI/Disciplines duplicated FE | Test-asserted parity mitigates; revisit if test removed |
| `ARCH-DB-007` Display virtuals on models | Acceptable trade-off for `toJSON` simplicity |
| `ARCH-DB-008` Field-naming inconsistency (`end_date` vs `due_date`) | Standardize on `due_date` long-term; not Beta blocker |
| `ARCH-AI-006` No prompt_version/model_used provenance | Observability gap, not correctness |

---

## Recommended Session Bindings

### Session B3c (already canonized) — adds `ARCH-DB-002`

B3c is the deferred Window CRUD UI + non-overlap validator session (`A20260514-11 part 2`). Per the canon (`SPRINT26_PLANNING_CASCADE_STRATEGY.md` §3.2b Revision 2), the new compound index `{objective_id, time_period, start_date}` lands with the validator. **`ARCH-DB-002` is already in B3c's spec.** Zero new scope.

### New session — "AI Orchestrator Hardening" (~2-3h)

Bundles 3 Critical/High Tier-1+2 items at the AI layer:
- `ARCH-AI-001` cache tenant-key
- `ARCH-AI-002` policy enforcement
- `ARCH-AI-003` + `ARCH-AI-004` response schema validation
- `ARCH-AI-005` runtime prompt-length assertion (LOW lift, bundles cleanly)

Mint `A20260516-01..05` at coding-time.

### New session — "FE Layer Cleanup" (~3-4h)

Bundles the FE business-rule extraction:
- `ARCH-FE-001` period presets MW endpoint
- `ARCH-FE-002` cohort variant from MW
- `ARCH-FE-003` date-math shared
- `ARCH-FE-004` + `ARCH-FE-007` role-strings → capabilities

Mint `A20260516-06..09`.

### Refinement-track — Backend cleanup epics

- `ARCH-DB-001` embedded KR cleanup (PX-3.18 cleanup-target) — Sprint 27+
- `ARCH-DB-003` pre-save hook → services
- `ARCH-MW-002` `validateGoalDateHierarchy` → ValidationService

---

## Sign-Off — COMPLETE 2026-05-15

| Question | User decision |
|---|---|
| Tier 1 (3 Critical) — fix before Beta-2? | ✅ **Partial — `ARCH-AI-002` + `-001` only** (~1h next session). `ARCH-DB-001` defers to Sprint 27 PX-3.18 (already planned). |
| Tier 2 — bundle as 2 new sessions or split? | ✅ **Just `ARCH-DB-002` rides B3c**. Other 7 High findings → refinement-track. |
| Tier 3 — bundle into adjacent work or schedule standalone? | ✅ **Pure backlog**. No active scheduling commit. |
| Tier 4 — Low findings noted only? | ✅ **Note only**. |
| Mint umbrella audit ID `A20260515-03`? | ✅ **Yes** — minted in AUDIT_TRACKER.md. |

**Final outcome**:
- 1 new /coding session scheduled: `A20260516-01` parts 1-2 (AI Orchestrator hardening, ~1h)
- 1 finding rides B3c: `ARCH-DB-002` index (zero new scope per canon Revision 2)
- 1 finding rides Sprint 27 cleanup-target: `ARCH-DB-001` via PX-3.18
- 21 findings deferred to refinement-track (revisit only if customer telemetry surfaces them)

Audit checkpoint logged as `A20260515-03` in [AUDIT_TRACKER.md](../../../2-QA-AND-TESTING/AUDIT_TRACKER.md).

---

## Cross-references

- [ARCH_AUDIT_REPORT.md](ARCH_AUDIT_REPORT.md) — full findings list
- [LAYER_MAP.md](LAYER_MAP.md) — file:line as-is map
- [REPLACEABILITY_MATRIX.md](REPLACEABILITY_MATRIX.md) — 4-swap modularity tests
- [SCALABILITY_LADDER.md](SCALABILITY_LADDER.md) — 10×/100×/1000× tier breakers
- Canon: [SPRINT26_PLANNING_CASCADE_STRATEGY.md](../SPRINT26_PLANNING_CASCADE_STRATEGY.md) §3.2b Revision 2 (B3c index already planned)
- Memory: `feedback_lego_architecture`, `feedback_minimal_change_grounding`, `feedback_reuse_max`, `feedback_extend_before_wrap`, `feedback_audit_governance`
