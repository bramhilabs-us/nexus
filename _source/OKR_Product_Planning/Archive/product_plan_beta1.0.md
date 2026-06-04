# Karvia OKR Product Plan — Beta 1.0 (8 Weeks)

**Purpose:** Playbook for engineering, design, data, and vendor teams delivering the Beta 1.0 release. It defines scope, user stories, acceptance criteria, technical requirements, sprint breakdown, and references. Treat this as the entry point—every work item links from here.

---

## 1. Release Goals & Success Metrics
- Deliver assessment → planning → execution → analytics flow for SMB clients (20–200 employees).
- Embed empathy-first interactions: three-step workflow, wellbeing signals, recognition prompts.
- Ensure technical foundation is scalable, configurable, and free of hard-coded values.

**Success Metrics**
- ≥80% pilot teams complete assessments & approve first plan.
- Managers finish daily planning loop in ≤3 guided steps.
- ≥60% weekly active employees in execution dashboard.
- ≥70% AI recommendations accepted/edited (planner logs).
- Sentiment responses from ≥75% pilot teams (synthetic dataset in Beta).

---

## 2. Scope Summary (Deliverables)
| Deliverable | Weeks | Scope |
| --- | --- | --- |
| D1 Assessment Foundation | 1–2 | Value configuration, multi-level assessments, scoring & baseline reports |
| D2 Planning & Objectives | 3–4 | Gap analysis, objective engine, OKR hierarchy, approvals, manager action stack |
| D3 Gamified Execution | 5–6 | Employee dashboard, gamification, recognition prompts, mobile responsiveness |
| D4 Analytics & Reporting | 7–8 | Multi-level dashboards, trends, narrative summaries, exports |

**Out of Scope (Beta):** Real-time integrations (Slack/Teams), advanced AI scenario planning, white-label toolkit (planned post-Beta).

---

## 3. Team Structure & Ownership
| Squad | Focus | Tech Stack | Leads |
| --- | --- | --- | --- |
| Platform | Backend, services, infra hardening | Node, Mongo, Redis, Docker/K8s | TBD |
| Experience | Frontend, UX adjustments, empathy flows | React/Vite, Tailwind | TBD |
| Intelligence | AI planning, analytics, data pipelines | Node services, LLMs, analytics stack | TBD |

**RACI summary:**
- Product management (R): scope, priorities
- Engineering leads (A): delivery & quality
- Design (C): cognitive load alignment per mockup critiques
- Vendor partner (C): domain validation, templates
- QA/DevOps (I/A): release readiness

---

## 4. Sprint Breakdown & Objectives
Each sprint is 2 weeks. See `sprint_plan.md` for ceremonies and DoD.

### Sprint 24.09 (Weeks 1–2) — Assessment Foundation + Technical Hardening
**Objectives**
- Stabilise infrastructure (JWT, discovery, compose fixes).
- Deliver value model config, assessment builder MVP, scoring pipeline.
- Prepare sentiment mock data pipeline for future features.

**Key User Stories**
1. *As a consultant,* I configure organisational Speed/Strength/Intelligence weightings so assessments reflect client priorities.
2. *As a consultant,* I clone and customise assessment templates for service industries.
3. *As an employee,* I complete the assessment across devices with saved progress.
4. *As a platform engineer,* I need consistent JWT secrets and service discovery to ensure secure microservice comms.

**Acceptance Criteria & Tasks**
- Value config API with CRUD, validation, audit logs. UI matches unified design (link: `unified_design/manager/assessment.html`).
- Assessment template CRUD, versioning, and tagging.
- Response endpoints with validation, rate limiting, accessible form.
- Scoring job implementing 50/30/20 inheritance; results stored & exposed.
- Technical tasks: JWT harmonisation, Docker Compose health checks, cascade planner endpoint parity, telemetry baseline.

