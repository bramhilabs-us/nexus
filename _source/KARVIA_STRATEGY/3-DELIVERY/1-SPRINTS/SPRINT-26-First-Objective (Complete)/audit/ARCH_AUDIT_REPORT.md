# Architecture Audit Report — OKR Creation Flow + Cohort-Aware Framing

<!-- @GENOME T3-SPR-026-AUDIT-ARCH | ACTIVE | 2026-05-15 | parent:T3-SPR-026-MP | auto:- | linked:/audit-architecture,/coding -->

**Session**: `/audit-architecture` 2026-05-15 (post-A20260515-02 commit `e81b345`)
**Author**: Sprint 26 quality checkpoint
**Status**: ACTIVE — findings finalized; remediation plan in [REMEDIATION_PLAN.md](REMEDIATION_PLAN.md) awaits user sign-off
**Scope**: Recent additive changes — C.3 cohort field (`A20260514-01`), B3a window_name plumbing (`A20260514-10`/`-11`), B1.4 goal-date hierarchy (`A20260514-09`), B3b planning min-amendment (`A20260514-12`), A20260515-02 AI-modal date cascade (4 parts)
**Out of scope**: C.1a workspace honesty (-02..-06), Workstream B email dispatchers (B.1-B.8), hardcoding sweep (`A20260513-08*`), Workstream E assessment aggregation

---

## Verdict

🟡 **YELLOW — structurally sound, but 3 CRITICAL findings need fix before Beta-2 + 8 HIGH findings sit on a refactor roadmap.**

**Architecture is sound**: 4 layers exist, LLM funnels through a real gateway, prompts live in their own folder, B3a/B3b/A20260515-02 stay within minimum-amendment posture per memory `feedback_reuse_max`.

**But three Critical gaps**:

1. **AI policy layer is scaffolded but dormant** — `LLMPolicy.js` defines the right surface but isn't called on any `/objective-wizard/*` LLM route. An EMPLOYEE who acquires a session ID can trigger LLM calls today. (`ARCH-AI-002`)
2. **AI context cache key omits tenant ID** — `_stableKey()` serializes params only; CompanyA + CompanyB context fetches with matching params collide. Cross-tenant data leak risk. (`ARCH-AI-001`)
3. **Embedded ↔ Standalone KeyResult dual-write coordination is missing** — `Objective.key_results[]` and `KeyResult` collection drift on Task → Goal cascade. Cleanup-target `PX-3.18` acknowledges this but no consumer migration plan exists yet. (`ARCH-DB-001`)

The A20260515-02 fix shipped today is clean — its 4 parts honor reuse-max and slot into the existing custom-period branch without amplifying any of these findings. The Critical work below is pre-existing debt the audit surfaced, not regression from today's commit.

---

## Findings by Severity

### 🔴 CRITICAL (3)

#### `ARCH-AI-001` — Cross-tenant cache key collision in `AIContextService`

**Layer leak**: AI Orchestrator (Context Builder) reads tenant context but the cache layer doesn't tenant-isolate the key.

