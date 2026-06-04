# Sprint 22a — Architecture Audit Report

<!-- @GENOME T3-SPR-022a-AUDIT-RPT | DRAFT | 2026-04-30 | parent:T3-SPR-022a-AUDIT | auto:- | linked:/audit-architecture -->

**Target**: Sprint 22a — Consultant↔Client Architectural Separation
**Method**: 4-layer Lego audit per [.claude/commands/audit-architecture.md](../../../../.claude/commands/audit-architecture.md)
**Date**: 2026-04-30
**Companion docs**: [LAYER_MAP.md](LAYER_MAP.md), [REPLACEABILITY_MATRIX.md](REPLACEABILITY_MATRIX.md), [SCALABILITY_LADDER.md](SCALABILITY_LADDER.md), [REMEDIATION_PLAN.md](REMEDIATION_PLAN.md)

---

## Executive Summary

The Karvia codebase is **80% architecturally ready** for the two-app split (Consultant App ↔ Client App). The 4-layer separation has been quietly enforced since multi-tenancy landed: tenant scope on every doc, RBAC in pure middleware, AI Orchestrator extracted in Sprint 22 #176-178. **Sprint 22a is cleanup, not redesign.**

**Critical leaks** are concentrated in 3 frontend files (`common.js`, `navigation.js`, `my-clients.js`) — all symptoms of the JWT-swap pattern, all retired by #184c. **No data model migration.** **No new microservice.** **No replatform of authentication.**

The only finding outside Sprint 22a's stated scope: **6 direct OpenAI imports outside the LLM Gateway** drag the AI Orchestrator's modularity score from 10/10 to 6/10. Recommend bundling a 4-pt cleanup into Sprint 23.

---

## Findings (grouped by severity)

### Critical (C) — Block Beta

