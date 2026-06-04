# Sprint 26 — Planning Cascade Strategy (Slice 2.3)

<!-- @GENOME T3-SPR-026-PLAN-CASCADE | ACTIVE | 2026-05-14 | parent:T3-SPR-026-MP | auto:- | linked:/strategy,/coding -->

**Session**: B2 `/strategy` 2026-05-14 (follows B1 `/coding` same day) · **Amended** B3a-post `/strategy` 2026-05-14
**Author**: minted at /strategy session #240; amended at /strategy session #243
**Status**: ACTIVE — decisions locked, B3a SHIPPED 2026-05-14, B3b/c/d deferred
**Audit IDs**: `A20260514-10` ✅ shipped · `A20260514-11` 💻 PARTIAL (parts 1-3 shipped B3a; part 2 validator deferred to 2.3.4) · `A20260514-12/-13/-14` 📝 PLAN

---

## Amendment Log

### 2026-05-14 — Cleanup commit (A20260514-15)

Canon-error correction surfaced when user viewed production planning page on `karvia-business-1.onrender.com/pages/planning-v2.html` and noted the redesign description didn't match the actual UI. Original /strategy #240 mint cited `client/pages/quarterly-goals.html` (legacy file, not in navigation per [navigation.js:18,25,32,39](../../../../client/js/navigation.js#L18)) instead of the production `planning-v2.html`. 5 drift sites in this doc re-targeted to `planning-v2.html` + `TO BE RE-SCOPED` markers added at §2.4 SD-4 / §3.3 / §4.1 (the minimum-amendment scope — date-on-card + Q1/Q2/Q3 tab rethink Options α/β/γ — is the alternative direction user surfaced; pick before B3b /coding session opens). Legacy files deleted as part of same commit (cleanup audit confirmed zero code impact + 4 dead-code/cosmetic cascade edits).

### 2026-05-14 — B3a-post /strategy session #243

Six lock changes triggered by B3a /coding session's holistic pressure-test (3 risks surfaced + 3 deferral options + 3 Revisions bundled).

| # | Section | Change |
|---|---|---|
| 1 | §2.2 SD-2 | **Revision 1** locked explicit: QUARTERLY-tier non-overlap ONLY; WEEKLY siblings explicitly PERMITTED to overlap (parallel team work is the normal mode). **New rule**: strict less-than overlap test — adjacent phases sharing a boundary day do NOT count as overlap. |
| 2 | §3.1 | Mark A20260514-10 SHIPPED 2026-05-14. Cross-ref note: verify script also feeds 2.3.2b grandfathering decision. |
| 3 | §3.2 | **Split 2.3.2 into 2.3.2a (parts 1-3, SHIPPED B3a 2026-05-14) + 2.3.2b (part 2 non-overlap validator, DEFERRED to 2.3.4 per ship-with-consumer principle).** Lock **Revisions 2 + 3** into 2.3.2b (ONE new compound index; grandfathering guard for legacy `time_period_type !== 'custom'` parents). |
| 4 | §3.4 | A20260514-11 part 2 validator bundled with 2.3.4 Window CRUD. Add pre-flight verify-script run requirement (decision branch if overlap count > 0). |
| 5 | §4.1 | Session-split table: 3 sessions → 4 sessions (B3a SHIPPED; B3b = 2.3.3 alone; B3c = 2.3.4 + 2.3.2b; B3d = 2.3.5). |
| 6 | §4.2 | Dependency graph annotated: 2.3.1 ✅ → 2.3.2a ✅ + 2.3.3 → 2.3.4 + 2.3.2b → 2.3.5. |

---

## 1. The Reframe — Objectives are Projects, Not Annual OKRs

### 1.1 What this strategy session resolved

B1 shipped custom-period objectives (wizard date picker, LLM prompt awareness, goal-date hierarchy enforcement). B1 unblocked a visible Beta bug (objectives showing "Week 20/52" + "At risk" on day 1 because the wizard force-fit Jan 1 → Dec 31).

But B1 only solved the **objective-create** path. The **planning cascade underneath** (quarterly goals → weekly goals → tasks) still anchors on calendar quarters. For a 7-month objective starting May 14, the planning page still shows "Q1 2026 / Q2 2026 / Q3 2026 / Q4 2026" tabs — which is the wrong abstraction.

### 1.2 The user's conceptual model (locked at /strategy session #240)

> "OKRs are not the way you'd plan in a traditional company. In a traditional company every year we decide the OKRs we need to achieve. But here, consultant onboards a client at any point in time. They can set objectives at any point — for example, onboard a client, take an assessment, then say 'I want to create an org chart' — that's an objective. Creating an org chart can start at any point in time and may take 3-4 months. So we need to give this flexibility."

**Implications**:

