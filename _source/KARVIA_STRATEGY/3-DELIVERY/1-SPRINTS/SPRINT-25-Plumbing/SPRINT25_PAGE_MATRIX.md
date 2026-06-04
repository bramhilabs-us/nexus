# Sprint 25 — Page Matrix & Conflict Analysis

<!-- @GENOME T3-SPR-025-PAGEMATRIX | ACTIVE | 2026-05-08 | parent:T3-SPR-025-MP | auto:- | linked:/sprint-review,/coding,/audit -->

**Source**: `/sprint-review` post-Sprint 24, pre-Sprint 25 launch (2026-05-08)
**Purpose**: Validate S25 readiness; surface page-overlap conflicts vs S24 (closed) and S26 (downstream)
**Verdict**: 🟢 **GREEN — S25 cleared to launch**

---

## Sprint Type

S25 is a **foundational/plumbing sprint** — explicitly user-invisible. Acceptance criteria are mechanical (single-write enforcement, schema field drops, route deletes, migration scripts). FE work is minimal and conditional.

| Layer | Task share | Notes |
|---|---|---|
| Backend (BE) | ~30/47 (~64%) | routes, schema, migrations, services |
| Frontend (FE) | ~5/47 (~11%) | sweep + 2-3 conditional fixes |
| Strategy/Doc | ~12/47 (~26%) | Day-1 batched decisions, Phase 1 verification doc, 4 sprint-close deliverables (PX-5.1–5.4) |

---

## S25 Page Matrix

### Frontend pages touched

