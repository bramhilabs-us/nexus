# Sprint 26 Plan — Audit Session Input

<!-- @GENOME T3-SPR-026-AUDIT-INPUT | ACTIVE | 2026-05-12 | parent:T3-SPR-026-MP | auto:/audit | linked:/strategy -->

**Purpose**: Prep doc for the /audit session that will verify the revised S26 plan (22 firing tasks across Workstreams A/B/C/D/E) is sound — logically (does it serve the user journey?) and technically (is it Lego-modular, dependency-correct, minimally invasive?).
**Status**: 🟡 STAGED — ready to launch via `/audit`.
**Triggered by**: User direction 2026-05-12 — "fall back to regression flow because that's the main thread we're weaving the entire narrative around."

---

## Why this audit (the WHY)

The S26 plan grew organically across three sessions in one day (sprint-review → strategy on assessment flow → strategy on Workstream E scoping). 22 firing tasks, 5 workstreams, 7 audit IDs. Before any code lands, **one clear-eyed pass** to verify:

1. **The plan serves the journey.** The 5-verb regression test (Onboard → Engage → Diagnose → Author → Hand-off, both paths × 5 roles) is THE acceptance criterion. Every task in S26 must contribute to making one or more verbs pass for one or more roles. Orphan tasks = scope creep. Missing verb-role cells = silent journey breaks.
2. **The plan is Lego-modular.** Per [lego architecture memory](../../../../.claude/projects/.../memory/feedback_lego_architecture.md): Frontend / Middleware / Backend / AI-Orchestrator layers must remain independently replaceable. Every task touches a specific layer-set; cross-layer coupling is a smell.
3. **The plan is minimally invasive.** Per stay-grounded memory: we should be amending existing services + adding 1-2 fields, not building parallel infrastructure. Re-verify against codebase.
4. **The plan's dependencies are correctly ordered.** E.2 before E.1. A.4 (playbook lock) before B/C scoping. B.6 lands with B.1. Etc.
5. **The plan covers the Beta gates.** Walk each assessment-touching gate (SEC-7, FUN-6, CQ-1, DOC-2) → which task flips it?

If the audit returns 🟢 GREEN, /coding can start. If 🟡 YELLOW, plan amendments folded in. If 🔴 RED, /strategy re-opens.

---

## Audit objective (one sentence)

**Verify the revised Sprint 26 plan delivers the 5-verb regression journey for all 5 roles in both paths, using Lego-modular changes, with minimal new artifacts and correct dependency ordering.**

---

## Two-section framework

### Section 1 — Plan Review (the plan as-is, independent of journey)

For each of the 22 firing tasks, apply 4 lenses:

#### 1a. Lego-layer mapping (what layer does it touch?)
| Layer | Includes |
|---|---|
| **L1 — Frontend** | HTML pages, `client/pages/scripts/*.js`, `client/js/*.js`, `client/css/` |
| **L2 — Middleware** | Express routes (`server/routes/*.js`), middleware (`server/middleware/*.js`), RBAC enforcement |
| **L3 — Backend** | Services (`server/services/*.js`), models (`server/models/*.js`), jobs (`server/jobs/*.js`), scripts |
| **L4 — AI-Orchestrator** | `LLMGateway`, prompt templates (`server/prompts/*`), scoring services, AI fallback policies |

For each task: list `{L1, L2, L3, L4}` touch points. Verify (a) no task fragments across all 4 layers (smell of bad modularity); (b) every layer change has a clean interface.

#### 1b. Dependency correctness
For each task: declared deps (from page matrix) — verify the dep is real (i.e., does X actually need Y to be done first?). Find missing deps. Find false deps. Build a topological ordering.

#### 1c. Minimal-change verification
For each task: list (a) files modified, (b) files created. Verify NEW artifacts are justified (not reproducing existing capability). Re-check the slimmed-Workstream-E decisions held — no `CompanyAssessmentRollupService`, no `AssessmentScoreLog`, etc.

#### 1d. Effort sanity check
For each task: declared est × historical S22a/S23/S24/S25 velocity (5.6 pts/day or ~3.5 tasks/day). Flag anything that smells too small (probably missing scope) or too big (probably needs splitting).

