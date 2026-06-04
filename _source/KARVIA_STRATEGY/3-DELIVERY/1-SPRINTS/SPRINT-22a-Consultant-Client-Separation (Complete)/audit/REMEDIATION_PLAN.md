# Sprint 22a — Remediation Plan

<!-- @GENOME T3-SPR-022a-REM | DRAFT | 2026-04-30 | parent:T3-SPR-022a-AUDIT | auto:- | linked:/audit-architecture -->

**Companion**: [ARCH_AUDIT_REPORT.md](ARCH_AUDIT_REPORT.md), [LAYER_MAP.md](LAYER_MAP.md), [REPLACEABILITY_MATRIX.md](REPLACEABILITY_MATRIX.md), [SCALABILITY_LADDER.md](SCALABILITY_LADDER.md)
**Date**: 2026-04-30
**Status**: DRAFT pending user sign-off

---

## Mapping: Findings → Sessions

### Sprint 22a (28 pts, 5 sessions + audit)

| Session | Epic | Pts | Closes findings | Lands in layer |
|---|---|---|---|---|
| **Audit** (this) | Pre-Sprint architectural audit | 0 | — (defines scope) | All |
| **#184a** | Consultant Read API surface | 8 | F-H-01, F-M-01, F-M-02, F-M-04 | Middleware (new routes) |
| **#184b** | `client-workspace.html` (single tabbed page) | 8 | F-H-02, F-M-06 | Frontend (new page) |
| **#184c** | Retire `switch-company` from consultant flows | 3 | F-C-01, F-C-02, F-C-03, F-H-04, F-H-05 | Frontend (3 files cleaned) |
| **#184d** | Mailjet invitation flow | 6 | F-M-07 (NEEDS-VERIFY closure) | Middleware + Frontend |
| **#184e** | Auto stage transitions + history sub-doc | 3 | (no audit findings — pure delivery) | Backend + Middleware |

**Total**: 28 pts. Closes **3 C + 4 H + 4 M = 11 findings**.

### Sprint 23 (carry-over from this audit)

| Work | Pts | Closes findings | Lands in layer |
|---|---|---|---|
| **OpenAI Gateway consolidation** | 4-6 | F-H-03 (6 direct OpenAI imports) | AI Orchestrator (LLM Gateway) |
| **Cascade fan-out cap** | 2 | F-H-06 | AI Orchestrator (Policy Layer) |
| **dashboard-summary scaling** (if F-M-04 surfaces N+1) | 2 | F-M-04 follow-up | Middleware |

**Total**: ~6-10 pts of architectural cleanup to bundle alongside Sprint 23 epics (E, H, D, G already deferred from Sprint 22).

### Backlog (post-Beta) — TRIGGER-GATED

| Work | Closes findings | Trigger | Status |
|---|---|---|---|
| ~~Move Mongoose display virtuals to a service~~ | ~~F-M-03~~ | ~~DB-swap roadmap~~ | ✅ DONE — Phase 3.1 (47/47 green) |
| ~~Deprecate `User.current_company_id`~~ | ~~F-L-01~~ | ~~No legacy admin usage~~ | ✅ DONE — #184c documented as legacy |
| **Wire Redis cache for hot reads** | **F-M-05** | **Read RPS > 100** OR specific feature requires sub-100ms cached reads | ⏸️ BACKLOG |
| **Denormalize `User.managed_businesses[]` to `ConsultantClient` join** | **F-L-02** | **Any consultant manages > 100 clients** (BSON 16MB risk) OR write-contention observed on `User` doc | ⏸️ BACKLOG |

**How to detect the triggers**:
- F-M-05: monitor `consultant.js` endpoint p95 latency + Mongo query plan cache hit rate. Threshold: sustained p95 > 500ms on `/portfolio-summary` or `/dashboard-summary` at >50 RPS.
- F-L-02: `db.users.aggregate([{$project:{n:{$size:'$managed_businesses'}}},{$sort:{n:-1}},{$limit:1}])` — alert when max `n > 100`.

**Phase 4 prep (when ready, ~6-8 hrs)**:
1. Telemetry hooks in `consultant.js` (p50/p95/payload-size logging)
2. NEW `services/CacheService.js` — in-memory today, Redis behind same interface when `FEATURE_REDIS_ENABLED=true`
3. NEW `audit/PHASE4_MIGRATION_PLAN.md` — `ConsultantClient` schema, dual-write strategy, cutover, rollback

**Until triggered, this stays out of code.** Premature implementation would mask real load signals when they arrive.

---

## Per-finding traceability

### Critical

