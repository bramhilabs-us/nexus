---
id: nexus.data-models
title: Data Models Catalogue — Karvia schemas + Nexus dispositions
tier: T2
status: active
owner: agent
updated: 2026-06-09
summary: >
  Every Karvia Mongoose schema (19 models, ~9,300 lines) catalogued with key
  fields, relations, and validation highlights, plus each model's Nexus
  disposition (lift / lift+program_id / redesign / fold / defer) and the new
  Program entity. Three per-cluster ER diagrams. Surfaces C-008 (Goal/Move
  layer vs the compressed roll-up chain).
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
children: []
revisit:
  - on: "any module's models/ diverge from the dispositions here"
    stage: N2
  - on: "C-008 is answered (Goal/Move layer decision)"
    stage: N2
---

# Data Models Catalogue — Karvia schemas + Nexus dispositions

## Purpose

Catalogue Karvia's actual data layer (read from `karvia_business/server/models/`, 19 schemas) so Night 2's module models are designed from reality. Each model carries a **disposition** — what Nexus does with it. Descriptions are Karvia *as-is*; everything Nexus-flavored lives in the disposition column only.

## TL;DR

- **19 models, ~9,300 lines.** The OKR chain and CRM are clean and lift well. The assessment cluster is SSI-shaped throughout and gets redesigned behind the `AssessmentProvider` contract.
- **Every model already carries `company_id` (indexed)** — adding `program_id` (C-005) is mechanical.
- **The dual KeyResult is confirmed in code**: `Objective.js:173-184` embedded array + a `key_results_v2` virtual, with Karvia's own `CLEANUP-TARGET` comment. Nexus ships standalone-only (AP-4).
- **`User.companies[]` (role per company) is the direct ancestor of `program_memberships[]`** — the pattern exists, it just generalizes.
- **One open question (C-008)**: Karvia's full hierarchy is Objective → KR → **Goal (quarterly)** → WeeklyGoal → **Move**, with Task hanging off Goal — but the Nexus strategy docs describe the compressed chain Task → WeeklyGoal → KR → Objective. Needs a human call before contracts are drafted.

---

## Cluster 1 — CRM (→ `@nexus/crm`)