---

### Section 2 — Plan vs Regression Journey (the spine)

The regression journey is the 5-verb acceptance test, run for BOTH cohort modes × ALL 5 roles. The audit walks the journey and asks of each task: which **verb × role × path cell** does this serve?

#### The regression flow (canonical reference)

```
PATH A (Consulting mode)              PATH B (Self-serve mode)
─────────────────────                 ────────────────────
1. ONBOARD                            1. ONBOARD
   Consultant adds client                BO signs up directly
   ↓                                     ↓
2. ENGAGE                             2. ENGAGE
   BO accepts → completes profile        BO completes profile
   BO takes assessment                   BO takes assessment
   BO invites team (any role mix)        BO invites team (any role mix)
   Reminders fire on cadence             Reminders fire on cadence
   ↓                                     ↓
3. DIAGNOSE                           3. DIAGNOSE
   Assessment scores aggregate          (same; cohort-agnostic from here)
   SSI narrative generates
   BO + Consultant notified
   Company.assessment_scores canonical
   ↓
4. AUTHOR
   Consultant initiates Objective       BO uses wizard or atomic create
   (in workspace tab)                   (BO authors directly)
   LLM co-authors refinement            LLM co-authors refinement
   AIOKRSuggestion approved
   Objective saved with KRs
   ↓
5. HAND-OFF
   Manager receives email
   "Plan this KR" CTA renders          (same)
```

#### The role matrix

Every verb must work for these 5 player perspectives:
- **CONSULTANT** — drives Path A onboarding, monitors, nudges, never authors directly
- **BUSINESS_OWNER** — drives Path B; co-author in Path A; result reviewer in both
- **EXECUTIVE** — peer to BO, full read; sometimes invited to take assessment
- **MANAGER** — receives Hand-off email; takes assessment; invites direct reports
- **EMPLOYEE** — takes assessment when invited; never invites (per Q7 locked)

#### The verb × role × path cells (15 cells per path = 30 total)

The audit produces this matrix. Each cell answers: **"What does this player experience at this verb? Which S26 task delivers it?"**

| Verb | Consultant (A) | BO (A) | Exec (A) | Mgr (A) | Emp (A) |
|---|---|---|---|---|---|
| Onboard | task list | task list | task list | task list | task list |
| Engage | ... | ... | ... | ... | ... |
| Diagnose | ... | ... | ... | ... | ... |
| Author | ... | ... | ... | ... | ... |
| Hand-off | ... | ... | ... | ... | ... |

(Same table for Path B.)

#### Section 2 audit questions
- **Coverage**: every cell has ≥1 task delivering the experience? Empty cells = silent breaks.
- **Orphans**: every task has a clear cell (or test/preflight role)? Orphan tasks = scope creep.
- **Continuity**: between adjacent verbs, does the receiving player land somewhere sensible? Per FUN-6 (zero ball-drop, BETA_LAUNCH_CHECKLIST.md:41).
- **Regression coverage** (technical): for each verb, what existing regression test (PX-3.10 single-write, PX-5.3 prompt regression, planned E.4 cascade) covers it? Gaps in technical regression = manual walks needed at sprint close.

---

## Inputs to load (auto-loaded by /audit)

### AUTO (load at session start)
| Doc | Purpose |
|---|---|
| [SPRINT26_MASTER_PLAN.md](SPRINT26_MASTER_PLAN.md) | Sprint goal, workstreams, invariants |
| [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md) | 22-task decomposition, page-impact matrix, implementation order |
| [SPRINT26_HANDOFF_DOCUMENT.md](SPRINT26_HANDOFF_DOCUMENT.md) | Status, Q1-Q13 resolutions, carry-forward |
| [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) | Canonical assessment model + Workstream E known breaks |
| [ASSESSMENT_STRATEGY_SESSION_INPUT.md](ASSESSMENT_STRATEGY_SESSION_INPUT.md) | Q5-Q13 resolutions, slimmed-E rationale |
| [PERSONA_STAGE_OWNERSHIP_MATRIX.md](../../../1-PRODUCT/PERSONA_STAGE_OWNERSHIP_MATRIX.md) | Page ownership + persona × stage matrix (the 5×5 ball-drop check) |
| [BETA_LAUNCH_CHECKLIST.md](../../BETA_LAUNCH_CHECKLIST.md) | 39 gates, esp. SEC-7 / FUN-6 / CQ-1 / DOC-2 |
| [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) | A20260512-* IDs at current state |

