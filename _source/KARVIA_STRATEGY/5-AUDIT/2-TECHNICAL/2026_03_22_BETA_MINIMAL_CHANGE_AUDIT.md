# Beta Audit: Minimal-Change Technical, Product, Strategy, and Business Review

**Date**: March 22, 2026
**Scope**: External audit set in `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL`, current roadmap and strategy docs, and current implementation state
**Mode**: Read-only audit with implementation-aware recommendations
**Primary constraint**: Maximize reuse of existing code and minimize backend/business-logic changes before beta

---

## 1. Executive Verdict

The existing external audit material is directionally strong, especially on:

- prompt consolidation
- guidance blocks
- context maturity
- benchmark source-of-truth
- outcome capture
- consulting-flow validation

However, if applied literally, some of those recommendations would push the product toward **premature backend expansion**.

The better beta path is:

1. Keep the current execution substrate:
   - `Objective`
   - `Key Results`
   - `Goal`
   - `Task`
2. Reposition the experience through:
   - prompt design
   - response contracts
   - frontend language
   - consultant workflow
3. Add backend only where the current system is structurally insufficient.

### Core conclusion

For beta, **Tasks can remain Tasks**.

They do **not** need to become a new `Works` backend model.

The current task system already supports most of the required behavior through:

- `status`: `todo`, `in_progress`, `completed`, `blocked`, `cancelled`, `deferred`
- `task_type`: `action`, `review`, `approval`, `meeting`, `research`, `other`
- `blocked_by.reason`
- comments
- subtasks
- checklist
- tags

That means the beta can express:

- next move
- handoff step
- follow-up
- approval
- blocker
- support request

without introducing a parallel execution model.

The main work before beta is therefore:

- **docs and positioning correction**
- **prompt-layer unification**
- **frontend framing changes**
- **tight consultant workflow**
- **selective data additions only where reporting or evidence truly requires them**

---

## 2. Audit Inputs Reviewed

### External audit set

- `2026_03_08_AUDIT_RESPONSE_AND_INTEGRATION.md`
- `2026_03_08_OPENAI_PERSONAL_GUIDANCE_PROMPT_PACK.md`
- `2026_03_08_SPRINT17_CRITICAL_AUDIT.md`
- `2026_03_08_SPRINT17_DEPENDENCY_IMPACT_MATRIX.md`
- `2026_03_11_KARVIA_CONSULTING_FLOW/KARVIA_CONSULTING_API_RUNBOOK.md`
- `2026_03_11_KARVIA_CONSULTING_FLOW/KARVIA_CONSULTING_TEST_MODEL.md`
- `2026_03_11_KARVIA_CONSULTING_FLOW/OKR_GENERATION_ANALYSIS.md`
- `2026_03_11_KARVIA_CONSULTING_FLOW/PROMPT_IMPROVEMENT_VALIDATION.md`
- `2026_03_11_KARVIA_CONSULTING_FLOW/TEST_EXECUTION_REPORT_2026-03-11.md`
- related prompt and payload files in the consulting-flow folder

### Current implementation cross-check

- `server/routes/ai-okr.js`
- `server/routes/planning.js`
- `server/routes/consultant.js`
- `server/services/AIContextService.js`
- `server/services/ContextMaturityService.js`
- `server/prompts/*`
- `server/models/Objective.js`
- `server/models/Task.js`
- `server/models/Team.js`
- `client/pages/scripts/planning-v2.js`

### Current product and roadmap docs cross-check

- `KARVIA_STRATEGY/1-PRODUCT/PRODUCT_VISION.md`
- `KARVIA_STRATEGY/1-PRODUCT/PRODUCT_ARCHITECTURE.md`
- `KARVIA_STRATEGY/1-PRODUCT/roadmap/ROADMAP_OVERVIEW.md`
- `docs/consultant-onboarding/consultant-journey-blog.md`
- `KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_ROADMAP_2026.md`

---

## 3. What The External Audit Gets Right

## 3.1 Prompt consolidation is necessary

This is correct.

The audit is right that prompt logic was fragmented across:

- `server/routes/ai-okr.js`
- `server/routes/planning.js`
- `server/services/AIObjectivePlanner.js`
- `server/services/aiOKRService.js`
- `server/services/SSINarrativeService.js`

The codebase now has a `server/prompts/` layer, which is the correct direction, but usage is still uneven.

### Why this matters

Without a canonical prompt layer:

- AI tone drifts by endpoint
- recommendation quality varies by page
- behavior framing becomes inconsistent
- beta learnings become hard to compare

