# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — session 2 of 2–3) — **with a Level-0 gate, read first**
**Task**: `N1-P2-08` — Objectives + Assessments mockups, including the **assessment flashcard deck** (PQ-4 exploration)

**Gate**: run `gh pr list` first.
- **PR #16 (mockups s1) merged** → proceed with session 2 (scope below; reuse `shell.css` from main).
- **PR #16 still open** → pick **`N1-P3-03` — 4-CUSTOMER skeleton** instead (S, READY, no in-flight deps; DoD: INTERVIEW_TEMPLATE.md, FEEDBACK_LOG.md, EVIDENCE_INDEX.md, METRICS.md templates in `NEXUS_STRATEGY/4-CUSTOMER/`; draw PRODUCT_STRATEGY § Feedback meta-loop + § first-value journey metrics, AI_CONSULTING_PLAYBOOK § interview matrix + deliverables, BOQ_FRAMEWORK signal layer; wire as children of… check the registry — 4-CUSTOMER has no parent doc yet, likely children of NORTH_STAR or PRODUCT_STRATEGY; pick the cleanest single parent and note it in the PR).
- After N1-P3-03, the only fully-independent READY item left is **N1-P3-01** (0-BUSINESS/1-PRODUCT population, M) — then the queue genuinely needs the morning merges (mockups s2/s3 need #16; N1-P4-01 waits on the mockups founder review by Path B intent).
- In-flight as of this card: #16 (mockups s1), #17 (user journeys), tick-14's delivery-skeleton PR.

**Session 2 scope (when #16 is merged)**:
- `objectives.html` — lifecycle board per contract: Create objective primary CTA, stage tiles, objective cards with KR lists + stage ribbons, assessment-driven empty state
- `assessments.html` — pluggable shell per contract: typed Create-assessment CTA, block-defined analytics slots, gallery empty state
- `assessment-flashcards.html` — **PQ-4**: why-card → 2–3 question cards (different input types) → progress feel, flip/advance rhythm; one strong direction, alternatives in mock-notes
- New components added to DESIGN_LANGUAGE's component table in the same PR

**Cards to draw**: mockups/README.md + shell.css · PRODUCT_STRATEGY §§ Objectives/Assessments/delivery-experience + PQ-4 · DESIGN_LANGUAGE § Token table + component set · USER_JOURNEYS J2 · client/css/tokens.css

**Definition of done (session 2 slice)**: 3 HTML files implementing contracts exactly; flashcards never look like a form; hex scan = only `href="#"` anchors; every `var(--nx-*)` exists in tokens.css; mockups/README table updated; validator green.

**Watch out for**:
- Level 0: open PR, don't merge; never stack onto an unmerged branch
- Morning human TODO (queue-unblocking order): merge **#16** first (opens mockups s2+s3), then #17, then tick-14's PR