| Concept | Traditional OKR | Karvia (locked) |
|---|---|---|
| Unit of planning | Calendar quarter (Q1-Q4 of fiscal year) | **The objective itself** |
| Cadence | Annual, fixed start | **Per-objective, arbitrary start + duration (1-36 months)** |
| Aggregation | "Q3 2026 across all teams" | "Active objectives now / windows ending soon / stalled phases" |
| Phasing model | Quarterly milestones | **Project phases (e.g., "Discovery" / "Build" / "Launch")** |
| Cross-client view | Calendar quarter slice | Per-client per-objective drill-down |

**There is no shared annual OKR cycle**. Every objective is a project with its own embedded timeline. "Calendar_year" objectives are not a special case — they're `time_period_type='custom'` with start = Jan 1 + end = Dec 31. The Q1-Q4 mental model is a relic that should not propagate beyond legacy data.

### 1.3 What stays unchanged (zero scope creep)

- **Sprint 26 firing tally** (12/24 → eventually 17/24 if all 5 sub-slices ship) — Slice 2.3 work IS in S26 scope per page-matrix
- **B1 deliverables already shipped**: Slice 2.1 wizard period UI + Slice 2.2 KR prompt awareness + Slice 2.4 goal-date validation wire-through (3 commits in B1 session, 119 new assertions)
- **Legacy data**: existing Goals with `quarter='Q3', year=2025` keep loading; field becomes informational only

---

## 2. Locked Strategic Decisions (5 SDs)

User locked all five at /strategy session #240 ("I agree with your recommendations. I clocked the decisions now.").

### 2.1 SD-1 — Schema model — **(b) add `Goal.window_name`, deprecate `Goal.quarter` requirement**

**Decision**: Goal schema additions are minimal — one optional new field. The required `Goal.quarter` enum (Q1-Q4) becomes optional; required `Goal.year` becomes optional. Primary keys for new code are `objective_id` + `start_date` + `due_date` + (optional) `window_name`.

**Rationale**: Quarter is a calendar artifact that contradicts the per-objective model. Rather than introduce a parallel field (`window_index`, etc.) we deprecate the bad abstraction and let the dates do the work. `start_date` orders windows naturally. User-friendly labels (e.g., "Discovery Phase") sit in `window_name` — optional, falls back to date-range display.

**Migration**: zero-op. Existing Goals keep their `quarter`/`year`/`week` values intact. No data rewrite. New writes simply omit `quarter` for custom-period parents.

### 2.2 SD-2 — Window overlap + gaps — **(a) disallow overlap, allow gaps** (QUARTERLY-tier ONLY)

