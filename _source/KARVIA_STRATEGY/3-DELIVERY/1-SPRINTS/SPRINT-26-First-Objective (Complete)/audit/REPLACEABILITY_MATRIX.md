# Replaceability Matrix — 4-Swap Modularity Test

<!-- @GENOME T3-SPR-026-AUDIT-REPLACE | ACTIVE | 2026-05-15 | parent:T3-SPR-026-AUDIT-ARCH | auto:- | linked:/audit-architecture -->

For each layer: could we swap it out today without rewriting the others? Each "no" is a modularity finding.

---

## Swap 1 — Replace the Frontend (CLI / mobile / Slack-bot OKR wizard)

**Question**: Could we ship a `karvia-cli okr create` command — same backend, no browser — without changing middleware?

**Answer**: ⚠️ **Mostly yes, but 3 blockers**

| Blocker | Source | Finding |
|---|---|---|
| Period preset mappings (90d/6mo/12mo → durationMonths) live in [objectives.html:2724-2734](../../../client/pages/objectives.html#L2724) | A CLI would have to re-implement these (or hardcode them too) | `ARCH-FE-001` |
| `pickCohortVariant(role, mode)` mapping lives in [ai-okr-review.js:728-734](../../../client/pages/scripts/ai-okr-review.js#L728) | A CLI rendering cohort-aware copy would have to duplicate the mapping function | `ARCH-FE-002` |
| `MANAGER_PLUS_ROLES` permission check in [planning-v2.js:33](../../../client/pages/scripts/planning-v2.js#L33) | A CLI deciding whether to show task-management commands would have to mirror the enum | `ARCH-FE-004` |

**Path to ✅**: Promote period presets + cohort variants to MW endpoints; have FE/CLI/mobile receive variant decisions as data. ~1 day. See [REMEDIATION_PLAN.md](REMEDIATION_PLAN.md) `R-FE-01`.

---

## Swap 2 — Replace the Database (MongoDB → Postgres)

**Question**: Could we move to Postgres without rewriting frontend or AI orchestrator?

**Answer**: ⚠️ **Partial — schema-shape leaks present**

| Leak | Source | Finding |
|---|---|---|
| FE reads `_source: 'new' \| 'legacy'` field on weekly goals | [planning-v2.js:172-196](../../../client/pages/scripts/planning-v2.js#L172) — FE knows about MongoDB collection union pattern | `ARCH-FE-005` |
| FE reads `obj.key_results[]` as embedded array vs collection — works for legacy Objectives, breaks for AI-wizard-created (which write `[]` only) | [objective-wizard.js:156-157](../../../client/pages/scripts/objective-wizard.js#L156) | `ARCH-FE-005` |
| Field-naming inconsistency (`end_date` vs `due_date` bridge at goals.js:53) is a Mongoose-shape habit | [goals.js:53](../../../server/routes/goals.js#L53) | `ARCH-DB-008` |
| Display virtuals on Mongoose models (`health_status`, `days_remaining`, `quarter_display`) | [Goal.js:342-376](../../../server/models/Goal.js#L342), [Task.js:365-407](../../../server/models/Task.js#L365) | `ARCH-DB-007` |
| Display calculations in pre-save hooks (`Goal.pre('save')` overdue flip, `Task.pre('save')` subtask progress) tied to Mongoose middleware system | [Goal.js:554-564](../../../server/models/Goal.js#L554), [Task.js:617-627](../../../server/models/Task.js#L617) | `ARCH-DB-003` |

**Path to ✅**: Two-phase. (1) Normalize FE-facing response shape via middleware so FE doesn't see `_source`/embedded-vs-collection split. (2) Move pre-save business logic to services so DB swap doesn't strand the orchestration. ~2 sprints worth.

---

## Swap 3 — Replace the LLM (OpenAI → Claude or a local model)

**Question**: Could we replace the LLM provider by changing only the LLM Gateway?

**Answer**: ✅ **YES — gateway is well-isolated**

**Evidence**:
- All LLM calls funnel through [LLMGateway.js:129 `gateway.complete()`](../../../server/services/LLMGateway.js#L129)
- Provider is config-driven: `process.env.LLM_PROVIDER || 'openai'` at [LLMGateway.js:64](../../../server/services/LLMGateway.js#L64)
- Prompts are provider-agnostic strings in [server/prompts/endpoint-templates/](../../../server/prompts/endpoint-templates/) — no OpenAI-specific function-calling syntax leaking into routes
- Retries / timeouts / cascade-caps live ONLY in the gateway

**Caveats** (not blockers):
- Adding Anthropic would require a new provider adapter file alongside the OpenAI one. Per-provider param translation (`max_tokens` vs `max_completion_tokens` etc.) already exists at [LLMGateway.js:174-179](../../../server/services/LLMGateway.js#L174) — same pattern extends.
- Response parsing currently expects free-text JSON; if Claude is used with structured tool-use, the parser at [objective-wizard.js:117-135](../../../server/routes/objective-wizard.js#L117) might need a per-provider variant. But this falls inside the gateway/parser abstraction.

**This is the cleanest swap** in the system. Strong architecture here.

---

## Swap 4 — Replace a Business Rule ("consultant can only edit managed clients")

**Question**: Could we change a role/scope rule without touching frontend or DB?

**Answer**: ⚠️ **Partial — RBAC is multi-located**

| Where RBAC currently lives | Finding |
|---|---|
| `requireRole()` middleware on most routes | ✅ correct primary surface |
| Inline role check at [ai-okr.js:3400](../../../server/routes/ai-okr.js#L3400) (`if (!['CONSULTANT','BUSINESS_OWNER'].includes(userRole))`) | ❌ `ARCH-MW-001` |
| FE hardcoded `MANAGER_PLUS_ROLES` in [planning-v2.js:33](../../../client/pages/scripts/planning-v2.js#L33) | ❌ `ARCH-FE-004` |
| FE `pickCohortVariant` 3-branch on `userRole === 'CONSULTANT'` | ❌ `ARCH-FE-002` |
| AI ops scope in `LLMPolicy.js` — defined but not enforced | ❌ `ARCH-AI-002` |
| Multi-tenant tenant check at `cohortDetection.js getAssignedConsultant` — predicate `managed_businesses: companyId` | ✅ correct |

**Path to ✅**: One-pass cleanup. Centralize RBAC decisions in middleware + `LLMPolicy`. FE consumes a `capabilities` array from `/auth/me` instead of comparing role strings. ~1 sprint, mostly mechanical edits.

---

## Summary

| Swap | Result | Why |
|---|---|---|
| Frontend | ⚠️ partial | 3 business-rule leaks in FE (period presets, cohort variant, role lists) |
| Database | ⚠️ partial | Mongoose-shape leaks + display virtuals in models + pre-save business logic |
| LLM | ✅ pass | Gateway is well-isolated; provider abstracted; prompts provider-agnostic |
| Business Rule | ⚠️ partial | RBAC scattered across 5+ sites including dormant Policy Layer |

**Score: 1 ✅ + 3 ⚠️ = LLM swap is the only "clean" Lego boundary today.**

The two-app separation (Step 5a) is a clean PASS — not a swap test per se, but a structurally tested invariant that holds.

**Headline**: AI Orchestrator is a strong layer (LLM Gateway pristine), but its Policy + Context-cache sub-services drag it down to a 4/6 grid score. Frontend has the most leak surface (3 HIGH findings). Backend has dual-write hazard as its biggest pending refactor (`ARCH-DB-001`).
