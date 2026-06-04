# Sprint 26 Plan Audit — Verdict & Matrices

<!-- @GENOME T3-SPR-026-AUDIT | ACTIVE | 2026-05-12 | parent:T3-SPR-026-MP | auto:- | linked:/audit -->

**Audit session**: 2026-05-12 /audit
**Scope**: Sprint 26 plan (22 firing tasks, A/B/C/D/E workstreams) — logical + technical + Lego-modularity lens
**Spine**: 5-verb regression journey (Onboard / Engage / Diagnose / Author / Hand-off) × 5 roles × 2 paths
**Auditor**: Claude (self-audit; plan was authored same-day across /sprint-review + /strategy sessions)
**Input doc**: [S26_PLAN_AUDIT_INPUT.md](S26_PLAN_AUDIT_INPUT.md)

---

## Verdict

🟢 **GREEN** — plan is sound. 4 findings folded in (1 dep correction · 1 minimal-change verification · 2 optional regression test additions).

**Cleared for `/coding`** after page matrix amendments land.

---

## Quality Scorecard

| Lens | Score | Notes |
|---|---|---|
| Plan completeness (coverage) | 9/10 | Every active verb-role cell covered; no orphan tasks |
| Lego modularity | 9/10 | Workstream E entirely L1+L2+L3, zero L4 touch. B.3 spans all 4 layers but justified (AI-pilot dispatcher) |
| Minimal change | 9/10 | Slimmed-E held (no new service, no new collection). One open verify: C.4 endpoint necessity |
| Dependency correctness | 8/10 | One missing dep (B.3 ← E.1+E.2) |
| Technical regression coverage | 7/10 | 2 verb-role cells with no automated test (Engage/reminder + Hand-off/B.4) |
| **Overall** | **8.4/10** | Plan is sound; small folds bring this to 9+/10 |

---

## Section 1 — Plan Review

### 1a. Lego-layer mapping (22 firing tasks)

| Task | L1 FE | L2 MW | L3 BE | L4 AI |
|---|---|---|---|---|
| A.1-A.4 (Activation Playbook) | — | — | — | — |
| B.1 Profile-complete → BO | ✓ | ✓ | ✓ | — |
| B.2 Assessment-pending reminder cron | — | — | ✓ | — |
| B.3 Assessment-aggregate → BO+Consultant+team | ✓ | ✓ | ✓ | ✓ |
| B.4 Objective.post-save → Manager (send-side) | — | ✓ | ✓ | — |
| B.5 dailyDigestJob extension + User.notification_preferences | — | ✓ | ✓ | — |
| B.6 PX-5.1 regression suite | — | — | ✓ (test) | — |
| C.1 Consultant initiate/monitor/nudge surface | ✓ | — | — | — |
| C.2 4-case empty-state helper | ✓ | — | — | — |
| C.3 AIOKRSuggestion approval UX refinement | ✓ | — | — | — |
| C.4 Per-invitee progress widget | ✓ | ✓ | — | — |
| C.5 BO assigns owner_id during wizard | ✓ | ✓ | — | — |
| D.2 PX-2.5/2.7 re-eval | (planning) | | | |
| D.3 Prompt regression gate | — | — | ✓ (test) | — |
| E.1 Path A/B unification → canonical read | ✓ (verify) | ✓ | — | — |
| E.2 OnboardingProgressService rollup fix + backfill | — | — | ✓ | — |
| E.3 AssessmentTemplate.scoring_type + dispatch | — | — | ✓ | — |
| E.4 Cascade-correctness regression | — | — | ✓ (test) | — |

**Layer-summary observations**:
- **Workstream E** entirely L1+L2+L3, **zero L4 touch** → AI-Orchestrator stays untouched by aggregation fix. Clean layer separation.
- **Workstream C** mostly pure L1 → UI work properly isolated.
- **B.3** uniquely spans all 4 layers → justified by its nature (AI-pilot dispatcher with frontend deep-link + route trigger + email + LLM call). Not a modularity smell; flagged as **risk concentration** — if B.3 slips, it cascades.
- **A workstream** doc-only by design (Playbook is design artifact, not code).

### 1b. Dependency correctness

