# Inventory — Epic C: My Clients Page + Add Client Wizard

<!-- @GENOME T3-SPR-022-PW-IC | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_C_MY_CLIENTS.md](../epics/EPIC_C_MY_CLIENTS.md)
**Points**: 21

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| My Clients page HTML | 🆕 new | none | CREATE `client/pages/my-clients.html` |
| My Clients page JS | 🆕 new | none | CREATE `client/pages/scripts/my-clients.js` |
| My Clients page CSS | ⚠️ conflict | `client/css/s13-patterns.css` already holds `--s22-*` tokens | DECIDE: extend `s13-patterns.css` with `/* my-clients */` block OR new `my-clients.css` (see decision D-C-9) |
| Portfolio summary endpoint | 🔧 extend | `GET /api/consultant/portfolio-summary` exists at `server/routes/consultant.js:24` | EXTEND response shape with `stage`, `primaryContact`, `objectives.{onTrack,atRisk,behind}`, `riskStatus`, `lastActivity` |
| Portfolio KPIs endpoint | 🆕 new | none | CREATE `GET /api/consultant/portfolio-kpis` |
| Create client endpoint | 🆕 new | none | CREATE `POST /api/consultant/clients` |
| Enrich company endpoint | 🆕 new | none | CREATE `POST /api/consultant/clients/enrich` (depends on Epic F's `enrichCompany()`) |
| Company stage field | 🆕 new | NOT present in `server/models/Company.js` | ADD to Company schema |
| Company primaryContact | 🆕 new | NOT present | ADD sub-doc |
| Company industry/website/employee_count | ✅ exists | `Company.industry`, `.website`, `.employee_count`, `.business_context.profile.founded_year` exist | REUSE (resolve nesting in D-C-3) |
| Navigation entry | 🔧 extend | `client/js/navigation.js:12-18` CONSULTANT block has 5 items, no My Clients | INSERT as first item in CONSULTANT block ONLY |
| Mockup | ✅ exists | `sprint_mockups/sprint-22/my-clients.html` (cleaned, nav-locked) | REFERENCE during implementation |

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `server/routes/consultant.js` | 24-110 | Returns `{name, industry, size, logo, stats:{teams,assessments}, ssi:{...}}` | EXTEND response with stage, primaryContact, objectives breakdown, riskStatus, lastActivity |
| `server/models/Company.js` | 37-100+ | Top-level: name, industry, industry_subtype, size_category, employee_count, website. Nested: business_context.profile.{founded_year, description, business_model, value_proposition} | ADD: stage, primary_contact, industry_secondary, vertical, hq, estimated_revenue_band, ai_enrichment_used, ai_confidence, risk_status |
| `client/js/navigation.js` | 12-18 | CONSULTANT: 5 items starting with Dashboard | PREPEND `{label:'My Clients', href:'/pages/my-clients.html', enabled:true}`. **Do NOT modify BUSINESS_OWNER (line 19) or EXECUTIVE (line 26) blocks** |
| `server/models/User.js` | `managed_businesses[]` exists | Used to scope portfolio queries | On client create, `$push` new Company id into `managed_businesses` |

---

## Net-New Files

```
client/pages/my-clients.html                        NEW
client/pages/scripts/my-clients.js                  NEW
client/pages/scripts/add-client-wizard.js           NEW (modal injected into my-clients.html)
client/css/my-clients.css        OR                 NEW (decision D-C-9)
   <section in client/css/s13-patterns.css>        ALTERNATIVE
```

---

## Net-New API Endpoints

| Method | Path | Owner |
|--------|------|-------|
| GET | `/api/consultant/portfolio-kpis` | C |
| POST | `/api/consultant/clients/enrich` | C (calls Epic F service) |
| POST | `/api/consultant/clients` | C |

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| C-1 | EPIC_C self-contradiction: top says 21 pts but Phase 3 reads "3-step modal wizard" while §5 canonical is 2-step AI flow | DECISIONS_LOG.md → D-C-1 |
| C-2 | EPIC_C "Dependencies: None" is wrong — needs Epic A (Company fields), Epic F (enrichCompany). Master plan acknowledges this; epic doesn't | DECISIONS_LOG.md → D-C-2 |
| C-3 | `description` field placement: spec puts at `company.description` top-level; model has it at `business_context.profile.description`. Pick one | DECISIONS_LOG.md → D-C-3 |
| C-4 | `employee_count` is required (1-500) but wizard collects only `size` band. Pick: derive midpoint, make optional, or require | DECISIONS_LOG.md → D-C-4 |
| C-5 | `riskStatus` formula not defined. KPI "At Risk", "Need Attention" depend on it | DECISIONS_LOG.md → D-C-5 |
| C-6 | Multi-tenancy on POST /clients: who owns new Company, what arrays/back-refs to update, default Team creation | DECISIONS_LOG.md → D-C-6 |
| C-7 | Stage transitions: who can advance, valid stage on creation (default Prospect?), stage history audit | DECISIONS_LOG.md → D-C-7 |
| C-8 | Welcome email checkbox has no template, no Mailjet wiring. Spec or descope | DECISIONS_LOG.md → D-C-8 |
| C-9 | CSS file ownership: new my-clients.css vs section in s13-patterns.css | DECISIONS_LOG.md → D-C-9 |
| C-10 | Nav href for "Dashboard" — Epic G replaces dashboard-v2.html content; do we leave nav pointing to v2 or change to v3? | DECISIONS_LOG.md → D-C-10 / D-G-1 |
| C-11 | Nudge "Send Reminder" — no implementation spec. Stub-only or descope? | DECISIONS_LOG.md → D-C-11 |
| C-12 | "Notes" action — modal/drawer not specified. Out-of-scope or specify? | DECISIONS_LOG.md → D-C-12 |
| C-13 | Phase 2 extended `/portfolio-summary` requires Objective + KeyResult aggregations — KeyResult is new (Epic A), Objective.status enum needs verification | DECISIONS_LOG.md → D-C-13 |
| C-14 | `BUSINESS_OWNER` and `EXECUTIVE` nav blocks should NOT receive My Clients (spec says "consultant primary workspace") — confirm | DECISIONS_LOG.md → D-C-14 |
| C-15 | Story-points table has 8 lines summing to 21 but lists "Add Client Wizard (3 steps) | 5" — stale terminology | DECISIONS_LOG.md → D-C-15 |

---

## Acceptance-Criteria Coverage Audit

Current AC (12 items) covers: KPI display, tile components, stages, filter, search, wizard, nudge, notes, mobile, nav. **Gaps**:
- No AC for AI auto-fill happy path (Step 1 → Step 2 with `confidence`, `sources`, signals, suggested template, primary contact)
- No AC for enrich timeout/manual fallback
- No AC for tenant isolation (consultant A cannot see consultant B's clients)
- No AC that new Company is appended to `managed_businesses[]`
- No AC for stage filter precedence vs search

Add 5 AC items post-decision.

---

## Test-Plan Stub

- Unit: portfolio-kpis math edge cases (zero clients, zero assessments)
- Unit: riskStatus formula (whatever D-C-5 resolves to)
- Integration: portfolio-summary returns extended shape; tenant isolation enforced
- Integration: POST /clients pushes to `managed_businesses`, creates default Team (per D-C-6)
- Integration: POST /clients/enrich respects 3s timeout, returns 504 on failure
- Playwright: My Clients page renders; happy-path Add Client wizard with AI; manual fallback path; cancel mid-wizard
- Playwright: search + stage filter combine correctly
- Multi-tenancy: consultant A trying to fetch consultant B's portfolio gets empty array
