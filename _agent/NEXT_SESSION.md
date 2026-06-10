# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — session 2 of 2–3) — **with a Level-0 gate, read first**
**Task**: `N1-P2-08` — Objectives + Assessments mockups, including the **assessment flashcard deck** (PQ-4 exploration)

**Gate**: run `gh pr list` first.
- **PR #16 (mockups s1) merged** → proceed with session 2 below (reuse `shell.css` from main).
- **PR #16 still open** → session 2 would stack on it; pick **`N1-P3-02` — 3-DELIVERY skeleton** instead (S, READY, no in-flight deps; DoD: SPRINT_PROCESS.md, RELEASE_PROCESS.md, CI_CD.md written in `NEXUS_STRATEGY/3-DELIVERY/`; draw EXECUTION_PLAYBOOK + IMPROVEMENT_PLAN (the per-PR gate checklist becomes CI), wire each as a graph child of EXECUTION_PLAYBOOK; adapt Karvia `_source/` process docs, cite what changed). Next fallbacks after that: N1-P3-03 (4-CUSTOMER skeleton), N1-P3-01 (0-BUSINESS/1-PRODUCT population).
- The user-journeys PR (tick-13) is also in flight — nothing in the fallbacks depends on it.
- **N1-P4-01 stays parked** until the mockups founder review lands (Path B intent: review feedback feeds the contracts), even though its four T2 inputs are all merged.

**Session 2 scope (when #16 is merged)**:
- `objectives.html` — lifecycle board per contract: Create objective primary CTA, stage tiles (Identified/Handed off/Sustained), objective cards with KR lists + stage ribbons, assessment-driven empty state
- `assessments.html` — pluggable shell per contract: Create AIR Strategic Assessment primary CTA (typed per installed block), block-defined analytics slots, gallery empty state
- `assessment-flashcards.html` — **PQ-4**: why-card → 2–3 question cards (different input types) → progress feel, flip/advance rhythm; one strong direction, alternatives in mock-notes
- New components (flashcard inputs, deck progress) added to DESIGN_LANGUAGE's component table in the same PR

**Cards to draw**: mockups/README.md + shell.css (conventions) · PRODUCT_STRATEGY §§ Objectives/Assessments/delivery-experience + PQ-4 · DESIGN_LANGUAGE § Token table + component set · USER_JOURNEYS J2 (the taker journey the deck implements) · client/css/tokens.css

**Definition of done (session 2 slice)**: 3 HTML files implementing contracts exactly (one dominant CTA, ≤4 tiles, empty states); flashcards never look like a form; hex scan = only `href="#"` anchors; every `var(--nx-*)` exists in tokens.css; mockups/README table updated; validator green.

**Watch out for**:
- Level 0: open PR, don't merge; never stack onto an unmerged branch
- Session 3 (after): Teams + Planning + Builder variants + Profile player card → founder review checkpoint
- Morning human TODO: review + merge PR #16 (open the HTML files in a browser), then the tick-13 user-journeys PR
