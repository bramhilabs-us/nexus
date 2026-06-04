# Team Collaboration Screen Critique — Manager Perspective

**Screen:** `Karvia_OKR_Mockups/unified_design/06_team.html`  
**Primary Role:** Department/Team Manager (20‑200 employee business)

## Immediate Impressions
- The page tries to serve as a command centre but pushes managers to scan four panels, a long member list, two detail sections, and a sidebar before understanding priorities. The absence of a single “do this first” call-to-action forces cognitive triage every visit.
- Visual polish is high, yet the hierarchy treats all data as equally important. Without contextual cues, managers cannot judge which metric demands action, decreasing trust in the UI as an operational cockpit.

## Critical Findings
| Area | Issue | Impact | Suggested Fix |
| --- | --- | --- | --- |
| Primary metrics cards | Raw percentages (78% performance, 85% health) lack targets or thresholds. Manager cannot tell if 78% is acceptable or urgent. | High – delays decision-making and diminishes motivational cues. | Add comparison states (e.g., “78% vs target 70%, +12% MoM”) with clear badges (“On Track”, “Needs Attention”). |
| Motivation enablers | No visibility into recognition cadence, workload balance, or sentiment at the individual level. | High – managers cannot coach or celebrate effectively, risking team morale. | Surface per-person wellbeing meter (sentiment, workload, last recognition) beside progress % and highlight people needing support. |
| Shared objectives | Cards show status, but “At Risk” objective leaves manager guessing next step. | Medium | Pair status badge with prescribed action (e.g., “Schedule sync with 5 contributors” button). |
| Activity feed | Presents chronological events without severity ranking; risk signals (concerns) mixed with routine updates. | Medium – managers waste time scanning, may miss critical alerts. | Promote an “Attention” filter and tag AI-ranked urgency at top of feed. |
| AI insights | Advice is generic (“Consider accelerating…”), lacking owner, timeframe, or tie-in to quick actions. | Medium | Generate specific, personalised prompts (“Assign follow-up to Alex; schedule support call by Friday”). |
| Quick actions | Buttons are detached from the data that should trigger them. | Medium | Contextualise buttons (“Schedule Check-in — Alex raised concern 4h ago”). |
| Navigation for managers | Global nav includes Objectives, Planning, Assessment etc. Without manager-specific labelling, mental load persists. | Low | Collapse non-essential manager links into a secondary menu; spotlight “Team Pulse” as default entry. |
| Accessibility | Heavy reliance on colour (status badges, progress bars) without labels; text in cards occasionally falls below 4.5:1 contrast (e.g., purple on white). | Medium | Add textual status labels and ensure contrast compliance. |

## Cognitive Load Assessment
- **Step Count:** To complete daily essentials (check health, resolve blockers, recognise wins) managers must touch at least five zones: top overview, team members list, shared objectives, activity feed, AI insights. This exceeds the desired “three steps per day” philosophy.
- **Scanning Cost:** Similar card styles and equal-sized typography create “flat” hierarchy. Managers rely on reading each block, increasing time to action.
- **Memory Burden:** The system assumes managers remember context (targets, individual morale, previous actions) because it is not represented in UI.

## What Must Be True for High Performance
1. **Objective Alignment Everywhere:** Every module should show how data ties back to company/quadrant OKRs. Currently only the shared objectives panel hints at this.
2. **Intrinsic Motivation Feed:** Managers need cues that encourage recognition, coaching, and psychological safety. Metrics should go beyond output (progress %) to emotions and behaviour.
3. **Proactive Enablement:** The interface must surface blockers before they become lagging indicators. Present dependency conflicts, overdue check-ins, or skill gaps.
4. **Time Efficiency:** Daily routine distilled into three guided steps with AI summarising context.

## Recommended Redesign Moves
1. **Introduce a “Manager Summary” banner pinning three AI-curated actions** (e.g., “Follow up with Alex on risk”, “Celebrate Sarah’s milestone”, “Rebalance workload for Product Launch”). Include checkboxes so managers feel progress as they complete them.
2. **Augment team member cards with wellbeing metrics:** sentiment trend icon, workload vs capacity gauge, “days since recognition”. Allow sorting by these indicators to quickly spot who needs support.
3. **Transform shared objectives into actionable tiles:** alongside status, show “Owner”, “Next checkpoint”, and a primary button (e.g., “Review blockers”, “Send praise”).
4. **Rework activity feed into stacked alerts:** filter by `Urgent`, `Needs review`, `FYI`. Add AI-assigned severity and automatically expand the most urgent card.
5. **Fuse AI insights + Quick actions:** each insight should display an action button and responsible party (“Schedule sync with product team” linking directly to calendar integration).
6. **Provide comparative benchmarks:** e.g., “Team Health 85% (Company median 78%)”. This helps managers know whether to focus on improvement or celebration.
7. **Floating assistant / checklist:** persistent component summarising remaining steps for the day, aligning with the three-step workflow and reducing scrolling.

## Additional Considerations
- **Mobile Responsiveness:** Key widgets (member list, action stack) should collapse into summaries; ensure the “three steps” assistant is accessible on mobile for managers on the go.
- **Data Freshness Indicators:** show `Updated X minutes ago` to build trust in metrics.
- **Personalisation:** allow managers to pin the metrics most relevant to their team (e.g., customer NPS, backlog size) so the screen reflects their leadership style.

By tightening hierarchy, personalising metrics, and binding insights to immediate actions, this screen can genuinely empower managers to cultivate high-performing, intrinsically motivated teams without cognitive overload.
