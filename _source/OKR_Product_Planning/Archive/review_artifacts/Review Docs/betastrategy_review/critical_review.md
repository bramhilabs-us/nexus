# Beta Release Strategy Review (Version 1.0 – Oct 1, 2025)

## Alignment Snapshot
- ✅ Strategy expands MVP scope across the same six-engine footprint, but several Beta items imply net-new services (template marketplace, collaboration suite) that should remain optional integrations to keep the core light.
- ✅ Existing engines expose some scaffolding for analytics and agent integration (see `engines/scoring/index.js:134`, `engines/tracking/services/AgentIntegrationService.js:13`).
- ⚠️ Many Beta data models (health metrics, prediction tables, custom templates) have no code representation today. Without a shared schema contract, engines will diverge rapidly.

## Critical Risks & Gaps
1. **Assessment Template Expansion vs Current Implementation**  
   - Beta calls for six templates plus a builder and marketplace. Assessment engine still hard-codes one questionnaire (`engines/assessment/index.js:69`).  
   - No repository of JSON templates exists (`server/data/assessment_templates/` absent). UI lacks selector logic. Need a storage strategy that does not bloat the main repo if templates become iBrain-provided assets.

2. **Predictive & Sentiment Analytics Depend on Missing Signals**  
   - Scoring engine references fields that do not exist (`engines/scoring/index.js:182` reads `obj.progress`, yet `server/models/Objective.js:70` stores `progress_percentage`).  
   - Tracking engine is the only component computing task progress, but it writes to its own Mongo DB (`engines/tracking/index.js:113`), disconnected from scoring queries that read `karvia_business`.  
   - Sentiment/pulse data sources are absent; Beta plan assumes ingestion pipelines and historical baselines that are not in scope yet.

3. **Collaboration Features vs Architecture Boundaries**  
   - Beta introduces real-time comments, mentions, and presence tracking. Current stack lacks WebSocket infrastructure; nginx compose config (`docker-compose.yml:86-105`) only proxies HTTP.  
   - Task comments model, activity feed, and notification queues would live best inside tracking engine. Must ensure these stay optional modules exported through message bus for iBrain reuse.

4. **Enterprise & White-Label Enhancements**  
   - Granular permissions and sub-team hierarchies require hierarchical RBAC in IAM. Present implementation stores a single `role` per user (`engines/iam/index.js:24`) and no permission matrix.  
   - White-label advanced features reference deployment scripts in `engines/whitelabel/services/deployment-service.js`, but they expect OpenAI keys inside the same repo (`engines/whitelabel/services/deployment-service.js:564`), conflicting with separation goals.

5. **Automation & Formula Engine**  
   - Beta wants custom score formulas and automations. Current config manager has no plugin system; values are constants in `server/models/Business.js:41`.  
   - Suggest designing formula evaluation as an engine-level callable (possibly hosted within iBrain) rather than embedding expression parsing into the main server.

6. **Operational Tooling Debt Still Outstanding**  
   - Compose, Docker, and secret management issues noted in MVP review remain critical path for Beta deployment as well.  
   - Service discovery remains unused even though Beta leans on dynamic engine availability.

## Recommendations
1. Define cross-engine data contracts (Protobuf/JSON schemas) for assessments, health metrics, and predictions; publish them in a shared `docs/contracts/` folder or private package so iBrain can adopt them independently.
2. Treat sentiment, prediction, and collaboration features as opt-in packages: expose public APIs but keep heavy storage/processing in dedicated engines to honour the “minimum files here” request.
3. Build an engine registry/SDK layer: rather than importing server models, engines should consume versioned REST/GraphQL contracts. Start by rewriting scoring engine queries to call planner/tracking APIs.
4. Introduce event streaming (e.g., NATS, Kafka, or minimal webhook dispatcher) so tracking engine can emit updates that scoring/analytics subscribe to without sharing databases.
5. Harden IAM to support hierarchical roles before layering granular permissions; design permission config as data stored alongside iBrain-managed metadata.
6. Produce a migration plan for existing code to align with Beta phases—document which backlog items move into iBrain-managed space versus core repo responsibilities.

## Questions
- Which Beta features must live in this repo versus being provided by iBrain (e.g., predictive analytics, scenario planning)?  
- Do we need a shared AI orchestration layer, or will each engine integrate with OpenAI individually? Expose decision before adding more API keys to services.
- How will we distribute the new assessment template catalog—via git submodule, CDN, or iBrain-managed store?
