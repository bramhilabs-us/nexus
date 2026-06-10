# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — session 3 of 3, then founder review checkpoint)
**Task**: `N1-P2-08` — Teams + Planning mockups, Builder variant, Profile player card
**Why it's next**: founder merged #19 (mockups s2 incl. the PQ-4 flashcard deck) and #20 (4-CUSTOMER tier) on 2026-06-10 — session 3 is unblocked and completes the mockup set, triggering the **founder review checkpoint** that unblocks N1-P4-01 (Path B intent).

**Standard Level-0 check**: `gh pr list` first — if a session-3 PR is already open, skip to **`N1-P3-01`** (0-BUSINESS/1-PRODUCT population, M, last independent READY item; pre-scan what those folders already hold and define files to ADD, not duplicate; ambiguous split → clarifications). If both are in flight → journal a no-op with the wait reason.

**Session 3 scope**:
- `teams.html` — people fabric per contract: Invite member primary CTA, tiles (onboarded vs invited, members per team, assessment participation), empty state "Invite your team — objectives need owners"
- `planning.html` — Worker home per contract: Add milestone/task CTA (context-dependent), current-milestone tiles (tasks done vs planned, hours logged, completion streak), milestone→task list reading as "what do I do today" (NOT a Gantt chart), empty state "pick a key result and plan its first milestone"
- `dashboard-builder.html` — the mode flip demonstrated: same pulse tiles, program = the application being built, My Clients absent from nav, srishti add-on visible in account dropdown
- `profile.html` — the player card (PRODUCT_STRATEGY § player cards): skills/intrinsic motivations/interests as **tags, never prose** (fit thesis), role-per-program, assessment-fed fields marked ("from AIR Day 7")
- New components → DESIGN_LANGUAGE table first; mockups/README table updated
- **Seal step**: flip BACKLOG N1-P2-08 → NEEDS-FOUNDER-REVIEW (all 3 sessions done); the review feedback becomes the Night 3 build spec and unblocks N1-P4-01

**Cards to draw**: PRODUCT_STRATEGY §§ Teams/Planning + § player cards + § fit thesis · NOF.md (milestone/task semantics) · DESIGN_LANGUAGE component set · mockups/shell.css · client/css/tokens.css

**Definition of done (s3)**: 4 HTML files per contracts (one dominant CTA, ≤4 tiles, empty states); Profile is match-grade; hex scan = anchors only; every `var(--nx-*)` exists in tokens.css; README updated; validator green.

**Watch out for**:
- Planning is the most-used page by the most people (Workers) — calm beats dense
- Level 0: open PR, don't merge
- After s3: the founder review is the last gate before N1-P4-01 (contracts) and the Night 2 sprint draft
