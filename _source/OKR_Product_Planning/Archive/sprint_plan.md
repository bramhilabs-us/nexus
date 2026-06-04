# Karvia OKR Sprint Plan

## Cadence
- **Sprint length:** 2 weeks
- **Ceremonies:** Kickoff (Monday), Mid-sprint sync (Thursday Week 1), Demo & Retro (Friday Week 2)
- **Teams:** Platform (backend/services), Experience (frontend/UX), Intelligence (AI & analytics)

## Upcoming Sprint (Sprint 24.09)
**Goal:** Ship critical fixes for Sep 27 release and lay groundwork for empathy-driven manager flows.

### Sprint Backlog (Draft)
| Item | Squad | Est. | Notes |
| --- | --- | --- | --- |
| JWT secret harmonisation across services | Platform | 3d | Blocker from code review. |
| Docker Compose configuration fixes & health checks | Platform | 2d | Ensure engines accessible. |
| Cascade planner endpoint parity | Platform | 3d | Align cascade-engine with planner API. |
| Manager action stack prototypes | Experience | 5d | Implement for dashboard & planning screens. |
| Wellbeing badges in team view | Experience | 3d | Integrate sentiment, workload placeholders. |
| AI planning copy & explainability improvements | Intelligence | 4d | Collapsible reasoning, priority stack.
| Sentiment data pipeline stub | Intelligence | 4d | Capture mock data for UI integration.

### Definition of Done
- Feature passes automated tests & peer review
- Updated mockups/docs reflect changes
- Telemetry/logging configured
- Accessibility checklist cleared (contrast, labels, keyboard navigation)

## Future Sprint Themes
1. **24.10:** Recognition workflow, conflict assistant, mobile responsive redesign.
2. **24.11:** Scenario planning for execs, integration connectors (Slack/Teams), configuration UI.

## Dependencies & Risks
- Outstanding infrastructure fixes could slip sprint commitments.
- Sentiment data availability affects wellbeing features; need synthetic dataset if real signals absent.
- Coordination with design team to finalise action stack layouts before sprint start.

## Metrics to Track
- Cycle time per squad
- AI recommendation approval rate vs manual overrides
- Manager satisfaction (survey) post-release
- Sentiment coverage (% of teams with weekly pulse data)
