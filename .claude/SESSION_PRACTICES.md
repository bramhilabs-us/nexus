# Session Practices — what 280 Karvia sessions taught us

**Status**: MANDATORY — read at the start of every session (`/init` and `/nexus-tick` load this)
**Sources**: `_source/karvia_claude/SESSION_LOG.md` (~280 sessions), `_source/karvia_claude/LESSONS_LEARNED.md`, session protocol + seal archives
**Last Updated**: 2026-06-09

---

## The evidence

Karvia's session log mentions **regression 215 times, drift 120 times, stale 50 times**. Quality averaged ~8.75/10 in mature sprints — but the recurring 1.25 lost points trace to the *same handful of causes*, session after session. These practices exist so Nexus never pays for the same lesson twice.

## What made Karvia sessions good

The high-scoring sessions (9–10/10) shared a shape:

1. **A pre-scan before any edit.** The best coding sessions spent the first 10–15% of budget grounding the spec against live code and surfaced "Pre-scan caught N spec↔reality items" *before* locking the plan. Every drift caught in scan was multi-day rework avoided (Karvia's "Epic 0" — 13 pts of pre-work prevented 30+ pts of rework).
2. **One unit of work, sealed.** Good sessions did one thing, verified it, journaled it, and named the next step. Bad sessions chained "just one more" until context ran out mid-task.
3. **Decisions batched, not piecemeal.** When 59 cross-cutting gaps surfaced, batching them into one decisions log with one approval pass kept epics consistent. Inline ad-hoc resolution caused divergent paths between epics.
4. **Verification immediately after risky edits.** `node -c` after class-extension edits; mocked-dependency smoke tests for cache/timeout/fallback logic (5 minutes to write, 30+ to debug live).

## What made Karvia sessions bad

1. **Trusting stale documents.** Epic specs lagged the canonical decision (recorded in handoffs); mockups were built off superseded specs; specs referenced fictional methods, files that didn't exist, and files that already existed. *Root cause: no propagation mechanism between documents.* → Nexus answer: the document genome + `doc-graph-check.py`.
2. **Scope drift via silent arithmetic.** "Epic H merged into Epic G" dropped 13 points from the total without anyone noticing. → Always re-sum the table; never trust a labelled total.
3. **Unread contracts.** Five consecutive sessions each lost minutes to test fixtures violating model validation rules nobody re-read. → Read the schema (`grep required|enum|minlength`) *before* writing fixtures.
4. **Invariants that lived only in memory.** Architectural invariants (endpoint caps, one-endpoint-per-tab) survived only when a session explicitly named them in its pre-scan; specs downstream didn't restate them. → Nexus invariants live in IMPROVEMENT_PLAN/TECH_STRATEGY and the pre-scan names the relevant ones.
5. **Session-management overhead.** 16 commands, scattered handoff files, SESSION_INDEX + SESSION_LOG + CHANGE_LOG + handoffs all needing manual sync. The bookkeeping itself drifted. → Nexus: 5 commands, one JOURNAL, one NEXT_SESSION card.

## The Nexus session shape (all five session types)

```
OPEN      /init (or /nexus-tick ORIENT): load NEXT_SESSION.md → this session's card
PRE-SCAN  Ground the card against reality BEFORE working:
            docs → run doc-graph-check, read the card's named pack cards
            code → verify every file/method the card names actually exists as claimed
            name the invariants this work touches (AP-*, IM-*, F-style locks)
            surface drifts as a numbered list; if material → fix the doc first or clarify
WORK      One PR-sized unit. Batch cross-cutting decisions; don't resolve piecemeal.
VERIFY    Tests/lint/typecheck; for cache/retry/timeout logic: counted-mock smoke test
SEAL      /close: journal (with quality self-score), doc-graph green, write NEXT_SESSION,
          commit, push, PR
```

## Rules carried over verbatim (proven at Karvia, apply at Nexus)

| # | Rule | When |
|---|---|---|
| 1 | The newer decision record wins over the older spec; update the spec, don't follow it | Pre-scan, any doc conflict |
| 2 | Re-sum every budget/points table; "folded" scope must name where its budget went | Sprint planning, grooming |
| 3 | Tokens before mockups — define the CSS token, then reference it; no inline hex | Any visual work |
| 4 | Grep before you trust: "method exists/doesn't exist" claims get verified in the file | Pre-scan, coding |
| 5 | After multi-method appends to a class, syntax-check the file immediately | Coding |
| 6 | Mock the dependency and assert *call counts* for cache/timeout/fallback paths | Coding |
| 7 | Read the model's validation contract before seeding fixtures; fabricate ObjectIds for hierarchy you don't depend on | Testing |
| 8 | Spend the first 10–15% of any coding session on the pre-scan; it IS the work | Coding |
| 9 | Name the invariants you're touching in the pre-scan output; escalate before breaking one | Coding, strategy |
| 10 | Every Karvia lift carries the C-009 reflection record: why/what/how/when + relevant? improving? complexity? redundancy? (IM-11) | Any session lifting from Karvia |

## Quality self-score (sealed into every JOURNAL entry)

Karvia's 10-point scale, kept: 10 = goals met, clean, no issues · 9 = minor issues · 8 = most goals, some issues · 7 = partial · ≤6 = problems (must name the cause and, if process-shaped, file a TICK_PROTOCOL/practices improvement — IM-10).

A session that scores itself ≤7 twice in a row on the same cause is a **process bug**: fix the protocol, not just the work.

## How this file evolves

Add an entry when a Nexus retro produces a *generalizable* lesson (format: Lesson / Trigger / Rule / Counter-example — same as Karvia's LESSONS_LEARNED). Prune anything that hasn't paid off in 3 sessions. Project-specific lessons go in JOURNAL, not here.
