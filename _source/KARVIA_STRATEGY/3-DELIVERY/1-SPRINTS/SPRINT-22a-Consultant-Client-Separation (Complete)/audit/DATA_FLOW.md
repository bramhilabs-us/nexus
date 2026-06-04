# Sprint 22a — Data Flow Diagrams

<!-- @GENOME T3-SPR-022a-FLOW | DRAFT | 2026-04-30 | parent:T3-SPR-022a-AUDIT | auto:- | linked:/audit-architecture,/coding -->

**Status**: DRAFT pending sign-off
**Companion**: [API_CONTRACT.md](API_CONTRACT.md), [ARCH_AUDIT_REPORT.md](ARCH_AUDIT_REPORT.md)

Three sequence diagrams. Each diagram is canonical for the flow it describes; any deviation during implementation is a documented amendment.

**Notation**:
- 🔵 = Consultant App (RSM Consulting JWT)
- 🟢 = Client App (BUSINESS_OWNER tenant JWT)
- ⚪ = Public (no JWT yet)
- 🟡 = AI Orchestrator
- 📦 = Database write
- 📤 = External (Mailjet)

---

## Diagram 1 — Add Client → Invitation → POC Account Creation

**Trigger**: Consultant clicks "Add Client" on `my-clients.html`, completes 2-step wizard.

```mermaid
sequenceDiagram
    autonumber
    participant C as 🔵 Consultant<br/>(my-clients.html)
    participant W as 🔵 Add Client Wizard<br/>(add-client-wizard.js)
    participant API as Middleware<br/>(consultant.js)
    participant AIO as 🟡 AI Orchestrator<br/>(aiOKRService)
    participant DB as Backend<br/>(MongoDB)
    participant MJ as 📤 Mailjet
    participant POC as ⚪ Client POC<br/>(email inbox)
    participant ACC as ⚪ accept-invitation.html
    participant CA as 🟢 Client App<br/>(login)

    C->>W: Open wizard
    W->>API: POST /clients/enrich {name, website}
    API->>AIO: enrichCompany(name, website)
    AIO->>AIO: Build prompt + call LLM<br/>(24h cache, 3s timeout)
    AIO-->>API: {industry, vertical, signals,<br/>suggested_template, contacts[], confidence}
    API-->>W: 200 enrichment data

    W->>W: Step 2 review/edit (consultant overrides anything)
    W->>API: POST /clients {company, primary_contact, stage='prospect'}
    API->>DB: 📦 Step A: Company.create()<br/>w/ ai_enrichment_used, ai_confidence
    API->>DB: 📦 Step B: User.findByIdAndUpdate<br/>$push managed_businesses
    API->>DB: 📦 Step C: Team.create({company_id, name:'Default', manager_id:userId})
    Note over API,DB: 3-step transaction<br/>(session-based, manual rollback fallback)
    API->>DB: 📦 Step D: Invitation.create({<br/>company_id, recipient_email,<br/>invitation_type:'company',<br/>invitation_token: uuid,<br/>expires_at: now+14d<br/>})
    API->>MJ: sendCompanyInvitationEmail({<br/>to_email, to_name, consultant_name,<br/>company_name, invitation_link,<br/>template_id: env.MJ_INVITE_TEMPLATE_ID<br/>})
    MJ-->>API: 200 Sent ✓
    API-->>W: 201 {company, invitation_id, mail_sent:true}
    W->>C: Toast: "Invitation sent to {POC email}"

    Note over POC: ⏰ Email arrives

    POC->>ACC: Click invitation link<br/>?token=<uuid>
    ACC->>API: GET /api/invitations/validate/:token
    API->>DB: Invitation.findOne({invitation_token})
    API-->>ACC: {valid:true, recipient_email,<br/>company_name, expires_at,<br/>invitation_type:'company'}
    ACC->>POC: Render: name, email pre-filled, password fields

    POC->>ACC: Submit {first_name, last_name, password}
    ACC->>API: POST /api/invitations/accept/:token<br/>(public, rate-limited)
    API->>DB: Invitation.findOne (re-validate)
    API->>DB: 📦 User.create({<br/>email: invitation.recipient_email,<br/>password_hash,<br/>company_id: invitation.company_id,<br/>role: 'BUSINESS_OWNER',<br/>status: 'active'<br/>})
    API->>DB: 📦 Invitation.update({used_at: now,<br/>user_created: true,<br/>recipient_user_id: newUser._id})
    API->>DB: 📦 Company.findByIdAndUpdate<br/>{stage: 'onboarding',<br/>$push stage_history:{<br/>from:'prospect', to:'onboarding',<br/>actor:'system:invitation_accepted',<br/>at: now}}
    Note right of DB: Stage transition (#184e)<br/>fires here, not at invitation send
    API-->>ACC: 200 {success:true, user_id, redirect:'/login'}
    ACC->>POC: "Account created. Redirecting..."

    POC->>CA: Login w/ recipient_email + password
    CA->>API: POST /api/auth/login
    API->>DB: User.findOne({email}) + verify password
    API-->>CA: {token: jwt(role:'BUSINESS_OWNER', company_id:X)}
    Note over CA: 🟢 POC now in OWN tenant<br/>NO consultant context
    CA->>POC: Redirect to dashboard.html<br/>(client app, client theme)
```

