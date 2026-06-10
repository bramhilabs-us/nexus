# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — session 2 of 2–3)
**Task**: `N1-P2-08` — Objectives + Assessments mockups, including the **assessment flashcard deck** (PQ-4 exploration)
**Why it's next**: session 1 landed the shell + My Clients + Dashboard (tick 2026-06-10-12). The flashcard deck is the founder's open interaction question (PQ-4) — the most valuable thing to put in front of them at the review checkpoint.

**Level-0 gate**: run `gh pr list` first. If the session-1 mockups PR is still open, session 2 would stack on it — **skip** and pick the next READY item with no in-flight dependency (`N1-P2-05` user journeys → then N1-P3-02, N1-P3-03). Mockup sessions resume after the morning merge.

**Session 2 scope**:
- `objectives.html` — lifecycle board per contract: Create objective primary CTA (pre-seeded from assessment framing), stage tiles (Identified/Handed off/Sustained), objective cards with KR lists + stage ribbons, assessment-driven empty state ("your assessment found these opportunities")
- `assessments.html` — pluggable shell per contract: Create AIR Strategic Assessment primary CTA (typed per installed block), block-defined analytics slots, gallery empty state
- `assessment-flashcards.html` — **PQ-4**: the "why this assessment, now" intro card + 2–3 question cards (different input types) + progress feel + flip/advance rhythm. Calm, single-focus. This is exploration — offer one strong direction, note alternatives in mock-notes.
- Reuse `shell.css`; extend only by adding components to DESIGN_LANGUAGE first (component-set rule)

**Cards to draw**:
- `design/mockups/README.md` + `shell.css` (what exists; conventions incl. mock-note separators)
- `PRODUCT_STRATEGY.md` § Objectives, § Assessments, § delivery experience (flashcards never surveys; three moments: first-time / recurring / pulse), PQ-4
- `DESIGN_LANGUAGE.md` § Token table + component set (Flashcard is declared there)
- `client/css/tokens.css`

**Definition of done (session 2 slice)**:
- 3 HTML files implementing their contracts exactly (one dominant CTA, ≤4 tiles, empty states)
- Flashcard deck demonstrates: intro why-card, one question per card, advance rhythm, progress felt-not-dreaded
- `grep -rE '#[0-9a-fA-F]{3,8}' mockups/` → only `href="#"` anchors; every `var(--nx-*)` exists in tokens.css
- mockups/README.md table updated; validator green

**Watch out for**:
- Flashcards are never survey forms — if it looks like a numbered form, start over
- New components (flashcard answer inputs, deck progress) must be added to DESIGN_LANGUAGE's component table in the same PR
- Level 0: open PR, don't merge; never stack onto an unmerged branch
- Session 3 (after): Teams + Planning + Builder variants + Profile player card → then founder review checkpoint
