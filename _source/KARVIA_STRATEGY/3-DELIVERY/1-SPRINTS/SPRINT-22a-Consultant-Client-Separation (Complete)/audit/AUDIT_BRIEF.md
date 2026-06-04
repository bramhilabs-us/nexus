# Sprint 22a — Pre-Sprint Audit Brief

<!-- @GENOME T3-SPR-022a-AUDIT | DRAFT | 2026-04-30 | parent:T3-SPR-022a | auto:/audit | linked:- -->

**Session type**: Audit (no code)
**Token budget**: ~50K
**Output**: 4 markdown artifacts in this folder

---

## Why this audit

Before Sprint 22a touches a single line of code, we need to be certain about:

1. **Every place** the consultant frontend assumes JWT-swap into a client tenant
2. **Every model field** that participates in tenant scoping (User, Company, Invitation)
3. **Every route** that a Sprint 22a consumer (client-workspace.html) will need
4. **Every Mailjet config** that the invitation flow depends on

Sessions #183a / #183b mitigated symptoms; this audit catches root causes. Skipping the audit means re-visiting decisions in #184b/c when it's expensive to back out.

---

## Required Output Artifacts

### 1. `AUDIT_REPORT.md` — exhaustive findings

Section A: **Every JWT-swap caller**
- Grep `switch-company` across `client/`. List every file:line.
- For each, classify: (i) consumer that must retire (#184c target), (ii) admin/legacy that stays, (iii) helper that needs deprecation guard.
- Find every place `req.user.company_id` is read in a route that a CONSULTANT might hit. Quote line + classify: (i) must accept `?client=X` override, (ii) is fine because it's `/api/consultant/*`, (iii) is fine because consultants don't hit it.

Section B: **Tenant scoping in models**
- `User.company_id` vs. `User.current_company_id` vs. `User.managed_businesses` — what writes each? When?
- `Company.stage` enum + every place stage transitions today (manual edit, route handler, default at creation)
- `Invitation` model — full schema, every field, every TTL/expiry rule

Section C: **Every route a consultant currently hits**
- For `/api/objectives`, `/api/goals/*`, `/api/companies/:id`, `/api/teams/*`, `/api/assessments/*`, `/api/dashboard/*` (or whatever exists)
- For each: who's the JWT scope today (consultant own / consultant swapped to client / direct id check)?
- Which of these need a consultant-scoped read mirror in #184a?

Section D: **Mailjet readiness**
- Find existing Mailjet config (`server/services/email*` or similar)
- Verify template IDs exist for: welcome email, invitation, password reset
- If invitation template doesn't exist, flag — #184d adds 1 pt for template authoring

Section E: **Page inventory under consultant flow**
- `my-clients.html`, `client-workspace.html` (will be created), `assessment-hub.html` — current state per page
- Mark: REPOINT (consultant flow only), PRESERVE (other roles use it), DELETE (orphaned), REWRITE (broken)

### 2. `API_CONTRACT.md` — full request/response shapes

For EACH of the 6 new endpoints in #184a, document:

```
GET /api/consultant/clients/:id/profile
  Auth: requireRole('CONSULTANT') + id ∈ managed_businesses
  Path params: id (Mongo ObjectId)
  Query params: none
  Response 200:
    { success: true, data: { ... full Company doc + computed fields ... } }
  Response 403: { success: false, error: 'Not in your portfolio' }
  Response 404: { success: false, error: 'Client not found' }
```

Use real field names from existing models. Don't invent shapes — reuse the existing `portfolio-summary` response shape where applicable.

### 3. `DATA_FLOW.md` — sequence diagrams

Three sequence diagrams (use Mermaid or ASCII):

1. **Add Client → Invitation → POC Account Creation**
   - Consultant (RSM) → wizard submit → POST /clients
   - Server: create Company, push managed_businesses, create Team, create Invitation, send Mailjet email
   - POC clicks email link → GET /api/invitations/validate/:token (public)
   - POC submits accept-form → POST /api/invitations/accept/:token (public)
   - Server: create User w/ role BUSINESS_OWNER + company_id=client + link to Invitation; transition Company.stage prospect→onboarding
   - POC redirected to login; logs in to **their** workspace (separate JWT)

2. **Consultant views client objectives (post Sprint 22a)**
   - Consultant clicks Objectives box on tile
   - Browser: navigate to client-workspace.html?client=X#tab=objectives
   - Page loads: top nav still shows "RSM Consulting"
   - JS: GET /api/consultant/clients/X/objectives
   - Server: validate X ∈ req.user.managed_businesses; query Objectives by company_id=X
   - Render in consultant theme; **no JWT swap, no banner, no theme flip**

3. **Stage auto-transition on POC login**
   - POC accepts invitation, account created, Company.stage flipped at acceptance time
   - When POC logs in for first time → no stage change (already onboarding)
   - When POC creates first Objective → stage_history adds entry; stage flips onboarding → objective_identified
   - Consultant's portfolio-summary picks this up on next refresh (no push, just polled)

### 4. `IMPACT_ON_SPRINT22_EPICS.md` — verify the carry-over plan

Re-validate the impact analysis already drafted in `SPRINT22a_MASTER_PLAN.md` (Section "Sprint 22 Carry-Over Impact"):

For each of Epic E / H / D / G — read the epic spec **directly** (not via summary), confirm:
- Whether it assumes JWT-swap
- Whether it touches a page in the consultant flow
- Whether the deferral / split / no-conflict disposition is correct

If anything in the master plan's table is wrong, write the correction here. This document overrides the master plan if there's a conflict.

---

## Audit Method

1. Use `Explore` agent for breadth (greps, file lists, route listings)
2. Use `Read` for depth on the critical files (`auth.js`, `consultant.js`, `companies.js`, `User.js`, `Company.js`, `Invitation.js`, `navigation.js`)
3. Cite **every** finding with `file:line` — no claims without citations
4. Where the audit can't determine something (e.g., Mailjet template existence requires a runtime check), flag explicitly with **NEEDS-VERIFY**

---

## Exit Criteria

User reads `API_CONTRACT.md` and `DATA_FLOW.md` and signs off (or requests revisions). Once signed off:

- #184a session begins with: "Audit signed off DD/MM. Implementing exactly the contract in `API_CONTRACT.md`."
- Any deviation from the contract during #184a becomes a contract amendment, not a silent change.

---

**Status**: DRAFT — populated by next session
