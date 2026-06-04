# Model Deltas — Sprint 22

<!-- @GENOME T3-SPR-022-PW-MD | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

Single source of truth for every Mongoose schema change in Sprint 22.
All field decisions are **proposed** until DECISIONS_LOG.md is signed off.

---

## NEW Models (Epic A)

### KeyResult.js

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| company_id | ObjectId(Company) | yes | yes | tenant root |
| objective_id | ObjectId(Objective) | yes | yes | parent |
| title | String(255) | yes | — | |
| description | String(500) | no | — | |
| metric_type | enum[number,percentage,boolean,currency] | yes | — | |
| target_value | Number | yes | — | |
| current_value | Number | no, default 0 | — | |
| baseline_value | Number | no, default 0 | — | |
| unit | String(20) | no | — | |
| quarters | [Number 1-4] | no | yes (compound) | empty array = full year |
| year | Number | yes | yes (compound) | source-of-truth: see D-A-4 |
| status | enum[not_started,in_progress,completed,at_risk,blocked] | no, default 'not_started' | — | |
| owner_id | ObjectId(User) | yes | — | |
| created_by | ObjectId(User) | yes | — | |
| ai_generated | Boolean | no, default false | — | |
| created_at, updated_at | Date | timestamps | — | |

**Virtuals**: `progress_percentage`, `quarter_display`
**Pre-save**: auto-status from progress

### WeeklyGoal.js

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| company_id | ObjectId(Company) | yes | yes | |
| key_result_id | ObjectId(KeyResult) | yes | yes | |
| title | String(255) | yes | — | |
| description | String(1000) | no | — | |
| frequency | enum[once,weekly,biweekly,twice_monthly,monthly] | no, default 'once' | yes | |
| target_week, target_year | Number | only if frequency='once' | yes (compound) | |
| status | enum[not_started,in_progress,completed,blocked,cancelled] | no, default 'not_started' | — | |
| start_week, end_week | Number 1-52 | only if recurring | — | |
| completions[] | sub-doc | — | — | week, year, status, score, notes, completed_at, completed_by |
| priority | enum[low,medium,high,critical] | default 'medium' | — | |
| owner_id, created_by | ObjectId(User) | yes | — | |
| ai_generated | Boolean | default false | — | |

**Methods**: `addCompletion(week, year, data)`
**Virtuals**: `completion_rate`, `is_recurring`

### Move.js

| Field | Type | Required | Index | Notes |
|-------|------|----------|-------|-------|
| company_id | ObjectId(Company) | yes | yes | |
| weekly_goal_id | ObjectId(WeeklyGoal) | yes | yes | |
| title | String(255) | yes | — | |
| description | String(1000) | no | — | |
| move_type | enum[action,reaction,habit] | yes | yes | |
| discipline | String (from disciplines.js) | no | yes | enum from config |
| frequency | enum[once,daily,weekly,triggered] | default 'once' | — | |
| days_of_week[] | enum[mon..sun] | only if habit weekly | — | |
| due_date | Date | only for action/reaction | — | |
| status | enum[todo,in_progress,completed,blocked,cancelled] | default 'todo' | — | |
| completed_at | Date | — | — | |
| completions[] | sub-doc | — | — | for habits: date, done, discipline_score 1-5, reflection, skipped_reason |
| priority | enum[low,medium,high,urgent] | default 'medium' | — | |
| assigned_to | ObjectId(User) | yes | — | |
| created_by | ObjectId(User) | yes | — | |
| ai_generated | Boolean | default false | — | |

**Methods**: `logCompletion(date, data)`, `complete()`
**Virtuals**: `is_habit`, `streak`, `completion_rate`

---

## EXTENSIONS to Existing Models

### Company.js (Epic C)

| Field | Path | Type | Required | Default | Decision |
|-------|------|------|----------|---------|----------|
| stage | top-level | enum[prospect,onboarding,objective_identified,handed_off,in_progress,completed,sustained] | no | 'prospect' | D-C-7 |
| primary_contact | top-level (sub-doc) | { name, title, email, phone } | no | null | D-C-6 |
| primary_contact.name | nested | String(255) | yes if parent set | — | |
| primary_contact.title | nested | String(255) | no | — | |
| primary_contact.email | nested | String, lowercased | yes if parent set | — | |
| primary_contact.phone | nested | String | no | — | |
| industry_secondary | top-level | String | no | — | from AI enrich |
| vertical | top-level | String | no | — | from AI enrich (e.g. 'legacy_succession') |
| hq | top-level | String(255) | no | — | from AI enrich |
| estimated_revenue_band | top-level | String | no | — | e.g. '25M-50M' |
| ai_enrichment_used | top-level | Boolean | no | false | audit |
| ai_confidence | top-level | Number 0-1 | no | — | audit |
| risk_status | top-level | enum[healthy,at_risk,urgent] | no | 'healthy' | D-C-5 (computed or stored?) |
| description | **decision pending** | String(1000) | no | — | D-C-3: keep nested at `business_context.profile.description` OR lift to top-level? |
| employee_count | top-level (existing) | Number 1-500 | **change to required:false** OR derive | — | D-C-4 |