### Sprint 24.10 (Weeks 3–4) — Planning & Objectives
**Objectives**
- Build gap analysis dashboard and objective suggestion engine (rule-based).
- Implement OKR hierarchy with goal breakdowns and task templates.
- Deliver manager action stack, conflict assistant, wellbeing badges.

**Key User Stories**
1. *As a manager,* I view top improvement gaps with suggested objectives tied to S/S/I deficits.
2. *As an executive,* I approve objectives with visibility into downstream impact.
3. *As a manager,* I receive a three-item action stack summarising today’s priorities within the planning cockpit.
4. *As an employee,* I see how my weekly tasks connect to company objectives.

**Acceptance Criteria & Tasks**
- Gap analysis service consumes scoring outputs, surfaces top gaps with explanation.
- Objective suggestion rules configurable (JSON); UI displays rationale.
- OKR creation flows (annual→quarterly→weekly) with relation to tasks.
- Task templates accessible by role/function.
- Manager planning UI enhancements per critique: action queue, conflict detection, wellbeing/capacity indicators.
- Approval workflow endpoints (submit, approve, comment) with notifications.

### Sprint 24.11 (Weeks 5–6) — Gamified Execution
**Objectives**
- Build employee dashboard with three-step assistant and task list.
- Implement gamification (streaks, badges) and recognition prompts.
- Ensure responsive design and wellbeing cues in execution view.

**Key User Stories**
1. *As an employee,* I get a daily assistant listing top three actions, recognition, and blockers.
2. *As a manager,* I can recognise achievements and spot burnout risk from team dashboards.
3. *As a consultant,* I monitor team engagement via leaderboards tied to objectives.

**Acceptance Criteria & Tasks**
- Dashboard displays tasks with context chain, AI guidance, and wellbeing indicators.
- Gamification service tracks streaks, awards badges, triggers celebrations.
- Recognition prompts triggered by milestones; logs stored for analytics.
- Responsive breakpoints tested across devices; accessibility validated.
- Telemetry capturing task completion rates, streak drops, recognition usage.

### Sprint 25.01 (Weeks 7–8) — Analytics & Reporting + Beta Wrap
**Objectives**
- Deliver multi-level dashboards, trend analytics, narrative summaries, exports.
- Finalise QA, performance tuning, pilot enablement.

**Key User Stories**
1. *As an executive,* I read a weekly narrative summarising S/S/I, progress, and risk.
2. *As a consultant,* I export reports demonstrating improvement to clients.
3. *As an admin,* I rely on system health metrics ensuring stable deployment.

**Acceptance Criteria & Tasks**
- Dashboards for org/team/individual with filters and S/S/I overlays.
- Trend charts (progress velocity, sentiment coverage, recognition cadence).
- AI-generated narrative (MVP) with manual override.
- PDF/CSV reporting engine with role-based access.
- Observability: metrics dashboards (Prometheus/Grafana), alerts configured.
- Release QA checklist (load testing, security review, accessibility audit).

---

## 5. Master User Story Catalogue (Beta Scope)
1. **Value Configuration & Assessments**
   - Configure S/S/I weights; create value definitions (with range checks).
   - Manage assessment templates, question bank tagging, versioning.
   - Launch assessments with status tracking, notifications, deadlines.
   - Submit responses; auto-save progress; accessible components.
   - Review composite S/S/I scores (org/team/individual) with inheritance breakdown.

2. **Planning & Objectives**
   - View gap analysis with ranked improvement areas and rationales.
   - Generate objectives via rules; edit and assign departments.
   - Build OKR hierarchy; link objectives→KRs→goals→tasks.
   - Approve objectives/goals; comment and request revisions.
   - Manager action stack summarises daily/weekly priorities.
   - Conflict assistant surfaces resource overload, dependency clashes, sentiment warnings.

3. **Execution & Gamification**
   - Employee dashboard shows top three actions, wellbeing prompts, recognition cues.
   - Task completion flow with comments, attachments, and AI suggestions.
   - Streak tracking, badge awards, feed of celebrations.
   - Recognition prompts (manager/peer) with quick actions.
   - Team leaderboard with S/S/I contribution metrics.

