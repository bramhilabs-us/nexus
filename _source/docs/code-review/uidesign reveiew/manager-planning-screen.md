# Planning Screen Critique — Manager Perspective

**Screen:** `Karvia_OKR_Mockups/unified_design/manager/planning.html`  
**Role:** Mid-level manager responsible for planning/approving AI-generated weekly work across functions.

## Intent of the Screen
- Act as the manager’s weekly planning cockpit: review AI proposals, ensure alignment with OKRs, resolve conflicts, and empower teams.
- Support different company scales (20–200 employees) and multiple functional tracks (Sales, Marketing, Product, etc.).

## Immediate Assessment
- The page reads like a dense approval queue rather than a strategic planning hub. Most space is devoted to per-person task cards with repeated structures, requiring detailed scanning before decisions.
- There is no explicit summary of what requires attention. Managers must infer the critical path from scattered badges (“Pending Review”) and the bulk actions block.

## Critical Issues
| Area | Problem | Impact | Suggested Remedy |
| --- | --- | --- | --- |
| Top Context Bar | Shows objective, timeframe, effort and AI confidence, but lacks risk signals (e.g., dependency clashes, over/under-allocation). | High – managers can’t prioritise without understanding what is off-track. | Add alerts (“2 conflicts detected”, “Alex over capacity by 6h”) and a “Today’s Priorities” banner with steps. |
| Per-person sections | Vertical stack for each team member forces repetitive reading; critical insights (burnout risk, sentiment) absent. | High – slows decisions and ignores human factors. | Provide collapsible summaries with wellbeing metrics, highlight only tasks needing approval, and group similar tasks. |
| AI reasoning blocks | Valuable transparency, but verbose paragraphs repeat across cards, increasing cognitive load. | Medium | Collapse into tooltips or expandable accordions; offer bullet-point reasoning with emphasised key metric. |
| Context chain | Good linking to KR/objective, yet static text does not communicate urgency or impact. | Medium | Add impact badges (e.g., “KR slip risk: high”) and completion forecasts to steer decisions. |
| Approve/Edit/Reject buttons | Provide granularity but lack guardrails—no quick reason templates, no ability to request partial adjustments. | Medium | Add inline “suggest revision” prompts, preset feedback chips, and one-click “ask AI to re-plan” per task. |
| Bulk Actions | Positioned after long scroll, meaning managers only discover them after reviewing everything individually. | Medium | Surface bulk summary at top with counts; allow managers to triage from a single panel. |
| Navigation | Includes Dashboard, Objectives, Assessment, Team, Analytics, Planning. A manager in planning mode needs a focused workspace. | Low | Offer a dedicated planning workspace with tabs: “AI proposals”, “Workload view”, “Conflicts”. |

## Cognitive Load & Step Efficiency
- Managers must inspect each user section to determine pending approvals; there is no aggregated “Pending vs Approved” indicator. Daily/weekly planning likely exceeds the desired three-step workflow.
- Repetitive card structures produce scanning fatigue, especially when AI reasoning text looks similar. Managers may default to bulk approval without thorough review, undermining trust.
- Lack of explicit cross-functional views: managers overseeing multiple teams must navigate separate pages; no filter exists for function/department.

## Opportunities to Align with Core Objectives
1. **Priority Stack at Top**: Introduce an action queue summarising items needing attention (e.g., “Approve 2 tasks for Sarah”, “Resolve conflict on Analytics launch”). Include checkboxes to guide progress.
2. **Multi-Level Reference Points**: Show how plan aligns across company levels: highlight top company OKR, department focus, and personal development goals on the header with quick toggles.
3. **Wellbeing & Capacity Signals**: Add icons for sentiment, workload ratio, and recent recognition inside each person’s header to balance productivity with human motivation.
4. **Adaptive Sorting**: Allow managers to sort by urgency, impact, or role. Provide a condensed card view where only pending approvals appear first.
5. **Conflict Resolution Assistant**: Insert a right-side panel listing detected conflicts, dependency overlaps, or skill gaps with suggested solutions (e.g., reassign task, reduce scope).
6. **Micro-interactions for Motivation**: Offer quick actions like “Send appreciation” after approving a high-impact task, supporting intrinsic motivation.
7. **Cross-Functional Tabs**: Provide quick filters (Sales, Marketing, Product) so managers can review per function without endless scrolling.
8. **Timeboxing Guidance**: Present recommended scheduling windows (“Complete approvals by Tuesday 10 AM”) to help managers structure planning sessions.

## Enhancements for Trust & Usability
- **Data Freshness**: Display “Generated 2 hours ago” or “Last revised by AI” to ensure managers trust recommendations.
- **Explainability Depth**: Provide short explanation plus link to deeper reasoning if needed (e.g., “See detailed rationale”).
- **Accessibility**: Ensure all status badges include text and meet contrast ratios; currently badges rely heavily on colour.
- **Mobile Optimisation**: Planning often happens on the go—offer a condensed summary view showing pending approvals, conflicts, and quick approve/reject toggles.

## Proposed Information Architecture
1. **Header:** Strategic overview with performance vs target, conflicts, and backlog health. Primary CTA: “Review Actions”.
2. **Action Queue:** AI curated list of top approvals/adjustments, each expandable for detail.
3. **Team Sections:** Collapsible per-person panels showing capacity, sentiment, pending tasks; approvals inline with quick toggles.
4. **Insights & Learning:** Combined panel summarising AI metric improvements, with prompts for manager feedback loops.
5. **Bulk Controls:** Always visible dock with summary counts and undo/history options.

## Outcome Expectation
Redesigning around guided decisions, human motivation metrics, and cross-company context will transform the screen from an approval form into a strategic planning cockpit, enabling managers to uphold the “three decisive steps” objective while keeping teams inspired and aligned.