### Impact

High product quality impact, low schema impact.

### Recommendation

Keep consolidating prompts. Do not add new prompt stacks.

---

## 3.2 Guidance blocks are the right abstraction

This is correct and already partly implemented.

The external prompt pack's `guidance` block is one of the most valuable recommendations because it lets the product shift from raw planning output to a coached experience without changing storage models.

### Why this matters

This is the cleanest way to change user perception from:

`here are your tasks`

to:

`here is the next move, why it matters, what to do next, and what assumptions were made`

### Impact

High user-experience value, minimal backend impact.

### Recommendation

Make the guidance block mandatory on all AI-generated outputs used in beta.

---

## 3.3 Consulting-flow validation is highly reusable

This is correct.

The consulting-flow audit proves the current system already supports the cascade:

`Company Profile -> SSI -> OKRs -> Weekly Plan -> Tasks`

That matters because it confirms the beta should **reuse**, not replace, this chain.

### Why this matters

This gives beta a usable operating backbone right now.

### Impact

Very high, because it avoids a rewrite.

### Recommendation

Treat the consulting-flow audit as proof that the current cascade is the substrate for beta.

---

## 3.4 Outcome capture and benchmark unification are valid concerns

This is also correct.

The external audit is right that:

- outcome learning is weak without collection workflow
- multiple benchmark sources create drift

These are real architectural concerns.

### Recommendation

Address them selectively for beta, but avoid broad refactors.

---

## 4. Where The External Audit Overreaches For Beta

## 4.1 It assumes new backend concepts are needed earlier than they actually are

The audit correctly identifies product gaps, but not every product gap requires a new backend model.

Example:

- desired user-facing concept: `Works`
- current backend concept: `Task`

For beta, these do not need to diverge.

You can keep `Task` as the storage and API object while presenting it as:

- next move
- handoff step
- follow-up
- support action

through prompts and frontend copy.

### Verdict

Do not rename or replace the task system before beta.

---

## 4.2 It is still biased toward structural feature completion

The audit often assumes that if a concept is important, it needs:

- model
- route
- UI
- workflow

That is often true for scale, but not for beta.

For beta, some concepts should live in:

- prompt structure
- title/description conventions
- tags and labels
- consultant facilitation
- review cadence

before they are formalized into schema.

---

## 4.3 It does not distinguish between "user-facing semantics" and "persistence semantics"

This is the most important architectural point.

For beta:

- persistence can remain largely the same
- semantics can change at the prompt/UI layer

This is the lowest-risk way to test the new business idea.

---

## 5. Current Code Reality: What We Can Reuse

## 5.1 Execution model can stay intact

The current execution model already supports:

- objectives with embedded KRs
- weekly goal generation
- task generation
- bulk task creation
- task status changes
- blocked/deferred flows
- ownership inheritance

### Evidence in code

- `server/routes/planning.js`
- `server/models/Task.js`
- `client/pages/scripts/planning-v2.js`

### Architectural conclusion

For beta, keep:

`Objective -> Key Result -> Goal -> Task`

No backend rewrite is required to test handoff-oriented execution.

---

## 5.2 Task state machine is already useful enough

Current task states:

- `todo`
- `in_progress`
- `completed`
- `blocked`
- `cancelled`
- `deferred`

Current task support fields:

- `blocked_by.reason`
- `blocked_by.blocked_at`
- `task_type`
- comments
- subtasks
- checklist
- tags

### Architectural conclusion

This is sufficient to represent most beta execution realities:

- `todo` = next move not started
- `in_progress` = ownership accepted and in motion
- `blocked` = handoff failed or support needed
- `deferred` = wrong week or sequencing issue
- `completed` = move landed

This is enough for beta.

### Recommendation

Do not create a separate handoff state machine yet.

If beta proves a real need later, evolve from real usage patterns.

---

## 5.3 Prompt infrastructure already exists

The current codebase already includes:

- `server/prompts/index.js`
- `server/prompts/guidance-builder.js`
- `server/prompts/base-system-prompt.js`
- endpoint templates for OKR, weekly plan, task suggestion, SSI narrative

### Architectural conclusion

This is the most leverage-rich layer for beta iteration.

### Recommendation

Use prompt engineering and response shaping as the primary beta adaptation mechanism.

---

## 5.4 Consultant routes are thin, but consultant workflow can still run

`server/routes/consultant.js` is limited, but the consultant can already operate by:

- switching company context
- using assessment and team pages
- generating objectives
- generating plans and tasks

### Architectural conclusion

A full consultant portal is not mandatory before beta.