| Declared dep | Verdict |
|---|---|
| B/C scoping waits on A.4 (playbook lock) | ✅ correct |
| B.6 lands with B.1 | ✅ correct |
| B.4 deps on C.5 (Mgr owner_id assignment) | ✅ correct |
| E.1 deps on E.2 + preflight Q9 | ✅ correct |
| E.3 deps on E.2 | ✅ correct |
| E.4 deps on E.1+E.2+E.3 | ✅ correct |
| **B.3 deps on E.1+E.2** | ❌ **MISSING** — see Finding A20260513-01 |

**Reasoning for the missing dep**: B.3 fires email when "Assessment-aggregate threshold met." Threshold reads `Company.assessment_scores`. If E.1/E.2 not yet shipped, B.3 evaluates threshold against legacy `ssi_scores` field — dispatcher misfires or fires inconsistently. E.1+E.2 MUST land before B.3.

### 1c. Minimal-change verification

| NEW artifact | Justified? |
|---|---|
| `client/js/next-step.js` (B.1) | ✅ no equivalent receive-side component exists |
| `scripts/test-sprint26-PX5.1-deep-link-contract.js` (B.6) | ✅ standard regression pattern |
| `KARVIA_STRATEGY/1-PRODUCT/ACTIVATION_PLAYBOOK.md` (A.1) | ✅ design artifact |
| `scripts/db/backfill-assessment-scores-from-ssi-result.js` (E.2) | ✅ one-shot in existing folder |
| `scripts/test-sprint26-E.4-cascade-correctness.js` (E.4) | ✅ standard regression pattern |
| `AssessmentTemplate.scoring_type` field (E.3) | ✅ 1 field, future-proofing |
| **C.4 new endpoint** `/api/consultant/clients/:id/invite-progress` | ⚠️ **needs verification** — see Finding A20260513-02 |

**Slimmed-E held**: no `CompanyAssessmentRollupService`, no `CanonicalRollupService`, no `AssessmentScoreLog` collection. `OnboardingProgressService` reused for E.1/E.2/E.3. `Assessment.retake_number` reused for history (Q6=b versioning).

### 1d. Effort sanity

