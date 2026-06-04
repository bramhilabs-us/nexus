# Architecture Review – Detailed

## Observations
- `engines/*` still require `../../server/models/*`, contradicting every planning doc that cites an `@karvia/shared-models` package. No workspace config or package directory exists; Week 0 tasks are the first to acknowledge the gap.
- Planner, tracking, and assessment engines all depend on Goal/Task models that do not exist. Result: any progress logic described in docs cannot be executed or tested.
- Feature toggles (`server/services/feature-flags.js`, `engines/planner/config/ai-config.js`, etc.) are referenced across Week 0 plans and MVP strategy, yet no files exist. Engines continue to assume Redis and OpenAI are present.
- The API server registers routes for `goals`, `tasks`, `assessments`, `analytics`, and `cascade`, but only `goals`/`tasks` exist—and each returns a static “ready” string. No auth middleware is wired into those routes, so the microservice boundaries are meaningless today.
- Service discovery is invoked in `server/index.js`, but the docs never describe how discovery works (consul? static config?). Without documentation, ops cannot validate or troubleshoot deployments.
- Logging/telemetry plans call for Winston across services, yet there is no shared logging config or transport. Engines instantiate their own loggers inconsistently.
- Docker assets presume all engines are production-ready; in reality they can’t boot because they require missing models or feature flags, and compose lacks healthchecks referenced in sprint backlog.

## Consequences
1. **Schema drift & coupling:** Any change in `server/models` instantly breaks engines. Independent scaling, versioning, or third-party deployment is currently impossible.
2. **Testing paralysis:** Integration tests for cascade flows are blocked. End-to-end validation in Week 5 (“Assessment → OKR → Goal → Task”) cannot start until fundamental models land.
3. **Deployment fragility:** Docker compose advertising optional Redis/OpenAI is misleading; without toggles, services crash on boot when env vars are absent.
4. **Security blind spots:** IAM engine exports JWTs, yet there is no documented or implemented service-to-service auth. Downstream engines might trust any request routed through the API without revalidation.

## Immediate Fix List
1. Deliver the shared-models workspace in Week 0, including Goal, Task, Invitation, Assessment history models, and publish a local version consumed by engines and server.
2. Implement minimal feature flag scaffolding (`config/flags.json` + helper) and retrofit engines to guard optional dependencies. Provide default fallbacks for Redis/OpenAI to satisfy the “standalone” claim.
3. Flesh out `goals` and `tasks` routes with real CRUD, validation, auth middleware, and objective back-propagation logic. Until then tracking/scoring engines will remain theoretical.
4. Document service discovery and inter-service auth: specify how engines register, what tokens they accept, and how health checks propagate.
5. Align Docker compose files with reality: disable engines that cannot run yet, add todo markers for health checks, and ensure bootstrap logs flag missing prerequisites clearly.

## Questions to Resolve
1. Who owns the shared models package versioning, and how will breaking changes be communicated across services?
2. Are we committed to MongoDB models everywhere, or should engines expose HTTP/GraphQL APIs instead of importing schemas directly?
3. What is the long-term plan for the frontend? If React is still the target, when does the migration occur and how does that impact API design?
4. How will telemetry/logging be standardised across engines? Is there a central log aggregator in the deployment plan?
