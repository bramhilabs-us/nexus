# SSI Assessment Experience – Recommendations for Service-Sector SMBs

## Current State Review
- `Karvia_OKR_Mockups/MVP_Nov30Rel/ASSESSMENT_FLOW_COMPLETE.md:20` outlines the seven-step flow but relies on a single 47-question template and assumes fixed inheritance rules (80% completion, 40/30/20/10 weighting). Template creation is deferred, leaving consultants without tooling to tailor assessments by sector or geography.
- `Karvia_OKR_Mockups/MVP_Nov30Rel/ADMIN_ASSESSMENT_TEMPLATE_CREATOR_DESIGN.md:1` proposes a comprehensive builder (sub-dimensions, weighted questions) yet remains aspirational—no MVP UI or data model supports the described taxonomy, role targeting, or localization toggles.
- Invitation logic in `Karvia_OKR_Mockups/MVP_Nov30Rel/ASSESSMENT_FLOW_COMPLETE.md:200` is manager-centric; consultants/admins lack tenant-wide scheduling, cohort selection (team vs. function vs. geography), or staggered campaigns.
- Result views (`Karvia_OKR_Mockups/MVP_Nov30Rel/ASSESSMENT_FLOW_COMPLETE.md:360`) emphasise individual scores but don’t surface sector or archetype benchmarks that service SMB consultants expect when diagnosing gaps.

## Gaps vs. Consultant/Admin Needs
1. **Template Library by Context**
   - Need pre-built vertical templates (e.g., marketing agencies, IT services, HR outsourcing) and geography variants. Current default template treats all service SMBs uniformly, missing compliance, client lifecycle, or regional labour nuances.
   - Consultants require cloning/branching to adjust weights per engagement; forcing a single master template limits credibility.

2. **Multi-Level Assessment Configuration**
   - Flow describes individual/team/role/manager/org levels, but there’s no UI to map templates to each tier. Managers can invite teams, yet admins can’t roll out organisational assessments or mix cohorts (cross-functional squads, location-based groups).
   - Inheritance rules (40/30/20/10) are hard-coded. Different consultancies might prefer 50/30/20 or emphasise role-level insight depending on maturity.

3. **Question Authoring UX**
   - Proposed builder expects 47 manual entries with weights and sub-dimensions—likely overwhelming. Consultants need question banks, drag-and-drop from curated lists, and the ability to mark “required vs optional” per cohort.
   - No guardrails for scoring distribution—without validation, consultants could skew weights unintentionally.

4. **Invitation & Participation Workflows**
   - Manager-focused invitations don’t cover consultant-run workshops where multiple teams/functions are assessed simultaneously. Missing features: bulk CSV uploads, cohort scheduling, reminders, progress dashboards for consultants.
   - No workflow for re-assessments or recurring pulses (quarterly, monthly). Consultants need to compare baseline vs. follow-up to drive OKR evolution.

5. **Insight Packaging for OKR Creation**
   - Results show individual weak areas, but there’s no aggregate narrative tying gaps to objective suggestions by vertical or geography. Service SMBs often want comparative insights (e.g., “Customer onboarding speed is below industry benchmark—consider objective X”).
   - Need cross-link from aggregated scores to planner engine with context metadata (dimension, sub-dimension, severity) so AI-generated OKRs feel grounded.

## Improvement Recommendations
1. **Assessment Template Taxonomy
   - Seed a library of 3–5 vertical templates (e.g., Professional Services, Managed IT, Creative Agencies) each with Speed/Strength/Intelligence sub-dimensions tuned to service workflows.
   - Introduce metadata fields (`sector`, `geography`, `company_size`) in template schema so consultants filter and clone relevant starting points.
   - Allow consultants/admins to adjust question weights within a resilience window (e.g., 0.5–2.0) while preserving dimension balance checks.

2. **Configurable Multi-Level Rollout
   - Provide a “Deployment Designer” for consultants/admins: select template per level (Individual, Team, Function, Org) and define inheritance weights per engagement.
   - Support cohort definitions (team, department, geography, role) and store them as reusable audience segments.
   - Add scheduling options (launch now, schedule later, recurring cadence) with reminder settings and completion targets.

3. **Authoring & Question Bank Enhancements
   - Build a question catalog with tagging (dimension, sub-dimension, sector, maturity). Consultants pick from catalog or add custom items; system maintains balance counts per dimension.
   - Include preview of respondent experience (mobile/desktop) and estimated completion time as questions are added.
   - Add versioning and audit history so engagements can trace which template iteration was used.

4. **Invitation & Monitoring Tools
   - Expand invitations beyond managers: consultants/admins should launch organisation-wide assessments, invite guest participants (contractors), and monitor completion via dashboards with drill-downs (team, location, role).
   - Automate reminders (email/in-app) based on due date proximity and allow manual nudges. Provide .csv export of completion status for workshop preparation.
   - Capture qualitative feedback (optional comments) to enrich OKR planning and feed recognition/wellbeing cues.

5. **Insight-to-OKR Bridge
   - Aggregate results into sector-aware narratives: compare scores against template benchmarks, highlight top three gaps, and suggest focus areas with dynamic severity tags.
   - Feed the planner engine structured data (dimension, sub-dimension, cohort, benchmark variance) so AI-generated objectives can reference concrete deficiencies (“Intelligence—Customer Insight scored 6.1 vs. industry 7.5”).
   - Enable consultants to annotate results and lock decisions (e.g., “Address Strength – Resilience before next quarter”), ensuring OKR generation respects consultant judgement.

6. **Localization & Accessibility
   - Incorporate language packs (US English default, Spanish optional) and ensure question phrasing adapts to regional vocabulary.
   - Support accessibility (keyboard navigation, screen reader labels) in assessment-taking screens, especially for slider inputs.

## Next Steps
- Align MVP scope: decide which enhancements are essential for the November release (e.g., template metadata, consultant-led invitations) vs. Beta (full builder, benchmarking).
- Update `ASSESSMENT_FLOW_COMPLETE.md` to reflect consultant/admin capabilities, configurable inheritance, and multi-template library usage.
- Produce revised mockups for key screens (template selection, deployment designer, completion dashboard) with simplified MVP variants and future-state notes.
- Coordinate with data/model team to extend assessment schemas, ensuring planner, analytics, and OKR engines can consume the richer assessment context.
