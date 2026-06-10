# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: strategy/docs (N1-P3-01 part 2 — the last Night-1 work item before review-gated tasks) — **with a Level-0 gate**
**Task**: `N1-P3-01` part 2 — 1-PRODUCT gap: `CAPABILITIES.md` + `ROADMAP.md`

**Gate**: `gh pr list` first.
- **Tick-18's PR (0-BUSINESS docs) merged** → proceed with part 2 below (it cites POSITIONING/GTM, so it stacks logically on part 1 — same task, must wait for the merge).
- **Tick-18's PR still open** → part 2 is in-flight-gated, and N1-P2-08 is NEEDS-FOUNDER-REVIEW: **everything actionable is waiting on the human → journal a no-op** naming the three waits (merge #21 mockups-s3, merge tick-18 business docs, founder mockup review) and exit. Do NOT invent new tasks.

**Part 2 scope (when unblocked)**:
- `1-PRODUCT/CAPABILITIES.md` — the capability map: what Nexus can DO, organized by the 8 lego blocks × 6 pages × 2 modes; each capability one line + its module owner + which night ships it; explicitly the bridge between PRODUCT_STRATEGY (contracts) and TECH_STRATEGY (modules) — cite both, duplicate neither
- `1-PRODUCT/ROADMAP.md` — horizons: Nights 2–5 (from EXECUTION_PLAYBOOK budgets, by reference), beta exit criteria (NORTH_STAR § how we know it worked), post-beta parked items (IMPROVEMENT_PLAN parking lot + fit-thesis matcher + BOQ sub-scores + srishti + org-direct self-serve), each parked item with its unlock trigger
- Genomes: parents PRODUCT_STRATEGY (+ EXECUTION_PLAYBOOK for ROADMAP); registry lines; validator green
- Leads with Transformation OS framing; both GTM motions; Karvia adaptation notes (IM-11 light)
- **Seal**: flip N1-P3-01 → DONE (re-scoped DoD: 4 business + 2 product docs, all six delivered)

**Cards to draw**: POSITIONING/GTM (from part 1, post-merge) · PRODUCT_STRATEGY · TECH_STRATEGY § module anatomy · EXECUTION_PLAYBOOK § phase plan · IMPROVEMENT_PLAN § parking lot · NORTH_STAR § how-we-know-it-worked

**After this task, Night 1's remaining queue is entirely human-gated**:
- N1-P2-08 NEEDS-FOUNDER-REVIEW (10 mockup surfaces → Night 3 build spec)
- N1-P4-01 unblocks on that review (then: modularization plan + contract drafts, citing API_SURFACE + USER_JOURNEYS § contract index + MODULE_DEPENDENCY_GRAPH)
- Then the Night-1 close-out groom: /audit, re-sum the night, draft SPRINTS_NIGHT_2
- Ticks landing before the human returns should no-op with these wait reasons.

**Watch out for**:
- ROADMAP must not re-promise dates — nights and triggers, never calendar commitments (NOF spirit applies to us too)
- Level 0: open PR, don't merge
