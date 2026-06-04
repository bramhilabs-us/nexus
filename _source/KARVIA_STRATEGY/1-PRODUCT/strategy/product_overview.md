# Karvia OKR Product Overview — Beta 1.0

**Document purpose:** Single source of truth aligning product, design, and engineering for the Beta 1.0 customer release. Reflects vendor agreements, unified manager mockups, and current codebase capabilities.

## Product Narrative
Karvia OKR evolves traditional consulting into an intelligent, recurring performance platform. Consultants and business owners configure organisational values (Speed, Strength, Intelligence), run adaptive assessments across organisation/team/individual layers, and convert insights into AI-supported OKRs, weekly plans, and gamified execution. The experience centres on empathy: every workflow must guide people to act within three meaningful steps while balancing productivity with wellbeing.

## Core User Flow (Speed · Strength · Intelligence)
1. Configure company value model (weightings, definitions, S/S/I thresholds).
2. Build multi-level assessments (org, team, individual) using templates or custom banks.
3. Collect responses from employees; inheritance model calculates composite S/S/I scores.
4. AI-driven gap analysis highlights improvement opportunities.
5. Planning engine proposes objectives and decomposes into quarterly/weekly goals and tasks.
6. Managers approve, adapt, and communicate plans; employees execute via gamified dashboard.
7. Analytics surface progress, wellbeing, and strategic strength for continuous iteration.

## Current Architecture Snapshot (Codebase)
- **Services:** Main API (Express), IAM, Assessment, Planner, Scoring, Observer, Tracking engines (Node). Shared models in `server/models`.
- **Config:** Centralised through `server/config`, environment-driven, pending JWT harmonisation.
- **Persistence:** MongoDB primary datastore; Redis optional cache.
- **Frontend:** Tailwind-based static mockups transitioning to React/Vite (client folder). Unified design variants in `Karvia_OKR_Mockups/unified_design/` inform UI implementation.
- **Deployment:** Docker Compose + Dockerfiles (`Dockerfile`, `Dockerfile.engines`), K8s manifests under `kubernetes/` (needs validation).
- **Technical risks:** Hard-coded secrets, service discovery gaps, cascade endpoint mismatches (see `docs/code-review/release-2024-09-27.md`).

## Target Personas & Journeys
| Persona | Goals | Primary Surfaces |
| --- | --- | --- |
| Consultant / Business Owner | Configure values, run assessments, monitor ROI | Unified manager dashboard, analytics, configuration UI |
| Department Manager | Motivate teams, approve plans, resolve friction | Manager dashboard (`unified_design/manager/dashboard.html`), team view, planning cockpit |
| Employee | Understand objectives, execute tasks, earn recognition | Employee dashboard, gamified execution view |
| Admin | Provision tenants, manage roles, monitor system health | Admin console, IAM controls |

## Unified Design Mapping (Manager Mockups)
- **Dashboard:** Daily action stack, high-level KPIs, sentiment prompts.
- **Planning:** AI-generated task approvals, conflict cues, bulk actions (documented gaps for improvement).
- **Team:** Wellbeing metrics, shared objectives, recognition triggers.
- **Objectives & Assessment:** Visual cascade, assessment completions linking back to S/S/I scores.
Insights from UI critiques (`docs/code-review/uidesign reveiew`) inform backlog items (action stack, wellbeing badges, conflict assistant).

## Beta 1.0 Scope & Deliverables (8-Week Program)
**Deliverable 1 – Assessment Foundation (Weeks 1-2)**
- Multi-level value configuration (org/team/individual weightings, inheritance engine).
- Assessment builder with seed templates (100+ service-industry questions).
- Response capture + validation; scoring pipeline implementing 50/30/20 blending.
- Output: Consultants create assessments, gather responses, view baseline S/S/I.

**Deliverable 2 – Planning & Objectives (Weeks 3-4)**
- Gap analysis dashboard (highlight improvement areas per level).
- Objective suggestion engine (rule-based) seeded with playbooks.
- OKR hierarchy: annual → quarterly → weekly goals; task templates.
- Executive approval workflow (lightweight) for proposed plans.
- Output: Full assessment-to-plan demonstrable path with baseline recommendations.

**Deliverable 3 – Gamified Execution (Weeks 5-6)**
- Employee task dashboard (progress, streaks, recognition hooks) informed by manager mockups.
- Team leaderboards & visualisations aligning with S/S/I metrics.
- Task completion/validation, micro-celebrations, mobile-responsive layout.
- Output: Employees experience engaging daily workflow tied to objectives.

**Deliverable 4 – Analytics & Reporting (Weeks 7-8)**
- Real-time dashboards across org/team/individual levels with values overlay.
- Trend charts (progress velocity, sentiment, recognition cadence).
- Export / shareable reports for consultants/business owners.
- Output: End-to-end demo with realistic data loops.

## Sprint Alignment
- Sprints follow the plan in `Karvia_OKR_Product_Planning/sprint_plan.md` (2-week cadence).
- Each deliverable spans roughly one sprint; cross-functional squads (Platform, Experience, Intelligence) align backlog items accordingly.
- Definition of Done emphasises explainability, accessibility, and telemetry.

## Key Backlog Themes (Beta)
1. **Technical Hardening:** JWT secret unification, service discovery integration, Docker/K8s health checks, cascade endpoint parity.
2. **Assessment Engine:** Config UI, template bank, scoring microservice enhancements, data model adjustments.
3. **Manager Experience:** Action stacks, wellbeing badges, conflict assistant, contextual quick actions.
4. **AI Planning Enhancements:** Priority queue, explainable cards, revision request flow, conflict detection.
5. **Gamification Layer:** Task streaks, recognition prompts, leaderboard logic with configurable rules.
6. **Analytics Foundation:** Multi-level dashboards, S/S/I overlays, export pipeline, sentiment trend visuals.

## Dependencies & Integrations
- Synthetic sentiment data until real integrations delivered (Slack/Teams planned for Release 2).
- BRAMHI/AI engines for code assistance kept out of production artefacts.
- Future connectors (calendar, messaging) scoped but not in Beta MVP.

## Success Metrics for Beta
- **Adoption:** ≥80% of pilot teams complete assessments and approve first plan.
- **Time Efficiency:** Managers achieve daily planning tasks within 3-step assistant flow.
- **AI Trust:** ≥70% of AI recommendations accepted or slightly edited (tracked via planner logs).
- **Engagement:** ≥60% weekly active employees in gamified dashboard.
- **Sentiment Coverage:** Pulse check participation from ≥75% of teams (using mock pipeline initially).

## Risks & Mitigations
- **Technical debt:** unresolved infrastructure issues delay release → Prioritise Platform squad tasks Sprint 24.09.
- **Design debt:** mockups require adjustments for cognitive load → Use uidesign review notes as acceptance criteria.
- **Data realism:** Without real sentiment inputs, pilot value may appear superficial → Build sample dataset and clearly communicate roadmap to actual integrations.
- **Change management:** Consultants need enablement → Produce onboarding playbooks alongside product work.

## Governance & Communication
- Weekly vendor sync referencing this doc for sprint scope validation.
- Roadmap updates tracked alongside `product_roadmap.md`; variances logged in sprint demos.
- All teams log status to shared dashboard referencing success metrics above.

## Next Actions
1. Finalise sprint backlog for Deliverable 1 with engineering leads.
2. Validate assessment templates with consulting SME/vender.
3. Refine manager action stack mockups to align with empathy-driven requirements.
4. Prepare pilot customer enablement plan (trainings, success metrics).
