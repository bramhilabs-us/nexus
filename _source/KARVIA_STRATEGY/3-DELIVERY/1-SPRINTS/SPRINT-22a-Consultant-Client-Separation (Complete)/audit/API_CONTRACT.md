# Sprint 22a — API Contract (#184a Consultant Read API Surface)

<!-- @GENOME T3-SPR-022a-API | DRAFT | 2026-04-30 | parent:T3-SPR-022a-AUDIT | auto:- | linked:/audit-architecture,/coding -->

**Status**: DRAFT pending sign-off
**Implements**: 7 new endpoints under `/api/consultant/clients/:id/*` + pagination on existing `/api/consultant/portfolio-summary`
**File**: All endpoints land in [server/routes/consultant.js](../../../../server/routes/consultant.js)
**Mounted at**: `/api/consultant` (existing prefix)

---

## Cross-cutting contract (applies to every endpoint below)

### Authentication

```
Authorization: Bearer <JWT>
```

All endpoints require:
1. `authenticateToken` (existing middleware)
2. `requireRole('CONSULTANT')` (existing middleware)
3. **Membership assertion** (every endpoint):
   ```js
   const userId = req.user.user_id || req.user._id || req.user.id;
   const user = await User.findById(userId).select('managed_businesses');
   const managedIds = (user?.managed_businesses || []).map(String);
   if (!managedIds.includes(String(req.params.id))) {
     return res.status(403).json({ success: false, error: 'Not in your portfolio' });
   }
   ```

This is the **non-negotiable tenant guard**. F-C-01/02/03 cease to exist because the consultant never *becomes* the client; instead, the server checks `:id ∈ managed_businesses` on every read.

### Standard error responses

| Status | Body | When |
|---|---|---|
| 400 | `{ success: false, error: 'Invalid client id' }` | `:id` is not a valid ObjectId |
| 401 | (auth middleware) | Missing/invalid JWT |
| 403 | `{ success: false, error: 'Not in your portfolio' }` | `:id ∉ managed_businesses` |
| 403 | `{ success: false, error: 'Consultant access required' }` | `role !== 'CONSULTANT'` |
| 404 | `{ success: false, error: 'Client not found' }` | Company doc deleted/missing |
| 500 | `{ success: false, error: 'Failed to load <resource>' }` | Internal error (logged server-side) |

### Standard success envelope

```json
{ "success": true, "data": <resource> }
```

### Performance contract (encodes F-M-02, F-M-06)

- **Max DB round-trips per endpoint**: 5 (counted as parallel `Promise.all` calls).
- **No client-side joins in `client-workspace.html`** — each tab consumes exactly one of these endpoints. F-M-06 acceptance criterion.
- **Provider cache reuse**: Where possible, reuse `AIContextService.providers/*` getters so consultant reads benefit from existing per-op cache. Not required for #184a; nice-to-have.
- **Response size cap**: 1 MB per response. If a client has > 200 objectives, paginate (F-M-01 pattern below).

### Pagination convention (encodes F-M-01)

For list-returning endpoints (`/objectives`, `/goals/quarterly`, `/goals/weekly`, `/teams`, `/assessments`):

```
?limit=<int, default 50, max 200>
?cursor=<base64-encoded ObjectId of last item from previous page, optional>
```

Response includes:
```json
{
  "success": true,
  "data": [ ... ],
  "pageInfo": {
    "limit": 50,
    "nextCursor": "<base64 ObjectId>" | null,
    "hasMore": true | false
  }
}
```

Default behavior unchanged for ≤50 items (no `pageInfo` consumer change required).

### Caching headers

```
Cache-Control: private, max-age=30
```

(30s client-side; consultant data is multi-tenant-private; aggressive caching breaks the "fresh portfolio view" mental model.)

---

## Endpoint 1 — `GET /api/consultant/clients/:id/profile`

