# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — session 2 of 2–3)
**Task**: `N1-P2-08` — Objectives + Assessments mockups, including the **assessment flashcard deck** (PQ-4 exploration)
**Why it's next**: founder merged the whole night queue 2026-06-10 (#16 mockups s1, #17 user journeys, #18 delivery skeleton) — mockups session 2 is unblocked, `shell.css` is on main, and the flashcard deck is the founder's open interaction question (PQ-4), the most valuable thing to put in front of them at the review checkpoint.

**Standard Level-0 check**: `gh pr list` first — if a session-2 PR is already open and unmerged, skip to the next READY item (fallbacks: `N1-P3-03` 4-CUSTOMER skeleton, then `N1-P3-01` 0-BUSINESS/1-PRODUCT population). N1-P4-01 stays parked until the mockups founder review lands (Path B intent).

**Session 2 scope**:
- `objectives.html` — lifecycle board per contract: Create objective primary CTA (pre-seeded framing when arriving from Assessments), stage tiles (Identified/Handed off/Sustained), objective cards with KR lists + stage ribbons, assessment-driven empty state ("your assessment found these opportunities")
- `assessments.html` — pluggable shell per contract: typed Create-assessment CTA (*Create AIR Strategic Assessment*), block-defined analytics slots (AIR: evidence coverage, dimension scores, participants), gallery empty state
- `assessment-flashcards.html` — **PQ-4**: the "why this assessment, now" intro card + 2–3 question cards (different input types) + progress feel + flip/advance rhythm; calm, single-focus; one strong direction, alternatives in mock-notes
- New components (flashcard inputs, deck progress) added to DESIGN_LANGUAGE's component table in the same PR

**Cards to draw**: mockups/README.md + shell.css (conventions incl. mock-note separators) · PRODUCT_STRATEGY §§ Objectives/Assessments/delivery-experience + PQ-4 · DESIGN_LANGUAGE § Token table + component set · USER_JOURNEYS J2 (the taker journey the deck implements) · client/css/tokens.css

**Definition of done (session 2 slice)**:
- 3 HTML files implementing their contracts exactly (one dominant CTA, ≤4 tiles, empty states)
- Flashcard deck demonstrates: intro why-card, one question per card, advance rhythm, progress felt-not-dreaded — never looks like a numbered form
- Hex scan over mockups/ = only `href="#"` anchors; every `var(--nx-*)` exists in tokens.css
- mockups/README.md table updated; validator green

**Watch out for**:
- Level 0: open PR, don't merge; never stack onto an unmerged branch
- Session 3 (after): Teams + Planning + Builder variants + Profile player card → full founder review checkpoint
