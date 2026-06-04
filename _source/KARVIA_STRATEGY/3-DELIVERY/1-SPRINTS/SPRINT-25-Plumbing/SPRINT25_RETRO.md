# Sprint 25 — Retrospective

<!-- @GENOME T3-SPR-025-RETRO | ACTIVE | 2026-05-12 | parent:T3-SPR-025-MP | auto:- | linked:/sprint-review -->

**Sprint**: 25 (Plumbing)
**Sealed**: 2026-05-12 at /close #230
**Duration**: 13 days, 23 sessions (#208 → #230)
**Outcome**: 🔒 **SEALED at 45/45 firing tasks (100%)**

---

## Final scope math

| | |
|---|---|
| Tasks planned at launch | 47 |
| Mid-sprint adds | +10 (PX-3.6a-h split #209 +8; PX-3.6i #211 +1; PX-3.6j #217 +1) |
| Mid-sprint adds | +1 (PX-3.21 cleanup-boundary marking #224) |
| **Total tasks** | **58** |
| Deferred — Phase 2 | 2 (PX-2.5 wizard-session-bound demoted #209; PX-2.7 dormant seed-path #210) |
| Deferred — Phase 3 destructive | 6 (PX-3.8 / 3.14-3.18 → Sprint Cleanup post-S28/S29) |
| Absorbed | 1 |
| **Firing** | **45** |
| **Sealed** | **45 (100%)** |

---

## Quality signals

- 16 new regression suites, 504+ assertions, all green at close
- 0 destructive operations shipped against production data (all destruction boundary-marked for future Sprint Cleanup)
- 4 new governance docs: `CLEANUP-REGISTRY.md`, `MIGRATION_ROLLBACK_PLAYBOOK.md`, `MIGRATION_LOG.md`, `REFINEMENT-BACKLOG` classification
- 2 new technical contracts: `EMAIL_DEEP_LINK_CONTRACT.md`, `BETA_LAUNCH_CHECKLIST.md`
- 3 new services: `ObjectiveKeyResultsView`, `OnboardingProgressService`, `OrphanArchiveService`
- 2 new npm scripts: `audit:cleanup-targets`, `migrate:legacy-weekly[:dry-run]`

---

## Velocity

- **45 firing tasks / 13 working days ≈ 3.5 tasks/day** (S25 used task-count; not directly comparable to S22a/S23/S24 story-point velocities)
- Session quality: 9-10/10 sustained across all 22 sessions (sample of audit-tracker entries)
- One session shipped 0 code by design (#217 — pre-flight halt under safety memory)

---

## What worked (keep)

### 1. `Why → What → How → When` drove 2 mid-sprint scope amendments without integrity loss
- **PX-2.5 demoted #209**: Phase 1 verification surfaced that the BE endpoint is wizard-session-bound, not usable for saved Objectives — original "small wire-up" framing was wrong. User picked deferral over scope creep.
- **Destructive Phase 3 deferred #224**: 6 deletion tasks (PX-3.8 + PX-3.14-3.18) moved to "Sprint Cleanup" phase scheduled post-S28/S29 after Beta + 50-100 real-user validation. Plumbing deliverable became boundary-marking, not deletion.

Both surfaced as 2-3 option scope sketches before any edit. Pattern works.

### 2. Safety memory `no destructive without greenlight` caught Day 9b #217 in flight
- Pre-flight FE-shape audit revealed 11+ FE consumers reading `objective.key_results` from POST responses.
- Reshape helper + virtual landed BEFORE embedded write was dropped.
- Day 9b halted, memory captured (`feedback_no_destructive_without_greenlight.md`), Day 11+ shipped cleanly.

This is the highest-leverage save of the sprint — a destructive bug avoided that would have been near-impossible to roll back from in prod.

### 3. Cleanup-boundary pattern (PX-3.21) — new reusable safety idiom
- `CLEANUP-REGISTRY.md` (single source of truth, file-line ranges, prereqs, kill switches)
- 13 inline `// CLEANUP-TARGET: PX-3.X` grep-able markers across 11 files
- `npm run audit:cleanup-targets` bidirectional cross-check (every marker → registry entry; every code-kind entry → ≥1 marker)
- **Action**: codify as memory (see Memory Candidates §).

### 4. PX-1.11 → PX-3.6a-h consumer migration pattern
- Audit discovers N consumers → N separate HYBRID IDs (one per file) → 1 macro drop after all HYBRID ✓.
- Each session bounded; PX-3.6 macro then atomic across 3 slices (#219-221).
- Pattern translates to any "drop legacy read path after migrating N consumers."

### 5. Journey Smoke Test #207 against Render Dev with 3 real personas
- Surfaced 6 audit IDs (`A20260508-01..06`) that all closed within sprint.
- Real-environment smoke beat synthetic tests for breadth. 30 total gaps found, 24 already covered by planned scope, 6 net-new.
- Patterns: out-of-box journey-blocker (MECE seeder `is_active` default), schema bugs (`Goal.week` unconditional), state-machine no-ops (onboarding ticks), orphan accumulation (assessment_templates).

### 6. Pre-coding spec scan (carried from S24 retro)
- Held across S25 — caught drift before write in multiple sessions, no rework cycles.

---

## What didn't (action items for S26 and forward)

### A1. PX-1.11 walked `routes/` only — missed `services/` + model instance methods
- `A20260510-01`: 3 services + 2 model methods with embedded reads slipped past Phase-1 audit. Amended as PX-3.6j (cost 1 session #217 to detect + 1 session to fix).
- **Action**: bake "routes + services + model methods + scripts/" into `/audit` skill consumer-audit checklist. Update audit-governance lesson.

### A2. Day 9b #217 nearly shipped destructive without precursor
- Caught by safety pause; new memory captured.
- **Action**: codify "2-3 option scope sketch + precursor safety net BEFORE first edit on destructive task" as a `/coding` session preamble check. Memory exists; the formalization gives the harness a hook.

### A3. 4 audit IDs end S25 at PLAN-or-CODE with TESTS deferred by design
- `A20260506-03` (PX-5.1 grep regression → S26 B-1)
- `A20260506-08` (PX-5.x dispatcher-batch lifecycle digests → S26 B-5)
- `A20260506-10` (PX-5.2 checklist → enforces at /deploy time, not regression-style)
- `A20260512-01` (consultant-auth bug → post-S25 triage)
- All deferrals have explicit reasons recorded, but no cadence rule.
- **Action**: at every `/close`, scan for IDs >2 sprints stuck pre-✅ → surface as audit-governance refinement. Add to `/close` skill.

### A4. `A20260512-01` HIGH OPEN at sprint close
- Surfaced Day 13 #230 against `karvia-business-1`. Consultant cannot view assigned client's SSI assessments. Blocks consultant→client→assessment journey leg one.
- **Action**: S26 Day 1 owns triage decision (in-scope or refinement). Recorded as S26-D.1.

### A5. PX-5.1 EMAIL_DEEP_LINK_CONTRACT regression deferred
- Grep test for legacy env vars + hardcoded prod URL in email-build paths lands "with first dispatcher in S26."
- S26 B-1 carries implicit S25 test debt.
- **Action**: S26 B-1 acceptance must include the PX-5.1 regression suite (recorded as S26-B.6).

---

## Memory candidates (proposed)

| Topic | Why it's memory-worthy |
|---|---|
| **Cleanup-boundary pattern** (registry + inline markers + bidirectional audit script) | New reusable idiom for destructive-deferral scenarios. Not derivable from code alone — the pattern is the workflow, not the artifact. |

(No new feedback memories from "what didn't" — action items A1-A5 are sprint-specific work, not generalizable behavior rules. Existing memories `no destructive without greenlight` + `audit governance` + `Why → What → How → When` covered the wins.)

---

## Action items folded into S26 launch

| # | Action | Lands in |
|---|---|---|
| A1 | Consumer audits include services/ + model methods + scripts/ | `/audit` skill checklist (refinement track) |
| A2 | Destructive-task preamble check (option-sketch + precursor) | `/coding` skill preamble (refinement track) |
| A3 | Stuck-ID cadence scan at /close | `/close` skill (refinement track) |
| A4 | Triage `A20260512-01` | S26-D.1 (Day 1) |
| A5 | PX-5.1 regression suite | S26-B.6 (lands with B-1 dispatcher) |

---

## Carry-forward to S26 (verified ✅)

- `notifyTransition()` helper wired (PX-2.2 #210)
- `EMAIL_DEEP_LINK_CONTRACT.md` shipped (PX-5.1 #230) — Workstream B consumes
- Single-write KR contract enforced cascade-wide
- Legacy WEEKLY backfill tested + executed on pre-prod (clean no-op)
- `BETA_LAUNCH_CHECKLIST.md` shipped — Beta-1 launch gate
- Prompt regression suite (`npm run test:prompt-regression`, 504/504 ✓, ~0.18s) — gates `/close` when `server/prompts/` touched (wiring in refinement track)
- KR-aggregation formula documented (Sprint 27 consumes)

---

## Sign-off

Sprint 25 retrospective complete 2026-05-12. S26 launches with action items A4 + A5 folded into Day 1 + B-6 scopes. A1-A3 are skill-level refinements (not blockers).
