# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: AUDIT/GROOM (N1-P6-01 — the Night-1 close-out; solo-executable except the absorption sign-off, which waits on the founder if absent)
**Task**: **N1-P6-01** — Night-1 groom: phase-budget re-baseline + absorption review + BACKLOG sweep + SPRINTS_NIGHT_2 draft. Why now: the first reflection audit (`_agent/AUDIT_2026-06-12.md`) returned gate-verdict **GO after ① fix-pass ② this groom** — the fix-pass landed in session-23; this groom is the last gate before the product-docs stage.

**READ FIRST** (in order):
1. `_agent/AUDIT_2026-06-12.md` — the findings feed the groom (esp. §7 budget, §4 completeness list, §3 hygiene)
2. `NEXUS_STRATEGY/3-DELIVERY/EXECUTION_PLAYBOOK.md` — the phase budgets (N1:18 N2:24 N3:18 N4:16 N5:10 buffer:4) this session re-baselines
3. Full `_agent/BACKLOG.md` — **re-sum, never trust labels** (open N1 items: P3-01 pt2, P3-08, P3-09, P4-01/02, P5-01/02)
4. `_agent/JOURNAL.md` tail (sessions 19–23 are the overrun to account for)

**Definition of done**:
- **Budget re-baseline recorded**: N1 closed at its true step count with the strategy-expansion cause named; N2–N5 re-cut against the now-richer spec (or the 90 formally extended) — EXECUTION_PLAYBOOK table updated + a DECISIONS entry; the >25% trigger answered, not just noted
- **Absorption review verdicts**: for 02/03/04 — propagated-fully? absorb-and-delete candidate or keep? (C-021.4; execute deletions ONLY with founder sign-off — otherwise record candidates and park)
- BACKLOG swept (stale "PR pending merge" annotations; remaining N1 items re-phased into the product-docs stage, none silently dropped) + `SPRINTS_NIGHT_2.md` draft proposed (the product-docs stage as sprints-with-goals: P3-01 pt2 → P3-08 → P3-09, then N1-P4 tech docs)

**Watch out for**:
- Open `/audit` as the first move (the night-end cadence, audit §10) — cheap re-verify that the fix-pass left everything green
- **PRs #25 (session-22) and the session-23 PR are stacked** — merge order matters; if both merged, branch from main; else continue the chain
- The re-sum rule (SESSION_PRACTICES #2): any "folded" scope must name where its budget went
- Absorption is founder-gated; the budget re-baseline is not — record it as the agent's professional re-plan, founder can veto in review
- Step count: 28/90 after session-23's journal entry