### LINKED (load on demand)
| Doc | When needed |
|---|---|
| [EMAIL_DEEP_LINK_CONTRACT.md](../../../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) | Auditing B.1-B.4 dispatchers' URL shapes |
| [KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md](../../../2-TECHNICAL/KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md) | S26→S27 carry-forward of canonical-score consumer |
| [SPRINT25_RETRO.md](../SPRINT-25-Plumbing/SPRINT25_RETRO.md) | Action items A1-A5; cleanup-boundary pattern |
| Existing regression test files | `scripts/test-sprint2*-*.js` — coverage baseline |

### Technical inspection targets (read on demand to verify minimal change)
- `server/services/OnboardingProgressService.js:1-100` — confirm E.1 reuses (not replaces)
- `server/services/SSIScoringService.js:478-505` — confirm role-weighting reuse
- `server/routes/assessments.js:692-815` — Path B route to be modified
- `server/routes/consultant.js:1408-1514` — Path A route to be modified
- `server/models/AssessmentTemplate.js` — confirm `scoring_type` field is absent today
- `server/models/Assessment.js:340-360, 485-610` — confirm versioning fields (retake_number) usable as-is

---

## Suggested agenda (~90 min)

| # | Phase | Activity | Time |
|---|---|---|---|
| 1 | Setup | Load AUTO docs; confirm sprint state (22 tasks across A/B/C/D/E) | 5 min |
| 2 | Section 1a | Lego-layer mapping for all 22 tasks; flag cross-all-layer tasks | 15 min |
| 3 | Section 1b | Dependency correctness — build topological order; flag false/missing deps | 10 min |
| 4 | Section 1c | Minimal-change verification — file-modified vs file-created per task; re-confirm slimmed-E held | 10 min |
| 5 | Section 1d | Effort sanity check per task vs S22a/S23/S24/S25 velocity | 5 min |
| 6 | Section 2 prep | Lay out the 30-cell verb × role × path matrix | 5 min |
| 7 | Section 2 walk | Populate every cell — which task delivers; which cells are empty | 20 min |
| 8 | Section 2 closure | Flag orphan tasks + empty cells + ball-drop risks (FUN-6 lens) | 5 min |
| 9 | Verdict | GREEN / YELLOW / RED; new audit IDs (`A20260513-*` if any); plan amendments | 10 min |
| 10 | Outputs | Write artifacts | 5 min |

---

## Expected outputs

1. **`SPRINT26_PLAN_AUDIT.md`** (NEW) — section 1 + section 2 findings, layer map, verb-role matrix, verdict
2. **Updated [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md)** — fold in any plan amendments (likely small: missing test, missing dep, scope reorder)
3. **Updated [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md)** — `A20260513-*` IDs for any findings worth tracking (likely 0-3 IDs)
4. **Updated [SPRINT26_HANDOFF_DOCUMENT.md](SPRINT26_HANDOFF_DOCUMENT.md)** — audit verdict recorded, scope confirmed
5. **[SESSION_LOG.md](../../../../.claude/SESSION_LOG.md)** — /audit session entry

If verdict = 🟢 GREEN: plan is locked, `/coding` can start next.
If verdict = 🟡 YELLOW: amendments folded in this session; re-verify; then locked.
If verdict = 🔴 RED: kick back to `/strategy` for re-scoping.

---

## Audit-tracker forward

Next ID block when /audit runs: `A20260513-*` (assuming /audit runs tomorrow 2026-05-13). Findings likely:
- **0 RED** expected — plan was just authored with stay-grounded discipline
- **1-3 YELLOW** likely — small ordering corrections, missing test coverage in a verb-role cell, possibly an orphan helper task that should fold into another
- **0 retroactive** — A20260512-* IDs already cleaned up

---

## Sign-off

Audit session input prepared 2026-05-12 in continuation of /sprint-review → /strategy thread. Ready to launch via `/audit`.