**Purpose**: Returns the full Company document for the consultant's client view, plus computed risk + last activity. Powers the "Profile" tab of `client-workspace.html`.

**Path params**: `id` (Mongo ObjectId of Company)
**Query params**: none
**DB round-trips**: 3 (Company, last Assessment, latest Objective updated_at). All `Promise.all`'d.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "_id": "65...",
    "name": "Acme Corp",
    "industry": "financial_services",
    "industry_secondary": "wealth_advisory",
    "vertical": "RIA",
    "hq": "Boston, MA",
    "size_category": "11-50",
    "employee_count": 30,
    "estimated_revenue_band": "5M-10M",
    "stage": "onboarding",
    "description": "...",
    "logo": "https://...",
    "primary_contact": {
      "name": "Jane Doe",
      "title": "COO",
      "email": "jane@acme.com",
      "phone": "+1..."
    },
    "ai_enrichment_used": true,
    "ai_confidence": 0.86,
    "stage_history": [
      { "from": null, "to": "prospect", "actor": "consultant:65...", "at": "2026-04-15T..." },
      { "from": "prospect", "to": "onboarding", "actor": "system:invitation_accepted", "at": "2026-04-22T..." }
    ],
    "computed": {
      "riskStatus": "on_track | at_risk | behind",
      "lastActivity": {
        "date": "2026-04-28T...",
        "description": "Completed assessment"
      }
    },
    "createdAt": "2026-04-15T...",
    "updatedAt": "2026-04-29T..."
  }
}
```

**Notes**:
- `riskStatus` is computed at read-time (D-C-5 unchanged) using the existing `computeRiskStatus()` helper.
- `stage_history` is added by #184e; before #184e ships, return `[]`.
- Reuses the same `select(...)` projection as [portfolio-summary](../../../../server/routes/consultant.js#L103) for consistency.

---

## Endpoint 2 — `GET /api/consultant/clients/:id/objectives`

**Purpose**: List the client's Objectives with KR rollups. Powers the "Objectives" tab.

**Path params**: `id` (Company)
**Query params**: `limit` (default 50, max 200), `cursor` (optional), `status` (optional: `active|completed|archived`), `year` (optional: int)
**DB round-trips**: 2 (Objectives + KR aggregate). `Promise.all`'d.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65...",
      "company_id": "65...",
      "title": "Grow ARR by 30% in 2026",
      "description": "...",
      "category": "growth",
      "target_year": 2026,
      "status": "active",
      "priority": "high",
      "owner_id": { "_id": "65...", "name": "...", "email": "..." },
      "kr_rollup": {
        "total": 4,
        "on_track": 2,
        "at_risk": 1,
        "behind": 1,
        "avg_progress_pct": 47
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pageInfo": { "limit": 50, "nextCursor": null, "hasMore": false }
}
```

