# Karvia OKR Product Roadmap

## Vision
Deliver a human-centered OKR and planning platform that aligns SMB teams (20–200 employees) around sustainable growth, emotional intelligence, and AI-assisted decision-making.

## Guiding Principles
- Dynamic configuration: objectives, values (Speed/Strength/Intelligence), and workflows are data-driven—not hard coded.
- Three-step daily experience: each role can accomplish critical tasks within three meaningful actions.
- Empathy embedded: sentiment, wellbeing, and recognition cues sit alongside productivity metrics.
- Explainable AI: every recommendation surfaces rationale and actionable follow-ups.

## Milestones
| Quarter | Theme | Outcomes |
| --- | --- | --- |
| Q4 2024 | **Foundation & Alignment** | Unified data model for OKRs + S/S/I metrics; role-based dashboards; AI-assisted planning MVP. |
| Q1 2025 | **Collaboration & Motivation** | Sentiment tracking, recognition workflows, manager action stacks, conflict resolution assistant. |
| Q2 2025 | **Adaptive Scaling** | Cross-tenant configuration, white-label toolkit, advanced analytics with scenario planning for executives. |
| Q3 2025 | **Ecosystem & Integrations** | Calendar/Slack integrations, API exposure for partners, marketplace for plan templates. |

## Key Epics (Next 2 Quarters)
1. **Dynamic OKR Engine** – Configurable objectives, cascading logic, health scoring, LLM evaluation pipeline.
2. **Role-Centric UX** – Tailored flows for executives, managers, employees, business owners with three-step assistants.
3. **AI Planning Upgrade** – Task approval cockpit, conflict detection, revision loops, explainability improvements.
4. **Team Wellbeing Layer** – Sentiment ingestion, workload balancing, recognition prompts, psychological safety reporting.
5. **Deployment & Trust** – Production readiness fixes (JWT consistency, service discovery, container health), logging and auditing.

## Release Targets
- **Release 1 (Sep 27, 2024)**: Resolve critical technical blockers, ship manager action stack, basic wellbeing signals, corrected planning cockpit.
- **Release 2 (Nov 2024)**: Launch empathy toolkit (recognition prompts, feedback loops), sentiment-informed dashboards, mobile-optimized experiences.
- **Release 3 (Feb 2025)**: Scenario planning for executives, dependency intelligence, customizable value frameworks.

## Dependencies
- Architecture fixes from `docs/code-review/release-2024-09-27.md`.
- User story alignment `docs/Karvia_OKR_User_Stories.md`.
- Design remediation from `docs/code-review/uidesign reveiew/` notes.

## Open Questions
- What customer segments beyond SMBs require bespoke workflows?
- How will we measure success of empathy-driven features (NPS, retention, sentiment)?
- Which integrations are must-have for Release 2 (Slack, Teams, Google Workspace)?