| Model | Lines | Key fields | Relations | Disposition |
|---|---|---|---|---|
| **Company** | 694 | name, industry(+subtype), size_category, employee_count(1–500), `stage` enum (prospect→…) + `stage_history[]` (actor-attributed transitions), custom_fields (Mixed, source-tagged) | — (tenant root) | **Lift + redesign stages**: stage enum maps to the Nexus pipeline (Prospect → Assessing → Engaged → Handed over); stage_history pattern kept (it's an audit trail done right) |
| **User** | 529 | email (regex-validated), password_hash (min 6), `role` enum (CONSULTANT/BUSINESS_OWNER/EXECUTIVE/MANAGER/EMPLOYEE), `companies[]` {company_id, role, is_primary, status}, `managed_businesses[]` (consultant), manager_id | → Company (multi) | **Lift + generalize**: `companies[]` + `managed_businesses[]` collapse into `program_memberships[]` {program_id, role, status} (C-005). Role enum kept. |
| **Team** | 370 | name, department, function, manager_id + **denormalized manager_name**, members[] | → Company, User | **Lift + program_id**. Keep the denormalization (it's a documented perf choice) but route it through the roll-up engine's denormalize-on-write rule. |
| **Invitation** | 869 | recipient_email/role, `invitation_type` enum (individual / company_assessment / company_onboard), pre-created user_id, company_created flag, customized_question_ids[] | → Company, User, (Assessment) | **Lift simplified + program_id**: 869 lines encode three flows; Nexus keeps the flows but moves assessment-specific fields (customized_question_ids) behind the assessment block's evidence model. |

**New in Nexus**: **`Program`** (C-005) — `{company_id, name, vertical, status: active|handed_over|completed|paused, members[], assigned_consultants[], owner_user_id, assessment_id, outcome{score, narrative, evidence_refs[]}}`. Every domain doc below gains required `program_id`.

```mermaid
erDiagram
    COMPANY ||--o{ USER : "companies[]"
    COMPANY ||--o{ TEAM : has
    COMPANY ||--o{ INVITATION : scopes
    COMPANY ||--o{ PROGRAM : "runs (NEW)"
    PROGRAM ||--o{ PROGRAM_MEMBERSHIP : "members (NEW)"
    USER ||--o{ PROGRAM_MEMBERSHIP : holds
    TEAM }o--|| USER : manager_id
    INVITATION }o--|| USER : sent_by
```

## Cluster 2 — OKR chain (→ objectives / key-results / weekly-goals / tasks)

| Model | Lines | Key fields | Relations | Disposition |
|---|---|---|---|---|
| **Objective** | 583 | title, short_label, `category` enum (6 MECE), owner_id, time_period_type (calendar/fiscal/custom), **embedded `key_results[]` (CLEANUP-TARGET at :173)** + `key_results_v2` virtual | → Company, User | **Lift + program_id + drop embedded KRs** (AP-4, D6). Add the lifecycle stage field (Identified → Handed off → Sustained) as the declared state machine. |
| **KeyResult** | 130 | `metric_type` enum (number/percentage/boolean/currency), target/current/baseline_value, unit, quarters[], year | → Company, Objective | **Lift as-is + program_id** — the cleanest model in Karvia; already matches TECH_STRATEGY's spec. |
| **Goal** (quarterly) | 607 | objective_id, optional key_result_id, **parent_goal_id/child_goal_ids[] (self-nesting)**, time_period | → Company, Objective, Goal | **OPEN — C-008.** Strategy docs compress the chain and omit Goal. Either Goal folds into WeeklyGoal/planning, or the roll-up chain in TECH_STRATEGY is wrong. Human call. |
| **WeeklyGoal** | 167 | key_result_id (only — no objective_id), frequency enum (once→monthly), target_week/year, `completions[]` per week {status, score, notes} | → Company, KeyResult | **Lift + program_id.** The per-week completions[] array is the heartbeat of the weekly rhythm — keep. |
| **Task** | 790 | objective_id + goal_id (both required!), assigned_to, created_by, due_date, hours fields | → Company, Objective, Goal, User | **Lift + program_id + re-parent (C-008)**: Task requires `goal_id`, not `weekly_goal_id` — the chain in code runs Task→Goal→Objective, parallel to WeeklyGoal→KR. Resolve with C-008. |
| **Move** | 182 | weekly_goal_id, `move_type` enum (action/reaction/habit), discipline, frequency + days_of_week[] | → Company, WeeklyGoal | **OPEN — C-008.** Habit-layer below WeeklyGoal; absent from Nexus strategy docs. Lift, fold into Task, or defer. |
| **OKROutcome** | 477 | per-KR records {final_value, achievement_percentage (0–200), outcome enum exceeded→not_measured}, summary, success/risk_factors[], recommendations[] | → KeyResult | **Lift + elevate**: this is the seed of `Program.outcome` + `@nexus/knowledge` evidence records — Karvia built the Transformation OS receipt without naming it. |

```mermaid
erDiagram
    OBJECTIVE ||--o{ KEY_RESULT : has
    OBJECTIVE ||--o{ GOAL : "quarterly (C-008)"
    GOAL ||--o{ GOAL : "self-nesting"
    GOAL ||--o{ TASK : "required goal_id (C-008)"
    KEY_RESULT ||--o{ WEEKLY_GOAL : has
    WEEKLY_GOAL ||--o{ MOVE : "habits (C-008)"
    KEY_RESULT ||--o{ OKR_OUTCOME : "closure record"
    OBJECTIVE }o--|| USER : owner_id
```

## Cluster 3 — Assessment (→ `@nexus/assessment`, redesigned behind the provider contract)

| Model | Lines | Key fields | Relations | Disposition |
|---|---|---|---|---|
| **Assessment** | 1126 | `assessment_type` enum **with 'ssi' baked in**, assessment_category, optional user_id (anonymous surveys), invitation_id, anonymous_respondent{}, **`ssi_scores{speed,strength,intelligence}` hardcoded in the shared model** | → Company, User, Template, Invitation | **Redesign** → provider-agnostic `AssessmentRun` {provider_id, program_id, status, evidence[], scores (dimension-keyed map)}. The hardcoded `ssi_scores` is AP-3's data-layer twin: provider fields don't belong in shared schemas. |
| **AssessmentTemplate** | 378 | per-dimension weight (must sum to 1.0), thresholds (needs_attention/critical), selected_questions[] by id, company_id nullable (global templates) | → Company, User | **Redesign as provider seed-data shape** — the structure is right (weights, thresholds, question refs); it becomes the impl-folder config format, not a shared collection. |
| **AssessmentQuestion** | 386 | question_id (regex: S\d+/ST\d+/IN\d+/IND-*/ROLE-*/TOOL-*), module_type (core/industry/role), industry(+subsector) enums, options[] with normalized 0–10 scores | — | **Redesign as provider seed data** — the core/industry/role modularity and 0–10 normalization carry straight into AIR's question instruments. |
| **DiagnosticReport** | 197 | report_type (individual→company), status (active/archived/superseded), eligibility{completion %}, health{score,level,color}, scores{} | → Company, User, Team | **Fold** into provider `deliverables()` output — a generated `Report` deliverable, stored by the assessment module generically. |
| **SSIDiagnosticReport** | 423 | block scores (delivery/decisions/change/response…), dimension scores with weights, priority pairs {gap, priority_level, suggested_okr_focus} | — | **Fold** — pure SSI artifact; its *shape* (block → dimension → priority → suggested focus) is the template for AIR's Opportunity Register generator. |
| **AIOKRSuggestion** | 576 | weak_areas_analysis {threshold, weak_dimensions[]}, objectives[] drafts {title, category, priority, effort_estimate, timeline.quarters} , status (draft→approved/dismissed) | → Assessment, User, Company | **Generalize** → this IS `seedObjectives()` / `ObjectiveDraft` from the provider contract, already with an approval workflow. Lift the shape into the assessment module, provider-agnostic. |
| **AIInteractionLog** | 382 | interaction_type, context_snapshot {tokens}, prompt/response {tokens_used, latency_ms, model}, outcome {status enum incl. rate_limited, items approved/rejected}, session_id | → Company, User | **Lift generalized** as the LLM call log (observability + cost ceiling enforcement per the AI parking-lot rule). Lives with ops/observability, not a domain module. |
| **Feedback** | 456 | type (pulse/feature_rating/feature_idea), pulse_score 1–5 + ISO week, feature enum, improvement_tags[] | → Company, User | **Defer** — in-product feedback widget; post-beta. BACKLOG item when needed. |

```mermaid
erDiagram
    ASSESSMENT }o--|| COMPANY : tenant
    ASSESSMENT }o--o| ASSESSMENT_TEMPLATE : template_id
    ASSESSMENT_TEMPLATE }o--o{ ASSESSMENT_QUESTION : selected_questions
    ASSESSMENT }o--o| INVITATION : via
    ASSESSMENT ||--o{ AI_OKR_SUGGESTION : seeds
    AI_OKR_SUGGESTION ||--o{ OBJECTIVE : "drafts approved into"
    ASSESSMENT ||--o{ DIAGNOSTIC_REPORT : generates
    ASSESSMENT ||--o{ SSI_DIAGNOSTIC_REPORT : "generates (SSI-only)"
```

## Cross-cutting observations

1. **Tenancy is uniform**: all 19 models index `company_id`; the program_id addition is one migration pattern applied 14 times (the assessment cluster gets it via redesign).
2. **Enums are healthy** but several encode provider or product specifics in shared models (`assessment_type: 'ssi'`, Feedback's feature enum) — the data-layer version of AP-3.
3. **Denormalize-on-write already exists** (Team.manager_name, DiagnosticReport.scores) — Karvia validated the roll-up engine's storage strategy informally.
4. **Validation contracts are real and bite** (regexes on question_id and email, min/max everywhere) — SESSION_PRACTICES rule 7 (read the schema before seeding fixtures) is justified by this catalogue.
5. **Sprint-comment archaeology** (`Sprint 9: changed to false`, `Sprint 22 D-C-4`, `post-22a: legacy-admin only`) shows fields whose requiredness changed under pressure — Nexus equivalents must be decided once, in the contract, not per-sprint.

## Open questions

- **C-008** (filed in `_agent/clarifications.md`) — the Goal/Move layer: Karvia's code-truth hierarchy is `Objective → KR → Goal(quarterly, self-nesting) → WeeklyGoal → Move`, with `Task` requiring `goal_id`. The Nexus strategy docs describe the compressed `Task → WeeklyGoal → KR → Objective`. Lift, fold, or drop Goal+Move? Blocks N1-P4-01 contract drafts for the OKR chain.
