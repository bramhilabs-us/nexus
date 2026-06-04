# Architecture Review – High Level

## Snapshot
- Documentation paints a polished microservice ecosystem (six engines + shared models + feature flags), but the repo still runs with placeholder routes and tight coupling to `server/models`. The promised independence and production readiness are aspirational, not current.
- Tiered product framing (Core / AI / iBrain) is clear, yet dependencies and degradation behaviours are not backed by working code or configuration. There is no feature-flag infrastructure or fallback service implemented.
- Frontend state is misrepresented. Planning docs declare a React application, while the repo ships static HTML prototypes. This misalignment cascades into deployment, testing, and resourcing assumptions.

## Strengths
1. Microservice boundaries are thoughtfully segmented around IAM, assessment, planning, scoring, observer, and tracking concerns—good for parallel work and scaling once foundational pieces exist.
2. Tiered capability model (Core → AI → iBrain) is a useful mental model for packaging and licensing decisions.
3. Week 0 plan squarely targets the highest architectural risks (shared models, missing schemas, feature toggles), signalling awareness of blockers.

## Critical Gaps
1. **Shared models package is theoretical.** All engines still import `../../server/models/*`. Without the workspace package, engines cannot be deployed independently and any schema change risks drift.
2. **Feature flagging & fallbacks are unimplemented.** Docs reference Redis/OpenAI/iBrain toggles, but there is no `feature-flags` service or config. Hard dependencies remain littered through engines and server.
3. **Service communication is hand-waved.** There is no concrete description of auth between services, rate limiting, or failure handling in the microservice diagrams—only references to “service discovery”.
4. **Readiness overstated.** Master guides claim 90%+ completion while audits show 45–50%. Architecture decisions assume later-stage maturity (e.g., white-label deployment) without having core models running.
5. **Frontend architecture missing.** React build, shared components, and state management are referenced, yet the repo holds static HTML with inline scripts. This undercuts the “API-first + React client” architecture story.

## Risks
- Continuing to plan around the fictional shared package and React app introduces budgeting and scheduling surprises once implementation starts.
- Without feature toggles, “Tier 2/3” degradations will fail hard, undermining the promised standalone operability.
- Microservices will remain tightly bound to the monolith server unless the shared-model refactor and clear API contracts land in Week 0. If Week 0 slips, subsequent sprints inherit architectural debt.

## Recommendations
1. Freeze additional architecture commitments until Week 0 delivers the shared-model workspace, feature flag scaffold, and working Goal/Task APIs.
2. Produce an updated system diagram grounded in current reality: note actual data stores, inter-service auth, and dependencies. Use it to validate deployment steps and align engine responsibilities.
3. Update planning docs to reflect the true frontend state and decide whether to invest in React conversion now or explicitly defer to Beta.
4. Define concrete service-to-service contracts (auth method, health endpoints, failure modes) before expanding engine scope.
5. Introduce an architectural runway checklist for each sprint (e.g., “no new engine deployment until shared package published”) so product commitments respect technical readiness.