**Notes**:
- Filter is hard-pinned to `company_id: req.params.id` (membership already asserted). Mongo uses `{company_id:1, status:1}` index ([Objective.js:313](../../../../server/models/Objective.js#L313)).
- `kr_rollup` is computed via a single aggregation against KeyResult.
- `owner_id` populate adds 1 round-trip; pre-aggregate in the same `Promise.all`.

---

## Endpoint 3 — `GET /api/consultant/clients/:id/goals/quarterly`

**Purpose**: List quarterly goals for the client. Powers part of the "Plan" tab.

**Path params**: `id` (Company)
**Query params**: `limit` (default 50, max 200), `cursor` (optional), `quarter` (optional: 1-4), `year` (optional), `objective_id` (optional)
**DB round-trips**: 1 (Goal w/ `time_period: 'QUARTERLY'`).

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65...",
      "company_id": "65...",
      "objective_id": "65...",
      "key_result_id": "65...",
      "title": "Close 10 enterprise deals",
      "time_period": "QUARTERLY",
      "quarter": 2,
      "year": 2026,
      "status": "active",
      "owner_id": { "_id": "65...", "name": "..." },
      "progress_pct": 30,
      "due_date": "2026-06-30",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pageInfo": { "limit": 50, "nextCursor": null, "hasMore": false }
}
```

**Notes**:
- Filter: `{company_id, time_period: 'QUARTERLY'}` + optional `quarter/year/objective_id`. Hits `{company_id:1, time_period:1, quarter:1, year:1}` index ([Goal.js:319](../../../../server/models/Goal.js#L319)).
- Soft-deleted goals (`status: 'cancelled'`) excluded by default.

---

## Endpoint 4 — `GET /api/consultant/clients/:id/goals/weekly`

**Purpose**: List weekly goals (or "Moves" once renamed) for the client. Powers part of the "Plan" tab.

**Path params**: `id` (Company)
**Query params**: `limit` (default 50, max 200), `cursor` (optional), `quarterly_id` (optional, recommended), `week` (optional), `year` (optional)
**DB round-trips**: 1.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65...",
      "company_id": "65...",
      "key_result_id": "65...",
      "parent_goal_id": "65...",
      "title": "...",
      "time_period": "WEEKLY",
      "week": 18,
      "target_year": 2026,
      "frequency": "weekly",
      "status": "active",
      "owner_id": { "_id": "65...", "name": "..." },
      "completions": [...],
      "progress_pct": 50,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pageInfo": { "limit": 50, "nextCursor": null, "hasMore": false }
}
```

**Notes**:
- Filter on `{company_id, key_result_id, target_week, target_year}` hits [WeeklyGoal.js:105](../../../../server/models/WeeklyGoal.js#L105).
- If `quarterly_id` is supplied, filter `{parent_goal_id: quarterly_id}` (also indexed at [Goal.js:317](../../../../server/models/Goal.js#L317)).

---

## Endpoint 5 — `GET /api/consultant/clients/:id/teams`

**Purpose**: List the client's teams + member counts. Powers the "Teams" tab.

**Path params**: `id` (Company)
**Query params**: `limit` (default 50, max 200), `cursor` (optional)
**DB round-trips**: 2 (Teams list + User counts per team). `Promise.all`'d.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65...",
      "company_id": "65...",
      "name": "Sales",
      "department": "Revenue",
      "manager_id": { "_id": "65...", "name": "...", "email": "..." },
      "member_count": 12,
      "is_active": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pageInfo": { "limit": 50, "nextCursor": null, "hasMore": false }
}
```

**Notes**:
- `{company_id:1, is_active:1}` index ([Team.js:151](../../../../server/models/Team.js#L151)) covers the filter.
- `member_count` via single `User.aggregate({company_id, team_id, status: 'active'})`.

---

## Endpoint 6 — `GET /api/consultant/clients/:id/assessments`

**Purpose**: List the client's assessments + status + last completion. Powers the "Assessments" tab.

**Path params**: `id` (Company)
**Query params**: `limit` (default 50, max 200), `cursor` (optional), `status` (optional: `pending|in_progress|completed|excluded`), `assessment_type` (optional)
**DB round-trips**: 1.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65...",
      "company_id": "65...",
      "assessment_type": "ssi",
      "status": "completed",
      "respondent": { "_id": "65...", "name": "...", "email": "..." },
      "ssi_result": {
        "overall": 78,
        "dimensions": { "speed": 80, "strength": 75, "intelligence": 79 }
      },
      "completed_at": "2026-04-28T...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pageInfo": { "limit": 50, "nextCursor": null, "hasMore": false }
}
```

**Notes**:
- Default sort: `completed_at: -1` (most recent first).
- `ssi_result` only present when `status === 'completed'`.

---

## Endpoint 7 — `GET /api/consultant/clients/:id/dashboard-summary`

**Purpose**: One-call composed summary for the client-workspace landing tab. **Hard cap: 5 DB round-trips, all `Promise.all`'d.** This is the most-watched endpoint per F-M-02.

**Path params**: `id` (Company)
**Query params**: none
**DB round-trips**: **5 maximum** (Company, latest Assessment, Objectives count + buckets, latest weekly goal completion, latest team activity).

**Response 200**:
```json
{
  "success": true,
  "data": {
    "client": {
      "_id": "65...",
      "name": "Acme Corp",
      "stage": "onboarding",
      "logo": "https://..."
    },
    "ssi": {
      "overall": 78,
      "dimensions": { "speed": 80, "strength": 75, "intelligence": 79 },
      "last_assessment_at": "2026-04-28T..."
    },
    "objectives": {
      "total": 4,
      "on_track": 2,
      "at_risk": 1,
      "behind": 1
    },
    "teams": {
      "count": 5
    },
    "assessments": {
      "completed": 12,
      "pending": 3
    },
    "lastActivity": {
      "date": "2026-04-29T...",
      "description": "Quarterly goal updated"
    },
    "riskStatus": "on_track"
  }
}
```

**Notes**:
- This is what the consultant sees first when opening `client-workspace.html` (default tab = `#tab=summary`).
- F-M-02 says: any new sub-query added in future doubles as a finding. Hard-cap enforced via integration test.
- Reuses helpers: `computeRiskStatus()`, `bucketObjectives()`, `deriveEmployeeCount()` (already in [consultant.js](../../../../server/routes/consultant.js)).

---

## Pagination retrofit on existing endpoint (F-M-01)

### `GET /api/consultant/portfolio-summary?limit=&cursor=`

**Change**: Add optional `limit` (default 50, max 200) and `cursor` query params. Default behavior unchanged.

**Backward compat**: If `limit` is omitted **and** `managedIds.length <= 50`, return the response as today (no `pageInfo`). Frontend `my-clients.js` doesn't change until consultants exceed 50 clients.

**Behavior change at scale**: When `limit` is supplied OR `managedIds.length > 200`, slice + paginate.

---

## Tests required (#184a acceptance, ~30 assertions)

| Suite | Coverage |
|---|---|
| **Happy path (7 endpoints)** | 200 response shape matches spec; correct status code |
| **Membership negative (`:id ∉ managed_businesses`)** | 403 on every endpoint |
| **Cross-tenant isolation** | Consultant A's portfolio cannot read Consultant B's clients via direct ID guess |
| **Role gate** | BUSINESS_OWNER calling `/api/consultant/*` → 403 |
| **Pagination** | `limit=2` → exactly 2 items + `hasMore:true` + valid `nextCursor` |
| **DB round-trip cap on `dashboard-summary`** | Spy on `mongoose.Query.prototype.exec` — assert ≤ 5 calls per request |
| **Soft-delete exclusion** | Cancelled goals not returned by default |
| **Index utilization** | `explain()` confirms `{company_id, ...}` compound index used |

**Test runner**: `MongoMemoryReplSet` (matches Sprint 22 #181/182 pattern). New file: [scripts/test-sprint22a-184a-consultant-reads.js](../../../../scripts/test-sprint22a-184a-consultant-reads.js).

---

## Out of scope for #184a (deliberately deferred)

- ❌ **Write paths** (consultant cannot mutate client data; #184a is read-only)
- ❌ **AI enrichment endpoints** (those exist via `/api/consultant/clients/enrich`)
- ❌ **Stage transitions** (#184e)
- ❌ **Invitation actions** (#184d)
- ❌ **Real-time / WebSocket** (HTTP polling is sufficient for Beta)

---

## Sign-off requirement

After this contract is signed:
1. #184a session begins with: *"Audit signed off DD/MM. Implementing exactly the contract in `API_CONTRACT.md`."*
2. Any deviation during implementation = a contract amendment, not a silent change.
3. The integration test asserts the response shape against the JSON examples above.

**Status**: DRAFT — awaiting sign-off