### Recommendation

Add only the minimal consultant reporting needed for weekly beta operations.

---

## 6. Detailed Audit: Required Changes vs Optional Changes

## 6.1 Strategy and product docs

| Area | Current State | Change Required | Why | Impact | Dependencies | Risk If Deferred |
|------|---------------|----------------|-----|--------|--------------|------------------|
| Product vision | Still OKR-platform-first | **Yes** | Team will keep building the wrong product story | High | none | Product drift |
| Roadmap | Beta roadmap now exists, older roadmap conflicts | **Yes** | Conflicting priorities cause execution confusion | High | product alignment | Build churn |
| Consultant onboarding docs | Still task-rhythm framing | **Yes** | Beta story and consultant practice will diverge | Medium | prompt/UI language | Mixed field execution |
| GRIT/BBB/YSELA synthesis | Not yet canonical in tech/product docs | **Yes** | Stakeholder and team narrative mismatch | High | product/strategy alignment | Messaging inconsistency |

### Recommendation

These doc changes are mandatory before or alongside beta build.

They are cheap and remove major execution risk.

---

## 6.2 Prompt and AI layer

| Area | Current State | Change Required | Why | Impact | Dependencies | Risk If Deferred |
|------|---------------|----------------|-----|--------|--------------|------------------|
| Prompt source of truth | Improved but still partially fragmented | **Yes** | Inconsistent AI quality across endpoints | High | none | Low trust, prompt drift |
| Guidance block | Present in some AI flows | **Yes** | Core to "coach, not dump JSON" beta experience | High | prompt templates | Commodity feel |
| Consulting/Legacy Succession expertise | Not fully embedded in default guidance | **Yes** | Outputs remain generic | High | prompt pack | Weak vertical relevance |
| "Task" phrasing | Still often literal execution wording | **Yes** | Opportunity to reframe without backend change | High | frontend copy + prompt templates | Product seen as another task tool |
| AI response validation | Partial | **Yes** | Need deterministic checks for category fit, baseline usage, KR diversity | Medium | prompt layer | Quality instability |

### Recommendation

This is the single highest-ROI workstream for beta.

### Minimal implementation mode

- no schema change
- no new service layer beyond existing prompt system
- migrate remaining inline prompt logic into `server/prompts/*`
- require guidance blocks everywhere
- add language rules:
  - do not say "task" when "next move" is better for the user
  - present tasks as part of a handoff or objective

---

## 6.3 Frontend and UX

| Area | Current State | Change Required | Why | Impact | Dependencies | Risk If Deferred |
|------|---------------|----------------|-----|--------|--------------|------------------|
| Planning page wording | Task-centric | **Yes** | User perception problem | High | prompt response contract | Seen as generic PM |
| Objective display | Business target only | **Recommended** | Human objective should be visible even if persisted lightly | Medium | prompt and description conventions | Reduced differentiation |
| Team page | Structural teams only | **Recommended** | Can still simulate pods via naming and conventions in beta | Medium | consultant workflow | Weak team-formation story |
| Assessment outputs | SSI-heavy | **Recommended** | Need clearer human/ownership interpretation | Medium | prompt narrative layer | Strategic insight feels abstract |

### Recommendation

Do not rebuild pages. Re-label and re-sequence what is already there.

### Specific low-cost changes

- Planning page:
  - "Tasks" can remain in API/model but be shown as `Next Moves`
  - "Generate Tasks" can be shown as `Suggest Next Moves`
- Objective page:
  - prepend or structure description so the first line is the human objective
- Team page:
  - allow pod naming convention such as `Advisor Pod A`, `Delivery Pod B`
  - use descriptions for mentor/organizer intent before schema changes

---

## 6.4 Backend and business logic

| Area | Current State | Change Required | Why | Impact | Dependencies | Risk If Deferred |
|------|---------------|----------------|-----|--------|--------------|------------------|
| Task model | Already sufficient for beta | **No major change** | Reuse existing state machine | Very High positive reuse | none | None |
| Goal/Planning cascade | Already sufficient | **No major change** | This is the beta backbone | Very High positive reuse | none | None |
| Objective model | Works, but lacks explicit human-objective field | **Optional for beta** | Can be simulated in description first | Medium | product/UI conventions | Reporting ambiguity |
| Team model | Lacks explicit pod/mentor structure | **Optional for first beta** | Can be handled via naming + consultant notes | Medium | consultant ops | Lower reporting fidelity |
| Consultant route | Too thin for beta reporting | **Yes, minimal extension** | Need weekly company-level view | Medium | consultant workflow | Manual overhead |
| Outcome capture | Exists at quarterly review level | **Yes, small extension** | Need operational weekly evidence, not just later outcomes | High | consultant weekly cadence | Weak learning loop |
| Benchmark duplication | Some drift risk remains | **Yes** | One benchmark source for AI and narrative | Medium | prompt layer | Inconsistent advice |

