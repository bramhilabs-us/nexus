# API Deltas — Sprint 22

<!-- @GENOME T3-SPR-022-PW-AD | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

Single source of truth for every endpoint added or modified in Sprint 22.

---

## Legend

- 🆕 **NEW** — endpoint did not exist
- 🔧 **EXTEND** — existing endpoint, response/request shape changes
- ✅ **REUSE** — endpoint exists and is consumed unchanged

---

## Epic A — Disciplines

| Status | Method | Path | Auth | Tenant | Notes |
|--------|--------|------|------|--------|-------|
| 🆕 | GET | `/api/disciplines` | required | none (config-only) | returns 9 disciplines |
| 🆕 | GET | `/api/disciplines/dropdown` | required | none | dropdown-shape |

---

## Epic C — My Clients

| Status | Method | Path | Auth | Tenant | Owner |
|--------|--------|------|------|--------|-------|
| 🔧 | GET | `/api/consultant/portfolio-summary` | CONSULTANT | scoped to `user.managed_businesses` | C extends shape |
| 🆕 | GET | `/api/consultant/portfolio-kpis` | CONSULTANT | scoped to `user.managed_businesses` | C |
| 🆕 | POST | `/api/consultant/clients` | CONSULTANT | creates Company; pushes to `user.managed_businesses` | C |
| 🆕 | POST | `/api/consultant/clients/enrich` | CONSULTANT | none (external lookup) | C → calls Epic F |

### Extended `/portfolio-summary` Response Diff

**Currently returns** (`server/routes/consultant.js:79-101`):
```json
{
  "_id": "...", "name": "...", "industry": "...", "size": "...", "logo": null,
  "stats": { "teams": 0, "assessments": 0 },
  "ssi": { "overall": 0, "dimensions": { "speed": 0, "strength": 0, "intelligence": 0 } }
}
```

**Sprint 22 adds** (preserves existing fields):
```json
{
  "stage": "in_progress",
  "primaryContact": { "name": "...", "title": "..." },
  "objectives": { "total": 4, "onTrack": 2, "atRisk": 1, "behind": 1 },
  "assessments": { "completed": 3, "total": 3 },
  "riskStatus": "healthy",
  "lastActivity": { "date": "2026-04-18", "description": "Completed Q2 Assessment" }
}
```

**Computation**: requires Objective + KeyResult aggregation (KeyResult is new in Epic A). Phase 2 of Epic C blocks on Epic A. See D-C-13.

### POST `/clients/enrich` Contract

```http
POST /api/consultant/clients/enrich
Authorization: Bearer <token>
Content-Type: application/json

{ "company_name": "string (required, min 2)", "website": "url (optional)" }
```

**Success (200, ≤3s)**:
```json
{
  "industry": "string",
  "industry_secondary": "string|null",
  "vertical": "string|null",
  "size": "1-10|11-50|51-200|201-500",
  "estimated_employees": 110,
  "estimated_revenue_band": "string|null",
  "founded": 1987,
  "hq": "string|null",
  "annual_projects": "string|null",
  "description": "string",
  "detected_signals": ["string"],
  "suggested_ssi_focus": [{"dimension":"...","sub_dimension":"..."}],
  "suggested_template_id": "string|null",
  "suggested_contacts": [{"name","title","email","is_primary","source","note"}],
  "sources": ["url"],
  "confidence": 0.87
}
```

**Failure (504 timeout)**: `{ "error": "enrich_unavailable", "fallback": true }` → frontend renders manual Step 2.

**Cache**: 24h per `(name, website)` tuple. See D-F-2 for storage choice.

### POST `/clients` Contract

```http
POST /api/consultant/clients
Authorization: Bearer <token>

{
  "company": { "name", "industry", "industry_secondary?", "vertical?", "size", "website?", "founded?", "hq?", "estimated_revenue_band?", "description?" },
  "primaryContact": { "name", "title", "email", "phone?" },
  "stage": "prospect|onboarding|objective_identified|in_progress",
  "notes": "string?",
  "suggested_ssi_focus": [...]?,
  "suggested_template_id": "string?",
  "ai_enrichment_used": true,
  "ai_confidence": 0.87,
  "sendWelcomeEmail": false
}
```

