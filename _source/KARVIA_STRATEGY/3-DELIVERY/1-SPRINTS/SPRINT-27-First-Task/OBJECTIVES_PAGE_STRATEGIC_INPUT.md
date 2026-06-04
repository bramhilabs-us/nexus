# Objectives Page — Strategic Evaluation Input (RESOLVED)

<!-- @GENOME T3-SPR-027-INPUT-OBJ | RESOLVED | 2026-05-27 | parent:T3-SPR-027-MP | auto:- | linked:/strategy -->

**Status**: RESOLVED — /strategy 2026-05-27 executed all 4 RPs + deferred-KR multi-play audit, resolved 14+ decisions. See [Resolutions section](#resolutions-2026-05-27) below.
**Trigger**: User direction during /testing — pause walkthrough, evaluate objectives.html strategic posture before more feature work or end-to-end testing
**Target session**: ~~next /strategy session~~ → **completed 2026-05-27**
**Outcome target**: ~~S27 plan amendment (or S28 if scope expands beyond S27 capacity)~~ → **S26 burndown punch list (3 items) + S27 Workstream E (6 items) + post-Beta refinement track items + 2 NEW reference docs**
**Result documents**:
- [SPRINT26_HANDOFF_DOCUMENT.md](../SPRINT-26-First-Objective/SPRINT26_HANDOFF_DOCUMENT.md) — /strategy 2026-05-27 section
- [SPRINT27_MASTER_PLAN.md](SPRINT27_MASTER_PLAN.md) — Workstream E added
- [PARKED_FEATURES.md](../../../1-PRODUCT/PARKED_FEATURES.md) — Category Coverage + door #4/#5/#6 parking decisions
- [CASCADE_MIGRATION_STATE.md](../../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md) — 4-level canonical cascade + legacy preservation
- [CLAUDE.md](../../../../CLAUDE.md) — Core OKR Cascade diagram updated to 4-level + legacy note

---

## User direction verbatim (canon-quoted per `feedback_quote_the_canon`)

> "we have new wizard, why dont we use that new OKR generation here also, first find, compare, do impact analysis and bring that here"
>
> "lets remove category coverage — as we are focusing on individual objectives created by business owners, consultants or managers (look at the strategic shift in the way we approach objective → KRs → quarterly goals → weekly goals → daily tasks — see if we have standardized this, if not its time)"
>
> "Let's look at all these things and before we proceed I think we need to evaluate and primarily focus on objectives so that we can start generating more value and see if down the line our sprint plan if we have anything in this regard. Otherwise we'll create a sprint twenty seven plan in next session, so or twenty eight if I'm not wrong whichever the sprint is. So I think we need to, in part of sprint twenty seven, we can add it. And yeah, we look at what is left in the sprint twenty six, and then we try to complete it. And then we need to see a kind of... I saw that the different objective, uh, we said, but I didn't see it here. Let's see if it is part of the plan. If it is not implemented, let it... let we roll ahead in the plan. I think we can push the testing to later, once we have everything covered so we can test out the entire end-to-end scenarios. so that will evaluate get a holistic overview and then we will see how to proceed."

---

## Research items for next session (4 RPs)

### RP1 — Wizard unification audit *(read-only, ~10 min)*

**Question**: Are there two parallel AI OKR generation flows that need unification?

**Observed in browser** (2026-05-26 screenshot 2): a NEW 3-step "Create Objective with AI" guided wizard exists, with:
- Step 1: "Which area needs attention?" — 6 category tiles (Growth/Customer Success/Operations/People & Culture/Innovation/Financial Health) + urgency selector (High/Medium/Low)
- Steps 2-3: not visible in screenshot
- Surfaced from `objectives.html` "Add Objective" button

**Existing AI OKR generation** (per CLAUDE.md + handoff context): triggered from `team-ssi-view.html` after assessment completion, with `okr_generation.generated` flag preventing duplicate generation, calls `/api/ai-okr` (one-time generation enforcement per Sprint 3 Epic 2).

**Research deliverables**:
1. Grep for the new wizard's source file(s) (search: `Create Objective with AI`, `3-step guided wizard`, `Which area needs attention`)
2. Compare with existing `team-ssi-view.js` + `/api/ai-okr` flow
3. Document: entry-point matrix (who triggers what, from where)
4. Identify duplicated logic surfaces (prompts, validation, persistence, UI states)
5. Recommend unification path: which becomes canonical, which retires
6. Impact analysis: backward-compat for existing tenants with generated OKRs, retention of `okr_generation.generated` invariant

**Q-gates to surface for user resolution**:
- Q-W1: Canonical wizard — the new 3-step guided OR the existing `team-ssi-view` post-assessment flow?
- Q-W2: Single entry point — `objectives.html` "Add Objective" only, OR also `team-ssi-view` post-assessment?
- Q-W3: `okr_generation.generated` flag retention — keep one-time enforcement OR allow per-objective generation (each Add Objective = AI assist)?
- Q-W4: Deprecation path — hard retire OR feature-flag fade?

---

### RP2 — Category Coverage removal blast-radius *(read-only, ~5 min)*

**Question**: Remove the "Category Coverage" widget from `objectives.html` (1/6 covered + 5-category nag banner) — what does it cascade to?

**User reasoning**: "We are focusing on individual objectives created by BOs/consultants/managers" — the 6-category coverage framing assumes a single company tracking all 6 buckets, but the actual usage pattern is consultants and BOs creating *the specific objective they need now*, not gap-filling a 6-bucket matrix.

**Research deliverables**:
1. Grep for "Category Coverage" / `category-coverage` / `categoryCoverage` / `5 categories need objectives`
2. Locate the widget source (likely `objectives.html` + `objectives.js`)
3. Locate the "Generate with AI to quickly fill coverage gaps" CTA — does it route into the new wizard (RP1) or legacy AI OKR flow?
4. Find consumers of `objective.category` for coverage-math (dashboard widgets? KPI strip? aggregator routes?)
5. Find consumers of `objective.category` for non-coverage purposes (category icons, filtering, reporting) — these need to be preserved
6. Document: removable cleanly vs needs-guardrail surfaces

**Q-gates to surface**:
- Q-C1: Full removal (widget gone, banner gone, CTA gone) OR partial (keep category as a tag, drop coverage-math)?
- Q-C2: `objective.category` field — preserved on the model (still tagged), or also removed?
- Q-C3: Dashboard/aggregator KPIs that read coverage — re-frame as "active objectives" buckets OR remove entirely?

---

### RP3 — Cascade hierarchy standardization audit *(read-only, ~15 min)*

**Canonical cascade** (per user direction + CLAUDE.md):
```
Objective → Key Result → Quarterly Goal → Weekly Goal → Daily Task
```

**Question**: Is this cascade standardized across model / route / UI / docs, or are there gaps/drifts?

**Research deliverables**:
1. **Model layer** — audit `server/models/{Objective,KeyResult,Goal,Task}.js`:
   - Field shape consistency (status enums, progress fields, owner refs)
   - Parent-pointer naming (`objective_id`, `key_result_id`, `parent_goal_id`, `goal_id`)
   - `time_period` discriminator on Goal (QUARTERLY vs WEEKLY) — current state per CLAUDE.md
2. **Route layer** — audit `server/routes/{objectives,goals,tasks}.js`:
   - URL naming convention — current `/api/goals/quarterly` + `/api/goals/weekly` + `/api/tasks` — consistent?
   - Verb consistency (RESTful conventions, soft-delete pattern)
   - Population patterns
3. **Service layer** — `DateService` cascade methods, `ValidationService` hierarchy validation, `ObjectiveCalculator` rollup helpers
4. **UI terminology** — grep client/ for variations: "weekly goal" vs "weekly objective" vs "weekly task" vs "milestone" etc.
5. **Documentation** — CLAUDE.md, ROADMAP, ECOSYSTEM_ARCHITECTURE — does each spell out the same 5-level cascade with the same names?
6. **Identify drifts** — anywhere the cascade is named/treated differently → S27 amendment item to standardize

**Q-gates to surface**:
- Q-S1: Canonical names per layer — finalize the vocab (Objective / Key Result / Quarterly Goal / Weekly Goal / Daily Task) and lock in CLAUDE.md as constitutional?
- Q-S2: Drift remediation — code rename (e.g. UI string updates) vs documentation-only alignment for this sprint?
- Q-S3: Discriminator vs separate models — keep Goal model with `time_period`, OR split into QuarterlyGoal + WeeklyGoal collections? (Per Sprint 23 #191 there's already a UNION READ between Goal{time_period:'WEEKLY'} and new WeeklyGoal collection — unfinished migration to document)

---

### RP4 — S26 remaining + S27 plan fit check *(read-only, ~5 min)*

**Question**: What's left in S26? What does S27 plan? Where does this evaluation work fit?

**Known state** (from this session's grounding):
- **S26 firing**: 15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C **4/6** (C.1b nudge layer DEFERRED, C.4 per-invitee widget pending) · D **0/2** · E 4/4 ✅
- **S27 master plan**: pre-launch, DRAFT — focused on "First Task Completed" (Stages 2 → 5):
  - Workstream A: extend ActivationPlaybook (Stages 3 → 5)
  - Workstream B: handoff dispatchers #4-receive / #4b / #5 / #5b
  - Workstream C: KR-aggregation cron (`okrAggregationJob.js`)
  - Workstream D: polish (empty-states for new managers/employees, telemetry verification)
- **S27 launch gate**: blocked on S26 close (First Objective Created acceptance test passes both paths)
- **S27 explicit non-goals**: no Stage 4 LLM prompt changes / no Behavior Persistence β / no Hybrid Classification / no notification architecture / no new model fields beyond cron-aggregation / no iBrain

**Research deliverables**:
1. Read [SPRINT26_MASTER_PLAN.md](SPRINT26_MASTER_PLAN.md) Workstream C/D residual rows for exact spec of C.1b / C.4 / D.2 / D.3
2. Read [SPRINT27_MASTER_PLAN.md](SPRINT27_MASTER_PLAN.md) workstream tasks fully
3. Determine fit:
   - **Option A**: amend S27 scope to add wizard unification + category removal + cascade standardization + A20260526-01 fix
   - **Option B**: park as S28 (defer until S27 ships First Task Completed)
   - **Option C**: split — A20260526-01 fix lands in S26 burndown (small, mechanical), wizard/category/cascade evaluation as separate S28 strategy track
4. Re-evaluate S26 close criteria — does the objectives-page evaluation block "First Objective Created" acceptance OR is it Beta-quality polish that can ship after?

**Q-gates to surface**:
- Q-P1: S26 close criteria — block on objectives-page evaluation OR ship as Beta-quality polish?
- Q-P2: S27 scope — amend to absorb wizard/category/cascade evaluation OR keep First Task Completed laser-focused?
- Q-P3: A20260526-01 — burndown into S26 (since it's a -01 ship completion gap) OR carry to S27?
- Q-P4: "Different objective" user mentioned — need clue from user (term to grep) to verify if it's in the plan

---

## Pending clarification from user (TQ4 from /testing 2026-05-26 Q-gates)

User mentioned: *"I saw that the different objective, uh, we said, but I didn't see it here. Let's see if it is part of the plan. If it is not implemented, let we roll ahead in the plan."*

**Need from user before next /strategy session**: what term to grep for? Examples of what "different objective" might mean:
- A specific category of objective (e.g. "personal objective" vs "company objective")?
- A specific type discussed in a prior /strategy session — pointer to which session?
- An objective shape variant (e.g. "outcome objective" vs "task objective")?
- Something on a mockup or YSELA doc the user saw?

Without a hint, RP4 will surface this as an open question for the user at session start.

---

## Quality bar for next /strategy session

Per `feedback_no_destructive_without_greenlight` + `feedback_minimal_change_grounding` + `feedback_why_what_how_when`:

1. **Why-first**: re-anchor on the strategic shift driving the evaluation — "individual objectives created by BOs/consultants/managers" is the load-bearing change in framing. Coverage-matrix model retires; per-objective creation flow becomes canonical.
2. **Read-only research first** — all 4 RPs surface findings + Q-gates before any code touched
3. **Impact analysis** — for every Q-gate surfaced, surface 2-3 options with cost / blast-radius / backward-compat per option
4. **Sprint amendment over new docs** — extend S27 master plan OR add a Workstream E if the evaluation work doesn't fit existing A/B/C/D; avoid creating S28 unless capacity demands it (per `feedback_extend_before_wrap` applied at sprint level)
5. **Quote-the-canon** — every claim in the impact analysis cites source (model field, route line, doc section) verbatim, no paraphrase

---

## Outcome target for /strategy session

| Deliverable | Owner | Lands in |
|---|---|---|
| Wizard unification impact analysis + Q-W1..Q-W4 resolutions | strategy session | S27 amendment OR new S27 Workstream |
| Category Coverage removal blast-radius + Q-C1..Q-C3 resolutions | strategy session | S27 amendment |
| Cascade standardization audit + Q-S1..Q-S3 resolutions | strategy session | CLAUDE.md update + S27 amendment for drift-fix |
| S26 burndown vs S27 scope fit + Q-P1..Q-P4 resolutions | strategy session | S26 close criteria refresh + S27 master plan amendment |
| `A20260526-01` placement decision (S26 burndown vs S27) | strategy session | AUDIT_TRACKER row update |
| "Different objective" clarification | user-supplied | S27 plan amendment if real, archived if not |

---

## Memory rules driving this input doc

- `feedback_quote_the_canon` — user direction quoted verbatim, not paraphrased; canon-anchored research deliverables
- `feedback_audit_governance` — `A20260526-01` minted in 📝 PLAN state during /testing close; not lost
- `feedback_no_destructive_without_greenlight` — no code touched; surfaces options + Q-gates for user resolution
- `feedback_minimal_change_grounding` — research items framed as read-only audits, not rewrites
- `feedback_why_what_how_when` — Why-first re-anchor on strategic shift before scope claim
- `feedback_extend_before_wrap` — S27 amendment preferred over S28 creation
- `feedback_read_helper_before_consuming` — A20260526-01 fix direction lifts the existing `calculateKRRiskStatus` helper; not a new color service

---

## Resolutions (2026-05-27)

All Q-gates resolved in /strategy 2026-05-27. User direction quoted verbatim per `feedback_quote_the_canon`.

### Meta-decisions (set framework for all resolutions)

| Decision | Resolution | Source quote |
|---|---|---|
| **Additive principle** | No deletions. Only de-emphasis + new additive doors. | *"let's not delete anything so that way we are reducing the risk. So we're just introducing a new way of generating objectives"* |
| **Standardize at doc level** | Surgical UI string fixes + doc updates only. Architectural migrations parked post-Beta. | *"let's let's let's standardize all these at least documentation across so that, you know, we don't get confused in the future"* |
| **Risk-minimization framework** | Tier 1 surgical now / Tier 2 S27 Workstream E / Tier 3 post-Beta measured retirement | User: *"reducing the risk to the minimum, especially the technical risk... making sure it's scalable"* |

### RP1 — Wizard unification (Q-W1..Q-W4)

| Q | Resolution | Action |
|---|---|---|
| **Q-W1** Canonical wizard | Door #1 (`objective-wizard.html` + `/api/objective-wizard`) per S26-C.5 | Confirmed (already canonical) |
| **Q-W2** Single entry point | NO — keep multiple entries to one engine + ADD new "Create Individual Objective" option | S27 A20260527-04 |
| **Q-W3** `okr_generation.generated` flag | Drop as hard block; keep as informational | Folded into A20260527-06 (door #5 de-emphasis) |
| **Q-W4** Deprecation path | NONE for now — preserve all 6 doors, measure post-Beta | PARKED_FEATURES.md documents doors #4/#5/#6 |
| **NEW (user proposal)** | **Add "Create Individual Objective" 3-step modal as 3rd dropdown option** | S27 A20260527-04 |

### Individual Objective wizard design (Q1-Q4)

| Q | Resolution |
|---|---|
| **Q1** Modal or own URL? | **Modal on objectives.html** — best BO experience |
| **Q2** Company context in Step 1? | **Collapsible panel** — respects BO attention; available on expand |
| **Q3** AI sharpening | **Opt-in checkbox** (off by default) — BO retains author voice |
| **Q4** Step 3 KR mode default | **"Add later"** — fastest path, Manager owns breakdown |

**Wizard Step 3 multi-play modes** (all verified at data layer; Manager-side CTA gap closed by A20260527-07/-08):
- **Add later** → save objective with 0 KRs → Manager handoff email fires → Manager arrives at planning-v2.html → sees "Generate KRs for this objective" CTA (NEW)
- **Add manually** → BO defines KRs inline
- **Generate with AI** → reuses existing `/api/objective-wizard/generate-krs` endpoint

### RP2 — Category Coverage (Q-C1..Q-C3)

| Q | Resolution |
|---|---|
| **Q-C1** Full or partial removal? | **De-emphasize but keep** per user: *"It's not sure the category coverage option featured, so let the category coverage widget be there and... but not evidently show it for now because we are focusing on the consultant"* |
| **Q-C2** Preserve `objective.category` field? | **Yes** — required field stays (icons, theming, quarterly review, model index) |
| **Q-C3** Dashboard/aggregator KPIs reading coverage? | **None to reframe** — only consumer is door #5 (parked); `byCategory` in outcome-capture.js is analytical (preserved) |

### RP3 — Cascade standardization (Q-S1..Q-S3)

| Q | Resolution |
|---|---|
| **Q-S1** Canonical names | **4-level cascade**: Objective → Key Result → Weekly Goal → Daily Task. Locked in CLAUDE.md. |
| **Q-S2** Drift remediation | **Doc-only standardization** (CLAUDE.md + WeeklyGoal.js docstring + new CASCADE_MIGRATION_STATE.md + UI string normalization "weekly milestones" → "weekly goals") |
| **Q-S3** Discriminator vs separate model | **Parked post-Beta spike** — UNION-READ keeps stable; full collection consolidation needs its own /strategy session |

**Cascade architecture decision (NEW, user direction 2026-05-27)**:
- *"Quarterly goal does not have any impact, so I don't think it should survive"* → **Drop Quarterly Goal from canonical for new objectives**
- *"Let's use the new weekly goal model. KR weekly goal tasks"* → **KR → WeeklyGoal direct (no intermediate)**
- *"the moose is something that we will generate out of... that's a later addition"* → **Move = future 5th layer (post-Beta)**
- *"make it sure that you know quarterly goal is at least for the new objective one is removed but eventually we will do"* → **Legacy 5-level objectives preserved; eventual full retirement post-Beta**

**KR duration rule** (locked):
- KR inherits Objective duration window
- Weekly Goals = ceil((KR.end - KR.start) / 7d), one per calendar week
- No new model field needed

### RP4 — Plan fit (Q-P1..Q-P4)

| Q | Resolution |
|---|---|
| **Q-P1** Does objectives-page eval gate S26 close? | **No — Beta-quality polish track**, doesn't block 5-verb acceptance test |
| **Q-P2** Amend S27 scope? | **Yes — new Workstream E** (6 items: -04..-09); preserves existing A/B/C/D |
| **Q-P3** A20260526-01 placement | **S26 burndown** (item A20260527-02) |
| **Q-P4** "Different objective" clarification | **No strong term hit in current docs**; likely user referred to either (a) the post-assessment door-#5 bulk vs door-#1 canonical distinction OR (b) the manual-vs-AI split on objectives.html. Both addressed by S27 Workstream E. |

### Deferred-KR multi-play audit (NEW research item, user-requested)

| Check | Result | Action |
|---|---|---|
| Save objective with 0 KRs | ✅ Works | N/A |
| Add KRs later via API | ✅ Works (`POST /api/key-results`) | N/A |
| Lifecycle transitions on later KR add | ✅ Works (Sprint 24 Epic 24.3 evaluators) | N/A |
| UI handles 0-KR objective | ✅ Works | N/A |
| Manager handoff email fires for 0-KR | ✅ Works (Dispatcher 4) | N/A |
| **Manager CTA to add KRs from planning-v2** | ⚠️ **GAP** | **NEW: A20260527-07** |
| **Generate-KRs endpoint accepts existing objective_id** | ⚠️ GAP | **NEW: A20260527-08** |

### Objective card polish (user-added scope)

User: *"let's also clean the objective cards in terms of, you know, having... and do an analysis of how flexible are we"*

**Resolution**: A20260527-09 in S27 Workstream E — clarify 0-KR state, consistent state-based CTAs.

---

## Audit IDs pre-minted

| ID | Item | Tier |
|---|---|---|
| A20260527-01 | Backend owner_id requirement on `/api/objectives` POST | S26 burndown |
| A20260527-02 | A20260526-01 KR-row CSS color fix | S26 burndown |
| A20260527-03 | Doc-only RP3 cascade standardization | S26 burndown |
| A20260527-04 | "Create Individual Objective" wizard modal | S27 Workstream E |
| A20260527-05 | Category Coverage widget de-emphasis | S27 Workstream E |
| A20260527-06 | Door #5 bulk button de-emphasis on team-ssi-view.html | S27 Workstream E |
| A20260527-07 | Manager planning-v2 "Generate KRs" CTA for 0-KR objectives | S27 Workstream E |
| A20260527-08 | Extend `/api/objective-wizard/generate-krs` for deferred-KR mode | S27 Workstream E |
| A20260527-09 | Objective card polish (0-KR state + state-based CTAs) | S27 Workstream E |

---

## Sign-off

This document started as a research+analysis agenda at /testing 2026-05-26 close. It was **executed and resolved** at /strategy 2026-05-27 (session #260). All 14+ decisions land in:
- S26 burndown (3 items, ~3 hours work)
- S27 Workstream E (6 items, ~1.5-2 days work)
- 2 NEW reference docs (PARKED_FEATURES + CASCADE_MIGRATION_STATE)

Per user direction: *"Let's do a thorough analysis, impact analysis, by understanding the strategy and the current state we are in."* — executed.

Per user direction: *"by end of split twenty six or twenty seven, we need to have everything ready"* — S26 burndown closes residuals; S27 Workstream E lands strategic shift.

---

## Plan-Lock 2026-05-28 — Convergence revision

User-driven brainstorm during /testing close surfaced six directions that reshape Workstream E. Original /strategy 2026-05-27 plan PRESERVED above for history; this section overrides where conflicts arise. All revisions land in [SPRINT27_MASTER_PLAN.md §Workstream E](SPRINT27_MASTER_PLAN.md#workstream-e--objective-creation-refinement-added-2026-05-27-strategy-260) (revised table) + 4 new audit IDs minted 📝 PLAN in [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md).

### Direction 1 — Single wizard surface (eventual convergence)

> *"let's try to reuse what we have built with the new ad objective individual option so that eventually we will have just one ad objective in the future"*

**Locked**: ONE wizard surface = `client/pages/objective-wizard.html`. NEW E.1a restructures it as a 3-mode wizard via query-param branching, NOT a parallel modal:

| Entry | Query | Behavior |
|---|---|---|
| Legacy post-SSI flow | `?source=team_ssi` (or no query) | Existing 3-step (category → intent → review) UNCHANGED |
| New "Add Objective" | `?creation_mode=individual` | NEW intent-first 3-step (intent + AI refine → configure → review) |
| Add KRs to existing objective | `?objective_id=X&action=add_krs` | JUMP to Screen 3, load obj into session, AI generates KRs |

**Rejected**: original /strategy 2026-05-27 E.1 "NEW modal on objectives.html" — per `feedback_extend_before_wrap`, reuse existing canonical wizard.

### Direction 2 — Objectives.html as sole Objective+KR creation surface

> *"let's not use planning page to generate KRs. Let's keep objective page as the single page where objectives and KRs are created."*

**Locked**:
- `objectives.html` = sole creation surface for Objective + KR
- `planning-v2.html` = consume-only

**Rejected**: original E.4 "Manager planning-v2 Generate-KRs CTA". **Replaced** by:
- NEW E.4 (revised): data-driven objective card state-CTAs via `getObjectiveCardState` pure helper
- NEW E.7: planning-v2 0-KR empty-state redirect (tiny — link to objectives.html)
- NEW E.8: B.4 dispatcher email CTA destination → objectives.html

### Direction 3 — Intent-first wizard (drop strategic-focus picker)

> *"we don't need to pick the strategic focus for this objective creation... let's jump right into what do you want to achieve and let the AI refine it and then priority and then timeline and owner and key results."*

**Locked** when `creation_mode=individual`:
- **Screen 1**: "What do you want to achieve?" — free-text intent + AI refine → returns `{refined_title, suggested_category}` (category badge editable as dropdown override)
- **Screen 2**: Priority + Timeline (custom + today default) + Owner (required) + KR mode
- **Screen 3**: Review (final title + KRs per mode OR "Add later" message)

Legacy 3-step (`?source=team_ssi`) keeps the category picker as Screen 1 — unchanged.

### Direction 4 — Owner = anyone with edit permission

> *"a business owner can come back and create the KRs for himself, or a business owner can just create objectives and KRs"*

**Locked**: Owner dropdown at Step 2 includes "Myself" option. KR-add CTAs gated by `canEdit` permission (creator OR owner OR consultant-on-managed-tenant), NOT by role. BO can: (F1) create obj + KRs same session; (F2) create obj self-owned + Add-later, return + add via card; (F3) create obj + assign Manager + Manager adds KRs; (F4) same as F3 but BO returns first.

### Direction 5 — Non-hardcoded card options + impact analysis

> *"make sure every option that we have planned in the objectives card are not hardcoded and make sure the impact analysis is done."*

**Locked**: card state-CTAs derived from a single pure helper `ObjectiveCalculator.getObjectiveCardState(objective, currentUser, weeklyPlanCount)` returning `{status, colorTokens, ctas, badges}`. Card renderer becomes a dumb iterator. **Zero role conditionals in renderer.**

**Decision matrix** (no role literals — all data-driven):

| `kr_count` | `has_plan` | `canEdit` | `objective.status` | Primary CTA | Secondary | Badges |
|---|---|---|---|---|---|---|
| 0 | — | ✓ | active | `[✨ Generate KRs]` | `[+ Add manually]` | `0 KRs` + `Waiting for KRs` if owner≠me |
| 0 | — | ✗ | active | `[View details]` | — | `0 KRs` |
| ≥1 | no | ✓ | active | `[📅 Plan this objective →]` | `[Edit KRs]` | — |
| ≥1 | no | ✗ | active | `[View details]` | — | — |
| ≥1 | yes | ✓ | active | `[📊 View progress]` | `[Plan]` `[Edit]` | — |
| ≥1 | yes | ✗ | active | `[View progress]` | — | — |
| — | — | ✗ | cancelled/archived | `[View details]` | — | `Archived` / `Cancelled` |
| any | yes | ✓ | active + progress=100% | `[📊 View progress]` | (post-Beta) | `Completed` |

**Inputs**: `objective.key_results.length`, `weeklyPlanCount > 0`, `canEdit = owner_id===me || created_by===me || (role===CONSULTANT && managed)`, `canDelete = created_by===me || role ∈ {CONSULTANT, BUSINESS_OWNER}`.

**Impact analysis per CTA**: see SPRINT27_MASTER_PLAN E.4 + E.9 regression suite (every matrix row × edit/delete combo).

### Direction 6 — Date-system audit (objective-relative tracking)

> *"objective is the highest. So if I create an objective for three months, I start from today. So my color coding should be based on that, the task planning, the tracking should be based on objective."*

**Audit findings**:

| Layer | Current | Independence |
|---|---|---|
| `Objective.start_date / .end_date` | Each obj has own window | ✅ Fully independent |
| `Objective.time_period_type` (cal_year/fiscal_year/custom) | `calendar_year` default → Jan 1 backfill | ❌ **THE BUG** (A20260528-02) |
| `Objective.target_year` (REQUIRED) | Start-year semantic | ✅ Custom: target_year = startDate.getFullYear() |
| `KR.quarters[]` | Derived from `quartersTouched(obj.start, obj.end)` (A20260515-02) | ✅ Inherits from obj |
| `KR.year` | Enforced equal to `objective.target_year` (D-A-4) | ✅ Inherits from parent |
| `calculateExpectedProgress(start, end)` | Pure: `(now-start)/(end-start)*100` | ✅ Obj-relative |
| `calculateWeekProgress(start, end)` | Pure: `ceil(elapsed/7)` — "Week N/M" relative to obj start | ✅ Obj-relative |
| `WeeklyGoal.completions[].week + year` | ISO calendar week | ✅ Scheduling-anchored; one WG per KR/obj — no cross-obj interference |
| `Goal.quarter / .year / .week` (legacy) | Calendar quarter + quarter-relative week | ✅ Legacy 5-level only |
| `calculateKRRiskStatus` + `getKRRowColorTokens` | Reads each obj's `start_date` + grace window | ✅ Obj-relative + temporal-aware |

**Verdict**: MATH layer is already fully objective-relative. The "Tomorrow I create another objective" scenario ✅ already works:
- Obj A: start=2026-05-28, end=2026-08-26 → Week 1/13 today, BLUE
- Obj B: start=2026-05-29, end=2026-11-29 → Week 1/26 tomorrow, BLUE
- Independent timelines, independent week counts, independent color coding

**The only leak**: `time_period_type='calendar_year'` manual modal default (A20260528-02). Closed naturally by E.1a wizard timeline picker (`custom + start_date=today + duration_months`).

**Two-week-concept distinction** (intentional, documented in [CASCADE_MIGRATION_STATE.md](../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md)):
- **Objective-relative week** ("Week 3/13"): card display
- **ISO calendar week**: WeeklyGoal scheduling

Don't confuse them.

### Audit IDs minted at this lock (4 new)

| ID | Severity | One-liner | Lands in |
|---|---|---|---|
| `A20260528-02` | MEDIUM | Manual-modal `calendar_year` default → Jan 1 backfill → RED on day 1 | Subsumed by E.1a (no separate code) |
| `A20260528-03` | MEDIUM | `objective-wizard.js:895` `owner_id || userId` silent fallback (same class as A20260527-01) | E.1d (~5 LoC) |
| `A20260528-04` | MEDIUM | B.4 dispatcher email CTA destination → objectives.html | E.8 (~10 LoC + test + canon row update) |
| `A20260528-05` | LOW | GET /api/objectives `weekly_plan_summary` field for E.4 helper | E.6 (~10 LoC BE) |

### Audit IDs from /strategy 2026-05-27 — scope changes at this lock

| Original | Original scope | Revised |
|---|---|---|
| `A20260527-04` (Individual wizard) | Build new modal | REUSE existing wizard via `?creation_mode=individual` — splits into E.1a/E.1b/E.1c |
| `A20260527-07` (planning-v2 Generate-KRs CTA) | KR modal on planning-v2 | REJECTED for KR creation. Scope-flipped → objectives.html data-driven card CTAs (E.4) + planning-v2 0-KR redirect (E.7) |
| `A20260527-08` (Extend generate-krs for objective_id) | UNCHANGED endpoint | CHANGED consumer: objectives.html wizard, not planning-v2 |
| `A20260527-09` (Objective card polish) | Standalone | MERGED into E.4 revised — card polish IS the state-CTAs |

### Revised total estimate

**~13 hours = ~1.5 days** for Workstream E (was ~1.5-2 days). Saves ~3-4h via wizard convergence.

### Sign-off (revision)

Per user direction *"keep it simple"* + *"reuse maximum"* + *"surgical development"* + *"non-hardcoded options + impact analysis"* + *"objective is the highest, each objective tracks itself"* — all 6 directions accepted and locked.

Next: `/coding` S27 Workstream E in dependency order E.6 → E.1a → E.1b → E.1c → E.1d → E.5 → E.4 → E.7 → E.8 → E.9 (regression suite last).
