# Karvia OKR Strategy – Overall Architecture & Risk Review

## Architectural Observations
- Six-engine model is documented as the core runtime (`README.md:38`) and echoed in product philosophy, yet engines mix shared code and bespoke schemas. This conflicts with the desire to keep them “as separate external integrations with iBrain”.
- Planner/Assessment/IAM engines read models directly from `/server/models` while Scoring/Tracking duplicate schemas locally. Divergent approaches will fragment data once services run outside the monorepo boundary.
- Service discovery exists but is not wired into actual routing (`server/services/discovery.js`, `server/routes/*`), so environment variables must remain perfectly aligned across deployments.
- Frontend remains a static mockup set (`client/pages/*.html`) with no client runtime; delivering empathy-first workflows will require binding these pages to engine APIs or standing up a React build.

## Systemic Risks
1. **Repo Coupling vs Externalisation Goal**  
   Keeping engines in this repository while importing shared models binds their lifecycle to the monolith. iBrain cannot integrate or upgrade them independently until contracts are extracted.

2. **Data Contract Drift**  
   Multiple definitions of objectives/goals/tasks exist (server, tracking engine, cascade services). Without a canonical schema, analytics and AI features risk consuming inconsistent fields.

3. **Operational Fragility**  
   Deployment gaps (Dockerfile, Compose envs, startup scripts) prevent automated delivery; Beta roadmap assumes continuous deployment to pilot clients.

4. **Security Baseline**  
   Hard-coded credentials (`docker-compose.yml:67`, `engines/iam/index.js:109`) and stub endpoints returning demo data (`server/routes/businesses.js:4`) undermine readiness for external pilots.

5. **AI/Agent Integration Ambiguity**  
   Tracking engine already embeds agent pipeline logic (`engines/tracking/services/AgentIntegrationService.js:26`), but product docs position iBrain as an external orchestrator. Need a clear boundary to avoid double ownership of agent workflows.

6. **Roadmap Scope vs Capacity**  
   MVP, Beta, and future releases stack significant net-new capabilities (template marketplace, predictive analytics, mobile). Without staged technical hardening, teams will chase features while infrastructure debt blocks deployment.

## Recommended Strategic Moves
1. **Establish Contracts First**  
   Publish API/data contracts for objectives, goals, tasks, assessments, health metrics. Use the new `Review Docs` space to track decisions and handoff guidelines for iBrain teams.

2. **Create Shared Packages**  
   Convert `/server/models` into a versioned package consumed by engines (or expose REST endpoints). This lets engines live in separate repos while still sharing schema definitions.

3. **Refactor Deployment Tooling**  
   Fix Docker/Compose/K8s configs now; integrate discovery outputs; add health checks; document secret management. Treat this as a prerequisite for Beta planning.

4. **Decide Agent Boundary**  
   Either move agent message bus + pipeline handlers into an iBrain-owned integration layer or formalise them as part of the tracking engine. Document the ownership decision in product philosophy.

5. **Prioritise Security & Compliance**  
   Remove default credentials, enforce secret injection, add audit logging hooks (scoped in `docs/code-review/release-2024-09-27.md:7`).

6. **Align Roadmap with Capacity**  
   Revisit Beta phases once MVP blockers are resolved. Consider splitting integrations, collaboration, and analytics into separate optional modules that iBrain can host.

## Open Questions
- What is the target packaging/distribution model for the six engines when deployed alongside iBrain—Docker images, npm packages, or Helm charts?
- Should sentiment analytics and predictive models live inside scoring engine or be delivered by iBrain as a managed AI service?
- How will frontend experiences consume engines once they are external? Decide between BFF (backend-for-frontend) inside main API or direct engine calls.