22 tasks / ~14 days = **1.57 tasks/day** average. S26 tasks are full features (heavier than S25's plumbing pace of 3.5/day). Heaviest task: B.3 at 2d (justified by 4-layer span). Lightest: 0.25d (test scripts). **Balanced.**

---

## Section 2 — Plan vs Regression Journey

### Path A — Consulting mode

| Verb | Consultant | BO | Manager | Employee |
|---|---|---|---|---|
| **Onboard** | Add client (existing S22a) | Invitation accept → land on company-profile (existing) | — | — |
| **Engage** | **C.4** progress widget on workspace | **B.1** profile-complete CTA → assessment kickoff; takes assessment (existing); invites team (existing, bidirectional per Q7); **C.4** progress widget on team-ssi-view | **B.2** reminder cron on cadence (3/7/13d) | **B.2** reminder cron |
| **Diagnose** | **B.3** Assessment-aggregate email + **E.1** canonical SSI on workspace tile | **B.3** email (persona-conditional copy) + **E.1/E.2** canonical SSI on dashboard | **B.3** email (persona-conditional) | **B.3** email (persona-conditional) |
| **Author** | **C.1** nudge surface in workspace; deep-link to BO wizard for "show me how" | BO authors via wizard (existing) + **C.3** UX refinement + **C.2** 4-case empty-state on objectives.html + **C.5** assigns Manager owner_id | — | — |
| **Hand-off** | **B.4** email (cc Consultant) | — | **B.4** "Plan this KR" email (primary) | — |

### Path B — Self-serve mode

| Verb | BO | Manager | Employee |
|---|---|---|---|
| **Onboard** | BO signs up directly (existing) | — | — |
| **Engage** | Same as Path A but no Consultant column | (same) | (same) |
| **Diagnose** | (same as Path A) | (same) | (same) |
| **Author** | BO uses wizard or atomic create with LLM + **C.3** (cohort-aware framing) + **C.5** assigns Manager | — | — |
| **Hand-off** | — | **B.4** Manager email | — |

### Coverage / orphan / continuity verdicts

**Coverage**: ✅ every ACTIVE verb-role cell has ≥1 task delivering it. Empty cells (e.g., Employee/Author) are by-design — those roles don't act at those verbs.

**Orphans**: ✅ no orphan tasks. B.5 (dailyDigestJob) is substrate serving all Diagnose cells via batching. A.1-A.4 (Playbook) is meta-design that drives B/C scoping. D.2/D.3, B.6, E.4 are gates/tests.

**Continuity (FUN-6 zero ball-drop)**: ✅ no ball-drops in S26 scope.
- Onboard → Engage: B.1 CTA
- Engage → Diagnose: B.3 deep-link
- Diagnose → Author: C.1 nudge + C.2 empty-state
- Author → Hand-off: B.4 send-side
- Hand-off → Execution: (S27 scope)

### Technical regression coverage

| Verb | Automated coverage | Gap |
|---|---|---|
| Onboard | Existing S22a invitation tests | ✅ |
| Engage | B.6 deep-link contract (partial) | ⚠️ **B.2 reminder cadence: no automated test** — Finding A20260513-03 |
| Diagnose | E.4 cascade correctness | ✅ |
| Author | LLM/AIOKRSuggestion existing + D.3 prompt regression | ✅ |
| Hand-off | None | ⚠️ **B.4 send-side: no automated test** — Finding A20260513-04 |

Both gaps are low-severity — 5-verb manual walk at S26 close covers them. Optional adds (~0.25d each) close the gap.

---

## Findings (A20260513-*)

| ID | Severity | Finding | Action |
|---|---|---|---|
| `A20260513-01` | **MEDIUM** | B.3 missing dep on E.1+E.2 in page matrix. Dispatcher threshold reads `Company.assessment_scores` — if rollup not fixed first, B.3 misfires on legacy `ssi_scores`. | **Amend page matrix**: add B.3 dep on E.1+E.2. **Reorder implementation**: E.1+E.2 → B.3. |
| `A20260513-02` | LOW | C.4 progress widget proposes new `/invite-progress` endpoint. May be derivable from existing `/team-breakdown` + `Invitation.status` aggregation. | **Verify during C.4 /coding session** — if derivable, drop the new endpoint (minimal-change). Track as 30-min spike. |
| `A20260513-03` | LOW | B.2 reminder cadence has no automated regression — only 5-verb manual walk. | **Optional add**: `scripts/test-sprint26-B.2-reminder-cadence.js` (~0.25d). OR accept manual walk per 5-verb. **Recommendation**: add the test — cron behavior is hard to verify manually. |
| `A20260513-04` | LOW | B.4 send-side has no automated regression — only 5-verb manual walk. | **Optional add**: `scripts/test-sprint26-B.4-objective-handoff.js` (~0.25d). OR accept manual walk. **Recommendation**: defer to S27 receive-side test (B.4 send + S27 receive in one suite). |

**Net change to S26 scope** (recommended amendments):
- Reorder implementation: E.1+E.2 → B.3 (no scope change)
- Add B.2 cadence regression test → +0.25d (optional, recommended)
- C.4 verify-spike → no scope change (folded into C.4 effort)
- B.4 regression test → defer to S27 (no scope change)

**S26 firing tasks**: 22 → 22 (or 23 if B.2 regression added). Total effort: 14d → 14d (or 14.25d).

---

## Amendments to fold

1. **[SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md)** — add B.3 dep on E.1+E.2; reorder implementation day plan; optionally add B.2 regression test
2. **[AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md)** — record A20260513-01..04
3. **[SPRINT26_HANDOFF_DOCUMENT.md](SPRINT26_HANDOFF_DOCUMENT.md)** — verdict recorded
4. **[SESSION_LOG.md](../../../../.claude/SESSION_LOG.md)** — audit session entry

---

## Sign-off

Audit complete 2026-05-12. Verdict: 🟢 GREEN with 4 findings (1 MEDIUM + 3 LOW). Plan cleared for `/coding` after page matrix amendments (A20260513-01) land. Other findings fold during implementation (A20260513-02) or as optional adds (A20260513-03/-04).
