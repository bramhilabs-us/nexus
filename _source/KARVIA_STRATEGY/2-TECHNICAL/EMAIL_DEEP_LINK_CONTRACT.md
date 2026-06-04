# Email Deep-Link Contract

<!-- @GENOME T2-ARC-022 | ACTIVE | 2026-05-12 | parent:T0-GOV-001 | auto:/coding,/strategy | linked:/audit -->

**Version**: 1.0
**Created**: 2026-05-12 (Sprint 25 PX-5.1)
**Audit ref**: `A20260506-03` — Cross-sprint audit S24-S27, [Group 2b](../3-DELIVERY/1-SPRINTS/AUDIT_S24_S27_FINDINGS.md)
**Purpose**: Lock the URL shape, redirect targets, and token semantics for every cross-sprint email deep-link, binding S26 send-side ([Workstream B](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md)) to S27 receive-side.

---

## Scope

Governs every URL that appears as a clickable CTA in an email sent through [`mailjetService`](../../server/services/mailjetService.js) or the inline `notifyTransition()` helper (Sprint 25 PX-2.2). Does **not** govern in-app navigation, Mailjet click-tracking wrappers, or unsubscribe footers.

---

## 1. Base URL — single env var, no fallbacks

| Rule | Value |
|---|---|
| **Env var** | `APP_URL` (only) |
| **Dev** | `https://karvia-business-1.onrender.com` |
| **Preprod** | `https://karvia-business-2.onrender.com` |
| **Prod** | `https://karvia-business.onrender.com` |
| **Local** | `http://localhost:8080` |

Reject all of: `BASE_URL`, `FRONTEND_URL`, `SIGNUP_URL`, hardcoded production URL as a fallback (`process.env.X || 'https://karvia-business.onrender.com'`). Drift across these names is what caused cross-env link bleed surfaced in [`JOURNEY_GAP_REPORT_2026-05-08.md`](../3-DELIVERY/2-QA-AND-TESTING/JOURNEY_GAP_REPORT_2026-05-08.md). Build URLs as `${process.env.APP_URL}/pages/<page>.html?<params>` — no `||` chain.

---

## 2. Path — `/pages/<page>.html` only

No client-side routing. Direct HTML pages are the deep-link targets. New pages added by S26/27 must follow this convention.

---

## 3. Query-Parameter Grammar (canonical names)

| Param | Type | Carries | Notes |
|---|---|---|---|
| `client` | ObjectId (24 hex) | Target `company_id` for consultant cross-tenant view | Canonical name. Legacy `?company=` / `?company_id=` aliases are **read-only** (consultant-page-mode.js header). New email links MUST use `client`. |
| `from` | `workspace` \| `email` | Source-of-arrival for back-button + breadcrumb routing | Consultant banner renders different back-target by value. |
| `source` | `email` \| `anonymous` \| (unset) | UX hint to receiving page (e.g. render `<NextStep>` CTA) | Distinguishes email click vs in-app click. |
| `tab` | per-page enum | Initial tab on multi-tab pages | For in-page tab routers, use fragment `#tab=<value>` instead (existing [client-workspace.js](../../client/pages/scripts/client-workspace.js) convention). |
| `objective` | ObjectId | Objective to focus on landing | Dispatcher 4 / 5. |
| `kr` | ObjectId | KeyResult to focus on landing | Dispatcher 4. |
| `token` | base64url, ≥32 bytes | Short-lived signed token | See §5. |

Every value MUST pass through `encodeURIComponent()` on the send side. No raw ObjectIds, names, or emails in the URL.

---

## 4. The Five Dispatcher Deep-Links (S26 + S27)

Five handoffs wired in [S26 Workstream B](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md) (sends 1-3 + 4-send) and [S27](../3-DELIVERY/1-SPRINTS/SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md) (4-receive + 5). Each row binds a send-side URL to a receive-side handler.

| # | Trigger | Recipient | URL | Token type | Receive-side handler |
|---|---|---|---|---|---|
| **1** | Profile complete | BO | `${APP_URL}/pages/company-profile.html?source=email` | Auth-required | `<NextStep>` exit CTA on `company-profile.html` |
| **2** | Assessment invitation reminder | Mgr/Emp/Exec | `${APP_URL}/pages/assessment-take.html?invitation_token=<invitation_token>` | Invitation | Existing flow (unchanged by S26/27) |
| **3a** | Assessment-aggregate threshold met | BO + team | `${APP_URL}/pages/team-ssi-view.html?source=email` | Auth-required | `<NextStep>` reads `source=email` + persona → "Generate Objectives" (BO) / "View Results" (team) |
| **3b** | (same trigger) | Consultant | `${APP_URL}/pages/team-ssi-view.html?client=<company_id>&from=email&source=email` | Auth-required | Same handler; consultant branch via `?client=` (consultant-page-mode.js) |
| **4a** | Objective created | Manager (owner) | `${APP_URL}/pages/objectives.html?focus=<id>&source=email` | Auth-required | Sprint 27 E.8 / A20260528-04 — objectives.html is sole KR-creation surface; Manager arrives there for E.4 card state-CTAs ("Generate KRs" → wizard add_krs mode per E.1c). Destination changed from `planning-v2.html?objective_id=` at /strategy-mini 2026-05-28 lock. |
| **4b** | (same trigger) | Consultant | `${APP_URL}/pages/client-workspace.html?client=<company_id>&from=email&objective=<id>#tab=objectives` | Auth-required | S27 wires CTA inside workspace `#tab=objectives` |
| **5a** | All KRs at 100% (KR-aggregation cron) | Consultant | `${APP_URL}/pages/client-workspace.html?client=<company_id>&from=email&objective=<id>#tab=objectives` | Auth-required | S27 wires "Mark Sustained" CTA |
| **5b** | (same trigger) | BO | `${APP_URL}/pages/objectives.html?objective=<id>&source=email` | Auth-required | S27 wires confirmation surface |

