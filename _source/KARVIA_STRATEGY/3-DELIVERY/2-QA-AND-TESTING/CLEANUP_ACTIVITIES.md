# Cleanup Activities — Surfaced During Sprint Regression

<!-- @GENOME T2-TST-003 | ACTIVE | 2026-05-12 | parent:T0-GOV-001 | auto:- | linked:/audit,/coding -->

**Created**: 2026-05-12 (Sprint 25 close, pre-Sprint 26 regression)
**Maintainer**: rolling — items added by each post-sprint regression run
**Source**: `scripts/regression/full-suite.js` reports + manual audit during 2026-05-12 end-to-end test
**Triage cadence**: review at every `/strategy` (sprint kickoff)

This document tracks code-hygiene items found during the consultant → BO → Manager → Employee handoff regression. Items are not bugs (the flow works) but legacy/drift that should be cleaned as the relevant code path is touched. Most map to known Sprint 26 work (per `EMAIL_DEEP_LINK_CONTRACT.md` §8).

---

## Conventions

| Field | Values |
|---|---|
| **Status** | `OPEN` (untouched) · `PARTIAL` (some sites cleaned, others remain) · `DONE` (closed) |
| **Severity** | `low` (cosmetic) · `med` (drift, fix when touched) · `high` (broken in some env) |
| **Owner** | Sprint that should land the fix; `S26` = next-up |

---

## Item #1 — Vestigial `temp_password` in invitation emails

**Status**: `DONE` (closed 2026-05-15 by `A20260515-04` parts P2/P3)
**Severity**: `med` (security hygiene — emails a credential the user never uses)
**Owner**: S26 (cleanup pass during dispatcher wiring) — closed alongside Manager welcome-email defect

### What the issue is

Invitation flow generates a `tempPassword` (`process.env.DEFAULT_TEMP_PASSWORD || 'Karvia2025!'`) and embeds it in the email. But the actual login mechanism is the **reset-link flow**:

1. User clicks `invitation_link` (has `?token=`)
2. Lands on `invitation-accept.html`
3. POSTs `{password, confirm_password}` to `/api/invitations/accept/:token` → server **overwrites** `password_hash` ([invitations.js:206](../../../server/routes/invitations.js#L206))
4. JWT issued; temp password discarded

The temp password is never used to authenticate. Showing it leaks an unused credential and confuses the activation UX.

### Sites cleaned (2026-05-12)

- ✅ `routes/invitations.js:1639` — `temp_password: tempPassword` arg to `mailjetService.sendCompanyInvitationEmail` — **commented**
- ✅ `services/mailjetService.js:236` — `Temporary Password: ${temp_password}` in TextPart — **commented**
- ✅ `services/mailjetService.js:294` — `credentialsBox(to_email, temp_password)` in HTML template — **commented**
- ⏸ `routes/invitations.js:1535` — `const tempPassword = …` is retained as placeholder for `password_hash` (User pre-save). Safe — random opaque value, never exposed.

### Sites cleaned (2026-05-15 — closes the remaining half)

- ✅ `services/mailjetService.js` — `sendTeamMemberWelcomeEmail` signature: `temp_password` parameter **removed** (A20260515-04 P3)
- ✅ `services/mailjetService.js` — TextPart no longer embeds `Temporary Password:` — replaced with "Click {login_link} to set your password"
- ✅ `services/mailjetService.js` — `credentialsBox(to_email, temp_password)` in `getTeamMemberWelcomeTemplate` **removed** — replaced with activation copy explaining the Get Started CTA
- ✅ `routes/invitations.js` — `/invite-team-member` no longer passes `temp_password` to `sendTeamMemberWelcomeEmail` (and the dead-on-arrival `mailjetService.sendEmail` call is gone)
- ✅ `services/mailjetService.js` — mock-mode `console.log('📧 [MOCK] Temp password: …')` line **removed** from `sendTeamMemberWelcomeEmail`
- ⏸ `routes/invitations.js`, `routes/teams.js` — `const tempPassword = crypto.randomBytes(24).toString('hex')` retained as `password_hash` seed (per A20260513-08a). Safe — random, opaque, never displayed.

### Why closed

Per `A20260515-04` parts P2 + P3 (regression: `scripts/test-sprint26-A20260515-04-manager-welcome-email.js` 28/28 ✓). The Manager welcome-email defect surfaced the remaining half of this cleanup target, so they shipped together. The cleanup recipe below documents what was actually applied — kept for traceability.

### Cleanup recipe (as applied)

1. ✅ Dropped `temp_password` from `sendTeamMemberWelcomeEmail` + `getTeamMemberWelcomeTemplate` signatures.
2. ✅ Removed `credentialsBox` call from `getTeamMemberWelcomeTemplate`; replaced with activation paragraph.
3. ✅ `tempPassword` already opaque per A20260513-08a — no change needed.
4. ✅ Deleted the mock-mode `Temp password` console.log in `sendTeamMemberWelcomeEmail`.
5. ⏸ `emailTemplates.credentialsBox` left in place — still used by other flows (audit on next cleanup pass if it becomes orphaned).

---

## Item #2 — Email deep-link URL drift (env var naming) — **CONFIRMED BROKEN ON DEV**

**Status**: `OPEN`
**Severity**: `high` (broken link delivered to real recipients)
**Owner**: S26 — explicitly tracked in `EMAIL_DEEP_LINK_CONTRACT.md` §8; escalated to high after 2026-05-12 regression evidence below

### Live evidence (2026-05-12 regression)

Reachability check from the regression run:

| URL | HTTP |
|---|---|
| `https://karvia-business-1.onrender.com/pages/invitation-accept.html` | **200** ✅ (canonical dev per contract §1) |
| `https://karvia-business-preprod.onrender.com/pages/invitation-accept.html` | **404** ❌ (stale Render hostname, no longer serves) |

The dev API's `FRONTEND_URL` env var is set to `https://karvia-business-preprod.onrender.com`. Every email sent through `/api/invitations/create` (BO→Manager, Manager→Employee in the regression — and Consultant→generic-invite) lands recipients on a 404. **The consultant→BO path is unaffected** because it uses the conformant `APP_URL` builder.

### Two distinct fixes needed

1. **Code** — collapse the URL-builder catalog onto a single `APP_URL`-only pattern per contract §1 (drop `FRONTEND_URL`, `SIGNUP_URL`, `BASE_URL` reads).
2. **Env config (Render dev)** — clear stale `FRONTEND_URL` / `SIGNUP_URL` / `BASE_URL` from the dev environment and confirm `APP_URL=https://karvia-business-1.onrender.com` is the only base-URL var present. Repeat for preprod + prod.

`EMAIL_DEEP_LINK_CONTRACT.md` §1 mandates `APP_URL` only — no `BASE_URL`, `FRONTEND_URL`, `SIGNUP_URL`, or hardcoded prod URL fallback. Drift sites:

| File:line | Code | Verdict |
|---|---|---|
| `routes/invitations.js:476` | `process.env.FRONTEND_URL \|\| 'http://localhost:3000'` | ❌ wrong env var + bad local fallback |
| `routes/invitations.js:477` | `process.env.SIGNUP_URL \|\| 'https://karvia-business.onrender.com/pages/signup.html'` | ❌❌ wrong env var + hardcoded prod URL (contract §7) |
| `routes/invitations.js:1625` | `process.env.APP_URL \|\| 'http://localhost:8080'` | ✅ matches contract |
| `routes/invitations.js:1801, 1811` | `process.env.BASE_URL \|\| 'http://localhost:5000'` | ❌ wrong env var |
| `routes/auth.js:537` | `process.env.APP_URL \|\| 'http://localhost:${process.env.PORT \|\| 5000}'` | ⚠ correct env var, fallback port differs from contract's 8080 |

### Why it matters

On Render dev, `APP_URL` is set but `FRONTEND_URL` / `SIGNUP_URL` / `BASE_URL` may not be — the fallbacks ship localhost / hardcoded-prod URLs to real recipients. The consultant→BO email (`/create-company-invitation`) uses the conformant builder; the BO→Manager / Manager→Employee path (`/create`) uses `FRONTEND_URL` and is at-risk.

### Cleanup recipe

Single-sweep: replace every URL-building expression across the catalog with the contract-mandated form:
```js
`${process.env.APP_URL}/pages/<page>.html?<params>`
```
No fallback. If `APP_URL` is unset, fail loud rather than silently linking to localhost.

---

## Item #3 — `/invite-team-member` endpoint scope mismatch

**Status**: `OPEN`
**Severity**: `low` (no broken flow, but confusing API surface)
**Owner**: S26 review

`POST /api/invitations/invite-team-member` is guarded by `requireRole('CONSULTANT')` ([invitations.js:1688](../../../server/routes/invitations.js#L1688)). Name suggests it's for managers/owners to invite team members; in reality only consultants can use it. The BO→Manager and Manager→Employee paths use `/api/invitations/create` instead.

### Options

- Rename to `/api/consultant/invite-portfolio-team-member` (intent clear)
- Or relax authorization to allow MANAGER / BUSINESS_OWNER + filter access by `company_id`

Either way, the BO+/Manager+ flows already work via `/create`, so no rush.

---

## Item #4 — Seed scripts have inter-script drift

**Status**: `OPEN`
**Severity**: `med` (idempotent re-seed fails)
**Owner**: S26 — fold into seed-hardening task

`npm run seed:assessments` chain:

1. `scripts/db/seed-assessment-questions.js` seeds ~82 questions (codes like S1, ST1, IN1…).
2. `scripts/db/seed-default-templates.js` references 47 specific question codes in its `selected_questions`. During a fresh run, `seed-default-templates.js` reports 47 codes missing (warns), self-adjusts to a smaller question set, then fails template validation with `Error: Template must have at least 10 questions total`.

The DB happens to be functional today because earlier seeds left 82 questions + 3 templates from a prior good state. But if you blow the DB away and re-seed, you'd be in a broken state.

### Cleanup recipe

- Make `seed-assessment-questions.js` produce the **exact** code-set that `seed-default-templates.js` references — keep the two in lockstep, ideally driven from a shared manifest.
- Add a post-seed sanity test that asserts: ≥1 active global template AND every selected_question is present.

---

## Item #5 — Render dev reports microservice health degraded

**Status**: `OPEN`
**Severity**: `low` (likely Render free-tier constraint, not a real outage)
**Owner**: confirm with infra; not a blocker

`GET /health` on `karvia-business-1.onrender.com` reports:

```
overallHealth: degraded
required:  assessment (port 8082) → unhealthy
           planner    (port 8083) → unhealthy
           scoring    (port 8084) → unhealthy
healthy:   iam (port 8081)
```

The main API works (auth, invitations, the chain we tested). Per CLAUDE.md "System works with all features disabled" — graceful degradation is by design. But scoring-dependent paths (assessment submission with full SSI computation) may silently fail or fall back.

### Cleanup recipe

Either:
- Stand up the missing services on Render dev (cost), OR
- Update `/health` to distinguish "service-not-deployed-in-this-env" from "service-deployed-but-down". Today's report makes every regression look red.

---

## Item #6 — Mongoose collection naming inconsistency

**Status**: `OPEN`
**Severity**: `low` (only bites probe/migration scripts that bypass Mongoose models)
**Owner**: documentation only

Mongoose models resolve to **snake_case** collections (`assessment_questions`, `assessment_templates`), not the framework default `assessmentquestions` / `assessmenttemplates`. Likely set via `collection:` option in the schema files. Hand-written DB scripts (e.g., my initial probe) that bypass models hit empty / wrong collections.

### Cleanup recipe

Add a one-paragraph note in `CLAUDE.md` under "Critical Technical Concepts" → "Multi-Tenancy" or a new "Database conventions" subsection: collection names are snake_case (set in each schema). Or — if there's no good reason — flip the schemas to use Mongoose's default plural to remove the surprise.

---

## Item #7 — Mongoose `Company.createdAt` not populating

**Status**: `OPEN`
**Severity**: `low`
**Owner**: defer

Probe of `users[rsm@karvia.ai]` returned `created: undefined`. Companies created via direct Mongoose flow get `createdAt` from timestamps; this one didn't. Suggests `timestamps: true` may not be enabled on the Company schema, or the field was suppressed.

### Cleanup recipe

Verify `Company.js` has `{ timestamps: true }` in schema options. If yes, investigate why the document is missing it.

---

## Item #8 — APP_URL fallback chains in non-dispatcher routes (audit ID `A20260513-07`) — ✅ FIXED 2026-05-13 (S26 B.6)

**Discovered**: 2026-05-13 during S26 B.6 PX-5.1 regression authoring.
**Status**: ✅ **FIXED in same B.6 commit** — user direction "no hardcodings of any urls" + "i dont think we need to hardcode anything" overrode the conservative allow-list approach. All 5 fallback chains stripped; boot-time `APP_URL` fail-fast extended from prod-only to **all envs** (dev/preprod/prod uniform).

### What the issue was

Five URL-build sites used `process.env.APP_URL || '<fallback>'` chains which contradicted [EMAIL_DEEP_LINK_CONTRACT.md §1](../../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md#1-base-url--single-env-var-no-fallbacks) ("no `||` chain") and §7 ("Hardcoded production URL as fallback" is audit-blocking). Written BEFORE the contract was authored (S25 PX-5.1 retrofitted the rules onto an existing codebase) — historical drift, not regression.

### Sites cleaned (2026-05-13)

| File:line | Before | After |
|---|---|---|
| `server/routes/auth.js:537` | `process.env.APP_URL \|\| `http://localhost:${process.env.PORT \|\| 5000}`` | `process.env.APP_URL` |
| `server/routes/tasks.js:152` | `process.env.APP_URL \|\| 'https://karvia-business.onrender.com'` | `process.env.APP_URL` |
| `server/routes/tasks.js:316` | same | `process.env.APP_URL` |
| `server/routes/teams.js:899` | `process.env.APP_URL \|\| 'http://localhost:8080'` (inline in URL build) | `process.env.APP_URL` |
| `server/jobs/dailyDigestJob.js:85` | `process.env.APP_URL \|\| 'https://karvia-business.onrender.com'` | `process.env.APP_URL` |

### Safety net extended (same commit)

[server/config/index.js:290-302](../../../server/config/index.js#L290) — boot-time `APP_URL` validation extended from prod-only to **all environments**. Server refuses to boot without `APP_URL` set, with an error message that cites EMAIL_DEEP_LINK_CONTRACT §1 + tells the developer the exact value to set:

```
APP_URL is required (EMAIL_DEEP_LINK_CONTRACT §1 — sole base URL for
email/share links). Set APP_URL in your .env: e.g. APP_URL=http://localhost:5000
for local development.
```

### Required developer action

Each developer must set `APP_URL` in their local `.env`:
- **Local**:  `APP_URL=http://localhost:5000` (or actual `PORT` value)
- **Preprod** (Render): `APP_URL=https://karvia-business-2.onrender.com`
- **Prod** (Render): `APP_URL=https://karvia-business.onrender.com`

(The Render values for prod + preprod were already set as part of A20260512-13 hotfix on 2026-05-12; only local dev .env files may need a manual add.)

---

## Triage suggestions for Sprint 26

When Sprint 26 starts (`/strategy`), this doc should be re-read and items folded into Workstream B implementation:

- **Item #1** + **Item #2** + **Item #8** are directly in scope of Workstream B dispatcher implementations — clean as each dispatcher is wired.
- **Item #3**, **Item #4**, **Item #6**, **Item #7** are below the line — capture in `REFINEMENT_BACKLOG.md` for trigger-gated work.
- **Item #5** is a separate infra discussion.

---

## Bibliography

- [`EMAIL_DEEP_LINK_CONTRACT.md`](../../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) — §1, §7, §8 (contract this regression validates against)
- [`SPRINT26_MASTER_PLAN.md`](../1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md) — Workstream B (dispatcher wiring)
- `scripts/regression/full-suite.js` — the regression that surfaces these items
- `REGRESSION_REPORTS/regression-*.md` — per-run reports