| ID | Title | Layer leak | Evidence | Fix |
|---|---|---|---|---|
| **F-C-01** | Frontend mutates server-side tenant scope via `ensureActiveCompany` | FE → MW | [client/js/common.js:637-676](../../../../client/js/common.js#L637-L676) calls `PUT /api/auth/switch-company` | Replace with `?client=X` URL param + server-side membership check; remove `ensureActiveCompany` for CONSULTANT (#184c) |
| **F-C-02** | Consultant becomes the client (theme/identity flip) | FE → MW | [client/js/navigation.js:406-484](../../../../client/js/navigation.js#L406-L484) renders "Viewing as: Client Company" purple banner — only renders because consultant *is* the client | Delete banner code path for CONSULTANT; preserve for future BUSINESS_OWNER multi-org (#184c) |
| **F-C-03** | `my-clients.js` tile click swaps JWT before navigating | FE → MW | [client/pages/scripts/my-clients.js:30,41,578](../../../../client/pages/scripts/my-clients.js#L30) `navigateToClient()` issues `PUT /switch-company` then redirects | Replace with direct nav to `client-workspace.html?client=X#tab=...`; no swap (#184c) |

### High (H) — Schedule next sprint

| ID | Title | Layer leak | Evidence | Fix |
|---|---|---|---|---|
| **F-H-01** | Per-client deep reads missing → frontend cannot be swapped | MW gap | No `GET /api/consultant/clients/:id/{profile,objectives,goals/*,teams,assessments,dashboard-summary}` exists today | Implement 6 endpoints per `API_CONTRACT.md` (#184a) |
| **F-H-02** | `client-workspace.html` doesn't exist | FE gap | `ls client/pages/client-workspace*` → no matches | Create single tabbed page in #184b |
| **F-H-03** | 6 direct OpenAI imports outside LLM Gateway | MW → AI-O | [ai-okr.js:1677,2561](../../../../server/routes/ai-okr.js#L1677), [planning.js:17](../../../../server/routes/planning.js#L17), [objective-wizard.js:15](../../../../server/routes/objective-wizard.js#L15), [AIObjectivePlanner.js:26](../../../../server/services/AIObjectivePlanner.js#L26), [AIEstimator.js:7](../../../../server/services/AIEstimator.js#L7), [SSINarrativeService.js:17](../../../../server/services/SSINarrativeService.js#L17) | Funnel through `aiOKRService.callOpenAIWithRetry` (Sprint 23) |
| **F-H-04** | `navigation.js` company switcher dropdown calls `switch-company` | FE → MW | [client/js/navigation.js:344-378](../../../../client/js/navigation.js#L344-L378) | Already CONSULTANT-suppressed at :162,:234; retire caller code path entirely in #184c (or guard for future multi-org BO) |
| **F-H-05** | `switchToOwnCompany()` is the second `switch-company` caller | FE → MW | [client/js/navigation.js:489+](../../../../client/js/navigation.js#L489) | Retire with the banner (#184c) |
| **F-H-06** | Cascade fan-out has no aggregate cap (post-Beta scale risk) | AI-O | [aiOKRService.js](../../../../server/services/aiOKRService.js) cascade chain | Add max-cascade-cost (Sprint 23) |

### Medium (M) — Backlog / contract design

| ID | Title | Layer leak | Evidence | Fix |
|---|---|---|---|---|
| **F-M-01** | `portfolio-summary` has no pagination | MW | [consultant.js:88](../../../../server/routes/consultant.js#L88) returns full managedIds set | Add `?limit=&cursor=` to #184a contract |
| **F-M-02** | `dashboard-summary` contract not drafted; risk of N+1 composition | MW | #184a — endpoint TBD | Bake pagination + max sub-query count into `API_CONTRACT.md` |
| **F-M-03** | Mongoose virtuals compute user-visible labels | DB → MW | [Company.js:559-674](../../../../server/models/Company.js#L559-L674) — `size_description`, `profile_completion`, etc. | Move to a `CompanyService.computeDisplay()` method (post-Beta) |
| **F-M-04** | `portfolio-summary` may be N+1 (sequential vs parallel sub-queries) | MW | [consultant.js:95+](../../../../server/routes/consultant.js#L95) iterates managedIds | Verify `Promise.all` usage; parallelize if needed (during #184a) |
| **F-M-05** | No Redis cache wired (`FEATURE_REDIS_ENABLED: false`) | MW | [feature-flags.js:11](../../../../server/services/feature-flags.js#L11) | Wire after #184a's hot endpoints stabilize |
| **F-M-06** | Each `client-workspace.html` tab must consume one composed endpoint (architectural rule) | FE | #184b design choice | Encode as a #184b acceptance criterion |
| **F-M-07** | Mailjet template IDs not greppable from code | MW | [mailjetService.js:196](../../../../server/services/mailjetService.js#L196) `sendCompanyInvitationEmail` exists but template config is env-driven | NEEDS-VERIFY before #184d scoping (1 audit task) |

### Low (L) — Note in retro

| ID | Title | Evidence | Action |
|---|---|---|---|
| **F-L-01** | `User.current_company_id` exists *because* of JWT-swap pattern | [User.js](../../../../server/models/User.js) | After #184c, document as legacy-admin-only; schedule deprecation review post-Beta |
| **F-L-02** | `User.managed_businesses[]` will hit BSON 16MB at 1000× | [User.js](../../../../server/models/User.js) | Denormalize to `ConsultantClient` join collection post-Beta |
| **F-L-03** | 16 frontend `role === 'CONSULTANT'` checks (rendering only) | grep results | Acceptable; flagged so any drift to "business rule in frontend" is noticed |

**Total findings**: 3 C + 6 H + 7 M + 3 L = **19 findings**.
**Sprint 22a closes**: 3 C + 4 H + 3 M = 10 findings (53%).
**Sprint 23 carry-over**: 2 H + 2 M + 1 L = 5.
**Backlog (post-Beta)**: 0 H + 2 M + 2 L = 4.

---

## Step 5a — Two-App Separation Check (per epic)

### #184a — Consultant Read API surface

| Question | Answer |
|---|---|
| Belongs to | Consultant App |
| Calls `GET /api/consultant/clients/:id/*`? | ✅ This **is** the implementation of those endpoints |
| Top nav stays "RSM Consulting"? | ✅ N/A (backend) |
| Tenant scope via `req.user.managed_businesses`? | ✅ Required: every endpoint asserts `req.params.id ∈ req.user.managed_businesses` |
| Client app barred? | ✅ `requireRole('CONSULTANT')` |
| FE shared / split? | ✅ Backend-only |
| Middleware role-scoped surfaces (not branching on role)? | ✅ Lives at `/api/consultant/*` namespace |

**Verdict**: ✅ Architecturally clean. Mirror the existing `consultant.js` pattern. Bake F-M-01, F-M-02, F-M-04 into the contract.

### #184b — `client-workspace.html`

| Question | Answer |
|---|---|
| Belongs to | Consultant App (consultant theme, no JWT swap) |
| Calls `GET /api/consultant/clients/:id/*`? | ✅ One endpoint per tab |
| Top nav stays "RSM Consulting"? | ✅ Mandatory acceptance criterion |
| Tenant scope via `req.user.managed_businesses`? | ✅ Server-side; frontend passes `?client=X` as a hint, server validates |
| Client app barred? | ✅ Page is consultant-only (`requireRole('CONSULTANT')` on all data calls) |
| FE shared / split? | ⚠️ NEW page; no shared assets w/ client app |
| Middleware role-scoped surfaces? | ✅ Each tab → one #184a endpoint |

**Verdict**: ✅ Architecturally clean. Add F-M-06 acceptance criterion: each tab = one composed endpoint, no client-side joins.

### #184c — Retire `switch-company` from consultant flows

| Question | Answer |
|---|---|
| Belongs to | Consultant App refactor |
| Calls `GET /api/consultant/clients/:id/*`? | ✅ Replaces switch-company callers w/ #184a calls |
| Top nav stays "RSM Consulting"? | ✅ Banner code path retired for CONSULTANT |
| Tenant scope via `req.user.managed_businesses`? | ✅ #184a endpoints already enforce |
| Client app barred from `switch-company`? | ✅ Server route stays alive (D5); only consultant frontend callers retire |
| FE shared / split? | ✅ Removes shared `ensureActiveCompany` from CONSULTANT path; tenant pages keep it for non-CONSULTANT |
| Middleware role-scoped surfaces? | ✅ |

**Verdict**: ✅ Architecturally clean. **F-C-01, F-C-02, F-C-03, F-H-04, F-H-05** all fixed here.

**Critical**: #184c must include a grep-asserted test that no consultant frontend code path calls `/api/auth/switch-company`. Already drafted in `SPRINT22a_MASTER_PLAN.md` Risks section.

### #184d — Invitation flow (Mailjet wired)

| Question | Answer |
|---|---|
| Belongs to | Both — consultant triggers it (Consultant App), client receives email + accepts (Client App entry point) |
| Calls `GET /api/consultant/clients/:id/*`? | N/A (write path) |
| Top nav stays "RSM Consulting" for consultant? | ✅ Wizard already in `my-clients.html` |
| Tenant scope server-side? | ✅ Invitation creation already CONSULTANT-guarded ([invitations.js:1368](../../../../server/routes/invitations.js#L1368)) |
| Client app barred? | ⚠️ Accept route is **public** ([invitations.js:37,105](../../../../server/routes/invitations.js#L37)) — this is correct (POC has no account yet); but token validation must be airtight |
| Two-app boundary respected? | ✅ POC creates own account in their tenant; consultant never JWT-swaps to onboard |

**Verdict**: ✅ Architecturally clean. **NEEDS-VERIFY F-M-07 before scoping**: confirm Mailjet template IDs exist for invitation copy.

### #184e — Auto stage transitions

| Question | Answer |
|---|---|
| Belongs to | Backend (data model) + Middleware (post-save hooks) |
| Calls `GET /api/consultant/clients/:id/*`? | N/A |
| Top nav stays "RSM Consulting"? | N/A |
| Tenant scope? | ✅ Stage is `Company.stage`, scoped to that company |
| Client app barred? | ✅ Stage transitions fire server-side; UI is read-only |
| Two-app boundary respected? | ✅ Consultant sees stage on next portfolio refresh; no push, no JWT touch |

**Verdict**: ✅ Architecturally clean. Pure data + middleware change.

---

## Step 5b — AI Orchestrator Compliance Grid

| Sub-service | Required behavior | State | Evidence |
|---|---|---|---|
| **Context Builder** | Centralized data assembly w/ stable cache key | ✅ | [AIContextService.js:2151](../../../../server/services/AIContextService.js#L2151) `assembleContext()`; stable cache key via `_stableKey` at :2168 |
| **Provider layer** | Pluggable per-resource fetchers | ✅ | 6 providers wired at [:2220-2225](../../../../server/services/AIContextService.js#L2220-L2225) |
| **Prompt Builder** | Versioned, testable, no business logic embedded | ⚠️ | [aiOKRService.js](../../../../server/services/aiOKRService.js) covers cascade ops; **6 legacy AI features build prompts inline in route handlers** (F-H-03) |
| **Policy Layer** | Decides allowed ops per role/tenant before LLM call | ⚠️ | Implicit via route-level RBAC; no explicit "what AI can do per role" gate. Acceptable for Beta; flag for post |
| **LLM Gateway** | Single chokepoint for model calls | ❌ | 7 direct `require('openai')` outside the gateway (F-H-03). The cascade ops are clean; everything else bypasses |
| **Response Parser** | Schema-validated; min/max bounds; safe fallbacks | ✅ for cascade / ⚠️ for legacy | [aiOKRService.js](../../../../server/services/aiOKRService.js) parsers w/ min1/max5 (D-F-4); legacy handlers parse inline |
| **Memory Writer** | Persists outputs back to DB w/ provenance | ✅ | [AIInteractionLog.js](../../../../server/models/AIInteractionLog.js); `Company.llm_context` (D-X-3); `getContextDelta` / `updateLLMInteraction` in AIContextService |

**Summary**: Cascade ops (4 ops) are textbook 4-layer compliant. Legacy AI features (planning, ai-okr legacy, objective wizard, planner, estimator, narrative) bypass the orchestrator. **Not a Sprint 22a concern; Sprint 23 cleanup.**

---

## Step 6 — Development Rule Checklist (per epic)

### #184a Consultant Read API surface

| Question | Answer | Lives in | Layer | Correct? |
|---|---|---|---|---|
| What does the user see? | N/A (backend) | — | — | — |
| What action does the user take? | N/A | — | — | — |
| What rule decides the result? | "Is `:id` in my `managed_businesses`?" | `server/routes/consultant.js` (new) | MW | ✅ |
| What data is needed? | Company, Objective, KR, Goal, WeeklyGoal, Team, Assessment | Mongoose populate / `AIContextService.providers/*` | MW (Data Service) | ✅ |
| What data is stored? | Read-only — no writes | — | DB | ✅ N/A |
| Is intelligence needed? | No | — | AI-O | ✅ N/A |
| What prompt/context is needed? | None | — | AI-O | ✅ N/A |

### #184b client-workspace.html

| Question | Answer | Lives in | Layer | Correct? |
|---|---|---|---|---|
| What does the user see? | Tabs (Profile/Objectives/Plan/Teams/Assessments) for one client, in consultant theme | `client/pages/client-workspace.html` (new) | FE | ✅ |
| What action does the user take? | Switch tabs; URL hash updates | `client/pages/scripts/client-workspace.js` (new) | FE | ✅ |
| What rule decides the result? | Server-side `managed_businesses` membership | `consultant.js` #184a endpoints | MW | ✅ |
| What data is needed? | Per-tab #184a endpoint response | #184a endpoints | MW | ✅ |
| What data is stored? | None (read-only page) | — | DB | ✅ N/A |
| Is intelligence needed? | No (existing AI features stay where they are) | — | AI-O | ✅ N/A |
| What prompt/context is needed? | None | — | AI-O | ✅ N/A |

### #184c Retire switch-company from consultant flows

| Question | Answer | Lives in | Layer | Correct? |
|---|---|---|---|---|
| What does the user see? | No more "Viewing as" banner; consultant theme persists | `navigation.js` (delete code path for CONSULTANT) | FE | ✅ |
| What action does the user take? | Click tile → arrives at client-workspace; no theme flip | `my-clients.js` (replace navigateToClient) | FE | ✅ |
| What rule decides the result? | `req.user.managed_businesses` (server-side) | `consultant.js` #184a | MW | ✅ |
| What data is needed? | Same as today | #184a | MW | ✅ |
| What data is stored? | Nothing changes | — | DB | ✅ |
| Is intelligence needed? | No | — | AI-O | ✅ N/A |
| What prompt/context is needed? | None | — | AI-O | ✅ N/A |

### #184d Invitation flow (Mailjet)

| Question | Answer | Lives in | Layer | Correct? |
|---|---|---|---|---|
| What does the user see? | Consultant: success state in wizard. POC: invitation email → accept-invitation page | `add-client-wizard.js`, `accept-invitation.html` (new or extend) | FE | ✅ |
| What action does the user take? | Submit wizard / click email link / set password | wizard + accept page | FE | ✅ |
| What rule decides the result? | Token valid + not expired + not used; POC creates user in own tenant | `invitations.js` accept route | MW | ✅ |
| What data is needed? | Invitation, Company, User | existing models | MW | ✅ |
| What data is stored? | New User (BUSINESS_OWNER) + Invitation flagged accepted + Company.stage transition | User.js, Invitation.js, Company.js | DB | ✅ |
| Is intelligence needed? | No | — | AI-O | ✅ N/A |
| What prompt/context is needed? | None | — | AI-O | ✅ N/A |

### #184e Auto stage transitions

| Question | Answer | Lives in | Layer | Correct? |
|---|---|---|---|---|
| What does the user see? | Updated stage badge on next portfolio refresh | `my-clients.js` already renders | FE | ✅ |
| What action does the user take? | Indirect: POC accepts invitation, creates first objective | — | FE | ✅ |
| What rule decides the result? | Hooks: first POC → `prospect→onboarding`; first objective → `onboarding→objective_identified` | post-save middleware in Company.js / Objective.js | MW | ✅ |
| What data is needed? | Stage state | Company.js | MW | ✅ |
| What data is stored? | New `Company.stage_history[]` sub-doc | Company.js (extend) | DB | ✅ |
| Is intelligence needed? | No | — | AI-O | ✅ N/A |
| What prompt/context is needed? | None | — | AI-O | ✅ N/A |

**All 5 epics pass the Development Rule.** Every concern lives in the right layer.

---

## AUDIT_BRIEF section coverage

| AUDIT_BRIEF section | Coverage |
|---|---|
| A. Every JWT-swap caller | F-C-01, F-C-02, F-C-03, F-H-04, F-H-05 + LAYER_MAP §FE leaks. **3 frontend callers + 1 doc-string ref.** |
| B. Tenant scoping in models | LAYER_MAP §Backend. `User.company_id` (own), `User.current_company_id` (JWT-swap artifact, F-L-01), `User.managed_businesses[]` (the join). `Company.stage` enum at [:81](../../../../server/models/Company.js#L81); no `stage_history` yet (added in #184e). `Invitation` schema fully verified. |
| C. Every route a consultant currently hits | Tenant-native routes (objectives, goals, companies, teams, assessments) work *only because* of JWT-swap today. After #184a, consultant uses `/api/consultant/clients/:id/*` mirrors. **#184a defines the new contract; the tenant-native routes need no change.** |
| D. Mailjet readiness | F-M-07 (NEEDS-VERIFY). `sendCompanyInvitationEmail` exists ([mailjetService.js:196](../../../../server/services/mailjetService.js#L196)). Template ID is env-driven; verify before #184d scoping. |
| E. Page inventory under consultant flow | `my-clients.html`: REPOINT (#184c). `client-workspace.html`: NEW (#184b). `assessment-hub.html`: PRESERVE (mixed; role-aware rendering only). `quarterly-goals.html`: DELETE (#184c bundled). `weekly-goals.html`: phantom (already documented; delete reference). |

**Audit brief fully covered.**

---

## Sign-off

This report is the agreed audit baseline. The companion `API_CONTRACT.md` and `DATA_FLOW.md` (per AUDIT_BRIEF §2-3) are the next deliverables and become #184a's binding contract. **Until those two are signed off, #184a does not start.**

**Recommendation**: Proceed with drafting `API_CONTRACT.md` (the 6 #184a endpoints) and `DATA_FLOW.md` (3 sequence diagrams). The architectural lens applied here will hold those drafts to the same standard.
