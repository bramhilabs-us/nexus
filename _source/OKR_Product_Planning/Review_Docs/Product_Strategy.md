# Product Strategy Review

## Strengths
- Clear articulation of differentiation between “Karvia Core” and “iBrain Exceptional” helps anchor licensing tiers and value props.
- Persona coverage is broad; strategy aligns business owners, managers, employees, executives, and consultants with consistent pain points (alignment, empathy, predictive insight).
- Success metrics (e.g., planning time <20 minutes, AI recommendation adoption ≥70%) are concrete and measurable if instrumentation lands.

## Issues & Tensions
1. **Timeline vs reality mismatch.** Strategy documents assume Week 0 is complete and engines are decoupled. Audit and codebase show 45–50% MVP completion with missing models, placeholders, and no feature flags. Launching an 8-week MVP in this state is unrealistic.
2. **Over-index on marketing language.** Phrases like “really good” and “exceptional” appear in formal strategy docs, while critical operational details (market focus, pricing, deployment playbook) are thin. For stakeholder trust, strategy should read as an execution plan, not a pitch deck.
3. **Customer segment drift.** Docs oscillate between 20–200 employee SMBs, 50–500 “service businesses,” and external consultants. Strategy lacks prioritisation: Who is the primary buyer? What verticals matter most? Without focus, backlog grooming and GTM will sprawl.
4. **Unproven AI dependencies.** Strategy leans on OpenAI and iBrain features but offers no contingency if LLM access is constrained. There is no evidence of prompt quality, pricing impact, or data privacy controls, yet AI is central to the differentiation story.
5. **Frontend promises unsupported.** The strategy expects a production React client with role dashboards and empathy flows. Repo reality is static HTML prototypes. Without acknowledging this delta, front-end scope is dramatically underestimated.

## Risks
- Stakeholders may believe the platform is nearly market-ready, causing misaligned sales promises or partnership commitments.
- Heavy reliance on proprietary iBrain features without integration detail risks a fractured user experience and uncertain licensing story.
- Lack of go-to-market milestones (pilot recruitment, pricing experiments, compliance gating) could leave the MVP without clear success criteria post-launch.

## Recommendations
1. Publish a revised strategy addendum grounded in the Jan 13, 2025 audit: reset the MVP timeline, explicitly map Week 0 debt, and adjust launch narratives.
2. Define the primary customer segment and funnel (e.g., “service SMBs 50–250 employees led by consultant partners”) and ensure roadmap themes serve that persona first.
3. Introduce AI adoption contingencies: document template-only value proposition, cost modelling for OpenAI usage, and privacy posture.
4. Align with design/product on the true frontend plan—either recommit to React with resourcing or position the current HTML stack as an interim step.
5. Expand the success metrics section with GTM checkpoints (pilot conversions, NPS targets, retention goals) so the organisation knows when to pivot or double down.
