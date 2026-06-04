# Sprint 24 — Retrospective

<!-- @GENOME T3-SPR-024-RETRO | ACTIVE | 2026-05-08 | parent:T3-SPR-024-MP | auto:- | linked:/sprint-review,/close -->

**Sprint**: 24 — Consultant CRM
**Window**: 2026-05-04 (#194 strategy) → 2026-05-08 (#206 close)
**Status at retro**: 🟢 CODE COMPLETE — awaiting `/close` to seal
**Retro session**: post-#206, run inside `/sprint-review`
**Retro authors**: Continuity Manager (handoff doc) + Product Owner (5-verb gate) + Team Rep (per-session quality)

---

## Final Numbers

| Metric | Target | Actual | Status |
|---|---|---|---|
| Story points | 29 (range 24.5–31.5) | **28** | ✅ within range |
| Epics shipped | 9 | **9** | ✅ all (24.1–24.9) |
| 5-verb acceptance | All green | **All 5 green** | ✅ Onboard / Engage / Track / Empower / Hand-off |
| Architectural invariants | 7 | **7/7 green** | ✅ verified at #206 |
| S25 PX-1.6 prereq gate | 4 items | **4/4 shipped** | ✅ green-light for S25 |
| Sessions | — | **11 total** (#194 strategy + #196 audit + #197–#206 coding) | — |
| Coding sessions | — | 9 (B/C/D/E/F + F-tail + G/H) | — |
| Tests added | — | **~590 new assertions** across 11 new suites | — |
| Full sweep at close | All green | **27/27 suites green ≈ 1455 assertions** | ✅ |
| Average quality | ≥8/10 | **9/10 every session** | ✅ |
| Velocity | — | 28 pts / 5 working days = **5.6 pts/day** | — |
| Audit IDs advanced PLAN→TESTS | — | A20260506-13, A20260507-01, -03, -04 | — |

---

## What Worked (keep doing)

### 1. Pre-coding spec scan caught drift in 5/9 coding sessions
**Sessions #198, #199, #205, #206** all opened with a "spec vs reality" grounding check **before** writing code. Findings:

- #198 — phantom enum values (`active`/`at_risk`/`inactive` not in `Company.stage`); 3 file-paths wrong; uppercase/lowercase enum bug in own audit script
- #199 — daily execution plan stale (24.8 + 24.9 not slotted); stage-count drift (specs said 5, canonical 6); `Move.objective_id` field doesn't exist
- #205 — spec referenced `.status-pill`, real class is `.cw-status-chip`
- #206 — banner verb mismatch ("editing" wrong for read-only Assessments); "Surveys" tab id is actually `anonymous`; Trends/Compare lives on assessment-hub, not team-ssi-view

Each was caught **before** any code change, so the fix was a spec amendment + correct implementation rather than rework. Save: ~2 sessions of mid-session U-turns.

**Action S25**: Mandate pre-coding scan in `/coding` skill (already de facto practice; codify).

### 2. Session re-order at #199 — dependency-correct sequencing
Original execution-plan ordering inverted the dep chain (Epic 24.1 frontend consumed `display-labels.js` + `LifecycleTransitionService`, both **created** by 24.3 P1). Epic 24.1's spec itself flagged this (line 129-131). Re-ordered to B=24.3-P1 → C=24.1+24.8 B-8 → D=24.2+24.8 B-6 → E=24.9 → F=24.3-P2 → G=24.4 → H=24.5+close. Zero forward-reference work.

### 3. Audit governance shipped its first concrete cycle
`A{YYYYMMDD}-{nn}` ID convention (codified pre-S24) had its first end-to-end run:

- A20260506-13 (G7 BallState/Lifecycle) — PLAN #196 → CODE #199 → TESTS #199 (single session)
- A20260507-01/03/04 (storage-key cluster) — PLAN #203 → CODE #204 → TESTS #204 (next session)

Stable IDs traceable in master tracker + handoff + commit messages. Pattern is reusable.

### 4. Same-day fix of BUG-S24-01 (storage-key fragmentation)
Discovered post-#203 in dev verification (TOKEN_EXPIRED on `/portfolio-kpis`). Could have deferred to Session G; user requested same-day fix. #204 swept ~16 client files in ~1h; full sweep 25/25 green. Kept Session G (#205) unblocked.

**Lesson**: when a leak surfaces with a comprehensive 1-step fix (canonical-key only + boot cleanup), do it in-session rather than carrying it into the next epic's scope.

### 5. Page-reuse pattern — `?client=:id&from=workspace`
Epic 24.2 reused `company-profile.html`; Epic 24.5 reused `team-ssi-view.html`. Avoided cloning consultant-specific pages. `ConsultantPageMode` helper (created #201) parameterized via `renderBanner(name, { intro })` (added #206) — additive, no helper fork. **One-helper-many-pages** is the durable pattern.

### 6. Onion philosophy + shared `KarviaTabHeader.renderKPIStrip()` (Epic 24.9)
Epic 24.9 (Session E) was deliberately ordered **before** the tabs that consume it (24.3-P2, 24.4, future tabs). Shared helper + `client/css/components/tab-header.css` made every subsequent tab "KPIs on top, details below" without per-tab divergence. Visual consistency emerged from shared infra, not enforcement.

### 7. Test-as-spec discipline maintained
~50–197 new assertions per coding session; full regression sweep at every session close. No skipped suites; no "we'll add tests later" debt. `phase3-3` lint allow-list updated **in-session** for shifted role-check sites — never deferred.

---

## What Didn't (change in S25)

### 1. Daily Execution Plan went stale
Master plan added Epics 24.8 + 24.9; daily execution plan was never updated. Caught only at #199 grounding scan. The handoff doc became the de-facto truth source mid-sprint.

**Action S25**: Either (a) treat daily execution plan as a one-shot artifact (write at sprint start, freeze, supersede via handoff "Session Re-order" sections) or (b) make handoff the only source-of-truth for ordering and drop daily execution plan from S25. Recommend (b) — simpler.

### 2. Stage-count drift across spec docs
Epic 24.1 + Epic 24.3 both said "5 stages" while canonical constants ship 6. Authored at different times, never re-synced when `LEGACY_TO_CANONICAL` mapping was added. Caught at #199.

**Action S25**: When a constants module ships (e.g. `companyStages.js`), cross-grep all spec docs for the field name and patch citations in the same commit. Prevents stale-prose drift.

### 3. Storage-key fragmentation invisible to prior audits
BUG-S24-01 root cause was a class of issue ("synonymous storage keys with inconsistent read-order across consumers") that no prior `/audit` had a check for. Logged as A20260507-02 (process bake-in, no code change).

**Action S25**: Add to `/audit` checklist — for every pair of synonymous storage keys (cookie / localStorage / sessionStorage / query-param synonyms / DB-field synonyms during migrations), assert (1) one writer per key, (2) identical read-order across all consumers, (3) no current code writes the legacy key once migration is declared complete. Verify before S25 close.

### 4. Session F-tail didn't earn a separate epic ID
#204 storage-key cleanup was scoped under "Session F-tail" instead of getting an `Epic 24.10` letter. Worked fine for 1 session of cleanup, but if the cluster had grown the per-session table would have struggled to track it.

**Action S25**: When an in-sprint discovery generates >1 day of work, mint a new epic ID rather than tail-extending an existing session label.

---

## Velocity vs Predecessors

| Sprint | Pts | Days | Pts/day | Quality | Notes |
|---|---|---|---|---|---|
| S22a | 28/28 | 4 | 7.0 | 9-10/10 | Tight scope, single architectural cut |
| S23 | 33/33 | 5 | 6.6 | 9-10/10 | 4 carried epics, no new audit |
| **S24** | **28/29** | **5** | **5.6** | **9/10** | 9 epics + audit governance debut + page-reuse helper |

S24 is ~20% slower than S22a/S23 in pure pts/day, explained by:
- Audit governance overhead (4 audit IDs advanced through 3-stage workflow)
- 9 epics × per-session full-sweep regression (vs 4-5 epics in predecessors)
- Page-reuse helper (`ConsultantPageMode`) was new infra; subsequent reuses were free

Going-forward velocity assumption for S25: Sprint 25 is mostly backend + zero-UI; expect velocity closer to S22a (≥6.5 pts/day equivalent if scoped in pts).

---

## Action Items for S25

| # | Action | Owner | When |
|---|---|---|---|
| A1 | Codify pre-coding spec scan in `/coding` skill | Skill maintainer | Before S25 launch |
| A2 | Add "synonymous storage keys" sweep to `/audit` checklist (closes A20260507-02) | `/audit` skill | Before S25 close |
| A3 | Drop or freeze daily execution plan; make handoff sole sequencing truth | Sprint planner | S25 kickoff |
| A4 | Constants-module changes must cross-grep + patch citing spec docs in same commit | Coding sessions | Always |
| A5 | Mint new epic ID for in-sprint discoveries >1 day | Coding sessions | Always |
| A6 | S26 page reuse: extend `ConsultantPageMode` for self-serve flows; do NOT fork | S26 planner | S26 kickoff |

---

## S24 → S25 Carry-Forward (handoff items)

- ✅ All 4 PX-1.6 prereqs shipped (stage enum collapse, lifecycle_stage field, LifecycleTransitionService, display-labels mapping)
- ✅ Architectural invariants list grows by 1 (`StageTransitionService` sole writer of `Company.stage` already in place; S25 adds `WeeklyGoal`/`KeyResult` single-writer enforcement)
- ✅ `notifyTransition()` helper foundation: `LifecycleTransitionService` already emits `lifecycle.transition` telemetry on every flip via `TelemetryService` (#192b) — S25 PX-2.2 wires the email helper on top
- ⚠️ Watch-item carry: `R6` (`company-profile.html` audit before consultant write changes) — N/A for S25 (read-only sprint); re-evaluate at S26 kickoff
- ⏳ Open Decisions still active: Beta launch date re-baseline; production data wipe (separate `/deploy` session)

---

## Sprint 24 Sign-off

**Verdict**: 🟢 SUCCESS — 28/29 pts (97%); all 9 epics shipped; 5-verb acceptance test all green; 27/27 test suites green; architectural invariants intact; S25 unblocked.

**Beta-launch readiness contribution**: S24 closes the consultant-side spreadsheet-retirement criterion. Beta blocker list now: S25 (cascade single-write + verification matrix) → S26 (activation flow stitching) → S27 (first task complete loop) → Beta gate.

**Closes when**: `/close` skill runs (folder rename `(In Progress)` → `(Complete)`, final commit, handoff finalization).