**Evidence**: [server/services/AIContextService.js:2208](../../../../../server/services/AIContextService.js#L2208) — `_stableKey(params)` serializes params alone; `companyId` is not part of the cache key.

**Impact**: A CompanyA context fetch, followed by a CompanyB fetch with the same `params` hash, hits the CompanyA cache entry → CompanyB caller receives CompanyA context data. Multi-tenant invariant breach. The risk is mitigated today because `params` typically include the userId (which is tenant-distinct), but a future caller passing only structural params (e.g., a system job iterating companies) would trip it.

**Fix**: Include `companyId` in the cache-key composition. One-line change. No new module.

---

#### `ARCH-AI-002` — LLM Policy Layer not enforced on objective-wizard routes

**Layer leak**: AI Orchestrator (Policy Layer) is scaffolded at [server/services/LLMPolicy.js](../../../../../server/services/LLMPolicy.js) with 8 registered ops but never called on the wizard's three LLM-touching routes.

**Evidence**:
- [server/routes/objective-wizard.js:265](../../../../../server/routes/objective-wizard.js#L265) `/refine-objective` — only `verifyToken`, no `policy.check()`
- [server/routes/objective-wizard.js:413](../../../../../server/routes/objective-wizard.js#L413) `/generate-krs` — same
- [server/routes/objective-wizard.js:543](../../../../../server/routes/objective-wizard.js#L543) `/regenerate-kr` — same

**Impact**: Session ownership is enforced (`WizardSessionService.validateOwnership`) but role gating is NOT. An EMPLOYEE who acquires a session_id (their own session, a leaked one, or a guess) can fire LLM calls today. Per `LLMPolicy.js:44-54`, intended scope is `CONSULTANT | BUSINESS_OWNER | EXECUTIVE` only. Privilege-escalation surface.

**Fix**: `requireRole('CONSULTANT','BUSINESS_OWNER','EXECUTIVE')` middleware on the 3 routes — OR a `policy.check({op:'kr-generation', user:req.user})` invocation. Same posture as the rest of the codebase. ~15 LoC.

---

#### `ARCH-DB-001` — Objective ↔ KeyResult dual-write coordination missing

**Layer leak**: Backend dual-storage model (embedded `Objective.key_results[]` + standalone `KeyResult` collection) has no synchronizer for downstream cascades. Cleanup-target marker acknowledges this but no migration plan exists.

**Evidence**:
- [server/models/Objective.js:170-228](../../../../../server/models/Objective.js#L170-L228) — embedded `key_results[]` schema, cleanup-target comment at line 170-173
- [server/models/Goal.js:567](../../../../../server/models/Goal.js#L567) — `Goal.post('save')` updates `Objective.metrics` but never syncs to standalone `KeyResult`
- [server/models/Task.js:630-645](../../../../../server/models/Task.js#L630-L645) — `Task → Goal` cascade updates goal metrics; embedded `Objective.key_results[]` stays stale
- [server/routes/objective-wizard.js:921](../../../../../server/routes/objective-wizard.js#L921) — finalize writes ONLY to `KeyResult` collection (per PX-3.6 slice 3); embedded array is left at `[]`

**Impact**: Reads from `Objective.key_results[]` (legacy consumers) and reads from `KeyResult` collection (new consumers) can disagree on KR status, progress, ownership. Today the standalone collection is the SOLE write target (per PX-3.6 slice 3) so reads should converge — but any code reading the embedded array gets a `[]` for AI-wizard-created objectives. The cleanup-target `PX-3.18` is overdue.

**Fix**: Two-stage. (a) Audit all embedded `key_results[]` consumers, flag dead-reads; (b) drop the embedded schema in a single-purpose commit. Sprint 27 candidate. Per `feedback_cleanup_boundary_pattern`, this work has a registry doc that lists every consumer.

---

### 🟠 HIGH (8)

#### `ARCH-FE-001` — Period preset business rules baked into frontend

**Layer leak**: Frontend hardcodes the preset-to-month mapping that defines Karvia's "objective horizon categories" (90d/6mo/12mo). This is a product decision, not UI chrome.

**Evidence**:
- [client/pages/objectives.html:2724-2734](../../../client/pages/objectives.html#L2724-L2734) — AI modal Screen 3 preset map (added today by A20260515-02 part 1)
- [client/pages/scripts/objective-wizard.js:357-365](../../../client/pages/scripts/objective-wizard.js#L357-L365) — same `30.4375 days/month` math, duplicated in standalone wizard

**Impact**: Adding/removing a preset (e.g., "30 days" for sprint-style objectives) requires editing both FE files. The 1-36 month bound check is duplicated client + server — drift risk.

**Fix**: Extract presets to a config endpoint (e.g., `GET /api/objective-wizard/presets`) returning `[{key, label, durationMonths}]`. FE becomes pure render. Today's A20260515-02 acceptable as minimum-amendment; promote when 3rd consumer appears or a 4th preset is requested.

---

#### `ARCH-FE-002` — Cohort variant picker logic in frontend

**Layer leak**: The `(role, cohort.mode) → variant` mapping decides which copy block to render. The MAPPING is business logic (which actor sees which framing); the RENDER is FE. Today both live in FE.

**Evidence**: [client/pages/scripts/ai-okr-review.js:728-734](../../../client/pages/scripts/ai-okr-review.js#L728-L734) — `pickCohortVariant(userRole, cohortMode)` 3-branch function.

**Impact**: A new cohort type (e.g., `mode='trial'`) or a role rule change ("EXECUTIVE sees the consultant_view variant") requires editing FE. The variant strings themselves live in `AIOKR_REVIEW_COPY` as a FE constant — same drift risk as `ARCH-FE-001`.

**Fix**: Middleware-side helper returns the variant key as part of the page-context payload. FE renders only. Bundle with `ARCH-FE-001` config-endpoint extraction.

---

#### `ARCH-FE-003` — Period date-math duplicated across two FE files

**Layer leak**: `isPeriodWithinBounds` + `deriveDurationMonths` exist in [objective-wizard.js:332-365](../../../client/pages/scripts/objective-wizard.js#L332-L365) AND now also inlined into [objectives.html:2704-2734](../../../client/pages/objectives.html#L2704-L2734) by today's A20260515-02 part 1 (per `feedback_minimal_change_grounding`). Promotion to shared module deferred until 3rd consumer.

**Evidence**: see above.

**Impact**: Same business rule (1-36 month bound, 30.4375 days/month mean) lives in 3 places now (2 FE + BE [objective-wizard.js:837-839](../../../server/routes/objective-wizard.js#L837-L839)). A change to the duration bounds (e.g., extend to 48 months) requires 3 edits.

**Fix**: Shared `client/js/objective-period.js` module exporting the 2 helpers. Or — better — middleware returns the bounds as part of the period-presets endpoint (`ARCH-FE-001` fix). Either way, this is the third-consumer trigger that promotes from inline to shared.

---

#### `ARCH-MW-001` — Inline RBAC check in ai-okr.js instead of middleware

**Layer leak**: One route uses inline `if (!['CONSULTANT', 'BUSINESS_OWNER'].includes(userRole))` instead of `requireRole()` middleware. Inconsistent with the rest of the codebase.

**Evidence**: [server/routes/ai-okr.js:3400](../../../server/routes/ai-okr.js#L3400) — inline check pattern.

**Impact**: Auditability + bypass-risk. Middleware checks fail fast and are visible at route declaration time; inline checks live deep in handler bodies.

**Fix**: Convert to `requireRole('CONSULTANT', 'BUSINESS_OWNER')` middleware on the route declaration. ~5 LoC.

---

#### `ARCH-MW-002` — `validateGoalDateHierarchy` lives in route file, not service

**Layer leak**: B1.4's parent-lookup + date validation orchestration lives inline in [goals.js:50-99](../../../server/routes/goals.js#L50-L99), called from 4 route handlers. Per the development rule "what rule decides the result? → Middleware", orchestrating helpers belong in a service.

**Evidence**: see line citation. ValidationService.js has `validateGoalDates` (pure data check) but not the wrapper that loads the parent + bridges `due_date → end_date`.

**Impact**: If a 5th route or a non-route caller (e.g., a cascade hook on `Objective.date` change) needs the same check, they must duplicate the wrapper.

**Fix**: Promote `validateGoalDateHierarchy` to `ValidationService.validateGoalDateHierarchy(candidateGoal, company_id)`. ~30 LoC move + 4 route-file imports. Per `feedback_extend_before_wrap` — extend ValidationService, don't wrap.

---

#### `ARCH-DB-002` — Goal.quarter/year relaxation broke index coverage for project-mode

**Layer leak**: B3a relaxed `Goal.quarter` and `Goal.year` to optional for QUARTERLY goals, but the compound index at [Goal.js:331-339](../../../server/models/Goal.js#L331-L339) `{company_id, quarter, year, week}` still requires those keys for an index scan. Project-mode goals (null quarter/year) force a collection scan.

**Evidence**: see Goal.js index block. The planned new index `{objective_id:1, time_period:1, start_date:1}` (per A20260514-11 part 2 / B3c) is the right shape — but it's deferred to B3c which hasn't shipped.

**Impact**: Query plans for project-mode goals scan the collection. At 100× tenant scale or 10× goal count, this becomes a real latency hit on the planning page.

**Fix**: Land the new index alongside the deferred `validateGoalNoOverlap` at B3c, OR ship the index alone now as a quick-win precursor. Per the canon §3.2b — ONE new index per Revision 2, no extension to legacy.

---

#### `ARCH-DB-003` — Business logic in `pre('save')` hooks

**Layer leak**: Mongoose model hooks perform business-rule state transitions instead of pure data integrity. Per the development rule, status flips belong in services.

**Evidence**:
- [server/models/Goal.js:554-564](../../../server/models/Goal.js#L554-L564) — `Goal.pre('save')` auto-flips overdue in-progress → `at_risk`
- [server/models/Task.js:617-627](../../../server/models/Task.js#L617-L627) — `Task.pre('save')` auto-computes subtask progress

**Impact**: Concurrent saves race: save#2 sees save#1's at-risk state and skips its own recalc. No idempotency guard. State transitions aren't testable independent of the DB.

**Fix**: Move to `GoalStatusService.assessHealth(goal)` + `TaskProgressService.recompute(task)` called from routes/cascades. Hook becomes a thin "call the service" wrapper or is removed entirely.

---

#### `ARCH-AI-003` — Response parser doesn't schema-validate LLM output

**Layer leak**: AI Orchestrator (Response Parser) accepts whatever shape the LLM returns, trusts `.krs.length`, and silently truncates oversize arrays.

**Evidence**:
- [server/routes/objective-wizard.js:504-506](../../../server/routes/objective-wizard.js#L504-L506) — `if (result.krs && result.krs.length > 4) result.krs = result.krs.slice(0, 4)` — works on string too (string.slice returns a string-like array), no error
- [server/services/aiOKRService.js:591-614](../../../server/services/aiOKRService.js#L591-L614) — similar trust-the-shape pattern

**Impact**: Malformed LLM output silently degrades. 10 generated KRs get truncated to 4 with no log. Schema regressions (LLM returning wrong field names) won't fail loud.

**Fix**: Wrap `parseAIResponse()` with a Joi/Zod schema check. Reject + log + fall back to the static template path that already exists at [objective-wizard.js:344-348](../../../server/routes/objective-wizard.js#L344-L348). ~30 LoC + schema files.

---

### 🟡 MEDIUM (10)

| ID | Title | Layer | Evidence | Fix |
|---|---|---|---|---|
| `ARCH-FE-004` | Role-based task permission check in FE (`MANAGER_PLUS_ROLES` hardcoded) | Frontend | [planning-v2.js:33,91](../../../client/pages/scripts/planning-v2.js#L33) | API-level RBAC is the source of truth; FE consumes a `capabilities` array from `/auth/me` |
| `ARCH-FE-005` | DB shape leak — FE reads `_source` field to disambiguate legacy vs new Goal collection | Frontend | [planning-v2.js:172-196](../../../client/pages/scripts/planning-v2.js#L172-L196) | Normalize response shape in middleware so FE doesn't see migration internals |
| `ARCH-FE-006` | Client-side join — FE chains `/objectives` → `/weekly-goals/:krId` → `/tasks?goal_id=...` and embeds | Frontend | [planning-v2.js:130-165,215-234](../../../client/pages/scripts/planning-v2.js#L130-L234) | Composed BE endpoint `/api/planning/objective/:id?include=krs,goals,tasks` |
| `ARCH-FE-007` | Hardcoded role enum strings (`'CONSULTANT'`, `'BUSINESS_OWNER'`) compared throughout FE | Frontend | [ai-okr-review.js:729](../../../client/pages/scripts/ai-okr-review.js#L729), [planning-v2.js:33](../../../client/pages/scripts/planning-v2.js#L33) | Lint rule + reference shared constants OR derive from server-issued capabilities |
| `ARCH-MW-003` | ai-okr.js request-body `company_id` accepted without consistent upstream tenant guard | Middleware | [ai-okr.js:1335,1351](../../../server/routes/ai-okr.js#L1335) | Add `requireTenantMatch(paramKey)` middleware; standardize across all routes |
| `ARCH-MW-004` | Date math duplicated across `DateService` + `objective-wizard.js` inline + `goals.js` | Middleware | [objective-wizard.js:43-59,832-839](../../../server/routes/objective-wizard.js#L43), [DateService.js:41-190](../../../server/services/DateService.js#L41) | Promote `30.4375 days/month` math to DateService; have wizard call into it |
| `ARCH-DB-004` | Cross-year objective semantics under-represented in schema (no validation enforcing target_year + duration_months coherence with end_date) | Backend | [Objective.js:88-103](../../../server/models/Objective.js#L88-L103) | Add `pre('save')` validation that target_year === start_date.getFullYear() (already enforced at the wizard layer but not at the schema layer) |
| `ARCH-DB-005` | `Company.cohort` virtual returns `undefined` while the cohort field IS attached at the route layer — silent inconsistency for `toJSON()` consumers | Backend | [Company.js:590-596](../../../server/models/Company.js#L590-L596), [companies.js:150-170](../../../server/routes/companies.js#L150-L170) | Either add a `cohort` virtual or remove the existing `company_health_score`/`size_description` virtuals and move all display logic to `CompanyDisplayService` |
| `ARCH-DB-006` | Task model missing `{company_id, objective_id, status}` index for cascade-delete on objective | Backend | [Task.js:357-362](../../../server/models/Task.js#L357-L362) | Add compound index + `Objective.post('remove')` orphan cleanup hook |
| `ARCH-AI-004` | KR count silently truncated to 4 with no log/error | AI Orchestrator | [objective-wizard.js:504-506](../../../server/routes/objective-wizard.js#L504-L506) | Throw + log; let response parser schema validation (`ARCH-AI-003`) own this |
| `ARCH-AI-005` | PX-5.3 prompt-regression invariants (500-50000 char length, leaked-debug-strings, identity-line) not enforced at runtime — only at test time | AI Orchestrator | [server/prompts/endpoint-templates/single-objective.js](../../../server/prompts/endpoint-templates/single-objective.js), [okr-generation.js](../../../server/prompts/endpoint-templates/okr-generation.js) | Add runtime assertion in `LLMGateway.complete()` before send |

### 🟢 LOW (4)

| ID | Title | Mitigation present? |
|---|---|---|
| `ARCH-FE-008` | SSI dimensions + disciplines duplicated FE-side ([objective-wizard.js:51-74](../../../client/pages/scripts/objective-wizard.js#L51-L74)) | ✅ test-asserted parity in `test-sprint23-190` |
| `ARCH-DB-007` | Display-label virtuals on Goal/Task/KeyResult (`health_status`, `days_remaining`, `quarter_display`) | None — but acceptable trade-off for default `toJSON` |
| `ARCH-DB-008` | Field-naming inconsistency: Objective `end_date` vs Goal `due_date` vs Task `due_date+start_date` | Bridge logic at [goals.js:53](../../../server/routes/goals.js#L53); long-term standardize on `due_date` |
| `ARCH-AI-006` | No `prompt_version` / `session_id` / `ai_model_used` provenance on AI-generated Objectives | Replay possible only via timestamp + session lookup |

---

## Step 5a — Two-App Separation Check ✅ PASS

Karvia's two-app model (Consultant App + Client App sharing one backend, no JWT swap) survives every change in scope.

| Question | Found |
|---|---|
| Does the feature belong to Consultant App, Client App, or both? | **Both** — Consultant initiates AI-OKR review on `client-workspace.html`, BO authors via `objective-wizard.html` (canonical) or `objectives.html` modal (AI). C.3 cohort field surfaces in both apps. |
| Consultant-facing surfaces call `GET /api/consultant/clients/:id/*`? | ✅ Yes — no `switch-company` JWT swap anywhere |
| Consultant top-nav stays "RSM Consulting"? | ✅ Yes (C.3 framing distinguishes "reviewing for client X" vs "BO mode") |
| Tenant scope enforced server-side via `req.user.managed_businesses`? | ✅ Yes — [cohortDetection.js getAssignedConsultant](../../../server/utils/cohortDetection.js) is correct |
| Client-facing surfaces bar consultant? | ✅ Yes via RBAC + route-level role check |
| Frontend assets split role-specifically? | ✅ Yes (consultant theme distinct) |
| Middleware exposes role-scoped surfaces vs single-endpoint-branches-on-role? | ✅ Yes |

**No Critical findings on the two-app axis.** This is the cleanest dimension of the audit.

---

## Step 5b — AI Orchestrator 6-Sub-Service Grid

| Sub-service | Status | Evidence |
|---|---|---|
| Context Builder | ⚠️ partial | Present at [AIContextService.js:141-259](../../../server/services/AIContextService.js#L141) but cache key omits tenant (`ARCH-AI-001`) |
| Prompt Builder | ✅ present | Centralized at [server/prompts/endpoint-templates/](../../../server/prompts/endpoint-templates/); minor: no explicit `v1`/`v2` version string |
| Policy Layer | ❌ scaffolded, not enforced | [LLMPolicy.js](../../../server/services/LLMPolicy.js) defines 8 ops but no route calls `policy.check()` on objective-wizard paths (`ARCH-AI-002`) |
| LLM Gateway | ✅ present + strong | [LLMGateway.js](../../../server/services/LLMGateway.js) — single chokepoint, retries, timeouts, cascade cap, provider-abstracted |
| Response Parser | ⚠️ partial | JSON extraction works ([objective-wizard.js:117-135](../../../server/routes/objective-wizard.js#L117-L135)) but no schema validation; silent truncation (`ARCH-AI-003`, `ARCH-AI-004`) |
| Memory Writer | ✅ present | `ai_generated: true` flag on Objective + KR; minor gap: no `prompt_version`/`model_used` (`ARCH-AI-006`) |

**Score: 4/6 strong + 2 partial. Target post-remediation: 6/6.**

---

## Step 6 — Development Rule Checklist

| Question | Answer | Lives in | Layer | Correct? |
|---|---|---|---|---|
| What does the user see? | Period selector + Refined Objective + Owner + Generate KRs | objectives.html Screen 3, ai-okr-review.html | FE | ✅ |
| What action does the user take? | Click preset / edit dates / pick owner / click Generate KRs / click Create | onclick handlers, addEventListener wiring | FE | ✅ |
| What rule decides the period horizon? | 1-36 month bounds | objective-wizard.js (BE) + objective-wizard.js (FE) + objectives.html (FE) | **MW + FE duplicated** | ❌ (`ARCH-FE-003`/`ARCH-MW-004`) |
| What rule decides KR count? | "max 4" | objective-wizard.js:504 (BE inline) | MW | ⚠️ (`ARCH-AI-004` — silent, no log) |
| What rule decides cohort variant? | (role, cohort.mode) → variant | ai-okr-review.js (FE) | **FE** | ❌ (`ARCH-FE-002`) |
| What rule decides RBAC for LLM ops? | `LLMPolicy` ops list | LLMPolicy.js exists, not called | **MW (dormant)** | ❌ (`ARCH-AI-002`) |
| What data is needed for refine? | Company SSI + objective text + period | AIContextService | MW (Data Service) | ✅ (but ⚠️ `ARCH-AI-001`) |
| What data is stored? | Objective + KeyResult collection | Mongoose models | DB | ✅ |
| Is intelligence needed? | Yes — refine + generate KRs + regenerate | LLMGateway funnel | AI-O | ✅ |
| What prompt/context is needed? | Versioned templates | server/prompts/endpoint-templates/ | AI-O | ✅ |

---

## Severity → Action Mapping

| Severity | Count | Action |
|---|---|---|
| 🔴 Critical | 3 | Schedule before Beta-2 cut |
| 🟠 High | 8 | Schedule in next sprint or refinement-track epic |
| 🟡 Medium | 10 | Backlog; bundle with adjacent work |
| 🟢 Low | 4 | Note in retro; revisit if grows |
| **Total** | **25** | See [REMEDIATION_PLAN.md](REMEDIATION_PLAN.md) for session bindings |

---

## Cross-references

- [LAYER_MAP.md](LAYER_MAP.md) — as-is 4-layer file:line map
- [REPLACEABILITY_MATRIX.md](REPLACEABILITY_MATRIX.md) — 4-swap modularity test results
- [SCALABILITY_LADDER.md](SCALABILITY_LADDER.md) — 10×/100×/1000× bottleneck table
- [REMEDIATION_PLAN.md](REMEDIATION_PLAN.md) — prioritized fixes with session bindings (**awaits user sign-off**)