**Side effects**:
1. Create Company doc (no parent company_id — tenant root)
2. `$push` company `_id` into `req.user.managed_businesses`
3. Optional: create default Team (see D-C-6)
4. Optional: send welcome email (see D-C-8)

---

## Epic D — Assessment Hub

| Status | Method | Path | Auth | Tenant |
|--------|--------|------|------|--------|
| 🔧 | GET | `/api/assessments/:id/detailed-results` | required | tenant scope on assessment | extends with sub_dimensions |
| 🆕 | GET | `/api/assessments/trends?team_id=&period=` | CONSULTANT, BUSINESS_OWNER | `req.user.company_id` | |
| 🆕 | GET | `/api/assessments/compare?id1=&id2=` | required | both assessments must be in tenant | D-D-4 |

---

## Epic E — Objective Wizard

| Status | Method | Path | Auth | Tenant |
|--------|--------|------|------|--------|
| 🔧 | POST | `/api/objectives` | CONSULTANT, BUSINESS_OWNER, EXECUTIVE (existing route at line 87 with `validateObjectiveLimit`) | extends payload (behavior_ids, ssi_impact, key_results array → also creates KeyResult docs) |
| 🆕 | POST | `/api/objectives/generate-krs` | required, CONSULTANT/BO/EXEC | `req.user.company_id` | calls Epic F service |

---

## Epic F — Service-Owned Endpoints

Epic F primarily extends services, but owns these new endpoints:

| Status | Method | Path | Auth | Tenant | Rate Limit |
|--------|--------|------|------|--------|-----------|
| 🆕 | POST | `/api/weekly-goals/generate` | required | tenant scope on key_result_id | `aiGenerationLimiter` |
| 🆕 | POST | `/api/moves/generate` | required | tenant scope on weekly_goal_id | `aiGenerationLimiter` |

Epic F's `enrichCompany()` is exposed via Epic C's `/api/consultant/clients/enrich` route.

---

## Net-New Resource Routes (consumed by Epic E + Epic H)

These should also be created during Epic A or as part of Epic E to back the new models:

| Status | Method | Path | Owner |
|--------|--------|------|-------|
| 🆕 | GET | `/api/key-results/:objectiveId` | E (or A) |
| 🆕 | POST | `/api/key-results` | E |
| 🆕 | PUT | `/api/key-results/:id` | E |
| 🆕 | DELETE | `/api/key-results/:id` (soft) | E |
| 🆕 | GET | `/api/weekly-goals/:keyResultId` | H |
| 🆕 | POST | `/api/weekly-goals` | H |
| 🆕 | PUT | `/api/weekly-goals/:id` | H |
| 🆕 | DELETE | `/api/weekly-goals/:id` (soft) | H |
| 🆕 | GET | `/api/moves/:weeklyGoalId` | G |
| 🆕 | POST | `/api/moves` | G |
| 🆕 | PUT | `/api/moves/:id` | G |
| 🆕 | DELETE | `/api/moves/:id` (soft) | G |

**Decision D-A-6**: confirm ownership of CRUD routes (Epic A vs Epic E/G/H) — current master plan splits ownership inconsistently.

---

## Existing Endpoints Untouched

| Endpoint | Status |
|----------|--------|
| `/api/objectives` GET, GET/:id, PUT/:id, DELETE/:id, /bulk, /list, etc. | unchanged |
| `/api/objectives/:objectiveId/ai-help` | unchanged (existing AI feature) |
| `/api/assessments/*` (history, my-assessments, results, etc.) | unchanged |
| `/api/teams/*` | unchanged |
| `/api/invitations/*` | unchanged |
| `/api/users/*` | unchanged |

---

## Authorization Summary (cross-cutting)

- All new endpoints require `authenticateToken`
- Consultant-only: `/api/consultant/*` (existing pattern)
- Tenant scope: every query MUST filter by `req.user.company_id` OR `req.user.managed_businesses` (consultants)
- Cross-tenant access: rejected at route handler with 403
- See `TENANCY_RBAC_MATRIX.md` for per-route detail