| Page / File | Phase / Task | Change Type | Risk |
|---|---|---|---|
| `client/pages/scripts/objectives.js` | PX-1.1 (read-verify) | No change — verify `showEmptyState()` definition | None |
| `client/pages/scripts/objectives.js` | PX-2.3 (conditional, **SKIPPED**) | Define if missing — **already defined at line 662** (verified 2026-05-08) | N/A |
| `client/pages/objectives.html` | PX-1.4 (read-verify) | No change — verify "regenerate KRs" affordance | None |
| `client/pages/objectives.html` + `objectives.js` | PX-2.5 (conditional) | Wire standalone "regenerate KRs" affordance | Low — additive |
| AIOKRSuggestion review surface | PX-2.4 (conditional) | Build minimal review-pending UI (page TBD; likely consultant-side) | Medium — net-new surface |
| `client/pages/scripts/planning-v2.js` | PX-3.4, PX-3.5 | Remove `/api/goals/weekly/${id}` PUT call (line 2309); update assignment dropdown handler | Low — single caller, post-S23 cleanup tail |
| FE-wide sweep | PX-3.4 | grep & remove any other legacy `/api/goals/weekly/*` write callers | Low — sweep mechanical |
| `client/js/display-labels.js` | PX-1.6 (read-verify) | No change — verify consultant mapping populated (✅ shipped S24 #199) | None |

### Backend files touched (high-impact only)

| File | Tasks | Change |
|---|---|---|
| `server/routes/goals.js` (lines 1216-1567) | PX-3.8, PX-3.14 | 410 Gone, then full block delete |
| `server/routes/objectives.js` POST | PX-3.6 | Drop embedded `key_results[]` dual-write |
| `server/routes/objective-wizard.js` finalize | PX-3.6 | Same — write to standalone `KeyResult` only |
| `server/models/Objective.js` | PX-3.18 | Drop embedded `key_results[]` schema field |
| `server/models/Goal.js` | PX-3.15 | Delete `time_period:'WEEKLY'` rows from collection |
| `server/services/StageTransitionService.js` | PX-2.2 | Wire inline `notifyTransition()` helper at entry points |
| `server/services/AIObjectivePlanner.js` | PX-4.1 (conditional) | Retire if duplicate of `aiOKRService` |
| `/api/ai-okr/*` route block | PX-4.2 (conditional) | Retire if duplicate of `/api/objective-wizard/*` |
| `OKRRecommendationService` | PX-4.3 (conditional) | Retire if dead, wire if live |
| `services/WeeklyGoalConsolidation.js` | PX-3.3 | NEW — port `legacyWeekToISO()` helper |
| `scripts/db/migrate-legacy-weekly-to-new.js` | PX-3.7 | NEW — idempotent migration script |
| `routes/planning.js` `/goals/weekly` | PX-3.16 | Delete (overlaps `/api/weekly-goals/`) |

---

## Cross-Sprint Page Overlap Analysis

### S24 (closed) → S25 — pages potentially shared

| Page | S24 last-touch | S25 touch | Conflict? | Verdict |
|---|---|---|---|---|
| `client/js/display-labels.js` | #199 (created) | PX-1.6 read-only verify | No | 🟢 S25 reads what S24 wrote |
| `client/pages/scripts/objectives.js` | not touched in S24 | PX-1.1 verify; PX-2.5 conditional touch | No | 🟢 S24 left page untouched; S25 owns it |
| `client/pages/scripts/planning-v2.js` | not touched in S24 | PX-3.4, PX-3.5 cleanup | No | 🟢 last touched S23 #191; S25 finishes the cleanup tail |
| `client/pages/scripts/client-workspace.js` | #200, #203, #205, #206 (heavy) | not touched in S25 | No | 🟢 S25 doesn't enter consultant workspace |
| `client/pages/scripts/team-ssi-view.js` | #206 (Assessments page-reuse) | not touched in S25 | No | 🟢 S25 backend extension only (`/trends`, `/compare` shipped S23/#206) |
| `client/pages/scripts/my-clients.js` | #200 (tile cleanup) + #204 (auth-token) | not touched in S25 | No | 🟢 |
| `server/routes/objectives.js` | #199 (P1), #203 (P2) | PX-3.6 (drop embedded write) | No | 🟢 S24 added consultant endpoints + virtuals; S25 trims dual-write — orthogonal concerns |
| `server/services/StageTransitionService.js` | #199 (rewrap as thin wrapper around LifecycleTransitionService) | PX-2.2 (wire `notifyTransition()`) | No | 🟢 S25 adds entry-point notification; S24's rewrap pattern preserved |
| `server/models/Company.js` | #199 (enum collapse to canonical 6) | not touched in S25 | No | 🟢 |
| `server/models/Objective.js` | #198 (schema add: `lifecycle_stage`, `lifecycle_history`); #199 (`consultant_notes`, `sustained_eligible` virtual) | PX-3.18 (drop embedded `key_results[]`) | No | 🟢 different fields; S25 drops a legacy field S24 never touched |

**No conflicts detected.** S24 and S25 work on disjoint surfaces wherever they share files.

### S25 → S26 (downstream consumer) — deliberate handoff seams

| Surface | S25 leaves | S26 builds on top | Conflict? |
|---|---|---|---|
| `notifyTransition()` helper at `StageTransitionService` entry points | Wired (PX-2.2) | Lands 4 transition emails on top | 🟢 designed seam |
| Single canonical cascade (`Objective → KR → WG → Move`) | All dual-writes retired | "Compose Objective" wizard writes ONLY to canonical path | 🟢 S26 inherits clean pipes |
| AIOKRSuggestion review surface | Minimal pending-review UI (PX-2.4) | Refines into "approve/reject + edit" UX | 🟢 S26 builds on minimal stub |
| `client/pages/scripts/objectives.js` | Touched in S25 (PX-2.5 if needed) | S26 will heavily edit (Path B self-serve) | ⚠️ **see overlap note** |
| `client-workspace.html#tab=objectives` | Not touched (read-only post S24 #203) | S26 adds "Compose Objective" affordance | 🟢 S25 leaves untouched |
| `EMAIL_DEEP_LINK_CONTRACT.md` | Authored (S25 close deliverable) | Both send-side (S26) + receive-side (S27) consume | 🟢 designed contract |
| `BETA_LAUNCH_CHECKLIST.md` | Authored (S25 close deliverable) | S26 + S27 reference for acceptance gating | 🟢 |
| Prompt regression fixture suite | Built (S25 close deliverable) | Runs at S26 + S27 close | 🟢 |
| KR-aggregation formula | Documented in PX-1.7 spike | S27 cron design consumes | 🟢 |

**⚠️ S25 PX-2.5 ↔ S26 Path B overlap on `objectives.js`**:
- S25 PX-2.5 is **conditional** (fires only if PX-1.4 confirms missing AND S26/27 needs it)
- If PX-2.5 fires, the affordance is small and additive (single button + handler)
- Recommended sequencing: **complete PX-2.5 inside S25**, not S26. Reasoning: S26 is already heavy on Path A (consultant authoring) + Path B (self-serve); minimizing scope creep matters. PX-2.5 is mechanical FE plumbing belonging to "fix the pipes."

**No blocking conflicts.** All S25→S26 seams are deliberate.

---

## Hard Prerequisite Verification (PX-1.6 Gate)

Sprint 25 starts only when S24 has shipped these 4 items:

| Prereq | S24 Session | Status | Evidence |
|---|---|---|---|
| `Company.stage` enum collapse to canonical 6 (`prospect/onboarding/active/paused/churned/completed`) | #199 | ✅ SHIPPED | `server/constants/companyStages.js` `STAGES` array; `server/models/Company.js` schema collapsed from `ALL_STAGES_TRANSITIONAL` (10) → `STAGES` (6) |
| `Objective.lifecycle_stage` field present + indexed | #198 (schema), #199 (writer) | ✅ SHIPPED | `server/models/Objective.js`; `objectiveLifecycle.js` constants module |
| `LifecycleTransitionService` generic abstraction | #199 | ✅ SHIPPED | `server/services/LifecycleTransitionService.js` (factory + 2 configured instances: `companyStageInstance`, `objectiveLifecycleInstance`); `StageTransitionService` thin-wrapper rewrap |
| `client/js/display-labels.js` consultant mapping populated | #199 | ✅ SHIPPED | `window.DisplayLabels` exports `companyStageView()` + `lifecycleView(stage, role)` (consultant ball-view mapping populated) |

**PX-1.6 gate**: 🟢 **GREEN — all 4 prereqs verified shipped at S24 #199**.

S25 may launch.

---

## Capacity & Risk Analysis

### Capacity
- **Total tasks**: **47** (11 Discovery + 9 Leak Fixes [4 unconditional] + 20 Cascade Cleanup + 3 Service Consolidation conditional + 4 Sprint-Close Deliverables mandatory)
- **Estimated days**: ~10 working days (per S25 master plan)
- **Parallelism**: HIGH in Phase 1 (11 read-only tasks), Day-1 early-bird unblockers (PX-3.20/3.19/2.6), and Phase 4 (3 independent retirements)
- **Sequential bottlenecks**: PX-2.2 → PX-2.8; Phase 3.13 (verification check) gates 3.14–3.18

**Velocity comparison** (vs S22a 7.0 pts/day, S23 6.6, S24 5.6):
S25 is task-counted, not pt-counted. Heuristic: 47 tasks ÷ 10 days = **4.7 tasks/day**, slightly above S24's pt/day pace; tractable given mostly-mechanical Phase 3, high-parallelism Phase 1, and ~7 of 47 being doc/decision tasks (faster than code).

### Risks (carried from S25 master plan + retro context)

| ID | Risk | Mitigation | Status |
|---|---|---|---|
| R1 | PX-1.6 fails (S24 not shipped) | Pause sprint, work moves to S24 window | ✅ RESOLVED — gate green |
| R2 | Phase B migration finds unexpected legacy shapes | Dry-run + manual review before PX-3.12; trivial recovery (test data) | 🟡 Active — mitigation in plan |
| R3 | Service retirement (PX-4.*) breaks unknown caller | Grep-first audit; retain if any caller; rationale documented | 🟡 Active — mitigation in plan |
| R4 (NEW) | S26 overlap on `objectives.js` if PX-2.5 fires late | Complete PX-2.5 inside S25 (don't carry) | 🟡 Action item in retro (A6) |

---

## Conflict-Resolution Decisions

No conflicts requiring resolution. All page-overlap concerns are either:
- (a) read-only verifications that don't conflict with prior writes
- (b) deliberate downstream-consumer seams (S26 builds on S25 deliverables)
- (c) disjoint fields/methods within shared files (e.g., `routes/objectives.js`)

---

## Action Items Carried From S24 Retro

These are tracked in [SPRINT24_RETRO.md](../SPRINT-24-Consultant-CRM%20%28In%20Progress%29/SPRINT24_RETRO.md) and execute as part of S25:

| # | Action | When in S25 |
|---|---|---|
| A1 | Codify pre-coding spec scan in `/coding` skill | Before launch |
| A2 | Add "synonymous storage keys" sweep to `/audit` checklist (closes A20260507-02) | Before close |
| A3 | Drop daily execution plan; handoff is sole sequencing truth | Kickoff |
| A4 | Constants-module changes must cross-grep + patch citing spec docs in same commit | Always |
| A5 | Mint new epic ID for in-sprint discoveries >1 day | Always |
| A6 | Complete S25 PX-2.5 in-sprint (don't carry to S26) | Phase 2 |

---

## Sprint-Close Deliverables (per master plan)

S25 closes only when these are also shipped (Cross-sprint audit 2026-05-06):

- [ ] `KARVIA_STRATEGY/2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md` (Group 2b)
- [ ] `KARVIA_STRATEGY/3-DELIVERY/BETA_LAUNCH_CHECKLIST.md` (Group 8a + 8d)
- [ ] Prompt regression fixture suite (Group 8b, +2 pts)
- [ ] `REFINEMENT-BACKLOG/` reorganized into `must-before-Beta/` + `nice-after-Beta/` (Group 8c)
- [ ] `KARVIA_STRATEGY/2-TECHNICAL/SPRINT_X_VERIFICATION.md` populated with 11-task citations
- [ ] `KARVIA_STRATEGY/2-TECHNICAL/KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md` populated (PX-1.7 spike)

---

## Sign-off

**Page matrix verdict**: 🟢 **GREEN — Sprint 25 cleared to launch**

- Hard prereq gate (PX-1.6): all 4 items ✅ shipped in S24
- No cross-sprint page conflicts (S24 closed, S26 downstream-only)
- S26 handoff seams designed and documented
- Risks R1 closed; R2/R3/R4 mitigations in plan
- Action items from S24 retro mapped into S25 phases

**Recommended next step**: `/close` Sprint 24 first (folder rename + final commit), then `/strategy` to lock S25 Phase 1 / 2 decisions (Q1-Q3 frequency mapping + PX-2 conditional list), then `/coding` for Phase 1 Discovery.
