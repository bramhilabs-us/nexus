# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — session 3 of 3, then founder review checkpoint)
**Task**: `N1-P2-08` — Teams + Planning mockups, Builder variants, Profile player card
**Why it's next**: sessions 1–2 covered shell + 5 surfaces incl. the PQ-4 flashcard deck. Session 3 completes the set and triggers the **founder review checkpoint** — the gate for N1-P4-01 contracts (Path B intent).

**Level-0 gate**: `gh pr list` first. If the session-2 PR (tick-15) is still open → don't stack; pick **`N1-P3-03` — 4-CUSTOMER skeleton** (S, READY: INTERVIEW_TEMPLATE/FEEDBACK_LOG/EVIDENCE_INDEX/METRICS templates in `NEXUS_STRATEGY/4-CUSTOMER/`; draw PRODUCT_STRATEGY § Feedback meta-loop + § metrics, AI_CONSULTING_PLAYBOOK § interview matrix + deliverables; pick the cleanest single graph parent — likely PRODUCT_STRATEGY — and note it in the PR). Next fallback after that: `N1-P3-01` (M).

**Session 3 scope**:
- `teams.html` — people fabric per contract: Invite member primary CTA, tiles (onboarded vs invited, per team, assessment participation), empty state "objectives need owners"
- `planning.html` — weekly rhythm per contract (Worker home): Add milestone/task primary CTA (context-dependent), current-milestone tiles (tasks done/planned, hours logged, streak), milestone→task board, empty state "pick a KR, plan its first milestone"
- **Builder variants** (per BACKLOG DoD: My Clients hides, Dashboard/Assessments re-skinned for product teams) — one `dashboard-builder.html` showing the mode flip is enough to demonstrate; note in README
- `profile.html` — the player card (PRODUCT_STRATEGY § player cards): who the player is — skills/motivations/interests as **tags, never prose** (the fit thesis), role-per-program, assessment-fed fields marked
- mockups/README table updated; any new component → DESIGN_LANGUAGE first

**Cards to draw**: PRODUCT_STRATEGY §§ Teams/Planning contracts + § player cards + § fit thesis · NOF.md (milestone/task semantics for Planning) · DESIGN_LANGUAGE component set · mockups/shell.css · client/css/tokens.css

**Definition of done (session 3 slice)**: 4 HTML files per contracts (one dominant CTA, ≤4 tiles, empty states); Profile captures match-grade tags not prose; hex scan = only `href="#"` anchors; tokens all exist; README updated; validator green. **Then**: BACKLOG flips N1-P2-08 to NEEDS-FOUNDER-REVIEW; the review feedback becomes the Night 3 build spec and unblocks N1-P4-01.

**Watch out for**:
- Planning page is the Worker's home — it must read like "what do I do today", not a Gantt chart
- Level 0: open PR, don't merge; never stack onto an unmerged branch
- Morning human TODO: review the session-2 PR — especially `assessment-flashcards.html` (PQ-4: direction + 3 alternatives noted in the closing mock-note)