### Recommendation

The backend should be changed **only** in these areas before beta:

1. extend consultant reporting
2. extend evidence capture
3. reduce benchmark drift

Everything else should first be attempted through prompt/UI/operations.

---

## 6.5 Business and operating model

| Area | Current State | Change Required | Why | Impact | Dependencies | Risk If Deferred |
|------|---------------|----------------|-----|--------|--------------|------------------|
| Consultant role in product | Under-modeled | **Yes** | Beta is consultant-led | High | consultant reporting | Operational inconsistency |
| Beta playbook | Not yet canonical | **Yes** | Need repeatable operating rhythm | High | product framing | Non-comparable pilots |
| Vertical focus | Legacy Succession chosen strategically but not yet systematically reflected | **Yes** | Beta needs tight market narrative | High | prompt and documentation | Weak case studies |
| Behavior engine claims | Must remain constrained | **Yes** | Need honesty and credibility | High | all docs and messaging | Overclaiming risk |

### Recommendation

The biggest business risk is not code. It is overselling the engine before beta proves it.

---

## 7. Minimum-Change Architecture Recommendation

## 7.1 Keep the execution layer exactly where it is

Keep:

- `POST /api/planning/generate-weekly-plan`
- `POST /api/planning/generate-tasks`
- `POST /api/planning/tasks/bulk`
- `Task` persistence and state handling

### Why

This already does the hardest operational work:

- ownership inheritance
- weekly sequencing
- task generation
- persistence
- progress tracking
- blocked/deferred handling

### Impact

Very high reuse, very low regression risk.

---

## 7.2 Reframe tasks semantically, not structurally

### Recommendation

In beta:

- `Task` remains the backend object
- `Next Move` becomes the frontend/prompt framing

### Example

Instead of:

`Generate 4 tasks for this weekly goal`

the prompt and UI can say:

`Suggest 4 next moves that help this team advance the weekly handoff`

The API can still return:

- `tasks[]`
- `guidance`

This is enough for beta.

### Why

It preserves the current schema, routes, and task board logic.

---

## 7.3 Use existing task states as handoff signals

### Mapping

| Existing Task State | Beta Interpretation |
|---------------------|---------------------|
| `todo` | next move identified |
| `in_progress` | ownership accepted |
| `blocked` | handoff failed or support needed |
| `deferred` | timing or sequencing issue |
| `completed` | handoff action landed |

### Additional signal sources already available

- `blocked_by.reason`
- comments
- checklist
- `task_type = review|approval|meeting`

### Recommendation

This is enough for the beta learning loop. Do not build a separate handoff state model yet.

---

## 7.4 Use objective description before adding new objective fields

### Recommendation

For first beta, avoid immediate schema expansion for `human_objective` unless reporting absolutely requires it.

Instead:

- keep business target in title
- structure description with:
  - human objective
  - why this matters
  - target behavior

### Why

This minimizes model changes while preserving user-facing meaning.

### Caveat

If beta reporting requires filtering by human objective type, add one small structured field later.

---

## 7.5 Use team naming and descriptions before adding pod schema

### Recommendation

For first beta, teams can behave like pods without immediate schema changes.

Examples:

- `Advisor Pod A`
- `Transition Pod B`
- `Delivery Pod C`

Use:

- `name`
- `description`
- `function`
- member roles

for beta semantics first.

### Caveat

If consultant reporting needs explicit mentor/organizer relationships, add only those fields later.

---

## 8. Required Changes Before Beta

## P0: Must do

### P0-1 Product and roadmap doc alignment

**Change**

Update conflicting top-level docs so beta is no longer described primarily as an OKR/task platform.

**Why**

Without this, engineering and product execution will diverge.

**Impact**

High strategic alignment.

**Dependencies**

None.

**Risk if deferred**

Team keeps building the old product.

---

### P0-2 Complete prompt consolidation on the paths used in beta

**Change**

Use `server/prompts/*` as the canonical AI layer for:

- company OKR generation
- single objective generation
- weekly plan generation
- task generation

**Why**

This is the cheapest path to higher-quality beta behavior.

**Impact**

High.

**Dependencies**

Existing prompt system already present.