**Decision dependencies**: D-C-3 (description placement), D-C-4 (employee_count requirement), D-C-5 (risk_status computed vs stored), D-C-6 (primary_contact shape), D-C-7 (stage default + transition rules).

### Assessment.js (Epic D)

| Field | Path | Type | Required | Notes |
|-------|------|------|----------|-------|
| sub_dimensions.speed.{decision_making, market_response, execution_velocity, adaptation_rate} | nested in ssi_result | Number 0-100 | no | back-fill NULL for existing docs |
| sub_dimensions.strength.{financial_resilience, team_capability, process_maturity, resource_depth} | nested in ssi_result | Number 0-100 | no | |
| sub_dimensions.intelligence.{data_utilization, strategic_clarity, learning_velocity, innovation_capacity} | nested in ssi_result | Number 0-100 | no | |
| constraint.dimension | nested in ssi_result | enum[speed,strength,intelligence] | no | computed |
| constraint.sub_dimension | nested in ssi_result | String | no | computed |
| constraint.score | nested in ssi_result | Number | no | computed |

**Migration**: existing assessments without sub_dimensions → fields are absent (sparse). UI must handle. See D-D-7.

### Objective.js (Epic E)

| Field | Path | Type | Required | Notes |
|-------|------|------|----------|-------|
| behavior_ids | top-level | [String] (discipline IDs from config) | no | renamed in spec — D-E-2 says use `discipline_ids` |
| ssi_impact.area | top-level (sub-doc) | enum[speed,strength,intelligence] | no | |
| ssi_impact.sub_dimension | top-level (sub-doc) | String | no | |
| ai_guidance.generated | sub-doc | Boolean | default false | |
| ai_guidance.guidance_text | sub-doc | String | no | |
| ai_guidance.generated_at | sub-doc | Date | no | |
| key_results[] | top-level (existing 116-171) | embedded sub-doc | — | KEEP for backwards compat per D-A-1; new code writes to KeyResult collection |

**Virtual** (Epic A 0.6): `key_results_v2` referencing KeyResult collection by `objective_id`.

---

## NO-CHANGE (Existing models referenced but untouched)

- **User.js** — `managed_businesses[]` already exists; on POST /api/consultant/clients we `$push` the new Company id (no schema change).
- **Goal.js** — kept unchanged. New code uses WeeklyGoal. See D-A-2.
- **Task.js** — kept unchanged. New code uses Move. See D-A-3.
- **Team.js** — no schema change. POST /clients may auto-create a default Team (see D-C-6).
- **Invitation.js** — no schema change.

---

## Migration Notes

| # | Migration | Trigger | Risk |
|---|-----------|---------|------|
| M1 | Existing Companies: add `stage` field default `prospect` | Schema deploy + bulk update script | LOW (no UI relies on it pre-deploy) |
| M2 | Existing Assessments: `sub_dimensions` absent | Read-time fallback (UI shows "—" if absent) | LOW |
| M3 | Existing Objectives: keep embedded `key_results[]`; new wizard writes to BOTH (embedded + collection) until cutover | Dual-write at write-time | MEDIUM — potential drift; D-E-7 |
| M4 | `disciplines.js` config — no DB migration | n/a | NONE |

---

## Index Strategy

New indexes added (per Epic A):
```
KeyResult: { company_id: 1, objective_id: 1 }
KeyResult: { company_id: 1, quarters: 1, year: 1 }
KeyResult: { owner_id: 1, status: 1 }
WeeklyGoal: { company_id: 1, key_result_id: 1 }
WeeklyGoal: { company_id: 1, frequency: 1 }
WeeklyGoal: { company_id: 1, target_week: 1, target_year: 1 }
WeeklyGoal: { owner_id: 1, status: 1 }
Move: { company_id: 1, weekly_goal_id: 1 }
Move: { company_id: 1, move_type: 1 }
Move: { company_id: 1, discipline: 1 }
Move: { assigned_to: 1, status: 1 }
Move: { assigned_to: 1, due_date: 1 }
Company: { stage: 1 }     ← NEW (Epic C portfolio filter)
Company: { risk_status: 1 } ← NEW (Epic C "at risk" KPI) — only if stored
```

All new indexes are tenant-leading where applicable.
