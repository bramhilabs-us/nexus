# MVP Strategy Review (Version 2.0 – Oct 1, 2025)

## Alignment Snapshot
- ✅ Six-engine footprint is present, but engines currently rely on shared models within this repo (e.g., `engines/assessment/index.js:21`, `engines/planner/index.js:26`, `engines/iam/index.js:24`). This undermines the goal of treating engines as externally pluggable iBrain integrations.
- ✅ Assessment → planning flow works at a templated level (`server/routes/assessments.js:46`, `server/routes/objectives.js:46`), yet core cascade layers (Goals/Tasks) remain stubs.
- ⚠️ OpenAI differentiator is still aspirational; planner engine ships static templates only (`engines/planner/index.js:200`).

## Critical Risks & Gaps
1. **Objective → Goal → Task Cascade Not Implemented**  
   - `server/routes/goals.js:1` and `server/routes/tasks.js:1` return placeholders.  
   - No shared `Goal`/`Task` schema exists in `server/models/`. Tracking engine defines its own divergent models (`engines/tracking/models/Task.js:1`), risking double writes once REST endpoints go live.  
   - MVP schedule assumes a single implementation sprint for cascade completion, but it still requires data modelling, auth, and integration tests across main API + engines.

2. **Engine Isolation Breach**  
   - Engines import server models directly (e.g., `engines/assessment/index.js:21`, `engines/iam/index.js:24`). That creates tight file-system coupling, making it hard to deploy engines independently or hand them off to iBrain.  
   - Scoring engine maintains its own copies of the same models (`engines/scoring/models/Business.js:1`), so schema drift is already a risk.  
   - Recommendation: extract shared schemas and helpers into a versioned package or expose everything via service APIs before MVP code freeze.

3. **Authentication Fragility**  
   - IAM still defaults to hard-coded secrets (`engines/iam/index.js:109`, `engines/iam/index.js:115`), conflicting with API expectations (`server/config/index.js:71`).  
   - Service discovery is not actually used by route proxies (`server/routes/assessments.js:24`), so engine URLs must be injected manually. Compose currently omits them (`docker-compose.yml:12-47`).

4. **Delivery Pipeline Blockers**  
   - `Dockerfile.engines:18` references missing `engines/package*.json`, so engine images do not build.  
   - Startup scripts hang because they `curl` Mongo/Redis URIs (`scripts/start.sh:16`, `scripts/start-engines.sh:13`).  
   - `docker-compose.yml:65` binds a non-existent `scripts/mongo-init.js` file. These issues block the MVP "90% done" deployment narrative.

5. **OpenAI Integration Missing**  
   - Planner engine relies on canned JSON templates, no `openai` client usage (`rg "chat.completions" engines/planner/index.js` returns 0).  
   - Tracking engine still references agent webhooks internally (`engines/tracking/services/AgentIntegrationService.js:19`), but there is no shared OpenAI caching/usage as described in strategy.

6. **Invitation & Role Flows Not Wired**  
   - IAM routes expose standard login/register but there is no invitation or tokenised onboarding implemented yet (`engines/iam/index.js`, search for `invite`).  
   - Manager/employee dashboards under `client/pages/` are static HTML; no React/Vite runtime or data-binding exists to drive the 15 stated MVP screens.

## Recommended Actions (Pre-MVP Lock)
1. Prioritise Goal/Task schema + API completion, including shared validation and engine interactions. Define contract in `server/models/` and mirror to tracking engine via package or API, not copy/paste.
2. Decouple engines from `/server/models` by introducing a `shared` workspace (npm workspace or private package) or HTTP-level contracts. Block further work that doubles down on file imports.
3. Unify auth configuration: mandate `JWT_SECRET`/`JWT_REFRESH_SECRET` envs in compose/k8s manifests; delete default literals; extend config validation to hard fail when secrets absent.
4. Fix deployment tooling before feature work resumes: supply engine URLs via compose, add missing build manifests, replace startup waits, and remove invalid volume mounts.
5. Wire actual OpenAI integration in planner engine behind a feature flag. Add Redis cache via shared client module to avoid duplication when other engines adopt AI calls.
6. Stand up invitation endpoints (token creation, validation, user provisioning) and connect static frontend pages to API responses or the MVP will remain a click-through prototype.

## Questions & Follow-Ups
- Do we expect iBrain to call these engines via HTTP, message bus, or direct DB access? Decision determines how aggressively we must eliminate filesystem coupling.
- What is the minimum viable UI stack? If React/Vite is deferred, document how the static pages will integrate with the API for MVP demos.
- Are agent pipeline hooks (`engines/tracking/services/AgentIntegrationService.js:26`) in scope for MVP? If not, consider feature flagging or moving into the future iBrain-facing repo.
