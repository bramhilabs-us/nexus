# Bug-fix Bundle — Dashboard regression + Reassign-owner UX + Consultant-workspace display bugs

**Created**: 2026-06-02 (post /close session #278, during karvia-business-1 walk)
**Read by**: `/init` or `/coding` at next session start
**Delete after**: all bundled bug fixes shipped + verified on karvia-business-1
**Bundle decision (2026-06-02)**: user direction — "lets do all the bug fixes, lets pick up the other bugs we had also and package it". Audit-tracker scan confirmed remaining OPEN bug-grade items (A20260517-01 / -18-01 / -18-02 / -18-03 / -18-04) all already FIXED; only A20260515-01 Multi-Account Login remains OPEN but user explicitly deferred post-Beta. Bundle = today's 2 dashboard bugs + 4 RT-* bugs from REFINEMENT-BACKLOG.

---

## Session A status (2026-06-02 /coding) — 4 of 6 shipped

| Fix | Status | Surface | Commit context |
|---|---|---|---|
| Bundle-Fix 1 (Move user-filter) | ✅ SHIPPED | [server/routes/moves.js:54](../server/routes/moves.js#L54) | One-line additive filter `assigned_to: userId` |
| Bundle-Fix 2 (text-button removal) | ✅ SHIPPED merged with 4 | [client/pages/scripts/objectives.js](../client/pages/scripts/objectives.js) | Re-planned during /coding after impact analysis surfaced that text-button + avatar called DIFFERENT endpoints. Merged into one stroke. |
| Bundle-Fix 3 (auto-Move-creation reversal) | ⏳ DEFERRED to Session B | wizard/AI pipeline grep needed | Gated on user policy decision |
| Bundle-Fix 4 (reassign-owner loader) | ✅ SHIPPED merged with 2 | objectives.js — avatar now uses `/api/teams/eligible-owners` (canonical) instead of `/api/users` (legacy) | Drift findings D1 (gate divergence) + D2 (consultant cross-tenant) + D4 (cache staleness) + D5 (empty-state copy) all resolved |
| Bundle-Fix 5 (false 100% progress) | ✅ SHIPPED | [client/js/common.js:282](../client/js/common.js#L282) | Root cause was `escapeHtml(0)` returning `""` because `!text` swallows zero. One-line fix `text === null || text === undefined`. Unit-tested in isolation: 10/10 pass. |
| Bundle-Fix 6 (Teams tab 4 bugs) | ⏳ DEFERRED to Session B | client-workspace.js + consultant teams GET | Half-day grind; bundled with Fix 3 in Session B |

**New RT captured during Session A**: `RT-ESCAPE-HTML-DUPLICATES` — 9 other file-local `esc` helpers across client/ have the same `if (!text) return ''` bug. Logged to REFINEMENT-BACKLOG/README.md for a sweep. Session A canonical fix unblocks all consumers that call through `KarviaCommon.escapeHtml`.

**Session A diff stats** (3 files touched):
- `server/routes/moves.js` — +1 word in one query
- `client/js/common.js` — +5 lines (NaN guard + comment); 1 line behavior changed
- `client/pages/scripts/objectives.js` — ~−70 net lines (deleted text-button + openReassignOwnerDialog + getTeamMembers legacy /api/users path + teamMembersCache; added fetchEligibleOwners + dropped cache + tightened gates)

**Session B remaining** (gated on policy + larger scope, ~5-8h):
- Bundle-Fix 3 — auto-Move-creation reversal: grep `Move.create|new Move(` in wizard/AI pipeline, identify auto-mint sites, get user policy decision, disable + optional cleanup script.
- Bundle-Fix 6 — Teams tab 4 sub-bugs (manager column blank, member count blank, AVG SSI KPI inconsistency, "0 members" subline rename).

---

## What the user observed (2026-06-02 on karvia-business-1)

Logged in as **Sagar RS (CONSULTANT)** at karvia-business-1.onrender.com/pages/dashboard-v2.html. Dashboard shows:

1. **Cards in "Moves" section** (BUILDING / MOVING two-column UI from Sprint 23 #192b) listing 4 tasks: "Confirm KR scope...", "Audit current site UX funnel...", "Pull analytics + tracking baseline...", "Build competitor benchmark matrix (top 6-10)" — all under the Objective `Redesign Northern Medical Group website to increase conversion by 25% in 2026`.

2. **Each Move-card avatar = "R"** (NOT Sagar's "SR") — meaning these are assigned to a **team member**, not the logged-in consultant.

3. **Chores section** below — appears empty or near-empty.

**User's words** (verbatim):
> "we had a nice dashboard, where we had moves and chores, all the tasks will go as part of chores -- am not sure why this change was made"
> "the chores were assigned to my team member but it showing in dashboard as a consultant i have logged in"

User's mental model: **Chores = default bucket for every Task. Moves = small curated set, intentional, behavioral.** Current behavior inverts that — tasks default to Moves.

---

## Root cause — two distinct bugs, one symptom

### Bug A: `/api/moves/dashboard-summary` doesn't filter Moves by user

[`server/routes/moves.js:54`](../server/routes/moves.js#L54):

```js
Move.find({ company_id: companyId, status: { $ne: 'cancelled' } })
  .populate('assigned_to', 'name email role')
  .lean(),
```

**Filter is `company_id` only.** Every user in the company sees every Move on their dashboard, regardless of assignment.

Compare with the chores branch at [`server/routes/moves.js:65`](../server/routes/moves.js#L65):

```js
Task.find({ company_id: companyId, assigned_to: userId, status: { $nin: ['completed', 'cancelled'] } })
  .lean(),
```

**Tasks ARE filtered by `assigned_to: userId`.** Chores correctly only show the logged-in user's own.

**Impact**: Sagar (CONSULTANT) sees Moves assigned to "R" (team member). Any role in the company tenant sees all Moves. This is a **tenant-isolation / role-visibility leak** — violates the spirit of `feedback_two_app_model` memory ("Dashboard shows MY work"). Not a cross-tenant leak (still scoped by `company_id`), but a cross-USER leak inside the tenant.

### Bug B: Tasks are being promoted to Moves by default

The dedup logic at [`server/routes/moves.js:218-222`](../server/routes/moves.js#L218):

```js
const moveKeys = new Set();
for (const m of moves) {
  if (m.weekly_goal_id) moveKeys.add(`${m.weekly_goal_id}::${m.title}`);
}
const choresInScope = MoveDashboardService.filterChoresForToday(
  tasks.filter(t => !moveKeys.has(`${t.goal_id}::${t.name}`)),
  now
);
```

**Rule**: a Task is shown as a Chore ONLY if no Move row exists with matching `(weekly_goal_id, title)`. If a matching Move row exists → Task disappears from Chores and shows as a Move card.

**The question**: who/what is creating these Move rows for every Task?

Hypothesis 1 (most likely): Sprint 23 #192b "Move classification + telemetry scaffold" auto-creates a Move per Task at planning or generation time. Need to grep for `Move.create(` or `new Move(` in the planning/task pipeline.

Hypothesis 2: There's an Objective/Wizard finalize path that mints Move rows from generated KRs/Tasks.

Hypothesis 3: A migration/backfill script auto-classified all existing Tasks into Moves.

User's mental model says: Move should be opt-in (manual classification or behavior-AI-tagged), Chore should be default. Current state: Move is default; Chore is residual.

---

## Hot-fix scope for next session (~2-3h focused work)

### Fix 1 — Add user-assignment filter to Moves query (10 min, security/visibility critical)

[`server/routes/moves.js:54`](../server/routes/moves.js#L54):

```diff
- Move.find({ company_id: companyId, status: { $ne: 'cancelled' } })
+ Move.find({ company_id: companyId, assigned_to: userId, status: { $ne: 'cancelled' } })
    .populate('assigned_to', 'name email role')
    .lean(),
```

**Verification**:
- Sagar (CONSULTANT) logs in → sees only Moves assigned to him (likely 0 → empty state)
- Team member "R" logs in → sees only their own Moves
- Edge case: if Move has no `assigned_to` (orphan), it disappears from all dashboards — acceptable for hot-fix; surface in audit as separate concern.

### Fix 2 — Investigate auto-Move-creation pipeline (1-2h)

Grep tree:
- `grep -rn "Move\.create\|new Move(" server/` — find every Move creation site
- `grep -rn "task.*Move\|Move.*task" server/` — find Task↔Move coupling
- Check `server/routes/objective-wizard.js` finalize handler for auto-Move mint
- Check `server/services/aiOKRService.js` or KR-generation for auto-Move mint
- Check any Sprint 23-26 migration scripts in `scripts/` for backfill

Once located: decide policy with user — should `objective-wizard.finalize` auto-create Move rows from generated Tasks? User direction strongly suggests NO. Tasks ship to the Task pipeline; Moves are a separate optional classification.

### Fix 3 — Cleanup existing auto-created Move rows on dev DB (30 min if needed)

If we identify a backfill script created Move rows for every Task: run a cleanup script to set those Moves to `status='cancelled'` (soft-delete, reversible) OR delete them outright if confirmed safe. **Do not run on production**; dev/pre-prod only for now.

### Fix 4 — Verify Chores section renders correctly post-fix (15 min)

After Fix 1 + Fix 2 + Fix 3:
- Sagar dashboard should show his Tasks in the Chores section (simple list, no BUILDING/MOVING cards)
- Moves section should be empty or show ONLY explicitly-classified Moves
- KPI strip "moves: N" should reflect the new (lower) count

### Total estimate: 2-3h for Fix 1 (quick win) + 1-2h for Fix 2 investigation + decision

Fix 1 is a one-line change with high security value — ship immediately on `development` branch, verify on karvia-business-1.

Fix 2-4 require user direction on the policy question: **should objective-wizard auto-create Moves at all?**

---

## What changed and when (git history reflection)

- **Sprint 23 #192a** (`83fdaba`): "Navy theme alias + Tasks->Moves display rename + display label constants" — *display* rename of Tasks → Moves.
- **Sprint 23 #192b** (`2530cf2`): "Dashboard V3 + Move classification + telemetry scaffold (Epic G Phase B)" — introduced the Move classification + the v3 dashboard with two-column Move cards (BUILDING/MOVING). Likely also the auto-Move-creation seam.
- **Sprint 24 #201** (`562582a`): "Epic 24.2 + 24.8 B-6 — page-reuse profile + Move postpone_reason"
- **Sprint 26 A20260520-03** (`651d62b`): "Employee CHORES actions + objective at-risk temporal guard" — preserved the Chores section, added chore-row actions. This commit is evidence that Chores ARE still a canonical surface; they just got out-competed by auto-Move-classification.

**Inflection point**: Sprint 23 Epic G Phase B was the moment the Moves classification was introduced. Whatever auto-creates Moves from Tasks landed in `2530cf2`. That's the commit to reverse-engineer first.

---

## Reflection — why this drift happened

Per memory `feedback_state_parsimony` (locked 2026-06-01): every persisted value must justify its cost. The Move table is a parallel persistence layer alongside Tasks — same surface, two storages.

Per memory `feedback_minimal_change_grounding`: smallest amendment to existing plan. Sprint 23 #192b introduced Move classification as a NEW surface instead of adding `Task.classification = 'move' | 'chore'` field. Two tables for one concept means: (a) auto-sync logic to keep them aligned (b) dedup logic in the read path (c) double the write surface.

The pattern S27 nailed (5 consecutive zero-production composite-ships via `feedback_canonical_engine_grounding`) suggests the right fix posture: don't add Move tables; classify Tasks. But that's a refactor, not a hot-fix.

**Hot-fix posture**: apply Fix 1 immediately (security/visibility), then quickly close Bug B by either disabling the auto-Move-creation pipeline OR adopting Move as the canonical surface AND filtering by user. User direction needed at /coding kickoff to pick which fork.

---

## Next-session opening prompt

> Read [.claude/HOTFIX_DASHBOARD_NOTES.md](.claude/HOTFIX_DASHBOARD_NOTES.md). This is a **bundled bug-fix session** — 6 bugs in priority order. Ship Bundle-Fix 1 (Dashboard Move query user-filter) FIRST as a security-grade one-liner. Then Bundle-Fix 2 (objectives.html reassign-owner duplicate removal) as a cheap UI win to build momentum. Investigate Bundle-Fix 3-6 in declared order. Confirm policy with me before any destructive cleanup (Bundle-Fix 3 auto-Move-creation reversal). Target completion: 1-2 /coding sessions.

---

## Bundled bug-fix scope (full ordered list)

The bundle below merges today's 2 dashboard observations (Bug A + B above) with 4 RT-* bugs already captured in [REFINEMENT-BACKLOG/README.md](../KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/REFINEMENT-BACKLOG/README.md). Order chosen by: (a) security/visibility priority, (b) cost-to-fix (cheap wins build momentum), (c) dependency chain (some fixes unlock or invalidate others).

### Bundle-Fix 1 — Dashboard Move query user-filter (security-grade, 10 min) 🔴

**Source**: Bug A above
**Surface**: [server/routes/moves.js:54](../server/routes/moves.js#L54)
**Change**: Add `assigned_to: userId` to the `Move.find()` filter (mirror the sibling Task.find at line 65).
**Verification**: Sagar (CONSULTANT) logs in → sees 0 Moves or only his own; team member "R" logs in → sees only "R"'s Moves; second consultant logs in → sees only their own.
**Why first**: visibility leak inside tenant — Sagar saw Moves assigned to team member. Cheapest + highest-value fix.

### Bundle-Fix 2 — Remove duplicate "Reassign owner" button on objective card (~30 min) 🟡

**Source**: [`RT-OBJECTIVES-CARD-REASSIGN-DUPLICATE`](../KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/REFINEMENT-BACKLOG/README.md) (captured 2026-06-02)
**Surface**: [client/pages/scripts/objectives.js](../client/pages/scripts/objectives.js) — role-aware action-row builder consuming the 8-state matrix (`getObjectiveCardState`)
**Change**: Locate the "Reassign owner" text-button entry in the card-CTA row; remove. Verify the bottom-right owner-avatar remains the sole reassign entrypoint.
**Verification**: objective card on objectives.html shows `Plan this objective →` · `Edit KRs` · `Cancel` · `Delete` · `✨ AI` · `[avatar]` — no separate "Reassign owner" text button.
**Why second**: cheap visual cleanup; momentum builder.
**Cross-link**: surface area is the same file as the 8-state matrix consumer touched in S27 E.4; verify no regression on the matrix card-CTA tests.

### Bundle-Fix 3 — Dashboard auto-Move-creation investigation + policy call (~2-3h + user decision) 🔴

**Source**: Bug B above
**Investigation surfaces**: grep `Move.create\|new Move(` across server/, focus on `server/routes/objective-wizard.js` finalize handler + `server/services/aiOKRService.js` + any Sprint 23 migration scripts in `scripts/`
**User policy decision needed**: should objective-wizard / KR-generation / AI-task-classification auto-create Move rows at all? Recommended NO — Moves opt-in only.
**Three forks after grep**:
- (A) Pipeline auto-creates Moves at wizard.finalize → disable that branch
- (B) Pipeline auto-creates Moves at task creation → disable
- (C) Pipeline auto-creates Moves via cron/backfill → disable + cleanup script (cancel-out auto-Moves on dev DB)
**Verification**: after fix, new Tasks land in Chores by default; Moves section is empty unless explicitly classified.
**Why third**: requires investigation + your policy call before code; do AFTER Fix 1 lands so the security gate is in place even if Fix 3 takes longer.

### Bundle-Fix 4 — Reassign-owner avatar fails to load team members (~2-3h) 🟡

**Source**: [`RT-OBJECTIVES-REASSIGN-OWNER-LOADER-BUG`](../KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/REFINEMENT-BACKLOG/README.md) (captured 2026-06-02)
**Surfaces**: `GET /api/teams/eligible-owners` (canonical endpoint per S26 F.1 + S27 F.6) + FE caller in [client/pages/scripts/objectives.js](../client/pages/scripts/objectives.js) (search for the avatar-click handler that calls eligible-owners)
**Investigation**: open Network tab on repro, capture exact request/response shape; verify (a) endpoint path correct, (b) FE payload shape correct (`company_id` + `objective_id`?), (c) eligibility predicate not over-filtering. Two error toasts observed — "Failed to load team members" suggests fetch failure; "No eligible owners available to reassign to" suggests empty result with no MANAGER+EXECUTIVE candidates.
**Cross-link**: likely correlates with `RT-DEFAULT-TEAM-BO-MEMBERSHIP` (BO not in default team → no eligible MANAGER/EXECUTIVE → empty result). Fix Bundle-Fix 4 first then check whether that correlated bug self-resolves; if not, escalate to next session.
**Verification**: clicking owner avatar on objective card opens a member-picker modal with eligible owners listed; if list is empty, copy reads "No other eligible owners — invite a Manager/Executive first" (non-alarming).

### Bundle-Fix 5 — Consultant client-workspace Objectives tab false-completed progress bar (~1-2h) 🟡

**Source**: [`RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG`](../KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/REFINEMENT-BACKLOG/README.md) (surfaced 2026-05-29)
**Surfaces**: [client/pages/scripts/client-workspace.js:636-637](../client/pages/scripts/client-workspace.js#L636-L637) (FE destructuring) + likely a BE endpoint returning sparse `kr_rollup` shape when KRs have no children
**Change**: BE — ensure rollup endpoint always returns fully-populated `kr_rollup` (`total`/`on_track`/`at_risk`/`behind`/`avg_progress_pct` all zero-filled). FE — harden destructuring with `??` and per-field defaults (belt-and-suspenders).
**Verification**: consultant opens client-workspace.html?tab=objectives for a fresh client objective with no plan → progress bar shows 0% (not 100%/red); KR mix row shows `4 KRs · 4 on track · 0 at risk · 0 behind` (not blanks).

### Bundle-Fix 6 — Consultant client-workspace Teams tab display bugs (4 issues, ~half day) 🟡

**Source**: [`RT-CONSULTANT-TEAMS-TAB-BUGS`](../KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/REFINEMENT-BACKLOG/README.md) (surfaced 2026-05-29)
**Surfaces**: [client/pages/scripts/client-workspace.js:1526-1591](../client/pages/scripts/client-workspace.js#L1526) (FE rendering) + consultant-scoped teams GET endpoint (likely needs `.populate('manager_id', 'name')` + ensure `manager_name` returned + member_count rollup correctness)
**4 sub-bugs**:
- Manager column blank for Default team (populate / denormalize fix)
- Member count blank instead of "0" (esc/render fix)
- AVG SSI BY TEAM contradicts ASSESSMENT COMPLETION (KPI source consistency)
- TEAMS card "0 members" misleading when 1 user is unassigned (subline rename)
**Verification**: client-workspace.html?tab=teams for a default-team-only client → Manager column shows name, "0 members" not blank, KPI cards internally consistent.
**Cross-link**: ASSUME `RT-DEFAULT-TEAM-BO-MEMBERSHIP` from earlier S29 candidates is NOT shipping in this bundle (separate scope). Document accordingly.

---

## Effort total + sequencing recommendation

| Fix | Effort | Risk | Cum. effort |
|---|---|---|---|
| Bundle-Fix 1 | 10 min | LOW | 0.2h |
| Bundle-Fix 2 | 30 min | LOW | 0.7h |
| Bundle-Fix 3 (Investigation + policy call) | 2-3h | MED — needs your decision | 3.7h |
| Bundle-Fix 4 | 2-3h | MED | 6.7h |
| Bundle-Fix 5 | 1-2h | LOW | 8.7h |
| Bundle-Fix 6 | 3-4h | LOW-MED (4 sub-bugs) | 12.7h |
| **Total** | **~9-13h** | | |

**Recommended split**: 2 focused /coding sessions —
- **Session A (~4-5h)**: Bundle-Fix 1 + 2 + 4 + 5 (cheap+medium, no policy gate)
- **Session B (~5-8h)**: Bundle-Fix 3 (after your policy decision) + Bundle-Fix 6 (4-sub-bug grind)

Or one long session if you want it done in one day. Either way, ship to development → push → verify on karvia-business-1 between fixes.

---

## Audit-tracker scan result (2026-06-02)

Per Explore-agent scan of [AUDIT_TRACKER.md](../KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md) (1361 lines, 33 OPEN findings) for additional user-facing bug-grade items to bundle:

| Audit ID | Item | Verdict |
|---|---|---|
| `A20260517-01` | Manager team visibility + invite permission gap | ✅ Already FIXED 2026-05-17 — no rework |
| `A20260518-01` | Portfolio KPI/list reconciliation drift | ✅ Already FIXED 2026-05-19 (P4 cross-screen sweep deferred) |
| `A20260518-02` | Manager-team-management FE affordance gaps | ✅ Already FIXED 2026-05-19 |
| `A20260518-03` | Assessment-question-filter dropped at dispatch | ✅ Already FIXED 2026-05-19 |
| `A20260518-04` | Default-team pollution in team-ssi-view | ✅ Already FIXED 2026-05-19 |
| `A20260515-01` | Multi-Account Login non-deterministic | 📝 OPEN — **user explicitly deferred post-Beta**. Skip from bundle. ~1-1.5h Option A available if user reverses. |

**Net**: no additional bundle items from audit tracker beyond what's already captured. The 6 Bundle-Fixes above are the complete user-facing bug surface as of 2026-06-02.

---

## Carry-forward + Open Questions

1. **Policy question (for /coding kickoff)**: should `objective-wizard.finalize` (or any other pipeline) auto-create Move rows from generated Tasks? Recommended default: NO. Moves are intentional.
2. **Cleanup scope**: do we cancel-out auto-created Move rows on dev DB, leave them in place, or migrate them to a `classification='move'` field on Task itself (longer refactor)?
3. **Reassign-owner avatar bug** (already captured in [REFINEMENT-BACKLOG/README.md](../KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/REFINEMENT-BACKLOG/README.md) as `RT-OBJECTIVES-REASSIGN-OWNER-LOADER-BUG`) may correlate with this fix — "No eligible owners" toast may trace back to user-filter mismatches in the same code area. Worth grep-cross-checking when Fix 1 lands.

---

## References

- [server/routes/moves.js:54](../server/routes/moves.js#L54) — Move query (Fix 1 target)
- [server/routes/moves.js:65](../server/routes/moves.js#L65) — Task query (correct user-filter precedent)
- [server/routes/moves.js:218](../server/routes/moves.js#L218) — chore dedup logic (Fix 2 surface)
- [server/services/MoveDashboardService.js](../server/services/MoveDashboardService.js) — chore-filter delegation (read before changing dedup)
- [client/pages/scripts/dashboard-v2.js:497](../client/pages/scripts/dashboard-v2.js#L497) — `renderChores` (FE consumer)
- [client/pages/scripts/dashboard-v2.js:276](../client/pages/scripts/dashboard-v2.js#L276) — `renderMovesGroups` (FE consumer)
- Memory: `feedback_two_app_model` — "Dashboard shows MY work" invariant
- Memory: `feedback_state_parsimony` — parallel persistence layers must justify cost
- Memory: `feedback_canonical_engine_grounding` — classify on existing surface (Task), don't add parallel
