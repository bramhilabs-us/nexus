# Nov 30 MVP Release – Cross-Artifact Review

## 1. Scope Consistency
- `MVP_STRATEGY_FINAL.md:24` expects a new `@karvia/shared-models` package and Week 0 migration, but no repo tooling or CI updates exist to build/publish it. Add explicit tasks for workspace setup, package publishing, and engine dependency updates before sprinting.
- `MASTER_KARVIA_BUSINESS_DEV_LIST.md:20` loads Sprint 1 with template builders, formula editors, and multi-template support that the MVP strategy explicitly defers. Tag those items as Beta or move them to the backlog to avoid scope creep.
- User stories continue to call for sentiment blends, scenario planning, and configurable guardrails (`docs/Karvia_OKR_User_Stories.md:26`, `docs/Karvia_OKR_User_Stories.md:77`). Flag MVP-only acceptance criteria so teams do not overbuild beyond the locked scope.
- The “Karvia without iBrain” requirement is not captured anywhere. Introduce an acceptance criterion for an admin-level toggle that disables agent webhooks, event-bus connections, and other optional engines.

## 2. Mockup Alignment
- Manager dashboard mockups depend on wellbeing signals, AI chat, and performance confidence (`Karvia_OKR_Mockups/unified_design/manager/dashboard.html:150-400`). MVP API work only covers OKR cascade and task CRUD; sentiment, AI chatting, and recognition metrics should be hidden or stubbed for launch.
- Manager planning screen showcases approval queues, bulk AI revisions, and learning summaries (`Karvia_OKR_Mockups/unified_design/manager/planning.html:200-392`). MVP specs do not supply data feeds or endpoints for those widgets; revise the mockups or document staged rollouts so devs can deliver a simplified version first.
- Employee daily view assumes sentiment scoring, velocity projections, and AI tips (`Karvia_OKR_Mockups/unified_design/employee/dashboard.html:150-315`). MVP back end does not produce those signals; replace with core task information or postpone until the analytics engines mature.
- Navigation across the mockups references Analytics and Planning pages for all roles. Lock down role-based visibility so MVP only renders the committed 15 screens and hides non-functional sections.

## 3. Operational Readiness
- Docker Compose still makes Redis/OpenAI mandatory (`MVP_STRATEGY_FINAL.md:400`). Provide a configuration path where a standalone Karvia tenant can operate with OpenAI disabled (template fallback only) and event bus/iBrain engines removed.
- Invitation service relies on outbound email but no mailer configuration or failure fallback is defined (`MVP_STRATEGY_FINAL.md:680`). Document manual provisioning steps so onboarding does not block beta go-live.
- Current plan reorganises engines around NATS in Beta, but MVP still has direct model imports. Ensure Week 0 migration tickets include refactoring tracking engine hooks (`engines/tracking/services/AgentIntegrationService.js:19`) so they honour the standalone toggle.

## 4. Recommended Actions Before Sprint Planning
1. Update the master dev list to mirror the locked MVP feature table and mark Beta items explicitly.
2. Produce trimmed MVP mockups (or annotations) that remove sentiment/AI widgets and clarify future placeholders.
3. Add a “Standalone vs iBrain” section to the MVP strategy outlining the admin toggle behaviour, default configurations, and deployment modes.
4. Inject workspace/package setup stories and CI tasks so Week 0 migration is actionable, not aspirational.