**Key invariants**:
- ✅ Consultant never sees POC's password or holds POC's JWT
- ✅ POC's JWT is `company_id = clientCompany`, not `RSM Consulting`
- ✅ Stage transition `prospect → onboarding` fires at invitation **acceptance**, not at invitation send
- ✅ The 3-step Company/managed_businesses/Team transaction (steps 7-9) is the existing #181 pattern; #184d adds steps 10-11 (Invitation + Mailjet)
- ✅ POC accept route is **public** (no JWT) — correct, POC has no account yet

**Files touched (#184d)**:
- [server/routes/consultant.js](../../../../server/routes/consultant.js) — `POST /clients` extends current flow with steps 10-11
- [server/routes/invitations.js:105](../../../../server/routes/invitations.js#L105) — `POST /accept/:token` extends with stage transition (handoff to #184e for the actual transition logic)
- [server/services/mailjetService.js:196](../../../../server/services/mailjetService.js#L196) — `sendCompanyInvitationEmail` already exists (NEEDS-VERIFY F-M-07: confirm template ID env var)
- [client/pages/scripts/add-client-wizard.js](../../../../client/pages/scripts/add-client-wizard.js) — wizard already wired (Sprint 22 #181); only success copy changes
- [client/pages/invitation-accept.html](../../../../client/pages/invitation-accept.html) (or NEW `accept-invitation.html`) — POC entry point

---

## Diagram 2 — Consultant Views Client Objectives (post Sprint 22a)

**Trigger**: Consultant clicks the Objectives box on a client tile in `my-clients.html`.

```mermaid
sequenceDiagram
    autonumber
    participant C as 🔵 Consultant<br/>(my-clients.html)
    participant W as 🔵 client-workspace.html<br/>(NEW #184b)
    participant API as Middleware<br/>(consultant.js)
    participant DB as Backend<br/>(MongoDB)

    C->>C: Click Objectives box on tile X
    Note over C: 🔵 my-clients.js navigateToClient(X, 'objectives')
    Note over C: ❌ NO PUT /switch-company<br/>❌ NO JWT mutation
    C->>W: window.location =<br/>'client-workspace.html?client=X#tab=objectives'

    Note over W: Page loads<br/>JWT unchanged (still RSM Consulting)<br/>Top nav still shows "RSM Consulting"<br/>NO purple "Viewing as" banner

    W->>W: Parse URL: clientId=X, tab='objectives'
    W->>W: Render shell (tabs, consultant theme)<br/>active tab = Objectives
    W->>API: GET /api/consultant/clients/X/objectives<br/>Authorization: Bearer <consultantJWT>

    API->>API: requireRole('CONSULTANT') ✓
    API->>DB: User.findById(req.user._id)<br/>.select('managed_businesses')
    DB-->>API: {managed_businesses: [..., X, ...]}
    API->>API: assert X ∈ managed_businesses ✓
    Note right of API: ❌ if not, 403<br/>{error:'Not in your portfolio'}

    par Promise.all (DB round-trips ≤ 2)
        API->>DB: Objective.find({company_id: X})<br/>.sort({target_year:-1})<br/>uses index {company_id:1, target_year:1}
        DB-->>API: objectives[]
    and
        API->>DB: KeyResult.aggregate([<br/>{$match: company_id:X},<br/>{$group: by objective_id,<br/>rollup: total/onTrack/atRisk/behind}<br/>])
        DB-->>API: kr_rollups[]
    end

    API->>API: Compose objectives w/ kr_rollup
    API-->>W: 200 {data:[...], pageInfo:{...}}

    W->>W: Render objectives list in Objectives tab<br/>(consultant theme, no client theme bleed)
    W->>C: Display

    Note over C,DB: ✅ Two-app boundary respected<br/>✅ Consultant JWT never mutated<br/>✅ Tenant scope enforced server-side<br/>✅ Single composed endpoint per tab (F-M-06)
```

**Key invariants**:
- ✅ `?client=X` is a **hint**; the server is the source of truth via `managed_businesses` membership
- ✅ Top nav DOM doesn't change (no theme flip, no `renderContextBanner`)
- ✅ Tab switch within `client-workspace.html` updates URL hash + makes ONE call to the corresponding `/api/consultant/clients/X/<tab>` endpoint
- ✅ Back-button works (URL hash drives state)
- ✅ Bookmarking `client-workspace.html?client=X#tab=objectives` reloads cleanly (server re-asserts membership)

**What this kills**:
- ❌ `KarviaCommon.ensureActiveCompany(X)` (F-C-01) — never invoked from consultant pages
- ❌ `PUT /api/auth/switch-company` from consultant frontend (F-C-03) — `navigateToClient` no longer calls it
- ❌ Purple "Viewing as: Client Company" banner (F-C-02) — `renderContextBanner` early-returns for CONSULTANT
- ❌ "Back to My Company" button (F-H-05) — no banner = no button

---

## Diagram 3 — Stage Auto-Transition on POC First Login + First Objective

**Trigger**: POC creates first objective in their workspace.

```mermaid
sequenceDiagram
    autonumber
    participant POC as 🟢 POC<br/>(BUSINESS_OWNER, dashboard)
    participant API as Middleware<br/>(objectives.js)
    participant DB as Backend<br/>(MongoDB)
    participant CSV as 🔵 Consultant<br/>(my-clients.html, async)

    Note over POC: First time logging in<br/>Company.stage = 'onboarding'<br/>(set at invitation accept, Diagram 1)

    POC->>POC: Navigate to objectives.html
    POC->>API: POST /api/objectives {title, target_year, ...}
    API->>API: authenticateToken ✓<br/>tenant scope: req.user.company_id=X
    API->>DB: 📦 Objective.create({company_id:X, ...})
    DB-->>API: newObjective

    Note over API,DB: Post-save hook (#184e):<br/>fires on Objective.create

    API->>DB: Objective.countDocuments({company_id:X})
    DB-->>API: count = 1 (this is the first one)
    API->>DB: Company.findById(X).select('stage stage_history')
    DB-->>API: {stage: 'onboarding', stage_history: [...]}
    API->>API: Decide transition:<br/>onboarding + first objective<br/>→ 'objective_identified'
    API->>DB: 📦 Company.findByIdAndUpdate(X, {<br/>stage: 'objective_identified',<br/>$push stage_history: {<br/>from: 'onboarding',<br/>to: 'objective_identified',<br/>actor: 'system:first_objective_created',<br/>at: now,<br/>triggered_by_id: newObjective._id<br/>}<br/>})
    Note right of DB: Idempotent: if stage was<br/>already 'objective_identified' or later,<br/>skip transition (no double-fire)

    API-->>POC: 201 {objective: newObjective}
    POC->>POC: See objective in own workspace

    Note over CSV: ⏰ Some time later

    CSV->>CSV: Refresh my-clients.html
    CSV->>API: GET /api/consultant/portfolio-summary
    API->>DB: Read managed companies (incl. X)
    DB-->>API: companies[] (X.stage now 'objective_identified')
    API-->>CSV: 200 portfolio data
    CSV->>CSV: Render tile X w/ stage badge<br/>= 'objective_identified'
    Note over CSV: ✅ Consultant sees the<br/>transition without any push,<br/>just polled view
```

**Stage transition rules (#184e)**:

| Trigger | From → To | Actor | Idempotent? |
|---|---|---|---|
| Company doc created via `POST /api/consultant/clients` | (none) → `prospect` | `consultant:<userId>` | Yes (default value, schema-level) |
| `POST /api/invitations/accept/:token` (first POC user created for company) | `prospect` → `onboarding` | `system:invitation_accepted` | Yes (idempotent guard: `if stage === 'prospect'`) |
| First Objective.create for `company_id` | `onboarding` → `objective_identified` | `system:first_objective_created` | Yes (count-based guard) |
| First Assessment completes | (no stage flip) | `system:first_assessment_completed` | Yes (history entry only, no flip) |
| Manual edit via `Edit` modal | any → any allowed by enum | `consultant:<userId>` | N/A — explicit user action |

**Implementation note (#184e)**:
- Hook lives in route handler, not Mongoose post-save middleware. Reason: post-save hooks fire on *every* save (including bulk imports), making "is this the first?" detection brittle. Explicit calls in route handlers (`objectives.js POST`, `invitations.js POST /accept`) are cheaper and more auditable.
- New schema: `Company.stage_history: [{from, to, actor, at, triggered_by_id}]` — append-only.
- Backfill policy: **NONE**. Existing companies stay at current stage; history starts at the next transition.

**Key invariants**:
- ✅ Stage transitions are server-side; consultant cannot push them
- ✅ History entries include `triggered_by_id` so the audit trail is causal
- ✅ Idempotency guards prevent double-firing on retries
- ✅ Consultant sees updates via polled `portfolio-summary`, no WebSocket required

---

## Cross-cutting: What never happens after Sprint 22a

| Anti-pattern | Why it can't happen |
|---|---|
| Consultant frontend calls `PUT /api/auth/switch-company` | Grep-asserted absent in #184c integration test |
| Consultant JWT contains a client tenant's `company_id` | `switch-company` is unreachable from consultant frontend; route stays alive only for legacy admin |
| Frontend renders raw Mongoose docs | All renders go through endpoints with explicit projections |
| Consultant writes to client tenant's data | `/api/consultant/clients/:id/*` endpoints are read-only by spec |
| Stage transitions fire retroactively on legacy data | Backfill policy = none; first transition starts the history |
| AI prompts reference the wrong tenant's context | Provider cache key includes `company_id`; cross-tenant key collision impossible |
| Two consultants stomp on a shared client's `managed_businesses` | `$pull`/`$push` are atomic per-consultant operations |

---

## Sign-off

After this and `API_CONTRACT.md` are signed off, #184a starts. The integration tests for #184a, #184b, #184c, #184d, #184e map directly to the invariants above:

- **Diagram 2 invariants** → #184a tests (membership guard, single-endpoint-per-tab) + #184c tests (no `switch-company` call from consultant pages)
- **Diagram 1 invariants** → #184d tests (Mailjet sent, public accept route, separate JWTs)
- **Diagram 3 invariants** → #184e tests (idempotent transitions, history entries, backfill = none)

**Status**: DRAFT — awaiting sign-off