- **F-C-01** Frontend mutates server-side tenant scope → **#184c**
  - Action: replace `KarviaCommon.ensureActiveCompany()` body with early-return for `role === 'CONSULTANT'`. Consultant data fetches read `?client=X` from URL and trust server-side membership check (#184a). Other roles keep the helper for future multi-org BO.
  - File: [client/js/common.js:637-676](../../../../client/js/common.js#L637-L676)
  - Test: grep `ensureActiveCompany` callers in CONSULTANT path → all guard with role check or are removed.

- **F-C-02** Purple "Viewing as" banner → **#184c**
  - Action: in [navigation.js renderContextBanner()](../../../../client/js/navigation.js#L406), early-return for `role === 'CONSULTANT'`. Banner code path is preserved for future BUSINESS_OWNER multi-org.
  - File: [client/js/navigation.js:406-484](../../../../client/js/navigation.js#L406-L484)
  - Test: with consultant JWT, navigate to any client-workspace URL → no banner element rendered.

- **F-C-03** `my-clients.js navigateToClient()` swaps JWT → **#184c**
  - Action: rewrite navigateToClient to a pure URL change: `window.location = 'client-workspace.html?client=' + id + '#tab=' + tab`. Drop the `PUT /switch-company` call entirely.
  - File: [client/pages/scripts/my-clients.js:30,41,578](../../../../client/pages/scripts/my-clients.js#L30)
  - Test: integration test asserts no `/api/auth/switch-company` POST is made when consultant clicks a tile.

### High

- **F-H-01** Per-client read APIs missing → **#184a**
  - Action: 6 new endpoints per `API_CONTRACT.md` (TBD): `/profile`, `/objectives`, `/goals/quarterly`, `/goals/weekly`, `/teams`, `/assessments`, `/dashboard-summary`.
  - File: [server/routes/consultant.js](../../../../server/routes/consultant.js)
  - Tests: ~30 assertions per AUDIT_BRIEF — happy path + 403 on unmanaged + tenant-isolation negative.

- **F-H-02** `client-workspace.html` doesn't exist → **#184b**
  - Action: NEW `client/pages/client-workspace.html` + `client/pages/scripts/client-workspace.js`. Tabs: Profile / Objectives / Plan / Teams / Assessments. State in URL hash. Each tab → one #184a endpoint.
  - Test: tab navigation works without page reload; URL hash drives state; back button works.

- **F-H-03** 6 direct OpenAI imports outside the gateway → **Sprint 23**
  - Action: replace each `require('openai')` with a call to `aiOKRService.callOpenAIWithRetry()` (or extract gateway into a thin module if needed).
  - Files: [routes/ai-okr.js:1677,2561](../../../../server/routes/ai-okr.js#L1677), [routes/planning.js:17](../../../../server/routes/planning.js#L17), [routes/objective-wizard.js:15](../../../../server/routes/objective-wizard.js#L15), [services/AIObjectivePlanner.js:26](../../../../server/services/AIObjectivePlanner.js#L26), [services/AIEstimator.js:7](../../../../server/services/AIEstimator.js#L7), [services/SSINarrativeService.js:17](../../../../server/services/SSINarrativeService.js#L17)
  - Test: grep `require('openai')` in `server/routes/` and `server/services/` (excluding aiOKRService.js) → returns 0 matches.

- **F-H-04** `navigation.js` company switcher → **#184c**
  - Action: extract switcher rendering into a non-CONSULTANT path; already CONSULTANT-suppressed at [:162](../../../../client/js/navigation.js#L162),[:234](../../../../client/js/navigation.js#L234) per #183b. #184c finalizes by removing the inner click handler reachability when only non-CONSULTANT roles render.
  - File: [client/js/navigation.js:344-378](../../../../client/js/navigation.js#L344-L378)

- **F-H-05** `switchToOwnCompany()` → **#184c**
  - Action: deletion bundled with the banner (only call site is the banner's "Back to My Company" button).
  - File: [client/js/navigation.js:489+](../../../../client/js/navigation.js#L489)

- **F-H-06** Cascade fan-out has no aggregate cap → **Sprint 23**
  - Action: add `MAX_CASCADE_LLM_CALLS = 25` per top-level cascade in `aiOKRService`. Track via context object passed through the chain. Surface as a Policy Layer rule.

### Medium

- **F-M-01** `portfolio-summary` no pagination → **#184a contract** (preventive)
  - Action: extend `portfolio-summary` with optional `?limit=&cursor=`. Default behavior unchanged for ≤50 clients.

- **F-M-02** `dashboard-summary` contract not drafted → **#184a contract**
  - Action: encode in `API_CONTRACT.md`: `dashboard-summary` returns one composed object; **max 5 sub-queries** server-side (Promise.all'd). Frontend MUST NOT do client-side joins.

- **F-M-03** Mongoose virtuals computing display values → **Backlog**
  - Action: when DB-swap becomes a roadmap item, move display virtuals (`size_description`, `profile_completion`, `concentration_risk`, `company_health_score`) into a `CompanyService.computeDisplay()` method.

- **F-M-04** `portfolio-summary` parallelism → **VERIFIED CLEAN 2026-04-30** (Step 0.4)
  - **Finding**: Both [`portfolio-summary`](../../../../server/routes/consultant.js#L101) and [`portfolio-kpis`](../../../../server/routes/consultant.js#L246) use `Promise.all`. Pre-step `User.findById(userId)` is a single membership lookup, not N+1.
  - **Action**: None. #184a per-client endpoints adopt the same pattern: membership lookup → `Promise.all` of resource queries → hard cap of 5 round-trips on `dashboard-summary` (already in `API_CONTRACT.md`).

- **F-M-05** No Redis cache wired → **Backlog (post-Beta)**
  - Action: enable `FEATURE_REDIS_ENABLED` after #184a's `dashboard-summary` is observed in production for 2 weeks. Cache key: `consultant:{userId}:dashboard:{clientId}`, TTL 30s.

- **F-M-06** Each tab consumes one composed endpoint → **#184b acceptance criterion**
  - Action: bake into #184b acceptance: each tab calls **exactly one** endpoint, no client-side joins, no parallel fan-out from the page.

- **F-M-07** Mailjet template config → **VERIFIED 2026-04-30** (Step 0.3)
  - **Finding**: No Mailjet `TemplateID` system in use; all templates are inline HTML built via [emailTemplates.js](../../../../server/services/emailTemplates.js). Existing [`sendCompanyInvitationEmail({..., temp_password})`](../../../../server/services/mailjetService.js#L196) is the legacy "create user up-front + email password" pattern — **cannot reuse as-is** for token-based accept flow per Diagram 1.
  - **Action (#184d)**: build NEW `sendInvitationLinkEmail()` method (token-based, no password). 6-pt scope holds; internal split shifted (1 pt method, 1 pt copy, 1 pt route wire, 1 pt accept page branch, 1 pt stage handoff, 1 pt tests).
  - **Doc cleanup (bundled with #184d)**: Add `MAILJET_API_KEY/SECRET/FROM_EMAIL/FROM_NAME` to [.env.example](../../../../.env.example) (currently only SMTP entries); reconcile `FEATURE_EMAIL_ENABLED` validation in [feature-flags.js](../../../../server/services/feature-flags.js) to check Mailjet env vars (not SMTP).

### Low

- **F-L-01** `User.current_company_id` exists because of JWT-swap → **Documentation in #184c**
  - Action: in #184c session close, add a comment block in [User.js](../../../../server/models/User.js) flagging `current_company_id` as legacy-admin-only. Schedule deprecation review post-Beta.

- **F-L-02** `User.managed_businesses[]` array unbounded → **Backlog**
  - Action: post-Beta, when any consultant manages >100 clients, denormalize to `ConsultantClient` join collection.

- **F-L-03** 16 frontend role checks (rendering only) → **Note in retro**
  - Action: catalog in `.claude/SESSION_LOG.md` retro for this audit. Rule: any new `if (role === 'CONSULTANT')` in frontend MUST be for rendering only. Business rules belong in middleware. Surface in code review.

---

## Sprint 22a session order (confirmed)

```
0. Audit (this session, no code) ──────────────────► sign-off on API_CONTRACT.md + DATA_FLOW.md
        │
        ▼
1. #184a Consultant Read API surface (8 pts) ──────► closes F-H-01, F-M-01, F-M-02, F-M-04
        │
        ▼
2. #184b client-workspace.html (8 pts) ─────────────► closes F-H-02, F-M-06
        │
        ▼
3. #184c Retire switch-company (3 pts) ─────────────► closes F-C-01, F-C-02, F-C-03, F-H-04, F-H-05, F-L-01
        │
        ▼
4. #184d Mailjet invitation flow (6 pts) ───────────► closes F-M-07
        │
        ▼
5. #184e Auto stage transitions (3 pts) ────────────► no audit findings; pure delivery
        │
        ▼
   Sprint 22a CLOSE
```

**Why this order**: #184a is the dependency for #184b (page consumes endpoints). #184c needs both #184a (replacement targets) and #184b (destination URL) before retiring callers. #184d and #184e are independent of the consultant↔client architectural separation and can run in either order.

---

## Acceptance / Done definition

Sprint 22a is **architecturally complete** when all of the following are true:

- [ ] **3 Critical findings** closed (F-C-01/02/03)
- [ ] **4 of 6 High findings** closed (F-H-01/02/04/05)
- [ ] **4 of 7 Medium findings** closed (F-M-01/02/06/07)
- [ ] Replaceability test #1 (Frontend swap) flips from ❌ to ✅
- [ ] Two-app separation check passes for all 5 epics
- [ ] Grep test: `grep -r "switch-company" client/pages/scripts/` → 0 matches in CONSULTANT path
- [ ] Grep test: every #184a endpoint asserts `req.params.id ∈ req.user.managed_businesses` server-side
- [ ] All Sprint 22 regression tests still green (Epic C Phase 3 37/37, C-Polish 40/40, Status 24/24, Cockpit 34/34)

**Ship gate**: After #184e closes and the regression suite passes, run `/audit` (NOT `/audit-architecture` — that's this session) to validate code-quality + security; then `/testing` for E2E; then `/deploy`.

---

## Sign-off

| Approver | Role | Date | Notes |
|---|---|---|---|
| User (essenceofmrs@gmail.com) | Product owner / Architect | _pending_ | Read this report + API_CONTRACT.md + DATA_FLOW.md before signing |

**Once signed**: #184a session begins with: *"Audit signed off DD/MM. Implementing exactly the contract in `API_CONTRACT.md`."* Any deviation during #184a is a contract amendment, not a silent change.
