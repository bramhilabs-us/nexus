# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: strategy/docs (last independent Night-1 item) — **with a Level-0 gate**
**Task**: `N1-P3-01` — Populate 0-BUSINESS and 1-PRODUCT (Transformation OS framing)

**Gate**: `gh pr list` first.
- If the mockups-s3 PR (tick-17) is the only open PR → N1-P3-01 is safe (no overlap with mockups).
- If an N1-P3-01 PR is already open → **everything READY is in flight or review-gated: journal a no-op** naming the two waits (founder mockup review → unblocks N1-P4-01; PR merges) and exit cleanly.
- **N1-P2-08 is NEEDS-FOUNDER-REVIEW** — do not touch mockups until the founder responds (their feedback may add a session-4 fixes pass).

**N1-P3-01 — read this first**: the BACKLOG DoD ("4 files each in 0-BUSINESS/ and 1-PRODUCT/") predates the strategy pack — several of those files now EXIST (AI_CONSULTING_PLAYBOOK, BOQ_FRAMEWORK in 0-BUSINESS; PRODUCT_STRATEGY, NOF, design/ in 1-PRODUCT). **Pre-scan both folders and define the gap**, e.g. 0-BUSINESS: positioning/GTM one-pager, stakeholders, business model; 1-PRODUCT: capabilities map, roadmap. If the gap genuinely isn't 4+4, write what's missing and re-state the DoD in the PR (re-sum rule). Ambiguity about which files the founder still wants → clarifications + pick next (which would be the no-op above).

**Cards to draw**: 00_NORTH_STAR.md · AI_CONSULTING_PLAYBOOK.md · BOQ_FRAMEWORK.md · PRODUCT_STRATEGY.md · the existing folder contents (ls both)

**Definition of done (per BACKLOG, re-scoped to the gap)**:
- New files lead with "Transformation OS"; AI Readiness as launch vertical; both GTM motions (consultant-led + org-direct)
- Karvia adaptations cited; TODOs flagged where untranslatable
- Every new doc genome-wired (parents from the relevant strategy card); validator green

**Watch out for**:
- Don't duplicate the strategy pack — these are the *operational* T0/T1 docs the pack anticipated, not rewrites of it
- Level 0: open PR, don't merge
- **Founder TODO (review checkpoint!)**: open the 10 mockup surfaces in a browser — my-clients, dashboard (+ builder), objectives, assessments, assessment-flashcards (PQ-4), teams, planning, profile. Your feedback = the Night 3 build spec; it unblocks N1-P4-01 and closes out Night 1.