**Decision**: Two **QUARTERLY-tier** Goals under the same Objective cannot have overlapping `[start_date, due_date]` ranges. **WEEKLY siblings explicitly CAN overlap** — parallel team work within the same week (e.g., Alice's "Backend API", Bob's "Frontend mockups", Cara's "Customer interviews" all in Aug 1–7) is the normal mode of operation, not a violation. Gaps allowed at QUARTERLY tier (e.g., "Discovery May-Jul" → break in Aug → "Build Sep-Dec").

**Overlap test**: strict less-than — `start_a < end_b && start_b < end_a`. Adjacent phases sharing a boundary day do NOT count as overlap (e.g., "Build Aug 1 – Dec 1" + "Launch Dec 1 – Feb 14" → valid). This matches consultant mental model (Build ends EOD Dec 1, Launch starts SOD Dec 1) and the calendar quarter analogue (Q1 ends Mar 31, Q2 starts Apr 1; if user picks Mar 31/Mar 31 the validator should also "just work").

**Rationale**: QUARTERLY-tier phases are sequential project milestones — overlap creates ambiguous task ownership ("which phase is this task in?"). WEEKLY tier is the work-unit layer — overlap there is parallel execution, semantically distinct. Gaps at QUARTERLY tier are legitimate for non-active periods. Tasks scheduled during a gap → FE shows orphan warning, BE does not block.

**Enforcement layer**: route-side (new POST/PUT check, similar to B1.4's `validateGoalDateHierarchy` pattern). **Locked at this revision**: Revision 1 (QUARTERLY-only scope) + Revision 2 (single new compound index `{objective_id:1, time_period:1, start_date:1}`) + Revision 3 (grandfathering guard — skip non-overlap when parent objective's `time_period_type !== 'custom'`). All three Revisions from B3a holistic pressure-test 2026-05-14. See §3.2 for shipping plan + §3.4 for validator wire-site at 2.3.4 Window CRUD UI.

### 2.3 SD-3 — Default windows at objective creation — **(b) offer auto-split helper**

**Decision**: Objective creation does NOT auto-create windows. When user opens planning page for a fresh objective with zero windows, FE shows a CTA: **"Auto-split into 3 equal phases"** (user can change N to 2-12; pre-fills name/start/end; user confirms or edits before save).

**Rationale**: Wizard step 2 already collected objective start/end. Planning page can offer a 1-click breakdown. (b) is the right pick over (a) because the data is already there — making the user click "Add Phase" 3 times when we could pre-fill is friction without payoff. (c) was dropped because auto-creating ONE window spanning the whole objective defeats the point of phasing.

**No surprise**: helper is opt-in (user must click), not automatic.

### 2.4 SD-4 — Planning page UX shape — **(c) objective-first navigation, kill calendar quarter selector**

**Decision**: [planning-v2.html](../../../../client/pages/planning-v2.html) becomes **objective-scoped**. Entry view: "Active Objectives" list. User clicks an objective → drill into its plan (header + start/end timeline + ordered window strip + weekly goals under each window). Calendar quarter selector ("prev / Q1 2025 / next") is **REMOVED entirely**.

**Rationale**: The calendar quarter selector is the visible relic of the wrong model. Branching the UI (calendar selector for calendar_year, window tabs for custom) preserves the relic and adds complexity. (c) deletes the relic. Calendar_year objectives still work — their plan shows Jan-Dec timeline with whatever windows the user added (or `quarter`-derived legacy windows for unmigrated rows).

**FE impact**: significant — [planning-v2.html](../../../../client/pages/planning-v2.html) + [planning-v2.js](../../../../client/pages/scripts/planning-v2.js) get a redesign. ~350 LoC FE + ~100 CSS.

> **TO BE RE-SCOPED next /strategy** (file-target fixed 2026-05-14 cleanup commit; original /strategy #240 mint pointed at the now-deleted legacy `quarterly-goals.html` — production navigation routes all 4 roles to `planning-v2.html` per [navigation.js:18,25,32,39](../../../../client/js/navigation.js#L18)). The minimum-amendment scope (date-on-card + Q1/Q2/Q3 tab rethink — Options α/β/γ surfaced in user dialogue 2026-05-14) is the alternative direction; pick before B3b /coding session opens.

**Page flow**:
```
[Planning Page Entry]
  ↓
"Active Objectives" list
  - Card per active objective (title, dates, % complete, # of windows)
  - Click → drill in
  ↓
[Single Objective Plan View]
  - Objective header (title + start_date → end_date + progress bar)
  - Horizontal timeline strip showing windows (ordered by start_date)
  - Each window: name + dates + weekly goals expandable
  - "Add Window" button + (if zero windows) "Auto-split into N phases" helper
  - Back arrow → list view
```

### 2.5 SD-5 — Dashboard + aggregator KPI reframe — **(c) reframe semantically, drop quarter framing**

**Decision**: Dashboard + cockpit KPIs reading "this quarter's goals" / "Q3 progress" get **replaced semantically**:

| Old KPI | New KPI (objective-aware) |
|---|---|
| "This quarter's goals: N completed" | "**Active windows now**: N (in progress) / M (stalled)" |
| "Q3 2026 progress: X%" | "**Active objectives**: K (on track) / L (at risk) / M (off track)" |
| "Quarterly goals at risk" | "**Windows ending in 14 days**: N (next: '[name]' on YYYY-MM-DD)" |
| (none) | "**Stalled phases**: windows where due_date is past + status != completed" |

**Affected surfaces**:
- `client/pages/scripts/client-workspace.js` Plan tab — already date-aware after S26 C.1a, just needs label changes
- `client/pages/scripts/dashboard-v2.js` consultant Dashboard tab — KPI strip rewrite (separate from Session C's chores/Moves honesty pass — they overlap; can ship together)
- `server/routes/consultant.js` `/dashboard-summary` aggregator + Plan-tab queries — replace `quarter`-based queries with date-range queries

**Rationale**: KPIs reading "this calendar quarter" misrepresent the model. A consultant managing 5 clients × 3 objectives each = 15 independent timelines. "Q3 2026 across all of them" is meaningless. "How many active windows do I have right now" is meaningful. (a) and (b) preserved the bad framing under the hood; (c) reframes the semantic.

---

## 3. Slice 2.3 Sub-slice Plan (5 audit IDs minted)

All 5 sub-IDs minted in PLAN state (📝) at this /strategy session. Status flips to 💻 → ✅ as each ships in B3 `/coding`.

### 3.1 Sub-slice 2.3.1 — Schema relaxation — `A20260514-10`

> **Amended 2026-05-14** (B3a-post /strategy): marked ✅ SHIPPED; verify-script scope extended with Risk 3 overlap-pair audit (output feeds §3.2 2.3.2b grandfathering decision); CLAUDE.md migration-note doc work surfaced as carry-forward (not in B3a commits).

**Scope** (as shipped):
- [server/models/Goal.js](../../../../server/models/Goal.js): `quarter` flipped to `required: false`, `year` flipped to `required: false`, ADDED optional `window_name: { type: String, trim: true, maxlength: 80 }`. Inline comment block documents deprecation + canonical-source pointer to this strategy doc.
- NEW [scripts/db/verify-goal-schema-relaxation.js](../../../../scripts/db/verify-goal-schema-relaxation.js) — read-only DB audit. Reports (i) counts of existing rows with `quarter`/`year` populated (zero-op confirmation), and (ii) **Risk 3 extension** — counts QUARTERLY sibling date-range overlap pairs under same objective_id. Output feeds the 2.3.2b grandfathering decision in §3.2.
- CARRY-FORWARD: migration note to [CLAUDE.md](../../../../CLAUDE.md) data-model section (`Goal.quarter`/`year` deprecated for custom-period parents) — not in B3a commits; lands at the next /coding session that touches CLAUDE.md.

**LoC** (as shipped): ~10 BE (Goal.js) + ~45 verify script + ~80 regression test (`test-sprint26-A20260514-10-schema-relax.js`) = ~135 total
**Time**: ~0.5h estimated · ~30 min actual
**Depends on**: nothing (greenfield schema change)
**Risk** (post-ship verdict): low — relaxation is zero-op for existing data; no read paths break. Week conditional-required (S25 PX-3.20) preserved. Legacy indexes + `findByQuarter`/`getStatistics` statics preserved per backward-compat invariant #1.
**Regression**: 20/20 ✓ (static + LIVE-FIRE Mongoose validation).
**Status**: 📝 → 💻 → ✅ in single B3a /coding session 2026-05-14.

### 3.2 Sub-slice 2.3.2 — Goal create/update route updates — `A20260514-11` 💻 PARTIAL

> **Amended 2026-05-14** (B3a-post /strategy): split into 2.3.2a (parts 1-3 SHIPPED B3a 2026-05-14) + 2.3.2b (part 2 validator DEFERRED to 2.3.4 per ship-with-consumer principle). Revisions 1+2+3 locked into 2.3.2b spec below. Audit ID A20260514-11 stays single, lifespan spans B3a + 2.3.4; status flips to ✅ when 2.3.2b lands.

#### 3.2a Sub-slice 2.3.2a — Route plumbing (parts 1-3 of -11) ✅ SHIPPED 2026-05-14

**Scope** (as shipped):
- [server/routes/goals.js](../../../../server/routes/goals.js) — 4 routes touched (POST + PUT × QUARTERLY + WEEKLY):
  - `window_name` added to `allowedUpdates` arrays on both PUT handlers (QUARTERLY + WEEKLY)
  - Year-default block on both POST handlers: `if (!goalData.year) goalData.year = goalData.start_date ? new Date(goalData.start_date).getFullYear() : new Date().getFullYear()`
  - Dropped `quarter` from POST `/quarterly` required-fields check + updated error message (schema relaxation in -10 made it optional)
  - `goalData = { ...req.body, ... }` spread preserves `window_name` flow to Mongoose save without extra plumbing (`feedback_reuse_max`)
- Inline `TODO(A20260514-11 part 2 — 2.3.4 Window CRUD UI)` marker at [goals.js:40](../../../../server/routes/goals.js#L40) per `feedback_cleanup_boundary_pattern` — cites Revisions 1+2+3 + wire contract (4 routes mirror B1.4 pattern at lines 1025, 1168)
- `weekly-goals.js` parallel-route follow-up flag from B1.4 carries forward — still owed at the time 2.3.2b ships

**LoC** (as shipped): ~30 BE (goals.js) + ~170 regression test (`test-sprint26-A20260514-11-window-name-route.js`) = ~200 total
**Time**: ~30 min estimated · ~25 min actual
**Depends on**: 2.3.1 ✅ (schema must allow window_name first)
**Risk** (post-ship): low — pure additive plumbing; no destructive changes; year-default is defensive.
**Regression**: 23/23 ✓ (static + LIVE-FIRE Express + stubbed Mongoose).
**Status**: 📝 → 💻 (parts 1-3 of 4; ✅ pending 2.3.2b ship at 2.3.4).

#### 3.2b Sub-slice 2.3.2b — Non-overlap validator (part 2 of -11) ⏳ DEFERRED to 2.3.4

**Scope** (to ship with 2.3.4 Window CRUD UI):
- NEW helper `validateGoalNoOverlap(candidateGoal, company_id)` in [goals.js](../../../../server/routes/goals.js) helpers section, mirroring B1.4's `validateGoalDateHierarchy` pattern (see [goals.js:40](../../../../server/routes/goals.js#L40) for sibling)
- Wire into 4 routes per the Revision 1 scope (see below): POST + PUT × QUARTERLY only
- Returns 400 `GOAL_DATE_OVERLAP` on violation; error body cites the conflicting sibling's `[_id, name, start_date, due_date]`
- New compound index `{objective_id: 1, time_period: 1, start_date: 1}` added to Goal.js index list (one new index, NOT two — see Revision 2)
- Test fixtures: live-fire with stubbed Mongoose mirroring -09/-11 harnesses; cover happy path / boundary touching (must pass — Revision 1 strict less-than) / 3 overlap types (left-edge, right-edge, contained) / Revision 3 grandfathering (parent.time_period_type='calendar_year' skip)

**Revisions locked** (B3a holistic pressure-test 2026-05-14):

| Rev | Decision | Rationale |
|---|---|---|
| **1** | **Scope = QUARTERLY only**. WEEKLY siblings explicitly permitted to overlap. | SD-2 §2.2 strict canon read: "Two QUARTERLY-tier Goals". §3.2 mention of WEEKLY described parent-resolution branching, not check scope. WEEKLY tier is the work-unit layer (parallel team execution); QUARTERLY tier is the phase layer (sequential milestones). |
| **2** | **ONE new compound index** `{objective_id:1, time_period:1, start_date:1}`. Don't "extend" existing `{parent_goal_id:1, time_period:1}` (Goal.js:320). | Mongoose lacks `syncIndexes` calls (grep-confirmed zero across server/). "Extending" would create a SECOND index alongside the old one, bloating index count. Rev-1 dropping WEEKLY scope removed the need for a parent_goal_id-keyed index altogether. |
| **3** | **Grandfathering guard**: skip non-overlap when parent objective's `time_period_type !== 'custom'`. | Legacy calendar_year/fiscal_year objectives often have multiple QUARTERLY goals with `start_date = created_at` (schema default) + `due_date = Dec 31` → all overlap under strict rule. First PUT to any of them would 400-reject after validator ships. Grandfathering protects existing PUTs from regressing while enforcing the rule on new project-mode objectives. |

**Overlap test contract** (Revision 1 + new boundary rule):

```javascript
// QUARTERLY sibling overlap detection (post-Revision 3 guard)
const overlap = sibling.start_date < candidate.due_date
             && candidate.start_date < sibling.due_date;
// Strict less-than → adjacent phases sharing a boundary day pass
// (Build ends Dec 1, Launch starts Dec 1 → no overlap)
```

**Pre-flight at 2.3.4 ship time** (REQUIRED): run `node scripts/db/verify-goal-schema-relaxation.js` on the target environment. If "Total overlapping pair count" > 0 on `time_period_type='custom'` parents (Revision 3 doesn't grandfather them), decide between:
1. **Extend grandfathering**: skip non-overlap when ANY pre-existing sibling overlap exists for the parent (snapshot at validator-ship time)
2. **One-shot data normalization**: script that adjusts dates to remove overlap before validator ships
3. **FE warning UI**: surface overlap on the affected goals before user can PUT them

Decision lands at 2.3.4 /coding session based on actual count + per-objective inspection.

**LoC**: ~50 BE (validator + 4-route wire + index) + ~120 test (~5 LoC less than original estimate since WEEKLY scope dropped)
**Time**: ~30 min (validator) + ~15 min (pre-flight verify + decision) = ~45 min standalone; ships bundled with 2.3.4
**Depends on**: 2.3.1 ✅ + 2.3.2a ✅ + 2.3.4 (validator ships alongside Window CRUD UI as first organic consumer)
**Risk**: low — Revisions 1+2+3 + pre-flight verify make this safe-by-construction.
**Status**: 📝 PLAN (deferred to 2.3.4 ship). When wired: flip -11 to ✅ + flip 2.3.4 to ✅ in same commit.

### 3.3 Sub-slice 2.3.3 — Planning page redesign — `A20260514-12`

**Scope**:
- [client/pages/planning-v2.html](../../../../client/pages/planning-v2.html) — strip prev/next quarter selector markup (verify line numbers at coding time — original /strategy #240 cited lines 27-33 of the wrong file); add new "Active Objectives" list section; add objective-detail panel template — **OR** minimum-amendment scope: surface objective date range on existing OBJ card + rethink the Q1/Q2/Q3 tabs (Options α/β/γ TO BE RE-SCOPED)
- [client/pages/scripts/planning-v2.js](../../../../client/pages/scripts/planning-v2.js) — rewrite state model (active list vs detail mode); strip calendar-quarter filter state; add `selectedObjective` state; new fetch pattern (`GET /api/objectives?status=active` then drill `GET /api/goals/quarterly?objective_id=`) — **OR** minimum-amendment scope per above
- NEW CSS for objective card list + timeline strip + window cards
- Backward link from objectives.html "Plan" button → planning page with `?objective_id=` deep link

**LoC**: ~350 FE + ~100 CSS + ~80 test
**Time**: ~2-2.5h
**Depends on**: 2.3.1 + 2.3.2 (writes must accept the new shape before read UI can rely on it)
**Risk**: medium — biggest LoC slice; FE regression test will be largely static-grep (DOM structure assertions) since live-fire is fragile for HTML

### 3.4 Sub-slice 2.3.4 — Window CRUD UX + auto-split helper + non-overlap validator — `A20260514-13` (+ `A20260514-11` part 2)

> **Amended 2026-05-14** (B3a-post /strategy): 2.3.4 now bundles the deferred A20260514-11 part 2 non-overlap validator (Revisions 1+2+3 locked at §3.2b) as the ship-with-consumer slice. Pre-flight verify-script run added as a required step. ~30 min added to slice time estimate.

**Pre-flight (REQUIRED before any coding)**:

```bash
node scripts/db/verify-goal-schema-relaxation.js
```

Inspect the "QUARTERLY sibling date-range overlap audit" section. If "Total overlapping pair count" > 0 on `time_period_type='custom'` parents (Revision 3 grandfathering doesn't cover these), pick one of three branches before shipping the validator (see §3.2b for full decision tree).

**Scope**:

- **UI surface** (the original 2.3.4 scope):
  - "Add Window" modal — name (optional, defaults "Phase N") + start + end pickers (HTML5 `<input type="date">` with min/max constrained to parent objective's range, mirroring Slice 2.1 wizard pattern per `feedback_reuse_max`)
  - "Edit Window" + "Delete Window" actions (soft delete per CLAUDE.md `status='cancelled'` pattern)
  - "Auto-split into N phases" helper button (visible only when zero windows exist on an objective): modal asks for N (default 3, min 2, max 12), pre-fills equal-length windows + auto-naming ("Phase 1 / Phase 2 / Phase 3"), user can edit each before save
  - BE side: bulk-create endpoint OR reuse existing single-create N times (decide at coding time per `feedback_minimal_change_grounding`)

- **Validator surface** (NEW — A20260514-11 part 2):
  - NEW `validateGoalNoOverlap(candidateGoal, company_id)` helper in [goals.js](../../../../server/routes/goals.js) helpers section (mirrors B1.4 `validateGoalDateHierarchy` pattern at [goals.js:40](../../../../server/routes/goals.js#L40); the inline TODO marker there cites the wire contract)
  - Wire into POST + PUT × QUARTERLY (2 routes — Revision 1 scope; WEEKLY excluded)
  - Returns 400 `GOAL_DATE_OVERLAP` on violation
  - NEW compound index `{objective_id: 1, time_period: 1, start_date: 1}` (Revision 2 — ONE new index, not two)
  - Revision 3 grandfathering guard: skip when parent objective's `time_period_type !== 'custom'`
  - Strict less-than overlap test per §2.2 (boundary day shared = not overlap)

**LoC**: ~250 FE + ~50 BE (UI) + ~50 BE (validator) + ~90 test (UI) + ~120 test (validator) = ~560 total (+~170 vs original)
**Time**: ~2h (UI) + ~30 min (validator) + ~15 min (pre-flight + decision) = ~2.75h
**Depends on**: 2.3.3 ✅ (planning page redesign must exist for modals to attach to) + 2.3.1 ✅ + 2.3.2a ✅ (schema + plumbing already shipped)
**Risk**: medium — auto-split UX is novel (user feedback after Beta may iterate); validator risks mitigated by Revisions 1+2+3 + pre-flight verify.
**Status flips at ship**: A20260514-13 📝 → 💻 → ✅ + A20260514-11 💻 → ✅ (single commit landing both validator wire and UI scope, OR 2 commits within the same /coding session).

### 3.5 Sub-slice 2.3.5 — Dashboard + aggregator KPI reframe — `A20260514-14`

**Scope**:
- [server/routes/consultant.js](../../../../server/routes/consultant.js) `/dashboard-summary` — replace `quarter`-based aggregations with date-range queries; add new computed fields `active_windows`, `windows_ending_in_14d`, `stalled_phases`
- [client/pages/scripts/dashboard-v2.js](../../../../client/pages/scripts/dashboard-v2.js) — KPI strip rewrite (current "0 moves · 0% this week · — momentum" + 3 cards "pushed / forgotten / this week" all get replaced with the new semantics)
- [client/pages/scripts/client-workspace.js](../../../../client/pages/scripts/client-workspace.js) Plan tab — minor label changes (already date-aware after S26 C.1a, just needs SD-5 wording)
- Note: this overlaps with the deferred Session C (Dashboard-v2 honesty pass + chores actions). If Session C ships first, 2.3.5 inherits its KPI strip and just adjusts semantics; if 2.3.5 ships first, Session C inherits the new strip and adds chores actions on top. Coordinate at scheduling time.

**LoC**: ~150 BE + ~80 FE + ~80 test
**Time**: ~1.5h
**Depends on**: 2.3.1 + 2.3.2 (window_name in payload), 2.3.3 (planning page exists to navigate to from KPIs)
**Risk**: low — semantic refactor, no model changes

---

## 4. B3 Execution Plan

**Total B3 epic**: ~700 LoC code + ~345 LoC tests across 5 sub-slices.
**Estimated**: ~8 hours of `/coding`.
**Suggested split**: 2-3 sessions.

### 4.1 Session-split recommendation

> **Amended 2026-05-14** (B3a-post /strategy): 3-session map → 4-session map. B3a shipped as 2.3.1 + 2.3.2a (parts 1-3 of -11; part 2 validator deferred). Original B3b mega-session (2.3.3 + 2.3.4) split into B3b (2.3.3 alone) + B3c (2.3.4 + 2.3.2b validator combined) to honor ship-with-consumer principle + keep each /coding session within the <4h budget rule of thumb. B3d = original B3c = 2.3.5.

| Session | Sub-slices | Duration (est) | Status | Rationale |
|---|---|---|---|---|
| **B3a** `/coding` | 2.3.1 + 2.3.2a (schema + route plumbing) | ~1h | ✅ SHIPPED 2026-05-14 | Backend foundation. Independent of FE. 2 feat commits + 1 docs /close commit. -11 part 2 validator deferred to B3c per holistic pressure-test. |
| **B3b** `/coding` | 2.3.3 alone (planning page redesign) | ~2-2.5h | ⏳ PENDING (scope TO BE RE-SCOPED) | Targets [planning-v2.html](../../../../client/pages/planning-v2.html) + [planning-v2.js](../../../../client/pages/scripts/planning-v2.js) (not the deleted legacy `quarterly-goals.html` cited at original /strategy #240 mint). Kills calendar quarter selector; adds "Active Objectives" entry view + drill-in single-objective Plan view — **OR** minimum-amendment scope (date-on-card + Q1/Q2/Q3 tab rethink) per Options α/β/γ TO BE RE-SCOPED. Legacy calendar_year objectives render same shape (timeline + windows derived from existing Q1-Q4 goals as informational labels). |
| **B3c** `/coding` | 2.3.4 + 2.3.2b (Window CRUD UX + non-overlap validator) | ~2.75h | ⏳ PENDING | Window CRUD modals + Auto-split helper + the deferred A20260514-11 part 2 validator (Revisions 1+2+3 locked at §3.2b). Pre-flight verify-script run REQUIRED before shipping the validator (decision branch if overlap count > 0 on `time_period_type='custom'` parents). Single commit landing both -13 + -11 ✅ together. |
| **B3d** `/coding` | 2.3.5 (dashboard/aggregator KPI reframe) | ~1.5h | ⏳ PENDING | Last to ship — depends on B3a + B3b + B3c being in. Optionally bundles with deferred Session C (Dashboard-v2 honesty pass + chores actions) — coordinate at scheduling. |

**Total B3 epic time**: ~7-7.5h across 4 sessions (vs. original 3-session estimate of ~7h — minor +0.5h tradeoff buys cohesive scoping + ship-with-consumer correctness).

### 4.2 Dependency graph

> **Amended 2026-05-14** (B3a-post /strategy): 2.3.2 split into 2.3.2a (shipped) + 2.3.2b (deferred); 2.3.2b folded into 2.3.4 as its first organic consumer.

```
2.3.1 (schema) ✅ SHIPPED B3a
  │
  ├──→ 2.3.2a (route plumbing — window_name + year default) ✅ SHIPPED B3a
  │       (parts 1-3 of A20260514-11)
  │
  └──→ 2.3.3 (FE planning page redesign) ⏳ B3b
         │
         └──→ 2.3.4 (Window CRUD UX + auto-split) ⏳ B3c
                │     + 2.3.2b (non-overlap validator) ⏳ B3c
                │       (part 2 of A20260514-11 — ships with first consumer)
                │
                └──→ 2.3.5 (dashboard/aggregator KPI reframe) ⏳ B3d
```

### 4.3 Backward-compat invariants

Every sub-slice MUST preserve these (regression script for each):

1. **Calendar-year objectives still work**: existing Goals with `quarter='Q3', year=2025` keep loading + displaying without errors. Plan view for a calendar_year objective renders the same way as custom (timeline + windows, just with Q1-Q4 windows pre-existing in data).
2. **B1.4 hierarchy enforcement stays green**: `validateGoalDateHierarchy` continues to fire on the 4 routes; tests pass.
3. **B1.2 KR prompt enrichment unaffected**: AI generation flow doesn't read planning windows yet — independent.
4. **C.1a consultant workspace tabs (Profile/Objectives/Plan/Summary/Teams) keep working**: Plan tab in particular reads `quarterly` + `weekly` arrays — already date-aware.
5. **Sprint 23 #190 wizard regression**: 76/76 ✓ stays green.

### 4.4 Out-of-scope for B3

These belong to refinement-track post-Beta:

- **Window templates** (consultant pre-defines "3-phase project" template that auto-creates Discovery/Build/Launch for any client objective) — UX research first
- **Window dependencies** (Window B can't start until Window A is complete) — adds graph complexity; needs separate strategy session
- **Cross-objective windows** (e.g., "Q3 strategy review" spanning multiple objectives) — contradicts per-objective model; defer
- **`weekly-goals.js` route validation wire-through** (flagged in B1.4 commit) — still owed, but folds best into B3a or a separate /audit-driven slice

---

## 5. Memory rules applied (decision provenance)

- **`feedback_why_what_how_when`**: user's "Let's reevaluate these questions" trigger forced a Why-first revisit BEFORE locking SDs. The reframe ("OKRs are not annual; consultants onboard whenever") was surfaced + understood before any (a/b/c) options were re-proposed.
- **`feedback_minimal_change_grounding`**: schema additions = 1 field. Quarter+year stay (deprecated, not deleted). Existing data is zero-op. Per-objective navigation is the smallest UX change that honors the reframe — removes the relic without redesigning the data model.
- **`feedback_reuse_max`**: `Goal.start_date` + `Goal.due_date` already exist and B1.4 already enforces hierarchy — Slice 2.3 reuses both. The `<input type="date">` pattern from Slice 2.1 wizard reused for Window CRUD modal (2.3.4). C.1a's date-aware Plan tab (already shipped) feeds 2.3.5 with minor label changes.
- **`feedback_extend_before_wrap`**: extend `validateGoalDateHierarchy` (from B1.4) with sibling-overlap check; do NOT spin a new validator. Extend existing planning page (`planning-v2.html`/`planning-v2.js` — production target per navigation.js) with branched render; do NOT create a parallel `planning-windows.html`.
- **`feedback_no_destructive_without_greenlight`**: 5 SDs surfaced with all 3 options each; user picked + greenlit each one BEFORE any code is written in B3. The user said "I clocked the decisions now" — explicit lock per memory rule.
- **`feedback_quote_the_canon`**: ACTIVATION_PLAYBOOK's "drivers / ball position" framing not relevant here — planning cascade is a separate canon. Reference list maintained: SPRINT26_MASTER_PLAN, SPRINT26_PAGE_MATRIX, this doc, AUDIT_TRACKER A20260514-10..-14 rows.
- **`feedback_audit_governance`**: 5 sub-IDs minted in PLAN state up front; AUDIT_TRACKER summary tally updates at /close commit; sub-slice rows flip 📝→💻→✅ as B3 ships each.

---

## 6. Sign-off

### Original sign-off (2026-05-14 /strategy #240)

- **Decisions locked**: 2026-05-14 /strategy session #240 (user: "I agree with your recommendations. I clocked the decisions now.")
- **Audit IDs minted**: 5 (A20260514-10 through A20260514-14)
- **Execution defer**: B3 `/coding` next session per user direction ("let's do the coding session later")
- **Branch**: `development`, working tree pending B2 doc commit
- **Carry-forward from B1**: 21 commits ahead of origin (4 new from B1 + 17 pre-existing)

### Amendment sign-off (2026-05-14 /strategy #243, post-B3a)

- **Decisions locked**: 2026-05-14 /strategy session #243 (user: "agreed. Let's go ahead and do it." — after scenario walkthrough + corner-case pressure-test for all 5 original amendments + 2 new locks surfaced)
- **6 lock changes applied**: see Amendment Log at top of doc
- **Revisions 1+2+3** (from B3a holistic pressure-test): explicit locks at §2.2 SD-2 + §3.2b 2.3.2b spec
- **New rules added**: strict less-than overlap test (§2.2); pre-flight verify-script REQUIRED before 2.3.4 ships validator (§3.4)
- **Session map**: 3 sessions → 4 sessions (§4.1)
- **Audit IDs**: -10 ✅; -11 💻 PARTIAL (parts 1-3 shipped; part 2 carries to 2.3.4); -12/-13/-14 still 📝 PLAN
- **No sub-ID minted for -11 part 2**: kept single ID per Q-X=(a) decision (AUDIT_TRACKER PARTIAL row + TODO marker + 4-session map provide governance without sub-ID overhead)
- **Sprint 26 firing status**: 13/24 (was 12/24 pre-B3a; -10 SHIPPED added one firing slice; -11 stays 📝 firing-pending until part 2 lands at B3c)
- **Branch**: `development`, 10 commits ahead pre-amendment

**Next session (post-amendment)**: `/coding` B3b (sub-slice 2.3.3 — planning page redesign, ~2-2.5h). Alternative: `/coding` A20260513-08b HIGH (Invitation.js URL fallback chains × 2, ~10 LoC).