(Dispatchers 1-3 land in S26 in full; 4 send-side in S26 / receive-side in S27; 5 entirely in S27 — per S26 plan.)

---

## 5. Token Semantics — three modes, no fourth

| Mode | Where | TTL | Single-use? | Server-side store | Used by |
|---|---|---|---|---|---|
| **Invitation token** | `?token=<...>` on `/pages/invitation-accept.html`, `/pages/signup.html`; `?invitation_token=<...>` on `/pages/assessment-take.html` | Per `Invitation.expires_at` (7-14 days) | Yes — consumed on accept | `Invitation.invitation_token` | New users (no JWT yet) |
| **Share token** | `?token=<...>` on `/pages/ssi-report-public.html` and similar public views | Configurable per share (default 30 days) | No — re-readable until expiry | `DiagnosticReport.share_token` (and analogues) | Anonymous viewers |
| **Auth-required** | (no `?token=`) — JWT in `localStorage['karvia_token']` | JWT TTL | N/A | `localStorage` | Existing users; `auth-check.js` handles redirect to `/pages/login.html?return=<encoded URL>` |

**Hard rule**: an email deep-link either carries `?token=<...>` (invitation or share) **OR** points at an auth-required page. Never both. Never a third mode (no fragment tokens, no signed-URL HMAC params at this version).

**Login-return contract**: auth-required pages MUST be reachable after a login bounce. `auth-check.js` is the sole component that reads/writes the `?return=` param; receiving pages MUST NOT special-case unauthenticated state themselves.

---

## 6. Receive-Side Contract (`<NextStep>` slot)

Every receiving page (dispatcher 1, 3, 4, 5) MUST:

1. **Read query params on init** before rendering primary content.
2. **If `source=email`**, render the dispatcher-specific CTA inside the `<NextStep>` slot of the page. CTA text + target route are owned by the receiving page, not by this contract.
3. **Pass auth check first** — `auth-check.js` runs before page-script init; if no JWT, redirect to `/pages/login.html?return=<full current URL>` and resume after login.
4. **Persona-aware rendering** (dispatcher 3 + 4) uses `user.role` from `karvia_user` localStorage blob; see [Group 4a](../3-DELIVERY/1-SPRINTS/AUDIT_S24_S27_FINDINGS.md) for the persona-conditional one-liner rule.
5. **Leave URL params intact** after first read (no rewriting `history.replaceState`) — keeps the link bookmarkable and the source attribution visible to analytics.

---

## 7. Anti-Patterns (audit-blocking — fail review)

- ❌ Hardcoded production URL as fallback (`process.env.X || 'https://karvia-business.onrender.com'`)
- ❌ More than one env var for the base URL (`BASE_URL`, `FRONTEND_URL`, `SIGNUP_URL` in addition to `APP_URL`)
- ❌ Tokens in URL fragment (`#token=...`) — fragments aren't sent to the server, can't be logged or audited
- ❌ Two tokenizing mechanisms on the same page (invitation + share + auth — pick one)
- ❌ New email links using legacy param names (`?company=`, `?company_id=`, `?clientId=`) — those are read-only legacy aliases; canonical name is `?client=`
- ❌ Unencoded values in query params — always `encodeURIComponent`
- ❌ Receiving page reading `?token=` for auth purposes (only the three modes in §5 are valid token uses)

---

## 8. Migration / Compatibility

- Existing `?company=<id>` / `?company_id=<id>` are LEGACY aliases — `consultant-page-mode.js` reads them; emails MUST NOT write them.
- Existing `mailjetService.sendCompanyInvitationEmail({ ..., invitation_link })` already accepts the link as a parameter — callers must build it per this contract, not via local string-concat.
- Send-side base-URL drift across `server/routes/{invitations,consultant,auth,teams}.js` + `server/jobs/dailyDigestJob.js` + `server/routes/tasks.js` + `server/routes/diagnostic-reports.js` will be normalized when each dispatcher is implemented in S26/S27. Single-sweep refactor is **not** in scope here — implementers normalize as they touch each call site.

---

## 9. Bibliography

- [`AUDIT_S24_S27_FINDINGS.md`](../3-DELIVERY/1-SPRINTS/AUDIT_S24_S27_FINDINGS.md) — Group 2b, audit ID `A20260506-03`
- [`SPRINT26_MASTER_PLAN.md`](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md) — Workstream B dispatcher table (lines 70-90)
- [`SPRINT27_MASTER_PLAN.md`](../3-DELIVERY/1-SPRINTS/SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md) — Execution-half dispatchers
- [`JOURNEY_GAP_REPORT_2026-05-08.md`](../3-DELIVERY/2-QA-AND-TESTING/JOURNEY_GAP_REPORT_2026-05-08.md) — Cross-env link bleed (existing-covered)
- [`mailjetService.js`](../../server/services/mailjetService.js), [`emailTemplates.js`](../../server/services/emailTemplates.js)
- [`consultant-page-mode.js`](../../client/js/consultant-page-mode.js), [`client-workspace.js`](../../client/pages/scripts/client-workspace.js)