4. **Analytics & Reporting**
   - Executive dashboard with S/S/I trends, risk alerts, scenario toggles (basic).
   - Team analytics including velocity, alignment, wellbeing scores.
   - Individual growth tracking (progress vs strengths).
   - Reporting (PDF/CSV) with branded templates and narrative summary.
   - Data export API for consultants (limited to pilot clients).

5. **Technical & Cross-Cutting**
   - JWT secret and refresh token alignment across services.
   - Service discovery integration (health checks, retries).
   - Container startup scripts using proper dependency checks.
   - Structured logging, metrics instrumentation, audit trails.
   - Synthetic sentiment dataset generator feeding wellbeing components.
   - Accessibility compliance (WCAG 2.1 AA) across all UI modules.

---

## 6. Technical Specifications & References
| Domain | Spec Highlights | Source |
| --- | --- | --- |
| Config & Scoring | Value model JSON schema, inheritance formula (50/30/20) | `server/models/Business.js`, `product_roadmap_detailed.md` |
| Assessments | API contract (create/clone/deploy), response payloads | `docs/MASTER_IMPLEMENTATION_GUIDE.md`, `server/routes/assessments.js` |
| Planning | Gap analysis service contract, objective schema, rules config | `product_roadmap_detailed.md`, `karvia_business/server/services/cascade-engine.js` |
| Manager UI | Action stack, conflict assistant, wellbeing badges | `Karvia_OKR_Mockups/unified_design/manager/planning.html`, `docs/code-review/uidesign reveiew/manager-planning-screen.md` |
| Execution UI | Daily assistant, gamification rules, recognition prompts | `Karvia_OKR_Mockups/unified_design/manager/dashboard.html`, `team.html`, `docs/code-review/uidesign reveiew/manager-team-screen.md` |
| Analytics | Dashboard layouts, narrative components | `product_overview.md`, `Karvia_OKR_Mockups/08_analytics.html` |
| Infrastructure | JWT harmonisation, docker health checks, telemetry setup | `docs/code-review/release-2024-09-27.md`, `Dockerfile*`, `scripts/start*.sh` |

**Data Contracts to Define**
- Assessment results → gap analysis service
- Gap analysis → objective suggestion engine
- Planning → execution (tasks, recognition triggers)
- Execution → analytics (progress, recognition, sentiment)

---

## 7. Definition of Done (Beta)
- Acceptance criteria satisfied with linked test cases (unit, integration, end-to-end).
- Accessibility checklist complete; automated axe tests passing.
- Telemetry dashboards updated with new metrics.
- Documentation updated (`product_overview.md`, API docs, user guides).
- Code reviewed, gated CI passing, deployable through staging pipeline.
- Pilot enablement materials prepared (playbooks, data interpretation guide).

---

## 8. Risk Register & Mitigations
| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Infra hardening delays assessment delivery | High | Medium | Front-load Platform tasks in Sprint 24.09, daily sync on blockers. |
| Cognitive load persists post-implementation | Medium | Medium | Design QA against uidesign critique checklists before acceptance. |
| Lack of real sentiment data reduces perceived value | Medium | High | Build synthetic dataset & roadmap real integrations in Release 1.1. |
| Scope creep from vendor feedback | Medium | Medium | Use this plan as change control baseline; evaluate additions post-Beta. |

---

## 9. How to Use This Document
1. Start here to understand Beta scope, sprints, and stories.
2. For feature details, follow links to roadmap, mockups, code review docs.
3. Create sprint backlog items by referencing section 5 user stories and acceptance criteria.
4. Update this document when scope changes; log revisions in change log below.
5. Use DoD and risk register as readiness checkpoints in demos and retros.

---

## 10. Change Log
| Date | Change | Author |
| --- | --- | --- |
| 2024-09-XX | Initial Beta 1.0 product plan | Codex (GPT-5) |
