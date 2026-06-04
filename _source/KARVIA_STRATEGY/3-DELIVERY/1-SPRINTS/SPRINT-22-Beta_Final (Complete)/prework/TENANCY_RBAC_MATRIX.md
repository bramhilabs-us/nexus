# Tenancy & RBAC Matrix — Sprint 22

<!-- @GENOME T3-SPR-022-PW-TR | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

Per-route authentication, authorization, and tenant-scope rules. Every NEW or EXTENDED route in Sprint 22.

---

## Role Hierarchy (existing — for reference)

```
CONSULTANT > BUSINESS_OWNER > EXECUTIVE > MANAGER > EMPLOYEE
```

**Tenant primitives**:
- `req.user.company_id` — single tenant for non-consultants
- `req.user.managed_businesses[]` — multi-tenant for consultants
- `requireRole(...)` middleware enforces role gates
- `authenticateToken` middleware enforces JWT presence

---

## Route Matrix

### Disciplines (Epic A)

| Route | Auth | Role | Tenant Scope | Notes |
|-------|------|------|--------------|-------|
| `GET /api/disciplines` | yes | any | none (global config) | safe to cache |
| `GET /api/disciplines/dropdown` | yes | any | none | safe to cache |

### My Clients (Epic C)

| Route | Auth | Role | Tenant Scope | Write Side-Effects |
|-------|------|------|--------------|---------------------|
| `GET /api/consultant/portfolio-summary` | yes | CONSULTANT only | `_id ∈ user.managed_businesses` | none |
| `GET /api/consultant/portfolio-kpis` | yes | CONSULTANT only | `_id ∈ user.managed_businesses` | none |
| `POST /api/consultant/clients` | yes | CONSULTANT only | creates new tenant root | (a) create Company; (b) `$push` Company id to `user.managed_businesses`; (c) optionally create default Team (D-C-6); (d) optionally send welcome email (D-C-8) |
| `POST /api/consultant/clients/enrich` | yes | CONSULTANT only | none (external lookup) | rate-limited (D-F-6) |

### Assessments (Epic D)

| Route | Auth | Role | Tenant Scope | Notes |
|-------|------|------|--------------|-------|
| `GET /api/assessments/:id/detailed-results` | yes (existing) | any (existing) | tenant-scope check on assessment.company_id | existing tenant rules apply |
| `GET /api/assessments/trends` | yes | CONSULTANT, BUSINESS_OWNER | `company_id = req.user.company_id` (or managed_businesses for CONSULTANT) | |
| `GET /api/assessments/compare` | yes | any | both ids must be in tenant | D-D-4 — reject 403 if either id outside scope |

### Objectives (Epic E)

| Route | Auth | Role | Tenant Scope | Middleware |
|-------|------|------|--------------|-----------|
| `POST /api/objectives` (extended) | yes | CONSULTANT, BUSINESS_OWNER, EXECUTIVE | `company_id = req.user.company_id` (or selected for consultants) | `validateObjectiveLimit` (existing — verify still applies, D-E-6) |
| `POST /api/objectives/generate-krs` | yes | CONSULTANT, BUSINESS_OWNER, EXECUTIVE | `company_id` from token | `aiGenerationLimiter` (D-F-6) |

### Key Results / Weekly Goals / Moves (Epic A/E/H/G CRUD)

| Route | Auth | Role | Tenant Scope |
|-------|------|------|--------------|
| `GET /api/key-results/:objectiveId` | yes | any with read on objective | `kr.company_id = req.user.company_id` |
| `POST /api/key-results` | yes | CONSULTANT/BO/EXEC | inherit from objective; reject if objective tenant ≠ user tenant |
| `PUT /api/key-results/:id` | yes | CONSULTANT/BO/EXEC | tenant match |
| `DELETE /api/key-results/:id` | yes | CONSULTANT/BO/EXEC | tenant match; soft-delete |
| `GET /api/weekly-goals/:keyResultId` | yes | any | tenant match |
| `POST /api/weekly-goals` | yes | CONSULTANT/BO/EXEC/MANAGER | tenant match |
| `PUT /api/weekly-goals/:id` | yes | owner OR manager+ | tenant match |
| `DELETE /api/weekly-goals/:id` | yes | CONSULTANT/BO/EXEC | tenant match; soft-delete |
| `GET /api/moves/:weeklyGoalId` | yes | any | tenant match |
| `POST /api/moves` | yes | any | tenant match; assigned_to within tenant |
| `PUT /api/moves/:id` | yes | assigned_to OR manager+ | tenant match |
| `DELETE /api/moves/:id` | yes | manager+ | tenant match; soft-delete |
| `POST /api/weekly-goals/generate` | yes | CONSULTANT/BO/EXEC | tenant match | `aiGenerationLimiter` |
| `POST /api/moves/generate` | yes | CONSULTANT/BO/EXEC | tenant match | `aiGenerationLimiter` |

---

## UI Visibility (Navigation)

| Page | CONSULTANT | BUSINESS_OWNER | EXECUTIVE | MANAGER | EMPLOYEE |
|------|------------|----------------|-----------|---------|----------|
| **My Clients** (NEW) | ✅ FIRST | ❌ | ❌ | ❌ | ❌ |
| Dashboard (V3) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Objectives | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assessments | ✅ | ✅ | ✅ | ✅ | ❌ |
| Teams | ✅ | ✅ | ✅ | ✅ | ❌ |
| Planning | ✅ | ✅ | ✅ | ✅ | ❌ |
| Objective Wizard | ✅ | ✅ | ✅ | ❌ | ❌ |

**Implementation**: only the CONSULTANT block in `client/js/navigation.js` gets My Clients prepended. Per D-C-14, BO and EXEC do NOT see My Clients.

---

## Multi-Tenancy Defenses (cross-cutting)

Every new write route MUST:
1. Pull `company_id` from `req.user.company_id` (single-tenant) or validate against `req.user.managed_businesses` (consultant)
2. Reject body-supplied `company_id` mismatches with 403
3. On create of nested resources, derive parent's `company_id` and inherit
4. Use indexes that lead with `company_id` for query scope
5. Soft-delete only (existing pattern)

**Negative tests are MANDATORY** for every new endpoint:
- "consultant A cannot read consultant B's clients"
- "non-consultant cannot call /api/consultant/*"
- "user with company X cannot mutate Objective from company Y"

---

## Special Considerations

### Cross-Tenant on POST /clients (Epic C)

A consultant creating a NEW Company is the **only** Sprint 22 case where a write creates a new tenant root. Steps:

1. New Company created with no `company_id` parent (it IS the root)
2. `req.user._id`'s `User.managed_businesses` array gets `$push` of the new Company `_id`
3. The User itself is unchanged in tenancy (still belongs to consultant firm or is a CONSULTANT-role user with no `company_id`)

### Compare Endpoint (Epic D)

`GET /api/assessments/compare?id1=X&id2=Y` must:
1. Look up both assessments
2. For non-CONSULTANT: both must have `company_id = req.user.company_id`
3. For CONSULTANT: both must have `company_id ∈ req.user.managed_businesses`
4. Else 403

Spec currently does not enforce — D-D-4 requires the check.
