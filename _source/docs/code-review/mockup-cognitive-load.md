# Karvia Mockup Cognitive Load Review

**Objective:** Evaluate each available mockup for cognitive load, step efficiency, and adherence to UI best practices for SMB users (20–200 employees) across roles. Focus on keeping daily journeys within three meaningful actions while retaining strategic context.

## 01_login.html — Authentication
- **Observation:** Hero messaging and gradient branding communicate value, but secondary copy about AI features competes with the login form. Social proof or brief benefits could be tucked into an optional slide-out instead of the main column.
- **Opportunity:** Surface passwordless and SSO options directly to reduce clicks for time-poor executives; collapse marketing content after first visit.

## 02_assessment.html — Capability Assessment
- **Observation:** Presents all three assessments simultaneously with detailed descriptions, which may intimidate new users. Progress trackers for each assessment are strong, yet the screen feels dense with instructions and timing estimates.
- **Opportunity:** Guide users through a single assessment at a time with progressive disclosure; include a summary banner reminding them why the assessment matters for OKR personalization.

## 03_dashboard_execution.html — Daily Execution Hub
- **Observation:** Provides objective context, task list, AI insights, and progress details on one screen. While comprehensive, simultaneous display of checkpoints, AI notes, and action buttons can overwhelm employees wanting a quick update.
- **Opportunity:** Default to a “Today at a glance” view summarizing top actions, sentiment, and blockers; allow expanding details only when needed. Provide a persistent “Next three steps” card to reinforce the three-action guideline.

## 03_dashboard.html — (Legacy/Alternate Dashboard)
- **Observation:** Slightly different layout from execution dashboard, which risks duplication and cognitive friction if users encounter both versions.
- **Opportunity:** Consolidate dashboards or clearly deprecate older variants to maintain a single mental model.

## 04_objectives.html — OKR Management
- **Observation:** Objective cards feature progress bars, KR lists, and AI alerts, but all objectives are shown in a single large grid. Executives/managers must scan extensively to spot risk.
- **Opportunity:** Introduce priority sorting, risk filters, and condensed cards with expandable detail. Highlight the top three focus objectives and tie them to the user’s role.

## 05_ai_planning.html — AI Planning Wizard
- **Observation:** Multi-step flow with rich data (Speed/Strength/Intelligence, plan suggestions, AI reasoning). The vertical layout demands substantial scrolling and toggling between options.
- **Opportunity:** Convert the wizard into horizontal stepper with sticky context panel summarizing decisions. Use collapsible AI explanations to avoid text fatigue while keeping transparency intact.

## 06_team.html — Team Collaboration
- **Observation:** Page contains team overview, member cards, shared objectives, activity feed, and insights. Although visually appealing, managers must parse multiple columns before acting.
- **Opportunity:** Reorder content into an action-first flow (alerts → suggested conversations → member list). Provide quick filters (e.g., “Needs attention in 3 steps”) and embed AI prompts for empathetic check-ins.

## 07_profile.html — Profile & History
- **Observation:** Displays full assessment history, role info, and shortcuts. Information density is high but mainly read-only, making it a low-frequency page.
- **Opportunity:** Add collapsible history sections and quick-edit modals; highlight time-sensitive tasks like re-verifying strengths when scores age out.

## 08_analytics.html — Executive Analytics
- **Observation:** Packed with metrics, charts, and cards but lacks guided storytelling. Executives must infer meaning across velocity, AI accuracy, alignment, etc., increasing cognitive load.
- **Opportunity:** Provide an AI-generated narrative summary at top with recommended actions. Cluster metrics into “Health”, “Risk”, “Opportunities” sections and offer “simulate scenario” CTAs to reduce scanning.

## 09_admin.html — System Administration
- **Observation:** Includes engine status, user management, logs, and actions in one view. Dense tables and badges can overwhelm unless admin visits frequently.
- **Opportunity:** Separate operational health (real-time) from administrative tasks (user provisioning). Offer default filters like “Needs attention now” and collapse healthy services by default.

## 10_planning.html — Manager Plan Review
- **Observation:** Presents aggregate stats plus per-person cards with AI reasoning. While thorough, approving edits requires scrolling through the entire list.
- **Opportunity:** Add batch approval controls with inline quick actions. Provide timeline filters (Today/Week/Upcoming) and highlight unresolved conflicts first.

## _shared_navigation.html — Navigation Shell
- **Observation:** Relies on Tailwind classes with role-driven visibility toggled via inline styles. Users may see hidden links flash before scripts run, creating momentary confusion.
- **Opportunity:** Server-side render role-appropriate nav or apply CSS classes that prevent layout shift. Keep nav limited to core destinations (max 5) and tuck advanced items under “More”.

## unified_design/ (Role-specific riffs)
- **Observation:** Alternate dashboards reiterate similar components with minor styling tweaks, risking inconsistent patterns if implemented literally.
- **Opportunity:** Align on a single design system variant per role and reuse components to build muscle memory across surfaces.

---

## Cross-Screen Themes
- Many screens mix strategic context, AI guidance, and granular tasks on first load. Consider defaulting to summaries with optional deep dives.
- Reinforce the “three key actions” goal by surfacing an explicit checklist or assistant that keeps users focused daily.
- Allow UI personalization (card density, information grouping) so high-level leaders can stay macro while contributors remain micro-focused.
- Integrate sentiment and sustainability cues into top-level cards to maintain the human-centered promise without extra navigation.

## Next Steps
1. Prototype streamlined versions of dashboard, team, and analytics pages with collapsible detail areas.
2. User-test a “three actions per day” assistant module to validate cognitive load improvements.
3. Harmonize navigation and layout across legacy/new mockups to remove redundant patterns.