**Risk if deferred**

Inconsistent user experience and lower trust.

---

### P0-3 Make guidance block mandatory on beta-facing AI responses

**Change**

Require `guidance` on all beta AI responses.

**Why**

This is how the product shifts from "another generator" to "guided operating system" without backend rewrite.

**Impact**

High.

**Dependencies**

Prompt layer.

**Risk if deferred**

Outputs feel generic and transactional.

---

### P0-4 Reframe planning UI and copy

**Change**

Keep tasks in code, but present them as:

- next moves
- priority moves
- handoff steps

**Why**

This directly addresses the shareholder concern with minimal technical cost.

**Impact**

High.

**Dependencies**

Prompt outputs and frontend wording.

**Risk if deferred**

The product still looks like another task manager.

---

## P1: Strongly recommended

### P1-1 Minimal consultant beta reporting

**Change**

Extend consultant endpoints to surface:

- company status
- objective status
- blocked tasks count
- weekly evidence summary

**Why**

Consultants need a consistent weekly cockpit.

**Impact**

Medium to high.

**Dependencies**

Current consultant route.

**Risk if deferred**

Consultant beta process becomes manual and inconsistent.

---

### P1-2 Weekly evidence capture

**Change**

Add a small operational evidence mechanism.

This can be either:

- a light new collection such as `BetaWeeklyReview`

or

- a narrowly extended reuse of existing review/outcome capture if it supports weekly cadence cleanly.

**Why**

Without consistent evidence capture, there is no real beta learning loop.

**Impact**

High.

**Dependencies**

Consultant workflow.

**Risk if deferred**

No durable basis for the future behavior engine.

---

### P1-3 Benchmark source cleanup

**Change**

Reduce benchmark duplication so prompts, narratives, and analytics use one contract.

**Why**

Prevents conflicting guidance.

**Impact**

Medium.

**Dependencies**

Prompt layer and narrative services.

**Risk if deferred**

Trust erosion through inconsistent recommendations.

---

## P2: Optional, only if beta usage forces it

### P2-1 Objective structured beta metadata

Add only if needed:

- `human_objective`
- `behavior_markers`
- `evidence_markers`

### Why

Useful for reporting, but not required for first beta if description conventions are enforced.

---

### P2-2 Team structured pod metadata

Add only if needed:

- mentor
- organizer
- review cadence

### Why

Useful for consultant reporting, but not required to start beta.

---

## 9. Changes That Should Not Be Done Before Beta

Do not do the following yet:

- create a new `Works` backend model
- replace `Task` with a new execution entity
- create a separate handoff engine service
- create a separate beta planning system
- rebuild the consultant portal from scratch
- introduce a new microservice for GRIT behavior logic
- claim a real behavior engine exists in production

These all add cost and regression risk before there is evidence they are needed.

---

## 10. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Product still perceived as task tracker | High | High | Reframe prompts and frontend language first |
| Team overbuilds backend before beta evidence | Medium | High | Enforce reuse-first architecture decision |
| Consultants run beta inconsistently | High | High | Create consultant beta playbook and minimal reporting |
| AI quality differs by endpoint | Medium | High | Finish prompt consolidation |
| No usable beta learning loop | Medium | High | Add weekly evidence capture early |
| Benchmark inconsistency leaks to users | Medium | Medium | Reduce to one benchmark contract |
| Objective semantics remain too generic | Medium | Medium | Use structured descriptions before schema change |

---

## 11. Final Recommendation

The external audit set is valuable, but the correct beta interpretation is:

**reuse the current backend aggressively, and spend your change budget on prompts, guidance, UI framing, consultant workflow, and evidence capture.**

### Architect/CTO position

The current platform is technically capable of supporting the beta with **minimal backend change** if the team adopts these rules:

1. Keep `Task` as the persistence layer.
2. Keep the planning cascade intact.
3. Use prompts and frontend language to turn tasks into `next moves`.
4. Add backend only for:
   - consultant reporting
   - weekly evidence capture
   - benchmark consistency
5. Delay new domain models until beta evidence proves they are necessary.

This is the lowest-risk, highest-learning path.

---

## 12. Immediate Next Actions

1. Align all beta-facing strategy/product docs to the new operating model.
2. Finish prompt consolidation and enforce guidance blocks on all beta AI outputs.
3. Update planning and objective UI language to present `tasks` as `next moves` or `handoff steps`.
4. Define the weekly consultant beta review process.
5. Add the smallest possible evidence-capture mechanism.
6. Defer schema expansion unless beta reporting proves it is required.

